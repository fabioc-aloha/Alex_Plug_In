/**
 * sharedStyles.foundation.ts - Design tokens, header, status grid, and context styles
 *
 * Part of sharedStyles split. Returns CSS fragment for the composer.
 */

/** Reset, header/hero, status grid, context cards, and cognitive state styles */
export function getFoundationStyles(): string {
  return `
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
      }
      .container {
          padding: 8px 12px;
      }
      /* CorreaX banner-style header — accent bar + ghost watermark + series label */
      .header {
          position: relative;
          overflow: hidden;
          background: var(--vscode-editor-widget-background, var(--vscode-sideBar-background));
          border-bottom: 1px solid var(--vscode-panel-border, var(--vscode-widget-border));
          padding: 12px 12px 12px 16px;
          margin-bottom: 8px;
      }
      .header-accent-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--persona-accent, var(--vscode-charts-blue));
      }
      .header-watermark {
          position: absolute;
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 52px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.04);
          pointer-events: none;
          user-select: none;
          line-height: 1;
      }
      .header-series {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--persona-accent, var(--vscode-charts-blue));
          opacity: 0.6;
          margin-bottom: 2px;
      }
      .header-main {
          display: flex;
          align-items: center;
          gap: 8px;
      }
      .header-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.12));
          cursor: pointer;
          transition: transform 0.12s ease;
      }
      .header-icon:hover {
          transform: scale(1.08);
      }
      .hero-text-box {
          text-align: center;
          padding: 12px 16px;
          margin-bottom: 8px;
          position: relative;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
      }
      .hero-north-star {
          font-size: 12px;
          color: var(--vscode-descriptionForeground);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.12s ease;
      }
      .hero-north-star:hover {
          background: var(--vscode-list-hoverBackground);
      }
      .hero-objective {
          font-size: 11px;
          color: var(--vscode-descriptionForeground);
          margin-top: 4px;
          font-style: italic;
          opacity: 0.8;
      }
      .header-icon-wrapper {
          position: relative;
          flex-shrink: 0;
      }
      .easter-egg-badge {
          position: absolute;
          bottom: -4px;
          right: -6px;
          font-size: 16px;
          line-height: 1;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
          animation: egg-bounce 2s ease-in-out infinite;
          cursor: default;
          z-index: 1;
      }
      @keyframes egg-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
      }
      .header-title {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.2px;
      }
      .header-persona {
          font-size: 11px;
          color: var(--vscode-foreground);
          background: color-mix(in srgb, var(--persona-accent) 15%, transparent);
          border: 1px solid color-mix(in srgb, var(--persona-accent) 30%, transparent);
          padding: 4px 8px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.12s ease;
      }
      .header-persona:hover {
          background: color-mix(in srgb, var(--persona-accent) 25%, transparent);
      }
      .header-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          flex: 1;
      }
      .project-name {
          text-align: center;
          font-size: var(--font-sm);
          font-weight: 500;
          color: var(--vscode-descriptionForeground);
          margin: 4px 0 8px;
          padding: 4px 8px;
          opacity: 0.8;
      }
      .refresh-btn {
          margin-left: auto;
          background: none;
          border: none;
          color: var(--vscode-foreground);
          cursor: pointer;
          opacity: 0.4;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.12s ease;
      }
      .refresh-btn:hover {
          opacity: 1;
          background: var(--vscode-toolbar-hoverBackground);
      }
      
      .section {
          margin-bottom: 12px;
      }
      .section-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--vscode-descriptionForeground);
          margin-bottom: 4px;
          opacity: 0.6;
      }
      
      .status-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
      }
      .status-item {
          background: var(--vscode-editor-background);
          border-radius: 4px;
          padding: 8px;
          border-left: 2px solid transparent;
          transition: all 0.12s ease;
      }
      .status-item:hover {
          border-left-color: var(--vscode-focusBorder);
          background: var(--vscode-list-hoverBackground);
      }
      .status-item.status-good {
          border-left-color: var(--vscode-charts-green);
      }
      .status-item.status-warn {
          border-left-color: var(--vscode-charts-yellow);
      }
      .status-label {
          font-size: var(--font-xs);
          color: var(--vscode-descriptionForeground);
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
      }
      .status-value {
          font-size: var(--font-sm);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
      }
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
          font-size: 11px;
          line-height: 11px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
      }
      .dot-green { background: var(--vscode-charts-green); color: var(--vscode-charts-green); }
      .dot-green::after { content: '✓'; color: white; }
      .dot-yellow { background: var(--vscode-charts-yellow); color: var(--vscode-charts-yellow); }
      .dot-yellow::after { content: '⚠'; color: black; font-weight: bold; }
      .dot-red { background: var(--vscode-charts-red); color: var(--vscode-charts-red); }
      .dot-red::after { content: '✗'; color: white; }
      .status-num {
          font-weight: 600;
          font-size: var(--font-md);
          color: var(--vscode-foreground);
          line-height: 1;
      }
      .status-unit {
          font-size: var(--font-xs);
          color: var(--vscode-descriptionForeground);
          font-weight: normal;
      }
      .status-completed {
          font-size: var(--font-xs);
          color: var(--vscode-charts-green);
          font-weight: 500;
      }
      .context-card {
          background: var(--vscode-editor-background);
          border-radius: 6px;
          padding: 8px;
          border-left: 2px solid var(--persona-accent);
      }
      .context-objective {
          font-size: var(--font-sm);
          font-weight: 500;
          margin-bottom: 4px;
          padding: 4px 8px;
          background: color-mix(in srgb, var(--persona-accent) 8%, transparent);
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.12s ease;
          display: flex;
          align-items: center;
          gap: 8px;
      }
      .context-objective:hover {
          background: color-mix(in srgb, var(--persona-accent) 15%, transparent);
      }
      .context-objective::before {
          content: '🎯';
          font-size: 14px;
      }
      .trifecta-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
      }
      .trifecta-tag {
          font-size: var(--font-xs);
          padding: 2px var(--spacing-sm);
          border-radius: 12px;
          background: color-mix(in srgb, var(--persona-accent) 12%, var(--vscode-badge-background));
          color: var(--vscode-foreground);
          cursor: pointer;
          transition: all 0.12s ease;
          border: 1px solid color-mix(in srgb, var(--persona-accent) 25%, transparent);
      }
      .trifecta-tag:hover {
          background: color-mix(in srgb, var(--persona-accent) 25%, var(--vscode-badge-background));
          transform: translateY(-1px);
      }
      .context-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
      }
      .context-badge {
          font-size: var(--font-xs);
          padding: 1px 8px;
          border-radius: 8px;
          background: var(--vscode-badge-background);
          color: var(--vscode-badge-foreground);
          opacity: 0.8;
      }
      .context-badge.accent {
          background: color-mix(in srgb, var(--persona-accent) 20%, transparent);
          color: var(--vscode-foreground);
          font-weight: 500;
      }
      .context-badge.stale {
          background: color-mix(in srgb, var(--vscode-charts-yellow) 25%, transparent);
          color: var(--vscode-foreground);
          cursor: pointer;
      }
      .context-badge[data-cmd] {
          cursor: pointer;
          transition: opacity 0.12s ease;
      }
      .context-badge[data-cmd]:hover {
          opacity: 1;
      }
      
      
      .action-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
      }
      .action-group-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--vscode-descriptionForeground);
          margin-top: 8px;
          margin-bottom: 2px;
          padding-left: 2px;
          opacity: 0.6;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          user-select: none;
      }
      .action-group-label:first-child {
          margin-top: 0;
      }
      .action-group-label .collapse-chevron {
          font-size: 11px;
          transition: transform 0.12s ease;
          display: inline-block;
      }
      .action-group-label.collapsed .collapse-chevron {
          transform: rotate(-90deg);
      }
      .action-group-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
          transition: max-height 0.2s ease;
      }
      .action-group-content.collapsed {
          display: none;
      }
      /* Cognitive State Card (7.18) */
      .cognitive-state-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          margin-bottom: 8px;
      }
      .cognitive-state-icon { font-size: 24px; flex-shrink: 0; }
      .cognitive-state-detail { flex: 1; }
      .cognitive-state-label { font-size: 12px; font-weight: 600; }
      .cognitive-state-mode { font-size: 11px; opacity: 0.6; }

      /* Mission Profile Bar (7.40) */
      .mission-profile-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 8px;
      }
      .mission-profile-btn {
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 12px;
          background: var(--vscode-editor-background);
          color: var(--vscode-foreground);
          opacity: 0.7;
          transition: opacity 0.12s, background 0.12s, border-color 0.12s;
      }
      .mission-profile-btn:hover { opacity: 1; }
      .mission-profile-btn.active {
          opacity: 1;
          background: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          border-color: var(--vscode-button-background);
          font-weight: 600;
      }

      /* Memory Modality Cards (7.37) — removed: only used in dead mindTabHtml.ts */
  `;
}
