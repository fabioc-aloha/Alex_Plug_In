# CorreaX Brand & Design Language

**Domain**: Visual design system, color tokens, typography, component patterns, WCAG compliance
**Trigger**: design system, brand colors, CorreaX palette, typography, banner pattern, design tokens, color system, accent colors, CSS variables, brand identity, visual identity

## Quick Reference

The CorreaX design language defines the visual identity for all CorreaX products — LearnAlex website, Alex VS Code extension, AIRS platform, books, and marketing materials.

**Authoritative reference**: `alex_docs/DK-correax-brand.md` — the full design language with CSS implementations.

### Core Palette (from memory)

| Token | Hex | Role |
|-------|-----|------|
| `--bg` | `#0f172a` | Deep navy page background |
| `--bg-card` | `#1e293b` | Card/panel backgrounds |
| `--accent-indigo` | `#6366f1` | **Primary** — CTAs, buttons, default accent |
| `--accent-teal` | `#0d9488` | **Secondary** — study guides, AIRS, learning |
| `--accent-rose` | `#f43f5e` | **Tertiary** — warnings, destructive, energy |
| `--accent-coral` | `#f97316` | **Quaternary** — highlights, warm contexts |
| `--text` | `#f1f5f9` | Primary text (near white) |
| `--text-muted` | `#94a3b8` | Secondary text (slate) |
| `--border` | `#334155` | Default borders |

### Light Variants (for text on dark backgrounds)

| Token | Hex | Contrast on `--bg-card` |
|-------|-----|------------------------|
| `--accent-indigo-light` | `#818cf8` | 4.5:1 ✅ AA |
| `--accent-teal-light` | `#2dd4bf` | 7.0:1 ✅ AAA |
| `--accent-rose-light` | `#fb7185` | — |
| `--accent-coral-light` | `#fb923c` | — |

### Key Decisions

1. **Never use `#6366f1` as text on dark backgrounds** — fails WCAG AA. Use `#818cf8` (light variant) instead.
2. **Page titles are always light weight** — `font-weight: 300`, not bold.
3. **Series labels** — 10px / 600 weight / 5px letter-spacing / uppercase.
4. **The banner pattern** (accent bar + ghost watermark + series label) is the signature CorreaX component — use on every content page header.
5. **Prose max-width** — `820px` centered, with `h2` top-border separators.

### VS Code Extension Token Mapping

| CorreaX | VS Code Fallback |
|---------|-----------------|
| `--bg` | `--vscode-sideBar-background` |
| `--bg-card` | `--vscode-editor-widget-background` |
| `--text` | `--vscode-foreground` |
| `--text-muted` | `--vscode-descriptionForeground` |
| `--border` | `--vscode-panel-border` |
| `--accent-indigo` | `--vscode-button-background` |

### Brand Family

| Product | Color Context |
|---------|---------------|
| **CorreaX** (parent) | Sky Blue `#87CEEB` ← brand.correax.com |
| **LearnAlex** | Indigo `#6366f1` ← primary |
| **AIRS** | Azure Blue `#0078D4` ← enterprise |
| **Alex Extension** | Persona-driven (indigo default) |

### Persona → CorreaX Accent Alignment

| Persona | Hex | Maps to |
|---------|-----|---------|
| Developer | `#0078D4` | Microsoft blue (keep) |
| Architect | `#6366f1` | CorreaX indigo (aligned) |
| Researcher | `#0d9488` | CorreaX teal (aligned) |
| Technical Writer | `#f97316` | CorreaX coral (aligned) |

## Resources

For full CSS implementations, component anatomy, and the complete design checklist:
→ Read `alex_docs/DK-correax-brand.md`

For brand asset deployment, marketplace descriptions, and store listing patterns:
→ Use the `brand-asset-management` skill

For generating visual assets (banners, logos) using AI models:
→ Use the `ai-generated-readme-banners` skill
