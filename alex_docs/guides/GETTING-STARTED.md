# Getting Started

How to install the Alex cognitive architecture into any project and get it running in VS Code.

## What You Get

Alex is a cognitive architecture that transforms GitHub Copilot into a personalized AI partner. When installed in a repo, the `.github/` folder contains:

| Component    | Count | Location                          | Purpose                                                     |
| ------------ | ----- | --------------------------------- | ----------------------------------------------------------- |
| Identity     | 1     | `.github/copilot-instructions.md` | Alex's personality, routing, and active context             |
| Instructions | ~60   | `.github/instructions/`           | Behavioral rules loaded by file pattern                     |
| Skills       | ~136  | `.github/skills/`                 | Domain knowledge loaded on demand                           |
| Prompts      | ~46   | `.github/prompts/`                | Reusable prompt templates                                   |
| Agents       | 7     | `.github/agents/`                 | Specialized personas (Builder, Researcher, Validator, etc.) |
| Muscles      | ~9    | `.github/muscles/`                | Node.js automation scripts                                  |
| Hooks        | ~18   | `.github/muscles/hooks/`          | Lifecycle triggers (session start, stop, tool use)          |
| Config       | 6+    | `.github/config/`                 | Runtime settings, manifest, user profile                    |

## Prerequisites

Before installing Alex, you need:

1. **VS Code**: latest stable version
2. **GitHub Copilot** subscription (Individual, Business, or Enterprise)
3. **GitHub Copilot Chat** extension installed and signed in
4. **Node.js 18+**: required for muscles and hooks
5. **Git**: for cloning and version control

```bash
# Check prerequisites
code --version
node --version   # Must be 18+
git --version
```

On Windows you also need **winget** (ships with Windows 11 and modern Windows 10).
On macOS you need **Homebrew** (see [CLI Tools](CLI-TOOLS.md)).

## Installation Methods

### Method 1: Clone the Template (Recommended)

Clone an existing Alex-powered repository to use as your starting point:

**macOS / Linux**

```bash
git clone https://github.com/your-org/your-alex-template.git my-project
cd my-project
rm -rf .git         # macOS/Linux
# Windows: rmdir /s /q .git
git init
git add -A
git commit -m "feat: initialize project with Alex cognitive architecture"
```

### Method 2: Add to an Existing Project

Copy the `.github/` folder from an Alex-powered project into yours:

```bash
# From an existing Alex project
cp -r /path/to/alex-project/.github/ /path/to/your-project/.github/
# Windows: xcopy /E /I \path\to\alex-project\.github \path\to\your-project\.github

# Or clone the template and copy just .github/
git clone https://github.com/your-org/your-alex-template.git /tmp/alex-template
cp -r /tmp/alex-template/.github/ /path/to/your-project/.github/
rm -rf /tmp/alex-template
```

Then commit:

```bash
cd /path/to/your-project
git add .github/
git commit -m "feat: add Alex cognitive architecture"
```

## First-Time Setup

### 1. Open the Project in VS Code

```bash
code my-project
```

### 2. Verify Alex Loads

Open Copilot Chat (`Ctrl + Shift + I` on Windows/Linux, `Cmd + Shift + I` on macOS) and type:

```
Who are you?
```

Alex should respond with his identity, not generic Copilot. If he does, the architecture loaded correctly.

### 3. Configure Your User Profile

Create `.github/config/user-profile.json` with your details:

```json
{
  "name": "Your Name",
  "email": "your-email@example.com",
  "role": "Developer",
  "preferences": {
    "tone": "professional",
    "detail_level": "concise"
  }
}
```

Alex uses this to personalize responses and detect your persona.

### 4. Install Muscle Dependencies

If you plan to use the document converters or automation muscles:

```bash
# Cross-platform npm packages
npm install -g @mermaid-js/mermaid-cli svgexport tsx
npm init -y
npm install jszip dotenv

# Pandoc (platform-specific install)
# macOS:   brew install pandoc librsvg
# Windows: winget install JohnMacFarlane.Pandoc ImageMagick.ImageMagick
```

See [npm Packages](NPM-PACKAGES.md) and [CLI Tools](CLI-TOOLS.md) for the full list.

## What Installs Where

```
your-project/
+-- .github/
|   +-- copilot-instructions.md    <-- Loaded automatically by Copilot
|   +-- hooks.json                 <-- Lifecycle hooks (auto-registered)
|   +-- agents/                    <-- Available in @agent mentions
|   |   +-- alex.agent.md
|   |   +-- alex-builder.agent.md
|   |   +-- alex-researcher.agent.md
|   |   +-- alex-validator.agent.md
|   |   +-- alex-documentarian.agent.md
|   |   +-- alex-azure.agent.md
|   |   +-- alex-m365.agent.md
|   +-- instructions/              <-- Auto-loaded by applyTo patterns
|   +-- skills/                    <-- Loaded when topic matches
|   +-- prompts/                   <-- Available via /prompt command
|   +-- muscles/                   <-- Run via terminal or hooks
|   |   +-- hooks/                 <-- Auto-triggered by hooks.json
|   |   +-- shared/                <-- Shared utilities
|   |   +-- lua-filters/           <-- Pandoc filters
|   +-- config/                    <-- Runtime configuration
|       +-- alex-manifest.json     <-- Version tracking
|       +-- user-profile.json      <-- Your personalization
+-- your code here...
```

## Using Agents

After installation, you can invoke specialized Alex agents in Copilot Chat:

| Agent         | Invoke With      | Specialty                                  |
| ------------- | ---------------- | ------------------------------------------ |
| Alex          | `@Alex`          | General orchestrator, learning partner     |
| Builder       | `@Builder`       | Implementation, optimistic problem-solving |
| Researcher    | `@Researcher`    | Deep domain research, knowledge discovery  |
| Validator     | `@Validator`     | Adversarial QA, skeptical analysis         |
| Documentarian | `@Documentarian` | Documentation accuracy, drift-free docs    |
| Azure         | `@Azure`         | Azure development, deployment, IaC         |
| M365          | `@M365`          | Microsoft 365, Teams, Graph API            |

## Updating Alex

Check the current version in `.github/config/alex-manifest.json`:

```bash
cat .github/config/alex-manifest.json | jq '.version'
```

On Windows PowerShell: `Get-Content .github/config/alex-manifest.json | ConvertFrom-Json | Select-Object -ExpandProperty version`

To update, pull the latest from the template:

```bash
# Add the template as a remote (one-time)
git remote add alex-template https://github.com/your-org/your-alex-template.git

# Fetch and merge just the .github/ folder
git fetch alex-template
git checkout alex-template/main -- .github/
git commit -m "chore: update Alex to latest version"
```

**Safety**: The manifest tracks checksums for all files. If you've customized any files, review the diff before committing.

## Recovery

If something goes wrong with the architecture:

```bash
# Reset .github/ to the last committed state
git checkout HEAD -- .github/
```

This works the same on every platform: it's Alex's built-in safety imperative (I5).

## Troubleshooting

| Problem                        | Fix                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| Copilot doesn't recognize Alex | Check that `.github/copilot-instructions.md` exists and is valid markdown                        |
| Hooks don't fire               | Verify `hooks.json` is at `.github/hooks.json` (not nested deeper)                               |
| Skills aren't loaded           | Check `.vscode/settings.json` includes `"chat.agentSkillsLocations": { ".github/skills": true }` |
| Agents don't appear            | Agent files must be at `.github/agents/*.agent.md` with valid YAML frontmatter                   |
| "Cannot find module" errors    | Install dependencies: `npm install -g tsx` and see [npm Packages](NPM-PACKAGES.md)               |
| Muscles fail to run            | Check `node --version` is 18+. Muscles are `.cjs` files that need Node.js.                       |
