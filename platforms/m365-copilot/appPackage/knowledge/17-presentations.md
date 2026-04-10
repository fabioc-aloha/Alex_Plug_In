# Presentation Creation, Gamma, and PowerPoint Generation

> Knowledge pack for M365 Agent Builder | Generated 2026-04-09

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

---

# PPTX Generation Skill

**Domain**: Presentation Generation  
**Purpose**: Programmatic PowerPoint creation via PptxGenJS  
**Expertise**: Data-driven slides, Markdown conversion, Alex brand templates  

---

## Capabilities

| Capability | Description |
|------------|-------------|
| **Markdown → PPTX** | Convert `.md` files to branded presentations |
| **Data-Driven Slides** | Generate charts/tables from JSON data |
| **Template System** | Alex brand Slide Masters (title, content, section, chart) |
| **Multi-Format Export** | File output or base64 for web delivery |

---

## Activation Triggers

- "create presentation", "generate slides", "make pptx"
- "convert markdown to powerpoint", "md to pptx"
- "data visualization slides", "chart presentation"
- "alex branded deck", "presentation template"

---

## Slide Types

| Type | Use Case | Data Shape |
|------|----------|-----------|
| `title` | Opening slide with main title + subtitle | `{ title, subtitle?, notes? }` |
| `content` | Bullet list slide | `{ title, bullets[], notes? }` |
| `section` | Section divider | `{ title, subtitle? }` |
| `chart` | Data visualization | `{ chartType, series[], title? }` |
| `table` | Tabular data | `{ headers[], rows[][] }` |
| `image` | Image slide | `{ path\|base64, caption? }` |
| `twoColumn` | Side-by-side content | `{ left: {title, bullets}, right: {title, bullets} }` |

---

## Chart Types

- `bar` — Category comparison
- `line` — Trend over time
- `pie` — Part-of-whole (use ≤6 segments)
- `doughnut` — Pie variant with center hole
- `area` — Volume over time
- `scatter` — Correlation analysis

---

## Alex Brand Colors

| Name | Fill | Text | Border |
|------|------|------|--------|
| Blue | `ddf4ff` | `0550ae` | `80ccff` |
| Green | `d3f5db` | `1a7f37` | `6fdd8b` |
| Purple | `d8b9ff` | `6639ba` | `bf8aff` |
| Gold | `fff8c5` | `9a6700` | `d4a72c` |
| Gray | `eaeef2` | `24292f` | `afb8c1` |

---

## Example: Markdown Input

```markdown
# Quarterly Review

## Executive Summary

---

# Q4 2024 Results

## Performance Overview

- Revenue up 23% YoY
- Customer acquisition: 1,200 new accounts
- NPS improved from 45 to 62

> Speaker notes: Highlight the NPS improvement as key win

---

## Next Quarter [section]

Focus areas for Q1 2025

---

# Strategic Priorities

- Expand enterprise segment
- Launch self-serve tier
- Hire 15 engineers
```

---

## Example: Programmatic API

```typescript
import { generateAndSavePresentation, SlideContent } from './pptxGenerator';

const slides: SlideContent[] = [
    { type: 'title', title: 'Q4 Review', subtitle: 'Performance & Strategy' },
    { type: 'content', title: 'Highlights', bullets: ['Revenue +23%', 'NPS 62'] },
    { type: 'chart', title: 'Revenue Trend', data: {
        chartType: 'line',
        series: [{ name: 'Revenue', labels: ['Q1','Q2','Q3','Q4'], values: [100,120,115,146] }]
    }}
];

await generateAndSavePresentation(slides, { title: 'Q4 Review' }, 'review.pptx');
```

---

## CLI Usage

```bash
# From markdown
npx ts-node .github/muscles/pptxgen-cli.ts --input slides.md --output deck.pptx

# Quick content
npx ts-node .github/muscles/pptxgen-cli.ts --content "Welcome to Alex|Point 1|Point 2" -o quick.pptx
```

---

## Integration Points

| Integration | Description |
|-------------|-------------|
| **Chat command** | `/pptx <topic>` to generate slides from topic |
| **Memory export** | Convert episodic memories to slides |
| **Skill output** | Any skill can request PPTX output |
| **Data connectors** | Azure SQL / Power BI → charts |

---

## Constraints

- Offline-only (no cloud dependencies)
- 16:9 default layout (4:3, 16:10 available)
- Max recommended: 50 slides per deck
- Images: local path, URL, or base64

---

# Presentation Tool Selection Skill

> Choose the right presentation tool for your use case — Slides, Pitch, or Auto.

Alex has three presentation generation capabilities. This skill provides the decision framework for selecting the optimal tool based on requirements.

---

## Tool Nicknames (Quick Reference)

| Nickname | Full Name | Remember As |
|----------|-----------|-------------|
| **Slides** | Marp | "Markdown slides" |
| **Pitch** | Gamma | "AI pitch deck" |
| **Auto** | PptxGenJS | "Automated reports" |

**Just say**: "use Slides", "use Pitch", or "use Auto"

---

## The Three Tools

| Nickname | Tool | Type | Best For |
|----------|------|------|----------|
| **Slides** | Marp | Markdown → Multi-format | Version-controlled technical docs |
| **Pitch** | Gamma | AI-generated | Professional pitch decks, rapid prototyping |
| **Auto** | PptxGenJS | Programmatic API | Automated reports, data-driven slides |

---

## Quick Decision Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION TOOL SELECTOR                   │
└─────────────────────────────────────────────────────────────────┘

                         START HERE
                              │
                              ▼
              ┌───────────────────────────────┐
              │   Need AI to generate content │──YES──▶ PITCH (Gamma)
              │   from a topic/prompt?        │        (AI-powered)
              └───────────────────────────────┘
                              │ NO
                              ▼
              ┌───────────────────────────────┐
              │   Need programmatic/automated  │──YES──▶ AUTO (PptxGenJS)
              │   generation from data/API?   │        (Code-based)
              └───────────────────────────────┘
                              │ NO
                              ▼
              ┌───────────────────────────────┐
              │   Need version control +      │──YES──▶ SLIDES (Marp)
              │   simple Markdown workflow?   │        (Markdown-first)
              └───────────────────────────────┘
                              │ NO
                              ▼
              ┌───────────────────────────────┐
              │   Default: Start with SLIDES  │
              │   (fastest to get started)    │
              └───────────────────────────────┘
```

---

## Detailed Comparison

| Criterion | Marp | Gamma | PptxGenJS |
|-----------|------|-------|-----------|
| **Input** | Markdown | Natural language prompt | JSON/TypeScript |
| **Output** | HTML, PDF, PPTX | Web link, exportable | Native .pptx |
| **Offline** | ✅ Yes | ❌ No | ✅ Yes |
| **AI Generation** | ❌ Manual | ✅ Built-in | ❌ Manual |
| **Version Control** | ✅ Git-friendly | ❌ Cloud-hosted | ⚠️ Code only |
| **Data Integration** | ❌ Static | ❌ Manual | ✅ API/JSON |
| **Brand Templates** | ✅ CSS themes | ✅ Auto-themed | ✅ Custom masters |
| **Learning Curve** | Low | Very Low | Medium |
| **Dependency** | VS Code extension | Web service | Node.js |

---

## Use Case Matrix

### Choose MARP When:

| Scenario | Why Marp |
|----------|----------|
| Technical documentation | Markdown source = version controlled |
| Conference talks | Developer-friendly, Git-trackable |
| Internal team updates | Quick edits, no design overhead |
| Multi-format needs | Same source → HTML + PDF + PPTX |
| Offline-first | No cloud dependency |

**Marp Workflow:**
```markdown
---
marp: true
theme: default
---

# Slide Title

- Bullet point
- Another point

---

# Next Slide
```

**Export:** Use `export_marp` tool or VS Code Marp extension

---

### Choose GAMMA When:

| Scenario | Why Gamma |
|----------|-----------|
| Pitch decks for stakeholders | Professional polish, AI layouts |
| Rapid prototyping | Content → deck in minutes |
| Non-technical audiences | Beautiful defaults |
| Presentations from rough notes | AI structures the narrative |
| Client-facing deliverables | Publication-quality output |

**Gamma Workflow:**
1. Provide topic/outline to Alex
2. Alex applies Duarte methodology (see `gamma-presentations` skill)
3. Alex generates structured markdown
4. Paste into gamma.app → AI creates polished deck

**Best Practice:** Use Alex as presentation consultant first (audience, goal, S.T.A.R. moments), then generate.

---

### Choose PPTXGENJS When:

| Scenario | Why PptxGenJS |
|----------|---------------|
| Automated reports | Data → slides pipeline |
| Dashboard exports | Charts from live data |
| Batch generation | 100 personalized decks |
| CI/CD integration | Generate on build |
| Custom branding | Full Slide Master control |

**PptxGenJS Workflow:**
```typescript
import { generateAndSavePresentation } from './pptxGenerator';

const slides = [
  { type: 'title', title: 'Q4 Report', subtitle: 'Automated' },
  { type: 'chart', chartType: 'bar', data: quarterlyData }
];

await generateAndSavePresentation(slides, {}, 'report.pptx');
```

**Best Practice:** Define slide templates, feed data, automate export.

---

## Decision Flowchart by Context

| Context | Recommended Tool | Rationale |
|---------|------------------|-----------|
| "I have rough notes" | **Gamma** | AI structures content |
| "I have structured data" | **PptxGenJS** | Programmatic charts/tables |
| "I have Markdown content" | **Marp** | Direct conversion |
| "I need it in 5 minutes" | **Gamma** | Fastest to polished |
| "I need it repeatable monthly" | **PptxGenJS** | Automation |
| "I need Git history" | **Marp** | Plain text source |
| "Audience is executives" | **Gamma** | Professional polish |
| "Audience is developers" | **Marp** | Code-adjacent workflow |
| "Audience is data analysts" | **PptxGenJS** | Chart-heavy |

---

## Hybrid Workflows

Sometimes the best approach combines tools:

### Marp → Gamma Refinement
1. Draft slides in Marp (fast iteration)
2. Export rough content
3. Refine in Gamma for final polish

### PptxGenJS + Marp Templates
1. Use Marp themes for branding reference
2. Replicate in PptxGenJS Slide Masters
3. Automate data-driven generation

### Gamma Consulting → PptxGenJS Automation
1. Use Alex/Gamma for narrative structure
2. Implement as PptxGenJS templates
3. Feed data for automated generation

---

## Anti-Patterns

| ❌ Don't | ✅ Instead |
|----------|-----------|
| Use PptxGenJS for one-off deck | Use Marp (faster) |
| Use Marp for executive pitch | Use Gamma (better polish) |
| Use Gamma for automated reports | Use PptxGenJS (data integration) |
| Manually edit Gamma exports | Re-generate or use Marp |
| Copy-paste between tools | Define shared templates |

---

## Activation Triggers

- "which presentation tool", "what tool for slides"
- "marp vs gamma", "pptx vs gamma", "slides vs pitch"
- "use slides", "use pitch", "use auto"
- "create presentation" (then assess requirements)
- "best way to make slides"
- "presentation strategy"

---

---

# Book Publishing

> End-to-end book production pipeline: Markdown → Pandoc → LuaLaTeX → dual PDF (print + digital).

**Scope**: Inheritable skill. Covers the complete pipeline for producing professional-quality PDF books from Markdown source, including emoji handling, dual format output, and print-ready configuration.

## Pipeline Architecture

```
Markdown Source
    ↓
Pandoc (--pdf-engine=lualatex)
    ↓
LuaLaTeX Engine
    ↓
├── Print PDF (twoside, crop marks, ISBN)
└── Digital PDF (oneside, hyperlinks, bookmarks)
```

### Key Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| Pandoc | 3.x+ | Markdown → LaTeX conversion |
| LuaLaTeX | TeX Live 2024+ | PDF rendering (Unicode-native) |
| Twemoji | Latest | Cross-platform emoji rendering |
| `needspace` package | LaTeX | Orphan/widow prevention |

**Why LuaLaTeX**: Native Unicode support (XeLaTeX works but LuaLaTeX handles emoji processing more reliably with Lua filters).

## Emoji Handling (Critical)

### The ZWJ Problem

Zero Width Joiner (ZWJ) sequences combine multiple emoji into one glyph. **Sort order is critical**:

| Emoji | Codepoints | Length |
|-------|-----------|--------|
| 👨‍👩‍👧‍👦 | U+1F468 U+200D U+1F469 U+200D U+1F467 U+200D U+1F466 | 7 |
| 👨‍👩‍👧 | U+1F468 U+200D U+1F469 U+200D U+1F467 | 5 |
| 👨‍👩 | U+1F468 U+200D U+1F469 | 3 |
| 👨 | U+1F468 | 1 |

**CRITICAL RULE**: The emoji replacement map MUST be sorted by **length descending** (longest sequences first). If you process `👨` before `👨‍👩‍👧‍👦`, the family emoji gets partially replaced and corrupts the output.

### Emoji Map File

Create an explicit `emoji-map.json` that controls all replacements:

```json
{
  "metadata": {
    "version": "1.0",
    "source": "Twemoji",
    "sortOrder": "length-descending"
  },
  "emojis": [
    {
      "sequence": "👨‍👩‍👧‍👦",
      "codepoints": "1f468-200d-1f469-200d-1f467-200d-1f466",
      "image": "1f468-200d-1f469-200d-1f467-200d-1f466.png",
      "length": 7
    }
  ]
}
```

**Rule**: Never rely on automatic emoji detection. Use an explicit map file that you control and sort.

### Twemoji Base64 Embedding

Embed Twemoji images directly as base64 in the LaTeX output to avoid external file dependencies:

```lua
-- Pandoc Lua filter for emoji replacement
function Str(elem)
  -- Process emoji map (length-descending order)
  for _, entry in ipairs(emoji_map) do
    if elem.text:find(entry.sequence) then
      local img = pandoc.Image("", entry.base64_data_uri)
      -- Set size to match surrounding text
      img.attributes.height = "1em"
      return img
    end
  end
end
```

### Windows Emoji Limitation

Windows cannot natively render flag emoji (🇺🇸, 🇬🇧, etc.) in many contexts. Solutions:

| Approach | Result |
|----------|--------|
| Twemoji replacement in PDF | Full flag rendering |
| HTML output with Twemoji CSS | Full flag rendering |
| Windows terminal/editor | Broken or missing flags |

**Rule**: Always preview emoji-heavy content in the PDF output, not in the editor.

## Dual PDF Configuration

### Print Edition

```yaml
# pandoc-print.yaml
pdf-engine: lualatex
variables:
  documentclass: book
  classoption:
    - twoside            # Different left/right margins
    - openright           # Chapters start on right pages
  geometry:
    - inner=2.5cm        # Binding side (wider)
    - outer=2cm
    - top=2.5cm
    - bottom=2.5cm
  fontsize: 11pt
  mainfont: "Linux Libertine O"
  monofont: "Fira Code"
  linestretch: 1.15
```

### Digital Edition

```yaml
# pandoc-digital.yaml
pdf-engine: lualatex
variables:
  documentclass: book
  classoption:
    - oneside            # Symmetric margins
  geometry:
    - margin=2cm
  fontsize: 11pt
  colorlinks: true
  linkcolor: blue
  urlcolor: blue
  toccolor: blue
```

### Key Differences

| Feature | Print | Digital |
|---------|-------|---------|
| Page layout | `twoside` (inner/outer margins) | `oneside` (symmetric) |
| Chapters | `openright` (start on right page) | No forced page side |
| Links | Black text (no hyperlinks on paper) | Blue, clickable |
| Crop marks | Yes (for professional printing) | No |
| Blank pages | Inserted for chapter openings | None |

## Page Numbering

### Front Matter vs. Body

| Section | Numbering | Style |
|---------|-----------|-------|
| Title page | None | — |
| Copyright, dedication | None | — |
| Table of Contents | Roman (i, ii, iii) | `\pagenumbering{roman}` |
| Foreword, preface | Roman (continues) | — |
| Chapter 1+ | Arabic (1, 2, 3) | `\pagenumbering{arabic}` |
| Appendices | Arabic (continues) or lettered | `\appendix` |
| Index | Arabic (continues) | — |

**Rule**: The transition from Roman to Arabic numbering resets at page 1 for the first chapter.

## Table of Contents

LaTeX auto-generates TOC from headings. Configure depth:

```latex
\setcounter{tocdepth}{2}    % Include down to subsections
\setcounter{secnumdepth}{2} % Number down to subsections
```

### Heading Lint Before Build

Run a heading validation pass before PDF generation:

| Check | Rule | Why |
|-------|------|-----|
| No skipped levels | H1 → H2 → H3 (not H1 → H3) | TOC structure breaks |
| Unique within chapter | No duplicate H2 headings in same chapter | Anchor collisions |
| No trailing punctuation | "Getting Started" not "Getting Started." | TOC formatting |
| Consistent casing | Title Case or Sentence case, not mixed | Professional appearance |

## Orphan/Widow Prevention

### The `needspace` Package

Prevents headings from appearing at the bottom of a page with no following content:

```latex
\usepackage{needspace}
\needspace{4\baselineskip}  % Ensure 4 lines available before heading
```

### Configuration

| Element | Minimum Space |
|---------|--------------|
| Chapter title | New page (automatic in `book` class) |
| Section heading | 4 `\baselineskip` |
| Subsection heading | 3 `\baselineskip` |
| Code block | 5 `\baselineskip` |
| Figure/table | Full figure height + caption |

## Build Pipeline

### Complete Build Script

```bash
#!/bin/bash
# build-book.sh — Dual PDF build

set -e

# Step 1: Lint headings
echo "Linting headings..."
python scripts/lint-headings.py chapters/*.md

# Step 2: Generate emoji map (sorted by length descending)
echo "Generating emoji map..."
python scripts/build-emoji-map.py --sort-by-length-desc

# Step 3: Build print edition
echo "Building print PDF..."
pandoc chapters/*.md \
  --defaults=pandoc-print.yaml \
  --lua-filter=filters/emoji.lua \
  --lua-filter=filters/needspace.lua \
  --toc \
  --output=output/book-print.pdf

# Step 4: Build digital edition
echo "Building digital PDF..."
pandoc chapters/*.md \
  --defaults=pandoc-digital.yaml \
  --lua-filter=filters/emoji.lua \
  --toc \
  --output=output/book-digital.pdf

echo "Build complete: output/book-print.pdf, output/book-digital.pdf"
```

### Build Validation

After building, verify:

| Check | How |
|-------|-----|
| Page count reasonable | Compare to previous build |
| TOC links work | Click in PDF reader |
| Emoji render correctly | Visual spot-check family/flag emoji |
| No orphan headings | Scan for headings at page bottom |
| Front matter numbering | Roman numerals before Chapter 1 |
| Chapter openings (print) | Always on right-hand page |

## Project Structure

```
book/
├── chapters/
│   ├── 00-frontmatter.md
│   ├── 01-introduction.md
│   ├── 02-foundations.md
│   └── ...
├── filters/
│   ├── emoji.lua
│   └── needspace.lua
├── scripts/
│   ├── build-emoji-map.py
│   └── lint-headings.py
├── assets/
│   ├── emoji/              # Twemoji PNGs
│   └── images/             # Book images
├── output/                 # Generated PDFs (gitignored)
├── emoji-map.json          # Explicit emoji map
├── pandoc-print.yaml       # Print edition config
├── pandoc-digital.yaml     # Digital edition config
└── build-book.sh           # Build script
```
