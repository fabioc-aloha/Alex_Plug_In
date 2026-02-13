---
name: "svg-graphics"
description: "Scalable, accessible, theme-aware visuals."
---

# SVG Graphics Skill

> Scalable, accessible, theme-aware visuals.

## Why SVG

- Scales infinitely (retina, print)
- Text is searchable/accessible
- CSS-styleable (dark mode!)
- Small file size
- Version control friendly

## Banner Template

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300">
  <!-- Background -->
  <rect width="100%" height="100%" fill="#1a1a2e"/>

  <!-- Title -->
  <text x="50" y="100" font-size="48" fill="#fff" font-family="system-ui">
    Project Name
  </text>

  <!-- Tagline -->
  <text x="50" y="150" font-size="24" fill="#888">
    One-line description
  </text>

  <!-- Feature pills -->
  <g transform="translate(50, 200)">
    <rect rx="12" width="100" height="24" fill="#4a4a6a"/>
    <text x="50" y="17" text-anchor="middle" fill="#fff" font-size="12">Feature 1</text>
  </g>
</svg>
```

## Key Techniques

| Technique | Use Case |
| --------- | -------- |
| `viewBox` | Responsive scaling |
| `<defs>` + `<use>` | Reusable components |
| `<linearGradient>` | Modern backgrounds |
| `<clipPath>` | Shaped containers |
| CSS variables | Theme switching |

## Dark/Light Mode

```xml
<style>
  @media (prefers-color-scheme: dark) {
    .bg { fill: #1a1a2e; }
    .text { fill: #ffffff; }
  }
  @media (prefers-color-scheme: light) {
    .bg { fill: #ffffff; }
    .text { fill: #1a1a2e; }
  }
</style>
```

## Icon Guidelines

| Size | Use |
| ---- | --- |
| 16x16 | Favicon, small UI |
| 32x32 | Tab icon, lists |
| 128x128 | App icon |
| 512x512 | Store listing |

## SMIL Animation

### Delayed Fade-In Pattern

Elements that should appear after load (hero text, feature pills, etc.):

```xml
<!-- Element starts invisible, fades in after delay -->
<g opacity="0">
  <text x="50" y="100" font-size="48" fill="#fff">Title</text>
  <animate
    attributeName="opacity"
    from="0" to="1"
    dur="0.8s"
    begin="0.5s"
    fill="freeze"
  />
</g>
```

**Key attributes**:

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `begin` | Delay before start | `"0.5s"`, `"1s"`, `"click"` |
| `dur` | Animation duration | `"0.3s"` to `"2s"` typical |
| `fill` | State after animation | `"freeze"` (keep end state) or `"remove"` (revert) |
| `repeatCount` | Repetitions | `"1"`, `"3"`, `"indefinite"` |

### Staggered Entrance

Multiple elements appearing in sequence:

```xml
<g opacity="0">
  <rect rx="12" width="100" height="24" fill="#4a4a6a"/>
  <text x="50" y="17" text-anchor="middle" fill="#fff" font-size="12">Feature 1</text>
  <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.3s" fill="freeze"/>
</g>
<g opacity="0">
  <rect rx="12" width="100" height="24" fill="#4a4a6a"/>
  <text x="50" y="17" text-anchor="middle" fill="#fff" font-size="12">Feature 2</text>
  <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.6s" fill="freeze"/>
</g>
<g opacity="0">
  <rect rx="12" width="100" height="24" fill="#4a4a6a"/>
  <text x="50" y="17" text-anchor="middle" fill="#fff" font-size="12">Feature 3</text>
  <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.9s" fill="freeze"/>
</g>
```

**Pattern**: Increment `begin` by `0.3s` per element for smooth staggering.

### SMIL Compatibility

| Platform | Support |
|----------|---------|
| Chrome/Edge | Full SMIL |
| Firefox | Full SMIL |
| Safari | Full SMIL |
| GitHub README | **No animation** (static render) |
| npm/PyPI README | **No animation** (static render) |

**Rule**: For README badges/banners, set initial `opacity="1"` as fallback — animated SVGs render as static first frame in non-animated contexts.

## CSS Transform Patterns

### The Nested Group Pattern

**Problem**: Combining position transforms (`translate`) with animation transforms (`rotate`, `scale`) on the same element causes conflicts — the animation resets position.

**Solution**: Use nested `<g>` groups to separate concerns:

```xml
<!-- Outer group: POSITION (static) -->
<g transform="translate(600, 150)">
  <!-- Inner group: ANIMATION (dynamic) -->
  <g>
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0" to="360"
      dur="10s"
      repeatCount="indefinite"
    />
    <!-- The actual shape -->
    <circle r="20" fill="#4a90d9"/>
  </g>
</g>
```

**Rule**: Never mix static positioning and animated transforms on the same element. Always wrap in a positioning group.

### Scale from Center

```xml
<g transform="translate(100, 100)">
  <!-- transform-origin doesn't work reliably in SVG; 
       use translate to center, then scale -->
  <g>
    <animateTransform
      attributeName="transform"
      type="scale"
      from="0.8" to="1.0"
      dur="0.5s"
      fill="freeze"
    />
    <!-- Shape centered at origin (0,0) -->
    <circle cx="0" cy="0" r="30" fill="#d3f5db"/>
  </g>
</g>
```

### Pulse Effect

```xml
<circle cx="50" cy="50" r="10" fill="#cf222e">
  <animateTransform
    attributeName="transform"
    type="scale"
    values="1;1.2;1"
    dur="1.5s"
    repeatCount="indefinite"
  />
</circle>
```

## ClipPath Container Layering

### The 3-Layer Pattern

For shaped containers with content and visible borders:

```xml
<defs>
  <clipPath id="container-clip">
    <rect x="50" y="50" width="400" height="200" rx="16"/>
  </clipPath>
</defs>

<!-- Layer 1: BACKGROUND (fill behind clip) -->
<rect x="50" y="50" width="400" height="200" rx="16" fill="#f6f8fa"/>

<!-- Layer 2: CLIPPED CONTENT (stays inside shape) -->
<g clip-path="url(#container-clip)">
  <!-- Content that may overflow is safely clipped -->
  <image href="photo.jpg" x="50" y="50" width="400" height="200"/>
  <text x="70" y="120" font-size="24" fill="#fff">Overlay Text</text>
</g>

<!-- Layer 3: BORDER OUTLINE (drawn last, on top) -->
<rect x="50" y="50" width="400" height="200" rx="16" 
      fill="none" stroke="#d1d9e0" stroke-width="2"/>
```

**Draw order matters**:
1. Background fill (behind everything)
2. Clipped content group (contained within shape)
3. Border outline (on top, `fill="none"`)

### Rounded Card Pattern

```xml
<defs>
  <clipPath id="card">
    <rect width="300" height="180" rx="12"/>
  </clipPath>
</defs>

<g transform="translate(20, 20)">
  <!-- Card background -->
  <rect width="300" height="180" rx="12" fill="#ffffff"/>
  
  <!-- Card content (clipped) -->
  <g clip-path="url(#card)">
    <!-- Header band -->
    <rect width="300" height="48" fill="#0550ae"/>
    <text x="16" y="32" fill="#fff" font-size="16" font-weight="bold">Card Title</text>
    <!-- Body -->
    <text x="16" y="80" fill="#1f2328" font-size="14">Card content here</text>
  </g>
  
  <!-- Card border -->
  <rect width="300" height="180" rx="12" fill="none" stroke="#d1d9e0"/>
</g>
```

## SVG Optimization

### SVGO Configuration

```json
{
  "plugins": [
    "preset-default",
    { "name": "removeViewBox", "active": false },
    { "name": "removeDimensions", "active": true },
    { "name": "removeTitle", "active": false }
  ]
}
```

**Critical**: Never remove `viewBox` (breaks scaling) or `<title>` (breaks accessibility).

### Size Budget

| SVG Type | Target Size | Max |
|----------|-------------|-----|
| Icon | < 1 KB | 2 KB |
| Badge/shield | < 2 KB | 5 KB |
| Banner | < 10 KB | 25 KB |
| Complex diagram | < 25 KB | 50 KB |

### Common Optimization Wins

| Technique | Savings |
|-----------|---------|
| Remove editor metadata (Inkscape, Illustrator) | 20-50% |
| Simplify paths (reduce decimal precision) | 10-20% |
| Remove empty groups/unused defs | 5-15% |
| Convert shapes to paths | 5-10% |
| Gzip on server | 60-80% additional |

## Accessibility

- `role="img"` on decorative SVGs
- `<title>` for screen readers
- Sufficient contrast (4.5:1 min)
- `aria-hidden="true"` if decorative

## Tools

| Tool | Purpose |
| ---- | ------- |
| SVGO | Optimize/minify |
| Inkscape | Visual editing |
| svg-to-png | Rasterization |

## SVG for Documentation Illustrations

SVG isn't just for branding — it's the best format for **polished documentation visuals** that need more control than Mermaid provides.

### When to Choose SVG Over Mermaid

| Scenario | Use SVG | Use Mermaid |
|----------|---------|-------------|
| Architecture overview for README | ✅ Branded, polished | ❌ Too generic |
| Internal dev docs flow | ❌ Overkill | ✅ Quick, accurate |
| Marketing / landing page | ✅ Full design control | ❌ Unbranded |
| Infographic with custom layout | ✅ Arbitrary positioning | ❌ Auto-layout only |
| Dark/light theme required | ✅ CSS media queries | ⚠️ Limited theming |
| Print / high-DPI output | ✅ Infinitely scalable | ⚠️ Rasterized at render |

### Illustration Template

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" role="img">
  <title>Architecture Overview</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1e1e1e; }
      .text { fill: #d4d4d4; }
      .box { fill: #2d2d2d; stroke: #444; }
      .accent { fill: #0078d4; }
    }
    @media (prefers-color-scheme: light) {
      .bg { fill: #ffffff; }
      .text { fill: #1a1a1a; }
      .box { fill: #f5f5f5; stroke: #ddd; }
      .accent { fill: #0078d4; }
    }
    .label { font-family: system-ui, sans-serif; font-size: 14px; }
    .title-text { font-family: system-ui, sans-serif; font-size: 20px; font-weight: 600; }
    .connector { stroke-width: 2; stroke-dasharray: 4 4; }
  </style>

  <rect class="bg" width="100%" height="100%"/>

  <!-- Title -->
  <text class="title-text text" x="400" y="30" text-anchor="middle">Architecture Name</text>

  <!-- Boxes with rounded corners -->
  <g transform="translate(100, 60)">
    <rect class="box" rx="8" width="200" height="80" stroke-width="1.5"/>
    <text class="label text" x="100" y="45" text-anchor="middle">Component A</text>
  </g>

  <!-- Connector arrow -->
  <line class="connector accent" x1="300" y1="100" x2="400" y2="100"/>
  <polygon class="accent" points="400,95 410,100 400,105"/>

  <g transform="translate(420, 60)">
    <rect class="box" rx="8" width="200" height="80" stroke-width="1.5"/>
    <text class="label text" x="100" y="45" text-anchor="middle">Component B</text>
  </g>
</svg>
```

### Key Principles for Illustrations

1. **Always include dark/light mode** via `@media (prefers-color-scheme: ...)` — GitHub renders both
2. **Use semantic class names** (`.box`, `.accent`, `.connector`) not inline styles
3. **Center with `text-anchor="middle"`** — more maintainable than manual x positioning
4. **Group with `<g transform="translate()">`** — move entire components by adjusting one value
5. **Keep `viewBox` ratio consistent** — 800×400 (2:1) for wide illustrations, 600×600 (1:1) for square

## Synapses

See [synapses.json](synapses.json) for connections.
