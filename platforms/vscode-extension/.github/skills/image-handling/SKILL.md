---
applyTo: "**/*.png,**/*.jpg,**/*.webp,**/*image*,**/*convert*"
---

# Image Handling Skill

> Right format, right size, right quality.

## Format Selection

| Format | Best For | Supports |
| ------ | -------- | -------- |
| SVG | Icons, logos, diagrams | Infinite scale, animation |
| PNG | Screenshots, transparency | Lossless, alpha channel |
| JPEG | Photos, gradients | Small size, no transparency |
| WebP | Web images | Best compression, both |
| ICO | Favicons | Multi-resolution |

## Conversion Commands

```powershell
# SVG to PNG (sharp/node)
npx sharp-cli -i input.svg -o output.png -w 512 -h 512

# ImageMagick
magick input.svg -resize 512x512 output.png
magick input.png -quality 85 output.jpg

# Multiple sizes
foreach ($size in 16,32,64,128,256,512) {
  magick input.svg -resize ${size}x${size} "icon-$size.png"
}
```

## GitHub README Images

```markdown
<!-- Absolute URL (always works) -->
![Banner](https://raw.githubusercontent.com/user/repo/main/assets/banner.svg)

<!-- Relative (works in repo) -->
![Banner](./assets/banner.png)

<!-- With dark/light variants -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="banner-dark.svg">
  <img src="banner-light.svg" alt="Banner">
</picture>
```

## Size Guidelines

| Use Case | Max Size | Recommended |
| -------- | -------- | ----------- |
| README banner | 500KB | < 100KB |
| Documentation | 200KB | < 50KB |
| Icons | 50KB | < 10KB |
| Favicon | 10KB | < 5KB |

## Optimization

```powershell
# PNG optimization
pngquant --quality=65-80 input.png -o output.png

# JPEG optimization
jpegoptim --max=85 input.jpg

# SVG optimization
npx svgo input.svg -o output.svg
```

## Batch Processing

```powershell
# Convert all SVGs to PNGs
Get-ChildItem *.svg | ForEach-Object {
  $out = $_.BaseName + ".png"
  magick $_.Name -resize 256x256 $out
}
```

## Synapses

See [synapses.json](synapses.json) for connections.
