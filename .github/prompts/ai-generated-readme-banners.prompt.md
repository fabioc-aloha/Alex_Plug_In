# AI-Generated README Banner Workflow

> **Avatar**: Call `alex_cognitive_state_update` with `state: "building"`. This updates the welcome sidebar avatar.

**Invoke with**: `/ai-generated-readme-banners` or "generate README banner"
**Domain**: Professional ultra-wide banner generation for GitHub repositories and documentation
**Synapses**: [ai-generated-readme-banners/SKILL.md](../skills/ai-generated-readme-banners/SKILL.md)

---

## Workflow Overview

This guided workflow helps you generate professional 3:1 ultra-wide README banners with stunning typography and photorealistic visuals using Ideogram v2. Perfect for GitHub repositories, documentation portals, project landing pages, and marketing materials.

**Duration**: 15-20 minutes (planning + generation)
**Cost**: $0.08 per banner (or $0.24 for 3 layout variations)
**Output**: 1536×512 PNG with embedded typography and brand visuals

---

## Phase 1: Brand Foundation

### Step 1: Define Visual Identity

**Core brand elements**:

```
Project Name: [Your project name]
Tagline: [Brief motto or value proposition]

Brand Colors:
  - Primary: #______ [Hex code]
  - Secondary: #______ [Hex code]
  - Background: #______ [Hex code]

Visual Element: [What represents your project?]
  Examples: rocket, brain, shield, tree, book, lightbulb, cube
  
Aesthetic Style: [Overall visual mood]
  Examples: "modern tech", "organic natural", "cyberpunk futuristic", "professional corporate"
```

### Step 2: Text Optimization

**Keep title SHORT for clean typography**:

| Original | Optimized |
|----------|-----------|
| DOCUMENTATION | DOCS |
| ANALYSIS | INSIGHTS |
| WRITING | STORIES |
| LEARNING | LEARN |

**Rule**: <10 characters for perfect AI typography. Longer text produces broken letters.

**Your optimized title**: __________________

---

## Phase 2: Banner Design

### Step 3: Layout Strategy

**Choose composition approach**:

- [ ] **Single primary banner** — One canonical banner ($0.08)
- [ ] **Three variations** — Left/center/right alignment for comparison ($0.24)
- [ ] **Audience targeting** — Different text for different audiences ($0.08-0.24)

**Recommended**: Generate 3 variations for visual selection, then use best as primary.

### Step 4: Banner Specifications

**For each banner variant**:

**Banner 1: Primary**
- Title: __________________ (<10 chars)
- Subtitle: __________________
- Composition: [ ] Left [ ] Centered [ ] Right
- Target Audience: __________________

**Banner 2: Variation (optional)**
- Title: __________________
- Subtitle: __________________
- Composition: [ ] Left [ ] Centered [ ] Right
- Target Audience: __________________

**Banner 3: Variation (optional)**
- Title: __________________
- Subtitle: __________________
- Composition: [ ] Left [ ] Centered [ ] Right
- Target Audience: __________________

---

## Phase 3: Technical Setup

### Step 5: Environment Preparation

**Required**:
1. Replicate API account: https://replicate.com
2. API token set in environment: `REPLICATE_API_TOKEN`
3. Node.js installed with `replicate` and `fs-extra` packages

**Install dependencies**:
```bash
npm install replicate fs-extra
```

**Directory structure**:
```
project-root/
  assets/
    banner-primary.png
    banner-variation-1.png (optional)
    banner-variation-2.png (optional)
    banner-generation-report.json
  scripts/
    generate-banner.js
```

### Step 6: Script Configuration

**Create generate-banner.js** with:

```javascript
import Replicate from 'replicate';
import fs from 'fs-extra';
import https from 'https';

const BRAND = {
  name: "[Your project name]",
  tagline: "[Your tagline]",
  colors: {
    primary: "[Hex code]",
    secondary: "[Hex code]",
    background: "[Hex code]",
  },
  visualElement: "[rocket/brain/etc.]",
  aesthetic: "[modern tech/etc.]"
};

const BANNERS = [
  {
    id: 'primary-banner',
    filename: 'banner-primary.png',
    title: '[SHORT TITLE]',        // <10 chars!
    subtitle: '[Subtitle]',
    composition: 'centered',         // 'left', 'centered', 'right'
  },
  // Add more variants if desired
];

// (Include buildPrompt(), generateBanner(), downloadImage() functions)
// See full template in ai-generated-readme-banners/SKILL.md
```

---

## Phase 4: Prompt Engineering

### Step 7: Build Structured Prompt

**For each banner, create composite prompt**:

```javascript
function buildPrompt(banner, brand) {
  return `Professional technology banner (3:1 ultra-wide format).

TITLE TEXT (large, ${banner.composition}):
"${banner.title}"
- Bold modern sans-serif, uppercase
- Gradient from ${brand.colors.primary} to ${brand.colors.secondary}
- Crystal clear, perfectly legible
- Sharp crisp letterforms

SUBTITLE TEXT (below title):
"${banner.subtitle}"
- Clean font, white text
- Readable professional typography

VISUAL ELEMENTS:
- Photorealistic 3D ${brand.visualElement}
- Positioned ${getPositionForComposition(banner.composition)}
- ${brand.aesthetic} aesthetic

BACKGROUND COMPOSITION (3:1 ultra-wide):
- Deep space gradient (${brand.colors.background} → darker)
- Scattered white stars creating depth
- Radial glow effects
- Professional cinematic atmosphere

LIGHTING:
- Dramatic key light on ${brand.visualElement}
- Glow effects in ${brand.colors.primary}, ${brand.colors.secondary}
- Modern cinematic quality

COLOR PALETTE:
- Background: ${brand.colors.background}
- Accents: ${brand.colors.primary}, ${brand.colors.secondary}
- Text: White with subtle glow

STYLE:
- Photorealistic 3D rendering
- ${brand.aesthetic} aesthetic
- Sharp detail, professional quality

TEXT QUALITY CRITICAL:
- Crystal clear sharp text rendering
- Perfect spelling: "${banner.title}"
- Professional typographic hierarchy

MOOD: Inspiring, professional, cutting-edge technology`;
}
```

**Key sections**:
- **TITLE TEXT**: Exact text, composition, style
- **SUBTITLE TEXT**: Supporting text
- **VISUAL ELEMENTS**: 3D objects, brand symbols
- **BACKGROUND**: Gradient, stars, atmosphere
- **LIGHTING**: Dramatic effects, glows
- **COLOR PALETTE**: Hex codes for brand consistency
- **TEXT QUALITY CRITICAL**: Reinforces typography requirements

---

## Phase 5: Generation

### Step 8: Execute Generation

**Run script**:
```bash
node scripts/generate-banner.js
```

**Critical Ideogram parameters** (case-sensitive!):
```javascript
const input = {
  prompt: prompt,
  aspect_ratio: '3:1',              // NOT '21:9'!
  magic_prompt_option: 'On',        // Must be 'On', not 'ON'!
  style_type: 'Realistic',          // Options: 'Realistic', 'Design', 'General'
  resolution: '1536x512',
  output_format: 'png',
};
```

**Monitor output**:
- Generation progress logs
- URL outputs for verification
- Cost tracking ($0.08 per banner)

**Duration**: 10-20 seconds per banner

### Step 9: Quality Validation

**Review checklist**:
- [ ] Text perfectly legible (no broken letters)
- [ ] Correct spelling of title and subtitle
- [ ] Brand colors accurate (compare hex codes)
- [ ] Visual element prominent but balanced
- [ ] 3:1 aspect ratio correct (1536×512)
- [ ] Professional quality suitable for public display

**If typography issues detected**:
- Shorten title text (aim for <10 characters)
- Regenerate with simplified text

---

## Phase 6: Integration

### Step 10: README Implementation

**Add banner to README.md**:

```markdown
<div align="center">

![Project Name](assets/banner-primary.png)

<!-- Optional: additional branding or badges -->

</div>

## About

[Your project description...]
```

**For contributor documentation** (optional):

```markdown
---

## Banner Generation

Generate new banners:
```bash
npm run generate:banner
```

See [Banner Generation Guide](docs/BANNER-GENERATION.md) for details.

**Cost**: $0.08 per banner (Ideogram v2)
**Quality**: Photorealistic professional grade
```

### Step 11: File Organization

**Organize outputs**:
```
assets/
  banner-primary.png              (your chosen primary banner)
  banner-variation-1.png          (optional alternatives)
  banner-variation-2.png
  banner-generation-report.json   (metadata)
scripts/
  generate-banner.js              (generation script)
docs/
  BANNER-GENERATION.md            (optional: contributor guide)
```

**Generation report includes**:
- Timestamp
- Model version (ideogram-ai/ideogram-v2)
- Brand configuration
- Banner specifications
- Replicate URLs
- Total cost

---

## Cost Analysis

**Single Banner**:
- 1 banner × $0.08 = **$0.08**
- Generation time: 10-20 seconds

**Three Variations** (recommended):
- 3 banners × $0.08 = **$0.24**
- Choose best for primary, keep alternates for campaigns
- Generation time: 30-60 seconds total

**Comparison**:
- Stock photo license: $10-$100+ per image
- Custom illustration: $200-$500+
- AI generation: $0.08
- **Savings**: 99%+

**ROI**: Exceptional value for professional-grade photorealistic output.

---

## Alternative Approach: Clean Backgrounds + Markdown

**When to use**:
- Text changes frequently (versions, product names)
- Multi-language documentation
- Budget <$0.01 per banner

**Workflow**:

1. **Generate clean background with Flux Schnell**:
```javascript
const output = await replicate.run('black-forest-labs/flux-schnell', {
  input: {
    prompt: "[Visual description, NO text]",
    aspect_ratio: '21:9',
    output_format: 'png',
  }
});
```

**Cost**: $0.003 per image, 1-2 second generation

2. **Add text via markdown**:
```markdown
<div align="center">

![Banner](assets/banner-clean.png)

# Project Name

**Your tagline or motto**

</div>
```

**Benefits**: Free text updates, accessibility, multi-language support

---

## Troubleshooting

### Issue: Broken Typography

**Symptom**: Strange letters, distorted text

**Solution**: Shorten title to <10 characters
- "DOCUMENTATION" (13 chars) → "DOCS" (4 chars)
- "ANALYSIS" (8 chars) → "INSIGHTS" (8 chars) [borderline]

### Issue: Wrong Aspect Ratio

**Symptom**: Banner not ultra-wide (3:1)

**Solution**: Use `aspect_ratio: '3:1'` (NOT `'21:9'` — Ideogram doesn't support)

### Issue: Parameter Errors

**Symptom**: API rejection with "invalid parameter"

**Solution**: Check case-sensitivity
- ✅ `magic_prompt_option: 'On'`
- ❌ `magic_prompt_option: 'ON'` or `'on'`

### Issue: URL Extraction Fails

**Symptom**: Cannot download image

**Solution**: Ideogram returns URL as getter function

```javascript
let imageUrl;
if (typeof output.url === 'function') {
  imageUrl = output.url().toString();
} else {
  imageUrl = output.url;
}
```

### Issue: Inconsistent Brand Colors

**Symptom**: Colors don't match brand palette

**Solution**: Use explicit hex codes in prompt
- Specify exact colors: `#0078d4` (Azure blue)
- Add "COLOR PALETTE" section to prompt
- Reference hex codes multiple times for reinforcement

---

## Layout Variation Examples

**Left-Aligned**:
- Visual element on left (30% width)
- Text on right (bold, prominent)
- **Best for**: Information hierarchy, reading flow

**Centered**:
- Visual element in center
- Text above or below
- **Best for**: Brand presence, visual impact

**Right-Aligned**:
- Visual element on right (30% width)
- Text on left
- **Best for**: Design variety, alternate campaigns

**Generate all 3**, compare side-by-side, choose primary. Cost: $0.24 total.

---

## Real-World Examples

**Alex Cognitive Architecture** (Feb 2026):
- 6 Ideogram v2 banners generated
- Typography: ALEX, LEARN·REMEMBER·GROW, COGNITIVE SYMBIOSIS
- Variations: CODE, LEARNING, CAREER audience targeting
- Total cost: $0.48
- Quality assessment: **"Amazing — far exceeded expectations"**

**Lessons learned**:
- Short text (<10 chars) = perfect typography
- Structured prompts = consistent high quality
- Layout variations = valuable stakeholder comparison
- $0.08 exceptional ROI for photorealistic output

---

## Completion Checklist

- [ ] Brand foundation defined (name, tagline, colors, visual element)
- [ ] Title text optimized (<10 characters)
- [ ] Banner specifications created (1-3 variants)
- [ ] Generation script configured with brand data
- [ ] Replicate API token set and validated
- [ ] Banners generated successfully (100% quality)
- [ ] Primary banner selected (if multiple variants)
- [ ] README.md updated with banner integration
- [ ] Files organized in assets/ directory
- [ ] Generation report saved for record-keeping

**You now have a professional README banner for your project!**


> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` to reset to project-appropriate avatar.