import redis from 'redis';

export const redisClient = redis.createClient(
	process.env.REDIS_URL || {
		enable_offline_queue: false,
	},
);
