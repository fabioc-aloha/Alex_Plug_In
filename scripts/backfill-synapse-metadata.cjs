/**
 * backfill-synapse-metadata.cjs
 * 
 * Fills missing when/yields/type fields in synapses.json files.
 * Migrates legacy activation keywords to activationContexts.
 * Normalizes non-standard field names (relationship→type, context→reason).
 * 
 * Usage: node scripts/backfill-synapse-metadata.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const SKILLS_DIR = path.join(__dirname, '..', '.github', 'skills');

// --- Helpers ---

/** Convert kebab-case skill name to readable English */
function prettify(name) {
  const special = {
    'vscode': 'VS Code',
    'ui': 'UI',
    'ux': 'UX',
    'api': 'API',
    'svg': 'SVG',
    'qa': 'QA',
    'ai': 'AI',
    'mcp': 'MCP',
    'pptx': 'PPTX',
    'md': 'Markdown',
    'pii': 'PII',
    'rag': 'RAG',
    'llm': 'LLM',
    'hr': 'HR',
    'm365': 'M365',
    'devops': 'DevOps',
    'iac': 'IaC',
    'ci': 'CI',
    'cd': 'CD',
    'tts': 'TTS',
    'ssh': 'SSH',
    'pdf': 'PDF',
    'css': 'CSS',
    'html': 'HTML',
  };
  return name.split('-').map(w => special[w] || w).join(' ');
}

/** Extract the meaningful name from a target path */
function targetName(targetPath) {
  const skillMatch = targetPath.match(/skills\/([^/]+)\//);
  if (skillMatch) return prettify(skillMatch[1]);
  const instrMatch = targetPath.match(/instructions\/([^.]+)\.instructions/);
  if (instrMatch) return prettify(instrMatch[1]);
  const promptMatch = targetPath.match(/prompts\/([^.]+)\.prompt/);
  if (promptMatch) return prettify(promptMatch[1]);
  // Fallback
  return path.basename(targetPath, path.extname(targetPath));
}

/** Extract target category */
function targetCategory(targetPath) {
  if (targetPath.includes('/skills/')) return 'skill';
  if (targetPath.includes('/instructions/')) return 'instruction';
  if (targetPath.includes('/prompts/')) return 'prompt';
  return 'other';
}

/** Generate a when clause from type + source + target names */
function generateWhen(type, sourceName, tName) {
  const t = (type || '').toLowerCase();
  const typeWhenMap = {
    'triggers': `${sourceName} initiates ${tName}`,
    'triggered-by': `${tName} activates ${sourceName}`,
    'enables': `${sourceName} requires ${tName} capabilities`,
    'validates': `Verifying ${tName} quality or compliance`,
    'uses': `${sourceName} leverages ${tName} patterns`,
    'supports': `${sourceName} needs ${tName} context`,
    'complements': `Combining ${sourceName} with ${tName}`,
    'complement': `Combining ${sourceName} with ${tName}`,
    'coordinates': `Coordinating ${sourceName} with ${tName}`,
    'coordinates-with': `Coordinating with ${tName}`,
    'coordinated-by': `${tName} orchestrates ${sourceName}`,
    'implements': `Applying ${tName} procedures`,
    'integrates': `Integrating ${tName} into ${sourceName} workflow`,
    'activates': `Activating ${tName} from ${sourceName}`,
    'shapes': `${sourceName} influences ${tName} direction`,
    'guides': `${sourceName} directs ${tName} decisions`,
    'informs': `${sourceName} provides context to ${tName}`,
    'informed-by': `${tName} provides context to ${sourceName}`,
    'suggests': `${sourceName} recommends ${tName} improvements`,
    'input-source': `Using ${tName} as input source`,
    'output-to': `Sending ${sourceName} output to ${tName}`,
    'applies-to': `Applying ${sourceName} to ${tName} domain`,
    'applied-by': `${tName} applies ${sourceName}`,
    'extends': `Extending ${tName} with ${sourceName}`,
    'extended-by': `${tName} extends ${sourceName}`,
    'requires': `${sourceName} depends on ${tName}`,
    'depends-on': `${sourceName} depends on ${tName}`,
    'enhances': `${sourceName} enhances ${tName}`,
    'follows': `${sourceName} follows ${tName}`,
    'followsfrom': `${sourceName} follows from ${tName}`,
    'feeds': `${sourceName} feeds into ${tName}`,
    'produces': `${sourceName} produces artifacts for ${tName}`,
    'consumes': `${sourceName} consumes ${tName} output`,
    'contains': `${sourceName} contains ${tName}`,
    'sibling': `${sourceName} is a trifecta sibling of ${tName}`,
    'child-of': `${sourceName} is a component of ${tName}`,
    'related': `${sourceName} relates to ${tName}`,
    'relates-to': `${sourceName} relates to ${tName}`,
    'references': `${sourceName} references ${tName}`,
    'referenced-by': `${tName} references ${sourceName}`,
    'documents': `${sourceName} documents ${tName}`,
    'stores': `${sourceName} stores data in ${tName}`,
    'receives': `${sourceName} receives input from ${tName}`,
    'mirrors': `${sourceName} mirrors ${tName} patterns`,
    'embodies': `${sourceName} embodies ${tName} principles`,
    'considers': `${sourceName} considers ${tName}`,
    'aligns': `${sourceName} aligns with ${tName}`,
    'analogousdomain': `${sourceName} applies analogous patterns from ${tName}`,
    'escalates': `${sourceName} escalates to ${tName}`,
    'plans': `${sourceName} plans with ${tName}`,
    'quality-gate': `${tName} serves as quality gate for ${sourceName}`,
    'automates': `${sourceName} automates ${tName}`,
    'impacts': `${sourceName} impacts ${tName}`,
    'modifies': `${sourceName} modifies ${tName}`,
    'specializes': `${sourceName} specializes ${tName}`,
    'operational': `${sourceName} operates with ${tName}`,
    'accelerates': `${sourceName} accelerates ${tName}`,
    'reads': `${sourceName} reads from ${tName}`,
    'collaborates': `${sourceName} collaborates with ${tName}`,
  };
  return typeWhenMap[t] || `${sourceName} connects to ${tName}`;
}

/** Generate a yields clause from type + target name + category */
function generateYields(type, tName, category) {
  const t = (type || '').toLowerCase();
  const suffix = category === 'instruction' ? 'rules and guidelines'
    : category === 'prompt' ? 'interactive workflow'
    : 'patterns and guidance';
  
  const typeYieldsMap = {
    'triggers': `${tName} activation and procedures`,
    'triggered-by': `Activation signal from ${tName}`,
    'enables': `${tName} capabilities and setup`,
    'validates': `${tName} quality checks and validation`,
    'uses': `${tName} ${suffix}`,
    'supports': `${tName} supporting context`,
    'complements': `${tName} complementary techniques`,
    'complement': `${tName} complementary techniques`,
    'coordinates': `${tName} coordination protocols`,
    'coordinates-with': `${tName} coordination protocols`,
    'coordinated-by': `${tName} orchestration guidance`,
    'implements': `${tName} implementation steps`,
    'integrates': `${tName} integration patterns`,
    'activates': `${tName} interactive workflow`,
    'shapes': `${tName} directional guidance`,
    'guides': `${tName} decision frameworks`,
    'informs': `${tName} contextual assessment`,
    'informed-by': `${tName} contextual input`,
    'suggests': `${tName} improvement recommendations`,
    'input-source': `${tName} source data and creation patterns`,
    'output-to': `${tName} consumption interface`,
    'applies-to': `${tName} domain-specific context`,
    'applied-by': `${tName} application context`,
    'extends': `${tName} extended capabilities`,
    'extended-by': `${tName} extension patterns`,
    'requires': `${tName} required ${suffix}`,
    'depends-on': `${tName} required ${suffix}`,
    'enhances': `${tName} enhanced capabilities`,
    'follows': `${tName} prerequisite steps`,
    'followsfrom': `${tName} preceding context`,
    'feeds': `${tName} downstream processing`,
    'produces': `${tName} output artifacts`,
    'consumes': `${tName} input data`,
    'contains': `${tName} component details`,
    'sibling': `${tName} trifecta ${suffix}`,
    'child-of': `${tName} parent context`,
    'related': `${tName} related ${suffix}`,
    'relates-to': `${tName} related ${suffix}`,
    'references': `${tName} reference material`,
    'referenced-by': `${tName} referencing context`,
    'documents': `${tName} documentation`,
    'stores': `${tName} storage interface`,
    'receives': `${tName} input data`,
    'mirrors': `${tName} mirrored patterns`,
    'embodies': `${tName} foundational principles`,
    'considers': `${tName} considerations`,
    'aligns': `${tName} alignment criteria`,
    'analogousdomain': `${tName} analogous domain patterns`,
    'escalates': `${tName} escalation procedures`,
    'plans': `${tName} planning framework`,
    'quality-gate': `${tName} gate criteria and checks`,
    'automates': `${tName} automation procedures`,
    'impacts': `${tName} impact assessment`,
    'modifies': `${tName} modification interface`,
    'specializes': `${tName} specialized patterns`,
    'operational': `${tName} operational procedures`,
    'accelerates': `${tName} acceleration techniques`,
    'reads': `${tName} data and content`,
    'collaborates': `${tName} collaborative workflows`,
  };
  return typeYieldsMap[t] || `${tName} ${suffix}`;
}

/** Generate activationContexts from skill name when no keywords exist */
function generateActivationContexts(skillName) {
  const words = skillName.split('-');
  const contexts = [
    skillName,
    words.join(' '),
  ];
  // Add individual significant words (skip very short/common ones)
  const stopWords = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'for', 'on', 'at', 'by', 'is']);
  words.filter(w => w.length > 2 && !stopWords.has(w)).forEach(w => contexts.push(w));
  return [...new Set(contexts)];
}

// --- Main ---

function main() {
  const stats = {
    filesProcessed: 0,
    filesModified: 0,
    whenAdded: 0,
    yieldsAdded: 0,
    typeFixed: 0,
    activationContextsMigrated: 0,
    activationContextsGenerated: 0,
  };

  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d => {
    const synPath = path.join(SKILLS_DIR, d, 'synapses.json');
    return fs.existsSync(synPath);
  });

  for (const skillDir of skillDirs) {
    const synPath = path.join(SKILLS_DIR, skillDir, 'synapses.json');
    let data;
    try {
      data = JSON.parse(fs.readFileSync(synPath, 'utf8'));
    } catch {
      console.error(`  SKIP: ${skillDir} — parse error`);
      continue;
    }
    stats.filesProcessed++;
    let modified = false;
    const sourceName = prettify(skillDir);

    // --- Normalize non-standard fields in connections ---
    for (const conn of (data.connections || [])) {
      // Fix relationship → type
      if (conn.relationship && !conn.type) {
        conn.type = conn.relationship;
        delete conn.relationship;
        stats.typeFixed++;
        modified = true;
      }

      // Fix context → reason (preserve for when/yields generation)
      if (conn.context && !conn.reason) {
        conn.reason = conn.context;
        delete conn.context;
        modified = true;
      }

      const tName = targetName(conn.target || '');
      const tCategory = targetCategory(conn.target || '');
      const connType = conn.type || 'related';

      // Generate when if missing
      if (!conn.when) {
        if (conn.reason) {
          // Transform reason into a when clause
          conn.when = conn.reason;
        } else {
          conn.when = generateWhen(connType, sourceName, tName);
        }
        stats.whenAdded++;
        modified = true;
      }

      // Generate yields if missing
      if (!conn.yields) {
        conn.yields = generateYields(connType, tName, tCategory);
        stats.yieldsAdded++;
        modified = true;
      }
    }

    // --- Migrate activation keywords → activationContexts ---
    if (!data.activationContexts || data.activationContexts.length === 0) {
      const sources = [];
      if (Array.isArray(data.activationBoost)) sources.push(...data.activationBoost);
      if (Array.isArray(data.triggers)) sources.push(...data.triggers);
      if (Array.isArray(data.activationTriggers)) sources.push(...data.activationTriggers);

      if (sources.length > 0) {
        data.activationContexts = [...new Set(sources)];
        stats.activationContextsMigrated++;
        modified = true;
      } else if ((data.connections || []).length > 0) {
        // No legacy keywords either — generate minimal set from skill name
        data.activationContexts = generateActivationContexts(skillDir);
        stats.activationContextsGenerated++;
        modified = true;
      }
    }

    // --- Normalize top-level north-star style when/yields ---
    // north-star has top-level when (object) and yields (array) — these are non-standard
    // Convert to per-connection format only (already handled above)
    if (typeof data.when === 'object' && !Array.isArray(data.when)) {
      delete data.when;
      modified = true;
    }
    if (Array.isArray(data.yields)) {
      delete data.yields;
      modified = true;
    }

    // --- Ensure $schema reference ---
    if (!data.$schema) {
      data.$schema = '../SYNAPSE-SCHEMA.json';
      modified = true;
    }

    if (modified) {
      stats.filesModified++;
      if (!DRY_RUN) {
        fs.writeFileSync(synPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      }
    }
  }

  console.log(`\n=== SYNAPSE METADATA BACKFILL ${DRY_RUN ? '(DRY RUN)' : ''} ===`);
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Files modified:  ${stats.filesModified}`);
  console.log(`when added:      ${stats.whenAdded}`);
  console.log(`yields added:    ${stats.yieldsAdded}`);
  console.log(`type fixed:      ${stats.typeFixed} (relationship→type)`);
  console.log(`activationContexts migrated: ${stats.activationContextsMigrated}`);
  console.log(`activationContexts generated: ${stats.activationContextsGenerated}`);
  if (DRY_RUN) console.log('\nRe-run without --dry-run to apply changes.');
}

main();
