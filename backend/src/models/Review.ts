import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  pullRequestId: Types.ObjectId;
  repositoryId: Types.ObjectId;
  userId: Types.ObjectId;

  content: string;
  aiModel: string;

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

    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },

    githubCommentUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);
