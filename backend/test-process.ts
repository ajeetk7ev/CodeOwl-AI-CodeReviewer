import { Queue } from "bullmq";
import dotenv from "dotenv";
import { redisConnection } from "./src/config/redis";
import mongoose from "mongoose";

dotenv.config();

const inspectQueue = async () => {
  try {
    const queueName = "pr-review";
    const queue = new Queue(queueName, { connection: redisConnection as any });

    const jobCounts = await queue.getJobCounts();
    console.log(`Job counts for ${queueName}:`, jobCounts);

    const failedJobs = await queue.getFailed();
    console.log(`Failed jobs count: ${failedJobs.length}`);

    for (const job of failedJobs) {
      console.log("--- FAILED JOB ---");
      console.log(`ID: ${job.id}`);
      console.log(`Failed Reason: ${job.failedReason}`);
      console.log(`Data:`, job.data);
      // console.log(`Stacktrace:`, job.stacktrace);
    }

    const activeJobs = await queue.getActive();
    console.log(`Active jobs count: ${activeJobs.length}`);
    for (const job of activeJobs) {
      console.log("--- ACTIVE JOB ---");
      console.log(`ID: ${job.id}`);
      console.log(`Data:`, job.data);
    }

    const waitingJobs = await queue.getWaiting();
    console.log(`Waiting jobs count: ${waitingJobs.length}`);

    await queue.close();
    process.exit(0);
  } catch (error) {
    console.error("Inspection failed:", error);
    process.exit(1);
  }
};

inspectQueue();
