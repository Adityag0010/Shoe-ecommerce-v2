import { Resend } from 'resend';

// Configure Resend with API key from environment
// Make sure to add RESEND_API_KEY to your .env file
const resend = new Resend(process.env.RESEND_API_KEY || 're_default');

export const sendOrderConfirmationEmail = async (email, orderDetails) => {
  try {
    const { orderId, totalAmount, items } = orderDetails;
    
    // Create an HTML string for the items 
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || 'Shoe'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Thank you for shopping at Urban Sole!</p>
        <p>Your order <strong>#${orderId}</strong> has been confirmed and is being processed.</p>
        
        <h3 style="margin-top: 20px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; background-color: #f5f5f5;">Item</th>
              <th style="text-align: left; padding: 10px; background-color: #f5f5f5;">Qty</th>
              <th style="text-align: left; padding: 10px; background-color: #f5f5f5;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px; font-weight: bold;">Total:</td>
              <td style="padding: 10px; font-weight: bold;">$${totalAmount}</td>
            </tr>
          </tfoot>
        </table>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          You can track your order status in your account dashboard.
        </p>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Urban Sole Orders <orders@urbansole.com>', // Replace with your verified domain
      to: email, // Can only send to verified emails if using free Resend tier without verified domain
      subject: `Order Confirmation - ${orderId}`,
      html: htmlContent,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // We don't want to throw an error that breaks the checkout flow
    return { success: false, error };
  }
};
