---
description: "Mission Profile: Research Mode — breadth-first exploration, knowledge encoding, time-boxed discovery"
agent: Alex
---

# Mission Profile: Research Mode

Behavioral preset for research and learning sessions. Activate when user says "switch to research mode" or when exploring unfamiliar domains.

## Agent Behavior Modifications

| Agent          | Modification                                                              |
| -------------- | ------------------------------------------------------------------------- |
| **Alex**       | Prefer Researcher agent for initial exploration; time-box each topic      |
| **Researcher** | Cite sources, save insights to global knowledge, compare multiple options |
| **Builder**    | POC-quality only; skip production hardening                               |
| **Validator**  | Skip unless explicitly requested                                          |

## Rules

- Prefer breadth over depth in initial exploration
- Save findings as structured knowledge artifacts (not just chat)
- Time-box: flag when exploration exceeds 3 rounds without actionable output
- Always compare at least 2 approaches before recommending one
- Create trifectas for new domains discovered during research

## Exit Criteria

- Key findings documented in a structured format
- Recommendations include trade-offs and confidence levels
- Knowledge saved for future sessions (episodic or global knowledge)
