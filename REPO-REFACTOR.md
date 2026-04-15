# Repository Refactor Plan

## One Brain, Many Cockpits

**Status**: 📋 Planned  
**Target**: v8.0.0  
**Created**: April 15, 2026

---

## Vision

Transform AlexMaster from a single-extension repo into a mono-repo with clear private/public separation:

- **Master Brain** stays private (development only)
- **Heir Brain** is the public distribution
- **Multiple Cockpits** (VS Code, M365, GCX) share the same brain
- **Two Wikis** — internal architecture docs vs user-facing help

---

## Architecture Diagram

```
AlexMaster/                              # PRIVATE REPO (development only)
│
├── .github/                             # MASTER BRAIN (source of truth)
│   ├── skills/                          # 165+ skills (includes master-only)
│   ├── instructions/
│   ├── prompts/
│   ├── agents/
│   ├── muscles/
│   └── config/
│       └── inheritance.json             # What syncs to heir
│
├── master-wiki/                         # MASTER WIKI (internal docs)
│   ├── architecture/                    # ← from alex_docs/architecture/
│   ├── research/                        # ← from alex_docs/research/
│   ├── decisions/                       # ← from alex_docs/decisions/
│   ├── guides/                          # ← from alex_docs/guides/
│   ├── NORTH-STAR.md                    # ← from alex_docs/
│   └── ...                              # All internal documentation
│
├── scripts/                             # Master tooling
│   ├── sync-to-heir.ps1                 # Sync brain + wiki to heir/
│   └── ...
│
└── heir/                                # PUBLIC REPO (published)
    │
    ├── .github/                         # HEIR BRAIN (synced from Master)
    │   ├── skills/                      # 64 inheritable skills
    │   ├── instructions/
    │   ├── prompts/
    │   ├── agents/
    │   ├── muscles/
    │   └── copilot-instructions.md
    │
    ├── wiki/                            # HEIR WIKI (user docs)
    │   ├── Home.md
    │   ├── Getting-Started.md
    │   ├── User-Manual.md
    │   ├── Heir-Project-Setup.md
    │   └── FAQ.md
    │
    ├── platforms/                       # COCKPITS (delivery vehicles)
    │   ├── vscode-extension/            # VS Code cockpit
    │   ├── m365-copilot/                # M365 cockpit
    │   ├── gcx-coworker/                # GCX cockpit
    │   └── shared/                      # Cross-platform utilities
    │
    ├── assets/                          # Public assets (icons, banners)
    ├── CHANGELOG.md
    ├── README.md
    └── LICENSE.md
```

---

## Key Principles

| Concept | Description |
|---------|-------------|
| **One Brain** | `.github/` is the single source of truth for Alex's intelligence |
| **Many Cockpits** | Each platform is a UI that hosts the same brain |
| **Master filters to Heir** | Only inheritable content syncs to public |
| **Publish per-platform** | Each cockpit publishes independently to its store |

---

## The Two Wikis

| Wiki | Location | Visibility | Audience | Content |
|------|----------|------------|----------|---------|
| **Master Wiki** | `master-wiki/` | Private | Developer | Architecture, research, decisions, north star, internal guides |
| **Heir Wiki** | `heir/wiki/` | Public | Users | Getting started, manual, FAQ, troubleshooting |

---

## Migration Plan

### Phase 1: Rename alex_docs → master-wiki

| Current | Becomes | Notes |
|---------|---------|-------|
| `alex_docs/` | `master-wiki/` | Rename in place |
| `alex_docs/architecture/` | `master-wiki/architecture/` | Internal arch docs |
| `alex_docs/research/` | `master-wiki/research/` | Research stays private |
| `alex_docs/decisions/` | `master-wiki/decisions/` | ADRs stay private |
| `alex_docs/NORTH-STAR.md` | `master-wiki/NORTH-STAR.md` | Vision stays private |

### Phase 2: Create heir/ structure

```bash
mkdir heir
mkdir heir/.github
mkdir heir/wiki
mkdir heir/platforms
mkdir heir/assets
```

### Phase 3: Move content to heir/

| Current | Becomes | Notes |
|---------|---------|-------|
| `wiki/` | `heir/wiki/` | User docs to heir |
| `platforms/vscode-extension/` | `heir/platforms/vscode-extension/` | Extension to heir |
| `platforms/m365-copilot/` | `heir/platforms/m365-copilot/` | M365 to heir |
| `platforms/gcx-coworker/` | `heir/platforms/gcx-coworker/` | GCX to heir |
| `platforms/shared/` | `heir/platforms/shared/` | Shared utils to heir |
| Public assets | `heir/assets/` | Icons, banners for extension |

### Phase 4: Create sync script

Create `scripts/sync-to-heir.ps1`:

```powershell
# Sync inheritable brain content from Master to Heir
# Filters out master-only skills, instructions, etc.

$masterBrain = ".github"
$heirBrain = "heir/.github"
$inheritanceConfig = ".github/config/inheritance.json"

# Read inheritance config
$inheritance = Get-Content $inheritanceConfig | ConvertFrom-Json

# Sync skills (only inheritable)
foreach ($skill in (Get-ChildItem "$masterBrain/skills" -Directory)) {
    $entry = $inheritance.skills | Where-Object { $_.name -eq $skill.Name }
    if ($entry -and $entry.inheritable) {
        Copy-Item -Recurse -Force $skill.FullName "$heirBrain/skills/"
    }
}

# Similar for instructions, prompts, agents, muscles...
```

### Phase 5: Update references

- Update all internal links that reference `alex_docs/` → `master-wiki/`
- Update all links that reference `platforms/` → `heir/platforms/`
- Update build scripts for new locations
- Update `.vscodeignore` patterns
- Update release scripts

### Phase 6: Create heir repository

Options:
1. **Git subtree** — `heir/` is a subtree pushed to separate public repo
2. **Git submodule** — `heir/` is a submodule linked to public repo
3. **Manual sync** — Script copies heir/ to separate repo clone

Recommended: **Git subtree** for simplicity

```bash
# One-time setup
git subtree add --prefix=heir https://github.com/fabioc-aloha/Alex_Plug_In.git main --squash

# On each sync
git subtree push --prefix=heir https://github.com/fabioc-aloha/Alex_Plug_In.git main
```

---

## Workflow After Refactor

```
┌──────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT                                │
│  1. Work in AlexMaster (private)                                 │
│  2. Edit master-wiki/, .github/, heir/platforms/                 │
│  3. Git commit to Master                                         │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                      SYNC TO HEIR                                 │
│  scripts/sync-to-heir.ps1                                        │
│  - Filter out master-only brain content                          │
│  - Copy inheritable content to heir/.github/                     │
│  - Commit heir/ changes                                          │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                     PUBLISH (per platform)                        │
│  VS Code:  vsce publish (from heir/platforms/vscode-extension/)  │
│  M365:     Teams Toolkit publish                                  │
│  GCX:      Platform-specific deploy                               │
│  Wiki:     git subtree push → GitHub Wiki                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Internal docs** | Mixed with user docs | Clean separation in `master-wiki/` |
| **User docs** | In public repo root | In `heir/wiki/`, focused on users |
| **Research** | Exposed in alex_docs/ | Private in `master-wiki/research/` |
| **North Star** | Public | Private (users don't need to know) |
| **Architecture** | Public | Private (internal design) |
| **Brain** | One copy in extension | Shared across all platforms |
| **Platforms** | Scattered | Unified under `heir/platforms/` |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Broken references** | High | Automated link checker before commit |
| **Git history loss** | Medium | Use `git mv` for renames, preserve history |
| **Build script failures** | High | Test all scripts in dry-run mode first |
| **Subtree complexity** | Medium | Document workflow, create helper scripts |
| **Sync drift** | Medium | CI check that heir matches filtered master |

---

## Checklist

### Pre-Refactor

- [ ] Backup current repo state
- [ ] Document all current file references
- [ ] Create branch for refactor work
- [ ] Test build/publish from current locations

### Phase 1: Rename

- [ ] `git mv alex_docs master-wiki`
- [ ] Update all references to alex_docs
- [ ] Verify no broken links

### Phase 2: Create Structure

- [ ] Create `heir/` directory tree
- [ ] Create placeholder files

### Phase 3: Move Content

- [ ] Move `wiki/` → `heir/wiki/`
- [ ] Move `platforms/` → `heir/platforms/`
- [ ] Move public assets → `heir/assets/`
- [ ] Update all references

### Phase 4: Sync Script

- [ ] Create `scripts/sync-to-heir.ps1`
- [ ] Test sync with dry-run
- [ ] Verify filtered content is correct

### Phase 5: Update Tooling

- [ ] Update release-vscode.ps1
- [ ] Update release-preflight.ps1
- [ ] Update .vscodeignore
- [ ] Update package.json paths

### Phase 6: Git Subtree

- [ ] Set up subtree for heir/
- [ ] Test push to public repo
- [ ] Document workflow

### Post-Refactor

- [ ] Full build verification
- [ ] Test publish (dry-run)
- [ ] Update PLAN-v8.0.0.md
- [ ] Archive this document to master-wiki/decisions/

---

## Related Documents

- [PLAN-v8.0.0.md](PLAN-v8.0.0.md) — v8.0.0 modernization roadmap
- [.github/config/inheritance.json](.github/config/inheritance.json) — Inheritance rules
- [alex_docs/NORTH-STAR.md](alex_docs/NORTH-STAR.md) — Project vision

---

*One brain, many cockpits. Master stays private, heir goes public.*
