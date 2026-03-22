import { User, Order, Product } from "../models/model-export.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'customer' }).select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, "Users fetched successfully", users));
});

const getDashboardStats = asyncHandler(async (req, res) => {
    // Calculate total sales and orders
    const orders = await Order.find();
    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = orders.length;

    // Calculate active users
    const activeUsers = await User.countDocuments({ role: 'customer' });

    // Calculate low stock items
    const lowStockItems = await Product.countDocuments({ stock: { $lt: 10 } });

    const stats = {
        totalSales,
        totalOrders,
        activeUsers,
        lowStockItems
    };

    return res.status(200).json(new ApiResponse(200, "Dashboard stats fetched successfully", stats));
});

export { getAllUsers, getDashboardStats };
