# Alex Muscles

> **Muscles** are execution scripts that Alex's memory files reference — the "motor cortex" that turns declarative knowledge into action.

## Neuroanatomical Mapping

| Component    | Brain Analog                  | Implementation                  |
| ------------ | ----------------------------- | ------------------------------- |
| Memory Files | Declarative/Procedural Memory | `.instructions.md`, `SKILL.md`  |
| **Muscles**  | **Motor Cortex → Muscles**    | Scripts that execute procedures |

Memory files define *what* and *how*; muscles *do*.

## Current Inventory

| Script                        | Language   | Lines | Purpose                      | Inheritance |
| ----------------------------- | ---------- | ----- | ---------------------------- | ----------- |
| `audit-master-alex.ps1`       | PowerShell | 432   | 22-point pre-release audit   | master-only |
| `brain-qa.ps1`                | PowerShell | 1273  | 32-phase deep validation     | master-only |
| `brain-qa-heir.ps1`           | PowerShell | 840   | 25-phase heir validation     | inheritable |
| `build-extension-package.ps1` | PowerShell | 295   | VSIX packaging               | master-only |
| `dream-cli.ts`                | TypeScript | 116   | Neural maintenance CLI       | inheritable |
| `fix-fence-bug.ps1`           | PowerShell | 189   | Detect/fix VS Code fence bug | master-only |
| `gamma-generator.js`          | JavaScript | 777   | Markdown → Gamma slides      | inheritable |
| `normalize-paths.ps1`         | PowerShell | 194   | Path consistency fixes       | inheritable |
| `pptxgen-cli.ts`              | TypeScript | 136   | PowerPoint generation        | inheritable |
| `sync-architecture.js`        | JavaScript | 771   | Master → Heir sync           | master-only |
| `validate-skills.ps1`         | PowerShell | 113   | Skill file validation        | inheritable |
| `validate-synapses.ps1`       | PowerShell | 154   | Synapse target validation    | inheritable |

## Language Selection

### When to Use Each

| Language         | Best For                                        | Example Muscles                                 |
| ---------------- | ----------------------------------------------- | ----------------------------------------------- |
| **PowerShell**   | File scanning, validation, audits, reporting    | `validate-*.ps1`, `brain-qa.ps1`, `audit-*.ps1` |
| **Node.js (JS)** | Complex transforms, JSON manipulation, npm libs | `sync-architecture.js`, `gamma-generator.js`    |
| **TypeScript**   | CLI tools with nice UX, type-safe APIs          | `dream-cli.ts`, `pptxgen-cli.ts`                |

### Quick Decision Guide

```
Validation/Audit task     → PowerShell
JSON/Config manipulation  → Node.js
CLI with user interaction → TypeScript
npm library required      → Node.js
Windows-only quick script → PowerShell
Cross-platform critical   → Node.js
```

## Inheritance Model

Controlled by `inheritance.json`:

```json
{
  "master-only": ["audit-master-alex.ps1", "brain-qa.ps1", "build-extension-package.ps1", "sync-architecture.js"],
  "inheritable": ["brain-qa-heir.ps1", "dream-cli.ts", "gamma-generator.js", ...]
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
- sync-architecture.js   → Syncs architecture to heirs
- dream-cli.ts           → CLI for dream protocol
- gamma-generator.js     → Generates Gamma slides
```

## Invocation

From Master Alex root:
```powershell
# PowerShell muscles
pwsh -File .github/muscles/validate-skills.ps1

# Node.js muscles
node .github/muscles/sync-architecture.js

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

| Muscle                 | Requirement                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `pptxgen-cli.ts`       | **Must run from heir directory** — needs heir's node_modules for pptxgenjs |
| `sync-architecture.js` | Must run from repo root (uses `npm run sync-architecture`)                 |
| `gamma-generator.js`   | Requires Playwright (`npm install playwright` in heir)                     |

```powershell
# pptxgen-cli.ts example (run from heir context)
cd platforms/vscode-extension
npx tsx ../../.github/muscles/pptxgen-cli.ts --help
```

---

*Muscles are the motor cortex of Alex's cognitive architecture — they execute what memory encodes.*
