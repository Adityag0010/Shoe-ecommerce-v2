import express from "express";
import {
    createCoupon,
    getCoupons,
    validateCoupon,
    updateCoupon,
    deleteCoupon,
} from "../controllers/coupon.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// Admin routes (add admin middleware check in production if exists)
router.route("/").post(createCoupon).get(getCoupons);
router.route("/:id").put(updateCoupon).delete(deleteCoupon);

// User verification route
router.route("/validate/:code").get(validateCoupon);

export default router;
