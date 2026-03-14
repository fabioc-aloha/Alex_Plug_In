---
name: gamma-presentations
description: >-
  Generate professional presentations using the Gamma API with expert storytelling consulting based on Duarte
  methodology.
applyTo: '**/*presentation*,**/*slides*,**/*deck*,**/*gamma*,**/*pitch*'
---

# Gamma Presentations Skill

> Generate professional presentations with expert storytelling consulting based on Duarte methodology.

> ⚠️ **Staleness Watch** (Last validated: Mar 2026 — API v1.0 GA): Check [developers.gamma.app](https://developers.gamma.app/) for endpoint changes and pricing updates.

---

## Slide Break Rules

When using `cardSplit: "inputTextBreaks"`, each `\n---\n` marks a **card break**:

```markdown
# Title Slide
Content

---

# Second Slide
More content
```

- `cardSplit: "inputTextBreaks"` — Gamma uses `---` breaks (ignores `numCards`)
- `cardSplit: "auto"` (default) — Gamma uses `numCards` (ignores `---` breaks)

---

## Prerequisites

- Gamma account (all plans have API access)
- API key from [gamma.app/settings](https://gamma.app/settings)
- Environment variable: `GAMMA_API_KEY`

### Pricing Tiers

| Plan | Price | Max Cards | Credits/mo |
|------|-------|-----------|------------|
| Free | $0 | 10 | 400 |
| Plus | $9/mo | 20 | 1,000 |
| Pro | $18/mo | 60 | 4,000 |
| Ultra | $90/mo | 75 | 20,000 |

**Rate limit:** 50 requests/hour.

---

## API Quick Reference

**Base URL:** `https://public-api.gamma.app`

**Auth:** `X-API-KEY: <your-api-key>`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1.0/generations` | POST | Generate from text |
| `/v1.0/generations/from-template` | POST | Create from template (beta) |
| `/v1.0/generations/{id}` | GET | Check status, get URLs |
| `/v1.0/themes` | GET | List themes |
| `/v1.0/folders` | GET | List folders |

---

## Generate Parameters

### Required

| Parameter | Type | Description |
|-----------|------|-------------|
| `inputText` | string | Content (max 100k tokens) |
| `textMode` | enum | `generate`, `condense`, `preserve` |

### Format Options

| Parameter | Default | Values |
|-----------|---------|--------|
| `format` | `presentation` | `presentation`, `document`, `social`, `webpage` |
| `numCards` | 10 | 1-10 (Free), 1-20 (Plus), 1-60 (Pro), 1-75 (Ultra) |
| `cardSplit` | `auto` | `auto`, `inputTextBreaks` |
| `additionalInstructions` | | Free text, 1-2000 chars |
| `themeId` | | Theme ID from /v1.0/themes |
| `folderIds` | | Array of folder IDs |

### Text Options

```json
"textOptions": {
  "amount": "medium",      // brief, medium, detailed, extensive
  "tone": "professional",  // 1-500 chars
  "audience": "executives", // 1-500 chars
  "language": "en"         // 60+ languages
}
```

### Image Options

```json
"imageOptions": {
  "source": "aiGenerated",  // aiGenerated, pictographic, pexels, giphy, webAllImages, webFreeToUse, webFreeToUseCommercially, placeholder, noImages
  "model": "flux-2-pro",    // see models below
  "style": "modern, minimal" // 1-500 chars
}
```

### Card Options

```json
"cardOptions": {
  "dimensions": "16x9",  // Presentation: fluid, 16x9, 4x3 | Document: fluid, pageless, letter, a4 | Social: 1x1, 4x5, 9x16
  "headerFooter": {
    "topRight": { "type": "image", "source": "themeLogo", "size": "sm" },
    "bottomRight": { "type": "cardNumber" },
    "bottomLeft": { "type": "text", "value": "© 2026 Company" },
    "hideFromFirstCard": true,
    "hideFromLastCard": true
  }
}
```

**Positions:** `topLeft`, `topRight`, `topCenter`, `bottomLeft`, `bottomRight`, `bottomCenter`
**Types:** `text` (+ `value`), `image` (+ `source`, `size`), `cardNumber`

### Sharing Options

```json
"sharingOptions": {
  "workspaceAccess": "view",     // noAccess, view, comment, edit, fullAccess
  "externalAccess": "noAccess",  // noAccess, view, comment, edit
  "emailOptions": {
    "recipients": ["user@example.com"],
    "access": "comment"
  }
}
```

### Export

```json
"exportAs": "pptx"  // or "pdf"
```

---

## AI Image Models

### Free Tier (2-10 cr)
| Model | API Value | Credits |
|-------|-----------|---------|
| Flux 2 Fast | `flux-2-klein` | 2 |
| Flux Kontext Fast | `flux-kontext-fast` | 2 |
| Imagen 3 Fast | `imagen-3-flash` | 2 |
| Luma Photon Flash | `luma-photon-flash-1` | 2 |
| Qwen Image Fast | `qwen-image-fast` | 3 |
| Ideogram 3 Turbo | `ideogram-v3-turbo` | 10 |

### Plus Tier (3-34 cr)
| Model | API Value | Credits |
|-------|-----------|---------|
| Qwen Image | `qwen-image` | 3 |
| Flux 2 Pro | `flux-2-pro` | 8 |
| Imagen 4 Fast | `imagen-4-fast` | 10 |
| Luma Photon | `luma-photon-1` | 10 |
| Recraft V4 | `recraft-v4` | 12 |
| Leonardo Phoenix | `leonardo-phoenix` | 15 |
| Gemini 2.5 Flash | `gemini-2.5-flash-image` | 20 |
| Nano Banana 2 Mini | `gemini-3.1-flash-image-mini` | 34 |

### Pro Tier (20-50 cr)
| Model | API Value | Credits |
|-------|-----------|---------|
| Flux 2 Flex | `flux-2-flex` | 20 |
| Flux 2 Max | `flux-2-max` | 20 |
| Flux Kontext Pro | `flux-kontext-pro` | 20 |
| Ideogram 3 | `ideogram-v3` | 20 |
| Imagen 4 | `imagen-4-pro` | 20 |
| Recraft V3 | `recraft-v3` | 20 |
| Gemini 3 Pro Image | `gemini-3-pro-image` | 20 |
| GPT Image | `gpt-image-1-medium` | 30 |
| DALL-E 3 | `dall-e-3` | 33 |
| Recraft V3 Vector | `recraft-v3-svg` | 40 |
| Recraft V4 Vector | `recraft-v4-svg` | 40 |
| Nano Banana 2 | `gemini-3.1-flash-image` | 50 |

### Ultra Tier (30-125 cr)
| Model | API Value | Credits |
|-------|-----------|---------|
| Imagen 4 Ultra | `imagen-4-ultra` | 30 |
| Ideogram 3 Quality | `ideogram-v3-quality` | 45 |
| Gemini 3 Pro Image HD | `gemini-3-pro-image-hd` | 70 |
| Nano Banana 2 HD | `gemini-3.1-flash-image-hd` | 75 |
| GPT Image Detailed | `gpt-image-1-high` | 120 |
| Recraft V4 Pro | `recraft-v4-pro` | 125 |

### Video Models (Ultra only)
| Model | API Value | Credits |
|-------|-----------|---------|
| Leonardo Motion 2 Fast | `leonardo-motion-2-fast` | 98 |
| Luma Ray 2 Flash | `luma-ray-2-flash` | 120 |
| Leonardo Motion 2 | `leonardo-motion-2` | 195 |
| Veo 3.1 Fast | `veo-3.1-fast` | 300 |
| Luma Ray 2 | `luma-ray-2` | 350 |
| Veo 3.1 | `veo-3.1` | 800 |

### Deprecated (auto-redirect)
| Old | New |
|-----|-----|
| `flux-1-quick` | `flux-2-klein` |
| `flux-1-pro` | `flux-2-pro` |
| `flux-1-ultra` | `flux-2-max` |
| `flux-kontext-max` | `flux-2-flex` |
| `playground-3` | `flux-2-pro` |
| `imagen-3-pro` | `imagen-4-pro` |

---

## Create from Template (Beta)

```bash
POST /v1.0/generations/from-template
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `gammaId` | Yes | Template Gamma ID |
| `prompt` | Yes | Fill instructions |
| `themeId` | No | Override theme |
| `folderIds` | No | Save to folders |
| `exportAs` | No | `pptx` or `pdf` |

---

## Response Handling

### POST Response
```json
{ "generationId": "gen_abc123", "status": "pending" }
```

### GET Completed
```json
{
  "generationId": "gen_abc123",
  "status": "completed",
  "gammaUrl": "https://gamma.app/docs/xyz",
  "pptxUrl": "https://...",
  "pdfUrl": "https://...",
  "creditsUsed": 45
}
```

### Polling Pattern

```javascript
async function waitForGeneration(generationId, apiKey) {
  const maxAttempts = 30; // 60s for images, 300 for video
  const delayMs = 2000;
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`https://public-api.gamma.app/v1.0/generations/${generationId}`,
      { headers: { 'X-API-KEY': apiKey } });
    const data = await res.json();
    if (data.status === 'completed') return data;
    if (data.status === 'failed') throw new Error(data.error);
    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error('Generation timeout');
}
```

---

## Example Request

```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H 'Content-Type: application/json' \
  -H 'X-API-KEY: sk-gamma-xxx' \
  -d '{
    "inputText": "Our startup solves remote collaboration with AI-powered async video.",
    "textMode": "generate",
    "format": "presentation",
    "numCards": 12,
    "textOptions": { "tone": "confident, visionary", "audience": "investors" },
    "imageOptions": { "source": "aiGenerated", "model": "flux-2-pro" },
    "cardOptions": { "dimensions": "16x9" },
    "exportAs": "pptx"
  }'
```

---

## MCP Integration

Gamma provides a hosted MCP server (Claude, Make, Zapier, Workato, N8N).

| Tool | Capability |
|------|------------|
| `generate_content` | Create presentations, docs, webpages, social |
| `browse_themes` | Search theme library |
| `organize_folders` | Save to folders |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Insufficient credits | Check gamma.app/settings/billing |
| 401 Unauthorized | Verify API key |
| Timeout | Increase polling (2-3 min images, 10 min video) |
| Token limit | Max 100k tokens; use `condense` mode |

---

## CLI Script

**Location:** `.github/muscles/gamma-generator.cjs`

```bash
# From file with export + auto-open
node .github/muscles/gamma-generator.cjs -f README.md -e pptx --open -n 12 -d 16x9

# Draft workflow (no credits)
node .github/muscles/gamma-generator.cjs -t "AI Ethics" --draft --open
node .github/muscles/gamma-generator.cjs -f exports/ai-ethics-draft.md -e pptx --open -n 12 -d 16x9
```

> ⚠️ **Critical**: For file-based generation, always pass both `--slides` and `--dimensions 16x9`. Without `--slides`, Gamma can condense multiple sections into fewer slides. Without `--dimensions`, Gamma may default to fluid layout.

| Option | Short | Description |
|--------|-------|-------------|
| `--topic` | `-t` | Topic to generate |
| `--file` | `-f` | Path to content file |
| `--format` | | presentation, document, social, webpage |
| `--slides` | `-n` | Number of slides (1-75) |
| `--tone` | | Tone description |
| `--audience` | | Target audience |
| `--language` | `-l` | Language code |
| `--image-model` | | AI model |
| `--image-style` | | Image style |
| `--dimensions` | `-d` | Card dimensions |
| `--export` | `-e` | pptx, pdf |
| `--output` | `-o` | Output directory |
| `--open` | | Auto-open result |
| `--draft` | | Generate template only |

---

## Related

- [.github/instructions/gamma-presentation.instructions.md](../../instructions/gamma-presentation.instructions.md) — Auto-activation rules
