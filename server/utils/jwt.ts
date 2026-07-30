require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';
import { redis } from './redis';
import { config } from 'dotenv';

interface ITokenOptions {
    expiresIn: string;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none' | undefined;
    secure: boolean;

}

export const sendToken = (user: IUser, res: Response, statusCode: number) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

//parse environment variables to  integrates with fallback value
    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '15'); // Default to 15 minutes
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '7'); // Default to 7 days

    //upload session data to redis
    redis.set(`session:${user._id}`, JSON.stringify({ accessToken, refreshToken }), 'EX', refreshTokenExpire * 24 * 60 * 60); // Set expiration in seconds

    //options for cookies
    const accessTokenOptions: ITokenOptions = {
        expiresIn: `${accessTokenExpire}d`,
        maxAge: accessTokenExpire * 24 * 60 * 60 * 1000, // Convert days to milliseconds
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // Set to true in production
    };
    
    const refreshTokenOptions: ITokenOptions = {
        expiresIn: `${refreshTokenExpire}d`,
        maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // Convert days to milliseconds
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // Set to true in production
    };
    res.cookie('accessToken', accessToken, accessTokenOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);
    
    res.status(statusCode).json({
        success: true,
        message: 'Login successful',
        accessToken,
        refreshToken,
    });
}