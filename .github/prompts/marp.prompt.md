---
mode: agent
description: Create Marp presentation slides from content with Alex branding
---

# Marp Presentation Generator

Convert your content into professional Marp presentation slides, ready for export to PDF, PPTX, or HTML.

## Output Format

Generate a Marp markdown file with the following structure:

```markdown
---
marp: true
theme: alex
paginate: true
header: '![w:50](./assets/alex-logo-40p.png)'
footer: '© 2026 Alex Cognitive Architecture'
---

<!-- _class: title -->
# {PRESENTATION_TITLE}

{Subtitle or tagline}

---

<!-- _paginate: false -->
## Agenda

1. {Topic 1}
2. {Topic 2}
3. {Topic 3}
4. {Topic 4}

---

# {Section Title}

![bg left:40%](./path/to/image.png)

- Key point one
- Key point two
- Key point three

---

<!-- _class: split -->
# {Two-Column Title}

<div class="columns">
<div>

### Left Column
- Point A
- Point B

</div>
<div>

### Right Column
- Point C
- Point D

</div>
</div>

---

<!-- _class: cta -->
# Call to Action

{Clear next step for audience}

**{Contact or URL}**
```

## Alex Brand Theme

Use this CSS for consistent Alex branding:

```css
/* Alex Brand Marp Theme */
@import 'default';

section {
  background: #ffffff;
  color: #1f2328;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

section.title {
  background: #0550ae;
  color: #ffffff;
}

section.title h1 {
  font-size: 3em;
  color: #ffffff;
}

section.cta {
  background: linear-gradient(135deg, #0550ae 0%, #6639ba 100%);
  color: #ffffff;
  text-align: center;
}

h1 {
  color: #0550ae;
  border-bottom: 3px solid #1a7f37;
  padding-bottom: 0.3em;
}

h2 {
  color: #6639ba;
}

.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2em;
}

code {
  background: #f6f8fa;
  color: #0550ae;
}

blockquote {
  border-left: 4px solid #6639ba;
  background: #f6f8fa;
}

/* Chart colors */
:root {
  --alex-blue: #0550ae;
  --alex-green: #1a7f37;
  --alex-purple: #6639ba;
  --alex-gold: #9a6700;
  --alex-bronze: #953800;
}
```

## Generation Guidelines

### Slide Structure
- **Title slide**: Presentation name, subtitle, date
- **Agenda**: 4-6 items maximum
- **Content slides**: One main idea per slide
- **Section dividers**: Use purple/gradient backgrounds
- **Call-to-action**: Always end with clear next step

### Visual Elements
- Use `![bg left:40%]` for left-aligned background images
- Use `![bg right:40%]` for right-aligned background images
- Use `![bg contain]` for fullscreen images
- Use speaker notes with `<!-- Speaker notes: ... -->`

### Best Practices
1. **5-7 bullets maximum** per content slide
2. **Use whitespace** - don't overcrowd
3. **One insight per slide** - clear titles that state the takeaway
4. **Progressive disclosure** - build complex ideas across multiple slides
5. **Include S.T.A.R. moments** - memorable visuals or comparisons

## Export Commands

```bash
# PDF export
npx @marp-team/marp-cli presentation.md -o presentation.pdf

# PPTX export (for editing)
npx @marp-team/marp-cli presentation.md -o presentation.pptx

# HTML export (for web)
npx @marp-team/marp-cli presentation.md -o presentation.html

# Watch mode during development
npx @marp-team/marp-cli -w presentation.md
```

## Instructions

When generating a Marp presentation:

1. Ask about the **audience** and **goal** if not specified
2. Structure content using the **Duarte sparkline** (what is → what could be)
3. Apply **Alex brand colors** (blue #0550ae, green #1a7f37, purple #6639ba)
4. Include **speaker notes** for key slides
5. Save as `.md` file in the workspace with suggested export commands
