export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  githubId?: string;
  githubUsername?: string;
  githubToken?: string;
  plan: "free" | "pro";
  settings?: {
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      push: boolean;
      reviewComments: boolean;
      prUpdates: boolean;
      weeklyDigest: boolean;
    };
    privacy: {
      profileVisibility: "public" | "private";
      showActivity: boolean;
      allowAnalytics: boolean;
    };
    language: string;
  };
  apiKeys?: Array<{
    name: string;
    key: string;
    createdAt: string;
    lastUsed?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  _id: string; // Connected repo ID
  githubRepoId: string;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  defaultBranch: string;
  isConnected: boolean;
  indexed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string; avatar_url: string };
  private: boolean;
  html_url: string;
  default_branch: string;
  description?: string;
  language?: string;
}

export interface PullRequest {
  _id: string;
  repositoryId: string | Repository; // Can be populated
  prNumber: number;
  title: string;
  githubUrl: string;
  status: "open" | "closed" | "merged";
  createdAt: string;
}

export interface Review {
  _id: string;
  repositoryId: string | Repository;
  pullRequestId: string | PullRequest;
  userId: string | User;
  content: string;
  aiModel?: string;
  status: "completed" | "failed";
  githubCommentUrl?: string;
  createdAt: string;
  updatedAt: string;

  // Structured review data for UI (CodeRabbit-like features)
  summary?: {
    filesChanged: number;
    linesAdded: number;
    linesDeleted: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    recommendation:
      | "approve"
      | "approve_with_changes"
      | "request_changes"
      | "block";
  };

  stats?: {
    security: { count: number; severity: string };
    bugs: { count: number; severity: string };
    performance: { count: number; severity: string };
    quality: { count: number; severity: string };
  };

  sections?: {
    changeType: string;
    security: Array<{
      severity: string;
      issue: string;
      fix: string;
      line?: number;
    }>;
    bugs: Array<{
      severity: string;
      issue: string;
      fix: string;
      line?: number;
    }>;
    performance: Array<{
      severity: string;
      issue: string;
      fix: string;
      line?: number;
    }>;
    suggestions: Array<{
      title: string;
      before: string;
      after: string;
      reason: string;
    }>;
    positives: string[];
    testing: { included: boolean; coverage: string; suggestions: string[] };
  };
}

// Response Types

export interface DashboardStats {
  totalRepos: number;
  totalPRs: number;
  totalReviews: number;
  totalCommits: number;
}

export interface ActivityData {
  reviews: Array<{ _id: string; count: number }>; // _id is date YYYY-MM-DD
  prs: Array<{ _id: string; count: number }>;
}

export interface MonthlyData {
  month: string; // YYYY-MM
  reviews: number;
  prs: number;
  commits: number;
}

export interface ReviewsResponse {
  data: Review[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface UsageStats {
  totalRepos: number;
  totalReviews: number;
  totalPRs: number;
}

export interface GithubStatus {
  connected: boolean;
  username?: string;
}

// Settings interfaces
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  reviewComments: boolean;
  prUpdates: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

export interface PrivacySettings {
  profileVisibility: "public" | "private";
  showActivity: boolean;
  allowAnalytics: boolean;
  dataRetention: "1year" | "2years" | "forever";
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  language: string;
  timezone: string;
}

export interface ApiKey {
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  permissions?: string[];
}

export interface UserSession {
  sessionId: string;
  device: string;
  ip: string;
  lastActive: string;
  createdAt: string;
}

export interface TwoFactorStatus {
  enabled: boolean;
  setupComplete: boolean;
}

export interface AccountDeletionRequest {
  reason?: string;
  confirmText: string;
}

export interface DataExportResponse {
  downloadUrl: string;
  expiresAt: string;
}
