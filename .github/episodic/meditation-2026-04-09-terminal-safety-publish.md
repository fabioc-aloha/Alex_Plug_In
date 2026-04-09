# Meditation: Terminal Safety + v7.4.2 Publish

**Date**: 2026-04-09
**Duration**: Medium session
**Model**: Claude Opus 4.6
**Focus**: Terminal command safety mitigation (vscode#295620), marketplace publish, cowork heir update

## Session Summary

Researched terminal issues in VS Code Copilot chat. Identified vscode#295620 as the root cause: Claude models generate backtick-containing terminal commands that shells interpret as command substitution (bash/zsh) or escape characters (PowerShell). Created a universal instruction file to mitigate at the model level. Then completed the v7.4.2 marketplace publish and updated the cowork heir.

## Key Actions

| Action                      | Files Changed | Details                                                                |
| --------------------------- | ------------- | ---------------------------------------------------------------------- |
| Terminal issue research     | 0             | Fetched VS Code release notes (v1.98, v1.99, v1.100), GitHub issues    |
| Root cause identification   | 0             | vscode#295620: backtick interpretation across all shells               |
| Terminal safety instruction | 1             | Created `.github/instructions/terminal-command-safety.instructions.md` |
| README badge reorder        | 1             | Consolidated 2 lines to 1, sorted: Platforms > Community > Meta        |
| Git push                    | 17 files      | Includes meditation artifacts and synapse updates from prior session   |
| Release preflight           | 0             | All gates green: versions, build, lint, tests, git clean, tag          |
| PAT refresh + publish       | 0             | 401 on first attempt, refreshed PAT in .env, published successfully    |
| Cowork heir update          | 1             | `build-skill-pack.ps1`: 20 skills deployed to OneDrive                 |

## Insights

### Model-Level Mitigation Pattern
When AI generates problematic output (backtick commands), the fastest fix is an instruction file teaching the AI to avoid the pattern. Waiting for platform fixes (open issue, "On Deck" milestone) leaves the problem active. The instruction file with `applyTo: "**"` applies universally across all file contexts.

### Shell Metacharacter Hazards
- **bash/zsh**: backtick = command substitution
- **PowerShell**: backtick = escape character (e.g., `` `n `` = newline)
- Safe patterns: `--body-file` for gh, `-F` for git commit, heredocs with `'EOF'` delimiter

### PAT Expiry Recurrence
VSCE_PAT expired again during publish. This recurs periodically. Workflow: regenerate at dev.azure.com > User Settings > PAT (scope: Marketplace > Manage), update `.env`, reload in shell.

## Patterns Reinforced

- **Instruction files as behavioral guardrails**: `applyTo: "**"` ensures universal attachment without manual activation
- **Preflight before publish**: Caught clean state, confirmed all 6 version files synced
- **VSIX packaging after all changes**: Removed old VSIX before `vsce package` to avoid stale file pickup (repo memory confirmed)
- **Cowork heir as secondary platform**: `build-skill-pack.ps1` handles zip + OneDrive deployment in one script

## Synapse Connections

- `terminal-command-safety.instructions.md` <-> `debugging-patterns`: Terminal commands failing is a debugging scenario
- `terminal-command-safety.instructions.md` <-> `git-workflow`: Git commit/push with backtick messages
- `terminal-command-safety.instructions.md` <-> `vscode-extension-patterns`: Extension development uses terminal heavily
- `release-process` <-> `secrets-management`: PAT refresh is part of publish workflow

## Quality Metrics

- **Preflight**: Passed all gates
- **Publish**: v7.4.2 live on Marketplace
- **Cowork**: 20 skills deployed
- **Commits**: 1 (feat: terminal-command-safety + README badges + meditation artifacts)

## Active Context Update

- Recent: v7.4.2 published to Marketplace. Terminal command safety instruction created. Cowork heir updated.
- Last Assessed: 2026-04-09
