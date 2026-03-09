import * as assert from 'assert';
import { generateKnowledgeId } from '../../chat/globalKnowledgeOps';

suite('Global Knowledge Test Suite', () => {

    suite('generateKnowledgeId', () => {

        test('should generate pattern ID with GKP prefix', () => {
            const id = generateKnowledgeId('pattern', 'My Test Pattern');
            assert.ok(id.startsWith('GKP-'), `Expected GKP- prefix, got: ${id}`);
        });

        test('should generate insight ID with GKI prefix', () => {
            const id = generateKnowledgeId('insight', 'My Test Insight');
            assert.ok(id.startsWith('GKI-'), `Expected GKI- prefix, got: ${id}`);
        });

        test('should slugify title', () => {
            const id = generateKnowledgeId('pattern', 'Hello World Test');
            assert.ok(id.includes('hello-world-test'), `Should slugify title: ${id}`);
        });

        test('should remove special characters', () => {
            const id = generateKnowledgeId('pattern', 'Hello! @World# $Test');
            assert.ok(!id.includes('!'), 'Should not contain !');
            assert.ok(!id.includes('@'), 'Should not contain @');
            assert.ok(!id.includes('#'), 'Should not contain #');
        });

        test('should truncate long titles to 40 chars in slug', () => {
            const longTitle = 'A'.repeat(100);
            const id = generateKnowledgeId('pattern', longTitle);
            // GKP- prefix (4) + slug (max 40) = max 44 for patterns
            const slug = id.replace(/^GKP-/, '');
            assert.ok(slug.length <= 40, `Slug should be <= 40 chars: ${slug.length}`);
        });

        test('should add date suffix for insights', () => {
            const id = generateKnowledgeId('insight', 'Test');
            // Insight IDs include date: GKI-test-YYYY-MM-DD
            const datePattern = /\d{4}-\d{2}-\d{2}$/;
            assert.ok(datePattern.test(id), `Should end with date: ${id}`);
        });

        test('should not add date suffix for patterns', () => {
            const id = generateKnowledgeId('pattern', 'Test');
            const datePattern = /\d{4}-\d{2}-\d{2}$/;
            assert.ok(!datePattern.test(id), `Should not end with date: ${id}`);
        });

        test('should handle empty title', () => {
            const id = generateKnowledgeId('pattern', '');
            assert.ok(id.startsWith('GKP-'), 'Should still have prefix');
        });
    });
});
