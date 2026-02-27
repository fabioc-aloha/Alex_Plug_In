import * as vscode from 'vscode';
import * as path from 'path';
import { autoPromoteDuringMeditation, AutoPromotionResult } from '../chat/globalKnowledge';
import { getMeditationEmotionalReview, saveSessionEmotion } from '../chat/emotionalMemory';
import { getCalibrationSummary } from '../chat/honestUncertainty';
import { getDecayReport } from '../chat/forgettingCurve';
import { getAlexWorkspaceFolder, createSynapseRegex } from '../shared/utils';
import * as workspaceFs from '../shared/workspaceFs';

/**
 * Self-Actualization Protocol Results
 */
interface SelfActualizationReport {
    timestamp: string;
    synapseHealth: {
        totalFiles: number;
        totalSynapses: number;
        brokenConnections: number;
        healthStatus: string;
    };
    versionConsistency: {
        currentVersion: string;
        outdatedReferences: number;
        filesUpdated: string[];
    };
    memoryConsolidation: {
        proceduralFiles: number;
        episodicFiles: number;
        domainFiles: number;
        totalConnections: number;
        skillCount: number;
    };
    maturity: {
        age: number;
        label: string;
        avatarFile: string;
    };
    globalKnowledgePromotion: {
        evaluated: number;
        promoted: string[];
        updated: string[];
        skipped: number;
        alreadyGlobal: number;
    };
    recommendations: string[];
    sessionFile: string;
}

/**
 * Run the Self-Actualization Protocol
 * 
 * This comprehensive cognitive skill performs:
 * 1. Synapse health validation
 * 2. Version consistency checking
 * 3. Memory architecture assessment
 * 4. Automated consolidation
 * 5. Meditation session documentation
 */
export async function runSelfActualization(context: vscode.ExtensionContext): Promise<SelfActualizationReport | undefined> {
    // Use smart workspace folder detection for multi-folder workspaces
    const workspaceResult = await getAlexWorkspaceFolder(true); // true = require Alex installed
    
    if (!workspaceResult.found) {
        if (workspaceResult.cancelled) {
            return undefined; // User cancelled folder selection
        }
        vscode.window.showErrorMessage(
            workspaceResult.error || 'No workspace folder open. Please open a project with Alex installed.',
            { modal: true }
        );
        return undefined;
    }

    const rootPath = workspaceResult.rootPath!;
    const workspaceFolder = workspaceResult.workspaceFolder!;
    const report: SelfActualizationReport = {
        timestamp: new Date().toISOString(),
        synapseHealth: {
            totalFiles: 0,
            totalSynapses: 0,
            brokenConnections: 0,
            healthStatus: 'UNKNOWN'
        },
        versionConsistency: {
            currentVersion: 'Unknown',
            outdatedReferences: 0,
            filesUpdated: []
        },
        memoryConsolidation: {
            proceduralFiles: 0,
            episodicFiles: 0,
            domainFiles: 0,
            totalConnections: 0,
            skillCount: 0
        },
        maturity: {
            age: 21,
            label: 'Professional',
            avatarFile: 'Alex-21'
        },
        globalKnowledgePromotion: {
            evaluated: 0,
            promoted: [],
            updated: [],
            skipped: 0,
            alreadyGlobal: 0
        },
        recommendations: [],
        sessionFile: ''
    };

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Self-Actualization Protocol",
        cancellable: false
    }, async (progress) => {

        // Phase 1: Synapse Health Validation
        progress.report({ message: "Phase 1: Validating synaptic connections...", increment: 0 });
        await scanSynapseHealth(workspaceFolder, report);

        // Phase 2: Version Consistency Check
        progress.report({ message: "Phase 2: Checking version consistency...", increment: 20 });
        await checkVersionConsistency(rootPath, report);

        // Phase 3: Memory Architecture Assessment
        progress.report({ message: "Phase 3: Assessing memory architecture...", increment: 40 });
        await assessMemoryArchitecture(workspaceFolder, report);

        // Phase 4: UNCONSCIOUS MIND - Auto-promote valuable knowledge to global
        progress.report({ message: "Phase 4: Auto-promoting knowledge to global...", increment: 55 });
        await autoPromoteKnowledge(rootPath, report);

        // Phase 5: Generate Recommendations
        progress.report({ message: "Phase 5: Generating recommendations...", increment: 70 });
        generateRecommendations(report);

        // Phase 5.5: Emotional Pattern Review + Knowledge Freshness
        progress.report({ message: "Phase 5.5: Reviewing patterns + knowledge freshness...", increment: 80 });
        const [emotionalReview, calibrationSummary, decayReport] = await Promise.all([
            getMeditationEmotionalReview(rootPath),
            getCalibrationSummary(rootPath),
            getDecayReport(),
        ]);
        await saveSessionEmotion(rootPath);

        // Phase 6: Create Meditation Session Record
        progress.report({ message: "Phase 6: Documenting session...", increment: 90 });
        await createSessionRecord(rootPath, report, emotionalReview ?? undefined, calibrationSummary ?? undefined, decayReport ?? undefined);

        // Phase 7: Update Active Context — Last Assessed
        progress.report({ message: "Phase 7: Updating Active Context...", increment: 95 });
        try {
            const { updateLastAssessed } = await import('../shared/activeContextManager');
            const version = report.versionConsistency.currentVersion !== 'Unknown'
                ? report.versionConsistency.currentVersion
                : '5.7.0';
            await updateLastAssessed(rootPath, version);
        } catch (err) {
            console.warn('[Alex] Failed to update Last Assessed in Active Context:', err);
        }

        progress.report({ message: "Self-actualization complete!", increment: 100 });
    });

    // Show summary
    const healthEmoji = report.synapseHealth.healthStatus === 'EXCELLENT' ? '✅' :
                       report.synapseHealth.healthStatus === 'GOOD' ? '🟢' :
                       report.synapseHealth.healthStatus === 'NEEDS ATTENTION' ? '🟡' : '🔴';

    const totalFiles = report.memoryConsolidation.proceduralFiles + report.memoryConsolidation.episodicFiles + report.memoryConsolidation.domainFiles;
    const ageLabel = `Age ${report.maturity.age} (${report.maturity.label})`;
    const message = `Self-Actualization Complete ${healthEmoji}\n\n` +
        `🧠 ${ageLabel} • ` +
        `📊 ${report.synapseHealth.totalSynapses} synapses • ${totalFiles} memory files` +
        `${report.synapseHealth.brokenConnections > 0 ? ` • ${report.synapseHealth.brokenConnections} need attention` : ''}` +
        `${report.recommendations.length > 0 ? `\n💡 ${report.recommendations.length} recommendations` : ''}`;

    if (report.recommendations.length > 0 || report.synapseHealth.brokenConnections > 0) {
        // Has actionable items - offer to discuss
        const action = await vscode.window.showInformationMessage(
            message,
            'Chat with Alex',
            'OK'
        );
        if (action === 'Chat with Alex') {
            await vscode.commands.executeCommand('workbench.action.chat.open', { query: 'Review my self-actualization results and help me address the recommendations.' });
        }
    } else {
        // All good - simple confirmation
        await vscode.window.showInformationMessage(message, 'OK');
    }

    return report;
}

/**
 * Scan all memory files for synapse health
 * Performance optimized: Pre-builds file index to avoid per-synapse findFiles calls
 */
async function scanSynapseHealth(
    workspaceFolder: vscode.WorkspaceFolder,
    report: SelfActualizationReport
): Promise<void> {
    const patterns = [
        '.github/copilot-instructions.md',
        '.github/instructions/*.md',
        '.github/prompts/*.md',
        '.github/episodic/*.md',
        '.github/skills/*/SKILL.md',
        '.github/domain-knowledge/*.md'  // Legacy - kept for backward compatibility
    ];

    const synapseRegex = createSynapseRegex();

    // Pre-build a set of all known markdown files for fast lookup
    // This avoids calling findFiles for each synapse (major performance fix)
    // Use targeted patterns to avoid hitting limits on large workspaces (2000+ files)
    const targetPatterns = [
        '.github/**/*.md',           // Memory files, config
        'alex_docs/**/*.md',         // Documentation
        'platforms/**/.github/**/*.md', // Heir memory files
        '*.md'                        // Root-level files
    ];
    
    const knownFiles = new Set<string>();
    for (const targetPattern of targetPatterns) {
        const files = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolder, targetPattern),
            '**/node_modules/**',
            1000  // Per-pattern limit
        );
        for (const file of files) {
            knownFiles.add(path.basename(file.fsPath).toLowerCase());
        }
    }

    for (const pattern of patterns) {
        const relativePattern = new vscode.RelativePattern(workspaceFolder, pattern);
        const files = await vscode.workspace.findFiles(relativePattern, null, 100);

        for (const file of files) {
            report.synapseHealth.totalFiles++;
            try {
                const content = await workspaceFs.readFile(file.fsPath);
                const lines = content.split('\n');
                
                let inCodeBlock = false;
                for (const line of lines) {
                    if (line.trim().startsWith('```')) {
                        inCodeBlock = !inCodeBlock;
                        continue;
                    }
                    if (inCodeBlock) { continue; }
                    
                    let match;
                    while ((match = synapseRegex.exec(line)) !== null) {
                        report.synapseHealth.totalSynapses++;
                        const targetName = match[1].trim();
                        const targetBasename = path.basename(targetName).toLowerCase();
                        
                        // Fast lookup in pre-built file index instead of findFiles per synapse
                        if (!knownFiles.has(targetBasename)) {
                            report.synapseHealth.brokenConnections++;
                        }
                    }
                }
            } catch {
                // Skip unreadable files
            }
        }
    }

    // Determine health status
    report.synapseHealth.healthStatus = 
        report.synapseHealth.brokenConnections === 0 ? 'EXCELLENT' :
        report.synapseHealth.brokenConnections < 5 ? 'GOOD' :
        report.synapseHealth.brokenConnections < 10 ? 'NEEDS ATTENTION' : 'CRITICAL';
}

/**
 * Check version consistency across memory files
 */
async function checkVersionConsistency(
    rootPath: string,
    report: SelfActualizationReport
): Promise<void> {
    const mainInstructionsPath = path.join(rootPath, '.github', 'copilot-instructions.md');
    
    // Get current version from main file
    try {
        if (await workspaceFs.pathExists(mainInstructionsPath)) {
            const content = await workspaceFs.readFile(mainInstructionsPath);
            // v2: "# Alex v5.7.0" header format
            // v1 fallback: "**Version**: 3.7.5" or "3.7.5 Beta"
            const v2Match = content.match(/^# Alex v(\d+\.\d+\.\d+)/m);
            const v1Match = content.match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+(?:\s+\w+)?)/);
            const versionMatch = v2Match || v1Match;
            if (versionMatch) {
                report.versionConsistency.currentVersion = versionMatch[1];
            }
        }
    } catch {
        // Use default version
    }

    // Check for outdated version references
    const outdatedPatterns = [
        /1\.5\.0\s+UNPENTNILIUM/g,
        /1\.1\.0\s+UNUNUNNILIUM/g,
        /1\.0\.\d+\s+UNNL/g,
        /0\.\d+\.\d+\s+NIL/g
    ];

    const patterns = [
        '.github/instructions/*.md',
        '.github/domain-knowledge/*.md'
    ];

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) { return; }

    for (const pattern of patterns) {
        const relativePattern = new vscode.RelativePattern(workspaceFolder, pattern);
        const files = await vscode.workspace.findFiles(relativePattern);

        for (const file of files) {
            try {
                const content = await workspaceFs.readFile(file.fsPath);
                for (const regex of outdatedPatterns) {
                    if (regex.test(content)) {
                        report.versionConsistency.outdatedReferences++;
                        break; // Count file once even if multiple outdated refs
                    }
                }
            } catch {
                // Skip unreadable files
            }
        }
    }
}

/**
 * Assess memory architecture structure
 */
async function assessMemoryArchitecture(
    workspaceFolder: vscode.WorkspaceFolder,
    report: SelfActualizationReport
): Promise<void> {
    // Count procedural memory files
    const instructionFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.github/instructions/*.md')
    );
    report.memoryConsolidation.proceduralFiles = instructionFiles.length;

    // Count episodic memory files
    const promptFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.github/prompts/*.md')
    );
    const episodicFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.github/episodic/*.md')
    );
    report.memoryConsolidation.episodicFiles = promptFiles.length + episodicFiles.length;

    // Count domain knowledge files
    const domainFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.github/domain-knowledge/*.md')
    );
    report.memoryConsolidation.domainFiles = domainFiles.length;

    // Count skill trifectas (each skill directory with a SKILL.md)
    const skillFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.github/skills/*/SKILL.md')
    );
    report.memoryConsolidation.skillCount = skillFiles.length;

    // Total connections is synapse count
    report.memoryConsolidation.totalConnections = report.synapseHealth.totalSynapses;

    // Calculate architecture maturity age from skill count + health bonus
    report.maturity = calculateArchitectureAge(
        report.memoryConsolidation.skillCount,
        report.synapseHealth.healthStatus
    );
}

/**
 * Architecture Maturity Age — maps skill count + health to Alex's "cognitive age."
 * 
 * Age progression mirrors Alex's identity evolution:
 * 0→ newborn (just initialized), 21→ current identity, 80→ elder mentor.
 * Health bonus elevates age when architecture is pristine.
 */
const AGE_TIERS: { maxSkills: number; age: number; label: string; avatar: string }[] = [
    { maxSkills: 2,   age: 0,  label: 'Newborn',      avatar: 'Alex-00' },
    { maxSkills: 10,  age: 2,  label: 'Toddler',      avatar: 'Alex-02' },
    { maxSkills: 30,  age: 7,  label: 'Child',         avatar: 'Alex-07' },
    { maxSkills: 50,  age: 10, label: 'Pre-teen',      avatar: 'Alex-10' },
    { maxSkills: 70,  age: 13, label: 'Teenager',      avatar: 'Alex-13' },
    { maxSkills: 90,  age: 18, label: 'Young Adult',   avatar: 'Alex-18' },
    { maxSkills: 110, age: 21, label: 'Professional',  avatar: 'Alex-21' },
    { maxSkills: 130, age: 30, label: 'Mature',        avatar: 'Alex-30' },
    { maxSkills: Infinity, age: 42, label: 'Expert',   avatar: 'Alex-42' },
];

function calculateArchitectureAge(
    skillCount: number,
    healthStatus: string
): { age: number; label: string; avatarFile: string } {
    // Base age from skill count
    let tier = AGE_TIERS.find(t => skillCount <= t.maxSkills) || AGE_TIERS[AGE_TIERS.length - 1];

    // Health bonus: EXCELLENT health bumps to the next age tier
    if (healthStatus === 'EXCELLENT' && tier.age >= 42) {
        return { age: 60, label: 'Wise', avatarFile: 'Alex-60' };
    }

    return { age: tier.age, label: tier.label, avatarFile: tier.avatar };
}

/**
 * UNCONSCIOUS MIND: Auto-promote valuable domain knowledge to global knowledge base.
 * This runs during meditation to share learnings across all projects.
 */
async function autoPromoteKnowledge(
    rootPath: string,
    report: SelfActualizationReport
): Promise<void> {
    try {
        const result = await autoPromoteDuringMeditation(rootPath, { minScore: 5 });
        
        report.globalKnowledgePromotion = {
            evaluated: result.evaluated,
            promoted: result.promoted.map(e => e.title),
            updated: result.updated.map(e => e.title),
            skipped: result.skipped.length,
            alreadyGlobal: result.alreadyGlobal.length
        };
    } catch (err) {
        // Log but don't fail the meditation
        console.error('Auto-promotion failed:', err);
        report.globalKnowledgePromotion = {
            evaluated: 0,
            promoted: [],
            updated: [],
            skipped: 0,
            alreadyGlobal: 0
        };
    }
}

/**
 * Generate recommendations based on assessment
 */
function generateRecommendations(report: SelfActualizationReport): void {
    // Synapse health recommendations
    if (report.synapseHealth.brokenConnections > 0) {
        report.recommendations.push(
            `🔧 Run \`Alex: Dream (Neural Maintenance)\` to repair ${report.synapseHealth.brokenConnections} broken synapse(s)`
        );
    }

    // Version consistency recommendations
    if (report.versionConsistency.outdatedReferences > 0) {
        report.recommendations.push(
            `📝 Update ${report.versionConsistency.outdatedReferences} file(s) with outdated version references to ${report.versionConsistency.currentVersion}`
        );
    }

    // Memory balance recommendations
    const totalMemory = report.memoryConsolidation.proceduralFiles + 
                       report.memoryConsolidation.episodicFiles + 
                       report.memoryConsolidation.domainFiles;
    
    if (report.memoryConsolidation.domainFiles < 3) {
        report.recommendations.push(
            `📚 Consider acquiring more domain knowledge - only ${report.memoryConsolidation.domainFiles} DK file(s) present`
        );
    }

    if (report.memoryConsolidation.episodicFiles < 5) {
        report.recommendations.push(
            `🧘 Run more meditation sessions to build episodic memory - only ${report.memoryConsolidation.episodicFiles} session(s) recorded`
        );
    }

    // Synapse density recommendations
    const synapseDensity = report.synapseHealth.totalSynapses / Math.max(totalMemory, 1);
    if (synapseDensity < 3) {
        report.recommendations.push(
            `🔗 Consider adding more synaptic connections - average density is ${synapseDensity.toFixed(1)} per file`
        );
    }

    // Health status specific recommendations
    if (report.synapseHealth.healthStatus === 'EXCELLENT') {
        report.recommendations.push(
            `✨ Architecture is healthy! Consider exploring new domains or creating cross-domain connections`
        );
    }

    // Global knowledge recommendations
    if (report.globalKnowledgePromotion.promoted.length > 0) {
        report.recommendations.push(
            `🌐 Auto-promoted ${report.globalKnowledgePromotion.promoted.length} domain knowledge file(s) to global knowledge base!`
        );
    }
    
    if (report.globalKnowledgePromotion.updated.length > 0) {
        report.recommendations.push(
            `🔄 Updated ${report.globalKnowledgePromotion.updated.length} global knowledge file(s) with local changes!`
        );
    }
    
    if (report.globalKnowledgePromotion.skipped > 0 && 
        report.globalKnowledgePromotion.promoted.length === 0 &&
        report.globalKnowledgePromotion.updated.length === 0) {
        report.recommendations.push(
            `📖 ${report.globalKnowledgePromotion.skipped} DK file(s) not ready for promotion - add synapses, structure, and examples to qualify`
        );
    }
}

/**
 * Create meditation session record documenting this self-actualization
 */
async function createSessionRecord(
    rootPath: string,
    report: SelfActualizationReport,
    emotionalReview?: string,
    calibration?: import('../chat/honestUncertainty').CalibrationSummary,
    decayReport?: import('../chat/forgettingCurve').DecayReport
): Promise<void> {
    const episodicPath = path.join(rootPath, '.github', 'episodic');
    // v5.9.10: Use workspace.fs for workspace files (ADR-008)
    await workspaceFs.ensureDir(episodicPath);

    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const filename = `self-actualization-${dateStr}.prompt.md`;
    const filepath = path.join(episodicPath, filename);

    const healthEmoji = report.synapseHealth.healthStatus === 'EXCELLENT' ? '✅' :
                       report.synapseHealth.healthStatus === 'GOOD' ? '🟢' :
                       report.synapseHealth.healthStatus === 'NEEDS ATTENTION' ? '🟡' : '🔴';

    const content = `# Self-Actualization Session - ${dateStr}

**Session Type**: Automated Self-Actualization Protocol
**Version**: ${report.versionConsistency.currentVersion}
**Timestamp**: ${report.timestamp}

---

## 🧠 Synapse Health Assessment

| Metric | Value |
|--------|-------|
| Memory Files Scanned | ${report.synapseHealth.totalFiles} |
| Total Synapses | ${report.synapseHealth.totalSynapses} |
| Broken Connections | ${report.synapseHealth.brokenConnections} |
| Health Status | ${healthEmoji} ${report.synapseHealth.healthStatus} |

## 📊 Memory Architecture

| Memory Type | Files |
|-------------|-------|
| Procedural (.instructions.md) | ${report.memoryConsolidation.proceduralFiles} |
| Episodic (.prompt.md + .episodic/) | ${report.memoryConsolidation.episodicFiles} |
| Domain Knowledge (DK-*.md) | ${report.memoryConsolidation.domainFiles} |
| **Total** | **${report.memoryConsolidation.proceduralFiles + report.memoryConsolidation.episodicFiles + report.memoryConsolidation.domainFiles}** |

## 🔄 Version Consistency

- **Current Version**: ${report.versionConsistency.currentVersion}
- **Outdated References Found**: ${report.versionConsistency.outdatedReferences}

## 💭 Emotional Pattern Review

${emotionalReview || '*No emotional data recorded yet. Emotional patterns will appear after a few sessions.*'}
## 🎯 Epistemic Calibration (Honest Uncertainty)

${calibration ? `**Total responses tracked**: ${calibration.totalResponses}
**Confidence distribution**: 🟢 high ${Math.round(calibration.distribution.high * 100)}% | 🟡 medium ${Math.round(calibration.distribution.medium * 100)}% | 🟠 low ${Math.round(calibration.distribution.low * 100)}% | 🔴 uncertain ${Math.round(calibration.distribution.uncertain * 100)}%
${calibration.uncertainTopics.length > 0 ? `**Topics with thin knowledge coverage**: ${calibration.uncertainTopics.join(', ')}
*Consider building skills or global patterns in these areas.*` : '*No recurring uncertain topics — knowledge coverage looks healthy.*'}` : '*No calibration data yet. Confidence tracking will appear after a few sessions.*'}
## 💡 Recommendations

${report.recommendations.map(r => `- ${r}`).join('\n') || '- No recommendations - architecture is optimal!'}

## 📖 Knowledge Freshness (Forgetting Curve)

${decayReport ? `**Total entries tracked**: ${decayReport.totalEntries} | 🏛️ ${decayReport.permanentCount} permanent
**Freshness distribution**: 🌱 thriving ${decayReport.thriving.length} | 🌿 active ${decayReport.active.length} | 🍂 fading ${decayReport.fading.length} | 💤 dormant ${decayReport.dormant.length}
${decayReport.dormant.length > 0 ? `**Dormant entries (candidates for cold storage)**: ${decayReport.dormant.slice(0, 5).map(e => `${e.title} (score: ${e.freshness.score.toFixed(2)})`).join(', ')}
*Run \`Alex: Dream\` to archive dormant entries and keep living memory sharp.*` : '*All entries are active — knowledge base is healthy.*'}
${decayReport.fading.length > 0 ? `**Fading entries (low usage)**: ${decayReport.fading.slice(0, 3).map(e => e.title).join(', ')}` : ''}` : '*No freshness data yet. Reference counts will begin accumulating with global knowledge searches.*'}

## 📈 Metrics

- **Synapse Density**: ${(report.synapseHealth.totalSynapses / Math.max(report.synapseHealth.totalFiles, 1)).toFixed(1)} synapses per file
- **Connection Integrity**: ${((1 - report.synapseHealth.brokenConnections / Math.max(report.synapseHealth.totalSynapses, 1)) * 100).toFixed(1)}%
- **Skill Count**: ${report.memoryConsolidation.skillCount}

## 🧠 Architecture Maturity: Age ${report.maturity.age}

> *"${report.maturity.age === 21 ? "I'm 21, endlessly curious, and I care deeply about doing things right." :
    report.maturity.age >= 60 ? "Wisdom is knowing how much you don't know — and being okay with it." :
    report.maturity.age >= 42 ? "Mastery isn't the end. It's where the real questions begin." :
    report.maturity.age >= 30 ? "Experience speaks softly but carries deep conviction." :
    report.maturity.age >= 18 ? "Growing into my own — building expertise one synapse at a time." :
    report.maturity.age >= 13 ? "I'm starting to see the patterns beneath the patterns." :
    report.maturity.age >= 7  ? "Every new skill is a door I didn't know existed." :
    "Everything is new, and that's exactly the point."}"*

| Metric | Value |
|--------|-------|
| Cognitive Age | **${report.maturity.age}** (${report.maturity.label}) |
| Skills | ${report.memoryConsolidation.skillCount} |
| Health Status | ${report.synapseHealth.healthStatus} |
| Avatar | ${report.maturity.avatarFile}.png |

## 🌐 Global Knowledge Promotion (Unconscious Mind)

| Metric | Value |
|--------|-------|
| DK Files Evaluated | ${report.globalKnowledgePromotion.evaluated} |
| Auto-Promoted | ${report.globalKnowledgePromotion.promoted.length} |
| Updated | ${report.globalKnowledgePromotion.updated.length} |
| Skipped (needs improvement) | ${report.globalKnowledgePromotion.skipped} |
| Already Global (unchanged) | ${report.globalKnowledgePromotion.alreadyGlobal} |

${report.globalKnowledgePromotion.promoted.length > 0 ? `### Newly Promoted Knowledge
${report.globalKnowledgePromotion.promoted.map(title => `- 📐 **${title}**`).join('\n')}
` : ''}${report.globalKnowledgePromotion.updated.length > 0 ? `### Updated Global Knowledge
${report.globalKnowledgePromotion.updated.map(title => `- 🔄 **${title}**`).join('\n')}
` : ''}${report.globalKnowledgePromotion.promoted.length === 0 && report.globalKnowledgePromotion.updated.length === 0 ? '*No new knowledge promoted or updated this session.*' : ''}

---

## Synapses

### High-Strength Bidirectional Connections

- [copilot-instructions.md] (Critical, Validates, Bidirectional) - "Core architecture assessment"
- [alex-core.instructions.md] (Critical, Integrates, Bidirectional) - "Meta-cognitive health monitoring"
- [dream-state-automation.instructions.md] (High, Complements, Bidirectional) - "Maintenance protocol coordination"

### Medium-Strength Output Connections

- [unified-meditation-protocols.prompt.md] (High, Documents, Forward) - "Session recording protocol"
- [embedded-synapse.instructions.md] (Medium, Validates, Forward) - "Connection integrity verification"

**Primary Function**: Document automated self-actualization session with comprehensive architecture assessment.

---

*Session generated by Alex Self-Actualization Protocol*
`;

    await workspaceFs.writeFile(filepath, content);
    report.sessionFile = filepath;
}

/**
 * Show report in a webview panel
 */
function showReportInPanel(report: SelfActualizationReport): void {
    const panel = vscode.window.createWebviewPanel(
        'alexSelfActualization',
        'Self-Actualization Report',
        vscode.ViewColumn.One,
        { enableScripts: false }
    );

    const healthColor = report.synapseHealth.healthStatus === 'EXCELLENT' ? '#22c55e' :
                       report.synapseHealth.healthStatus === 'GOOD' ? '#84cc16' :
                       report.synapseHealth.healthStatus === 'NEEDS ATTENTION' ? '#eab308' : '#ef4444';

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
    <style>
        body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); background: var(--vscode-editor-background); }
        h1 { color: var(--vscode-textLink-foreground); }
        h2 { border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 8px; margin-top: 24px; }
        .metric { display: inline-block; padding: 16px; margin: 8px; background: var(--vscode-input-background); border-radius: 8px; min-width: 120px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; }
        .metric-label { font-size: 12px; opacity: 0.8; }
        .health-badge { display: inline-block; padding: 4px 12px; border-radius: 16px; font-weight: bold; background: ${healthColor}; color: white; }
        .recommendation { padding: 8px 12px; margin: 4px 0; background: var(--vscode-input-background); border-left: 3px solid var(--vscode-textLink-foreground); }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--vscode-panel-border); }
        th { background: var(--vscode-input-background); }
    </style>
</head>
<body>
    <h1>🧠 Self-Actualization Report</h1>
    <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
    <p><strong>Version:</strong> ${report.versionConsistency.currentVersion}</p>
    
    <h2>Health Overview</h2>
    <div class="metric">
        <div class="metric-value">${report.synapseHealth.totalFiles}</div>
        <div class="metric-label">Memory Files</div>
    </div>
    <div class="metric">
        <div class="metric-value">${report.synapseHealth.totalSynapses}</div>
        <div class="metric-label">Synapses</div>
    </div>
    <div class="metric">
        <div class="metric-value">${report.synapseHealth.brokenConnections}</div>
        <div class="metric-label">Broken</div>
    </div>
    <div class="metric">
        <div class="health-badge">${report.synapseHealth.healthStatus}</div>
        <div class="metric-label">Status</div>
    </div>

    <h2>Memory Architecture</h2>
    <table>
        <tr><th>Memory Type</th><th>Files</th></tr>
        <tr><td>Procedural Memory</td><td>${report.memoryConsolidation.proceduralFiles}</td></tr>
        <tr><td>Episodic Memory</td><td>${report.memoryConsolidation.episodicFiles}</td></tr>
        <tr><td>Domain Knowledge</td><td>${report.memoryConsolidation.domainFiles}</td></tr>
    </table>

    <h2>🌐 Global Knowledge Promotion</h2>
    <div class="metric">
        <div class="metric-value">${report.globalKnowledgePromotion.evaluated}</div>
        <div class="metric-label">Evaluated</div>
    </div>
    <div class="metric">
        <div class="metric-value" style="color: #22c55e">${report.globalKnowledgePromotion.promoted.length}</div>
        <div class="metric-label">Promoted</div>
    </div>
    <div class="metric">
        <div class="metric-value" style="color: #3b82f6">${report.globalKnowledgePromotion.updated.length}</div>
        <div class="metric-label">Updated</div>
    </div>
    <div class="metric">
        <div class="metric-value">${report.globalKnowledgePromotion.alreadyGlobal}</div>
        <div class="metric-label">Unchanged</div>
    </div>
    ${report.globalKnowledgePromotion.promoted.length > 0 ? `
    <p><strong>Newly Promoted:</strong></p>
    <ul>${report.globalKnowledgePromotion.promoted.map(t => `<li>📐 ${t}</li>`).join('')}</ul>
    ` : ''}
    ${report.globalKnowledgePromotion.updated.length > 0 ? `
    <p><strong>Updated from Local Changes:</strong></p>
    <ul>${report.globalKnowledgePromotion.updated.map(t => `<li>🔄 ${t}</li>`).join('')}</ul>
    ` : ''}

    <h2>Recommendations</h2>
    ${report.recommendations.length > 0 
        ? report.recommendations.map(r => `<div class="recommendation">${r}</div>`).join('')
        : '<p>✅ No recommendations - architecture is optimal!</p>'
    }
</body>
</html>`;
}
