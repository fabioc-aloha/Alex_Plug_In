/**
 * Alex Logo Service
 *
 * Fetches company logos from:
 * 1. Local logos/ folder (PNG, JPG, SVG)
 * 2. Ticker symbol via Logo APIs (Brandfetch, Logo.dev)
 *
 * @module logoService
 */

import * as fs from "fs-extra";
import * as path from "path";
import * as https from "https";

// =============================================================================
// CONFIGURATION
// =============================================================================

export interface LogoServiceConfig {
  /** Path to local logos folder (relative to workspace) */
  logosFolder: string;
  /** Brandfetch client ID (free registration at brandfetch.com) */
  brandfetchClientId?: string;
  /** Logo.dev API token (free at logo.dev) */
  logoDevToken?: string;
  /** Preferred size for API logos (default: 128) */
  preferredSize?: number;
  /** Cache directory for downloaded logos */
  cacheDir?: string;
}

const DEFAULT_CONFIG: LogoServiceConfig = {
  logosFolder: "logos",
  preferredSize: 128,
};

// =============================================================================
// LOCAL LOGO LOOKUP
// =============================================================================

/**
 * Find a logo file in the local logos folder.
 * Searches for: name.png, name.jpg, name.jpeg, name.svg (case-insensitive)
 *
 * @param name Logo name without extension (e.g., 'apple', 'microsoft')
 * @param workspacePath Workspace root path
 * @param config Service configuration
 * @returns Full path to logo file, or null if not found
 */
export function findLocalLogo(
  name: string,
  workspacePath: string,
  config: LogoServiceConfig = DEFAULT_CONFIG,
): string | null {
  const logosDir = path.join(workspacePath, config.logosFolder);

  if (!fs.existsSync(logosDir)) {
    return null;
  }

  // Extensions to search (in order of preference)
  const extensions = [".png", ".jpg", ".jpeg", ".svg", ".webp"];
  const nameLower = name.toLowerCase();

  // Try exact match first
  for (const ext of extensions) {
    const filePath = path.join(logosDir, `${name}${ext}`);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  // Try case-insensitive match
  try {
    const files = fs.readdirSync(logosDir);
    for (const file of files) {
      const fileBase = path.basename(file, path.extname(file)).toLowerCase();
      if (fileBase === nameLower) {
        return path.join(logosDir, file);
      }
    }
  } catch (err) {
    console.warn(`Error reading logos directory: ${err}`);
  }

  return null;
}

/**
// =============================================================================
// TICKER-BASED LOGO API
// =============================================================================

/**
 * Get logo URL for a stock ticker symbol.
 * Uses Brandfetch (primary) or Logo.dev (fallback) APIs.
 * 
 * @param ticker Stock ticker symbol (e.g., 'AAPL', 'MSFT', 'GOOGL')
 * @param config Service configuration with API keys
 * @returns Logo URL or null if not configured/available
 */
export function getTickerLogoUrl(
  ticker: string,
  config: LogoServiceConfig = DEFAULT_CONFIG,
): string | null {
  const tickerUpper = ticker.toUpperCase();
  const size = config.preferredSize || 128;

  // Primary: Brandfetch (free, no attribution required)
  if (config.brandfetchClientId) {
    return `https://cdn.brandfetch.io/ticker/${tickerUpper}/icon/square?c=${config.brandfetchClientId}`;
  }

  // Fallback: Logo.dev (free 500K/mo, attribution required)
  if (config.logoDevToken) {
    // Logo.dev uses domain lookup, so we need ticker → domain mapping
    // They also support direct ticker lookup
    return `https://img.logo.dev/${tickerUpper}?token=${config.logoDevToken}&format=png&size=${size}`;
  }

  // No API configured - return null
  return null;
}

/**
 * Convert a local image file to base64 data URI.
 */
export function fileToBase64DataUri(filePath: string): string | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };

  const mimeType = mimeTypes[ext] || "image/png";
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString("base64");

  return `data:${mimeType};base64,${base64}`;
}
