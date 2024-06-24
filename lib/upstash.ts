import {Redis} from '@upstash/redis'

export const redis = new Redis ({
    url: process.env.UPSTASH_REDIS,
    token: process.env.UPSTASH_REDIS_KEY,
})