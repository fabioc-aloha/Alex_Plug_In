---
description: "Technical debt identification, tracking, and payoff protocols"
applyTo: "**/*TODO*,**/*FIXME*,**/*debt*"
---

# Technical Debt Tracking Procedural Memory


---

## Synapses

- [.github/instructions/deep-thinking.instructions.md] → (Medium, Supports, Forward) - "Debt analysis requires systematic thinking"
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
| **Cognitive Debt** | `// DEBT:cognitive` | Broken synapses, orphan skills, drift |

### Cognitive Debt (Alex-Specific)

> *"Cognitive debt is the gap between the architecture I aspire to and the architecture I actually have."*

Cognitive debt applies to Alex's cognitive architecture — the accumulated decay in synapses, skills, and cross-platform sync.

| Cognitive Debt Type | Example | Payoff Mechanism |
|---------------------|---------|------------------|
| Broken synapses | Pointing to `architecture` instead of `architecture-audit` | `brain-qa` Phase 1 |
| Aspirational references | Connecting to skills never created | Remove or create the skill |
| Heir divergence | Master-Heir synapses out of sync | `brain-qa` Phase 4-6 |
| Unindexed skills | Skills exist but not in memory-activation | `brain-qa` Phase 2 |
| Semantic overlap | Multiple triggers for same concept | `brain-qa` Phase 3 |

**Detection**: Run `brain-qa` skill or `Alex: Dream` command
**Prevention**: Brain QA is now Step 0 in release-preflight checklist

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

```bash
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

### Step 3: Prioritize with Composite Scoring

Score each debt item with the composite formula:

```
Debt Score = (Severity x 3) + (Churn x 2) + (Blast Radius x 2) + (Fix Simplicity) + (Age)
```

| Factor | Scale | How to Measure |
|--------|-------|----------------|
| **Severity** | 1-5 | Critical=5, High=4, Medium=3, Low=2, Cosmetic=1 |
| **Churn** | 1-5 | git log frequency: daily=5, weekly=4, monthly=3, quarterly=2, dormant=1 |
| **Blast Radius** | 1-5 | Files importing this module: 20+=5, 10-19=4, 5-9=3, 2-4=2, 1=1 |
| **Fix Simplicity** | 1-5 | Trivial=5, Straightforward=4, Moderate=3, Complex=2, Risky=1 |
| **Age** | 1-5 | >1yr=5, 6-12mo=4, 3-6mo=3, 1-3mo=2, <1mo=1 |

**Score range**: 9 (minimal) to 45 (urgent). Prioritize highest scores first.

**Key insight**: High churn + many dependents + debt markers = top priority hotspot. Cross-reference `git log --format='%H' --follow <file> | wc -l` with `grep -rn "import.*from.*<module>"` to find these.

**Quick prioritization matrix** (for when composite scoring is overkill):

| | Low Effort | High Effort |
|---|------------|-------------|
| **High Impact** | Do First | Plan Carefully |
| **Low Impact** | Quick Wins | Defer |

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
