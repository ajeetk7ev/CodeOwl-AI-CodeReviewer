import express from "express";
import {
  getGithubRepos,
  getConnectedRepos,
  connectRepository,
  disconnectRepository,
} from "../controllers/repositoryController";

import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/github", protect, getGithubRepos);

router.get("/connected", protect, getConnectedRepos);

router.post("/connect", protect, connectRepository);

router.delete("/:id", protect, disconnectRepository);

export default router;
