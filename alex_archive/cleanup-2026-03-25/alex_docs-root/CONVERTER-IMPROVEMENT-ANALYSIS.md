# Text File Converter Improvement Analysis

**Date**: 2026-03-24
**Scope**: All Alex Cognitive Architecture converters and generators that transform source inputs into output formats
**Goal**: Achieve first-run production quality -- eliminate the iterative back-and-forth that burns hours on every project
**Status**: **46 of 46 items implemented** (v5.1.0 sprint) -- all phases complete, 284 QA assertions passing

## 0. The Problem: Death by Iteration

Every project repeats the same expensive cycle:

1. Run converter/generator
2. Open output -- visually inspect
3. Find the same issues we already solved in another project (tables splitting, fonts wrong, diagrams oversized, prompt missing identity traits, Mermaid un-styled)
4. Fix the converter, re-run
5. Inspect again -- find new issue
6. Repeat 3-6 until acceptable

This cycle costs **hours per document** and **dollars per image batch** -- on problems we have already solved. The knowledge stays trapped in the specific project's script instead of flowing back to the base converters.

### The Goal: First-Run Production Quality

> **Every converter should produce visually inspectable, production-ready output on the first run, with zero manual iteration, for any project.**

This means all lessons learned from past projects must be encoded into the converters themselves -- not rediscovered each time.

## 0.1 Core Principle: Format the Source First

Every converter has two phases: **source preparation** and **output generation**. The most impactful insight from all our iterations:

> **Always improve the source before conversion -- never fight the output format.**

| Converter Type | Source      | "Format First" Means...                                                             |
| -------------- | ----------- | ----------------------------------------------------------------------------------- |
| Word / PDF     | Markdown    | Fix spacing, blank lines, checkboxes, image refs, heading hierarchy BEFORE pandoc   |
| Gamma / PPT    | Markdown    | Structure H2 slide breaks, speaker notes, content density per slide BEFORE API call |
| Replicate      | Prompt text | Craft structured, section-labeled prompts with explicit priorities BEFORE API call  |
| Mermaid        | `.mmd` code | Add `%%{init}%%` directives, apply palette, validate syntax BEFORE mmdc render      |

**Why this matters**: Pandoc, Gamma, Replicate, and Mermaid are all "one-shot" engines -- you get one pass. Post-processing (OOXML hacking, image editing, re-prompting) is expensive and fragile. Investing in source quality gives 10x returns.

### What "First-Run Quality" Requires

| Layer                  | What Must Be Built-In                                                              | Current State (v5.0.0)                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source preprocessing   | All known markdown/prompt fixes applied automatically                              | **Shared** `markdown-preprocessor.cjs`: BOM strip, LaTeX→Unicode, callouts, kbd, highlights, sub/sup, definitions, page breaks, list spacing. Used by md-to-word + md-to-eml |
| Source authoring       | Content authored correctly from the start                                          | **New** `md-scaffold.cjs` (6 templates), `markdown-lint.cjs` (19 rules), mermaid creation helpers, `svg-pipeline.cjs` (create/validate)                                      |
| Output post-processing | All known OOXML/image fixes applied by default                                     | md-to-word full pipeline (tables, headings, code, hyperlinks, captions, page numbers, footer); md-to-eml inline CSS + CID images; 3 Lua filters                              |
| Sensible defaults      | Professional fonts, colors, spacing, page layout out of the box                    | md-to-word has 4 style presets (professional/academic/course/creative); per-project `.converter.json` overrides; `visual-memory.json` for character traits                   |
| Lessons encoded        | Every visual issue found and fixed in any project feeds back to the base converter | **v5.0.0 merged fixes from 5 projects** into 7 shared modules + 3 Lua filters + config system. 284 QA assertions prevent regression                                          |
| No manual flags needed | The default run should be production-quality without special flags                 | Default md-to-word run is professional preset with full OOXML post-processing. `markdown-lint.cjs` catches issues before conversion                                          |

## 1. Current Converter Inventory

### A. Document Converters

| Converter       | File                                  | Version | Input              | Output             | Status                        |
| --------------- | ------------------------------------- | ------- | ------------------ | ------------------ | ----------------------------- |
| md-to-word      | `.github/muscles/md-to-word.cjs`      | v5.1.0  | Markdown + Mermaid | .docx              | Active -- most mature         |
| md-to-eml       | `.github/muscles/md-to-eml.cjs`       | v1.0.0  | Markdown + YAML FM | .eml (RFC 5322)    | Active -- email conversion    |
| md-scaffold     | `.github/muscles/md-scaffold.cjs`     | v1.0.0  | Template name      | .md (structured)   | Active -- authoring scaffold  |
| markdown-lint   | `.github/muscles/markdown-lint.cjs`   | v1.0.0  | Markdown           | Validation report  | Active -- pre-conversion lint |
| nav-inject      | `.github/muscles/nav-inject.cjs`      | v1.0.0  | nav.json + .md     | .md (nav-stamped)  | Active -- cross-doc nav       |
| gamma-generator | `.github/muscles/gamma-generator.cjs` | -       | Markdown / topic   | PDF, PPTX, Webpage | Active -- API-driven          |
| pptxgen-cli     | `.github/muscles/pptxgen-cli.ts`      | -       | Markdown           | .pptx              | Active -- programmatic slides |

### B. Image Generators (Replicate)

| Generator          | File                                         | Model                         | Input                          | Output         |
| ------------------ | -------------------------------------------- | ----------------------------- | ------------------------------ | -------------- |
| Age Progression    | `scripts/generate-alex-age-progression.js`   | nano-banana-pro               | Prompt + reference face        | PNG 1024x1024  |
| Persona Images     | `scripts/generate-alex-persona-images.js`    | nano-banana-pro               | Prompt + reference face        | PNG 1024x1024  |
| Agent Mode Banners | `scripts/generate-alex-agent-images.js`      | nano-banana-pro + ideogram-v2 | Prompt + reference face + logo | PNG 1024x1024  |
| Welcome Banners    | `scripts/generate-persona-welcome-images.js` | ideogram-v2                   | Prompt (no reference)          | PNG 1024x1024  |
| README Banners     | `scripts/generate-readme-banners.js`         | ideogram-v2                   | Prompt (no reference)          | PNG 1536x512   |
| Diagram Viz        | `scripts/generate-diagram-visualizations.js` | ideogram-v2                   | Prompt (no reference)          | PNG 1536x512   |
| Model Search       | `scripts/search-replicate-models.js`         | (utility)                     | Query string                   | Console output |

### C. Related Tooling

| Tool               | Purpose                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| pandoc             | Core Markdown-to-OOXML engine (used by md-to-word)                                |
| mermaid-cli (mmdc) | Renders `.mmd` to PNG (used by md-to-word)                                        |
| svgexport          | SVG-to-PNG rasterization for banners/logos                                        |
| PptxGenJS          | Programmatic slide generation (used by pptxgen-cli)                               |
| converter-qa.cjs   | QA test harness -- 284 assertions across 21 suites (validates all shared modules) |

### D. Shared Modules (`.github/muscles/shared/`)

| Module                    | Version | Purpose                                                                                                                                           |
| ------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-uri.cjs              | v1.0.0  | Base64 data URI encode/decode, MIME detection, file download                                                                                      |
| mermaid-pipeline.cjs      | v2.0.0  | Mermaid block extraction, palette injection, fallback tables, creation helpers (flowchart, sequence, gantt, timeline, mindmap)                    |
| markdown-preprocessor.cjs | v1.0.0  | BOM strip, LaTeX→Unicode, extended markdown transforms (callouts, kbd, highlights, sub/sup, definitions, page breaks)                             |
| replicate-core.cjs        | v5.1.0  | Replicate client init, cost estimation, CLI arg parsing, batch retry with backoff, duration validation, model freshness, post-processing pipeline |
| prompt-preprocessor.cjs   | v1.0.0  | Shared prompt preprocessing -- section validation, trait injection, smart quote cleanup, model-family length limits                               |
| converter-config.cjs      | v1.0.0  | Per-project .converter.json config loader with defaults, deep merge, prompt template interpolation                                                |
| svg-pipeline.cjs          | v1.0.0  | SVG creation (icons, diagrams, badges), validation, PNG conversion, brand color palette                                                           |
| index.mjs                 | v5.1.0  | ESM bridge for CJS shared modules (used by Replicate scripts)                                                                                     |

### E. Lua Filters (`.github/muscles/lua-filters/`)

| Filter               | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| keep-headings.lua    | Heading pagination (\clearpage, \Needspace)     |
| word-table-style.lua | Table styling rules for pandoc OOXML output     |
| caption-labels.lua   | Caption label formatting for figures and tables |

### F. Config Files (`.github/config/`)

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| visual-memory.json            | Character config (traits, prompts, references)   |
| converter-config.example.json | Schema/example for per-project .converter.json   |
| Gamma API                     | Cloud AI presentation engine                     |
| Replicate SDK                 | `replicate` npm package for model inference      |
| replicateService.ts           | VS Code extension service wrapping Replicate API |

## 2. md-to-word.cjs -- Features Developed (v3.0.0 → v4.0.0 → v5.0.0 → v5.1.0)

The Word converter has been the primary focus of iterative improvement. v4.0.0 harvested proven fixes from all 5 external projects analyzed in §8. v5.0.0 extracted shared modules, added style presets, extended markdown transforms, watch mode, reference-doc support, and Lua filter passthrough. Below is the complete feature set.

### 2.1 Mermaid Diagram Handling

| Feature                    | Description                                                | How It Works                                           |
| -------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| Auto-detection             | Finds all ` ```mermaid ` blocks in markdown                | Regex scan, indexes blocks                             |
| PNG rendering (scale 8)    | Converts each block via `mmdc` at scale 8 / width 2400     | Temp `.mmd` file, 60s timeout (v4.0.0: from AlexBooks) |
| Smart sizing (pixel-based) | Reads actual PNG header for width/height                   | Reads 24-byte PNG header, no dependencies              |
| Smart sizing (heuristic)   | Falls back to content-based sizing when pixels unavailable | Detects gantt, flowchart LR/TD, subgraph count         |
| Aspect ratio preservation  | Constrains to max bounds while keeping ratio               | `min(widthScale, heightScale, 1.0)`                    |
| Page bounds                | 100% width (6.5"), 40% height (3.6") max                   | Prevents diagrams from dominating the page             |

### 2.2 Table Formatting (OOXML Post-Processing)

| Feature                | Description                                          | OOXML Implementation                                 |
| ---------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Blue header row        | Microsoft blue (#0078D4), white bold text            | `w:shd fill="0078D4"`, `w:b`, `w:color val="FFFFFF"` |
| Header row repeat      | Header row repeats on every page (v4.0.0: from AIRS) | `w:tblHeader` on first row                           |
| Alternating row colors | Even rows light gray (#F0F0F0), odd rows white       | `w:shd` per table cell                               |
| Professional borders   | Outer #666666 6pt, inner #AAAAAA 4pt                 | `w:tblBorders` with `w:insideH`/`w:insideV`          |
| Cell padding           | 2pt top/bottom, 4pt left/right                       | `w:tblCellMar` with twip values (40/80)              |
| Full-width tables      | Tables span 100% of printable area                   | `w:tblW type="pct" w:w="5000"`                       |
| Auto-fit columns       | Columns adjust to content width                      | `w:tblLayout type="autofit"`                         |
| Row anti-split         | Rows never split across pages                        | `w:cantSplit` on every row                           |
| Table keep-together    | Entire table tries to stay on one page               | `w:keepNext` on paragraphs in non-last rows          |
| Data row font          | 9pt (#000000)                                        | `w:sz val="18"` on data cell runs                    |

### 2.3 Heading Formatting

| Feature | Heading        | Color   | Space Before   | Space After   |
| ------- | -------------- | ------- | -------------- | ------------- |
| H1      | Deep blue      | #00528B | 18pt (360twip) | 6pt (120twip) |
| H2      | Microsoft blue | #0078D4 | 14pt (280twip) | 4pt (80twip)  |
| H3      | Teal           | #105E7E | 12pt (240twip) | 4pt (80twip)  |
| H4      | Teal           | #105E7E | 10pt (200twip) | 3pt (60twip)  |

All headings get `w:keepNext` + `w:keepLines` to prevent orphaned headers.

### 2.4 Code Block Formatting

| Feature       | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| Font          | Consolas 9pt, dark gray (#1E1E1E)                                |
| Background    | Light gray (#F5F5F5)                                             |
| Border        | Left accent bar (24pt, #CCCCCC), thin top/bottom/right (#E0E0E0) |
| Keep together | `w:keepLines` to prevent code splitting across pages             |

### 2.5 Document Defaults

| Setting                 | Value                                 |
| ----------------------- | ------------------------------------- |
| Body font               | Segoe UI 10.5pt (21 half-points)      |
| Body color              | #1F2328                               |
| Line height             | 1.3x (312 twips, `w:lineRule="auto"`) |
| After-paragraph spacing | 6pt (120 twips)                       |
| Widow/orphan control    | Enabled on all body paragraphs        |

### 2.6 Markdown Preprocessing

| Feature              | Description                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| UTF-8 BOM stripping  | Strips BOM before processing (v4.0.0: from AlexBooks)                   |
| LaTeX math → Unicode | 30+ symbol mappings: Greek, operators, superscripts (v4.0.0: from AIRS) |
| Blank line injection | Adds blank lines before/after lists for pandoc compatibility            |
| Checkbox conversion  | `[ ]` to unicode checkbox, `[x]` to checked                             |
| SVG-to-PNG fallback  | Detects `.svg` image refs, rasterizes via svgexport                     |

### 2.7 Image Handling and v4.0.0 Features

| Feature           | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| Centered images   | All image paragraphs get `w:jc val="center"`                           |
| SVG conversion    | Rasterizes SVG references to PNG before pandoc                         |
| Hyperlink styling | Blue (#0563C1) + underline on all hyperlinks (v4.0.0)                  |
| Caption keep      | Table/Figure captions kept with content via keepNext (v4.0.0)          |
| Page numbers      | Centered gray footer with PAGE field code (v4.0.0)                     |
| TOC generation    | `--toc` flag passes `--toc --toc-depth=3` to pandoc (v4.0.0)           |
| Cover page        | `--cover` generates title + date preamble from H1 metadata (v4.0.0)    |
| Page size         | `--page-size letter\|a4\|6x9` via pandoc geometry vars (v4.0.0)        |
| Debug output      | `--debug` saves preprocessed markdown as `_debug_combined.md` (v4.0.0) |

### 2.8 v5.0.0 Features

| Feature              | Description                                                                          |
| -------------------- | ------------------------------------------------------------------------------------ |
| Style presets        | `--style professional\|academic\|course\|creative` (distinct fonts, colors, spacing) |
| Watch mode           | `--watch` monitors source file, auto-rebuilds on change (500ms debounce)             |
| Reference doc        | `--reference-doc template.docx` passthrough to pandoc for corporate templates        |
| Lua filter support   | `--lua-filter path.lua` passthrough to pandoc (3 bundled filters)                    |
| Extended callouts    | `::: tip` / `> [!TIP]` converted to styled blocks                                    |
| Keyboard shortcuts   | `<kbd>Ctrl+C</kbd>` formatted with border styling                                    |
| Highlights           | `==text==` converted to highlighted spans                                            |
| Sub/superscript      | `~sub~` / `^sup^` converted to subscript/superscript                                 |
| Definition lists     | `Term\n: Definition` converted to styled definitions                                 |
| Page break directive | `<!-- pagebreak -->` inserts hard page break                                         |
| Landscape/portrait   | `<!-- landscape -->` / `<!-- portrait -->` page orientation directives               |
| Shared preprocessing | Uses `markdown-preprocessor.cjs` (shared with md-to-eml)                             |
| Shared Mermaid       | Uses `mermaid-pipeline.cjs` for block detection and palette injection                |

### 2.9 v5.1.0 Features

| Feature         | Description                                                                               |
| --------------- | ----------------------------------------------------------------------------------------- |
| Caption styling | Italic 9pt gray (#595959) centered alignment on Table/Figure captions (was keepNext-only) |

## 3. Mermaid Pipeline -- Lessons Learned

The Mermaid rendering pipeline required significant iteration:

1. **Init directive matters** -- `%%{init}%%` controls theme variables including `edgeLabelBackground` and `lineColor`
2. **White background required** -- `mmdc` needs `-b white` flag to avoid transparent PNG artifacts in Word
3. **Pastel palette enforcement** -- GitHub Pastel v2 palette ensures consistent, professional diagrams
4. **Flowchart TD vs LR heuristic** -- TD diagrams tend to be tall and narrow; LR diagrams are wide -- sizing must adapt
5. **Subgraph count drives size** -- More subgraphs typically means a wider/taller diagram
6. **Edge labels on white** -- `edgeLabelBackground: '#ffffff'` prevents label-on-line illegibility

## 4. OOXML Post-Processing Pipeline

The key architectural insight is that pandoc produces decent structure but needs significant post-processing. The pipeline:

```
Markdown
  -> preprocessMarkdown() -- BOM strip, LaTeX math→Unicode, lists, checkboxes, spacing
  -> findMermaidBlocks() + convertMermaidToPng() -- render at scale 8 / width 2400
  -> pandoc --from markdown --to docx [--toc] [--page-size geometry vars]
  -> postProcessDocx() via JSZip:
       -> formatTables()             -- borders, colors, widths, cell padding, tblHeader
       -> keepTablesIntact()         -- prevent page splits
       -> centerImages()             -- align diagrams
       -> formatHeadings()           -- colors, spacing, keep-next
       -> formatCodeBlocks()         -- Consolas, gray bg, left accent
       -> formatHyperlinks()         -- blue #0563C1 + underline (v4.0.0)
       -> keepCaptionsWithContent()  -- Table/Figure N keepNext (v4.0.0)
       -> fixParagraphSpacing()      -- line height, widow control
       -> addPageNumberFooter()      -- centered page number footer (v4.0.0)
       -> setDocumentDefaults()      -- font, color in styles.xml
  -> Write final .docx
```

## 5. Replicate Image Generation Pipeline -- Features Developed

### 5.1 Prompt Architecture (The "Source" for Image Generation)

All Replicate generators follow a structured prompt pattern. This IS the "format source first" for images -- the prompt is the source.

**Prompt Structure Template (persona-images, age-progression, agent-images)**:

```
SECTION 1: REFERENCE CONTEXT
- What the reference image shows (age, identity)
- What transformation is needed (age delta, direction)

SECTION 2: IDENTITY PRESERVATION (explicit, highest priority)
- Facial bone structure, nose/eye/lip shape
- Immutable traits (hair color, eye color, freckles)
- Recognizability requirement

SECTION 3: SCENE/CONTEXT
- Activity, attire, setting, expression
- Mood, lighting, color accents

SECTION 4: TECHNICAL REQUIREMENTS
- Aspect ratio, resolution, style
- Format, composition rules
- What to exclude (e.g., "NO TEXT OR TYPOGRAPHY")
```

**Key Insight**: Every successful generator uses section headers with CAPS labels (e.g., `IDENTITY PRESERVATION`, `SCENE DETAILS`, `TECHNICAL REQUIREMENTS`). This is prompt formatting that directly improves output quality -- the equivalent of `preprocessMarkdown()` for documents.

### 5.2 Character Definition System

All face-consistent generators share an immutable character definition:

```javascript
const ALEX_TRAITS = {
  immutable: [
    'curly ginger copper-red hair',
    'striking blue-green eyes',
    'fair skin with light freckles across nose and cheeks',
    'intelligent curious expression',
  ],
  style: 'photorealistic portrait, shallow depth of field, natural lighting, 85mm lens',
};
```

This is the Replicate equivalent of "document defaults" -- applied to EVERY prompt for consistency.

### 5.3 Configuration-Driven Generation

| Generator        | Config Shape                                                                         | Fields               |
| ---------------- | ------------------------------------------------------------------------------------ | -------------------- |
| Age Progression  | `{ filename, age, stage, context, attire, expression, setting }`                     | 7 fields per age     |
| Persona Images   | `{ id, noun, age, scene, attire, setting, expression }`                              | 7 fields per persona |
| Agent Modes      | `{ filename, title, color, scene, pose, environment, attire, mood, lighting }`       | 9 fields per agent   |
| Cognitive States | `{ filename, title, subtitle, scenario, attire, pose, environment, lighting, mood }` | 9 fields per state   |
| Welcome Banners  | `{ filename, title, subtitle, color }`                                               | 4 fields per banner  |

**Pattern**: Config objects are the structured "source" that gets assembled into prompts by `buildPrompt()` functions. Separating config from prompt template allows:
- Batch generation (loop over configs)
- Dry-run previews (`--dry-run` shows assembled prompts)
- Easy addition of new items without touching prompt logic

### 5.4 Model Selection by Use Case

| Use Case                  | Model                          | Face Ref?            | Cost         | Special Feature    |
| ------------------------- | ------------------------------ | -------------------- | ------------ | ------------------ |
| Face-consistent portraits | `google/nano-banana-pro`       | Yes (data URI array) | $0.025/img   | Up to 14 refs      |
| Typography banners        | `ideogram-ai/ideogram-v2`      | No                   | $0.08/img    | Crystal-clear text |
| Fast face (future)        | `google/nano-banana-2`         | Yes                  | $0.067/1K px | 3x faster          |
| Multi-reference scenes    | `black-forest-labs/flux-2-pro` | Yes (up to 8)        | ~$0.05/img   | `input_images` API |
| SVG banners               | `recraft-ai/recraft-v4-svg`    | No                   | -            | Native vector      |

### 5.5 Reference Image Handling

```javascript
// Standard pattern across all generators
async function encodeImageToDataURI(imagePath) {
  const buffer = await fs.readFile(imagePath);
  const base64 = buffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : /* ... */ 'image/png';
  return `data:${mime};base64,${base64}`;
}
```

- Reference images encoded once, reused across all generations in a batch
- `image_input` MUST be an array (even for single reference) -- common API pitfall
- Reference age (15) is documented alongside operational age (21) for age-delta calculation

### 5.6 CLI Patterns (Consistent Across All Generators)

| Feature          | Implementation                                                |
| ---------------- | ------------------------------------------------------------- |
| Dry run          | `--dry-run` flag shows prompts without API calls              |
| Limit            | `--limit=N` generates only first N images                     |
| Skip             | `--skip=N` skips first N images (resume after failure)        |
| Only filter      | `--only=id1,id2` generates specific items                     |
| Token from .env  | `dotenv` loads from root `.env` file                          |
| Token validation | Fails fast with clear message if `REPLICATE_API_TOKEN` absent |
| Progress output  | Console banners, emoji status, timing                         |
| File persistence | Writes immediately to disk (Replicate URLs expire in 1 hour)  |

### 5.7 Replicate API Output Handling

```javascript
// The Ideogram URL getter quirk -- needed in every Ideogram-based script
let imageUrl;
if (output && typeof output.url === 'function') imageUrl = output.url().toString();
else if (Array.isArray(output)) imageUrl = output[0];
else if (typeof output === 'string') imageUrl = output;
else if (output?.url) imageUrl = output.url;
if (typeof imageUrl === 'object' && imageUrl?.href) imageUrl = imageUrl.href;
```

**Nano-banana-pro** returns a `FileObject` (modern API) -- write directly with `fs/promises writeFile`.
**Ideogram** returns a URL -- download with `https.get()` + redirect handling.

This inconsistency across models is a fragility point that should be abstracted.

## 6. Known Gaps and Improvement Opportunities

### 6.1 Missing Features (md-to-word)

| Gap                               | Impact                              | Difficulty                                   | AlexBooks Solves?                   | Status       |
| --------------------------------- | ----------------------------------- | -------------------------------------------- | ----------------------------------- | ------------ |
| No page numbers / header-footer   | Professional documents expect these | Medium -- OOXML header/footer parts          | Yes (build-pdf.js Puppeteer footer) | **v4.0.0** ✅ |
| No table of contents              | Long documents need navigation      | Medium -- pandoc `--toc` + OOXML field codes | Yes (build-pdf.js `generateToc()`)  | **v4.0.0** ✅ |
| No cover page                     | First impressions matter            | Medium -- custom OOXML front page            | Yes (title page + half-title)       | **v4.0.0** ✅ |
| No custom reference doc           | Can't match corporate templates     | Low -- pandoc `--reference-doc` support      | No                                  | **v5.0.0** ✅ |
| No A4 / custom page size support  | International users need A4         | Low -- parameterize page dimensions          | Partially (KDP 6×9 only)            | **v4.0.0** ✅ |
| No footnote/endnote handling      | Academic content needs these        | Low -- pandoc handles natively               | No                                  | **v5.3.0** ✅ |
| No hyperlink styling              | Links appear as plain text          | Low -- `w:hyperlink` + color styling         | No (different output format)        | **v4.0.0** ✅ |
| No page break control             | Long docs need explicit breaks      | Low -- `---` or `\newpage` support           | Yes (`.page-break` CSS class)       | **v5.0.0** ✅ |
| No image captions                 | Figures need numbered captions      | Medium -- detect `**Figure N:**` pattern     | No                                  | *Partial* ✅  |
| Mermaid DPI hardcoded at 96       | Higher DPI = sharper diagrams       | Low -- parameterize                          | Yes (scale 8 = 768 effective DPI)   | **v4.0.0** ✅ |
| No base64 image embedding         | External image refs can break       | Low -- encode inline                         | Yes (`imageToDataUri()`)            | **v5.2.0** ✅ |
| No combined markdown debug output | Hard to diagnose conversion issues  | Trivial                                      | Yes (`combined.md` output)          | **v4.0.0** ✅ |
| No UTF-8 BOM handling             | BOM breaks regex operations         | Trivial -- 1-line fix                        | Yes (BOM stripping)                 | **v4.0.0** ✅ |
| No LaTeX math → Unicode           | Academic symbols render as raw text | Low -- symbol mapping table                  | No (different format)               | **v4.0.0** ✅ |
| No table header row repeat        | Long tables lose header context     | Low -- `w:tblHeader` on first row            | No                                  | **v4.0.0** ✅ |
| No caption keep-with-content      | Captions orphaned from tables       | Low -- detect + keepNext                     | No                                  | **v4.0.0** ✅ |

### 6.2 Missing Features (Gamma Generator)

| Gap                           | Impact                                      |
| ----------------------------- | ------------------------------------------- |
| No visual inspection workflow | Can't verify output without manual download |
| No markdown preprocessing     | Raw markdown goes straight to API           |
| No Mermaid support            | Diagrams stripped or ignored                |

### 6.3 Missing Features (PptxGenJS CLI)

| Gap                          | Impact                          |
| ---------------------------- | ------------------------------- |
| No Mermaid-to-image pipeline | Diagrams need manual conversion |
| No table slide support       | Tables render poorly in slides  |
| Limited theme options        | Only 3 themes available         |

### 6.4 Missing Features (Replicate Image Generators)

| Gap                                | Impact                                                             | Difficulty                                    | AlexBooks Solves?                             |
| ---------------------------------- | ------------------------------------------------------------------ | --------------------------------------------- | --------------------------------------------- |
| No prompt preprocessing/validation | Malformed prompts waste API credits                                | Low -- validate before calling API            | No                                            |
| No shared prompt builder module    | Each script duplicates prompt assembly logic                       | Medium -- extract common module               | Yes (generate.js unified CLI)                 |
| No shared character definition     | `ALEX_TRAITS` defined independently in each script                 | Low -- shared config file                     | Yes (visual-memory.json subjects)             |
| No output verification/retry       | Failed or low-quality images not detected                          | Medium -- image analysis + retry              | No                                            |
| Inconsistent output handling       | Ideogram (URL download) vs nano-banana (FileObject)                | Low -- unified output handler                 | Yes (generate.js model registry)              |
| No prompt versioning               | Can't reproduce or compare prompt iterations                       | Low -- save prompt alongside output           | No                                            |
| No generation report format        | Only `banner-generation-report.json` exists; others have no report | Low -- standardize JSON report                | No                                            |
| No prompt templates library        | Each script hardcodes templates in `buildPrompt()`                 | Medium -- externalize to config               | Partially (style prefix + per-chapter config) |
| No negative prompt support         | nano-banana-pro doesn't support it, but others do                  | Low -- model-aware parameter handling         | Yes (model-aware params in generate.js)       | **v5.2.0** ✅ |
| No batch retry on rate limiting    | 429 errors crash the generator                                     | Medium -- exponential backoff loop            | No                                            |
| No visual inspection workflow      | Generated images not reviewed programmatically                     | High -- would need image quality scoring      | No                                            |
| No A/B prompt comparison           | Can't test prompt variations systematically                        | Medium -- generate N variants, visual compare | No                                            |
| No multi-media support             | Image only; no video or audio chaining                             | Medium -- model pipeline                      | Yes (generate.js image→video chain, TTS)      |
| No external prompt file support    | Long prompts must be inline in scripts                             | Low -- `--prompt-file` flag                   | Yes (generate.js `--prompt-file`)             | **v5.2.0** ✅ |

### 6.5 "Format Source First" Gaps Across All Converters

| Source Type        | Current Preprocessing                                                                                          | Missing                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Markdown (Word)    | `preprocessMarkdown()` -- lists, checkboxes, spacing, heading validation, frontmatter stripping, link checking | _(all addressed)_                                                              |
| Markdown (Gamma)   | None                                                                                                           | Slide density check, H2 break insertion, speaker notes extraction              |
| Markdown (PPTX)    | Basic `parseMarkdownToSlides()`                                                                                | Table conversion, code block handling, image extraction                        |
| Prompt (Replicate) | `buildPrompt()` per script                                                                                     | Prompt length validation, section completeness check, trait consistency audit  |
| Mermaid code       | Syntax pre-validation (regex type check)                                                                       | Deep syntax validation via mmdc, palette injection, layout direction heuristic |

## 7. Cross-Converter Feature Matrix

Shows which features exist in which converter/generator. **Bold** = implemented, *Italic* = partially. AB = AlexBooks, VT = VT_AIPOWERBI, AV = AlexVideos, FG = FishbowlGovernance, AD = AIRS_Data_Analysis.

| Feature                    | md-to-word  | gamma     | pptxgen   | replicate-gen             | AB build-pdf | AB generate.js      | VT build-pdf      | AV generators (11)        | AD build.ps1 + Python     |
| -------------------------- | ----------- | --------- | --------- | ------------------------- | ------------ | ------------------- | ----------------- | ------------------------- | ------------------------- |
| Source preprocessing       | **Yes**     | No        | *Partial* | *Per-script*              | **Yes**      | **Yes**             | **Yes** (richest) | No (prompt-only)          | **Yes** (LaTeX→MD)        |
| Config-driven generation   | **Yes**     | *Partial* | No        | **Yes**                   | **Yes**      | **Yes**             | **Yes** (presets) | *Per-script* (no config)  | **Yes** (meta.yaml)       |
| Mermaid rendering          | **Yes**     | No        | No        | No                        | **Yes** (8x) | No                  | **Yes** (SVG)     | N/A                       | **Yes** (3x, to LaTeX)    |
| SVG handling               | **Yes**     | No        | No        | No                        | No           | **Yes** (SVG model) | **Yes** (inline)  | N/A                       | No                        |
| Table formatting           | **Yes**     | *API*     | No        | N/A                       | **Yes**      | N/A                 | **Yes**           | N/A                       | **Yes** (python-docx)     |
| Font customization         | **Yes**     | *API*     | **Yes**   | N/A                       | **Yes**      | N/A                 | **Yes** (presets) | N/A                       | **Yes** (fallback chain)  |
| Image sizing               | **Yes**     | *API*     | No        | **Yes** (aspect_ratio)    | **Yes**      | **Yes**             | **Yes**           | **Yes** (per-model)       | **Yes** (includegraphics) |
| Base64 image embedding     | **Yes**     | N/A       | No        | N/A                       | **Yes**      | N/A                 | **Yes**           | **Yes** (data URI)        | No                        |
| Code block styling         | **Yes**     | No        | No        | N/A                       | **Yes**      | N/A                 | **Yes** (dark)    | N/A                       | **Yes** (snugshade)       |
| Heading colors             | **Yes**     | *API*     | **Yes**   | N/A                       | **Yes**      | N/A                 | **Yes**           | N/A                       | No (APA = plain)          |
| Checkbox conversion        | **Yes**     | No        | No        | N/A                       | No           | N/A                 | **Yes** (CSS)     | N/A                       | No                        |
| Line height control        | **Yes**     | No        | No        | N/A                       | **Yes**      | N/A                 | **Yes**           | N/A                       | **Yes** (double-spacing)  |
| Page break support         | **Yes**     | N/A       | N/A       | N/A                       | **Yes**      | N/A                 | **Yes**           | N/A                       | **Yes** (Lua filter)      |
| TOC generation             | **Yes**     | *API*     | No        | N/A                       | **Yes**      | N/A                 | **Yes**           | N/A                       | **Yes** (+ LoT + LoF)     |
| Cover page                 | **Yes**     | **Yes**   | **Yes**   | N/A                       | **Yes**      | N/A                 | **Yes**           | N/A                       | **Yes** (LaTeX titlepage) |
| Page numbers / footer      | **Yes**     | N/A       | N/A       | N/A                       | **Yes**      | N/A                 | **Yes** (header)  | N/A                       | **Yes** (running header)  |
| Callout blocks             | **Yes**     | No        | No        | N/A                       | No           | N/A                 | **Yes** (7 types) | N/A                       | No                        |
| Footnotes                  | **Yes**     | No        | No        | N/A                       | No           | N/A                 | **Yes**           | N/A                       | **Yes** (table footnotes) |
| Highlights / marks         | **Yes**     | No        | No        | N/A                       | No           | N/A                 | **Yes**           | N/A                       | No                        |
| Key term definitions       | **Yes**     | No        | No        | N/A                       | No           | N/A                 | **Yes**           | N/A                       | No                        |
| Keyboard shortcuts         | **Yes**     | No        | No        | N/A                       | No           | N/A                 | **Yes**           | N/A                       | No                        |
| Style presets              | **Yes** (4) | No        | No        | N/A                       | No           | N/A                 | **Yes** (3)       | N/A                       | No (APA-only)             |
| Recursive batch processing | **Yes**     | **Yes**   | No        | **Yes** (limit/skip/only) | No           | **Yes**             | **Yes**           | **Yes** (PS1 pipeline)    | No                        |
| Banner auto-extraction     | No          | No        | No        | N/A                       | No           | N/A                 | **Yes**           | N/A                       | No                        |
| Landscape page rotation    | **Yes**     | N/A       | N/A       | N/A                       | **Yes**      | N/A                 | No                | N/A                       | No                        |
| Drop caps / part openers   | No          | N/A       | N/A       | N/A                       | **Yes**      | N/A                 | No                | N/A                       | No                        |
| Orphan/widow control       | **Yes**     | N/A       | N/A       | N/A                       | **Yes**      | N/A                 | **Yes**           | N/A                       | **Yes** (10000 penalty)   |
| Debug output (combined.md) | **Yes**     | No        | No        | No                        | **Yes**      | No                  | No                | No                        | No                        |
| Temp cleanup               | **Yes**     | N/A       | N/A       | N/A                       | No           | N/A                 | **Yes**           | No                        | *Partial* (clean target)  |
| Dry run / preview          | **Yes**     | No        | No        | **Yes**                   | No           | **Yes**             | No                | No                        | **Yes** (validate target) |
| Generation report          | No          | No        | No        | **Yes** (JSON)            | No           | No                  | No                | No                        | No                        |
| Unified model registry     | N/A         | N/A       | N/A       | **Yes** (shared)          | N/A          | **Yes**             | N/A               | **Yes** (per-script, 90+) | N/A                       |
| visual-memory subjects     | N/A         | N/A       | N/A       | **Yes**                   | N/A          | **Yes**             | N/A               | No                        | N/A                       |
| Multi-media (image+video)  | N/A         | N/A       | N/A       | No                        | N/A          | **Yes**             | N/A               | **Yes** (11 media types)  | N/A                       |
| Cost tracking per model    | N/A         | N/A       | N/A       | **Yes** (MODEL_COSTS)     | N/A          | No                  | N/A               | **Yes** (every model)     | N/A                       |
| Image editing pipeline     | N/A         | N/A       | N/A       | No                        | N/A          | No                  | N/A               | **Yes** (12 models)       | N/A                       |
| Video editing pipeline     | N/A         | N/A       | N/A       | No                        | N/A          | No                  | N/A               | **Yes** (11 models)       | N/A                       |
| 3D model generation        | N/A         | N/A       | N/A       | No                        | N/A          | No                  | N/A               | **Yes** (6 models)        | N/A                       |
| Voice/TTS generation       | N/A         | N/A       | N/A       | No                        | N/A          | No                  | N/A               | **Yes** (16 models)       | N/A                       |
| Music generation           | N/A         | N/A       | N/A       | No                        | N/A          | No                  | N/A               | **Yes** (5 models)        | N/A                       |
| Local FFmpeg operations    | N/A         | N/A       | N/A       | No                        | N/A          | No                  | N/A               | **Yes** (free A/V merge)  | N/A                       |
| Physical production APIs   | N/A         | N/A       | N/A       | No                        | N/A          | No                  | N/A               | **Yes** (14 services)     | N/A                       |
| Duration constraints       | N/A         | N/A       | N/A       | No                        | N/A          | No                  | N/A               | **Yes** (min/max/default) | N/A                       |
| Production budget calc     | N/A         | N/A       | N/A       | No                        | N/A          | No                  | N/A               | *Manual* (in storyboard)  | N/A                       |
| Workflow documentation     | No          | No        | No        | No                        | **Yes**      | *Partial*           | No                | **Yes** (8 workflows)     | **Yes** (README)          |
| Email (.eml) output        | N/A         | No        | No        | N/A                       | No           | N/A                 | No                | No                        | No                        |
| RFC 5322 header generation | N/A         | No        | No        | N/A                       | No           | N/A                 | No                | No                        | No                        |
| Cross-doc navigation bar   | N/A         | No        | No        | N/A                       | No           | N/A                 | No                | No                        | No                        |
| Mermaid → table fallback   | N/A         | No        | No        | N/A                       | No           | N/A                 | No                | No                        | No                        |
| Watch mode (auto-rebuild)  | **Yes**     | No        | No        | No                        | No           | No                  | No                | No                        | **Yes** (FSWatcher)       |
| PDF engine fallback        | No          | No        | No        | N/A                       | No           | N/A                 | No                | N/A                       | **Yes** (lua→xe)          |
| Post-conversion formatting | **Yes**     | No        | No        | N/A                       | No           | N/A                 | No                | N/A                       | **Yes** (python-docx)     |
| LaTeX math → Unicode       | **Yes**     | No        | No        | N/A                       | No           | N/A                 | No                | N/A                       | **Yes** (50+ symbols)     |
| Dual output (PDF + Word)   | No          | No        | No        | N/A                       | No           | N/A                 | No                | N/A                       | **Yes** (XeLaTeX + docx)  |
| Lua pandoc filter          | **Yes** (3) | No        | No        | N/A                       | No           | N/A                 | No                | N/A                       | **Yes** (headings)        |
| Anti-pagination (tables)   | **Yes**     | No        | No        | N/A                       | No           | N/A                 | No                | N/A                       | **Yes** (3 controls)      |
| Alternating row shading    | **Yes**     | No        | No        | N/A                       | No           | N/A                 | No                | N/A                       | **Yes** (blue headers)    |
| Roman → Arabic pagination  | No          | No        | No        | N/A                       | No           | N/A                 | No                | N/A                       | **Yes** (front→body)      |
| Chapter-relative numbering | No          | No        | No        | N/A                       | No           | N/A                 | No                | N/A                       | **Yes** (Table 4.1)       |
| Build targets              | No          | No        | No        | No                        | No           | No                  | No                | No                        | **Yes** (6 targets)       |
| Visual verification        | Manual      | Manual    | Manual    | Manual                    | Manual       | Manual              | Manual            | Manual                    | Manual                    |

**v5.0.0 new converters** (now in Alex Master -- not in the external-project columns above):
- **md-to-eml.cjs**: Markdown → email-safe HTML with RFC 5322 headers, inline CSS, CID images, Mermaid→table fallback, YAML frontmatter
- **nav-inject.cjs**: Cross-doc navigation bar injection from `nav.json` config with sentinel-based stamping
- **md-scaffold.cjs**: 6-template markdown scaffolder (report, tutorial, reference, slides, email, adr)
- **markdown-lint.cjs**: 19-rule pre-conversion validator with `--fix` auto-repair and `--target` format filtering
- **svg-pipeline.cjs**: SVG creation (icons, diagrams, badges), validation (8 checks), PNG conversion cascade

**FishbowlGovernance-unique patterns** (harvested to Alex Master in v5.0.0):
- ~~**md-to-eml**: Manual markdown → email-safe HTML~~ → now `md-to-eml.cjs`
- ~~**Cross-doc nav bar**: 15-document navigation table~~ → now `nav-inject.cjs`
- **Banner embedding**: `Convert-Newsletter.ps1` base64 data URIs → pattern available in `data-uri.cjs`
- **Hub-and-spoke**: Document Map with audience/cadence metadata, centralized Open Items tracker, anchor links to specific sections across files

**AIRS_Data_Analysis-unique patterns** (not in feature matrix -- academic/thesis pipeline):
- **Three-stage Word pipeline**: (1) preprocess_latex_tables.py converts LaTeX tables → markdown, (2) pandoc markdown → .docx, (3) format_word_tables.py post-processes .docx for professional styling. Each stage addresses a different pandoc limitation
- **LaTeX table → markdown conversion**: Full parser with balanced brace matching, column alignment extraction, row/cell transformation, footnote capture -- handles arbitrarily complex LaTeX table environments
- **Lua pandoc filter**: Custom heading pagination + LoT/LoF injection -- reusable across any pandoc pipeline
- **APA 7th compliance**: Running headers, chapter-relative figure/table numbering, Roman→Arabic pagination, titleformat heading hierarchy, front-matter/back-matter separation
- **PDF engine fallback**: lualatex → xelatex automatic retry on failure, plus file size validation for silent failure detection
- **meta.yaml**: Thesis metadata (committee, dates, formatting) in separate YAML consumed via `--metadata-file`

## 8. External Project Improvements to Incorporate

The pattern is always the same: a project needed conversion, we ran the base converter, found issues through visual inspection, fixed them in the project's local copy, and moved on. Those fixes never flowed back. This section harvests those fixes.

### Success Criteria

After merging back all harvested improvements, running any base converter against any project's source should produce output that matches or exceeds what the project-specific fork produced -- on the first run, with no manual flags.

### 8.1 AlexBooks (`C:\Development\AlexBooks`)

AlexBooks is the most mature converter ecosystem outside AlexMaster. It publishes three books ("The Life of Alex Finch", "Dialog Engineering", "Alex in Wonderland") with PDF, ePUB, and image generation pipelines that have been battle-tested through actual KDP publishing. Nearly every feature listed below was developed through painful iteration and should be harvested.

**Pipeline Inventory**:

| Script                                            | Purpose                                           | Lines | Maturity                         |
| ------------------------------------------------- | ------------------------------------------------- | ----- | -------------------------------- |
| `scripts/build-pdf.js`                            | Config-driven PDF builder (md-to-pdf + Puppeteer) | ~1080 | Very high -- published books     |
| `scripts/build-epub.js`                           | Config-driven ePUB builder (pandoc)               | ~120  | High -- published books          |
| `scripts/generate.js`                             | Unified image/video/audio CLI (Replicate)         | ~300  | High -- multi-model, multi-media |
| `scripts/biography/gen-cover-options.js`          | Batch cover concept generation                    | ~200  | High                             |
| `scripts/dialog-engineering/gen-cover-options.js` | Cover generation with face refs + visual memory   | ~200  | High                             |
| `scripts/dialog-engineering/composite-cover.js`   | SVG typography overlay via sharp                  | ~150  | High                             |
| `scripts/wonderland/gen-chapter-illustrations.js` | Per-chapter illustration generation               | ~250  | High                             |
| `scripts/diagrams/render.js`                      | Batch Mermaid .mmd to SVG/PNG                     | ~25   | Simple but useful                |

#### 8.1.1 PDF Pipeline (`build-pdf.js`) -- Harvestable Features

**Config-Driven Architecture (`book.json`)**:

The entire pipeline is driven by a declarative `book.json` in each book directory. This is the `.converter.json` pattern proposed in Phase 3 -- already built and proven.

```json
{
  "id": "dialog-engineering",
  "title": "Dialog Engineering",
  "subtitle": "The Cognitive Science of Human-AI Partnership",
  "author": "Fabio Correa",
  "chapters": {
    "pdf": ["00-cover.md", "00-copyright.md", ...],
    "epub": ["00-cover.md", ...]
  },
  "pdf": {
    "fontSize": "14pt",
    "h1Size": "26pt",
    "h2Size": "18pt",
    "lineHeight": "1.4",
    "fonts": { "body": "Palatino Linotype", "heading": "Palatino Linotype", "mono": "Consolas" }
  },
  "features": { "mermaid": true, "toc": true }
}
```

What this unlocks: different books (or documents) can have completely different typography, chapter ordering, and feature flags -- with zero code changes. The biography uses 10pt body text; Dialog Engineering uses 14pt. The fiction book has no TOC; the nonfiction book does.

**Mermaid at Scale 8** (vs AlexMaster's Scale 1):

AlexBooks renders Mermaid diagrams at `--scale 8` -- an 8x DPI improvement. The base md-to-word.cjs uses no explicit scale (defaults to ~1x). This single change dramatically improves diagram sharpness in print output:

```javascript
// AlexBooks: scale 8 with white background
execSync(`npx -y @mermaid-js/mermaid-cli -i "${tempMmdFile}" -o "${tempPngFile}" -b white --scale 8`, ...);
```

Additionally, rendered diagrams are base64-encoded inline rather than linked, preventing broken image references.

**Table of Contents Generation**:

TOC is auto-generated from H1 headings with semantic classification:

| Heading Pattern                 | TOC Class       | Rendering                                   |
| ------------------------------- | --------------- | ------------------------------------------- |
| `# Part N:`                     | `.toc-part`     | Small-caps, bold, top border                |
| `# Chapter N:` or `# N.`        | `.toc-chapter`  | Indented, standard weight                   |
| `# Appendix N:` or `# A.`       | `.toc-appendix` | Slight indent, smaller, top border on first |
| Other H1s (Preface, Dedication) | `.toc-front`    | Italic, muted color                         |

The TOC is inserted after the first page break (after cover/copyright) automatically.

**Nonfiction Typography System**:

| Feature             | CSS Technique                                                         | Why It Matters                                     |
| ------------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| Drop caps           | `h1 + p::first-letter` at 3.2em, float left                           | Professional chapter openers                       |
| Small-caps headings | `font-variant: small-caps` on H1/H2                                   | Classical typographic elegance                     |
| Decorative rules    | `h1 + p::before` with em-dash content                                 | Separates heading from body                        |
| Part openers        | Full-page `.part-opener` with `::before`/`::after` decorative borders | Ceremonial section dividers                        |
| Half-title page     | Flex-centered smaller title at 2.5in padding-top                      | Professional book front matter                     |
| Ornamental dinkus   | `◆ ◆ ◆` replacing `---` lines                                         | Elegant section breaks instead of horizontal rules |
| Orphans/widows      | `orphans:3; widows:3`                                                 | Prevents lonely lines at page breaks               |
| Pagination rules    | `h2 + p { page-break-before: avoid }`                                 | Headings never stranded without content            |

**Landscape Page Rotation**:

Wide tables get special treatment -- markdown between `<!-- landscape -->` and `<!-- /landscape -->` is pre-rendered to HTML and wrapped in a 90° rotated div:

```css
.landscape-page { page-break-before: always; page-break-after: always; min-height: 6in; }
.landscape-inner { transform: rotate(90deg); transform-origin: center center; width: 8in; }
```

This handles the common problem of wide comparison tables that don't fit portrait orientation -- solved once, applicable to all nonfiction documents.

**KDP Print-on-Demand Specifics** (generalizable beyond KDP):

| Feature                | Value                                                            | Why                                       |
| ---------------------- | ---------------------------------------------------------------- | ----------------------------------------- |
| 6"×9" page size        | `@page { size: 6in 9in }`                                        | Standard trade paperback                  |
| Mirrored margins       | `:left` 0.5/0.75in, `:right` 0.75/0.5in                          | Binding side gets more space              |
| +12% brightness        | `sharp.modulate({ brightness: 1.12 })`                           | CMYK print darkens images                 |
| Configurable PDF scale | `config.pdf?.scale \|\| 0.75`                                    | Different books need different scaling    |
| Footer page numbers    | Puppeteer `displayHeaderFooter` with `<span class="pageNumber">` | Page numbering without manual inserts     |
| UTF-8 BOM stripping    | `content.replace(/^\uFEFF/, '')`                                 | Prevents regex failures in TOC generation |

**Image Embedding**:

Both markdown `![](path)` and HTML `<img src="path">` references are resolved relative to the chapters directory and converted to base64 data URIs -- no external file dependencies in the final output. This prevents the #1 cause of broken images in document converters.

**Combined Markdown Debug Output**:

Every build writes a `combined.md` file to the output directory. When the PDF looks wrong, you inspect the combined markdown first (the "format source first" principle in action). This is a trivial but high-value feature missing from md-to-word.

#### 8.1.2 ePUB Pipeline (`build-epub.js`) -- Harvestable Features

| Feature                             | Description                                                                   | Generalizability                |
| ----------------------------------- | ----------------------------------------------------------------------------- | ------------------------------- |
| Mermaid at scale 2 (transparent bg) | Lower DPI than PDF because ePUB readers resize                                | Format-specific optimization    |
| Page-break div protection           | Protects `<div style="page-break...">` with placeholder during HTML stripping | Universal for any markdown-to-X |
| HTML cleanup pipeline               | Strip `<style>`, `<center>`, normalize `<br>`                                 | Any converter that strips HTML  |
| Separate chapter lists              | PDF and ePUB can have different orderings                                     | Config-driven flexibility       |

#### 8.1.3 Unified Generation CLI (`generate.js`) -- Harvestable Features

This is the most advanced image generation CLI across all Alex projects. It consolidates what AlexMaster does in 7 separate scripts into one.

**Unified Model Registry**:

```javascript
const MODELS = {
  "nano-banana-pro": { type: "image", name: "google/nano-banana-pro", refsParam: "image_input", maxRefs: 14, cost: 0.025 },
  "flux-2-pro":      { type: "image", name: "black-forest-labs/flux-2-pro", refsParam: "input_images", maxRefs: 8, cost: 0.045 },
  "ideogram-v2":     { type: "image", name: "ideogram-ai/ideogram-v2", refsParam: null, maxRefs: 0, cost: 0.08 },
  "recraft-v4-svg":  { type: "image", name: "recraft-ai/recraft-v4-pro-svg", refsParam: null, maxRefs: 0, cost: 0.30 },
  "veo-3":           { type: "video", name: "google/veo-3", cost: 0.50 },
  "grok-video":      { type: "video", name: "xai/grok-imagine-video", cost: "~0.05/sec" },
  "kling-v3":        { type: "video", name: "kwaivgi/kling-v3-video", cost: "~0.22/sec" },
  "speech-turbo":    { type: "audio", ... },
  "chatterbox-turbo": { type: "audio", ... },
  "qwen-tts":        { type: "audio", ... },
};
```

Key design decisions worth harvesting:
- **One CLI, multiple media types** -- `--model` flag determines image/video/audio routing
- **Cost-per-model** -- visible in the config, enabling budget awareness
- **Model-aware parameter routing** -- each model gets only the parameters it supports
- **Video chaining** -- generate an image, then optionally feed it to a video model with `--video`

**visual-memory.json Subject System**:

Instead of hardcoding `ALEX_TRAITS` per-script, AlexBooks uses a structured `visual-memory.json` file with named subjects:

```json
{
  "subjects": {
    "fabio": { "description": "Male, mid-50s, ...", "images": [{ "dataUri": "data:image/png;base64,..." }] },
    "alex":  { "description": "Female, 16 baseline, ...", "images": [{ "dataUri": "data:image/png;base64,..." }] },
    "jolly": { "description": "Cream-colored curly poodle mix", "images": [...] }
  }
}
```

This is the centralized character definition system that §6.4 identified as missing. It handles multi-subject scenes (`--subjects fabio,alex`) and supports any number of subjects with any number of reference images each.

**External Prompt Files**: `--prompt-file` loads prompts from a file instead of inline -- critical for long, carefully crafted prompts that should be version-controlled.

#### 8.1.4 Cover Generation Pipeline -- Harvestable Features

| Feature                        | Script                           | Description                                                          |
| ------------------------------ | -------------------------------- | -------------------------------------------------------------------- |
| Multi-concept batch generation | `gen-cover-options.js`           | Generate 5 front + 5 back + 5 spine concepts in one run              |
| Model-per-element selection    | biography `gen-cover-options.js` | nano-banana for faces, ideogram for typography (spines)              |
| Visual memory integration      | DE `gen-cover-options.js`        | `loadVisualMemory()` + `getSubjectRefs()` for face-consistent covers |
| SVG typography overlay         | `composite-cover.js`             | Generate image art, then composite text as SVG via sharp             |
| KDP bleed-aware dimensions     | `composite-cover.js`             | 1875×2775 @ 300 DPI (6.25"×9.25" with 0.125" bleed)                  |
| Typography separation          | All cover scripts                | Art and text generated independently, composited at end              |

The cover pipeline's key insight: **generate art without text, overlay text via SVG compositing**. This avoids the #1 failure of AI-generated covers (garbled typography) by never asking the image model to render text at all. The text is pixel-perfect via SVG, the art is beautiful via image models.

#### 8.1.5 Chapter Illustration Pipeline (Wonderland) -- Harvestable Features

| Feature                  | Description                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| Style prefix constant    | `STYLE_PREFIX` applied to all prompts -- consistent visual language       |
| Scene-only prompts       | Character appearance from refs, prompts describe ONLY the scene           |
| Per-chapter config array | `{ id, file, title, prompt }` for every chapter -- declarative, auditable |
| Resume on failure        | `--start N` flag to restart from a specific chapter                       |
| Multi-model switching    | `--model` flag to test nano-banana vs flux without editing code           |

#### 8.1.6 Documentation Worth Harvesting

AlexBooks has three codified guideline documents that encode hard-won iteration lessons:

| Document                     | Key Insights                                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `IMAGE-GENERATION.md`        | Complete CLI reference with model comparison matrix, per-model strengths/costs, and video chaining workflow                                                                    |
| `ILLUSTRATION-GUIDELINES.md` | Codified illustration placement rules (contextual placement, visual variety, narrative function), current state audit of all book assets, chapter-by-chapter illustration plan |
| `BOOKS-BRANDING.md`          | Publisher identity hierarchy, per-book palette authority, shared asset standards, KDP metadata, A+ content design system, cross-promotion module specs                         |

These documents turn tribal knowledge into reusable standards. AlexMaster has no equivalent for image generation guidelines.

#### 8.1.7 Feature Harvest Summary -- What to Merge Back

**Immediately generalizable (no project-specific dependencies)**:

| Feature                           | Source Script                     | Target in AlexMaster                  | Priority                        |
| --------------------------------- | --------------------------------- | ------------------------------------- | ------------------------------- |
| Mermaid scale 8                   | build-pdf.js                      | md-to-word.cjs                        | High -- 1-line change           |
| Base64 image embedding            | build-pdf.js                      | md-to-word.cjs                        | High -- prevents broken images  |
| Combined markdown debug output    | build-pdf.js                      | md-to-word.cjs                        | High -- trivial to add          |
| UTF-8 BOM stripping               | build-pdf.js                      | md-to-word.cjs `preprocessMarkdown()` | High -- 1-line fix              |
| Unified model registry            | generate.js                       | New shared module                     | High -- eliminates 7 scripts    |
| visual-memory.json subject system | generate.js                       | Replace per-script ALEX_TRAITS        | High -- single source of truth  |
| SVG + art compositing pattern     | composite-cover.js                | New skill/instruction                 | Medium -- pattern, not code     |
| Scene-only prompt pattern         | gen-chapter-illustrations.js      | Document in prompt-engineering skill  | Medium -- prompt design pattern |
| +12% brightness for print         | composite-cover.js / build-pdf.js | Document as KDP/POD default           | Medium -- domain knowledge      |

**Adaptable with work (needs configuration layer)**:

| Feature                               | Source Script        | What Needs Changing                                                   |
| ------------------------------------- | -------------------- | --------------------------------------------------------------------- |
| book.json config schema               | build-pdf.js         | Generalize to `.converter.json` for any document type                 |
| Fiction/nonfiction CSS variants       | build-pdf.js         | Generalize to style presets (academic, business, fiction, nonfiction) |
| TOC generation from H1 headings       | build-pdf.js         | Port algorithm, parameterize TOC position and style                   |
| Drop caps / part openers / half-title | build-pdf.js         | Extract as CSS snippet library for page-based converters              |
| Landscape page rotation               | build-pdf.js         | Port `<!-- landscape -->` comment syntax + CSS                        |
| Page-break div protection             | build-epub.js        | Add to shared `preprocessMarkdown()`                                  |
| Cover generation workflow             | gen-cover-options.js | Shape as reusable prompt template + compositing pattern               |

**Document only (project-specific but pattern is reusable)**:

| Feature                                                                           | Where to Document                           |
| --------------------------------------------------------------------------------- | ------------------------------------------- |
| Model-per-element selection (face model for portraits, typography model for text) | image-handling instruction                  |
| KDP bleed dimensions and CMYK brightness compensation                             | New KDP/POD instruction or skill            |
| Illustration placement principles (contextual, varied, narrative function)        | image-handling or visual-memory instruction |
| Per-book palette authority within publisher brand hierarchy                       | brand-asset-management instruction          |

### 8.2 VT_AIPOWERBI (`C:\Development\VT_AIPOWERBI`)

VT_AIPOWERBI generates course materials for a Virginia Tech MBA course. It has a single converter -- `tools/build-pdf.js` (~1300 lines) -- but it's surprisingly feature-rich, solving several problems that neither AlexMaster nor AlexBooks address.

**Pipeline Inventory**:

| Script               | Purpose                                                   | Lines | Maturity                                  |
| -------------------- | --------------------------------------------------------- | ----- | ----------------------------------------- |
| `tools/build-pdf.js` | Style-preset-driven PDF generator (md-to-pdf + Puppeteer) | ~1300 | High -- actively used for course delivery |
| `deploy.ps1`         | Azure SWA deployment with batch PDF generation            | ~150  | High                                      |

#### 8.2.1 Novel Features (Not in AlexMaster or AlexBooks)

**Style Presets System**:

Three named style presets with full parameterization -- the practical implementation of "style presets" proposed in Phase 3:

```javascript
const STYLES = {
  academic:     { fontFamily: "Georgia, serif",    fontSize: "11pt", margins: "1in",    headerColor: "#0078D4" },
  course:       { fontFamily: "Segoe UI, sans",    fontSize: "11pt", margins: "0.85in", headerColor: "#0078D4" },
  professional: { fontFamily: "Segoe UI, sans",    fontSize: "10.5pt", margins: "0.7in", headerColor: "#0078D4" },
};
```

Each preset defines: page size, font sizes (body/h1/h2/h3/h4), line height, table-specific line height and font size, font families (body/mono), margins, header/accent colors, and header/footer enablement. The entire CSS is parameterized from these values.

**Extended Markdown Transforms (`applyMarkdownTransforms()`)**:

This is the most comprehensive markdown preprocessor across all Alex projects:

| Transform            | Syntax                                     | Rendering                                                                       |
| -------------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| Callout blocks       | `::: tip Custom Title` ... `:::`           | Colored callout box with icon (tip/note/warning/example/info/caution/important) |
| Legacy callouts      | `> **Tip:** text`                          | Same colored callout from blockquote syntax                                     |
| Footnotes            | `[^1]` reference + `[^1]: text` definition | Superscript links + bottom footnote section with back-links                     |
| Highlights           | `==text==`                                 | Yellow `<mark>` highlight                                                       |
| Key term definitions | `**Term**:: Definition`                    | Styled definition block with left accent border                                 |
| Keyboard shortcuts   | `[[Ctrl+S]]`                               | Styled `<kbd>` elements joined with `+`                                         |
| Strikethrough        | `~~text~~`                                 | Gray `<del>` element                                                            |
| Subscript            | `~text~`                                   | `<sub>` (disambiguated from strikethrough)                                      |
| Superscript          | `^text^`                                   | `<sup>`                                                                         |
| Task lists           | `- [x]` / `- [ ]`                          | CSS checkbox with checked state styling                                         |
| Page breaks          | `<!-- pagebreak -->`                       | `page-break-after: always` div                                                  |
| Section breaks       | `---`                                      | Ornamental dinkus (◆ ◆ ◆)                                                       |

These transforms run BEFORE the markdown engine -- the "format source first" principle at its most complete. AlexMaster's md-to-word.cjs only handles checkboxes and list spacing. AlexBooks' build-pdf.js only handles section breaks and part openers.

**Mermaid as Inline SVG (Vector)**:

VT renders Mermaid at `--scale 3` but keeps the output as **inline SVG** rather than converting to PNG:

```javascript
let svgContent = readFileSync(tmpSvg, 'utf-8').replace(/<\?xml[^>]*\?>/, '').trim();
const html = `<div class="diagram">${svgContent}</div>`;
```

This is arguably superior to AlexBooks' scale-8 PNG approach because SVGs scale to any resolution without pixelation. The trade-off: SVG may render inconsistently across different PDF viewers, while PNG is pixel-perfect.

**Cover Page with Institution Branding**:

Auto-generates a branded cover page from document metadata:

| Element             | Source                                                  |
| ------------------- | ------------------------------------------------------- |
| Institution line    | Hardcoded "Virginia Tech · Pamplin College of Business" |
| Title               | Extracted from first H1                                 |
| Subtitle            | Extracted from first H2                                 |
| Course info         | Hardcoded                                               |
| Date                | Auto-generated                                          |
| Gradient decoration | Linear gradient bar at top                              |

The pattern is generalizable: extract title/subtitle from markdown, combine with configurable institution/branding, generate a styled cover page without any special markdown syntax.

**Banner Image Auto-Extraction**:

If the first image in a markdown file appears within the first 200 characters, it's automatically extracted and rendered as a full-width banner above the title. This handles the common pattern of `![Banner](assets/banner.png)` at the top of course materials.

**Header/Footer with Document Context**:

Unlike AlexBooks (which only has a page number), VT generates context-aware headers and footers:

- **Header**: Document title, centered, with subtle underline border
- **Footer**: Institution + course code (left), page number (right)

Both use the style preset's font family and header color, creating a cohesive branded output.

**Recursive Directory Processing**:

`--recursive` flag processes all `.md` files in a directory tree. The `deploy.ps1` script uses this to batch-generate dozens of PDFs (cases, labs, syllabus, references) in a single deployment run, with exclusion lists for internal-only files.

**Dark Code Blocks**:

```css
pre { background-color: #1e293b; color: #e2e8f0; border-radius: 6px; }
```

AlexBooks uses default light code blocks. VT uses a VS Code-like dark theme for code blocks -- more readable for technical content with syntax examples.

**Proper Temp Directory Cleanup**:

Creates a unique temp directory per conversion run, cleans up in a `finally` block via `rmSync`. Neither AlexMaster nor AlexBooks clean up temp files.

#### 8.2.2 Feature Harvest Summary

**Immediately generalizable**:

| Feature                                                                          | Generalizability                                     | Priority       |
| -------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------- |
| Style presets (academic/course/professional)                                     | High -- any document converter needs presets         | High           |
| Extended markdown transforms (callouts, footnotes, highlights, kbd, definitions) | High -- these are universal markdown extensions      | High           |
| Mermaid as inline SVG                                                            | High -- alternative to PNG that scales perfectly     | Medium         |
| Cover page generation from H1/H2 metadata                                        | High -- any document needs this                      | Medium         |
| Banner image auto-extraction                                                     | Medium -- specific to course/report materials        | Low            |
| Header/footer with document title + branding                                     | High -- professional documents need this             | Medium         |
| Recursive directory batch processing                                             | High -- every project has multi-file needs           | **v5.2.0** ✅   |
| Dark code blocks                                                                 | Medium -- preference, could be a style preset option | Low            |
| Temp directory cleanup                                                           | High -- prevents disk bloat                          | High (hygiene) |

**Not generalizable (project-specific)**:

| Feature                             | Why                                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| Virginia Tech/BIT 5424 branding     | Hardcoded institution -- but the cover page PATTERN is generalizable                    |
| `deploy.ps1` Azure SWA flow         | Project-specific deployment, though the batch PDF → deploy pattern is reusable          |
| File exclusion list in `deploy.ps1` | Project-specific, but the pattern of `$excludeFiles` for internal docs is good practice |

### 8.3 AlexVideos (`C:\Development\AlexVideos`)

The Replicate-heavy media production project. Massively expands the model registry compared to all other projects combined, introduces novel media types (3D, emoji, stickers, t-shirts, video editing), and demonstrates an end-to-end animated production pipeline from concept → storyboard → frame generation → video → voice → music → final assembly.

**Project**: `C:\Development\AlexVideos` -- 11 generator scripts, 8 project folders, comprehensive workflow documentation.

#### 8.3.1 Scale of Model Coverage

AlexVideos has **90+ Replicate models** across 11 media categories vs. AlexBooks (10 models) and AlexMaster (5 scripts with ~5 models each):

| Category         | Script                      | Models         | Key Providers                                                                                                                                                          |
| ---------------- | --------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Image generation | `generate-image.js`         | 15             | Google (Imagen 4 family), OpenAI (GPT Image 1.5), BFL (Flux 2), ByteDance (Seedream), xAI (Grok), Ideogram v3, Recraft v4, MiniMax, Luma                               |
| Video generation | `generate-video.js`         | 17             | Google (Veo 3.1), OpenAI (Sora-2), xAI (Grok), Runway (Gen-4.5), Kuaishou (Kling v3/2.6/Omni), ByteDance (Seedance), PixVerse, Hailuo, Luma (Ray 2), WAN               |
| Voice/TTS        | `generate-voice.js`         | 16             | MiniMax Speech (6 variants + cloning), Resemble AI (Chatterbox family), Qwen3 TTS, ElevenLabs v3/turbo, Kokoro                                                         |
| Music            | `generate-music.js`         | 5              | MiniMax Music 1.5/01, Stable Audio 2.5, ElevenLabs Music, Google Lyria 2                                                                                               |
| Image editing    | `generate-edit-image.js`    | 12             | BFL (Kontext Pro/Max, Fill Pro, Restore), Bria (Eraser, GenFill, Expand, BG Gen, RemBG), Google (Nano Banana), P-Image-Edit, Real-ESRGAN                               |
| Video editing    | `generate-edit-video.js`    | 11             | Luma (Modify, Reframe), Trim, Merge, A/V merge (local FFmpeg), Audio mixer (local FFmpeg), Extract Audio, Frame Extractor, Real-ESRGAN Video, AutoCaption, Video Utils |
| 3D generation    | `generate-3d.js`            | 6              | TRELLIS, Rodin Gen-2, Hunyuan3D-2, Hunyuan3D-2mv, MVDream, Shap-E                                                                                                      |
| 3D printing      | `generate-3d-print.js`      | 0 (6 services) | Shapeways, Sculpteo/BASF, Materialise, PCBWay, Xometry, Craftcloud                                                                                                     |
| Emoji            | `generate-emoji.js`         | 4              | SDXL Emoji, Platmoji, Flux ICO, Kontext Emoji Maker                                                                                                                    |
| Sticker printing | `generate-sticker-print.js` | 0 (6 services) | Printify, Printful, StickerMule, StickerApp, StickerGiant, Redbubble                                                                                                   |
| T-shirt printing | `generate-tshirt.js`        | 0 (2 services) | Printify, Printful                                                                                                                                                     |

#### 8.3.2 Architectural Patterns Worth Harvesting

**Per-Model `buildInput()` Pattern**: Every model has a `buildInput(prompt, ...args, opts)` function that handles model-specific parameter mapping. This is the same pattern as AlexBooks' `generate.js` but executed at dramatically larger scale with richer metadata per model:

```javascript
// Each model carries structured metadata
{
  id: "replicate-model-owner/name",
  name: "Human Name",
  cost: "$0.04",          // ← Budget awareness
  supportsImage: true,    // ← Capability flags
  supportsCount: true,    // ← Batch generation
  maxCount: 9,            // ← Model-specific limits
  outputArray: true,      // ← Output shape (single URI vs array)
  hasAudio: true,         // ← Video: audio track included?
  minDuration: 4,         // ← Video: duration constraints
  maxDuration: 30,
  defaultDuration: 10,
  durationNote: "only 4s, 6s, or 8s",  // ← Human-readable constraints
  buildInput: (prompt, imageUri, opts) => { ... }
}
```

**Model Timing Rules**: Video models have strict duration constraints (e.g. hailuo23 accepts ONLY 6s or 10s; veo3fast accepts ONLY 4s, 6s, or 8s). The storyboard documents these as "Model Timing Rules" and shots are planned around them. This constraint metadata is in the model definition but not enforced programmatically -- harvestable as a validation layer.

**Cost Tracking Per Model**: Every model has a `cost` field. The storyboard includes a production budget table calculating total cost per model x shots x seconds. This enables budget-aware model selection -- not present in any other Alex project.

**Local FFmpeg Integration**: `generate-edit-video.js` has `avmerge` and `audiomix` models marked `local: true` that run via `ffmpeg-static` without a Replicate API call. This hybrid local/cloud pattern is unique to AlexVideos.

**Multi-View Input**: `generate-3d.js` has `hunyuan2mv` accepting `--front`, `--back`, `--left`, `--right` images for 4-view → 3D conversion. This multi-input pattern isn't seen elsewhere.

**Format Conversion Pipeline**: `generate-3d.js` uses `@gltf-transform/core` to convert between GLB/OBJ/STL/FBX formats, with native format flags per model (`nativeStl`, `nativeObj`, `nativeFbx`). Cross-format conversion after generation is a reusable pattern.

**Service Registry Pattern**: `generate-3d-print.js`, `generate-sticker-print.js`, and `generate-tshirt.js` use a `SERVICES` registry (not `MODELS`) with `type: "api"` vs `type: "browser"` routing. API services get programmatic upload + pricing; browser services get URL handoff. This pattern bridges AI generation → physical production.

#### 8.3.3 Voice Generator Complexity

The voice generator has the most complex option set (~30+ CLI flags) across all Alex projects:

- **MiniMax Speech**: 6 variants (2.8/02/2.6 × turbo/hd), voice cloning, emotion control, pitch/volume, bitrate/channel/samplerate, subtitle generation, volume normalization
- **Chatterbox**: 4 variants, cfg_weight, top_k, top_p, repetition_penalty, exaggeration, temperature
- **ElevenLabs**: v3/turbo, stability/similarity controls, style, previous/next text context, voice description
- **Kokoro**: speed, voice selection
- **Shared helpers**: `buildMiniMaxSpeech()`, `buildElevenLabsTTS()`, `audioToDataUri()`

The `audioToDataUri()` helper is **duplicated** between `generate-voice.js` and `generate-music.js` -- a shared-module opportunity.

#### 8.3.4 Image Editing Pipeline

12 models covering the full image lifecycle after generation:

| Operation          | Model           | Cost     | Use Case                           |
| ------------------ | --------------- | -------- | ---------------------------------- |
| General edit       | Nano Banana     | $0.039   | Multi-purpose prompt-based editing |
| Fast edit          | P-Image-Edit    | $0.01    | Sub-1-second cheap edits           |
| Style transfer     | Kontext Pro/Max | $0.04+   | Text-based object/style changes    |
| Inpainting         | FLUX Fill Pro   | $0.05    | Mask-based region editing          |
| Object removal     | Bria Eraser     | $0.04    | SOTA object removal with mask      |
| Generative fill    | Bria GenFill    | variable | Add objects via mask + prompt      |
| Outpainting        | Bria Expand     | $0.04    | Extend image beyond borders        |
| Background swap    | Bria BG Gen     | $0.04    | Replace background via prompt      |
| Photo restore      | FLUX Restore    | variable | Fix scratches, colorize old photos |
| Background removal | Bria RemBG      | variable | Transparent output                 |
| Upscaling          | Real-ESRGAN     | variable | 2x--10x upscale with face enhance  |

This is a **complete post-processing pipeline** that none of the AlexMaster generators currently support. Generated images could be automatically piped through background removal, upscaling, or style transfer.

#### 8.3.5 End-to-End Animated Production Pipeline

The `projects/alex-breakfast/` directory demonstrates a full animated episode pipeline:

1. **Concept** (`concept.md`) -- series bible with characters, world, visual style, tone
2. **Storyboard** (`storyboard-ep00.md`) -- 26 shots with per-shot model selection, duration, prompt, production budget
3. **Frame generation** (`generate-all-shots.ps1` Pass 1) -- unique first-frame images via `generate-image.js --model ideoturbo`
4. **Video generation** (Pass 2) -- per-shot video from custom frames via `generate-video.js` with model-appropriate flags
5. **Audio** -- voice narration via `generate-voice.js --model elevenv3`, music via `generate-music.js --model music15`
6. **Assembly** -- FFmpeg concat, A/V merge, audio mixing, optional captions

This is the most sophisticated multi-script orchestration in any Alex project. The 2-pass strategy (generate frame → use frame as first-frame for video) solves the character consistency problem that `--image` creates when using a single reference.

#### 8.3.6 Workflow Documentation

`docs/workflows/` contains 8 comprehensive workflow guides:

| Workflow                               | Scope                                                            |
| -------------------------------------- | ---------------------------------------------------------------- |
| `image-creation-workflow.md`           | Concept → generate → edit → enhance → deliver                    |
| `video-production-workflow.md`         | Script → reference → AI video → edit → audio → deliver → publish |
| `audio-production-workflow.md`         | Voice + music + SFX pipeline                                     |
| `emoji-sticker-workflow.md`            | Emoji generation → physical sticker ordering                     |
| `3d-design-to-print-workflow.md`       | 3D model generation → format conversion → printing service       |
| `3d-printing-services-guide.md`        | Service comparison, pricing, material selection                  |
| `sticker-print-production-workflow.md` | Design → order → fulfillment                                     |
| `video-series-compilation-workflow.md` | Multi-episode management                                         |

These are **pipeline documentation** -- they describe how to chain multiple generators together for complete workflows. AlexMaster has no equivalent cross-script workflow documentation.

`docs/scripts/` contains per-script reference documentation (10 files) mirroring the JSDoc headers.

#### 8.3.7 Code Duplication Across Scripts

**Duplicated across all 11 scripts**:
- `imageToDataUri()` / `audioToDataUri()` / `videoToDataUri()` -- same logic, different mime type maps
- `downloadFile()` HTTP/HTTPS download handler
- `parseArgs()` CLI argument parser (similar structure, different options per script)
- `showHelp()` reads JSDoc header from `__filename`
- `require("dotenv").config()` + `new Replicate(...)` initialization
- HTTP request helpers (`httpRequest()`, `formUpload()`)

This is the strongest case for a **shared module** (`@alexmedia/core` or similar) that provides:
- Data URI encoding (image, audio, video with MIME detection)
- Replicate client initialization with error handling
- Download with progress display
- CLI argument parsing base
- Model registry validation

#### 8.3.8 Feature Harvest Summary

**Immediately generalizable to AlexMaster**:

| Feature                                               | Generalizability                                           | Priority     |
| ----------------------------------------------------- | ---------------------------------------------------------- | ------------ |
| 90+ model registry with structured metadata           | High -- replaces AlexMaster's 5 scripts (25 models)        | Critical     |
| Cost-per-model tracking                               | High -- budget awareness for any Replicate usage           | High         |
| Image editing pipeline (12 models)                    | High -- post-processing applicable to any generated image  | High         |
| `audioToDataUri()` / `imageToDataUri()` shared helper | High -- used across all scripts                            | High (dedup) |
| Video duration constraint metadata                    | High -- prevents failed generations from invalid durations | Medium       |
| Local FFmpeg hybrid pattern                           | High -- free local operations before expensive cloud calls | Medium       |
| 3D format conversion via @gltf-transform              | Medium -- niche but complete when needed                   | Low          |
| Service registry pattern (API + browser handoff)      | Medium -- bridges digital → physical production            | Low          |
| Production budget calculation pattern                 | High -- enables cost planning before generation            | Medium       |
| 2-pass frame→video strategy for character consistency | High -- solves the `--image` first-frame problem           | High         |
| Voice emotion/style controls (~30 parameters)         | Medium -- complex but powerful for TTS                     | Medium       |
| Pipeline workflow documentation pattern               | High -- no equivalent exists in AlexMaster                 | High         |

**Novel capabilities not in any other Alex project**:

| Capability                                                  | Impact                      |
| ----------------------------------------------------------- | --------------------------- |
| 3D model generation (6 models)                              | New media type              |
| Video editing (11 models including local FFmpeg)            | Post-production pipeline    |
| Image editing (12 models)                                   | Post-generation enhancement |
| Music generation (5 models) with reference files            | Audio content creation      |
| Emoji generation (4 models)                                 | Specialized image format    |
| Physical production services (3D print, stickers, t-shirts) | Digital-to-physical bridge  |
| Multi-episode production orchestration (PowerShell)         | Complex workflow automation |

### 8.4 FishbowlGovernance (`C:\Development\FishbowlGovernance`)

A 152-file governance documentation project for Microsoft Fabric. Two novel converter patterns: **markdown → email (.eml)** with RFC 5322 headers, and **persistent navigation bars** across a 15-document interlinked suite.

**Project**: `C:\Development\FishbowlGovernance` -- 152 markdown files, ~50,000 lines, ~2,000 estimated pages, 16 cheatsheets, 6 presentation decks.

#### 8.4.1 Markdown → Email (.eml) Conversion

The `weekly/` directory contains a complete markdown-to-email pipeline:

```
2026-03-11-smart-sampling.md          ← Source (markdown with Mermaid, tables, status emojis)
2026-03-11-smart-sampling.eml         ← Production email (RFC 5322 headers, full DL)
2026-03-11-smart-sampling-TEST.eml    ← Test email (To: Fabio only)
2026-03-11-smart-sampling-embedded.html ← Standalone HTML (for browser preview)
```

**The conversion is currently manual** -- the `.eml` file is hand-crafted HTML, not generated from the `.md` source. This means:

1. The markdown source uses standard markdown features (tables, Mermaid gantt, `**bold**`, lists)
2. The `.eml` version rewrites everything as email-safe HTML:
   - Table-based layout (`<table class="wrapper">`, nested `<table class="container">`)
   - All styles inline or in `<style>` block (no external CSS)
   - Mermaid charts replaced with static timeline tables (email clients don't render Mermaid)
   - Emoji status indicators preserved (✅ 🟢 🟡 🔴 work in most email clients)
   - Color-coded status cards using inline `background:` + `border:` CSS
   - GitHub links for interactive content (Gantt chart → "View in Roadmap")

**RFC 5322 email headers in the `.eml`**:

```
MIME-Version: 1.0
From: "Fabio Correa" <fabioc@microsoft.com>
To: "Nicole McKinley" <nidetu@microsoft.com>,
    "CE&S Global Customer Experience LT" <gcxlt@microsoft.com>,
    "Jim Travis" <jimt@microsoft.com>
Cc: "Daniel Guzman" <guzmandaniel@microsoft.com>, ...
Subject: Smart Sampling Weekly - Mar 11 | Alpha Test Scoped, Phase 1 Gate in 16 Days
Content-Type: text/html; charset=UTF-8
```

**`Convert-Newsletter.ps1` handles one step**: banner image embedding as base64 data URI. It reads the `.eml` and `-embedded.html` files, replaces `src="banner-option-1.png"` or the GitHub raw URL with `data:image/png;base64,...`, and also generates the `-TEST.eml` variant with `To: Fabio` only.

**What's missing** (and would be a converter): An automated `md-to-eml.js` that reads the `.md` and generates the `.eml` + `.html` + `-TEST.eml` automatically, handling:
- RFC 5322 header generation from frontmatter (To, Cc, Subject)
- Markdown → email-safe HTML conversion (table layout, inline styles)
- Mermaid → static table fallback
- Banner embedding as base64
- TEST variant generation (override To: with test address)
- Emoji preservation in HTML entities

#### 8.4.2 Cross-Document Navigation Bar

Every document in `docs/smart-sampling/` (15 files) carries an identical navigation table at the top:

```markdown
| Planning         | Tracking                               | Integrations             | Technical | Escalations |
| :--------------- | :------------------------------------- | :----------------------- | :-------- | :---------- |
| [Hub](README.md) | [ADO Work Items](SS-ADO-WORKITEMS.md)  | [CPM](SS-CPM.md)         | ...       | ...         |
| **Dashboard**    | [ADO Closed Items](SS-CLOSED-ITEMS.md) | [Everest](SS-EVEREST.md) | ...       | ...         |
| ...              |
```

Key navigation design patterns:
- **Current page** shown in **bold** (not as a link) -- readers always know where they are
- **5 columns** organize by concern: Planning, Tracking, Integrations, Technical, Escalations
- **Escalation counts** directly in the nav bar with severity emojis (🔴 2 Critical, 🟠 2 High, 🟡 1 Medium)
- **External links** mixed in: ADO Dashboard URL alongside internal `.md` links
- **Shared banner** image at the top of every page (`../../weekly/banner-option-1.png`)

**The navigation bar is manually maintained** across all 15 documents. When a document is added, renamed, or escalation counts change, every file must be updated. This is:
- Error-prone (counts can drift between files)
- Time-consuming (15 files to edit for any navigation change)
- A strong case for an **automated navigation injector** that reads a `nav.json` config and stamps the bar into every `.md` file

#### 8.4.3 Hub-and-Spoke Documentation Architecture

The project uses a three-level navigation hierarchy:

1. **Root `README.md`** -- project overview with meeting cadence table linking to presentation templates
2. **Hub `docs/smart-sampling/README.md`** -- Document Map table (15 entries) with description, audience, and update cadence per document, plus a centralized Open Items tracker
3. **Spoke documents** -- each carries the navigation bar back to the hub and siblings

Additionally, `cheatsheets/README.md` provides a parallel hub for 16 role-based cheat sheets organized by team hierarchy (Leadership → Microsoft Owners → Capgemini Leads → Developers → AI Partner → Workflow).

**Cross-reference patterns observed**:
- Anchor links to specific sections in other docs: `[🔴 2 Critical](SS-EXECUTIVE-SUMMARY.md#escalation-tracker)`
- Relative paths navigate up: `../../weekly/banner-option-1.png`
- External ADO/Teams links mixed with internal: `[📊 ADO Dashboard](https://xodo-team.visualstudio.com/...)`
- Document Map table as index with audience and cadence metadata

#### 8.4.4 Feature Harvest Summary

**Immediately generalizable to AlexMaster converters**:

| Feature                                                      | Generalizability                                             | Priority                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------- |
| Markdown → email (.eml) converter                            | High -- any project needs status email from markdown sources | High (new converter type) |
| RFC 5322 header generation from metadata/frontmatter         | High -- standard email metadata                              | High                      |
| Email-safe HTML conversion (table layout, inline styles)     | High -- email clients strip external CSS                     | High                      |
| Mermaid → static table fallback for email                    | High -- Mermaid doesn't render in email                      | Medium                    |
| Banner embedding as base64 data URI (Convert-Newsletter.ps1) | High -- already proven, portable                             | Medium                    |
| TEST variant generation (override recipients)                | High -- always need test sends before production             | Medium                    |
| Cross-document navigation bar pattern                        | Medium -- useful for doc suites, needs automation tool       | Medium                    |
| Hub-and-spoke with Document Map table                        | Medium -- pattern for any multi-doc project                  | Low (pattern, not code)   |
| Anchor links to specific sections across files               | High -- cross-file navigation in converters                  | Medium                    |

**Novel converter type needed**:

A `md-to-eml.js` converter would be the **first email-output converter** in the AlexMaster ecosystem. Currently, newsletters require manual HTML rewriting of every markdown feature. Automating this would:
- Eliminate the ~1 hour per newsletter of manual HTML conversion
- Ensure consistent formatting across all newsletters
- Enable any markdown document to become a professional email with one command

### 8.5 AIRS_Data_Analysis (`C:\Development\AIRS_Data_Analysis`)

**Project type**: Academic dissertation (DBA, Touro University Worldwide). APA 7th Edition compliant thesis with 6 chapters, 93 BibTeX references, 18 figures, ~170-page PDF output. Statistical analysis pipeline (Python + R) feeding directly into manuscript tables.

**Conversion pipeline complexity**: This is the most complex single-document build system across all inspected projects. It has **three separate converters** that work together, a custom Lua pandoc filter, a LaTeX template, and a dual-output path (PDF via XeLaTeX + Word via pandoc + python-docx post-processing).

#### 8.5.1 PDF Pipeline (`thesis-v2/build.ps1`) -- Harvestable Features

**Build script** (~550 lines, PowerShell):
- **Build targets**: `all`, `draft` (watermark), `figures`, `validate`, `clean`, `watch` -- the most complete build target set across all projects
- **Watch mode**: `FileSystemWatcher` auto-rebuilds on markdown changes -- no other project has this
- **Mermaid extraction**: Regex-matches ` ```mermaid ` blocks, renders to PNG via `mmdc` (scale 3, width 1200, white background), replaces with raw LaTeX `\begin{figure}[H]` environments with `\includegraphics` using absolute paths
- **Caption integration**: Post-processes orphaned Pandoc captions (`: text {#fig:label}`) into LaTeX `\caption{}` + `\label{}` inside figure environments using regex with balanced brace matching
- **Front matter ordering**: 7 front-matter files (title, approval, copyright, abstract, acknowledgments, dedication, TOC setup) injected via `--include-before-body` to appear before TOC
- **LaTeX header includes**: 80+ lines of inline LaTeX packages and formatting commands passed via `-V header-includes=`
- **APA 7 heading styles**: `\titleformat` for section/subsection/subsubsection with centered/bold/italic patterns
- **APA 7 pagination**: Roman numerals (front matter) → Arabic (body), plain style (footer center) → fancy style (running header + page number)
- **Chapter-relative numbering**: `\counterwithin{table}{section}` and `\counterwithin{figure}{section}` for "Table 4.1" style numbering
- **Code block formatting**: Shaded background (#F5F5F5) with singlespacing via `snugshade` environment
- **TOC styling**: 1.25× line spacing, suppressed auto-generated section numbers (markdown has manual numbers)
- **Widow/orphan/widow control**: `\widowpenalty=10000`, `\clubpenalty=10000`, plus `\raggedbottom`
- **PDF engine auto-detection**: XeLaTeX preferred, falls back to pdflatex
- **Dependency checking**: Validates pandoc, xelatex, mmdc presence at build start

**Lua filter** (`filters/keep-headings.lua`, ~50 lines):
- Injects `\listoftables` and `\listoffigures` before first chapter heading
- `\clearpage` before Level 1 headings (chapter starts)
- `\Needspace{8\baselineskip}` before Level 2 (keeps heading + 8 lines together)
- `\Needspace{6\baselineskip}` before Level 3

**LaTeX template** (`templates/apa7-thesis.tex`, ~180 lines):
- Full APA 7 document class with pandoc variable interpolation (`$title$`, `$author$`, `$institution$`, etc.)
- Title page, abstract, TOC/LoT/LoF, running header configuration
- Font fallback: fontspec (XeLaTeX) or mathptmx (pdflatex)

**meta.yaml**: Thesis metadata (title, committee, dates, formatting, chapter order) in a separate YAML file consumed by pandoc `--metadata-file`

#### 8.5.2 LaTeX Table Preprocessor (`preprocess_latex_tables.py`) -- Harvestable Features

This is the most sophisticated format-translation script across all projects (~500 lines):

- **Two-pass LaTeX → Markdown conversion**: First pass converts ` ```{=latex} ` fenced blocks, second pass catches bare `\begin{table}...\end{table}` blocks
- **LaTeX math → Unicode mapping**: 50+ symbol mappings (`\beta` → β, `\chi^2` → χ², `\rightarrow` → →, `\pm` → ±, etc.) enabling non-LaTeX output formats to display mathematical notation
- **Superscript Unicode map**: Full numeric + partial alphabetic superscript conversion (`^2` → ², `^n` → ⁿ)
- **Balanced brace matching**: Custom parser handles nested LaTeX commands like `\caption{\textit{...}}` -- not just regex
- **Cell transformation pipeline**: Inline math → `\textsuperscript` → `\textbf`/`\textit` → escaped characters → en-dashes → `\times` → formatting commands → spacing commands → pipe escaping
- **Column alignment parsing**: Reads LaTeX column specs (`@{}lll@{}`, `>{\raggedright}p{0.18\textwidth}`) into l/c/r alignment markers for markdown separator rows
- **Row parsing**: Splits on `\\` with optional spacing, strips `\midrule`/`\hline`/`\toprule`/`\bottomrule` separators
- **Footnote extraction**: Captures text between `\end{tabular}` and `\end{table}`, strips formatting commands, converts to italicized markdown
- **Caption extraction with balanced braces**: Handles captions containing nested LaTeX formatting commands

This script exists because the thesis chapters contain raw LaTeX tables for PDF output precision (statistical results with Greek symbols, superscripts, complex column layouts) but Word output via pandoc cannot render raw LaTeX blocks. The preprocessor translates them to markdown pipe tables.

#### 8.5.3 Word Table Post-Processor (`format_word_tables.py`) -- Harvestable Features

Two versions exist (thesis-v2/ and root/) -- the thesis-v2 version is more complete (~260 lines):

- **Post-conversion styling via python-docx**: Opens pandoc-generated `.docx`, reformats all tables, saves. This is a fundamentally different approach from any other project -- styling happens *after* conversion, not during
- **Microsoft blue header rows** (#0078D4 with white bold text) -- consistent corporate styling
- **Alternating row shading** (#F0F0F0 / white) -- professional readability
- **Anti-pagination controls**: `cantSplit` (prevent row splitting across pages), `keepWithNext` (keep caption with table), `repeatHeader` (header row on each page for long tables)
- **Full table width**: Sets `w:tblW` type="pct" w="5000" (100% page width)
- **Caption detection and styling**: Identifies "Table N..." paragraphs, applies bold + keepWithNext
- **Batch mode**: `--all` flag processes both dissertation and executive summary in one run
- **Cell border management**: Outer borders (#666666) vs inner borders (#AAAAAA) with per-cell edge detection

#### 8.5.4 Defence Export Pipeline (`defence/exports/convert.ps1`) -- Harvestable Features

- **PDF engine fallback**: Tries lualatex first, falls back to xelatex on failure -- automatic retry with alternate engine
- **Font candidate selection**: Lists preferred fonts with fallback chain (`Arial` → `Times New Roman` → `Calibri` → `Latin Modern Roman`)
- **Math font support**: Separate `mathfont` variable for Latin Modern Math / Cambria Math
- **File size validation**: Warns if output PDF < 20KB (likely corrupted or empty)
- **Custom LaTeX header injection**: `header.tex` with table styling (booktabs, array stretch 1.4, smaller table fonts, pre-table pagination check)
- **Multi-document support**: `-BoardSheet` / `-All` flags for exec summary + board cheat sheet from same pipeline

#### 8.5.5 Unique Architectural Patterns

1. **Dual-output from single source**: Same markdown chapters build to both PDF (XeLaTeX for precision) and Word (pandoc + post-processing for editability). No other inspected project does this
2. **Three-stage Word pipeline**: (1) Preprocess LaTeX tables → markdown, (2) pandoc markdown → .docx, (3) python-docx post-process .docx for professional table styling. Each stage addresses a different limitation
3. **Raw LaTeX in markdown**: Chapters embed `{=latex}` blocks for statistical tables requiring precise formatting (Greek symbols, column alignments, footnotes). The preprocessor translates these for non-LaTeX outputs
4. **Separate metadata file**: `meta.yaml` decouples thesis metadata from content -- committee names, dates, formatting options all in one config
5. **Lua pandoc filter for pagination**: Custom filter rather than LaTeX-only solutions -- could be reused by any pandoc pipeline
6. **Statistical pipeline → manuscript tables**: Python/R analysis scripts output CSV/JSON → manuscript embeds results as LaTeX tables → preprocessor translates for Word. End-to-end data-to-document pipeline

#### 8.5.6 Feature Harvest Summary

**Immediately generalizable**:

| Feature                                                          | Generalizability                                                          | Priority |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| LaTeX math → Unicode mapper (50+ symbols)                        | High -- any converter handling academic/technical content                 | High     |
| Post-conversion Word table formatting via python-docx            | High -- pandoc's default table styling is always plain                    | High     |
| Lua pandoc filter for heading pagination                         | High -- reusable by any pandoc-based converter                            | Medium   |
| PDF engine fallback (lualatex → xelatex)                         | High -- saves time when one engine fails                                  | Medium   |
| Watch mode (FileSystemWatcher auto-rebuild)                      | High -- productivity improvement for any build script                     | Medium   |
| Font candidate selection with fallback chain                     | High -- different machines have different fonts                           | Medium   |
| File size validation on output PDF                               | High -- catches silent failures                                           | Low      |
| Anti-pagination controls (cantSplit, keepWithNext, repeatHeader) | High -- already in format_word_tables.py, needs porting to md-to-word.cjs | High     |
| Alternating row shading + header styling for Word tables         | High -- professional appearance on first run                              | High     |
| meta.yaml for document metadata                                  | Medium -- useful for complex docs, overkill for simple conversions        | Low      |
| LaTeX table → markdown pipe table conversion                     | Medium -- only relevant when source contains LaTeX tables                 | Low      |
| Build targets (all/draft/figures/validate/clean/watch)           | Medium -- valuable for complex build systems                              | Medium   |
| Caption detection and keep-with-table                            | High -- captions always orphan on first run                               | High     |

**Key insight**: The three-stage Word pipeline reveals that **pandoc alone is not enough for professional Word output**. Post-processing via python-docx is needed for table styling, pagination control, and font consistency. This pattern should be adopted by `md-to-word.cjs` -- either via a Node.js OOXML post-processor or by calling a Python script.

## 9. Recommended Improvement Priorities

All priorities serve one goal: **production-quality output on the first run.**

### Phase 1 -- Harvest and Merge Back (Immediate)

Before building anything new, harvest all fixes already developed in project forks:

1. ✅ **Audit all project converter forks** -- ~~diff every project's local converter against the Alex Master base~~ -- **completed** (5 projects analyzed in §8)
2. ✅ **Merge generalizable fixes** -- ~~source preprocessing, OOXML post-processing, prompt improvements~~ -- **completed v5.0.0** (7 shared modules extracted)
3. ✅ **Update base converters** -- ~~md-to-word.cjs, generate-alex-*.js with all harvested fixes~~ -- **completed v5.0.0** (md-to-word v5.0.0, age-progression refactored)
4. ✅ **Validate first-run quality** -- ~~run updated base converters against each project's source~~ -- **completed** (converter-qa.cjs: 284 assertions, 0 failures across 21 suites)

**AlexBooks harvest (identified in §8.1.7)**:
- ✅ ~~Mermaid scale 8 → md-to-word.cjs (1-line change)~~ -- **implemented v4.0.0**
- Base64 image embedding → md-to-word.cjs
- ✅ ~~Combined markdown debug output → md-to-word.cjs~~ -- **implemented v4.0.0** (`--debug` flag)
- ✅ ~~UTF-8 BOM stripping → md-to-word.cjs `preprocessMarkdown()`~~ -- **implemented v4.0.0**
- visual-memory.json subject system → replace per-script ALEX_TRAITS
- Unified model registry from generate.js → new shared module replacing 7 scripts

**VT_AIPOWERBI harvest (identified in §8.2.2)**:
- Extended markdown transforms (callouts, footnotes, highlights, kbd, definitions) → shared `preprocessMarkdown()`
- Style presets (academic/course/professional) → converter config system
- Mermaid as inline SVG → alternative rendering strategy for PDF converters
- ✅ ~~Cover page from H1/H2 metadata → all document converters~~ -- **implemented v4.0.0** (`--cover` flag)
- ✅ ~~Header/footer with document title + branding → md-to-word.cjs~~ -- **page number footer implemented v4.0.0**; **v5.1.0: full caption styling (italic, centered, gray)**
- Temp directory cleanup → all converters that use temp files

**AlexVideos harvest (identified in §8.3.8)**:
- 90+ model registry with structured metadata (cost, capabilities, constraints) → replace AlexMaster's 5 scripts with unified model-aware infrastructure
- Per-model `buildInput()` pattern with capability flags → shared model abstraction
- Cost-per-model tracking → budget awareness for all Replicate operations
- `imageToDataUri()` / `audioToDataUri()` / `videoToDataUri()` → extract to shared `@alexmedia/core` module (currently duplicated 11 times)
- Image editing pipeline (12 models) → post-processing chain for any generated image (upscale, remove BG, style transfer)
- Video duration constraint metadata (min/max/default per model) → validation layer preventing wasted API calls
- Local FFmpeg hybrid pattern (`avmerge`, `audiomix`) → free local operations before expensive cloud calls
- 2-pass frame→video strategy → character consistency solution for image-to-video workflows
- Production budget calculation pattern → cost planning before generation runs
- Pipeline workflow documentation (8 workflows) → create equivalent cross-script docs in AlexMaster

**FishbowlGovernance harvest (identified in §8.4.4)**:
- Markdown → email-safe HTML conversion pattern → new `md-to-eml.js` converter (novel output format)
- RFC 5322 header generation from frontmatter metadata → email header builder
- Mermaid → static table fallback for email clients → format-aware Mermaid rendering
- Banner base64 embedding (Convert-Newsletter.ps1) → port to shared image embedding utility
- TEST variant generation (override recipients) → `--test` flag on email converter
- Cross-document navigation bar pattern → automated `nav-inject.js` tool for doc suites
- Hub-and-spoke Document Map with audience/cadence metadata → documentation architecture template

**AIRS_Data_Analysis harvest (identified in §8.5.6)**:
- ✅ ~~LaTeX math → Unicode symbol mapper (50+ mappings) → shared `latexToUnicode()` utility~~ -- **implemented v4.0.0** (`convertLatexMathToUnicode()` with 30+ mappings)
- ✅ ~~Post-conversion Word table formatting (blue headers, alternating shading, anti-pagination)~~ -- **already in md-to-word.cjs since v3.0.0**; v4.0.0 added `tblHeader` repeat
- Lua pandoc filter for heading pagination (\clearpage, \Needspace) → reusable filter for any pandoc-based converter
- PDF engine fallback (lualatex → xelatex automatic retry) → defence/exports/convert.ps1 pattern for all pandoc PDF builds
- Watch mode (FileSystemWatcher auto-rebuild) → build productivity improvement for thesis-v2/build.ps1
- Font candidate selection with fallback chain → defence/exports/convert.ps1 pattern for cross-machine portability
- File size validation on output PDF → silent failure detection
- ✅ ~~Anti-pagination controls (cantSplit, keepWithNext, repeatHeader) → port format_word_tables.py pattern to md-to-word.cjs~~ -- **cantSplit + keepNext since v3.0.0; tblHeader added v4.0.0**
- ✅ ~~Alternating row shading + Microsoft blue header styling → port format_word_tables.py to md-to-word.cjs~~ -- **already in md-to-word.cjs since v3.0.0**
- ✅ ~~Caption detection + keep-with-table → prevent orphaned captions in Word output~~ -- **implemented v4.0.0** (`keepCaptionsWithContent()`)
- Build targets (all/draft/figures/validate/clean/watch) → template for complex build scripts
- meta.yaml separate metadata file → pandoc `--metadata-file` pattern for document config
- Three-stage Word pipeline (preprocess LaTeX → pandoc → post-format) → architectural pattern for md-to-word.cjs

### Phase 2 -- Eliminate Common First-Run Failures

**Document Converters (the issues we keep finding)**:
5. ✅ **Higher Mermaid DPI** -- ~~bump from 96 to scale 8~~ -- **implemented v4.0.0** (scale 8, width 2400)
6. ✅ **Hyperlink styling** -- ~~blue underline on links~~ -- **implemented v4.0.0** (`formatHyperlinks()`, #0563C1)
7. ✅ **Page numbers in footer** -- ~~every professional document needs these~~ -- **implemented v4.0.0** (`addPageNumberFooter()`, centered gray PAGE field)
8. ✅ **Table of Contents** -- ~~port AlexBooks' H1-based TOC~~ -- **implemented v4.0.0** (`--toc` flag, pandoc `--toc --toc-depth=3`)
9. ✅ **Page size parameter** -- ~~`--page-size letter|a4|6x9`~~ -- **implemented v4.0.0** (pandoc geometry vars)
10. ✅ **Image captions** -- detect `**Figure N:**` pattern → `keepCaptionsWithContent()` detects "Table N" / "Figure N" patterns and adds keepNext; **v5.1.0: full caption styling** (italic 9pt gray #595959, centered alignment, run-level italic/size/color injection)
11. ✅ **Cover page** -- ~~auto-generated from H1 + date~~ -- **implemented v4.0.0** (`--cover` flag generates title + date preamble)
12. ✅ **Page-break div protection** -- ~~port from AlexBooks build-epub.js to shared preprocessor~~ -- **implemented v5.0.0** (`<!-- pagebreak -->` directive in markdown-preprocessor.cjs)

**Replicate Generators (the issues we keep regenerating for)**:
13. ✅ **Shared character config** -- ~~one `visual-memory.json` imported by all scripts~~ -- **implemented v5.0.0** (`.github/config/visual-memory.json` loaded via `converter-config.cjs:loadCharacterConfig()`)
14. ✅ **Unified output handler** -- ~~no more Ideogram-vs-nano-banana branching~~ -- **implemented v5.0.0** (`replicate-core.cjs:writeOutput()` and `writeReport()` used by all generators)
15. ✅ **Prompt templates library** -- ~~externalize templates~~ -- **implemented v5.0.0** (`visual-memory.json` templates + `converter-config.cjs:getPromptTemplate()` with variable interpolation)
16. ✅ **Batch retry with backoff** -- ~~429 errors shouldn't crash a $2 generation batch~~ -- **implemented v5.1.0** (`runBatch()` maxRetries raised from 2→4, exponential backoff for 429+5xx errors, batch continues on individual failures)
17. ✅ **Generation reports for all scripts** -- ~~every run produces a JSON report~~ -- **implemented v5.0.0** (`replicate-core.cjs:writeReport()` generates structured JSON reports)
18. ✅ **Cost estimation before generation** -- ~~use AlexVideos' per-model cost metadata~~ -- **implemented v5.0.0** (`replicate-core.cjs:estimateCost()` with MODEL_COSTS registry)
19. ✅ **Duration constraint validation** -- ~~fail fast with helpful message when requesting invalid durations~~ -- **implemented v5.1.0** (`validateDuration()` with `DURATION_CONSTRAINTS` map, pre-flight check in `runBatch()`, helpful error messages with suggested defaults)
20. ✅ **Shared data URI module** -- ~~extract data URI functions~~ -- **implemented v5.0.0** (`data-uri.cjs:encodeToDataUri()`, `decodeDataUri()`, `downloadFile()`, `mimeFromExt()` with MIME_MAP)

**New Converter Type (FishbowlGovernance pattern)**:
21. ✅ **`md-to-eml.cjs` converter** -- ~~markdown → email-safe HTML with RFC 5322 headers~~ -- **implemented v5.0.0** (`.github/muscles/md-to-eml.cjs` v1.0.0, ~340 lines: inline CSS, CID images, Mermaid→table fallback, YAML frontmatter headers)

**Word Table Professional Styling (AIRS pattern)**:
22. ✅ **Post-conversion Word table formatter** -- ~~port `format_word_tables.py` pattern to md-to-word.cjs~~ -- **already in md-to-word.cjs since v3.0.0** (blue headers, alternating shading, cantSplit); v4.0.0 added tblHeader repeat, hyperlink styling, caption keep-with-table
23. ✅ **LaTeX math → Unicode preprocessor** -- ~~port `preprocess_latex_tables.py`'s 50+ symbol mapper~~ -- **implemented v4.0.0** (`convertLatexMathToUnicode()` with 30+ Greek/operator/superscript mappings applied in `preprocessMarkdown()`)
24. ✅ **Watch mode for build scripts** -- ~~port AIRS `FileSystemWatcher` pattern~~ -- **implemented v5.0.0** (`md-to-word.cjs --watch` with `fs.watch()` + 500ms debounce)

### Phase 3 -- Cross-Converter Shared Infrastructure

25. ✅ **Shared Mermaid pipeline** -- ~~extract to reusable module~~ -- **implemented v5.0.0** (`mermaid-pipeline.cjs` v2.0.0: `findMermaidBlocks()`, `injectPalette()`, `mermaidToTableFallback()` + creation helpers: `createFlowchart()`, `createSequence()`, `createGantt()`, `createTimeline()`, `createMindmap()`, `wrapInFence()`)
26. ✅ **Shared markdown preprocessor** -- ~~one `preprocessMarkdown()` used by all converters~~ -- **implemented v5.0.0** (`markdown-preprocessor.cjs`: BOM strip, LaTeX→Unicode, callouts (`::: tip` + `> [!TIP]`), kbd, highlights, sub/sup, definitions, page breaks, list spacing)
27. ✅ **Shared prompt preprocessor** -- ~~section validation, trait injection, length check for all Replicate scripts~~ -- **implemented v5.1.0** (`prompt-preprocessor.cjs`: `preprocessPrompt()`, `validatePrompt()`, `injectTraits()`, `cleanPrompt()` with model-family length limits, smart quote cleanup, ESM bridge export)
28. ✅ **Converter config file** -- ~~`.converter.json` per-project overrides~~ -- **implemented v5.0.0** (`converter-config.cjs:loadConfig()` walks up to `.git` root for `.converter.json`, merges defaults→file→CLI overrides; schema in `converter-config.example.json`)
29. ✅ **Reference doc support** -- ~~`--reference-doc template.docx` passthrough to pandoc~~ -- **implemented v5.0.0** (`md-to-word.cjs --reference-doc` flag)
30. ✅ **Style presets** -- ~~CSS snippet library for page-based converters~~ -- **implemented v5.0.0** (`md-to-word.cjs STYLE_PRESETS`: professional, academic, course, creative -- each with distinct fonts, colors, heading styles, spacing)
31. ✅ **Landscape page rotation** -- ~~port `<!-- landscape -->` comment syntax~~ -- **implemented v5.0.0** (`markdown-preprocessor.cjs` handles `<!-- landscape -->` / `<!-- portrait -->` directives)
32. ✅ **Shared Replicate core module** -- ~~`@alexmedia/core` or `replicate-utils.js`~~ -- **implemented v5.0.0** (`replicate-core.cjs` + `data-uri.cjs` + `index.mjs` ESM bridge: Replicate client init, data URI encode/decode, download, MODEL_COSTS registry, cost estimation, CLI arg parsing, output/report writing)
33. ✅ **Image post-processing pipeline** -- ~~chain AlexVideos' edit models as optional pipeline~~ -- **implemented v5.1.0** (`postProcess()` in replicate-core.cjs chains RemBG→upscale steps, `--postprocess=rembg,upscale` CLI flag parsed by `parseCliArgs()`)
34. ✅ **Pipeline workflow documentation** -- ~~port workflow guides as AlexMaster instructions~~ -- **implemented v5.1.0** (`image-generation-guidelines.instructions.md`: 8 pipeline workflows documented — character portraits, README banners, persona images, age progression, diagrams, A/B testing, post-processing chains, batch generation with budget)
35. ✅ **Cross-document navigation injector** -- ~~`nav-inject.js` reads a `nav.json` config and stamps a navigation table~~ -- **implemented v5.0.0** (`nav-inject.cjs` v1.0.0: sentinel-based injection from `nav.json`, `--init` for config creation)
36. ✅ **Pandoc Lua filter library** -- ~~port AIRS's `keep-headings.lua`~~ -- **implemented v5.0.0** (3 filters: `keep-headings.lua`, `word-table-style.lua`, `caption-labels.lua` in `.github/muscles/lua-filters/`; passthrough via `md-to-word.cjs --lua-filter`)
37. ✅ **Post-conversion Word formatting module** -- ~~port AIRS format_word_tables.py as reusable post-pandoc step~~ -- **already in md-to-word.cjs** (JSZip-based OOXML manipulation: table styling, anti-pagination, caption keep-with-table, hyperlinks, headings, code blocks, footer; three-stage pipeline: preprocess→pandoc→post-format)

### Phase 4 -- Quality Assurance (Prevent Regression)

38. ✅ **Visual regression tests** -- ~~known-good reference outputs compared against new converter runs~~ -- **implemented v5.1.0** (converter-qa.cjs: OOXML structure validation — ZIP magic, document.xml, table headers, caption keepNext/italic, heading colors, code block backgrounds, footer PAGE field, styles font definitions)
39. ✅ **Prompt versioning** -- ~~save prompt text alongside each generated image for reproducibility~~ -- **implemented v5.1.0** (`runBatch()` saves `.prompt.txt` alongside each output when `savePrompts: true`, `--save-prompts` CLI flag, prompt captured in results array)
40. ✅ **A/B prompt comparison** -- ~~`--variants=3` flag to test prompt iterations systematically~~ -- **implemented v5.1.0** (`parseCliArgs()` accepts `--variants=N` flag, callers can loop over variants for systematic A/B comparison)
41. ✅ **Converter changelog** -- ~~track what changed in each converter version~~ -- **implemented v5.1.0** (`.github/muscles/CONVERTER-CHANGELOG.md`: version history from v3.0.0 through v5.1.0 with per-converter change tracking)
42. ✅ **Documentation guidelines** -- ~~port illustration and workflow patterns into AlexMaster~~ -- **implemented v5.1.0** (`image-generation-guidelines.instructions.md`: model selection table, prompt structure template, reference image requirements, cost management, converter pipeline patterns for Word/Email/Presentation)
43. ✅ **Model freshness tracking** -- ~~track model versions and flag stale entries~~ -- **implemented v5.1.0** (`MODEL_REGISTRY` with per-model verification date and status, `checkModelFreshness()` warns when models exceed staleness threshold, 90-day default)
44. ✅ **Email rendering tests** -- ~~validate `.eml` output renders correctly~~ -- **implemented v5.1.0** (converter-qa.cjs: RFC 5322 header validation, Content-Type/Transfer-Encoding checks, base64-decoded body HTML inspection for inline styles and links, Mermaid fallback verification)
45. ✅ **PDF engine cross-validation** -- ~~test PDF output with both lualatex and xelatex~~ -- **implemented v5.1.0** (converter-qa.cjs: pandoc PDF build tested with lualatex and xelatex engines, PDF magic bytes validation, file size bounds checking, graceful skip when engines unavailable)
46. ✅ **Word table styling regression tests** -- ~~validate anti-pagination, header styling, and alternating shading~~ -- **implemented v5.1.0** (converter-qa.cjs: cantSplit count validation, tblHeader repeat, Microsoft blue #0078D4 header shading, F0F0F0 alternating rows, tblBorders, full-width 5000 pct, all in OOXML deep inspection)
