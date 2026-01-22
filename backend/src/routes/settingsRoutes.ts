import express from "express";
import {
  getProfile,
  updateProfile,
  getUsage,
  getGithubStatus,
  getSettings,
  updateSettings,
  getApiKeys,
  createApiKey,
  deleteApiKey,
  updateApiKeyPermissions,
  requestAccountDeletion,
  exportUserData,
  getSessions,
  revokeSession,
  changePassword,
  getTwoFactorStatus,
  toggleTwoFactor,
} from "../controllers/settingsController";

import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Usage and connections
router.get("/usage", protect, getUsage);
router.get("/github-status", protect, getGithubStatus);

// Settings management
router.get("/settings", protect, getSettings);
router.put("/settings", protect, updateSettings);

// API key management
router.get("/api-keys", protect, getApiKeys);
router.post("/api-keys", protect, createApiKey);
router.delete("/api-keys/:keyId", protect, deleteApiKey);

// Account management
router.post("/account/delete", protect, requestAccountDeletion);
router.get("/account/export", protect, exportUserData);

// Session management
router.get("/sessions", protect, getSessions);
router.delete("/sessions/:sessionId", protect, revokeSession);

// Security
router.put("/password", protect, changePassword);
router.get("/two-factor", protect, getTwoFactorStatus);
router.put("/two-factor", protect, toggleTwoFactor);

// API key permissions
router.put("/api-keys/:keyId/permissions", protect, updateApiKeyPermissions);

export default router;
