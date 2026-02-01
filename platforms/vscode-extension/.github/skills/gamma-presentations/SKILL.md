---
applyTo: "**/*presentation*,**/*slides*,**/*deck*,**/*gamma*,**/*pitch*"
---

# Gamma Presentations Skill

> Generate professional presentations, documents, and websites using the Gamma API.

Gamma is an AI-powered platform with 50M+ users for creating presentations, documents, social posts, and websites. This skill enables Alex to generate polished content programmatically.

## When to Use

- User asks to create a presentation or slide deck
- Need to generate a document or report
- Creating social media content (carousels, stories)
- Building simple webpages from content
- Converting notes or outlines into polished presentations

## Prerequisites

- Gamma account (Pro, Ultra, Teams, or Business plan for API access)
- API key from [gamma.app/settings](https://gamma.app/settings)
- Environment variable: `GAMMA_API_KEY`

---

## Help & User Manual

### How to Ask Alex to Create Gamma Content

Simply tell Alex what you want to create. Here are example prompts:

#### From a Topic (AI generates all content)

```text
"Create a 10-slide presentation about machine learning for executives"
"Make a pitch deck for my startup idea: [description]"
"Generate a social media carousel about productivity tips"
```

#### From a File in Your Workspace

```text
"Create a presentation from README.md"
"Turn ROADMAP-UNIFIED.md into a 15-slide deck"
"Make a document from alex_docs/COGNITIVE-ARCHITECTURE.md"
```

#### With Specific Options

```text
"Create a presentation from my-notes.md with 12 slides, professional tone, for investors"
"Generate a webpage from PROJECT.md in Portuguese"
"Make an Instagram carousel (4x5) from tips.txt with vibrant AI images"
```

### Command Quick Reference

| What You Say | What Happens |
|--------------|--------------|
| "Create a presentation about X" | Generates slides from topic |
| "Create a presentation from FILE" | Reads file, converts to slides |
| "Make a document from FILE" | Creates paginated document |
| "Generate a social post from X" | Creates carousel/story format |
| "Create a webpage from FILE" | Generates simple website |

### Available Options

When asking Alex to create Gamma content, you can specify:

| Option | Values | Example |
|--------|--------|---------|
| **Format** | presentation, document, social, webpage | "as a document" |
| **Slides/Cards** | 1-75 | "with 12 slides" |
| **Tone** | any description | "professional and confident" |
| **Audience** | any description | "for investors" |
| **Language** | 60+ languages | "in Spanish" |
| **Dimensions** | 16x9, 4x3, 1x1, 4x5, 9x16, letter, a4 | "in 16x9 format" |
| **Images** | AI, Unsplash, no images | "with AI-generated images" |
| **Export** | pptx, pdf | "export as PowerPoint" |

### Step-by-Step: Create from a Workspace File

1. **Tell Alex the file path:**
   > "Create a presentation from alex_docs/USER-MANUAL.md"

2. **Alex reads the file** and sends content to Gamma API

3. **Alex polls for completion** (usually 15-60 seconds)

4. **Alex returns the link:** `https://gamma.app/docs/xxxxx`

5. **Open the link** to view, edit, or download your presentation

### Customization Examples

**Basic:**
> "Create a presentation from README.md"

**With slide count:**
> "Create a 15-slide presentation from README.md"

**With audience:**
> "Create a presentation from README.md for new developers, friendly tone"

**With export:**
> "Create a presentation from ROADMAP.md and export as PowerPoint"

**Full customization:**
> "Create a 12-slide pitch deck from my-startup.md in 16x9 format, confident tone, for VCs, with modern AI images, export as PDF and PowerPoint"

### What Alex Does Behind the Scenes

1. Reads the specified file from your workspace
2. Sends to Gamma API with your options:
   - `textMode: "generate"` (expands brief content) or `"condense"` (summarizes long content)
   - `format`, `numCards`, `textOptions`, `imageOptions` based on your request
3. Polls generation status every 2-3 seconds
4. Returns the Gamma URL when complete
5. Reports credits used and remaining balance

### Cost Awareness

Alex will inform you of credit usage after each generation:

| Complexity | Estimated Credits |
|------------|-------------------|
| Simple 5-card deck | ~20-25 credits |
| Standard 10-card presentation | ~40-50 credits |
| 20-card with premium images | ~200-400 credits |
| Full pitch deck with exports | ~100-200 credits |

Check your balance: [gamma.app/settings/billing](https://gamma.app/settings/billing)

---

## Quick Reference

### API Base URL

```
https://public-api.gamma.app
```

### Authentication

```bash
--header 'X-API-KEY: <your-api-key>'
--header 'Content-Type: application/json'
```

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v0.2/generations` | POST | Generate new gamma from text |
| `/v0.2/generations/{id}` | GET | Check status, get URLs |
| `/v0.2/themes` | GET | List available themes |

---

## Generate API Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `inputText` | string | Content to generate from (max 100k tokens / ~400k chars) |
| `textMode` | enum | `generate` (expand), `condense` (summarize), `preserve` (keep exact) |

### Format Options

| Parameter | Default | Values |
|-----------|---------|--------|
| `format` | `presentation` | `presentation`, `document`, `social`, `webpage` |
| `numCards` | 10 | 1-60 (Pro) or 1-75 (Ultra) |
| `cardSplit` | `auto` | `auto`, `inputTextBreaks` (use `\n---\n`) |

### Text Options

```json
"textOptions": {
  "amount": "medium",      // brief, medium, detailed, extensive
  "tone": "professional",  // free text, 1-500 chars
  "audience": "executives", // free text, 1-500 chars
  "language": "en"         // 60+ languages
}
```

### Image Options

```json
"imageOptions": {
  "source": "aiGenerated",  // see source options below
  "model": "flux-1-pro",    // see model list below
  "style": "modern, minimal" // free text, 1-500 chars
}
```

**Image Sources:**
- `aiGenerated` - AI-generated images (use with model + style)
- `pictographic` - Pictographic library
- `unsplash` - Unsplash photos
- `giphy` - Animated GIFs
- `webAllImages` - Web images (any license)
- `webFreeToUse` - Personal use licensed
- `webFreeToUseCommercially` - Commercial use licensed
- `placeholder` - Empty placeholders
- `noImages` - No images (use if providing URLs in inputText)

### Card Dimensions

| Format | Options |
|--------|---------|
| Presentation | `fluid`, `16x9`, `4x3` |
| Document | `fluid`, `pageless`, `letter`, `a4` |
| Social | `1x1`, `4x5` (Instagram/LinkedIn), `9x16` (Stories) |

### Export Options

```json
"exportAs": "pptx"  // or "pdf"
```

---

## AI Image Models

### Cost-Effective (2 credits/image)
| Model | API Value |
|-------|-----------|
| Flux Fast 1.1 | `flux-1-quick` |
| Flux Kontext Fast | `flux-kontext-fast` |
| Imagen 3 Fast | `imagen-3-flash` |
| Luma Photon Flash | `luma-photon-flash-1` |

### Standard (8-15 credits/image)
| Model | API Value | Credits |
|-------|-----------|---------|
| Flux Pro | `flux-1-pro` | 8 |
| Imagen 3 | `imagen-3-pro` | 8 |
| Ideogram 3 Turbo | `ideogram-v3-turbo` | 10 |
| Leonardo Phoenix | `leonardo-phoenix` | 15 |

### Premium (20-33 credits/image)
| Model | API Value | Credits |
|-------|-----------|---------|
| Ideogram 3 | `ideogram-v3` | 20 |
| Imagen 4 | `imagen-4-pro` | 20 |
| Gemini 2.5 Flash | `gemini-2.5-flash-image` | 20 |
| Recraft | `recraft-v3` | 20 |
| GPT Image | `gpt-image-1-medium` | 30 |
| DALL-E 3 | `dall-e-3` | 33 |

### Ultra (30-120 credits/image, Ultra plan only)
| Model | API Value | Credits |
|-------|-----------|---------|
| Flux Ultra | `flux-1-ultra` | 30 |
| Imagen 4 Ultra | `imagen-4-ultra` | 30 |
| Recraft Vector | `recraft-v3-svg` | 40 |
| GPT Image Detailed | `gpt-image-1-high` | 120 |

---

## Credit Costs

| Factor | Credits |
|--------|---------|
| Per card | 3-4 |
| Basic AI image | ~2 |
| Standard AI image | ~8-15 |
| Premium AI image | ~20-40 |
| Ultra AI image | ~40-120 |

**Estimates:**
- 10-card deck + 5 basic images = ~40-50 credits
- 20-card doc + 15 premium images = ~360-680 credits

---

## Example Requests

### Simple Presentation

```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H 'Content-Type: application/json' \
  -H 'X-API-KEY: sk-gamma-xxx' \
  -d '{
    "inputText": "Introduction to machine learning for business leaders",
    "textMode": "generate",
    "format": "presentation",
    "numCards": 8
  }'
```

### Professional Pitch Deck

```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H 'Content-Type: application/json' \
  -H 'X-API-KEY: sk-gamma-xxx' \
  -d '{
    "inputText": "Our startup solves remote team collaboration with AI-powered async video messaging. Founded 2024, 10k users, $500k ARR, seeking $2M seed round.",
    "textMode": "generate",
    "format": "presentation",
    "numCards": 12,
    "textOptions": {
      "amount": "medium",
      "tone": "confident, professional, visionary",
      "audience": "venture capital investors"
    },
    "imageOptions": {
      "source": "aiGenerated",
      "model": "flux-1-pro",
      "style": "modern tech, clean, professional photography"
    },
    "cardOptions": {
      "dimensions": "16x9"
    },
    "exportAs": "pptx"
  }'
```

### Document from Notes

```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H 'Content-Type: application/json' \
  -H 'X-API-KEY: sk-gamma-xxx' \
  -d '{
    "inputText": "Meeting notes from Q4 planning...\n---\nBudget discussion...\n---\nAction items...",
    "textMode": "preserve",
    "format": "document",
    "cardSplit": "inputTextBreaks",
    "textOptions": {
      "language": "en"
    },
    "imageOptions": {
      "source": "noImages"
    }
  }'
```

### Social Media Carousel

```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H 'Content-Type: application/json' \
  -H 'X-API-KEY: sk-gamma-xxx' \
  -d '{
    "inputText": "5 productivity tips for developers: 1. Time blocking 2. Pomodoro technique 3. Code reviews in batches 4. Automate repetitive tasks 5. Take real breaks",
    "textMode": "generate",
    "format": "social",
    "numCards": 6,
    "cardOptions": {
      "dimensions": "4x5"
    },
    "imageOptions": {
      "source": "aiGenerated",
      "model": "ideogram-v3-turbo",
      "style": "vibrant, modern, tech aesthetic"
    }
  }'
```

---

## Response Handling

### POST Response

```json
{
  "generationId": "gen_abc123",
  "status": "pending"
}
```

### GET Status Response (Pending)

```json
{
  "generationId": "gen_abc123",
  "status": "pending"
}
```

### GET Status Response (Completed)

```json
{
  "generationId": "gen_abc123",
  "status": "completed",
  "gammaUrl": "https://gamma.app/docs/xyz",
  "pptxUrl": "https://...",  // if exportAs: "pptx"
  "pdfUrl": "https://...",   // if exportAs: "pdf"
  "creditsUsed": 45
}
```

### Polling Pattern

```javascript
async function waitForGeneration(generationId, apiKey) {
  const maxAttempts = 30;
  const delayMs = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `https://public-api.gamma.app/v1.0/generations/${generationId}`,
      { headers: { 'X-API-KEY': apiKey } }
    );
    const data = await response.json();

    if (data.status === 'completed') return data;
    if (data.status === 'failed') throw new Error(data.error);

    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error('Generation timeout');
}
```

---

## MCP Integration

Gamma provides a hosted MCP server for AI tool integration.

### Setup in Claude

1. Open Claude Desktop or Web
2. Settings → Connectors
3. Search "Gamma" → Connect
4. Authorize Gamma account access

### MCP Tools Available

| Tool | Capability |
|------|------------|
| `generate_content` | Create presentations, docs, webpages, social |
| `browse_themes` | Search theme library |
| `organize_folders` | Save to workspace folders |

### Effective MCP Prompts

**Good:**
> "Create a 10-slide marketing strategy presentation covering target audience, campaign channels, budget breakdown, and success metrics. Use a professional blue theme and modern photography style."

**Better:**
> "Create a pitch deck for investors about our AI startup. 12 slides, 16:9 format, professional tone. Include: problem, solution, market size, business model, traction, team, financials, ask. Export as PowerPoint."

---

## Troubleshooting

### Insufficient Credits

**Problem**: Error "insufficient credits"

**Solution**:
- Check balance at gamma.app/settings/billing
- Purchase credits or upgrade plan
- Enable auto-recharge

### Authentication Failed

**Problem**: 401 Unauthorized

**Solution**:
- Verify API key is correct
- Check plan supports API (Pro+)
- Regenerate key if compromised

### Generation Timeout

**Problem**: Status stays "pending" too long

**Solution**:
- Complex generations take longer (large numCards, premium images)
- Increase polling timeout to 2-3 minutes
- Simplify request (fewer cards, basic images)

### Token Limit Exceeded

**Problem**: Input too large

**Solution**:
- inputText max: 100k tokens (~400k chars)
- Split into multiple generations
- Use `textMode: "condense"` for long content

---

## Best Practices

1. **Start simple** - Use defaults, then customize
2. **Match model to need** - Basic images for drafts, premium for finals
3. **Use appropriate textMode**:
   - `generate`: Brief input → expanded content
   - `condense`: Long input → summarized content
   - `preserve`: Keep exact text
4. **Control costs** - Use `flux-1-quick` or `imagen-3-flash` for iteration
5. **Export wisely** - Only request PPTX/PDF when needed (adds processing time)
6. **Organize content** - Use folderIds for workspace organization

---

## CLI Script

A standalone Node.js script is available for command-line generation:

**Location:** `scripts/gamma-generator.js`

### Quick Examples

```bash
# Simple topic
node scripts/gamma-generator.js --topic "Introduction to AI"

# From file with PowerPoint export
node scripts/gamma-generator.js --file README.md --export pptx

# Full customization
node scripts/gamma-generator.js \
  --topic "Climate Change Solutions" \
  --slides 12 \
  --tone "inspiring" \
  --audience "business leaders" \
  --image-model flux-pro \
  --dimensions 16x9 \
  --export pptx
```

### CLI Options

| Option | Short | Description |
|--------|-------|-------------|
| `--topic` | `-t` | Topic or content to generate |
| `--file` | `-f` | Path to content file |
| `--format` | | presentation, document, social, webpage |
| `--slides` | `-n` | Number of slides (1-75) |
| `--tone` | | Tone description |
| `--audience` | | Target audience |
| `--language` | `-l` | Language code (en, es, pt...) |
| `--image-model` | | AI model (flux-quick, dalle3...) |
| `--image-style` | | Image style description |
| `--dimensions` | `-d` | Card dimensions |
| `--export` | `-e` | Export format (pptx, pdf) |
| `--output` | `-o` | Output directory |
| `--help` | `-h` | Show help |

Run `node scripts/gamma-generator.js --help` for full documentation.

---

## Related Skills

- [prompt-engineering](../prompt-engineering/SKILL.md) - Crafting effective inputText
- [markdown-mermaid](../markdown-mermaid/SKILL.md) - Diagrams for presentations
- [image-handling](../image-handling/SKILL.md) - Working with generated images
