import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import http from "node:http";
import Replicate from "replicate";

const modelRef = "miike-ai/flux-ico:478cae37f1aec0fde7977fdd54b272aaeabede7d8060801841920c16306369a9";
const prompt = process.argv.slice(2).join(" ").trim() || "ICO minimal mission command dashboard icon, exactly three horizontal status bars stacked vertically, flat product icon, clean geometric shapes, navy and cyan, centered on plain light background, no ornament, no tattoo, no tribal art, no illustration, no text";

if (!process.env.REPLICATE_API_TOKEN) {
  console.error("Missing REPLICATE_API_TOKEN");
  process.exit(1);
}

const outputDir = path.resolve(
  "alex_docs/research/mockups/ai-experiments/fluxico-mission-command"
);
fs.mkdirSync(outputDir, { recursive: true });

function extractUrls(output) {
  if (typeof output === "string") return [output];
  if (Array.isArray(output)) {
    return output.map((item) => {
      if (typeof item === "string") return item;
      if (item?.url && typeof item.url === "function") return item.url().toString();
      if (item?.url) return item.url;
      return String(item);
    });
  }
  if (output?.url) {
    return [typeof output.url === "function" ? output.url().toString() : output.url];
  }
  if (output?.output) return extractUrls(output.output);
  return [];
}

function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destination);

    protocol
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          file.close();
          fs.rmSync(destination, { force: true });
          downloadFile(response.headers.location, destination).then(resolve).catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.rmSync(destination, { force: true });
          reject(new Error(`Download failed: HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (error) => {
        file.close();
        fs.rmSync(destination, { force: true });
        reject(error);
      });
  });
}

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
const input = {
  prompt,
  aspect_ratio: "1:1",
  output_format: "png",
  go_fast: true,
};

async function runWithRetry(model, payload, maxRetries = 4) {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await replicate.run(model, { input: payload });
    } catch (error) {
      const isRateLimit = error.message?.includes("429") || error.status === 429;
      if (!isRateLimit || attempt === maxRetries) {
        throw error;
      }

      const retryAfterMatch = error.message.match(/retry_after":(\d+)/i);
      const retryAfterSeconds = retryAfterMatch ? Number(retryAfterMatch[1]) : Math.min(2 ** (attempt + 1), 10);
      console.log(`RATE_LIMIT_RETRY ${attempt + 1} WAIT_SECONDS ${retryAfterSeconds}`);
      await new Promise((resolve) => setTimeout(resolve, retryAfterSeconds * 1000));
    }
  }

  throw new Error("Retry loop exited unexpectedly");
}

console.log(`MODEL ${modelRef}`);
console.log(`PROMPT ${prompt}`);

try {
  const startedAt = Date.now();
  const output = await runWithRetry(modelRef, input);
  const urls = extractUrls(output);

  if (urls.length === 0) {
    console.error("NO_OUTPUT_URLS");
    console.error(JSON.stringify(output, null, 2));
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const imagePath = path.join(outputDir, `${timestamp}_fluxico-test.png`);
  const reportPath = path.join(outputDir, `${timestamp}_fluxico-test.json`);

  await downloadFile(urls[0], imagePath);

  const report = {
    model: modelRef,
    prompt,
    input,
    outputUrls: urls,
    elapsedSeconds: Number(((Date.now() - startedAt) / 1000).toFixed(1)),
    savedImage: path.basename(imagePath),
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`SAVED_IMAGE ${imagePath}`);
  console.log(`SAVED_REPORT ${reportPath}`);
  console.log(`ELAPSED_SECONDS ${report.elapsedSeconds}`);
} catch (error) {
  console.error(`ERROR ${error.message}`);
  process.exit(1);
}
