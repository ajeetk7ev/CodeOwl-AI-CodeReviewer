import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_KEY!,
});

function normalizeContent(
  content:
    | string
    | {
        type: string;
        text?: string;
      }[],
): string {
  if (typeof content === "string") {
    return content;
  }

  // Extract text from multimodal blocks
  return content
    .map((item) => {
      if (item.type === "text") return item.text ?? "";
      return "";
    })
    .join("");
}

export const generateAIReview = async (
  prDiff: string,
  context: string,
): Promise<string> => {
  const prompt = `
You are a **senior software engineer and code reviewer** with strong expertise in:
- Clean architecture
- Performance optimization
- Security best practices
- Readability and maintainability

Your task is to review a GitHub Pull Request using the provided **codebase context**.

---

## 📦 Codebase Context (important reference)
Use this context to understand existing patterns, conventions, and architecture.
If something in the PR conflicts with the context, highlight it clearly.

${context || "No additional context available."}

---

## 🔀 Pull Request Diff
Analyze the following changes carefully:

${prDiff}

---

## 📝 Instructions (STRICT)
- Be precise, constructive, and professional
- Do NOT repeat the diff verbatim
- If no major issues exist, explicitly say so
- Mark issues with severity: [Critical] [Major] [Minor]
- Prefer actionable suggestions
- Clearly state assumptions if any

---

## 📑 Output Format (MANDATORY)

### 🧠 Summary
### ⚠️ Issues
### 💡 Suggestions
### 🚀 Improvements
### ✅ Best Practices
### 🎵 Code Review Poem
(4 lines max, technical, light, positive)
`;

  const response = await client.chat.send({
    model: "meta-llama/llama-3.3-70b-instruct:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const rawContent = response.choices?.[0]?.message?.content;

  if (!rawContent) return "";

  return normalizeContent(rawContent);
};
