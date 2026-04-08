/**
 * NASA Power of 10 Rule 5: Runtime Assertions
 *
 * Assertion utilities for defensive programming. These complement TypeScript's
 * compile-time type checking with runtime invariant validation.
 *
 * Design principles:
 * - Assertions throw in all environments (not silently ignored in production)
 * - Error messages are descriptive for debugging
 * - Each function is a TypeScript assertion function for type narrowing
 *
 * @see alex_docs/research/NASA-CODE-STANDARDS-ANALYSIS.md
 */

import * as path from "path";

/**
 * Custom error for assertion failures with stack trace preservation
 */
class AssertionError extends Error {
  constructor(message: string) {
    super(`Assertion failed: ${message}`);
    this.name = "AssertionError";
    // Capture stack trace, excluding the constructor call
    Error.captureStackTrace?.(this, AssertionError);
  }
}

/**
 * Assert that a value is defined (not null or undefined)
 * TypeScript narrows the type after this assertion
 *
 * @example
 * assertDefined(config.apiKey, 'API key must be configured');
 * // config.apiKey is now typed as non-null
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new AssertionError(message);
  }
}

/**
 * Assert that a number is within bounds (inclusive)
 *
 * @example
 * assertBounded(depth, 0, MAX_RECURSION_DEPTH, 'Recursion depth');
 */
export function assertBounded(
  value: number,
  min: number,
  max: number,
  name: string,
): void {
  if (value < min || value > max) {
    throw new AssertionError(
      `${name} must be between ${min} and ${max}, got ${value}`,
    );
  }
}

/**
 * Assert that a string or array is non-empty
 *
 * @example
 * assertNonEmpty(skills, 'Skills array');
 */
export function assertNonEmpty<T extends string | unknown[]>(
  value: T,
  name: string,
): void {
  if (value.length === 0) {
    throw new AssertionError(`${name} must not be empty`);
  }
}

/**
 * Assert a boolean condition with a descriptive message
 *
 * @example
 * assert(user.isAuthenticated, 'User must be authenticated');
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message);
  }
}

/**
 * Assert that a file path is absolute (platform-aware)
 *
 * @example
 * assertAbsolutePath(filePath, 'Config file path');
 */
export function assertAbsolutePath(filePath: string, name: string): void {
  if (!path.isAbsolute(filePath)) {
    throw new AssertionError(
      `${name} must be an absolute path, got '${filePath}'`,
    );
  }
}

