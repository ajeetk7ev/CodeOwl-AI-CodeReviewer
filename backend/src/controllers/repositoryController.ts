import { Request, Response, NextFunction } from "express";
import Repository from "../models/Repository";
import User from "../models/User";
import {
  fetchUserRepositories,
  setupWebhook,
  removeWebhook,
} from "../services/githubService";
import { indexQueue } from "../queue/indexQueue";
import { connectRepoSchema } from "../utils/validation";
import { deleteRepoVectors } from "../services/pineconeService";
import { asyncHandler } from "../middlewares/errorHandler";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  AuthorizationError,
  ExternalServiceError,
} from "../utils/errors";
import { successResponse } from "../utils/response";

export const getGithubRepos = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);

    if (!user?.githubToken) {
      throw new ValidationError(
        "GitHub not connected. Please reconnect your GitHub account.",
      );
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

    res.json(successResponse(repos, "Repositories fetched successfully"));
  },
);

export const getConnectedRepos = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const repos = await Repository.find({ userId });
    res.json(successResponse(repos));
  },
);

export const connectRepository = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);

    if (!user?.githubToken) {
      throw new ValidationError(
        "GitHub not connected. Please reconnect your GitHub account.",
      );
    }

    const result = connectRepoSchema.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError("Invalid repository data", "VALIDATION_ERROR");
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
      throw new ConflictError("Repository already connected");
    }

    // 0. Check Limits for Free Plan
    if (user.plan === "free") {
      const connectedCount = await Repository.countDocuments({ userId });
      if (connectedCount >= 5) {
        throw new AuthorizationError(
          "Free tier limit reached (5 repositories). Please upgrade to Pro for unlimited access.",
          "FREE_LIMIT_REACHED",
        );
      }
    }

    // 1. Create DB Record first
    const repo = await Repository.create({
      userId,
      githubRepoId,
      name,
      fullName,
      owner,
      private: isPrivate,
      defaultBranch,
      isConnected: true,
      indexingStatus: "queued",
    });

    // 2. Add to indexing queue
    await indexQueue.add(
      "repo-indexing",
      {
        repoId: repo._id,
      },
      {
        jobId: `index-${repo._id}`, // Stable ID prevents duplicate indexing
        removeOnComplete: true,
        removeOnFail: false, // Keep failed jobs for debugging
      },
    );

    // 3. Setup webhook asynchronously (non-blocking)
    setupWebhook(user.githubToken, owner, name)
      .then((webhookId) => {
        if (webhookId) {
          repo.githubWebhookId = String(webhookId);
          return repo.save();
        }
      })
      .catch((err) => {
        console.error(
          `[Repository] Async webhook setup failed for ${fullName}:`,
          err.message,
        );
        // Don't fail the connection if webhook setup fails
      });

    // 4. Return immediately
    res.json(successResponse(repo, "Repository connected successfully"));
  },
);

export const disconnectRepository = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const repoId = req.params.id as string;

    const repo = await Repository.findOne({ _id: repoId, userId });
    if (!repo) {
      throw new NotFoundError("Repository");
    }

    const user = await User.findById(userId);

    // 1. Remove Webhook from GitHub
    if (user?.githubToken && repo.githubWebhookId) {
      try {
        await removeWebhook(
          user.githubToken,
          repo.owner,
          repo.name,
          Number(repo.githubWebhookId),
        );
      } catch (err: any) {
        console.error(`[Repository] Failed to remove webhook:`, err.message);
        // Continue with disconnection even if webhook removal fails
      }
    }

    // 2️⃣ Delete Pinecone embeddings
    try {
      await deleteRepoVectors(repoId);
    } catch (err: any) {
      console.error(`[Repository] Failed to delete vectors:`, err.message);
      // Continue with disconnection
    }

    // 3. Delete DB Record
    await Repository.deleteOne({ _id: repoId });

    res.json(successResponse(null, "Repository disconnected successfully"));
  },
);
