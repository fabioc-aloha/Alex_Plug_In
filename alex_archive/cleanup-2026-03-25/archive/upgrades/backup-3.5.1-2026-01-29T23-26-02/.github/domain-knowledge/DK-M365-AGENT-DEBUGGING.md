# Domain Knowledge: M365 Declarative Agent Debugging

**Domain**: Microsoft 365 Copilot Agent Development
**Expertise Level**: Intermediate → Advanced (through debugging)
**Created**: 2026-01-29
**Context**: Hard-won knowledge from debugging non-functional agent

---

## Critical Discovery: Schema Version Validation

### The Problem
Agent uploaded successfully but did not respond. Only one conversation starter appeared instead of four.

### Root Cause
**Schema version v1.3 DOES NOT EXIST**. Only these versions are valid:
- v1.0 - Original baseline
- v1.2 - Stable, well-supported (RECOMMENDED)
- v1.5 - Preview features
- v1.6 - Latest with Dataverse

Microsoft's rule: *"Unrecognized or extraneous properties in any JSON object make the entire document invalid."*

### Solution
Always verify schema version against official Microsoft documentation before deployment.

---

## Capability Compatibility Matrix

| Capability | v1.0 | v1.2 | v1.5 | v1.6 |
|------------|------|------|------|------|
| OneDriveAndSharePoint | ❌ | ✅ | ✅ | ✅ |
| WebSearch | ❌ | ✅ | ✅ | ✅ |
| GraphicArt | ❌ | ✅ | ✅ | ✅ |
| CodeInterpreter | ❌ | ✅ | ✅ | ✅ |
| GraphConnectors | ❌ | ✅ | ✅ | ✅ |
| TeamsMessages | ❌ | ❌ | ✅ | ✅ |
| Email | ❌ | ❌ | ✅ | ✅ |
| People | ❌ | ❌ | ✅ | ✅ |
| Meetings | ❌ | ❌ | ✅ | ✅ |
| Dataverse | ❌ | ❌ | ❌ | ✅ |

**Lesson**: Using v1.5/v1.6 capabilities with v1.2 schema causes silent failure.

---

## Icon Requirements (Strict)

### Color Icon (color.png)
- Size: **192 x 192 pixels** exactly
- Background: **Fully solid** (no transparency) OR **fully transparent**
- Logo safe zone: 120 x 120 pixels centered (36px padding)
- Format: PNG

### Outline Icon (outline.png)
- Size: **32 x 32 pixels** exactly
- Content: **White only** (RGB 255,255,255)
- Background: **Fully transparent** (Alpha = 0)
- No padding around symbol
- Format: PNG

### Validation Error Pattern
```
Error: Outline icon is not transparent. It's Alpha,R,G,B: 255,X,X,X
```
This means Alpha=255 (opaque) when it should be Alpha=0 (transparent) for background pixels.

---

## Debugging Workflow

### 1. Validate Before Upload
```powershell
teamsapp validate --package-file <path-to-zip>
```
Must pass all 51 checks.

### 2. Check Schema Version
Verify `$schema` in declarativeAgent.json points to existing version:
- ✅ `https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.2/schema.json`
- ❌ `https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.3/schema.json` (DOESN'T EXIST)

### 3. Verify Capabilities Match Schema
If using v1.2 schema, only use v1.2 capabilities.

### 4. Test Icons
```powershell
# Check outline transparency
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("outline.png")
$pixel = $bmp.GetPixel(0, 0)  # Corner should be transparent
$bmp.Dispose()
"Alpha: $($pixel.A)"  # Should be 0, not 255
```

---

## Package Contents Checklist

Minimal valid package:
- [ ] `manifest.json` - Teams app manifest (v1.19 recommended)
- [ ] `declarativeAgent.json` - Agent configuration (v1.2 recommended)
- [ ] `color.png` - 192x192 solid background icon
- [ ] `outline.png` - 32x32 white on transparent icon

---

## Synapses

### Connected Knowledge
- [SCHEMA-COMPATIBILITY.md] (Critical, Reference, Bidirectional) - "schema version lookup"
- [DECLARATIVE-AGENT-REFERENCE.md] (High, Documentation, Outbound) - "agent configuration"
- [deploy.ps1] (High, Tooling, Outbound) - "validation workflow"

### Activation Triggers
- "agent not working", "agent not responding"
- "schema version", "capability not available"
- "icon not transparent", "validation failed"
- "conversation starters missing"

---

*Knowledge consolidated from debugging session 2026-01-29*
