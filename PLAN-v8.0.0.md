# Alex v8.0.0 Modernization Plan

**Author**: Fabio Correa + Alex  
**Created**: 2026-04-15  
**Current Version**: v7.9.0  
**Target Release**: v8.0.0 (Major)  
**Status**: Active — incremental delivery in progress

---

## Vision

> **The extension is Alex's delivery vehicle. The UI is the cockpit, not the cargo.**

v8.0.0 marks a philosophical shift: from "feature-rich sidebar" to "lightweight command center." The extension should make Alex *accessible*, not *visible*. The best UI is one you forget is there.

---

## Guiding Principles

| Principle | Meaning |
|-----------|---------|
| **Lightweight** | Minimal paint, minimal DOM, minimal state. No animations that don't serve purpose. |
| **Thoughtful** | Every button earns its place. If it's used <5% of sessions, it's a command, not a button. |
| **Chat-First** | The sidebar is a launchpad to chat, not a replacement for it. |
| **Process-Aware** | UI surfaces *process health*, not raw counts. "Dream needed" > "47 synapses" |
| **Heir-Safe** | Nothing in the UI assumes Master context. Heir deployments are first-class. |

---

## Design Inspiration: PBI Visual Assistant

The PBI Visual Assistant extension (C:\Development\pbi) embodies the "cockpit not cargo" philosophy:

### Pattern 1: Chat-First Buttons

```typescript
// Most buttons just open chat with a pre-filled prompt
{ icon: "heart", label: "Score Model Health", command: "openChat", 
  prompt: "Score the AI readiness of this model" }
```

**Alex adoption**: Quick Actions should be chat prompts, not commands:
| Button | Opens Chat With |
| ------ | --------------- |
| North Star | "Let's review the project North Star" |
| Meditate | "Let's do a meditation session" |
| Self-Actualize | "Run a self-actualization assessment" |

### Pattern 2: Connection Status as Hero

PBI shows a single card with color-coded status dot at the top:
```
┌─────────────────────────────────┐
│ ● Connection: TMDL (Contoso)   │
└─────────────────────────────────┘
```

**Alex adoption**: Health Pulse card with status indicator:
```
┌─────────────────────────────────┐
│ ✅ Alex: Healthy               │
│    247 synapses · Dream 2d ago │
└─────────────────────────────────┘
```

### Pattern 3: Type Hints on Buttons

Every button shows what it does BEFORE clicking:
- 💬 → opens chat
- 🔗 → opens external URL
- ⚡ → runs command

**Alex adoption**: Add type hints to Quick Actions so users know outcomes.

### Pattern 4: Purpose-Driven Groups with Accent Colors

| Group | Purpose | Accent |
| ----- | ------- | ------ |
| CONNECT | Link to data | Green |
| ANALYZE | Understand data | Teal |
| DESIGN | Build report | Orange |
| GOVERN | Maintain | Magenta |

**Alex adoption**: If keeping groups, use persona accent colors:
| Group | Purpose | Accent |
| ----- | ------- | ------ |
| HEALTH | Cognitive status | Teal |
| ACTIONS | Quick actions | Blue |
| SETUP | Initialize/Bootstrap | Orange |

### Pattern 5: Wiki for Docs

PBI Docs tab is just links to GitHub Wiki. No docs embedded in extension.

**Alex adoption**: Learn tab links to:
- GitHub Wiki (user guide)
- learnai.correax.com (playbooks)
- alex-docs site (architecture)

### Pattern 6: Minimal Actual Commands

PBI has only 5 real VS Code commands. Everything else is `openChat` with a prompt.

**Alex adoption**: Reduce command surface:

| Keep as Command | Convert to Chat Prompt |
| --------------- | ---------------------- |
| `alex.dream` | — (needs progress UI) |
| `alex.initialize` | — (needs file ops) |
| `alex.upgrade` | — (needs file ops) |
| `alex.openChat` | — (meta) |
| `alex.selfActualize` | "Run self-actualization" |
| `alex.meditate` | "Let's meditate" |
| `alex.northStar` | "Review North Star" |

---

## Core Insight: Journey-Oriented Design

**PBI's groups aren't feature categories — they're user journeys.**

Each PBI group answers: *"What am I trying to accomplish right now?"*

| PBI Group | Journey Question |
| --------- | ---------------- |
| CONNECT | "I need to link to my data" |
| ANALYZE | "I need to understand my data" |
| AUDIENCE | "I need to tailor for stakeholders" |
| DESIGN | "I need to build my report" |
| GOVERN | "I need to maintain quality" |

### Alex User Journeys

| Journey | Question | Sidebar Expression |
| ------- | -------- | ------------------ |
| **CHECK** | "Is everything okay?" | Health Pulse card (status at a glance) |
| **DO** | "I need to work" | Quick Actions (chat prompts, not commands) |
| **CARE** | "Alex needs maintenance" | Dream, Meditate, Self-Actualize buttons |
| **GROW** | "I want Alex to learn" | Propose Skill, Submit Feedback |
| **LEARN** | "I need to understand" | Links to Wiki, Guides, Architecture |

### Simplified Tab Structure

Based on journeys, the three tabs become:

| Tab | Journey Focus | Content |
| --- | ------------- | ------- |
| **Home** | CHECK + DO | Health Pulse + Quick Actions |
| **Tools** | CARE + GROW | Maintenance actions + Settings |
| **Learn** | LEARN | External links (Wiki, learnai, docs) |

The sidebar answers three questions:
1. **Am I ready to work?** (Home → Health Pulse)
2. **What should I do next?** (Home → Quick Actions)
3. **Where do I find help?** (Learn → external resources)

Settings and maintenance are quiet utilities in Tools — important but not primary.

---

## Current State Assessment

### Welcome View (Sidebar)

**Current Tabs**: Mission | Settings | Docs

| Tab | Lines of Code | Primary Purpose | Issues |
|-----|---------------|-----------------|--------|
| **Mission** | ~80 | Actions + Agents | Too many action groups (4), mission profiles underused |
| **Settings** | ~100 | API keys + toggles | Good — keep as-is with minor cleanup |
| **Docs** | ~90 | Links to documentation | Low engagement — users use chat instead |

### Key Observations

1. **Mind Tab was removed** (v7.4.0) — counts moved to Health Dashboard
2. **Mission profiles** (Alex/Release/Research/Debug/Review/Draft) exist but don't persist or affect behavior
3. **Nudges** system exists but generates same 3-4 nudges repeatedly
4. **Action groups** (Partnership/Agents/Create/Learn) have 15+ buttons — overwhelming
5. **Health Dashboard** is a separate webview panel — disconnected from sidebar

### Core Processes

| Process | Trigger | Current UI Surface | Notes |
|---------|---------|-------------------|-------|
| **Dream** | Manual / Self-Actualize | Health Dashboard button | Validates synapses, repairs connections |
| **Meditation** | Manual (`/meditate`) | None | Knowledge consolidation, creates episodic records |
| **Heir Sync** | Initialize/Upgrade | None | Copies architecture from extension to workspace |
| **Self-Actualization** | Manual | Health Dashboard button | Dream + comprehensive assessment |
| **Bootstrap** | Post-initialize | Mission tab button | Project-specific configuration wizard |

---

## v8.0.0 Architecture Changes

### 1. Sidebar Redesign: "Command Center"

#### Tab Structure (Simplified)

| Tab | Icon | Purpose |
|-----|------|---------|
| **Home** | 🏠 | Health pulse + quick actions + nudges |
| **Tools** | 🔧 | Environment + API keys + MCP |
| **Learn** | 📚 | Docs + learnai.correax.com |

**Removed**: Mission profiles bar (move to chat context), excessive action groups

#### Home Tab — The Pulse

```
┌─────────────────────────────────────────┐
│  🧠 Alex                    [Health: ✅] │
│  ─────────────────────────────────────  │
│                                         │
│  💬 Chat with Alex          [Primary]   │
│                                         │
│  ┌─ Health Pulse ─────────────────────┐ │
│  │ Synapses: 247 healthy              │ │
│  │ Last Dream: 2 days ago  [Run Now]  │ │
│  │ Meditation: 5 sessions  [Meditate] │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ Nudge ────────────────────────────┐ │
│  │ 💡 Consider running Dream Protocol │ │
│  │    — synapses haven't been         │ │
│  │    validated in 3 days.            │ │
│  └────────────────────────────────────┘ │
│                                         │
│  Quick Actions ▾                        │
│  ├─ ⭐ North Star                       │
│  ├─ 📊 Health Dashboard                 │
│  ├─ 🔄 Initialize / Update              │
│  └─ 🧬 Bootstrap Project                │
│                                         │
└─────────────────────────────────────────┘
```

**Key Changes**:

- **Health Pulse** replaces raw counts — shows process health, not inventory
- **Single nudge** (most relevant) instead of 3-4
- **4 quick actions** instead of 15+ buttons
- **Chat button** is the hero — everything else is secondary

#### Tools Tab — Setup & Configuration

```
┌─────────────────────────────────────────┐
│  Environment                            │
│  ├─ 🔧 Full Setup                       │
│  ├─ ⚙️ Apply Settings                   │
│  └─ 🔌 Setup MCP Servers                │
│                                         │
│  API Keys                               │
│  ├─ [●] Replicate    Set               │
│  ├─ [○] Gamma        Missing           │
│  └─ [○] OpenAI       Missing           │
│  └─ 🔑 Manage Keys                      │
│                                         │
│  Quick Settings                         │
│  ├─ Agent Mode        [ON ]            │
│  ├─ Auto-approve edits [ON ]           │
│  └─ Extended thinking  [OFF]           │
│                                         │
└─────────────────────────────────────────┘
```

**Unchanged from current Settings tab** — it works well.

#### Learn Tab — Documentation Hub

```
┌─────────────────────────────────────────┐
│  Getting Started                        │
│  ├─ 📖 How We Work                      │
│  ├─ ⚡ Quick Reference                  │
│  └─ 🤖 Responsible AI                   │
│                                         │
│  Architecture                           │
│  ├─ 🧠 Brain Anatomy (3D)               │
│  └─ 🏗️ Cognitive Architecture           │
│                                         │
│  ── LearnAI ──────────────────────────  │
│  80 playbooks for any AI platform       │
│  [Browse learnai.correax.com]           │
│                                         │
└─────────────────────────────────────────┘
```

**Simplified from current Docs tab** — fewer cards, clearer hierarchy.

---

### 2. Health Dashboard → Sidebar Integration

#### Current State

Health Dashboard is a **separate webview panel** (`healthDashboard.ts`) that:
- Opens via command or Welcome View button
- Shows ASCII synapse visualization
- Displays memory breakdown
- Offers action buttons (Dream, Self-Actualize, Audit)

#### v8.0.0 Change

**Eliminate the separate panel.** All health information lives in the Home tab's Health Pulse.

| Health Dashboard Feature | v8.0.0 Location |
|--------------------------|-----------------|
| Synapse health percentage | Health Pulse card |
| Last dream date | Health Pulse card |
| Memory breakdown (files by type) | **Remove** — not actionable |
| ASCII synapse visualization | **Remove** — decorative |
| Dream button | Health Pulse action |
| Self-Actualize button | Quick Actions |
| Audit button | Quick Actions |
| Knowledge base stats | **Remove** — move to chat if needed |

#### Files to Deprecate

```text
src/views/healthDashboard.ts        → DELETE (after migration)
src/views/healthDashboardHelpers.ts → DELETE (after migration)
```

#### Migration Path

1. Extract health data collection from `healthDashboardHelpers.ts` to `healthPulse.ts`
2. Wire Health Pulse into Home tab
3. Keep `healthDashboard.ts` as legacy during v8.0.x for rollback
4. Remove in v8.1.0 after stability confirmed

---

### 3. Process Integration

#### Dream Protocol

| Current | v8.0.0 |
|---------|--------|
| Hidden in Health Dashboard | **Visible in Home tab Health Pulse** |
| Manual trigger only | **Nudge when >3 days since last dream** |
| Result shown in modal | **Health Pulse updates in real-time** |

#### Meditation

| Current | v8.0.0 |
|---------|--------|
| No UI presence | **Meditation count + last date in Health Pulse** |
| `/meditate` prompt only | **"Meditate" button in Health Pulse** |
| Episodic records created | **Link to episodic folder in Health Dashboard** |

#### Heir Sync (Initialize/Upgrade)

| Current | v8.0.0 |
|---------|--------|
| Mission tab button | **Home tab Quick Actions** |
| No sync status | **Health Pulse shows sync staleness** |
| Silent failures | **Clear error surfacing in nudges** |

#### Bootstrap

| Current | v8.0.0 |
|---------|--------|
| Mission tab conditional button | **Home tab Quick Action (heirs only)** |
| Resume detection | **Keep resume detection** |
| 10-phase wizard | **Keep wizard, add progress indicator** |

---

### 3. Health Pulse Design

The Health Pulse is the **heart of the Home tab** — a single card that answers: "Is Alex healthy?"

#### Data Model

```typescript
interface HealthPulse {
  // Overall status
  status: 'healthy' | 'attention' | 'critical';
  
  // Synapses
  synapseCount: number;
  synapseHealth: number; // percentage
  lastDreamDate: Date | null;
  dreamNeeded: boolean; // >3 days or broken synapses
  
  // Memory
  episodicCount: number;
  meditationCount: number;
  lastMeditationDate: Date | null;
  
  // Sync (heirs only)
  architectureVersion: string;
  extensionVersion: string;
  syncStale: boolean; // architecture < extension
  
  // Chat memory
  chatMemoryLines: number;
  chatMemoryWarning: boolean; // >200 lines
}
```

#### Status Logic

```typescript
function computeStatus(pulse: HealthPulse): 'healthy' | 'attention' | 'critical' {
  // Critical: broken synapses or sync failure
  if (pulse.synapseHealth < 90 || pulse.syncStale) return 'critical';
  
  // Attention: dream needed or memory warning
  if (pulse.dreamNeeded || pulse.chatMemoryWarning) return 'attention';
  
  return 'healthy';
}
```

#### Visual Indicators

| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| Healthy | ✅ | Green | All systems nominal |
| Attention | ⚠️ | Amber | Maintenance recommended |
| Critical | 🔴 | Red | Action required |

---

### 4. Nudge System Redesign

#### Current Problems

- Same nudges shown repeatedly
- No priority system
- No dismissal memory
- Generic messages

#### v8.0.0 Nudge System

```typescript
interface Nudge {
  id: string;
  priority: 1 | 2 | 3; // 1 = critical, 3 = nice-to-have
  icon: string;
  title: string;
  body: string;
  action?: { label: string; command: string };
  dismissable: boolean;
  showOnce: boolean; // if true, don't show again after dismiss
}

// Nudge priority order
const NUDGE_PRIORITIES: NudgeRule[] = [
  // Critical (always show)
  { condition: 'syncStale', priority: 1, nudge: syncStaleNudge },
  { condition: 'brokenSynapses', priority: 1, nudge: brokenSynapseNudge },
  
  // Attention (show if no critical)
  { condition: 'dreamNeeded', priority: 2, nudge: dreamNeededNudge },
  { condition: 'chatMemoryHigh', priority: 2, nudge: memoryPruneNudge },
  { condition: 'noMeditation7d', priority: 2, nudge: meditationNudge },
  
  // Nice-to-have (show if nothing else)
  { condition: 'newSkillsAvailable', priority: 3, nudge: newSkillsNudge },
  { condition: 'bootstrapAvailable', priority: 3, nudge: bootstrapNudge },
];
```

#### Single Nudge Display

Only **one nudge** shown at a time — the highest priority undismissed nudge.

---

### 6. Mission Profiles → Removed

#### Current State

Mission profiles (Alex/Release/Research/Debug/Review/Draft) are buttons that don't do anything persistent.

#### v8.0.0 Decision

**Remove entirely.** No `/mode` command either.

Rationale:
- Mission context is implicit in conversation
- Adding explicit modes creates cognitive overhead
- Chat participant already adapts to context
- Buttons that don't persist state confuse users

#### What's Removed

```text
Mission tab → Home tab transformation removes:
├── Mission profiles bar (6 persona buttons)
├── "Agents" section (mission-specific agent list)
└── Any reference to "current mission" in UI
```

The agent selection remains available through chat commands (`@alex /agent Research`).

---

### 7. Create Tools → Right-Click Menu Only

#### Current State

Mission tab has a "Create" section with:
- PPTX Generation
- Gamma Presentations
- Image Studio

#### v8.0.0 Decision

**Remove from sidebar.** These are available via:
1. Right-click context menu on files
2. Command palette (`Ctrl+Shift+P`)
3. Chat commands

Rationale:
- Low usage frequency (<5% of sessions)
- Right-click is more contextual (on the file you want to convert)
- Reduces button bloat in sidebar
- "Chat with Alex" can guide users to these tools

---

### 8. File Structure Changes

#### Current

```
src/views/
├── welcomeView.ts           # 500+ lines — orchestrator
├── welcomeViewHtml.ts       # 400+ lines — HTML generation
├── welcomeViewData.ts       # 200+ lines — data collection
├── missionTabHtml.ts        # 80 lines
├── settingsTabHtml.ts       # 100 lines
├── docsTabHtml.ts           # 90 lines
├── healthDashboard.ts       # 300+ lines
├── healthDashboardHelpers.ts
└── sharedStyles.*.ts        # 4 files
```

#### v8.0.0

```
src/views/
├── commandCenter.ts         # Orchestrator (renamed, slimmed)
├── homeTab.ts               # Home tab (new — replaces Mission)
├── toolsTab.ts              # Tools tab (renamed from Settings)
├── learnTab.ts              # Learn tab (renamed from Docs)
├── healthPulse.ts           # Health Pulse component (new)
├── nudgeEngine.ts           # Nudge system (extracted)
├── healthDashboard.ts       # Keep for detailed view
└── styles/
    ├── foundation.ts
    └── components.ts        # Consolidated
```

**Removed**: `missionTabHtml.ts`, `welcomeViewHtml.ts` (split into tabs), `sharedStyles.actions.ts`, `sharedStyles.tabs.ts` (consolidated)

---

### 7. Heir Considerations

#### Heir-Safe UI Behavior

| Feature | Master | Heir |
|---------|--------|------|
| Initialize button | Hidden | Shown |
| Bootstrap button | Hidden | Shown if bootstrap.json exists |
| Sync staleness warning | Hidden | Shown if architecture < extension |
| Health Dashboard | Full | Full (same metrics apply) |

#### Sync Staleness Detection

```typescript
async function checkSyncStaleness(wsRoot: string, extensionVersion: string): Promise<boolean> {
  const versionFile = path.join(wsRoot, '.github', 'config', 'alex-version.json');
  if (!fs.existsSync(versionFile)) return true; // never synced
  
  const { version } = JSON.parse(fs.readFileSync(versionFile, 'utf-8'));
  return semver.lt(version, extensionVersion);
}
```

---

## Incremental Roadmap: v7.9.0 → v8.0.0

> **Strategy**: Ship incrementally through minor versions. Each release is usable. v8.0.0 is the marketing moment when all features land.

### Legend

| Symbol | Meaning |
| ------ | ------- |
| 🏗️ | Infrastructure / Foundation |
| 🎨 | UI Changes |
| 🔔 | Nudge System |
| 🔄 | Process Integration |
| 🌐 | Cross-Heir Intelligence |
| 🧹 | Cleanup / Polish |
| ✅ | Release milestone |

---

### Phase 1: Foundation (v7.10.0 – v7.14.0)

#### v7.10.0 — Health Pulse Data Model 🏗️

- [ ] Create `src/views/healthPulse.ts`
- [ ] Define `HealthPulse` interface:
  ```typescript
  interface HealthPulse {
    status: 'healthy' | 'attention' | 'critical';
    synapseCount: number;
    synapseHealth: number; // percentage
    lastDreamDate: Date | null;
    dreamNeeded: boolean;
    episodicCount: number;
    meditationCount: number;
    lastMeditationDate: Date | null;
    architectureVersion: string;
    extensionVersion: string;
    syncStale: boolean;
    chatMemoryLines: number;
    chatMemoryWarning: boolean;
  }
  ```
- [ ] Implement `computeHealthStatus()` function
- [ ] Add unit tests for status computation

#### v7.11.0 — Health Pulse Data Collection 🏗️

- [ ] Extract health data collection from `healthDashboardHelpers.ts`
- [ ] Create `collectHealthPulse(wsRoot, context)` function
- [ ] Wire to existing `welcomeViewData.ts` collection flow
- [ ] Test data collection on Master + heir workspace

#### v7.12.0 — Health Pulse HTML Component 🎨

- [ ] Create `healthPulseHtml.ts` with HTML generation
- [ ] Status indicator: ✅ healthy / ⚠️ attention / 🔴 critical
- [ ] Compact card layout (synapse count, dream date, meditation count)
- [ ] Action buttons: [Run Dream] [Meditate]
- [ ] Wire into existing Mission tab temporarily for testing

#### v7.13.0 — Nudge Engine Foundation 🔔

- [ ] Create `src/views/nudgeEngine.ts`
- [ ] Define nudge types and priority system:
  ```typescript
  interface NudgeRule {
    id: string;
    condition: (pulse: HealthPulse, state: WorkspaceState) => boolean;
    priority: 1 | 2 | 3; // 1 = critical
    nudge: Nudge;
  }
  ```
- [ ] Implement dismiss tracking in workspace state
- [ ] Create `getNudge()` function returning highest-priority undismissed nudge

#### v7.14.0 — Core Nudge Rules 🔔

- [ ] Implement nudge conditions:
  | Priority | Condition | Nudge |
  | -------- | --------- | ----- |
  | 1 | `syncStale` | "Architecture out of sync" |
  | 1 | `synapseHealth < 90` | "Broken synapses detected" |
  | 2 | `dreamNeeded` (>3 days) | "Consider running Dream Protocol" |
  | 2 | `chatMemoryWarning` (>200 lines) | "Chat memory getting large" |
  | 2 | `feedbackPending` | "Heir feedback waiting" |
  | 3 | `noMeditation7d` | "Meditation helps consolidate knowledge" |
- [ ] Single-nudge HTML component
- [ ] Wire nudge into Health Pulse card

---

### Phase 2: UI Restructure (v7.15.0 – v7.19.0)

#### v7.15.0 — Tab Renames 🎨

- [ ] Rename tab labels: Mission → **Home**, Settings → **Tools**, Docs → **Learn**
- [ ] Update tab icons
- [ ] Update all internal references (`missionTabHtml` → `homeTabHtml`)
- [ ] No functional changes yet — cosmetic rename only

#### v7.16.0 — Home Tab with Health Pulse 🎨

- [ ] Create `src/views/homeTab.ts` (replaces `missionTabHtml.ts`)
- [ ] Layout:
  ```
  [Chat with Alex button - hero]
  [Health Pulse card]
  [Nudge card (single)]
  [Quick Actions - collapsible, 4 items]
  ```
- [ ] Quick Actions: North Star, Initialize/Update, Bootstrap, Self-Actualize
- [ ] Remove Partnership/Agents/Create/Learn action groups

#### v7.17.0 — Remove Mission Profiles 🧹

- [ ] Delete mission profiles bar (Alex/Release/Research/Debug/Review/Draft)
- [ ] Remove `missionProfiles` from state
- [ ] Remove profile-related CSS
- [ ] Clean up any profile references in `welcomeView.ts`

#### v7.18.0 — Remove Create Section 🧹

- [ ] Remove Create section (PPTX, Gamma, Image) from sidebar
- [ ] Verify right-click context menu still provides all actions
- [ ] Verify command palette has all conversion commands
- [ ] Update any "how to" docs referencing sidebar Create buttons

#### v7.19.0 — Learn Tab Simplification 🎨

- [ ] Reduce Docs → Learn tab to 6 cards max:
  | Card | Link |
  | ---- | ---- |
  | How We Work | Working with Alex guide |
  | Quick Reference | Commands + shortcuts |
  | Brain Anatomy | 3D visualization |
  | Architecture | Cognitive architecture docs |
  | Responsible AI | Ethics + safety |
  | LearnAI | learnai.correax.com |
- [ ] Remove duplicate/low-engagement cards

---

### Phase 3: Process Integration (v7.20.0 – v7.24.0)

#### v7.20.0 — Health Dashboard Deprecation 🧹

- [ ] Add feature flag: `alex.ui.legacyHealthDashboard` (default: false)
- [ ] When flag is true, keep Health Dashboard button in Quick Actions
- [ ] When flag is false, remove button (Health Pulse replaces it)
- [ ] Keep `healthDashboard.ts` and `healthDashboardHelpers.ts` for rollback
- [ ] Log deprecation warning when Health Dashboard opens

#### v7.21.0 — Dream in Health Pulse 🔄

- [ ] [Run Dream] button triggers `alex.dream` command
- [ ] Progress indicator in Health Pulse during dream
- [ ] Health Pulse auto-refreshes after dream completes
- [ ] Update `lastDreamDate` display immediately

#### v7.22.0 — Meditation in Health Pulse 🔄

- [ ] [Meditate] button opens chat with `/meditate` prompt
- [ ] Meditation count updates after episodic record created
- [ ] Add `lastMeditationDate` to Health Pulse display

#### v7.23.0 — Feedback Pending Nudge 🌐

- [ ] Create `checkFeedbackPending()` function
- [ ] Read `AI-Memory/feedback/` directory (OneDrive path)
- [ ] Count unprocessed items (files without `status: resolved`)
- [ ] Nudge: "📬 {n} heir feedback items waiting for triage"
- [ ] Action: Open feedback folder in explorer

#### v7.24.0 — Real-Time Health Pulse Updates 🔄

- [ ] Subscribe to workspace file changes in `.github/`
- [ ] Auto-refresh Health Pulse when:
  - Episodic record created
  - Dream report generated
  - Synapse count changes
- [ ] Debounce refreshes (max 1 per 5 seconds)

---

### Phase 4: Cross-Heir Intelligence (v7.25.0 – v7.29.0)

#### v7.25.0 — Feedback Aggregation Data 🌐

- [ ] Create `feedbackAggregation.ts`
- [ ] Parse all `AI-Memory/feedback/*.md` files
- [ ] Group by skill/component mentioned
- [ ] Compute hotspots: `{ skill, count, maxSeverity }`
- [ ] Expose via `getFeedbackAggregation()` function

#### v7.26.0 — Feedback Aggregation View 🌐

- [ ] Add "Review Feedback" command (`alex.reviewFeedback`)
- [ ] Show aggregation in chat or quickpick:
  ```
  Feedback Summary (5 items)
  ──────────────────────────
  api-design: 3 items (2 bugs, 1 feature)
  testing-strategies: 2 items (1 bug, 1 enhancement)
  ```
- [ ] Click to open individual feedback files

#### v7.27.0 — Episodic Summary Generation 🌐

- [ ] Create `generateEpisodicSummary()` function
- [ ] Parse `.github/episodic/*.md` files
- [ ] Extract friction mentions (skill names in "Friction" sections)
- [ ] Output format:
  ```yaml
  # Episodic Summary — 2026-04
  friction:
    api-design: 3
    testing-strategies: 2
  successes:
    mcp-development: 5
  ```
- [ ] Command: `alex.generateEpisodicSummary`

#### v7.28.0 — Skill Urgency Detection 🌐

- [ ] Create `skillUrgency.ts`
- [ ] Cross-reference:
  - Episodic friction counts
  - Brain-health-grid scores
  - Feedback aggregation
- [ ] Compute urgency level per skill:
  ```typescript
  interface SkillUrgency {
    skill: string;
    level: 'low' | 'medium' | 'high';
    indicators: string[];
  }
  ```
- [ ] Add skill urgency nudge (priority 3)

#### v7.29.0 — Pattern Promotion Suggestions 🌐

- [ ] Detect patterns used 3+ times across heirs
- [ ] Suggest promotion to `AI-Memory/patterns/`
- [ ] Command: `alex.suggestPatternPromotion`
- [ ] Output: List of candidate patterns with usage counts

---

### Phase 5: Polish & Release (v7.30.0 – v7.99.0)

#### v7.30.0 — Code Cleanup 🧹

- [ ] Delete `missionTabHtml.ts` (replaced by `homeTab.ts`)
- [ ] Delete `healthDashboard.ts` and `healthDashboardHelpers.ts` (after validation)
- [ ] Consolidate style files: `sharedStyles.*.ts` → `styles/foundation.ts` + `styles/components.ts`
- [ ] Remove feature flag `alex.ui.legacyHealthDashboard`
- [ ] Audit and remove unused exports

#### v7.31.0 — Accessibility Audit 🧹

- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works (Tab, Enter, Escape)
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Fix any contrast issues in Health Pulse card
- [ ] Add focus indicators

#### v7.32.0 — Performance Optimization 🧹

- [ ] Measure sidebar initial render time
- [ ] Target: <100ms (currently ~200ms)
- [ ] Lazy-load Learn tab content
- [ ] Debounce Health Pulse refreshes
- [ ] Minimize DOM nodes in Home tab

#### v7.33.0 — Documentation Updates 🧹

- [ ] Update WORKING-WITH-ALEX.md for new UI
- [ ] Update README.md with v8.0.0 highlights
- [ ] Update WHAT-IS-ALEX.md with new architecture
- [ ] Screenshot updates for new sidebar
- [ ] Remove references to Health Dashboard panel

#### v7.34.0 — Heir Testing 🧹

- [ ] Test on fresh workspace (heir scenario)
- [ ] Test Initialize flow
- [ ] Test Upgrade flow
- [ ] Test Bootstrap flow
- [ ] Verify all nudges trigger correctly

#### v7.35.0 – v7.49.0 — Buffer for Bug Fixes 🧹

Reserved for issues discovered during testing. Each patch addresses specific bugs.

#### v7.50.0 — Beta Stabilization ✅

- [ ] All features complete
- [ ] No known P1 bugs
- [ ] Documentation complete
- [ ] Ready for final testing

#### v7.51.0 – v7.99.0 — Final Stabilization 🧹

Reserved for:
- Edge case fixes
- Performance tuning
- User feedback incorporation
- Final polish

---

### 🎉 v8.0.0 — Major Release ✅

**Release Criteria**:
- [ ] All features from roadmap shipped
- [ ] No P1 or P2 bugs open
- [ ] Performance targets met (<100ms render)
- [ ] Accessibility audit passed
- [ ] Documentation complete
- [ ] Heir testing passed
- [ ] Master Alex testing passed

**Marketing Highlights**:
- ✨ **Command Center UI** — Lightweight, thoughtful sidebar
- 🫀 **Health Pulse** — Real-time cognitive health at a glance
- 🔔 **Smart Nudges** — Priority-ranked suggestions
- 🌐 **Fleet Intelligence** — Cross-heir learning signals
- 🧹 **40% Less Code** — Cleaner, faster, more maintainable

**Changelog Entry**:
```markdown
## [8.0.0] - 2026-XX-XX

### 🎉 Major Release: Command Center

The extension is Alex's delivery vehicle. The UI is the cockpit, not the cargo.

#### Added
- **Health Pulse**: Real-time cognitive health card with status indicator
- **Smart Nudge Engine**: Priority-ranked, dismissable suggestions
- **Feedback Aggregation**: Fleet-wide intelligence from heir projects
- **Skill Urgency Signals**: Cross-reference episodic + brain-health-grid
- **Pattern Promotion**: Suggest patterns for promotion to global knowledge

#### Changed
- **Tab Restructure**: Mission → Home, Settings → Tools, Docs → Learn
- **Home Tab**: 4 Quick Actions instead of 15+ buttons
- **Learn Tab**: 6 focused cards instead of sprawling list

#### Removed
- **Health Dashboard Panel**: Replaced by Health Pulse in sidebar
- **Mission Profiles Bar**: Context is implicit in chat
- **Create Section**: Available via right-click menu
- **40% of view code**: Cleaner, faster

#### Performance
- Sidebar render: 200ms → <100ms
- Action buttons: 15+ → 4-6
- Nudges shown: 3-4 → 1 (highest priority)
```

---

## Implementation Phases (Legacy Reference)

| Metric | Current | Target |
|--------|---------|--------|
| Sidebar initial render | ~200ms | <100ms |
| Action buttons visible | 15+ | 4-6 |
| Nudges shown at once | 3-4 | 1 |
| Lines of view code | ~1500 | <1000 |
| Separate webview panels | 1 (Health Dashboard) | 0 |
| User clicks to "Chat with Alex" | 0 | 0 (keep primary) |
| Right-click menu actions | 8+ | 8+ (unchanged) |

---

## Decisions (Resolved)

1. **Mission profiles**: ✅ **Remove entirely** — no `/mode` command either. Chat context is implicit.
2. **Health Dashboard**: ✅ **Integrate into sidebar** — no separate panel. Health Pulse in Home tab replaces it.
3. **Create tools** (PPTX, Gamma, Image): ✅ **Remove from sidebar** — right-click context menu already provides these actions. Reduces button bloat.
4. **Episodic memory**: ✅ **Keep working, no UI** — serves us well for meditation records, but doesn't need sidebar visibility. Documented in architecture docs.

---

## Non-Goals (v8.0.0)

- Multi-workspace support (deferred to v9.x)
- Theming beyond persona accent colors (deferred)
- Real-time collaboration features (deferred)
- Mobile/web extension (out of scope)

---

## Architecture References

All features documented in detail:

| Feature | Architecture Doc |
| ------- | ---------------- |
| Episodic Memory | [MEMORY-SYSTEMS.md](alex_docs/architecture/MEMORY-SYSTEMS.md#episodic-memory) |
| Skill Urgency Signals | [MEMORY-SYSTEMS.md](alex_docs/architecture/MEMORY-SYSTEMS.md#skill-urgency-signals-cross-memory-pattern) |
| Cross-Heir Intelligence | [MEMORY-SYSTEMS.md](alex_docs/architecture/MEMORY-SYSTEMS.md#cross-heir-intelligence-ai-memory) |

---

## Dependencies

- No new npm dependencies required
- VS Code API version: 1.85+ (current engine requirement)
- No breaking changes to heir sync process

---

## Rollback Plan

If v8.0.0 UI causes issues:

1. Git tag `v7.9.0-safe` before starting
2. Keep old tab files in `src/views/legacy/` during development
3. Feature flag: `alex.ui.v8` setting to toggle between old/new
4. If rollback needed: revert to v7.9.0, increment to v7.9.1

---

## Next Steps

1. ✅ **Plan reviewed** — decisions made, roadmap detailed
2. **Start v7.10.0** — Health Pulse data model
3. **Ship incrementally** — each version is usable
4. **Celebrate at v8.0.0** — marketing moment when all features land

---

## Version Summary

| Version Range | Theme | Key Deliverables |
| ------------- | ----- | ---------------- |
| 7.10 – 7.14 | Foundation | Health Pulse data model, Nudge Engine |
| 7.15 – 7.19 | UI Restructure | Tab renames, Home tab, cleanup |
| 7.20 – 7.24 | Process Integration | Dream/Meditation buttons, feedback nudge |
| 7.25 – 7.29 | Cross-Heir Intelligence | Aggregation, summaries, urgency signals |
| 7.30 – 7.50 | Polish | Cleanup, accessibility, performance |
| 7.51 – 7.99 | Stabilization | Bug fixes, final testing |
| **8.0.0** | **Major Release** | **All features shipped** |

---

*This plan is a living document. Update as we refine together.*
