import { getPineconeIndex } from "../config/pinecone";
import { createEmbedding } from "./embeddingService";

export const fetchContextFromPinecone = async (
  repoId: string,
  prDiff: string,
) => {
  const index = getPineconeIndex();

  const embedding = await createEmbedding(prDiff);

  const result = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  return result.matches?.map((m: any) => m.metadata.content).join("\n\n");
};
