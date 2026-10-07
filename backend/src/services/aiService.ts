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

interface ReviewData {
  summary: {
    filesChanged: number;
    linesAdded: number;
    linesDeleted: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    recommendation:
      | "approve"
      | "approve_with_changes"
      | "request_changes"
      | "block";
  };
  stats: {
    security: { count: number; severity: string };
    bugs: { count: number; severity: string };
    performance: { count: number; severity: string };
    quality: { count: number; severity: string };
  };
  sections: {
    changeType: string;
    security: Array<{
      severity: string;
      issue: string;
      fix: string;
      line?: number;
    }>;
    bugs: Array<{
      severity: string;
      issue: string;
      fix: string;
      line?: number;
    }>;
    performance: Array<{
      severity: string;
      issue: string;
      fix: string;
      line?: number;
    }>;
    suggestions: Array<{
      title: string;
      before: string;
      after: string;
      reason: string;
    }>;
    positives: string[];
    testing: { included: boolean; coverage: string; suggestions: string[] };
  };
  markdown: string;
}

export const generateAIReview = async (
  prDiff: string,
  context: string,
): Promise<ReviewData> => {
  const prompt = `You are an **expert code reviewer** with 10+ years of experience in software architecture, security, and performance optimization.

Your expertise includes:
- 🔒 Security vulnerabilities (OWASP Top 10, injection attacks, auth issues)
- ⚡ Performance optimization (algorithmic complexity, memory leaks, N+1 queries)
- 🏗️ Clean architecture (SOLID, DRY, separation of concerns)
- 🐛 Bug detection (edge cases, race conditions, null checks)
- ✅ Testing best practices (coverage, test quality, mocking)
- 📖 Code readability (naming, comments, structure)

---

## 📦 CODEBASE CONTEXT

**Purpose:** Use this context to understand existing patterns, conventions, and architecture.

**Context:**
${context || "⚠️ No context available - review based on general best practices."}

---

## 🔀 PULL REQUEST CHANGES

**Analyze the following diff carefully:**

\`\`\`diff
${prDiff}
\`\`\`

---

## CRITICAL: Response Format

You MUST respond in TWO parts:

### Part 1: JSON Data Block (MANDATORY)
Start with a JSON code block containing structured data:

\`\`\`json
{
  "summary": {
    "filesChanged": <number>,
    "linesAdded": <number>,
    "linesDeleted": <number>,
    "riskLevel": "low|medium|high|critical",
    "recommendation": "approve|approve_with_changes|request_changes|block"
  },
  "stats": {
    "security": { "count": <number>, "severity": "none|low|medium|high|critical" },
    "bugs": { "count": <number>, "severity": "none|low|medium|high" },
    "performance": { "count": <number>, "severity": "none|low|medium|high" },
    "quality": { "count": <number>, "severity": "none|low|medium" }
  },
  "sections": {
    "changeType": "New Feature|Bug Fix|Refactoring|Performance|Security",
    "security": [
      {
        "severity": "critical|high|medium|low",
        "issue": "Description of security issue",
        "fix": "How to fix it",
        "line": 42
      }
    ],
    "bugs": [],
    "performance": [],
    "suggestions": [
      {
        "title": "Brief title",
        "before": "current code",
        "after": "improved code",
        "reason": "why this is better"
      }
    ],
    "positives": ["What was done well"],
    "testing": {
      "included": true,
      "coverage": "adequate|partial|none",
      "suggestions": ["Additional tests needed"]
    }
  }
}
\`\`\`

### Part 2: Full Markdown Review
After the JSON, provide a detailed markdown-formatted review with these sections:

### 🎯 Change Type & Impact
[State the type of change and overall risk level]

### 🔒 Security Review
[List security concerns or "✅ No security issues found"]

### 🐛 Bugs & Logic Issues
[List potential bugs or "✅ No obvious bugs detected"]

### ⚡ Performance Concerns
[List performance issues or "✅ No performance red flags"]

### 💡 Code Quality Suggestions
[Actionable improvements with code examples]

### ✅ What's Good
[Highlight positive aspects]

### 🧪 Testing Notes
[Test coverage assessment]

### 📝 Overall Assessment
[2-3 sentence summary]

### 🎭 Code Review Haiku
[3 lines: 5-7-5 syllables, technical but witty]

---

**Begin your review now:**
`;

  const response = await client.chat.send({
    model: "openrouter/free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const rawContent = normalizeContent(
    response.choices?.[0]?.message?.content || "",
  );

  // Try to extract JSON block
  const jsonMatch = rawContent.match(/```json\s*\n([\s\S]*?)\n```/);
  let reviewData: ReviewData;

  if (jsonMatch) {
    try {
      const jsonData = JSON.parse(jsonMatch[1]);
      const markdown = rawContent.replace(/```json[\s\S]*?```/, "").trim();

      reviewData = {
        ...jsonData,
        markdown,
      };
    } catch (error) {
      console.error("[AI Service] Failed to parse JSON:", error);
      reviewData = getDefaultReviewData(rawContent);
    }
  } else {
    console.warn("[AI Service] No JSON block found in response");
    reviewData = getDefaultReviewData(rawContent);
  }

  return reviewData;
};

function getDefaultReviewData(markdown: string): ReviewData {
  return {
    summary: {
      filesChanged: 1,
      linesAdded: 0,
      linesDeleted: 0,
      riskLevel: "medium",
      recommendation: "approve_with_changes",
    },
    stats: {
      security: { count: 0, severity: "none" },
      bugs: { count: 0, severity: "none" },
      performance: { count: 0, severity: "none" },
      quality: { count: 0, severity: "none" },
    },
    sections: {
      changeType: "Code Change",
      security: [],
      bugs: [],
      performance: [],
      suggestions: [],
      positives: [],
      testing: { included: false, coverage: "unknown", suggestions: [] },
    },
    markdown,
  };
}
