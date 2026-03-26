# Heir Payload Audit — March 10, 2026

**Auditor:** Alex (Builder)
**Scope:** All 3 heirs — VS Code Extension, M365 Copilot, Agent Plugin
**Trigger:** Avatar system deprecation → deadweight discovery cascade

---

## Executive Summary

The avatar system (dynamic PNG/SVG switching per persona, agent, state, and age) was deprecated in favor of text-based emoji personas and a single default rocket icon. This audit identified **~1,429 lines of dead TypeScript**, **56 committed build artifacts**, **135.5 MB of stale local VSIX files**, and several hygiene issues across the three heirs.

**All high-priority and medium-priority items are now complete.** Only low-priority heir hygiene remains.

### Actions Completed (This Session)

| Action | Impact |
|---|---|
| Deleted 122 avatar files (90 PNGs + 32 non-default SVGs) | **−25.3 MB** from heir |
| Updated `.vscodeignore` with avatar exclusion rules | Prevents future avatar files from entering VSIX |
| VSIX file count reduced from 555 → 433 | −122 files |
| VSIX images reduced from 135 → 13 | Only brand assets + default rocket remain |
| Deleted 4 stale `.vsix` files locally | **−108.4 MB** freed |
| Gutted `avatarMappings.ts` (771 → 68 lines) | −703 lines dead avatar maps/resolvers |
| Deleted `chatAvatarBridge.ts` + updated 2 importers | −49 lines |
| Deleted `generatePersonaImages.ts` + removed command from 3 locations | −213 lines |
| Rewrote `avatarMappings.test.ts` (184 → 75 lines) | −109 lines dead tests |
| Deleted `scripts/convert-avatars-to-webp.ps1` | −81 lines |
| Deleted `analyze_funcs.py` | −40 lines |
| Deleted `src/shared/index.ts` | −10 lines |
| Simplified `participant.ts` → static default rocket | −36 lines |
| Cleaned `welcomeView.ts` → removed `_buildAvatarContext()` + 3 call sites | −20 lines |
| Cleaned `personaDefinitions.ts` → removed `PERSONA_AVATAR_MAP`, `DEFAULT_AVATAR`, `getAvatarForPersona()`, `avatarFile` field | −130 lines |
| Cleaned `personaDetection.ts` → removed 3 dead re-exports | −6 lines |
| Cleaned `personaDetection.test.ts` → removed 2 dead test suites (4 tests) | −60 lines |
| M365: Added `api/dist/` + `env/.env.dev.user` to `.gitignore`, untracked 56 build files | Hygiene fix |
| **Total dead code removed** | **~1,457 lines** |
| **Total disk freed** | **~133.7 MB** |

---

## VS Code Extension (`platforms/vscode-extension/`)

### VSIX Payload (Post-Cleanup)

| Type | Count | Notes |
|---|---|---|
| Markdown (.md) | 270 | Skills, instructions, prompts, agents, docs |
| JSON | 138 | Synapses, configs, package metadata |
| JavaScript (.js) | 6 | Compiled output + hooks |
| Images | 13 | 6 brand assets, 6 .github assets, 1 default.svg |
| Other | 6 | License, changelog, etc. |
| **Total** | **433** | Down from 555 pre-cleanup |

### Avatar Code Cleanup — COMPLETE

All dead avatar code has been removed. The following files were deleted or cleaned:

#### Files Deleted

| File | Lines Removed | What Was Removed |
|---|---|---|
| `src/shared/chatAvatarBridge.ts` | 49 | Bridge pattern for dead avatar system |
| `src/commands/generatePersonaImages.ts` | 213 | Replicate API script for deleted PNG avatars |
| `scripts/convert-avatars-to-webp.ps1` | 81 | WebP conversion script for deleted avatars |
| `src/shared/index.ts` | 10 | Dead barrel re-export file |
| `analyze_funcs.py` | 40 | One-off NASA R4 analysis utility |
| 4 stale `.vsix` files | 108.4 MB | Local build artifacts |

#### Files Gutted / Cleaned

| File | Before → After | What Was Removed |
|---|---|---|
| `src/chat/avatarMappings.ts` | 771 → 68 | All PNG/SVG maps and resolvers. Kept `detectCognitiveState()` + `COGNITIVE_STATE_TRIGGERS` |
| `src/test/suite/avatarMappings.test.ts` | 184 → 75 | All avatar tests. Kept cognitive state detection tests |
| `src/chat/participant.ts` | ~36 lines | Removed dead imports, simplified `updateChatAvatar()` to static default rocket |
| `src/views/welcomeView.ts` | ~20 lines | Removed `_buildAvatarContext()`, bridge import, 3 `updateChatAvatar()` call sites |
| `src/chat/personaDefinitions.ts` | 1005 → 874 | Removed `PERSONA_AVATAR_MAP` (90 entries), `DEFAULT_AVATAR`, `getAvatarForPersona()`, `avatarFile` field from Persona interface, `avatarFile` logic from `buildPersona()` |
| `src/chat/personaDetection.ts` | ~6 lines | Removed 3 dead re-exports (`PERSONA_AVATAR_MAP`, `DEFAULT_AVATAR`, `getAvatarForPersona`) |
| `src/test/suite/personaDetection.test.ts` | 130 → 70 | Removed `getAvatarForPersona` suite (3 tests) and `PERSONA_AVATAR_MAP` suite (1 test) |
| `src/commands/commandsDeveloper.ts` | ~8 lines | Removed `generatePersonaImages` command registration + subscription |
| `package.json` | 1 entry | Removed `alex.generatePersonaImages` command declaration |

### Verification

- **Compilation**: Clean (tsc --noEmit + esbuild)
- **Tests**: 241 passing, 0 failing (down from 245 — removed 4 dead avatar tests)
- **Persona detection**: Fully operational — all 47 text-based personas with emoji icons, signal-based detection, Easter egg system preserved

---

## M365 Copilot (`platforms/m365-copilot/`)

### Committed Build Output — FIXED

| Item | Files | Status |
|---|---|---|
| `api/dist/` — compiled .js, .d.ts, .js.map, .d.ts.map | **56 files** | ✅ Added to `.gitignore`, removed from git tracking |

### Irrelevant Synced Content — FIXED

| Item | Status |
|---|---|
| `.github/skills/visual-memory/` (SKILL.md + synapses.json + index.json + visual-memory.json) | ✅ Deleted from M365 heir |
| `.github/instructions/visual-memory.instructions.md` | ✅ Deleted from M365 heir |
| `.github/prompts/visual-memory.prompt.md` | ✅ Deleted from M365 heir |

### Hygiene — FIXED

| Item | Status |
|---|---|
| `env/.env.dev.user` | ✅ Added to `.gitignore` |

---

## Agent Plugin (`platforms/agent-plugin/`)

### Version Drift — FIXED

| File | Previous | Updated |
|---|---|---|
| `marketplace.json` (2 entries) | v6.2.0 | v6.4.6 |
| `plugin/copilot-instructions.md` | v6.1.7 | v6.4.6 |
| `USER-MANUAL.md` | v6.1.7 | v6.4.6 |
| `README.md` | v6.1.5 | v6.4.6 |

---

## Cleanup Status

### Phase 1 — Safe Deletions ✅ COMPLETE

1. ✅ Deleted 4 stale `.vsix` files locally (108.4 MB freed)
2. ✅ Deleted `scripts/convert-avatars-to-webp.ps1` (81 lines)
3. ✅ Deleted `analyze_funcs.py` (40 lines)
4. ✅ Deleted `src/shared/index.ts` (10 lines)
5. ✅ Added `api/dist/` to M365 `.gitignore`, removed 56 files from tracking
6. ✅ Added `env/.env.dev.user` to M365 `.gitignore`

### Phase 2 — Avatar Code Gutting ✅ COMPLETE

1. ✅ Gutted `avatarMappings.ts` → kept only `detectCognitiveState()` + triggers (771 → 68 lines)
2. ✅ Deleted `chatAvatarBridge.ts` → updated 2 importers (49 lines removed)
3. ✅ Deleted `generatePersonaImages.ts` → removed command from commandsDeveloper.ts + package.json (213 lines)
4. ✅ Rewrote `avatarMappings.test.ts` → cognitive state detection tests only (184 → 75 lines)
5. ✅ Simplified `participant.ts` → static default icon in `updateChatAvatar()` (~36 lines)
6. ✅ Cleaned `welcomeView.ts` → removed `_buildAvatarContext()` + 3 call sites (~20 lines)
7. ✅ Cleaned `personaDefinitions.ts` → removed `PERSONA_AVATAR_MAP`, `DEFAULT_AVATAR`, `getAvatarForPersona()`, `avatarFile` field (1005 → 874 lines)
8. ✅ Cleaned `personaDetection.ts` → removed 3 dead re-exports
9. ✅ Cleaned `personaDetection.test.ts` → removed 2 dead test suites / 4 tests (130 → 70 lines)

### Phase 3 — Heir Hygiene ✅ COMPLETE

1. ✅ Fixed agent-plugin version strings (marketplace.json, copilot-instructions.md, USER-MANUAL.md, README.md → v6.4.6)
2. ✅ Removed visual-memory trifecta from M365 heir (skill dir + instruction + prompt)

---

## Preservation Notes

These must **not** be removed during cleanup:

- `detectCognitiveState()` + `COGNITIVE_STATE_TRIGGERS` in avatarMappings.ts — feeds sidebar cognitive state display
- `setCognitiveState()` / `setAgentMode()` / `getCognitiveState()` / `getAgentMode()` in welcomeView.ts — sidebar rendering
- `alex.setCognitiveState` command execution at participant.ts line 354 — side-effect of state detection
- `assets/avatars/rocket-icons/default/default.svg` — the one remaining icon
- Brand assets: logo.svg, logo.png, logo-mono.svg, icon.png, favicon.png, banner.svg, banner.png
