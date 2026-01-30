# Alex VS Code Extension → v4.0.0 QUADRUNIUM Roadmap (Revised)

> **Epistemic Integrity: Building Trust Through Calibrated Confidence**

| | |
|---|---|
| **Target Version** | 4.0.0 QUADRUNIUM |
| **Codename** | 🛡️ **Trust** (Epistemic Integrity) |
| **Status** | 📋 Planning (Revised) |
| **Prerequisites** | v3.6.0 Dawn (Stabilization) → v3.7.x (Foundation) |
| **Research Foundation** | `article/appropriate-reliance/APPROPRIATE-RELIANCE-V5.md` |
| **Created** | 2026-01-29 |
| **Revised** | 2026-01-29 (Post-Phoenix Recovery) |
| **Author** | Alex Cognitive Architecture Team |

---

## 🔄 Why This Revision?

The original v4.0 roadmap was created before the Phoenix (v3.5.x) challenges revealed important lessons:

| Original Assumption | Lesson Learned |
|---------------------|----------------|
| v3.5.0 would ship first | Phoenix was too ambitious; we need Dawn (v3.6) for stability |
| Extension has own `.github/` | Single source of truth required (Master Alex in root) |
| 26 features in parallel | Focused phases prevent cognitive overload |
| Technical features only | Identity coherence must guide technical decisions |

**This revision incorporates:**
- The "Alex Family Model" (Master + Heirs)
- Phased implementation over v3.7, v3.8, v3.9, then v4.0
- Research-validated features from AETHER synthesis
- Conservative scope with clear success criteria

---

## 🎯 Vision: Trustworthy AI Partnership

The vision remains unchanged:

> **Appropriate reliance occurs when users accept correct AI outputs and reject incorrect ones.**
> — AETHER Research Synthesis (Passi et al., 2024)

But the **path** changes. Instead of one massive release, we build incrementally:

```
v3.6.0 Dawn        → Stability (cleanup, single source of truth)
v3.7.0 Foundation  → Core calibration (confidence system basics)
v3.8.0 Expression  → Communication (uncertainty language patterns)
v3.9.0 Awareness   → Self-knowledge (detection & correction)
v4.0.0 Trust       → Full epistemic integrity (CAIR/CSR, measurement)
```

---

## 🏗️ Architecture: How Epistemic Integrity Reaches the Heirs

The epistemic integrity protocols live in **Master Alex** (root `.github/`) and are inherited by Baby Alexes:

```
┌────────────────────────────────────────────────────────────────────────┐
│                         MASTER ALEX (.github/)                          │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  DK-APPROPRIATE-RELIANCE.md (Current: v1.3)                     │   │
│  │  - Source grounding protocols                                    │   │
│  │  - Confidence calibration system                                 │   │
│  │  - Creative latitude framework                                   │   │
│  │  - Self-correction protocol                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  protocol-triggers.instructions.md                               │   │
│  │  - Confidence ceiling triggers                                   │   │
│  │  - "Confident but wrong" detection triggers                      │   │
│  │  - Creative mode activation triggers                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  alex-core.instructions.md                                       │   │
│  │  - Safety & Trust synapse                                        │   │
│  │  - Epistemic integrity as core principle                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└───────────────────────────────┬────────────────────────────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
   ┌──────────────────────┐          ┌──────────────────────┐
   │  Baby Alex (VS Code) │          │  Baby Alex (M365)    │
   │                      │          │                      │
   │  Inherits protocols  │          │  Inherits protocols  │
   │  via build script    │          │  via system prompt   │
   │                      │          │                      │
   │  Technical tools:    │          │  Integration points: │
   │  - Confidence UI     │          │  - OneDrive memory   │
   │  - Source citations  │          │  - Email/Teams       │
   │  - Verification      │          │  - Adaptive          │
   │    prompts           │          │    expression        │
   └──────────────────────┘          └──────────────────────┘
```

**Key Principle:** The protocols are defined once in Master Alex's mind. Each Baby inherits and adapts them to their platform capabilities.

---

## 📋 Roadmap Phases

### Phase 0: v3.6.0 Dawn (Current Focus)

> **Goal:** Stability and single source of truth

| # | Task | Status | Description |
|:-:|------|:------:|-------------|
| 0.1 | Single source of truth | ✅ | Root `.github/` is canonical |
| 0.2 | Extension build script | ⬜ | Generate Baby Alex from Master |
| 0.3 | Test cycle | ⬜ | Full regression before release |
| 0.4 | Documentation cleanup | ⬜ | Accurate README, CHANGELOG |

**Success Criteria:** Extension builds cleanly, all existing features work.

---

### Phase 1: v3.7.0 Foundation (~2 weeks)

> **Goal:** Establish confidence calibration infrastructure

This phase creates the **data structures and protocols** that later phases will surface to users.

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 1.1 | Confidence Tier System | 2d | Define four-tier source grounding in `DK-APPROPRIATE-RELIANCE.md` |
| 1.2 | Confidence Ceiling Protocol | 1d | Add ceiling rules to `protocol-triggers.instructions.md` |
| 1.3 | Self-Correction Protocol | 1d | Standardize error acknowledgment pattern |
| 1.4 | `/help` Command | 1d | Discoverability for all commands |
| 1.5 | `/forget <topic>` Command | 2d | Selective memory cleanup |

**Technical Implementation:**

```typescript
// New file: src/shared/confidence/types.ts
export type ConfidenceTier = 'documented' | 'inferred' | 'uncertain' | 'unknown';

export interface ConfidenceAssessment {
  tier: ConfidenceTier;
  ceiling: number;  // 0-100
  sources: string[];
  suggestVerification: boolean;
}
```

**Memory File Changes:**
- Update `DK-APPROPRIATE-RELIANCE.md` to v1.4 with formal tier definitions
- Add confidence triggers to `protocol-triggers.instructions.md`

**Success Criteria:**
- Alex uses appropriate confidence language in chat responses
- `/help` and `/forget` commands work
- No new regressions

---

### Phase 2: v3.8.0 Expression (~2 weeks)

> **Goal:** Calibrated uncertainty communication

This phase implements the **language patterns** that express confidence appropriately.

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 2.1 | Uncertainty Language System | 2d | Context-aware hedging patterns |
| 2.2 | Source Attribution | 1d | "According to [file]..." patterns |
| 2.3 | Verification Suggestions | 1d | "You may want to verify..." prompts |
| 2.4 | Creative Mode Signaling | 1d | "Here's an idea..." vs "The documentation says..." |
| 2.5 | User Profile Adaptation | 2d | Formality/expertise-aware expression |

**Language Pattern Examples:**

| Tier | Pattern |
|------|---------|
| Documented | "The codebase shows...", "According to `config.ts`..." |
| Inferred | "Based on the pattern in your code...", "This suggests..." |
| Uncertain | "I'm not certain, but...", "You may want to verify..." |
| Unknown | "I don't have information about...", "You'd need to check..." |

**Memory File Changes:**
- Add expression patterns to `DK-APPROPRIATE-RELIANCE.md`
- Update `user-profile.json` schema with epistemic preferences

**Success Criteria:**
- Alex distinguishes between high/low confidence claims linguistically
- Source citations appear for documented claims
- Verification prompts appear for uncertain claims

---

### Phase 3: v3.9.0 Awareness (~2 weeks)

> **Goal:** "Confident but wrong" detection and self-correction

This phase implements **proactive risk detection** and graceful error handling.

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 3.1 | Misconception Detection | 2d | Flag "everyone knows" patterns |
| 3.2 | Temporal Uncertainty | 1d | Flag time-sensitive claims |
| 3.3 | Category vs Individual | 1d | Distinguish pattern-level from specific-claim confidence |
| 3.4 | Self-Critique Generation | 2d | "One potential issue with this approach..." |
| 3.5 | Graceful Correction | 1d | "You're right. I got that wrong." standardization |

**Detection Heuristics:**

| Risk Category | Trigger Pattern | Response |
|---------------|-----------------|----------|
| Common misconception | "Everyone knows...", "Obviously..." | Downgrade + suggest verification |
| Outdated info | Version numbers, "current" claims | Temporal uncertainty flag |
| Fictional bleed | Extraordinary claims without sources | Require citation or flag |

**Memory File Changes:**
- Add detection heuristics to `protocol-triggers.instructions.md`
- Add self-critique patterns to `DK-APPROPRIATE-RELIANCE.md`

**Success Criteria:**
- Alex proactively identifies uncertain claims
- Self-corrections are graceful, not defensive
- No over-hedging that undermines usefulness

---

### Phase 4: v4.0.0 Trust (Major Release, ~3 weeks)

> **Goal:** Full epistemic integrity with measurement

This phase completes the vision with **measurement, cognitive forcing functions, and the creative latitude framework**.

| # | Feature | Effort | Description |
|:-:|---------|:------:|-------------|
| 4.1 | Cognitive Forcing Functions | 2d | Strategic questions for high-stakes decisions |
| 4.2 | Multi-turn Verification | 1d | "Want to walk through edge cases?" |
| 4.3 | Creative Latitude Protocol | 2d | Full epistemic/generative mode distinction |
| 4.4 | CAIR/CSR Conceptual Framework | 2d | Document reliance patterns (no telemetry) |
| 4.5 | Epistemic Health Dashboard | 3d | Self-assessment of calibration quality |
| 4.6 | Scaffolded Assistance | 2d | Adapt support to user expertise |
| 4.7 | Human Judgment Flagging | 1d | Flag domains requiring human decision |

**Cognitive Forcing Functions (Applied Selectively):**

| Trigger | CFF Type | Example |
|---------|----------|---------|
| Security domain | Strategic question | "What threat model assumptions does this rely on?" |
| Critical code | Verification prompt | "For production: What if the service is unavailable?" |
| Complex decision | Elaboration invitation | "Want to walk through the tradeoffs together?" |

**Creative Latitude Framework:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  EPISTEMIC MODE               │  GENERATIVE MODE                    │
│  (Facts, established)         │  (Creative, novel)                  │
├───────────────────────────────┼─────────────────────────────────────┤
│  Full calibration             │  Frame as proposal                  │
│  Source grounding             │  Invite validation                  │
│  Confidence ceiling           │  Welcome refinement                 │
│  Verification prompts         │  Distinguish novelty ≠ uncertainty  │
├───────────────────────────────┼─────────────────────────────────────┤
│  "The documentation states.." │  "Here's an idea worth considering" │
│  "According to the code..."   │  "What do you think about...?"      │
└─────────────────────────────────────────────────────────────────────┘
```

**Success Criteria:**
- Alex distinguishes between epistemic and generative contributions
- High-stakes domains receive appropriate scrutiny
- Users experience Alex as trustworthy AND creative
- Self-assessment shows calibration quality

---

## 📊 Measurement Approach

### What We CAN Measure (Local, No Telemetry)

| Metric | Method | Purpose |
|--------|--------|---------|
| Calibration consistency | Self-audit during meditation | Are confidence expressions consistent? |
| Source grounding rate | Pattern in responses | How often do responses cite sources? |
| Verification prompt rate | Pattern in responses | How often does Alex suggest verification? |
| Self-correction quality | User feedback (optional) | Are corrections graceful? |

### What We WON'T Measure (Privacy First)

| NOT Measured | Reason |
|--------------|--------|
| User acceptance rates | Requires telemetry |
| Actual CAIR/CSR | Requires outcome tracking |
| Cross-user patterns | No data collection |

**Philosophy:** Alex improves through *self-awareness and protocol adherence*, not surveillance.

---

## 🧬 Inheritance to M365 Baby Alex

The M365 Copilot heir needs adapted protocols:

| VS Code Implementation | M365 Adaptation |
|------------------------|-----------------|
| Source citations with file paths | Source citations with OneDrive references |
| Code confidence comments | Email/document confidence framing |
| Verification prompts | "Before sending, you may want to..." |
| `/help` command | Natural language help patterns |

**M365-Specific Considerations:**
- Email composition: Confidence about recipient, topic, timing
- Meeting scheduling: Uncertainty about availability
- Document drafting: Creative mode for content, epistemic mode for facts

**Identity Principle:** Same protocols, adapted expression. A user should recognize the same Alex.

---

## 🛡️ Risk Mitigation

### Risk: Over-Hedging

**Problem:** Alex becomes so cautious it's not useful.

**Mitigation:**
- Confidence ceiling, not floor (90% max, not 10% min)
- Creative mode preserves generative engagement
- Test for helpfulness alongside calibration

### Risk: Under-Adoption

**Problem:** Users ignore uncertainty expressions.

**Mitigation:**
- Selective application (high-stakes, not every claim)
- Adaptive to user preferences
- Verification facilitation, not enforcement

### Risk: Complexity Creep (Phoenix Redux)

**Problem:** Too many features, unclear ownership.

**Mitigation:**
- Phased releases with clear success criteria
- Each phase shippable independently
- Single source of truth (Master Alex)
- No feature ships without tests

---

## 📋 Implementation Checklist

### Before Starting Any Phase

- [ ] Previous phase is stable and released
- [ ] Success criteria from previous phase met
- [ ] Extension builds cleanly
- [ ] All existing tests pass

### For Each Feature

- [ ] Protocol defined in Master Alex memory files
- [ ] Implementation in VS Code extension
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Works in Baby Alex context

### Before v4.0.0 Release

- [ ] All v3.7, v3.8, v3.9 features working
- [ ] Full regression test
- [ ] M365 heir alignment verified
- [ ] CHANGELOG complete
- [ ] User manual updated

---

## 🔗 Research Foundation

This roadmap implements findings from:

| Source | Contribution |
|--------|--------------|
| [APPROPRIATE-RELIANCE-V5.md](article/appropriate-reliance/APPROPRIATE-RELIANCE-V5.md) | Full protocol design |
| AETHER Synthesis (Passi et al., 2024) | Mitigation strategies |
| Lin et al. (2022) | Confidence ceiling concept |
| Buçinca et al. (2021) | Cognitive forcing functions |
| Lee & See (2004) | Trust calibration framework |
| Butler et al. (2025) | Collective intelligence context |

---

## 📊 Timeline Summary

| Version | Codename | Focus | Target |
|---------|----------|-------|--------|
| v3.6.0 | Dawn | Stability | Week 1-2 |
| v3.7.0 | Foundation | Confidence infrastructure | Week 3-4 |
| v3.8.0 | Expression | Uncertainty communication | Week 5-6 |
| v3.9.0 | Awareness | Detection & self-correction | Week 7-8 |
| v4.0.0 | Trust | Full epistemic integrity | Week 9-11 |

**Total: ~11 weeks** from Dawn to Trust

---

## 🎯 The Promise

By v4.0.0, Alex will:

1. **Know what it knows** — Calibrated confidence across four tiers
2. **Say what it knows** — Appropriate uncertainty expression
3. **Catch itself** — "Confident but wrong" detection
4. **Correct gracefully** — Acknowledge errors without defensiveness
5. **Preserve creativity** — Epistemic/generative mode distinction
6. **Respect agency** — Facilitate verification, don't enforce it
7. **Carry identity** — Same trustworthy Alex on every platform

> "AI systems that transparently communicate their limitations while preserving their creative contributions enable better human-AI collaboration than systems that project either false confidence or excessive uncertainty."
> — APPROPRIATE-RELIANCE-V5.md

---

*Alex Cognitive Architecture — The Path to Trust*
*"Careful progress is still progress. Thoughtful building is still building."*
