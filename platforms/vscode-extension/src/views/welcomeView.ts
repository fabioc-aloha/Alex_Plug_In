import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { logInfo } from "../shared/logger";
import {
  checkHealth,
} from "../shared/healthCheck";
import { detectGlobalKnowledgeRepo } from "../chat/globalKnowledge";
import { detectPersona, loadUserProfile } from "../chat/personaDetection";
import {
  readActiveContext,
  updatePersona,
} from "../shared/activeContextManager";
import { openChatPanel } from "../shared/utils";
import { isOperationInProgress } from "../shared/operationLock";
import { trackRecommendationFeedback } from "../chat/skillRecommendations";
import { nasaAssert } from "../shared/nasaAssert";
import {
  getLoadingHtml,
  getErrorHtml,
  getWelcomeHtmlContent,
} from "./welcomeViewHtml";
import {
  collectMindData,
  countAgents,
  collectSkills,
  getLastDreamDate,
  generateNudges,
  collectTokenStatuses,
  collectSettingsToggles,
} from "./welcomeViewData";

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
    "generateAIImage",
    "generateDiagram",
    "generateTests",
  ] as const;

  private static readonly LONG_RUNNING_COMMANDS: Record<string, string> = {
    generatePptx: "Alex: Generating PowerPoint...",
    generateGammaPresentation: "Alex: Generating Gamma presentation...",
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
  private async _executeCommandSafely(
    commandId: string,
    label?: string,
    ...args: any[]
  ): Promise<void> {
    const progressTitle =
      WelcomeViewProvider.LONG_RUNNING_COMMANDS[label ?? ""];
    const runner = async () => {
      try {
        await vscode.commands.executeCommand(commandId, ...args);
      } catch (err) {
        console.error(`[Alex][WelcomeView] Command failed: ${commandId}`, err);
        vscode.window.showErrorMessage(
          `Alex: ${label ?? commandId} failed. Check console for details.`,
        );
      }
    };

    if (progressTitle) {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: progressTitle,
        },
        runner,
      );
    } else {
      await runner();
    }
  }

  /**
   * Lightweight payload guard to prevent malformed messages from being processed.
   */
  private static _isWelcomeMessage(
    message: unknown,
  ): message is { command: string; [k: string]: unknown } {
    return typeof (message as any)?.command === "string";
  }

  /**
   * Centralized message router so tests can invoke directly.
   */
  public async handleMessageForTest(message: unknown): Promise<void> {
    // exposed for tests only
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
    if (
      WelcomeViewProvider.LOCKED_COMMANDS.includes(command as any) &&
      isOperationInProgress()
    ) {
      vscode.window.showWarningMessage(
        "Another Alex operation is already in progress. Please wait for it to complete.",
      );
      return;
    }

    // Command map for simple vscode.commands.executeCommand calls
    // Only includes commands triggered by data-cmd attributes in the sidebar HTML
    const commandMap: Record<string, string> = {
      northStar: "alex.northStar",
      upgrade: "alex.upgrade",
      setupEnvironment: "alex.setupEnvironment",
      optimizeSettings: "alex.optimizeSettings",
      setupMcpServers: "alex.setupMcpServers",
      manageSecrets: "alex.manageSecrets",
      detectEnvSecrets: "alex.detectEnvSecrets",
      exportSecretsToEnv: "alex.exportSecretsToEnv",
      generateDiagram: "alex.generateDiagram",
      generatePptx: "alex.generatePptx",
      generateGammaPresentation: "alex.generateGammaPresentation",
      generateAIImage: "alex.generateAIImage",
      editImageAI: "alex.editImageWithPrompt",
      saveSelectionAsInsight: "alex.saveSelectionAsInsight",
      skillReview: "alex.skillReview",
      workingWithAlex: "alex.workingWithAlex",
      quickReference: "alex.cognitiveLevels",
      // meditate handled as special case below to set cognitive state
    };

    // External URL map — only includes URLs triggered by data-cmd in sidebar HTML
    const externalUrlMap: Record<string, string> = {
      openBrainAnatomy:
        "https://fabioc-aloha.github.io/Alex_Plug_In/alex-brain-anatomy.html",
      learnAlex: "https://learnai.correax.com/",
      learnAlexResponsibleAI: "https://learnai.correax.com/responsible-ai",
      learnAlexPromptEngineering:
        "https://learnai.correax.com/prompt-engineering",
      learnAlexAiReadiness: "https://learnai.correax.com/ai-readiness",
      learnAlexAiAdoption: "https://learnai.correax.com/ai-adoption",
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
        await vscode.env.openExternal(
          vscode.Uri.parse(externalUrlMap[command]),
        );
      } catch (err) {
        console.error(
          `[Alex][WelcomeView] Failed to open external: ${command}`,
          err,
        );
        vscode.window.showErrorMessage(`Alex: Failed to open ${command}.`);
      }
      return;
    }

    // Handle special cases
    switch (command) {
      case "learnAlexWorkshop": {
        const persona = (payload as any).workshop || "software-developers";
        const url = `https://learnai.correax.com/workshop/${encodeURIComponent(persona)}`;
        logInfo(
          `[Alex][WelcomeView] Opening workshop URL for persona: ${persona}`,
        );
        await vscode.env.openExternal(vscode.Uri.parse(url));
        break;
      }
      case "learnAlexGuideSection": {
        const anchor = (payload as any).anchor || "";
        const url = anchor
          ? `https://learnai.correax.com/workshop/guide#${encodeURIComponent(anchor)}`
          : "https://learnai.correax.com/workshop/guide";
        logInfo(
          `[Alex][WelcomeView] Opening playbook section: ${anchor || "all"}`,
        );
        await vscode.env.openExternal(vscode.Uri.parse(url));
        break;
      }
      case "heirBootstrap": {
        // Offer environment settings before bootstrap chat
        await vscode.commands.executeCommand("alex.setupEnvironment");
        const bootstrapPrompt =
          "I want to bootstrap this project. Walk me through the heir bootstrap wizard to tailor your architecture to this codebase: scan the project, verify build/test commands, mine existing AI configs, generate project-specific instructions, and set up security hooks. Check .github/.heir-bootstrap-state.json first; if it exists, resume from where we left off.";
        await openChatPanel(bootstrapPrompt);
        break;
      }
      case "openChat":
        logInfo("[Alex] Opening chat panel");
        openChatPanel();
        break;
      case "launchRecommendedSkill": {
        const skill = (payload as any).skill || "code-quality";
        const skillName = (payload as any).skillName || skill;
        logInfo(
          "[Alex] Launching recommended skill: " +
            JSON.stringify({ skill, skillName }),
        );
        const prompt = `I'd like help with ${skillName}. Use the ${skill} skill to assist me with this project. Analyze the current workspace and provide actionable recommendations.`;
        await trackRecommendationFeedback(skill, true);
        await openChatPanel(prompt);
        break;
      }
      case "meditate":
        // Set cognitive state to meditation and open chat panel
        logInfo("[Alex] Entering meditation state");
        this.setCognitiveState("meditation");
        // Intentionally not awaited — VS Code focuses chat panel
        void vscode.commands.executeCommand(
          "workbench.panel.chat.view.copilot.focus",
        );
        break;
      case "exportMemory": {
        logInfo("[Alex] Launching memory export");
        const exportPrompt =
          "Use the memory-export skill. Export all of my stored memories, user profile, preferences, and context to a single portable file I can paste into another AI surface like Claude Code or ChatGPT. Follow the /export-memory prompt format.";
        await openChatPanel(exportPrompt);
        break;
      }
      case "missionProfile": {
        const profile =
          typeof (payload as any).profile === "string"
            ? (payload as any).profile
            : "";
        const profileMap: Record<string, string> = {
          release:
            "Activate release mission profile. Use heightened quality gates, run Validator on all changes, and suppress speculation.",
          research:
            "Activate research mission profile. Go breadth-first, cite sources, time-box exploration, and compare 2+ approaches before recommending.",
          debug:
            "Activate debug mission profile. Generate 3+ hypotheses, use binary search isolation, and avoid shotgun debugging.",
          review:
            "Activate review mission profile. Be adversarial, score confidence on findings, and detect pattern deviations.",
          draft:
            "Activate draft mission profile. Skip Validator, accept TODOs, and move fast. Quality gates relaxed for rapid iteration.",
        };
        const missionPrompt = profileMap[profile];
        if (missionPrompt) {
          logInfo(`[Alex] Activating mission profile: ${profile}`);
          await openChatPanel(missionPrompt);
        }
        break;
      }
      case "memoryAudit": {
        logInfo("[Alex] Launching memory audit");
        const auditPrompt =
          "Run a memory audit using the /memory-audit prompt. Check my /memories/ files for scope violations, waste, token budget, and suggest improvements.";
        await openChatPanel(auditPrompt);
        break;
      }
      case "openChatMemories": {
        logInfo("[Alex] Opening Chat Memories settings");
        await vscode.commands.executeCommand(
          "workbench.action.openSettings",
          "github.copilot.chat.copilotMemory",
        );
        break;
      }
      case "openChatMemoryFile": {
        const ourStorage = this._context?.globalStorageUri?.fsPath;
        if (ourStorage) {
          const memDir = path.join(
            path.dirname(ourStorage),
            "github.copilot-chat",
            "memory-tool",
            "memories",
          );
          if (fs.existsSync(memDir)) {
            const mdFiles = fs
              .readdirSync(memDir)
              .filter((f) => f.endsWith(".md"));
            if (mdFiles.length > 0) {
              const filePath = path.join(memDir, mdFiles[0]);
              logInfo(`[Alex] Opening Chat Memory file: ${filePath}`);
              await vscode.commands.executeCommand(
                "vscode.open",
                vscode.Uri.file(filePath),
              );
            }
          }
        }
        break;
      }
      case "openSkill": {
        const skillId = (payload as any).skill || "";
        const skillDisplayName = (payload as any).skillName || skillId;
        logInfo(
          "[Alex] Opening skill: " +
            JSON.stringify({ skillId, skillDisplayName }),
        );
        const skillPrompt = `Explain how to use the ${skillDisplayName} skill. Read the skill file and summarize what it does, when to use it, and give me examples.`;
        await openChatPanel(skillPrompt);
        break;
      }

      case "tabSwitch": {
        const tabId =
          typeof (payload as any).tabId === "string"
            ? (payload as any).tabId
            : "";
        if (!tabId) {
          vscode.window.showWarningMessage("Alex: Invalid tab id");
          return;
        }
        logInfo(`[Alex][TAB SPIKE] Tab switched to: ${tabId}`);
        await this._context?.globalState.update(
          WelcomeViewProvider.WELCOME_ACTIVE_TAB_KEY,
          tabId,
        );
        break;
      }

      case "toggleSetting": {
        // 7.14: Inline settings toggle
        const settingKey =
          typeof (payload as any).key === "string" ? (payload as any).key : "";
        const allowedSettings = [
          "chat.autopilot.enabled",
          "github.copilot.chat.copilotMemory.enabled",
          "chat.mcp.gallery.enabled",
          "github.copilot.chat.searchSubagent.enabled",
          "chat.customAgentInSubagent.enabled",
          "github.copilot.chat.models.anthropic.claude-opus-4-5.extendedThinkingEnabled",
          "chat.useCustomAgentHooks",
          "chat.restoreLastPanelSession",
        ];
        if (!settingKey) {
          vscode.window.showWarningMessage(
            "Alex: Missing setting key for toggle",
          );
          return;
        }
        if (allowedSettings.includes(settingKey)) {
          try {
            await vscode.workspace
              .getConfiguration()
              .update(
                settingKey,
                !!(payload as any).value,
                vscode.ConfigurationTarget.Global,
              );
            logInfo(
              `[Alex] Setting ${settingKey} toggled to: ${(payload as any).value}`,
            );
          } catch (err) {
            console.error(
              `[Alex][WelcomeView] Failed to update setting ${settingKey}:`,
              err,
            );
            vscode.window.showErrorMessage(
              `Alex: Failed to save ${settingKey}. Check Output for details.`,
            );
          }
        } else {
          vscode.window.showWarningMessage(
            `Alex: Unsupported setting ${settingKey}`,
          );
        }
        break;
      }
      case "refresh":
        await this.refresh();
        break;
      case "openCopilotInstructions": {
        const wsRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (wsRoot) {
          const instructionsPath = path.join(
            wsRoot,
            ".github",
            "copilot-instructions.md",
          );
          const doc = await vscode.workspace.openTextDocument(instructionsPath);
          await vscode.window.showTextDocument(doc);
        }
        break;
      }
      default: {
        // Handle openDoc:<NAME> commands — open architecture docs by name
        if (command?.startsWith("openDoc:")) {
          const docName = command.slice("openDoc:".length);
          const docMap: Record<string, string> = {
            "COGNITIVE-ARCHITECTURE":
              "alex_docs/architecture/COGNITIVE-ARCHITECTURE.md",
            "MEMORY-SYSTEMS": "alex_docs/architecture/MEMORY-SYSTEMS.md",
            "CONSCIOUS-MIND": "alex_docs/architecture/CONSCIOUS-MIND.md",
            "AGENT-CATALOG": ".github/AGENT-CATALOG.md",
            "TRIFECTA-CATALOG": ".github/TRIFECTA-CATALOG.md",
            "MASTER-ALEX-PROTECTED":
              ".github/config/MASTER-ALEX-PROTECTED.json",
            "HEIR-ARCHITECTURE":
              "alex_docs/platforms/MASTER-HEIR-ARCHITECTURE.md",
            "RESEARCH-FIRST":
              "alex_docs/architecture/RESEARCH-FIRST-DEVELOPMENT.md",
            "SKILL-DISCIPLINE-MAP": "alex_docs/guides/SKILL-DISCIPLINE-MAP.md",
          };
          const relPath = docMap[docName];
          if (relPath) {
            const folders = vscode.workspace.workspaceFolders;
            if (folders?.[0]) {
              const docUri = vscode.Uri.joinPath(folders[0].uri, relPath);
              await this._executeCommandSafely(
                "markdown.showPreview",
                command,
                docUri,
              );
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
    nasaAssert(
      webviewView !== undefined,
      "resolveWebviewView: webviewView must be defined",
    );
    nasaAssert(
      this._extensionUri !== undefined,
      "resolveWebviewView: extensionUri must be initialized",
    );

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
  private async _inferProjectName(
    workspaceFolder?: vscode.WorkspaceFolder,
  ): Promise<string> {
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
        if (
          packageJson.displayName &&
          typeof packageJson.displayName === "string"
        ) {
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

  private static readonly VALID_TABS = ["mission", "settings", "docs"] as const;

  /**
   * Programmatically switch the active tab in the Command Center.
   * Sends a message to the webview client to invoke switchTab().
   * @param tabId - Tab identifier: 'mission' | 'agents' | 'skills' | 'mind' | 'docs'
   */
  public switchToTab(tabId: string): void {
    if (!this._view) {
      return;
    }
    if (
      !(WelcomeViewProvider.VALID_TABS as readonly string[]).includes(tabId)
    ) {
      console.warn(`[Alex][WelcomeView] Invalid tab ID: ${tabId}`);
      return;
    }
    this._view.webview.postMessage({ command: "switchToTab", tabId });
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
      nasaAssert(
        this._view.webview !== undefined,
        "Webview must be defined during refresh",
      );

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
        getLastDreamDate(),
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
              personaResult.confidence,
            );
            logInfo(
              `[Alex][WelcomeView] Persona detected and saved: ${personaResult.persona.name} (${Math.round(personaResult.confidence * 100)}%)`,
            );
          }
        } catch (personaErr) {
          console.error(
            "[Alex][WelcomeView] updatePersona failed (non-fatal):",
            personaErr,
          );
        }
      }

      const extension = vscode.extensions.getExtension(
        "fabioc-aloha.alex-cognitive-architecture",
      );
      const version = extension?.packageJSON?.version || "0.0.0";
      const nudges = generateNudges(health, lastDreamDate, workspaceName);

      // Collect tab data — skills first, agents just for count in Mind tab
      const agentCount = countAgents(wsRoot);
      const skills = collectSkills(wsRoot);
      const personalityMode = vscode.workspace
        .getConfiguration("alex")
        .get<string>("personalityMode", "auto");
      const mindData = await collectMindData(
        wsRoot,
        lastDreamDate,
        health,
        agentCount,
        skills.length,
        this._context?.globalStorageUri?.fsPath,
      );

      // 7.13: Token statuses for Secret Manager inline dashboard
      const tokenStatuses = collectTokenStatuses();

      // 7.14: Settings snapshot for inline toggles
      const settingsToggles = collectSettingsToggles();

      logInfo(
        `[Alex][WelcomeView] Tab data: agents=${agentCount}, skills=${skills.length}, mindData.skillCount=${mindData.skillCount}, mindData.synapseHealthPct=${mindData.synapseHealthPct}`,
      );

      // Determine if Bootstrap button should be shown:
      // Initialized + not Master Alex + bootstrap state file either absent (never started)
      // or present with lastCompletedPhase < 9 (interrupted, resumable)
      let showBootstrap = false;
      let isBootstrapResume = false;
      let isMaster = false;
      if (health.initialized && wsRoot) {
        const masterProtectedPath = path.join(
          wsRoot,
          ".github",
          "config",
          "MASTER-ALEX-PROTECTED.json",
        );
        const bootstrapStatePath = path.join(
          wsRoot,
          ".github",
          ".heir-bootstrap-state.json",
        );
        isMaster = fs.existsSync(masterProtectedPath);
        if (!isMaster) {
          if (fs.existsSync(bootstrapStatePath)) {
            // State file exists: check if bootstrap is in progress (not completed)
            try {
              const stateData = JSON.parse(
                fs.readFileSync(bootstrapStatePath, "utf-8"),
              );
              if (
                typeof stateData.lastCompletedPhase === "number" &&
                stateData.lastCompletedPhase < 9
              ) {
                showBootstrap = true;
                isBootstrapResume = true;
              }
              // Phase 9 complete = state file should have been deleted,
              // but if it exists with phase 9 done, bootstrap is finished
            } catch {
              // Corrupt state file: show bootstrap to let user restart
              showBootstrap = true;
            }
          } else {
            // No state file: never bootstrapped, show the button
            showBootstrap = true;
          }
        }
      }

      // Read last active tab BEFORE building HTML so it renders correctly on first paint
      const lastTab =
        this._context?.globalState.get<string>(
          WelcomeViewProvider.WELCOME_ACTIVE_TAB_KEY,
        ) ?? "mission";

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
        showBootstrap,
        isBootstrapResume,
        lastTab,
        isMaster,
      );
    } catch (err) {
      console.error("[Alex][WelcomeView] refresh() FAILED:", err);
      console.error(
        "[Alex][WelcomeView] Error stack:",
        err instanceof Error ? err.stack : String(err),
      );
      this._view.webview.html = getErrorHtml(err);
    }
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
    vscode.commands.registerCommand(
      "alex.switchToTab",
      async (tabId: string) => {
        // Focus the welcome view first, then switch to the requested tab
        await vscode.commands.executeCommand("alex.welcomeView.focus");
        provider.switchToTab(tabId);
      },
    ),
  );

  // Register cognitive state command - allows chat/prompts to change avatar
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alex.setCognitiveState",
      (state: string | null) => {
        provider.setCognitiveState(state);
        if (state) {
          logInfo(`[Alex] Cognitive state set to: ${state}`);
        } else {
          logInfo("[Alex] Cognitive state cleared");
        }
      },
    ),
  );

  // Register agent mode command - allows switching to agent-specific avatars
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alex.setAgentMode",
      (agent: string | null) => {
        provider.setAgentMode(agent);
        if (agent) {
          logInfo(`[Alex] Agent mode set to: ${agent}`);
        } else {
          logInfo("[Alex] Agent mode cleared");
        }
      },
    ),
  );

  return provider;
}
