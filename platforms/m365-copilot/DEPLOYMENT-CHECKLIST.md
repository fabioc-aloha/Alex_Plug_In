# Alex Cognitive M365 Agent - Deployment Checklist

> Complete checklist for deploying and testing the Alex declarative agent in Microsoft 365 Copilot

## 📋 Pre-Deployment Requirements

### Tenant/Admin Settings

| #   | Requirement                           | How to Check/Enable                                                                                                            | Status |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 1   | **Upload custom apps enabled**        | [Teams Admin Center](https://admin.teams.microsoft.com) → Teams apps → Setup policies → Global → "Upload custom apps" = **On** | ⬜      |
| 2   | **M365 Copilot available in tenant**  | Either Copilot licenses purchased OR metered usage enabled                                                                     | ⬜      |
| 3   | **Copilot for Microsoft 365 enabled** | [M365 Admin Center](https://admin.microsoft.com) → Settings → Copilot → Enabled                                                | ⬜      |

### User Requirements

| #   | Requirement                       | How to Check                                                                   | Status |
| --- | --------------------------------- | ------------------------------------------------------------------------------ | ------ |
| 4   | **Microsoft 365 Copilot license** | M365 Admin → Users → [your user] → Licenses → "Microsoft 365 Copilot" assigned | ⬜      |
| 5   | **Or Metered usage enabled**      | Tenant admin enables pay-per-use billing for Copilot                           | ⬜      |
| 6   | **Teams access**                  | User can access Microsoft Teams                                                | ⬜      |

### Azure AD / Entra ID

> ✅ **Not Required for Pure M365!** Alex v4.0.0 uses only native M365 capabilities.
> No Azure Functions, no API plugins, no app registrations needed.

| #    | Requirement                                                      | Status |
| ---- | ---------------------------------------------------------------- | ------ |
| 7-10 | **SKIPPED** - Pure M365 version has no external API dependencies | ✅ N/A  |

---

## 📦 Package Configuration

### Manifest Files

| #   | Item                                 | File                                              | Status |
| --- | ------------------------------------ | ------------------------------------------------- | ------ |
| 11  | **App manifest valid**               | `appPackage/manifest.json` - schema v1.19+        | ⬜      |
| 12  | **App ID is valid GUID**             | `manifest.json` → `id` field                      | ⬜      |
| 13  | **Declarative agent manifest valid** | `appPackage/declarativeAgent.json` - schema v1.3+ | ⬜      |
| 14  | **Instructions defined**             | `declarativeAgent.json` → `instructions` field    | ⬜      |

### Icons

| #   | Item             | Requirement                                                                       | Status |
| --- | ---------------- | --------------------------------------------------------------------------------- | ------ |
| 15  | **Color icon**   | `color.png` - 192x192 pixels, PNG format                                          | ⬜      |
| 16  | **Outline icon** | `outline.png` - 32x32 pixels, PNG, **transparent background**, white content only | ⬜      |

### Package Validation

| #   | Check                  | Command                                                                          | Status |
| --- | ---------------------- | -------------------------------------------------------------------------------- | ------ |
| 17  | **Package validates**  | `npx teamsapp validate --app-package-file ./appPackage/build/appPackage.dev.zip` | ⬜      |
| 18  | **All 51 checks pass** | No errors in validation output                                                   | ⬜      |

---

## 🚀 Deployment Steps

### Option A: Teams Developer Portal ✅ RECOMMENDED

| #   | Step                             | URL/Action                                      | Status |
| --- | -------------------------------- | ----------------------------------------------- | ------ |
| 19  | **Sign in to Developer Portal**  | https://dev.teams.microsoft.com/apps            | ✅      |
| 20  | **Import app package**           | Apps → Import app → Select `appPackage.dev.zip` | ✅      |
| 21  | **Fill Application (client) ID** | Basic information → Application (client) ID     | ✅      |
| 22  | **Preview in Teams**             | Publish → Preview in Teams                      | ✅      |

> **Current Process**: Manual upload via Developer Portal. Package built with `npm run package:dev`.

### Option B: Direct Teams Sideload

| #   | Step                  | URL/Action                                       | Status |
| --- | --------------------- | ------------------------------------------------ | ------ |
| 23  | **Open Teams**        | https://teams.microsoft.com                      | ⬜      |
| 24  | **Go to Apps**        | Apps → Manage your apps                          | ⬜      |
| 25  | **Upload custom app** | Upload an app → Upload a custom app → Select zip | ⬜      |
| 26  | **Add app**           | Click "Add" in the app dialog                    | ⬜      |

### Option C: VS Code Agents Toolkit

| #   | Step                        | Action                                                             | Status |
| --- | --------------------------- | ------------------------------------------------------------------ | ------ |
| 27  | **Open project in VS Code** | `code c:\Development\alex-m365-agent`                              | ⬜      |
| 28  | **Sign in to M365**         | Agents Toolkit sidebar → ACCOUNTS → Sign in to Microsoft 365       | ⬜      |
| 29  | **Verify access**           | Check "Custom App Upload Enabled ✓" and "Copilot Access Enabled ✓" | ⬜      |
| 30  | **Provision**               | LIFECYCLE → Provision                                              | ⬜      |
| 31  | **Deploy/Preview**          | LIFECYCLE → Deploy or F5 to debug                                  | ⬜      |

---

## ✅ Testing

### Access Points

| #   | Test                    | URL                                             | Status |
| --- | ----------------------- | ----------------------------------------------- | ------ |
| 32  | **Open M365 Copilot**   | https://m365.cloud.microsoft/chat               | ✅      |
| 33  | **Find Alex in agents** | Click agents icon → Look for "Alex Cognitive"   | ✅      |
| 34  | **Agent loads**         | No spinning wheel, conversation starters appear | ✅      |
| 35  | **Send test message**   | Type "Hello Alex" and get response              | ✅      |

### Conversation Starters

| #   | Starter                                        | Expected Behavior          | Status |
| --- | ---------------------------------------------- | -------------------------- | ------ |
| 36  | "Hello Alex, what can you help me with today?" | Alex introduces itself     | ✅      |
| 37  | "Help me understand a new concept"             | Alex asks what concept     | ⬜      |
| 38  | "Help me think through a problem"              | Alex engages in discussion | ⬜      |

### OneDrive Memory Setup (CRITICAL)

| #   | Step                               | Action                                                             | Status |
| --- | ---------------------------------- | ------------------------------------------------------------------ | ------ |
| 39  | **Create Alex-Memory folder**      | OneDrive root → New folder → "Alex-Memory"                         | ⬜      |
| 40  | **Create profile.md**              | Inside Alex-Memory → New file → profile.md                         | ⬜      |
| 41  | **Create notes.md**                | Inside Alex-Memory → New file → notes.md                           | ⬜      |
| 42  | **Share folder link WITH Copilot** | Right-click folder → Share → Copy link → **Paste in Copilot chat** | ⬜      |
| 43  | **Grant permission when prompted** | Click "Allow" when Copilot asks for access                         | ⬜      |

> ⚠️ **IMPORTANT**: Simply having the OneDriveAndSharePoint capability enabled is NOT enough!
> You must **explicitly share the folder link in the Copilot chat** so Copilot can request and receive access.
> Without this step, Alex will say it can see OneDrive but cannot actually read your files.

---

## 🔧 Troubleshooting

### Common Issues

| Issue                                 | Possible Cause                              | Solution                                                            |
| ------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| **"Alex can't see my files"**         | **OneDrive folder not shared with Copilot** | ⚠️ **CRITICAL** - Share Alex-Memory folder link WITH Copilot in chat |
| **Spinning wheel forever**            | Missing Copilot license                     | Verify user has M365 Copilot license assigned                       |
| **Spinning wheel forever**            | Tenant not enabled for Copilot              | Check M365 Admin Center → Settings → Copilot                        |
| **"Manifest parsing failed"**         | Invalid JSON or schema                      | Validate with CLI, check for unresolved `${{VAR}}`                  |
| **"App already exists"**              | Duplicate app ID                            | Generate new GUID or update existing app                            |
| **"Failed to import"**                | Portal version issue                        | Try "Switch to previous version" in Developer Portal                |
| **Outline icon not transparent**      | Alpha channel issue                         | Recreate with `Alpha=0` for background                              |
| **Conditional Access block (530084)** | Corporate policy                            | Use privileged account or request exception                         |

### Diagnostic Commands

```powershell
# Validate package
npx teamsapp validate --app-package-file ./appPackage/build/appPackage.dev.zip

# Check M365 account status
npx teamsapp account show

# Login to M365
npx teamsapp account login m365

# Check Azure CLI login
az account show

# List existing app registrations
az ad app list --display-name "Alex" --query "[].{name:displayName, appId:appId}" -o table
```

---

## 📝 Current Configuration

| Setting                       | Value                                               |
| ----------------------------- | --------------------------------------------------- |
| **App ID (Teams)**            | `e29bc39c-1f78-4732-ba00-a6cea76db5b1`              |
| **Manifest Version**          | 1.19                                                |
| **Declarative Agent Version** | v1.3                                                |
| **Application (client) ID**   | ✅ `836d43b2-c343-4bba-88cf-5c2f3fd9fd14` (Alex Dev) |
| **Tenant ID**                 | `72f988bf-86f1-41af-91ab-2d7cd011db47`              |
| **Account**                   | `SC-fc209@microsoft.com`                            |

### Existing Azure AD Apps (Potential Reuse)

| Name      | App ID                                 |
| --------- | -------------------------------------- |
| Alex Dev  | `836d43b2-c343-4bba-88cf-5c2f3fd9fd14` |
| Alex Test | `32eb143b-1f1d-4a66-b5e7-727e8c372cca` |

---

## 📚 References

- [M365 Copilot Prerequisites](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites)
- [Build Declarative Agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/build-declarative-agents)
- [Teams Developer Portal](https://dev.teams.microsoft.com/apps)
- [M365 Admin Center](https://admin.microsoft.com)
- [Teams Admin Center](https://admin.teams.microsoft.com)
- [Azure Portal](https://portal.azure.com)

---

*Last updated: February 11, 2026*
*Version: 5.6.5*
