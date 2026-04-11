/**
 * sharedStyles.tabs.ts - Tab bar, panels, agent/skill/mind tabs, and widget styles
 *
 * Part of sharedStyles split. Returns CSS fragment for the composer.
 */

/** Tab bar, panels, docs/agents/skill-store/mind tabs, and all widget styles */
export function getTabStyles(): string {
  return `
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
          transition: all 0.12s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }
      .tab-bar .tab:hover {
          opacity: 0.8;
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
          opacity: 0.6;
      }
      .empty-state-icon { font-size: 32px; margin-bottom: 8px; }
      .empty-state-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
      .empty-state-desc { font-size: 12px; line-height: 1.4; }

      /* ── Docs Tab: Persona Grid ── */
      .persona-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 8px;
          margin: 8px 0;
      }
      .persona-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 8px;
          background: var(--vscode-editor-widget-background, var(--vscode-sideBar-background));
          border: 1px solid var(--vscode-panel-border, var(--vscode-widget-border));
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          line-height: 1.3;
          transition: background 0.12s;
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
          margin: 12px 0 8px;
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
      .docs-cta-desc { font-size: 11px; opacity: 0.6; margin-bottom: 8px; }
      .docs-cta .action-btn { display: inline-flex; }
      .docs-cta-links { margin-top: 10px; font-size: 11px; }
      .docs-cta-link {
          color: var(--vscode-textLink-foreground);
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.12s;
      }
      .docs-cta-link:hover { opacity: 1; text-decoration: underline; }
      .docs-cta-sep { opacity: 0.3; margin: 0 6px; }
      .agent-context-edit {
          opacity: 0.5;
          font-size: 10px;
          cursor: pointer;
      }

      /* Dashboard card styling for Mission Command */
      .dashboard-card {
          background: var(--vscode-editor-background, #1e1e1e);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 12px 12px;
          margin-bottom: 8px;
      }
      .dashboard-card-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin-bottom: 8px;
      }
      .card-description {
          font-size: var(--font-sm, 12px);
          color: var(--vscode-descriptionForeground);
          margin: 0 0 8px 0;
          line-height: 1.4;
      }

      /* Action buttons inside dashboard cards get proper vertical rhythm */
      .dashboard-card .action-btn { margin-top: 4px; }
      .dashboard-card .action-btn:first-of-type { margin-top: 0; }

      /* Secret panel inside dashboard card needs breathing room before buttons */
      .dashboard-card .secret-status-panel { margin-bottom: 8px; }

      /* Settings toggles inside dashboard card */
      .dashboard-card .settings-toggles { margin-top: 8px; }

      /* Agent Context transparency card */
      .agent-context-panel {
          display: flex;
          flex-direction: column;
          gap: 3px;
      }
      .agent-context-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 11px;
          padding: 2px 0;
      }
      .agent-context-label {
          font-weight: 600;
          opacity: 0.6;
          min-width: 70px;
          flex-shrink: 0;
      }
      .agent-context-value {
          text-align: right;
          opacity: 0.85;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 180px;
      }

      /* ── Tab Section Title ── */
      .tab-section-title {
          font-size: 13px;
          font-weight: 600;
          margin: 8px 0 12px;
      }
      .tab-footer-hint {
          font-size: 11px;
          opacity: 0.4;
          margin-top: 12px;
          padding: 8px 0;
          border-top: 1px solid var(--vscode-panel-border);
      }
      .tab-footer-hint code {
          background: var(--vscode-textCodeBlock-background);
          padding: 1px 4px;
          border-radius: 4px;
          font-size: 11px;
      }

      /* ── Agents Tab ── */
      .agent-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
      }
      .agent-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px 12px;
      }
      .agent-card.agent-missing { opacity: 0.4; }
      .agent-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
      }
      .agent-icon { font-size: 16px; }
      .agent-name { font-weight: 600; font-size: 12px; flex: 1; }
      .agent-badge {
          font-size: 11px;
          padding: 2px 4px;
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
          position: relative;
      }
      .agent-live-dot::after {
          position: absolute; font-size: 9px; line-height: 9px;
          left: 50%; top: 50%; transform: translate(-50%, -50%);
      }
      .agent-live-dot.active { background: var(--vscode-testing-iconPassed); animation: pulse-dot 1.5s infinite; }
      .agent-live-dot.active::after { content: '\\2713'; color: white; }
      .agent-live-dot.idle { background: var(--vscode-disabledForeground); opacity: 0.4; }
      .agent-live-dot.idle::after { content: '\\2015'; color: white; }
      @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      /* Activity feed (7.10/7.21) */
      .activity-feed { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
      .activity-item {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 8px;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 4px;
          font-size: 11px;
      }
      .activity-status { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
      .activity-status.active { background: var(--vscode-testing-iconPassed); animation: pulse-dot 1.5s infinite; }
      .activity-status.complete { background: var(--vscode-disabledForeground); opacity: 0.4; }
      .activity-status.error { background: var(--vscode-errorForeground); }
      .activity-agent { font-weight: 600; flex-shrink: 0; }
      .activity-prompt { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: 0.8; }
      .activity-time { font-size: 11px; opacity: 0.6; flex-shrink: 0; }

      /* ── Skill Store Tab ── */
      .skill-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
      }
      .skill-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          transition: border-color 0.12s;
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
      .skill-synapse-dot { font-size: 11px; opacity: 0.6; }
      .skill-category {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
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
      .arch-status-meta { font-size: 11px; opacity: 0.6; }

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
          padding: 12px 12px;
          margin: 8px 0;
      }
      .info-card-title { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
      .info-card-desc { font-size: 11px; opacity: 0.8; line-height: 1.5; }

      /* ── Skill Search & Filter (7.24, 7.25) ── */
      .skill-search-input {
          width: 100%;
          padding: 4px 8px;
          min-height: 36px;
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
          min-height: 36px;
          background: var(--vscode-editor-background);
          color: var(--vscode-foreground);
          border: none;
          font-size: 11px;
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.12s;
      }
      .catalog-toggle-btn:not(:last-child) {
          border-right: 1px solid var(--vscode-widget-border, #303030);
      }
      .catalog-toggle-btn.active {
          background: var(--persona-accent, #6366f1);
          color: var(--vscode-button-foreground, #fff);
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
          opacity: 0.6;
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
          transition: transform 0.12s;
          font-size: 11px;
      }
      .skill-category-header.collapsed .collapse-icon { transform: rotate(-90deg); }
      .skill-category-group-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
      }
      .skill-category-header.collapsed + .skill-category-group-content { display: none; }



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
          transition: border-color 0.12s;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          min-height: 36px;
      }
      .doc-grid-card:hover { border-color: var(--persona-accent, #6366f1); }
      .doc-grid-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
      .doc-grid-text { flex: 1; }
      .doc-grid-title { font-size: 12px; font-weight: 600; }
      .doc-grid-desc { font-size: 11px; opacity: 0.6; }

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
          padding: 4px 8px;
          font-size: 11px;
          border-bottom: 1px solid var(--vscode-widget-border, #303030);
      }
      .secret-row:last-child { border-bottom: none; }
      .secret-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; position: relative;
      }
      .secret-dot::after {
          position: absolute; font-size: 8px; line-height: 8px;
          left: 50%; top: 50%; transform: translate(-50%, -50%);
      }
      .secret-dot.set { background: var(--vscode-testing-iconPassed, #73c991); }
      .secret-dot.set::after { content: '\\2713'; color: white; }
      .secret-dot.unset { background: var(--vscode-errorForeground, #f14c4c); }
      .secret-dot.unset::after { content: '\\2717'; color: white; }
      .secret-name { flex: 1; }
      .secret-badge {
          font-size: 11px; padding: 2px 8px; border-radius: 4px;
      }
      .secret-badge.set { background: rgba(115,201,145,0.1); color: var(--vscode-testing-iconPassed, #73c991); }
      .secret-badge.unset { background: rgba(241,76,76,0.1); color: var(--vscode-errorForeground, #f14c4c); }

      /* ── 7.14 Settings Toggles ── */
      .settings-toggles { margin-bottom: 8px; }
      .action-btn.compact {
          padding: 4px 8px;
          font-size: 11px;
          margin: 0 0 6px 0;
          min-height: unset;
          opacity: 0.8;
      }
      .action-btn.compact:hover { opacity: 1; }
      .action-btn.compact .action-icon { font-size: 12px; }
      .action-btn.compact .action-text { font-size: 11px; }
      .settings-group-header {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--vscode-descriptionForeground, #888);
          padding: 6px 8px 2px;
          border-top: 1px solid var(--vscode-widget-border, #303030);
      }
      .settings-group-header:first-child { border-top: none; }
      .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 8px;
          font-size: 11px;
          border-bottom: 1px solid var(--vscode-widget-border, #303030);
      }
      .setting-row:last-child { border-bottom: none; }
      .toggle-switch {
          position: relative; width: 36px; height: 20px;
          background: var(--vscode-input-background, #3c3c3c);
          border-radius: 10px; cursor: pointer; transition: background 0.2s;
          border: 1px solid var(--vscode-widget-border, #303030);
          flex-shrink: 0;
      }
      .toggle-switch.on { background: var(--persona-accent, #6366f1); }
      .toggle-switch::after {
          content: ''; position: absolute; top: 2px; left: 2px;
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--vscode-foreground); transition: transform 0.2s;
      }
      .toggle-switch.on::after { transform: translateX(18px); }

      /* ── 7.29 Skill Icon ── (7.28 Skill Toggle removed — no longer supported) ──

      /* ── 7.29 Skill Icon ── */
      .skill-icon { font-size: 14px; flex-shrink: 0; }



      /* ── 7.38 Meditation Streak ── */
      .meditation-streak-row {
          display: flex; align-items: center; gap: 8px;
          margin: 4px 0 8px; font-size: 11px;
      }
      .meditation-streak-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border-radius: 12px;
          background: color-mix(in srgb, var(--persona-accent) 12%, transparent); font-weight: 600;
      }
  `;
}
