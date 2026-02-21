# Replicate API Starter Kit

> Validated reference for AI image generation via Replicate (Feb 2026)

---

## Quick Decision Guide

**Pick your model based on the task:**

| Task | Model | Why |
|------|-------|-----|
| README banner WITH text/title | `ideogram-ai/ideogram-v2` | Only model with reliable typography |
| README banner WITHOUT text | `black-forest-labs/flux-1.1-pro` | Best quality/speed balance |
| Quick test/iteration | `black-forest-labs/flux-schnell` | Cheapest ($0.003), fast |
| Character/avatar with consistent face | `google/nano-banana-pro` | Requires reference image |
| Print-quality (4MP+) | `black-forest-labs/flux-1.1-pro-ultra` | Highest resolution |

**Decision Tree:**
```
Need text in image?
  YES → ideogram-ai/ideogram-v2 ($0.08)
  NO → Need face consistency from reference?
         YES → google/nano-banana-pro ($0.025)
         NO → Is this production or test?
               TEST → flux-schnell ($0.003)
               PROD → flux-1.1-pro ($0.04)
```

---

## Prerequisites

### 1. Get API Token
```bash
# Go to: https://replicate.com/account/api-tokens
# Create token (starts with r8_)
```

### 2. Install Dependencies (if using SDK)
```bash
# Node.js project
npm install replicate

# Or with yarn
yarn add replicate
```

### 3. Set Environment Variable
```bash
# PowerShell
$env:REPLICATE_API_TOKEN = "r8_your_token_here"

# Bash/Zsh
export REPLICATE_API_TOKEN="r8_your_token_here"

# Or add to .env file (gitignored!)
REPLICATE_API_TOKEN=r8_your_token_here
```

---

## Authentication

```bash
# Set API token (PowerShell)
$env:REPLICATE_API_TOKEN = "r8_your_token_here"

# Set API token (Bash)
export REPLICATE_API_TOKEN="r8_your_token_here"
```

Get token: https://replicate.com/account/api-tokens

---

## MCP Server Installation (VS Code)

The official Replicate MCP server enables natural language control of Replicate through Copilot.

### Package Info

- **Package**: `replicate-mcp` (v0.9.0+)
- **Publisher**: Replicate (official)
- **Docs**: https://replicate.com/docs/reference/mcp

### VS Code Configuration

Create `.vscode/mcp.json` in your workspace (or add to existing):

```json
{
  "servers": {
    "replicate": {
      "command": "npx",
      "args": ["-y", "replicate-mcp@latest", "--client=claude", "--tools=dynamic"],
      "env": {
        "REPLICATE_API_TOKEN": "${input:replicate_token}"
      }
    }
  },
  "inputs": [
    {
      "id": "replicate_token",
      "type": "promptString",
      "description": "Replicate API Token",
      "password": true
    }
  ]
}
```

### Secure Token Storage (Recommended)

**Alex users**: Use the **Secrets** feature in the Alex Welcome panel:
1. Open Command Palette → "Alex: Show Welcome"
2. Click **Secrets** in the sidebar
3. Add `REPLICATE_API_TOKEN` with your `r8_...` token
4. Token is stored securely in VS Code's SecretStorage

This avoids putting tokens in config files that might be committed to git.

### Configuration Options

| Option | Description |
|--------|-------------|
| `--client=claude` | Optimizes tool schemas for Claude/Copilot |
| `--tools=dynamic` | Enables dynamic endpoint discovery (recommended) |
| `--tools=static` | Loads all tools upfront (larger context) |
| `--resource=models` | Filter to specific API resources |
| `--operation=read` | Filter to read-only operations |

### Testing MCP Installation

After configuring, restart VS Code and ask Copilot:

```
"Search for flux models on Replicate"
```

If MCP is working, you'll see tool calls like `search_models` or `list_api_endpoints`.

### Troubleshooting MCP

**"MCP server not found"**
```
1. Ensure .vscode/mcp.json exists in workspace root
2. Restart VS Code after adding config
3. Check Output panel > MCP for errors
```

**"Authentication failed"**
```
1. Verify token starts with "r8_"
2. Check token hasn't expired at replicate.com/account/api-tokens
3. Token must be in env, not hardcoded in code
```

**"Tool not available"**
```
1. Try --tools=dynamic for full API access
2. Some tools need specific --resource filters
3. Check if model requires specific permissions
```

### Direct CLI Test

Verify the MCP server works standalone:

```bash
# PowerShell
$env:REPLICATE_API_TOKEN = "r8_your_token"
npx -y replicate-mcp@latest --list

# Shows available tools/endpoints
```

---

## JavaScript SDK Setup

```bash
npm install replicate
```

```javascript
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
```

---

## Recommended Models (Validated Feb 2026)

### Image Generation Models

| Model | ID | Cost | Best For | Notes |
|-------|-----|------|----------|-------|
| **Flux Schnell** | `black-forest-labs/flux-schnell` | $0.003 | Quick iteration, testing | Fast (1-3s), good quality |
| **Flux 1.1 Pro** | `black-forest-labs/flux-1.1-pro` | $0.04 | Production images, no text | High quality, 10-30s |
| **Flux 1.1 Pro Ultra** | `black-forest-labs/flux-1.1-pro-ultra` | $0.06 | Print quality (4MP) | Up to 4MP output |
| **Ideogram v2** | `ideogram-ai/ideogram-v2` | $0.08 | Typography, text in images | Crystal-clear text rendering |
| **Nano-Banana Pro** | `google/nano-banana-pro` | $0.025 | Face-consistent editing | Uses reference image input |

### When to Use Each Model

**Character Consistency (Reference Images)**
```
google/nano-banana-pro — Best for maintaining face identity across variations
Input: reference image (base64 data URI) + prompt
Output: edited image preserving face identity
```

**Clean Banners Without Text**
```
black-forest-labs/flux-1.1-pro — High quality, fast
Input: prompt + aspect_ratio + output_format
Output: image URL
```

**Banners With Typography**
```
ideogram-ai/ideogram-v2 — Perfect text rendering
Input: prompt + aspect_ratio + style_type + magic_prompt_option
Output: image URL
```

---

## Basic Usage Patterns

### Pattern 1: Simple Image Generation

```javascript
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";

const replicate = new Replicate();

// Run model and get output
const output = await replicate.run("black-forest-labs/flux-schnell", {
  input: {
    prompt: "A serene mountain landscape at sunset",
    aspect_ratio: "16:9",
    output_format: "png",
  },
});

// Output can be URL string or array - handle both
const imageUrl = Array.isArray(output) ? output[0] : output;

// Download and save
const response = await fetch(imageUrl.toString());
const buffer = Buffer.from(await response.arrayBuffer());
await writeFile("./output.png", buffer);
```

### Pattern 2: Face-Consistent Generation (Nano-Banana Pro)

```javascript
import Replicate from "replicate";
import { readFile, writeFile } from "node:fs/promises";

const replicate = new Replicate();

// Convert reference image to data URI
async function toDataURI(filepath) {
  const buffer = await readFile(filepath);
  const base64 = buffer.toString("base64");
  const ext = filepath.split(".").pop().toLowerCase();
  const mime = ext === "png" ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${base64}`;
}

// Generate with reference face
const reference = await toDataURI("./reference-face.png");
const output = await replicate.run("google/nano-banana-pro", {
  input: {
    prompt: "Professional headshot, business attire, confident smile",
    image: reference,
    aspect_ratio: "1:1",
    output_format: "png",
  },
});

// Save result
const response = await fetch(output.toString());
await writeFile("./avatar.png", Buffer.from(await response.arrayBuffer()));
```

### Pattern 3: Typography Banner (Ideogram v2)

```javascript
import Replicate from "replicate";

const replicate = new Replicate();

// CRITICAL: Ideogram parameter values are case-sensitive!
const output = await replicate.run("ideogram-ai/ideogram-v2", {
  input: {
    prompt: `Professional technology banner (3:1 ultra-wide format).

TITLE TEXT (large, centered):
"PROJECT NAME"
- Bold modern sans-serif, uppercase
- Electric blue gradient (#0078d4 to #7c3aed)
- Crystal clear, perfectly legible

VISUAL ELEMENTS:
- Sleek rocket ascending diagonally
- Particle effects and motion blur
- Deep space background with nebula colors

STYLE: Photorealistic 3D rendering with dramatic lighting`,
    aspect_ratio: "3:1",           // Ideogram's widest ratio
    magic_prompt_option: "On",     // MUST be "On" not "ON" or "on"
    style_type: "Realistic",       // MUST be "Realistic" not "REALISTIC"
    output_format: "png",
  },
});

// Handle Ideogram's unique URL output format
let imageUrl;
if (output && typeof output.url === "function") {
  imageUrl = output.url().toString();
} else if (typeof output === "object" && output.href) {
  imageUrl = output.href;
} else {
  imageUrl = output.toString();
}
```

---

## Critical Gotchas

### SDK vs HTTP API for Model Search

**Problem**: `replicate.models.list()` in the SDK doesn't work reliably for search.

**Solution**: Use direct HTTP fetch for model discovery:

```javascript
async function searchModels(query) {
  const response = await fetch(
    `https://api.replicate.com/v1/models?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data.results || [];
}

// Usage
const models = await searchModels("face editing");
models.forEach((m) => console.log(`${m.owner}/${m.name} - ${m.run_count} runs`));
```

### Ideogram Case Sensitivity

```javascript
// ❌ WRONG - Will fail validation
magic_prompt_option: "ON"      // Wrong case
magic_prompt_option: "on"      // Wrong case
style_type: "REALISTIC"        // Wrong case
style_type: "cinematic"        // Invalid value

// ✅ CORRECT - Exact case required
magic_prompt_option: "On"      // Or "Off" or "Auto"
style_type: "Realistic"        // Or "General" or "Design"
```

### Aspect Ratios by Model

```javascript
// Flux models (21:9 supported)
aspect_ratio: "21:9"  // Ultra-wide cinematic
aspect_ratio: "16:9"  // Standard widescreen
aspect_ratio: "3:4"   // Portrait
aspect_ratio: "1:1"   // Square (avatars)

// Ideogram v2 (different ratios)
aspect_ratio: "3:1"   // Widest available (use for banners)
aspect_ratio: "16:9"  // Standard
aspect_ratio: "1:1"   // Square

// ❌ Ideogram does NOT support 21:9
```

### Output Handling Variations

```javascript
// Models return different output formats - handle all:
async function handleOutput(output) {
  // Case 1: Array of URL strings (most common)
  if (Array.isArray(output)) {
    return output[0].toString();
  }

  // Case 2: Direct URL string
  if (typeof output === "string") {
    return output;
  }

  // Case 3: URL object
  if (output instanceof URL || output.href) {
    return output.href || output.toString();
  }

  // Case 4: Ideogram's getter function pattern
  if (output && typeof output.url === "function") {
    return output.url().toString();
  }

  // Case 5: ReadableStream (some models)
  if (output && output[Symbol.asyncIterator]) {
    const chunks = [];
    for await (const chunk of output) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  return output.toString();
}
```

---

## Rate Limits

- **predictions.create**: 600 requests/minute
- **All other endpoints**: 3000 requests/minute

**Rate limiting pattern**:
```javascript
async function rateLimitedGenerate(prompts, delayMs = 2000) {
  const results = [];
  for (const prompt of prompts) {
    const output = await replicate.run("model/name", { input: { prompt } });
    results.push(output);
    await new Promise((r) => setTimeout(r, delayMs)); // Wait between calls
  }
  return results;
}
```

---

## Cost Estimation

```javascript
function estimateCost(model, imageCount) {
  const costs = {
    "black-forest-labs/flux-schnell": 0.003,
    "black-forest-labs/flux-1.1-pro": 0.04,
    "black-forest-labs/flux-1.1-pro-ultra": 0.06,
    "ideogram-ai/ideogram-v2": 0.08,
    "google/nano-banana-pro": 0.025,
  };

  const unitCost = costs[model] || 0.04; // Default to Flux Pro
  const total = unitCost * imageCount;

  console.log(`Model: ${model}`);
  console.log(`Images: ${imageCount}`);
  console.log(`Estimated cost: $${total.toFixed(2)}`);

  return total;
}

// Usage before batch generation
estimateCost("google/nano-banana-pro", 90); // $2.25 for 90 avatars
```

---

## Complete Generation Script Template

```javascript
#!/usr/bin/env node
/**
 * Replicate Image Generation Script
 * Usage: node generate.js --prompt "description" --model flux-pro --dry-run
 */

import Replicate from "replicate";
import { writeFile, mkdir } from "node:fs/promises";
import path from "path";

// Models configuration
const MODELS = {
  "flux-schnell": { id: "black-forest-labs/flux-schnell", cost: 0.003 },
  "flux-pro": { id: "black-forest-labs/flux-1.1-pro", cost: 0.04 },
  "flux-ultra": { id: "black-forest-labs/flux-1.1-pro-ultra", cost: 0.06 },
  "ideogram": { id: "ideogram-ai/ideogram-v2", cost: 0.08 },
  "nano-banana": { id: "google/nano-banana-pro", cost: 0.025 },
};

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const modelArg = args.find((a) => a.startsWith("--model="))?.split("=")[1] || "flux-pro";
  const promptArg = args.find((a) => a.startsWith("--prompt="))?.split("=")[1];

  if (!promptArg) {
    console.error('Usage: node generate.js --prompt "description" --model flux-pro');
    process.exit(1);
  }

  const model = MODELS[modelArg];
  if (!model) {
    console.error(`Unknown model: ${modelArg}. Available: ${Object.keys(MODELS).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n🎨 Model: ${model.id}`);
  console.log(`💰 Cost: $${model.cost}`);
  console.log(`📝 Prompt: ${promptArg.slice(0, 50)}...`);

  if (dryRun) {
    console.log("\n🔍 DRY RUN - No image generated");
    return;
  }

  const replicate = new Replicate();
  console.log("\n⏳ Generating...");

  const output = await replicate.run(model.id, {
    input: {
      prompt: promptArg,
      aspect_ratio: "16:9",
      output_format: "png",
    },
  });

  // Handle output
  const imageUrl = Array.isArray(output) ? output[0] : output;
  const response = await fetch(imageUrl.toString());
  const buffer = Buffer.from(await response.arrayBuffer());

  // Save
  const outDir = "./output";
  await mkdir(outDir, { recursive: true });
  const filename = `${Date.now()}.png`;
  await writeFile(path.join(outDir, filename), buffer);

  console.log(`\n✅ Saved: ${outDir}/${filename}`);
}

main().catch(console.error);
```

---

## Troubleshooting

### "Authentication required" Error
```
Cause: REPLICATE_API_TOKEN not set or invalid
Fix: $env:REPLICATE_API_TOKEN = "r8_your_token"
```

### "Validation error" on Ideogram
```
Cause: Case-sensitive parameter values
Fix: Use exact case: "On", "Realistic", not "ON", "REALISTIC"
```

### "Rate limited" (429 Error)
```
Cause: Too many requests per minute
Fix: Add 2-3 second delays between calls
```

### Empty or null output
```
Cause: Model-specific output format differences
Fix: Use handleOutput() function to normalize all formats
```

### "Model not found" Error
```
Cause: Model version deprecated or ID changed
Fix: Search current models at replicate.com or use search API
```

---

## References

- API Docs: https://replicate.com/docs/reference/http
- Node.js Guide: https://replicate.com/docs/get-started/nodejs
- Model Explorer: https://replicate.com/explore
- Collections: https://replicate.com/collections
- Pricing: Each model page shows cost on "API" tab

---

**Last validated**: 2026-02-21 (MCP instructions added)
**Alex image generation**: Successfully used `google/nano-banana-pro` for 90+ face-consistent avatars at $0.025/image ($2.25 total)
