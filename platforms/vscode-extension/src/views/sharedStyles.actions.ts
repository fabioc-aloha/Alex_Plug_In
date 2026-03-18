/**
 * sharedStyles.actions.ts - Action buttons, commands, nudges, and features styles
 *
 * Part of sharedStyles split. Returns CSS fragment for the composer.
 */

/** Action buttons, quick command, skill recommendations, nudges, and features styles */
export function getActionStyles(): string {
  return `
      .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 2px 8px;
          min-height: 36px;
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
          opacity: 0.8;
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
          opacity: 0.6;
          white-space: nowrap;
          padding: 1px 4px;
          border-radius: 4px;
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
          opacity: 0.6;
          font-style: italic;
      }
      
      
      /* Nudges Section Styles */
      .nudges-section {
          margin-bottom: 12px;
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
          opacity: 0.8;
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
          transition: background 0.12s ease;
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
          padding: 4px 0;
          border-radius: 4px;
          transition: color 0.12s ease;
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
          opacity: 0.6;
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
          margin-top: 12px;
          padding: 0 2px;
      }
      .feature-category {
          margin-bottom: 12px;
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

  `;
}
