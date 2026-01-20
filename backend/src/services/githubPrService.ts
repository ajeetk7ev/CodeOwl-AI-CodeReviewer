import { Octokit } from "@octokit/rest";

export const getPrDiff = async (
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
) => {
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
    mediaType: { format: "diff" },
  });

  return data as unknown as string;
};

export const postPrComment = async (
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  comment: string,
) => {
  const octokit = new Octokit({ auth: token });

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: comment,
  });
};
