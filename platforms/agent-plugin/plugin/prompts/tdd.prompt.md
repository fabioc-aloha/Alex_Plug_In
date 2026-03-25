---
description: Start a testing workflow — TDD, test strategy, coverage analysis, or flaky test triage
agent: Alex
---

# /tdd - Testing Strategies

Systematic testing guidance — the right test at the right level.

## Testing Pyramid

| Level | Volume | Speed | What It Catches |
| ----- | ------ | ----- | --------------- |
| Unit | Many (70%) | < 10ms | Logic errors, edge cases, regressions |
| Integration | Some (20%) | < 1s | Wiring bugs, API contracts, data flow |
| E2E | Few (10%) | 5-30s | User journey failures, deployment issues |

## TDD Cycle (Red/Green/Refactor)

1. **🔴 RED**: Write a failing test that defines expected behavior
2. **🟢 GREEN**: Write minimum code to pass the test
3. **🔵 REFACTOR**: Improve code while keeping tests green

TDD works best for well-understood requirements. For exploratory code, write tests after design stabilizes.

## What to Mock (and What Not To)

| Mock This | Don't Mock This |
| --------- | --------------- |
| External HTTP APIs | Your own business logic |
| Database in unit tests | Database in integration tests |
| Time (`Date.now`) | Pure functions |
| File system | Framework internals |

## Coverage Philosophy

| Range | Action |
| ----- | ------ |
| < 50% | Increase — missing critical paths |
| 50-70% | Focus on changed code |
| 70-85% | Maintain, don't chase |
| 85-100% | Review if the effort is worth it |

The real metric: coverage of *changed code* per PR, not overall percentage.

## Flaky Test Triage

| Pattern | Likely Cause | Fix |
| ------- | ------------ | --- |
| Fails 1 in 10 | Timing/race condition | Add waits, remove shared state |
| Fails only in CI | Environment difference | Pin versions, use containers |
| Fails after another test | Test pollution | Isolate setup/teardown |

## Start

What would you like to do? Options:
- **TDD**: Start a Red/Green/Refactor cycle for a feature
- **Strategy**: Design a test strategy for a project or module
- **Coverage**: Analyze test coverage gaps
- **Flaky**: Triage and fix flaky tests
