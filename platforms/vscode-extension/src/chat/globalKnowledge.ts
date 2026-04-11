import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import * as lockfile from "proper-lockfile";
import {
  AI_MEMORY_PATHS,
  IGlobalKnowledgeEntry,
  IGlobalKnowledgeIndex,
  IProjectRegistry,
  IProjectRegistryEntry,
} from "../shared/constants";

// ============================================================================
// GLOBAL KNOWLEDGE BASE UTILITIES
// ============================================================================

/**
 * Lock file options for concurrent access safety
 * Reduced timeouts to prevent freezes when locks are held by other processes
 */
const LOCK_OPTIONS = {
  stale: 5000, // Consider lock stale after 5 seconds (reduced from 10)
  retries: {
    retries: 3, // Reduced from 5 to fail faster
    factor: 2,
    minTimeout: 100,
    maxTimeout: 500, // Reduced from 1000
  },
};

/**
 * Convert an absolute file path to a portable relative path (forward slashes)
 * suitable for storing in index.json. Paths are relative to the AI-Memory root.
 * If the path is already relative, normalizes separators to forward slashes.
 */
export function toPortablePath(absolutePath: string): string {
  const root = resolveAIMemoryRoot();
  let rel: string;
  if (path.isAbsolute(absolutePath) && absolutePath.startsWith(root)) {
    rel = path.relative(root, absolutePath);
  } else if (!path.isAbsolute(absolutePath)) {
    rel = absolutePath;
  } else {
    // Absolute path outside AI-Memory — store as-is but normalize slashes
    rel = absolutePath;
  }
  // Normalize to forward slashes for cross-platform portability
  return rel.split(path.sep).join("/");
}

/**
 * Resolve a portable relative path from index.json to an absolute local path.
 */
export function resolvePortablePath(portablePath: string): string {
  if (path.isAbsolute(portablePath)) {
    return portablePath;
  }
  // Convert forward slashes to platform separators and resolve against AI-Memory root
  const localPath = portablePath.split("/").join(path.sep);
  return path.join(resolveAIMemoryRoot(), localPath);
}

/**
 * Read knowledge file content from local filesystem.
 * Handles both absolute and portable relative paths.
 */
export async function readKnowledgeFileContent(
  filePath: string,
  _entry?: IGlobalKnowledgeEntry,
): Promise<string | null> {
  // Resolve portable relative paths to absolute
  const resolvedPath = path.isAbsolute(filePath)
    ? filePath
    : resolvePortablePath(filePath);

  try {
    if (await fs.pathExists(resolvedPath)) {
      return await fs.readFile(resolvedPath, "utf-8");
    }
  } catch {
    // File not readable
  }

  return null;
}

// ============================================================================
// AI-MEMORY PATH RESOLUTION
// ============================================================================

/** A detected cloud storage root with its provider label */
export interface CloudStorageRoot {
  path: string;
  label: string; // e.g. "OneDrive - Personal", "iCloud Drive", "Google Drive", "Dropbox"
}

/**
 * Detect all cloud storage roots on the current platform.
 * Supports: OneDrive (personal/commercial/family), iCloud Drive, Google Drive, Dropbox.
 */
export function getAllCloudStorageRoots(): CloudStorageRoot[] {
  const roots: CloudStorageRoot[] = [];
  const seen = new Set<string>();

  const add = (p: string, label: string) => {
    const normalized = p.toLowerCase();
    if (!seen.has(normalized) && fs.existsSync(p)) {
      seen.add(normalized);
      roots.push({ path: p, label });
    }
  };

  if (process.platform === "win32") {
    const userProfile = process.env.USERPROFILE || os.homedir();

    // OneDrive: env vars set by the client
    for (const envVar of ["OneDrive", "OneDriveConsumer", "OneDriveCommercial"]) {
      const val = process.env[envVar];
      if (val) {
        add(val, path.basename(val));
      }
    }

    // OneDrive: scan user profile for "OneDrive*" folders
    try {
      for (const entry of fs.readdirSync(userProfile)) {
        if (entry.startsWith("OneDrive")) {
          const fullPath = path.join(userProfile, entry);
          if (fs.statSync(fullPath).isDirectory()) {
            add(fullPath, entry);
          }
        }
      }
    } catch { /* ignore */ }

    // iCloud Drive (Windows)
    const iCloudWin = path.join(userProfile, "iCloudDrive");
    add(iCloudWin, "iCloud Drive");

    // Google Drive (Windows — Desktop app creates a virtual drive, but also syncs here)
    const googleDrive = path.join(userProfile, "Google Drive");
    add(googleDrive, "Google Drive");
    const googleDriveStream = path.join(userProfile, "My Drive");
    add(googleDriveStream, "Google Drive (My Drive)");

    // Dropbox (Windows)
    const dropbox = path.join(userProfile, "Dropbox");
    add(dropbox, "Dropbox");
  } else if (process.platform === "darwin") {
    const home = os.homedir();
    const cloudStorageDir = path.join(home, "Library", "CloudStorage");

    // macOS CloudStorage: OneDrive-*, GoogleDrive-*, Dropbox-*, etc.
    if (fs.existsSync(cloudStorageDir)) {
      try {
        for (const entry of fs.readdirSync(cloudStorageDir)) {
          const fullPath = path.join(cloudStorageDir, entry);
          if (fs.statSync(fullPath).isDirectory()) {
            // Friendly label: "OneDrive-Personal" → "OneDrive - Personal"
            const label = entry.replace(/-/g, " - ").replace(/  /g, " ");
            add(fullPath, label);
          }
        }
      } catch { /* ignore */ }
    }

    // iCloud Drive (macOS)
    const iCloudMac = path.join(
      home,
      "Library",
      "Mobile Documents",
      "com~apple~CloudDocs",
    );
    add(iCloudMac, "iCloud Drive");

    // Legacy ~/OneDrive (standalone or symlink)
    const legacyOneDrive = path.join(home, "OneDrive");
    add(legacyOneDrive, "OneDrive");

    // Dropbox (macOS — sometimes ~/Dropbox)
    const dropboxMac = path.join(home, "Dropbox");
    add(dropboxMac, "Dropbox");

    // Google Drive (macOS — sometimes ~/Google Drive)
    const googleDriveMac = path.join(home, "Google Drive");
    add(googleDriveMac, "Google Drive");
  }

  return roots;
}

/**
 * Detect the cloud storage root that contains the AI-Memory folder.
 * Returns the first root with AI-Memory/, or null if none found.
 * For first-time setup with multiple options, use {@link promptForCloudStorageRoot}.
 */
export function detectCloudStorageWithAIMemory(): string | null {
  const roots = getAllCloudStorageRoots();
  for (const root of roots) {
    const aiMemPath = path.join(root.path, AI_MEMORY_PATHS.folderName);
    if (fs.existsSync(aiMemPath)) {
      return root.path;
    }
  }
  return null;
}

/**
 * Prompt the user to pick a cloud storage root for AI-Memory.
 * Called during first-time setup when multiple cloud services are available.
 * Returns the chosen path, or null if the user cancelled.
 */
export async function promptForCloudStorageRoot(): Promise<string | null> {
  const roots = getAllCloudStorageRoots();

  if (roots.length === 0) {
    return null;
  }

  if (roots.length === 1) {
    return roots[0].path;
  }

  // Multiple cloud services — ask the user
  const items = roots.map((r) => ({
    label: r.label,
    description: r.path,
    path: r.path,
  }));

  // Add local-only option
  items.push({
    label: "Local only (no cloud sync)",
    description: path.join(os.homedir(), AI_MEMORY_PATHS.localFallback),
    path: path.join(os.homedir(), AI_MEMORY_PATHS.localFallback),
  });

  const picked = await vscode.window.showQuickPick(items, {
    title: "Where should AI-Memory be stored?",
    placeHolder: "Choose a cloud storage location for cross-device sync",
  });

  return picked?.path ?? null;
}

/**
 * Legacy alias — returns the cloud root containing AI-Memory, or first available.
 */
export function detectOneDrivePath(): string | null {
  // First check for existing AI-Memory in any cloud storage
  const existing = detectCloudStorageWithAIMemory();
  if (existing) {
    return existing;
  }

  // Fall back to first available cloud storage root
  const roots = getAllCloudStorageRoots();
  return roots.length > 0 ? roots[0].path : null;
}

/** Cached AI-Memory root path (resolved once per session) */
let _aiMemoryRoot: string | null = null;

/**
 * Explicitly set the AI-Memory root path (e.g., after user picks a cloud location).
 * Also persists the choice to the `alex.globalKnowledge.repoPath` setting.
 */
export async function setAIMemoryRoot(aiMemoryFolderPath: string): Promise<void> {
  _aiMemoryRoot = aiMemoryFolderPath;
  // Persist so the user doesn't get asked again
  await vscode.workspace
    .getConfiguration("alex.globalKnowledge")
    .update("repoPath", aiMemoryFolderPath, vscode.ConfigurationTarget.Global);
}

/**
 * Resolve the AI-Memory root folder path (synchronous, no user prompts).
 * Priority: user-configured repoPath > existing AI-Memory in cloud > first cloud root > local fallback
 */
export function resolveAIMemoryRoot(): string {
  if (_aiMemoryRoot) {
    return _aiMemoryRoot;
  }

  // Check user-configured path first
  const configuredPath = vscode.workspace
    .getConfiguration("alex.globalKnowledge")
    .get<string>("repoPath");
  if (configuredPath && configuredPath.trim() !== "") {
    if (fs.existsSync(configuredPath)) {
      _aiMemoryRoot = configuredPath;
      return _aiMemoryRoot;
    }
    console.warn(
      `Configured AI-Memory path ${configuredPath} does not exist, falling back to auto-detection`,
    );
  }

  // OneDrive detection
  const oneDriveRoot = detectOneDrivePath();
  if (oneDriveRoot) {
    _aiMemoryRoot = path.join(oneDriveRoot, AI_MEMORY_PATHS.folderName);
    return _aiMemoryRoot;
  }

  // Local fallback
  _aiMemoryRoot = path.join(os.homedir(), AI_MEMORY_PATHS.localFallback);
  return _aiMemoryRoot;
}

/**
 * Get the AI-Memory root path (alias for resolveAIMemoryRoot).
 */
export function getAlexGlobalPath(): string {
  return resolveAIMemoryRoot();
}

/** Subpath keys for AI-Memory directory structure */
type AIMemorySubpath = "root" | "knowledge" | "patterns" | "insights" | "index" | "projectRegistry" | "userProfile";

/**
 * Get the full path to an AI-Memory subdirectory or file.
 */
export function getGlobalKnowledgePath(subpath: AIMemorySubpath): string {
  const root = resolveAIMemoryRoot();
  switch (subpath) {
    case "root":
      return root;
    case "knowledge":
      return path.join(root, AI_MEMORY_PATHS.knowledge);
    case "patterns":
      return path.join(root, AI_MEMORY_PATHS.patterns);
    case "insights":
      return path.join(root, AI_MEMORY_PATHS.insights);
    case "index":
      return path.join(root, AI_MEMORY_PATHS.index);
    case "projectRegistry":
      return path.join(root, AI_MEMORY_PATHS.projectRegistry);
    case "userProfile":
      return path.join(root, AI_MEMORY_PATHS.userProfile);
    default:
      return root;
  }
}

/**
 * Ensure all AI-Memory directories exist
 */
export async function ensureGlobalKnowledgeDirectories(): Promise<void> {
  const root = resolveAIMemoryRoot();
  await fs.ensureDir(root);
  await fs.ensureDir(path.join(root, AI_MEMORY_PATHS.insights));
  await fs.ensureDir(path.join(root, AI_MEMORY_PATHS.knowledge));
  await fs.ensureDir(path.join(root, AI_MEMORY_PATHS.patterns));
}

/**
 * Detect whether the AI-Memory folder exists and is valid.
 * Returns the path if found, null otherwise.
 */
export async function detectGlobalKnowledgeRepo(): Promise<string | null> {
  const root = resolveAIMemoryRoot();

  // Check if the folder exists with at least an insights/ subdirectory
  const insightsPath = path.join(root, AI_MEMORY_PATHS.insights);
  if (await fs.pathExists(insightsPath)) {
    return root;
  }

  // Also accept if index.json exists (pre-migration structure)
  const indexPath = path.join(root, AI_MEMORY_PATHS.index);
  if (await fs.pathExists(indexPath)) {
    return root;
  }

  return null;
}

/**
 * Execute a function with file locking for safe concurrent access.
 * This ensures only one Alex instance can modify a file at a time.
 * Now includes better error handling and timeout protection.
 */
async function withFileLock<T>(
  filePath: string,
  operation: () => Promise<T>,
): Promise<T> {
  // Ensure the file exists before locking (lockfile requires existing file)
  if (!(await fs.pathExists(filePath))) {
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
    console.warn(
      `File lock failed for ${filePath}, proceeding without lock:`,
      lockError?.message || lockError,
    );
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
  updater: (
    index: IGlobalKnowledgeIndex,
  ) => IGlobalKnowledgeIndex | Promise<IGlobalKnowledgeIndex>,
): Promise<IGlobalKnowledgeIndex> {
  const indexPath = getGlobalKnowledgePath("index");
  await ensureGlobalKnowledgeDirectories();

  return await withFileLock(indexPath, async () => {
    // Read current index (or create new one)
    let index: IGlobalKnowledgeIndex;
    try {
      if (await fs.pathExists(indexPath)) {
        const content = await fs.readFile(indexPath, "utf-8");
        if (content.trim()) {
          index = JSON.parse(content);
        } else {
          index = {
            version: "1.0.0",
            lastUpdated: new Date().toISOString(),
            entries: [],
          };
        }
      } else {
        index = {
          version: "1.0.0",
          lastUpdated: new Date().toISOString(),
          entries: [],
        };
      }
    } catch (err) {
      // Corrupted, create new
      index = {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        entries: [],
      };
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
  updater: (
    registry: IProjectRegistry,
  ) => IProjectRegistry | Promise<IProjectRegistry>,
): Promise<IProjectRegistry> {
  const registryPath = getGlobalKnowledgePath("projectRegistry");
  await ensureGlobalKnowledgeDirectories();

  return await withFileLock(registryPath, async () => {
    // Read current registry (or create new one)
    let registry: IProjectRegistry;
    try {
      if (await fs.pathExists(registryPath)) {
        const content = await fs.readFile(registryPath, "utf-8");
        if (content.trim()) {
          registry = JSON.parse(content);
        } else {
          registry = {
            version: "1.0.0",
            lastUpdated: new Date().toISOString(),
            projects: [],
          };
        }
      } else {
        registry = {
          version: "1.0.0",
          lastUpdated: new Date().toISOString(),
          projects: [],
        };
      }
    } catch (err) {
      registry = {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        projects: [],
      };
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
 * Initialize the global knowledge index from local repo or ~/.alex fallback
 *
 * Priority:
 * 1. Local GK repo (if exists)
 * 2. Create empty local index in ~/.alex (fallback)
 */
export async function ensureGlobalKnowledgeIndex(): Promise<IGlobalKnowledgeIndex> {
  // First, check for local GK repo
  const gkRepo = await detectGlobalKnowledgeRepo();

  if (gkRepo) {
    const indexPath = path.join(gkRepo, "index.json");

    try {
      if (await fs.pathExists(indexPath)) {
        const content = await fs.readFile(indexPath, "utf-8");
        if (content.trim()) {
          const index = JSON.parse(content) as IGlobalKnowledgeIndex;
          // Resolve portable relative paths to absolute for the current platform
          for (const entry of index.entries) {
            if (!path.isAbsolute(entry.filePath)) {
              entry.filePath = resolvePortablePath(entry.filePath);
            }
          }
          return index;
        }
      }
    } catch (err) {
      console.warn("[Alex] Failed to read local GK index:", err);
    }
  }

  // Fallback: create local empty index in ~/.alex
  const indexPath = getGlobalKnowledgePath("index");
  await ensureGlobalKnowledgeDirectories();

  return await withFileLock(indexPath, async () => {
    try {
      if (await fs.pathExists(indexPath)) {
        const content = await fs.readFile(indexPath, "utf-8");
        if (content.trim()) {
          return JSON.parse(content);
        }
      }
    } catch (err) {
      // Index corrupted, recreate
    }

    const newIndex: IGlobalKnowledgeIndex = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      entries: [],
    };

    await fs.writeJson(indexPath, newIndex, { spaces: 2 });
    return newIndex;
  });
}

/**
 * Get or initialize the project registry (with locking)
 */
export async function ensureProjectRegistry(): Promise<IProjectRegistry> {
  await ensureGlobalKnowledgeDirectories();

  return await updateProjectRegistry((registry) => registry);
}

/**
 * Register or update the current project in the registry
 */
export async function registerCurrentProject(): Promise<
  IProjectRegistryEntry | undefined
> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return undefined;
  }

  const projectPath = workspaceFolders[0].uri.fsPath;
  const projectName = path.basename(projectPath);

  // Count knowledge files
  let knowledgeFileCount = 0;
  const dkPattern = new vscode.RelativePattern(
    workspaceFolders[0],
    ".github/domain-knowledge/*.md",
  );
  const dkFiles = await vscode.workspace.findFiles(dkPattern);
  knowledgeFileCount = dkFiles.length;

  // Use atomic update with locking
  let savedEntry: IProjectRegistryEntry | undefined;
  await updateProjectRegistry((registry) => {
    // Find existing entry or create new one
    const existingIndex = registry.projects.findIndex(
      (p) => p.path.toLowerCase() === projectPath.toLowerCase(),
    );
    const entry: IProjectRegistryEntry = {
      path: projectPath,
      name: projectName,
      lastAccessed: new Date().toISOString(),
      knowledgeFiles: knowledgeFileCount,
    };

    if (existingIndex >= 0) {
      // Preserve existing data, update access time and file count
      registry.projects[existingIndex] = {
        ...registry.projects[existingIndex],
        ...entry,
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

// ============================================================================
// USER PROFILE — AI-Memory backed
// ============================================================================

/**
 * Load user profile from AI-Memory (cross-platform, cross-workspace).
 * Falls back to workspace `.github/config/user-profile.json` for migration.
 */
export async function loadUserProfileFromAIMemory(): Promise<Record<string, unknown> | null> {
  const aiMemoryProfilePath = getGlobalKnowledgePath("userProfile");

  try {
    if (await fs.pathExists(aiMemoryProfilePath)) {
      return await fs.readJson(aiMemoryProfilePath);
    }
  } catch (err) {
    console.warn("[Alex] Failed to read AI-Memory user profile:", err);
  }

  // Fallback: check workspace .github/config/user-profile.json (legacy location)
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    const legacyPath = path.join(workspaceFolders[0].uri.fsPath, ".github", "config", "user-profile.json");
    try {
      if (await fs.pathExists(legacyPath)) {
        const profile = await fs.readJson(legacyPath);
        // Auto-migrate: copy to AI-Memory for future reads
        await fs.ensureDir(path.dirname(aiMemoryProfilePath));
        await fs.writeJson(aiMemoryProfilePath, profile, { spaces: 2 });
        console.log("[Alex] Migrated user profile from workspace to AI-Memory");
        return profile;
      }
    } catch {
      // Ignore legacy read failures
    }
  }

  return null;
}

/**
 * Save user profile to AI-Memory.
 */
export async function saveUserProfileToAIMemory(profile: Record<string, unknown>): Promise<void> {
  const profilePath = getGlobalKnowledgePath("userProfile");
  await fs.ensureDir(path.dirname(profilePath));
  await fs.writeJson(profilePath, profile, { spaces: 2 });
}

// Re-export from extracted modules for backward compatibility
export {
  createGlobalInsight,
  searchGlobalKnowledge,
  autoPromoteDuringMeditation,
  getGlobalKnowledgeSummary,
} from "./globalKnowledgeOps";
export { registerGlobalKnowledgeTools } from "./globalKnowledgeTools";
