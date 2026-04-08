import * as vscode from "vscode";

let _channel: vscode.OutputChannel | undefined;

/** Get (or lazily create) the shared Alex output channel. */
function channel(): vscode.OutputChannel {
  if (!_channel) {
    _channel = vscode.window.createOutputChannel("Alex");
  }
  return _channel;
}

/** Info-level log → Output Channel */
export function logInfo(message: string): void {
  channel().appendLine(`[INFO]  ${message}`);
}

/** Dispose the channel (call from extension deactivate). */
export function disposeLog(): void {
  _channel?.dispose();
  _channel = undefined;
}
