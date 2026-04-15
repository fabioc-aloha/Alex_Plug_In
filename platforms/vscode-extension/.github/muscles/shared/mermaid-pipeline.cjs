/**
 * shared/mermaid-pipeline.cjs - Shared Mermaid diagram rendering pipeline
 *
 * Extracted from md-to-word.cjs and designed for reuse across all converters.
 * Supports format-aware scaling, palette injection, and syntax validation.
 *
 * Usage:
 *   const { findMermaidBlocks, renderMermaid, injectPalette } = require('./shared/mermaid-pipeline.cjs');
 *   const blocks = findMermaidBlocks(markdownContent);
 *   for (const block of blocks) {
 *     await renderMermaid(block.content, 'output.png', { scale: 8, width: 2400 });
 *   }
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Default scale per output format (harvested from AlexBooks/AIRS patterns)
const FORMAT_SCALES = {
  docx: { scale: 8, width: 2400 },
  pdf: { scale: 8, width: 2400 },
  epub: { scale: 2, width: 800 },
  html: { scale: 3, width: 1200 },
  email: { scale: 2, width: 600 },
};

// GitHub Pastel v2 palette (aligned with markdown-mermaid skill)
const BRAND_PALETTE = {
  blue: '#ddf4ff',       // Primary - trust, reliability
  green: '#d3f5db',      // Success, growth
  purple: '#d8b9ff',     // Consciousness, identity
  gold: '#fff8c5',       // Warnings, attention
  bronze: '#fff1e5',     // Connection, memory
  red: '#ffebe9',        // Errors, critical
  neutral: '#eaeef2',    // Muted, secondary
  textDark: '#1f2328',   // Primary text
  lineColor: '#57606a',  // Arrows, edges
  edgeLabelBg: '#ffffff' // CRITICAL: white background for edge labels
};

/**
 * Find all fenced Mermaid code blocks in markdown content.
 * Returns: [{ index, content, raw }]
 */
function findMermaidBlocks(content) {
  const pattern = /```mermaid\r?\n([\s\S]*?)```/g;
  const blocks = [];
  let m;
  while ((m = pattern.exec(content)) !== null) {
    blocks.push({ index: blocks.length, content: m[1], raw: m[0] });
  }
  return blocks;
}

/**
 * Inject %%{init}%% directive with theme config into Mermaid content.
 * Only injects if no existing %%{init}%% is present.
 */
function injectPalette(mmdContent, options = {}) {
  if (mmdContent.includes('%%{init')) return mmdContent;

  const palette = options.palette || BRAND_PALETTE;
  const theme = options.theme || 'base';

  const initDirective = `%%{init: {'theme': '${theme}', 'themeVariables': {` +
    `'primaryColor': '${palette.blue}', ` +
    `'secondaryColor': '${palette.green}', ` +
    `'tertiaryColor': '${palette.purple || palette.green}', ` +
    `'primaryTextColor': '${palette.textDark}', ` +
    `'lineColor': '${palette.lineColor || palette.textDark}', ` +
    `'edgeLabelBackground': '${palette.edgeLabelBg || '#ffffff'}'` +
    `}}}%%\n`;

  return initDirective + mmdContent;
}

/**
 * Validate Mermaid syntax by attempting a dry-run render.
 * Returns { valid: boolean, error?: string }
 */
function validateSyntax(mmdContent) {
  const tmpFile = path.join(os.tmpdir(), `mmd-validate-${Date.now()}.mmd`);
  const tmpOut = tmpFile.replace('.mmd', '.svg');
  try {
    fs.writeFileSync(tmpFile, mmdContent, 'utf8');
    execSync(`npx mmdc -i "${tmpFile}" -o "${tmpOut}" -b white`, {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000
    });
    return { valid: true };
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString() : String(err);
    return { valid: false, error: stderr.slice(0, 500) };
  } finally {
    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
    try { fs.unlinkSync(tmpOut); } catch { /* ignore */ }
  }
}

/**
 * Render a Mermaid diagram to PNG.
 *
 * @param {string} mmdContent - Raw Mermaid diagram source
 * @param {string} outputPath - Destination PNG file path
 * @param {object} options - { scale, width, format, injectPalette, background }
 * @returns {boolean} true if render succeeded
 */
function renderMermaid(mmdContent, outputPath, options = {}) {
  const format = options.format || 'docx';
  const defaults = FORMAT_SCALES[format] || FORMAT_SCALES.docx;
  const scale = options.scale || defaults.scale;
  const width = options.width || defaults.width;
  const bg = options.background || 'white';

  // Optional palette injection
  if (options.injectPalette) {
    mmdContent = injectPalette(mmdContent, options);
  }

  const tmpFile = path.join(os.tmpdir(), `mmd-render-${Date.now()}-${Math.random().toString(36).slice(2)}.mmd`);
  try {
    fs.writeFileSync(tmpFile, mmdContent, 'utf8');

    // Ensure output directory exists
    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    execSync(`npx mmdc -i "${tmpFile}" -o "${outputPath}" -b ${bg} -s ${scale} -w ${width}`, {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000
    });
    return true;
  } catch {
    return false;
  } finally {
    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
  }
}

/**
 * Convert SVG to PNG using svgexport.
 */
function convertSvgToPng(svgPath, pngPath, width = 800) {
  try {
    execSync(`npx svgexport "${svgPath}" "${pngPath}" ${width}:`, {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert a Mermaid diagram to a static markdown table fallback.
 * Useful for contexts like email where Mermaid can't render (e.g. .eml output).
 * Handles flowchart nodes and simple connections.
 */
function mermaidToTableFallback(mmdContent) {
  const lines = mmdContent.trim().split('\n');
  const nodes = [];
  const connections = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip directives and empty lines
    if (!trimmed || trimmed.startsWith('%%') || trimmed.startsWith('graph') ||
        trimmed.startsWith('flowchart') || trimmed.startsWith('sequenceDiagram') ||
        trimmed.startsWith('gantt') || trimmed.startsWith('pie') ||
        trimmed.startsWith('classDiagram') || trimmed.startsWith('stateDiagram') ||
        trimmed.startsWith('erDiagram') || trimmed.startsWith('journey') ||
        trimmed.startsWith('gitGraph') || trimmed.startsWith('mindmap') ||
        trimmed.startsWith('timeline') || trimmed.startsWith('title') ||
        trimmed.startsWith('section') || trimmed.startsWith('end')) continue;

    // Node definitions: A[Label] or A(Label) or A{Label}
    const nodeMatch = trimmed.match(/^\s*(\w+)\s*[\[\({](.+?)[\]\)}]/);
    if (nodeMatch) {
      const [, id, label] = nodeMatch;
      if (!nodes.find(n => n.id === id)) {
        nodes.push({ id, label: label.replace(/<br\/>/g, ' ').trim() });
      }
    }

    // Connections: A --> B or A -->|label| B
    const connMatch = trimmed.match(/(\w+)\s*--[->|]+\s*(?:\|([^|]+)\|\s*)?(\w+)/);
    if (connMatch) {
      connections.push({
        from: connMatch[1],
        label: connMatch[2] || '',
        to: connMatch[3]
      });
    }
  }

  if (nodes.length === 0) return '*[Diagram]*';

  // Build a simple markdown table
  const rows = ['| Step | Description |', '|------|-------------|'];
  for (let i = 0; i < nodes.length; i++) {
    rows.push(`| ${i + 1} | ${nodes[i].label} |`);
  }

  if (connections.length > 0) {
    rows.push('', '| From | To | Relation |', '|------|-----|----------|');
    for (const conn of connections) {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      rows.push(`| ${fromNode ? fromNode.label : conn.from} | ${toNode ? toNode.label : conn.to} | ${conn.label} |`);
    }
  }

  return rows.join('\n');
}

// -----------------------------------------------------------------------------
// CREATION HELPERS -- scaffold correct, brand-aware Mermaid on first attempt
// -----------------------------------------------------------------------------

/**
 * Wrap mermaid code in a markdown fenced code block.
 * Optionally injects brand palette init directive.
 */
function wrapInFence(mermaidCode, options = {}) {
  const code = options.brandPalette !== false ? injectPalette(mermaidCode, options) : mermaidCode;
  return '```mermaid\n' + code.trim() + '\n```';
}

/**
 * Create a flowchart from structured data.
 *
 * @param {object} options
 * @param {string} [options.direction='TD'] - TD, LR, BT, RL
 * @param {Array<{id: string, label: string, shape?: string, style?: string}>} options.nodes
 * @param {Array<{from: string, to: string, label?: string, style?: string}>} options.edges
 * @param {Array<{name: string, nodes: string[], style?: string}>} [options.groups] - subgraphs
 * @param {boolean} [options.brandPalette=true] - inject brand palette
 * @returns {string} Complete mermaid code block (fenced)
 *
 * @example
 *   createFlowchart({
 *     direction: 'TD',
 *     nodes: [
 *       { id: 'A', label: 'Start', shape: 'round' },
 *       { id: 'B', label: 'Process' },
 *       { id: 'C', label: 'End', shape: 'round' },
 *     ],
 *     edges: [
 *       { from: 'A', to: 'B', label: 'step 1' },
 *       { from: 'B', to: 'C' },
 *     ],
 *   })
 */
function createFlowchart(options = {}) {
  const dir = options.direction || (options.nodes && options.nodes.length > 3 ? 'TD' : 'LR');
  const lines = [`flowchart ${dir}`];

  // Subgraphs
  if (options.groups) {
    for (const group of options.groups) {
      lines.push(`    subgraph ${group.name}`);
      if (group.direction) lines.push(`        direction ${group.direction}`);
      for (const nodeId of group.nodes) {
        const node = (options.nodes || []).find(n => n.id === nodeId);
        if (node) lines.push(`        ${_formatNode(node)}`);
      }
      lines.push('    end');
      if (group.style) {
        lines.push(`    style ${group.name} ${group.style}`);
      }
    }
  }

  // Standalone nodes (not in any group)
  const groupedIds = new Set((options.groups || []).flatMap(g => g.nodes));
  for (const node of options.nodes || []) {
    if (!groupedIds.has(node.id)) {
      lines.push(`    ${_formatNode(node)}`);
    }
  }

  // Edges
  for (const edge of options.edges || []) {
    const arrow = edge.style === 'dotted' ? '-.->' : edge.style === 'thick' ? '==>' : '-->';
    const label = edge.label ? `|${edge.label}|` : '';
    lines.push(`    ${edge.from} ${arrow}${label} ${edge.to}`);
  }

  // Node styles
  for (const node of options.nodes || []) {
    if (node.style) {
      lines.push(`    style ${node.id} ${node.style}`);
    }
  }

  // Class definitions for brand colors
  if (options.classDefs) {
    for (const [name, def] of Object.entries(options.classDefs)) {
      lines.push(`    classDef ${name} ${def}`);
    }
  }

  return wrapInFence(lines.join('\n'), options);
}

function _formatNode(node) {
  const shapes = {
    round: ['(', ')'],
    stadium: ['([', '])'],
    subroutine: ['[[', ']]'],
    cylinder: ['[(', ')]'],
    circle: ['((', '))'],
    diamond: ['{', '}'],
    hexagon: ['{{', '}}'],
    default: ['["', '"]'],
  };
  const [open, close] = shapes[node.shape] || shapes.default;
  const label = node.label.includes('<br') ? node.label : node.label;
  return `${node.id}${open}${label}${close}`;
}

/**
 * Create a sequence diagram from structured data.
 *
 * @param {object} options
 * @param {string[]} options.participants - participant names
 * @param {Array<{from: string, to: string, label: string, type?: string}>} options.messages
 * @param {Array<{type: string, label: string, messages: Array}>} [options.blocks] - alt/opt/loop
 * @returns {string} Complete mermaid code block (fenced)
 */
function createSequence(options = {}) {
  const lines = ['sequenceDiagram'];

  for (const p of options.participants || []) {
    const name = typeof p === 'string' ? p : p.name;
    const alias = typeof p === 'string' ? null : p.alias;
    lines.push(alias ? `    participant ${alias} as ${name}` : `    participant ${name}`);
  }

  const _addMessage = (msg) => {
    const arrows = { solid: '->>', dotted: '-->>',  reply: '->>',  replyDotted: '-->>',  sync: '->', asyncMsg: '--)' };
    const arrow = arrows[msg.type] || '->>';
    lines.push(`    ${msg.from}${arrow}${msg.to}: ${msg.label}`);
  };

  for (const item of options.messages || []) {
    if (item.block) {
      lines.push(`    ${item.block} ${item.label || ''}`);
      for (const inner of item.messages || []) {
        _addMessage(inner);
      }
      lines.push('    end');
    } else {
      _addMessage(item);
    }
  }

  if (options.notes) {
    for (const note of options.notes) {
      const pos = note.position || 'right of';
      lines.push(`    Note ${pos} ${note.participant}: ${note.text}`);
    }
  }

  return wrapInFence(lines.join('\n'), options);
}

/**
 * Create a Gantt chart from structured data.
 *
 * @param {object} options
 * @param {string} options.title
 * @param {string} [options.dateFormat='YYYY-MM-DD']
 * @param {Array<{name: string, tasks: Array<{name: string, id?: string, start?: string, duration?: string, status?: string, after?: string}>}>} options.sections
 * @returns {string} Complete mermaid code block (fenced)
 */
function createGantt(options = {}) {
  const lines = ['gantt'];
  if (options.title) lines.push(`    title ${options.title}`);
  lines.push(`    dateFormat ${options.dateFormat || 'YYYY-MM-DD'}`);
  if (options.excludes) lines.push(`    excludes ${options.excludes}`);

  for (const section of options.sections || []) {
    lines.push(`    section ${section.name}`);
    for (const task of section.tasks || []) {
      const parts = [task.name, '    :'];
      if (task.status) parts.push(task.status + ',');
      if (task.id) parts.push(task.id + ',');
      if (task.after) parts.push('after ' + task.after + ',');
      else if (task.start) parts.push(task.start + ',');
      if (task.duration) parts.push(task.duration);
      lines.push(`    ${parts.join(' ').replace(/ +/g, ' ')}`);
    }
  }

  return wrapInFence(lines.join('\n'), options);
}

/**
 * Create a timeline from structured data.
 *
 * @param {object} options
 * @param {string} [options.title]
 * @param {Array<{period: string, events: string[]}>} options.entries
 * @returns {string} Complete mermaid code block (fenced)
 */
function createTimeline(options = {}) {
  const lines = ['timeline'];
  if (options.title) lines.push(`    title ${options.title}`);

  for (const entry of options.entries || []) {
    lines.push(`    ${entry.period}`);
    for (const event of entry.events || []) {
      lines.push(`        : ${event}`);
    }
  }

  return wrapInFence(lines.join('\n'), options);
}

/**
 * Create a mindmap from structured data.
 *
 * @param {object} options
 * @param {string} options.root - root node text
 * @param {Array<{text: string, children?: Array}>} options.branches
 * @returns {string} Complete mermaid code block (fenced)
 */
function createMindmap(options = {}) {
  const lines = ['mindmap'];
  lines.push(`  root(${options.root})`);

  const _addBranch = (branch, depth) => {
    const indent = '  '.repeat(depth + 1);
    lines.push(`${indent}${branch.text}`);
    for (const child of branch.children || []) {
      _addBranch(child, depth + 1);
    }
  };

  for (const branch of options.branches || []) {
    _addBranch(branch, 1);
  }

  return wrapInFence(lines.join('\n'), options);
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  findMermaidBlocks,
  injectPalette,
  validateSyntax,
  renderMermaid,
  convertSvgToPng,
  mermaidToTableFallback,
  // Creation helpers
  createFlowchart,
  createSequence,
  createGantt,
  createTimeline,
  createMindmap,
  wrapInFence,
  FORMAT_SCALES,
  BRAND_PALETTE,
};
