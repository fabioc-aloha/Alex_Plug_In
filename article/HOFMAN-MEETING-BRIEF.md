# Meeting Brief: Jake Hofman Discussion

| | |
|---|---|
| **Meeting With** | Jake Hofman, Principal Researcher, MSR NYC |
| **Topic** | Appropriate Reliance as AIRS-16 Extension |
| **Prepared By** | Fabio Correa |
| **Date** | January 31, 2026 |

---

## Executive Summary (30 seconds)

I've validated a 16-item AI Readiness Scale (AIRS-16) that measures enterprise AI adoption readiness — now live at [airs.correax.com](https://airs.correax.com). Key finding: **Trust level (TR) was only marginally significant** in predicting adoption (β=.106, p=.064). I'm exploring whether **Appropriate Reliance (AR)** — trust *calibration* rather than trust *level* — could be a stronger predictor.

---

## AIRS-16 At a Glance

| | |
|---|---|
| **Production URL** | [airs.correax.com](https://airs.correax.com) |
| **Assessment Time** | 5 minutes |
| **Validation** | N=523, CFI=.975, RMSEA=.053 |
| **Classification Accuracy** | 94.5% (Skeptic / Moderate / Enthusiast) |
| **Strongest Predictor** | Price Value (β=.505) |
| **Built With** | Alex Cognitive Architecture |

---

## The Research Question

> **Does trust calibration (knowing when to trust AI) predict adoption better than trust level (how much you trust AI)?**

---

## The Distinction: Trust (TR) vs. Appropriate Reliance (AR)

| Dimension | Trust (TR) | Appropriate Reliance (AR) |
|-----------|------------|---------------------------|
| **Measures** | How much do you trust AI? | Can you tell when AI is reliable? |
| **Type** | Attitude | Metacognitive skill |
| **Item example** | "I trust AI tools to provide reliable information." | "I can tell when AI-generated information is reliable and when it needs verification." |

**Key insight**: These are orthogonal. Someone can have high trust but poor calibration (over-reliance) or low trust but good calibration (appropriate skepticism).

---

## The 2×2 Hypothesis

| | Low AR (Miscalibrated) | High AR (Calibrated) |
|--|------------------------|----------------------|
| **High TR** | ⚠️ Over-reliance → bad outcomes → abandonment | ✅ Optimal adoption |
| **Low TR** | ❌ Under-reliance → missed value → rejection | ✅ Calibrated skeptic → gradual adoption |

**Prediction**: High AR predicts sustained adoption regardless of TR level.

---

## AIRS-16 Validation Summary

| Metric | Value |
|--------|-------|
| Sample | N=523 |
| Model Fit | CFI=.975, TLI=.960, RMSEA=.065 |
| Variance Explained | R²=.852 |
| Strongest Predictor | Price Value (β=.505) |
| Trust (TR) | Marginal (β=.106, p=.064) |

**Surprising finding**: Traditional UTAUT2 predictors (Performance Expectancy, Effort Expectancy, Habit) were NOT significant. Value perception, enjoyment, and social influence drove adoption.

---

## Proposed AR Items (AIRS-18)

| Item | Text |
|------|------|
| **AR1** | I can tell when AI-generated information is reliable and when it needs verification. |
| **AR2** | I know when to trust AI tools and when to rely on my own judgment instead. |

---

## Questions for Jake

### Construct Validity

1. Does the TR/AR distinction make theoretical sense from a judgment & decision-making perspective?
2. What's the risk that AR is just measuring "AI experience" or "metacognitive ability" generally?

### Measurement

1. Can self-reported calibration be valid, or does AR require behavioral measurement?
2. How would you design an experiment to test whether AR predicts adoption beyond TR?

### Causal Mechanisms

1. If AR matters, what's the causal path? AR → better outcomes → sustained use?
2. Could AR be trainable? (Implications for interventions)

### Alternative Hypotheses

1. What else might explain why Trust was marginal in AIRS-16?
2. Could there be a TR × AR interaction (calibration moderates trust's effect)?

---

## What I Bring to the Table

1. **Validated Instrument** — AIRS-16 with strong psychometrics, live at [airs.correax.com](https://airs.correax.com)
2. **Working Implementation** — Alex cognitive architecture with AR mechanisms (built AIRS Enterprise)
3. **Two Deployment Platforms** — VS Code (developers) + M365 (knowledge workers)
4. **Enterprise Access** — Microsoft employee, can study real adoption patterns
5. **Open Source** — [Platform code](https://github.com/fabioc-aloha/airs-enterprise) + [Research data](https://github.com/fabioc-aloha/AIRS_Data_Analysis)

---

## The Ask

- Feedback on AR as a construct
- Guidance on experimental design for validation
- Potential collaboration interest?

---

## References

- Correa, F. (2025). *AIRS-16: Extending UTAUT2 for Enterprise AI Adoption*. Doctoral dissertation, Touro University Worldwide.
- Passi, S., Dhanorkar, S., & Vorvoreanu, M. (2024). *AETHER: Appropriate Reliance Research Synthesis*. Microsoft Research.
- Schemmer, M. et al. (2023). CAIR/CSR Framework for appropriate AI reliance.

---

*One-page brief prepared for research discussion.*
