---
description: "M365 Copilot declarative agent debugging — manifest validation, capability diagnosis, sideloading issues"
application: "When writing tests, validating implementations, or ensuring quality gates pass"
applyTo: "**/*m365*,**/*teams*,**/*declarative*agent*"
inheritance: heir:m365
---

# M365 Agent Debugging — Auto-Loaded Rules

Schema version tables, manifest limits, icon validation code, CLI package instructions → see m365-agent-debugging skill.

## Debugging Protocol (6 Steps)

1. **MCP Tools First**: `@m365agents {describe exact symptom}` — resolves most issues before manual diagnosis
2. **Schema Version**: Check `declarativeAgent.json` version. Valid: v1.0, v1.2, v1.5, v1.6. INVALID: v1.3, v1.4
3. **Manifest Limits**: conversation_starters max 6, instructions max 8000 chars, WebSearch.sites max 4
4. **v1.6 Field Structure**: `disclaimer`, `suggestions`, `special_instructions` are objects, not strings
5. **Icon Validation**: outline.png must be 32x32 with Alpha=0 background (transparent)
6. **CLI Package**: `npx teamsapp validate --package-file *.zip` — v2.x may silently omit declarativeAgent.json

## Symptom → Cause Quick Reference

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Agent not responding | Schema version mismatch | Upgrade to v1.6 |
| Only 1 conversation starter shows | More than 6 defined | Reduce to 6 max |
| Capability silently fails | Schema too old for capability | Match schema to capability minimum |
| Icon validation error (Alpha 255) | Opaque outline.png background | Rebuild with Alpha=0 |
| Sideloading fails | CLI v2.x omitted files | Use CLI v3.x+ |
| AADSTS530084 on login | Conditional access policy | Upload manually at dev.teams.microsoft.com |
| Agent not responding | Invalid schema version or field structure | Validate schema + field types |
| 0-1 conversation starters showing | >6 starters OR schema failed | Count starters, check schema |
| Capability silently missing | Schema too low for capability | Upgrade schema version |
| Sideloading fails | Admin policy or manifest error | `mcp_m365agentstoo_troubleshoot` |
| `AADSTS530084` | Conditional access blocks CLI auth | Manual Developer Portal upload |
| Icon rejection | outline.png not transparent | Alpha=0 on all background pixels |

---

## Resolution Checklist

After diagnosing and fixing issues:
- [ ] Schema version matches all required capabilities
- [ ] `conversation_starters` ≤ 6 items
- [ ] `description` ≤ 1,000 chars, `instructions` ≤ 8,000 chars
- [ ] v1.6 fields use object structure (not plain strings)
- [ ] `outline.png` is 32×32, white-on-transparent
- [ ] `npx teamsapp validate` passes all checks
- [ ] declarativeAgent.json present in zip package
