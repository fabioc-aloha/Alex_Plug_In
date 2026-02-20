# Alex Persona Welcome Images v2

> Consistent template-based persona images for welcome screens and marketing materials.

---

## Overview

This folder contains **8 persona-specific welcome images** generated using Ideogram v2 with a consistent visual template. Each image maintains identical composition while varying only the title, subtitle, and brand color to represent different user personas.

**Generation Date**: February 15, 2026
**Total Cost**: $0.64 ($0.08 per image)
**Model**: Ideogram v2 (ideogram-ai/ideogram-v2)
**Format**: 1024x1024 PNG (1:1 square aspect ratio)

---

## Design System

### Consistent Template Elements

All images share the **exact same composition**:

| Element             | Specification                                        |
| ------------------- | ---------------------------------------------------- |
| **Rocket Position** | Center-left, 30° upward diagonal angle               |
| **Rocket Size**     | Prominent but not overwhelming (~40% of frame)       |
| **Background**      | Deep space gradient (#0a0e1a → #050810)              |
| **Stars**           | Scattered white pinpoints (minimal, elegant)         |
| **Lighting**        | Rim lighting on rocket + thrust glow + ambient space |
| **Thrust Flame**    | Orange-yellow gradient (#ffc857 → #ff6b35)           |
| **Logo**            | Subtle "CX" mark on rocket body                      |
| **Text Position**   | Title: upper-center                                  | Subtitle: below title, centered |

### Variable Elements (Persona-Specific)

Only these elements change per persona:

1. **Title Text** - Short, impactful word (CODE, THESIS, LEARNING, etc.)
2. **Subtitle Text** - Persona-specific value proposition
3. **Primary Color** - Brand color for rocket and title glow

---

## Persona Catalog

| Image                       | Persona          | Title        | Subtitle                      | Color                   | Target Audience                            |
| --------------------------- | ---------------- | ------------ | ----------------------------- | ----------------------- | ------------------------------------------ |
| `ALEX-DEVELOPER.png`        | Developer        | **CODE**     | Ship Faster, Debug Less       | Azure Blue (#0078d4)    | Coders, engineers, script writers          |
| `ALEX-ACADEMIC.png`         | Academic         | **THESIS**   | Research to Publication       | Deep Purple (#7c3aed)   | Grad students, dissertation writers        |
| `ALEX-STUDENT.png`          | Student          | **LEARNING** | Master Concepts, Not Memorize | Electric Teal (#14b8a6) | Students, lifelong learners                |
| `ALEX-RESEARCHER.png`       | Researcher       | **RESEARCH** | Hypothesis to Discovery       | Azure Blue (#0078d4)    | Lab scientists, data researchers           |
| `ALEX-TECHNICAL-WRITER.png` | Tech Writer      | **DOCS**     | Documentation Excellence      | Deep Purple (#7c3aed)   | Documentation specialists, API writers     |
| `ALEX-DATA-ENGINEER.png`    | Data Engineer    | **DATA**     | Raw to Refined Intelligence   | Electric Teal (#14b8a6) | Data engineers, analytics professionals    |
| `ALEX-BUSINESS-ANALYST.png` | Business Analyst | **INSIGHTS** | Stakeholder Alignment         | Azure Blue (#0078d4)    | BAs, strategists, consultants              |
| `ALEX-CREATIVE-WRITER.png`  | Creative Writer  | **STORIES**  | Narrative Excellence          | Deep Purple (#7c3aed)   | Novelists, screenwriters, content creators |

---

## Brand Colors

| Color             | Hex Code  | Usage                              | Personas                                |
| ----------------- | --------- | ---------------------------------- | --------------------------------------- |
| **Azure Blue**    | `#0078d4` | Technical, analytical, data-driven | Developer, Researcher, Business Analyst |
| **Deep Purple**   | `#7c3aed` | Creative, scholarly, documentation | Academic, Tech Writer, Creative Writer  |
| **Electric Teal** | `#14b8a6` | Learning, growth, transformation   | Student, Data Engineer                  |

**Accent Colors** (consistent across all):
- **Thrust Flame**: Orange-yellow gradient (`#ffc857` → `#ff6b35`)
- **Background**: Deep space blacks and blues (`#0a0e1a`, `#050810`)
- **Subtitle Text**: White (`#ffffff`) with soft glow

---

## Comparison: alex/ vs alex2/

### alex/ (Original Age Progression)
- **Purpose**: Character development timeline (Alex ages 0-80)
- **Approach**: Hand-generated character references via Flux 1.1 Pro
- **Format**: Various aspect ratios, character-focused
- **Style**: Portrait-style character shots at different life stages
- **Use Case**: Character documentation, identity evolution

### alex2/ (Persona Templates)
- **Purpose**: Marketing and welcome screens for different user types
- **Approach**: Template-based system with consistent composition
- **Format**: 1024x1024 square, identical layout
- **Style**: Professional product imagery with typography
- **Use Case**: Onboarding, persona-specific welcome messages

---

## Technical Details

### Generation Script

**Location**: `scripts/generate-persona-welcome-images.js`

**Key Parameters**:
```javascript
{
  prompt: buildPrompt(persona),
  aspect_ratio: '1:1',
  magic_prompt_option: 'On',
  style_type: 'Realistic',
  resolution: '1024x1024',
  output_format: 'png'
}
```

**Prompt Engineering Strategy**:
1. **Consistent template section** - Defines identical composition rules
2. **Variable insertion** - Title, subtitle, color injected per persona
3. **Typography emphasis** - "TEXT QUALITY CRITICAL" section ensures clean rendering
4. **Simplified text** - Short words (CODE, DOCS, DATA) for better AI rendering

### Quality Improvements (v2 Iteration)

**Problem**: Initial generation had inconsistent compositions and typography artifacts.

**Solution**:
1. **Locked template** - All layout rules identical across personas
2. **Simplified text** - Changed "DOCUMENTATION" → "DOCS", "ANALYSIS" → "INSIGHTS"
3. **Enhanced prompts** - Added "COMPOSITION RULES" section enforcing consistency
4. **Typography focus** - Made text rendering the PRIMARY prompt focus

**Result**: Photorealistic quality with perfect brand consistency at $0.08/image.

---

## Usage Guidelines

### When to Use alex2/ Images

✅ **Use for**:
- Welcome screen persona detection
- Marketing materials for specific audiences
- Landing page hero images
- Persona-specific documentation sections
- Social media headers for persona campaigns

❌ **Don't use for**:
- Character biography or identity documentation (use alex/ instead)
- Age-based narrative (use alex/ age progression)
- Multi-language needs (text is baked into images)

### Customization Options

**To generate variations**:
1. Modify persona titles/subtitles in `scripts/generate-persona-welcome-images.js`
2. Adjust brand colors (hex codes)
3. Keep template composition locked for consistency
4. Run generation: `node scripts/generate-persona-welcome-images.js`

**Cost**: $0.08 per image via Ideogram v2

---

## Generation Report

Full metadata available in: `generation-report.json`

**Sample Report Structure**:
```json
{
  "generated": "2026-02-15T...",
  "duration": "185.5s",
  "personas": 8,
  "successful": 8,
  "failed": 0,
  "totalCost": "$0.64",
  "costPerImage": "$0.08",
  "model": "ideogram-ai/ideogram-v2",
  "aspectRatio": "1:1",
  "resolution": "1024x1024",
  "results": [...]
}
```

---

## Future Enhancements

**Potential additions** (not yet implemented):

1. **Additional Personas**:
   - Project Manager (PROJECTS)
   - DevOps Engineer (INFRASTRUCTURE)
   - Security Engineer (SECURITY)
   - Content Creator (CONTENT)

2. **Size Variations**:
   - 3:4 aspect ratio for mobile/portrait displays
   - Ultra-wide 3:1 for desktop hero banners
   - Small square 512x512 for avatars

3. **Animation**:
   - Rocket thrust flame animation
   - Particle effects
   - Text glow pulsing

4. **Localization**:
   - Generate clean backgrounds (no text)
   - Overlay typography in code for multi-language support

---

## Related Documentation

- **Character Identity**: [alex/Alex-Finch.md](../alex/Alex-Finch.md) - Core Alex character profile
- **Marketing Plan**: [alex_docs/marketing/MARKETING-PLAN.md](../marketing/MARKETING-PLAN.md) - Persona definitions
- **Persona Deep Dive**: [alex_docs/marketing/PERSONA-POWER-USER-VETERAN.md](../marketing/PERSONA-POWER-USER-VETERAN.md) - Primary persona
- **Banner Skill**: [.github/skills/ai-generated-readme-banners/SKILL.md](../../.github/skills/ai-generated-readme-banners/SKILL.md) - Generation techniques

---

## License & Attribution

**Images**: Generated via Ideogram v2 API (February 2026)
**Copyright**: © 2026 CorreaX / Fabio Correa
**License**: Same as parent project (Apache 2.0)
**Attribution**: "Generated by Alex Cognitive Architecture using Ideogram v2"

---

*Generated with consistency. Powered by template-driven AI.*
