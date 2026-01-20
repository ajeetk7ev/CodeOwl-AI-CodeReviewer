import express from "express";
import {
  getAllReviews,
  getReviewById,
  getReviewsByRepo,
  getReviewStats,
} from "../controllers/reviewController";

import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, getAllReviews);

router.get("/stats", protect, getReviewStats);

router.get("/repo/:id", protect, getReviewsByRepo);

router.get("/:id", protect, getReviewById);

export default router;
