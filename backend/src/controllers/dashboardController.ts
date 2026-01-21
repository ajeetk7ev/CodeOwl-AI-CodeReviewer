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
        q: `author:${user.githubUsername || user.name}`,
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
    const user = await User.findById(userId);
    const requestedYear =
      parseInt(req.query.year as string) || new Date().getFullYear();
    const startDate = new Date(requestedYear, 0, 1);
    const endDate = new Date(requestedYear, 11, 31, 23, 59, 59);

    const reviews = await Review.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
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
      {
        $match: {
          "repo.userId": userId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
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

    const heatmapData: Record<string, number> = {};

    // Populate with local data
    reviews.forEach((r) => {
      heatmapData[r._id] = (heatmapData[r._id] || 0) + r.count;
    });
    prs.forEach((p) => {
      heatmapData[p._id] = (heatmapData[p._id] || 0) + p.count;
    });

    // Fetch GitHub contributions if token is available
    if (user?.githubToken) {
      const octokit = new Octokit({
        auth: user.githubToken,
      });

      let username = user.githubUsername;

      if (!username) {
        try {
          const { data: ghUser } = await octokit.rest.users.getAuthenticated();
          username = ghUser.login;
          user.githubUsername = username;
          await user.save();
        } catch (err) {
          console.error("Failed to fetch GitHub username", err);
        }
      }

      if (username) {
        try {
          const query = `
            query($username: String!, $from: DateTime!, $to: DateTime!) {
              user(login: $username) {
                contributionsCollection(from: $from, to: $to) {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                      }
                    }
                  }
                }
              }
            }
          `;

          const response: any = await octokit.graphql(query, {
            username: username,
            from: startDate.toISOString(),
            to: endDate.toISOString(),
          });

          const weeks =
            response.user.contributionsCollection.contributionCalendar.weeks;
          weeks.forEach((week: any) => {
            week.contributionDays.forEach((day: any) => {
              if (day.contributionCount > 0) {
                heatmapData[day.date] =
                  (heatmapData[day.date] || 0) + day.contributionCount;
              }
            });
          });
        } catch (err) {
          console.error("Failed to fetch GitHub heatmap data", err);
        }
      }
    }

    // Convert back to format
    const reviewsResult = Object.entries(heatmapData).map(([date, count]) => ({
      _id: date,
      count,
    }));

    res.json({
      reviews: reviewsResult,
      prs: [], // Already merged
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
    const user = await User.findById(userId);

    // Initialize the last 6 months in the result object
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toISOString().slice(0, 7); // YYYY-MM
      result[monthStr] = {
        month: monthStr,
        reviews: 0,
        prs: 0,
        commits: 0,
      };
    }

    reviews.forEach((r) => {
      if (result[r._id]) {
        result[r._id].reviews = r.reviews;
      }
    });

    prs.forEach((p) => {
      if (result[p._id]) {
        result[p._id].prs = p.prs;
      }
    });

    // Fetch actual commits from GitHub if token is available
    if (user?.githubToken) {
      const octokit = new Octokit({
        auth: user.githubToken,
      });

      // Fetch commits for each of the months in result
      const months = Object.keys(result);
      await Promise.all(
        months.map(async (month) => {
          try {
            const startDate = `${month}-01`;
            const endDate = new Date(
              parseInt(month.split("-")[0]),
              parseInt(month.split("-")[1]),
              0,
            )
              .toISOString()
              .slice(0, 10);

            const { data } = await octokit.rest.search.commits({
              q: `author:${user.githubUsername || user.name} author-date:${startDate}..${endDate}`,
            });

            result[month].commits = data.total_count;
          } catch (err) {
            console.error(`Failed to fetch commits for ${month}`, err);
          }
        }),
      );
    }

    // Sort results by month chronologically
    const sortedResult = Object.values(result).sort((a: any, b: any) =>
      a.month.localeCompare(b.month),
    );

    res.json(sortedResult);
  } catch (error) {
    res.status(500).json({ message: "Failed to load monthly data" });
  }
};
