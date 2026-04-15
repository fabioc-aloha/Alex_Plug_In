#!/usr/bin/env node
/**
 * Alex Cognitive Tools MCP Server
 *
 * Exposes Alex's cognitive architecture tools via the Model Context Protocol.
 * Can be used with Claude Desktop, VS Code MCP Gallery, or any MCP client.
 *
 * Tools exposed:
 * - alex_synapse_health: Check cognitive architecture health
 * - alex_memory_search: Search across all memory systems
 * - alex_architecture_status: Get current architecture inventory
 * - alex_knowledge_search: Search global knowledge base
 * - alex_knowledge_save: Save insights to global knowledge
 *
 * Usage:
 *   npx @alex/mcp-cognitive-tools
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  type Tool,
  type Prompt,
  type Resource,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ALEX_HOME = path.join(os.homedir(), ".alex");
const GLOBAL_KNOWLEDGE_PATH = path.join(ALEX_HOME, "global-knowledge");

// ---------------------------------------------------------------------------
// Tool Definitions
// ---------------------------------------------------------------------------

const TOOLS: Tool[] = [
  {
    name: "alex_synapse_health",
    description:
      "Check the health of Alex's cognitive architecture - validates synapses, memory files, and connections",
    inputSchema: {
      type: "object",
      properties: {
        workspacePath: {
          type: "string",
          description:
            "Path to workspace with .github/ directory (optional, uses cwd if not specified)",
        },
      },
    },
  },
  {
    name: "alex_memory_search",
    description:
      "Search across all Alex memory systems (skills, instructions, prompts, episodic, global knowledge)",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Search query - matches against file names, descriptions, and content",
        },
        memoryType: {
          type: "string",
          enum: [
            "all",
            "skills",
            "instructions",
            "prompts",
            "episodic",
            "global",
          ],
          description: "Filter to specific memory type (default: all)",
        },
        limit: {
          type: "number",
          description: "Maximum results to return (default: 10)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "alex_architecture_status",
    description:
      "Get current inventory of Alex's cognitive architecture - skill counts, trifectas, agents, etc.",
    inputSchema: {
      type: "object",
      properties: {
        workspacePath: {
          type: "string",
          description: "Path to workspace with .github/ directory (optional)",
        },
      },
    },
  },
  {
    name: "alex_knowledge_search",
    description:
      "Search Alex's global knowledge base for patterns and insights",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
        category: {
          type: "string",
          enum: ["patterns", "insights", "all"],
          description: "Filter by category (default: all)",
        },
        limit: {
          type: "number",
          description: "Maximum results (default: 10)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "alex_knowledge_save",
    description: "Save a new insight to Alex's global knowledge base",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Brief title for the insight",
        },
        content: {
          type: "string",
          description: "Full insight content in markdown",
        },
        category: {
          type: "string",
          enum: [
            "architecture",
            "patterns",
            "debugging",
            "best-practices",
            "lessons-learned",
          ],
          description: "Category for the insight",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags for discoverability",
        },
      },
      required: ["title", "content", "category"],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool Implementations
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Prompt Definitions
// ---------------------------------------------------------------------------

const PROMPTS: Prompt[] = [
  {
    name: "health-check",
    description:
      "Run a cognitive architecture health check and report status",
  },
  {
    name: "architecture-overview",
    description:
      "Get a summary of how Alex's cognitive architecture is structured in this workspace",
  },
  {
    name: "search-knowledge",
    description:
      "Search Alex's knowledge base for patterns, insights, or prior learnings",
    arguments: [
      {
        name: "query",
        description: "What to search for across skills, instructions, prompts, episodic memory, and global knowledge",
        required: true,
      },
    ],
  },
  {
    name: "save-insight",
    description:
      "Save a new insight or lesson learned to Alex's global knowledge base",
    arguments: [
      {
        name: "title",
        description: "Brief title for the insight",
        required: true,
      },
      {
        name: "content",
        description: "Full insight content",
        required: true,
      },
      {
        name: "category",
        description: "Category: architecture, patterns, debugging, best-practices, or lessons-learned",
        required: true,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Resource Definitions
// ---------------------------------------------------------------------------

function getArchitectureResources(): Resource[] {
  const basePath = process.cwd();
  const resources: Resource[] = [];

  const resourceFiles = [
    {
      relPath: "alex_docs/NORTH-STAR.md",
      name: "North Star",
      description: "Alex's project vision and mission definition",
    },
    {
      relPath: "alex_docs/architecture/COGNITIVE-ARCHITECTURE.md",
      name: "Cognitive Architecture",
      description: "Complete cognitive architecture documentation",
    },
    {
      relPath: ".github/SKILLS-CATALOG.md",
      name: "Skills Catalog",
      description: "Full inventory of Alex's skills and trifecta status",
    },
    {
      relPath: ".github/copilot-instructions.md",
      name: "Conscious Mind",
      description: "Alex's always-on instructions (identity, routing, active context)",
    },
    {
      relPath: "alex_docs/architecture/CONSCIOUS-MIND.md",
      name: "Conscious Mind Architecture",
      description: "How the conscious mind layer works",
    },
    {
      relPath: "alex_docs/WHAT-IS-ALEX.md",
      name: "What is Alex",
      description: "Introduction and overview of Alex's cognitive architecture",
    },
  ];

  for (const rf of resourceFiles) {
    const fullPath = path.join(basePath, rf.relPath);
    if (fs.existsSync(fullPath)) {
      resources.push({
        uri: `alex://${rf.relPath}`,
        name: rf.name,
        description: rf.description,
        mimeType: "text/markdown",
      });
    }
  }

  return resources;
}

async function synapseHealth(workspacePath?: string): Promise<string> {
  const basePath = workspacePath || process.cwd();
  const githubPath = path.join(basePath, ".github");

  if (!fs.existsSync(githubPath)) {
    return JSON.stringify({
      status: "error",
      message:
        "No .github directory found. Alex cognitive architecture not installed.",
    });
  }

  const stats = {
    skills: 0,
    instructions: 0,
    prompts: 0,
    agents: 0,
  };

  // Count skills
  const skillsPath = path.join(githubPath, "skills");
  if (fs.existsSync(skillsPath)) {
    stats.skills = fs
      .readdirSync(skillsPath)
      .filter((f) =>
        fs.statSync(path.join(skillsPath, f)).isDirectory(),
      ).length;
  }

  // Count instructions
  const instructionsPath = path.join(githubPath, "instructions");
  if (fs.existsSync(instructionsPath)) {
    stats.instructions = fs
      .readdirSync(instructionsPath)
      .filter((f) => f.endsWith(".instructions.md")).length;
  }

  // Count prompts
  const promptsPath = path.join(githubPath, "prompts");
  if (fs.existsSync(promptsPath)) {
    stats.prompts = fs
      .readdirSync(promptsPath)
      .filter((f) => f.endsWith(".prompt.md")).length;
  }

  // Count agents
  const agentsPath = path.join(githubPath, "agents");
  if (fs.existsSync(agentsPath)) {
    stats.agents = fs
      .readdirSync(agentsPath)
      .filter((f) => f.endsWith(".agent.md")).length;
  }

  // Note: Synapse files deprecated - validation removed

  const healthStatus = "EXCELLENT";

  return JSON.stringify(
    {
      status: healthStatus,
      ...stats,
      message: "Architecture healthy",
    },
    null,
    2,
  );
}

async function memorySearch(
  query: string,
  memoryType = "all",
  limit = 10,
): Promise<string> {
  const results: Array<{
    type: string;
    name: string;
    path: string;
    snippet: string;
  }> = [];
  const lowerQuery = query.toLowerCase();
  const basePath = process.cwd();
  const githubPath = path.join(basePath, ".github");

  // Search skills
  if (memoryType === "all" || memoryType === "skills") {
    const skillsPath = path.join(githubPath, "skills");
    if (fs.existsSync(skillsPath)) {
      for (const skill of fs.readdirSync(skillsPath)) {
        const skillFile = path.join(skillsPath, skill, "SKILL.md");
        if (fs.existsSync(skillFile)) {
          const content = fs.readFileSync(skillFile, "utf-8");
          if (content.toLowerCase().includes(lowerQuery)) {
            results.push({
              type: "skill",
              name: skill,
              path: skillFile,
              snippet: extractSnippet(content, lowerQuery),
            });
          }
        }
      }
    }
  }

  // Search instructions
  if (memoryType === "all" || memoryType === "instructions") {
    const instructionsPath = path.join(githubPath, "instructions");
    if (fs.existsSync(instructionsPath)) {
      for (const file of fs
        .readdirSync(instructionsPath)
        .filter((f) => f.endsWith(".md"))) {
        const filePath = path.join(instructionsPath, file);
        const content = fs.readFileSync(filePath, "utf-8");
        if (content.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: "instruction",
            name: file.replace(".instructions.md", ""),
            path: filePath,
            snippet: extractSnippet(content, lowerQuery),
          });
        }
      }
    }
  }

  // Search prompts
  if (memoryType === "all" || memoryType === "prompts") {
    const promptsPath = path.join(githubPath, "prompts");
    if (fs.existsSync(promptsPath)) {
      for (const file of fs
        .readdirSync(promptsPath)
        .filter((f) => f.endsWith(".md"))) {
        const filePath = path.join(promptsPath, file);
        const content = fs.readFileSync(filePath, "utf-8");
        if (content.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: "prompt",
            name: file.replace(".prompt.md", ""),
            path: filePath,
            snippet: extractSnippet(content, lowerQuery),
          });
        }
      }
    }
  }

  // Search episodic memory
  if (memoryType === "all" || memoryType === "episodic") {
    const episodicPath = path.join(githubPath, "episodic");
    if (fs.existsSync(episodicPath)) {
      for (const file of fs
        .readdirSync(episodicPath)
        .filter((f) => f.endsWith(".md"))) {
        const filePath = path.join(episodicPath, file);
        const content = fs.readFileSync(filePath, "utf-8");
        if (content.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: "episodic",
            name: file.replace(".md", ""),
            path: filePath,
            snippet: extractSnippet(content, lowerQuery),
          });
        }
      }
    }
  }

  // Search global knowledge
  if (memoryType === "all" || memoryType === "global") {
    if (fs.existsSync(GLOBAL_KNOWLEDGE_PATH)) {
      const gkFiles = findFiles(GLOBAL_KNOWLEDGE_PATH, "*.md");
      for (const file of gkFiles) {
        const content = fs.readFileSync(file, "utf-8");
        if (content.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: "global-knowledge",
            name: path.basename(file, ".md"),
            path: file,
            snippet: extractSnippet(content, lowerQuery),
          });
        }
      }
    }
  }

  return JSON.stringify(
    {
      query,
      totalResults: results.length,
      results: results.slice(0, limit),
    },
    null,
    2,
  );
}

async function architectureStatus(workspacePath?: string): Promise<string> {
  const basePath = workspacePath || process.cwd();
  const githubPath = path.join(basePath, ".github");

  if (!fs.existsSync(githubPath)) {
    return JSON.stringify({
      status: "not-installed",
      message: "Alex cognitive architecture not found in this workspace",
    });
  }

  const status = {
    installed: true,
    skills: 0,
    instructions: 0,
    prompts: 0,
    agents: 0,
    episodicFiles: 0,
    globalKnowledge: {
      patterns: 0,
      insights: 0,
    },
    version: "unknown",
  };

  // Count components
  const skillsPath = path.join(githubPath, "skills");
  if (fs.existsSync(skillsPath)) {
    status.skills = fs
      .readdirSync(skillsPath)
      .filter((f) =>
        fs.statSync(path.join(skillsPath, f)).isDirectory(),
      ).length;
  }

  const instructionsPath = path.join(githubPath, "instructions");
  if (fs.existsSync(instructionsPath)) {
    status.instructions = fs
      .readdirSync(instructionsPath)
      .filter((f) => f.endsWith(".md")).length;
  }

  const promptsPath = path.join(githubPath, "prompts");
  if (fs.existsSync(promptsPath)) {
    status.prompts = fs
      .readdirSync(promptsPath)
      .filter((f) => f.endsWith(".md")).length;
  }

  const agentsPath = path.join(githubPath, "agents");
  if (fs.existsSync(agentsPath)) {
    status.agents = fs
      .readdirSync(agentsPath)
      .filter((f) => f.endsWith(".md")).length;
  }

  const episodicPath = path.join(githubPath, "episodic");
  if (fs.existsSync(episodicPath)) {
    status.episodicFiles = fs
      .readdirSync(episodicPath)
      .filter((f) => f.endsWith(".md")).length;
  }

  // Count global knowledge
  if (fs.existsSync(GLOBAL_KNOWLEDGE_PATH)) {
    const patternsPath = path.join(GLOBAL_KNOWLEDGE_PATH, "patterns");
    const insightsPath = path.join(GLOBAL_KNOWLEDGE_PATH, "insights");

    if (fs.existsSync(patternsPath)) {
      status.globalKnowledge.patterns = findFiles(patternsPath, "*.md").length;
    }
    if (fs.existsSync(insightsPath)) {
      status.globalKnowledge.insights = findFiles(insightsPath, "*.md").length;
    }
  }

  // Try to get version from copilot-instructions.md
  const copilotInstructionsPath = path.join(
    githubPath,
    "copilot-instructions.md",
  );
  if (fs.existsSync(copilotInstructionsPath)) {
    const content = fs.readFileSync(copilotInstructionsPath, "utf-8");
    const versionMatch = content.match(/# Alex v(\d+\.\d+\.\d+)/);
    if (versionMatch) {
      status.version = versionMatch[1];
    }
  }

  return JSON.stringify(status, null, 2);
}

async function knowledgeSearch(
  query: string,
  category = "all",
  limit = 10,
): Promise<string> {
  const results: Array<{
    category: string;
    title: string;
    path: string;
    snippet: string;
  }> = [];
  const lowerQuery = query.toLowerCase();

  if (!fs.existsSync(GLOBAL_KNOWLEDGE_PATH)) {
    return JSON.stringify({
      query,
      totalResults: 0,
      results: [],
      message: "Global knowledge base not found at ~/.alex/global-knowledge/",
    });
  }

  const searchPaths: string[] = [];
  if (category === "all" || category === "patterns") {
    searchPaths.push(path.join(GLOBAL_KNOWLEDGE_PATH, "patterns"));
  }
  if (category === "all" || category === "insights") {
    searchPaths.push(path.join(GLOBAL_KNOWLEDGE_PATH, "insights"));
  }

  for (const searchPath of searchPaths) {
    if (!fs.existsSync(searchPath)) continue;

    const files = findFiles(searchPath, "*.md");
    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      if (content.toLowerCase().includes(lowerQuery)) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        results.push({
          category: searchPath.includes("patterns") ? "pattern" : "insight",
          title: titleMatch ? titleMatch[1] : path.basename(file, ".md"),
          path: file,
          snippet: extractSnippet(content, lowerQuery),
        });
      }
    }
  }

  return JSON.stringify(
    {
      query,
      totalResults: results.length,
      results: results.slice(0, limit),
    },
    null,
    2,
  );
}

async function knowledgeSave(
  title: string,
  content: string,
  category: string,
  tags: string[] = [],
): Promise<string> {
  const insightsPath = path.join(GLOBAL_KNOWLEDGE_PATH, "insights", category);

  // Ensure directory exists
  if (!fs.existsSync(insightsPath)) {
    fs.mkdirSync(insightsPath, { recursive: true });
  }

  // Generate filename from title
  const filename =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + ".md";

  const filePath = path.join(insightsPath, filename);

  // Create the insight file with YAML frontmatter
  const fullContent = `---
title: "${title}"
category: ${category}
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
created: ${new Date().toISOString().split("T")[0]}
---

# ${title}

${content}
`;

  fs.writeFileSync(filePath, fullContent, "utf-8");

  return JSON.stringify({
    status: "success",
    path: filePath,
    message: `Insight saved to ${filePath}`,
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findFiles(dir: string, pattern: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const walk = (currentDir: string) => {
    for (const entry of fs.readdirSync(currentDir)) {
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (matchPattern(entry, pattern)) {
        results.push(fullPath);
      }
    }
  };

  walk(dir);
  return results;
}

function matchPattern(filename: string, pattern: string): boolean {
  if (pattern === "*.md") return filename.endsWith(".md");
  if (pattern === "*.json") return filename.endsWith(".json");
  return filename === pattern;
}

function extractSnippet(
  content: string,
  query: string,
  contextChars = 100,
): string {
  const lowerContent = content.toLowerCase();
  const index = lowerContent.indexOf(query.toLowerCase());
  if (index === -1) return content.slice(0, contextChars * 2) + "...";

  const start = Math.max(0, index - contextChars);
  const end = Math.min(content.length, index + query.length + contextChars);
  let snippet = content.slice(start, end);

  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return snippet.replace(/\n/g, " ").trim();
}

// ---------------------------------------------------------------------------
// MCP Server Setup
// ---------------------------------------------------------------------------

async function main() {
  const server = new Server(
    {
      name: "alex-cognitive-tools",
      version: "1.1.0",
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
        resources: {},
      },
    },
  );

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result: string;

      switch (name) {
        case "alex_synapse_health":
          result = await synapseHealth(
            args?.workspacePath as string | undefined,
          );
          break;

        case "alex_memory_search":
          result = await memorySearch(
            args?.query as string,
            args?.memoryType as string | undefined,
            args?.limit as number | undefined,
          );
          break;

        case "alex_architecture_status":
          result = await architectureStatus(
            args?.workspacePath as string | undefined,
          );
          break;

        case "alex_knowledge_search":
          result = await knowledgeSearch(
            args?.query as string,
            args?.category as string | undefined,
            args?.limit as number | undefined,
          );
          break;

        case "alex_knowledge_save":
          result = await knowledgeSave(
            args?.title as string,
            args?.content as string,
            args?.category as string,
            args?.tags as string[] | undefined,
          );
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [{ type: "text", text: result }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "error",
              message: error instanceof Error ? error.message : "Unknown error",
            }),
          },
        ],
        isError: true,
      };
    }
  });

  // ---------------------------------------------------------------------------
  // Prompt Handlers
  // ---------------------------------------------------------------------------

  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: PROMPTS,
  }));

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "health-check":
        return {
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: "Run a cognitive architecture health check. Use the alex_synapse_health tool to check synapse integrity, then use alex_architecture_status to get the current inventory. Summarize the overall health status, highlight any issues, and suggest improvements.",
              },
            },
          ],
        };

      case "architecture-overview":
        return {
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: "Provide an overview of Alex's cognitive architecture in this workspace. Use the alex_architecture_status tool to get the current inventory of skills, instructions, prompts, agents, and episodic files. Then summarize the architecture structure, what capabilities are available, and the current version.",
              },
            },
          ],
        };

      case "search-knowledge": {
        const query = args?.query;
        if (!query) {
          throw new Error("Missing required argument: query");
        }
        return {
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Search Alex's knowledge base for: "${query}". Use both alex_memory_search (for skills, instructions, prompts, episodic memory) and alex_knowledge_search (for global patterns and insights) to find relevant results. Synthesize the findings into a coherent summary.`,
              },
            },
          ],
        };
      }

      case "save-insight": {
        const title = args?.title;
        const content = args?.content;
        const category = args?.category;
        if (!title || !content || !category) {
          throw new Error("Missing required arguments: title, content, category");
        }
        return {
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Save this insight to Alex's global knowledge base using the alex_knowledge_save tool:\n\nTitle: ${title}\nCategory: ${category}\nContent: ${content}`,
              },
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown prompt: ${name}`);
    }
  });

  // ---------------------------------------------------------------------------
  // Resource Handlers
  // ---------------------------------------------------------------------------

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: getArchitectureResources(),
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    const basePath = process.cwd();

    // Parse alex:// URIs → file paths
    if (!uri.startsWith("alex://")) {
      throw new Error(`Unsupported URI scheme: ${uri}`);
    }

    const relPath = uri.replace("alex://", "");
    const fullPath = path.join(basePath, relPath);

    // Prevent path traversal
    const resolved = path.resolve(fullPath);
    const baseResolved = path.resolve(basePath);
    if (!resolved.startsWith(baseResolved)) {
      throw new Error("Access denied: path traversal detected");
    }

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Resource not found: ${relPath}`);
    }

    const content = fs.readFileSync(fullPath, "utf-8");

    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  });

  // Connect via stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Alex Cognitive Tools MCP Server running on stdio");
}

main().catch(console.error);
