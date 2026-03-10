#!/usr/bin/env node
// H16: SubagentStart context injection
// Global SubagentStart hook — injects parent session context so subagents
// don't start cold. Reads Active Context from copilot-instructions.md.
'use strict';

const fs = require('fs');
const path = require('path');

function extractActiveContext() {
  const ciPath = path.resolve(__dirname, '..', '..', 'copilot-instructions.md');
  try {
    const content = fs.readFileSync(ciPath, 'utf-8');
    // Extract Active Context section
    const match = content.match(/## Active Context\s*\n<!-- [^>]* -->\s*\n([\s\S]*?)(?=\n## )/);
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch {
    // File not found or unreadable — degrade gracefully
  }
  return null;
}

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const context = extractActiveContext();
    if (context) {
      const response = {
        hookSpecificOutput: {
          hookEventName: 'SubagentStart',
          additionalContext:
            'Parent session context (from Active Context):\n' + context,
        },
      };
      process.stdout.write(JSON.stringify(response));
    }
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
