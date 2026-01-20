import { Request, Response } from "express";
import Repository from "../models/Repository";
import PullRequest from "../models/PullRequest";
import { reviewQueue } from "../queue/reviewQueue";
import { githubWebhookSchema } from "../utils/validation";

export const handleGithubWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.headers["x-github-event"];

    if (event !== "pull_request") {
      return res.json({ message: "Ignored" });
    }

    const result = githubWebhookSchema.safeParse(req.body);
    if (!result.success) {
      console.warn(
        "[Webhook] Invalid payload received:",
        result.error.format(),
      );
      return res
        .status(400)
        .json({ message: "Invalid payload", errors: result.error.format() });
    }

    const payload = result.data;
    const action = payload.action;

    if (!["opened", "synchronize"].includes(action)) {
      return res.json({ message: "Not required action" });
    }

    const repoFullName = payload.repository.full_name;
    console.log(`[Webhook] Received PR ${action} event for ${repoFullName}`);

    const repo = await Repository.findOne({
      fullName: repoFullName,
      isConnected: true,
    });

    if (!repo) {
      console.warn(`[Webhook] Repo not connected: ${repoFullName}`);
      return res.json({ message: "Repo not connected" });
    }

    // Create PR record
    const pr = await PullRequest.create({
      repositoryId: repo._id,
      prNumber: payload.pull_request.number,
      title: payload.pull_request.title,
      author: payload.pull_request.user.login,
      state: payload.pull_request.state,
      githubUrl: payload.pull_request.html_url,
      status: "pending",
    });

    console.log(`[Webhook] PR ${pr.prNumber} created, adding to review queue`);

    // Add job to queue
    await reviewQueue.add("generate-review", {
      repoId: repo._id,
      prId: pr._id,
      prNumber: pr.prNumber,
    });

    res.json({ message: "PR queued for review" });
  } catch (error: any) {
    console.error("[Webhook] Webhook failed:", error.message);
    res.status(500).json({ message: "Webhook failed" });
  }
};
