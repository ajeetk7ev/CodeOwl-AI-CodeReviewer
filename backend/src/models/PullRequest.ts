import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPullRequest extends Document {
  repositoryId: Types.ObjectId;
  prNumber: number;
  title: string;
  author: string;
  state: string;
  githubUrl: string;

  commits: number;
  additions: number;
  deletions: number;

  status: "pending" | "processing" | "completed" | "failed";

  createdAt: Date;
  updatedAt: Date;
}

const pullRequestSchema = new Schema<IPullRequest>(
  {
    repositoryId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    prNumber: { type: Number, required: true },
    title: { type: String },
    author: { type: String },
    state: { type: String },

    githubUrl: { type: String },

    commits: { type: Number, default: 0 },
    additions: { type: Number, default: 0 },
    deletions: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPullRequest>(
  "PullRequest",
  pullRequestSchema
);
