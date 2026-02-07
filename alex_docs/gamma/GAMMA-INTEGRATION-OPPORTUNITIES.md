# Gamma Integration Opportunities — Ranked

> **10 integration opportunities ranked by impact, effort, and urgency**

|                  |                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Author**       | Fabio Correa                                                                                                       |
| **Date**         | February 7, 2026                                                                                                   |
| **Alex Version** | v5.0.1                                                                                                             |
| **Related**      | [GAMMA-ECOSYSTEM-ANALYSIS.md](GAMMA-ECOSYSTEM-ANALYSIS.md), [GAMMA-ENHANCEMENT-PLAN.md](GAMMA-ENHANCEMENT-PLAN.md) |

---

## How to Read This

Each opportunity includes:
- **Impact** (🔴 High / 🟡 Medium / 🟢 Low) — user-facing benefit
- **Effort** (T-shirt size) — development hours
- **Urgency** — time-sensitive or strategic
- **Roadmap target** — which Alex release

---

## O1. Migrate gamma-generator.js from v0.2 to v1.0

| Field          | Value                                         |
| -------------- | --------------------------------------------- |
| **Impact**     | 🔴 High                                        |
| **Effort**     | S (2-4 hours)                                 |
| **Urgency**    | 🔴 **CRITICAL** — v0.2 deprecated Jan 16, 2026 |
| **Status**     | ✅ **Completed Feb 7, 2026**                   |
| **Roadmap**    | v5.0.2                                        |
| **Depends on** | —                                             |

### What

~~The `scripts/gamma-generator.js` file uses `API_VERSION = 'v0.2'` (line 26). Gamma deprecated v0.2 on January 16, 2026. The script stopped working.~~

**RESOLVED**: Migrated `API_VERSION` from `'v0.2'` to `'v1.0'`. Also added `--instructions` and `--image-source` CLI arguments.

### Why

Without this fix, Alex's entire Gamma capability is non-functional. This blocks all other Gamma improvements.

### How

1. Change `API_VERSION` from `'v0.2'` to `'v1.0'`
2. Update endpoint paths (v1.0 uses `/v1.0/generations` not `/v0.2/generate`)
3. Map existing CLI parameters to v1.0 request body format
4. Update status polling (v1.0 response format may differ)
5. Test generation + export + auto-open

### Acceptance Criteria

- [ ] Script generates presentations using v1.0 endpoints
- [ ] `--export pptx` and `--export pdf` still work
- [ ] `--draft` mode unchanged (no API dependency)
- [ ] `--open` flag still launches exported file

---

## O2. Add `additionalInstructions` Parameter

| Field          | Value                       |
| -------------- | --------------------------- |
| **Impact**     | 🟡 Medium                    |
| **Effort**     | XS (1 hour)                 |
| **Urgency**    | Low                         |
| **Status**     | ✅ **Completed Feb 7, 2026** |
| **Roadmap**    | v5.0.2 (alongside O1)       |
| **Depends on** | O1                          |

### What

~~v1.0 adds `additionalInstructions` (1-2000 chars) — extra guidance for the AI beyond the main content. Alex doesn't pass this parameter.~~

**RESOLVED**: Added `--instructions` / `-i` CLI argument mapped to `additionalInstructions`.

### Why

Allows users to say things like "Make it professional but approachable" or "Include a call-to-action on the last slide" without putting that guidance in the main content.

### How

1. Add `--instructions "..."` CLI argument
2. Pass as `additionalInstructions` in API request body
3. Update SKILL.md with examples

---

## O3. Create from Template Support

| Field          | Value         |
| -------------- | ------------- |
| **Impact**     | 🔴 High        |
| **Effort**     | M (4-8 hours) |
| **Urgency**    | Medium        |
| **Status**     | ❌ Not started |
| **Roadmap**    | v5.1.0        |
| **Depends on** | O1            |

### What

v1.0 introduces `POST /v1.0/generations/from-template` (Beta) — generate new content that follows the structure and styling of an existing Gamma. Requires a `gammaId` and a `prompt`.

### Why

This is transformative for brand consistency:
- Create one "Fabio Correa Research Update" template in Gamma
- Use Alex to generate weekly variations with different content
- All presentations share consistent branding, layout, tone

### How

1. Add `--template <gammaId>` CLI argument
2. Implement `POST /v1.0/generations/from-template` call
3. Allow combining with `--file` input (prompt = file content)
4. Add theme override via `--theme` when using templates
5. Update SKILL.md with template workflow examples

### Acceptance Criteria

- [ ] `--template <id> --file input.md` generates from template
- [ ] `--template <id> --topic "Weekly Update"` generates from prompt
- [ ] Exports work with template-based generations
- [ ] SKILL.md documents the template workflow

---

## O4. Theme Browsing and Selection

| Field          | Value         |
| -------------- | ------------- |
| **Impact**     | 🟡 Medium      |
| **Effort**     | S (2-4 hours) |
| **Urgency**    | Low           |
| **Status**     | ❌ Not started |
| **Roadmap**    | v5.1.0        |
| **Depends on** | O1            |

### What

v1.0 adds `GET /v1.0/themes` — search and list themes by name, color, and tone keywords. Currently Alex uses workspace defaults.

### Why

Themes dramatically affect presentation quality. Being able to search "dark modern" or "academic" and apply matching themes elevates output quality.

### How

1. Add `gamma themes [--query "dark"]` CLI subcommand
2. Display theme names + IDs + keywords
3. Add `--theme <themeId>` to generation command
4. Cache theme list for offline reference (theme IDs are stable)

---

## O5. Header/Footer Branding

| Field          | Value         |
| -------------- | ------------- |
| **Impact**     | 🟡 Medium      |
| **Effort**     | S (2-4 hours) |
| **Urgency**    | Low           |
| **Status**     | ❌ Not started |
| **Roadmap**    | v5.1.0        |
| **Depends on** | O1            |

### What

v1.0 adds `cardOptions.headerFooter` — 6 position slots (topLeft/Right/Center, bottomLeft/Right/Center) for text, images (logos), card numbers, or theme logos.

### Why

Professional presentations need consistent branding. Users can put their logo in topRight, page numbers in bottomCenter, and date in bottomLeft — all via API.

### How

1. Add `--header-footer` CLI argument (JSON or shorthand syntax)
2. Support common presets: `--branding standard` (logo top-right, page bottom-center)
3. Allow `--logo <url>` shorthand for logo placement
4. Update SKILL.md

---

## O6. Sharing Options

| Field          | Value         |
| -------------- | ------------- |
| **Impact**     | 🟡 Medium      |
| **Effort**     | S (2-4 hours) |
| **Urgency**    | Low           |
| **Status**     | ❌ Not started |
| **Roadmap**    | v5.1.0        |
| **Depends on** | O1            |

### What

v1.0 adds `sharingOptions` — workspace access levels, external access, and email-based sharing with per-recipient permissions.

### Why

Currently Alex generates content and the user manually shares. With sharing options, Alex can generate AND distribute in one command.

### How

1. Add `--share <emails>` CLI argument
2. Add `--workspace-access <level>` argument
3. Support access levels: `noAccess`, `view`, `comment`, `edit`, `fullAccess`
4. Update SKILL.md

---

## O7. Folder Organization

| Field          | Value         |
| -------------- | ------------- |
| **Impact**     | 🟢 Low         |
| **Effort**     | XS (1 hour)   |
| **Urgency**    | Low           |
| **Status**     | ❌ Not started |
| **Roadmap**    | v5.1.0        |
| **Depends on** | O1            |

### What

v1.0 adds `folderIds` parameter and `GET /v1.0/folders` — save generated content to specific workspace folders.

### Why

Users who generate many presentations need organization. Alex can save to "Research Talks" or "Client Decks" automatically.

### How

1. Add `gamma folders [--query "Research"]` CLI subcommand
2. Add `--folder <folderId>` to generation command
3. Auto-create folders if needed (or report error)

---

## O8. VS Code Chat Command Integration

| Field          | Value          |
| -------------- | -------------- |
| **Impact**     | 🔴 High         |
| **Effort**     | L (8-16 hours) |
| **Urgency**    | Medium         |
| **Status**     | ❌ Not started  |
| **Roadmap**    | v5.1.0         |
| **Depends on** | O1             |

### What

Currently Gamma is only accessible via CLI (`node scripts/gamma-generator.js`). It should be available through Alex's VS Code chat interface.

### Why

The skill exists (`gamma-presentations`) but the VS Code extension has no command/tool that calls the Gamma API. Users must drop to the terminal. This is inconsistent with the chat-first interaction model.

### How

1. Add `@alex /gamma "Create a presentation about..."` chat command
2. Register Gamma API key in VS Code secrets
3. Implement Gamma client as VS Code extension module
4. Support: topic generation, file-based generation, theme selection
5. Return Gamma URL in chat response
6. Auto-download exports to workspace

---

## O9. M365 Copilot → Gamma Bridge

| Field          | Value                                    |
| -------------- | ---------------------------------------- |
| **Impact**     | 🔴 High                                   |
| **Effort**     | XL (16-40 hours)                         |
| **Urgency**    | Low — depends on M365 API plugin support |
| **Status**     | ❌ Not started                            |
| **Roadmap**    | v5.2.0+                                  |
| **Depends on** | O1, M365 API plugin infrastructure       |

### What

Enable M365 Copilot Alex to generate Gamma presentations via API plugin. User says "Create a presentation about this meeting" in Teams, and Alex calls Gamma.

### Why

Bridges two platforms: M365 communication + Gamma content creation. Meeting notes → presentation is a high-value workflow.

### How

1. Define OpenAPI spec for Gamma's Generate API
2. Register as M365 API plugin in Alex's M365 agent
3. Handle auth (API key storage in M365 context)
4. Return Gamma URL as adaptive card in Teams

---

## O10. Curated Template Library

| Field          | Value                            |
| -------------- | -------------------------------- |
| **Impact**     | 🟡 Medium                         |
| **Effort**     | M (4-8 hours + ongoing curation) |
| **Urgency**    | Low                              |
| **Status**     | ❌ Not started                    |
| **Roadmap**    | v5.2.0+                          |
| **Depends on** | O3                               |

### What

A curated set of Gamma templates optimized for Alex's common use cases: research update, project pitch, weekly standup, course lecture, academic poster.

### Why

Templates reduce generation time and ensure quality. Users get professional output without specifying design parameters.

### How

1. Create 5-10 templates in Gamma's web editor
2. Document `gammaId` for each template
3. Add `--preset research-update` shorthand to CLI
4. SKILL.md includes template catalog
5. Community-contributed templates via knowledge base

---

## Dependency Graph

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'edgeLabelBackground':'#ffffff', 'lineColor': '#57606a' }}}%%
flowchart LR
    subgraph Done["v5.0.2 ✅"]
        O1["O1: v1.0 Migration"]
        O2["O2: Instructions"]
    end

    subgraph Next["v5.1.0"]
        direction TB
        O3["O3: Templates (M)"]
        O4["O4: Themes (S)"]
        O5["O5: Headers (S)"]
        O6["O6: Sharing (S)"]
        O7["O7: Folders (XS)"]
        O8["O8: Chat Cmd (L)"]
    end

    subgraph Future["v5.2.0+"]
        O9["O9: M365 Bridge (XL)"]
        O10["O10: Template Lib (M)"]
    end

    O1 --> O2
    O1 --> Next
    O3 --> O10
    O8 --> O9

    style O1 fill:#d3f5db,color:#1a7f37,stroke:#6fdd8b,stroke-width:3px
    style O2 fill:#d3f5db,color:#1a7f37,stroke:#6fdd8b
    style O3 fill:#fff8c5,color:#9a6700,stroke:#d4a72c
    style O4 fill:#ddf4ff,color:#0550ae,stroke:#80ccff
    style O5 fill:#ddf4ff,color:#0550ae,stroke:#80ccff
    style O6 fill:#ddf4ff,color:#0550ae,stroke:#80ccff
    style O7 fill:#ddf4ff,color:#0550ae,stroke:#80ccff
    style O8 fill:#fff8c5,color:#9a6700,stroke:#d4a72c
    style O9 fill:#d8b9ff,color:#6639ba,stroke:#bf8aff
    style O10 fill:#d8b9ff,color:#6639ba,stroke:#bf8aff
    style Done fill:#d3f5db33,stroke:#6fdd8b
    style Next fill:#ddf4ff33,stroke:#80ccff
    style Future fill:#d8b9ff33,stroke:#bf8aff
    linkStyle default stroke:#57606a,stroke-width:1.5px
```

**Figure 1:** *Opportunity dependency graph — done (green), next (blue), future (purple)*

## Timeline

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'edgeLabelBackground':'#ffffff', 'lineColor': '#57606a' }}}%%
gantt
    title Gamma Integration Roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section v5.0.2 (URGENT)
        O1 v0.2→v1.0 Migration    :done, crit, o1, 2026-02-07, 1d
        O2 additionalInstructions  :done, o2, after o1, 1d

    section v5.1.0
        O3 Create from Template    :o3, 2026-02-14, 4d
        O4 Theme Browsing          :o4, 2026-02-14, 2d
        O5 Header/Footer           :o5, after o4, 2d
        O6 Sharing Options         :o6, after o5, 2d
        O7 Folder Organization     :o7, after o4, 1d
        O8 VS Code Chat Command    :o8, after o3, 8d

    section v5.2.0+
        O9 M365 Bridge             :o9, 2026-03-15, 16d
        O10 Template Library       :o10, after o9, 5d
```

**Figure 2:** *Gamma integration roadmap — 3-phase Gantt timeline*

---

## Priority Matrix

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'edgeLabelBackground':'#ffffff', 'lineColor': '#57606a' }}}%%
quadrantChart
    title Impact vs Urgency
    x-axis Low Urgency --> Critical Urgency
    y-axis Low Impact --> High Impact
    quadrant-1 Do Now
    quadrant-2 Plan Next
    quadrant-3 Nice to Have
    quadrant-4 Quick Wins
    O1 v1.0 Migration: [0.95, 0.95]
    O2 Instructions: [0.7, 0.4]
    O3 Templates: [0.5, 0.9]
    O8 Chat Command: [0.5, 0.85]
    O9 M365 Bridge: [0.3, 0.85]
    O4 Themes: [0.35, 0.5]
    O5 Headers: [0.35, 0.5]
    O6 Sharing: [0.35, 0.5]
    O10 Library: [0.25, 0.55]
    O7 Folders: [0.2, 0.25]
```

**Figure 3:** *Impact vs Urgency priority matrix — quadrant positioning of O1–O10*

**Recommended execution order**: O1 → O2 → O3 → O4 → O8 → O5 → O6 → O7 → O9 → O10

---

*Analysis performed February 7, 2026 — Alex Cognitive Architecture v5.0.1*
