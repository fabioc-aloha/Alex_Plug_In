# Global Knowledge

> Cross-project insights that follow you across all AI surfaces. When you learn something valuable in one context (VS Code, M365 Copilot, or any agent), consolidate it here so all your AI partners can access it.

## PowerShell Patterns

### String replacement corrupts multi-byte content
- **Source**: AlexMaster development, multiple incidents
- **Insight**: PowerShell `-replace` on `Get-Content -Raw` can corrupt multi-byte emoji. After bulk PS string ops on markdown, verify with `Select-String`. Also, `-replace` treats dollar signs in replacement strings as regex group references; use `.Replace()` for literal template substitution.
- **Date**: 2026

### PS1 scripts must be LLM-friendly
- **Source**: Alex extension development
- **Insight**: No emoji (use ASCII bracket `[OK]`), no interactive prompts (Read-Host), no readline. Emoji in executable code breaks PowerShell 5.1 parsing without UTF-8 BOM.
- **Date**: 2026

## Azure Patterns

### SWA auth and analytics (proven)
- **Source**: HeadstartWebsite, FishbowlGovernance, SurveyOps
- **Insight**: SWA EasyAuth for login (`/.auth/login/aad`). Domain gating via `fetch('/.auth/me')`. Analytics: Azure Table Storage partitioned by date. Tracker: `navigator.sendBeacon` on `visibilitychange`. Admin gating: `x-ms-client-principal` header.
- **Date**: 2026

### SWA CLI v2.0.8 is broken
- **Source**: SurveyOps deployment
- **Insight**: `swa deploy` exits 0 but never uploads. Use StaticSitesClient.exe binary directly. FUNCTION_LANGUAGE_VERSION env var must match `platform.apiRuntime` in staticwebapp.config.json or API returns 404.
- **Date**: 2026

### Corp tenant blocks client secrets
- **Source**: Microsoft corporate tenant
- **Insight**: `CredentialTypeNotAllowedAsPerAppPolicy` blocks ALL client secret creation on microsoft.com tenant. Use SWA built-in Entra auth instead of custom app registration.
- **Date**: 2026

### Cosmos DB liveness probe risk
- **Source**: SurveyOps production incident
- **Insight**: NEVER query Cosmos DB from /health endpoint. Bulk writes cause throttling + timeout = container kill loop. YAML patching Container Apps must include ALL env vars or they get wiped. Cosmos has 400KB doc limit; large aggregated responses exceed it.
- **Date**: 2026

### JIT expiry breaks ACR builds
- **Source**: SurveyOps deployment
- **Insight**: ACR builds fail with AuthorizationFailed when JIT role expires. Re-activate Corp Tenant DevOps Role before builds.
- **Date**: 2026

## Frontend Patterns

### Tailwind CSS gotchas
- **Source**: Multiple projects
- **Insight**: Default opacity scale is multiples of 5 only; `/8`, `/12` silently ignored. Use arbitrary syntax `bg-primary/[8%]`. `to-transparent` gradients look truncated against white; prefer flat tint. amber-500 + white text fails WCAG AA (2.1:1); use `text-stone-900` (7.4:1). iOS auto-zoom: any input with font-size < 16px triggers viewport zoom; never use `text-sm` on form controls.
- **Date**: 2026

### PageSpeed and Core Web Vitals
- **Source**: SurveyOps, HeadstartWebsite
- **Insight**: SPA CLS killer is `if (!data) return null` (renders empty then full in one frame). Always render skeleton with `animate-pulse`. Every `<img>` needs explicit width/height. Google Fonts `<link>` tags are render-blocking (~1,150ms); use async JS injection. Generate multiple image sizes at build time. Hero images need `<link rel="preload">` + `fetchPriority="high"`. Mobile scores have 5-10 point variance.
- **Date**: 2026

### CSP and third-party auth
- **Source**: Multiple projects
- **Insight**: Google SDK needs `accounts.google.com` in script-src/connect-src/form-action, `lh3.googleusercontent.com` in img-src. Apple needs `appleid.cdn-apple.com` in script-src, `appleid.apple.com` in connect-src/form-action.
- **Date**: 2026

### Custom Markdown renderers
- **Source**: Alex extension development
- **Insight**: Container elements (bold, italic, blockquote) MUST recursively parse inner content. Without this, `**[link](url)**` renders raw syntax instead of bold clickable link.
- **Date**: 2026

## AI Image Generation

### Replicate/Flux patterns
- **Source**: Alex brand asset generation
- **Insight**: Flux 1.1 Pro supported ratios: 1:1, 3:2, 2:3, 4:5, 5:4, 16:9, 9:16. For non-standard (e.g. 21:9), use `ratio: "custom"` with explicit width/height (max 1440px). Always `--dry-run` first. When using `object-fit: cover`, generate at exact CSS display aspect ratio. WebP 90% quality is default output.
- **Date**: 2026

## Design Patterns

### Multi-option design collaboration
- **Source**: Alex brand development
- **Insight**: Create breadth (5+ variants) > Show at scale (preview tool) > Decide fast (user picks immediately). Favicon workflow: use banner colors/shapes for consistency; test at 16px, 32px, 64px; hard-refresh clears browser cache.
- **Date**: 2026

## SurveyOps Project Reference

### Architecture
- **Source**: SurveyOps (c:\Development\Fishbowl)
- **Insight**: .NET 8 API with background service (2-hour cycle). 365-day bootstrap lookback, 7-day incremental. Qualtrics API fra1 endpoint, 46 active surveys. Container App: min/max 1 replica, 1 CPU, 2Gi memory. Frontend: SWA Free tier with custom domain (cs.gcxops.com). Bootstrap detection: use set-merge of discovered vs cached surveys, not count==0.
- **Date**: April 2026

## Microsoft Graph

### MS Graph MCP usage
- **Source**: Alex MCP development
- **Insight**: Call `suggest_queries` first, then `get` with `relativeUrl` param (not `url`). Available scopes: me, users, auditLogs, calendar, mail, teams, groups, SharePoint, OneDrive.
- **Date**: 2026

## Workflow Patterns

### VSIX packaging order
- **Source**: Alex extension v7.0.1 hotfix
- **Insight**: Always package AFTER all code changes are complete. v7.0.1 hotfix was caused by packaging before UI buttons were added.
- **Date**: 2026

### GitHub branch protection for solo repos
- **Source**: AlexMaster repo
- **Insight**: `enforce_admins: true` blocks ALL direct pushes including admin. For solo repos: toggle off, push, toggle on. Use `gh api` not `-f` flags (sends strings not booleans).
- **Date**: 2026

### Lighthouse v12 changes
- **Source**: SurveyOps audit
- **Insight**: PWA category removed. `--only-categories` with `pwa` produces empty JSON. Omit the flag or use `performance,accessibility,best-practices,seo`.
- **Date**: 2026

---
*Updated by consolidation sessions across all AI surfaces. VS Code syncs insights here automatically via global knowledge sync.*
