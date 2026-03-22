import { ApiResponse } from "../utils/ApiResponse.js";

export const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let isApiError = false;

    // Check if error is our custom ApiError manually or implicitly
    if (err.success === false && typeof err.statusCode === "number") {
        isApiError = true;
    }

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
        const messageList = Object.values(err.errors).map(val => val.message);
        message = messageList.join(', ');
        statusCode = 400;
        isApiError = true;
    }

    // Handle mongoose duplicate key error
    if (err.code === 11000) {
        message = `Duplicate field value entered`;
        statusCode = 400;
        isApiError = true;
    }

    if (!isApiError || statusCode === 500) {
        console.error("❌ Unhandled Error:", err);
        if (process.env.NODE_ENV !== "production") {
            console.error("❌ Error Stack:", err.stack);
        }
    }

    // We can rely on the cors middleware added in app.js for CORS headers
    // so we don't need to manually inject them here again unless requested pre-flight fails

    res.status(statusCode).json(
        new ApiResponse(
            statusCode,
            message,
            process.env.NODE_ENV === "production"
                ? { stack: null } // Hide stack in production
                : { stack: err.stack, errors: err.errors || [] } // Show stack and sub-errors in dev
        )
    );
};

