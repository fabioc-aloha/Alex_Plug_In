# Brand Asset Management

**Purpose**: Procedural memory for Alex brand asset deployment and maintenance
**Created**: 2026-02-06 (Meditation session - branding rebrand consolidation)

## Brand Hierarchy

| Level | Brand | Symbol | Usage |
|-------|-------|--------|-------|
| **Parent** | CorreaX | C split X mark | Footer attribution, legal |
| **Product** | Alex | A Negative Space Rocket | All Alex-specific assets |
| **Platform** | Per-heir | Logo variants | VS Code, M365, GitHub |

## Core Brand Elements

| Element | Value | Status |
|---------|-------|--------|
| **Tagline** | "Strap a Rocket to Your Back" | ✅ LOCKED |
| **Subtitle Template** | "Take Your [NOUN] to New Heights" | ✅ LOCKED |
| **Primary Icon** | `$(rocket)` codicon | ✅ LOCKED |
| **Colors** | Azure blue (#0078d4) + thrust orange (#ff6b35) | ✅ LOCKED |

## Persona Priority (by audience size)

1. CODE → 2. LEARNING → 3. CAREER → 4. CONTENT → 5. THESIS
6. RESEARCH → 7. WRITING → 8. PROJECTS → 9. DATA → 10. INFRASTRUCTURE

## Asset Locations

### Banners

| Location | File | Type | Purpose |
|----------|------|------|---------|
| `.github/assets/banner.svg` | Animated | 8.62 KB | GitHub READMEs |
| `platforms/vscode-extension/.github/assets/banner.svg` | Animated | 8.62 KB | Extension GitHub README |
| `platforms/vscode-extension/assets/banner.svg` | Static | 3.42 KB | Marketplace (compatibility) |
| `platforms/vscode-extension/assets/banner.png` | Static | 204 KB | Fallback PNG |
| `assets/banner.png` | Static | 204 KB | Legacy/external references |

### Logos

All logos use 30° rotation for dynamic launch angle.

| Location | File | Size | Purpose |
|----------|------|------|---------|
| `platforms/vscode-extension/assets/logo.svg` | 32x32 | 1.04 KB | Extension icon source (30° rotation) |
| `platforms/vscode-extension/assets/logo-mono.svg` | 24x24 | 0.64 KB | Activity bar (currentColor, 30° rotation) |
| `platforms/vscode-extension/assets/icon.png` | 128x128 | 3.58 KB | Marketplace icon |
| `platforms/m365-copilot/appPackage/color.png` | 192x192 | 10.61 KB | Teams color icon |
| `platforms/m365-copilot/appPackage/outline.png` | 32x32 | 1.20 KB | Teams outline icon |
| `alex_docs/marketing/logo-concepts/correa-x.svg` | 32x32 | - | Parent brand asset |

## GK Premium Branding (v5.0)

**Metaphor Evolution**: Rocket strapped to back → Docked at space station

| Tier | Symbol | Meaning |
|------|--------|---------|
| **Standard** | A Negative Space Rocket | Individual project acceleration |
| **Premium (GK)** | Space Station + Docked Rocket | Cross-project knowledge hub |

### GK Assets

| Asset | Location | Status |
|-------|----------|--------|
| **Banner** | `alex_docs/marketing/banner-concepts/gk-space-station.svg` | ✅ SELECTED |
| **Logo** | `alex_docs/marketing/logo-concepts/gk-space-station-logo.svg` | ✅ SELECTED |
| **GK Repo** | `Alex-Global-Knowledge/assets/banner.svg` | ✅ DEPLOYED |

### GK Brand Elements

| Element | Value |
|---------|-------|
| **Tagline** | "Your MISSION CONTROL for Cross-Project Wisdom" |
| **Colors** | Azure + orange + **sync green (#00ff88)** |
| **Status Badge** | "DOCKED & SYNCED" |
| **Feature Pills** | Patterns, Insights, Synced, Shareable |

### Concept Candidates (6 variations)

See `alex_docs/marketing/MARKETING-PLAN.md` → GK Banner Candidates table.

## Platform-Specific Guidelines

### GitHub (Animated SVG Supported)
- Use `.github/assets/banner.svg` (animated rotating nouns)
- Animation: 20s cycle, 10 personas, crossfade pattern
- Tagline displays in banner itself

### VS Code Marketplace (Static Required)
- Use `assets/banner.png` (static CODE variant)
- Icon: `icon.png` (A Negative Space Rocket)
- Description: "Strap a rocket to your back..."

### M365 Teams (Static, Specific Sizes)
- `color.png`: 192x192 (A Negative Space Rocket, full color)
- `outline.png`: 32x32 (Monochrome rocket silhouette)
- `docs/index.html`: Static PNG for iframe preview

## PNG Generation

Generate PNGs from SVGs using sharp-cli:
```powershell
npx sharp-cli --input source.svg --output output.png -f png --density 150
```

The `--density 150` flag ensures crisp text rendering.

## Synapses

- [MARKETING-PLAN.md] (strong, reference, bidirectional) — Brand decisions source of truth
- [release-management.instructions.md] (moderate, workflow, incoming) — Asset verification during release
- [heir-skill-promotion.instructions.md] (weak, reference, outgoing) — Heir branding alignment
- [GI-premium-tier-visual-metaphor-pattern-2026-02-06.md] (strong, pattern, outgoing) — Tiered branding pattern (Global Knowledge)
