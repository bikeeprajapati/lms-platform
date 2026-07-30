require('dotenv').config();
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Model } from "mongoose";

const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{
        courseId: String;
    }>;
    comparePassword: (enteredPassword: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;

};

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            maxLength: [30, "Name cannot exceed 30 characters"],
            minLength: [4, "Name should have more than 4 characters"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            validate: {
                validator: function (email: string) {
                    return EmailRegex.test(email);
                },
                message: "Please enter a valid email address",
            },
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minLength: [8, "Password should be greater than 8 characters"],
            select: false,
        },
        avatar: {
            public_id: {
                type: String,
                required: true,
            },
        },
        role: {
            type: String,
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        courses: [
            {
                courseId: {
                    type: String,

                },
            },
        ],
    }, { timestamps: true });

//Hashing password before saving user
userSchema.pre<IUser>("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
        expiresIn: '5m',
    });
}

userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
        expiresIn: '3d',
    });
}
//Compare user password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User; 
