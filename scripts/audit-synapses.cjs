/**
 * Synapse Semantic Audit Script
 * Validates all synapses.json files for schema compliance, broken targets,
 * and semantic correctness.
 * 
 * Usage: node scripts/audit-synapses.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const skillsDir = path.join(ROOT, '.github', 'skills');
const instrDir = path.join(ROOT, '.github', 'instructions');
const promptDir = path.join(ROOT, '.github', 'prompts');

const dirs = fs.readdirSync(skillsDir).filter(d => 
    fs.statSync(path.join(skillsDir, d)).isDirectory()
);

const allSkillDirs = new Set(dirs);
const allInstructions = fs.existsSync(instrDir) 
    ? new Set(fs.readdirSync(instrDir).filter(f => f.endsWith('.instructions.md')))
    : new Set();
const allPrompts = fs.existsSync(promptDir)
    ? new Set(fs.readdirSync(promptDir).filter(f => f.endsWith('.prompt.md')))
    : new Set();

const issues = [];
const warnings = [];
const stats = {
    total: 0, valid: 0, parseErrors: 0,
    missingSchema: 0, missingSkillId: 0, wrongSkillId: 0,
    missingConnections: 0, emptyConnections: 0,
    brokenTargets: 0, stringStrengths: 0,
    missingWhen: 0, missingYields: 0, missingType: 0,
    totalConnections: 0, noActivationContexts: 0,
    selfReferences: 0, duplicateTargets: 0,
    invalidStrengthRange: 0, missingTarget: 0,
    orphanedSynapses: 0, asymmetricLinks: 0
};

// Track all connections for asymmetry detection
const connectionGraph = new Map(); // skillId -> Set of target skillIds

for (const dir of dirs) {
    const synPath = path.join(skillsDir, dir, 'synapses.json');
    if (!fs.existsSync(synPath)) continue;
    stats.total++;

    let data;
    try {
        data = JSON.parse(fs.readFileSync(synPath, 'utf8'));
    } catch (e) {
        stats.parseErrors++;
        issues.push(`${dir}: PARSE ERROR: ${e.message}`);
        continue;
    }
    stats.valid++;

    // 1. Schema reference
    if (!data['$schema']) {
        stats.missingSchema++;
        issues.push(`${dir}: missing $schema`);
    }

    // 2. SkillId
    if (!data.skillId) {
        stats.missingSkillId++;
        issues.push(`${dir}: missing skillId`);
    } else if (data.skillId !== dir) {
        stats.wrongSkillId++;
        issues.push(`${dir}: skillId="${data.skillId}" !== dir="${dir}"`);
    }

    // 3. Connections
    if (!data.connections || !Array.isArray(data.connections)) {
        stats.missingConnections++;
        issues.push(`${dir}: no connections array (got: ${typeof data.connections})`);
        continue;
    }
    if (data.connections.length === 0) {
        stats.emptyConnections++;
        warnings.push(`${dir}: empty connections array`);
        continue;
    }

    const targetsSeen = new Set();
    const targetSkills = new Set();

    for (const conn of data.connections) {
        stats.totalConnections++;

        // 3a. Target exists
        if (!conn.target) {
            stats.missingTarget++;
            issues.push(`${dir}: connection missing target field`);
            continue;
        }

        const targetPath = conn.target.replace(/^\.\//, '');

        // Check for self-reference
        if (targetPath === `.github/skills/${dir}/SKILL.md` || 
            targetPath === `.github/skills/${dir}`) {
            stats.selfReferences++;
            issues.push(`${dir}: self-referencing connection -> ${conn.target}`);
        }

        // Check for duplicate targets
        if (targetsSeen.has(targetPath)) {
            stats.duplicateTargets++;
            issues.push(`${dir}: duplicate target -> ${conn.target}`);
        }
        targetsSeen.add(targetPath);

        // Validate target exists on disk
        if (targetPath.startsWith('.github/skills/')) {
            const parts = targetPath.split('/');
            const targetSkill = parts[2];
            targetSkills.add(targetSkill);
            if (!allSkillDirs.has(targetSkill)) {
                stats.brokenTargets++;
                issues.push(`${dir}: broken skill target -> ${conn.target}`);
            }
        } else if (targetPath.startsWith('.github/instructions/')) {
            const instrFile = path.basename(targetPath);
            if (!allInstructions.has(instrFile)) {
                const fullPath = path.join(ROOT, targetPath);
                if (!fs.existsSync(fullPath)) {
                    stats.brokenTargets++;
                    issues.push(`${dir}: broken instruction target -> ${conn.target}`);
                }
            }
        } else if (targetPath.startsWith('.github/prompts/')) {
            const promptFile = path.basename(targetPath);
            if (!allPrompts.has(promptFile)) {
                const fullPath = path.join(ROOT, targetPath);
                if (!fs.existsSync(fullPath)) {
                    stats.brokenTargets++;
                    issues.push(`${dir}: broken prompt target -> ${conn.target}`);
                }
            }
        } else {
            // Generic path check
            const fullPath = path.join(ROOT, targetPath);
            if (!fs.existsSync(fullPath)) {
                stats.brokenTargets++;
                issues.push(`${dir}: broken target -> ${conn.target}`);
            }
        }

        // 3b. Strength validation
        if (typeof conn.strength === 'string') {
            stats.stringStrengths++;
            issues.push(`${dir}: string strength "${conn.strength}" -> ${conn.target} (should be numeric)`);
        } else if (typeof conn.strength === 'number') {
            if (conn.strength < 0 || conn.strength > 1) {
                stats.invalidStrengthRange++;
                issues.push(`${dir}: strength ${conn.strength} out of range [0,1] -> ${conn.target}`);
            }
        }

        // 3c. Required fields
        if (!conn.when) stats.missingWhen++;
        if (!conn.yields) stats.missingYields++;
        if (!conn.type) stats.missingType++;
    }

    // Store for graph analysis
    connectionGraph.set(dir, targetSkills);

    // 4. Activation contexts
    if (!data.activationContexts || data.activationContexts.length === 0) {
        stats.noActivationContexts++;
    }
}

// 5. Asymmetric link detection (A->B but B does not ->A for bidirectional connections)
// Only check skill-to-skill connections
let asymmetricCount = 0;
const asymmetricPairs = [];
for (const [source, targets] of connectionGraph) {
    for (const target of targets) {
        const reverseTargets = connectionGraph.get(target);
        if (reverseTargets && !reverseTargets.has(source)) {
            // Check if the connection claims to be bidirectional
            const synPath = path.join(skillsDir, source, 'synapses.json');
            const data = JSON.parse(fs.readFileSync(synPath, 'utf8'));
            for (const conn of data.connections || []) {
                const tp = conn.target.replace(/^\.\//, '');
                if (tp.includes(target) && conn.bidirectional) {
                    asymmetricCount++;
                    asymmetricPairs.push(`${source} <-> ${target} (bidirectional claimed but ${target} doesn't link back)`);
                }
            }
        }
    }
}
stats.asymmetricLinks = asymmetricCount;

// 6. Skills without synapses.json
const skillsWithoutSynapses = dirs.filter(d => !fs.existsSync(path.join(skillsDir, d, 'synapses.json')));

console.log('=== SYNAPSE SEMANTIC AUDIT ===');
console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
console.log('');
console.log('--- Summary ---');
console.log(`Total synapses.json files: ${stats.total}`);
console.log(`Valid JSON: ${stats.valid}`);
console.log(`Parse errors: ${stats.parseErrors}`);
console.log(`Total connections: ${stats.totalConnections}`);
console.log(`Skills without synapses.json: ${skillsWithoutSynapses.length}`);
console.log('');
console.log('--- Schema Compliance ---');
console.log(`Missing $schema: ${stats.missingSchema}`);
console.log(`Missing skillId: ${stats.missingSkillId}`);
console.log(`Wrong skillId (!=dir): ${stats.wrongSkillId}`);
console.log(`Missing connections array: ${stats.missingConnections}`);
console.log(`Empty connections: ${stats.emptyConnections}`);
console.log(`No activationContexts: ${stats.noActivationContexts}`);
console.log('');
console.log('--- Connection Issues ---');
console.log(`Broken targets: ${stats.brokenTargets}`);
console.log(`Missing target field: ${stats.missingTarget}`);
console.log(`Self-references: ${stats.selfReferences}`);
console.log(`Duplicate targets: ${stats.duplicateTargets}`);
console.log(`String strengths (not numeric): ${stats.stringStrengths}`);
console.log(`Invalid strength range: ${stats.invalidStrengthRange}`);
console.log(`Missing 'when': ${stats.missingWhen}`);
console.log(`Missing 'yields': ${stats.missingYields}`);
console.log(`Missing 'type': ${stats.missingType}`);
console.log('');
console.log('--- Graph Analysis ---');
console.log(`Asymmetric bidirectional claims: ${stats.asymmetricLinks}`);
console.log('');

if (issues.length > 0) {
    console.log(`=== ISSUES (${issues.length}) ===`);
    issues.forEach(i => console.log(`  BUG: ${i}`));
    console.log('');
}

if (asymmetricPairs.length > 0) {
    console.log(`=== ASYMMETRIC BIDIRECTIONAL CLAIMS (${asymmetricPairs.length}) ===`);
    asymmetricPairs.forEach(p => console.log(`  WARN: ${p}`));
    console.log('');
}

if (warnings.length > 0) {
    console.log(`=== WARNINGS (${warnings.length}) ===`);
    warnings.forEach(w => console.log(`  WARN: ${w}`));
    console.log('');
}

if (skillsWithoutSynapses.length > 0 && skillsWithoutSynapses.length < 10) {
    console.log('=== SKILLS WITHOUT SYNAPSES ===');
    skillsWithoutSynapses.forEach(s => console.log(`  ${s}`));
}

// Exit with error code if issues found
process.exit(issues.length > 0 ? 1 : 0);
