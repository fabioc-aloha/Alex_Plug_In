/**
 * Premium Assets Service
 * 
 * Provides dynamic asset selection based on enabled premium features.
 * Banners and logos switch automatically to highlight active capabilities.
 */

import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Premium feature flags that determine which assets to display
 */
export interface PremiumFeatureFlags {
    globalKnowledge: boolean;
    cloudSync: boolean;
    crossProjectMemory: boolean;
    missionControl: boolean;
}

/**
 * Asset selection result
 */
export interface PremiumAssetSelection {
    logoPath: string;           // Relative path from assets/
    bannerPath: string;         // Relative path from assets/
    bannerAlt: string;          // Alt text for banner
    featureHighlight: string;   // Current feature being highlighted
}

/**
 * Banner rotation config
 */
interface BannerConfig {
    path: string;
    alt: string;
    feature: string;
    requiredFlag: keyof PremiumFeatureFlags;
}

/**
 * Available premium banners with their requirements
 */
const PREMIUM_BANNERS: BannerConfig[] = [
    {
        path: 'premium/banner-premium-global-knowledge.svg',
        alt: 'Your KNOWLEDGE Across All Projects',
        feature: 'Global Knowledge',
        requiredFlag: 'globalKnowledge'
    },
    {
        path: 'premium/banner-premium-cloud-sync.svg',
        alt: 'Your knowledge follows you everywhere',
        feature: 'Cloud Sync',
        requiredFlag: 'cloudSync'
    },
    {
        path: 'premium/banner-premium-cross-project-memory.svg',
        alt: 'Insights that travel between projects',
        feature: 'Cross-Project Memory',
        requiredFlag: 'crossProjectMemory'
    },
    {
        path: 'premium/banner-premium-mission-control.svg',
        alt: 'Your mission control for cross-project wisdom',
        feature: 'Mission Control',
        requiredFlag: 'missionControl'
    }
];

/**
 * Default (non-premium) assets
 */
const DEFAULT_ASSETS: PremiumAssetSelection = {
    logoPath: 'logo.svg',
    bannerPath: 'banner.svg',
    bannerAlt: 'Strap a rocket to your back',
    featureHighlight: 'none'
};

/**
 * Premium logo for Global Knowledge enabled
 */
const GK_LOGO_PATH = 'premium/gk-premium-minimal-logo.svg';

/**
 * Session-based rotation index for variety
 */
let rotationIndex = 0;

/**
 * Get premium asset selection based on enabled features
 * 
 * @param flags - Current premium feature flags
 * @param rotate - If true, rotates through available premium banners
 * @returns Asset selection for current context
 */
export function getPremiumAssets(
    flags: PremiumFeatureFlags,
    rotate: boolean = false
): PremiumAssetSelection {
    // Get all enabled banners
    const enabledBanners = PREMIUM_BANNERS.filter(b => flags[b.requiredFlag]);
    
    if (enabledBanners.length === 0) {
        // No premium features - use defaults
        return DEFAULT_ASSETS;
    }
    
    // Select banner (rotate or use first enabled)
    let selectedBanner: BannerConfig;
    if (rotate && enabledBanners.length > 1) {
        selectedBanner = enabledBanners[rotationIndex % enabledBanners.length];
        rotationIndex++;
    } else {
        // Priority: Global Knowledge > Cloud Sync > Cross-Project > Mission Control
        selectedBanner = enabledBanners[0];
    }
    
    // Use premium logo if Global Knowledge is enabled
    const logoPath = flags.globalKnowledge ? GK_LOGO_PATH : DEFAULT_ASSETS.logoPath;
    
    return {
        logoPath,
        bannerPath: selectedBanner.path,
        bannerAlt: selectedBanner.alt,
        featureHighlight: selectedBanner.feature
    };
}

/**
 * Get asset URI for webview
 */
export function getAssetUri(
    webview: vscode.Webview,
    extensionUri: vscode.Uri,
    assetPath: string
): vscode.Uri {
    return webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, 'assets', ...assetPath.split('/'))
    );
}

/**
 * Detect current premium feature flags from workspace context
 */
export async function detectPremiumFeatures(): Promise<PremiumFeatureFlags> {
    const config = vscode.workspace.getConfiguration('alex');
    
    // Check if Global Knowledge repo is configured
    const gkRepoPath = config.get<string>('globalKnowledge.repoPath');
    const hasGlobalKnowledge = !!gkRepoPath && gkRepoPath.length > 0;
    
    // Check cloud sync status
    const cloudSyncEnabled = config.get<boolean>('globalKnowledge.cloudSync.enabled', false);
    
    // Cross-project memory is enabled when GK exists
    const crossProjectMemory = hasGlobalKnowledge;
    
    // Mission control is enabled when GK + workspace has .github/
    let missionControl = false;
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (hasGlobalKnowledge && workspaceFolders) {
        const fs = await import('fs-extra');
        const githubPath = path.join(workspaceFolders[0].uri.fsPath, '.github');
        missionControl = await fs.pathExists(githubPath);
    }
    
    return {
        globalKnowledge: hasGlobalKnowledge,
        cloudSync: cloudSyncEnabled,
        crossProjectMemory,
        missionControl
    };
}

/**
 * Get inline SVG content for embedding in webview
 * Useful for animated banners or when URI loading is problematic
 */
export async function getInlineSvg(
    extensionUri: vscode.Uri,
    assetPath: string
): Promise<string | null> {
    try {
        const fs = await import('fs-extra');
        const fullPath = path.join(extensionUri.fsPath, 'assets', ...assetPath.split('/'));
        if (await fs.pathExists(fullPath)) {
            return await fs.readFile(fullPath, 'utf-8');
        }
    } catch {
        // Ignore errors, return null
    }
    return null;
}

/**
 * Reset rotation index (call on extension activation or new session)
 */
export function resetRotation(): void {
    rotationIndex = 0;
}

/**
 * Get all available premium banner options (for UI selection)
 */
export function getAvailablePremiumBanners(): Array<{
    id: string;
    name: string;
    path: string;
    requiredFeature: string;
}> {
    return PREMIUM_BANNERS.map(b => ({
        id: b.requiredFlag,
        name: b.feature,
        path: b.path,
        requiredFeature: b.requiredFlag
    }));
}
