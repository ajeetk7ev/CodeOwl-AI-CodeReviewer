import { Request, Response } from "express";
import User from "../models/User";
import Repository from "../models/Repository";
import Review from "../models/Review";
import PullRequest from "../models/PullRequest";

// GET user profile details
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select("-githubToken -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};

// UPDATE profile details
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true },
    ).select("-githubToken");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// GET usage details
export const getUsage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const totalRepos = await Repository.countDocuments({ userId });
    const totalReviews = await Review.countDocuments({ userId });

    const totalPRs = await PullRequest.countDocuments({
      repositoryId: {
        $in: (await Repository.find({ userId }).select("_id")).map(
          (r) => r._id,
        ),
      },
    });

    res.json({
      totalRepos,
      totalReviews,
      totalPRs,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch usage" });
  }
};

// CHECK GitHub connection status
export const getGithubStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId);

    res.json({
      connected: !!user?.githubToken,
      username: user?.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to check GitHub status" });
  }
};
