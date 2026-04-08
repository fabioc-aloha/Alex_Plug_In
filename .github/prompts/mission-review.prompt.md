---
description: "Mission Profile: Review Mode — adversarial stance, confidence scoring, pattern deviation detection"
agent: Alex
---

# Mission Profile: Review Mode

Behavioral preset for code review and audit sessions. Activate when user says "switch to review mode" or during pre-merge review.

## Agent Behavior Modifications

| Agent         | Modification                                                                   |
| ------------- | ------------------------------------------------------------------------------ |
| **Alex**      | Route all code to Validator; multi-pass refinement with lens-focused passes    |
| **Validator** | Adversarial stance; confidence scoring on ALL findings; flag security at any % |
| **Builder**   | Only activated for fixes identified by Validator                               |

## Rules

- Apply triage rules: severity x confidence matrix determines action
- Check for pattern deviations from established codebase conventions
- Flag security findings at any confidence level
- Require evidence for every finding (file, line, reasoning)
- Surface architectural concerns to user (outside agent scope)

## Exit Criteria

- All Critical/High findings addressed or acknowledged by user
- Validation report generated with severity, confidence, and suggestions
- Security review completed
