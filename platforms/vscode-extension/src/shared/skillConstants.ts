/**
 * Skill Name Constants — Centralized mapping for display names
 *
 * Purpose: DRY principle - single source of truth for skill display names
 * Used by: welcomeView.ts, skill recommendations, chat participant
 *
 * @module skillConstants
 * @since 5.9.11
 */

/**
 * Maps skill IDs to human-readable display names.
 * Updates here propagate to all UI components.
 *
 * NASA R3: Bounded structure - fixed key set
 * NASA R6: Module-level const - smallest appropriate scope
 */
export const SKILL_DISPLAY_NAMES: Readonly<Record<string, string>> = Object.freeze({
  // Cognitive Core
  "brain-qa": "Brain QA",
  "dream-state": "Dream State",
  "meditation": "Meditation",
  "self-actualization": "Self-Actualize",

  // Development
  "code-quality": "Code Quality",
  "code-review": "Code Review",
  "testing-strategies": "Testing",
  "root-cause-analysis": "Root Cause",
  "incident-response": "Security",

  // Architecture
  "architecture-health": "Architecture",
  "vscode-extension-patterns": "VS Code Patterns",
  "mcp-development": "MCP Dev",
  "infrastructure-as-code": "IaC",

  // Research & Learning
  "research-first-development": "Research First",
  "bootstrap-learning": "Learning",
  "deep-thinking": "Deep Thinking",
  "knowledge-synthesis": "Knowledge",
  "research-project-scaffold": "Research Setup",

  // Documentation & Diagrams
  "api-documentation": "API Docs",
  "markdown-mermaid": "Diagrams",
  "md-to-word": "MD to Word",

  // Presentations
  "gamma-presentations": "Presentations",
  "slide-design": "Slide Design",

  // Management
  "scope-management": "Scope Mgmt",
  "project-management": "PM Dashboard",
  "release-management": "Releases",
  "release-process": "Releases",

  // Heir Management
  "master-heir-management": "Heir Mgmt",
  "heir-curation": "Heir Curation",
  "heir-sync-management": "Heir Sync",

  // Brand & Assets
  "brand-asset-management": "Brand Assets",
  "svg-graphics": "SVG Graphics",
  "ai-generated-readme-banners": "AI Banners",

  // Platform-Specific
  "microsoft-fabric": "Data Fabric",
  "microsoft-graph-api": "Graph API",
  "teams-app-patterns": "Teams Apps",
  "m365-agent-debugging": "M365 Debug",
  "azure-deployment-operations": "Azure Deploy",

  // Creative
  "creative-writing": "Creative Writing",
  "book-publishing": "Book Publishing",
  "text-to-speech": "Text to Speech",

  // Learning & Career
  "learning-psychology": "Learning",
  "skill-development": "Skill Dev",

  // Game & Design
  "game-design": "Game Design",
  "ui-ux-design": "UI/UX",

  // Operations
  "git-workflow": "Git Workflows",
  "localization": "Localization",
  "secrets-management": "Secrets",
  "distribution-security": "Security",

  // Meta
  "north-star": "North Star",
  "global-knowledge": "Global Knowledge",
  "persona-detection": "Personas",
});

/**
 * Get display name for a skill ID with fallback formatting.
 *
 * @param skillId - The skill identifier (kebab-case)
 * @returns Human-readable display name
 *
 * @example
 * getSkillDisplayName('code-review') // "Code Review"
 * getSkillDisplayName('unknown-skill') // "Unknown Skill" (formatted)
 */
export function getSkillDisplayName(skillId: string): string {
  const mapped = SKILL_DISPLAY_NAMES[skillId];
  if (mapped) {
    return mapped;
  }

  // Fallback: Convert kebab-case to Title Case
  return skillId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Persona accent colors for consistent UI theming.
 * Used across welcome view, health dashboard, memory dashboard.
 *
 * NASA R3: Bounded structure - fixed persona set
 */
export const PERSONA_ACCENT_COLORS: Readonly<Record<string, string>> = Object.freeze({
  developer: "var(--vscode-charts-blue)",
  academic: "#2aa198",
  researcher: "#2aa198",
  "technical-writer": "var(--vscode-charts-green)",
  architect: "var(--vscode-charts-orange, #f0883e)",
  "data-engineer": "var(--vscode-charts-orange, #f0883e)",
  devops: "var(--vscode-charts-green)",
  "content-creator": "var(--vscode-charts-yellow)",
  "fiction-writer": "#2aa198",
  "project-manager": "var(--vscode-charts-blue)",
  security: "var(--vscode-charts-red)",
  student: "#2aa198",
  "job-seeker": "var(--vscode-charts-green)",
  presenter: "var(--vscode-charts-yellow)",
  "power-user": "var(--vscode-charts-blue)",
});

/**
 * Get persona accent color with fallback.
 *
 * @param personaId - The persona identifier
 * @returns CSS color value
 */
export function getPersonaAccent(personaId: string | undefined | null): string {
  if (!personaId) {
    return "var(--vscode-charts-blue)";
  }
  return PERSONA_ACCENT_COLORS[personaId] ?? "var(--vscode-charts-blue)";
}

/**
 * Persona accent colors as hex values for Mermaid diagram compatibility.
 * Use when CSS variables are not supported (e.g., Mermaid themes).
 *
 * NASA R3: Bounded structure - fixed persona set
 */
export const PERSONA_HEX_COLORS: Readonly<Record<string, string>> = Object.freeze({
  developer: "#3794ff",      // VS Code blue
  academic: "#2aa198",       // Teal
  researcher: "#2aa198",     // Teal
  "technical-writer": "#89d185", // VS Code green
  architect: "#f0883e",      // Orange
  "data-engineer": "#f0883e",  // Orange
  devops: "#89d185",         // VS Code green
  "content-creator": "#cca700", // VS Code yellow
  "fiction-writer": "#2aa198", // Teal
  "project-manager": "#3794ff", // VS Code blue
  security: "#f14c4c",       // VS Code red
  student: "#2aa198",        // Teal
  "job-seeker": "#89d185",   // VS Code green
  presenter: "#cca700",      // VS Code yellow
  "power-user": "#3794ff",   // VS Code blue
});

/**
 * Get persona accent as hex color for Mermaid diagrams.
 *
 * @param personaId - The persona identifier
 * @returns Hex color value (no CSS variables)
 */
export function getPersonaHexColor(personaId: string | undefined | null): string {
  if (!personaId) {
    return "#2aa198";
  }
  return PERSONA_HEX_COLORS[personaId] ?? "#2aa198";
}
