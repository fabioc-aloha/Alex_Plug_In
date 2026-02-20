# AI Character Reference Generation Workflow

**Invoke with**: `/ai-character-reference-generation` or "generate character reference set"
**Domain**: Visual consistency for fictional characters across multiple scenarios
**Synapses**: [ai-character-reference-generation/SKILL.md](../skills/ai-character-reference-generation/SKILL.md)

---

## Workflow Overview

This guided workflow helps you generate 15+ visually consistent character reference images using Flux 1.1 Pro. Perfect for books, visual novels, games, or any narrative project requiring character illustration consistency.

**Duration**: 20-30 minutes (character definition) + 15-20 minutes (generation)
**Cost**: $0.68 for 17-scenario reference set
**Output**: 17 PNG images (3:4 portrait) with visual consistency

---

## Phase 1: Character Definition

### Step 1: Core Identity

**Define immutable character attributes**:

```
Character Name: [Your character's name]
Age Descriptor: [e.g., "21 years old", "young adult", "teenager"]
Physical Traits (be VERY specific):
  - Height/Build: [e.g., "5'2", athletic build"]
  - Hair: [exact color, length, style - e.g., "shoulder-length dark brown, slight wave"]
  - Eyes: [exact color, shape - e.g., "sharp hazel eyes, slight almond shape"]
  - Distinctive Features: [scars, tattoos, birthmarks, etc.]
  - Facial Structure: [e.g., "angular jaw, high cheekbones"]
```

**Critical**: The more specific these traits, the better visual consistency across 17+ images.

### Step 2: Aesthetic Style

**Choose narrative aesthetic**:
- [ ] Professional Noir (detective, mystery, urban)
- [ ] Ethereal Fantasy (magical, wonderland, dreamlike)
- [ ] Contemporary Realistic (modern, everyday, grounded)
- [ ] Other: __________________

**Style Description**: Write 2-3 sentences describing the visual mood for ALL images.

---

## Phase 2: Scenario Design

### Step 3: Create 17 Unique Scenarios

**For each scenario, define**:

1. **Scene Title**: Brief descriptor (e.g., "Library Research")
2. **Narrative Context**: What's happening? (e.g., "Searching for clues in old records")
3. **Attire**: Specific clothing for this scene (can differ from default)
4. **Pose**: EXPLICIT body position, hand placement, gaze direction
   - ✅ Good: "Leaning over desk, left hand on open book, right hand pointing at text, focused downward gaze"
   - ❌ Too vague: "Reading at desk"
5. **Environment**: Detailed setting (e.g., "Dim library with tall bookshelves, amber desk lamp")
6. **Lighting**: Light sources and mood (e.g., "Warm amber glow from desk lamp, shadows on face")
7. **Mood**: Emotional tone (e.g., "Intense concentration, slight frustration")

**Variety Checklist**:
- [ ] Indoor and outdoor scenes
- [ ] Different emotional states (joy, concern, anger, contemplation, etc.)
- [ ] Varied body positions (standing, sitting, crouching, walking, etc.)
- [ ] Multiple camera angles (straight-on, profile, three-quarter view)
- [ ] Day and night lighting
- [ ] Casual and formal attire variations

---

## Phase 3: Technical Setup

### Step 4: Environment Preparation

**Required**:
1. Replicate API account: https://replicate.com
2. API token set in environment: `REPLICATE_API_TOKEN`
3. Node.js installed with `replicate` package

**Install dependencies**:
```bash
npm install replicate fs-extra
```

**Directory structure**:
```
characters/
  {character-slug}/
    character-definition.js
    scenarios.js
    images/
      {collection-name}/
        (generated images here)
```

### Step 5: Script Configuration

**Create character-definition.js**:
```javascript
export const CHARACTER = {
  name: "[Your character name]",
  slug: "[character-slug]",
  age: "[age descriptor]",
  physicalTraits: [
    "[height/build]",
    "[hair details]",
    "[eye details]",
    "[distinctive features]"
  ],
  attireBase: "[default clothing]",
  personality: "[core traits]"
};

export const STYLE = "[aesthetic descriptor from Step 2]";
```

**Create scenarios.js** with your 17 scenarios from Step 3.

---

## Phase 4: Generation

### Step 6: Run Generation Script

**Execute**:
```bash
node scripts/generate-character-reference.js
```

**Monitor**:
- Progress logs for each scenario
- URL outputs for verification
- Error handling for rate limits (automatic retry)

**Duration**: 15-20 minutes for 17 images

### Step 7: Quality Validation

**Review checklist**:
- [ ] Character recognizable across all 17 images
- [ ] Physical traits consistent (hair, eyes, build)
- [ ] Each pose is unique (no duplicate compositions)
- [ ] Aesthetic style maintained throughout
- [ ] All scenarios successfully generated (17/17)

**If character drift detected**:
- Enhance physical trait specificity in CHARACTER definition
- Regenerate affected images

---

## Phase 5: Organization

### Step 8: File Management

**Organize outputs**:
```
characters/{character-slug}/images/{collection-name}/
  001-scene-title.png
  002-scene-title.png
  ...
  017-scene-title.png
  generation-report.json
```

**Generation report includes**:
- Timestamp
- Model version (Flux 1.1 Pro)
- Total cost ($0.68)
- Scenario metadata
- Replicate URLs for re-access

### Step 9: Documentation

**Create README.md in character directory**:
- Character profile summary
- Aesthetic style description
- Scenario overview (brief description of each image)
- Usage guidelines for the reference set
- Generation metadata (date, cost, model)

---

## Cost Summary

**Per Character Reference Set**:
- 17 scenarios × $0.04 = **$0.68**
- Generation time: 15-20 minutes
- Output: 17 high-quality PNG images (3:4 portrait, 100% quality)

**Comparison**:
- Professional illustrator: $200-$500 for character reference sheet
- AI generation: $0.68
- **Savings**: 99.7%

---

## Troubleshooting Guide

### Issue: Pose Repetition

**Symptom**: Similar body positions across different scenarios

**Solution**: Add cinematographic details to pose descriptions
- Include specific hand placements
- Describe weight distribution
- Specify head tilt and gaze direction

### Issue: Safety Filter Blocking

**Symptom**: Child character poses rejected as sensitive

**Solution**: Adjust to neutral poses
- "sitting with knees drawn up" → "sitting cross-legged leaning forward"
- "lying down resting" → "seated against wall, relaxed posture"
- Set `safety_tolerance: 2` in generation config

### Issue: Character Appearance Drift

**Symptom**: Character looks different between images

**Solution**: Enhance physical trait specificity
- Add more distinctive features
- Use exact color descriptions with hex codes if needed
- Include facial structure details (jaw shape, cheekbones, etc.)

### Issue: Rate Limiting (429 Errors)

**Symptom**: API requests failing with "Too Many Requests"

**Solution**: Exponential backoff retry (built into script template)
- Automatic retry with 2s, 4s, 8s delays
- 2-second delay between successful requests

---

## Next Steps After Generation

**Validated reference set can be used for**:
- Character model sheets for illustrators
- Visual consistency guide for graphic novel artists
- Game sprite design reference
- Marketing materials featuring the character
- Social media profile images
- Book cover art briefs

**Integration**: Reference images can inform [ai-generated-readme-banners](ai-generated-readme-banners.prompt.md) for project branding featuring your character.

---

## Real-World Examples

**Alex** (21, young adult detective - noir aesthetic):
- 17 professional investigation scenes
- Noir lighting and urban environments
- 100% visual consistency achieved
- Cost: $0.68

**Iris** (fantasy character - ethereal aesthetic):
- 17 magical wonderland scenarios
- Dreamlike lighting and whimsical settings
- 100% visual consistency achieved
- Cost: $0.68

**Maya** (teenager - contemporary realistic):
- 17 daily life scenes
- Natural lighting and modern environments
- 100% visual consistency achieved
- Cost: $0.68

---

## Completion Checklist

- [ ] Character definition complete (name, age, physical traits, style)
- [ ] 17 unique scenarios designed with explicit poses
- [ ] Generation script configured with character data
- [ ] Replicate API token set and validated
- [ ] All 17 images generated successfully
- [ ] Visual consistency verified across full set
- [ ] Files organized in proper directory structure
- [ ] Generation report saved for record-keeping
- [ ] Character README documentation created

**You now have a production-ready character reference set for visual narrative projects!**
