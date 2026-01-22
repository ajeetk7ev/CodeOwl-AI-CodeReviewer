import { Request, Response } from "express";
import crypto from "crypto";
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

// GET user settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select("settings");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.settings || {
      theme: "system",
      notifications: {
        email: true,
        push: true,
        reviewComments: true,
        prUpdates: true,
        weeklyDigest: false,
        marketingEmails: false,
        securityAlerts: true,
      },
      privacy: {
        profileVisibility: "private",
        showActivity: true,
        allowAnalytics: true,
        dataRetention: "2years",
      },
      language: "en",
      timezone: "UTC",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load settings" });
  }
};

// UPDATE user settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { settings } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { settings },
      { new: true },
    ).select("settings");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};

// GET API keys
export const getApiKeys = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select("apiKeys");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.apiKeys || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to load API keys" });
  }
};

// CREATE new API key
export const createApiKey = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "API key name is required" });
    }

    const apiKey = `ck_${crypto.randomBytes(32).toString('hex')}`;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.apiKeys) {
      user.apiKeys = [];
    }

    user.apiKeys.push({
      name: name.trim(),
      key: apiKey,
      createdAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      name: name.trim(),
      key: apiKey,
      createdAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create API key" });
  }
};

// DELETE API key
export const deleteApiKey = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { keyId } = req.params;

    const user = await User.findById(userId);

    if (!user || !user.apiKeys) {
      return res.status(404).json({ message: "User or API keys not found" });
    }

    user.apiKeys = user.apiKeys.filter(apiKey => apiKey.key !== keyId);

    await user.save();

    res.json({ message: "API key deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete API key" });
  }
};

// REQUEST account deletion
export const requestAccountDeletion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { reason, confirmText } = req.body;

    if (confirmText !== "DELETE") {
      return res.status(400).json({ message: "Invalid confirmation text" });
    }

    // In a real application, you might want to:
    // 1. Mark the account for deletion with a grace period
    // 2. Send confirmation emails
    // 3. Schedule actual deletion

    // For now, we'll just delete immediately (use with caution!)
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account" });
  }
};

// EXPORT user data
export const exportUserData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select("-githubToken -apiKeys.key -password -twoFactorSecret");
    const repositories = await Repository.find({ userId });
    const reviews = await Review.find({ userId });
    const pullRequests = await PullRequest.find({
      repositoryId: { $in: repositories.map(r => r._id) }
    });

    const exportData = {
      user: user,
      repositories: repositories,
      reviews: reviews,
      pullRequests: pullRequests,
      exportedAt: new Date(),
    };

    // In a real application, you'd generate a file and provide a download URL
    // For now, we'll just return the data
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: "Failed to export data" });
  }
};

// GET user sessions
export const getSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select("sessions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.sessions || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to load sessions" });
  }
};

// REVOKE user session
export const revokeSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { sessionId } = req.params;

    const user = await User.findById(userId);

    if (!user || !user.sessions) {
      return res.status(404).json({ message: "User or sessions not found" });
    }

    user.sessions = user.sessions.filter(session => session.sessionId !== sessionId);

    await user.save();

    res.json({ message: "Session revoked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to revoke session" });
  }
};

// CHANGE password (placeholder for future implementation)
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    // For now, since this is GitHub-only auth, we'll return a placeholder response
    // In a real app with password auth, you'd verify current password and hash new one

    res.json({ message: "Password change not implemented for GitHub authentication" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password" });
  }
};

// GET two-factor auth status
export const getTwoFactorStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select("twoFactorEnabled");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      enabled: user.twoFactorEnabled || false,
      // In a real implementation, you'd check if setup is complete
      setupComplete: false,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get 2FA status" });
  }
};

// ENABLE/DISABLE two-factor auth (placeholder)
export const toggleTwoFactor = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { enabled } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: enabled },
      { new: true }
    ).select("twoFactorEnabled");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      enabled: user.twoFactorEnabled,
      message: enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle 2FA" });
  }
};

// UPDATE API key permissions
export const updateApiKeyPermissions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { keyId, permissions } = req.body;

    const user = await User.findById(userId);

    if (!user || !user.apiKeys) {
      return res.status(404).json({ message: "User or API keys not found" });
    }

    const apiKey = user.apiKeys.find(key => key.key === keyId);
    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    apiKey.permissions = permissions;
    await user.save();

    res.json({ message: "API key permissions updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update API key permissions" });
  }
};
