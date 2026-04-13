/**
 * setupEnvironment.settings.ts - VS Code settings definitions for Alex
 *
 * Extracted from setupEnvironment.ts for easier review and maintenance.
 * Each category groups related settings with an icon and description.
 *
 * To add/remove/modify settings: edit the corresponding category below.
 * The setupEnvironment command reads these at runtime.
 */

// ============================================================================
// ESSENTIAL — Required for full Alex functionality
// ============================================================================

export const ESSENTIAL_SETTINGS: Record<string, unknown> = {
  // Custom instructions location
  "chat.instructionsFilesLocations": {
    ".github/instructions": true,
  },
  // Prompt files location (for .github/prompts)
  "chat.promptFilesLocations": {
    ".github/prompts": true,
  },
  // Enable AGENTS.md files
  "chat.useAgentsMdFile": true,
  // Enable nested AGENTS.md in subfolders
  "chat.useNestedAgentsMdFiles": true,
  // Auto-include copilot-instructions.md
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  // Skills auto-loading location
  "chat.agentSkillsLocations": [".github/skills"],
  // Use Agent Skills standard
  "chat.useAgentSkills": true,
  // Include referenced instructions (instruction chaining)
  "chat.includeReferencedInstructions": true,
  // Custom chat modes location
  "chat.modeFilesLocations": {
    ".github/chatmodes": true,
  },
  // Copilot Memory: cross-session memory storage
  "github.copilot.chat.copilotMemory.enabled": true,
  // Memory tool access in chat
  "github.copilot.chat.tools.memory.enabled": true,
  // Custom agent hooks in workspace
  "chat.useCustomAgentHooks": true,
  // Agent mode: custom agents in chat dropdown
  "chat.agent.enabled": true,
};

// ============================================================================
// RECOMMENDED — Improves the Alex experience
// ============================================================================

export const RECOMMENDED_SETTINGS: Record<string, unknown> = {
  // Thinking style for agents
  "chat.agent.thinkingStyle": "auto",
  // Max agent requests (default 25)
  "chat.agent.maxRequests": 100,
  // Participant detection (helps route to Alex agent)
  "chat.detectParticipant.enabled": true,
  // Locale override
  "github.copilot.chat.localeOverride": "en",
  // Command center in title bar
  "window.commandCenter": true,
  // Agent session history
  "chat.viewSessions.enabled": true,
  // MCP gallery: Model Context Protocol tools
  "chat.mcp.gallery.enabled": true,
  // Request queueing: auto-queue by default
  "chat.requestQueuing.defaultAction": "queue",
  // Search subagent: web search in agent mode
  "github.copilot.chat.searchSubagent.enabled": true,
  // Custom agents in subagents
  "chat.customAgentInSubagent.enabled": true,
  // Explore subagent model: faster for read-only exploration
  "chat.exploreAgent.defaultModel": "claude-sonnet-4",
  // Unified agents bar
  "chat.unifiedAgentsBar.enabled": true,
  // Progress badge
  "chat.viewProgressBadge.enabled": true,
  // Session orientation
  "chat.viewSessions.orientation": "stacked",
  // Show file changes in checkpoints
  "chat.checkpoints.showFileChanges": true,
  // Restore last panel session
  "chat.restoreLastPanelSession": true,
  // MCP auto-start: new and outdated servers
  "chat.mcp.autostart": "newAndOutdated",
  // Code block progress: hide for cleaner output
  "chat.agent.codeBlockProgress": false,
  // NuGet assistance for .NET projects
  "chat.mcp.assisted.nuget.enabled": true,
  // Autopilot: autonomous agent mode
  "chat.autopilot.enabled": true,
  // Agent todo list widget
  "chat.tools.todos.showWidget": true,
  // Default chat mode: always start in agent mode
  "chat.newSession.defaultMode": "agent",
  // Thinking budget: max out for deeper reasoning (default 16000)
  "github.copilot.chat.anthropic.thinking.budgetTokens": 32000,
  // Auto-fix: automatically fix compilation/lint errors after agent edits
  "github.copilot.chat.agent.autoFix": true,
  // Nested subagents: allow subagents to invoke other subagents
  "chat.subagents.allowInvocationsFromSubagents": true,
  // Alex thinking phrases: personality-driven progress messages
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
    "Consulting the architecture...",
  ],
  // Terminal image support: inline via Kitty graphics protocol (VS Code 1.110+)
  "terminal.integrated.enableImages": true,
};

// ============================================================================
// AUTO-APPROVAL — Reduce friction for common operations
// ============================================================================

export const AUTO_APPROVAL_SETTINGS: Record<string, unknown> = {
  // Auto-approve global tools (includes auto-run)
  "chat.tools.global.autoApprove": true,
  // Auto-approve file edit operations
  "chat.tools.edits.autoApprove": true,
  // Terminal command auto-approval patterns (v1.102)
  "chat.tools.terminal.autoApprove": {},
  // Use custom auto-approve rules only (ignore defaults)
  "chat.tools.terminal.ignoreDefaultAutoApproveRules": true,
  // Auto-reply to terminal prompts
  "chat.tools.terminal.autoReplyToPrompts": true,
  // Allow shell history for terminal commands
  "chat.tools.terminal.preventShellHistory": false,
  // URL auto-approval patterns
  "chat.tools.urls.autoApprove": {},
  // Notify when background terminal tasks complete
  "chat.tools.terminal.backgroundNotifications": true,
  // Detach long-running processes from terminal sessions
  "chat.tools.terminal.detachBackgroundProcesses": true,
};

// Note: Mermaid/markdown preview settings are configured via the markdown-mermaid
// skill's "Polish Mermaid Setup" prompt, not here, because they vary by VS Code
// version and installed extensions.

// ============================================================================
// CHAT-CENTRIC — Disable inline completions, all code via Chat/agents
// ============================================================================

export const CHAT_CENTRIC_SETTINGS: Record<string, unknown> = {
  // No inline ghost text — all code authoring via Chat/agents
  "editor.inlineSuggest.enabled": false,
  "github.copilot.editor.enableAutoCompletions": false,
};

// ============================================================================
// FORMATTER RESOLUTION — Prettier formats, ESLint lints, no conflicts
// ============================================================================

export const FORMATTER_SETTINGS: Record<string, unknown> = {
  // Formatting pipeline: Prettier formats, ESLint lints
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "eslint.format.enable": false,
  "prettier.resolveGlobalModules": false,
  // Language-specific formatters (no ambiguity)
  "[markdown]": {
    "editor.defaultFormatter": "yzhang.markdown-all-in-one",
    "editor.wordWrap": "on",
    "editor.quickSuggestions": { comments: "off", strings: "off", other: "off" },
    "files.trimTrailingWhitespace": true,
  },
  "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[json]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[jsonc]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[yaml]": { "editor.defaultFormatter": "redhat.vscode-yaml" },
  "[dockercompose]": { "editor.defaultFormatter": "redhat.vscode-yaml" },
  "[github-actions-workflow]": { "editor.defaultFormatter": "redhat.vscode-yaml" },
  "[python]": { "editor.defaultFormatter": "ms-python.python", "editor.formatOnSave": true },
  // LaTeX safety: don't interfere with Markdown files
  "latex-workshop.latex.autoBuild.run": "onSave",
  "latex-workshop.latex.rootFile.doNotPrompt": true,
};

// ============================================================================
// CROSS-PLATFORM — Platform-safe paths for Windows + macOS
// ============================================================================

export const CROSS_PLATFORM_SETTINGS: Record<string, unknown> = {
  // Cross-platform Python: auto-discover .venv on both platforms
  "python.defaultInterpreterPath": "python",
  // Remove stale absolute paths
  "markdown.styles": [],
};

// ============================================================================
// CATEGORY REGISTRY — Used by the setup wizard UI
// ============================================================================

export interface SettingCategory {
  name: string;
  description: string;
  settings: Record<string, unknown>;
  icon: string;
}

export const SETTING_CATEGORIES: SettingCategory[] = [
  {
    name: "Essential",
    description: "Required for full Alex functionality",
    settings: ESSENTIAL_SETTINGS,
    icon: "\uD83D\uDD34", // 🔴
  },
  {
    name: "Recommended",
    description: "Improves the Alex experience",
    settings: RECOMMENDED_SETTINGS,
    icon: "\uD83D\uDFE1", // 🟡
  },
  {
    name: "Auto-Approval",
    description: "Auto-run tools and file operations for better workflow",
    settings: AUTO_APPROVAL_SETTINGS,
    icon: "\uD83D\uDFE0", // 🟠
  },
  {
    name: "Chat-Centric",
    description: "Disable inline completions — all code via Chat/agents",
    settings: CHAT_CENTRIC_SETTINGS,
    icon: "\uD83C\uDFAF", // 🎯
  },
  {
    name: "Formatters",
    description: "Prettier formats, ESLint lints, YAML uses Red Hat — no conflicts",
    settings: FORMATTER_SETTINGS,
    icon: "\u2696\uFE0F", // ⚖️
  },
  {
    name: "Cross-Platform",
    description: "Platform-safe Python paths and markdown styles (Windows + macOS)",
    settings: CROSS_PLATFORM_SETTINGS,
    icon: "\uD83C\uDF10", // 🌐
  },
];
