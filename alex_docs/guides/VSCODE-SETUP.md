# VS Code Setup

VS Code is the primary development surface for Alex projects. Here's how to configure it for cognitive architecture work.

## Install VS Code

**macOS**

```bash
brew install --cask visual-studio-code
```

After installing, enable the `code` command in your PATH:

1. Open VS Code
2. Press `Cmd + Shift + P`
3. Type "Shell Command: Install 'code' command in PATH"
4. Press Enter

**Windows**

```powershell
winget install Microsoft.VisualStudioCode
```

The Windows installer adds `code` to your PATH automatically: restart your terminal after installing.

## Essential Extensions

These extensions are required or strongly recommended for Alex development.

### Must Have

| Extension               | ID                           | Why                                               |
| ----------------------- | ---------------------------- | ------------------------------------------------- |
| **GitHub Copilot**      | `github.copilot`             | Core AI assistant: Alex runs through Copilot Chat |
| **GitHub Copilot Chat** | `github.copilot-chat`        | Chat interface for Alex interaction               |
| **Markdown All in One** | `yzhang.markdown-all-in-one` | Markdown editing, TOC generation, preview         |

### Recommended

| Extension                    | ID                                      | Why                                             |
| ---------------------------- | --------------------------------------- | ----------------------------------------------- |
| **Mermaid Preview**          | `bierner.markdown-mermaid`              | Preview Mermaid diagrams in markdown            |
| **markdownlint**             | `davidanson.vscode-markdownlint`        | Markdown quality enforcement                    |
| **ESLint**                   | `dbaeumer.vscode-eslint`                | JavaScript/TypeScript linting                   |
| **Prettier**                 | `esbenp.prettier-vscode`                | Code formatting                                 |
| **Python**                   | `ms-python.python`                      | Python IntelliSense, debugging, linting         |
| **esbuild Problem Matchers** | `connor4312.esbuild-problem-matchers`   | Build error detection for extension development |
| **Code Spell Checker**       | `streetsidesoftware.code-spell-checker` | Typo detection in code and documentation        |

### Install All at Once

```bash
code --install-extension github.copilot
code --install-extension github.copilot-chat
code --install-extension yzhang.markdown-all-in-one
code --install-extension bierner.markdown-mermaid
code --install-extension davidanson.vscode-markdownlint
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-python.python
code --install-extension connor4312.esbuild-problem-matchers
code --install-extension streetsidesoftware.code-spell-checker
```

## Workspace Settings

Alex projects use `.vscode/settings.json` for workspace-level configuration. Key settings:

```jsonc
{
    // Markdown preview styling
    "markdown.styles": [
        ".vscode/markdown-light.css"
    ],

    // Skill discovery paths (Alex loads skills from these locations)
    "chat.agentSkillsLocations": {
        ".github/skills": true,
        ".agents/skills": true,
        ".claude/skills": true,
        "~/.copilot/skills": true,
        "~/.agents/skills": true
    }
}
```

## MCP Servers

Model Context Protocol (MCP) servers extend Copilot with external tool access. These are configured at the **user level** (not per-workspace) in VS Code settings or `~/.vscode/mcp.json`.

Common MCP servers for Alex projects:

| Server                  | Purpose                                             |
| ----------------------- | --------------------------------------------------- |
| **Azure MCP**           | Azure resource management, deployment, Bicep        |
| **Microsoft Graph MCP** | M365 integration: mail, calendar, Teams, SharePoint |
| **Bicep MCP**           | Infrastructure-as-code validation and generation    |
| **Microsoft Learn MCP** | Official docs search and fetch                      |

Each MCP server has its own installation instructions: check the extension marketplace for details.

## GitHub Copilot Settings

For Alex to work fully, ensure these Copilot settings are enabled:

| Setting                             | Value          | Why                                    |
| ----------------------------------- | -------------- | -------------------------------------- |
| `github.copilot.chat.agent.enabled` | `true`         | Enables agent mode (tools, file edits) |
| `chat.agent.maxRequests`            | `50` or higher | Allows complex multi-step tasks        |
| `github.copilot.chat.followUps`     | `"always"`     | Shows suggested follow-up actions      |

## Project Structure Recognition

When you open an Alex project, VS Code should automatically detect:

1. **`.github/copilot-instructions.md`**: loaded as system instructions for Copilot
2. **`.github/hooks.json`**: lifecycle hooks that fire automatically
3. **`.github/instructions/*.instructions.md`**: context-specific rules loaded via `applyTo` patterns
4. **`.github/skills/*/SKILL.md`**: domain skills available to all agents

If skills or instructions aren't being picked up, check that the `chat.agentSkillsLocations` paths in your workspace settings include `.github/skills`.
