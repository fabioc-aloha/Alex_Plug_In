# Meditation: Persona Detection P5 — Copilot Instructions Bridge

**Date**: 2026-03-09
**Phase**: Ship | **Mode**: Build
**Focus**: Persona detection priority chain enhancement

---

## Session Summary

Added `copilot-instructions.md` `Persona:` field as Priority 5 in the persona detection chain. This bridges the documentation layer (what the LLM reads) and the runtime extension (what determines sidebar persona), fixing heir misdetection where projects like LearnAlex showed "DevOps Engineer" because workspace heuristics saw Bicep/CI files.

## Key Insights

1. **Documentation-Runtime Bridge**: `Persona:` in copilot-instructions.md is now bidirectionally consumed — LLM reads it as context, extension reads it as a detection signal. First field with this property.
2. **Priority Chain Defense-in-Depth**: 8-level chain (Focus → Goal → Phase → Project Goals → Copilot Instructions → Profile Cache → Workspace Scoring → Default) follows defense-in-depth — each level catches what the one above missed.
3. **North Star Protocol Closure**: `/northstar define` now sets Persona: during project setup, closing the gap between "what this project IS" and "how Alex adapts."
4. **Heir Ecosystem Impact**: Most valuable for heirs — Master was always correctly detected, but heirs lacking user-profile.json fell through to heuristics.
5. **Placeholder Safety**: detectFromCopilotInstructions() skips values starting with `_` or `(` — prevents placeholder text from matching.

## Artifacts

| File | Action | Description |
|------|--------|-------------|
| platforms/vscode-extension/src/chat/personaDetection.ts | Modified | New detectFromCopilotInstructions() function, P5 in chain, constants added |
| .github/copilot-instructions.md | Modified | Persona priority chain updated to 8 levels, Active Context Recent: updated |
| .github/skills/persona-detection/SKILL.md | Modified | Priority chain table updated with P5 row |
| .github/skills/north-star/SKILL.md | Modified | Active Context Plug section now includes Persona: field |
| .github/prompts/northstar.prompt.md | Modified | Step 4 includes Persona: setting |
| .github/instructions/north-star.instructions.md | Modified | Persona field definition added, step 5 updated |

## Synapses

- [.github/skills/persona-detection/SKILL.md] (Critical, Implements, Bidirectional) — "P5 copilot-instructions detection added to chain"
- [.github/skills/north-star/SKILL.md] (High, Enriches, Forward) — "North Star protocol now includes Persona: in setup"
- [.github/instructions/north-star.instructions.md] (High, Updates, Forward) — "Persona field definition added to Active Context fields"
- [.github/instructions/meditation.instructions.md] (Critical, Implements, Bidirectional) — "Standard meditation protocol"

## Validation

✓ Memory File: .github/episodic/meditation-2026-03-09-persona-detection-p5.md — created
✓ Active Context: Recent: field updated with P7.6 summary
✓ Synapse Health: GOOD (256 synapses, 4 known-historical broken)
✓ Compilation: Clean (0 errors, 0 warnings)
