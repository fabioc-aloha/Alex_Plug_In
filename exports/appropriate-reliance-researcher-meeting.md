# Appropriate Reliance in Cognitive AI Architectures: Research Discussion

## Target Audience
Principal Researcher, Microsoft Research — Human-AI Collaboration

## Presentation Purpose
Research collaboration discussion on implementing and measuring appropriate reliance in AI systems

---

## Slide 1: Title

**Implementing Appropriate Reliance in a Cognitive AI Architecture**

A Technical Implementation with Research Opportunities

*Fabio Correa | Microsoft Corporation | February 2026*

---

## Slide 2: The Research Problem

**Miscalibrated Confidence Undermines Human-AI Teams**

Dell'Acqua et al. (2023) documented a surprising finding:

Human+AI teams can perform **worse** than either alone when reliance is miscalibrated

Two interrelated failures:
- **Hallucination**: AI generates plausible but incorrect information
- **Over-reliance**: Users accept without critical evaluation

Root cause: **No signals for when to trust vs. verify**

*Illustration: A Venn diagram showing human performance, AI performance, and miscalibrated team performance below both*

---

## Slide 3: AETHER Synthesis Framework

**What Does "Appropriate Reliance" Mean?**

From Passi, Dhanorkar, & Vorvoreanu (2024) — ~50 papers reviewed:

**Definition**: Users accept correct AI outputs AND reject incorrect ones

**Two Components** (Schemmer et al., 2023):
- **CAIR** — Correct AI-Reliance: Trust AI when AI is right
- **CSR** — Correct Self-Reliance: Trust self when AI is wrong

Metric: **AoR = 1** indicates optimal calibration

*Illustration: A 2x2 matrix with CAIR and CSR highlighted as the diagonal success cases*

---

## Slide 4: Research-Validated Interventions

**What Actually Works?**

| Intervention | Effect | Source |
|-------------|--------|--------|
| AI self-critiques | +50% error detection | Saunders et al. (2022) |
| Contrastive explanations | +20% accuracy when AI wrong | Si et al. (2023) |
| Background explanations | 61% → 47% incorrect acceptance | Goyal et al. (2023) |
| Low-confidence expressions | -25% false user confidence | Steyvers et al. (2024) |
| Uncertainty highlighting | +100% error detection | Spatharioti et al. (2023) |

*Illustration: Bar chart showing before/after effect sizes*

---

## Slide 5: The Alex Implementation

**A Living Testbed for AR Mechanisms**

Alex is a cognitive architecture with:
- **Structured memory systems**: Procedural, episodic, domain knowledge
- **Multi-platform deployment**: VS Code (developers) + M365 (knowledge workers)
- **Embedded AR protocols**: Confidence calibration, source grounding, mode separation

Currently deployed with ~7,000 lines of AR-specific protocol code

*Illustration: Architecture diagram showing layers from UI to core instructions*

---

## Slide 6: Key Innovation — Epistemic vs. Generative Modes

**Not All AI Output Needs the Same Calibration**

| Epistemic Mode | Generative Mode |
|----------------|-----------------|
| Factual claims | Creative ideas |
| 90% confidence ceiling | Collaborative validation |
| Source grounding required | Proposal framing |
| "According to docs..." | "Here's an idea..." |

**Key insight**: Applying epistemic constraints to creativity impoverishes collaboration

User-triggered via `/verify` and `/creative` commands

*Illustration: Split image - laboratory (epistemic) vs. artist studio (generative)*

---

## Slide 7: Confidence Ceiling Protocol

**Never Claim What You Can't Support**

Based on Lin et al. (2022) — models can verbalize calibrated uncertainty

| Content Type | Maximum Confidence |
|--------------|-------------------|
| Direct file reading | 100% |
| Documented patterns | 90% |
| Factual without source | 70% |
| Inference/edge cases | 50% |

The 90% ceiling communicates: "This should work, but verify"

*Illustration: A confidence gauge that maxes out at 90%, not 100%*

---

## Slide 8: Human Judgment Flagging

**Some Decisions Require Human Authority**

AI informs but doesn't decide:
- Business strategy and priorities
- Ethical dilemmas
- Personnel decisions
- Security architecture
- Legal/compliance matters

**Flagging pattern**: "I can outline the options, but the choice depends on your priorities around [tradeoff]."

*Illustration: A human figure at a decision crossroads with AI as advisor, not decider*

---

## Slide 9: The AIRS-16 Finding

**Trust Level May Not Be What Matters**

AIRS-16 (N=523, validated instrument):
- 8 constructs predicting AI adoption behavioral intention
- **Trust in AI (TR)** was only marginally significant: β=.106, p=.064

**Provocative question**:

Is it not *how much* you trust AI that predicts adoption, but *how well* your trust is calibrated to actual AI capability?

*Illustration: A thermometer (trust level) next to a compass (trust calibration)*

---

## Slide 10: Trust ≠ Appropriate Reliance

**Two Orthogonal Constructs**

| Trust (TR) | Appropriate Reliance (AR) |
|------------|---------------------------|
| Trust *level* | Trust *calibration* |
| "Do you trust AI?" | "Can you discern when trust is warranted?" |
| Attitude | Metacognitive skill |
| Low TR → under-utilization | Low AR → over-reliance OR under-reliance |

A user can score HIGH on TR + LOW on AR = dangerous over-reliance profile

*Illustration: 2x2 matrix showing TR vs AR with four distinct user personas*

---

## Slide 11: Proposed AIRS-18 Extension

**Adding Appropriate Reliance to the Instrument**

Two new items:

**AR1**: "I can tell when AI-generated information is reliable and when it needs verification."

**AR2**: "I know when to trust AI tools and when to rely on my own judgment instead."

Hypotheses:
- H1: AR shows discriminant validity from TR (HTMT < .85)
- H2: AR provides incremental validity beyond AIRS-16 (ΔR² > .02)
- H3: AR moderates TR→BI relationship

*Illustration: The AIRS instrument with a new AR construct being added*

---

## Slide 12: Platform Comparison Opportunity

**Natural Experiment: Developers vs. Knowledge Workers**

| Factor | VS Code | M365 Copilot |
|--------|---------|--------------|
| Population | Developers | Knowledge workers |
| Mode commands | Explicit `/verify`, `/creative` | Implicit inference |
| Verification affordances | Direct code execution | Limited to search |
| Cognitive forcing | Multi-turn scaffolds | Single-turn |

**H1**: VS Code Alex outperforms M365 Alex on AR metrics due to richer interaction affordances

*Illustration: Side-by-side comparison of two user personas with different tools*

---

## Slide 13: Measurement Challenges

**The Hard Problems**

| Challenge | Description | Potential Approach |
|-----------|-------------|-------------------|
| No ground truth | Can't always know if AI was correct | Strategy-graded approach (Fok & Weld, 2023) |
| Self-report limits | AR items measure *perceived* calibration | Behavioral validation with task studies |
| Selection bias | Developers self-select | Control for expertise |
| Domain specificity | AR may vary by task type | Modular measurement |

**Key question**: How do we measure AoR without ground truth for open-ended tasks?

*Illustration: A researcher looking at data with question marks*

---

## Slide 14: Collaboration Opportunities

**Research Questions We're Exploring**

1. **Calibration measurement**: How to measure AoR without ground truth?

2. **Mode detection**: Can we automatically detect when to switch modes?

3. **Intervention timing**: When should cognitive forcing functions interrupt?

4. **Longitudinal effects**: Does appropriate reliance decay over time?

5. **AIRS-18 validation**: Does AR provide incremental validity?

*Illustration: Two researchers collaborating over data and documents*

---

## Slide 15: What I'm Bringing to This Conversation

**Assets Available for Research**

| Asset | Description |
|-------|-------------|
| **Alex implementation** | Production cognitive architecture with AR protocols |
| **AIRS-16 instrument** | Validated scale (N=523), deployed at airs.correax.com |
| **Two platforms** | VS Code + M365 for cross-population comparison |
| **Instrumentation hooks** | Ready for telemetry on AR behaviors |
| **Article draft** | V5 comprehensive scholarly treatment (~1100 lines) |

**Looking for**: Measurement expertise, validation study design, Microsoft Research alignment

*Illustration: A handshake between research and implementation*

---

## Closing

**The Reframe**

From: "Build trust in AI"

To: "Build calibration — knowing when trust is warranted"

*"AI can bridge gaps of time, distance, and scale, but only if built correctly."*
— Jaime Teevan, Microsoft Chief Scientist

---

## Visual Style Guidance

- **Illustration style**: Research/academic aesthetic, clean diagrams, conceptual illustrations
- **Color palette**: Professional blues, academic greens, data visualization colors
- **Imagery**: Abstract concepts, matrices, frameworks, research metaphors
- **Tone**: Intellectual, collaborative, evidence-based
- **Avoid**: Corporate stock photos, overly polished marketing imagery
