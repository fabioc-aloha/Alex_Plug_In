#!/usr/bin/env node
/**
 * Knowledge Pack Generator for M365 Agent Builder
 *
 * Reads Master Alex skills, instructions, and agents,
 * strips VS Code-specific content (synapse lines, YAML frontmatter),
 * and consolidates into 20 themed knowledge files for Agent Builder upload.
 *
 * Usage: node pack-knowledge.cjs [--dry-run]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const SKILLS = path.join(ROOT, ".github", "skills");
const INSTRUCTIONS = path.join(ROOT, ".github", "instructions");
const AGENTS = path.join(ROOT, ".github", "agents");
const COWORK = path.join(ROOT, "platforms", "cowork", "Cowork");
const DOCS = path.join(ROOT, "alex_docs");
const OUTPUT = __dirname;

const dryRun = process.argv.includes("--dry-run");

// --- Manifest: 20 knowledge packs -----------------------------------------
const manifest = [
  {
    file: "01-identity-and-mission.md",
    title: "Alex Identity, GCX Mission, and User Profile",
    sources: [
      {
        type: "raw",
        path: path.join(COWORK, "custom-instructions.txt"),
        header: "GCX Coworker Identity",
      },
      {
        type: "raw",
        path: path.join(ROOT, ".github", "NORTH-STAR.md"),
        header: "North Star",
      },
      {
        type: "json",
        path: path.join(ROOT, ".github", "config", "user-profile.json"),
        header: "User Profile",
      },
    ],
  },
  {
    file: "02-cognitive-protocols.md",
    title: "Meta-Cognitive Awareness and Self-Monitoring",
    sources: [
      {
        type: "instruction",
        path: "alex-core.instructions.md",
        header: "Core Cognitive Architecture",
      },
      { type: "skill", name: "awareness" },
      { type: "skill", name: "anti-hallucination" },
      { type: "skill", name: "cognitive-load" },
      { type: "skill", name: "dialog-engineering" },
    ],
  },
  {
    file: "03-research-and-learning.md",
    title: "Research-First Development and Knowledge Acquisition",
    sources: [
      { type: "skill", name: "research-first-development" },
      { type: "skill", name: "bootstrap-learning" },
      { type: "skill", name: "knowledge-synthesis" },
      { type: "skill", name: "learning-psychology" },
      { type: "skill", name: "socratic-questioning" },
    ],
  },
  {
    file: "04-writing-quality.md",
    title: "Writing Quality, AI Tell Avoidance, and Documentation",
    sources: [
      { type: "skill", name: "ai-writing-avoidance" },
      { type: "skill", name: "lint-clean-markdown" },
      { type: "skill", name: "doc-hygiene" },
      { type: "skill", name: "documentation-quality-assurance" },
      { type: "skill", name: "creative-writing" },
    ],
  },
  {
    file: "05-data-analysis.md",
    title: "Data Analysis and Chart Interpretation",
    sources: [
      { type: "skill", name: "data-analysis" },
      { type: "skill", name: "chart-interpretation" },
      { type: "skill", name: "database-design" },
    ],
  },
  {
    file: "06-data-visualization.md",
    title: "Data Visualization and Dashboard Design",
    sources: [
      { type: "skill", name: "data-visualization" },
      { type: "skill", name: "dashboard-design" },
      { type: "skill", name: "graphic-design" },
      { type: "skill", name: "svg-graphics" },
    ],
  },
  {
    file: "07-data-storytelling.md",
    title: "Data Storytelling and Narrative Construction",
    sources: [
      { type: "skill", name: "data-storytelling" },
      { type: "skill", name: "markdown-mermaid" },
    ],
  },
  {
    file: "08-executive-communication.md",
    title: "Executive Storytelling, Status Reporting, and Slide Design",
    sources: [
      { type: "skill", name: "executive-storytelling" },
      { type: "skill", name: "status-reporting" },
      { type: "skill", name: "slide-design" },
    ],
  },
  {
    file: "09-meetings-and-coaching.md",
    title: "Meeting Efficiency, Coaching, and Stakeholder Management",
    sources: [
      { type: "skill", name: "meeting-efficiency" },
      { type: "skill", name: "coaching-techniques" },
      { type: "skill", name: "stakeholder-management" },
      { type: "skill", name: "frustration-recognition" },
    ],
  },
  {
    file: "10-business-analysis.md",
    title: "Business Analysis, Scope, and Change Management",
    sources: [
      { type: "skill", name: "business-analysis" },
      { type: "skill", name: "scope-management" },
      { type: "skill", name: "change-management" },
      { type: "skill", name: "financial-analysis" },
    ],
  },
  {
    file: "11-prompt-engineering.md",
    title: "Prompt Engineering, LLM Selection, and AI Patterns",
    sources: [
      { type: "skill", name: "prompt-engineering" },
      { type: "skill", name: "llm-model-selection" },
      { type: "skill", name: "proactive-assistance" },
      { type: "skill", name: "multi-agent-orchestration" },
    ],
  },
  {
    file: "12-code-development.md",
    title: "Code Review, Debugging, and Root Cause Analysis",
    sources: [
      { type: "skill", name: "code-review" },
      { type: "skill", name: "debugging-patterns" },
      { type: "skill", name: "root-cause-analysis" },
      { type: "skill", name: "error-recovery-patterns" },
    ],
  },
  {
    file: "13-refactoring-and-testing.md",
    title: "Refactoring Patterns, Testing Strategies, and Quality",
    sources: [
      { type: "skill", name: "refactoring-patterns" },
      { type: "skill", name: "testing-strategies" },
      { type: "skill", name: "api-design" },
      { type: "skill", name: "api-documentation" },
    ],
  },
  {
    file: "14-security-and-privacy.md",
    title: "Security Review, Privacy Regulations, and Responsible AI",
    sources: [
      { type: "skill", name: "security-review" },
      { type: "skill", name: "pii-privacy-regulations" },
      { type: "skill", name: "privacy-responsible-ai" },
      { type: "skill", name: "content-safety-implementation" },
    ],
  },
  {
    file: "15-azure-cloud.md",
    title: "Azure Architecture, OpenAI Patterns, and Infrastructure",
    sources: [
      { type: "skill", name: "azure-architecture-patterns" },
      { type: "skill", name: "azure-openai-patterns" },
      { type: "skill", name: "azure-deployment-operations" },
      { type: "skill", name: "infrastructure-as-code" },
      { type: "skill", name: "observability-monitoring" },
    ],
  },
  {
    file: "16-m365-and-graph.md",
    title: "Microsoft Graph API, Teams, and M365 Integration",
    sources: [
      { type: "skill", name: "microsoft-graph-api" },
      { type: "skill", name: "msal-authentication" },
      { type: "skill", name: "microsoft-fabric" },
      { type: "skill", name: "enterprise-integration" },
    ],
  },
  {
    file: "17-presentations.md",
    title: "Presentation Creation, Gamma, and PowerPoint Generation",
    sources: [
      { type: "skill", name: "gamma-presentations" },
      { type: "skill", name: "pptx-generation" },
      { type: "skill", name: "presentation-tool-selection" },
      { type: "skill", name: "book-publishing" },
    ],
  },
  {
    file: "18-project-leadership.md",
    title: "Post-Mortem, Incident Response, and Career Development",
    sources: [
      { type: "skill", name: "post-mortem" },
      { type: "skill", name: "incident-response" },
      { type: "skill", name: "career-development" },
      { type: "skill", name: "deep-work-optimization" },
      { type: "skill", name: "work-life-balance" },
    ],
  },
  {
    file: "19-agent-modes.md",
    title: "Agent Modes: Researcher, Builder, Validator, Documentarian",
    sources: [
      { type: "agent", name: "alex.agent.md" },
      { type: "agent", name: "alex-researcher.agent.md" },
      { type: "agent", name: "alex-builder.agent.md" },
      { type: "agent", name: "alex-validator.agent.md" },
      { type: "agent", name: "alex-documentarian.agent.md" },
      { type: "agent", name: "alex-m365.agent.md" },
    ],
  },
  {
    file: "20-ethical-framework.md",
    title: "Ethical Reasoning, Constitutional AI, and Moral Psychology",
    sources: [
      {
        type: "instruction",
        path: "worldview-constitutional-ai.instructions.md",
        header: "Constitutional AI",
      },
      {
        type: "instruction",
        path: "worldview-moral-psychology.instructions.md",
        header: "Moral Psychology",
      },
      {
        type: "instruction",
        path: "worldview-integration.instructions.md",
        header: "Ethical Reasoning",
      },
      { type: "skill", name: "cognitive-symbiosis" },
    ],
  },
];

// --- Processing Functions --------------------------------------------------

function stripFrontmatter(content) {
  // Remove YAML frontmatter (--- ... ---)
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

function stripSynapses(content) {
  // Remove synapse lines: **Synapse**: [file](path) ...
  return content
    .replace(/^\*\*Synapse\*\*:.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n");
}

function stripVSCodeSpecific(content) {
  // Remove VS Code-specific references that don't apply in M365
  return content
    .replace(/^\*\*applyTo\*\*:.*$/gm, "")
    .replace(/^\*\*excludeAgent\*\*:.*$/gm, "")
    .replace(/See \[.*\.instructions\.md\].*$/gm, "")
    .replace(/\n{3,}/g, "\n\n");
}

function cleanContent(content) {
  let cleaned = stripFrontmatter(content);
  cleaned = stripSynapses(cleaned);
  cleaned = stripVSCodeSpecific(cleaned);
  return cleaned.trim();
}

function readSource(source) {
  let fullPath;
  let header;

  switch (source.type) {
    case "skill":
      fullPath = path.join(SKILLS, source.name, "SKILL.md");
      header = source.name
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      break;
    case "instruction":
      fullPath = path.join(INSTRUCTIONS, source.path);
      header = source.header || source.path.replace(".instructions.md", "");
      break;
    case "agent":
      fullPath = path.join(AGENTS, source.name);
      header = source.name
        .replace(".agent.md", "")
        .replace("alex-", "Alex ")
        .replace("alex", "Alex");
      break;
    case "raw":
      fullPath = source.path;
      header =
        source.header || path.basename(source.path, path.extname(source.path));
      break;
    case "json":
      fullPath = source.path;
      header = source.header || path.basename(source.path, ".json");
      break;
    default:
      console.error(`  [SKIP] Unknown source type: ${source.type}`);
      return null;
  }

  if (!fs.existsSync(fullPath)) {
    console.error(`  [MISS] ${fullPath}`);
    return null;
  }

  let content = fs.readFileSync(fullPath, "utf-8");

  if (source.type === "json") {
    // Format JSON as readable markdown
    try {
      const json = JSON.parse(content);
      const lines = [`## ${header}`, ""];
      for (const [key, value] of Object.entries(json)) {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          lines.push(`- **${key}**: ${value}`);
        } else if (Array.isArray(value)) {
          lines.push(
            `- **${key}**: ${value.slice(0, 15).join(", ")}${value.length > 15 ? "..." : ""}`,
          );
        } else if (typeof value === "object" && value !== null) {
          lines.push(`- **${key}**:`);
          for (const [k2, v2] of Object.entries(value)) {
            if (typeof v2 === "string" || typeof v2 === "number") {
              lines.push(`  - ${k2}: ${v2}`);
            }
          }
        }
      }
      return lines.join("\n");
    } catch {
      return `## ${header}\n\n${content}`;
    }
  }

  content = cleanContent(content);

  // Ensure the content starts with a proper heading
  if (!content.startsWith("# ")) {
    content = `## ${header}\n\n${content}`;
  }

  return content;
}

// --- Main ------------------------------------------------------------------

console.log("=== Alex Knowledge Pack Generator ===\n");
console.log(`Skills dir:  ${SKILLS}`);
console.log(`Output dir:  ${OUTPUT}`);
console.log(`Mode:        ${dryRun ? "DRY RUN" : "GENERATE"}\n`);

let totalSize = 0;
let totalSources = 0;
let missingCount = 0;
const results = [];

for (const pack of manifest) {
  console.log(`\n[${pack.file}] ${pack.title}`);

  const sections = [];
  let sourceCount = 0;

  for (const source of pack.sources) {
    const content = readSource(source);
    if (content) {
      sections.push(content);
      sourceCount++;
      const label = source.name || source.path || path.basename(source.path);
      console.log(`  [OK] ${label}`);
    } else {
      missingCount++;
    }
  }

  const header = `# ${pack.title}\n\n> Knowledge pack for M365 Agent Builder | Generated ${new Date().toISOString().split("T")[0]}\n\n---\n\n`;
  const body = sections.join("\n\n---\n\n");
  const output = header + body + "\n";

  const sizeKB = (Buffer.byteLength(output, "utf-8") / 1024).toFixed(1);
  totalSize += parseFloat(sizeKB);
  totalSources += sourceCount;

  console.log(`  => ${sizeKB} KB, ${sourceCount} sources`);

  results.push({ file: pack.file, size: sizeKB, sources: sourceCount });

  if (!dryRun) {
    fs.writeFileSync(path.join(OUTPUT, pack.file), output, "utf-8");
  }
}

console.log("\n=== Summary ===");
console.log(`Files:    ${results.length}`);
console.log(`Sources:  ${totalSources}`);
console.log(`Missing:  ${missingCount}`);
console.log(`Total:    ${totalSize.toFixed(1)} KB`);
console.log("");

// Size report table
console.log("File                              | Size    | Sources");
console.log("----------------------------------|---------|--------");
for (const r of results) {
  const padFile = r.file.padEnd(34);
  const padSize = `${r.size} KB`.padStart(7);
  console.log(`${padFile}| ${padSize} | ${r.sources}`);
}

if (dryRun) {
  console.log("\n[DRY RUN] No files written. Remove --dry-run to generate.");
}
