---
applyTo: "**/*aging*,**/*age-progression*,**/*life-stage*,**/*character-ages*,**/*avatar-ages*,**/generate-alex-age*.js"
description: "Age progression generation — life-stage accuracy, identity consistency, and API parameter rules"
---

# Character Aging Progression Instructions

## Model Selection

**Default:** `google/nano-banana-pro` — best identity consistency, 14-reference cap  
**Faster alt:** `google/nano-banana-2` — same API, 3× faster, $0.067/1K output pixels vs $0.025/image  
**Never use:** flux-schnell or flux-1.1-pro for age progression (no reference image support)

## Critical: image_input Must Be an Array

```javascript
// ✅ CORRECT — image_input is ALWAYS an array
const output = await replicate.run('google/nano-banana-pro', {
  input: {
    prompt: 'Professional portrait of a person at age 8 ...',
    image_input: [await toDataURI(referenceImagePath)],  // ← ARRAY
    aspect_ratio: '1:1',
    output_format: 'png',
  }
});

// ❌ WRONG — single string (broken API call)
input: { image: referenceImagePath }
```

## Life Stage Descriptors

Use exact age-appropriate language in prompts to produce anatomically accurate results:

| Age | Descriptor |
|-----|------------|
| 3 | "toddler, rounded baby face, large eyes" |
| 7 | "young child, slightly grown, playful" |
| 13 | "preteen, early adolescent features" |
| 15 | "teenager, developing adult features" |
| 18 | "young adult, college-age" |
| 21 | "young adult in early twenties" |
| 25 | "mid-twenties, confident, mature" |
| 30 | "early thirties, fully mature" |
| 42 | "early forties, slight age lines" |
| 55 | "mid-fifties, silver temples, distinguished" |
| 62 | "early sixties, deeper lines, warm expression" |
| 68 | "late sixties, white hair beginning" |
| 75 | "mid-seventies, elder dignity" |

## Identity Preservation Rules

1. Always include 1–3 reference images from the subject's known "anchor age" (e.g., age 25 photo)
2. Include explicit identity tags in every prompt: name, ethnicity, eye color, distinctive features
3. Preserve: hair base color (pre-grey), skin tone, facial structure, nose/jaw shape
4. Age-vary: hair color (grey progression), skin texture (age lines), eye clarity

## Prompt Structure Template

```
[Subject name], [identity tags — eye color, ethnicity, key features],
aged [N] years, [life-stage descriptor],
[clothing appropriate to era], [expression],
[background: simple studio / softbox lighting],
photorealistic portrait,
maintaining exact facial identity and bone structure from reference
```

## Validation Before Full Run

Always test with ages **21** and **55** first:
- Verify facial identity is preserved
- Verify age difference is visible and accurate
- Only then generate the full 13-stage set

## Output File Naming

```
character-name-age-03.png
character-name-age-07.png
character-name-age-13.png
...
character-name-age-75.png
```

Use zero-padded numbers so files sort correctly.

## Cost Estimation

| Stage count | nano-banana-pro | nano-banana-2 (1K) |
|-------------|-----------------|-------------------|
| 13 ages     | $0.33           | $0.87             |
| Validation 2 | $0.05          | $0.13             |

## Rate Limiting

```javascript
const DELAY_MS = 2000;
for (const age of ages) {
  await generateAge(age);
  await new Promise(r => setTimeout(r, DELAY_MS));  // Required — respect API limits
}
```

## Generation Report

Always save a report alongside outputs:
```json
{
  "model": "google/nano-banana-pro",
  "character": "Alex Finch",
  "ages": [3, 7, 13, ...],
  "referenceImages": 1,
  "costEstimate": "$0.33",
  "generatedAt": "2026-01-01T00:00:00Z"
}
```
