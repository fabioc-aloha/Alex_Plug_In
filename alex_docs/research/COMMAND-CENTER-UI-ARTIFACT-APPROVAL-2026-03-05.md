# Command Center UI Artifact Approval

**Author**: Alex Finch + GitHub Copilot
**Date**: March 5, 2026
**Purpose**: Review and approve the active Command Center UI artifacts before implementation
**Scope**: Active v2 tab mockups and their implementation-readiness notes
**Status**: Pending approval

---

## How To Use This Document

This document is the visual approval sheet for the active Command Center mockups.

- Review each thumbnail inline in Markdown preview.
- Mark `A` in the **Approved** column when the artifact is approved for implementation.
- Use the **Notes** column for required changes before approval.
- Treat only the artifacts in this document as active UI inputs.

**Open in VS Code Preview** (`Ctrl+Shift+V`) to see all thumbnails rendered inline.

---

## Approval Criteria

Approve an artifact only if it is strong enough on all four dimensions:

1. **Information hierarchy**: the most important action or information is obvious at sidebar width.
2. **Density discipline**: the layout fits the 300px-style sidebar target without collapsing into long-scroll clutter.
3. **North Star fit**: the surface feels specific to Alex rather than interchangeable with a generic AI tool.
4. **Implementation realism**: the artifact does not rely on unproven runtime behavior for its first-wave version.

---

## Active v2 Mockups

These are the only active mockups that should be approved for current implementation planning.

| # | Artifact | Thumbnail | Purpose | First-wave Relevance | Approved | Notes |
|---|----------|-----------|---------|----------------------|----------|-------|
| 1 | Mission Ctrl | ![Mission Ctrl](mockups/command-center-v2-mission-control.svg) | Operational dashboard for status, nudges, commands, settings, and actions | Yes, core first-wave tab |  |  |
| 2 | Agents | ![Agents](mockups/command-center-v2-agent-hub.svg) | Agent registry, thread concepts, and specialist-agent surface | No, advanced-contract wave |  |  |
| 3 | Skill Store | ![Skill Store](mockups/command-center-v2-skill-store.svg) | Skill browsing, toggles, and catalog organization | No, advanced-contract wave |  |  |
| 4 | Mind | ![Mind](mockups/command-center-v2-mind.svg) | Cognitive architecture, health, memory, and introspection surface | No, reduced-scope until model contracts exist |  |  |
| 5 | Docs | ![Docs](mockups/command-center-v2-docs.svg) | AlexLearn-aligned documentation and learning hub | Yes, core first-wave tab |  |  |

---

## Artifact Review Notes

### 1. Mission Ctrl

**What to approve:**
- card hierarchy
- density at sidebar width
- placement of status, nudges, and quick actions
- overall feel of the operational home tab

**What not to assume from approval:**
- that every card ships in Wave 1
- that all status/telemetry values already exist as runtime contracts

### 2. Agents

**What to approve:**
- the surface concept
- the registry/thread layout direction
- whether this feels distinct from Mission Ctrl

**What not to assume from approval:**
- that live agent-state semantics are already defined
- that queueing, routing, or thread history is implementation-ready

### 3. Skill Store

**What to approve:**
- the browsing model
- catalog density
- toggle/card visual language

**What not to assume from approval:**
- that enable/disable/install behavior is already fully specified
- that curated vs experimental behavior is ready for implementation

### 4. Mind

**What to approve:**
- the differentiated product direction
- the information hierarchy for architecture and introspection
- whether this expresses the North Star clearly

**What not to assume from approval:**
- that all shown memory/introspection concepts exist as live runtime data today
- that the full conceptual model belongs in the first implementation wave

### 5. Docs

**What to approve:**
- AlexLearn alignment
- study-guide and facilitator-resource grouping
- local-doc entry-point layout

**What not to assume from approval:**
- that the tab mirrors the entire Learn Alex website
- that every site page belongs in the extension sidebar

---

## Approval Summary

| Artifact Group | Count | Review Mode | Approval Goal |
|----------------|-------|-------------|---------------|
| Active v2 tab mockups | 5 | Thumbnail review | Approve implementation-grade layout direction |
| First-wave tabs | 2 | Mission Ctrl + Docs | Approve for immediate UI execution |
| Advanced-wave tabs | 3 | Agents + Skill Store + Mind | Approve as target-state direction, subject to contract gating |

---

## Badge Approval

These badge families do not yet exist as standalone generated approval assets in the repo, so this document includes compact badge boards to select a visual direction before implementation.

| # | Badge Family | Thumbnail | Use Case | Options | Approved | Notes |
|---|--------------|-----------|----------|---------|----------|-------|
| 6 | Agent status badges | ![Agent status badges](mockups/badges/agent-status-badges.svg) | Agents tab and operational status chips | A = filled pill, B = outline chip, C = dot-plus-label |  |  |
| 7 | Skill badges | ![Skill badges](mockups/badges/skill-badges.svg) | Trifecta, active, and skill taxonomy markers | A = filled pill, B = outline chip, C = compact key |  |  |
| 8 | Mind / health badges | ![Mind health badges](mockups/badges/mind-health-badges.svg) | Brain health and confidence severity markers | A = hero pill, B = severity chips, C = dot keys |  |  |
| 9 | Notification / count badges | ![Notification badges](mockups/badges/notification-badges.svg) | Sidebar badge, queue count, alert markers | A = circular count, B = rounded count pill, C = alert dot |  |  |
| 10 | Doc count badges | ![Doc count badges](mockups/badges/doc-count-badges.svg) | Docs tab section counts and file totals | A = pill count, B = circular count, C = explicit count label |  |  |

---

## Icon Approval

The icon system is already generated and approval-ready. The tables below are copied into this document so artifact approval can happen in one place.

These icon and avatar boards were generated before the revised Command Center UI asset rules were written into `alex_docs/DK-correax-brand.md`.

Use this round to approve **direction and metaphor**, not final polish. Final implementation approval should happen after the assets are regenerated under the updated vector, stroke, depth, and color rules.

### Tab Bar Icons

| # | Position | Description | Option A | Option B | Option C | Approved |
|---|----------|-------------|----------|----------|----------|----------|
| 11 | Mission Control | Dashboard / status overview | ![A](mockups/icons/tabs/mission-a.svg) | ![B](mockups/icons/tabs/mission-b.svg) | ![C](mockups/icons/tabs/mission-c.svg) |  |
| 12 | Agents | Agent hub / team management | ![A](mockups/icons/tabs/agents-a.svg) | ![B](mockups/icons/tabs/agents-b.svg) | ![C](mockups/icons/tabs/agents-c.svg) |  |
| 13 | Skill Store | Skill catalog / capabilities | ![A](mockups/icons/tabs/skills-a.svg) | ![B](mockups/icons/tabs/skills-b.svg) | ![C](mockups/icons/tabs/skills-c.svg) |  |
| 14 | Mind | Brain / cognitive architecture | ![A](mockups/icons/tabs/mind-a.svg) | ![B](mockups/icons/tabs/mind-b.svg) | ![C](mockups/icons/tabs/mind-c.svg) |  |
| 15 | Docs | Documentation / reference | ![A](mockups/icons/tabs/docs-a.svg) | ![B](mockups/icons/tabs/docs-b.svg) | ![C](mockups/icons/tabs/docs-c.svg) |  |

### Agent Mode Icons

| # | Agent | Option A | Option B | Option C | Approved |
|---|-------|----------|----------|----------|----------|
| 16 | Alex | ![A](mockups/icons/agents/alex-a.svg) | ![B](mockups/icons/agents/alex-b.svg) | ![C](mockups/icons/agents/alex-c.svg) |  |
| 17 | Researcher | ![A](mockups/icons/agents/researcher-a.svg) | ![B](mockups/icons/agents/researcher-b.svg) | ![C](mockups/icons/agents/researcher-c.svg) |  |
| 18 | Builder | ![A](mockups/icons/agents/builder-a.svg) | ![B](mockups/icons/agents/builder-b.svg) | ![C](mockups/icons/agents/builder-c.svg) |  |
| 19 | Validator | ![A](mockups/icons/agents/validator-a.svg) | ![B](mockups/icons/agents/validator-b.svg) | ![C](mockups/icons/agents/validator-c.svg) |  |
| 20 | Documentarian | ![A](mockups/icons/agents/documentarian-a.svg) | ![B](mockups/icons/agents/documentarian-b.svg) | ![C](mockups/icons/agents/documentarian-c.svg) |  |
| 21 | Azure | ![A](mockups/icons/agents/azure-a.svg) | ![B](mockups/icons/agents/azure-b.svg) | ![C](mockups/icons/agents/azure-c.svg) |  |
| 22 | M365 | ![A](mockups/icons/agents/m365-a.svg) | ![B](mockups/icons/agents/m365-b.svg) | ![C](mockups/icons/agents/m365-c.svg) |  |

---

## Avatar Approval

For approval purposes, avatars are split into state avatars, persona avatars, and the neutral fallback avatar. These selections determine what Alex looks like when no richer art asset is used.

### Cognitive State Avatars

| # | State | Option A | Option B | Option C | Approved |
|---|-------|----------|----------|----------|----------|
| 23 | Building | ![A](mockups/icons/states/building-a.svg) | ![B](mockups/icons/states/building-b.svg) | ![C](mockups/icons/states/building-c.svg) |  |
| 24 | Debugging | ![A](mockups/icons/states/debugging-a.svg) | ![B](mockups/icons/states/debugging-b.svg) | ![C](mockups/icons/states/debugging-c.svg) |  |
| 25 | Planning | ![A](mockups/icons/states/planning-a.svg) | ![B](mockups/icons/states/planning-b.svg) | ![C](mockups/icons/states/planning-c.svg) |  |
| 26 | Reviewing | ![A](mockups/icons/states/reviewing-a.svg) | ![B](mockups/icons/states/reviewing-b.svg) | ![C](mockups/icons/states/reviewing-c.svg) |  |
| 27 | Learning | ![A](mockups/icons/states/learning-a.svg) | ![B](mockups/icons/states/learning-b.svg) | ![C](mockups/icons/states/learning-c.svg) |  |
| 28 | Teaching | ![A](mockups/icons/states/teaching-a.svg) | ![B](mockups/icons/states/teaching-b.svg) | ![C](mockups/icons/states/teaching-c.svg) |  |
| 29 | Meditation | ![A](mockups/icons/states/meditation-a.svg) | ![B](mockups/icons/states/meditation-b.svg) | ![C](mockups/icons/states/meditation-c.svg) |  |
| 30 | Dream | ![A](mockups/icons/states/dream-a.svg) | ![B](mockups/icons/states/dream-b.svg) | ![C](mockups/icons/states/dream-c.svg) |  |
| 31 | Discovery | ![A](mockups/icons/states/discovery-a.svg) | ![B](mockups/icons/states/discovery-b.svg) | ![C](mockups/icons/states/discovery-c.svg) |  |

### Persona Avatar Categories

| # | Persona Category | Option A | Option B | Option C | Approved |
|---|------------------|----------|----------|----------|----------|
| 32 | Software | ![A](mockups/icons/personas/software-a.svg) | ![B](mockups/icons/personas/software-b.svg) | ![C](mockups/icons/personas/software-c.svg) |  |
| 33 | Engineering | ![A](mockups/icons/personas/engineering-a.svg) | ![B](mockups/icons/personas/engineering-b.svg) | ![C](mockups/icons/personas/engineering-c.svg) |  |
| 34 | Science | ![A](mockups/icons/personas/science-a.svg) | ![B](mockups/icons/personas/science-b.svg) | ![C](mockups/icons/personas/science-c.svg) |  |
| 35 | Data | ![A](mockups/icons/personas/data-a.svg) | ![B](mockups/icons/personas/data-b.svg) | ![C](mockups/icons/personas/data-c.svg) |  |
| 36 | Design | ![A](mockups/icons/personas/design-a.svg) | ![B](mockups/icons/personas/design-b.svg) | ![C](mockups/icons/personas/design-c.svg) |  |
| 37 | Creative | ![A](mockups/icons/personas/creative-a.svg) | ![B](mockups/icons/personas/creative-b.svg) | ![C](mockups/icons/personas/creative-c.svg) |  |
| 38 | Documentation | ![A](mockups/icons/personas/documentation-a.svg) | ![B](mockups/icons/personas/documentation-b.svg) | ![C](mockups/icons/personas/documentation-c.svg) |  |
| 39 | Business | ![A](mockups/icons/personas/business-a.svg) | ![B](mockups/icons/personas/business-b.svg) | ![C](mockups/icons/personas/business-c.svg) |  |
| 40 | Finance | ![A](mockups/icons/personas/finance-a.svg) | ![B](mockups/icons/personas/finance-b.svg) | ![C](mockups/icons/personas/finance-c.svg) |  |
| 41 | Product | ![A](mockups/icons/personas/product-a.svg) | ![B](mockups/icons/personas/product-b.svg) | ![C](mockups/icons/personas/product-c.svg) |  |
| 42 | Marketing | ![A](mockups/icons/personas/marketing-a.svg) | ![B](mockups/icons/personas/marketing-b.svg) | ![C](mockups/icons/personas/marketing-c.svg) |  |
| 43 | Education | ![A](mockups/icons/personas/education-a.svg) | ![B](mockups/icons/personas/education-b.svg) | ![C](mockups/icons/personas/education-c.svg) |  |
| 44 | Healthcare | ![A](mockups/icons/personas/healthcare-a.svg) | ![B](mockups/icons/personas/healthcare-b.svg) | ![C](mockups/icons/personas/healthcare-c.svg) |  |
| 45 | Legal | ![A](mockups/icons/personas/legal-a.svg) | ![B](mockups/icons/personas/legal-b.svg) | ![C](mockups/icons/personas/legal-c.svg) |  |
| 46 | People | ![A](mockups/icons/personas/people-a.svg) | ![B](mockups/icons/personas/people-b.svg) | ![C](mockups/icons/personas/people-c.svg) |  |
| 47 | Career | ![A](mockups/icons/personas/career-a.svg) | ![B](mockups/icons/personas/career-b.svg) | ![C](mockups/icons/personas/career-c.svg) |  |

### Default Avatar

| # | Avatar | Option A | Option B | Option C | Approved |
|---|--------|----------|----------|----------|----------|
| 48 | Neutral fallback | ![A](mockups/icons/default/default-a.svg) | ![B](mockups/icons/default/default-b.svg) | ![C](mockups/icons/default/default-c.svg) |  |

---

## Relationship To Other Documents

- [COMMAND-CENTER-MASTER-PLAN-2026-03-05.md](COMMAND-CENTER-MASTER-PLAN-2026-03-05.md): execution source of truth
- [COMMAND-CENTER-DESIGN-PRINCIPLES.md](COMMAND-CENTER-DESIGN-PRINCIPLES.md): interaction and product-design guidance
- [COMMAND-CENTER-FEASIBILITY-2026-03-05.md](COMMAND-CENTER-FEASIBILITY-2026-03-05.md): icon approval sheet and historical design rationale

Use this document to approve the visual artifacts themselves. Use the master plan to decide what ships first.
