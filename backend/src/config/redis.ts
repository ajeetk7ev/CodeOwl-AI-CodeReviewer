import IORedis from "ioredis";

export const redisOptions = {
  maxRetriesPerRequest: null,
};

const getClient = () => {
  if (process.env.REDIS_URL) {
    return new IORedis(process.env.REDIS_URL, redisOptions);
  }

  return new IORedis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    username: "default",
    ...redisOptions,
  });
};

export const redisConnection = getClient();

redisConnection.on("connect", () => {
  console.log("Redis connected");
});

redisConnection.on("ready", () => {
  console.log("Redis is ready");
});

redisConnection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export const createRedisConnection = () => getClient();
