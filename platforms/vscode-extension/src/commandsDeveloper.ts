/**
 * commandsDeveloper.ts - Developer tool and diagnostic commands
 *
 * Extracted from extension.ts to keep the main activation file focused.
 * Contains: code review, debug, rubber duck, explain, refactor, security review,
 * document, simplify, AI image generation, test generation, skill review, diagnostics.
 */
import * as vscode from 'vscode';
import { openChatPanel } from './shared/utils';
import { requireCognitiveLevel } from './shared/cognitiveTier';
import { checkHealth } from './shared/healthCheck';
import * as telemetry from './shared/telemetry';
import { getCodeContext, buildTelemetryPanelHtml, handleTelemetryMessage, TelemetryData } from './commandsDeveloperHandlers';

export function registerDeveloperCommands(context: vscode.ExtensionContext, extensionVersion: string): void {
  const codeReviewDisposable = vscode.commands.registerCommand(
    "alex.codeReview",
    async (uri?: vscode.Uri) => {
      if (!(await requireCognitiveLevel('alex.codeReview'))) { return; }
      const endLog = telemetry.logTimed("command", "code_review");
      try {
        const ctx = await getCodeContext(uri);

        if (!ctx.text) {
          const prompt = `Review the code in the current workspace for issues, improvements, and best practices. Focus on:\n1. Code quality and readability\n2. Potential bugs or edge cases\n3. Performance considerations\n4. Security concerns\n5. Adherence to project conventions`;
          await openChatPanel(prompt);
          endLog(true);
          return;
        }
        
        const prompt = `Review this code from ${ctx.fileName} for issues, improvements, and best practices:\n\n\`\`\`${ctx.languageId}\n${ctx.text}\n\`\`\``;
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Debug This command
  const debugThisDisposable = vscode.commands.registerCommand(
    "alex.debugThis",
    async (uri?: vscode.Uri) => {
      if (!(await requireCognitiveLevel('alex.debugThis'))) { return; }
      const endLog = telemetry.logTimed("command", "debug_this");
      try {
        const ctx = await getCodeContext(uri);

        if (!ctx.text) {
          const userInput = await vscode.window.showInputBox({
            prompt: 'Paste the code or error message you want to debug',
            placeHolder: 'Error: Cannot read property x of undefined...',
            ignoreFocusOut: true
          });
          if (!userInput) { endLog(true); return; }
          ctx.text = userInput;
        }
        
        const prompt = `Help me debug this. Analyze for potential issues, suggest fixes, and explain root cause:\n\n\`\`\`${ctx.languageId}\n${ctx.text}\n\`\`\``;
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Rubber Duck Debugging command
  const rubberDuckDisposable = vscode.commands.registerCommand(
    "alex.rubberDuck",
    async (uri?: vscode.Uri) => {
      if (!(await requireCognitiveLevel('alex.rubberDuck'))) { return; }
      const endLog = telemetry.logTimed("command", "rubber_duck");
      try {
        // Get optional context from URI (explorer) or editor selection
        let context = '';
        const ctx = await getCodeContext(uri);
        if (ctx.text) {
          context = `\n\nHere's the code I'm looking at:\n\`\`\`${ctx.languageId}\n${ctx.text}\n\`\`\``;
        }

        const prompt = `🦆 **Rubber Duck Debug Session**

You are my rubber duck. I need to explain my problem to you.

**Your role:**
- Listen actively and ask clarifying questions
- Don't jump to solutions immediately
- Help me think through the problem step by step
- Ask "what should happen?" and "what actually happens?"
- Prompt me to explain my assumptions
- Only offer suggestions after I've fully explained

**Start by asking:** "What problem are you trying to solve?"${context}`;

        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Explain This command
  const explainThisDisposable = vscode.commands.registerCommand(
    "alex.explainThis",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "explain_this");
      try {
        const ctx = await getCodeContext(uri);

        if (!ctx.text) {
          vscode.window.showWarningMessage("Select code to explain");
          endLog(true);
          return;
        }

        const levels = [
          { label: "$(mortar-board) Junior Developer", description: "Step by step, define terms", value: "junior" },
          { label: "$(account) Senior Developer", description: "Key insights only", value: "senior" },
          { label: "$(shield) Code Reviewer", description: "Focus on risks and edge cases", value: "reviewer" },
          { label: "$(broadcast) Teaching Workshop", description: "Include exercises", value: "teacher" },
        ];

        const level = await vscode.window.showQuickPick(levels, {
          placeHolder: "Explain like I'm a...",
          title: "📚 Choose explanation level",
        });

        if (!level) {
          endLog(true);
          return;
        }

        const prompt = `Explain this code like I'm a ${level.value} developer. ${level.description}:

\`\`\`${ctx.languageId}
${ctx.text}
\`\`\`

Focus on: purpose, data flow, key design decisions, and any non-obvious behavior.`;
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Refactor This command
  const refactorThisDisposable = vscode.commands.registerCommand(
    "alex.refactorThis",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "refactor_this");
      try {
        const ctx = await getCodeContext(uri);

        if (!ctx.text) {
          vscode.window.showWarningMessage("Select code to refactor");
          endLog(true);
          return;
        }

        const goals = [
          { label: "$(book) Readability", description: "Cleaner, more understandable code", value: "readability" },
          { label: "$(dashboard) Performance", description: "Faster execution, less memory", value: "performance" },
          { label: "$(beaker) Testability", description: "Easier to test, better DI", value: "testability" },
          { label: "$(extensions) Maintainability", description: "Easier to modify and extend", value: "maintainability" },
          { label: "$(symbol-interface) SOLID Principles", description: "Apply SOLID design patterns", value: "solid" },
        ];

        const goal = await vscode.window.showQuickPick(goals, {
          placeHolder: "Refactor for...",
          title: "🔧 Choose refactoring goal",
        });

        if (!goal) {
          endLog(true);
          return;
        }

        const prompt = `Refactor this code for ${goal.value}. ${goal.description}.

\`\`\`${ctx.languageId}
${ctx.text}
\`\`\`

Show:
1. The refactored code
2. Before/after comparison for key changes
3. Explain each transformation and its benefit
4. Any tradeoffs to consider`;
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Security Review command
  const securityReviewDisposable = vscode.commands.registerCommand(
    "alex.securityReview",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "security_review");
      try {
        const ctx = await getCodeContext(uri);

        if (!ctx.text) {
          vscode.window.showWarningMessage("Select code for security review");
          endLog(true);
          return;
        }

        const prompt = `Security audit this code. Check for OWASP Top 10 vulnerabilities:

\`\`\`${ctx.languageId}
${ctx.text}
\`\`\`

Analyze for:
1. **Injection** (SQL, XSS, command injection)
2. **Authentication/Authorization** flaws
3. **Sensitive data exposure** (secrets, PII)
4. **Security misconfiguration**
5. **Insecure deserialization**
6. **Input validation** gaps
7. **Cryptographic weaknesses**

For each finding:
- Severity: Critical/High/Medium/Low
- Line/location
- Risk explanation
- Secure fix with code example`;
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Document This command
  const documentThisDisposable = vscode.commands.registerCommand(
    "alex.documentThis",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "document_this");
      try {
        const ctx = await getCodeContext(uri);

        if (!ctx.text) {
          vscode.window.showWarningMessage("Select code to document");
          endLog(true);
          return;
        }

        // Detect doc format based on language
        let docFormat = "JSDoc";
        if (ctx.languageId === "python") {docFormat = "docstrings (Google style)";}
        else if (ctx.languageId === "csharp" || ctx.languageId === "fsharp") {docFormat = "XML documentation comments";}
        else if (ctx.languageId === "rust") {docFormat = "rustdoc";}
        else if (ctx.languageId === "go") {docFormat = "Go doc comments";}
        else if (ctx.languageId === "java") {docFormat = "Javadoc";}

        const prompt = `Generate comprehensive ${docFormat} documentation for this code:

\`\`\`${ctx.languageId}
${ctx.text}
\`\`\`

Include:
- @param / @returns / @throws (or language equivalent)
- Description of purpose and behavior
- Usage examples for complex functions
- Edge cases and important notes
- Type information where applicable

Output ONLY the documented code, ready to paste.`;
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Simplify This command
  const simplifyThisDisposable = vscode.commands.registerCommand(
    "alex.simplifyThis",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "simplify_this");
      try {
        const ctx = await getCodeContext(uri);

        if (!ctx.text) {
          vscode.window.showWarningMessage("Select code to simplify");
          endLog(true);
          return;
        }

        const prompt = `Simplify this code while preserving behavior:

\`\`\`${ctx.languageId}
${ctx.text}
\`\`\`

Apply these clean code principles:
1. **Reduce nesting** - Flatten conditionals, use early returns
2. **Extract helpers** - Break complex logic into named functions
3. **Improve naming** - Variables and functions should be self-documenting
4. **Remove duplication** - DRY principle
5. **Simplify expressions** - Use language idioms and built-ins

For each change:
- Show the before/after
- Explain WHY it's simpler (not just how)
- Ensure no behavior changes`;
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Generate Diagram command

  // Generate Tests command
  const generateTestsDisposable = vscode.commands.registerCommand(
    "alex.generateTests",
    async (uri?: vscode.Uri) => {
      if (!(await requireCognitiveLevel('alex.generateTests'))) { return; }
      const endLog = telemetry.logTimed("command", "generate_tests");
      try {
        const ctx = await getCodeContext(uri);

        if (!ctx.text) {
          const userInput = await vscode.window.showInputBox({
            prompt: 'Paste the code you want to generate tests for',
            placeHolder: 'function add(a, b) { return a + b; }',
            ignoreFocusOut: true
          });
          if (!userInput) { endLog(true); return; }
          ctx.text = userInput;
        }

        const testFrameworks = [
          { label: "$(beaker) Auto-detect", description: "Let Alex choose based on project", detail: "Recommended" },
          { label: "$(beaker) Jest", description: "JavaScript/TypeScript testing", detail: "Popular for React, Node.js" },
          { label: "$(beaker) Mocha", description: "Flexible test framework", detail: "Often with Chai assertions" },
          { label: "$(beaker) Vitest", description: "Vite-native testing", detail: "Fast, ESM-first" },
          { label: "$(beaker) pytest", description: "Python testing", detail: "Fixtures, parametrize" },
          { label: "$(beaker) xUnit/NUnit", description: ".NET testing", detail: "C#, F#" },
        ];

        const framework = await vscode.window.showQuickPick(testFrameworks, {
          placeHolder: "Select test framework",
          title: "🧪 Generate Tests",
        });

        if (!framework) {
          endLog(true);
          return;
        }

        const frameworkName = framework.label.replace(/\$\([^)]+\)\s*/, '');
        
        const prompt = `Generate comprehensive tests for this code using ${frameworkName}. Include edge cases, error handling, and meaningful assertions:\n\n\`\`\`${ctx.languageId}\n${ctx.text}\n\`\`\``;
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Skill Review command - Check staleness of skills and knowledge
  const skillReviewDisposable = vscode.commands.registerCommand(
    "alex.skillReview",
    async () => {
      const endLog = telemetry.logTimed("command", "skill_review");
      try {
        const reviewTypes = [
          { label: "$(warning) Check Stale Skills", description: "Review skills that may need updating", detail: "Security, privacy, models, APIs" },
          { label: "$(shield) Security Review", description: "Review Microsoft SFI and security practices", detail: "Secure Future Initiative compliance" },
          { label: "$(lock) Privacy & PII Review", description: "Review GDPR, Australian Privacy compliance", detail: "Data protection regulations" },
          { label: "$(hubot) Responsible AI Review", description: "Review AI ethics and governance practices", detail: "Microsoft & Google RAI principles" },
          { label: "$(rocket) LLM Model Review", description: "Check model recommendations are current", detail: "Claude, GPT, Gemini updates" },
          { label: "$(extensions) VS Code API Review", description: "Check extension patterns are current", detail: "VS Code release compatibility" },
          { label: "$(comment-discussion) Chat Patterns Review", description: "Review chat participant patterns", detail: "Proposed APIs, deprecations" },
          { label: "$(git-branch) Git Workflow Review", description: "Review git best practices", detail: "Branching, commits, PR patterns" },
        ];

        const selected = await vscode.window.showQuickPick(reviewTypes, {
          placeHolder: "Select review type",
          title: "🔍 Skill & Knowledge Review",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        let prompt = "";
        const reviewName = selected.label.replace(/\$\([^)]+\)\s*/, '');
        
        switch (reviewName) {
          case "Check Stale Skills":
            prompt = `Review Alex's staleness-prone skills and check if they need updates. Skills to check:
1. microsoft-sfi - Secure Future Initiative (last validated: Feb 2026)
2. pii-privacy-regulations - GDPR & Australian Privacy (last validated: Feb 2026)
3. privacy-responsible-ai - RAI principles (last validated: Feb 2026)
4. llm-model-selection - Model recommendations (last validated: Jan 2026)
5. vscode-extension-patterns - VS Code APIs (last validated: Jan 2026)
6. chat-participant-patterns - Chat APIs (last validated: Jan 2026)
7. git-workflow - Git practices (last validated: Jan 2026)
8. teams-app-patterns - Teams development (last validated: Jan 2026)
9. m365-agent-debugging - M365 agents (last validated: Jan 2026)

For each skill, check if there are newer versions, deprecations, or significant changes to the underlying technology.`;
            break;
          case "Security Review":
            prompt = `Review Microsoft Secure Future Initiative (SFI) compliance in the current project:
1. Check the 3 Core Principles: Secure by Design, Secure by Default, Secure Operations
2. Verify the 6 Pillars: Identity/Secrets, Tenants/Isolation, Networks, Engineering Systems, Threat Detection, Response/Remediation
3. Review OWASP Top 10 mitigations
4. Check credential management and secret handling
5. Verify dependency security (npm audit or equivalent)
6. Review security code patterns

Reference: .github/skills/microsoft-sfi/SKILL.md`;
            break;
          case "Privacy & PII Review":
            prompt = `Review privacy and PII handling compliance in the current project:
1. GDPR Compliance: Lawful basis, data minimization, consent, data subject rights
2. Australian Privacy Principles (APPs): All 13 APPs checklist
3. PII identification: Check for direct and indirect identifiers
4. Data encryption: At rest and in transit
5. Logging practices: Ensure PII is not logged
6. Retention policies: Data lifecycle management
7. Cross-border transfers: Adequacy and safeguards

Reference: .github/skills/pii-privacy-regulations/SKILL.md`;
            break;
          case "Responsible AI Review":
            prompt = `Review Responsible AI practices in the current project:
1. Microsoft's 6 RAI Principles: Fairness, Reliability/Safety, Privacy/Security, Inclusiveness, Transparency, Accountability
2. Google's 3 Pillars: Bold Innovation, Responsible Development, Collaborative Progress
3. Bias detection and mitigation
4. Model documentation (Model Cards)
5. Human-AI collaboration patterns
6. Appropriate reliance: CAIR/CSR framework
7. AI transparency and explainability

Reference: .github/skills/privacy-responsible-ai/SKILL.md and .github/skills/appropriate-reliance/SKILL.md`;
            break;
          case "LLM Model Review":
            prompt = `Review and update LLM model recommendations:
1. Check current model capabilities and pricing
2. Verify context window sizes are accurate
3. Review tier recommendations (Frontier/Capable/Fast)
4. Check for new model announcements (Claude, GPT, Gemini)
5. Update cost optimization strategies
6. Review model-specific limitations

Reference: .github/skills/llm-model-selection/SKILL.md
Check: Anthropic docs, OpenAI docs, Google AI docs`;
            break;
          case "VS Code API Review":
            prompt = `Review VS Code extension patterns for current API compatibility:
1. Check against latest VS Code release notes
2. Verify no deprecated APIs are used
3. Review proposed APIs that may have become stable
4. Check webview security policies
5. Review activation events and contributes patterns
6. Verify compatibility with current VS Code version

Reference: .github/skills/vscode-extension-patterns/SKILL.md
Check: VS Code API docs, latest release notes`;
            break;
          case "Chat Patterns Review":
            prompt = `Review chat participant patterns for current API status:
1. Check which proposed APIs have become stable
2. Review deprecated patterns
3. Verify chat participant registration patterns
4. Check language model tool patterns
5. Review follow-up question patterns

Reference: .github/skills/chat-participant-patterns/SKILL.md`;
            break;
          case "Git Workflow Review":
            prompt = `Review git workflow patterns and best practices:
1. Check branch naming conventions
2. Review commit message format (Conventional Commits)
3. Verify PR and code review patterns
4. Check GitHub CLI usage patterns
5. Review git hooks and automation

Reference: .github/skills/git-workflow/SKILL.md`;
            break;
        }
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Beta telemetry commands (temporary - remove after beta)
  const viewTelemetryDisposable = vscode.commands.registerCommand(
    "alex.viewBetaTelemetry",
    async () => {
      const sessions = await telemetry.getAllTelemetryData();
      const summary = telemetry.getSessionSummary();
      const aggregate = await telemetry.getAllSessionsAggregate();
      const alexSettings = telemetry.getAlexSettings();
      const health = await checkHealth();
      const extVersion =
        context.extension.packageJSON.version || "unknown";

      const panel = vscode.window.createWebviewPanel(
        "alexBetaTelemetry",
        "Alex Diagnostics & Bug Report",
        vscode.ViewColumn.One,
        { enableScripts: true },
      );

      const telemetryData: TelemetryData = {
        sessions, summary, aggregate, alexSettings, health, extensionVersion: extVersion
      };
      panel.webview.html = buildTelemetryPanelHtml(telemetryData);

      panel.webview.onDidReceiveMessage(
        (msg) => handleTelemetryMessage(msg, panel, extVersion)
      );
    },
  );

  context.subscriptions.push(
    codeReviewDisposable,
    debugThisDisposable,
    rubberDuckDisposable,
    explainThisDisposable,
    refactorThisDisposable,
    securityReviewDisposable,
    documentThisDisposable,
    simplifyThisDisposable,
    generateTestsDisposable,
    skillReviewDisposable,
    viewTelemetryDisposable,
  );
}
