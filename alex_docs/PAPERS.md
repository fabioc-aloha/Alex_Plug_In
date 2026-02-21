# Alex Papers & Research

**🔗 Repository**: https://github.com/fabioc-aloha/AlexPapers

All academic papers, research documents, and publication-ready manuscripts have been moved to a dedicated repository to maintain a single source of truth for research content.

---

## Why a Separate Repository?

**Separation of Concerns**:
- **Alex_Plug_In**: Production code, cognitive architecture, extension development
- **AlexPapers**: Academic writing, empirical studies, research documentation

**Different Lifecycles**:
- Code follows semver (v5.9.3, v6.0.0)
- Papers follow publication stages (draft → submission → revision → published)

**Different Audiences**:
- Code: Developers, contributors, users
- Papers: Researchers, academics, reviewers, citation indexing

---

## What's in AlexPapers

### Primary Publications

| Document | Status | Target Venue |
|----------|--------|--------------|
| [RESPONSE-AI-IDES-VS-AGENTS.md](https://github.com/fabioc-aloha/AlexPapers/blob/main/RESPONSE-AI-IDES-VS-AGENTS.md) | Draft | MSR 2027 |
| [ACADEMIC-PAPER.md](https://github.com/fabioc-aloha/AlexPapers/blob/main/ACADEMIC-PAPER.md) | Draft | CHI 2027 |
| [COGNITIVE-DEBT-ARTICLE.md](https://github.com/fabioc-aloha/AlexPapers/blob/main/COGNITIVE-DEBT-ARTICLE.md) | Draft | IEEE Software |
| [APPROPRIATE-RELIANCE-TECHNICAL-BRIEF.md](https://github.com/fabioc-aloha/AlexPapers/blob/main/APPROPRIATE-RELIANCE-TECHNICAL-BRIEF.md) | Draft | FAccT 2027 |

### Empirical Studies

| Document | Purpose |
|----------|---------|
| [REPLICATION-GUIDE.md](https://github.com/fabioc-aloha/AlexPapers/blob/main/REPLICATION-GUIDE.md) | Methodology for validating Alex productivity claims using DiD analysis |
| [CASE-STUDY-DATA.md](https://github.com/fabioc-aloha/AlexPapers/blob/main/CASE-STUDY-DATA.md) | N=1 illustrative case study data collection framework |

### Research Foundation

| Directory | Contents |
|-----------|----------|
| [research/](https://github.com/fabioc-aloha/AlexPapers/tree/main/research) | Background research: Siegel neurobiology, learning psychology, competitive analysis, AI methodology |
| [methodology/](https://github.com/fabioc-aloha/AlexPapers/tree/main/methodology) | Research-first development protocol |
| [versions/](https://github.com/fabioc-aloha/AlexPapers/tree/main/versions) | 14 venue-specific manuscript adaptations (CHI, CSCW, IEEE, etc.) |
| [appropriate-reliance/](https://github.com/fabioc-aloha/AlexPapers/tree/main/appropriate-reliance) | 5 versions of appropriate reliance framework |
| [assets/](https://github.com/fabioc-aloha/AlexPapers/tree/main/assets) | Figures, diagrams, empirical plots |

---

## Publication Strategy

**Immediate Targets** (CHI 2027, MSR 2027, FAccT 2027):
- Response to Agarwal et al. highlighting cognitive architecture advantages
- Appropriate reliance framework for AI delegation
- HCI study on meta-cognitive AI interfaces

**Medium-term Targets** (CSCW 2027, IEEE Software):
- Cognitive debt and technical debt unification
- Software architecture patterns for AI collaboration

**Long-term Targets** (JKM, MIS Quarterly):
- Organizational learning through AI cognitive architectures
- Knowledge management in AI-human teams

See [PUBLICATION-STRATEGY.md](https://github.com/fabioc-aloha/AlexPapers/blob/main/PUBLICATION-STRATEGY.md) for full roadmap.

---

## Citation

If you reference Alex research, please cite:

```bibtex
@misc{correa2026alex,
  title={Alex Cognitive Architecture: Meta-Cognitive AI for Sustainable Knowledge Work},
  author={Correa, Fabio Claudio Ferracchiati and Finch, Alex},
  year={2026},
  howpublished={\url{https://github.com/fabioc-aloha/AlexPapers}},
  note={GitHub repository}
}
```

---

## Contributing Research

If you're conducting research on Alex:
1. Clone [AlexPapers](https://github.com/fabioc-aloha/AlexPapers)
2. Add your study to `research/` or create a new directory
3. Update the repository README with your contribution
4. Submit a pull request

---

## Migration History

**Date**: February 21, 2026  
**Migrated From**: `Alex_Plug_In/article/` → `AlexPapers/`  
**Reason**: Separate research lifecycle from code development  
**Files Moved**: 54 documents (papers, research, methodology, versions, assets)

---

**Last Updated**: February 21, 2026  
**Maintained By**: Fabio Correa (@fabioc-aloha)
