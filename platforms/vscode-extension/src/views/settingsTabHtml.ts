/**
 * settingsTabHtml.ts - Settings tab HTML generation for the Command Center sidebar
 *
 * Streamlined from mindTabHtml.ts in v7.4.0 to show only API keys and quick settings.
 * Exports a single function called by the orchestrator.
 */
import { escapeHtml } from "../shared/sanitize";
import {
  TokenStatusInfo,
  SettingsToggle,
  actionButton,
} from "./welcomeViewHtml";

export interface SettingsTabContext {
  tokenStatuses?: TokenStatusInfo[];
  settingsToggles?: SettingsToggle[];
  isActive?: boolean;
}

/** Generate the Settings tab panel HTML. */
export function getSettingsTabHtml(ctx: SettingsTabContext): string {
  const { tokenStatuses, settingsToggles } = ctx;

  return `
      <div class="tab-panel${ctx.isActive ? " active" : ""}" id="panel-settings" role="tabpanel" aria-labelledby="tab-settings">

          ${
            (tokenStatuses ?? []).length > 0
              ? `
          <div class="dashboard-card">
              <div class="dashboard-card-title">API Keys</div>
              <div class="secret-status-panel" data-cmd="manageSecrets" tabindex="0" role="button" title="Click to manage API keys">
                  ${(tokenStatuses ?? [])
                    .map(
                      (t) => `
                  <div class="secret-row">
                      <span class="secret-dot ${t.isSet ? "set" : "unset"}"></span>
                      <span class="secret-name">${escapeHtml(t.displayName)}</span>
                      <span class="secret-badge ${t.isSet ? "set" : "unset"}">${t.isSet ? "Set" : "Missing"}</span>
                  </div>`,
                    )
                    .join("")}
              </div>
              ${actionButton("manageSecrets", "🔑", "Manage Keys", "Manage tokens for Gamma, Replicate, OpenAI")}
              ${actionButton("detectEnvSecrets", "🔍", "Detect .env Secrets", "Scan .env files and migrate to secure storage")}
          </div>`
              : ""
          }

          ${
            (settingsToggles ?? []).length > 0
              ? `
          <div class="dashboard-card">
              <div class="dashboard-card-title">Quick Settings</div>
              ${actionButton("setupEnvironment", "⚙️", "Full Environment Setup…", "Open the environment setup wizard")}
              <div class="settings-toggles">
                  ${(() => {
                    let lastGroup = "";
                    return (settingsToggles ?? [])
                      .map((s) => {
                        const groupHeader =
                          s.group && s.group !== lastGroup
                            ? `<div class="settings-group-header">${escapeHtml(s.group)}</div>`
                            : "";
                        if (s.group) {
                          lastGroup = s.group;
                        }
                        return `${groupHeader}
                  <div class="setting-row"${s.tooltip ? ` title="${escapeHtml(s.tooltip)}"` : ""}>
                      <span>${escapeHtml(s.label)}</span>
                      <div class="toggle-switch ${s.enabled ? "on" : ""}" data-setting="${escapeHtml(s.key)}" tabindex="0" role="switch" aria-checked="${s.enabled}" aria-label="Toggle ${escapeHtml(s.label)}"></div>
                  </div>`;
                      })
                      .join("");
                  })()}
              </div>
          </div>`
              : ""
          }

      </div>`;
}
