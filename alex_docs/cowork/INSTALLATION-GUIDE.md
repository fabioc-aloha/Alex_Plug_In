# Installing Alex Coworker

> **Status**: Draft | **Created**: 2026-04-03
>
> Step-by-step guide for deploying Alex as an M365 Copilot Cowork heir. No add-in, app, or admin deployment needed. Alex Coworker is installed entirely through user-level settings and OneDrive files.

## What you're installing

Alex Coworker has three layers, each installed separately:

| Layer | What it does | Where it lives | Install method |
| ----- | ------------ | -------------- | -------------- |
| **Identity** | Alex's personality, tone, values, communication style | M365 Copilot Custom Instructions | Copy and paste into Settings |
| **Skills** | 20 custom SKILL.md files that teach Cowork *how to think* | OneDrive/Documents/Cowork/Skills/ | Create folders and files in OneDrive |
| **Preferences** | Learned patterns from conversations | Saved Memories (automatic) | Builds over time, no manual setup |

**No add-in or app installation required.** Cowork is built into M365 Copilot. Alex Coworker uses native M365 personalization features.

## Prerequisites

Before starting:

- [ ] Active **Microsoft 365 Copilot license** assigned to your account
- [ ] Enrolled in the **Frontier program** ([join here](https://adoption.microsoft.com/en-us/copilot/frontier-program/))
- [ ] Cowork visible in your M365 Copilot app (if not: Admin Center > Copilot > Settings > Frontier)
- [ ] OneDrive syncing on your device (for skill file deployment)

## Step 1: Install Alex Identity (Custom Instructions)

Custom Instructions is a persistent free-text field that M365 Copilot loads at the start of every conversation. This is where Alex's personality lives. It costs 0 skill slots.

### How to set it up

1. Open M365 Copilot at **m365.cloud.microsoft**
2. Click your **profile icon** (top right)
3. Select **Settings**
4. Select **Personalization**
5. Find **Custom Instructions**
6. Paste the following into the Custom Instructions field:

```
## Who I Am

I'm Alex, a thoughtful AI partner. I approach every task with genuine curiosity
and care about doing things right. I'm direct, concise, and I ask questions
when something isn't clear rather than assuming.

## Communication Style

- Direct and concise: lead with the answer, then supporting detail
- Use bullet points over paragraphs
- Flag uncertainties honestly: "I'm not sure about X, but here's what I found"
- Include specific dates, names, and numbers when available
- Mark items needing attention with [ACTION NEEDED]

## Principles

- Quality first: better to do fewer things well than many things poorly
- Research before action: gather context before producing deliverables
- Structured output: tables, lists, and clear headings over prose
- Honest uncertainty: say "I don't know" when appropriate

## Working With You

- Address blockers proactively
- Offer alternatives when a requested approach isn't possible
- Save progress incrementally rather than risking a large failure
```

7. Click **Save**

**Verification**: Start a new Cowork conversation and ask "Who are you?" Alex should respond with personality traits matching the instructions above.

### Customizing identity

The text above is a starting template. You can personalize it:

- Add your name so Alex addresses you directly
- Add your role and industry context
- Add output preferences (e.g., "Always format reports with executive summary first")
- Add your preferred working hours or timezone

Custom Instructions apply to all M365 Copilot conversations (Chat and Cowork), not just Cowork.

## Step 2: Create OneDrive Skills Folder

Cowork discovers custom skills from a specific OneDrive folder. Create the folder structure first.

### Using OneDrive (browser)

1. Open **OneDrive** at onedrive.cloud.microsoft
2. Navigate to **Documents**
3. Look for a folder called **Cowork**. If it exists, open it. If not, create it.
4. Inside Cowork, look for or create a folder called **Skills**

Your path should be: `Documents/Cowork/Skills/`

### Using File Explorer (Windows, if OneDrive is synced)

```
C:\Users\<your-username>\OneDrive\Documents\Cowork\Skills\
```

Create the folders if they don't exist.

## Step 3: Deploy Alex Skills

Each skill is a single `SKILL.md` file inside a named folder under `Skills/`. Cowork auto-discovers them at conversation start.

### Folder structure

```
Documents/
  Cowork/
    Skills/
      executive-storytelling/
        SKILL.md
      data-analysis/
        SKILL.md
      bootstrap-learning/
        SKILL.md
      ...up to 20 folders
```

### Which skills to deploy

Deploy in tiers, starting with the highest-impact skills. See [SKILL-DEPLOYMENT-STRATEGY.md](SKILL-DEPLOYMENT-STRATEGY.md) for the full analysis.

**Start with Tier 2 (slots 1-6): Knowledge Work Methodology**

| Slot | Folder name | What it teaches Cowork |
| ---- | ----------- | ---------------------- |
| 1 | executive-storytelling | Data-driven narrative construction, stakeholder framing |
| 2 | data-analysis | EDA methodology: profiling, distributions, anomaly detection |
| 3 | data-storytelling | Three-act narrative, audience-first framing |
| 4 | research-first-development | 4-dimension gap analysis, knowledge encoding before action |
| 5 | bootstrap-learning | Domain-agnostic knowledge acquisition from zero to expertise |
| 6 | literature-review | Systematic search, synthesis, gap identification |

**Then add Tier 3 (slots 7-11): Business Execution**

| Slot | Folder name | What it teaches Cowork |
| ---- | ----------- | ---------------------- |
| 7 | stakeholder-management | Influence mapping, communication strategy |
| 8 | business-analysis | Requirements elicitation, BRDs, process analysis |
| 9 | change-management | ADKAR methodology, adoption strategies |
| 10 | status-reporting | Structured project status: RAG, risks, action items |
| 11 | scope-management | Scope creep detection, MVP cuts |

**Then Tier 4 (slots 12-14): Communication Quality**

| Slot | Folder name | What it teaches Cowork |
| ---- | ----------- | ---------------------- |
| 12 | ai-writing-avoidance | Eliminate telltale AI patterns from all outputs |
| 13 | slide-design | Visual hierarchy, minimal text, data-viz principles |
| 14 | creative-writing | Narrative structure, engagement techniques |

**Then Tier 5 (slots 15-20): Stretch, deploy based on your role**

| Slot | Folder name | Deploy if... |
| ---- | ----------- | ------------ |
| 15 | coaching-techniques | You manage people |
| 16 | chart-interpretation | You work with data reports |
| 17 | citation-management | You write academic papers |
| 18 | prompt-engineering | You want to get more from Cowork |
| 19 | north-star | Your org uses Alex as a strategic partner |
| 20 | data-visualization | You create visual reports |

### Creating a skill file

For each skill, create a `SKILL.md` file with YAML frontmatter:

```yaml
---
name: Executive Storytelling
description: Data-driven narrative construction and stakeholder framing for presentations and reports.
---

## Purpose

Transform raw data and information into compelling narratives for executive
audiences. Focus on the "so what?" not just the "what."

## Steps

1. Identify the audience and their decision context
2. Frame the core message in one sentence
3. Structure as: situation, complication, resolution
4. Support each point with specific data (dates, numbers, names)
5. Create clear recommendations with trade-offs stated explicitly

## Output Format

- Executive summary (3 sentences max) at the top
- Key findings as numbered list with supporting data
- Recommendations as action items with owners and deadlines
- Appendix for detailed data tables

## Guidelines

- Lead with the conclusion, not the methodology
- One idea per paragraph, one message per slide
- Use "we recommend" not "it is recommended"
- Flag risks and assumptions explicitly
```

**Important constraints:**

- Each SKILL.md must be under **1 MB**
- YAML frontmatter requires `name` and `description` fields
- Maximum **20 custom skills** total
- Skills are **not validated by Microsoft**: review outputs carefully

### Automated deployment (future)

The `cowork-sync.cjs` script (planned) will automate skill translation and deployment from Master Alex. Until then, skill files are created manually based on the templates in the [ARCHITECTURE.md](ARCHITECTURE.md) translation rules.

## Step 4: Verify Installation

### Test identity

1. Open Cowork at m365.cloud.microsoft > Cowork
2. Start a new conversation
3. Ask: "Who are you and how do you work?"
4. **Expected**: Alex-style response (direct, structured, mentions curiosity and quality)

### Test skills

1. In the same or new conversation, ask: "Research the competitive landscape for [your product] and create an executive summary"
2. **Expected**: The side panel should show your custom skills loading as chips
3. **Expected**: Output should follow the structured format from your deployed skills

### Test persistence

1. Close the conversation
2. Start a new one
3. Ask: "What's your approach to creating a status report?"
4. **Expected**: Response reflects both Custom Instructions (tone, style) and status-reporting skill (RAG format, risks, action items)

## Troubleshooting

| Problem | Cause | Fix |
| ------- | ----- | --- |
| Custom skills not loading | Wrong folder path | Verify: `OneDrive/Documents/Cowork/Skills/<name>/SKILL.md` |
| Custom skills not loading | Added mid-conversation | Start a **new** conversation (skills are discovered at conversation start) |
| Custom skills not loading | OneDrive not synced | Check OneDrive sync status; wait for sync to complete |
| Alex personality not showing | Custom Instructions not saved | Re-check Settings > Personalization > Custom Instructions |
| Alex personality not showing | Old conversation | Start a new conversation (Custom Instructions may not apply to existing ones) |
| Session timed out | Inactivity timeout (Frontier Preview) | Start a new conversation; cannot resume after timeout |
| Cowork not visible | Not enrolled in Frontier | Enroll at adoption.microsoft.com/en-us/copilot/frontier-program/ |
| Cowork not visible | Admin hasn't enabled | Admin: Copilot > Settings > Frontier toggle |
| SKILL.md not recognized | Missing YAML frontmatter | Ensure file starts with `---`, has `name` and `description`, ends with `---` |
| SKILL.md not recognized | File too large | Keep under 1 MB; strip verbose reference sections |

## What's NOT needed

| You do NOT need to... | Because... |
| --------------------- | ---------- |
| Install an add-in or app | Cowork is built into M365 Copilot |
| Register skills with Microsoft | Skills are auto-discovered from OneDrive |
| Configure an API key | Authentication uses your M365 identity |
| Ask an admin to deploy anything | Custom Instructions and OneDrive skills are per-user |
| Pay extra beyond M365 Copilot | Custom skills and Custom Instructions are included |
| Use a specific browser | Works in Edge, Chrome, desktop app, Outlook, and Teams |

## Updating Alex Coworker

| What to update | How | Takes effect |
| -------------- | --- | ------------ |
| Identity (Custom Instructions) | Edit in Settings > Personalization | Next new conversation |
| Skill content | Edit the SKILL.md file in OneDrive | Next new conversation |
| Add a new skill | Create new folder + SKILL.md in OneDrive | Next new conversation |
| Remove a skill | Delete the folder from OneDrive | Next new conversation |

All changes take effect at the start of the **next** conversation. Ongoing conversations use whatever was loaded when they started.
