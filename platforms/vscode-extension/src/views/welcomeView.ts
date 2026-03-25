import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { logInfo } from '../shared/logger';
import {
  checkHealth,
  HealthCheckResult,
  HealthStatus,
} from "../shared/healthCheck";
import { detectGlobalKnowledgeRepo } from "../chat/globalKnowledge";
import {
  detectPersona,
  loadUserProfile,
} from "../chat/personaDetection";
import {
  readActiveContext,
  updatePersona,
} from "../shared/activeContextManager";
import { openChatPanel } from "../shared/utils";
import { isOperationInProgress } from "../shared/operationLock";
import { trackRecommendationFeedback } from "../chat/skillRecommendations";
import { nasaAssert } from "../shared/nasaAssert";
import {
  Nudge,
  MindTabData,
  SkillInfo,
  TokenStatusInfo,
  SettingsToggle,
  getLoadingHtml,
  getErrorHtml,
  getWelcomeHtmlContent,
} from "./welcomeViewHtml";
import { getTokenStatuses, TOKEN_CONFIGS } from '../services/secretsManager';
import { getCalibrationSummary } from '../chat/honestUncertainty';

export class WelcomeViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "alex.welcomeView";

  private _view?: vscode.WebviewView;
  private _extensionUri: vscode.Uri;
  private _context?: vscode.ExtensionContext;
  private _cognitiveState: string | null = null;
  private _agentMode: string | null = null;
  private _currentPersonaId: string | null = null;
  private _userBirthday: string | null = null;

  constructor(extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
    this._extensionUri = extensionUri;
    this._context = context;
    this._markUsed();
  }

  private _markUsed(): void {
    // mark private fields as used for TS strict unused checks
    void this._context;
    void this._currentPersonaId;
    void this._userBirthday;
  }

  private static readonly LOCKED_COMMANDS = [
    "dream",
    "setupEnvironment",
    "releasePreflight",
    "runAudit",
    "generatePptx",
    "generateGammaPresentation",
    "generateGammaAdvanced",
    "generateAIImage",
    "generateDiagram",
    "generateTests",
  ] as const;

  private static readonly LONG_RUNNING_COMMANDS: Record<string, string> = {
    generatePptx: "Alex: Generating PowerPoint...",
    generateGammaPresentation: "Alex: Generating Gamma presentation...",
    generateGammaAdvanced: "Alex: Generating Gamma presentation (advanced)...",
    generateAIImage: "Alex: Generating AI image...",
    generateDiagram: "Alex: Generating diagram...",
    generateTests: "Alex: Generating tests...",
    releasePreflight: "Alex: Running release preflight...",
    runAudit: "Alex: Running audit...",
  };

  private static readonly WELCOME_ACTIVE_TAB_KEY = "alex.welcome.activeTab";

  /**
   * Execute a VS Code command with safe error handling and optional progress.
   */
  private async _executeCommandSafely(commandId: string, label?: string, ...args: any[]): Promise<void> {
    const progressTitle = WelcomeViewProvider.LONG_RUNNING_COMMANDS[label ?? ''];
    const runner = async () => {
      try {
        await vscode.commands.executeCommand(commandId, ...args);
      } catch (err) {
        console.error(`[Alex][WelcomeView] Command failed: ${commandId}`, err);
        vscode.window.showErrorMessage(`Alex: ${label ?? commandId} failed. Check console for details.`);
      }
    };

    if (progressTitle) {
      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: progressTitle },
        runner,
      );
    } else {
      await runner();
    }
  }

  /**
   * Lightweight payload guard to prevent malformed messages from being processed.
   */
  private static _isWelcomeMessage(message: unknown): message is { command: string; [k: string]: unknown } {
    return typeof (message as any)?.command === "string";
  }

  /**
   * Centralized message router so tests can invoke directly.
   */
  public async handleMessageForTest(message: unknown): Promise<void> { // exposed for tests only
    await this._handleMessageInternal(message);
  }

  private async _handleMessageInternal(message: unknown): Promise<void> {
    if (!WelcomeViewProvider._isWelcomeMessage(message)) {
      logInfo("[Alex][WelcomeView] Ignoring malformed message payload");
      return;
    }

    const payload = message; // now typed
    const command = payload.command;

    // Commands that use operation lock - check before executing
    if (WelcomeViewProvider.LOCKED_COMMANDS.includes(command as any) && isOperationInProgress()) {
      vscode.window.showWarningMessage(
        "Another Alex operation is already in progress. Please wait for it to complete.",
      );
      return;
    }

    // Command map for simple vscode.commands.executeCommand calls
    const commandMap: Record<string, string> = {
      dream: "alex.dream",
      selfActualize: "alex.selfActualize",
      northStar: "alex.northStar",
      openDocs: "alex.openDocs",
      agentVsChat: "alex.agentVsChat",
      upgrade: "alex.upgrade",
      showStatus: "alex.showStatus",
      setupEnvironment: "alex.setupEnvironment",
      manageSecrets: "alex.manageSecrets",
      detectEnvSecrets: "alex.detectEnvSecrets",
      viewDiagnostics: "alex.viewBetaTelemetry",
      generateSkillCatalog: "alex.generateSkillCatalog",
      knowledgeQuickPick: "alex.knowledgeQuickPick",
      healthDashboard: "alex.openHealthDashboard",
      memoryDashboard: "alex.openMemoryDashboard",
      runAudit: "alex.runAudit",
      releasePreflight: "alex.releasePreflight",
      debugThis: "alex.debugThis",
      rubberDuck: "alex.rubberDuck",
      codeReview: "alex.codeReview",
      generateTests: "alex.generateTests",
      generateDiagram: "alex.generateDiagram",
      generatePptx: "alex.generatePptx",
      generateGammaPresentation: "alex.generateGammaPresentation",
      generateAIImage: "alex.generateAIImage",
      editImageAI: "alex.editImageWithPrompt",
      reviewPR: "alex.reviewPR",
      askAboutSelection: "alex.askAboutSelection",
      saveSelectionAsInsight: "alex.saveSelectionAsInsight",
      searchRelatedKnowledge: "alex.searchRelatedKnowledge",
      skillReview: "alex.skillReview",
      workingWithAlex: "alex.workingWithAlex",
      cognitiveLevels: "alex.cognitiveLevels",
      quickReference: "alex.cognitiveLevels",
      // meditate handled as special case below to set cognitive state
    };

    // External URL map
    const externalUrlMap: Record<string, string> = {
      openMarketplace: "https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture",
      openGitHub: "https://github.com/fabioc-aloha/Alex_Plug_In",
      openBrainAnatomy: "https://fabioc-aloha.github.io/Alex_Plug_In/alex-brain-anatomy.html",
      provideFeedback: "https://github.com/fabioc-aloha/Alex_Plug_In/issues",
      learnAlex: "https://learnalex.correax.com/",
      learnAlexSelfStudy: "https://learnalex.correax.com/self-study",
      learnAlexExercises: "https://learnalex.correax.com/exercises",
      learnAlexSessionPlan: "https://learnalex.correax.com/session-plan",
      learnAlexSlides: "https://learnalex.correax.com/slides",
      learnAlexDemoScripts: "https://learnalex.correax.com/demo-scripts",
      learnAlexHandout: "https://learnalex.correax.com/handout",
      learnAlexPreRead: "https://learnalex.correax.com/pre-read",
      learnAlexGitHubGuide: "https://learnalex.correax.com/github-guide",
      learnAlexResponsibleAI: "https://learnalex.correax.com/responsible-ai",
      learnAlexAirs: "https://learnalex.correax.com/airs",
      learnAlexQuiz: "https://learnalex.correax.com/quiz",
      learnAlexBooks: "https://learnalex.correax.com/books",
    };

    // Handle simple command execution
    if (commandMap[command]) {
      await this._executeCommandSafely(commandMap[command], command);
      return;
    }

    // Handle external URLs
    if (externalUrlMap[command]) {
      try {
        logInfo(`[Alex][WelcomeView] Opening external link: ${command}`);
        await vscode.env.openExternal(vscode.Uri.parse(externalUrlMap[command]));
      } catch (err) {
        console.error(`[Alex][WelcomeView] Failed to open external: ${command}`, err);
        vscode.window.showErrorMessage(`Alex: Failed to open ${command}.`);
      }
      return;
    }

    // Handle special cases
    switch (command) {
      case "learnAlexWorkshop": {
        const persona = (payload as any).workshop || 'software-developers';
        const url = `https://learnalex.correax.com/workshop/${encodeURIComponent(persona)}`;
        logInfo(`[Alex][WelcomeView] Opening workshop URL for persona: ${persona}`);
        await vscode.env.openExternal(vscode.Uri.parse(url));
        break;
      }
      case "learnAlexGuideSection": {
        const anchor = (payload as any).anchor || '';
        const url = anchor
          ? `https://learnalex.correax.com/workshop/guide#${encodeURIComponent(anchor)}`
          : 'https://learnalex.correax.com/workshop/guide';
        logInfo(`[Alex][WelcomeView] Opening study guide section: ${anchor || 'all'}`);
        await vscode.env.openExternal(vscode.Uri.parse(url));
        break;
      }
      case "openChat":
        logInfo('[Alex] Opening chat panel');
        openChatPanel();
        break;
      case "launchRecommendedSkill": {
        const skill = (payload as any).skill || "code-quality";
        const skillName = (payload as any).skillName || skill;
        logInfo('[Alex] Launching recommended skill: ' + JSON.stringify({ skill, skillName }));
        const prompt = `I'd like help with ${skillName}. Use the ${skill} skill to assist me with this project. Analyze the current workspace and provide actionable recommendations.`;
        await trackRecommendationFeedback(skill, true);
        await openChatPanel(prompt);
        break;
      }
      case "meditate":
        // Set cognitive state to meditation and open chat panel
        logInfo('[Alex] Entering meditation state');
        this.setCognitiveState('meditation');
        // Intentionally not awaited — VS Code focuses chat panel
        void vscode.commands.executeCommand("workbench.panel.chat.view.copilot.focus");
        break;
      case "exportMemory": {
        logInfo('[Alex] Launching memory export');
        const exportPrompt = 'Use the memory-export skill. Export all of my stored memories, user profile, preferences, and context to a single portable file I can paste into another AI surface like Claude Code or ChatGPT. Follow the /export-memory prompt format.';
        await openChatPanel(exportPrompt);
        break;
      }
      case "openSkill": {
        const skillId = (payload as any).skill || "";
        const skillDisplayName = (payload as any).skillName || skillId;
        logInfo('[Alex] Opening skill: ' + JSON.stringify({ skillId, skillDisplayName }));
        const skillPrompt = `Explain how to use the ${skillDisplayName} skill. Read the skill file and summarize what it does, when to use it, and give me examples.`;
        await openChatPanel(skillPrompt);
        break;
      }
      case "reviewFadingSkills": {
        logInfo('[Alex] Opening fading skills review');
        const fadingPrompt = 'Review my fading and dormant skills. Read the Knowledge Freshness data and recommend which skills I should practice or refresh. For each skill, explain why it\'s fading and suggest a quick exercise to reinforce it.';
        await openChatPanel(fadingPrompt);
        break;
      }
      case "reviewLowConfidence": {
        logInfo('[Alex] Opening low-confidence review');
        const confidencePrompt = 'Review my low-confidence and uncertain skills. Read the Honest Uncertainty calibration data and help me understand where I need more practice or knowledge. Suggest specific resources or exercises to improve confidence in these areas.';
        await openChatPanel(confidencePrompt);
        break;
      }
      case "tabSwitch": {
        const tabId = typeof (payload as any).tabId === 'string' ? (payload as any).tabId : '';
        if (!tabId) {
          vscode.window.showWarningMessage('Alex: Invalid tab id');
          return;
        }
        logInfo(`[Alex][TAB SPIKE] Tab switched to: ${tabId}`);
        await this._context?.globalState.update(WelcomeViewProvider.WELCOME_ACTIVE_TAB_KEY, tabId);
        break;
      }
      case "setPersonalityMode": {
        const modeRaw = (payload as any).mode;
        const allowedModes = ['auto', 'precise', 'chatty'] as const;
        const mode = allowedModes.includes(modeRaw) ? modeRaw : 'auto';
        await vscode.workspace.getConfiguration('alex').update('personalityMode', mode, vscode.ConfigurationTarget.Global);
        logInfo(`[Alex] Personality mode set to: ${mode}`);
        break;
      }
      case "toggleSetting": {
        // 7.14: Inline settings toggle
        const settingKey = typeof (payload as any).key === 'string' ? (payload as any).key : '';
        const allowedSettings = [
          'alex.autoInsights.enabled', 'alex.dailyBriefing.enabled', 'alex.voice.enabled',
          'alex.globalKnowledge.enabled',
          'chat.autopilot.enabled', 'github.copilot.chat.copilotMemory.enabled',
          'chat.mcp.gallery.enabled', 'github.copilot.chat.searchSubagent.enabled',
          'chat.requestQueuing.enabled', 'github.copilot.chat.agent.thinkingTool',
          'chat.customAgentInSubagent.enabled',
          'github.copilot.chat.models.anthropic.claude-opus-4-5.extendedThinkingEnabled',
          'chat.tools.autoRun', 'chat.tools.fileSystem.autoApprove',
          'chat.hooks.enabled', 'chat.useCustomAgentHooks', 'chat.restoreLastPanelSession',
        ];
        if (!settingKey) {
          vscode.window.showWarningMessage('Alex: Missing setting key for toggle');
          return;
        }
        if (allowedSettings.includes(settingKey)) {
          const [section, ...rest] = settingKey.split('.');
          const configKey = rest.join('.');
          if (!configKey) {
            vscode.window.showWarningMessage(`Alex: Invalid config key for ${settingKey}`);
            return;
          }
          await vscode.workspace.getConfiguration(section).update(configKey, !!(payload as any).value, vscode.ConfigurationTarget.Global);
          logInfo(`[Alex] Setting ${settingKey} toggled to: ${(payload as any).value}`);
        } else {
          vscode.window.showWarningMessage(`Alex: Unsupported setting ${settingKey}`);
        }
        break;
      }
      case "refresh":
        await this.refresh();
        break;
      default: {
        // Handle openDoc:<NAME> commands — open architecture docs by name
        if (command?.startsWith('openDoc:')) {
          const docName = command.slice('openDoc:'.length);
          const docMap: Record<string, string> = {
            'COGNITIVE-ARCHITECTURE': 'alex_docs/architecture/COGNITIVE-ARCHITECTURE.md',
            'MEMORY-SYSTEMS': 'alex_docs/architecture/MEMORY-SYSTEMS.md',
            'CONSCIOUS-MIND': 'alex_docs/architecture/CONSCIOUS-MIND.md',
            'AGENT-CATALOG': 'alex_docs/architecture/AGENT-CATALOG.md',
            'TRIFECTA-CATALOG': 'alex_docs/architecture/TRIFECTA-CATALOG.md',
            'MASTER-ALEX-PROTECTED': '.github/config/MASTER-ALEX-PROTECTED.json',
            'HEIR-ARCHITECTURE': 'alex_docs/platforms/HEIR-ARCHITECTURE.md',
            'RESEARCH-FIRST': 'alex_docs/architecture/RESEARCH-FIRST-DEVELOPMENT.md',
            'SKILL-DISCIPLINE-MAP': 'alex_docs/guides/SKILL-DISCIPLINE-MAP.md',
          };
          const relPath = docMap[docName];
          if (relPath) {
            const folders = vscode.workspace.workspaceFolders;
            if (folders?.[0]) {
              const docUri = vscode.Uri.joinPath(folders[0].uri, relPath);
              await this._executeCommandSafely('markdown.showPreview', command, docUri);
            }
          } else {
            console.warn(`[Alex] Unknown doc: ${docName}`);
            vscode.window.showWarningMessage(`Alex: Unknown doc ${docName}`);
          }
        }
        break;
      }
    }
  }

  /**
   * Set the current cognitive state and refresh the view.
   * @param state - Cognitive state name (meditation, debugging, etc.) or null to clear
   */
  public setCognitiveState(state: string | null): void {
    this._cognitiveState = state;
    this.refresh();
  }

  /**
   * Get the current cognitive state.
   */
  public getCognitiveState(): string | null {
    return this._cognitiveState;
  }

  /**
   * Set the current agent mode and refresh the view.
   * v5.9.1: Also updates chat avatar to match agent mode.
   * @param agent - Agent name (Researcher, Builder, Validator, etc.) or null to clear
   */
  public setAgentMode(agent: string | null): void {
    this._agentMode = agent;
    this.refresh();
  }

  /**
   * Get the current agent mode.
   */
  public getAgentMode(): string | null {
    return this._agentMode;
  }

  /**
   * Called when the webview is first shown.
   * NASA R5: Critical entry point with assertion density
   */
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    void context; // mark TS unused parameter
    // NASA R5: Validate entry point preconditions
    nasaAssert(webviewView !== undefined, 'resolveWebviewView: webviewView must be defined');
    nasaAssert(this._extensionUri !== undefined, 'resolveWebviewView: extensionUri must be initialized');
    
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = getLoadingHtml();

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      await this._handleMessageInternal(message);
    });

    // Initial content load
    this.refresh();
  }

  /**
   * Infer project display name from README.md, package.json, or workspace folder name
   */
  private async _inferProjectName(workspaceFolder?: vscode.WorkspaceFolder): Promise<string> {
    if (!workspaceFolder) {
      return "Project";
    }

    try {
      // Try README.md first (look for first # heading)
      const readmePath = path.join(workspaceFolder.uri.fsPath, "README.md");
      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, "utf-8");
        const match = content.match(/^#\s+(.+?)$/m);
        if (match && match[1]) {
          // Clean up common patterns
          let title = match[1].trim();
          // Remove badges, emojis at start
          title = title.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, "");
          title = title.replace(/^\[!\[.*?\]\(.*?\)\]\(.*?\)\s*/g, "");
          if (title.length > 0 && title.length < 50) {
            return title;
          }
        }
      }

      // Try package.json (displayName or name field)
      const packagePath = path.join(workspaceFolder.uri.fsPath, "package.json");
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
        if (packageJson.displayName && typeof packageJson.displayName === "string") {
          return packageJson.displayName;
        }
        if (packageJson.name && typeof packageJson.name === "string") {
          // Convert kebab-case or snake_case to Title Case
          const name = packageJson.name
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase());
          return name;
        }
      }
    } catch (err) {
      console.error("[Alex][WelcomeView] Error inferring project name:", err);
    }

    // Fallback to workspace folder name
    return workspaceFolder.name;
  }

  private static readonly VALID_TABS = ['mission', 'skills', 'mind', 'docs'] as const;

  /**
   * Programmatically switch the active tab in the Command Center.
   * Sends a message to the webview client to invoke switchTab().
   * @param tabId - Tab identifier: 'mission' | 'agents' | 'skills' | 'mind' | 'docs'
   */
  public switchToTab(tabId: string): void {
    if (!this._view) {
      return;
    }
    if (!(WelcomeViewProvider.VALID_TABS as readonly string[]).includes(tabId)) {
      console.warn(`[Alex][WelcomeView] Invalid tab ID: ${tabId}`);
      return;
    }
    this._view.webview.postMessage({ command: 'switchToTab', tabId });
  }

  /**
   * Refresh the welcome view content
   * 
   * NASA R5: Critical function with assertion density
   */
  public async refresh(): Promise<void> {
    if (!this._view) {
      return;
    }

    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      const wsRoot = workspaceFolders?.[0]?.uri.fsPath;

      // NASA R5: Validate view state
      nasaAssert(this._view.webview !== undefined, 'Webview must be defined during refresh');

      // Parallelize all async operations for faster loading
      const [
        health,
        lastDreamDate,
        gkRepoPath,
        activeContext,
        userProfile,
        workspaceName,
      ] = await Promise.all([
        checkHealth(false),
        this._getLastDreamDate(),
        detectGlobalKnowledgeRepo(),
        wsRoot ? readActiveContext(wsRoot) : Promise.resolve(null),
        wsRoot ? loadUserProfile(wsRoot) : Promise.resolve(null),
        this._inferProjectName(workspaceFolders?.[0]),
      ]);

      const hasGlobalKnowledge = gkRepoPath !== null;

      // Cache user birthday for avatar age fallback
      this._userBirthday = userProfile?.birthday ?? null;

      // Detect persona synchronously (fast heuristic-based detection)
      const personaResult = workspaceFolders
        ? await detectPersona(userProfile ?? undefined, workspaceFolders)
        : null;

      // Cache persona for avatar updates during state changes
      this._currentPersonaId = personaResult?.persona?.id ?? null;

      // Update chat avatar and save persona if detected
      // v5.9.1: Now uses full context including cognitive state and agent mode
      if (wsRoot) {
        try {
          // Save persona to Active Context if detected
          if (personaResult?.persona) {
            await updatePersona(
              wsRoot,
              personaResult.persona.name,
              personaResult.confidence
            );
            logInfo(`[Alex][WelcomeView] Persona detected and saved: ${personaResult.persona.name} (${Math.round(personaResult.confidence * 100)}%)`);
          }
        } catch (personaErr) {
          console.error("[Alex][WelcomeView] updatePersona failed (non-fatal):", personaErr);
        }
      }

      const extension = vscode.extensions.getExtension(
        "fabioc-aloha.alex-cognitive-architecture",
      );
      const version = extension?.packageJSON?.version || "0.0.0";
      const nudges = this._generateNudges(
        health,
        lastDreamDate,
        workspaceName,
      );

      // Collect tab data — skills first, agents just for count in Mind tab
      const agentCount = this._countAgents(wsRoot);
      const skills = this._collectSkills(wsRoot);
      const personalityMode = vscode.workspace.getConfiguration('alex').get<string>('personalityMode', 'auto');
      const mindData = await this._collectMindData(wsRoot, lastDreamDate, health, agentCount, skills.length);

      // 7.13: Token statuses for Secret Manager inline dashboard
      const tokenStatuses: TokenStatusInfo[] = (() => {
        try {
          const statuses = getTokenStatuses();
          return Object.entries(TOKEN_CONFIGS).map(([name, config]) => ({
            name,
            displayName: config.displayName,
            isSet: !!statuses[name],
          }));
        } catch { return []; }
      })();

      // 7.14: Settings snapshot for inline toggles
      const alexCfg = vscode.workspace.getConfiguration('alex');
      const chatCfg = vscode.workspace.getConfiguration('chat');
      const copilotChatCfg = vscode.workspace.getConfiguration('github.copilot.chat');
      const opusCfg = vscode.workspace.getConfiguration('github.copilot.chat.models.anthropic.claude-opus-4-5');
      const settingsToggles: SettingsToggle[] = [
        // Alex Features
        { key: 'alex.autoInsights.enabled', label: 'Auto Insights', enabled: alexCfg.get<boolean>('autoInsights.enabled', true), group: 'Alex Features' },
        { key: 'alex.dailyBriefing.enabled', label: 'Daily Briefing', enabled: alexCfg.get<boolean>('dailyBriefing.enabled', true), group: 'Alex Features' },
        { key: 'alex.voice.enabled', label: 'Voice Mode', enabled: alexCfg.get<boolean>('voice.enabled', false), group: 'Alex Features' },
        { key: 'alex.globalKnowledge.enabled', label: 'Global Knowledge', enabled: alexCfg.get<boolean>('globalKnowledge.enabled', true), group: 'Alex Features' },
        // Copilot Power Settings
        { key: 'chat.autopilot.enabled', label: 'Autopilot Mode', enabled: chatCfg.get<boolean>('autopilot.enabled', false), group: 'Copilot Power' },
        { key: 'github.copilot.chat.copilotMemory.enabled', label: 'Copilot Memory', enabled: copilotChatCfg.get<boolean>('copilotMemory.enabled', false), group: 'Copilot Power' },
        { key: 'chat.mcp.gallery.enabled', label: 'MCP Gallery', enabled: chatCfg.get<boolean>('mcp.gallery.enabled', false), group: 'Copilot Power' },
        { key: 'github.copilot.chat.searchSubagent.enabled', label: 'Search Subagent', enabled: copilotChatCfg.get<boolean>('searchSubagent.enabled', false), group: 'Copilot Power' },
        { key: 'chat.requestQueuing.enabled', label: 'Request Queuing', enabled: chatCfg.get<boolean>('requestQueuing.enabled', false), group: 'Copilot Power' },
        { key: 'github.copilot.chat.agent.thinkingTool', label: 'Thinking Tool', enabled: copilotChatCfg.get<boolean>('agent.thinkingTool', false), group: 'Copilot Power' },
        { key: 'chat.customAgentInSubagent.enabled', label: 'Agents in Subagents', enabled: chatCfg.get<boolean>('customAgentInSubagent.enabled', false), group: 'Copilot Power' },
        // Agent Capabilities
        { key: 'github.copilot.chat.models.anthropic.claude-opus-4-5.extendedThinkingEnabled', label: 'Extended Thinking', enabled: opusCfg.get<boolean>('extendedThinkingEnabled', false), group: 'Agent Capabilities' },
        { key: 'chat.tools.autoRun', label: 'Auto-Run Tools', enabled: chatCfg.get<boolean>('tools.autoRun', false), group: 'Agent Capabilities' },
        { key: 'chat.tools.fileSystem.autoApprove', label: 'Auto-Approve Files', enabled: chatCfg.get<boolean>('tools.fileSystem.autoApprove', false), group: 'Agent Capabilities' },
        { key: 'chat.hooks.enabled', label: 'Agent Hooks', enabled: chatCfg.get<boolean>('hooks.enabled', false), group: 'Agent Capabilities' },
        { key: 'chat.useCustomAgentHooks', label: 'Agent-Scoped Hooks', enabled: chatCfg.get<boolean>('useCustomAgentHooks', false), group: 'Agent Capabilities' },
        { key: 'chat.restoreLastPanelSession', label: 'Restore Last Session', enabled: chatCfg.get<boolean>('restoreLastPanelSession', false), group: 'Agent Capabilities' },
      ];



      logInfo(`[Alex][WelcomeView] Tab data: agents=${agentCount}, skills=${skills.length}, mindData.skillCount=${mindData.skillCount}, mindData.synapseHealthPct=${mindData.synapseHealthPct}`);

      this._view.webview.html = getWelcomeHtmlContent(
        this._view.webview,
        health,
        version,
        nudges,
        hasGlobalKnowledge,
        personaResult,
        activeContext,
        userProfile,
        this._extensionUri,
        workspaceName,
        mindData,
        skills,
        personalityMode,
        tokenStatuses,
        settingsToggles,
      );

      // Restore last active tab if available
      const lastTab = this._context?.globalState.get<string>(WelcomeViewProvider.WELCOME_ACTIVE_TAB_KEY);
      if (lastTab) {
        this._view.webview.postMessage({ command: 'switchToTab', tabId: lastTab });
      }
    } catch (err) {
      console.error("[Alex][WelcomeView] refresh() FAILED:", err);
      console.error("[Alex][WelcomeView] Error stack:", err instanceof Error ? err.stack : String(err));
      this._view.webview.html = getErrorHtml(err);
    }
  }

  /**
   * Collect Mind tab data from workspace.
   * Accepts pre-collected agent/skill counts to avoid redundant disk reads.
   */
  private async _collectMindData(wsRoot: string | undefined, lastDreamDate: Date | null, health: HealthCheckResult, agentCount: number, skillCount: number): Promise<MindTabData> {
    const data: MindTabData = {
      identityName: 'Alex Finch',
      identityMeta: 'Age 26 \u00b7 Curious \u00b7 Ethical \u00b7 Grows through reflection',
      skillCount,
      instructionCount: 0,
      promptCount: 0,
      agentCount,
      episodicCount: 0,
      synapseHealthPct: health.totalSynapses > 0 ? Math.round(((health.totalSynapses - health.brokenSynapses) / health.totalSynapses) * 100) : 0,
      lastDreamDate: lastDreamDate ? lastDreamDate.toISOString().slice(0, 10) : null,
      lastMeditationDate: null,
      meditationCount: 0,
      freshness: { thriving: 0, active: 0, fading: 0, dormant: 0 },
      calibration: { high: 0, medium: 0, low: 0, uncertain: 0, total: 0 },
    };

    if (!wsRoot) { return data; }

    const githubPath = path.join(wsRoot, '.github');
    try {
      // Only count modalities not already provided
      const instDir = path.join(githubPath, 'instructions');
      if (fs.existsSync(instDir)) {
        data.instructionCount = fs.readdirSync(instDir).filter(f => f.endsWith('.instructions.md')).length;
      }
      const promptDir = path.join(githubPath, 'prompts');
      if (fs.existsSync(promptDir)) {
        data.promptCount = fs.readdirSync(promptDir).filter(f => f.endsWith('.prompt.md')).length;
      }
      const episodicDir = path.join(githubPath, 'episodic');
      if (fs.existsSync(episodicDir)) {
        const episodicFiles = fs.readdirSync(episodicDir).filter(f => f.endsWith('.md'));
        data.episodicCount = episodicFiles.length;
        // Find last meditation date from episodic
        const medFiles = episodicFiles
          .filter(f => f.startsWith('meditation-'))
          .sort().reverse();
        data.meditationCount = medFiles.length;
        if (medFiles.length > 0) {
          const match = medFiles[0].match(/meditation-(\d{4}-\d{2}-\d{2})/);
          if (match) {
            data.lastMeditationDate = match[1];
          }
        }

        // 7.32: Knowledge freshness — bucket episodic files by age
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        for (const f of episodicFiles) {
          const dateMatch = f.match(/(\d{4}-\d{2}-\d{2})/);
          if (dateMatch) {
            const age = (now - new Date(dateMatch[1]).getTime()) / dayMs;
            if (age <= 7) { data.freshness.thriving++; }
            else if (age <= 30) { data.freshness.active++; }
            else if (age <= 90) { data.freshness.fading++; }
            else { data.freshness.dormant++; }
          }
        }
      }

      // 7.33: Honest Uncertainty — get calibration summary
      try {
        const calibSummary = await getCalibrationSummary(wsRoot);
        if (calibSummary) {
          data.calibration.total = calibSummary.totalResponses;
          data.calibration.high = calibSummary.byLevel.high ?? 0;
          data.calibration.medium = calibSummary.byLevel.medium ?? 0;
          data.calibration.low = calibSummary.byLevel.low ?? 0;
          data.calibration.uncertain = calibSummary.byLevel.uncertain ?? 0;
        }
      } catch { /* silent — calibration is optional enhancement */ }
    } catch (err) {
      console.error("[Alex][WelcomeView] _collectMindData failed (non-fatal):", err);
    }
    return data;
  }

  /**
   * Count agents on disk for Mind tab display
   */
  private _countAgents(wsRoot: string | undefined): number {
    if (!wsRoot) { return 0; }
    const agentDir = path.join(wsRoot, '.github', 'agents');
    if (!fs.existsSync(agentDir)) { return 0; }
    try {
      return fs.readdirSync(agentDir).filter(f => f.endsWith('.agent.md')).length;
    } catch {
      return 0;
    }
  }

  /**
   * Collect installed skill summaries
   */
  private _collectSkills(wsRoot: string | undefined): SkillInfo[] {
    const skills: SkillInfo[] = [];
    if (!wsRoot) { return skills; }

    const skillsDir = path.join(wsRoot, '.github', 'skills');
    if (!fs.existsSync(skillsDir)) { return skills; }

    try {
      const dirs = fs.readdirSync(skillsDir).filter(d => {
        const fullPath = path.join(skillsDir, d);
        return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'SKILL.md'));
      });

      for (const dir of dirs) {
        const synapsePath = path.join(skillsDir, dir, 'synapses.json');
        let description = '';
        let category = 'general';

        // Read description from synapses.json if available
        if (fs.existsSync(synapsePath)) {
          try {
            const synapses = JSON.parse(fs.readFileSync(synapsePath, 'utf8'));
            description = synapses.description || '';
            category = synapses.category || 'general';
          } catch { /* skip */ }
        }

        skills.push({
          id: dir,
          displayName: dir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          description,
          category,
          hasSynapses: fs.existsSync(synapsePath),
        });
      }
    } catch (err) {
      console.error("[Alex][WelcomeView] _collectSkills failed (non-fatal):", err);
    }
    return skills.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  /**
   * Get the last dream report date from episodic folder
   */
  private async _getLastDreamDate(): Promise<Date | null> {
    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        return null;
      }

      const episodicPath = path.join(
        workspaceFolders[0].uri.fsPath,
        ".github",
        "episodic",
      );
      if (!fs.existsSync(episodicPath)) {
        return null;
      }

      const files = fs
        .readdirSync(episodicPath)
        .filter((f) => f.startsWith("dream-report-") && f.endsWith(".md"))
        .sort()
        .reverse();

      if (files.length === 0) {
        return null;
      }

      // Parse timestamp from filename: dream-report-1738456789123.md
      const match = files[0].match(/dream-report-(\d+)\.md/);
      if (match) {
        return new Date(parseInt(match[1], 10));
      }
    } catch {
      // Silent fail - not critical
    }
    return null;
  }

  /**
   * Generate contextual nudges based on current state
   * Returns max 3 nudges (mission + up to 2 contextual)
   */
  private _generateNudges(
    health: HealthCheckResult,
    lastDreamDate: Date | null,
    workspaceName?: string,
  ): Nudge[] {
    const nudges: Nudge[] = [];
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    if (workspaceName) {
      nudges.push({ type: "tip", icon: "🗂️", message: `Workspace: ${workspaceName}`, priority: 5 });
    }

    // Check health issues (high priority)
    if (health.status !== HealthStatus.Healthy && health.brokenSynapses > 3) {
      nudges.push({
        type: "health",
        icon: "⚠️",
        message: `${health.brokenSynapses} broken synapses need repair`,
        action: "dream",
        actionLabel: "Run Dream",
        priority: 2,
      });
    }

    // Check last dream date (medium priority)
    if (lastDreamDate) {
      const daysSinceDream = Math.floor(
        (now.getTime() - lastDreamDate.getTime()) / dayMs,
      );
      if (daysSinceDream >= 7) {
        nudges.push({
          type: "dream",
          icon: "💭",
          message: `Haven't dreamed in ${daysSinceDream} days. Neural maintenance recommended.`,
          action: "dream",
          actionLabel: "Dream",
          priority: 4,
        });
      }
    } else {
      // Never dreamed in this workspace
      nudges.push({
        type: "dream",
        icon: "💭",
        message: "Run Dream to validate your cognitive architecture.",
        action: "dream",
        actionLabel: "Dream",
        priority: 6,
      });
    }

    // Sort by priority and return top 3 (mission + up to 2 contextual)
    return nudges.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }
}

/**
 * Register the welcome view provider
 */
export function registerWelcomeView(
  context: vscode.ExtensionContext,
): WelcomeViewProvider {
  const provider = new WelcomeViewProvider(context.extensionUri, context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      WelcomeViewProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      },
    ),
  );

  // Register refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.refreshWelcomeView", () => {
      provider.refresh();
    }),
  );

  // Register tab switch command - allows other commands to navigate to a specific tab
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.switchToTab", async (tabId: string) => {
      // Focus the welcome view first, then switch to the requested tab
      await vscode.commands.executeCommand('alex.welcomeView.focus');
      provider.switchToTab(tabId);
    }),
  );

  // Register cognitive state command - allows chat/prompts to change avatar
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.setCognitiveState", (state: string | null) => {
      provider.setCognitiveState(state);
      if (state) {
        logInfo(`[Alex] Cognitive state set to: ${state}`);
      } else {
        logInfo('[Alex] Cognitive state cleared');
      }
    }),
  );

  // Register agent mode command - allows switching to agent-specific avatars
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.setAgentMode", (agent: string | null) => {
      provider.setAgentMode(agent);
      if (agent) {
        logInfo(`[Alex] Agent mode set to: ${agent}`);
      } else {
        logInfo('[Alex] Agent mode cleared');
      }
    }),
  );

  return provider;
}
