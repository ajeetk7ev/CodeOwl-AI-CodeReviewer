import mongoose, { Schema, Document, Types } from "mongoose";

export interface IIndexJob extends Document {
  repositoryId: Types.ObjectId;

  status: "queued" | "processing" | "completed" | "failed";

  totalFiles?: number;
  indexedFiles?: number;

  error?: string;

  createdAt: Date;
  updatedAt: Date;
}

const indexJobSchema = new Schema<IIndexJob>(
  {
    repositoryId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
    },

    totalFiles: { type: Number },
    indexedFiles: { type: Number },

    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IIndexJob>(
  "IndexJob",
  indexJobSchema
);
