import * as vscode from "vscode";

function getQuickPickItems(): vscode.QuickPickItem[] {
  return [
    // --- Cognitive ---
    {
      label: "$(pulse) Dream",
      description: "Neural maintenance and synapse validation",
      detail: "Ctrl+Alt+D",
    },
    {
      label: "$(sparkle) Self-Actualize",
      description: "Deep meditation and assessment",
    },
    {
      label: "$(calendar) Daily Briefing",
      description: "Architecture summary for today",
    },
    {
      label: "$(graph) Health Dashboard",
      description: "Visual architecture health overview",
    },
    // --- Documentation & Setup ---
    { label: "", kind: vscode.QuickPickItemKind.Separator },
    {
      label: "$(book) Documentation",
      description: "View Alex documentation",
    },
    {
      label: "$(mortar-board) Prompting Guide",
      description: "Learn to work with Alex effectively",
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
      label: "$(comment-discussion) Open Agent Chat",
      description: "Open Copilot Chat in Agent mode",
    },
    // --- Knowledge ---
    { label: "", kind: vscode.QuickPickItemKind.Separator },
    {
      label: "$(search) Search Knowledge",
      description: "Quick search across global knowledge",
    },
    {
      label: "$(list-tree) Skill Catalog",
      description: "Generate network diagram of all skills",
    },
    // --- Quality & Audit ---
    { label: "", kind: vscode.QuickPickItemKind.Separator },
    {
      label: "$(checklist) Project Audit",
      description: "Security, dependencies, UI, tests",
    },
    {
      label: "$(rocket) Release Preflight",
      description: "Pre-release checklist and verification",
    },
    {
      label: "$(verified) Validate Heir",
      description: "Check heir sync with Master Alex",
    },
    // --- Developer Tools ---
    { label: "", kind: vscode.QuickPickItemKind.Separator },
    {
      label: "$(code) Code Review",
      description: "Review selected code for issues",
    },
    {
      label: "$(bug) Debug This",
      description: "Analyze selection for bugs",
    },
    {
      label: "$(comment-discussion) Rubber Duck",
      description: "Dialog-based debugging",
    },
    {
      label: "$(question) Explain This",
      description: "Level-appropriate code explanation",
    },
    {
      label: "$(edit) Refactor This",
      description: "Goal-oriented refactoring",
    },
    {
      label: "$(lightbulb) Simplify This",
      description: "Clean code transformation",
    },
    {
      label: "$(shield) Security Review",
      description: "OWASP Top 10 audit",
    },
    {
      label: "$(note) Document This",
      description: "Generate JSDoc / docstrings / XML docs",
    },
    {
      label: "$(symbol-structure) Generate Diagram",
      description: "Create Mermaid diagrams from code",
    },
    {
      label: "$(beaker) Generate Tests",
      description: "Generate tests for selected code",
    },
    // --- Create & Convert ---
    { label: "", kind: vscode.QuickPickItemKind.Separator },
    {
      label: "$(file-media) Generate Presentation",
      description: "Create PowerPoint from Markdown or selection",
    },
    // --- Diagnostics ---
    { label: "", kind: vscode.QuickPickItemKind.Separator },
    {
      label: "$(bug) Report Issue / View Diagnostics",
      description: "View local telemetry for bug reports",
    },
  ];
}

function getDispatchMap(): Array<[string, string]> {
  return [
    ["Dream", "alex.dream"],
    ["Self-Actualize", "alex.selfActualize"],
    ["Daily Briefing", "alex.dailyBriefing"],
    ["Health Dashboard", "alex.openHealthDashboard"],
    ["Documentation", "alex.openDocs"],
    ["Prompting Guide", "alex.workingWithAlex"],
    ["Upgrade", "alex.upgrade"],
    ["Setup Environment", "alex.setupEnvironment"],
    ["Agent Chat", "workbench.panel.chat.view.copilot.focus"],
    ["Search Knowledge", "alex.knowledgeQuickPick"],
    ["Skill Catalog", "alex.generateSkillCatalog"],
    ["Project Audit", "alex.runAudit"],
    ["Release Preflight", "alex.releasePreflight"],
    ["Validate Heir", "alex.validateHeir"],
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
    ["Report Issue", "alex.viewBetaTelemetry"],
  ];
}

/**
 * Shows the Alex quick-action palette (status bar → click).
 * Every entry dispatches via vscode.commands.executeCommand so this
 * module has zero service imports.
 */
export async function showStatusQuickPick(): Promise<void> {
  const selected = await vscode.window.showQuickPick(getQuickPickItems(), {
    placeHolder: "Select a command...",
    title: "Alex Quick Actions",
  });

  if (!selected) {
    return;
  }

  const dispatch = getDispatchMap();
  for (const [label, command] of dispatch) {
    if (selected.label.includes(label)) {
      vscode.commands.executeCommand(command);
      return;
    }
  }
}
