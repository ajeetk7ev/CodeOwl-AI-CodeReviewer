import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const generateAIReview = async (prDiff: string, context: string) => {
  const prompt = `
You are an expert code reviewer.

Context from codebase:
${context}

Pull Request Diff:
${prDiff}

Generate a structured review with:

- Summary  
- Issues  
- Suggestions  
- Improvements  
- Best practices
`;

  const response = await client.chat.completions.create({
    model: "google/gemini-2.0-flash-exp",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};
