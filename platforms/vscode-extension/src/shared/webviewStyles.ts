/**
 * Shared Webview Styles — Centralized CSS generation for Alex views
 *
 * Purpose: DRY principle - single source of truth for webview styling
 * Used by: welcomeView.ts, healthDashboard.ts, memoryDashboard.ts
 *
 * NASA R4: Functions under 80 lines
 * NASA R6: Module-level constants
 *
 * @module webviewStyles
 * @since 5.9.11
 */

/**
 * Design system tokens used across all views.
 * Extracted to ensure consistency and easy updates.
 */
export const DESIGN_TOKENS = {
  // Spacing Scale (8px base)
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  // Typography Scale (1.18x ratio)
  font: {
    xs: "11px",
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "18px",
  },
  // Elevation/Shadows
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
    md: "0 2px 4px rgba(0, 0, 0, 0.12)",
    lg: "0 4px 8px rgba(0, 0, 0, 0.15)",
  },
  // Touch target (WCAG compliance)
  minTouchTarget: "36px",
} as const;

/**
 * Generate CSS custom properties for design tokens.
 * Injected at the start of each view's <style> block.
 *
 * @param personaAccent - CSS color value for persona theming
 * @returns CSS custom properties string
 */
export function getCssCustomProperties(personaAccent: string): string {
  return `
            --persona-accent: ${personaAccent};
            /* Design System - Spacing Scale (8px base) */
            --spacing-xs: ${DESIGN_TOKENS.spacing.xs};
            --spacing-sm: ${DESIGN_TOKENS.spacing.sm};
            --spacing-md: ${DESIGN_TOKENS.spacing.md};
            --spacing-lg: ${DESIGN_TOKENS.spacing.lg};
            --spacing-xl: ${DESIGN_TOKENS.spacing.xl};
            /* Typography Scale */
            --font-xs: ${DESIGN_TOKENS.font.xs};
            --font-sm: ${DESIGN_TOKENS.font.sm};
            --font-md: ${DESIGN_TOKENS.font.md};
            --font-lg: ${DESIGN_TOKENS.font.lg};
            /* Elevation/Shadows */
            --shadow-sm: ${DESIGN_TOKENS.shadow.sm};
            --shadow-md: ${DESIGN_TOKENS.shadow.md};
            --shadow-lg: ${DESIGN_TOKENS.shadow.lg};`;
}

/**
 * Generate base CSS reset and body styles.
 */
export function getBaseStyles(): string {
  return `
        * {
            box-sizing: border-box;
        }
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-sideBar-background);
            padding: 0;
            margin: 0;
        }
        /* Focus indicators for accessibility */
        button:focus-visible,
        [tabindex]:focus-visible,
        a:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 2px;
        }`;
}

/**
 * Generate action button styles used across views.
 */
export function getActionButtonStyles(): string {
  return `
        .action-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 5px 8px;
            min-height: ${DESIGN_TOKENS.minTouchTarget}; /* WCAG touch target */
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: var(--font-sm);
            text-align: left;
            transition: all 0.1s ease;
            box-shadow: var(--shadow-sm);
        }
        .action-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
            transform: translateX(1px);
        }
        .action-btn.primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
        }
        .action-btn.primary:hover {
            background: var(--vscode-button-hoverBackground);
            transform: translateX(1px);
        }
        .action-icon {
            font-size: var(--font-md);
            width: 27px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            opacity: 0.9;
        }
        .action-icon svg {
            width: 17px;
            height: 17px;
        }
        .action-text {
            flex: 1;
        }`;
}

/**
 * Generate status indicator styles (dots, badges).
 */
export function getStatusIndicatorStyles(): string {
  return `
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
            box-shadow: 0 0 3px currentColor;
            position: relative;
        }
        /* Accessibility: Icon labels for color-blind users */
        .status-dot::after {
            position: absolute;
            font-size: 9px;
            line-height: 9px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .dot-green { background: var(--vscode-charts-green); color: var(--vscode-charts-green); }
        .dot-green::after { content: '✓'; color: white; }
        .dot-yellow { background: var(--vscode-charts-yellow); color: var(--vscode-charts-yellow); }
        .dot-yellow::after { content: '⚠'; color: black; font-weight: bold; }
        .dot-red { background: var(--vscode-charts-red); color: var(--vscode-charts-red); }
        .dot-red::after { content: '✗'; color: white; }`;
}

/**
 * Generate card styles for content sections.
 */
export function getCardStyles(): string {
  return `
        .card {
            background: var(--vscode-editor-background);
            border-radius: 5px;
            padding: 7px;
            border-left: 2px solid var(--persona-accent);
            box-shadow: var(--shadow-sm);
            margin-bottom: 7px;
        }
        .card:hover {
            background: var(--vscode-list-hoverBackground);
        }`;
}

/**
 * Generate section header styles.
 */
export function getSectionStyles(): string {
  return `
        .section {
            margin-bottom: 10px;
        }
        .section-title {
            font-size: var(--font-xs);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 5px;
            opacity: 0.85;
        }
        .section-title.clickable {
            cursor: pointer;
        }
        .section-title.clickable:hover {
            color: var(--vscode-textLink-foreground);
        }`;
}

/**
 * Generate loading and error state styles.
 */
export function getStateStyles(): string {
  return `
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100px;
            color: var(--vscode-descriptionForeground);
        }
        .error {
            color: var(--vscode-errorForeground);
            padding: 10px;
        }`;
}

/**
 * Combine all shared styles into a single CSS string.
 * Use this for quick initialization; prefer granular imports for optimization.
 *
 * @param personaAccent - CSS color value for persona theming
 * @returns Complete CSS string for webview style block
 */
export function getAllSharedStyles(personaAccent: string): string {
  return `
        * {
            box-sizing: border-box;
            ${getCssCustomProperties(personaAccent)}
        }
        ${getBaseStyles()}
        ${getActionButtonStyles()}
        ${getStatusIndicatorStyles()}
        ${getCardStyles()}
        ${getSectionStyles()}
        ${getStateStyles()}`;
}
