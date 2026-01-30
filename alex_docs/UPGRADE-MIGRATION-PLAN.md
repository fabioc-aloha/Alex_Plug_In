# Alex Upgrade Migration Plan

> **Purpose:** Define how Alex handles upgrades when projects have existing cognitive architecture, including domain knowledge, skills, and synapses.

|             |                                                                                |
| ----------- | ------------------------------------------------------------------------------ |
| **Status**  | 📋 Planning                                                                    |
| **Created** | 2026-01-30                                                                     |
| **Related** | [SKILLS-CATALOG.md](SKILLS-CATALOG.md), [MEMORY-SYSTEMS.md](MEMORY-SYSTEMS.md) |

---

## Philosophy: User-Driven Migration

**Principle:** Don't try to be too clever. Let the user decide what to keep.

Complex auto-merge algorithms are:

- Hard to get right
- Hard to debug when they fail
- Surprising to users ("where did my stuff go?")

Instead: **Backup → Fresh Install → Gap Analysis → User Decides**

---

## Migration Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│                     UPGRADE TRIGGERED                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: BACKUP                                                 │
│                                                                 │
│  archive/upgrades/backup-{version}-{timestamp}/                 │
│  ├── .github/                  (entire folder)                  │
│  ├── domain-knowledge/         (explicit copy)                  │
│  └── manifest-snapshot.json    (state at backup time)           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: FRESH INSTALL                                          │
│                                                                 │
│  • Delete .github/ entirely                                     │
│  • Install new heir from extension package                      │
│  • Clean slate with latest architecture                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: GAP ANALYSIS                                           │
│                                                                 │
│  Compare backup vs new install:                                 │
│  • DK files in backup but not in new                           │
│  • Skills in backup but not in new                             │
│  • Modified system files (checksum diff)                       │
│  • User profile settings                                       │
│  • Episodic records (meditation sessions, etc.)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: MIGRATION CANDIDATE DOCUMENT                           │
│                                                                 │
│  Generate: .github/MIGRATION-CANDIDATES.md                      │
│                                                                 │
│  Contents:                                                      │
│  • List of user-created DK files with summaries                │
│  • List of modified system files with diffs                    │
│  • User profile (auto-restore recommended)                     │
│  • Episodic records (auto-restore recommended)                 │
│  • Checkboxes for user to select what to migrate               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: USER REVIEW                                            │
│                                                                 │
│  • Open MIGRATION-CANDIDATES.md in editor                      │
│  • User reviews each item                                      │
│  • User checks boxes for items to migrate                      │
│  • User can manually copy content if preferred                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: EXECUTE MIGRATION                                      │
│                                                                 │
│  "Alex: Complete Migration" command:                           │
│  • Read checked items from MIGRATION-CANDIDATES.md             │
│  • Copy selected files from backup to new .github/             │
│  • Restore user profile                                        │
│  • Restore episodic records                                    │
│  • Delete MIGRATION-CANDIDATES.md                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 7: CLEANUP (Optional)                                     │
│                                                                 │
│  Ask user:                                                      │
│  • Keep backup in archive/? (default: yes)                     │
│  • Delete backup to save space?                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Migration Candidates Document Format

Generated at `.github/MIGRATION-CANDIDATES.md`:

````markdown
# Migration Candidates

> Generated by Alex Upgrade on 2026-01-30
> Review and check items you want to migrate from your previous installation.

## Instructions

1. Review each section below
2. Check the boxes [x] for items you want to keep
3. Run "Alex: Complete Migration" when ready
4. Or manually copy files from `archive/upgrades/backup-3.5.3-2026-01-30/`

---

## 📚 User-Created Domain Knowledge

These files were created by you and don't exist in the new version:

- [x] `DK-MY-PROJECT-API.md` — API patterns for MyProject (12 KB)
- [x] `DK-TEAM-CONVENTIONS.md` — Team coding standards (4 KB)  
- [ ] `DK-OLD-EXPERIMENT.md` — Experimental notes (2 KB) ⚠️ Last modified 6 months ago

## 🎓 User-Created Skills

These skills were created by you:

- [x] `my-project-api/` — Custom API patterns (SKILL.md + synapses.json)
- [ ] `legacy-system/` — Old system knowledge ⚠️ No synapses

## 📝 Modified System Files

These system files were modified from their original versions:

- [ ] `DK-APPROPRIATE-RELIANCE.md` — You added 3 custom examples

  <details><summary>View diff</summary>

  ```diff
  + ## My Custom Examples
  + - Example 1: ...
  + - Example 2: ...
  ```

  </details>

## 👤 User Profile

- [x] `config/user-profile.json` — Your preferences (auto-restore recommended)
- [x] `config/USER-PROFILE.md` — Your profile document

## 📜 Episodic Records

- [x] `episodic/` — 5 meditation sessions, 3 dream reports (auto-restore recommended)

---

## Backup Location

All files available at:
`archive/upgrades/backup-3.5.3-2026-01-30T14-30-00/`

You can manually copy any files from this location.
````

---

## Implementation

### New Commands

| Command | Purpose |
| ------- | ------- |
| `Alex: Upgrade` | Existing — now uses new migration flow |
| `Alex: Complete Migration` | New — processes checked items |
| `Alex: Show Migration Candidates` | New — reopens the document |

### Gap Analysis Logic

```typescript
interface MigrationCandidate {
  type: 'user-dk' | 'user-skill' | 'modified-system' | 'profile' | 'episodic';
  path: string;
  description: string;
  size: number;
  lastModified: Date;
  recommended: boolean;
  stale: boolean;  // Not modified in > 3 months
  diff?: string;   // For modified system files
}

async function runGapAnalysis(
  backupPath: string,
  newInstallPath: string
): Promise<MigrationCandidate[]> {
  const candidates: MigrationCandidate[] = [];
  
  // 1. Find user-created DK files
  const backupDK = await listFiles(path.join(backupPath, '.github/domain-knowledge'));
  const newDK = await listFiles(path.join(newInstallPath, '.github/domain-knowledge'));
  
  for (const file of backupDK) {
    if (!newDK.includes(file)) {
      candidates.push({
        type: 'user-dk',
        path: `domain-knowledge/${file}`,
        description: await extractFirstLine(file),
        size: await getFileSize(file),
        lastModified: await getModTime(file),
        recommended: true,
        stale: isStale(file, 90), // 90 days
      });
    }
  }
  
  // 2. Find user-created skills
  // 3. Find modified system files (checksum compare)
  // 4. Add profile (always recommended)
  // 5. Add episodic (always recommended)
  
  return candidates;
}
```

### Processing Checked Items

```typescript
async function completeMigration(
  candidatesFile: string,
  backupPath: string,
  targetPath: string
): Promise<MigrationReport> {
  const content = await fs.readFile(candidatesFile, 'utf8');
  const checkedItems = parseCheckedItems(content);
  
  const report: MigrationReport = {
    migrated: [],
    skipped: [],
    errors: [],
  };
  
  for (const item of checkedItems) {
    try {
      const src = path.join(backupPath, item.path);
      const dest = path.join(targetPath, item.path);
      
      await fs.copy(src, dest);
      report.migrated.push(item.path);
    } catch (error) {
      report.errors.push({ path: item.path, error: error.message });
    }
  }
  
  // Cleanup
  await fs.remove(candidatesFile);
  
  return report;
}
```

---

## Advantages of This Approach

| Aspect | Auto-Merge (Old) | User-Driven (New) |
| ------ | ---------------- | ----------------- |
| **Complexity** | High — merge algorithms | Low — copy files |
| **Risk** | Silent data loss possible | User sees everything |
| **Debuggability** | Hard — merge failures opaque | Easy — just files |
| **User Control** | Limited | Full |
| **Code to Maintain** | Complex | Simple |
| **Edge Cases** | Many | Few |

---

## What Gets Auto-Restored

Some things should always be restored without asking:

| Item | Reason |
| ---- | ------ |
| `config/user-profile.json` | Personal preferences |
| `config/USER-PROFILE.md` | User identity |
| `episodic/` folder | Session history (meditation, dreams) |

These are pre-checked in the migration candidates document.

---

## Rollout Plan

| Phase | Version | Scope |
| ----- | ------- | ----- |
| **Phase 1** | 3.7.0-beta | Backup + Fresh Install + Manual Migration |
| **Phase 2** | 3.7.0 | Gap Analysis + Migration Candidates Document |
| **Phase 3** | 3.8.0 | "Complete Migration" command |
| **Phase 4** | 3.9.0 | Stale file warnings, cleanup suggestions |

---

## Open Questions

1. **Backup retention policy?** Keep last N backups? Size limit?
2. **Global knowledge migration?** `~/.alex/` is separate — needs own migration?
3. **Cross-project DK?** User might want to migrate DK to global knowledge instead

---

## References

- [upgrade.ts](../platforms/vscode-extension/src/commands/upgrade.ts) — Current upgrade implementation
- [initialize.ts](../platforms/vscode-extension/src/commands/initialize.ts) — Initial install
- [SKILLS-CATALOG.md](SKILLS-CATALOG.md) — Full skill inventory
- [MEMORY-SYSTEMS.md](MEMORY-SYSTEMS.md) — Memory architecture overview
