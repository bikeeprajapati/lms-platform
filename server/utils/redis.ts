import { Redis } from 'ioredis';
require('dotenv').config();

export const redis = new Redis(process.env.REDIS_URL || '', {
    tls: {
        rejectUnauthorized: false,
    },
});

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});