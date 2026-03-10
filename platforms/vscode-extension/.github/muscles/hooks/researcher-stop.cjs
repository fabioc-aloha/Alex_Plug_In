#!/usr/bin/env node
// H20: Research continuity
// Agent-scoped Stop hook for Researcher mode.
// Reminds to save unanswered questions and partial findings before the session ends.
'use strict';

const fs = require('fs');
const path = require('path');

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch { /* defaults */ }

const workspaceRoot = input.cwd || path.resolve(__dirname, '../../..');
const researchDir = path.join(workspaceRoot, 'alex_docs', 'research');

const lines = [
  'H20 RESEARCH CONTINUITY: Researcher session ending.',
  '',
  'Before closing, ensure research state is preserved:',
  '- Save unanswered questions to session memory or ROADMAP Research Findings',
  '- Document partial findings in alex_docs/research/ (even if incomplete)',
  '- Note which sources were checked and which still need review',
  '- Record any hypotheses not yet validated',
];

// Check if any research files were created/modified recently
try {
  const files = fs.readdirSync(researchDir).filter(f => f.endsWith('.md'));
  const recentFiles = files.filter(f => {
    const stat = fs.statSync(path.join(researchDir, f));
    const ageMinutes = (Date.now() - stat.mtimeMs) / 60000;
    return ageMinutes < 60; // modified in last hour
  });

  if (recentFiles.length > 0) {
    lines.push('', 'Research files modified this session:');
    for (const f of recentFiles) {
      lines.push(`- ${f}`);
    }
  } else {
    lines.push('', 'No research files were modified — consider saving findings to alex_docs/research/.');
  }
} catch { /* research dir not found */ }

const response = {
  hookSpecificOutput: {
    hookEventName: 'Stop',
    additionalContext: lines.join('\n'),
  },
};
process.stdout.write(JSON.stringify(response));
process.exit(0);
