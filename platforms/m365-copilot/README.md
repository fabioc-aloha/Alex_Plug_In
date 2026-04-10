# Alex M365 Copilot Agent

Declarative agent for Microsoft 365 Copilot that adds persistent memory, personalized workflows, and cognitive partnership on top of M365 Copilot.

## Architecture

Pure declarative agent (schema v1.6). No API plugins, no Office Add-ins.

```
platforms/m365-copilot/
  appPackage/
    manifest.json              # Teams app manifest v1.25
    declarativeAgent.json      # DA schema v1.6 — instructions, capabilities, knowledge
    instructions/
      alex-system-prompt.md    # Extended system prompt
    knowledge/
      *.txt                    # Packed knowledge files (EmbeddedKnowledge)
      pack-knowledge.cjs       # Build script to repack from Master skills
    color.png / outline.png    # App icons
  docs/                        # Reference documentation
  env/                         # M365 Agents Toolkit environment files
  onedrive-templates/          # → Moved to m365-shared/onedrive-templates/AI-Memory/
  deploy.ps1                   # Quick deploy script
  teamsapp.yml                 # M365 Agents Toolkit lifecycle config
```

## Capabilities

| Capability            | Purpose                                 |
| --------------------- | --------------------------------------- |
| OneDriveAndSharePoint | Persistent memory via AI-Memory folder  |
| WebSearch             | Online research                         |
| GraphicArt            | Image generation                        |
| CodeInterpreter       | Data analysis and visualization         |
| Email                 | Search Outlook threads and action items |
| TeamsMessages         | Search Teams conversations              |
| People                | Colleague lookup and org chart          |
| Meetings              | Calendar and meeting context            |

## Workflows

| Trigger            | Action                                     |
| ------------------ | ------------------------------------------ |
| "prep for meeting" | Deep attendee research + talking points    |
| "weekly review"    | Summarize meetings, emails, progress       |
| "focus session"    | Calendar-aware deep work blocks            |
| "good morning"     | Daily briefing                             |
| "meditate"         | Consolidate learnings into OneDrive memory |
| "help"             | Show available commands                    |

## Development

```powershell
# Install dependencies
npm install

# Provision (first time)
npm run provision

# Package and deploy
npm run package:dev
npm run deploy

# Quick deploy
.\deploy.ps1
```

## OneDrive Memory

Alex stores persistent memory in the user's OneDrive at `AI-Memory/`:
- `profile.md` — Name, role, goals, preferences
- `notes.md` — Session notes and insights
- `learning-goals.md` — Learning objectives and progress
- `global-knowledge.md` — Cross-project insights shared across all AI surfaces

Templates are in `platforms/m365-shared/onedrive-templates/AI-Memory/`.

## Version

7.4.2 — Aligned with Master Alex cognitive architecture.
