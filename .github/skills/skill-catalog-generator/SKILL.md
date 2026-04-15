---
name: skill-catalog-generator
description: Generate dynamic skill catalogs with network diagrams to visualize Alex's capabilities.
tier: extended
applyTo: '**/*catalog*,**/*skill-list*,**/*capability*'
category: architecture
---

# Skill Catalog Generator

> Generate dynamic skill catalogs with network diagrams from synapses.json connections.

---

## Purpose

1. **Generate skill catalogs** — List skills with categories, inheritance, purposes
2. **Create network diagrams** — Mermaid flowcharts showing skill relationships
3. **Track user skills** — Distinguish system vs user-created skills

---

## Activation Triggers

- "show my skills" / "what skills do I have"
- "skill catalog" / "generate catalog"
- "skill network" / "show skill diagram"
- Post-migration completion

---

## Data Model

```typescript
interface SkillInfo {
  name: string;
  category: string;        // From SKILL.md frontmatter
  inheritance: "inheritable" | "master-only" | "heir:vscode" | "heir:m365";
  purpose: string;
  connectionCount: number;
  isUserCreated: boolean;
  isTemporary: boolean;    // synapses.json "temporary": true
}

interface Connection {
  target: string;
  type: string;            // enables, applies, extends, complements
  strength: number;        // 0.0-1.0
  bidirectional?: boolean;
  weak?: boolean;
}
```

---

## Algorithm

### Step 1: Scan Skills

```typescript
async function scanSkills(skillsPath: string): Promise<SkillInfo[]> {
  const skills: SkillInfo[] = [];
  for (const folder of await fs.readdir(skillsPath)) {
    const skillMd = path.join(skillsPath, folder, "SKILL.md");
    const synapsesJson = path.join(skillsPath, folder, "synapses.json");
    if (!(await fs.pathExists(skillMd))) continue;

    const content = await fs.readFile(skillMd, "utf8");
    const synapses = await fs.pathExists(synapsesJson) 
      ? await fs.readJson(synapsesJson) : null;

    skills.push({
      name: folder,
      category: extractFrontmatter(content, "category") || "uncategorized",
      inheritance: extractFrontmatter(content, "inheritance") || "inheritable",
      purpose: extractFrontmatter(content, "description"),
      connectionCount: synapses?.connections ? Object.keys(synapses.connections).length : 0,
      isUserCreated: !SYSTEM_SKILLS.includes(folder),
      isTemporary: synapses?.temporary === true,
    });
  }
  return skills;
}
```

### Step 2: Generate Diagram

```typescript
function generateNetworkDiagram(skills: SkillInfo[]): string {
  const lines = ["```mermaid", "flowchart LR"];
  
  // Group by category (from frontmatter, not hardcoded)
  const byCategory = groupBy(skills, s => s.category);
  for (const [category, categorySkills] of Object.entries(byCategory)) {
    lines.push(`    subgraph ${category}`);
    for (const skill of categorySkills) {
      lines.push(`        ${abbrev(skill.name)}[${skill.name}]`);
    }
    lines.push("    end");
  }

  // Add connections from synapses
  for (const skill of skills.filter(s => s.connectionCount > 0)) {
    const synapses = loadSynapses(skill.name);
    const targets = Object.keys(synapses.connections).map(abbrev);
    if (targets.length === 1) {
      lines.push(`    ${abbrev(skill.name)} --> ${targets[0]}`);
    } else {
      lines.push(`    ${abbrev(skill.name)} --> ${targets.join(" & ")}`);
    }
  }

  // Styling
  lines.push("    classDef master fill:#fff3cd,stroke:#856404");
  lines.push("    classDef inheritable fill:#e0f7fa,stroke:#00838f");
  lines.push("    classDef temp fill:#f3e8ff,stroke:#7c3aed,stroke-dasharray:5 5");
  
  const masterSkills = skills.filter(s => s.inheritance === "master-only").map(s => abbrev(s.name));
  const tempSkills = skills.filter(s => s.isTemporary).map(s => abbrev(s.name));
  if (masterSkills.length) lines.push(`    class ${masterSkills.join(",")} master`);
  if (tempSkills.length) lines.push(`    class ${tempSkills.join(",")} temp`);

  lines.push("```");
  return lines.join("\n");
}
```

---

## Arrow Types

| Condition | Arrow | Meaning |
|-----------|-------|---------|
| `bidirectional: true` | `<-->` | Mutual reinforcement |
| `weak: true` OR `strength < 0.5` | `-.->` | Weak link |
| Default | `-->` | Direct dependency |

---

## Diagram Legend

| Color | Inheritance |
|-------|-------------|
| 🟨 Yellow | Master-only |
| 🧊 Cyan | Inheritable |
| 🟪 Purple (dashed) | Temporary |

---

## Output Template

```markdown
# My Alex Skills

> Generated: {date}
> Total: {count} ({system} system, {user} user-created)

## Summary

| Category | Count |
|----------|-------|
| cognitive | 8 |
| engineering | 7 |

## Skills by Category

### cognitive

| Skill | Inheritance | Connections |
|-------|-------------|-------------|
| cognitive-load | inheritable | 3 |

## Network Diagram

{mermaid}

## User-Created Skills

| Skill | Created | Connections |
|-------|---------|-------------|
| my-patterns | 2026-01-15 | 2 |
```

---

## VS Code Integration

```typescript
vscode.commands.registerCommand("alex.showSkillCatalog", async () => {
  const catalog = await generateSkillCatalog(getWorkspaceRoot());
  const catalogPath = path.join(rootPath, ".github", "SKILL-CATALOG.md");
  await fs.writeFile(catalogPath, catalog);
  vscode.commands.executeCommand("markdown.showPreview", vscode.Uri.file(catalogPath));
});
```

---

## Key Design Decisions

1. **Derive categories from frontmatter** — No hardcoded skill lists that rot
2. **Multi-target syntax** — `A --> B & C & D` reduces diagram clutter
3. **Class application required** — `classDef` alone does nothing; must `class node className`

---

## Related Skills

- [markdown-mermaid](../markdown-mermaid/SKILL.md) — Diagram generation
- [brain-qa](../brain-qa/SKILL.md) — Skill validation

---

## Inheritance

**Inheritable** — All heirs can generate catalogs.
