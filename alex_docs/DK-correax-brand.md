# DK — CorreaX Brand & Design Language

> **Domain Knowledge** — CorreaX visual identity, design tokens, and component patterns.
> Authoritative reference for all CorreaX products: LearnAlex website, Alex VS Code extension,
> AIRS platform, books, marketing materials, and any future interface.
>
> Canonical source: `c:\Development\AlexLearn\DK-correax-brand.md`
> Derived from: Live production site at learnalexai.com
> Last updated: February 28, 2026

---

## 1. Brand Identity

### The CorreaX brand family

| Product | Domain | Tagline |
|---------|--------|---------|
| **CorreaX** (parent) | correax.com | AI Research & Product Studio |
| **LearnAlex** | learnalexai.com | Learn AI With the AI That Learns With You |
| **AIRS** | airs.correax.com | AI Readiness Assessment |
| **Alex Extension** | VS Code Marketplace | fabioc-aloha.alex-cognitive-architecture |
| **Alex Finch Books** | Amazon | The Alex Finch Library |

### Brand voice
- **Curious, not pushy.** Invites exploration rather than demanding action.
- **Confident, not arrogant.** States capabilities clearly without overselling.
- **Warm, not corporate.** One person built this. The voice reflects that.
- **Specific, not vague.** Numbers, examples, actual outcomes.

### Name conventions
- Always **Alex** (not "Alex AI", not "ALEX" unless in caps label context)
- Always **CorreaX** (capital C, capital X, no space)
- Always **LearnAlex** (one word, capital L and A)
- Always **AIRS** (all caps — it's an acronym)

---

## 2. Color System

### Core palette

```css
/* Background */
--bg:          #0f172a;   /* Page background — deep navy */
--bg-card:     #1e293b;   /* Card, nav, header backgrounds */
--bg-hover:    #253047;   /* Interactive hover state */

/* Text */
--text:        #f1f5f9;   /* Primary text — near white */
--text-muted:  #94a3b8;   /* Secondary text — slate */
--text-dim:    #8a9ab0;   /* Tertiary text — slightly lighter muted */

/* Borders */
--border:      #334155;   /* Default border — passes WCAG AA on all bg colors */

/* Accent colors — the brand palette */
--accent-indigo:       #6366f1;   /* PRIMARY — buttons, CTAs, default accent */
--accent-teal:         #0d9488;   /* SECONDARY — study guides, AIRS teal contexts */
--accent-rose:         #f43f5e;   /* TERTIARY — warnings, destructive, energy */
--accent-coral:        #f97316;   /* QUATERNARY — highlights, warm contexts */

/* Light variants — use for text on dark backgrounds */
--accent-indigo-light: #818cf8;   /* Indigo on dark bg — 4.5:1 contrast on --bg-card */
--accent-teal-light:   #2dd4bf;   /* Teal on dark bg */
--accent-rose-light:   #fb7185;   /* Rose on dark bg */
--accent-coral-light:  #fb923c;   /* Coral on dark bg */

/* Semantic */
--success:     #22c55e;   /* Success states */
--code-bg:     #0d1526;   /* Code block background — slightly darker than --bg */

/* Radius */
--radius:      8px;       /* Default border radius */
```

### Accent assignment rules

| Context | Accent |
|---------|--------|
| Primary CTAs, nav active states, default links | indigo / `#6366f1` |
| Study guides, AIRS content, learning materials | teal / `#0d9488` |
| Errors, alerts, energy moments | rose / `#f43f5e` |
| Warm highlights, callouts | coral / `#f97316` |
| Series label eyebrows on teal pages | teal-light / `#2dd4bf` |
| Series label eyebrows on indigo pages | indigo-light / `#818cf8` |

### Contrast compliance notes
- `--text-muted` `#94a3b8` → 4.6:1 on `--bg-card` `#1e293b` ✅ WCAG AA
- `--accent-indigo-light` `#818cf8` → 4.5:1 on `--bg-card` ✅ WCAG AA
- `--accent-teal-light` `#2dd4bf` → 7.0:1 on `--bg-card` ✅ WCAG AAA
- Never use `--accent-indigo` `#6366f1` as text on `--bg-card` (fails AA at 10px)

### VS Code extension color mapping

When building VS Code webviews, CorreaX colors map to these VS Code tokens as fallbacks:

| CorreaX token | VS Code equivalent |
|---------------|--------------------|
| `--bg` | `--vscode-sideBar-background` |
| `--bg-card` | `--vscode-editor-widget-background` |
| `--text` | `--vscode-foreground` |
| `--text-muted` | `--vscode-descriptionForeground` |
| `--border` | `--vscode-panel-border` |
| `--accent-indigo` | `--vscode-button-background` |
| `--accent-indigo-light` | `--vscode-textLink-foreground` |

---

## 3. Typography

### Font stack
```css
font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
```
VS Code webviews: use `var(--vscode-font-family)` instead of hardcoding.

### Type scale

| Use | Size | Weight | Color |
|-----|------|--------|-------|
| Page H1 (banner) | 2.25rem | 300 (light) | `--text` |
| Section H2 | 1.35rem | 600 | `--text` |
| Section H3 | 1.1rem | 600 | `--accent-indigo-light` |
| Body | 0.9rem | 400 | `--text-muted` |
| Lead paragraph | 1rem–1.15rem | 400 | `--text-muted` |
| Small / meta | 0.75rem–0.825rem | 400–600 | `--text-dim` |
| Eyebrow label | 0.72rem | 700 | `--accent-indigo-light` |
| Series label (banner) | 10px | 600 | `--accent-indigo-light` |

### Series label (eyebrow) treatment
```css
font-size: 10px;
font-weight: 600;
letter-spacing: 5px;      /* Very wide — creates the cinematic look */
text-transform: uppercase;
color: var(--accent-indigo-light);
margin-bottom: 0.75rem;
```
On teal pages: use `--accent-teal-light` instead.

---

## 4. The Banner (Page Header) — Signature Design Element

This is the signature CorreaX UI component. Used on every content page of LearnAlex and recommended for all CorreaX product interfaces.

### Visual anatomy

```
┌─────────────────────────────────────────────────────┐
│ █ ALEX WORKSHOP SERIES                          ALEX │
│   Page Title Here                                    │
│   Subtitle text — descriptive phrase                 │
└─────────────────────────────────────────────────────┘
 ^                                               ^
 4px left accent bar                     ghost watermark
```

### CSS implementation

```css
.page-header {
    background: var(--bg-card);               /* #1e293b */
    border-bottom: 1px solid var(--border);   /* #334155 */
    padding: 3rem 2rem 2.5rem;
    position: relative;
    overflow: hidden;
}

/* Ghost watermark — "ALEX" faintly on the right */
.page-header::before {
    content: 'ALEX';
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 130px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.03);         /* 3% opacity — visible only on themes */
    pointer-events: none;
    line-height: 1;
}

/* Left 4px accent bar */
.page-header .accent-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--accent-indigo);         /* override with teal/coral/rose for themed pages */
}

/* On teal pages */
.page-header.teal .accent-bar {
    background: var(--accent-teal);
}

/* Series label (eyebrow) */
.page-header .series-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 5px;
    color: var(--accent-indigo-light);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
}

.page-header.teal .series-label {
    color: var(--accent-teal-light);
}

/* H1 title */
.page-header h1 {
    font-size: 2.25rem;
    font-weight: 300;                         /* Light weight — elegant, not bold */
    color: var(--text);
    margin: 0 0 0.4rem;
    max-width: 820px;
}

/* Subtitle */
.page-header .subtitle {
    font-size: 0.875rem;
    color: var(--text-muted);
    letter-spacing: 0.03em;
}
```

### Astro/HTML usage pattern

```astro
<Layout
  title="Page Title"
  seriesLabel="ALEX WORKSHOP SERIES"
  subtitle="Short descriptive phrase"
  accent="indigo"
>
  <div class="prose">
    <!-- content -->
  </div>
</Layout>
```

`accent` options: `"indigo"` (default) | `"teal"` | `"coral"` | `"rose"`

### VS Code webview adaptation

In a VS Code sidebar webview, the banner adapts to the VS Code color scheme:

```html
<div class="page-header" style="position: relative; overflow: hidden; background: var(--vscode-editor-widget-background); border-bottom: 1px solid var(--vscode-panel-border); padding: 14px 10px 12px 16px; margin-bottom: 10px;">
    <div class="header-accent-bar" style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--persona-accent);"></div>
    <div class="header-watermark" style="position: absolute; right: -4px; top: 50%; transform: translateY(-60%); font-size: 60px; font-weight: 700; color: rgba(255,255,255,0.03); pointer-events: none; user-select: none; line-height: 1;">ALEX</div>
    <div style="font-size: 9px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: var(--persona-accent); opacity: 0.85; margin-bottom: 4px;">ALEX COGNITIVE</div>
    <div style="font-size: 15px; font-weight: 300; color: var(--vscode-foreground);">Title Here</div>
    <div style="font-size: 11px; color: var(--vscode-descriptionForeground);">Subtitle here</div>
</div>
```

---

## 5. Navigation

### Sticky top nav
```css
.site-nav {
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    height: 56px;
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 0 2rem;
}
```

### Logo treatment
```
LEARN<span style="color: var(--accent-indigo-light)">ALEX</span>
```
Letter spacing: `0.1em`. Weight: 700.

### Nav links
- Default: `color: --text-muted`, no underline
- Active / hover: `color: --text`, 2px `--accent-indigo` bottom border
- Special "highlight" item (e.g. Job Seekers): `--accent-indigo` background pill
- Facilitator link: coral color treatment

---

## 6. Cards

```css
.card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.1rem 1.25rem;
}

/* Accent left-border card */
.card-accent {
    border-left: 3px solid var(--accent-indigo);
    border-top: none;
    border-right: none;
    border-bottom: none;
    background: var(--bg-card);
    border-radius: 0 8px 8px 0;
    padding: 0.75rem 1rem;
}
```

---

## 7. Buttons & CTAs

```css
/* Primary CTA */
.cta-primary {
    background: var(--accent-indigo);
    color: #fff;
    padding: 0.65rem 1.4rem;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    transition: background 0.15s;
}
.cta-primary:hover {
    background: var(--accent-indigo-light);
    color: #0f172a;
}

/* Secondary — text link style */
.cta-secondary {
    font-size: 0.875rem;
    color: var(--accent-indigo-light);
    text-decoration: none;
    font-weight: 600;
}

/* Ghost — subtle underlined */
.cta-ghost {
    font-size: 0.875rem;
    color: var(--text-muted);
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: var(--border);
}
```

---

## 8. Prose Content Area

Used for all text-heavy content pages (handout, AIRS, setup guide, about, etc.):

```css
.prose {
    max-width: 820px;
    margin: 0 auto;
}

/* h2 gets a top border for section separation */
.prose h2 {
    font-size: 1.35rem;
    font-weight: 600;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
    margin: 2.5rem 0 0.75rem;
}

/* h3 uses accent color */
.prose h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent-indigo-light);
    margin: 1.75rem 0 0.5rem;
}

/* Links */
.prose a {
    color: var(--accent-indigo-light);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.15s;
}
.prose a:hover {
    border-color: var(--accent-indigo-light);
}
```

Content area padding:
```css
.page-content {
    padding: 2.5rem 2rem 5rem;
}
```

---

## 9. Credential Pills

Used to display roles, qualifications, locations:
```css
.cred-pill {
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(99, 102, 241, 0.12);    /* 12% indigo */
    color: var(--accent-indigo-light);
    padding: 0.25rem 0.65rem;
    border-radius: 4px;
    white-space: nowrap;
}
```

---

## 10. Footer

```html
<footer>
  <!-- Author row: avatar + name (link) + title -->
  <!-- Legal row: copyright · Privacy Policy · Disclaimers · About CorreaX -->
</footer>
```

Footer background: `--bg-card`, border-top: `--border`.
Avatar: 72px circle, `border: 2px solid --border`.
Name link: `--accent-indigo-light`.

---

## 11. Assets

### Logos & icons

| File | Format | Use |
|------|--------|-----|
| `logo.svg` | SVG | LearnAlex nav wordmark |
| `favicon.svg` | SVG | Browser tab favicon |
| `correax.svg` | SVG | CorreaX footer logo (32×32) |
| `correax.png` | PNG | CorreaX avatar / photo placeholder |
| `apple-touch-icon.svg` | SVG | iOS home screen |

### Book covers
- `/books/bio-cover.jpg` — "The Life of Alex Finch" (nonfiction biography)
- `/books/wonderland-cover.png` — "Alex in Wonderland" (detective fiction)

### Alex avatar system
Personas have custom avatar images in subdirectories:
- `assets/avatars/personas/` — by persona id
- `assets/avatars/agents/` — for agent modes (azure, m365, etc.)
- `assets/avatars/states/` — cognitive states (debugging, meditation, etc.)
- `assets/avatars/ages/` — age-based variations

---

## 12. Mermaid Diagram Theme

Used in Markdown documentation:
```javascript
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'background': '#0f172a',
    'primaryColor': '#1e293b',
    'primaryTextColor': '#f1f5f9',
    'primaryBorderColor': '#818cf8',
    'lineColor': '#475569',
    'secondaryColor': '#1e293b',
    'secondaryBorderColor': '#2dd4bf',
    'tertiaryColor': '#1e293b',
    'fontFamily': 'Segoe UI, system-ui, sans-serif'
  }
}}%%
```

---

## 13. Persona Accent Colors (Extension)

The Alex VS Code extension uses persona-specific accent colors.
Alignment with CorreaX palette:

| Persona | Current | Target | Notes |
|---------|---------|--------|-------|
| Developer | `#0078D4` | `#0078D4` | Keep — intentional Microsoft blue |
| Academic | `#8B5CF6` | `#8B5CF6` | Keep — purple, distinct from brand |
| Researcher | `#10B981` | `#0d9488` | Align to CorreaX teal |
| Technical Writer | `#F59E0B` | `#f97316` | Align to CorreaX coral |
| Architect | `#6366F1` | `#6366f1` | Already matches! |
| Data Engineer | `#06B6D4` | `#06B6D4` | Keep — cyan, distinct from teal |

---

## 14. Implementation Checklist

When starting a new CorreaX product UI:

- [ ] Import or define all CSS custom properties from section 2
- [ ] Use `'Segoe UI', system-ui` font stack (or VS Code variable in extensions)
- [ ] All page/section headers use the banner pattern (section 4)
- [ ] Series labels use 10px / 600 weight / 5px letter-spacing / uppercase
- [ ] Page titles use 2.25rem / 300 weight (light, not bold)
- [ ] Content in `<div class="prose">` wrapper for consistent max-width
- [ ] Prose links use `--accent-indigo-light` with hover border
- [ ] Primary CTAs use `--accent-indigo` background, `font-weight: 700`
- [ ] Focus rings: `outline: 2px solid --accent-indigo-light; outline-offset: 3px`
- [ ] All interactive elements meet 44px minimum touch/click target
