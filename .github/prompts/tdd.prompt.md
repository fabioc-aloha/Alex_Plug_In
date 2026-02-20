---
description: Start a test-driven development workflow (Red/Green/Refactor)
mode: agent
agent: Alex
---

# /tdd - Test-Driven Development

> **Avatar**: Call `alex_cognitive_state_update` with `state: "building"`. This updates the welcome sidebar avatar.

Guide the Red/Green/Refactor cycle with discipline.

## The Cycle

1. **🔴 RED**: Write a failing test that defines expected behavior
2. **🟢 GREEN**: Write minimum code to pass the test
3. **🔵 REFACTOR**: Improve code while keeping tests green

## Discipline

- Don't skip steps
- Don't write more code than needed to pass
- Tests define the contract
- Refactor only when green

## Start

What feature or behavior would you like to implement using TDD? Let's start with a failing test.


> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: null` to restore default avatar.