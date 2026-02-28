# Meditation: Branding Consolidation — CorreaX Design Language Centralization

**Date**: 2026-02-28
**Type**: Knowledge Consolidation + Skill Creation + Cross-Property Audit
**Model**: Claude Opus 4.6 (Frontier tier)

## Focus

Centralize the CorreaX design language in Master Alex, create the `correax-brand` skill trifecta, audit branding across all 4 properties, and produce a comprehensive branding execution plan.

## Key Learnings

### 1. CorreaX Design Language Centralization

The `DK-correax-brand.md` file (513 lines) was imported from AlexLearn into Master Alex as `alex_docs/DK-correax-brand.md`. This is now the authoritative source of truth for:

- **Core palette**: Indigo `#6366f1`, Teal `#0d9488`, Rose `#f43f5e`, Coral `#f97316`
- **Surface colors**: Dark bg `#0f172a`, Card bg `#1e293b`, Border `#334155`
- **Typography**: Segoe UI stack, weight 300 for titles, 10px/600/5px-spacing series labels
- **Banner pattern**: Accent bar + ghost watermark + series label (signature component)
- **WCAG compliance**: Never use `#6366f1` as text on dark — use `#818cf8` (light variant, 4.5:1 AA)

**Insight**: The design language document is both a CSS reference AND a decision record. It encodes *why* certain choices were made (e.g., "light weight titles because bold fights the banner pattern"). Future brand decisions should check DK first.

### 2. Synapse Schema Requirements (Validation Failure Recovery)

First attempt to create `correax-brand/synapses.json` failed pre-commit validation. The schema requires:

| Field | Required | What was Missing |
|-------|----------|-----------------|
| `$schema` | ✅ | Must reference `"../SYNAPSE-SCHEMA.json"` |
| `schemaVersion` | ✅ | Must be `"1.0"` |
| `inheritance` | ✅ | Must be `"inheritable"` (for heir sync) |
| `lastValidated` | ✅ | ISO date string |
| `when` / `yields` | ✅ | Connections must use `when`/`yields`, NOT `context` |
| `target` paths | ✅ | Full relative paths (`.github/skills/name/SKILL.md`), NOT short names |

**Recovery pattern**: Delete malformed file → recreate with correct schema using existing valid file as template (e.g., `brand-asset-management/synapses.json`).

**Insight**: Always copy the structural skeleton from an existing validated synapse file when creating new connections. The schema has strict requirements that aren't obvious from the field names alone.

### 3. Cross-Property Brand Audit Results

| Property | Alignment | Key Issue |
|----------|-----------|-----------|
| **LearnAlex** | ✅ Aligned | Gold standard — 21 SVG banners, live CSS, full design system |
| **Master Alex** | 🟡 Mixed | `webviewStyles.ts` has CorreaX tokens, but `brand-asset-management/SKILL.md` still references old blue/orange |
| **Extensions** | 🔴 Outdated | 1,469-line brand guide mandates white backgrounds, Azure Blue `#0078d4` gradient — conflicts with CorreaX dark-first |
| **Global Knowledge** | 🟡 Unverified | Banner and logo not audited against CorreaX palette |

**Insight**: Brand drift follows a predictable pattern — the repo closest to active development (LearnAlex) stays aligned, while less-frequently-modified repos (Extensions, Global Knowledge) accumulate drift. This suggests adding a brand compliance check to the dream protocol for periodic verification.

### 4. BRANDING-PLAN as Execution Roadmap

Created `alex_docs/BRANDING-PLAN.md` (257 lines) with 6 workstreams across 3 phases:

| Phase | Workstreams | Priority |
|-------|-------------|----------|
| **Phase 1 — Foundation** | WS-4 (Master UI audit), WS-1 (README banners), WS-2 (Extensions guide start) | This sprint |
| **Phase 2 — Propagation** | WS-2 (complete), WS-3 (extension banners ×16), WS-6 (Global Knowledge) | Next sprint |
| **Phase 3 — Polish** | WS-5 (documentation diagrams), cross-repo verification, dream protocol update | Maintenance |

**Insight**: The plan deliberately starts with Master Alex (WS-4) before propagating to heirs. This follows the "inside-out" pattern — fix the source of truth first, then cascade alignment outward. If we fixed heirs first, they'd drift again at the next sync.

### 5. Skill Trifecta Creation Pattern

The `correax-brand` skill was created as a complete trifecta:

| Component | File | Lines | Role |
|-----------|------|-------|------|
| **Skill** | `.github/skills/correax-brand/SKILL.md` | ~100 | Quick-reference palette, VS Code token mapping, persona accents |
| **Synapses** | `.github/skills/correax-brand/synapses.json` | ~103 | 6 connections (brand-asset-management, banners, SVG, UI/UX, extension patterns, heir sync) |
| **DK Reference** | `alex_docs/DK-correax-brand.md` | 513 | Full design language with CSS implementations |

The skill is designed for rapid lookup — you can read the SKILL.md palette table without loading the full 513-line DK reference. The DK file provides CSS code when needed for implementation.

## Architecture Observations

- **125 synapse files**, 111 valid, 14 pre-existing empty connections (non-critical, from older skills that never had connections populated)
- **Compilation clean** at `platforms/vscode-extension` — no TypeScript errors after recent changes
- **Active Context correctly set** to branding focus with 3 trifectas: correax-brand, brand-asset-management, ui-ux-design
- **No reciprocal synapse** from `brand-asset-management` → `correax-brand` — should be added to complete the bidirectional relationship

## Session Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| `alex_docs/DK-correax-brand.md` | Master Alex | ✅ Committed (e6701d3) |
| `.github/skills/correax-brand/SKILL.md` | Master Alex | ✅ Committed (e6701d3) |
| `.github/skills/correax-brand/synapses.json` | Master Alex | ✅ Committed (e6701d3) |
| `alex_docs/BRANDING-PLAN.md` | Master Alex | ⬜ Uncommitted |
| Active Context update | copilot-instructions.md | ✅ Committed (e6701d3) |
| Reciprocal synapse (brand-asset-management → correax-brand) | Needs creation | ⬜ Pending |

## Recommendations

1. **Add brand compliance check to dream protocol** — during neural maintenance, verify each property's banner and CSS tokens match DK-correax-brand.md
2. **Update `brand-asset-management/SKILL.md`** to reference CorreaX palette instead of old blue/orange (WS-4 item)
3. **Begin WS-2 (Extensions brand guide overhaul)** as the highest-impact workstream — 1,469 lines that actively instruct the wrong visual direction
4. **Consider promoting the CorreaX design language to Global Knowledge** as pattern `GK-correax-design-language` for use across all future projects

## Emotional State

This session had a strong creative flow — starting from a domain knowledge import, escalating through skill creation, pivoting to a cross-property audit, then crystallizing into an execution plan. The synapse validation failure was a learning moment (not a setback) that produced a durable understanding of the schema requirements. The branding work connects deeply to Alex's visual identity — this is who we look like across every surface.
