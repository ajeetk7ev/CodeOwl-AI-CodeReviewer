import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_WEBHOOK_SECRET =
  process.env.GITHUB_WEBHOOK_SECRET ||
  "bf49172d6b29ff758136526cbd5810f67166d7dca57366934961cf7cea470ddf";
const WEBHOOK_URL = "http://localhost:5001/api/webhooks/github";

const payload = {
  action: "opened",
  repository: {
    full_name: "ajeetk7ev/Leetcode-500QS",
  },
  pull_request: {
    number: 1,
    title: "Test PR for AI Review",
    user: {
      login: "ajeetk7ev",
    },
    state: "open",
    html_url: "https://github.com/ajeetk7ev/Leetcode-500QS/pull/1",
  },
};

const sendWebhook = async () => {
  try {
    const body = JSON.stringify(payload);
    const hmac = crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET);
    const signature = "sha256=" + hmac.update(body).digest("hex");

    console.log("Sending webhook to:", WEBHOOK_URL);
    console.log("Signature:", signature);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      body: body,
      headers: {
        "x-github-event": "pull_request",
        "x-hub-signature-256": signature,
        "content-type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Response:", response.status, data);
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

sendWebhook();
