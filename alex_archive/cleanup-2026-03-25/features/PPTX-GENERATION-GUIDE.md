# PowerPoint Generation Guide

Generate branded PowerPoint presentations directly from VS Code — no cloud services required.

---

## Quick Start

### From Welcome View (Sidebar)
1. Open the **Alex Cognitive** sidebar (Activity Bar)
2. Click **📰 Generate Presentation** in DEV TOOLS
3. Choose your source:
   - **From Markdown File** — Pick any `.md` in workspace
   - **From Selection** — Select text in editor first
   - **New Presentation** — Opens a template to fill in

### From Explorer (Right-Click)
1. Right-click any `.md` file in the Explorer
2. Select **Alex: Convert to PowerPoint**
3. The `.pptx` appears next to your markdown file

### From Command Palette
- `Ctrl+Shift+P` → "Alex: Generate Presentation"

---

## Markdown Format

Use standard markdown with a few conventions:

```markdown
# Presentation Title

## Subtitle or Author

---

# Slide Title

- Bullet point one
- Bullet point two
- Bullet point three

> Speaker notes go here (not visible in slideshow)

---

## Section Divider [section]

Optional section description

---

# Conclusion

- Summary point
- Call to action
```

### Syntax Reference

| Markdown             | Result                                          |
| -------------------- | ----------------------------------------------- |
| `# Title`            | Title slide (first slide only) or content title |
| `## Subtitle`        | Subtitle text                                   |
| `## Text [section]`  | Section divider slide                           |
| `- Item` or `* Item` | Bullet point                                    |
| `> Note`             | Speaker notes (in Notes pane)                   |
| `---`                | Slide break                                     |

---

## Slide Types

| Type           | Use Case                 | How to Create                     |
| -------------- | ------------------------ | --------------------------------- |
| **Title**      | Opening slide            | First `# Title` in document       |
| **Content**    | Bullet points            | `# Title` followed by `- bullets` |
| **Section**    | Divider between sections | `## Title [section]`              |
| **Chart**      | Data visualization       | Programmatic API only             |
| **Table**      | Tabular data             | Programmatic API only             |
| **Two-Column** | Side-by-side content     | Programmatic API only             |

---

## Programmatic API

For advanced use cases, import the generator directly:

```typescript
import {
    generateAndSavePresentation,
    parseMarkdownToSlides,
    SlideContent
} from './generators/pptxGenerator';

// From markdown string
const slides = parseMarkdownToSlides(markdownContent);
await generateAndSavePresentation(slides, { title: 'My Deck' }, 'output.pptx');

// Programmatic slides
const slides: SlideContent[] = [
    { type: 'title', title: 'Q4 Review', subtitle: 'Performance & Strategy' },
    { type: 'content', title: 'Highlights', bullets: ['Revenue +23%', 'NPS 62'] },
    {
        type: 'chart',
        title: 'Revenue Trend',
        data: {
            chartType: 'line',
            series: [{
                name: 'Revenue',
                labels: ['Q1','Q2','Q3','Q4'],
                values: [100,120,115,146]
            }]
        }
    },
    {
        type: 'table',
        title: 'Team Performance',
        data: {
            headers: ['Name', 'Closed', 'Target'],
            rows: [
                ['Alice', '45', '40'],
                ['Bob', '38', '40'],
                ['Carol', '52', '45']
            ],
            highlightLastRow: false
        }
    }
];

await generateAndSavePresentation(slides, options, 'report.pptx');
```

### Slide Content Types

```typescript
interface SlideContent {
    type: 'title' | 'content' | 'section' | 'chart' | 'table' | 'image' | 'twoColumn';
    title?: string;
    subtitle?: string;
    bullets?: string[];
    notes?: string;      // Speaker notes
    data?: ChartData | TableData | ImageData | TwoColumnData;
}
```

### Chart Types

- `bar` — Category comparison
- `line` — Trend over time
- `pie` — Part-of-whole (≤6 segments recommended)
- `doughnut` — Pie with center hole
- `area` — Volume over time
- `scatter` — Correlation analysis

### Presentation Options

```typescript
interface PresentationOptions {
    title: string;
    author?: string;        // Default: 'Alex Cognitive Architecture'
    subject?: string;
    company?: string;       // Default: 'Alex'
    layout?: '16x9' | '16x10' | '4x3';  // Default: '16x9'
    theme?: 'alex-brand' | 'minimal' | 'dark';
}
```

---

## Alex Brand Templates

Four built-in Slide Masters with Alex brand colors:

| Master         | Use               | Background             |
| -------------- | ----------------- | ---------------------- |
| `ALEX_TITLE`   | Title slides      | Blue (`#0550ae`)       |
| `ALEX_CONTENT` | Content slides    | White with blue header |
| `ALEX_SECTION` | Section dividers  | Purple (`#d8b9ff`)     |
| `ALEX_CHART`   | Chart/data slides | White with blue header |

### Brand Colors

| Name   | Fill      | Text      | Use              |
| ------ | --------- | --------- | ---------------- |
| Blue   | `#ddf4ff` | `#0550ae` | Primary accent   |
| Green  | `#d3f5db` | `#1a7f37` | Success, growth  |
| Purple | `#d8b9ff` | `#6639ba` | Section dividers |
| Gold   | `#fff8c5` | `#9a6700` | Highlights       |
| Gray   | `#eaeef2` | `#24292f` | Body text        |

---

## Use Cases

### 1. Meeting Notes → Slides
```markdown
# Sprint Review

## Week 32

---

# Completed

- User auth refactor (2 days early)
- API rate limiting
- Dashboard caching

> Highlight: Auth refactor unblocked mobile team

---

# In Progress

- Search indexing (70%)
- Mobile push notifications

---

# Blockers

- Waiting on legal for Terms update
- Need design review for checkout flow
```

### 2. Technical Documentation → Training Deck

Convert your README or architecture docs into onboarding presentations.

### 3. Research Notes → Presentation

Turn your research markdown files into shareable decks for stakeholder reviews.

### 4. Data Reports

Use the programmatic API to generate reports from database queries or API responses.

---

## CLI Usage

For automation or CI/CD pipelines:

```bash
cd platforms/vscode-extension
npx ts-node .github/muscles/pptxgen-cli.ts --input docs/presentation.md --output output/deck.pptx

# Quick deck from content
npx ts-node .github/muscles/pptxgen-cli.ts --content "Welcome|Point 1|Point 2" -o quick.pptx
```

### CLI Options

| Flag            | Description                          |
| --------------- | ------------------------------------ |
| `--input, -i`   | Input markdown file                  |
| `--content, -c` | Pipe-separated content               |
| `--output, -o`  | Output file (default: `output.pptx`) |
| `--title, -t`   | Presentation title                   |
| `--author, -a`  | Author name                          |
| `--layout`      | `16x9`, `16x10`, or `4x3`            |

---

## Tips

1. **Keep slides simple** — 3-5 bullets per slide works best
2. **Use section dividers** — Add `[section]` to create visual breaks
3. **Speaker notes** — Use `> ` for notes only you can see
4. **Slide breaks** — `---` on its own line = new slide
5. **Title detection** — First `#` becomes the title slide automatically

---

## Limitations

- Maximum recommended: 50 slides per deck
- Chart/table/image slides require programmatic API
- No animations or transitions (static slides)
- Offline only — no cloud upload

---

## Related Commands

| Command                   | Description             |
| ------------------------- | ----------------------- |
| `Alex: Generate Diagram`  | Create Mermaid diagrams |
| `Alex: Read Aloud`        | TTS for selected text   |
| `Alex: Run Project Audit` | Code quality check      |

---

*Powered by [PptxGenJS](https://github.com/gitbrent/PptxGenJS) — MIT licensed, zero cloud dependencies.*
