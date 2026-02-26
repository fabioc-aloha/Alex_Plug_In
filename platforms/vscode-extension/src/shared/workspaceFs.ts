/**
 * Workspace File System Utilities
 * 
 * Provides vscode.workspace.fs wrappers for workspace file operations.
 * Use these instead of fs-extra for files in the workspace (e.g., .github/).
 * 
 * Keep fs-extra for:
 * - Extension bundle files (context.extensionPath)
 * - Global storage (~/.alex/)
 * - Export operations (temp files, PPTX, audio)
 * 
 * See ADR-008-workspace-file-api.md for rationale.
 * 
 * @since v5.9.10
 */
import * as vscode from 'vscode';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Check if a file or directory exists in the workspace
 */
export async function pathExists(fsPath: string): Promise<boolean> {
    try {
        await vscode.workspace.fs.stat(vscode.Uri.file(fsPath));
        return true;
    } catch {
        return false;
    }
}

/**
 * Read a file as UTF-8 text
 */
export async function readFile(fsPath: string): Promise<string> {
    const content = await vscode.workspace.fs.readFile(vscode.Uri.file(fsPath));
    return decoder.decode(content);
}

/**
 * Write UTF-8 text to a file (creates parent directories if needed)
 */
export async function writeFile(fsPath: string, content: string): Promise<void> {
    const uri = vscode.Uri.file(fsPath);
    await vscode.workspace.fs.writeFile(uri, encoder.encode(content));
}

/**
 * Read a JSON file
 */
export async function readJson<T = unknown>(fsPath: string): Promise<T> {
    const content = await readFile(fsPath);
    return JSON.parse(content) as T;
}

/**
 * Write a JSON file with optional formatting
 */
export async function writeJson<T>(fsPath: string, data: T, options?: { spaces?: number }): Promise<void> {
    const spaces = options?.spaces ?? 2;
    const content = JSON.stringify(data, null, spaces);
    await writeFile(fsPath, content);
}

/**
 * Ensure a directory exists (creates if missing)
 */
export async function ensureDir(fsPath: string): Promise<void> {
    try {
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(fsPath));
    } catch (err) {
        // Ignore if already exists
        if (err instanceof vscode.FileSystemError && err.code === 'FileExists') {
            return;
        }
        throw err;
    }
}

/**
 * Read directory contents
 * @returns Array of [name, type] tuples where type is vscode.FileType
 */
export async function readDirectory(fsPath: string): Promise<[string, vscode.FileType][]> {
    return vscode.workspace.fs.readDirectory(vscode.Uri.file(fsPath));
}

/**
 * Get file/directory stats
 */
export async function stat(fsPath: string): Promise<vscode.FileStat> {
    return vscode.workspace.fs.stat(vscode.Uri.file(fsPath));
}

/**
 * Delete a file
 */
export async function deleteFile(fsPath: string): Promise<void> {
    await vscode.workspace.fs.delete(vscode.Uri.file(fsPath));
}

/**
 * Delete a directory recursively
 */
export async function deleteDirectory(fsPath: string, recursive = true): Promise<void> {
    await vscode.workspace.fs.delete(vscode.Uri.file(fsPath), { recursive });
}

/**
 * Copy a file
 */
export async function copyFile(source: string, target: string, overwrite = false): Promise<void> {
    await vscode.workspace.fs.copy(
        vscode.Uri.file(source),
        vscode.Uri.file(target),
        { overwrite }
    );
}

/**
 * Rename/move a file or directory
 */
export async function rename(oldPath: string, newPath: string, overwrite = false): Promise<void> {
    await vscode.workspace.fs.rename(
        vscode.Uri.file(oldPath),
        vscode.Uri.file(newPath),
        { overwrite }
    );
}
