// Standalone skill catalog generator — mirrors skillCatalog.ts logic
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const skillsPath = path.join(ROOT, '.github', 'skills');
const outPath = path.join(ROOT, 'platforms', 'vscode-extension', 'SKILL-CATALOG-GENERATED.md');

const STALE_PRONE = [
  'vscode-extension-patterns', 'chat-participant-patterns', 'm365-agent-debugging',
  'teams-app-patterns', 'llm-model-selection', 'git-workflow',
  'privacy-responsible-ai', 'microsoft-sfi'
];

function toAbbrev(name) {
  return name.split('-').map(w => (w[0] || '').toUpperCase()).join('');
}

// Scan skills
const skills = [];
for (const folder of fs.readdirSync(skillsPath).sort()) {
  const sp = path.join(skillsPath, folder, 'synapses.json');
  if (!fs.existsSync(sp)) continue;
  try {
    const s = JSON.parse(fs.readFileSync(sp, 'utf8'));
    let conns = [];
    if (s.connections) {
      if (Array.isArray(s.connections)) {
        conns = s.connections;
      } else {
        conns = Object.entries(s.connections).map(([t, d]) => ({
          target: t, type: d.relationship || 'enables',
          strength: d.weight || 0.5, bidirectional: d.bidirectional || false, weak: d.weak || false
        }));
      }
    }
    skills.push({
      name: folder,
      inheritance: s.inheritance || 'inheritable',
      temporary: s.temporary || false,
      removeAfter: s.removeAfter,
      connectionCount: conns.length,
      connections: conns
    });
  } catch (e) {
    console.warn('  skip:', folder, e.message);
  }
}

const byI = {
  inheritable: skills.filter(s => s.inheritance === 'inheritable' && !s.temporary).length,
  'master-only': skills.filter(s => s.inheritance === 'master-only').length,
  'heir:vscode': skills.filter(s => s.inheritance === 'heir:vscode').length,
  'heir:m365': skills.filter(s => s.inheritance === 'heir:m365').length,
  temporary: skills.filter(s => s.temporary).length
};
const totalConn = skills.reduce((s, k) => s + k.connectionCount, 0);
const bidir = skills.reduce((s, k) => s + k.connections.filter(c => c.bidirectional).length, 0);
const weak = skills.reduce((s, k) => s + k.connections.filter(c => c.weak || c.strength < 0.7).length, 0);

const today = new Date().toISOString().split('T')[0];

let md = `# Alex Skills Catalog (Generated)

> Generated: ${today}
> Total Skills: **${skills.length}** (${byI.inheritable} inheritable, ${byI['master-only']} master-only, ${byI['heir:vscode']} VS Code, ${byI['heir:m365']} M365, ${byI.temporary} temporary)
> Total Connections: **${totalConn}** (${bidir} bidirectional, ${weak} weak)

---

## Skills by Inheritance

### Inheritable (${byI.inheritable})

| Skill | Connections |
| ----- | ----------- |
`;

skills.filter(s => s.inheritance === 'inheritable' && !s.temporary)
  .forEach(s => { md += `| \`${s.name}\` | ${s.connectionCount} |\n`; });

md += `
### Master-Only (${byI['master-only']})

| Skill | Connections |
| ----- | ----------- |
`;
skills.filter(s => s.inheritance === 'master-only')
  .forEach(s => { md += `| \`${s.name}\` | ${s.connectionCount} |\n`; });

md += `
### VS Code Heir (${byI['heir:vscode']})

| Skill | Connections |
| ----- | ----------- |
`;
skills.filter(s => s.inheritance === 'heir:vscode')
  .forEach(s => { md += `| \`${s.name}\` | ${s.connectionCount} |\n`; });

md += `
### M365 Heir (${byI['heir:m365']})

| Skill | Connections |
| ----- | ----------- |
`;
skills.filter(s => s.inheritance === 'heir:m365')
  .forEach(s => { md += `| \`${s.name}\` | ${s.connectionCount} |\n`; });

if (byI.temporary > 0) {
  md += `
### Temporary (${byI.temporary})

| Skill | Connections | Remove After |
| ----- | ----------- | ------------ |
`;
  skills.filter(s => s.temporary)
    .forEach(s => { md += `| \`${s.name}\` | ${s.connectionCount} | ${s.removeAfter || 'TBD'} |\n`; });
}

md += `
---

## Staleness-Prone Skills

> These skills depend on external APIs or platforms that change frequently.

| Skill | Reason |
| ----- | ------ |
`;
STALE_PRONE.forEach(s => { md += `| \`${s}\` | Platform/API changes frequently |\n`; });

md += `
---

_Alex Cognitive Architecture — Take Your Code to New Heights_
`;

fs.writeFileSync(outPath, md);
console.log(`Done: ${skills.length} skills, ${totalConn} connections -> ${outPath}`);
