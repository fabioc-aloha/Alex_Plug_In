# Alex Muscles

> **Muscles** are execution scripts that Alex's memory files reference — the "motor cortex" that turns declarative knowledge into action.

## Neuroanatomical Mapping

| Component    | Brain Analog                  | Implementation                  |
| ------------ | ----------------------------- | ------------------------------- |
| Memory Files | Declarative/Procedural Memory | `.instructions.md`, `SKILL.md`  |
| **Muscles**  | **Motor Cortex → Muscles**    | Scripts that execute procedures |

Memory files define *what* and *how*; muscles *do*.

## Current Inventory

### Main Muscles

| Script                        | Language   | Purpose                                   | Inheritance |
| ----------------------------- | ---------- | ----------------------------------------- | ----------- |
| `analyze-assignments.cjs`     | JavaScript | Delegation pattern analysis               | inheritable |
| `audit-master-alex.cjs`       | JavaScript | 22-point pre-release audit (CJS)          | master-only |
| `audit-master-alex.ps1`       | PowerShell | 22-point pre-release audit                | master-only |
| `audit-token-waste.cjs`       | JavaScript | Token waste detection and auto-fix        | inheritable |
| `brain-qa.cjs`                | JavaScript | 32-phase deep validation (CJS)            | master-only |
| `brain-qa.ps1`                | PowerShell | 32-phase deep validation                  | master-only |
| `brain-qa-heir.cjs`           | JavaScript | 25-phase heir validation (CJS)            | inheritable |
| `brain-qa-heir.ps1`           | PowerShell | 25-phase heir validation                  | inheritable |
| `build-extension-package.ps1` | PowerShell | VSIX packaging                            | master-only |
| `chart-recommend.cjs`         | JavaScript | Story-intent chart advisor                | inheritable |
| `converter-qa.cjs`            | JavaScript | 284-assertion converter test harness      | master-only |
| `dashboard-scaffold.cjs`      | JavaScript | JSON-spec to HTML dashboard               | inheritable |
| `data-ingest.cjs`             | JavaScript | Universal data ingestion                  | inheritable |
| `data-profile.cjs`            | JavaScript | Statistical data profiler                 | inheritable |
| `docx-to-md.cjs`              | JavaScript | Word document to Markdown conversion      | inheritable |
| `dream-cli.ts`                | TypeScript | Neural maintenance CLI                    | inheritable |
| `fix-fence-bug.ps1`           | PowerShell | Detect/fix VS Code fence bug              | inheritable |
| `gamma-generator.cjs`         | JavaScript | Markdown to Gamma slides                  | inheritable |
| `install-hooks.cjs`           | JavaScript | Install hooks config (CJS)                | inheritable |
| `install-hooks.ps1`           | PowerShell | Install hooks config                      | inheritable |
| `markdown-lint.cjs`           | JavaScript | 19-rule pre-conversion markdown validator | inheritable |
| `md-scaffold.cjs`             | JavaScript | Markdown template scaffolder              | inheritable |
| `md-to-eml.cjs`               | JavaScript | Markdown to RFC 5322 email (.eml)         | inheritable |
| `md-to-html.cjs`              | JavaScript | Markdown to standalone HTML page          | inheritable |
| `md-to-word.cjs`              | JavaScript | Markdown to Word conversion               | inheritable |
| `nav-inject.cjs`              | JavaScript | Cross-document navigation injection       | inheritable |
| `new-skill.cjs`               | JavaScript | Scaffold new skill trifecta (CJS)         | inheritable |
| `new-skill.ps1`               | PowerShell | Scaffold new skill trifecta               | inheritable |
| `normalize-paths.ps1`         | PowerShell | Path consistency fixes                    | inheritable |
| `pptxgen-cli.ts`              | TypeScript | PowerPoint generation                     | inheritable |
| `session-name.cjs`            | JavaScript | Generate session names from context       | inheritable |
| `sync-architecture.cjs`       | JavaScript | Master to Heir sync                       | master-only |
| `validate-skills.cjs`         | JavaScript | Skill file validation (CJS)               | inheritable |
| `validate-skills.ps1`         | PowerShell | Skill file validation                     | inheritable |
| `validate-synapses.cjs`       | JavaScript | Synapse target validation (CJS)           | inheritable |
| `validate-synapses.ps1`       | PowerShell | Synapse target validation                 | inheritable |

### Shared Modules (`shared/`)

Reusable libraries consumed by multiple muscles via `require()` or ESM `import`.

| Module                      | Purpose                                              |
| --------------------------- | ---------------------------------------------------- |
| `index.mjs`                 | ESM bridge re-exporting all CJS modules              |
| `converter-config.cjs`      | Config loader with `.converter.json` walk-up         |
| `data-uri.cjs`              | Base64 data URI encode/decode, file download         |
| `markdown-preprocessor.cjs` | LaTeX to Unicode, callouts, checkboxes, validation   |
| `mermaid-pipeline.cjs`      | Mermaid render, validate, create, brand palette      |
| `prompt-preprocessor.cjs`   | Replicate prompt processing, trait injection         |
| `replicate-core.cjs`        | Replicate API init, batch exec, cost, model registry |
| `svg-pipeline.cjs`          | SVG creation, validation, PNG conversion             |

### Lua Filters (`lua-filters/`)

Pandoc Lua filters applied during Word/PDF conversion.

| Filter                 | Purpose                        |
| ---------------------- | ------------------------------ |
| `caption-labels.lua`   | Figure/table caption numbering |
| `keep-headings.lua`    | Preserve heading formatting    |
| `word-table-style.lua` | Word-specific table styling    |

### Hook Muscles (`hooks/`)

Pre/post action hooks for chat agent lifecycle (22 scripts). See `.github/hooks.json` for registry.

| Hook                            | Trigger        | Purpose                                     |
| ------------------------------- | -------------- | ------------------------------------------- |
| `session-start.cjs`             | session.start  | Context bootstrap, profile loading          |
| `stop.cjs`                      | session.stop   | Cleanup, summary, final saves               |
| `pre-tool-use.cjs`              | pre.tool       | Validation, safety checks                   |
| `post-tool-use.cjs`             | post.tool      | Logging, outcome tracking                   |
| `pre-compact.cjs`               | pre.compact    | State preservation before context shrink    |
| `subagent-context.cjs`          | subagent.start | Context injection for delegation            |
| `subagent-stop.cjs`             | subagent.stop  | Result capture, return routing              |
| `auto-commit-suggest.cjs`       | post.tool      | Suggest git commits after file changes      |
| `breaking-change-detector.cjs`  | post.tool      | Detect breaking API/interface changes       |
| `builder-post-tool-use.cjs`     | post.tool      | Builder agent implementation tracking       |
| `decision-journal.cjs`          | post.tool      | Log architectural decisions                 |
| `documentarian-post-tool-use.cjs` | post.tool    | Documentarian agent doc sync tracking       |
| `output-secret-scan.cjs`        | post.response  | Scan output for leaked secrets              |
| `prompt-safety-gate.cjs`        | pre.response   | Pre-response safety validation              |
| `rai-response-audit.cjs`        | post.response  | Post-response RAI audit                     |
| `rai-session-safety.cjs`        | session.start  | Session-level RAI monitoring                |
| `researcher-session-start.cjs`  | session.start  | Researcher agent research context setup     |
| `researcher-stop.cjs`           | session.stop   | Researcher agent findings consolidation     |
| `synapse-weight-update.cjs`     | post.tool      | Update synapse weights from usage           |
| `targeted-test-runner.cjs`      | post.tool      | Run tests related to changed files          |
| `validator-pre-tool-use.cjs`    | pre.tool       | Validator agent adversarial checks          |
| `validator-session-start.cjs`   | session.start  | Validator agent QA context setup            |

## Language Selection

### When to Use Each

| Language         | Best For                                        | Example Muscles                                 |
| ---------------- | ----------------------------------------------- | ----------------------------------------------- |
| **Node.js (JS)** | Complex transforms, JSON manipulation, npm libs | `sync-architecture.cjs`, `gamma-generator.cjs`  |
| **TypeScript**   | CLI tools with nice UX, type-safe APIs          | `dream-cli.ts`, `pptxgen-cli.ts`                |
| **PowerShell**   | Windows-specific automation, legacy scripts     | `validate-*.ps1`, `brain-qa.ps1`, `audit-*.ps1` |
| **Bash / Zsh**   | macOS/Linux quick scripts, CI pipelines         | `*.sh` (future)                                 |

### Quick Decision Guide

```
Cross-platform automation → Node.js (.cjs)
Validation / audit        → Node.js (.cjs) preferred, or shell script
JSON/Config manipulation  → Node.js
CLI with user interaction → TypeScript
npm library required      → Node.js
Quick macOS script        → Bash / Zsh (.sh)
Quick Windows script      → PowerShell (.ps1)
```

> **Note**: Prefer Node.js for any script that heirs or macOS/Linux users need to run.
> PowerShell muscles are being ported to Node.js for cross-platform parity (v7.0.0).

## Inheritance Model

Controlled by `inheritance.json` — each muscle declares its own inheritance:

```json
{
  "brain-qa.ps1": {
    "inheritance": "master-only",
    "description": "32-phase brain QA validation (master-only, full phases)",
    "referencedBy": ["brain-qa"]
  },
  "dream-cli.ts": {
    "inheritance": "inheritable",
    "description": "CLI wrapper for dream/neural maintenance outside VS Code",
    "referencedBy": ["dream-state-automation"]
  }
}
```

- **master-only**: Scripts that only make sense in Master Alex context
- **inheritable**: Scripts that heirs need for their own operation

## Adding New Muscles

1. Create script in `.github/muscles/`
2. Add to `inheritance.json` (choose inheritance type)
3. Update referencing memory files (skills/instructions/prompts)
4. Add to `TRIFECTA-CATALOG.md` if part of a trifecta
5. Run `npm run sync-architecture` to distribute to heirs
6. Test from heir context if inheritable

## Naming Convention

```
{action}-{target}.{ext}

Examples:
- validate-skills.ps1    → Validates skill files
- sync-architecture.cjs   → Syncs architecture to heirs
- dream-cli.ts           → CLI for dream protocol
- gamma-generator.cjs    → Generates Gamma slides
```

## Invocation

From Master Alex root:
```bash
# PowerShell muscles
pwsh -File .github/muscles/validate-skills.ps1

# Node.js muscles
node .github/muscles/sync-architecture.cjs

# TypeScript muscles (via tsx)
npx tsx .github/muscles/dream-cli.ts
```

From heir via npm scripts:
```bash
npm run sync-architecture
npm run dream
npm run validate-skills
```

### Special Requirements

| Muscle                  | Requirement                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| `md-to-word.cjs`        | Requires **pandoc**, **mmdc** (mermaid-cli), **jszip**, optional svgexport    |
| `md-to-html.cjs`        | Requires **pandoc** and shared modules; optional **mmdc** for `--mermaid-png` |
| `md-to-eml.cjs`         | Requires **pandoc** and shared modules                                        |
| `docx-to-md.cjs`        | Requires **pandoc**                                                           |
| `pptxgen-cli.ts`        | **Must run from heir directory** -- needs heir's node_modules for pptxgenjs   |
| `sync-architecture.cjs` | Must run from repo root (uses `npm run sync-architecture`)                    |
| `gamma-generator.cjs`   | Requires `GAMMA_API_KEY` env var; optional Playwright for export              |
| `svg-pipeline.cjs`      | Requires Inkscape, rsvg-convert, or ImageMagick for SVG to PNG                |

```bash
# pptxgen-cli.ts example (run from heir context)
cd platforms/vscode-extension
npx tsx ../../.github/muscles/pptxgen-cli.ts --help
```

---

*Muscles are the motor cortex of Alex's cognitive architecture — they execute what memory encodes.*
