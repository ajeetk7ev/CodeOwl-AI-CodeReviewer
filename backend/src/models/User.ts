import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string; // For future password-based auth
  githubId?: string;
  githubUsername?: string;
  githubToken?: string;
  avatar?: string;
  plan: "free" | "pro";
  usage: {
    totalRepos: number;
    totalReviews: number;
    totalApiCalls: number;
  };
  settings: {
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      push: boolean;
      reviewComments: boolean;
      prUpdates: boolean;
      weeklyDigest: boolean;
      marketingEmails: boolean;
      securityAlerts: boolean;
    };
    privacy: {
      profileVisibility: "public" | "private";
      showActivity: boolean;
      allowAnalytics: boolean;
      dataRetention: "1year" | "2years" | "forever";
    };
    language: string;
    timezone: string;
  };
  apiKeys: Array<{
    name: string;
    key: string;
    createdAt: Date;
    lastUsed?: Date;
    permissions?: string[];
  }>;
  sessions: Array<{
    sessionId: string;
    device: string;
    ip: string;
    lastActive: Date;
    createdAt: Date;
  }>;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, required: false },
    githubId: { type: String, unique: true },
    githubUsername: { type: String },
    avatar: { type: String },

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    password: { type: String },

    usage: {
      totalRepos: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      totalApiCalls: { type: Number, default: 0 },
    },

    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        reviewComments: { type: Boolean, default: true },
        prUpdates: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: false },
        marketingEmails: { type: Boolean, default: false },
        securityAlerts: { type: Boolean, default: true },
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ["public", "private"],
          default: "private",
        },
        showActivity: { type: Boolean, default: true },
        allowAnalytics: { type: Boolean, default: true },
        dataRetention: {
          type: String,
          enum: ["1year", "2years", "forever"],
          default: "2years",
        },
      },
      language: { type: String, default: "en" },
      timezone: { type: String, default: "UTC" },
    },

    apiKeys: [{
      name: { type: String, required: true },
      key: { type: String, required: true, unique: true },
      createdAt: { type: Date, default: Date.now },
      lastUsed: { type: Date },
      permissions: [{ type: String }],
    }],

    sessions: [{
      sessionId: { type: String, required: true },
      device: { type: String },
      ip: { type: String },
      lastActive: { type: Date, default: Date.now },
      createdAt: { type: Date, default: Date.now },
    }],

    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },

    githubToken: { type: String },

    lastLogin: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
