# M365 Declarative Agent Debugging Skill

> Debug non-functional M365 Copilot declarative agents.

## ⚠️ Staleness Warning

M365 Copilot and Teams platform APIs are in rapid evolution. Schema versions, capabilities, and tooling change frequently.

**Refresh triggers:**

- New declarativeAgent schema versions
- Teams Toolkit updates
- New M365 Copilot capabilities
- Developer Portal changes

**Last validated:** January 2026 (Schema v1.6)

**Check current state:** [Declarative Agent Schema](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest), [Teams Toolkit](https://github.com/OfficeDev/TeamsFx)

---

## Schema Version Validation

**Critical**: Only these schema versions exist:

| Version | Status |
| ------- | ------ |
| v1.0 | Original baseline |
| v1.2 | Stable, RECOMMENDED |
| v1.5 | Preview features |
| v1.6 | Latest with Dataverse |

**v1.3 DOES NOT EXIST** — unrecognized schema makes entire document invalid.

## Capability Compatibility

| Capability | v1.2 | v1.5+ |
| ---------- | ---- | ----- |
| OneDriveAndSharePoint | ✅ | ✅ |
| WebSearch | ✅ | ✅ |
| GraphicArt | ✅ | ✅ |
| CodeInterpreter | ✅ | ✅ |
| TeamsMessages | ❌ | ✅ |
| Email | ❌ | ✅ |
| People | ❌ | ✅ |
| Dataverse | ❌ | v1.6 only |

**Lesson**: v1.5/v1.6 capabilities with v1.2 schema = silent failure.

## Icon Requirements

**color.png**: 192×192px, solid background, logo in center 120×120 safe zone

**outline.png**: 32×32px, white only (#FFFFFF), transparent background (Alpha=0)

**Common error**:

```text
Error: Outline icon is not transparent. Alpha,R,G,B: 255,X,X,X
```

Alpha=255 means opaque. Background pixels must be Alpha=0.

## Debugging Workflow

1. **Validate**: `teamsapp validate --package-file <zip>` (must pass all checks)

2. **Check schema**:
   - ✅ `.../declarative-agent/v1.2/schema.json`
   - ❌ `.../declarative-agent/v1.3/schema.json` (doesn't exist)

3. **Verify capabilities match schema version**

4. **Test icon transparency**:

```powershell
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("outline.png")
$pixel = $bmp.GetPixel(0, 0)
$bmp.Dispose()
"Alpha: $($pixel.A)"  # Should be 0
```

## Package Checklist

- [ ] `manifest.json` — Teams app manifest (v1.19)
- [ ] `declarativeAgent.json` — Agent config (v1.2)
- [ ] `color.png` — 192×192 solid
- [ ] `outline.png` — 32×32 white on transparent

## Symptom → Cause

| Symptom | Likely Cause |
| ------- | ------------ |
| Agent not responding | Invalid schema version |
| Only 1 conversation starter | Schema validation failed |
| Validation errors on icon | Wrong transparency/size |

## Memory via OneDrive

Agent reads from OneDrive using `OneDriveAndSharePoint` capability:

1. User creates `Alex-Memory/` folder in OneDrive
2. User shares folder link in chat
3. Agent reads cognitive files from shared folder
4. For writes: Alex generates content → user pastes

**Benefits**: No Azure Functions, no API costs, user controls data.

## Deployment Flow

```powershell
npx teamsapp package --env local
npx teamsapp validate --package-file appPackage/build/*.zip
# Upload to Developer Portal → Preview in Teams
```

## Synapses

See [synapses.json](synapses.json) for connections.
