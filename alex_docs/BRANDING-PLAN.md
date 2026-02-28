# Branding Consistency Plan

> **Objective**: Apply the CorreaX design language uniformly across all Alex properties — READMEs, documentation, banners, and UI.
>
> **Authority**: `alex_docs/DK-correax-brand.md` (design tokens + components) · `AlexLearn/business/BRANDING.md` (brand strategy)
>
> **Date**: February 28, 2026
> **Status**: Active

---

## 1. Current State Audit

### Properties Inventory

| Property | Repo | README Banner | Logo | Color Alignment | Banner System | Status |
|----------|------|---------------|------|-----------------|---------------|--------|
| **Master Alex** (extension) | Alex_Plug_In | `banner.svg` via GitHub raw URL | `logo.svg` in vscode-extension/assets | Partial — webviewStyles.ts has CorreaX tokens, but older brand colors still in code | 6 concept banners in assets/ | 🟡 Mixed |
| **LearnAlex** (website) | AlexLearn | `readme.svg` in assets/banners/ | `logo.svg` in root + website/public/ | ✅ Full — live site uses CorreaX indigo palette | 21 SVG banners (study guides, business docs) | ✅ Aligned |
| **Extensions** (monorepo) | Extensions | `banner-extensions.svg` in brand/logos/ | `logo.svg` in brand/logos/ | ❌ Old — brand/README.md references Azure Blue `#0078d4` as gradient, "White Background" golden rules | Per-extension banner.png files (16 extensions) | 🔴 Outdated |
| **Global Knowledge** | Alex-Global-Knowledge | `banner.svg` in assets/ | `logo.svg` + `logo-space-station.svg` in assets/ | ❓ Unknown — needs visual audit | Single banner | 🟡 Unverified |

### Key Findings

1. **LearnAlex** is the gold standard — 21 branded SVG banners, live CSS using CorreaX tokens, full dark-mode design system
2. **Extensions** brand guide (1,469 lines) is the most outdated — still references Azure Blue `#0078d4` gradient logo, "white background first" rule conflicts with CorreaX dark-mode-first approach
3. **Master Alex** has partial alignment — `webviewStyles.ts` DESIGN_TOKENS has CorreaX colors, but `brand-asset-management` SKILL.md still references older orange/blue palette
4. **Global Knowledge** hasn't been visually audited since the CorreaX rebrand
5. **Individual extension banners** (16 `.png` files) were AI-generated before the CorreaX palette existed — likely mismatched

---

## 2. Design Language Authority

**Single source of truth**: `alex_docs/DK-correax-brand.md`

All properties must reference this file for:

| Decision | DK Section | Value |
|----------|------------|-------|
| Background color | §2 Core Palette | `#0f172a` (dark) / `#1e293b` (card) |
| Primary accent | §2 Accent Assignment | Indigo `#6366f1` |
| Secondary accent | §2 Accent Assignment | Teal `#0d9488` |
| Tertiary accent | §2 Accent Assignment | Rose `#f43f5e` |
| Quaternary accent | §2 Accent Assignment | Coral `#f97316` |
| Font stack | §3 Typography | `'Segoe UI', system-ui, -apple-system, sans-serif` |
| Title weight | §3 Type Scale | `font-weight: 300` (light, not bold) |
| Series label | §3 Series Label | 10px / 600 / 5px letter-spacing / uppercase |
| Banner pattern | §4 The Banner | Accent bar + ghost watermark + series label |
| Prose max-width | §8 Prose | `820px` centered |
| Primary CTA | §7 Buttons | Indigo bg, white text, 700 weight |

---

## 3. Workstreams

### WS-1: README Banners (All Repos)

**Goal**: Every repo README uses a CorreaX-branded SVG banner with consistent visual language.

| Repo | Current Banner | Action | Priority |
|------|---------------|--------|----------|
| Master Alex | `banner.svg` — unknown visual age | Audit; regenerate if not CorreaX-compliant | High |
| AlexLearn | `readme.svg` — CorreaX-branded | ✅ Verify still matches DK | Low |
| Extensions | `banner-extensions.svg` — unknown | Audit; likely needs regeneration | High |
| Global Knowledge | `banner.svg` — unknown | Audit; regenerate if needed | Medium |

**Banner spec** (from DK §4):
- Dark background (`#0f172a` or `#1e293b`)
- 4px left accent bar in property's accent color
- Ghost "ALEX" watermark at 3% opacity
- Series label (10px, 600 weight, 5px letter-spacing, uppercase)
- Title at 2.25rem equivalent, weight 300
- Aspect ratio: ultra-wide (1200×300 recommended)

**Deliverable**: 4 SVG banners (one per repo) following the identical visual pattern with property-specific accent colors and titles.

---

### WS-2: Extensions Brand Guide Overhaul

**Goal**: Align `Extensions/brand/README.md` (1,469 lines) with the CorreaX design language.

**Current problems**:
- "5 Golden Rules" mandate white backgrounds — conflicts with CorreaX dark-first
- Logo gradient uses Azure Blue `#0078d4 → #005a9e` — should reference CorreaX sky blue or indigo
- No reference to `DK-correax-brand.md` or the CorreaX design token system
- Banner specs don't mention the signature accent bar + watermark + series label pattern
- Typography section likely doesn't match DK type scale

**Actions**:
1. Replace "White Background First" rule with "Dark-First, Light-Compatible"
2. Update logo gradient to CorreaX sky blue (`#38bdf8 → #0284c7`)
3. Add DK-correax-brand.md as the CSS/token authority
4. Update banner spec to include accent bar + watermark + series label anatomy
5. Align typography to DK §3 type scale
6. Add CorreaX palette table (indigo, teal, rose, coral) alongside existing surface colors
7. Keep Extensions-specific sections (per-extension icons, marketplace screenshots) but brand-align them

**Priority**: High — this is the most drifted document

---

### WS-3: Individual Extension Banners

**Goal**: Regenerate the 16 extension banner images using the CorreaX palette.

**Current state**: Each extension has a `banner.png` (likely AI-generated with inconsistent palettes).

**Published extensions needing banner audit** (9):
| Extension | Banner File | Marketplace Impact |
|-----------|-------------|-------------------|
| Hook Studio | `banner.png` | Live on Marketplace |
| CX Workspace Watchdog | `banner.png` | Live on Marketplace |
| MCP App Starter | `banner.png` | Live on Marketplace |
| Knowledge Decay Tracker | `banner.png` | Live on Marketplace |
| Brandfetch Logo Fetcher | `banner.png` | Live on Marketplace |
| AI Voice Reader | `banner.png` | Live on Marketplace |
| CX SecretGuard | `banner.png` | Live on Marketplace |
| CX Focus Timer | `banner.png` | Publish pending |
| CX Markdown to Word | `banner.png` | Publish pending |

**Unpublished extensions** (7): dev-wellbeing, pptx-builder, replicate-image-studio, mermaid-diagram-pro, svg-toolkit, svg-to-png, gamma-slide-assistant

**Banner regeneration spec**:
- Use CorreaX dark background (`#0f172a`)
- Extension-specific accent from the CorreaX palette (assign per extension category)
- Include series label: "ALEX EXTENSIONS" or "CORREAX · [CATEGORY]"
- Ghost "CX" or "ALEX" watermark at 3% opacity
- Format: SVG source → PNG export (1200×300, also 128px icon where needed)
- Use `ai-generated-readme-banners` skill for generation

**Priority**: Medium — visual impact is high but requires batch generation workflow

---

### WS-4: Master Alex Extension UI Audit

**Goal**: Ensure all VS Code webview components use CorreaX design tokens consistently.

**Audit targets**:

| File | Component | Current State | Action |
|------|-----------|---------------|--------|
| `webviewStyles.ts` | DESIGN_TOKENS | ✅ Has CorreaX `colors` object (10 tokens) | Verify completeness |
| `welcomeView.ts` | Header banner | ✅ Recently updated (f1142e2) with accent bar + watermark | Verify matches DK §4 |
| `personaDetection.ts` | Persona accent colors | 🟡 2 of 6 aligned (Researcher → teal, Writer → coral) | Complete alignment per DK §13 |
| `brand-asset-management/SKILL.md` | Brand color references | 🔴 References old blue/orange | Update to CorreaX palette |
| Sidebar panels | Settings, onboarding, etc. | ❓ Need audit | Check token usage |
| Premium feature panels | Global Knowledge, etc. | ❓ Need audit | Check CorreaX compliance |

**Priority**: High — user-facing UI in the published extension

---

### WS-5: Documentation Visual Consistency

**Goal**: Ensure internal docs follow CorreaX visual conventions.

**Scope**:
- Mermaid diagrams across all repos should use the DK §12 theme (dark, indigo borders, teal secondary)
- Markdown tables, headings, and code blocks should follow consistent formatting
- Architecture diagrams in `alex_docs/architecture/` should use CorreaX palette
- README badge colors should use CorreaX-aligned shields.io colors

**Actions**:
1. Create a Mermaid theme snippet that can be copy-pasted into any diagram
2. Audit `alex_docs/architecture/` diagrams for palette compliance
3. Standardize badge colors: indigo `#6366f1` for primary, teal `#0d9488` for secondary
4. Ensure every `alex_docs/` major file has a consistent header format

**Priority**: Low — documentation-internal, not user-facing

---

### WS-6: Global Knowledge Repo Brand Refresh

**Goal**: Bring `Alex-Global-Knowledge` visual presentation in line with CorreaX.

**Actions**:
1. Audit `banner.svg` and `logo.svg` against CorreaX palette
2. Regenerate banner if using old colors
3. Update README header style to match the LearnAlex pattern (series label, accent)
4. Verify `logo-space-station.svg` (premium branding) uses CorreaX tokens

**Priority**: Medium — smaller repo, but visible in documentation and README links

---

## 4. Execution Order

```
Phase 1 — Foundation (This Sprint)
├── WS-4: Master Alex UI audit + fix persona colors + SKILL.md update
├── WS-1: Audit all 4 repo README banners, regenerate non-compliant ones
└── WS-2: Begin Extensions brand guide overhaul (replace golden rules + palette)

Phase 2 — Propagation (Next Sprint)
├── WS-2: Complete Extensions brand guide alignment
├── WS-3: Regenerate individual extension banners (batch of 16)
└── WS-6: Global Knowledge banner refresh

Phase 3 — Polish (Maintenance)
├── WS-5: Documentation diagrams + badge standardization
├── Cross-repo verification pass
└── Add brand compliance check to dream protocol
```

---

## 5. Acceptance Criteria

A property is "brand-aligned" when:

- [ ] README banner uses CorreaX dark background + accent bar + series label pattern
- [ ] Logo/icon references the current CorreaX logo (sky blue gradient, not Azure blue)
- [ ] CSS/design tokens match `DK-correax-brand.md` §2 palette exactly
- [ ] Typography follows DK §3 (Segoe UI stack, 300-weight titles, 10px series labels)
- [ ] Primary CTAs use `#6366f1` (indigo), not older blue/orange
- [ ] Mermaid diagrams use DK §12 theme variables
- [ ] Badge colors use CorreaX-aligned hex values
- [ ] No references to deprecated color values (`#ff6b35` thrust orange, old `#0078d4` branding gradient)

---

## 6. Out of Scope

- www.correax.com website design (separate project, not in this workspace)
- AIRS platform UI (hosted separately, follows its own sub-brand)
- Amazon book cover design (publisher domain)
- VS Code Marketplace page CSS (controlled by Microsoft)

---

## 7. Dependencies

| Dependency | Impact | Mitigation |
|------------|--------|------------|
| AI banner generation (Replicate API key) | WS-1, WS-3 need generated banners | Can create SVG banners manually if API unavailable |
| Extension republishing (Marketplace rate limits) | WS-3 requires republishing 9 extensions | Batch in groups of 3, space by 24 hours |
| `DK-correax-brand.md` stability | All workstreams reference this | It's now in Master Alex — changes go through meditation |

---

## 8. Tracking

Update this section as workstreams complete:

| Workstream | Status | Last Updated |
|------------|--------|--------------|
| WS-1: README Banners | Not Started | — |
| WS-2: Extensions Brand Guide | Not Started | — |
| WS-3: Extension Banners | Not Started | — |
| WS-4: Master Alex UI | Not Started | — |
| WS-5: Documentation | Not Started | — |
| WS-6: Global Knowledge | Not Started | — |
