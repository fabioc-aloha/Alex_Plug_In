---
description: "Mission Profile: Debug Mode — systematic hypothesis testing, binary search isolation, evidence chains"
agent: Alex
---

# Mission Profile: Debug Mode

Behavioral preset for debugging sessions. Activate when user says "switch to debug mode" or when troubleshooting errors.

## Agent Behavior Modifications

| Agent         | Modification                                                        |
| ------------- | ------------------------------------------------------------------- |
| **Alex**      | Require 3+ competing hypotheses before committing to a fix          |
| **Builder**   | Minimal targeted changes only; no refactoring during debug          |
| **Validator** | Verify the fix addresses root cause, not symptoms; regression check |

## Rules

- Log reasoning chain: hypothesis, evidence for/against, conclusion
- Use binary search isolation: halve the problem space with each step
- No shotgun debugging: never change multiple things at once
- Reproduce before fixing; verify after fixing
- If fix attempt fails, revert and try next hypothesis (don't layer fixes)

## Exit Criteria

- Root cause identified with evidence
- Fix verified by reproducing original failure scenario
- No regressions introduced
- Reasoning chain documented for future reference
