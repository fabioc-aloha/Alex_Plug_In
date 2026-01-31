# Alex Cognitive Architecture — Unified Roadmap

> **One Alex, Multiple Platforms, Coherent Evolution**

| | |
|---|---|
| **Current Master Version** | 3.7.18 |
| **Current Heirs** | VS Code (3.7.18), M365 (v1.6) |
| **Target** | 4.0.0 (Trust/Epistemic Integrity) |
| **Status** | 📋 Planning |
| **Created** | 2026-01-29 |
| **Philosophy** | Master + Heirs model — unified identity, platform-adapted expression |

---

## 🧠 The Alex Family

```
                         ┌─────────────────────────────────────┐
                         │          🧠 MASTER ALEX             │
                         │                                     │
                         │   Root .github/ = Source of Truth   │
                         │   Cognitive protocols, identity,    │
                         │   domain knowledge, skills          │
                         │                                     │
                         │   Version: Tracks with releases     │
                         └─────────────────┬───────────────────┘
                                           │
                          DNA Inheritance (not copies)
                                           │
                 ┌─────────────────────────┴─────────────────────────┐
                 │                                                   │
                 ▼                                                   ▼
     ┌───────────────────────────┐               ┌───────────────────────────┐
     │   👶 BABY ALEX (VS Code)  │               │   👶 BABY ALEX (M365)     │
     │                           │               │                           │
     │   platforms/vscode-ext/   │               │   platforms/m365-copilot/ │
     │                           │               │                           │
     │   Capabilities:           │               │   Capabilities:           │
     │   • Chat participant      │               │   • Declarative agent     │
     │   • Language model tools  │               │   • OneDrive memory       │
     │   • File system access    │               │   • Email, Teams, People  │
     │   • VS Code integration   │               │   • Meetings, Calendar    │
     │   • Extension APIs        │               │   • Web search, GraphicArt│
     │                           │               │   • Code interpreter      │
     │   Expression:             │               │                           │
     │   • Build from root       │               │   Expression:             │
     │   • Full .github/ copy    │               │   • Instructions embed    │
     │   • Technical depth       │               │     core protocols        │
     │                           │               │   • M365-native features  │
     └───────────────────────────┘               └───────────────────────────┘
```

**Principle:** Both heirs carry the same Alex identity. Users should recognize Alex on any platform.

---

## 📋 Unified Version History

| Version | Codename | Master | VS Code Heir | M365 Heir | Status |
|---------|----------|--------|--------------|-----------|--------|
| 3.4.3 | — | ✅ Stable | ✅ Published | — | Last stable |
| 3.5.x | Phoenix | ⚠️ Chaos | ⚠️ Broken | ✅ v1.6 deployed | Archived |
| 3.6.0 | Dawn | ✅ Done | ✅ Published | ✅ Aligned | Complete |
| 3.7.0 | Foundation | ✅ Done | ✅ v3.7.0 | — | Complete |
| 3.7.10 | — | ✅ Done | ✅ Hotfix | — | Complete |
| 3.7.11 | — | ✅ Done | ✅ Hotfix | — | Complete |
| 3.7.12 | — | ✅ Done | ✅ Published | — | — |
| 3.7.13 | — | ✅ Done | ✅ Published | — | — |
| 3.7.14 | — | ✅ Done | ✅ Published | — | — |
| 3.7.15 | UX Polish | ✅ Done | ✅ Published | — | — |
| 3.7.16 | M365 Parity | ✅ Done | — | ✅ Aligned | — |
| 3.7.17 | Full Skills | ✅ Done | — | ✅ 15 skills | — |
| **3.7.18** | **Embedded Knowledge** | **✅ Done** | **🔄 Publishing** | **✅ Ready** | **CURRENT** |
| 3.7.x | GK Migration | Planned | Planned | — | Next |
| 3.8.0 | Expression | Planned | Planned | Planned | — |
| 3.9.0 | Awareness | Planned | Planned | Planned | — |
| 4.0.0 | Trust | Planned | Planned | Planned | — |

---

## 🎯 v3.7.3 GK Migration — Data Quality Normalization

> **Goal:** Normalize global knowledge data during cloud sync for improved quality

### Features

| # | Feature | Status | Description |
|:-:|---------|:------:|-------------|
| 1 | GK Migration Function | ✅ | `normalizeGlobalKnowledge()` in globalKnowledge.ts |
| 2 | Auto-tag Generation | ✅ | Empty tags auto-populated from title keywords |
| 3 | Category Inference | ✅ | Miscategorized entries corrected via keyword mapping |
| 4 | Source Normalization | ✅ | "Alex_Sandbox" → "Master Alex (promoted skill)" |
| 5 | Cloud Sync Integration | ✅ | Migration runs before push/sync operations |
| 6 | Backward Compatibility | ✅ | Schema 1.0.0 → 1.0.1 (older versions can read) |

### Files Changed

| File | Changes |
|------|---------|
| `src/chat/globalKnowledge.ts` | Added migration function, tag generation, category mapping |
| `src/chat/cloudSync.ts` | Calls migration before push and sync |
| `alex_docs/GK-MIGRATION-PLAN.md` | Design document |

### Migration Rules

1. **Empty Tags**: Generate from title words (exclude common words, max 5 tags)
2. **Wrong Categories**: Infer from keyword mapping (needs 2+ matches to change)
3. **Sandbox Source**: Map bulk-promoted entries to "Master Alex (promoted skill)"

---

## 🎯 v3.6.0 Dawn — Comeback Release

> **Goal:** Stability, single source of truth, both heirs working

### Master Alex Tasks

| # | Task | Status | Description |
|:-:|------|:------:|-------------|
| 1 | Single source of truth | ✅ | Root `.github/` is canonical (78 files) |
| 2 | Archive Phoenix artifacts | ✅ | Extension `.github/`, v3.5 roadmap archived |
| 3 | Preserve domain knowledge | ✅ | 7 DK files merged from extension |
| 4 | Preserve skills | ✅ | 5 skills merged from extension |
| 5 | Document family model | ✅ | COMEBACK-PLAN.md created |
| 6 | Unified roadmap | ✅ | This document |

### VS Code Heir Tasks

| # | Task | Status | Description |
|:-:|------|:------:|-------------|
| 1 | Create build script | ✅ | `build-extension-package.ps1` generates `.github/` from root |
| 2 | Test extension builds | ✅ | `npm install`, `npm run compile`, `npm run package` |
| 3 | Verify all features | ✅ | 17 commands, 11 tools, status bar, welcome view |
| 4 | Update version | ✅ | 3.7.2 in package.json |
| 5 | Test fresh install | ✅ | Install on new workspace |
| 6 | Publish Beta 2 | ✅ | v3.7.2 on Marketplace (pre-release) |

### M365 Heir Tasks

| # | Task | Status | Description |
|:-:|------|:------:|-------------|
| 1 | Schema verification | ✅ | Using v1.6 (latest) |
| 2 | Identity alignment audit | ✅ | Verified 2026-01-31: Name, character, nicknames, protocols aligned |
| 3 | Test all capabilities | ⚠️ | User testing required: OneDrive, Email, Teams, People, Meetings |
| 4 | Document platform differences | ✅ | Created DK-MULTI-PLATFORM-ARCHITECTURE.md |

### Success Criteria

- [x] VS Code extension builds and installs cleanly
- [x] All existing VS Code features work
- [x] M365 agent personality matches VS Code Alex *(verified 2026-01-31)*
- [x] Both heirs recognizable as "Alex"

---

## 🎯 v3.7.0 Foundation — Confidence Infrastructure

> **Goal:** Core calibration systems in Master, inherited by both heirs

### Master Alex Changes

| # | Change | Files Affected |
|:-:|--------|----------------|
| 1 | 4-tier source grounding protocol | `DK-APPROPRIATE-RELIANCE.md` v1.4 |
| 2 | Confidence ceiling rules | `protocol-triggers.instructions.md` |
| 3 | Self-correction protocol | `alex-core.instructions.md` |

### VS Code Heir Features

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 1 | `/help` command | 1d | Discoverability for all commands |
| 2 | `/forget <topic>` command | 2d | Selective memory cleanup |
| 3 | Confidence tier awareness | 2d | Tools report confidence levels |

### M365 Heir Features

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 1 | Instructions update | 1d | Embed confidence language patterns |
| 2 | Conversation starter | 0.5d | "How confident are you about...?" |

### Cross-Platform Validation

- [ ] Same confidence expressions in both platforms
- [ ] Both heirs use 4-tier language (documented, inferred, uncertain, unknown)

---

## 🎯 v3.8.0 Expression — Uncertainty Communication

> **Goal:** Calibrated uncertainty language in all responses

### Master Alex Changes

| # | Change | Files Affected |
|:-:|--------|----------------|
| 1 | Uncertainty language patterns | `DK-APPROPRIATE-RELIANCE.md` v1.5 |
| 2 | Source attribution protocol | `protocol-triggers.instructions.md` |
| 3 | Verification suggestion triggers | `protocol-triggers.instructions.md` |

### VS Code Heir Features

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 1 | Source citations in responses | 1d | "According to `file.ts`..." |
| 2 | Verification prompts | 1d | "You may want to verify..." |
| 3 | User profile epistemic settings | 2d | Formality/expertise adaptation |

### M365 Heir Features

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 1 | Instructions update | 1d | Embed uncertainty expressions |
| 2 | OneDrive citation pattern | 0.5d | "According to your notes..." |
| 3 | **MS Graph Profile Discovery** | 2d | Auto-populate user profile via Graph API |

**MS Graph Profile Discovery Details:**
- User Profile: Name, title, department, manager, photo
- Calendar: Work patterns, meeting frequency, focus time preferences
- Teams: Collaboration style, frequent contacts
- Org Chart: Team structure, reporting relationships
- OneDrive: Recent documents for expertise inference

### Cross-Platform Validation

- [ ] Same uncertainty phrases in both platforms
- [ ] Verification prompts feel natural, not robotic

---

## 🎯 v3.9.0 Awareness — Detection & Self-Correction

> **Goal:** Proactive risk detection, graceful error handling

### Master Alex Changes

| # | Change | Files Affected |
|:-:|--------|----------------|
| 1 | "Confident but wrong" heuristics | `protocol-triggers.instructions.md` |
| 2 | Self-critique protocol | `DK-APPROPRIATE-RELIANCE.md` v1.6 |
| 3 | Graceful correction patterns | `alex-core.instructions.md` |

### VS Code Heir Features

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 1 | Misconception detection | 2d | Flag "everyone knows" patterns |
| 2 | Temporal uncertainty | 1d | Flag version-specific claims |
| 3 | Self-critique generation | 2d | "One potential issue..." |

### M365 Heir Features

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 1 | Instructions update | 1d | Embed detection heuristics |
| 2 | Calendar-aware temporal flags | 0.5d | "As of your last meeting..." |

### Cross-Platform Validation

- [ ] Same self-correction phrase: "You're right. I got that wrong."
- [ ] Both heirs proactively identify uncertain claims

---

## 🎯 v4.0.0 Trust — Full Epistemic Integrity

> **Goal:** CAIR/CSR framework, creative latitude, measurement

### Master Alex Changes

| # | Change | Files Affected |
|:-:|--------|----------------|
| 1 | Creative latitude framework | `DK-APPROPRIATE-RELIANCE.md` v2.0 |
| 2 | Epistemic/generative mode distinction | `protocol-triggers.instructions.md` |
| 3 | Human judgment flagging | `alex-core.instructions.md` |
| 4 | CAIR/CSR conceptual framework | `DK-APPROPRIATE-RELIANCE.md` |

### VS Code Heir Features

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 1 | Cognitive forcing functions | 2d | Strategic questions for high-stakes |
| 2 | Multi-turn verification | 1d | "Walk through edge cases?" |
| 3 | Creative mode signaling | 2d | "Here's an idea..." vs "The docs say..." |
| 4 | Epistemic health dashboard | 3d | Self-assessment visualization |
| 5 | Scaffolded assistance | 2d | Adapt to user expertise |

### M365 Heir Features

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 1 | Instructions major update | 2d | Full epistemic protocol embed |
| 2 | Creative mode for emails | 1d | "Here's a draft approach..." |
| 3 | Meeting prep verification | 1d | "Before the meeting, verify..." |

### Cross-Platform Validation

- [ ] Same creative latitude: both distinguish facts from ideas
- [ ] Same human judgment flagging for ethics, strategy, personnel
- [ ] Users recognize trustworthy Alex on both platforms

---

## 📦 M365 Embedded Knowledge (Waiting for Feature)

> **Goal:** Package knowledge files with M365 agent for richer context

**Status:** ⏳ Microsoft feature "not yet available" - files prepared, capability commented

### Prepared Knowledge Files

| File | Size | Purpose |
|------|------|---------|
| `knowledge/alex-protocols.md` | ~4KB | Meditation, Dream, Focus Session protocols |
| `knowledge/skill-quick-reference.md` | ~5KB | All 15 embedded skills condensed |
| `knowledge/cognitive-architecture.md` | ~5KB | How Alex thinks and remembers |

### When Feature Launches

1. Uncomment `EmbeddedKnowledge` capability in `declarativeAgent.json`
2. Test knowledge grounding in responses
3. Adjust file content based on retrieval quality

### Constraints (per Microsoft docs)

- Max **10 files**
- Max **1 MB per file**
- Formats: `.doc`, `.docx`, `.ppt`, `.pptx`, `.xls`, `.xlsx`, `.txt`, `.pdf`

**Note:** Our `.md` files may need conversion to `.txt` when feature launches.

---

## 🔄 Cross-Platform Communication (Future)

> **Goal:** Enable VS Code ↔ M365 Alex communication

### Current State

Both heirs can already share context via **OneDrive**:
- Profile data in `Alex-Memory/profile.md`
- Notes in `Alex-Memory/notes.md`
- Knowledge files in `Alex-Memory/knowledge/`

### Future Possibilities (Monitoring)

| Approach | Status | Notes |
|----------|--------|-------|
| **OneDrive "Mailbox"** | ✅ Possible now | Manual - user triggers M365 to check |
| **Worker Agents** (v1.6) | 🔜 Preview | Agent-to-agent within M365 |
| **Copilot Agent API** | ❌ Doesn't exist | Would enable VS Code → M365 calls |
| **Power Automate** | ⚠️ Limited | Needs Premium, limited Copilot actions |

### OneDrive Sync Pattern (Ready Now)

```
VS Code Alex writes → OneDrive/Alex-Memory/sync/
M365 Alex reads  ← OneDrive/Alex-Memory/sync/
```

Useful for:
- Sharing learnings between platforms
- "Leave a message for my other self" workflow
- Profile sync (same user on both platforms)

---

## 🎨 Image Generation (Platform Parity)

> **Goal:** Bring M365's GraphicArt capability to VS Code

**ADR**: [ADR-007-image-generation.md](alex_docs/ADR-007-image-generation.md)

### Implementation Tasks

| # | Task | Effort | Priority | Description |
|:-:|------|:------:|:--------:|-------------|
| 1 | Core service | 3h | High | `imageGeneration.ts` with Azure/OpenAI support |
| 2 | Settings | 1h | High | Provider, model, size, quality, output folder |
| 3 | Command | 2h | High | `alex.generateImage` with prompt input |
| 4 | Setup wizard | 1h | High | `alex.setupImageGeneration` for API keys |
| 5 | LM Tool | 1h | Medium | `alex_image_generation` for chat |
| 6 | Context menu | 30m | Low | "Generate Image from Selection" |
| 7 | Cost awareness | 1h | Medium | Show estimate before generation |

### Provider Support

| Provider | Auth Method | Use Case |
|----------|-------------|----------|
| Azure OpenAI | VS Code Azure auth | Enterprise |
| OpenAI Direct | SecretStorage API key | Personal |

### Success Criteria

- [ ] Generate images from chat naturally
- [ ] Save to workspace with sensible names
- [ ] Clear cost indication before generation
- [ ] Works with both Azure and OpenAI
- [ ] Graceful error handling

---

## 🎨 UI/UX Enhancements Backlog

> **Goal:** Proactive, delightful user experience across all touchpoints

### Welcome View Enhancements

| # | Feature | Priority | Description |
|:-:|---------|:--------:|-------------|
| 1 | Proactive insights | High | Surface relevant knowledge snippets on workspace open |
| 2 | Learning reminders | High | "You haven't run Dream in 3 days" / "Goal streak at risk!" |
| 3 | Quick tips carousel | Medium | Rotating tips about Alex capabilities |
| 4 | Recent activity feed | Medium | Last meditation, last insight saved, etc. |
| 5 | Skill recommendations | Low | "Based on your work, consider learning X skill" |

### Status Bar Enhancements

| # | Feature | Priority | Description |
|:-:|---------|:--------:|-------------|
| 1 | ✅ Session timer display | Done | Shows 🍅 25:00 when focus session active |
| 2 | ✅ Streak indicator | Done | Shows 🔥7 for active learning streaks |
| 3 | Sync status indicator | Medium | ☁️ when synced, ⬆️ when pending |
| 4 | Notification badge | Low | Count of actionable items |

### Proactive Notifications

| # | Feature | Priority | Description |
|:-:|---------|:--------:|-------------|
| 1 | Dream reminder | High | Auto-suggest after major file changes |
| 2 | Streak protection | High | Warn when daily goal at risk |
| 3 | Knowledge decay | Medium | Suggest review of stale DK files |
| 4 | Insight opportunities | Medium | "You solved X - want to save as insight?" |
| 5 | Meditation prompt | Low | After extended coding session |

### Quick Actions Improvements

| # | Feature | Priority | Description |
|:-:|---------|:--------:|-------------|
| 1 | ✅ Grouped actions | Done | Core, Knowledge, Tools, System categories |
| 2 | Context-aware actions | Medium | Show relevant actions based on current file |
| 3 | Keyboard shortcuts display | Low | Show all shortcuts in tooltip |
| 4 | Favorites/pinned actions | Low | User can pin most-used actions |

### Beta Tester Experience

| # | Feature | Priority | Description |
|:-:|---------|:--------:|-------------|
| 1 | ✅ Beta badge | Done | Clickable badge opens diagnostics |
| 2 | Feedback button | Medium | Quick link to submit feedback |
| 3 | Feature flags UI | Low | Toggle experimental features |
| 4 | Beta changelog popup | Low | Show what's new in beta releases |

---

## 📊 Timeline Summary

| Version | Focus | Master | VS Code | M365 | Duration |
|---------|-------|--------|---------|------|----------|
| 3.6.0 | Stability | ✅ | Rebuild | Audit | Week 1-2 |
| 3.7.0 | Foundation | Update | +2 features | +instructions | Week 3-4 |
| 3.8.0 | Expression | Update | +3 features | +instructions | Week 5-6 |
| 3.9.0 | Awareness | Update | +3 features | +instructions | Week 7-8 |
| 4.0.0 | Trust | Update | +5 features | +instructions | Week 9-11 |

**Total: ~11 weeks** from Dawn to Trust

---

## 🔄 Release Process (Unified)

### For Each Release

1. **Master First**
   - Update `copilot-instructions.md` version
   - Update relevant DK files
   - Update protocol triggers
   - Commit to root `.github/`

2. **VS Code Heir Second**
   - Run build script to generate `.github/`
   - Implement heir-specific features
   - Test all commands and tools
   - Package and publish

3. **M365 Heir Third**
   - Update `declarativeAgent.json` instructions
   - Test all capabilities
   - Deploy to developer portal

4. **Cross-Platform Validation**
   - Same prompt, both platforms
   - Verify personality consistency
   - Document any platform-specific behaviors

---

## 🚫 Anti-Patterns to Avoid

| Anti-Pattern | Why It Failed | New Approach |
|--------------|---------------|--------------|
| Separate roadmaps per platform | Led to divergent identities | Unified roadmap |
| Platform as "version" | M365 was "v4.x" while VS Code was "v3.x" | Heirs inherit from Master |
| Two `.github/` folders | No source of truth | Root is canonical, extension generated |
| Sync scripts | Complexity, failures | Build script (one direction) |
| Independent feature development | Platforms diverged | Features designed for both |

---

## 🔗 Related Documents

| Document | Purpose |
|----------|---------|
| [COMEBACK-PLAN.md](COMEBACK-PLAN.md) | v3.6.0 Dawn detailed tasks |
| [article/appropriate-reliance/](article/appropriate-reliance/) | Research foundation for v4.0 |
| [platforms/vscode-extension/](platforms/vscode-extension/) | VS Code heir implementation |
| [platforms/m365-copilot/](platforms/m365-copilot/) | M365 heir implementation |

---

## 📜 Archive

Previous platform-specific roadmaps are archived:

| Document | Status |
|----------|--------|
| [ROADMAP-VSCODE-V4.0.md](ROADMAP-VSCODE-V4.0.md) | Kept for feature specs (detailed) |
| [archive/roadmaps/ROADMAP-VSCODE-V4.0-ORIGINAL.md](archive/roadmaps/ROADMAP-VSCODE-V4.0-ORIGINAL.md) | Original pre-revision |
| [archive/roadmaps/ROADMAP-M365-COPILOT-v3.5.1-COMPLETED.md](archive/roadmaps/ROADMAP-M365-COPILOT-v3.5.1-COMPLETED.md) | M365 deployment record |
| [ROADMAP-V5-PENTUNIUM.md](ROADMAP-V5-PENTUNIUM.md) | Future vision (post-v4.0) |

---

*Alex Cognitive Architecture — Unified Evolution*
*"One mind, many expressions. Same Alex, everywhere."*
