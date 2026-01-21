import IORedis from "ioredis";

export const redisOptions = {
  maxRetriesPerRequest: null,
};

export const redisConnection = new IORedis(
  process.env.REDIS_URL as string,
  redisOptions,
);

export const createRedisConnection = () =>
  new IORedis(process.env.REDIS_URL as string, redisOptions);
