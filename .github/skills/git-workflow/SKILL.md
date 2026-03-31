---
name: git-workflow
description: Consistent git practices, recovery patterns, and safe operations.
tier: core
applyTo: '**/.git/**,**/commit*,**/branch*,**/merge*'
---

# Git Workflow Skill

> Consistent git practices, recovery patterns, and safe operations.

## ⚠️ Staleness Warning

Git core is stable, but GitHub features (Actions, CLI, Copilot integration) evolve.

**Refresh triggers:**

- GitHub CLI major updates
- GitHub Actions runner changes
- New git features (e.g., `git switch`, `git restore`)
- GitHub Copilot CLI integration

**Last validated:** February 2026 (Git 2.45+, GitHub CLI 2.x)

**Check current state:** [Git Release Notes](https://git-scm.com/docs/git/RelNotes), [GitHub CLI](https://cli.github.com/)

---

## Commit Message Convention

```text
type(scope): brief description

- Detail 1
- Detail 2
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`

**Examples**:

```text
feat(skills): add git-workflow skill
fix(sync): resolve race condition in background sync
refactor(skills): migrate domain-knowledge to skills architecture
docs(readme): update installation instructions
chore(deps): bump typescript to 5.3
```

## Before Risky Operations

```bash
# ALWAYS commit before risky operations
git add -A; git commit -m "checkpoint: before [risky thing]"

# For extra safety, tag it
git tag "safe-point-$(date +%Y-%m-%d-%H%M)"
```

## Recovery Patterns

### Undo Last Commit (keep changes)

```bash
git reset --soft HEAD~1
```

### Restore Single File

```bash
git checkout HEAD -- path/to/file
```

### Restore Folder

```bash
git checkout HEAD -- .github/
```

### Hard Reset to Known Good State

```bash
git reset --hard HEAD           # Discard all uncommitted changes
git reset --hard origin/main    # Reset to remote state
git reset --hard <tag-name>     # Reset to tagged state
```

### Find Last Good Commit

```bash
git log --oneline -20           # Recent history
git log --oneline .github/ -10  # History for specific folder
```

## Branching Strategy

```text
main
 └── feature/short-description
 └── fix/issue-number
 └── release/v3.7.0
```

**Rules**:

- `main` is always deployable
- Feature branches for experimental work
- Merge via PR when possible, direct commit for small fixes
- Delete branches after merge

## Conflict Resolution

1. **Pull before push**: `git pull --rebase origin main`
2. **If conflicts**: Resolve in editor, then `git add .` + `git rebase --continue`
3. **If stuck**: `git rebase --abort` to start over

## Stashing

```bash
git stash                       # Save work-in-progress
git stash pop                   # Restore and delete stash
git stash list                  # See all stashes
git stash drop                  # Delete top stash
```

## Worktrees (Agent Isolation)

VS Code background agents use `git worktree` to isolate changes. Understanding worktrees is useful when debugging agent sessions.

```bash
# Create a worktree for isolated work
git worktree add ../project-feature feature-branch

# List all worktrees
git worktree list

# Remove a worktree (prune stale links)
git worktree remove ../project-feature
git worktree prune
```

**VS Code integration** (1.109+):
- `git.worktreeIncludeFiles` — copy gitignored files (e.g., `.env`) into agent worktrees
- Background agents auto-commit at end of each turn within their worktree
- Check Agent Sessions view to see which worktree an agent is using

## Anti-Patterns

- ❌ `git push --force` on shared branches
- ❌ Committing secrets or credentials
- ❌ Giant commits with unrelated changes
- ❌ Vague messages like "fix stuff" or "update"
