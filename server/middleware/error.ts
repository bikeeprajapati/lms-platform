import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

type AppError = Error & {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, unknown>;
    path?: string;
    name?: string;
};

export default function errorMiddleware(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let error: AppError = err;

    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal Server Error";

    // wrong mongoose object id error
    if (error.name === "CastError") {
        const message = `Resource not found. Invalid: ${error.path}`;
        error = new ErrorHandler(message, 400) as AppError;
    }

    // mongoose duplicate key error
    if (error.code === 11000) {
        const message = `Duplicate ${Object.keys(error.keyValue ?? {})} entered`;
        error = new ErrorHandler(message, 400) as AppError;
    }

    // wrong jwt error
    if (error.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid. Try again";
        error = new ErrorHandler(message, 400) as AppError;
    }

    // jwt expired error
    if (error.name === "TokenExpiredError") {
        const message = "JSON Web Token is expired. Try again";
        error = new ErrorHandler(message, 400) as AppError;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
    });
}
