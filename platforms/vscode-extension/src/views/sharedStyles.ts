/**
 * sharedStyles.ts - Shared CSS for the Welcome sidebar webview
 *
 * Extracted from welcomeViewHtml.ts (P5A optimization).
 * Split into domain modules: foundation (tokens/header/status), actions (buttons/nudges/features),
 * and tabs (tab bar/agents/skills/mind/widgets).
 */

import { getFoundationStyles } from './sharedStyles.foundation';
import { getActionStyles } from './sharedStyles.actions';
import { getTabStyles } from './sharedStyles.tabs';

/**
 * Returns the shared CSS for the Welcome sidebar view.
 * @param personaAccent - The persona accent color (e.g., '#6366f1')
 */
export function getSharedStyles(personaAccent: string): string {
  // Validate color to prevent CSS injection
  const safeAccent = /^#[0-9a-fA-F]{3,8}$/.test(personaAccent) ? personaAccent : '#6366f1';
  return `
      * {
          box-sizing: border-box;
          --persona-accent: ${safeAccent};
          /* Design System - Spacing Scale (8px base) */
          --spacing-xs: 4px;
          --spacing-sm: 8px;
          --spacing-md: 16px;
          --spacing-lg: 24px;
          --spacing-xl: 32px;
          /* Typography Scale (1.18x for better readability) */
          --font-xs: 13px;
          --font-sm: 14px;
          --font-md: 16px;
          --font-lg: 18px;
          /* Elevation/Shadows */
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.12);
          --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
          /* Transition Durations (3-tier system) */
          --transition-fast: 0.12s;
          --transition-normal: 0.2s;
          --transition-slow: 0.3s;
      }
  ` + getFoundationStyles() + getActionStyles() + getTabStyles();
}
