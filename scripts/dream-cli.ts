#!/usr/bin/env npx ts-node
/**
 * Dream Protocol CLI
 * 
 * Runs neural maintenance and synapse validation from command line.
 * Uses the same core logic as VS Code extension's Dream command.
 * 
 * Usage:
 *   cd platforms/vscode-extension && npm run dream [workspace-path]
 * 
 * If no path provided, uses current directory.
 */

import * as path from 'path';
import * as fs from 'fs';

// Import from synapse-core (relative to this script location when run from extension folder)
import {
    runDreamCore,
    saveReport
} from '../platforms/vscode-extension/src/shared/synapse-core';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

function log(message: string, color: string = colors.reset): void {
    console.log(`${color}${message}${colors.reset}`);
}

function logProgress(message: string): void {
    process.stdout.write(`\r${colors.dim}⏳ ${message}${colors.reset}`.padEnd(60));
}

async function main(): Promise<void> {
    // Get workspace path from args or use current directory
    const args = process.argv.slice(2);
    let rootPath = args[0] || process.cwd();
    rootPath = path.resolve(rootPath);

    log(`\n🌙 ${colors.bright}Alex Dream Protocol CLI${colors.reset}\n`);
    log(`📁 Workspace: ${rootPath}\n`, colors.dim);

    // Check if .github folder exists
    const githubPath = path.join(rootPath, '.github');
    if (!fs.existsSync(githubPath)) {
        log('❌ No .github folder found. Is this an Alex workspace?', colors.red);
        process.exit(1);
    }

    // Run dream protocol with progress output
    const startTime = Date.now();
    
    const { report } = await runDreamCore(rootPath, (message) => {
        logProgress(message);
    });

    // Clear progress line
    process.stdout.write('\r'.padEnd(60) + '\r');

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    // Display results
    if (report.totalFiles === 0) {
        log('⚠️  No Alex memory files found in this workspace.', colors.yellow);
        process.exit(1);
    }

    log(`📊 ${colors.bright}Results${colors.reset} (${elapsed}s)\n`);
    log(`   Memory Files:  ${report.totalFiles}`, colors.cyan);
    log(`   Total Synapses: ${report.totalSynapses}`, colors.cyan);

    if (report.repairedSynapses.length > 0) {
        log(`   Auto-Repaired: ${report.repairedSynapses.length}`, colors.green);
    }

    if (report.brokenSynapses.length > 0) {
        log(`   Broken:        ${report.brokenSynapses.length}`, colors.red);
        log('');
        log('⚠️  Broken Synapses:', colors.yellow);
        for (const synapse of report.brokenSynapses) {
            const sourceName = path.basename(synapse.sourceFile);
            log(`   • ${sourceName}:${synapse.line} → ${synapse.targetFile}`, colors.dim);
        }
    } else {
        log('');
        log('✅ Neural network is healthy!', colors.green);
    }

    // Save report
    const reportPath = await saveReport(rootPath, report);
    log('');
    log(`📄 Report: ${path.relative(rootPath, reportPath)}`, colors.dim);

    // Health assessment
    const healthStatus = report.totalSynapses > 50 ? 'excellent' : 
                        report.totalSynapses > 20 ? 'good' : 'developing';
    log(`🧠 Network health: ${healthStatus}\n`, colors.magenta);

    // Exit with appropriate code
    process.exit(report.brokenSynapses.length > 0 ? 1 : 0);
}

main().catch((error) => {
    console.error('Error running dream protocol:', error);
    process.exit(1);
});
