import * as vscode from 'vscode';

/**
 * Alex Cognitive Task Provider
 * 
 * Exposes cognitive commands (Meditate, Dream, Self-Actualize, Sync Knowledge)
 * as VS Code tasks. Users can run them from the "Run Task" command palette
 * or add them to tasks.json for keyboard shortcuts.
 */

interface CognitiveTaskDefinition extends vscode.TaskDefinition {
    /** The cognitive command to execute */
    command: string;
}

const COGNITIVE_TASKS: Array<{
    label: string;
    command: string;
    detail: string;
}> = [
    {
        label: 'Alex: Meditate',
        command: 'alex.meditate',
        detail: 'Consolidate knowledge and update memory files',
    },
    {
        label: 'Alex: Dream',
        command: 'alex.dream',
        detail: 'Neural maintenance — validate synaptic connections',
    },
    {
        label: 'Alex: Self-Actualize',
        command: 'alex.selfActualize',
        detail: 'Deep self-assessment with comprehensive report',
    },
    {
        label: 'Alex: Sync Knowledge',
        command: 'alex.syncKnowledge',
        detail: 'Synchronize global knowledge base',
    },
];

export class CognitiveTaskProvider implements vscode.TaskProvider {

    static readonly type = 'alex-cognitive';

    provideTasks(_token: vscode.CancellationToken): vscode.ProviderResult<vscode.Task[]> {
        return COGNITIVE_TASKS.map(taskDef => {
            const definition: CognitiveTaskDefinition = {
                type: CognitiveTaskProvider.type,
                command: taskDef.command,
            };

            // Use a CustomExecution that runs the VS Code command directly
            const execution = new vscode.CustomExecution(async () => {
                return new CognitiveTaskTerminal(taskDef.command, taskDef.label);
            });

            const task = new vscode.Task(
                definition,
                vscode.TaskScope.Workspace,
                taskDef.label,
                'Alex Cognitive',
                execution
            );
            task.detail = taskDef.detail;
            task.presentationOptions = {
                reveal: vscode.TaskRevealKind.Silent,
                panel: vscode.TaskPanelKind.Shared,
            };

            return task;
        });
    }

    resolveTask(task: vscode.Task, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.Task> {
        // resolveTask is called for tasks defined in tasks.json
        const definition = task.definition as CognitiveTaskDefinition;
        if (definition.command) {
            const execution = new vscode.CustomExecution(async () => {
                return new CognitiveTaskTerminal(definition.command, task.name);
            });
            return new vscode.Task(
                definition,
                task.scope ?? vscode.TaskScope.Workspace,
                task.name,
                'Alex Cognitive',
                execution
            );
        }
        return undefined;
    }
}

/**
 * Pseudoterminal that executes a VS Code command and reports completion
 */
class CognitiveTaskTerminal implements vscode.Pseudoterminal {
    private writeEmitter = new vscode.EventEmitter<string>();
    private closeEmitter = new vscode.EventEmitter<number>();

    onDidWrite: vscode.Event<string> = this.writeEmitter.event;
    onDidClose: vscode.Event<number> = this.closeEmitter.event;

    constructor(
        private readonly command: string,
        private readonly label: string
    ) {}

    open(): void {
        this.run();
    }

    close(): void {
        // Nothing to clean up
    }

    private async run(): Promise<void> {
        this.writeEmitter.fire(`🧠 Running ${this.label}...\r\n`);

        try {
            await vscode.commands.executeCommand(this.command);
            this.writeEmitter.fire(`✅ ${this.label} completed.\r\n`);
            this.closeEmitter.fire(0);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.writeEmitter.fire(`❌ ${this.label} failed: ${message}\r\n`);
            this.closeEmitter.fire(1);
        }
    }
}
