import { Octokit } from "@octokit/rest";

export const getOctokit = (token: string) => {
  return new Octokit({
    auth: token,
  });
};

export const fetchUserRepositories = async (
  token: string,
  page: number = 1,
  per_page: number = 15,
  visibility: "all" | "public" | "private" = "all",
) => {
  const octokit = getOctokit(token);

  const { data } = await octokit.repos.listForAuthenticatedUser({
    per_page,
    page,
    sort: "updated",
    direction: "desc",
    type: visibility,
  });

  return data;
};
