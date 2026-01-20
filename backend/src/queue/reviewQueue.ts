import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const reviewQueue = new Queue("pr-review", {
  connection: redisConnection as any,
});
