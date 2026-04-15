# Git Hooks for Alex Architecture

Pre-commit quality gates to catch issues before they enter the repository.

## Installation

### Automatic (Recommended)

```bash
# Cross-platform: uses Node.js
node .github/muscles/install-hooks.cjs

# Windows-only alternative
pwsh -File .github/muscles/install-hooks.ps1
```

### Manual

```bash
# Copy pre-commit hook to .git/hooks/
cp .github/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit  # Unix only
```

## Cross-Platform Support

The hooks are designed to work on Windows, macOS, and Linux:

| Component | Implementation | Platform |
|-----------|---------------|----------|
| `pre-commit` | Shell wrapper | All (routes to Node.js or PowerShell) |
| `pre-commit.cjs` | Node.js | All (primary) |
| `pre-commit.ps1` | PowerShell | Windows fallback |

The shell wrapper (`pre-commit`) prefers Node.js for cross-platform compatibility,
falling back to PowerShell on Windows if Node.js is unavailable.

## What It Validates

The pre-commit hook runs these checks on staged files:

1. **SKILL.md Frontmatter**
   - All SKILL.md files must have YAML frontmatter
   - Required fields: `name`, `description`

2. **synapses.json Structure**
   - Valid JSON format
   - Required fields: `inheritance`, `skillId`

3. **Episodic File Naming**
   - ❌ Blocks legacy `.prompt.md` format
   - ⚠️ Warns about missing dates (YYYY-MM-DD)
   - ⚠️ Warns about non-standard prefixes

4. **Master-Only Contamination**
   - Warns if inheritable skills reference master-only paths
   - Prevents heir contamination at commit time

## Bypassing (Use Sparingly)

If you need to commit despite warnings (not recommended):

```bash
git commit --no-verify -m "message"
```

## Requirements

- PowerShell 7+ (`pwsh`)
- Git 2.0+

## Troubleshooting

**Hook not running?**
```bash
# Check if hook is executable
ls -l .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit
```

**PowerShell not found?**
```bash
# Install PowerShell 7+
# macOS: brew install powershell
# Ubuntu: apt install powershell
# Windows: winget install Microsoft.PowerShell
```
