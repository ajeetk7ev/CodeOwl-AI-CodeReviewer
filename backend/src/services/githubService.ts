import { Octokit } from "@octokit/rest";

export const getOctokit = (token: string) => {
  return new Octokit({
    auth: token,
  });
};

export const fetchUserRepositories = async (token: string) => {
  const octokit = getOctokit(token);

  const { data } = await octokit.repos.listForAuthenticatedUser({
    per_page: 100,
  });

  return data;
};
