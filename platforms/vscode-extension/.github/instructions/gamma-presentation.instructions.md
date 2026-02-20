# Gamma Presentation Generation

**Auto-Activation**: When users mention presentation generation, AI slides, or visual storytelling.

---

## Activation Triggers

Load `.github/skills/gamma-presentations/SKILL.md` when detecting:

- "create presentation"
- "make slides"
- "generate deck"
- "gamma presentation"
- "ai presentation"
- "pitch deck"
- "slide deck"
- "powerpoint from markdown"
- "markdown to pptx"
- "visual storytelling"

---

## Routing Logic

### Simple Presentation Request
**Pattern**: "Create a presentation about [topic]"  
**Route**: Read gamma-presentations skill → Execute gamma muscle  
**Capability**: `.github/muscles/gamma-generator.js`

### Presentation from File
**Pattern**: "Convert this markdown to slides"  
**Route**: Read gamma-presentations skill → Execute gamma muscle with file input  
**Capability**: `.github/muscles/gamma-generator.js --file <path>`

### Advanced Customization
**Pattern**: "Create a presentation with custom images/tone/format"  
**Route**: Read gamma-presentations skill → Consult on Duarte methodology → Execute gamma muscle with advanced options  
**Capability**: Full parameter set (format, slides, tone, audience, image-model, etc.)

---

## Key Capabilities

1. **AI-Powered Generation**: Full REST API integration with Gamma.app
2. **Duarte Methodology Consulting**: Expert storytelling structure based on Nancy Duarte's proven framework
3. **Two-Step Workflow**: Draft markdown → User edits → Final generation
4. **Multiple Formats**: presentation, document, social, webpage
5. **Advanced Image Control**: 16 AI models from flux-quick (2 credits) to gpt-image-hd (120 credits)
6. **Export Options**: PPTX or PDF with auto-download
7. **Smart Content Handling**: Auto-condense for long files (>10K chars)

---

## Muscle Invocation Pattern

```bash
# Simple topic-based generation
node .github/muscles/gamma-generator.js --topic "Introduction to AI" --export pptx

# From markdown file
node .github/muscles/gamma-generator.js --file README.md --export pptx --open

# Advanced customization
node .github/muscles/gamma-generator.js \
  --topic "Climate Solutions" \
  --slides 12 \
  --tone "inspiring and actionable" \
  --audience "business leaders" \
  --image-model flux-pro \
  --export pptx \
  --open

# Two-step workflow (draft → edit → generate)
node .github/muscles/gamma-generator.js --topic "AI Ethics" --draft --draft-output ./deck.md
# ... user edits deck.md ...
node .github/muscles/gamma-generator.js --file ./deck.md --export pptx --open
```

---

## Consulting Workflow

When users provide rough content, follow the **Duarte methodology** consulting process:

1. **Discovery**: Ask about audience, goal, key takeaway
2. **Concept Presentation**: Present narrative storyboard with sparkline structure
3. **User Feedback**: Refine based on user input
4. **Structured Markdown**: Generate full markdown for approval
5. **User Approval**: User reviews and edits
6. **Generation**: Execute gamma muscle with approved content

---

## Environment Requirements

- **GAMMA_API_KEY**: Required environment variable
  - Get from: https://gamma.app/settings
  - Set in: System environment or `.env` file
- **Node.js**: Required for gamma-generator.js execution
- **Exports Directory**: Auto-created at `./exports` or custom path via `--output`

---

## VS Code Integration

Available commands:
- **Generate Gamma Presentation**: Quick topic-based generation
- **Generate Gamma from File**: Convert markdown file to presentation
- **Generate Gamma (Advanced)**: Full options dialog

Context menu (right-click .md file):
- Generate Gamma Presentation
- Generate Gamma Presentation (Advanced)...

---

## Credit Cost Guide

Image models by cost tier:
- **Cost-effective (2 credits)**: flux-quick, flux-kontext, imagen-flash, luma-flash
- **Standard (8-15 credits)**: flux-pro, imagen-pro, ideogram-turbo, leonardo
- **Premium (20-33 credits)**: ideogram, imagen4, gemini, recraft, gpt-image, dalle3
- **Ultra (30-120 credits)**: flux-ultra, imagen4-ultra, recraft-svg, gpt-image-hd

Default presentation (10 slides, standard images): ~80-150 credits

---

## Error Handling

Common issues:
1. **Missing GAMMA_API_KEY**: Prompt user to set environment variable
2. **API timeout**: Increase `--timeout` parameter (default: 180s)
3. **Generation failed**: Check API status at gamma.app
4. **Exit code 1**: Gamma API error, check response body

---

## Related Skills

- `markdown-mermaid`: Diagrams can enhance presentation content
- `prompt-engineering`: Effective inputText crafting improves results
- `presentation-tool-selection`: Decision matrix for Marp vs Gamma vs manual
- `brand-asset-management`: Consistent visual identity across presentations

---

## Synapse Connections

Read `.github/skills/gamma-presentations/synapses.json` for:
- Semantic routing patterns
- Tool requirements
- Connection strengths
- Bidirectional relationships
