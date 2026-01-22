import { Worker } from "bullmq";
import { createRedisConnection } from "../config/redis";
import Repository from "../models/Repository";
import User from "../models/User";
import {
  fetchRepoTree,
  fetchFileContents,
} from "../services/githubRepoService";
import {
  createEmbedding,
  createEmbeddingsBatch,
} from "../services/embeddingService";
import {
  upsertEmbedding,
  upsertBatch,
  deleteRepoVectors,
} from "../services/pineconeService";
import { chunkFileContent } from "../services/fileChunkingService";

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
  ".tsbuildinfo",
  ".lock",
];

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export const indexWorker = new Worker(
  "repo-indexing",
  async (job) => {
    const { repoId } = job.data;

    const repo = await Repository.findById(repoId);
    if (!repo) throw new Error("Repository not found");

    const user = await User.findById(repo.userId);
    if (!user?.githubToken) {
      throw new Error("GitHub token missing for user");
    }

    // Mark repo as processing
    repo.indexed = false;
    repo.indexingStatus = "processing";
    repo.indexingProgress = 0;
    await repo.save();

    console.log(`[Worker] Starting indexing for repo ${repoId}`);
    const startTime = Date.now();

    // 🔥 IMPORTANT: clear old vectors before re-index
    await deleteRepoVectors(repoId);

    // ✅ PHASE 1: Fetch ALL files recursively using Git Tree API
    const branch = repo.defaultBranch || "main";
    const allFiles = await fetchRepoTree(
      user.githubToken,
      repo.owner,
      repo.name,
      branch,
    );

    console.log(`[Worker] Found ${allFiles.length} files in repository tree`);

    // Filter out ignored files
    const filesToIndex = allFiles.filter((file) => {
      if (!file.path) return false;

      // Skip ignored directories
      if (IGNORED_DIRECTORIES.some((dir) => file.path!.startsWith(`${dir}/`))) {
        return false;
      }

      // Skip ignored extensions
      if (IGNORED_EXTENSIONS.some((ext) => file.path!.endsWith(ext))) {
        return false;
      }

      // Skip large files
      if (file.size && file.size > MAX_FILE_SIZE) {
        console.warn(`[Worker] Skipping large file: ${file.path}`);
        return false;
      }

      return true;
    });

    console.log(
      `[Worker] Indexing ${filesToIndex.length} files after filtering`,
    );

    // ✅ PHASE 2: Process files in parallel batches
    const FILE_BATCH_SIZE = 10; // Fetch 10 files at a time
    const EMBED_BATCH_SIZE = 96; // Pinecone batch limit

    let totalChunks = 0;
    let processedFiles = 0;
    let errorCount = 0;

    for (let i = 0; i < filesToIndex.length; i += FILE_BATCH_SIZE) {
      const fileBatch = filesToIndex.slice(i, i + FILE_BATCH_SIZE);

      try {
        // Fetch file contents in parallel
        const fileContents = await fetchFileContents(
          user.githubToken,
          repo.owner,
          repo.name,
          fileBatch,
        );

        console.log(
          `[Worker] Fetched ${fileContents.length} file contents (batch ${Math.floor(i / FILE_BATCH_SIZE) + 1})`,
        );

        // ✅ PHASE 3: Chunk files and prepare embeddings
        const allChunks: Array<{
          id: string;
          content: string;
          metadata: any;
        }> = [];

        for (const fileContent of fileContents) {
          if (!fileContent || !fileContent.path) continue;

          try {
            // Decode content
            const rawContent = Buffer.from(
              fileContent.content || "",
              fileContent.encoding as BufferEncoding,
            ).toString("utf-8");

            const content = rawContent.trim();

            if (!content) {
              console.warn(`[Worker] Skipping empty file: ${fileContent.path}`);
              continue;
            }

            // Chunk the file
            const chunks = chunkFileContent(repoId, fileContent.path, content);

            allChunks.push(...chunks);
          } catch (err: any) {
            console.error(
              `[Worker] Failed to process ${fileContent.path}:`,
              err.message,
            );
            errorCount++;
          }
        }

        if (allChunks.length === 0) continue;

        totalChunks += allChunks.length;

        // ✅ PHASE 4: Batch create embeddings
        const chunkTexts = allChunks.map((c) => c.content);
        const embeddings = await createEmbeddingsBatch(chunkTexts);

        console.log(`[Worker] Created ${embeddings.length} embeddings`);

        // ✅ PHASE 5: Prepare vectors for batch upsert
        const vectors = allChunks.map((chunk, idx) => ({
          id: chunk.id,
          values: embeddings[idx],
          metadata: {
            ...chunk.metadata,
          },
        }));

        // ✅ PHASE 6: Batch upsert to Pinecone
        await upsertBatch(repoId, vectors);

        processedFiles += fileContents.length;

        // Update progress
        const progressPercentage = Math.round(
          (processedFiles / filesToIndex.length) * 100,
        );

        await job.updateProgress({
          filesProcessed: processedFiles,
          totalFiles: filesToIndex.length,
          percentage: progressPercentage,
        });

        // Also update repository progress
        repo.indexingProgress = progressPercentage;
        await repo.save();

        console.log(
          `[Worker] Progress: ${processedFiles}/${filesToIndex.length} files (${totalChunks} chunks)`,
        );
      } catch (err: any) {
        console.error(
          `[Worker] Failed to process batch starting at index ${i}:`,
          err.message,
        );
        errorCount++;
      }
    }

    const duration = Date.now() - startTime;

    repo.indexed = true;
    repo.lastIndexedAt = new Date();
    repo.indexingStatus = "completed";
    repo.indexingProgress = 100;
    repo.indexingMetrics = {
      filesProcessed: processedFiles,
      chunksCreated: totalChunks,
      errors: errorCount,
      duration,
    };
    await repo.save();

    console.log(
      `[Worker] Indexing completed for repo ${repoId} in ${duration}ms`,
    );
    console.log(
      `[Worker] Stats: ${processedFiles} files, ${totalChunks} chunks, ${errorCount} errors`,
    );

    return {
      message: "Repository indexing completed",
      stats: {
        filesProcessed: processedFiles,
        chunksCreated: totalChunks,
        errors: errorCount,
        duration,
      },
    };
  },
  {
    connection: createRedisConnection() as any,
    concurrency: 2,
  },
);

indexWorker.on("ready", () => {
  console.log("[Worker] Repo indexing worker ready");
});

indexWorker.on("completed", (job) => {
  console.log(`[Worker] Indexing job ${job.id} completed`);
});

indexWorker.on("failed", (job, err) => {
  console.error(`[Worker] Indexing job ${job?.id} failed:`, err.message);
});
