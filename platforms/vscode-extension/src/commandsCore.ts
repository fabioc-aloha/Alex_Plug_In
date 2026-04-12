/**
 * commandsCore.ts - Core Alex commands (operations, docs, audit, global knowledge)
 *
 * Extracted from extension.ts to keep the main activation file focused.
 * Contains: architecture operations (init/reset/dream/upgrade),
 * document-opening commands, audit/preflight, secrets, GK, GitHub integration,
 * and v6.0 partnership commands.
 */
import * as vscode from "vscode";
import {
  initializeArchitecture,
  resetArchitecture,
} from "./commands/initialize";
import { runDreamProtocol } from "./commands/dream";
import { registerHeirValidationCommand } from "./commands/heirValidation";
import { setupEnvironment, optimizeSettings, manageExtensions, setupMcpServers } from "./commands/setupEnvironment";
import { upgradeArchitecture } from "./commands/upgrade";
import {
  completeMigration,
  showMigrationCandidates,
} from "./commands/upgradeMigration";
import { runSelfActualization } from "./commands/self-actualization";
import { generateSkillCatalog } from "./commands/skillCatalog";
import { inheritSkillFromGlobal } from "./commands/inheritSkill";
import { proposeSkillToGlobal } from "./commands/proposeSkill";
import { setupGlobalKnowledgeCommand } from "./commands/setupGlobalKnowledge";

import { showTokenManagementPalette } from "./services/secretsManager";
import {
  recordPositiveOutcomeCommand,
  recordNegativeOutcomeCommand,
  showOutcomeStatsCommand,
} from "./services/outcomeTracker";
import { showExpertiseModelCommand } from "./services/expertiseModel";
import {
  runWorkflowCommand,
  listWorkflowsCommand,
} from "./services/workflowEngine";
import { clearHealthCache } from "./shared/healthCheck";
import { openChatPanel } from "./shared/utils";
import { requireCognitiveLevel } from "./shared/cognitiveTier";
import {
  isOperationInProgress,
  setOperationInProgress,
} from "./shared/operationLock";
import * as telemetry from "./shared/telemetry";
import {
  updateStatusBar,
  setCommandContextKeys,
} from "./services/extensionLifecycle";
import { showStatusQuickPick } from "./commands/statusQuickPick";
import { registerUXCommands } from "./ux/uxFeatures";

async function withOperationLock<T>(
  operationName: string,
  operation: () => Promise<T>,
): Promise<T | undefined> {
  if (isOperationInProgress()) {
    vscode.window.showWarningMessage(
      `Another Alex operation is already in progress. Please wait for it to complete before running "${operationName}".`,
    );
    return undefined;
  }

  setOperationInProgress(true);
  try {
    return await operation();
  } finally {
    setOperationInProgress(false);
  }
}

export function registerCoreCommands(
  context: vscode.ExtensionContext,
  statusBarItem: vscode.StatusBarItem,
): void {
  // --- Architecture Operations ---

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.initialize", async () => {
      const done = telemetry.logTimed("command", "initialize");
      await withOperationLock("Initialize", async () => {
        try {
          await initializeArchitecture(context);
          clearHealthCache();
          await updateStatusBar(statusBarItem, true);
          await setCommandContextKeys();
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.reset", async () => {
      const done = telemetry.logTimed("command", "reset");
      await withOperationLock("Reset", async () => {
        try {
          await resetArchitecture(context);
          clearHealthCache();
          await updateStatusBar(statusBarItem, true);
          await setCommandContextKeys();
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.dream", async () => {
      if (!(await requireCognitiveLevel("alex.dream"))) {
        return;
      }
      const done = telemetry.logTimed("command", "dream");
      await withOperationLock("Dream Protocol", async () => {
        try {
          await runDreamProtocol(context);
          clearHealthCache();
          await updateStatusBar(statusBarItem, true);

          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    }),
  );

  // Deep Brain QA - comprehensive health check, GK sync, and synapse healing
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.deepBrainQA", async () => {
      const done = telemetry.logTimed("command", "deepBrainQA");
      await withOperationLock("Deep Brain QA", async () => {
        try {
          await vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title:
                "🧠 Deep Brain QA - Comprehensive Architecture Health Check",
              cancellable: false,
            },
            async (progress) => {
              progress.report({
                message: "Phase 1/2: Running Dream Protocol...",
              });
              const dreamResult = await runDreamProtocol(context, {
                silent: true,
              });

              progress.report({
                message: "Phase 2/2: Final health validation...",
              });
              clearHealthCache();
              await updateStatusBar(statusBarItem, true);

              const results: string[] = [];
              if (dreamResult) {
                if (dreamResult.brokenCount === 0) {
                  results.push(
                    `✅ Synapses: ${dreamResult.totalSynapses} healthy`,
                  );
                } else {
                  results.push(
                    `⚠️ Synapses: ${dreamResult.brokenCount} broken, ${dreamResult.repairedCount} repaired`,
                  );
                }
              }

              const overallSuccess = dreamResult?.brokenCount === 0;
              const title = overallSuccess
                ? "🧠 Deep Brain QA Complete - Architecture Healthy!"
                : "🧠 Deep Brain QA Complete - Some Issues Remain";

              const viewReport = dreamResult?.reportPath
                ? "View Report"
                : undefined;
              const selection = await vscode.window.showInformationMessage(
                `${title}\n\n${results.join("\n")}`,
                ...(viewReport ? [viewReport] : []),
              );

              if (selection === "View Report" && dreamResult?.reportPath) {
                const doc = await vscode.workspace.openTextDocument(
                  dreamResult.reportPath,
                );
                await vscode.window.showTextDocument(doc);
              }
            },
          );
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          vscode.window.showErrorMessage(`Deep Brain QA failed: ${err}`);
          throw err;
        }
      });
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.upgrade", async () => {
      const done = telemetry.logTimed("command", "upgrade");
      await withOperationLock("Upgrade", async () => {
        try {
          await upgradeArchitecture(context);
          clearHealthCache();
          await updateStatusBar(statusBarItem, true);
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.completeMigration", async () => {
      const done = telemetry.logTimed("command", "complete_migration");
      await withOperationLock("Migration", async () => {
        try {
          await completeMigration(context);
          clearHealthCache();
          await updateStatusBar(statusBarItem, true);
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alex.showMigrationCandidates",
      async () => {
        telemetry.log("command", "show_migration_candidates");
        await showMigrationCandidates();
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.selfActualize", async () => {
      if (!(await requireCognitiveLevel("alex.selfActualize"))) {
        return;
      }
      const done = telemetry.logTimed("command", "self_actualize");
      await withOperationLock("Self-Actualization", async () => {
        try {
          await runSelfActualization(context);
          clearHealthCache();
          await updateStatusBar(statusBarItem, true);

          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    }),
  );

  // --- Chat Commands ---

  // Meditate command - opens chat with /meditate prompt
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.meditate", async () => {
      if (!(await requireCognitiveLevel("alex.meditate"))) {
        return;
      }
      await openChatPanel("/meditate");
    }),
  );

  // North Star command - opens chat with /northstar prompt for vision definition
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.northStar", async () => {
      if (!(await requireCognitiveLevel("alex.northStar"))) {
        return;
      }
      telemetry.log("command", "north_star");
      await openChatPanel("/northstar");
    }),
  );

  // --- Registration ---

  registerUXCommands(context);
  registerHeirValidationCommand(context);

  // --- Document Opening Commands ---

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.openDocs", async () => {
      const docsPath = vscode.Uri.joinPath(
        context.extensionUri,
        "alex_docs",
        "README.md",
      );
      try {
        await vscode.commands.executeCommand("markdown.showPreview", docsPath);
      } catch {
        const doc = await vscode.workspace.openTextDocument(docsPath);
        await vscode.window.showTextDocument(doc);
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.workingWithAlex", async () => {
      const guidePath = vscode.Uri.joinPath(
        context.extensionUri,
        "alex_docs",
        "WORKING-WITH-ALEX.md",
      );
      try {
        await vscode.commands.executeCommand("markdown.showPreview", guidePath);
      } catch {
        const doc = await vscode.workspace.openTextDocument(guidePath);
        await vscode.window.showTextDocument(doc);
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.cognitiveLevels", async () => {
      const guidePath = vscode.Uri.joinPath(
        context.extensionUri,
        "alex_docs",
        "architecture",
        "VSCODE-BRAIN-INTEGRATION.md",
      );
      try {
        await vscode.commands.executeCommand("markdown.showPreview", guidePath);
      } catch {
        const doc = await vscode.workspace.openTextDocument(guidePath);
        await vscode.window.showTextDocument(doc);
      }
    }),
  );

  // --- Utility Commands ---

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.showStatus", showStatusQuickPick),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.setupEnvironment", async () => {
      const endLog = telemetry.logTimed("command", "setup_environment");
      try {
        await setupEnvironment();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.optimizeSettings", async () => {
      const endLog = telemetry.logTimed("command", "optimize_settings");
      try {
        await optimizeSettings();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.manageExtensions", async () => {
      const endLog = telemetry.logTimed("command", "manage_extensions");
      try {
        await manageExtensions();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.setupMcpServers", async () => {
      const endLog = telemetry.logTimed("command", "setup_mcp_servers");
      try {
        await setupMcpServers();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  // --- Secrets Management ---

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.manageSecrets", async () => {
      const endLog = telemetry.logTimed("command", "manage_secrets");
      try {
        await showTokenManagementPalette();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.detectEnvSecrets", async () => {
      const endLog = telemetry.logTimed("command", "detect_env_secrets");
      try {
        const { showEnvSecretsMigrationUI } =
          await import("./services/secretsManager");
        await showEnvSecretsMigrationUI();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.exportSecretsToEnv", async () => {
      const endLog = telemetry.logTimed("command", "export_secrets_to_env");
      try {
        const { showExportSecretsUI } =
          await import("./services/secretsManager");
        await showExportSecretsUI();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  // --- Audit & Preflight ---

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.runAudit", async () => {
      if (!(await requireCognitiveLevel("alex.runAudit"))) {
        return;
      }
      const endLog = telemetry.logTimed("command", "run_audit");
      try {
        const auditOptions = [
          {
            label: "$(checklist) Full Project Audit",
            description: "Comprehensive project health check",
            detail: "All categories below",
          },
          {
            label: "$(file-code) Code Quality",
            description: "Errors, warnings, code smells, patterns",
            detail: "High priority",
          },
          {
            label: "$(shield) Security Review",
            description: "Secrets, vulnerabilities, input validation",
            detail: "High priority",
          },
          {
            label: "$(package) Dependencies",
            description: "Outdated packages, vulnerabilities, unused",
            detail: "High priority",
          },
          {
            label: "$(cloud) Infrastructure as Code",
            description: "Terraform, Bicep, CloudFormation validation",
            detail: "High priority",
          },
          {
            label: "$(azure) Azure/Cloud Resources",
            description: "Resource configuration, best practices, costs",
            detail: "High priority",
          },
          {
            label: "$(dashboard) Performance",
            description: "Bundle size, load times, memory, bottlenecks",
            detail: "Medium priority",
          },
          {
            label: "$(eye) Accessibility",
            description: "WCAG compliance, a11y patterns, screen readers",
            detail: "Medium priority",
          },
          {
            label: "$(plug) API Design",
            description: "REST/GraphQL conventions, contracts, versioning",
            detail: "Medium priority",
          },
          {
            label: "$(law) License Compliance",
            description: "OSS license conflicts, attribution requirements",
            detail: "Medium priority",
          },
          {
            label: "$(book) Documentation",
            description: "README, comments, API docs completeness",
            detail: "Medium priority",
          },
          {
            label: "$(git-branch) Git Health",
            description: "Uncommitted changes, branch hygiene",
            detail: "Medium priority",
          },
          {
            label: "$(beaker) Test Coverage",
            description: "Test files, coverage gaps, test quality",
            detail: "Medium priority",
          },
          {
            label: "$(settings-gear) Configuration",
            description: "Config files, environment setup",
            detail: "Low priority",
          },
          {
            label: "$(folder) Project Structure",
            description: "File organization, naming conventions",
            detail: "Low priority",
          },
        ];

        const selected = await vscode.window.showQuickPick(auditOptions, {
          placeHolder: "Select audit type to run",
          title: "🔍 Project Audit",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        const auditType = selected.label.replace(/\$\([^)]+\)\s*/, "");
        await openChatPanel(`Run ${auditType.toLowerCase()} on this project`);

        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
        vscode.window.showErrorMessage(
          `Audit failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.releasePreflight", async () => {
      if (!(await requireCognitiveLevel("alex.releasePreflight"))) {
        return;
      }
      const endLog = telemetry.logTimed("command", "release_preflight");
      try {
        const preflightChecks = [
          {
            label: "$(rocket) Full Preflight",
            description: "Complete release readiness check",
            detail: "All checks before publishing",
          },
          {
            label: "$(versions) Version Alignment",
            description: "Check version consistency across files",
            detail: "package.json, changelog, docs",
          },
          {
            label: "$(git-commit) Git Status",
            description: "Uncommitted changes, branch status",
            detail: "Clean working directory",
          },
          {
            label: "$(package) Build Verification",
            description: "Compile, bundle, package check",
            detail: "Extension builds successfully",
          },
          {
            label: "$(checklist) Changelog Entry",
            description: "Verify changelog has entry for this version",
            detail: "Keep a Changelog format",
          },
          {
            label: "$(shield) Security Scan",
            description: "npm audit, secrets check",
            detail: "No vulnerabilities",
          },
          {
            label: "$(beaker) Test Suite",
            description: "Run tests, check coverage",
            detail: "All tests passing",
          },
          {
            label: "$(law) License Audit",
            description: "Check dependency licenses for conflicts",
            detail: "OSS compliance",
          },
          {
            label: "$(warning) Breaking Changes",
            description: "Detect API/schema breaking changes",
            detail: "Semantic versioning",
          },
          {
            label: "$(book) Documentation Coverage",
            description: "All exports documented, examples current",
            detail: "API docs complete",
          },
          {
            label: "$(globe) Localization",
            description: "i18n strings complete, no hardcoded text",
            detail: "For international releases",
          },
        ];

        const selected = await vscode.window.showQuickPick(preflightChecks, {
          placeHolder: "Select preflight check to run",
          title: "🚀 Release Preflight",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        const checkType = selected.label.replace(/\$\([^)]+\)\s*/, "");
        await openChatPanel(`Run ${checkType.toLowerCase()} check for release`);

        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  // --- Skill Catalog & Global Knowledge ---

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.generateSkillCatalog", async () => {
      const endLog = telemetry.logTimed("command", "generate_skill_catalog");
      try {
        await generateSkillCatalog();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.inheritSkillFromGlobal", async () => {
      if (!(await requireCognitiveLevel("alex.inheritSkillFromGlobal"))) {
        return;
      }
      const endLog = telemetry.logTimed("command", "inherit_skill_from_global");
      try {
        await inheritSkillFromGlobal();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.proposeSkillToGlobal", async () => {
      if (!(await requireCognitiveLevel("alex.proposeSkillToGlobal"))) {
        return;
      }
      const endLog = telemetry.logTimed("command", "propose_skill_to_global");
      try {
        await proposeSkillToGlobal();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("alex.setupGlobalKnowledge", async () => {
      const endLog = telemetry.logTimed("command", "setup_global_knowledge");
      try {
        await setupGlobalKnowledgeCommand();
        endLog(true);
      } catch (error) {
        endLog(
          false,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  // --- GitHub Integration ---



  // --- v6.0 Partnership Commands ---

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alex.recordPositiveOutcome",
      recordPositiveOutcomeCommand,
    ),
    vscode.commands.registerCommand(
      "alex.recordNegativeOutcome",
      recordNegativeOutcomeCommand,
    ),
    vscode.commands.registerCommand(
      "alex.showOutcomeStats",
      showOutcomeStatsCommand,
    ),
    vscode.commands.registerCommand("alex.runWorkflow", runWorkflowCommand),
    vscode.commands.registerCommand("alex.listWorkflows", listWorkflowsCommand),
    vscode.commands.registerCommand(
      "alex.showExpertiseModel",
      showExpertiseModelCommand,
    ),
  );
}
