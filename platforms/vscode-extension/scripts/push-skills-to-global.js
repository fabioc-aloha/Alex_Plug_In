/**
 * Push Skills to Global Knowledge
 * 
 * When changes are skill-only (no code changes), this script:
 * 1. Reads all inheritable skills from Master Alex
 * 2. Updates the Global Knowledge skill-registry.json
 * 3. Commits and pushes to GK repo
 * 
 * Heirs can then pull new skills without a full extension update.
 * 
 * Run: npm run push-skills-to-global
 * 
 * This is an ALTERNATIVE to full publishing when only skills change.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const SCRIPT_DIR = __dirname;
const HEIR_ROOT = path.resolve(SCRIPT_DIR, '..');
const MASTER_ROOT = path.resolve(HEIR_ROOT, '..', '..');
const MASTER_SKILLS = path.join(MASTER_ROOT, '.github', 'skills');

// Global Knowledge paths
const GK_CANDIDATES = [
    path.join(os.homedir(), '.alex', 'global-knowledge'),
    path.resolve(MASTER_ROOT, '..', 'Alex-Global-Knowledge')
];
const GK_ROOT = GK_CANDIDATES.find(candidate => fs.existsSync(candidate)) || GK_CANDIDATES[0];
const GK_SKILLS_DIR = path.join(GK_ROOT, 'skills');
const GK_REGISTRY = path.join(GK_SKILLS_DIR, 'skill-registry.json');

function getSkillMetadata(skillPath, skillName) {
    const synapsePath = path.join(skillPath, 'synapses.json');
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    
    let synapses = {};
    if (fs.existsSync(synapsePath)) {
        try {
            synapses = JSON.parse(fs.readFileSync(synapsePath, 'utf8'));
        } catch (e) {
            console.warn(`  [!] Could not parse ${synapsePath}`);
        }
    }
    
    // Extract description from SKILL.md header if available
    let description = synapses.description || '';
    if (!description && fs.existsSync(skillMdPath)) {
        const content = fs.readFileSync(skillMdPath, 'utf8');
        const descMatch = content.match(/^#[^\n]+\n+([^\n]+)/);
        if (descMatch) {
            description = descMatch[1].replace(/\*\*/g, '').trim();
        }
    }
    
    return {
        id: skillName,
        name: synapses.name || skillName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        version: synapses.version || '1.0.0',
        inheritance: synapses.inheritance || 'inheritable',
        category: synapses.category || 'general',
        description: description,
        folder: skillName,
        projectSignals: synapses.projectSignals || ['*'],
        priority: synapses.priority || 'standard',
        tags: synapses.tags || []
    };
}

function loadExistingRegistry() {
    if (fs.existsSync(GK_REGISTRY)) {
        try {
            return JSON.parse(fs.readFileSync(GK_REGISTRY, 'utf8'));
        } catch (e) {
            console.error(`[X] Could not parse existing registry: ${e.message}`);
            process.exit(1);
        }
    }
    
    // Create new registry structure
    return {
        "$schema": "./skill-registry-schema.json",
        "version": "1.0.0",
        "lastUpdated": new Date().toISOString(),
        "description": "Registry of skills available for heir pull-sync.",
        "skills": [],
        "wishlist": { "description": "Skills in development", "items": [] }
    };
}

function main() {
    console.log('===========================================');
    console.log('  Push Skills to Global Knowledge');
    console.log('===========================================\n');
    
    // Verify GK repo exists
    if (!fs.existsSync(GK_ROOT)) {
        console.error(`[X] Global Knowledge repo not found at: ${GK_ROOT}`);
        console.error(`   Expected one of:`);
        GK_CANDIDATES.forEach(candidate => console.error(`   - ${candidate}`));
        console.error('   Clone it locally or run Alex: Initialize to create the home-directory repo.');
        process.exit(1);
    }

    console.log(`[PIN] Using Global Knowledge repo: ${GK_ROOT}\n`);
    
    // Ensure skills directory exists in GK
    if (!fs.existsSync(GK_SKILLS_DIR)) {
        fs.mkdirSync(GK_SKILLS_DIR, { recursive: true });
    }
    
    // Load existing registry
    const registry = loadExistingRegistry();
    const existingSkillIds = new Set(registry.skills.map(s => s.id));
    
    // Scan master skills
    console.log('[PKG] Scanning Master Alex skills...\n');
    
    const masterSkillDirs = fs.readdirSync(MASTER_SKILLS, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
    
    const stats = {
        added: [],
        updated: [],
        skipped: []
    };
    
    const newSkills = [];
    
    for (const skillName of masterSkillDirs) {
        const skillPath = path.join(MASTER_SKILLS, skillName);
        const metadata = getSkillMetadata(skillPath, skillName);
        
        // Only include inheritable/universal skills
        if (metadata.inheritance === 'master-only' || 
            metadata.inheritance === 'heir:m365' ||
            metadata.inheritance === 'heir:vscode') {
            stats.skipped.push({ name: skillName, reason: metadata.inheritance });
            continue;
        }
        
        // Add date if new
        if (!existingSkillIds.has(skillName)) {
            metadata.addedDate = new Date().toISOString().split('T')[0];
            stats.added.push(skillName);
        } else {
            // Check if version changed
            const existing = registry.skills.find(s => s.id === skillName);
            if (existing && existing.version !== metadata.version) {
                metadata.addedDate = existing.addedDate; // Keep original date
                stats.updated.push(skillName);
            } else {
                metadata.addedDate = existing?.addedDate || new Date().toISOString().split('T')[0];
            }
        }
        
        newSkills.push(metadata);
    }
    
    // Update registry
    registry.skills = newSkills;
    registry.lastUpdated = new Date().toISOString();
    
    // Write registry
    fs.writeFileSync(GK_REGISTRY, JSON.stringify(registry, null, 4) + '\n');
    
    // Report
    console.log(`[OK] Registry updated with ${newSkills.length} skills\n`);
    
    if (stats.added.length > 0) {
        console.log(`[NEW] Added: ${stats.added.length}`);
        stats.added.forEach(s => console.log(`   + ${s}`));
    }
    
    if (stats.updated.length > 0) {
        console.log(`[NOTE] Updated: ${stats.updated.length}`);
        stats.updated.forEach(s => console.log(`   ~ ${s}`));
    }
    
    if (stats.skipped.length > 0) {
        console.log(`[>>]  Skipped: ${stats.skipped.length}`);
        stats.skipped.forEach(s => console.log(`   - ${s.name} (${s.reason})`));
    }
    
    // Git operations
    console.log('\n[OUT] Pushing to Global Knowledge...\n');
    
    try {
        process.chdir(GK_ROOT);
        
        // Stage and commit
        execSync('git add skills/skill-registry.json', { stdio: 'pipe' });
        
        const commitMsg = stats.added.length > 0 
            ? `skills: add ${stats.added.join(', ')}`
            : `skills: update registry (${newSkills.length} skills)`;
        
        try {
            execSync(`git commit -m "${commitMsg}"`, { stdio: 'pipe' });
            console.log(`[OK] Committed: ${commitMsg}`);
            
            // Push
            execSync('git push', { stdio: 'pipe' });
            console.log('[OK] Pushed to origin\n');
        } catch (e) {
            if (e.message.includes('nothing to commit')) {
                console.log('[i]  No changes to commit (registry already up to date)\n');
            } else {
                throw e;
            }
        }
    } catch (e) {
        console.error(`[!] Git operation failed: ${e.message}`);
        console.log('   You may need to commit/push manually.\n');
    }
    
    // Final message
    console.log('===========================================');
    console.log('  Next Steps');
    console.log('===========================================\n');
    
    if (stats.added.length > 0 || stats.updated.length > 0) {
        console.log('[!] Tell heirs to sync new skills:');
        console.log('   /knowledge sync-skills\n');
        console.log('Or heirs can run:');
        console.log('   Alex: Sync Skills from Global Knowledge\n');
    } else {
        console.log('[i]  No new skills to announce.\n');
    }
    
    console.log('===========================================\n');
}

main();
