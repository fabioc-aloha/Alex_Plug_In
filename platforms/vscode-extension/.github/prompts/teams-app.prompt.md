# Teams App Development

**Purpose**: Scaffold or troubleshoot a Microsoft Teams app or M365 Copilot declarative agent with correct schema, icons, and packaging
**Domain**: Microsoft Teams, M365 platform, declarative agents
**Duration**: 15-45 minutes depending on complexity
**Output**: Valid `manifest.json` + `declarativeAgent.json` + icon guidance + CLI commands

---

## Workflow

5 steps for a working Teams/M365 app:

1. **App Type** — confirm: declarative agent vs bot vs tab vs messaging extension
2. **Schema Selection** — correct DA schema version for required capabilities
3. **Manifest Generation** — Teams manifest + DA manifest with correct fields
4. **Icon Validation** — color + outline spec compliance
5. **Package & Validate** — CLI commands or manual upload fallback

---

## Step 1: App Type

Clarify the scenario before generating files:

- **Declarative Agent (M365 Copilot)** → `declarativeAgent.json` + Teams manifest as container
- **Bot** → `TeamsActivityHandler`, bot registration, manifest bot entry
- **Tab** → Static or configurable tab, Teams JS SDK
- **Messaging Extension** — search or action command

For **Declarative Agents**: What capabilities does it need?
→ Use this to select schema version (see Step 2).

---

## Step 2: Schema Selection

```
Capabilities needed → Required schema version:

WebSearch / GraphicArt / CodeInterpreter / GraphConnectors
  → Use v1.2

+ TeamsMessages / Email / People
  → Use v1.5

+ Meetings / Dataverse / ScenarioModels
  → Use v1.6
```

**Always use the minimum version that supports all required capabilities.**

---

## Step 3: Manifest Generation

### Teams App Manifest (`manifest.json` — v1.19)

```json
{
    "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/vNext/MicrosoftTeams.schema.json",
    "manifestVersion": "1.19",
    "version": "1.0.0",
    "id": "{guid}",
    "name": { "short": "{App Name}", "full": "{App Full Name}" },
    "description": {
        "short": "{Short description ≤80 chars}",
        "full": "{Full description ≤4000 chars}"
    },
    "icons": { "outline": "outline.png", "color": "color.png" },
    "developer": {
        "name": "{Developer Name}",
        "websiteUrl": "https://example.com",
        "privacyUrl": "https://example.com/privacy",
        "termsOfUseUrl": "https://example.com/terms"
    },
    "validDomains": [],
    "copilotAgents": {
        "declarativeAgents": [{
            "id": "declarativeAgent",
            "file": "declarativeAgent.json"
        }]
    }
}
```

### Declarative Agent (`declarativeAgent.json`)

For v1.6 (all capabilities):
```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
    "version": "v1.6",
    "name": "{Agent Name}",
    "description": "{Description ≤1000 chars}",
    "instructions": "{System prompt ≤8000 chars}",
    "conversation_starters": [
        { "title": "{Starter 1}", "text": "{Prompt text}" },
        { "title": "{Starter 2}", "text": "{Prompt text}" }
    ],
    "capabilities": [
        { "name": "OneDriveAndSharePoint" },
        { "name": "WebSearch" }
    ]
}
```

**v1.6 field corrections** (common mistakes):
```json
// ❌ Wrong:
"disclaimer": "text string"
// ✅ Correct v1.6:
"disclaimer": { "text": "text string" }

// ❌ Wrong:
"conversation_starters": [{ "text": "12 starters..." }]  // max was 12 in v1.2
// ✅ Correct v1.6: max 6 conversation starters
```

---

## Step 4: Icon Validation

**Generate icon guidance:**

| Icon | Size | Background | Content |
| ---- | ---- | ---------- | ------- |
| `color.png` | 192×192px | Solid color | Logo in center 120×120 safe zone |
| `outline.png` | 32×32px | Transparent (Alpha=0) | White only (#FFFFFF) |

**Validate outline transparency:**
```powershell
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("outline.png")
"Alpha: $($bmp.GetPixel(0, 0).A)"  # Must be 0 (transparent)
$bmp.Dispose()
```

---

## Step 5: Package & Validate

```powershell
# Build package (CLI v3.x)
npx teamsapp package --env local

# Validate
npx teamsapp validate --package-file appPackage/build/appPackage.local.zip

# Preview
npx teamsapp preview --env local
```

**If conditional access blocks CLI auth (`AADSTS530084`):**
1. Build + validate locally
2. Upload manually: https://dev.teams.microsoft.com/apps

---

## Troubleshooting Protocol

For any Teams/M365 issue, **use MCP tools first**:

```
@m365agents {describe the error or symptom}
@m365agents get_schema declarative_agent_manifest
@m365agents troubleshoot "sideloading fails"
```

| Symptom | Likely Cause |
| ------- | ------------ |
| No conversation starters | Schema version too low or > 6 starters |
| Silent capability failure | Schema mismatch (e.g., v1.2 + TeamsMessages) |
| `AADSTS530084` | Conditional access — use manual upload |
| Icon error on upload | outline.png not transparent |

---

## Sample

User: "/teamsApp"

Alex:
1. Asks: What type? (declarative agent / bot / tab) + What capabilities?
2. Selects correct DA schema version based on capabilities
3. Generates `manifest.json` (v1.19) + `declarativeAgent.json`
4. Provides icon size/transparency requirements
5. Runs OR provides CLI validation commands
6. Offers conditional access fallback if needed

**Cross-reference**: `.github/instructions/teams-app-patterns.instructions.md`
