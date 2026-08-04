import { Response } from "express";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";

// create a course and send the response (used by uploadCourse controller)
export const createCourse = async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course,
    });
};

// get all courses, sorted newest first (used by getAllCourses controller)
export const getAllCoursesService = async (res: Response) => {
    const courses = await CourseModel.find().sort({ createdAt: -1 });

    res.status(201).json({
        success: true,
        courses,
    });
};

// delete a course by id, and clean up its Redis cache
export const deleteCourseService = async (id: string) => {
    const course = await CourseModel.findById(id);

    if (!course) {
        return null;
    }

    await course.deleteOne({ _id: id });
    await redis.del(id);
    await redis.del('allCourses');

    return course;
};