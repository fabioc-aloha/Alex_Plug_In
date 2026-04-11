# VS Code Settings — User Configuration

> Exported: 2026-04-11 (final)
> Source: `%APPDATA%\Code\User\settings.json`
> Scope: User-level (no workspace-level overrides)
> Total: 174 keys (11 language overrides + 163 settings)

## Language-Specific Overrides

### Markdown

```jsonc
"[markdown]": {
  "files.encoding": "utf8",
  "editor.wordWrap": "on",
  "editor.quickSuggestions": {
    "comments": "off",
    "strings": "off",
    "other": "off"
  },
  "files.trimTrailingWhitespace": true,
  "editor.defaultFormatter": "yzhang.markdown-all-in-one"
}
```

### JavaScript / TypeScript

```jsonc
"[javascript]": {
  "files.encoding": "utf8",
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[typescript]": {
  "files.encoding": "utf8",
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Docker Compose

```jsonc
"[dockercompose]": {
  "editor.insertSpaces": true,
  "editor.tabSize": 2,
  "editor.autoIndent": "advanced",
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  "editor.defaultFormatter": "redhat.vscode-yaml"
}
```

### GitHub Actions Workflows

```jsonc
"[github-actions-workflow]": {
  "editor.defaultFormatter": "redhat.vscode-yaml"
}
```

### Other Languages

```jsonc
"[plaintext]": { "files.encoding": "utf8" },
"[json]":      { "files.encoding": "utf8", "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[jsonc]":     { "files.encoding": "utf8", "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[python]":    { "files.encoding": "utf8", "editor.defaultFormatter": "ms-python.python", "editor.formatOnSave": true },
"[yaml]":      { "files.encoding": "utf8", "editor.defaultFormatter": "redhat.vscode-yaml" },
"[xml]":       { "files.encoding": "utf8" }
```

## Editor

```jsonc
"editor.fontFamily": "'Cascadia Code', 'Segoe UI Emoji', 'Noto Color Emoji', 'Fira Code', 'Consolas', 'monospace'",
"editor.fontLigatures": true,
"editor.renderControlCharacters": true,
"editor.renderWhitespace": "boundary",
"editor.detectIndentation": true,
"editor.insertSpaces": true,
"editor.tabSize": 4,
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": "explicit"
},
"eslint.format.enable": false,
"editor.bracketPairColorization.enabled": true,
"editor.guides.bracketPairs": true,
"editor.stickyScroll.enabled": true,
"editor.linkedEditing": true,
"editor.cursorSmoothCaretAnimation": "on",
"editor.smoothScrolling": true,
"editor.inlineSuggest.enabled": false,
"github.copilot.editor.enableAutoCompletions": false,
"editor.wordWrap": "on",
"editor.minimap.enabled": false,
"editor.accessibilitySupport": "off",
"editor.unicodeHighlight.nonBasicASCII": false,
"editor.experimental.asyncTokenization": false,
"editor.experimentalGpuAcceleration": "on",
"editor.inlineSuggest.experimental.emptyResponseInformation": false,
"latex-workshop.latex.autoBuild.run": "onSave",
"latex-workshop.latex.rootFile.doNotPrompt": true
```

### Unicode Allowed Characters

Emojis and box-drawing characters used in cognitive architecture docs.

```jsonc
"editor.unicodeHighlight.allowedCharacters": {
  "→": true, "⭐": true, "🎯": true, "🚀": true, "🧠": true,
  "📊": true, "🏢": true, "🛡️": true, "🔄": true, "🏆": true,
  "📋": true, "📚": true, "✅": true, "⚡": true, "🔧": true,
  "📝": true, "🎨": true, "💡": true, "🔍": true, "🌟": true,
  "💎": true, "🚧": true, "⚠️": true, "❌": true, "❗": true,
  "├": true, "│": true, "└": true, "┌": true, "┐": true,
  "┘": true, "─": true, "═": true, "║": true, "╔": true,
  "╗": true, "╚": true, "╝": true
}
```

## Files

```jsonc
"files.encoding": "utf8",
"files.autoGuessEncoding": false,
"files.defaultLanguage": "markdown",
"files.insertFinalNewline": true,
"files.trimFinalNewlines": true,
"files.eol": "\n",
"files.autoSave": "afterDelay",
"files.autoSaveDelay": 1000,
"files.autoSaveWorkspaceFilesOnly": true,
"files.saveConflictResolution": "overwriteFileOnDisk"
```

## Workbench

```jsonc
"workbench.editorAssociations": {
  "*.copilotmd": "vscode.markdown.preview.editor",
  "*.csv": "default",
  "*.xlsx": "default",
  "*.md": "vscode.markdown.preview.editor"
},
"workbench.layoutControl.enabled": false,
"workbench.startupEditor": "readme",
"workbench.list.smoothScrolling": true,
"workbench.editor.autoLockGroups": {
  "workbench.editor.chatSession": true,
  "workbench.editorinputs.searchEditorInput": true,
  "jupyter-notebook": true,
  "fabric-api-notebook": true,
  "fabric-spark-notebook": true,
  "powerbi-notebook": true,
  "copilot-chat-replay": true,
  "workbench.editors.gettingStartedInput": true,
  "imagePreview.previewEditor": true,
  "vscode.audioPreview": true,
  "vscode.videoPreview": true,
  "jsProfileVisualizer.cpuprofile.table": true,
  "mssql.executionPlanView": true,
  "pdf.preview": true,
  "workbench.input.interactive": true,
  "mainThreadWebview-markdown.preview": true,
  "default": true
},
"workbench.editor.highlightModifiedTabs": true,
"workbench.editor.alwaysShowEditorActions": true,
"workbench.editor.tabSizing": "fixed",
"workbench.editor.wrapTabs": true
```

## Explorer & Search

```jsonc
"explorer.confirmDelete": false,
"explorer.confirmDragAndDrop": false,
"breadcrumbs.enabled": true,
"search.followSymlinks": false,
"extensions.autoUpdate": true,
"extensions.ignoreRecommendations": true
```

## Terminal

```jsonc
"terminal.integrated.fontFamily": "'Cascadia Code', 'Segoe UI Emoji', 'Consolas'",
"terminal.integrated.defaultProfile.windows": "PowerShell",
"terminal.integrated.smoothScrolling": true,
"terminal.integrated.enableImages": true
```

## Git

```jsonc
"git.autofetch": true,
"git.confirmSync": false,
"git.enableSmartCommit": true,
"git.openRepositoryInParentFolders": "never"
```

## Markdown Preview

```jsonc
"markdown.preview.fontFamily": "'Segoe UI', 'Segoe UI Emoji', -apple-system, BlinkMacSystemFont, sans-serif",
"markdown.preview.fontSize": 12,
"markdown.preview.lineHeight": 1.4,
"markdown.preview.typographer": true,
"markdown.extension.preview.autoShowPreviewToSide": true,
"markdown.styles": []
```

## Markdown Mermaid

```jsonc
"markdown-mermaid.lightModeTheme": "neutral",
"markdown-mermaid.darkModeTheme": "dark",
"markdown-mermaid.controls.show": "onHoverOrFocus",
"markdown-mermaid.mouseNavigation.enabled": "alt",
"markdown-mermaid.languages": ["mermaid"],
"markdown-mermaid.maxTextSize": 50000,
"markdown-mermaid.resizable": true
```

## GitHub Copilot

```jsonc
"github.copilot.enable": {
  "*.png": false
},
"github.copilot.chat.localeOverride": "en",
"github.copilot.chat.followUps": "always",
"github.copilot.chat.agent.thinkingTool": true,
"github.copilot.chat.tools.memory.enabled": true,
"github.copilot.chat.copilotMemory.enabled": true,
"github.copilot.chat.searchSubagent.enabled": true,
"github.copilot.chat.codeGeneration.useInstructionFiles": true,
"github.copilot.chat.codeGeneration.instructions": [
  "Use TypeScript for all new code",
  "Prefer async/await over promises",
  "Add JSDoc comments for public functions"
]
```

## Chat & Agent

```jsonc
"chat.agent.enabled": true,
"chat.agent.maxRequests": 500,
"chat.agent.codeBlockProgress": false,
"chat.agent.todoList": { "position": "panel" },
"chat.agent.thinking.phrases": [
  "Meditating on this...",
  "Consulting synapses...",
  "Traversing knowledge graph...",
  "Consolidating memory...",
  "Activating neural pathways...",
  "Searching episodic memory...",
  "Synthesizing knowledge...",
  "Connecting the dots...",
  "Entering focused state...",
  "Examining patterns...",
  "Following the thread...",
  "Deep in thought...",
  "Warming up neurons...",
  "Running cognitive analysis...",
  "Consulting the architecture..."
],
"chat.agent.thinking.terminalTools": false,
"chat.autopilot.enabled": true,
"chat.commandCenter.enabled": true,
"chat.detectParticipant.enabled": true,
"chat.editor.wordWrap": "on",
"chat.checkpoints.showFileChanges": true,
"chat.customAgentInSubagent.enabled": true,
"chat.exploreAgent.defaultModel": "claude-sonnet-4",
"chat.hooks.enabled": true,
"chat.includeReferencedInstructions": true,
"chat.requestQueuing.enabled": true,
"chat.requestQueuing.defaultAction": "queue",
"chat.restoreLastPanelSession": true,
"chat.tips.enabled": false,
"chat.unifiedAgentsBar.enabled": true,
"chat.useAgentsMdFile": true,
"chat.useAgentSkills": true,
"chat.useCustomAgentHooks": true,
"chat.useNestedAgentsMdFiles": true,
"chat.viewProgressBadge.enabled": true,
"chat.viewSessions.enabled": true,
"chat.viewSessions.orientation": "stacked"
```

### Chat File Locations

```jsonc
"chat.instructionsFilesLocations": { ".github/instructions": true },
"chat.promptFilesLocations": { ".github/prompts": true },
"chat.agentSkillsLocations": [".github/skills"],
"chat.modeFilesLocations": { ".github/chatmodes": true }
```

### Chat Tools

```jsonc
"chat.tools.autoRun": true,
"chat.tools.global.autoApprove": true,
"chat.tools.fileSystem.autoApprove": true,
"chat.tools.urls.autoApprove": {},
"chat.tools.terminal.autoApprove": {},
"chat.tools.terminal.preventShellHistory": false,
"chat.tools.terminal.enableAutoApprove": false,
"chat.tools.terminal.autoApproveWorkspaceNpmScripts": false,
"chat.tools.terminal.enforceTimeoutFromModel": false,
"chat.tools.terminal.simpleCollapsible": false,
"chat.tools.terminal.ignoreDefaultAutoApproveRules": true,
"chat.tools.terminal.autoReplyToPrompts": true
```

### Chat MCP

```jsonc
"chat.mcp.autostart": "newAndOutdated",
"chat.mcp.gallery.enabled": true,
"chat.mcp.assisted.nuget.enabled": true,
"chat.mcp.serverSampling": {
  "Azure MCP Server Provider: Azure MCP": {
    "allowedDuringChat": true
  }
}
```

## Python

```jsonc
"python.defaultInterpreterPath": "python",
"python.analysis.typeCheckingMode": "standard"
```

## Jupyter

```jsonc
"jupyter.jupyterLaunchTimeout": 600000,
"notebook.output.textLineLimit": 60,
"ipynb.experimental.serialization": false
```

## MSSQL

```jsonc
"mssql.enableRichExperiences": true,
"mssql.saveAsCsv.encoding": "UTF-8",
"mssql.connectionGroups": [
  { "name": "ROOT", "id": "ROOT" }
],
// Connection profiles stored in settings (tokens redacted)
"mssql.connections": [
  {
    "authenticationType": "AzureMFA",
    "server": "cxmidl.database.windows.net",
    "database": "Orchestration",
    "encrypt": "Mandatory"
  },
  {
    "authenticationType": "AzureMFA",
    "server": "cpestaging.database.windows.net",
    "database": "CPE_Predictor",
    "encrypt": "Mandatory"
  }
]
```

## Azure

```jsonc
"@azure.argTenant": "72f988bf-86f1-41af-91ab-2d7cd011db47",
"azureResourceGroups.selectedSubscriptions": [
  "72f988bf-86f1-41af-91ab-2d7cd011db47/f6ab5f6d-606a-4256-aba7-1feeeb53784f"
],
"azureFunctions.showProjectWarning": false,
"azureFunctions.showCoreToolsWarning": false
```

## Alex Extension

```jsonc
"alex.personalityMode": "auto",
"alex.enterprise.enabled": false,
"alex.enterprise.requireAuth": true,
"alex.enterprise.auth.clientId": "f79a16ff-2794-4f6d-a2b4-f4c87d44cf30",
"alex.enterprise.auth.tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
"alex.enterprise.audit.enabled": false,
"alex.enterprise.audit.consoleLogging": true,
"alex.enterprise.audit.remoteLogging": true,
"alex.enterprise.graph.enabled": false,
"alex.enterprise.graph.calendarEnabled": false,
"alex.enterprise.graph.mailEnabled": false,
"alex.enterprise.graph.presenceEnabled": false,
"alex.enterprise.graph.peopleEnabled": false
```

## Privacy & Security

```jsonc
"telemetry.telemetryLevel": "off",
"security.workspace.trust.untrustedFiles": "open",
"task.allowAutomaticTasks": "on"
```

## Emmet

```jsonc
"emmet.includeLanguages": {
  "markdown": "html"
}
```

## Media

```jsonc
"mediaPreview.video.loop": true,
"imageCarousel.chat.enabled": false,
"imageCarousel.explorerContextMenu.enabled": false
```

---

> **Note:** Sensitive values (API keys, passwords, connection tokens, account IDs) have been redacted.
> The raw `settings.json` is at `%APPDATA%\Code\User\settings.json`.
