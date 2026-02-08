/**
 * Alex Cognitive Architecture - Sanitization & Validation Utilities
 * 
 * P0 Security: Prevent XSS attacks and validate user data
 * 
 * @module shared/sanitize
 */

import * as crypto from 'crypto';

/**
 * Generate a cryptographically secure nonce for Content Security Policy
 * Use this for script-src directives in webviews to allow inline scripts
 * 
 * @returns A random 32-character hex string
 */
export function getNonce(): string {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * Escape HTML special characters to prevent XSS attacks
 * Use this for any user-controlled content rendered in webviews
 * 
 * @param text - The text to escape
 * @returns HTML-safe string
 */
export function escapeHtml(text: string): string {
    if (typeof text !== 'string') {
        return '';
    }
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Sanitize a string for safe inclusion in HTML attributes
 * More aggressive escaping for attribute contexts
 * 
 * @param text - The text to sanitize
 * @returns Attribute-safe string
 */
export function sanitizeAttribute(text: string): string {
    if (typeof text !== 'string') {
        return '';
    }
    return escapeHtml(text)
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '&#10;')
        .replace(/\r/g, '&#13;');
}

/**
 * Sanitize a URL for safe use in href/src attributes
 * Prevents javascript: and data: URL attacks
 * 
 * @param url - The URL to sanitize
 * @returns Safe URL or empty string if dangerous
 */
export function sanitizeUrl(url: string): string {
    if (typeof url !== 'string') {
        return '';
    }
    
    const trimmed = url.trim().toLowerCase();
    
    // Block dangerous protocols
    if (trimmed.startsWith('javascript:') ||
        trimmed.startsWith('vbscript:') ||
        trimmed.startsWith('data:') && !trimmed.startsWith('data:image/')) {
        return '';
    }
    
    return url;
}

/**
 * Sanitize file path to prevent path traversal attacks
 * 
 * @param filePath - The file path to sanitize
 * @returns Sanitized path or empty string if dangerous
 */
export function sanitizeFilePath(filePath: string): string {
    if (typeof filePath !== 'string') {
        return '';
    }
    
    // Remove null bytes and normalize path separators
    let sanitized = filePath.replace(/\0/g, '').trim();
    
    // Block path traversal attempts
    if (sanitized.includes('..') || 
        sanitized.includes('~') ||
        /^[/\\]/.test(sanitized)) {
        return '';
    }
    
    return sanitized;
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
    formality?: 'casual' | 'balanced' | 'formal';
    detailLevel?: 'brief' | 'balanced' | 'detailed';
    explanationStyle?: 'examples-first' | 'theory-first' | 'mixed';
    humor?: boolean;
    encouragement?: boolean;
    questionFrequency?: 'minimal' | 'moderate' | 'frequent';
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
    
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { valid: false, errors: ['Profile must be a valid JSON object'] };
    }
    
    const profile = data as Record<string, unknown>;
    const sanitized: UserProfileSchema = {};
    
    // Validate string fields
    const stringFields = ['name', 'nickname', 'pronouns'] as const;
    for (const field of stringFields) {
        if (profile[field] !== undefined) {
            if (typeof profile[field] !== 'string') {
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
        formality: ['casual', 'balanced', 'formal'],
        detailLevel: ['brief', 'balanced', 'detailed'],
        explanationStyle: ['examples-first', 'theory-first', 'mixed'],
        questionFrequency: ['minimal', 'moderate', 'frequent']
    };
    
    for (const [field, validValues] of Object.entries(enumValidation)) {
        if (profile[field] !== undefined) {
            if (typeof profile[field] !== 'string' || 
                !validValues.includes(profile[field] as string)) {
                errors.push(`${field} must be one of: ${validValues.join(', ')}`);
            } else {
                (sanitized as Record<string, unknown>)[field] = profile[field];
            }
        }
    }
    
    // Validate boolean fields
    const booleanFields = ['humor', 'encouragement', 'proactiveSuggestions'] as const;
    for (const field of booleanFields) {
        if (profile[field] !== undefined) {
            if (typeof profile[field] !== 'boolean') {
                errors.push(`${field} must be a boolean`);
            } else {
                sanitized[field] = profile[field] as boolean;
            }
        }
    }
    
    // Validate string array fields
    const arrayFields = ['primaryTechnologies', 'learningGoals', 'expertiseAreas', 'currentProjects'] as const;
    for (const field of arrayFields) {
        if (profile[field] !== undefined) {
            if (!Array.isArray(profile[field])) {
                errors.push(`${field} must be an array`);
            } else {
                const arr = profile[field] as unknown[];
                if (arr.length > 50) {
                    errors.push(`${field} must have 50 items or less`);
                } else if (!arr.every(item => typeof item === 'string')) {
                    errors.push(`${field} must be an array of strings`);
                } else {
                    sanitized[field] = arr.map(s => escapeHtml(s as string)) as string[];
                }
            }
        }
    }
    
    return {
        valid: errors.length === 0,
        errors,
        sanitized: errors.length === 0 ? sanitized : undefined
    };
}

// ============================================================================
// Global Knowledge Index Schema Validation
// ============================================================================

/**
 * Global knowledge index entry schema
 */
export interface KnowledgeIndexEntry {
    id: string;
    title: string;
    category: string;
    tags: string[];
    source?: string;
    timestamp?: string;
}

/**
 * Validate global knowledge index JSON
 * 
 * @param data - The raw JSON data to validate
 * @returns Validation result
 */
export function validateKnowledgeIndex(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { valid: false, errors: ['Index must be a valid JSON object'] };
    }
    
    const index = data as Record<string, unknown>;
    
    // Check patterns array if present
    if (index.patterns !== undefined) {
        if (!Array.isArray(index.patterns)) {
            errors.push('patterns must be an array');
        } else {
            for (let i = 0; i < (index.patterns as unknown[]).length; i++) {
                const entry = (index.patterns as unknown[])[i];
                const entryErrors = validateIndexEntry(entry, `patterns[${i}]`);
                errors.push(...entryErrors);
            }
        }
    }
    
    // Check insights array if present
    if (index.insights !== undefined) {
        if (!Array.isArray(index.insights)) {
            errors.push('insights must be an array');
        } else {
            for (let i = 0; i < (index.insights as unknown[]).length; i++) {
                const entry = (index.insights as unknown[])[i];
                const entryErrors = validateIndexEntry(entry, `insights[${i}]`);
                errors.push(...entryErrors);
            }
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate a single index entry
 */
function validateIndexEntry(entry: unknown, path: string): string[] {
    const errors: string[] = [];
    
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        return [`${path} must be an object`];
    }
    
    const e = entry as Record<string, unknown>;
    
    if (typeof e.id !== 'string') {
        errors.push(`${path}.id must be a string`);
    }
    if (typeof e.title !== 'string') {
        errors.push(`${path}.title must be a string`);
    }
    if (e.category !== undefined && typeof e.category !== 'string') {
        errors.push(`${path}.category must be a string`);
    }
    if (e.tags !== undefined) {
        if (!Array.isArray(e.tags) || !e.tags.every(t => typeof t === 'string')) {
            errors.push(`${path}.tags must be an array of strings`);
        }
    }
    
    return errors;
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
        if (recovered.charCodeAt(0) === 0xFEFF) {
            recovered = recovered.slice(1);
        }
        
        // Remove trailing commas (common mistake)
        recovered = recovered.replace(/,\s*([\]}])/g, '$1');
        
        // Try to fix unquoted keys (simple cases)
        recovered = recovered.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
        
        try {
            const data = JSON.parse(recovered) as T;
            return { success: true, data, recovered: true };
        } catch {
            // Recovery failed
            return { 
                success: false, 
                error: firstError instanceof Error ? firstError.message : 'Invalid JSON'
            };
        }
    }
}

/**
 * Create a backup of a file before modifying it
 * 
 * @param filePath - Path to the file to backup
 * @param fs - fs-extra module
 * @returns Path to backup file or undefined if backup failed
 */
export async function createConfigBackup(
    filePath: string, 
    fs: typeof import('fs-extra')
): Promise<string | undefined> {
    try {
        const backupPath = `${filePath}.backup.${Date.now()}`;
        await fs.copy(filePath, backupPath);
        return backupPath;
    } catch {
        return undefined;
    }
}
