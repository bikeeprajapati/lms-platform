require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';
import { redis } from './redis';

interface ITokenOptions {
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none' | undefined;
    secure: boolean;
}

export const sendToken = (user: IUser, res: Response, statusCode: number) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '15');
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '7');

    // Store the full user object (minus password) in Redis, keyed by user id
    redis.set(
        `session:${user._id}`,
        JSON.stringify(user),
        'EX',
        refreshTokenExpire * 24 * 60 * 60
    );

    const accessTokenOptions: ITokenOptions = {
        maxAge: accessTokenExpire * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    };

    const refreshTokenOptions: ITokenOptions = {
        maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
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