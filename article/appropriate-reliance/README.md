# Appropriate Reliance Research Artifacts

This folder contains the evolving article on implementing appropriate reliance in the Alex cognitive architecture, along with key source materials.

## Article Versions

| Version | Description | Lines | Key Additions |
|---------|-------------|-------|---------------|
| [V1](APPROPRIATE-RELIANCE-V1.md) | Initial implementation | ~250 | Core protocols: source grounding, confidence calibration, "confident but wrong" detection |
| [V2](APPROPRIATE-RELIANCE-V2.md) | Use case expansion | ~400 | Appendix B with 7 application domains (B.1-B.7) |
| [V3](APPROPRIATE-RELIANCE-V3.md) | Full scholarly treatment | ~890 | Expanded literature review, theoretical foundations, academic verbosity |
| [V4](APPROPRIATE-RELIANCE-V4.md) | Balance imperative | ~930 | Creative Latitude Framework, "don't cuff Alex", measurement integration (Vasconcelos, Wang) |
| [V5](APPROPRIATE-RELIANCE-V5.md) | **Current** - AETHER integration | ~1100 | Full AETHER synthesis integration, mitigation strategies, CAIR/CSR framework, design checklist |

## Source Materials

### Primary Research

| Source | Type | Key Contribution |
|--------|------|------------------|
| [GenAI_AppropriateReliance_Published2024-3-21.pdf](GenAI_AppropriateReliance_Published2024-3-21.pdf) | MSR AETHER Synthesis | Comprehensive review of ~50 papers; CAIR/CSR framework; mitigation strategies |
| Butler et al. (2025) - NFW Report | External | Collective intelligence framing; future of work context |
| Lin et al. (2022) | External | Teaching models to express uncertainty in words |
| Kadavath et al. (2022) | External | Language models (mostly) know what they know |
| Vasconcelos et al. (2023) | External | Measurement framework for over-reliance |
| Wang et al. (2025) | External | Training effects on user reliance |

### AETHER Research Synthesis Authors

- **Samir Passi, Ph.D.** - RAI User Researcher
- **Shipi Dhanorkar, Ph.D.** - RAI User Researcher
- **Mihaela Vorvoreanu, Ph.D.** - Director, Aether UX Research & Education

## Key Concepts

### Appropriate Reliance Definition
> Appropriate reliance on AI happens when users accept correct AI outputs and reject incorrect ones.

### Two Components (Schemmer et al., 2023)
- **CAIR** (Correct AI-Reliance): Users rely on AI when AI is right
- **CSR** (Correct Self-Reliance): Users rely on themselves when AI is wrong

### Research-Validated Mitigation Strategies
1. **Verification-focused explanations**: Help users assess correctness, not just understand outputs
2. **Uncertainty expressions**: Linguistic and visual indicators of reliability
3. **Cognitive forcing functions**: Strategic interruptions engaging analytical thinking

### The Balance Imperative
> The goal is not to "cuff" the AI assistant—restricting creativity, novel ideation, or confident engagement—but to calibrate confidence expression to actual reliability while preserving generative capabilities.

## Implementation Artifacts

The article versions document implementation in the Alex cognitive architecture:

- **DK-APPROPRIATE-RELIANCE.md**: Core domain knowledge module
- **alex-core.instructions.md**: Synapse connections, activation patterns
- **protocol-triggers.instructions.md**: Trigger-response mappings

## Version History Summary

```
V1.0 → Initial protocols
V2.0 → Use case appendices
V3.0 → Full scholarly expansion
V4.0 → Creative latitude + measurement
V5.0 → AETHER synthesis integration (current)
```

---

*Last updated: Article Version 5.0*
