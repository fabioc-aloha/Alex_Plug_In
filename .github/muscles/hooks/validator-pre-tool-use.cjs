#!/usr/bin/env node
// H2: Validator read-only enforcement
// Agent-scoped PreToolUse hook for Validator mode.
// Blocks write operations — Validator reviews, it does not modify.
'use strict';

const WRITE_TOOLS = new Set([
  'replace_string_in_file',
  'multi_replace_string_in_file',
  'create_file',
  'edit_notebook_file',
  'create_new_jupyter_notebook',
  'create_directory',
]);

// Terminal commands are allowed for read-only inspection (e.g., npm test, npm run compile)
// but the Validator agent's tools: list already excludes terminalCommand.
// This hook is a second layer of defense.

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const event = JSON.parse(input);
    const toolName = event.tool_name || '';

    if (WRITE_TOOLS.has(toolName)) {
      const response = {
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          additionalContext:
            'H2 VALIDATOR READ-ONLY: Validator mode is read-only. ' +
            'Code modifications are blocked during QA review.\n' +
            'Hand off to @Builder if changes are needed.',
        },
      };
      process.stdout.write(JSON.stringify(response));
      process.exit(2);
    }

    // Allow — no context needed
    const response = {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
      },
    };
    process.stdout.write(JSON.stringify(response));
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
