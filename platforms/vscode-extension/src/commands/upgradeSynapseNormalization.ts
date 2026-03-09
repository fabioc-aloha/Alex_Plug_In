/**
 * upgradeSynapseNormalization.ts - Synapse schema normalization
 *
 * Handles: string→numeric strengths, synapses→connections, context→when+yields,
 * activationKeywords→activationContexts, missing $schema/skillId/inheritance
 */
import * as fs from "fs-extra";
import * as path from "path";

/**
 * Map of string strengths to numeric values
 */
const STRENGTH_MAP: Record<string, number> = {
  'critical': 1.0,
  'strong': 0.9,
  'high': 0.9,
  'moderate': 0.7,
  'medium': 0.7,
  'low': 0.5,
  'weak': 0.3,
};

/**
 * Normalize a synapse file to current schema format
 * Handles: string→numeric strengths, synapses→connections, context→when+yields, 
 * activationKeywords→activationContexts, missing $schema/skillId/inheritance
 */
async function normalizeSynapseFile(synapsePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(synapsePath, 'utf8');
    const json = JSON.parse(content);
    let modified = false;

    // Extract skill name from path
    const skillDir = path.dirname(synapsePath);
    const skillName = path.basename(skillDir);

    // 1. Add $schema if missing
    if (!json.$schema) {
      json.$schema = '../SYNAPSE-SCHEMA.json';
      modified = true;
    }

    // 2. Normalize skill identifier (name → skillId)
    if (json.name && !json.skillId) {
      json.skillId = json.name;
      delete json.name;
      modified = true;
    }
    if (json.skill && !json.skillId) {
      json.skillId = json.skill;
      delete json.skill;
      modified = true;
    }
    if (!json.skillId) {
      json.skillId = skillName;
      modified = true;
    }

    // 3. inheritance field is now centralized in sync-architecture.cjs — remove if present
    if (json.inheritance) {
      delete json.inheritance;
      modified = true;
    }

    // 4. Add lastUpdated if missing
    if (!json.lastUpdated) {
      json.lastUpdated = new Date().toISOString().split('T')[0];
      modified = true;
    }

    // 5. Rename synapses → connections (legacy array name)
    if (json.synapses && !json.connections) {
      json.connections = json.synapses;
      delete json.synapses;
      modified = true;
    }

    // 6. Normalize connections array
    if (json.connections && Array.isArray(json.connections)) {
      for (const conn of json.connections) {
        // Convert string strength to numeric
        if (typeof conn.strength === 'string') {
          const key = conn.strength.toLowerCase();
          if (STRENGTH_MAP[key] !== undefined) {
            conn.strength = STRENGTH_MAP[key];
            modified = true;
          }
        }

        // Convert relationship → type
        if (conn.relationship && !conn.type) {
          conn.type = conn.relationship.toUpperCase();
          delete conn.relationship;
          modified = true;
        }

        // Convert context → when + yields (if not already present)
        if (conn.context && !conn.when && !conn.yields) {
          // Best effort: use context as 'when', leave yields empty
          conn.when = conn.context;
          conn.yields = 'See target skill';
          delete conn.context;
          modified = true;
        }

        // Remove deprecated direction field
        if (conn.direction) {
          // Convert direction to bidirectional flag if needed
          if (conn.direction.toLowerCase() === 'bidirectional' && !conn.bidirectional) {
            conn.bidirectional = true;
          }
          delete conn.direction;
          modified = true;
        }

        // Fix relative paths to absolute from .github
        if (conn.target && conn.target.startsWith('../')) {
          conn.target = '.github/skills/' + conn.target.replace(/^\.\.\//, '');
          modified = true;
        }

        // Remove activation field (deprecated)
        if (conn.activation) {
          if (!conn.when) {
            conn.when = conn.activation;
            conn.yields = 'See target skill';
          }
          delete conn.activation;
          modified = true;
        }
      }
    }

    // 7. Rename activationKeywords/activationTriggers/activationPatterns → activationContexts
    if (json.activationKeywords && !json.activationContexts) {
      json.activationContexts = json.activationKeywords;
      delete json.activationKeywords;
      modified = true;
    }
    if (json.activationTriggers && !json.activationContexts) {
      json.activationContexts = json.activationTriggers;
      delete json.activationTriggers;
      modified = true;
    }
    if (json.activationPatterns && !json.activationContexts) {
      json.activationContexts = json.activationPatterns;
      delete json.activationPatterns;
      modified = true;
    }

    // 8. Remove deprecated fields
    const deprecatedFields = ['actionKeywords', 'relatedSkills', 'knowledgeDomains', 'sourceFile', 'description', 'domain', 'status', 'created', 'updated'];
    for (const field of deprecatedFields) {
      if (json[field]) {
        // Move useful info to notes if not already there
        if (field === 'description' && !json.notes) {
          json.notes = json[field];
        }
        delete json[field];
        modified = true;
      }
    }

    // 9. Bump version if modified
    if (modified && json.version) {
      const vParts = json.version.split('.');
      if (vParts.length >= 2) {
        const minor = parseInt(vParts[1], 10) + 1;
        json.version = `${vParts[0]}.${minor}.0`;
      }
    }

    // Write back if modified
    if (modified) {
      // Reorder keys for consistency
      const orderedJson: Record<string, any> = {};
      const keyOrder = ['$schema', 'skillId', 'version', 'lastUpdated', 'inheritance', 'connections', 'activationContexts', 'notes'];
      for (const key of keyOrder) {
        if (json[key] !== undefined) {
          orderedJson[key] = json[key];
        }
      }
      // Add any remaining keys
      for (const key of Object.keys(json)) {
        if (!keyOrder.includes(key)) {
          orderedJson[key] = json[key];
        }
      }

      await fs.writeFile(synapsePath, JSON.stringify(orderedJson, null, 2) + '\n', 'utf8');
    }

    return modified;
  } catch (error) {
    console.error(`Failed to normalize ${synapsePath}:`, error);
    return false;
  }
}

/**
 * Normalize all synapse files in a directory (typically .github/skills)
 */
export async function normalizeAllSynapses(skillsDir: string): Promise<{ normalized: number; total: number }> {
  let normalized = 0;
  let total = 0;

  try {
    const skillDirs = await fs.readdir(skillsDir, { withFileTypes: true });
    
    for (const entry of skillDirs) {
      if (!entry.isDirectory()) {continue;}
      
      const synapsePath = path.join(skillsDir, entry.name, 'synapses.json');
      if (await fs.pathExists(synapsePath)) {
        total++;
        const wasNormalized = await normalizeSynapseFile(synapsePath);
        if (wasNormalized) {
          normalized++;
        }
      }
    }
  } catch (error) {
    console.error('Failed to normalize synapses:', error);
  }

  return { normalized, total };
}
