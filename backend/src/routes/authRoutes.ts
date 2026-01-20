import express from "express";
import passport from "../config/passport";
import {
  githubCallback,
  getMe,
  logout,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  githubCallback
);

router.get("/me", protect, getMe);

router.post("/logout", logout);

export default router;
