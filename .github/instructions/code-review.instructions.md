---
description: "Code review quality gate protocols and feedback guidelines"
application: "When following code review guidelines workflows or troubleshooting related issues"
applyTo: "**/*.{ts,js,tsx,jsx,py,ps1,cs,java,go,rs,rb}"
---

# Code Review Guidelines Procedural Memory

---

## Review Philosophy

### Compilation Check Discipline

**You MUST verify compilation succeeds before declaring any code task complete.**

For TypeScript projects: run `npx tsc --noEmit` and confirm zero errors.
For any project with tests: run the test suite and confirm zero failures.
Do NOT skip this step. Do NOT assume "it should work." Verify.

### Goals of Code Review

1. **Catch bugs** before they reach users
2. **Improve code quality** through collaborative refinement
3. **Share knowledge** across the team
4. **Maintain consistency** in codebase style and patterns
5. **Document decisions** through review comments

### Mindset

| Reviewer                               | Author                         |
| -------------------------------------- | ------------------------------ |
| Assume positive intent                 | Be open to feedback            |
| Ask questions, don't demand            | Explain your reasoning         |
| Focus on the code, not the person      | Don't take feedback personally |
| Offer alternatives, not just criticism | Acknowledge good suggestions   |

---

## What to Review

### Priority Order

| Priority        | Category        | Examples                                    |
| --------------- | --------------- | ------------------------------------------- |
| 🔴 **Critical** | Correctness     | Bugs, logic errors, edge cases              |
| 🔴 **Critical** | Security        | Input validation, auth, secrets             |
| 🟠 **High**     | Architecture    | Patterns, structure, extensibility          |
| 🟠 **High**     | Performance     | N+1 queries, memory leaks, complexity       |
| 🟡 **Medium**   | Maintainability | Readability, naming, comments               |
| 🟡 **Medium**   | Testing         | Coverage, edge cases, clarity               |
| 🟢 **Low**      | Style           | Formatting, conventions (ideally automated) |

### Review Checklist

Use the comprehensive checklist from the [code-review SKILL.md](..\skills\code-review/SKILL.md#review-checklist) covering Security, Logic, Quality, and Architecture dimensions. The skill also defines the 3-Pass Review methodology (Orientation → Logic → Polish).

### Confidence-Scored Findings

Every review finding must include a numeric confidence percentage (not just High/Medium/Low). This enables automated filtering and calibrates reviewer certainty.

**Required per finding**: file:line, current code, recommended fix, confidence %, prevention principle.

| Confidence | Meaning | Action |
|------------|---------|--------|
| 90-100% | Certain this is a bug/issue | Always report |
| 70-89% | Highly likely, needs attention | Report with evidence |
| 50-69% | Possible issue, needs investigation | Report as `[question]` |
| <50% | Uncertain, might be fine | Suppress (except security findings) |

**Security exception**: Always report security findings regardless of confidence. A 30% chance of an injection vulnerability is still worth flagging.

**Example**:
```markdown
[blocking] (92%) Unsanitized user input passed to SQL query.
- File: `api/users.ts:47`
- Current: `db.query(\`SELECT * FROM users WHERE id = ${req.params.id}\`)`
- Fix: Use parameterized query: `db.query('SELECT * FROM users WHERE id = $1', [req.params.id])`
- Prevention: All database queries must use parameterized inputs.
```

### Pattern-Aware Review ("Detect First")

Before flagging code as unconventional, scan for 2+ existing examples of the same pattern in the codebase. If the code matches existing conventions, approve. If it deviates, the burden of proof is on the deviation.

- Scan: directory structure, naming conventions, file composition, imports/registration, test patterns
- If 2+ examples exist: "This deviates from the pattern in X and Y. Intentional?"
- If 0-1 examples: no established pattern; evaluate on merit alone

---

## How to Give Feedback

### Comment Prefixes

Use the comment prefix system defined in the [code-review SKILL.md](..\skills\code-review/SKILL.md#comment-prefixes): `[blocking]`, `[suggestion]`, `[question]`, `[nit]`, `[praise]`.

### Examples

```markdown
[blocking] This will throw a null reference exception if `user` is undefined.
Suggestion: Add a null check or use optional chaining.

[suggestion] Consider extracting this logic into a separate function
for reusability. Happy to approve either way.

[question] I'm not familiar with this pattern. Can you explain why
we're using a factory here instead of direct instantiation?

[nit] Typo: "recieve" → "receive"

[praise] Really elegant solution to the caching problem!
I learned something new here.
```

### Tone Guidelines

| ❌ Avoid                           | ✅ Prefer                                      |
| ---------------------------------- | ---------------------------------------------- |
| "This is wrong"                    | "This might cause X issue because..."          |
| "Why would you..."                 | "What was the reasoning for..."                |
| "Just do X"                        | "Have you considered X? It would help with..." |
| "Obviously..."                     | "One approach that's worked well is..."        |
| No comment, just "Request changes" | Explain what needs to change and why           |

---

## How to Receive Feedback

### Author Responsibilities

1. **Respond to all comments** - Even if just "Done" or "Good point, fixed"
2. **Don't be defensive** - Assume the reviewer is trying to help
3. **Ask for clarification** - If feedback is unclear
4. **Push back respectfully** - If you disagree, explain why
5. **Make changes promptly** - Don't leave PRs stale

### Handling Disagreements

```markdown
Author: "I see your point, but I chose this approach because [reason].
Do you think that trade-off is acceptable, or should we discuss further?"

Reviewer: "Good point, I hadn't considered [reason].
Let's go with your approach. Approved!"

-- OR --

Reviewer: "I understand, but I'm still concerned about [issue].
Can we sync for 5 minutes to discuss?"
```

---

## Review Process

### Small PRs (< 200 lines)

1. Read PR description
2. Review diff file by file
3. Run locally if behavior change
4. Leave comments or approve

**Target turnaround**: Same day

### Large PRs (200+ lines)

1. Ask: Should this be split into smaller PRs?
2. Read PR description thoroughly
3. Understand the overall approach first
4. Review file by file, keeping context
5. Test locally
6. Schedule call if needed

**Target turnaround**: 1-2 days

### Review States

| State               | When to Use                        |
| ------------------- | ---------------------------------- |
| **Approve**         | Ready to merge, no blocking issues |
| **Request Changes** | Blocking issues that must be fixed |
| **Comment**         | Questions or non-blocking feedback |

---

## Self-Review Checklist

Before requesting review, author should:

- [ ] PR description explains what and why
- [ ] Tested the changes locally
- [ ] Ran linter and fixed issues
- [ ] Ran tests and they pass
- [ ] No unintended files included
- [ ] Commits are clean and logical
- [ ] No debug code or console.logs
- [ ] Documentation updated if needed

---

## Trigger Phrases & Responses

| User Says                                | Alex Response                                                                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| "Review this"                            | "I'll review the changes. Let me check correctness, security, and architecture first, then move to maintainability."                           |
| "Is this PR ready?"                      | "Let me run through the self-review checklist: description, tests, lint, no debug code..."                                                     |
| "How should I respond to this feedback?" | "What's the reviewer's concern? Let's understand their perspective before deciding how to address it."                                         |
| "This review is harsh"                   | "Let's focus on the technical content. Is there valid feedback we should address? If the tone is problematic, that's a separate conversation." |
| "Should I approve this?"                 | "Let's go through the checklist: correctness, security, architecture, tests. Any concerns in those areas?"                                     |
| "LGTM"                                   | "If no blocking issues, approve with optional nits. If there are concerns, leave as comments rather than quick approval."                      |

---

## Special Cases

### Reviewing Your Own Code (Solo Dev)

Even without a second reviewer:

1. Take a break before self-review (fresh eyes)
2. Use the checklist systematically
3. Read the diff as if you didn't write it
4. Run a linter and let it catch style issues
5. Consider: "Would I understand this in 6 months?"

### Reviewing Large Refactors

1. Verify tests exist before refactor begins
2. Review in stages if possible
3. Check that behavior is preserved, not just code moved
4. Consider: Should this have an ADR?

### Reviewing Security-Sensitive Code

Escalate to senior reviewer if:

- Authentication/authorization changes
- Cryptography
- PII handling
- Payment processing
- External API credentials

### Reviewing Mission-Critical Code (NASA Standards)

For safety-critical, mission-critical, or high-reliability projects, apply NASA/JPL Power of 10 rules during review:

| Rule                       | Check For                                      | Blocking? |
| -------------------------- | ---------------------------------------------- | --------- |
| **R1** Bounded Recursion   | Recursive functions without `maxDepth`         | 🔴 Yes    |
| **R2** Fixed Loop Bounds   | `while` loops without `MAX_ITERATIONS` counter | 🔴 Yes    |
| **R3** Bounded Collections | Arrays/maps without size limits                | 🔴 Yes    |
| **R4** Function Size       | Functions > 60 lines                           | 🟠 High   |
| **R5** Assertions          | Critical paths without `assert()` calls        | 🟠 High   |
| **R6** Minimal Scope       | Variables declared far from use                | 🟡 Medium |
| **R7** Return Handling     | Unchecked return values                        | 🟡 Medium |
| **R8** Nesting Depth       | > 4 levels of nesting                          | 🟠 High   |
| **R9** Defensive Access    | `obj.prop.prop` without optional chaining      | 🟡 Medium |
| **R10** Strict Compilation | Compiler warnings present                      | 🟡 Medium |

**Reference**: `.github/instructions/nasa-code-standards.instructions.md`

**Detection**: User mentions "mission-critical", "safety-critical", "NASA standards", or "high reliability"

---

## Anti-Patterns

### Reviewer Anti-Patterns

| ❌ Pattern       | Why It's Bad                  |
| ---------------- | ----------------------------- |
| Rubber-stamping  | Bugs slip through             |
| Bikeshedding     | Wastes time on trivia         |
| Gatekeeping      | Blocks progress unnecessarily |
| Moving goalposts | Frustrates authors            |
| No explanation   | Author can't learn or respond |

### Author Anti-Patterns

| ❌ Pattern                  | Why It's Bad                 |
| --------------------------- | ---------------------------- |
| Huge PRs                    | Hard to review effectively   |
| No description              | Reviewer lacks context       |
| Ignoring feedback           | Same issues will recur       |
| Taking it personally        | Damages collaboration        |
| "It works" as justification | Correctness isn't everything |

---

## Metrics (Optional)

Track if you want data on review health:

| Metric               | Target      | Warning Sign                       |
| -------------------- | ----------- | ---------------------------------- |
| Time to first review | < 24 hours  | > 48 hours consistently            |
| Review cycles        | 1-2 rounds  | > 4 rounds regularly               |
| PR size              | < 400 lines | > 1000 lines regularly             |
| Comments per PR      | 2-10        | 0 (rubber stamp) or 50+ (bikeshed) |

---

_Last Updated: 2026-01-23_
_This procedural memory ensures code reviews are constructive, thorough, and efficient_
