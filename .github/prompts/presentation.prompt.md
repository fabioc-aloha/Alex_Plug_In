---
mode: agent
description: Generate professional presentations via Gamma API, Marp markdown, or native PPTX
---

# Presentation Generator

Create professional presentations using any of Alex's three presentation engines.

## Available Engines

### 1. Gamma API (Recommended for AI-generated content)
**Best for**: Marketing decks, pitch presentations, sales content
**Output**: PDF, PPTX, Webpage
**Cost**: Requires Gamma API credits

Use when you want AI to generate both structure and visuals:
```javascript
// Run via gamma-generator.js
node .github/muscles/gamma-generator.js --topic "Your topic" --slides 10
```

Features:
- Professional templates and themes
- AI-generated images
- Expert typography and layouts
- Export to multiple formats

### 2. Marp (Markdown-based)
**Best for**: Developer presentations, technical talks, documentation
**Output**: PDF, PPTX, HTML
**Cost**: Free (local generation)

Use when you prefer writing in Markdown:
```markdown
---
marp: true
theme: alex
---

# My Presentation

- Point one
- Point two
```

Export: `npx @marp-team/marp-cli presentation.md -o output.pptx`

### 3. PptxGenJS (Programmatic PPTX)
**Best for**: Data-driven presentations, automated reports, template-based decks
**Output**: Native .pptx
**Cost**: Free (local generation)

Use when you need programmatic generation or data-rich slides:
```typescript
import { generatePresentation } from './generators/pptxGenerator';

const slides = [
  { type: 'title', title: 'Q4 Results', subtitle: 'Revenue Growth' },
  { type: 'chart', data: chartData },
  { type: 'table', data: tableData }
];
```

Features:
- Native PowerPoint generation
- Charts, tables, illustrations
- Alex brand themes
- Full layout control

## Decision Guide

| Need | Engine | Why |
|------|--------|-----|
| Quick marketing deck | Gamma | AI generates visuals and copy |
| Technical presentation | Marp | Markdown-native, code blocks |
| Automated reports | PptxGenJS | Data-driven, programmatic |
| Custom branding | PptxGenJS | Full theme control |
| Collaborative editing | Gamma | Export to editable PPTX |
| Version control | Marp | Markdown in git |

## Quick Start

Tell me about your presentation and I'll help you choose:

1. **Who** is your audience?
2. **What** is the goal? (inform, persuade, inspire, teach)
3. **How** will it be delivered? (live, async, printed)
4. **Any** specific requirements? (data, images, interactivity)

## Related Commands

- `/gamma` - Generate via Gamma API with AI imagery
- `/marp` - Create Marp markdown presentation
- `/slides` - Quick content outline to slides (auto-selects engine)
