require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncErrors } from '../middleware/catchAsyncErrors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sendEmail from '../utils/sendMail';
import { IUser } from '../models/user.model';
import { sendToken } from '../utils/jwt';
import { redis } from '../utils/redis';
import { getUserById } from "../services/user.service";

interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const registrationUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, avatar } = req.body;

        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler('Email already exists', 400));
        }

        const user: IRegistrationBody = {
            name,
            email,
            password,
            avatar,
        };

        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;

        await sendEmail({
            email: user.email,
            subject: 'Activate your account',
            template: 'activation-mail',
            data: [
                { key: 'user', value: { name: user.name } },
                { key: 'activationCode', value: activationCode },
            ],
        });

        res.status(200).json({
            success: true,
            message: `Activation code sent to ${user.email}`,
            activationToken: activationToken.token,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET!, { expiresIn: '5m' });
    return { token, activationCode };
};

//activate user account
interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code }: IActivationRequest = req.body;
        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET!) as {
            user: IUser;
            activationCode: string;
        };

        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler('Invalid activation code', 400));
        }

        const { name, email, password, avatar } = newUser.user;

        const existUser = await User.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler('Email already exists', 400));
        }

        const user = await User.create({
            name,
            email,
            password,
            isVerified: true,
            avatar: avatar || {
                public_id: 'default-avatar',
                url: 'https://res.cloudinary.com/demo/image/upload/v1710000000/default-avatar.png',
            },
        });

        res.status(201).json({
            success: true,
            message: 'Account activated successfully',
            user,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//login user
interface ILoginRequest {
    email: string;
    password: string;
}

export const loginUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: ILoginRequest = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        user.password = undefined as any;
        sendToken(user, res, 200);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//logout user
export const logoutUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        const userId = (req as any).user?._id || '';
        await redis.del(`session:${userId}`);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//update access token
export const updateAccessToken = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refreshToken as string;

        if (!refresh_token) {
            return next(new ErrorHandler('Please login to access this resource', 401));
        }

        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN || '') as JwtPayload;

        if (!decoded) {
            return next(new ErrorHandler('Could not refresh token', 400));
        }

        const session = await redis.get(`session:${decoded.id}`);

        if (!session) {
            return next(new ErrorHandler('Please login to access this resource', 401));
        }

        const user = JSON.parse(session);

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN || '', {
            expiresIn: '5m',
        });

        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN || '', {
            expiresIn: '3d',
        });

        (req as any).user = user;

        res.cookie('accessToken', accessToken, {
            maxAge: 5 * 60 * 1000, // 5 minutes
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        // refresh the Redis session expiry too (sliding session)
        await redis.set(`session:${user._id}`, JSON.stringify(user), 'EX', 3 * 24 * 60 * 60);

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//get user info
export const getUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id;
        getUserById(userId, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//social auth
interface ISocialAuthBody {
    email: string;
    name: string;
    avatar: string;
}

export const socialAuth = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, avatar }: ISocialAuthBody = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            const newUser = await User.create({
                email,
                name,
                avatar: {
                    public_id: 'social-auth',
                    url: avatar,
                },
                isVerified: true, // social accounts are pre-verified by the provider
            });
            sendToken(newUser, res, 200);
        } else {
            sendToken(user, res, 200);
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//update user info
interface IUpdateUserInfo {
    name?: string;
    email?: string;
}

export const updateUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email }: IUpdateUserInfo = req.body;

        const userId = (req as any).user?._id;
        const user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        if (email && email !== user.email) {
            const isEmailExist = await User.findOne({ email });
            if (isEmailExist) {
                return next(new ErrorHandler('Email already exists', 400));
            }
            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        await user.save();

        // refresh the Redis session so /me and future requests reflect the update
        await redis.set(`session:${userId}`, JSON.stringify(user));

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});