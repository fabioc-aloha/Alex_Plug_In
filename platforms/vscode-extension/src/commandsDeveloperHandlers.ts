/**
 * commandsDeveloperHandlers.ts — Extracted handler logic for developer commands
 *
 * Contains the code-context helper.
 * Extracted from commandsDeveloper.ts to satisfy NASA R4 (≤60 lines per function).
 */
import * as vscode from "vscode";
import * as path from "path";
import { getLanguageIdFromPath } from "./shared/utils";

// ============================================================================
// Shared code-context helper
// ============================================================================

export interface CodeContext {
  text: string;
  fileName: string;
  languageId: string;
}

/** Read code from a URI, active editor selection, or return empty. */
export async function getCodeContext(uri?: vscode.Uri): Promise<CodeContext> {
  if (uri) {
    const content = await vscode.workspace.fs.readFile(uri);
    return {
      text: new TextDecoder().decode(content),
      fileName: path.basename(uri.fsPath),
      languageId: getLanguageIdFromPath(uri.fsPath),
    };
  }
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    return {
      text: !selection.isEmpty ? editor.document.getText(selection) : "",
      fileName: path.basename(editor.document.fileName),
      languageId: editor.document.languageId,
    };
  }
  return { text: "", fileName: "input", languageId: "text" };
}

