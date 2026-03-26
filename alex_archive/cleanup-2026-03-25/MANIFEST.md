# Archive Cleanup -- 2026-03-25

Moved stale, completed, and superseded files to permanent cold storage.

## Sources

| Source                         | Items     | Reason                                                                                                                                                                                                                                                                                              |
| ------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `archive/` (root)              | 14 items  | Entire root archive: completed branding plan, old competitive analysis, pre-ADR-010 copilot-instructions, removed enterprise settings, superseded skill wishlist, broken cloud sync code, old roadmaps, migration backups, legacy prompts, branding concepts, codespaces heir, pre-platforms backup |
| `alex_docs/archive/`           | 30+ items | Already explicitly archived: Command Center background docs, completed branding/migration plans, old audits/comparisons, discontinued heirs, Foundry research, Gamma experiments, v5.x-era designs                                                                                                  |
| `alex_docs/audits/`            | 4 files   | Superseded audits: v6.5.3 audit (Mar 11), heir skill port audit (Mar 14), payload audit (Mar 10), old UI/UX audit (Mar 9)                                                                                                                                                                           |
| `alex_docs/reports/`           | 1 file    | Superseded comprehensive audit (Mar 13)                                                                                                                                                                                                                                                             |
| `alex_docs/actions/`           | 1 file    | Completed action plan: Welcome View (Mar 13, all items done)                                                                                                                                                                                                                                        |
| `alex_docs/research/`          | 13 items  | Old research: stubs moved to AlexPapers, shipped implementation plans, completed evaluations, old mockups/images, competitive analysis PPTX                                                                                                                                                         |
| `alex_docs/features/`          | 2 files   | Redundant with skill system: Gamma Presentations guide, PPTX Generation guide                                                                                                                                                                                                                       |
| `alex_docs/platforms/archive/` | 9 files   | Old platform research: VS Code 1.109 plans, Copilot integration, M365 export, platform comparison (v4.2.6)                                                                                                                                                                                          |
| `scripts/archive/`             | 6 files   | Superseded scripts: old build script, PS1 migration scripts, old sync-master-to-heir                                                                                                                                                                                                                |
| `alex_docs/` root              | 2 files   | Completed converter analysis (46/46), derived brand doc (canonical at AlexLearn)                                                                                                                                                                                                                    |
| `TEST-GUIDE.md` (root)         | 1 file    | Stale v6.5.0 test guide -- superseded by automated tests (232 passing), PRE-PUBLISH-CHECKLIST, and RAI-SAFETY-TEST-GUIDE                                                                                                                                                                            |

## Files Kept (Not Archived)

- `alex_docs/research/AI-WRITING-TELLS.md` -- evergreen reference
- `alex_docs/research/NASA-CODE-STANDARDS-ANALYSIS.md` -- evergreen, 8/10 rules implemented
- `alex_docs/features/GLOBAL-KNOWLEDGE.md` -- active feature doc
- `alex_docs/features/GLOBAL-KNOWLEDGE-SHARING.md` -- active feature doc
- `alex_docs/audits/GCX-MASTER-AUDIT-2026-03-24.md` -- recent cross-repo audit
- `alex_docs/audits/UI-WELCOME-VIEW-AUDIT-2026-03-25.md` -- today's audit
- `alex_docs/ALEX-FIRSTS.md` -- living document, still updated

## Reference Updates

- `ROADMAP-UNIFIED.md` -- 2 links updated to point to new archive paths (Payload Audit, Skill Scan)

## Stats

- **928 files** moved to cold storage
- Build: clean compile verified
- No active code references broken
