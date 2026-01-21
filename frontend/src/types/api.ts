export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  githubId?: string;
  githubToken?: string;
  createdAt: string;
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
