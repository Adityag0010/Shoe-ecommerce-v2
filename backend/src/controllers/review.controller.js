import { Review } from "../models/model-export.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getMyReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ userId: req.user.id }).populate("productId");
    res.status(200)
    .json(
        new ApiResponse(
            200,
            "Reviews fetched successfully", 
            reviews
        )
    );
});
