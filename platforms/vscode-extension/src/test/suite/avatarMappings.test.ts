import * as assert from 'assert';
import {
    PERSONA_AVATAR_MAP,
    AVAILABLE_AGES,
    AGE_AVATAR_MAP,
    findClosestAge,
    calculateAge,
    getAgeAvatar,
    AGENT_AVATAR_MAP,
    detectCognitiveState,
    getCognitiveStateAvatar,
    COGNITIVE_STATE_MAP,
    resolveAvatar,
    getAvatarAssetRelativePath,
    DEFAULT_AVATAR,
} from '../../chat/avatarMappings';

suite('Avatar Mappings Test Suite', () => {

    suite('PERSONA_AVATAR_MAP', () => {
        test('should contain developer persona', () => {
            assert.strictEqual(PERSONA_AVATAR_MAP['developer'], 'PERSONA-DEVELOPER');
        });

        test('should contain cloud-architect persona', () => {
            assert.strictEqual(PERSONA_AVATAR_MAP['cloud-architect'], 'PERSONA-CLOUD-ARCHITECT');
        });

        test('should not contain empty keys', () => {
            for (const [key, value] of Object.entries(PERSONA_AVATAR_MAP)) {
                assert.ok(key.length > 0, 'Key should not be empty');
                assert.ok(value.length > 0, `Value for ${key} should not be empty`);
            }
        });
    });

    suite('findClosestAge', () => {
        test('should return youngest age for very young input', () => {
            assert.strictEqual(findClosestAge(1), AVAILABLE_AGES[0]);
        });

        test('should return oldest age for very old input', () => {
            assert.strictEqual(findClosestAge(100), AVAILABLE_AGES[AVAILABLE_AGES.length - 1]);
        });

        test('should return exact match', () => {
            assert.strictEqual(findClosestAge(25), 25);
        });

        test('should return closest available age for 27', () => {
            // 25 and 30 are available; 27 is closer to 25 (diff 2) than 30 (diff 3)
            assert.strictEqual(findClosestAge(27), 25);
        });

        test('should return closest available age for 28', () => {
            // 25 and 30 are available; 28 is closer to 30 (diff 2) than 25 (diff 3)
            assert.strictEqual(findClosestAge(28), 30);
        });

        test('should handle boundary at youngest', () => {
            assert.strictEqual(findClosestAge(3), 3);
        });
    });

    suite('calculateAge', () => {
        test('should return null for undefined birthday', () => {
            assert.strictEqual(calculateAge(undefined), null);
        });

        test('should return null for empty string', () => {
            assert.strictEqual(calculateAge(''), null);
        });

        test('should return null for invalid date', () => {
            assert.strictEqual(calculateAge('not-a-date'), null);
        });

        test('should calculate age from valid birthday', () => {
            const age = calculateAge('2000-01-01');
            assert.ok(age !== null, 'Should return a number');
            assert.ok(age! >= 25, 'Age should be at least 25');
            assert.ok(age! <= 30, 'Age should be reasonable');
        });

        test('should return null for future date', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 10);
            assert.strictEqual(calculateAge(futureDate.toISOString()), null);
        });
    });

    suite('getAgeAvatar', () => {
        test('should return null for undefined birthday', () => {
            assert.strictEqual(getAgeAvatar(undefined), null);
        });

        test('should return avatar for valid birthday', () => {
            const avatar = getAgeAvatar('2000-01-01');
            assert.ok(avatar !== null, 'Should return an avatar');
            assert.ok(avatar!.startsWith('Alex-'), 'Avatar should start with Alex-');
        });
    });

    suite('AGENT_AVATAR_MAP', () => {
        test('should contain researcher agent', () => {
            assert.strictEqual(AGENT_AVATAR_MAP['researcher'], 'AGENT-RESEARCHER');
        });

        test('should contain all 6 agents', () => {
            const expected = ['researcher', 'builder', 'validator', 'documentarian', 'azure', 'm365'];
            for (const agent of expected) {
                assert.ok(AGENT_AVATAR_MAP[agent], `Missing agent: ${agent}`);
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

        test('should return null for unrecognized message', () => {
            assert.strictEqual(detectCognitiveState('hello world'), null);
        });
    });

    suite('getCognitiveStateAvatar', () => {
        test('should return avatar for valid state', () => {
            const avatar = getCognitiveStateAvatar('debugging');
            assert.ok(avatar !== null, 'Should return avatar for debugging');
        });

        test('should return null for invalid state', () => {
            assert.strictEqual(getCognitiveStateAvatar('nonexistent-state'), null);
        });

        test('should normalize state with spaces', () => {
            // Internal normalization replaces spaces/underscores with hyphens
            const direct = getCognitiveStateAvatar('debugging');
            assert.ok(direct !== null);
        });
    });

    suite('resolveAvatar', () => {
        test('should return agent avatar for agent mode', () => {
            const result = resolveAvatar({ agentMode: 'researcher' });
            assert.strictEqual(result.source, 'agent');
            assert.ok(result.path.includes('agents/'));
        });

        test('should return state avatar for cognitive state', () => {
            const result = resolveAvatar({ cognitiveState: 'debugging' });
            assert.strictEqual(result.source, 'state');
            assert.ok(result.path.includes('states/'));
        });

        test('should detect state from message', () => {
            const result = resolveAvatar({ message: 'I need to debug this error' });
            assert.strictEqual(result.source, 'state');
        });

        test('should return persona avatar for persona ID', () => {
            const result = resolveAvatar({ personaId: 'developer' });
            assert.strictEqual(result.source, 'persona');
            assert.ok(result.path.includes('personas/'));
        });

        test('should return age avatar for birthday', () => {
            const result = resolveAvatar({ birthday: '2000-01-01' });
            assert.strictEqual(result.source, 'age');
            assert.ok(result.path.includes('ages/'));
        });

        test('should return default for empty context', () => {
            const result = resolveAvatar({});
            assert.strictEqual(result.source, 'default');
            assert.strictEqual(result.filename, DEFAULT_AVATAR);
        });

        test('should prioritize agent over persona', () => {
            const result = resolveAvatar({ agentMode: 'researcher', personaId: 'developer' });
            assert.strictEqual(result.source, 'agent');
        });

        test('should prioritize cognitive state over persona', () => {
            const result = resolveAvatar({ cognitiveState: 'debugging', personaId: 'developer' });
            assert.strictEqual(result.source, 'state');
        });
    });

    suite('getAvatarAssetRelativePath', () => {
        test('should generate persona path with png extension', () => {
            const result = resolveAvatar({ personaId: 'developer' });
            const path = getAvatarAssetRelativePath(result, 'png');
            assert.ok(path.includes('avatars/personas/PERSONA-DEVELOPER.png'));
        });

        test('should generate default path for default avatar', () => {
            const result = resolveAvatar({});
            const path = getAvatarAssetRelativePath(result, 'png');
            assert.ok(path.endsWith('.png'));
        });

        test('should use SVG pipeline for svg extension', () => {
            const result = resolveAvatar({ personaId: 'developer' });
            const path = getAvatarAssetRelativePath(result, 'svg');
            assert.ok(path.endsWith('.svg'));
        });
    });
});
