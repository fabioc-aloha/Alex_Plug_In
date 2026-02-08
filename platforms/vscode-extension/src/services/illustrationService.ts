/**
 * Alex Illustration Service
 * 
 * Fetches icons and illustrations from public APIs:
 * - Iconify: 150K+ icons from 100+ icon sets (mdi, heroicons, ph, tabler, etc.)
 * - DiceBear: Generative avatars (open-peeps, avataaars, bottts, etc.)
 * 
 * All APIs are free, no authentication required.
 * 
 * @module illustrationService
 */

import * as https from 'https';

// =============================================================================
// TYPES
// =============================================================================

export interface IconifyOptions {
    /** Color in hex format without # (e.g., '0550ae') */
    color?: string;
    /** Width in pixels */
    width?: number;
    /** Height in pixels */
    height?: number;
}

export interface DiceBearOptions {
    /** Background color in hex format without # */
    backgroundColor?: string;
    /** Size in pixels */
    size?: number;
}

// =============================================================================
// ICONIFY API (150K+ Icons)
// =============================================================================

/**
 * Popular Iconify icon set prefixes:
 * - mdi: Material Design Icons (7,447 icons)
 * - ph: Phosphor Icons (7,488 icons)
 * - heroicons: Heroicons (588 icons)
 * - tabler: Tabler Icons (4,824 icons)
 * - lucide: Lucide Icons (1,432 icons)
 * - carbon: IBM Carbon (2,126 icons)
 * - material-symbols: Google Material Symbols (15,111 icons)
 */
export const ICONIFY_PREFIXES = [
    'mdi',
    'ph',
    'heroicons',
    'tabler',
    'lucide',
    'carbon',
    'material-symbols',
    'ic',
    'fa6-solid',
    'fa6-regular',
    'feather'
] as const;

/**
 * Build Iconify URL for an icon
 * @param prefix Icon set prefix (e.g., 'mdi', 'heroicons')
 * @param name Icon name (e.g., 'chart-bar', 'users')
 * @param options Color and size options
 * @returns Full URL to SVG icon
 */
export function getIconifyUrl(prefix: string, name: string, options: IconifyOptions = {}): string {
    const params = new URLSearchParams();
    
    if (options.color) {
        // URL encode the # character
        params.set('color', `#${options.color}`);
    }
    if (options.width) {
        params.set('width', String(options.width));
    }
    if (options.height) {
        params.set('height', String(options.height));
    }
    
    const queryString = params.toString();
    return `https://api.iconify.design/${prefix}/${name}.svg${queryString ? '?' + queryString : ''}`;
}

/**
 * Fetch an icon from Iconify API
 * @param prefix Icon set prefix
 * @param name Icon name
 * @param options Color and size options
 * @returns SVG string or null if fetch fails
 */
export async function fetchIconifyIcon(
    prefix: string,
    name: string,
    options: IconifyOptions = {}
): Promise<string | null> {
    const url = getIconifyUrl(prefix, name, options);
    
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.warn(`Iconify fetch failed: ${res.statusCode} for ${prefix}/${name}`);
                resolve(null);
                return;
            }
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Validate it's actually SVG
                if (data.trim().startsWith('<svg')) {
                    resolve(data);
                } else {
                    console.warn(`Invalid SVG response for ${prefix}/${name}`);
                    resolve(null);
                }
            });
        }).on('error', (err) => {
            console.warn(`Iconify fetch error: ${err.message}`);
            resolve(null);
        });
    });
}

/**
 * Parse iconify syntax: prefix/name or prefix:name
 * @param value e.g., 'mdi/chart-bar' or 'heroicons:users'
 * @returns [prefix, name] or null if invalid
 */
export function parseIconifyValue(value: string): [string, string] | null {
    // Support both / and : as separators
    const match = value.match(/^([a-z0-9-]+)[\/:]([a-z0-9-]+)$/i);
    if (!match) return null;
    return [match[1].toLowerCase(), match[2].toLowerCase()];
}

// =============================================================================
// DICEBEAR API (Generative Avatars)
// =============================================================================

/**
 * DiceBear avatar styles:
 * - avataaars: Cartoon avatar style
 * - open-peeps: Hand-drawn people (Pablo Stanley)
 * - bottts: Robot illustrations
 * - notionists: Notion-style illustrations
 * - lorelei: Stylized portrait
 * - personas: Character style
 * - pixel-art: Pixelated avatars
 * - thumbs: Circle with thumbs up
 */
export const DICEBEAR_STYLES = [
    'avataaars',
    'open-peeps',
    'bottts',
    'notionists',
    'lorelei',
    'personas',
    'pixel-art',
    'thumbs',
    'big-ears',
    'big-smile',
    'identicon'
] as const;

export type DiceBearStyle = typeof DICEBEAR_STYLES[number];

/**
 * Build DiceBear URL for an avatar
 * @param seed Seed string (determines avatar appearance)
 * @param style Avatar style (default: open-peeps)
 * @param options Background color and size
 * @returns Full URL to SVG avatar
 */
export function getDiceBearUrl(
    seed: string,
    style: string = 'open-peeps',
    options: DiceBearOptions = {}
): string {
    const params = new URLSearchParams();
    params.set('seed', seed);
    
    if (options.backgroundColor) {
        params.set('backgroundColor', options.backgroundColor);
    }
    if (options.size) {
        params.set('size', String(options.size));
    }
    
    return `https://api.dicebear.com/7.x/${style}/svg?${params}`;
}

/**
 * Fetch an avatar from DiceBear API
 * @param seed Seed string
 * @param style Avatar style
 * @param options Background color and size
 * @returns SVG string or null if fetch fails
 */
export async function fetchDiceBearAvatar(
    seed: string,
    style: string = 'open-peeps',
    options: DiceBearOptions = {}
): Promise<string | null> {
    const url = getDiceBearUrl(seed, style, options);
    
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.warn(`DiceBear fetch failed: ${res.statusCode} for ${seed}`);
                resolve(null);
                return;
            }
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (data.trim().startsWith('<svg')) {
                    resolve(data);
                } else {
                    console.warn(`Invalid SVG response from DiceBear`);
                    resolve(null);
                }
            });
        }).on('error', (err) => {
            console.warn(`DiceBear fetch error: ${err.message}`);
            resolve(null);
        });
    });
}

/**
 * Parse avatar syntax: seed or seed#style
 * @param value e.g., 'John' or 'John#open-peeps'
 * @returns [seed, style] with default style if not specified
 */
export function parseAvatarValue(value: string): [string, string] {
    const parts = value.split('#');
    const seed = parts[0].trim();
    const style = parts[1]?.trim() || 'open-peeps';
    return [seed, style];
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Convert SVG string to base64 data URI
 */
export function svgToBase64DataUri(svg: string): string {
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Check if a URL is reachable (HEAD request)
 */
export async function isUrlReachable(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD' }, (res) => {
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(5000, () => {
            req.destroy();
            resolve(false);
        });
        req.end();
    });
}
