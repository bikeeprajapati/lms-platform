require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncErrors } from '../middleware/catchAsyncErrors';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendMail';

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