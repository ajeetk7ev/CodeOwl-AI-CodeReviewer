import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Repository from "./src/models/Repository";
import PullRequest from "./src/models/PullRequest";
import User from "./src/models/User";
import Redis from "ioredis";

dotenv.config();

const checkDb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/codeowl",
    );
    console.log("Connected to MongoDB");

    const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    await redis.ping();
    console.log("Connected to Redis");

    const userCount = await User.countDocuments();
    const repoCount = await Repository.countDocuments();
    const connectedRepoCount = await Repository.countDocuments({
      isConnected: true,
    });
    const prCount = await PullRequest.countDocuments();

    console.log(`Users: ${userCount}`);
    console.log(`Repositories: ${repoCount}`);
    console.log(`Connected Repositories: ${connectedRepoCount}`);
    console.log(`Pull Requests: ${prCount}`);

    if (connectedRepoCount > 0) {
      const connectedRepos = await Repository.find({ isConnected: true }).limit(
        5,
      );
      console.log(
        "Sample Connected Repos:",
        connectedRepos.map((r) => r.fullName),
      );
    }

    if (prCount > 0) {
      const latestPRs = await PullRequest.find()
        .sort({ createdAt: -1 })
        .limit(5);
      console.log(
        "Latest PRs:",
        latestPRs.map((p) => ({
          number: p.prNumber,
          status: p.status,
          repoId: p.repositoryId,
        })),
      );
    }

    await redis.quit();
    await mongoose.connection.close();
  } catch (error) {
    console.error("DB/Redis Check failed:", error);
  }
};

checkDb();
