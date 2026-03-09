/**
 * sharedStyles.ts - Shared CSS for the Welcome sidebar webview
 *
 * Extracted from welcomeViewHtml.ts (P5A optimization).
 * Contains the full design system, component styles, and tab-specific styles.
 */

/**
 * Returns the shared CSS for the Welcome sidebar view.
 * @param personaAccent - The persona accent color (e.g., '#6366f1')
 */
export function getSharedStyles(personaAccent: string): string {
  return `
      * {
          box-sizing: border-box;
          --persona-accent: ${personaAccent};
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
      }
      .container {
          padding: 6px 10px;
      }
      /* CorreaX banner-style header — accent bar + ghost watermark + series label */
      .header {
          position: relative;
          overflow: hidden;
          background: var(--vscode-editor-widget-background, var(--vscode-sideBar-background));
          border-bottom: 1px solid var(--vscode-panel-border, var(--vscode-widget-border));
          padding: 10px 10px 10px 14px;
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
          opacity: 0.65;
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
          transition: transform 0.15s ease;
      }
      .header-icon:hover {
          transform: scale(1.08);
      }
      .hero-text-box {
          text-align: center;
          padding: 12px 14px;
          margin-bottom: 8px;
          position: relative;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
      }
      .hero-hook {
          font-size: 15px;
          font-weight: 600;
          color: var(--vscode-foreground);
          margin-bottom: 6px;
      }
      .hero-hook strong {
          color: var(--persona-accent);
      }
      .hero-north-star {
          font-size: 12px;
          color: var(--vscode-descriptionForeground);
          cursor: pointer;
          padding: 3px 6px;
          border-radius: 4px;
          transition: background 0.15s ease;
      }
      .hero-north-star:hover {
          background: var(--vscode-list-hoverBackground);
      }
      .hero-objective {
          font-size: 11px;
          color: var(--vscode-descriptionForeground);
          margin-top: 4px;
          font-style: italic;
          opacity: 0.85;
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
          transition: all 0.15s ease;
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
          opacity: 0.85;
      }
      .refresh-btn {
          margin-left: auto;
          background: none;
          border: none;
          color: var(--vscode-foreground);
          cursor: pointer;
          opacity: 0.5;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.15s ease;
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
          letter-spacing: 0.8px;
          color: var(--vscode-descriptionForeground);
          margin-bottom: 4px;
          opacity: 0.65;
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
          border-radius: 5px;
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
          border-radius: 10px;
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
      
      .session-card {
          background: var(--vscode-editor-background);
          border-radius: 5px;
          padding: 8px;
          margin-bottom: 8px;
          border-left: 2px solid var(--vscode-charts-blue);
      }
      .session-header {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
      }
      .session-icon {
          font-size: 16px;
      }
      .session-title {
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }
      .session-timer {
          font-size: 21px;
          font-weight: 600;
          font-family: monospace;
          color: var(--vscode-charts-blue);
      }
      .session-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
      }
      .session-status {
          font-size: var(--font-xs);
          color: var(--vscode-descriptionForeground);
      }
      .session-actions-link {
          font-size: var(--font-xs);
          color: var(--vscode-textLink-foreground);
          text-decoration: none;
          cursor: pointer;
      }
      .session-actions-link:hover {
          text-decoration: underline;
      }
      
      .action-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
      }
      .action-group-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--vscode-descriptionForeground);
          margin-top: 8px;
          margin-bottom: 2px;
          padding-left: 2px;
          opacity: 0.55;
          letter-spacing: 0.8px;
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
          font-size: 9px;
          transition: transform 0.15s ease;
          display: inline-block;
      }
      .action-group-label.collapsed .collapse-chevron {
          transform: rotate(-90deg);
      }
      .action-group-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
          transition: max-height 0.2s ease;
      }
      .action-group-content.collapsed {
          display: none;
      }
      /* Quick Command Bar (7.11) */
      .quick-command-input {
          width: 100%;
          padding: 4px 8px;
          min-height: 32px;
          border: 1px solid var(--vscode-input-border, var(--vscode-widget-border));
          border-radius: 4px;
          background: var(--vscode-input-background);
          color: var(--vscode-input-foreground);
          font-size: 12px;
          box-sizing: border-box;
          margin-bottom: 8px;
      }
      .quick-command-input:focus {
          border-color: var(--vscode-focusBorder);
          outline: none;
      }
      .quick-command-input::placeholder {
          color: var(--vscode-input-placeholderForeground);
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
      .cognitive-state-mode { font-size: 11px; opacity: 0.7; }
      /* Personality Toggle (7.16) */
      .personality-toggle {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          margin-bottom: 8px;
          overflow: hidden;
      }
      .personality-toggle-btn {
          flex: 1;
          padding: 6px 8px;
          font-size: 11px;
          font-weight: 500;
          text-align: center;
          cursor: pointer;
          border: none;
          background: transparent;
          color: var(--vscode-foreground);
          opacity: 0.6;
          transition: opacity 0.15s, background 0.15s;
      }
      .personality-toggle-btn:hover { opacity: 0.85; }
      .personality-toggle-btn.active {
          opacity: 1;
          background: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          font-weight: 600;
      }
      .personality-toggle-btn + .personality-toggle-btn {
          border-left: 1px solid var(--vscode-widget-border, #303030);
      }
      /* Memory Modality Cards (7.37) */
      .memory-modalities {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 8px;
      }
      .memory-modality-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px;
          text-align: center;
      }
      .memory-modality-icon { font-size: 18px; margin-bottom: 4px; }
      .memory-modality-count { font-size: 16px; font-weight: 600; color: var(--vscode-foreground); }
      .memory-modality-label { font-size: 11px; color: var(--vscode-descriptionForeground); }
      .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 2px 8px;
          min-height: 28px;
          background: var(--vscode-button-secondaryBackground);
          color: var(--vscode-button-secondaryForeground);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: var(--font-xs);
          text-align: left;
          transition: all 0.12s ease;
      }
      .action-btn:hover {
          background: var(--vscode-button-secondaryHoverBackground);
          transform: translateX(2px);
      }
      .action-btn.primary {
          background: color-mix(in srgb, var(--persona-accent) 10%, var(--vscode-button-secondaryBackground));
          color: var(--vscode-button-secondaryForeground);
          border-left: 2px solid var(--persona-accent);
          font-weight: 500;
      }
      .action-btn.primary:hover {
          background: color-mix(in srgb, var(--persona-accent) 18%, var(--vscode-button-secondaryHoverBackground));
          transform: translateX(2px);
      }
      .action-icon {
          font-size: var(--font-sm);
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
      }
      .tier-lock {
          font-size: 11px;
          margin-left: auto;
          opacity: 0.55;
          white-space: nowrap;
          padding: 1px 4px;
          border-radius: 3px;
          background: color-mix(in srgb, var(--vscode-charts-yellow) 15%, transparent);
          color: var(--vscode-descriptionForeground);
      }
      .action-btn.recommended {
          border-left: 2px solid var(--persona-accent);
          background: color-mix(in srgb, var(--persona-accent) 8%, var(--vscode-button-secondaryBackground));
      }
      .action-btn.recommended:hover {
          background: color-mix(in srgb, var(--persona-accent) 15%, var(--vscode-button-secondaryHoverBackground));
      }
      .recommended-badge {
          font-size: var(--font-xs);
          margin-left: auto;
          opacity: 0.6;
          color: var(--persona-accent);
      }
      
      /* Skill Recommendations Styles */
      .skill-recommendations-section {
          margin: 8px 0;
          padding: 8px;
          background: var(--vscode-editor-background);
          border-radius: 6px;
          border: 1px solid var(--vscode-widget-border);
      }
      .section-subtitle {
          font-size: var(--font-xs);
          font-weight: 600;
          color: var(--vscode-descriptionForeground);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
      }
      .skill-recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
      }
      .skill-recommendation-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 4px 8px;
          min-height: 36px;
          background: var(--vscode-button-secondaryBackground);
          color: var(--vscode-button-secondaryForeground);
          border: none;
          border-left: 2px solid var(--vscode-charts-blue);
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
          transition: all 0.12s ease;
      }
      .skill-recommendation-btn:hover {
          background: var(--vscode-button-secondaryHoverBackground);
          border-left-color: var(--persona-accent);
          transform: translateX(2px);
      }
      .skill-rec-name {
          font-size: var(--font-xs);
          font-weight: 500;
          margin-bottom: 2px;
      }
      .skill-rec-reason {
          font-size: var(--font-xs);
          opacity: 0.7;
          font-style: italic;
      }
      
      .goals-stats {
          display: flex;
          gap: 12px;
          font-size: var(--font-xs);
          color: var(--vscode-descriptionForeground);
          margin-bottom: 8px;
          opacity: 0.85;
      }
      .goal-item {
          background: var(--vscode-editor-background);
          border-radius: 5px;
          padding: 8px 10px;
          margin-bottom: 5px;
          transition: transform 0.1s ease;
      }
      .goal-item:hover {
          transform: translateX(1px);
      }
      .goal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
      }
      .goal-title {
          font-size: var(--font-xs);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
      }
      .goal-progress-text {
          font-size: var(--font-xs);
          color: var(--vscode-descriptionForeground);
          margin-left: 8px;
          opacity: 0.8;
      }
      .goal-bar {
          height: 3px;
          background: var(--vscode-progressBar-background);
          border-radius: 2px;
          overflow: hidden;
      }
      .goal-bar-fill {
          height: 100%;
          background: var(--persona-accent);
          border-radius: 2px;
          transition: width 0.3s ease;
      }
      
      /* Nudges Section Styles */
      .nudges-section {
          margin-bottom: 10px;
      }
      .nudge-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          background: var(--vscode-editor-background);
          border-radius: 4px;
          margin-bottom: 4px;
          border-left: 2px solid var(--vscode-charts-yellow);
          font-size: var(--font-xs);
          transition: all 0.12s ease;
      }
      .nudge-card:hover {
          transform: translateX(1px);
          background: var(--vscode-list-hoverBackground);
      }
      .nudge-card.nudge-health {
          border-left-color: var(--vscode-charts-red);
      }
      .nudge-card.nudge-streak {
          border-left-color: var(--vscode-charts-orange, #f0883e);
      }
      .nudge-card.nudge-mission {
          border-left-color: var(--vscode-charts-purple, #a371f7);
          background: linear-gradient(90deg, var(--vscode-editor-background), rgba(163, 113, 247, 0.08));
      }
      .nudge-icon {
          font-size: 16px;
          flex-shrink: 0;
          opacity: 0.9;
      }
      .nudge-content {
          flex: 1;
          min-width: 0;
      }
      .nudge-message {
          font-size: var(--font-xs);
          line-height: 1.3;
      }
      .nudge-action {
          font-size: var(--font-xs);
          color: var(--vscode-textLink-foreground);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          min-height: 36px;
          border-radius: 4px;
          transition: background 0.1s ease;
          white-space: nowrap;
      }
      .nudge-action:hover {
          background: var(--vscode-toolbar-hoverBackground);
      }
      
      /* Features Section Styles */
      .features-section details {
          margin: 0;
      }
      .features-section summary {
          cursor: pointer;
          list-style: none;
          user-select: none;
          padding: 3px 0;
          border-radius: 3px;
          transition: color 0.1s ease;
      }
      .features-section summary:hover {
          color: var(--vscode-textLink-foreground);
      }
      .features-section summary::-webkit-details-marker {
          display: none;
      }
      .features-section summary::before {
          content: '▸ ';
          font-size: 14px;
          margin-right: 4px;
          transition: transform 0.12s ease;
          display: inline-block;
          opacity: 0.7;
      }
      .features-section details[open] summary::before {
          content: '▾ ';
      }
      .section-title.clickable {
          cursor: pointer;
      }
      .section-title.clickable:hover {
          color: var(--vscode-textLink-foreground);
      }
      .features-content {
          margin-top: 10px;
          padding: 0 2px;
      }
      .feature-category {
          margin-bottom: 10px;
      }
      .feature-category-title {
          font-size: var(--font-xs);
          font-weight: 600;
          color: var(--vscode-foreground);
          margin-bottom: 4px;
      }
      .feature-list {
          margin: 0;
          padding-left: 17px;
          font-size: var(--font-xs);
          line-height: 1.5;
          color: var(--vscode-descriptionForeground);
      }
      .feature-list li {
          margin-bottom: 4px;
      }
      .feature-list strong {
          color: var(--vscode-foreground);
          font-weight: 500;
      }
      .feature-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--vscode-widget-border);
      }
      .feature-link-btn {
          background: var(--vscode-button-secondaryBackground);
          color: var(--vscode-button-secondaryForeground);
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          min-height: 36px;
          font-size: var(--font-xs);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          transition: all 0.12s ease;
      }
      .feature-link-btn:hover {
          background: var(--vscode-button-secondaryHoverBackground);
      }

      /* ── Spike 1B: Tab Bar ── */
      .tab-bar {
          display: flex;
          border-bottom: 1px solid var(--vscode-panel-border);
          margin: 0 -16px;
          padding: 0 16px;
          gap: 0;
      }
      .tab-bar .tab {
          flex: 1;
          padding: 8px 4px;
          min-height: 36px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--vscode-foreground);
          opacity: 0.6;
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          text-align: center;
          transition: all 0.15s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }
      .tab-bar .tab:hover {
          opacity: 0.85;
          background: var(--vscode-list-hoverBackground);
      }
      .tab-bar .tab:focus-visible {
          outline: 2px solid var(--vscode-focusBorder);
          outline-offset: 2px;
      }
      .tab-bar .tab.active {
          opacity: 1;
          font-weight: 600;
          border-bottom-color: var(--persona-accent, #6366f1);
      }
      .tab-panel { display: none; }
      .tab-panel.active { display: block; }
      .empty-state {
          text-align: center;
          padding: 32px 16px;
          opacity: 0.7;
      }
      .empty-state-icon { font-size: 32px; margin-bottom: 8px; }
      .empty-state-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
      .empty-state-desc { font-size: 12px; line-height: 1.4; }

      /* ── Docs Tab: Persona Grid ── */
      .persona-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 6px;
          margin: 8px 0;
      }
      .persona-card {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          background: var(--vscode-editor-widget-background, var(--vscode-sideBar-background));
          border: 1px solid var(--vscode-panel-border, var(--vscode-widget-border));
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          line-height: 1.3;
          transition: background 0.15s;
          border-left: 3px solid var(--persona-accent, #6366f1);
      }
      .persona-card:hover {
          background: var(--vscode-list-hoverBackground);
      }
      .persona-card .persona-tag {
          font-size: 11px;
          opacity: 0.6;
      }
      .persona-card .persona-name {
          font-weight: 500;
      }
      .docs-section { margin-bottom: 12px; }
      .docs-section-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin: 12px 0 6px;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--vscode-panel-border, var(--vscode-widget-border));
      }
      .docs-cta {
          text-align: center;
          padding: 16px 12px;
          margin: 12px 0;
          background: var(--vscode-editor-widget-background);
          border: 1px solid var(--persona-accent, #6366f1);
          border-radius: 6px;
      }
      .docs-cta-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
      .docs-cta-desc { font-size: 11px; opacity: 0.7; margin-bottom: 8px; }

      /* Dashboard card styling for Mission Command */
      .dashboard-card {
          background: var(--vscode-editor-background, #1e1e1e);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 10px 12px;
          margin-bottom: 8px;
      }
      .dashboard-card-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.7;
          margin-bottom: 6px;
      }

      /* ── Tab Section Title ── */
      .tab-section-title {
          font-size: 13px;
          font-weight: 600;
          margin: 8px 0 10px;
      }
      .tab-footer-hint {
          font-size: 11px;
          opacity: 0.5;
          margin-top: 12px;
          padding: 8px 0;
          border-top: 1px solid var(--vscode-panel-border);
      }
      .tab-footer-hint code {
          background: var(--vscode-textCodeBlock-background);
          padding: 1px 4px;
          border-radius: 3px;
          font-size: 11px;
      }

      /* ── Agents Tab ── */
      .agent-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
      }
      .agent-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px 10px;
      }
      .agent-card.agent-missing { opacity: 0.5; }
      .agent-card-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
      }
      .agent-icon { font-size: 16px; }
      .agent-name { font-weight: 600; font-size: 12px; flex: 1; }
      .agent-badge {
          font-size: 11px;
          padding: 1px 5px;
          border-radius: 8px;
          font-weight: 600;
      }
      .badge-ok { background: color-mix(in srgb, var(--vscode-testing-iconPassed) 20%, transparent); color: var(--vscode-testing-iconPassed); }
      .badge-missing { background: color-mix(in srgb, var(--vscode-errorForeground) 20%, transparent); color: var(--vscode-errorForeground); }
      .agent-role {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin-bottom: 2px;
      }
      .agent-desc {
          font-size: 11px;
          line-height: 1.4;
          opacity: 0.8;
      }
      /* Live agent status dot (7.20) */
      .agent-live-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-left: 4px;
      }
      .agent-live-dot.active { background: var(--vscode-testing-iconPassed); animation: pulse-dot 1.5s infinite; }
      .agent-live-dot.idle { background: var(--vscode-disabledForeground); opacity: 0.4; }
      @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      /* Activity feed (7.10/7.21) */
      .activity-feed { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
      .activity-item {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 8px;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 4px;
          font-size: 11px;
      }
      .activity-status { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
      .activity-status.active { background: var(--vscode-testing-iconPassed); animation: pulse-dot 1.5s infinite; }
      .activity-status.complete { background: var(--vscode-disabledForeground); opacity: 0.5; }
      .activity-status.error { background: var(--vscode-errorForeground); }
      .activity-agent { font-weight: 600; flex-shrink: 0; }
      .activity-prompt { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: 0.75; }
      .activity-time { font-size: 10px; opacity: 0.5; flex-shrink: 0; }

      /* ── Skill Store Tab ── */
      .skill-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
      }
      .skill-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px 10px;
          cursor: pointer;
          transition: border-color 0.15s;
      }
      .skill-card:hover {
          border-color: var(--persona-accent, #6366f1);
      }
      .skill-header {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
      }
      .skill-name { font-weight: 600; font-size: 12px; flex: 1; }
      .skill-synapse-dot { font-size: 11px; opacity: 0.7; }
      .skill-category {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.5;
          margin-bottom: 2px;
      }
      .skill-desc {
          font-size: 11px;
          line-height: 1.4;
          opacity: 0.8;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
      }

      /* ── Mind Tab ── */
      .mind-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
      }
      .mind-stat-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 12px;
          text-align: center;
      }
      .mind-stat-value {
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
      }
      .mind-stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
      }
      .stat-good { color: var(--vscode-testing-iconPassed); }
      .stat-warn { color: var(--vscode-editorWarning-foreground); }
      .stat-bad { color: var(--vscode-errorForeground); }

      .memory-modality {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
      }
      .modality-label {
          font-size: 11px;
          width: 72px;
          flex-shrink: 0;
          opacity: 0.8;
      }
      .modality-bar {
          flex: 1;
          height: 6px;
          background: var(--vscode-progressBar-background, #333);
          border-radius: 3px;
          overflow: hidden;
      }
      .modality-fill {
          height: 100%;
          background: var(--persona-accent, #6366f1);
          border-radius: 3px;
          transition: width 0.3s ease;
      }
      .modality-count {
          font-size: 11px;
          font-weight: 600;
          width: 28px;
          text-align: right;
          flex-shrink: 0;
      }

      .mind-maintenance-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
      }
      .maintenance-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.15s;
      }
      .maintenance-item:hover {
          background: var(--vscode-list-hoverBackground);
      }
      .maintenance-icon { font-size: 20px; margin-bottom: 4px; }
      .maintenance-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin-bottom: 2px;
      }
      .maintenance-value {
          font-size: 11px;
          font-weight: 500;
      }

      /* ── Architecture Status Banner (7.9) ── */
      .arch-status-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 8px;
          cursor: pointer;
          border: 1px solid var(--vscode-widget-border, #303030);
      }
      .arch-status-banner.status-healthy {
          background: color-mix(in srgb, var(--vscode-testing-iconPassed) 8%, transparent);
          border-color: color-mix(in srgb, var(--vscode-testing-iconPassed) 25%, transparent);
      }
      .arch-status-banner.status-warning {
          background: color-mix(in srgb, var(--vscode-editorWarning-foreground) 8%, transparent);
          border-color: color-mix(in srgb, var(--vscode-editorWarning-foreground) 25%, transparent);
      }
      .arch-status-banner.status-error {
          background: color-mix(in srgb, var(--vscode-errorForeground) 8%, transparent);
          border-color: color-mix(in srgb, var(--vscode-errorForeground) 25%, transparent);
      }
      .arch-status-icon { font-size: 20px; flex-shrink: 0; }
      .arch-status-detail { flex: 1; }
      .arch-status-title { font-weight: 600; font-size: 12px; }
      .arch-status-meta { font-size: 11px; opacity: 0.7; }

      /* ── Nudge Dismiss (7.12) ── */
      .nudge-dismiss {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 11px;
          opacity: 0.4;
          padding: 4px;
          color: var(--vscode-foreground);
          flex-shrink: 0;
          align-self: flex-start;
      }
      .nudge-dismiss:hover { opacity: 1; }

      /* ── Info Card (7.22, 7.23) ── */
      .info-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 10px 12px;
          margin: 8px 0;
      }
      .info-card-title { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
      .info-card-desc { font-size: 11px; opacity: 0.8; line-height: 1.5; }

      /* ── Skill Search & Filter (7.24, 7.25) ── */
      .skill-search-input {
          width: 100%;
          padding: 4px 8px;
          min-height: 28px;
          border: 1px solid var(--vscode-input-border, var(--vscode-widget-border));
          border-radius: 4px;
          background: var(--vscode-input-background);
          color: var(--vscode-input-foreground);
          font-size: 12px;
          outline: none;
          margin-bottom: 8px;
      }
      .skill-search-input:focus { border-color: var(--vscode-focusBorder); }
      .skill-search-input::placeholder { color: var(--vscode-input-placeholderForeground); }
      .catalog-toggle {
          display: flex;
          gap: 0;
          margin-bottom: 8px;
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 4px;
          overflow: hidden;
      }
      .catalog-toggle-btn {
          flex: 1;
          padding: 4px 8px;
          min-height: 28px;
          background: var(--vscode-editor-background);
          color: var(--vscode-foreground);
          border: none;
          font-size: 11px;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.15s;
      }
      .catalog-toggle-btn:not(:last-child) {
          border-right: 1px solid var(--vscode-widget-border, #303030);
      }
      .catalog-toggle-btn.active {
          background: var(--persona-accent, #6366f1);
          color: #fff;
          opacity: 1;
          font-weight: 600;
      }

      /* ── Skill Health Summary (7.26) ── */
      .skill-health-bar {
          display: flex;
          gap: 12px;
          padding: 4px 0;
          margin-bottom: 8px;
          font-size: 11px;
          opacity: 0.7;
      }
      .skill-health-item { display: flex; align-items: center; gap: 4px; }

      /* ── Skill Category Groups (7.27) ── */
      .skill-category-group { margin-bottom: 8px; }
      .skill-category-header {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 0;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          cursor: pointer;
          user-select: none;
      }
      .skill-category-header .collapse-icon {
          transition: transform 0.15s;
          font-size: 11px;
      }
      .skill-category-header.collapsed .collapse-icon { transform: rotate(-90deg); }
      .skill-category-group-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
      }
      .skill-category-header.collapsed + .skill-category-group-content { display: none; }

      /* ── Identity Card (7.35) ── */
      .identity-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 8px;
          text-align: center;
      }
      .identity-name { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
      .identity-meta { font-size: 11px; opacity: 0.7; }

      /* ── Cognitive Age Enriched (7.36) ── */
      .cognitive-tier-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin-top: 4px;
      }
      .cognitive-progress-bar {
          width: 100%;
          height: 6px;
          background: var(--vscode-progressBar-background, #333);
          border-radius: 3px;
          overflow: hidden;
          margin: 8px 0 4px;
      }
      .cognitive-progress-fill {
          height: 100%;
          background: var(--persona-accent, #6366f1);
          border-radius: 3px;
          transition: width 0.3s ease;
      }
      .cognitive-milestones {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          opacity: 0.4;
      }

      /* ── Global Knowledge Panel (7.34) ── */
      .gk-panel {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 8px;
      }
      .gk-stat {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px;
          text-align: center;
      }
      .gk-stat-icon { font-size: 20px; display: block; margin-bottom: 2px; }
      .gk-stat-label { font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.3px; }

      /* ── Doc Grid Cards (7.40, 7.41, 7.42) ── */
      .doc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
      }
      .doc-grid-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px;
          cursor: pointer;
          transition: border-color 0.15s;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          min-height: 36px;
      }
      .doc-grid-card:hover { border-color: var(--persona-accent, #6366f1); }
      .doc-grid-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
      .doc-grid-text { flex: 1; }
      .doc-grid-title { font-size: 12px; font-weight: 600; }
      .doc-grid-desc { font-size: 11px; opacity: 0.7; }

      /* ── Partnership Card (7.43) ── */
      .partnership-structured {
          background: var(--vscode-editor-background);
          border: 1px solid var(--persona-accent, #6366f1);
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 8px;
      }
      .partnership-structured-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
      .partnership-structured-desc { font-size: 11px; opacity: 0.8; line-height: 1.5; margin-bottom: 8px; }

      /* ── Doc Tips (7.39) ── */
      .doc-tips { margin-bottom: 8px; }
      .doc-tip {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 4px;
          margin-bottom: 4px;
          font-size: 11px;
          line-height: 1.4;
      }
      .doc-tip-icon { font-size: 14px; flex-shrink: 0; }
      .doc-tip-dismiss {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          opacity: 0.4;
          padding: 4px;
          color: var(--vscode-foreground);
          flex-shrink: 0;
          margin-left: auto;
      }
      .doc-tip-dismiss:hover { opacity: 1; }

      /* ── 7.13 Secret Manager Inline ── */
      .secret-status-panel { margin-bottom: 8px; }
      .secret-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 8px;
          font-size: 11px;
          border-bottom: 1px solid var(--vscode-widget-border, #303030);
      }
      .secret-row:last-child { border-bottom: none; }
      .secret-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
      }
      .secret-dot.set { background: var(--vscode-testing-iconPassed, #73c991); }
      .secret-dot.unset { background: var(--vscode-errorForeground, #f14c4c); }
      .secret-name { flex: 1; }
      .secret-badge {
          font-size: 10px; padding: 1px 6px; border-radius: 3px;
      }
      .secret-badge.set { background: rgba(115,201,145,0.1); color: var(--vscode-testing-iconPassed, #73c991); }
      .secret-badge.unset { background: rgba(241,76,76,0.1); color: var(--vscode-errorForeground, #f14c4c); }

      /* ── 7.14 Settings Toggles ── */
      .settings-toggles { margin-bottom: 8px; }
      .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 8px;
          font-size: 11px;
          border-bottom: 1px solid var(--vscode-widget-border, #303030);
      }
      .setting-row:last-child { border-bottom: none; }
      .toggle-switch {
          position: relative; width: 32px; height: 18px;
          background: var(--vscode-input-background, #3c3c3c);
          border-radius: 9px; cursor: pointer; transition: background 0.2s;
          border: 1px solid var(--vscode-widget-border, #303030);
          flex-shrink: 0;
      }
      .toggle-switch.on { background: var(--persona-accent, #6366f1); }
      .toggle-switch::after {
          content: ''; position: absolute; top: 2px; left: 2px;
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--vscode-foreground); transition: transform 0.2s;
      }
      .toggle-switch.on::after { transform: translateX(14px); }

      /* ── 7.28 Skill Toggle ── */
      .skill-toggle {
          width: 24px; height: 14px; border-radius: 7px; cursor: pointer;
          background: var(--vscode-input-background, #3c3c3c);
          border: 1px solid var(--vscode-widget-border, #303030);
          position: relative; flex-shrink: 0; transition: background 0.2s;
      }
      .skill-toggle.on { background: var(--persona-accent, #6366f1); }
      .skill-toggle::after {
          content: ''; position: absolute; top: 1px; left: 1px;
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--vscode-foreground); transition: transform 0.15s;
      }
      .skill-toggle.on::after { transform: translateX(10px); }
      .skill-card.disabled { opacity: 0.5; }

      /* ── 7.29 Skill Icon ── */
      .skill-icon { font-size: 14px; flex-shrink: 0; }

      /* ── 7.30 Install from GitHub ── */
      .install-github-card {
          border: 1px dashed var(--vscode-widget-border, #303030);
          border-radius: 6px; padding: 10px; text-align: center;
          opacity: 0.7; margin-top: 8px;
      }
      .install-github-card:hover { opacity: 1; border-color: var(--persona-accent, #6366f1); }

      /* ── 7.32 Knowledge Freshness ── */
      .freshness-panel { display: flex; gap: 6px; margin-bottom: 8px; }
      .freshness-bucket {
          flex: 1; text-align: center; padding: 6px 4px;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px; font-size: 10px;
      }
      .freshness-count { font-size: 16px; font-weight: 700; }
      .freshness-label { opacity: 0.7; margin-top: 2px; }
      .freshness-bucket.thriving { border-bottom: 2px solid var(--vscode-testing-iconPassed, #73c991); }
      .freshness-bucket.active { border-bottom: 2px solid var(--persona-accent, #6366f1); }
      .freshness-bucket.fading { border-bottom: 2px solid var(--vscode-editorWarning-foreground, #cca700); }
      .freshness-bucket.dormant { border-bottom: 2px solid var(--vscode-errorForeground, #f14c4c); }

      /* ── 7.33 Honest Uncertainty ── */
      .calibration-panel { margin-bottom: 8px; }
      .calibration-bar-row {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; margin-bottom: 4px;
      }
      .calibration-label { width: 60px; text-align: right; opacity: 0.7; flex-shrink: 0; }
      .calibration-bar-track {
          flex: 1; height: 8px; background: var(--vscode-input-background, #3c3c3c);
          border-radius: 4px; overflow: hidden;
      }
      .calibration-bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
      .calibration-bar-fill.high { background: var(--vscode-testing-iconPassed, #73c991); }
      .calibration-bar-fill.medium { background: var(--persona-accent, #6366f1); }
      .calibration-bar-fill.low { background: var(--vscode-editorWarning-foreground, #cca700); }
      .calibration-bar-fill.uncertain { background: var(--vscode-errorForeground, #f14c4c); }
      .calibration-pct { width: 30px; font-size: 10px; opacity: 0.6; }

      /* ── 7.38 Meditation Streak ── */
      .meditation-streak-row {
          display: flex; align-items: center; gap: 8px;
          margin-top: 4px; font-size: 11px;
      }
      .meditation-streak-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border-radius: 10px;
          background: rgba(99,102,241,0.12); font-weight: 600;
      }
  `;
}
