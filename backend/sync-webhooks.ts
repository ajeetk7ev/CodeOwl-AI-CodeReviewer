import mongoose from "mongoose";
import dotenv from "dotenv";
import Repository from "./src/models/Repository";
import User from "./src/models/User";
import { updateWebhook, setupWebhook } from "./src/services/githubService";

dotenv.config();

const syncWebhooks = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/codeowl",
    );
    console.log("Connected to MongoDB");

    const repos = await Repository.find({ isConnected: true });
    console.log(`Found ${repos.length} connected repositories`);

    for (const repo of repos) {
      const user = await User.findById(repo.userId);
      if (!user?.githubToken) {
        console.warn(`[Sync] Skip ${repo.fullName}: User or token not found`);
        continue;
      }

      console.log(`[Sync] Processing ${repo.fullName}...`);

      if (repo.githubWebhookId) {
        await updateWebhook(
          user.githubToken,
          repo.owner,
          repo.name,
          Number(repo.githubWebhookId),
        );
      } else {
        console.log(
          `[Sync] No existing webhook ID for ${repo.fullName}, creating new...`,
        );
        const newWebhookId = await setupWebhook(
          user.githubToken,
          repo.owner,
          repo.name,
        );
        if (newWebhookId) {
          repo.githubWebhookId = String(newWebhookId);
          await repo.save();
        }
      }
    }

    console.log("Successfully completed webhook sync!");
    await mongoose.connection.close();
  } catch (error) {
    console.error("Sync failed:", error);
    process.exit(1);
  }
};

syncWebhooks();
