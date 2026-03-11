import * as vscode from "vscode";

function getQuickPickItems(): vscode.QuickPickItem[] {
  return [
    {
      label: "$(pulse) Run Dream Protocol",
      description: "Neural maintenance and synapse validation",
      detail: "Ctrl+Alt+D",
    },
    {
      label: "$(sparkle) Self-Actualize",
      description: "Deep meditation and assessment",
      detail: "Ctrl+Alt+S",
    },
    {
      label: "$(package) Export for M365",
      description: "Package memory for M365 Copilot",
      detail: "Export to ~/Alex-Memory-Export/ → upload to OneDrive",
    },
    {
      label: "$(book) Open Documentation",
      description: "View Alex documentation",
      detail: "Ctrl+Alt+H",
    },
    {
      label: "$(mortar-board) Working with Alex",
      description: "Prompting guide for effective partnership",
      detail: "📚 Learn to work with Alex effectively",
    },
    {
      label: "$(arrow-up) Upgrade Architecture",
      description: "Update workspace to latest version",
    },
    {
      label: "$(gear) Setup Environment",
      description: "Optimize VS Code settings for Alex",
    },
    {
      label: "$(bug) Report Issue / View Diagnostics",
      description: "View local telemetry for bug reports",
      detail: "Data stays on your machine",
    },
    {
      label: "$(comment-discussion) Chat with @alex",
      description: "Open Copilot Chat",
    },
    {
      label: "$(list-tree) Generate Skill Catalog",
      description: "Create network diagram of all skills",
    },
    {
      label: "$(search) Search Knowledge",
      description: "Quick search across global knowledge",
    },
    {
      label: "$(watch) Start Focus Session",
      description: "Pomodoro timer for focused work with breaks",
      detail: "⚖️ Work-Life Balance",
    },
    {
      label: "$(target) Manage Learning Goals",
      description: "Track progress with targets and streaks",
      detail: "⚖️ Work-Life Balance",
    },
    {
      label: "$(graph) Health Dashboard",
      description: "Visual architecture health overview",
    },
    {
      label: "$(server) Memory Dashboard",
      description: "Memory architecture visualization",
    },
    {
      label: "$(checklist) Run Project Audit",
      description: "22-point audit: security, dependencies, UI, tests",
      detail: "🔍 Comprehensive project health check",
    },
    // --- Developer Tools ---
    { label: "", kind: vscode.QuickPickItemKind.Separator },
    {
      label: "$(rocket) Release Preflight",
      description: "Pre-release checklist and verification",
      detail: "🚀 Ready to ship?",
    },
    {
      label: "$(code) Code Review Selection",
      description: "Review selected code for issues",
      detail: "📋 Requires text selection",
    },
    {
      label: "$(bug) Debug This",
      description: "Analyze selection for bugs/issues",
      detail: "🐛 Requires text selection",
    },
    {
      label: "$(comment-discussion) Rubber Duck Debug",
      description: "Explain your problem to Alex as rubber duck",
      detail: "🦆 Dialog-based debugging",
    },
    {
      label: "$(question) Explain This",
      description: "Level-appropriate code explanation",
      detail: "📚 Junior/senior/reviewer/teacher levels",
    },
    {
      label: "$(edit) Refactor This",
      description: "Goal-oriented refactoring",
      detail: "🔧 Readability/performance/testability/SOLID",
    },
    {
      label: "$(lightbulb) Simplify This",
      description: "Clean code transformation",
      detail: "✨ Reduce nesting, improve naming",
    },
    {
      label: "$(shield) Security Review",
      description: "OWASP Top 10 security audit",
      detail: "🛡️ Injection, auth, secrets, etc.",
    },
    {
      label: "$(note) Document This",
      description: "Generate documentation",
      detail: "📝 JSDoc/docstrings/XML docs",
    },
    {
      label: "$(symbol-structure) Generate Diagram",
      description: "Create Mermaid diagrams",
      detail: "📊 Class, sequence, flowchart, ER, etc.",
    },
    {
      label: "$(beaker) Generate Tests",
      description: "Generate tests for selected code",
      detail: "🧪 Jest, Mocha, pytest, etc.",
    },
    {
      label: "$(verified) Validate Heir",
      description: "Check heir sync with Master Alex",
      detail: "🧬 Extension development",
    },
    // --- Multimodal ---
    { label: "", kind: vscode.QuickPickItemKind.Separator },
    {
      label: "$(file-media) Generate Presentation",
      description: "Create polished PowerPoint from Markdown or selection",
      detail: "📊 Local PPTX generation",
    },
    {
      label: "$(unmute) Read Aloud",
      description: "Read selected text with neural voices",
      detail: "🎙️ Text-to-speech",
    },
    {
      label: "$(file-media) Save as Audio",
      description: "Export text to MP3 file",
      detail: "🎵 Creates audio file in workspace",
    },
    // --- GitHub Integration ---
    { label: "", kind: vscode.QuickPickItemKind.Separator },
    {
      label: "$(git-pull-request) Review Pull Request",
      description: "AI-assisted PR review",
      detail: "🔍 Fetches PRs from GitHub",
    },
    {
      label: "$(github) Import GitHub Issues",
      description: "Import issues as learning goals",
      detail: "📋 Sync with GitHub Issues",
    },
  ];
}

function getDispatchMap(): Array<[string, string]> {
  return [
    ["Dream", "alex.dream"],
    ["Self-Actualize", "alex.selfActualize"],
    ["Export for M365", "alex.exportForM365"],
    ["Documentation", "alex.openDocs"],
    ["Working with Alex", "alex.workingWithAlex"],
    ["Upgrade", "alex.upgrade"],
    ["Setup Environment", "alex.setupEnvironment"],
    ["Report Issue", "alex.viewBetaTelemetry"],
    ["Chat", "workbench.panel.chat.view.copilot.focus"],
    ["Skill Catalog", "alex.generateSkillCatalog"],
    ["Search Knowledge", "alex.knowledgeQuickPick"],
    ["Focus Session", "alex.startSession"],
    ["Goals", "alex.showGoals"],
    ["Memory Dashboard", "alex.openMemoryDashboard"],
    ["Health Dashboard", "alex.openHealthDashboard"],
    ["Project Audit", "alex.runAudit"],
    ["Release Preflight", "alex.releasePreflight"],
    ["Code Review", "alex.codeReview"],
    ["Debug This", "alex.debugThis"],
    ["Rubber Duck", "alex.rubberDuck"],
    ["Explain This", "alex.explainThis"],
    ["Refactor This", "alex.refactorThis"],
    ["Simplify This", "alex.simplifyThis"],
    ["Security Review", "alex.securityReview"],
    ["Document This", "alex.documentThis"],
    ["Generate Diagram", "alex.generateDiagram"],
    ["Generate Tests", "alex.generateTests"],
    ["Generate Presentation", "alex.generatePptx"],
    ["Read Aloud", "alex.readAloud"],
    ["Save as Audio", "alex.saveAsAudio"],
    ["Review Pull Request", "alex.reviewPR"],
    ["Import GitHub Issues", "alex.importGitHubIssues"],
    ["Validate Heir", "alex.validateHeir"],
  ];
}

/**
 * Shows the Alex quick-action palette (status bar → click).
 * Every entry dispatches via vscode.commands.executeCommand so this
 * module has zero service imports.
 */
export async function showStatusQuickPick(): Promise<void> {
  const selected = await vscode.window.showQuickPick(getQuickPickItems(), {
    placeHolder: "Alex Cognitive Architecture - Quick Actions",
    title: "🚀 Alex Status",
  });

  if (!selected) { return; }

  const dispatch = getDispatchMap();
  for (const [label, command] of dispatch) {
    if (selected.label.includes(label)) {
      vscode.commands.executeCommand(command);
      return;
    }
  }
}
