# Office Document Integration

**Domain**: Microsoft Office Add-ins, document manipulation, Office.js API
**Platform**: M365 Heir (Word, Excel, PowerPoint, Outlook)
**Integration**: Unified manifest with M365 Copilot declarative agent

## What This Skill Covers

Cross-platform document capabilities that bridge VS Code Alex skills with Office applications:

- **Task pane UI**: Persistent sidebar interface in Office apps
- **OneDrive memory access**: Read/write profile.md, notes.md, focus-trifectas.md
- **Document manipulation**: Insert content, format text, create visualizations
- **Host detection**: Adapt behavior for Word/Excel/PowerPoint/Outlook
- **Office.js API**: Platform-native document operations

## When to Activate

- User working in Word, Excel, PowerPoint, or Outlook
- Request to insert, format, or analyze document content
- Memory context needed for Office document creation
- Cross-platform workflow (chat in Teams → create in Office)

## Core Capabilities

### Document Content Insertion

**Word**:
- Insert markdown-formatted text as styled paragraphs
- Apply heading styles, lists, tables
- Insert Mermaid diagrams (converted to images)

**Excel**:
- Create charts from learning goal data
- Insert formulas for progress tracking
- Format tables with Alex branding

**PowerPoint**:
- Generate slides from focus trifectas
- Insert visual diagrams
- Apply consistent theme

**Outlook**:
- Draft emails with memory context
- Suggest responses based on past notes

### Memory Synergy

All Office apps access the same OneDrive memory as Teams/M365 Copilot:

```
OneDrive/Alex-Memory/
├── profile.md          # User identity, role, goals
├── notes.md            # Session notes, learnings
├── focus-trifectas.md  # Current learning focus
└── knowledge/          # Domain knowledge files
    └── DK-*.md
```

This ensures consistent personality across all M365 surfaces.

## Integration Points

**VS Code Skills → Office**:
- `markdown-mermaid` → Word/PowerPoint diagram insertion
- `svg-graphics` → PowerPoint visual elements
- `persona-detection` → Document template selection
- `knowledge-synthesis` → Excel data analysis

**Office → VS Code Skills**:
- Document content → bootstrap-learning for domain research
- Email context → incident-response for urgent issues
- Spreadsheet data → testing-strategies for test case generation

## Technical Implementation

### Office.js API Patterns

**Initialization**:
```javascript
Office.onReady((info) => {
  // info.host: Word, Excel, PowerPoint, Outlook
  // info.platform: PC, Mac, iOS, web
  initializeForHost(info.host);
});
```

**Content Insertion** (Word example):
```javascript
await Word.run(async (context) => {
  const body = context.document.body;
  body.insertParagraph(text, Word.InsertLocation.end);
  await context.sync();
});
```

**Memory Access** (Microsoft Graph):
```javascript
const profileContent = await graphClient
  .api('/me/drive/root:/Alex-Memory/profile.md:/content')
  .get();
```

## Limitations

- **Web-hosted only**: No offline mode (requires internet)
- **No direct file system**: Must use OneDrive/SharePoint
- **Limited LLM context**: Cannot load full VS Code extension skills
- **Async operations**: All Office.js calls return Promises

## Success Metrics

- Seamless workflow continuity from Teams → Office
- Consistent memory access across all M365 apps
- Natural integration with VS Code skill patterns
- User perceives "one Alex" across platforms

## Resources

- [Office.js API Reference](https://learn.microsoft.com/javascript/api/office)
- [Unified Manifest Documentation](https://learn.microsoft.com/office/dev/add-ins/develop/unified-manifest-overview)
- [platforms/m365-copilot/OFFICE-ADDINS-README.md](../../OFFICE-ADDINS-README.md)
- [alex_docs/decisions/ADR-011-office-addins-m365-integration.md](../../../alex_docs/decisions/ADR-011-office-addins-m365-integration.md)
