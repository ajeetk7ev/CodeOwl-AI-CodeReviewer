import { Request, Response } from "express";
import Repository from "../models/Repository";
import User from "../models/User";
import {
  fetchUserRepositories,
  setupWebhook,
  removeWebhook,
} from "../services/githubService";
import { indexQueue } from "../queue/indexQueue";
import { connectRepoSchema } from "../utils/validation";

export const getGithubRepos = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);

    if (!user?.githubToken) {
      return res.status(400).json({ message: "GitHub not connected" });
    }

    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 15;
    const visibility = (req.query.visibility as any) || "all";

    const repos = await fetchUserRepositories(
      user.githubToken,
      page,
      perPage,
      visibility,
    );
    res.json(repos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch repos" });
  }
};

export const getConnectedRepos = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const repos = await Repository.find({ userId });
  res.json(repos);
};

export const connectRepository = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);

    if (!user?.githubToken) {
      return res.status(400).json({ message: "GitHub not connected" });
    }

    const result = connectRepoSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: result.error.format() });
    }

    const {
      githubRepoId,
      name,
      fullName,
      owner,
      private: isPrivate,
      defaultBranch,
    } = req.body;

    const exists = await Repository.findOne({
      userId,
      githubRepoId,
    });

    if (exists) {
      return res.status(400).json({ message: "Repository already connected" });
    }

    // 0. Check Limits for Free Plan
    if (user.plan === "free") {
      const connectedCount = await Repository.countDocuments({ userId });
      if (connectedCount >= 5) {
        return res.status(403).json({
          message:
            "Free tier limit reached (5 repositories). Please upgrade to Pro for unlimited access.",
          limitReached: true,
        });
      }
    }

    // 1. Setup Webhook on GitHub
    const webhookId = await setupWebhook(user.githubToken, owner, name);

    // 2. Create DB Record
    const repo = await Repository.create({
      userId,
      githubRepoId,
      name,
      fullName,
      owner,
      private: isPrivate,
      defaultBranch,
      isConnected: true,
      githubWebhookId: webhookId ? String(webhookId) : undefined,
    });

    await indexQueue.add("index-repo", {
      repoId: repo._id,
    });

    res.json(repo);
  } catch (error) {
    console.error("[Repository] Connection failed:", error);
    res.status(500).json({ message: "Failed to connect repo" });
  }
};

export const disconnectRepository = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const repoId = req.params.id;

    const repo = await Repository.findOne({ _id: repoId, userId });
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const user = await User.findById(userId);

    // 1. Remove Webhook from GitHub
    if (user?.githubToken && repo.githubWebhookId) {
      await removeWebhook(
        user.githubToken,
        repo.owner,
        repo.name,
        Number(repo.githubWebhookId),
      );
    }

    // 2. Delete DB Record
    await Repository.deleteOne({ _id: repoId });

    res.json({ message: "Repository disconnected" });
  } catch (error) {
    console.error("[Repository] Disconnection failed:", error);
    res.status(500).json({ message: "Failed to disconnect repo" });
  }
};
