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


// get all users, sorted newest first (used by getAllUsers controller, admin only)
export const getAllUsersService = async () => {
    const users = await User.find().sort({ createdAt: -1 });
    return users;
};

// update a user's role by email, refresh their Redis session, and return the updated user
export const updateUserRoleService = async (email: string, role: string) => {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        return null;
    }

    const user = await User.findByIdAndUpdate(
        isUserExist._id,
        { role },
        { new: true }
    );

    if (user) {
        await redis.set(`session:${user._id}`, JSON.stringify(user));
    }

    return user;
};

// delete a user by id, and clean up their Redis session
export const deleteUserService = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        return null;
    }

    await user.deleteOne({ _id: id });
    await redis.del(`session:${id}`);

    return user;
};