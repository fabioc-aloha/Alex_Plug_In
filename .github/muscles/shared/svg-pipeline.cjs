/**
 * shared/svg-pipeline.cjs — SVG creation, validation, and cross-format conversion
 * Version: 1.0.0
 *
 * Create SVGs that work correctly in Word, email, PDF, and web on first attempt.
 * Handles viewBox calculation, brand colors, theme-aware palettes, accessible text,
 * and PNG conversion for contexts that don't support inline SVG.
 *
 * Usage:
 *   const { createSvg, createIcon, createDiagram, svgToPng, validateSvg,
 *           BRAND_COLORS, THEME } = require('./shared/svg-pipeline.cjs');
 *
 *   // Create a simple diagram
 *   const svg = createDiagram({
 *     width: 800, height: 400,
 *     shapes: [
 *       { type: 'rect', x: 50, y: 50, w: 200, h: 80, label: 'Source', fill: 'blue' },
 *       { type: 'rect', x: 350, y: 50, w: 200, h: 80, label: 'Target', fill: 'green' },
 *     ],
 *     arrows: [{ from: 0, to: 1, label: 'flows' }],
 *   });
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// BRAND COLORS (from user preferences — pastel palette)
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_COLORS = {
  blue:     { fill: '#dbe9f6', stroke: '#80ccff', text: '#0550ae' },
  teal:     { fill: '#d4f5f7', stroke: '#5cc4cf', text: '#0d7a82' },
  green:    { fill: '#d4edda', stroke: '#6fdd8b', text: '#1a7f37' },
  purple:   { fill: '#e6d5f0', stroke: '#bf8aff', text: '#6639ba' },
  orange:   { fill: '#fce4e0', stroke: '#f5a3a3', text: '#cf222e' },
  gray:     { fill: '#eaeef2', stroke: '#afb8c1', text: '#24292f' },
  azure:    { fill: '#ddf4ff', stroke: '#80ccff', text: '#0550ae' },
  // Dark theme variants
  darkBlue: { fill: '#1c3a5e', stroke: '#4a90d9', text: '#a8d8ff' },
  darkGray: { fill: '#21262d', stroke: '#484f58', text: '#c9d1d9' },
};

const THEME = {
  light: {
    background: '#ffffff',
    text: '#1f2328',
    border: '#d0d7de',
    gridLine: '#eaeef2',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    fontSize: 14,
  },
  dark: {
    background: '#0d1117',
    text: '#c9d1d9',
    border: '#30363d',
    gridLine: '#21262d',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    fontSize: 14,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CORE SVG CREATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create an SVG document with proper viewBox, namespace, and accessibility.
 *
 * @param {object} options
 * @param {number} options.width - Width in px
 * @param {number} options.height - Height in px
 * @param {string} [options.title] - Accessible title
 * @param {string} [options.desc] - Accessible description
 * @param {string} [options.theme='light'] - 'light' or 'dark'
 * @param {string} [options.content] - Inner SVG content
 * @returns {string} Complete SVG document
 */
function createSvg(options = {}) {
  const w = options.width || 800;
  const h = options.height || 400;
  const theme = THEME[options.theme] || THEME.light;

  const titleTag = options.title ? `\n  <title>${_escXml(options.title)}</title>` : '';
  const descTag = options.desc ? `\n  <desc>${_escXml(options.desc)}</desc>` : '';
  const ariaLabel = options.title ? ` aria-labelledby="svg-title"` : '';
  const role = options.title ? ' role="img"' : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${role}${ariaLabel}>
  <style>
    text { font-family: ${theme.fontFamily}; font-size: ${theme.fontSize}px; fill: ${theme.text}; }
    .label { text-anchor: middle; dominant-baseline: central; }
    .small { font-size: ${theme.fontSize - 2}px; }
    .bold { font-weight: 600; }
    .heading { font-size: ${theme.fontSize + 4}px; font-weight: 600; }
  </style>${titleTag}${descTag}
  <rect width="${w}" height="${h}" fill="${theme.background}" rx="4"/>
${options.content || ''}
</svg>`;
}

/**
 * Create a simple icon SVG (square, single-color, suitable for favicons/logos).
 */
function createIcon(options = {}) {
  const size = options.size || 64;
  const bg = options.background || BRAND_COLORS.blue.fill;
  const fg = options.foreground || BRAND_COLORS.blue.text;
  const glyph = options.glyph || '?';
  const radius = options.radius || Math.round(size * 0.15);

  return createSvg({
    width: size, height: size,
    title: options.title || glyph,
    content: `  <rect width="${size}" height="${size}" fill="${bg}" rx="${radius}"/>
  <text x="${size / 2}" y="${size / 2}" class="label bold" style="font-size:${Math.round(size * 0.5)}px;fill:${fg}">${_escXml(glyph)}</text>`,
  });
}

/**
 * Create a diagram from structured shape/arrow data.
 * Automatically computes arrow paths between shape centers.
 *
 * @param {object} options
 * @param {number} [options.width=800]
 * @param {number} [options.height=400]
 * @param {string} [options.title]
 * @param {string} [options.theme='light']
 * @param {Array<{type: string, x: number, y: number, w?: number, h?: number, r?: number,
 *                 label: string, fill?: string, stroke?: string}>} options.shapes
 * @param {Array<{from: number, to: number, label?: string, dashed?: boolean}>} [options.arrows]
 * @returns {string} Complete SVG document
 */
function createDiagram(options = {}) {
  const shapes = options.shapes || [];
  const arrows = options.arrows || [];
  const content = [];

  // Arrow marker definition
  content.push('  <defs>');
  content.push('    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">');
  content.push(`      <polygon points="0 0, 10 3.5, 0 7" fill="${(THEME[options.theme] || THEME.light).text}"/>`);
  content.push('    </marker>');
  content.push('  </defs>');

  // Draw shapes
  for (let i = 0; i < shapes.length; i++) {
    const s = shapes[i];
    const color = BRAND_COLORS[s.fill] || { fill: s.fill || '#eaeef2', stroke: s.stroke || '#afb8c1', text: '#24292f' };
    const stroke = s.stroke ? (BRAND_COLORS[s.stroke] || { stroke: s.stroke }).stroke || s.stroke : color.stroke;

    if (s.type === 'circle' || s.type === 'ellipse') {
      const r = s.r || 40;
      content.push(`  <ellipse cx="${s.x + r}" cy="${s.y + r}" rx="${r}" ry="${s.h ? s.h / 2 : r}" fill="${color.fill}" stroke="${stroke}" stroke-width="1.5"/>`);
      content.push(`  <text x="${s.x + r}" y="${s.y + (s.h || r * 2) / 2}" class="label" style="fill:${color.text}">${_escXml(s.label)}</text>`);
    } else if (s.type === 'diamond') {
      const w = s.w || 100, h = s.h || 80;
      const cx = s.x + w / 2, cy = s.y + h / 2;
      content.push(`  <polygon points="${cx},${s.y} ${s.x + w},${cy} ${cx},${s.y + h} ${s.x},${cy}" fill="${color.fill}" stroke="${stroke}" stroke-width="1.5"/>`);
      content.push(`  <text x="${cx}" y="${cy}" class="label small" style="fill:${color.text}">${_escXml(s.label)}</text>`);
    } else {
      // rect (default)
      const w = s.w || 150, h = s.h || 60;
      const rx = s.rx || 6;
      content.push(`  <rect x="${s.x}" y="${s.y}" width="${w}" height="${h}" fill="${color.fill}" stroke="${stroke}" stroke-width="1.5" rx="${rx}"/>`);
      content.push(`  <text x="${s.x + w / 2}" y="${s.y + h / 2}" class="label" style="fill:${color.text}">${_escXml(s.label)}</text>`);
    }
  }

  // Draw arrows
  for (const arrow of arrows) {
    const from = shapes[arrow.from];
    const to = shapes[arrow.to];
    if (!from || !to) continue;
    const fc = _center(from);
    const tc = _center(to);
    const dash = arrow.dashed ? ' stroke-dasharray="6,3"' : '';
    content.push(`  <line x1="${fc.x}" y1="${fc.y}" x2="${tc.x}" y2="${tc.y}" stroke="${(THEME[options.theme] || THEME.light).text}" stroke-width="1.5" marker-end="url(#arrowhead)"${dash}/>`);
    if (arrow.label) {
      const mx = (fc.x + tc.x) / 2, my = (fc.y + tc.y) / 2 - 8;
      content.push(`  <text x="${mx}" y="${my}" class="label small">${_escXml(arrow.label)}</text>`);
    }
  }

  return createSvg({
    width: options.width,
    height: options.height,
    title: options.title,
    theme: options.theme,
    content: content.join('\n'),
  });
}

/**
 * Create a status badge SVG (like shields.io format).
 */
function createBadge(options = {}) {
  const label = options.label || 'status';
  const value = options.value || 'ok';
  const color = BRAND_COLORS[options.color] || BRAND_COLORS.green;
  const lw = label.length * 7 + 10;
  const vw = value.length * 7 + 10;
  const w = lw + vw;

  return createSvg({
    width: w, height: 20,
    title: `${label}: ${value}`,
    content: `  <rect width="${lw}" height="20" fill="#555" rx="3"/>
  <rect x="${lw}" width="${vw}" height="20" fill="${color.fill}" rx="3"/>
  <rect x="${lw}" width="3" height="20" fill="${color.fill}"/>
  <text x="${lw / 2}" y="10" class="label" style="font-size:11px;fill:#fff">${_escXml(label)}</text>
  <text x="${lw + vw / 2}" y="10" class="label" style="font-size:11px;fill:${color.text}">${_escXml(value)}</text>`,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate an SVG string for common issues that break in Word/email/PDF.
 * Returns { valid: boolean, warnings: string[] }
 */
function validateSvg(svgString) {
  const warnings = [];

  if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
    warnings.push('Missing xmlns attribute — SVG may not render in Word or email');
  }
  if (!svgString.includes('viewBox')) {
    warnings.push('Missing viewBox — SVG will not scale responsively');
  }
  if (!svgString.includes('width=') || !svgString.includes('height=')) {
    warnings.push('Missing explicit width/height — Word and email need these');
  }
  if (svgString.includes('<foreignObject')) {
    warnings.push('Contains <foreignObject> — not supported in Word or most email clients');
  }
  if (svgString.includes('url(') && !svgString.includes('data:')) {
    warnings.push('Contains external URL references — may not resolve in offline/email contexts');
  }
  if (/<text[^>]*>/.test(svgString) && !svgString.includes('font-family')) {
    warnings.push('Text without font-family — will use system default, may look different across platforms');
  }
  if (svgString.includes('clip-path') || svgString.includes('filter:')) {
    warnings.push('Uses clip-path or CSS filter — limited support in email clients');
  }
  if (svgString.length > 100000) {
    warnings.push(`Large SVG (${Math.round(svgString.length / 1024)}KB) — consider converting to PNG for email`);
  }

  return { valid: warnings.length === 0, warnings };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert SVG to PNG using Inkscape or rsvg-convert (fallback: sharp if available).
 * Returns the output file path.
 */
function svgToPng(svgPath, outputPath, options = {}) {
  const width = options.width || 1200;
  const dpi = options.dpi || 150;

  // Try Inkscape first (best quality)
  try {
    execSync(`inkscape "${svgPath}" --export-filename="${outputPath}" --export-width=${width} --export-dpi=${dpi}`, {
      stdio: 'pipe', timeout: 30000,
    });
    return outputPath;
  } catch { /* fall through */ }

  // Try rsvg-convert
  try {
    execSync(`rsvg-convert -w ${width} -o "${outputPath}" "${svgPath}"`, {
      stdio: 'pipe', timeout: 15000,
    });
    return outputPath;
  } catch { /* fall through */ }

  // Try magick (ImageMagick)
  try {
    execSync(`magick -density ${dpi} "${svgPath}" -resize ${width}x "${outputPath}"`, {
      stdio: 'pipe', timeout: 30000,
    });
    return outputPath;
  } catch { /* fall through */ }

  // Try sips (macOS built-in -- raster-to-raster only, no SVG rendering)
  if (process.platform === 'darwin' && !/\.svg$/i.test(svgPath)) {
    try {
      execSync(`sips -Z ${width} "${svgPath}" --out "${outputPath}"`, {
        stdio: 'pipe', timeout: 15000,
      });
      return outputPath;
    } catch { /* fall through */ }
  }

  throw new Error('No SVG-to-PNG converter found. Install Inkscape, rsvg-convert, or ImageMagick.');
}

/**
 * Save SVG string to file.
 */
function writeSvg(svgString, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, svgString, 'utf8');
  return outputPath;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function _escXml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _center(shape) {
  if (shape.type === 'circle' || shape.type === 'ellipse') {
    const r = shape.r || 40;
    return { x: shape.x + r, y: shape.y + (shape.h || r * 2) / 2 };
  }
  return { x: shape.x + (shape.w || 150) / 2, y: shape.y + (shape.h || 60) / 2 };
}

module.exports = {
  createSvg,
  createIcon,
  createDiagram,
  createBadge,
  validateSvg,
  svgToPng,
  writeSvg,
  BRAND_COLORS,
  THEME,
};
