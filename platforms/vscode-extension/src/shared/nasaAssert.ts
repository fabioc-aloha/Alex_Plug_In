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
