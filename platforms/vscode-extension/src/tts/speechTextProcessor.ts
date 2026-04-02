/**
 * speechTextProcessor.ts - Markdown-to-speech text processing
 *
 * Strips markdown formatting (tables, code blocks, inline elements, headers)
 * and expands emoji/symbols/abbreviations for natural spoken output.
 */

import * as vscode from "vscode";
/**
 * Convert a markdown table to spoken format
 * Reads as: "Table with columns: A, B, C. Row 1: A is X, B is Y, C is Z. Row 2: ..."
 */
function tableToSpeech(tableMatch: string): string {
  const lines = tableMatch
    .trim()
    .split("\n")
    .filter((line) => line.trim());
  if (lines.length < 2) {
    return "";
  }

  // Parse header row
  const headers = lines[0]
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell && !cell.match(/^[-:]+$/));

  if (headers.length === 0) {
    return "";
  }

  // Skip separator row (line with dashes)
  const dataRows = lines.slice(2);

  let speech = `Table with ${headers.length} columns: ${headers.join(", ")}. `;

  // Parse data rows (configurable limit for accessibility)
  const maxTableRows = vscode.workspace
    .getConfiguration("alex.tts")
    .get<number>("maxTableRows", 10);
  const maxRows = Math.min(dataRows.length, maxTableRows);
  for (let i = 0; i < maxRows; i++) {
    const cells = dataRows[i]
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell);

    if (cells.length === 0) {
      continue;
    }

    // Read each cell with its column header
    const rowParts: string[] = [];
    for (let j = 0; j < Math.min(cells.length, headers.length); j++) {
      const value = cells[j]
        .replace(/\*\*/g, "") // Remove bold
        .replace(/\*/g, "") // Remove italic
        .replace(/`/g, "") // Remove code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links to text
        .trim();

      if (value && value !== "—" && value !== "-") {
        rowParts.push(`${headers[j]}: ${value}`);
      }
    }

    if (rowParts.length > 0) {
      speech += `Row ${i + 1}: ${rowParts.join(", ")}. `;
    }
  }

  if (dataRows.length > maxRows) {
    speech += `Plus ${dataRows.length - maxRows} more rows. `;
  }

  return speech;
}

/**
 * Strip markdown formatting for natural speech
 * Enhanced for tables, mermaid diagrams, task lists, and common symbols
 */
export function prepareTextForSpeech(markdown: string): string {
  let text = markdown;
  text = stripBlockElements(text);
  text = processInlineElements(text);
  text = processHeadersAndStructure(text);
  text = expandEmojiAndSymbols(text);
  text = cleanupSpeechText(text);
  return text.trim();
}

function stripBlockElements(text: string): string {
  // Mermaid diagrams - summarize
  text = text.replace(/```mermaid[\s\S]*?```/g, " diagram shown here ");

  // Code blocks - summarize
  const langNames: Record<string, string> = {
    typescript: "TypeScript",
    javascript: "JavaScript",
    python: "Python",
    csharp: "C#",
    cpp: "C++",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    yaml: "YAML",
    xml: "XML",
    sql: "SQL",
    bash: "Bash",
    powershell: "PowerShell",
  };
  text = text.replace(/```(\w+)?[\s\S]*?```/g, (_match, lang) => {
    const displayLang = lang
      ? langNames[lang.toLowerCase()] ||
        lang.charAt(0).toUpperCase() + lang.slice(1)
      : "";
    return displayLang
      ? ` ${displayLang} code block omitted `
      : " code block omitted ";
  });

  // Tables - convert to spoken format
  text = text.replace(
    /^\|.+\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]?)+)/gm,
    tableToSpeech,
  );
  text = text.replace(
    /^\|[^|]+\|[^|]+\|[\r\n]+\|[-:\s|]+\|[\r\n]*((?:\|[^|]+\|[^|]+\|[\r\n]?)*)/gm,
    tableToSpeech,
  );

  // HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  // Details/summary blocks
  text = text.replace(
    /<details>[\s\S]*?<summary>(.*?)<\/summary>[\s\S]*?<\/details>/g,
    "Collapsed section: $1. ",
  );

  // Task lists
  text = text.replace(/^[-*]\s*\[x\]\s+(.+)$/gim, "Completed: $1. ");
  text = text.replace(/^[-*]\s*\[\s\]\s+(.+)$/gim, "To do: $1. ");

  return text;
}

function processInlineElements(text: string): string {
  // Inline code
  text = text.replace(/`([^`]+)`/g, "$1");

  // Images (must be before links - both share similar syntax)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "image: $1");

  // Links - keep text, mention if external
  text = text.replace(/\[([^\]]+)\]\(https?:[^)]+\)/g, "$1 (link)");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Bold/italic (order matters - bold first)
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, "$1");
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/___([^_]+)___/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");

  // Strikethrough
  text = text.replace(/~~([^~]+)~~/g, "$1");

  return text;
}

function processHeadersAndStructure(text: string): string {
  // Headers - announce level for navigation
  text = text.replace(/^######\s+(.+)$/gm, "Sub-section: $1. ");
  text = text.replace(/^#####\s+(.+)$/gm, "Sub-section: $1. ");
  text = text.replace(/^####\s+(.+)$/gm, "Section: $1. ");
  text = text.replace(/^###\s+(.+)$/gm, "Section: $1. ");
  text = text.replace(/^##\s+(.+)$/gm, "Heading: $1. ");
  text = text.replace(/^#\s+(.+)$/gm, "Title: $1. ");

  // Horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, " ");

  // Blockquotes
  text = text.replace(/^>\s+(.+)$/gm, "Quote: $1. ");

  // List markers (after task lists)
  text = text.replace(/^[-*+]\s+/gm, "");
  text = text.replace(/^\d+\.\s+/gm, "");

  return text;
}

function expandEmojiAndSymbols(text: string): string {
  // === EMOJI + REDUNDANT TEXT COMBOS (process BEFORE generic emoji) ===
  // Prevents "completed Complete", "planned Planned", etc.
  text = text.replace(/✅\s*\**Completed?\**/gi, "completed");
  text = text.replace(/✅\s*\**Done\**/gi, "completed");
  text = text.replace(/📋\s*\**Planned?\**/gi, "planned");
  text = text.replace(/🔄\s*\**In\s*Progress\**/gi, "in progress");
  text = text.replace(/⏳\s*\**Waiting\**/gi, "waiting");
  text = text.replace(/🆕\s*\**New\**/gi, "new");
  text = text.replace(/⚠️\s*\**Warning\**/gi, "warning");
  text = text.replace(/❌\s*\**(Not\s*Done|Failed?|Broken)\**/gi, "not done");
  text = text.replace(/🔓\s*\**UNLOCKED\**/gi, "unlocked");
  text = text.replace(/🔥\s*High/gi, "high priority"); // 🔥 High → high priority
  text = text.replace(/⭐+\s*(High|Medium|Low)/gi, "$1"); // ⭐⭐ High → High

  // === COMMON EMOJI (pronounce meaningfully - for standalone emoji) ===
  text = text.replace(/✅/g, "completed");
  text = text.replace(/❌/g, "not done");
  text = text.replace(/⚠️/g, "warning");
  text = text.replace(/🔥/g, "hot");
  text = text.replace(/📋/g, "planned");
  text = text.replace(/🆕/g, "new");
  text = text.replace(/🔄/g, "in progress");
  text = text.replace(/⏳/g, "waiting");
  text = text.replace(/🧠/g, ""); // Skip brain (contextual)
  text = text.replace(/👶/g, ""); // Skip baby (Alex heir reference)
  text = text.replace(/💡/g, "idea");
  text = text.replace(/🎨/g, ""); // Skip art palette
  text = text.replace(/🔗/g, ""); // Skip link emoji
  text = text.replace(/📊/g, ""); // Skip chart
  text = text.replace(/📦/g, ""); // Skip package
  text = text.replace(/🚀/g, ""); // Skip rocket
  text = text.replace(/⭐/g, "star");
  text = text.replace(/🔓/g, "unlocked");
  text = text.replace(/🔬/g, "research");
  text = text.replace(/🎯/g, ""); // Skip target
  text = text.replace(/📜/g, ""); // Skip scroll
  text = text.replace(/🚫/g, "avoid");

  // === SYMBOLS & ABBREVIATIONS ===

  // Common symbols
  text = text.replace(/→/g, " leads to ");
  text = text.replace(/←/g, " from ");
  text = text.replace(/↔/g, " both ways ");
  text = text.replace(/⇒/g, " implies ");
  text = text.replace(/≈/g, " approximately ");
  text = text.replace(/≠/g, " not equal to ");
  text = text.replace(/≥/g, " greater than or equal to ");
  text = text.replace(/≤/g, " less than or equal to ");
  text = text.replace(/±/g, " plus or minus ");
  text = text.replace(/°/g, " degrees ");
  text = text.replace(/×/g, " times ");
  text = text.replace(/÷/g, " divided by ");
  text = text.replace(/√/g, " square root of ");
  text = text.replace(/∞/g, " infinity ");
  text = text.replace(/•/g, ", "); // Bullet to comma
  text = text.replace(/—/g, ", "); // Em dash to comma
  text = text.replace(/–/g, " to "); // En dash (ranges)
  text = text.replace(/…/g, "...");

  // Tech abbreviations (expand for clarity)
  text = text.replace(/\bAPI\b/g, "A P I");
  text = text.replace(/\bUI\b/g, "U I");
  text = text.replace(/\bUX\b/g, "U X");
  text = text.replace(/\bGA\b/g, "general availability");
  text = text.replace(/\bM365\b/g, "Microsoft 365");
  text = text.replace(/\bVS Code\b/gi, "VS Code");
  text = text.replace(/\bTTS\b/g, "text to speech");
  text = text.replace(/\bDRM\b/g, "D R M");
  text = text.replace(/\bJSON\b/g, "JSON");
  text = text.replace(/\bSSML\b/g, "S S M L");
  text = text.replace(/\bMCP\b/g, "M C P");
  text = text.replace(/\bADR\b/g, "architecture decision record");
  text = text.replace(/\bCAIR\b/g, "C A I R");
  text = text.replace(/\bCSR\b/g, "C S R");

  // Version patterns (skip when already preceded by "Version:" from table headers)
  text = text.replace(/(?<!Version:\s*)v(\d+\.\d+\.\d+)/gi, "version $1");
  text = text.replace(/(?<!Version:\s*)v(\d+\.\d+)/gi, "version $1");

  // Time duration patterns (must be before file extensions)
  text = text.replace(/(\d+)h\b/g, "$1 hours");
  text = text.replace(/(\d+)m\b/g, "$1 minutes");
  text = text.replace(/(\d+)s\b/g, "$1 seconds");
  text = text.replace(/(\d+)d\b/g, "$1 days");
  text = text.replace(/(\d+)w\b/g, "$1 weeks");
  text = text.replace(/(\d+)min\b/g, "$1 minutes");
  text = text.replace(/(\d+)hr\b/g, "$1 hours");
  text = text.replace(/(\d+)sec\b/g, "$1 seconds");

  // File extensions
  text = text.replace(/\.md\b/g, " markdown file");
  text = text.replace(/\.ts\b/g, " TypeScript file");
  text = text.replace(/\.js\b/g, " JavaScript file");
  text = text.replace(/\.json\b/g, " JSON file");

  // Common operators in prose
  text = text.replace(/\s+\+\s+/g, " plus ");
  text = text.replace(/\s+-\s+/g, " minus ");
  text = text.replace(/\s+&\s+/g, " and ");
  text = text.replace(/\s+@\s+/g, " at ");
  text = text.replace(/(\d+)%/g, "$1 percent");
  text = text.replace(/~(\d+)/g, "approximately $1");

  // Less than / greater than (only when not in table remnants)
  text = text.replace(/\s+<\s+/g, " less than ");
  text = text.replace(/\s+>\s+/g, " greater than ");

  return text;
}

function cleanupSpeechText(text: string): string {
  // Normalize line endings (Windows CRLF to LF)
  text = text.replace(/\r\n/g, "\n");

  // Multiple newlines to pause
  text = text.replace(/\n\n+/g, ". ");

  // Single newlines to space
  text = text.replace(/\n/g, " ");

  // Pipe remnants from tables
  text = text.replace(/\|/g, ", ");

  // Multiple spaces
  text = text.replace(/\s+/g, " ");

  // Multiple periods/commas
  text = text.replace(/[.,]\s*[.,]+/g, ". ");
  text = text.replace(/,\s*\./g, ".");

  // Colon followed by comma
  text = text.replace(/:\s*,/g, ": ");

  return text;
}
