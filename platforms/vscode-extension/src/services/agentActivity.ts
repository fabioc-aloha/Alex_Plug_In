import { EventEmitter, Event } from 'vscode';

export interface AgentActivity {
    id: string;
    agent: string;
    command: string;
    status: 'active' | 'complete' | 'error';
    startedAt: number;
    completedAt?: number;
    prompt: string;
}

const MAX_HISTORY = 20;

class AgentActivityService {
    private _activities: AgentActivity[] = [];
    private _onDidChange = new EventEmitter<void>();
    readonly onDidChange: Event<void> = this._onDidChange.event;

    start(agent: string, command: string, prompt: string): string {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        this._activities.unshift({
            id, agent, command,
            status: 'active',
            startedAt: Date.now(),
            prompt: prompt.slice(0, 80),
        });
        if (this._activities.length > MAX_HISTORY) { this._activities.pop(); }
        this._onDidChange.fire();
        return id;
    }

    complete(id: string, error?: boolean): void {
        const a = this._activities.find(x => x.id === id);
        if (a) {
            a.status = error ? 'error' : 'complete';
            a.completedAt = Date.now();
            this._onDidChange.fire();
        }
    }

    get activities(): readonly AgentActivity[] { return this._activities; }
    get activeCount(): number { return this._activities.filter(a => a.status === 'active').length; }
    get recentThreads(): AgentActivity[] { return this._activities.slice(0, 5); }
}

export const agentActivity = new AgentActivityService();
