---
name: "memory-export"
description: "Export all cognitive memory to a portable file for porting Alex to other AI work surfaces"
applyTo: "**/*export*memory*,**/*memory*export*,**/*port*alex*"
---

# Memory Export Skill

Export the complete set of stored memories, user profile, preferences, and learned context into a single portable file. Designed for porting Alex's knowledge to other AI work surfaces (Claude Code, ChatGPT, etc.).

## Purpose

Alex accumulates knowledge across multiple memory layers. This skill collects all layers into one structured, copy-pasteable document that can seed a new AI session elsewhere.

## Memory Sources to Collect

Gather from ALL of these sources, in order:

| Source | Location | Contains |
|--------|----------|----------|
| User Profile | `.github/config/user-profile.json` | Identity, career, credentials, preferences, technologies |
| User Memory | `/memories/` (Copilot Memory files) | Persistent cross-workspace notes, patterns, lessons |
| Session Memory | `/memories/session/` | Current conversation context (if any) |
| Repository Memory | `/memories/repo/` | Codebase-specific facts stored by Copilot |
| Copilot Memory | `alex_cognitive_user_profile` tool | Profile data surfaced through cognitive tools |
| Active Context | `.github/copilot-instructions.md` Active Context section | Current persona, phase, mode, focus trifectas |
| Repository Memories | Repository memories in system context | Facts stored from prior agent interactions |

## Export Format

Output as a single Markdown document inside a code block. Use this exact structure:

```
# Alex Memory Export
# Exported: {YYYY-MM-DD}
# Sources: {list sources that had content}

## Instructions
[YYYY-MM-DD] - {verbatim rules the user set}

## Identity
[YYYY-MM-DD] - {personal facts}

## Career
[YYYY-MM-DD] - {roles, companies, skills}

## Projects
[YYYY-MM-DD] - {project name — what it does, status, key decisions}

## Preferences
[YYYY-MM-DD] - {opinions, working style, tool preferences}

## Architecture Context
[YYYY-MM-DD] - {Alex version, trifecta counts, active focus, current phase}
```

### Format Rules

1. One entry per line, sorted oldest-first within each section
2. Date prefix: `[YYYY-MM-DD]` or `[YYYY-MM]` if only month known, or `[unknown]` if undated
3. Preserve the user's words verbatim for instructions and preferences — do not paraphrase
4. Deduplicate: if the same fact appears in multiple sources, emit it once with the most specific date
5. Wrap entire output in a single code block for easy copying
6. After the code block, state completeness: "Complete set" or "Partial — {what's missing and why}"

### Section Guidelines

**Instructions**: Only rules the user explicitly asked to be followed. Tone, format, style, "always do X", "never do Y", behavioral corrections. Do NOT include architecture rules from copilot-instructions.md — those travel with the repo.

**Identity**: Name, age, birthday, location, origin, education, family, languages, personal interests. Source primarily from user-profile.json.

**Career**: Current and past roles, companies, impact metrics, expertise areas. ONE entry per role/highlight preferred.

**Projects**: ONE entry per project. Include: what it does, current status, key decisions. Use project name as first words. Merge information from multiple sources about the same project.

**Preferences**: Working style, learning style, tool preferences, diagram preferences, model preferences, publishing goals. Broadly applicable opinions.

**Architecture Context**: Current Alex version, phase, mode, trifecta counts, focus areas. This section helps the receiving surface understand where things stand.

## Portability Notes

The export is designed to be pasted into:
- **Claude Code** (`CLAUDE.md` or session context)
- **ChatGPT** (custom instructions or project knowledge)
- **Other Copilot workspaces** (as seed context)
- **Any LLM** (as system prompt supplement)

The receiving surface won't have Alex's architecture, so:
- Omit references to specific file paths within the Alex architecture
- Omit synapse connections, trifecta internals, and cognitive protocols
- Focus on **what the user wants the AI to know and do**, not how Alex implements it
- Keep technical project details that help any AI assist the user

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Include architecture internals (synapses, hooks, muscles) | Not portable — specific to Alex |
| Paraphrase user instructions | Loses intent; verbatim preserves meaning |
| Include secrets, tokens, or API keys | Security risk |
| Include full file contents from the workspace | Too large; export should be <10KB |
| Omit the completeness statement | User needs to know if anything was missed |

## Synapses

See [synapses.json](synapses.json) for connection map.
