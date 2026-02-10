/**
 * UX Excellence Features v5.2.0
 * 
 * Implements the v5.2.0 UX Excellence roadmap items:
 * - Voice Mode Toggle (status bar + auto-read)
 * - Model Tier Status Bar
 * - Quick Command Palette
 * - Daily Briefing
 */

import * as vscode from 'vscode';
import { synthesize, prepareTextForSpeech, playWithWebview, detectLanguage, getVoiceForLanguage } from '../tts';
import { summarizeForSpeech, LONG_CONTENT_WORD_THRESHOLD } from '../commands/readAloud';

// Extension context for TTS playback
let extensionContext: vscode.ExtensionContext | undefined;

// Voice Mode Status Bar
let voiceModeStatusBar: vscode.StatusBarItem | undefined;
let modelTierStatusBar: vscode.StatusBarItem | undefined;

// Voice mode state
let voiceModeEnabled = false;

/**
 * Model tier definitions
 */
export type ModelTier = 'frontier' | 'capable' | 'efficient' | 'unknown';

export interface ModelTierInfo {
  tier: ModelTier;
  name: string;
  icon: string;
  color?: vscode.ThemeColor;
}

const MODEL_TIER_MAP: Record<string, ModelTier> = {
  // Frontier tier
  'claude-opus-4': 'frontier',
  'claude-opus-4.5': 'frontier',
  'claude-opus-4.6': 'frontier',
  'gpt-5.2': 'frontier',
  'gpt-5-turbo': 'frontier',
  // Capable tier
  'claude-sonnet-4': 'capable',
  'claude-sonnet-4.5': 'capable',
  'gpt-5.1': 'capable',
  'gpt-5.1-codex': 'capable',
  'gpt-4o': 'capable',
  // Efficient tier
  'claude-haiku-4': 'efficient',
  'claude-haiku-4.5': 'efficient',
  'gpt-5-mini': 'efficient',
  'gpt-4.1': 'efficient',
  'gpt-4o-mini': 'efficient',
};

const TIER_INFO: Record<ModelTier, Omit<ModelTierInfo, 'tier' | 'name'>> = {
  frontier: { icon: '$(rocket)', color: new vscode.ThemeColor('charts.green') },
  capable: { icon: '$(symbol-class)', color: new vscode.ThemeColor('charts.blue') },
  efficient: { icon: '$(zap)', color: new vscode.ThemeColor('charts.yellow') },
  unknown: { icon: '$(question)', color: undefined },
};

/**
 * Quick command definitions
 */
interface QuickCommand {
  label: string;
  description: string;
  command: string;
  detail?: string;
  icon: string;
}

const QUICK_COMMANDS: QuickCommand[] = [
  { label: '$(play) Start Session', description: 'Start a focus session', command: 'alex.startSession', icon: '$(play)' },
  { label: '$(sparkle) Self-Actualize', description: 'Deep architecture assessment', command: 'alex.selfActualize', icon: '$(sparkle)' },
  { label: '$(pulse) Dream', description: 'Neural maintenance', command: 'alex.dream', icon: '$(pulse)' },
  { label: '$(sync) Sync Knowledge', description: 'Sync with Global Knowledge', command: 'alex.syncKnowledge', icon: '$(sync)' },
  { label: '$(calendar) Daily Briefing', description: 'Get your daily summary', command: 'alex.dailyBriefing', icon: '$(calendar)' },
  { label: '$(dashboard) Cognitive Dashboard', description: 'View architecture health', command: 'alex.showCognitiveDashboard', icon: '$(dashboard)' },
  { label: '$(unmute) Toggle Voice', description: 'Enable/disable voice mode (Ctrl+Alt+V)', command: 'alex.toggleVoice', icon: '$(unmute)' },
  { label: '$(target) Show Goals', description: 'View learning goals', command: 'alex.showGoals', icon: '$(target)' },
  { label: '$(book) Read Aloud', description: 'Read current selection (Ctrl+Alt+R)', command: 'alex.readAloud', icon: '$(book)' },
  { label: '$(comment-discussion) Speak Prompt', description: 'Generate & speak content (Ctrl+Alt+P)', command: 'alex.speakPrompt', icon: '$(comment-discussion)' },
  { label: '$(gear) Setup Environment', description: 'Configure workspace', command: 'alex.setupEnvironment', icon: '$(gear)' },
];

/**
 * Initialize all UX features
 */
export function initializeUXFeatures(context: vscode.ExtensionContext): void {
  // Store context for TTS playback
  extensionContext = context;

  // Initialize voice mode from settings
  const config = vscode.workspace.getConfiguration('alex.voice');
  voiceModeEnabled = config.get('enabled', false);

  // Create voice mode status bar
  createVoiceModeStatusBar(context);

  // Create model tier status bar
  createModelTierStatusBar(context);

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('alex.voice.enabled')) {
        voiceModeEnabled = vscode.workspace.getConfiguration('alex.voice').get('enabled', false);
        updateVoiceModeStatusBar();
      }
    })
  );

  // Detect model on activation and periodically
  detectAndUpdateModelTier();
}

/**
 * Create voice mode status bar item
 */
function createVoiceModeStatusBar(context: vscode.ExtensionContext): void {
  voiceModeStatusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    98 // Lower priority than main Alex status bar (100)
  );
  voiceModeStatusBar.command = 'alex.toggleVoice';
  updateVoiceModeStatusBar();
  voiceModeStatusBar.show();
  context.subscriptions.push(voiceModeStatusBar);
}

/**
 * Update voice mode status bar display
 */
function updateVoiceModeStatusBar(): void {
  if (!voiceModeStatusBar) {return;}

  if (voiceModeEnabled) {
    voiceModeStatusBar.text = '$(unmute) Voice';
    voiceModeStatusBar.tooltip = new vscode.MarkdownString(
      `### 🔊 Voice Mode: ON\n\n` +
      `Alex will read responses aloud\n\n` +
      `**Shortcuts:**\n` +
      `- Toggle: \`Ctrl+Alt+V\`\n` +
      `- Read Selection: \`Ctrl+Alt+R\`\n` +
      `- Speak Prompt: \`Ctrl+Alt+P\`\n` +
      `- Stop: \`Escape\`\n\n` +
      `_Click to disable_`
    );
    voiceModeStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  } else {
    voiceModeStatusBar.text = '$(mute)';
    voiceModeStatusBar.tooltip = new vscode.MarkdownString(
      `### 🔇 Voice Mode: OFF\n\n` +
      `**Shortcuts:**\n` +
      `- Toggle: \`Ctrl+Alt+V\`\n` +
      `- Read Selection: \`Ctrl+Alt+R\`\n` +
      `- Speak Prompt: \`Ctrl+Alt+P\`\n\n` +
      `_Click to enable_`
    );
    voiceModeStatusBar.backgroundColor = undefined;
  }
}

/**
 * Create model tier status bar item
 */
function createModelTierStatusBar(context: vscode.ExtensionContext): void {
  modelTierStatusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    97 // Lower priority than voice mode (98)
  );
  modelTierStatusBar.tooltip = 'Current AI Model Tier';
  context.subscriptions.push(modelTierStatusBar);
}

/**
 * Detect the current model tier from available chat models
 */
async function detectAndUpdateModelTier(): Promise<void> {
  try {
    // Try to select available chat models
    const models = await vscode.lm.selectChatModels();
    
    if (models.length === 0) {
      updateModelTierStatusBar('unknown', 'No model');
      return;
    }

    // Get the first (preferred) model
    const model = models[0];
    const modelId = model.id.toLowerCase();
    const modelFamily = model.family?.toLowerCase() || '';

    // Determine tier from model ID or family
    let detectedTier: ModelTier = 'unknown';
    let modelName = model.name || model.id;

    for (const [pattern, tier] of Object.entries(MODEL_TIER_MAP)) {
      if (modelId.includes(pattern) || modelFamily.includes(pattern)) {
        detectedTier = tier;
        break;
      }
    }

    // Fallback tier detection based on common patterns
    if (detectedTier === 'unknown') {
      if (modelId.includes('opus') || modelId.includes('gpt-5.2')) {
        detectedTier = 'frontier';
      } else if (modelId.includes('sonnet') || modelId.includes('gpt-4o') || modelId.includes('gpt-5')) {
        detectedTier = 'capable';
      } else if (modelId.includes('haiku') || modelId.includes('mini') || modelId.includes('gpt-4.1')) {
        detectedTier = 'efficient';
      }
    }

    updateModelTierStatusBar(detectedTier, modelName);
  } catch (error) {
    console.warn('[Alex UX] Failed to detect model tier:', error);
    updateModelTierStatusBar('unknown', 'Unknown');
  }
}

/**
 * Update model tier status bar display
 */
function updateModelTierStatusBar(tier: ModelTier, modelName: string): void {
  if (!modelTierStatusBar) {return;}

  const tierInfo = TIER_INFO[tier];
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  modelTierStatusBar.text = `${tierInfo.icon} ${tierLabel}`;
  modelTierStatusBar.tooltip = `Model: ${modelName}\nTier: ${tierLabel}\n\nFrontier = Deep reasoning, complex tasks\nCapable = Good reasoning, standard tasks\nEfficient = Fast, simple tasks`;
  modelTierStatusBar.backgroundColor = tierInfo.color ? new vscode.ThemeColor('statusBarItem.prominentBackground') : undefined;
  modelTierStatusBar.show();
}

/**
 * Toggle voice mode command handler
 */
export async function toggleVoiceMode(): Promise<void> {
  voiceModeEnabled = !voiceModeEnabled;
  
  const config = vscode.workspace.getConfiguration('alex.voice');
  await config.update('enabled', voiceModeEnabled, vscode.ConfigurationTarget.Global);
  
  updateVoiceModeStatusBar();
  
  vscode.window.showInformationMessage(
    voiceModeEnabled 
      ? '🔊 Voice Mode enabled - Alex will read responses aloud' 
      : '🔇 Voice Mode disabled'
  );
}

/**
 * Check if voice mode is enabled
 */
export function isVoiceModeEnabled(): boolean {
  return voiceModeEnabled;
}

/**
 * Speak text aloud if voice mode is enabled
 * Used by chat participant to auto-read responses
 * @param text - The text to speak (markdown will be stripped)
 * @param maxLength - Maximum characters to speak (default 5000, long content summarized)
 */
export async function speakIfVoiceModeEnabled(text: string, maxLength: number = 5000): Promise<void> {
  if (!voiceModeEnabled || !extensionContext || !text.trim()) {
    return;
  }

  try {
    // Prepare text for speech (strip markdown, etc.)
    let textToSpeak = prepareTextForSpeech(text);

    // Skip very short responses
    if (textToSpeak.length < 10) {
      return;
    }

    // Check if content is too long and should be summarized
    const wordCount = textToSpeak.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount > LONG_CONTENT_WORD_THRESHOLD) {
      // Attempt to summarize long content
      try {
        const summary = await summarizeForSpeech(text);
        if (summary) {
          textToSpeak = `Here's a summary: ${summary}`;
        } else {
          // Fallback: truncate if summarization fails
          textToSpeak = textToSpeak.substring(0, maxLength) + '... Content truncated.';
        }
      } catch {
        // Summarization failed, truncate
        textToSpeak = textToSpeak.substring(0, maxLength) + '... Content truncated.';
      }
    } else if (textToSpeak.length > maxLength) {
      // Normal truncation for moderately long text
      textToSpeak = textToSpeak.substring(0, maxLength) + '... Message truncated.';
    }

    // Detect language and get appropriate voice
    const detected = detectLanguage(textToSpeak);
    const voice = getVoiceForLanguage(detected.lang);

    // Synthesize and play (in background, don't block)
    const audioBuffer = await synthesize(textToSpeak, { voice, lang: detected.lang });
    await playWithWebview(audioBuffer, extensionContext, undefined, voice);
  } catch (error) {
    // Don't show errors for voice mode - just log
    console.warn('[Alex Voice] Auto-read failed:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Quick Commands picker
 */
export async function showQuickCommands(): Promise<void> {
  const items: vscode.QuickPickItem[] = QUICK_COMMANDS.map(cmd => ({
    label: cmd.label,
    description: cmd.description,
    detail: cmd.detail,
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select an Alex command...',
    title: 'Alex Quick Commands',
  });

  if (selected) {
    const command = QUICK_COMMANDS.find(cmd => cmd.label === selected.label);
    if (command) {
      await vscode.commands.executeCommand(command.command);
    }
  }
}

/**
 * Daily Briefing data structure
 */
interface DailyBriefingData {
  date: string;
  streak: number;
  goalsInProgress: number;
  goalsCompleted: number;
  recentMeditation: string | null;
  synapseHealth: string;
  skillCount: number;
  focusMinutesToday: number;
}

/**
 * Generate daily briefing
 */
export async function generateDailyBriefing(context: vscode.ExtensionContext): Promise<string> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    return "Good morning! Open a workspace with Alex architecture to get your personalized briefing.";
  }

  // Collect briefing data
  const data = await collectBriefingData(workspaceFolder.uri);

  // Format briefing
  const greeting = getTimeBasedGreeting();
  const dateStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let briefing = `## ${greeting}\n\n`;
  briefing += `**${dateStr}**\n\n`;

  // Streak info
  if (data.streak > 0) {
    briefing += `🔥 **${data.streak}-day streak!** Keep the momentum going.\n\n`;
  }

  // Goals summary
  if (data.goalsInProgress > 0 || data.goalsCompleted > 0) {
    briefing += `### Goals\n`;
    briefing += `- 🎯 ${data.goalsInProgress} goals in progress\n`;
    briefing += `- ✅ ${data.goalsCompleted} goals completed\n\n`;
  }

  // Architecture health
  briefing += `### Architecture\n`;
  briefing += `- 🧠 ${data.skillCount} skills available\n`;
  briefing += `- ${data.synapseHealth}\n`;
  
  if (data.recentMeditation) {
    briefing += `- 🧘 Last meditation: ${data.recentMeditation}\n`;
  }

  // Focus time
  if (data.focusMinutesToday > 0) {
    briefing += `\n### Focus Today\n`;
    briefing += `- ⏱️ ${data.focusMinutesToday} minutes in focus sessions\n`;
  }

  briefing += `\n---\n*Ready to learn? Start with "/learn [topic]" or "/session [topic]"*`;

  return briefing;
}

/**
 * Collect data for daily briefing
 */
async function collectBriefingData(workspaceUri: vscode.Uri): Promise<DailyBriefingData> {
  const data: DailyBriefingData = {
    date: new Date().toISOString().split('T')[0],
    streak: 0,
    goalsInProgress: 0,
    goalsCompleted: 0,
    recentMeditation: null,
    synapseHealth: '💚 Healthy',
    skillCount: 0,
    focusMinutesToday: 0,
  };

  try {
    // Check goals file
    const goalsUri = vscode.Uri.joinPath(workspaceUri, '.github', 'config', 'goals.json');
    try {
      const goalsContent = await vscode.workspace.fs.readFile(goalsUri);
      const goals = JSON.parse(Buffer.from(goalsContent).toString());
      if (Array.isArray(goals.goals)) {
        data.goalsInProgress = goals.goals.filter((g: any) => g.status === 'in-progress').length;
        data.goalsCompleted = goals.goals.filter((g: any) => g.status === 'completed').length;
      }
      if (typeof goals.streak === 'number') {
        data.streak = goals.streak;
      }
    } catch {
      // Goals file doesn't exist
    }

    // Count skills
    const skillsUri = vscode.Uri.joinPath(workspaceUri, '.github', 'skills');
    try {
      const skillDirs = await vscode.workspace.fs.readDirectory(skillsUri);
      data.skillCount = skillDirs.filter(([_, type]) => type === vscode.FileType.Directory).length;
    } catch {
      // Skills directory doesn't exist
    }

    // Check for recent meditation in episodic memory
    const episodicUri = vscode.Uri.joinPath(workspaceUri, '.github', 'episodic');
    try {
      const files = await vscode.workspace.fs.readDirectory(episodicUri);
      const meditationFiles = files
        .filter(([name]) => name.includes('meditation') || name.includes('session'))
        .sort((a, b) => b[0].localeCompare(a[0]));
      
      if (meditationFiles.length > 0) {
        const lastMeditation = meditationFiles[0][0];
        const dateMatch = lastMeditation.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          data.recentMeditation = dateMatch[1];
        }
      }
    } catch {
      // Episodic directory doesn't exist
    }

  } catch (error) {
    console.warn('[Alex UX] Error collecting briefing data:', error);
  }

  return data;
}

/**
 * Get time-based greeting
 */
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {return 'Good morning!';}
  if (hour < 17) {return 'Good afternoon!';}
  if (hour < 21) {return 'Good evening!';}
  return 'Working late?';
}

/**
 * Show Daily Briefing in a new editor
 */
export async function showDailyBriefing(context: vscode.ExtensionContext): Promise<void> {
  const briefing = await generateDailyBriefing(context);
  
  // Create a new untitled document with the briefing
  const doc = await vscode.workspace.openTextDocument({
    content: briefing,
    language: 'markdown'
  });
  
  await vscode.window.showTextDocument(doc, {
    preview: true,
    viewColumn: vscode.ViewColumn.Beside,
  });

  // Also send to chat if Alex participant is available
  try {
    await openChatPanel(`/status\n\n${briefing}`);
  } catch {
    // Chat panel not available, document is shown instead
  }
}

/**
 * Open chat panel helper
 */
async function openChatPanel(message: string): Promise<void> {
  // This is a placeholder - actual implementation would use VS Code Chat API
  // For now, we show the briefing in a document
}

/**
 * Register all UX Excellence v5.2.0 commands
 */
export function registerUXCommands(context: vscode.ExtensionContext): void {
  // Initialize UX features (status bars, etc.)
  initializeUXFeatures(context);

  // Toggle Voice Mode command
  context.subscriptions.push(
    vscode.commands.registerCommand('alex.toggleVoice', () => toggleVoiceMode())
  );

  // Quick Commands palette
  context.subscriptions.push(
    vscode.commands.registerCommand('alex.quickCommands', () => showQuickCommands())
  );

  // Daily Briefing command
  context.subscriptions.push(
    vscode.commands.registerCommand('alex.dailyBriefing', () => showDailyBriefing(context))
  );

  // Show Cognitive Dashboard command (opens the sidebar view)
  context.subscriptions.push(
    vscode.commands.registerCommand('alex.showCognitiveDashboard', async () => {
      // Focus the cognitive dashboard view in sidebar
      await vscode.commands.executeCommand('alex.cognitiveDashboard.focus');
    })
  );
}
