#!/usr/bin/env node

/**
 * Generate GCX Coworker agent profile picture variants
 *
 * Usage:
 *   node scripts/generate-gcx-coworker-icon.js [--dry-run] [--count=10]
 *
 * Cost: ~$0.08 per image (Ideogram v2)
 */

import Replicate from "replicate";
import fs from "fs-extra";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";
import { config as loadEnv } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");

loadEnv({ path: path.join(ROOT, ".env") });

const DRY_RUN = process.argv.includes("--dry-run");
const COUNT = (() => {
  const arg = process.argv.find((a) => a.startsWith("--count="));
  return arg ? parseInt(arg.split("=")[1], 10) || 10 : 10;
})();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const OUTPUT_DIR = path.join(
  ROOT,
  "alex_docs",
  "gcx-coworker",
  "icon-variants",
);

const REFERENCE_IMAGE = path.join(
  ROOT,
  "alex_docs",
  "gcx-coworker",
  "getsitelogo.png",
);

const PROMPT_VARIANTS = [
  "Logo on clean white background. A stylized letter C formed by overlapping colorful gradient ribbon curves. The C shape is open on the right side with a white diamond-shaped negative space at center. Ribbons flow in spectrum order: green, teal, blue, purple, magenta, red, orange. Clean vector flat design. No other text or letters.",
  "Brand logo on white background. Bold letter C made of four smooth curved overlapping ribbon segments. Each ribbon a different gradient: teal-to-green at top, blue-to-navy at right, pink-to-magenta at bottom, orange-to-red at left. C opens to the right. White geometric cutout at center. Minimalist flat vector.",
  "Vibrant letter C logo on white background. The C is constructed from interlocking curved gradient petal shapes, open on the right. Rich color spectrum: lime-green, cyan, cobalt-blue, violet, fuchsia, coral, amber. Rotated white square opening at center. Clean modern brand identity.",
  "Abstract letter C emblem on white background. Flowing gradient ribbons curve to form a C shape, open on the right side. Each quadrant a different vivid gradient: green-teal, blue-indigo, purple-pink, red-orange. White diamond gap in the middle. Flat vector design.",
  "Bold stylized C logo on white background. Overlapping translucent curved bands forming the letter C, open to the right. Smooth gradients across spectrum: chartreuse, aqua, royal blue, violet, rose, scarlet, gold. White rhombus void at center. Clean vector style.",
  "Professional letter C logo on white background. Four curved gradient ribbon petals arranged to form a C shape. Colors flow from warm orange through red, magenta, purple, blue, teal to green around the curve. Open on the right side. White center. Modern flat design.",
  "Sleek letter C brand mark on white background. Continuous gradient ribbon forming the letter C, open at the right. Color segments: emerald, turquoise, sapphire, amethyst, magenta, crimson, tangerine. Diamond-shaped white space at center. Clean vector.",
  "Colorful letter C logo on white background. Broad curved overlapping gradient strokes forming a C shape, open to the right. Each stroke a different hue: green-cyan, blue-purple, pink-red, orange-yellow. White rotated square opening at center. Flat minimal design.",
  "Contemporary letter C brand logo on white background. Thick gradient ribbon arcs sweeping to form the letter C, open on the right. Spectrum from warm to cool: amber, coral, fuchsia, indigo, teal, lime. White geometric void at center. Flat vector style.",
  "Multicolor letter C logo on white background. Open C shape formed by four overlapping curved gradient ribbons. Top: green-to-teal. Upper-right: blue-to-navy. Bottom: pink-to-purple. Left: orange-to-red. White diamond cutout center. Modern professional brand mark.",
];

async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol
      .get(url, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          return downloadFile(response.headers.location, outputPath)
            .then(resolve)
            .catch(reject);
        }
        if (response.statusCode !== 200) {
          return reject(new Error(`HTTP ${response.statusCode}`));
        }
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });
        fileStream.on("error", reject);
      })
      .on("error", reject);
  });
}

function extractUrl(output) {
  let url;
  if (typeof output === "string") {
    url = output;
  } else if (Array.isArray(output) && output.length > 0) {
    const item = output[0];
    if (typeof item === "string") url = item;
    else if (item instanceof URL) url = item.href;
    else if (typeof item?.url === "function") url = item.url();
    else if (typeof item?.url === "string") url = item.url;
    else if (typeof item?.href === "string") url = item.href;
    else url = String(item);
  } else if (output instanceof URL) {
    url = output.href;
  } else if (output?.url) {
    url = typeof output.url === "function" ? output.url() : output.url;
  } else {
    url = String(output);
  }
  return url ? String(url) : null;
}

async function generateIcon() {
  console.log("GCX Coworker Icon Generator");
  console.log(`==========================\n`);
  console.log(`Variants: ${COUNT}`);
  console.log(`Output:   ${path.relative(ROOT, OUTPUT_DIR)}/\n`);

  // Verify reference image exists
  if (!fs.existsSync(REFERENCE_IMAGE)) {
    console.error(`Reference image not found: ${REFERENCE_IMAGE}`);
    process.exit(1);
  }
  console.log(`Reference: ${path.relative(ROOT, REFERENCE_IMAGE)}\n`);

  if (DRY_RUN) {
    for (let i = 0; i < COUNT; i++) {
      const prompt = PROMPT_VARIANTS[i % PROMPT_VARIANTS.length];
      console.log(`[DRY-RUN] Variant ${String(i + 1).padStart(2, "0")}:`);
      console.log(`  ${prompt.slice(0, 120)}...\n`);
    }
    console.log(
      `Model: ideogram-ai/ideogram-v2 | 1:1 | ~$0.08/image | Total: ~$${(COUNT * 0.08).toFixed(2)}`,
    );
    return;
  }

  await fs.ensureDir(OUTPUT_DIR);

  for (let i = 0; i < COUNT; i++) {
    const num = String(i + 1).padStart(2, "0");
    const prompt = PROMPT_VARIANTS[i % PROMPT_VARIANTS.length];
    console.log(`[${num}/${String(COUNT).padStart(2, "0")}] Generating...`);

    const output = await replicate.run("ideogram-ai/ideogram-v2", {
      input: {
        prompt,
        image_prompt: fs.createReadStream(REFERENCE_IMAGE),
        aspect_ratio: "1:1",
        resolution: "1024x1024",
        style_type: "Design",
        magic_prompt_option: "Auto",
        negative_prompt:
          "text, letters, words, numbers, typography, watermark, signature, photorealistic, photo, face, human face, realistic person, human body, silhouette, brain, neural network, AI entity, robot, android",
      },
    });

    const url = extractUrl(output);
    if (!url)
      throw new Error(`No URL in response ${num}: ${JSON.stringify(output)}`);

    const filePath = path.join(OUTPUT_DIR, `variant-${num}.png`);
    await downloadFile(url, filePath);

    const stats = fs.statSync(filePath);
    console.log(
      `  [OK] variant-${num}.png (${(stats.size / 1024).toFixed(0)} KB)`,
    );
  }

  console.log(
    `\n[DONE] ${COUNT} variants saved to ${path.relative(ROOT, OUTPUT_DIR)}/`,
  );
  console.log(
    `Review and pick a winner, then copy to platforms/gcx-coworker/appPackage/`,
  );
}

generateIcon().catch((err) => {
  console.error(`FAILED: ${err.message}`);
  process.exit(1);
});
