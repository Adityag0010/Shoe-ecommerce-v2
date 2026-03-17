import { Coupon } from "../models/coupon.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// @desc    Create a new coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountType, discountValue, minOrderAmount, endDate, usageLimit } = req.body;

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
        throw new ApiError(400, "Coupon code already exists");
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minOrderAmount,
        endDate,
        usageLimit,
    });

    res.status(201).json(new ApiResponse(201, "Coupon created successfully", coupon));
});

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.status(200).json(new ApiResponse(200, "Coupons retrieved successfully", coupons));
});

// @desc    Validate a coupon code
// @route   GET /api/v1/coupons/validate/:code
// @access  Private
export const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const { cartTotal } = req.query;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
        throw new ApiError(404, "Invalid or inactive coupon code");
    }

    if (new Date(coupon.endDate) < new Date()) {
        throw new ApiError(400, "Coupon has expired");
    }

    if (coupon.usageLimit <= 0) {
        throw new ApiError(400, "Coupon usage limit reached");
    }

    if (cartTotal && cartTotal < coupon.minOrderAmount) {
        throw new ApiError(400, `Minimum order amount of $${coupon.minOrderAmount} required`);
    }

    res.status(200).json(new ApiResponse(200, "Coupon is valid", coupon));
});

// @desc    Update coupon status or details
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
        throw new ApiError(404, "Coupon not found");
    }

    res.status(200).json(new ApiResponse(200, "Coupon updated successfully", updatedCoupon));
});

// @desc    Delete a coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
        throw new ApiError(404, "Coupon not found");
    }

    res.status(200).json(new ApiResponse(200, "Coupon deleted successfully", {}));
});
