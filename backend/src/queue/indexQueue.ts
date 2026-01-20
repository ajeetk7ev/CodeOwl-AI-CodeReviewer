import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const indexQueue = new Queue("repo-indexing", {
  connection: redisConnection as any,
});
