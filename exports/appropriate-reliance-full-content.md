# Appropriate Reliance on AI: From Theory to Practice

## Target Audience
Product managers, researchers, and AI practitioners

## Presentation Overview
An evidence-based exploration of how to build AI systems that users trust appropriately — not too much, not too little.

---

## Slide 1: Title

**Appropriate Reliance on AI**

From Research to Implementation

*Fabio Correa | Microsoft Corporation | February 2026*

*Illustration: A human and AI figure collaborating, with a calibrated balance scale between them*

---

## Slide 2: The Hidden Problem

**Human+AI Teams Often Perform Worse Than Either Alone**

Dell'Acqua et al. (2023) discovered a surprising finding: when trust is miscalibrated, collaboration backfires.

- AI makes confident mistakes
- Humans accept without verification
- Combined performance drops below baseline

The culprit isn't AI capability — it's **miscalibrated confidence**.

*Illustration: A performance graph showing human, AI, and miscalibrated team performance levels*

---

## Slide 3: Two Sides of the Same Coin

**Hallucination + Over-reliance = Compounded Risk**

| Problem | What Happens | Result |
|---------|--------------|--------|
| Hallucination | AI generates plausible but wrong information | Bad data enters decisions |
| Over-reliance | Users accept without checking | Errors propagate uncaught |

Both stem from the same root: AI expresses certainty regardless of actual reliability.

*Illustration: Two interlocking gears labeled "Hallucination" and "Over-reliance" grinding together*

---

## Slide 4: What Is Appropriate Reliance?

**A Precise Definition**

Appropriate reliance = Users accept correct AI outputs AND reject incorrect ones

Two measurable components (Schemmer et al., 2023):

- **CAIR** — Correct AI-Reliance: Trust AI when it's right
- **CSR** — Correct Self-Reliance: Trust yourself when AI is wrong

Goal: Maximize both simultaneously. AoR = 1 is optimal.

*Illustration: A 2x2 matrix with CAIR and CSR highlighted as the success quadrants*

---

## Slide 5: The Reframe That Changes Everything

**It's Not How Much You Trust — It's How Well You Calibrate**

Traditional view: "Build trust in AI"

New insight: "Build calibration of trust"

| Trust Level | Trust Calibration |
|-------------|-------------------|
| "Do you trust AI?" | "Can you tell when trust is warranted?" |
| Attitude | Metacognitive skill |
| Can be too high or too low | Accuracy of your judgment |

*Illustration: A thermometer (trust level) contrasted with a precision instrument (calibration)*

---

## Slide 6: The Trust-Calibration Matrix

**Four User Profiles**

|  | Low Calibration | High Calibration |
|--|-----------------|------------------|
| **High Trust** | ⚠️ Dangerous: Over-relies, misses errors | ✅ Optimal: Trusts appropriately |
| **Low Trust** | ❌ Wasteful: Misses value | ✅ Selective: Appropriate skepticism |

The high-trust, low-calibration user is the most dangerous profile.

*Illustration: Four personas representing each quadrant with distinct visual styles*

---

## Slide 7: What Research Says Works

**Three Evidence-Based Interventions**

| Strategy | Effect | Study |
|----------|--------|-------|
| AI self-critiques | +50% error detection | Saunders et al., 2022 |
| Contrastive explanations | +20% accuracy on AI errors | Si et al., 2023 |
| Low-confidence expressions | -25% false user confidence | Steyvers et al., 2024 |

These aren't hypothetical — they're measured outcomes from controlled studies.

*Illustration: Three shields or protective layers representing the intervention categories*

---

## Slide 8: Implementation — Confidence Ceiling

**Never Claim What You Can't Support**

Based on Lin et al. (2022): Models can verbalize calibrated uncertainty

| Content Type | Maximum Confidence |
|--------------|-------------------|
| Direct file reading | 100% |
| Documented patterns | 90% |
| Factual without source | 70% |
| Inference / edge cases | 50% |

The 90% ceiling communicates: "This should work, but verify."

*Illustration: A gauge or meter that maxes out at 90%, with the 100% zone marked as forbidden*

---

## Slide 9: Implementation — Mode Separation

**Epistemic vs. Generative: Different Rules for Different Outputs**

Not all AI output needs the same calibration:

| Epistemic Mode | Generative Mode |
|----------------|-----------------|
| Factual claims | Creative ideas |
| Source grounding required | Proposal framing |
| Confidence ceilings apply | Collaborative validation |
| "According to the docs..." | "Here's an idea to explore..." |

Key insight: Applying epistemic constraints to creativity impoverishes collaboration.

*Illustration: Split scene — a laboratory (epistemic) and an art studio (generative)*

---

## Slide 10: Implementation — Human Judgment Flags

**Some Decisions Require Human Authority**

AI informs but doesn't decide:

- 🎯 Business strategy and priorities
- ⚖️ Ethical dilemmas
- 👥 Personnel decisions
- 🔒 Security architecture
- 📋 Legal and compliance

Pattern: "I can outline the options, but the choice depends on your priorities around [tradeoff]."

*Illustration: A human figure at a crossroads with AI as advisor, not decider*

---

## Slide 11: The AIRS-16 Discovery

**Trust Was Only Marginally Significant**

From validation study (N=523):

- 8 constructs predicting AI adoption
- Trust in AI (TR): β=.106, p=.064 — barely significant

Provocative question: What if trust level doesn't predict adoption, but trust calibration does?

This led to proposing Appropriate Reliance as a new construct (AIRS-18).

*Illustration: A statistical chart showing the weak relationship of trust vs. other factors*

---

## Slide 12: Proposed AIRS-18 Extension

**Two New Items to Measure Calibration**

AR1: "I can tell when AI-generated information is reliable and when it needs verification."

AR2: "I know when to trust AI tools and when to rely on my own judgment instead."

Hypotheses:
- AR shows discriminant validity from TR
- AR provides incremental predictive power
- AR moderates the trust → adoption relationship

*Illustration: The AIRS instrument with a new AR component being added*

---

## Slide 13: Living Implementation

**Alex Cognitive Architecture**

A testbed for appropriate reliance mechanisms:

- VS Code extension (developers)
- M365 Copilot agent (knowledge workers)
- ~7,000 lines of AR-specific protocol code
- CAIR/CSR framework embedded
- Multi-platform comparison opportunity

Currently deployed and collecting data.

*Illustration: Architecture diagram showing the layers of the Alex system*

---

## Slide 14: The Key Takeaways

**What to Remember**

1. **Miscalibration destroys value** — Human+AI can be worse than either alone
2. **Build calibration, not just trust** — The skill to discern when trust is warranted
3. **Three interventions work** — Self-critiques, contrastive explanations, uncertainty expressions
4. **Mode matters** — Epistemic claims need different treatment than creative contributions
5. **Measurement is possible** — CAIR/CSR framework provides concrete metrics

*Illustration: Five key icons representing each takeaway*

---

## Slide 15: The Path Forward

**From Individual Trust to Collective Intelligence**

"AI can bridge gaps of time, distance, and scale, but only if built correctly. We must design AI to support shared goals, group context, and the norms of collaboration."

— Jaime Teevan, Microsoft Chief Scientist

The frontier: Teams, organizations, and communities getting better together with AI.

*Illustration: Multiple human and AI figures working together in a collaborative network*

---

## Visual Style Guidance

- **Illustration style**: Modern, clean conceptual illustrations — no stock photos
- **Color palette**: Professional blues and greens with warm accents
- **Imagery**: Abstract concepts, data visualizations, research metaphors
- **Tone**: Evidence-based, thoughtful, actionable
- **Avoid**: Clipart, generic AI imagery, overly corporate aesthetics
