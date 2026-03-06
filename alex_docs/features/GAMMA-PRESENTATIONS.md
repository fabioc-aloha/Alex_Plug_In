# Gamma Presentations Guide

> Generate professional presentations, documents, and social content with expert storytelling consulting.

**Last Updated:** March 2026 — Gamma API v1.0 GA

Gamma is an AI-powered platform with 50M+ users for creating presentations, documents, social posts, and websites. Alex integrates with Gamma to generate polished content programmatically **with professional presentation consulting**.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Pricing & Plans](#pricing--plans)
- [Presentation Consulting Methodology](#presentation-consulting-methodology)
- [Alex Consulting Workflow](#alex-consulting-workflow)
- [Illustrations and Visual Elements](#illustrations-and-visual-elements)
- [How to Ask Alex](#how-to-ask-alex)
- [Slide Break Rules](#slide-break-rules)
- [Pro Tips](#pro-tips)
- [Cost Awareness](#cost-awareness)
- [CLI Tool](#cli-tool)
- [MCP Integration](#mcp-integration)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

---

## Getting Started

### Prerequisites

1. **Gamma account** — All plans have API access (including Free)
2. **API key** from [gamma.app/settings](https://gamma.app/settings)
3. **Environment variable**: `GAMMA_API_KEY`

### Quick Start

Tell Alex what you want:

```text
"Create a 10-slide presentation about machine learning for executives"
```

Alex will:
1. Write the actual content for you
2. Send it to Gamma API for professional formatting
3. Return the link and/or download the file
4. Open it automatically if requested

---

## Pricing & Plans

| Plan | Price | Max Cards | Monthly Credits | API Access |
|------|-------|-----------|----------------|------------|
| **Free** | $0 | 10 | 400 | Yes |
| **Plus** | $9/mo | 20 | 1,000 | Yes |
| **Pro** | $18/mo | 60 | 4,000 | Yes |
| **Ultra** | $90/mo | 75 | 20,000 | Yes |

### Model Access by Tier

| Tier | Image Models | Credits/Image | Notable Models |
|------|-------------|---------------|----------------|
| Free | 6 | 2-10 | Flux 2 Fast, Imagen 3 Fast, Ideogram 3 Turbo |
| Plus | +8 | 3-34 | Flux 2 Pro, Recraft V4, Nano Banana 2 Mini |
| Pro | +12 | 20-50 | Flux 2 Max, Ideogram 3, GPT Image, DALL-E 3, SVGs |
| Ultra | +6 images, 6 videos | 30-800 | Imagen 4 Ultra, Recraft V4 Pro, Veo 3.1, Luma Ray 2 |

**Rate limit:** 50 requests/hour across all plans.

---

## Presentation Consulting Methodology

Alex uses the **Duarte methodology** — the industry-leading approach used by Nancy Duarte for Apple, Al Gore, and Fortune 500 companies.

### The 7 Principles of Expert Presentation Design

#### 1. The Hero's Journey Structure

Every presentation follows story structure:
- **Beginning**: Establish the current state ("what is")
- **Middle**: Contrast with the vision ("what could be")
- **End**: Call to action and "new bliss" (attainable future)

#### 2. Audience as Hero, Presenter as Mentor

- The **audience** is the hero facing a challenge
- The **presenter** (or content) is the mentor providing tools to overcome it
- Position solutions as enabling the audience's success, not showcasing the presenter

#### 3. The Presentation Sparkline™

Alternate between "what is" and "what could be" throughout:
```
What is → What could be → What is → What could be → NEW BLISS
```
This contrast keeps audiences engaged (unlike flat reports or pure pitches).

#### 4. S.T.A.R. Moments™

Include "Something They'll Always Remember":
- Dramatic demonstrations
- Unexpected comparisons (like Steve Jobs sliding MacBook Air into envelope)
- Emotional stories that crystallize the message

#### 5. Data Storytelling

Transform data into meaning:
- **Humanize**: Make numbers relatable to individuals
- **Compare**: Use unexpected units of measurement
- **Surprise**: Lead with insight, not just charts

#### 6. Visual Hierarchy

- One idea per slide (rule of one)
- Clear title that states the insight (not just topic)
- 5-7 bullets maximum per slide
- Use whitespace strategically

#### 7. The New Bliss

End with a clear vision of the attainable future:
- What does success look like for the audience?
- How will their world be better?
- Concrete, achievable, inspiring

---

## Alex Consulting Workflow

When you provide plain text or rough content, Alex follows this **consulting process**:

### Phase 1: Discovery

Alex analyzes the content and asks clarifying questions:
- Who is the audience? (executives, developers, investors, etc.)
- What is the goal? (inform, persuade, inspire, teach)
- What is the single most important takeaway?
- Are there emotional stories or data points to highlight?

### Phase 2: Concept Presentation

Alex presents a **narrative storyboard**:

```
📊 PRESENTATION CONCEPT

Title: [Compelling title framed as benefit to audience]
Subtitle: [Supporting context]

NARRATIVE ARC:
┌─────────────────────────────────────────────────┐
│ HOOK: [Opening that establishes stakes]        │
│ PROBLEM: [What is - current pain/challenge]    │
│ VISION: [What could be - better future]        │
│ SOLUTION: [How to get there - your offering]   │
│ PROOF: [Evidence, data, stories]               │
│ CALL TO ACTION: [Clear next step]              │
│ NEW BLISS: [Vision of success achieved]        │
└─────────────────────────────────────────────────┘

PROPOSED SLIDE STRUCTURE (10 slides):
1. Title slide with hook subtitle
2. The challenge your audience faces
3. Why this matters now
4. Section: The Vision [section divider]
5. What success looks like
6. The path forward
7. Proof point 1: [data/story]
8. Section: Taking Action [section divider]
9. Key recommendations
10. Call to action + New Bliss

S.T.A.R. MOMENT: [Proposed memorable element]
```

### Phase 3: User Feedback

Refine the concept:
- "Add more data on slide 7"
- "Make the call to action stronger"
- "I want to emphasize X instead of Y"

### Phase 4: Structured Markdown Creation

Alex generates the **full structured markdown** for approval:

```markdown
# [Title]

## [Subtitle]

> [Speaker notes for opening]

---

# [Slide 2 Title]

- Bullet with **bold** for emphasis
- Another key point
- Third supporting point

> [Speaker notes with talking points]
```

### Phase 5: User Approval

Review the markdown:
- Make inline edits if needed
- Request changes to specific slides
- Approve for generation

### Phase 6: Generation

Alex converts approved markdown to presentation with:
- Professional themes and typography
- Proper slide layouts per the Duarte principles
- Speaker notes preserved
- Images as specified

---

## Illustrations and Visual Elements

### Illustration Syntax

Use markdown image syntax with type prefixes:

| Syntax | Description | Example |
|--------|-------------|---------|
| `![icon:name]` | Lucide vector icon | `![icon:chart-bar]` |
| `![icon:name#color]` | Icon with hex color | `![icon:lightbulb#0550ae]` |
| `![stock:name]` | Stock business illustration | `![stock:collaboration]` |
| `![svg:path]` | Explicit SVG file path | `![svg:./assets/diagram.svg]` |
| `![logo:name]` | Auto-resolve from logos/ folder | `![logo:acme]` |
| `![ticker:SYMBOL]` | Company logo by stock ticker | `![ticker:AAPL]` |
| `![image:path]` | Explicit image file path | `![image:./images/photo.png]` |

### Company Logos

![logo:Microsoft]

#### Local Logo Collection

Place logos in a `logos/` folder:

```
workspace/
├── logos/
│   ├── acme.png
│   ├── partner-a.jpg
│   ├── microsoft.svg
│   └── google.webp
└── presentation.md
```

Reference by name:
```markdown
# Our Partners
![logo:acme]
![logo:partner-a]
![logo:microsoft]
```

#### Ticker-Based Logo API

Fetch company logos by stock ticker:

![ticker:MSFT]

```markdown
# Tech Giants Comparison
![ticker:AAPL]
![ticker:MSFT]
![ticker:GOOGL]
```

**Setup:** Add API key to VS Code settings: `alex.logos.brandfetchClientId` or `alex.logos.logoDevToken`

### Available Icons

**Business & Charts**: `chart-bar`, `chart-line`, `chart-pie`, `trending-up`, `trending-down`, `target`, `trophy`, `briefcase`, `building`, `wallet`

**People & Teams**: `users`, `user`, `user-check`, `handshake`

**Technology**: `cpu`, `database`, `server`, `cloud`, `globe`, `code`, `terminal`, `wifi`, `brain`, `sparkles`

**Communication**: `mail`, `message-circle`, `phone`, `share`, `video`, `presentation`

**Actions & Status**: `check`, `check-circle`, `x`, `x-circle`, `plus`, `minus`, `alert-triangle`, `info`, `help-circle`

**Objects & Concepts**: `lightbulb`, `book`, `calendar`, `clock`, `file`, `file-text`, `folder`, `star`, `heart`, `lock`, `unlock`, `shield`, `zap`, `rocket`

**Arrows & Navigation**: `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `chevron-right`, `chevron-left`, `external-link`, `refresh`

### Stock Illustrations

| Name | Description |
|------|-------------|
| `collaboration` | Three connected circles representing teamwork |
| `growth` | Bar chart with upward trend line |
| `innovation` | Lightbulb with connected nodes |
| `process` | Three-step workflow with arrows |
| `security` | Shield with checkmark |
| `network` | Hub-and-spoke network diagram |
| `analytics` | Line chart with data points |
| `timeline` | Horizontal timeline with milestones |

### Example: Slide with Illustrations

```markdown
# Why Choose Us

## Key Differentiators

![icon:trophy#1a7f37]

- Industry-leading performance
- Enterprise-grade security
- 24/7 expert support

![stock:security]

> Emphasize the security certification in the demo
```

---

## How to Ask Alex

### From a Topic (Alex writes all content)

```text
"Create a 10-slide presentation about machine learning for executives"
"Make a pitch deck for my startup idea: [description]"
"Generate a social media carousel about productivity tips"
```

### From Your Content File

```text
"Create a presentation from README.md"
"Turn my CHANGELOG.md into a 15-slide deck"
"Make a document from .github/skills/cognitive-architecture/SKILL.md"
```

### From Multiple Reference Documents

```text
"Create a presentation about appropriate reliance using all the documents in the article folder"
"Make a pitch deck from my business plan - use investor-deck.md and financials.md"
```

### With Specific Options

```text
"Create a presentation from my-notes.md with 12 slides, professional tone, for investors"
"Generate a webpage from PROJECT.md in Portuguese"
"Make an Instagram carousel (4x5) from tips.txt with vibrant AI images"
```

### Available Options

| Option | Values | Example |
|--------|--------|---------|
| **Format** | presentation, document, social, webpage | "as a document" |
| **Slides/Cards** | 1-75 | "with 12 slides" |
| **Tone** | any description | "professional and confident" |
| **Audience** | any description | "for investors" |
| **Language** | 60+ languages | "in Spanish" |
| **Dimensions** | 16x9, 4x3, 1x1, 4x5, 9x16, letter, a4 | "in 16x9 format" |
| **Images** | AI, Pexels, web, no images | "with AI-generated images" |
| **Export** | pptx, pdf | "export as PowerPoint" |

### Consulting Prompts

#### Full Consulting Workflow
```
"Help me create a presentation about [topic].
I want to present to [audience] to [goal].
Here's my rough content: [paste content or file path]"
```

#### Concept Review
```
"Review my presentation concept and suggest improvements:
[paste existing content]"
```

#### Storyboard Request
```
"Create a storyboard for a presentation on [topic].
Audience: [who]
Goal: [what you want them to do/feel/know]
Key message: [single takeaway]"
```

#### S.T.A.R. Moment Ideation
```
"What would be a memorable S.T.A.R. moment for a presentation about [topic]?
I want the audience to remember [key insight]."
```

---

## Slide Break Rules

When preparing markdown content for Gamma with `cardSplit: "inputTextBreaks"`, each `\n---\n` in the input marks a **card break**.

**Critical rules:**
- Use `---` on its own line, surrounded by blank lines
- When `cardSplit` is `inputTextBreaks`, Gamma ignores `numCards` — break count controls card count
- When `cardSplit` is `auto` (default), Gamma ignores `---` breaks and uses `numCards`
- For `preserve` textMode, `---` breaks give exact control over each card

**Example:**

```markdown
# Title Slide
My presentation about AI ethics

---

# The Problem
- Bias in training data
- Lack of transparency

---

# Our Solution
A framework for responsible AI

---

# Call to Action
Adopt the ethical AI checklist today
```

This produces exactly **4 cards** with `cardSplit: "inputTextBreaks"`.

---

## Pro Tips

### 1. Structure Content with Slide Markers

Use clear headers — they become natural slide breaks:

```markdown
## Slide 1: Title
Main message here

## Slide 2: The Problem
- Pain point 1
- Pain point 2
```

### 2. Use Illustrations for Professional Decks

```bash
--image-model ideogram --image-style "modern clean illustrations, abstract concepts"
```

### 3. Match Tone to Audience

| Audience | Suggested Tone |
|----------|----------------|
| Executives | "professional and concise" |
| Researchers | "intellectual and evidence-based" |
| Developers | "technical and practical" |
| Investors | "confident and visionary" |
| General | "friendly and accessible" |

### 4. One Command, Open Result

Always use `--open` to immediately review:

```bash
node .github/muscles/gamma-generator.cjs -f content.md -e pptx --open
```

### 5. Iterate with Cost-Effective Models

Use cheaper models while iterating, premium for final:

```bash
# Drafts (2 credits/image)
--image-model flux-2-klein

# Final version (20 credits/image)
--image-model ideogram-v3
```

---

## Cost Awareness

| Factor | Credits |
|--------|---------|
| Per card (text only) | 1-5 |
| Free-tier image | 2-10 |
| Plus-tier image | 3-34 |
| Pro-tier image | 20-50 |
| Ultra-tier image | 30-125 |
| Video (Ultra only) | 98-800 |

### Estimates

| Complexity | Credits |
|------------|---------|
| Simple 5-card deck | ~20-25 |
| Standard 10-card presentation | ~40-50 |
| 20-card with premium images | ~200-400 |
| Full pitch deck with exports | ~100-200 |

Check balance: [gamma.app/settings/billing](https://gamma.app/settings/billing)

---

## CLI Tool

**Location:** `.github/muscles/gamma-generator.cjs`

### Quick Examples

```bash
# Simple topic
node .github/muscles/gamma-generator.cjs --topic "Introduction to AI"

# From file with PowerPoint export
node .github/muscles/gamma-generator.cjs --file README.md --export pptx

# Generate and immediately open
node .github/muscles/gamma-generator.cjs --file README.md --export pptx --open

# Full customization
node .github/muscles/gamma-generator.cjs \
  --file my-content.md \
  --slides 15 \
  --tone "professional and inspiring" \
  --audience "executives" \
  --image-model ideogram-v3 \
  --image-style "modern illustrations, clean" \
  --dimensions 16x9 \
  --export pptx \
  --output ./exports \
  --open
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
| `--image-model` | | AI model (flux-2-pro, ideogram-v3...) |
| `--image-style` | | Image style description |
| `--dimensions` | `-d` | Card dimensions |
| `--export` | `-e` | Export format (pptx, pdf) |
| `--output` | `-o` | Output directory (default: ./exports) |
| `--open` | | Auto-open exported file |
| `--draft` | | Generate markdown template only (no API call) |
| `--draft-output` | | Custom path for draft file |
| `--quiet` | `-q` | Suppress progress messages |
| `--timeout` | | Timeout in seconds (default: 180) |

### Two-Step Draft Workflow

For full control over content:

#### Step 1: Generate Draft (no credits)

```bash
node .github/muscles/gamma-generator.cjs \
  --topic "AI Ethics for Developers" \
  --slides 10 \
  --draft \
  --open
```

#### Step 2: Edit the Markdown

Fill in your content in the generated file.

#### Step 3: Generate Final

```bash
node .github/muscles/gamma-generator.cjs \
  --file ./exports/ai-ethics-draft.md \
  --image-model ideogram-v3 \
  --export pptx \
  --open
```

**Benefits:**
- Full control over every slide
- No wasted credits on iterations
- Review structure before committing
- Reuse templates for similar presentations

---

## MCP Integration

Gamma provides a hosted MCP server for AI tool integration.

### Supported Platforms

- **Claude** (Desktop & Web)
- **Make**
- **Zapier**
- **Workato**
- **N8N**

### Setup in Claude

1. Settings → Connectors
2. Search "Gamma" → Connect
3. Authorize Gamma account access

### MCP Tools

| Tool | Capability |
|------|------------|
| `generate_content` | Create presentations, docs, webpages, social |
| `browse_themes` | Search and select from theme library |
| `organize_folders` | Save to workspace folders |

### Effective Prompts

**Good:**
> "Create a 10-slide marketing strategy presentation covering target audience, campaign channels, budget breakdown, and success metrics."

**Better:**
> "Create a pitch deck for investors about our AI startup. 12 slides, 16:9 format, professional tone. Include: problem, solution, market size, business model, traction, team, financials, ask. Export as PowerPoint."

---

## Troubleshooting

### Insufficient Credits

- Check balance at gamma.app/settings/billing
- Purchase credits or upgrade plan
- Enable auto-recharge

### Authentication Failed (401)

- Verify API key is correct
- Regenerate key if compromised

### Generation Timeout

- Complex generations take longer (large numCards, premium images, video)
- Increase polling timeout to 2-3 minutes (10 min for video)
- Simplify request (fewer cards, basic images)

### Token Limit Exceeded

- inputText max: 100k tokens (~400k chars)
- Split into multiple generations
- Use `textMode: "condense"` for long content

---

## API Reference

For detailed API documentation including all parameters, models, and examples, see the skill file:

**[.github/skills/gamma-presentations/SKILL.md](../../.github/skills/gamma-presentations/SKILL.md)**

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1.0/generations` | POST | Generate from text |
| `/v1.0/generations/from-template` | POST | Create from template (beta) |
| `/v1.0/generations/{id}` | GET | Check status, get URLs |
| `/v1.0/themes` | GET | List themes |
| `/v1.0/folders` | GET | List folders |

**Base URL:** `https://public-api.gamma.app`

**Auth Header:** `X-API-KEY: <your-api-key>`

---

## Related Resources

- [Gamma Developer Docs](https://developers.gamma.app/)
- [Gamma Pricing](https://gamma.app/pricing)
- [Nancy Duarte's Resonate](https://www.duarte.com/resonate/) — The methodology behind this consulting approach
