import * as vscode from 'vscode';
import { createGlobalInsight, searchGlobalKnowledge } from '../chat/globalKnowledge';
import { GlobalKnowledgeCategory } from '../shared/constants';
import { autoIncrementGoals } from './goals';

/**
 * Auto-Insights Detection - Automatically detect and offer to save valuable learnings
 * 
 * Features:
 * - Pattern detection in chat conversations
 * - Problem/solution pair extraction
 * - Code pattern recognition
 * - Duplicate detection (avoid saving similar insights)
 * - Category inference from context
 * - Non-intrusive notification system
 */

/**
 * Patterns that indicate valuable learnings in conversation
 * These are string patterns to avoid regex state issues
 */
const INSIGHT_PATTERNS = {
    // Learning indicators
    learning: [
        'i learned',
        'i discovered',
        'i realized',
        'i found out',
        'i figured out',
        'now i understand',
        'makes sense now'
    ],
    
    // Solution indicators
    solution: [
        'the solution is',
        'the solution was',
        'the fix is',
        'the fix was',
        'the answer is',
        'what fixed it',
        'solved by',
        'resolved by',
        'this works because',
        'the reason is'
    ],
    
    // Best practice indicators
    bestPractice: [
        'best practice',
        'pro tip',
        'important to note',
        'always remember',
        'never forget',
        'make sure to',
        'be careful to',
        'the trick is',
        'the key is'
    ],
    
    // Debugging/troubleshooting
    debugging: [
        'debugging tip',
        'troubleshooting',
        'gotcha',
        'pitfall',
        'common mistake',
        'watch out for',
        'error was caused by',
        'issue was'
    ],
    
    // Performance/optimization
    performance: [
        'performance tip',
        'optimization',
        'faster if',
        'more efficient',
        'reduces memory',
        'improves speed'
    ]
};

/**
 * Category-specific keywords for inference
 */
/* eslint-disable @typescript-eslint/naming-convention */
const CATEGORY_KEYWORDS: Record<GlobalKnowledgeCategory, string[]> = {
    'error-handling': ['error', 'exception', 'catch', 'try', 'throw', 'handle'],
    'api-design': ['api', 'endpoint', 'rest', 'graphql', 'request', 'response'],
    'testing': ['test', 'jest', 'mocha', 'assert', 'expect', 'mock', 'stub'],
    'debugging': ['debug', 'breakpoint', 'console.log', 'inspect', 'trace'],
    'performance': ['performance', 'optimize', 'cache', 'memory', 'speed', 'latency'],
    'architecture': ['architecture', 'pattern', 'design', 'structure', 'module'],
    'security': ['security', 'auth', 'token', 'encrypt', 'permission', 'vulnerability'],
    'deployment': ['deploy', 'ci/cd', 'docker', 'kubernetes', 'pipeline'],
    'documentation': ['doc', 'readme', 'comment', 'jsdoc', 'typedoc'],
    'refactoring': ['refactor', 'clean', 'simplify', 'extract', 'rename'],
    'patterns': ['pattern', 'singleton', 'factory', 'observer', 'strategy'],
    'tooling': ['tool', 'cli', 'npm', 'yarn', 'webpack', 'vscode'],
    'general': []
};
/* eslint-enable @typescript-eslint/naming-convention */

export interface DetectedInsight {
    type: 'learning' | 'solution' | 'bestPractice' | 'debugging' | 'performance';
    confidence: number;
    matchedPatterns: string[];
    suggestedCategory: GlobalKnowledgeCategory;
    suggestedTags: string[];
    excerpt: string;
    fullContent: string;
    codeBlocks: string[];
}

/**
 * Analyze text for potential insights
 */
export function detectInsights(text: string): DetectedInsight | null {
    const lowerText = text.toLowerCase();
    const matchedPatterns: string[] = [];
    let type: DetectedInsight['type'] | null = null;
    let maxMatches = 0;
    
    // Check each pattern category
    for (const [patternType, patterns] of Object.entries(INSIGHT_PATTERNS)) {
        const matches = patterns.filter(p => lowerText.includes(p));
        if (matches.length > maxMatches) {
            maxMatches = matches.length;
            type = patternType as DetectedInsight['type'];
            matchedPatterns.push(...matches);
        }
    }
    
    // Need at least one pattern match
    if (!type || matchedPatterns.length === 0) {
        return null;
    }
    
    // Calculate confidence based on pattern matches and content length
    const hasCodeBlock = text.includes('```');
    const hasBulletPoints = /^[\s]*[-*]\s/m.test(text);
    const hasNumberedList = /^[\s]*\d+\.\s/m.test(text);
    
    let confidence = matchedPatterns.length * 0.2;
    if (hasCodeBlock) { confidence += 0.3; }
    if (hasBulletPoints || hasNumberedList) { confidence += 0.15; }
    if (text.length > 200) { confidence += 0.1; }
    
    confidence = Math.min(confidence, 1.0);
    
    // Minimum confidence threshold
    if (confidence < 0.3) {
        return null;
    }
    
    // Extract code blocks
    const codeBlocks: string[] = [];
    const codeBlockRegex = /```[\w]*\n?([\s\S]*?)```/g;
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
        codeBlocks.push(match[1].trim());
    }
    
    // Infer category from content
    const suggestedCategory = inferCategory(text);
    
    // Generate tags from code blocks and keywords
    const suggestedTags = generateTags(text, codeBlocks);
    
    // Create excerpt (first meaningful sentence)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const excerpt = sentences[0]?.trim().substring(0, 150) || text.substring(0, 150);
    
    return {
        type,
        confidence,
        matchedPatterns,
        suggestedCategory,
        suggestedTags,
        excerpt: excerpt + (excerpt.length >= 150 ? '...' : ''),
        fullContent: text,
        codeBlocks
    };
}

/**
 * Infer the best category for the content
 */
function inferCategory(text: string): GlobalKnowledgeCategory {
    const lowerText = text.toLowerCase();
    let bestCategory: GlobalKnowledgeCategory = 'general';
    let maxScore = 0;
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (category === 'general') { continue; }
        
        const score = keywords.filter(k => lowerText.includes(k)).length;
        if (score > maxScore) {
            maxScore = score;
            bestCategory = category as GlobalKnowledgeCategory;
        }
    }
    
    return bestCategory;
}

/**
 * Generate relevant tags from content
 */
function generateTags(text: string, codeBlocks: string[]): string[] {
    const tags: Set<string> = new Set();
    const lowerText = text.toLowerCase();
    
    // Programming languages from code blocks
    const codeBlockHeaders = text.matchAll(/```(\w+)/g);
    for (const match of codeBlockHeaders) {
        if (match[1] && match[1] !== 'text' && match[1] !== 'plaintext') {
            tags.add(match[1].toLowerCase());
        }
    }
    
    // Common technologies mentioned
    const techKeywords = [
        'typescript', 'javascript', 'python', 'react', 'vue', 'angular',
        'node', 'express', 'fastapi', 'django', 'flask',
        'vscode', 'git', 'docker', 'kubernetes',
        'azure', 'aws', 'gcp', 'mongodb', 'postgresql', 'redis'
    ];
    
    for (const tech of techKeywords) {
        if (lowerText.includes(tech)) {
            tags.add(tech);
        }
    }
    
    return Array.from(tags).slice(0, 5);
}

/**
 * Check if a similar insight already exists
 */
export async function isDuplicateInsight(insight: DetectedInsight): Promise<boolean> {
    try {
        // Search for similar insights
        const results = await searchGlobalKnowledge(insight.excerpt, {
            type: 'insight',
            limit: 5
        });
        
        // Check for high similarity (simple heuristic: shared keywords)
        const insightWords = new Set(
            insight.excerpt.toLowerCase()
                .split(/\s+/)
                .filter(w => w.length > 4)
        );
        
        for (const result of results) {
            const existingWords = new Set(
                (result.entry.summary || '').toLowerCase()
                    .split(/\s+/)
                    .filter(w => w.length > 4)
            );
            
            // Count shared words
            const shared = [...insightWords].filter(w => existingWords.has(w)).length;
            const similarity = shared / Math.max(insightWords.size, existingWords.size);
            
            if (similarity > 0.6) {
                return true; // Likely duplicate
            }
        }
        
        return false;
    } catch {
        return false; // On error, allow saving
    }
}

/**
 * Show non-intrusive notification to save insight
 */
export async function promptToSaveInsight(insight: DetectedInsight): Promise<void> {
    // Check for duplicates first
    const isDuplicate = await isDuplicateInsight(insight);
    if (isDuplicate) {
        console.log('Auto-insight skipped: likely duplicate');
        return;
    }
    
    const typeEmoji = {
        learning: '💡',
        solution: '✅',
        bestPractice: '📚',
        debugging: '🔧',
        performance: '⚡'
    };
    
    const typeLabel = {
        learning: 'Learning',
        solution: 'Solution',
        bestPractice: 'Best Practice',
        debugging: 'Debugging Tip',
        performance: 'Performance Tip'
    };
    
    const action = await vscode.window.showInformationMessage(
        `${typeEmoji[insight.type]} Detected ${typeLabel[insight.type]}: "${insight.excerpt}"`,
        'Save Insight',
        'Edit & Save',
        'Dismiss'
    );
    
    if (action === 'Save Insight') {
        await saveInsightDirectly(insight);
    } else if (action === 'Edit & Save') {
        await saveInsightWithDialog(insight);
    }
}

/**
 * Save insight directly with auto-generated metadata
 */
async function saveInsightDirectly(insight: DetectedInsight): Promise<void> {
    try {
        // Generate a title from the excerpt
        const title = insight.excerpt.length > 60 
            ? insight.excerpt.substring(0, 60) + '...'
            : insight.excerpt;
        
        // Get current project name
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const sourceProject = workspaceFolders?.[0]?.name || 'Unknown';
        
        await createGlobalInsight(
            title,
            insight.fullContent,
            insight.suggestedCategory,
            insight.suggestedTags,
            sourceProject,
            `Auto-detected ${insight.type} with ${Math.round(insight.confidence * 100)}% confidence`,
            insight.codeBlocks.length > 0 ? `Code pattern:\n\`\`\`\n${insight.codeBlocks[0]}\n\`\`\`` : undefined
        );
        
        // Auto-increment insight goals
        try {
            await autoIncrementGoals('insight');
        } catch (err) {
            console.warn('Failed to auto-increment goals:', err);
        }
        
        vscode.window.showInformationMessage(
            `✅ Saved insight: "${title}"`,
            'View Knowledge'
        ).then(action => {
            if (action === 'View Knowledge') {
                vscode.commands.executeCommand('alex.knowledgeQuickPick');
            }
        });
    } catch (err) {
        vscode.window.showErrorMessage(`Failed to save insight: ${err}`);
    }
}

/**
 * Save insight with user editing opportunity
 */
async function saveInsightWithDialog(insight: DetectedInsight): Promise<void> {
    // Get custom title
    const title = await vscode.window.showInputBox({
        prompt: 'Title for this insight',
        value: insight.excerpt.substring(0, 80),
        placeHolder: 'Enter a descriptive title'
    });
    
    if (!title) {
        return; // User cancelled
    }
    
    // Allow category selection
    const categories: GlobalKnowledgeCategory[] = [
        'error-handling', 'api-design', 'testing', 'debugging',
        'performance', 'architecture', 'security', 'deployment',
        'documentation', 'refactoring', 'patterns', 'tooling', 'general'
    ];
    
    const category = await vscode.window.showQuickPick(categories, {
        placeHolder: `Suggested: ${insight.suggestedCategory}`,
        title: 'Select category'
    }) as GlobalKnowledgeCategory || insight.suggestedCategory;
    
    // Get current project name
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const sourceProject = workspaceFolders?.[0]?.name || 'Unknown';
    
    try {
        await createGlobalInsight(
            title,
            insight.fullContent,
            category,
            insight.suggestedTags,
            sourceProject,
            `Captured ${insight.type}`,
            insight.codeBlocks.length > 0 ? `Code pattern:\n\`\`\`\n${insight.codeBlocks[0]}\n\`\`\`` : undefined
        );
        
        // Auto-increment insight goals
        try {
            await autoIncrementGoals('insight');
        } catch (err) {
            console.warn('Failed to auto-increment goals:', err);
        }
        
        vscode.window.showInformationMessage(`✅ Saved insight: "${title}"`);
    } catch (err) {
        vscode.window.showErrorMessage(`Failed to save insight: ${err}`);
    }
}

/**
 * Debounce mechanism for insight detection
 * Prevents too many prompts in quick succession
 */
let lastPromptTime = 0;
const PROMPT_COOLDOWN_MS = 60000; // 1 minute between prompts

/**
 * Process text for potential insights (debounced)
 */
export async function processForInsights(text: string): Promise<void> {
    // Check cooldown
    const now = Date.now();
    if (now - lastPromptTime < PROMPT_COOLDOWN_MS) {
        return;
    }
    
    // Detect insights
    const insight = detectInsights(text);
    if (!insight) {
        return;
    }
    
    // Update cooldown
    lastPromptTime = now;
    
    // Prompt user (non-blocking)
    promptToSaveInsight(insight);
}

/**
 * Configuration for auto-insights feature
 */
export interface AutoInsightsConfig {
    enabled: boolean;
    minimumConfidence: number;
    cooldownMinutes: number;
    autoSaveHighConfidence: boolean;
}

const DEFAULT_CONFIG: AutoInsightsConfig = {
    enabled: true,
    minimumConfidence: 0.3,
    cooldownMinutes: 1,
    autoSaveHighConfidence: false
};

/**
 * Get auto-insights configuration
 */
export function getAutoInsightsConfig(): AutoInsightsConfig {
    const config = vscode.workspace.getConfiguration('alex');
    return {
        enabled: config.get('autoInsights.enabled', DEFAULT_CONFIG.enabled),
        minimumConfidence: config.get('autoInsights.minimumConfidence', DEFAULT_CONFIG.minimumConfidence),
        cooldownMinutes: config.get('autoInsights.cooldownMinutes', DEFAULT_CONFIG.cooldownMinutes),
        autoSaveHighConfidence: config.get('autoInsights.autoSaveHighConfidence', DEFAULT_CONFIG.autoSaveHighConfidence)
    };
}
