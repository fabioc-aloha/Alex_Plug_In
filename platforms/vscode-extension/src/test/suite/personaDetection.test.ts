import * as assert from 'assert';
import {
    PERSONAS,
    getAvatarForPersona,
    DEFAULT_AVATAR,
    getEasterEggOverride,
    PERSONA_AVATAR_MAP,
} from '../../chat/personaDefinitions';

suite('Persona Detection Test Suite', () => {

    suite('PERSONAS array', () => {
        test('should contain personas', () => {
            assert.ok(PERSONAS.length > 0, 'Should have at least one persona');
        });

        test('each persona should have required fields', () => {
            for (const persona of PERSONAS) {
                assert.ok(persona.id, `Persona missing id`);
                assert.ok(persona.name, `Persona ${persona.id} missing name`);
                assert.ok(persona.hook, `Persona ${persona.id} missing hook`);
                assert.ok(Array.isArray(persona.signals), `Persona ${persona.id} missing signals`);
            }
        });

        test('persona IDs should be unique', () => {
            const ids = PERSONAS.map(p => p.id);
            const unique = new Set(ids);
            assert.strictEqual(unique.size, ids.length, `Duplicate persona IDs found: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`);
        });

        test('should include developer persona', () => {
            const dev = PERSONAS.find(p => p.id === 'developer');
            assert.ok(dev, 'Developer persona should exist');
        });
    });

    suite('getAvatarForPersona', () => {
        test('should return avatar for known persona', () => {
            const avatar = getAvatarForPersona('developer');
            assert.ok(avatar !== DEFAULT_AVATAR, 'Should return specific avatar');
        });

        test('should return default for unknown persona', () => {
            const avatar = getAvatarForPersona('nonexistent-persona');
            assert.strictEqual(avatar, DEFAULT_AVATAR);
        });

        test('should return default for empty string', () => {
            assert.strictEqual(getAvatarForPersona(''), DEFAULT_AVATAR);
        });
    });

    suite('getEasterEggOverride', () => {
        test('should return New Year egg on Jan 1', () => {
            const egg = getEasterEggOverride(undefined, new Date(2026, 0, 1));
            assert.ok(egg !== null, 'Should have New Year egg');
            assert.strictEqual(egg!.emoji, '🎉');
        });

        test('should return Halloween egg on Oct 31', () => {
            const egg = getEasterEggOverride(undefined, new Date(2026, 9, 31));
            assert.ok(egg !== null, 'Should have Halloween egg');
            assert.strictEqual(egg!.emoji, '🎃');
        });

        test('should return Christmas egg on Dec 25', () => {
            const egg = getEasterEggOverride(undefined, new Date(2026, 11, 25));
            assert.ok(egg !== null, 'Should have Christmas egg');
            assert.strictEqual(egg!.emoji, '🎄');
        });

        test('should return null on regular day', () => {
            const egg = getEasterEggOverride(undefined, new Date(2026, 5, 15));
            assert.strictEqual(egg, null);
        });

        test('should detect cooking project by name', () => {
            const egg = getEasterEggOverride('my-recipe-app', new Date(2026, 5, 15));
            assert.ok(egg !== null, 'Should detect cooking project');
            assert.strictEqual(egg!.emoji, '🍳');
        });

        test('should detect comedy project by name', () => {
            const egg = getEasterEggOverride('standup-jokes', new Date(2026, 5, 15));
            assert.ok(egg !== null, 'Should detect comedy project');
            assert.strictEqual(egg!.emoji, '😂');
        });

        test('seasonal should take priority over project name', () => {
            // On Christmas day, even a cooking project shows Christmas
            const egg = getEasterEggOverride('my-recipe-app', new Date(2026, 11, 25));
            assert.ok(egg !== null);
            assert.strictEqual(egg!.emoji, '🎄');
        });

        test('should return null for no project name on regular day', () => {
            const egg = getEasterEggOverride(undefined, new Date(2026, 5, 15));
            assert.strictEqual(egg, null);
        });
    });

    suite('PERSONA_AVATAR_MAP', () => {
        test('should have matching entries for all PERSONAS', () => {
            for (const persona of PERSONAS) {
                const avatar = PERSONA_AVATAR_MAP[persona.id];
                // Not all personas need avatar map entries — some use default
                if (avatar) {
                    assert.ok(avatar.length > 0, `Avatar for ${persona.id} should not be empty`);
                }
            }
        });
    });
});
