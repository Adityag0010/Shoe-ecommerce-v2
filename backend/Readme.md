# UrbanSole Node.js API Backend

This is the Express backend logic for the UrbanSole eCommerce platform. It handles authentications via short/long JWT tokens, Stripe payment processing securely, Resend email triggers, rate-limited and cached querying for products, and Cloudinary WebP buffer formatting via Multer.

## Capabilities

* **Security**: `Helmet` & `express-rate-limit` protect the REST endpoints.
* **Speed**: Fast memory querying applied to generic views via `lru-cache`. Indexed MongoDB.
* **Storage**: Streams binary objects directly to `Cloudinary` using optimized formats.
* **Emails**: Hooks up via the async `Resend` provider for 100% deliverability.
* **Logging**: Outfitted with robust local file-rolling analytics via `Winston`.

## Running the API Locally

1. **Initialize the repository:**
   ```bash
   npm install
   ```
2. **Setup the `.env` configuration:**
   Copy the provided `.env.example` file and configure it appropriately. Ensure you have your `MongoDB` URI, `Cloudinary`, `Stripe`, and `Resend` keys available.
   ```bash
   cp .env.example .env
   ```
3. **Launch the Node Server:**
   This starts the environment in `dev` mode with `nodemon` listening for file changes automatically.
   ```bash
   npm run dev
   ```

## Production Guidelines

When hosting this API on a Virtual Private Server (VPS) or Web Service provider like Render/Heroku, be absolutely certain to update the `allowedOrigins` array inside `src/server.js` with your specific Frontend Website domains.

CORS policies will actively block requests from unknown origins.
