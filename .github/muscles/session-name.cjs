#!/usr/bin/env node
/**
 * @muscle session-name
 * @inheritance inheritable
 * @description Generate descriptive session names from conversation context
 * @version 1.0.0
 * @skill episodic-memory
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires node
 *
 * Session Name Generator Muscle
 * Location: .github/muscles/session-name.cjs
 *
 * Generates descriptive session names from conversation context.
 * Output format matches Agent Host Protocol session renaming expectations.
 *
 * NOTE: This muscle mirrors the logic in episodicMemory.ts generateSessionName().
 * The TypeScript version is used inline by the VS Code extension; this muscle
 * provides CLI access for testing, hooks, and external tooling.
 * Keep both implementations in sync when updating tag patterns.
 *
 * Usage:
 *   node session-name.cjs --topic "implement cosmos retry logic"
 *   node session-name.cjs --topic "fix the bug" --workspace "AlexMaster" --prompts "fix the bug,it's in episodic memory,the flush function"
 *   echo '{"topic":"deploy to azure","prompts":["deploy","check status"]}' | node session-name.cjs --stdin
 *
 * Output (JSON):
 *   {"name":"devops: deploy to azure","tags":["devops"],"confidence":0.85}
 */

"use strict";

// ============================================================================
// Domain Tag Detection (mirrored from episodicMemory.ts)
// ============================================================================

const DOMAIN_TAG_MAP = [
  [/\b(brand|color|css|design|ui|ux|layout|style|theme)\b/i, "design"],
  [/\b(test|spec|jest|mocha|coverage|mock)\b/i, "testing"],
  [/\b(deploy|azure|aws|docker|ci\/cd|pipeline|release|publish)\b/i, "devops"],
  [/\b(debug|error|bug|fix|crash|exception|stack trace)\b/i, "debugging"],
  [
    /\b(architecture|design pattern|microservice|api|system design)\b/i,
    "architecture",
  ],
  [/\b(typescript|javascript|python|react|node|function|class)\b/i, "coding"],
  [/\b(document|readme|changelog|comment|explain)\b/i, "documentation"],
  [/\b(security|auth|token|permission|vulnerability)\b/i, "security"],
  [/\b(database|sql|query|schema|migration|cosmos|postgres)\b/i, "data"],
  [/\b(refactor|clean|optimize|performance|memory)\b/i, "refactoring"],
  [/\b(roadmap|backlog|plan|sprint|milestone)\b/i, "planning"],
  [/\b(vscode|extension|copilot|chat|participant)\b/i, "vscode"],
  [/\b(skill|instruction|prompt|trifecta|synapse)\b/i, "cognitive"],
  [/\b(image|banner|avatar|portrait|generate)\b/i, "media"],
];

function inferTags(text) {
  const tags = [];
  for (const [pattern, tag] of DOMAIN_TAG_MAP) {
    if (pattern.test(text) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }
  return tags.slice(0, 4);
}

// ============================================================================
// Session Name Generation (mirrored from episodicMemory.ts)
// ============================================================================

/**
 * Generate a concise, descriptive session name from the topic and tags.
 * Pattern: "{primary-tag}: {topic-summary}"
 * Examples: "devops: release v7.2.0", "debugging: Cosmos throttling"
 */
function generateSessionName(topic, tags, workspace) {
  // Extract first meaningful phrase (strip common prefixes)
  let name = topic
    .replace(
      /^(let's|let us|can you|please|help me|i want to|i need to)\s+/i,
      ""
    )
    .replace(
      /^(implement|create|build|fix|debug|update|add|remove|refactor)\s+/i,
      "$1 "
    )
    .trim();

  // Truncate to reasonable length
  if (name.length > 50) {
    name = name.slice(0, 47) + "...";
  }

  // Prefix with primary tag if available and not redundant
  const primaryTag = tags[0];
  if (primaryTag && !name.toLowerCase().includes(primaryTag)) {
    name = `${primaryTag}: ${name}`;
  }

  // Optionally prepend workspace for cross-project clarity
  if (workspace && !name.toLowerCase().includes(workspace.toLowerCase())) {
    // Only add workspace if name is short enough
    if (name.length + workspace.length < 60) {
      name = `[${workspace}] ${name}`;
    }
  }

  return name;
}

/**
 * Calculate confidence based on tag match quality and context richness.
 */
function calculateConfidence(topic, prompts, tags) {
  let confidence = 0.5; // base

  // More tags = better understanding
  confidence += tags.length * 0.1;

  // Longer topic = more context
  if (topic.length > 20) confidence += 0.1;
  if (topic.length > 50) confidence += 0.05;

  // Multiple prompts = richer session understanding
  if (prompts.length > 1) confidence += 0.1;
  if (prompts.length > 3) confidence += 0.05;

  // Cap at 0.95 — never 100% certain
  return Math.min(0.95, Math.round(confidence * 100) / 100);
}

// ============================================================================
// CLI Interface
// ============================================================================

function printUsage() {
  console.log(`
Session Name Generator

Usage:
  node session-name.cjs --topic "your topic here"
  node session-name.cjs --topic "topic" --workspace "ProjectName" --prompts "p1,p2,p3"
  echo '{"topic":"...","prompts":["..."]}' | node session-name.cjs --stdin

Options:
  --topic <text>       Primary topic (first user message)
  --prompts <csv>      Additional prompts, comma-separated
  --workspace <name>   Workspace name for context
  --stdin              Read JSON input from stdin
  --help               Show this help

Output (JSON):
  {"name":"tag: topic summary","tags":["tag1","tag2"],"confidence":0.85}
`);
}

async function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("readable", () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });
    process.stdin.on("end", () => {
      resolve(data.trim());
    });
    // Timeout after 100ms if no stdin
    setTimeout(() => resolve(""), 100);
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  let topic = "";
  let prompts = [];
  let workspace = "";
  let useStdin = false;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--topic" && args[i + 1]) {
      topic = args[++i];
    } else if (arg === "--prompts" && args[i + 1]) {
      prompts = args[++i].split(",").map((p) => p.trim());
    } else if (arg === "--workspace" && args[i + 1]) {
      workspace = args[++i];
    } else if (arg === "--stdin") {
      useStdin = true;
    }
  }

  // Read from stdin if requested
  if (useStdin) {
    const stdinData = await readStdin();
    if (stdinData) {
      try {
        const input = JSON.parse(stdinData);
        topic = input.topic || topic;
        prompts = input.prompts || prompts;
        workspace = input.workspace || workspace;
      } catch {
        console.error("ERROR: Invalid JSON on stdin");
        process.exit(1);
      }
    }
  }

  // Validate input
  if (!topic) {
    console.error("ERROR: --topic is required");
    printUsage();
    process.exit(1);
  }

  // Combine all text for tag inference
  const allText = [topic, ...prompts].join(" ");
  const tags = inferTags(allText);
  const name = generateSessionName(topic, tags, workspace);
  const confidence = calculateConfidence(topic, prompts, tags);

  // Output result
  const result = {
    name,
    tags,
    confidence,
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
