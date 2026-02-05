---
name: "Markdown & Mermaid"
description: "Clear documentation through visual excellence"
applyTo: "**/*.md,**/mermaid*,**/diagram*,**/*readme*,**/*emoji*,**/*unicode*"
---

# Markdown & Mermaid

> Clear documentation through visual excellence

A skill for markdown authoring, Mermaid diagramming, multi-tool visualization, VS Code integration, and cross-platform rendering consistency.

## When to Use

- Creating technical documentation with diagrams
- Choosing the right diagramming tool for your audience
- Troubleshooting Mermaid rendering issues
- Styling markdown previews in VS Code
- Converting unicode escapes to proper emojis
- Enterprise documentation with visual standards
- **Interactive diagrams in VS Code chat** (1.109+)

---

## VS Code 1.109+ Native Chat Rendering

VS Code 1.109 introduces **native Mermaid rendering in chat** via the `renderMermaidDiagram` tool.

### When to Use Native Rendering

When creating diagrams **in Copilot Chat** (not markdown files), use the native tool for:
- **Interactive exploration**: Pan, zoom, and full-screen viewing
- **Immediate feedback**: See diagrams without switching to markdown preview
- **Iterative refinement**: Quick edits with instant re-render
- **Copy source**: Extract the Mermaid code for documentation

### Usage Pattern

```text
User: Create a sequence diagram showing OAuth flow

Alex: [uses renderMermaidDiagram tool]
       → Interactive diagram appears in chat
       → User can pan/zoom/fullscreen
       → "Copy source" extracts code for docs
```

### When NOT to Use

- **Documentation authoring**: Use markdown code blocks for `.md` files
- **GitHub rendering**: Embed Mermaid in markdown for native GitHub support
- **Presentations**: Export to image formats or use D2

### Combined Workflow

1. **Design in chat**: Use `renderMermaidDiagram` for rapid iteration
2. **Finalize**: Copy the Mermaid source code
3. **Document**: Paste into markdown file with ` ```mermaid ` code fence

---

## Assets

| File | Purpose |
| ---- | ------- |
| `markdown-light.css` | VS Code preview styling |
| `polish-mermaid-setup.prompt.md` | Interactive Mermaid configuration helper |

**Setup:** Copy CSS to `.vscode/`, add `"markdown.styles": [".vscode/markdown-light.css"]` to settings.

**Mermaid Config:** Run the "Polish Mermaid Setup" prompt to configure Mermaid rendering for your VS Code environment.

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

```text
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

[![Version](https://img.shields.io/badge/Version-1.0.0-gold?style=for-the-badge&logo=trophy&logoColor=white)](#) [![Domain](https://img.shields.io/badge/Domain-TOPIC-blue?style=for-the-badge)](#)

> Description tagline

---
```

### Special Characters in Badges

| Character | Encode As |
| --------- | --------- |
| Space | `_` (underscore) or `%20` |
| Dash | `--` (double dash) |
| Underscore | `__` (double underscore) |

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

## 🎯 Diagram Tool Selection Framework

### Step 1: Identify Your Communication Goal

| What You're Showing | Best Tools | Example Use Cases |
| ------------------- | ---------- | ----------------- |
| **Process/Workflow** | Mermaid Flowcharts, User Journey | Onboarding, approvals, troubleshooting |
| **System Architecture** | Mermaid Flowcharts with subgraphs, D2 | Microservices, API design |
| **Relationships** | Mermaid ER, Mindmaps, Graphviz | Database schemas, org charts |
| **Time/Sequence** | Mermaid Sequence, Gantt | API interactions, timelines |
| **Data/Metrics** | Mermaid XY Charts, Sankey, Quadrant | Performance, resource allocation |

### Step 2: Consider Your Audience

| Audience | Primary Goal | Recommended Tools | Style |
| -------- | ------------ | ----------------- | ----- |
| **Executives** | Strategic overview | D2, simple flowcharts | Clean, minimal |
| **Architects** | Technical accuracy | PlantUML, Mermaid C4 | Detailed, precise |
| **Developers** | Implementation | Mermaid Sequence, Class | Code-focused |
| **Product Managers** | User flows | User Journey, Flowcharts | Business-outcome |
| **Documentation** | Learning | All Mermaid types | Progressive disclosure |

### Step 3: Consider Platform

| Platform | Best Tools | Why |
| -------- | ---------- | --- |
| **GitHub/GitLab** | Mermaid | Native rendering, no setup |
| **Confluence/Wiki** | Mermaid, PlantUML | Plugin support |
| **VS Code** | All tools (extensions) | Live preview |
| **Presentations** | D2, simple Mermaid | Executive-friendly |

### Quick Decision Tree

```text
Need diagram? → What are you showing?
├── Process/Workflow → Mermaid Flowchart
├── System Architecture → Mermaid with subgraphs (or D2 for exec)
├── Relationships → Mermaid ER/Mindmap (or Graphviz for complex)
├── Time/Sequence → Mermaid Sequence/Gantt
└── Data/Metrics → Mermaid XY/Sankey/Quadrant
```

---

## 🛠️ Multi-Tool Ecosystem

### Tool Comparison Matrix

| Tool | Native GitHub | Complexity | Best For |
| ---- | ------------- | ---------- | -------- |
| **Mermaid** | ✅ Yes | Low-Medium | General purpose, quick diagrams |
| **PlantUML** | ❌ No | Medium-High | Enterprise UML, AWS/Azure |
| **Graphviz** | ❌ No | High | Complex networks, dependencies |
| **D2** | ❌ No | Low | Clean architecture overviews |
| **WaveDrom** | ❌ No | Medium | Digital timing diagrams |

### VS Code Extension Setup

```json
{
  "recommendations": [
    "bierner.markdown-mermaid",
    "vstirbu.vscode-mermaid-preview",
    "mermaidchart.vscode-mermaid-chart",
    "jebbs.plantuml",
    "joaompinto.vscode-graphviz",
    "terrastruct.d2",
    "shd101wyy.markdown-preview-enhanced",
    "yzane.markdown-pdf",
    "bierner.markdown-preview-github-styles"
  ]
}
```

### Syntax Examples

**PlantUML** (Enterprise UML):

```text
@startuml
!theme aws-orange
participant User
participant System
participant Database

User -> System: Request
System -> Database: Query
Database --> System: Response
System --> User: Result
@enduml
```

**Graphviz DOT** (Complex Networks):

```text
digraph G {
    rankdir=TB;
    node [shape=box, style=filled, fillcolor=lightblue];
    A -> B;
    A -> C;
    B -> D;
    C -> D;
}
```

**D2** (Modern Architecture):

```text
users -> web_server: HTTPS requests
web_server -> database: SQL queries

users.style.fill: "#e1f5fe"
web_server.style.fill: "#f3e5f5"
```

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
| XY Chart | `xychart-beta` | Data plotting |
| Sankey | `sankey-beta` | Flow analysis |
| Block | `block-beta` | Block diagrams |

### Node Shapes (Flowchart)

```text
A[Rectangle]      B(Rounded)        C([Stadium])
D[[Subroutine]]   E[(Database)]     F((Circle))
G>Asymmetric]     H{Diamond}        I{{Hexagon}}
J[/Parallelogram/]
```

### Edge Styles

```text
A --> B           Standard arrow
A --- B           Line without arrow
A -.-> B          Dotted arrow
A ==> B           Thick arrow
A --"label"--> B  Labeled edge
A -->|"label"| B  Alternative label syntax
```

### Color Palette (GitHub-Compatible)

| Purpose | Background | Border/Stroke |
| ------- | ---------- | ------------- |
| **GitHub Light** | `#f6f8fa` | `#d1d9e0` |
| **Text** | - | `#1f2328` |
| **Lines** | - | `#656d76` |
| **Success** | `#e8f5e9` | `#2e7d32` |
| **Info** | `#e3f2fd` | `#1565c0` |
| **Warning** | `#fff3e0` | `#ef6c00` |
| **Special** | `#f3e5f5` | `#7b1fa2` |
| **Danger** | `#ffebee` | `#c62828` |
| **Neutral** | `#f5f5f5` | `#424242` |

### Per-Diagram Theming (MANDATORY for consistency)

Add as FIRST line inside mermaid block:

**Standard GitHub-compatible theme:**

```text
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f6f8fa', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#d1d9e0', 'lineColor': '#656d76', 'secondaryColor': '#f6f8fa', 'tertiaryColor': '#ffffff', 'background': '#ffffff', 'mainBkg': '#f6f8fa', 'nodeBorder': '#d1d9e0'}}}%%
```

**Quadrant chart theme:**

```text
%%{init: {'theme': 'base', 'themeVariables': { 'quadrant1Fill': '#e8f5e9', 'quadrant2Fill': '#e3f2fd', 'quadrant3Fill': '#f3e5f5', 'quadrant4Fill': '#fff3e0', 'quadrant1TextFill': '#1f2328', 'quadrant2TextFill': '#1f2328', 'quadrant3TextFill': '#1f2328', 'quadrant4TextFill': '#1f2328', 'quadrantPointFill': '#1565c0', 'quadrantPointTextFill': '#1f2328'}}}%%
```

---

## 🎨 Visual Design Principles

### Color Psychology in Diagrams

| Color | Association | Use For |
| ----- | ----------- | ------- |
| 💙 **Blue** | Trust, reliability | Human partnership, collaboration |
| 💜 **Purple** | Consciousness, awareness | Identity, higher concepts |
| 💚 **Green** | Growth, learning | Cognitive processing, success |
| 🧡 **Orange** | Connection, energy | Memory networks, neural links |
| ❤️ **Red** | Power, achievement | Advanced capabilities, warnings |

### Diagram Effectiveness Criteria

- **Clarity**: Audience understands in 30 seconds
- **Accuracy**: Correctly represents the system/process
- **Completeness**: All essential elements, no clutter
- **Consistency**: Follows visual conventions
- **Maintainability**: Easy to update

### Accessibility Standards

- Provide alternative text descriptions
- Use color-blind friendly palettes
- Ensure sufficient contrast
- Don't rely on color alone for meaning

---

## ⚠️ Common Pitfalls & Solutions

### Unicode Escape Sequences (Broken Emojis)

**Problem**: Emojis stored as `\ud83d\udcbb` display as raw codes instead of 💻

**Detection (PowerShell):**

```powershell
Get-ChildItem -Recurse -Filter "*.md" | Select-String -Pattern '\\u[0-9a-fA-F]{4}' | Group-Object Path
```

**Prevention (VS Code settings):**

```json
{
    "files.encoding": "utf8",
    "files.autoGuessEncoding": false
}
```

### Emoji Mapping Table

| Escape | Emoji | Name |
| ------ | ----- | ---- |
| `\ud83e\udde0` | 🧠 | Brain |
| `\ud83d\udcbb` | 💻 | Laptop |
| `\ud83d\ude80` | 🚀 | Rocket |
| `\ud83c\udfaf` | 🎯 | Target |
| `\ud83d\udca1` | 💡 | Lightbulb |
| `\ud83d\udd0d` | 🔍 | Search |
| `\ud83d\udd04` | 🔄 | Cycle |
| `\u2699\ufe0f` | ⚙️ | Gear |
| `\ud83d\udd27` | 🔧 | Wrench |
| `\u26a1` | ⚡ | Lightning |
| `\ud83c\udf1f` | 🌟 | Star |
| `\ud83c\udf19` | 🌙 | Moon |
| `\u2601\ufe0f` | ☁️ | Cloud |
| `\ud83c\udf10` | 🌐 | Globe |
| `\ud83d\udcac` | 💬 | Speech |
| `\ud83d\udcdd` | 📝 | Memo |
| `\ud83d\udccb` | 📋 | Clipboard |
| `\ud83d\udcc8` | 📈 | Chart Up |
| `\ud83d\udcbe` | 💾 | Floppy |
| `\ud83d\udce6` | 📦 | Package |
| `\u2705` | ✅ | Check |
| `\u274c` | ❌ | Cross |
| `\u26a0\ufe0f` | ⚠️ | Warning |
| `\ud83d\udea8` | 🚨 | Siren |
| `\ud83d\udd12` | 🔒 | Lock |
| `\ud83d\udd11` | 🔑 | Key |
| `\ud83d\udcca` | 📊 | Bar Chart |
| `\ud83d\udcc1` | 📁 | Folder |
| `\ud83d\udc1b` | 🐛 | Bug |
| `\u2728` | ✨ | Sparkles |
| `\ud83c\udfc6` | 🏆 | Trophy |
| `\ud83e\udd16` | 🤖 | Robot |
| `\ud83d\udcda` | 📚 | Books |

### Dark Mermaid Backgrounds

**Problem**: Diagrams have dark backgrounds in VS Code preview

**Solution 1**: Use per-diagram `%%{init}%%` theming (see above)

**Solution 2**: Apply included `markdown-light.css` via settings

### Disproportionate Diagram Layouts (Too Wide/Too Tall)

**Problem**: Diagrams become too wide (horizontal) or too tall (vertical), causing poor readability

**Detection**: Look for diagrams where one dimension is 3x+ the other

**Pattern**: Use opposing directions for outer flowchart vs. inner subgraphs:

```text
%% Pattern 1: TD outer with LR inner (vertical stack of horizontal lanes)
flowchart TD
    subgraph Phase1["Phase 1"]
        direction LR
        A --> B --> C
    end
    subgraph Phase2["Phase 2"]
        direction LR
        D --> E --> F
    end

%% Pattern 2: LR outer with TB inner (horizontal flow of vertical stacks)
flowchart LR
    subgraph Group1["Group 1"]
        direction TB
        A --> B --> C
    end
    subgraph Group2["Group 2"]
        direction TB
        D --> E --> F
    end
```

**Key Rules**:

| Outer Direction | Inner Direction | Result |
| --------------- | --------------- | ------ |
| TD/TB | LR | Subgraphs stack vertically, content flows horizontally |
| LR | TB | Subgraphs flow horizontally, content stacks vertically |

**Anti-Pattern 1**: Single subgraph with opposing direction has no effect (nothing to stack)

```text
%% WRONG - single subgraph, direction LR does nothing useful
flowchart TD
    subgraph Only["Only Subgraph"]
        direction LR
        A --> B --> C --> D --> E  %% Still very wide!
    end

%% RIGHT - break into multiple subgraphs
flowchart TD
    subgraph Phase1["Setup"]
        direction LR
        A --> B
    end
    subgraph Phase2["Execute"]
        direction LR
        C --> D
    end
```

**Anti-Pattern 2**: Cross-subgraph edges defined inside subgraphs (causes layout confusion)

```text
%% WRONG - edge to next subgraph defined inside source subgraph
flowchart TD
    subgraph Phase1["Setup"]
        direction LR
        A --> B
        B --> C  %% C is in Phase2!
    end
    subgraph Phase2["Execute"]
        direction LR
        C --> D
    end

%% RIGHT - cross-subgraph edges defined outside all subgraphs
flowchart TD
    subgraph Phase1["Setup"]
        direction LR
        A --> B
    end
    subgraph Phase2["Execute"]
        direction LR
        C --> D
    end
    B --> C  %% Cross-subgraph edge outside
    subgraph Phase3["Complete"]
        direction LR
        E
    end
```

**Anti-Pattern 3**: Independent subgraphs without connections default to vertical stacking

```text
%% WRONG - no connections between subgraphs, ignores LR direction
flowchart LR
    subgraph A["Group A"]
        direction TB
        A1 --> A2
    end
    subgraph B["Group B"]
        direction TB
        B1 --> B2
    end
    %% Result: Groups stack vertically despite LR!

%% RIGHT - invisible links force horizontal layout
flowchart LR
    subgraph A["Group A"]
        direction TB
        A1 --> A2
    end
    subgraph B["Group B"]
        direction TB
        B1 --> B2
    end
    A ~~~ B  %% Invisible link forces LR arrangement
```

### Subgraph Title Truncation (VS Code Only)

**Problem**: Subgraph titles get truncated in VS Code preview

**Note**: This is a **VS Code Mermaid renderer bug**. GitHub renders correctly.

**Root Cause**: VS Code calculates subgraph width from content nodes, NOT title text.

**Workaround**: Make content nodes wider so the subgraph expands:

```text
%% BAD in VS Code - narrow nodes clip title
subgraph CONSCIOUS["🌟 Conscious Mind"]
    A["Chat"]
    B["Commands"]
end

%% GOOD - descriptive labels force wider box
subgraph CONSCIOUS["🌟 Conscious Mind"]
    A["💬 Chat Participant"]
    B["⚡ VS Code Commands"]
end
```

### Mermaid Parse Errors

**Problem**: Nested quotes or parentheses cause parse errors

**Rule**: Don't nest quotes inside quoted node labels

```text
%% ❌ FAILS - nested quotes
["Return with<br/>"🌐 Results<br/>(Info)"]

%% ✅ WORKS - no nested quotes
["🌐 Return Results<br/>Info"]
```

### C4 Diagram Limitations

**Problem**: C4Component syntax not fully supported in standard Mermaid

**Solution**: Use flowcharts with subgraphs instead:

```text
flowchart TB
    subgraph SYSTEM["🏦 System Name"]
        A["📝 Component A"]
        B["📊 Component B"]
    end
    USER(("👤 User"))
    USER --> A
    USER --> B
```

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

## ✅ Quality Checklist

### Before Committing

- [ ] All diagrams have `%%{init}%%` theme directive
- [ ] All diagrams have figure labels
- [ ] All tables have table labels
- [ ] No unicode escape sequences
- [ ] Diagrams render correctly in preview AND GitHub
- [ ] Consistent heading hierarchy
- [ ] Links are valid

### Diagram Review

- [ ] Node labels are clear and concise (but not over-simplified)
- [ ] Colors follow consistent palette
- [ ] Subgraphs logically group related items
- [ ] Subgraph content is wide enough for title (VS Code)

### Don't Over-Simplify

**KISS ≠ Remove all detail**

KISS means removing **unnecessary** complexity while preserving **meaningful** information. If removing detail reduces understanding, keep it.

---

## 📚 References

### Official Documentation

- [Mermaid Documentation](https://mermaid.js.org/intro/)
- [Mermaid Live Editor](https://mermaid.live/)
- [PlantUML Documentation](https://plantuml.com/)
- [Graphviz Documentation](https://graphviz.org/documentation/)
- [D2 Documentation](https://d2lang.com/)
- [Shields.io](https://shields.io/)

### VS Code Resources

- [VS Code Markdown Guide](https://code.visualstudio.com/docs/languages/markdown)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

### Visual Design Theory

- Tufte, E.R. - *The Visual Display of Quantitative Information*
- Cairo, A. - *The Functional Art*
- Knaflic, C.N. - *Storytelling with Data*
