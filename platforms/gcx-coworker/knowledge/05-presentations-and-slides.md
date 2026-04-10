# Presentations and Slides

Great slides don't display information, they communicate insights. This guide covers visual design principles and tool selection for creating presentations that enhance (not compete with) the speaker's message.

**Core Principle**: Slides support the speaker. The speaker is not the slides' teleprompter.

## Visual Hierarchy

### The 3-Second Rule

Viewers should understand the slide's main point in 3 seconds.

**Test**: Show slide briefly, cover it, ask "What was the point?" If they can't answer, redesign.

### Hierarchy Elements

| Element | Purpose | Usage |
|---------|---------|-------|
| **Title** | Main takeaway | Full sentence, not label |
| **Visual** | Evidence/illustration | Center of attention |
| **Supporting text** | Clarification | Minimal, if any |
| **Source** | Credibility | Small, bottom corner |

### Z-Pattern and F-Pattern

**Z-Pattern (for sparse slides)**: Eyes start top-left (title/headline), move diagonally to center-right (supporting visual/data), then diagonally down to bottom-left (conclusion/call to action).

**F-Pattern (for text-heavy slides)**: First horizontal scan across strong headline, second horizontal scan across key point 1, vertical scan down left side for key point 2, with supporting details fading in importance.

### White Space

White space is not empty, it's breathing room for ideas.

| Mistake | Fix |
|---------|-----|
| Cramped margins | 10% margin on all sides minimum |
| No padding between elements | Visual grouping with space |
| Text wall | Break into digestible chunks |

## The Assertion-Evidence Model

### Traditional vs Assertion-Evidence

**Traditional (weak)**:
- Title: Q4 Sales Results
- Revenue: $2.3M
- Growth: 15%
- New customers: 47
- Retention: 92%

**Assertion-Evidence (strong)**:
- Title: Q4 revenue grew 15% to $2.3M, our best quarter ever
- Bar chart showing growth trend

### Structure

| Component | Traditional | Assertion-Evidence |
|-----------|-------------|-------------------|
| Title | Topic label | Full-sentence claim |
| Body | Bullet points | Visual evidence |
| Cognitive load | High (decoding) | Low (supporting) |

### Application

1. Write the assertion (what you want them to believe)
2. Find/create visual evidence (chart, diagram, image)
3. Remove all unnecessary text
4. Test: Does the visual prove the assertion?

## Data Visualization on Slides

### Chart Selection Guide

| Data Type | Best Chart | Avoid |
|-----------|------------|-------|
| Comparison | Bar chart | Pie (hard to compare) |
| Trend over time | Line chart | Stacked bar |
| Part of whole | Stacked bar, treemap | 3D pie |
| Relationship | Scatter plot | Bar chart |
| Distribution | Histogram, box plot | Pie chart |

### Visualization Principles

**1. Title = Insight**
- ❌ "Revenue 2020-2025"
- ✅ "Revenue doubled in 5 years"

**2. Reduce chart junk**
- Remove gridlines (or make very light)
- Remove 3D effects
- Remove unnecessary legends
- Remove borders and boxes

**3. Highlight the insight**
- Color the key data point differently
- Use annotations to point to insight
- Grey out non-essential data

**4. Simplify scales**
- Round numbers ($2.3M not $2,347,891)
- Start axis at zero (unless change is the story)
- Use consistent intervals

### Before/After Example

**Before (cluttered)**: 3D pie chart with 8 slices, legend on side, percentages on each slice, title "Q4 Breakdown"

**After (clear)**: 
- Title: "AI projects drove 40% of Q4 revenue"
- Simple horizontal bar chart, AI highlighted in blue, others in grey, percentages inline

## Typography

### Font Guidelines

| Element | Recommendation |
|---------|---------------|
| **Font family** | Sans-serif (Calibri, Arial, Segoe UI) |
| **Title size** | 32-44pt |
| **Body size** | 24-28pt |
| **Min readable** | 18pt (even for source notes) |
| **Max fonts** | 2 (one for titles, one for body) |

### Text Rules

| Rule | Rationale |
|------|-----------|
| **No sentences in bullets** | Bullets are prompts, not scripts |
| **6 words or less per bullet** | Forces concision |
| **Max 3 bullets per slide** | Cognitive limit |
| **Left-align text** | Easier to read than centered |
| **No ALL CAPS paragraphs** | Harder to read |

### Contrast

- Dark text on light background (default)
- Light text on dark/image requires high contrast
- Test: Squint at slide, can you still read it?

## Color and Images

### Color Palette

| Purpose | Color Choice |
|---------|--------------|
| **Primary** | One dominant brand color |
| **Accent** | For highlighting key data |
| **Neutral** | Greys for supporting elements |
| **Avoid** | Red/green together (colorblind) |

### The 60-30-10 Rule

- 60% primary/neutral (background, most content)
- 30% secondary (supporting elements)
- 10% accent (calls to action, key insights)

### Image Guidelines

| Do | Don't |
|----|-------|
| High resolution (1920x1080+) | Pixelated images |
| Relevant to point | Clip art |
| Full-bleed when impactful | Stretched/distorted |
| Consistent style | Stock photo clichés |

### Image Sources

| Source | Type | License |
|--------|------|---------|
| Unsplash | Photography | Free, attribution optional |
| Pexels | Photography | Free |
| Flaticon | Icons | Free with attribution |
| The Noun Project | Icons | Subscription or attribution |

## Slide Types

### Title Slide

Large centered area with compelling title, subtitle/context below, and author/date at bottom. Minimal text, maximum impact.

### Section Divider

Minimal text, bold color, signals transition. Section title centered in large area with plenty of white space.

### Data Slide

Insight as full sentence headline at top, chart/visualization taking up most of slide area, source citation at bottom.

### Full-Image Slide

Full-bleed background image covering entire slide with quote or key point overlaid in white text with shadow for readability.

### Comparison Slide

Comparison headline at top, split layout below with Option A on left (visual + key points) and Option B on right (visual + key points).

## Tool Selection

### The Three Tools

| Nickname | Tool | Type | Best For |
|----------|------|------|----------|
| **Slides** | Marp | Markdown → Multi-format | Version-controlled technical docs |
| **Pitch** | Gamma | AI-generated | Professional pitch decks, rapid prototyping |
| **Auto** | PptxGenJS | Programmatic API | Automated reports, data-driven slides |

### Quick Decision Matrix

Start by asking: Need AI to generate content from a topic/prompt? If yes, use **Pitch (Gamma)** for AI-powered generation.

If no, ask: Need programmatic/automated generation from data/API? If yes, use **Auto (PptxGenJS)** for code-based automation.

If no, ask: Need version control + simple Markdown workflow? If yes, use **Slides (Marp)** for Markdown-first approach.

Default: Start with **Slides (Marp)** as it's fastest to get started.

### Detailed Comparison

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

### Use Case Matrix

**Choose Marp When:**

| Scenario | Why Marp |
|----------|----------|
| Technical documentation | Markdown source = version controlled |
| Conference talks | Developer-friendly, Git-trackable |
| Internal team updates | Quick edits, no design overhead |
| Multi-format needs | Same source → HTML + PDF + PPTX |
| Offline-first | No cloud dependency |

**Choose Gamma When:**

| Scenario | Why Gamma |
|----------|-----------|
| Pitch decks for stakeholders | Professional polish, AI layouts |
| Rapid prototyping | Content → deck in minutes |
| Non-technical audiences | Beautiful defaults |
| Presentations from rough notes | AI structures the narrative |
| Client-facing deliverables | Publication-quality output |

**Choose PptxGenJS When:**

| Scenario | Why PptxGenJS |
|----------|---------------|
| Automated reports | Data → slides pipeline |
| Dashboard exports | Charts from live data |
| Batch generation | 100 personalized decks |
| CI/CD integration | Generate on build |
| Custom branding | Full Slide Master control |

### Decision Flowchart by Context

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

### Hybrid Workflows

**Marp → Gamma Refinement:**
1. Draft slides in Marp (fast iteration)
2. Export rough content
3. Refine in Gamma for final polish

**PptxGenJS + Marp Templates:**
1. Use Marp themes for branding reference
2. Replicate in PptxGenJS Slide Masters
3. Automate data-driven generation

**Gamma Consulting → PptxGenJS Automation:**
1. Use Alex/Gamma for narrative structure
2. Implement as PptxGenJS templates
3. Feed data for automated generation

### Anti-Patterns

| ❌ Don't | ✅ Instead |
|----------|-----------|
| Use PptxGenJS for one-off deck | Use Marp (faster) |
| Use Marp for executive pitch | Use Gamma (better polish) |
| Use Gamma for automated reports | Use PptxGenJS (data integration) |
| Manually edit Gamma exports | Re-generate or use Marp |
| Copy-paste between tools | Define shared templates |

## Slide Design Checklist and Common Mistakes

### Design Checklist

- [ ] One main point per slide
- [ ] Title is a full sentence (assertion)
- [ ] Visual evidence supports assertion
- [ ] Minimal text (bullets < 6 words)
- [ ] High contrast (readable from back of room)
- [ ] Consistent font sizes
- [ ] White space for breathing room
- [ ] Source cited for data

### The Billboard Test

Pretend your slide is a highway billboard:
- Would someone get the point at 65 mph?
- Can they read it in 3 seconds?
- Is one thing clearly most important?

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reading slides aloud | Slides are visual aid, not script |
| Too many animations | Simple fades, if any |
| Inconsistent styling | Use master slides/templates |
| Busy backgrounds | Solid colors or very subtle |
| Logos on every slide | Title and closing only |

### Workflow Best Practices

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

**Gamma Workflow:**
1. Provide topic/outline to Alex
2. Alex applies Duarte methodology
3. Alex generates structured markdown
4. Paste into gamma.app → AI creates polished deck

**PptxGenJS Workflow:**
```typescript
import { generateAndSavePresentation } from './pptxGenerator';

const slides = [
  { type: 'title', title: 'Q4 Report', subtitle: 'Automated' },
  { type: 'chart', chartType: 'bar', data: quarterlyData }
];

await generateAndSavePresentation(slides, {}, 'report.pptx');
```