import { getPineconeIndex } from "../config/pinecone";
import crypto from "crypto";

/**
 * Upsert a single file embedding (for backward compatibility)
 * Uses namespace = repoId
 * Uses deterministic vector ID
 */
export const upsertEmbedding = async (
  repoId: string,
  filePath: string,
  embedding: number[],
) => {
  const index = getPineconeIndex();

  console.log(`[Pinecone] Upserting embedding for ${repoId}:${filePath}`);

  // Stable ID so re-indexing overwrites old vectors
  const vectorId = crypto
    .createHash("sha256")
    .update(`${repoId}:${filePath}`)
    .digest("hex");

  await index.namespace(repoId).upsert([
    {
      id: vectorId,
      values: embedding,
      metadata: {
        repoId,
        filePath,
      },
    },
  ]);
};

/**
 * Batch upsert multiple embeddings
 * Processes up to 100 vectors per batch (Pinecone recommendation)
 */
export const upsertBatch = async (
  repoId: string,
  vectors: Array<{
    id: string;
    values: number[];
    metadata: {
      repoId: string;
      filePath: string;
      chunkIndex?: number;
      totalChunks?: number;
      [key: string]: any;
    };
  }>,
) => {
  if (vectors.length === 0) return;

  const index = getPineconeIndex();
  const BATCH_SIZE = 100;

  console.log(
    `[Pinecone] Batch upserting ${vectors.length} vectors to namespace ${repoId}`,
  );

  // Process in batches
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);

    try {
      await index.namespace(repoId).upsert(batch);
      console.log(
        `[Pinecone] Upserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} vectors)`,
      );
    } catch (err: any) {
      console.error(
        `[Pinecone] Batch upsert failed for batch starting at index ${i}:`,
        err.message,
      );
      throw err;
    }
  }

  console.log(`[Pinecone] Successfully upserted ${vectors.length} vectors`);
};

/**
 * Delete ALL vectors for a repo
 * Safe & idempotent
 */
export const deleteRepoVectors = async (repoId: string) => {
  try {
    const index = getPineconeIndex();

    await index.namespace(repoId).deleteAll();

    console.log(`[Pinecone] Deleted vectors for repo ${repoId}`);
  } catch (err: any) {
    if (err?.name === "PineconeNotFoundError") {
      console.warn(
        `[Pinecone] No namespace found for repo ${repoId}, skipping`,
      );
      return;
    }
    throw err;
  }
};
