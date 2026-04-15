# What's New: VS Code 1.114.0

**Reviewed**: 2026-03-31
**Build**: 1.114.0 (d63819fd8f5b898dc977c32f119dd3b6c5013768)
**Electron**: 39.8.3 | **Node**: 22.22.1 | **Chromium**: 142.0.7444.265

VS Code 1.114 is a rolling release (daily updates, not a traditional milestone). The major payload shipped in **1.113** (March 25, 2026). This document covers both.

## 1.114 Rolling Updates (March 23-26)

### TypeScript 6.0 Ships in VS Code

VS Code's built-in language service is now TypeScript 6.0. This is the **bridge release** before TypeScript 7.0 (the Go native port, expected within months).

**New TS6 features available in the editor:**

| Feature                                           | Description                                                                       |
| ------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Temporal` API types                              | Built-in types for the Stage 4 Temporal proposal via `esnext` lib                 |
| `Map.getOrInsert` / `getOrInsertComputed`         | Upsert pattern for Maps (Stage 4) via `esnext` lib                                |
| `RegExp.escape`                                   | Safe regex escaping via `es2025` lib                                              |
| `#/` subpath imports                              | Cleaner internal imports without extra path segments                              |
| `es2025` target/lib                               | New target with `RegExp.escape`, `Promise.try`, `Iterator` methods, `Set` methods |
| `dom` includes `dom.iterable`                     | No longer need to specify both; `dom` alone is sufficient                         |
| Less context-sensitivity on `this`-less functions | Better type inference for method-syntax functions that don't use `this`           |

**Breaking changes and deprecations:**

| Change                                            | Impact                                          | Migration                              |
| ------------------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| `strict` defaults to `true`                       | None if already explicit                        | Already set in Alex tsconfig           |
| `module` defaults to `esnext`                     | None if already explicit                        | Alex uses explicit `"commonjs"`        |
| `target` defaults to `es2025`                     | None if already explicit                        | Alex uses explicit `"ES2020"`          |
| `types` defaults to `[]`                          | **High**: `@types/node` no longer auto-included | Add `"types": ["node"]` to tsconfig    |
| `rootDir` defaults to `.`                         | None if already explicit                        | Alex uses explicit `"src"`             |
| `moduleResolution: "node"` **deprecated**         | **High**: Alex tsconfig uses this               | Migrate to `"nodenext"` or `"bundler"` |
| `baseUrl` **deprecated**                          | Low: Alex doesn't use it                        | No action                              |
| `target: es5` **deprecated**                      | None: Alex targets ES2020                       | No action                              |
| `outFile` **removed**                             | None: Alex doesn't use it                       | No action                              |
| `module: amd/umd/systemjs` **removed**            | None: Alex uses commonjs                        | No action                              |
| `moduleResolution: classic` **removed**           | None: Alex uses node                            | No action                              |
| `esModuleInterop: false` **removed**              | None: Alex has it `true`                        | No action                              |
| `no-default-lib` directive **removed**            | None                                            | No action                              |
| Legacy `module` keyword for namespaces: **error** | Low: use `namespace` instead                    | No action                              |
| `asserts` keyword on imports: **error**           | Low: use `with` instead                         | No action                              |

Deprecations can be temporarily suppressed with `"ignoreDeprecations": "6.0"` in tsconfig, but TS 7.0 will remove all deprecated options entirely.

**Migration tool**: [ts5to6](https://github.com/andrewbranch/ts5to6) can automatically adjust `baseUrl` and `rootDir`.

### Chat Improvements

| Feature                         | Description                                          |
| ------------------------------- | ---------------------------------------------------- |
| **Persistent chat permissions** | Permission levels saved and restored across sessions |
| **Artifacts "Clear" action**    | Remove stale artifacts in long conversations         |
| **Pinned session indicator**    | Pin icon visible in the sessions list                |

### Developer Tooling

| Feature                        | Description                                                                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| **`${taskVar:name}` variable** | Capture dynamic values from task problem matcher output and use them in launch configurations (e.g., `${taskVar:serverUrl}`) |

## 1.113 Features (March 25, 2026)

These shipped with the 1.113 milestone and are included in 1.114.

### Agent Experience

| Feature                             | Description                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Nested subagents**                | Subagents can invoke other subagents. Enable via `chat.subagents.allowInvocationsFromSubagents`. Prevents infinite recursion by default. |
| **MCP in CLI/Claude agents**        | MCP servers configured in VS Code are bridged to Copilot CLI and Claude agents automatically                                             |
| **Agent debug logs for CLI/Claude** | Agent Debug Log panel now works for Copilot CLI and Claude sessions (was local-only)                                                     |
| **Session forking for CLI/Claude**  | Fork conversations in Copilot CLI (`github.copilot.chat.cli.forkSessions.enabled`) and Claude agents                                     |
| **Claude session listing via SDK**  | Sessions now listed via official Claude SDK API instead of JSONL file parsing                                                            |
| **Plugin marketplace management**   | New command: `Chat: Manage Plugin Marketplaces`. Browse, open directory, remove plugins.                                                 |
| **Plugin URL handlers**             | One-click install via `vscode://chat-plugin/install?source=<source>` or `vscode://chat-plugin/add-marketplace?ref=<repo/owner>`          |

### Chat Experience

| Feature                                  | Description                                                                                                                                                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Chat Customizations editor (Preview)** | Centralized UI for managing instructions, prompt files, agents, skills. Open via gear icon in Chat view or `Chat: Open Chat Customizations`.                                                                                 |
| **Configurable thinking effort**         | Reasoning models show a Thinking Effort submenu in the model picker (Low/Medium/High). Old settings `anthropic.thinking.effort` and `responsesApiReasoningEffort` are **deprecated**.                                        |
| **Images preview viewer**                | Full image viewer for chat attachments: navigation, zoom, pan, grouped by conversation turn. Also available from Explorer context menu. Settings: `imageCarousel.chat.enabled`, `imageCarousel.explorerContextMenu.enabled`. |

### Editor Experience

| Feature                                            | Description                                                                                                                                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Self-signed certificates in integrated browser** | Temporarily trust untrusted certificates during development (1-week trust, revocable)                                                                                           |
| **Improved browser tab management**                | `Quick Open Browser Tab` command (Ctrl+Shift+A when browser focused), "Close All Browser Tabs" context menu, configurable title bar button (`workbench.browser.showInTitleBar`) |
| **New default themes**                             | "VS Code Light" and "VS Code Dark" replace the previous "Modern" themes                                                                                                         |

### Deprecations

| Setting                      | Status                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Edit Mode**                | Deprecated since 1.110. Re-enable via `chat.editMode.hidden` until 1.125, then fully removed.                                               |
| **Thinking effort settings** | `github.copilot.chat.anthropic.thinking.effort` and `github.copilot.chat.responsesApiReasoningEffort` deprecated. Use model picker instead. |

## Impact on Alex Roadmap

### Blocked Contracts: No Change

| Contract | What                                       | Status in 1.114                                                        |
| -------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| **A**    | Agent lifecycle hooks (active/queued/idle) | Still blocked: no agent state API                                      |
| **B**    | Context budget API (denominator)           | Still partial: `countTokens()` exists (numerator), no total budget API |
| **C**    | Memory persistence API                     | Still blocked: no structured persistence for extensions                |
| **D**    | Command history API                        | Still blocked: no change                                               |

### Opportunities to Leverage

| Opportunity                    | Priority | Action                                                                                                                         |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Nested subagents**           | High     | Enable `chat.subagents.allowInvocationsFromSubagents` for multi-hop chains (Researcher calls Explore, Builder calls Validator) |
| **Chat Customizations editor** | Medium   | Reference in WORKING-WITH-ALEX.md so users know they can manage Alex's customizations via UI                                   |
| **MCP bridging to CLI/Claude** | Medium   | Alex's MCP cognitive tools are automatically available in Copilot CLI and Claude sessions with no code changes                 |
| **TS6 tsconfig migration**     | Medium   | Migrate `moduleResolution` from `"node"` to `"nodenext"`, add `"types": ["node"]`, prep for TS 7.0                             |
| **Images preview**             | Low      | No action needed; improves UX for image-generating skills (banners, avatars) automatically                                     |

### Alex tsconfig.json Migration Plan

Current [platforms/vscode-extension/tsconfig.json](../platforms/vscode-extension/tsconfig.json) settings that need attention:

```jsonc
{
  "compilerOptions": {
    // CHANGE: "node" is deprecated in TS6, removed in TS7
    // Migrate to "nodenext" (for Node.js targets) or "bundler"
    "moduleResolution": "node",  // → "nodenext"

    // ADD: TS6 defaults types to [], @types/node won't auto-include
    // "types": ["node"],

    // SAFE: Already explicit, no changes needed
    "module": "commonjs",
    "target": "ES2020",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

**Dev dependency**: Currently `"typescript": "^5.4.5"`. Upgrade to `^6.0.0` when ready, but this is independent of VS Code's built-in TS 6.0 language service. The editor will show TS6 diagnostics regardless of the build dependency version.

### Satisfies Roadmap Item

This review fulfills **v7.1.0 item 7.9**: "Platform evolution watch (VS Code 1.114+)".

## Future Watch Items

| Item                                  | Source                          | Why it matters                                                                            |
| ------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| **TypeScript 7.0 native preview**     | TS blog, March 2026             | Go-based compiler, parallel type checking, massive speed gains. Expected "within months." |
| **Reasoning effort programmatic API** | Model picker UI shipped (1.113) | If a programmatic API emerges, Alex could auto-tune reasoning per-task                    |
| **Windows Agent Workspace**           | Copilot Labs (Insider preview)  | MCP tools as ODR agent connectors; Alex's cognitive tools could register                  |
