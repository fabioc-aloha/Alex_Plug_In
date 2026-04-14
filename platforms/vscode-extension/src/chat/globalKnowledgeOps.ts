/**
 * globalKnowledgeOps.ts - Knowledge operations, search, tools, and migration
 *
 * Contains knowledge CRUD operations, search functionality, auto-promotion,
 * migration/normalization, and Language Model tool class implementations.
 */
import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import {
  GLOBAL_KNOWLEDGE_PREFIXES,
  GlobalKnowledgeCategory,
  IGlobalKnowledgeEntry,
} from "../shared/constants";
import { queueReferenceTouch } from "./forgettingCurve";
import {
  ensureGlobalKnowledgeIndex,
  readKnowledgeFileContent,
  getGlobalKnowledgePath,
  ensureGlobalKnowledgeDirectories,
  updateGlobalKnowledgeIndex,
  toPortablePath,
} from "./globalKnowledge";
export function generateKnowledgeId(
  type: "pattern" | "insight",
  title: string,
): string {
  const prefix =
    type === "pattern"
      ? GLOBAL_KNOWLEDGE_PREFIXES.pattern
      : GLOBAL_KNOWLEDGE_PREFIXES.insight;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 40);
  const timestamp =
    type === "insight" ? `-${new Date().toISOString().split("T")[0]}` : "";
  return `${prefix}${slug}${timestamp}`;
}

/**
 * Create a new global knowledge pattern file (with concurrent-safe index update)
 */
export async function createGlobalPattern(
  title: string,
  content: string,
  category: GlobalKnowledgeCategory,
  tags: string[],
  sourceProject?: string,
): Promise<IGlobalKnowledgeEntry> {
  await ensureGlobalKnowledgeDirectories();

  const id = generateKnowledgeId("pattern", title);
  const filename = `${id}.md`;
  const filePath = path.join(getGlobalKnowledgePath("patterns"), filename);

  // Create the markdown file with frontmatter-style header
  const fileContent = `# ${title}

**ID**: ${id}  
**Category**: ${category}  
**Tags**: ${tags.join(", ")}  
**Source**: ${sourceProject || "Manual entry"}  
**Created**: ${new Date().toISOString()}  

---

${content}
`;

  await fs.writeFile(filePath, fileContent, "utf-8");

  // Update the index atomically with locking
  const entry: IGlobalKnowledgeEntry = {
    id,
    title,
    type: "pattern",
    category,
    tags,
    sourceProject,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    summary: content.substring(0, 200) + (content.length > 200 ? "..." : ""),
    filePath: toPortablePath(filePath),
  };

  await updateGlobalKnowledgeIndex((index) => {
    index.entries.push(entry);
    return index;
  });

  return entry;
}

/**
 * Update an existing global knowledge pattern file with new content.
 * Preserves the original creation date and ID, updates modified timestamp.
 */
export async function updateGlobalPattern(
  existingEntry: IGlobalKnowledgeEntry,
  newContent: string,
  category: GlobalKnowledgeCategory,
  tags: string[],
  sourceProject?: string,
): Promise<IGlobalKnowledgeEntry> {
  const filePath = existingEntry.filePath;

  if (!filePath || !(await fs.pathExists(filePath))) {
    throw new Error(`Global pattern file not found: ${filePath}`);
  }

  // Merge tags (keep existing, add new)
  const allTags = [...new Set([...(existingEntry.tags || []), ...tags])];

  // Create updated markdown file preserving original metadata
  const fileContent = `# ${existingEntry.title}

**ID**: ${existingEntry.id}  
**Category**: ${category}  
**Tags**: ${allTags.join(", ")}  
**Source**: ${sourceProject || existingEntry.sourceProject || "Manual entry"}  
**Created**: ${existingEntry.created}  
**Modified**: ${new Date().toISOString()}  

---

${newContent}
`;

  await fs.writeFile(filePath, fileContent, "utf-8");

  // Update the index entry
  const updatedEntry: IGlobalKnowledgeEntry = {
    ...existingEntry,
    category,
    tags: allTags,
    modified: new Date().toISOString(),
    summary:
      newContent.substring(0, 200) + (newContent.length > 200 ? "..." : ""),
  };

  await updateGlobalKnowledgeIndex((index) => {
    const entryIndex = index.entries.findIndex(
      (e) => e.id === existingEntry.id,
    );
    if (entryIndex >= 0) {
      index.entries[entryIndex] = updatedEntry;
    }
    return index;
  });

  return updatedEntry;
}

/**
 * Create a new global insight (timestamped learning) - with concurrent-safe index update
 * Note: Requires local GK repo - cannot write to remote
 */
export async function createGlobalInsight(
  title: string,
  content: string,
  category: GlobalKnowledgeCategory,
  tags: string[],
  sourceProject?: string,
  problemContext?: string,
  solution?: string,
): Promise<IGlobalKnowledgeEntry> {
  await ensureGlobalKnowledgeDirectories();

  const id = generateKnowledgeId("insight", title);
  const filename = `${id}.md`;
  const filePath = path.join(getGlobalKnowledgePath("insights"), filename);

  // Create the markdown file
  const fileContent = `# ${title}

**ID**: ${id}  
**Category**: ${category}  
**Tags**: ${tags.join(", ")}  
**Source Project**: ${sourceProject || "Unknown"}  
**Date**: ${new Date().toISOString()}  

---

## Context

${problemContext || "No problem context provided."}

## Insight

${content}

## Solution

${solution || "See insight above."}

---

## Applicability

*When would this insight be useful again?*

- Similar error messages
- Same technology stack: ${tags.join(", ")}
- Related patterns

## Related Projects

- ${sourceProject || "Origin project"}

`;

  await fs.writeFile(filePath, fileContent, "utf-8");

  // Update the index atomically with locking
  const entry: IGlobalKnowledgeEntry = {
    id,
    title,
    type: "insight",
    category,
    tags,
    sourceProject,
    relatedProjects: sourceProject ? [sourceProject] : [],
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    summary: content.substring(0, 200) + (content.length > 200 ? "..." : ""),
    filePath: toPortablePath(filePath),
  };

  await updateGlobalKnowledgeIndex((index) => {
    index.entries.push(entry);
    return index;
  });

  return entry;
}

/**
 * Search global knowledge by query
 */
export async function searchGlobalKnowledge(
  query: string,
  options: {
    type?: "pattern" | "insight" | "all";
    category?: GlobalKnowledgeCategory;
    tags?: string[];
    limit?: number;
  } = {},
): Promise<
  { entry: IGlobalKnowledgeEntry; relevance: number; content?: string }[]
> {
  const index = await ensureGlobalKnowledgeIndex();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const results: {
    entry: IGlobalKnowledgeEntry;
    relevance: number;
    content?: string;
  }[] = [];

  for (const entry of index.entries) {
    // Filter by type
    if (options.type && options.type !== "all" && entry.type !== options.type) {
      continue;
    }

    // Filter by category
    if (options.category && entry.category !== options.category) {
      continue;
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      const hasMatchingTag = options.tags.some((tag) =>
        entry.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()),
      );
      if (!hasMatchingTag) {
        continue;
      }
    }

    // Calculate relevance score
    let relevance = 0;

    // Title match (highest weight)
    if (entry.title.toLowerCase().includes(queryLower)) {
      relevance += 10;
    }
    for (const word of queryWords) {
      if (entry.title.toLowerCase().includes(word)) {
        relevance += 3;
      }
    }

    // Tag match
    for (const tag of entry.tags) {
      if (
        tag.toLowerCase().includes(queryLower) ||
        queryLower.includes(tag.toLowerCase())
      ) {
        relevance += 5;
      }
      for (const word of queryWords) {
        if (tag.toLowerCase().includes(word)) {
          relevance += 2;
        }
      }
    }

    // Summary match
    if (entry.summary.toLowerCase().includes(queryLower)) {
      relevance += 3;
    }
    for (const word of queryWords) {
      if (entry.summary.toLowerCase().includes(word)) {
        relevance += 1;
      }
    }

    // Category match
    if (entry.category.toLowerCase().includes(queryLower)) {
      relevance += 2;
    }

    if (relevance > 0) {
      // Read full content for top results (local or remote)
      let content: string | undefined;
      const fileContent = await readKnowledgeFileContent(entry.filePath, entry);
      if (fileContent) {
        content = fileContent;
        // Additional relevance from content
        for (const word of queryWords) {
          const matches = (
            content.toLowerCase().match(new RegExp(word, "g")) || []
          ).length;
          relevance += Math.min(matches, 5) * 0.5;
        }
      }

      results.push({ entry, relevance, content });
    }
  }

  // Sort by relevance and apply limit
  results.sort((a, b) => b.relevance - a.relevance);
  const limited = results.slice(0, options.limit || 10);
  // v5.9.6: Reference counting — fire-and-forget touch for every returned entry
  limited.forEach((r) => queueReferenceTouch(r.entry.id));
  return limited;
}

/**
 * Promote a project-local DK file to global knowledge
 * Note: Requires local GK repo - cannot write to remote
 */
export async function promoteToGlobalKnowledge(
  localFilePath: string,
  category: GlobalKnowledgeCategory,
  additionalTags: string[] = [],
): Promise<IGlobalKnowledgeEntry | null> {
  try {
    const content = await fs.readFile(localFilePath, "utf-8");
    const filename = path.basename(localFilePath, ".md");

    // Extract title from content (first H1) or use filename
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch
      ? titleMatch[1]
      : filename.replace(/^DK-/, "").replace(/-/g, " ");

    // Extract existing tags if any
    const tagsMatch = content.match(/\*\*Tags\*\*:\s*(.+)$/m);
    const existingTags = tagsMatch
      ? tagsMatch[1].split(",").map((t) => t.trim())
      : [];

    const allTags = [...new Set([...existingTags, ...additionalTags])];

    // Get source project name
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const sourceProject = workspaceFolders
      ? path.basename(workspaceFolders[0].uri.fsPath)
      : undefined;

    return await createGlobalPattern(
      title,
      content,
      category,
      allTags,
      sourceProject,
    );
  } catch (err) {
    console.error("Failed to promote file to global knowledge:", err);
    return null;
  }
}

// ============================================================================
// AUTO-PROMOTION DURING MEDITATION (UNCONSCIOUS MIND)
// ============================================================================

/**
 * Evaluation criteria for DK files
 */
export interface DKFileEvaluation {
  filePath: string;
  filename: string;
  title: string;
  score: number;
  reasons: string[];
  category: GlobalKnowledgeCategory;
  tags: string[];
  isPromotionCandidate: boolean;
  alreadyPromoted: boolean;
  /** The existing global entry if already promoted */
  existingEntry?: IGlobalKnowledgeEntry;
  /** True if local file has been modified since promotion */
  hasLocalChanges: boolean;
}

/**
 * Result of auto-promotion during meditation
 */
export interface AutoPromotionResult {
  evaluated: number;
  promoted: IGlobalKnowledgeEntry[];
  /** Files that were updated (already existed in global but had local changes) */
  updated: IGlobalKnowledgeEntry[];
  skipped: { filename: string; reason: string }[];
  alreadyGlobal: string[];
}

/**
 * Files that should NOT be auto-promoted (meta-files, skill lists, etc.)
 */
const EXCLUDED_FROM_PROMOTION = [
  "DK-SKILL-WISHLIST",
  "DK-GENERIC-FRAMEWORK",
  "VERSION-NAMING-CONVENTION",
];

/**
 * Evaluate a single DK file for promotion candidacy.
 * Scores based on:
 * - Has synapses (3 points)
 * - Has clear structure with sections (2 points)
 * - Has tags defined (1 point)
 * - File size > 1KB (1 point)
 * - File size > 5KB (2 additional points)
 * - Has examples or code blocks (2 points)
 * - General applicability heuristics (1-3 points)
 */
export async function evaluateDKFile(
  filePath: string,
): Promise<DKFileEvaluation> {
  const filename = path.basename(filePath, ".md");
  const content = await fs.readFile(filePath, "utf-8");

  let score = 0;
  const reasons: string[] = [];

  // Extract title
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch
    ? titleMatch[1]
    : filename.replace(/^DK-/, "").replace(/-/g, " ");

  // Note: Synapse scoring removed in v7.8 — embedded synapses deprecated

  // Check for clear structure (multiple H2 sections)
  const h2Sections = content.match(/^##\s+.+$/gm);
  if (h2Sections && h2Sections.length >= 3) {
    score += 2;
    reasons.push(`Well-structured with ${h2Sections.length} sections`);
  }

  // Check for tags
  const tagsMatch = content.match(/\*\*Tags\*\*:\s*(.+)$/m);
  let tags: string[] = [];
  if (tagsMatch) {
    tags = tagsMatch[1]
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (tags.length > 0) {
      score += 1;
      reasons.push(`Has ${tags.length} tag(s)`);
    }
  }

  // Check file size (content richness indicator)
  if (content.length > 1000) {
    score += 1;
    reasons.push("Substantial content (>1KB)");
  }
  if (content.length > 5000) {
    score += 2;
    reasons.push("Rich content (>5KB)");
  }

  // Check for examples or code blocks
  const codeBlocks = content.match(/```[\s\S]*?```/g);
  if (codeBlocks && codeBlocks.length > 0) {
    score += 2;
    reasons.push(`Contains ${codeBlocks.length} code example(s)`);
  }

  // General applicability heuristics
  const generalTerms = [
    /pattern/i,
    /best practice/i,
    /guideline/i,
    /framework/i,
    /principle/i,
    /architecture/i,
    /design/i,
    /approach/i,
  ];
  const generalMatchCount = generalTerms.filter((re) =>
    re.test(content),
  ).length;
  if (generalMatchCount >= 2) {
    score += Math.min(generalMatchCount, 3);
    reasons.push(`Contains general/reusable concepts`);
  }

  // Determine category from content
  const category = inferCategoryFromContent(content, filename);

  // Check if already promoted and detect local changes
  const index = await ensureGlobalKnowledgeIndex();
  const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const existingEntry = index.entries.find(
    (e) =>
      e.title.toLowerCase().replace(/[^a-z0-9]/g, "-") === normalizedTitle ||
      e.id.includes(normalizedTitle),
  );
  const alreadyPromoted = !!existingEntry;

  // Check if local file has changes since last promotion
  let hasLocalChanges = false;
  if (alreadyPromoted && existingEntry) {
    try {
      const localStats = await fs.stat(filePath);
      const localModified = localStats.mtime;
      const globalModified = new Date(existingEntry.modified);
      // Local file modified after global entry was last updated
      hasLocalChanges = localModified > globalModified;
    } catch {
      // If we can't check, assume no changes
      hasLocalChanges = false;
    }
  }

  return {
    filePath,
    filename,
    title,
    score,
    reasons,
    category,
    tags,
    isPromotionCandidate: score >= 5 && !alreadyPromoted,
    alreadyPromoted,
    existingEntry,
    hasLocalChanges,
  };
}

/**
 * Infer category from file content and name
 */
function inferCategoryFromContent(
  content: string,
  filename: string,
): GlobalKnowledgeCategory {
  const contentLower = content.toLowerCase();
  const filenameLower = filename.toLowerCase();

  const categoryPatterns: [RegExp, GlobalKnowledgeCategory][] = [
    [/error|exception|fault|handling/i, "error-handling"],
    [/api|rest|graphql|endpoint/i, "api-design"],
    [/test|spec|jest|mocha|assertion/i, "testing"],
    [/debug|troubleshoot|diagnos/i, "debugging"],
    [/performance|optimi|cache|speed/i, "performance"],
    [/architecture|design|pattern|structure/i, "architecture"],
    [/security|auth|encrypt|vulnerab/i, "security"],
    [/deploy|ci\/cd|pipeline|docker|kubernetes/i, "deployment"],
    [/document|readme|comment|diagram/i, "documentation"],
    [/refactor|clean|improve|modernize/i, "refactoring"],
    [/tool|config|setup|environment/i, "tooling"],
  ];

  for (const [pattern, category] of categoryPatterns) {
    if (pattern.test(contentLower) || pattern.test(filenameLower)) {
      return category;
    }
  }

  return "general";
}

/**
 * UNCONSCIOUS MIND: Auto-promote valuable DK files during meditation.
 * This runs during self-actualization and meditation sessions.
 *
 * Criteria for auto-promotion (minimum score of 5):
 * - Has synapses (+3)
 * - Well-structured (+2)
 * - Has tags (+1)
 * - Substantial content (+1 to +3)
 * - Has examples (+2)
 * - General applicability (+1 to +3)
 */
export async function autoPromoteDuringMeditation(
  workspacePath: string,
  options: { dryRun?: boolean; minScore?: number } = {},
): Promise<AutoPromotionResult> {
  const { dryRun = false, minScore = 5 } = options;

  await ensureGlobalKnowledgeDirectories();

  const result: AutoPromotionResult = {
    evaluated: 0,
    promoted: [],
    updated: [],
    skipped: [],
    alreadyGlobal: [],
  };

  // Find all DK files in the workspace
  const dkPath = path.join(workspacePath, ".github", "domain-knowledge");
  if (!(await fs.pathExists(dkPath))) {
    return result;
  }

  const files = await fs.readdir(dkPath);
  const dkFiles = files.filter((f) => f.startsWith("DK-") && f.endsWith(".md"));

  for (const file of dkFiles) {
    const filePath = path.join(dkPath, file);
    const filenameWithoutExt = file.replace(".md", "");

    // Skip excluded files
    if (
      EXCLUDED_FROM_PROMOTION.some((excluded) =>
        filenameWithoutExt.includes(excluded),
      )
    ) {
      result.skipped.push({ filename: file, reason: "Excluded meta-file" });
      continue;
    }

    result.evaluated++;

    try {
      const evaluation = await evaluateDKFile(filePath);

      // Handle already promoted files - check for updates
      if (evaluation.alreadyPromoted) {
        if (evaluation.hasLocalChanges && evaluation.existingEntry) {
          // Local file has been modified - update the global version
          if (!dryRun) {
            const content = await fs.readFile(filePath, "utf-8");
            const workspaceFolders = vscode.workspace.workspaceFolders;
            const sourceProject = workspaceFolders
              ? path.basename(workspaceFolders[0].uri.fsPath)
              : undefined;

            const updatedEntry = await updateGlobalPattern(
              evaluation.existingEntry,
              content,
              evaluation.category,
              evaluation.tags,
              sourceProject,
            );
            result.updated.push(updatedEntry);
          } else {
            // Dry run - mock update entry
            result.updated.push({
              ...evaluation.existingEntry,
              modified: new Date().toISOString(),
              summary: `[DRY-RUN] Would be updated from local changes`,
            });
          }
        } else {
          // No changes - skip
          result.alreadyGlobal.push(file);
        }
        continue;
      }

      if (!evaluation.isPromotionCandidate || evaluation.score < minScore) {
        result.skipped.push({
          filename: file,
          reason: `Score ${evaluation.score}/${minScore} - ${evaluation.reasons.join(", ") || "Needs more structure/content"}`,
        });
        continue;
      }

      // Promote the file
      if (!dryRun) {
        const entry = await promoteToGlobalKnowledge(
          filePath,
          evaluation.category,
          evaluation.tags,
        );

        if (entry) {
          result.promoted.push(entry);
        }
      } else {
        // In dry run, create a mock entry for reporting
        result.promoted.push({
          id: `[DRY-RUN] ${filenameWithoutExt}`,
          title: evaluation.title,
          type: "pattern",
          category: evaluation.category,
          tags: evaluation.tags,
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          summary: `Would be promoted with score ${evaluation.score}`,
          filePath,
        });
      }
    } catch (err) {
      result.skipped.push({ filename: file, reason: `Error: ${err}` });
    }
  }

  return result;
}

/**
 * Get summary of global knowledge base
 */
export async function getGlobalKnowledgeSummary(): Promise<{
  totalPatterns: number;
  totalInsights: number;
  categories: Record<string, number>;
  recentEntries: IGlobalKnowledgeEntry[];
  topTags: { tag: string; count: number }[];
}> {
  const index = await ensureGlobalKnowledgeIndex();

  const categories: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};

  for (const entry of index.entries) {
    // Count by category
    categories[entry.category] = (categories[entry.category] || 0) + 1;

    // Count tags
    for (const tag of entry.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  // Get top tags
  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Get recent entries
  const recentEntries = [...index.entries]
    .sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    )
    .slice(0, 5);

  return {
    totalPatterns: index.entries.filter((e) => e.type === "pattern").length,
    totalInsights: index.entries.filter((e) => e.type === "insight").length,
    categories,
    recentEntries,
    topTags,
  };
}

// ============================================================================
// GLOBAL KNOWLEDGE MIGRATION & NORMALIZATION
// ============================================================================
