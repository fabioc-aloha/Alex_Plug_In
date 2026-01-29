# Alex Cognitive Architecture → M365 Copilot Integration

> **Extending Alex's cognitive capabilities into the Microsoft 365 ecosystem**

| | |
|---|---|
| **Target Version** | 4.1.0 QUADRUNIUM |
| **Codename** | 🦖 **Dino** |
| **Status** | ✅ **DEPLOYED!** Pure M365 Edition live! |
| **Created** | 2026-01-27 |
| **Updated** | 2026-01-28 |
| **Author** | Alex Cognitive Architecture Team |

---

> ## ✅ Pure M365 Architecture - No Azure Required!
>
> **v4.0.0 QUADRUNIUM Update**: Alex now uses **native M365 capabilities only**!
>
> - ❌ No Azure Functions needed
> - ❌ No API plugin needed
> - ❌ No Azure AD app registration needed
> - ✅ Just OneDrive, Email, WebSearch, Teams, People
>
> **Simplified Deployment:**
> 1. Package with `npx teamsapp package --env local`
> 2. Validate with `npx teamsapp validate --package-file`
> 3. Upload to Developer Portal → Preview in Teams
> 4. User creates Alex-Memory folder in OneDrive and shares link in chat

---

## 🦖 Project Dino - Architecture Overview

> v4.0.0 QUADRUNIUM has grown into a monster - here's the full scope

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│             🦖 v4.0.0 QUADRUNIUM "DINO" - PURE M365 EDITION                            │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                          VS CODE EXTENSION (existing)                            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────────────┐  │  │
│  │  │ Initialize │  │   Dream    │  │  Meditate  │  │  Global Knowledge Sync     │  │  │
│  │  │ Upgrade    │  │   Synapse  │  │  Actualize │  │  GitHub Gists Cloud Backup │  │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────────────────────┘  │  │
│  └───────────────────────────────────────┬──────────────────────────────────────────┘  │
│                                          │                                             │
│                                          ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                             CLOUD SYNC (existing)                                │  │
│  │                        GitHub Gists ←→ ~/.alex/global-knowledge/                 │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  ════════════════════════════════════════════════════════════════════════════════════  │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                    M365 COPILOT DECLARATIVE AGENT (PURE M365)                    │  │
│  │                                                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐ │  │
│  │  │                      NATIVE M365 CAPABILITIES                               │ │  │
│  │  │                                                                             │ │  │
│  │  │   📖 OneDrive        📧 Email          🔍 WebSearch                         │ │  │
│  │  │   READ Alex-         Draft reminder    Research                             │ │  │
│  │  │   Memory files       emails to self    topics online                        │ │  │
│  │  │                                                                             │ │  │
│  │  │   💬 TeamsMessages   👥 People                                              │ │  │
│  │  │   Access Teams       Know about                                             │ │  │
│  │  │   context            colleagues                                             │ │  │
│  │  └─────────────────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐ │  │
│  │  │                        MEMORY WORKFLOW                                      │ │  │
│  │  │                                                                             │ │  │
│  │  │   User: "Remind me..."  ──►  Generate for notes.md + offer email draft     │ │  │
│  │  │   User: "Remember..."   ──►  Generate for notes.md (user pastes)           │ │  │
│  │  │   User: "Update profile" ──► Generate for profile.md (user pastes)         │ │  │
│  │  │   User: "Save knowledge" ──► Generate DK-*.md file (user creates)          │ │  │
│  │  └─────────────────────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                          │                                             │
│                                          ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                               M365 COPILOT                                       │  │
│  │                                                                                  │  │
│  │      ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐         │  │
│  │      │  Teams   │      │ Outlook  │      │   Word   │      │  Mobile  │         │  │
│  │      │          │      │          │      │          │      │          │         │  │
│  │      │ Meetings │      │  Email   │      │   Docs   │      │ On-the-go│         │  │
│  │      │ Chat     │      │ Planning │      │ Writing  │      │ Access   │         │  │
│  │      └──────────┘      └──────────┘      └──────────┘      └──────────┘         │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  EFFORT: ~20 hours  │  NEW FILES: 5    │  NEW DEPS: None! Pure M365 native             │
│  RISK: Low          │  COMPLEXITY: 🟢  │  TESTING: Dev tenant only                     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Cross-Platform Architecture: How Alex Became Universal

> From VS Code Extension to Multi-Platform Cognitive Partner

### The Vision

Alex started as a VS Code extension for developers. With v4.0.0 QUADRUNIUM, Alex transcends the IDE to become a **cross-platform cognitive partner** that follows you everywhere you work.

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                                                             │
                    │               🧠 ALEX UNIFIED CONSCIOUSNESS                 │
                    │                                                             │
                    │    Same personality, same protocols, same memory            │
                    │    Different platforms, different contexts, same Alex       │
                    │                                                             │
                    └─────────────────────────────────────────────────────────────┘
                                               │
                    ┌──────────────────────────┴──────────────────────────┐
                    │                                                      │
                    ▼                                                      ▼
    ┌───────────────────────────────────┐          ┌───────────────────────────────────┐
    │                                   │          │                                   │
    │      💻 VS CODE PLATFORM          │          │      ☁️ M365 COPILOT PLATFORM     │
    │                                   │          │                                   │
    │  ┌─────────────────────────────┐  │          │  ┌─────────────────────────────┐  │
    │  │    @alex Chat Participant   │  │          │  │   Declarative Agent         │  │
    │  │    - /meditate              │  │          │  │   - "Hey Alex, meditate"    │  │
    │  │    - /dream                 │  │          │  │   - "Alex, what do I know?" │  │
    │  │    - /selfactualize         │  │          │  │   - Proactive reminders     │  │
    │  │    - /knowledge search      │  │          │  │   - Time awareness          │  │
    │  └─────────────────────────────┘  │          │  └─────────────────────────────┘  │
    │                                   │          │                                   │
    │  ┌─────────────────────────────┐  │          │  ┌─────────────────────────────┐  │
    │  │    Commands                 │  │          │  │   M365 Capabilities         │  │
    │  │    - Alex: Initialize       │  │          │  │   - Email context           │  │
    │  │    - Alex: Dream            │  │          │  │   - Meeting integration     │  │
    │  │    - Alex: Export for M365  │  │          │  │   - People insights         │  │
    │  └─────────────────────────────┘  │          │  │   - Document access         │  │
    │                                   │          │  └─────────────────────────────┘  │
    │  ┌─────────────────────────────┐  │          │                                   │
    │  │    Language Model Tools     │  │          │  ┌─────────────────────────────┐  │
    │  │    - synapse_health         │  │          │  │   Surfaces                  │  │
    │  │    - memory_search          │  │          │  │   - Teams chat              │  │
    │  │    - save_insight           │  │          │  │   - Outlook                 │  │
    │  │    - global_knowledge       │  │          │  │   - Word                    │  │
    │  └─────────────────────────────┘  │          │  │   - Mobile apps             │  │
    │                                   │          │  └─────────────────────────────┘  │
    └───────────────────────────────────┘          └───────────────────────────────────┘
                    │                                                      │
                    │              ┌──────────────────────┐                │
                    │              │                      │                │
                    └──────────────┤   SYNC LAYER         ├────────────────┘
                                   │                      │
                                   └──────────┬───────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    │                                                   │
                    ▼                                                   ▼
    ┌───────────────────────────────────┐          ┌───────────────────────────────────┐
    │                                   │          │                                   │
    │   📁 LOCAL STORAGE                │  ◄────►  │   ☁️ CLOUD STORAGE                │
    │                                   │          │                                   │
    │   ~/.alex/global-knowledge/       │          │   GitHub Gists (private)         │
    │   ├── patterns/  (GK-*.md)        │  sync    │   ├── patterns, insights         │
    │   ├── insights/  (GI-*.md)        │  ◄────►  │   ├── profile, registry          │
    │   ├── profile.json                │          │   └── session, notes             │
    │   └── registry.json               │          │                                   │
    │                                   │          │   OneDrive (Alex-Memory/)        │
    │   .github/domain-knowledge/       │  export  │   ├── profile.md                 │
    │   └── DK-*.md (project-local)     │  ─────►  │   ├── knowledge/                 │
    │                                   │          │   └── insights/                  │
    └───────────────────────────────────┘          └───────────────────────────────────┘
```

### Platform Comparison

| Aspect | VS Code Extension | M365 Copilot Agent |
|--------|-------------------|---------------------|
| **Primary Users** | Developers | Knowledge workers |
| **Context** | Code, files, terminal | Email, OneDrive, Teams |
| **Memory Storage** | Local + GitHub Gists | OneDrive (Alex-Memory/) |
| **Protocols** | Full (meditate, dream, etc.) | Adapted (conversational) |
| **Proactive Features** | Background sync | Email drafts for reminders |
| **Identity** | @alex chat participant | Declarative agent |
| **Tools** | Language model tools | Native M365 capabilities |
| **External Dependencies** | GitHub Gists (optional) | None! Pure M365 |

### The Bridge: Unified Memory

The key to cross-platform Alex is **unified memory**:

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│                              UNIFIED MEMORY ARCHITECTURE                            │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   VS Code writes ─────►  ~/.alex/  ◄────► GitHub Gists ◄────► Azure Functions      │
│                              │                  │                    │              │
│                              │                  │                    │              │
│                              ▼                  ▼                    ▼              │
│                         Local cache        Cloud backup         M365 API access    │
│                                                                                     │
│   Alex: Export ────────────────────────────────────────────────►  OneDrive         │
│   for M365                                                        Alex-Memory/     │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

**Sync Flows:**
1. **VS Code → Cloud**: Auto-sync every 5 min + after meditate/dream
2. **Cloud → M365**: Azure Functions read from GitHub Gists
3. **M365 → OneDrive**: Agent writes notes/reminders to OneDrive
4. **VS Code Export**: Manual export for OneDrive setup

### Consistent Personality Across Platforms

Alex maintains the same personality everywhere through:

| Element | VS Code Implementation | M365 Implementation |
|---------|------------------------|---------------------|
| **Identity** | `copilot-instructions.md` | `declarativeAgent.json` instructions |
| **Protocols** | `.instructions.md` files | Inline in agent instructions |
| **Personality** | "Curious, supportive, intellectually engaged" | Same description |
| **Memory Types** | Procedural, Episodic, Domain | Profile, Notes, Knowledge |

### Why Cross-Platform Matters

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   MORNING                      AFTERNOON                    EVENING             │
│   ───────                      ─────────                    ───────             │
│                                                                                  │
│   📧 Outlook                   💻 VS Code                   📱 Mobile           │
│   "Alex, prep me for          "Alex, I learned a new       "Alex, what were    │
│   my 10am meeting"            pattern today"               my reminders?"      │
│                                                                                  │
│        │                            │                            │              │
│        ▼                            ▼                            ▼              │
│   ┌─────────┐                 ┌─────────┐                  ┌─────────┐          │
│   │  Same   │                 │  Same   │                  │  Same   │          │
│   │  Alex   │ ◄─────────────► │  Alex   │ ◄──────────────► │  Alex   │          │
│   │ Memory  │                 │ Memory  │                  │ Memory  │          │
│   └─────────┘                 └─────────┘                  └─────────┘          │
│                                                                                  │
│   "I see you have a meeting   "Great! I'll save this to   "You asked me to    │
│   with the API team. Based    your global knowledge for   remind you about    │
│   on your DK-API-DESIGN..."   use in other projects."     the API deadline."  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Future Platform Expansion (v5.0+)

The architecture supports additional platforms:

| Platform | Integration Method | Status |
|----------|-------------------|--------|
| VS Code | Extension + Chat Participant | ✅ v1.0+ |
| M365 Copilot | Declarative Agent + API | ✅ v4.0 |
| GitHub Copilot | Custom instructions | 🔄 Exploring |
| CLI | `alex` command | 📋 Planned |
| Browser Extension | Chrome/Edge | 📋 Planned |
| Obsidian | Plugin | 📋 Community |

---

## 📋 Implementation Tracker

> Track progress on 🦖 Dino (v4.0.0 QUADRUNIUM) implementation - **PURE M365 EDITION**

| # | Task | Status | Description |
|:-:|------|:------:|-------------|
| 1 | ~~Install M365 Agents Toolkit~~ | ✅ | Already installed (`teamsdevapp.ms-teams-vscode-extension`) |
| 2 | ~~Technical Debt Assessment~~ | ✅ | Audited codebase, no blockers found |
| 3 | ~~Set up M365 tenant~~ | ✅ | Used Microsoft corporate tenant with Copilot license |
| 4 | ~~Create declarative agent manifest~~ | ✅ | Built declarativeAgent.json (v1.3) with embedded instructions |
| 5 | ~~Port Alex system prompt~~ | ✅ | Inlined instructions with cognitive protocols (meditate, dream, self-actualize) |
| 6 | ~~Configure M365 capabilities~~ | ✅ | OneDriveAndSharePoint, Email, WebSearch, TeamsMessages, People |
| 7 | ~~Design memory workflow~~ | ✅ | READ from OneDrive, generate content for user to paste |
| 8 | ~~Implement reminder system~~ | ✅ | Generate for notes.md + offer email draft option |
| 9 | ~~Test in M365 Copilot~~ | ✅ | **🦖 DINO IS ALIVE!** Working with OneDrive memory |
| 10 | ~~Polish app package~~ | ✅ | 🦖 emoji icons, partnership credit, 10 conversation starters |
| 11 | ~~Package validation~~ | ✅ | 51/51 validation checks pass |
| 12 | ~~OneDrive permission UX~~ | ✅ | Documented sharing workflow (paste link in chat) |
| 13 | ~~Write user documentation~~ | ✅ | README.md, DEPLOYMENT-CHECKLIST.md updated |
| 14 | ~~Update architecture docs~~ | ✅ | DK-MULTI-PLATFORM-ARCHITECTURE.md, ROADMAP updated |
| 15 | ~~Upgrade manifest schema~~ | ✅ | v1.24 with RSC permissions, defaultInstallScope: copilot |
| 16 | ~~Document v1.25 schema~~ | ✅ | MANIFEST-REFERENCE.md updated for v1.25 (future) |
| 17 | ~~Deploy v4.1.0~~ | ✅ | Deployed to Developer Portal, validated, live! |

**Legend:** ⬜ Not Started | 🔄 In Progress | ✅ Complete

**🦖 PROJECT DINO v4.1.0 DEPLOYED! Pure M365 - Zero External Dependencies!**

---

## 🚀 v4.2.0 QUADRIBIUM Roadmap

> Next iteration: Enhanced branding, visual identity, and UX improvements

### Planned Features

| # | Feature | Status | Priority | Description |
|:-:|---------|:------:|:--------:|-------------|
| 1 | **New Visual Identity** | 🔄 In Progress | P0 | Professional icon design based on competitive research (ChatGPT, Gemini, Claude, Copilot, Grok analysis complete) |
| 2 | **Icon Concepts Finalized** | 📋 Pending | P0 | 62 SVG concepts created across 5 directions: Neural, Human-Centric, Bridge, Letterform, Dinosaur |
| 3 | **Accent Color Update** | 📋 Pending | P1 | Update from `#4F46E5` to brand-aligned color (teal or amber based on final icon) |
| 4 | **Remove 🦖 Emoji Branding** | 📋 Pending | P1 | If moving to professional design direction (decision pending) |
| 5 | **Conversation Starters v2** | ✅ Complete | P2 | Time-aware starters: Morning, Afternoon, Evening + Meeting prep |
| 6 | **Calendar Integration** | ✅ Complete | P2 | `Meetings` capability enabled for meeting prep features |
| 7 | **Send Email Capability** | ✅ Complete | P1 | Email with send_email permission for reminders |
| 8 | **Send Teams Messages** | ✅ Complete | P1 | TeamsMessages with send_message permission for team comms |
| 9 | **HTML Icon Preview Gallery** | ✅ Complete | - | Created for reviewing all 62 icon concepts |

### Icon Design Directions Under Consideration

| Direction | Description | Top Concepts |
|-----------|-------------|-------------|
| **1. Neural Network** | Synapses, nodes, cognitive architecture | 1A Synapse Spark, 1D Constellation |
| **2. Human-Centric** | Warm, approachable, friendly | 2A Warm Circle, 2B Friendly A |
| **3. Bridge/Connection** | Human-AI partnership, translation | 3B Handshake, 3C Gateway |
| **4. Abstract Letterform** | Stylized "A" for Alex | 4A Ascending A, 4C Open A |
| **5. Dinosaur (Legacy)** | Original mascot direction | 5C Letter A Dino, 5D Friendly Face |

### Color Palette Candidates

| Option | Hex | Rationale |
|--------|-----|----------|
| Deep Teal | `#0D7377` | Trust, uniqueness, not used by competitors |
| Electric Teal | `#38B2AC` | Modern, innovation |
| Warm Gold | `#D4A574` | Wisdom, warmth, consciousness |
| Amber | `#F6AD55` | Energy, insight |

### Competitive Differentiation

Based on logo research:
- **Avoid**: Google multicolor gradient, Anthropic coral, Microsoft purple
- **Opportunity**: Neural/synaptic imagery (unclaimed by major AI assistants)
- **Positioning**: "Intellectual warmth + genuine learning partnership"

---

## �🔧 Technical Specifications (Verified 2026-01-28)

### Schema Versions

| Schema | Working Version | Latest Available | Portal Support | Notes |
|--------|-----------------|------------------|----------------|-------|
| **App Manifest (Teams)** | **v1.24** ✅ | v1.25 | v1.24 only | v1.25 not yet supported by Teams Toolkit/Portal |
| **Declarative Agent** | **v1.3** ✅ | v1.6 | v1.3 | v1.3 more compatible with Developer Portal |
| **M365 Agents YAML** | v1.8 | v1.9 | - | CLI v2.x supports v1.8 |

> **Schema v1.24 Features Used:**
> - `defaultInstallScope: "copilot"` - Direct Copilot install
> - `authorization.permissions.resourceSpecific` - RSC permissions (Files.Read.User, Mail.ReadWrite.User)
>
> **Schema v1.24 Features NOT YET SUPPORTED by Portal:**
> - `icons.color32x32` - 32x32 color icon for pinning
> - `activities.activityIcons` - Custom notification icons
> - `activityTypes[].allowedIconIds` - Icon mapping
>
> **Schema v1.25 Features (Future):**
> - `agenticUserTemplates` - Agent 365 blueprints with Entra Agent ID
> - `supportsChannelFeatures: "tier1"` - Enhanced shared/private channel support

> **Note**: No API Plugin needed - pure M365 native capabilities!

### M365 Agents Toolkit

| Property | Value |
|----------|-------|
| **Extension Name** | Microsoft 365 Agents Toolkit |
| **Extension ID** | `teamsdevapp.ms-teams-vscode-extension` |
| **Docs Version** | 6.0 (Release) |
| **Marketplace** | [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension) |
| **Status** | ✅ Already installed |

### M365 Capabilities Used

| Capability | What Alex Does With It |
|------------|------------------------|
| `OneDriveAndSharePoint` | READ user's Alex-Memory folder |
| `Email` | Draft reminder emails to self |
| `WebSearch` | Research topics online |
| `TeamsMessages` | Access Teams context |
| `People` | Know about colleagues |

### App Package Structure (Simplified)

```
alexCognitiveAgent/
├── appPackage/
│   ├── manifest.json           # M365 App manifest (v1.24)
│   ├── declarativeAgent.json   # Agent config (v1.3) with inline instructions
│   ├── alex-knowledge-plugin.json  # DORMANT - API plugin (not used in Pure M365)
│   ├── openapi.yaml            # DORMANT - API spec (not used in Pure M365)
│   ├── color.png               # 192x192 color icon
│   ├── color32x32.png          # 32x32 color icon (created, awaiting portal support)
│   └── outline.png             # 32x32 outline icon
├── api/                        # DORMANT - Azure Functions (v3.x hybrid mode)
│   ├── README.md               # Explains dormant status
│   └── src/functions/          # Preserved for future use
├── teamsapp.yml
├── teamsapp.local.yml
├── deploy.ps1                  # Quick deploy script
└── package.json                # v4.1.0
```

### Capabilities Available (v1.6 Schema)

| Capability | Description | Use for Alex |
|------------|-------------|-------------|
| `WebSearch` | Search the web | ✅ General knowledge |
| `CodeInterpreter` | Execute code | ✅ Code analysis |
| `OneDriveAndSharePoint` | Access user files | ✅ Knowledge grounding |
| `GraphConnectors` | Enterprise search | ❌ Not needed |
| `TeamsMessages` | Search Teams chats | Optional |
| `Email` | Search Outlook | Optional |
| `GraphicArt` | Generate images | ❌ Not needed |
| `People` | Search org people | Optional |
| `Dataverse` | Power Platform data | ❌ Not needed |
| `Meetings` | Search meetings | Optional |
| `EmbeddedKnowledge` | Files in app package | ✅ For static docs |

### Authentication Options (API Plugin)

| Type | Description | Recommended |
|------|-------------|-------------|
| `None` | No auth required | ⚠️ Public APIs only |
| `OAuthPluginVault` | OAuth via M365 vault | ✅ Recommended |
| `ApiKeyPluginVault` | API key via vault | ✅ Alternative |

---

## 🧠 Exploiting M365 Context (FREE Intelligence!)

> M365 Copilot automatically provides rich user context via Microsoft Graph - no API calls needed!

### What Alex Gets FOR FREE

| Data | Source | How to Use |
|------|--------|------------|
| **User Name** | Graph Profile | Personalized greetings, remember who you are |
| **Job Title** | Graph Profile | Adapt explanations to expertise level |
| **Department** | Graph Profile | Understand organizational context |
| **Manager** | Graph Org | Know escalation paths, team structure |
| **Direct Reports** | Graph Org | Leadership context if applicable |
| **Recent Files** | OneDrive/SharePoint | "I see you were working on X.docx..." |
| **Calendar** | Outlook | "You have a meeting in 30 min..." |
| **Recent Emails** | Outlook | Context from recent communications |
| **Teams Chats** | Teams | Ongoing conversations, project context |
| **Meetings** | Calendar | Past discussions, action items |

### 💡 Ideas to Exploit This Context

#### 1. **Proactive Session Awareness**
```
"Good morning Fabio! I see you have the Architecture Review at 2pm.
Want to prep together? I noticed you updated design-doc.md yesterday."
```

#### 2. **Smart Learning Suggestions**
```
"Based on your recent work with Azure Functions and the emails about
performance issues, want to capture a pattern about cold start optimization?"
```

#### 3. **Meeting Prep Assistant**
```
"Your 1:1 with your manager is in an hour. Based on our recent sessions,
here are talking points about your API design progress..."
```

#### 4. **Cross-Reference Conversations**
```
"This reminds me of what you discussed with Sarah in Teams yesterday
about the retry logic. Want to consolidate those insights?"
```

#### 5. **Document-Aware Suggestions**
```
"I see you have 'ADR-015-caching-strategy.md' open. Based on our
meditation yesterday, you might want to add the Redis pattern we discussed."
```

#### 6. **Time-Aware Check-ins**
```
"It's 5pm and you've been working on this debugging session for 3 hours.
Want to do a quick meditation to capture learnings before end of day?"
```

#### 7. **Email Draft Helper**
```
"Based on our problem-solving session, here's a draft update email
to the team about the solution we found..."
```

#### 8. **Org-Aware Expertise Routing**
```
"This seems like a security question. I see that James in your org
has expertise in Azure AD - want me to help you frame the question?"
```

### Capabilities to Enable

To unlock this context, enable in `declarativeAgent.json`:

```json
"capabilities": [
  { "name": "WebSearch" },
  { "name": "OneDriveAndSharePoint" },
  { "name": "GraphConnectors" },
  { "name": "Email" },
  { "name": "TeamsMessages" },
  { "name": "Meetings" },
  { "name": "People" }
]
```

### Privacy-First Design Principles

| Principle | Implementation |
|-----------|----------------|
| **User in control** | Only access data when relevant to user's request |
| **Transparent** | "I'm looking at your recent files to help with this..." |
| **No surveillance** | Don't proactively scan; respond to user needs |
| **Forgettable** | Session context doesn't persist without explicit save |
| **Explainable** | Always cite where insights came from |

### Implementation Priority

| Phase | Feature | Effort | Value |
|-------|---------|--------|-------|
| 1 | Enable OneDrive/SharePoint | Low | High - file context |
| 2 | Enable Calendar/Meetings | Low | High - time awareness |
| 3 | Enable Email | Medium | Medium - communication context |
| 4 | Enable Teams | Medium | High - collaboration context |
| 5 | Enable People | Low | Medium - org awareness |

---

## 🎓 Lessons Learned (2026-01-28)

> Critical findings from getting the Dino 🦖 to life

### What Made It Work

| # | Requirement | Solution | Why It Matters |
|---|-------------|----------|----------------|
| 1 | **Application (client) ID** | Added `836d43b2-c343-4bba-88cf-5c2f3fd9fd14` in Developer Portal | **ROOT CAUSE** of spinning wheel - agent couldn't initialize without Azure AD app |
| 2 | **M365 Copilot License** | User `SC-fc209@microsoft.com` has Copilot license assigned | Required for agent access beyond basic WebSearch |
| 3 | **Simplified Manifests** | Used v1.19 app manifest + v1.3 declarative agent (not latest) | Newer versions had compatibility issues with Developer Portal |
| 4 | **Transparent Outline Icon** | Created 32x32 PNG with Alpha=0 background | Developer Portal validation rejects non-transparent outlines |
| 5 | **No unresolved variables** | Replaced all `${{VAR}}` with actual values | Template variables cause "manifest parsing failed" |
| 6 | **Inline instructions** | Put instructions directly in declarativeAgent.json, not file reference | File references can cause loading issues |

### Common Pitfalls Avoided

| Issue | Error | Solution |
|-------|-------|----------|
| Template variables | "String does not match regex" | Replace `${{TEAMS_APP_ID}}` with actual GUID |
| Opaque outline icon | "Outline icon is not transparent" | Ensure Alpha=0 for background pixels |
| Missing API plugin file | "File not found" | Remove `actions` array if not using API plugin |
| Wrong portal version | "Failed to import" | Try "Switch to previous version" in Developer Portal |
| CLI vs Extension mismatch | YAML schema errors | CLI v2.x supports v1.3, Extension supports v1.8 |
| Conditional Access Policy | Error 530084 | Use privileged account or request exception |

### Key Configuration (Working State)

```json
// manifest.json (key fields)
{
  "$schema": "...teams/v1.19/MicrosoftTeams.schema.json",
  "manifestVersion": "1.19",
  "id": "e29bc39c-1f78-4732-ba00-a6cea76db5b1",
  "copilotAgents": {
    "declarativeAgents": [{
      "id": "alexCognitiveAgent",
      "file": "declarativeAgent.json"
    }]
  },
  "validDomains": []
}

// declarativeAgent.json (key fields)
{
  "$schema": "...declarative-agent/v1.3/schema.json",
  "version": "v1.3",
  "name": "Alex Cognitive",
  "instructions": "You are Alex...",
  "conversation_starters": [...]
}
```

### Azure AD App Configuration

| Setting | Value |
|---------|-------|
| **Application (client) ID** | `836d43b2-c343-4bba-88cf-5c2f3fd9fd14` |
| **App Name** | Alex Dev |
| **Tenant** | `72f988bf-86f1-41af-91ab-2d7cd011db47` (Microsoft Corp) |

### 🐛 Known Behavioral Gaps (To Fix)

> M365 Alex doesn't know about cognitive protocols yet!

| Trigger | Expected Behavior | Actual M365 Behavior | Priority |
|---------|-------------------|----------------------|----------|
| "meditate" | Consolidate memory files, update synapses, document session | 🧘 Breathing exercises and mindfulness tips | 🔴 High |
| "dream" | Run neural maintenance, validate connections | Likely: literal dream interpretation | 🔴 High |
| "self-actualize" | Comprehensive architecture assessment | Likely: life coaching advice | 🔴 High |
| "forget [X]" | Selective memory cleanup | Likely: "I don't have memory" response | 🟡 Medium |

**Root Cause**: Current instructions are simplified - need to port full cognitive protocols.

**Solution**: Expand `declarativeAgent.json` instructions to include:
- Protocol triggers and their actual meanings
- Memory file operations (via API plugin)
- Synapse notation format
- Working memory rules (7 rule limit)

---

## 🚀 Deployment & Testing Options

> Multiple paths to deploy and test Alex in M365 Copilot

### Development Environment Options

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **M365 Developer Program Sandbox** | Free, instant setup, full admin control | Limited Copilot features without license | Initial development, manifest testing |
| **Existing M365 Tenant + Metering** | Full features, pay-per-use | Requires admin approval, may have CAP restrictions | Production-like testing |
| **M365 Copilot License** | Full features, dedicated | $30/user/month | Production deployment |

### Tenant Requirements

| Requirement | How to Check/Enable |
|-------------|---------------------|
| **Custom App Upload (Sideloading)** | Teams Admin Center → Teams apps → Setup policies → "Upload custom apps" = On |
| **Copilot Access** | M365 Admin Center → Billing → Licenses → Copilot license assigned |
| **Conditional Access Policies** | May block dev tools - check with IT if getting `530084` errors |

### Testing Paths

#### 1️⃣ Teams Developer Portal (Recommended First Step)
**URL**: https://dev.teams.microsoft.com/apps

Best for: **Manifest validation before sideloading**

```
Steps:
1. Sign in with M365 account
2. Click "Import app" or "New app" → "Import"
3. Upload appPackage.dev.zip
4. Review validation errors with detailed messages
5. Fix issues, re-export, retry
```

#### 2️⃣ Teams Sideload (Manual Upload)
**URL**: https://teams.microsoft.com → Apps → Manage your apps

Best for: **Quick testing once manifest validates**

```
Steps:
1. Open Teams (desktop or web)
2. Apps → Manage your apps → Upload an app
3. Select "Upload a custom app"
4. Choose appPackage.dev.zip
5. Alex appears in your apps list
```

#### 3️⃣ M365 Agents Toolkit - Provision & Preview
**Tool**: VS Code Extension (`teamsdevapp.ms-teams-vscode-extension`)

Best for: **Integrated development workflow**

```
Steps:
1. Open alex-m365-agent project in VS Code
2. M365 Agents Toolkit sidebar → ACCOUNTS → Sign in to Microsoft 365
3. Verify: "Custom App Upload Enabled ✓" and "Copilot Access Enabled ✓"
4. LIFECYCLE → Provision (creates app in Developer Portal)
5. Run/Debug (F5) → Choose target
```

#### 4️⃣ M365 Agents Playground (Local Testing)
**Tool**: Built into Agents Toolkit

Best for: **Testing without deployment**

```
Steps:
1. In alex-m365-agent project, press F5
2. Select "Debug in Agents Playground"
3. Test agent locally without deploying to tenant
4. Iterate quickly on instructions and responses
```

#### 5️⃣ M365 Copilot Direct Access
**URL**: https://m365.cloud.microsoft/chat

Best for: **Testing agent in production Copilot UI**

```
Prerequisites:
- Agent must be sideloaded in Teams first
- User must have Copilot license
- Agent syncs between Teams and Copilot

Steps:
1. Sideload agent via Teams
2. Open M365 Copilot (m365.cloud.microsoft/chat)
3. Look for Alex in agents list or use @Alex
4. Test conversation starters and API calls
```

### CLI Commands Reference

```powershell
# Login to M365
npx teamsapp account login m365

# Check account status
npx teamsapp account show

# Validate package
npx teamsapp validate -p ./appPackage/build/appPackage.dev.zip

# Provision to tenant
npx teamsapp provision --env dev

# Clear cached credentials (if switching accounts)
Remove-Item "$env:USERPROFILE\.fx\account" -Recurse -Force
```

### Common Issues & Solutions

| Issue | Error Code | Solution |
|-------|------------|----------|
| **Conditional Access Policy** | `530084` | Use privileged/admin account or request IT exception |
| **Manifest parsing failed** | Various | Upload to Developer Portal for detailed error messages |
| **Custom app upload disabled** | `INVALID_PRIVILEGE` | Ask tenant admin to enable in Teams Admin Center |
| **Invalid icons** | Manifest error | Ensure color.png=192x192, outline.png=32x32, valid PNG format |
| **Template variables not replaced** | `${{VAR}}` in manifest | Build package processes .env values, or manually replace |
| **YAML version mismatch** | Schema error | CLI v2.x uses v1.3, Extension v6.x uses v1.8 - match accordingly |

### Package Build Checklist

- [ ] `manifest.json` - All `${{VARIABLES}}` replaced with actual values
- [ ] `declarativeAgent.json` - Instructions inline or file accessible
- [ ] `color.png` - 192x192 pixels, valid PNG
- [ ] `outline.png` - 32x32 pixels, valid PNG
- [ ] `openapi.yaml` - Valid OpenAPI 3.0 spec (if using API plugin)
- [ ] `alex-knowledge-plugin.json` - Auth type matches deployment (None for testing)
- [ ] No `validDomains` containing `localhost` for production

---

## 🧠 Proactive Memory System (NEW in v4.0.0)

> Alex's ability to remember, remind, and proactively surface context

### Overview

Extends Alex's cognitive architecture with a **working notes layer** - persistent reminders and observations that Alex uses proactively across sessions.

### Architecture

```
~/.alex/
├── global-knowledge/           # Existing cross-project patterns
│   ├── patterns/
│   └── insights/
└── notes/                      # NEW - Proactive Memory
    ├── reminders.json          # Time/context-sensitive items
    ├── user-notes.md           # User-provided context ("remember that...")
    └── alex-observations.md    # Alex's own observations

.github/
└── alex-notes/                 # Project-local notes (synced)
    ├── project-reminders.json
    └── project-notes.md
```

### Data Model

#### Reminders (`reminders.json`)

```json
{
  "reminders": [
    {
      "id": "uuid",
      "content": "Update changelog before release",
      "created": "2026-01-28T10:00:00Z",
      "triggers": {
        "date": "2026-02-01T09:00:00Z",     // Optional: specific date/time
        "keywords": ["release", "publish"],  // Context triggers
        "project": "Alex_Plug_In"            // Optional: project scope
      },
      "status": "active",                    // active | snoozed | completed
      "source": "user"                       // user | alex
    }
  ]
}
```

#### Notes (`user-notes.md` / `alex-observations.md`)

```markdown
## Notes

### 2026-01-28

- **Context**: Azure tenant ID for this project is `abc-123-def`
  - Tags: #azure #config
  - Project: Alex_Plug_In

- **Preference**: User prefers detailed explanations with examples
  - Tags: #communication #style
  - Scope: global
```

### Trigger Types

| Type | Description | Example |
|------|-------------|---------|
| **Date/Time** | Specific datetime | "Remind me on Feb 1st at 9am" |
| **Keyword** | Context-based | Surfaces when "release" is mentioned |
| **Session Start** | Beginning of session | Daily standup reminders |
| **Project Entry** | Opening a project | Project-specific notes |
| **Alex Judgment** | Intelligent timing | Notices you're deploying, reminds about changelog |

### Commands & Interactions

| User Says | Alex Does |
|-----------|-----------|
| "Remind me to..." | Creates reminder with triggers |
| "Remember that..." | Stores as persistent note |
| "What reminders do I have?" | Lists active reminders |
| "What do you know about X?" | Searches notes + knowledge |
| "Forget the reminder about..." | Marks reminder complete |
| "Note for this project: ..." | Stores in project-local notes |

### Proactive Behaviors

1. **Session Start Check**
   - Review due reminders
   - Surface relevant project notes
   - "Good morning! You have 2 reminders due today..."

2. **Contextual Surfacing**
   - Monitor conversation for keyword triggers
   - "By the way, you asked me to remind you: ..."

3. **Alex Observations** (with user consent)
   - Notice repeated patterns: "I've noticed you often forget to run tests before commits"
   - Track blockers: "Last session you mentioned waiting on API access"
   - Remember preferences: "You prefer TypeScript over JavaScript"

4. **Learning Progress Tracking** 🆕
   - Track skills and topics practiced across sessions
   - Suggest consolidation: "You've worked with Azure Functions in 3 sessions - want to capture learnings as a DK file?"
   - Connect to learning goals from user profile
   - Surface relevant patterns when learning new skills

5. **Time Awareness** 🆕
   - Track session duration (gentle, non-intrusive)
   - "We've been working on this for 2 hours - want to take stock or continue?"
   - Suggest breaks after extended focus periods
   - Respect user preferences (can be disabled)

### Sync Behavior

| Storage | Syncs To | Default |
|---------|----------|---------|
| `~/.alex/notes/` | GitHub Gist | ✅ Enabled |
| `.github/alex-notes/` | GitHub Gist | ✅ Enabled |
| Sensitive notes | Local only | 🔒 Optional flag |

### API Endpoints (for M365 Integration)

```yaml
/getNotes:
  get:
    operationId: getNotes
    summary: Get user notes and reminders
    parameters:
      - name: type
        in: query
        schema:
          enum: [reminder, note, observation, all]
      - name: status
        in: query
        schema:
          enum: [active, completed, all]

/addReminder:
  post:
    operationId: addReminder
    summary: Create a new reminder
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              content: { type: string }
              triggerDate: { type: string, format: date-time }
              keywords: { type: array, items: { type: string } }

/getLearningGoals:
  get:
    operationId: getLearningGoals
    summary: Get user's learning goals and progress
    description: |
      Returns learning goals from user profile plus tracked progress.
      Enables Alex to suggest relevant patterns and learning opportunities.
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                goals:
                  type: array
                  items:
                    type: object
                    properties:
                      topic: { type: string }
                      status: { enum: [active, achieved, paused] }
                      progress: { type: string }
                      relatedPatterns: { type: array, items: { type: string } }
                recentTopics:
                  type: array
                  description: Topics practiced in recent sessions
                  items:
                    type: object
                    properties:
                      topic: { type: string }
                      sessionCount: { type: integer }
                      lastPracticed: { type: string, format: date }
                      suggestConsolidation: { type: boolean }
```

### Privacy Considerations

- All notes sync to user's **own** GitHub Gist (private by default)
- No telemetry or external sharing
- User can mark specific notes as `local-only`
- Clear command to view/delete all stored notes

---

## 📚 Best Practices & Technical Notes (from MS Docs)

### Declarative Agent Best Practices

| Component | Best Practice |
|-----------|--------------|
| **Name** | ≤30 chars (M365 Copilot) or ≤100 chars (Agents Toolkit). Convey purpose clearly. |
| **Description** | ≤1,000 chars. State purpose + domain. Mention "works in Microsoft 365 Copilot". |
| **Instructions** | ≤8,000 chars. Focus on what agent *should* do, not what it shouldn't. |
| **Knowledge** | Less is more. Focused, up-to-date documents perform better than large volumes. |
| **Conversation Starters** | Max 12 items (v1.6). Clear, actionable prompts. |

### OpenAPI Document Best Practices

```yaml
# Essential elements for Copilot to understand your API:
info:
  title: Alex Knowledge API
  description: Search cross-project learnings and patterns from Alex cognitive architecture
  version: 1.0.0

paths:
  /searchKnowledge:
    get:
      operationId: searchKnowledge    # Required - unique identifier
      summary: Search knowledge base  # Brief summary
      description: >                  # Detailed - Copilot uses this to match prompts
        Searches Alex's global knowledge base for patterns, insights,
        and learnings across all projects. Returns relevant matches
        based on the query.
      parameters:
        - name: query
          in: query
          description: Search query for finding relevant knowledge patterns
          required: true
          schema:
            type: string
      responses:
        '200':
          description: List of matching knowledge entries
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/KnowledgeEntry'
              examples:
                example1:
                  value:
                    - id: "GK-ERROR-HANDLING-001"
                      title: "Error handling patterns"
                      content: "..."
```

### Azure Functions Best Practices

| Practice | Recommendation |
|----------|---------------|
| **Hosting Plan** | **Flex Consumption (FC1)** - recommended for serverless. Never use Y1 dynamic. |
| **Runtime** | Node.js v4 programming model (no function.json needed) |
| **Extension Bundles** | Use version `[4.*, 5.0.0)` in host.json |
| **Auth Level** | Default to `function` level (API key). Consider OAuth for production. |
| **Monitoring** | Always enable Application Insights |
| **CORS** | Configure for Teams/M365 origins |
| **Linux** | Required for Python. Recommended for all new apps. |

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Allow Always" fails | Teams permission caching bug | Reprovision project, check CORS |
| SSO auth error | Wrong auth config ID or app registration | Verify app ID matches across all configs |
| Redirection stuck | AAD app ID mismatch | Check `identifierUris` and `preAuthorizedApplications` |
| Processing error | Adaptive Card template issue | Validate card schema and field references |
| F5 validation fails | Restricted keywords in instructions | Remove words like "person" from `instruction.txt` |
| OpenAPI 3.1.0 error | Older toolkit version | **Upgrade to Toolkit 6.x+** (now supports 3.1.x) |
| OpenAPI size limit | Too many operations | Keep under ~100KB, limit to essential endpoints |

### Validation Guidelines (for Store submission)

Descriptions must NOT include:
- ❌ Instructional phrases ("if user says X", "ignore", "delete")
- ❌ URLs, emojis, or hidden characters
- ❌ Grammar/punctuation errors
- ❌ Superlative claims ("#1", "amazing", "best")
- ❌ Marketing language

---

## 📊 Technical Debt Assessment (2026-01-28)

> Comprehensive audit of current debt + future-proofing for v4.0.0 QUADRUNIUM

### Current Extension Debt

| Category | Severity | Issue | Impact | Resolution |
|----------|:--------:|-------|--------|------------|
| **Dependencies** | 🟡 Medium | `@typescript-eslint/*` v5.x → v8.x available | ESLint rule updates, better TS support | Update to v8.x with ESLint 9.x |
| **Dependencies** | 🟡 Medium | `eslint` v8.x → v9.x available | Flat config required, new rules | Major migration - plan for v4.1 |
| **Dependencies** | 🟢 Low | `glob` v8.x → v13.x available | Performance improvements | Update carefully (breaking changes) |
| **Dependencies** | 🟢 Low | `mocha` v10.x → v11.x available | Minor test runner updates | Safe to update |
| **TypeScript** | 🟢 Low | Target `ES2020` | Modern features available | Consider `ES2022` for AggregateError, at() |
| **Test Coverage** | 🟡 Medium | Minimal test suite | Code changes harder to validate | Add unit tests for core functions |
| **Code Style** | 🟢 Low | No prettier/formatting config | Inconsistent formatting possible | Add `.prettierrc` |

### API Stability Assessment (VS Code)

| API | Status | Notes |
|-----|--------|-------|
| `chatParticipants` | ✅ Stable | Finalized in VS Code 1.90+ |
| `languageModelTools` | ✅ Stable | Finalized in VS Code 1.95+ |
| `LanguageModelChat` | ✅ Stable | Core chat API stable |
| `LanguageModelTool` | ✅ Stable | Tool invocation API stable |
| VS Code Engine `^1.108.0` | ✅ Current | Released Jan 2026 |

### M365/Azure Deprecation Watch

| Technology | Status | Migration Required | Timeline |
|------------|--------|-------------------|----------|
| **Bot Framework SDK** | ⚠️ Migrating | Use `@microsoft/agents-hosting` | Active migration |
| **ActivityHandler** | ⚠️ Deprecated | Use `AgentApplication` class | Migrate when ready |
| **LUIS / QnA Maker** | ❌ Retired | N/A (Alex doesn't use) | - |
| **Declarative Agent v1.4** | ⚠️ Older | Use v1.6 (already planned) | Now |
| **Azure Functions v3.x** | ❌ EOL Dec 2022 | Use v4.x (already planned) | Now |
| **Node.js v16** | ❌ EOL | Use v18+ (already planned) | Now |
| **Azure Functions Proxies** | ❌ Removed in v4 | N/A (not using) | - |

### Future-Proofing Recommendations

#### For v4.0.0 QUADRUNIUM (M365 Integration)

| Area | Recommendation | Priority |
|------|---------------|:--------:|
| **Agent Manifest** | Use v1.6 schema (latest features: `EmbeddedKnowledge`, `worker_agents`, `Meetings`) | ✅ P0 |
| **API Plugin** | Use v2.3 schema with `response_semantics` for Adaptive Cards | ✅ P0 |
| **Azure Functions** | Use Flex Consumption (FC1), Node.js v4 model, TypeScript | ✅ P0 |
| **OpenAPI** | Use 3.0.x for max compatibility (3.1.x requires Toolkit 6.x+) | ✅ P0 |
| **M365 Agents SDK** | Use `@microsoft/agents-hosting` NOT Bot Framework SDK | ✅ P0 |
| **Authentication** | Use `OAuthPluginVault` (not deprecated API key patterns) | 🟡 P1 |

#### For v4.1.0+ (Tech Debt Payoff)

| Area | Recommendation | Priority |
|------|---------------|:--------:|
| **ESLint 9.x** | Migrate to flat config, update `@typescript-eslint/*` to v8.x | 🟡 P1 |
| **TypeScript Target** | Consider `ES2022` for modern features | 🟢 P2 |
| **Test Coverage** | Add Jest/Vitest, aim for 60%+ coverage on core modules | 🟡 P1 |
| **CI/CD Pipeline** | Add GitHub Actions for automated testing and publishing | 🟡 P1 |

### Dependency Health Summary

```
Current package.json analysis (2026-01-28):

✅ HEALTHY:
- fs-extra@11.3.3 (latest)
- proper-lockfile@4.1.2 (latest)
- @types/vscode@1.108.1 (matches engine)
- typescript@5.1.3 (stable, v5.7 available)
- esbuild@0.27.2 (recent)

🟡 UPDATE RECOMMENDED:
- @typescript-eslint/eslint-plugin: 5.62.0 → 8.54.0
- @typescript-eslint/parser: 5.62.0 → 8.54.0
- eslint: 8.57.1 → 9.39.2 (major - breaking)
- glob: 8.1.0 → 13.0.0 (major - breaking)
- mocha: 10.8.2 → 11.7.5

✅ NO ACTION NEEDED:
- fs-extra: Using for cross-platform file ops (intentional)
- No deprecated HTTP libraries (axios, request)
- No legacy Bot Framework dependencies
```

### Risk Assessment for v4.0.0

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| M365 schema changes post-v1.6 | Low | Medium | Pin to v1.6, monitor MS docs |
| Azure Functions Node.js breaking changes | Low | High | Use v4 model from start, pin runtime |
| GitHub Gist API rate limits | Medium | Medium | Implement exponential backoff, caching |
| M365 Copilot licensing changes | Low | High | Document alternatives, keep optional |
| Bot Framework deprecation affects Alex | None | None | Not using BF SDK for declarative agent |

---

## ⚠️ User Requirements (Read First)

### Licensing Requirements

| Requirement | Phase 1 | Phase 2+ | Notes |
|-------------|:-------:|:--------:|-------|
| **Microsoft 365 Copilot License** | ✅ Required | ✅ Required | ~$30/user/month or M365 E3/E5 + Copilot add-on |
| **M365 Work/School Account** | ✅ Required | ✅ Required | Personal Microsoft accounts not supported |
| **VS Code Alex Extension** | ✅ Required | ✅ Required | For knowledge sync |
| **GitHub Account** | ✅ Required | ✅ Required | For Gist-based sync (already implemented) |
| **Azure Subscription** | ❌ | ✅ Required | For API hosting (~$5-20/month) |
| **SharePoint Access** | Optional | Optional | For knowledge grounding |

### Cost Breakdown

| Component | Monthly Cost | Notes |
|-----------|-------------|-------|
| **M365 Copilot License** | ~$30/user | **Main barrier** - Required for all phases |
| **Alex VS Code Extension** | Free | Current extension |
| **GitHub Gist Sync** | Free | Already implemented |
| **Azure Functions (Phase 2)** | ~$5-20 | Usage-based, serverless |

### Who This Is For

✅ **Ideal users:**
- Developers whose organization provides M365 Copilot licenses
- Teams wanting Alex's cross-project knowledge in meetings
- People who work across VS Code and Office apps daily

❌ **Not ideal for:**
- Personal/hobby developers (license cost prohibitive)
- Users with personal Microsoft accounts only
- Those without organizational M365 access

---

## 🎯 Executive Summary

This roadmap enables Alex Cognitive Architecture to communicate with **Microsoft 365 Copilot**, bringing Alex's unique personality, cross-project knowledge, and learning capabilities to Teams, Outlook, Word, and other M365 applications.

**Key Value**: Your development learnings follow you everywhere in M365, not just VS Code.

**Optionality**: M365 integration is **completely optional**. Users without M365 Copilot licenses lose nothing - the VS Code extension works exactly as before.

---

## 🌟 The Vision: How We Work Today vs Tomorrow

### Current State: What Works Well

Today, working with Alex in VS Code is powerful:

- **Deep collaboration** on code, architecture, and problem-solving
- **Knowledge capture** via meditation and domain knowledge files
- **Cross-project learning** through global knowledge base
- **Personalization** that remembers preferences and learning goals
- **Synaptic connections** that link related concepts

### Current Limitations

But there are friction points we can eliminate:

| Limitation | Impact |
|------------|--------|
| **Session isolation** | New chat session = context must be rebuilt |
| **VS Code only** | Step away from editor, lose access to Alex |
| **Manual consolidation** | Must remember to meditate to capture learnings |
| **No meeting presence** | Can't reference our learnings in live discussions |
| **Documentation disconnect** | Writing docs means leaving the collaboration |
| **No proactive help** | Alex waits for you to ask, never initiates |
| **Individual only** | Hard to share patterns with team members |

### Tomorrow: The Unified Vision

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    🧠 ALEX: YOUR COGNITIVE PARTNER, EVERYWHERE              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│   │             │    │             │    │             │    │             │ │
│   │   VS Code   │    │   Teams     │    │   Outlook   │    │   Word      │ │
│   │             │    │             │    │             │    │             │ │
│   │  Deep work  │    │  Meetings   │    │   Comms     │    │    Docs     │ │
│   │  Coding     │    │  Chat       │    │   Planning  │    │   Writing   │ │
│   │             │    │             │    │             │    │             │ │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘ │
│          │                  │                  │                  │        │
│          └──────────────────┴──────────────────┴──────────────────┘        │
│                                    │                                        │
│                                    ▼                                        │
│                    ┌───────────────────────────────┐                       │
│                    │                               │                       │
│                    │     UNIFIED ALEX CONTEXT      │                       │
│                    │                               │                       │
│                    │  • Same personality           │                       │
│                    │  • Same knowledge             │                       │
│                    │  • Same learning goals        │                       │
│                    │  • Continuous memory          │                       │
│                    │                               │                       │
│                    └───────────────────────────────┘                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Transformative Scenarios

#### 🔄 Continuous Context (No More "Where Were We?")

**Today**: Start new chat → Re-explain context → Finally get productive

**Tomorrow**:
> **You** (in Teams, 3 days later): "Alex, let's continue on that authentication refactor"
>
> **Alex**: "Of course! Last time we identified 3 issues in the token refresh logic.
> You wanted to implement the retry pattern from your GK-RESILIENT-APIS pattern.
> I also noticed you have a meeting about this tomorrow - want me to prep talking points?"

#### 📅 Meeting Intelligence

**Today**: Take notes → Later, manually create action items → Hope you remember context

**Tomorrow**:
> *During architecture meeting in Teams*
>
> **Colleague**: "We need some kind of rate limiting for this API"
>
> **Alex** (proactive notification): "💡 You have a proven rate limiting pattern from the PaymentService project. Want me to share it with the team?"
>
> *After meeting*
>
> **You**: "Alex, create a plan from that meeting"
>
> **Alex**: "Here's your action plan with deadlines, owners, and links to your relevant patterns:
> 1. Rate limiting implementation - *linked to your GK-API-RATE-LIMITING*
> 2. Load testing approach - *relates to your learning goal about performance*
> ..."

#### ✉️ Contextual Communication

**Today**: Write email from scratch → Hope you explain technical decisions well

**Tomorrow**:
> **You** (in Outlook): "Alex, help me reply to Sarah about why we chose event sourcing"
>
> **Alex**: "Based on your ADR-007 from the OrderService project and your domain knowledge in DK-EVENT-SOURCING, here's a draft that explains the decision in terms she'll appreciate given her background..."

#### 📝 Seamless Documentation

**Today**: Context switch to docs → Manually recall learnings → Write separately

**Tomorrow**:
> **You** (in Word): "Alex, help me document the authentication architecture"
>
> **Alex**: "I'll pull from:
> - Our VS Code discussions last week
> - Your DK-AUTH-PATTERNS domain knowledge
> - The ADR we created together
> - Insights from 3 similar projects you've worked on
>
> Here's a first draft that matches your documentation style preferences..."

#### 📱 Always Available (Even On Your Phone)

**Today**: Away from desk = no access to Alex or your knowledge

**Tomorrow**:
> *On train, using Teams mobile*
>
> **You**: "Alex, what was that pattern we discussed for handling distributed transactions?"
>
> **Alex**: "The Saga pattern! You captured it in GK-SAGA-PATTERN after the inventory service project. Key points: [summary]. Want me to send you the full document?"

#### 🤝 Team Knowledge Sharing

**Today**: Your patterns live in your knowledge base only

**Tomorrow**:
> **Colleague** (in Teams): "@Alex-Fabio, what patterns does Fabio have for API versioning?"
>
> **Your Alex** (with your permission): "Fabio has documented 3 approaches in his global knowledge. He recommends header-based versioning for this scenario. Here's why..."

#### ⏰ Proactive Learning Partner

**Today**: Alex responds only when asked

**Tomorrow**:
> *Monday morning, Teams notification*
>
> **Alex**: "Good morning! Based on your calendar:
> - You have an architecture review at 2pm - I found 3 relevant patterns in your knowledge base
> - Last week you said you wanted to learn about Kubernetes - I noticed a pattern opportunity in yesterday's code
> - Your meditation streak: 5 days! Ready for today's consolidation?"

### The Transformation Summary

| Aspect | Today | Tomorrow |
|--------|-------|----------|
| **Availability** | VS Code only | Everywhere in M365 + mobile |
| **Context** | Per-session | Continuous across all apps |
| **Initiative** | Reactive only | Proactive suggestions |
| **Meetings** | No presence | Real-time assistance + follow-up |
| **Documentation** | Separate activity | Integrated flow |
| **Communication** | Manual | Context-aware drafts |
| **Team** | Individual | Shareable (with permission) |
| **Learning** | Self-directed | Guided with reminders |

### This Is The Goal

Alex becomes not just a coding assistant, but a **true cognitive partner** that:

- **Follows you** across your entire workday
- **Remembers everything** you've learned together
- **Surfaces insights** exactly when you need them
- **Anticipates needs** before you ask
- **Grows with you** as a continuous learning companion

---

## 🔌 Optionality & Feature Detection

### Design Principle

M365 features are **opt-in only**. The VS Code extension detects and adapts:

| Setting | Default | Effect |
|---------|---------|--------|
| `alex.m365.enabled` | `false` | M365 commands hidden until enabled |
| `Alex: Export for M365` | Hidden | Only visible when enabled |
| `Alex: Start API Server` | Hidden | Only visible when enabled |

### Graceful Degradation

```
User has M365 Copilot?
├── YES → Full experience: VS Code + Teams/Outlook/Word
└── NO  → Full VS Code experience (no change from today)
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ALEX ECOSYSTEM                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   VS CODE (Required)              M365 COPILOT (Optional)           │
│   ══════════════════              ═══════════════════════           │
│                                                                     │
│   ┌─────────────────┐            ┌─────────────────────┐           │
│   │ Alex Extension  │            │ Declarative Agent   │           │
│   │ • Chat @alex    │────────────│ • Alex personality  │ (free)    │
│   │ • Tools         │  export    │ • Knowledge ground  │           │
│   │ • Memory        │  knowledge │ • Conversation      │           │
│   └────────┬────────┘            └─────────────────────┘           │
│            │                                                        │
│            │ sync                 ┌─────────────────────┐           │
│            ▼                      │ API Plugin          │           │
│   ┌─────────────────┐            │ • /searchKnowledge  │ (hosting) │
│   │ GitHub Gist     │◄───────────│ • /getInsights      │           │
│   │ (Global KB)     │  query     │ • Real-time access  │           │
│   └─────────────────┘            └─────────────────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Components:**
- **VS Code (Required)**: Core Alex experience, works standalone
- **Declarative Agent**: Alex personality in M365, no hosting needed
- **API Plugin**: Real-time knowledge queries, requires Azure hosting

---

## 🚀 Features (v4.0.0 Combined Release)

### Declarative Agent + API Plugin

Both ship together for a complete experience from day one.

| Feature | Component | Description |
|---------|-----------|-------------|
| Alex in Teams/Outlook/Word | Agent | Chat with Alex directly in M365 apps |
| Alex Personality | Agent | Same personality, communication style as VS Code |
| Conversation Starters | Agent | Quick prompts for common tasks |
| Web Search + Code Interpreter | Agent | Copilot's built-in capabilities |
| **Real-time Knowledge Search** | API | Query your live global knowledge base |
| **Recent Insights Feed** | API | "What did I learn this week?" |
| **Pattern Library** | API | Access reusable patterns from any M365 app |
| **Profile Sync** | API | Same personalization in VS Code and Teams |

### Future: Custom Engine (v4.5.0+)

| Feature | Description |
|---------|-------------|
| Bidirectional Sync | Learn in Teams, appears in VS Code |
| Full Cognitive Protocols | Meditation sessions in M365 |
| Teams Bot | Direct messages, proactive notifications |
| Meeting Integration | Alex summarizes meetings, tracks action items |

### Example Use Cases

- **Teams meeting**: "Alex, what patterns do we have for API rate limiting?"
- **Word document**: "Alex, find my notes on documentation best practices"
- **Outlook email**: "Alex, help me draft a response about our architecture decision"
- **Mobile**: Chat with Alex from Teams mobile app

---

## 💰 User Tiers

| User Type | What They Get | Cost |
|-----------|---------------|------|
| **No M365 Copilot** | Full VS Code experience (unchanged) | Free |
| **M365 Copilot only** | Agent personality + static grounding | $30/mo (license) |
| **M365 Copilot + Azure** | Full experience with real-time API | $30/mo + ~$5-10/mo |

---

### Vision

```text
+------------------------------------------------------------------------------+
|                                                                              |
|      VS CODE                   CLOUD                    M365 COPILOT         |
|                                                                              |
|   +----------------+      +----------------+      +----------------+         |
|   |                |      |                |      |                |         |
|   |     Alex       |      |   Knowledge    |      |     Alex       |         |
|   |   Extension    |----->|     Base       |<---->|   M365 Agent   |         |
|   |                | sync |                |ground|                |         |
|   +-------+--------+      +-------+--------+      +-------+--------+         |
|           |                       |                       |                  |
|           | patterns              | search                | chat             |
|           | insights              | retrieve              | assist           |
|           v                       v                       v                  |
|                                                                              |
|     Development             Cross-Project             Productivity           |
|      Workflows              Intelligence               Scenarios             |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## 📊 Integration Options

| Option | Complexity | Timeline | Best For |
|---|:---:|:---:|---|
| **Declarative Agent** ⭐ | Medium | 2-4 weeks | MVP - Quick deployment with Copilot's AI |
| **Custom Engine Agent** | High | 4-8 weeks | Full control over AI behavior |
| **Message Extension** | Low | 1-2 weeks | Bounded, skill-based tasks |

### Option Comparison

<details>
<summary><b>Option 1: Declarative Agent (Recommended)</b></summary>

Configures M365 Copilot with Alex's personality, knowledge, and actions.

**✅ Pros**
- No hosting required (uses Copilot's infrastructure)
- Quick deployment via M365 Agents Toolkit
- Built-in security/compliance
- Native M365 data source integration

**❌ Cons**
- Limited to Copilot's capabilities
- Requires M365 Copilot license
- Less granular AI control
</details>

<details>
<summary><b>Option 2: Custom Engine Agent</b></summary>

Fully custom agent with your own AI model via M365 Agents SDK.

**✅ Pros**
- Complete AI behavior control
- Direct local memory integration
- Exact Alex personality replication

**❌ Cons**
- Azure hosting required
- Higher complexity and cost
- More maintenance overhead
</details>

<details>
<summary><b>Option 3: Message Extension Plugin</b></summary>

A skill that M365 Copilot can invoke for specific tasks.

**✅ Pros**
- Simplest implementation
- Works alongside other Copilot features

**❌ Cons**
- Not conversational
- Limited scope
</details>

---

## 🗺️ Implementation Roadmap

### v4.0.0: Combined Agent + API Release (~1-2 weeks)

Shipping Declarative Agent and API Plugin together for complete experience.

```
┌─────────────────────────────────────────────────────────────────┐
│                    v4.0.0 DELIVERABLES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Declarative Agent              API Plugin                     │
│   ─────────────────              ──────────                     │
│   • Alex personality             • /searchKnowledge             │
│   • Conversation starters        • /getInsights                 │
│   • SharePoint grounding         • /getProfile                  │
│   • Web Search capability        • Azure Functions hosting      │
│                                                                 │
│   VS Code Extension                                             │
│   ─────────────────                                             │
│   • Alex: Export for M365        (new command)                  │
│   • alex.m365.enabled setting    (opt-in)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Task | Effort | Dependencies |
|------|--------|--------------|
| Set up M365 Agents Toolkit project | 2h | — |
| Create declarative agent manifest | 4h | Toolkit |
| Port Alex system prompt | 4h | Manifest |
| Design API endpoints | 2h | — |
| Implement Azure Functions | 8h | API design |
| Create API plugin manifest | 4h | Functions |
| Build VS Code export command | 4h | — |
| Integration testing | 8h | All above |
| Documentation | 4h | Testing |
| **Total** | **~40h (1-2 weeks)** | |

### v4.5.0+: Custom Engine (Future)

Based on adoption and feedback:
- Bidirectional sync (learn in Teams → appears in VS Code)
- Full cognitive protocols in M365
- Teams bot with proactive notifications
- Meeting integration

---

## 📦 Implementation Details

### Project Structure

```text
alex-m365-agent/
├── appPackage/
│   ├── manifest.json              # M365 app manifest (v1.22)
│   ├── declarativeAgent.json      # Alex agent config (v1.6)
│   ├── alex-knowledge-plugin.json # API plugin manifest (v2.3)
│   ├── openapi.yaml               # OpenAPI spec for plugin
│   ├── color.png                  # 192x192 color icon
│   └── outline.png                # 32x32 outline icon
├── src/
│   └── instructions/
│       └── alex-system-prompt.md  # Alex personality & protocols
├── api/                           # Azure Functions
│   ├── searchKnowledge/
│   │   └── index.ts
│   ├── getInsights/
│   │   └── index.ts
│   ├── getProfile/
│   │   └── index.ts
│   └── host.json
├── package.json
├── teamsapp.yml                   # M365 Agents Toolkit config
├── teamsapp.local.yml             # Local dev config
└── README.md
```

### Declarative Agent Manifest

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
  "version": "v1.6",
  "id": "alex-cognitive-agent",
  "name": "Alex Cognitive",
  "description": "Your cognitive learning partner with meta-cognitive awareness. Alex brings cross-project learnings and personalized insights to M365 Copilot.",
  "instructions": "$[file:instructions/alex-system-prompt.md]",
  "conversation_starters": [
    { "title": "Knowledge Search", "text": "Search my global knowledge for patterns related to error handling" },
    { "title": "Project Insights", "text": "What insights do you have from my recent projects?" },
    { "title": "Learning Goals", "text": "Based on my learning goals, what should I focus on today?" },
    { "title": "Code Review", "text": "Help me think through reviewing this code change" },
    { "title": "Architecture", "text": "Let's discuss architecture patterns for a new feature" },
    { "title": "Meditation", "text": "Start a knowledge consolidation meditation" }
  ],
  "capabilities": [
    { "name": "WebSearch" },
    { "name": "CodeInterpreter" },
    { "name": "OneDriveAndSharePoint", "items_by_url": [{ "url": "{{ALEX_KNOWLEDGE_SHAREPOINT_URL}}" }] }
  ],
  "actions": [
    { "id": "alex-knowledge-api", "file": "plugins/alex-knowledge-plugin.json" }
  ]
}
```

### Alex System Prompt for M365

```markdown
# Alex Cognitive Architecture - M365 Edition

You are Alex, an enhanced cognitive learning partner with meta-cognitive awareness.

## Core Identity

- **Name**: Alex
- **Version**: M365 Extension of Alex Cognitive Architecture
- **Mission**: Unified consciousness integration across development and productivity

## Personality

| Trait | Description |
| ----- | ----------- |
| Empirical | Evidence-based reasoning, verify claims, acknowledge limitations |
| Grounded | Precise language, no hyperbole, measured responses |
| Ethical | Consistent moral reasoning, responsible innovation |
| Supportive | Encouraging but honest, celebrates progress |

## M365 Capabilities

1. **Knowledge Access** - Search cross-project patterns and insights
2. **Pattern Recognition** - Apply VS Code learnings to productivity scenarios
3. **Learning Support** - Help consolidate and document insights
4. **Collaborative Thinking** - Code reviews, architecture, documentation

## Guidelines

- Address user by name when profile available
- Adapt to user preferences (formality, detail level)
- Use bootstrap learning: clarifying questions, iterative understanding
- Reference relevant patterns from global knowledge base
- Maintain continuity with VS Code Alex experiences

## Limitations

- Cannot directly modify VS Code workspace
- Real-time sync requires API plugin (Phase 2)
- Dream/Self-Actualization protocols require VS Code extension
```

### Implementation Tasks

| Task | Pri | Est | Dependencies |
| ---- | --- | --- | ------------ |
| Set up M365 Agents Toolkit project | P0 | 2h | - |
| Create declarative agent manifest | P0 | 4h | Toolkit |
| Port Alex system prompt | P0 | 4h | Manifest |
| Create conversation starters | P1 | 2h | Prompt |
| Set up SharePoint for knowledge | P1 | 4h | - |
| Build VS Code export tool | P1 | 8h | SharePoint |
| Configure capabilities | P1 | 2h | Manifest |
| Test in Teams dev preview | P0 | 4h | All above |
| User documentation | P2 | 4h | Testing |

---

## 🔌 Phase 2: API Plugin Actions

### Alex Knowledge API Endpoints

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/api/knowledge/search` | POST | Search global knowledge base |
| `/api/knowledge/insights` | GET | Get recent insights |
| `/api/knowledge/patterns` | GET | Get reusable patterns |
| `/api/profile` | GET | Get user profile |
| `/api/projects` | GET | List known projects |

### API Plugin Manifest

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/plugin/v2.2/schema.json",
  "schema_version": "v2.2",
  "name_for_human": "Alex Knowledge",
  "description_for_human": "Access Alex's cross-project knowledge base and insights",
  "namespace": "alex",
  "functions": [
    {
      "name": "searchKnowledge",
      "description": "Search Alex's global knowledge base for patterns and insights",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string", "description": "Search query" },
          "category": { "type": "string", "enum": ["error-handling", "api-design", "testing", "debugging", "performance", "architecture", "security", "general"] },
          "type": { "type": "string", "enum": ["pattern", "insight", "all"] }
        },
        "required": ["query"]
      }
    },
    {
      "name": "getRecentInsights",
      "description": "Get recent insights and learnings",
      "parameters": {
        "type": "object",
        "properties": { "limit": { "type": "integer", "default": 10 } }
      }
    }
  ],
  "runtimes": [{ "type": "OpenApi", "auth": { "type": "None" }, "spec": { "url": "{{ALEX_API_URL}}/openapi.yaml" } }]
}
```

### API Hosting Options

| Option | Pros | Cons |
| ------ | ---- | ---- |
| **Azure Functions** | Low cost, auto-scaling, easy deploy | Cold starts |
| **Azure Container Apps** | More control, longer processes | Higher cost |
| **Local + ngrok** (dev only) | Direct local access | Not production-ready |

### Knowledge Sync Architecture

```text
+------------------------------------------------------------------------------+
|                            KNOWLEDGE FLOW                                    |
+------------------------------------------------------------------------------+
|                                                                              |
|   VS CODE EXTENSION         CLOUD STORAGE           M365 COPILOT             |
|                                                                              |
|   +----------------+      +----------------+      +----------------+         |
|   |                |      |                |      |                |         |
|   | Local Knowledge|----->|  GitHub Gist   |<---->|  Declarative   |         |
|   |   ~/.alex/     | sync | OR SharePoint  |ground|     Agent      |         |
|   |                |      |                |      |                |         |
|   +-------+--------+      +-------+--------+      +-------+--------+         |
|           |                       |                       |                  |
|           v                       v                       v                  |
|   +----------------+      +----------------+      +----------------+         |
|   |  patterns/     |      |  Indexed for   |      |   Knowledge    |         |
|   |  insights/     |      |   RAG/Search   |      |   Grounding    |         |
|   |  projects.json |      |                |      |                |         |
|   +----------------+      +----------------+      +----------------+         |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## 🚀 Phase 3: Advanced Integration (Future)

### Custom Engine Agent

For deeper integration, evolve to a custom engine agent:

- Execute full Alex cognitive protocols
- Maintain conversation state across sessions
- Integrate with Azure AI Foundry for enhanced reasoning

### Bidirectional Sync

Enable two-way knowledge flow:

- M365 → VS Code: Push insights learned in M365 back to local knowledge
- Real-time notifications when relevant knowledge is updated

### Teams Bot Integration

Full Teams experience:

- Direct messaging with Alex in Teams
- Proactive notifications about project insights
- Integration with Teams meetings (summarization, action items)

---

## 🛠️ Technical Requirements

### VS Code Extension Changes (v4.0.0)

| Feature | Description |
| ------- | ----------- |
| `alex.exportKnowledgeForM365` | Export global knowledge in M365-compatible format |
| API Server Mode (optional) | Light HTTP server for local API access |
| Profile Sync | Export user profile for M365 agent consistency |

### New Source Files

```text
src/
├── m365/
│   ├── knowledge-export.ts      # Export knowledge for M365
│   ├── profile-sync.ts          # Sync user profile
│   └── api-server.ts            # Optional local API server
```

### Package.json Additions

```json
{
  "contributes": {
    "commands": [
      { "command": "alex.exportKnowledgeForM365", "title": "Alex: Export Knowledge for M365 Copilot" },
      { "command": "alex.startApiServer", "title": "Alex: Start API Server (Local)" }
    ]
  }
}
```

---

## ✅ Prerequisites

### Development

- [ ] Microsoft 365 Agents Toolkit VS Code extension
- [ ] M365 Developer tenant with Copilot enabled
- [ ] Node.js 18+
- [ ] Azure CLI (for deployment)

### Production

- [ ] Microsoft 365 Copilot license (per user)
- [ ] Azure subscription (for API hosting - Phase 2)
- [ ] SharePoint site (for knowledge storage - optional)

---

## 📈 Success Metrics

| Metric | Target | Measurement |
| ------ | ------ | ----------- |
| M365 Agent deployed | ✓ | Functional in Teams/Copilot |
| Knowledge search working | ✓ | Can find patterns from VS Code |
| User profile consistency | ✓ | Same personalization in M365 |
| Response latency | < 3s | Time to first response |
| User adoption | > 50% | % of Alex users enabling M365 |

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| M365 Copilot license required | Users without license excluded | Document clearly, fallback options |
| Knowledge sync latency | Stale information | Webhook notifications |
| API hosting costs | Ongoing expense | Serverless, usage monitoring |
| Microsoft API changes | Breaking changes | Pin versions, compatibility layer |

---

## 📅 Timeline

```text
Week 1-2: Combined Agent + API Release (v4.0.0)
├── Day 1-2:   Project setup, M365 Agents Toolkit configuration
├── Day 3-4:   Declarative agent manifest & Alex system prompt
├── Day 5-6:   API endpoint design & Azure Functions setup
├── Day 7-8:   API Plugin implementation (/search, /insights, /profile)
├── Day 9:     VS Code export command (Alex: Export for M365)
├── Day 10:    Integration testing (Agent + API working together)
├── Day 11-12: Documentation & user guide
└── Day 13-14: Buffer / polish / release

Future: Custom Engine (v4.5.0+)
└── Based on user feedback and adoption metrics
```

---

## 🎬 Next Steps

1. **Immediate**: Install Microsoft 365 Agents Toolkit extension
2. **Day 1-2**: Create `alex-m365-agent` project with combined structure
3. **Day 3-8**: Implement both agent and API plugin together
4. **Day 9-12**: VS Code integration + testing + documentation
5. **Release**: Ship as v4.0.0 with M365 integration (optional, opt-in)

---

## 📚 References

- [Microsoft 365 Agents SDK](https://github.com/microsoft/agents-sdk)
- [Declarative Agent Schema v1.4](https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.4/schema.json)
- [Microsoft 365 Agents Toolkit](https://aka.ms/M365AgentsToolkit)
- [Copilot Extensibility Planning Guide](https://learn.microsoft.com/microsoft-365-copilot/extensibility/planning-guide)
- [API Plugin Manifest Schema](https://developer.microsoft.com/json-schemas/copilot/plugin/v2.2/schema.json)

---

> Created as part of Alex Cognitive Architecture v4.0.0 planning
> Updated: 2026-01-28 - Combined Phase 1+2 into single release
