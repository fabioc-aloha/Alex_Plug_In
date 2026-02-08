# PPTX Generation Knowledge

> Generate professional PowerPoint presentations using CodeInterpreter (python-pptx)

---

## File Delivery Rule (CRITICAL)

**NEVER use CodeInterpreter sandbox download links** — they break for users!

✅ **CORRECT**: Save to OneDrive/Alex-Files/
```python
# Save presentation to OneDrive for user access
prs.save('/mnt/user-data/Alex-Files/presentation-name.pptx')
```

❌ **WRONG**: Using sandbox file links like `【filename-xxxxx】`

Tell user: "Done! I saved [filename] to your OneDrive in the Alex-Files folder."

---

## Quick Start Template

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RgbColor
from pptx.enum.text import PP_ALIGN

prs = Presentation()
prs.slide_width = Inches(13.333)  # 16:9 widescreen
prs.slide_height = Inches(7.5)

# Title slide
slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
title = slide.shapes.add_textbox(Inches(0.5), Inches(2.5), Inches(12), Inches(1.5))
tf = title.text_frame
tf.paragraphs[0].text = "Presentation Title"
tf.paragraphs[0].font.size = Pt(44)
tf.paragraphs[0].font.bold = True
tf.paragraphs[0].alignment = PP_ALIGN.CENTER

prs.save('/mnt/user-data/Alex-Files/my-presentation.pptx')
```

---

## Slide Types

### Title Slide
```python
slide = prs.slides.add_slide(prs.slide_layouts[6])
# Large centered title + smaller subtitle
```

### Content Slide (Bullets)
```python
slide = prs.slides.add_slide(prs.slide_layouts[6])

# Title
title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(12), Inches(0.8))
title_box.text_frame.paragraphs[0].text = "Slide Title"
title_box.text_frame.paragraphs[0].font.size = Pt(32)
title_box.text_frame.paragraphs[0].font.bold = True

# Bullets
content_box = slide.shapes.add_textbox(Inches(0.75), Inches(1.3), Inches(11.5), Inches(5.5))
tf = content_box.text_frame
tf.word_wrap = True

bullets = ["First point", "Second point", "Third point"]
for i, bullet in enumerate(bullets):
    if i == 0:
        tf.paragraphs[0].text = bullet
        tf.paragraphs[0].font.size = Pt(24)
    else:
        p = tf.add_paragraph()
        p.text = bullet
        p.font.size = Pt(24)
        p.level = 0
```

### Section Divider
```python
slide = prs.slides.add_slide(prs.slide_layouts[6])
# Centered large text, optionally with colored background
shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
shape.fill.solid()
shape.fill.fore_color.rgb = RgbColor(0x0d, 0x69, 0xda)  # Blue
shape.line.fill.background()
# White text on blue background
```

### Chart Slide
```python
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE

slide = prs.slides.add_slide(prs.slide_layouts[6])

chart_data = CategoryChartData()
chart_data.categories = ['Q1', 'Q2', 'Q3', 'Q4']
chart_data.add_series('Revenue', (120, 145, 160, 180))

x, y, cx, cy = Inches(1), Inches(1.5), Inches(10), Inches(5)
chart = slide.shapes.add_chart(
    XL_CHART_TYPE.COLUMN_CLUSTERED, x, y, cx, cy, chart_data
).chart
```

### Table Slide
```python
slide = prs.slides.add_slide(prs.slide_layouts[6])

rows, cols = 4, 3
left, top, width, height = Inches(1), Inches(1.5), Inches(10), Inches(3)
table = slide.shapes.add_table(rows, cols, left, top, width, height).table

# Set header row
for col, text in enumerate(['Name', 'Role', 'Status']):
    cell = table.cell(0, col)
    cell.text = text
    cell.text_frame.paragraphs[0].font.bold = True

# Fill data
data = [
    ['Alice', 'Developer', 'Active'],
    ['Bob', 'Designer', 'On Leave'],
    ['Carol', 'PM', 'Active']
]
for row_idx, row_data in enumerate(data, start=1):
    for col_idx, cell_text in enumerate(row_data):
        table.cell(row_idx, col_idx).text = cell_text
```

---

## Markdown to Slides Conversion

Parse markdown structure:
- `# Heading` → Title slide
- `## Heading` → Content slide title
- `- bullet` → Bullet point
- `> blockquote` → Speaker notes
- `---` → New slide
- `[section]` suffix → Section divider slide

```python
def parse_markdown_to_slides(md_text):
    slides = []
    current_slide = None

    for line in md_text.strip().split('\n'):
        if line.startswith('# '):
            current_slide = {'type': 'title', 'title': line[2:].strip()}
            slides.append(current_slide)
        elif line.startswith('## '):
            title = line[3:].strip()
            if '[section]' in title:
                current_slide = {'type': 'section', 'title': title.replace('[section]', '').strip()}
            else:
                current_slide = {'type': 'content', 'title': title, 'bullets': [], 'notes': ''}
            slides.append(current_slide)
        elif line.startswith('- ') and current_slide:
            if 'bullets' in current_slide:
                current_slide['bullets'].append(line[2:].strip())
        elif line.startswith('> ') and current_slide:
            if 'notes' in current_slide:
                current_slide['notes'] += line[2:].strip() + '\n'
        elif line.strip() == '---':
            current_slide = None

    return slides
```

---

## Alex Brand Colors (Optional)

Use professional colors that work in both light and dark projector settings:

| Name   | Hex       | RGB             | Use For                   |
| ------ | --------- | --------------- | ------------------------- |
| Blue   | `#0d69da` | (13, 105, 218)  | Headers, emphasis         |
| Green  | `#1a7f37` | (26, 127, 55)   | Success, positive metrics |
| Purple | `#6639ba` | (102, 57, 186)  | Accent, highlights        |
| Gold   | `#9a6700` | (154, 103, 0)   | Warnings, attention       |
| Gray   | `#24292f` | (36, 41, 47)    | Body text                 |
| Light  | `#f6f8fa` | (246, 248, 250) | Backgrounds               |

---

## Best Practices

1. **Keep it simple** — 3-5 bullets per slide max
2. **Use visual hierarchy** — Title > Subtitle > Content
3. **Consistent fonts** — Stick to system fonts (Calibri, Arial, Segoe UI)
4. **High contrast** — Dark text on light, or light text on dark
5. **Charts over tables** — Visualize when possible
6. **Speaker notes** — Include context the speaker needs
7. **File naming** — Descriptive: `Q4-2026-review.pptx` not `presentation.pptx`

---

## Common Requests & Responses

| User Says                         | Alex Does                             |
| --------------------------------- | ------------------------------------- |
| "Create a presentation about X"   | Generate full deck, save to OneDrive  |
| "Convert this markdown to slides" | Parse markdown, generate PPTX         |
| "Add a chart showing Y"           | Use appropriate chart type for data   |
| "Make it look professional"       | Apply consistent styles, brand colors |
| "Make a 5-slide deck"             | Title + 3 content + closing slide     |

---

*For VS Code users: Alex also supports PptxGenJS with richer templates via the `@alex /pptx` command.*
