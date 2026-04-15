---
description: "AI-generated README banner creation for project branding and marketing assets"
application: "When generating images, managing visual assets, or maintaining brand consistency"
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

Cost-quality analysis, common pitfalls (Ideogram casing, URL extraction), integration patterns, cross-project examples → see ai-generated-readme-banners skill.
