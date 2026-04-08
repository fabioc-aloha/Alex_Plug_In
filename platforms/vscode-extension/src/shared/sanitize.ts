/**
 * Alex Cognitive Architecture - Sanitization & Validation Utilities
 *
 * P0 Security: Prevent XSS attacks and validate user data
 *
 * @module shared/sanitize
 */

import * as crypto from "crypto";
import * as workspaceFs from "./workspaceFs";

/**
 * Generate a cryptographically secure nonce for Content Security Policy
 * Use this for script-src directives in webviews to allow inline scripts
 *
 * @returns A random 32-character hex string
 */
export function getNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Escape HTML special characters to prevent XSS attacks
 * Use this for any user-controlled content rendered in webviews
 *
 * @param text - The text to escape
 * @returns HTML-safe string
 */
export function escapeHtml(text: string): string {
  if (typeof text !== "string") {
    return "";
  }
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// JSON Schema Validation for User Profile
// ============================================================================

/**
 * User profile schema definition
 */
export interface UserProfileSchema {
  name?: string;
  nickname?: string;
  pronouns?: string;
  formality?: "casual" | "balanced" | "formal";
  detailLevel?: "brief" | "balanced" | "detailed";
  explanationStyle?: "examples-first" | "theory-first" | "mixed";
  humor?: boolean;
  encouragement?: boolean;
  questionFrequency?: "minimal" | "moderate" | "frequent";
  proactiveSuggestions?: boolean;
  primaryTechnologies?: string[];
  learningGoals?: string[];
  expertiseAreas?: string[];
  currentProjects?: string[];
}

/**
 * Validation result for user profile
 */
export interface ProfileValidationResult {
  valid: boolean;
  errors: string[];
  sanitized?: UserProfileSchema;
}

/**
 * Validate and sanitize user profile JSON
 *
 * @param data - The raw JSON data to validate
 * @returns Validation result with sanitized data if valid
 */
export function validateUserProfile(data: unknown): ProfileValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, errors: ["Profile must be a valid JSON object"] };
  }

  const profile = data as Record<string, unknown>;
  const sanitized: UserProfileSchema = {};

  // Validate string fields
  const stringFields = ["name", "nickname", "pronouns"] as const;
  for (const field of stringFields) {
    if (profile[field] !== undefined) {
      if (typeof profile[field] !== "string") {
        errors.push(`${field} must be a string`);
      } else if ((profile[field] as string).length > 100) {
        errors.push(`${field} must be 100 characters or less`);
      } else {
        sanitized[field] = escapeHtml(profile[field] as string);
      }
    }
  }

  // Validate enum fields
  const enumValidation: Record<string, readonly string[]> = {
    formality: ["casual", "balanced", "formal"],
    detailLevel: ["brief", "balanced", "detailed"],
    explanationStyle: ["examples-first", "theory-first", "mixed"],
    questionFrequency: ["minimal", "moderate", "frequent"],
  };

  for (const [field, validValues] of Object.entries(enumValidation)) {
    if (profile[field] !== undefined) {
      if (
        typeof profile[field] !== "string" ||
        !validValues.includes(profile[field] as string)
      ) {
        errors.push(`${field} must be one of: ${validValues.join(", ")}`);
      } else {
        (sanitized as Record<string, unknown>)[field] = profile[field];
      }
    }
  }

  // Validate boolean fields
  const booleanFields = [
    "humor",
    "encouragement",
    "proactiveSuggestions",
  ] as const;
  for (const field of booleanFields) {
    if (profile[field] !== undefined) {
      if (typeof profile[field] !== "boolean") {
        errors.push(`${field} must be a boolean`);
      } else {
        sanitized[field] = profile[field] as boolean;
      }
    }
  }

  // Validate string array fields
  const arrayFields = [
    "primaryTechnologies",
    "learningGoals",
    "expertiseAreas",
    "currentProjects",
  ] as const;
  for (const field of arrayFields) {
    if (profile[field] !== undefined) {
      if (!Array.isArray(profile[field])) {
        errors.push(`${field} must be an array`);
      } else {
        const arr = profile[field] as unknown[];
        if (arr.length > 50) {
          errors.push(`${field} must have 50 items or less`);
        } else if (!arr.every((item) => typeof item === "string")) {
          errors.push(`${field} must be an array of strings`);
        } else {
          sanitized[field] = arr.map((s) =>
            escapeHtml(s as string),
          ) as string[];
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined,
  };
}

// ============================================================================
// Safe JSON Parsing with Recovery
// ============================================================================

/**
 * Result of safe JSON parsing
 */
export interface SafeJsonResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  recovered?: boolean;
}

/**
 * Safely parse JSON with error recovery
 * Attempts to fix common JSON issues before giving up
 *
 * @param content - The JSON string to parse
 * @returns Parse result with optional recovery
 */
export function safeJsonParse<T>(content: string): SafeJsonResult<T> {
  // First try direct parse
  try {
    const data = JSON.parse(content) as T;
    return { success: true, data };
  } catch (firstError) {
    // Attempt recovery for common issues
    let recovered = content;

    // Remove BOM if present
    if (recovered.charCodeAt(0) === 0xfeff) {
      recovered = recovered.slice(1);
    }

    // Remove trailing commas (common mistake)
    recovered = recovered.replace(/,\s*([\]}])/g, "$1");

    // Try to fix unquoted keys (simple cases)
    recovered = recovered.replace(
      /(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g,
      '$1"$2":',
    );

    try {
      const data = JSON.parse(recovered) as T;
      return { success: true, data, recovered: true };
    } catch {
      // Recovery failed
      return {
        success: false,
        error:
          firstError instanceof Error ? firstError.message : "Invalid JSON",
      };
    }
  }
}

/**
 * Create a backup of a file before modifying it
 *
 * @param filePath - Path to the file to backup
 * @returns Path to backup file or undefined if backup failed
 */
export async function createConfigBackup(
  filePath: string,
): Promise<string | undefined> {
  try {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    await workspaceFs.copyFile(filePath, backupPath);
    return backupPath;
  } catch {
    return undefined;
  }
}
