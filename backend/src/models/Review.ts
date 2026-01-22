import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  pullRequestId: Types.ObjectId;
  repositoryId: Types.ObjectId;
  userId: Types.ObjectId;

  content: string; // Full markdown review
  aiModel: string;

  // Structured review data for UI
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

  status: "completed" | "failed";
  githubCommentUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    pullRequestId: {
      type: Schema.Types.ObjectId,
      ref: "PullRequest",
      required: true,
    },

    repositoryId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: { type: String, required: true },

    aiModel: { type: String },

    // Structured data for UI
    summary: {
      type: {
        filesChanged: Number,
        linesAdded: Number,
        linesDeleted: Number,
        riskLevel: {
          type: String,
          enum: ["low", "medium", "high", "critical"],
        },
        recommendation: {
          type: String,
          enum: ["approve", "approve_with_changes", "request_changes", "block"],
        },
      },
      required: false,
    },

    stats: {
      type: {
        security: { count: Number, severity: String },
        bugs: { count: Number, severity: String },
        performance: { count: Number, severity: String },
        quality: { count: Number, severity: String },
      },
      required: false,
    },

    sections: {
      type: Schema.Types.Mixed,
      required: false,
    },

    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },

    githubCommentUrl: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IReview>("Review", reviewSchema);
