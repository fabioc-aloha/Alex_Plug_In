/**
 * Alex PPTX Generator
 *
 * Programmatic PowerPoint generation via PptxGenJS.
 * Zero cloud dependencies — runs in Alex's Node.js runtime.
 *
 * @module pptxGenerator
 */

import pptxgen from "pptxgenjs";
import * as fs from "fs-extra";
import * as path from "path";
import {
  getIcon,
  getStockIllustration,
  listIconNames,
  listStockIllustrationNames,
} from "./illustrationIcons";
// Unused services for now (reserved for future enhancements)
// import { fileToBase64DataUri, getTickerLogoUrl, LogoServiceConfig } from '../services/logoService';
// import { getIconifyUrl, getDiceBearUrl } from '../services/illustrationService';
import { parseIconifyValue } from "../services/illustrationService";
import {
  addTitleSlide,
  addContentSlide,
  addSectionSlide,
  addChartSlide,
  addTableSlide,
  addImageSlide,
  addIllustrationSlide,
  addTwoColumnSlide,
} from "./pptxSlideTypes";

// =============================================================================
// TYPES
// =============================================================================

export interface SlideContent {
  type:
    | "title"
    | "content"
    | "section"
    | "chart"
    | "table"
    | "image"
    | "twoColumn"
    | "illustration";
  title?: string;
  subtitle?: string;
  bullets?: string[];
  notes?: string;
  data?:
    | ChartData
    | TableData
    | ImageData
    | TwoColumnData
    | IllustrationSlideData;
  illustrations?: IllustrationData[]; // Inline illustrations within slide
}

export interface ChartData {
  chartType: "bar" | "line" | "pie" | "doughnut" | "area" | "scatter";
  series: Array<{
    name: string;
    labels: string[];
    values: number[];
  }>;
  title?: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
  highlightLastRow?: boolean;
}

export interface ImageData {
  path?: string;
  base64?: string;
  width?: number;
  height?: number;
  caption?: string;
}

/**
 * Illustration types supported in presentations:
 * - icon: Lucide/Feather vector icons (e.g., 'chart-bar', 'users', 'lightbulb')
 * - iconify: Iconify API icons (e.g., 'mdi/chart-bar', 'heroicons/users')
 * - avatar: DiceBear generated avatars (e.g., 'John', 'Jane#open-peeps')
 * - mermaid: Flowcharts, sequences, architecture diagrams
 * - stock: Pre-bundled business illustrations
 * - svg: User-provided SVG files from workspace or logos folder
 * - image: User-provided PNG/JPG files from workspace or logos folder
 * - ticker: Company logo fetched by stock ticker symbol (via Logo API)
 */
export type IllustrationType =
  | "icon"
  | "iconify"
  | "avatar"
  | "mermaid"
  | "stock"
  | "svg"
  | "image"
  | "ticker";

export interface IllustrationData {
  type: IllustrationType;
  value: string; // Icon name, mermaid code, stock name, or file path
  width?: number;
  height?: number;
  position?: "left" | "center" | "right" | "inline";
  caption?: string;
  color?: string; // For icons: hex color to tint
}

export interface IllustrationSlideData {
  illustration: IllustrationData;
  description?: string;
}

export interface TwoColumnData {
  left: { title?: string; bullets?: string[] };
  right: { title?: string; bullets?: string[] };
}

export interface PresentationOptions {
  title: string;
  author?: string;
  subject?: string;
  company?: string;
  layout?: "16x9" | "16x10" | "4x3";
  theme?: "alex-brand" | "minimal" | "dark";
  compression?: boolean;
}

export interface GenerateResult {
  success: boolean;
  filePath?: string;
  base64?: string;
  error?: string;
  slideCount?: number;
}

// =============================================================================
// ALEX BRAND COLORS (GitHub Pastel v2)
// =============================================================================

export const ALEX_COLORS = {
  // Primary
  blue: { fill: "ddf4ff", text: "0550ae", border: "80ccff" },
  green: { fill: "d3f5db", text: "1a7f37", border: "6fdd8b" },
  purple: { fill: "d8b9ff", text: "6639ba", border: "bf8aff" },
  // Accent
  gold: { fill: "fff8c5", text: "9a6700", border: "d4a72c" },
  bronze: { fill: "fff1e5", text: "953800", border: "ffb77c" },
  red: { fill: "ffebe9", text: "cf222e", border: "f5a3a3" },
  // Neutral
  gray: { fill: "eaeef2", text: "24292f", border: "afb8c1" },
  white: { fill: "FFFFFF", text: "1f2328", border: "d0d7de" },
} as const;

// Chart colors for series
export const CHART_COLORS = [
  "0550ae",
  "1a7f37",
  "9a6700",
  "6639ba",
  "953800",
  "cf222e",
];

// Typography
export const FONT = {
  heading: "Calibri Light",
  body: "Calibri",
} as const;

// Layout name mapping
const DEFAULT_LAYOUT = "16x9";
const LAYOUT_MAP: Record<string, string> = {
  "16x9": "LAYOUT_16x9",
  "16x10": "LAYOUT_16x10",
  "4x3": "LAYOUT_4x3",
} as const;

// =============================================================================
// SLIDE MASTERS
// =============================================================================

function defineAlexSlideMasters(pres: pptxgen): void {
  // Title Slide — clean white with left brand accent bar
  pres.defineSlideMaster({
    title: "ALEX_TITLE",
    background: { color: "FFFFFF" },
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: 0.3,
          h: "100%",
          fill: { color: ALEX_COLORS.blue.text },
        },
      },
      {
        rect: {
          x: 0.3,
          y: 5.3,
          w: 9.7,
          h: 0.03,
          fill: { color: ALEX_COLORS.green.text },
        },
      },
    ],
  });

  // Content Slide — minimal white with thin top accent
  pres.defineSlideMaster({
    title: "ALEX_CONTENT",
    background: { color: "FFFFFF" },
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: "100%",
          h: 0.04,
          fill: { color: ALEX_COLORS.blue.text },
        },
      },
      {
        rect: {
          x: 0.6,
          y: 5.35,
          w: 8.8,
          h: 0.008,
          fill: { color: ALEX_COLORS.gray.border },
        },
      },
    ],
    slideNumber: {
      x: 9.2,
      y: 5.38,
      color: ALEX_COLORS.gray.border,
      fontSize: 9,
      fontFace: FONT.body,
    },
  });

  // Section Divider — bold blue with geometric accent
  pres.defineSlideMaster({
    title: "ALEX_SECTION",
    background: { color: ALEX_COLORS.blue.text },
    objects: [
      { rect: { x: 7.5, y: 0, w: 2.5, h: "100%", fill: { color: "1a6bc4" } } },
      {
        rect: {
          x: 1.2,
          y: 3.5,
          w: 4.5,
          h: 0.025,
          fill: { color: ALEX_COLORS.gold.border },
        },
      },
    ],
  });

  // Chart Slide — same as content
  pres.defineSlideMaster({
    title: "ALEX_CHART",
    background: { color: "FFFFFF" },
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: "100%",
          h: 0.04,
          fill: { color: ALEX_COLORS.blue.text },
        },
      },
      {
        rect: {
          x: 0.6,
          y: 5.35,
          w: 8.8,
          h: 0.008,
          fill: { color: ALEX_COLORS.gray.border },
        },
      },
    ],
    slideNumber: {
      x: 9.2,
      y: 5.38,
      color: ALEX_COLORS.gray.border,
      fontSize: 9,
      fontFace: FONT.body,
    },
  });
}

// =============================================================================
// MARKDOWN PARSER
// =============================================================================

/**
 * Detect if content has presentation structure markers
 * Returns true if content appears to be formatted for slides
 */
export function hasSlideStructure(content: string): boolean {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let hasHeadings = false;
  let hasBullets = false;
  let hasSlideBreaks = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ") || trimmed.startsWith("## ")) {
      hasHeadings = true;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      hasBullets = true;
    }
    if (trimmed === "---") {
      hasSlideBreaks = true;
    }
  }

  // Structured if has headings AND (bullets OR slide breaks)
  return hasHeadings && (hasBullets || hasSlideBreaks);
}

/**
 * Estimate presentation quality from markdown
 * Returns score 0-100 and suggestions
 */
export function analyzeSlideContent(markdown: string): {
  score: number;
  suggestions: string[];
  slideCount: number;
  hasNotes: boolean;
  hasSections: boolean;
  hasTables: boolean;
} {
  const suggestions: string[] = [];
  const slides = parseMarkdownToSlides(markdown);
  const slideCount = slides.length;

  let score = 0;
  const hasNotes = slides.some((s) => s.notes && s.notes.trim());
  const hasSections = slides.some((s) => s.type === "section");
  const hasTables = slides.some((s) => s.type === "table");
  const hasTitleSlide = slides.length > 0 && slides[0].type === "title";

  // Scoring
  if (slideCount >= 3) {
    score += 20;
  }
  if (slideCount >= 5 && slideCount <= 15) {
    score += 10;
  }
  if (hasTitleSlide) {
    score += 15;
  }
  if (hasSections) {
    score += 15;
  }
  if (hasNotes) {
    score += 15;
  }
  if (hasTables) {
    score += 10;
  }

  // Check bullet density
  const avgBullets =
    slides.reduce((sum, s) => sum + (s.bullets?.length || 0), 0) /
    Math.max(slideCount, 1);
  if (avgBullets >= 2 && avgBullets <= 6) {
    score += 15;
  }

  // Suggestions
  if (!hasTitleSlide) {
    suggestions.push("Add a title slide with # Title and ## Subtitle");
  }
  if (!hasSections && slideCount > 5) {
    suggestions.push("Add section dividers with ## Title [section]");
  }
  if (!hasNotes) {
    suggestions.push("Add speaker notes with > Note text");
  }
  if (avgBullets > 7) {
    suggestions.push("Reduce bullets per slide to 5-7 for readability");
  }
  if (avgBullets < 2) {
    suggestions.push("Add more bullet points for substance");
  }
  if (slideCount < 3) {
    suggestions.push("Add more content - aim for 5-10 slides");
  }

  return { score, suggestions, slideCount, hasNotes, hasSections, hasTables };
}

/**
 * Parse a markdown table into TableData
 */
function parseMarkdownTable(lines: string[]): TableData | null {
  // Find table lines (start with |)
  const tableLines = lines.filter(
    (l) => l.trim().startsWith("|") && l.trim().endsWith("|"),
  );
  if (tableLines.length < 2) {
    return null;
  }

  // Parse header row
  const headerLine = tableLines[0];
  const headers = headerLine
    .split("|")
    .map((h) => h.trim())
    .filter((h) => h && !h.match(/^[-:]+$/));

  if (headers.length === 0) {
    return null;
  }

  // Skip separator row, parse data rows
  const rows: string[][] = [];
  for (let i = 1; i < tableLines.length; i++) {
    const line = tableLines[i];
    // Skip separator row (contains only dashes and colons)
    if (line.match(/^\|[\s\-:]+\|$/)) {
      continue;
    }

    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c !== "");

    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return rows.length > 0 ? { headers, rows } : null;
}

/**
 * Parse illustration syntax from markdown image format:
 * - ![icon:chart-bar] → Lucide icon (bundled)
 * - ![icon:lightbulb#0550ae] → Lucide icon with color
 * - ![iconify:mdi/chart-bar] → Iconify API icon (150K+ icons)
 * - ![iconify:heroicons/users#0550ae] → Iconify with color
 * - ![avatar:John] → DiceBear avatar (open-peeps default)
 * - ![avatar:Jane#avataaars] → DiceBear with style
 * - ![stock:collaboration] → Stock business illustration
 * - ![svg:./path/file.svg] → User-provided SVG file (explicit path)
 * - ![image:./path/logo.png] → User-provided image file (explicit path)
 * - ![ticker:AAPL] → Company logo by stock ticker (via Logo API)
 *
 * Returns IllustrationData or null if not an illustration syntax
 */
function parseIllustrationSyntax(text: string): IllustrationData | null {
  // Match: ![type:value] or ![type:value#color/style] with optional caption
  const match = text.match(
    /!\[(icon|iconify|avatar|stock|svg|ticker|image):([^\]#]+)(?:#([a-zA-Z0-9-]+))?\](?:\(([^)]*)\))?/,
  );
  if (!match) {
    return null;
  }

  const [, type, value, modifier, caption] = match;

  if (type === "icon") {
    // Validate icon exists in bundled set
    if (!getIcon(value)) {
      console.warn(
        `Unknown icon: ${value}. Available: ${listIconNames().join(", ")}`,
      );
      return null;
    }
    return {
      type: "icon",
      value: value.trim(),
      color: modifier, // Optional hex color
      caption: caption,
    };
  } else if (type === "iconify") {
    // Iconify API icons: prefix/name format
    const parsed = parseIconifyValue(value);
    if (!parsed) {
      console.warn(
        `Invalid iconify format: ${value}. Use prefix/name (e.g., mdi/chart-bar)`,
      );
      return null;
    }
    return {
      type: "iconify",
      value: value.trim(),
      color: modifier, // Optional hex color
      caption: caption,
    };
  } else if (type === "avatar") {
    // DiceBear avatars: seed or seed#style
    return {
      type: "avatar",
      value: value.trim(),
      color: modifier, // Actually the style (open-peeps, avataaars, etc.)
      caption: caption,
    };
  } else if (type === "stock") {
    // Validate stock illustration exists
    if (!getStockIllustration(value)) {
      console.warn(
        `Unknown stock illustration: ${value}. Available: ${listStockIllustrationNames().join(", ")}`,
      );
      return null;
    }
    return {
      type: "stock",
      value: value.trim(),
      caption: caption,
    };
  } else if (type === "svg") {
    // Explicit SVG file path
    return {
      type: "svg",
      value: value.trim(),
      caption: caption,
    };
  } else if (type === "image") {
    // Explicit image file path (PNG, JPG, etc.)
    return {
      type: "image",
      value: value.trim(),
      caption: caption,
    };
  } else if (type === "ticker") {
    // Stock ticker for API lookup
    return {
      type: "ticker",
      value: value.trim().toUpperCase(),
      caption: caption,
    };
  }

  return null;
}

/**
 * Parse markdown content into slide structure
 * Handles: # → title, ## → subtitle/section, - → bullets, > → notes, | tables |, ![icon/stock/svg:...]
 * Skips: fenced code blocks (```), inline code, HTML comments
 */
export function parseMarkdownToSlides(markdown: string): SlideContent[] {
  const slides: SlideContent[] = [];
  // Remove HTML comments before parsing
  const cleanMarkdown = markdown.replace(/<!--[\s\S]*?-->/g, "");
  const sections = cleanMarkdown.split(/^---$/m).filter((s) => s.trim());

  for (const section of sections) {
    // Remove fenced code blocks before parsing
    const cleanedSection = section.replace(/```[\s\S]*?```/g, "");
    const lines = cleanedSection.trim().replace(/\r\n/g, "\n").split("\n");
    let currentSlide: SlideContent = { type: "content", bullets: [] };
    let inTable = false;
    const tableLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and inline code remnants
      if (!trimmed || trimmed.startsWith("`")) {
        // If we were in a table, process it now
        if (inTable && tableLines.length > 0) {
          const tableData = parseMarkdownTable(tableLines);
          if (tableData) {
            currentSlide.type = "table";
            currentSlide.data = tableData;
          }
          tableLines.length = 0;
          inTable = false;
        }
        continue;
      }

      // Check for table row
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        inTable = true;
        tableLines.push(trimmed);
        continue;
      } else if (inTable && tableLines.length > 0) {
        // End of table, process it
        const tableData = parseMarkdownTable(tableLines);
        if (tableData) {
          currentSlide.type = "table";
          currentSlide.data = tableData;
        }
        tableLines.length = 0;
        inTable = false;
      }

      if (trimmed.startsWith("# ")) {
        // If this is the first slide and only a title, make it title slide
        if (slides.length === 0 && currentSlide.bullets?.length === 0) {
          currentSlide.type = "title";
        }
        currentSlide.title = trimmed.replace(/^#\s+/, "");
      } else if (trimmed.startsWith("## ")) {
        // Check for section indicator
        if (trimmed.toLowerCase().includes("[section]")) {
          currentSlide.type = "section";
          currentSlide.title = trimmed
            .replace(/^##\s+/, "")
            .replace(/\[section\]/i, "")
            .trim();
        } else {
          currentSlide.subtitle = trimmed.replace(/^##\s+/, "");
        }
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        currentSlide.bullets = currentSlide.bullets || [];
        // Remove inline code backticks from bullets
        currentSlide.bullets.push(
          trimmed.replace(/^[-*]\s+/, "").replace(/`/g, ""),
        );
      } else if (trimmed.startsWith("> ")) {
        // Speaker notes
        currentSlide.notes =
          (currentSlide.notes || "") + trimmed.replace(/^>\s+/, "") + "\n";
      } else if (trimmed.match(/^!\[(icon|stock|svg|logo|ticker|image):/)) {
        // Illustration syntax: ![icon:name], ![stock:name], ![svg:path], ![logo:name], ![ticker:AAPL], ![image:path]
        const illustration = parseIllustrationSyntax(trimmed);
        if (illustration) {
          // If this is the only content, make it an illustration slide
          if (
            !currentSlide.title &&
            (!currentSlide.bullets || currentSlide.bullets.length === 0)
          ) {
            currentSlide.type = "illustration";
            currentSlide.data = { illustration } as IllustrationSlideData;
          } else {
            // Add as inline illustration
            currentSlide.illustrations = currentSlide.illustrations || [];
            currentSlide.illustrations.push(illustration);
          }
        }
      }
    }

    // Handle table at end of section
    if (inTable && tableLines.length > 0) {
      const tableData = parseMarkdownTable(tableLines);
      if (tableData) {
        currentSlide.type = "table";
        currentSlide.data = tableData;
      }
    }

    if (
      currentSlide.title ||
      (currentSlide.bullets && currentSlide.bullets.length > 0) ||
      currentSlide.data
    ) {
      slides.push(currentSlide);
    }
  }

  return slides;
}

// =============================================================================
// MAIN GENERATOR
// =============================================================================

/**
 * Generate a PowerPoint presentation
 */
export async function generatePresentation(
  slides: SlideContent[],
  options: PresentationOptions,
): Promise<GenerateResult> {
  try {
    const pres = new pptxgen();

    // Metadata
    pres.author = options.author || "Alex Cognitive Architecture";
    pres.company = options.company || "Alex";
    pres.subject = options.subject || "Auto-generated presentation";
    pres.title = options.title;

    // Layout - use extracted constant
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pres.layout = LAYOUT_MAP[options.layout || DEFAULT_LAYOUT] as any;

    // Define Alex brand slide masters
    defineAlexSlideMasters(pres);

    // Build slides
    for (const slideContent of slides) {
      switch (slideContent.type) {
        case "title":
          addTitleSlide(pres, slideContent);
          break;
        case "section":
          addSectionSlide(pres, slideContent);
          break;
        case "chart":
          addChartSlide(pres, slideContent);
          break;
        case "table":
          addTableSlide(pres, slideContent);
          break;
        case "image":
          addImageSlide(pres, slideContent);
          break;
        case "illustration":
          addIllustrationSlide(pres, slideContent);
          break;
        case "twoColumn":
          addTwoColumnSlide(pres, slideContent);
          break;
        case "content":
        default:
          addContentSlide(pres, slideContent);
          break;
      }
    }

    // Generate output
    const base64 = (await pres.write({ outputType: "base64" })) as string;

    return {
      success: true,
      base64,
      slideCount: slides.length,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Generate and save a PowerPoint presentation to disk
 */
export async function generateAndSavePresentation(
  slides: SlideContent[],
  options: PresentationOptions,
  outputPath: string,
): Promise<GenerateResult> {
  const result = await generatePresentation(slides, options);

  if (!result.success || !result.base64) {
    return result;
  }

  try {
    // Ensure directory exists
    await fs.ensureDir(path.dirname(outputPath));

    // Convert base64 to buffer and write
    const buffer = Buffer.from(result.base64, "base64");
    await fs.writeFile(outputPath, buffer);

    return {
      success: true,
      filePath: outputPath,
      slideCount: result.slideCount,
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to save file: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
