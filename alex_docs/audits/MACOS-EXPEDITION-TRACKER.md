# macOS Expedition Tracker

> **Release**: v7.0.0 -- Working Together Edition
> **Created**: 2026-03-30 | **Source**: mac heir gap analysis (`C:\Development\mac\docs\alex-macos-gap-analysis.md`)
> **Scope**: Full cognitive architecture -- instructions, skills, prompts, muscles, extension source
> **Prior Work**: CROSS-PLATFORM-GAP-ANALYSIS.md (2026-03-27) covered VSIX-shipped extension code only

Alex v7.0.0 makes the cognitive architecture a true cross-platform partner. Born from the mac heir (`C:\Development\mac`) -- a MacBook Neo power-user guide that deployed Alex on macOS and discovered where the Windows DNA shows through. This major version delivers cross-platform parity across the entire architecture layer, leverages macOS-native capabilities, and promotes the mac heir's setup guides as the first universal "Getting Started" documentation.

**Why major**: v6.x assumed Windows. v7.0 works on any OS -- and uses each platform's native strengths.

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete
- `[—]` Deferred / Won't do

## Phase 1: Fix What's Broken (P1)

These affect what macOS users see when Alex's instructions and skills are loaded. Highest priority.

### 1.1 Code Block Language Tags

35+ files use `` ```powershell `` for universal commands (git, npm, node, az). macOS users see misleading syntax highlighting. Change to `` ```bash `` or `` ```sh `` for cross-platform commands. Reserve `` ```powershell `` for genuinely Windows-specific operations.

**Status: COMPLETE** -- Actual scope was 52 files with 167 blocks (not 35+). Deep inventory classified every block. ~55 blocks across 27 files converted from `` ```powershell `` to `` ```bash ``. 112 remaining blocks in 33 active files are genuinely PS-specific (correctly tagged). 12 blocks in 7 episodic memories left as historical record.

| #   | File                                                       | PS Blocks | Status | Notes                                                                                                                                                                                                       |
| --- | ---------------------------------------------------------- | --------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | skills/git-workflow/SKILL.md                               | 12        | [x]    | 8 universal blocks → bash, Get-Date → date, 4 PS kept                                                                                                                                                       |
| 2   | instructions/dependency-management.instructions.md         | 9         | [x]    | All 9 universal (npm) → bash                                                                                                                                                                                |
| 3   | instructions/azure-enterprise-deployment.instructions.md   | 5         | [x]    | All 5 universal (az CLI) → bash                                                                                                                                                                             |
| 4   | skills/architecture-audit/SKILL.md                         | 5         | [x]    | All PS-specific (Get-ChildItem, audit-master-alex.ps1) -- correct                                                                                                                                           |
| 5   | skills/brain-qa/SKILL.md                                   | 2         | [x]    | Universal → bash                                                                                                                                                                                            |
| 6   | skills/documentation-quality-assurance/SKILL.md            | 2         | [x]    | PS-specific (Test-DocQuality, Get-ChildItem) -- correct                                                                                                                                                     |
| 7   | skills/ascii-art-alignment/SKILL.md                        | 4         | [x]    | PS-specific (Get-Content, Select-String) -- correct                                                                                                                                                         |
| 8   | skills/api-design/SKILL.md                                 | 2         | [x]    | PS-specific (Invoke-WebRequest) -- correct                                                                                                                                                                  |
| 9   | prompts/vscode-extension-audit.prompt.md                   | 4         | [x]    | PS-specific (Select-String) -- correct                                                                                                                                                                      |
| 10  | prompts/visual-memory.prompt.md                            | 1         | [x]    | PS-specific (New-Item) -- correct                                                                                                                                                                           |
| 11  | prompts/brainqa.prompt.md                                  | 1         | [x]    | Universal → bash                                                                                                                                                                                            |
| 12  | prompts/word.prompt.md                                     | 2         | [x]    | Universal → bash                                                                                                                                                                                            |
| 13  | prompts/validate-config.prompt.md                          | 1         | [x]    | Universal → bash                                                                                                                                                                                            |
| 14  | instructions/brand-asset-management.instructions.md        | 1         | [x]    | Universal (npx sharp-cli) → bash                                                                                                                                                                            |
| 15  | instructions/technical-debt-tracking.instructions.md       | 1         | [x]    | Universal (grep -rn) → bash                                                                                                                                                                                 |
| 16  | skills/teams-app-patterns/SKILL.md                         | 3         | [x]    | Universal (npm/npx) → bash                                                                                                                                                                                  |
| 17  | instructions/release-management.instructions.md            | 15        | [x]    | 4 universal (npm/vsce/code) → bash, 11 PS-specific kept                                                                                                                                                     |
| 18  | instructions/vscode-marketplace-publishing.instructions.md | 7         | [x]    | All 7 universal (npm/vsce/git) → bash                                                                                                                                                                       |
| 19  | skills/security-review/SKILL.md                            | 1         | [x]    | Universal (npm audit) → bash                                                                                                                                                                                |
| 20  | skills/brand-asset-management/SKILL.md                     | 1         | [x]    | Universal (npx sharp-cli) → bash                                                                                                                                                                            |
| 21  | skills/fabric-notebook-publish/SKILL.md                    | 3         | [x]    | Universal → bash                                                                                                                                                                                            |
| 22  | skills/debugging-patterns/SKILL.md                         | 2         | [x]    | 1 universal (git bisect) → bash, 1 PS-specific ($env:) kept                                                                                                                                                 |
| 23  | skills/release-process/SKILL.md                            | 5         | [x]    | 1 universal (npx vsce publish) → bash, 4 PS-specific kept                                                                                                                                                   |
| 24  | skills/md-to-word/SKILL.md                                 | 4         | [x]    | 2 universal (node) → bash, 2 PS-specific kept                                                                                                                                                               |
| 25  | skills/vscode-extension-patterns/SKILL.md                  | 2         | [x]    | 1 universal (npm/npx/code) → bash, 1 PS-specific kept                                                                                                                                                       |
| 26  | skills/azure-devops-automation/SKILL.md                    | 2         | [x]    | Universal (az/gh CLI) → bash                                                                                                                                                                                |
| 27  | Various (15 more files)                                    | ~22       | [x]    | hooks/README, muscles/README, ISSUE_TEMPLATE, pull_request_template, prompts (ai-char, masteraudit), skills (skill-building, text-to-speech), instructions (ai-char, visual-memory) -- all universal → bash |

**Decision rule**: If the command is `git`, `npm`, `node`, `az`, `curl`, `jq`, `tree` -- use `bash`. If it's `Get-ChildItem`, `$env:`, `Invoke-WebRequest`, a `.ps1` script -- keep `powershell` but add a bash/macOS alternative alongside.

### 1.2 Installation Commands -- Add brew Alongside winget

Every `winget install` in the architecture needs a `brew install` pair.

| #   | File                                | Current Command                          | macOS Equivalent           | Status |
| --- | ----------------------------------- | ---------------------------------------- | -------------------------- | ------ |
| 1   | skills/md-to-word/SKILL.md          | `winget install pandoc`                  | `brew install pandoc`      | [x]    |
| 2   | skills/visual-memory/SKILL.md       | `winget install ImageMagick.ImageMagick` | `brew install imagemagick` | [x]    |
| 3   | skills/flux-brand-finetune/SKILL.md | `winget install ImageMagick.ImageMagick` | `brew install imagemagick` | [x]    |
| 4   | prompts/word.prompt.md              | `winget install pandoc`                  | `brew install pandoc`      | [x]    |
| 5   | muscles/md-to-word.cjs              | `winget install pandoc` (error msg)      | Already fixed (VSIX audit) | [x]    |
| 6   | skills/md-to-word/synapses.json     | `"install": "winget install pandoc"`     | Add brew alternative       | [x]    |
| 7   | muscles/docx-to-md.cjs              | `winget install pandoc` (error msg)      | Already fixed (VSIX audit) | [x]    |
| 8   | muscles/md-to-html.cjs              | `winget install pandoc` (error msg)      | Already fixed (VSIX audit) | [x]    |

**Pattern**: Use dual-format blocks:

```
# macOS
brew install pandoc

# Windows
winget install pandoc
```

### 1.3 Muscle Language Matrix

Update `muscles/README.md` to include bash/zsh guidance.

| #   | Action                                                                   | Status |
| --- | ------------------------------------------------------------------------ | ------ |
| 1   | Add bash/zsh to the language decision matrix                             | [x]    |
| 2   | Change "Validation/Audit -> PowerShell" to "-> Node.js (.cjs) preferred" | [x]    |

**Target matrix**:

```
Cross-platform automation  -> Node.js (.cjs)
Validation / audit         -> Node.js (.cjs) or shell script
Quick macOS script         -> Bash / Zsh (.sh)
Quick Windows script       -> PowerShell (.ps1)
```

### 1.4 Environment Variable Syntax in Runtime Errors

Muscle error messages show `$env:VAR` (PowerShell syntax) to macOS users who need `export VAR=`.

| #   | File                              | Error Message                  | Status |
| --- | --------------------------------- | ------------------------------ | ------ |
| 1   | muscles/gamma-generator.cjs       | `Set $env:GAMMA_API_KEY`       | [x]    |
| 2   | muscles/shared/replicate-core.cjs | `Set $env:REPLICATE_API_TOKEN` | [x]    |

**Fix**: Use `process.platform` to show platform-appropriate syntax.

## Phase 2: Fill the Gaps (P2)

### 2.1 PowerShell Muscles With No Cross-Platform Equivalent

10 `.ps1` muscles have no `.sh` or `.cjs` alternative. The mac heir recommends porting critical ones to Node.js.

| #   | Muscle                      | Purpose                     | Recommendation                      | Status |
| --- | --------------------------- | --------------------------- | ----------------------------------- | ------ |
| 1   | brain-qa.ps1                | 32-phase deep validation    | Port to .cjs (highest value)        | [ ]    |
| 2   | validate-skills.ps1         | Skill file validation       | Port to .cjs                        | [ ]    |
| 3   | audit-master-alex.ps1       | 22-point pre-release audit  | Port to .cjs                        | [ ]    |
| 4   | validate-synapses.ps1       | Synapse target validation   | Port to .cjs                        | [ ]    |
| 5   | build-extension-package.ps1 | VSIX packaging              | Keep PS -- Windows CI/release only  | [—]    |
| 6   | fix-fence-bug.ps1           | VS Code fence bug fix       | Keep PS -- rare utility             | [—]    |
| 7   | install-hooks.ps1           | Install hooks config        | Port to .cjs (small scope)          | [ ]    |
| 8   | new-skill.ps1               | Scaffold new skill trifecta | Port to .cjs (high value for heirs) | [ ]    |
| 9   | normalize-paths.ps1         | Path consistency fixes      | Keep PS -- Master dev tool          | [—]    |
| 10  | brain-qa-heir.ps1           | 25-phase heir validation    | Port to .cjs (follows brain-qa)     | [ ]    |

**Priority order**: brain-qa > new-skill > validate-skills > validate-synapses > audit-master-alex > install-hooks > brain-qa-heir

### 2.2 Dream State / Scheduling

| #   | Action                                                                  | Status |
| --- | ----------------------------------------------------------------------- | ------ |
| 1   | Add launchd plist template to dream-state-automation.instructions.md    | [ ]    |
| 2   | Add macOS scheduling section to lucid-dream-integration.instructions.md | [ ]    |
| 3   | Add cron as a simpler alternative for both instructions                 | [ ]    |

### 2.3 macOS Setup Documentation

| #   | Action                                                                           | Status |
| --- | -------------------------------------------------------------------------------- | ------ |
| 1   | Create a "Getting Started on macOS" section in WORKING-WITH-ALEX.md or a new doc | [ ]    |
| 2   | Reference mac heir's cli-tools.md and vscode-setup.md as source material         | [ ]    |

## Phase 3: Leverage macOS-Native Capabilities (P3)

These go beyond parity -- they make Alex **better** on macOS for specific tasks.

### 3.1 `sips` -- Zero-Install Image Processing

macOS ships `sips` (Scriptable Image Processing System) for resize, convert, and metadata.

| #   | Action                                                                            | Effort | Status |
| --- | --------------------------------------------------------------------------------- | ------ | ------ |
| 1   | Add `sips` as macOS fallback in image-handling skill                              | Small  | [ ]    |
| 2   | Add `sips` to svg-pipeline.cjs fallback chain (after librsvg, before ImageMagick) | Medium | [ ]    |
| 3   | Document limitations (no SVG rendering, no compositing)                           | Small  | [ ]    |

### 3.2 `say` -- Offline Text-to-Speech

macOS has 30+ built-in voices with the `say` command -- instant, offline, zero-cost.

| #   | Action                                                               | Effort | Status |
| --- | -------------------------------------------------------------------- | ------ | ------ |
| 1   | Add `say` as macOS-native offline fallback in text-to-speech skill   | Small  | [ ]    |
| 2   | Add `say` notification after long operations (brain-qa, dream-state) | Small  | [ ]    |
| 3   | Note the "Alex" voice name coincidence in documentation              | Tiny   | [ ]    |

### 3.3 `caffeinate` -- Prevent Sleep During Long Operations

Dream state, brain-qa, and VSIX packaging can take minutes. Mac sleep corrupts results.

| #   | Action                                                                               | Effort | Status |
| --- | ------------------------------------------------------------------------------------ | ------ | ------ |
| 1   | Add `caffeinate -s` wrapping advice to dream-state-automation instruction            | Small  | [ ]    |
| 2   | Consider auto-wrapping in Node.js muscle runner when `process.platform === 'darwin'` | Medium | [ ]    |

### 3.4 `osascript` -- Native Notification Center Alerts

VS Code toasts are easy to miss. macOS Notification Center with sound is better for long ops.

| #   | Action                                                               | Effort | Status |
| --- | -------------------------------------------------------------------- | ------ | ------ |
| 1   | Document `osascript` notification pattern in dream-state instruction | Small  | [ ]    |
| 2   | Consider adding to hook completion events                            | Medium | [ ]    |

### 3.5 `textutil` -- Built-In Document Conversion

macOS ships `textutil` for HTML/RTF/DOCX conversion. Partial Pandoc replacement.

| #   | Action                                                                 | Effort | Status |
| --- | ---------------------------------------------------------------------- | ------ | ------ |
| 1   | Add `textutil` as macOS fallback in md-to-word skill (HTML->DOCX path) | Medium | [ ]    |
| 2   | Document limitations (needs HTML input, reduced formatting fidelity)   | Small  | [ ]    |

### 3.6 `launchd` -- Native Task Scheduling

macOS equivalent of Task Scheduler but more powerful (file watchers, keep-alive, boot triggers).

| #   | Action                                                          | Effort | Status |
| --- | --------------------------------------------------------------- | ------ | ------ |
| 1   | Create launchd plist template for dream-state nightly runs      | Small  | [ ]    |
| 2   | Document file-watch trigger for `.github/` validation on change | Small  | [ ]    |

### 3.7 Clipboard, Spotlight, APFS (Lower Priority)

| #   | Tool                  | Opportunity                           | Effort | Status |
| --- | --------------------- | ------------------------------------- | ------ | ------ |
| 1   | `pbcopy`/`pbpaste`    | Pipe muscle output to clipboard       | Small  | [ ]    |
| 2   | `mdfind`              | Spotlight-powered architecture search | Medium | [ ]    |
| 3   | APFS clones (`cp -c`) | Zero-cost pre-refactoring backups     | Small  | [ ]    |

## Phase 4: Extension Source Validation

These require changes in the VS Code extension TypeScript source. Some were already fixed by the VSIX audit.

| #   | Action                                                | Status | Notes                         |
| --- | ----------------------------------------------------- | ------ | ----------------------------- |
| 1   | setupGlobalKnowledge.ts -- hardcoded Windows paths    | [x]    | Fixed 2026-03-27 (VSIX audit) |
| 2   | setupGlobalKnowledge.ts -- symlink error message      | [x]    | Fixed 2026-03-27 (VSIX audit) |
| 3   | Pandoc install hints in 3 shipped muscles             | [x]    | Fixed 2026-03-27 (VSIX audit) |
| 4   | Audio playback via `afplay` on macOS                  | [x]    | Already cross-platform        |
| 5   | gamma-generator.cjs file open via `open`              | [x]    | Already cross-platform        |
| 6   | Full extension lifecycle test on macOS hardware       | [ ]    | Requires macOS machine        |
| 7   | Platform-aware terminal detection (zsh vs PowerShell) | [ ]    | New finding from mac heir     |

## Cross-References

| Document                          | Location                                                    | Relationship                                                                                 |
| --------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| VSIX gap analysis (prior)         | alex_docs/audits/CROSS-PLATFORM-GAP-ANALYSIS.md             | Extension-only scope, Phase 1-2 complete                                                     |
| Mac heir gap analysis v1.1        | C:\Development\mac\docs\alex-macos-gap-analysis.md          | Full architecture scope, source for this tracker. Updated with heir progress + commit hashes |
| Mac heir Alex KB                  | C:\Development\mac\alex/ (7 guides)                         | Cross-platform setup docs (verified, 5 fixes applied, pushed)                                |
| Mac heir cross-platform workflows | C:\Development\mac\docs/cross-platform-workflows.md         | Dual-OS daily driver guide, GK promotion candidate                                           |
| Mac heir new files                | C:\Development\mac\apps\install.ps1, scripts\inject-nav.cjs | Windows installer + cross-platform nav injector (excellent quality)                          |

## Phase 5: Make the Mac Heir Cross-Platform

The mac heir's `alex/` KB is a great "How to set up Alex" guide suite -- but it only shows macOS commands. It preaches cross-platform but doesn't practice it. If these guides add Windows equivalents, they become promotable to Master as the definitive Alex setup documentation (something Master doesn't have yet).

### 5.1 Mac Heir Guides -- Add Windows Equivalents

Each guide needs a dual-platform treatment: keep the macOS content, add Windows alongside.

**Status**: Mac heir completed cross-platform work. Master ran 6-point verification -- **93% pass rate** (5/7 files clean). 5 minor fixes applied and committed (`84548c1`):
1. Added `ImageMagick.ImageMagick` + `GnuWin32.Wget` to Windows Quick Install (README.md)
2. Added SVG pipeline tool to Windows muscle dependencies (installing-alex.md)
3. Split `rm -rf` / `Remove-Item` into separate platform blocks (installing-alex.md Method 1)
4. Standardized jq ID to `jqlang.jq` (cli-tools.md + install.ps1)

**Verification protocol**: All 6 criteria verified per file:

1. Every `brew install` has a `winget install` equivalent nearby (same section or table)
2. Every `export VAR=` has a `$env:VAR` or `.env` alternative
3. Every `Cmd +` shortcut shows `Ctrl +` for Windows/Linux
4. Every bash verification script has a PowerShell version
5. Shell-specific commands (`rm -rf`, `cp -r`, `pbcopy`) show cross-platform alternatives
6. No platform is presented as default -- both shown equally

| #   | Guide                   | macOS-Only Content                            | Windows Equivalent Needed                        | Status |
| --- | ----------------------- | --------------------------------------------- | ------------------------------------------------ | ------ |
| 1   | alex/cli-tools.md       | `brew install node git pandoc...`             | `winget install` equivalents                     | [x]    |
| 2   | alex/cli-tools.md       | `xcode-select --install`                      | Note: Windows uses VS Build Tools                | [x]    |
| 3   | alex/cli-tools.md       | `eval "$(/opt/homebrew/bin/brew shellenv)"`   | N/A on Windows (winget is built-in)              | [—]    |
| 4   | alex/cli-tools.md       | Verification script uses bash `command -v`    | Add PowerShell `Get-Command` version             | [x]    |
| 5   | alex/api-keys.md        | `export VAR="value"` in `.zprofile`           | `$env:VAR` in PowerShell profile / `.env` file   | [x]    |
| 6   | alex/api-keys.md        | `ssh-keygen` + `pbcopy`                       | `ssh-keygen` + `clip` (or `Get-Clipboard`)       | [x]    |
| 7   | alex/api-keys.md        | Verification script uses bash `[ -n "$VAR" ]` | Add PowerShell `$env:VAR` check                  | [x]    |
| 8   | alex/npm-packages.md    | `~/.npm-global` permission fix                | Not needed on Windows (npm global works)         | [—]    |
| 9   | alex/npm-packages.md    | `NODE_PATH` uses `$HOME/.vscode/extensions/`  | `$env:APPDATA` / `%USERPROFILE%` path            | [x]    |
| 10  | alex/installing-alex.md | `rm -rf .git`                                 | `Remove-Item -Recurse -Force .git`               | [x]    |
| 11  | alex/installing-alex.md | `cp -r` for copying `.github/`                | `Copy-Item -Recurse`                             | [x]    |
| 12  | alex/installing-alex.md | `Cmd + Shift + I` for Copilot Chat            | Add `Ctrl + Shift + I` (Windows/Linux)           | [x]    |
| 13  | alex/vscode-setup.md    | `brew install --cask visual-studio-code`      | `winget install Microsoft.VisualStudioCode`      | [x]    |
| 14  | alex/vscode-setup.md    | `Cmd + Shift + P` Shell Command               | Note: Windows adds `code` to PATH during install | [x]    |
| 15  | alex/vscode-setup.md    | `code --install-extension`                    | Same on both platforms (already cross-platform)  | [x]    |
| 16  | alex/README.md          | Quick Install is all `brew`                   | Add winget/choco one-liner                       | [x]    |

### 5.2 Mac Heir `.github/` Architecture -- Sync Fixes from Master

The mac heir's `.github/` is a copy of Master's architecture. Once Phase 1-2 fixes land in Master, they need to flow to the mac heir.

| #   | Action                                                         | Status |
| --- | -------------------------------------------------------------- | ------ |
| 1   | After Phase 1 completes in Master, sync `.github/` to mac heir | [ ]    |
| 2   | Verify mac heir's `.github/` matches Master post-sync          | [ ]    |
| 3   | Run brain-qa on mac heir to validate architecture health       | [ ]    |

### 5.3 Promotion Pipeline -- Mac Heir Docs to Master

Once the guides are cross-platform, they're candidates for Master's documentation:

| #   | Source (mac heir)                | Destination (Master)                      | Value                                                  | Status |
| --- | -------------------------------- | ----------------------------------------- | ------------------------------------------------------ | ------ |
| 1   | alex/alex-ai.md                  | alex_docs/WHAT-IS-ALEX.md (new)           | "What is Alex?" primer -- Master has nothing like this | [ ]    |
| 2   | alex/installing-alex.md          | alex_docs/guides/GETTING-STARTED.md (new) | First-time setup guide                                 | [ ]    |
| 3   | alex/cli-tools.md                | alex_docs/guides/CLI-TOOLS.md (new)       | Cross-platform dependency reference                    | [ ]    |
| 4   | alex/vscode-setup.md             | alex_docs/guides/VSCODE-SETUP.md (new)    | VS Code config for Alex projects                       | [ ]    |
| 5   | alex/api-keys.md                 | alex_docs/guides/API-KEYS.md (new)        | Service configuration                                  | [ ]    |
| 6   | alex/npm-packages.md             | alex_docs/guides/NPM-PACKAGES.md (new)    | Muscle dependency reference                            | [ ]    |
| 7   | docs/cross-platform-workflows.md | Global Knowledge (GK promotion)           | Dual-OS daily driver patterns                          | [ ]    |
| 8   | docs/alex-macos-gap-analysis.md  | Already tracked (this document)           | Architecture audit findings absorbed here              | [x]    |

## Metrics

| Category                     | Total Items | Complete | In Progress | Deferred |
| ---------------------------- | ----------- | -------- | ----------- | -------- |
| Phase 1 (P1 -- Broken)       | 28          | 28       | 0           | 0        |
| Phase 2 (P2 -- Gaps)         | 15          | 0        | 0           | 3        |
| Phase 3 (P3 -- macOS-Native) | 16          | 0        | 0           | 0        |
| Phase 4 (Extension)          | 7           | 5        | 0           | 0        |
| Phase 5 (Mac Heir XP)        | 27          | 16       | 0           | 2        |
| **Total**                    | **93**      | **49**   | **0**       | **5**    |
