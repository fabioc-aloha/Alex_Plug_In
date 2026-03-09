import * as assert from 'assert';
import {
    HealthStatus,
    getCachedHealth,
    clearHealthCache,
} from '../../shared/healthCheck';

suite('Health Check Test Suite', () => {

    suite('HealthStatus enum', () => {
        test('should have Healthy value', () => {
            assert.strictEqual(HealthStatus.Healthy, 'healthy');
        });

        test('should have Warning value', () => {
            assert.strictEqual(HealthStatus.Warning, 'warning');
        });

        test('should have Error value', () => {
            assert.strictEqual(HealthStatus.Error, 'error');
        });

        test('should have NotInitialized value', () => {
            assert.strictEqual(HealthStatus.NotInitialized, 'not-initialized');
        });
    });

    suite('Cache management', () => {
        test('getCachedHealth should return null when no cache exists', () => {
            clearHealthCache();
            const result = getCachedHealth();
            assert.strictEqual(result, null);
        });

        test('clearHealthCache should clear cached result', () => {
            clearHealthCache();
            assert.strictEqual(getCachedHealth(), null);
        });
    });
});
