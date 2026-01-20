import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  githubId: string;
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
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    githubId: { type: String, required: true, unique: true },
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
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
