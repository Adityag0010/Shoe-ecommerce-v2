import dotenv from "dotenv";

dotenv.config();

import express from "express";
import connectDB from "./db/connectDB.js";
import routes from "./routes/route-combiner.js";
import { logger } from "./utils/logger.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

connectDB();

const app = express();
const allowedOrigins = [
  "https://shoe-ecommerce-mu.vercel.app",
  "https://urbansole-pi.vercel.app",
  "https://localhost:5137",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function(origin, callback){

      if(!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(new Error(`CORS blocked: ${origin}`), false);
      }

      callback(null, true);
    },
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(helmet());
app.use(express.json());
app.use(logger);
app.use(cookieParser());
app.use("/api/", apiLimiter);

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send(" Shoe E-Commerce API is running...");
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;