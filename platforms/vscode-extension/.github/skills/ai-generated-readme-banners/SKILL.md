---
name: "ai-generated-readme-banners"
description: "Create professional ultra-wide cinematic banners for GitHub READMEs using modern AI image models with typography"
tier: standard
applyTo: '**/*banner*,**/*readme*,**/generate-readme*'
---

# AI-Generated README Banners

> Ultra-wide cinematic project branding — from ASCII art to professional visuals in minutes.

**Last Updated**: April 2026 | **Models Verified**: Replicate API

---

## Core Pattern

**Problem**: ASCII art and SVG banners are limited; professional banner design is expensive and time-consuming.

**Solution**: Generate ultra-wide photorealistic banners using modern AI models with crystal-clear typography, professional composition, and project-specific branding in minutes.

**Quality**: Current-generation models (Ideogram v3, Recraft v4, FLUX Kontext, Imagen 4) produce stunning photorealistic results with excellent text rendering.

---

## Model Selection Matrix (April 2026)

### Typography-Capable Models (Recommended for Banners)

| Model | Cost | Typography | Speed | Best For |
|-------|------|------------|-------|----------|
| **Ideogram v3 Turbo** | $0.03 | ✅ Excellent | ~6s | **Best value** — fast, cheap, great text |
| **Ideogram v3 Balanced** | $0.06 | ✅ Excellent | ~12s | Balance quality/cost |
| **Ideogram v3 Quality** | $0.09 | ✅ Best | ~20s | Premium + style references |
| **Recraft v4** | $0.04 | ✅ Integrated | ~10s | Design taste, art-directed |
| **Recraft v4 Pro** | varies | ✅ Integrated | ~28s | Print-ready 2048px |
| **FLUX Kontext Max** | $0.08 | ✅ Improved | ~5s | Image editing + typography |
| **Google Imagen 4** | $0.04 | ✅ Good | ~4s | Fine detail, versatile |
| **Imagen 4 Fast** | $0.02 | ✅ Good | <1s | 10× faster, budget |
| **Nano Banana Pro** | $0.15 | ✅ **Best** multilingual | ~60s | Complex layouts, infographics |
| **GPT Image 1.5** | $0.01-$0.14 | ✅ Strong | ~20s | Dense text, UI mockups |

### Clean Image Models (No/Limited Typography)

| Model | Cost | Best For |
|-------|------|----------|
| **FLUX 2 Max** | $0.04+ | Highest fidelity, 8 reference images |
| **FLUX 2 Pro** | ~$0.05 | Production quality, multi-reference |
| **FLUX 1.1 Pro** | $0.04 | Clean visuals, proven quality |
| **FLUX Schnell** | $0.003 | Testing, iteration |
| **Recraft v4 SVG** | varies | Native SVG output |

### Recommendations by Use Case

| Need | Model | Why |
|------|-------|-----|
| **Budget typography** | Ideogram v3 Turbo | $0.03, excellent results |
| **Premium quality** | Ideogram v3 Quality | Style references, best output |
| **Fastest iteration** | Imagen 4 Fast | Sub-second, $0.02 |
| **Design aesthetic** | Recraft v4 | "Design taste" built in |
| **SVG/vector** | Recraft v4 SVG | Native scalable output |
| **Complex text layouts** | Nano Banana Pro | Multilingual, infographics |
| **Image editing + text** | FLUX Kontext Max | Edit existing images |
| **Clean visuals (no text)** | FLUX 2 Max | Highest fidelity |

---

## Implementation Strategy

### 1. Default: Ideogram v3 Turbo (Best Value)

```javascript
const output = await replicate.run("ideogram-ai/ideogram-v3-turbo", {
  input: {
    prompt: BANNER_PROMPT,
    aspect_ratio: '3:1',              // Widest supported (NOT '21:9')
    magic_prompt_option: 'Auto',      // 'Auto', 'On', or 'Off'
    style_preset: 'None',             // Or: 'Art Deco', 'Pop Art', etc.
    output_format: 'png',
  }
});
```

### 2. SVG Format: Recraft v4 SVG

```javascript
const output = await replicate.run("recraft-ai/recraft-v4-svg", {
  input: {
    prompt: "Professional ultra-wide banner...",
    aspect_ratio: '16:9',             // Or: '1:1', '4:3', '3:2', '9:16'
  }
});
// Output is native SVG
await writeFile("banner.svg", output);
```

### 3. Highest Fidelity: FLUX 2 Max

```javascript
const output = await replicate.run("black-forest-labs/flux-2-max", {
  input: {
    prompt: BANNER_PROMPT,
    aspect_ratio: '21:9',             // Ultra-wide supported
    resolution: '2 MP',               // Up to 4 MP available
    output_format: 'webp',
  }
});
```

### Aspect Ratio Quick Reference

| Model Family | Ultra-Wide | Wide | Standard |
|--------------|------------|------|----------|
| Ideogram | `3:1` | `16:9` | `1:1` |
| FLUX 2.x | `21:9` | `16:9` | `1:1` |
| Recraft v4 | `16:9` | `4:3`, `3:2` | `1:1` |
| Imagen 4 | ❌ | `16:9` | `1:1`, `4:3` |

**Note**: Ideogram uses `3:1` for ultra-wide (NOT `21:9`).

---

## Banner Prompt Engineering

### Compositional Structure for Ultra-Wide Format

```
- Left side: Main character/protagonist (1/3)
- Center: Thematic element/focal point (1/3)
- Right side: Environmental/world context (1/3)
```

### Example Prompt Structure

```
Cinematic ultra-wide banner illustration for "[PROJECT NAME]" header.
[Genre/aesthetic description]

COMPOSITION (21:9 or 3:1 ultra-wide cinematic format):
- Left: [Character with specific details]
- Center: [Thematic focal point]
- Right: [Environment, atmosphere]

LIGHTING:
- [Specific techniques for each zone]

STYLE:
- [Art direction, realism level]

COLOR PALETTE:
- [Dominant colors, accents]

MOOD: [Emotional tone]
```

---

## Typography Banners (Ideogram v3)

### When to Add Text

- ✅ Project title needs immediate visibility
- ✅ Brand recognition through typography
- ✅ Standalone banner for social sharing
- ❌ Text changes frequently
- ❌ Multi-language support needed (use Nano Banana Pro instead)

### Ideogram v3 Parameters (Current — April 2026)

```javascript
// v3 Turbo — $0.03/image, fastest, best value
const input = {
  prompt: BANNER_PROMPT,
  aspect_ratio: '3:1',                   // Ideogram's widest (NOT '21:9')
  magic_prompt_option: 'Auto',           // 'Auto', 'On', or 'Off' (case-sensitive!)
  style_preset: 'None',                  // 80+ presets available
  style_reference_images: [],            // Up to 3 reference images (v3 only)
  output_format: 'png',
};

// Model IDs:
// ideogram-ai/ideogram-v3-turbo     $0.03 — fastest, best value
// ideogram-ai/ideogram-v3-balanced  $0.06 — quality/speed balance
// ideogram-ai/ideogram-v3-quality   $0.09 — highest quality, style refs
```

**Style Presets** (v3 new feature):
- `None`, `80s Illustration`, `Art Deco`, `Watercolor`, `Oil Painting`
- `Pop Art`, `Vintage Poster`, `Magazine Editorial`, `Graffiti`, `Bauhaus`
- `Collage`, `Cyberpunk`, `Steampunk`, `Minimalist`, `Maximalist`
- 60+ more presets available

### Ideogram v2 Parameters (Proven — Stable Fallback)

```javascript
const input = {
  prompt: BANNER_PROMPT,
  aspect_ratio: '3:1',                  // Ideogram's widest (NOT '21:9')
  magic_prompt_option: 'On',            // 'On', 'Off', or 'Auto' (case-sensitive!)
  style_type: 'Realistic',              // v2 only: 'Realistic', 'General', 'Design'
  resolution: '1536x512',
  output_format: 'png',
};
```

### Common Ideogram Mistakes

- ❌ `magic_prompt_option: 'ON'` → Must be `'On'` (case-sensitive)
- ❌ `style_type: 'CINEMATIC'` → Invalid, use `'Realistic'`
- ❌ `aspect_ratio: '21:9'` → Ideogram doesn't support, use `'3:1'`
- ❌ `style_preset` on v2 → Only v3 supports presets

### Ideogram URL Handling Quirk

```javascript
// Ideogram sometimes returns URL as getter function, not string
let imageUrl;
if (output && typeof output.url === 'function') {
  imageUrl = output.url().toString();
} else if (Array.isArray(output)) {
  imageUrl = output[0];
} else if (typeof output === 'string') {
  imageUrl = output;
} else if (output && output.url) {
  imageUrl = typeof output.url === 'object' && output.url.href 
    ? output.url.href 
    : output.url;
}
```

---

## Alternative Typography Models

### Recraft v4 (Design-Focused)

```javascript
const output = await replicate.run("recraft-ai/recraft-v4", {
  input: {
    prompt: BANNER_PROMPT,        // Up to 10,000 characters
    aspect_ratio: '16:9',         // '1:1', '4:3', '3:2', '16:9', '9:16'
  }
});
```

**Recraft strengths**: "Design taste" built in, integrated text as structural element, coherent composition.

### Google Imagen 4

```javascript
const output = await replicate.run("google/imagen-4", {
  input: {
    prompt: BANNER_PROMPT,
    aspect_ratio: '16:9',         // '1:1', '9:16', '16:9', '3:4', '4:3'
    safety_filter_level: 'medium',
    output_format: 'webp',        // Or 'png'
  }
});
```

**Imagen 4 strengths**: Fine detail, fast (~4s), good typography, versatile styles.

### Google Nano Banana Pro (Complex Text)

```javascript
const output = await replicate.run("google/nano-banana-pro", {
  input: {
    prompt: BANNER_PROMPT,
    aspect_ratio: '16:9',
    reference_images: [],         // Up to 14 reference images!
    output_format: 'webp',
  }
});
```

**Nano Banana Pro strengths**: Best multilingual text, infographics, complex layouts, 4K output.

### OpenAI GPT Image 1.5 (Dense Text)

```javascript
const output = await replicate.run("openai/gpt-image-1.5", {
  input: {
    prompt: BANNER_PROMPT,
    quality: 'medium',            // 'low' ($0.01), 'medium' ($0.05), 'high' ($0.14)
    size: '1536x1024',
  }
});
```

**GPT Image 1.5 strengths**: Dense text layouts, UI mockups, precise editing, identity preservation.

### FLUX Kontext Max (Edit + Typography)

```javascript
const output = await replicate.run("black-forest-labs/flux-kontext-max", {
  input: {
    prompt: "Add the text 'PROJECT NAME' in bold...",
    input_image: existingImageUrl,  // Edit existing images
    aspect_ratio: '21:9',
  }
});
```

**Kontext strengths**: Edit existing images, add text overlays, improve typography in existing banners.

---

## Typography Prompt Pattern (Validated)

**Structure**: Use clear labeled sections for best results with any typography model.

```
Professional technology banner (3:1 ultra-wide format).

TITLE TEXT (large, centered):
"[EXACT TEXT]"
- Bold modern sans-serif, uppercase
- [Color specification or gradient]
- Crystal clear, perfectly legible
- Sharp crisp lettering

SUBTITLE TEXT (below title):
"[Exact subtitle]"
- Clean font, [color]
- Readable professional typography

[VISUAL ELEMENTS]:
- [Specific objects, positioned where]
- [Prominent features, branding elements]
- Photorealistic 3D rendering

BOTTOM [CORNER] (optional):
- [Logo mark description]
- "[Brand text]" in [color]

BACKGROUND COMPOSITION (3:1 ultra-wide):
- [Gradient colors with hex codes]
- [Atmospheric elements: stars, particles, etc.]
- [Lighting effects: glows, halos]

LIGHTING:
- [Specific lighting techniques]
- [Glow sources and colors]
- Modern cinematic quality

COLOR PALETTE:
- Background: [hex codes]
- Accents: [hex codes]
- Text: [color with effects]

STYLE:
- Photorealistic 3D rendering
- [Aesthetic description]
- Sharp detail, cinematic quality

TEXT QUALITY CRITICAL:
- Crystal clear text rendering
- No distortion whatsoever
- Perfect spelling: "[EXACT TEXT]"
- Professional typographic hierarchy

MOOD: [Emotional tone, brand feeling]
```

**Key Principles**:
1. **Explicit spelling in quotes** — always specify exact text
2. **Structured sections** — TITLE TEXT, SUBTITLE TEXT, BACKGROUND, etc.
3. **Crystal clear demands** — "crystal clear", "sharp", "perfectly legible"
4. **Hex color codes** — specific colors (#0078d4) for brand consistency
5. **Layout variations** — left-aligned, centered, right-aligned for variety
6. **Photorealistic 3D** — emphasize render quality in prompt
7. **TEXT QUALITY CRITICAL section** — reinforces typography requirements

---

## Layout Variations Strategy

**Generate multiple composition variations** for visual comparison:

1. **Left-aligned** — Visual element on left, text on right
2. **Centered** — Centered focal point, text below
3. **Right-aligned** — Visual element on right, text on left

**Benefits**:
- Side-by-side comparison for stakeholder review
- Audience targeting (different focus areas per banner)
- A/B testing on social media
- Seasonal/campaign variations

**Cost (3 variations)**:
- Ideogram v3 Turbo: $0.09 (best value)
- Imagen 4 Fast: $0.06 (fastest)
- Ideogram v3 Quality: $0.27 (premium)

---

## Cost Comparison (April 2026)

### Best Value Typography Options

| Model | Single | 3 Variants | Quality | Speed |
|-------|--------|------------|---------|-------|
| **Ideogram v3 Turbo** | $0.03 | $0.09 | Excellent | ~6s |
| **Imagen 4 Fast** | $0.02 | $0.06 | Good | <1s |
| **Recraft v4** | $0.04 | $0.12 | Excellent | ~10s |
| **Imagen 4** | $0.04 | $0.12 | Good | ~4s |
| GPT Image 1.5 (low) | $0.01 | $0.03 | Good | ~20s |
| GPT Image 1.5 (med) | $0.05 | $0.15 | Better | ~20s |
| Ideogram v3 Quality | $0.09 | $0.27 | Best | ~20s |
| Nano Banana Pro | $0.15+ | $0.45+ | Excellent | ~60s |

### Clean Visuals (No Typography)

| Model | Cost | Use Case |
|-------|------|----------|
| FLUX Schnell | $0.003 | Testing, iteration |
| FLUX 1.1 Pro | $0.04 | Production quality |
| FLUX 2 Max | $0.04+ | Highest fidelity |

### Recommendations

- **Budget + Good**: Ideogram v3 Turbo ($0.03) or Imagen 4 Fast ($0.02)
- **Balanced**: Recraft v4 ($0.04) — design taste built in
- **Premium**: Ideogram v3 Quality ($0.09) — style references
- **Complex layouts**: Nano Banana Pro ($0.15) — multilingual, infographics
- **Iteration**: FLUX Schnell ($0.003) + markdown overlay

---

## Script Templates

### Recommended: Ideogram v3 Turbo (Best Value)

```javascript
import Replicate from 'replicate';
import fs from 'fs-extra';
import https from 'https';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const BANNER_PROMPT = `Professional technology banner (3:1 ultra-wide format).

TITLE TEXT (large, centered):
"PROJECT NAME"
- Bold modern sans-serif, uppercase
- Gradient from deep blue to vibrant purple
- Crystal clear, perfectly legible

BACKGROUND COMPOSITION:
- Deep space gradient (#080810 → #0d1520)
- Modern tech geometric patterns
- Radial glow effects

COLOR PALETTE:
- Background: Deep blue (#0078d4), purple (#7c3aed)
- Text: White with blue glow

TEXT QUALITY CRITICAL:
- Crystal clear sharp letterforms
- Perfect spelling: "PROJECT NAME"

MOOD: Inspiring, professional, cutting-edge technology`;

const output = await replicate.run('ideogram-ai/ideogram-v3-turbo', {
  input: {
    prompt: BANNER_PROMPT,
    aspect_ratio: '3:1',
    magic_prompt_option: 'Auto',
    style_preset: 'None',          // Or 'Cyberpunk', 'Art Deco', etc.
    output_format: 'png',
  }
});

// Handle various output formats
let imageUrl = Array.isArray(output) ? output[0] : output;
if (typeof imageUrl === 'object') {
  imageUrl = imageUrl.url?.() || imageUrl.url || imageUrl.href;
}

await downloadImage(imageUrl.toString(), 'assets/banner.png');
console.log('✅ Banner generated: assets/banner.png');
console.log('💰 Cost: $0.03');
```

### Alternative: Recraft v4 (Design Aesthetic)

```javascript
const output = await replicate.run('recraft-ai/recraft-v4', {
  input: {
    prompt: `Ultra-wide banner for "PROJECT NAME" with integrated typography.
Modern tech aesthetic, gradient blues and purples, geometric patterns.
Clean professional design with bold title text.`,
    aspect_ratio: '16:9',
  }
});

// Recraft returns direct URL
await downloadImage(output[0], 'assets/banner-recraft.png');
console.log('💰 Cost: $0.04');
```

### Alternative: Clean + Markdown (FLUX 2)

```javascript
const output = await replicate.run('black-forest-labs/flux-2-max', {
  input: {
    prompt: `Ultra-wide cinematic banner for technology project.
Deep space gradient, scattered stars, radial glow.
Modern tech aesthetic, geometric patterns.
NO TEXT - clean visual composition.`,
    aspect_ratio: '21:9',
    resolution: '2 MP',
    output_format: 'webp',
  }
});

await downloadImage(output, 'assets/banner-clean.webp');
console.log('💰 Cost: ~$0.04');
// Add text via markdown overlay in README
```

### Helper: Download Image

```javascript
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : require('http');
    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadImage(response.headers.location, filepath)
          .then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}
```

### Batch Generation with Rate Limiting

```javascript
const BANNERS = [
  { id: 'main', filename: 'banner-main.png', title: 'PROJECT NAME' },
  { id: 'dev', filename: 'banner-dev.png', title: 'FOR DEVELOPERS' },
  { id: 'learn', filename: 'banner-learn.png', title: 'START LEARNING' },
];

for (const banner of BANNERS) {
  const output = await replicate.run('ideogram-ai/ideogram-v3-turbo', {
    input: {
      prompt: createPrompt(banner.title),
      aspect_ratio: '3:1',
      magic_prompt_option: 'Auto',
      output_format: 'png',
    }
  });
  
  let url = Array.isArray(output) ? output[0] : output;
  if (typeof url === 'object') url = url.url?.() || url.url || url.href;
  
  await downloadImage(url.toString(), `assets/${banner.filename}`);
  console.log(`✅ ${banner.filename}`);
  
  // Rate limiting: 2 seconds between requests
  await new Promise(r => setTimeout(r, 2000));
}

console.log(`💰 Total: $${(BANNERS.length * 0.03).toFixed(2)}`);
```
```

### Package.json Integration

```json
{
  "scripts": {
    "generate:banner": "node scripts/generate-banner.js",
    "generate:banner-text": "node scripts/generate-banner-with-text.js"
  }
}
```

---

## README Integration

### With Typography (Ideogram/Recraft)

```markdown
<div align="center">

![Project Name](assets/banner.png)

**[Tagline]**

</div>

<!-- Generate: npm run generate:banner-text -->
```

### Without Typography (FLUX + Markdown)

```markdown
<div align="center">

![Project Name](assets/banner-clean.webp)

# Project Name

**[Tagline]**

</div>

<!-- Generate: npm run generate:banner -->
```

---

## Key Insights

### Model Selection Strategy

| Priority | Choose | When |
|----------|--------|------|
| Budget | Ideogram v3 Turbo | Most use cases |
| Speed | Imagen 4 Fast | Rapid iteration |
| Quality | Ideogram v3 Quality | Final production |
| Design | Recraft v4 | Art-directed work |
| Complex | Nano Banana Pro | Multilingual, infographics |
| Vector | Recraft v4 SVG | Scalable output |
| Edit | FLUX Kontext Max | Modify existing |

### Structured Prompts = Better Results

**Pattern**: Use labeled sections (TITLE TEXT, BACKGROUND, LIGHTING, etc.)

**Why it works**:
- Models parse structured input more reliably
- Clear hierarchy produces professional composition
- Explicit requirements prevent ambiguity
- Easier to iterate and refine specific sections

### Brand Consistency Through Hex Codes

**Technique**: Specify exact hex codes in prompts
- Background: Deep space blue (#080810 → #0d1520)
- Primary: Azure blue (#0078d4)
- Accent: Vibrant purple (#7c3aed)
- Highlight: Electric teal (#14b8a6)

### Rate Limiting Best Practice

```javascript
await new Promise(resolve => setTimeout(resolve, 2000));
```

**Requirement**: 2-second delay between Replicate API calls to prevent rate limit errors.

---

## Visual Verification (VS Code 1.112+)

After generation, use `view_image` to assess banner quality:

- **Typography legibility** — Text is sharp, correctly spelled, readable at README scale
- **Brand color accuracy** — Palette matches project branding guidelines
- **Composition balance** — Visual weight distributed evenly, no awkward cropping
- **Artifact detection** — No smeared text, misshapen objects, or inconsistent edges

---

## Cross-Project Applicability

✅ **Ideal use cases**:
- GitHub README headers (3:1 aspect ratio)
- Project landing pages
- Documentation portals
- Marketing materials
- Multi-variant A/B campaigns
- Personal branding (LinkedIn, portfolio)

❌ **Not ideal**:
- Social media (need 1:1, 4:5, 16:9 ratios)
- Book covers (need portrait 2:3, 4:5)
- Character references (need square 1:1)
- Frequent text changes (use FLUX + markdown)

---

## Real-World Validation

**Alex Cognitive Architecture** (February-April 2026):
- ✅ 6 banners with Ideogram v2 → migrated to v3 Turbo
- ✅ Perfect text rendering with brand colors
- ✅ 63% cost reduction with v3 Turbo ($0.48 → $0.18 for 6 banners)
- ✅ Quality maintained or improved

**Validated Models** (April 2026):
- Ideogram v3 Turbo: Excellent typography, best value
- Recraft v4: Strong design aesthetic
- FLUX 2 Max: Highest fidelity clean images
- Imagen 4: Fast, good quality

**Key Learning**: Ideogram v3 Turbo is the new gold standard — 63% cheaper than v2 with equivalent or better quality.
