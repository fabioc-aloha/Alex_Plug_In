---
name: "Master Alex Audit"
description: "Semantic, logic, code, and architectural audit of the Master Alex project — 22 automated sections plus manual consistency review"
---

# Master Alex Audit

> Semantic, logic, code, and architectural audit of the Master Alex project — 22 automated sections plus manual consistency review

## Philosophy

The 22-section script checks structure. But a real audit asks *"does it all make sense together?"*:

| Dimension | Script (Sections 1-22) | Alex (With This Skill) |
|-----------|----------------------|------------------------|
| **Structural** | File existence, counts, format compliance | ✅ Automated |
| **Semantic** | — | Do instruction files describe the same concepts consistently? Does the M365 heir's system prompt match Master's copilot-instructions? |
| **Logic** | — | Are documented workflows achievable? If copilot-instructions says "create DK files" but DK files don't exist, that's a logic error |
| **Code** | TypeScript compile, lint, bundle size | Does the code implement what the docs claim? Are registered commands wired to the right handlers? |
| **Architectural** | Version alignment, heir sync | Is the memory architecture (declarative/procedural/interactive) reflected accurately across all documentation? |

## Overview

**Extends:** [architecture-audit](.github/skills/architecture-audit/SKILL.md)

Master Alex-specific audit procedures that leverage knowledge of:
- Exact folder structure and file locations
- Heir relationships (VS Code extension, M365 agent)
- Safety imperatives and protection mechanisms
- Build/release workflows
- Platform-specific configurations

**Total Audit Sections:** 22
- **Master-Only (1-9):** Version alignment, heir sync, safety imperatives, build artifacts
- **Inheritable (10-22):** UI, dependencies, security, tests, accessibility, localization, assets, config

## Triggers

- "master audit", "full audit"
- "heir sync check", "platform alignment"
- "pre-release master check"
- "dependency audit", "security audit", "ui audit"
- "test coverage", "accessibility audit", "bundle size"
- "semantic consistency", "logic review", "architectural coherence"
- "code-to-docs check", "cross-heir alignment"
- Before publishing heirs to marketplace

## Audit Quick Reference

| # | Section | Inheritable | Priority |
|---|---------|-------------|----------|
| 1-9 | Master-Specific | ❌ | 🔴 Critical |
| 10 | UI Audit | ✅ | 🟡 Medium |
| 11 | Dependency Health | ✅ | 🔴 High |
| 12 | TypeScript & Lint | ✅ | 🔴 High |
| 13 | Security | ✅ | 🔴 High |
| 14 | Bundle Size | ✅ | 🟡 Medium |
| 15 | Git Hygiene | ✅ | 🟡 Medium |
| 16 | Changelog | ✅ | 🟡 Medium |
| 17 | API Compatibility | ✅ | 🟡 Medium |
| 18 | Test Coverage | ✅ | 🟡 Medium |
| 19 | Accessibility | ✅ | 🟢 Low |
| 20 | Localization | ✅ | 🟢 Low |
| 21 | Asset Integrity | ✅ | 🟢 Low |
| 22 | Configuration Files | ✅ | 🟢 Low |

## Production Scripts

**Primary Script**: `.github/muscles/audit-master-alex.ps1`

```powershell
# Full audit (all 22 sections)
.\.github\muscles\audit-master-alex.ps1

# Quick audit (master-specific only, sections 1-9)
.\.github\muscles\audit-master-alex.ps1 -Section quick

# Specific sections
.\.github\muscles\audit-master-alex.ps1 -Section 4,7,13
```

**Supporting Scripts**:

| Script | Covers | Purpose |
|--------|--------|---------|
| `.github/muscles/audit-master-alex.ps1` | 1-22 | Comprehensive audit |
| `scripts/release-preflight.ps1` | 1, 5, 12, 16 | Version sync, build, lint |
| `.github/muscles/sync-architecture.js` | 2 | Heir folder sync |
| `.github/muscles/build-extension-package.ps1` | 2, 3 | Full build (sync + compile + PII) |
| `.github/muscles/validate-synapses.ps1` | 7 | Synapse validation |
| `.github/muscles/validate-skills.ps1` | N/A | Skill frontmatter |

## Section Reference

### Master-Specific (1-9)

| # | Section | What It Checks |
|---|---------|----------------|
| 1 | Version Alignment | package.json ↔ CHANGELOG ↔ copilot-instructions |
| 2 | Heir Folder Sync | Master → heir file counts |
| 3 | Skill Inheritance | synapses.json inheritance values |
| 4 | Safety Imperatives | Kill switch, protection markers |
| 5 | Build Artifacts | dist/extension.js exists and recent |
| 6 | Documentation Cross-Refs | Required links between docs |
| 7 | Synapse Health | Valid connections, no orphans |
| 8 | alex_docs Audit | Version refs, deprecated terms |
| 9 | Skill Network Diagram | Node count matches actual skills |

### Inheritable (10-22)

| # | Section | What It Checks |
|---|---------|----------------|
| 10 | Extension UI | Dead buttons (window.open, location.reload) |
| 11 | Dependency Health | npm audit vulnerabilities |
| 12 | TypeScript & Lint | Compile errors, lint warnings |
| 13 | Security | Secrets in code, CSP compliance |
| 14 | Bundle Size | extension.js size |
| 15 | Git Hygiene | Uncommitted changes, branch status |
| 16 | Changelog | Format, version alignment |
| 17 | API Compatibility | Deprecated VS Code APIs |
| 18 | Test Coverage | Test file count vs source files |
| 19 | Accessibility | ARIA labels, CSS variables |
| 20 | Localization | l10n configuration |
| 21 | Asset Integrity | Icon exists, no missing assets |
| 22 | Configuration Files | launch.json, tsconfig.json, .vscodeignore |

## Synapses

See [synapses.json](synapses.json) for connections to:
- `architecture-audit` (extends) - Generic audit foundation
- `release-preflight` - Pre-release verification
- `heir-curation` - Heir management
- `architecture-health` - Structural integrity
- `vscode-extension-patterns` - Extension-specific knowledge

## Semantic Review Checklist (Manual — Not Scriptable)

After running the script, Alex should check:

- [ ] **Cross-heir semantic parity**: Does M365 system prompt describe Alex the same way copilot-instructions does?
- [ ] **Deprecated terminology**: Any "DK files", "domain-knowledge/" references surviving in active files?
- [ ] **Claim vs. reality**: Do README feature claims match actual implemented commands in package.json?
- [ ] **Process logic**: Are documented workflows (heir evolution, meditation, dream) internally consistent?
- [ ] **Architectural model**: Is the memory architecture (7 working memory slots, 3-tier trifecta) described the same way everywhere?
- [ ] **Code behavior**: Do TypeScript command handlers match what instruction files say they do?
- [ ] **Version source of truth**: Is package.json the canonical version, or are there prose versions that will drift?
