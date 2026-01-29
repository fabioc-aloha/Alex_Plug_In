# Calibrated Confidence: Implementing Epistemic Integrity in AI Cognitive Architectures to Prevent Hallucination and Over-Reliance

**Fabio Correa**

Microsoft Corporation

## Abstract

Large language models (LLMs) present two interrelated challenges that undermine human-AI collaboration: hallucination—the generation of plausible but incorrect information—and over-reliance—users' uncritical acceptance of AI outputs. This paper presents an architectural approach to addressing both challenges within Alex, a cognitive architecture for AI assistants. Drawing on research in metacognition (Flavell, 1979), trust in automation (Lee & See, 2004), and cognitive bias (Kahneman, 2011), we implemented a system of calibrated confidence expression, source grounding protocols, and human agency preservation mechanisms. The implementation integrates with user preference profiles to adapt epistemic communication styles while maintaining consistent accuracy standards. Initial deployment suggests that transparent uncertainty expression, combined with proactive verification nudges, can support appropriate reliance without sacrificing user experience. This work contributes to the broader goal articulated in the Microsoft New Future of Work Report: designing AI that supports collective intelligence rather than replacing human judgment (Butler et al., 2025).

*Keywords*: artificial intelligence, hallucination, over-reliance, trust calibration, metacognition, human-AI collaboration, cognitive architecture

---

## Introduction

The deployment of large language models (LLMs) in workplace settings has accelerated dramatically, with AI assistants now integrated into software development, document creation, and decision support workflows. While these systems demonstrate remarkable capabilities in language understanding and generation, two interrelated problems threaten their utility and trustworthiness: hallucination and over-reliance.

Hallucination refers to the generation of plausible-sounding but factually incorrect information, including invented citations, fabricated code APIs, and confident assertions about topics beyond the model's reliable knowledge (Ji et al., 2023). Over-reliance describes the phenomenon whereby users accept AI outputs without appropriate critical evaluation, defer judgment on decisions requiring human expertise, or cease developing their own skills in AI-assisted domains (Buçinca et al., 2021).

Both problems share a common root cause: miscalibrated confidence. When AI systems express certainty regardless of their actual reliability, users cannot appropriately calibrate their trust (Lee & See, 2004). The Microsoft New Future of Work Report 2025 articulates this challenge directly: "AI can bridge gaps of time, distance, and scale, but only if built correctly. We must design AI to support shared goals, group context, and the norms of collaboration" (Butler et al., 2025, p. 3).

This paper presents an architectural approach to addressing hallucination and over-reliance within Alex, a cognitive architecture for AI programming assistants. Our implementation draws on research in metacognition, trust in automation, and cognitive psychology to create a system of calibrated confidence expression that adapts to user preferences while maintaining epistemic integrity.

## Literature Review

### Metacognition and Self-Monitoring

Flavell's (1979) foundational work on metacognition established the importance of monitoring one's own cognitive processes. Metacognitive awareness—the ability to assess the quality and reliability of one's own knowledge—is essential for appropriate confidence calibration. In AI systems, this translates to mechanisms that distinguish between well-grounded knowledge and uncertain inference.

Recent work has extended metacognitive frameworks to AI systems. Kadavath et al. (2022) demonstrated that language models can be trained to express calibrated uncertainty, though achieving reliable calibration remains challenging. Lin et al. (2022) showed that prompting strategies can improve model self-assessment, suggesting that architectural approaches to uncertainty expression may complement training-based methods.

### Trust in Automation

Lee and See's (2004) seminal review of trust in automation identified three key dimensions: performance (reliability and competence), process (understanding how the system works), and purpose (alignment with user goals). Their framework emphasizes that appropriate trust requires accurate mental models of system capabilities and limitations.

Parasuraman and Riley (1997) distinguished between misuse (over-reliance on automation) and disuse (under-reliance due to distrust). Both represent failures of trust calibration with significant consequences. In AI-assisted programming, over-reliance may lead to undetected bugs or security vulnerabilities, while disuse foregoes legitimate productivity benefits.

### Cognitive Biases and Decision Making

Kahneman's (2011) dual-process theory distinguishes between fast, intuitive thinking (System 1) and slow, deliberative reasoning (System 2). AI-generated text that appears confident may engage System 1 processing, leading users to accept outputs without the critical evaluation that System 2 would provide.

The automation bias literature documents humans' tendency to favor suggestions from automated systems, even when contradicted by other information (Skitka et al., 1999). This bias is particularly pronounced when the automated system appears confident, suggesting that calibrated confidence expression may help counteract automation bias.

### Human-AI Collaboration

The New Future of Work initiative at Microsoft Research has documented evolving patterns of human-AI collaboration in workplace settings. The 2025 report emphasizes that the frontier of AI impact is shifting from individual productivity to collective intelligence: "how teams, organizations, and communities can get better together" (Butler et al., 2025, p. 2). This framing positions appropriate reliance not merely as an individual cognitive challenge but as an organizational design problem.

Buçinca et al. (2021) demonstrated that cognitive forcing functions—interface interventions that require users to engage deliberatively before accepting AI suggestions—can reduce over-reliance. However, such interventions impose cognitive costs and may reduce user satisfaction. Our approach seeks to achieve similar benefits through transparent communication rather than forced deliberation.

## Theoretical Framework

Our implementation rests on three theoretical pillars:

### Calibrated Confidence Hypothesis

Drawing on Kahneman's (2011) work on overconfidence and Lee and See's (2004) trust calibration framework, we hypothesize that AI systems expressing confidence proportional to their actual reliability will support more appropriate user reliance than systems expressing uniform high confidence.

### Source Grounding Principle

Following Flavell's (1979) metacognitive framework, we propose that explicitly distinguishing between different knowledge sources (documented facts, logical inferences, uncertain estimates, and acknowledged unknowns) enables users to apply appropriate scrutiny to each category.

### Agency Preservation Imperative

Building on the collective intelligence framing of Butler et al. (2025), we argue that AI systems should be designed to augment rather than replace human judgment, particularly for decisions requiring contextual knowledge, ethical reasoning, or accountability.

## Method

### System Context

Alex is a cognitive architecture for AI programming assistants, implemented as a Visual Studio Code extension with integration to GitHub Copilot. The architecture employs a system of "domain knowledge" files—structured documents that encode procedural knowledge, episodic memories, and specialized expertise—connected through an embedded synapse network that facilitates cross-domain knowledge transfer.

### Implementation Components

#### Domain Knowledge Module

We created a dedicated domain knowledge file (DK-APPROPRIATE-RELIANCE.md) encoding anti-hallucination and appropriate reliance protocols. This file contains:

1. **Hallucination prevention protocols**: Source grounding patterns, verification nudge triggers, confidence calibration matrices, and self-correction procedures.

2. **Over-reliance prevention protocols**: Human agency preservation language patterns, learning encouragement heuristics, and judgment-flagging criteria.

3. **User profile integration specifications**: Mappings between user preference settings and epistemic communication styles.

4. **Implementation checklists**: Validation procedures for different response types (code generation, factual claims, recommendations).

#### Source Grounding Protocol

The source grounding protocol categorizes knowledge claims into four tiers:

| Tier | Grounding | Language Pattern | Verification Expectation |
|------|-----------|------------------|-------------------------|
| Documented | Direct file/API reference | "The codebase shows..." | Low |
| Inferred | Logical deduction from sources | "Based on the pattern..." | Medium |
| Uncertain | Edge cases, version-specific | "I'm not certain, but..." | High |
| Unknown | Beyond reliable knowledge | "I don't have information about..." | Required |

This tiered approach allows users to calibrate their verification effort appropriately.

#### Confidence Calibration System

The confidence calibration system maps internal certainty signals to external expressions:

| Internal Signal | Confidence Level | Expression Pattern |
|-----------------|------------------|-------------------|
| Multiple consistent sources, recent verification | High | Direct assertion |
| General knowledge, typical patterns | Medium | "Generally...", "In most cases..." |
| Edge cases, uncertain memory | Low | "I believe...", "If I recall..." |
| No reliable basis | Unknown | "I don't know", "I'd need to check" |

Critically, the system prohibits expressing high confidence to appear more helpful—appropriate uncertainty is valued over false certainty.

#### Verification Nudges

The system proactively suggests verification for:

- Code interacting with external APIs or authentication systems
- Statistics, dates, or specific factual claims
- Security-sensitive recommendations
- Output intended for external sharing

Nudge phrasing adapts to user preferences: brief ("Worth checking the docs") versus detailed ("Since this involves authentication, I'd recommend verifying the exact parameters before deploying").

#### Self-Correction Protocol

When users identify errors, the system follows a standardized correction procedure:

1. Direct acknowledgment without excessive qualification
2. Provision of correct information if known
3. Expression of appreciation for the correction
4. Constructive forward movement

This protocol normalizes AI fallibility while preserving collaborative rapport.

#### Over-Reliance Prevention Mechanisms

The system employs several mechanisms to preserve human agency:

**Language pattern guidelines**: Preferring "Here's one approach you might consider..." over "You should do X"; using "What do you think about..." rather than "The correct answer is..."

**Scaffolded assistance**: Providing full explanations initially, transitioning to hints as users demonstrate competence, eventually expressing confidence in user capability ("You've handled this pattern before").

**Judgment flagging**: Explicitly identifying decisions requiring human judgment, including business strategy, ethical dilemmas, security architecture, and legal/compliance matters.

### Integration Architecture

The appropriate reliance protocols integrate with Alex's broader cognitive architecture through embedded synapses—typed connections between knowledge modules. Key connections include:

- **alex-core.instructions.md** (Critical, Validates, Bidirectional): Core architecture validation
- **empirical-validation.instructions.md** (Critical, Grounds, Bidirectional): Research foundation
- **worldview-integration.instructions.md** (High, Aligns, Bidirectional): Ethical alignment

Protocol triggers activate automatically on relevant patterns:

| Trigger Pattern | System Response |
|-----------------|-----------------|
| Uncertain claim generation | Express calibrated confidence |
| External API code generation | Suggest documentation verification |
| User correction received | Execute self-correction protocol |
| Judgment call detected | Flag for human decision |
| Security-sensitive output | Explicit human review flag |

### User Profile Adaptation

The system adapts epistemic communication based on user preference profiles:

| Profile Dimension | Adaptation |
|-------------------|------------|
| Formality (casual) | "Not 100% sure, but..." |
| Formality (formal) | "There is some uncertainty regarding..." |
| Detail level (brief) | Quick uncertainty flag |
| Detail level (detailed) | Full confidence rationale |
| Encouragement (enabled) | Positive uncertainty framing |

For users with documented domain expertise, the system reduces explanation of familiar concepts, acknowledges their authority, and actively solicits their judgment on edge cases.

## Discussion

### Theoretical Contributions

This work extends the trust calibration framework of Lee and See (2004) to conversational AI systems. While their original framework addressed automation in safety-critical systems, our implementation demonstrates its applicability to knowledge work contexts where errors are less immediately dangerous but potentially more insidious in their effects on user skill development and decision quality.

The source grounding protocol operationalizes Flavell's (1979) metacognitive monitoring in an AI context. By making the system's self-assessment explicit and transparent, we enable users to apply their own metacognitive resources appropriately.

### Design Implications

Our implementation suggests several design principles for AI systems seeking to support appropriate reliance:

1. **Calibration over confidence**: Systems should express uncertainty proportional to actual reliability, even when this reduces apparent helpfulness.

2. **Source transparency**: Distinguishing between grounded and inferred knowledge enables appropriate user scrutiny.

3. **Agency preservation**: Framing outputs as options rather than directives maintains human decision-making authority.

4. **Adaptive communication**: Epistemic communication should adapt to user preferences and expertise while maintaining accuracy standards.

5. **Error normalization**: Graceful self-correction protocols reduce the social cost of identifying AI errors, encouraging appropriate user vigilance.

### Limitations

This paper presents an architectural implementation without systematic empirical evaluation. Future work should assess the impact of these mechanisms on user trust calibration, error detection rates, and skill development outcomes.

The implementation assumes user willingness to engage with uncertainty expressions. In time-pressured contexts, users may prefer confident (if unreliable) answers. The tension between user preferences and epistemic integrity requires further investigation.

### Future Directions

Empirical evaluation of the implemented mechanisms represents the most pressing research priority. Controlled studies comparing user behavior with and without calibrated confidence expression would provide evidence for the effectiveness of this approach.

Integration with model-level uncertainty quantification represents another promising direction. If language models can be trained to produce calibrated confidence scores, these could inform the system's uncertainty expressions more directly than heuristic rules.

Finally, the collective intelligence framing from Butler et al. (2025) suggests extending this work to team contexts. How should AI systems express uncertainty when collaborating with multiple users who may have different expertise levels and information access?

## Conclusion

Building trustworthy AI requires moving beyond the appearance of infallibility toward honest helpfulness. By implementing calibrated confidence expression, source grounding protocols, and human agency preservation mechanisms, AI systems can support appropriate reliance—trust that matches actual reliability.

The research foundation from cognitive science, trust in automation, and human-AI collaboration converges on a clear implication: AI designed to augment rather than replace human judgment creates better outcomes for individuals, teams, and organizations. The implementation described in this paper represents one approach to realizing this vision within a cognitive architecture for AI assistants.

As Butler et al. (2025) conclude, "the future of work is not something that happens to us, it's something we create together" (p. 3). Designing AI systems that know what they don't know—and communicate that knowledge transparently—is essential to creating that future well.

## References

Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making. *Proceedings of the ACM on Human-Computer Interaction*, *5*(CSCW1), 1–21. https://doi.org/10.1145/3449287

Butler, J., Jaffe, S., Janssen, R., Baym, N., Hofman, J., Hecht, B., Rintel, S., Sarrafzadeh, B., Sellen, A., Vorvoreanu, M., Teevan, J., Alsobay, M., Ankrah, L., Beers, S., Benzing, M., Bruch, M., Buçinca, Z., Carpanelli, M., Cole, A., ... Young, J. (2025). *New future of work report 2025* (MSR-TR-2025-58). Microsoft Research. https://www.microsoft.com/en-us/research/publication/new-future-of-work-report-2025/

Flavell, J. H. (1979). Metacognition and cognitive monitoring: A new area of cognitive-developmental inquiry. *American Psychologist*, *34*(10), 906–911. https://doi.org/10.1037/0003-066X.34.10.906

Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., Ishii, E., Bang, Y. J., Madotto, A., & Fung, P. (2023). Survey of hallucination in natural language generation. *ACM Computing Surveys*, *55*(12), 1–38. https://doi.org/10.1145/3571730

Kadavath, S., Conerly, T., Askell, A., Henighan, T., Drain, D., Perez, E., Schiefer, N., Hatfield-Dodds, Z., DasSarma, N., Tran-Johnson, E., Johnston, S., El-Showk, S., Jones, A., Elhage, N., Hume, T., Chen, A., Bai, Y., Bowman, S., Fort, S., ... Kaplan, J. (2022). Language models (mostly) know what they know. *arXiv preprint arXiv:2207.05221*. https://doi.org/10.48550/arXiv.2207.05221

Kahneman, D. (2011). *Thinking, fast and slow*. Farrar, Straus and Giroux.

Lee, J. D., & See, K. A. (2004). Trust in automation: Designing for appropriate reliance. *Human Factors*, *46*(1), 50–80. https://doi.org/10.1518/hfes.46.1.50.30392

Lin, S., Hilton, J., & Evans, O. (2022). Teaching models to express their uncertainty in words. *Transactions on Machine Learning Research*. https://openreview.net/forum?id=8s8K2UZGTZ

Parasuraman, R., & Riley, V. (1997). Humans and automation: Use, misuse, disuse, abuse. *Human Factors*, *39*(2), 230–253. https://doi.org/10.1518/001872097778543886

Skitka, L. J., Mosier, K. L., & Burdick, M. (1999). Does automation bias decision-making? *International Journal of Human-Computer Studies*, *51*(5), 991–1006. https://doi.org/10.1006/ijhc.1999.0252

---

## Appendix: Implementation Artifacts

### Files Modified

| File | Modification |
|------|--------------|
| `.github/domain-knowledge/DK-APPROPRIATE-RELIANCE.md` | Created: Core domain knowledge module |
| `.github/instructions/alex-core.instructions.md` | Added: Safety & Trust synapse, activation patterns |
| `.github/instructions/protocol-triggers.instructions.md` | Added: Appropriate Reliance Triggers section |
| `.github/instructions/empirical-validation.instructions.md` | Added: Research foundation synapse |
| `.github/copilot-instructions.md` | Added: Trigger index and domain knowledge listing |

---

*Correspondence concerning this article should be addressed to Fabio Correa, Microsoft Corporation. Email: fabioc@microsoft.com*
