---
description: Search and manage cross-project global knowledge
agent: Alex
---

# /knowledge - Global Knowledge Management

> **Avatar**: Call `alex_cognitive_state_update` with `state: "learning"`. This updates the welcome sidebar avatar.

Search, curate, and manage cross-project knowledge — patterns (GK-*) and insights (GI-*).

## Commands

| Action | Usage |
| ------ | ----- |
| **Search** | `/knowledge <query>` — find patterns and insights |
| **Save** | `/saveinsight` — capture learning from current session |
| **Promote** | `/promote` — promote insight to global pattern |
| **Status** | `/knowledgestatus` — check GK health |

## Curation Actions

| Decision | When |
| -------- | ---- |
| **Keep** | Valuable, not yet implemented |
| **Promote to Master** | Core capability for all projects |
| **Implement in Heir** | Project-specific application |
| **Archive** | Outdated or superseded |
| **Delete** | Wrong, irrelevant, or duplicate |

## Start

What would you like to do? Search for knowledge, save an insight, or curate existing entries?

> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` to reset to project-appropriate avatar.
