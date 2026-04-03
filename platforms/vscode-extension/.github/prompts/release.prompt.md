---
description: Execute release management workflow for version bumping, changelog, and publishing
agent: Alex
---

# /release - Release Management

Execute the full release workflow with quality gates at every step.

## Phase 0: Pre-Release Assessment

1. Run Brain QA (`/brainqa`) and block if broken connections or count drift detected
2. Run `node scripts/audit-synapses.cjs` and verify zero errors
3. Create a TODO list tracking each phase below

## Phase 1: Version Bump

1. Determine version bump type (patch/minor/major) based on changes since last release
2. Update ALL 6 version locations:
   - `platforms/vscode-extension/package.json` (version field)
   - `platforms/vscode-extension/package-lock.json` (2 occurrences)
   - `CHANGELOG.md` (new entry header)
   - `.github/copilot-instructions.md` (line 6: `# Alex vX.Y.Z`)
   - `platforms/vscode-extension/.github/copilot-instructions.md` (heir copy, line 2)
   - `ROADMAP.md` (Current Master Version + move to Shipped)
3. Run `node scripts/release-preflight.ps1` and verify all checks pass

## Phase 2: Compile and Test

1. Run `npx tsc --noEmit` in `platforms/vscode-extension/` and verify zero errors
2. Run `npm test` and verify all tests pass with zero failures
3. If either fails: fix, recompile, retest. Do NOT proceed until clean.

## Phase 3: Package

1. Run the build pipeline: `.\platforms\vscode-extension\build-extension-package.ps1`
2. Verify the .vsix file was created and note its size
3. CRITICAL: Package AFTER all code changes are complete (never before)

## Phase 4: Publish

1. Verify VSCE_PAT is valid: load from root `.env`
2. Publish: `npx vsce publish --no-dependencies --packagePath <file>.vsix`
3. If PAT expired (401): regenerate at dev.azure.com > User Settings > Personal Access Tokens

## Phase 5: Post-Release

1. Verify on marketplace: extension version matches
2. Mark TODO items complete
3. Summarize: version, changes, test results, marketplace URL
