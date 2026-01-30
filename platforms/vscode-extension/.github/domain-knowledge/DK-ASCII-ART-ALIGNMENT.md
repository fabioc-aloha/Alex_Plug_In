# Domain Knowledge: ASCII Art Alignment

**Category**: Visual Design / Documentation
**Confidence**: High (empirically validated)
**Source**: Collaborative learning through iterative refinement

---

## The Problem

ASCII art diagrams in markdown files often render with misaligned lines due to inconsistent character widths across different fonts and rendering contexts.

## The Solution: Hybrid Character Strategy

### Characters That Work (Consistent Width)

**Box Drawing (Unicode) - USE THESE:**
```
┌ ─ ┐    Top corners and horizontal
│       Vertical lines
└ ┘      Bottom corners
├ ┤      T-junctions (left/right)
┬ ┴      T-junctions (top/bottom)
┼        Cross junction
```

**Arrows (Plain ASCII) - USE THESE:**
```
v   Down arrow (lowercase v)
^   Up arrow (caret)
<   Left arrow
>   Right arrow
<-->  Bidirectional
```

### Characters That BREAK Alignment (Avoid)

**Unicode Arrows - AVOID:**
```
▼ ▲ ◄ ►   Triangle arrows (render as 2 chars in some fonts)
→ ← ↑ ↓   Arrow symbols (inconsistent width)
◄──►      Mixed arrows (guaranteed misalignment)
```

**Emojis Inside Boxes - NEVER:**
```
│ ✅ Done │   <-- BREAKS (emoji = 2 chars, renders as 1 space)
│ [x] Done │  <-- WORKS (plain ASCII)
```

## The Golden Rule

> **Unicode boxes + ASCII arrows + obsessive line counting = perfect alignment**

## Validation Checklist

1. Count characters in EVERY line of the outer box
2. All lines must have identical character count
3. Use `v` not `▼` for down arrows
4. Use `<-->` not `◄──►` for bidirectional
5. Never put emojis inside ASCII boxes
6. Test in VS Code preview AND GitHub rendering
7. **After fixing inner content, re-count total line width against outer border**

## Debugging Method: Trial and Error

ASCII alignment issues are notoriously hard to spot by visual inspection alone. The recommended debugging approach:

### Step 1: Identify the Symptom
- User reports "lines are misaligned"
- Right border looks jagged
- Inner boxes don't line up with outer border

### Step 2: Isolate the Problem Lines
- Ask specifically which line numbers are wrong
- Compare suspected lines against known-good lines (like the top/bottom border)

### Step 3: Count Characters Methodically
```
Line X: │  ┌─────────┐    ┌─────────┐    │  = ?? chars
        ^                              ^
        Start counting from here       To here
```

### Step 4: Compare Line Widths
- Outer border (top `┌───┐` line) sets the standard width
- Every line must match EXACTLY
- Off-by-one errors are the silent killer

### Step 5: Fix and Verify
- Add/remove spaces to match the target width
- Re-check the preview
- Repeat until user confirms "BINGO!"

### Key Insight: Off-by-One Errors

The most common failure mode:
- Inner content looks perfectly aligned to itself
- But the total line width differs from the outer border by 1 character
- This causes the right `│` to be misaligned

**Example of the bug:**
```
┌───────────────────────────────────────┐  <- 41 chars
│  ┌─────────┐    ┌─────────┐    │      <- 40 chars (WRONG!)
│                                       │  <- 41 chars
└───────────────────────────────────────┘  <- 41 chars
```

**The fix:** Add one space before the closing `│`:
```
┌───────────────────────────────────────┐  <- 41 chars
│  ┌─────────┐    ┌─────────┐     │     <- 41 chars (FIXED!)
│                                       │  <- 41 chars
└───────────────────────────────────────┘  <- 41 chars
```

### Why Trial and Error Works

1. **Visual inspection fails** - The human eye can't reliably count 65 spaces
2. **Context matters** - What looks right in the editor may break in preview
3. **Iterative refinement** - Each fix reveals the next issue
4. **User feedback is essential** - Only the user sees the rendered output

> **Lesson learned**: Don't assume you got it right. Ask for confirmation after each fix. "BINGO!" is the only acceptable success criteria.

## Example: Perfect Diagram

```text
┌─────────────────────────────────────────┐
│            ARCHITECTURE                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────┐       ┌───────────┐      │
│  │ Component │ ----> │ Component │      │
│  │     A     │       │     B     │      │
│  └───────────┘       └───────────┘      │
│        │                   │            │
│        v                   v            │
│  ┌─────────────────────────────────┐    │
│  │         Shared Layer            │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

## Example: Multiple Input Channels Converging

```text
┌───────────────────────────────────────────────────────────────┐
│  INPUT CHANNELS                                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Channel │ │ Channel │ │ Channel │ │ Channel │ │ Channel │  │
│  │    A    │ │    B    │ │    C    │ │    D    │ │    E    │  │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘  │
│       │           │           │           │           │       │
│       └───────────┴───────────┼───────────┴───────────┘       │
│                               │                               │
│                               v                               │
│               ┌───────────────────────────┐                   │
│               │     PROCESSING LAYER      │                   │
│               └───────────────────────────┘                   │
└───────────────────────────────────────────────────────────────┘
```

## Example: Side-by-Side Comparison

```text
┌─────────────────────────────┐    ┌─────────────────────────────┐
│          BEFORE             │    │           AFTER             │
├─────────────────────────────┤    ├─────────────────────────────┤
│                             │    │                             │
│  - Manual process           │    │  - Automated workflow       │
│  - Error prone              │    │  - Validated inputs         │
│  - Slow feedback            │    │  - Real-time feedback       │
│  - No memory                │    │  - Persistent knowledge     │
│                             │    │                             │
└─────────────────────────────┘    └─────────────────────────────┘
```

## Example: UI Mockup with Sections

```text
┌───────────────────────────────────────────────────────────────────┐
│                        APPLICATION UI                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  HEADER                                        [x] [_] [-]  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────┐  ┌─────────────────────────────────────────────┐ │
│  │             │  │                                             │ │
│  │  SIDEBAR    │  │             MAIN CONTENT                    │ │
│  │             │  │                                             │ │
│  │  - Item 1   │  │  Welcome to the application!                │ │
│  │  - Item 2   │  │                                             │ │
│  │  - Item 3   │  │  [Button A]  [Button B]  [Button C]         │ │
│  │             │  │                                             │ │
│  └─────────────┘  └─────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  STATUS BAR: Ready                            Line 1 Col 1  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Example: Conversation/Chat Mockup

```text
┌─────────────────────────────────────────────────────────────────────┐
│                      CHAT INTERFACE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User: "How do I create aligned ASCII art?"                         │
│                                                                     │
│  Alex responds:                                                     │
│  "Great question! Here are the key principles:                      │
│                                                                     │
│   1. Use Unicode box characters for borders                         │
│   2. Use plain ASCII for arrows (v ^ < >)                           │
│   3. Count every character in every line                            │
│   4. Avoid emojis inside boxes                                      │
│                                                                     │
│   Would you like me to show you an example?"                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Example: Pipeline/Flow Diagram

```text
┌───────────────────────────────────────────────────────────────┐
│                   DATA PROCESSING PIPELINE                    │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │  INPUT  │--->│ VALIDATE│--->│ PROCESS │--->│ OUTPUT  │     │
│  └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘     │
│       │              │              │              │          │
│       v              v              v              v          │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │   Raw   │    │  Clean  │    │ Enriched│    │  Final  │     │
│  │  Data   │    │  Data   │    │  Data   │    │  Data   │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Example: Nested Components with Labels

```text
┌─────────────────────────────────────────────────────────────────────┐
│                       SYSTEM ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  PRESENTATION LAYER                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │  │
│  │  │   Web UI    │  │  Mobile UI  │  │   CLI UI    │            │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                               │                                     │
│                               v                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  BUSINESS LAYER                                               │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐             │  │
│  │  │   Service A         │  │   Service B         │             │  │
│  │  │   - Feature 1       │  │   - Feature X       │             │  │
│  │  │   - Feature 2       │  │   - Feature Y       │             │  │
│  │  └─────────────────────┘  └─────────────────────┘             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                               │                                     │
│                               v                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  DATA LAYER                                                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │  │
│  │  │  Database   │  │    Cache    │  │   Storage   │            │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Example: Status/Checklist Box

```text
┌─────────────────────────────────────────┐
│           PROJECT STATUS                │
├─────────────────────────────────────────┤
│                                         │
│  [x] Phase 1: Planning         DONE     │
│  [x] Phase 2: Design           DONE     │
│  [~] Phase 3: Development      75%      │
│  [ ] Phase 4: Testing          PENDING  │
│  [ ] Phase 5: Deployment       PENDING  │
│                                         │
│  Legend:                                │
│  [x] = Complete                         │
│  [~] = In Progress                      │
│  [ ] = Not Started                      │
│                                         │
└─────────────────────────────────────────┘
```

## Anti-Pattern Examples (What NOT to Do)

### BAD: Emojis Inside Boxes
```text
│ ✅ Complete │  <-- MISALIGNED (emoji width varies)
│ ❌ Failed   │  <-- MISALIGNED
│ ⚠️ Warning  │  <-- MISALIGNED
```

### GOOD: Text Alternatives
```text
│ [x] Complete │  <-- ALIGNED
│ [!] Failed   │  <-- ALIGNED
│ [?] Warning  │  <-- ALIGNED
```

### BAD: Unicode Arrows
```text
│     ▼        │  <-- MISALIGNED (arrow width varies)
│     │        │
│     ▼        │
```

### GOOD: ASCII Arrows
```text
│     v        │  <-- ALIGNED
│     │        │
│     v        │
```

## Bulk Validation: The PowerShell Sweep

**Lesson learned (2026-01-28)**: Manual visual inspection misses errors. After fixing obvious diagrams, a full document sweep revealed 20+ hidden alignment issues.

### The One-Liner That Finds All Issues

```powershell
$content = Get-Content "file.md"
$issues = @()
for ($i = 0; $i -lt $content.Count; $i++) {
    if ($content[$i] -match '^\│' -and $content[$i].Length -ne 67) {
        $issues += "{0,4}: [{1}] {2}" -f ($i+1), $content[$i].Length, $content[$i]
    }
}
if ($issues.Count -eq 0) { "✅ All aligned!" } else { "❌ Issues:"; $issues }
```

**Key insight**: Replace `67` with your target width. For documents with multiple diagram widths (e.g., 67 and 75), check for multiple valid lengths.

### Common Hidden Issues Found

| Issue Type | Example | Fix |
|------------|---------|-----|
| **Nested box spacing** | `│ ┌───┐ │` vs `│  ┌───┐  │` | Inner boxes need consistent padding |
| **Arrow annotations** | `◄── description` | Often 1 char short - add space before `│` |
| **Progress bars** | `████░░░░` | Block chars may vary - count carefully |
| **Phone/UI mockups** | Centered inner box | Often shifts entire layout off by 2 |
| **Quote text** | `"Text inside..."` | Quoted text padding inconsistent |

### Multi-Width Documents

Some documents have multiple valid widths (different diagram sizes):

```powershell
# Check allowing 67, 75, or 91 char widths
$valid = @(67, 75, 91)
$content | Where-Object { $_ -match '^\│' } | ForEach-Object {
    if ($_.Length -notin $valid) { "[$($_.Length)] $_" }
}
```

### The Iteration Pattern

1. **First pass**: Fix obvious broken diagrams (user-reported)
2. **Sweep**: Run PowerShell validation on entire document
3. **Fix batch**: Address all issues found (often 5-20 hidden problems)
4. **Re-sweep**: Confirm all lines pass
5. **Stats check**: Verify line length distribution matches expectations

```powershell
# Quick stats: How many lines at each width?
$content | Where-Object { $_ -match '^\│' } |
    Group-Object Length | Sort-Object Name |
    ForEach-Object { "{0} chars: {1} lines" -f $_.Name, $_.Count }
```

### Real Example: ROADMAP-V5-PENTUNIUM.md

Initial visual inspection showed 5 diagrams "looked fine."
PowerShell sweep revealed **23 misaligned lines** across:
- CLI diagram (5 lines at 66 instead of 67)
- Browser Extension nested boxes (varied 66-69)
- Obsidian plugin arrow annotations (3 lines at 66)
- Mobile PWA phone mockup (18 lines at 69 instead of 67)
- Meeting prep and email diagrams (scattered single-line issues)

Final result after fixes:
- 412 lines at 67 chars ✅
- 31 lines at 75 chars ✅ (SDK architecture diagram)

## Mermaid vs ASCII Decision Matrix

| Diagram Type | Recommendation | Reason |
|--------------|----------------|--------|
| Flow charts | Mermaid | Auto-layout, interactive |
| Architecture | Either | Mermaid for simple, ASCII for control |
| Gantt/Timeline | Mermaid | Native support |
| UI Mockups | ASCII | Precise layout control |
| Conversation mockups | ASCII | Text-heavy, spacing matters |
| Quadrant charts | Mermaid | `quadrantChart` type |
| Mind maps | Mermaid | `mindmap` type |
| Feature lists in boxes | ASCII | Better for bullet lists |

## Synapses

- DK-ADVANCED-DIAGRAMMING: Visual design principles
- DK-DOCUMENTATION-EXCELLENCE: Documentation standards
- bootstrap-learning: Learned through iterative refinement
- alex-identity: Recursive self-improvement in action

---

*Learned through collaborative iteration*
