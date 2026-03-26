# Welcome Menu UI/UX Audit — 2026-03-09

**Scope**: Command Center sidebar (5-tab welcome view)
**Files Audited**: sharedStyles.ts, welcomeViewHtml.ts, missionTabHtml.ts, agentsTabHtml.ts, skillStoreTabHtml.ts, mindTabHtml.ts, docsTabHtml.ts
**Standard**: .github/instructions/ui-ux-design.instructions.md (WCAG AA, 8px spacing grid)
**Method**: Two-pass audit (Pass 1: UI/UX Compliance, Pass 2: Cross-Tab Consistency)

---

## Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P1 HIGH | 5 | WCAG violations — touch targets, color-only indicators, missing ARIA |
| P2 MEDIUM | 6 | Design system deviations — spacing, inconsistency |
| P3 LOW | 6 | Polish — opacity, duplicates, hardcoded values |

Overall: The sidebar is well-structured with proper semantic HTML, CSP-compliant scripting, keyboard navigation, and theme-aware styling. The main concerns are undersized touch targets from the recent spacing reduction and some cross-tab inconsistencies.

---

## Pass 1: UI/UX Compliance (WCAG + Design System)

### P1 HIGH — WCAG Violations

#### 1.1 Touch targets undersized: `.action-btn` at 28px ⬡

**Location**: sharedStyles.ts (`.action-btn { min-height: 28px }`)
**Standard**: WCAG 2.5.5 requires 44px; our documented compact exception floor is 36px
**Impact**: All Mission tab buttons (30+ actions), Mind tab action buttons
**Fix**: Increase `min-height` to 32px (matches search input) or preferably 36px

#### 1.2 Touch target undersized: `.quick-command-input` at 32px ⬡

**Location**: sharedStyles.ts (`.quick-command-input { min-height: 32px }`)
**Standard**: Below compact exception floor of 36px
**Fix**: Increase to 36px

#### 1.3 Touch target undersized: `.skill-search-input` at 28px ⬡

**Location**: sharedStyles.ts (`.skill-search-input { min-height: 28px }`)
**Standard**: Below compact exception floor of 36px
**Fix**: Increase to 36px

#### 1.4 Color-only indicator: `.secret-dot` ⬡

**Location**: missionTabHtml.ts (API Keys section)
**Standard**: "Never rely on color alone to convey information" — requires icon fallback
**Current**: Green dot for set, red dot for unset — color only
**Fix**: Add `::after` content like `.status-dot` already does (`.dot-green::after { content: '✓' }`)
**Note**: The `.status-dot` in the status grid DOES have icon fallback — inconsistency with `.secret-dot`

#### 1.5 Color-only indicator: `.agent-live-dot` ⬡

**Location**: agentsTabHtml.ts + sharedStyles.ts
**Standard**: Green for active, gray for idle — color only
**Fix**: Add `::after` icon content or text label alternative

### P2 MEDIUM — Design System Deviations

#### 2.1 Action list gap below spacing scale minimum ⬡

**Location**: sharedStyles.ts (`.action-list { gap: 2px }`, `.action-group-content { gap: 2px }`)
**Standard**: Spacing scale minimum is `--spacing-xs: 4px`; 2px is not in the scale
**Context**: Reduced from 8px during this session's spacing fix
**Fix**: Use 4px (--spacing-xs) — still compact but on-grid

#### 2.2 Non-standard spacing values across components ◇

**Locations**: Multiple CSS rules use 5px, 6px, 10px, 14px — not on the 8px grid
- `.secret-row`, `.activity-item`, `.setting-row`: padding 5px 8px
- `.agent-list`, `.skill-grid`, `.freshness-panel`: gap 6px
- `.agent-card`, `.skill-card`, `.dashboard-card`: padding 8px 10px
**Standard**: Use 4, 8, 12, 16, 24, 32px (8px grid with half-increments)
**Impact**: Visual rhythm slightly off, inconsistent feel between tabs
**Decision needed**: Audit-wide spacing normalization or accept organic values

#### 2.3 Inconsistent border-radius values ◇

**Location**: sharedStyles.ts
**Current**: Mix of 3px, 4px, 5px, 6px across components
- 3px: `.features-section summary`, `.secret-badge`, `.tier-lock`
- 4px: `.action-btn`, `.doc-tip`, `.activity-item`, `.skill-search-input`, `.catalog-toggle`
- 5px: `.context-card`, `.goal-item`
- 6px: `.agent-card`, `.skill-card`, `.dashboard-card`, `.doc-grid-card`, `.identity-card`, `.arch-status-banner`
**Standard**: Should use a small set of standard radius values
**Suggestion**: Standardize to 4px (controls), 6px (cards), 12px (pills/badges)

#### 2.4 Section title styling differs per tab ⬡

**Problem**: Each tab uses a different pattern for section headers:
| Tab | Class | Size | Weight | Opacity | Case |
|-----|-------|------|--------|---------|------|
| Mission | `.action-group-label` | 11px | 600 | 0.55 | UPPERCASE |
| Agents | `.tab-section-title` | 13px | 600 | 1.0 | Mixed |
| Skills | `.skill-category-header` | 11px | 600 | 0.6 | UPPERCASE |
| Mind | `.dashboard-card-title` | 11px | 600 | 0.7 | UPPERCASE |
| Docs | `.docs-section-title` | 11px | 600 | 0.6 | UPPERCASE |

**Impact**: No visual consistency for "this is a section header" across tabs
**Fix**: Unify to one section title style (11px semibold uppercase seems dominant)

#### 2.5 Inconsistent button heights across contexts ⬡

**Current**:
- `.action-btn`: 28px (Mission, Mind)
- `.skill-recommendation-btn`: 36px (Skill recommendations)
- `.feature-link-btn`: 36px (Features)
- `.nudge-action`: 36px (Nudges)
- `.doc-grid-card`: 36px (Docs)
**Fix**: Align all interactive elements to a consistent height (32px or 36px)

#### 2.6 Memory modalities 3-col grid fragile at narrow widths ◇

**Location**: sharedStyles.ts (`.memory-modalities { grid-template-columns: repeat(3, 1fr) }`)
**Problem**: With 5 modality cards on a 3-col grid, the bottom row has 2 cards and a gap
**Impact**: Uneven bottom row; narrow sidebar widths may squish card content
**Suggestion**: Consider `repeat(auto-fill, minmax(80px, 1fr))` or 2-col layout

### P3 LOW — Polish

#### 3.1 Opacity values not standardized

**Current**: Uses 0.4, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85 — 9 distinct values
**Suggestion**: Standardize to 3-4 levels: 0.4 (faint), 0.6 (secondary), 0.8 (emphasis), 1.0 (primary)

#### 3.2 Hardcoded color in `.meditation-streak-badge`

**Location**: sharedStyles.ts
**Current**: `background: rgba(99,102,241,0.12)` (hardcoded indigo)
**Should be**: `background: color-mix(in srgb, var(--persona-accent) 12%, transparent)` (matches pattern used everywhere else)

#### 3.3 Duplicate "Memory Architecture" button in Mind tab

**Location**: mindTabHtml.ts
**`actionButton('memoryDashboard', ...)`** appears in both the Memory Architecture card AND the Learn & Knowledge card at the bottom — redundant

#### 3.4 Duplicate "Search Knowledge" button in Mind tab

**Location**: mindTabHtml.ts
**`knowledgeQuickPick`** button appears in both the Global Knowledge card AND the Learn & Knowledge card — redundant

#### 3.5 Identity card is hardcoded

**Location**: mindTabHtml.ts
**Current**: `"Alex Finch"`, `"Age 26 · Curious · Ethical · Grows through reflection"` — static strings
**Impact**: Won't update if identity evolves; not data-driven

#### 3.6 Mixed animation durations

**Current**: 0.1s, 0.12s, 0.15s, 0.2s, 0.3s used interchangeably
**Suggestion**: Standardize to `--transition-fast: 0.12s`, `--transition-normal: 0.2s`, `--transition-slow: 0.3s`

---

## Pass 2: Cross-Tab Consistency & Information Architecture

### Content Density Analysis

| Tab | Sections | Interactive Elements | Density |
|-----|----------|---------------------|---------|
| Mission | 7 action groups + nudges + session + API keys + settings | 30+ buttons, toggles | Very High |
| Agents | Cognitive state + personality + registry + activity + 2 info cards | ~10 interactive | Low |
| Skills | Search + health bar + categorized cards + install | 40+ skill cards | Medium |
| Mind | Identity + health + stats + GK + memory + maintenance + freshness + calibration + learn | 10 buttons + dashboard cards | High |
| Docs | Tips + 4 grid sections + persona grid + self-study + facilitator + partnership + CTA | 33 persona cards + 15 grid cards + 7 buttons | High |

**Observation**: Agents tab feels empty compared to others. Mission tab is the densest but manageable thanks to collapsible groups.

### Feature Parity Gaps

| Feature | Mission | Agents | Skills | Mind | Docs |
|---------|---------|--------|--------|------|------|
| Search/Filter | ✓ | ✗ | ✓ | ✗ | ✗ |
| Empty State | ✗ | ✗ | ✓ | ✓ | ✗ |
| Footer Hint | ✗ | ✓ | ✗ | ✗ | ✗ |
| Collapsible Sections | ✓ | ✗ | ✓ | ✗ | ✗ |

**Recommendations**:
- Add search to Docs tab (33 workshop personas + 14 architecture cards benefit from filtering)
- Add footer hints to tabs that need them (Docs: "Use /command to invoke skills directly")
- Ensure all tabs have empty state fallbacks

### Navigation Pattern Consistency

- **Mission**: `<nav>` with button list (appropriate for commands)
- **Agents**: Card-based registry (appropriate for entities)
- **Skills**: Searchable card grid with toggles (appropriate for catalog)
- **Mind**: Dashboard cards with embedded buttons (appropriate for dashboard)
- **Docs**: Grid cards for navigation (appropriate for reference)

**Verdict**: Each tab appropriately uses a navigation pattern suited to its content type. No inconsistency issue here.

### JavaScript Quality

**Strengths**:
- CSP-compliant: nonce-based script, no inline handlers
- Event delegation for `data-cmd` clicks and keyboard
- Tab state persistence via `vscode.getState()`
- Scroll position saved/restored per tab
- Arrow key navigation in tab bar with Home/End support

**Observations**:
- `validTabs` whitelist prevents injection via messages (good security)
- Auto-refresh at 30s interval — appropriate for live data
- Skill search filters both cards and category groups (proper empty-group hiding)

---

## Recommended Fix Priority

### Immediate (this session) ⬡

1. **Restore `.action-btn` min-height to 32px** — 28px is too aggressive
2. **Increase `.action-list` and `.action-group-content` gap to 4px** — on-grid minimum
3. **Add `::after` icon content to `.secret-dot`** — matches existing `.status-dot` pattern
4. **Add `::after` icon content to `.agent-live-dot`** — accessibility parity

### Short-term ⬡

5. Unify section title styling across tabs
6. Normalize button heights (32px standard, 36px for emphasis)
7. Increase search input min-heights to 36px

### Medium-term ◇

8. Spacing value normalization (5px→4px, 6px→8px, 10px→8px)
9. Border-radius standardization (4px controls, 6px cards, 12px pills)
10. Remove duplicate buttons in Mind tab
11. Add search to Docs tab (persona grid)

### Long-term ◇

12. Opacity value standardization (4-level scale)
13. Animation duration CSS variables
14. Responsive grid improvements for narrow sidebars
15. Data-drive identity card content

---

## What's Working Well

- **Proper CSP**: Nonce-based script with strict Content-Security-Policy
- **Keyboard navigation**: Tab bar has full arrow key + Home/End support
- **Theme awareness**: Consistent use of `var(--vscode-*)` CSS variables
- **Color-blind safe status dots**: `.status-dot` has `::after` icon content
- **Focus indicators**: Global `focus-visible` rule with proper outline
- **XSS prevention**: All user data passes through `escapeHtml()`
- **Tab state persistence**: Tab selection + scroll positions saved/restored
- **Collapsible groups**: Mission action groups and skill categories collapse cleanly
- **Search filtering**: Both Mission command search and Skill search hide empty groups
- **Persona accent system**: `color-mix()` creates consistent accent-derived colors
- **Semantic roles**: Proper `role="tablist"`, `role="tab"`, `role="tabpanel"` with `aria-controls`
