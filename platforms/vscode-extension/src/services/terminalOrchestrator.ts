/**
 * Terminal Orchestrator Service — v7.2.0
 *
 * Multi-step terminal workflow engine leveraging VS Code 1.115 background
 * terminal notifications. Runs sequential commands (build > test > deploy)
 * where each step depends on the previous step's exit code.
 *
 * VS Code 1.115 unlocks:
 *   - Background terminals notify agents on command completion (exit code + output)
 *   - `send_to_terminal` sends commands with user confirmation
 *   - Input prompts in background terminals are detected and surfaced
 *
 * Architecture:
 *   - WorkflowStep: single command with success/failure criteria
 *   - TerminalWorkflow: ordered sequence of steps
 *   - Orchestrator: manages execution, tracks state, emits events
 *   - Integrates with sessionTrace for meditation analysis
 *
 * @see ROADMAP.md — v7.2.0 #9 Background Terminal Orchestration
 */

import * as vscode from "vscode";
import { EventEmitter, Event } from "vscode";
import { sessionTrace } from "./sessionTrace";
import { logInfo } from "../shared/logger";

// ============================================================================
// Types
// ============================================================================

export type StepStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "skipped";

export interface TerminalStep {
  /** Human-readable label shown in progress */
  label: string;
  /** Shell command to execute */
  command: string;
  /** Working directory (relative to workspace root, or absolute) */
  cwd?: string;
  /** Max time to wait for completion (ms). Default: 120_000 (2 min) */
  timeoutMs?: number;
  /** Whether to continue the workflow on failure (default: false = abort) */
  continueOnFailure?: boolean;
}

export interface TerminalWorkflowDefinition {
  /** Unique workflow identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Steps executed sequentially */
  steps: TerminalStep[];
  /** Whether to reuse a single terminal or create one per step */
  reuseTerminal?: boolean;
}

export interface StepResult {
  step: TerminalStep;
  status: StepStatus;
  exitCode?: number;
  /** Captured output (last N lines) */
  output?: string;
  durationMs: number;
  startedAt: number;
}

export interface WorkflowResult {
  workflowId: string;
  workflowName: string;
  status: "success" | "failed" | "cancelled";
  steps: StepResult[];
  totalDurationMs: number;
}

export interface WorkflowProgress {
  workflowId: string;
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  stepStatus: StepStatus;
}

// ============================================================================
// Built-in Workflow Templates
// ============================================================================

export const WORKFLOW_TEMPLATES: TerminalWorkflowDefinition[] = [
  {
    id: "build-test",
    name: "Build and Test",
    reuseTerminal: true,
    steps: [
      { label: "Compile", command: "npm run compile", timeoutMs: 60_000 },
      { label: "Test", command: "npm test", timeoutMs: 120_000 },
    ],
  },
  {
    id: "build-test-package",
    name: "Build, Test, and Package",
    reuseTerminal: true,
    steps: [
      { label: "Compile", command: "npm run compile", timeoutMs: 60_000 },
      { label: "Lint", command: "npm run lint", timeoutMs: 30_000 },
      { label: "Test", command: "npm test", timeoutMs: 120_000 },
      { label: "Package", command: "npm run package", timeoutMs: 60_000 },
    ],
  },
  {
    id: "quality-gates",
    name: "Run All Quality Gates",
    reuseTerminal: true,
    steps: [
      { label: "Compile", command: "npm run compile", timeoutMs: 60_000 },
      { label: "Lint", command: "npm run lint", timeoutMs: 30_000 },
      {
        label: "Lint Docs",
        command: "node scripts/lint-docs.cjs",
        timeoutMs: 30_000,
        continueOnFailure: true,
      },
      {
        label: "Audit Synapses",
        command: "node scripts/audit-synapses.cjs",
        timeoutMs: 30_000,
        continueOnFailure: true,
      },
      {
        label: "Audit Architecture",
        command: "node scripts/audit-architecture.cjs",
        timeoutMs: 30_000,
        continueOnFailure: true,
      },
    ],
  },
];

// ============================================================================
// Service
// ============================================================================

const DEFAULT_TIMEOUT_MS = 120_000;

class TerminalOrchestratorService {
  private _onDidProgress = new EventEmitter<WorkflowProgress>();
  readonly onDidProgress: Event<WorkflowProgress> = this._onDidProgress.event;

  private _onDidComplete = new EventEmitter<WorkflowResult>();
  readonly onDidComplete: Event<WorkflowResult> = this._onDidComplete.event;

  private _activeWorkflow: string | null = null;

  /** Whether a workflow is currently running */
  get isRunning(): boolean {
    return this._activeWorkflow !== null;
  }

  /** Get the active workflow ID */
  get activeWorkflowId(): string | null {
    return this._activeWorkflow;
  }

  /**
   * Execute a terminal workflow sequentially.
   * Each step waits for the previous to complete before proceeding.
   */
  async execute(
    workflow: TerminalWorkflowDefinition,
    token: vscode.CancellationToken,
    workspaceRoot?: string,
  ): Promise<WorkflowResult> {
    if (this._activeWorkflow) {
      throw new Error(`Workflow "${this._activeWorkflow}" is already running`);
    }

    this._activeWorkflow = workflow.id;
    const results: StepResult[] = [];
    const workflowStart = Date.now();

    sessionTrace.record(
      "tool-call",
      "Orchestrator",
      `workflow:${workflow.id}`,
      {
        steps: workflow.steps.length,
      },
    );

    logInfo(
      `[TerminalOrchestrator] Starting workflow: ${workflow.name} (${workflow.steps.length} steps)`,
    );

    let terminal: vscode.Terminal | undefined;

    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        if (token.isCancellationRequested) {
          // Mark remaining steps as skipped
          for (let j = i; j < workflow.steps.length; j++) {
            results.push({
              step: workflow.steps[j],
              status: "skipped",
              durationMs: 0,
              startedAt: Date.now(),
            });
          }
          break;
        }

        const step = workflow.steps[i];

        this._onDidProgress.fire({
          workflowId: workflow.id,
          currentStep: i + 1,
          totalSteps: workflow.steps.length,
          stepLabel: step.label,
          stepStatus: "running",
        });

        // Create or reuse terminal
        if (!terminal || !workflow.reuseTerminal) {
          const cwd = step.cwd
            ? vscode.Uri.file(step.cwd)
            : workspaceRoot
              ? vscode.Uri.file(workspaceRoot)
              : undefined;

          terminal = vscode.window.createTerminal({
            name: `Alex: ${workflow.name}`,
            cwd,
            isTransient: true,
          });
        }

        const stepResult = await this._executeStep(step, terminal, token);
        results.push(stepResult);

        sessionTrace.record(
          stepResult.status === "success" ? "tool-result" : "error",
          "Orchestrator",
          `${step.label}: ${stepResult.status} (exit ${stepResult.exitCode ?? "?"})`,
          { durationMs: stepResult.durationMs },
        );

        this._onDidProgress.fire({
          workflowId: workflow.id,
          currentStep: i + 1,
          totalSteps: workflow.steps.length,
          stepLabel: step.label,
          stepStatus: stepResult.status,
        });

        // Abort on failure unless step allows continuation
        if (stepResult.status === "failed" && !step.continueOnFailure) {
          // Mark remaining steps as skipped
          for (let j = i + 1; j < workflow.steps.length; j++) {
            results.push({
              step: workflow.steps[j],
              status: "skipped",
              durationMs: 0,
              startedAt: Date.now(),
            });
          }
          break;
        }
      }
    } finally {
      this._activeWorkflow = null;
    }

    const hasFailure = results.some((r) => r.status === "failed");
    const wasCancelled = token.isCancellationRequested;

    const result: WorkflowResult = {
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: wasCancelled ? "cancelled" : hasFailure ? "failed" : "success",
      steps: results,
      totalDurationMs: Date.now() - workflowStart,
    };

    sessionTrace.record(
      "tool-result",
      "Orchestrator",
      `workflow:${workflow.id} => ${result.status}`,
      {
        durationMs: result.totalDurationMs,
        stepsRun: results.filter((r) => r.status !== "skipped").length,
      },
    );

    logInfo(
      `[TerminalOrchestrator] Workflow ${workflow.name} completed: ${result.status} in ${result.totalDurationMs}ms`,
    );

    this._onDidComplete.fire(result);
    return result;
  }

  /**
   * Execute a single step in the terminal.
   * Uses shell integration to detect command completion and exit code.
   */
  private async _executeStep(
    step: TerminalStep,
    terminal: vscode.Terminal,
    token: vscode.CancellationToken,
  ): Promise<StepResult> {
    const startedAt = Date.now();
    const timeout = step.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    logInfo(
      `[TerminalOrchestrator] Running step: ${step.label} => ${step.command}`,
    );

    return new Promise<StepResult>((resolve) => {
      const disposables: vscode.Disposable[] = [];

      const finish = (status: StepStatus, exitCode?: number) => {
        disposables.forEach((d) => d.dispose());
        resolve({
          step,
          status,
          exitCode,
          durationMs: Date.now() - startedAt,
          startedAt,
        });
      };

      // Listen for shell integration command completion
      // VS Code 1.115: background terminals report exit codes automatically
      if (vscode.window.onDidEndTerminalShellExecution) {
        disposables.push(
          vscode.window.onDidEndTerminalShellExecution((e) => {
            if (e.terminal === terminal) {
              const code = e.exitCode;
              finish(code === 0 ? "success" : "failed", code);
            }
          }),
        );
      }

      // Cancellation listener
      disposables.push(
        token.onCancellationRequested(() => {
          finish("skipped");
        }),
      );

      // Timeout guard
      const timer = setTimeout(() => {
        logInfo(
          `[TerminalOrchestrator] Step "${step.label}" timed out after ${timeout}ms`,
        );
        finish("failed", -1);
      }, timeout);
      disposables.push({ dispose: () => clearTimeout(timer) });

      // Send the command
      terminal.sendText(step.command);
    });
  }

  /**
   * Get a workflow template by ID.
   */
  getTemplate(id: string): TerminalWorkflowDefinition | undefined {
    return WORKFLOW_TEMPLATES.find((w) => w.id === id);
  }

  /**
   * List available workflow template IDs.
   */
  get templateIds(): string[] {
    return WORKFLOW_TEMPLATES.map((w) => w.id);
  }

  /**
   * Format workflow result as markdown for chat responses.
   */
  formatResultMarkdown(result: WorkflowResult): string {
    const icon =
      result.status === "success"
        ? "✅"
        : result.status === "cancelled"
          ? "⚠️"
          : "❌";
    const duration =
      result.totalDurationMs < 60_000
        ? `${(result.totalDurationMs / 1000).toFixed(1)}s`
        : `${(result.totalDurationMs / 60_000).toFixed(1)}min`;

    const lines = [
      `### ${icon} Workflow: ${result.workflowName}`,
      "",
      `| Step | Status | Duration |`,
      `|------|--------|----------|`,
    ];

    for (const sr of result.steps) {
      const sIcon =
        sr.status === "success"
          ? "✅"
          : sr.status === "failed"
            ? "❌"
            : sr.status === "skipped"
              ? "⏭️"
              : "🔄";
      const sDuration =
        sr.durationMs < 1000
          ? `${sr.durationMs}ms`
          : `${(sr.durationMs / 1000).toFixed(1)}s`;
      const exitInfo =
        sr.exitCode !== undefined ? ` (exit ${sr.exitCode})` : "";
      lines.push(
        `| ${sIcon} ${sr.step.label} | ${sr.status}${exitInfo} | ${sDuration} |`,
      );
    }

    lines.push("", `**Total**: ${duration} | **Result**: ${result.status}`);
    return lines.join("\n");
  }
}

export const terminalOrchestrator = new TerminalOrchestratorService();
