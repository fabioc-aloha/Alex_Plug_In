# PowerPoint Integration

**Domain**: Microsoft PowerPoint presentation generation
**Platform**: M365 Heir — Office Add-in
**Office.js API**: `PowerPoint.run()`, Presentation/Slide object model

## Capabilities

### Focus Trifecta Slides

**Purpose**: Generate presentation from current learning focus areas

**Data Source**: `OneDrive/Alex-Memory/focus-trifectas.md`

**Slide Structure**:
1. **Title Slide**: "My Learning Journey" + Alex logo
2. **Overview Slide**: 3 trifectas (3 skill categories)
3. **Detail Slides**: 1 per trifecta (3 skills each with progress)
4. **Next Steps**: Upcoming skills, goals

**Visual Design**:
- Alex color palette (blues, greens)
- SVG icons for each skill category
- Progress bars (horizontal, branded colors)
- Mermaid diagram showing skill connections

### Architectural Diagrams

**Purpose**: Insert technical diagrams from markdown-mermaid

**Supported Types**:
- Architecture diagrams (system components)
- Flowcharts (process flows)
- Sequence diagrams (API interactions)
- Mind maps (concept relationships)

**Workflow**:
1. Generate Mermaid syntax via `markdown-mermaid` skill
2. Convert to PNG (high-DPI for projection)
3. Insert as slide image with title

### Brand-Consistent Templates

**Visual Identity**:
- Alex logo (top-right corner, white/blue versions)
- Color palette from `brand-asset-management`
- Typography: Segoe UI (headings), Calibri (body)
- Icon library: SVG icons for common concepts

**Theme Application**:
- Background: White/light blue gradient
- Accent: Alex blue (#0078D4)
- Success: Green (#10893E)
- Warning: Orange (#F7630C)

## Office.js Patterns

### Slide Creation

```javascript
await PowerPoint.run(async (context) => {
  const slides = context.presentation.slides;
  const slide = slides.add();
  
  // Add title
  const title = slide.shapes.addTextBox("My Learning Journey");
  title.left = 50;
  title.top = 30;
  title.height = 60;
  title.width = 600;
  
  await context.sync();
});
```

### Image Insertion

```javascript
await PowerPoint.run(async (context) => {
  const slide = context.presentation.slides.getItemAt(0);
  
  // Insert Alex logo
  const logo = slide.shapes.addImage(base64Logo);
  logo.left = 650;
  logo.top = 10;
  logo.height = 40;
  logo.width = 40;
  
  // Insert diagram
  const diagram = slide.shapes.addImage(base64Diagram);
  diagram.left = 100;
  diagram.top = 150;
  diagram.height = 300;
  diagram.width = 600;
  
  await context.sync();
});
```

### Shape Formatting

```javascript
await PowerPoint.run(async (context) => {
  const slide = context.presentation.slides.getItemAt(0);
  
  // Add progress bar
  const progressBar = slide.shapes.addGeometricShape(GeometricShapeType.rectangle);
  progressBar.left = 100;
  progressBar.top = 200;
  progressBar.height = 20;
  progressBar.width = 300 * progressPercent; // Dynamic width
  progressBar.fill.setSolidColor("#10893E"); // Green
  
  await context.sync();
});
```

## Integration Patterns

### VS Code Skill Connections

**svg-graphics** (Primary):
- **When**: Creating visual elements, icons
- **Yields**: SVG creation, dark mode CSS
- **Strength**: 0.85

**markdown-mermaid**:
- **When**: Adding diagrams to slides
- **Yields**: Architectural/flowchart syntax
- **Strength**: 0.8

**ui-ux-design**:
- **When**: Designing slide layout
- **Yields**: Layout principles, contrast, accessibility
- **Strength**: 0.75

**brand-asset-management**:
- **When**: Applying visual identity
- **Yields**: Logo, color palette, icon library
- **Strength**: 0.85

**persona-detection**:
- **When**: Loading focus trifectas
- **Yields**: Learning goals, skill priorities
- **Strength**: 0.7

### Memory Context Usage

**focus-trifectas.md**:
- Current 3 skill areas (trifectas)
- 3 skills per trifecta = 9 total learning goals
- Progress data for each skill

**profile.md**:
- User name for title slide personalization
- Role for context ("Developer", "Researcher")

## Use Cases

### Learning Journey Presentation

```
User: "Generate slides showing my current learning focus"
Alex Flow:
1. persona-detection → Read focus-trifectas.md
2. svg-graphics → Create category icons (Frontend, Backend, DevOps)
3. powerpoint-integration → Generate 5 slides:
   - Title: "My Learning Journey - [Name]"
   - Overview: 3 trifectas with icons
   - Detail: 3 slides (1 per trifecta) with progress bars
   - Next Steps: Upcoming skills
4. brand-asset-management → Apply logo, colors
```

### Technical Architecture Presentation

```
User: "Create slides explaining the microservices architecture"
Alex Flow:
1. markdown-mermaid → Generate architecture diagram
2. Convert to high-DPI PNG (1920x1080)
3. powerpoint-integration → Create 3 slides:
   - Title: "Microservices Architecture"
   - Diagram: Full architecture with services
   - Details: Service breakdown table
```

### Project Kickoff Deck

```
User: "Make a project kickoff presentation"
Alex Flow:
1. persona-detection → Detect project context
2. writing-publication → Structure (Goals, Timeline, Team)
3. svg-graphics → Project logo, team icons
4. powerpoint-integration → Generate deck with branded theme
```

## Advanced Features (Phase 3)

### Animation Auto-Application

```javascript
// Add entrance animation to objects
shape.addAnimation({
  type: AnimationType.fadeIn,
  duration: 0.5,
  delay: 0.2
});
```

### Speaker Notes from Memory

```javascript
// Add speaker notes from session context
slide.notesPage.shapes.placeholders.getItem("Notes").textFrame.textRange.text = 
  "Context from notes.md: Recent discussion about authentication patterns...";
```

### Smart Layout Detection

- Detect content type (text-heavy vs image-heavy)
- Auto-select layout (title + content, two-column, full image)
- Apply consistent spacing

## Limitations

**PowerPoint-Specific**:
- No direct slide master modification
- Limited animation API (basic only)
- Cannot embed live data (static snapshots)
- Transitions must be applied manually

**Design Constraints**:
- Font embedding not supported (system fonts only)
- SVG not directly supported (must convert to PNG)
- Video embedding limited to URLs (no base64)

## Resources

- [PowerPoint JavaScript API Reference](https://learn.microsoft.com/javascript/api/powerpoint)
- [Slide Design Best Practices](https://learn.microsoft.com/office/dev/add-ins/powerpoint/powerpoint-add-ins)
- [Shape Manipulation Guide](https://learn.microsoft.com/javascript/api/powerpoint/powerpoint.shape)
