#!/usr/bin/env node
/**
 * @muscle ralph-loop
 * @inheritance inheritable
 * @description Iterative content improvement via quality feedback loops
 * @version 1.0.0
 * @skill prompt-evolution-system
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires node
 *
 * Ralph Loop Muscle
 * Location: .github/muscles/ralph-loop.cjs
 *
 * Iterative content improvement system that re-generates content until
 * quality thresholds are met or max iterations reached.
 *
 * Inspired by Sensei iterative quality improvement patterns from GitHub Copilot for Azure:
 * @see https://github.com/microsoft/GitHub-Copilot-for-Azure/tree/main/.github/skills/sensei
 * @author Shayne Boyer <shayne.boyer@microsoft.com> - Original Sensei technique
 *
 * Flow:
 * 1. Generate content for a given prompt
 * 2. Evaluate against acceptance criteria (score 0-100)
 * 3. Analyze failures and build LLM-actionable feedback
 * 4. Re-generate with feedback until quality threshold is met
 * 5. Report on quality improvements across iterations
 *
 * Usage:
 *   # Evaluate existing content
 *   node ralph-loop.cjs --evaluate --content "..." --criteria criteria.json
 *
 *   # Run full loop with LLM (via stdin/stdout for extension integration)
 *   echo '{"prompt":"...","criteria":{...}}' | node ralph-loop.cjs --loop
 *
 *   # Build feedback from evaluation results
 *   node ralph-loop.cjs --feedback --findings findings.json
 *
 * Output (JSON):
 *   {"score":85,"passed":true,"findings":[...],"feedback":"..."}
 */

"use strict";

const fs = require("fs");
const path = require("path");

// =============================================================================
// Types and Constants
// =============================================================================

const Severity = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

const DEFAULT_CONFIG = {
  maxIterations: 5,
  qualityThreshold: 80,
  improvementThreshold: 5,
  earlyStopOnPerfect: true,
  includeFeedback: true,
};

// =============================================================================
// Criteria Loader
// =============================================================================

/**
 * Load acceptance criteria from a JSON file or object.
 * @param {string|object} source - Path to criteria file or criteria object
 * @returns {object} Parsed acceptance criteria
 */
function loadCriteria(source) {
  if (typeof source === "string") {
    const content = fs.readFileSync(source, "utf-8");
    return JSON.parse(content);
  }
  return source;
}

/**
 * Extract patterns from skill SKILL.md files.
 * Looks for code blocks marked with correct/incorrect annotations.
 * @param {string} skillPath - Path to SKILL.md file
 * @returns {object} Extracted criteria
 */
function extractCriteriaFromSkill(skillPath) {
  const content = fs.readFileSync(skillPath, "utf-8");
  const criteria = {
    skillName: path.basename(path.dirname(skillPath)),
    sourcePath: skillPath,
    correctPatterns: [],
    incorrectPatterns: [],
    rules: [],
    language: "typescript", // default
  };

  // Extract language from frontmatter or content
  const langMatch = content.match(/language:\s*(\w+)/i);
  if (langMatch) {
    criteria.language = langMatch[1].toLowerCase();
  }

  // Extract code blocks with annotations
  // Pattern: <!-- correct --> or <!-- incorrect --> before code block
  const codeBlockRegex = /<!--\s*(correct|incorrect)\s*-->\s*```(\w+)?\s*\n([\s\S]*?)```/gi;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const isCorrect = match[1].toLowerCase() === "correct";
    const lang = match[2] || criteria.language;
    const code = match[3].trim();

    const pattern = {
      code,
      language: lang,
      description: "",
      isCorrect,
      section: criteria.skillName,
    };

    if (isCorrect) {
      criteria.correctPatterns.push(pattern);
    } else {
      criteria.incorrectPatterns.push(pattern);
    }
  }

  return criteria;
}

// =============================================================================
// Code Evaluator
// =============================================================================

/**
 * Evaluates generated content against acceptance criteria.
 */
class ContentEvaluator {
  constructor(criteria) {
    this.criteria = criteria;
    this.correctRegexes = this._compilePatterns(criteria.correctPatterns || []);
    this.incorrectRegexes = this._compilePatterns(criteria.incorrectPatterns || []);
  }

  _compilePatterns(patterns) {
    return patterns
      .filter((p) => p.code && p.code.length > 10)
      .map((p) => {
        // Escape special regex chars and create flexible matcher
        const escaped = p.code
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\s+/g, "\\s*");
        return {
          section: p.section || "unknown",
          regex: new RegExp(escaped, "i"),
          description: p.description,
        };
      });
  }

  /**
   * Evaluate content and return results.
   * @param {string} content - Content to evaluate
   * @param {string} scenario - Scenario name for reporting
   * @returns {object} Evaluation result
   */
  evaluate(content, scenario = "default") {
    const result = {
      skillName: this.criteria.skillName || "unknown",
      scenario,
      passed: true,
      score: 100,
      errorCount: 0,
      warningCount: 0,
      findings: [],
      matchedCorrect: [],
      matchedIncorrect: [],
    };

    // Check syntax (basic bracket balance)
    this._checkSyntax(content, result);

    // Check for incorrect patterns (deduct points)
    this._checkIncorrectPatterns(content, result);

    // Check for correct patterns (bonus if present)
    this._checkCorrectPatterns(content, result);

    // Apply custom rules
    this._applyRules(content, result);

    // Calculate final score
    result.score = Math.max(0, Math.min(100, result.score));
    result.passed = result.errorCount === 0 && result.score >= 70;

    return result;
  }

  _checkSyntax(content, result) {
    const brackets = { "(": ")", "[": "]", "{": "}" };
    const stack = [];

    for (const char of content) {
      if (brackets[char]) {
        stack.push(brackets[char]);
      } else if (Object.values(brackets).includes(char)) {
        if (stack.pop() !== char) {
          result.findings.push({
            severity: Severity.ERROR,
            rule: "syntax",
            message: `Mismatched bracket: ${char}`,
          });
          result.errorCount++;
          result.score -= 20;
          return;
        }
      }
    }

    if (stack.length > 0) {
      result.findings.push({
        severity: Severity.ERROR,
        rule: "syntax",
        message: `Unclosed brackets: ${stack.join(", ")}`,
      });
      result.errorCount++;
      result.score -= 20;
    }
  }

  _checkIncorrectPatterns(content, result) {
    for (const { section, regex, description } of this.incorrectRegexes) {
      if (regex.test(content)) {
        result.matchedIncorrect.push(section);
        result.findings.push({
          severity: Severity.ERROR,
          rule: `pattern:${section}`,
          message: `Incorrect pattern found: ${description || section}`,
          suggestion: "Review acceptance criteria for correct usage",
        });
        result.errorCount++;
        result.score -= 15;
      }
    }
  }

  _checkCorrectPatterns(content, result) {
    for (const { section, regex, description } of this.correctRegexes) {
      if (regex.test(content)) {
        result.matchedCorrect.push(section);
        // Small bonus for matching correct patterns
        result.score = Math.min(100, result.score + 2);
      }
    }

    // Warn if no correct patterns matched but some exist
    if (this.correctRegexes.length > 0 && result.matchedCorrect.length === 0) {
      result.findings.push({
        severity: Severity.WARNING,
        rule: "patterns",
        message: "No correct patterns detected",
        suggestion: "Consider using patterns from acceptance criteria",
      });
      result.warningCount++;
      result.score -= 5;
    }
  }

  _applyRules(content, result) {
    const rules = this.criteria.rules || [];

    for (const rule of rules) {
      // Required patterns
      for (const pattern of rule.requiredPatterns || []) {
        if (!content.includes(pattern)) {
          result.findings.push({
            severity: Severity.ERROR,
            rule: rule.name,
            message: `Missing required pattern: ${pattern}`,
          });
          result.errorCount++;
          result.score -= 10;
        }
      }

      // Forbidden patterns
      for (const pattern of rule.forbiddenPatterns || []) {
        if (content.includes(pattern)) {
          result.findings.push({
            severity: Severity.ERROR,
            rule: rule.name,
            message: `Forbidden pattern found: ${pattern}`,
          });
          result.errorCount++;
          result.score -= 10;
        }
      }
    }
  }
}

// =============================================================================
// Feedback Builder
// =============================================================================

/**
 * Builds LLM-actionable feedback from evaluation results.
 */
class FeedbackBuilder {
  /**
   * Build complete feedback from evaluation results.
   * @param {object} evalResult - Evaluation result
   * @param {object} criteria - Acceptance criteria
   * @returns {string} Formatted feedback for LLM
   */
  buildFeedback(evalResult, criteria) {
    if (evalResult.findings.length === 0 && evalResult.matchedIncorrect.length === 0) {
      return "";
    }

    const parts = [];
    parts.push("## Issues Found in Generated Content\n");

    // Build error feedback first (highest priority)
    const errorFeedback = this._formatErrorFeedback(evalResult.findings);
    if (errorFeedback) {
      parts.push(errorFeedback);
    }

    // Then warning feedback
    const warningFeedback = this._formatWarningFeedback(evalResult.findings);
    if (warningFeedback) {
      parts.push(warningFeedback);
    }

    // Then pattern feedback
    const patternFeedback = this._formatPatternFeedback(evalResult.matchedIncorrect, criteria);
    if (patternFeedback) {
      parts.push(patternFeedback);
    }

    // Finally suggestions for corrections
    const suggestions = this._suggestCorrections(evalResult.findings, criteria);
    if (suggestions) {
      parts.push(suggestions);
    }

    return parts.join("\n");
  }

  _formatErrorFeedback(findings) {
    const errors = findings.filter((f) => f.severity === Severity.ERROR);
    if (errors.length === 0) return "";

    const lines = ["### CRITICAL ERRORS (Must Fix)\n"];
    for (const error of errors) {
      lines.push(`- **${error.rule}**: ${error.message}`);
      if (error.suggestion) {
        lines.push(`  - Suggestion: ${error.suggestion}`);
      }
    }
    lines.push("");
    return lines.join("\n");
  }

  _formatWarningFeedback(findings) {
    const warnings = findings.filter((f) => f.severity === Severity.WARNING);
    if (warnings.length === 0) return "";

    const lines = ["### WARNINGS (Should Fix)\n"];
    for (const warning of warnings) {
      lines.push(`- **${warning.rule}**: ${warning.message}`);
      if (warning.suggestion) {
        lines.push(`  - Suggestion: ${warning.suggestion}`);
      }
    }
    lines.push("");
    return lines.join("\n");
  }

  _formatPatternFeedback(incorrectSections, criteria) {
    if (!incorrectSections || incorrectSections.length === 0) return "";

    const lines = ["### INCORRECT PATTERNS DETECTED\n"];
    lines.push(`Found incorrect patterns in sections: ${incorrectSections.map((s) => `**${s}**`).join(", ")}`);
    lines.push("");
    lines.push("Review the acceptance criteria for these sections and use correct patterns instead.\n");
    return lines.join("\n");
  }

  _suggestCorrections(findings, criteria) {
    const suggestions = new Set();

    // Collect suggestions from findings
    for (const finding of findings) {
      if (finding.suggestion) {
        suggestions.add(finding.suggestion);
      }
    }

    // Add suggestions from correct patterns
    if (criteria && criteria.correctPatterns) {
      for (const pattern of criteria.correctPatterns) {
        if (pattern.description && !pattern.description.includes("\n")) {
          suggestions.add(`Use: ${pattern.description}`);
        }
      }
    }

    if (suggestions.size === 0) return "";

    const lines = ["### SUGGESTED CORRECTIONS\n"];
    lines.push("Based on the acceptance criteria, consider:\n");
    for (const suggestion of suggestions) {
      lines.push(`- ${suggestion}`);
    }
    lines.push("");
    return lines.join("\n");
  }
}

// =============================================================================
// Ralph Loop Controller
// =============================================================================

/**
 * Orchestrates the iterative improvement loop.
 */
class RalphLoopController {
  constructor(criteria, config = {}) {
    this.criteria = criteria;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.evaluator = new ContentEvaluator(criteria);
    this.feedbackBuilder = new FeedbackBuilder();
  }

  /**
   * Run the Ralph Loop for a given prompt.
   * Note: This method requires an external LLM client to be provided.
   * For CLI usage, use evaluate() and buildFeedback() separately.
   *
   * @param {function} generateFn - Async function that generates content from prompt
   * @param {string} prompt - Original prompt
   * @param {string} scenarioName - Name of the scenario
   * @returns {object} Final result with all iterations
   */
  async run(generateFn, prompt, scenarioName = "default") {
    const startTime = Date.now();
    const iterations = [];
    let currentPrompt = prompt;
    let bestIteration = 0;
    let bestScore = 0;

    for (let i = 0; i < this.config.maxIterations; i++) {
      // Generate content
      const content = await generateFn(currentPrompt);

      // Evaluate
      const evalResult = this.evaluator.evaluate(content, scenarioName);

      // Track best iteration
      if (evalResult.score > bestScore) {
        bestScore = evalResult.score;
        bestIteration = i;
      }

      // Build feedback for potential next iteration
      const feedback = this.feedbackBuilder.buildFeedback(evalResult, this.criteria);

      iterations.push({
        iteration: i + 1,
        score: evalResult.score,
        passed: evalResult.passed,
        errorCount: evalResult.errorCount,
        warningCount: evalResult.warningCount,
        content,
        feedback,
      });

      // Check stopping conditions
      const [shouldStop, stopReason] = this._shouldStop(iterations);
      if (shouldStop) {
        return this._buildResult(iterations, bestIteration, stopReason, startTime);
      }

      // Prepare prompt for next iteration with feedback
      if (this.config.includeFeedback && feedback) {
        currentPrompt = this._buildPromptWithFeedback(prompt, feedback, evalResult);
      }
    }

    return this._buildResult(iterations, bestIteration, "max_iterations_reached", startTime);
  }

  _shouldStop(iterations) {
    if (iterations.length === 0) {
      return [false, "max_iterations_reached"];
    }

    const latest = iterations[iterations.length - 1];
    const latestScore = latest.score;

    // Perfect score
    if (this.config.earlyStopOnPerfect && latestScore >= 100) {
      return [true, "perfect_score"];
    }

    // Quality threshold met
    if (latestScore >= this.config.qualityThreshold) {
      return [true, "quality_threshold_met"];
    }

    // Check for plateau or regression
    if (iterations.length >= 2) {
      const prevScore = iterations[iterations.length - 2].score;
      const improvement = latestScore - prevScore;

      if (improvement < this.config.improvementThreshold) {
        return [true, "improvement_plateau"];
      }
    }

    return [false, "continuing"];
  }

  _buildPromptWithFeedback(originalPrompt, feedback, evalResult) {
    return `${originalPrompt}

---

## Feedback from Previous Attempt

Your previous attempt scored ${evalResult.score}/100. Please address the following issues:

${feedback}

Generate improved content that fixes these issues while maintaining the original requirements.`;
  }

  _buildResult(iterations, bestIteration, stopReason, startTime) {
    const firstScore = iterations[0]?.score ?? 0;
    const lastScore = iterations[iterations.length - 1]?.score ?? 0;

    return {
      finalScore: lastScore,
      iterations,
      improvement: lastScore - firstScore,
      converged: stopReason === "quality_threshold_met" || stopReason === "perfect_score",
      bestIteration: bestIteration + 1,
      stopReason,
      totalDurationMs: Date.now() - startTime,
    };
  }
}

// =============================================================================
// CLI Interface
// =============================================================================

function printUsage() {
  console.log(`
Ralph Loop Muscle - Iterative content improvement

Usage:
  node ralph-loop.cjs --evaluate --content <content> --criteria <path>
  node ralph-loop.cjs --evaluate --content-file <path> --criteria <path>
  node ralph-loop.cjs --feedback --findings <json>
  node ralph-loop.cjs --extract-criteria --skill <skill-path>
  echo '{"prompt":"...","criteria":{...}}' | node ralph-loop.cjs --stdin

Options:
  --evaluate         Evaluate content against criteria
  --content          Content string to evaluate
  --content-file     Path to file containing content
  --criteria         Path to criteria JSON file
  --feedback         Build feedback from findings JSON
  --findings         JSON string of findings
  --extract-criteria Extract criteria from SKILL.md file
  --skill            Path to SKILL.md file
  --stdin            Read input from stdin as JSON
  --config           Configuration overrides as JSON
  --help             Show this help message

Configuration (JSON):
  maxIterations: 5        Maximum iterations before stopping
  qualityThreshold: 80    Score to consider quality met (0-100)
  improvementThreshold: 5 Minimum improvement required
  earlyStopOnPerfect: true Stop immediately on score 100
  includeFeedback: true   Include feedback in re-generation

Output (JSON):
  {
    "score": 85,
    "passed": true,
    "findings": [...],
    "feedback": "..."
  }
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    printUsage();
    process.exit(0);
  }

  const getArg = (name) => {
    const idx = args.indexOf(name);
    return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
  };

  try {
    // Mode: Extract criteria from SKILL.md
    if (args.includes("--extract-criteria")) {
      const skillPath = getArg("--skill");
      if (!skillPath) {
        console.error("Error: --skill required with --extract-criteria");
        process.exit(1);
      }
      const criteria = extractCriteriaFromSkill(skillPath);
      console.log(JSON.stringify(criteria, null, 2));
      return;
    }

    // Mode: Build feedback from findings
    if (args.includes("--feedback")) {
      const findingsArg = getArg("--findings");
      if (!findingsArg) {
        console.error("Error: --findings required with --feedback");
        process.exit(1);
      }
      const findings = JSON.parse(findingsArg);
      const builder = new FeedbackBuilder();
      const feedback = builder.buildFeedback({ findings, matchedIncorrect: [] }, {});
      console.log(JSON.stringify({ feedback }));
      return;
    }

    // Mode: Evaluate content
    if (args.includes("--evaluate")) {
      const criteriaPath = getArg("--criteria");
      if (!criteriaPath) {
        console.error("Error: --criteria required with --evaluate");
        process.exit(1);
      }

      const criteria = loadCriteria(criteriaPath);
      const evaluator = new ContentEvaluator(criteria);
      const feedbackBuilder = new FeedbackBuilder();

      let content;
      const contentFile = getArg("--content-file");
      if (contentFile) {
        content = fs.readFileSync(contentFile, "utf-8");
      } else {
        content = getArg("--content");
      }

      if (!content) {
        console.error("Error: --content or --content-file required with --evaluate");
        process.exit(1);
      }

      const result = evaluator.evaluate(content);
      const feedback = feedbackBuilder.buildFeedback(result, criteria);

      console.log(JSON.stringify({
        score: result.score,
        passed: result.passed,
        errorCount: result.errorCount,
        warningCount: result.warningCount,
        findings: result.findings,
        matchedCorrect: result.matchedCorrect,
        matchedIncorrect: result.matchedIncorrect,
        feedback,
      }, null, 2));
      return;
    }

    // Mode: Stdin JSON (for extension integration)
    if (args.includes("--stdin")) {
      const chunks = [];
      for await (const chunk of process.stdin) {
        chunks.push(chunk);
      }
      const input = JSON.parse(Buffer.concat(chunks).toString("utf-8"));

      const configArg = getArg("--config");
      const config = configArg ? JSON.parse(configArg) : {};

      const criteria = input.criteria || {};
      const evaluator = new ContentEvaluator(criteria);
      const feedbackBuilder = new FeedbackBuilder();

      // If content provided, just evaluate
      if (input.content) {
        const result = evaluator.evaluate(input.content, input.scenario || "default");
        const feedback = feedbackBuilder.buildFeedback(result, criteria);
        console.log(JSON.stringify({
          score: result.score,
          passed: result.passed,
          findings: result.findings,
          feedback,
        }));
        return;
      }

      // Otherwise, this would need an LLM client for the full loop
      console.error("Error: Full Ralph Loop requires LLM client integration");
      console.error("Use --evaluate with --content for standalone evaluation");
      process.exit(1);
    }

    // No valid mode
    printUsage();
    process.exit(1);
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }));
    process.exit(1);
  }
}

// =============================================================================
// Exports (for programmatic use)
// =============================================================================

module.exports = {
  ContentEvaluator,
  FeedbackBuilder,
  RalphLoopController,
  loadCriteria,
  extractCriteriaFromSkill,
  Severity,
  DEFAULT_CONFIG,
};

// Run CLI if invoked directly
if (require.main === module) {
  main().catch((err) => {
    console.error(JSON.stringify({ error: err.message }));
    process.exit(1);
  });
}
