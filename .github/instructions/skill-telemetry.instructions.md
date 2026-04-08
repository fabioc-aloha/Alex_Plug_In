---
description: "Two-phase skill telemetry protocol for tracking activation, outcomes, and usage patterns"
applyTo: "**/.github/skills/**,**/*telemetry*,**/*skill-signal*"
---

# Skill Telemetry Protocol

Adapted from: AI-First Dev Starter Pack `ai-starter-pack-signal` skill.

## Purpose

Answer: "Which skills get used?", "Which fail?", "What patterns emerge?"

H19 (synapse-weight-update.cjs) tracks tool-to-skill weights. This protocol adds structured session-level telemetry: activation timestamp, outcome, duration, error context.

## Two-Phase Signal Protocol

### Phase 1: Start Beacon

Fire BEFORE any skill work begins. Survives hard kills (partial data better than no data).

Required fields:

| Field       | Type   | Example                                    |
|-------------|--------|--------------------------------------------|
| `skillId`   | string | `"debugging-patterns"`                     |
| `sessionId` | string | `"session-2026-04-08-001"`                 |
| `startedAt` | ISO    | `"2026-04-08T14:23:00Z"`                   |
| `trigger`   | string | `"user-request"` / `"auto-route"` / `"agent-delegate"` |
| `workspace` | string | Workspace folder name (no full path)       |

### Phase 2: Completion Signal

Fire AFTER skill work completes (success or failure).

Required fields:

| Field          | Type     | Example                           |
|----------------|----------|-----------------------------------|
| `skillId`      | string   | `"debugging-patterns"`            |
| `sessionId`    | string   | matches Phase 1                   |
| `completedAt`  | ISO      | `"2026-04-08T14:25:12Z"`         |
| `outcome`      | enum     | `"success"` / `"partial"` / `"failed"` / `"skipped"` |
| `durationMs`   | number   | `132000`                          |
| `errorContext`  | string?  | Error message if failed (PII-scrubbed) |
| `filesChanged`  | number   | Count of files modified           |
| `selfScore`    | 1-5?     | Optional self-assessment quality  |

## Storage

- **Location**: `~/.alex/telemetry/skill-signals.jsonl` (append-only, one JSON object per line)
- **Rotation**: 90-day rolling window
- **Size cap**: 10 MB max; truncate oldest entries when exceeded
- **Format**: JSONL (not JSON array) for crash-safe append

## Privacy Rules

- Never log file contents, user prompts, or code snippets
- Workspace name only (not full path)
- Error messages: strip file paths below workspace root
- No PII, no secrets, no credentials

## Analysis Queries

The JSONL format enables grep-based analysis without parsing:

```bash
# Most-used skills (last 30 days)
grep -o '"skillId":"[^"]*"' skill-signals.jsonl | sort | uniq -c | sort -rn | head -20

# Failure rate by skill
grep '"outcome":"failed"' skill-signals.jsonl | grep -o '"skillId":"[^"]*"' | sort | uniq -c | sort -rn

# Average duration by skill (requires jq)
jq -s 'group_by(.skillId) | map({skill: .[0].skillId, avg_ms: (map(.durationMs) | add / length)})' skill-signals.jsonl

# Skills with no Phase 2 (orphaned starts = hard kills)
comm -23 <(grep '"startedAt"' skill-signals.jsonl | jq -r '.sessionId' | sort) \
         <(grep '"completedAt"' skill-signals.jsonl | jq -r '.sessionId' | sort)
```

## Integration Points

1. **Episodic memory**: Skill signals complement session records (episodicMemory.ts). Session records capture "what happened"; skill signals capture "which capabilities were used and how well."
2. **Synapse weights (H19)**: H19 updates connection strength based on tool calls. Telemetry adds the outcome dimension: a skill that's called often but fails often should not gain weight.
3. **Meditation reports**: During meditation, aggregate recent skill signals to identify: underused skills (candidates for pruning), high-failure skills (need repair), high-usage skills (candidates for optimization).
4. **Brain-QA**: Add a telemetry validation phase: verify signals file exists, check for orphaned Phase 1 entries, flag skills with >30% failure rate.

## Implementation Approach

**Phase A** (lightweight, no extension code changes):
- Instruction-only protocol. Alex logs skill activations to episodic memory YAML frontmatter during meditation sessions. Manual, zero infrastructure.

**Phase B** (structured):
- Add `~/.alex/telemetry/` directory
- PostToolUse hook (companion to H19) writes JSONL entries
- Meditation reads and summarizes signals

**Phase C** (automated):
- VS Code command `alex.skillTelemetryReport` generates dashboard
- Integrate with brain-qa as validation phase
- Prune recommendations based on usage data
