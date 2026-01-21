import { pinecone } from "../config/pinecone";

export const createEmbedding = async (text: string): Promise<number[]> => {
  // Use Pinecone's native inference for llama-text-embed-v2
  const response = await pinecone.inference.embed(
    "llama-text-embed-v2",
    [text],
    {
      inputType: "passage",
      truncate: "END",
      parameters: { dimension: 2048 },
    } as any,
  );

  return (response as any).data[0].values as number[];
};
