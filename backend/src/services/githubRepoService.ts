import { Octokit } from "@octokit/rest";

export const getRepoFiles = async (
  token: string,
  owner: string,
  repo: string
) => {
  const octokit = new Octokit({ auth: token });

  const files = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: "",
  });

  return files.data;
};
