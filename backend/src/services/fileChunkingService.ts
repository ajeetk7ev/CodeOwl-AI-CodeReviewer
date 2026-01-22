import crypto from "crypto";

const CHUNK_SIZE = 1500; // characters
const CHUNK_OVERLAP = 200; // characters overlap between chunks

export interface FileChunk {
  id: string;
  content: string;
  metadata: {
    repoId: string;
    filePath: string;
    chunkIndex: number;
    totalChunks: number;
    startChar: number;
    endChar: number;
  };
}

/**
 * Chunk file content using sliding window approach
 * Ensures context preservation with overlap between chunks
 */
export const chunkFileContent = (
  repoId: string,
  filePath: string,
  content: string,
): FileChunk[] => {
  const chunks: FileChunk[] = [];

  // If content is smaller than chunk size, return single chunk
  if (content.length <= CHUNK_SIZE) {
    const chunkId = generateChunkId(repoId, filePath, 0);
    return [
      {
        id: chunkId,
        content: content,
        metadata: {
          repoId,
          filePath,
          chunkIndex: 0,
          totalChunks: 1,
          startChar: 0,
          endChar: content.length,
        },
      },
    ];
  }

  // Sliding window chunking
  let startPos = 0;
  let chunkIndex = 0;

  while (startPos < content.length) {
    const endPos = Math.min(startPos + CHUNK_SIZE, content.length);
    const chunkContent = content.slice(startPos, endPos);

    const chunkId = generateChunkId(repoId, filePath, chunkIndex);

    chunks.push({
      id: chunkId,
      content: chunkContent,
      metadata: {
        repoId,
        filePath,
        chunkIndex,
        totalChunks: 0, // Will update after loop
        startChar: startPos,
        endChar: endPos,
      },
    });

    // Move forward, accounting for overlap
    startPos += CHUNK_SIZE - CHUNK_OVERLAP;
    chunkIndex++;
  }

  // Update total chunks count
  chunks.forEach((chunk) => {
    chunk.metadata.totalChunks = chunks.length;
  });

  console.log(`[Chunking] Split ${filePath} into ${chunks.length} chunks`);
  return chunks;
};

/**
 * Generate stable, deterministic chunk ID
 * Same file + chunk index = same ID (important for re-indexing)
 */
const generateChunkId = (
  repoId: string,
  filePath: string,
  chunkIndex: number,
): string => {
  const input = `${repoId}:${filePath}:chunk-${chunkIndex}`;
  return crypto.createHash("sha256").update(input).digest("hex");
};

/**
 * Check if file should be chunked based on type
 * Some binary or very small files don't benefit from chunking
 */
export const shouldChunkFile = (filePath: string, size: number): boolean => {
  // Don't chunk small files
  if (size < CHUNK_SIZE) return false;

  // Don't chunk binary files
  const binaryExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".pdf",
    ".zip",
    ".tar",
    ".gz",
    ".exe",
    ".bin",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
  ];

  const ext = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
  return !binaryExtensions.includes(ext);
};
