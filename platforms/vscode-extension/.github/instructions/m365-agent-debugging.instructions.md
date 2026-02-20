# M365 Declarative Agent Debugging Instructions

**Auto-loaded when**: An M365 Copilot declarative agent is not working, manifests fail validation, capabilities are silent, or sideloading is blocked
**Domain**: M365 Copilot, declarative agents, Teams platform debugging
**Synapses**: [m365-agent-debugging/SKILL.md](../skills/m365-agent-debugging/SKILL.md)

---

## Purpose

Systematically diagnose and fix non-functional M365 Copilot declarative agents: schema version mismatches, capability incompatibilities, manifest limit violations, icon errors, and CLI/deployment issues — using MCP tools before manual debugging.

---

## When This Applies

**File Patterns**:
- `**/declarativeAgent.json` — Declarative agent configuration
- `**/manifest.json` — Teams app manifest
- `**/outline.png` — Icon potentially causing validation failure

**Contextual Triggers**:
- "My declarative agent isn't responding"
- "Conversation starters not showing"
- "Capability not working (WebSearch, TeamsMessages, etc.)"
- "Teams app fails sideloading or validation"
- "Error: Invalid schema" or AADSTS errors
- `teamsapp validate` failures

---

## Debugging Protocol

### Step 1: MCP Tools First (Always)

```
@m365agents {describe the exact symptom}
mcp_m365agentstoo_troubleshoot("agent not responding")
mcp_m365agentstoo_get_schema("declarative_agent_manifest")
```

This resolves most issues before manual diagnosis. Only proceed below if MCP tools don't resolve.

### Step 2: Schema Version Validation

```powershell
# Check declared schema version
Select-String -Path declarativeAgent.json -Pattern '"version"'
```

**Valid versions**: `v1.0`, `v1.2`, `v1.5`, `v1.6`
**Invalid and dangerous**: `v1.3`, `v1.4` — make entire document invalid

**Required version by capability:**
| Capability | Minimum |
| ---------- | ------- |
| WebSearch, GraphicArt, CodeInterpreter | v1.2 |
| TeamsMessages, Email, People | v1.5 |
| Meetings, Dataverse, ScenarioModels | v1.6 |

→ If schema version is lower than what capabilities require: upgrade the schema.

### Step 3: Manifest Limits Check

| Property | Limit | Common Failure |
| -------- | ----- | -------------- |
| `description` | 1,000 chars | Truncation rejection |
| `instructions` | 8,000 chars | Silent truncation |
| `conversation_starters` | **6 max** | Only 1 shows (rest silently dropped) |
| `WebSearch.sites` | 4 max | Extra sites silently ignored |
| `TeamsMessages.urls` | 5 max | Extra URLs silently ignored |

```powershell
# Count conversation starters
(Get-Content declarativeAgent.json | ConvertFrom-Json).conversation_starters.Count
```

### Step 4: v1.6 Field Structure

These fields have object structure in v1.6 — plain strings cause silent failures:

```json
// ✅ Correct v1.6:
"disclaimer": { "text": "disclaimer text" }

// ❌ Wrong (pre-v1.6):
"disclaimer": "disclaimer text"
```

### Step 5: Icon Validation

```powershell
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("outline.png")
$pixel = $bmp.GetPixel(0, 0)
$bmp.Dispose()
Write-Host "Alpha: $($pixel.A)"  # Must be 0 for valid icon
Write-Host "Size: $($bmp.Width)x$($bmp.Height)"  # Must be 32x32
```

### Step 6: CLI Package Validation

```powershell
# Always validate before sideloading
npx teamsapp validate --package-file appPackage/build/appPackage.local.zip
```

**CLI Version Check**: v2.x may silently omit `declarativeAgent.json` from zip. If `validate` passes but agent doesn't work, check zip contents:
```powershell
Expand-Archive appPackage.local.zip -DestinationPath .\extracted -Force
Get-ChildItem .\extracted
# declarativeAgent.json must be present
```

---

## Symptom → Cause Quick Reference

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
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
