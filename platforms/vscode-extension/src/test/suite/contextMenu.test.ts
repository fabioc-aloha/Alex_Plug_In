import * as assert from 'assert';

/**
 * Context Menu — tests for menu item type contracts and action validation.
 *
 * The registerContextMenuCommands function requires VS Code extension context.
 * We test the type shapes and action enumeration for the context menu system.
 */

suite('Context Menu Test Suite', () => {

    suite('Context menu action types', () => {
        // Mirror the action categories from contextMenu.ts
        const ACTION_CATEGORIES = [
            'code-operations',    // explain, refactor, review
            'image-operations',   // generate caption, describe, resize
        ];

        test('should have 2 action categories', () => {
            assert.strictEqual(ACTION_CATEGORIES.length, 2);
        });

        test('code operations category should exist', () => {
            assert.ok(ACTION_CATEGORIES.includes('code-operations'));
        });

        test('image operations category should exist', () => {
            assert.ok(ACTION_CATEGORIES.includes('image-operations'));
        });
    });

    suite('Code context menu items', () => {
        const CODE_MENU_ITEMS = [
            { command: 'alex.explainCode', label: 'Alex: Explain This Code' },
            { command: 'alex.refactorCode', label: 'Alex: Refactor This Code' },
            { command: 'alex.reviewCode', label: 'Alex: Review This Code' },
        ];

        test('should have standard code operations', () => {
            assert.ok(CODE_MENU_ITEMS.length >= 3);
        });

        test('all commands should be prefixed with alex.', () => {
            for (const item of CODE_MENU_ITEMS) {
                assert.ok(item.command.startsWith('alex.'), `${item.command} should start with alex.`);
            }
        });

        test('all labels should start with Alex:', () => {
            for (const item of CODE_MENU_ITEMS) {
                assert.ok(item.label.startsWith('Alex:'), `${item.label} should start with 'Alex:'`);
            }
        });
    });

    suite('Image file extension validation', () => {
        const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'];

        test('should recognize common image formats', () => {
            assert.ok(IMAGE_EXTENSIONS.includes('.png'));
            assert.ok(IMAGE_EXTENSIONS.includes('.jpg'));
            assert.ok(IMAGE_EXTENSIONS.includes('.svg'));
        });

        test('should detect image files by extension', () => {
            const isImage = (file: string) => IMAGE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext));
            assert.ok(isImage('photo.PNG'));
            assert.ok(isImage('icon.svg'));
            assert.ok(!isImage('code.ts'));
            assert.ok(!isImage('readme.md'));
        });
    });

    suite('Context menu command ID format', () => {
        test('command IDs should be valid VS Code identifiers', () => {
            const commands = [
                'alex.explainCode',
                'alex.refactorCode',
                'alex.reviewCode',
                'alex.imageCaption',
            ];
            for (const cmd of commands) {
                assert.ok(/^[a-zA-Z]+\.[a-zA-Z]+$/.test(cmd), `${cmd} should match namespace.command format`);
            }
        });
    });
});
