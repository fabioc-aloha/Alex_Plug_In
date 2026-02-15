# AI-Generated README Banners Instructions

**Auto-loaded when**: Working with README files, project branding, marketing assets
**Domain**: Ultra-wide banner generation with professional typography using AI image generation
**Synapses**: [ai-generated-readme-banners/SKILL.md](..//skills/ai-generated-readme-banners/SKILL.md)

---

## Purpose

Auto-load procedural steps for generating stunning 3:1 ultra-wide README banners with photorealistic quality and professional typography. Optimized for GitHub repositories, documentation portals, and project landing pages.

---

## When This Applies

**File Patterns**:
- `**/README.md` — Repository documentation
- `**/assets/**` — Asset directories
- `**/*banner*.js` — Banner generation scripts
- `**/.github/**/*.md` — GitHub profile and repo documentation

**Contextual Triggers**:
- User mentions "README banner", "project branding", "hero image"
- Working on repository visual identity
- Setting up banner generation workflows

---

## Model Selection Decision Tree

### Use Ideogram v2 When:
- ✅ Typography needed (project title, tagline)
- ✅ Fixed branding (text won't change)
- ✅ Professional photorealistic quality required
- ✅ Budget allows $0.08 per banner
- ✅ Social sharing with embedded text

**Cost**: $0.08 per image, 10-20 second generation

### Use Flux (Schnell/Pro) When:
- ✅ Clean background only (add text via markdown)
- ✅ Text changes frequently
- ✅ Multi-language support needed
- ✅ Ultra-low budget ($0.003-$0.04)
- ✅ Rapid iteration required

**Cost**: $0.003 (Schnell) to $0.04 (Pro), 1-60 second generation

**Recommendation**: For professional projects with stable branding, Ideogram v2 delivers exceptional ROI at $0.08.

---

## Core Workflow: Typography Banners (Ideogram)

### 1. Brand Foundation

**Define visual identity constants**:

```javascript
const BRAND = {
  name: "Project Name",
  tagline: "Brief tagline or motto",
  colors: {
    primary: "#0078d4",      // Brand primary
    secondary: "#7c3aed",    // Brand accent
    background: "#080810",   // Deep background
  },
  visualElement: "rocket",    // Signature visual (rocket, logo, icon, etc.)
  aesthetic: "modern tech"    // Overall style
};
```

### 2. Banner Specifications

**Create banner variants for different contexts**:

```javascript
const BANNERS = [
  {
    id: 'primary-banner',
    filename: 'banner-primary.png',
    title: 'PROJECT NAME',        // Keep short (<15 chars for best typography)
    subtitle: 'Brief tagline',
    composition: 'centered',       // 'left', 'centered', 'right'
    focusAudience: 'developers',   // Adjusts visual metaphors
  },
  {
    id: 'variant-developer',
    filename: 'banner-dev.png',
    title: 'Take Your CODE to New Heights',
    subtitle: 'Project Name',
    composition: 'left',
    focusAudience: 'developers',
  },
  // Add 2-3 layout variations for comparison
];
```

### 3. Structured Prompt Engineering

**Build prompts with labeled sections**:

```javascript
function buildPrompt(banner, brand) {
  // Keep title text SHORT (<10 chars) for clean typography
  const displayTitle = banner.title.length > 10 
    ? abbreviate(banner.title)  // "DOCUMENTATION" → "DOCS"
    : banner.title;

  return `Professional technology banner (3:1 ultra-wide format).

TITLE TEXT (large, ${banner.composition}):
"${displayTitle}"
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
- Prominent but not overwhelming
- ${brand.aesthetic} aesthetic

BACKGROUND COMPOSITION (3:1 ultra-wide):
- Deep space gradient (${brand.colors.background} → darker)
- Scattered white stars creating depth
- Radial glow effects around visual element
- Professional cinematic atmosphere

LIGHTING:
- Dramatic key light on ${brand.visualElement}
- Subtle rim lighting creating depth
- Glow effects in brand colors (${brand.colors.primary}, ${brand.colors.secondary})
- Modern cinematic quality

COLOR PALETTE:
- Background: Deep blues and purples (${brand.colors.background})
- Accents: ${brand.colors.primary}, ${brand.colors.secondary}
- Text: White with subtle glow
- Visual element: Metallic with brand color accents

STYLE:
- Photorealistic 3D rendering
- ${brand.aesthetic} aesthetic
- Sharp detail, professional quality
- Cinematic composition

TEXT QUALITY CRITICAL:
- Crystal clear sharp text rendering
- No distortion or artifacts
- Perfect spelling: "${displayTitle}"
- Professional typographic hierarchy

MOOD: Inspiring, professional, cutting-edge technology`;
}
```

**Key Principles**:
- **Short text**: <10 characters prevents AI typography artifacts
- **Structured sections**: Labeled blocks (TITLE TEXT, BACKGROUND, etc.)
- **Explicit spelling**: Specify exact text in quotes
- **Hex color codes**: Brand color consistency
- **Composition rules**: Position visual elements explicitly

### 4. Ideogram v2 Generation

**Critical parameter casing**:

```javascript
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateBanner(banner, brand) {
  const prompt = buildPrompt(banner, brand);
  
  const input = {
    prompt,
    aspect_ratio: '3:1',              // Ideogram's widest format
    magic_prompt_option: 'On',        // CASE-SENSITIVE! Must be 'On', not 'ON'
    style_type: 'Realistic',          // Options: 'Realistic', 'Design', 'General'
    resolution: '1536x512',           // Explicit dimensions
    output_format: 'png',
  };

  const output = await replicate.run('ideogram-ai/ideogram-v2', { input });
  
  // Handle Ideogram URL getter function quirk
  let imageUrl;
  if (output && typeof output.url === 'function') {
    imageUrl = output.url().toString();
  } else if (Array.isArray(output)) {
    imageUrl = output[0];
  } else if (typeof output === 'string') {
    imageUrl = output;
  } else if (output && output.url) {
    imageUrl = output.url;
  }
  
  if (typeof imageUrl === 'object' && imageUrl.href) {
    imageUrl = imageUrl.href;
  }

  return imageUrl;
}
```

### 5. Batch Generation with Rate Limiting

**Process multiple banner variants**:

```javascript
const results = [];

for (const banner of BANNERS) {
  console.log(`🎨 Generating: ${banner.title}`);
  
  const imageUrl = await generateBanner(banner, BRAND);
  await downloadImage(imageUrl, `assets/${banner.filename}`);
  
  results.push({
    ...banner,
    url: imageUrl,
    timestamp: new Date().toISOString()
  });
  
  console.log(`✅ Saved: ${banner.filename}`);
  
  // Rate limiting: 2-second delay between requests
  // (15 seconds if account has <$5 credit)
  if (BANNERS.indexOf(banner) < BANNERS.length - 1) {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Save generation report
fs.writeJsonSync('assets/banner-generation-report.json', {
  generatedAt: new Date().toISOString(),
  model: 'ideogram-ai/ideogram-v2',
  brand: BRAND,
  results,
  totalCost: results.length * 0.08,
}, { spaces: 2 });
```

---

## Typography Quality Optimization

### Text Simplification Strategy

**Problem**: Long words produce AI typography artifacts (broken letters, strange glyphs)

**Solution**: Abbreviate text to <10 characters

```javascript
function abbreviate(text) {
  const SIMPLIFICATIONS = {
    'DOCUMENTATION': 'DOCS',
    'ANALYSIS': 'INSIGHTS',
    'WRITING': 'STORIES',
    'LEARNING': 'LEARN',
    'REMEMBER': 'MEMORY',
  };
  
  return SIMPLIFICATIONS[text] || text;
}
```

**Result**: 100% clean typography with short text vs ~30% success with long words.

---

## Layout Variation Strategy

**Generate multiple compositions for comparison**:

1. **Left-aligned**: Visual element on left, text on right
   - Best for: Reading flow, information hierarchy
   
2. **Centered**: Focal point in center, text below/above
   - Best for: Brand presence, visual impact

3. **Right-aligned**: Visual element on right, text on left
   - Best for: Design contrast, alternate layouts

**Benefits**:
- Side-by-side stakeholder review
- Audience targeting (developer focus vs student focus vs professional)
- A/B testing for social media
- Seasonal/campaign variations

**Cost**: 3 variations × $0.08 = $0.24

---

## Alternative Workflow: Clean Backgrounds (Flux)

### When to Use Flux Instead

- Text changes frequently (product names, versions)
- Multi-language documentation
- Ultra-low budget constraints
- Markdown overlay preferred

### Flux Schnell (Ultra-Fast)

```javascript
const output = await replicate.run('black-forest-labs/flux-schnell', {
  input: {
    prompt: "[Visual description only, NO text]",
    aspect_ratio: '21:9',
    output_format: 'png',
    num_outputs: 1,
  }
});
```

**Cost**: $0.003 per image, 1-2 second generation

### Markdown Text Overlay

```markdown
<div align="center">

![Banner Background](assets/banner-flux-clean.png)

# Project Name

**Your tagline or motto**

</div>
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
