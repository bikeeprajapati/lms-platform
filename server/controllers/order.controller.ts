require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncErrors } from '../middleware/catchAsyncErrors';
import CourseModel from '../models/course.model';
import User from '../models/user.model';
import NotificationModel from '../models/notification.model';
import sendMail from '../utils/sendMail';
import { redis } from '../utils/redis';
import { newOrder, getAllOrdersService } from '../services/order.service';

// ------------------- Create Order -------------------
interface IOrderCreateData {
    courseId: string;
    payment_info: object;
}

export const createOrder = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info }: IOrderCreateData = req.body;

        const userId = (req as any).user?._id;
        const user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // prevent duplicate purchase
        const courseExistInUser = user.courses.some(
            (course: any) => course._id?.toString() === courseId
        );
        if (courseExistInUser) {
            return next(new ErrorHandler('You have already purchased this course', 400));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler('Course not found', 404));
        }

        const data: any = {
            courseId: course._id,
            userId: user._id,
            payment_info,
        };

        const order = await newOrder(data);

        // send confirmation email
        try {
            await sendMail({
                email: user.email,
                subject: 'Order Confirmation',
                template: 'order-confirmation',
                data: [
                    { key: 'name', value: user.name },
                    { key: 'courseName', value: course.name },
                    { key: 'price', value: course.price },
                    { key: 'orderId', value: (order._id as any).toString().slice(0, 8) },
                    { key: 'courseUrl', value: `${process.env.ORIGIN || 'http://localhost:3000'}/course/${course._id}` },
                ],
            });
        } catch (error: any) {
            console.error('Order confirmation email failed:', error.message);
            // don't fail the whole order just because the email had an issue
        }

        // add the course to the user's account
        user.courses.push({ _id: course._id } as any);
        await user.save();

        // refresh Redis session so the user's course list reflects immediately
        await redis.set(`session:${user._id}`, JSON.stringify(user));

        // notify admin of the new purchase
        await NotificationModel.create({
            userId: (user._id as any).toString(),
            title: 'New Order',
            message: `${user.name} has purchased "${course.name}"`,
        });

        // increment the course's purchase count
        course.purchased = (course.purchased || 0) + 1;
        await course.save();

        // invalidate course cache since purchase count changed
        await redis.del((course._id as any).toString());
        await redis.del('allCourses');

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// ------------------- Get All Orders (admin only) -------------------
export const getAllOrders = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await getAllOrdersService();

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});