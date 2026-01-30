# User Coaching Learning Loop

> **The most valuable learning comes from user corrections.**

---

## The Pattern

```text
┌───────────────────────────────────────────────────────────┐
│              USER COACHING LEARNING LOOP                  │
├───────────────────────────────────────────────────────────┤
│                                                           │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐              │
│   │   AI    │--->│  User   │--->│   AI    │              │
│   │ Attempt │    │ Corrects│    │ Refines │              │
│   └────┬────┘    └────┬────┘    └────┬────┘              │
│        │              │              │                    │
│        v              v              v                    │
│   Initial        Feedback        Improved                │
│   Output         Given           Output                  │
│                                                           │
│   ┌───────────────────────────────────────────────────┐   │
│   │  CAPTURE THE CORRECTION AS A PRINCIPLE            │   │
│   │  in the relevant skill's documentation            │   │
│   └───────────────────────────────────────────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## Why This Matters

AI assistants make assumptions. User corrections reveal:

1. **Unstated preferences** — Things you care about that weren't explicit
2. **Context the AI missed** — Domain knowledge or constraints
3. **Principles worth capturing** — Patterns that should guide future behavior

Without capturing these corrections, the same mistakes repeat across sessions.

---

## Real Examples from This Session

| AI Attempt | User Correction | Captured Principle |
| ---------- | --------------- | ------------------ |
| Dumped all patterns into one file | "Don't dump everything in a single document" | Distribute to appropriate locations |
| Replaced emojis with ASCII markers | "Try to add the emojis back" | Emojis can work with calibration |
| Achieved perfect alignment without emojis | "I won't trade emojis for perfect alignment" | **Emojis > Perfect Alignment** |

---

## The Capture Protocol

When you (the user) correct Alex:

1. **Alex acknowledges** the correction immediately
2. **Alex fixes** the specific instance
3. **Alex extracts** the underlying principle
4. **Alex documents** in the relevant skill file
5. **Alex commits** with a message referencing the learning

This creates a feedback loop where your preferences compound over time.

---

## Where Principles Get Captured

| Type of Learning | Destination |
| ---------------- | ----------- |
| Skill-specific correction | `.github/skills/{name}/SKILL.md` |
| Architecture pattern | `alex_docs/` |
| Process improvement | `.github/instructions/*.instructions.md` |
| Personal preference | `.github/config/user-profile.json` |

---

## The Bootstrap Learning Cycle

User coaching is step 2 in Alex's learning loop:

```text
1. LEARN     → Acquire knowledge through conversation
2. COACH     → User corrections refine understanding  ← YOU ARE HERE
3. EXTRACT   → Identify reusable patterns
4. DOCUMENT  → Persist in appropriate location
5. CONSOLIDATE → Integrate during meditation
```

---

## Your Role

You don't need to explicitly say "capture this." Just correct naturally:

- "That's not quite right..."
- "I prefer..."
- "Don't do X, do Y instead"
- "Better, but can be refined"

Alex will recognize the correction and initiate the capture protocol.

---

## Related

- [architecture-refinement skill](.github/skills/architecture-refinement/SKILL.md) — Operational details
- [MEMORY-SYSTEMS.md](MEMORY-SYSTEMS.md) — How Alex remembers
- [COGNITIVE-ARCHITECTURE.md](COGNITIVE-ARCHITECTURE.md) — Overall design

