import { Router } from "express";
import { getAllUsers, getDashboardStats } from "../controllers/admin.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/users", getAllUsers);
router.get("/dashboard", getDashboardStats);

export default router;
