# API & Dependency Review — March 2026

> Comprehensive review of recent changes, improvements, and update opportunities across all APIs and dependencies used in the Alex Cognitive Architecture project.

## Executive Summary

| Dependency | Current Version | Latest | Gap | Action |
|---|---|---|---|---|
| VS Code Engine | `^1.109.0` | 1.111 (stable) | Minor | **MONITOR** — engine min is fine |
| `@types/vscode` | `^1.108.1` | ~1.111 | Minor | **ADOPT** — bump to match stable |
| `replicate` | `^1.4.0` | 1.4.0 | **Current** | NO ACTION |
| `@modelcontextprotocol/sdk` | `^1.0.0` | 1.27.1 | **27 minor** | **ADOPT** — major update needed |
| `pptxgenjs` | `^4.0.1` | 4.0.1 | **Current** | NO ACTION |
| `ws` | `^8.18.0` | 8.19.0 | 1 minor | **ADOPT** — includes `closeTimeout` |
| `fs-extra` | `^11.3.3` | 11.3.x | **Current** | NO ACTION |
| `proper-lockfile` | `^4.1.2` | 4.1.2 | **Current** | NO ACTION |
| `esbuild` | `^0.27.2` | 0.27.x | **Current** | NO ACTION |
| `typescript` | `^5.1.3` | ~5.8 | Several minor | **MONITOR** — update when convenient |
| `mocha` | `^11.7.5` | 11.x | **Current** | NO ACTION |
| `sharp` | `^0.34.5` | 0.34.x | **Current** | NO ACTION |
| `@azure/functions` | `^4.0.0` | 4.x | **Current** | NO ACTION |

---

## 1. VS Code Extension API (engine `^1.109.0`)

### v1.110 (February 2026) — Massive Release

**Finalized APIs:**
- **`env.isAppPortable`** — Detects portable mode. Now stable, no longer proposed.
- **WebView ThemeIcon** — `WebViewPanel.iconPath` now accepts `ThemeIcon` (not just `Uri`).

**Experimental / Preview Features (not API, but agent-level):**
- **Agent Plugins** — Prepackaged bundles of skills, tools, hooks installable from Extensions view.
- **Agentic Browser Tools** — `openBrowserPage`, `readPage`, `screenshotPage`, `clickElement`, etc.
- **Create agent customizations from chat** — `/create-prompt`, `/create-instruction`, `/create-skill`, `/create-agent`, `/create-hook`.
- **Tools for usages and rename** — Built-in LSP-backed tools for agent use.
- **Session memory for plans** — Plans persist to conversation session memory.
- **Context compaction** — Manual + automatic conversation compaction.
- **Fork chat sessions** — `/fork` command.
- **Agent Debug Panel** (Preview).

**Engineering:**
- TypeScript-Go (tsgo) is now default for VS Code workspace.
- esbuild replacing webpack for built-in extensions.
- **Edit Mode officially deprecated** (v1.110), removed by v1.125.

### v1.111 (March 2026)

**Extension Authoring:**
- Basic IntelliSense for localized strings in extension `package.json`.

**Agent-level (Preview):**
- **Agent permissions / Autopilot** — New permission model for agent mode.
- **Agent-scoped hooks** — Hooks can now be scoped per agent.
- **Debug events snapshot** — Enhanced debugging for agent tools.

### v1.112 Insiders

- **Claude agent mode GA** — No longer preview, fully stable.
- Modal editor resizable.
- Integrated browser right-click context menu.

### Impact on Alex

| Change | Relevance | Priority |
|---|---|---|
| `env.isAppPortable` finalized | Could use to detect portable installs | LOW |
| WebView ThemeIcon for iconPath | Could simplify sidebar icon handling | MEDIUM |
| Agent Plugins (experimental) | Core to Alex distribution model — already tracked | HIGH |
| Agent-scoped hooks | Directly relevant to Alex hooks system | HIGH |
| Autopilot permissions | Alex autopilot integration | MEDIUM |
| Agent Debug Panel | Developer experience improvement | MEDIUM |

---

## 2. Replicate SDK (`replicate: ^1.4.0`)

### Version History: 1.0.0 → 1.4.0 (current = latest)

**v1.0.0 (Oct 2024) — BREAKING:**
- `replicate.run()` returns `FileOutput` objects instead of URL strings.
- Sync/blocking mode enabled by default (holds connection open until complete).
- `useFileOutput: false` to opt out.

**v1.1.0 (Aug 2025):**
- `AbortSignal` support on all API methods.
- `aborted` added to Status types.
- Updated `models.versions.list()` interface.
- Dropped Node 18 support for `validateWebhook`.

**v1.2.0 (Sep 2025):**
- Exposed `is_official` boolean on models.
- Same changes as 1.1.0 (cumulative).

**v1.3.1 (Oct 2025):**
- Updated types to match current HTTP API.

**v1.4.0 (Nov 2025) — Current:**
- Bug fix for `stream()` with file-outputting models.
- `event.data` is now `FileOutput` for stream events.
- New `useFileOutput` option on `stream()`.

### Impact on Alex

**The project is on the latest version (1.4.0).** No update needed. Key consideration: Alex's `replicateService.ts` should verify it correctly handles `FileOutput` objects from `replicate.run()` (the 1.0.0 breaking change). If the code pre-dates 1.0.0 patterns and was updated for v1, no action needed.

---

## 3. MCP TypeScript SDK (`@modelcontextprotocol/sdk: ^1.0.0`)

### **CRITICAL: 27 minor versions behind (1.0.0 → 1.27.1)**

This is the largest gap in the project. The MCP SDK has seen explosive development.

**Key releases since 1.0.0:**

**v1.23.x–1.24.x (Nov–Dec 2025):**
- SSE priming events (backwards compat fix in 1.23.1).
- Framework-agnostic Server class (express moved to separate module).
- Optional resource annotations.
- Protocol date validation.
- Fetch transport added.
- Spec compliance: removed loose/passthrough types.
- Task types added.
- Zod v4 schema description extraction fix.
- `description` field added to Implementation schema.
- `theme` property added to Icon schema.

**v1.25.x (Dec 2025–Jan 2026):**
- **Security: ReDoS fix in UriTemplate regex patterns** (v1.25.2).
- Hono global Response override prevention.
- Correct schema for client sampling validation when tools present.
- List changed handlers on client constructor.
- Role moved from inline to reusable type.
- Support for updating output schema.
- Removed type dependency on `@cfworker/json-schema`.

**v1.26.0 (Feb 2026):**
- **Security: GHSA-345p-7cg4-v4c7** — "Sharing server/transport instances can leak cross-client response data."
- npm audit vulnerability fixes.
- Client Credentials providers scopes support.

**v1.27.0–1.27.1 (Recent):**
- Auth/pre-registration conformance scenario.
- OAuth server info discovery and caching (backported).
- URL property on RequestInfo interface.
- Streaming methods for elicitation and sampling.
- **Security: command injection prevention in example URL opening.**
- Fix for silently swallowed transport errors.

### Impact on Alex

| Issue | Severity | Action |
|---|---|---|
| Security advisory GHSA-345p-7cg4-v4c7 (cross-client data leak) | **HIGH** | Update immediately |
| ReDoS vulnerability fix | **MEDIUM** | Update immediately |
| Command injection prevention | **MEDIUM** | Update immediately |
| Framework-agnostic server | LOW | Nice to have |
| Task types, streaming elicitation | LOW | Future feature enablement |
| Spec compliance improvements | MEDIUM | Better interop with MCP clients |

**Recommendation: Update `@modelcontextprotocol/sdk` from `^1.0.0` to `^1.27.1` as soon as possible.** This is primarily a security concern. The `^1.0.0` semver range will auto-resolve to latest 1.x on fresh install, but pinned `node_modules` or lockfiles may hold an older version.

---

## 4. PptxGenJS (`pptxgenjs: ^4.0.1`)

### Version History

**v4.0.0 (May 2025) — MAJOR:**
- `textDirection` property for vertical text rotation.
- New `exports` field in package.json (modern module resolution).
- New Node.js detection logic (fixes Vite + Web Worker issues).
- JSZip bumped to ^3.10.1.

**v4.0.1 (Jun 2025) — Current = Latest:**
- Bug fixes for borders, scheme colors, hyperlinks with auto-paging.
- Removed `node:fs/promises` from browser field.

### Impact on Alex

**Project is on latest (4.0.1).** The v4.0.0 modern module resolution via `exports` may improve bundling with esbuild. No action needed.

---

## 5. ws WebSocket Library (`ws: ^8.18.0`)

### Version History

**v8.18.0 (Jul 2024) — Project's minimum:**
- Added `Blob` support.

**v8.18.1 (Feb 2025):**
- Test path fix (no functional change).

**v8.18.2 (May 2025):**
- Fixed decompression error handling (incorrect error/close code).

**v8.18.3 (Jun 2025):**
- Handled forthcoming Node.js core breaking change.
- Fixed Sec-WebSocket-Version header spec violation.

**v8.19.0 (Jan 2026) — Latest:**
- New `closeTimeout` option for controlling close handshake timeout.

### Impact on Alex

The `closeTimeout` option in 8.19.0 could be useful for the Edge TTS WebSocket service (`ttsService.ts`) to handle connection cleanup more reliably. The bug fixes in 8.18.2–8.18.3 are worth picking up. **Recommendation: bump to `^8.19.0`.**

---

## 6. Other Dependencies

### TypeScript (`^5.1.3`)
Current TypeScript is around 5.8.x. The `^5.1.3` range auto-resolves to latest 5.x, so this is likely already current on install. No version bump needed in package.json.

### esbuild (`^0.27.2`)
The `^0.27.2` range covers latest 0.27.x. esbuild follows rapid release cadence but 0.27.x is current.

### Mocha (`^11.7.5`)
Mocha 11 is the current major. Recently upgraded from 10→11 in the audit hygiene release. Current.

### sharp (`^0.34.5`)
sharp 0.34.x is current. No major changes.

### @azure/functions (`^4.0.0`)
Azure Functions Node.js v4 programming model is the current stable version. The `^4.0.0` range covers any 4.x releases. No breaking changes in the 4.x line.

### Edge TTS WebSocket API
This is a direct WebSocket connection to `speech.platform.bing.com`. No SDK — uses raw `ws`. Microsoft hasn't deprecated this endpoint, but it's undocumented/unofficial. **Risk: could break without notice.** Consider monitoring Azure Cognitive Services Speech SDK as a more stable alternative.

### GitHub REST API (via `vscode.authentication`)
Accessed through VS Code's built-in GitHub authentication. VS Code handles API versioning. No action needed.

### Iconify, DiceBear, Brandfetch/Logo.dev APIs
All external HTTP APIs with no npm dependencies. Monitor for rate limit or availability changes. No action needed.

---

## Priority Action Items

### Immediate (v6.5.0)

| # | Action | Priority | Effort |
|---|---|---|---|
| 1 | **Update MCP SDK** `^1.0.0` → `^1.27.1` in `packages/mcp-cognitive-tools/package.json` | **P1** | Low |
| 2 | Run `npm audit` on MCP package after update | **P1** | Low |
| 3 | Verify MCP server still works after SDK bump (breaking type changes possible) | **P1** | Medium |

### Short-term (v6.5.x)

| # | Action | Priority | Effort |
|---|---|---|---|
| 4 | Bump `@types/vscode` to `^1.111.0` | **P2** | Low |
| 5 | Bump `ws` to `^8.19.0` for `closeTimeout` + bug fixes | **P2** | Low |
| 6 | Evaluate `WebView ThemeIcon` for sidebar icon simplification | **P3** | Medium |

### Monitor (v6.6.0+)

| # | Action | Priority | Effort |
|---|---|---|---|
| 7 | Agent-scoped hooks (VS Code 1.111 Preview) — may reshape Alex hooks | **P2** | Research |
| 8 | Autopilot permissions model — may need Alex integration | **P3** | Research |
| 9 | Agent Plugins distribution format — core to Alex agent-plugin heir | **P2** | Research |
| 10 | Edge TTS stability — evaluate Azure Speech SDK alternative | **P4** | Research |

---

## Dependency Health Summary

```
✅ Current:     replicate, pptxgenjs, fs-extra, proper-lockfile, esbuild, mocha, sharp, @azure/functions
⚠️ Minor gap:   ws (1 minor), @types/vscode (few minors), typescript (auto-resolves)
🔴 Major gap:   @modelcontextprotocol/sdk (27 minors behind, 3 security fixes missed)
```

**Overall health: GOOD with one critical update needed (MCP SDK).**
