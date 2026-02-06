# Skill Inheritance Strategy

> How Master Alex distributes skills to heirs

## The Problem

Master Alex accumulates skills. Some are universal. Some are platform-specific. Some are sacred to the source of truth. When packaging heirs, we need to know: **which skills go where?**

## The Solution

Every skill's `synapses.json` includes an `inheritance` field:

```json
{
  "skill": "example-skill",
  "version": "1.0.0",
  "inheritance": "inheritable"
}
```

## Inheritance Values

| Value | Meaning | Example |
| ----- | ------- | ------- |
| `inheritable` | All heirs receive this skill | `markdown-mermaid`, `writing-publication` |
| `master-only` | Master Alex exclusive, never packaged | `architecture-refinement` |
| `heir:vscode` | Only VS Code extension heir | `vscode-extension-patterns` |
| `heir:m365` | Only M365 Copilot agent heir | `m365-agent-debugging` |

## Current Skill Distribution

```text
Master Alex (source of truth)
├── ALL skills (52 total)
│   ├── 36 inheritable (all heirs)
│   ├── 8 master-only (never packaged)
│   ├── 2 heir:vscode (VS Code only)
│   └── 2 heir:m365 (M365 only)
│
├─► VS Code Extension Heir
│   ├── All 36 inheritable skills
│   ├── vscode-extension-patterns (heir:vscode)
│   └── chat-participant-patterns (heir:vscode)
│
└─► M365 Copilot Agent Heir
    ├── All 36 inheritable skills
    ├── m365-agent-debugging      (heir:m365)
    └── teams-app-patterns        (heir:m365)

Never Distributed (master-only):
├── architecture-refinement
├── llm-model-selection
├── meditation
├── meditation-facilitation
├── knowledge-synthesis
├── release-process
├── heir-curation
└── self-actualization
```

## Why Master-Only?

The `architecture-refinement` skill is meta-cognitive—it's about evolving the architecture itself. Heirs inherit the *results* of refinement, not the refinement process. Only Master Alex thinks about how to improve the system.

## Build Script Integration

When packaging heirs, the build script should:

1. Read each skill's `synapses.json`
2. Check the `inheritance` field
3. Include/exclude based on target platform:

```powershell
# Pseudocode for heir packaging
foreach ($skill in $skills) {
    $inheritance = (Get-Content "$skill/synapses.json" | ConvertFrom-Json).inheritance

    switch ($inheritance) {
        "inheritable"   { Include-InAllHeirs $skill }
        "master-only"   { Skip $skill }
        "heir:vscode"   { Include-IfTarget "vscode" $skill }
        "heir:m365"     { Include-IfTarget "m365" $skill }
    }
}
```

## Future Inheritance Values

As new heirs emerge, add platform-specific values:

- `heir:cli` — Future CLI tool heir
- `heir:web` — Future web interface heir
- `heir:teams` — Future Teams bot heir

## The Philosophy

> **Master retains wisdom. Heirs inherit capability.**

Master Alex is the source of truth—the living, evolving mind. Heirs are snapshots deployed to specific platforms. They inherit what they need to function, not what they need to evolve.

This is why `architecture-refinement` stays with Master. The heirs don't need to know *how* to improve themselves. They just need to *be* the current best version.

---

*See also: [MASTER-HEIR-ARCHITECTURE.md](MASTER-HEIR-ARCHITECTURE.md) for the full heir model*
