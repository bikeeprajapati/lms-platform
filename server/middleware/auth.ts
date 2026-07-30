import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

export const isAuthenticated = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken as string;

    if (!accessToken) {
      return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN || "") as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 401));
    }

    const session = await redis.get(`session:${decoded.id}`);
    if (!session) {
      return next(new ErrorHandler("Please login to access this resource", 401));
    }

    (req as any).user = { _id: decoded.id };
    next();
  }
);
