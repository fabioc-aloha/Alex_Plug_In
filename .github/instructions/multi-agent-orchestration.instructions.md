---
description: "Coordinate multiple AI agents for complex tasks — decomposition, delegation, and synthesis"
application: "When tasks require specialized expertise from multiple agents or need parallel execution"
applyTo: "**/*orchestrat*,**/*subagent*,**/*multi-agent*,**/*delegate*"
---

# Multi-Agent Orchestration

## When to Orchestrate

- Task requires diverse expertise (research + code + validation)
- Work can be parallelized
- Single agent would context-switch too much
- Quality requires adversarial review

## Orchestration Pattern

1. **Decompose** — Break task into agent-sized chunks
2. **Delegate** — Route to specialists (Researcher, Builder, Validator)
3. **Coordinate** — Pass context between agents
4. **Synthesize** — Combine outputs into coherent result

## Agent Handoff Protocol

```
// Include with every subagent call:
- Context: What preceded this task
- Scope: Exactly what to do (boundaries)
- Output: Expected deliverable format
- Return: What to report back
```

## Anti-Patterns

- Over-orchestrating simple tasks
- Losing context between agents
- No clear ownership
- Redundant work across agents
