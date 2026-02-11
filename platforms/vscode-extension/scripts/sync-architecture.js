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
 * Run: npm run sync-architecture
 * Auto-runs: During vscode:prepublish
 */

const fs = require('fs');
const path = require('path');

// Paths relative to this script location
const SCRIPT_DIR = __dirname;
const HEIR_ROOT = path.resolve(SCRIPT_DIR, '..');
const MASTER_ROOT = path.resolve(HEIR_ROOT, '..', '..');

const MASTER_GITHUB = path.join(MASTER_ROOT, '.github');
const HEIR_GITHUB = path.join(HEIR_ROOT, '.github');

const MASTER_SKILLS = path.join(MASTER_GITHUB, 'skills');
const HEIR_SKILLS = path.join(HEIR_GITHUB, 'skills');

// Folders to sync (non-skill architecture files)
const ARCHITECTURE_FOLDERS = ['instructions', 'prompts', 'config', 'agents', 'domain-knowledge'];

// Files to sync from root .github
const ARCHITECTURE_FILES = ['copilot-instructions.md'];

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

function copyDirRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
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

function syncArchitectureFolders() {
    console.log('\n📁 Syncing architecture folders...\n');
    
    for (const folder of ARCHITECTURE_FOLDERS) {
        const masterPath = path.join(MASTER_GITHUB, folder);
        const heirPath = path.join(HEIR_GITHUB, folder);
        
        if (fs.existsSync(masterPath)) {
            if (fs.existsSync(heirPath)) {
                fs.rmSync(heirPath, { recursive: true });
            }
            copyDirRecursive(masterPath, heirPath);
            const count = fs.readdirSync(masterPath).length;
            console.log(`✅ ${folder}/ (${count} items)`);
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

// Main
console.log('═══════════════════════════════════════════');
console.log('  Alex Architecture Sync (Master → Heir)');
console.log('═══════════════════════════════════════════');

syncArchitectureFolders();
syncArchitectureFiles();
syncSkills();
verifyCounts();

console.log('═══════════════════════════════════════════');
console.log('  Sync complete!');
console.log('═══════════════════════════════════════════\n');
