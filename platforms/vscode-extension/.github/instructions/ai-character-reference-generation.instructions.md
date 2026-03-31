---
description: "AI character reference generation for consistent visual development and fiction writing"
applyTo: "**/generate-alex*,**/*character-ref*,**/*portrait*,**/*avatar*"
---

# AI Character Reference Generation — Auto-Loaded Rules

Character templates, scenario architecture, prompt engineering, model selection, generation code → see ai-character-reference-generation skill.
Before generating: read the Replicate API Starter Kit in the skill's resources/.

## Key Rules (Not in Skill)

**Face Reference Prep** — Resize to 512px longest edge @ 85% JPEG (~40-80KB):

```bash
magick input.jpg -resize 512x512 -quality 85 output.jpg
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("output.jpg"))
$uri = "data:image/jpeg;base64,$b64"
```

More face references = better consistency (nano-banana supports up to 14).

**Pose Specificity** — "leaning against doorframe, arms crossed, head tilted" NOT "standing." Vague poses produce repetition across a 17-image set.

**Batch Retry** — Exponential backoff on 429 errors (2s x 2^attempt). Always add 2-second delay between requests.

**Safety Filters** — Child character poses sometimes trigger false positives. Avoid ambiguous poses: "sitting with knees drawn up" → "sitting cross-legged." Use `safety_tolerance: 2` for non-sensitive content (Flux only).

**Economics** — Nano-Banana Pro: $0.025/img ($0.43 for 17-scenario set). Professional illustrator equivalent: $200-$500.

When comparing multiple outputs, VS Code 1.112+'s image carousel displays them side-by-side for efficient visual QA.

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
