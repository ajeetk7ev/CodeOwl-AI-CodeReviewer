import mongoose from "mongoose";
import dotenv from "dotenv";
import PullRequest from "./src/models/PullRequest";
import fs from "fs";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  const prs = await PullRequest.find().sort({ createdAt: -1 }).limit(10);
  let output = "--- LATEST PULL REQUESTS ---\n";
  prs.forEach((p) => {
    output += `PR #${p.prNumber} | Status: ${p.status} | Created: ${p.createdAt}\n`;
  });
  fs.writeFileSync("pr-output.txt", output);
  console.log("Output written to pr-output.txt");
  await mongoose.connection.close();
};

run();
