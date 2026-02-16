# UI/UX Accessibility Audit

**Purpose**: Systematic accessibility and design system audit for user interfaces  
**WCAG Level**: AA minimum (Level AAA aspirational)  
**Duration**: 15-45 minutes depending on UI complexity  
**Output**: Prioritized issue list with actionable fixes

---

## Audit Workflow

This prompt guides you through a comprehensive accessibility and design quality audit in 5 phases:

1. **Visual Assessment** - Typography, spacing, color, touch targets
2. **Accessibility Check** - Keyboard navigation, screen reader, ARIA
3. **Design System Review** - Design tokens, consistency, theme support
4. **Testing Validation** - Manual and automated testing
5. **Issue Reporting** - Prioritized findings with fix recommendations

---

## Phase 1: Visual Assessment

### Typography Audit

**Scan all text elements and measure:**
- [ ] Minimum font size ≥11px (WCAG AA requirement)
- [ ] Body text size ≥14px (recommended)
- [ ] Line height 1.4-1.6 for body text
- [ ] Font weights consistent (300/400/500/600/700, avoid 450/550)
- [ ] Heading hierarchy clear (progressive sizes)

**Findings Template:**
```markdown
### Typography Issues

**P0 - Critical (Blocks WCAG AA)**
- File: [path/to/file.tsx](path/to/file.tsx#L123)
  - Issue: Font size 10px on `.label` class
  - Fix: Change to `font-size: var(--font-xs, 11px);`
  - Impact: WCAG 2.1 AA compliance violation

**P1 - High**
- File: [path/to/file.tsx](path/to/file.tsx#L245)
  - Issue: Inconsistent font weight (450 not standard)
  - Fix: Change to `font-weight: 500;` (standard medium weight)
  - Impact: Visual inconsistency, rendering differences across browsers
```

### Spacing Audit

**Measure margins and padding across components:**
- [ ] Identify base unit (4px or 8px recommended)
- [ ] List all unique spacing values
- [ ] Calculate GCD (greatest common divisor)
- [ ] Flag arbitrary values (7px, 13px, 21px)
- [ ] Check consistency within similar components

**Analysis Pattern:**
```javascript
// Extract spacing values from CSS
Spacing values found: 4px, 7px, 8px, 12px, 13px, 16px, 24px, 32px

// Calculate GCD
Base candidates: 4px (GCD of 4,8,12,16,24,32) or 1px (includes 7,13)

// Recommendation
Normalize to 8px base system: 4px, 8px, 16px, 24px, 32px
Replace: 7px→8px, 13px→12px or 16px (context-dependent)
```

### Color Contrast Audit

**Check all text-on-background combinations:**
- [ ] Body text: ≥4.5:1 contrast ratio
- [ ] Large text (≥18px or ≥14px bold): ≥3:1 contrast ratio
- [ ] UI components (borders, icons): ≥3:1 contrast ratio
- [ ] Links distinguishable from surrounding text

**Tools:**
- Chrome DevTools → Inspect element → Color picker shows contrast ratio
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- axe DevTools extension

**Findings Template:**
```markdown
### Color Contrast Issues

**P0 - Critical**
- Location: Header text on background
  - Current: #999999 on #ffffff (2.85:1) ❌
  - Required: 4.5:1 minimum
  - Fix: Change to #767676 (4.54:1) ✅

**P1 - High**
- Location: Secondary button text
  - Current: #cccccc on #f0f0f0 (1.52:1) ❌
  - Required: 4.5:1 minimum
  - Fix: Change to #666666 (5.74:1) ✅
```

### Touch Target Audit

**Measure all interactive elements:**
- [ ] Buttons ≥44×44px
- [ ] Links ≥44px height (width can flex with text)
- [ ] Checkboxes/radios ≥44×44px clickable area
- [ ] Icon buttons ≥44×44px
- [ ] Spacing between adjacent targets ≥8px

**Measurement Script:**
```javascript
// Run in browser console
document.querySelectorAll('button, a, input, [role="button"]').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.width < 44 || rect.height < 44) {
    console.warn('Touch target too small:', el, `${rect.width}×${rect.height}px`);
  }
});
```

---

## Phase 2: Accessibility Check

### Keyboard Navigation Test

**Manual Testing Steps:**
1. Close mouse/trackpad (keyboard only)
2. Press Tab to navigate through entire interface
3. Verify every interactive element receives focus
4. Check focus order matches visual order
5. Press Enter/Space on focused elements
6. Test Escape closes modals/dropdowns
7. Verify no keyboard traps (can always tab away)

**Checklist:**
- [ ] All buttons focusable via Tab
- [ ] All links focusable via Tab
- [ ] Custom interactive elements have `tabindex="0"`
- [ ] Focus order logical (top→bottom, left→right)
- [ ] Enter/Space activates focused elements
- [ ] Escape closes overlays
- [ ] No keyboard traps

**Common Issues:**
```html
<!-- ❌ Div button not keyboard accessible -->
<div onclick="handleClick()" class="button">Click Me</div>

<!-- ✅ Fixed with tabindex + keyboard handler -->
<div role="button" 
     tabindex="0"
     onclick="handleClick()"
     onkeypress="if(event.key==='Enter'||event.key===' ')handleClick()">
  Click Me
</div>

<!-- ✅ Better: Use semantic button -->
<button type="button" onclick="handleClick()">Click Me</button>
```

### Focus Indicator Audit

**Visual Check:**
- [ ] Focus indicators visible on all interactive elements
- [ ] Contrast ratio ≥3:1 against background
- [ ] Thickness ≥2px (or equivalent visual weight)
- [ ] Not hidden by `outline: none` without replacement

**Standard Pattern:**
```css
/* ✅ Recommended focus styling */
:focus-visible {
  outline: 2px solid var(--vscode-focusBorder, #007acc);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove outline for mouse clicks (keeps for keyboard) */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Screen Reader Test

**Testing Tools:**
- **Windows**: NVDA (free) or Narrator (built-in)
- **Mac**: VoiceOver (Cmd+F5)
- **Test Duration**: 5-10 minutes

**Testing Steps:**
1. Enable screen reader
2. Navigate through interface with Tab
3. Verify all interactive elements announced with role and label
4. Check landmark regions announced (navigation, main, complementary)
5. Verify form fields have associated labels
6. Test dynamic content updates (live regions)

**Checklist:**
- [ ] All buttons announced with label (visible text or aria-label)
- [ ] All form inputs have labels
- [ ] Images have alt text (or alt="" for decorative)
- [ ] Landmark regions present (`<nav>`, `<main>`, `<aside>`)
- [ ] Dynamic updates use `role="status"` or `role="alert"`
- [ ] Custom components have ARIA roles

### ARIA Attribute Audit

**Scan for Required ARIA:**
```javascript
// Icon-only buttons must have aria-label
document.querySelectorAll('button').forEach(btn => {
  if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
    console.error('Missing aria-label:', btn);
  }
});

// Progress bars must have aria-valuenow/min/max
document.querySelectorAll('[role="progressbar"]').forEach(bar => {
  if (!bar.hasAttribute('aria-valuenow')) {
    console.error('Missing aria-valuenow:', bar);
  }
});
```

**Common ARIA Patterns:**
```html
<!-- Icon button -->
<button aria-label="Close panel">
  <i class="icon-close"></i>
</button>

<!-- Progress bar -->
<div role="progressbar" 
     aria-valuenow="65" 
     aria-valuemin="0" 
     aria-valuemax="100"
     aria-label="Upload progress">
</div>

<!-- Expandable section -->
<button aria-expanded="false" aria-controls="details">
  Show Details
</button>
<div id="details" hidden>Details content</div>

<!-- Modal dialog -->
<div role="dialog" 
     aria-labelledby="dialog-title"
     aria-modal="true">
  <h2 id="dialog-title">Confirmation</h2>
</div>
```

### Color-Blind Safety Check

**Testing:**
- Use color-blindness simulator: https://www.color-blindness.com/coblis-color-blindness-simulator/
- Chrome DevTools → Rendering → Emulate vision deficiencies
- Test: Deuteranopia (red-green), Protanopia (red-green), Tritanopia (blue-yellow)

**Checklist:**
- [ ] Status indicators visible without color (icons/text added)
- [ ] Charts/graphs use patterns or labels (not just color)
- [ ] Links distinguishable from text (underline or icon)
- [ ] Error states indicated by icon + text (not just red)

**Fix Pattern:**
```css
/* ❌ Color-only status */
.status.success { background: green; }
.status.warning { background: yellow; }
.status.error { background: red; }

/* ✅ Color + icon */
.status.success::before { content: '✓'; color: white; }
.status.warning::before { content: '⚠'; color: black; }
.status.error::before { content: '✗'; color: white; }
```

---

## Phase 3: Design System Review

### CSS Variables Audit

**Check for Hardcoded Values:**
```bash
# Font sizes
grep -r "font-size:" src/ | grep -v "var(--"

# Spacing
grep -r -E "(margin|padding):" src/ | grep -v "var(--"

# Colors
grep -r -E "(color|background):" src/ | grep -v "var(--"
```

**Findings:**
```markdown
### Design Token Issues

**P1 - High Priority**
- File: [components/Header.tsx](components/Header.tsx#L45)
  - Issue: Hardcoded `font-size: 16px` (should use design token)
  - Fix: Replace with `font-size: var(--font-lg, 16px);`
  - Impact: Inconsistent sizing, no centralized control

- File: [styles/buttons.css](styles/buttons.css#L12)
  - Issue: Hardcoded `padding: 8px 16px` (should use design tokens)
  - Fix: Replace with `padding: var(--spacing-sm) var(--spacing-md);`
  - Impact: Spacing inconsistency across components
```

### Design Token System Check

**If CSS variables exist:**
- [ ] Variables defined in `:root` or component scope
- [ ] Semantic naming (`--font-body`, not `--font-14px`)
- [ ] Consistent usage across codebase
- [ ] Fallback values provided for older browsers

**If CSS variables missing:**
- [ ] Recommend creating design token system
- [ ] Extract unique values (fonts, spacing, colors)
- [ ] Calculate base unit (GCD of spacing values)
- [ ] Propose variable naming convention

**Design Token Template:**
```css
:root {
  /* Typography Scale */
  --font-xs: 11px;
  --font-sm: 12px;
  --font-md: 14px;
  --font-lg: 16px;
  --font-xl: 18px;
  
  /* Spacing Scale (8px base) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Semantic Colors */
  --color-text-primary: var(--vscode-foreground);
  --color-text-secondary: var(--vscode-descriptionForeground);
  --color-bg-primary: var(--vscode-editor-background);
  --color-border: var(--vscode-panel-border);
  --color-accent: var(--vscode-button-background);
}
```

### Theme Support Audit (VS Code Extensions)

**Check for Theme-Aware Colors:**
- [ ] Uses `var(--vscode-*)` variables (not hardcoded hex)
- [ ] Tested in light theme
- [ ] Tested in dark theme
- [ ] Tested in high contrast theme

**Common Theme Variables:**
```css
/* Text */
--vscode-foreground
--vscode-descriptionForeground

/* Backgrounds */
--vscode-editor-background
--vscode-sideBar-background
--vscode-panel-background

/* Borders */
--vscode-panel-border
--vscode-focusBorder

/* Buttons */
--vscode-button-background
--vscode-button-foreground
--vscode-button-secondaryBackground
```

---

## Phase 4: Testing Validation

### Manual Testing Checklist

**Keyboard Navigation** (5 min)
- [ ] Tab through all interactive elements
- [ ] Verify focus visible
- [ ] Test Enter/Space on buttons
- [ ] Test Escape on modals

**Screen Reader** (5-10 min)
- [ ] All buttons have labels
- [ ] Form inputs have labels
- [ ] Landmark regions announced

**Zoom Test** (2 min)
- [ ] Zoom to 200% (Ctrl/Cmd +)
- [ ] Verify no content cut off
- [ ] Verify no horizontal scroll (unless intended)
- [ ] Verify all functionality still works

**High Contrast Mode** (2 min)
- [ ] Windows: Settings → Ease of Access → High Contrast
- [ ] Verify all text visible
- [ ] Verify borders visible
- [ ] Verify focus indicators visible

**Color-Blind Simulation** (3 min)
- [ ] Test Deuteranopia (most common)
- [ ] Verify status indicators distinguishable
- [ ] Verify links distinguishable from text

**Touch Device** (5 min, if applicable)
- [ ] Test on mobile device or touch simulator
- [ ] Verify touch targets ≥44×44px
- [ ] Verify spacing between targets adequate
- [ ] Test gestures (swipe, pinch, tap)

### Automated Testing

**Browser Extensions:**
- **axe DevTools**: Comprehensive WCAG scan
  - Install: https://www.deque.com/axe/devtools/
  - Run: F12 → axe DevTools tab → Scan All of My Page
  
- **WAVE**: Visual accessibility checker
  - Install: https://wave.webaim.org/extension/
  - Run: Click WAVE icon in toolbar

- **Lighthouse**: Chrome built-in
  - Run: F12 → Lighthouse tab → Accessibility category
  - Target: Score ≥95/100

**Command-Line Tools:**
```bash
# Pa11y - Automated accessibility testing
npm install -g pa11y
pa11y http://localhost:3000

# axe-core CLI
npm install -g @axe-core/cli
axe http://localhost:3000
```

**CI/CD Integration:**
```javascript
// Jest + jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Phase 5: Issue Reporting

### Priority Levels

**P0 - Critical (WCAG AA Violations)**
- Font size <11px
- Contrast ratio <4.5:1 (normal text) or <3:1 (large text)
- Non-keyboard-accessible interactive elements
- Missing alt text on informative images
- Color-only status indicators (safety-critical)

**P1 - High Priority**
- Touch targets <44×44px
- Missing ARIA labels on icon buttons
- Inconsistent design tokens (hardcoded values)
- Missing focus indicators
- Non-semantic HTML (divs instead of buttons)

**P2 - Medium Priority**
- Arbitrary spacing values (not on scale)
- Non-standard font weights (450, 550)
- Missing landmark regions
- Suboptimal heading hierarchy

**P3 - Low Priority (Nice-to-Have)**
- Upgrade to WCAG AAA (7:1 contrast)
- Improved spacing consistency
- Better hover states
- Animation preferences (reduced motion)

### Issue Report Template

```markdown
# UI/UX Accessibility Audit Report

**Project**: [Project Name]
**Audit Date**: 2026-02-15
**Auditor**: Alex
**WCAG Level**: AA (Level AAA aspirational)
**Files Reviewed**: [List key files or "Full codebase scan"]

---

## Executive Summary

**Overall Accessibility Score**: [X/100] (Lighthouse)
- **P0 Critical Issues**: [X] (WCAG AA blockers)
- **P1 High Priority**: [X] (Accessibility improvements)
- **P2 Medium Priority**: [X] (Design system cleanup)
- **P3 Low Priority**: [X] (Enhancements)

**Compliance Status**: ❌ Non-compliant / ⚠️ Partially compliant / ✅ Fully compliant

---

## Critical Issues (P0)

### Typography: Font sizes below WCAG minimum

**Impact**: Violates WCAG 2.1 AA Success Criterion 1.4.4 (Resize Text)

1. [components/Label.tsx](components/Label.tsx#L23)
   - Current: `font-size: 10px;`
   - Fix: `font-size: var(--font-xs, 11px);`
   - Effort: 2 minutes

2. [styles/sidebar.css](styles/sidebar.css#L45)
   - Current: `font-size: 9px;` on `.caption` class
   - Fix: `font-size: var(--font-xs, 11px);` or remove if not essential
   - Effort: 2 minutes

**Total P0 Issues**: 2  
**Estimated Fix Time**: 5 minutes

---

## High Priority Issues (P1)

### Touch Targets: Buttons below 44×44px

**Impact**: Violates WCAG 2.1 AA Success Criterion 2.5.5 (Target Size)

1. [components/IconButton.tsx](components/IconButton.tsx#L15)
   - Current: 32×32px
   - Fix: Add `min-width: 44px; min-height: 44px;`
   - Effort: 5 minutes

### ARIA: Missing labels on icon buttons

**Impact**: Screen readers cannot announce button purpose

1. [components/Header.tsx](components/Header.tsx#L67)
   - Current: `<button><i class="icon-close"></i></button>`
   - Fix: `<button aria-label="Close panel"><i class="icon-close"></i></button>`
   - Effort: 2 minutes

**Total P1 Issues**: 5  
**Estimated Fix Time**: 30 minutes

---

## Medium Priority Issues (P2)

### Design System: Hardcoded spacing values

**Impact**: Inconsistent spacing, difficult to maintain

1. [components/Card.tsx](components/Card.tsx#L34)
   - Current: `padding: 12px 18px;`
   - Fix: `padding: var(--spacing-sm) var(--spacing-md);` (8px 16px)
   - Effort: 3 minutes

**Total P2 Issues**: 12  
**Estimated Fix Time**: 1 hour

---

## Low Priority Issues (P3)

[Summary of enhancement opportunities]

---

## Recommendations

### Immediate Actions (This Sprint)
1. Fix all P0 critical issues (5 minutes total)
2. Implement missing ARIA labels (30 minutes)
3. Increase touch target sizes (15 minutes)

### Short-Term (Next Sprint)
1. Create design token system (2 hours)
2. Replace hardcoded values with CSS variables (4 hours)
3. Add automated accessibility tests (3 hours)

### Long-Term (Roadmap)
1. Upgrade to WCAG AAA compliance
2. Implement automated accessibility CI/CD checks
3. Create component library with built-in accessibility

---

## Testing Evidence

**Automated Scans**
- Lighthouse Accessibility: [Score]/100
- axe DevTools: [X] violations found
- WAVE: [X] errors, [X] warnings

**Manual Testing**
- ✅ Keyboard navigation tested (NVDA on Windows)
- ✅ Screen reader tested (VoiceOver on Mac)
- ✅ Zoom to 200% tested
- ✅ High contrast mode tested
- ✅ Color-blind simulation tested (Deuteranopia, Protanopia)

---

## Appendix: Design Token System Proposal

[Include proposed CSS variables if design system doesn't exist]
```

---

## Quick Audit (5-Minute Version)

For rapid accessibility check:

1. **Typography**: Inspect smallest text → flag if <11px
2. **Touch Targets**: Measure buttons → flag if <44×44px
3. **Contrast**: Check text colors → run contrast checker on low-contrast pairs
4. **Keyboard**: Tab through interface → flag if any element not focusable or no focus indicator
5. **Screen Reader**: Enable screen reader → verify buttons have labels

**Quick Report:**
```markdown
**5-Minute Audit Results**
- ❌ Font sizes: 3 instances <11px
- ❌ Touch targets: 5 buttons <44×44px
- ⚠️ Contrast: 2 text combinations <4.5:1
- ✅ Keyboard: All elements focusable
- ❌ ARIA: 4 icon buttons missing aria-label

**Priority**: Fix font sizes and ARIA labels immediately (P0)
```

---

## Related Skills & Resources

**Deep Knowledge**
- `.github/skills/ui-ux-design/SKILL.md` - Comprehensive patterns and examples

**Auto-Loaded Context**
- `.github/instructions/ui-ux-design.instructions.md` - Standards and enforcement

**Related Skills**
- `.github/skills/code-review/SKILL.md` - Accessibility code review
- `.github/skills/testing-strategies/SKILL.md` - Automated accessibility testing

**External Resources**
- WCAG 2.1 Quick Reference: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

---

**Version**: 1.0.0 (2026-02-15)  
**Validated Against**: Alex v5.8.0 welcomeView.ts accessibility audit (real-world production deployment)
