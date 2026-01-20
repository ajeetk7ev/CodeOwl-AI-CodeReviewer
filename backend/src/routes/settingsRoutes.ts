import express from "express";
import {
  getProfile,
  updateProfile,
  getUsage,
  getGithubStatus,
} from "../controllers/settingsController";

import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.get("/usage", protect, getUsage);

router.get("/github-status", protect, getGithubStatus);

export default router;
