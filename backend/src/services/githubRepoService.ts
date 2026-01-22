import { Octokit } from "@octokit/rest";

/**
 * Recursively fetch ALL files from a repository using Git Tree API
 * This is much more efficient than traversing directories one by one
 */
export const fetchRepoTree = async (
  token: string,
  owner: string,
  repo: string,
  branch: string = "main",
): Promise<
  Array<{ path?: string; sha?: string; size?: number; type?: string }>
> => {
  const octokit = new Octokit({ auth: token });

  try {
    // Get the tree recursively
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: "1", // This is the key - fetches entire tree
    });

    // Filter to only blob types (files, not directories)
    const files = data.tree.filter((item) => item.type === "blob");

    console.log(`[GitHub] Fetched ${files.length} files from ${owner}/${repo}`);
    return files;
  } catch (error: any) {
    // If main branch doesn't exist, try master
    if (error.status === 404 && branch === "main") {
      console.log(`[GitHub] 'main' branch not found, trying 'master'`);
      return fetchRepoTree(token, owner, repo, "master");
    }
    throw error;
  }
};

/**
 * Fetch file contents in parallel batches
 */
export const fetchFileContents = async (
  token: string,
  owner: string,
  repo: string,
  files: Array<{ path?: string; sha?: string; size?: number }>,
) => {
  const octokit = new Octokit({ auth: token });

  const results = await Promise.all(
    files.map(async (file) => {
      try {
        if (!file.path || !file.sha) return null;

        // Fetch blob content using SHA (more efficient than path-based)
        const { data } = await octokit.git.getBlob({
          owner,
          repo,
          file_sha: file.sha,
        });

        return {
          path: file.path,
          content: data.content,
          encoding: data.encoding,
          size: file.size || 0,
        };
      } catch (err: any) {
        console.warn(`[GitHub] Failed to fetch ${file.path}:`, err.message);
        return null;
      }
    }),
  );

  return results.filter((r) => r !== null);
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use fetchRepoTree instead
 */
export const getRepoFiles = async (
  token: string,
  owner: string,
  repo: string,
) => {
  const octokit = new Octokit({ auth: token });

  const files = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: "",
  });

  return files.data;
};
