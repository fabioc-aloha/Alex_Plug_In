---
applyTo: "**/*.svg,**/*banner*,**/*logo*,**/*icon*,**/*graphic*"
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

## Synapses

See [synapses.json](synapses.json) for connections.
