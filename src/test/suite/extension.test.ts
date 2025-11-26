import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('fabioc-aloha.alex-cognitive-architecture'));
	});

	test('should activate', async function() {
        const ext = vscode.extensions.getExtension('fabioc-aloha.alex-cognitive-architecture');
        assert.ok(ext, 'Extension not found');
        
        // Activate the extension
        await ext.activate();

        const commands = await vscode.commands.getCommands(true);
        // Filter for our commands to see if they exist
        const alexCommands = commands.filter(c => c.startsWith('alex.'));
        
        assert.ok(alexCommands.includes('alex.initialize'), `alex.initialize missing. Found: ${alexCommands.join(', ')}`);
        assert.ok(alexCommands.includes('alex.reset'), 'alex.reset missing');
        assert.ok(alexCommands.includes('alex.dream'), 'alex.dream missing');
    });
});
