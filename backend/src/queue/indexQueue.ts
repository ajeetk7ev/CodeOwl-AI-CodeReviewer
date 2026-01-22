import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const indexQueue = new Queue("repo-indexing", {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times
    backoff: {
      type: "exponential",
      delay: 5000, // Start with 5s, then 25s, then 125s
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
      age: 3600, // Remove jobs older than 1 hour
    },
    removeOnFail: {
      count: 100, // Keep last 100 failed jobs for debugging
    },
  },
});
