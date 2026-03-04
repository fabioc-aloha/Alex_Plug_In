# AI Character Reference Generation Instructions

**Auto-loaded when**: Working with character development, fiction writing, visual reference generation
**Domain**: Character consistency patterns for visual narratives using Nano-Banana Pro (face refs) and Flux 1.1 Pro
**Synapses**: [ai-character-reference-generation/SKILL.md](../skills/ai-character-reference-generation/SKILL.md)

---

## Resources

> **REQUIRED READING**: Before generating images, read the [Replicate API Starter Kit](../skills/ai-character-reference-generation/resources/REPLICATE-API-STARTER-KIT.md) for authentication, model selection, and critical gotchas.

---

## Purpose

Auto-load procedural steps for generating visually consistent character references across multiple scenarios using AI image generation. Maintains character identity while varying poses, environments, and narrative contexts.

---

## When This Applies

**File Patterns**:
- `**/characters/**` — Character reference directories
- `**/*character*reference*.js` — Character generation scripts
- `**/*scenario*.json` — Scenario configuration files

**Contextual Triggers**:
- User mentions "character reference", "visual consistency", "character poses"
- Working with narrative projects requiring character illustrations
- Setting up character generation workflows

---

## Core Workflow

### 1. Character Definition

**Establish immutable character attributes**:

```javascript
const CHARACTER = {
  name: "Character Name",
  age: "age descriptor",
  physicalTraits: [
    "specific height/build",
    "distinctive features (hair, eyes, etc.)",
    "identifying marks or characteristics"
  ],
  attireBase: "default clothing style",
  personality: "core personality traits"
};
```

**Critical**: Physical traits must be SPECIFIC enough to maintain visual consistency across 15+ images.

### 2. Scenario Architecture

**Design 15+ unique poses/environments**:

```javascript
const SCENARIOS = [
  {
    id: "001",
    title: "Scene Title",
    scenario: "narrative context",
    attire: "specific clothing for this scenario",
    pose: "EXPLICIT body position, hand placement, gaze direction",
    environment: "detailed setting description",
    lighting: "light sources and atmospheric mood",
    mood: "emotional tone and expression"
  }
  // ... 16 more scenarios
];
```

**Pose Specificity Requirements**:
- ✅ "leaning against doorframe, arms crossed, head tilted"
- ✅ "crouched examining ground, left hand touching surface"
- ❌ "standing" (too vague, produces repetition)

### 3. Prompt Engineering Template

**Build composite prompt from character + scenario**:

```javascript
function buildPrompt(character, scenario, style) {
  return `${style} aesthetic portrait photograph.

CHARACTER: ${character.name}, ${character.age}
PHYSICAL TRAITS: ${character.physicalTraits.join(', ')}

SCENARIO: ${scenario.scenario}
ATTIRE: ${scenario.attire}

POSE AND COMPOSITION:
${scenario.pose}

ENVIRONMENT: ${scenario.environment}

LIGHTING: ${scenario.lighting}

MOOD: ${scenario.mood}

TECHNICAL REQUIREMENTS:
- Portrait orientation (3:4 aspect ratio)
- Professional photography quality
- Consistent character appearance
- ${style} aesthetic throughout`;
}
```

### 4. Face Reference Setup (Optional but Recommended)

If you have reference photos of the character (from a previous generation or real photos), using face references dramatically improves consistency. Store references in `visual-memory.json` or pass as data URIs.

**Preparing Face References**:

```powershell
# Resize to 512px @ 85% quality for optimal API performance
magick input.jpg -resize 512x512 -quality 85 output.jpg

# Convert to base64 data URI
$bytes = [IO.File]::ReadAllBytes("output.jpg")
$b64 = [Convert]::ToBase64String($bytes)
$uri = "data:image/jpeg;base64,$b64"
```

Optimal specs: 512px longest edge, 85% JPEG, ~40-80KB per photo. More references = better consistency (nano-banana supports up to 14).

### 5. Generation Engine Setup

**Model Selection**:

| Model | When to Use | Cost | Face Refs |
|-------|------------|------|-----------|
| **Nano-Banana Pro** | Have reference photos → best face consistency | $0.025/img | Up to 14 via `image_input` array |
| **Flux 2 Pro** | Higher quality + reference photos | $0.045/img | Up to 8 via `input_images` |
| **Flux 1.1 Pro** | No reference photos, prompt-only consistency | $0.04/img | ❌ None |

**Nano-Banana Pro (Recommended when you have face refs)**:

```javascript
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Load face reference data URIs (up to 14)
const faceRefs = loadFaceReferences(); // Array of data URI strings

async function generateScene(scenario) {
  const prompt = buildPrompt(CHARACTER, scenario, STYLE);
  
  const output = await replicate.run("google/nano-banana-pro", {
    input: {
      prompt,
      image_input: faceRefs,      // Array of data URIs (up to 14)
      aspect_ratio: "3:4",        // Portrait orientation
      output_format: "png",
    }
  });
  
  return output;
}
```

**CRITICAL**: `image_input` accepts an **array** of data URIs, not a single string. More references = better face fidelity.

**Flux 1.1 Pro (No reference photos)**:

```javascript
async function generateScene(scenario) {
  const prompt = buildPrompt(CHARACTER, scenario, STYLE);
  
  const output = await replicate.run("black-forest-labs/flux-1.1-pro", {
    input: {
      prompt,
      aspect_ratio: "3:4",        // Portrait orientation
      output_format: "png",
      output_quality: 100,         // Max quality for archival
      safety_tolerance: 2          // Adjust if child characters trigger filter
    }
  });
  
  return output;
}
```

**Safety Filter Considerations**:
- Child character poses sometimes trigger false positives
- Avoid ambiguous poses: "sitting with knees drawn up" → "sitting cross-legged"
- Set `safety_tolerance: 2` for non-sensitive content (Flux 1.1 Pro only)

### 6. Batch Processing with Retry

**Handle rate limits and transient errors**:

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429 && i < maxRetries - 1) {
        const delay = 2000 * Math.pow(2, i); // Exponential backoff
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
}

// Process all scenarios
for (const scenario of SCENARIOS) {
  const result = await retryWithBackoff(() => generateScene(scenario));
  await downloadImage(result, `characters/${CHARACTER.slug}/images/${scenario.id}.png`);
  
  // Rate limiting: 2 seconds between requests
  await new Promise(r => setTimeout(r, 2000));
}
```

---

## Cost and Performance

**Economics**:

| Model | Per Image | 17-Scenario Set | Face Refs |
|-------|-----------|-----------------|-----------|
| Nano-Banana Pro | $0.025 | **$0.43** | ✅ Up to 14 |
| Flux 1.1 Pro | $0.04 | $0.68 | ❌ None |
| Flux 2 Pro | $0.045 | $0.77 | ✅ Up to 8 |

- **Recommended**: Nano-Banana Pro ($0.43/set) — best consistency + lowest cost
- **Generation time**: 30-60 seconds per image

**ROI**: Professional character reference sheets typically cost $200-$500 from illustrators. AI generation: $0.43-$0.77.

---

## Quality Validation

**Success Metrics**:
- Visual consistency maintained across all 17 images
- Character recognizable in different poses/environments
- Zero duplicate poses (each scenario produces unique composition)

**Validated Results** (Feb 2026):
- Alex: 17/17 professional noir scenes (100% success)
- Iris: 17/17 wonderland magic scenes (100% success)
- Maya: 17/17 teen life scenes (100% success)

---

## Troubleshooting

### Pose Repetition

**Symptom**: All images show similar body positions despite different prompts

**Diagnosis**: Pose descriptions too generic

**Fix**: Add cinematographic specificity
- Include hand placement details
- Specify gaze direction explicitly
- Describe weight distribution and body angles

### Safety Filter False Positives

**Symptom**: Generation blocked for "child character in innocent pose"

**Solution**: Adjust pose to neutral alternatives
- "sitting with knees drawn up" → "sitting cross-legged"
- "lying down resting" → "seated leaning against wall"

### Character Drift

**Symptom**: Character appearance changes between images

**Diagnosis**: Physical trait descriptions too vague

**Fix**: Add MORE specific details to CHARACTER.physicalTraits
- Hair: specific color, length, style (e.g., "shoulder-length dark brown, slight wave")
- Eyes: exact color and shape
- Build: precise height and body type
- Distinctive features: scars, tattoos, birthmarks, etc.

---

## File Organization

```
characters/
  {character-slug}/
    character-definition.js      # CHARACTER constant
    scenarios.js                  # SCENARIOS array
    images/
      {collection-name}/
        001-scene-title.png
        002-scene-title.png
        ...
        generation-report.json
```

---

## Cross-Project Applications

✅ **Validated use cases**:
- Book character reference sheets for consistency
- Visual novel character sprites with pose variations
- Game concept art for character design
- Marketing material with brand mascot uniformity
- Comic/graphic novel character model sheets

✅ **Character types validated**:
- Young adult characters (noir, realistic, fantasy aesthetics)
- Contemporary teenagers (modern realistic style)
- Fantasy characters (ethereal, magical aesthetics)

---

## Integration with Other Skills

**Synergies**:
- [visual-memory](visual-memory.instructions.md) — Store face reference photos for cross-session character consistency
- [image-handling](../skills/image-handling/SKILL.md) — Model selection guide, face reference API patterns, video animation
- [ai-generated-readme-banners](ai-generated-readme-banners.instructions.md) — Same prompt engineering patterns, different aspect ratios
- [bootstrap-learning](bootstrap-learning.instructions.md) — Character development requires domain research
- [brand-asset-management](brand-asset-management.instructions.md) — Character references are visual brand assets

---

## Auto-Load Behavior

This instruction file auto-loads when:
- Working in `**/characters/**` directories
- Editing character generation scripts
- User mentions character reference workflows
- AI image generation context detected

**Purpose**: Provide immediate procedural context without manual skill activation.
