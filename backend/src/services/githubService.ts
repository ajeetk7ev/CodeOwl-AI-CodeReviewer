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

export const setupWebhook = async (
  token: string,
  owner: string,
  repo: string,
) => {
  const octokit = getOctokit(token);
  const rawUrl = process.env.WEBHOOK_URL;

  if (!rawUrl || rawUrl.includes("your-public-url.ngrok-free.app")) {
    console.error(
      `[GitHub] WEBHOOK_URL is not configured or is using placeholder: ${rawUrl}`,
    );
    return;
  }

  const cleanUrl = rawUrl.replace(/\/$/, "");
  const webhookUrl = `${cleanUrl}/api/webhooks/github`;
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  try {
    const { data } = await octokit.repos.createWebhook({
      owner,
      repo,
      config: {
        url: webhookUrl,
        content_type: "json",
        secret,
        insecure_ssl: "0",
      },
      events: ["pull_request"],
      active: true,
    });

    console.log(`[GitHub] Webhook created for ${owner}/${repo}: ${data.id}`);
    return data.id;
  } catch (error: any) {
    if (error.status === 422) {
      console.log(`[GitHub] Webhook already exists for ${owner}/${repo}`);
      // find existing webhook to return id if possible
      const { data: hooks } = await octokit.repos.listWebhooks({ owner, repo });
      const existing = hooks.find((h) => h.config.url === webhookUrl);
      return existing?.id;
    } else {
      console.error(
        `[GitHub] Failed to create webhook for ${owner}/${repo}:`,
        error.message,
      );
    }
  }
};

export const removeWebhook = async (
  token: string,
  owner: string,
  repo: string,
  webhookId: number,
) => {
  const octokit = getOctokit(token);

  try {
    await octokit.repos.deleteWebhook({
      owner,
      repo,
      hook_id: webhookId,
    });
    console.log(`[GitHub] Webhook ${webhookId} removed for ${owner}/${repo}`);
  } catch (error: any) {
    console.error(
      `[GitHub] Failed to remove webhook ${webhookId} for ${owner}/${repo}:`,
      error.message,
    );
  }
};

export const updateWebhook = async (
  token: string,
  owner: string,
  repo: string,
  webhookId: number,
) => {
  const octokit = getOctokit(token);
  const rawUrl = process.env.WEBHOOK_URL;

  if (!rawUrl || rawUrl.includes("your-public-url.ngrok-free.app")) {
    console.error("[GitHub] Valid WEBHOOK_URL required for sync");
    return;
  }

  const cleanUrl = rawUrl.replace(/\/$/, "");
  const webhookUrl = `${cleanUrl}/api/webhooks/github`;
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  try {
    await octokit.repos.updateWebhook({
      owner,
      repo,
      hook_id: webhookId,
      config: {
        url: webhookUrl,
        content_type: "json",
        secret,
        insecure_ssl: "0",
      },
    });
    console.log(`[GitHub] Webhook ${webhookId} updated for ${owner}/${repo}`);
  } catch (error: any) {
    console.error(
      `[GitHub] Failed to update webhook ${webhookId} for ${owner}/${repo}:`,
      error.message,
    );
  }
};
