import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import * as lockfile from 'proper-lockfile';
import {
    ALEX_GLOBAL_HOME,
    GLOBAL_KNOWLEDGE_PATHS,
    GLOBAL_KNOWLEDGE_PREFIXES,
    GLOBAL_KNOWLEDGE_CATEGORIES,
    GlobalKnowledgeCategory,
    IGlobalKnowledgeEntry,
    IGlobalKnowledgeIndex,
    IProjectRegistry,
    IProjectRegistryEntry
} from '../shared/constants';

// Import cloud sync status for auto-sync suggestions
import { getSyncStatus, triggerPostModificationSync } from './cloudSync';

// ============================================================================
// GLOBAL KNOWLEDGE BASE UTILITIES
// ============================================================================

/**
 * Lock file options for concurrent access safety
 * Reduced timeouts to prevent freezes when locks are held by other processes
 */
const LOCK_OPTIONS = {
    stale: 5000,       // Consider lock stale after 5 seconds (reduced from 10)
    retries: {
        retries: 3,    // Reduced from 5 to fail faster
        factor: 2,
        minTimeout: 100,
        maxTimeout: 500  // Reduced from 1000
    }
};

/**
 * Get the full path to the Alex global home directory
 */
export function getAlexGlobalPath(): string {
    return path.join(os.homedir(), ALEX_GLOBAL_HOME);
}

/**
 * Get the full path to a global knowledge subdirectory
 */
export function getGlobalKnowledgePath(subpath: keyof typeof GLOBAL_KNOWLEDGE_PATHS): string {
    return path.join(os.homedir(), GLOBAL_KNOWLEDGE_PATHS[subpath]);
}

/**
 * Ensure all global knowledge directories exist
 */
export async function ensureGlobalKnowledgeDirectories(): Promise<void> {
    const paths = [
        getGlobalKnowledgePath('root'),
        getGlobalKnowledgePath('knowledge'),
        getGlobalKnowledgePath('patterns'),
        getGlobalKnowledgePath('insights')
    ];

    for (const dirPath of paths) {
        await fs.ensureDir(dirPath);
    }
}

/**
 * Common names for Global Knowledge repositories
 */
const GK_REPO_NAMES = [
    'Alex-Global-Knowledge',
    'My-Global-Knowledge',
    'Global-Knowledge',
    'alex-global-knowledge',
    'my-global-knowledge',
    'global-knowledge'
];

/**
 * Detect an existing Global Knowledge repository as a sibling folder.
 * Returns the path if found, null otherwise.
 */
export async function detectGlobalKnowledgeRepo(): Promise<string | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }
    
    // Get parent directory of the workspace
    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    const parentDir = path.dirname(workspaceRoot);
    
    // Check for common GK repo names
    for (const repoName of GK_REPO_NAMES) {
        const gkPath = path.join(parentDir, repoName);
        const indexPath = path.join(gkPath, 'index.json');
        
        if (await fs.pathExists(indexPath)) {
            return gkPath;
        }
    }
    
    // Also check for any folder with index.json that looks like a GK repo
    try {
        const siblings = await fs.readdir(parentDir);
        for (const sibling of siblings) {
            const siblingPath = path.join(parentDir, sibling);
            const stat = await fs.stat(siblingPath);
            if (stat.isDirectory()) {
                const indexPath = path.join(siblingPath, 'index.json');
                const patternsPath = path.join(siblingPath, 'patterns');
                const insightsPath = path.join(siblingPath, 'insights');
                
                // If it has index.json + patterns/ + insights/, it's likely a GK repo
                if (await fs.pathExists(indexPath) && 
                    await fs.pathExists(patternsPath) && 
                    await fs.pathExists(insightsPath)) {
                    return siblingPath;
                }
            }
        }
    } catch {
        // Parent directory not readable
    }
    
    return null;
}

/**
 * Initialize the Global Knowledge repository structure.
 * This is called when the user opts to create a new GK repo.
 * 
 * @param repoPath - Path where the GK repo should be scaffolded
 */
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
                category: p.category,
                tags: p.tags,
                filePath: `patterns/${p.filename}`,
                createdAt: now,
                updatedAt: now,
                source: 'Alex Starter Pack'
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
 * Generate animated SVG banner for Global Knowledge repository.
 * Professional design with animated knowledge categories.
 */
function getAnimatedBannerSvg(): string {
    // Space Station + Docked Rocket concept - "Your Mission Control for Cross-Project Wisdom"
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" width="1200" height="300">
  <defs>
    <!-- Deep space gradient (on-brand) -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080810"/>
      <stop offset="100%" stop-color="#0d1520"/>
    </linearGradient>
    
    <!-- Azure blue (brand primary) -->
    <linearGradient id="azure" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0078d4"/>
      <stop offset="100%" stop-color="#005a9e"/>
    </linearGradient>
    
    <!-- Flame/thrust orange (brand accent) - solar panels -->
    <linearGradient id="solar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b35"/>
      <stop offset="50%" stop-color="#ffc857"/>
      <stop offset="100%" stop-color="#ff6b35"/>
    </linearGradient>
    
    <!-- Station hull metallic -->
    <linearGradient id="hull" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4a5568"/>
      <stop offset="50%" stop-color="#718096"/>
      <stop offset="100%" stop-color="#4a5568"/>
    </linearGradient>
    
    <!-- Glow effect -->
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0078d4" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0078d4" stop-opacity="0"/>
    </radialGradient>
    
    <!-- Docking ring glow -->
    <radialGradient id="dockGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00ff88" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#00ff88" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="300" fill="url(#bg)"/>
  
  <!-- Stars (scattered) -->
  <g fill="white">
    <circle cx="50" cy="40" r="1" opacity="0.4"/>
    <circle cx="150" cy="250" r="1" opacity="0.3"/>
    <circle cx="250" cy="80" r="0.8" opacity="0.4"/>
    <circle cx="350" cy="60" r="1.5" opacity="0.5"/>
    <circle cx="450" cy="200" r="0.8" opacity="0.3"/>
    <circle cx="750" cy="50" r="1" opacity="0.4"/>
    <circle cx="850" cy="180" r="0.8" opacity="0.3"/>
    <circle cx="950" cy="30" r="1" opacity="0.4"/>
    <circle cx="1050" cy="100" r="1" opacity="0.3"/>
    <circle cx="1150" cy="60" r="1.5" opacity="0.5"/>
    <circle cx="1100" cy="220" r="0.8" opacity="0.3"/>
  </g>
  
  <!-- Earth in background (subtle) -->
  <circle cx="1150" cy="350" r="180" fill="#1a3a52" opacity="0.3"/>
  <circle cx="1150" cy="350" r="180" fill="none" stroke="#0078d4" stroke-width="1" opacity="0.2"/>
  
  <!-- Main glow behind station -->
  <ellipse cx="320" cy="150" rx="200" ry="120" fill="url(#glow)"/>
  
  <!-- SPACE STATION (ISS-inspired modular design) -->
  <g transform="translate(100, 80)">
    
    <!-- SOLAR PANEL ARRAYS (Left) -->
    <g transform="translate(40, 70)">
      <!-- Panel support arm -->
      <rect x="-80" y="-3" width="80" height="6" fill="url(#hull)"/>
      <!-- Upper panel -->
      <rect x="-145" y="-35" width="65" height="30" fill="url(#solar)" opacity="0.9"/>
      <rect x="-145" y="-35" width="65" height="30" fill="none" stroke="#ff6b35" stroke-width="1"/>
      <line x1="-145" y1="-20" x2="-80" y2="-20" stroke="#ff8c42" stroke-width="0.5"/>
      <line x1="-112" y1="-35" x2="-112" y2="-5" stroke="#ff8c42" stroke-width="0.5"/>
      <!-- Lower panel -->
      <rect x="-145" y="5" width="65" height="30" fill="url(#solar)" opacity="0.9"/>
      <rect x="-145" y="5" width="65" height="30" fill="none" stroke="#ff6b35" stroke-width="1"/>
      <line x1="-145" y1="20" x2="-80" y2="20" stroke="#ff8c42" stroke-width="0.5"/>
      <line x1="-112" y1="5" x2="-112" y2="35" stroke="#ff8c42" stroke-width="0.5"/>
    </g>
    
    <!-- SOLAR PANEL ARRAYS (Right) -->
    <g transform="translate(260, 70)">
      <!-- Panel support arm -->
      <rect x="0" y="-3" width="60" height="6" fill="url(#hull)"/>
      <!-- Upper panel -->
      <rect x="60" y="-35" width="65" height="30" fill="url(#solar)" opacity="0.9"/>
      <rect x="60" y="-35" width="65" height="30" fill="none" stroke="#ff6b35" stroke-width="1"/>
      <line x1="60" y1="-20" x2="125" y2="-20" stroke="#ff8c42" stroke-width="0.5"/>
      <line x1="92" y1="-35" x2="92" y2="-5" stroke="#ff8c42" stroke-width="0.5"/>
      <!-- Lower panel -->
      <rect x="60" y="5" width="65" height="30" fill="url(#solar)" opacity="0.9"/>
      <rect x="60" y="5" width="65" height="30" fill="none" stroke="#ff6b35" stroke-width="1"/>
      <line x1="60" y1="20" x2="125" y2="20" stroke="#ff8c42" stroke-width="0.5"/>
      <line x1="92" y1="5" x2="92" y2="35" stroke="#ff8c42" stroke-width="0.5"/>
    </g>
    
    <!-- MAIN TRUSS (horizontal backbone) -->
    <rect x="40" y="65" width="220" height="10" fill="url(#hull)"/>
    <line x1="50" y1="68" x2="250" y2="68" stroke="#a0aec0" stroke-width="0.5"/>
    <line x1="50" y1="72" x2="250" y2="72" stroke="#a0aec0" stroke-width="0.5"/>
    
    <!-- CENTRAL MODULE (Cupola/Command) -->
    <g transform="translate(130, 30)">
      <rect x="0" y="0" width="50" height="75" rx="8" fill="url(#azure)"/>
      <rect x="10" y="15" width="30" height="20" rx="4" fill="#0a1628" stroke="#00d4ff" stroke-width="1"/>
      <ellipse cx="25" cy="25" rx="12" ry="8" fill="#0078d4" opacity="0.3"/>
      <circle cx="12" cy="55" r="5" fill="#0a1628" stroke="#005a9e" stroke-width="1"/>
      <circle cx="38" cy="55" r="5" fill="#0a1628" stroke="#005a9e" stroke-width="1"/>
      <text x="25" y="95" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="10" font-weight="bold" fill="#0078d4">GK</text>
    </g>
    
    <!-- HABITAT MODULE (Left) -->
    <g transform="translate(60, 40)">
      <rect x="0" y="0" width="70" height="30" rx="6" fill="url(#azure)"/>
      <line x1="15" y1="3" x2="15" y2="27" stroke="#005a9e" stroke-width="0.5"/>
      <line x1="35" y1="3" x2="35" y2="27" stroke="#005a9e" stroke-width="0.5"/>
      <line x1="55" y1="3" x2="55" y2="27" stroke="#005a9e" stroke-width="0.5"/>
      <circle cx="25" cy="15" r="6" fill="#0a1628" stroke="#00d4ff" stroke-width="1"/>
      <circle cx="45" cy="15" r="6" fill="#0a1628" stroke="#00d4ff" stroke-width="1"/>
    </g>
    
    <!-- STORAGE MODULE (Far left) -->
    <g transform="translate(40, 45)">
      <rect x="0" y="0" width="25" height="20" rx="4" fill="url(#hull)"/>
      <rect x="5" y="5" width="15" height="10" rx="2" fill="#0a1628"/>
    </g>
    
    <!-- DOCKED ROCKET (A Negative Space) -->
    <ellipse cx="245" cy="55" rx="20" ry="20" fill="url(#dockGlow)"/>
    <rect x="180" y="50" width="25" height="10" fill="url(#hull)"/>
    <circle cx="205" cy="55" r="8" fill="#2d3748" stroke="#00ff88" stroke-width="2"/>
    
    <g transform="translate(205, 55) rotate(-90)">
      <g transform="scale(0.7)">
        <path d="M30,5 C30,5 15,20 15,45 L15,65 L22,68 L22,62 L38,62 L38,68 L45,65 L45,45 C45,20 30,5 30,5 Z" fill="url(#azure)"/>
        <polygon points="15,55 5,70 15,67" fill="url(#azure)"/>
        <polygon points="45,55 55,70 45,67" fill="url(#azure)"/>
        <path d="M30,15 L21,50 L24,50 L26,42 L34,42 L36,50 L39,50 Z M28,38 L30,22 L32,38 Z" fill="#080810"/>
        <circle cx="8" cy="60" r="3" fill="#ffc857" opacity="0.4"/>
        <circle cx="52" cy="60" r="3" fill="#ffc857" opacity="0.4"/>
      </g>
    </g>
    
  </g>
  
  <!-- Main title -->
  <text x="530" y="100" font-family="Segoe UI, Arial, sans-serif" font-size="42" font-weight="700" fill="white" letter-spacing="-0.5">
    Global Knowledge
  </text>
  
  <!-- Epic subtitle -->
  <text x="530" y="140" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#888888">
    <tspan>Your </tspan><tspan fill="#0078d4" font-weight="bold">MISSION CONTROL</tspan><tspan> for Cross-Project Wisdom</tspan>
  </text>
  
  <!-- Feature pills -->
  <g transform="translate(530, 165)">
    <g>
      <rect x="0" y="0" width="100" height="28" rx="14" fill="#0078d4" fill-opacity="0.15" stroke="#0078d4" stroke-width="1" stroke-opacity="0.4"/>
      <text x="50" y="19" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="12" fill="#0078d4">📁 Patterns</text>
    </g>
    <g transform="translate(110, 0)">
      <rect x="0" y="0" width="90" height="28" rx="14" fill="#ff6b35" fill-opacity="0.15" stroke="#ff6b35" stroke-width="1" stroke-opacity="0.4"/>
      <text x="45" y="19" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="12" fill="#ff6b35">💡 Insights</text>
    </g>
    <g transform="translate(210, 0)">
      <rect x="0" y="0" width="90" height="28" rx="14" fill="#00ff88" fill-opacity="0.15" stroke="#00ff88" stroke-width="1" stroke-opacity="0.4"/>
      <text x="45" y="19" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="12" fill="#00ff88">🔗 Synced</text>
    </g>
    <g transform="translate(310, 0)">
      <rect x="0" y="0" width="105" height="28" rx="14" fill="#ff6b35" fill-opacity="0.15" stroke="#ff6b35" stroke-width="1" stroke-opacity="0.4"/>
      <text x="52" y="19" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="12" fill="#ff6b35">👥 Shareable</text>
    </g>
  </g>
  
  <!-- Docking status indicator -->
  <g transform="translate(530, 210)">
    <rect width="200" height="24" rx="12" fill="#00ff88" fill-opacity="0.1" stroke="#00ff88" stroke-width="1" stroke-opacity="0.3"/>
    <circle cx="18" cy="12" r="5" fill="#00ff88">
      <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    <text x="32" y="16" font-family="Segoe UI, sans-serif" font-size="11" fill="#00ff88">DOCKED &amp; SYNCED</text>
  </g>
  
  <!-- v5.0 badge -->
  <g transform="translate(530, 245)">
    <rect width="100" height="22" rx="11" fill="url(#solar)" fill-opacity="0.2"/>
    <text x="50" y="15" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="10" font-weight="600" fill="#ffc857">🚀 Premium v5.0</text>
  </g>
  
  <!-- CorreaX mark bottom right -->
  <g transform="translate(1080, 250)" opacity="0.6">
    <path d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12s4.701 10.5 10.5 10.5c2.9 0 5.542-1.176 7.446-3.075l-2.651-2.652A6.75 6.75 0 0112 18.75c-3.728 0-6.75-3.022-6.75-6.75s3.022-6.75 6.75-6.75c1.718 0 3.285.643 4.478 1.701l2.598-2.729A10.46 10.46 0 0012 1.5z" fill="#0078d4"/>
    <path d="M15 7.5l-3 4.5 3 4.5h3l-3-4.5 3-4.5h-3z" fill="#0078d4"/>
    <path d="M18 7.5l3 4.5-3 4.5h3l3-4.5-3-4.5h-3z" fill="#0078d4" opacity="0.5"/>
  </g>
  <text x="1116" y="278" font-family="Segoe UI, sans-serif" font-size="11" fill="#888888" text-anchor="middle">CorreaX</text>
</svg>`;
}/**
 * Get starter patterns to include in new GK repos
 */
function getStarterPatterns(createdAt: string): Array<{
    id: string;
    filename: string;
    title: string;
    category: string;
    tags: string[];
    content: string;
}> {
    return [
        {
            id: 'GK-starter-code-quality-principles',
            filename: 'GK-starter-code-quality-principles.md',
            title: 'Code Quality Principles',
            category: 'patterns',
            tags: ['dry', 'kiss', 'code-quality', 'refactoring', 'starter'],
            content: `# Code Quality Principles

**ID**: GK-starter-code-quality-principles
**Category**: patterns
**Tags**: dry, kiss, code-quality, refactoring, starter
**Source**: Alex Starter Pack
**Created**: ${createdAt}

---

## Core Principles

### DRY (Don't Repeat Yourself)

When you see the same code pattern 3+ times, extract it:

\`\`\`typescript
// Before: Repeated in 5 components
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// After: Single reusable hook
function useApi<T>() {
  const [state, setState] = useState<{data: T | null, loading: boolean, error: Error | null}>({
    data: null, loading: false, error: null
  });
  // ... fetch logic
  return state;
}
\`\`\`

**Key insight**: Repetition isn't always obvious until you actively scan for patterns using grep/search.

### KISS (Keep It Simple, Stupid)

One responsibility per abstraction:
- A hook should do ONE thing well
- A function should have ONE clear purpose
- A component should render ONE concept

**Anti-pattern**: Trying to make something "flexible" often makes it harder to understand and maintain.

## When to Refactor

1. **3+ repetitions** — Extract to shared function/hook
2. **100+ line function** — Split into smaller pieces
3. **5+ parameters** — Consider config object
4. **Nested ternaries** — Use early returns
5. **Mixed concerns** — Separate side effects from rendering

---

> 💡 This is a **starter pattern** from Alex. Customize it based on your team's practices.
`
        },
        {
            id: 'GK-starter-documentation-structure',
            filename: 'GK-starter-documentation-structure.md',
            title: 'Documentation Structure Pattern',
            category: 'documentation',
            tags: ['documentation', 'readme', 'structure', 'templates', 'starter'],
            content: `# Documentation Structure Pattern

**ID**: GK-starter-documentation-structure
**Category**: documentation
**Tags**: documentation, readme, structure, templates, starter
**Source**: Alex Starter Pack
**Created**: ${createdAt}

---

## Project README Template

Every project should have a README with these sections:

\`\`\`markdown
# Project Name

> One-line description of what this project does

## Quick Start

\\\`\\\`\\\`bash
npm install
npm run dev
\\\`\\\`\\\`

## What It Does

2-3 sentences explaining the project's purpose and key features.

## Project Structure

\\\`\\\`\\\`
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── hooks/          # Custom React hooks
├── utils/          # Helper functions
└── types/          # TypeScript types
\\\`\\\`\\\`

## Development

Key commands for daily development work.

## Deployment

How to deploy to production.
\`\`\`

## Documentation Hierarchy

| Type | Location | Purpose |
|------|----------|---------|
| Quick reference | README.md | First thing users see |
| API docs | docs/api/ | Endpoint details |
| Architecture | docs/architecture/ | System design decisions |
| Runbooks | docs/operations/ | How to operate/maintain |

## Best Practices

1. **Write for future you** — You won't remember in 6 months
2. **Include examples** — Code samples beat prose
3. **Keep it updated** — Outdated docs are worse than none
4. **Link, don't duplicate** — Single source of truth

---

> 💡 This is a **starter pattern** from Alex. Customize it based on your team's practices.
`
        },
        {
            id: 'GK-starter-error-handling',
            filename: 'GK-starter-error-handling.md',
            title: 'Error Handling Patterns',
            category: 'error-handling',
            tags: ['error-handling', 'try-catch', 'async', 'typescript', 'starter'],
            content: `# Error Handling Patterns

**ID**: GK-starter-error-handling
**Category**: error-handling
**Tags**: error-handling, try-catch, async, typescript, starter
**Source**: Alex Starter Pack
**Created**: ${createdAt}

---

## Async/Await Error Handling

### Pattern: Wrapper Function

\`\`\`typescript
async function safeAsync<T>(
  promise: Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

// Usage
const [data, error] = await safeAsync(fetchUser(id));
if (error) {
  console.error('Failed to fetch user:', error.message);
  return;
}
// data is now guaranteed to be non-null
\`\`\`

### Pattern: Error Boundaries (React)

\`\`\`typescript
// Wrap components that might fail
<ErrorBoundary fallback={<ErrorMessage />}>
  <RiskyComponent />
</ErrorBoundary>
\`\`\`

## API Error Responses

Standardize error responses across your API:

\`\`\`typescript
interface ApiError {
  code: string;        // Machine-readable: 'USER_NOT_FOUND'
  message: string;     // Human-readable: 'User not found'
  details?: unknown;   // Optional context
}

// Return consistent shape
return res.status(404).json({
  code: 'USER_NOT_FOUND',
  message: \`User with ID \${id} not found\`
});
\`\`\`

## Best Practices

1. **Fail fast** — Check preconditions early
2. **Log context** — Include relevant IDs in error messages
3. **Don't swallow errors** — At minimum, log them
4. **Graceful degradation** — Show users a fallback, not a blank screen
5. **Type your errors** — Use discriminated unions when possible

---

> 💡 This is a **starter pattern** from Alex. Customize it based on your team's practices.
`
        }
    ];
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
| ☁️ **Cloud Sync** | Knowledge travels via Git |
| 👥 **Team Sharing** | Standard GitHub collaboration |

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

Since this is a standard Git repository, sharing is handled through GitHub permissions:

| Access Level | GitHub Setting | Use Case |
|--------------|----------------|----------|
| **Private** | Private repo | Personal knowledge vault |
| **Team** | Private + collaborators | Shared team learnings |
| **Organization** | Org-owned repo | Enterprise knowledge base |
| **Public** | Public repo | Open-source knowledge sharing |

To share, just:
1. Push this repo to GitHub
2. Adjust repository visibility (Settings → General)
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

## Index Management

### Alex-Managed Approach

This repository is designed to be **managed by Alex**, not GitHub Actions. When you use commands like \`/saveinsight\` or \`/promote\`, Alex:

1. Creates the markdown file with proper frontmatter
2. Updates \`index.json\` atomically
3. Sets metadata (timestamps, IDs, categories)

This keeps the repository simple and portable — no CI/CD dependencies, works offline, and syncs via standard Git.

### Why No GitHub Actions?

| Approach | Pros | Cons |
|----------|------|------|
| **Alex-Managed** (current) | Simple, portable, offline-friendly, no workflow failures | Requires VS Code |
| **GitHub Actions** | Automated CI/CD | Dependency on GitHub, workflow complexity |

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
Keep the repo private on GitHub. Only you access your knowledge.

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
export async function getGlobalKnowledgeRepoPath(): Promise<string | null> {
    return await detectGlobalKnowledgeRepo();
}

/**
 * Execute a function with file locking for safe concurrent access.
 * This ensures only one Alex instance can modify a file at a time.
 * Now includes better error handling and timeout protection.
 */
async function withFileLock<T>(
    filePath: string,
    operation: () => Promise<T>
): Promise<T> {
    // Ensure the file exists before locking (lockfile requires existing file)
    if (!await fs.pathExists(filePath)) {
        // Create empty file to lock against
        await fs.ensureFile(filePath);
    }
    
    let release: (() => Promise<void>) | undefined;
    try {
        release = await lockfile.lock(filePath, LOCK_OPTIONS);
        return await operation();
    } catch (lockError: any) {
        // If lock fails (e.g., another process holds it), run without lock
        // This is safer than hanging indefinitely
        console.warn(`File lock failed for ${filePath}, proceeding without lock:`, lockError?.message || lockError);
        return await operation();
    } finally {
        if (release) {
            try {
                await release();
            } catch (releaseError) {
                // Ignore release errors - file may have been deleted or lock already released
                console.warn(`Failed to release lock for ${filePath}:`, releaseError);
            }
        }
    }
}

/**
 * Safely update the global knowledge index with locking.
 * This prevents race conditions when multiple Alex instances are running.
 */
export async function updateGlobalKnowledgeIndex(
    updater: (index: IGlobalKnowledgeIndex) => IGlobalKnowledgeIndex | Promise<IGlobalKnowledgeIndex>
): Promise<IGlobalKnowledgeIndex> {
    const indexPath = getGlobalKnowledgePath('index');
    await ensureGlobalKnowledgeDirectories();
    
    return await withFileLock(indexPath, async () => {
        // Read current index (or create new one)
        let index: IGlobalKnowledgeIndex;
        try {
            if (await fs.pathExists(indexPath)) {
                const content = await fs.readFile(indexPath, 'utf-8');
                if (content.trim()) {
                    index = JSON.parse(content);
                } else {
                    index = { version: '1.0.0', lastUpdated: new Date().toISOString(), entries: [] };
                }
            } else {
                index = { version: '1.0.0', lastUpdated: new Date().toISOString(), entries: [] };
            }
        } catch (err) {
            // Corrupted, create new
            index = { version: '1.0.0', lastUpdated: new Date().toISOString(), entries: [] };
        }
        
        // Apply the update
        index = await updater(index);
        index.lastUpdated = new Date().toISOString();
        
        // Write back atomically
        await fs.writeJson(indexPath, index, { spaces: 2 });
        
        return index;
    });
}

/**
 * Safely update the project registry with locking.
 */
export async function updateProjectRegistry(
    updater: (registry: IProjectRegistry) => IProjectRegistry | Promise<IProjectRegistry>
): Promise<IProjectRegistry> {
    const registryPath = getGlobalKnowledgePath('projectRegistry');
    await ensureGlobalKnowledgeDirectories();
    
    return await withFileLock(registryPath, async () => {
        // Read current registry (or create new one)
        let registry: IProjectRegistry;
        try {
            if (await fs.pathExists(registryPath)) {
                const content = await fs.readFile(registryPath, 'utf-8');
                if (content.trim()) {
                    registry = JSON.parse(content);
                } else {
                    registry = { version: '1.0.0', lastUpdated: new Date().toISOString(), projects: [] };
                }
            } else {
                registry = { version: '1.0.0', lastUpdated: new Date().toISOString(), projects: [] };
            }
        } catch (err) {
            registry = { version: '1.0.0', lastUpdated: new Date().toISOString(), projects: [] };
        }
        
        // Apply the update
        registry = await updater(registry);
        registry.lastUpdated = new Date().toISOString();
        
        // Write back
        await fs.writeJson(registryPath, registry, { spaces: 2 });
        
        return registry;
    });
}

/**
 * Initialize the global knowledge index if it doesn't exist
 */
export async function ensureGlobalKnowledgeIndex(): Promise<IGlobalKnowledgeIndex> {
    const indexPath = getGlobalKnowledgePath('index');
    await ensureGlobalKnowledgeDirectories();
    
    return await withFileLock(indexPath, async () => {
        try {
            if (await fs.pathExists(indexPath)) {
                const content = await fs.readFile(indexPath, 'utf-8');
                if (content.trim()) {
                    return JSON.parse(content);
                }
            }
        } catch (err) {
            // Index corrupted, recreate
        }

        const newIndex: IGlobalKnowledgeIndex = {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            entries: []
        };

        await fs.writeJson(indexPath, newIndex, { spaces: 2 });
        return newIndex;
    });
}

/**
 * Save the global knowledge index (with locking for concurrent safety)
 */
export async function saveGlobalKnowledgeIndex(index: IGlobalKnowledgeIndex): Promise<void> {
    await updateGlobalKnowledgeIndex(() => index);
}

/**
 * Get or initialize the project registry (with locking)
 */
export async function ensureProjectRegistry(): Promise<IProjectRegistry> {
    const registryPath = getGlobalKnowledgePath('projectRegistry');
    await ensureGlobalKnowledgeDirectories();
    
    return await updateProjectRegistry((registry) => registry);
}

/**
 * Save the project registry (with locking for concurrent safety)
 */
export async function saveProjectRegistry(registry: IProjectRegistry): Promise<void> {
    await updateProjectRegistry(() => registry);
}

/**
 * Register or update the current project in the registry
 */
export async function registerCurrentProject(): Promise<IProjectRegistryEntry | undefined> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return undefined;
    }

    const projectPath = workspaceFolders[0].uri.fsPath;
    const projectName = path.basename(projectPath);
    
    // Count knowledge files
    let knowledgeFileCount = 0;
    const dkPattern = new vscode.RelativePattern(workspaceFolders[0], '.github/domain-knowledge/*.md');
    const dkFiles = await vscode.workspace.findFiles(dkPattern);
    knowledgeFileCount = dkFiles.length;

    // Use atomic update with locking
    let savedEntry: IProjectRegistryEntry | undefined;
    await updateProjectRegistry((registry) => {
        // Find existing entry or create new one
        const existingIndex = registry.projects.findIndex(p => p.path === projectPath);
        const entry: IProjectRegistryEntry = {
            path: projectPath,
            name: projectName,
            lastAccessed: new Date().toISOString(),
            knowledgeFiles: knowledgeFileCount
        };

        if (existingIndex >= 0) {
            // Preserve existing data, update access time and file count
            registry.projects[existingIndex] = {
                ...registry.projects[existingIndex],
                ...entry
            };
            savedEntry = registry.projects[existingIndex];
        } else {
            registry.projects.push(entry);
            savedEntry = entry;
        }

        return registry;
    });

    return savedEntry;
}

/**
 * Generate a unique ID for a knowledge entry
 */
function generateKnowledgeId(type: 'pattern' | 'insight', title: string): string {
    const prefix = type === 'pattern' ? GLOBAL_KNOWLEDGE_PREFIXES.pattern : GLOBAL_KNOWLEDGE_PREFIXES.insight;
    const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 40);
    const timestamp = type === 'insight' ? `-${new Date().toISOString().split('T')[0]}` : '';
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
    sourceProject?: string
): Promise<IGlobalKnowledgeEntry> {
    await ensureGlobalKnowledgeDirectories();
    
    const id = generateKnowledgeId('pattern', title);
    const filename = `${id}.md`;
    const filePath = path.join(getGlobalKnowledgePath('patterns'), filename);
    
    // Create the markdown file with frontmatter-style header
    const fileContent = `# ${title}

**ID**: ${id}  
**Category**: ${category}  
**Tags**: ${tags.join(', ')}  
**Source**: ${sourceProject || 'Manual entry'}  
**Created**: ${new Date().toISOString()}  

---

${content}

---

## Synapses

*Add cross-references to related knowledge files here*

`;

    await fs.writeFile(filePath, fileContent, 'utf-8');

    // Update the index atomically with locking
    const entry: IGlobalKnowledgeEntry = {
        id,
        title,
        type: 'pattern',
        category,
        tags,
        sourceProject,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        summary: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        filePath
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
    sourceProject?: string
): Promise<IGlobalKnowledgeEntry> {
    const filePath = existingEntry.filePath;
    
    if (!filePath || !await fs.pathExists(filePath)) {
        throw new Error(`Global pattern file not found: ${filePath}`);
    }
    
    // Merge tags (keep existing, add new)
    const allTags = [...new Set([...(existingEntry.tags || []), ...tags])];
    
    // Create updated markdown file preserving original metadata
    const fileContent = `# ${existingEntry.title}

**ID**: ${existingEntry.id}  
**Category**: ${category}  
**Tags**: ${allTags.join(', ')}  
**Source**: ${sourceProject || existingEntry.sourceProject || 'Manual entry'}  
**Created**: ${existingEntry.created}  
**Modified**: ${new Date().toISOString()}  

---

${newContent}

---

## Synapses

*Add cross-references to related knowledge files here*

`;

    await fs.writeFile(filePath, fileContent, 'utf-8');

    // Update the index entry
    const updatedEntry: IGlobalKnowledgeEntry = {
        ...existingEntry,
        category,
        tags: allTags,
        modified: new Date().toISOString(),
        summary: newContent.substring(0, 200) + (newContent.length > 200 ? '...' : '')
    };

    await updateGlobalKnowledgeIndex((index) => {
        const entryIndex = index.entries.findIndex(e => e.id === existingEntry.id);
        if (entryIndex >= 0) {
            index.entries[entryIndex] = updatedEntry;
        }
        return index;
    });

    return updatedEntry;
}

/**
 * Create a new global insight (timestamped learning) - with concurrent-safe index update
 */
export async function createGlobalInsight(
    title: string,
    content: string,
    category: GlobalKnowledgeCategory,
    tags: string[],
    sourceProject?: string,
    problemContext?: string,
    solution?: string
): Promise<IGlobalKnowledgeEntry> {
    await ensureGlobalKnowledgeDirectories();
    
    const id = generateKnowledgeId('insight', title);
    const filename = `${id}.md`;
    const filePath = path.join(getGlobalKnowledgePath('insights'), filename);
    
    // Create the markdown file
    const fileContent = `# ${title}

**ID**: ${id}  
**Category**: ${category}  
**Tags**: ${tags.join(', ')}  
**Source Project**: ${sourceProject || 'Unknown'}  
**Date**: ${new Date().toISOString()}  

---

## Context

${problemContext || 'No problem context provided.'}

## Insight

${content}

## Solution

${solution || 'See insight above.'}

---

## Applicability

*When would this insight be useful again?*

- Similar error messages
- Same technology stack: ${tags.join(', ')}
- Related patterns

## Related Projects

- ${sourceProject || 'Origin project'}

`;

    await fs.writeFile(filePath, fileContent, 'utf-8');

    // Update the index atomically with locking
    const entry: IGlobalKnowledgeEntry = {
        id,
        title,
        type: 'insight',
        category,
        tags,
        sourceProject,
        relatedProjects: sourceProject ? [sourceProject] : [],
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        summary: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        filePath
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
        type?: 'pattern' | 'insight' | 'all';
        category?: GlobalKnowledgeCategory;
        tags?: string[];
        limit?: number;
    } = {}
): Promise<{ entry: IGlobalKnowledgeEntry; relevance: number; content?: string }[]> {
    const index = await ensureGlobalKnowledgeIndex();
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    
    const results: { entry: IGlobalKnowledgeEntry; relevance: number; content?: string }[] = [];

    for (const entry of index.entries) {
        // Filter by type
        if (options.type && options.type !== 'all' && entry.type !== options.type) {
            continue;
        }
        
        // Filter by category
        if (options.category && entry.category !== options.category) {
            continue;
        }
        
        // Filter by tags
        if (options.tags && options.tags.length > 0) {
            const hasMatchingTag = options.tags.some(tag => 
                entry.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
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
            if (tag.toLowerCase().includes(queryLower) || queryLower.includes(tag.toLowerCase())) {
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
            // Read full content for top results
            let content: string | undefined;
            if (await fs.pathExists(entry.filePath)) {
                try {
                    content = await fs.readFile(entry.filePath, 'utf-8');
                    // Additional relevance from content
                    for (const word of queryWords) {
                        const matches = (content.toLowerCase().match(new RegExp(word, 'g')) || []).length;
                        relevance += Math.min(matches, 5) * 0.5;
                    }
                } catch (err) {
                    // File read error, skip content
                }
            }
            
            results.push({ entry, relevance, content });
        }
    }

    // Sort by relevance and apply limit
    results.sort((a, b) => b.relevance - a.relevance);
    return results.slice(0, options.limit || 10);
}

/**
 * Promote a project-local DK file to global knowledge
 */
export async function promoteToGlobalKnowledge(
    localFilePath: string,
    category: GlobalKnowledgeCategory,
    additionalTags: string[] = []
): Promise<IGlobalKnowledgeEntry | null> {
    try {
        const content = await fs.readFile(localFilePath, 'utf-8');
        const filename = path.basename(localFilePath, '.md');
        
        // Extract title from content (first H1) or use filename
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : filename.replace(/^DK-/, '').replace(/-/g, ' ');
        
        // Extract existing tags if any
        const tagsMatch = content.match(/\*\*Tags\*\*:\s*(.+)$/m);
        const existingTags = tagsMatch 
            ? tagsMatch[1].split(',').map(t => t.trim())
            : [];
        
        const allTags = [...new Set([...existingTags, ...additionalTags])];
        
        // Get source project name
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const sourceProject = workspaceFolders 
            ? path.basename(workspaceFolders[0].uri.fsPath)
            : undefined;

        return await createGlobalPattern(title, content, category, allTags, sourceProject);
    } catch (err) {
        console.error('Failed to promote file to global knowledge:', err);
        return null;
    }
}

/**
 * Find relevant global knowledge for the current project context
 */
export async function findRelevantKnowledge(
    context: string,
    technologies?: string[]
): Promise<{ entry: IGlobalKnowledgeEntry; relevance: number; content?: string }[]> {
    // Build search query from context and technologies
    const searchTerms = [context];
    if (technologies) {
        searchTerms.push(...technologies);
    }
    
    return searchGlobalKnowledge(searchTerms.join(' '), { limit: 5 });
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
    'DK-SKILL-WISHLIST',
    'DK-GENERIC-FRAMEWORK',
    'VERSION-NAMING-CONVENTION'
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
export async function evaluateDKFile(filePath: string): Promise<DKFileEvaluation> {
    const filename = path.basename(filePath, '.md');
    const content = await fs.readFile(filePath, 'utf-8');
    
    let score = 0;
    const reasons: string[] = [];
    
    // Extract title
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename.replace(/^DK-/, '').replace(/-/g, ' ');
    
    // Check for synapses section with actual connections
    const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;
    const synapseMatches = content.match(synapseRegex);
    if (synapseMatches && synapseMatches.length > 0) {
        score += 3;
        reasons.push(`Has ${synapseMatches.length} synapse connection(s)`);
    }
    
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
        tags = tagsMatch[1].split(',').map(t => t.trim()).filter(t => t.length > 0);
        if (tags.length > 0) {
            score += 1;
            reasons.push(`Has ${tags.length} tag(s)`);
        }
    }
    
    // Check file size (content richness indicator)
    if (content.length > 1000) {
        score += 1;
        reasons.push('Substantial content (>1KB)');
    }
    if (content.length > 5000) {
        score += 2;
        reasons.push('Rich content (>5KB)');
    }
    
    // Check for examples or code blocks
    const codeBlocks = content.match(/```[\s\S]*?```/g);
    if (codeBlocks && codeBlocks.length > 0) {
        score += 2;
        reasons.push(`Contains ${codeBlocks.length} code example(s)`);
    }
    
    // General applicability heuristics
    const generalTerms = [
        /pattern/i, /best practice/i, /guideline/i, /framework/i,
        /principle/i, /architecture/i, /design/i, /approach/i
    ];
    const generalMatchCount = generalTerms.filter(re => re.test(content)).length;
    if (generalMatchCount >= 2) {
        score += Math.min(generalMatchCount, 3);
        reasons.push(`Contains general/reusable concepts`);
    }
    
    // Determine category from content
    const category = inferCategoryFromContent(content, filename);
    
    // Check if already promoted and detect local changes
    const index = await ensureGlobalKnowledgeIndex();
    const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const existingEntry = index.entries.find(e => 
        e.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === normalizedTitle ||
        e.id.includes(normalizedTitle)
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
        hasLocalChanges
    };
}

/**
 * Infer category from file content and name
 */
function inferCategoryFromContent(content: string, filename: string): GlobalKnowledgeCategory {
    const contentLower = content.toLowerCase();
    const filenameLower = filename.toLowerCase();
    
    const categoryPatterns: [RegExp, GlobalKnowledgeCategory][] = [
        [/error|exception|fault|handling/i, 'error-handling'],
        [/api|rest|graphql|endpoint/i, 'api-design'],
        [/test|spec|jest|mocha|assertion/i, 'testing'],
        [/debug|troubleshoot|diagnos/i, 'debugging'],
        [/performance|optimi|cache|speed/i, 'performance'],
        [/architecture|design|pattern|structure/i, 'architecture'],
        [/security|auth|encrypt|vulnerab/i, 'security'],
        [/deploy|ci\/cd|pipeline|docker|kubernetes/i, 'deployment'],
        [/document|readme|comment|diagram/i, 'documentation'],
        [/refactor|clean|improve|modernize/i, 'refactoring'],
        [/tool|config|setup|environment/i, 'tooling'],
    ];
    
    for (const [pattern, category] of categoryPatterns) {
        if (pattern.test(contentLower) || pattern.test(filenameLower)) {
            return category;
        }
    }
    
    return 'general';
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
    options: { dryRun?: boolean; minScore?: number } = {}
): Promise<AutoPromotionResult> {
    const { dryRun = false, minScore = 5 } = options;
    
    await ensureGlobalKnowledgeDirectories();
    
    const result: AutoPromotionResult = {
        evaluated: 0,
        promoted: [],
        updated: [],
        skipped: [],
        alreadyGlobal: []
    };
    
    // Find all DK files in the workspace
    const dkPath = path.join(workspacePath, '.github', 'domain-knowledge');
    if (!await fs.pathExists(dkPath)) {
        return result;
    }
    
    const files = await fs.readdir(dkPath);
    const dkFiles = files.filter(f => f.startsWith('DK-') && f.endsWith('.md'));
    
    for (const file of dkFiles) {
        const filePath = path.join(dkPath, file);
        const filenameWithoutExt = file.replace('.md', '');
        
        // Skip excluded files
        if (EXCLUDED_FROM_PROMOTION.some(excluded => filenameWithoutExt.includes(excluded))) {
            result.skipped.push({ filename: file, reason: 'Excluded meta-file' });
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
                        const content = await fs.readFile(filePath, 'utf-8');
                        const workspaceFolders = vscode.workspace.workspaceFolders;
                        const sourceProject = workspaceFolders 
                            ? path.basename(workspaceFolders[0].uri.fsPath)
                            : undefined;
                        
                        const updatedEntry = await updateGlobalPattern(
                            evaluation.existingEntry,
                            content,
                            evaluation.category,
                            evaluation.tags,
                            sourceProject
                        );
                        result.updated.push(updatedEntry);
                    } else {
                        // Dry run - mock update entry
                        result.updated.push({
                            ...evaluation.existingEntry,
                            modified: new Date().toISOString(),
                            summary: `[DRY-RUN] Would be updated from local changes`
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
                    reason: `Score ${evaluation.score}/${minScore} - ${evaluation.reasons.join(', ') || 'Needs more structure/content'}`
                });
                continue;
            }
            
            // Promote the file
            if (!dryRun) {
                const entry = await promoteToGlobalKnowledge(
                    filePath,
                    evaluation.category,
                    evaluation.tags
                );
                
                if (entry) {
                    result.promoted.push(entry);
                }
            } else {
                // In dry run, create a mock entry for reporting
                result.promoted.push({
                    id: `[DRY-RUN] ${filenameWithoutExt}`,
                    title: evaluation.title,
                    type: 'pattern',
                    category: evaluation.category,
                    tags: evaluation.tags,
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                    summary: `Would be promoted with score ${evaluation.score}`,
                    filePath
                });
            }
        } catch (err) {
            result.skipped.push({ filename: file, reason: `Error: ${err}` });
        }
    }
    
    // Trigger cloud sync if we promoted or updated anything
    if (!dryRun && (result.promoted.length > 0 || result.updated.length > 0)) {
        triggerPostModificationSync();
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
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
        .slice(0, 5);

    return {
        totalPatterns: index.entries.filter(e => e.type === 'pattern').length,
        totalInsights: index.entries.filter(e => e.type === 'insight').length,
        categories,
        recentEntries,
        topTags
    };
}

// ============================================================================
// GLOBAL KNOWLEDGE MIGRATION & NORMALIZATION
// ============================================================================

/**
 * Common words to exclude from tag generation
 */
const TAG_EXCLUSION_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
    'that', 'these', 'those', 'it', 'its', 'domain', 'knowledge', 'about',
    'how', 'what', 'when', 'where', 'why', 'which', 'who', 'file', 'files'
]);

/**
 * Category keyword mapping for inferring correct category from title/summary
 */
const CATEGORY_KEYWORD_MAP: Record<string, string[]> = {
    'documentation': ['writing', 'publication', 'ascii', 'art', 'diagram', 'markdown', 'lint', 'document', 'docs', 'readme', 'mermaid'],
    'tooling': ['tool', 'build', 'script', 'automation', 'vscode', 'extension', 'plugin', 'cli'],
    'debugging': ['debug', 'error', 'fix', 'troubleshoot', 'issue', 'bug', 'trace', 'log'],
    'testing': ['test', 'spec', 'unit', 'integration', 'mock', 'jest', 'mocha', 'cypress'],
    'architecture': ['architecture', 'design', 'structure', 'system', 'cognitive', 'synapse', 'memory'],
    'performance': ['performance', 'optimization', 'speed', 'cache', 'memory', 'profiling', 'benchmark'],
    'security': ['security', 'auth', 'permission', 'token', 'credential', 'encrypt', 'ssl', 'tls'],
    'api-design': ['api', 'endpoint', 'rest', 'graphql', 'schema', 'http', 'request', 'response'],
    'deployment': ['deploy', 'release', 'publish', 'ci', 'cd', 'pipeline', 'docker', 'kubernetes'],
    'refactoring': ['refactor', 'migration', 'upgrade', 'modernize', 'cleanup', 'consolidate'],
    'patterns': ['pattern', 'practice', 'convention', 'standard', 'idiom', 'best', 'practices'],
    'error-handling': ['exception', 'catch', 'throw', 'recovery', 'fallback', 'retry'],
};

/**
 * Result of migration operation
 */
export interface IMigrationResult {
    entriesProcessed: number;
    entriesNormalized: number;
    tagsGenerated: number;
    categoriesFixed: number;
    sourcesFixed: number;
    skipped: number;
    details: string[];
}

/**
 * Generate tags from title string
 */
function generateTagsFromTitle(title: string): string[] {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .split(/[\s-]+/)
        .filter(word => word.length > 2 && !TAG_EXCLUSION_WORDS.has(word))
        .slice(0, 5);  // Max 5 auto-generated tags
}

/**
 * Infer the correct category based on title and summary keywords
 */
function inferCategory(title: string, summary: string, currentCategory: GlobalKnowledgeCategory): GlobalKnowledgeCategory {
    const combined = `${title} ${summary}`.toLowerCase();
    
    // Score each category by matching keywords
    let bestCategory = currentCategory;
    let bestScore = 0;
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORD_MAP)) {
        const score = keywords.filter(kw => combined.includes(kw)).length;
        if (score > bestScore) {
            bestScore = score;
            bestCategory = category as GlobalKnowledgeCategory;
        }
    }
    
    // Only change if we have at least 2 keyword matches (more confident)
    return bestScore >= 2 ? bestCategory : currentCategory;
}

/**
 * Normalize source project attribution
 */
function normalizeSource(entry: IGlobalKnowledgeEntry): string | undefined {
    // Map bulk-promoted sandbox entries to their true origin
    if (entry.sourceProject === 'Alex_Sandbox') {
        // Entries with "domain-knowledge" or "GK-domain-knowledge" IDs are from skill promotion
        if (entry.id.includes('domain-knowledge') || entry.type === 'pattern') {
            return 'Master Alex (promoted skill)';
        }
    }
    
    // Keep original source for actual project insights
    return entry.sourceProject;
}

/**
 * Normalize a single entry, returning whether it was modified
 */
function normalizeEntry(entry: IGlobalKnowledgeEntry, details: string[]): boolean {
    let modified = false;
    
    // 1. Fix empty tags
    if (!entry.tags || entry.tags.length === 0) {
        const generatedTags = generateTagsFromTitle(entry.title);
        if (generatedTags.length > 0) {
            entry.tags = generatedTags;
            details.push(`Generated tags for "${entry.title}": ${generatedTags.join(', ')}`);
            modified = true;
        }
    }
    
    // 2. Fix category if appears miscategorized
    const inferredCategory = inferCategory(entry.title, entry.summary || '', entry.category);
    if (inferredCategory !== entry.category) {
        details.push(`Fixed category for "${entry.title}": ${entry.category} → ${inferredCategory}`);
        entry.category = inferredCategory;
        modified = true;
    }
    
    // 3. Normalize source attribution
    const normalizedSource = normalizeSource(entry);
    if (normalizedSource !== entry.sourceProject) {
        details.push(`Normalized source for "${entry.title}": ${entry.sourceProject} → ${normalizedSource}`);
        entry.sourceProject = normalizedSource;
        modified = true;
    }
    
    return modified;
}

/**
 * Normalize all global knowledge entries.
 * Called during cloud sync to ensure data quality.
 * Backward compatible - older versions can still read the format.
 */
export async function normalizeGlobalKnowledge(): Promise<IMigrationResult> {
    const result: IMigrationResult = {
        entriesProcessed: 0,
        entriesNormalized: 0,
        tagsGenerated: 0,
        categoriesFixed: 0,
        sourcesFixed: 0,
        skipped: 0,
        details: []
    };
    
    try {
        const index = await ensureGlobalKnowledgeIndex();
        let indexModified = false;
        
        for (const entry of index.entries) {
            result.entriesProcessed++;
            
            const originalTags = entry.tags?.length || 0;
            const originalCategory = entry.category;
            const originalSource = entry.sourceProject;
            
            const modified = normalizeEntry(entry, result.details);
            
            if (modified) {
                result.entriesNormalized++;
                indexModified = true;
                
                // Track specific changes
                if ((entry.tags?.length || 0) > originalTags) {
                    result.tagsGenerated++;
                }
                if (entry.category !== originalCategory) {
                    result.categoriesFixed++;
                }
                if (entry.sourceProject !== originalSource) {
                    result.sourcesFixed++;
                }
                
                // Update modified timestamp
                entry.modified = new Date().toISOString();
            } else {
                result.skipped++;
            }
        }
        
        // Save the index if any changes were made
        if (indexModified) {
            // Bump schema version to indicate normalized data
            index.version = '1.0.1';
            await updateGlobalKnowledgeIndex(() => index);
            result.details.push(`Index updated: ${result.entriesNormalized} entries normalized`);
        }
        
        return result;
        
    } catch (err) {
        result.details.push(`Migration error: ${err}`);
        return result;
    }
}

/**
 * Check if migration is needed (any entries with empty tags or miscategorized)
 */
export async function needsMigration(): Promise<boolean> {
    try {
        const index = await ensureGlobalKnowledgeIndex();
        
        for (const entry of index.entries) {
            // Check for empty tags
            if (!entry.tags || entry.tags.length === 0) {
                return true;
            }
            
            // Check for likely miscategorization
            const inferredCategory = inferCategory(entry.title, entry.summary || '', entry.category);
            if (inferredCategory !== entry.category) {
                return true;
            }
            
            // Check for sandbox source that should be normalized
            if (entry.sourceProject === 'Alex_Sandbox' && 
                (entry.id.includes('domain-knowledge') || entry.type === 'pattern')) {
                return true;
            }
        }
        
        return false;
    } catch {
        return false;
    }
}

// ============================================================================
// VS CODE LANGUAGE MODEL TOOLS
// ============================================================================

/**
 * Input parameters for Global Knowledge Search tool
 */
export interface IGlobalKnowledgeSearchParams {
    query: string;
    type?: 'pattern' | 'insight' | 'all';
    category?: string;
    tags?: string;
}

/**
 * Global Knowledge Search Tool - Search across all projects' accumulated wisdom
 */
export class GlobalKnowledgeSearchTool implements vscode.LanguageModelTool<IGlobalKnowledgeSearchParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IGlobalKnowledgeSearchParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Searching global knowledge for: ${options.input.query}`,
            confirmationMessages: {
                title: 'Search Global Knowledge',
                message: new vscode.MarkdownString(
                    `Search Alex's global knowledge base across all projects for: **${options.input.query}**?\n\n` +
                    `This searches patterns and insights learned from all your projects.`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IGlobalKnowledgeSearchParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        await ensureGlobalKnowledgeDirectories();
        
        const { query, type, category, tags } = options.input;
        
        const results = await searchGlobalKnowledge(query, {
            type: type as 'pattern' | 'insight' | 'all' | undefined,
            category: category as GlobalKnowledgeCategory | undefined,
            tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
            limit: 10
        });

        if (results.length === 0) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    `No global knowledge found matching "${query}".\n\n` +
                    `You can save new knowledge using:\n` +
                    `- \`@alex /saveinsight\` to save a learning from the current project\n` +
                    `- \`@alex /promote\` to promote project-local knowledge to global`
                )
            ]);
        }

        let result = `## Global Knowledge Search Results\n\n`;
        result += `Found **${results.length}** relevant entries for "${query}":\n\n`;

        for (const { entry, relevance } of results) {
            const typeEmoji = entry.type === 'pattern' ? '📐' : '💡';
            result += `### ${typeEmoji} ${entry.title}\n`;
            result += `- **Type**: ${entry.type} | **Category**: ${entry.category}\n`;
            result += `- **Tags**: ${entry.tags.join(', ')}\n`;
            if (entry.sourceProject) {
                result += `- **Source**: ${entry.sourceProject}\n`;
            }
            result += `- **Summary**: ${entry.summary}\n`;
            result += `- **File**: \`${entry.filePath}\`\n\n`;
        }

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Input parameters for Save Insight tool
 */
export interface ISaveInsightParams {
    title: string;
    insight: string;
    category?: string;
    tags?: string;
    problem?: string;
    solution?: string;
}

/**
 * Save Insight Tool - Save a new learning to global knowledge base
 */
export class SaveInsightTool implements vscode.LanguageModelTool<ISaveInsightParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<ISaveInsightParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Saving insight: ${options.input.title}`,
            confirmationMessages: {
                title: 'Save Global Insight',
                message: new vscode.MarkdownString(
                    `Save this insight to Alex's global knowledge base?\n\n` +
                    `**Title**: ${options.input.title}\n\n` +
                    `This will be available across all your projects.`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ISaveInsightParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        await ensureGlobalKnowledgeDirectories();
        
        const { title, insight, category, tags, problem, solution } = options.input;
        
        // Get current project name
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const sourceProject = workspaceFolders 
            ? path.basename(workspaceFolders[0].uri.fsPath)
            : undefined;

        const entry = await createGlobalInsight(
            title,
            insight,
            (category || 'general') as GlobalKnowledgeCategory,
            tags ? tags.split(',').map(t => t.trim()) : [],
            sourceProject,
            problem,
            solution
        );

        // === UNCONSCIOUS MIND: Trigger automatic background sync ===
        triggerPostModificationSync();

        const result = `## ✅ Insight Saved to Global Knowledge

**ID**: ${entry.id}  
**Title**: ${entry.title}  
**Category**: ${entry.category}  
**Tags**: ${entry.tags.join(', ')}  
**Source Project**: ${entry.sourceProject || 'Unknown'}  
**File**: \`${entry.filePath}\`

This insight is now available across all your projects.
*🧠 Unconscious sync triggered - backing up to cloud automatically.*
`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Input parameters for Promote Knowledge tool
 */
export interface IPromoteKnowledgeParams {
    filePath: string;
    category?: string;
    additionalTags?: string;
}

/**
 * Promote Knowledge Tool - Promote project-local DK file to global knowledge
 */
export class PromoteKnowledgeTool implements vscode.LanguageModelTool<IPromoteKnowledgeParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IPromoteKnowledgeParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Promoting ${path.basename(options.input.filePath)} to global knowledge`,
            confirmationMessages: {
                title: 'Promote to Global Knowledge',
                message: new vscode.MarkdownString(
                    `Promote this project-local knowledge file to global knowledge?\n\n` +
                    `**File**: ${options.input.filePath}\n\n` +
                    `This will make it searchable and available across all your projects.`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IPromoteKnowledgeParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        const { filePath, category, additionalTags } = options.input;
        
        // Verify file exists
        if (!await fs.pathExists(filePath)) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`❌ File not found: ${filePath}`)
            ]);
        }

        const entry = await promoteToGlobalKnowledge(
            filePath,
            (category || 'general') as GlobalKnowledgeCategory,
            additionalTags ? additionalTags.split(',').map(t => t.trim()) : []
        );

        if (!entry) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`❌ Failed to promote file to global knowledge.`)
            ]);
        }

        // === UNCONSCIOUS MIND: Trigger automatic background sync ===
        triggerPostModificationSync();

        const result = `## ✅ Knowledge Promoted to Global

**ID**: ${entry.id}  
**Title**: ${entry.title}  
**Category**: ${entry.category}  
**Tags**: ${entry.tags.join(', ')}  
**Global File**: \`${entry.filePath}\`

This knowledge is now available across all your projects!
*🧠 Unconscious sync triggered - backing up to cloud automatically.*
`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Global Knowledge Status Tool - Show summary of the global knowledge base
 */
export class GlobalKnowledgeStatusTool implements vscode.LanguageModelTool<Record<string, never>> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<Record<string, never>>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: 'Retrieving global knowledge status...'
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<Record<string, never>>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        await ensureGlobalKnowledgeDirectories();
        
        const summary = await getGlobalKnowledgeSummary();
        const registry = await ensureProjectRegistry();

        // Get cloud sync status
        let syncStatusStr = '';
        try {
            const syncStatus = await getSyncStatus();
            const statusEmoji = syncStatus.status === 'up-to-date' ? '✅' :
                               syncStatus.status === 'needs-push' ? '📤' :
                               syncStatus.status === 'needs-pull' ? '📥' :
                               syncStatus.status === 'error' ? '❌' : '⚪';
            syncStatusStr = `| Cloud Sync | ${statusEmoji} ${syncStatus.status} |\n`;
        } catch {
            syncStatusStr = `| Cloud Sync | ⚪ Not configured |\n`;
        }

        let result = `## 🧠 Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| Global Patterns | ${summary.totalPatterns} |
| Global Insights | ${summary.totalInsights} |
| Known Projects | ${registry.projects.length} |
${syncStatusStr}
### Knowledge by Category
`;
        
        for (const [cat, count] of Object.entries(summary.categories)) {
            result += `- **${cat}**: ${count}\n`;
        }

        if (summary.topTags.length > 0) {
            result += `\n### Top Tags\n`;
            for (const { tag, count } of summary.topTags) {
                result += `- ${tag}: ${count}\n`;
            }
        }

        if (summary.recentEntries.length > 0) {
            result += `\n### Recent Entries\n`;
            for (const entry of summary.recentEntries) {
                const typeEmoji = entry.type === 'pattern' ? '📐' : '💡';
                result += `- ${typeEmoji} **${entry.title}** (${entry.category})\n`;
            }
        }

        if (registry.projects.length > 0) {
            result += `\n### Known Projects\n`;
            for (const project of registry.projects.slice(0, 5)) {
                result += `- **${project.name}** - ${project.knowledgeFiles} knowledge files\n`;
            }
        }

        result += `\n### Global Knowledge Location\n\`${getAlexGlobalPath()}\`\n`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Register all global knowledge tools
 */
export function registerGlobalKnowledgeTools(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.lm.registerTool('alex_global_knowledge_search', new GlobalKnowledgeSearchTool()),
        vscode.lm.registerTool('alex_save_insight', new SaveInsightTool()),
        vscode.lm.registerTool('alex_promote_knowledge', new PromoteKnowledgeTool()),
        vscode.lm.registerTool('alex_global_knowledge_status', new GlobalKnowledgeStatusTool())
    );
}
