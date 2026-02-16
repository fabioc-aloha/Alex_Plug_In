# M365 Office Add-in — GitHub Pages Hosting

This folder contains the **web-hosted** files for the Alex M365 Office Add-in.

## What's Hosted Here

| Path                            | Purpose                            | Used By                          |
| ------------------------------- | ---------------------------------- | -------------------------------- |
| `taskpane/taskpane.html`        | Main task pane UI                  | Word, Excel, PowerPoint, Outlook |
| `taskpane/taskpane.js`          | Task pane logic and initialization | All Office hosts                 |
| `taskpane/office-operations.js` | Office.js API operations           | All Office hosts                 |
| `taskpane/custom-functions.js`  | Excel custom functions             | Excel only                       |
| `taskpane/action-panel.js`      | Host-specific action panels        | All Office hosts                 |
| `taskpane/functions.json`       | Excel custom function metadata     | Excel only                       |
| `appPackage/color.png`          | App icon (192x192)                 | Manifest references              |
| `appPackage/outline.png`        | App icon outline (32x32)           | Manifest references              |
| `appPackage/*.svg`              | Vector icons                       | Future use                       |

## Live URLs

**Task Pane**: https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/taskpane/taskpane.html

**Landing Page**: https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/

**Icons**:
- Color: https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/appPackage/color.png
- Outline: https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/appPackage/outline.png

## Deployment

### Automatic (Script)

```powershell
cd platforms/m365-copilot
.\deploy-to-github-pages.ps1

# With auto-commit:
.\deploy-to-github-pages.ps1 -Commit
```

### Manual

```powershell
# Copy files
Copy-Item -Path "platforms\m365-copilot\taskpane\*" `
  -Destination "docs\platforms\m365-copilot\taskpane\" -Recurse -Force

Copy-Item -Path "platforms\m365-copilot\appPackage\*.png" `
  -Destination "docs\platforms\m365-copilot\appPackage\" -Force

# Commit and push
git add docs/platforms/m365-copilot/
git commit -m "deploy: Update Office Add-in taskpane files"
git push
```

### Verification

After pushing to GitHub, wait 2-3 minutes for GitHub Pages to update, then verify:

```powershell
# Check if taskpane loads
Start-Process "https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/taskpane/taskpane.html"

# Check icons
Start-Process "https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/appPackage/color.png"
```

Expected: No 404 errors, files load correctly

## Manifest References

The unified manifest (`appPackage/manifest.json`) references these URLs:

```json
{
  "extensions": [{
    "runtimes": [{
      "code": {
        "page": "https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/taskpane/taskpane.html"
      }
    }],
    "ribbons": [{
      "tabs": [{
        "groups": [{
          "controls": [{
            "icons": [
              {
                "size": 16,
                "url": "https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/appPackage/outline.png"
              },
              {
                "size": 32,
                "url": "https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/appPackage/outline.png"
              },
              {
                "size": 80,
                "url": "https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/appPackage/color.png"
              }
            ]
          }]
        }]
      }]
    }]
  }]
}
```

## CORS Configuration

GitHub Pages automatically serves with appropriate CORS headers for Office Add-ins. No additional configuration needed.

## Cache Invalidation

If updates don't appear immediately:

1. **GitHub Pages**: Wait 2-3 minutes for CDN propagation
2. **Browser**: Hard refresh (Ctrl+F5)
3. **Office Cache**: Restart Office application
4. **Manifest Cache**: Re-upload package to M365

## Security

- ✅ HTTPS only (required for Office Add-ins)
- ✅ No secrets or credentials in hosted files
- ✅ OneDrive authentication via Microsoft Graph (OAuth 2.0)
- ✅ Read-only access to user's Alex-Memory folder

## Troubleshooting

### 404 Error on taskpane.html

**Cause**: Files not deployed to GitHub Pages yet

**Fix**:
```powershell
.\deploy-to-github-pages.ps1 -Commit
git push
# Wait 2-3 minutes
```

### Network Error in Office

**Cause**: CORS issue or GitHub Pages down

**Fix**:
1. Verify URL loads in browser
2. Check Network tab in browser DevTools
3. Verify GitHub Pages is enabled on repository

### Icons Don't Load

**Cause**: Icon paths incorrect in manifest

**Fix**: Verify URLs in manifest.json match deployed file locations

### Changes Not Appearing

**Cause**: Browser or Office cache

**Fix**:
1. Hard refresh browser (Ctrl+F5)
2. Restart Office application
3. Clear Office cache: Delete `%LOCALAPPDATA%\Microsoft\Office\16.0\Wef\`

## Source of Truth

These files are **copies** for web hosting. The source of truth is:

`platforms/m365-copilot/taskpane/` ← **Edit here, then deploy**

**Never edit files in docs/ directly** — changes will be overwritten on next deployment.

## Deployment History

| Date       | Version | Changes                         |
| ---------- | ------- | ------------------------------- |
| 2026-02-16 | v5.7.7  | Initial GitHub Pages deployment |

---

**Status**: ✅ Deployed
**Last Updated**: 2026-02-16
**GitHub Pages**: https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/
