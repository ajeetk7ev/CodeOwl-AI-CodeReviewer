import { pinecone } from "../config/pinecone";

/**
 * Create single embedding (for backward compatibility)
 */
export const createEmbedding = async (text: string): Promise<number[]> => {
  // Use Pinecone's native inference for llama-text-embed-v2
  const response = await pinecone.inference.embed(
    "llama-text-embed-v2",
    [text],
    {
      inputType: "passage",
      truncate: "END",
      dimension: 2048,
    } as any,
  );

  return (response as any).data[0].values as number[];
};

/**
 * Create embeddings in batch for multiple texts
 * Processes up to 96 texts at once (Pinecone limit)
 * Returns array of embeddings in same order as input
 */
export const createEmbeddingsBatch = async (
  texts: string[],
): Promise<number[][]> => {
  if (texts.length === 0) return [];

  // Pinecone limits batch size to 96
  const BATCH_LIMIT = 96;

  if (texts.length <= BATCH_LIMIT) {
    // Single batch
    const response = await pinecone.inference.embed(
      "llama-text-embed-v2",
      texts,
      {
        inputType: "passage",
        truncate: "END",
        dimension: 2048,
      } as any,
    );

    return (response as any).data.map((item: any) => item.values as number[]);
  }

  // Multiple batches needed
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_LIMIT) {
    const batch = texts.slice(i, i + BATCH_LIMIT);
    console.log(
      `[Embedding] Processing batch ${Math.floor(i / BATCH_LIMIT) + 1} (${batch.length} texts)`,
    );

    const response = await pinecone.inference.embed(
      "llama-text-embed-v2",
      batch,
      {
        inputType: "passage",
        truncate: "END",
        dimension: 2048,
      } as any,
    );

    const batchEmbeddings = (response as any).data.map(
      (item: any) => item.values as number[],
    );
    embeddings.push(...batchEmbeddings);
  }

  console.log(`[Embedding] Created ${embeddings.length} embeddings in batches`);
  return embeddings;
};
