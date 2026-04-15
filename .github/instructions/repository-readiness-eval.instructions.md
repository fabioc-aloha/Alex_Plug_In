---
description: "Repository readiness evaluation for AI-assisted development with 4-axis scoring and autonomy penalty"
application: "When repository readiness eval patterns are relevant to the current task"
applyTo: "**/*readiness*,**/*repo-eval*,**/*heir-init*"
---

# Repository Readiness Evaluation

Adapted from: AI-First Dev Starter Pack `repository-readiness-eval` skill.

## Purpose

Quantify how ready a repository is for AI-assisted development. Run on heir projects after Initialize to identify what needs fixing first.

## 4-Axis Scoring

| Axis | Question | Weight |
|------|----------|--------|
| **A: Code Understanding** | Can Alex understand the codebase structure? | 30% |
| **B: Dependency Restore** | Does `npm install` / `dotnet restore` / equivalent work cleanly? | 25% |
| **C: Build Success** | Does the build pass from clean checkout with zero warnings? | 25% |
| **D: Test Execution** | Can tests be discovered and run? Do they pass? | 20% |

### Axis A: Code Understanding

| Check | Points | How to Verify |
|-------|--------|---------------|
| README exists with project description | 2 | File exists, >50 words |
| Directory structure follows conventions | 2 | src/, test/, docs/ or equivalent present |
| Entry point identifiable | 2 | package.json main/scripts, .csproj, Makefile |
| No obfuscated or generated code in src/ | 2 | No minified JS, no auto-gen without .gitattributes |
| Configuration documented or self-evident | 2 | .env.example, appsettings.json, or equivalent |

**Max: 10 points**

### Axis B: Dependency Restore

| Check | Points | Penalty |
|-------|--------|---------|
| Lock file present | 2 | -2 if missing |
| Restore completes without errors | 4 | -2 per manual intervention |
| No deprecated dependency warnings | 2 | -1 per warning |
| No security vulnerabilities (critical/high) | 2 | -2 per critical |

**Max: 10 points**

### Axis C: Build Success

| Check | Points | Penalty |
|-------|--------|---------|
| Build command documented or inferrable | 2 | -2 if not found |
| Build completes without errors | 4 | Fail = 0 for this axis |
| Zero warnings | 2 | -1 per 10 warnings |
| Output artifact produced | 2 | -2 if no artifact |

**Max: 10 points**

### Axis D: Test Execution

| Check | Points | Penalty |
|-------|--------|---------|
| Test runner configured | 2 | -2 if missing |
| Tests discoverable (>0 found) | 2 | 0 if no tests exist |
| All tests pass | 4 | -1 per failure (cap -4) |
| Coverage >60% | 2 | Proportional: 30-60%=1, <30%=0 |

**Max: 10 points**

## Autonomy Penalty

Each manual intervention (manual step, workaround, environment fix) reduces the axis score:

```
autonomy_factor = max(0.25, 1 - 0.15 x intervention_count)
axis_score = raw_score x autonomy_factor
```

This measures repository readiness, not agent quality. A repo requiring 5 manual interventions to build is not AI-ready regardless of how good the agent is.

## Composite Score

```
readiness = (A x 0.30) + (B x 0.25) + (C x 0.25) + (D x 0.20)
```

| Score | Rating | Recommendation |
|-------|--------|---------------|
| 8.0-10.0 | Excellent | Ready for AI-assisted development |
| 6.0-7.9 | Good | Minor fixes needed, usable now |
| 4.0-5.9 | Fair | Significant gaps, fix before heavy AI use |
| <4.0 | Poor | Major remediation needed |

## When to Run

- After `Initialize` on a new heir project
- Before starting AI-assisted feature work on an unfamiliar repo
- Quarterly health check on active projects
