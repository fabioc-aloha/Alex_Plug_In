/**
 * Sync Architecture Script
 *
 * Copies inheritable cognitive architecture files from Master Alex (root .github/)
 * to the VS Code extension heir (platforms/vscode-extension/.github/).
 *
 * EXCLUSION-BASED approach:
 * - Skills: ALL sync by default. Excluded via SKILL_EXCLUSIONS map OR SKILL.md frontmatter
 *   (inheritance: master-only | heir:m365 | heir:vscode). Central map takes priority.
 * - Root files: ALL .md files sync by default. Only files in EXCLUDED_ROOT_FILES are skipped.
 * - Folders: Explicit list (ARCHITECTURE_FOLDERS) with per-folder exclusions.
 * - chatSkills: Auto-generated from heir disk after sync -- no manual updates needed.
 *
 * Exclusion categories:
 * - master-only: Stays in master only
 * - heir:m365: Wrong heir (targets M365 Copilot)
 * - heir:vscode: Heir maintains its own version, don't overwrite
 *
 * HEIR DECONTAMINATION:
 * After copying, applies heir-specific transformations to remove master-only
 * content (instrumentation comments, master Active Context values, Heirs section,
 * master-only safety imperatives I1-I4/I7, PII).
 * See applyHeirTransformations() for details.
 *
 * FORMAT: v3-identity-first (ADR-010)
 *
 * Run: npm run sync-architecture
 * Auto-runs: During vscode:prepublish
 */

const fs = require("fs");
const path = require("path");

// Paths relative to this script location (.github/muscles/)
const SCRIPT_DIR = __dirname;
const MASTER_ROOT = path.resolve(SCRIPT_DIR, "..", ".."); // From .github/muscles to project root
const HEIR_ROOT = path.join(MASTER_ROOT, "platforms", "vscode-extension");

const MASTER_GITHUB = path.join(MASTER_ROOT, ".github");
const HEIR_GITHUB = path.join(HEIR_ROOT, ".github");

const MASTER_SKILLS = path.join(MASTER_GITHUB, "skills");
const HEIR_SKILLS = path.join(HEIR_GITHUB, "skills");

// Folders to sync (non-skill architecture files)
// NOTE: ISSUE_TEMPLATE/ and pull_request_template.md are GitHub-repo-only, NOT synced to heirs
const ARCHITECTURE_FOLDERS = [
  "instructions",
  "prompts",
  "config",
  "agents",
  "assets",
  "muscles",
];

// Folders to create empty in heir (populated at runtime)
const EMPTY_HEIR_FOLDERS = ["episodic"];

// Root .github files that must NOT be synced to heir
// Everything else (*.md) in .github root IS synced automatically.
const EXCLUDED_ROOT_FILES = [
  "pull_request_template.md", // GitHub repo template -- not relevant to packaged extension
];

// ============================================================
// SKILL EXCLUSIONS: Central map of skills that deviate from default sync
// ============================================================
// Default behavior: ALL skills sync from master -> heir.
// Only skills listed here are excluded or handled specially.
// This replaces per-skill synapses.json 'inheritance' field.
const SKILL_EXCLUSIONS = {
  // master-only: skill only makes sense in master Alex, never synced
  "heir-sync-management": "master-only",
  "release-process": "master-only", // PAT handling, marketplace credentials, platforms/ paths
  "release-preflight": "master-only", // platforms/vscode-extension paths, ROADMAP
  "extension-audit-methodology": "master-only", // master audit methodology, alex_docs/audits
  "skill-catalog-generator": "master-only", // master catalog generation

  // heir:m365: skill targets the M365 Copilot heir, not VS Code extension
  "m365-agent-debugging": "heir:m365",
  "teams-app-patterns": "heir:m365",

  // heir:vscode: heir maintains its own version, don't overwrite from master
  "azure-architecture-patterns": "heir:vscode",
  "azure-devops-automation": "heir:vscode",
  "chat-participant-patterns": "heir:vscode",
  "enterprise-integration": "heir:vscode",
  "persona-detection": "heir:vscode",
  "vscode-configuration-validation": "heir:vscode",
  "vscode-extension-patterns": "heir:vscode",
};

function getMarkdownFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) {
    return "";
  }

  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : "";
}

function getMarkdownInheritance(filePath) {
  const frontmatter = getMarkdownFrontmatter(filePath);
  if (!frontmatter) {
    return null;
  }

  const match = frontmatter.match(
    /^inheritance:\s*["']?([^"'\r\n]+)["']?\s*$/m,
  );
  return match ? match[1].trim() : null;
}

function getFrontmatterExcludedMarkdownFiles(
  dirPath,
  excludedInheritance = ["master-only"],
) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".md"))
    .filter((file) => {
      const inheritance = getMarkdownInheritance(path.join(dirPath, file));
      return inheritance && excludedInheritance.includes(inheritance);
    });
}

// ============================================================
// INSTRUCTION & PROMPT EXCLUSIONS: Frontmatter-driven exclusions
// ============================================================
// Exclude files with inheritance: master-only OR heir:m365 from the vscode heir.
// heir:m365 files target the M365 Copilot heir, not the VS Code extension.
const EXCLUDED_INHERITANCE_TYPES = ["master-only", "heir:m365"];

const EXCLUDED_INSTRUCTIONS = getFrontmatterExcludedMarkdownFiles(
  path.join(MASTER_GITHUB, "instructions"),
  EXCLUDED_INHERITANCE_TYPES,
);

const EXCLUDED_PROMPTS = getFrontmatterExcludedMarkdownFiles(
  path.join(MASTER_GITHUB, "prompts"),
  EXCLUDED_INHERITANCE_TYPES,
);

// ============================================================
// HEIR PROTECTION: Files that must NEVER be copied to heir
// ============================================================

// Master-only config files -- contain PII or master-specific state
const EXCLUDED_CONFIG_FILES = [
  "user-profile.json", // PII: legacy location (profile now in AI-Memory). Guard against accidental copies.
  "MASTER-ALEX-PROTECTED.json", // Master kill-switch marker -- must not exist in heir
  "cognitive-config.json", // Master-specific cognitive state
];

// Skill sub-paths that contain PII and must NEVER be copied to heirs.
// After a skill is copied, these files are replaced with a clean empty template.
// Format: { [skillName]: Array<{ subPath: string, template: string }> }
const SKILL_PII_SUBPATHS = {
  "visual-memory": [
    {
      // visual-memory.json may contain base64-encoded reference photos (PII).
      // Heirs receive an empty template -- they populate their own.
      subPath: "visual-memory/visual-memory.json",
      template:
        JSON.stringify(
          {
            schema: "visual-memory-v1",
            _comment:
              "Populate this file with your project's reference subjects. Photos should be resized to 512px @ 85% JPEG quality before base64-encoding. See SKILL.md for preparation instructions.",
            generated: "",
            subjects: {
              _template_subject: {
                _comment:
                  "Rename this key to your subject's name (e.g., 'alex', 'fabio'). Remove _template_ prefix.",
                description: "Brief visual description of the subject",
                ageInfo: {
                  referenceAge: 0,
                  birthYear: 0,
                  photoDate: "YYYY-MM",
                },
                images: [
                  {
                    filename: "subject-1.jpg",
                    dataUri:
                      "data:image/jpeg;base64,<encode your 512px photo here>",
                    notes: "Front-facing, natural lighting",
                  },
                  {
                    filename: "subject-2.jpg",
                    dataUri:
                      "data:image/jpeg;base64,<encode your 512px photo here>",
                    notes: "3/4 profile, varied lighting",
                  },
                ],
              },
            },
            voices: {
              _comment: "Optional: add voice samples for TTS cloning",
              _template_voice: {
                description: "Natural speaking voice",
                audioFile: "visual-memory/voices/sample.wav",
                duration: "10s",
                model: "chatterbox-turbo",
              },
            },
            videoStyles: {
              _comment: "Optional: store consistent motion prompt templates",
              _template_style: {
                description: "Portrait animation style",
                promptTemplate:
                  "Head turns slowly, subtle smile, natural breathing, soft lighting",
                model: "veo-3",
                defaultDuration: 6,
              },
            },
          },
          null,
          2,
        ) + "\n",
    },
  ],
};

// Get excluded muscles from inheritance.json (master-only scripts)
function getExcludedMuscles() {
  const inheritancePath = path.join(
    MASTER_GITHUB,
    "muscles",
    "inheritance.json",
  );
  if (!fs.existsSync(inheritancePath)) {
    console.warn("  [WARN] muscles/inheritance.json not found, using defaults");
    return [
      "sync-architecture.cjs",
      "build-extension-package.ps1",
      "audit-master-alex.ps1",
      "inheritance.json",
    ];
  }
  try {
    const inheritance = JSON.parse(fs.readFileSync(inheritancePath, "utf8"));
    const excluded = ["inheritance.json"]; // Always exclude the inheritance file itself
    for (const [muscle, config] of Object.entries(inheritance.muscles || {})) {
      if (config.inheritance === "master-only") {
        excluded.push(muscle);
      }
    }
    return excluded;
  } catch (e) {
    console.warn(`  [WARN] Could not read inheritance.json: ${e.message}`);
    return [
      "sync-architecture.cjs",
      "build-extension-package.ps1",
      "audit-master-alex.ps1",
      "inheritance.json",
    ];
  }
}

// Synapses in instruction files that reference master-only files.
// Only list files that ARE synced to heir but contain references to master-only paths.
// Files with `inheritance: master-only` or `heir:m365` frontmatter are already excluded
// from heir and do NOT need entries here.
const HEIR_SYNAPSE_REMOVALS = [
  {
    file: "ui-ux-design.instructions.md",
    pattern: /^.*\[alex_docs\/research\/COMMAND-CENTER.*\].*\r?\n/gm,
    reason: "alex_docs/research/ not deployed to heir",
  },
];

function getInheritance(skillName) {
  // Priority: central exclusion map > SKILL.md frontmatter > default 'inheritable'.
  // Central map is the override; frontmatter lets skills self-declare.
  if (SKILL_EXCLUSIONS[skillName]) {
    return SKILL_EXCLUSIONS[skillName];
  }

  // Check SKILL.md frontmatter for self-declared inheritance
  const skillMd = path.join(MASTER_SKILLS, skillName, "SKILL.md");
  const frontmatterInheritance = getMarkdownInheritance(skillMd);
  if (frontmatterInheritance) {
    return frontmatterInheritance;
  }

  return "inheritable";
}

function copyDirRecursive(src, dest, excludeFiles = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    // Skip excluded files
    if (excludeFiles.includes(entry.name)) {
      console.log(`   [SKIP] Excluded: ${entry.name}`);
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, excludeFiles);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function syncSkills() {
  console.log("\n[SKILLS] Syncing skills from Master to Heir...\n");

  const stats = {
    copied: [],
    skippedMasterOnly: [],
    skippedHeirSpecific: [],
    skippedM365: [],
  };

  // Get all master skills
  const masterSkillDirs = fs
    .readdirSync(MASTER_SKILLS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const skillName of masterSkillDirs) {
    const masterSkillPath = path.join(MASTER_SKILLS, skillName);
    const heirSkillPath = path.join(HEIR_SKILLS, skillName);
    const inheritance = getInheritance(skillName);

    switch (inheritance) {
      case "master-only":
        stats.skippedMasterOnly.push(skillName);
        break;
      case "heir:m365":
        stats.skippedM365.push(skillName);
        break;
      case "heir:vscode":
        // Heir-specific skills should already be in heir, don't overwrite
        stats.skippedHeirSpecific.push(skillName);
        break;
      case "inheritable":
      case "universal":
      default: {
        // Copy to heir
        if (fs.existsSync(heirSkillPath)) {
          fs.rmSync(heirSkillPath, { recursive: true });
        }
        copyDirRecursive(masterSkillPath, heirSkillPath);

        // Replace PII sub-paths with clean templates
        const piiEntries = SKILL_PII_SUBPATHS[skillName] || [];
        for (const { subPath, template } of piiEntries) {
          const heirSubPath = path.join(heirSkillPath, ...subPath.split("/"));
          if (fs.existsSync(heirSubPath)) {
            fs.writeFileSync(heirSubPath, template, "utf8");
            console.log(`   [PII] Scrubbed: ${skillName}/${subPath}`);
          }
        }

        stats.copied.push(skillName);
        break;
      }
    }
  }

  // Cleanup: remove heir skills that are now excluded (master-only or heir:m365)
  const heirSkillDirs = fs.existsSync(HEIR_SKILLS)
    ? fs
        .readdirSync(HEIR_SKILLS, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
    : [];
  const cleaned = [];
  for (const heirSkill of heirSkillDirs) {
    const inheritance = getInheritance(heirSkill);
    if (inheritance === "master-only" || inheritance === "heir:m365") {
      const heirSkillPath = path.join(HEIR_SKILLS, heirSkill);
      fs.rmSync(heirSkillPath, { recursive: true });
      cleaned.push(heirSkill);
    }
  }

  // Report
  console.log(`[OK] Copied: ${stats.copied.length} skills`);
  if (cleaned.length > 0) {
    console.log(`[CLEAN] Cleaned stale heir skills: ${cleaned.length}`);
    cleaned.forEach((s) => console.log(`   - ${s} (${getInheritance(s)})`));
  }
  if (stats.skippedMasterOnly.length > 0) {
    console.log(
      `[SKIP] Skipped (master-only): ${stats.skippedMasterOnly.length}`,
    );
    stats.skippedMasterOnly.forEach((s) => console.log(`   - ${s}`));
  }
  if (stats.skippedM365.length > 0) {
    console.log(`[SKIP] Skipped (heir:m365): ${stats.skippedM365.length}`);
    stats.skippedM365.forEach((s) => console.log(`   - ${s}`));
  }
  if (stats.skippedHeirSpecific.length > 0) {
    console.log(
      `[SKIP] Skipped (heir:vscode): ${stats.skippedHeirSpecific.length}`,
    );
  }

  return stats;
}

function cleanBrokenSynapseReferences(skippedMasterOnly) {
  console.log(
    "\n[SYNAPSES] Cleaning broken synapse references to master-only resources...\n",
  );

  // Master-only files and paths that shouldn't be referenced in heir
  const masterOnlyPatterns = [
    "ROADMAP.md",
    "alex_docs/", // Documentation folder (master-only)
    "platforms/", // Heir doesn't have platforms/
    "MASTER-ALEX-PROTECTED.json",
    ".github/episodic/", // Episodic memory is empty in heir
    "external:", // External repo references (Global Knowledge)
    "global-knowledge://", // Global Knowledge URIs
    ...EXCLUDED_INSTRUCTIONS, // Instruction files not synced to heir
  ];

  let cleanedCount = 0;
  let totalRemoved = 0;
  const heirSkillDirs = fs
    .readdirSync(HEIR_SKILLS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const skillName of heirSkillDirs) {
    const synapsePath = path.join(HEIR_SKILLS, skillName, "synapses.json");
    if (!fs.existsSync(synapsePath)) continue;

    try {
      const synapse = JSON.parse(fs.readFileSync(synapsePath, "utf8"));
      if (!synapse.connections || !Array.isArray(synapse.connections)) continue;

      const original = synapse.connections.length;
      synapse.connections = synapse.connections.filter((conn) => {
        const target = (conn.target || "").replace(/\\/g, "/");

        // Filter master-only skills (from inheritance classification)
        if (skippedMasterOnly.some((removed) => target.includes(removed))) {
          return false;
        }

        // Filter master-only patterns
        if (masterOnlyPatterns.some((pattern) => target.includes(pattern))) {
          return false;
        }

        // Check if file-based target actually exists in heir
        if (
          target.startsWith(".github/") ||
          target.startsWith("../") ||
          target.startsWith("../../")
        ) {
          let targetPath;
          if (target.startsWith(".github/")) {
            targetPath = path.join(HEIR_ROOT, target);
          } else {
            // Relative from skills/ dir
            targetPath = path.join(HEIR_SKILLS, skillName, target);
          }

          if (!fs.existsSync(targetPath)) {
            return false; // File doesn't exist in heir
          }
        }

        return true;
      });

      const removed = original - synapse.connections.length;
      if (removed > 0) {
        fs.writeFileSync(
          synapsePath,
          JSON.stringify(synapse, null, 2) + "\n",
          "utf8",
        );
        cleanedCount++;
        totalRemoved += removed;
        console.log(`   Cleaned: ${skillName} (removed ${removed} refs)`);
      }
    } catch (e) {
      console.warn(`   [WARN] Could not clean ${synapsePath}: ${e.message}`);
    }
  }

  if (cleanedCount > 0) {
    console.log(
      `\n[OK] Cleaned ${cleanedCount} synapse files (${totalRemoved} references removed)`,
    );
  } else {
    console.log("[OK] No broken references found");
  }
}

/**
 * Normalize backslash paths in heir synapses.json files.
 * Windows-style paths (e.g., "..\\security-review\\SKILL.md") break cross-platform
 * compatibility and confuse validation logic. This pass converts all backslash
 * paths to forward slashes.
 *
 * Targets: ALL heir synapses.json files (including heir:vscode maintained skills)
 */
function normalizeBackslashPaths() {
  console.log(
    "\n[NORMALIZE] Normalizing backslash paths in heir synapses...\n",
  );

  let normalizedCount = 0;
  let pathsFixed = 0;

  if (!fs.existsSync(HEIR_SKILLS)) return;

  const skillDirs = fs
    .readdirSync(HEIR_SKILLS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const skillName of skillDirs) {
    const synapsePath = path.join(HEIR_SKILLS, skillName, "synapses.json");
    if (!fs.existsSync(synapsePath)) continue;

    try {
      let content = fs.readFileSync(synapsePath, "utf8");

      // Count backslash occurrences before normalization
      const backslashCount = (content.match(/\\\\/g) || []).length;
      if (backslashCount === 0) continue;

      // Replace all Windows backslashes with forward slashes in target paths
      // This regex captures escaped backslashes in JSON strings
      content = content.replace(/\\\\/g, "/");

      fs.writeFileSync(synapsePath, content, "utf8");
      normalizedCount++;
      pathsFixed += backslashCount;
      console.log(`   Normalized: ${skillName} (${backslashCount} paths)`);
    } catch (e) {
      console.warn(
        `   [WARN] Could not normalize ${synapsePath}: ${e.message}`,
      );
    }
  }

  if (normalizedCount > 0) {
    console.log(
      `\n[OK] Normalized ${normalizedCount} synapse file(s) (${pathsFixed} backslash path(s) fixed)`,
    );
  } else {
    console.log("[OK] No backslash paths found");
  }
}

function syncArchitectureFolders() {
  console.log("\n[FOLDERS] Syncing architecture folders...\n");

  for (const folder of ARCHITECTURE_FOLDERS) {
    const masterPath = path.join(MASTER_GITHUB, folder);
    const heirPath = path.join(HEIR_GITHUB, folder);

    if (fs.existsSync(masterPath)) {
      if (fs.existsSync(heirPath)) {
        fs.rmSync(heirPath, { recursive: true });
      }

      // Apply file exclusions for specific folders
      let exclusions = [];
      if (folder === "config") exclusions = EXCLUDED_CONFIG_FILES;
      if (folder === "muscles") exclusions = getExcludedMuscles();
      if (folder === "instructions") exclusions = EXCLUDED_INSTRUCTIONS;
      if (folder === "prompts") exclusions = EXCLUDED_PROMPTS;
      copyDirRecursive(masterPath, heirPath, exclusions);

      const count = fs.readdirSync(masterPath).length;
      const excluded = exclusions.length;
      console.log(
        `[OK] ${folder}/ (${count} items${excluded ? `, ${excluded} excluded` : ""})`,
      );

      // Rename heir-specific files after sync (e.g., brain-qa-heir.ps1 -> brain-qa.ps1)
      if (folder === "muscles") {
        const heirRenames = {
          "brain-qa-heir.ps1": "brain-qa.ps1",
          "brain-qa-heir.cjs": "brain-qa.cjs",
        };
        for (const [from, to] of Object.entries(heirRenames)) {
          const fromPath = path.join(heirPath, from);
          const toPath = path.join(heirPath, to);
          if (fs.existsSync(fromPath)) {
            fs.renameSync(fromPath, toPath);
            console.log(`  [RENAME] ${from} -> ${to}`);
          }
        }
      }
    } else {
      console.log(`[WARN] ${folder}/ not found in master`);
    }
  }

  // Create empty folders in heir (populated at runtime by the extension)
  for (const folder of EMPTY_HEIR_FOLDERS) {
    const heirPath = path.join(HEIR_GITHUB, folder);
    if (!fs.existsSync(heirPath)) {
      fs.mkdirSync(heirPath, { recursive: true });
    }
    // Ensure it's empty (remove any leftover files)
    const files = fs.readdirSync(heirPath);
    if (files.length > 0) {
      for (const file of files) {
        fs.rmSync(path.join(heirPath, file), { recursive: true, force: true });
      }
    }
    // Add .gitkeep to preserve empty folder in git
    fs.writeFileSync(path.join(heirPath, ".gitkeep"), "", "utf8");
    console.log(`[EMPTY] ${folder}/ (empty -- populated at runtime)`);
  }
}

function syncArchitectureFiles() {
  console.log("\n[FILES] Syncing architecture files...\n");

  // Exclusion-based: sync ALL .md files from master .github root except those in EXCLUDED_ROOT_FILES
  const rootFiles = fs
    .readdirSync(MASTER_GITHUB)
    .filter(
      (f) =>
        f.endsWith(".md") && fs.statSync(path.join(MASTER_GITHUB, f)).isFile(),
    );

  for (const file of rootFiles) {
    if (EXCLUDED_ROOT_FILES.includes(file)) {
      console.log(`[SKIP] ${file} (excluded)`);
      continue;
    }
    const masterPath = path.join(MASTER_GITHUB, file);
    const heirPath = path.join(HEIR_GITHUB, file);
    fs.copyFileSync(masterPath, heirPath);
    console.log(`[OK] ${file}`);
  }

  // Sync non-md root files that are part of the architecture
  const rootJsonFiles = ["hooks.json"];
  for (const file of rootJsonFiles) {
    const masterPath = path.join(MASTER_GITHUB, file);
    const heirPath = path.join(HEIR_GITHUB, file);
    if (fs.existsSync(masterPath)) {
      fs.copyFileSync(masterPath, heirPath);
      console.log(`[OK] ${file}`);
    }
  }

  // Sync walkthrough media files (referenced by package.json walkthroughs)
  // NOTE: alex_docs/README.md is NOT synced -- the heir maintains its own
  // self-contained mono document (all content inline with anchor navigation)
  // because the master's README.md links to 25+ docs not packaged in the VSIX.
  const walkthroughFiles = [
    {
      src: path.join(MASTER_ROOT, "alex_docs", "WORKING-WITH-ALEX.md"),
      dest: path.join(HEIR_ROOT, "alex_docs", "WORKING-WITH-ALEX.md"),
    },
    {
      src: path.join(
        MASTER_ROOT,
        "alex_docs",
        "architecture",
        "VSCODE-BRAIN-INTEGRATION.md",
      ),
      dest: path.join(
        HEIR_ROOT,
        "alex_docs",
        "architecture",
        "VSCODE-BRAIN-INTEGRATION.md",
      ),
    },
    {
      src: path.join(
        MASTER_ROOT,
        "alex_docs",
        "guides",
        "AGENT-VS-CHAT-COMPARISON.md",
      ),
      dest: path.join(
        HEIR_ROOT,
        "alex_docs",
        "guides",
        "AGENT-VS-CHAT-COMPARISON.md",
      ),
    },
    {
      src: path.join(
        MASTER_ROOT,
        "alex_docs",
        "guides",
        "SKILL-DISCIPLINE-MAP.md",
      ),
      dest: path.join(
        HEIR_ROOT,
        "alex_docs",
        "guides",
        "SKILL-DISCIPLINE-MAP.md",
      ),
    },
  ];
  for (const { src, dest } of walkthroughFiles) {
    if (fs.existsSync(src)) {
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(src, dest);
      const fileName = path.relative(HEIR_ROOT, dest).replace(/\\/g, "/");
      console.log(`[OK] ${fileName} (walkthrough media)`);
    }
  }

  // Sync .claude/ bridge (Claude Code compatibility -- CLAUDE.md + settings.json)
  const masterClaude = path.join(MASTER_ROOT, ".claude");
  const heirClaude = path.join(HEIR_ROOT, ".claude");
  if (fs.existsSync(masterClaude)) {
    if (!fs.existsSync(heirClaude))
      fs.mkdirSync(heirClaude, { recursive: true });
    const claudeFiles = fs
      .readdirSync(masterClaude)
      .filter((f) => fs.statSync(path.join(masterClaude, f)).isFile());
    let claudeCount = 0;
    for (const f of claudeFiles) {
      fs.copyFileSync(path.join(masterClaude, f), path.join(heirClaude, f));
      claudeCount++;
    }
    console.log(`[OK] .claude/ (${claudeCount} files)`);
  }
}

function verifyCounts() {
  console.log("\n[VERIFY] Verifying sync...\n");

  const masterSkillCount = fs
    .readdirSync(MASTER_SKILLS, { withFileTypes: true })
    .filter((d) => d.isDirectory()).length;
  const heirSkillCount = fs
    .readdirSync(HEIR_SKILLS, { withFileTypes: true })
    .filter((d) => d.isDirectory()).length;

  console.log(`Master skills: ${masterSkillCount}`);
  console.log(`Heir skills:   ${heirSkillCount}`);

  // Count expected heir skills (inheritable + universal)
  let expectedHeirCount = 0;
  const masterSkillDirs = fs
    .readdirSync(MASTER_SKILLS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const skillName of masterSkillDirs) {
    const inheritance = getInheritance(skillName);
    if (inheritance === "inheritable" || inheritance === "universal") {
      expectedHeirCount++;
    }
  }

  console.log(`Expected heir: ${expectedHeirCount} (inheritable + universal)`);

  if (heirSkillCount >= expectedHeirCount) {
    console.log("\n[OK] Skill sync verified!\n");
  } else {
    console.error(
      `\n[ERROR] MISMATCH: Heir has ${heirSkillCount} but should have at least ${expectedHeirCount}`,
    );
    process.exit(1);
  }
}

// ============================================================
// HEIR TRANSFORMATIONS: Master -> Heir content adjustments
// ============================================================

function applyHeirTransformations() {
  console.log("\n[TRANSFORM] Applying heir-specific transformations...\n");

  let transformCount = 0;

  // --- Transform copilot-instructions.md (v3-identity-first format) ---
  const copilotPath = path.join(HEIR_GITHUB, "copilot-instructions.md");
  if (fs.existsSync(copilotPath)) {
    let content = fs.readFileSync(copilotPath, "utf8");
    const original = content;
    const diffs = [];

    // 1. Remove INSTRUMENTATION HTML comments (master-only observability)
    const beforeInstr = content;
    content = content.replace(/^<!-- INSTRUMENTATION:.*-->\r?\n/gm, "");
    content = content.replace(/^<!-- Validation:.*-->\r?\n/gm, "");
    if (content !== beforeInstr) diffs.push("instrumentation comments");

    // 2. Reset Active Context to heir defaults
    //    Persona: master value -> detected placeholder
    const beforePersona = content;
    content = content.replace(
      /^(Persona:) .+$/m,
      "$1 Developer (85% confidence)",
    );
    if (content !== beforePersona) diffs.push("persona reset");

    //    Objective: master value -> placeholder
    const beforeObj = content;
    content = content.replace(
      /^(Objective:) .+$/m,
      "$1 *(session-objective -- set by user or focus timer)*",
    );
    if (content !== beforeObj) diffs.push("objective reset");

    //    Focus Trifectas: master value -> generic heir defaults
    const beforeTri = content;
    content = content.replace(
      /^(Focus Trifectas:) .+$/m,
      "$1 code-review, testing-strategies, deep-thinking",
    );
    if (content !== beforeTri) diffs.push("focus trifectas");

    //    Principles: keep as-is (KISS, DRY, Optimize-for-AI is universal)

    //    Recent: master session history -> placeholder
    const beforeRecent = content;
    content = content.replace(
      /^(Recent:) .+$/m,
      "$1 _(updated at runtime by extension)_",
    );
    if (content !== beforeRecent) diffs.push("recent reset");

    //    Guidelines: master-specific path -> generic
    const beforeGuidelines = content;
    content = content.replace(
      /^(Guidelines:) .+$/m,
      "$1 Architecture MUST NOT depend on the Extension (I8). Quality over speed.",
    );
    if (content !== beforeGuidelines) diffs.push("guidelines reset");

    //    Last Assessed: master date -> never
    const beforeAssessed = content;
    content = content.replace(/^(Last Assessed:) .+$/m, "$1 never");
    if (content !== beforeAssessed) diffs.push("last assessed");

    // 3. Remove ## Heirs section (heir doesn't need meta-awareness of other heirs)
    const beforeHeirs = content;
    content = content.replace(/^## Heirs\r?\n[\s\S]*?(?=^## )/m, "");
    if (content !== beforeHeirs) diffs.push("removed Heirs section");

    // 4. Strip Safety Imperatives I1-I4 and I7 (master-only protections)
    //    Keep only I5 (commit) and I6 (one platform)
    const beforeImperatives = content;
    content = content.replace(/^I1:.*\r?\n/m, "");
    content = content.replace(/^I2:.*\r?\n/m, "");
    content = content.replace(/^I3:.*\r?\n/m, "");
    content = content.replace(/^I4:.*\r?\n/m, "");
    content = content.replace(/^I7:.*\r?\n/m, "");
    if (content !== beforeImperatives)
      diffs.push("stripped I1-I4,I7 imperatives");

    // 5. Filter complete trifectas list to only include heir-available skills
    const beforeTrifectas = content;
    const excludedSkillNames = Object.keys(SKILL_EXCLUSIONS);
    content = content.replace(
      /^Complete trifectas \((\d+)\): (.+)$/m,
      (match, count, skillList) => {
        const skills = skillList.split(", ").map((s) => s.trim());
        const filtered = skills.filter((s) => !excludedSkillNames.includes(s));
        return `Complete trifectas (${filtered.length}): ${filtered.join(", ")}`;
      },
    );
    if (content !== beforeTrifectas)
      diffs.push("filtered trifectas to heir-available");

    if (content !== original) {
      fs.writeFileSync(copilotPath, content, "utf8");
      console.log(`[OK] copilot-instructions.md: ${diffs.join(", ")}`);
      transformCount += diffs.length;
    } else {
      console.log(
        "[INFO] copilot-instructions.md: no transformations needed (already heir format)",
      );
    }
  }

  // --- Remove master-only synapses from instruction files ---
  for (const removal of HEIR_SYNAPSE_REMOVALS) {
    const filePath = path.join(HEIR_GITHUB, "instructions", removal.file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf8");
      const newContent = content.replace(removal.pattern, "");
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log(
          `[OK] ${removal.file}: removed synapse (${removal.reason})`,
        );
        transformCount++;
      }
    }
  }

  // --- Delete any master-only files that leaked through ---
  const masterOnlyFiles = [
    path.join(HEIR_GITHUB, "config", "MASTER-ALEX-PROTECTED.json"),
    path.join(HEIR_GITHUB, "config", "cognitive-config.json"),
    path.join(HEIR_GITHUB, "config", "user-profile.json"),
  ];
  for (const filePath of masterOnlyFiles) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[DELETE] Deleted leaked file: ${path.basename(filePath)}`);
      transformCount++;
    }
  }

  console.log(
    `\n   Applied ${transformCount} transformation${transformCount !== 1 ? "s" : ""}`,
  );
  return transformCount;
}

// ============================================================
// EMBEDDED SYNAPSE CLEANUP: Strip markdown refs to excluded files
// ============================================================

function cleanBrokenEmbeddedSynapses() {
  console.log(
    "\n[SYNAPSES] Cleaning broken embedded synapse references in heir...\n",
  );

  let cleanedFiles = 0;
  let removedLines = 0;

  // Build a single regex matching any line that contains a reference to an
  // excluded instruction filename (e.g., release-management.instructions.md).
  // This covers synapse list items, cross-skill links, "From [...]:", and "See Also" refs.
  const escapedNames = EXCLUDED_INSTRUCTIONS.map((f) =>
    f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const linePattern = new RegExp(
    `^.*(?:${escapedNames.join("|")}).*\\r?\\n`,
    "gm",
  );

  // Helper: strip matching lines from all .md files in a directory
  function cleanDir(dir, label) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const cleaned = content.replace(linePattern, (match) => {
        removedLines++;
        return "";
      });
      if (cleaned !== content) {
        fs.writeFileSync(filePath, cleaned, "utf8");
        cleanedFiles++;
        console.log(`   Cleaned: ${label}/${file}`);
      }
    }
  }

  // 1. Heir instruction files
  cleanDir(path.join(HEIR_GITHUB, "instructions"), "instructions");

  // 2. Heir SKILL.md files (one level deep in skill dirs)
  if (fs.existsSync(HEIR_SKILLS)) {
    const skillDirs = fs
      .readdirSync(HEIR_SKILLS, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const skillName of skillDirs) {
      const skillMd = path.join(HEIR_SKILLS, skillName, "SKILL.md");
      if (!fs.existsSync(skillMd)) continue;
      const content = fs.readFileSync(skillMd, "utf8");
      const cleaned = content.replace(linePattern, (match) => {
        removedLines++;
        return "";
      });
      if (cleaned !== content) {
        fs.writeFileSync(skillMd, cleaned, "utf8");
        cleanedFiles++;
        console.log(`   Cleaned: skills/${skillName}/SKILL.md`);
      }
    }
  }

  if (cleanedFiles > 0) {
    console.log(
      `\n[OK] Cleaned ${cleanedFiles} file(s) (${removedLines} broken reference line(s) removed)`,
    );
  } else {
    console.log("[OK] No broken embedded synapse references found");
  }
}

// ============================================================
// POST-SYNC VALIDATION: Catch contamination before it ships
// ============================================================

function validateHeirIntegrity() {
  console.log("\n[INTEGRITY] Validating heir integrity...\n");

  const errors = [];
  const warnings = [];

  // 1. Check for PII in user-profile.json
  const profilePath = path.join(HEIR_GITHUB, "config", "user-profile.json");
  if (fs.existsSync(profilePath)) {
    const content = fs.readFileSync(profilePath, "utf8");
    try {
      const profile = JSON.parse(content);
      if (profile.name && profile.name.trim() !== "") {
        errors.push(
          `PII LEAK: user-profile.json contains name "${profile.name}"`,
        );
      }
      if (profile.contact && profile.contact.email) {
        errors.push(
          `PII LEAK: user-profile.json contains email "${profile.contact.email}"`,
        );
      }
    } catch (e) {
      warnings.push(`Could not parse user-profile.json: ${e.message}`);
    }
  }

  // 2. Check for master-only files
  const masterOnlyFiles = [
    "MASTER-ALEX-PROTECTED.json",
    "cognitive-config.json",
  ];
  for (const file of masterOnlyFiles) {
    const filePath = path.join(HEIR_GITHUB, "config", file);
    if (fs.existsSync(filePath)) {
      errors.push(`Master-only file leaked: config/${file}`);
    }
  }

  // 3. Validate copilot-instructions.md (v3-identity-first format)
  const copilotPath = path.join(HEIR_GITHUB, "copilot-instructions.md");
  if (fs.existsSync(copilotPath)) {
    const content = fs.readFileSync(copilotPath, "utf8");

    // 3a. No instrumentation comments allowed in heir
    if (/<!-- INSTRUMENTATION:/.test(content)) {
      errors.push(
        "copilot-instructions.md contains INSTRUMENTATION comments (master-only)",
      );
    }
    if (/<!-- Validation:/.test(content)) {
      errors.push(
        "copilot-instructions.md contains Validation comments (master-only)",
      );
    }

    // 3b. ## Heirs section must be absent (heir doesn't need it)
    if (/^## Heirs/m.test(content)) {
      errors.push(
        "copilot-instructions.md contains ## Heirs section (should be removed for heir)",
      );
    }

    // 3c. Master-only imperatives must be absent (only I5, I6 allowed)
    if (/^I1:/m.test(content)) {
      errors.push(
        "copilot-instructions.md contains I1 imperative (master-only)",
      );
    }
    if (/^I3:/m.test(content)) {
      errors.push(
        "copilot-instructions.md contains I3 imperative (master-only)",
      );
    }
    if (/^I4:/m.test(content)) {
      errors.push(
        "copilot-instructions.md contains I4 imperative (master-only)",
      );
    }

    // 3d. Active Context should have heir defaults (not master values)
    if (/Focus Trifectas: master-heir-management/.test(content)) {
      errors.push(
        "copilot-instructions.md Focus Trifectas have master values (not reset)",
      );
    }

    // 3e. Last Assessed should be "never" for heir
    const lastAssessedMatch = content.match(/^Last Assessed: (.+)$/m);
    if (lastAssessedMatch) {
      const value = lastAssessedMatch[1].trim();
      // If it contains a date pattern (YYYY-MM-DD), it's a master value
      if (/\d{4}-\d{2}-\d{2}/.test(value)) {
        errors.push(
          `copilot-instructions.md Last Assessed has master date "${value}" (should be "never")`,
        );
      }
    }

    // 3f. Legacy P-slot patterns must not exist (v1/v2 remnants)
    if (/\| \*\*P[5-7]\*\*/.test(content)) {
      errors.push(
        "copilot-instructions.md contains legacy P-slot table rows (pre-v3 format)",
      );
    }
  }

  // 4. Check for ROADMAP.md references in heir instructions
  const releaseMgmt = path.join(
    HEIR_GITHUB,
    "instructions",
    "release-management.instructions.md",
  );
  if (fs.existsSync(releaseMgmt)) {
    const content = fs.readFileSync(releaseMgmt, "utf8");
    if (content.includes("ROADMAP-UNIFIED.md")) {
      warnings.push(
        "release-management.instructions.md references ROADMAP-UNIFIED.md (should be ROADMAP.md)",
      );
    }
  }

  // Report
  if (errors.length === 0 && warnings.length === 0) {
    console.log("[OK] Heir integrity validated -- no contamination detected\n");
    return true;
  }

  if (warnings.length > 0) {
    console.log(`[WARN] ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`   [WARN] ${w}`));
  }

  if (errors.length > 0) {
    console.log(`[ERROR] ${errors.length} CONTAMINATION ERROR(S):`);
    errors.forEach((e) => console.log(`   [ERROR] ${e}`));
    console.log("\n[BLOCKED] HEIR IS CONTAMINATED -- Fix before publishing!\n");
    process.exit(1);
  }

  return warnings.length === 0;
}

// ============================================================
// SKILL FRONTMATTER VALIDATION: Ensure YAML blocks exist
// ============================================================

function validateSkillFrontmatter() {
  console.log("\n[FRONTMATTER] Validating SKILL.md frontmatter...\n");

  const errors = [];
  const warnings = [];

  if (!fs.existsSync(HEIR_SKILLS)) {
    errors.push("Heir skills directory does not exist");
    return { errors, warnings };
  }

  const skillDirs = fs
    .readdirSync(HEIR_SKILLS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const skillName of skillDirs) {
    const skillPath = path.join(HEIR_SKILLS, skillName, "SKILL.md");
    if (!fs.existsSync(skillPath)) {
      warnings.push(`${skillName}: missing SKILL.md`);
      continue;
    }

    const content = fs.readFileSync(skillPath, "utf8");

    // Check for YAML frontmatter (must start with ---)
    if (!content.startsWith("---")) {
      errors.push(
        `${skillName}/SKILL.md: missing YAML frontmatter (must start with ---)`,
      );
      continue;
    }

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) {
      errors.push(
        `${skillName}/SKILL.md: malformed YAML frontmatter (missing closing ---)`,
      );
      continue;
    }

    const frontmatter = frontmatterMatch[1];

    // Check required fields
    if (!frontmatter.includes("name:")) {
      errors.push(
        `${skillName}/SKILL.md: missing 'name:' field in frontmatter`,
      );
    }
    if (!frontmatter.includes("description:")) {
      errors.push(
        `${skillName}/SKILL.md: missing 'description:' field in frontmatter`,
      );
    }
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log("[OK] All SKILL.md files have valid frontmatter\n");
  } else {
    if (warnings.length > 0) {
      console.log(`[WARN] ${warnings.length} warning(s):`);
      warnings.forEach((w) => console.log(`   [WARN] ${w}`));
    }
    if (errors.length > 0) {
      console.log(`[ERROR] ${errors.length} frontmatter error(s):`);
      errors.forEach((e) => console.log(`   [ERROR] ${e}`));
    }
    console.log("");
  }

  return { errors, warnings };
}

// ============================================================
// SYNAPSE TARGET VALIDATION: Ensure all references exist
// ============================================================

function validateSynapseTargets() {
  console.log("\n[TARGETS] Validating synapse targets...\n");

  const errors = [];
  const warnings = [];

  if (!fs.existsSync(HEIR_SKILLS)) {
    errors.push("Heir skills directory does not exist");
    return { errors, warnings };
  }

  const skillDirs = fs
    .readdirSync(HEIR_SKILLS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const skillName of skillDirs) {
    const synapsePath = path.join(HEIR_SKILLS, skillName, "synapses.json");
    if (!fs.existsSync(synapsePath)) continue;

    try {
      const synapse = JSON.parse(fs.readFileSync(synapsePath, "utf8"));
      if (!synapse.connections || !Array.isArray(synapse.connections)) continue;

      for (const conn of synapse.connections) {
        const target = conn.target;
        if (!target) {
          warnings.push(
            `${skillName}/synapses.json: connection missing 'target' field`,
          );
          continue;
        }

        // Resolve target path relative to heir structure
        let targetPath;
        if (target.startsWith(".github/")) {
          // Absolute from repo root
          targetPath = path.join(HEIR_ROOT, target);
        } else if (target.startsWith("platforms/")) {
          // Heir doesn't have platforms/ -- this is a master-only reference
          errors.push(
            `${skillName}/synapses.json: references master-only path "${target}"`,
          );
          continue;
        } else if (target.startsWith("../") || target.startsWith("../../")) {
          // Relative path from skill directory
          // Skills are at .github/skills/{skillName}/
          const skillDir = path.join(HEIR_SKILLS, skillName);
          targetPath = path.normalize(path.join(skillDir, target));
        } else if (target.includes("/")) {
          // Assume it's a .github-relative path
          targetPath = path.join(HEIR_GITHUB, target);
        } else if (!target.includes("://")) {
          // Single filename without path -- might be root or unclear
          warnings.push(
            `${skillName}/synapses.json: ambiguous target "${target}" (no path)`,
          );
          continue;
        }

        // Check if target exists (skip URIs like global-knowledge://)
        if (
          targetPath &&
          !target.includes("://") &&
          !fs.existsSync(targetPath)
        ) {
          errors.push(
            `${skillName}/synapses.json: broken reference to "${target}" (file does not exist in heir)`,
          );
        }
      }
    } catch (e) {
      warnings.push(
        `${skillName}/synapses.json: could not parse (${e.message})`,
      );
    }
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log("[OK] All synapse targets validated\n");
  } else {
    if (warnings.length > 0) {
      console.log(`[WARN] ${warnings.length} warning(s):`);
      warnings.forEach((w) => console.log(`   [WARN] ${w}`));
    }
    if (errors.length > 0) {
      console.log(`[ERROR] ${errors.length} broken synapse reference(s):`);
      errors.forEach((e) => console.log(`   [ERROR] ${e}`));
    }
    console.log("");
  }

  return { errors, warnings };
}

// ============================================================
// SKILL ACTIVATION INDEX VALIDATION
// ============================================================

function validateSkillActivationIndex() {
  console.log("\n[INDEX] Validating memory-activation skill...\n");

  const errors = [];
  const warnings = [];

  // Check that memory-activation skill exists
  const skillPath = path.join(
    HEIR_GITHUB,
    "skills",
    "memory-activation",
    "SKILL.md",
  );
  if (!fs.existsSync(skillPath)) {
    errors.push(
      "memory-activation/SKILL.md does not exist (core metacognitive skill)",
    );
    return { errors, warnings };
  }

  console.log("[OK] memory-activation skill exists\n");

  // Note: The skill activation index is embedded within SKILL.md itself,
  // not a separate file. Manual review is needed to ensure all skills are discoverable.

  return { errors, warnings };
}

// ============================================================
// LEGACY CLEANUP: Remove deprecated folders from heir
// ============================================================

function cleanupLegacyFolders() {
  // Folders that were replaced by muscles/ and should be removed from heir
  const legacyFolders = [
    "scripts", // Replaced by muscles/ -- brain-qa.ps1 moved there
  ];

  for (const folder of legacyFolders) {
    const legacyPath = path.join(HEIR_GITHUB, folder);
    if (fs.existsSync(legacyPath)) {
      fs.rmSync(legacyPath, { recursive: true });
      console.log(`[CLEAN] Removed legacy folder: .github/${folder}/`);
    }
  }
}

// ============================================================
// FILE & SYNAPSE COUNT AUDIT
// ============================================================

function countFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      count += countFilesRecursive(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

function countSynapseConnections(skillsDir) {
  if (!fs.existsSync(skillsDir)) return { synapseFiles: 0, connections: 0 };
  let synapseFiles = 0;
  let connections = 0;
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const synPath = path.join(skillsDir, entry.name, "synapses.json");
    if (!fs.existsSync(synPath)) continue;
    try {
      const synapse = JSON.parse(fs.readFileSync(synPath, "utf8"));
      synapseFiles++;
      if (Array.isArray(synapse.connections)) {
        connections += synapse.connections.length;
      }
    } catch (e) {
      /* skip malformed */
    }
  }
  return { synapseFiles, connections };
}

function auditFileCounts() {
  console.log("\n[AUDIT] File & Synapse Count Audit\n");

  const folders = [
    "agents",
    "assets",
    "config",
    "instructions",
    "muscles",
    "prompts",
    "skills",
    "episodic",
  ];
  const pad = (s, n) => String(s).padStart(n);
  const padR = (s, n) => String(s).padEnd(n);
  let allMatch = true;

  // Known expected differences per folder
  const expectedDiffs = {
    config: EXCLUDED_CONFIG_FILES.length,
    muscles: getExcludedMuscles().length,
    episodic: -1, // special: heir is always empty
  };

  // Count master-only + m365-only skills
  let nonHeirSkills = 0;
  if (fs.existsSync(MASTER_SKILLS)) {
    for (const d of fs.readdirSync(MASTER_SKILLS, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const inh = getInheritance(d.name);
      if (inh === "master-only" || inh === "heir:m365") nonHeirSkills++;
    }
  }

  console.log(
    `  ${"Folder".padEnd(15)} ${"Master".padStart(6)}  ${"Heir".padStart(6)}  Status`,
  );
  console.log(
    `  ${"-".repeat(15)} ${"-".repeat(6)}  ${"-".repeat(6)}  ${"-".repeat(12)}`,
  );

  for (const folder of folders) {
    const mc = countFilesRecursive(path.join(MASTER_GITHUB, folder));
    const hc = countFilesRecursive(path.join(HEIR_GITHUB, folder));

    let status;
    if (folder === "episodic") {
      // Heir episodic should have only .gitkeep
      status = hc <= 1 ? "[OK] empty" : `[WARN] has ${hc} files`;
      if (hc > 1) allMatch = false;
    } else if (folder === "skills") {
      // Skills have known exclusions (master-only, heir:m365) plus synapse cleaning diffs
      status = hc > 0 ? "[OK] curated" : "[ERROR] EMPTY";
      if (hc === 0) allMatch = false;
    } else if (mc === hc) {
      status = "[OK] match";
    } else {
      const diff = mc - hc;
      const expected = expectedDiffs[folder] || 0;
      if (diff === expected) {
        status = `[OK] ${diff} excluded`;
      } else {
        status = `[WARN] diff ${diff}`;
        allMatch = false;
      }
    }

    console.log(
      `  ${padR(folder, 15)} ${pad(mc, 6)}  ${pad(hc, 6)}  ${status}`,
    );
  }

  // Root .md files (pull_request_template.md is GitHub-only, not synced)
  const GITHUB_ONLY_ROOT_FILES = EXCLUDED_ROOT_FILES;
  const masterRootMd = fs
    .readdirSync(MASTER_GITHUB)
    .filter((f) => f.endsWith(".md")).length;
  const heirRootMd = fs
    .readdirSync(HEIR_GITHUB)
    .filter((f) => f.endsWith(".md")).length;
  const expectedRootDiff = GITHUB_ONLY_ROOT_FILES.length;
  const rootDiff = masterRootMd - heirRootMd;
  let rootStatus;
  if (masterRootMd === heirRootMd) {
    rootStatus = "[OK] match";
  } else if (rootDiff === expectedRootDiff) {
    rootStatus = `[OK] ${rootDiff} GitHub-only`;
  } else {
    rootStatus = `[WARN] diff ${rootDiff}`;
    allMatch = false;
  }
  console.log(
    `  ${padR("root .md", 15)} ${pad(masterRootMd, 6)}  ${pad(heirRootMd, 6)}  ${rootStatus}`,
  );

  // Synapse counts
  console.log("");
  const masterSyn = countSynapseConnections(MASTER_SKILLS);
  const heirSyn = countSynapseConnections(HEIR_SKILLS);
  const masterSkillDirs = fs.existsSync(MASTER_SKILLS)
    ? fs
        .readdirSync(MASTER_SKILLS, { withFileTypes: true })
        .filter((d) => d.isDirectory()).length
    : 0;
  const heirSkillDirs = fs.existsSync(HEIR_SKILLS)
    ? fs
        .readdirSync(HEIR_SKILLS, { withFileTypes: true })
        .filter((d) => d.isDirectory()).length
    : 0;

  console.log(
    `  ${"Metric".padEnd(15)} ${"Master".padStart(6)}  ${"Heir".padStart(6)}  Status`,
  );
  console.log(
    `  ${"-".repeat(15)} ${"-".repeat(6)}  ${"-".repeat(6)}  ${"-".repeat(20)}`,
  );
  console.log(
    `  ${padR("Skill dirs", 15)} ${pad(masterSkillDirs, 6)}  ${pad(heirSkillDirs, 6)}  ${nonHeirSkills} excluded (master/m365)`,
  );
  console.log(
    `  ${padR("Synapse files", 15)} ${pad(masterSyn.synapseFiles, 6)}  ${pad(heirSyn.synapseFiles, 6)}`,
  );
  console.log(
    `  ${padR("Connections", 15)} ${pad(masterSyn.connections, 6)}  ${pad(heirSyn.connections, 6)}  heir cleaned of master-only refs`,
  );

  console.log("");
  if (allMatch) {
    console.log("[OK] All folder counts verified\n");
  } else {
    console.log("[WARN] Some counts differ -- review above\n");
  }
}

// ============================================================
// AUTO-GENERATE chatSkills in package.json (prevents drift)
// ============================================================

function updatePackageJsonChatSkills() {
  console.log("\n[CHATSKILLS] Updating package.json chatSkills...\n");

  const packagePath = path.join(HEIR_ROOT, "package.json");
  if (!fs.existsSync(packagePath)) {
    console.log("[WARN] package.json not found -- skipping chatSkills update");
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  if (!pkg.contributes) {
    console.log("[WARN] No contributes section -- skipping chatSkills update");
    return;
  }

  // Read actual skill directories from heir
  const heirSkillDirs = fs
    .readdirSync(HEIR_SKILLS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const oldCount = (pkg.contributes.chatSkills || []).length;
  pkg.contributes.chatSkills = heirSkillDirs.map((name) => ({
    path: `./.github/skills/${name}/SKILL.md`,
  }));
  const newCount = pkg.contributes.chatSkills.length;

  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");

  if (oldCount !== newCount) {
    console.log(`[OK] chatSkills updated: ${oldCount} -> ${newCount} entries`);
  } else {
    console.log(`[OK] chatSkills verified: ${newCount} entries (no change)`);
  }
}

// Main
console.log("-------------------------------------------");
console.log("  Alex Architecture Sync (Master -> Heir)");
console.log("-------------------------------------------");

// Clean up legacy folders in heir
cleanupLegacyFolders();

syncArchitectureFolders();
syncArchitectureFiles();
const skillStats = syncSkills();
cleanBrokenSynapseReferences(skillStats.skippedMasterOnly);
normalizeBackslashPaths();
applyHeirTransformations();
cleanBrokenEmbeddedSynapses();
updatePackageJsonChatSkills();
verifyCounts();

// Run validation checks
const frontmatterResult = validateSkillFrontmatter();
const synapseResult = validateSynapseTargets();
const indexResult = validateSkillActivationIndex();
const integrityOk = validateHeirIntegrity();
auditFileCounts();

// Collect all validation errors
const allErrors = [
  ...frontmatterResult.errors,
  ...synapseResult.errors,
  ...indexResult.errors,
];

if (allErrors.length > 0) {
  console.log("\n[WARN] -------------------------------------------");
  console.log("[WARN]  VALIDATION FAILURES DETECTED");
  console.log("[WARN] -------------------------------------------");
  console.log(
    `\n[ERROR] ${allErrors.length} error(s) found during sync validation.`,
  );
  console.log(
    "   Review the output above and fix issues in MASTER before syncing again.\n",
  );
  console.log("   Note: Sync completed but heir may have quality issues.\n");
}

console.log("-------------------------------------------");
console.log("  Sync complete!");
console.log("-------------------------------------------\n");
