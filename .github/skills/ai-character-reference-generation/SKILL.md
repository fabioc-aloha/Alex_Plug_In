---
name: "AI Character Reference Generation"
description: "Generate consistent visual character references across multiple scenarios using Flux 1.1 Pro API with prompt engineering patterns"
applyTo: "**/*character*,**/*reference*,**/*generate*,**/*replicate*"
---

# AI Character Reference Generation

> Create 17+ consistent character poses from detailed prompts — no reference images needed.

> ⚠️ **Staleness Watch** (Last validated: Feb 2026 — Flux 1.1 Pro): Image generation models on Replicate release new versions and deprecate old ones. Before generating, verify the model identifier at [replicate.com/black-forest-labs](https://replicate.com/black-forest-labs). **Upgrade path**: `black-forest-labs/flux-1.1-pro-ultra` provides higher resolution (up to 4MP) with the same API surface. Input parameter schema may change between model versions.

---

## Model Selection Guide

### Recommended Models by Use Case

| Use Case | Model | Cost | Notes |
|----------|-------|------|-------|
| **Face Consistency (Default)** | `google/nano-banana-pro` | $0.025/image | **Best for maintaining face identity** — uses reference image + prompt. Maintains Alex identity across 90+ avatar images. |
| **Detailed Scenes** | `black-forest-labs/flux-1.1-pro` | $0.04/image | High-quality scenes without face reference. Good for backgrounds and environments. |
| **Agent Banners** | `ideogram-ai/ideogram-v2` | $0.08/image | Best for stylized text + character combinations. Prominent branding. |
| **High Resolution** | `black-forest-labs/flux-1.1-pro-ultra` | $0.06/image | Up to 4MP output. Use when print-quality needed. |

### Face Consistency Pattern (Nano-Banana Pro)

**The Key Insight**: For consistent character faces across multiple poses/scenarios, use a reference face image with nano-banana-pro:

```javascript
const response = await replicate.run("google/nano-banana-pro", {
  input: {
    prompt: `${CHARACTER_DESC}, ${scenario.attire}, ${scenario.pose}, ${STYLE}`,
    image: await toDataURI("path/to/reference-face.png"),  // Key: face reference
    aspect_ratio: "1:1",  // Square for avatars
    output_format: "png"
  }
});
```

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

### Alternative: Flux 1.1 Pro (Scene Flexibility)
- **Model**: `black-forest-labs/flux-1.1-pro`
- **Cost**: $0.04 per image
- **Generation Time**: ~30-60 seconds per image
- **Best For**: Full scenes, no reference image needed
- **Aspect Ratio**: 3:4 portrait recommended
- **Output Format**: PNG at quality 100 for archival

**Economic Comparison**:
| Character Set | Nano-Banana | Flux 1.1 Pro |
|---------------|-------------|--------------|
| 17 scenarios  | $0.43       | $0.68        |
| 90 avatars    | $2.25       | $3.60        |
| Full set (100+)| ~$2.50     | ~$4.00       |

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
