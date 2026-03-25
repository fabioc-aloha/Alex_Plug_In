# Converter Changelog

All notable changes to the Alex converter infrastructure.

## v5.3.0 (2026-03-25)

### md-to-word.cjs

- **Dry-run mode** -- `--dry-run` flag runs all preprocessing (frontmatter stripping, heading validation, link checking, image embedding) and exits before generating `.docx`, useful for validation and CI
- **Link validation** -- warns on broken local file references and empty link URLs during preprocessing

### markdown-preprocessor.cjs

- **`validateLinks()`** -- scans for empty URLs and broken local file references; skips HTTP URLs, anchors, and mailto links
- **Footnote preservation** -- fixed superscript regex that was corrupting `[^N]` footnote syntax across newlines (added `\n` exclusion to character class)

### converter-qa.cjs

- **Link validation tests** -- external URL passthrough, empty URL detection, broken local file, valid local file, image ref exclusion, mailto passthrough
- **Footnote passthrough tests** -- `[^1]` reference and `[^1]:` definition survive `preprocessMarkdown()`
- **Dry-run mode test** -- verifies exit code 0, completion message, and no `.docx` generation
- Test count: 270 → 284 assertions (14 new)

### shared/index.mjs

- **ESM bridge** -- added `validateLinks` export from markdown-preprocessor

## v5.2.0 (2026-03-25)

### md-to-word.cjs

- **Base64 image embedding** -- `--embed-images` flag converts local image references to inline base64 data URIs, preventing broken images in portable documents
- **YAML frontmatter stripping** -- `--strip-frontmatter` flag removes YAML front matter before pandoc conversion
- **Recursive batch mode** -- `--recursive` flag processes all `.md` files in a directory tree, generating `.docx` alongside each source
- **Heading hierarchy validation** -- warns (non-blocking) when heading levels skip (e.g., H1 directly to H3)
- **Mermaid syntax pre-validation** -- regex-based diagram type check before expensive mmdc rendering
- **Output size validation** -- warns when generated .docx is suspiciously small (<5 KB), indicating possible corruption

### replicate-core.cjs

- **Negative prompt support** -- `--negative-prompt=TEXT` CLI flag parsed and stored in `negativePrompt` field for model-aware parameter routing
- **External prompt file** -- `--prompt-file=PATH` CLI flag loads prompt text from a file; content available as `promptFileContent`

### markdown-preprocessor.cjs

- **`validateHeadingHierarchy()`** -- returns `{ valid, warnings[] }` detecting heading level jumps with line numbers
- **`embedLocalImages()`** -- replaces local markdown image references with base64 data URIs; skips HTTP URLs and existing data URIs

### shared/index.mjs

- **ESM bridge** -- added `validateHeadingHierarchy` and `embedLocalImages` exports from markdown-preprocessor

### converter-qa.cjs

- **Heading validation tests** -- valid hierarchy, H1→H3 skip, H2→H4 skip, no-heading edge case
- **Image embedding tests** -- local PNG, HTTP URL passthrough, data URI passthrough, missing file passthrough
- **Negative prompt + prompt-file tests** -- CLI parsing, default null values, equals-in-value edge case, file content loading
- **CLI flag acceptance test** -- verifies usage message includes new --embed-images, --strip-frontmatter, --recursive flags
- Test count: 247 → 270 assertions (23 new)

## v5.1.0 (2026-03-25)

### md-to-word.cjs

- **Caption styling** -- `keepCaptionsWithContent()` now applies italic 9pt gray (#595959) styling and centered alignment to "Table N" / "Figure N" caption paragraphs, not just keepNext

### replicate-core.cjs

- **Batch retry hardened** -- `maxRetries` raised from 2 to 4; 429 AND 5xx errors now trigger exponential backoff; batch continues on individual failures
- **Duration constraint validation** -- `validateDuration()` fails fast with helpful message when requesting invalid durations (e.g. "hailuo23 only accepts 6s or 10s, you requested 7s")
- **Prompt versioning** -- `runBatch()` saves `.prompt.txt` alongside each output when `savePrompts: true` option is set
- **A/B prompt comparison** -- `parseCliArgs()` accepts `--variants=N`, `--save-prompts`, and `--postprocess=` flags
- **Model freshness tracking** -- `MODEL_REGISTRY` tracks verification date and status per model; `checkModelFreshness()` warns when models are stale
- **Image post-processing** -- `postProcess()` chains RemBG and upscale models as pipeline steps

### prompt-preprocessor.cjs (NEW)

- **Shared prompt preprocessor** -- section validation, trait injection from visual-memory.json, smart quote cleanup, length checking per model family, full `preprocessPrompt()` pipeline

### converter-qa.cjs

- **Visual regression tests** -- Word output OOXML structure validated (ZIP magic, document.xml presence, table header tags, caption keepNext/italic)
- **Email rendering tests** -- `.eml` structure validated (RFC 5322 headers, Content-Type, inline styles, Mermaid fallback)
- **PDF engine cross-validation** -- pandoc PDF build tested with both lualatex and xelatex engines
- **Word table regression tests** -- anti-pagination (cantSplit, tblHeader), alternating shading, blue headers validated in OOXML
- **Replicate core tests** -- duration validation, model freshness, prompt preprocessing, variants/postprocess CLI parsing
- **Prompt preprocessor tests** -- smart quote cleanup, trait injection, length validation, full pipeline

## v5.0.0 (2026-03-24)

- Extracted 7 shared modules from 5 project forks
- md-to-word v5.0.0: style presets, watch mode, reference-doc, Lua filter passthrough
- md-to-eml v1.0.0: markdown to email-safe HTML with RFC 5322 headers
- nav-inject v1.0.0: cross-document navigation from nav.json
- md-scaffold v1.0.0: 6 document templates
- markdown-lint v1.0.0: 19 validation rules
- svg-pipeline v1.0.0: SVG creation, validation, PNG conversion
- converter-qa v1.0.0: 187 assertions across 14 test suites
- 3 Lua filters: keep-headings, word-table-style, caption-labels

## v4.0.0

- Harvested fixes from AlexBooks: Mermaid scale 8, BOM stripping, debug output
- Harvested fixes from VT_AIPOWERBI: cover page from H1/H2 metadata
- Harvested fixes from AIRS: LaTeX math to Unicode, tblHeader repeat, caption keepNext
- Added: hyperlink styling, page numbers, TOC generation, page-size parameter

## v3.0.0

- Initial professional converter: table formatting (blue headers, alternating shading, anti-pagination), heading colors, code block styling, image centering
