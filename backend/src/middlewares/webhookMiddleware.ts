import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const verifyGithubSignature = (
  req: Request & { rawBody?: Buffer },
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers["x-hub-signature-256"] as string;
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    console.error("GITHUB_WEBHOOK_SECRET is not defined in environment");
    return res.status(500).json({ message: "Webhook secret not configured" });
  }

  if (!signature) {
    console.warn("[Webhook] No signature provided");
    return res.status(401).json({ message: "No signature provided" });
  }

  if (!req.rawBody) {
    console.error("[Webhook] Raw body not captured");
    return res.status(500).json({ message: "Internal server error" });
  }

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(req.rawBody);
  const digest = Buffer.from("sha256=" + hmac.digest("hex"), "utf8");
  const checksum = Buffer.from(signature, "utf8");

  if (
    checksum.length !== digest.length ||
    !crypto.timingSafeEqual(digest, checksum)
  ) {
    console.warn("[Webhook] Invalid signature");
    return res.status(401).json({ message: "Invalid signature" });
  }

  next();
};
