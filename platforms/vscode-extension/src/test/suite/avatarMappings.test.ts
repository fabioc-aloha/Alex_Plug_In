import * as assert from 'assert';
import {
    detectCognitiveState,
    COGNITIVE_STATE_TRIGGERS,
} from '../../chat/avatarMappings';

suite('Cognitive State Detection Test Suite', () => {

    suite('COGNITIVE_STATE_TRIGGERS', () => {
        test('should have 9 cognitive states', () => {
            const states = Object.keys(COGNITIVE_STATE_TRIGGERS);
            assert.strictEqual(states.length, 9);
        });

        test('each state should have at least one trigger', () => {
            for (const [state, triggers] of Object.entries(COGNITIVE_STATE_TRIGGERS)) {
                assert.ok(triggers.length > 0, `${state} should have triggers`);
            }
        });
    });

    suite('detectCognitiveState', () => {
        test('should detect debugging state', () => {
            assert.strictEqual(detectCognitiveState('I need to debug this error'), 'debugging');
        });

        test('should detect building state', () => {
            assert.strictEqual(detectCognitiveState('Let me implement this feature'), 'building');
        });

        test('should detect learning state', () => {
            assert.strictEqual(detectCognitiveState('How does this work?'), 'learning');
        });

        test('should detect meditation state', () => {
            assert.strictEqual(detectCognitiveState('Time to meditate'), 'meditation');
        });

        test('should detect planning state', () => {
            assert.strictEqual(detectCognitiveState('Let me plan the architecture'), 'planning');
        });

        test('should detect reviewing state', () => {
            assert.strictEqual(detectCognitiveState('Please review this PR'), 'reviewing');
        });

        test('should detect dream state', () => {
            assert.strictEqual(detectCognitiveState('Run neural maintenance'), 'dream');
        });

        test('should detect discovery state', () => {
            assert.strictEqual(detectCognitiveState('I had a breakthrough!'), 'discovery');
        });

        test('should detect teaching state', () => {
            assert.strictEqual(detectCognitiveState('Walk through this concept'), 'teaching');
        });

        test('should return null for unrecognized message', () => {
            assert.strictEqual(detectCognitiveState('hello world'), null);
        });

        test('should be case-insensitive', () => {
            assert.strictEqual(detectCognitiveState('I need to DEBUG this'), 'debugging');
        });

        test('should return null for empty string', () => {
            assert.strictEqual(detectCognitiveState(''), null);
        });
    });
});
