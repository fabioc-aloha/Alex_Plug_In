---
description: "Markdown to Word document conversion with diagram support"
---

# Markdown to Word — Auto-Loaded Rules

Key features, sizing algorithm, table styling, quality checklist, troubleshooting → see md-to-word skill.

## Auto-Activation

When user requests Word export (`/word`, "convert to word", "export docx"):

1. **Use the muscle script**: `.github/muscles/md-to-word.cjs`
2. **Do NOT manually run pandoc** — the script handles everything

```bash
node .github/muscles/md-to-word.cjs SOURCE.md [OUTPUT.docx]
```
| mmdc not found | `npm install -g @mermaid-js/mermaid-cli` |
| jszip not found | Ensure NODE_PATH includes extension node_modules |
| Diagrams distorted | Update to v2.0.0 (aspect ratio fix) |
| Lists merged | Update to v2.0.0 (markdown preprocessing) |
