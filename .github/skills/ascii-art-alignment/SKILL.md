# ASCII Art Alignment Skill

> Create perfectly aligned ASCII diagrams using the hybrid character strategy.

## The Problem

ASCII art diagrams render with misaligned lines due to inconsistent character widths across fonts and rendering contexts.

## The Solution: Hybrid Character Strategy

> Unicode boxes + ASCII arrows + obsessive line counting = perfect alignment

---

## Character Reference

### Use These (Consistent Width)

**Box Drawing (Unicode):**

```text
┌ ─ ┐    Top corners and horizontal
│        Vertical lines
└ ┘      Bottom corners
├ ┤      T-junctions (left/right)
┬ ┴      T-junctions (top/bottom)
┼        Cross junction
```

**Arrows (Plain ASCII):**

```text
v    Down arrow (lowercase v)
^    Up arrow (caret)
<    Left arrow
>    Right arrow
<--> Bidirectional
---> Flow direction
```

### Avoid These (Break Alignment)

| Bad | Problem | Good Alternative |
| --- | ------- | ---------------- |
| `▼ ▲ ◄ ►` | Triangle arrows render as 2 chars | `v ^ < >` |
| `→ ← ↑ ↓` | Arrow symbols inconsistent width | `> < ^ v` |
| `◄──►` | Mixed arrows = guaranteed misalign | `<-->` |
| `✅ ❌ ⚠️` | Emojis = 2 chars, render as 1 | `[x] [!] [?]` |

---

## Validation Checklist

1. ☐ Count characters in EVERY line of outer box
2. ☐ All lines must have identical character count
3. ☐ Use `v` not `▼` for down arrows
4. ☐ Use `<-->` not `◄──►` for bidirectional
5. ☐ Never put emojis inside ASCII boxes
6. ☐ Test in VS Code preview AND GitHub rendering
7. ☐ After fixing inner content, re-count total width

---

## Debugging Method

### Step 1: Identify Symptom

- Right border looks jagged
- Inner boxes don't align with outer border
- User reports "lines are misaligned"

### Step 2: Count Characters

```text
Line X: │  ┌─────────┐    ┌─────────┐    │  = ?? chars
        ^                              ^
        Count from here                To here
```

### Step 3: Compare to Border

Outer border (top `┌───┐` line) sets the standard width. Every line must match EXACTLY.

### Step 4: Fix Off-by-One

The most common bug:

```text
┌───────────────────────────────────────┐  <- 41 chars
│  ┌─────────┐    ┌─────────┐    │      <- 40 chars (WRONG!)
└───────────────────────────────────────┘  <- 41 chars
```

Fix: Add one space before closing `│`.

---

## PowerShell Validation

### Find All Misaligned Lines

```powershell
$content = Get-Content "file.md"
$target = 67  # Your expected width
$content | ForEach-Object -Begin {$i=0} -Process {
    $i++
    if ($_ -match '^\│' -and $_.Length -ne $target) {
        "{0,4}: [{1}] {2}" -f $i, $_.Length, $_
    }
}
```

### Quick Stats

```powershell
$content | Where-Object { $_ -match '^\│' } |
    Group-Object Length | Sort-Object Name |
    ForEach-Object { "{0} chars: {1} lines" -f $_.Name, $_.Count }
```

### Multi-Width Documents

```powershell
$valid = @(67, 75, 91)  # Multiple valid widths
$content | Where-Object { $_ -match '^\│' } | ForEach-Object {
    if ($_.Length -notin $valid) { "[$($_.Length)] $_" }
}
```

---

## Example Templates

### Basic Architecture

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

### Side-by-Side Comparison

```text
┌─────────────────────────────┐    ┌─────────────────────────────┐
│          BEFORE             │    │           AFTER             │
├─────────────────────────────┤    ├─────────────────────────────┤
│                             │    │                             │
│  - Manual process           │    │  - Automated workflow       │
│  - Error prone              │    │  - Validated inputs         │
│  - Slow feedback            │    │  - Real-time feedback       │
│                             │    │                             │
└─────────────────────────────┘    └─────────────────────────────┘
```

### Status Checklist

```text
┌─────────────────────────────────────────┐
│           PROJECT STATUS                │
├─────────────────────────────────────────┤
│                                         │
│  [x] Phase 1: Planning         DONE     │
│  [x] Phase 2: Design           DONE     │
│  [~] Phase 3: Development      75%      │
│  [ ] Phase 4: Testing          PENDING  │
│                                         │
│  Legend: [x]=Done [~]=Progress [ ]=Todo │
│                                         │
└─────────────────────────────────────────┘
```

### Pipeline Flow

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
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Mermaid vs ASCII Decision

| Diagram Type | Use | Reason |
| ------------ | --- | ------ |
| Flow charts | Mermaid | Auto-layout, interactive |
| Gantt/Timeline | Mermaid | Native support |
| UI Mockups | ASCII | Precise layout control |
| Conversation mockups | ASCII | Text-heavy, spacing matters |
| Feature lists in boxes | ASCII | Better for bullet lists |
| Simple architecture | Either | Mermaid for simple, ASCII for control |

---

## Anti-Patterns

### Emojis Inside Boxes

```text
❌ WRONG:
│ ✅ Complete │  <- Misaligned (emoji width varies)

✅ CORRECT:
│ [x] Complete │  <- Aligned
```

### Unicode Arrows

```text
❌ WRONG:
│     ▼        │  <- Misaligned (arrow width varies)

✅ CORRECT:
│     v        │  <- Aligned
```

### Visual-Only Validation

❌ **Wrong**: "It looks fine to me"

✅ **Correct**: Run PowerShell validation, confirm line counts match

---

## Synapses

See [synapses.json](synapses.json) for connection mapping.
