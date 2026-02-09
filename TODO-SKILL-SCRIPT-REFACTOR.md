# Skill Script Refactoring - Progress Tracker

**Goal**: Extract inline scripts from skills into `.github/scripts/` for inheritability
**Started**: 2026-02-09
**Status**: In Progress

---

## Decision Matrix

| Code Type                                  | Action                           | Reason               |
| ------------------------------------------ | -------------------------------- | -------------------- |
| Automation (run this to do X)              | **EXTRACT** → `.github/scripts/` | Reusable, testable   |
| Documentation examples (curl, API samples) | **KEEP** inline                  | Reference only       |
| Quick one-liners (validation tips)         | **KEEP** inline                  | Not worth extracting |
| Existing script references                 | **KEEP** inline                  | Already extracted    |

---

## Progress by Skill

### ✅ COMPLETED

| Skill             | Blocks | Action        | Script Created                  |
| ----------------- | ------ | ------------- | ------------------------------- |
| brain-qa          | 17 PS  | EXTRACTED     | `.github/scripts/brain-qa.ps1`  |
| release-preflight | 13 PS  | REFS EXISTING | `scripts/release-preflight.ps1` |
| master-alex-audit | 1 PS   | REFS EXISTING | `scripts/audit-master-alex.ps1` |

### � DOCUMENTATION EXAMPLES (Keep As-Is)

These skills contain **code examples for reference**, not automation to extract.

| #   | Skill                     | Blocks | Type   | Reason                                               |
| --- | ------------------------- | ------ | ------ | ---------------------------------------------------- |
| 1   | localization              | 17 JS  | 📖 Docs | TypeScript locale detection, fallback chain examples |
| 2   | mcp-development           | 14 JS  | 📖 Docs | MCP server/client implementation patterns            |
| 3   | gamma-presentations       | 14     | 📖 Docs | curl API examples for Gamma service                  |
| 4   | vscode-extension-patterns | 12     | 📖 Docs | VS Code extension API patterns                       |
| 5   | chat-participant-patterns | 9 JS   | 📖 Docs | Chat API handler examples                            |
| 6   | skill-catalog-generator   | 8 JS   | 📖 Docs | Algorithm documentation                              |
| 7   | project-deployment        | 7 bash | 📖 Docs | npm/PyPI/NuGet/Cargo commands                        |
| 8   | git-workflow              | 7 PS   | 📖 Docs | Git command reference                                |
| 9   | pii-privacy-regulations   | 6 JS   | 📖 Docs | Privacy checklist, no automation                     |
| 10  | api-design                | 6      | 📖 Docs | OpenAPI skeleton, REST patterns                      |
| 11  | teams-app-patterns        | 5      | 📖 Docs | Teams manifest, bot examples                         |
| 12  | microsoft-sfi             | 5      | 📖 Docs | Security guidelines                                  |
| 13  | architecture-audit        | 5      | 📖 Docs | Audit command examples                               |
| 14  | ascii-art-alignment       | 4 PS   | 📖 Docs | Validation tips, not scripts                         |
| 15  | infrastructure-as-code    | 4      | 📖 Docs | Terraform/Bicep examples                             |
| 16  | privacy-responsible-ai    | 4 JS   | 📖 Docs | RAI implementation patterns                          |
| 17  | debugging-patterns        | 3      | 📖 Docs | Debug techniques                                     |
| 18  | image-handling            | 3 PS   | 📖 Docs | ImageMagick/sharp-cli one-liners                     |
| 19  | microsoft-fabric          | 2 PS   | 📖 Docs | Fabric API examples                                  |
| 20  | m365-agent-debugging      | 2 PS   | 📖 Docs | Debug command examples                               |
| 21  | error-recovery-patterns   | 2 JS   | 📖 Docs | Error handling patterns                              |
| 22  | pptx-generation           | 2      | 📖 Docs | PPTX library examples                                |
| 23  | testing-strategies        | 1 JS   | 📖 Docs | Test setup examples                                  |
| 24  | text-to-speech            | 1 JS   | 📖 Docs | TTS API examples                                     |
| 25  | lint-clean-markdown       | 1 JS   | 📖 Docs | Lint config example                                  |
| 26  | practitioner-research     | 1 JS   | 📖 Docs | Research methods                                     |
| 27  | markdown-mermaid          | 1 PS   | 📖 Docs | Mermaid syntax examples                              |
| 28  | research-project-scaffold | 1 bash | 📖 Docs | Scaffold commands                                    |

### 🔗 ALREADY REFERENCES SCRIPTS (Keep As-Is)

These skills reference existing scripts in `scripts/` folder.

| #   | Skill                   | Blocks | References                                                 |
| --- | ----------------------- | ------ | ---------------------------------------------------------- |
| 1   | heir-curation           | 5 PS   | ✅ `sync-master-to-heir.ps1`, `validate-synapses.ps1`, etc. |
| 2   | release-process         | 4 PS   | ✅ `release-vscode.ps1`                                     |
| 3   | fabric-notebook-publish | 3 PS   | ✅ `Sync-ToFabric.v2.ps1`, `Publish-ToFabric.ps1`           |
| 4   | global-knowledge-sync   | 2 PS   | ✅ One-time setup commands                                  |

---

## Script Location Rules

| Inheritance   | Script Location    | Synced to Heirs?  |
| ------------- | ------------------ | ----------------- |
| `inheritable` | `.github/scripts/` | ✅ Yes             |
| `universal`   | `.github/scripts/` | ✅ Yes             |
| `master-only` | `scripts/` (root)  | ❌ No              |
| `heir:vscode` | `.github/scripts/` | ✅ To VS Code only |
| `heir:m365`   | `.github/scripts/` | ✅ To M365 only    |

---

## Summary

**Systematic review of 77 skills completed.**

| Category                 | Count | Action                                                                     |
| ------------------------ | ----- | -------------------------------------------------------------------------- |
| ✅ Scripts extracted      | 1     | `brain-qa.ps1` created                                                     |
| 🔗 Already refs scripts   | 4     | heir-curation, release-preflight, release-process, fabric-notebook-publish |
| 📖 Documentation examples | 28    | Keep as-is (reference code)                                                |
| No code blocks           | 44    | N/A                                                                        |

**Key Finding**: Only 1 skill (brain-qa) had extractable automation. All others contain:
- API/library examples for developer reference
- One-liner commands for quick lookup
- Algorithm documentation
- Already-referenced external scripts

**Recommendation**: No further extraction needed. Refactoring complete.

---

## Session Log

### 2026-02-09 Session 1
- ✅ Created `.github/scripts/` folder
- ✅ Created `.github/scripts/brain-qa.ps1` (525 lines, 15 phases)
- ✅ Refactored brain-qa SKILL.md (543→90 lines)
- ✅ Refactored release-preflight SKILL.md (426→105 lines)
- ✅ Systematic review of 35 skills with code blocks
- ✅ Classified all: 1 extracted, 4 already ref scripts, 28 docs examples
- ✅ Created this tracking document
- ✅ Created `.github/scripts/brain-qa.ps1` (525 lines, 15 phases)
- ✅ Refactored brain-qa SKILL.md (543→90 lines)
- ✅ Refactored release-preflight SKILL.md (426→105 lines)
- ⏳ 32 skills remaining to review

---

*Last Updated: 2026-02-09*
