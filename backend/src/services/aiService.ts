import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const generateAIReview = async (prDiff: string, context: string) => {
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
- Be **precise, constructive, and professional**
- Do NOT repeat the diff verbatim
- If no major issues exist, explicitly say so
- Mark issues with severity: **[Critical] [Major] [Minor]**
- Prefer **actionable suggestions** over vague advice
- If assumptions are made, clearly state them

---

## 📑 Output Format (MANDATORY)

Respond ONLY in the following markdown structure:

### 🧠 Summary
A concise explanation of what this PR does and its overall quality.

### ⚠️ Issues
List detected issues (if any) with severity tags.
If no issues are found, say: *"No critical issues detected."*

### 💡 Suggestions
Concrete suggestions to improve clarity, structure, or safety.

### 🚀 Improvements
Optional enhancements for performance, scalability, or DX.

### ✅ Best Practices
Best practices reinforced or recommended based on the changes.

### 🎵 Code Review Poem
End with a **short, developer-friendly poem (4 lines max)** that humorously or thoughtfully reflects the review.
Keep it technical, light, and positive.
`;

  const response = await client.chat.completions.create({
    model: "google/gemini-2.0-flash-exp:free",
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
};
