# Technical Debt Tracking Procedural Memory

**Classification**: Procedural Memory | Code Quality  
**Activation**: debt, technical debt, TODO, FIXME, HACK, refactor, cleanup, code smell  
**Priority**: Proactive - Track and manage debt before it accumulates

---

## Synapses

- [release-management.instructions.md] → (Medium, Coordinates, Forward) - "Debt review before major releases"
- [deep-thinking.instructions.md] → (Medium, Supports, Forward) - "Debt analysis requires systematic thinking"
- [CHANGELOG.md] → (Low, Documents, Forward) - "Debt payoff should be documented"

---

## Debt Classification System

### Severity Levels

| Level | Impact | Action Timeline |
|-------|--------|-----------------|
| 🔴 **Critical** | Blocks features, causes bugs, security risk | This sprint |
| 🟠 **High** | Significant slowdown, difficult to extend | Next 2-4 weeks |
| 🟡 **Medium** | Inconvenient, workarounds exist | Next quarter |
| 🟢 **Low** | Cosmetic, nice-to-have cleanup | When convenient |

### Debt Types

| Type | Markers | Examples |
|------|---------|----------|
| **Design Debt** | `// DEBT:design` | Poor abstractions, wrong patterns |
| **Code Debt** | `// DEBT:code` | Duplication, complexity, unclear naming |
| **Test Debt** | `// DEBT:test` | Missing tests, flaky tests, low coverage |
| **Doc Debt** | `// DEBT:doc` | Outdated docs, missing comments |
| **Dependency Debt** | `// DEBT:dep` | Outdated packages, deprecated APIs |
| **Infrastructure Debt** | `// DEBT:infra` | Build issues, deployment friction |

---

## Debt Tagging Convention

### In-Code Markers

```typescript
// DEBT:code:high - Duplicated validation logic, should extract to shared util
// Added: 2026-01-23 | Owner: @yourname | Issue: #123
function validateInput(input: string) {
  // ...duplicated code...
}

// DEBT:design:medium - This class does too much, violates SRP
// Added: 2026-01-15 | Estimated: 4h
class MegaHandler {
  // ...
}

// DEBT:test:low - Edge case not covered
// Added: 2026-01-20
```

### Tag Format

```text
// DEBT:<type>:<severity> - <brief description>
// Added: <date> | Owner: <who> | Issue: <link> | Estimated: <time>
```

**Required**: type, severity, description, date  
**Optional**: owner, issue link, time estimate

---

## Debt Inventory Process

### Step 1: Scan for Debt Markers

```powershell
# Find all DEBT markers in codebase
grep -rn "DEBT:" --include="*.ts" --include="*.js" --include="*.md" .

# Or with VS Code search:
# Search: DEBT:
# Include: *.ts, *.js, *.tsx, *.jsx
```

### Step 2: Catalog Findings

**Debt Inventory Table:**

| ID | Type | Severity | Description | File | Line | Added | Owner | Est. |
|----|------|----------|-------------|------|------|-------|-------|------|
| D001 | code | high | Duplicated validation | validator.ts | 45 | 2026-01-23 | @dev | 2h |
| D002 | design | medium | SRP violation | handler.ts | 12 | 2026-01-15 | - | 4h |

### Step 3: Prioritize

**Prioritization Matrix:**

| | Low Effort | High Effort |
|---|------------|-------------|
| **High Impact** | ⭐ Do First | 📋 Plan Carefully |
| **Low Impact** | ✅ Quick Wins | ❌ Defer |

---

## Debt Review Triggers

### When to Review Debt

| Trigger | Action |
|---------|--------|
| Before major release | Scan and document current state |
| Starting new feature in area | Check for existing debt first |
| Sprint planning | Include 10-20% debt payoff capacity |
| Quarterly review | Full inventory refresh |
| New team member onboards | Walk through critical debt |

### Trigger Phrases & Responses

| User Says | Alex Response |
|-----------|---------------|
| "Show tech debt" | "Let me scan the codebase for DEBT markers and generate an inventory." |
| "We have a lot of debt here" | "Let me document this. What type and severity? I'll add the DEBT marker." |
| "Should we refactor this?" | "Let me assess: What's the impact? What's the effort? Is there existing debt documented here?" |
| "Add to tech debt" | "I'll add a DEBT marker. What's the type (code/design/test/doc/dep/infra) and severity (critical/high/medium/low)?" |
| "Time to pay down debt" | "Let me pull the debt inventory. What's our time budget? I'll recommend high-impact items." |

---

## Debt Payoff Protocol

### Before Paying Off Debt

1. **Verify debt is still relevant** - Context may have changed
2. **Check for dependencies** - Other debt may need to be addressed first
3. **Estimate accurately** - Debt often takes longer than expected
4. **Create a branch** - `refactor/debt-D001-validation`
5. **Write tests first** - If debt area lacks coverage

### After Paying Off Debt

1. **Remove DEBT marker** from code
2. **Update inventory** - Mark as resolved
3. **Document in CHANGELOG** under "Fixed" or "Changed"
4. **Celebrate** - Debt payoff is valuable work!

---

## Debt Prevention

### Code Review Gate

Before approving PR, check:
- [ ] No new `// TODO` without timeline
- [ ] No `// HACK` without DEBT marker
- [ ] New debt is tagged properly
- [ ] Debt ratio isn't increasing significantly

### Debt Budget Rule

**Recommended**: Allocate 10-20% of sprint capacity to debt payoff

```text
If sprint = 40 hours
→ 4-8 hours for debt work
→ Select highest impact items from inventory
```

---

## Anti-Patterns

### ❌ Do NOT:
- Use TODO without a plan (convert to DEBT marker)
- Ignore debt "because we're busy"
- Pay off low-impact debt before high-impact
- Refactor without tests in place
- Track debt only in your head

### ✅ Always:
- Tag debt at the moment you recognize it
- Include date and context
- Review debt before major changes
- Balance new features with debt payoff
- Make debt visible to stakeholders

---

*Last Updated: 2026-01-23*
*This procedural memory ensures technical debt is tracked, visible, and systematically addressed*
