import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { 
    searchGlobalKnowledge, 
    createGlobalInsight, 
    getGlobalKnowledgeSummary
} from '../chat/globalKnowledge';
import { GlobalKnowledgeCategory } from '../shared/constants';
import { autoIncrementGoals } from './goals';

interface KnowledgeQuickPickItem extends vscode.QuickPickItem {
    filePath?: string;
}

/**
 * Register context menu commands for Alex quick actions
 */
export function registerContextMenuCommands(context: vscode.ExtensionContext): void {
    // Ask Alex about selection
    const askAboutSelectionDisposable = vscode.commands.registerCommand(
        'alex.askAboutSelection',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor');
                return;
            }

            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            if (!selectedText) {
                vscode.window.showWarningMessage('No text selected');
                return;
            }

            // Open Copilot Chat with @alex and the selected code
            const chatInput = `Explain this code and suggest improvements:\n\n\`\`\`${editor.document.languageId}\n${selectedText}\n\`\`\``;
            
            // Copy to clipboard and open Agent mode
            await vscode.env.clipboard.writeText(chatInput);
            await vscode.commands.executeCommand('workbench.action.chat.openAgent');
            
            vscode.window.showInformationMessage(
                '📋 Prompt copied! Paste in Agent chat (Ctrl+V)',
                'OK'
            );
        }
    );

    // Save selection as insight
    const saveSelectionAsInsightDisposable = vscode.commands.registerCommand(
        'alex.saveSelectionAsInsight',
        async () => {
            const editor = vscode.window.activeTextEditor;
            const selection = editor?.selection;
            const selectedText = editor && selection ? editor.document.getText(selection) : '';

            // If no editor or no selection, fall back to input prompt and save to episodic
            if (!editor || !selectedText) {
                const insight = await vscode.window.showInputBox({
                    prompt: 'What insight would you like to save?',
                    placeHolder: 'e.g., useEffect cleanup runs before next effect - helped fix my memory leak',
                    ignoreFocusOut: true
                });
                
                if (insight) {
                    // Save directly to episodic memory
                    const workspaceFolders = vscode.workspace.workspaceFolders;
                    if (!workspaceFolders) {
                        vscode.window.showWarningMessage('No workspace folder found');
                        return;
                    }

                    const now = new Date();
                    const dateStr = now.toISOString().split('T')[0];
                    const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
                    const fileName = `quick-insight-${dateStr}-${timeStr}.md`;
                    
                    const episodicPath = path.join(workspaceFolders[0].uri.fsPath, '.github', 'episodic');
                    const filePath = path.join(episodicPath, fileName);

                    const content = `# Quick Insight

**Date**: ${now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
**Time**: ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
**Type**: Quick Capture

---

## Insight

${insight}

---

## Context

Captured via Alex quick save (no active editor/selection).
Project: ${workspaceFolders[0].name}
`;

                    try {
                        await fs.ensureDir(episodicPath);
                        await fs.writeFile(filePath, content, 'utf8');
                        
                        const relativePath = vscode.workspace.asRelativePath(filePath);
                        vscode.window.showInformationMessage(
                            `✅ Insight saved: ${relativePath}`,
                            'Open File'
                        ).then(action => {
                            if (action === 'Open File') {
                                vscode.workspace.openTextDocument(filePath).then(doc => {
                                    vscode.window.showTextDocument(doc);
                                });
                            }
                        });
                        
                        // Auto-increment insight goals
                        try {
                            await autoIncrementGoals('insight');
                        } catch (err) {
                            console.warn('Failed to auto-increment goals:', err);
                        }
                    } catch (err) {
                        vscode.window.showErrorMessage(`Failed to save insight: ${err}`);
                    }
                }
                return;
            }

            // Original flow with editor selection
            // Get insight details from user
            const title = await vscode.window.showInputBox({
                prompt: 'Title for this insight',
                placeHolder: 'e.g., Memoization pattern for expensive computations'
            });

            if (!title) {
                return; // User cancelled
            }

            // Detect category from file extension
            const languageId = editor.document.languageId;
            const categories: GlobalKnowledgeCategory[] = [
                'error-handling', 'api-design', 'testing', 'debugging', 
                'performance', 'architecture', 'security', 'deployment',
                'documentation', 'refactoring', 'patterns', 'tooling', 'general'
            ];

            const category = await vscode.window.showQuickPick(categories, {
                placeHolder: 'Select a category for this insight'
            }) as GlobalKnowledgeCategory || 'general';

            // Build the insight
            const insight = `**Code Pattern (${languageId}):**\n\`\`\`${languageId}\n${selectedText}\n\`\`\``;
            const tags = [languageId, 'code-snippet'];
            
            // Get current project name
            const workspaceFolders = vscode.workspace.workspaceFolders;
            const sourceProject = workspaceFolders?.[0]?.name || 'Unknown';

            try {
                // Save using the global knowledge system
                await createGlobalInsight(
                    title,
                    insight,
                    category,
                    tags,
                    sourceProject,
                    `Captured from ${path.basename(editor.document.fileName)}`,
                    'Code pattern for reference'
                );
                
                // Auto-increment insight goals
                try {
                    await autoIncrementGoals('insight');
                } catch (err) {
                    console.warn('Failed to auto-increment goals:', err);
                }
                
                vscode.window.showInformationMessage(`✅ Saved insight: "${title}"`);
            } catch (err) {
                vscode.window.showErrorMessage(`❌ Failed to save insight: ${err}`);
            }
        }
    );

    // Search related knowledge
    const searchRelatedKnowledgeDisposable = vscode.commands.registerCommand(
        'alex.searchRelatedKnowledge',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor');
                return;
            }

            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            if (!selectedText) {
                vscode.window.showWarningMessage('No text selected');
                return;
            }

            // Extract keywords from selection (first 100 chars, remove special chars)
            const keywords = selectedText
                .substring(0, 100)
                .replace(/[^a-zA-Z0-9\s]/g, ' ')
                .split(/\s+/)
                .filter(word => word.length > 2)
                .slice(0, 5)
                .join(' ');

            // Search global knowledge
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Searching Alex Knowledge...',
                cancellable: false
            }, async () => {
                const results = await searchGlobalKnowledge(keywords);
                
                if (results.length === 0) {
                    vscode.window.showInformationMessage(
                        `No related knowledge found for: "${keywords.substring(0, 30)}..."`
                    );
                    return;
                }

                // Show results in quick pick
                const items: KnowledgeQuickPickItem[] = results.map(r => ({
                    label: r.entry.title,
                    description: r.entry.type === 'pattern' ? '📁 Pattern' : '💡 Insight',
                    detail: r.entry.summary?.substring(0, 100),
                    filePath: r.entry.filePath
                }));

                const selected = await vscode.window.showQuickPick(items, {
                    placeHolder: `Found ${results.length} related items`,
                    title: '🔍 Related Alex Knowledge'
                });

                if (selected && selected.filePath) {
                    // Open the knowledge file
                    const doc = await vscode.workspace.openTextDocument(selected.filePath);
                    await vscode.window.showTextDocument(doc);
                }
            });
        }
    );

    // Knowledge Quick Pick (Ctrl+Shift+K)
    const knowledgeQuickPickDisposable = vscode.commands.registerCommand(
        'alex.knowledgeQuickPick',
        async () => {
            // Get knowledge status for categories
            const status = await getGlobalKnowledgeSummary();
            
            // Create a quick pick with search
            const quickPick = vscode.window.createQuickPick<KnowledgeQuickPickItem>();
            quickPick.placeholder = 'Search Alex Knowledge (type to filter)...';
            quickPick.title = '🧠 Alex Knowledge Search';
            
            // Initial items (recent/popular)
            const updateItems = async (query: string) => {
                quickPick.busy = true;
                
                if (!query) {
                    // Show categories when no query
                    quickPick.items = [
                        { label: '$(folder) Patterns', description: `${status.totalPatterns} patterns`, alwaysShow: true },
                        { label: '$(lightbulb) Insights', description: `${status.totalInsights} insights`, alwaysShow: true },
                        { label: '$(pulse) Run Health Check', description: 'Check architecture status', alwaysShow: true },
                        { label: '$(sync) Sync Knowledge', description: 'Sync with cloud', alwaysShow: true }
                    ];
                } else {
                    // Search knowledge
                    const results = await searchGlobalKnowledge(query);
                    
                    if (results.length === 0) {
                        quickPick.items = [{
                            label: '$(search) No results found',
                            description: `No knowledge matching "${query}"`,
                            alwaysShow: true
                        }];
                    } else {
                        quickPick.items = results.map(r => ({
                            label: `${r.entry.type === 'pattern' ? '$(folder)' : '$(lightbulb)'} ${r.entry.title}`,
                            description: r.entry.category || '',
                            detail: r.entry.summary?.substring(0, 80),
                            filePath: r.entry.filePath
                        }));
                    }
                }
                
                quickPick.busy = false;
            };

            // Initial load
            await updateItems('');

            // Debounced search on value change
            let debounceTimer: NodeJS.Timeout | undefined;
            quickPick.onDidChangeValue(value => {
                if (debounceTimer) {
                    clearTimeout(debounceTimer);
                }
                debounceTimer = setTimeout(() => updateItems(value), 200);
            });

            // Handle selection
            quickPick.onDidAccept(async () => {
                const selected = quickPick.selectedItems[0];
                quickPick.hide();
                
                if (!selected) {
                    return;
                }

                if (selected.label.includes('Health Check')) {
                    vscode.commands.executeCommand('alex.dream');
                } else if (selected.label.includes('Sync Knowledge')) {
                    vscode.commands.executeCommand('alex.syncKnowledge');
                } else if (selected.label.includes('Patterns')) {
                    // Search for patterns
                    quickPick.value = 'type:pattern ';
                    quickPick.show();
                } else if (selected.label.includes('Insights')) {
                    // Search for insights
                    quickPick.value = 'type:insight ';
                    quickPick.show();
                } else if (selected.filePath) {
                    // Open the file
                    const doc = await vscode.workspace.openTextDocument(selected.filePath);
                    await vscode.window.showTextDocument(doc);
                }
            });

            quickPick.onDidHide(() => {
                quickPick.dispose();
                if (debounceTimer) {
                    clearTimeout(debounceTimer);
                }
            });

            quickPick.show();
        }
    );

    // Generate image from selection
    const generateImageFromSelectionDisposable = vscode.commands.registerCommand(
        'alex.generateImageFromSelection',
        async () => {
            const editor = vscode.window.activeTextEditor;
            const selection = editor?.selection;
            const selectedText = editor && selection ? editor.document.getText(selection) : '';

            let prompt: string;
            
            if (!selectedText) {
                // No selection - prompt for description
                const userInput = await vscode.window.showInputBox({
                    prompt: 'Describe the image you want to generate',
                    placeHolder: 'e.g., A flowchart showing user authentication process',
                    ignoreFocusOut: true
                });
                
                if (!userInput) {
                    return;
                }
                prompt = userInput;
            } else {
                prompt = selectedText;
            }

            // Open chat with image generation request
            vscode.commands.executeCommand('workbench.action.chat.open', {
                query: `@alex Generate an image based on this description:\n\n${prompt}`,
                isPartialQuery: false
            });
        }
    );

    context.subscriptions.push(askAboutSelectionDisposable);
    context.subscriptions.push(saveSelectionAsInsightDisposable);
    context.subscriptions.push(searchRelatedKnowledgeDisposable);
    context.subscriptions.push(knowledgeQuickPickDisposable);
    context.subscriptions.push(generateImageFromSelectionDisposable);
}
