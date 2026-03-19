---
description: Export all stored memories and context to a portable file
agent: Alex
---

# /export-memory — Portable Memory Export

Export everything Alex knows about me into a single portable document I can paste into another AI work surface.

## Process

1. Read `.github/config/user-profile.json` for identity, career, credentials, and preferences
2. Read `/memories/` directory for all user memory files (patterns, lessons, instructions)
3. Check `/memories/session/` for any active session notes
4. Query `alex_cognitive_user_profile` tool for cognitive profile data
5. Check repository memories from prior agent interactions (available in system context)
6. Read Active Context from `.github/copilot-instructions.md` for current phase/mode/version

## Output Format

Produce a single Markdown document inside a code block with these sections in order:

- **Instructions**: Rules I explicitly set — tone, format, "always/never" directives. Verbatim.
- **Identity**: Name, birthday, location, origin, education, languages, interests.
- **Career**: Roles, companies, expertise, impact metrics.
- **Projects**: ONE entry per project — name, purpose, status, key decisions.
- **Preferences**: Working style, learning style, tool/model preferences, publishing goals.
- **Architecture Context**: Alex version, phase, trifecta count, focus areas.

Each entry: `[YYYY-MM-DD] - content` (or `[unknown]` if undated). Sorted oldest-first.

## Rules

- Preserve my exact words for instructions and preferences
- Deduplicate across sources
- Never include secrets or API keys
- Keep under 10KB
- After the code block, state whether this is the complete set or if more remain

## Start

Begin collecting from all memory sources now and produce the export.
