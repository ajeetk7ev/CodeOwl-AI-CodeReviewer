import { Request, Response } from "express";
import Repository from "../models/Repository";
import User from "../models/User";
import { fetchUserRepositories } from "../services/githubService";
import { indexQueue } from "../queue/indexQueue";

export const getGithubRepos = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId);

    if (!user?.githubToken) {
      return res.status(400).json({ message: "GitHub not connected" });
    }

    const repos = await fetchUserRepositories(user.githubToken);

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

import { connectRepoSchema } from "../utils/validation";

export const connectRepository = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

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

    const repo = await Repository.create({
      userId,
      githubRepoId,
      name,
      fullName,
      owner,
      private: isPrivate,
      defaultBranch,
      isConnected: true,
    });

    await indexQueue.add("index-repo", {
      repoId: repo._id,
    });

    res.json(repo);
  } catch (error) {
    res.status(500).json({ message: "Failed to connect repo" });
  }
};

export const disconnectRepository = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const repoId = req.params.id;

  await Repository.deleteOne({ _id: repoId, userId });

  res.json({ message: "Repository disconnected" });
};
