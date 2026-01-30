# VS Code Extensions Analysis

> **Generated:** 2026-01-29
> **Updated:** 2026-01-29 (verified from `code --list-extensions`)
> **Total Extensions:** 74
> **Purpose:** Optimize development environment, reduce redundancy, improve performance

---

## 📊 Summary

| Category | Count | Status |
|----------|-------|--------|
| ✅ Essential | 17 | Keeping |
| 👍 Useful | 24 | Keeping |
| 🟡 Specialized | 27 | Keeping if using |
| 📦 Jupyter Support | 4 | Bundled with Jupyter |

### 📝 Extension Inventory Notes

**Key observations:**
- Full Jupyter stack installed (5 extensions)
- Comprehensive Azure tooling (11 extensions)
- Power BI / Fabric suite complete (7 extensions)
- GitLens installed for advanced Git features
- Adaptive Card Previewer installed for M365 development

---

## ✅ Essential Extensions (Keep)

### Core Development

| Extension | Purpose | Notes |
|-----------|---------|-------|
| `github.copilot@1.388.0` | AI pair programming | Core to your workflow |
| `github.copilot-chat@0.36.2` | AI chat interface | Essential for @alex |
| `dbaeumer.vscode-eslint@3.0.20` | JavaScript/TypeScript linting | Industry standard |
| `esbenp.prettier-vscode@12.3.0` | Code formatting | Standard formatter |
| `eamodio.gitlens` | Advanced Git features | Unmatched Git visualization |
| `ms-vscode.powershell@2025.4.0` | PowerShell support | Essential for Windows dev |
| `connor4312.esbuild-problem-matchers@0.0.3` | esbuild error parsing | You use esbuild in Alex |
| `ms-vscode.extension-test-runner@0.0.14` | Extension testing | Essential for Alex development |
| `fabioc-aloha.alex-cognitive-architecture@3.4.2` | Alex Cognitive Architecture | Your extension! |

### Python Stack

| Extension | Purpose | Notes |
|-----------|---------|-------|
| `ms-python.python@2026.0.0` | Python language support | Core, 202M installs |
| `ms-python.vscode-pylance@2025.10.4` | Python IntelliSense | Type checking, completion |
| `ms-python.debugpy@2025.18.0` | Python debugging | Standard debugger |
| `ms-toolsai.jupyter@2025.9.1` | Jupyter notebooks | Essential for data work |
| `ms-toolsai.jupyter-keymap@1.1.2` | Jupyter keybindings | Notebook shortcuts |
| `ms-toolsai.jupyter-renderers@1.3.0` | Jupyter renderers | Output visualization |
| `ms-toolsai.vscode-jupyter-cell-tags@0.1.9` | Cell tags | Notebook organization |
| `ms-toolsai.vscode-jupyter-slideshow@0.1.6` | Slideshow | Presentation mode |
| `charliermarsh.ruff@2026.34.0` | Fast Python linter | ⚡ Rust-based, replaces Black/Pylint |

### Markdown & Documentation

| Extension | Purpose | Notes |
|-----------|---------|-------|
| `bierner.markdown-mermaid@1.30.1` | Mermaid diagrams | Native preview support |
| `davidanson.vscode-markdownlint@0.61.1` | Markdown linting | Quality enforcement |
| `yzhang.markdown-all-in-one@3.6.3` | Markdown editing | TOC, shortcuts, tables |
| `shd101wyy.markdown-preview-enhanced@0.8.20` | Enhanced preview | Advanced features |
| `redhat.vscode-yaml@1.19.1` | YAML support | Schema validation |
| `meezilla.json@0.1.2` | JSON tools | Formatting, validation |
| `streetsidesoftware.code-spell-checker@4.4.0` | Spell checking | Typo detection |

---

## 👍 Useful Extensions (Keep)

### Azure & Cloud

| Extension | Purpose | Notes |
|-----------|---------|-------|
| `ms-azuretools.vscode-azure-github-copilot@1.0.153` | Azure + Copilot | Best practices integration |
| `ms-azuretools.vscode-azure-mcp-server@1.0.1` | Azure MCP | Tool integration for agents |
| `ms-azuretools.vscode-bicep@0.40.2` | Bicep IaC | Azure infrastructure |
| `ms-azuretools.vscode-azurefunctions@1.20.3` | Azure Functions | Serverless dev |
| `ms-azuretools.vscode-azurestaticwebapps@0.13.2` | Static Web Apps | Frontend deployment |
| `ms-azuretools.vscode-cosmosdb@0.30.2` | Cosmos DB | Database explorer |
| `ms-azuretools.vscode-azureresourcegroups@0.11.7` | Resource management | Azure navigation |
| `ms-azuretools.vscode-azureappservice@0.26.4` | App Service | Web app deployment |
| `ms-azuretools.vscode-azurecontainerapps@0.10.0` | Container Apps | Containerized apps |
| `ms-azuretools.vscode-azurestorage@0.17.1` | Azure Storage | Blob/Queue/Table |
| `ms-azuretools.vscode-azurevirtualmachines@0.6.10` | Virtual Machines | VM management |
| `ms-vscode.vscode-node-azure-pack@1.8.0` | Azure extension pack | Bundles common tools |
| `ms-azuretools.azure-dev@0.10.0` | azd CLI | Developer CLI integration |

### Development Tools

| Extension | Purpose | Notes |
|-----------|---------|-------|
| `humao.rest-client@0.25.1` | HTTP client | API testing, rating 4.9 |
| `ms-vscode.live-server@0.4.16` | Live preview | Web development |
| `ms-edgedevtools.vscode-edge-devtools@2.1.10` | Edge DevTools | Browser debugging |
| `jabedhossain.web-preview@1.0.3` | Web preview | Quick HTML preview |
| `github.vscode-github-actions@0.30.1` | GitHub Actions | CI/CD workflow editing |

### Data & Visualization

| Extension | Purpose | Notes |
|-----------|---------|-------|
| `randomfractalsinc.vscode-data-preview@2.3.0` | Data preview | Multiple formats |
| `randomfractalsinc.vscode-data-table@1.14.0` | Data tables | Grid view |
| `randomfractalsinc.tabular-data-viewer@1.8.0` | Tabular data | CSV/TSV viewer |
| `mechatroner.rainbow-csv@3.24.1` | CSV highlighting | Column colors |
| `ms-toolsai.datawrangler@1.24.0` | Data wrangling | pandas-like UI |

### Utility

| Extension | Purpose | Notes |
|-----------|---------|-------|
| `vscode-icons-team.vscode-icons@12.17.0` | File icons | Visual organization |
| `pdconsec.vscode-print@1.6.0` | Print support | Code printing |
| `tomoki1207.pdf@1.2.2` | PDF viewer | Document viewing |
| `mikestead.dotenv@1.0.1` | .env files | Environment variable support |

### Database Tools

| Extension | Purpose | Notes |
|-----------|---------|-------|
| `eliezerrangel.prisma-studio@1.1.2` | Prisma Studio | Database GUI for Prisma |

---

## 🟡 Specialized Extensions (Keep if Using)

### Power BI / Microsoft Fabric

| Extension | Purpose | Keep If |
|-----------|---------|---------|
| `analysis-services.powerbi-modeling-mcp@0.1.9` | Power BI MCP Server | Using AI with Power BI |
| `analysis-services.tmdl@1.6.3` | TMDL language | Editing semantic models |
| `gerhardbrueckl.powerbi-vscode@2.9.0` | Power BI integration | Power BI development |
| `gerhardbrueckl.fabricstudio@2.15.0` | Fabric Studio | Microsoft Fabric work |
| `gerhardbrueckl.onelake-vscode@0.2.1` | OneLake explorer | Fabric data lake |
| `gerhardbrueckl.powerbi-vscode-extensionpack@0.4.0` | Power BI pack | Bundles above |
| `jianfajun.dax-language@0.0.13` | DAX language | Power BI measures |

### Synapse & SQL

| Extension | Purpose | Keep If |
|-----------|---------|---------|
| `synapsevscode.synapse@1.18.0` | Azure Synapse | Synapse development |
| `synapsevscode.vscode-synapse-remote@0.11.0` | Synapse Remote | Remote Synapse work |
| `khattarg.synapse-nexus@0.0.5` | Synapse Nexus | Advanced Synapse |
| `ms-mssql.mssql@1.39.0` | SQL Server | SQL development |
| `ms-mssql.sql-database-projects-vscode@1.5.6` | SQL projects | Database projects |
| `ms-mssql.data-workspace-vscode@0.6.3` | Data workspace | SQL workspace |
| `ms-mssql.sql-bindings-vscode@0.4.1` | SQL bindings | Azure Functions SQL |

### .NET & C#

| Extension | Purpose | Keep If |
|-----------|---------|---------|
| `ms-dotnettools.csharp@2.110.4` | C# language | .NET development |
| `ms-dotnettools.csdevkit@1.90.2` | C# Dev Kit | Enhanced .NET |
| `ms-dotnettools.vscode-dotnet-runtime@3.0.0` | .NET runtime | .NET acquisition |
| `fernandoescolar.vscode-solution-explorer@0.9.2` | Solution explorer | .sln navigation |
| `formulahendry.dotnet@0.0.4` | .NET CLI | Basic .NET commands |

### Teams & M365

| Extension | Purpose | Keep If |
|-----------|---------|---------|
| `teamsdevapp.ms-teams-vscode-extension@6.4.3` | Teams Toolkit | Teams/M365 development |
| `teamsdevapp.vscode-adaptive-cards` | Adaptive Card Previewer | M365 card development |

### R Language

| Extension | Purpose | Keep If |
|-----------|---------|---------|
| `reditorsupport.r@2.8.6` | R language | R development |
| `reditorsupport.r-syntax@0.1.3` | R syntax | R highlighting |

---

## 🆕 Recommended Additions

| Extension | Purpose | Status |
|-----------|---------|--------|
| `teamsdevapp.vscode-adaptive-cards` | Adaptive Card preview/debug | ✅ **Installed** |
| `eamodio.gitlens` | Advanced Git features | ✅ **Installed** |
| `formulahendry.auto-rename-tag` | HTML/XML tag rename | 🟡 Optional |
| `waderyan.gitblame` | Inline git blame | 🟡 Optional (GitLens has this) |

---

## ⚙️ Configuration Recommendations

### 1. Resolve Formatter Conflicts

```json
// settings.json
{
  // Use Ruff for Python (disables Black/isort)
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true
  },

  // Use Prettier for JS/TS (coordinate with ESLint)
  "[javascript][typescript][json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // Disable ESLint formatting (use for linting only)
  "eslint.format.enable": false
}
```

### 2. Reduce GitLens Memory Usage

```json
{
  "gitlens.codeLens.enabled": false,  // If not using
  "gitlens.currentLine.enabled": true,
  "gitlens.hovers.enabled": false     // If causing slowness
}
```

### 3. Markdown Extension Harmony

```json
{
  // Use markdownlint for linting
  "markdownlint.run": "onSave",

  // Use markdown-all-in-one for editing
  "markdown.extension.toc.updateOnSave": true,

  // Disable markdown-preview-enhanced (redundant)
  // Just uninstall it
}
```

---

## 📋 Action Checklist

### ✅ Verified Installed (2026-01-29)

Confirmed via `code --list-extensions --show-versions`:
- [x] 74 extensions total
- [x] Full Azure tooling suite (11 extensions)
- [x] Full Power BI/Fabric suite (7 extensions)
- [x] Full Jupyter stack (5 extensions)
- [x] Alex Cognitive Architecture v3.4.2
- [x] GitLens for advanced Git features
- [x] Adaptive Card Previewer for M365 development

### 🔲 Recommended Actions

- [x] ~~**Install** `teamsdevapp.vscode-adaptive-cards`~~ ✅ Done
- [x] ~~**Install** `eamodio.gitlens`~~ ✅ Done
- [ ] **Restart** VS Code to activate new extensions
- [ ] **Update** Alex extension to 3.4.3 when available

---

## 🔗 Related

- [ROADMAP-VSCODE-V3.5.md](../ROADMAP-VSCODE-V3.5.md) - Alex extension roadmap
- [VS Code Extension Best Practices](https://code.visualstudio.com/docs/editor/extension-marketplace)
