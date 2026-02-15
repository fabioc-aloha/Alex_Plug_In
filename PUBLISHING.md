# VS Code Extension Publishing Guide

**Last Updated**: February 15, 2026

This document contains instructions for publishing and managing the Alex Cognitive Architecture extension on the Visual Studio Code Marketplace.

## Publisher Setup

### Creating a Publisher

1. Visit the [Create Publisher Page](https://marketplace.visualstudio.com/manage/createpublisher)
2. Fill in the required information:
   - **ID:** `fabioc-aloha` (must match the `publisher` field in `package.json`)
   - **Name:** Your display name (e.g., "Fabio C" or "Alex Team")
   - **Email:** Your contact email address
3. Click **Create**

### Managing Publishers

- View all publishers: [https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)
- Manage this extension: [https://marketplace.visualstudio.com/manage/publishers/fabioc-aloha/extensions/alex-cognitive-architecture/hub](https://marketplace.visualstudio.com/manage/publishers/fabioc-aloha/extensions/alex-cognitive-architecture/hub)

## Personal Access Token (PAT) Setup

### Creating a PAT for Publishing

1. Go to [Azure DevOps Personal Access Tokens](https://dev.azure.com/_usersSettings/tokens)
2. Click **+ New Token**
3. Configure the token with these **EXACT** settings:
   - **Name:** `VS Code Marketplace Publisher` (or similar)
   - **Organization:** **"All accessible organizations"** ⚠️ This is critical!
   - **Expiration:** Your choice (90 days recommended)
   - **Scopes:** Select **"Custom defined"**
   - Scroll to **Marketplace** section and check:
     - ✅ **Acquire**
     - ✅ **Manage**
4. Click **Create** and copy the token immediately (you won't see it again)

### Common PAT Errors

**Error:** `Access Denied: needs the following permission(s) on the resource`

**Solution:** The token was likely created for a specific organization instead of "All accessible organizations". Delete the token and create a new one with the correct scope.

## Publishing Commands

### Check Extension Status

Check if the extension is published and view its details:

```powershell
vsce show fabioc-aloha.alex-cognitive-architecture
```

### Build the Extension

The extension uses esbuild for bundling. Build commands:

```powershell
# Development build (with source maps)
npm run compile

# Production build (minified, no source maps)
npm run package

# Watch mode for development
npm run watch
```

### Package Extension Locally

Create a `.vsix` file without publishing:

```powershell
vsce package
```

This runs `npm run package` (production build) and creates `alex-cognitive-architecture-<version>.vsix` in the current directory.

**Note:** The extension bundles all dependencies with esbuild. The `node_modules` folder is excluded from the VSIX.

### Publish to Marketplace

Publish the extension (will prompt for PAT if not logged in):

```powershell
vsce publish
```

### Publish with Version Bump

Automatically increment version and publish:

```powershell
# Patch version (1.1.0 -> 1.1.1)
vsce publish patch

# Minor version (1.1.0 -> 1.2.0)
vsce publish minor

# Major version (1.1.0 -> 2.0.0)
vsce publish major
```

### Logout

Clear cached credentials:

```powershell
vsce logout fabioc-aloha
```

## Verification

### Extension URLs

- **Marketplace Page:** [https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture)
- **Management Hub:** [https://marketplace.visualstudio.com/manage/publishers/fabioc-aloha/extensions/alex-cognitive-architecture/hub](https://marketplace.visualstudio.com/manage/publishers/fabioc-aloha/extensions/alex-cognitive-architecture/hub)

### Check in VS Code

1. Open the **Extensions** view (`Ctrl+Shift+X`)
2. Search for: `publisher:"fabioc-aloha"` or `Alex Cognitive Architecture`
3. If it appears, it's live and indexed

### Validation Timeline

After publishing:
1. **Immediate:** Extension is submitted
2. **5-15 minutes:** Security/malware scanning completes
3. **5-30 minutes:** Extension appears in search results (indexing delay)

Check the Management Hub for the current status (Validating, Published, Error).

## Manual Upload (Alternative Method)

If command-line publishing fails, you can upload manually:

1. Package the extension:
   ```powershell
   vsce package
   ```

2. Go to [Marketplace Management](https://marketplace.visualstudio.com/manage)
3. Select your publisher (`fabioc-aloha`)
4. Click **New Extension** > **Visual Studio Code**
5. Upload the `.vsix` file

## Updating the Extension

1. Make your code changes
2. Update the `version` field in `package.json`
3. Update `CHANGELOG.md` with the changes
4. Commit your changes
5. Run `vsce publish` (or use version bump commands above)

## Troubleshooting

### Extension Not Found After Publishing

- Wait 5-30 minutes for indexing
- Check the Management Hub for validation status
- Verify the URL: `https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture`

### Authentication Failures

- Ensure PAT has "All accessible organizations" scope
- Verify Marketplace Acquire + Manage permissions are checked
- Try logging out and back in: `vsce logout fabioc-aloha` then `vsce publish`

### Publisher Not Found

- Verify the publisher exists at [https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)
- Ensure `package.json` has the correct `publisher` value

## References

- [VS Code Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce CLI Documentation](https://github.com/microsoft/vscode-vsce)
- [Azure DevOps PAT Documentation](https://learn.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate)
