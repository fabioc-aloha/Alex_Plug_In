#!/usr/bin/env node
// H4: Builder auto-compile reminder
// Agent-scoped PostToolUse hook for Builder mode.
// After a .ts file edit, reminds to compile for immediate error feedback.
'use strict';

const WRITE_TOOLS = new Set([
  'replace_string_in_file',
  'multi_replace_string_in_file',
  'create_file',
]);

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const event = JSON.parse(input);
    const toolName = event.tool_name || '';
    const filePath = event.tool_input?.filePath || '';

    const isWriteTool = WRITE_TOOLS.has(toolName);
    const isTsFile = /\.tsx?$/.test(filePath);

    if (isWriteTool && isTsFile) {
      const response = {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext:
            'H4 BUILD CHECK: TypeScript file modified — run `npm run compile` now to catch errors early.\n' +
            'File: ' + filePath,
        },
      };
      process.stdout.write(JSON.stringify(response));
    }
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
