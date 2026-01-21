import { Request, Response } from "express";
import User from "../models/User";
import Subscription from "../models/Subscription";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
} from "../services/razorpayService";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { amount } = req.body; // In INR

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const order = await createRazorpayOrder(amount);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("[Subscription] Order creation failed:", error);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
      req.body;

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Upgrade user to Pro
    await User.findByIdAndUpdate(userId, { plan: "pro" });

    // Update or create subscription record
    await Subscription.findOneAndUpdate(
      { userId },
      {
        plan: "pro",
        status: "active",
        // We could store razorpay_payment_id here if needed
      },
      { upsert: true, new: true },
    );

    res.json({
      success: true,
      message: "Subscription upgraded to Pro successfully",
    });
  } catch (error) {
    console.error("[Subscription] Payment verification failed:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};
