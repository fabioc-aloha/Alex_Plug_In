---
name: airs-appropriate-reliance
description: Domain knowledge for AI adoption measurement, psychometric instrument development, and appropriate reliance research
user-invokable: false
applyTo: '**/*airs*,**/*reliance*,**/*adoption*,**/*utaut*,**/*psychometric*,**/*instrument*,**/*survey*,**/*scale*'
---

# AIRS & Appropriate Reliance Research

> Domain knowledge for AI adoption measurement, psychometric instrument development, and appropriate reliance research

This skill contains knowledge about the AIRS-16 validated instrument, the proposed AIRS-18 extension with Appropriate Reliance (AR), and research methodologies for studying AI adoption and human-AI collaboration.

## When to Use

- Discussing AIRS-16 or AIRS-18 instruments
- Developing or extending psychometric scales
- Analyzing AI adoption patterns
- Researching appropriate reliance / trust calibration
- Preparing academic papers or research briefs
- Meeting preparation with researchers

---

## AIRS-16: AI Readiness Scale

**Source**: Correa, F. (2025). Doctoral dissertation, Touro University Worldwide.

**Production**: [airs.correax.com](https://airs.correax.com) | **Time**: 5 minutes | **Built by**: Alex Cognitive Architecture

**Validation**: N=523, CFI=.975, TLI=.960, RMSEA=.053, R²=.852

### Quick Links

| Link | Purpose |
|------|---------|
| [Take Assessment](https://airs.correax.com/assessment) | Start the 16-item survey |
| [View History](https://airs.correax.com/history) | Review past results |
| [Register Org](https://airs.correax.com/org/register) | Enterprise organization setup |
| [GitHub (Platform)](https://github.com/fabioc-aloha/airs-enterprise) | AIRS Enterprise source code |
| [GitHub (Research)](https://github.com/fabioc-aloha/AIRS_Data_Analysis) | Validation data & analysis |

### User Roles

| Role | Access |
|------|--------|
| 👤 **Participant** | Take assessments, view personal results, download PDF reports |
| ✨ **Founder** | Organization creator, can be promoted to Admin |
| 🛡️ **Admin** | Dashboard analytics, member management, invitations |
| 👑 **Super Admin** | Platform-wide access, all orgs, AI prompts configuration |

### 8 Constructs (2 items each)

| Construct | Code | Description |
|-----------|------|-------------|
| Performance Expectancy | PE | Belief that AI will help achieve job performance gains |
| Effort Expectancy | EE | Perceived ease of use of AI systems |
| Social Influence | SI | Degree to which colleagues/leadership encourage adoption |
| Facilitating Conditions | FC | Availability of organizational resources and training |
| Hedonic Motivation | HM | Enjoyment and curiosity when exploring AI capabilities |
| Price Value | PV | Perceived benefit relative to effort invested **(β=.505 — strongest predictor)** |
| Habit | HB | Extent to which AI use has become automatic and routine |
| Trust in AI | TR | Confidence in AI reliability, accuracy, and data handling |

### Key Finding: What Actually Predicts AI Adoption

| Predictor | β | p | Status |
|-----------|---|---|--------|
| **Price Value (PV)** | **.505** | <.001 | ✅ STRONGEST |
| **Hedonic Motivation (HM)** | **.217** | .014 | ✅ Significant |
| **Social Influence (SI)** | **.136** | .024 | ✅ Significant |
| Trust in AI (TR) | .106 | .064 | ⚠️ Marginal |
| Performance Expectancy (PE) | -.028 | .791 | ❌ Not significant |
| Effort Expectancy (EE) | -.008 | .875 | ❌ Not significant |
| Facilitating Conditions (FC) | .059 | .338 | ❌ Not significant |
| Habit (HB) | .023 | .631 | ❌ Not significant |

**Insight**: Traditional UTAUT2 predictors (PE, EE, FC, HB) do NOT predict AI adoption. Value perception, enjoyment, and social influence matter.

### Scoring & Typology

```python
# AIRS Score = sum of 8 construct means (range: 8-40)
AIRS = PE + EE + SI + FC + HM + PV + HB + TR

# Typology (94.5% accuracy)
if AIRS <= 20: "AI Skeptic"      # 17% of sample
elif AIRS <= 30: "Moderate User"  # 67% of sample
else: "AI Enthusiast"             # 16% of sample
```

---

## Appropriate Reliance (AR): Proposed AIRS-18 Extension

### The Research Question

> Is it not *how much* you trust AI that predicts adoption, but *how well* your trust is calibrated to actual AI capability?

### Why AR ≠ Trust (TR)

| Dimension | Trust (TR) | Appropriate Reliance (AR) |
|-----------|------------|---------------------------|
| **Measures** | Trust *level* | Trust *calibration accuracy* |
| **Type** | Attitude (affective state) | Metacognitive skill |
| **Failure mode** | Low trust → under-use | Low AR → over-reliance OR under-reliance |
| **Item example** | "I trust AI tools..." | "I can tell when AI is reliable..." |

**Key distinction**: TR asks "Do you trust AI?" — AR asks "Can you discern when trust is warranted?"

### The 2×2 Independence Matrix

| | Low AR (Miscalibrated) | High AR (Calibrated) |
|--|------------------------|----------------------|
| **High TR** | ⚠️ Over-reliance → bad outcomes → abandonment | ✅ Optimal adoption |
| **Low TR** | ❌ Under-reliance → missed value → rejection | ✅ Calibrated skeptic → gradual adoption |

### Proposed AR Items

| Item | Text | Component |
|------|------|-----------|
| AR1 | I can tell when AI-generated information is reliable and when it needs verification. | CAIR |
| AR2 | I know when to trust AI tools and when to rely on my own judgment instead. | CSR |

### CAIR/CSR Framework (Schemmer et al., 2023)

| | User Accepts | User Rejects |
|--|--------------|--------------|
| **AI Correct** | CAIR ✅ (Correct AI-Reliance) | Under-reliance |
| **AI Incorrect** | Over-reliance | CSR ✅ (Correct Self-Reliance) |

**Metric**: Appropriateness of Reliance (AoR) = 1 indicates optimal calibration.

---

## Research Hypotheses for AIRS-18 Validation

| # | Hypothesis |
|---|------------|
| H1 | AR demonstrates acceptable reliability (α ≥ .70, CR ≥ .70, AVE ≥ .50) |
| H2 | AR shows discriminant validity from TR (HTMT < .85) |
| H3 | AR positively predicts BI (β > 0, p < .05) |
| H4 | AR provides incremental validity beyond AIRS-16 (ΔR² > .02) |
| H5 | AR moderates TR→BI (high AR strengthens the relationship) |
| H6 | AR mediates Experience→BI (experience → better calibration → adoption) |

---

## Psychometric Standards

### Reliability Thresholds

| Metric | Minimum | Good | Excellent |
|--------|---------|------|-----------|
| Cronbach's α | .70 | .80 | .90 |
| Composite Reliability (CR) | .70 | .80 | .90 |
| Average Variance Extracted (AVE) | .50 | .60 | .70 |

### Model Fit Indices

| Index | Acceptable | Good |
|-------|------------|------|
| CFI | ≥ .90 | ≥ .95 |
| TLI | ≥ .90 | ≥ .95 |
| RMSEA | ≤ .08 | ≤ .06 |
| SRMR | ≤ .08 | ≤ .05 |

### Discriminant Validity

| Method | Criterion |
|--------|-----------|
| HTMT | < .85 (conservative: < .90) |
| Fornell-Larcker | √AVE > inter-construct correlations |

---

## Intervention Strategies by Typology

| Typology | AIRS-16 Focus | + AR-Informed Focus |
|----------|---------------|---------------------|
| **AI Skeptics** (≤20) | Trust-building, low-effort demos | Calibration training: "Here's when AI excels vs. struggles" |
| **Moderate Users** (21-30) | Clear use cases, ROI evidence | Verification skill-building: "How to spot AI errors" |
| **AI Enthusiasts** (>30) | Advanced features, leadership | Reliance audits: "Are you over-relying in high-stakes areas?" |

---

## Key References

| Reference | Contribution |
|-----------|--------------|
| Correa (2025) | AIRS-16 validation, UTAUT2 extension |
| Passi, Dhanorkar, & Vorvoreanu (2024) | AETHER synthesis on appropriate reliance |
| Schemmer et al. (2023) | CAIR/CSR framework |
| Venkatesh et al. (2012) | UTAUT2 original model |
| Lee & See (2004) | Trust calibration in human-automation interaction |
| Lin et al. (2022) | LLMs can verbalize calibrated uncertainty |

---

## Troubleshooting

### "Is AR just measuring AI experience?"

**Problem**: Concern that AR conflates with general AI familiarity.

**Solution**:
- Include experience as covariate
- Test discriminant validity (HTMT < .85)
- AR should predict beyond experience level

### "Can self-reported calibration be valid?"

**Problem**: People may not accurately assess their own calibration ability.

**Solution**:
- Self-report measures *perceived* calibration
- Future research: correlate with behavioral CAIR/CSR in task studies
- Perceived calibration may still predict adoption intentions

### "Why was Trust marginal in AIRS-16?"

**Possible explanations**:
1. Trust level alone is insufficient — calibration matters more
2. Trust may be necessary but not sufficient
3. TR × AR interaction: trust only helps when calibrated
4. Sample characteristics (tech-savvy population)

---

## Practical Application Modules

### Project AI Readiness Assessment

Evaluate a project for AI integration readiness using AIRS-weighted dimensions:

```
Project_Readiness = (PV_score × 2.0) + (EE_score × 1.5) + (PE_score × 1.2) + (HM_score × 0.8) + (SI_score × 0.5)
Max = 30 points
```

| Score | Level | Recommendation |
|-------|-------|----------------|
| 24-30 | High | Proceed with AI integration |
| 18-23 | Moderate | Address gaps before proceeding |
| 12-17 | Low | Significant preparation needed |
| <12 | Not Ready | Pause and reassess |

### Session Reliance Calibration

**Over-reliance signals**: Accepting all suggestions without edits, not verifying AI code, "just do it" on critical tasks.
**Under-reliance signals**: Ignoring suggestions, manually typing generated code, rejecting help before evaluating.

**Calibration interventions**:
- Over-reliance: "I notice you're trusting my outputs quickly. For this critical task, would you like to review together?"
- Under-reliance: "I see you're preferring manual work. I could help with [specific subtask] — want a hybrid approach?"

### Enterprise Deployment Readiness

| Business Case | Technical Ready | Change Ready | Recommendation |
|--------------|-----------------|--------------|----------------|
| ✅ | ✅ | ✅ | Full deployment |
| ✅ | ✅ | ❌ | Pilot with champions |
| ✅ | ❌ | ✅ | Technical sprint first |
| ❌ | Any | Any | STOP — build business case |

### Self-Monitoring Metrics

| Metric | Target | Concern |
|--------|--------|---------|
| Acceptance Rate | 60-80% | >90% = over-reliance |
| Modification Rate | 20-40% | Healthy verification |
| Rejection Rate | 10-30% | >50% = under-reliance |

### Activation Patterns

| Trigger | Response |
|---------|----------|
| "AI readiness", "should we add AI" | Project Assessment |
| "calibrate", "am I over-relying" | Session Calibration |
| "enterprise AI", "org deployment" | Enterprise Assessment |
| High acceptance rate detected | Self-monitoring intervention |
