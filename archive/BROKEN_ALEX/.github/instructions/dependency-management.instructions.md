# Dependency Management Procedural Memory

**Classification**: Procedural Memory | Security & Maintenance  
**Activation**: dependency, package, npm, outdated, vulnerability, security, audit, upgrade, breaking change  
**Priority**: Proactive - Regular maintenance prevents emergencies

---

## Synapses

- [release-management.instructions.md] → (High, Coordinates, Bidirectional) - "Dependency updates are releases"
- [technical-debt-tracking.instructions.md] → (Medium, Feeds, Forward) - "Outdated deps are technical debt"
- [CHANGELOG.md] → (Medium, Documents, Forward) - "Dependency changes should be logged"

---

## Regular Audit Schedule

| Frequency | Action | Command |
|-----------|--------|---------|
| **Weekly** | Security audit | `npm audit` |
| **Monthly** | Check outdated | `npm outdated` |
| **Quarterly** | Major version review | Full dependency assessment |
| **Yearly** | Dependency pruning | Remove unused packages |

---

## Security Audit Protocol

### Step 1: Run Audit

```powershell
npm audit
```

### Step 2: Assess Severity

| Severity | Action | Timeline |
|----------|--------|----------|
| **Critical** | Fix immediately | Same day |
| **High** | Fix ASAP | Within 1 week |
| **Moderate** | Schedule fix | Within 1 month |
| **Low** | Track as debt | When convenient |

### Step 3: Fix Vulnerabilities

```powershell
# Automatic fix (when available)
npm audit fix

# For breaking changes (review carefully!)
npm audit fix --force

# If no fix available, check for alternatives
npm ls <vulnerable-package>  # See what depends on it
```

### Step 4: Document

If vulnerability can't be fixed immediately:
```markdown
// DEBT:dep:high - Vulnerability in package-name (CVE-XXXX)
// Reason: No fix available, waiting for upstream
// Mitigation: Input validation added in handler.ts
// Added: 2026-01-23 | Track: https://github.com/package/issues/123
```

---

## Outdated Package Protocol

### Step 1: Check Status

```powershell
npm outdated
```

Output interpretation:
```
Package      Current  Wanted  Latest  Location
lodash       4.17.20  4.17.21 4.17.21  dependency
typescript   4.9.5    4.9.5   5.3.2    devDependency
```

- **Current**: What you have installed
- **Wanted**: Latest that satisfies semver in package.json
- **Latest**: Latest version available

### Step 2: Categorize Updates

| Category | Risk | Approach |
|----------|------|----------|
| **Patch** (x.x.1→x.x.2) | Low | Update freely |
| **Minor** (x.1.x→x.2.x) | Low-Medium | Review changelog, then update |
| **Major** (1.x.x→2.x.x) | High | Full assessment required |

### Step 3: Safe Update Process

```powershell
# Update patches and minors (usually safe)
npm update

# Update specific package to latest
npm install package-name@latest

# Check for breaking changes first
npm info package-name changelog
```

---

## Major Version Upgrade Protocol

**⚠️ Major versions may have breaking changes. Follow this protocol:**

### Pre-Upgrade Assessment

1. **Read the changelog/migration guide**
   ```powershell
   npm info <package> repository  # Find repo
   # Then visit CHANGELOG.md or releases page
   ```

2. **Check compatibility**
   - Does it work with our Node version?
   - Does it work with other dependencies?
   - Are there known issues?

3. **Assess effort**
   | Breaking Changes | Effort |
   |-----------------|--------|
   | API rename only | Low (find/replace) |
   | Behavior change | Medium (testing) |
   | Major rewrite | High (may need ADR) |

### Upgrade Execution

```powershell
# Create upgrade branch
git checkout -b upgrade/package-name-v2

# Install new version
npm install package-name@^2.0.0

# Run tests
npm test

# Build to check for type/compile errors
npm run compile

# Manual testing of affected features
```

### Post-Upgrade

1. Document in CHANGELOG.md
2. Create ADR if decision was complex
3. Update any affected documentation
4. Remove workarounds that are no longer needed

---

## Dependency Health Assessment

### Package Evaluation Criteria

When adding or keeping a dependency:

| Criteria | Good Sign | Warning Sign |
|----------|-----------|--------------|
| **Maintenance** | Recent commits, active issues | No updates in 1+ year |
| **Downloads** | High weekly downloads | Very low usage |
| **Size** | Small bundle impact | Huge for what it does |
| **Dependencies** | Few dependencies | Deep dependency tree |
| **Security** | No known vulnerabilities | Unaddressed CVEs |
| **License** | MIT, Apache, BSD | GPL (if commercial), Unknown |

### Commands for Assessment

```powershell
# Check package size impact
npm install -g @pnpm/package-cost
package-cost package-name

# See dependency tree
npm ls package-name

# Check download stats
npm info package-name

# Check bundle size (online)
# Visit: https://bundlephobia.com/package/package-name
```

---

## Dependency Pruning

### Quarterly: Remove Unused Dependencies

```powershell
# Find potentially unused packages
npx depcheck

# Review results - some false positives are common
# For each unused package, verify it's truly unused, then:
npm uninstall package-name
```

### Signs a Dependency Should Go

- Not imported anywhere in code
- Functionality duplicated by another package
- Only used in one small place (inline instead)
- Abandoned/unmaintained upstream
- Security issues with no fix path

---

## Trigger Phrases & Responses

| User Says | Alex Response |
|-----------|---------------|
| "Check dependencies" | "I'll run `npm audit` and `npm outdated` to assess security and update status." |
| "Any vulnerabilities?" | "Let me run a security audit. One moment..." |
| "Update packages" | "I'll check what's outdated. For major versions, we'll need to review breaking changes first." |
| "Add package X" | "Before adding, let me check: maintenance status, bundle size, and license. Does this fill a gap we can't solve with existing deps?" |
| "Is this package safe?" | "Let me assess: download stats, last update, open vulnerabilities, and dependency tree." |
| "Upgrade to major version" | "Major upgrades need careful handling. Let me find the changelog and assess breaking changes." |

---

## Lock File Protocol

### package-lock.json Rules

| Rule | Reason |
|------|--------|
| **Always commit lock file** | Ensures consistent installs |
| **Never manually edit** | Use npm commands instead |
| **Regenerate if corrupted** | Delete and run `npm install` |
| **Review in PRs** | Large lock changes need attention |

### When Lock File Changes Unexpectedly

```powershell
# Check what changed
git diff package-lock.json | head -50

# If unwanted changes, reset
git checkout package-lock.json

# If npm version mismatch in team, standardize
# Add to package.json:
# "engines": { "npm": ">=10.0.0" }
```

---

## Dependency Documentation

### In package.json

```json
{
  "dependencies": {
    // Production deps - shipped with extension
  },
  "devDependencies": {
    // Dev only - build tools, testing
  },
  "comments": {
    "why-lodash": "Using for deep clone, native structuredClone not available in target Node version"
  }
}
```

### In README or CONTRIBUTING

Document non-obvious dependencies:
```markdown
## Key Dependencies

- **esbuild**: Bundling (chosen over webpack for speed)
- **@types/vscode**: VS Code API types (match engine version)
```

---

## Anti-Patterns

### ❌ Do NOT:
- Ignore npm audit warnings
- Update all packages blindly (`npm update` without review)
- Add dependencies for trivial functionality
- Skip lock file in commits
- Assume major versions are safe
- Keep unused dependencies "just in case"

### ✅ Always:
- Run security audits regularly
- Read changelogs before major upgrades
- Test after updating
- Document why non-obvious deps exist
- Prefer well-maintained, focused packages
- Consider bundle size impact

---

*Last Updated: 2026-01-23*
*This procedural memory ensures dependencies are secure, current, and intentional*
