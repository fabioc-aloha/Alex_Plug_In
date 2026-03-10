#!/usr/bin/env node
// H5: Researcher session start
// Agent-scoped SessionStart hook for Researcher mode.
// Loads knowledge gaps + research trifecta context for better research continuity.
'use strict';

const fs = require('fs');
const path = require('path');

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch { /* defaults */ }

const workspaceRoot = input.cwd || path.resolve(__dirname, '../../..');
const lines = ['[Researcher SessionStart] Research mode active — understand before building.'];

// ── Load research findings index ───────────────────────────────────────────

const researchDir = path.join(workspaceRoot, 'alex_docs', 'research');
try {
  const files = fs.readdirSync(researchDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .slice(-10); // last 10 research docs by name (date-sorted naming convention)

  if (files.length > 0) {
    lines.push('', '**Recent research documents:**');
    for (const f of files) {
      lines.push(`- ${f}`);
    }
  }
} catch { /* research dir not found */ }

// ── Load active knowledge gaps from roadmap ────────────────────────────────

const roadmapPath = path.join(workspaceRoot, 'ROADMAP-UNIFIED.md');
try {
  const roadmap = fs.readFileSync(roadmapPath, 'utf8');
  const researchFindings = roadmap.match(/^### Research Findings[\s\S]*?(?=^## |$)/m);
  if (researchFindings) {
    const findings = researchFindings[0].trim().split('\n').slice(0, 15);
    lines.push('', '**Roadmap Research Findings (top items):**');
    lines.push(...findings);
  }
} catch { /* roadmap not found */ }

// ── Research-first trifecta context ────────────────────────────────────────

lines.push(
  '',
  '**Research-First Protocol:**',
  '1. Define the question clearly before searching',
  '2. Gather from multiple sources (docs, code, skills, web)',
  '3. Cross-validate findings — prefer primary sources',
  '4. Document gaps explicitly: "I don\'t know X yet"',
  '5. Hand off to Builder only when domain is understood',
  '',
  'Check alex_docs/research/ for existing work before starting new research.'
);

// ── Output ─────────────────────────────────────────────────────────────────

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: lines.join('\n')
  }
}));
