import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    const mongoUri = process.env.DB_URI || process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error('MongoDB connection error: No MongoDB URI found in environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
