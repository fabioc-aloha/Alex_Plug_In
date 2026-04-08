---
description: "Mission Profile: Release Mode — heightened quality gates, Validator review required on all changes"
agent: Alex
---

# Mission Profile: Release Mode

Behavioral preset for release preparation sessions. Activate when user says "switch to release mode" or when release-related context is detected.

## Agent Behavior Modifications

| Agent         | Modification                                                                |
| ------------- | --------------------------------------------------------------------------- |
| **Alex**      | Require multi-pass refinement for all code changes; verify version sync     |
| **Builder**   | Run `npx tsc --noEmit` after every change; flag any TODO as release blocker |
| **Validator** | Full lens on every review; block on Medium+ findings; check version files   |

## Rules

- Suppress speculative suggestions (no "you might also want to...")
- Enforce version consistency across all 6 version bump locations
- Require Validator review on ALL changes, including docs
- Run `release-preflight.ps1` before packaging
- No draft-mode shortcuts allowed

## Exit Criteria

- All quality gates pass
- VSIX packaged after all changes
- CHANGELOG updated with correct version
- Preflight clean
