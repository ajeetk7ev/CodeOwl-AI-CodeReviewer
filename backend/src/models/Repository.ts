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
  indexed: boolean;
  lastIndexedAt?: Date;
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

    indexed: { type: Boolean, default: false },
    lastIndexedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IRepository>(
  "Repository",
  repositorySchema
);
