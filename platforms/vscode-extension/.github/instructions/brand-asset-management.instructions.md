---
description: "Brand asset deployment, visual identity guidelines, and logo management"
applyTo: "**/assets/**,**/*.svg,**/*.png,**/*.ico"
---

# Brand Asset Management — Enforcement Rules

Deep reference: `.github/skills/brand-asset-management/SKILL.md`

## Brand Hierarchy

| Level | Brand | Usage |
|-------|-------|-------|
| Company | CorreaX (CX mark) | Footer, legal, publisher |
| Product family | Alex | Product marks, messaging |
| Product/platform | Per-heir Alex | VS Code extension, M365, plugin |
| UI surface | Command Center, etc. | Icons, badges, tabs, avatars |

CorreaX = company brand. Alex = product brand. Command Center = UI surface, not a separate brand.
For Command Center micro-assets (16-24px), use `DK-correax-brand.md` — optimize for semantic clarity, not logo resemblance.

## Locked Brand Elements

| Element | Value | Status |
|---------|-------|--------|
| Tagline | "Strap a Rocket to Your Back" | LOCKED |
| Subtitle template | "Take Your [NOUN] to New Heights" | LOCKED |
| Primary icon | `$(rocket)` codicon | LOCKED |
| Colors | Azure blue (#0078d4) + thrust orange (#ff6b35) | LOCKED |
| Logo rotation | 30° (dynamic launch angle) | LOCKED |

## Asset Locations

| Asset | Location | Purpose |
|-------|----------|---------|
| Animated banner | `.github/assets/banner.svg` (8.62KB) | GitHub READMEs |
| Static banner | `assets/banner.svg` (3.42KB) | Marketplace |
| PNG fallback | `assets/banner.png` (204KB) | Non-SVG contexts |
| Logo | `assets/logo.svg` (32x32, 1.04KB) | Extension icon |
| Mono logo | `assets/logo-mono.svg` (24x24, 0.64KB) | Activity bar (currentColor) |
| Icon | `assets/icon.png` (128x128, 3.58KB) | Marketplace |

## Platform Rules

- **GitHub**: animated SVG with 20s rotation, 10 personas
- **VS Code Marketplace**: static PNG, `icon.png` for icon
- **M365 Teams**: `color.png` 192x192, `outline.png` 32x32

## PNG from SVG

```bash
npx sharp-cli --input source.svg --output output.png -f png --density 150
```

## Routing

- Full persona catalog, GK premium branding, heir positioning → load `brand-asset-management` skill
- AI image generation for persona images → `generate-persona-welcome-images.js`
- CorreaX UI token system → `DK-correax-brand.md`
