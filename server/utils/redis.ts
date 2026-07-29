import { Redis } from 'ioredis';
require('dotenv').config();

export const redisClient = new Redis(process.env.REDIS_URL || '', {
    tls: {
        rejectUnauthorized: false,
    },
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});