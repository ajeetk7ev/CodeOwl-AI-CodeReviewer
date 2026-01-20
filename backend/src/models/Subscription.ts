import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  plan: "free" | "pro";
  status: "active" | "cancelled";
  polarSubscriptionId?: string;
  currentPeriodEnd?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },

    polarSubscriptionId: { type: String },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
