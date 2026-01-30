# Skill: Skill Catalog Generator

> Generate dynamic skill catalogs with network diagrams to visualize Alex's capabilities and track learning progress.

---

## Purpose

This skill enables Alex to:

1. **Generate skill catalogs** — List all installed skills with categories, inheritance, and purposes
2. **Create network diagrams** — Mermaid flowcharts showing skill relationships
3. **Track learning progress** — Show which skills have been activated, user-created skills
4. **Post-migration reporting** — Display what skills are available after upgrade

---

## Activation Triggers

- "show my skills" / "what skills do I have"
- "skill catalog" / "generate catalog"
- "skill network" / "show skill diagram"
- "learning progress" / "what have I learned"
- Post-migration completion
- `/skills` slash command

---

## Output Format

### Catalog Structure

```markdown
# My Alex Skills

> Generated: {timestamp}
> Total Skills: {count} ({system} system, {user} user-created)

## Summary

| Category | Count | Active |
| -------- | ----- | ------ |
| 🧠 Cognitive | 8 | 6 |
| 🔧 Engineering | 7 | 7 |
| ... | ... | ... |

## Skills by Category

### 🧠 Cognitive & Learning

| Skill | Type | Status | Last Used |
| ----- | ---- | ------ | --------- |
| cognitive-load | system | ✅ active | 2026-01-30 |
| my-project-patterns | user | ✅ active | 2026-01-29 |
| ... | ... | ... | ... |

## Network Diagram

{mermaid diagram}

## User-Created Skills

| Skill | Created | Connections |
| ----- | ------- | ----------- |
| my-project-patterns | 2026-01-15 | 3 |
| team-conventions | 2026-01-20 | 1 |
```

---

## Generation Algorithm

### Step 1: Scan Skills Directory

```typescript
interface SkillInfo {
  name: string;
  category: string;
  inheritance: 'inheritable' | 'master-only' | 'heir:vscode' | 'heir:m365' | 'user';
  purpose: string;
  hasSynapses: boolean;
  connectionCount: number;
  lastModified: Date;
  isUserCreated: boolean;
}

async function scanSkills(skillsPath: string): Promise<SkillInfo[]> {
  const skills: SkillInfo[] = [];
  const folders = await fs.readdir(skillsPath);

  for (const folder of folders) {
    const skillPath = path.join(skillsPath, folder);
    const skillMd = path.join(skillPath, 'SKILL.md');
    const synapsesJson = path.join(skillPath, 'synapses.json');

    if (!await fs.pathExists(skillMd)) continue;

    const content = await fs.readFile(skillMd, 'utf8');
    const synapses = await fs.pathExists(synapsesJson)
      ? await fs.readJson(synapsesJson)
      : null;

    skills.push({
      name: folder,
      category: extractCategory(content),
      inheritance: extractInheritance(content, synapses),
      purpose: extractPurpose(content),
      hasSynapses: !!synapses,
      connectionCount: synapses ? Object.keys(synapses.connections || {}).length : 0,
      lastModified: (await fs.stat(skillMd)).mtime,
      isUserCreated: !SYSTEM_SKILLS.includes(folder),
    });
  }

  return skills;
}
```

### Step 2: Categorize Skills

```typescript
const CATEGORIES = {
  'cognitive': { emoji: '🧠', skills: ['cognitive-load', 'learning-psychology', 'appropriate-reliance', 'bootstrap-learning', 'meditation', 'meditation-facilitation', 'knowledge-synthesis', 'global-knowledge'] },
  'engineering': { emoji: '🔧', skills: ['testing-strategies', 'refactoring-patterns', 'debugging-patterns', 'code-review', 'git-workflow', 'project-scaffolding', 'vscode-environment'] },
  'operations': { emoji: '🚨', skills: ['error-recovery-patterns', 'root-cause-analysis', 'incident-response', 'release-preflight'] },
  'security': { emoji: '🔐', skills: ['privacy-responsible-ai', 'microsoft-sfi'] },
  'documentation': { emoji: '📝', skills: ['writing-publication', 'markdown-mermaid', 'lint-clean-markdown', 'ascii-art-alignment', 'llm-model-selection'] },
  'visual': { emoji: '🎨', skills: ['svg-graphics', 'image-handling'] },
  'architecture': { emoji: '🏗️', skills: ['architecture-refinement', 'architecture-health', 'self-actualization', 'heir-curation'] },
  'vscode': { emoji: '💻', skills: ['vscode-extension-patterns', 'chat-participant-patterns'] },
  'm365': { emoji: '☁️', skills: ['m365-agent-debugging', 'teams-app-patterns'] },
  'user': { emoji: '👤', skills: [] },  // Dynamically populated
};
```

### Step 3: Generate Mermaid Diagram

```typescript
function generateNetworkDiagram(skills: SkillInfo[]): string {
  const lines: string[] = [
    '```mermaid',
    "%%{init: {'theme': 'base', 'themeVariables': { 'lineColor': '#666', 'primaryColor': '#e8f4f8'}}}%%",
    'flowchart LR',
  ];

  // Group by category
  for (const [category, config] of Object.entries(CATEGORIES)) {
    const categorySkills = skills.filter(s => config.skills.includes(s.name) || (category === 'user' && s.isUserCreated));
    if (categorySkills.length === 0) continue;

    lines.push(`    subgraph ${capitalize(category)}["${config.emoji} ${capitalize(category)}"]`);
    for (const skill of categorySkills) {
      const abbrev = toAbbreviation(skill.name);
      lines.push(`        ${abbrev}[${skill.name}]`);
    }
    lines.push('    end');
  }

  // Add connections from synapses
  for (const skill of skills) {
    if (!skill.hasSynapses) continue;
    const synapses = loadSynapses(skill.name);
    for (const [target, data] of Object.entries(synapses.connections)) {
      const sourceAbbrev = toAbbreviation(skill.name);
      const targetAbbrev = toAbbreviation(target);
      const weight = data.weight || 0.5;
      const arrow = weight > 0.7 ? '-->' : '-.->';
      lines.push(`    ${sourceAbbrev} ${arrow} ${targetAbbrev}`);
    }
  }

  // Add styling
  lines.push('    %% Styling');
  lines.push('    classDef user fill:#e6ffe6,stroke:#2da02d');
  lines.push('    classDef system fill:#fff,stroke:#666');

  const userSkillAbbrevs = skills.filter(s => s.isUserCreated).map(s => toAbbreviation(s.name));
  if (userSkillAbbrevs.length > 0) {
    lines.push(`    class ${userSkillAbbrevs.join(',')} user`);
  }

  lines.push('```');

  return lines.join('\n');
}
```

### Step 4: Generate Full Catalog

```typescript
async function generateSkillCatalog(rootPath: string): Promise<string> {
  const skillsPath = path.join(rootPath, '.github', 'skills');
  const skills = await scanSkills(skillsPath);

  const systemSkills = skills.filter(s => !s.isUserCreated);
  const userSkills = skills.filter(s => s.isUserCreated);

  const catalog = `# My Alex Skills

> Generated: ${new Date().toISOString().split('T')[0]}
> Total Skills: ${skills.length} (${systemSkills.length} system, ${userSkills.length} user-created)

## Summary

| Category | Count |
| -------- | ----- |
${generateCategorySummary(skills)}

## Skills by Category

${generateSkillTables(skills)}

## Network Diagram

${generateNetworkDiagram(skills)}

${userSkills.length > 0 ? generateUserSkillsSection(userSkills) : ''}

---

*Catalog generated by Alex Skill Catalog Generator*
`;

  return catalog;
}
```

---

## VS Code Integration

### Command: `Alex: Show Skill Catalog`

```typescript
vscode.commands.registerCommand('alex.showSkillCatalog', async () => {
  const rootPath = getWorkspaceRoot();
  const catalog = await generateSkillCatalog(rootPath);

  // Create virtual document
  const uri = vscode.Uri.parse('alex-catalog://skills/catalog.md');
  const doc = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(doc, { preview: true });

  // Or save to file
  const catalogPath = path.join(rootPath, '.github', 'SKILL-CATALOG.md');
  await fs.writeFile(catalogPath, catalog);

  vscode.window.showInformationMessage(
    `Skill catalog generated with ${skills.length} skills`,
    'Open Catalog'
  ).then(choice => {
    if (choice === 'Open Catalog') {
      vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(catalogPath));
    }
  });
});
```

### Post-Migration Hook

```typescript
// In migration completion
async function showPostMigrationCatalog(rootPath: string, migrationReport: MigrationReport) {
  const catalog = await generateSkillCatalog(rootPath);

  // Add migration-specific header
  const header = `# 🎉 Migration Complete!

## What Was Migrated

- **Skills restored:** ${migrationReport.skills.length}
- **Domain knowledge:** ${migrationReport.dk.length} files
- **User profile:** ${migrationReport.profileRestored ? '✅' : '❌'}

---

`;

  const fullCatalog = header + catalog;
  await showCatalogDocument(fullCatalog);
}
```

---

## User-Created Skills Tracking

### Identifying User Skills

A skill is user-created if:

1. Not in the `SYSTEM_SKILLS` list (shipped with extension)
2. Or has `"userCreated": true` in synapses.json
3. Or was created after initial installation (compare to manifest)

### Learning Progress Metrics

```typescript
interface LearningProgress {
  totalSkills: number;
  systemSkills: number;
  userSkills: number;
  skillsWithConnections: number;
  totalConnections: number;
  mostConnectedSkill: string;
  recentlyUsedSkills: string[];  // From episodic records
  suggestedNextSkills: string[]; // Based on current connections
}
```

---

## Output Locations

| Trigger | Output |
| ------- | ------ |
| Command | Preview in VS Code |
| Slash command | Chat response |
| Post-migration | Modal + saved file |
| `/skills` | Inline in chat |

---

## Related Skills

- `markdown-mermaid` — Diagram generation
- `architecture-health` — Skill validation
- `knowledge-synthesis` — Pattern extraction

---

## Inheritance

**Inheritable** — All heirs can generate catalogs for their installed skills.
