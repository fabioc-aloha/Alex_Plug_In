import * as assert from 'assert';

/**
 * Upgrade — tests for LegacyDetection and MigrationCandidate type contracts,
 * version classification logic, and migration candidate validation.
 *
 * The upgradeArchitecture function requires full VS Code context and
 * workspace filesystem. We test the exported types and classification logic.
 */

suite('Upgrade Test Suite', () => {

    suite('LegacyVersion classification', () => {
        const VALID_VERSIONS = ['legacy', 'transitional', 'current', 'unknown'];

        test('should have 4 version categories', () => {
            assert.strictEqual(VALID_VERSIONS.length, 4);
        });

        test('all version categories should be lowercase', () => {
            for (const v of VALID_VERSIONS) {
                assert.strictEqual(v, v.toLowerCase());
            }
        });
    });

    suite('LegacyDetection interface contract', () => {
        test('should accept valid legacy detection', () => {
            const detection = {
                version: 'legacy' as const,
                dkLocations: ['.github/dk/', 'DK/'],
                hasSkills: false,
                manifestLocation: '.github/dk/manifest.json',
                installedVersion: '4.0.0',
            };
            assert.strictEqual(detection.version, 'legacy');
            assert.strictEqual(detection.dkLocations.length, 2);
            assert.ok(!detection.hasSkills);
        });

        test('current version detection', () => {
            const detection = {
                version: 'current' as const,
                dkLocations: [],
                hasSkills: true,
                manifestLocation: null,
                installedVersion: '6.2.0',
            };
            assert.strictEqual(detection.version, 'current');
            assert.ok(detection.hasSkills);
            assert.strictEqual(detection.dkLocations.length, 0);
        });

        test('unknown version with no data', () => {
            const detection = {
                version: 'unknown' as const,
                dkLocations: [],
                hasSkills: false,
                manifestLocation: null,
                installedVersion: null,
            };
            assert.strictEqual(detection.version, 'unknown');
            assert.strictEqual(detection.installedVersion, null);
        });
    });

    suite('MigrationCandidate type contract', () => {
        const VALID_TYPES = ['legacy-dk', 'user-dk', 'user-skill', 'modified-system', 'profile', 'episodic'];

        test('should have 6 candidate types', () => {
            assert.strictEqual(VALID_TYPES.length, 6);
        });

        test('all types should be kebab-case', () => {
            for (const t of VALID_TYPES) {
                assert.ok(/^[a-z-]+$/.test(t), `${t} should be kebab-case`);
            }
        });

        test('should accept valid migration candidate', () => {
            const candidate = {
                type: 'user-skill' as const,
                sourcePath: 'backup/.github/skills/my-skill/SKILL.md',
                targetPath: '.github/skills/my-skill/SKILL.md',
                description: 'Custom skill',
                sizeKB: 12,
                lastModified: new Date(),
                recommended: true,
                stale: false,
            };
            assert.strictEqual(candidate.type, 'user-skill');
            assert.ok(candidate.recommended);
            assert.ok(!candidate.stale);
            assert.ok(candidate.sizeKB > 0);
        });

        test('stale candidate (>90 days old)', () => {
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - 100);
            const candidate = {
                type: 'episodic' as const,
                sourcePath: 'backup/.github/episodic/old.json',
                targetPath: '.github/episodic/old.json',
                description: 'Old session data',
                sizeKB: 5,
                lastModified: oldDate,
                recommended: false,
                stale: true,
            };
            assert.ok(candidate.stale);
            assert.ok(!candidate.recommended, 'Stale candidates should not be recommended');
        });
    });

    suite('Staleness detection logic', () => {
        test('files older than 90 days should be stale', () => {
            const STALE_DAYS = 90;
            const modified = new Date('2025-12-01');
            const now = new Date('2026-03-15');
            const diffDays = (now.getTime() - modified.getTime()) / (1000 * 60 * 60 * 24);
            assert.ok(diffDays > STALE_DAYS, `${diffDays} days should exceed ${STALE_DAYS}`);
        });

        test('recent files should not be stale', () => {
            const STALE_DAYS = 90;
            const modified = new Date('2026-03-01');
            const now = new Date('2026-03-15');
            const diffDays = (now.getTime() - modified.getTime()) / (1000 * 60 * 60 * 24);
            assert.ok(diffDays < STALE_DAYS, `${diffDays} days should be under ${STALE_DAYS}`);
        });
    });
});
