---
description: "Design autonomous AI agents that reason, plan, and execute tasks"
application: "When building AI agents, multi-agent systems, or tool-using LLM applications"
applyTo: "**/*agent*,**/*orchestrat*,**/*multi-agent*"
---

# AI Agent Design

## Core Patterns

1. **ReAct**: Thought → Action → Observation → Repeat
2. **Plan-and-Execute**: High-level plan → Execute steps → Replan on failures
3. **Reflexion**: Attempt → Evaluate → Reflect → Retry with context

## Multi-Agent

- **Supervisor**: Central coordinator delegates to specialists
- **Hierarchical**: Nested supervisors for complex orgs
- **Debate**: Multiple agents argue to reduce hallucination

## Essential Checklist

- [ ] Clear tool descriptions (verb + noun, when/what)
- [ ] Memory architecture (working, short-term, long-term)
- [ ] Human-in-the-loop for high-risk actions
- [ ] Loop detection and recovery
- [ ] Cost control (token budgets, step limits)
- [ ] Safety guardrails (injection detection, output validation)

## Anti-Patterns

- Over-autonomous (no checkpoints)
- Unbounded loops (no termination)
- Tool explosion (confuses agent)
- Memory bloat (no pruning)
