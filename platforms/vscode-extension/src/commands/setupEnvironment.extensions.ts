/**
 * setupEnvironment.extensions.ts - Extension recommendations for Alex
 *
 * Extracted from setupEnvironment.ts for easier review and maintenance.
 * Each entry describes a VS Code extension that Alex works best with.
 *
 * General-purpose recommendations for any developer (not project-specific).
 * Platform field enables Windows/macOS-aware install flows.
 */

export interface RecommendedExtension {
  id: string;
  name: string;
  /** Why this extension matters */
  purpose: string;
  /** Cognitive level unlocked by this extension */
  unlocksLevel: number;
  /** Is Alex usable without it? */
  required: boolean;
  /** Platform restriction: "windows" | "macos" | "both" */
  platform?: "windows" | "macos" | "both";
  /** Category for grouping in the UI */
  category?: "core" | "markdown" | "python" | "azure" | "data" | "quality" | "mobile" | "shell";
}

export interface UninstallableExtension {
  id: string;
  name: string;
  reason: string;
}

/**
 * Extensions that Alex works best with.
 * Ordered by importance: required first, then nice-to-have.
 * General-purpose — not tied to any specific project.
 */
export const RECOMMENDED_EXTENSIONS: RecommendedExtension[] = [
  // ── Core (every workspace) ────────────────────────────────────────
  // Note: github.copilot is built into VS Code — no separate extension needed
  {
    id: "github.copilot-chat",
    name: "GitHub Copilot Chat",
    purpose: "Chat interface, agent mode, @alex participant, slash commands",
    unlocksLevel: 2,
    required: false,
    category: "core",
  },
  {
    id: "dbaeumer.vscode-eslint",
    name: "ESLint",
    purpose: "Diagnostics for agents — agents read lint errors to self-correct",
    unlocksLevel: 0,
    required: false,
    category: "quality",
  },
  {
    id: "ms-vscode.powershell",
    name: "PowerShell",
    purpose: "PowerShell language support for build and release scripts",
    unlocksLevel: 0,
    required: false,
    category: "core",
  },
  {
    id: "mikestead.dotenv",
    name: "DotENV",
    purpose: ".env syntax highlighting for API keys and tokens",
    unlocksLevel: 0,
    required: false,
    category: "core",
  },
  {
    id: "redhat.vscode-yaml",
    name: "YAML",
    purpose: "YAML schema validation and IntelliSense for config files",
    unlocksLevel: 0,
    required: false,
    category: "core",
  },

  // ── Markdown & Documentation ──────────────────────────────────────
  {
    id: "bierner.markdown-mermaid",
    name: "Markdown Preview Mermaid",
    purpose: "Mermaid diagram rendering in documentation previews",
    unlocksLevel: 0,
    required: false,
    category: "markdown",
  },
  {
    id: "yzhang.markdown-all-in-one",
    name: "Markdown All in One",
    purpose: "Markdown editing — TOC, formatting, keyboard shortcuts",
    unlocksLevel: 0,
    required: false,
    category: "markdown",
  },
  {
    id: "davidanson.vscode-markdownlint",
    name: "MarkdownLint",
    purpose: "Markdown style enforcement and linting",
    unlocksLevel: 0,
    required: false,
    category: "markdown",
  },

  // ── Python & Data Science ─────────────────────────────────────────
  {
    id: "ms-python.python",
    name: "Python",
    purpose: "Python language support, IntelliSense, debugging",
    unlocksLevel: 0,
    required: false,
    category: "python",
  },
  {
    id: "ms-python.vscode-pylance",
    name: "Pylance",
    purpose: "Python language server for rich type checking",
    unlocksLevel: 0,
    required: false,
    category: "python",
  },
  {
    id: "ms-toolsai.jupyter",
    name: "Jupyter",
    purpose: "Jupyter notebook support for data science workflows",
    unlocksLevel: 0,
    required: false,
    category: "data",
  },

  // ── Azure & Cloud ─────────────────────────────────────────────────
  {
    id: "ms-azuretools.vscode-azure-mcp-server",
    name: "Azure MCP Server",
    purpose: "60+ Azure resource tools via Model Context Protocol",
    unlocksLevel: 0,
    required: false,
    category: "azure",
  },
  {
    id: "ms-azuretools.vscode-bicep",
    name: "Bicep",
    purpose: "Azure Infrastructure-as-Code language support",
    unlocksLevel: 0,
    required: false,
    category: "azure",
  },
  {
    id: "ms-azuretools.vscode-docker",
    name: "Docker",
    purpose: "Dockerfile syntax, compose, and container management",
    unlocksLevel: 0,
    required: false,
    category: "azure",
  },

  // ── Shell (macOS) ─────────────────────────────────────────────────
  {
    id: "timonwong.shellcheck",
    name: "ShellCheck",
    purpose: "Shell script linting for bash/zsh scripts",
    unlocksLevel: 0,
    required: false,
    platform: "macos",
    category: "shell",
  },
];

/**
 * Extensions that can be safely removed — no active use detected.
 * These are commonly installed but unused or superseded.
 */
export const UNINSTALLABLE_EXTENSIONS: UninstallableExtension[] = [
  {
    id: "ms-vscode.vscode-node-azure-pack",
    name: "Node Azure Pack",
    reason: "Meta-pack — individual Azure extensions are already installed",
  },
  {
    id: "vitest.explorer",
    name: "Vitest Explorer",
    reason: "Remove if not using Vitest (most projects use Mocha or Jest)",
  },
  {
    id: "ms-vscode.ts-file-path-support",
    name: "TS File Path Support",
    reason: "VS Code has built-in path completion for TypeScript",
  },
];
