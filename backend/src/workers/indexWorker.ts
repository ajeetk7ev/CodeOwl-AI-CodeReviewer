import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import Repository from "../models/Repository";
import User from "../models/User";
import { getRepoFiles } from "../services/githubRepoService";
import { createEmbedding } from "../services/embeddingService";
import { upsertEmbedding } from "../services/pineconeService";

const IGNORED_DIRECTORIES = [
  "node_modules",
  ".git",
  ".vscode",
  "dist",
  "build",
  "coverage",
];
const IGNORED_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".ico",
  ".pdf",
  ".zip",
  ".gz",
  ".exe",
  ".bin",
];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export const indexWorker = new Worker(
  "repo-indexing",
  async (job) => {
    const { repoId } = job.data;

    const repo = await Repository.findById(repoId);
    if (!repo) throw new Error("Repo not found");

    const user = await User.findById(repo.userId);
    if (!user?.githubToken) throw new Error("User GitHub token missing");

    // Mark processing
    repo.indexed = false;
    await repo.save();

    const files: any = await getRepoFiles(
      user.githubToken,
      repo.owner,
      repo.name,
    );

    for (const file of files) {
      if (file.type !== "file") continue;

      // Filter by directory
      if (IGNORED_DIRECTORIES.some((dir) => file.path.includes(`${dir}/`))) {
        continue;
      }

      // Filter by extension
      if (IGNORED_EXTENSIONS.some((ext) => file.path.endsWith(ext))) {
        continue;
      }

      // Filter by size
      if (file.size && file.size > MAX_FILE_SIZE) {
        continue;
      }

      try {
        const content = Buffer.from(file.content || "", "base64").toString(
          "utf-8",
        );

        const embedding = await createEmbedding(content);

        await upsertEmbedding(repoId, file.path, content, embedding);
      } catch (fileError: any) {
        console.error(`Failed to index file ${file.path}:`, fileError.message);
      }
    }

    repo.indexed = true;
    repo.lastIndexedAt = new Date();
    await repo.save();

    return { message: "Indexing completed" };
  },
  {
    connection: redisConnection as any,
    concurrency: 2,
  },
);
