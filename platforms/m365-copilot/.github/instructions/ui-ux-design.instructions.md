# UI/UX Design Quality Standards

**Purpose**: Enforce accessibility compliance and design system consistency when working with UI code  
**Scope**: HTML, JSX, TSX, Vue, Svelte, and CSS files  
**WCAG Compliance**: Level AA minimum, AAA aspirational  
**Auto-loads**: When editing files matching applyTo pattern

---

## Synapses

- [.github/instructions/vscode-marketplace-publishing.instructions.md] (Medium, Precedes, Forward) - "UI polish often precedes marketplace publishing"
- [.github/instructions/release-management.instructions.md] (High, Coordinates, Bidirectional) - "UI refinements are part of release workflow"
- [.github/skills/vscode-extension-patterns/SKILL.md] (High, Implements, Bidirectional) - "Extension UI patterns this standard enforces"
- [.github/instructions/code-review-guidelines.instructions.md] (High, Validates, Bidirectional) - "Code review validates UI/UX compliance"

---

## Design System Enforcement

### Typography Standards

**Minimum Font Sizes**
- Never use font sizes below 11px (WCAG 2.1 AA requirement)
- Body text: ≥14px (default for most interfaces)
- Secondary text: ≥12px
- Legal minimum: 11px (use sparingly, mainly for labels/metadata)

**Font Weight Consistency**
- Use standard weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Avoid non-standard weights (450, 550, 650) unless font family explicitly supports them
- Progressive hierarchy: Regular body → Medium emphasis → Semibold headings → Bold highlights

**Line Height**
- Body text: 1.4-1.6 (optimal readability)
- Headings: 1.2-1.3 (tighter for visual impact)
- Dense UI: 1.3-1.4 (compact but readable)

### Spacing Standards

**8px Base System** (Recommended)
- Use multiples of 8px: 4px, 8px, 16px, 24px, 32px, 40px, 48px, 64px
- Half-increments acceptable for tight spacing: 4px, 12px, 20px
- Avoid arbitrary values: 7px, 13px, 21px, 27px

**Spacing Scale Variables**
```css
--spacing-xs: 4px;   /* Tight spacing between related items */
--spacing-sm: 8px;   /* Default gap between elements */
--spacing-md: 16px;  /* Section internal padding */
--spacing-lg: 24px;  /* Card/panel padding */
--spacing-xl: 32px;  /* Page margins, large sections */
```

**Application Rules**
- Component internal padding: `--spacing-md` or `--spacing-lg`
- Gap between components: `--spacing-sm` or `--spacing-md`
- Page margins: `--spacing-lg` or `--spacing-xl`
- Icon-text gap: `--spacing-xs` or `--spacing-sm`

### Color & Contrast

**WCAG AA Requirements** (Mandatory)
- Normal text (<18px or <14px bold): 4.5:1 contrast ratio
- Large text (≥18px or ≥14px bold): 3:1 contrast ratio
- UI components (borders, icons): 3:1 contrast ratio

**Theme-Aware Colors**
- Always use VS Code theme variables in extensions:
  - `var(--vscode-foreground)` - Primary text
  - `var(--vscode-descriptionForeground)` - Secondary text
  - `var(--vscode-button-background)` - Primary actions
  - `var(--vscode-button-secondaryBackground)` - Secondary actions
  - `var(--vscode-panel-border)` - Borders and dividers
  - `var(--vscode-focusBorder)` - Focus indicators

**Color-Blind Safety**
- Never rely on color alone to convey information
- Add icons to color-coded status indicators:
  - Success (green): ✓ checkmark icon
  - Warning (yellow/orange): ⚠ warning icon
  - Error (red): ✗ X icon or ⛔ stop icon
- Use patterns or labels as secondary indicators

### Touch Targets

**WCAG 2.1 Level AA (2.5.5)**
- Minimum size: 44×44 CSS pixels
- Applies to: Buttons, links, checkboxes, radio buttons, custom interactive elements
- Recommended: 48×48px for primary actions
- **Practical minimum for compact UIs**: 36×36px CSS pixels (below standard but above absolute minimum)
  - Use when space is constrained (sidebars, compact panels)
  - Ensure adequate spacing between targets (minimum 8px)
  - Document deviation from 44px standard in code comments

**Spacing Between Targets**
- Minimum: 8px between adjacent interactive elements
- Prevents accidental mis-taps/mis-clicks

**Implementation**
```css
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 8px 16px; /* Exceeds minimum when text present */
}

.icon-button {
  width: 48px;
  height: 48px;
  padding: 12px; /* Centers 24px icon */
}

/* Compact UI variant (use sparingly) */
.compact-button {
  min-height: 36px; /* Below standard, documented exception */
  padding: 5px 8px;
  /* Ensure 8px+ gap to adjacent interactive elements */
}
```

---

## Accessibility Requirements

### Semantic HTML

**Use Native Elements First**
- `<button>` for clickable actions (not `<div onclick>`)
- `<a href>` for navigation (not `<span onclick>`)
- `<input>`, `<select>`, `<textarea>` for form controls
- `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` for structure

**ARIA Roles** (Only When Semantic HTML Insufficient)
- `role="button"` on div styled as button (prefer real `<button>`)
- `role="dialog"` for modal overlays
- `role="progressbar"` for progress indicators
- `role="tab"` / `role="tabpanel"` for tab interfaces
- `role="menu"` / `role="menuitem"` for dropdown menus

### ARIA Attributes

**Mandatory ARIA Patterns**
```html
<!-- Button with icon only -->
<button aria-label="Close panel" class="icon-button">
  <span class="icon-close"></span>
</button>

<!-- Progress bar -->
<div role="progressbar" 
     aria-valuenow="65" 
     aria-valuemin="0" 
     aria-valuemax="100"
     aria-label="Upload progress">
</div>

<!-- Expandable section -->
<button aria-expanded="false" 
        aria-controls="details-panel">
  Show Details
</button>
<div id="details-panel" hidden>
  Content here...
</div>

<!-- Tab interface -->
<button role="tab" 
        aria-selected="true" 
        aria-controls="panel-1">
  Tab 1
</button>
<div id="panel-1" role="tabpanel">
  Panel content...
</div>
```

### Keyboard Navigation

**Focus Management**
- All interactive elements must be keyboard accessible
- Add `tabindex="0"` to custom interactive elements (divs styled as buttons)
- Never use `tabindex > 0` (breaks natural tab order)
- Use `tabindex="-1"` for programmatic focus only (modals, error messages)

**Focus Indicators** (Mandatory)
```css
/* Standard focus visible pattern */
:focus-visible {
  outline: 2px solid var(--vscode-focusBorder);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove outline for mouse clicks (keeps for keyboard) */
:focus:not(:focus-visible) {
  outline: none;
}

/* Component-specific focus */
.button:focus-visible {
  box-shadow: 0 0 0 3px var(--vscode-focusBorder);
}
```

**Keyboard Event Handlers**
```javascript
// Div styled as button needs keyboard support
function handleKeyPress(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevent space scrolling
    handleClick();
  }
}

element.addEventListener('keypress', handleKeyPress);
```

### Screen Reader Support

**Labels for All Interactive Elements**
- Text buttons: Use visible text content
- Icon buttons: Add `aria-label`
- Form inputs: Use `<label for="id">` or `aria-labelledby`
- Images: Add `alt` text (empty alt="" for decorative images)

**Landmark Regions**
```html
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<aside aria-label="Related content">...</aside>
<footer>...</footer>
```

**Live Regions** (Dynamic Content Updates)
```html
<!-- Status messages -->
<div role="status" aria-live="polite">
  File saved successfully
</div>

<!-- Error alerts -->
<div role="alert" aria-live="assertive">
  Network connection lost
</div>
```

---

## Code Review Triggers

**Auto-flag for Review**
When reviewing UI code, automatically check for:

1. **Font sizes below 11px** → P0 violation (immediate fix)
2. **Hardcoded theme colors** → Use CSS variables instead
3. **Clickable divs without keyboard support** → Add tabindex + keypress handler or use `<button>`
4. **Buttons without aria-label when text not present** → Add descriptive label
5. **Color-only status indicators** → Add icons or text labels
6. **Interactive elements <44px** → Increase touch target size
7. **Missing focus indicators** → Add `:focus-visible` styles
8. **Non-semantic HTML** → Replace div/span with nav/article/button
9. **Inconsistent spacing** → Use design token variables
10. **Low contrast text** → Check contrast ratio, adjust colors

**Review Comment Templates**
```markdown
<!-- Typography violation -->
⚠️ **Accessibility**: Font size 10px is below WCAG AA minimum (11px). 
Recommend: Use `--font-xs: 11px` or larger.

<!-- Touch target violation -->
⚠️ **Accessibility**: Button is 32×32px (below 44×44px WCAG AA requirement).
Recommend: Apply `min-width: 44px; min-height: 44px;` or increase padding.

<!-- Color-blind safety -->
⚠️ **Accessibility**: Status indicator uses color only (green/yellow/red).
Recommend: Add icons (✓/⚠/✗) via `::after` pseudo-element for color-blind users.

<!-- Keyboard navigation -->
⚠️ **Accessibility**: Clickable div without keyboard support.
Recommend: Change to `<button>` or add `tabindex="0"` + `onkeypress` handler.

<!-- Missing ARIA -->
⚠️ **Accessibility**: Icon-only button missing `aria-label`.
Recommend: Add `aria-label="[Action description]"` for screen reader users.
```

---

## Design Token Workflow

**Step 1: Identify Hardcoded Values**
Run automated scan when reviewing UI code:
```javascript
// Scan for hardcoded font sizes
const hardcodedFonts = /font-size:\s*(\d+)px/g;

// Scan for hardcoded spacing
const hardcodedSpacing = /(margin|padding):\s*(\d+)px/g;

// Scan for hardcoded colors
const hardcodedColors = /(color|background):\s*(#[0-9a-fA-F]{3,6})/g;
```

**Step 2: Propose Design Token Replacement**
```css
/* Before */
.header {
  font-size: 16px;
  margin-bottom: 12px;
  color: #cccccc;
}

/* After */
.header {
  font-size: var(--font-lg);
  margin-bottom: var(--spacing-sm);  /* 8px preferred over 12px */
  color: var(--vscode-foreground);
}
```

**Step 3: Validate Token System Exists**
If CSS variables not defined in project:
1. Propose creating design token system
2. Extract unique values from codebase
3. Calculate base unit (GCD of spacing values)
4. Create `:root` variable definitions
5. Update all hardcoded values to use tokens

---

## VS Code Extension Specific Guidelines

### Webview UI Best Practices

**Theme Integration**
```javascript
// Get VS Code theme colors in webview
const vscode = acquireVsCodeApi();
const styles = `
  <style>
    :root {
      --font-family: var(--vscode-font-family);
      --font-size: var(--vscode-font-size);
      --foreground: var(--vscode-foreground);
      --background: var(--vscode-editor-background);
    }
  </style>
`;
```

**CSP-Compliant Styling**
- Inline styles forbidden by Content Security Policy
- Use `<style>` tags with nonce or external stylesheets
- Avoid `style=""` attributes

**Icon Usage**
```html
<!-- Codicons (VS Code icon font) -->
<i class="codicon codicon-check"></i>
<i class="codicon codicon-warning"></i>
<i class="codicon codicon-error"></i>

<!-- Add to CSP -->
<meta http-equiv="Content-Security-Policy" 
      content="font-src https://file+.vscode-resource.vscode-cdn.net;">
```

### Activity Bar Webviews

**Status Displays**
- Use semantic colors from theme variables
- Add icons for color-blind safety
- Provide text labels for all statuses
- Support high contrast mode automatically via theme variables

**Quick Action Buttons**
- Minimum 44×44px touch targets
- Clear visual hierarchy (primary vs secondary actions)
- Keyboard accessible (Enter/Space triggers)
- Focus indicators visible

---

## Iterative UI Refinement Workflow

**When to Use Iterative Refinement**
- User requests "make it more compact" or "tighten spacing"
- Space-constrained UIs (sidebars, compact panels, mobile views)
- Visual density improvements without breaking layout
- Font size optimization while maintaining readability

**Three-Pass Reduction Strategy**

**Pass 1: Identify Safe Reduction Candidates**
```bash
# Scan for font sizes with headroom (>12px can usually go to 11px minimum)
# Scan for spacing with multiples (16px → 12px → 10px, 8px → 6px → 4px)
```

Target priorities:
1. **Large spacing values first** (24px → 16px has more visual impact than 4px → 3px)
2. **Icons and labels second** (visual hierarchy preserved if all reduced equally)
3. **Body text last** (maintain readability, cautious reductions)

**Pass 2: Apply Reductions in Batches**
- Group related elements (e.g., all card padding, all button min-heights)
- Reduce by 1-2px for fonts, 2-4px for spacing
- Use `multi_replace_string_in_file` for efficiency
- **Critical**: Verify changes with `read_file` after batch operations
  - Tool may report "failed" when changes actually succeeded
  - Read affected lines to confirm current state before retry

**Pass 3: Verify Accessibility Boundaries**
- No fonts below 11px (WCAG minimum)
- No touch targets below 36px min-height (practical minimum, document exception)
- Adequate spacing between interactive elements (8px+ minimum)
- Text contrast maintained (4.5:1 for normal text)

**Testing Between Passes**
```bash
# Launch Extension Development Host (F5) to visually inspect
# Check for layout breaks, readability issues, crowding
# User feedback: "reduce more" → next pass, "perfect" → done
```

**Common Reduction Patterns**
| Element Type | Safe Reduction | Absolute Minimum |
|--------------|----------------|------------------|
| Body text | 16px → 15px → 14px | 12px (readable) |
| Secondary text | 14px → 13px → 12px | 11px (WCAG) |
| Icon sizes | 18px → 17px → 16px | 14px (visible) |
| Card padding | 16px → 12px → 10px → 8px | 4px (breathing room) |
| Section margins | 24px → 16px → 12px → 10px | 8px (visual separation) |
| Grid gaps | 8px → 6px → 4px → 3px | 1px (minimal separation) |
| Button min-height | 44px → 38px → 36px | 36px (compact touch target) |

---

## Related Instructions & Skills

**Load Before UI/UX Work**
- `graphic-design.instructions.md` - Visual identity, brand consistency
- `code-review-guidelines.instructions.md` - Quality gate protocols

**Read for Deep Knowledge**
- `.github/skills/ui-ux-design/SKILL.md` - Comprehensive UI/UX patterns
- `.github/skills/testing-strategies/SKILL.md` - Accessibility testing integration

**Consult for Specific Domains**
- `.github/skills/vscode-extension-patterns/SKILL.md` - Extension UI patterns
- `.github/skills/markdown-mermaid/SKILL.md` - Diagram accessibility

---

## Validation Checklist

Before merging UI changes, verify:

**Accessibility**
- [ ] All font sizes ≥11px
- [ ] All interactive elements ≥44×44px
- [ ] All text meets 4.5:1 contrast ratio (normal) or 3:1 (large)
- [ ] All buttons have visible text or `aria-label`
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation works (Tab, Enter, Space, Escape)
- [ ] Color not sole indicator of status (icons/text added)
- [ ] Semantic HTML used (`<button>`, `<nav>`, etc.)

**Design System**
- [ ] CSS variables used (no hardcoded font sizes, spacing, colors)
- [ ] Spacing follows 8px scale (or documented base unit)
- [ ] Theme-aware colors (VS Code variables for extensions)
- [ ] Consistent typography scale across components

**Testing**
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with screen reader (NVDA, VoiceOver, Narrator)
- [ ] Tested at 200% zoom (Ctrl/Cmd +)
- [ ] Tested in high contrast mode
- [ ] Tested with color-blind simulator
- [ ] Tested on touch device (or simulator)

**Performance**
- [ ] No excessive DOM nesting (<10 levels deep)
- [ ] CSS specificity reasonable (avoid `!important`)
- [ ] Minimal ARIA attributes (semantic HTML preferred)
- [ ] No layout thrashing (batch DOM reads/writes)

---

## Iterative Accessibility Refinement

### User-Validated Design Improvements

**Principle**: Accessibility improvements (especially typography and spacing) require real user validation. Mathematical scaling ratios don't predict human perception.

**Iterative Refinement Pattern**

1. **Initial Implementation**: Apply design standards with reasonable defaults
   - Use established typography scales (1.125, 1.2, 1.333, 1.5, 1.618)
   - Follow 8px spacing grid
   - Target WCAG AA minimum requirements

2. **Local Testing**: Deploy locally before marketplace/production release
   - Install extension/app in real environment
   - Use actual screen sizes and zoom levels user will experience
   - Test with target user personas if available

3. **User Feedback Loop**: Collect real-world perception data
   - Direct user feedback: "too large", "too small", "just right"
   - Observation: user squinting (too small), scrolling excessively (too large)
   - Analytics: zoom level usage, readability complaints

4. **Incremental Adjustment**: Make small changes based on feedback
   - Typography: Adjust by 1-2px or 0.1-0.25x scale increments
   - Spacing: Adjust by 1-2px (within 8px grid when possible)
   - Never assume first attempt is final

5. **Re-Validation**: Test adjusted design with same users
   - Confirm improvement over previous iteration
   - Continue loop until user satisfaction achieved

**Example: Font Size Iteration** (Alex v5.8.2 Welcome View)

| Iteration | Scale | Base Sizes | User Feedback | Result |
|-----------|-------|------------|---------------|--------|
| Original | 1.0x | 11px, 12px, 14px, 16px | "Too small, hard to read" | ❌ Rejected |
| Attempt 1 | 1.5x | 16px, 18px, 21px, 24px | "Better, but still small" | ❌ Rejected |
| Attempt 2 | 2.0x | 22px, 24px, 28px, 32px | "Way too large!" | ❌ Rejected |
| Final | 1.18x | 13px, 14px, 16px, 18px | "Looks good" | ✅ Approved |

**Key Insight**: The optimal scale (1.18x) was not predictable from standard typographic ratios. Required 3 iterations with user validation.

**CSS Variable Design Pattern** (Enables Rapid Iteration)

```css
/* Define scale in one place */
:root {
  --font-xs: 13px;  /* Easily adjustable */
  --font-sm: 14px;
  --font-md: 16px;
  --font-lg: 18px;
}

/* Use variables throughout */
.section-title {
  font-size: var(--font-xs); /* Changes globally when variable updated */
}

.action-btn {
  font-size: var(--font-xs);
  padding: var(--spacing-sm);
}
```

**Benefit**: Changing 4 CSS variables updates entire interface. No need to track down dozens of hardcoded values.

**When to Use This Pattern**

- New UI components with uncertain user reception
- Accessibility improvements to existing interfaces
- Cross-cultural design (different reading preferences by locale)
- Responsive design (different optimal sizes per screen size)

**When NOT to Apply**

- Established design systems with proven user testing
- Components matching existing interface standards (consistency > optimization)
- Minor internal tools with single user

---

## Common UI/UX Code Smells

**Immediate Red Flags**
```css
/* ❌ Font too small */
font-size: 10px;

/* ❌ Hardcoded theme color */
color: #ffffff;
background: #1e1e1e;

/* ❌ Touch target too small */
.button { width: 32px; height: 32px; }

/* ❌ Arbitrary spacing */
margin: 7px 13px 21px;

/* ❌ Color-only indicator */
.status { background: red; } /* No icon or text */
```

**Refactoring Candidates**
```html
<!-- ❌ Div styled as button -->
<div onclick="handleClick()" class="button">Click</div>

<!-- ✅ Semantic button -->
<button type="button" onclick="handleClick()">Click</button>

<!-- ❌ Icon button without label -->
<button class="icon-button">
  <i class="icon-close"></i>
</button>

<!-- ✅ Icon button with ARIA label -->
<button aria-label="Close panel" class="icon-button">
  <i class="icon-close"></i>
</button>
```

---

## Auto-Application Rules

**When to Apply**
- User asks for UI/UX review or audit
- Editing HTML, JSX, TSX, Vue, Svelte files
- Creating new UI components
- Reviewing pull requests with UI changes
- User mentions "accessibility", "design system", "WCAG"

**When to Defer to Skill**
- User needs comprehensive accessibility checklist → Load `.github/skills/ui-ux-design/SKILL.md`
- User asks for design token implementation workflow → Level 2 of skill
- User needs ARIA pattern examples → Level 2 of skill
- User wants WCAG specification references → Level 3 of skill

**When to Invoke Prompt**
- User asks to "audit UI/UX" → Trigger `/audit-ui-ux` prompt
- User asks to "check accessibility" → Trigger audit prompt
- User mentions "WCAG compliance" → Trigger audit prompt

---

**Version**: 1.0.0 (2026-02-15)  
**Based On**: Alex v5.8.0 accessibility implementation session  
**Validated Against**: welcomeView.ts production refactoring (1876 lines, WCAG AA compliant)
