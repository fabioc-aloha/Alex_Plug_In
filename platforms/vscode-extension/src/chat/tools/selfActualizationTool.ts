import * as vscode from "vscode";
import * as path from "path";
import * as workspaceFs from "../../shared/workspaceFs";
import { createSynapseRegex } from "../../shared/utils";
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
            `- Validate all synaptic connections\n` +
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
        totalSynapses: 0,
        brokenConnections: 0,
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

    // Phase 1: Scan synapse health
    const synapsePatterns = [
      ".github/copilot-instructions.md",
      ".github/instructions/*.md",
      ".github/prompts/*.md",
      ".github/episodic/*.md",
      ".github/skills/*/SKILL.md",
      ".github/domain-knowledge/*.md", // Legacy
    ];

    // Create fresh regex instance to avoid state leakage
    const synapseRegex = createSynapseRegex();

    for (const pattern of synapsePatterns) {
      // Check for cancellation
      if (token.isCancellationRequested) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart("Self-actualization cancelled."),
        ]);
      }

      const relativePattern = new vscode.RelativePattern(
        workspaceFolders[0],
        pattern,
      );
      const files = await vscode.workspace.findFiles(relativePattern);

      for (const file of files) {
        // Check for cancellation before processing each file
        if (token.isCancellationRequested) {
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart("Self-actualization cancelled."),
          ]);
        }
        report.synapseHealth.totalFiles++;
        try {
          const content = await workspaceFs.readFile(file.fsPath);
          const lines = content.replace(/\r\n/g, "\n").split("\n");

          let inCodeBlock = false;
          for (const line of lines) {
            if (line.trim().startsWith("```")) {
              inCodeBlock = !inCodeBlock;
              continue;
            }
            if (inCodeBlock) {
              continue;
            }

            let match;
            while ((match = synapseRegex.exec(line)) !== null) {
              report.synapseHealth.totalSynapses++;
              const targetName = match[1].trim();

              const found = await vscode.workspace.findFiles(
                new vscode.RelativePattern(
                  workspaceFolders[0],
                  `**/${targetName}`,
                ),
              );

              if (found.length === 0) {
                report.synapseHealth.brokenConnections++;
              }
            }
          }
        } catch {
          // Skip unreadable files
        }
      }
    }

    // Determine health status
    report.synapseHealth.healthStatus =
      report.synapseHealth.brokenConnections === 0
        ? "EXCELLENT"
        : report.synapseHealth.brokenConnections < 5
          ? "GOOD"
          : report.synapseHealth.brokenConnections < 10
            ? "NEEDS ATTENTION"
            : "CRITICAL";

    // Phase 1b: Validate synapses.json connection targets
    const synapseJsonFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(
        workspaceFolders[0],
        ".github/skills/*/synapses.json",
      ),
      null,
      500,
    );
    for (const sjFile of synapseJsonFiles) {
      if (token.isCancellationRequested) {
        break;
      }
      try {
        const sjContent = await workspaceFs.readFile(sjFile.fsPath);
        const sjData = JSON.parse(sjContent);
        if (Array.isArray(sjData.connections)) {
          for (const conn of sjData.connections) {
            if (!conn.target) {
              continue;
            }
            // Skip URI-scheme targets (cross-system references)
            if (/^(global-knowledge:\/\/|external:)/.test(conn.target)) {
              continue;
            }
            report.synapseHealth.totalSynapses++;
            const targetFullPath = path.join(rootPath, conn.target);
            if (!(await workspaceFs.pathExists(targetFullPath))) {
              report.synapseHealth.brokenConnections++;
            }
          }
        }
      } catch {
        // Invalid JSON — already counted by other checks
      }
    }

    // Re-evaluate health after JSON synapse scan
    report.synapseHealth.healthStatus =
      report.synapseHealth.brokenConnections === 0
        ? "EXCELLENT"
        : report.synapseHealth.brokenConnections < 5
          ? "GOOD"
          : report.synapseHealth.brokenConnections < 10
            ? "NEEDS ATTENTION"
            : "CRITICAL";

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
    if (report.synapseHealth.brokenConnections > 0) {
      report.recommendations.push(
        `Run \`Alex: Dream (Neural Maintenance)\` to repair ${report.synapseHealth.brokenConnections} broken synapse(s)`,
      );
    }

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

## 🧠 Synapse Health

| Metric | Value |
|--------|-------|
| Memory Files | ${report.synapseHealth.totalFiles} |
| Total Synapses | ${report.synapseHealth.totalSynapses} |
| Broken Connections | ${report.synapseHealth.brokenConnections} |
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

### Synapse Health ${healthEmoji}

| Metric | Value |
|--------|-------|
| Memory Files | ${report.synapseHealth.totalFiles} |
| Total Synapses | ${report.synapseHealth.totalSynapses} |
| Broken Connections | ${report.synapseHealth.brokenConnections} |
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
