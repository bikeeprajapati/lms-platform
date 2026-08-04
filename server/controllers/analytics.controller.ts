require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncErrors } from '../middleware/catchAsyncErrors';
import { generateLast12MonthsData } from '../utils/analyticsGenerator';
import User from '../models/user.model';
import CourseModel from '../models/course.model';
import OrderModel from '../models/order.model';

// ------------------- User Analytics (admin only) -------------------
export const getUsersAnalytics = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData(User);

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// ------------------- Course Analytics (admin only) -------------------
export const getCoursesAnalytics = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await generateLast12MonthsData(CourseModel);

        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// ------------------- Order Analytics (admin only) -------------------
export const getOrdersAnalytics = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateLast12MonthsData(OrderModel);

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});