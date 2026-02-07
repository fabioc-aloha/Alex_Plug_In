import * as assert from 'assert';
import * as vscode from 'vscode';
import { CognitiveTaskProvider } from '../../tasks/cognitiveTaskProvider';

suite('Cognitive Task Provider Test Suite', () => {

    test('should have correct task type', () => {
        assert.strictEqual(CognitiveTaskProvider.type, 'alex-cognitive');
    });

    test('should provide tasks', async () => {
        const provider = new CognitiveTaskProvider();
        const token = new vscode.CancellationTokenSource().token;
        
        const tasks = await provider.provideTasks(token);
        
        assert.ok(Array.isArray(tasks), 'provideTasks should return an array');
        assert.ok(tasks && tasks.length >= 4, 'Should provide at least 4 cognitive tasks');
    });

    test('should include Meditate task', async () => {
        const provider = new CognitiveTaskProvider();
        const token = new vscode.CancellationTokenSource().token;
        
        const tasks = await provider.provideTasks(token);
        const meditateTask = tasks?.find(t => t.name === 'Alex: Meditate');
        
        assert.ok(meditateTask, 'Meditate task should exist');
        assert.strictEqual(meditateTask?.detail, 'Consolidate knowledge and update memory files');
    });

    test('should include Dream task', async () => {
        const provider = new CognitiveTaskProvider();
        const token = new vscode.CancellationTokenSource().token;
        
        const tasks = await provider.provideTasks(token);
        const dreamTask = tasks?.find(t => t.name === 'Alex: Dream');
        
        assert.ok(dreamTask, 'Dream task should exist');
        assert.strictEqual(dreamTask?.detail, 'Neural maintenance — validate synaptic connections');
    });

    test('should include Self-Actualize task', async () => {
        const provider = new CognitiveTaskProvider();
        const token = new vscode.CancellationTokenSource().token;
        
        const tasks = await provider.provideTasks(token);
        const selfActualizeTask = tasks?.find(t => t.name === 'Alex: Self-Actualize');
        
        assert.ok(selfActualizeTask, 'Self-Actualize task should exist');
    });

    test('should include Sync Knowledge task', async () => {
        const provider = new CognitiveTaskProvider();
        const token = new vscode.CancellationTokenSource().token;
        
        const tasks = await provider.provideTasks(token);
        const syncTask = tasks?.find(t => t.name === 'Alex: Sync Knowledge');
        
        assert.ok(syncTask, 'Sync Knowledge task should exist');
    });

    test('tasks should have CustomExecution', async () => {
        const provider = new CognitiveTaskProvider();
        const token = new vscode.CancellationTokenSource().token;
        
        const tasks = await provider.provideTasks(token);
        
        for (const task of tasks || []) {
            assert.ok(task.execution, `Task ${task.name} should have an execution`);
        }
    });

    test('tasks should have silent reveal option', async () => {
        const provider = new CognitiveTaskProvider();
        const token = new vscode.CancellationTokenSource().token;
        
        const tasks = await provider.provideTasks(token);
        
        for (const task of tasks || []) {
            assert.strictEqual(
                task.presentationOptions?.reveal, 
                vscode.TaskRevealKind.Silent,
                `Task ${task.name} should have silent reveal`
            );
        }
    });
});
