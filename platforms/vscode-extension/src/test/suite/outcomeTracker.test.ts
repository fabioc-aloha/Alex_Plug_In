import * as assert from 'assert';
import { getConfidenceForDomain, getConfidenceHint, getDomainStats } from '../../services/outcomeTracker';

suite('Outcome Tracker Test Suite', () => {

    suite('getConfidenceForDomain', () => {
        test('should return 0.7 default when no records exist', () => {
            // Without initOutcomeTracker, loadRecords returns []
            const score = getConfidenceForDomain('coding');
            assert.strictEqual(score, 0.7, 'Default confidence should be 0.7');
        });

        test('should return 0.7 for unknown domain', () => {
            const score = getConfidenceForDomain('nonexistent');
            assert.strictEqual(score, 0.7);
        });

        test('should return number between 0 and 1', () => {
            const score = getConfidenceForDomain('testing');
            assert.ok(score >= 0 && score <= 1, `Score ${score} out of range`);
        });
    });

    suite('getConfidenceHint', () => {
        test('should return moderate confidence hint for default 0.7', () => {
            const hint = getConfidenceHint('coding');
            assert.ok(hint.includes('confidence'), 'Hint should mention confidence');
            assert.ok(hint.includes('coding'), 'Hint should mention the domain');
        });

        test('should return a string', () => {
            const hint = getConfidenceHint('debugging');
            assert.strictEqual(typeof hint, 'string');
            assert.ok(hint.length > 0, 'Hint should not be empty');
        });
    });

    suite('getDomainStats', () => {
        test('should return an array', () => {
            const stats = getDomainStats();
            assert.ok(Array.isArray(stats));
        });

        test('should return empty array when no records', () => {
            // Without init, no records exist
            const stats = getDomainStats();
            assert.strictEqual(stats.length, 0);
        });
    });
});
