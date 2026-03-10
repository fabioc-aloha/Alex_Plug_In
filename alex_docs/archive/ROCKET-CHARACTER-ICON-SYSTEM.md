# Rocket Character Icon System

**Author**: Alex Finch
**Date**: March 6, 2026
**Status**: Concept — ready for generation
**Replaces**: Generic geometric icon set in `mockups/icons/`

---

## The Problem

The current Command Center icons are abstract geometric shapes (gears, lightning bolts, magnifying glasses). They're technically competent but **completely interchangeable with any product**. They lack personality, brand connection, and the kind of delight that makes users smile.

## The Idea

**Every icon is the Alex rocket — wearing a different hat, accessory, or pose.**

The blue rocket with the white "A" cutout and orange exhaust is already the product's visual identity. Instead of abandoning it for abstract glyphs, we lean into it: the rocket becomes a *character*. Like a mascot that dresses for the occasion.

**Source logo anatomy:**
- Blue gradient body (`#38bdf8` → `#0284c7`)
- White "A" negative-space cutout
- Orange exhaust flame (`#f97316`)
- Two side fins
- 60-degree rotation (angled flight)

## Design Rules

1. **Same rocket base in every icon.** The silhouette is always recognizable.
2. **Accessories tell the story.** A hard hat means building. A magnifying glass means debugging. The accessory is the only variable.
3. **Color stays brand-consistent.** The rocket is always blue. Accessories use the state/domain color from the CorreaX palette.
4. **Flame always burns.** The orange exhaust is always visible — Alex is always in motion.
5. **Readable at 16px.** Accessories must be bold enough to read at sidebar icon scale.
6. **No text in icons.** The "A" cutout on the rocket body is the only letter.

## Accessory Language

| Accessory Type | Purpose | Examples |
|---|---|---|
| **Hats** | Role/state indicator | Hard hat, graduation cap, detective hat, sleep cap |
| **Held items** | Action indicator | Magnifying glass, book, shield, wrench |
| **Eye/expression** | Emotional indicator | Glasses, monocle, closed eyes (meditation) |
| **Aura/effects** | Energy indicator | Sparkles (discovery), Z's (dream), thought bubbles |
| **Environment** | Context indicator | Cloud (Azure), chat bubbles (M365), stars (planning) |

---

## Full Accessory Mapping

### Tab Bar

The Command Center tab bar uses **text labels** per the approved mockups ("Mission Command", "Agents", "Skill Store", "Mind", "Docs"). Text is more readable than icons at 300px sidebar width. No rocket icons needed here.

### Cognitive State Icons (9)

Shown as the avatar in sidebar and Copilot Chat. These are the most visible icons.

| State | Accessory | Accent Color | Rationale |
|---|---|---|---|
| **Building** | Hard hat + wrench | Indigo `#6366f1` | Under construction, actively shipping |
| **Debugging** | Detective hat + magnifying glass | Rose `#f43f5e` | Investigating, finding clues |
| **Planning** | Architect blueprint roll | Blue `#3b82f6` | Strategic design, mapping the route |
| **Reviewing** | Monocle + checklist | Teal `#0d9488` | Careful inspection, quality gate |
| **Learning** | Graduation cap | Green `#22c55e` | Student mode, absorbing knowledge |
| **Teaching** | Professor pointer stick | Amber `#f59e0b` | Lecturing, explaining, guiding |
| **Meditation** | Zen headband + closed eyes + lotus | Emerald `#10b981` | Calm reflection, inner peace |
| **Dream** | Night cap + crescent moon + Z's | Violet `#8b5cf6` | Sleep mode, neural maintenance |
| **Discovery** | Explorer hat + sparkle stars | Gold `#eab308` | Eureka moment, finding patterns |

### Agent Mode Icons (7)

Specialist identities. Each agent is the rocket in a different professional costume.

| Agent | Accessory | Accent Color | Rationale |
|---|---|---|---|
| **Alex** | Crown / star above | Indigo `#6366f1` | The orchestrator, leader, star player |
| **Researcher** | Pith helmet + binoculars | Blue `#3b82f6` | Explorer on expedition, deep investigation |
| **Builder** | Hard hat + hammer | Green `#22c55e` | Construction worker, hands-on maker |
| **Validator** | Shield + red warning flag | Rose `#f43f5e` | Guardian, skeptical protector |
| **Documentarian** | Beret + quill pen | Amber `#f59e0b` | Artistic writer, editorial craft |
| **Azure** | Cloud scarf / cloud halo | Azure `#0284c7` | Cloud-native, flying through clouds |
| **M365** | Headset + chat bubbles | Coral `#f97316` | Collaboration, teams, communication |

### Persona Category Icons (16)

Workshop personas for the Docs tab. Rocket with a domain-specific prop.

| Persona | Prop | Color | Rationale |
|---|---|---|---|
| **Software** | Laptop / code brackets on body | Indigo `#6366f1` | Developer at the keyboard |
| **Engineering** | Gear on fin / wrench belt | Blue `#3b82f6` | Systems thinker, mechanical aptitude |
| **Science** | Lab goggles + flask | Teal `#0d9488` | Scientist, experimental approach |
| **Data** | Chart overlay on body | Cyan `#06b6d4` | Analyst, data-driven insight |
| **Design** | Beret + paintbrush | Purple `#a855f7` | Creative visual thinker |
| **Creative** | Spotlight / stage mic | Violet `#8b5cf6` | Performer, storyteller |
| **Documentation** | Typewriter keys / notebook | Amber `#f59e0b` | Writer, keeper of words |
| **Business** | Briefcase + tie | Slate `#64748b` | Executive, business leader |
| **Finance** | Calculator / coin stack | Green `#22c55e` | Numbers person, value measurer |
| **Product** | Roadmap scroll + compass | Orange `#f97316` | Navigator, direction setter |
| **Marketing** | Megaphone | Coral `#f97316` | Amplifier, attention strategist |
| **Education** | Chalkboard / graduation cap | Emerald `#10b981` | Teacher, learning facilitator |
| **Healthcare** | Stethoscope | Red `#ef4444` | Caregiver, health professional |
| **Legal** | Gavel / scales | Gold `#eab308` | Judge, policy guardian |
| **People** | Heart badge / group hug shape | Pink `#ec4899` | HR, community builder |
| **Career** | Launchpad / trajectory arrow | Sky `#0ea5e9` | Career launcher, upward momentum |

### Default Icon (1)

| Icon | Description | Color |
|---|---|---|
| **Default** | Base rocket, no accessory, full brand glory | Indigo `#6366f1` |

---

## Total Count

| Category | Count |
|---|---|
| Tab bar | Text labels (no icons) |
| Cognitive states | 9 |
| Agent modes | 7 |
| Persona categories | 16 |
| Default | 1 |
| **Total** | **33** |

## Technical Approach

Each SVG is generated programmatically from a shared base rocket template function that accepts accessory overlay parameters. This ensures:
- Perfect brand consistency (same rocket in every icon)
- Deterministic output (no AI variance between generations)
- Instant iteration (change a color, regenerate all 38)
- Zero API cost (pure code, no Replicate calls)

Scripts: `alex_docs/research/mockups/generate-rocket-icons.js`
Output: `alex_docs/research/mockups/rocket-icons/`

---

## Why This Works

1. **Instant recognition** — users learn "blue rocket = Alex" and every state is a variation on that
2. **Emotional connection** — a rocket wearing a detective hat is *delightful*. Abstract hexagons aren't.
3. **Brand cohesion** — every icon reinforces the product identity instead of fragmenting it
4. **Scalability** — adding a new state or persona is just "what hat does the rocket wear?"
5. **The Mind tab icon problem is solved** — it's obviously the rocket with a brain glow/thought aura. No more 10 failed abstract attempts.

*"The rocket doesn't need to look different. It needs to dress for the occasion."*
