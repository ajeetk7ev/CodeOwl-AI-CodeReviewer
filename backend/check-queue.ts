import { Queue, Worker } from "bullmq";
import dotenv from "dotenv";
import { redisConnection } from "./src/config/redis";

dotenv.config();

const checkQueue = async () => {
  try {
    const queueName = "pr-review";
    const queue = new Queue(queueName, { connection: redisConnection as any });

    const jobCount = await queue.getJobCounts();
    console.log(`Queue "${queueName}" job counts:`, jobCount);

    const activeJobs = await queue.getActive();
    console.log(`Active jobs: ${activeJobs.length}`);
    if (activeJobs.length > 0) {
      console.log("First active job data:", activeJobs[0].data);
    }

    const waitingJobs = await queue.getWaiting();
    console.log(`Waiting jobs: ${waitingJobs.length}`);
    if (waitingJobs.length > 0) {
      console.log("First waiting job data:", waitingJobs[0].data);
    }

    // Check if any workers are registered for this queue
    // Note: BullMQ doesn't have a direct "list workers" but we can check the redis keys
    const keys = await redisConnection.keys(`bull:${queueName}:*`);
    console.log(`Redis keys for "${queueName}":`, keys);

    await queue.close();
    process.exit(0);
  } catch (error) {
    console.error("Diagnostic failed:", error);
    process.exit(1);
  }
};

checkQueue();
