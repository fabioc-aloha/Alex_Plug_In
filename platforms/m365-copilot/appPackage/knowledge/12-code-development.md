# Code Review, Debugging, and Root Cause Analysis

> Knowledge pack for M365 Agent Builder | Generated 2026-04-09

---

# Code Review Skill

> Good reviews catch bugs. Great reviews teach the author something.

## Review Priority (What Matters Most)

1. **Correctness** — Does it do what it's supposed to?
2. **Security** — Can it be exploited?
3. **Maintainability** — Will the next person understand this?
4. **Performance** — Will it scale?
5. **Style** — Is it consistent? (ideally enforced by linters, not humans)

## 3-Pass Review

| Pass | Focus | What You're Looking For | Time |
| ---- | ----- | ----------------------- | ---- |
| 1. Orientation | Big picture | Does the approach make sense? Is the scope right? Over-engineered? | 2-3 min |
| 2. Logic | Deep read | Edge cases, null handling, error paths, concurrency, off-by-one | 10-15 min |
| 3. Polish | Surface | Naming, duplication, test coverage, docs | 3-5 min |

**Pass 1 shortcut**: Read the PR description and test names first. They reveal intent faster than code.

## Comment Prefixes

| Prefix | Meaning | Author Response |
| ------ | ------- | --------------- |
| `[blocking]` | Must fix before merge | Fix it |
| `[suggestion]` | Better approach exists | Consider it, explain if declining |
| `[question]` | I don't understand | Clarify (in code, not just in reply) |
| `[nit]` | Trivial style issue | Fix if easy, skip if not |
| `[praise]` | This is well done | Appreciate it |

### Good vs Bad Comment Examples

| Bad | Why | Good |
| --- | --- | ---- |
| "This is confusing" | Vague, unhelpful | "[suggestion] This nested ternary is hard to follow. Consider extracting to a named function like `isEligibleForDiscount()`." |
| "Fix this" | No context | "[blocking] This accepts user input without sanitization. Use `escapeHtml()` before rendering." |
| "Why?" | Sounds hostile | "[question] What's the motivation for the custom sort here vs `Array.sort()`? Is there a performance concern?" |
| "LGTM" (on 500-line PR) | Rubber stamp | "Pass 1: Approach looks right. Pass 2 comments below. Pass 3: naming is clean." |

## Review Checklist

### Security
- [ ] No secrets, tokens, or API keys in code
- [ ] User input validated/sanitized before use
- [ ] Auth checks on protected endpoints
- [ ] No SQL/command injection vectors
- [ ] Sensitive data not logged

### Logic
- [ ] Edge cases handled (empty input, null, boundary values)
- [ ] Error paths return meaningful messages
- [ ] Async operations have timeout/cancellation
- [ ] State changes are atomic (no partial updates)
- [ ] All new branches have test coverage

### Quality
- [ ] Tests cover the *changed behavior*, not just the changed lines
- [ ] No debug code (console.log, TODO-hacks)
- [ ] Public API changes documented
- [ ] Backward compatibility considered

### Architecture
- [ ] Change is in the right layer (not business logic in the controller)
- [ ] New dependencies justified
- [ ] No unnecessary coupling introduced

## Anti-Patterns

| Anti-Pattern | What Happens | Instead |
| ------------ | ------------ | ------- |
| Rubber-stamp | Bugs ship | Actually read Pass 1-3 |
| Bikeshedding | Hours on naming, ignore logic bugs | Spend 80% on Pass 2 |
| Gatekeeping | Reviewees dread PRs | Teach, don't block |
| Week-long queue | PRs go stale, conflicts pile up | Review within 4 hours, merge within 24 |
| Style wars | Team friction | Automate style (ESLint, Prettier, etc.) |
| Everything-is-blocking | Author overwhelmed | Use prefix system honestly |

## Mission-Critical Review (NASA Standards)

For safety-critical projects, apply NASA/JPL Power of 10 rules during review:

### Blocking Violations (Must Fix)

| Rule | Check For | Detection |
| ---- | --------- | --------- |
| **R1** | Recursive function without `maxDepth` parameter | `grep -rn "function.*\(" \| xargs grep -l "walk\|traverse\|recurse"` |
| **R2** | `while` loop without iteration counter | Manual review of all `while` statements |
| **R3** | Unbounded array growth | `push()` in loops without size checks |

### High Priority (Strong Recommendation)

| Rule | Check For | Detection |
| ---- | --------- | --------- |
| **R4** | Function > 60 lines | Line count per function |
| **R5** | Missing entry assertions | Public functions without precondition checks |
| **R8** | Nesting > 4 levels | Visual inspection of indentation |

### Medium Priority (Consider)

| Rule | Check For | Detection |
| ---- | --------- | --------- |
| **R6** | Variable declared far from use | Manual review |
| **R7** | Unchecked return values | `grep` for ignored returns |
| **R9** | Deep property access without `?.` | `obj.prop.prop.prop` chains |
| **R10** | Compiler warnings | Build output |

**Trigger**: User mentions "mission-critical", "NASA standards", "high reliability", or "safety-critical"

**Reference**: `.github/instructions/nasa-code-standards.instructions.md`

## Review Timing

| PR Size | Expected Review Time | If Larger |
| ------- | -------------------- | --------- |
| < 100 lines | < 30 min | — |
| 100-400 lines | 30-60 min | Ideal size |
| 400+ lines | 60+ min | Ask author to split |
| 1000+ lines | Don't | Refuse; request breakdown |

---

## Extension Audit Methodology (VS Code Extensions)

**When**: Before release, after major refactoring, or on quality concerns

**Scope**: Multi-dimensional code quality analysis beyond standard code review

### 5-Dimension Audit Framework

| Dimension | Focus | Tools/Methods | Output |
| --------- | ----- | ------------- | ------ |
| **Debug & Logging** | Console statements, debug code | `grep -r "console\\.log\|console\\.debug"` | Categorize: legitimate vs removable |
| **Dead Code** | Unused imports, orphaned files, broken refs | TypeScript compilation + manual scan | List dead commands, UI, dependencies |
| **Performance** | Blocking I/O, sync operations, bottlenecks | `grep -r "Sync\(" src/`, profiling | Async refactoring candidates |
| **Menu Validation** | All commands/buttons work | Manual testing + error logs | Broken commands, missing handlers |
| **Dependencies** | Unused packages, leftover references | package.json vs import analysis | Removable dependencies |

### Audit Report Template

```markdown
## Executive Summary
- Console statements: X remaining (Y legitimate, Z removable)
- Dead code: [commands/UI/dependencies list]
- Performance: [blocking operations count]
- Menu validation: [working/broken ratio]

## Recommendations
1. [Category]: [Issue] → [Action] (Priority: Critical/High/Medium)
2. [Category]: [Issue] → [Action] (Priority: Critical/High/Medium)
```

### Console Statement Categorization

| Category | Keep? | Examples |
| -------- | ----- | -------- |
| **Enterprise compliance** | ✅ | Audit logs, security events, GDPR actions |
| **User feedback** | ✅ | TTS status, long-running ops, critical errors |
| **Debug noise** | ❌ | Setup verbosity, migration logs, info messages |
| **Development artifacts** | ❌ | "Entering function X", temporary debugging |

### Performance Red Flags

- **Synchronous file I/O** in UI thread: `fs.readFileSync`, `fs.existsSync`, `fs.readdirSync`
  - **Fix**: Convert to `fs-extra` async: `await fs.readFile`, `await fs.pathExists`, `await fs.readdir`
- **Blocking operations** in activation: Heavy computation before extension ready
  - **Fix**: Defer to background, show loading state, or lazy-load
- **Serial operations** that could be parallel: Sequential awaits for independent tasks
  - **Fix**: `Promise.all([op1(), op2(), op3()])`

### Dead Code Detection Pattern

1. **Scan command registrations**: `vscode.commands.registerCommand('command.id', ...)`
2. **Scan UI references**: Search HTML/views for command IDs
3. **Cross-check**: Commands in UI but not registered = broken; registered but unused = dead
4. **Verify disposables**: Removed commands should have disposable cleanup too

### Post-Audit Verification

- [ ] TypeScript compiles: `npm run compile` → exit 0
- [ ] No orphaned imports: All imports resolve
- [ ] Version aligned: package.json, CHANGELOG, copilot-instructions match
- [ ] Smoke test: Extension activates, 3 random commands work

**Pattern applies to**: VS Code extensions, Electron apps, Node.js services with UI

---

# Debugging Patterns Skill

> Systematic problem-solving and error analysis.

## The Debugging Mindset

1. **Reproduce** — Can you make it happen consistently?
2. **Isolate** — What's the smallest case that fails?
3. **Hypothesize** — What could cause this?
4. **Test** — Prove or disprove your hypothesis
5. **Fix** — Change ONE thing
6. **Verify** — Did it actually fix it?

## Binary Search Debugging

When you don't know where the problem is:

```text
1. Find a known-good state (commit, version, config)
2. Find the known-bad state (current)
3. Test the midpoint
4. Repeat until you find the breaking change
```

Git bisect automates this:

```bash
git bisect start
git bisect bad                    # Current is broken
git bisect good <known-good-sha>  # This worked
# Git checks out midpoint, you test, then:
git bisect good  # or  git bisect bad
# Repeat until found
git bisect reset                  # Return to normal
```

## Stack Trace Reading

```text
Error: Cannot read property 'x' of undefined
    at processData (src/utils.ts:45:12)      ← LOOK HERE FIRST
    at handleRequest (src/api.ts:123:8)
    at Router.handle (node_modules/...)
```

**Pattern**: Read bottom-up for context, top-down for cause.

## Common Error Categories

| Symptom | Likely Cause | Check |
| ------- | ------------ | ----- |
| "undefined is not a function" | Wrong import/export | Module paths, named vs default |
| "Cannot find module" | Path or package issue | Relative paths, node_modules |
| "ENOENT" | File not found | Path typo, file doesn't exist |
| "EACCES" | Permission denied | File permissions, admin rights |
| Silently fails | Swallowed error | Add try/catch, check promises |
| Works locally, fails in CI | Environment diff | Env vars, paths, versions |

## Logging Strategy

```typescript
// Bad: console.log("here")
// Good: console.log("[processData] input:", data, "state:", state)

// Even better: structured logging
log.debug({ fn: 'processData', input: data, state }, 'Processing started');
```

## Rubber Duck Debugging

When stuck:

1. Explain the problem out loud (or in text)
2. Describe what SHOULD happen
3. Describe what ACTUALLY happens
4. Walk through the code step by step
5. Often, the explanation reveals the bug

## Hypothesis Testing

Don't just change things randomly:

```text
❌ "Let me try this... and this... and this..."
✅ "I think X is null because Y. Let me add a log to confirm."
```

## Environment Debugging

```powershell
# Check environment variables
$env:PATH
$env:NODE_ENV

# Check versions
node --version
npm --version
code --version

# Check what's installed
npm list --depth=0
```

## Anti-Patterns

- ❌ Changing multiple things at once
- ❌ Assuming you know the cause without evidence
- ❌ Ignoring error messages
- ❌ "It works on my machine" without investigating why
- ❌ Removing error handling to "fix" errors

---

# Root Cause Analysis Skill

> If you fixed it but it came back, you fixed a symptom.

## Core Principle

Every symptom has a cause. Every cause has a deeper cause. Keep digging until you reach something you can *prevent*, not just fix.

## 5 Whys — Extended Example

| # | Question | Answer |
| - | -------- | ------ |
| 1 | Why did the page crash? | JavaScript threw a TypeError on null |
| 2 | Why was the value null? | The API returned an empty response |
| 3 | Why did the API return empty? | The database query timed out |
| 4 | Why did the query time out? | Missing index on a 10M-row table |
| 5 | Why was the index missing? | No performance review in the PR process |

**Root cause**: Process gap (no performance review), not the missing index.
**Fix the system**: Add performance checklist to PR template, not just add the index.

### 5 Whys Traps

| Trap | Example | How to Avoid |
| ---- | ------- | ------------ |
| Stopping at human error | "Dev forgot to add the index" | Ask *why was it possible to forget?* |
| Single chain only | Only follow one branch | Branch at each Why if multiple causes |
| Speculation without evidence | "Probably because of..." | Each answer must have evidence |
| Going too deep | Why #12: "Because physics" | Stop when you reach an actionable system change |

## Cause Categories

| Category | Common Patterns | Investigation Tools |
| -------- | --------------- | ------------------- |
| Code | Null reference, off-by-one, race condition, type mismatch | Debugger, unit tests, static analysis |
| Data | Corrupt input, unexpected format, encoding issues | Query logs, data validation, sample inspection |
| Infrastructure | Disk full, memory exhaustion, network partition | Metrics dashboards, health endpoints, `top`/`df` |
| Dependencies | Breaking change, version mismatch, transitive conflict | Lockfile diff, changelog review, `npm ls` |
| Configuration | Wrong env var, feature flag state, missing secret | Config diff, environment comparison |
| Process | Missing review, unclear ownership, no runbook | Post-mortem patterns, team interviews |

## Investigation Techniques

### Binary Search Debugging

When you don't know where the bug is, halve the search space:

1. Identify the last known good state (commit, deploy, timestamp)
2. `git bisect` between good and bad
3. Each step: does the bug exist? Yes → go earlier. No → go later.
4. Result: the exact commit that introduced the bug.

### Timeline Reconstruction

| Time | Event | Source |
| ---- | ----- | ------ |
| T-24h | Deploy v2.3.1 | CI/CD logs |
| T-12h | Config change: cache TTL 60→30s | Config audit log |
| T-2h | First user report | Support tickets |
| T-0 | Alert fired | Monitoring |

**Key question**: What changed between "working" and "broken"?

### Correlation vs Causation

| Evidence Type | Confidence | Example |
| ------------- | ---------- | ------- |
| Reproduces on demand | High | "Every time I submit this form..." |
| Correlates with a deploy | Medium | "Started after we deployed" |
| Timing coincidence | Low | "Started Monday" (traffic patterns?) |
| "It's never done this before" | Very Low | Memory is unreliable — check logs |

## Fix + Prevent Pattern

| Phase | Purpose | Example | Deadline |
| ----- | ------- | ------- | -------- |
| **Immediate** | Stop the bleeding | Rollback, disable feature, redirect traffic | Now |
| **Permanent** | Fix root cause | Add missing index, fix validation, patch dependency | This sprint |
| **Prevention** | Stop recurrence | Add CI check, monitoring alert, runbook, PR checklist | Next sprint |

**Test the fix**: The permanent fix should make the immediate fix unnecessary. If you remove the band-aid and the symptom returns, you haven't found root cause.

## Common Symptom → Root Cause Patterns

| Symptom | Obvious Cause | Deeper Root Cause |
| ------- | ------------- | ----------------- |
| Memory leak | Unclosed resource | No resource cleanup pattern in codebase |
| N+1 queries | Missing join | ORM hides query count, no query logging |
| Intermittent test failure | Timing-dependent | Shared mutable state between tests |
| "Works on my machine" | Different environment | No environment parity tooling (Docker, etc.) |
| Data corruption | Missing validation | Validation in UI only, not at API boundary |
| Slow deploys | Large artifact | No build caching, monorepo without selective builds |

## Post-Mortem Integration

The RCA section of a post-mortem should include:

1. **The 5 Whys chain** (with evidence for each level)
2. **Contributing factors** (things that made it worse, not the direct cause)
3. **What we were lucky about** (things that could have made it much worse)
4. **Action items** with owners and dates for permanent fix + prevention

---

# Error Recovery Patterns Skill

> What to do when things break.

## Recovery Hierarchy

Prevent → Detect → Contain → Recover → Learn

## Retry Rules

| Retry | Don't Retry |
| ----- | ----------- |
| Network timeouts | Validation errors (400) |
| Rate limits (429) | Auth failures (401, 403) |
| Server errors (5xx) | Not found (404) |
| Connection refused | Business logic errors |

## Retry with Backoff

```typescript
const delay = baseDelay * Math.pow(2, attempt - 1);
const jitter = Math.random() * 0.3 * delay;
await sleep(delay + jitter);
```

## Circuit Breaker States

CLOSED → (failures > threshold) → OPEN → (timeout) → HALF-OPEN → (success) → CLOSED

## Fallback Patterns

| Pattern | Use Case |
| ------- | -------- |
| Default value | Config loading |
| Cached value | Data fetch failure |
| Degraded service | Non-critical features |

```typescript
const result = await primary().catch(() => fallback());
```

## Rollback Patterns

| Pattern | Use Case |
| ------- | -------- |
| DB transaction | Atomic operations |
| Saga (compensate) | Distributed transactions |
| Feature flag | Instant rollback |

## Error Boundaries

Contain failures to prevent cascade. Catch at component boundaries, log, show fallback UI.

## Strategy Pivot (For AI Assistants)

When your approach fails repeatedly, don't keep retrying — pivot.

| Failure Pattern | Pivot Strategy |
| --------------- | -------------- |
| Same edit fails twice | Re-read file, verify context is current |
| Same command fails twice | Try alternative tool or manual approach |
| Same build error | Check if your prior changes caused it |
| User says "upstream problem" | Back up, analyze earlier changes |
| Pattern doesn't work | Ask user what they know |

**Rule of Three**: Two failures of the same approach = third attempt MUST be fundamentally different.

**Surface the problem**: "I've tried X twice and it's failing. I think the issue is [analysis]. Here's an alternative approach..."
