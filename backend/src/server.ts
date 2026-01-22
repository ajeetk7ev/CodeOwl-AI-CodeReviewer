import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { dbConnect } from "./config/db";
import cookieParser from "cookie-parser";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import repoRoutes from "./routes/repositoryRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";

console.log("[Server] Importing workers...");
import "./workers/indexWorker";
import "./workers/reviewWorker";
console.log("[Server] Workers imported");

const PORT = process.env.PORT || 3000;

import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL || ""],
    credentials: true,
  }),
);

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      if (req.originalUrl === "/api/webhooks/github") {
        req.rawBody = buf;
      }
    },
  }),
);
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/repositories", repoRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/apisettings", settingsRoutes);
app.use("/api/subscription", subscriptionRoutes);

app.use("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

// Import error handlers
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

// 404 handler for undefined routes (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Process-level error handlers to prevent crashes
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
  // Log to monitoring service in production
  if (process.env.NODE_ENV === "production") {
    // Optionally restart the server gracefully
    console.error("Server will restart due to unhandled rejection");
    process.exit(1);
  }
});

process.on("uncaughtException", (error: Error) => {
  console.error("💥 Uncaught Exception:", error);
  console.error("Server will shut down");
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT received, shutting down gracefully");
  process.exit(0);
});

app.listen(PORT, async () => {
  await dbConnect();
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
});
