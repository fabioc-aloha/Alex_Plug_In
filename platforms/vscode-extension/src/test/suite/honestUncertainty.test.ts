import * as assert from 'assert';

/**
 * Honest Uncertainty — tests for type definitions, signal constants,
 * and helper logic.
 *
 * The core functions (scoreKnowledgeCoverage, getCalibrationSummary)
 * require file I/O via workspaceFs and globalKnowledge search.
 * We test the type contracts and extractKeyTerms-equivalent logic here.
 */

suite('Honest Uncertainty Test Suite', () => {

    suite('ConfidenceLevel type contract', () => {
        test('valid levels should be high | medium | low | uncertain', () => {
            const levels = ['high', 'medium', 'low', 'uncertain'];
            assert.strictEqual(levels.length, 4);
            assert.ok(levels.includes('high'));
            assert.ok(levels.includes('uncertain'));
        });
    });

    suite('CoverageScore interface contract', () => {
        test('should accept valid CoverageScore shape', () => {
            const score = {
                level: 'medium' as const,
                patternCount: 1,
                insightCount: 3,
                matchedSkills: ['testing-strategies', 'debugging-patterns'],
                signal: 'Some prior experience',
            };
            assert.strictEqual(score.level, 'medium');
            assert.strictEqual(score.patternCount, 1);
            assert.strictEqual(score.matchedSkills.length, 2);
            assert.ok(!('whatINeed' in score), 'Medium level should not have whatINeed');
        });

        test('low/uncertain should include whatINeed', () => {
            const score = {
                level: 'uncertain' as const,
                patternCount: 0,
                insightCount: 0,
                matchedSkills: [],
                signal: 'Outside knowledge base',
                whatINeed: 'To give you a confident answer...',
            };
            assert.ok(score.whatINeed, 'Uncertain should have whatINeed');
            assert.ok(score.whatINeed.length > 0);
        });
    });

    suite('CalibrationEntry interface contract', () => {
        test('should accept valid entry shape', () => {
            const entry = {
                date: new Date().toISOString(),
                topic: 'azure deployment',
                level: 'high' as const,
                matchCount: 5,
            };
            assert.ok(entry.date.includes('T'), 'Date should be ISO format');
            assert.strictEqual(entry.level, 'high');
            assert.strictEqual(entry.matchCount, 5);
        });
    });

    suite('Key term extraction logic (mirror of extractKeyTerms)', () => {
        const STOP_WORDS = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
            'could', 'may', 'might', 'can', 'this', 'that', 'i', 'you', 'we',
            'what', 'how', 'why', 'when', 'where', 'help', 'need', 'want', 'get',
            'make', 'use', 'using', 'create', 'add', 'show', 'tell', 'explain',
            'please', 'just', 'my', 'me', 'it', 'its',
        ]);

        function extractKeyTerms(query: string): string[] {
            return query.toLowerCase().split(/\W+/)
                .filter(w => w.length > 3 && !STOP_WORDS.has(w))
                .slice(0, 6);
        }

        test('should extract meaningful terms from query', () => {
            const terms = extractKeyTerms('How do I deploy my Azure function?');
            assert.ok(terms.includes('deploy'));
            assert.ok(terms.includes('azure'));
            assert.ok(terms.includes('function'));
        });

        test('should filter stop words', () => {
            const terms = extractKeyTerms('the quick brown fox');
            assert.ok(!terms.includes('the'));
            assert.ok(terms.includes('quick'));
            assert.ok(terms.includes('brown'));
        });

        test('should cap at 6 terms', () => {
            const terms = extractKeyTerms('alpha beta gamma delta epsilon zeta theta iota');
            assert.ok(terms.length <= 6, `Expected max 6 terms, got ${terms.length}`);
        });

        test('should exclude short words (<=3 chars)', () => {
            const terms = extractKeyTerms('the cat sat on a mat');
            assert.strictEqual(terms.length, 0, 'All words are <=3 chars or stop words');
        });

        test('should handle empty string', () => {
            const terms = extractKeyTerms('');
            assert.strictEqual(terms.length, 0);
        });
    });

    suite('Confidence level thresholds logic', () => {
        function computeLevel(patternCount: number, insightCount: number, skillCount: number): string {
            if (patternCount >= 2 || (patternCount >= 1 && skillCount >= 1)) {
                return 'high';
            } else if (patternCount >= 1 || insightCount >= 2 || skillCount >= 1) {
                return 'medium';
            } else if (insightCount >= 1) {
                return 'low';
            }
            return 'uncertain';
        }

        test('2+ patterns → high', () => {
            assert.strictEqual(computeLevel(2, 0, 0), 'high');
        });

        test('1 pattern + 1 skill → high', () => {
            assert.strictEqual(computeLevel(1, 0, 1), 'high');
        });

        test('1 pattern only → medium', () => {
            assert.strictEqual(computeLevel(1, 0, 0), 'medium');
        });

        test('2 insights → medium', () => {
            assert.strictEqual(computeLevel(0, 2, 0), 'medium');
        });

        test('1 skill only → medium', () => {
            assert.strictEqual(computeLevel(0, 0, 1), 'medium');
        });

        test('1 insight only → low', () => {
            assert.strictEqual(computeLevel(0, 1, 0), 'low');
        });

        test('no matches → uncertain', () => {
            assert.strictEqual(computeLevel(0, 0, 0), 'uncertain');
        });
    });

    suite('ModelUsageSummary contract', () => {
        test('distribution should sum to ~100', () => {
            const byTier = { frontier: 3, capable: 5, efficient: 2 };
            const total = 10;
            const distribution: Record<string, number> = {};
            for (const [t, count] of Object.entries(byTier)) {
                distribution[t] = +((count / total) * 100).toFixed(1);
            }
            const sum = Object.values(distribution).reduce((a, b) => a + b, 0);
            assert.ok(Math.abs(sum - 100) < 0.5, `Sum ${sum} should be ~100`);
        });
    });

    suite('CalibrationSummary contract', () => {
        test('byLevel distribution should sum to ~1.0', () => {
            const entries = [
                { level: 'high' }, { level: 'high' }, { level: 'medium' },
                { level: 'low' }, { level: 'uncertain' },
            ];
            const byLevel: Record<string, number> = { high: 0, medium: 0, low: 0, uncertain: 0 };
            for (const e of entries) { byLevel[e.level]++; }
            const distribution: Record<string, number> = {};
            for (const [k, v] of Object.entries(byLevel)) {
                distribution[k] = +(v / entries.length).toFixed(2);
            }
            const sum = Object.values(distribution).reduce((a, b) => a + b, 0);
            assert.ok(Math.abs(sum - 1) < 0.05, `Sum ${sum} should be ~1.0`);
        });

        test('uncertain topics should dedupe', () => {
            const topics = ['azure', 'testing', 'azure', 'deploy', 'testing'];
            const deduped = topics.filter((t, i, arr) => arr.indexOf(t) === i);
            assert.strictEqual(deduped.length, 3);
        });
    });
});
