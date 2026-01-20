import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const verifyGithubSignature = (
  req: Request,
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
    return res.status(401).json({ message: "No signature provided" });
  }

  const hmac = crypto.createHmac("sha256", secret);
  const body = JSON.stringify(req.body);
  const digest = Buffer.from(
    "sha256=" + hmac.update(body).digest("hex"),
    "utf8",
  );
  const checksum = Buffer.from(signature, "utf8");

  if (
    checksum.length !== digest.length ||
    !crypto.timingSafeEqual(digest, checksum)
  ) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  next();
};
