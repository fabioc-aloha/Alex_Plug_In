# Alex README Banners

This directory contains banner images for the Alex Cognitive Architecture README.

## Current Banners

### Main Banner
- **File**: `banner.svg` / `banner.png`
- **Style**: SVG with "Take Your CODE to New Heights" tagline
- **Usage**: Legacy banner, still in use

### Rocket-Themed Banners (SVG)

1. **banner-rocket-1.svg** — Left-aligned rocket, right-aligned text
   - Layout: Rocket on left, title on right
   - Subtitle: "Take Your CODE to New Heights"
   - CorreaX logo: Bottom left

2. **banner-rocket-2.svg** — Centered rocket, purple accent
   - Layout: Centered rocket above title
   - Subtitle: "Take Your LEARNING to New Heights"
   - CorreaX logo: Bottom right (purple)

3. **banner-rocket-3.svg** — Right-aligned rocket, teal accent
   - Layout: Rocket on right, title on left
   - Subtitle: "Take Your CAREER to New Heights"
   - CorreaX logo: Bottom center (teal)

### New Typography Banners (Generated with Ideogram v2)

1. **banner-main.png** — "ALEX / Cognitive Architecture"
   - Primary branding banner
   - Deep blue to purple gradient
   - Neural network visualization

2. **banner-capabilities.png** — "LEARN · REMEMBER · GROW"
   - Capabilities-focused messaging
   - Three-part visual metaphor
   - Your AI Learning Partner subtitle

3. **banner-vision.png** — "COGNITIVE SYMBIOSIS"
   - Vision and philosophy
   - Human-AI partnership visualization
   - Evolution from tool to partner

### Rocket Banners (Generated with Ideogram v2)

1. **banner-rocket-code.png** — "Strap a Rocket to Your Back"
   - Blue rocket with "A" cutout flying from bottom-left
   - Subtitle: "Take Your CODE to New Heights"
   - CorreaX logo: Bottom left (blue)
   - Deep space background with blue glow

2. **banner-rocket-learning.png** — "Strap a Rocket to Your Back"
   - Centered rocket pointing upward
   - Subtitle: "Take Your LEARNING to New Heights"
   - CorreaX logo: Bottom right (purple)
   - Purple/blue gradient background

3. **banner-rocket-career.png** — "Strap a Rocket to Your Back"
   - Rocket on right side with teal accents
   - Subtitle: "Take Your CAREER to New Heights"
   - CorreaX logo: Bottom center (teal)
   - Teal ambient lighting

## Generating Banners

To generate the typography banners:

```bash
# Set your Replicate API token
export REPLICATE_API_TOKEN="your-token-here"  # macOS/Linux
$env:REPLICATE_API_TOKEN="your-token-here"    # Windows PowerShell

# Run the generation script
node scripts/generate-readme-banners.js
```

**Cost**: $0.08 per banner × 3 = **$0.24 total**

## Design System

**Brand Colors**:
- Deep Blue: `#0078d4` (VS Code brand color)
- Vibrant Purple: `#7c3aed` (M365 accent)
- Electric Teal: `#14b8a6` (Highlight/accents)

**Typography**:
- Main titles: Bold modern sans-serif, uppercase
- Subtitles: Clean thin fonts, sentence case
- Always crystal clear, no distortion

**Style**:
- Photorealistic 3D rendering
- Modern tech aesthetic
- Clean professional composition
- Glowing effects, particle systems
- Neural network motifs

## Generation Report

See `banner-generation-report.json` for metadata about the most recent generation run.
