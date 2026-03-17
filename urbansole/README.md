# UrbanSole React Frontend

This folder contains the UI/UX components for the UrbanSole eCommerce platform. It handles user authentication, product catalogs, shopping carts, checkout logic, and the advanced Admin Dashboard analytics.

## Tech Stack
* **Framework**: React.js with Vite
* **Styling**: Tailwind CSS / Custom CSS Modules
* **Charts**: Recharts (for the Admin Dashboard)
* **SEO**: `react-helmet-async` for optimized, dynamic meta tags
* **Performance**: Code Split dynamically via `React.lazy()` and `Suspense`
* **Icons & UI**: Lucide React, React Icons

## Getting Started Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Setup Environment variables:**
   Create a `.env` file referencing `.env.example` in this directory if applicable and put the live backend URL or development `localhost` URL inside.
3. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Production Building
To prepare exactly how this code behaves in Vercel or cloud deployments, you can run the build script locally.

```bash
npm run build
```
This produces the highly optimized, minified `dist/` directory using Rollup optimizations.
