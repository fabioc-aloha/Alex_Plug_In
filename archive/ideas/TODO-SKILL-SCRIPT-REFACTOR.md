# Skill Script Refactoring - Complete

**Goal**: Extract inline scripts from skills into `.github/muscles/` for inheritability
**Started**: 2026-02-09
**Completed**: 2026-02-09
**Status**: ✅ Complete

---

## Decision Matrix

| Code Type                                  | Action                           | Reason               |
| ------------------------------------------ | -------------------------------- | -------------------- |
| Automation (run this to do X)              | **EXTRACT** → `.github/muscles/` | Reusable, testable   |
| Documentation examples (curl, API samples) | **KEEP** inline                  | Reference only       |
| Quick one-liners (validation tips)         | **KEEP** inline                  | Not worth extracting |
| Existing script references                 | **KEEP** inline                  | Already extracted    |

---

## Progress by Skill

### ✅ EXTRACTED (New Script Created)

| Skill    | Blocks | Script Created                 |
| -------- | ------ | ------------------------------ |
| brain-qa | 17 PS  | `.github/muscles/brain-qa.ps1` |

### 🔗 REFERENCES EXISTING SCRIPTS (Keep As-Is)

| #   | Skill                   | Blocks | References                                         |
| --- | ----------------------- | ------ | -------------------------------------------------- |
| 1   | release-preflight       | 13 PS  | `scripts/release-preflight.ps1`                    |
| 2   | master-alex-audit       | 1 PS   | `.github/muscles/audit-master-alex.ps1`                    |
| 3   | heir-curation           | 5 PS   | `sync-master-to-heir.ps1`, `validate-synapses.ps1` |
| 4   | release-process         | 4 PS   | `release-vscode.ps1`                               |
| 5   | fabric-notebook-publish | 3 PS   | `Sync-ToFabric.v2.ps1`, `Publish-ToFabric.ps1`     |
| 6   | global-knowledge-sync   | 2 PS   | One-time setup commands                            |

### 📖 DOCUMENTATION EXAMPLES (Keep As-Is)

These skills contain **code examples for reference**, not automation to extract.

| #   | Skill                     | Blocks | Reason                                               |
| --- | ------------------------- | ------ | ---------------------------------------------------- |
| 1   | localization              | 17 JS  | TypeScript locale detection, fallback chain examples |
| 2   | mcp-development           | 14 JS  | MCP server/client implementation patterns            |
| 3   | gamma-presentations       | 14     | curl API examples for Gamma service                  |
| 4   | vscode-extension-patterns | 12     | VS Code extension API patterns                       |
| 5   | chat-participant-patterns | 9 JS   | Chat API handler examples                            |
| 6   | skill-catalog-generator   | 8 JS   | Algorithm documentation                              |
| 7   | project-deployment        | 7 bash | npm/PyPI/NuGet/Cargo commands                        |
| 8   | git-workflow              | 7 PS   | Git command reference                                |
| 9   | pii-privacy-regulations   | 6 JS   | Privacy checklist, no automation                     |
| 10  | api-design                | 6      | OpenAPI skeleton, REST patterns                      |
| 11  | teams-app-patterns        | 5      | Teams manifest, bot examples                         |
| 12  | microsoft-sfi             | 5      | Security guidelines                                  |
| 13  | architecture-audit        | 5      | Audit command examples                               |
| 14  | ascii-art-alignment       | 4 PS   | Validation tips, not scripts                         |
| 15  | infrastructure-as-code    | 4      | Terraform/Bicep examples                             |
| 16  | privacy-responsible-ai    | 4 JS   | RAI implementation patterns                          |
| 17  | debugging-patterns        | 3      | Debug techniques                                     |
| 18  | image-handling            | 3 PS   | ImageMagick/sharp-cli one-liners                     |
| 19  | microsoft-fabric          | 2 PS   | Fabric API examples                                  |
| 20  | m365-agent-debugging      | 2 PS   | Debug command examples                               |
| 21  | error-recovery-patterns   | 2 JS   | Error handling patterns                              |
| 22  | pptx-generation           | 2      | PPTX library examples                                |
| 23  | testing-strategies        | 1 JS   | Test setup examples                                  |
| 24  | text-to-speech            | 1 JS   | TTS API examples                                     |
| 25  | lint-clean-markdown       | 1 JS   | Lint config example                                  |
| 26  | practitioner-research     | 1 JS   | Research methods                                     |
| 27  | markdown-mermaid          | 1 PS   | Mermaid syntax examples                              |
| 28  | research-project-scaffold | 1 bash | Scaffold commands                                    |

---

## Script Location Rules

| Inheritance   | Script Location    | Synced to Heirs?  |
| ------------- | ------------------ | ----------------- |
| `inheritable` | `.github/muscles/` | ✅ Yes             |
| `universal`   | `.github/muscles/` | ✅ Yes             |
| `master-only` | `scripts/` (root)  | ❌ No              |
| `heir:vscode` | `.github/muscles/` | ✅ To VS Code only |
| `heir:m365`   | `.github/muscles/` | ✅ To M365 only    |

---

## Summary

**Systematic review of 77 skills completed.**

| Category                 | Count | Action                                                                                                               |
| ------------------------ | ----- | -------------------------------------------------------------------------------------------------------------------- |
| ✅ Scripts extracted      | 1     | `brain-qa.ps1` created                                                                                               |
| 🔗 Already refs scripts   | 6     | release-preflight, master-alex-audit, heir-curation, release-process, fabric-notebook-publish, global-knowledge-sync |
| 📖 Documentation examples | 28    | Keep as-is (reference code)                                                                                          |
| ⬜ No code blocks         | 42    | N/A                                                                                                                  |

**Key Finding**: Only 1 skill (brain-qa) had extractable automation. All others contain:
- API/library examples for developer reference
- One-liner commands for quick lookup
- Algorithm documentation
- Already-referenced external scripts

**Conclusion**: Refactoring complete. No further extraction needed.

---

## Session Log

### 2026-02-09
- ✅ Created `.github/muscles/` folder
- ✅ Created `.github/muscles/brain-qa.ps1` (525 lines, 15 phases)
- ✅ Refactored brain-qa SKILL.md (543→90 lines)
- ✅ Refactored release-preflight SKILL.md (426→105 lines)
- ✅ Systematic review of all 77 skills
- ✅ Classified: 1 extracted, 6 already ref scripts, 28 docs examples, 42 no code
- ✅ Created tracking document
- ✅ Refactoring complete

---

*Completed: 2026-02-09*
