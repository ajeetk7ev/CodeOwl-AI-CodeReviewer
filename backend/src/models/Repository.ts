import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRepository extends Document {
  userId: Types.ObjectId;
  githubRepoId: string;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  isConnected: boolean;
  defaultBranch: string;
  githubWebhookId?: string;
  indexed: boolean;
  lastIndexedAt?: Date;

  // Progress tracking
  indexingProgress?: number; // 0-100
  indexingStatus?: "queued" | "processing" | "completed" | "failed";
  indexingMetrics?: {
    filesProcessed: number;
    chunksCreated: number;
    errors: number;
    duration: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

const repositorySchema = new Schema<IRepository>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    githubRepoId: { type: String, required: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    owner: { type: String, required: true },
    private: { type: Boolean, default: false },

    isConnected: { type: Boolean, default: false },

    defaultBranch: { type: String },
    githubWebhookId: { type: String },
    indexed: { type: Boolean, default: false },
    lastIndexedAt: { type: Date },

    indexingProgress: { type: Number, default: 0 },
    indexingStatus: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
    },
    indexingMetrics: {
      type: {
        filesProcessed: Number,
        chunksCreated: Number,
        errors: Number,
        duration: Number,
      },
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IRepository>("Repository", repositorySchema);
