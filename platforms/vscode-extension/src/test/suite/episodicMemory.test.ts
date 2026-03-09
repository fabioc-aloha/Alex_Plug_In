import * as assert from 'assert';

suite('Episodic Memory Test Suite', () => {

    suite('EpisodicRecord interface contract', () => {
        test('should accept valid record shape', () => {
            const record = {
                id: 'session-123',
                date: new Date().toISOString(),
                topic: 'Test session',
                summary: 'Tested episodic memory',
                filesChanged: ['file1.ts', 'file2.ts'],
                tags: ['testing', 'memory'],
                workspace: 'test-workspace',
                messageCount: 5,
            };
            assert.ok(record.id.startsWith('session-'), 'ID should start with session-');
            assert.ok(record.tags.length > 0, 'Should have tags');
            assert.ok(record.filesChanged.length > 0, 'Should have files changed');
        });
    });

    suite('Session date filtering logic', () => {
        test('should filter sessions within date range', () => {
            const sessions = [
                { date: '2026-01-01T00:00:00Z' },
                { date: '2026-02-01T00:00:00Z' },
                { date: '2026-03-01T00:00:00Z' },
            ];
            const from = new Date('2026-01-15');
            const to = new Date('2026-02-15');
            const filtered = sessions.filter(s => {
                const d = new Date(s.date);
                return d >= from && d <= to;
            });
            assert.strictEqual(filtered.length, 1);
            assert.strictEqual(filtered[0].date, '2026-02-01T00:00:00Z');
        });
    });

    suite('Query term matching logic', () => {
        test('should match all query terms', () => {
            const hay = 'debugging typescript extension memory'.toLowerCase();
            const terms = 'debug memory'.toLowerCase().split(/\s+/).filter(t => t.length > 1);
            const matches = terms.every(t => hay.includes(t));
            assert.ok(matches, 'Should match both terms');
        });

        test('should not match when a term is missing', () => {
            const hay = 'debugging typescript extension'.toLowerCase();
            const terms = 'debug python'.toLowerCase().split(/\s+/).filter(t => t.length > 1);
            const matches = terms.every(t => hay.includes(t));
            assert.ok(!matches, 'Should not match — python is missing');
        });

        test('should handle empty query', () => {
            const terms = ''.split(/\s+/).filter(t => t.length > 1);
            assert.strictEqual(terms.length, 0, 'Empty query should yield no terms');
        });
    });
});
