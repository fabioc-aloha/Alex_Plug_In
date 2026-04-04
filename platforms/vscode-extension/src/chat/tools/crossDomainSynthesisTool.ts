import * as vscode from "vscode";
import * as path from "path";
import * as workspaceFs from "../../shared/workspaceFs";
import { assertDefined } from "../../shared/assertions";
import { ICrossDomainSynthesisParams } from "./types";

/**
 * Domain categories for classification.
 * Aligned with SKILL-GROUPS.md domains + episodic tag vocabulary.
 */
const DOMAIN_KEYWORDS: [string, RegExp][] = [
  [
    "cognitive",
    /\b(meditation|dream|synapse|self-actualization|awareness|memory|brain|architecture health|cognitive|meta-cognitive)\b/i,
  ],
  [
    "code-quality",
    /\b(test|debug|refactor|code review|lint|error|bug fix|root cause|security review|performance)\b/i,
  ],
  [
    "vscode",
    /\b(extension|vscode|command palette|webview|chat participant|marketplace|vsix|activation)\b/i,
  ],
  [
    "azure",
    /\b(azure|bicep|container app|app service|cosmos|keyvault|entra|deployment|infrastructure)\b/i,
  ],
  [
    "data",
    /\b(chart|dashboard|visualization|data analysis|data storytelling|EDA|KPI|pandas|spark)\b/i,
  ],
  [
    "ai-ml",
    /\b(prompt engineering|rag|llm|agent design|model selection|openai|replicate|flux|finetune)\b/i,
  ],
  [
    "design",
    /\b(brand|ui\/ux|graphic|svg|css|layout|color|typography|accessibility|banner)\b/i,
  ],
  [
    "documentation",
    /\b(readme|changelog|doc hygiene|markdown|mermaid|word|pandoc|documentation)\b/i,
  ],
  [
    "m365",
    /\b(teams|graph api|sharepoint|onedrive|m365|copilot agent|cowork|outlook)\b/i,
  ],
  [
    "devops",
    /\b(ci\/cd|pipeline|release|publish|deploy|git workflow|docker|build)\b/i,
  ],
  [
    "enterprise",
    /\b(msal|auth|oauth|credential|secret|compliance|governance|stakeholder)\b/i,
  ],
  [
    "research",
    /\b(literature review|citation|grant|academic|research|bootstrap learning|empirical)\b/i,
  ],
  [
    "communication",
    /\b(presentation|slide|storytelling|executive|meeting|coaching|cross-cultural)\b/i,
  ],
  [
    "creative",
    /\b(writing|character|fiction|narrative|comedy|journalism|game design)\b/i,
  ],
];

interface DomainEntry {
  file: string;
  title: string;
  domains: string[];
  date?: string;
  keyInsights: string[];
}

interface DomainPair {
  domainA: string;
  domainB: string;
  entriesA: DomainEntry[];
  entriesB: DomainEntry[];
  existingSynapseCount: number;
}

/**
 * Cross-Domain Pattern Synthesis Tool
 *
 * Analyzes episodic memories across different knowledge domains to surface
 * unexpected connections between previously unrelated areas. Used during
 * meditation to evolve from consolidation to generation.
 */
export class CrossDomainSynthesisTool implements vscode.LanguageModelTool<ICrossDomainSynthesisParams> {
  async prepareInvocation(
    _options: vscode.LanguageModelToolInvocationPrepareOptions<ICrossDomainSynthesisParams>,
    _token: vscode.CancellationToken,
  ): Promise<vscode.PreparedToolInvocation | undefined> {
    return {
      invocationMessage:
        "Analyzing cross-domain patterns in episodic memories...",
    };
  }

  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<ICrossDomainSynthesisParams>,
    token: vscode.CancellationToken,
  ): Promise<vscode.LanguageModelToolResult> {
    assertDefined(options, "Tool invocation options required");
    assertDefined(token, "CancellationToken required");

    vscode.commands.executeCommand("alex.setCognitiveState", "meditation");

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart("No workspace folder open."),
      ]);
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const maxEntries = options.input.maxEntries ?? 50;

    // Phase 1: Read and classify episodic memories
    const entries = await this.readEpisodicMemories(
      rootPath,
      maxEntries,
      token,
    );
    if (token.isCancellationRequested) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart("Operation cancelled."),
      ]);
    }

    if (entries.length === 0) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          "No episodic memories found in .github/episodic/. Run meditation sessions first to build episodic memory.",
        ),
      ]);
    }

    // Phase 2: Build domain index
    const domainIndex = this.buildDomainIndex(entries);

    // Phase 3: Read existing synapse connections between skills
    const synapseMatrix = await this.buildSynapseMatrix(rootPath, token);

    // Phase 4: Find under-connected domain pairs
    const gaps = this.findDomainGaps(domainIndex, synapseMatrix);

    // Phase 5: Build synthesis report
    const report = this.buildReport(
      entries,
      domainIndex,
      gaps,
      options.input.focusDomain,
    );

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(report),
    ]);
  }

  /**
   * Read episodic files from .github/episodic/ and extract domain-relevant content
   */
  private async readEpisodicMemories(
    rootPath: string,
    maxEntries: number,
    token: vscode.CancellationToken,
  ): Promise<DomainEntry[]> {
    const episodicDir = path.join(rootPath, ".github", "episodic");
    if (!(await workspaceFs.pathExists(episodicDir))) {
      return [];
    }

    const dirEntries = await workspaceFs.readDirectory(episodicDir);
    const mdFiles = dirEntries
      .filter(
        ([name, type]) => type === vscode.FileType.File && name.endsWith(".md"),
      )
      .map(([name]) => name)
      .sort()
      .reverse() // newest first (filenames are date-stamped)
      .slice(0, maxEntries);

    const results: DomainEntry[] = [];
    for (const filename of mdFiles) {
      if (token.isCancellationRequested) {
        break;
      }
      const filePath = path.join(episodicDir, filename);
      try {
        const content = await workspaceFs.readFile(filePath);
        const entry = this.parseEpisodicFile(filename, content);
        if (entry.domains.length > 0) {
          results.push(entry);
        }
      } catch {
        // Skip unreadable files
      }
    }
    return results;
  }

  /**
   * Parse a single episodic file to extract title, domains, and key insights
   */
  private parseEpisodicFile(filename: string, content: string): DomainEntry {
    // Extract title from first H1
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch
      ? titleMatch[1].trim()
      : filename.replace(/\.md$/, "");

    // Extract date from filename pattern: *-YYYY-MM-DD-*
    const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : undefined;

    // Classify domains from full content
    const domains = this.classifyDomains(content);

    // Extract key insights (look for sections with "Insight", "Pattern", "Key", "Lesson")
    const keyInsights: string[] = [];
    const insightPatterns = [
      /^###?\s+.*(?:insight|pattern|lesson|discovery|breakthrough|learning).*$/gim,
      /^\d+\.\s+\*\*(.+?)\*\*/gm, // numbered bold items
      /^-\s+\*\*(.+?)\*\*:?\s+(.+)/gm, // bold bullet points with descriptions
    ];

    for (const pattern of insightPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const insight = (match[1] || match[0]).replace(/^#+\s*/, "").trim();
        if (insight.length > 10 && insight.length < 200) {
          keyInsights.push(insight);
        }
        if (keyInsights.length >= 5) {
          break;
        }
      }
      if (keyInsights.length >= 5) {
        break;
      }
    }

    return { file: filename, title, domains, date, keyInsights };
  }

  /**
   * Classify text into domain categories
   */
  private classifyDomains(text: string): string[] {
    const matched: string[] = [];
    for (const [domain, pattern] of DOMAIN_KEYWORDS) {
      if (pattern.test(text)) {
        matched.push(domain);
      }
    }
    return matched;
  }

  /**
   * Build index: domain -> list of entries touching that domain
   */
  private buildDomainIndex(entries: DomainEntry[]): Map<string, DomainEntry[]> {
    const index = new Map<string, DomainEntry[]>();
    for (const entry of entries) {
      for (const domain of entry.domains) {
        const list = index.get(domain) || [];
        list.push(entry);
        index.set(domain, list);
      }
    }
    return index;
  }

  /**
   * Build adjacency matrix of existing synapse connections between skill domains.
   * Reads all synapses.json files and maps source->target skill domains.
   */
  private async buildSynapseMatrix(
    rootPath: string,
    token: vscode.CancellationToken,
  ): Promise<Map<string, number>> {
    const matrix = new Map<string, number>();
    const skillsDir = path.join(rootPath, ".github", "skills");
    if (!(await workspaceFs.pathExists(skillsDir))) {
      return matrix;
    }

    const skillDirs = await workspaceFs.readDirectory(skillsDir);
    for (const [dirName, type] of skillDirs) {
      if (token.isCancellationRequested) {
        break;
      }
      if (type !== vscode.FileType.Directory) {
        continue;
      }

      const synapsePath = path.join(skillsDir, dirName, "synapses.json");
      if (!(await workspaceFs.pathExists(synapsePath))) {
        continue;
      }

      try {
        const content = await workspaceFs.readFile(synapsePath);
        const data = JSON.parse(content);
        if (!Array.isArray(data.connections)) {
          continue;
        }

        // Classify source skill domain from the skill name
        const sourceDomains = this.classifyDomains(dirName.replace(/-/g, " "));

        for (const conn of data.connections) {
          if (!conn.target || typeof conn.target !== "string") {
            continue;
          }
          // Extract target skill name from path
          const targetMatch = conn.target.match(/skills\/([^/]+)\//);
          if (!targetMatch) {
            continue;
          }
          const targetDomains = this.classifyDomains(
            targetMatch[1].replace(/-/g, " "),
          );

          // Record cross-domain connections
          for (const sd of sourceDomains) {
            for (const td of targetDomains) {
              if (sd !== td) {
                const key = [sd, td].sort().join("|");
                matrix.set(key, (matrix.get(key) || 0) + 1);
              }
            }
          }
        }
      } catch {
        // Skip invalid JSON
      }
    }
    return matrix;
  }

  /**
   * Find domain pairs that have episodic memories in both domains
   * but few or zero existing synapse connections between them.
   */
  private findDomainGaps(
    domainIndex: Map<string, DomainEntry[]>,
    synapseMatrix: Map<string, number>,
  ): DomainPair[] {
    const domains = Array.from(domainIndex.keys());
    const gaps: DomainPair[] = [];

    for (let i = 0; i < domains.length; i++) {
      for (let j = i + 1; j < domains.length; j++) {
        const domainA = domains[i];
        const domainB = domains[j];
        const key = [domainA, domainB].sort().join("|");
        const synapseCount = synapseMatrix.get(key) || 0;

        const entriesA = domainIndex.get(domainA) || [];
        const entriesB = domainIndex.get(domainB) || [];

        // Both domains must have at least 1 episodic memory
        if (entriesA.length > 0 && entriesB.length > 0) {
          gaps.push({
            domainA,
            domainB,
            entriesA,
            entriesB,
            existingSynapseCount: synapseCount,
          });
        }
      }
    }

    // Sort: fewest existing connections first (biggest opportunities), then by combined entry count
    gaps.sort((a, b) => {
      if (a.existingSynapseCount !== b.existingSynapseCount) {
        return a.existingSynapseCount - b.existingSynapseCount;
      }
      return (
        b.entriesA.length +
        b.entriesB.length -
        (a.entriesA.length + a.entriesB.length)
      );
    });

    return gaps;
  }

  /**
   * Build the synthesis report for LLM consumption
   */
  private buildReport(
    entries: DomainEntry[],
    domainIndex: Map<string, DomainEntry[]>,
    gaps: DomainPair[],
    focusDomain?: string,
  ): string {
    const lines: string[] = [];
    lines.push("## Cross-Domain Pattern Synthesis Report\n");

    // Domain coverage summary
    lines.push("### Domain Coverage\n");
    lines.push("| Domain | Episodic Memories | Key Topics |");
    lines.push("| --- | :---: | --- |");
    for (const [domain, domainEntries] of domainIndex) {
      const topics = domainEntries
        .slice(0, 3)
        .map((e) => e.title.slice(0, 40))
        .join(", ");
      lines.push(`| ${domain} | ${domainEntries.length} | ${topics} |`);
    }

    // Cross-domain gaps (synthesis opportunities)
    const relevantGaps = focusDomain
      ? gaps.filter(
          (g) => g.domainA === focusDomain || g.domainB === focusDomain,
        )
      : gaps;

    const topGaps = relevantGaps.slice(0, 10);

    lines.push(
      "\n### Synthesis Opportunities (Under-Connected Domain Pairs)\n",
    );
    lines.push(
      "Domain pairs with episodic memories in both but few existing skill connections:\n",
    );
    lines.push(
      "| Domain A | Domain B | Existing Connections | Opportunity Score |",
    );
    lines.push("| --- | --- | :---: | :---: |");
    for (const gap of topGaps) {
      // Opportunity = combined episodic evidence / (1 + existing connections)
      const score = (
        (gap.entriesA.length + gap.entriesB.length) /
        (1 + gap.existingSynapseCount)
      ).toFixed(1);
      lines.push(
        `| ${gap.domainA} | ${gap.domainB} | ${gap.existingSynapseCount} | ${score} |`,
      );
    }

    // Detailed candidates for the top 5 gaps
    lines.push("\n### Top Synthesis Candidates\n");
    lines.push(
      "For each under-connected pair, here are the episodic memories to cross-pollinate:\n",
    );

    for (const gap of topGaps.slice(0, 5)) {
      lines.push(
        `#### ${gap.domainA} + ${gap.domainB} (${gap.existingSynapseCount} existing connections)\n`,
      );

      lines.push(`**${gap.domainA} memories:**`);
      for (const e of gap.entriesA.slice(0, 3)) {
        const insights =
          e.keyInsights.length > 0
            ? ` | Insights: ${e.keyInsights.slice(0, 2).join("; ")}`
            : "";
        lines.push(`- ${e.file}: ${e.title}${insights}`);
      }

      lines.push(`\n**${gap.domainB} memories:**`);
      for (const e of gap.entriesB.slice(0, 3)) {
        const insights =
          e.keyInsights.length > 0
            ? ` | Insights: ${e.keyInsights.slice(0, 2).join("; ")}`
            : "";
        lines.push(`- ${e.file}: ${e.title}${insights}`);
      }

      lines.push(
        `\n**Synthesis prompt:** What patterns, techniques, or principles from ${gap.domainA} could create value if applied to ${gap.domainB}, and vice versa?\n`,
      );
    }

    // Multi-domain entries (already bridging domains)
    const bridges = entries.filter((e) => e.domains.length >= 3).slice(0, 5);

    if (bridges.length > 0) {
      lines.push("### Multi-Domain Bridge Sessions\n");
      lines.push(
        "Sessions that already touched 3+ domains (natural integration points):\n",
      );
      for (const b of bridges) {
        lines.push(
          `- **${b.title}** (${b.date || "unknown"}) — domains: ${b.domains.join(", ")}`,
        );
      }
    }

    // Summary stats
    lines.push("\n### Synthesis Summary\n");
    lines.push(`- Total episodic memories analyzed: ${entries.length}`);
    lines.push(`- Domains with coverage: ${domainIndex.size}`);
    lines.push(
      `- Under-connected domain pairs: ${gaps.filter((g) => g.existingSynapseCount === 0).length} (zero connections)`,
    );
    lines.push(
      `- Low-connection pairs (1-2): ${gaps.filter((g) => g.existingSynapseCount > 0 && g.existingSynapseCount <= 2).length}`,
    );
    lines.push(`- Multi-domain bridge sessions: ${bridges.length}`);

    return lines.join("\n");
  }
}
