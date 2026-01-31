# Implementing Appropriate Reliance in a Cognitive AI Architecture: Technical Implementation and Research Foundations

**Technical Brief for Principal Researcher Discussion**

**Author**: Fabio Correa
**Organization**: Microsoft Corporation
**Date**: January 31, 2026
**Version**: 1.0

---

## Executive Summary

This document describes the implementation of appropriate reliance principles within Alex, a cognitive architecture for AI programming assistants. Drawing on the AETHER research synthesis (Passi et al., 2024) and foundational work on trust calibration in human-automation interaction, we have implemented a multi-layered system comprising:

1. **CAIR/CSR Framework** — Calibrated AI Reliance + Collaborative Shared Responsibility
2. **Epistemic vs. Generative Mode Separation** — Distinct protocols for factual claims vs. creative contributions
3. **Human Judgment Flagging Protocol** — Explicit signaling when decisions require human expertise
4. **Confidence Ceiling Mechanisms** — Capped certainty for non-grounded claims
5. **Creative Latitude Framework** — Preserving AI generativity while maintaining epistemic integrity

The implementation spans two deployment platforms: a VS Code extension (for developers) and an M365 Copilot declarative agent (for knowledge workers), enabling comparison of appropriate reliance mechanisms across different user populations and task types.

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

```
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

## 5. Measurement Considerations

### 5.1 Metrics from AETHER Synthesis

Based on Vasconcelos et al. (2023) and Wang et al. (2025):

| Metric | Definition | Measurement Approach |
|--------|------------|---------------------|
| **CAIR** | % user agreement with correct AI outputs | Log acceptance of AI suggestions + ground truth |
| **CSR** | % user disagreement with incorrect AI outputs | Log rejection of AI suggestions + ground truth |
| **AoR** | Appropriateness of Reliance (combines CAIR + CSR) | AoR = 1 is optimal |

### 5.2 Behavioral Indicators

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

### 5.3 Proxy Metrics Currently Tracked

| Metric | Source | Indicator |
|--------|--------|-----------|
| Challenge frequency | Chat logs | User corrections per session |
| Verification requests | `/verify` usage | Explicit verification engagement |
| Creative mode usage | `/creative` usage | Mode-appropriate engagement |
| Confidence language | Response analysis | Hedging patterns in generated text |

---

## 6. Key Research Questions

### 6.1 Open Questions We're Exploring

1. **Mode Switching Accuracy**: How well do users understand the epistemic vs. generative distinction? Do they invoke modes appropriately?

2. **Calibration Effectiveness**: Does our confidence ceiling protocol actually produce calibrated outputs? How can we measure this without ground truth?

3. **Human Judgment Compliance**: When we flag a decision as requiring human judgment, do users actually exercise judgment, or do they seek more directive guidance?

4. **Creative Latitude Balance**: Have we found the right balance? Are users under-relying on creative suggestions because of epistemic framing elsewhere?

5. **Platform Differences**: Do appropriate reliance patterns differ between VS Code (developers) and M365 (knowledge workers)?

### 6.2 Potential Collaboration Areas

| Area | Research Question | Potential Approach |
|------|------------------|-------------------|
| Calibration measurement | How do we measure AoR without ground truth for open-ended tasks? | Strategy-graded approach (Fok & Weld, 2023) |
| Mode detection | Can we automatically detect when to switch modes? | User intent classification |
| Intervention timing | When should cognitive forcing functions interrupt? | A/B testing with interruption frequency |
| Longitudinal effects | Does appropriate reliance decay over time? | Panel study of regular users |

---

## 7. Implementation Artifacts

### 7.1 Core Files

| File | Purpose |
|------|---------|
| `.github/skills/appropriate-reliance/SKILL.md` | Domain knowledge module (v2.0, 424 lines) |
| `.github/instructions/alex-core.instructions.md` | Core protocols including Human Judgment Flagging |
| `.github/instructions/protocol-triggers.instructions.md` | Trigger patterns for mode detection |
| `platforms/vscode-extension/src/chat/participant.ts` | `/creative` and `/verify` command handlers |
| `platforms/m365-copilot/appPackage/declarativeAgent.json` | Epistemic Integrity section |

### 7.2 Article Versions

| Version | Focus | Lines |
|---------|-------|-------|
| V1 | Initial protocols | ~250 |
| V2 | Use case expansion | ~400 |
| V3 | Full scholarly treatment | ~890 |
| V4 | Creative Latitude Framework | ~930 |
| V5 | AETHER synthesis integration | ~1100 |

Located in: `article/appropriate-reliance/`

---

## 8. References

Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making. *Proceedings of the ACM on Human-Computer Interaction*, 5(CSCW1), 1-21.

Dell'Acqua, F., McFowland, E., Mollick, E. R., Lifshitz-Assaf, H., Kellogg, K., Rajendran, S., ... & Lakhani, K. R. (2023). Navigating the jagged technological frontier: Field experimental evidence of the effects of AI on knowledge worker productivity and quality. *Harvard Business School Technology & Operations Mgt. Unit Working Paper*, (24-013).

Fok, R., & Weld, D. S. (2023). In search of verifiability: Explanations rarely enable complementary performance in AI-advised decision making. *arXiv preprint arXiv:2305.07722*.

Kadavath, S., Conerly, T., Askell, A., Henighan, T., Drain, D., Perez, E., ... & Kaplan, J. (2022). Language models (mostly) know what they know. *arXiv preprint arXiv:2207.05221*.

Kahneman, D. (2011). *Thinking, fast and slow*. Macmillan.

Lee, J. D., & See, K. A. (2004). Trust in automation: Designing for appropriate reliance. *Human Factors*, 46(1), 50-80.

Lin, S., Hilton, J., & Evans, O. (2022). Teaching models to express their uncertainty in words. *arXiv preprint arXiv:2205.14334*.

Parasuraman, R., & Riley, V. (1997). Humans and automation: Use, misuse, disuse, abuse. *Human Factors*, 39(2), 230-253.

Passi, S., Dhanorkar, S., & Vorvoreanu, M. (2024). *GenAI Appropriate Reliance*. Microsoft AETHER Research Synthesis.

Schemmer, M., Kuehl, N., Benz, C., Bartos, A., Satzger, G., & Kühl, N. (2023). Appropriate reliance on AI advice: Conceptualization and the effect of explanations. *Proceedings of the 28th International Conference on Intelligent User Interfaces*, 410-422.

Vasconcelos, H., Jörke, M., Grunde-McLaughlin, M., Gerstenberg, T., Bernstein, M. S., & Krishna, R. (2023). Explanations can reduce overreliance on AI systems during decision-making. *Proceedings of the ACM on Human-Computer Interaction*, 7(CSCW1), 1-38.

Wang, X., Yin, M., & Vaughan, J. W. (2025). Effects of training on appropriate reliance on AI decision aids. *Proceedings of the CHI Conference on Human Factors in Computing Systems*.

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

```
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

*This document prepared for research discussion. For questions or collaboration opportunities, contact Fabio Correa.*
