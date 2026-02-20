# AI Character Reference Generation Instructions

**Auto-loaded when**: Working with character development, fiction writing, visual reference generation
**Domain**: Character consistency patterns for visual narratives using Flux 1.1 Pro
**Synapses**: [ai-character-reference-generation/SKILL.md](../skills/ai-character-reference-generation/SKILL.md)

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

### 4. Generation Engine Setup

**Flux 1.1 Pro Configuration**:

```javascript
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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
- Set `safety_tolerance: 2` for non-sensitive content

### 5. Batch Processing with Retry

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
- **Model**: Flux 1.1 Pro
- **Cost**: $0.04 per image
- **17-scenario reference set**: $0.68 per character
- **Generation time**: 30-60 seconds per image

**ROI**: Professional character reference sheets typically cost $200-$500 from illustrators. AI generation: $0.68.

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
