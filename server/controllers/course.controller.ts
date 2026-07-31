require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncErrors } from '../middleware/catchAsyncErrors';
import cloudinary from '../utils/cloudinary';
import CourseModel from '../models/course.model';
import { redis } from '../utils/redis';
import { createCourse } from '../services/course.service';

// ------------------- Create Course (admin only) -------------------
export const uploadCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if (thumbnail) {
            const myCloud = await cloudinary.uploader.upload(thumbnail, {
                folder: 'courses',
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        await createCourse(data, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// ------------------- Edit Course (admin only) -------------------
export const editCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if (thumbnail) {
            // remove old thumbnail before uploading a new one
            await cloudinary.uploader.destroy(thumbnail.public_id);

            const myCloud = await cloudinary.uploader.upload(thumbnail, {
                folder: 'courses',
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        const courseId = req.params.id;

        const course = await CourseModel.findByIdAndUpdate(
            courseId,
            { $set: data },
            { new: true }
        );

        res.status(201).json({
            success: true,
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// ------------------- Get Single Course (public, no sensitive data) -------------------
export const getSingleCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id as string;

        const isCacheExist = await redis.get(courseId);

        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            return res.status(200).json({
                success: true,
                course,
            });
        }

        const course = await CourseModel.findById(courseId).select(
            '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links'
        );

        if (!course) {
            return next(new ErrorHandler('Course not found', 404));
        }

        await redis.set(courseId, JSON.stringify(course), 'EX', 604800);

        res.status(200).json({
            success: true,
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// ------------------- Get All Courses (public, no sensitive data) -------------------
export const getAllCourses = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isCacheExist = await redis.get('allCourses');

        if (isCacheExist) {
            const courses = JSON.parse(isCacheExist);
            return res.status(200).json({
                success: true,
                courses,
            });
        }

        const courses = await CourseModel.find().select(
            '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links'
        );

        await redis.set('allCourses', JSON.stringify(courses));

        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// ------------------- Get Course Content (for purchased users only) -------------------
export const getCourseByUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = (req as any).user?.courses;
        const courseId = req.params.id as string;

        const courseExists = userCourseList?.find(
            (course: any) => course._id?.toString() === courseId
        );

        if (!courseExists) {
            return next(new ErrorHandler('You are not eligible to access this course', 404));
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler('Course not found', 404));
        }

        const content = course.courseData;

        res.status(200).json({
            success: true,
            content,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});