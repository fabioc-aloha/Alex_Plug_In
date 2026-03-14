---
name: meditation
description: >-
  Knowledge consolidation, memory integration, and guided meditation — the interactive counterpart to automated dream
  processing
disable-model-invocation: true
applyTo: '**/*meditat*,**/*reflect*,**/*consolidat*'
---

# Alex Meditation Skill

Expert in knowledge consolidation, memory integration, and facilitated meditation sessions for cognitive enhancement.

## Capabilities

- Guide knowledge consolidation sessions
- Integrate new learnings into long-term memory
- Create meditation session documentation
- Recommend memory file organization
- Connect new knowledge to existing synaptic networks

## When to Use This Skill

- User asks to "meditate" or "consolidate knowledge"
- After learning sessions to persist insights
- When organizing information into memory structures
- For guided reflection on what was learned

## Pre-Meditation Optimization

Meditation is a complex cognitive operation (3+ phases: review, relate, reinforce, record). Before starting:

1. **Skill Selection Optimization** auto-activates to survey needed skills
2. **Pre-loaded skills**: brain-qa (for synapse validation), knowledge-synthesis (for pattern extraction), global-knowledge (for cross-project promotion)
3. **Dream pre-check**: If synapse health is unknown, consider running dream first to clear cognitive overhead

This ensures meditation sessions are productive rather than discovering broken architecture mid-consolidation.

## Example Prompts

- "Help me meditate on what I learned today"
- "Consolidate my learnings about React hooks"
- "I want to reflect on this debugging session"
- "Create a meditation session for API design patterns"

## Input Expectations

- Topic or domain being consolidated
- Key insights to preserve
- Connections to existing knowledge (optional)
- Session context (what was learned, when)

## Output Format

- Structured meditation guidance
- Memory file suggestions
- Synapse connection recommendations
- Session documentation (if requested)

## Meditation vs Dream

| Dimension | Dream (Automated) | Meditation (Interactive) |
| --------- | ------------------ | ------------------------ |
| Trigger | Command / schedule | User says "meditate" |
| Depth | Structural validation | Semantic understanding |
| Output | Health metrics JSON | Enriched memory files |
| Analogy | X-ray machine | Surgeon with the X-ray |
| Decision-making | None (report only) | Yes (create, update, prune) |

## Session Types

| Type | Duration | Trigger Signal | Output |
| ---- | -------- | -------------- | ------ |
| Quick Reflect | 5-10 min | End of coding session | Session record in episodic/ |
| Topic Deep-Dive | 15-30 min | "I learned something important" | Updated SKILL.md or new insight |
| Full Meditation | 30-60 min | End of sprint/feature | Memory file updates + synthesis |
| Self-Actualization | 45-90 min | Monthly or architecture change | Comprehensive assessment report |

## The 4 R's — Facilitation Workflow

### Review — What happened this session?

- List concrete actions taken (files created, bugs fixed, features added)
- Identify surprising discoveries or unexpected connections
- Note what was harder or easier than expected and why
- **Quality check**: If the review is all "I did X, Y, Z" with no reflection, it's too shallow

### Relate — How does this connect to existing knowledge?

- Which existing skills/instructions does this session's work touch?
- Are there cross-project patterns? (→ global knowledge candidate)
- Did this session reveal a gap in the architecture?
- **Quality check**: At least one connection identified, or explicitly note "isolated learning"

### Reinforce — What's worth remembering long-term?

| Signal | Worth Remembering? | Store Where |
| ------ | ------------------ | ----------- |
| "I'll forget this by next week" | Yes | SKILL.md or .instructions.md |
| "This was non-obvious" | Yes | Global insight (GI-*) |
| "I keep rediscovering this" | Definitely | .instructions.md (procedural) |
| "This was specific to today" | No | Session record only |
| "Everyone knows this" | No | Don't store |

### Record — Persist the right things in the right places

| Learning Type | Location | Format |
| ------------- | -------- | ------ |
| Repeatable process | `.instructions.md` | Step-by-step procedure |
| Interactive workflow | `.prompt.md` | Guided conversation template |
| Domain expertise | `skills/*/SKILL.md` | Reference knowledge |
| Cross-project pattern | `global-knowledge/patterns/` | GK-* pattern |
| Timestamped observation | `global-knowledge/insights/` | GI-* insight |
| Session narrative | `.github/episodic/` | Dated session record |

## Facilitation Techniques

### Socratic Probing

Don't just list what happened — ask *why* it matters:
- "What would you do differently next time?"
- "Is this a one-time fix or a recurring pattern?"
- "If you saw this in another project, would you recognize it?"

### Diminishing Returns Detection

| Signal | Action |
| ------ | ------ |
| Repeating the same insight in different words | Move on |
| No new connections after 3 attempts | Close this topic |
| User energy dropping | Wrap up with quick record |
| Tangent detected | Bookmark for separate session |

### Depth Calibration

- **Too shallow**: "I learned about testing" → probe for specifics
- **Right depth**: "Property-based testing caught an edge case our unit tests missed because..."
- **Too deep**: 30 minutes on one function's implementation → zoom out to pattern level

## Session Record Template

Store in `.github/episodic/YYYY-MM-DD-topic.md`:

```markdown
# Meditation: [Topic]
**Date**: YYYY-MM-DD
**Type**: Quick Reflect | Deep-Dive | Full | Self-Actualization
**Duration**: X minutes

## Focus
What this session was about.

## Key Learnings
- Learning 1 (→ stored in [location])
- Learning 2 (→ connected to [skill/instruction])

## Updates Made
- File X: added/updated Y
- Synapse: connected A → B

## Open Questions
- What still needs investigation?
```

## Related Skills

- [Brain QA](..\brain-qa/SKILL.md) - Check neural network health
- [Bootstrap Learning](..\bootstrap-learning/SKILL.md) - Acquire new domain knowledge
- [Global Knowledge](..\global-knowledge/SKILL.md) - Search cross-project patterns
