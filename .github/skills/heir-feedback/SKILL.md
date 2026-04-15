---
name: "heir-feedback"
description: "Submit feedback, bug reports, and feature requests from heir projects to Master Alex via AI-Memory/feedback/"
tier: standard
applyTo: '**/*feedback*,**/*bug*,**/*feature-request*'
---

# Heir Feedback

> Report bugs, share feedback, and request features from any heir project back to Master Alex.

Heirs use a shared feedback folder in AI-Memory to communicate issues, ideas, and bug reports to the Master Alex maintainer. This is the standard channel for heir-to-master communication about problems and improvements.

---

## When to Use

- You discovered a bug in Alex's cognitive architecture (skills, instructions, prompts, agents)
- A skill doesn't work as documented or has incorrect information
- You want to request a new skill, instruction, or feature
- You encountered a sync-architecture drift or broken synapse in your heir
- You have improvement suggestions based on real-world project use

---

## Quick Reference

| Item | Value |
|------|-------|
| **Feedback folder** | `AI-Memory/feedback/` |
| **File format** | Markdown (`.md`) |
| **Naming convention** | `{YYYY-MM-DD}-{type}-{short-title}.md` |
| **Types** | `bug`, `feature`, `improvement`, `question` |
| **Access** | OneDrive sync (all surfaces read/write) |

---

## Feedback Location

Feedback lives in the shared AI-Memory folder, accessible from all AI surfaces:

```
OneDrive/AI-Memory/
├── profile.md
├── notes.md
├── learning-goals.md
├── global-knowledge.md
└── feedback/                  ← Heir feedback channel
    ├── 2026-04-11-bug-synapse-broken-link.md
    ├── 2026-04-11-feature-new-skill-request.md
    └── 2026-04-12-improvement-meditation-flow.md
```

### Path Resolution

| Surface | Path |
|---------|------|
| **VS Code (Windows)** | `%OneDrive%/AI-Memory/feedback/` or `%OneDriveConsumer%/AI-Memory/feedback/` |
| **VS Code (macOS)** | `~/Library/CloudStorage/OneDrive-*/AI-Memory/feedback/` or `~/OneDrive/AI-Memory/feedback/` |
| **Local fallback** | `~/.alex/AI-Memory/feedback/` |
| **M365 Copilot** | OneDrive > AI-Memory > feedback (via OneDriveAndSharePoint) |

---

## Feedback File Template

```markdown
---
type: bug | feature | improvement | question
severity: critical | high | medium | low
heir: {project-name}
date: {YYYY-MM-DD}
status: new
---

# {Short descriptive title}

## Description

{What happened, what you expected, or what you want}

## Steps to Reproduce (bugs)

1. {Step 1}
2. {Step 2}
3. {Step 3}

## Expected Behavior

{What should have happened}

## Actual Behavior

{What actually happened}

## Context

- **Heir project**: {project name}
- **Alex version**: {e.g., 7.6.0}
- **Affected files**: {skill, instruction, or prompt paths}
- **Platform**: {VS Code / M365 / Agent Builder}

## Suggested Fix (optional)

{If you have ideas on how to fix it}
```

---

## Filing Feedback: Step by Step

### 1. Identify the Type

| Type | When to Use | Example |
|------|-------------|---------|
| **bug** | Something is broken or incorrect | Skill has wrong API pattern, synapse points to deleted file |
| **feature** | New capability needed | "Need a skill for Terraform modules" |
| **improvement** | Existing thing could be better | "meditation instructions could mention episodic cleanup" |
| **question** | Unclear documentation or behavior | "What's the difference between tier:standard and tier:advanced?" |

### 2. Assess Severity

| Severity | Criteria |
|----------|----------|
| **critical** | Blocks work entirely, data loss risk, security issue |
| **high** | Major functionality broken, significant workaround needed |
| **medium** | Minor functionality issue, easy workaround exists |
| **low** | Cosmetic, documentation typo, nice-to-have |

### 3. Create the File

Name it following the convention: `{YYYY-MM-DD}-{type}-{short-title}.md`

Examples:
- `2026-04-11-bug-code-review-skill-missing-security-checks.md`
- `2026-04-11-feature-terraform-module-skill.md`
- `2026-04-12-improvement-meditation-episodic-cleanup.md`

### 4. Write the Report

Use the template above. Be specific:
- Include exact file paths for affected skills/instructions
- Include error messages or incorrect output
- Include the Alex version from the heir's `.github/copilot-instructions.md`

---

## For Master Alex: Processing Feedback

When reviewing feedback in Master Alex:

1. **List** all files in `AI-Memory/feedback/` with status `new`
2. **Triage** by severity (critical first)
3. **Investigate** the reported issue in the master `.github/` architecture
4. **Fix** the issue in Master Alex
5. **Sync** fixes to heirs via `sync-architecture.cjs`
6. **Delete** the feedback file after resolution is complete

### Status Lifecycle

```
new → investigating → fixed → deleted
```

After fixing the issue, **delete the feedback file**. The fix is documented in:
- CHANGELOG.md (for the release that includes the fix)
- Git commit history
- The fixed skill/instruction files themselves

Keeping resolved feedback files creates clutter and risks re-processing the same issue.

---

## Activation Patterns

| Trigger | Response |
|---------|----------|
| "report a bug" | Guide through bug report template |
| "submit feedback" | Guide through feedback file creation |
| "feature request" | Guide through feature request template |
| "check feedback" | List pending feedback files (Master only) |
| "heir issue" | Route to feedback creation |

---

*Skill created: 2026-04-11 | Category: heir-management | Status: Active*
