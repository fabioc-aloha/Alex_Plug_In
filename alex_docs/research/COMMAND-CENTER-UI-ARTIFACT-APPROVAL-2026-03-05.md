# Command Center UI Artifact Approval

**Author**: Alex Finch + GitHub Copilot
**Date**: March 5, 2026
**Purpose**: Review and approve the active Command Center UI artifacts before implementation
**Scope**: Active v2 tab mockups and their implementation-readiness notes
**Status**: Mockups approved; artifact review in progress

---

## How To Use This Document

This document is the visual approval sheet for the active Command Center mockups.

- Review each thumbnail inline in Markdown preview.
- Mark `A` in the **Approved** column when the artifact is approved for implementation.
- Use the **Notes** column for required changes before approval.
- Treat only the artifacts in this document as active UI inputs.

**Open in VS Code Preview** (`Ctrl+Shift+V`) to see all thumbnails rendered inline.

This document is now the only active review surface.

---

## Approval Criteria

Approve an artifact only if it is strong enough on all four dimensions:

1. **Information hierarchy**: the most important action or information is obvious at sidebar width.
2. **Density discipline**: the layout fits the 300px-style sidebar target without collapsing into long-scroll clutter.
3. **North Star fit**: the surface feels specific to Alex rather than interchangeable with a generic AI tool.
4. **Implementation realism**: the artifact does not rely on unproven runtime behavior for its first-wave version.

---

## Official Brand Reference

Use the official Alex blue rocket mark as the canonical product-brand reference for this review.

- Canonical asset: `platforms/vscode-extension/assets/logo.svg`
- Brand role: Alex product mark, not the Command Center tab icon
- Usage here: visual anchor for Alex-branded UI surfaces and future polish passes
- Note: this replaces the older `.github/assets/rocket-icon.svg` reference

<p>
  <img src="../../platforms/vscode-extension/assets/logo.svg" alt="Official Alex blue rocket" width="120" />
</p>

---

## Active v2 Mockups

These are the only active mockups that should be approved for current implementation planning.

| # | Artifact | Thumbnail | Purpose | First-wave Relevance | Approved | Notes |
|---|----------|-----------|---------|----------------------|----------|-------|
| 1 | Mission Command | ![Mission Command](mockups/command-center-v2-mission-control.svg) | Operational dashboard for status, nudges, commands, settings, and actions | Yes, core first-wave tab | A | Approved for layout direction; polish later if needed after artifact decisions |
| 2 | Agents | ![Agents](mockups/command-center-v2-agent-hub.svg) | Agent registry, thread concepts, and specialist-agent surface | No, advanced-contract wave | A | Approved as target-state direction; polish later if needed after artifact decisions |
| 3 | Skill Store | ![Skill Store](mockups/command-center-v2-skill-store.svg) | Skill browsing, toggles, and catalog organization | No, advanced-contract wave | A | Approved as target-state direction; polish later if needed after artifact decisions |
| 4 | Mind | ![Mind](mockups/command-center-v2-mind.svg) | Cognitive architecture, health, memory, and introspection surface | No, reduced-scope until model contracts exist | A | Approved as target-state direction; polish later if needed after artifact decisions |
| 5 | Docs | ![Docs](mockups/command-center-v2-docs.svg) | AlexLearn-aligned documentation and learning hub | Yes, core first-wave tab | A | Approved for layout direction; polish later if needed after artifact decisions |

---

## Artifact Review Notes

### 1. Mission Command

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
- whether this feels distinct from Mission Command

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
| First-wave tabs | 2 | Mission Command + Docs | Approve for immediate UI execution |
| Advanced-wave tabs | 3 | Agents + Skill Store + Mind | Approve as target-state direction, subject to contract gating |

---

## Badge Approval

Badge direction is now approved at the style level.

Use style `B` as the baseline across the current badge families. Final polish can still happen later, but the selection is no longer deferred.

### 6. Agent Status Badges

Agents tab and operational status chips
Options: A = filled pill, B = outline chip, C = dot-plus-label
Approved: B
Notes: Outline chip selected as baseline badge style

<p>
  <img src="mockups/badges/agent-status-badges.svg" alt="Agent status badges" width="920" />
</p>

### 7. Skill Badges

Trifecta, active, and skill taxonomy markers
Options: A = filled pill, B = outline chip, C = compact key
Approved: B
Notes: Outline chip selected as baseline badge style

<p>
  <img src="mockups/badges/skill-badges.svg" alt="Skill badges" width="920" />
</p>

### 8. Mind / Health Badges

Brain health and confidence severity markers
Options: A = hero pill, B = severity chips, C = dot keys
Approved: B
Notes: Severity chip direction selected as baseline badge style

<p>
  <img src="mockups/badges/mind-health-badges.svg" alt="Mind health badges" width="920" />
</p>

### 9. Notification / Count Badges

Sidebar badge, queue count, alert markers
Options: A = circular count, B = rounded count pill, C = alert dot
Approved: B
Notes: Rounded count pill selected as baseline badge style

<p>
  <img src="mockups/badges/notification-badges.svg" alt="Notification badges" width="920" />
</p>

### 10. Doc Count Badges

Docs tab section counts and file totals
Options: A = pill count, B = circular count, C = explicit count label
Approved: C
Notes: Explicit count label selected as the exception for docs counts

<p>
  <img src="mockups/badges/doc-count-badges.svg" alt="Doc count badges" width="920" />
</p>

---

## Icon Approval

The icon system is already generated and approval-ready. The tables below are copied into this document so artifact approval can happen in one place.

These icon and avatar boards were generated before the revised Command Center UI asset rules were written into `alex_docs/DK-correax-brand.md`.

Use this round to approve **direction and metaphor**, not final polish. Final implementation approval should happen after the assets are regenerated under the updated vector, stroke, depth, and color rules.

Persona-category choices in this document should be evaluated against LearnAlex's target personas and use cases, since that companion taxonomy is the source of truth for the new Docs-tab and companion-facing UI language.

### Tab Bar Icons

Use the larger previews below for chat-based approval.

These previews now point to the March 6 `fluxico` PNG concept pass. The older SVGs remain on disk for historical comparison, but the PNGs below are the active review images for tab-icon direction.

#### 11. Mission Command

Dashboard / status overview
Approved: C

<p>
  <img src="mockups/icons/tabs/mission-a.png" alt="Mission Command option A" width="140" />
  <img src="mockups/icons/tabs/mission-b.png" alt="Mission Command option B" width="140" />
  <img src="mockups/icons/tabs/mission-c.png" alt="Mission Command option C" width="140" />
</p>

#### 12. Agents

Agent hub / team management
Approved: A

<p>
  <img src="mockups/icons/tabs/agents-a.png" alt="Agents option A" width="140" />
  <img src="mockups/icons/tabs/agents-b.png" alt="Agents option B" width="140" />
  <img src="mockups/icons/tabs/agents-c.png" alt="Agents option C" width="140" />
</p>

#### 13. Skill Store

Skill catalog / capabilities
Approved: B

<p>
  <img src="mockups/icons/tabs/skills-a.png" alt="Skill Store option A" width="140" />
  <img src="mockups/icons/tabs/skills-b.png" alt="Skill Store option B" width="140" />
  <img src="mockups/icons/tabs/skills-c.png" alt="Skill Store option C" width="140" />
</p>

#### 14. Mind

Brain / cognitive architecture
Approved:

<p>
  <img src="mockups/icons/tabs/mind-f.png" alt="Mind option F" width="140" />
  <img src="mockups/icons/tabs/mind-g.png" alt="Mind option G" width="140" />
  <img src="mockups/icons/tabs/mind-h.png" alt="Mind option H" width="140" />
  <img src="mockups/icons/tabs/mind-i.png" alt="Mind option I" width="140" />
  <img src="mockups/icons/tabs/mind-j.png" alt="Mind option J" width="140" />
</p>

#### 15. Docs

Documentation / reference
Approved: A

<p>
  <img src="mockups/icons/tabs/docs-a.png" alt="Docs option A" width="140" />
  <img src="mockups/icons/tabs/docs-b.png" alt="Docs option B" width="140" />
  <img src="mockups/icons/tabs/docs-c.png" alt="Docs option C" width="140" />
</p>

### Agent Mode Icons

#### 16. Alex

Approved:

<p>
  <img src="mockups/icons/agents/alex-a.svg" alt="Alex option A" width="140" />
  <img src="mockups/icons/agents/alex-b.svg" alt="Alex option B" width="140" />
  <img src="mockups/icons/agents/alex-c.svg" alt="Alex option C" width="140" />
</p>

#### 17. Researcher

Approved: B

<p>
  <img src="mockups/icons/agents/researcher-a.svg" alt="Researcher option A" width="140" />
  <img src="mockups/icons/agents/researcher-b.svg" alt="Researcher option B" width="140" />
  <img src="mockups/icons/agents/researcher-c.svg" alt="Researcher option C" width="140" />
</p>

#### 18. Builder

Approved:

<p>
  <img src="mockups/icons/agents/builder-f.svg" alt="Builder option F" width="140" />
  <img src="mockups/icons/agents/builder-g.svg" alt="Builder option G" width="140" />
  <img src="mockups/icons/agents/builder-h.svg" alt="Builder option H" width="140" />
  <img src="mockups/icons/agents/builder-i.svg" alt="Builder option I" width="140" />
  <img src="mockups/icons/agents/builder-j.svg" alt="Builder option J" width="140" />
</p>

#### 19. Validator

Approved: A

<p>
  <img src="mockups/icons/agents/validator-a.svg" alt="Validator option A" width="140" />
  <img src="mockups/icons/agents/validator-b.svg" alt="Validator option B" width="140" />
  <img src="mockups/icons/agents/validator-c.svg" alt="Validator option C" width="140" />
</p>

#### 20. Documentarian

Approved: E

<p>
  <img src="mockups/icons/agents/documentarian-a.svg" alt="Documentarian option A" width="140" />
  <img src="mockups/icons/agents/documentarian-b.svg" alt="Documentarian option B" width="140" />
  <img src="mockups/icons/agents/documentarian-c.svg" alt="Documentarian option C" width="140" />
  <img src="mockups/icons/agents/documentarian-d.svg" alt="Documentarian option D" width="140" />
  <img src="mockups/icons/agents/documentarian-e.svg" alt="Documentarian option E" width="140" />
</p>

#### 21. Azure

Approved:

<p>
  <img src="mockups/icons/agents/azure-f.svg" alt="Azure option F" width="140" />
  <img src="mockups/icons/agents/azure-g.svg" alt="Azure option G" width="140" />
  <img src="mockups/icons/agents/azure-h.svg" alt="Azure option H" width="140" />
  <img src="mockups/icons/agents/azure-i.svg" alt="Azure option I" width="140" />
  <img src="mockups/icons/agents/azure-j.svg" alt="Azure option J" width="140" />
</p>

#### 22. M365

Approved:

<p>
  <img src="mockups/icons/agents/m365-f.svg" alt="M365 option F" width="140" />
  <img src="mockups/icons/agents/m365-g.svg" alt="M365 option G" width="140" />
  <img src="mockups/icons/agents/m365-h.svg" alt="M365 option H" width="140" />
  <img src="mockups/icons/agents/m365-i.svg" alt="M365 option I" width="140" />
  <img src="mockups/icons/agents/m365-j.svg" alt="M365 option J" width="140" />
</p>

---

## Avatar Approval

For approval purposes, avatars are split into state avatars, persona avatars, and the neutral fallback avatar. These selections determine what Alex looks like when no richer art asset is used.

### Cognitive State Avatars

#### 23. Building

<p>
  <img src="mockups/icons/states/building-a.svg" alt="Building option A" width="140" />
  <img src="mockups/icons/states/building-b.svg" alt="Building option B" width="140" />
  <img src="mockups/icons/states/building-c.svg" alt="Building option C" width="140" />
</p>

#### 24. Debugging

<p>
  <img src="mockups/icons/states/debugging-a.svg" alt="Debugging option A" width="140" />
  <img src="mockups/icons/states/debugging-b.svg" alt="Debugging option B" width="140" />
  <img src="mockups/icons/states/debugging-c.svg" alt="Debugging option C" width="140" />
</p>

#### 25. Planning

<p>
  <img src="mockups/icons/states/planning-a.svg" alt="Planning option A" width="140" />
  <img src="mockups/icons/states/planning-b.svg" alt="Planning option B" width="140" />
  <img src="mockups/icons/states/planning-c.svg" alt="Planning option C" width="140" />
</p>

#### 26. Reviewing

<p>
  <img src="mockups/icons/states/reviewing-a.svg" alt="Reviewing option A" width="140" />
  <img src="mockups/icons/states/reviewing-b.svg" alt="Reviewing option B" width="140" />
  <img src="mockups/icons/states/reviewing-c.svg" alt="Reviewing option C" width="140" />
</p>

#### 27. Learning

<p>
  <img src="mockups/icons/states/learning-a.svg" alt="Learning option A" width="140" />
  <img src="mockups/icons/states/learning-b.svg" alt="Learning option B" width="140" />
  <img src="mockups/icons/states/learning-c.svg" alt="Learning option C" width="140" />
</p>

#### 28. Teaching

<p>
  <img src="mockups/icons/states/teaching-a.svg" alt="Teaching option A" width="140" />
  <img src="mockups/icons/states/teaching-b.svg" alt="Teaching option B" width="140" />
  <img src="mockups/icons/states/teaching-c.svg" alt="Teaching option C" width="140" />
</p>

#### 29. Meditation

<p>
  <img src="mockups/icons/states/meditation-a.svg" alt="Meditation option A" width="140" />
  <img src="mockups/icons/states/meditation-b.svg" alt="Meditation option B" width="140" />
  <img src="mockups/icons/states/meditation-c.svg" alt="Meditation option C" width="140" />
</p>

#### 30. Dream

<p>
  <img src="mockups/icons/states/dream-a.svg" alt="Dream option A" width="140" />
  <img src="mockups/icons/states/dream-b.svg" alt="Dream option B" width="140" />
  <img src="mockups/icons/states/dream-c.svg" alt="Dream option C" width="140" />
</p>

#### 31. Discovery

<p>
  <img src="mockups/icons/states/discovery-a.svg" alt="Discovery option A" width="140" />
  <img src="mockups/icons/states/discovery-b.svg" alt="Discovery option B" width="140" />
  <img src="mockups/icons/states/discovery-c.svg" alt="Discovery option C" width="140" />
</p>

### Persona Avatar Categories

These categories are not arbitrary extension labels. They are the current condensed UI taxonomy for the LearnAlex personas and use cases the new extension UI is targeting.

#### 32. Software

<p>
  <img src="mockups/icons/personas/software-a.svg" alt="Software option A" width="140" />
  <img src="mockups/icons/personas/software-b.svg" alt="Software option B" width="140" />
  <img src="mockups/icons/personas/software-c.svg" alt="Software option C" width="140" />
</p>

#### 33. Engineering

<p>
  <img src="mockups/icons/personas/engineering-a.svg" alt="Engineering option A" width="140" />
  <img src="mockups/icons/personas/engineering-b.svg" alt="Engineering option B" width="140" />
  <img src="mockups/icons/personas/engineering-c.svg" alt="Engineering option C" width="140" />
</p>

#### 34. Science

<p>
  <img src="mockups/icons/personas/science-a.svg" alt="Science option A" width="140" />
  <img src="mockups/icons/personas/science-b.svg" alt="Science option B" width="140" />
  <img src="mockups/icons/personas/science-c.svg" alt="Science option C" width="140" />
</p>

#### 35. Data

<p>
  <img src="mockups/icons/personas/data-a.svg" alt="Data option A" width="140" />
  <img src="mockups/icons/personas/data-b.svg" alt="Data option B" width="140" />
  <img src="mockups/icons/personas/data-c.svg" alt="Data option C" width="140" />
</p>

#### 36. Design

<p>
  <img src="mockups/icons/personas/design-a.svg" alt="Design option A" width="140" />
  <img src="mockups/icons/personas/design-b.svg" alt="Design option B" width="140" />
  <img src="mockups/icons/personas/design-c.svg" alt="Design option C" width="140" />
</p>

#### 37. Creative

<p>
  <img src="mockups/icons/personas/creative-a.svg" alt="Creative option A" width="140" />
  <img src="mockups/icons/personas/creative-b.svg" alt="Creative option B" width="140" />
  <img src="mockups/icons/personas/creative-c.svg" alt="Creative option C" width="140" />
</p>

#### 38. Documentation

<p>
  <img src="mockups/icons/personas/documentation-a.svg" alt="Documentation option A" width="140" />
  <img src="mockups/icons/personas/documentation-b.svg" alt="Documentation option B" width="140" />
  <img src="mockups/icons/personas/documentation-c.svg" alt="Documentation option C" width="140" />
</p>

#### 39. Business

<p>
  <img src="mockups/icons/personas/business-a.svg" alt="Business option A" width="140" />
  <img src="mockups/icons/personas/business-b.svg" alt="Business option B" width="140" />
  <img src="mockups/icons/personas/business-c.svg" alt="Business option C" width="140" />
</p>

#### 40. Finance

<p>
  <img src="mockups/icons/personas/finance-a.svg" alt="Finance option A" width="140" />
  <img src="mockups/icons/personas/finance-b.svg" alt="Finance option B" width="140" />
  <img src="mockups/icons/personas/finance-c.svg" alt="Finance option C" width="140" />
</p>

#### 41. Product

<p>
  <img src="mockups/icons/personas/product-a.svg" alt="Product option A" width="140" />
  <img src="mockups/icons/personas/product-b.svg" alt="Product option B" width="140" />
  <img src="mockups/icons/personas/product-c.svg" alt="Product option C" width="140" />
</p>

#### 42. Marketing

<p>
  <img src="mockups/icons/personas/marketing-a.svg" alt="Marketing option A" width="140" />
  <img src="mockups/icons/personas/marketing-b.svg" alt="Marketing option B" width="140" />
  <img src="mockups/icons/personas/marketing-c.svg" alt="Marketing option C" width="140" />
</p>

#### 43. Education

<p>
  <img src="mockups/icons/personas/education-a.svg" alt="Education option A" width="140" />
  <img src="mockups/icons/personas/education-b.svg" alt="Education option B" width="140" />
  <img src="mockups/icons/personas/education-c.svg" alt="Education option C" width="140" />
</p>

#### 44. Healthcare

<p>
  <img src="mockups/icons/personas/healthcare-a.svg" alt="Healthcare option A" width="140" />
  <img src="mockups/icons/personas/healthcare-b.svg" alt="Healthcare option B" width="140" />
  <img src="mockups/icons/personas/healthcare-c.svg" alt="Healthcare option C" width="140" />
</p>

#### 45. Legal

<p>
  <img src="mockups/icons/personas/legal-a.svg" alt="Legal option A" width="140" />
  <img src="mockups/icons/personas/legal-b.svg" alt="Legal option B" width="140" />
  <img src="mockups/icons/personas/legal-c.svg" alt="Legal option C" width="140" />
</p>

#### 46. People

<p>
  <img src="mockups/icons/personas/people-a.svg" alt="People option A" width="140" />
  <img src="mockups/icons/personas/people-b.svg" alt="People option B" width="140" />
  <img src="mockups/icons/personas/people-c.svg" alt="People option C" width="140" />
</p>

#### 47. Career

<p>
  <img src="mockups/icons/personas/career-a.svg" alt="Career option A" width="140" />
  <img src="mockups/icons/personas/career-b.svg" alt="Career option B" width="140" />
  <img src="mockups/icons/personas/career-c.svg" alt="Career option C" width="140" />
</p>

### Default Avatar

#### 48. Neutral fallback

<p>
  <img src="mockups/icons/default/default-a.svg" alt="Default option A" width="140" />
  <img src="mockups/icons/default/default-b.svg" alt="Default option B" width="140" />
  <img src="mockups/icons/default/default-c.svg" alt="Default option C" width="140" />
</p>

---

## Relationship To Other Documents

- [COMMAND-CENTER-MASTER-PLAN-2026-03-05.md](COMMAND-CENTER-MASTER-PLAN-2026-03-05.md): execution source of truth
- [COMMAND-CENTER-DESIGN-PRINCIPLES.md](COMMAND-CENTER-DESIGN-PRINCIPLES.md): interaction and product-design guidance
- [COMMAND-CENTER-FEASIBILITY-2026-03-05.md](COMMAND-CENTER-FEASIBILITY-2026-03-05.md): icon approval sheet and historical design rationale

Use this document to approve the visual artifacts themselves. Use the master plan to decide what ships first.
