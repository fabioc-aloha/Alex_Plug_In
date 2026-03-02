---
description: "Brand asset deployment, visual identity guidelines, and logo management"
applyTo: "**/assets/**,**/*.svg,**/*.png,**/*.ico"
---

# Brand Asset Management

**Purpose**: Procedural memory for Alex brand asset deployment and maintenance
**Created**: 2026-02-06 (Meditation session - branding rebrand consolidation)

## Brand Hierarchy

| Level | Brand | Symbol | Usage |
|-------|-------|--------|-------|
| **Parent** | CorreaX | C split X mark | Footer attribution, legal |
| **Product** | Alex | A Negative Space Rocket | All Alex-specific assets |
| **Platform** | Per-heir | Logo variants | VS Code, M365, GitHub |

## Core Brand Elements

| Element | Value | Status |
|---------|-------|--------|
| **Tagline** | "Strap a Rocket to Your Back" | ✅ LOCKED |
| **Subtitle Template** | "Take Your [NOUN] to New Heights" | ✅ LOCKED |
| **Primary Icon** | `$(rocket)` codicon | ✅ LOCKED |
| **Colors** | Azure blue (#0078d4) + thrust orange (#ff6b35) | ✅ LOCKED |

### Website Palette (alex.correax.com)

The landing page (`docs/index.html`) uses a distinct dark-themed palette optimized for web:

| Element | Hex | Usage |
|---------|-----|-------|
| Primary gradient | `#667eea` → `#764ba2` | CTA buttons, accents |
| Background | `#1a1a2e` → `#0f3460` | Page gradient |
| Text | `#e8e8e8` / `#a8b2d1` | Primary / secondary |
| Muted | `#8892b0` / `#5a6a8a` | Feature text / footer |

The brain anatomy page (`docs/alex-brain-anatomy.html`) uses GitHub's dark palette for Mermaid diagram consistency.

## Persona Priority (by audience size)

1. CODE → 2. LEARNING → 3. CAREER → 4. CONTENT → 5. THESIS
6. RESEARCH → 7. WRITING → 8. PROJECTS → 9. DATA → 10. INFRASTRUCTURE

## Asset Locations

### Banners

| Location | File | Type | Purpose |
|----------|------|------|---------|
| `.github/assets/banner.svg` | Animated | 8.62 KB | GitHub READMEs |
| `platforms/vscode-extension/.github/assets/banner.svg` | Animated | 8.62 KB | Extension GitHub README |
| `platforms/vscode-extension/assets/banner.svg` | Static | 3.42 KB | Marketplace (compatibility) |
| `platforms/vscode-extension/assets/banner.png` | Static | 204 KB | Fallback PNG |
| `assets/banner.png` | Static | 204 KB | Legacy/external references |

### Logos

All logos use 30° rotation for dynamic launch angle.

| Location | File | Size | Purpose |
|----------|------|------|---------|
| `platforms/vscode-extension/assets/logo.svg` | 32x32 | 1.04 KB | Extension icon source (30° rotation) |
| `platforms/vscode-extension/assets/logo-mono.svg` | 24x24 | 0.64 KB | Activity bar (currentColor, 30° rotation) |
| `platforms/vscode-extension/assets/icon.png` | 128x128 | 3.58 KB | Marketplace icon |
| `platforms/m365-copilot/appPackage/color.png` | 192x192 | 10.61 KB | Teams color icon |
| `platforms/m365-copilot/appPackage/outline.png` | 32x32 | 1.20 KB | Teams outline icon |

## GK Premium Branding (v5.0)

**Metaphor Evolution**: Rocket strapped to back → Docked at space station

| Tier | Symbol | Meaning |
|------|--------|---------|
| **Standard** | A Negative Space Rocket | Individual project acceleration |
| **Premium (GK)** | Space Station + Docked Rocket | Cross-project knowledge hub |

### GK Assets

| Asset | Location | Status |
|-------|----------|--------|
| **GK Repo** | `Alex-Global-Knowledge/assets/banner.svg` | ✅ DEPLOYED |

### GK Brand Elements

| Element | Value |
|---------|-------|
| **Tagline** | "Your MISSION CONTROL for Cross-Project Wisdom" |
| **Colors** | Azure + orange + **sync green (#00ff88)** |
| **Status Badge** | "DOCKED & SYNCED" |
| **Feature Pills** | Patterns, Insights, Synced, Shareable |

### Concept Candidates (6 variations)

Refer to GK Banner Candidates table in marketing documentation.

## Platform-Specific Guidelines

### Heir-Specific Positioning (v5.6.0)

Each heir positions against its native platform, NOT generic "Copilot":

| Heir | Compares Against | Bottom Line |
|------|------------------|-------------|
| **VS Code** | **GitHub Copilot** | "GitHub Copilot = Powerful autocomplete → + Alex = Rocket strapped to your back" |
| **M365** | **M365 Copilot** | "M365 Copilot = Powerful AI toolbox → + Alex = Personal AI that grows with you" |

### Store Description Pattern

**Structure** (validated v5.6.0):
```
🚀 STRAP A ROCKET TO YOUR BACK
[Hook: You don't need X. You need thrust.]

━━━━━ [PLATFORM] vs [PLATFORM] + ALEX ━━━━━
▸ Capability: Before → After (6 rows)

━━━━━ WHY ALEX? ━━━━━
🚀 NO REFUELING BETWEEN LAUNCHES
🎯 PRE-BUILT PROPULSION  
🔍 INSPECT EVERY COMPONENT

━━━━━ TAKE YOUR [NOUN] TO NEW HEIGHTS ━━━━━
[Persona → Benefit mappings]

━━━━━ LAUNCH SEQUENCES ━━━━━
[Workflow examples]

[Bottom line comparison]
Stop walking. Start flying.
```

### Persona Copy Pattern

| Persona | Pain | Alex Benefit |
|---------|------|--------------|
| Developer | Re-explaining context | Ship faster, 92 skills remember architecture |
| Researcher | Literature scattered | Hypothesis → publication, accelerated |
| Grad Student | Thesis overwhelm | Literature review on autopilot |
| Tech Writer | Docs fall behind code | Docs that write themselves |
| DevOps | Manual infra, config drift | Same infra, every time |
| PM | Status chasing | 4-6× faster estimates |
| Content Creator | Ideas scattered | Ideas → posts in minutes |

### GitHub (Animated SVG Supported)
- Use `.github/assets/banner.svg` (animated rotating nouns)
- Animation: 20s cycle, 10 personas, crossfade pattern
- Tagline displays in banner itself

### VS Code Marketplace (Static Required)
- Use `assets/banner.png` (static CODE variant)
- Icon: `icon.png` (A Negative Space Rocket)
- Description: "Strap a rocket to your back..."

### M365 Teams (Static, Specific Sizes)
- `color.png`: 192x192 (A Negative Space Rocket, full color)
- `outline.png`: 32x32 (Monochrome rocket silhouette)
- `docs/index.html`: Static PNG for iframe preview

## PNG Generation

Generate PNGs from SVGs using sharp-cli:
```powershell
npx sharp-cli --input source.svg --output output.png -f png --density 150
```

The `--density 150` flag ensures crisp text rendering.

## AI-Generated Persona Images

**Purpose**: Branded visual assets for persona-specific welcome experiences  
**Tool**: Ideogram v2 via Replicate API  
**Location**: `alex_docs/alex2/` (8 persona images at 1024x1024)  
**Cost**: $0.08 per image ($0.64 total for full set)

### Template-Based Generation Pattern

**Key Success Factors**:
1. **Locked Composition**: Fixed rocket position (center-left, 30°), background, lighting
2. **Text Simplification**: Short words (<10 chars) for clean typography rendering
   - ❌ "DOCUMENTATION" → ✅ "DOCS"
   - ❌ "ANALYSIS" → ✅ "INSIGHTS"
3. **Variable Injection**: Only title, subtitle, and accent color change per persona

**Generation Script**: `scripts/generate-persona-welcome-images.js`

### Persona Image Catalog

| Persona | Filename | Title | Subtitle | Color |
|---------|----------|-------|----------|-------|
| Developer | `ALEX-DEVELOPER.png` | CODE | Ship faster, smarter | Azure blue #0078d4 |
| Academic | `ALEX-ACADEMIC.png` | RESEARCH | Accelerate discovery | Deep purple #7c3aed |
| Student | `ALEX-STUDENT.png` | LEARNING | Master your field | Electric teal #14b8a6 |
| Researcher | `ALEX-RESEARCHER.png` | INSIGHTS | Find patterns faster | Azure blue #0078d4 |
| Technical Writer | `ALEX-TECHNICAL-WRITER.png` | DOCS | Write with clarity | Deep purple #7c3aed |
| Data Engineer | `ALEX-DATA-ENGINEER.png` | DATA | Build pipelines better | Electric teal #14b8a6 |
| Business Analyst | `ALEX-BUSINESS-ANALYST.png` | INSIGHTS | Analyze with precision | Azure blue #0078d4 |
| Creative Writer | `ALEX-CREATIVE-WRITER.png` | STORIES | Create with confidence | Deep purple #7c3aed |

**Prompt Template Structure**:
```
SQUARE FORMAT BANNER (1024x1024)
TITLE TEXT: "[TITLE]" (large, bold, professional sans-serif)
SUBTITLE: "[SUBTITLE]" (medium weight below title)
ROCKET PLACEMENT: Center-left, 30° tilt, subtle trail
BACKGROUND: Clean gradient with accent color
COMPOSITION RULES: [Fixed layout specifications]
TYPOGRAPHY: Clean, no distortion, high contrast
```

**Quality Metrics**: 100% success rate with template approach (vs. 30% with custom prompts)

### Comparison: alex/ vs alex2/

| Aspect | `alex/` (Age Progression) | `alex2/` (Persona Branding) |
|--------|---------------------------|------------------------------|
| **Purpose** | Visual identity evolution | Persona-specific welcome |
| **Format** | Square portraits | Square banners with text |
| **Generation** | AI image (person aging) | Ideogram v2 (branded rockets) |
| **Consistency** | Sequential age stages | Template-based uniformity |
| **Text** | None | Bold titles + subtitles |
| **Usage** | Brand timeline/story | User interface personalization |

### Content Filter Considerations

**Issue**: Raw Mermaid/code syntax triggers "sensitive content" filters  
**Solution**: Parse structured syntax to natural language before API submission
- Convert `-->` to "connects to"
- Strip brackets `["label"]` to plain text
- Remove styling commands (`classDef`, `linkStyle`)

**Pattern**: Applies to any structured language (JSON, YAML, code) sent to content-filtered APIs

## Synapses

- [.github/skills/brand-asset-management/SKILL.md] (Critical, Implements, Bidirectional) - "Domain knowledge this procedure operationalizes"
- [.github/instructions/release-management.instructions.md] (Medium, Integrates, Backward) - "Asset verification during release"
- [.github/instructions/heir-skill-promotion.instructions.md] (Low, Documents, Forward) - "Heir branding alignment"

### External Knowledge
- GI-premium-tier-visual-metaphor-pattern-2026-02-06 (High, Validates) - "Tiered branding pattern in Global Knowledge"
- GI-heir-specific-positioning-pattern-2026-02-10 (High, Documents) - "Platform-specific comparison messaging"
