import { redisClient } from '../db/redisConnection';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import moment from 'moment';

const rateLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: 'middleware',
	points: 10,
	duration: 5,
	blockDuration: 60 * 60,
});

export const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter
		.consume(req.ip)
		.then(() => {
			next();
		})
		.catch((rateLimiterRes) => {
			return res.status(429).json({
				message: 'Connection blocked.',
				retryAfter: moment.utc(rateLimiterRes.msBeforeNext).format('HH:mm:ss'),
			});
		});
};
