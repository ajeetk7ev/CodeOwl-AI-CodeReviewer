import { Request, Response } from "express";
import Repository from "../models/Repository";
import PullRequest from "../models/PullRequest";
import Review from "../models/Review";
import User from "../models/User";
import { Octokit } from "@octokit/rest";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const totalRepos = await Repository.countDocuments({ userId });

    const totalPRs = await PullRequest.countDocuments({
      repositoryId: {
        $in: (await Repository.find({ userId }).select("_id")).map(
          (r) => r._id,
        ),
      },
    });

    const totalReviews = await Review.countDocuments({
      userId,
    });

    // Commits will come from GitHub API
    const user = await User.findById(userId);

    let totalCommits = 0;

    if (user?.githubToken) {
      const octokit = new Octokit({
        auth: user.githubToken,
      });

      const { data } = await octokit.rest.search.commits({
        q: `author:${user.name}`,
      });

      totalCommits = data.total_count;
    }

    res.json({
      totalRepos,
      totalPRs,
      totalReviews,
      totalCommits,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};

export const getActivityHeatmap = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const reviews = await Review.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const prs = await PullRequest.aggregate([
      {
        $lookup: {
          from: "repositories",
          localField: "repositoryId",
          foreignField: "_id",
          as: "repo",
        },
      },
      { $unwind: "$repo" },
      { $match: { "repo.userId": userId } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      reviews,
      prs,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load activity" });
  }
};

export const getMonthlyOverview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const last6Months = new Date();
    last6Months.setMonth(last6Months.getMonth() - 6);

    const reviews = await Review.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: last6Months },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },
          reviews: { $sum: 1 },
        },
      },
    ]);

    const prs = await PullRequest.aggregate([
      {
        $lookup: {
          from: "repositories",
          localField: "repositoryId",
          foreignField: "_id",
          as: "repo",
        },
      },
      { $unwind: "$repo" },
      {
        $match: {
          "repo.userId": userId,
          createdAt: { $gte: last6Months },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },
          prs: { $sum: 1 },
        },
      },
    ]);

    // Merge data into one structure
    const result: any = {};

    reviews.forEach((r) => {
      result[r._id] = {
        month: r._id,
        reviews: r.reviews,
        prs: 0,
      };
    });

    prs.forEach((p) => {
      if (!result[p._id]) {
        result[p._id] = {
          month: p._id,
          reviews: 0,
          prs: p.prs,
        };
      } else {
        result[p._id].prs = p.prs;
      }
    });

    res.json(Object.values(result));
  } catch (error) {
    res.status(500).json({ message: "Failed to load monthly data" });
  }
};
