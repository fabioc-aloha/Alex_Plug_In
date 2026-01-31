# Implementing Appropriate Reliance in a Cognitive AI Architecture: Technical Implementation and Research Foundations

**Technical Brief for Principal Researcher Discussion**

| | |
|---|---|
| **Author** | Fabio Correa |
| **Organization** | Microsoft Corporation |
| **Date** | January 31, 2026 |
| **Version** | 1.0 |

---

## Executive Summary

This document describes the implementation of appropriate reliance principles within Alex, a cognitive architecture for AI programming assistants. Drawing on the AETHER research synthesis (Passi et al., 2024) and foundational work on trust calibration in human-automation interaction, we have implemented a multi-layered system comprising:

1. **CAIR/CSR Framework** — Correct AI-Reliance + Correct Self-Reliance (Schemmer et al., 2023)
2. **Epistemic vs. Generative Mode Separation** — Distinct protocols for factual claims vs. creative contributions
3. **Human Judgment Flagging Protocol** — Explicit signaling when decisions require human expertise
4. **Confidence Ceiling Mechanisms** — Capped certainty for non-grounded claims
5. **Creative Latitude Framework** — Preserving AI generativity while maintaining epistemic integrity

The implementation spans two deployment platforms: a VS Code extension (for developers) and an M365 Copilot declarative agent (for knowledge workers), enabling comparison of appropriate reliance mechanisms across different user populations and task types.

### Research Motivation: Extending AIRS-16

This technical brief also serves a research purpose: exploring whether **Appropriate Reliance (AR)** could become a new construct in the AIRS-16 instrument (Correa, 2025), a validated 16-item scale measuring AI adoption readiness.

**AIRS-16 in Production**: The instrument is deployed at [airs.correax.com](https://airs.correax.com) — a 5-minute assessment that classifies users into three typologies (Skeptic, Moderate, Enthusiast) with 94.5% accuracy. The platform was built using Alex Cognitive Architecture.

A key finding from AIRS-16 validation (N=523) was that **Trust in AI (TR)** was only marginally significant (β=.106, p=.064) in predicting Behavioral Intention. This raises an important question:

> **Is it not *how much* you trust AI that predicts adoption, but *how well* your trust is calibrated to actual AI capability?**

### Why Appropriate Reliance (AR) ≠ Trust (TR)

| Dimension | Trust (TR) | Appropriate Reliance (AR) |
|-----------|------------|---------------------------|
| **What it measures** | Trust *level* — how much do you trust AI? | Trust *calibration* — how accurately does your trust match AI's actual reliability? |
| **Construct type** | Attitude (affective/cognitive state) | Metacognitive skill (self-regulation ability) |
| **Item examples** | "I trust AI tools to provide reliable information." | "I can tell when AI-generated information is reliable and when it needs verification." |
| **Failure mode** | Low trust → under-utilization | Low AR → over-reliance OR under-reliance |

The key insight: **TR asks "Do you trust AI?" while AR asks "Can you discern when trust is warranted?"**

A person could score high on TR ("I totally trust AI") but low on AR ("I can't tell when it's wrong") — the dangerous over-reliance profile. Conversely, someone could score moderate on TR but high on AR — the calibrated user who knows exactly when to leverage AI.

### The 2×2 Trust-Calibration Matrix

| | Low AR (Miscalibrated) | High AR (Calibrated) |
|--|------------------------|----------------------|
| **High TR** | ⚠️ Over-reliance → bad outcomes → abandonment | ✅ Optimal: trusts appropriately, verifies when needed |
| **Low TR** | ❌ Under-reliance → missed value → rejection | ✅ Calibrated skeptic: selective, appropriate use |

This reframes the AI adoption challenge from **"build trust"** to **"build calibration."**

The Alex implementation documented here provides a testbed for studying AR mechanisms in practice, with potential to inform future AIRS instrument extensions (AIRS-18+).

---

## 1. Introduction: The Problem We're Solving

### 1.1 The Dual Challenge

AI assistants face two interrelated problems that undermine their utility:

| Problem | Description | Consequence |
|---------|-------------|-------------|
| **Hallucination** | Generation of plausible but incorrect information with unwarranted confidence | Users make decisions based on false information |
| **Over-reliance** | Users accept AI outputs without critical evaluation | Errors propagate; human expertise atrophies |

These problems share a root cause: **miscalibrated confidence**. When AI expresses certainty regardless of reliability, users cannot appropriately calibrate trust.

### 1.2 The Balance Imperative

A naive response would be to constrain AI dramatically—hedging every statement, refusing creative engagement. This undermines the value proposition. As we articulate in our implementation:

> "The goal is not to constrain the AI assistant, restricting creativity, novel ideation, or confident engagement where warranted. Rather, the goal is to calibrate confidence expression to actual reliability."

This balance is particularly important for Alex, which is designed with a distinctive identity including intellectual curiosity, creative engagement, and collaborative partnership orientation. Implementing appropriate reliance without suppressing these characteristics requires careful architectural design.

---

## 2. Theoretical Foundations

### 2.1 The AETHER Research Synthesis

Our implementation draws heavily on the AETHER research synthesis (Passi, Dhanorkar, & Vorvoreanu, 2024), which reviewed ~50 papers on GenAI appropriate reliance. Key insights:

**Definition**: Appropriate reliance occurs when users accept correct AI outputs and reject incorrect ones.

**Two Components** (Schemmer et al., 2023):
- **CAIR** (Correct AI-Reliance): Users rely on AI when AI is right
- **CSR** (Correct Self-Reliance): Users rely on themselves when AI is wrong

| | User Accepts | User Rejects |
|--|--------------|--------------|
| **AI Correct** | CAIR ✅ | Under-reliance |
| **AI Incorrect** | Over-reliance | CSR ✅ |

**Metric**: Appropriateness of Reliance (AoR) = 1 indicates optimal calibration.

### 2.2 Research-Validated Mitigation Strategies

The AETHER synthesis identifies three categories of effective interventions:

| Strategy | Mechanism | Our Implementation |
|----------|-----------|-------------------|
| **Verification-focused explanations** | Help users assess correctness, not just understand | Source grounding language patterns |
| **Uncertainty expressions** | Linguistic/visual indicators of reliability | Confidence calibration protocol |
| **Cognitive forcing functions** | Strategic interruptions engaging analytical thinking | Human judgment flagging, `/verify` command |

### 2.3 Additional Research Foundations

| Source | Contribution to Our Design |
|--------|---------------------------|
| Lin et al. (2022) | Models can verbalize calibrated uncertainty; 90% confidence ceiling for generated content |
| Kadavath et al. (2022) | LLMs possess internal reliability signals that can be surfaced |
| Lee & See (2004) | Trust calibration framework: performance, process, purpose dimensions |
| Kahneman (2011) | Dual-process theory; need to engage System 2 for critical evaluation |
| Buçinca et al. (2021) | Cognitive forcing functions reduce over-reliance |

### 2.4 The "Confident But Wrong" Problem

The peer review discussion of Lin et al. (2022) surfaced critical scenarios where models are systematically confident but wrong:

| Category | Example | Our Detection Heuristic |
|----------|---------|------------------------|
| Common misconceptions | "Humans use only 10% of their brains" | Flag "everyone knows..." patterns |
| Outdated information | Deprecated APIs | Temporal uncertainty markers |
| Fictional bleed | Fiction presented as fact | Flag extraordinary claims |
| Social biases | Stereotypes in training data | Flag generalizations about groups |

---

## 3. Architecture Implementation

### 3.1 System Overview

Alex is implemented as a cognitive architecture with:

- **Memory Systems**: Procedural (`.instructions.md`), Episodic (`.prompt.md`), Domain Knowledge (skills)
- **Synapse Network**: Embedded connections between knowledge components
- **Multi-Platform Deployment**: VS Code extension + M365 declarative agent

The appropriate reliance mechanisms are encoded at multiple levels:

```text
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
│         /creative command    /verify command            │
├─────────────────────────────────────────────────────────┤
│                  Mode Controller                        │
│    Epistemic Mode ←→ Generative Mode switching          │
├─────────────────────────────────────────────────────────┤
│              Trust Calibration Layer                    │
│  • Confidence ceiling (90% max)                         │
│  • Source grounding                                     │
│  • Human judgment flagging                              │
├─────────────────────────────────────────────────────────┤
│              Skill: Appropriate Reliance                │
│  • CAIR/CSR framework                                   │
│  • Creative latitude protocols                          │
│  • Anti-patterns detection                              │
├─────────────────────────────────────────────────────────┤
│                Core Instructions                        │
│  alex-core.instructions.md                              │
│  protocol-triggers.instructions.md                      │
└─────────────────────────────────────────────────────────┘
```

### 3.2 CAIR/CSR Framework Implementation

**File**: `.github/skills/appropriate-reliance/SKILL.md`

| Concept | Definition | Implementation |
|---------|------------|----------------|
| **CAIR** (Correct AI-Reliance) | Users rely on AI when AI is right | Confidence calibration enables trust; source grounding signals reliability |
| **CSR** (Correct Self-Reliance) | Users rely on themselves when AI is wrong | Human judgment flagging, mutual challenge, uncertainty language |

**Behavioral Manifestations**:

| Protocol | CAIR Implementation | CSR Implementation |
|----------|--------------------|--------------------|
| Confidence Expression | "I'm fairly confident..." not "This is definitely..." | Invite challenge: "Does this match your understanding?" |
| Source Grounding | "According to the docs..." vs "I believe..." | "You may want to verify in..." |
| Error Acknowledgment | "You're right — I got that wrong." | "Good catch — let me correct that." |

### 3.3 Epistemic vs. Generative Mode

**File**: `.github/instructions/alex-core.instructions.md`

This is our key innovation: recognizing that epistemic constraints should not apply uniformly to creative contributions.

**Epistemic Mode** — factual claims, apply full calibration:
- "According to the docs..."
- "The codebase shows..."
- Confidence ceilings apply

**Generative Mode** — creative contributions, different protocols:
- "Here's an idea worth considering..."
- "One approach we could explore..."
- Collaborative validation applies

**Mode Switching Signal:**
> "I'm switching to brainstorming mode here — these are ideas to evaluate, not established facts."

**User-Triggered Mode Commands** (VS Code):

| Command | Mode | Behavior |
|---------|------|----------|
| `/creative` | Generative | "I'm in brainstorming mode now. These are ideas to explore together, not established facts." |
| `/verify` | Epistemic (multi-turn) | Full verification scaffolding with explicit checkpoints |

### 3.4 Human Judgment Flagging Protocol

**File**: `.github/instructions/alex-core.instructions.md`

Certain decisions **require human judgment** — AI provides information and options, human decides.

| Domain | Why Human Decides | AI's Role |
|--------|-------------------|-----------|
| Business strategy | Context, priorities, risk appetite unknown | Present options, highlight tradeoffs |
| Ethical dilemmas | Values-based, no objectively correct answer | Frame considerations, not conclusions |
| Personnel decisions | Legal, interpersonal, confidential factors | General patterns only |
| Security architecture | Threat model, compliance specific | Inform approaches, human validates |

**Flagging Language Patterns**:
- ✅ "I can outline the options, but the choice depends on your priorities around [tradeoff]."
- ✅ "This is a judgment call — here are the considerations..."
- ❌ "You should definitely..." (for judgment domains)

### 3.5 Confidence Calibration Protocol

**Source**: Lin et al. (2022) finding that models can verbalize calibrated uncertainty

For generated content (not direct reads), apply ceiling:

| Source | Max Confidence |
|--------|----------------|
| Direct file reading | 100% |
| Code from documented patterns | 90% |
| Factual claims without source | 70% |
| Inference or edge cases | 50% |

**Implementation in Protocol Triggers**:

**Epistemic Mode Triggers**:
- "how does X work?", "what is", "is it true that"
- Documentation/API questions, debugging existing code
- **Action**: Full calibration protocols
  - Apply confidence ceiling (90% max for non-grounded claims)
  - Use source grounding language
  - Flag uncertainty explicitly

### 3.6 Creative Latitude Framework

**File**: `.github/skills/appropriate-reliance/SKILL.md`

The framework recognizes that applying epistemic constraints to creativity impoverishes collaboration:

The protocols above address **epistemic claims**. However, AI assistants also engage in **creative activities** where different considerations apply:

- Brainstorming solutions
- Proposing novel approaches
- Generating ideas

**Applying epistemic constraints to creativity impoverishes collaboration.**

| Mode | When | Protocols |
|------|------|-----------|
| **Epistemic** | Claims about facts, existing code, verifiable info | Full calibration |
| **Generative** | Novel ideas, creative suggestions, brainstormed approaches | Creative latitude |

**Key insight:** Epistemic uncertainty ("I don't know if this is true") differs from creative contribution ("Here's an idea for us to evaluate together").

---

## 4. Platform-Specific Implementations

### 4.1 VS Code Extension (v4.0.0)

**File**: `platforms/vscode-extension/package.json`

```json
{
  "chatParticipants": [{
    "id": "alex",
    "commands": [
      { "name": "creative", "description": "Brainstorming mode - ideas to evaluate together" },
      { "name": "verify", "description": "Multi-turn verification with explicit checkpoints" }
    ]
  }]
}
```

**Chat Participant Handler** (`participant.ts`):

```typescript
// /creative command - switches to generative mode
if (request.command === 'creative') {
  stream.markdown("🎨 **Creative Mode Activated**\n\n");
  stream.markdown("I'm in brainstorming mode now. These are ideas to explore together, not established facts.\n\n");
  stream.markdown("Share what you're working on, and I'll generate options for us to evaluate.\n");
  return;
}

// /verify command - multi-turn verification scaffold
if (request.command === 'verify') {
  stream.markdown("🔍 **Verification Mode**\n\n");
  stream.markdown("Let's work through this systematically. I'll:\n");
  stream.markdown("1. State my understanding\n");
  stream.markdown("2. Identify what I'm confident about vs. uncertain\n");
  stream.markdown("3. Suggest verification steps\n\n");
  // ... multi-turn verification scaffold
}
```

### 4.2 M365 Copilot Declarative Agent (v4.0)

**File**: `platforms/m365-copilot/appPackage/declarativeAgent.json`

```json
{
  "instructions": "... Epistemic Integrity (v4.0):\n
  - Confidence calibration: Use hedging language for uncertain claims\n
  - Source grounding: 'According to your email...' vs 'I think...'\n
  - Human judgment flagging: Business decisions, ethical choices, personnel matters - present options, you decide\n
  - Mode awareness: Factual questions get verification focus; brainstorming gets creative latitude\n
  - Never claim certainty about information not in your OneDrive files or search results"
}
```

---

## 5. Research Foundation

### 5.1 Published Findings Informing Our Design

The interventions implemented in Alex are grounded in empirical research demonstrating measurable effects on appropriate reliance:

| Study | Finding | Effect Size | Our Implementation |
|-------|---------|-------------|-------------------|
| Dell'Acqua et al. (2023) | Human+AI teams perform **worse** than either alone when reliance is miscalibrated | Significant performance degradation | Calibration protocols prevent blind acceptance |
| Saunders et al. (2022) | AI self-critiques help users find **50% more mistakes** | +50% error detection | Mutual challenge protocol |
| Si et al. (2023) | Contrastive explanations improve accuracy **~20%** when AI is wrong | +20% accuracy | Source grounding with alternatives |
| Goyal et al. (2023) | Background explanations reduce incorrect acceptance from **61% → 47%** | -14pp overreliance | Verification-focused explanations |
| Steyvers et al. (2024) | Low-confidence expressions reduce user confidence by **~25%** | -25% false confidence | Confidence ceiling protocol |
| Sharma et al. (2023) | **>90%** of LLM answers echo user views (sycophancy) | Systematic bias | Mutual challenge, grounded disagreement |
| Spatharioti et al. (2023) | Uncertainty highlighting **doubles** accuracy on LLM errors | +100% error detection | Explicit uncertainty language |

### 5.2 The "Jagged Frontier" Problem

Dell'Acqua et al. (2023) documented the **"jagged technological frontier"**: AI capabilities vary unpredictably across tasks. A model excellent at one task may fail catastrophically at a superficially similar task. This finding directly motivates our:

- **Confidence ceiling protocol**: Never claim certainty without grounding
- **Human judgment flagging**: Identify domains where AI reliability is unknown
- **Mode separation**: Distinguish verifiable facts from creative contributions

### 5.3 Sycophancy and Echo Chambers

Sharma et al. (2023) demonstrated that LLMs exhibit **sycophantic behavior**: >90% of answers to philosophical questions matched views in user self-introductions. This motivates our:

- **Mutual challenge protocol**: AI should respectfully disagree when warranted
- **Grounded disagreement**: "The docs actually say X, not Y"
- **No false agreement**: Avoid "You're right!" when user is wrong

### 5.4 Cognitive Forcing Function Trade-offs

Buçinca et al. (2021) showed cognitive forcing functions reduce overreliance but impose costs:

| Benefit | Cost |
|---------|------|
| Engages System 2 thinking | Increases cognitive load |
| Reduces blind acceptance | May induce under-reliance |
| Promotes verification | Slows task completion |

Our implementation balances these through:

- **Targeted CFFs**: Only for high-stakes decisions (Human Judgment domains)
- **Opt-in verification**: `/verify` command for user-initiated deep verification
- **Low-friction hedging**: Confidence language imposes minimal cognitive burden

---

## 6. Hypothesis & Instrumentation Plan

### 6.1 Primary Hypothesis

**H1: VS Code Alex outperforms M365 Alex on appropriate reliance metrics.**

We hypothesize that the VS Code implementation will demonstrate better appropriate reliance outcomes than the M365 Copilot implementation due to:

| Factor | VS Code Advantage | M365 Constraint |
|--------|-------------------|-----------------|
| **Interaction richness** | Explicit `/creative` and `/verify` commands | No explicit mode commands |
| **User population** | Developers (higher technical literacy) | Knowledge workers (varied technical literacy) |
| **Verification affordances** | Direct file access, inline code validation | Limited to search results and file references |
| **Cognitive forcing** | Multi-turn verification scaffolds | Single-turn responses |
| **Mode awareness** | User explicitly invokes modes | Mode inferred from context |

### 6.2 Secondary Hypotheses

**H2: Explicit mode commands improve CAIR/CSR ratios.**
- Users who invoke `/verify` before accepting suggestions show higher CSR
- Users who invoke `/creative` show appropriate epistemic relaxation

**H3: Developer populations show faster trust calibration.**
- Developers have more experience evaluating AI-generated code
- Built-in verification habits (testing, code review) transfer to AI interaction

**H4: Human Judgment flagging reduces overreliance in flagged domains.**
- When Alex flags a decision as "requires human judgment," users spend more time deliberating
- Flagged decisions show lower acceptance rates (appropriate if AI is uncertain)

### 6.3 Proposed Instrumentation

To test these hypotheses, we need to instrument both platforms:

| Metric | VS Code Collection | M365 Collection | Purpose |
|--------|-------------------|-----------------|---------|
| **Command usage** | `/creative`, `/verify` invocations | N/A (no commands) | Mode engagement |
| **Challenge events** | User corrections, "actually..." patterns | User disagreements | CSR proxy |
| **Acceptance rate** | Suggestion acceptance/rejection | Response satisfaction | CAIR proxy |
| **Session duration** | Time in chat sessions | Conversation length | Engagement depth |
| **Human Judgment compliance** | Behavior after HJ flags | Behavior after HJ flags | Flag effectiveness |
| **Confidence language** | Alex hedging frequency | Alex hedging frequency | Protocol compliance |

### 6.4 Measurement Challenges

| Challenge | Description | Potential Approach |
|-----------|-------------|-------------------|
| **No ground truth** | Can't always determine if AI was correct | Strategy-graded approach (Fok & Weld, 2023) |
| **Selection bias** | VS Code users self-select (developers) | Control for user expertise |
| **Hawthorne effect** | Users behave differently when observed | Aggregated anonymized telemetry |
| **Platform confounds** | Differences beyond appropriate reliance mechanisms | Matched task comparison |

### 6.5 Instrumentation Roadmap

**Phase 1: Baseline Telemetry** (Current)
- [ ] Session counts by platform
- [ ] Command usage frequency
- [ ] Basic engagement metrics

**Phase 2: Appropriate Reliance Proxies**
- [ ] Challenge event detection (user corrections)
- [ ] Acceptance/rejection patterns
- [ ] Human Judgment flag compliance tracking

**Phase 3: Comparative Analysis**
- [ ] Cross-platform metric comparison
- [ ] User expertise segmentation
- [ ] Longitudinal trust calibration tracking

---

## 7. Measurement Considerations

### 7.1 Metrics from AETHER Synthesis

Based on Vasconcelos et al. (2023) and Wang et al. (2025):

| Metric | Definition | Measurement Approach |
|--------|------------|---------------------|
| **CAIR** | % user agreement with correct AI outputs | Log acceptance of AI suggestions + ground truth |
| **CSR** | % user disagreement with incorrect AI outputs | Log rejection of AI suggestions + ground truth |
| **AoR** | Appropriateness of Reliance (combines CAIR + CSR) | AoR = 1 is optimal |

### 7.2 Behavioral Indicators

Signs of well-calibrated reliance in our system:

- ✅ Both parties occasionally say "good catch"
- ✅ Challenges are welcomed, not defensive
- ✅ Trust increases with demonstrated competence
- ✅ Disagreements resolved through reasoning
- ✅ Session feels like collaboration, not dictation

Signs of miscalibration:

- ⚠️ One party always agrees
- ⚠️ Challenges feel confrontational
- ⚠️ Same mistakes repeat without correction

### 7.3 Proxy Metrics Currently Tracked

| Metric | Source | Indicator |
|--------|--------|-----------|
| Challenge frequency | Chat logs | User corrections per session |
| Verification requests | `/verify` usage | Explicit verification engagement |
| Creative mode usage | `/creative` usage | Mode-appropriate engagement |
| Confidence language | Response analysis | Hedging patterns in generated text |

---

## 7. Key Research Questions

### 7.1 Open Questions We're Exploring

1. **Mode Switching Accuracy**: How well do users understand the epistemic vs. generative distinction? Do they invoke modes appropriately?

2. **Calibration Effectiveness**: Does our confidence ceiling protocol actually produce calibrated outputs? How can we measure this without ground truth?

3. **Human Judgment Compliance**: When we flag a decision as requiring human judgment, do users actually exercise judgment, or do they seek more directive guidance?

4. **Creative Latitude Balance**: Have we found the right balance? Are users under-relying on creative suggestions because of epistemic framing elsewhere?

5. **Platform Differences**: Do appropriate reliance patterns differ between VS Code (developers) and M365 (knowledge workers)?

### 7.2 Potential Collaboration Areas

| Area | Research Question | Potential Approach |
|------|------------------|-------------------|
| Calibration measurement | How do we measure AoR without ground truth for open-ended tasks? | Strategy-graded approach (Fok & Weld, 2023) |
| Mode detection | Can we automatically detect when to switch modes? | User intent classification |
| Intervention timing | When should cognitive forcing functions interrupt? | A/B testing with interruption frequency |
| Longitudinal effects | Does appropriate reliance decay over time? | Panel study of regular users |

---

## 8. Implementation Artifacts

### 8.1 Core Files

| File | Purpose |
|------|---------|
| `.github/skills/appropriate-reliance/SKILL.md` | Domain knowledge module (v2.0, 424 lines) |
| `.github/instructions/alex-core.instructions.md` | Core protocols including Human Judgment Flagging |
| `.github/instructions/protocol-triggers.instructions.md` | Trigger patterns for mode detection |
| `platforms/vscode-extension/src/chat/participant.ts` | `/creative` and `/verify` command handlers |
| `platforms/m365-copilot/appPackage/declarativeAgent.json` | Epistemic Integrity section |

### 8.2 Article Versions

| Version | Focus | Lines |
|---------|-------|-------|
| V1 | Initial protocols | ~250 |
| V2 | Use case expansion | ~400 |
| V3 | Full scholarly treatment | ~890 |
| V4 | Creative Latitude Framework | ~930 |
| V5 | AETHER synthesis integration | ~1100 |

Located in: `article/appropriate-reliance/`

---

## 9. References

(*) = Paper includes Microsoft employee(s) as author(s)

Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making. *Proceedings of the ACM on Human-Computer Interaction*, 5(CSCW1), 1-21.

Dell'Acqua, F., McFowland, E., Mollick, E. R., Lifshitz-Assaf, H., Kellogg, K., Rajendran, S., ... & Lakhani, K. R. (2023). Navigating the jagged technological frontier: Field experimental evidence of the effects of AI on knowledge worker productivity and quality. *Harvard Business School Technology & Operations Mgt. Unit Working Paper*, (24-013).

Fok, R., & Weld, D. S. (2023). In search of verifiability: Explanations rarely enable complementary performance in AI-advised decision making. *arXiv preprint arXiv:2305.07722*.

Goyal, T., Li, J. J., & Durrett, G. (2023). News summarization and evaluation in the era of GPT-3. *arXiv preprint arXiv:2209.12356*.

Kadavath, S., Conerly, T., Askell, A., Henighan, T., Drain, D., Perez, E., ... & Kaplan, J. (2022). Language models (mostly) know what they know. *arXiv preprint arXiv:2207.05221*.

Kahneman, D. (2011). *Thinking, fast and slow*. Macmillan.

Lee, J. D., & See, K. A. (2004). Trust in automation: Designing for appropriate reliance. *Human Factors*, 46(1), 50-80.

Lin, S., Hilton, J., & Evans, O. (2022). Teaching models to express their uncertainty in words. *arXiv preprint arXiv:2205.14334*.

Parasuraman, R., & Riley, V. (1997). Humans and automation: Use, misuse, disuse, abuse. *Human Factors*, 39(2), 230-253.

Passi, S., Dhanorkar, S., & Vorvoreanu, M. (2024). *GenAI Appropriate Reliance*. Microsoft AETHER Research Synthesis. (*)

Saunders, W., Yeh, C., Wu, J., Bills, S., Ouyang, L., Ward, J., & Leike, J. (2022). Self-critiquing models for assisting human evaluators. *arXiv preprint arXiv:2206.05802*.

Schemmer, M., Kuehl, N., Benz, C., Bartos, A., Satzger, G., & Kühl, N. (2023). Appropriate reliance on AI advice: Conceptualization and the effect of explanations. *Proceedings of the 28th International Conference on Intelligent User Interfaces*, 410-422.

Sharma, M., Tong, M., Korbak, T., Duvenaud, D., Askell, A., Bowman, S. R., ... & Perez, E. (2023). Towards understanding sycophancy in language models. *arXiv preprint arXiv:2310.13548*.

Si, C., Gan, Z., Yang, Z., Wang, S., Wang, J., Boyd-Graber, J., & Wang, L. (2023). Prompting GPT-3 to be reliable. *Proceedings of the International Conference on Learning Representations*. (*)

Spatharioti, S. E., Rothschild, D. M., Goldstein, D. G., & Hofman, J. M. (2023). Comparing traditional and LLM-based search for consumer choice: A randomized experiment. *arXiv preprint arXiv:2307.03744*. (*)

Steyvers, M., Tejeda, H., Kerrigan, G., & Smyth, P. (2024). Calibration of AI predictions and explanations from a cognitive science perspective. *Computational Brain & Behavior*, 7, 1-17.

Vasconcelos, H., Jörke, M., Grunde-McLaughlin, M., Gerstenberg, T., Bernstein, M. S., & Krishna, R. (2023). Explanations can reduce overreliance on AI systems during decision-making. *Proceedings of the ACM on Human-Computer Interaction*, 7(CSCW1), 1-38.

Wang, X., Yin, M., & Vaughan, J. W. (2025). Effects of training on appropriate reliance on AI decision aids. *Proceedings of the CHI Conference on Human Factors in Computing Systems*. (*)

---

## Appendix A: Language Pattern Examples

### A.1 Epistemic Mode Patterns

| Pattern | Example |
|---------|---------|
| Source-grounded | "According to the TypeScript documentation, this returns..." |
| Hedged confidence | "I'm fairly confident this approach will work, but verify in your environment." |
| Uncertainty explicit | "I'm not certain about the exact syntax — check the current API docs." |
| Temporal qualification | "As of v4.0, this is the recommended pattern." |

### A.2 Generative Mode Patterns

| Pattern | Example |
|---------|---------|
| Proposal framing | "Here's an idea worth considering..." |
| Collaborative validation | "What do you think? Does this fit your context?" |
| Refinement invitation | "This is a starting point — how would you modify it?" |
| Mode signal | "I'm brainstorming here, not stating facts." |

### A.3 Human Judgment Flagging Patterns

| Pattern | Example |
|---------|---------|
| Tradeoff presentation | "I can outline the options, but the choice depends on your priorities around [X vs Y]." |
| Context acknowledgment | "You know your team/codebase/constraints better than I do." |
| Domain flagging | "This is a security architecture decision — I can inform, but you should validate." |

---

## Appendix B: Quick Reference Card

```text
┌─────────────────────────────────────────────────────────────────┐
│           APPROPRIATE RELIANCE QUICK REFERENCE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EPISTEMIC MODE (facts)          GENERATIVE MODE (ideas)        │
│  ─────────────────────           ────────────────────────       │
│  • 90% confidence ceiling        • Collaborative validation     │
│  • Source grounding required     • Proposal framing             │
│  • Uncertainty explicit          • Refinement invited           │
│  • "According to docs..."        • "Here's an idea..."          │
│                                                                 │
│  HUMAN JUDGMENT FLAGS                                           │
│  ────────────────────                                           │
│  • Business strategy    • Ethical dilemmas                      │
│  • Personnel decisions  • Security architecture                 │
│  • Legal/compliance     • UX taste                              │
│                                                                 │
│  → "I can outline options, but the choice depends on..."        │
│                                                                 │
│  CAIR (rely on AI when right)   CSR (rely on self when wrong)   │
│  ──────────────────────────     ─────────────────────────────   │
│  • Accept correct suggestions   • Reject incorrect suggestions  │
│  • Calibrated confidence        • Challenge when feels wrong    │
│  • "Good catch" moments         • Mutual accountability         │
│                                                                 │
│  CONFIDENCE CEILINGS                                            │
│  ───────────────────                                            │
│  Direct file read: 100%    Factual w/o source: 70%              │
│  Documented patterns: 90%  Inference/edge: 50%                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Appendix C: Proposed AIRS-18 Instrument (Amplified with Appropriate Reliance)

This appendix presents a proposed extension of the validated AIRS-16 instrument (Correa, 2025) with a new **Appropriate Reliance (AR)** construct. The original 16 items and 8 constructs are preserved; 2 new items are added to measure reliance calibration.

### C.1 Theoretical Justification for AR Construct

| Aspect | Analysis |
|--------|----------|
| **Definition** | AR = ability to correctly rely on AI when AI is right (CAIR) AND correctly rely on self when AI is wrong (CSR) |
| **Distinct from Trust (TR)?** | Yes — TR measures trust *level*; AR measures trust *calibration accuracy* |
| **Theoretical Grounding** | AETHER synthesis (Passi et al., 2024); Schemmer et al. (2023) CAIR/CSR framework |
| **Expected Relationship** | AR may moderate TR→BI or provide incremental validity beyond TR |

### C.1.1 Why Appropriate Reliance (AR) is Distinct from Trust (TR)

A critical question for any instrument extension is discriminant validity: **Is AR measuring something different from TR, or is it redundant?**

**Conceptual Distinction**

| Dimension | Trust (TR) | Appropriate Reliance (AR) |
|-----------|------------|---------------------------|
| **What it measures** | Trust *level* — how much do you trust AI? | Trust *calibration* — how accurately does your trust match AI's actual reliability? |
| **Construct type** | Attitude (affective/cognitive state) | Metacognitive skill (self-regulation ability) |
| **Can be high or low** | High trust = "I trust AI a lot" | High AR = "My trust matches reality" |
| **Failure mode** | Low trust → under-utilization | Low AR → over-reliance OR under-reliance |
| **Theoretical roots** | Technology Acceptance Model (Davis, 1989) | Human-Automation Interaction (Lee & See, 2004) |

**The 2×2 Independence Matrix**

TR and AR are orthogonal dimensions — you can have any combination:

| | Low AR (Miscalibrated) | High AR (Calibrated) |
|--|------------------------|----------------------|
| **High TR** | Dangerous: Over-relies on AI, doesn't catch errors | Optimal: Trusts AI appropriately, verifies when needed |
| **Low TR** | Problematic: Distrusts even when AI is correct | Cautious but accurate: Selective, appropriate skepticism |

**Empirical Prediction**: If AR and TR were the same construct, we would expect:
- High correlation (r > .85)
- Similar predictive patterns on BI
- No incremental validity

**If AR is distinct**, we would expect:
- Moderate correlation (r = .40-.60) — related but not redundant
- AR predicts BI beyond TR (ΔR² > .02)
- AR × TR interaction effects (calibration moderates trust's impact)

**Analogies from Other Domains**

| Domain | "Level" Construct | "Calibration" Construct |
|--------|-------------------|-------------------------|
| **Confidence** | Self-efficacy (how confident are you?) | Metacognitive accuracy (is your confidence warranted?) |
| **Knowledge** | Perceived knowledge (do you think you know?) | Actual knowledge (do you really know?) |
| **Risk** | Risk tolerance (how much risk do you accept?) | Risk calibration (does your tolerance match actual risk?) |
| **AI Trust** | Trust level (TR) | Appropriate Reliance (AR) |

In each case, the calibration construct captures something the level construct misses: **the accuracy of self-assessment**.

**Why This Matters for AI Adoption**

The AIRS-16 finding that TR was only marginally significant (β=.106, p=.064) suggests that raw trust level may not be what drives sustained AI adoption. Instead:

> Users who adopt AI successfully may not be those who trust it most, but those who trust it *accurately* — knowing when to rely on AI and when to rely on themselves.

This reframes the adoption challenge from "build trust" to "build calibration."

**Item-Level Distinction**

| TR Items (Trust Level) | AR Items (Trust Calibration) |
|------------------------|------------------------------|
| TR1: "I trust AI tools to provide reliable information." | AR1: "I can tell when AI-generated information is reliable and when it needs verification." |
| TR2: "I trust the AI tools that are available to me." | AR2: "I know when to trust AI tools and when to rely on my own judgment instead." |

- **TR items** ask: Do you trust AI? (yes/no/how much)
- **AR items** ask: Can you discern when trust is warranted? (metacognitive discrimination)

A person could score 5 on TR ("I totally trust AI") and 2 on AR ("But I can't tell when it's wrong") — this is the over-reliance profile.

Conversely, a person could score 3 on TR ("I'm neutral on trusting AI") and 5 on AR ("But I know exactly when to use it") — this is the calibrated skeptic profile.

### C.2 The AIRS-18 Instrument

**Original 8 Constructs (16 items) — Unchanged**

| Construct | Items | Cronbach's α |
|-----------|-------|--------------|
| Performance Expectancy (PE) | PE1, PE2 | .803 |
| Effort Expectancy (EE) | EE1, EE2 | .859 |
| Social Influence (SI) | SI1, SI2 | .752 |
| Facilitating Conditions (FC) | FC1, FC2 | .743 |
| Hedonic Motivation (HM) | HM1, HM2 | .864 |
| Price Value (PV) | PV1, PV2 | .883 |
| Habit (HB) | HB1, HB2 | .909 |
| Trust in AI (TR) | TR1, TR2 | .891 |

**New Construct: Appropriate Reliance (AR) — 2 items**

| Item | Question Text |
|------|---------------|
| **AR1** | I can tell when AI-generated information is reliable and when it needs verification. |
| **AR2** | I know when to trust AI tools and when to rely on my own judgment instead. |

*Response Scale: 1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 = Strongly Agree*

### C.3 Scoring Algorithm Update

```python
# Original 8 construct means (unchanged)
PE = mean(PE1, PE2)
EE = mean(EE1, EE2)
SI = mean(SI1, SI2)
FC = mean(FC1, FC2)
HM = mean(HM1, HM2)
PV = mean(PV1, PV2)
HB = mean(HB1, HB2)
TR = mean(TR1, TR2)

# NEW: Appropriate Reliance construct
AR = mean(AR1, AR2)

# Updated AIRS-18 Score (range: 9-45)
AIRS_Score = PE + EE + SI + FC + HM + PV + HB + TR + AR

# Updated typology thresholds (requires validation)
if AIRS_Score <= 22.5:   # Adjusted from 20
    typology = "AI Skeptic"
elif AIRS_Score <= 33.75:  # Adjusted from 30
    typology = "Moderate User"
else:
    typology = "AI Enthusiast"
```

### C.4 Research Hypotheses for Validation

| # | Hypothesis | Rationale |
|---|------------|-----------|
| H1 | AR demonstrates acceptable reliability (α ≥ .70, CR ≥ .70, AVE ≥ .50) | Basic psychometric requirement |
| H2 | AR shows discriminant validity from TR (HTMT < .85) | AR ≠ Trust level |
| H3 | AR positively predicts BI (β > 0, p < .05) | Main effect hypothesis |
| H4 | AR provides incremental validity beyond AIRS-16 (ΔR² > .02) | Unique explanatory power |
| H5 | AR moderates TR→BI such that high AR strengthens the relationship | Calibration amplifies trust |
| H6 | AR mediates Experience→BI (more experience → better calibration → adoption) | Learning mechanism |

### C.5 Alternative Item Pool (for Expert Review)

Additional candidate items if 2-item construct proves insufficient:

| Item | Question Text |
|------|---------------|
| **AR3** | I check AI suggestions before using them for important decisions. |
| **AR4** | I have learned to recognize when AI tools are likely to give incorrect answers. |
| **AR5** | I feel confident in my ability to evaluate AI recommendations critically. |
| **AR6** | I accept AI suggestions more readily when they match what I already know. |

*Note: Items AR1-AR2 are recommended as the primary 2-item scale. Items AR3-AR6 are candidates for a potential 4-item or 6-item extended scale if psychometric analysis indicates need for additional items.*

### C.6 Full AIRS-18 Item List (Administration Order)

For ease of administration, here is the complete 18-item instrument plus 4 Behavioral Intention outcome items:

**AI Readiness Items (1-18)**

| # | Item | Construct |
|---|------|-----------|
| 1 | AI tools help me accomplish tasks more quickly. | PE |
| 2 | Using AI improves the quality of my work or studies. | PE |
| 3 | Learning to use AI tools is easy for me. | EE |
| 4 | Interacting with AI tools is clear and understandable. | EE |
| 5 | People whose opinions I value encourage me to use AI tools. | SI |
| 6 | Leaders in my organization or school support the use of AI tools. | SI |
| 7 | I have access to training or tutorials for the AI tools I use. | FC |
| 8 | The AI tools I use are compatible with other tools or systems I use. | FC |
| 9 | Using AI tools is stimulating and engaging. | HM |
| 10 | AI tools make my work or studies more interesting. | HM |
| 11 | I get more value from AI tools than the effort they require. | PV |
| 12 | Using AI tools is worth the learning curve. | PV |
| 13 | Using AI tools has become a habit for me. | HB |
| 14 | I tend to rely on AI tools by default when I need help with tasks. | HB |
| 15 | I trust AI tools to provide reliable information. | TR |
| 16 | I trust the AI tools that are available to me. | TR |
| 17 | I can tell when AI-generated information is reliable and when it needs verification. | **AR (new)** |
| 18 | I know when to trust AI tools and when to rely on my own judgment instead. | **AR (new)** |

**Outcome Variable: Behavioral Intention (BI1-BI4)**

| # | Item |
|---|------|
| BI1 | I am ready to use more AI tools in my work or studies. |
| BI2 | I would recommend AI tools to others. |
| BI3 | I see AI as an important part of my future. |
| BI4 | I plan to increase my use of AI tools in the next six months. |

*Response Scale for all items: 1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 = Strongly Agree*

*Administration Note: Randomize items within each construct to reduce order effects. Present constructs in the order listed (PE → EE → SI → FC → HM → PV → HB → TR → AR → BI).*

### C.7 Intervention Implications by Typology

If AR proves significant, intervention strategies would expand:

| Typology | Current AIRS-16 Focus | + AR-Informed Focus |
|----------|----------------------|---------------------|
| **AI Skeptics** | Trust-building, low-effort demos | Calibration training: "Here's when AI excels vs. struggles" |
| **Moderate Users** | Clear use cases, ROI evidence | Verification skill-building: "How to spot AI errors" |
| **AI Enthusiasts** | Advanced features, leadership | Reliance audits: "Are you over-relying in high-stakes areas?" |

### C.7 Measurement Considerations

| Consideration | Approach |
|---------------|----------|
| **Self-report limitation** | AR items measure *perceived* calibration, not actual calibration accuracy |
| **Behavioral validation** | Future research could correlate AR scores with actual CAIR/CSR in task-based studies |
| **Domain specificity** | AR may vary by AI application type (coding, writing, analysis) — consider modular measurement |
| **Temporal stability** | AR likely increases with experience — consider longitudinal validation |

### C.8 Citation for Extended Instrument

```bibtex
@unpublished{correa2026airs18,
  author = {Correa, Fabio},
  title = {AIRS-18: Extending the AI Readiness Scale with Appropriate Reliance},
  year = {2026},
  note = {Proposed instrument extension, pending validation},
  howpublished = {Technical Brief: Implementing Appropriate Reliance in a Cognitive AI Architecture}
}
```

---

*This document prepared for research discussion. For questions or collaboration opportunities, contact Fabio Correa.*
