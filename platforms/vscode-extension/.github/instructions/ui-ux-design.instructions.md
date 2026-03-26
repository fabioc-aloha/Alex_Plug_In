---
description: "UI/UX accessibility compliance and design system consistency for UI code"
applyTo: "**/*.{html,jsx,tsx,vue,svelte,css,scss}"
---

# UI/UX Design — Enforcement Rules

WCAG Level AA mandatory, AAA aspirational. Deep reference: `.github/skills/ui-ux-design/SKILL.md`

## Hard Limits

| Property | Minimum | Recommended |
|----------|---------|-------------|
| Font size | 11px (WCAG) | 14px body, 12px secondary |
| Touch target | 36px compact | 44×44px (48×48 primary) |
| Text contrast | 4.5:1 normal, 3:1 large | — |
| UI component contrast | 3:1 | — |
| Target spacing | 8px between interactives | — |
| Line height | 1.2 headings | 1.4-1.6 body |

## Spacing: 8px Grid

Use multiples: 4, 8, 12, 16, 24, 32, 48, 64. Reject arbitrary values (7, 13, 21, 27).

## Mandatory Patterns

- **Semantic HTML first**: `<button>` not `<div onclick>`, `<nav>/<main>/<aside>/<footer>` for structure
- **Icon buttons**: require `aria-label`
- **Focus indicators**: `:focus-visible` with 2px outline on all interactives
- **Keyboard**: all interactives reachable via Tab, activated via Enter/Space
- **Color-blind safety**: never color-only — add icons (✓/⚠/✗) or text labels
- **VS Code extensions**: use `var(--vscode-foreground)`, `var(--vscode-button-background)`, etc. — no hardcoded colors
- **CSP**: no inline `style=""` attributes in webviews

## Auto-Flag on Review

P0: font <11px, missing aria-label, clickable div without keyboard
P1: hardcoded colors, touch target <36px, color-only indicators, missing focus-visible
P2: arbitrary spacing, non-semantic HTML, low contrast

## Iterative Refinement

Reduce spacing/fonts in passes: large spacing first, body text last. Verify accessibility limits after each pass. Optimal scales are discovered empirically — don't assume first attempt is final.

## Routing

- Comprehensive patterns, ARIA examples, design tokens → load `ui-ux-design` skill
- Full UI audit procedure → `/ui-ux-audit` prompt
- Extension UI patterns → `vscode-extension-patterns` skill
