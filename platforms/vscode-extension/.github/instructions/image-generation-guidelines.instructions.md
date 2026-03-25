---
applyTo: "**/generate-*.js,**/generate-*.ts,**/*replicate*,**/*converter*,**/*pipeline*"
description: Image generation guidelines, Replicate workflow documentation, and converter pipeline patterns
---

# Image Generation and Converter Pipeline Guidelines

## Image Generation Guidelines

### Prompt Structure

Every Replicate image generation prompt should follow this structure:

```
IDENTITY PRESERVATION (highest priority):
- [immutable traits from visual-memory.json]

SUBJECT:
- Who/what is being depicted
- Age, expression, pose

SCENE:
- Setting, environment, lighting
- Time of day, atmosphere

STYLE:
- Art style (photorealistic, cinematic, illustration)
- Camera angle, lens, depth of field
- Color palette, mood
```

### Model Selection

| Task | Model | Cost | Notes |
|------|-------|------|-------|
| Face-consistent portraits | nano-banana-pro | $0.05 | Requires reference image |
| Text in images | ideogram-v2 | $0.08 | Best typography |
| Premium text | ideogram-v3-quality | $0.09 | Highest quality text |
| Production banners | flux-1.1-pro | $0.04 | No text support |
| Quick iteration | flux-schnell | $0.003 | Fast, low quality |
| Print quality 4MP | flux-1.1-pro-ultra | $0.06 | Up to 4MP output |

### Reference Image Requirements

- Format: PNG or JPEG, base64 data URI
- Resolution: 1024x1024 minimum for face consistency
- Face should be clearly visible, well-lit, frontal or 3/4 view
- Load from `visual-memory.json` via `converter-config.cjs:loadCharacterConfig()`

### Cost Management

- Always call `estimateCost(model, count)` before batch runs
- Use `--dry-run` to preview prompts without API calls
- Budget threshold: warn if estimated cost exceeds $5 for a single batch
- Use `--limit=N` to cap batch size during development

### Prompt Versioning

- Use `--save-prompts` flag to save `.prompt.txt` alongside each generated image
- Prompt files contain: model name, timestamp, and full prompt text
- Enables reproducibility and A/B comparison across prompt iterations

## Pipeline Workflows

### Workflow 1: Character Portrait Generation

```
1. Load reference image from visual-memory.json
2. Preprocess prompt via prompt-preprocessor.cjs (clean + inject traits)
3. Generate via nano-banana-pro with reference image
4. Optional: --postprocess=rembg (remove background)
5. Optional: --postprocess=upscale (2x resolution)
6. Save report via writeReport()
```

### Workflow 2: README Banner Generation

```
1. Craft ultra-wide prompt (3:1 aspect ratio)
2. Choose model: ideogram-v2 for text, flux-pro for no-text
3. Generate at 1536x512
4. No post-processing needed (banner format)
5. Save to images/ directory
```

### Workflow 3: Persona Welcome Images

```
1. Define persona-specific prompts (Developer, Researcher, etc.)
2. Generate via ideogram-v2 (text overlay for persona name)
3. Batch with rate limiting (3s between calls)
4. Generate report with costs
```

### Workflow 4: Age Progression Series

```
1. Load reference face from visual-memory.json
2. Build age-specific prompts (child, teen, young adult, mature)
3. Generate via nano-banana-pro with REFERENCE_AGE anchoring
4. Batch all ages in sequence with retry
5. Verify face consistency across outputs
```

### Workflow 5: Diagram Visualization

```
1. Define diagram concepts as structured prompts
2. Generate via ideogram-v2 (1536x512, wide format)
3. No reference image needed
4. Save to alex_docs/diagram-visualization/
```

### Workflow 6: A/B Prompt Testing

```
1. Write base prompt
2. Run with --variants=3 to test multiple variations
3. Use --save-prompts to capture each variant's prompt
4. Compare outputs manually
5. Pick winner, update prompt template
```

### Workflow 7: Image Post-Processing Chain

```
1. Generate base image via any model
2. Apply post-processing: --postprocess=rembg,upscale
3. Pipeline: source.png → source_rembg.png → source_rembg_upscale.png
4. Each step is independent — chain only what's needed
```

### Workflow 8: Batch Generation with Budget

```
1. Define jobs array with model, prompt, outputPath
2. Call estimateCost() to preview total budget
3. Confirm or abort based on budget threshold
4. Run via runBatch() with savePrompts: true
5. Generate report with writeReport()
6. Review: successful/failed counts, total cost, duration
```

## Converter Pipeline Patterns

### Word Document Pipeline (md-to-word.cjs)

```
Source Markdown
  → preprocessMarkdown() [BOM strip, LaTeX→Unicode, callouts, kbd, highlights]
  → Mermaid blocks → PNG rendering via mmdc (scale 8)
  → SVG → PNG rasterization
  → pandoc (markdown → docx) with optional Lua filters
  → OOXML post-processing [tables, headings, code, hyperlinks, captions, spacing]
  → Page number footer injection
  → Style defaults (font, line height, widow/orphan)
  → Final DOCX
```

### Email Pipeline (md-to-eml.cjs)

```
Source Markdown (with YAML frontmatter)
  → extractFrontmatter() [to, from, subject, cc, bcc]
  → preprocessMarkdown(format: 'email')
  → Mermaid → table fallback (email clients can't render diagrams)
  → pandoc (markdown → html5)
  → applyInlineStyles() [CSS → inline style= attributes]
  → RFC 5322 header generation
  → Optional: base64 CID image embedding
  → Final .eml file
```

### Presentation Pipeline (gamma-generator.cjs)

```
Source Markdown (H2 slide breaks)
  → markdown-lint validation (target: 'slides')
  → Gamma API: create presentation from markdown
  → Optional: stylePreset, cardSplit, additionalInstructions
  → Poll for completion
  → Export as PDF, PPTX, or PNG
```
