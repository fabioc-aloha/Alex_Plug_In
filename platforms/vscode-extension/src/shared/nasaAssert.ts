/**
 * NASA Rule 5 Assertion Utilities — Critical function invariant checking
 *
 * Purpose: Enable logging assertions without crashing production code.
 * Used by: View providers, command handlers, and other critical paths.
 *
 * Based on: NASA/JPL Power of 10 Rule 5 (Assertion Density)
 *
 * @module nasaAssert
 * @since 5.9.11
 */

/** Log levels for assertion failures */
type AssertionLevel = "warn" | "error" | "debug";

/** Contextual data attached to assertion failures */
interface AssertionContext {
  [key: string]: unknown;
}

/**
 * Log an assertion failure without crashing.
 * In production, logs the failure but continues execution.
 *
 * NASA R5: Provides assertion capability for invariant checking
 *
 * @param condition - The condition that should be true
 * @param message - Description of the invariant being checked
 * @param context - Optional data to include in log output
 * @param level - Severity level for logging (default: warn)
 * @returns The condition value (for chaining)
 *
 * @example
 * // Check entry conditions
 * nasaAssert(extensionUri !== undefined, 'Extension URI must be defined', { uri: extensionUri });
 * nasaAssert(health.totalSynapses >= 0, 'Synapse count must be non-negative', { count: health.totalSynapses });
 */
export function nasaAssert(
  condition: boolean,
  message: string,
  context?: AssertionContext,
  level: AssertionLevel = "warn",
): boolean {
  if (!condition) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : "";
    const logMessage = `[NASA-ASSERT] ${timestamp} | ${message}${contextStr}`;

    switch (level) {
      case "error":
        console.error(logMessage);
        break;
      case "debug":
        console.debug(logMessage);
        break;
      case "warn":
      default:
        console.warn(logMessage);
        break;
    }
  }
  return condition;
}

/**
 * Assert that a value is defined (not null/undefined).
 * Type guard that narrows the type when assertion passes.
 *
 * @param value - The value to check
 * @param name - Name of the value for error message
 * @returns True if value is defined
 *
 * @example
 * if (nasaAssertDefined(workspaceFolder, 'workspaceFolder')) {
 *   // TypeScript knows workspaceFolder is defined here
 *   processFolder(workspaceFolder);
 * }
 */
export function nasaAssertDefined<T>(
  value: T | null | undefined,
  name: string,
): value is T {
  return nasaAssert(
    value !== null && value !== undefined,
    `${name} must be defined`,
    { actualType: typeof value, value: value === null ? "null" : "undefined" },
  );
}

/**
 * Assert that an array is not empty.
 *
 * @param arr - The array to check
 * @param name - Name of the array for error message
 * @returns True if array has elements
 *
 * @example
 * nasaAssertNonEmpty(workspaceFolders, 'workspaceFolders');
 */
export function nasaAssertNonEmpty<T>(
  arr: T[] | undefined,
  name: string,
): arr is T[] & { length: number } {
  return nasaAssert(
    Array.isArray(arr) && arr.length > 0,
    `${name} must be non-empty array`,
    { isArray: Array.isArray(arr), length: arr?.length ?? 0 },
  );
}

/**
 * Assert that a number is within expected bounds.
 *
 * @param value - The number to check
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @param name - Name of the value for error message
 * @returns True if value is within bounds
 *
 * @example
 * nasaAssertBounded(health.brokenSynapses, 0, 1000, 'brokenSynapses');
 */
export function nasaAssertBounded(
  value: number,
  min: number,
  max: number,
  name: string,
): boolean {
  return nasaAssert(
    value >= min && value <= max,
    `${name} must be between ${min} and ${max}`,
    { value, min, max },
  );
}

/**
 * Assert that a string matches expected pattern.
 *
 * @param value - The string to check
 * @param pattern - RegExp pattern to match
 * @param name - Name of the value for error message
 * @returns True if string matches pattern
 *
 * @example
 * nasaAssertPattern(version, /^\d+\.\d+\.\d+$/, 'version');
 */
export function nasaAssertPattern(
  value: string | undefined,
  pattern: RegExp,
  name: string,
): boolean {
  return nasaAssert(
    typeof value === "string" && pattern.test(value),
    `${name} must match pattern ${pattern}`,
    { value, pattern: pattern.toString() },
  );
}
