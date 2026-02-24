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
import { getLanguageIdFromPath, openChatPanel } from '../shared/utils';
import { 
    fetchIconifyIcon, 
    fetchDiceBearAvatar, 
    ICONIFY_PREFIXES, 
    DICEBEAR_STYLES 
} from '../services/illustrationService';
import { 
    STOCK_ILLUSTRATIONS, 
    LUCIDE_ICONS, 
    ICON_CATEGORIES, 
    STOCK_CATEGORIES 
} from '../generators/illustrationIcons';
import { getToken } from '../services/secretsManager';
import {
    generateImage,
    downloadImageToWorkspace,
    createPrediction,
    pollPrediction,
    selectModelForPrompt,
    buildModelQuickPickItems
} from '../services/replicateService';

interface KnowledgeQuickPickItem extends vscode.QuickPickItem {
    filePath?: string;
}

// Maximum image dimension for API upload (to avoid payload size issues)
const MAX_IMAGE_DIMENSION = 1024;

/**
 * Resize image buffer if needed to stay within dimension limits
 */
async function resizeImageIfNeeded(buffer: Buffer | Uint8Array, maxDim: number = MAX_IMAGE_DIMENSION): Promise<Buffer> {
    const inputBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    // Use sharp if available, otherwise return original (acceptable for small images)
    try {
        const sharp = await import('sharp');
        const metadata = await sharp.default(inputBuffer).metadata();
        
        if (!metadata.width || !metadata.height) {
            return inputBuffer;
        }
        
        if (metadata.width <= maxDim && metadata.height <= maxDim) {
            return inputBuffer;
        }
        
        // Resize maintaining aspect ratio
        const resized = await sharp.default(inputBuffer)
            .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
            .png()
            .toBuffer();
            
        return resized;
    } catch {
        // Sharp not available, return original
        return inputBuffer;
    }
}

// Note: Replicate API functions (createPrediction, pollPrediction, generateImage, downloadImageToWorkspace)
// are provided by ../services/replicateService. The inline implementations have been removed.

/**
 * Generate an SVG illustration from a natural language description.
 * 
 * Strategy:
 * 1. Use the LLM to interpret the description and generate SVG code
 * 2. Falls back to keyword-matching against built-in icons/illustrations
 * 3. Falls back to Iconify API for icon-style illustrations
 * 4. Falls back to DiceBear for character/avatar requests
 */
async function generateIllustrationFromDescription(description: string): Promise<string | null> {
    // Strategy 1: Use LLM to generate SVG directly
    try {
        const models = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
        if (models.length > 0) {
            const model = models[0];
            const messages = [
                vscode.LanguageModelChatMessage.User(
                    `You are an SVG illustration generator. Given a description, create a clean, modern SVG illustration.

Rules:
- Output ONLY the SVG code, no markdown fences, no explanation
- Use a viewBox of "0 0 400 300" 
- Use a professional color palette (blues: #0550ae, #ddf4ff; greens: #1a7f37, #dffbe0; grays: #57606a, #d0d7de)
- Keep illustrations simple and geometric — abstract business/tech style
- Use shapes (rect, circle, ellipse, path, line, polygon) with rounded corners where appropriate
- Add subtle fills and strokes for depth
- Include relevant text labels if the description implies them
- The SVG must be self-contained (no external references)
- Maximum complexity: ~50 SVG elements

Description: ${description}`)
            ];

            const response = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
            let svgContent = '';
            for await (const chunk of response.text) {
                svgContent += chunk;
            }

            // Extract SVG from response (in case LLM wraps it)
            const svgMatch = svgContent.match(/<svg[\s\S]*?<\/svg>/i);
            if (svgMatch) {
                return svgMatch[0];
            }
        }
    } catch (err) {
        console.warn('LLM SVG generation failed, falling back to keyword matching:', err);
    }

    // Strategy 2: Keyword-match against built-in stock illustrations
    const descLower = description.toLowerCase();
    
    // Check stock illustrations by keyword
    const stockKeywords: Record<string, string[]> = {
        'collaboration': ['team', 'collaborate', 'together', 'group', 'meeting', 'partner'],
        'growth': ['grow', 'increase', 'progress', 'chart', 'bar', 'revenue', 'sales'],
        'innovation': ['innovat', 'idea', 'creative', 'lightbulb', 'brainstorm', 'new'],
        'security': ['security', 'secure', 'lock', 'protect', 'shield', 'safe'],
        'network': ['network', 'connect', 'node', 'graph', 'link', 'web'],
        'process': ['process', 'flow', 'step', 'workflow', 'pipeline', 'sequence'],
        'analytics': ['analytic', 'data', 'metric', 'dashboard', 'report', 'insight'],
        'timeline': ['timeline', 'schedule', 'roadmap', 'milestone', 'plan', 'phase']
    };

    for (const [name, keywords] of Object.entries(stockKeywords)) {
        if (keywords.some(kw => descLower.includes(kw))) {
            const svg = STOCK_ILLUSTRATIONS[name];
            if (svg) { return svg; }
        }
    }

    // Strategy 3: Match Lucide icons by category
    const iconKeywords: Record<string, string[]> = {
        'brain': ['brain', 'ai', 'intelligence', 'cognitive', 'neural', 'think'],
        'rocket': ['launch', 'rocket', 'deploy', 'start', 'fast', 'speed'],
        'heart': ['heart', 'love', 'favorite', 'like', 'health', 'care'],
        'star': ['star', 'rating', 'favorite', 'best', 'top', 'award'],
        'shield': ['shield', 'protect', 'guard', 'defense', 'firewall'],
        'globe': ['globe', 'world', 'global', 'international', 'earth', 'planet'],
        'cloud': ['cloud', 'saas', 'hosting', 'storage', 'aws', 'azure'],
        'users': ['user', 'people', 'person', 'team', 'human', 'community', 'cat', 'dog', 'animal'],
        'lightbulb': ['light', 'bulb', 'idea', 'bright', 'eureka'],
        'code': ['code', 'program', 'develop', 'software', 'script'],
        'database': ['database', 'db', 'sql', 'storage', 'data'],
        'server': ['server', 'backend', 'infrastructure', 'hosting'],
        'lock': ['lock', 'password', 'auth', 'encrypt', 'secret'],
        'zap': ['fast', 'instant', 'lightning', 'power', 'energy', 'electric'],
        'sparkles': ['magic', 'sparkle', 'ai', 'generate', 'auto'],
        'trophy': ['win', 'trophy', 'achievement', 'success', 'champion'],
        'book': ['book', 'read', 'learn', 'education', 'knowledge', 'library'],
        'mail': ['mail', 'email', 'message', 'send', 'inbox', 'letter']
    };

    for (const [iconName, keywords] of Object.entries(iconKeywords)) {
        if (keywords.some(kw => descLower.includes(kw))) {
            const iconSvg = LUCIDE_ICONS[iconName];
            if (iconSvg) {
                // Scale up the 24x24 icon to a proper illustration size
                return wrapIconAsIllustration(iconSvg, iconName, description);
            }
        }
    }

    // Strategy 4: Try Iconify API for the most relevant term
    const words = description.split(/\s+/).filter(w => w.length > 2);
    for (const word of words) {
        const normalized = word.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (!normalized) { continue; }
        
        // Try material-design-icons first (largest set)
        const svg = await fetchIconifyIcon('mdi', normalized, { width: 200, height: 200, color: '0550ae' });
        if (svg) {
            return svg;
        }
    }

    // Strategy 5: DiceBear avatar as last resort for character descriptions
    const characterWords = ['person', 'character', 'avatar', 'face', 'portrait', 'cat', 'dog', 'animal', 'bot', 'robot'];
    if (characterWords.some(w => descLower.includes(w))) {
        const avatar = await fetchDiceBearAvatar(description, 'bottts', { size: 200 });
        if (avatar) { return avatar; }
    }

    return null;
}

/**
 * Wrap a small Lucide icon into a proper illustration with label and background
 */
function wrapIconAsIllustration(iconSvg: string, iconName: string, description: string): string {
    // Extract the inner content of the icon SVG (remove outer <svg> tags)
    const innerContent = iconSvg
        .replace(/<svg[^>]*>/, '')
        .replace(/<\/svg>/, '');
    
    const label = description.length > 30 
        ? description.substring(0, 27) + '...' 
        : description;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <!-- Background -->
  <rect width="400" height="300" rx="16" fill="#f6f8fa" stroke="#d0d7de" stroke-width="2"/>
  
  <!-- Decorative circle -->
  <circle cx="200" cy="120" r="70" fill="#ddf4ff" stroke="#0550ae" stroke-width="2" opacity="0.5"/>
  
  <!-- Icon (scaled up from 24x24) -->
  <g transform="translate(164, 84) scale(3)" stroke="#0550ae" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${innerContent}
  </g>
  
  <!-- Label -->
  <text x="200" y="240" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#24292f" font-weight="600">${escapeXml(label)}</text>
  <text x="200" y="265" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#57606a">Generated by Alex</text>
</svg>`;
}

/**
 * Escape special XML characters in text content
 */
function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Register context menu commands for Alex quick actions
 */
export function registerContextMenuCommands(context: vscode.ExtensionContext): void {
    // Ask Alex about selection
    const askAboutSelectionDisposable = vscode.commands.registerCommand(
        'alex.askAboutSelection',
        async (uri?: vscode.Uri) => {
            let text: string | undefined;
            let languageId = 'text';
            let fileName = '';

            // If URI provided (from explorer context menu), read file content
            if (uri) {
                try {
                    const content = await vscode.workspace.fs.readFile(uri);
                    text = new TextDecoder().decode(content);
                    fileName = path.basename(uri.fsPath);
                    languageId = getLanguageIdFromPath(uri.fsPath);
                } catch (err) {
                    vscode.window.showErrorMessage(`Failed to read file: ${err}`);
                    return;
                }
            } else {
                // Try active editor
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const selection = editor.selection;
                    text = !selection.isEmpty ? editor.document.getText(selection) : '';
                    languageId = editor.document.languageId;
                    fileName = path.basename(editor.document.fileName);
                }
            }

            let chatInput: string;

            // If no text, fall back to input prompt
            if (!text) {
                const question = await vscode.window.showInputBox({
                    prompt: 'What would you like to ask Alex?',
                    placeHolder: 'e.g., How do I implement error handling in TypeScript?',
                    ignoreFocusOut: true
                });
                
                if (!question) {
                    return; // User cancelled
                }
                chatInput = question;
            } else {
                // Build prompt with context
                const context = fileName ? ` from ${fileName}` : '';
                chatInput = `Explain this code${context} and suggest improvements:\n\n\`\`\`${languageId}\n${text}\n\`\`\``;
            }
            
            // Copy to clipboard and open Agent mode
            await vscode.env.clipboard.writeText(chatInput);
            await openChatPanel();
            
            vscode.window.showInformationMessage(
                '📋 Prompt copied! Paste in Agent chat (Ctrl+V)',
                'OK'
            );
        }
    );

    // Save selection as insight
    const saveSelectionAsInsightDisposable = vscode.commands.registerCommand(
        'alex.saveSelectionAsInsight',
        async (uri?: vscode.Uri) => {
            let text: string | undefined;
            let languageId = 'text';
            let fileName = '';

            // If URI provided (from explorer context menu), read file content
            if (uri) {
                try {
                    const content = await vscode.workspace.fs.readFile(uri);
                    text = new TextDecoder().decode(content);
                    fileName = path.basename(uri.fsPath);
                    languageId = getLanguageIdFromPath(uri.fsPath);
                } catch (err) {
                    vscode.window.showErrorMessage(`Failed to read file: ${err}`);
                    return;
                }
            } else {
                // Try active editor
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const selection = editor.selection;
                    text = !selection.isEmpty ? editor.document.getText(selection) : '';
                    languageId = editor.document.languageId;
                    fileName = path.basename(editor.document.fileName);
                }
            }

            // If no text, fall back to input prompt and save to episodic
            if (!text) {
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
                    const insightFileName = `quick-insight-${dateStr}-${timeStr}.md`;
                    
                    const episodicPath = path.join(workspaceFolders[0].uri.fsPath, '.github', 'episodic');
                    const filePath = path.join(episodicPath, insightFileName);

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
                        await vscode.workspace.fs.createDirectory(vscode.Uri.file(episodicPath));
                        await vscode.workspace.fs.writeFile(
                            vscode.Uri.file(filePath),
                            Buffer.from(content, 'utf8')
                        );
                        
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

            // Flow with text from editor selection or file
            // Get insight details from user
            const title = await vscode.window.showInputBox({
                prompt: 'Title for this insight',
                placeHolder: 'e.g., Memoization pattern for expensive computations'
            });

            if (!title) {
                return; // User cancelled
            }

            // Category selection
            const categories: GlobalKnowledgeCategory[] = [
                'error-handling', 'api-design', 'testing', 'debugging', 
                'performance', 'architecture', 'security', 'deployment',
                'documentation', 'refactoring', 'patterns', 'tooling', 'general'
            ];

            const category = await vscode.window.showQuickPick(categories, {
                placeHolder: 'Select a category for this insight'
            }) as GlobalKnowledgeCategory || 'general';

            // Build the insight
            const insight = `**Code Pattern (${languageId}):**\n\`\`\`${languageId}\n${text}\n\`\`\``;
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
                    fileName ? `Captured from ${fileName}` : 'Captured from selection',
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
        async (uri?: vscode.Uri) => {
            let text: string | undefined;

            // If URI provided (from explorer context menu), read file content
            if (uri) {
                try {
                    const content = await vscode.workspace.fs.readFile(uri);
                    text = new TextDecoder().decode(content);
                } catch (err) {
                    vscode.window.showErrorMessage(`Failed to read file: ${err}`);
                    return;
                }
            } else {
                // Try active editor
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const selection = editor.selection;
                    text = !selection.isEmpty ? editor.document.getText(selection) : '';
                }
            }

            let keywords: string;

            // If no text, fall back to input prompt
            if (!text) {
                const query = await vscode.window.showInputBox({
                    prompt: 'What would you like to search for?',
                    placeHolder: 'e.g., error handling patterns, React hooks, TypeScript generics',
                    ignoreFocusOut: true
                });
                
                if (!query) {
                    return; // User cancelled
                }
                keywords = query;
            } else {
                // Extract keywords from text (first 100 chars, remove special chars)
                keywords = text
                    .substring(0, 100)
                    .replace(/[^a-zA-Z0-9\s]/g, ' ')
                    .split(/\s+/)
                    .filter(word => word.length > 2)
                    .slice(0, 5)
                    .join(' ');
            }

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
            quickPick.title = '🚀 Alex Knowledge Search';
            
            // Initial items (recent/popular)
            const updateItems = async (query: string) => {
                quickPick.busy = true;
                
                if (!query) {
                    // Show categories when no query
                    quickPick.items = [
                        { label: '$(folder) Patterns', description: `${status.totalPatterns} patterns`, alwaysShow: true },
                        { label: '$(lightbulb) Insights', description: `${status.totalInsights} insights`, alwaysShow: true },
                        { label: '$(pulse) Run Health Check', description: 'Check architecture status', alwaysShow: true }
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
        async (uri?: vscode.Uri) => {
            let text: string | undefined;

            // If URI provided (from explorer context menu), read file content
            if (uri) {
                try {
                    const content = await vscode.workspace.fs.readFile(uri);
                    text = new TextDecoder().decode(content);
                } catch (err) {
                    vscode.window.showErrorMessage(`Failed to read file: ${err}`);
                    return;
                }
            } else {
                // Try active editor
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const selection = editor.selection;
                    text = !selection.isEmpty ? editor.document.getText(selection) : '';
                }
            }

            let prompt: string;
            
            if (!text) {
                // No text - prompt for description
                const userInput = await vscode.window.showInputBox({
                    prompt: 'Describe the illustration you want to generate',
                    placeHolder: 'e.g., A flowchart showing user authentication process',
                    ignoreFocusOut: true
                });
                
                if (!userInput) {
                    return;
                }
                prompt = userInput;
            } else {
                prompt = text;
            }

            // Generate SVG illustration using LLM + Iconify/DiceBear
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating illustration...',
                cancellable: false
            }, async () => {
                try {
                    const svg = await generateIllustrationFromDescription(prompt);
                    if (!svg) {
                        vscode.window.showWarningMessage(
                            'Could not generate an illustration. Try a more specific description.'
                        );
                        return;
                    }

                    // Save SVG to workspace
                    const workspaceFolders = vscode.workspace.workspaceFolders;
                    if (!workspaceFolders) {
                        vscode.window.showWarningMessage('No workspace folder found');
                        return;
                    }

                    const slug = prompt
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '')
                        .substring(0, 40);
                    const fileName = `illustration-${slug}.svg`;
                    const outputDir = path.join(workspaceFolders[0].uri.fsPath, 'assets');
                    const outputPath = path.join(outputDir, fileName);

                    const outputUri = vscode.Uri.file(outputPath);
                    await vscode.workspace.fs.createDirectory(vscode.Uri.file(outputDir));
                    await vscode.workspace.fs.writeFile(outputUri, Buffer.from(svg, 'utf8'));

                    // Open the SVG file
                    const doc = await vscode.workspace.openTextDocument(outputUri);
                    await vscode.window.showTextDocument(doc);

                    const relativePath = vscode.workspace.asRelativePath(outputUri);
                    vscode.window.showInformationMessage(
                        `✅ Illustration saved: ${relativePath}`,
                        'Open Preview'
                    ).then(action => {
                        if (action === 'Open Preview') {
                            // Try to open SVG preview if available
                            vscode.commands.executeCommand('vscode.open', outputUri);
                        }
                    });
                } catch (err) {
                    vscode.window.showErrorMessage(`Failed to generate illustration: ${err}`);
                }
            });
        }
    );

    // Generate AI Image from file content
    const generateAIImageDisposable = vscode.commands.registerCommand(
        'alex.generateAIImage',
        async (uri?: vscode.Uri) => {
            // Check for Replicate API token
            const apiToken = getToken('REPLICATE_API_TOKEN');
            if (!apiToken) {
                const result = await vscode.window.showWarningMessage(
                    'Replicate API Token not configured. Set your API token to generate AI images.',
                    'Configure API Token',
                    'Get API Token',
                    'Cancel'
                );
                if (result === 'Configure API Token') {
                    vscode.commands.executeCommand('alex.manageSecrets');
                }
                if (result === 'Get API Token') {
                    vscode.env.openExternal(vscode.Uri.parse('https://replicate.com/account/api-tokens'));
                }
                return;
            }

            let prompt: string;

            // If URI provided, read file content as prompt
            if (uri) {
                try {
                    const content = await vscode.workspace.fs.readFile(uri);
                    prompt = new TextDecoder().decode(content);
                } catch (err) {
                    vscode.window.showErrorMessage(`Failed to read file: ${err}`);
                    return;
                }
            } else {
                // Prompt for description
                const userInput = await vscode.window.showInputBox({
                    prompt: 'Describe the image you want to generate',
                    placeHolder: 'e.g., A serene mountain landscape at sunset with a lake',
                    ignoreFocusOut: true
                });

                if (!userInput) {
                    return;
                }
                prompt = userInput;
            }

            // Suggest the best model based on the prompt
            const suggestedModel = selectModelForPrompt(prompt);

            // Model selection — all 7 models, recommended one highlighted
            const modelItems = buildModelQuickPickItems(suggestedModel.id);
            const modelOption = await vscode.window.showQuickPick(modelItems, {
                placeHolder: 'Select AI model (✨ = recommended for your prompt)',
                title: 'Alex — AI Image Generation'
            });

            if (!modelOption) {
                return;
            }

            // Aspect ratio selection
            const aspectOption = await vscode.window.showQuickPick([
                { label: '1:1 Square', value: '1:1' },
                { label: '16:9 Widescreen', value: '16:9' },
                { label: '9:16 Portrait', value: '9:16' },
                { label: '4:3 Standard', value: '4:3' },
                { label: '3:4 Portrait', value: '3:4' },
                { label: '3:2 Landscape', value: '3:2' }
            ], {
                placeHolder: 'Select aspect ratio',
                title: 'Alex — AI Image Generation'
            });

            if (!aspectOption) {
                return;
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `Generating image with ${modelOption.model.label}…`,
                cancellable: false
            }, async (progress) => {
                try {
                    const imageUrl = await generateImage(
                        apiToken,
                        modelOption.model.id,
                        {
                            prompt,
                            aspectRatio: aspectOption.value,
                            outputFormat: 'png'
                        },
                        progress
                    );

                    if (!imageUrl) {
                        vscode.window.showErrorMessage('Failed to generate image — no output received from Replicate');
                        return;
                    }

                    // Save to workspace using vscode.workspace.fs (sandbox-safe)
                    const workspaceFolders = vscode.workspace.workspaceFolders;
                    if (!workspaceFolders) {
                        vscode.window.showWarningMessage('No workspace folder found');
                        return;
                    }

                    const timestamp = Date.now();
                    const fileName = `ai-image-${timestamp}.png`;
                    const outputUri = vscode.Uri.joinPath(
                        workspaceFolders[0].uri,
                        'assets',
                        'generated',
                        fileName
                    );

                    await downloadImageToWorkspace(imageUrl, outputUri, progress);

                    // Open the image
                    vscode.commands.executeCommand('vscode.open', outputUri);

                    const relativePath = vscode.workspace.asRelativePath(outputUri);
                    vscode.window.showInformationMessage(
                        `✅ AI image saved: ${relativePath}`,
                        'Copy Path'
                    ).then(action => {
                        if (action === 'Copy Path') {
                            vscode.env.clipboard.writeText(relativePath);
                        }
                    });
                } catch (err) {
                    vscode.window.showErrorMessage(`Failed to generate AI image: ${err}`);
                }
            });
        }
    );

    // Edit image with AI prompt
    const editImageWithPromptDisposable = vscode.commands.registerCommand(
        'alex.editImageWithPrompt',
        async (uri?: vscode.Uri) => {
            // Check for Replicate API token
            const apiToken = getToken('REPLICATE_API_TOKEN');
            if (!apiToken) {
                const result = await vscode.window.showWarningMessage(
                    'Replicate API Token not configured. Set your API token to edit images with AI.',
                    'Configure API Token',
                    'Get API Token',
                    'Cancel'
                );
                if (result === 'Configure API Token') {
                    vscode.commands.executeCommand('alex.manageSecrets');
                }
                if (result === 'Get API Token') {
                    vscode.env.openExternal(vscode.Uri.parse('https://replicate.com/account/api-tokens'));
                }
                return;
            }

            // Get image file
            let imageUri: vscode.Uri | undefined = uri;
            if (!imageUri) {
                const files = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    filters: {
                        'Images': ['png', 'jpg', 'jpeg', 'webp', 'gif']
                    },
                    title: 'Select image to edit'
                });
                if (!files || files.length === 0) {
                    return;
                }
                imageUri = files[0];
            }

            // Validate it's an image file
            const ext = path.extname(imageUri.fsPath).toLowerCase();
            if (!['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
                vscode.window.showWarningMessage('Please select an image file (PNG, JPG, JPEG, WEBP, GIF)');
                return;
            }

            // Get edit prompt
            const editPrompt = await vscode.window.showInputBox({
                prompt: 'Describe the desired result (reference image will be used for face/style consistency)',
                placeHolder: 'e.g., Same person in a professional business suit, office background',
                ignoreFocusOut: true
            });

            if (!editPrompt) {
                return;
            }

            // Aspect ratio selection
            const aspectOption = await vscode.window.showQuickPick([
                { label: '1:1 Square', value: '1:1' },
                { label: '16:9 Widescreen', value: '16:9' },
                { label: '9:16 Portrait', value: '9:16' },
                { label: '4:3 Standard', value: '4:3' },
                { label: '3:4 Vertical', value: '3:4' }
            ], {
                placeHolder: 'Select output aspect ratio',
                title: 'AI Image Edit - Aspect Ratio'
            });

            if (!aspectOption) {
                return;
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Editing image with AI...',
                cancellable: false
            }, async (progress) => {
                try {
                    progress.report({ message: 'Reading and resizing image…' });

                    // Read image and resize if needed (uses vscode.workspace.fs — sandbox-safe)
                    const rawBytes = await vscode.workspace.fs.readFile(imageUri);
                    const imageBuffer = await resizeImageIfNeeded(Buffer.from(rawBytes), MAX_IMAGE_DIMENSION);

                    // Encode as data URI for Replicate image_input
                    const base64 = imageBuffer.toString('base64');
                    const mimeType = ext === '.png' ? 'image/png' :
                                   ext === '.gif' ? 'image/gif' :
                                   ext === '.webp' ? 'image/webp' : 'image/jpeg';
                    const dataUri = `data:${mimeType};base64,${base64}`;

                    progress.report({ message: 'Processing image with AI…' });

                    // Use google/nano-banana-pro for face/style-consistent editing
                    let prediction = await createPrediction(
                        apiToken,
                        'google/nano-banana-pro',
                        {
                            prompt: editPrompt,
                            image_input: [dataUri],
                            aspect_ratio: aspectOption.value,
                            output_format: 'png',
                            safety_filter_level: 'block_only_high'
                        }
                    );

                    if (prediction.status !== 'succeeded' && prediction.id) {
                        prediction = await pollPrediction(apiToken, prediction.id);
                    }

                    const outputArr = prediction.output;
                    const result = Array.isArray(outputArr) ? outputArr[0] : outputArr;

                    if (!result) {
                        vscode.window.showErrorMessage('Failed to edit image — no output received');
                        return;
                    }

                    progress.report({ message: 'Saving result…' });

                    // Save edited image using vscode.workspace.fs (sandbox-safe)
                    const workspaceFolders = vscode.workspace.workspaceFolders;
                    if (!workspaceFolders) {
                        vscode.window.showWarningMessage('No workspace folder found');
                        return;
                    }

                    const originalName = path.basename(imageUri.fsPath, ext);
                    const timestamp = Date.now();
                    const fileName = `${originalName}-edited-${timestamp}.png`;
                    const outputUri = vscode.Uri.joinPath(
                        workspaceFolders[0].uri,
                        'assets', 'edited', fileName
                    );

                    await downloadImageToWorkspace(result as string, outputUri, progress);

                    // Open the edited image
                    vscode.commands.executeCommand('vscode.open', outputUri);

                    const relativePath = vscode.workspace.asRelativePath(outputUri);
                    vscode.window.showInformationMessage(
                        `✅ Edited image saved: ${relativePath}`,
                        'Copy Path',
                        'Open Original'
                    ).then(action => {
                        if (action === 'Copy Path') {
                            vscode.env.clipboard.writeText(relativePath);
                        }
                        if (action === 'Open Original') {
                            vscode.commands.executeCommand('vscode.open', imageUri);
                        }
                    });
                } catch (err) {
                    vscode.window.showErrorMessage(`Failed to edit image: ${err}`);
                }
            });
        }
    );

    context.subscriptions.push(askAboutSelectionDisposable);
    context.subscriptions.push(saveSelectionAsInsightDisposable);
    context.subscriptions.push(searchRelatedKnowledgeDisposable);
    context.subscriptions.push(knowledgeQuickPickDisposable);
    context.subscriptions.push(generateImageFromSelectionDisposable);
    context.subscriptions.push(generateAIImageDisposable);
    context.subscriptions.push(editImageWithPromptDisposable);
}
