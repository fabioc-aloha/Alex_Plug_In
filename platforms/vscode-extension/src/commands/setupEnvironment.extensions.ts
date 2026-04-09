/**
 * setupEnvironment.extensions.ts - Recommended extensions for Alex
 *
 * Extracted from setupEnvironment.ts for easier review and maintenance.
 * Each entry describes a VS Code extension that Alex works best with.
 */

export interface RecommendedExtension {
  id: string;
  name: string;
  /** Why this extension matters for Alex */
  purpose: string;
  /** Cognitive level unlocked by this extension */
  unlocksLevel: number;
  /** Is Alex usable without it? */
  required: boolean;
}

/**
 * Extensions that Alex works best with.
 * Ordered by importance: required first, then nice-to-have.
 */
export const RECOMMENDED_EXTENSIONS: RecommendedExtension[] = [
  {
    id: "github.copilot",
    name: "GitHub Copilot",
    purpose:
      "AI language models — enables all AI-powered features (Levels 2-4)",
    unlocksLevel: 2,
    required: false, // Alex Level 1 works without it
  },
  {
    id: "github.copilot-chat",
    name: "GitHub Copilot Chat",
    purpose: "Chat interface, agent mode, @alex participant, slash commands",
    unlocksLevel: 2,
    required: false,
  },
  {
    id: "bierner.markdown-mermaid",
    name: "Markdown Preview Mermaid",
    purpose: "Mermaid diagram rendering in documentation previews",
    unlocksLevel: 0,
    required: false,
  },
];
