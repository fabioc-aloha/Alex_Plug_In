/**
 * globalKnowledgeContent.ts - Content templates and scaffolding for Global Knowledge
 *
 * Contains all content generation functions: SVG banners, starter patterns,
 * README content, user guide, copilot instructions, and repository scaffolding.
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import {
    IGlobalKnowledgeEntry,
    IGlobalKnowledgeIndex,
} from '../shared/constants';
import { getAnimatedBannerSvg } from './globalKnowledgeBanner';
import { getStarterPatterns } from './globalKnowledgePatterns';

export async function scaffoldGlobalKnowledgeRepo(repoPath: string): Promise<void> {
    // Create directories
    await fs.ensureDir(path.join(repoPath, 'patterns'));
    await fs.ensureDir(path.join(repoPath, 'insights'));
    await fs.ensureDir(path.join(repoPath, '.github'));
    await fs.ensureDir(path.join(repoPath, 'assets'));
    
    const repoName = path.basename(repoPath);
    const now = new Date().toISOString();
    
    // Create animated banner SVG
    const bannerPath = path.join(repoPath, 'assets', 'banner.svg');
    if (!await fs.pathExists(bannerPath)) {
        const banner = getAnimatedBannerSvg();
        await fs.writeFile(bannerPath, banner, 'utf-8');
    }
    
    // Create starter patterns
    const starterPatterns = getStarterPatterns(now);
    
    // Create index.json with starter entries
    const indexPath = path.join(repoPath, 'index.json');
    if (!await fs.pathExists(indexPath)) {
        const initialIndex: IGlobalKnowledgeIndex = {
            version: '1.0.0',
            lastUpdated: now,
            entries: starterPatterns.map(p => ({
                id: p.id,
                title: p.title,
                type: 'pattern' as const,
                category: p.category as IGlobalKnowledgeEntry['category'],
                tags: p.tags,
                filePath: `patterns/${p.filename}`,
                created: now,
                modified: now,
                summary: p.title,
                sourceProject: 'Alex Starter Pack'
            }))
        };
        await fs.writeJson(indexPath, initialIndex, { spaces: 2 });
    }
    
    // Write starter pattern files
    for (const pattern of starterPatterns) {
        const patternPath = path.join(repoPath, 'patterns', pattern.filename);
        if (!await fs.pathExists(patternPath)) {
            await fs.writeFile(patternPath, pattern.content, 'utf-8');
        }
    }
    
    // Create README.md as main user manual
    const readmePath = path.join(repoPath, 'README.md');
    if (!await fs.pathExists(readmePath)) {
        const readme = getReadmeContent(repoName);
        await fs.writeFile(readmePath, readme, 'utf-8');
    }
    
    // Create USER-GUIDE.md with detailed instructions
    const userGuidePath = path.join(repoPath, 'USER-GUIDE.md');
    if (!await fs.pathExists(userGuidePath)) {
        const userGuide = getUserGuideContent();
        await fs.writeFile(userGuidePath, userGuide, 'utf-8');
    }
    
    // Create .github/copilot-instructions.md for the GK repo
    const gkInstructionsPath = path.join(repoPath, '.github', 'copilot-instructions.md');
    if (!await fs.pathExists(gkInstructionsPath)) {
        const instructions = getCopilotInstructionsContent();
        await fs.ensureDir(path.dirname(gkInstructionsPath));
        await fs.writeFile(gkInstructionsPath, instructions, 'utf-8');
    }
    
    // Create .gitignore
    const gitignorePath = path.join(repoPath, '.gitignore');
    if (!await fs.pathExists(gitignorePath)) {
        await fs.writeFile(gitignorePath, `# OS files
.DS_Store
Thumbs.db

# Sync state (local only)
sync-metadata.json
`, 'utf-8');
    }
}

/**
 * Generate README content for new GK repos
 */
function getReadmeContent(repoName: string): string {
    return `<div align="center">

![Global Knowledge Banner](assets/banner.svg)

</div>

# 🌐 ${repoName}

> **Your personal knowledge base that travels across all your projects**

---

## ⭐ Premium Features

| Feature | Description |
|---------|-------------|
| 🔍 **Search Knowledge** | Find patterns and insights instantly across all projects |
| 💡 **Save Insights** | Capture debugging discoveries and "aha!" moments |
| 📈 **Promote Patterns** | Share reusable solutions globally |
| 📁 **Git Sync** | Knowledge travels via any Git provider |
| 👥 **Team Sharing** | Standard Git collaboration (GitHub, Azure DevOps, GitLab) |

---

## What Is This?

This repository is your **long-term memory** for insights and patterns. Unlike project-local memory (stored in each project's \`.github/\` folder), global knowledge lives here and is available **everywhere** Alex operates.

Think of it as your brain's external hard drive — learnings from one project become wisdom for all projects.

## Quick Start

### Searching Knowledge
\`\`\`
@alex /knowledge error handling
@alex /knowledge typescript best practices
\`\`\`

### Saving Knowledge
When you learn something valuable, save it:
\`\`\`
@alex /saveinsight
\`\`\`
Alex will help format and categorize your learning.

### Promoting Project Knowledge
When a project-specific skill deserves to be global:
\`\`\`
@alex /promote
\`\`\`

### Checking Status
\`\`\`
@alex /knowledgestatus
\`\`\`

## Repository Structure

\`\`\`
${repoName}/
├── README.md            # You are here
├── USER-GUIDE.md        # Detailed usage guide
├── index.json           # Master index (auto-managed by Alex)
├── assets/
│   └── banner.svg       # Animated repository banner
├── patterns/            # GK-* reusable solutions
│   ├── GK-starter-code-quality-principles.md
│   ├── GK-starter-documentation-structure.md
│   └── GK-starter-error-handling.md
├── insights/            # GI-* timestamped learnings
├── .github/
│   └── copilot-instructions.md  # AI context
└── .gitignore
\`\`\`

> **Note**: No GitHub Actions are included by default. Alex manages the index automatically via VS Code commands. If you want CI/CD validation, you can add your own workflows.

## Knowledge Types

| Type | Prefix | Description | Example |
|------|--------|-------------|---------|
| **Pattern** | GK-* | Reusable solutions, best practices | API design patterns, testing strategies |
| **Insight** | GI-* | Timestamped learnings from specific situations | "React hooks gotcha discovered 2026-01-24" |

## Sharing Your Knowledge

Since this is a standard Git repository, sharing works with **any Git provider**:

| Access Level | Platform Examples | Use Case |
|--------------|-------------------|----------|
| **Private** | GitHub, Azure DevOps, GitLab | Personal knowledge vault |
| **Team** | Private repo + collaborators | Shared team learnings |
| **Organization** | Org-owned repo | Enterprise knowledge base |
| **Public** | Public repo | Open-source knowledge sharing |

To share, just:
1. Push this repo to your Git provider (GitHub, Azure DevOps, GitLab, etc.)
2. Adjust repository visibility in your provider's settings
3. Add collaborators if needed

## Starter Patterns Included

We've included 3 starter patterns to help you understand the format:

1. **Code Quality Principles** — DRY, KISS, refactoring triggers
2. **Documentation Structure** — README templates, doc hierarchy
3. **Error Handling Patterns** — Async/await patterns, API errors

Feel free to customize, delete, or build upon these.

---

📚 See [USER-GUIDE.md](USER-GUIDE.md) for detailed instructions.

*Part of the [Alex Cognitive Architecture](https://github.com/fabioc-aloha/Alex_Plug_In)*
`;
}

/**
 * Generate USER-GUIDE content for new GK repos
 */
function getUserGuideContent(): string {
    return getUserGuideIntro()
        + getUserGuideCommands()
        + getUserGuideIndex()
        + getUserGuideBestPractices();
}

function getUserGuideIntro(): string {
    return `# Global Knowledge User Guide

> Complete guide to managing your cross-project knowledge

## Table of Contents

1. [Understanding Global Knowledge](#understanding-global-knowledge)
2. [Knowledge Types](#knowledge-types)
3. [Commands Reference](#commands-reference)
4. [Creating Knowledge Manually](#creating-knowledge-manually)
5. [Index Management](#index-management)
6. [Sharing and Collaboration](#sharing-and-collaboration)
7. [Best Practices](#best-practices)

---

## Understanding Global Knowledge

Global Knowledge (GK) is a cross-project knowledge base that:

- **Persists** across all your projects
- **Travels** with you via Git
- **Grows** as you save insights and patterns
- **Integrates** automatically with Alex in any project

### How Alex Finds Your GK

Alex looks for your GK repo as a **sibling folder** to your current project:

\`\`\`
Development/
├── YourProject/           ← You're working here
├── AnotherProject/
└── Alex-Global-Knowledge/ ← Alex finds this automatically
\`\`\`

The folder name can contain "global", "knowledge", or "Alex".

---

## Knowledge Types

### Patterns (GK-*)

**What**: Reusable solutions that apply to many situations
**When**: Best practices, design patterns, templates
**Lifespan**: Long-lived, evolving over time

Example: \`patterns/GK-api-design-rest-conventions.md\`

\`\`\`markdown
# API Design: REST Conventions

**ID**: GK-api-design-rest-conventions
**Category**: api-design
**Tags**: rest, api, conventions, http
**Source**: Your Team
**Created**: 2026-02-06T10:00:00Z

---

## Naming Conventions
- Use plural nouns: \`/users\`, not \`/user\`
- Use kebab-case: \`/user-profiles\`, not \`/userProfiles\`
...
\`\`\`

### Insights (GI-*)

**What**: Specific learnings captured at a moment in time
**When**: Debugging discoveries, gotchas, "aha!" moments
**Lifespan**: Timestamped, reference material

Example: \`insights/GI-react-useeffect-cleanup-gotcha-2026-02-06.md\`

\`\`\`markdown
# React useEffect Cleanup Gotcha

**ID**: GI-react-useeffect-cleanup-gotcha-2026-02-06
**Category**: debugging
**Tags**: react, hooks, useeffect, memory-leak
**Source Project**: MyApp
**Date**: 2026-02-06T10:00:00Z

---

## Context
While debugging memory leaks in MyApp...

## Insight
The cleanup function must be returned, not called directly...

## Solution
\\\`\\\`\\\`typescript
useEffect(() => {
  const cleanup = subscribe();
  return cleanup; // ✓ Correct
  // cleanup();   // ✗ Wrong - runs immediately
}, []);
\\\`\\\`\\\`
\`\`\`

---
`;
}

function getUserGuideCommands(): string {
    return `
## Commands Reference

| Command | Description |
|---------|-------------|
| \`/knowledge <query>\` | Search patterns and insights |
| \`/saveinsight\` | Save current learning as insight |
| \`/promote\` | Promote project knowledge to global |
| \`/knowledgestatus\` | View statistics and health |

### /knowledge Examples

\`\`\`
/knowledge error handling typescript
/knowledge react hooks gotcha
/knowledge api design patterns
\`\`\`

---

## Creating Knowledge Manually

### Step 1: Choose Type

- **Pattern** → Reusable, broadly applicable
- **Insight** → Specific moment, timestamped

### Step 2: Create the File

\`\`\`
patterns/GK-{descriptive-slug}.md
insights/GI-{descriptive-slug}-{date}.md
\`\`\`

### Step 3: Add Frontmatter

Required metadata at the top of each file:

**For Patterns:**
\`\`\`markdown
# Title

**ID**: GK-{slug}
**Category**: {category}
**Tags**: tag1, tag2, tag3
**Source**: {project-or-team-name}
**Created**: {ISO-timestamp}

---

(content)
\`\`\`

**For Insights:**
\`\`\`markdown
# Title

**ID**: GI-{slug}-{date}
**Category**: {category}
**Tags**: tag1, tag2, tag3
**Source Project**: {project-name}
**Date**: {ISO-timestamp}

---

(content)
\`\`\`

### Step 4: Update Index

Add entry to \`index.json\`:

\`\`\`json
{
  "entries": [
    {
      "id": "GK-your-pattern-slug",
      "title": "Your Pattern Title",
      "type": "pattern",
      "category": "patterns",
      "tags": ["tag1", "tag2"],
      "filePath": "patterns/GK-your-pattern-slug.md",
      "createdAt": "2026-02-06T10:00:00Z",
      "updatedAt": "2026-02-06T10:00:00Z",
      "source": "YourProject"
    }
  ]
}
\`\`\`

---
`;
}

function getUserGuideIndex(): string {
    return `
## Index Management

### Alex-Managed Approach

This repository is designed to be **managed by Alex**, not GitHub Actions. When you use commands like \`/saveinsight\` or \`/promote\`, Alex:

1. Creates the markdown file with proper frontmatter
2. Updates \`index.json\` atomically
3. Sets metadata (timestamps, IDs, categories)

This keeps the repository simple and portable — no CI/CD dependencies, works offline, and syncs via standard Git.

### Why No CI/CD Workflows?

| Approach | Pros | Cons |
|----------|------|------|
| **Alex-Managed** (current) | Simple, portable, offline-friendly, no workflow failures | Requires VS Code |
| **CI/CD Workflows** | Automated validation | Dependency on specific platform, workflow complexity |

You can add your own workflows if you need CI validation.

### Automatic Updates

When you use \`/saveinsight\` or \`/promote\`, Alex automatically:
1. Creates the markdown file
2. Updates \`index.json\`
3. Sets proper metadata

### Manual Maintenance

If you edit files manually:
\`\`\`bash
# Validate index matches files
git status

# Commit with clear message
git commit -m "knowledge: add GK-new-pattern"
\`\`\`

### Index Schema

\`\`\`json
{
  "version": "1.0.0",
  "lastUpdated": "ISO-timestamp",
  "entries": [
    {
      "id": "unique-id",
      "title": "Human-readable title",
      "type": "pattern|insight",
      "category": "category-slug",
      "tags": ["array", "of", "tags"],
      "filePath": "relative/path/to/file.md",
      "createdAt": "ISO-timestamp",
      "updatedAt": "ISO-timestamp",
      "source": "origin-project-or-team"
    }
  ]
}
\`\`\`

---

## Sharing and Collaboration

### Personal Use
Keep the repo private on your Git provider (GitHub, Azure DevOps, GitLab, etc.). Only you access your knowledge.

### Team Sharing
1. Create org-owned repo or add collaborators
2. Team members clone as sibling folder
3. Use standard Git workflow for contributions:
   \`\`\`
   git checkout -b knowledge/add-api-patterns
   git commit -m "knowledge: add API design patterns"
   git push origin knowledge/add-api-patterns
   # Create PR for review
   \`\`\`

### Knowledge Contributions
When multiple people contribute:
- Use PRs for review
- Avoid duplicate entries
- Agree on tagging conventions
- Consider a CODEOWNERS file

---
`;
}

function getUserGuideBestPractices(): string {
    return `
## Best Practices

### Naming
- Use descriptive slugs: \`error-handling-async\` not \`errors\`
- Keep filenames short but meaningful
- Use lowercase with hyphens

### Tagging
- Use 3-6 tags per entry
- Prefer existing tags when possible
- Include language/framework tags

### Content
- Include code examples
- Explain "why", not just "what"
- Link to external references
- Keep entries focused (one concept per file)

### Maintenance
- Review quarterly for outdated entries
- Delete starter patterns once you have your own
- Archive instead of delete for historical value

---

## Categories

| Category | Description |
|----------|-------------|
| \`architecture\` | System design, patterns |
| \`api-design\` | REST, GraphQL, API patterns |
| \`debugging\` | Troubleshooting, diagnostics |
| \`deployment\` | CI/CD, infrastructure |
| \`documentation\` | Docs, comments, diagrams |
| \`error-handling\` | Exception handling, recovery |
| \`patterns\` | General design patterns |
| \`performance\` | Optimization, profiling |
| \`refactoring\` | Code improvement |
| \`security\` | Auth, encryption, vulnerabilities |
| \`testing\` | Unit, integration, E2E |
| \`tooling\` | Dev tools, configuration |
| \`general\` | Uncategorized |

---

*Part of the [Alex Cognitive Architecture](https://github.com/fabioc-aloha/Alex_Plug_In)*
`;
}

/**
 * Generate copilot-instructions.md content for GK repos
 */
function getCopilotInstructionsContent(): string {
    return `# Alex Global Knowledge Repository

This repository stores cross-project knowledge for the Alex Cognitive Architecture.

## Purpose

- **Patterns** (\`patterns/\`): Reusable solutions (GK-* files)
- **Insights** (\`insights/\`): Timestamped learnings (GI-* files)
- **Index** (\`index.json\`): Master search index

## File Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Pattern | \`GK-{slug}.md\` | \`GK-error-handling-patterns.md\` |
| Insight | \`GI-{slug}-{date}.md\` | \`GI-react-hooks-gotcha-2026-01-24.md\` |

## Required Frontmatter

### Patterns
\`\`\`markdown
# Pattern Title

**ID**: GK-pattern-slug
**Category**: category-name
**Tags**: tag1, tag2, tag3
**Source**: Original project name
**Created**: ISO timestamp
\`\`\`

### Insights
\`\`\`markdown
# Insight Title

**ID**: GI-insight-slug-date
**Category**: category-name
**Tags**: tag1, tag2, tag3
**Source Project**: project-name
**Date**: ISO timestamp
\`\`\`

## When Adding Knowledge

1. Create the markdown file in the appropriate folder
2. Update \`index.json\` with the new entry
3. Commit with message: \`knowledge: add GK-xxx\` or \`insight: add GI-xxx\`

## Categories

Valid categories: \`architecture\`, \`api-design\`, \`debugging\`, \`deployment\`, \`documentation\`, \`error-handling\`, \`patterns\`, \`performance\`, \`refactoring\`, \`security\`, \`testing\`, \`tooling\`, \`general\`
`;
}

/**
 * Get the Global Knowledge repository path.
 * Returns the detected repo path, or null if not found.
 */
