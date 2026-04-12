# Build Pipeline Diagnostic

## Overview

The Alex extension build pipeline is a sequential chain orchestrated by npm scripts, with automated quality gates that block packaging if invariants are violated.

---

## Build Chain

```
npm run package
  └── vscode:prepublish (automatic npm lifecycle hook)
        ├── 1. sync-architecture    → Master .github/ → Heir .github/
        ├── 2. clean                → Remove dist/ artifacts
        ├── 3. quality-gate         → 8 automated validation checks
        ├── 4. check-types          → tsc --noEmit (type checking only)
        └── 5. esbuild              → Bundle to dist/extension.js
```

**Key principle**: `quality-gate` runs BEFORE compilation. If any gate fails, packaging is blocked — no VSIX is produced.

---

## npm Scripts (from extension `package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `compile` | `npm run check-types && node esbuild.js` | Full compile (types + bundle) |
| `check-types` | `tsc --noEmit` | TypeScript type checking (no output) |
| `watch` | `npm-run-all -p watch:*` | Development watcher |
| `package` | `npm run vscode:prepublish` | Production package |
| `vscode:prepublish` | Chain: sync → clean → quality-gate → compile | Pre-publish lifecycle |
| `quality-gate` | `node scripts/quality-gate.cjs` | 8 automated checks |
| `clean` | Remove `dist/` | Clean build artifacts |
| `lint` | `eslint src/` | Code linting |
| `test` | `node test/runTests.js` | Run tests |

---

## The 8 Quality Gates

All gates are implemented in `scripts/quality-gate.cjs` — a zero-dependency Node.js script using only `fs` and `path`.

| Gate | Name | What It Catches | Severity |
|------|------|-----------------|----------|
| 1 | **Encoding Integrity** | U+FFFD corruption from encoding-hostile toolchain operations | Fail |
| 2 | **Command Parity** | Orphaned commands (declared but no handler) and undeclared handlers | Fail |
| 3 | **Doc File Inclusion** | Source code references to files not packaged in VSIX | Fail |
| 4 | **Table Integrity** | Corrupted markdown tables in packaged documentation | Fail |
| 5 | **Walkthrough Sync** | Whitelisted docs missing from Master→Heir sync script | Fail |
| 6 | **Activation Index** | Skills missing from `memory-activation/SKILL.md` keyword index | Fail |
| 7 | **VSIX Size Budget** | Package exceeds 7 MB (warns at 5.5 MB) | Warn/Fail |
| 8 | **Skill Activation Index** | `audit-skill-activation-index.cjs` validates all skills are indexed | Fail |

**Design principles**:
- Cross-platform: Node.js `.cjs` (not PowerShell, not Bash)
- Zero dependencies: Only `fs` and `path`
- Fast: <2 seconds for 500+ files
- Actionable errors: File path, line number, and what to fix
- Exit code 1: Any `fail()` blocks the pipeline

**Origin**: v5.9.10 RCA — recurring regressions (broken emojis, orphan commands, missing VSIX files, corrupted tables) were caused by relying on a 325-line manual checklist. The quality gate encodes hard-won lessons into the build pipeline.

---

## sync-architecture.cjs

The synchronization script copies master `.github/` content to heir platforms at build time.

**What it does**:
1. Reads all files in master `.github/` (instructions, skills, prompts, agents, hooks)
2. Parses frontmatter for `inheritance` field
3. Filters out `master-only` files
4. Copies remaining files to `platforms/vscode-extension/.github/`
5. Copies to `platforms/m365-copilot/.github/` (if applicable)
6. Validates file counts match expectations
7. Reports any drift or missing files

**Inheritance filtering**:
```
inheritance: master-only      → NOT copied to heir
inheritance: heir:vscode      → Heir maintains own version (not overwritten)
inheritance: heir:m365        → M365 heir only
(no inheritance field)        → Default: inheritable, copied to all heirs
```

---

## VSIX Packaging

**Command**: `npx @vscode/vsce package`

**Size constraints**:
- Warn threshold: 5.5 MB
- Fail threshold: 7 MB
- Typical size: ~9-10 MB (recent versions)

**Critical `.vscodeignore` rules**:
- `.vscode/launch.json`, `.vscode/tasks.json`, `.vscode/mcp.json` — excluded (dev assets)
- `.vscode/settings.json`, `.vscode/markdown-light.css` — included (user assets)
- `src/` — excluded (source; only `dist/` ships)
- `test/` — excluded
- `node_modules/` — excluded (bundled by esbuild)

**The `.vscode/` dual-purpose problem** (learned 2026-02-01):
The `.vscode/` folder contains both development assets (should NOT ship) and user experience assets (SHOULD ship). Using `.vscode/**` in `.vscodeignore` would exclude everything, including user assets.

---

## Pre-Release Validation

Beyond the automated quality gate, release management requires:

1. **Step 0**: brain-qa (cognitive architecture health) — 33-phase validation
2. **Step 1**: Detect uncommitted changes via `get_changed_files`
3. **Step 2**: Assess version bump requirement (patch/minor/major)
4. **Step 3**: Generate changelog entry from changes
5. **Step 4**: Present findings to user
6. **Step 4.5**: Adversarial validation gate (Validator agent review)
7. **Definition of Done**: 8 criteria (builds clean, no dead code, counts match, F5 smoke test, version aligned, heir sync clean, no non-functional features, CHANGELOG documents delta)

---

## Muscles (Automation Scripts)

Located in `.github/muscles/`, these are executable scripts that perform "physical work":

| Script | Purpose |
|--------|---------|
| `brain-qa.cjs` | 33-phase cognitive architecture validation |
| `sync-architecture.cjs` | Master → Heir file synchronization |
| `audit-master-alex.ps1` | 22-check comprehensive audit |
| `validate-synapses.ps1` | Standalone synapse validation |
| `validate-skills.ps1` | Skill frontmatter and structure validation |
| `normalize-paths.ps1` | Normalize memory file paths |
| `audit-token-waste.cjs` | Automated token waste scanning |
| `gen-skill-catalog.cjs` | Generate SKILLS-CATALOG.md |
| `dream-cli.ts` | CLI wrapper for dream outside VS Code |
| `md-to-word.cjs` | Markdown to Word document conversion |
| `gamma-generator.cjs` | Gamma presentation generation |
| `build-extension-package.ps1` | Extension packaging with heir sync |

---

## CI/CD Status

**Current state**: No CI/CD pipeline observed. All builds and releases are manual:
- Developer runs `npm run package` locally
- Developer runs `npx vsce publish -p <PAT>` manually
- Quality gates run as part of the local build chain
- brain-qa runs as a manual pre-release step

**Implication**: The quality gate is the primary automated safety net. Without CI/CD, all quality assurance depends on the developer running the correct commands in the correct order.
