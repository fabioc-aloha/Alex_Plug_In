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
 * Persona accent colors for consistent UI theming.
 * Used across welcome view, health dashboard, memory dashboard.
 *
 * NASA R3: Bounded structure - fixed persona set
 */
export const PERSONA_ACCENT_COLORS: Readonly<Record<string, string>> =
  Object.freeze({
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
export const PERSONA_HEX_COLORS: Readonly<Record<string, string>> =
  Object.freeze({
    developer: "#3794ff", // VS Code blue
    academic: "#2aa198", // Teal
    researcher: "#2aa198", // Teal
    "technical-writer": "#89d185", // VS Code green
    architect: "#f0883e", // Orange
    "data-engineer": "#f0883e", // Orange
    devops: "#89d185", // VS Code green
    "content-creator": "#cca700", // VS Code yellow
    "fiction-writer": "#2aa198", // Teal
    "project-manager": "#3794ff", // VS Code blue
    security: "#f14c4c", // VS Code red
    student: "#2aa198", // Teal
    "job-seeker": "#89d185", // VS Code green
    presenter: "#cca700", // VS Code yellow
    "power-user": "#3794ff", // VS Code blue
  });

/**
 * Get persona accent as hex color for Mermaid diagrams.
 *
 * @param personaId - The persona identifier
 * @returns Hex color value (no CSS variables)
 */
export function getPersonaHexColor(
  personaId: string | undefined | null,
): string {
  if (!personaId) {
    return "#2aa198";
  }
  return PERSONA_HEX_COLORS[personaId] ?? "#2aa198";
}
