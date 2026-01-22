import { getPineconeIndex } from "../config/pinecone";
import { createEmbedding } from "./embeddingService";

/**
 * Extract file paths from PR diff
 * Diffs usually start with "diff --git a/path/to/file b/path/to/file"
 */
const extractFilePathsFromDiff = (prDiff: string): string[] => {
  const filePaths = new Set<string>();

  // Match file paths in diff headers
  const diffHeaderRegex = /^diff --git a\/(.*?) b\//gm;
  let match;

  while ((match = diffHeaderRegex.exec(prDiff)) !== null) {
    if (match[1]) {
      filePaths.add(match[1]);
    }
  }

  // Also match paths in +++ and --- lines
  const pathRegex = /^(?:\+\+\+|---) [ab]\/(.*?)$/gm;

  while ((match = pathRegex.exec(prDiff)) !== null) {
    if (match[1]) {
      filePaths.add(match[1]);
    }
  }

  return Array.from(filePaths);
};

/**
 * Fetch context from Pinecone using optimized queries
 * Instead of embedding entire diff, we:
 * 1. Extract changed file paths from diff
 * 2. Query for chunks specifically from those files
 * 3. Also do a semantic search on diff summary for related files
 */
export const fetchContextFromPinecone = async (
  repoId: string,
  prDiff: string,
): Promise<string> => {
  const index = getPineconeIndex();

  try {
    // Extract file paths from diff
    const changedFiles = extractFilePathsFromDiff(prDiff);

    console.log(
      `[Context] Extracted ${changedFiles.length} changed files from diff`,
    );

    if (changedFiles.length === 0) {
      // Fallback to semantic search if no files found
      return semanticSearch(index, repoId, prDiff);
    }

    // Query for context from changed files
    // Note: Pinecone requires a vector for queries, so we use a dummy semantic search
    // and filter results by file path in memory
    const embedding = await createEmbedding(prDiff.slice(0, 3000));

    const result = await index.namespace(repoId).query({
      vector: embedding,
      topK: 20, // Get more results to filter
      includeMetadata: true,
    });

    // Filter matches to only include changed files
    const fileSet = new Set(changedFiles);
    const relevantMatches = (result.matches || []).filter(
      (m: any) => m.metadata?.filePath && fileSet.has(m.metadata.filePath),
    );

    console.log(
      `[Context] Found ${relevantMatches.length} relevant chunks from changed files`,
    );

    // Combine contexts from relevant matches
    const contexts = relevantMatches
      .map((m: any) => m.metadata?.content || "")
      .filter((c: string) => c && c.trim());

    if (contexts.length === 0) {
      // Fallback to general semantic search
      return semanticSearch(index, repoId, prDiff.slice(0, 3000), 5);
    }

    console.log(`[Context] Retrieved ${contexts.length} context chunks`);

    return contexts.join("\n\n");
  } catch (err: any) {
    console.error("[Context] Failed to fetch context:", err.message);
    return "Error fetching context.";
  }
};

/**
 * Semantic search using embeddings
 */
async function semanticSearch(
  index: any,
  repoId: string,
  text: string,
  topK: number = 5,
): Promise<string> {
  try {
    const embedding = await createEmbedding(text);

    const result = await index.namespace(repoId).query({
      vector: embedding,
      topK,
      includeMetadata: true,
    });

    return (
      result.matches
        ?.map((m: any) => m.metadata?.content || "")
        .filter((c: string) => c.trim())
        .join("\n\n") || ""
    );
  } catch (err) {
    console.error("[Context] Semantic search failed:", err);
    return "";
  }
}
