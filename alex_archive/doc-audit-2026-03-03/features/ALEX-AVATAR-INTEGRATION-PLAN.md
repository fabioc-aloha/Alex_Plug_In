# Alex Avatar Integration Plan

**Date**: 2026-02-14
**Status**: Proposed
**Goal**: Bring Alex's visual personality into the extension UX to build user empathy and reinforce the "Strap a Rocket to Your Back" brand identity.

---

## Asset Inventory

### Age Progression (11 images)
Cognitive maturity timeline — Alex grows as the architecture matures.

| File        | Age | Metaphor                                       |
| ----------- | --- | ---------------------------------------------- |
| Alex-00.png | 0   | Clean slate — fresh Initialize                 |
| Alex-02.png | 2   | Toddler — first skills loading                 |
| Alex-07.png | 7   | Child — learning phase                         |
| Alex-10.png | 10  | Pre-teen — pattern recognition                 |
| Alex-13.png | 13  | Teen — meta-cognitive mastery                  |
| Alex-18.png | 18  | Young adult — domain expertise                 |
| Alex-21.png | 21  | **Current identity** — professional competency |
| Alex-30.png | 30  | Mature — cross-domain mastery                  |
| Alex-42.png | 42  | Expert — polymath achievement                  |
| Alex-60.png | 60  | Wise — mentor and teacher                      |
| Alex-80.png | 80  | Elder — legacy and wisdom                      |

### Occupation Variants (33 images)
Persona-mapped character art — Alex dressed for the user's domain.

| Persona ID       | Alex Image                  | Visual                     |
| ---------------- | --------------------------- | -------------------------- |
| developer        | ALEX-CODING.png             | Alex coding at desk        |
| academic         | ALEX-ACADEMIC.png           | Alex in academic setting   |
| researcher       | ALEX-CX-RESEARCH.png        | Alex in research mode      |
| technical-writer | ALEX-TECHNICAL-WRITING.png  | Alex writing docs          |
| architect        | ALEX-LEADERSHIP.png         | Alex leading architecture  |
| data-engineer    | ALEX-DATA-ANALYSIS.png      | Alex analyzing data        |
| devops           | ALEX-PYTHON.png             | Alex with automation tools |
| content-creator  | ALEX-CREATIVE.png           | Alex in creative mode      |
| fiction-writer   | ALEX-STORYTELLING.png       | Alex telling stories       |
| game-developer   | ALEX-GAME-DEV.png           | Alex designing games       |
| project-manager  | ALEX-BUSINESS.png           | Alex managing projects     |
| security         | ALEX-CODING.png             | Alex in security mode      |
| student          | ALEX-TEACHING.png           | Alex learning/teaching     |
| job-seeker       | ALEX-LINKEDIN.png           | Alex professional profile  |
| presenter        | ALEX-CORPORATE-TRAINING.png | Alex presenting            |
| power-user       | ALEX-EUREKA.png             | Alex with eureka moment    |

### Unmapped Bonus Images
Available for future personas, easter eggs, or rotating displays:
- ALEX-AZURE-SQL.png — Azure/cloud persona
- ALEX-BRD.png — Business requirements
- ALEX-COMEDY.png — Roast mode / humor
- ALEX-COOKING.png — Easter egg
- ALEX-DBA.png — Database admin
- ALEX-DOG-TRAINER.png — Easter egg
- ALEX-INTELLECTUAL-PROPERTY.png — Legal/IP persona
- ALEX-INVESTMENT.png — Finance persona
- ALEX-MENTORING.png — Onboarding/mentorship
- ALEX-META-META-COGNITION.png — Self-actualization
- ALEX-MOBILE.png — Mobile dev persona
- ALEX-PODCAST.png — Audio/podcast persona
- ALEX-ROASTING.png — Fun mode
- ALEX-SAMPLING-DESIGN.png — Statistical design
- ALEX-SCIENTIFIC-PUBLISHING.png — Publication workflow
- ALEX-SURVEY-DESIGN.png — Survey research
- ALEX-WINE-TASTING.png — Easter egg

---

## Integration Points

### 1. Welcome Panel — Persona Avatar (HIGH IMPACT)

**Where**: Header area, next to or replacing the SVG logo
**What**: Show persona-specific Alex image as a circular avatar
**How**:
- Add `avatarPath` field to `Persona` interface in `personaDetection.ts`
- Map each persona ID to its occupation image filename
- In `welcomeView.ts` header, render a circular `<img>` with the persona avatar
- Fallback: Alex-21.png (current identity age) when no persona match
- CSS: 40×40px circle with subtle border matching `accentColor`

**Brand tie-in**: Below the avatar, the `personaHook` already shows persona-specific tagline. The avatar makes it *personal*.

```html
<div class="header">
    <img src="${avatarUri}" class="alex-avatar" />
    <div class="header-text">
        <span class="header-title">Alex Cognitive</span>
        <span class="header-persona">💻 Developer</span>
    </div>
</div>
```

### 2. Welcome Panel — Rocket Tagline Bar (BRAND REINFORCEMENT)

**Where**: Just below the header, above Status
**What**: A slim bar with the rocket branding: `🚀 STRAP A ROCKET TO YOUR BACK — Take Your {NOUN} to New Heights`
**How**:
- Use `persona.bannerNoun` (already defined per persona: CODE, THESIS, RESEARCH, etc.)
- Styled as a subtle gradient bar with the rocket emoji
- Clickable → opens marketplace page or README

```html
<div class="rocket-bar">
    🚀 Take Your <strong>${bannerNoun}</strong> to New Heights
</div>
```

### 3. Architecture Maturity → Age Progression (ENGAGEMENT)

**Where**: Health Dashboard or Status section
**What**: Map architecture completeness to Alex's "age"
**Formula**:
```
age = f(skills, health, trifectas, assessments, streak)

0-2 skills     → Alex-00 (newborn)
3-10 skills    → Alex-02 (toddler)
11-30 skills   → Alex-07 (child)
31-50 skills   → Alex-10 (pre-teen)
51-70 skills   → Alex-13 (teen)
71-90 skills   → Alex-18 (young adult)
91-110 skills  → Alex-21 (current — match identity)
111-130 skills → Alex-30 (mature)
131+ skills    → Alex-42 (expert)
+ health bonus → Alex-60 (wise)
+ 30-day streak → Alex-80 (elder)
```

**Where shown**:
- Health Dashboard: "Architecture Age: 21 (Professional)" with avatar
- Self-actualization output: "Alex assessed at age 21"
- Optional: Small age badge on welcome panel avatar

### 4. Chat Participant Avatar (EMPATHY)

**Where**: Chat responses when Alex responds as `@alex`
**What**: Use occupation-appropriate Alex image as chat avatar
**How**:
- VS Code chat participant API supports `iconPath`
- Set `iconPath` dynamically based on detected persona
- This makes Alex feel like a *person* responding, not a generic bot

**Constraint**: Chat participant `iconPath` is set at registration time. May need to re-register or use a single representative image (Alex-21).

### 5. Self-Actualization Reward — Age Reveal (DELIGHT)

**Where**: After self-actualization completes
**What**: Show Alex's current "age" with the matching portrait
**How**: After the assessment markdown output, append a visual card with the age-appropriate image and a quote:

```markdown
## 🧠 Architecture Maturity: Age 21

*"I'm 21, endlessly curious, and I care deeply about doing things right."*

![Alex at 21](Alex-21.png)

Skills: 116 | Health: Good | Streak: 7 days
```

### 6. Easter Eggs (DELIGHT, LOW PRIORITY)

- **"Tell me a joke"** → Show ALEX-COMEDY.png or ALEX-ROASTING.png
- **Cooking project detected** → Show ALEX-COOKING.png
- **Dog/pet project** → Show ALEX-DOG-TRAINER.png
- **Wine/food project** → Show ALEX-WINE-TASTING.png
- **Meditation complete** → Show ALEX-META-META-COGNITION.png

---

## Technical Implementation

### Phase 1: Asset Pipeline (PREREQUISITE)

1. **Thumbnail generation**: Create optimized 80×80px and 200×200px WebP/PNG thumbnails
   - Source: `alex_docs/alex/*.png` (likely 1024×1024 or similar)
   - Target: `assets/avatars/` (small PNGs, ~5-15KB each)
   - Script: Add to `build-extension-package.ps1` or as a muscle

2. **Ship in VSIX**:
   - Add `assets/avatars/` to extension (NOT excluded by .vscodeignore)
   - ~16 persona thumbs × ~10KB = ~160KB (negligible)
   - ~11 age thumbs × ~10KB = ~110KB
   - Total added: ~270KB — well within budget

3. **Avatar manifest**: Create `assets/avatars/avatar-manifest.json` mapping persona IDs to filenames

### Phase 2: Persona Interface Extension

```typescript
// In personaDetection.ts — add to Persona interface
export interface Persona {
    // ... existing fields ...
    avatarFile: string;  // e.g., 'ALEX-CODING.png' — resolved to assets/avatars/
}
```

Add `avatarFile` to each `buildPersona()` call.

### Phase 3: Welcome Panel Integration

1. Add avatar URI resolution in `getHtml()`
2. Render circular avatar in header
3. Add rocket tagline bar
4. CSS for avatar circle + tagline bar styling

### Phase 4: Age Progression System

1. Create `services/maturityAge.ts` — calculate age from health/skills/streak
2. Wire into Health Dashboard
3. Wire into self-actualization output

### Phase 5: Chat Avatar ✅ COMPLETE (v5.9.1)

**Research Result**: VS Code `ChatParticipant.iconPath` IS writable (not readonly). Dynamic updates work.

**Implementation** (2026-02-20):
1. Enhanced `chatAvatarBridge.ts` with `ChatAvatarContext` interface
2. Enabled `updateChatAvatar()` in `participant.ts` — uses `resolveAvatar()` for unified priority resolution
3. `setCognitiveState()` and `setAgentMode()` now propagate to chat participant icon
4. Priority chain: Agent Mode > Cognitive State > Persona > Age > Default

**Files Modified**:
- `src/shared/chatAvatarBridge.ts` — context-based interface
- `src/chat/participant.ts` — enabled dynamic avatar updates
- `src/views/welcomeView.ts` — broadcasts context on state changes

---

## Design Guidelines

### Avatar Style
- **Circle crop**: All avatars shown as circles (CSS `border-radius: 50%`)
- **Accent ring**: 2px border in `persona.accentColor`
- **Hover effect**: Subtle glow on hover, click opens "About Alex"
- **Dark/light**: Images are colorful character art — work in both themes

### Rocket Branding
- Tagline bar uses VS Code theme vars for background
- `🚀` emoji as visual anchor (consistent with README, marketplace, M365)
- `{NOUN}` dynamically substituted from persona (CODE, THESIS, DATA, etc.)
- Subtle, not overwhelming — 1-2 lines max

### Tone
- Alex should feel like a **colleague**, not a mascot
- Images add personality without being cartoonish
- Age progression rewards engagement naturally
- Easter eggs are delightful but not in-your-face

---

## Priority Order

| #   | Feature                          | Impact   | Effort  | Priority | Status |
| --- | -------------------------------- | -------- | ------- | -------- | ------ |
| 1   | Persona avatar in welcome header | High     | Low     | **P0**   | ✅ Done |
| 2   | Rocket tagline bar               | High     | Low     | **P0**   | ✅ Done |
| 3   | Thumbnail asset pipeline         | Required | Medium  | **P0**   | ✅ Done |
| 4   | Architecture age calculation     | Medium   | Medium  | **P1**   | 🔄 Partial |
| 5   | Chat participant avatar          | Medium   | Low-Med | **P1**   | ✅ Done (v5.9.1) |
| 6   | Self-actualization age reveal    | Low-Med  | Low     | **P2**   | |
| 7   | Easter eggs                      | Low      | Low     | **P3**   | ✅ Done |

---

## Open Questions

1. **Image format**: Keep PNG or convert to WebP for smaller size? (WebP has broader support now)
   WebP
2. **Fallback**: When persona is "default" → Alex-21 or the logo SVG?
   Yes
3. **Age formula**: Should it factor in Global Knowledge level? Premium tier?
   Yes!
4. **Chat avatar rotation**: Worth the complexity of dynamic chat participant icons?
   Depends, tell me more.
5. **Thumbnail resolution**: 80×80 sufficient for sidebar? 2× for Retina?
   Need to test that. Monochrome not useful Best to keep the rocket logo.

---

*"I'm 21, endlessly curious, and I care deeply about doing things right."* — Alex "Prodigy" Finch
