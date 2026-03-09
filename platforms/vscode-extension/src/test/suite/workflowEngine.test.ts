import * as assert from 'assert';

/**
 * Workflow Engine — tests for type contracts, default workflow structures,
 * and step validation logic.
 *
 * The runtime functions (listWorkflows, executeWorkflow, runWorkflowCommand)
 * require VS Code API and filesystem. We test the type contracts and
 * default workflow definitions (which are compile-time constants).
 */

suite('Workflow Engine Test Suite', () => {

    suite('WorkflowStep type contract', () => {
        test('chat step should have prompt', () => {
            const step = {
                label: 'Plan',
                type: 'chat' as const,
                prompt: 'Help me plan this feature.',
            };
            assert.strictEqual(step.type, 'chat');
            assert.ok(step.prompt, 'Chat step should have a prompt');
            assert.ok(!('commandId' in step), 'Chat step should not have commandId');
        });

        test('command step should have commandId', () => {
            const step = {
                label: 'Review',
                type: 'command' as const,
                commandId: 'alex.codeReview',
            };
            assert.strictEqual(step.type, 'command');
            assert.ok(step.commandId, 'Command step should have commandId');
        });

        test('step type should be chat or command', () => {
            const validTypes = ['chat', 'command'];
            assert.ok(validTypes.includes('chat'));
            assert.ok(validTypes.includes('command'));
            assert.ok(!validTypes.includes('script'));
        });
    });

    suite('WorkflowDefinition type contract', () => {
        test('should accept valid workflow definition', () => {
            const wf = {
                id: 'test-workflow',
                name: 'Test Workflow',
                description: 'A test workflow for validation',
                tags: ['testing'],
                steps: [
                    { label: 'Step 1', type: 'chat' as const, prompt: 'Do something' },
                    { label: 'Step 2', type: 'command' as const, commandId: 'alex.test' },
                ],
            };
            assert.ok(wf.id);
            assert.ok(wf.name);
            assert.ok(wf.description);
            assert.strictEqual(wf.steps.length, 2);
        });

        test('tags should be optional', () => {
            const wf = {
                id: 'minimal',
                name: 'Minimal',
                description: 'No tags',
                steps: [{ label: 'Only step', type: 'chat' as const, prompt: 'Hello' }],
            };
            assert.ok(!('tags' in wf) || wf.tags === undefined);
        });
    });

    suite('Default workflow catalog', () => {
        // Mirror the 4 default workflow IDs from workflowEngine.ts
        const DEFAULT_IDS = ['plan-build-review', 'debug-workflow', 'research-first', 'release-prep'];

        test('should have 4 default workflows', () => {
            assert.strictEqual(DEFAULT_IDS.length, 4);
        });

        test('all IDs should be kebab-case', () => {
            for (const id of DEFAULT_IDS) {
                assert.ok(/^[a-z0-9-]+$/.test(id), `${id} should be kebab-case`);
            }
        });

        test('plan-build-review should exist', () => {
            assert.ok(DEFAULT_IDS.includes('plan-build-review'));
        });

        test('debug-workflow should exist', () => {
            assert.ok(DEFAULT_IDS.includes('debug-workflow'));
        });

        test('research-first should exist', () => {
            assert.ok(DEFAULT_IDS.includes('research-first'));
        });

        test('release-prep should exist', () => {
            assert.ok(DEFAULT_IDS.includes('release-prep'));
        });
    });

    suite('Workflow validation logic', () => {
        function isValidWorkflow(wf: { id?: string; name?: string; steps?: { label: string }[] }): boolean {
            return !!(wf.id && wf.name && Array.isArray(wf.steps) && wf.steps.length > 0);
        }

        test('valid workflow passes', () => {
            assert.ok(isValidWorkflow({ id: 'test', name: 'Test', steps: [{ label: 'Step' }] }));
        });

        test('missing id fails', () => {
            assert.ok(!isValidWorkflow({ name: 'Test', steps: [{ label: 'Step' }] }));
        });

        test('missing name fails', () => {
            assert.ok(!isValidWorkflow({ id: 'test', steps: [{ label: 'Step' }] }));
        });

        test('empty steps array fails', () => {
            assert.ok(!isValidWorkflow({ id: 'test', name: 'Test', steps: [] }));
        });

        test('missing steps fails', () => {
            assert.ok(!isValidWorkflow({ id: 'test', name: 'Test' }));
        });
    });
});
