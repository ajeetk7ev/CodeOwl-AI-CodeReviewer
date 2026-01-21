import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email?: string;
  githubId?: string;
  githubUsername?: string;
  githubToken?: string;
  avatar?: string;
  plan: "free" | "pro";
  usage: {
    totalRepos: number;
    totalReviews: number;
  };
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

    usage: {
      totalRepos: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },

    githubToken: { type: String },

    lastLogin: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
