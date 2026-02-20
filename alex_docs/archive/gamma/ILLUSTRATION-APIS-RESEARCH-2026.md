# Illustration APIs Research 2026

**Date**: February 7, 2026
**Status**: Active Research
**Purpose**: Evaluate illustration services for Alex PPTX generation

---

## Executive Summary

Gamma.app uses **Pictographic** for their illustration system, but it's a B2B-only service with no public API. This document evaluates public alternatives that can provide similar quality and variety.

---

## Pictographic (Gamma's Provider)

### Overview
| Attribute         | Value                 |
| ----------------- | --------------------- |
| **Website**       | pictographic.io       |
| **Icons**         | 20,000+               |
| **Illustrations** | 200,000+              |
| **Styles**        | 13 distinct styles    |
| **API Access**    | B2B partnerships only |
| **Public API**    | ❌ None available      |

### Discovered Styles
1. `notion` - Clean, minimalist (Notion-style)
2. `lined` - Line art style
3. `oldschool` - Vintage/retro
4. `purple` - Purple-tinted illustrations
5. `isometric-modern` - 3D isometric
6. `flat-modern` - Flat design
7. `gradient` - Gradient-heavy
8. `doodle` - Hand-drawn doodles
9. `3d` - 3D rendered
10. `outline` - Outline only
11. `duotone` - Two-tone style
12. `hand-drawn` - Sketchy hand-drawn
13. `corporate` - Business/professional

### CDN Pattern (Requires Partnership ID)
```
storage.googleapis.com/pictographic/thumbnails/{style}/{id}.png
```

### Why Not Available
- All `/api` endpoints return 404
- `api.pictographic.io` returns only "Hello from Pictographic CDN!"
- Pricing page mentions enterprise plans only
- Free tier (10 images/month) requires signup and attribution
- No developer documentation or SDK

### Conclusion
**Not viable for Alex** without establishing a B2B partnership.

---

## Public Alternatives (API Verified February 2026)

### 1. Iconify ⭐ RECOMMENDED

| Attribute      | Value                                |
| -------------- | ------------------------------------ |
| **Website**    | iconify.design                       |
| **Icons**      | 150,000+ (aggregated from 100+ sets) |
| **License**    | Varies by set (mostly MIT/Apache)    |
| **API**        | ✅ Free, no auth required             |
| **Rate Limit** | Generous (no issues observed)        |
| **Format**     | SVG                                  |

#### API Details
```typescript
// Base endpoint
GET https://api.iconify.design/{prefix}/{icon-name}.svg

// With color (URL encoded)
GET https://api.iconify.design/mdi/chart-bar.svg?color=%230550ae

// With size
GET https://api.iconify.design/ph/brain-bold.svg?width=48&height=48
```

#### Popular Icon Set Prefixes
| Prefix             | Set Name              | Count  | License    |
| ------------------ | --------------------- | ------ | ---------- |
| `mdi`              | Material Design Icons | 7,447  | Apache 2.0 |
| `heroicons`        | Heroicons             | 588    | MIT        |
| `ph`               | Phosphor              | 7,488  | MIT        |
| `tabler`           | Tabler Icons          | 4,824  | MIT        |
| `lucide`           | Lucide                | 1,432  | ISC        |
| `material-symbols` | Material Symbols      | 15,111 | Apache 2.0 |

#### Pros
- Massive variety (150K+ icons)
- Single API for 100+ icon libraries
- No authentication required
- Color and size customization
- Consistent SVG format

#### Cons
- Icons only, no full illustrations
- Mixed licenses (need to track per-set)

---

### 2. DiceBear ⭐ FOR AVATARS/PEOPLE

| Attribute         | Value                                 |
| ----------------- | ------------------------------------- |
| **Website**       | dicebear.com                          |
| **Illustrations** | Generative avatars (unlimited combos) |
| **License**       | CC0/MIT                               |
| **API**           | ✅ Free, no auth                       |
| **Format**        | SVG/PNG                               |

#### API Details
```typescript
// Generative avatar by seed
GET https://api.dicebear.com/7.x/avataaars/svg?seed=Alex

// With options
GET https://api.dicebear.com/7.x/open-peeps/svg?seed=user123&backgroundColor=b6e3f4
```

#### Styles Available
- `avataaars` - Cartoon avatars
- `bottts` - Robot illustrations
- `open-peeps` - Hand-drawn people (Pablo Stanley)
- `notionists` - Notion-style illustrations
- `lorelei` - Stylized faces
- `personas` - Character illustrations

#### Pros
- Unlimited unique illustrations via seed
- Open Peeps integration built-in
- CC0 license on most styles
- No rate limits observed

#### Cons
- Primarily for avatars/people
- Generative only (can't search specific concepts)

---

### 3. unDraw ⚠️ API ISSUES

| Attribute         | Value                   |
| ----------------- | ----------------------- |
| **Website**       | undraw.co               |
| **Illustrations** | 500+                    |
| **License**       | MIT                     |
| **API**           | ⚠️ Unreliable (Feb 2026) |
| **Format**        | SVG                     |

#### Status
The website works, but public API returns inconsistent errors:
- Search endpoint returns "query must be at least 3 characters" despite valid queries
- POST methods return 405

**Recommendation**: Download illustrations manually. No reliable programmatic access.

---

### 4. Lucide Icons (Already Integrated)

| Attribute   | Value                |
| ----------- | -------------------- |
| **Website** | lucide.dev           |
| **Icons**   | 1,400+               |
| **License** | ISC (MIT-like)       |
| **API**     | ✅ NPM package or CDN |
| **Format**  | SVG                  |

Already bundled in `illustrationIcons.ts` with 60+ business icons.

---

### 5. SVGRepo ❌ BLOCKED

| Attribute   | Value                       |
| ----------- | --------------------------- |
| **Website** | svgrepo.com                 |
| **Icons**   | 500,000+                    |
| **License** | Mixed                       |
| **API**     | ❌ Cloudflare protected      |
| **Status**  | Returns 429 with challenges |

Not viable for programmatic access.

---

### No-API Alternatives (Manual Download Only)

These services have high-quality illustrations but require manual download:

| Service    | Type          | License             | Notes              |
| ---------- | ------------- | ------------------- | ------------------ |
| Storyset   | Illustrations | Freepik/Attribution | 5 animation styles |
| Open Peeps | People        | CC0                 | 584K combinations  |
| Humaaans   | People        | Free                | Mix-and-match      |
| DrawKit    | Packs         | MIT (free)          | 50+ packs          |
| Blush      | Components    | Commercial          | Mix-and-match      |

---

## Recommendation Matrix (Updated Feb 2026)

| Service      | Type          | API | Free | No Auth | Quality |
| ------------ | ------------- | --- | ---- | ------- | ------- |
| **Iconify**  | Icons         | ✅   | ✅    | ✅       | ⭐⭐⭐⭐⭐   |
| **DiceBear** | Avatars       | ✅   | ✅    | ✅       | ⭐⭐⭐⭐    |
| **Lucide**   | Icons         | ✅   | ✅    | ✅       | ⭐⭐⭐⭐⭐   |
| unDraw       | Illustrations | ⚠️   | ✅    | ✅       | ⭐⭐⭐⭐⭐   |
| Flaticon     | Icons         | ✅   | ⚠️    | ❌       | ⭐⭐⭐⭐⭐   |
| Pictographic | Both          | ❌   | ❌    | ❌       | ⭐⭐⭐⭐⭐   |
| SVGRepo      | Icons         | ❌   | ✅    | ❌       | ⭐⭐⭐⭐    |

---

## Implementation Plan

### Phase 1: Current (Complete)
- ✅ Lucide icons bundled (60+)
- ✅ Stock geometric illustrations (8)
- ✅ User logo collection (PNG/JPG/SVG)
- ✅ Ticker-based company logos (Brandfetch/Logo.dev)

### Phase 2: Iconify Integration ⭐ NEXT

```typescript
// Add to illustrationService.ts
export async function fetchIconifyIcon(
  prefix: string,
  name: string,
  options: { color?: string; width?: number; height?: number } = {}
): Promise<string> {
  const params = new URLSearchParams();
  if (options.color) params.set('color', options.color);
  if (options.width) params.set('width', String(options.width));
  if (options.height) params.set('height', String(options.height));

  const query = params.toString();
  const url = `https://api.iconify.design/${prefix}/${name}.svg${query ? '?' + query : ''}`;

  const response = await fetch(url);
  return response.text();
}
```

**Syntax**: `![iconify:mdi/chart-line]` or `![iconify:heroicons/users#0550ae]`

**Icon Sets to Document**:
- `mdi` - Material Design (7,447 icons)
- `ph` - Phosphor (7,488 icons)
- `heroicons` - Heroicons (588 icons)
- `tabler` - Tabler (4,824 icons)
- `lucide` - Lucide remote (1,432 icons)
- `carbon` - IBM Carbon (2,126 icons)

### Phase 3: DiceBear for People/Avatars

```typescript
// Add to illustrationService.ts
export function getDiceBearUrl(
  seed: string,
  style: string = 'open-peeps',
  options: { backgroundColor?: string } = {}
): string {
  const params = new URLSearchParams();
  params.set('seed', seed);
  if (options.backgroundColor) params.set('backgroundColor', options.backgroundColor);

  return `https://api.dicebear.com/7.x/${style}/svg?${params}`;
}
```

**Syntax**: `![avatar:Alex]` or `![avatar:John#open-peeps]`

**Styles**: `avataaars`, `open-peeps`, `bottts`, `notionists`, `lorelei`

### Phase 4: Future Considerations
- Bundle curated unDraw illustrations (manual download)
- Bundle select Open Peeps static SVGs
- Consider Flaticon API if users need paid tier

---

## Cost Analysis

| Service    | Free Tier | Paid Tier | Alex Recommendation |
| ---------- | --------- | --------- | ------------------- |
| Iconify    | Unlimited | N/A       | ✅ Implement next    |
| DiceBear   | Unlimited | N/A       | ✅ Implement next    |
| Lucide     | Unlimited | N/A       | ✅ Already using     |
| Logo.dev   | 500K/mo   | $10/mo    | ✅ Already using     |
| Brandfetch | Free tier | Custom    | ✅ Already using     |
| Flaticon   | 100/day   | €9.99/mo  | ⏸️ Optional          |

**Total Cost for Full Feature**: $0/month (all free tiers)

---

## Appendix: Pictographic Style Examples

Based on CDN pattern analysis, Pictographic organizes illustrations by style:

```
/notion/      → Clean, minimal (like Notion's style)
/isometric/   → 3D isometric views
/flat/        → Flat 2D design
/outline/     → Line art style
/gradient/    → Rich gradient fills
/3d/          → 3D rendered scenes
/hand-drawn/  → Sketchy, organic feel
```

This style variety is what makes Pictographic attractive to Gamma. Our public alternatives cover different use cases:
- **Iconify** = 150K icons across all major design systems
- **DiceBear** = Unlimited generative people illustrations
- **Lucide** = Clean, consistent bundled icons

---

*Document maintained by Alex Cognitive Architecture*
*Last verified: February 7, 2026*
