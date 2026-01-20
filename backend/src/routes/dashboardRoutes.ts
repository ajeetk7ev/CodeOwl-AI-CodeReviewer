import express from "express";
import {
  getDashboardStats,
  getActivityHeatmap,
  getMonthlyOverview,
} from "../controllers/dashboardController";

import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);

router.get("/activity", protect, getActivityHeatmap);

router.get("/monthly", protect, getMonthlyOverview);

export default router;
