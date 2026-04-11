# VS Code Extensions — Development Environment

> Reviewed: 2026-04-11 | Scope: All repos in C:\Development (111 repos scanned)
> Platforms: Windows + macOS
> Style: **Chat-centric** — all code authoring via Copilot Chat / agents. Inline completions disabled.
> Direct editing: Markdown, Mermaid diagrams, config files only.

## Must Have — Both Platforms

Install on **both** Windows and macOS. These are cross-platform and cover the core tech stack.

### Core (Every Workspace)

| Extension                    | ID                                    | Why                                                                                                    |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **GitHub Copilot Chat**      | `github.copilot-chat`                 | Core dependency — Alex extensionPack. Chat participant API, MCP tools                                  |
| **GitHub Copilot**           | _(built-in)_                          | Now built into VS Code — no separate extension needed. Disable inline completions (see settings below) |
| **ESLint**                   | `dbaeumer.vscode-eslint`              | Diagnostics for agents — 45 TS repos. Agents read lint errors to self-correct                          |
| **esbuild Problem Matchers** | `connor4312.esbuild-problem-matchers` | Build error parsing — Alex extension bundles with esbuild                                              |
| **Extension Test Runner**    | `ms-vscode.extension-test-runner`     | VS Code extension integration tests (Mocha + @vscode/test-electron)                                    |
| **PowerShell**               | `ms-vscode.powershell`                | Release/build scripts (.ps1). On macOS: `brew install powershell`                                      |
| **DotENV**                   | `mikestead.dotenv`                    | `.env` syntax highlighting — VSCE_PAT, Replicate tokens, API keys                                      |
| **YAML**                     | `redhat.vscode-yaml`                  | Schema validation + IntelliSense — 31 repos with YAML configs. **INSTALL**                             |
| **vscode-icons**             | `vscode-icons-team.vscode-icons`      | File icon theme (preference)                                                                           |

### Markdown & Documentation

| Extension               | ID                               | Why                                                                                          |
| ----------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| **Markdown All in One** | `yzhang.markdown-all-in-one`     | **Primary editing tool** — heavy markdown editing (cognitive architecture, ADRs, changelogs) |
| **Markdown Mermaid**    | `bierner.markdown-mermaid`       | **Primary editing tool** — Mermaid diagram preview for architecture docs, brain anatomy      |
| **MarkdownLint**        | `davidanson.vscode-markdownlint` | **Primary editing tool** — style enforcement, `markdownlint` is a root devDependency         |
| **LaTeX Workshop**      | `James-Yu.latex-workshop`        | LaTeX authoring + PDF preview — 8 repos (articles, AlexPapers, AlexCook). **INSTALL**        |

### Python & Data Science

| Extension               | ID                                    | Why                                                 |
| ----------------------- | ------------------------------------- | --------------------------------------------------- |
| **Python**              | `ms-python.python`                    | 44 repos — your most used language after TypeScript |
| **Pylance**             | `ms-python.vscode-pylance`            | Python language server                              |
| **Debugpy**             | `ms-python.debugpy`                   | Python debugger                                     |
| **Python Environments** | `ms-python.vscode-python-envs`        | venv/conda management across 44 repos               |
| **Jupyter**             | `ms-toolsai.jupyter`                  | 9 repos with active notebooks                       |
| **Jupyter Keymap**      | `ms-toolsai.jupyter-keymap`           | Standard Jupyter keyboard shortcuts                 |
| **Jupyter Renderers**   | `ms-toolsai.jupyter-renderers`        | Rich output rendering in notebooks                  |
| **Jupyter Cell Tags**   | `ms-toolsai.vscode-jupyter-cell-tags` | Cell metadata management                            |
| **Jupyter Slideshow**   | `ms-toolsai.vscode-jupyter-slideshow` | Notebook presentation mode                          |
| **Rainbow CSV**         | `mechatroner.rainbow-csv`             | CSV color coding — 18 repos with data files         |

### Azure & Cloud

| Extension               | ID                                      | Why                                                                         |
| ----------------------- | --------------------------------------- | --------------------------------------------------------------------------- |
| **Azure MCP Server**    | `ms-azuretools.vscode-azure-mcp-server` | Azure MCP integration — Alex Azure agent mode. Platform VSIX auto-selected. |
| **Azure Developer CLI** | `ms-azuretools.azure-dev`               | `azd` deployment workflows                                                  |
| **Bicep**               | `ms-azuretools.vscode-bicep`            | Azure IaC — 11 repos                                                        |
| **.NET Runtime**        | `ms-dotnettools.vscode-dotnet-runtime`  | Required by Bicep + C# projects                                             |
| **Docker**              | `ms-azuretools.vscode-docker`           | Dockerfile syntax, compose, containers — 8 repos. **INSTALL**               |
| **Remote Containers**   | `ms-vscode-remote.remote-containers`    | Dev container workflows — 8 Docker repos                                    |

### Database

| Extension              | ID               | Why                                                        |
| ---------------------- | ---------------- | ---------------------------------------------------------- |
| **SQL Server (mssql)** | `ms-mssql.mssql` | SQL editing + Azure SQL connections — 7 repos. **INSTALL** |

### Auto-Installed Dependencies

These were pulled in automatically by extensions above. No action needed.

| Extension             | Installed by     | ID                                          |
| --------------------- | ---------------- | ------------------------------------------- |
| Container Tools       | Docker           | `ms-azuretools.vscode-containers`           |
| Azure Resource Groups | Azure MCP Server | `ms-azuretools.vscode-azureresourcegroups`  |
| Azure GitHub Copilot  | Azure MCP Server | `ms-azuretools.vscode-azure-github-copilot` |
| C#                    | C# Dev Kit       | `ms-dotnettools.csharp`                     |
| Data Workspace        | mssql            | `ms-mssql.data-workspace-vscode`            |
| SQL Bindings          | mssql            | `ms-mssql.sql-bindings-vscode`              |
| SQL Database Projects | mssql            | `ms-mssql.sql-database-projects-vscode`     |

## Must Have — Windows Only

Extensions needed exclusively for Windows-specific development.

| Extension      | ID                        | Why                                                                                                                                                                                    |
| -------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C# Dev Kit** | `ms-dotnettools.csdevkit` | 7 C# repos (City-Weather, Fishbowl, mdword, read-aloud, WindowsWidget, AlexQ_Template). Includes Windows-only targets like `.appxmanifest` and `.wapproj` (WindowsWidget). **INSTALL** |

## Must Have — macOS Only

Extensions for Apple platform development. Require macOS toolchain (Xcode, SourceKit, iOS Simulator).

### Swift & Apple Platforms

| Extension                 | ID                                  | Why                                                                                                                                                        |
| ------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Swift**                 | `swiftlang.swift-vscode`            | Official Swift language support — syntax, diagnostics, SourceKit-LSP, Xcode project build/run/test, LLDB debugging. Replaces deprecated `sswg.swift-lang`. |
| **Apple Swift Formatter** | `vknabel.vscode-apple-swift-format` | `swift-format` for consistent Swift code style                                                                                                             |

### Cross-Platform Mobile (iOS targets)

| Extension              | ID                             | Why                                                                                                    |
| ---------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **React Native Tools** | `msjsdiag.vscode-react-native` | iOS simulator integration, Metro bundler. Technically cross-platform but iOS debugging requires macOS. |
| **Dart**               | `Dart-Code.dart-code`          | Dart language support — required by Flutter                                                            |
| **Flutter**            | `Dart-Code.flutter`            | Hot reload, device selector, iOS simulator integration                                                 |

### macOS Dev Environment

| Extension        | ID                            | Why                                                                             |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| **ShellCheck**   | `timonwong.shellcheck`        | Lint `.sh` scripts — macOS uses bash/zsh for CI scripts and Homebrew automation |
| **Remote - SSH** | `ms-vscode-remote.remote-ssh` | Connect to remote dev boxes — useful for CI runners or cloud dev                |

## Low Priority (Install When Needed)

| Extension                   | ID                                 | Platform | Repo                                                                       |
| --------------------------- | ---------------------------------- | -------- | -------------------------------------------------------------------------- |
| **Prettier**                | `esbenp.prettier-vscode`           | Both     | Code formatter — only needed for manual editing, not chat-centric workflow |
| **Prisma**                  | `Prisma.prisma`                    | Both     | AIRS Enterprise                                                            |
| **Terraform**               | `HashiCorp.terraform`              | Both     | Headstart                                                                  |
| **TypeScript + JS Nightly** | `ms-vscode.vscode-typescript-next` | Both     | 45 TS repos — only if built-in TS lags behind ~6.0.2                       |

## Can Uninstall

No matching files across any of the 111 repos.

| Extension                | ID                                 | Status    | Why removable                                                        |
| ------------------------ | ---------------------------------- | --------- | -------------------------------------------------------------------- |
| **Vitest Explorer**      | `vitest.explorer`                  | ✅ Removed | No repo uses Vitest. Test frameworks found: Mocha, pytest, unittest. |
| **Node Azure Pack**      | `ms-vscode.vscode-node-azure-pack` | ✅ Removed | Meta-pack — individual Azure extensions are already installed.       |
| **PDF Viewer**           | `tomoki1207.pdf`                   | ✅ Removed | Convenience only — no active PDF editing workflow.                   |
| **Debug Value Editor**   | `ms-vscode.debug-value-editor`     | ✅ Removed | No debugger variable editing workflow.                               |
| **TS File Path Support** | `ms-vscode.ts-file-path-support`   | ✅ Removed | VS Code has built-in path completion for TypeScript.                 |

## Tech Stack Coverage Map

Technologies found across all 111 repos and their extension status.

| Technology        | Repos | Status                                         |
| ----------------- | ----- | ---------------------------------------------- |
| TypeScript (.ts)  | 45    | Covered (built-in + ESLint + esbuild)          |
| Python (.py)      | 44    | Covered (Python + Pylance + Debugpy)           |
| HTML (.html)      | 32    | Covered (built-in)                             |
| YAML (.yaml/.yml) | 31    | ✅ Covered (`redhat.vscode-yaml`)               |
| CSV (.csv)        | 18    | ✅ Covered (Rainbow CSV)                        |
| Bicep (.bicep)    | 11    | ✅ Covered                                      |
| Jupyter (.ipynb)  | 9     | ✅ Covered (Jupyter stack)                      |
| TSX/JSX           | 8     | ✅ Covered (built-in + ESLint)                  |
| LaTeX (.tex/.bib) | 8     | ✅ Covered (`James-Yu.latex-workshop`)          |
| Docker            | 8     | ✅ Covered (`ms-azuretools.vscode-docker`)      |
| C# (.cs/.csproj)  | 7     | ✅ Covered (`ms-dotnettools.csdevkit`, Windows) |
| SQL (.sql)        | 7     | ✅ Covered (`ms-mssql.mssql`)                   |
| R (.r/.rmd)       | 3     | Not covered (low priority)                     |
| Dart (.dart)      | 1     | macOS only — Flutter/Dart                      |
| Swift (.swift)    | 1     | macOS only — `swiftlang.swift-vscode`          |

## Summary

| Category                 | Count  | Platform        |
| ------------------------ | ------ | --------------- |
| Must Have — Both         | 30     | Windows + macOS |
| Must Have — Windows Only | 1      | Windows         |
| Must Have — macOS Only   | 7      | macOS           |
| Low Priority             | 4      | Both            |
| Can Uninstall            | 5      | —               |
| **Total recommended**    | **38** |                 |

### Currently installed: 37 (30 direct + 7 auto-dependencies) | Pending removal: 0 | macOS-only not yet installed: 7

## Quick Commands

### Install missing (Both platforms)

```powershell
# Run on Windows — cross-platform extensions
@(
    'redhat.vscode-yaml',
    'James-Yu.latex-workshop',
    'ms-azuretools.vscode-docker',
    'ms-mssql.mssql'
) | ForEach-Object { code --install-extension $_ }
```

### Install missing (Windows only)

```powershell
code --install-extension ms-dotnettools.csdevkit
```

### Install missing (macOS only)

```zsh
extensions=(
    "swiftlang.swift-vscode"
    "vknabel.vscode-apple-swift-format"
    "msjsdiag.vscode-react-native"
    "Dart-Code.dart-code"
    "Dart-Code.flutter"
    "timonwong.shellcheck"
    "ms-vscode-remote.remote-ssh"
)
for ext in "${extensions[@]}"; do
    code --install-extension "$ext"
done
```

### Uninstall unused

```powershell
@(
    'vitest.explorer',
    'ms-vscode.vscode-node-azure-pack',
    'tomoki1207.pdf',
    'ms-vscode.debug-value-editor',
    'ms-vscode.ts-file-path-support'
) | ForEach-Object { code --uninstall-extension $_ }
```

---

## Extension Review: Ratings, Feedback & Compatibility

> Data collected: 2026-04-11 from VS Code Marketplace

### Marketplace Ratings

| Extension               | Rating | Installs | Last Updated | Notes                                                                                                                                                            |
| ----------------------- | ------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ESLint**              | 4.3/5  | 49.5M    | 2026-03-04   | Actively maintained by Microsoft. 72 open issues.                                                                                                                |
| **Prettier**            | 3.5/5  | 67.4M    | 2026-03-16   | Lower rating due to config confusion. 45 open issues. Works well once configured.                                                                                |
| **YAML** (Red Hat)      | 3.5/5  | 26.5M    | 2026-04-11   | 276 open issues. Some complaints about performance on large files and telemetry.                                                                                 |
| **LaTeX Workshop**      | 4.8/5  | 5.0M     | 2026-04-08   | Excellent rating. Requires VS Code 1.114+. Very actively maintained.                                                                                             |
| **Docker**              | 4.5/5  | 50.5M    | 2025-05-28   | Now an Extension Pack wrapping "Container Tools". Consider installing `ms-vscode.vscode-containers` directly instead.                                            |
| **C# Dev Kit**          | 2.9/5  | 14.8M    | 2026-04-06   | Lowest rated on this list. Common complaints: high memory, slow project load, licensing confusion (free for individuals/OSS, requires VS subscription for orgs). |
| **SQL Server (mssql)**  | 3.0/5  | 9.1M     | 2026-03-18   | Mixed reviews. Feature-rich (Schema Designer, Copilot integration) but some stability issues reported.                                                           |
| **Flutter**             | 4.9/5  | 13.5M    | 2026-03-31   | Excellent. Auto-installs Dart extension.                                                                                                                         |
| **React Native Tools**  | 4.1/5  | 6.0M     | 2024-03-24   | **WARNING: Last updated March 2024 — over 2 years stale.** Still functional but no recent maintenance.                                                           |
| **ShellCheck**          | 5.0/5  | 2.0M     | 2026-04-02   | Perfect rating. Bundles ShellCheck binaries for all platforms.                                                                                                   |
| **Markdown All in One** | —      | —        | —            | Stable, mature, no known issues.                                                                                                                                 |
| **MarkdownLint**        | —      | —        | —            | Stable, mature, no known issues.                                                                                                                                 |

### Critical Findings

#### 1. `sswg.swift-lang` is DEPRECATED

The Swift extension `sswg.swift-lang` has been **deprecated and replaced** by `swiftlang.swift-vscode`. The old extension exists only to migrate users. **Do not install `sswg.swift-lang`.**

**Action:** Use `swiftlang.swift-vscode` instead.

#### 2. `nicklason.sweetpad` — 404 / Not Found

The SweetPad extension (`nicklason.sweetpad`) returned a **404 on the Marketplace**. It may have been removed, renamed, or unpublished.

**Action:** Verify availability before installing. Alternative: use `swiftlang.swift-vscode` which now includes Xcode project support, build tasks, and LLDB debugging natively.

#### 3. `msjsdiag.vscode-react-native` — Stale (2+ years)

Last updated **March 2024**. While still functional, it has not received updates in over 2 years. React Native has evolved significantly (New Architecture, Hermes default, Expo SDK 50+).

**Action:** Keep for now if you have active RN projects, but monitor for a maintained alternative.

#### 4. `ms-azuretools.vscode-docker` — Now an Extension Pack

The Docker extension has been restructured as an **Extension Pack** that wraps "Container Tools" (`ms-vscode.vscode-containers`). You can install the pack or the underlying Container Tools extension directly.

**Action:** Either works. The pack just adds Container Tools automatically.

### Known Incompatibilities & Conflicts

> **All conflicts below have been resolved in `settings.json`.** The Resolution column shows what was applied.

| Conflict                                       | Extensions                                          | Severity   | Resolution                                                                                                                                                                                                                               | Status       |
| ---------------------------------------------- | --------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **ESLint vs Prettier formatting**              | `dbaeumer.vscode-eslint` + `esbenp.prettier-vscode` | **High**   | Prettier handles formatting (`defaultFormatter` per language); ESLint handles linting only (`eslint.format.enable: false`). ESLint auto-fixes run via `codeActionsOnSave` with `source.fixAll.eslint: "explicit"`. No double-formatting. | **RESOLVED** |
| **ESLint format + formatOnSave**               | `dbaeumer.vscode-eslint`                            | **Medium** | `eslint.format.enable: false` prevents ESLint from acting as a formatter. `formatOnSave: true` only invokes the language's `defaultFormatter`. ESLint fixes run as a separate code action (`explicit` = only when triggered).            | **RESOLVED** |
| **YAML formatter vs Prettier**                 | `redhat.vscode-yaml` + `esbenp.prettier-vscode`     | **Medium** | `[yaml]`, `[dockercompose]`, and `[github-actions-workflow]` all set `defaultFormatter: "redhat.vscode-yaml"`. Prettier never touches YAML files.                                                                                        | **RESOLVED** |
| **LaTeX Workshop vs Markdown**                 | `James-Yu.latex-workshop`                           | **Low**    | `latex-workshop.latex.autoBuild.run: "onSave"` prevents builds on file change. `latex-workshop.latex.rootFile.doNotPrompt: true` prevents prompts when opening `.md` files that contain LaTeX-like syntax.                               | **RESOLVED** |
| **Prettier `resolveGlobalModules` on Windows** | `esbenp.prettier-vscode`                            | **Medium** | Setting removed — Prettier is not currently installed. Re-add `prettier.resolveGlobalModules: false` if Prettier is reinstalled.                                                                                                         | **REMOVED**  |
| **Inline suggest vs chat-centric workflow**    | `github.copilot`                                    | **Medium** | `editor.inlineSuggest.enabled: false` and `github.copilot.editor.enableAutoCompletions: false`. All code authoring goes through Chat/agents.                                                                                             | **RESOLVED** |
| **Cross-platform Python path**                 | `ms-python.python`                                  | **Medium** | Changed from Windows-only `.venv\Scripts\python.exe` to `"python"` (auto-discovery). The Python extension finds `.venv` in each workspace automatically on both Windows and macOS.                                                       | **RESOLVED** |
| **Stale markdown.styles path**                 | built-in markdown preview                           | **Low**    | Removed dead reference to `C:/Development/Alex_Plug_In/...` (repo no longer exists). Set to empty array. Use workspace `.vscode/settings.json` to add per-project CSS.                                                                   | **RESOLVED** |
| **Missing language formatters**                | various                                             | **Low**    | Added `defaultFormatter` for `[json]`/`[jsonc]` (Prettier), `[python]` (ms-python.python), `[yaml]` (Red Hat). Every language now has an explicit formatter — no ambiguity.                                                              | **RESOLVED** |
| **C# Dev Kit licensing**                       | `ms-dotnettools.csdevkit`                           | **Info**   | No settings fix needed. Free for individuals and OSS. For orgs, requires Visual Studio Professional/Enterprise subscription.                                                                                                             | **N/A**      |
| **React Native + Expo debug collision**        | `msjsdiag.vscode-react-native`                      | **Low**    | No settings fix needed. Just don't install both stable and preview versions simultaneously.                                                                                                                                              | **N/A**      |

### Resolved `settings.json` — Chat-Centric, Cross-Platform

All conflict resolutions applied. These are the relevant settings (already in your `settings.json`).

```jsonc
{
  // ─── Chat-centric: no inline completions ───
  "editor.inlineSuggest.enabled": false,
  "github.copilot.editor.enableAutoCompletions": false,

  // ─── Formatting: Prettier formats, ESLint lints ───
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"  // ESLint fixes as code action, not formatter
  },
  "eslint.format.enable": false,        // ESLint never acts as a formatter

  // ─── Language-specific formatters (no ambiguity) ───
  "[markdown]":             { "editor.defaultFormatter": "yzhang.markdown-all-in-one" },
  "[javascript]":           { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescript]":           { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[json]":                 { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[jsonc]":                { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[yaml]":                 { "editor.defaultFormatter": "redhat.vscode-yaml" },
  "[dockercompose]":        { "editor.defaultFormatter": "redhat.vscode-yaml" },
  "[github-actions-workflow]": { "editor.defaultFormatter": "redhat.vscode-yaml" },
  "[python]":               { "editor.defaultFormatter": "ms-python.python" },

  // ─── LaTeX safety ───
  "latex-workshop.latex.autoBuild.run": "onSave",
  "latex-workshop.latex.rootFile.doNotPrompt": true,

  // ─── Cross-platform ───
  "python.defaultInterpreterPath": "python",  // Auto-discovers .venv on both platforms
  "markdown.styles": []                        // Use workspace settings for per-project CSS
}
```
