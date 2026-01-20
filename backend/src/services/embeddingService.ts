import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const createEmbedding = async (text: string) => {
  const response = await client.embeddings.create({
    model: "meta-llama/llama-text-embed-v2",
    input: text,
  });

  return response.data[0].embedding;
};
