---
description: "Semantic, logic, code, and architectural consistency audit procedure — the mental layer on top of automated scripts"
applyTo: "**/*audit*,**/*qa*"
---

# Semantic Audit Procedure

**Purpose**: Verify that documented meaning, process logic, code behavior, and architectural claims are internally consistent  
**Complements**: brain-qa.ps1 (structural), audit-master-alex.ps1 (automated)

## Synapses

- [.github/skills/brain-qa/SKILL.md] (High, Implements, Forward) - "Brain QA skill teaches what to look for; this procedure is the how"
- [.github/skills/architecture-audit/SKILL.md] (High, Implements, Forward) - "Master audit skill scopes the check; this procedure drives the review"
- [.github/instructions/dream-state-automation.instructions.md] (Medium, Validates, Forward) - "Dream detects structural issues; semantic audit detects meaning issues"

---

## When to Run

- **After automated scripts pass** — scripts check structure, this checks meaning
- **Before releases** — semantic drift accumulates silently between versions
- **After bulk documentation updates** — word changes can shift meaning unintentionally
- **When a user reports confusion** — if docs confuse a human, they'll confuse an LLM

## The Four Dimensions

### 1. Semantic Consistency

**Question**: Do all documents use the same terms for the same concepts?

**Procedure**:
1. Pick a core concept (e.g., "working memory", "skills", "episodic")
2. Grep for that term across all `.md` and `.ts` files
3. For each hit, check: is the term used with the same meaning?
4. Flag: deprecated synonyms (e.g., "DK files" for "skills"), ambiguous wording, undocumented jargon

**Common drift patterns**:
| Stale Term | Current Term | Where It Hides |
|------------|-------------|----------------|
| DK files, domain knowledge | Skills (.github/skills/) | Heir evolution docs, promotion workflows |
| 7 rules (without explanation) | 4 core + 3 domain slots | Neuroanatomical mapping table |
| domain-knowledge/ | skills/ | Old instruction files, archived docs |

### 2. Logic Consistency

**Question**: Do documented processes actually work if you follow them step by step?

**Procedure**:
1. Read a documented workflow end-to-end (e.g., heir evolution cycle, meditation phases)
2. At each step, ask: does the prerequisite exist? Is the output real?
3. Cross-reference: if file A says "do X" and file B says "do Y" for the same trigger, that's a conflict
4. Flag: impossible steps, contradictory processes, undocumented prerequisites

**Common logic errors**:
- Process references a file format that was retired (e.g., "create a DK file")
- Two instruction files claim different responsibility for the same trigger
- A workflow says "run tool X" but the tool has a different name in the code

### 3. Code-to-Documentation Alignment

**Question**: Does the TypeScript code actually do what the documentation claims?

**Procedure**:
1. For each documented command/feature, find the implementing function
2. Check: does the code match the documented behavior?
3. Flag: commands registered in package.json but not implemented, or vice versa
4. Flag: documented tool names that don't match MCP tool identifiers

**What to check**:
- `package.json` contributes.commands → do all have handlers in `src/commands/`?
- Documented synapse triggers → are they wired in the activation code?
- Documented MCP tool names → do they match `alex_*` function names?

### 4. Architectural Coherence

**Question**: Is the high-level architecture model described consistently everywhere?

**Procedure**:
1. Read the Neuroanatomical Mapping table in copilot-instructions.md
2. Cross-reference with alex-core.instructions.md descriptions
3. Check: do the Memory Architecture table, Memory Stores table, and README architecture tree all describe the same structure?
4. Flag: tables listing different counts or structures, brain-analog mappings that contradict procedure files

**Key targets**:
- Active Context: is the dynamic section (Persona, Objective, Focus Trifectas, Principles, Last Assessed) described consistently in copilot-instructions, alex-core, SSO, and meditation?
- Memory tiers: declared in copilot-instructions, implemented in dream, validated by brain-qa — same categories?
- Agent ecosystem: listed in copilot-instructions, files in .github/agents/ — same count and names?

### 5. Reader Testing (Doc Comprehension Gate)

**Question**: Could a reader with no prior context understand this document and act on it correctly?

**Procedure**:
1. After writing or updating any user-facing documentation, predict 5-10 questions a new reader would ask
2. For each predicted question, verify the document answers it clearly
3. Fix gaps: if a predicted question has no answer in the doc, add the information
4. Exit condition: "a reader with no prior context could answer all predicted questions correctly from this document alone"

**Example for a README**:

| Predicted Reader Question | Answered? | Where |
|--------------------------|-----------|-------|
| What does this project do? | Yes | First paragraph |
| How do I install it? | Yes | Installation section |
| What are the prerequisites? | No | **GAP: add prerequisites** |
| How do I run it locally? | Yes | Getting Started |
| Where do I report bugs? | No | **GAP: add contributing link** |

**When to apply**:
- New documents: always
- Updated documents: when the update changes the audience or scope
- Release notes: predict "what changed for me?" and "do I need to do anything?"
- Heir documentation: predict "how do I get started?" and "what's different from Master?"

## Output Format

When completing a semantic audit, report:

```markdown
## Semantic Audit Results

**Scope**: [what was audited]
**Date**: [ISO date]

### Findings

| # | Dimension | Severity | Finding | Location |
|---|-----------|----------|---------|----------|
| 1 | Semantic  | WARNING  | "DK files" referenced in active file | copilot-instructions.md:158 |
| 2 | Logic     | CRITICAL | Meditation step references retired tool | heir-skill-promotion.md:108 |
| ...

### Severity Scale
- **CRITICAL**: Logic error — following the docs would fail or produce wrong results
- **WARNING**: Meaning drift — inconsistent terminology or unexplained concepts
- **INFO**: Minor wording difference with no functional impact
```

## Relationship to Scripts

| Script | This Procedure |
|--------|---------------|
| Validates file existence | Validates file *meaning* |
| Counts match expected | Concepts match expected |
| Paths resolve | Processes are followable |
| Schema is valid JSON | Schema *semantics* are correct |
| Files sync between master/heir | *Meaning* syncs between master/heir |

**Rule**: Never run a semantic audit without first running the automated scripts. Structure must be sound before meaning can be assessed.
