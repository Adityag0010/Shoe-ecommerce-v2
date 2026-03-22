import { Order, OrderItem, OrderStatusHistory } from "../models/model-export.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendOrderConfirmationEmail } from "../utils/email.service.js";

export const createOrder = asyncHandler(async (req, res) => {
    const { items, totalAmount } = req.body;

    const order = await Order.create({
        userId: req.user.id,
        totalAmount,
    });

    const orderItems = await Promise.all(
        items.map((item) =>
            OrderItem.create({ ...item, orderId: order._id })
        )
    );

    await OrderStatusHistory.create({
        orderId: order._id,
        status: "pending",
    });

    // Populate the order items to get full product details
    const populatedOrderItems = await OrderItem.find({ orderId: order._id }).populate({
        path: 'productId',
        select: 'name brand price' // Fetching necessary product details
    });
    // const populatedOrderItems = await OrderItem.find({ orderId: order._id }).populate({
    //     path: 'productId',
    //     select: 'name brand price' // Fetching necessary product details
    // });

    // console.log('populatedorderitems   ',populatedOrderItems);
    

    const fullOrder = {
        _id: order._id,
        items: populatedOrderItems,
        totalAmount,
    };

    // console.log('full order : ',fullOrder);
    
    // sendOrderEmail now receives a full order object with product details
    // We are now using Resend to send confirmation emails via email.service.js
    const normalizedItems = populatedOrderItems.map(item => ({
        name: item.productId?.name,
        quantity: item.quantity,
        price: item.price
    }));

    await sendOrderConfirmationEmail(req.user.email, {
        orderId: order._id,
        totalAmount,
        items: normalizedItems
    });

    res.status(201).json(
        new ApiResponse(201, "Order created successfully", {
            order,
            items: populatedOrderItems,
        })
    );
});

export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

    const ordersWithDetails = await Promise.all(orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate({
            path: 'productId',
            populate: {
                path: 'imageSet',
                model: 'ProductImage'
            }
        });

        let totalItems = 0;
        let firstItemImage = null;

        if (items.length > 0) {
            totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
            firstItemImage = items[0].productId?.imageSet?.thumbnail;
        }

        return {
            ...order.toObject(),
            totalItems,
            firstItemImage
        };
    }));

    res.status(200).json(
        new ApiResponse(
            200,
            "Orders fetched successfully",
            ordersWithDetails
        )
    );
});