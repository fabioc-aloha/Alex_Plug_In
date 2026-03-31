---
description: "Audit /memories/ user memory for scope violations, waste, and budget usage"
agent: Alex
---

# /memory-audit - User Memory Curation

Run a full audit of `/memories/` and fix any issues found.

## Process

1. **Inventory**: Read `/memories/` directory, then read each file. Count total lines
2. **Classify**: For each non-blank, non-header line, classify as Universal / Project-specific / Stale / Duplicate / Secret
3. **3-Workspace Test**: Verify every content line is useful in 3+ workspaces
4. **Structure check**: Verify categorized sections (Writing Style, Tool Preferences, Workflow, etc.)
5. **Budget check**: Total lines vs 200-line budget. Alert if > 150 (75%)
6. **Fix**: Remove project-specific content (migrate to repo memory first), delete stale/duplicate lines, restructure if needed
7. **Report**: Output audit summary with line counts, waste ratio, and actions taken

## Scope Rules

- Universal preferences (style, tools, workflow) belong in `/memories/`
- Project-specific settings belong in `/memories/repo/` or `.github/episodic/`
- Session scratch belongs in `/memories/session/`
- Auth tokens, API keys, user IDs belong in `.env` or SecretStorage
- Architecture patterns belong in `.github/instructions/`

## Safety

- Back up current content to `/memories/session/` before restructuring
- Never delete content that isn't preserved elsewhere
- Migrate project-specific content to the correct repo before removing

## Start
