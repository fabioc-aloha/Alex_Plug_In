import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import {
  checkHealth,
  HealthCheckResult,
  HealthStatus,
} from "../shared/healthCheck";
import { detectGlobalKnowledgeRepo } from "../chat/globalKnowledge";
import {
  detectPersona,
  loadUserProfile,
  PersonaDetectionResult,
} from "../chat/personaDetection";
import {
  readActiveContext,
  updatePersona,
} from "../shared/activeContextManager";
// Knowledge summary moved to Health Dashboard - see globalKnowledge.ts
import { getCurrentSession, Session } from "../commands/session";
import { getGoalsSummary, LearningGoal } from "../commands/goals";
import { openChatPanel } from "../shared/utils";
import { isOperationInProgress } from "../shared/operationLock";
import { updateChatAvatar, ChatAvatarContext } from "../shared/chatAvatarBridge";
import { getSkillRecommendations, SkillRecommendation, trackRecommendationFeedback } from "../chat/skillRecommendations";
import { nasaAssert, nasaAssertBounded } from "../shared/nasaAssert";
import {
  Nudge,
  MindTabData,
  AgentInfo,
  SkillInfo,
  getLoadingHtml,
  getErrorHtml,
  getWelcomeHtmlContent,
} from "./welcomeViewHtml";

export class WelcomeViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "alex.welcomeView";

  private _view?: vscode.WebviewView;
  private _extensionUri: vscode.Uri;
  private _cognitiveState: string | null = null;
  private _agentMode: string | null = null;
  private _currentPersonaId: string | null = null;
  private _userBirthday: string | null = null;

  constructor(extensionUri: vscode.Uri) {
    this._extensionUri = extensionUri;
  }

  /**
   * Build context for chat avatar updates.
   * Combines current state with cached persona/profile info.
   */
  private _buildAvatarContext(): ChatAvatarContext {
    return {
      agentMode: this._agentMode,
      cognitiveState: this._cognitiveState,
      personaId: this._currentPersonaId,
      birthday: this._userBirthday,
    };
  }

  /**
   * Set the current cognitive state and refresh the view.
   * v5.9.1: Also updates chat avatar to match cognitive state.
   * @param state - Cognitive state name (meditation, debugging, etc.) or null to clear
   */
  public setCognitiveState(state: string | null): void {
    this._cognitiveState = state;
    updateChatAvatar(this._buildAvatarContext());
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
    updateChatAvatar(this._buildAvatarContext());
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
      // Commands that use operation lock - check before executing
      const lockedCommands = ["dream", "setupEnvironment"];

      if (lockedCommands.includes(message.command) && isOperationInProgress()) {
        vscode.window.showWarningMessage(
          "Another Alex operation is already in progress. Please wait for it to complete.",
        );
        return;
      }

      // Command map for simple vscode.commands.executeCommand calls
      const commandMap: Record<string, string> = {
        startSession: "alex.startSession",
        sessionActions: "alex.sessionActions",
        dream: "alex.dream",
        selfActualize: "alex.selfActualize",
        northStar: "alex.northStar",
        exportM365: "alex.exportForM365",
        openDocs: "alex.openDocs",
        agentVsChat: "alex.agentVsChat",
        upgrade: "alex.upgrade",
        showStatus: "alex.showStatus",
        showGoals: "alex.showGoals",
        createGoal: "alex.createGoal",
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
        generateGammaAdvanced: "alex.generateGammaWithOptions",
        generateAIImage: "alex.generateAIImage",
        editImageAI: "alex.editImageWithPrompt",
        importGitHubIssues: "alex.importGitHubIssues",
        reviewPR: "alex.reviewPR",
        readAloud: "alex.readAloud",
        askAboutSelection: "alex.askAboutSelection",
        saveSelectionAsInsight: "alex.saveSelectionAsInsight",
        searchRelatedKnowledge: "alex.searchRelatedKnowledge",
        skillReview: "alex.skillReview",
        workingWithAlex: "alex.workingWithAlex",
        cognitiveLevels: "alex.cognitiveLevels",
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
      };

      // Handle simple command execution
      if (commandMap[message.command]) {
        vscode.commands.executeCommand(commandMap[message.command]);
        return;
      }

      // Handle external URLs
      if (externalUrlMap[message.command]) {
        vscode.env.openExternal(vscode.Uri.parse(externalUrlMap[message.command]));
        return;
      }

      // Handle special cases
      switch (message.command) {
        case "learnAlexWorkshop": {
          const persona = message.workshop || 'software-developers';
          const url = `https://learnalex.correax.com/workshop/${encodeURIComponent(persona)}`;
          vscode.env.openExternal(vscode.Uri.parse(url));
          break;
        }
        case "openChat":
          console.log('[Alex] Opening chat panel');
          openChatPanel();
          break;
        case "launchRecommendedSkill": {
          const skill = message.skill || "code-quality";
          const skillName = message.skillName || skill;
          console.log('[Alex] Launching recommended skill:', { skill, skillName });
          const prompt = `I'd like help with ${skillName}. Use the ${skill} skill to assist me with this project. Analyze the current workspace and provide actionable recommendations.`;
          await trackRecommendationFeedback(skill, true);
          await openChatPanel(prompt);
          break;
        }
        case "meditate":
          // Set cognitive state to meditation and open chat panel
          console.log('[Alex] Entering meditation state');
          this.setCognitiveState('meditation');
          vscode.commands.executeCommand("workbench.panel.chat.view.copilot.focus");
          break;
        case "openSkill": {
          const skillId = message.skill || "";
          const skillDisplayName = message.skillName || skillId;
          console.log('[Alex] Opening skill:', { skillId, skillDisplayName });
          const skillPrompt = `I'd like to use the ${skillDisplayName} skill. Read the skill and help me with it.`;
          await openChatPanel(skillPrompt);
          break;
        }
        case "tabSwitch":
          // Spike 1B: Track active tab (no-op beyond logging for now)
          console.log(`[Alex][TAB SPIKE] Tab switched to: ${message.tabId}`);
          break;
        case "refresh":
          this.refresh();
          break;
      }
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
        goalsSummary,
        lastDreamDate,
        gkRepoPath,
        activeContext,
        userProfile,
        workspaceName,
      ] = await Promise.all([
        checkHealth(false),
        getGoalsSummary(),
        this._getLastDreamDate(),
        detectGlobalKnowledgeRepo(),
        wsRoot ? readActiveContext(wsRoot) : Promise.resolve(null),
        wsRoot ? loadUserProfile(wsRoot) : Promise.resolve(null),
        this._inferProjectName(workspaceFolders?.[0]),
      ]);

      // Get skill recommendations based on context (after persona detection)
      let skillRecommendations: SkillRecommendation[] = [];

      const session = getCurrentSession();
      const hasGlobalKnowledge = gkRepoPath !== null;

      // Cache user birthday for avatar age fallback
      this._userBirthday = userProfile?.birthday ?? null;

      // Detect persona synchronously (fast heuristic-based detection)
      const personaResult = workspaceFolders
        ? await detectPersona(userProfile ?? undefined, workspaceFolders)
        : null;

      // Cache persona for avatar updates during state changes
      this._currentPersonaId = personaResult?.persona?.id ?? null;

      // Get skill recommendations based on persona and active file
      try {
        const activeEditor = vscode.window.activeTextEditor;
        const activeFilePath = activeEditor?.document.uri.fsPath;
        skillRecommendations = await getSkillRecommendations(
          wsRoot,
          activeFilePath,
          personaResult?.persona?.id
        );
      } catch (err) {
        console.error("[Alex][WelcomeView] Failed to get skill recommendations:", err);
      }

      // Update chat avatar and save persona if detected
      // v5.9.1: Now uses full context including cognitive state and agent mode
      if (wsRoot) {
        try {
          updateChatAvatar(this._buildAvatarContext());
          // Save persona to Active Context if detected
          if (personaResult?.persona) {
            await updatePersona(
              wsRoot,
              personaResult.persona.name,
              personaResult.confidence
            );
            console.log(`[Alex][WelcomeView] Persona detected and saved: ${personaResult.persona.name} (${Math.round(personaResult.confidence * 100)}%)`);
          }
        } catch (avatarErr) {
          console.error("[Alex][WelcomeView] updateChatAvatar/updatePersona failed (non-fatal):", avatarErr);
        }
      }

      const extension = vscode.extensions.getExtension(
        "fabioc-aloha.alex-cognitive-architecture",
      );
      const version = extension?.packageJSON?.version || "0.0.0";
      const nudges = this._generateNudges(
        health,
        goalsSummary,
        lastDreamDate,
        session,
        workspaceName,
      );

      // Collect tab data — agents/skills first so Mind can reuse counts
      const agents = this._collectAgents(wsRoot);
      const skills = this._collectSkills(wsRoot);
      const mindData = await this._collectMindData(wsRoot, lastDreamDate, health, agents.length, skills.length);

      console.log(`[Alex][WelcomeView] Tab data: agents=${agents.length}, skills=${skills.length}, mindData.skillCount=${mindData.skillCount}, mindData.synapseHealthPct=${mindData.synapseHealthPct}`);

      this._view.webview.html = getWelcomeHtmlContent(
        this._view.webview,
        health,
        session,
        goalsSummary,
        version,
        nudges,
        hasGlobalKnowledge,
        personaResult,
        activeContext,
        userProfile,
        this._extensionUri,
        this._agentMode,
        this._cognitiveState,
        workspaceName,
        skillRecommendations,
        mindData,
        agents,
        skills,
      );
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
      skillCount,
      instructionCount: 0,
      promptCount: 0,
      agentCount,
      episodicCount: 0,
      synapseHealthPct: health.totalSynapses > 0 ? Math.round(((health.totalSynapses - health.brokenSynapses) / health.totalSynapses) * 100) : 0,
      lastDreamDate: lastDreamDate ? lastDreamDate.toISOString().slice(0, 10) : null,
      lastMeditationDate: null,
      cognitiveAge: 26,
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
        if (medFiles.length > 0) {
          const match = medFiles[0].match(/meditation-(\d{4}-\d{2}-\d{2})/);
          if (match) {
            data.lastMeditationDate = match[1];
          }
        }
      }
    } catch (err) {
      console.error("[Alex][WelcomeView] _collectMindData failed (non-fatal):", err);
    }
    return data;
  }

  /**
   * Collect agent registry info from disk
   */
  private _collectAgents(wsRoot: string | undefined): AgentInfo[] {
    const agents: AgentInfo[] = [
      { id: 'alex', name: 'Alex', icon: '🧠', description: 'Orchestrator — routes to specialists', role: 'orchestrator', installed: false },
      { id: 'researcher', name: 'Researcher', icon: '🔬', description: 'Deep domain research and knowledge discovery', role: 'specialist', installed: false },
      { id: 'builder', name: 'Builder', icon: '🔨', description: 'Constructive implementation with optimistic problem-solving', role: 'specialist', installed: false },
      { id: 'validator', name: 'Validator', icon: '🛡️', description: 'Adversarial quality assurance with skeptical analysis', role: 'specialist', installed: false },
      { id: 'documentarian', name: 'Documentarian', icon: '📝', description: 'Documentation accuracy and drift prevention', role: 'specialist', installed: false },
      { id: 'azure', name: 'Azure', icon: '☁️', description: 'Azure development guidance with MCP tools', role: 'specialist', installed: false },
      { id: 'm365', name: 'M365', icon: '📊', description: 'Microsoft 365 and Teams development', role: 'specialist', installed: false },
    ];

    // Check which agents exist on disk
    if (wsRoot) {
      const agentDir = path.join(wsRoot, '.github', 'agents');
      if (fs.existsSync(agentDir)) {
        const diskAgents = new Set(fs.readdirSync(agentDir).filter(f => f.endsWith('.agent.md')).map(f => f.replace('alex-', '').replace('.agent.md', '')));
        // Also check for the main alex.agent.md
        if (fs.existsSync(path.join(agentDir, 'alex.agent.md'))) {
          diskAgents.add('alex');
        }
        for (const agent of agents) {
          agent.installed = diskAgents.has(agent.id);
        }
      }
    }
    return agents;
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
    goals: {
      activeGoals: LearningGoal[];
      streakDays: number;
      completedToday: number;
    },
    lastDreamDate: Date | null,
    session: Session | null,
    workspaceName?: string,
  ): Nudge[] {
    const nudges: Nudge[] = [];
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    // Mission statement removed — duplicates rocket bar which now shows project name
    // The rocket bar "Take Your {PROJECT} to New Heights" serves this purpose

    // Note: Focus session is already shown in the timer card, so no nudge needed here

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

    // Check streak at risk (medium-high priority)
    if (goals.streakDays > 0 && goals.completedToday === 0) {
      nudges.push({
        type: "streak",
        icon: "🔥",
        message: `${goals.streakDays}-day streak at risk! Complete a goal today.`,
        action: "showGoals",
        actionLabel: "View Goals",
        priority: 3,
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
  const provider = new WelcomeViewProvider(context.extensionUri);

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

  // Register cognitive state command - allows chat/prompts to change avatar
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.setCognitiveState", (state: string | null) => {
      provider.setCognitiveState(state);
      if (state) {
        console.log(`[Alex] Cognitive state set to: ${state}`);
      } else {
        console.log('[Alex] Cognitive state cleared');
      }
    }),
  );

  // Register agent mode command - allows switching to agent-specific avatars
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.setAgentMode", (agent: string | null) => {
      provider.setAgentMode(agent);
      if (agent) {
        console.log(`[Alex] Agent mode set to: ${agent}`);
      } else {
        console.log('[Alex] Agent mode cleared');
      }
    }),
  );

  return provider;
}
