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
  // Hooks: custom agent hooks for skill/tool loading
  "chat.hooks.enabled": true,
  // Custom agent hooks in workspace
  "chat.useCustomAgentHooks": true,
  // Agent mode: custom agents in chat dropdown
  "chat.agent.enabled": true,
};

// ============================================================================
// RECOMMENDED — Improves the Alex experience
// ============================================================================

export const RECOMMENDED_SETTINGS: Record<string, unknown> = {
  // Thinking tool for agents
  "github.copilot.chat.agent.thinkingTool": true,
  // Max agent requests (default 25)
  "chat.agent.maxRequests": 100,
  // Participant detection
  "chat.detectParticipant.enabled": true,
  // Locale override
  "github.copilot.chat.localeOverride": "en",
  // Command center in title bar
  "chat.commandCenter.enabled": true,
  // Agent session history
  "chat.viewSessions.enabled": true,
  // MCP gallery: Model Context Protocol tools
  "chat.mcp.gallery.enabled": true,
  // Follow-up suggestions
  "github.copilot.chat.followUps": "always",
  // Request queueing: sequential processing
  "chat.requestQueuing.enabled": true,
  // Auto-queue by default
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
  // Agent todo list panel position
  "chat.agent.todoList": { position: "panel" },
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
  // Auto-run tools: reduces manual approval prompts
  "chat.tools.autoRun": true,
  // Auto-approve file system operations
  "chat.tools.fileSystem.autoApprove": true,
  // Auto-approve global tools
  "chat.tools.global.autoApprove": true,
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
};

// Note: Mermaid/markdown preview settings are configured via the markdown-mermaid
// skill's "Polish Mermaid Setup" prompt, not here, because they vary by VS Code
// version and installed extensions.

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
];
