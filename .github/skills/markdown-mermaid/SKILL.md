---
applyTo: "**/*.md,**/mermaid*,**/diagram*,**/*readme*,**/*emoji*,**/*unicode*"
---

# Markdown & Mermaid

> Clear documentation through visual excellence

A skill for markdown authoring and Mermaid diagramming with VS Code integration, theming, and cross-platform rendering consistency.

## When to Use

- Creating technical documentation with diagrams
- Troubleshooting Mermaid rendering issues
- Styling markdown previews in VS Code
- Converting unicode escapes to proper emojis
- Choosing the right diagram type

## Assets

| File | Purpose |
| ---- | ------- |
| `markdown-light.css` | VS Code preview styling |

**Setup:** Copy CSS to `.vscode/`, add `"markdown.styles": [".vscode/markdown-light.css"]` to settings.

---

## Markdown Best Practices

### Document Structure Template

```markdown
# Title

> Brief description or tagline

---

## Overview

Introductory paragraph explaining the purpose.

---

## Section 1

Content with proper formatting.

### Subsection 1.1

More detailed content.

---

## Tables

**Table N:** *Description of what the table shows*

| Column 1 | Column 2 |
| -------- | -------- |
| Data     | Data     |

---

## Diagrams

` ` `mermaid
flowchart LR
    A --> B
` ` `

**Figure N:** *Description of what the diagram shows*

---

*Footer or closing statement*
```

### Figure and Table Conventions

**Mandatory Labeling**: Every diagram and table MUST have a label:

```markdown
**Figure 1:** *Description in italics*
**Table 1:** *Description in italics*
```

- **Numbering**: Sequential within document, reset per document
- **Placement**: Label immediately follows the diagram/table block

---

## 🏷️ Shields.io Badges

### Badge Anatomy

Badges use [Shields.io](https://shields.io) - a free service for generating status badges.

**URL Structure:**
```
https://img.shields.io/badge/{LABEL}-{MESSAGE}-{COLOR}?{OPTIONS}
```

**Markdown Syntax:**
```markdown
[![Alt Text](https://img.shields.io/badge/Label-Message-color?options)](#)
```

### Style Options

| Style | Appearance | Parameter |
| ----- | ---------- | --------- |
| Flat | Minimal | `style=flat` |
| Flat-Square | Squared corners | `style=flat-square` |
| Plastic | Gradient | `style=plastic` |
| **For-the-Badge** | Large, bold | `style=for-the-badge` |
| Social | GitHub-like | `style=social` |

### Common Color Names

| Color | Name | Hex |
| ----- | ---- | --- |
| 🔵 | `blue` | `#007ec6` |
| 🟢 | `green` | `#97ca00` |
| 🟡 | `gold` / `yellow` | `#dfb317` |
| 🟠 | `orange` | `#fe7d37` |
| 🔴 | `red` | `#e05d44` |
| 🟣 | `purple` | `#9f4bc9` |
| 🔷 | `cyan` | `#25c2a0` |
| ⚫ | `gray` / `grey` | `#555555` |

**Custom Hex**: Use any hex without `#` → `?color=1f2328`

### Adding Icons (Simple Icons)

Shields.io integrates with [Simple Icons](https://simpleicons.org/) for brand logos:

```markdown
[![VS Code](https://img.shields.io/badge/VS_Code-Extension-blue?logo=visualstudiocode&logoColor=white)](#)
```

**Parameters:**
- `logo=iconname` - Icon from Simple Icons (lowercase, no spaces)
- `logoColor=white` - Icon color (usually white for dark backgrounds)

### Badge Templates

**Version Badge:**
```markdown
[![Version](https://img.shields.io/badge/Version-1.0.0-gold?style=for-the-badge&logo=trophy&logoColor=white)](#)
```

**Domain/Category Badge:**
```markdown
[![Domain](https://img.shields.io/badge/Domain-DIAGRAMMING-blue?style=for-the-badge&logo=graduation-cap&logoColor=white)](#)
```

**Quality Badge:**
```markdown
[![Quality](https://img.shields.io/badge/Quality-Enterprise_Grade-green?style=for-the-badge&logo=shield-alt&logoColor=white)](#)
```

**Source Count Badge:**
```markdown
[![Sources](https://img.shields.io/badge/Sources-50+_Academic-purple?style=for-the-badge&logo=book&logoColor=white)](#)
```

**Status Badge:**
```markdown
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Beta-orange?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Deprecated-red?style=for-the-badge)](#)
```

### Document Header Pattern

Professional documents use a badge row at the top:

```markdown
# Document Title

[![Version](https://img.shields.io/badge/Version-1.0.0-gold?style=for-the-badge&logo=trophy&logoColor=white)](#) [![Domain](https://img.shields.io/badge/Domain-TOPIC-blue?style=for-the-badge)](#) [![Quality](https://img.shields.io/badge/Quality-Production-green?style=for-the-badge)](#)

> Description tagline

---
```

### Special Characters in Badges

| Character | Encode As |
| --------- | --------- |
| Space | `_` (underscore) or `%20` |
| Dash | `--` (double dash) |
| Underscore | `__` (double underscore) |

**Example:** "Enterprise Grade" → `Enterprise_Grade` or `Enterprise%20Grade`

### Dynamic Badges (Advanced)

For live data from repos:

```markdown
[![GitHub Stars](https://img.shields.io/github/stars/owner/repo?style=for-the-badge)](#)
[![NPM Version](https://img.shields.io/npm/v/package-name?style=for-the-badge)](#)
[![Build Status](https://img.shields.io/github/actions/workflow/status/owner/repo/ci.yml?style=for-the-badge)](#)
```

---

### Emoji Usage

**Best Practice**: Use actual emoji characters, not HTML entities or unicode escapes.

| Good ✅ | Bad ❌ |
| ------- | ------ |
| `# 🧠 Brain` | `# &#x1F9E0; Brain` |
| `**💻 Local**` | `**\ud83d\udcbb Local**` |

---

## 🎨 Mermaid Diagram Reference

### Diagram Types

| Type | Syntax | Best Use Case |
| ---- | ------ | ------------- |
| Flowchart | `flowchart TB/LR/BT/RL` | Process flows, decision trees |
| Sequence | `sequenceDiagram` | API calls, interactions |
| State | `stateDiagram-v2` | State machines, lifecycles |
| Class | `classDiagram` | OOP design, relationships |
| ER | `erDiagram` | Database schema |
| Gantt | `gantt` | Project timelines |
| Pie | `pie` | Simple proportions |
| Mindmap | `mindmap` | Concept hierarchies |
| Quadrant | `quadrantChart` | 2D positioning analysis |
| Git Graph | `gitGraph` | Branch workflows |

### Node Shapes (Flowchart)

```
A[Rectangle]      B(Rounded)        C([Stadium])
D[[Subroutine]]   E[(Database)]     F((Circle))
G>Asymmetric]     H{Diamond}        I{{Hexagon}}
J[/Parallelogram/]
```

### Edge Styles

```
A --> B           Standard arrow
A --- B           Line without arrow
A -.-> B          Dotted arrow
A ==> B           Thick arrow
A --"label"--> B  Labeled edge
A -->|"label"| B  Alternative label syntax
```

### Color Palette (Material Design)

| Purpose | Background | Stroke |
| ------- | ---------- | ------ |
| Primary/Success | `#e8f5e9` | `#2e7d32` |
| Secondary/Info | `#e3f2fd` | `#1565c0` |
| Accent/Warning | `#fff3e0` | `#ef6c00` |
| Highlight/Special | `#f3e5f5` | `#7b1fa2` |
| Error/Danger | `#ffebee` | `#c62828` |
| Neutral | `#f5f5f5` | `#424242` |

### Per-Diagram Theming

Add as FIRST line inside mermaid block for reliable light theme:

```
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#e8f5e9', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#2e7d32', 'lineColor': '#57606a', 'secondaryColor': '#e3f2fd', 'tertiaryColor': '#f6f8fa'}}}%%
```

---

## ⚠️ Common Pitfalls & Solutions

### Unicode Escape Sequences (Broken Emojis)

**Problem**: Emojis stored as `\ud83d\udcbb` display as raw codes instead of 💻

**Root Cause**: Some editors/tools serialize Unicode as escape sequences when saving files.

---

#### 🔍 Detection Workflow

**Step 1: Find affected files (PowerShell)**

```powershell
# Scan current folder recursively
Get-ChildItem -Recurse -Filter "*.md" | Select-String -Pattern '\\u[0-9a-fA-F]{4}' | Group-Object Path | Select-Object Count, Name
```

**Step 2: Preview replacements in a single file**

```powershell
# See what would change (dry run)
Select-String -Path "README.md" -Pattern '\\u[0-9a-fA-F]{4}' -AllMatches
```

**Step 3: Fix with Copilot**

Ask: "Replace all unicode escape sequences in this file with actual emoji characters using the mapping table"

---

#### 📋 Emoji Mapping Table

**Tip**: Copy the emoji from this table when fixing files.

| Escape | Emoji | Name | Category |
| ------ | ----- | ---- | -------- |
| `\ud83e\udde0` | 🧠 | Brain | Alex/Cognition |
| `\ud83d\udcbb` | 💻 | Laptop | Tech |
| `\ud83d\ude80` | 🚀 | Rocket | Action |
| `\ud83c\udfaf` | 🎯 | Target | Goals |
| `\ud83d\udca1` | 💡 | Lightbulb | Ideas |
| `\ud83d\udd0d` | 🔍 | Search | Discovery |
| `\ud83d\udd04` | 🔄 | Cycle | Process |
| `\u2699\ufe0f` | ⚙️ | Gear | Settings |
| `\ud83d\udd27` | 🔧 | Wrench | Tools |
| `\u26a1` | ⚡ | Lightning | Speed |
| `\ud83c\udf1f` | 🌟 | Star | Success |
| `\ud83c\udf19` | 🌙 | Moon | Dream |
| `\u2601\ufe0f` | ☁️ | Cloud | Cloud |
| `\ud83c\udf10` | 🌐 | Globe | Global |
| `\ud83d\udcac` | 💬 | Speech | Communication |
| `\ud83d\udcdd` | 📝 | Memo | Documentation |
| `\ud83d\udccb` | 📋 | Clipboard | Lists |
| `\ud83d\udcc8` | 📈 | Chart Up | Metrics |
| `\ud83d\udcbe` | 💾 | Floppy | Storage |
| `\ud83d\udce6` | 📦 | Package | Deployment |
| `\u2705` | ✅ | Check | Success |
| `\u274c` | ❌ | Cross | Failure |
| `\u26a0\ufe0f` | ⚠️ | Warning | Caution |
| `\ud83d\udea8` | 🚨 | Siren | Alert |
| `\ud83d\udd12` | 🔒 | Lock | Security |
| `\ud83d\udd11` | 🔑 | Key | Access |
| `\ud83d\udcca` | 📊 | Bar Chart | Data |
| `\ud83d\udcc1` | 📁 | Folder | Files |
| `\ud83d\udcc2` | 📂 | Open Folder | Browse |
| `\ud83d\udc1b` | 🐛 | Bug | Debugging |
| `\u2728` | ✨ | Sparkles | New |
| `\ud83c\udfc6` | 🏆 | Trophy | Achievement |
| `\ud83e\udd16` | 🤖 | Robot | AI |
| `\ud83d\udee0\ufe0f` | 🛠️ | Hammer Wrench | Build |
| `\ud83d\udcda` | 📚 | Books | Learning |

---

#### 🛡️ Prevention

**VS Code Settings** (add to workspace `.vscode/settings.json`):

```json
{
    "files.encoding": "utf8",
    "files.autoGuessEncoding": false
}
```

**Git Config** (preserve UTF-8 in commits):

```bash
git config --global core.quotepath false
```

### Dark Mermaid Backgrounds

**Problem**: Diagrams have dark backgrounds in VS Code preview

**Solution 1**: Use per-diagram `%%{init}%%` theming (see above)

**Solution 2**: Apply included `markdown-light.css` via settings

### Subgraph Title Truncation (VS Code Only)

**Problem**: Subgraph titles (especially with emojis) get truncated/clipped in VS Code preview

**Note**: This is a **VS Code Mermaid renderer bug**. GitHub renders subgraph titles correctly.

**Root Cause**: VS Code's Mermaid extension calculates subgraph width from the content nodes inside, NOT from the title text. If nodes are narrow, the box clips the title.

**Symptoms** (VS Code only):
- Title shows "Conscious Minc" instead of "Conscious Mind"
- Emojis make it worse (they count as ~2 characters width)
- Invisible padding characters (U+200E, em-spaces) don't help

**Workaround for VS Code**: Make the content nodes wider so the subgraph expands:

```mermaid
%% BAD in VS Code - nodes too narrow, title clips
subgraph CONSCIOUS["🌟 Conscious Mind"]
    A["Chat"]
    B["Commands"]
end

%% GOOD - descriptive node labels force wider box
subgraph CONSCIOUS["🌟 Conscious Mind"]
    A["💬 Chat Participant"]
    B["⚡ VS Code Commands"]
end
```

**Key Insight**: The fix is the content, not the title. Wider nodes = wider box = title fits. This workaround benefits VS Code preview while not affecting GitHub rendering.

### Blockquote Tall Boxes

**Problem**: Blockquotes render with excessive vertical padding

**Solution**: Included in `markdown-light.css`:

```css
blockquote p {
    margin: 0 !important;
    line-height: 1.5 !important;
}
```

---

## 📊 Diagram Decision Guide

| Documenting... | Use |
| -------------- | --- |
| Process or flow | Flowchart |
| API interactions | Sequence Diagram |
| State changes | State Diagram |
| Database schema | ER Diagram |
| Class relationships | Class Diagram |
| Project timeline | Gantt Chart |
| Concept hierarchy | Mindmap |
| 2D comparison | Quadrant Chart |
| Proportions | Pie Chart |
| Git branches | Git Graph |

---

## ✅ Quality Checklist

### Before Committing

- [ ] All diagrams have figure labels
- [ ] All tables have table labels
- [ ] No unicode escape sequences
- [ ] Diagrams render correctly in preview
- [ ] Consistent heading hierarchy
- [ ] Links are valid

### Diagram Review

- [ ] Node labels are clear and concise
- [ ] Colors follow consistent palette
- [ ] Subgraphs logically group related items
- [ ] Theme init present if light mode required

---

## 📚 References

- [Mermaid Documentation](https://mermaid.js.org/intro/)
- [Mermaid Live Editor](https://mermaid.live/)
- [VS Code Markdown Guide](https://code.visualstudio.com/docs/languages/markdown)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
