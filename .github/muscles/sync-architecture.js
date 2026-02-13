/**
 * Sync Architecture Script
 * 
 * Copies inheritable cognitive architecture files from Master Alex (root .github/)
 * to the VS Code extension heir (platforms/vscode-extension/.github/).
 * 
 * Respects inheritance rules:
 * - inheritable: Copy to heir
 * - universal: Copy to heir
 * - master-only: Skip (stays in master only)
 * - heir:vscode: Already in heir, don't overwrite
 * - heir:m365: Skip (wrong heir)
 * 
 * HEIR DECONTAMINATION:
 * After copying, applies heir-specific transformations to remove master-only
 * content (PII, master-specific slot values, skill counts, etc.).
 * See applyHeirTransformations() for details.
 * 
 * Run: npm run sync-architecture
 * Auto-runs: During vscode:prepublish
 */

const fs = require('fs');
const path = require('path');

// Paths relative to this script location (.github/muscles/)
const SCRIPT_DIR = __dirname;
const MASTER_ROOT = path.resolve(SCRIPT_DIR, '..', '..');  // From .github/muscles to project root
const HEIR_ROOT = path.join(MASTER_ROOT, 'platforms', 'vscode-extension');

const MASTER_GITHUB = path.join(MASTER_ROOT, '.github');
const HEIR_GITHUB = path.join(HEIR_ROOT, '.github');

const MASTER_SKILLS = path.join(MASTER_GITHUB, 'skills');
const HEIR_SKILLS = path.join(HEIR_GITHUB, 'skills');

// Folders to sync (non-skill architecture files)
const ARCHITECTURE_FOLDERS = ['instructions', 'prompts', 'config', 'agents', 'domain-knowledge', 'muscles'];

// Files to sync from root .github
const ARCHITECTURE_FILES = [
    'copilot-instructions.md',
    'README.md',
    'alex-cognitive-architecture.md',
    'ALEX-INTEGRATION.md',
    'ASSISTANT-COMPATIBILITY.md',
    'PROJECT-TYPE-TEMPLATES.md',
    'VALIDATION-SUITE.md',
];

// ============================================================
// HEIR PROTECTION: Files that must NEVER be copied to heir
// ============================================================

// Master-only config files — contain PII or master-specific state
const EXCLUDED_CONFIG_FILES = [
    'user-profile.json',           // PII: contains user's real name, email, social profiles
    'MASTER-ALEX-PROTECTED.json',  // Master kill-switch marker — must not exist in heir
    'cognitive-config.json',       // Master-specific cognitive state
];

// Get excluded muscles from inheritance.json (master-only scripts)
function getExcludedMuscles() {
    const inheritancePath = path.join(MASTER_GITHUB, 'muscles', 'inheritance.json');
    if (!fs.existsSync(inheritancePath)) {
        console.warn('  ⚠️ muscles/inheritance.json not found, using defaults');
        return ['sync-architecture.js', 'build-extension-package.ps1', 'audit-master-alex.ps1', 'inheritance.json'];
    }
    try {
        const inheritance = JSON.parse(fs.readFileSync(inheritancePath, 'utf8'));
        const excluded = ['inheritance.json']; // Always exclude the inheritance file itself
        for (const [muscle, config] of Object.entries(inheritance.muscles || {})) {
            if (config.inheritance === 'master-only') {
                excluded.push(muscle);
            }
        }
        return excluded;
    } catch (e) {
        console.warn(`  ⚠️ Could not read inheritance.json: ${e.message}`);
        return ['sync-architecture.js', 'build-extension-package.ps1', 'audit-master-alex.ps1', 'inheritance.json'];
    }
}

// Synapses in instruction files that reference master-only files
// Format: { file: 'filename.md', pattern: /regex/, reason: 'why' }
const HEIR_SYNAPSE_REMOVALS = [
    {
        file: 'release-management.instructions.md',
        pattern: /^.*\[ROADMAP-UNIFIED\.md\].*\r?\n/m,
        reason: 'ROADMAP-UNIFIED.md does not exist in heir'
    },
];

function getInheritance(skillPath) {
    const synapsePath = path.join(skillPath, 'synapses.json');
    if (!fs.existsSync(synapsePath)) {
        return 'inheritable'; // Default if no synapse file
    }
    try {
        const synapse = JSON.parse(fs.readFileSync(synapsePath, 'utf8'));
        return synapse.inheritance || 'inheritable';
    } catch (e) {
        console.warn(`  ⚠️ Could not read ${synapsePath}: ${e.message}`);
        return 'inheritable';
    }
}

function copyDirRecursive(src, dest, excludeFiles = []) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        // Skip excluded files
        if (excludeFiles.includes(entry.name)) {
            console.log(`   ⏭️  Excluded: ${entry.name}`);
            continue;
        }
        
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath, excludeFiles);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function syncSkills() {
    console.log('\n📦 Syncing skills from Master to Heir...\n');
    
    const stats = {
        copied: [],
        skippedMasterOnly: [],
        skippedHeirSpecific: [],
        skippedM365: []
    };
    
    // Get all master skills
    const masterSkillDirs = fs.readdirSync(MASTER_SKILLS, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
    
    for (const skillName of masterSkillDirs) {
        const masterSkillPath = path.join(MASTER_SKILLS, skillName);
        const heirSkillPath = path.join(HEIR_SKILLS, skillName);
        const inheritance = getInheritance(masterSkillPath);
        
        switch (inheritance) {
            case 'master-only':
                stats.skippedMasterOnly.push(skillName);
                break;
            case 'heir:m365':
                stats.skippedM365.push(skillName);
                break;
            case 'heir:vscode':
                // Heir-specific skills should already be in heir, don't overwrite
                stats.skippedHeirSpecific.push(skillName);
                break;
            case 'inheritable':
            case 'universal':
            default:
                // Copy to heir
                if (fs.existsSync(heirSkillPath)) {
                    fs.rmSync(heirSkillPath, { recursive: true });
                }
                copyDirRecursive(masterSkillPath, heirSkillPath);
                stats.copied.push(skillName);
                break;
        }
    }
    
    // Report
    console.log(`✅ Copied: ${stats.copied.length} skills`);
    if (stats.skippedMasterOnly.length > 0) {
        console.log(`⏭️  Skipped (master-only): ${stats.skippedMasterOnly.length}`);
        stats.skippedMasterOnly.forEach(s => console.log(`   - ${s}`));
    }
    if (stats.skippedM365.length > 0) {
        console.log(`⏭️  Skipped (heir:m365): ${stats.skippedM365.length}`);
        stats.skippedM365.forEach(s => console.log(`   - ${s}`));
    }
    if (stats.skippedHeirSpecific.length > 0) {
        console.log(`⏭️  Skipped (heir:vscode): ${stats.skippedHeirSpecific.length}`);
    }
    
    return stats;
}

function cleanBrokenSynapseReferences(skippedMasterOnly) {
    if (skippedMasterOnly.length === 0) return;
    console.log('\n🧹 Cleaning broken synapse references to master-only skills...\n');
    
    let cleanedCount = 0;
    const heirSkillDirs = fs.readdirSync(HEIR_SKILLS, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
    
    for (const skillName of heirSkillDirs) {
        const synapsePath = path.join(HEIR_SKILLS, skillName, 'synapses.json');
        if (!fs.existsSync(synapsePath)) continue;
        
        try {
            const synapse = JSON.parse(fs.readFileSync(synapsePath, 'utf8'));
            if (!synapse.connections || !Array.isArray(synapse.connections)) continue;
            
            const original = synapse.connections.length;
            synapse.connections = synapse.connections.filter(conn => {
                const target = conn.target || '';
                return !skippedMasterOnly.some(removed => target.includes(removed));
            });
            
            if (synapse.connections.length < original) {
                fs.writeFileSync(synapsePath, JSON.stringify(synapse, null, 2) + '\n', 'utf8');
                cleanedCount++;
                console.log(`   Cleaned: ${skillName} (removed ${original - synapse.connections.length} refs)`);
            }
        } catch (e) {
            console.warn(`   ⚠️ Could not clean ${synapsePath}: ${e.message}`);
        }
    }
    
    if (cleanedCount > 0) {
        console.log(`✅ Cleaned ${cleanedCount} synapse files`);
    } else {
        console.log('✅ No broken references found');
    }
}
    console.log('\n📁 Syncing architecture folders...\n');
    
    for (const folder of ARCHITECTURE_FOLDERS) {
        const masterPath = path.join(MASTER_GITHUB, folder);
        const heirPath = path.join(HEIR_GITHUB, folder);
        
        if (fs.existsSync(masterPath)) {
            if (fs.existsSync(heirPath)) {
                fs.rmSync(heirPath, { recursive: true });
            }
            
            // Apply file exclusions for specific folders
            let exclusions = [];
            if (folder === 'config') exclusions = EXCLUDED_CONFIG_FILES;
            if (folder === 'muscles') exclusions = getExcludedMuscles();
            copyDirRecursive(masterPath, heirPath, exclusions);
            
            const count = fs.readdirSync(masterPath).length;
            const excluded = exclusions.length;
            console.log(`✅ ${folder}/ (${count} items${excluded ? `, ${excluded} excluded` : ''})`);
        } else {
            console.log(`⚠️  ${folder}/ not found in master`);
        }
    }
}

function syncArchitectureFiles() {
    console.log('\n📄 Syncing architecture files...\n');
    
    for (const file of ARCHITECTURE_FILES) {
        const masterPath = path.join(MASTER_GITHUB, file);
        const heirPath = path.join(HEIR_GITHUB, file);
        
        if (fs.existsSync(masterPath)) {
            fs.copyFileSync(masterPath, heirPath);
            console.log(`✅ ${file}`);
        } else {
            console.log(`⚠️  ${file} not found in master`);
        }
    }
}

function verifyCounts() {
    console.log('\n🔍 Verifying sync...\n');
    
    const masterSkillCount = fs.readdirSync(MASTER_SKILLS, { withFileTypes: true })
        .filter(d => d.isDirectory()).length;
    const heirSkillCount = fs.readdirSync(HEIR_SKILLS, { withFileTypes: true })
        .filter(d => d.isDirectory()).length;
    
    console.log(`Master skills: ${masterSkillCount}`);
    console.log(`Heir skills:   ${heirSkillCount}`);
    
    // Count expected heir skills (inheritable + universal)
    let expectedHeirCount = 0;
    const masterSkillDirs = fs.readdirSync(MASTER_SKILLS, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
    
    for (const skillName of masterSkillDirs) {
        const inheritance = getInheritance(path.join(MASTER_SKILLS, skillName));
        if (inheritance === 'inheritable' || inheritance === 'universal') {
            expectedHeirCount++;
        }
    }
    
    console.log(`Expected heir: ${expectedHeirCount} (inheritable + universal)`);
    
    if (heirSkillCount >= expectedHeirCount) {
        console.log('\n✅ Skill sync verified!\n');
    } else {
        console.error(`\n❌ MISMATCH: Heir has ${heirSkillCount} but should have at least ${expectedHeirCount}`);
        process.exit(1);
    }
}

// ============================================================
// HEIR TRANSFORMATIONS: Master → Heir content adjustments
// ============================================================

function applyHeirTransformations() {
    console.log('\n🔧 Applying heir-specific transformations...\n');
    
    let transformCount = 0;
    
    // --- Transform copilot-instructions.md ---
    const copilotPath = path.join(HEIR_GITHUB, 'copilot-instructions.md');
    if (fs.existsSync(copilotPath)) {
        let content = fs.readFileSync(copilotPath, 'utf8');
        const original = content;
        
        // 1. Reset P5/P6/P7 working memory slots to available
        content = content.replace(
            /\| \*\*P5\*\* \| .+ \| Domain \| .+ \|/,
            '| **P5** | *(available)* | Domain | *(assigned based on project context)* |'
        );
        content = content.replace(
            /\| \*\*P6\*\* \| .+ \| Domain \| .+ \|/,
            '| **P6** | *(available)* | Domain | *(assigned based on project context)* |'
        );
        content = content.replace(
            /\| \*\*P7\*\* \| .+ \| Domain \| .+ \|/,
            '| **P7** | *(available)* | Domain | *(assigned based on project context)* |'
        );
        
        // 2. Remove "Master Alex default" line (handles both LF and CRLF)
        content = content.replace(/^- \*\*Master Alex default\*\*:.*\r?\n/m, '');
        
        // 3. Reset "Last Assessed" to generic
        content = content.replace(
            /\*\*Last Assessed\*\*:.+/,
            '**Last Assessed**: Not yet assessed for this project'
        );
        
        // 4. Fix skill counts (master has more skills than heir)
        //    Count actual heir skills to get the right number
        const heirSkillCount = fs.existsSync(HEIR_SKILLS)
            ? fs.readdirSync(HEIR_SKILLS, { withFileTypes: true }).filter(d => d.isDirectory()).length
            : 0;
        const masterSkillCount = fs.existsSync(MASTER_SKILLS)
            ? fs.readdirSync(MASTER_SKILLS, { withFileTypes: true }).filter(d => d.isDirectory()).length
            : 0;
        
        if (heirSkillCount > 0 && heirSkillCount !== masterSkillCount) {
            // Replace in Neuroanatomical Mapping table
            content = content.replace(
                new RegExp(`\\.github/skills/\`\\s*\\(${masterSkillCount} skills\\)`),
                `.github/skills/\` (${heirSkillCount} skills)`
            );
            // Replace in Memory Stores table  
            content = content.replace(
                new RegExp(`\\| ${masterSkillCount} skills \\|`),
                `| ${heirSkillCount} skills |`
            );
        }
        
        if (content !== original) {
            fs.writeFileSync(copilotPath, content, 'utf8');
            const diffs = [];
            if (content.includes('*(available)*')) diffs.push('P5-P7 slots');
            if (!content.includes('Master Alex default')) diffs.push('Master default line');
            if (content.includes('Not yet assessed')) diffs.push('Last Assessed');
            if (heirSkillCount !== masterSkillCount) diffs.push(`skill count ${masterSkillCount}→${heirSkillCount}`);
            console.log(`✅ copilot-instructions.md: ${diffs.join(', ')}`);
            transformCount += diffs.length;
        }
    }
    
    // --- Remove master-only synapses from instruction files ---
    for (const removal of HEIR_SYNAPSE_REMOVALS) {
        const filePath = path.join(HEIR_GITHUB, 'instructions', removal.file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            const newContent = content.replace(removal.pattern, '');
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`✅ ${removal.file}: removed synapse (${removal.reason})`);
                transformCount++;
            }
        }
    }
    
    // --- Delete any master-only files that leaked through ---
    const masterOnlyFiles = [
        path.join(HEIR_GITHUB, 'config', 'MASTER-ALEX-PROTECTED.json'),
        path.join(HEIR_GITHUB, 'config', 'cognitive-config.json'),
        path.join(HEIR_GITHUB, 'config', 'user-profile.json'),
    ];
    for (const filePath of masterOnlyFiles) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️  Deleted leaked file: ${path.basename(filePath)}`);
            transformCount++;
        }
    }
    
    console.log(`\n   Applied ${transformCount} transformation${transformCount !== 1 ? 's' : ''}`);
    return transformCount;
}

// ============================================================
// POST-SYNC VALIDATION: Catch contamination before it ships
// ============================================================

function validateHeirIntegrity() {
    console.log('\n🛡️  Validating heir integrity...\n');
    
    const errors = [];
    const warnings = [];
    
    // 1. Check for PII in user-profile.json
    const profilePath = path.join(HEIR_GITHUB, 'config', 'user-profile.json');
    if (fs.existsSync(profilePath)) {
        const content = fs.readFileSync(profilePath, 'utf8');
        // Check for non-empty name (indicates PII leak)
        try {
            const profile = JSON.parse(content);
            if (profile.name && profile.name.trim() !== '') {
                errors.push(`PII LEAK: user-profile.json contains name "${profile.name}"`);
            }
            if (profile.contact && profile.contact.email) {
                errors.push(`PII LEAK: user-profile.json contains email "${profile.contact.email}"`);
            }
        } catch (e) {
            warnings.push(`Could not parse user-profile.json: ${e.message}`);
        }
    }
    
    // 2. Check for master-only files
    const masterOnlyFiles = ['MASTER-ALEX-PROTECTED.json', 'cognitive-config.json'];
    for (const file of masterOnlyFiles) {
        const filePath = path.join(HEIR_GITHUB, 'config', file);
        if (fs.existsSync(filePath)) {
            errors.push(`Master-only file leaked: config/${file}`);
        }
    }
    
    // 3. Check copilot-instructions.md for master-specific content
    const copilotPath = path.join(HEIR_GITHUB, 'copilot-instructions.md');
    if (fs.existsSync(copilotPath)) {
        const content = fs.readFileSync(copilotPath, 'utf8');
        
        if (content.includes('Master Alex default')) {
            errors.push('copilot-instructions.md contains "Master Alex default" line');
        }
        
        // Check P5-P7 have master values (not transformed)
        if (/\| \*\*P5\*\* \| master-heir-management/.test(content)) {
            errors.push('copilot-instructions.md P5 slot has master value (not reset)');
        }
        
        // Check skill count matches actual heir skills
        const heirSkillCount = fs.existsSync(HEIR_SKILLS)
            ? fs.readdirSync(HEIR_SKILLS, { withFileTypes: true }).filter(d => d.isDirectory()).length
            : 0;
        const masterSkillCount = fs.existsSync(MASTER_SKILLS)
            ? fs.readdirSync(MASTER_SKILLS, { withFileTypes: true }).filter(d => d.isDirectory()).length
            : 0;
        
        if (heirSkillCount !== masterSkillCount) {
            const countRegex = new RegExp(`${masterSkillCount} skills`);
            if (countRegex.test(content)) {
                errors.push(`copilot-instructions.md still shows master skill count (${masterSkillCount}) instead of heir count (${heirSkillCount})`);
            }
        }
    }
    
    // 4. Check for ROADMAP-UNIFIED.md references in heir instructions
    const releaseMgmt = path.join(HEIR_GITHUB, 'instructions', 'release-management.instructions.md');
    if (fs.existsSync(releaseMgmt)) {
        const content = fs.readFileSync(releaseMgmt, 'utf8');
        if (content.includes('ROADMAP-UNIFIED.md')) {
            warnings.push('release-management.instructions.md references ROADMAP-UNIFIED.md (master-only file)');
        }
    }
    
    // Report
    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅ Heir integrity validated — no contamination detected\n');
        return true;
    }
    
    if (warnings.length > 0) {
        console.log(`⚠️  ${warnings.length} warning(s):`);
        warnings.forEach(w => console.log(`   ⚠️  ${w}`));
    }
    
    if (errors.length > 0) {
        console.log(`❌ ${errors.length} CONTAMINATION ERROR(S):`);
        errors.forEach(e => console.log(`   ❌ ${e}`));
        console.log('\n🚫 HEIR IS CONTAMINATED — Fix before publishing!\n');
        process.exit(1);
    }
    
    return warnings.length === 0;
}

// ============================================================
// LEGACY CLEANUP: Remove deprecated folders from heir
// ============================================================

function cleanupLegacyFolders() {
    // Folders that were replaced by muscles/ and should be removed from heir
    const legacyFolders = [
        'scripts',  // Replaced by muscles/ — brain-qa.ps1 moved there
    ];
    
    for (const folder of legacyFolders) {
        const legacyPath = path.join(HEIR_GITHUB, folder);
        if (fs.existsSync(legacyPath)) {
            fs.rmSync(legacyPath, { recursive: true });
            console.log(`🧹 Removed legacy folder: .github/${folder}/`);
        }
    }
}

// Main
console.log('═══════════════════════════════════════════');
console.log('  Alex Architecture Sync (Master → Heir)');
console.log('═══════════════════════════════════════════');

// Clean up legacy folders in heir
cleanupLegacyFolders();

syncArchitectureFolders();
syncArchitectureFiles();
const skillStats = syncSkills();
cleanBrokenSynapseReferences(skillStats.skippedMasterOnly);
applyHeirTransformations();
verifyCounts();
validateHeirIntegrity();

console.log('═══════════════════════════════════════════');
console.log('  Sync complete!');
console.log('═══════════════════════════════════════════\n');
