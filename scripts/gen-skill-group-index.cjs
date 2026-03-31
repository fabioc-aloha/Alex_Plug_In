/**
 * gen-skill-group-index.cjs
 * Sprint 1 P1: Generate a skill group index that maps skills by domain and tier.
 *
 * Outputs: alex_docs/skills/SKILL-GROUPS.md
 *
 * Usage: node scripts/gen-skill-group-index.cjs
 */

const fs = require("fs");
const path = require("path");

const SKILLS_DIR = path.join(__dirname, "..", ".github", "skills");
const OUTPUT = path.join(
  __dirname,
  "..",
  "alex_docs",
  "skills",
  "SKILL-GROUPS.md",
);

// ============================================================================
// Domain Classification
// ============================================================================

const DOMAIN_MAP = {
  // Cognitive / Identity
  cognitive: [
    "anti-hallucination",
    "appropriate-reliance",
    "awareness",
    "cognitive-load",
    "cognitive-symbiosis",
    "dialog-engineering",
    "dream-state",
    "frustration-recognition",
    "learning-psychology",
    "meditation",
    "memory-activation",
    "memory-curation",
    "memory-export",
    "north-star",
    "persona-detection",
    "proactive-assistance",
    "self-actualization",
    "socratic-questioning",
    "architecture-health",
    "architecture-refinement",
    "knowledge-synthesis",
    "global-knowledge",
    "global-knowledge-sync",
    "skill-building",
    "skill-development",
    "token-waste-elimination",
    "brain-qa",
  ],
  // Code Quality / Development
  "code-quality": [
    "api-design",
    "code-review",
    "debugging-patterns",
    "error-recovery-patterns",
    "git-workflow",
    "lint-clean-markdown",
    "refactoring-patterns",
    "root-cause-analysis",
    "security-review",
    "testing-strategies",
    "doc-hygiene",
    "documentation-quality-assurance",
    "performance-profiling",
    "architecture-audit",
  ],
  // VS Code / Extension Dev
  vscode: [
    "vscode-extension-patterns",
    "vscode-configuration-validation",
    "vscode-environment",
    "chat-participant-patterns",
    "agent-debug-panel",
    "extension-audit-methodology",
    "release-preflight",
    "release-process",
  ],
  // Azure / Cloud
  azure: [
    "azure-architecture-patterns",
    "azure-deployment-operations",
    "azure-devops-automation",
    "azure-openai-patterns",
    "bicep-avm-mastery",
    "infrastructure-as-code",
    "content-safety-implementation",
    "observability-monitoring",
  ],
  // Data / Analytics
  data: [
    "chart-interpretation",
    "dashboard-design",
    "data-analysis",
    "data-quality-monitoring",
    "data-storytelling",
    "data-visualization",
    "database-design",
    "microsoft-fabric",
    "fabric-notebook-publish",
  ],
  // AI / ML
  "ai-ml": [
    "ai-agent-design",
    "llm-model-selection",
    "mcp-development",
    "multi-agent-orchestration",
    "prompt-engineering",
    "prompt-evolution-system",
    "rag-architecture",
    "foundry-agent-platform",
  ],
  // Image / Visual
  visual: [
    "ai-character-reference-generation",
    "ai-generated-readme-banners",
    "brand-asset-management",
    "character-aging-progression",
    "correax-brand",
    "flux-brand-finetune",
    "graphic-design",
    "image-handling",
    "svg-graphics",
    "terminal-image-rendering",
    "visual-memory",
  ],
  // Document Conversion
  conversion: [
    "converter-qa",
    "docx-to-md",
    "md-scaffold",
    "md-to-eml",
    "md-to-html",
    "md-to-word",
    "nav-inject",
    "book-publishing",
    "pptx-generation",
  ],
  // M365 / Enterprise
  m365: [
    "enterprise-integration",
    "microsoft-graph-api",
    "msal-authentication",
    "m365-agent-debugging",
    "teams-app-patterns",
  ],
  // Presentation
  presentation: [
    "gamma-presentations",
    "presentation-tool-selection",
    "slide-design",
    "executive-storytelling",
  ],
  // Project / Process
  project: [
    "alex-effort-estimation",
    "change-management",
    "incident-response",
    "meeting-efficiency",
    "project-deployment",
    "project-management",
    "project-scaffolding",
    "scope-management",
    "stakeholder-management",
    "status-reporting",
    "deep-work-optimization",
    "post-mortem",
  ],
  // Research / Academic
  research: [
    "academic-research",
    "airs-appropriate-reliance",
    "bootstrap-learning",
    "citation-management",
    "dissertation-defense",
    "grant-writing",
    "literature-review",
    "practitioner-research",
    "research-first-development",
    "research-project-scaffold",
  ],
  // Writing / Communication
  writing: [
    "ai-writing-avoidance",
    "api-documentation",
    "comedy-writing",
    "creative-writing",
    "journalism",
    "markdown-mermaid",
    "ascii-art-alignment",
    "text-to-speech",
  ],
  // Professional / Domain
  professional: [
    "business-analysis",
    "career-development",
    "coaching-techniques",
    "counseling-psychology",
    "cross-cultural-collaboration",
    "financial-analysis",
    "healthcare-informatics",
    "hr-people-operations",
    "legal-compliance",
    "pii-privacy-regulations",
    "privacy-responsible-ai",
    "sales-enablement",
    "work-life-balance",
  ],
  // Web / Frontend
  web: [
    "react-vite-performance",
    "service-worker-offline-first",
    "sse-streaming",
    "ui-ux-design",
    "localization",
  ],
  // Security / Safety
  security: ["distribution-security", "secrets-management"],
  // Meta / Internal
  meta: [
    "heir-sync-management",
    "skill-catalog-generator",
    "muscle-memory-recognition",
    "rubber-duck-debugging",
    "game-design",
  ],
};

// ============================================================================
// Read Skill Metadata
// ============================================================================

function readSkillMeta(skillName) {
  const skillFile = path.join(SKILLS_DIR, skillName, "SKILL.md");
  if (!fs.existsSync(skillFile)) return null;

  const content = fs.readFileSync(skillFile, "utf-8");
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return null;

  const fm = fmMatch[1];
  const desc = fm.match(/description:\s*["']?(.+?)["']?\s*$/m);
  const tier = fm.match(/tier:\s*(\w+)/);

  return {
    name: skillName,
    description: desc ? desc[1] : "",
    tier: tier ? tier[1] : "standard",
  };
}

// ============================================================================
// Generate Output
// ============================================================================

const allSkills = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => readSkillMeta(d.name))
  .filter(Boolean);

const skillMap = new Map(allSkills.map((s) => [s.name, s]));

const lines = [
  "# Skill Group Index",
  "",
  `> Auto-generated by \`scripts/gen-skill-group-index.cjs\` | ${allSkills.length} skills across ${Object.keys(DOMAIN_MAP).length} domains`,
  "",
  "## Distribution",
  "",
  `| Tier | Count |`,
  `| --- | --- |`,
  `| Core | ${allSkills.filter((s) => s.tier === "core").length} |`,
  `| Standard | ${allSkills.filter((s) => s.tier === "standard").length} |`,
  `| Extended | ${allSkills.filter((s) => s.tier === "extended").length} |`,
  "",
];

// Assign skills that are in allSkills but not in any domain to "uncategorized"
const assigned = new Set(Object.values(DOMAIN_MAP).flat());
const uncategorized = allSkills
  .filter((s) => !assigned.has(s.name))
  .map((s) => s.name);

for (const [domain, skills] of Object.entries(DOMAIN_MAP)) {
  const resolved = skills
    .map((name) => skillMap.get(name))
    .filter(Boolean)
    .sort((a, b) => {
      const tierOrder = { core: 0, standard: 1, extended: 2 };
      return (
        (tierOrder[a.tier] || 1) - (tierOrder[b.tier] || 1) ||
        a.name.localeCompare(b.name)
      );
    });

  if (resolved.length === 0) continue;

  lines.push(
    `### ${domain.charAt(0).toUpperCase() + domain.slice(1).replace(/-/g, " ")} (${resolved.length})`,
  );
  lines.push("");
  lines.push("| Skill | Tier | Description |");
  lines.push("| --- | --- | --- |");

  for (const skill of resolved) {
    const tierBadge = skill.tier === "core" ? "**core**" : skill.tier;
    lines.push(`| ${skill.name} | ${tierBadge} | ${skill.description} |`);
  }

  lines.push("");
}

if (uncategorized.length > 0) {
  lines.push(`### Uncategorized (${uncategorized.length})`);
  lines.push("");
  lines.push("| Skill | Tier | Description |");
  lines.push("| --- | --- | --- |");
  for (const name of uncategorized) {
    const s = skillMap.get(name);
    if (s) lines.push(`| ${s.name} | ${s.tier} | ${s.description} |`);
  }
  lines.push("");
}

// Ensure output dir exists
const outDir = path.dirname(OUTPUT);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(OUTPUT, lines.join("\n"), "utf-8");
console.log(`[OK] Wrote ${OUTPUT}`);
console.log(
  `     ${allSkills.length} skills, ${Object.keys(DOMAIN_MAP).length} domains`,
);
