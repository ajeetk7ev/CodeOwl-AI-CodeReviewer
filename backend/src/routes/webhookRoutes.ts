import express from "express";
import { handleGithubWebhook } from "../controllers/webhookController";
import { verifyGithubSignature } from "../middlewares/webhookMiddleware";

const router = express.Router();

router.post("/github", verifyGithubSignature, handleGithubWebhook);

export default router;
