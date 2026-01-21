import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "",
  key_secret: process.env.RAZORPAY_API_SECRET || "",
});

export const createRazorpayOrder = async (
  amount: number,
  currency: string = "INR",
) => {
  // If amount is small (like 29), assume it's USD and convert to INR for UPI support
  let finalAmount = amount;
  if (amount < 1000 && currency === "INR") {
    finalAmount = Math.round(amount * 84); // 1 USD = 84 INR approx
    console.log(`[Razorpay] Converting ${amount} USD to ${finalAmount} INR`);
  }

  const options = {
    amount: finalAmount * 100, // amount in the smallest currency unit
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    console.log(`[Razorpay] Creating order for ${amount} ${currency}`);
    const order = await razorpay.orders.create(options);
    console.log(`[Razorpay] Order created: ${order.id}`);
    return order;
  } catch (error) {
    console.error("Razorpay Order Creation Failed:", error);
    throw error;
  }
};

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string,
) => {
  const text = orderId + "|" + paymentId;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET || "")
    .update(text)
    .digest("hex");

  console.log(`[Razorpay] Verifying signature for order ${orderId}`);
  return generated_signature === signature;
};
