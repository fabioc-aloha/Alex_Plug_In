# Debug M365 Declarative Agent

**Purpose**: Systematically diagnose and fix a non-functional M365 Copilot declarative agent
**Domain**: M365 Copilot, declarative agents, Teams platform
**Duration**: 10-20 minutes
**Output**: Root cause identification + targeted fix + validation confirmation

---

## Debugging Workflow

6 diagnostic layers, executed in order from fastest to most manual:

1. **MCP Tools** — automated diagnosis via @m365agents
2. **Schema Version** — valid version + capability compatibility
3. **Manifest Limits** — starters count, description length, instructions size
4. **Field Structure** — v1.6 object vs. string fields
5. **Icons** — outline.png transparency and dimensions
6. **Package Integrity** — CLI validation + zip contents check

---

## Layer 1: MCP Tools (Start Here)

Always begin with:

```
@m365agents {describe the exact symptom}
```

Or directly call:
```
mcp_m365agentstoo_troubleshoot("{symptom description}")
mcp_m365agentstoo_get_schema("declarative_agent_manifest")
```

**If this resolves the issue** → document fix and done.
**If not** → proceed to Layer 2.

---

## Layer 2: Schema Version Check

```powershell
Select-String -Path declarativeAgent.json -Pattern '"version"|"\$schema"'
```

Expected output for v1.6:
```json
"$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
"version": "v1.6"
```

**Capability → Required Minimum Version:**

| Capabilities | Must Use |
| ------------ | -------- |
| OneDriveAndSharePoint, WebSearch, GraphicArt | v1.2 |
| + TeamsMessages, Email, People | v1.5 |
| + Meetings, Dataverse, ScenarioModels | v1.6 |

**If mismatch found**: Upgrade `$schema` URL and `version` field to required version.
**Caution**: v1.3 and v1.4 do not exist — will invalidate the entire document.

---

## Layer 3: Manifest Limits

```powershell
$da = Get-Content declarativeAgent.json | ConvertFrom-Json

# Check conversation starters count (max 6 in v1.6)
"Starters: $($da.conversation_starters.Count)"

# Check description length (max 1000 chars)
"Description: $($da.description.Length) chars"

# Check instructions length (max 8000 chars)
"Instructions: $($da.instructions.Length) chars"
```

**Common finding**: >6 conversation starters → only first is shown, rest silently dropped.

---

## Layer 4: Field Structure (v1.6)

Check if these fields use the v1.6 object structure:

```powershell
$da = Get-Content declarativeAgent.json | ConvertFrom-Json
$da.disclaimer.GetType().Name           # Should be PSCustomObject, not String
$da.behavior_overrides.GetType().Name   # Should be PSCustomObject if present
```

**v1.6 required structures:**
```json
"disclaimer": { "text": "..." }                          // NOT "..."
"behavior_overrides": {
    "suggestions": { "disabled": false },                // NOT false
    "special_instructions": { "discourage_model_knowledge": false }  // NOT "..."
}
```

---

## Layer 5: Icon Validation

```powershell
# Validate outline.png
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("outline.png")
Write-Host "Dimensions: $($bmp.Width)x$($bmp.Height)"   # Must be 32x32
Write-Host "Alpha: $($bmp.GetPixel(0,0).A)"             # Must be 0
$bmp.Dispose()
```

| Icon | Required |
| ---- | -------- |
| `color.png` | 192×192, solid background |
| `outline.png` | 32×32, white #FFF, Alpha=0 background |

---

## Layer 6: Package Integrity

```powershell
# Build + validate
npx teamsapp package --env local
npx teamsapp validate --package-file appPackage/build/*.zip

# Verify declarativeAgent.json is in zip
Expand-Archive appPackage/build/*.zip -DestinationPath .\debug-extract -Force
Get-ChildItem .\debug-extract
# declarativeAgent.json must appear
Remove-Item .\debug-extract -Recurse
```

**If declarativeAgent.json missing from zip**: Upgrade CLI from v2.x to v3.x.

---

## Findings Report Format

After completing all applicable layers, report:

```markdown
**Root Cause**: {schema mismatch / limit violation / field structure / icon / CLI version}

**Evidence**:
- Layer {N}: {what was found}

**Fix Applied**:
- {Exact change made} in {file}#L{line}

**Validation**:
- [ ] `npx teamsapp validate` passes
- [ ] Agent responds in Teams
- [ ] Capabilities functional
```

---

## Sample

User: "/m365AgentDebug"

Alex:
1. Asks: What is the symptom? (not responding / no starters / capability missing / etc.)
2. Calls `mcp_m365agentstoo_troubleshoot` with symptom
3. If unresolved: runs PowerShell diagnostics for schema version, limits, field structure
4. Identifies root cause + exact fix
5. Validates with `npx teamsapp validate`
6. Reports findings in structured format

**Cross-reference**: `.github/instructions/m365-agent-debugging.instructions.md`
