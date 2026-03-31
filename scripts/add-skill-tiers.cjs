/**
 * add-skill-tiers.cjs
 * Sprint 1 P1: Add tier classification to all SKILL.md frontmatter.
 *
 * Tiers:
 *   core     - Always loaded (~21 skills). Cognitive foundation, essential dev workflow.
 *   standard - Loaded on keyword/pattern match (~85 skills). Common domain skills.
 *   extended - Loaded on explicit request only (~52 skills). Niche/specialized.
 *
 * Usage: node scripts/add-skill-tiers.cjs [--dry-run]
 */

const fs = require("fs");
const path = require("path");

const SKILLS_DIR = path.join(__dirname, "..", ".github", "skills");

// ============================================================================
// Tier Assignments
// ============================================================================

const CORE_SKILLS = new Set([
  "anti-hallucination",
  "appropriate-reliance",
  "awareness",
  "code-review",
  "cognitive-load",
  "debugging-patterns",
  "dialog-engineering",
  "doc-hygiene",
  "error-recovery-patterns",
  "frustration-recognition",
  "git-workflow",
  "lint-clean-markdown",
  "memory-activation",
  "north-star",
  "persona-detection",
  "proactive-assistance",
  "refactoring-patterns",
  "root-cause-analysis",
  "security-review",
  "testing-strategies",
  "vscode-extension-patterns",
]);

const EXTENDED_SKILLS = new Set([
  "academic-research",
  "airs-appropriate-reliance",
  "alex-effort-estimation",
  "ascii-art-alignment",
  "bicep-avm-mastery",
  "book-publishing",
  "career-development",
  "character-aging-progression",
  "citation-management",
  "coaching-techniques",
  "cognitive-symbiosis",
  "comedy-writing",
  "converter-qa",
  "correax-brand",
  "counseling-psychology",
  "cross-cultural-collaboration",
  "deep-work-optimization",
  "dissertation-defense",
  "docx-to-md",
  "fabric-notebook-publish",
  "financial-analysis",
  "flux-brand-finetune",
  "foundry-agent-platform",
  "game-design",
  "grant-writing",
  "graphic-design",
  "healthcare-informatics",
  "hr-people-operations",
  "journalism",
  "legal-compliance",
  "literature-review",
  "localization",
  "md-to-eml",
  "md-scaffold",
  "memory-export",
  "nav-inject",
  "pii-privacy-regulations",
  "post-mortem",
  "practitioner-research",
  "pptx-generation",
  "research-project-scaffold",
  "rubber-duck-debugging",
  "sales-enablement",
  "service-worker-offline-first",
  "skill-catalog-generator",
  "slide-design",
  "socratic-questioning",
  "sse-streaming",
  "terminal-image-rendering",
  "text-to-speech",
  "visual-memory",
  "work-life-balance",
]);

function getTier(skillName) {
  if (CORE_SKILLS.has(skillName)) return "core";
  if (EXTENDED_SKILLS.has(skillName)) return "extended";
  return "standard";
}

// ============================================================================
// Frontmatter Manipulation
// ============================================================================

function addTierToFrontmatter(content, tier) {
  // Match YAML frontmatter between --- delimiters
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) {
    console.warn("  [WARN] No YAML frontmatter found");
    return null;
  }

  const frontmatter = fmMatch[1];

  // Skip if tier already present
  if (/^tier:/m.test(frontmatter)) {
    return null; // Already has tier
  }

  // Insert tier after description line
  const descMatch = frontmatter.match(/(description:.*)/);
  if (!descMatch) {
    console.warn("  [WARN] No description field found in frontmatter");
    return null;
  }

  const updatedFm = frontmatter.replace(
    descMatch[1],
    `${descMatch[1]}\ntier: ${tier}`,
  );

  return content.replace(fmMatch[1], updatedFm);
}

// ============================================================================
// Main
// ============================================================================

const dryRun = process.argv.includes("--dry-run");

const skillDirs = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const stats = { core: 0, standard: 0, extended: 0, skipped: 0, errors: 0 };

for (const skillName of skillDirs) {
  const skillFile = path.join(SKILLS_DIR, skillName, "SKILL.md");
  if (!fs.existsSync(skillFile)) {
    console.log(`  [SKIP] ${skillName} - no SKILL.md`);
    stats.skipped++;
    continue;
  }

  const tier = getTier(skillName);
  const content = fs.readFileSync(skillFile, "utf-8");
  const updated = addTierToFrontmatter(content, tier);

  if (updated === null) {
    // Already has tier or no frontmatter
    if (/^tier:/m.test(content)) {
      console.log(`  [SKIP] ${skillName} - already has tier`);
    }
    stats.skipped++;
    continue;
  }

  if (dryRun) {
    console.log(`  [DRY]  ${skillName} -> ${tier}`);
  } else {
    fs.writeFileSync(skillFile, updated, "utf-8");
    console.log(`  [OK]   ${skillName} -> ${tier}`);
  }

  stats[tier]++;
}

console.log("\n--- Summary ---");
console.log(`Core:     ${stats.core}`);
console.log(`Standard: ${stats.standard}`);
console.log(`Extended: ${stats.extended}`);
console.log(`Skipped:  ${stats.skipped}`);
console.log(`Errors:   ${stats.errors}`);
if (dryRun) console.log("\n(Dry run - no files changed)");
