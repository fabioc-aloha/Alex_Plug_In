#!/usr/bin/env node
// H21: Prompt safety gate
// Global UserPromptSubmit hook — scans user prompts for accidental secrets,
// I1 violation patterns, and dangerous operations before the agent processes them.
'use strict';

const fs = require('fs');
const path = require('path');

// Patterns that suggest accidental secret pasting
const SECRET_PATTERNS = [
  // API keys / tokens (generic high-entropy patterns)
  { pattern: /(?:api[_-]?key|token|secret|password)\s*[:=]\s*["']?[A-Za-z0-9+/=_-]{20,}/i, label: 'API key or token' },
  // Azure/AWS/GCP specific
  { pattern: /(?:AKIA|AROA)[A-Z0-9]{16}/i, label: 'AWS access key' },
  { pattern: /(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,}/i, label: 'GitHub token' },
  { pattern: /sk-[A-Za-z0-9]{32,}/i, label: 'OpenAI API key' },
  { pattern: /r8_[A-Za-z0-9]{32,}/i, label: 'Replicate API token' },
  { pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/i, label: 'Private key' },
  // Connection strings
  { pattern: /(?:mongodb|postgres|mysql|redis):\/\/[^\s]+:[^\s]+@/i, label: 'Database connection string with credentials' },
];

// I1 violation patterns
const MASTER_WORKSPACE = path.resolve(__dirname, '..', '..', '..');
const I1_PATTERNS = [
  { pattern: /test.*(?:extension|vsix).*(?:here|this|master)/i, label: 'I1: Testing extension in Master Alex workspace' },
  { pattern: /run.*initialize.*(?:here|this)/i, label: 'I3: Running Initialize on Master Alex' },
  { pattern: /run.*reset.*(?:here|this)/i, label: 'I4: Running Reset on Master Alex' },
];

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const event = JSON.parse(input);
    // UserPromptSubmit provides the user's prompt text
    const prompt = event.userPrompt || event.prompt || event.message || '';

    if (!prompt) {
      process.exit(0);
      return;
    }

    const warnings = [];

    // Check for secrets
    for (const { pattern, label } of SECRET_PATTERNS) {
      if (pattern.test(prompt)) {
        warnings.push(`SECRET DETECTED: Possible ${label} in your prompt. Remove it before sending.`);
      }
    }

    // Check for I1/I3/I4 violations
    for (const { pattern, label } of I1_PATTERNS) {
      if (pattern.test(prompt)) {
        warnings.push(`SAFETY: ${label}. This workspace is the source of truth.`);
      }
    }

    if (warnings.length > 0) {
      const response = {
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext:
            'H21 PROMPT SAFETY GATE:\n' + warnings.join('\n'),
        },
      };
      process.stdout.write(JSON.stringify(response));
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
