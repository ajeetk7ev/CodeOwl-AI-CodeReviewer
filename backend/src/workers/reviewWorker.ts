console.log("==========================================");
console.log("!!! ATTENTION: REVIEW WORKER MODULE LOADED !!!");
console.log("==========================================");
import { Worker } from "bullmq";
import { createRedisConnection } from "../config/redis";

import Repository from "../models/Repository";
import PullRequest from "../models/PullRequest";
import Review from "../models/Review";
import User from "../models/User";

import { getPrDiff, postPrComment } from "../services/githubPrService";
import { generateAIReview } from "../services/aiService";
import { fetchContextFromPinecone } from "../services/contextService";

export const reviewWorker = new Worker(
  "pr-review",
  async (job) => {
    console.log(`[Worker] Job ${job.id} handler triggered`);
    const { repoId, prId, prNumber } = job.data;

    const repo = await Repository.findById(repoId);
    const pr = await PullRequest.findById(prId);

    if (!repo || !pr) throw new Error("Invalid job data");

    const user = await User.findById(repo.userId);

    if (!user?.githubToken) throw new Error("Missing GitHub token");

    console.log(
      `[Worker] Starting review for PR #${prNumber} in ${repo.fullName}`,
    );

    pr.status = "processing";
    await pr.save();

    console.log(`[Worker] [PR #${prNumber}] Fetching diff...`);
    // 1. Get PR Diff
    const diff = await getPrDiff(
      user.githubToken,
      repo.owner,
      repo.name,
      prNumber,
    );
    console.log(
      `[Worker] [PR #${prNumber}] Diff fetched (${diff.length} bytes)`,
    );

    console.log(`[Worker] [PR #${prNumber}] Fetching context from Pinecone...`);
    // 2. Get Context from Pinecone
    const context = await fetchContextFromPinecone(repoId, diff);
    console.log(`[Worker] [PR #${prNumber}] Context fetched`);

    console.log(`[Worker] [PR #${prNumber}] Generating AI review...`);
    // 3. Generate AI Review
    const reviewContent = await generateAIReview(diff, context);
    console.log(`[Worker] [PR #${prNumber}] AI Review generated`);

    console.log(`[Worker] [PR #${prNumber}] Storing review in DB...`);
    // 4. Store Review
    const review = await Review.create({
      pullRequestId: pr._id,
      repositoryId: repo._id,
      userId: repo.userId,
      content: reviewContent.markdown,
      summary: reviewContent.summary,
      stats: reviewContent.stats,
      sections: reviewContent.sections,
      aiModel: "gemini",
    });

    console.log(`[Worker] [PR #${prNumber}] Posting comment to GitHub...`);
    // 5. Post Comment on GitHub
    await postPrComment(
      user.githubToken,
      repo.owner,
      repo.name,
      prNumber,
      reviewContent.markdown,
    );

    console.log(`[Worker] [PR #${prNumber}] Review completed successfully`);
    pr.status = "completed";
    await pr.save();

    return { message: "Review completed" };
  },
  {
    connection: createRedisConnection() as any,
    concurrency: 2,
  },
);

reviewWorker.on("ready", () => {
  console.log("[Worker] Review Worker is ready and listening for jobs");
});

reviewWorker.on("active", (job) => {
  console.log(`[Worker] Job ${job.id} is now ACTIVE`);
});

reviewWorker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

reviewWorker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} FAILED:`, err.message);
});

reviewWorker.on("error", (err) => {
  console.error("[Worker] Review Worker CONNECTION ERROR:", err.message);
});

reviewWorker.on("stalled", (jobId) => {
  console.warn(`[Worker] Job ${jobId} HAS STALLED`);
});
