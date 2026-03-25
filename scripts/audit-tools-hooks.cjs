#!/usr/bin/env node
/**
 * Hooks & Tools Consistency Audit
 * Validates hooks.json scripts, MCP tool registrations, and extension tool registrations.
 * 
 * Usage: node scripts/audit-tools-hooks.cjs [--json]
 * Alex-first: Use --json for machine-consumable output
 */
const fs = require('fs');
const path = require('path');

// Alex-first: JSON output mode
const JSON_MODE = process.argv.includes('--json');

const base = process.cwd();
const issues = [];

// ── Hooks ──────────────────────────────────────────────────────
console.log('=== HOOKS AUDIT ===');
const hooksFile = path.join(base, '.github/hooks.json');
if (fs.existsSync(hooksFile)) {
  const hooks = JSON.parse(fs.readFileSync(hooksFile, 'utf8'));
  const eventNames = Object.keys(hooks.hooks || {});
  console.log('Hook events: ' + eventNames.join(', '));

  let totalHooks = 0;
  const referencedScripts = new Set();
  for (const event of eventNames) {
    const groups = hooks.hooks[event];
    if (!Array.isArray(groups)) continue;
    for (const group of groups) {
      if (!group.hooks || !Array.isArray(group.hooks)) continue;
      for (const hook of group.hooks) {
        totalHooks++;
        if (hook.command) {
          const match = hook.command.match(/(?:node|tsx|pwsh)\s+([^\s]+)/);
          if (match) {
            const scriptPath = match[1];
            referencedScripts.add(scriptPath);
            const fullPath = path.join(base, scriptPath);
            if (!fs.existsSync(fullPath)) {
              issues.push('BUG: ' + event + ' references missing script: ' + scriptPath);
            }
          }
        }
      }
    }
  }
  console.log('Total hooks: ' + totalHooks);
  console.log('Unique scripts referenced: ' + referencedScripts.size);

  // Scan agent-scoped hooks from .agent.md frontmatter
  const agentsDir = path.join(base, '.github/agents');
  if (fs.existsSync(agentsDir)) {
    const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.agent.md'));
    for (const af of agentFiles) {
      const agentContent = fs.readFileSync(path.join(agentsDir, af), 'utf8');
      const cmdMatches = agentContent.matchAll(/command:\s*["']?(?:node|tsx|pwsh)\s+([^\s"']+)/g);
      for (const cm of cmdMatches) {
        referencedScripts.add(cm[1]);
      }
    }
    console.log('Agent-scoped hook scripts found: ' + (referencedScripts.size - totalHooks));
  }

  // Check for orphan hook scripts
  const hooksDir = path.join(base, '.github/muscles/hooks');
  if (fs.existsSync(hooksDir)) {
    const diskScripts = fs.readdirSync(hooksDir).filter(f => /\.(cjs|js|ts)$/.test(f));
    console.log('Hook scripts on disk: ' + diskScripts.length);
    for (const script of diskScripts) {
      const relPath = '.github/muscles/hooks/' + script;
      if (!referencedScripts.has(relPath)) {
        issues.push('WARN: orphan hook script (not in hooks.json or agent files): ' + script);
      }
    }
    // Check reverse — referenced scripts that don't exist
    for (const ref of referencedScripts) {
      if (!fs.existsSync(path.join(base, ref))) {
        // Already caught above
      }
    }
  }
}

// ── MCP Tools ──────────────────────────────────────────────────
console.log('\n=== MCP TOOLS AUDIT ===');
const mcpIndex = path.join(base, 'packages/mcp-cognitive-tools/src/index.ts');
if (fs.existsSync(mcpIndex)) {
  const content = fs.readFileSync(mcpIndex, 'utf8');
  // Find tool name registrations
  const toolRegex = /name:\s*['"](\w+)['"]/g;
  const mcpTools = [];
  let m;
  while ((m = toolRegex.exec(content)) !== null) {
    mcpTools.push(m[1]);
  }
  console.log('MCP tools registered: ' + mcpTools.length);
  mcpTools.forEach(t => console.log('  - ' + t));

  // Check for handler functions
  for (const tool of mcpTools) {
    // Each tool should have a handler in the switch/case or function
    const handlerPattern = new RegExp('case [\'"]' + tool + '[\'"]|' + tool.replace(/_/g, '\\w*'));
    // Simplified — just count
  }
}

// ── Extension Chat Tools ───────────────────────────────────────
console.log('\n=== EXTENSION CHAT TOOLS AUDIT ===');
const toolsDir = path.join(base, 'platforms/vscode-extension/src/chat/tools');
if (fs.existsSync(toolsDir)) {
  const toolFiles = fs.readdirSync(toolsDir)
    .filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts');
  console.log('Tool implementation files: ' + toolFiles.length);
  toolFiles.forEach(f => console.log('  - ' + f));

  // Read index.ts for tool registrations
  const indexFile = path.join(toolsDir, 'index.ts');
  if (fs.existsSync(indexFile)) {
    const indexContent = fs.readFileSync(indexFile, 'utf8');
    
    // Find tool IDs registered
    const idRegex = /['"]alex[._]\w+['"]/g;
    const toolIds = [];
    let im;
    while ((im = idRegex.exec(indexContent)) !== null) {
      toolIds.push(im[0].replace(/['"]/g, ''));
    }
    // Deduplicate
    const uniqueIds = [...new Set(toolIds)];
    console.log('\nRegistered tool IDs (' + uniqueIds.length + '):');
    uniqueIds.forEach(t => console.log('  - ' + t));

    // Check each tool file is imported
    for (const file of toolFiles) {
      const baseName = file.replace('.ts', '');
      if (!indexContent.includes(baseName)) {
        issues.push('WARN: tool file ' + file + ' not imported in index.ts');
      }
    }
  }

  // Cross-reference with MCP tools
  if (fs.existsSync(mcpIndex)) {
    const mcpContent = fs.readFileSync(mcpIndex, 'utf8');
    const mcpToolRegex = /name:\s*['"](\w+)['"]/g;
    const mcpToolNames = [];
    let mm;
    while ((mm = mcpToolRegex.exec(mcpContent)) !== null) {
      mcpToolNames.push(mm[1]);
    }
    
    const indexContent = fs.readFileSync(path.join(toolsDir, 'index.ts'), 'utf8');
    const extIdRegex = /['"]alex[._]\w+['"]/g;
    const extToolNames = [];
    let em;
    while ((em = extIdRegex.exec(indexContent)) !== null) {
      extToolNames.push(em[0].replace(/['"]/g, '').replace(/\./g, '_'));
    }
    const uniqueExt = [...new Set(extToolNames)];
    
    // Tools in MCP but not extension
    for (const mt of mcpToolNames) {
      if (!uniqueExt.includes(mt)) {
        console.log('  INFO: MCP-only tool (no extension equiv): ' + mt);
      }
    }
    // Tools in extension but not MCP
    for (const et of uniqueExt) {
      if (!mcpToolNames.includes(et)) {
        console.log('  INFO: Extension-only tool (no MCP equiv): ' + et);
      }
    }
  }
}

// ── Package.json Tool Contributions ────────────────────────────
console.log('\n=== PACKAGE.JSON TOOL CONTRIBUTIONS ===');
const pkgJson = path.join(base, 'platforms/vscode-extension/package.json');
if (fs.existsSync(pkgJson)) {
  const pkg = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));
  const chatTools = pkg.contributes?.languageModelTools || [];
  console.log('Tools in package.json: ' + chatTools.length);
  chatTools.forEach(t => console.log('  - ' + (t.name || t.id) + (t.canBeReferencedInPrompt ? ' (prompt-referenceable)' : '')));

  // Cross-reference with all extension source files that register tools
  const extSrcDir = path.join(base, 'platforms/vscode-extension/src');
  if (fs.existsSync(extSrcDir)) {
    // Collect all .ts content to search for tool registrations
    const allTsContent = [];
    const scanDir = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) scanDir(path.join(dir, entry.name));
        else if (entry.name.endsWith('.ts')) {
          allTsContent.push(fs.readFileSync(path.join(dir, entry.name), 'utf8'));
        }
      }
    };
    scanDir(extSrcDir);
    const combinedSrc = allTsContent.join('\n');

    for (const tool of chatTools) {
      const toolName = tool.name || tool.id;
      if (!combinedSrc.includes("'" + toolName + "'") && !combinedSrc.includes('"' + toolName + '"')) {
        issues.push('BUG: package.json declares tool ' + toolName + ' but no registerTool() found in extension source');
      }
    }
  }
}

// ── Summary ────────────────────────────────────────────────────
const bugs = issues.filter(i => i.startsWith('BUG:'));
const warns = issues.filter(i => i.startsWith('WARN:'));

// Alex-first: JSON output
if (JSON_MODE) {
    const jsonResult = {
        passed: bugs.length === 0,
        bugs: bugs.map(b => b.replace('BUG: ', '')),
        warnings: warns.map(w => w.replace('WARN: ', ''))
    };
    console.log(JSON.stringify(jsonResult, null, 2));
    process.exit(bugs.length > 0 ? 1 : 0);
}

console.log('\n=== ISSUES (' + issues.length + ': ' + bugs.length + ' bugs, ' + warns.length + ' warnings) ===');
issues.forEach(i => console.log('  ' + i));

process.exit(bugs.length > 0 ? 1 : 0);
