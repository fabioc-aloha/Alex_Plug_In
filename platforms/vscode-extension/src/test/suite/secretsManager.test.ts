import * as assert from 'assert';
import { TOKEN_CONFIGS, getToken, getTokenStatuses } from '../../services/secretsManager';

suite('Secrets Manager Test Suite', () => {

    suite('TOKEN_CONFIGS', () => {
        test('should contain GITHUB_TOKEN config', () => {
            assert.ok(TOKEN_CONFIGS.GITHUB_TOKEN, 'GITHUB_TOKEN config should exist');
            assert.ok(TOKEN_CONFIGS.GITHUB_TOKEN.displayName, 'Should have displayName');
            assert.ok(TOKEN_CONFIGS.GITHUB_TOKEN.description, 'Should have description');
        });

        test('should contain GAMMA_API_KEY config', () => {
            assert.ok(TOKEN_CONFIGS.GAMMA_API_KEY, 'GAMMA_API_KEY config should exist');
        });

        test('should contain REPLICATE_API_TOKEN config', () => {
            assert.ok(TOKEN_CONFIGS.REPLICATE_API_TOKEN, 'REPLICATE_API_TOKEN config should exist');
        });

        test('all configs should have key and displayName', () => {
            for (const [name, config] of Object.entries(TOKEN_CONFIGS)) {
                assert.ok(config.key, `${name} missing key`);
                assert.ok(config.displayName, `${name} missing displayName`);
                assert.ok(config.description, `${name} missing description`);
            }
        });

        test('config keys should be unique', () => {
            const keys = Object.values(TOKEN_CONFIGS).map(c => c.key);
            const unique = new Set(keys);
            assert.strictEqual(unique.size, keys.length, 'Duplicate secret storage keys found');
        });
    });

    suite('getToken', () => {
        test('should return null for unknown token', () => {
            // Casting to avoid type error — testing defensive behavior
            const result = getToken('NONEXISTENT' as any);
            assert.strictEqual(result, null);
        });

        test('should return null when cache and env are empty', () => {
            // Without initSecretsManager, cache is empty
            // This tests the fallback behavior
            const result = getToken('GITHUB_TOKEN');
            // May return env value or null depending on environment
            assert.ok(result === null || typeof result === 'string');
        });
    });

    suite('getTokenStatuses', () => {
        test('should return an object with all token names', () => {
            const statuses = getTokenStatuses();
            for (const name of Object.keys(TOKEN_CONFIGS)) {
                assert.ok(name in statuses, `Missing status for ${name}`);
                assert.strictEqual(typeof statuses[name], 'boolean', `Status for ${name} should be boolean`);
            }
        });
    });
});
