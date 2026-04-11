/**
 * shared/markdown-preprocessor.cjs - Unified markdown preprocessing pipeline
 *
 * Merges proven transforms from:
 * - md-to-word.cjs (BOM, checkboxes, list spacing, heading spacing)
 * - VT build-pdf.js (callouts, highlights, kbd, sub/sup, definitions)
 * - AlexBooks build-epub.js (page-break directives, landscape sections)
 * - AIRS preprocess_latex_tables.py (LaTeX math -> Unicode)
 *
 * Usage:
 *   const { preprocessMarkdown, convertLatexMath } = require('./shared/markdown-preprocessor.cjs');
 *   const processed = preprocessMarkdown(rawContent, { format: 'docx' });
 */

const LATEX_MATH_MAP = [
  [/\\alpha/g, '\u03B1'], [/\\beta/g, '\u03B2'], [/\\gamma/g, '\u03B3'],
  [/\\delta/g, '\u03B4'], [/\\epsilon/g, '\u03B5'], [/\\zeta/g, '\u03B6'],
  [/\\eta/g, '\u03B7'], [/\\theta/g, '\u03B8'], [/\\iota/g, '\u03B9'],
  [/\\kappa/g, '\u03BA'], [/\\lambda/g, '\u03BB'], [/\\mu/g, '\u03BC'],
  [/\\nu/g, '\u03BD'], [/\\xi/g, '\u03BE'], [/\\pi/g, '\u03C0'],
  [/\\rho/g, '\u03C1'], [/\\sigma/g, '\u03C3'], [/\\tau/g, '\u03C4'],
  [/\\phi/g, '\u03C6'], [/\\chi/g, '\u03C7'], [/\\psi/g, '\u03C8'],
  [/\\omega/g, '\u03C9'],
  [/\\Delta/g, '\u0394'], [/\\Sigma/g, '\u03A3'], [/\\Omega/g, '\u03A9'],
  [/\\times/g, '\u00D7'], [/\\div/g, '\u00F7'], [/\\pm/g, '\u00B1'],
  [/\\leq/g, '\u2264'], [/\\geq/g, '\u2265'], [/\\neq/g, '\u2260'],
  [/\\approx/g, '\u2248'], [/\\infty/g, '\u221E'], [/\\sum/g, '\u2211'],
  [/\\prod/g, '\u220F'], [/\\rightarrow/g, '\u2192'], [/\\leftarrow/g, '\u2190'],
  [/\\Rightarrow/g, '\u21D2'], [/\\Leftarrow/g, '\u21D0'],
  [/\\partial/g, '\u2202'], [/\\nabla/g, '\u2207'],
  [/\\sqrt\{([^}]+)\}/g, '\u221A($1)'],
];

const SUPERSCRIPT_MAP = {
  '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3',
  '4': '\u2074', '5': '\u2075', '6': '\u2076', '7': '\u2077',
  '8': '\u2078', '9': '\u2079', 'n': '\u207F', 'i': '\u2071',
  '+': '\u207A', '-': '\u207B', '=': '\u207C',
};

/**
 * Convert inline LaTeX math to Unicode symbols.
 * Handles $..$ and common LaTeX commands outside math mode.
 */
function convertLatexMath(content) {
  // Convert $inline math$ (but not $$display math$$)
  content = content.replace(/(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g, (_match, math) => {
    let result = math;
    for (const [pattern, replacement] of LATEX_MATH_MAP) {
      result = result.replace(pattern, replacement);
    }
    // Superscripts: ^{2} ->  or ^2 -> 
    result = result.replace(/\^{([^}]+)}/g, (_m, exp) =>
      exp.split('').map(c => SUPERSCRIPT_MAP[c] || c).join('')
    );
    result = result.replace(/\^([0-9ni])/g, (_m, c) => SUPERSCRIPT_MAP[c] || c);
    // Strip \text{}, \mathrm{}, \mathit{}, \mathbf{} wrappers
    result = result.replace(/\\(?:text|mathrm|mathit|mathbf)\{([^}]*)\}/g, '$1');
    return result;
  });

  // Also convert common LaTeX symbols outside math mode
  for (const [pattern, replacement] of LATEX_MATH_MAP) {
    content = content.replace(pattern, replacement);
  }

  return content;
}

/**
 * Strip YAML frontmatter from markdown content.
 * Returns { frontmatter: string|null, content: string }
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return { frontmatter: null, content };
  return {
    frontmatter: match[1],
    content: content.slice(match[0].length),
  };
}

/**
 * Full preprocessing pipeline. Options control which transforms run.
 *
 * @param {string} content - Raw markdown
 * @param {object} options - { format: 'docx'|'pdf'|'epub'|'email'|'gamma', stripFrontmatter: bool }
 * @returns {string} Preprocessed markdown
 */
function preprocessMarkdown(content, options = {}) {
  const format = options.format || 'docx';

  // Strip UTF-8 BOM
  content = content.replace(/^\uFEFF/, '');

  // Optionally strip frontmatter
  if (options.stripFrontmatter) {
    const { content: body } = extractFrontmatter(content);
    content = body;
  }

  // LaTeX math -> Unicode
  content = convertLatexMath(content);

  // Page-break directives
  content = content.replace(/<!--\s*pagebreak\s*-->/gi, '\\newpage');
  content = content.replace(/<div\s+class\s*=\s*["']page-break["']\s*(?:\/\s*)?>/gi, '\\newpage');
  content = content.replace(/<div\s+style\s*=\s*["']page-break-(?:before|after)\s*:\s*always;?["']\s*(?:\/\s*)?>/gi, '\\newpage');

  // Landscape section markers
  content = content.replace(/<!--\s*landscape\s*-->/gi,
    '\\newpage\n\n::: {custom-style="LandscapeSection"}\n');
  content = content.replace(/<!--\s*portrait\s*-->/gi,
    '\n:::\n\n\\newpage');

  // Callout blocks: ::: tip / ::: warning / ::: note / ::: important / ::: caution
  content = content.replace(/^:::\s*(tip|warning|note|important|caution)\s*$/gim, (_, type) => {
    const icons = { tip: '\u{1F4A1}', warning: '\u26A0\uFE0F', note: '\u{1F4DD}', important: '\u2757', caution: '\u{1F525}' };
    const icon = icons[type.toLowerCase()] || '\u{1F4CC}';
    return `> **${icon} ${type.charAt(0).toUpperCase() + type.slice(1)}**\n>`;
  });
  content = content.replace(/^:::\s*$/gm, '');

  // GitHub-style callout syntax
  content = content.replace(/^>\s*\[!(TIP|WARNING|NOTE|IMPORTANT|CAUTION)\]\s*$/gim, (_, type) => {
    const icons = { TIP: '\u{1F4A1}', WARNING: '\u26A0\uFE0F', NOTE: '\u{1F4DD}', IMPORTANT: '\u2757', CAUTION: '\u{1F525}' };
    const icon = icons[type.toUpperCase()] || '\u{1F4CC}';
    return `> **${icon} ${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}**`;
  });

  // Keyboard shortcuts: [[Ctrl+S]]
  content = content.replace(/\[\[([^\]]+)\]\]/g, (_match, keys) => {
    return keys.split('+').map(k => `<kbd>${k.trim()}</kbd>`).join('+');
  });

  // Highlights: ==text==
  content = content.replace(/==([^=]+)==/g, '<mark>$1</mark>');

  // Subscript and superscript (must not span newlines or match footnote syntax [^N])
  content = content.replace(/(?<![~\\])~([^~\s][^~\n]*)~(?!~)/g, '<sub>$1</sub>');
  content = content.replace(/(?<![\\[\\]])\^([^^\s][^^\n]*)\^/g, '<sup>$1</sup>');

  // Definition lists
  content = content.replace(/^([^\n:>*#-][^\n]*)\n:\s+(.+)$/gm, '\n**$1**\n:   $2\n');

  // Line-level transforms
  const lines = content.split('\n');
  const result = [];
  let prevWasList = false;
  let prevWasBlank = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const stripped = line.trim();
    const isList = /^[-*+]\s|^\d+\.\s|^[-*+]\s*\[[ xX]\]/.test(stripped);
    const isBlank = !stripped;

    // Add blank line before lists
    if (isList && !prevWasList && !prevWasBlank && result.length > 0) {
      result.push('');
    }

    // Add blank line after heading
    if (i > 0 && result.length > 0) {
      const prevLine = lines[i - 1].trim();
      if (prevLine.startsWith('#') && !isBlank) {
        if (result[result.length - 1] !== '') {
          result.push('');
        }
      }
    }

    // Convert checkbox markers for pandoc compatibility
    if (/^[-*+]\s*\[ \]/.test(stripped)) {
      line = line.replace(/^([-*+])\s*\[ \]/, '$1 \u2610');
    } else if (/^[-*+]\s*\[[xX]\]/.test(stripped)) {
      line = line.replace(/^([-*+])\s*\[[xX]\]/, '$1 \u2611');
    }

    result.push(line);
    prevWasList = isList;
    prevWasBlank = isBlank;
  }

  // Add blank line after lists before non-list content
  const final = [];
  for (let i = 0; i < result.length; i++) {
    final.push(result[i]);
    const stripped = result[i].trim();
    const isList = /^[-*+]\s|^\d+\.\s|^[-*+]\s*[\u2610\u2611]/.test(stripped);
    if (isList && i + 1 < result.length) {
      const nextStripped = result[i + 1].trim();
      const nextIsList = /^[-*+]\s|^\d+\.\s|^[-*+]\s*[\u2610\u2611]/.test(nextStripped);
      if (!nextIsList && nextStripped) {
        final.push('');
      }
    }
  }
  return final.join('\n');
}

/**
 * Validate heading hierarchy -- detect jumps (e.g., H1->H3 skipping H2).
 * Returns warnings for each violation found.
 * @param {string} content - Markdown content
 * @returns {{ valid: boolean, warnings: string[] }}
 */
function validateHeadingHierarchy(content) {
  const warnings = [];
  let lastLevel = 0;
  let lineNum = 0;

  for (const line of content.split('\n')) {
    lineNum++;
    const match = line.match(/^(#{1,6})\s+/);
    if (!match) continue;
    const level = match[1].length;

    if (lastLevel > 0 && level > lastLevel + 1) {
      warnings.push(`Line ${lineNum}: heading level jumps from H${lastLevel} to H${level} (skips H${lastLevel + 1})`);
    }
    lastLevel = level;
  }

  return { valid: warnings.length === 0, warnings };
}

/**
 * Embed local image references as base64 data URIs in markdown.
 * Resolves relative image paths against sourceDir.
 * @param {string} content - Markdown content
 * @param {string} sourceDir - Directory to resolve relative paths against
 * @returns {string} Content with embedded images
 */
function embedLocalImages(content, sourceDir) {
  if (!sourceDir) return content;
  const path = require('path');
  const fs = require('fs');

  const MIME_MAP = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp', '.ico': 'image/x-icon',
  };

  // Match markdown image syntax: ![alt](path)
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)(\{[^}]*\})?/g, (full, alt, imgPath, attrs) => {
    // Skip URLs and data URIs
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://') || imgPath.startsWith('data:')) {
      return full;
    }
    const absPath = path.resolve(sourceDir, imgPath);
    if (!fs.existsSync(absPath)) return full;

    const ext = path.extname(absPath).toLowerCase();
    const mime = MIME_MAP[ext];
    if (!mime) return full;

    try {
      const buf = fs.readFileSync(absPath);
      const b64 = buf.toString('base64');
      const dataUri = `data:${mime};base64,${b64}`;
      return `![${alt}](${dataUri})${attrs || ''}`;
    } catch {
      return full;
    }
  });
}

/**
 * Validate markdown links -- detect broken local refs, empty URLs, and malformed syntax.
 * @param {string} content - Markdown content
 * @param {string} [sourceDir] - Directory to resolve relative link paths against
 * @returns {{ valid: boolean, warnings: string[] }}
 */
function validateLinks(content, sourceDir) {
  const warnings = [];
  const lines = content.split('\n');
  const fs = require('fs');
  const path = require('path');

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    // Match markdown links: [text](url) -- skip images ![text](url)
    const linkPattern = /(?<!!)\[([^\]]*)\]\(([^)]*)\)/g;
    let match;
    while ((match = linkPattern.exec(line)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2].trim();

      // Empty URL
      if (!linkUrl) {
        warnings.push(`Line ${lineNum}: empty link URL for "${linkText}"`);
        continue;
      }

      // Skip external URLs, anchors, and mailto
      if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://') ||
          linkUrl.startsWith('#') || linkUrl.startsWith('mailto:')) {
        continue;
      }

      // Check local file references (only if sourceDir provided)
      if (sourceDir) {
        const urlPath = linkUrl.split('#')[0]; // strip anchor
        if (urlPath) {
          const absPath = path.resolve(sourceDir, urlPath);
          if (!fs.existsSync(absPath)) {
            warnings.push(`Line ${lineNum}: broken local link "${urlPath}" (file not found)`);
          }
        }
      }
    }
  }

  return { valid: warnings.length === 0, warnings };
}

module.exports = {
  preprocessMarkdown,
  convertLatexMath,
  extractFrontmatter,
  validateHeadingHierarchy,
  embedLocalImages,
  validateLinks,
  LATEX_MATH_MAP,
  SUPERSCRIPT_MAP,
};
