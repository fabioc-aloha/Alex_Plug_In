# Copilot Cowork: Skills and Customization

Source: Microsoft Learn (learn.microsoft.com/en-us/copilot/microsoft-365/cowork/use-cowork), collected 2026-04-02
Status: Frontier Preview

## Built-in skills (13)

Cowork uses specialized skills as it works. When a skill loads during your conversation, a message appears (e.g., "Preparing to compose emails") and the skill shows in the side panel as a chip.

| Skill               | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| Word                | Create and edit Word documents                                                        |
| Excel               | Create and edit Excel spreadsheets                                                    |
| PowerPoint          | Create and edit PowerPoint presentations                                              |
| PDF                 | Work with PDF documents                                                               |
| Email               | Compose, reply, forward, and send emails. Save drafts and manage attachments          |
| Scheduling          | Schedule meetings                                                                     |
| Calendar Management | Create events using natural language, add Teams meeting links, manage calendar        |
| Meetings            | Prepare meeting intelligence                                                          |
| Daily Briefing      | Prepare your daily briefing                                                           |
| Enterprise Search   | Search across your organization                                                       |
| Deep Research       | In-depth research across multiple sources, compile comprehensive answers and analysis |
| Communications      | Draft stakeholder communications                                                      |
| Adaptive Cards      | Interactive card-based responses with structured layouts, buttons, and data displays  |

## Custom skills

You can extend Cowork with custom skills stored in your OneDrive. Limits: up to 20 custom skills, each SKILL.md up to 1 MB.

### File location

```
OneDrive/Documents/Cowork/Skills/<skill-name>/SKILL.md
```

Example: `Documents/Cowork/Skills/weekly-report/SKILL.md`

### SKILL.md format

```yaml
---
name: Weekly Report
description: Generates a weekly status report from my recent emails and calendar.
---

Gather my sent emails and calendar events from the past week, then create
a summary document organized by project.
```

Structure:

1. YAML frontmatter with `name` and `description`
2. Skill instructions in Markdown below the frontmatter

### Discovery

Cowork discovers custom skills automatically at the start of each conversation. No manual registration needed.

### Important notes

- Custom skills created by users are **not validated by Microsoft**
- Review custom skill outputs carefully
- Skills appear as chips in the side panel's Skills section

## Scheduled prompts

Cowork supports recurring automated tasks.

### How to create

Describe what you want and when in your message:

- "Send me a daily briefing every morning at 9 AM"
- "Create a weekly status report every Friday"

Cowork sets up the schedule based on your request.

### How to manage

Manage scheduled prompts from:

- **Scheduled tab** in the Tasks view
- **Schedule section** of the side panel

Options: edit, pause, resume, or delete.

## Alex relevance: Custom skills parallel

The Cowork custom skill system has notable parallels to the Alex cognitive architecture:

| Concept          | Alex                                                          | Cowork                                             |
| ---------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| Skill definition | `.github/skills/<name>/SKILL.md`                              | `OneDrive/Documents/Cowork/Skills/<name>/SKILL.md` |
| Format           | YAML frontmatter + Markdown body                              | YAML frontmatter + Markdown body                   |
| Discovery        | Loaded by VS Code Copilot per copilot-instructions.md routing | Auto-discovered at conversation start              |
| Limit            | No hard limit                                                 | 20 custom skills max                               |
| File size        | No formal limit                                               | 1 MB per SKILL.md                                  |
| Scope            | VS Code workspace                                             | Microsoft 365 Copilot tenant                       |

This is a significant validation of the "skills as Markdown" pattern that Alex has been using since early versions. The SKILL.md format with YAML frontmatter that Cowork adopted is directly analogous to the Alex skill architecture.
