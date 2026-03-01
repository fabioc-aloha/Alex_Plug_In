/**
 * Multi-Step Workflow Engine — v6.0.0
 *
 * Loads JSON workflow definitions from `.alex/workflows/` in the workspace
 * and executes them as sequential step chains: plan → research → build → validate → document.
 *
 * Workflow format (.alex/workflows/{id}.json):
 * {
 *   "id": "plan-build-review",
 *   "name": "Plan → Build → Review",
 *   "description": "...",
 *   "tags": ["development"],
 *   "steps": [
 *     { "label": "Plan", "type": "chat", "prompt": "Help me plan..." },
 *     { "label": "Review", "type": "command", "commandId": "alex.codeReview" }
 *   ]
 * }
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';

// ============================================================================
// Types
// ============================================================================

export interface WorkflowStep {
    label: string;
    type: 'chat' | 'command';
    /** For chat steps: the @alex prompt to send */
    prompt?: string;
    /** For command steps: VS Code command ID */
    commandId?: string;
    /** Optional args for command steps */
    args?: unknown[];
}

export interface WorkflowDefinition {
    id: string;
    name: string;
    description: string;
    tags?: string[];
    steps: WorkflowStep[];
}

// ============================================================================
// Default Workflows
// ============================================================================

const DEFAULT_WORKFLOWS: WorkflowDefinition[] = [
    {
        id: 'plan-build-review',
        name: 'Plan → Build → Review',
        description: 'Full development cycle: plan the feature, implement it, then review',
        tags: ['development', 'full-cycle'],
        steps: [
            {
                label: 'Plan the feature',
                type: 'chat',
                prompt: 'Help me plan this feature: what are the key decisions, edge cases, and implementation steps I should consider?',
            },
            {
                label: 'Research existing patterns',
                type: 'chat',
                prompt: 'Search my global knowledge and session history for related patterns and previous solutions I can reuse for this.',
            },
            {
                label: 'Code review',
                type: 'command',
                commandId: 'alex.codeReview',
            },
            {
                label: 'Document changes',
                type: 'chat',
                prompt: 'Help me document the changes I just made — what changed, why, and how to use the new functionality.',
            },
        ],
    },
    {
        id: 'debug-workflow',
        name: 'Debug → Fix → Verify',
        description: 'Systematic debugging: diagnose, fix, and prevent regression',
        tags: ['debugging'],
        steps: [
            {
                label: 'Diagnose the issue',
                type: 'chat',
                prompt: 'Help me diagnose this bug. What are the likely root causes and how should I investigate systematically?',
            },
            {
                label: 'Search session history',
                type: 'command',
                commandId: 'alex.recallSession',
            },
            {
                label: 'Write a regression test',
                type: 'chat',
                prompt: 'Help me write a test case that would catch this bug and prevent future regressions.',
            },
            {
                label: 'Review the fix',
                type: 'command',
                commandId: 'alex.codeReview',
            },
        ],
    },
    {
        id: 'research-first',
        name: 'Research-First Development',
        description: 'Build knowledge before writing code: research → design → implement',
        tags: ['research', 'architecture'],
        steps: [
            {
                label: 'Research the domain',
                type: 'chat',
                prompt: 'Before we write any code, help me build a knowledge base for this topic. What are the best patterns, common pitfalls, and key decisions I should understand?',
            },
            {
                label: 'Design the approach',
                type: 'chat',
                prompt: 'Based on our research, help me design the approach. What architecture makes the most sense given my constraints?',
            },
            {
                label: 'Implement with guidance',
                type: 'chat',
                prompt: 'Let\'s implement step by step. Start with the core data structures and most critical logic first.',
            },
            {
                label: 'Security review',
                type: 'command',
                commandId: 'alex.securityReview',
            },
        ],
    },
    {
        id: 'release-prep',
        name: 'Release Preparation',
        description: 'Prepare a release: security review, changelog, documentation, preflight',
        tags: ['release', 'devops'],
        steps: [
            {
                label: 'Security review',
                type: 'command',
                commandId: 'alex.securityReview',
            },
            {
                label: 'Code review uncommitted changes',
                type: 'command',
                commandId: 'alex.codeReview',
            },
            {
                label: 'Generate release notes',
                type: 'chat',
                prompt: 'Based on the recent changes in this codebase, help me write clear, user-facing release notes and a CHANGELOG entry.',
            },
            {
                label: 'Release preflight',
                type: 'command',
                commandId: 'alex.releasePreflight',
            },
        ],
    },
];

// ============================================================================
// Workflow Loading
// ============================================================================

function getWorkflowsDir(): string | undefined {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) { return undefined; }
    return path.join(folders[0].uri.fsPath, '.alex', 'workflows');
}

async function ensureDefaultWorkflows(): Promise<void> {
    const dir = getWorkflowsDir();
    if (!dir) { return; }
    await fs.ensureDir(dir);
    for (const wf of DEFAULT_WORKFLOWS) {
        const dest = path.join(dir, `${wf.id}.json`);
        if (!await fs.pathExists(dest)) {
            await fs.writeJson(dest, wf, { spaces: 2 });
        }
    }
}

export async function listWorkflows(): Promise<WorkflowDefinition[]> {
    const dir = getWorkflowsDir();
    if (!dir) {
        // No workspace — return built-in defaults directly
        return DEFAULT_WORKFLOWS;
    }

    await ensureDefaultWorkflows();

    let files: string[] = [];
    try {
        files = (await fs.readdir(dir)).filter(f => f.endsWith('.json'));
    } catch {
        return DEFAULT_WORKFLOWS;
    }

    const workflows: WorkflowDefinition[] = [];
    for (const f of files) {
        try {
            const wf = await fs.readJson(path.join(dir, f)) as WorkflowDefinition;
            if (wf.id && wf.name && Array.isArray(wf.steps) && wf.steps.length > 0) {
                workflows.push(wf);
            }
        } catch { /* skip malformed */ }
    }
    return workflows;
}

// ============================================================================
// Workflow Execution
// ============================================================================

async function executeWorkflow(wf: WorkflowDefinition): Promise<void> {
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: `Alex Workflow: ${wf.name}`,
            cancellable: true,
        },
        async (progress, token) => {
            const total = wf.steps.length;

            for (let i = 0; i < total; i++) {
                if (token.isCancellationRequested) {
                    vscode.window.showInformationMessage(`Workflow "${wf.name}" cancelled at step ${i + 1}.`);
                    break;
                }

                const step = wf.steps[i];
                const stepLabel = `Step ${i + 1}/${total}: ${step.label}`;
                progress.report({ message: stepLabel, increment: 100 / total });

                if (step.type === 'chat' && step.prompt) {
                    const query = `@alex [Workflow: ${wf.name} • ${stepLabel}]\n\n${step.prompt}`;
                    await vscode.commands.executeCommand('workbench.action.chat.open', { query })
                        .then(undefined, () => {});

                    // After last step, no need to prompt continuation
                    if (i < total - 1) {
                        const next = await vscode.window.showInformationMessage(
                            `✓ ${step.label} — ready for the next step?`,
                            { modal: false },
                            'Continue',
                            'Stop workflow',
                        );
                        if (next !== 'Continue') { break; }
                    }

                } else if (step.type === 'command' && step.commandId) {
                    try {
                        await vscode.commands.executeCommand(step.commandId, ...(step.args ?? []));
                        // Small delay to let the command UI settle
                        await new Promise(r => setTimeout(r, 500));
                    } catch (err) {
                        const cont = await vscode.window.showWarningMessage(
                            `Step "${step.label}" failed: ${err instanceof Error ? err.message : String(err)}`,
                            'Continue anyway',
                            'Stop workflow',
                        );
                        if (cont !== 'Continue anyway') { break; }
                    }
                }
            }

            vscode.window.showInformationMessage(`✅ Workflow "${wf.name}" complete.`);
        }
    );
}

// ============================================================================
// Commands
// ============================================================================

/** alex.runWorkflow — pick and run a workflow */
export async function runWorkflowCommand(): Promise<void> {
    const workflows = await listWorkflows();

    const items = workflows.map(wf => ({
        label: `$(play) ${wf.name}`,
        description: wf.tags?.join(', ') ?? '',
        detail: `${wf.description}  ·  ${wf.steps.length} steps`,
        workflow: wf,
    }));

    const chosen = await vscode.window.showQuickPick(items, {
        title: 'Alex Workflows — Select a workflow to run',
        placeHolder: 'Choose a workflow or add your own to .alex/workflows/',
    });

    if (!chosen) { return; }
    await executeWorkflow(chosen.workflow);
}

/** alex.listWorkflows — show available workflows (read-only) */
export async function listWorkflowsCommand(): Promise<void> {
    const workflows = await listWorkflows();

    const panel = vscode.window.createOutputChannel('Alex Workflows');
    panel.clear();
    panel.appendLine('');
    panel.appendLine('  Alex Workflows — Available');
    panel.appendLine('  ' + '═'.repeat(50));
    panel.appendLine('');
    for (const wf of workflows) {
        panel.appendLine(`  ${wf.name}  (${wf.tags?.join(', ') ?? 'no tags'})`);
        panel.appendLine(`    ${wf.description}`);
        for (let i = 0; i < wf.steps.length; i++) {
            const step = wf.steps[i];
            const icon = step.type === 'chat' ? '💬' : '⚡';
            panel.appendLine(`    ${i + 1}. ${icon} ${step.label}`);
        }
        panel.appendLine('');
    }
    const dir = getWorkflowsDir();
    if (dir) {
        panel.appendLine(`  Custom workflows: ${dir}`);
    }
    panel.show();
}
