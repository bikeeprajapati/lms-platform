import { Response } from "express";
import User from "../models/user.model";
import { redis } from "../utils/redis";
//get user by id 
export const getUserById = async (id: string, res: Response) => {
    // Try Redis first (fast path, avoids hitting MongoDB on every request)
    const userJson = await redis.get(`session:${id}`);

    if (userJson) {
        const user = JSON.parse(userJson);
        return res.status(200).json({
            success: true,
            user,
        });
    }

    // Fallback to MongoDB if not found in Redis (e.g. session expired but user still exists)
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        user,
    });
};