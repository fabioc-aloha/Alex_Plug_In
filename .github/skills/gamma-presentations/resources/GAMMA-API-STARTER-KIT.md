# Gamma API Starter Kit

> Validated reference for AI presentation generation via Gamma (Feb 2026)

---

## Quick Decision Guide

**Pick your output format:**

| Task | Format | Why |
|------|--------|-----|
| Slide deck / pitch | `presentation` | Standard deck with transitions |
| Long-form report | `document` | Scrollable, structured document |
| Instagram/TikTok carousel | `social` | Card-based social content |
| Landing page | `webpage` | Web-ready single page |

**Pick your image model by budget:**

| Tier | Models | Credits/Image | When to Use |
|------|--------|---------------|-------------|
| **Basic** | `flux-quick`, `flux-kontext`, `imagen-flash`, `luma-flash` | ~2 | Testing, drafts |
| **Standard** | `flux-pro`, `imagen-pro`, `ideogram-turbo`, `leonardo` | ~8-15 | Most presentations |
| **Premium** | `ideogram`, `imagen4`, `gemini`, `recraft`, `gpt-image`, `dalle3` | ~20-33 | Client-facing work |
| **Ultra** | `flux-ultra`, `imagen4-ultra`, `recraft-svg`, `gpt-image-hd` | ~40-120 | Print/high-res needs |

**Decision Tree:**
```
What format?
  SLIDES → format: "presentation"
  DOCUMENT → format: "document"
  SOCIAL → format: "social"
  WEBPAGE → format: "webpage"

Image quality needed?
  DRAFT/TEST → image-model: flux-quick (~2 credits)
  PRODUCTION → image-model: flux-pro (~15 credits)
  PREMIUM → image-model: ideogram (~20 credits)
```

**Credit Estimation:**
```
Base: numCards × 3-4 credits
+ Images: numCards × model_credits
≈ 10-slide deck with flux-pro = 40 + 150 = ~190 credits
```

---

## Prerequisites

### 1. Get API Key
```bash
# Go to: https://gamma.app/settings
# Generate API key (starts with sk-gamma-)
# Requires Pro, Ultra, Teams, or Business subscription
```

### 2. Node.js Required
```bash
# Verify Node.js is installed
node --version  # Should be v18+ recommended
```

### 3. NO npm Install Needed!
The `gamma-generator.js` muscle uses only native Node.js modules (fs, path, https).
No `npm install` required.

### 4. Set Environment Variable
```bash
# PowerShell
$env:GAMMA_API_KEY = "sk-gamma-your_key_here"

# Bash/Zsh
export GAMMA_API_KEY="sk-gamma-your_key_here"

# Or add to .env file (gitignored!)
GAMMA_API_KEY=sk-gamma-your_key_here
```

---

## Authentication

### API Key Header
```bash
X-API-KEY: sk-gamma-your_key_here
```

### Get API Key
1. Go to https://gamma.app/settings
2. Navigate to API section
3. Generate new key (Pro+ subscription required)

### Secure Storage (Alex Users)

**Recommended**: Use the **Secrets** feature in the Alex Welcome panel:
1. Open Command Palette → "Alex: Show Welcome"
2. Click **Secrets** in the sidebar
3. Add `GAMMA_API_KEY` with your `sk-gamma-...` key
4. Token is stored securely in VS Code's SecretStorage

---

## Usage Methods

### Method 1: Right-Click Context Menu (VS Code)

1. Right-click any `.md` file in Explorer
2. Select **"Generate Gamma Presentation"** or **"Generate Gamma Presentation (Advanced)..."**
3. Presentation generates and opens automatically

### Method 2: Agentic Chat

Ask Copilot/Alex directly:
```
Create a presentation about machine learning basics
```
or
```
/gamma Introduction to AI --slides 12 --export pptx --open
```

### Method 3: Direct Script Execution

```bash
# Simple topic
node .github/muscles/gamma-generator.js --topic "AI Ethics" --export pptx --open

# From markdown file
node .github/muscles/gamma-generator.js --file ./my-content.md --export pptx --open

# Advanced customization
node .github/muscles/gamma-generator.js \
  --topic "Q4 Results" \
  --slides 15 \
  --tone "professional, confident" \
  --audience "executives" \
  --image-model flux-pro \
  --export pptx \
  --open
```

---

## API Parameters Reference

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `inputText` | string | Topic or content (max 400K chars) |
| `textMode` | enum | `generate` \| `condense` \| `preserve` |

### Optional Parameters

| Parameter | Default | Options |
|-----------|---------|---------|
| `format` | `presentation` | `presentation`, `document`, `social`, `webpage` |
| `numCards` | `10` | 1-60 (Pro), 1-75 (Ultra) |
| `exportAs` | — | `pptx`, `pdf` |
| `themeId` | workspace default | Theme ID from GET /themes |
| `cardSplit` | `auto` | `auto`, `inputTextBreaks` |

### textOptions

| Parameter | Default | Description |
|-----------|---------|-------------|
| `amount` | `medium` | `brief`, `medium`, `detailed`, `extensive` |
| `tone` | — | e.g., "professional, inspiring" |
| `audience` | — | e.g., "executives", "developers" |
| `language` | `en` | ISO language code |

### imageOptions

| Parameter | Default | Description |
|-----------|---------|-------------|
| `source` | `aiGenerated` | See source options below |
| `model` | auto-selected | See model tiers above |
| `style` | — | e.g., "photorealistic", "minimal line art" |

**Image Source Options:**
- `aiGenerated` — AI-generated images (uses credits)
- `pictographic` — Pictographic library
- `pexels` — Pexels stock photos
- `giphy` — GIFs from Giphy
- `webAllImages` — Web images (any license)
- `webFreeToUse` — Personal use licensed
- `webFreeToUseCommercially` — Commercial license
- `placeholder` — Empty placeholders
- `noImages` — No images at all

### cardOptions

| Parameter | Options by Format |
|-----------|-------------------|
| `dimensions` | **presentation**: `fluid`, `16x9`, `4x3` |
| | **document**: `fluid`, `pageless`, `letter`, `a4` |
| | **social**: `1x1`, `4x5`, `9x16` |

---

## Image Models (Full Reference)

### Basic Tier (~2 credits/image)
```javascript
'flux-quick'    → 'flux-1-quick'
'flux-kontext'  → 'flux-kontext-fast'
'imagen-flash'  → 'imagen-3-flash'
'luma-flash'    → 'luma-photon-flash-1'
```

### Standard Tier (~8-15 credits/image)
```javascript
'flux-pro'        → 'flux-1-pro'          // RECOMMENDED for most uses
'imagen-pro'      → 'imagen-3-pro'
'ideogram-turbo'  → 'ideogram-v3-turbo'
'leonardo'        → 'leonardo-phoenix'
```

### Premium Tier (~20-33 credits/image)
```javascript
'ideogram'   → 'ideogram-v3'
'imagen4'    → 'imagen-4-pro'
'gemini'     → 'gemini-2.5-flash-image'
'recraft'    → 'recraft-v3'
'gpt-image'  → 'gpt-image-1-medium'
'dalle3'     → 'dall-e-3'
```

### Ultra Tier (~40-120 credits/image)
```javascript
'flux-ultra'    → 'flux-1-ultra'
'imagen4-ultra' → 'imagen-4-ultra'
'recraft-svg'   → 'recraft-v3-svg'
'gpt-image-hd'  → 'gpt-image-1-high'
```

---

## Two-Step Workflow (Recommended for Custom Content)

```bash
# Step 1: Generate draft markdown
node .github/muscles/gamma-generator.js --topic "My Topic" --draft

# Step 2: Edit the generated markdown file
# Opens: ./exports/my-topic-draft.md

# Step 3: Generate from edited file
node .github/muscles/gamma-generator.js --file ./exports/my-topic-draft.md --export pptx --open
```

---

## Troubleshooting

### "GAMMA_API_KEY environment variable is required"
```
Cause: API key not set
Fix (PowerShell): $env:GAMMA_API_KEY = "sk-gamma-xxx"
Fix (Alex): Add to Secrets via Welcome panel
```

### "Insufficient credits"
```
Cause: Account doesn't have enough credits
Fix: Purchase credits at gamma.app/settings/billing
Tip: Use flux-quick for testing (~2 credits vs ~15)
```

### "Generation timeout"
```
Cause: Complex generation took too long
Fix: Increase timeout with --timeout 300000 (5 min)
Tip: Reduce numCards or use simpler image model
```

### "gamma-generator.js not found"
```
Cause: Alex architecture not initialized in workspace
Fix: Run "Alex: Initialize Architecture" command
```

### Right-click menu doesn't work
```
Cause: File must be .md and in a workspace
Fix: Ensure file is markdown and workspace is open
Fix: Check Secrets for GAMMA_API_KEY
```

### "Exit code 1" without details
```
Cause: API returned error
Fix: Check gamma.app for service status
Fix: Verify API key is valid and not expired
Fix: Check input text isn't too long (>400K chars)
```

---

## Credit Cost Estimation

```javascript
function estimateCredits(numCards, imageModel) {
  const cardCredits = numCards * 3.5;  // ~3-4 per card

  const imageCosts = {
    'flux-quick': 2,      'flux-kontext': 2,
    'flux-pro': 15,       'imagen-pro': 12,
    'ideogram-turbo': 10, 'leonardo': 8,
    'ideogram': 20,       'imagen4': 25,
    'gpt-image': 30,      'dalle3': 33,
    'flux-ultra': 40,     'gpt-image-hd': 120,
  };

  const imageCredits = numCards * (imageCosts[imageModel] || 15);
  const total = cardCredits + imageCredits;

  console.log(`Cards (${numCards}): ~${cardCredits} credits`);
  console.log(`Images (${imageModel}): ~${imageCredits} credits`);
  console.log(`Total estimate: ~${Math.round(total)} credits`);

  return total;
}

// Examples:
estimateCredits(10, 'flux-quick');   // ~55 credits (testing)
estimateCredits(10, 'flux-pro');     // ~185 credits (production)
estimateCredits(15, 'ideogram');     // ~352 credits (premium)
```

---

## Gamma MCP (Hosted Connector)

Gamma provides a **hosted MCP server** called "Gamma Connector" for Claude and other AI tools.

### Setup for Claude Desktop
1. Open Claude → Settings → Connectors
2. Click "Browse Connectors" → Search "Gamma"
3. Click Connect → Allow access to your Gamma account

### Note for VS Code/Copilot
Gamma's MCP is **hosted** (not local like Replicate). It requires OAuth connection through Claude's connector system. For VS Code, use the `gamma-generator.js` script directly instead.

---

## API Endpoint Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1.0/generations` | POST | Start generation |
| `/v1.0/generations/{id}` | GET | Check status |
| `/v1.0/themes` | GET | List workspace themes |
| `/v1.0/folders` | GET | List workspace folders |

### Base URL
```
https://public-api.gamma.app
```

### Example cURL
```bash
curl --request POST \
  --url https://public-api.gamma.app/v1.0/generations \
  --header 'Content-Type: application/json' \
  --header 'X-API-KEY: sk-gamma-xxx' \
  --data '{
    "inputText": "Introduction to Machine Learning",
    "textMode": "generate",
    "format": "presentation",
    "numCards": 10,
    "exportAs": "pptx"
  }'
```

---

## References

- API Docs: https://developers.gamma.app/docs
- Parameter Reference: https://developers.gamma.app/docs/generate-api-parameters-explained
- Pricing & Credits: https://developers.gamma.app/docs/get-access
- MCP Connector: https://developers.gamma.app/docs/gamma-mcp-server
- Themes/Folders: https://developers.gamma.app/docs/list-themes-and-list-folders-apis-explained
- Help: https://developers.gamma.app/docs/get-help

---

**Last validated**: 2026-02-21
**API version**: v1.0
**Key insight**: No npm dependencies required — uses native Node.js only
