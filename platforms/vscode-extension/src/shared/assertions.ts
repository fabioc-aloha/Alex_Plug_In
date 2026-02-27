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

/**
 * Custom error for assertion failures with stack trace preservation
 */
export class AssertionError extends Error {
    constructor(message: string) {
        super(`Assertion failed: ${message}`);
        this.name = 'AssertionError';
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
    message: string
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
    name: string
): void {
    if (value < min || value > max) {
        throw new AssertionError(
            `${name} must be between ${min} and ${max}, got ${value}`
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
    name: string
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
export function assert(
    condition: boolean,
    message: string
): asserts condition {
    if (!condition) {
        throw new AssertionError(message);
    }
}

/**
 * Assert that a value matches one of the allowed values
 * 
 * @example
 * assertOneOf(status, ['pending', 'active', 'completed'], 'Status');
 */
export function assertOneOf<T>(
    value: T,
    allowedValues: readonly T[],
    name: string
): void {
    if (!allowedValues.includes(value)) {
        throw new AssertionError(
            `${name} must be one of [${allowedValues.join(', ')}], got ${value}`
        );
    }
}

/**
 * Assert that an object has a required property
 * TypeScript narrows to include the property
 * 
 * @example
 * assertHasProperty(response, 'data', 'API response');
 * // response.data is now accessible
 */
export function assertHasProperty<T extends object, K extends string>(
    obj: T,
    property: K,
    objectName: string
): asserts obj is T & Record<K, unknown> {
    if (!(property in obj)) {
        throw new AssertionError(
            `${objectName} must have property '${property}'`
        );
    }
}

/**
 * Assert that a value is a positive integer (for counts, indices)
 * 
 * @example
 * assertPositiveInteger(pageNumber, 'Page number');
 */
export function assertPositiveInteger(
    value: number,
    name: string
): void {
    if (!Number.isInteger(value) || value < 1) {
        throw new AssertionError(
            `${name} must be a positive integer, got ${value}`
        );
    }
}

/**
 * Assert that a value is a non-negative integer (for zero-based indices)
 * 
 * @example
 * assertNonNegativeInteger(index, 'Array index');
 */
export function assertNonNegativeInteger(
    value: number,
    name: string
): void {
    if (!Number.isInteger(value) || value < 0) {
        throw new AssertionError(
            `${name} must be a non-negative integer, got ${value}`
        );
    }
}

/**
 * Assert that a file path is absolute (platform-aware)
 * 
 * @example
 * assertAbsolutePath(filePath, 'Config file path');
 */
export function assertAbsolutePath(
    filePath: string,
    name: string
): void {
    const isAbsolute = filePath.startsWith('/') || /^[A-Za-z]:[\\/]/.test(filePath);
    if (!isAbsolute) {
        throw new AssertionError(
            `${name} must be an absolute path, got '${filePath}'`
        );
    }
}

/**
 * Assert invariant for AI prompt construction
 * Ensures safety guardrails are present
 * 
 * @example
 * assertPromptInvariants(prompt, {
 *   hasIdentity: true,
 *   hasGuardrails: true,
 *   maxTokens: 4000
 * });
 */
export interface PromptInvariants {
    hasIdentity?: boolean;
    hasGuardrails?: boolean;
    maxTokens?: number;
}

export function assertPromptInvariants(
    prompt: string,
    invariants: PromptInvariants
): void {
    if (invariants.hasIdentity) {
        assert(
            prompt.includes('Alex') || prompt.includes('identity'),
            'Prompt must include identity layer'
        );
    }
    if (invariants.hasGuardrails) {
        assert(
            prompt.includes('safety') || prompt.includes('guardrail') || prompt.includes('constraint'),
            'Prompt must include safety guardrails'
        );
    }
    if (invariants.maxTokens !== undefined) {
        // Rough token estimate: ~4 chars per token
        const estimatedTokens = Math.ceil(prompt.length / 4);
        assertBounded(estimatedTokens, 0, invariants.maxTokens, 'Estimated prompt tokens');
    }
}
