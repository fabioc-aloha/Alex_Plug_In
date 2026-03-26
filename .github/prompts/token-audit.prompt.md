---
description: Audit cognitive architecture for token waste and fix issues
agent: Alex
---

# /token-audit - Token Waste Elimination

Run a full token waste audit on the `.github/` directory and fix issues found.

## Process

1. **Measure baseline**: Count lines per file type, identify oversized files
2. **Find instruction-skill overlap**: Instructions with matching skills over 50 lines
3. **Scan waste patterns**: Mermaid init blocks, inline synapses, stale meta-blocks, Microsoft Entra ID
4. **Check applyTo coverage**: Domain-specific instructions missing `applyTo` globs
5. **Calculate always-on cost**: Sum instruction descriptions + skill descriptions + copilot-instructions.md
6. **Fix everything fixable**: Trim instructions, remove patterns, add applyTo
7. **Report savings**: Before/after line counts and estimated token reduction

## Muscle

Run `node .github/muscles/audit-token-waste.cjs` first for automated pattern detection, then manually trim instruction-skill overlaps.

## Safety

- Never delete content that exists only in one place
- When trimming an instruction, verify the skill contains the detailed version
- Add routing pointer ("see X skill for details") after trimming

## Start

Beginning token waste audit. I'll measure the baseline, scan for waste patterns, and fix everything I find.
