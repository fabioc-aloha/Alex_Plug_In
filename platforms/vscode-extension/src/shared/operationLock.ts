/**
 * Shared operation lock to prevent concurrent modifications.
 * Extracted from extension.ts to break circular dependency:
 *   extension.ts → welcomeView.ts → extension.ts
 */

let operationInProgress = false;

/**
 * Check if an Alex operation is currently in progress
 */
export function isOperationInProgress(): boolean {
  return operationInProgress;
}

/**
 * Set the operation lock state (called by extension.ts withOperationLock)
 */
export function setOperationInProgress(value: boolean): void {
  operationInProgress = value;
}
