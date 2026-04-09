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
