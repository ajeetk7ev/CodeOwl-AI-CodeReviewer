import { z } from "zod";

export const connectRepoSchema = z.object({
  owner: z.string().min(1, "Owner is required"),
  name: z.string().min(1, "Repository name is required"),
  fullName: z.string().min(1, "Full name is required"),
});

export const githubWebhookSchema = z.object({
  action: z.string(),
  repository: z.object({
    full_name: z.string(),
  }),
  pull_request: z.object({
    number: z.number(),
    title: z.string(),
    user: z.object({
      login: z.string(),
    }),
    state: z.string(),
    html_url: z.string(),
  }),
});
