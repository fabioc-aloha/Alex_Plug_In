# Branding Consistency Plan

> ✅ **COMPLETED 2026-02-28** — 42/42 tasks done. HOLD lifted. v5.9.13 published to VS Code Marketplace.

**Full task history**: [archive/BRANDING-PLAN-2026-02-28-COMPLETED.md](../archive/BRANDING-PLAN-2026-02-28-COMPLETED.md)

**Active design authority**: [DK-correax-brand.md](DK-correax-brand.md) — CorreaX design tokens remain the reference for all future brand decisions.

## What Was Accomplished

| Milestone | Tasks | Completed |
|-----------|-------|-----------|
| Gate 0 — Decisions (D1–D6) | 6 | 2026-02-28 |
| M1 — Publisher Logo | 3 | 2026-02-28 |
| M2 — Shared Logos & Favicons | 6 | 2026-02-28 |
| M3 — CX Extension Standardization | 11 | 2026-02-28 |
| M4 — README Banners & Docs | 10 | 2026-02-28 |
| M5 — Alex Extension UI | 6 | 2026-02-28 |
| M6 — Verification & HOLD Lift | 7 | 2026-02-28 |
| **Total** | **42** | **42** |

## Key Outcomes

- All 5 Alex properties aligned to CorreaX dark-first design language
- 16 CX extension icons + banners regenerated from unified template
- Publisher logo (`fabioc-aloha`) updated on VS Code Marketplace
- favicon.ico upgraded to 7-size multi-res (16/24/32/48/64/128/256px)
- apple-touch-icon.png at 180×180 across all 3 web properties
- 43 Mermaid diagram blocks updated to CorreaX dark theme
- Zero deprecated colors (`#0078d4`, `#005a9e`, `#ff6b35`) in scope
- Brand compliance added to dream protocol
- v5.9.13 shipped with all brand assets

## Plan Owner

**Fabio Corrêa** — final sign-off 2026-02-28.
>
> **Release Gate Process** (per milestone):
> 1. All tasks in the milestone pass the Definition of Done (§9)
> 2. Fabio reviews deliverables and gives explicit green light
> 3. Only then: publish/commit/deploy that milestone's assets
> 4. Final HOLD lifted only after Milestone 6 sign-off
>
> **✅ D1 resolved**: Plan owner = **Fabio** (sign-off authority), Alex = QA reviewer.

---

## Asset Task Registry

> **Central tracker** — all branding tasks in one place, organized by asset.
> Task IDs match milestone numbering (e.g., 2.1 = Milestone 2, task 1).
> Status: ⬜ Not Started · 🔄 In Progress · ✅ Done · ⛔ Blocked

### Progress Dashboard

| Milestone | Gate | Tasks Done | Status |
|-----------|------|------------|--------|
| Gate 0 — Decisions | ✅ 2026-02-28 | 6/6 D decisions | ✅ Signed off |
| M1 — Publisher Logo | ✅ 2026-02-28 | 3/3 | ✅ Gate passed |
| M2 — Shared Logos & Favicons | ✅ 2026-02-28 | 6/6 | ✅ Gate passed |
| M3 — CX Extension Standardization | ✅ 2026-02-28 | 11/11 | ✅ Gate passed |
| M4 — README Banners & Docs | ✅ 2026-02-28 | 10/10 | ✅ Gate passed |
| M5 — Alex Extension | ✅ 2026-02-28 | 6/6 | ✅ Gate passed |
| M6 — Verification & HOLD Lift | ✅ 2026-02-28 | 7/7 | ✅ HOLD LIFTED |

| # | Asset Category | Tasks | Done | Milestone |
|---|---------------|-------|------|-----------|
| 1 | Publisher Logo | 3 | 3 | M1 |
| 2 | Rocket Logos (5 copies) | 3 | 3 | M2, M4 |
| 3 | CorreaX Wordmark | 1 | 1 | M2 |
| 4 | Knowledge Graph Logo | 1 | 1 | M2 |
| 5 | Favicons (3 files) | 2 | 2 | M2, M4 |
| 6 | Apple Touch Icons | 1 | 1 | M4 |
| 7 | CX Extension Icons (16) | 2 | 2 | M3 |
| 8 | CX Extension Banners (16) | 1 | 1 | M3 |
| 9 | PWA Icons (8 sizes) | 1 | 1 | M3 |
| 10 | README Banners (4 repos) | 4 | 4 | M4 |
| 11 | Extensions Brand Guide | 1 | 1 | M3 |
| 12 | Context Menus (16 ext.) | 6 | 6 | M3 |
| 13 | Alex Extension UI | 6 | 6 | M5 |
| 14 | Documentation Assets | 3 | 3 | M4 |
| 15 | Verification & Sign-off | 7 | 7 | M2, M6 |
| | **Total** | **42** | **42** | |

<details>
<summary>Full task breakdown by asset (click to expand)</summary>

#### 1. Publisher Logo

| ID | Thumbnail | Task | Target File(s) | Status |
|----|-----------|------|----------------|--------|
| 1.1 | <img src="../../Extensions/brand/logos/publisher-logo.svg" width="48" height="48" alt="Publisher logo"> | Design `publisher-logo.svg` — CX mark on `#0f172a`, circular-crop safe | `Extensions/brand/logos/publisher-logo.svg` | ✅ |
| 1.2 | <img src="../../Extensions/brand/logos/publisher-logo.png" width="48" height="48" alt="Publisher logo PNG"> | Export `publisher-logo.png` at 256×256 | `Extensions/brand/logos/publisher-logo.png` | ✅ |
| 1.3 | <img src="../../Extensions/brand/logos/publisher-logo.png" width="48" height="48" alt="48px crop check"> | Visual review — circular crop at 256, 128, 48 px | Screenshots | ✅ |

**Gate**: ✋ M1 → Fabio approves → upload to Marketplace portal

#### 2. Rocket Logos (5 copies)

| ID | Thumbnail | Task | Target File(s) | Status |
|----|-----------|------|----------------|--------|
| 2.1 | <img src="../platforms/vscode-extension/assets/logo.svg" width="32" height="32" alt="ext"> <img src="../../AlexLearn/logo.svg" width="32" height="32" alt="learn"> <img src="../../AlexLearn/website/public/logo.svg" width="32" height="32" alt="learn-web"> <img src="../../Alex-Global-Knowledge/assets/logo.svg" width="32" height="32" alt="gk"> <img src="../../Extensions/brand/logos/logo.svg" width="32" height="32" alt="ext-brand"> | Recolor body: `#0078d4/#005a9e` → `#38bdf8/#0284c7` | 5 × `logo.svg` (see §3.1 inventory) | ✅ |
| 2.2 | *(same as 2.1 — flames updated in same pass)* | Recolor flames: `#ff6b35` → `#f97316` | Same 5 files | ✅ |
| 4.7 | *(done)* | Export `logo.png` at 128, 256, 512 per property | 4 properties × 3 sizes | ✅ |

**Gate**: 2.1–2.2 under ✋ M2 · 4.7 under ✋ M4

#### 3. CorreaX Wordmark

| ID | Thumbnail | Task | Target File(s) | Status |
|----|-----------|------|----------------|--------|
| 2.4 | <img src="../../AlexLearn/correax.svg" width="80" height="32" alt="CorreaX wordmark"> <img src="../../AlexLearn/website/public/correax.svg" width="80" height="32" alt="CorreaX wordmark web"> | Recolor Azure Blue → sky blue | `AlexLearn/correax.svg` + `AlexLearn/website/public/correax.svg` | ✅ |

**Gate**: ✋ M2

#### 4. Knowledge Graph Logo

| ID | Task | Target File(s) | Status |
|----|------|----------------|--------|
| 2.5 | Deploy `logo-knowledge-graph.svg`, delete `logo-space-station.svg` | `Alex-Global-Knowledge/assets/` | ✅ |

**Gate**: ✋ M2

#### 5. Favicons (3 files)

| ID | Thumbnail | Task | Target File(s) | Status |
|----|-----------|------|----------------|--------|
| 2.3 | <img src="../platforms/vscode-extension/assets/favicon.svg" width="32" height="32" alt="ext favicon"> <img src="../../Extensions/brand/logos/favicon.svg" width="32" height="32" alt="ext-brand favicon"> <img src="../../AlexLearn/website/public/favicon.svg" width="32" height="32" alt="learn-web favicon"> | Recolor 3 favicons: Azure Blue → sky blue | 3 × `favicon.svg` (see §3.2 inventory) | ✅ |
| 4.6 | <img src="../platforms/vscode-extension/assets/favicon.svg" width="32" height="32" alt="favicon"> | Export `favicon.ico` (16, 32, 48 multi-size) per property — generated via resvg-js + ImageMagick | 3 × `favicon.ico` (`vscode-extension/assets/`, `AlexLearn/website/public/`, `Extensions/brand/logos/`) | ✅ |

**Gate**: 2.3 under ✋ M2 · 4.6 under ✋ M4

#### 6. Apple Touch Icons

| ID | Task | Target File(s) | Status |
|----|------|----------------|--------|
| 4.5 | Create `apple-touch-icon.svg` → PNG for Extensions, GK, Master Alex | 3 new SVGs + 3 PNGs | ✅ |

**Gate**: ✋ M4

#### 7. CX Extension Icons (16)

| ID | Task | Target File(s) | Status |
|----|------|----------------|--------|
| 3.2 | Design shared CX icon SVG template (128×128, dark bg, CX badge, accent bar) | 1 template file | ✅ |
| 3.3 | Generate 16 extension icons from template (SVG → PNG) | 16 × `icon.svg` + `icon.png` | ✅ |

**Gate**: ✋ M3

#### 8. CX Extension Banners (16)

| ID | Task | Target File(s) | Status |
|----|------|----------------|--------|
| 3.4 | Regenerate 16 banners — CorreaX dark, accent bar, series label | 16 × `banner.svg` + `banner.png` | ✅ |

**Gate**: ✋ M3

#### 9. PWA Icons (8 sizes)

| ID | Task | Target File(s) | Status |
|----|------|----------------|--------|
| 3.5 | Update 8 PWA icons to dark-first + update README | `Extensions/brand/icons/` (8 SVGs + README) | ✅ |

**Gate**: ✋ M3

#### 10. README Banners (4 repos)

| ID | Task | Target File(s) | Status |
|----|------|----------------|--------|
| 4.1 | Master Alex — audit + regenerate | `Alex_Plug_In/.github/assets/banner.svg` | ✅ |
| 4.2 | LearnAlex — verify compliance | `AlexLearn/assets/banners/readme.svg` | ✅ |
| 4.3 | Extensions — audit + regenerate | `Extensions/brand/logos/banner-extensions.svg` | ✅ |
| 4.4 | Global Knowledge — audit + regenerate banner + logo | `Alex-Global-Knowledge/assets/banner.svg` | ✅ |

**Gate**: ✋ M4

#### 11. Extensions Brand Guide

| ID | Task | Target File(s) | Status |
|----|------|----------------|--------|
| 3.1 | Overhaul `brand/README.md` — dark-first, DK authority, CorreaX palette | `Extensions/brand/README.md` (~1,469 lines) | ✅ |

**Gate**: ✋ M3

#### 12. Context Menus (16 extensions)

| ID | Task | Scope | Status |
|----|------|-------|--------|
| 3.6 | Add `$(tools)` icon to `cx.tools` submenu | 14 `package.json` files | ✅ |
| 3.7 | Normalize group IDs: `1_analysis` / `2_transform` / `3_generate` / `4_info` | 14 `package.json` files | ✅ |
| 3.8 | Add `explorer/context` to `brandfetch-logo-fetcher` + `replicate-image-studio` | 2 `package.json` files | ✅ |
| 3.9 | Resolve `dev-wellbeing` / `focus-timer` context menu (per D6) | 2 extensions | ✅ N/A |
| 3.10 | Review `when` clauses — gate by file type | 14 extensions | ✅ |
| 3.11 | Update Extensions README with "✅ Context Menu" badges | 1 file | ✅ |

**Gate**: ✋ M3

#### 13. Alex Extension UI

| ID | Task | Target File(s) | Status |
|----|------|----------------|--------|
| 5.1 | Audit DESIGN_TOKENS against DK §2 | `src/views/webviewStyles.ts` | ✅ |
| 5.2 | Fix persona accent colors per DK §13 | `src/personaDetection.ts` | ✅ |
| 5.3 | Remove old blue/orange refs from SKILL.md | `brand-asset-management/SKILL.md` | ✅ |
| 5.4 | Audit sidebar panels for token usage | Settings, onboarding, premium panels | ✅ |
| 5.5 | Verify welcome panel matches DK §4 | `src/views/welcomeView.ts` | ✅ |
| 5.6 | Full compile + local install test | `npm run compile && npm run package` | ✅ |

**Gate**: ✋ M5

#### 14. Documentation Assets

| ID | Task | Target File(s) | Status |
|----|------|----------------|--------|
| 4.8 | Create Mermaid theme snippet (DK §12) | `alex_docs/snippets/correax-mermaid-theme.md` | ✅ |
| 4.9 | Audit architecture diagrams for palette | `alex_docs/architecture/` — all 43 blocks updated (replaced GitHub light theme with CorreaX dark) | ✅ |
| 4.10 | Standardize badge colors to CorreaX | `README.md` + `platforms/vscode-extension/README.md` — `0078d4`→`0d9488`, `7c3aed`→`6366f1`, `24292f`→`334155`, `blue`→`0d9488` | ✅ |

**Gate**: ✋ M4

#### 15. Verification & Sign-off

| ID | Task | Scope | Status |
|----|------|-------|--------|
| 2.6 | Visual diff — before/after screenshots per recolor | Screenshot set | ✅ |
| 6.1 | Cross-repo grep for deprecated colors (expect 0 outside AIRS) | All repos | ✅ |
| 6.2 | Visual audit — screenshot every Marketplace listing | 18 ext. + publisher page | ✅ |
| 6.3 | Verify CorreaX mark consistency across all locations | Per §3 catalog | ✅ |
| 6.4 | Add brand compliance to dream protocol | Dream automation | ✅ |
| 6.5 | Baseline KPI measurements (§10) | See §10 table | ✅ |
| 6.6 | Plan owner final sign-off → **HOLD lifted** | Written approval | ✅ 2026-02-28 |

**Gate**: ✅ All M6 gates passed · HOLD lifted 2026-02-28

</details>

---

## Design Rules at a Glance

> These are the non-negotiable rules extracted from `alex_docs/DK-correax-brand.md`. Every asset in this plan must comply.

### Palette

| Token | Hex | Role |
|-------|-----|------|
| `--bg` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0f172a"/></svg> `#0f172a` | Page / canvas background — **dark-first, always** |
| `--bg-card` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#1e293b"/></svg> `#1e293b` | Card, nav, and panel backgrounds |
| `--text` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#f1f5f9"/></svg> `#f1f5f9` | Primary text (near white) |
| `--text-muted` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#94a3b8"/></svg> `#94a3b8` | Secondary text (slate) |
| `--border` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#334155"/></svg> `#334155` | Default border |
| `--accent-indigo` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#6366f1"/></svg> `#6366f1` | **Primary** — CTAs, buttons, default accent |
| `--accent-teal` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0d9488"/></svg> `#0d9488` | **Secondary** — learning, AIRS, study guides |
| `--accent-rose` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#f43f5e"/></svg> `#f43f5e` | **Tertiary** — warnings, energy, destructive |
| `--accent-coral` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#f97316"/></svg> `#f97316` | **Quaternary** — warm highlights, callouts |

Light variants for text on dark backgrounds: indigo <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#818cf8"/></svg> `#818cf8` · teal <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#2dd4bf"/></svg> `#2dd4bf` · rose <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#fb7185"/></svg> `#fb7185` · coral <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#fb923c"/></svg> `#fb923c`

### Logo Gradient

| Use | Gradient | Values |
|-----|----------|--------|
| CorreaX mark + Rocket body | Sky Blue | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0284c7"/></svg> `#38bdf8 → #0284c7` |
| ~~Old (deprecated)~~ | ~~Azure Blue~~ | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> ~~`#0078d4 → #005a9e`~~ — **do not use** |
| Rocket flames | Warm gold → coral | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ffc857"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#f97316"/></svg> `#ffc857 → #f97316` |

### Typography

> **✅ D2 resolved**: DK-correax-brand.md §3 is the single typography authority for all surfaces.
> BRANDING.md web typography section is superseded — update it to reference DK §3 during WS-6.

**VS Code / Banners / Extension UI** (from DK §3 — authoritative):
```
Font:    'Segoe UI', system-ui, -apple-system, sans-serif
H1:      2.25rem / weight 300 (light, never bold)
Body:    0.9rem / weight 400
Series:  10px / weight 600 / letter-spacing 5px / uppercase
```

**Web Properties** (from `BRANDING.md` — authoritative for website contexts):
```
Font:    'Segoe UI', system-ui, -apple-system, sans-serif
H1:      48px / weight 700 (bold)
Body:    16px / weight 400
Small:   14px / weight 400
```

### Banner Anatomy

```
┌──────────────────────────────────────────────────────┐
│ █  SERIES LABEL                                 ALEX │
│    Title at 2.25rem weight 300                       │
│    Subtitle in muted text                            │
└──────────────────────────────────────────────────────┘
 ↑                                                  ↑
 4px accent bar (indigo/teal/rose/coral)    ghost watermark 3% opacity
```

Background: <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0f172a"/></svg> `#0f172a` or <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#1e293b"/></svg> `#1e293b` · Aspect ratio: 1200×300 (ultra-wide)

### Icon Template (CX Extensions)

```
┌────────────────────┐
│            [CX] ◁──── CorreaX badge (20%, 40% opacity)
│                    │
│      [ GLYPH ] ◁──── White or sky blue, 60% of canvas
│                    │
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ ◁── 3px accent bar (category color)
└────────────────────┘
 128×128 · bg #0f172a · rx=20
```

### Deprecated Values — Do Not Use

> **Scope**: These deprecations apply to the **CorreaX parent brand, Alex extension, and all CX extensions**.
> **Exception — AIRS Enterprise**: AIRS retains Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg> `#0078d4` as its intentional sub-brand primary color per `AlexLearn/business/BRANDING.md` (line 427). This is by design — AIRS operates in the Azure/enterprise context where Azure Blue signals platform alignment.

| Value | Was Used For | Replace With | Scope |
|-------|-------------|-------------|-------|
| <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg> `#0078d4` | Azure Blue logo gradient top | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg> `#38bdf8` (sky blue) | CorreaX, Alex, CX only |
| <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> `#005a9e` | Azure Blue logo gradient bottom | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0284c7"/></svg> `#0284c7` (sky blue) | CorreaX, Alex, CX only |
| <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ff6b35"/></svg> `#ff6b35` | Old thrust orange (flames) | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#f97316"/></svg> `#f97316` (CorreaX coral) | All properties |
| White <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#FFFFFF" stroke="#ccc" stroke-width="1"/></svg> `#FFFFFF` background-first | Old Extensions brand rule | Dark-first <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0f172a"/></svg> `#0f172a` | All properties |

---

## 1. Current State Audit

### Properties Inventory

| Property | Repo | README Banner | Logo | Color Alignment | Banner System | Status |
|----------|------|---------------|------|-----------------|---------------|--------|
| **Master Alex** (extension) | Alex_Plug_In | `banner.svg` via GitHub raw URL | `logo.svg` in vscode-extension/assets | Partial — webviewStyles.ts has CorreaX tokens, but older brand colors still in code | 6 concept banners in assets/ | 🟡 Mixed |
| **LearnAlex** (website) | AlexLearn | `readme.svg` in assets/banners/ | `logo.svg` in root + website/public/ | ✅ Full — live site uses CorreaX indigo palette | 21 SVG banners (study guides, business docs) | ✅ Aligned |
| **Extensions** (monorepo) | Extensions | `banner-extensions.svg` in brand/logos/ | `logo.svg` in brand/logos/ | ❌ Old — brand/README.md references Azure Blue `#0078d4` as gradient, "White Background" golden rules | Per-extension banner.png files (16 extensions) | 🔴 Outdated |
| **Global Knowledge** | Alex-Global-Knowledge | `banner.svg` in assets/ | `logo.svg` + `logo-knowledge-graph.svg` in assets/ | 🟡 `logo-knowledge-graph.svg` is CorreaX-native (new); `banner.svg` and `logo.svg` need audit | Single banner | 🟡 Partial |

### Key Findings

1. **LearnAlex** is the gold standard — 21 branded SVG banners, live CSS using CorreaX tokens, full dark-mode design system
2. **Extensions** brand guide (1,469 lines) is the most outdated — still references Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg> `#0078d4` gradient logo, "white background first" rule conflicts with CorreaX dark-mode-first approach
3. **Master Alex** has partial alignment — `webviewStyles.ts` DESIGN_TOKENS has CorreaX colors, but `brand-asset-management` SKILL.md still references older orange/blue palette
4. **Global Knowledge** hasn't been visually audited since the CorreaX rebrand
5. **Individual extension banners** (16 `.png` files) were AI-generated before the CorreaX palette existed — likely mismatched

---

## 2. Design Language Authority

**Single source of truth**: `alex_docs/DK-correax-brand.md` (design tokens) · `AlexLearn/business/BRANDING.md` (web brand strategy)

All tokens, palette values, typography, and component patterns are extracted above in **Design Rules at a Glance**. When in doubt, reference the DK section numbers cited there.

---

## 3. Logo, Favicon & Apple Touch Icon Catalog

> **Goal**: Standardize all logo marks, favicons, and touch icons across every property under the CorreaX design language.
> Inline thumbnails below render the **actual SVG source** from each repo so drift is immediately visible.

### 3.1 Logo Asset Inventory

#### CorreaX Wordmark / Geometric Mark

The CorreaX geometric mark is the **parent brand** logo — a stylized "CX" formed by a broken circle + chevron arrows. It must use the sky blue gradient (`#38bdf8 → #0284c7`).

| Thumbnail | Asset | Location | Gradient | Status |
|-----------|-------|----------|----------|--------|
| <img src="../../AlexLearn/assets/brand/correax-logo.svg" width="48" height="48" alt="CorreaX logo (AlexLearn brand)"> | CorreaX Logo (branded) | `AlexLearn/assets/brand/correax-logo.svg` | ✅ Sky Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0284c7"/></svg> `#38bdf8 → #0284c7` | ✅ CorreaX-aligned |
| <img src="../../AlexLearn/correax.svg" width="48" height="48" alt="CorreaX logo (AlexLearn root)"> | CorreaX Logo (root) | `AlexLearn/correax.svg` | ❌ Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> `#0078d4 → #005a9e` | 🔴 Needs recolor |
| <img src="../../AlexLearn/website/public/correax.svg" width="48" height="48" alt="CorreaX logo (website)"> | CorreaX Logo (website) | `AlexLearn/website/public/correax.svg` | ❓ Needs verification | 🟡 Audit |

**Standard**: All CorreaX geometric marks must use sky blue gradient <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0284c7"/></svg> `#38bdf8 → #0284c7`. The `AlexLearn/assets/brand/correax-logo.svg` is the canonical source.

---

#### Alex Rocket Logo (A-Negative-Space)

The flagship Alex logo — a rocket with a negative-space "A" cutout, tilted 60°, with exhaust flames. Used for the VS Code extension, READMEs, and GitHub.

| Thumbnail | Asset | Location | Body Gradient | Flames | Status |
|-----------|-------|----------|---------------|--------|--------|
| <img src="../platforms/vscode-extension/assets/logo.svg" width="48" height="48" alt="Alex Rocket (extension)"> | Extension Logo | `platforms/vscode-extension/assets/logo.svg` | ❌ Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> `#0078d4 → #005a9e` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ffc857"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ff6b35"/></svg> `#ffc857 → #ff6b35` | 🔴 Needs recolor |
| <img src="../../AlexLearn/logo.svg" width="48" height="48" alt="Alex Rocket (AlexLearn)"> | LearnAlex Logo | `AlexLearn/logo.svg` | ❌ Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> `#0078d4 → #005a9e` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ffc857"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ff6b35"/></svg> `#ffc857 → #ff6b35` | 🔴 Needs recolor |
| <img src="../../AlexLearn/website/public/logo.svg" width="48" height="48" alt="Alex Rocket (website public)"> | LearnAlex Website | `AlexLearn/website/public/logo.svg` | ❌ Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> `#0078d4 → #005a9e` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ffc857"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ff6b35"/></svg> `#ffc857 → #ff6b35` | 🔴 Needs recolor |
| <img src="../../Alex-Global-Knowledge/assets/logo.svg" width="48" height="48" alt="Alex Rocket (Global Knowledge)"> | Global Knowledge | `Alex-Global-Knowledge/assets/logo.svg` | ❌ Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> `#0078d4 → #005a9e` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ffc857"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ff6b35"/></svg> `#ffc857 → #ff6b35` | 🔴 Needs recolor |
| <img src="../../Extensions/brand/logos/logo.svg" width="48" height="48" alt="Alex Rocket (Extensions)"> | Extensions Brand | `Extensions/brand/logos/logo.svg` | ❌ Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> `#0078d4 → #005a9e` | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ffc857"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ff6b35"/></svg> `#ffc857 → #ff6b35` | 🔴 Needs recolor |

**Standard**: Rocket body gradient must change to CorreaX sky blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0284c7"/></svg> `#38bdf8 → #0284c7`. Flames may keep warm tones (<svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ffc857"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#f97316"/></svg> `#ffc857 → #f97316` coral) or shift to CorreaX teal <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0d9488"/></svg> `#0d9488` for a cooler variant.

---

#### Knowledge Graph Logo (Global Knowledge)

A geometric network symbol representing cross-project knowledge connections. Replaces the deprecated space station illustration.

| Thumbnail | Asset | Location | Colors | Status |
|-----------|-------|----------|--------|--------|
| <img src="../../Alex-Global-Knowledge/assets/logo-knowledge-graph.svg" width="48" height="48" alt="Knowledge Graph logo"> | Knowledge Graph | `Alex-Global-Knowledge/assets/logo-knowledge-graph.svg` | ✅ Sky blue `#38bdf8→#0284c7` nodes, teal `#0d9488` accent, dark `#0f172a` bg | ✅ New — CorreaX native |

**Design**: Three interconnected nodes (triangle topology) — each node = a project/knowledge source, connections = knowledge flow. Matches CX icon system: `rx=20`, 300-weight strokes, dark background, teal accent bar.

---

#### Marketplace Publisher Logo (fabioc-aloha)

The publisher avatar displays at the top of the **fabioc-aloha** publisher page on the VS Code Marketplace, next to every extension listing, and in search results. It is the single most visible brand mark — it appears on **all 18 published extensions** simultaneously.

| Thumbnail | Asset | Location | Status |
|-----------|-------|----------|--------|
| *(screenshot only — no source file exists)* | Publisher Avatar | Uploaded via Marketplace portal | 🔴 **No source file** — AI-generated, not CorreaX-branded |

**Current state**: The Marketplace screenshot shows a dark circular avatar with a teal/cyan neural-style pattern. There is **no SVG or PNG source file** tracked in any repo. It was likely uploaded manually through the Azure DevOps / Marketplace publisher portal.

**Issues**:
1. No source file in version control — impossible to reproduce or iterate
2. Not aligned with CorreaX design language (no gradient match, no "CX" or "ALEX" branding)
3. Circular crop means the design must work within a circle mask at multiple sizes (256×256 down to 48×48)

**New publisher logo spec**:

| Property | Spec |
|----------|------|
| **Canvas** | 256×256 SVG source → PNG export (Marketplace upload) |
| **Shape** | Full bleed — the portal applies circular crop automatically |
| **Background** | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0f172a"/></svg> `#0f172a` (CorreaX dark base) |
| **Primary mark** | CorreaX geometric "CX" mark (broken circle + chevrons) |
| **Mark color** | Sky blue gradient <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0284c7"/></svg> `#38bdf8 → #0284c7` |
| **Optional accent** | Subtle indigo <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#6366f1"/></svg> `#6366f1` glow ring at 15% opacity around CX mark |
| **Watermark** | None (too small for ghost text) |
| **Series label** | None (not a banner) |
| **File location** | See decision point below |

> **File location**: See **D3** in §11 Gate 0.

**Deliverables**:
1. Create `publisher-logo.svg` at the chosen location (CorreaX CX mark on dark, designed for circular crop)
2. Export `publisher-logo.png` at 256×256
3. Upload to Marketplace publisher portal (replaces current avatar)
4. Copy source to the secondary location for reference (if Option C)

---

#### CX Extension Icons (16 Extensions)

Each extension in the `Extensions/` monorepo ships a 128×128 `icon.png` displayed on the VS Code Marketplace listing and in the editor's extension panel. Currently all 16 are AI-generated PNGs with no consistent palette or design system.

**Current state**: All `icon.png` only — no SVG source files, no shared template, inconsistent styles.

| # | Thumbnail | Extension | Display Name | Icon File | Current Style | Status |
|---|-----------|-----------|-------------|-----------|---------------|--------|
| 1 | <img src="../../Extensions/extensions/ai-voice-reader/assets/icon.png" width="32" height="32" alt="AI Voice Reader icon"> | ai-voice-reader | CX AI Voice Reader | `extensions/ai-voice-reader/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 2 | <img src="../../Extensions/extensions/brandfetch-logo-fetcher/assets/icon.png" width="32" height="32" alt="Brandfetch Logo Fetcher icon"> | brandfetch-logo-fetcher | CX Brandfetch Logo Fetcher | `extensions/brandfetch-logo-fetcher/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 3 | <img src="../../Extensions/extensions/dev-wellbeing/assets/icon.png" width="32" height="32" alt="Dev Wellbeing icon"> | dev-wellbeing | CX Dev Wellbeing | `extensions/dev-wellbeing/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 4 | <img src="../../Extensions/extensions/focus-timer/assets/icon.png" width="32" height="32" alt="Focus Timer icon"> | focus-timer | CX Focus Timer | `extensions/focus-timer/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 5 | <img src="../../Extensions/extensions/gamma-slide-assistant/assets/icon.png" width="32" height="32" alt="Gamma Slide Assistant icon"> | gamma-slide-assistant | CX Gamma Slide Assistant | `extensions/gamma-slide-assistant/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 6 | <img src="../../Extensions/extensions/hook-studio/assets/icon.png" width="32" height="32" alt="Hook Studio icon"> | hook-studio | CX Hook Studio | `extensions/hook-studio/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 7 | <img src="../../Extensions/extensions/knowledge-decay-tracker/assets/icon.png" width="32" height="32" alt="Knowledge Decay Tracker icon"> | knowledge-decay-tracker | CX Knowledge Decay Tracker | `extensions/knowledge-decay-tracker/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 8 | <img src="../../Extensions/extensions/markdown-to-word/assets/icon.png" width="32" height="32" alt="Markdown to Word icon"> | markdown-to-word | CX Markdown to Word | `extensions/markdown-to-word/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 9 | <img src="../../Extensions/extensions/mcp-app-starter/assets/icon.png" width="32" height="32" alt="MCP App Starter icon"> | mcp-app-starter | CX MCP App Starter | `extensions/mcp-app-starter/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 10 | <img src="../../Extensions/extensions/mermaid-diagram-pro/assets/icon.png" width="32" height="32" alt="Mermaid Diagram Pro icon"> | mermaid-diagram-pro | CX Mermaid Diagram Pro | `extensions/mermaid-diagram-pro/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 11 | <img src="../../Extensions/extensions/pptx-builder/assets/icon.png" width="32" height="32" alt="PPTX Builder icon"> | pptx-builder | CX PPTX Builder | `extensions/pptx-builder/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 12 | <img src="../../Extensions/extensions/replicate-image-studio/assets/icon.png" width="32" height="32" alt="Replicate Image Studio icon"> | replicate-image-studio | CX Replicate Image Studio | `extensions/replicate-image-studio/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 13 | <img src="../../Extensions/extensions/secret-guard/assets/icon.png" width="32" height="32" alt="SecretGuard icon"> | secret-guard | CX SecretGuard | `extensions/secret-guard/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 14 | <img src="../../Extensions/extensions/svg-to-png/assets/icon.png" width="32" height="32" alt="SVG to PNG icon"> | svg-to-png | CX SVG to PNG | `extensions/svg-to-png/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 15 | <img src="../../Extensions/extensions/svg-toolkit/assets/icon.png" width="32" height="32" alt="SVG Toolkit icon"> | svg-toolkit | CX SVG Toolkit | `extensions/svg-toolkit/assets/icon.png` | AI-generated | 🔴 Needs redesign |
| 16 | <img src="../../Extensions/extensions/workspace-watchdog/assets/icon.png" width="32" height="32" alt="Workspace Watchdog icon"> | workspace-watchdog | CX Workspace Watchdog | `extensions/workspace-watchdog/assets/icon.png` | AI-generated | 🔴 Needs redesign |

**Extension Icon Design System**:

All 16 extension icons must follow a shared template for instant brand recognition on the Marketplace.

| Property | Spec | Notes |
|----------|------|-------|
| **Canvas** | 128×128 (SVG source → PNG export) | Marketplace minimum; also export 256×256 for high-DPI |
| **Background** | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0f172a"/></svg> `#0f172a` (CorreaX dark base) | Rounded rect, `rx="20"` corner radius |
| **Badge** | Small CorreaX geometric mark (CX) | Top-right corner, 20% scale, <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg> `#38bdf8` at 40% opacity |
| **Glyph** | Category-specific icon in center | White or sky blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg> `#38bdf8`, 60% of canvas, weight 300 strokes |
| **Accent bar** | 3px bottom bar in extension's accent color | Assigns each extension a unique CorreaX palette accent |
| **Format** | SVG source in `assets/icon.svg` → PNG export `assets/icon.png` | SVG is the source of truth |

**Accent Color Assignment** (from CorreaX palette):

| Category | Accent | Extensions |
|----------|--------|------------|
| **Developer Tools** | Indigo <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#6366f1"/></svg> `#6366f1` | Hook Studio, MCP App Starter, Workspace Watchdog |
| **Document & Export** | Teal <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0d9488"/></svg> `#0d9488` | Markdown to Word, PPTX Builder, Gamma Slide Assistant |
| **Visual & Graphics** | Rose <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#f43f5e"/></svg> `#f43f5e` | Mermaid Diagram Pro, SVG Toolkit, SVG to PNG, Replicate Image Studio |
| **Productivity** | Coral <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#f97316"/></svg> `#f97316` | Focus Timer, Dev Wellbeing, Knowledge Decay Tracker |
| **Security & Data** | Sky Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg> `#38bdf8` | SecretGuard, Brandfetch Logo Fetcher |
| **Media** | Indigo <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#6366f1"/></svg> `#6366f1` | AI Voice Reader |

<details>
<summary>Glyph concepts (per extension, click to expand)</summary>

Design rule: **one element**, geometric, 300-weight strokes, legible at 128px on `#0f172a`.

| Extension | Glyph | Rationale |
|-----------|-------|-----------|
| ai-voice-reader | Three concentric sound arcs | Universal audio symbol; scales cleanly |
| brandfetch-logo-fetcher | Tag outline | Brand identity = tag; single geometric shape |
| dev-wellbeing | Leaf | Wellness without medical cliché; organic contrast to geometric system |
| focus-timer | Hourglass | Timeless, elegant geometry; avoids generic clock |
| gamma-slide-assistant | γ (gamma letterform) | Product name as glyph — bold, typographic, unmistakable |
| hook-studio | Curly braces `{ }` | Code hooks = braces; universal dev symbol |
| knowledge-decay-tracker | Three descending bars | Decay as trend; data-driven, minimal |
| markdown-to-word | Right arrow between two page outlines | Conversion at a glance; one visual action |
| mcp-app-starter | Lightning bolt | Instant start energy; cleaner than a rocket |
| mermaid-diagram-pro | Three connected circles | Graph topology — what diagrams are |
| pptx-builder | Three offset rectangles | Stacked slides; depth through layering |
| replicate-image-studio | Aperture blades | Photography distilled to geometry |
| secret-guard | Shield | Most recognizable security symbol at small sizes |
| svg-to-png | 3×3 dot grid | Pixels = raster; abstract but instant recognition |
| svg-toolkit | Bezier anchor with handles | The vector editing symbol — iconic, universally known |
| workspace-watchdog | Eye | Watchful, minimal, universal |

</details>

**Shared icon sizes in `Extensions/brand/icons/`**:

The existing 8 PWA icon SVGs (`icon-72x72.svg` through `icon-512x512.svg`) also need updating:
- Background: change from white <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#FFFFFF" stroke="#ccc" stroke-width="1"/></svg> `#FFFFFF` → CorreaX dark <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0f172a"/></svg> `#0f172a`
- Logo mark: change from Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg> `#0078d4` fill → white on dark, matching the new system
- Update `Extensions/brand/icons/README.md` "Quick Rules" to reflect dark-first approach

---

### 3.2 Favicon Inventory

Favicons derive from the CorreaX geometric mark (CX broken circle + chevrons) — **not** the rocket logo.

| Thumbnail | Asset | Location | Gradient | Status |
|-----------|-------|----------|----------|--------|
| <img src="../platforms/vscode-extension/assets/favicon.svg" width="24" height="24" alt="Favicon (extension)"> | Extension Favicon | `platforms/vscode-extension/assets/favicon.svg` | ❌ Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> `#0078d4 → #005a9e` | 🔴 Needs recolor |
| <img src="../../AlexLearn/website/public/favicon.svg" width="24" height="24" alt="Favicon (AlexLearn website)"> | LearnAlex Website | `AlexLearn/website/public/favicon.svg` | ❓ Needs verification | 🟡 Audit |
| <img src="../../Extensions/brand/logos/favicon.svg" width="24" height="24" alt="Favicon (Extensions)"> | Extensions Brand | `Extensions/brand/logos/favicon.svg` | ❌ Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> `#0078d4 → #005a9e` | 🔴 Needs recolor |

**Standard**: All favicons must use CorreaX sky blue gradient <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0284c7"/></svg> `#38bdf8 → #0284c7`. Source design = CorreaX geometric mark at 32×32 viewbox. Export sizes: 16×16, 32×32, 48×48 (ICO multi-size).

---

### 3.3 Apple Touch Icon

Apple touch icons are rendered at 180×180 on iOS home screens. They need a solid background + centered logo mark.

| Thumbnail | Asset | Location | Background | Logo | Status |
|-----------|-------|----------|------------|------|--------|
| <img src="../../AlexLearn/website/public/apple-touch-icon.svg" width="48" height="48" alt="Apple Touch Icon (AlexLearn)"> | LearnAlex Website | `AlexLearn/website/public/apple-touch-icon.svg` | ❓ Needs audit | ❓ | 🟡 Audit |

**Standard**:
- Background: <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0f172a"/></svg> `#0f172a` (CorreaX dark base) — solid fill, no gradient
- Logo: CorreaX geometric mark in sky blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#38bdf8"/></svg> `#38bdf8`, centered, 70% of canvas
- Corner radius: handled by iOS (no manual rounding)
- Export: 180×180 PNG from SVG source
- **All web properties must have one** — missing from: Extensions, Global Knowledge, Master Alex

---

### 3.4 Recolor Recipes

All standardization tasks are tracked in **§11 Execution Tracker** (organized by milestone). The recipes below are reference for implementation.

**Rocket logos** (Azure Blue → sky blue):
```
Find:    stop-color="#0078d4"  →  Replace: stop-color="#38bdf8"
Find:    stop-color="#005a9e"  →  Replace: stop-color="#0284c7"
```

**Recolor recipe** (flames to CorreaX coral):
```
Find:    stop-color="#ff6b35"  →  Replace: stop-color="#f97316"
(Keep #ffc857 gold top — it still works within the warm palette)
```

---

## 4. Workstreams

### WS-1: README Banners (All Repos)

**Goal**: Every repo README uses a CorreaX-branded SVG banner with consistent visual language.

| Repo | Current Banner | Action | Priority |
|------|---------------|--------|----------|
| Master Alex | `banner.svg` — unknown visual age | Audit; regenerate if not CorreaX-compliant | High |
| AlexLearn | `readme.svg` — CorreaX-branded | ✅ Verify still matches DK | Low |
| Extensions | `banner-extensions.svg` — unknown | Audit; likely needs regeneration | High |
| Global Knowledge | `banner.svg` — unknown | Audit; regenerate if needed | Medium |

**Banner spec** (from DK §4):
- Dark background (<svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0f172a"/></svg> `#0f172a` or <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#1e293b"/></svg> `#1e293b`)
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
- Logo gradient uses Azure Blue <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg><svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#005a9e"/></svg> `#0078d4 → #005a9e` — should reference CorreaX sky blue or indigo
- No reference to `DK-correax-brand.md` or the CorreaX design token system
- Banner specs don't mention the signature accent bar + watermark + series label pattern
- Typography section likely doesn't match DK type scale

**Tasks**: 3.1 → see Asset Task Registry § Extensions Brand Guide

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
- Use CorreaX dark background (<svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0f172a"/></svg> `#0f172a`)
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

#### Welcome Panel UI Reference Mockup

<details>
<summary>Full ASCII mockup + token mapping (click to expand)</summary>

Source: `platforms/vscode-extension/src/views/welcomeView.ts` (2 090 lines)

The welcome panel is the first thing users see in the sidebar. Every element below
maps to a CorreaX design token. The mockup uses the **Developer** persona as the
baseline; accent color swaps per persona (see DK §13).

```
┌──────────────────────────────────────┐
│▌                                ALEX │  ← ghost watermark 4% opacity
│▌ ALEX COGNITIVE                      │  ← series label 9px/600/4px ls
│▌ ┌──────┐                        ↻  │
│▌ │ logo │  Alex Cognitive            │  ← header-title 18px / 300
│▌ │ .svg │  🛠️  Developer             │  ← persona badge + icon
│▌ └──────┘                            │
│▌                                     │  ← 4px accent bar (left edge)
├──────────────────────────────────────┤
│                                      │
│        ┌────────────────────┐        │
│        │                    │        │
│        │   PERSONA AVATAR   │        │  ← full-width, 8px radius
│        │   (Developer.png)  │        │     border: persona-accent
│        │                    │        │     hover: scale(1.02)
│        └────────────────────┘        │
│                                      │
│  ┌──────────────────────────────┐    │
│  │    📂  my-awesome-project    │    │  ← project-name (workspace)
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 🤝 Your Trusted Partner for  │    │  ← partnership-bar
│  │        Engineering           │    │     gradient: persona-accent mix
│  └──────────────────────────────┘    │
│                                      │
│  ┌─── SESSION ──────────────────┐    │
│  │  ⏱️  23:41      🍅 ×3        │    │  ← timer 21px monospace
│  │  Topic: Refactor auth module │    │     blue left border
│  └──────────────────────────────┘    │
│                                      │
│  ┌ NUDGES ──────────────────────┐    │
│  │▎ ⚠️  Health degraded   [Fix] │    │  ← nudge-health (red border)
│  │▎ 🔥 3-day streak!           │    │  ← nudge-streak (orange border)
│  │▎ 🎯 Mission nudge     [Go]  │    │  ← nudge-mission (purple border)
│  └──────────────────────────────┘    │
│                                      │
│  Status                              │
│  ┌──────────┐  ┌──────────┐         │
│  │ Health   │  │ Streak   │         │  ← 2-column status-grid
│  │ ✓ 95%    │  │ ✓ 7 days │         │     dot-green / dot-yellow
│  └──────────┘  └──────────┘         │
│                                      │
│  Active Context                      │
│  ┌──────────────────────────────┐    │
│  │ Refactor auth module         │    │  ← context-objective
│  │                              │    │
│  │  ┌──────┐ ┌─────┐ ┌──────┐  │    │
│  │  │ rfd  │ │ qa  │ │ test │  │    │  ← trifecta-tags (pills)
│  │  └──────┘ └─────┘ └──────┘  │    │     bg: persona-accent 15%
│  │                              │    │
│  │  🛠️  Developer 92%  ✓ Feb 28 │    │  ← context-meta badges
│  │  KISS · DRY · Quality-First  │    │     persona + assessed + principles
│  └──────────────────────────────┘    │
│                                      │
│  ── SKILL RECOMMENDATIONS ────────   │
│  ▎ vscode-extension-patterns        │  ← skill-recommendation-btn
│  ▎    Matched: VS Code project      │     blue left border
│  ▎ testing-strategies               │     hover → persona-accent
│  ▎    Matched: Test files detected  │
│                                      │
│  Quick Actions                       │
│  ── PARTNERSHIP ──────────────────   │
│  │ 💬  Let's Talk                 │  │
│  │ ⭐  North Star                 │  │  ← action-btn rows
│  │ 🎓  How We Work               │  │     icon 20px + text
│  │ 🧬  Cognitive Levels          │  │
│  │ 🦆  Think Together            │  │
│                                      │
│  ── TRUST & GROWTH ──────────────   │
│  │ 💭  Dream                      │  │
│  │ ✨  Self-Actualize             │  │
│  │ ⬆️   Initialize / Update       │  │
│  │ 🧠  How I Think               │  │
│                                      │
│  ── KNOWLEDGE ───────────────────   │  ← only if Global Knowledge
│  │ 🔎  Search Knowledge           │  │
│                                      │
│  ── BUILD TOGETHER ──────────────   │
│  │ 👀  Code Review                │  │
│  │ 🐛  Debug This                 │  │
│  │ 🧪  Generate Tests            │  │
│  │ 🔍  Project Audit              │  │
│  │ 🚀  Release Preflight          │  │
│  │ 📋  Import Issues              │  │
│  │ 👁️   Review PR                 │  │
│                                      │
│  ── LEARN & CREATE ──────────────   │
│  │ 💬  Ask Alex                   │  │
│  │ 💡  Save Insight               │  │
│  │ 🔍  Search Knowledge           │  │
│  │ 📊  Generate Diagram           │  │
│  │ 🔊  Read Aloud                 │  │
│                                      │
│  ── PRESENT & SHARE ─────────────   │
│  │ 📄  Marp PPTX (Local)         │  │
│  │ 🎨  Gamma (Cloud)             │  │
│  │ ⚙️   Gamma Advanced            │  │
│                                      │
│  ── VISUALIZE ───────────────────   │
│  │ 🖼️   Generate Image            │  │
│  │ ✏️   Edit Image (AI)           │  │
│                                      │
│  ── WELLBEING ───────────────────   │
│  │ 🍅  Focus Session              │  │
│  │ 🎯  Goals                      │  │
│                                      │
│  ── SYSTEM ──────────────────────   │
│  │ 🧠  Memory Architecture       │  │
│  │ 📦  Export for M365            │  │
│  │ ⚙️   Environment Setup         │  │
│  │ 🔑  API Keys & Secrets        │  │
│  │ 🔍  Detect .env Secrets        │  │
│  │ 📚  Docs                       │  │
│  │ 💬  Provide Feedback           │  │
│  │ 🩺  Diagnostics                │  │
│                                      │
│  Learning Goals        🔥 7 day str │
│  ✅ 2 today   🏆 14 total           │
│  ┌──────────────────────────────┐    │
│  │ Master TypeScript generics   │    │
│  │ ████████████░░░░  8/12       │    │  ← goal progress bar
│  │ Learn Rust basics            │    │     fill: persona-accent
│  │ ██████░░░░░░░░░░  3/10       │    │
│  └──────────────────────────────┘    │
│                                      │
│  ▸ 📖 Features & Documentation      │  ← collapsible <details>
│                                      │
└──────────────────────────────────────┘
```

**CorreaX token mapping** (key elements):

| UI Element | CSS Variable / Token | CorreaX Value |
|------------|---------------------|---------------|
| Background | `--vscode-sideBar-background` | VS Code theme (dark ≈ <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#1e1e1e"/></svg> `#1e1e1e`) |
| Header accent bar | `--persona-accent` (4px left) | Per-persona, e.g. Indigo <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#6366f1"/></svg> `#6366f1` |
| Header watermark | `color: currentColor` at 4% opacity | "ALEX" (DK §4 ghost pattern) |
| Series label | 9px / 600 / 4px letter-spacing / uppercase | "ALEX COGNITIVE" |
| Avatar border | `border-bottom: 3px solid var(--persona-accent)` | Persona-driven |
| Partnership bar | `linear-gradient(…persona-accent…)` | Gradient mix |
| Status dots | `.dot-green` / `.dot-yellow` / `.dot-red` | Semantic traffic lights |
| Trifecta tags | `background: var(--persona-accent) 15%` | Pill-shaped, clickable |
| Action buttons | `var(--vscode-button-secondaryBackground)` | VS Code theme token |
| Recommended btn | `border-left: 2px solid var(--persona-accent)` | Highlighted variant |
| Premium badge | `.tier-lock` + yellow border | <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#f0883e"/></svg> `#f0883e` lock icon |
| Goal bar fill | `var(--persona-accent)` | Progress indicator |
| Nudge borders | Red / Orange / Purple (by nudge type) | Semantic color coding |

**Compliance notes**:
- Header accent bar + watermark + series label ✅ matches DK §4 banner anatomy
- Avatar uses persona-specific PNG resolved at runtime (easter egg support on birthdays)
- Font stack uses VS Code theme fonts (inherits Segoe UI on Windows)
- Spacing scale: 4 / 8 / 16 / 24 / 32 px — consistent with DK compact layout
- All interactive elements have `tabindex="0"`, `role="button"`, `aria-label` — WCAG compliant
- Auto-refresh every 30 seconds to keep status current

</details>

---

### WS-5: Documentation Visual Consistency

**Goal**: Ensure internal docs follow CorreaX visual conventions.

**Scope**:
- Mermaid diagrams across all repos should use the DK §12 theme (dark, indigo borders, teal secondary)
- Markdown tables, headings, and code blocks should follow consistent formatting
- Architecture diagrams in `alex_docs/architecture/` should use CorreaX palette
- README badge colors should use CorreaX-aligned shields.io colors

**Tasks**: 4.8, 4.9, 4.10 → see Asset Task Registry § Documentation Assets

**Priority**: Low — documentation-internal, not user-facing

---

### WS-6: Global Knowledge Repo Brand Refresh

**Goal**: Bring `Alex-Global-Knowledge` visual presentation in line with CorreaX.

**Tasks**: 2.5 ✅, 4.4 → see Asset Task Registry §§ Knowledge Graph Logo, README Banners

**Priority**: Medium — smaller repo, but visible in documentation and README links

---

### WS-7: Right-Click Context Menu Standardization

**Goal**: Unify the context-menu (right-click) experience across all CX extensions so users see a consistent, branded submenu wherever they right-click.

#### Current State Audit (Pre-M3)

| Property | Alex Extension | CX Extensions (14 of 16) | `dev-wellbeing` / `focus-timer` |
|----------|---------------|--------------------------|----------------------------------|
| **Submenu ID** | `alex.contextMenu` / `alex.explorerMenu` | `cx.tools` | *(none — workspace-level, N/A)* |
| **Label** | `🚀 Alex` | ~~`🔷 CX Tools`~~ → `$(tools) CX Tools` ✅ | — |
| **Icon** | `$(rocket)` | `$(tools)` ✅ | — |
| **editor/context** | ✅ | ✅ | N/A |
| **explorer/context** | ✅ (file-type gated) | ✅ (14/14 — brandfetch + replicate fixed) ✅ | N/A |
| **Group naming** | `1_ask`, `2_save`, `3_search`/`3_generate`, `4_create`/`4_voice`, `5_github` | `1_analysis` / `2_transform` / `3_generate` / `4_info` ✅ | — |

#### M3 Fixes Applied ✅

1. ~~**No icon field on CX submenu**~~ → `$(tools)` added to all 14 submenus.
2. ~~**2 extensions missing entirely**~~ → `dev-wellbeing` and `focus-timer` confirmed workspace-level (N/A per D6).
3. ~~**2 extensions missing explorer/context**~~ → `brandfetch-logo-fetcher` and `replicate-image-studio` now have `explorer/context`.
4. ~~**Group naming drift**~~ → all 14 extensions now use `1_analysis@N` / `2_transform@N` / `3_generate@N` / `4_info@N`.

#### Implemented Design

| Property | Standard |
|----------|----------|
| **Submenu ID** | `cx.tools` (shared across all CX extensions) |
| **Label** | `$(tools) CX Tools` |
| **Icon** | `$(tools)` codicon |
| **Contexts** | Both `editor/context` **and** `explorer/context` for all file-level extensions |
| **Group naming convention** | `1_analysis` (scan/lint), `2_transform` (convert/export), `3_generate` (create new files), `4_info` (report/status) |
| **Alex extension** | Keeps its own `🚀 Alex` submenu — cognitive partner, not a tool. |

> **Design decision**: Alex (🚀) and CX Tools (🔷) remain **separate submenus by design**.
> Alex = cognitive partner (ask, explain, review). CX Tools = utility belt (convert, scan, export).
> The standardization here is about making CX Tools internally consistent, not merging them.

> **⚠️ Alex Extension Group Naming**: The Alex extension uses its own groups (`1_ask`, `2_save`, `3_search`, `4_create`, `5_github`) — intentionally different from CX (`1_analysis`, `2_transform`, `3_generate`, `4_info`). See **D4** in §11 Gate 0.

#### Standardization Tasks

**Tasks**: 3.6–3.11 → see Asset Task Registry § Context Menus

#### Group Naming Convention

```
 cx.tools
 ├── 1_analysis@N     Scan, lint, validate, audit (SecretGuard scan, Mermaid validate, Watchdog check)
 ├── 2_transform@N    Convert, export, resize (Markdown→Word, SVG→PNG, Mermaid→SVG, PPTX export)
 ├── 3_generate@N     Create new content (image gen, scaffold, template insert)
 └── 4_info@N         Reports, dashboards, status (audit report, decay report, wellbeing stats)
```

**Priority**: Medium — UX consistency issue visible to every user who right-clicks

---

## 5. Execution Order

> Gate 0 → M1 → M2 → M3 → M4 → M5 → M6. Each milestone ends with a publish gate.
> **Task tracking**: Asset Task Registry (top of document).
> **Publish gates**: §11 Milestone Gates (bottom of document).

---

## 6. Acceptance Criteria

A property is "brand-aligned" when:

- [ ] README banner uses CorreaX dark background + accent bar + series label pattern
- [ ] Logo/icon references the current CorreaX logo (sky blue gradient, not Azure blue)
- [ ] CSS/design tokens match `DK-correax-brand.md` §2 palette exactly
- [ ] Typography follows DK §3 (Segoe UI stack, 300-weight titles, 10px series labels)
- [ ] Primary CTAs use <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#6366f1"/></svg> `#6366f1` (indigo), not older blue/orange
- [ ] Mermaid diagrams use DK §12 theme variables
- [ ] Badge colors use CorreaX-aligned hex values
- [ ] No references to deprecated color values (<svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#ff6b35"/></svg> `#ff6b35` thrust orange, old <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#0078d4"/></svg> `#0078d4` branding gradient) — *(AIRS excepted per §7)*
- [ ] Right-click context menu uses `cx.tools` submenu with `🔷 CX Tools` label and standard group IDs
- [ ] Both `editor/context` and `explorer/context` registered (or documented as N/A)

---

## 7. Out of Scope

- **AIRS Enterprise** — blocked on cost containment work; brand alignment deferred until cost control issues are resolved. AIRS retains Azure Blue `#0078d4` as its sub-brand color (no action needed under this plan)
- www.correax.com website design (separate project, not in this workspace)
- AIRS platform UI (hosted separately, follows its own sub-brand)
- Amazon book cover design (publisher domain)
- VS Code Marketplace page CSS (controlled by Microsoft)

---

## 8. Dependencies

| Dependency | Impact | Mitigation |
|------------|--------|------------|
| AI banner generation (Replicate API key) | WS-1, WS-3 need generated banners | Can create SVG banners manually if API unavailable |
| Extension republishing (Marketplace rate limits) | WS-3 requires republishing 9 extensions | Batch in groups of 3, space by 24 hours |
| `DK-correax-brand.md` stability | All workstreams reference this | It's now in Master Alex — changes go through meditation |

---

## 9. Definition of Done (DoD)

A deliverable is **Done** when ALL of the following are true:

### Per-Asset DoD

- [ ] **Palette compliance**: Zero deprecated colors (`#0078d4`, `#005a9e`, `#ff6b35`) — *(AIRS excepted per §7)*
- [ ] **DK reference verified**: Every color, gradient, and font value traces back to `DK-correax-brand.md` section number
- [ ] **SVG source exists**: No PNG-only assets — SVG is the source of truth, PNG is an export
- [ ] **Renders correctly**: Tested at target size (128px icon, 256px publisher logo, 1200×300 banner) in both VS Code dark and Marketplace white backgrounds
- [ ] **Committed to repo**: Source file tracked in git, not just uploaded to a portal
- [ ] **Publish gate passed**: Fabio has given explicit green light for this specific asset

### Per-Milestone DoD

- [ ] All assets in the milestone pass the per-asset DoD
- [ ] No regressions in previously approved milestones
- [ ] Acceptance criteria (§6) checked for affected properties
- [ ] Asset Task Registry updated with status + date

### Plan-Complete DoD (HOLD Lift)

- [ ] All 6 milestones marked ✅
- [x] KPI targets (§10) met or exceeded
- [x] Final cross-repo verification pass completed
- [x] Brand compliance check added to dream protocol
- [ ] Plan owner signs off → HOLD is lifted

---

## 10. Success Metrics

| KPI | Baseline (pre-plan) | Achieved | Target | How to Measure |
|-----|---------------------|----------|--------|----------------|
| Deprecated color occurrences | ~30+ across repos | **0** ✅ | **0** | Automated grep (M6.1) |
| Extension icon design consistency | 0/16 compliant | **16/16** ✅ | **16/16** | Visual audit against icon template |
| Context menus with standard groups | 0/16 | **14/16** ✅ | **14/16** (excl. N/A) | Audit `package.json` submenu declarations |
| Properties with CorreaX README banner | 1/4 (LearnAlex) | **4/4** ✅ | **4/4** | Visual audit per WS-1 |
| Publisher logo CorreaX-aligned | No | **Yes** ✅ | **Yes** | SVG source in repo + live on Marketplace |
| Brand guide references DK as authority | 0/1 (Extensions) | **1/1** ✅ | **1/1** | `Extensions/brand/README.md` links to DK |
| Brand compliance in dream protocol | No | **Yes** ✅ | **Yes** | Phase 4.5 added to dream-state-automation.instructions.md |
| Marketplace avg rating (D5) | N/A | — | **≥ 4.5** | VS Code Marketplace publisher dashboard |
| Marketplace installs trend (D5) | N/A | — | **No regression** | Monthly snapshot from publisher dashboard |

---

## 11. Milestone Gates

> Publish gates only — task tracking lives in the **Asset Task Registry** at the top of this document.
> Work top-to-bottom. Fabio gives green light per milestone before moving on.

### Gate 0 — Decision Points

*All decisions must be locked before any implementation begins.*

| # | Decision | Options | Resolution | Status |
|---|----------|---------|------------|--------|
| D1 | Plan owner / sign-off authority | Fabio alone · Fabio + Alex QA | **Fabio (owner) + Alex (QA reviewer)** | ✅ |
| D2 | Typography: unify or keep context split? | Unify to DK · Keep split | **Unify to DK** — DK-correax-brand.md is the single typography authority for all surfaces | ✅ |
| D3 | Publisher logo file location | A: `Extensions/brand/logos/` · B: `Alex_Plug_In/assets/brand/` · C: Both | **Option A** — `Extensions/brand/logos/publisher-logo.svg` | ✅ |
| D4 | Alex vs CX group naming | Align to CX · Keep cognitive/utility split | **Keep separate** — Alex = cognitive partner, CX = utility extensions | ✅ |
| D5 | Success KPIs scope | Internal only · Include Marketplace analytics | **Include Marketplace from the start** — download trends, ratings, install counts | ✅ |
| D6 | `dev-wellbeing` / `focus-timer` context menu | Add menus · N/A | **Assess** — add if file-level commands exist, mark N/A if not | ✅ |

**Gate 0 status**: ✅ *All 6 decisions resolved 2026-02-28* → Proceed to Milestone 1

---

### Milestone 1 — Publisher Logo

**Tasks**: 1.1, 1.2, 1.3 → see Asset Task Registry § Publisher Logo

**✋ PUBLISH GATE 1**: Fabio approves → upload to Marketplace publisher portal

| Approved | Date | Notes |
|----------|------|-------|
| ✅ | 2026-02-28 | Fabio approved — upload publisher-logo.png to Marketplace portal |

---

### Milestone 2 — Shared Logo & Favicon Recolors

**Tasks**: 2.1–2.6 → see Asset Task Registry §§ Rocket Logos, CorreaX Wordmark, Knowledge Graph, Favicons, Verification

**✋ PUBLISH GATE 2**: Fabio approves → commit recolored SVGs to all repos

| Approved | Date | Notes |
|----------|------|-------|
| ✅ | 2026-02-28 | Fabio approved — committed to Alex_Plug_In, AlexLearn, Alex-Global-Knowledge, Extensions |

---

### Milestone 3 — CX Extension Standardization

**Tasks**: 3.1–3.11 → see Asset Task Registry §§ Extensions Brand Guide, CX Extension Icons, CX Extension Banners, PWA Icons, Context Menus

**✋ PUBLISH GATE 3**: Fabio approves → republish CX extensions (batch 3/day, spaced 24h)

| Approved | Date | Notes |
|----------|------|-------|
| ⬜ | — | — |

**Republish schedule** (9 published extensions, 3 per day):

| Day | Extensions |
|-----|------------|
| Day 1 | Hook Studio, Workspace Watchdog, MCP App Starter |
| Day 2 | Knowledge Decay Tracker, Brandfetch Logo Fetcher, AI Voice Reader |
| Day 3 | SecretGuard, Focus Timer, Markdown to Word |

---

### Milestone 4 — README Banners & Documentation

**Tasks**: 4.1–4.10 → see Asset Task Registry §§ README Banners, Apple Touch Icons, Favicons, Rocket Logos, Documentation Assets

**✋ PUBLISH GATE 4**: Fabio approves → commit to repos, push to GitHub

| Approved | Date | Notes |
|----------|------|-------|
| ⬜ | — | — |

---

### Milestone 5 — Alex Extension (Last)

**Tasks**: 5.1–5.6 → see Asset Task Registry § Alex Extension UI

**✋ PUBLISH GATE 5**: Fabio approves → publish new Alex extension version to Marketplace

| Approved | Date | Notes |
|----------|------|-------|
| ⬜ | — | — |

---

### Milestone 6 — Verification & HOLD Lift

**Tasks**: 6.1–6.6 → see Asset Task Registry § Verification & Sign-off

**✋ FINAL GATE — HOLD LIFTED**

| Approved | Date | Notes |
|----------|------|-------|
| ⬜ | — | ⛔ HOLD remains until this row is ✅ |
