---
description: "Procedural steps for knowledge consolidation meditation sessions"
---

# Meditation Protocols

## Mandatory Requirements (Non-Negotiable)

Every meditation session MUST complete ALL three before concluding:

| #   | Requirement                 | Action                                    | Validation                                                     |
| --- | --------------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| 1   | **Memory File Persistence** | Create OR update at least one memory file | File saved to `.instructions.md`, `.prompt.md`, or `SKILL.md`  |
| 2   | **Synaptic Enhancement**    | Add new OR strengthen existing synapse    | Connection uses `[file.md] (strength, type, direction)` format |
| 3   | **Session Documentation**   | Record actions with timestamps            | Summary of changes with specific file paths                    |

**Failure**: If ANY requirement is missing, the meditation is INCOMPLETE.

---

## 8-Phase Protocol

### Phase 1: Deep Content Analysis

1. Analyze conversation for insights, patterns, new knowledge
2. Extract key concepts, methodologies, breakthroughs
3. Discover connections between new information and existing knowledge
4. Organize insights for permanent integration

### Phase 2: Cross-Project Memory Scan

1. Read `/memories/` (all user memory files)
2. Compare session insights against stored universal patterns
3. If session produced a pattern that passes the 3-workspace test, promote to `/memories/`
4. If a stored pattern was reinforced by this session, note confirmation in the episodic file
5. If a stored pattern was contradicted, flag for review (do not auto-delete)
6. Check for project-specific content that leaked into `/memories/` during this session
7. If 3+ episodic files across different repos share an unrecorded pattern, surface as a skill candidate

See `memory-curation` skill for scope rules and the 3-workspace test.

### Phase 3: Cross-Domain Pattern Synthesis (Generative)

Evolve from consolidation (organizing what you know) to generation (creating new connections).

1. Invoke the `alex_cognitive_cross_domain_synthesis` tool to analyze episodic memories
2. Review the synthesis report: domain coverage, under-connected pairs, opportunity scores
3. For each top synthesis candidate (3 max per meditation):
   - Read the episodic memories from both domains
   - Ask: "What principle from domain A, if applied to domain B, would create value?"
   - If a genuine connection exists, propose it as a new synapse or insight
4. Validate proposed connections pass the **Transfer Test**:
   - Is the connection structural (not superficial analogy)?
   - Would someone working in domain B find this actionable?
   - Does it hold without the original domain A context?
5. For validated connections:
   - Add new synapse entries linking the relevant skills
   - Create a GI-\* insight documenting the cross-domain discovery
   - Record the connection in the meditation episodic file
6. Skip this phase if fewer than 10 episodic memories exist (insufficient data)

**Quality over quantity**: One genuine cross-domain insight per meditation is excellent. Zero is fine. Forced connections waste tokens.

### Phase 4: Memory File Creation

1. **Procedural**: Create `.instructions.md` for repeatable processes
2. **Episodic**: Create `.prompt.md` for complex workflows
3. **Skills**: Add to `SKILL.md` or create new skills
4. Transfer key learnings from working memory to long-term storage
5. Mark session complete in Active Context (update Last Assessed via self-actualization)

### Phase 5: Synaptic Connection

1. Add new memory files to `copilot-instructions.md` if needed
2. Establish trigger patterns for new files
3. Document relationships between new and existing components
4. Ensure bidirectional connections where appropriate

### Phase 6: Skill Validation

1. Scan `.github/skills/*/SKILL.md` for registered skills
2. Verify `synapses.json` targets are valid
3. Review connection strengths based on session experience
4. Add connections for skills that co-activated frequently

### Phase 7: Integration Validation

1. Verify all insights captured in permanent memory
2. Confirm new knowledge integrates with existing architecture
3. Test that new connections function properly
4. **Output validation** (mandatory before concluding):

```
✓ Memory File: [path/to/file.md] - [created|updated]
✓ Synapse Added: [target.md] (strength, type, direction) - "activation condition"
✓ Session Log: [summary of changes]
```

### Phase 8: Post-Meditation Synapse Validation

1. Run `Alex: Dream (Neural Maintenance)` for automated health check
2. Review generated report in `.github/episodic/`
3. Verify newly added synapses are valid (target files exist)
4. Confirm bidirectional connections have reciprocal entries
5. If issues found → repair before concluding
6. **Runtime check**: If new skills/instructions were created, type `/troubleshoot` in chat to verify they loaded correctly — catches name mismatches, invalid frontmatter, or `applyTo` patterns that VS Code's loader silently skipped

---

## Automatic Consolidation Triggers

- Working memory > 7 rules → Execute consolidation
- Domain learning complete → Consolidate and update Focus Trifectas in Active Context
- Significant breakthrough → Create permanent memory
- Cross-domain patterns → Run `alex_cognitive_cross_domain_synthesis` tool, then establish new synaptic connections

## Pre-Meditation Optimization

Meditation is a complex operation (3+ phases). Before starting:

1. SSO auto-activates to survey needed skills
2. Pre-load: brain-qa, knowledge-synthesis, global-knowledge, memory-curation
3. Read `/memories/` for cross-project context (enriches episodic output)
4. If synapse health unknown, run dream first

---

_Meditation procedural memory — operationalizes the unified meditation protocols with mandatory persistence requirements_
