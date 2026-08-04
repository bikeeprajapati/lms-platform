require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncErrors } from '../middleware/catchAsyncErrors';
import cloudinary from '../utils/cloudinary';
import LayoutModel from '../models/layout.model';

// ------------------- Create Layout (admin only, initial setup) -------------------
export const createLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        const isTypeExist = await LayoutModel.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler(`${type} already exists`, 400));
        }

        if (type === 'Banner') {
            const { image, title, subTitle } = req.body;

            const myCloud = await cloudinary.uploader.upload(image, {
                folder: 'layout',
            });

            const banner = {
                type: 'Banner',
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                },
            };
            await LayoutModel.create(banner);
        }

        if (type === 'FAQ') {
            const { faq } = req.body;
            const faqItems = await Promise.all(
                faq.map((item: any) => ({
                    question: item.question,
                    answer: item.answer,
                }))
            );
            await LayoutModel.create({ type: 'FAQ', faq: faqItems });
        }

        if (type === 'Categories') {
            const { categories } = req.body;
            const categoryItems = await Promise.all(
                categories.map((item: any) => ({
                    title: item.title,
                }))
            );
            await LayoutModel.create({ type: 'Categories', categories: categoryItems });
        }

        res.status(201).json({
            success: true,
            message: 'Layout created successfully',
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// ------------------- Edit Layout (admin only) -------------------
export const editLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type === 'Banner') {
            const bannerData: any = await LayoutModel.findOne({ type: 'Banner' });
            const { image, title, subTitle } = req.body;

            if (bannerData) {
                // remove old banner image before uploading the new one
                await cloudinary.uploader.destroy(bannerData.banner.image.public_id);
            }

            const myCloud = await cloudinary.uploader.upload(image, {
                folder: 'layout',
            });

            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subTitle,
            };

            await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
        }

        if (type === 'FAQ') {
            const { faq } = req.body;
            const faqItemData = await LayoutModel.findOne({ type: 'FAQ' });
            const faqItems = await Promise.all(
                faq.map((item: any) => ({
                    question: item.question,
                    answer: item.answer,
                }))
            );
            await LayoutModel.findByIdAndUpdate(faqItemData?._id, { type: 'FAQ', faq: faqItems });
        }

        if (type === 'Categories') {
            const { categories } = req.body;
            const categoriesData = await LayoutModel.findOne({ type: 'Categories' });
            const categoryItems = await Promise.all(
                categories.map((item: any) => ({
                    title: item.title,
                }))
            );
            await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
                type: 'Categories',
                categories: categoryItems,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Layout updated successfully',
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// ------------------- Get Layout By Type (public) -------------------
export const getLayoutByType = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;

        const layout = await LayoutModel.findOne({ type });

        res.status(200).json({
            success: true,
            layout,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});