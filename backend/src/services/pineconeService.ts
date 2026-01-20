import { getPineconeIndex } from "../config/pinecone";
import crypto from "crypto";

export const upsertEmbedding = async (
  repoId: string,
  filePath: string,
  content: string,
  embedding: number[]
) => {
  const index = getPineconeIndex();

  await index.upsert([
    {
      id: crypto.randomUUID(),
      values: embedding,
      metadata: {
        repoId,
        filePath,
        content,
      },
    },
  ]);
};
