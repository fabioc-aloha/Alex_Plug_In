/**
 * Alex Logo Service
 * 
 * Fetches company logos from:
 * 1. Local logos/ folder (PNG, JPG, SVG)
 * 2. Ticker symbol via Logo APIs (Brandfetch, Logo.dev)
 * 
 * @module logoService
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as https from 'https';

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
    logosFolder: 'logos',
    preferredSize: 128
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
    config: LogoServiceConfig = DEFAULT_CONFIG
): string | null {
    const logosDir = path.join(workspacePath, config.logosFolder);
    
    if (!fs.existsSync(logosDir)) {
        return null;
    }
    
    // Extensions to search (in order of preference)
    const extensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
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
 * List all logos in the local logos folder.
 */
export function listLocalLogos(workspacePath: string, config: LogoServiceConfig = DEFAULT_CONFIG): string[] {
    const logosDir = path.join(workspacePath, config.logosFolder);
    
    if (!fs.existsSync(logosDir)) {
        return [];
    }
    
    try {
        const files = fs.readdirSync(logosDir);
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
        return files
            .filter(f => imageExtensions.includes(path.extname(f).toLowerCase()))
            .map(f => path.basename(f, path.extname(f)));
    } catch (err) {
        return [];
    }
}

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
export function getTickerLogoUrl(ticker: string, config: LogoServiceConfig = DEFAULT_CONFIG): string | null {
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
 * Fetch logo image from API and convert to base64 for embedding.
 * Useful for offline presentation generation.
 * 
 * @param ticker Stock ticker symbol
 * @param config Service configuration
 * @returns Base64 data URI or null if failed
 */
export async function fetchTickerLogoAsBase64(
    ticker: string,
    config: LogoServiceConfig = DEFAULT_CONFIG
): Promise<string | null> {
    const url = getTickerLogoUrl(ticker, config);
    if (!url) {
        return null;
    }
    
    return new Promise((resolve) => {
        https.get(url, { timeout: 5000 }, (res) => {
            if (res.statusCode !== 200) {
                resolve(null);
                return;
            }
            
            const chunks: Buffer[] = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const contentType = res.headers['content-type'] || 'image/png';
                const base64 = buffer.toString('base64');
                resolve(`data:${contentType};base64,${base64}`);
            });
            res.on('error', () => resolve(null));
        }).on('error', () => resolve(null));
    });
}

// =============================================================================
// UNIFIED LOGO RESOLVER
// =============================================================================

export interface ResolvedLogo {
    type: 'file' | 'url' | 'base64';
    value: string;  // File path, URL, or base64 data URI
    source: 'local' | 'brandfetch' | 'logodev';
}

/**
 * Resolve a logo by name or ticker.
 * Priority: local file > API lookup
 * 
 * @param identifier Logo name (for local) or ticker symbol (for API)
 * @param workspacePath Workspace root path
 * @param config Service configuration
 * @param preferLocal If true, only check local folder (default: false)
 * @returns Resolved logo info or null
 */
export async function resolveLogo(
    identifier: string,
    workspacePath: string,
    config: LogoServiceConfig = DEFAULT_CONFIG,
    preferLocal: boolean = false
): Promise<ResolvedLogo | null> {
    // 1. Try local folder first
    const localPath = findLocalLogo(identifier, workspacePath, config);
    if (localPath) {
        return {
            type: 'file',
            value: localPath,
            source: 'local'
        };
    }
    
    // 2. If preferLocal, stop here
    if (preferLocal) {
        return null;
    }
    
    // 3. Try ticker lookup via API
    if (config.brandfetchClientId) {
        const url = getTickerLogoUrl(identifier, config);
        if (url) {
            return {
                type: 'url',
                value: url,
                source: 'brandfetch'
            };
        }
    } else if (config.logoDevToken) {
        const url = getTickerLogoUrl(identifier, config);
        if (url) {
            return {
                type: 'url',
                value: url,
                source: 'logodev'
            };
        }
    }
    
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
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp'
    };
    
    const mimeType = mimeTypes[ext] || 'image/png';
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    
    return `data:${mimeType};base64,${base64}`;
}

// =============================================================================
// COMMON TICKER → DOMAIN MAPPINGS
// =============================================================================

/**
 * Well-known ticker → domain mappings for logo lookup fallback.
 * Used when API doesn't support direct ticker search.
 */
export const TICKER_DOMAINS: Record<string, string> = {
    // Tech Giants
    'AAPL': 'apple.com',
    'MSFT': 'microsoft.com',
    'GOOGL': 'google.com',
    'GOOG': 'google.com',
    'AMZN': 'amazon.com',
    'META': 'meta.com',
    'NVDA': 'nvidia.com',
    'TSLA': 'tesla.com',
    'AMD': 'amd.com',
    'INTC': 'intel.com',
    'IBM': 'ibm.com',
    'ORCL': 'oracle.com',
    'CRM': 'salesforce.com',
    'ADBE': 'adobe.com',
    'CSCO': 'cisco.com',
    'NFLX': 'netflix.com',
    'PYPL': 'paypal.com',
    'SQ': 'squareup.com',
    'SHOP': 'shopify.com',
    'SPOT': 'spotify.com',
    'UBER': 'uber.com',
    'LYFT': 'lyft.com',
    'ABNB': 'airbnb.com',
    'SNAP': 'snap.com',
    'PINS': 'pinterest.com',
    'TWTR': 'twitter.com',
    'X': 'x.com',
    
    // Finance
    'JPM': 'jpmorgan.com',
    'BAC': 'bankofamerica.com',
    'WFC': 'wellsfargo.com',
    'GS': 'goldmansachs.com',
    'MS': 'morganstanley.com',
    'V': 'visa.com',
    'MA': 'mastercard.com',
    'AXP': 'americanexpress.com',
    
    // Enterprise
    'SAP': 'sap.com',
    'WDAY': 'workday.com',
    'NOW': 'servicenow.com',
    'ZM': 'zoom.us',
    'TEAM': 'atlassian.com',
    'DDOG': 'datadoghq.com',
    'SNOW': 'snowflake.com',
    'PLTR': 'palantir.com',
    
    // Retail
    'WMT': 'walmart.com',
    'TGT': 'target.com',
    'COST': 'costco.com',
    'HD': 'homedepot.com',
    'LOW': 'lowes.com',
    'NKE': 'nike.com',
    'SBUX': 'starbucks.com',
    'MCD': 'mcdonalds.com',
    
    // Telecom/Media
    'DIS': 'disney.com',
    'CMCSA': 'comcast.com',
    'T': 'att.com',
    'VZ': 'verizon.com',
    'TMUS': 't-mobile.com',
};

/**
 * Get domain for a ticker symbol (for domain-based logo APIs).
 */
export function getTickerDomain(ticker: string): string | null {
    return TICKER_DOMAINS[ticker.toUpperCase()] || null;
}
