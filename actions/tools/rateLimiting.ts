// import { Ratelimit } from '@upstash/ratelimit';

// import { headers } from 'next/headers';
// import { config } from './config';
// import { redis } from "@/lib/upstash";
// type Unit = "ms" | "s" | "m" | "h" | "d";
// type Duration = `${number} ${Unit}` | `${number}${Unit}`;

// interface CheckRateLimitParams {
//     tokens: number;
//     duration: Duration;
// }

// const localCache = new Map();
// const CACHE_DURATION = 60000; // 60 seconds cache duration

// export async function checkRateLimit({ tokens, duration }: CheckRateLimitParams) {
//     console.log(tokens,duration)
//     if(!tokens||!duration){
//         tokens = 10,
//         duration = '120s'
//     }
//     let ratelimit: Ratelimit | undefined;

//     if (config.useRateLimiting) {
//         ratelimit = new Ratelimit({
//             redis: redis,
//             limiter: Ratelimit.slidingWindow(tokens, duration)
//         });
//     }

//     const identifier = headers().get('x-forwarded-for') || headers().get('x-real-ip') || headers().get('cf-connecting-ip') || headers().get('client-ip') || "";

//     if (!identifier) return false; // Ensure there's an identifier

//     // Check local cache first
//     const cachedLimit = localCache.get(identifier);
//     if (cachedLimit && (Date.now() - cachedLimit.timestamp < CACHE_DURATION)) {
//         return cachedLimit.success;
//     }

//     if (config.useRateLimiting && ratelimit) {
//         try {
//             const limit = await ratelimit.limit(identifier);
//             // Cache the result
//             localCache.set(identifier, { timestamp: Date.now(), success: limit.success });
//             return limit.success;
//         } catch (error) {
//             console.error('Error checking rate limit:', error);
//             // Fallback to cache if Redis fails, assuming last known good state
//             if (cachedLimit) {
//                 return cachedLimit.success;
//             }
//         }
//     }

//     // Default allow if no rate limiting is configured or on error without a cache
//     return true;
// }
