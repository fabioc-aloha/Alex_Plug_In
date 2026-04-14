import * as vscode from "vscode";
import * as path from "path";
import * as workspaceFs from "../../shared/workspaceFs";
import { ISelfActualizationParams } from "./types";

/**
 * Self-Actualization Tool - Comprehensive cognitive architecture maintenance
 *
 * This tool performs a complete self-assessment including:
 * - Synapse health validation
 * - Version consistency checking
 * - Memory architecture assessment
 * - Recommendation generation
 * - Session documentation
 */
export class SelfActualizationTool implements vscode.LanguageModelTool<ISelfActualizationParams> {
  async prepareInvocation(
    _options: vscode.LanguageModelToolInvocationPrepareOptions<ISelfActualizationParams>,
    _token: vscode.CancellationToken,
  ): Promise<vscode.PreparedToolInvocation | undefined> {
    return {
      invocationMessage: "Running self-actualization protocol...",
      confirmationMessages: {
        title: "Self-Actualization Protocol",
        message: new vscode.MarkdownString(
          `Run comprehensive self-assessment of Alex cognitive architecture?\n\n` +
            `This will:\n` +
            `- Validate architecture file counts\n` +
            `- Check version consistency across memory files\n` +
            `- Assess memory architecture balance\n` +
            `- Generate improvement recommendations\n` +
            `- Create a meditation session record`,
        ),
      },
    };
  }

  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<ISelfActualizationParams>,
    token: vscode.CancellationToken,
  ): Promise<vscode.LanguageModelToolResult> {
    // Update welcome view avatar — self-actualization = meditation state
    vscode.commands.executeCommand("alex.setCognitiveState", "meditation");

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          "No workspace folder open. Cannot run self-actualization.",
        ),
      ]);
    }

    const rootPath = workspaceFolders[0].uri.fsPath;

    // Read version from copilot-instructions.md
    let currentVersion = "Unknown";
    try {
      const mainInstructionsPath = path.join(
        rootPath,
        ".github",
        "copilot-instructions.md",
      );
      if (await workspaceFs.pathExists(mainInstructionsPath)) {
        const content = await workspaceFs.readFile(mainInstructionsPath);
        const versionMatch = content.match(
          /\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/,
        );
        if (versionMatch) {
          currentVersion = versionMatch[1];
        }
      }
    } catch {
      // Use default
    }

    // Initialize report data
    const report = {
      timestamp: new Date().toISOString(),
      synapseHealth: {
        totalFiles: 0,
        totalSynapses: 0, // Deprecated
        brokenConnections: 0, // Deprecated
        healthStatus: "UNKNOWN",
      },
      versionConsistency: {
        currentVersion: currentVersion,
        outdatedReferences: 0,
      },
      memoryArchitecture: {
        proceduralFiles: 0,
        episodicFiles: 0,
        domainFiles: 0,
        skillCount: 0,
      },
      recommendations: [] as string[],
    };

    // Phase 1: Count architecture files
    const archPatterns = [
      ".github/instructions/*.md",
      ".github/prompts/*.md",
      ".github/episodic/*.md",
      ".github/skills/*/SKILL.md",
    ];

    // Check for cancellation
    if (token.isCancellationRequested) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart("Self-actualization cancelled."),
      ]);
    }

    let totalArchFiles = 0;
    for (const pattern of archPatterns) {
      const relativePattern = new vscode.RelativePattern(workspaceFolders[0], pattern);
      const files = await vscode.workspace.findFiles(relativePattern, null, 500);
      totalArchFiles += files.length;
    }
    report.synapseHealth.totalFiles = totalArchFiles;

    // Determine health status based on file count
    report.synapseHealth.healthStatus =
      totalArchFiles >= 50 ? "EXCELLENT" :
      totalArchFiles >= 20 ? "GOOD" :
      totalArchFiles >= 5 ? "NEEDS ATTENTION" : "MINIMAL";

    // Note: synapse scanning removed in v7.8 — embedded synapses deprecated

    // Phase 2: Count memory files
    const instructionFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(
        workspaceFolders[0],
        ".github/instructions/*.md",
      ),
    );
    const promptFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(workspaceFolders[0], ".github/prompts/*.md"),
    );
    const episodicFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(workspaceFolders[0], ".github/episodic/*.md"),
    );
    const domainFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(
        workspaceFolders[0],
        ".github/domain-knowledge/*.md",
      ),
    );
    const skillFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(
        workspaceFolders[0],
        ".github/skills/*/SKILL.md",
      ),
    );

    report.memoryArchitecture.proceduralFiles = instructionFiles.length;
    report.memoryArchitecture.episodicFiles =
      promptFiles.length + episodicFiles.length;
    report.memoryArchitecture.domainFiles = domainFiles.length;
    report.memoryArchitecture.skillCount = skillFiles.length;

    // Phase 3: Generate recommendations
    if (report.memoryArchitecture.skillCount < 3) {
      report.recommendations.push(
        `Consider building more skills - only ${report.memoryArchitecture.skillCount} skill(s) present`,
      );
    }

    if (report.memoryArchitecture.episodicFiles < 5) {
      report.recommendations.push(
        `Run more meditation sessions to build episodic memory - only ${report.memoryArchitecture.episodicFiles} session(s)`,
      );
    }

    // Phase 4: Create session record if requested
    let sessionFile = "";
    if (options.input.createReport !== false) {
      const episodicPath = path.join(rootPath, ".github", "episodic");
      await workspaceFs.ensureDir(episodicPath);

      const date = new Date();
      const dateStr = date.toISOString().split("T")[0];
      const filename = `self-actualization-${dateStr}.prompt.md`;
      sessionFile = path.join(episodicPath, filename);

      const healthEmoji =
        report.synapseHealth.healthStatus === "EXCELLENT"
          ? "✅"
          : report.synapseHealth.healthStatus === "GOOD"
            ? "🟢"
            : report.synapseHealth.healthStatus === "NEEDS ATTENTION"
              ? "🟡"
              : "🔴";

      const content = `# Self-Actualization Session - ${dateStr}

**Session Type**: Automated Self-Actualization Protocol
**Version**: ${report.versionConsistency.currentVersion}
**Timestamp**: ${report.timestamp}

---

## 🧠 Architecture Health

| Metric | Value |
|--------|-------|
| Architecture Files | ${report.synapseHealth.totalFiles} |
| Health Status | ${healthEmoji} ${report.synapseHealth.healthStatus} |

## 📊 Memory Architecture

| Type | Files |
|------|-------|
| Procedural | ${report.memoryArchitecture.proceduralFiles} |
| Episodic | ${report.memoryArchitecture.episodicFiles} |
| Skills | ${report.memoryArchitecture.skillCount} |
| Domain Knowledge (legacy) | ${report.memoryArchitecture.domainFiles} |

## 💡 Recommendations

${report.recommendations.length > 0 ? report.recommendations.map((r) => `- ${r}`).join("\n") : "- Architecture is optimal!"}

---

*Generated by Alex Self-Actualization Protocol*
`;
      await workspaceFs.writeFile(sessionFile, content);
    }

    // Build result
    const healthEmoji =
      report.synapseHealth.healthStatus === "EXCELLENT"
        ? "✅"
        : report.synapseHealth.healthStatus === "GOOD"
          ? "🟢"
          : report.synapseHealth.healthStatus === "NEEDS ATTENTION"
            ? "🟡"
            : "🔴";

    let result = `## Self-Actualization Report

### Architecture Health ${healthEmoji}

| Metric | Value |
|--------|-------|
| Architecture Files | ${report.synapseHealth.totalFiles} |
| Health Status | ${report.synapseHealth.healthStatus} |

### Memory Architecture

| Type | Files |
|------|-------|
| Procedural Memory | ${report.memoryArchitecture.proceduralFiles} |
| Episodic Memory | ${report.memoryArchitecture.episodicFiles} |
| Skills | ${report.memoryArchitecture.skillCount} |
| Domain Knowledge (legacy) | ${report.memoryArchitecture.domainFiles} |
| **Total** | **${report.memoryArchitecture.proceduralFiles + report.memoryArchitecture.episodicFiles + report.memoryArchitecture.skillCount + report.memoryArchitecture.domainFiles}** |

### Recommendations

${report.recommendations.length > 0 ? report.recommendations.map((r) => `- ${r}`).join("\n") : "- ✨ Architecture is healthy and optimized!"}
`;

    if (sessionFile) {
      result += `\n### Session Recorded\n\nMeditation session documented at: \`${path.basename(sessionFile)}\``;
    }

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(result),
    ]);
  }
}
