import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";

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
    const { repoId, prId, prNumber } = job.data;

    const repo = await Repository.findById(repoId);
    const pr = await PullRequest.findById(prId);

    if (!repo || !pr) throw new Error("Invalid job data");

    const user = await User.findById(repo.userId);

    if (!user?.githubToken) throw new Error("Missing GitHub token");

    pr.status = "processing";
    await pr.save();

    // 1. Get PR Diff
    const diff = await getPrDiff(
      user.githubToken,
      repo.owner,
      repo.name,
      prNumber,
    );

    // 2. Get Context from Pinecone
    const context = await fetchContextFromPinecone(repoId, diff);

    // 3. Generate AI Review
    const reviewContent = await generateAIReview(diff, context);

    // 4. Store Review
    const review = await Review.create({
      pullRequestId: pr._id,
      repositoryId: repo._id,
      userId: repo.userId,
      content: reviewContent as string,
      aiModel: "gemini",
    });

    // 5. Post Comment on GitHub
    await postPrComment(
      user.githubToken,
      repo.owner,
      repo.name,
      prNumber,
      reviewContent as string,
    );

    pr.status = "completed";
    await pr.save();

    return { message: "Review completed" };
  },
  {
    connection: redisConnection as any,
    concurrency: 2,
  },
);
