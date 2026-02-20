# Generate Gamma Presentation

**Command**: `/gamma [topic or file path]`

Generate professional AI-powered presentations using the Gamma API with expert Duarte methodology consulting.

---

## Usage

```
/gamma Introduction to Machine Learning
/gamma --file ./README.md
/gamma Climate Solutions --slides 15 --export pptx
```

---

## What This Does

1. **Consults** on presentation structure using Duarte methodology
2. **Generates** AI-powered slides with professional design
3. **Exports** to PPTX or PDF with auto-download
4. **Opens** file automatically (optional)

---

## Two-Step Workflow (Recommended)

For presentations that need editing before generation:

```
/gamma My Topic --draft
# Alex creates draft markdown → You edit → Continue below
/gamma --file ./my-topic-draft.md --export pptx --open
```

---

## Key Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--topic` / `-t` | Topic or content to generate from | `--topic "AI Ethics"` |
| `--file` / `-f` | Path to markdown file | `--file ./deck.md` |
| `--slides` / `-n` | Number of slides (1-75) | `--slides 12` |
| `--format` | Output format | `--format presentation` |
| `--export` / `-e` | Export type | `--export pptx` |
| `--tone` | Tone description | `--tone "inspiring"` |
| `--audience` | Target audience | `--audience "executives"` |
| `--image-model` | AI image model | `--image-model flux-pro` |
| `--draft` | Create markdown template only | `--draft` |
| `--open` | Open file after generation | `--open` |

---

## Format Options

- `presentation` (default): Full slide deck
- `document`: Long-form document
- `social`: Social media carousel
- `webpage`: Web page layout

---

## Image Models by Cost

**Cost-effective (2 credits)**:
- `flux-quick`, `flux-kontext`, `imagen-flash`, `luma-flash`

**Standard (8-15 credits)**:
- `flux-pro` (recommended), `imagen-pro`, `ideogram-turbo`, `leonardo`

**Premium (20-33 credits)**:
- `ideogram`, `imagen4`, `gemini`, `recraft`, `gpt-image`, `dalle3`

**Ultra (30-120 credits)**:
- `flux-ultra`, `imagen4-ultra`, `recraft-svg`, `gpt-image-hd`

---

## Example Workflows

### Quick Presentation
```
/gamma Introduction to Neural Networks --export pptx --open
```

### Custom Pitch Deck
```
/gamma Product Launch Plan \
  --slides 15 \
  --tone "bold and visionary" \
  --audience "investors" \
  --image-model flux-pro \
  --export pptx \
  --open
```

### Draft → Edit → Generate
```
# Step 1: Create draft
/gamma Quarterly Business Review --slides 12 --draft --draft-output ./deck.md

# Step 2: (User edits ./deck.md in VS Code)

# Step 3: Generate from edited draft
/gamma --file ./deck.md --export pptx --open
```

### From Existing Markdown
```
/gamma --file ./README.md --slides 10 --export pptx
```

---

## Duarte Methodology Consulting

Alex applies expert presentation consulting based on Nancy Duarte's methodology:

### Story Structure
- **Beginning**: Establish current state ("what is")
- **Middle**: Contrast with vision ("what could be")
- **End**: Call to action and "new bliss"

### Key Principles
1. **Audience as Hero**: Position audience as protagonist
2. **Sparkline**: Alternate between "what is" and "what could be"
3. **S.T.A.R. Moments**: Something They'll Always Remember
4. **Data Storytelling**: Transform numbers into meaning
5. **Visual Hierarchy**: One idea per slide
6. **New Bliss**: Clear vision of attainable future

---

## Environment Setup

Before first use:

1. Get API key: https://gamma.app/settings
2. Set environment variable:
   - **Windows**: `setx GAMMA_API_KEY "your-key-here"`
   - **macOS/Linux**: `export GAMMA_API_KEY="your-key-here"`
3. Verify: `node .github/muscles/gamma-generator.js --help`

---

## Output

Gamma generation produces:
- **Gamma URL**: Live presentation on gamma.app (editable)
- **Export File**: PPTX or PDF downloaded to `./exports/` or custom path
- **Credit Report**: Credits used and remaining balance

---

## Related Commands

- `/marp` - Generate Marp presentation (markdown-based, offline)
- `/word` - Convert markdown to Word document
- `/diagram` - Generate Mermaid diagrams for slides

---

## Tips

1. **Use draft mode** for presentations that need review before generation
2. **Keep topics focused** - specific topics generate better results
3. **Provide context** in --instructions for tailored content
4. **Choose image model** based on budget (flux-quick for prototypes, flux-pro for final)
5. **Edit the Gamma URL output** - all Gamma presentations are editable online after generation

---

## Troubleshooting

**"GAMMA_API_KEY not set"**
→ Set environment variable and restart VS Code

**"Generation timeout"**
→ Increase timeout: `--timeout 300` (5 minutes)

**"Credits exhausted"**
→ Check balance at gamma.app/settings, upgrade plan if needed

**Exit code 1**
→ Check Gamma API status, verify API key is valid

---

## Cost Management

- Default presentation (10 slides, flux-pro): ~80 credits
- Use `--image-model flux-quick` for drafts: ~20 credits
- Long presentations (30+ slides): 200-300 credits
- Premium models can use 500+ credits for large decks

Monitor credits at: https://gamma.app/settings
