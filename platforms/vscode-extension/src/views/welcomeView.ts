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
  Persona,
  PersonaDetectionResult,
  getAvatarForPersona,
  DEFAULT_AVATAR,
  getEasterEggOverride,
  EasterEgg,
} from "../chat/personaDetection";
import {
  readActiveContext,
  ActiveContext,
} from "../shared/activeContextManager";
// Knowledge summary moved to Health Dashboard - see globalKnowledge.ts
import { getCurrentSession, Session } from "../commands/session";
import { getGoalsSummary, LearningGoal } from "../commands/goals";
import { escapeHtml, getNonce } from "../shared/sanitize";
import { openChatPanel } from "../shared/utils";
import {
  detectPremiumFeatures,
  getPremiumAssets,
  getAssetUri,
  PremiumAssetSelection,
} from "../services/premiumAssets";
import { isOperationInProgress } from "../shared/operationLock";
import { updateChatAvatar } from "../shared/chatAvatarBridge";
import { getSkillRecommendations, SkillRecommendation, trackRecommendationFeedback } from "../chat/skillRecommendations";

/**
 * Nudge types for contextual reminders
 */
interface Nudge {
  type: "dream" | "streak" | "health" | "tip" | "focus" | "mission";
  icon: string;
  message: string;
  action?: string;
  actionLabel?: string;
  priority: number; // Lower = higher priority
}

/**
 * Welcome View Provider - Activity Bar panel with health, quick actions, and recent activity
 */
export class WelcomeViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "alex.welcomeView";

  private _view?: vscode.WebviewView;
  private _extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this._extensionUri = extensionUri;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getLoadingHtml();

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
        exportM365: "alex.exportForM365",
        openDocs: "alex.openDocs",
        agentVsChat: "alex.agentVsChat",
        upgrade: "alex.upgrade",
        showStatus: "alex.showStatus",
        showGoals: "alex.showGoals",
        createGoal: "alex.createGoal",
        setupEnvironment: "alex.setupEnvironment",
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
        importGitHubIssues: "alex.importGitHubIssues",
        reviewPR: "alex.reviewPR",
        readAloud: "alex.readAloud",
        askAboutSelection: "alex.askAboutSelection",
        saveSelectionAsInsight: "alex.saveSelectionAsInsight",
        searchRelatedKnowledge: "alex.searchRelatedKnowledge",
        skillReview: "alex.skillReview",
        workingWithAlex: "alex.workingWithAlex",
        meditate: "workbench.panel.chat.view.copilot.focus", // Could auto-type @alex /meditate
      };

      // External URL map
      const externalUrlMap: Record<string, string> = {
        openMarketplace: "https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture",
        openGitHub: "https://github.com/fabioc-aloha/Alex_Plug_In",
        openBrainAnatomy: "https://fabioc-aloha.github.io/Alex_Plug_In/alex-brain-anatomy.html",
        provideFeedback: "https://github.com/fabioc-aloha/Alex_Plug_In/issues",
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
   */
  public async refresh(): Promise<void> {
    if (!this._view) {
      return;
    }

    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      const wsRoot = workspaceFolders?.[0]?.uri.fsPath;

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

      // Detect persona synchronously (fast heuristic-based detection)
      const personaResult = workspaceFolders
        ? await detectPersona(userProfile ?? undefined, workspaceFolders)
        : null;

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

      // Update chat avatar if persona detected
      if (personaResult?.persona) {
        try {
          updateChatAvatar(personaResult.persona.id);
        } catch (avatarErr) {
          console.error("[Alex][WelcomeView] updateChatAvatar failed (non-fatal):", avatarErr);
        }
      }

      const premiumFlags = await detectPremiumFeatures(gkRepoPath);
      const bannerNoun = personaResult?.persona?.bannerNoun ?? "CODE";
      const premiumAssets = getPremiumAssets(premiumFlags, true, bannerNoun);

      const extension = vscode.extensions.getExtension(
        "fabioc-aloha.alex-cognitive-architecture",
      );
      const version = extension?.packageJSON?.version || "0.0.0";
      const nudges = this._generateNudges(
        health,
        goalsSummary,
        lastDreamDate,
        session,
        premiumAssets,
        workspaceName,
      );

      this._view.webview.html = this._getHtmlContent(
        this._view.webview,
        health,
        session,
        goalsSummary,
        version,
        nudges,
        hasGlobalKnowledge,
        personaResult,
        premiumAssets,
        activeContext,
        workspaceName,
        skillRecommendations,
      );
    } catch (err) {
      console.error("[Alex][WelcomeView] refresh() FAILED:", err);
      console.error("[Alex][WelcomeView] Error stack:", err instanceof Error ? err.stack : String(err));
      this._view.webview.html = this._getErrorHtml(err);
    }
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
    premiumAssets?: PremiumAssetSelection,
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

  private _getLoadingHtml(): string {
    const nonce = getNonce();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
    <title>Alex</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-sideBar-background);
            padding: 12px;
            margin: 0;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="loading">Loading...</div>
</body>
</html>`;
  }

  private _getErrorHtml(err: unknown): string {
    const errorMessage = escapeHtml(String(err));
    const nonce = getNonce();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <title>Alex</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-sideBar-background);
            padding: 12px;
            margin: 0;
        }
        .error {
            color: var(--vscode-errorForeground);
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="error">
        <p>Failed to load Alex status</p>
        <p style="font-size: 18px; opacity: 0.7;">${errorMessage}</p>
        <button data-cmd="refresh">Retry</button>
    </div>
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        function cmd(command, data) {
            vscode.postMessage({ command, ...data });
        }
        document.addEventListener('click', function(e) {
            const el = e.target.closest('[data-cmd]');
            if (el) {
                e.preventDefault();
                const command = el.getAttribute('data-cmd');
                const skill = el.getAttribute('data-skill');
                const skillName = el.getAttribute('data-skill-name');
                if (skill) {
                    cmd(command, { skill, skillName });
                } else {
                    cmd(command);
                }
            }
        });
    </script>
</body>
</html>`;
  }

  private _getHtmlContent(
    webview: vscode.Webview,
    health: HealthCheckResult,
    session: ReturnType<typeof getCurrentSession>,
    goals: {
      activeGoals: LearningGoal[];
      completedToday: number;
      streakDays: number;
      totalCompleted: number;
    },
    version: string,
    nudges: Nudge[],
    hasGlobalKnowledge: boolean,
    personaResult: PersonaDetectionResult | null,
    premiumAssets: PremiumAssetSelection,
    activeContext: ActiveContext | null,
    workspaceName?: string,
    skillRecommendations?: SkillRecommendation[],
  ): string {
    // Security: Generate nonce for CSP
    const nonce = getNonce();

    // Logo URI for webview - use premium asset if available
    const logoUri = getAssetUri(
      webview,
      this._extensionUri,
      premiumAssets.logoPath,
    );

    // Persona display
    const persona = personaResult?.persona;

    // Avatar URIs — WebP primary, PNG fallback (both shipped in VSIX)
    // Easter egg check: seasonal or project-name overrides take priority
    const workspaceFolderName = vscode.workspace.workspaceFolders?.[0]?.name;
    const easterEgg: EasterEgg | null =
      getEasterEggOverride(workspaceFolderName);
    const personaAvatarBase = easterEgg
      ? easterEgg.avatarBase
      : persona
        ? getAvatarForPersona(persona.id)
        : DEFAULT_AVATAR;
    const avatarWebpUri = getAssetUri(
      webview,
      this._extensionUri,
      `avatars/${personaAvatarBase}.webp`,
    );
    const avatarPngUri = getAssetUri(
      webview,
      this._extensionUri,
      `avatars/${personaAvatarBase}.png`,
    );
    const easterEggBadge = easterEgg
      ? `<span class="easter-egg-badge" title="${easterEgg.label}">${easterEgg.emoji}</span>`
      : "";
    const personaHook = persona?.hook || "Take Your Code to New Heights";
    const personaIcon = persona?.icon || "💻";
    const personaName = persona?.name || "Developer";
    const personaSkill = persona?.skill || "code-review";
    const bannerNoun = persona?.bannerNoun || "CODE";

    // Use easter egg accent color if present, fallback to persona color, then blue
    const personaAccent = easterEgg?.accentColor || persona?.accentColor || "var(--vscode-charts-blue)";

    // Active Context — live state from copilot-instructions.md
    const confidenceLabel =
      personaResult?.confidence != null
        ? `${Math.round(personaResult.confidence * 100)}%`
        : "";
    const sourceLabel =
      personaResult?.source === "llm"
        ? "LLM"
        : personaResult?.source === "cached"
          ? "Cached"
          : "Auto";

    // Focus Trifectas from Active Context (live only — no auto-population from persona)
    const rawTrifectas = activeContext?.focusTrifectas;
    const hasLiveTrifectas =
      rawTrifectas &&
      !rawTrifectas.includes("*(") &&
      rawTrifectas.trim().length > 0;
    const trifectaIds = hasLiveTrifectas
      ? rawTrifectas!
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : []; // Empty when no live trifectas (user hasn't started working yet)

    // Skill name mapping for display (must be declared before trifectaTagsHtml which references it)
    const skillNameMap: Record<string, string> = {
      "code-quality": "Code Quality",
      "code-review": "Code Review",
      "research-project-scaffold": "Research Setup",
      "api-documentation": "API Docs",
      "architecture-health": "Architecture",
      "microsoft-fabric": "Data Fabric",
      "infrastructure-as-code": "IaC",
      "creative-writing": "Creative Writing",
      "project-management": "PM Dashboard",
      "incident-response": "Security",
      "learning-psychology": "Learning",
      "gamma-presentations": "Presentations",
      "git-workflow": "Git Workflows",
      "game-design": "Game Design",
      "slide-design": "Slide Design",
      "scope-management": "Scope Mgmt",
      "deep-thinking": "Deep Thinking",
      "markdown-mermaid": "Diagrams",
      "testing-strategies": "Testing",
      "bootstrap-learning": "Learning",
      "master-heir-management": "Heir Mgmt",
      "brand-asset-management": "Brand Assets",
      "release-management": "Releases",
      "release-process": "Releases",
      "self-actualization": "Self-Actualize",
      "research-first-development": "Research First",
      meditation: "Meditation",
      "dream-state": "Dream State",
      "brain-qa": "Brain QA",
      "heir-curation": "Heir Curation",
    };

    const trifectaTagsHtml = trifectaIds.length > 0
      ? trifectaIds.map((id) => {
        const name =
          skillNameMap[id] ||
          id
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        return `<span class="trifecta-tag" data-cmd="launchRecommendedSkill" data-skill="${id}" data-skill-name="${name}" title="Launch ${name}">${name}</span>`;
      })
      .join("\n                ")
      : `<span class="trifecta-placeholder" style="opacity: 0.6; font-style: italic;">Focus trifectas will appear here when you start working</span>`;

    // Objective from Active Context (hidden when session card is showing)
    const rawObjective = activeContext?.objective;
    const hasObjective =
      rawObjective && !rawObjective.includes("*(session-objective") && !session;

    // Last Assessed from Active Context
    const rawAssessed = activeContext?.lastAssessed || "never";
    const isNeverAssessed =
      rawAssessed === "never" || rawAssessed.includes("never");
    const assessedLabel = isNeverAssessed
      ? "Not assessed"
      : rawAssessed.split(" — ")[0];

    // Principles from Active Context
    const principlesText =
      activeContext?.principles || "KISS, DRY, Optimize-for-AI";

    const recommendedSkillName = skillNameMap[personaSkill] || personaSkill;

    // Skill recommendations HTML
    const skillRecommendationsHtml = skillRecommendations && skillRecommendations.length > 0
      ? `<div class="skill-recommendations-section">
                <div class="skill-recommendations-list">
                    ${skillRecommendations.map(rec => 
                        `<button class="skill-recommendation-btn" data-cmd="launchRecommendedSkill" data-skill="${rec.skillId}" data-skill-name="${rec.displayName}" title="${rec.reason}">
                            <span class="skill-rec-name">${rec.displayName}</span>
                            <span class="skill-rec-reason">${rec.reason}</span>
                        </button>`
                    ).join('\n                    ')}
                </div>
            </div>`
      : "";

    // Health indicator
    const isHealthy = health.status === HealthStatus.Healthy;
    const healthText = isHealthy
      ? "Healthy"
      : `${health.brokenSynapses} issues`;

    // Streak days for status display
    const streakDays = goals.streakDays;

    // Session status
    const sessionHtml = session
      ? `
            <div class="session-card">
                <div class="session-header">
                    <span class="session-icon">${session.isBreak ? "☕" : "🎯"}</span>
                    <span class="session-title">${this._escapeHtml(session.topic)}</span>
                </div>
                <div class="session-timer">${this._formatTime(session.remaining)}</div>
                <div class="session-footer">
                    <span class="session-status">${session.isPaused ? "⏸️ Paused" : "▶️ Active"}${session.pomodoroCount > 0 ? ` • 🍅×${session.pomodoroCount}` : ""}</span>
                    <a href="#" class="session-actions-link" data-cmd="sessionActions">Actions</a>
                </div>
            </div>
        `
      : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https: data:;">
    <title>Alex</title>
    <style>
        * {
            box-sizing: border-box;
            --persona-accent: ${personaAccent};
            /* Design System - Spacing Scale (8px base) */
            --spacing-xs: 4px;
            --spacing-sm: 8px;
            --spacing-md: 16px;
            --spacing-lg: 24px;
            --spacing-xl: 32px;
            /* Typography Scale (1.18x for better readability) */
            --font-xs: 13px;
            --font-sm: 14px;
            --font-md: 16px;
            --font-lg: 18px;
            /* Elevation/Shadows */
            --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
            --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.12);
            --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-sideBar-background);
            padding: 0;
            margin: 0;
        }
        /* Focus indicators for accessibility */
        button:focus-visible,
        [tabindex]:focus-visible,
        a:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 2px;
        }
        .container {
            padding: 4px 6px;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        .header-icon {
            width: 48px;
            height: 48px;
            flex-shrink: 0;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.12));
            cursor: pointer;
            transition: transform 0.15s ease;
        }
        .header-icon:hover {
            transform: scale(1.08);
        }
        .persona-avatar-box {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 12px;
            position: relative;
            width: 100%;
        }
        .alex-avatar {
            width: 100%;
            height: auto;
            border-radius: 8px;
            object-fit: cover;
            border: 1px solid var(--persona-accent, var(--vscode-charts-blue));
            filter: drop-shadow(0 2px 6px rgba(0,0,0,0.2));
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .alex-avatar:hover {
            transform: scale(1.02);
        }
        .easter-egg-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            font-size: 39px;
            line-height: 1;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
            animation: egg-bounce 2s ease-in-out infinite;
            pointer-events: none;
        }
        @keyframes egg-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
        }
        .header-title {
            font-size: var(--font-md);
            font-weight: 600;
            letter-spacing: -0.2px;
        }
        .header-persona {
            font-size: var(--font-xs);
            color: var(--vscode-foreground);
            background: color-mix(in srgb, var(--persona-accent) 15%, transparent);
            border: 1px solid color-mix(in srgb, var(--persona-accent) 30%, transparent);
            padding: 3px 8px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .header-persona:hover {
            background: color-mix(in srgb, var(--persona-accent) 25%, transparent);
        }
        .header-text {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
            flex: 1;
        }
        .project-name {
            text-align: center;
            font-size: var(--font-md);
            font-weight: 500;
            color: var(--vscode-descriptionForeground);
            margin: 8px 0;
            padding: 6px 12px;
            background: var(--vscode-input-background);
            border-radius: 4px;
            border: 1px solid var(--vscode-input-border, transparent);
        }
        .rocket-bar {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-xs) var(--spacing-sm);
            margin-bottom: 10px;
            border-radius: 6px;
            font-size: var(--font-xs);
            letter-spacing: 0.3px;
            color: var(--vscode-foreground);
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--persona-accent) 10%, transparent),
                color-mix(in srgb, var(--persona-accent) 5%, transparent));
            border: 1px solid color-mix(in srgb, var(--persona-accent) 20%, transparent);
            cursor: pointer;
            transition: background 0.15s ease;
        }
        .rocket-bar:hover {
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--persona-accent) 18%, transparent),
                color-mix(in srgb, var(--persona-accent) 10%, transparent));
        }
        .rocket-bar .rocket-emoji {
            font-size: var(--font-sm);
            flex-shrink: 0;
        }
        .rocket-bar strong {
            color: var(--persona-accent);
            font-weight: 600;
        }
        .premium-badge {
            background: var(--vscode-badge-background, #4d4d4d);
            color: var(--vscode-badge-foreground, #ccc);
            font-size: var(--font-xs);
            font-weight: 500;
            padding: 1px 5px;
            border-radius: 6px;
            letter-spacing: 0.2px;
            margin-left: 4px;
            opacity: 0.6;
        }
        .refresh-btn {
            margin-left: auto;
            background: none;
            border: none;
            color: var(--vscode-foreground);
            cursor: pointer;
            opacity: 0.5;
            font-size: 17px;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.15s ease;
        }
        .refresh-btn:hover {
            opacity: 1;
            background: var(--vscode-toolbar-hoverBackground);
        }
        
        .section {
            margin-bottom: 16px;
        }
        .section-title {
            font-size: var(--font-xs);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: var(--spacing-sm);
            opacity: 0.85;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
        }
        .status-item {
            background: var(--vscode-editor-background);
            border-radius: 5px;
            padding: var(--spacing-sm) 10px;
            border-left: 2px solid transparent;
            transition: all 0.12s ease;
            box-shadow: var(--shadow-sm);
        }
        .status-item:hover {
            border-left-color: var(--vscode-focusBorder);
            background: var(--vscode-list-hoverBackground);
        }
        .status-item.status-good {
            border-left-color: var(--vscode-charts-green);
        }
        .status-item.status-warn {
            border-left-color: var(--vscode-charts-yellow);
        }
        .status-label {
            font-size: var(--font-xs);
            color: var(--vscode-descriptionForeground);
            margin-bottom: 2px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .status-value {
            font-size: var(--font-sm);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
            box-shadow: 0 0 3px currentColor;
            position: relative;
        }
        /* Accessibility: Icon labels for color-blind users */
        .status-dot::after {
            position: absolute;
            font-size: 12px;
            line-height: 12px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .dot-green { background: var(--vscode-charts-green); color: var(--vscode-charts-green); }
        .dot-green::after { content: '✓'; color: white; }
        .dot-yellow { background: var(--vscode-charts-yellow); color: var(--vscode-charts-yellow); }
        .dot-yellow::after { content: '⚠'; color: black; font-weight: bold; }
        .dot-red { background: var(--vscode-charts-red); color: var(--vscode-charts-red); }
        .dot-red::after { content: '✗'; color: white; }
        .status-num {
            font-weight: 600;
            font-size: 22px;
            color: var(--vscode-foreground);
            line-height: 1;
        }
        .status-unit {
            font-size: 16px;
            color: var(--vscode-descriptionForeground);
            font-weight: normal;
        }
        .status-completed {
            font-size: var(--font-xs);
            color: var(--vscode-charts-green);
            font-weight: 500;
        }
        .context-card {
            background: var(--vscode-editor-background);
            border-radius: 5px;
            padding: 10px;
            border-left: 2px solid var(--persona-accent);
            box-shadow: var(--shadow-sm);
        }
        .context-objective {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
            padding: 4px 8px;
            background: color-mix(in srgb, var(--persona-accent) 8%, transparent);
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.12s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .context-objective:hover {
            background: color-mix(in srgb, var(--persona-accent) 15%, transparent);
        }
        .context-objective::before {
            content: '🎯';
            font-size: 15px;
        }
        .trifecta-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }
        .trifecta-tag {
            font-size: var(--font-xs);
            padding: 2px var(--spacing-sm);
            border-radius: 10px;
            background: color-mix(in srgb, var(--persona-accent) 12%, var(--vscode-badge-background));
            color: var(--vscode-foreground);
            cursor: pointer;
            transition: all 0.12s ease;
            border: 1px solid color-mix(in srgb, var(--persona-accent) 25%, transparent);
        }
        .trifecta-tag:hover {
            background: color-mix(in srgb, var(--persona-accent) 25%, var(--vscode-badge-background));
            transform: translateY(-1px);
        }
        .context-meta {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 6px;
            margin-top: 8px;
        }
        .context-badge {
            font-size: var(--font-xs);
            padding: 1px 6px;
            border-radius: 8px;
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            opacity: 0.8;
        }
        .context-badge.accent {
            background: color-mix(in srgb, var(--persona-accent) 20%, transparent);
            color: var(--vscode-foreground);
            font-weight: 500;
        }
        .context-badge.stale {
            background: color-mix(in srgb, var(--vscode-charts-yellow) 25%, transparent);
            color: var(--vscode-foreground);
            cursor: pointer;
        }
        .context-badge[data-cmd] {
            cursor: pointer;
            transition: opacity 0.12s ease;
        }
        .context-badge[data-cmd]:hover {
            opacity: 1;
        }
        
        .session-card {
            background: var(--vscode-editor-background);
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
            border-left: 2px solid var(--vscode-charts-blue);
            box-shadow: var(--shadow-sm);
        }
        .session-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 3px;
        }
        .session-icon {
            font-size: 17px;
        }
        .session-title {
            font-size: 16px;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .session-timer {
            font-size: 22px;
            font-weight: 600;
            font-family: monospace;
            color: var(--vscode-charts-blue);
        }
        .session-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 3px;
        }
        .session-status {
            font-size: var(--font-xs);
            color: var(--vscode-descriptionForeground);
        }
        .session-actions-link {
            font-size: var(--font-xs);
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
            cursor: pointer;
        }
        .session-actions-link:hover {
            text-decoration: underline;
        }
        
        .action-list {
            display: flex;
            flex-direction: column;
            gap: 1px;
        }
        .action-group-label {
            font-size: var(--font-xs);
            font-weight: 500;
            color: var(--vscode-descriptionForeground);
            margin-top: 6px;
            margin-bottom: 2px;
            padding-left: 2px;
            opacity: 0.7;
            letter-spacing: 0.3px;
            text-transform: uppercase;
        }
        .action-group-label:first-child {
            margin-top: 0;
        }
        .action-btn {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-sm) 10px;
            min-height: 44px; /* WCAG touch target */
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: var(--font-xs);
            text-align: left;
            transition: all 0.1s ease;
            box-shadow: var(--shadow-sm);
        }
        .action-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
            transform: translateX(1px);
        }
        .action-btn.primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
        }
        .action-btn.primary:hover {
            background: var(--vscode-button-hoverBackground);
            transform: translateX(1px);
        }
        .action-icon {
            font-size: var(--font-sm);
            width: 27px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            opacity: 0.9;
        }
        .action-icon svg {
            width: 17px;
            height: 17px;
        }
        .action-text {
            flex: 1;
        }
        .action-btn .premium-badge {
            font-size: var(--font-xs);
            margin-left: auto;
            opacity: 0.5;
        }
        .action-btn.premium {
            border-left: 2px solid var(--vscode-charts-yellow);
            opacity: 0.95;
        }
        .action-btn.premium:hover .premium-badge {
            opacity: 0.8;
        }
        .action-btn.recommended {
            border-left: 2px solid var(--persona-accent);
            background: color-mix(in srgb, var(--persona-accent) 8%, var(--vscode-button-secondaryBackground));
        }
        .action-btn.recommended:hover {
            background: color-mix(in srgb, var(--persona-accent) 15%, var(--vscode-button-secondaryHoverBackground));
        }
        .recommended-badge {
            font-size: var(--font-xs);
            margin-left: auto;
            opacity: 0.6;
            color: var(--persona-accent);
        }
        
        /* Skill Recommendations Styles */
        .skill-recommendations-section {
            margin: 12px 0;
            padding: 10px;
            background: var(--vscode-editor-background);
            border-radius: 6px;
            border: 1px solid var(--vscode-widget-border);
        }
        .section-subtitle {
            font-size: var(--font-xs);
            font-weight: 600;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .skill-recommendations-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .skill-recommendation-btn {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: var(--spacing-sm) 10px;
            min-height: 44px; /* WCAG touch target */
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            border-left: 2px solid var(--vscode-charts-blue);
            border-radius: 4px;
            cursor: pointer;
            text-align: left;
            transition: all 0.15s ease;
            box-shadow: var(--shadow-sm);
        }
        .skill-recommendation-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
            border-left-color: var(--persona-accent);
            transform: translateX(2px);
        }
        .skill-rec-name {
            font-size: var(--font-xs);
            font-weight: 500;
            margin-bottom: 2px;
        }
        .skill-rec-reason {
            font-size: var(--font-xs);
            opacity: 0.7;
            font-style: italic;
        }
        
        .goals-stats {
            display: flex;
            gap: 12px;
            font-size: var(--font-xs);
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
            opacity: 0.85;
        }
        .goal-item {
            background: var(--vscode-editor-background);
            border-radius: 5px;
            padding: 8px 10px;
            margin-bottom: 5px;
            transition: transform 0.1s ease;
        }
        .goal-item:hover {
            transform: translateX(1px);
        }
        .goal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }
        .goal-title {
            font-size: var(--font-xs);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
        }
        .goal-progress-text {
            font-size: var(--font-xs);
            color: var(--vscode-descriptionForeground);
            margin-left: 8px;
            opacity: 0.8;
        }
        .goal-bar {
            height: 3px;
            background: var(--vscode-progressBar-background);
            border-radius: 2px;
            overflow: hidden;
        }
        .goal-bar-fill {
            height: 100%;
            background: var(--persona-accent);
            border-radius: 2px;
            transition: width 0.3s ease;
        }
        
        /* Nudges Section Styles */
        .nudges-section {
            margin-bottom: 16px;
        }
        .nudge-card {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            background: var(--vscode-editor-background);
            border-radius: 5px;
            margin-bottom: 5px;
            border-left: 2px solid var(--vscode-charts-yellow);
            transition: all 0.1s ease;
        }
        .nudge-card:hover {
            transform: translateX(1px);
            background: var(--vscode-list-hoverBackground);
        }
        .nudge-card.nudge-health {
            border-left-color: var(--vscode-charts-red);
        }
        .nudge-card.nudge-streak {
            border-left-color: var(--vscode-charts-orange, #f0883e);
        }
        .nudge-card.nudge-mission {
            border-left-color: var(--vscode-charts-purple, #a371f7);
            background: linear-gradient(90deg, var(--vscode-editor-background), rgba(163, 113, 247, 0.08));
        }
        .nudge-icon {
            font-size: 17px;
            flex-shrink: 0;
            opacity: 0.9;
        }
        .nudge-content {
            flex: 1;
            min-width: 0;
        }
        .nudge-message {
            font-size: var(--font-xs);
            line-height: 1.3;
        }
        .nudge-action {
            font-size: var(--font-xs);
            color: var(--vscode-textLink-foreground);
            background: none;
            border: none;
            cursor: pointer;
            padding: 3px 6px;
            border-radius: 3px;
            transition: background 0.1s ease;
            white-space: nowrap;
        }
        .nudge-action:hover {
            background: var(--vscode-toolbar-hoverBackground);
        }
        
        /* Features Section Styles */
        .features-section details {
            margin: 0;
        }
        .features-section summary {
            cursor: pointer;
            list-style: none;
            user-select: none;
            padding: 3px 0;
            border-radius: 3px;
            transition: color 0.1s ease;
        }
        .features-section summary:hover {
            color: var(--vscode-textLink-foreground);
        }
        .features-section summary::-webkit-details-marker {
            display: none;
        }
        .features-section summary::before {
            content: '▸ ';
            font-size: 15px;
            margin-right: 4px;
            transition: transform 0.12s ease;
            display: inline-block;
            opacity: 0.7;
        }
        .features-section details[open] summary::before {
            content: '▾ ';
        }
        .section-title.clickable {
            cursor: pointer;
        }
        .section-title.clickable:hover {
            color: var(--vscode-textLink-foreground);
        }
        .features-content {
            margin-top: 10px;
            padding: 0 2px;
        }
        .feature-category {
            margin-bottom: 10px;
        }
        .feature-category-title {
            font-size: var(--font-xs);
            font-weight: 600;
            color: var(--vscode-foreground);
            margin-bottom: 4px;
        }
        .feature-list {
            margin: 0;
            padding-left: 17px;
            font-size: var(--font-xs);
            line-height: 1.5;
            color: var(--vscode-descriptionForeground);
        }
        .feature-list li {
            margin-bottom: 3px;
        }
        .feature-list strong {
            color: var(--vscode-foreground);
            font-weight: 500;
        }
        .feature-links {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid var(--vscode-widget-border);
        }
        .feature-link-btn {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            border-radius: 4px;
            padding: var(--spacing-sm);
            min-height: 44px; /* WCAG touch target */
            font-size: var(--font-xs);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            transition: all 0.1s ease;
        }
        .feature-link-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${logoUri}" alt="Alex v${version}" class="header-icon" data-cmd="workingWithAlex" title="Alex Cognitive v${version} — Click to learn how to work with Alex" tabindex="0" role="button" />
            <div class="header-text">
                <span class="header-title">Alex Cognitive</span>
                <span class="header-persona" data-cmd="skillReview" title="${personaName} — Click to explore skills" tabindex="0" role="button">${personaIcon} ${personaName}</span>
            </div>
            <button class="refresh-btn" data-cmd="refresh" title="Refresh" aria-label="Refresh welcome view">↻</button>
        </div>

        <div class="persona-avatar-box" data-cmd="skillReview" title="Alex as ${personaName} — Click to explore skills" tabindex="0" role="button">
            <img src="${avatarPngUri}" alt="Alex ${personaName}" class="alex-avatar" />
            ${easterEggBadge}
        </div>

        ${workspaceName ? `<div class="project-name" title="Current workspace">${this._escapeHtml(workspaceName)}</div>` : ""}

        <div class="rocket-bar" data-cmd="workingWithAlex" title="Take Your ${bannerNoun} to New Heights — Click to learn more" tabindex="0" role="button">
            <span class="rocket-emoji">🚀</span>
            <span>Take Your <strong>${bannerNoun}</strong> to New Heights</span>
        </div>
        
        ${sessionHtml}
        
        ${this._getNudgesHtml(nudges)}
        
        <div class="section">
            <div class="section-title clickable" data-cmd="healthDashboard" title="Click to open Health Dashboard" tabindex="0" role="button">Status</div>
            <div class="status-grid" data-cmd="healthDashboard" style="cursor: pointer;" title="Click to open Health Dashboard" tabindex="0" role="region" aria-label="Architecture health status">
                <div class="status-item ${isHealthy ? "status-good" : "status-warn"}">
                    <div class="status-label">Health</div>
                    <div class="status-value"><span class="status-dot ${isHealthy ? "dot-green" : health.brokenSynapses > 5 ? "dot-red" : "dot-yellow"}" aria-label="${isHealthy ? "Healthy" : health.brokenSynapses > 5 ? "Critical" : "Warning"}"></span>${healthText}</div>
                </div>
                <div class="status-item ${streakDays > 0 ? "status-good" : ""}">
                    <div class="status-label">Streak</div>
                    <div class="status-value"><span class="status-dot ${streakDays > 0 ? "dot-green" : "dot-yellow"}" aria-label="${streakDays > 0 ? "Active streak" : "No streak"}"></span>${streakDays > 0 ? streakDays + " days" : "Start today!"}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Active Context</div>
            <div class="context-card">
                ${hasObjective ? `<div class="context-objective" data-cmd="sessionActions" title="Session objective" tabindex="0" role="button">${this._escapeHtml(rawObjective!)}</div>` : ""}
                <div class="trifecta-tags">
                    ${trifectaTagsHtml}
                </div>
                <div class="context-meta">
                    ${confidenceLabel ? `<span class="context-badge accent">${personaIcon} ${confidenceLabel} ${sourceLabel}</span>` : ""}
                    <span class="context-badge ${isNeverAssessed ? "stale" : ""}" data-cmd="selfActualize" title="${isNeverAssessed ? "Run self-actualization" : "Last self-actualization"}" tabindex="0" role="button">${isNeverAssessed ? "⚡ Assess" : "✓ " + assessedLabel}</span>
                    <span class="context-badge">${principlesText}</span>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Quick Actions</div>
            <nav class="action-list" aria-label="Quick actions" role="navigation">
                ${skillRecommendationsHtml}
                
                <div class="action-group-label">CORE</div>
                ${this._actionButton('workingWithAlex', '🎓', 'Working with Alex', 'Learn how to work effectively with Alex')}
                ${this._actionButton('openBrainAnatomy', '🧠', 'Brain Anatomy', 'Explore Alex\'s cognitive brain anatomy')}
                <button class="action-btn" data-cmd="openChat" tabindex="0" role="button" aria-label="Chat with Copilot">
                    <span class="action-icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M6.25 9a.75.75 0 0 1 .75.75v1.5a.25.25 0 0 0 .25.25h1.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 8.75 13h-1.5A1.75 1.75 0 0 1 5.5 11.25v-1.5A.75.75 0 0 1 6.25 9Z"/><path d="M7.25 1a.75.75 0 0 1 .75.75V3h.5a3.25 3.25 0 0 1 3.163 4.001l.087.094 1.25 1.25a.75.75 0 0 1-1.06 1.06l-.94-.94-.251.228A3.25 3.25 0 0 1 8.5 9.5h-.5v.75a.75.75 0 0 1-1.5 0V9.5h-.5A3.25 3.25 0 0 1 6 3h.5V1.75A.75.75 0 0 1 7.25 1ZM8.5 4.5h-3a1.75 1.75 0 0 0 0 3.5h3a1.75 1.75 0 0 0 0-3.5Z"/><path d="M6.75 6a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm2.5 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"/></svg></span>
                    <span class="action-text">Chat with Copilot</span>
                </button>
                <button class="action-btn" data-cmd="upgrade" tabindex="0" role="button" aria-label="Initialize or Update Alex architecture">
                    <span class="action-icon" aria-hidden="true">${hasGlobalKnowledge ? "🌐" : "⬆️"}</span>
                    <span class="action-text">Initialize / Update</span>
                </button>
                ${this._actionButton('dream', '💭', 'Dream')}
                ${this._actionButton('selfActualize', '✨', 'Self-Actualize')}
                
                ${
                  hasGlobalKnowledge
                    ? `<div class="action-group-label">KNOWLEDGE</div>
                ${this._actionButton('knowledgeQuickPick', '🔎', 'Search Knowledge')}`
                    : ""
                }
                
                <div class="action-group-label">DEV TOOLS</div>
                ${this._actionButton('codeReview', '👀', 'Code Review', 'Get AI code review for selection or pasted code')}
                ${this._actionButton('debugThis', '🐛', 'Debug This', 'Debug code or error message')}
                ${this._actionButton('rubberDuck', '🦆', 'Rubber Duck', 'Explain your problem to Alex as rubber duck')}
                ${this._actionButton('generateTests', '🧪', 'Generate Tests', 'Generate tests for selection or pasted code')}
                ${this._actionButton('runAudit', '🔍', 'Project Audit')}
                ${this._actionButton('releasePreflight', '🚀', 'Release Preflight')}
                ${this._actionButton('importGitHubIssues', '📋', 'Import Issues', 'Import GitHub issues as learning goals')}
                ${this._actionButton('reviewPR', '👁️', 'Review PR', 'Generate AI-powered code review for pull requests')}
                
                <div class="action-group-label">MULTIMODAL</div>
                ${this._actionButton('askAboutSelection', '💬', 'Ask Alex', 'Ask Alex about selected code or enter a question')}
                ${this._actionButton('saveSelectionAsInsight', '💡', 'Save Insight', 'Save selection or type an insight to knowledge')}
                ${this._actionButton('searchRelatedKnowledge', '🔍', 'Search Knowledge', 'Search Alex knowledge for related patterns')}
                ${this._actionButton('generateDiagram', '📊', 'Generate Diagram', 'Generate Mermaid diagrams from code or text')}
                ${this._actionButton('generatePptx', '📰', 'Generate Presentation', 'Generate PowerPoint from markdown or selection')}
                ${this._actionButton('readAloud', '🔊', 'Read Aloud', 'Read selected text aloud using neural voices')}
                
                <div class="action-group-label">BALANCE</div>
                ${this._actionButton('startSession', '🍅', 'Focus Session')}
                ${this._actionButton('showGoals', '🎯', 'Goals')}
                
                <div class="action-group-label">SYSTEM</div>
                ${this._actionButton('memoryDashboard', '🧠', 'Memory Architecture', 'View cognitive memory architecture')}
                ${this._actionButton('exportM365', '📦', 'Export for M365', 'Package knowledge for M365 Copilot')}
                ${this._actionButton('setupEnvironment', '⚙️', 'Environment Setup', 'Configure VS Code settings: Essential, Recommended, Extended Thinking, Copilot Memory')}
                ${this._actionButton('openDocs', '📚', 'Docs')}
                ${this._actionButton('provideFeedback', '💬', 'Provide Feedback', 'Share feedback, ideas, or feature requests')}
                ${this._actionButton('viewDiagnostics', '🩺', 'Diagnostics', 'View diagnostics and report issues')}
            </nav>
        </div>
        
        ${this._getGoalsHtml(goals)}
        
        ${this._getFeaturesHtml()}
    </div>
    
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        
        function cmd(command, data) {
            vscode.postMessage({ command, ...data });
        }
        
        function refresh() {
            vscode.postMessage({ command: 'refresh' });
        }
        
        // Event delegation for all data-cmd clicks (CSP-compliant)
        document.addEventListener('click', function(e) {
            const el = e.target.closest('[data-cmd]');
            if (el) {
                e.preventDefault();
                const command = el.getAttribute('data-cmd');
                const skill = el.getAttribute('data-skill');
                const skillName = el.getAttribute('data-skill-name');
                if (skill) {
                    cmd(command, { skill, skillName });
                } else {
                    cmd(command);
                }
            }
        });
        
        // Auto-refresh interval (30 seconds)
        const AUTO_REFRESH_MS = 30000;
        setInterval(refresh, AUTO_REFRESH_MS);
    </script>
</body>
</html>`;
  }

  private _escapeHtml(text: string): string {
    // Delegate to centralized sanitization
    return escapeHtml(text);
  }

  private _formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Generate action button HTML with accessibility attributes
   */
  private _actionButton(cmd: string, icon: string, label: string, title?: string): string {
    const titleAttr = title ? ` title="${this._escapeHtml(title)}"` : '';
    const ariaLabel = title ? this._escapeHtml(title) : label;
    return `<button class="action-btn" data-cmd="${cmd}"${titleAttr} tabindex="0" role="button" aria-label="${ariaLabel}">
                    <span class="action-icon" aria-hidden="true">${icon}</span>
                    <span class="action-text">${label}</span>
                </button>`;
  }

  private _getGoalsHtml(goals: {
    activeGoals: LearningGoal[];
    completedToday: number;
    streakDays: number;
    totalCompleted: number;
  }): string {
    if (goals.activeGoals.length === 0 && goals.streakDays === 0) {
      // No goals yet - show prompt to create one
      return `
        <div class="section">
            <div class="section-title">Learning Goals</div>
            <div style="text-align: center; padding: 12px; opacity: 0.7;" role="region" aria-label="Create learning goals">
                <p style="margin: 0 0 8px 0;">Set goals to track your progress</p>
                <button class="action-btn primary" data-cmd="createGoal" style="display: inline-flex; width: auto;" tabindex="0" role="button" aria-label="Create your first learning goal">
                    <span class="action-icon" aria-hidden="true">➕</span>
                    <span class="action-text">Create Goal</span>
                </button>
            </div>
        </div>`;
    }

    // Build goals list
    const goalsListHtml = goals.activeGoals
      .slice(0, 3)
      .map((goal) => {
        const progress = Math.round(
          (goal.currentCount / goal.targetCount) * 100,
        );
        const progressWidth = Math.min(progress, 100);
        return `
            <div class="goal-item" role="article" aria-label="Goal: ${this._escapeHtml(goal.title)}">
                <div class="goal-header">
                    <span class="goal-title">${this._escapeHtml(goal.title)}</span>
                    <span class="goal-progress-text" aria-label="Progress: ${goal.currentCount} of ${goal.targetCount}">${goal.currentCount}/${goal.targetCount}</span>
                </div>
                <div class="goal-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" aria-label="${progress}% complete">
                    <div class="goal-bar-fill" style="width: ${progressWidth}%;"></div>
                </div>
            </div>`;
      })
      .join("");

    return `
        <div class="section">
            <div class="section-title">Learning Goals ${goals.streakDays > 0 ? `<span style="float: right;">🔥 ${goals.streakDays} day streak</span>` : ""}</div>
            <div class="goals-stats" role="status" aria-label="${goals.completedToday} completed today, ${goals.totalCompleted} total">
                <span>✅ ${goals.completedToday} today</span>
                <span>🏆 ${goals.totalCompleted} total</span>
            </div>
            <div role="list" aria-label="Active learning goals">
                ${goalsListHtml || '<div style="text-align: center; padding: 8px; opacity: 0.6;" role="status">No active goals</div>'}
            </div>
        </div>`;
  }

  /**
   * Generate the Nudges section HTML (contextual reminders)
   * Only shows when there are actionable nudges
   */
  private _getNudgesHtml(nudges: Nudge[]): string {
    if (nudges.length === 0) {
      return "";
    }

    const nudgesHtml = nudges
      .map((nudge) => {
        const typeClass = `nudge-${nudge.type}`;
        const actionHtml = nudge.action
          ? `<button class="nudge-action" data-cmd="${nudge.action}" tabindex="0" role="button" aria-label="${this._escapeHtml(nudge.actionLabel || 'Take action')}">${this._escapeHtml(nudge.actionLabel || 'Take action')}</button>`
          : "";

        return `
        <div class="nudge-card ${typeClass}" role="article" aria-label="Nudge: ${this._escapeHtml(nudge.message)}">
            <span class="nudge-icon" aria-hidden="true">${nudge.icon}</span>
            <div class="nudge-content">
                <span class="nudge-message">${this._escapeHtml(nudge.message)}</span>
            </div>
            ${actionHtml}
        </div>`;
      })
      .join("");

    return `
        <div class="nudges-section">
            ${nudgesHtml}
        </div>`;
  }

  /**
   * Generate the Features/Documentation section HTML
   */
  private _getFeaturesHtml(): string {
    return `
        <div class="section features-section">
            <details>
                <summary class="section-title clickable">📖 Features & Documentation</summary>
                <div class="features-content">
                    <div class="feature-category" role="article" aria-labelledby="cognitive-core-title">
                        <div class="feature-category-title" id="cognitive-core-title">🧠 Cognitive Core</div>
                        <ul class="feature-list" role="list">
                            <li><strong>Dream Protocol</strong> - Automated neural maintenance, synapse validation, and architecture health checks</li>
                            <li><strong>Self-Actualization</strong> - Deep meditation with comprehensive architecture assessment and knowledge promotion</li>
                            <li><strong>Meditation</strong> - Conscious knowledge consolidation via chat (@alex /meditate)</li>
                            <li><strong>Brain QA</strong> - 31-phase health validation covering structure, indexes, content, and format</li>
                            <li><strong>Muscle Scripts</strong> - Execution scripts for audit, build, sync, and validation tasks</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category" role="article" aria-labelledby="knowledge-mgmt-title">
                        <div class="feature-category-title" id="knowledge-mgmt-title">📚 Knowledge Management</div>
                        <ul class="feature-list" role="list">
                            <li><strong>Global Knowledge</strong> - Cross-project patterns and insights with GitHub remote access</li>
                            <li><strong>Team Sharing</strong> - Git-based knowledge repository accessible across machines</li>
                            <li><strong>Skill Library</strong> - 116 portable skills with triggers and synaptic connections</li>
                            <li><strong>Domain Learning</strong> - Bootstrap new domains through conversational acquisition</li>
                            <li><strong>Trifecta Model</strong> - Core capabilities encoded across all 3 memory systems (Skill+Instruction+Prompt)</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category" role="article" aria-labelledby="balance-title">
                        <div class="feature-category-title" id="balance-title">⚖️ Work-Life Balance</div>
                        <ul class="feature-list" role="list">
                            <li><strong>Focus Sessions</strong> - Pomodoro-style work sessions with breaks and automatic tracking</li>
                            <li><strong>Learning Goals</strong> - Track progress with targets, streaks, and achievements</li>
                            <li><strong>Health Dashboard</strong> - Visual architecture status and cognitive metrics</li>
                            <li><strong>Streak Protection</strong> - Stay motivated with daily progress indicators</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category" role="article" aria-labelledby="chat-title">
                        <div class="feature-category-title" id="chat-title">💬 Chat Integration</div>
                        <ul class="feature-list" role="list">
                            <li><strong>@alex Chat Participant</strong> - Personality-driven conversations with memory</li>
                            <li><strong>12 Language Model Tools</strong> - Status, memory search, knowledge management</li>
                            <li><strong>Custom Agents</strong> - Specialized handoffs for meditation, dreams, Azure</li>
                            <li><strong>Slash Commands</strong> - /meditate, /status, /knowledge, /saveinsight, and more</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category" role="article" aria-labelledby="cross-platform-title">
                        <div class="feature-category-title" id="cross-platform-title">🌐 Cross-Platform</div>
                        <ul class="feature-list" role="list">
                            <li><strong>M365 Export</strong> - Package knowledge for Microsoft 365 Copilot integration</li>
                            <li><strong>Architecture Upgrade</strong> - Seamless migration between versions with backup</li>
                            <li><strong>User Profile</strong> - Personalized communication style and preferences</li>
                            <li><strong>Text-to-Speech</strong> - Voice synthesis for reading documents and content aloud</li>
                            <li><strong>Research-First Dev</strong> - Pre-project knowledge encoding with 4-dimension gap analysis</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category" role="article" aria-labelledby="env-setup-title">
                        <div class="feature-category-title" id="env-setup-title">⚙️ Environment Setup</div>
                        <ul class="feature-list" role="list">
                            <li><strong>Essential Settings</strong> (7) - instruction/prompt file locations, agent mode, skill loading</li>
                            <li><strong>Recommended Settings</strong> (24) - thinking tool, memory, subagents, MCP gallery, request queueing, UI</li>
                            <li><strong>Auto-Approval Settings</strong> (5) - auto-run tools, file operations, terminal automation</li>
                            <li><strong>Extended Thinking</strong> (2) - Opus 4.5/4.6 deep reasoning (16K token budget)</li>
                            <li><strong>Persona Detection</strong> - ⭐ Auto-detect project type, adapt Focus Trifectas (GK premium)</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category" role="article" aria-labelledby="config-title">
                        <div class="feature-category-title" id="config-title">📁 Configuration Locations</div>
                        <ul class="feature-list" role="list">
                            <li><strong>.github/config/</strong> - All Alex configuration files</li>
                            <li><strong>user-profile.json</strong> - Communication preferences and project persona</li>
                            <li><strong>markdown-light.css</strong> - GitHub-style markdown preview theme</li>
                            <li><strong>cognitive-config.json</strong> - Dream/meditation state tracking</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category" role="article" aria-labelledby="docs-title">
                        <div class="feature-category-title" id="docs-title">📖 Documentation Guides</div>
                        <ul class="feature-list" role="list">
                            <li><strong>Work-Life Balance</strong> - Focus sessions, goals, streaks, and sustainable productivity</li>
                            <li><strong>M365 Export</strong> - Bridge your knowledge to Microsoft 365 Copilot</li>
                            <li><strong>Global Knowledge</strong> - Cross-project patterns and insights</li>
                            <li><strong>User Manual</strong> - Complete feature reference and tutorials</li>
                        </ul>
                    </div>
                    
                    <nav class="feature-links" role="navigation" aria-label="Feature documentation links">
                        <button class="feature-link-btn" data-cmd="workingWithAlex" tabindex="0" role="button" aria-label="Learn about working with Alex">🎓 Working with Alex</button>
                        <button class="feature-link-btn" data-cmd="agentVsChat" tabindex="0" role="button" aria-label="Compare agents and @alex chat mode">🤖 Agent vs @alex</button>
                        <button class="feature-link-btn" data-cmd="openDocs" tabindex="0" role="button" aria-label="Open full documentation">📚 Full Documentation</button>
                        <button class="feature-link-btn" data-cmd="openBrainAnatomy" tabindex="0" role="button" aria-label="Explore brain anatomy">🧠 Brain Anatomy</button>
                        <button class="feature-link-btn" data-cmd="openMarketplace" tabindex="0" role="button" aria-label="View on VS Code Marketplace">🏪 Marketplace</button>
                        <button class="feature-link-btn" data-cmd="openGitHub" tabindex="0" role="button" aria-label="View on GitHub">🐙 GitHub</button>
                    </nav>
                </div>
            </details>
        </div>`;
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

  return provider;
}
