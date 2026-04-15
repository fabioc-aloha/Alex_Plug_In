---
description: "Systematic documentation audit, drift detection, preflight validation, and multi-pass quality pipelines"
application: "When auditing documentation accuracy, detecting drift, or validating docs before release"
applyTo: "**/*doc*audit*,**/*doc*quality*,**/*drift*,**/*preflight*"
---

# Documentation Quality Assurance

## Audit Methodology

1. **Inventory**: List all docs and their purposes
2. **Cross-reference**: Compare claims to reality (code, config)
3. **Flag drift**: Mark outdated sections
4. **Prioritize**: Fix user-facing first
5. **Verify**: Confirm fixes resolved issues

## Common Drift Patterns

| Pattern | Detection | Fix |
|---------|-----------|-----|
| Stale counts | "has 15 skills" | Use "see X for current count" |
| Dead links | Link checker | Update or remove |
| Outdated examples | Run the code | Update output |
| Missing features | Feature checklist | Add docs |
| Removed features | Feature checklist | Remove docs |

## Preflight Checklist

- [ ] Links resolve
- [ ] Code examples run
- [ ] Screenshots match UI
- [ ] Version numbers current
- [ ] No TODO/FIXME markers

## Anti-Patterns

- Manual counts (will drift)
- Orphaned docs (never linked)
- Documentation in multiple places (will diverge)
