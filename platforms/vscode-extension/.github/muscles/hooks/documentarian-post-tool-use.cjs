#!/usr/bin/env node
// H6: Documentarian post-tool — file change tracker
// Agent-scoped PostToolUse hook for Documentarian mode.
// Tracks file modifications and suggests CHANGELOG entries when docs change.
'use strict';

const path = require('path');

const WRITE_TOOLS = new Set([
  'replace_string_in_file',
  'multi_replace_string_in_file',
  'create_file',
  'editFile',
  'str_replace_editor',
  'Edit',
  'Write',
]);

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const event = JSON.parse(input);
    const toolName = event.tool_name || '';
    const filePath = event.tool_input?.filePath || event.tool_input?.file_path || '';

    if (!WRITE_TOOLS.has(toolName) || !filePath) {
      process.exit(0);
      return;
    }

    const normalized = filePath.replace(/\\/g, '/');
    const ext = path.extname(normalized).toLowerCase();

    // Detect documentation-relevant changes
    const hints = [];

    if (normalized.includes('CHANGELOG')) {
      // Already editing changelog — no reminder needed
      process.exit(0);
      return;
    }

    if (ext === '.md') {
      hints.push(`Documentation file modified: ${path.basename(normalized)}`);
    }

    if (normalized.includes('/architecture/') || normalized.includes('/guides/')) {
      hints.push('Architecture or guide doc changed — verify cross-references are current');
    }

    if (normalized.includes('package.json')) {
      hints.push('package.json changed — check if CHANGELOG needs a dependency or version entry');
    }

    if (normalized.includes('copilot-instructions.md')) {
      hints.push('copilot-instructions.md changed — this is the identity source of truth');
    }

    if (normalized.includes('/skills/') && normalized.endsWith('SKILL.md')) {
      hints.push('Skill file changed — verify SKILLS-CATALOG.md and TRIFECTA-CATALOG.md are current');
    }

    if (normalized.includes('/agents/') && normalized.endsWith('.agent.md')) {
      hints.push('Agent definition changed — verify AGENT-CATALOG.md is current');
    }

    if (hints.length > 0) {
      const response = {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext:
            'H6 DOC TRACKER:\n' +
            hints.join('\n') +
            '\n\nRemember to update CHANGELOG.md if this change is user-facing.',
        },
      };
      process.stdout.write(JSON.stringify(response));
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
