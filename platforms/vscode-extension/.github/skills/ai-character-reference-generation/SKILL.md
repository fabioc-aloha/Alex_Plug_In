---
name: "ai-character-reference-generation"
description: "Generate consistent visual character references across multiple scenarios using Flux and nano-banana-pro on Replicate"
---

# AI Character Reference Generation

> Create 17+ consistent character poses from detailed prompts — no reference images needed.

> ⚠️ **Staleness Watch** (Last validated: July 2025 — Flux 1.1 Pro; Feb 2026 — nano-banana-pro): Image generation models on Replicate release new versions and deprecate old ones. Before generating, verify the model identifier at [replicate.com/black-forest-labs](https://replicate.com/black-forest-labs). **Upgrade path**: `black-forest-labs/flux-1.1-pro-ultra` provides higher resolution (up to 4MP) with the same API surface. `black-forest-labs/flux-2-pro` adds multi-reference editing. `google/nano-banana-2` is the faster/cheaper successor to nano-banana-pro (same `image_input` API). Input parameter schema may change between model versions.

---

## Model Selection Guide

### Recommended Models by Use Case

| Use Case | Model | Cost | Notes |
|----------|-------|------|-------|
| **Face Consistency (Recommended)** | `google/nano-banana-pro` | $0.025/image | **Best for maintaining face identity** — uses reference image + prompt. Up to 14 refs, 4K output. |
| **Face Consistency (Fast/Cheap)** | `google/nano-banana-2` | $0.067/1K img | Same `image_input` API as nano-banana-pro. Faster (Gemini 3.1 Flash), similar quality. |
| **Detailed Scenes** | `black-forest-labs/flux-1.1-pro` | $0.04/image | High-quality scenes without face reference. Good for backgrounds and environments. |
| **Multi-Reference High Quality** | `black-forest-labs/flux-2-pro` | ~$0.05+ | Up to 8 refs via `input_images`. Text rendering + photorealism. |
| **Agent Banners** | `ideogram-ai/ideogram-v3-turbo` | $0.03/image | Best for stylized text + character combinations. Cheapest typography option. |
| **High Resolution** | `black-forest-labs/flux-1.1-pro-ultra` | $0.06/image | Up to 4MP output. Use when print-quality needed. |

### Face Consistency Pattern (Nano-Banana Pro)

**The Key Insight**: For consistent character faces across multiple poses/scenarios, use reference face images with nano-banana-pro:

```javascript
// Build array of reference image data URIs
function toDataURI(filepath) {
  const buffer = readFileSync(filepath);
  const ext = filepath.endsWith(".png") ? "png" : "jpeg";
  return `data:image/${ext};base64,${buffer.toString("base64")}`;
}

const referenceURIs = referencePhotos.map(p => toDataURI(p));

const response = await replicate.run("google/nano-banana-pro", {
  input: {
    prompt: `${CHARACTER_DESC}, ${scenario.attire}, ${scenario.pose}, ${STYLE}`,
    image_input: referenceURIs,  // Array of data URIs (up to 14 refs)
    aspect_ratio: "1:1",  // Square for avatars
    output_format: "png"
  }
});
```

> **Critical**: The parameter is `image_input` (array), not `image` (single). More references = better face consistency. For flux-2-pro, use `input_images` instead (up to 8 refs).

**Cost Analysis**:
- 90 avatar images × $0.025 = $2.25 total (nano-banana)
- vs 90 × $0.04 = $3.60 (Flux 1.1 Pro)
- **Savings**: 37.5% while maintaining face consistency

---

## Summary

Complete workflow for generating consistent visual character references across multiple scenarios using Flux 1.1 Pro API. Validated through 51 successful image generations across 3 character types.

## Critical Insight: Character Consistency Without Reference Images

**Common Misconception**: Use `image_prompt` parameter with reference photo for consistency

**Reality**:
- `image_prompt` = Flux Redux composition guidance (NOT character consistency)
- Character consistency comes from **detailed text descriptions**
- Pose variety comes from **explicit body position descriptions**

---

## Prompt Engineering Pattern

```javascript
const PROMPT_TEMPLATE = `
${CHARACTER_DESC},          // Detailed physical description
${scenario.attire},         // Scene-appropriate clothing
${scenario.scenario},       // Narrative context
${scenario.pose},          // EXPLICIT body position/gesture
${scenario.environment},   // Setting details
${scenario.lighting},      // Light sources and mood
${scenario.mood},          // Emotional tone
${STYLE_BASE}              // Aesthetic/rendering style
`;
```

### Critical Success Factors

1. **Detailed CHARACTER_DESC** (creates consistency):
   ```javascript
   const CHARACTER_DESC = "Alex Finch, 21, sharp intelligent features, " +
     "short dark brown hair with copper highlights, athletic build, " +
     "confident but approachable demeanor, piercing analytical eyes";
   ```

2. **Explicit Pose Descriptions** (creates variety):
   - ❌ Vague: "standing in office"
   - ✅ Specific: "leaning forward with both hands on desk, analyzing data intently"
   - ✅ Specific: "standing with one hand gesturing toward display, explaining concept"

3. **Style Consistency**:
   ```javascript
   // Detective Noir
   const STYLE_BASE = "Professional illustration, high contrast noir lighting, " +
     "dramatic shadows, cinematic composition, sharp detail, moody atmosphere";
   
   // Fantasy Wonderland
   const STYLE_BASE = "Soft fantasy illustration, pastel color harmony, " +
     "ethereal glow, magical atmosphere, dreamy composition";
   ```

---

## Character-Agnostic Template Structure

```javascript
// Configuration Block (customize per character)
const CHARACTER = {
  name: "Character Name",
  description: "detailed physical appearance",
  age: number
};

const STYLE = "aesthetic appropriate to narrative";

const SCENARIOS = [
  {
    id: "001",
    title: "Scene Title",
    scenario: "narrative context",
    attire: "specific clothing details",
    pose: "EXPLICIT body position, hands, gaze",
    environment: "setting details",
    lighting: "light sources and mood",
    mood: "emotional tone"
  }
  // ... 16 more scenarios
];

// Generation Engine (reusable)
async function generateScene(scenario) {
  const prompt = buildPrompt(CHARACTER, scenario, STYLE);
  return await replicate.run("black-forest-labs/flux-1.1-pro", {
    input: {
      prompt,
      aspect_ratio: "3:4",
      output_format: "png",
      output_quality: 100,
      safety_tolerance: 2
    }
  });
}
```

---

## Validated Results

**Successful Generations** (Feb 2026):
- Alex: 17/17 professional noir scenes
- Iris: 17/17 wonderland magic scenes
- Maya: 17/17 teen life scenes

**Quality Metrics**:
- 100% generation success rate (with retry handling)
- 17 unique poses per character
- Visual consistency maintained across all images
- Style consistency within each aesthetic type

---

## Troubleshooting

### Safety Filter False Positives

**Issue**: Child character poses sometimes trigger safety filters

**Example**: "sitting on ground, knees drawn up" (blocked)

**Solution**: Adjust to neutral poses: "sitting cross-legged leaning forward"

**Pattern**: Avoid poses that could be misinterpreted for child characters

### Rate Limiting

**Issue**: 429 Too Many Requests from Replicate API

**Solution**: Exponential backoff retry pattern

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429 && i < maxRetries - 1) {
        const delay = 2000 * Math.pow(2, i);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
}
```

### Pose Repetition

**Symptom**: All images show similar body positions

**Diagnosis**: Pose descriptions too vague

**Fix**: Be cinematically specific
- ✅ "leaning against doorframe, arms crossed, skeptical expression"
- ✅ "crouched examining ground, one hand touching surface"
- ✅ "mid-stride walking forward, confident purposeful movement"

---

## Cost and Performance

### Default: Nano-Banana Pro (Face Consistency)
- **Model**: `google/nano-banana-pro` (recommended)
- **Cost**: $0.025 per image
- **Generation Time**: ~15-30 seconds per image
- **Best For**: Character avatars, portraits, face consistency
- **Requires**: Reference face image

### Fast Alternative: Nano-Banana 2 (Same API, Faster)
- **Model**: `google/nano-banana-2` (Gemini 3.1 Flash Image)
- **Cost**: $0.067 per 1K output image ($0.101/2K, $0.151/4K)
- **Generation Time**: Faster than nano-banana-pro
- **API**: Identical `image_input` parameter (array, up to 14 refs)
- **Best For**: High-volume generation, rapid iteration

### Scene Model: Flux 1.1 Pro (No Reference)
- **Model**: `black-forest-labs/flux-1.1-pro`
- **Cost**: $0.04 per image
- **Generation Time**: ~30-60 seconds per image
- **Best For**: Full scenes, no reference image needed
- **Aspect Ratio**: 3:4 portrait recommended
- **Output Format**: PNG at quality 100 for archival

**Economic Comparison**:
| Character Set | nano-banana-pro | nano-banana-2 | flux-1.1-pro |
|---------------|-----------------|---------------|--------------|
| 17 scenarios  | $0.43           | $1.14 (1K)    | $0.68        |
| 90 avatars    | $2.25           | $6.03 (1K)    | $3.60        |
| Full set (100+)| ~$2.50         | ~$6.70 (1K)   | ~$4.00       |

> **Note**: nano-banana-2's per-image cost at 1K is higher than nano-banana-pro, but it's significantly faster — trade cost for speed when doing rapid iteration.

---

## Cross-Project Applicability

**Use Cases**:
- Book character reference sheets
- Visual novel character consistency
- Game concept art
- Marketing material uniformity
- Story illustration preparation

**Character Types Validated**:
- Young adult detective (noir aesthetic)
- Teen fantasy character (ethereal aesthetic)
- Contemporary teenager (realistic aesthetic)

---

## Implementation

**Dependencies**:
- Replicate API account and token
- Node.js with ES modules support

**File Organization**:
```
characters/
  {character-slug}/
    images/
      {collection-name}/
        001-{scenario-title}.png
        002-{scenario-title}.png
        generation-report.json
```

**Package.json script**:
```json
"scripts": {
  "generate:character": "node scripts/generate-character-reference.js"
}
```

---

## Confidence Level

**High** — Empirically validated through:
- 51 successful image generations
- 3 different character types
- 3 different aesthetic styles
- 100% success rate (with retry handling)
