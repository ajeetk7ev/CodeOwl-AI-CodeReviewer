import { Request, Response } from "express";
import Review from "../models/Review";
import PullRequest from "../models/PullRequest";
import Repository from "../models/Repository";

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const reviews = await Review.find({ userId })
      .populate("repositoryId", "name fullName")
      .populate("pullRequestId", "prNumber title githubUrl")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments({ userId });

    res.json({
      data: reviews,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load reviews" });
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const reviewId = req.params.id;

    const review = await Review.findOne({
      _id: reviewId,
      userId,
    })
      .populate("repositoryId", "name fullName")
      .populate("pullRequestId", "prNumber title githubUrl");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch review" });
  }
};

export const getReviewsByRepo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const repoId = req.params.id;

    const reviews = await Review.find({
      userId,
      repositoryId: repoId,
    })
      .populate("pullRequestId", "prNumber title githubUrl")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to load repo reviews" });
  }
};

export const getReviewStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const totalReviews = await Review.countDocuments({ userId });

    const repoCount = await Repository.countDocuments({
      userId,
    });

    const prCount = await PullRequest.countDocuments({
      repositoryId: {
        $in: (await Repository.find({ userId }).select("_id")).map(
          (r) => r._id,
        ),
      },
    });

    res.json({
      totalReviews,
      repoCount,
      prCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};
