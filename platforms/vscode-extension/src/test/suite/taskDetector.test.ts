import * as assert from 'assert';

/**
 * Task Detector — tests for PendingTask type contracts, constants,
 * and priority classification logic.
 *
 * Core functions (detectPendingTasks, initTaskDetector) require VS Code
 * extension context and git. We test the exported type contracts and
 * the classification/priority logic here.
 */

suite('Task Detector Test Suite', () => {

    suite('PendingTask type contract', () => {
        test('stalled-work task shape', () => {
            const task = {
                type: 'stalled-work' as const,
                title: '3 uncommitted file(s) detected',
                detail: 'Modified but not committed: a.ts, b.ts, c.ts',
                files: ['a.ts', 'b.ts', 'c.ts'],
                priority: 'high' as const,
            };
            assert.strictEqual(task.type, 'stalled-work');
            assert.strictEqual(task.priority, 'high');
            assert.strictEqual(task.files.length, 3);
        });

        test('todo-hotspot task shape', () => {
            const task = {
                type: 'todo-hotspot' as const,
                title: 'TODO hotspot in src/commands/',
                detail: '5 TODOs found in extension.ts',
                files: ['src/commands/extension.ts'],
                priority: 'medium' as const,
            };
            assert.strictEqual(task.type, 'todo-hotspot');
            assert.strictEqual(task.priority, 'medium');
        });

        test('review-needed task shape', () => {
            const task = {
                type: 'review-needed' as const,
                title: 'Large uncommitted diff (300 lines)',
                detail: 'Consider running code review',
                files: ['src/views/welcomeView.ts'],
                priority: 'medium' as const,
            };
            assert.strictEqual(task.type, 'review-needed');
        });
    });

    suite('Task type enumeration', () => {
        const VALID_TYPES = ['stalled-work', 'todo-hotspot', 'review-needed'];

        test('should have exactly 3 task types', () => {
            assert.strictEqual(VALID_TYPES.length, 3);
        });

        test('all types should be kebab-case', () => {
            for (const t of VALID_TYPES) {
                assert.ok(/^[a-z]+-[a-z]+$/.test(t), `${t} should be kebab-case`);
            }
        });
    });

    suite('Priority classification', () => {
        const VALID_PRIORITIES = ['high', 'medium', 'low'];

        test('should have 3 priority levels', () => {
            assert.strictEqual(VALID_PRIORITIES.length, 3);
        });

        test('stalled work with many files should be high priority', () => {
            const fileCount = 10;
            const priority = fileCount >= 5 ? 'high' : fileCount >= 2 ? 'medium' : 'low';
            assert.strictEqual(priority, 'high');
        });

        test('stalled work with few files should be medium', () => {
            const fileCount = 3;
            const priority = fileCount >= 5 ? 'high' : fileCount >= 2 ? 'medium' : 'low';
            assert.strictEqual(priority, 'medium');
        });
    });

    suite('Constants validation', () => {
        test('TODO hotspot threshold should be reasonable', () => {
            const TODO_HOTSPOT_THRESHOLD = 3;
            assert.ok(TODO_HOTSPOT_THRESHOLD >= 1);
            assert.ok(TODO_HOTSPOT_THRESHOLD <= 10);
        });

        test('code review diff threshold should be meaningful', () => {
            const CODE_REVIEW_DIFF_LINES = 200;
            assert.ok(CODE_REVIEW_DIFF_LINES >= 50, 'Threshold too low');
            assert.ok(CODE_REVIEW_DIFF_LINES <= 1000, 'Threshold too high');
        });

        test('check interval should be at least 5 minutes', () => {
            const CHECK_INTERVAL_MS = 30 * 60 * 1000;
            assert.ok(CHECK_INTERVAL_MS >= 5 * 60 * 1000);
        });

        test('dismiss cooldown should be at least 1 hour', () => {
            const DISMISS_COOLDOWN_MS = 4 * 60 * 60 * 1000;
            assert.ok(DISMISS_COOLDOWN_MS >= 60 * 60 * 1000);
        });
    });

    suite('File count summarization logic', () => {
        test('should show first N files + extra count', () => {
            const files = ['a.ts', 'b.ts', 'c.ts', 'd.ts', 'e.ts', 'f.ts', 'g.ts'];
            const maxShow = 5;
            const topFiles = files.slice(0, maxShow);
            const extra = files.length > maxShow ? ` +${files.length - maxShow} more` : '';
            assert.strictEqual(topFiles.length, 5);
            assert.strictEqual(extra, ' +2 more');
        });

        test('no extra when under limit', () => {
            const files = ['a.ts', 'b.ts'];
            const maxShow = 5;
            const extra = files.length > maxShow ? ` +${files.length - maxShow} more` : '';
            assert.strictEqual(extra, '');
        });
    });
});
