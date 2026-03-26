---
description: "AI-generated README banner creation for project branding and marketing assets"
applyTo: "**/generate-readme*,**/*banner*"
---

# AI-Generated README Banners — Auto-Loaded Rules

Model selection, prompt engineering, Ideogram/Recraft/Flux parameters, Layout strategy → see ai-generated-readme-banners skill.
Before generating: read the Replicate API Starter Kit in the skill's resources/.

## Key Rules (Not in Skill)

**Brand Foundation First** — Define a BRAND constant before any generation:

```javascript
const BRAND = {
  name: "Project Name",
  tagline: "Brief tagline",
  colors: { primary: "#0078d4", secondary: "#7c3aed", background: "#080810" },
  visualElement: "rocket",
  aesthetic: "modern tech"
};
```

**Typography Limit** — Keep title text <10 characters to avoid AI artifacts:

```javascript
const SIMPLIFICATIONS = {
  'DOCUMENTATION': 'DOCS', 'ANALYSIS': 'INSIGHTS',
  'WRITING': 'STORIES', 'LEARNING': 'LEARN', 'REMEMBER': 'MEMORY',
};
```

100% clean typography with short text vs ~30% success with long words.

**Batch Processing** — 2-second delay between requests (15s if account has <$5 credit). Always save generation report JSON after batch runs.

**Default Format** — Recraft v4 SVG is the default for all banner requests (scalable, theme-aware, version-control friendly). Fall back to Ideogram v3 for photorealistic raster.
```

**Benefits**: Free text changes, multi-language support, accessibility

---

## Cost-Quality Analysis

| Approach | Cost | Quality | Typography | Use Case |
|----------|------|---------|------------|----------|
| Ideogram v2 | $0.08 | ⭐⭐⭐⭐⭐ Photorealistic | Perfect | Stable branding |
| Flux Pro | $0.04 | ⭐⭐⭐⭐ Excellent | N/A | Clean backgrounds |
| Flux Schnell | $0.003 | ⭐⭐⭐ Good | N/A | Rapid iteration |
| Flux + Markdown | $0.003-0.04 | ⭐⭐⭐⭐ | Markdown | Multi-language |

**Recommendation**: Ideogram v2 for professional projects ($0.08 exceptional ROI vs stock photos $10-$100).

---

## Banner Quality Review (VS Code 1.112+)

After generating banners, use the built-in `view_image` tool to assess output quality before committing:

- **Typography legibility**: Verify text is sharp, properly spelled, and readable at README scale
- **Brand color accuracy**: Confirm palette matches project branding guidelines
- **Composition balance**: Check visual weight distribution and element placement
- **Artifact detection**: Look for AI artifacts — smeared text, misshapen objects, inconsistent edges

For multi-variant generation, VS Code 1.112+'s image carousel enables side-by-side comparison without file switching.

---

## Common Pitfalls

### Ideogram Parameter Casing

❌ **Wrong**: `magic_prompt_option: 'ON'` → API error  
✅ **Correct**: `magic_prompt_option: 'On'` (case-sensitive!)

### Aspect Ratio Confusion

❌ **Wrong**: `aspect_ratio: '21:9'` → Ideogram doesn't support  
✅ **Correct**: `aspect_ratio: '3:1'` (Ideogram's widest)

### URL Extraction Quirk

Ideogram returns `output.url` as **getter function**, not string:

```javascript
// Robust extraction with fallbacks
let imageUrl;
if (typeof output.url === 'function') {
  imageUrl = output.url().toString();
} else if (output && output.url) {
  imageUrl = output.url;
}
```

### Long Text Typography Failure

❌ **Poor**: "DOCUMENTATION" (13 chars) → broken letters  
✅ **Better**: "DOCS" (4 chars) → perfect rendering

---

## Integration with README

**Display banner at top of README.md**:

```markdown
<div align="center">

![Project Name](assets/banner-with-text.png)

<!-- Optional additional branding -->

</div>

## About

[Your project description...]
```

**Generation note for contributors**:

```markdown
> **Generate new banner**: `npm run generate:banner`
> See [banner generation guide](docs/BANNER-GENERATION.md) for details.
```

---

## Cross-Project Applications

✅ **Validated use cases**:
- GitHub repository README headers (3:1 ratio perfect)
- Documentation portal hero images
- Project landing pages
- Social sharing images (Twitter, LinkedIn)
- Marketing materials and blog headers
- Personal branding (portfolios, profiles)

✅ **Validated projects**:
- **Alex Cognitive Architecture** (Feb 2026): 6 Ideogram banners, $0.48 total, quality rated "Amazing"
- **Alex in Wonderland** (Jan 2026): Genre-blending character illustration

---

## Auto-Load Behavior

This instruction file auto-loads when:
- Editing `README.md` files
- Working in `assets/` directories
- User mentions banner generation or project branding
- Banner generation scripts detected

**Purpose**: Provide immediate procedural context for professional README banner creation.
