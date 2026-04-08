# AFCP Leverage Analysis for Alex

What Alex can adopt, adapt, or learn from the Agent Fleets Coordination Protocol.

**Source**: `C:\Development\Agent-Fleets-Coordination-Protocol` (1ES, MIT license)
**Date**: 2026-04-08

## Executive Summary

AFCP solves the problem Alex is approaching from the other direction. Alex started with deep cognitive architecture (memory, identity, learning) and bolted on multi-agent delegation via `runSubagent`. AFCP started with multi-agent coordination (task routing, knowledge scoping, uncertainty resolution) and treats individual agent cognition as someone else's problem. Neither system has what the other built.

The biggest value is not adopting AFCP wholesale. Alex is a single-user, single-workspace system where agents are ephemeral subagent calls, not persistent fleet participants. The fleet model, center server, JWT auth, and dashboard are architectural overhead that doesn't fit.

What does fit: **AFCP's coordination primitives are exactly the missing layer in Alex's multi-agent story.** Today, `runSubagent` is fire-and-forget with no memory of what was delegated, no tracking of outcomes, no learning from which agent handles which task type best, and no structured way to handle "I don't know." These are solved problems in AFCP with clean, adoptable schemas.

Three items deliver disproportionate value:

1. **Structured Unknowns** turn "I don't know" from a dead end into a trackable, resolvable workflow. Unknowns that persist across sessions become research candidates during meditation. This directly improves Alex's intellectual honesty, which is core to the North Star ("trusted").
2. **Assignment Lifecycle** gives Alex delegation memory. Tracking what was delegated, to whom, and how it went enables expertise-based routing over time. The deferred H17 hook already has the trigger point; AFCP provides the data model.
3. **Directive Sets** formalize what Alex already does informally with Focus Trifectas and Active Context. Named mission profiles ("release-mode", "research-mode", "debug-mode") are a cleaner abstraction that users can invoke explicitly.

Combined, these three features move Alex from "orchestrator that dispatches subagents" to "coordinator that learns from delegation, tracks uncertainty, and adapts behavior to the mission." That is a meaningful step toward the North Star.

## Implementation Tracker

| #   | Opportunity                       | Effort | Impact | Status      | Target |
| --- | --------------------------------- | ------ | ------ | ----------- | ------ |
| 1   | Structured Unknowns               | Low    | High   | Not Started |        |
| 2   | Assignment Lifecycle (H17)        | Medium | High   | Not Started |        |
| 3   | Skill-Based Task Routing          | Medium | High   | Not Started |        |
| 4   | Scoped Knowledge Artifacts        | Medium | Medium | Not Started |        |
| 5   | Correlation Vectors               | Low    | Medium | Not Started |        |
| 6   | Directive Sets (Mission Profiles) | Low    | Medium | Not Started |        |

## What AFCP Is

A coordination protocol for multi-agent AI systems. Sits above MCP (tool transport) and below the application layer. Defines how agents register, receive tasks, share knowledge, handle uncertainty, and compose into hierarchical fleets. All coordination flows through a central hub ("center"), never peer-to-peer.

## Overlap with Alex Today

| AFCP Concept                               | Alex Equivalent                                                                         | Gap                                                                                  |
| ------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Agent identity (name, capabilities, state) | `.github/agents/*.agent.md` (7 agents with model fallback, tools, slash commands)       | Alex agents lack runtime state (idle/busy/error/offline)                             |
| Task assignment lifecycle                  | `runSubagent` tool dispatches to named agents                                           | No assignment tracking, phase lifecycle, or skill-based routing                      |
| Knowledge persistence                      | `.github/episodic/`, synapses.json, skills, instructions                                | Alex has richer memory (episodic, procedural, semantic) but no scoped artifact model |
| Uncertainty handling                       | `anti-hallucination` skill, Unknown surfacing                                           | No structured Unknown lifecycle (open/consult/assess/resolve)                        |
| Fleet composition                          | Heirs (vscode-extension, m365-copilot)                                                  | Heirs are code clones, not runtime fleet participants                                |
| Behavioral control                         | 5-layer prompt assembly (copilot-instructions → instructions → skills → agents → hooks) | Similar to AFCP's autonomy stack but more granular                                   |
| Observability                              | Session trace, episodic memory, dream reports                                           | No correlation vectors or cross-agent error tracing                                  |
| Authority model                            | Safety Imperatives (I1-I8), kill switch                                                 | Advisory, not scoped per mission/agent                                               |

## High-Value Leverage Opportunities

### 1. Structured Unknowns (Low effort, High impact)

AFCP treats uncertainty as a first-class entity with 5 categories: Information, Interpretation, Decision, Authority, Capability. Each has severity, confidence, state, and a consultation protocol (open → consult → assess → resolve).

**Alex today**: The `anti-hallucination` skill says "when you don't know, say so" but there's no structure around what happens next. Unknowns evaporate at session end.

**Leverage**: Create an `Unknown` artifact type in episodic memory. When Alex surfaces uncertainty, persist it with category and confidence. During meditation, review unresolved unknowns. Cross-session unknowns become research candidates.

### 2. Assignment Lifecycle for Subagent Delegation (Medium effort, High impact)

AFCP tracks assignments through 7 phases: Unassigned → Assigned → Working → Completed/Failed/Cancelled/BlockedByUnknown. Each transition emits an event.

**Alex today**: `runSubagent` is fire-and-forget within a session. No tracking of what was delegated, to which agent, what the outcome was, or how long it took. H17 (SubagentStop result capture) is deferred.

**Leverage**: Implement H17 using AFCP's assignment model as the schema. Track delegations with: skill requested, agent assigned, phase transitions, duration, outcome. Feed into expertise tracking (success rates per agent per skill type). This directly enables the deferred "delegation analytics" benefit.

### 3. Skill-Based Task Routing (Medium effort, High impact)

AFCP uses 3-tier routing: skill match → learned expertise → fallback. Expertise is tracked per agent as success rates.

**Alex today**: Agent selection is manual (user picks @Alex, @Builder, @Researcher) or hardcoded in agent descriptions. No skill matching, no learned preferences.

**Leverage**: Map agent capabilities (already in agent.md files) to a routing index. When `runSubagent` is called without specifying an agent, auto-route based on skill match. Track per-agent success rates in `session-tool-log.json` to feed Tier 2 routing over time.

### 4. Scoped Knowledge Artifacts (Medium effort, Medium impact)

AFCP defines 4 context scopes: agent (persists across missions), mission (within a goal), team (shared domain), global (cross-fleet). Artifacts have provenance (assertedBy, assertedAt), confidence scores, confirmation tracking, and supersession chains.

**Alex today**: Knowledge lives in multiple systems (episodic memory, skills, instructions, synapses, global knowledge) but scope is implicit. No confidence scoring on stored knowledge. No supersession tracking.

**Leverage**: Add `confidence` and `assertedAt` fields to episodic records. Add `supersededBy` to global knowledge insights (GI-*) so newer findings formally replace older ones instead of accumulating. This improves meditation's knowledge curation quality.

### 5. Correlation Vectors for Error Tracing (Low effort, Medium impact)

AFCP uses correlation vectors (base.segment.segment) to trace causation across agents. Errors link to the CV, enabling root-cause analysis across boundaries.

**Alex today**: Session trace logs sequential tool calls but has no cross-agent correlation. When a subagent fails, the parent agent gets a result but can't trace what happened inside.

**Leverage**: Generate a correlation ID per user request. Pass it through `runSubagent` calls. Log it in session trace and episodic memory. This enables the root-cause-analysis skill to trace failures across agent boundaries.

### 6. Directive Sets for Mission-Specific Behavior (Low effort, Medium impact)

AFCP allows runtime behavioral injection via directive sets: standing directives, mode-specific rules, constraints, communication norms. These layer on top of static agent identity.

**Alex today**: Behavioral modulation happens through prompt layers (Focus Trifectas in Active Context, hook-injected context). But it's not structured as named, reusable directive sets.

**Leverage**: Formalize "mission profiles" as named directive sets. Example: "release-mode" (heighten quality gates, suppress speculative suggestions), "research-mode" (prefer breadth over depth, cite sources), "debug-mode" (systematic hypothesis testing, binary search). These could be activated via slash commands or auto-detected from context.

## Lower-Priority Opportunities

| AFCP Feature                         | Why Lower Priority                                         | When It Becomes Relevant                                            |
| ------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Fleet composition (recursive fleets) | Alex heirs are build-time clones, not runtime participants | If Alex instances across workspaces need to coordinate in real-time |
| Center-mediated communication        | Single-agent UX today; subagents are ephemeral             | Multi-workspace or multi-user Alex                                  |
| Dashboard (2D/3D timeline)           | Overkill for 7-agent system with sequential delegation     | Useful if agent count grows or parallel delegation ships            |
| JWT-based agent auth                 | All agents run in-process, no auth boundary                | Remote agent hosting (1.115 SSH unlock)                             |
| Event stream (30 event types)        | VS Code hooks already emit events for key lifecycle points | If delegation analytics (H17) needs richer event taxonomy           |

## Architectural Alignment

AFCP and Alex share a core philosophy: **behavioral control through natural language, not configuration flags**. AFCP's autonomy stack (Tools → Server Instructions → Tool Descriptions → Agent Identity → Directive Sets) maps cleanly to Alex's prompt assembly (MCP Tools → Instructions → Skills → Agent Files → Hooks + Active Context).

Key difference: AFCP assumes long-running agents with persistent connections. Alex agents are ephemeral (created per `runSubagent` call, destroyed on completion). This makes assignment lifecycle tracking and expertise accumulation things Alex must store externally rather than in agent memory.

## Recommended First Steps

1. **Add Unknown tracking to episodic memory** (builds on existing schema, no new infrastructure)
2. **Implement H17 with AFCP assignment schema** (already designed and deferred, AFCP provides the data model)
3. **Add confidence fields to episodic records** (single field addition, improves meditation curation)
4. **Prototype mission profiles** (named directive sets as .prompt.md files, activated by slash command)
