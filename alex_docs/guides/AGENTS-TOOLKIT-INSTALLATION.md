# Microsoft 365 Agents Toolkit Installation Guide

This guide provides instructions for installing the Microsoft 365 Agents Toolkit (previously known as Teams Toolkit) for Visual Studio Code.

> **Source**: [Microsoft Learn - Install Agents Toolkit](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/install-agents-toolkit?tabs=vscode)

---

## Prerequisites

Before installing Agents Toolkit, ensure you have the following:

| Requirement        | Version     | Download Link                                              |
| ------------------ | ----------- | ---------------------------------------------------------- |
| Visual Studio Code | Latest      | [Download VS Code](https://code.visualstudio.com/Download) |
| Node.js            | 16 or later | [Download Node.js](https://nodejs.org/)                    |
| NPM                | 8 or later  | Included with Node.js                                      |

---

## Install Agents Toolkit for Visual Studio Code

You can install Agents Toolkit using either the Extensions view in Visual Studio Code or directly from the Visual Studio Code Marketplace.

### Method 1: Install via VS Code Extensions

1. **Launch Visual Studio Code**

2. **Open Extensions View**
   - Navigate to `View > Extensions`
   - Or use keyboard shortcut: `Ctrl+Shift+X`
   - Or click the Extensions icon in the VS Code activity bar

3. **Search for the Extension**
   - In the EXTENSIONS: MARKETPLACE pane, enter `Microsoft 365 Agents Toolkit` in the search box
   - Agents Toolkit will appear in the search results

4. **Install the Extension**
   - Select **Microsoft 365 Agents Toolkit** from the search results
   - On the extension page that appears in the right pane, click **Install**

5. **Verify Installation**
   - After successful installation, the Agents Toolkit icon will appear in the VS Code activity bar

### Method 2: Install via Marketplace

1. Visit the [Visual Studio Code Marketplace - Microsoft 365 Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension)
2. Click **Install** to open VS Code and trigger the installation

---

## Install a Different Release Version

By default, Visual Studio Code automatically keeps Agents Toolkit up-to-date. To install a specific version:

1. Select **Extensions** from the VS Code activity bar

2. Search for `Microsoft 365 Agents Toolkit`

3. Select **Microsoft 365 Agents Toolkit** from the results

4. On the Agents Toolkit page, click the **dropdown arrow** next to **Uninstall**

5. Select **Install Specific Version...** from the dropdown list

6. Select the required version from the list that appears

The selected version will be installed.

---

## Install a Prerelease Version

Agents Toolkit for Visual Studio Code is also available in prerelease versions. To install:

1. Open Visual Studio Code

2. Select **Extensions** from the VS Code activity bar

3. Search for `Microsoft 365 Agents Toolkit`

4. Click the **dropdown arrow** next to **Uninstall**

5. Choose one of the following:
   - If you're already on the **pre-release track**: Select **Install Specific Version...** to see available pre-release versions
   - If you're on the **stable track**: The **Install Specific Version...** option will only show stable versions

> **Note**: The **Install Pre-Release Version** option may not appear depending on the update track of your currently installed Microsoft 365 Agents Toolkit extension. Use **Install Specific Version...** to manually select a version.

---

## Using `@m365agents` Chat Participant

After installing the Agents Toolkit, you get access to the `@m365agents` chat participant in VS Code Copilot Chat. This provides:

- **Scaffolding**: "I want to create a declarative agent"
- **Schema help**: "What's the latest DA manifest schema?"
- **SSO guidance**: "How do I add SSO to my Teams app?"
- **Troubleshooting**: "My Teams app doesn't sideload"

The toolkit also exposes **MCP tools** that Alex can use programmatically:

| Tool                                  | Purpose                                |
| ------------------------------------- | -------------------------------------- |
| `mcp_m365agentstoo_get_knowledge`     | M365 Copilot development knowledge     |
| `mcp_m365agentstoo_get_code_snippets` | Teams AI, Teams JS, botbuilder samples |
| `mcp_m365agentstoo_get_schema`        | App manifest, agent, plugin schemas    |
| `mcp_m365agentstoo_troubleshoot`      | Common M365 development issues         |

---

## Next Steps

After installing Agents Toolkit:

- [Create a new Teams app](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/create-new-project)
- [Explore Microsoft 365 Agents Toolkit features](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/explore-teams-toolkit)
- [Prepare to build apps](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/build-environments)

---

## Additional Resources

### Training

- **Learning Path**: [Build and deploy apps for Microsoft Teams using Teams Toolkit for Visual Studio Code](https://learn.microsoft.com/en-us/training/paths/m365-teams-toolkit-vsc/)

  Microsoft 365 Agents Toolkit (formerly Teams Toolkit) is an extension for Visual Studio Code and Visual Studio 2022. It helps developers create and deploy Teams apps with integrated identity, cloud storage, and other services across Microsoft 365 and Azure. Includes the `@m365agents` chat participant for guided scaffolding and troubleshooting.

### Certification

- **Microsoft 365 Certified: Teams Administrator Associate**

  Demonstrate skills to plan, deploy, configure, and manage Microsoft Teams to focus on efficient and effective collaboration and communication in a Microsoft 365 environment.

  [Learn more about this certification](https://learn.microsoft.com/en-us/credentials/certifications/m365-teams-administrator-associate/)

---

## Related Documentation

| Topic                        | Link                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Agents Toolkit Documentation | [Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/)                            |
| Developer Portal             | [Teams Developer Portal](https://dev.teams.microsoft.com/home)                                                   |
| Marketplace Extension        | [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension) |

---

*Last updated: February 2026*
*Based on Microsoft documentation updated July 22, 2025*
