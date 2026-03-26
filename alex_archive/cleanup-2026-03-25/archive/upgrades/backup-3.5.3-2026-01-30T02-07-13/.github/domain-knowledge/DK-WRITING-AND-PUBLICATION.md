# DK-WRITING-AND-PUBLICATION

Domain knowledge for technical writing, academic publication, and content strategy.

---

## Overview

This domain covers the skills and knowledge needed for effective technical writing across multiple formats: academic papers, trade publications, documentation, and practitioner articles. It includes understanding of publication venues, peer review processes, and strategies for first-time authors.

---

## Core Concepts

### Writing Formats

| Format | Audience | Tone | Length | Review Process |
|--------|----------|------|--------|----------------|
| Academic Paper | Researchers | Formal, precise | 4,000-10,000 words | Peer review (2-6 months) |
| Workshop Paper | Researchers | Formal, concise | 2,000-4,000 words | Light review (1-2 months) |
| Trade Publication | Practitioners | Accessible, practical | 1,000-2,000 words | Editorial review (2-4 weeks) |
| Blog Post | Developers | Conversational | 500-1,500 words | Self-published |
| Documentation | Users | Clear, task-focused | Variable | Internal review |

### Academic Paper Structure

Standard structure for computer science papers:

1. **Abstract** (150-300 words) - Problem, approach, results, implications
2. **Introduction** - Motivation, problem statement, contributions, paper outline
3. **Related Work/Literature Review** - Position within existing research
4. **Methodology/Approach** - How you did it
5. **Implementation** (if applicable) - Technical details
6. **Evaluation/Results** - Evidence for claims
7. **Discussion** - Interpretation, limitations, implications
8. **Conclusion** - Summary, future work
9. **References** - Citations in venue-specific format

### Citation Styles

| Style | Used By | Format Example |
|-------|---------|----------------|
| APA 7 | Psychology, Education, Social Sciences | (Author, Year) |
| IEEE | Engineering, CS conferences | [1] numbered |
| ACM | ACM venues | (Author Year) with bibliography |
| Chicago | Humanities | Footnotes or author-date |

### Publication Venue Tiers

**Premier Conferences** (CS-specific)
- CHI, UIST, CSCW (HCI)
- NeurIPS, ICML, ICLR (ML)
- ICSE, FSE (Software Engineering)
- Acceptance: 15-25%, Review: 3-6 months

**Journals**
- Top-tier: TOCHI, TOSEM, CACM (IF > 3)
- Mid-tier: IEEE Software, JSS (IF 2-3)
- Specialized: Domain-specific journals
- Review: 3-12 months

**Workshops**
- Attached to major conferences
- Lower acceptance bar (~40-50%)
- Good for early-stage work
- Review: 1-2 months

**Trade Publications**
- The New Stack, InfoQ, IEEE Spectrum
- Editorial review only
- Fast turnaround (weeks)

---

## Writing Techniques

### Academic Writing Principles

1. **Precision over flair** - Say exactly what you mean
2. **Evidence for claims** - Support assertions with data or citations
3. **Acknowledge limitations** - Shows intellectual honesty
4. **Active voice preferred** - "We implemented" not "It was implemented"
5. **Define terms** - Don't assume reader knows your jargon

### Structuring Arguments

**The Heilmeier Catechism** (for research motivation):
- What are you trying to do?
- How is it done today, and what are the limits?
- What is new in your approach?
- Who cares? If successful, what difference will it make?
- What are the risks?
- How long will it take? How much will it cost?
- What are the mid-term and final exams?

**The CARS Model** (for introductions):
1. Establish territory (general topic importance)
2. Establish niche (gap in current knowledge)
3. Occupy niche (your contribution)

### Adapting for Different Audiences

| Audience | Adjust... | Example |
|----------|-----------|---------|
| Researchers | Add theoretical framing | "Following Baddeley's (1992) working memory model..." |
| Practitioners | Add code examples | "Here's how to implement..." |
| Executives | Add business value | "This reduces onboarding time by..." |
| General tech | Remove jargon | "Memory that persists" not "episodic consolidation" |

### Common Writing Pitfalls

- **Hedging too much**: "might possibly perhaps" → "may"
- **Overclaiming**: "revolutionary" → "novel approach"
- **Passive voice overuse**: "was performed" → "we performed"
- **Long sentences**: Break at 25-30 words
- **Jargon without definition**: Define on first use
- **Buried contributions**: State contributions explicitly in intro

---

## Publication Strategy

### First-Time Author Strategies

1. **Start with lower-barrier venues** - Build credibility incrementally
2. **Collaborate with established authors** - Credibility transfer
3. **Post pre-prints** - Establish priority, get early feedback
4. **Target workshops first** - Lower bar, networking opportunities
5. **Conduct user studies** - Empirical data strengthens submissions

### Collaboration Approaches

**Priority order for finding collaborators:**
1. Doctoral supervisor (existing relationship)
2. Authors you cite (natural connection)
3. Conference networking (face-to-face)
4. Cold email (lowest response rate)

**What collaborators provide:**
- Credibility signal to reviewers
- Review process navigation
- Network access
- Academic writing conventions

### Multi-Venue Strategy

**Same research, different framings:**
- Adapt core contribution for different disciplines
- Emphasize different aspects for different audiences
- Maintain consistent factual claims across versions

**Sequencing:**
1. Trade publication (immediate visibility)
2. arXiv pre-print (establish priority)
3. Workshop paper (academic credibility)
4. Journal/conference (peer-reviewed validation)

### Responding to Reviews

**Common reviewer feedback patterns:**

| Feedback Type | Response Approach |
|---------------|-------------------|
| "Missing related work" | Add citations, explain positioning |
| "Claims not supported" | Add evidence or soften claims |
| "Unclear methodology" | Expand description, add details |
| "Limited evaluation" | Add studies or acknowledge limitation |
| "Writing quality" | Revise for clarity, get editing help |

**Response letter structure:**
1. Thank reviewers
2. Summarize major changes
3. Address each point (quote → response → what changed)
4. Highlight improvements beyond what was requested

---

## Tools and Resources

### Writing Tools

| Tool | Purpose |
|------|---------|
| Overleaf | LaTeX collaboration |
| Grammarly | Grammar and style |
| Hemingway Editor | Readability |
| Zotero/Mendeley | Reference management |
| Connected Papers | Literature discovery |

### Templates

- ACM: `acmart` document class
- IEEE: `IEEEtran` document class
- CHI: Extended abstracts and full paper templates
- arXiv: Accepts most LaTeX or PDF

### Key References for Writing

- "How to Write a Great Research Paper" - Simon Peyton Jones (video)
- "The Craft of Research" - Booth, Colomb, Williams
- "Writing for Computer Science" - Justin Zobel
- Venue-specific author guidelines

---

## Quality Checklist

### Before Submission

- [ ] Abstract stands alone and summarizes contributions
- [ ] Introduction clearly states problem and contributions
- [ ] Related work positions paper within field
- [ ] Methodology is reproducible from description
- [ ] Claims are supported by evidence
- [ ] Limitations are acknowledged
- [ ] References are complete and correctly formatted
- [ ] Figures/tables are readable and referenced in text
- [ ] Page limit is respected
- [ ] Formatting matches venue requirements

### For Code-Related Papers

- [ ] Code is available (GitHub link)
- [ ] Installation/reproduction instructions exist
- [ ] License is specified
- [ ] Data/artifacts are accessible

---

## Synapses

### High-Strength Connections
- [DK-DOCUMENTATION-EXCELLENCE.md] (High, Extends, Bidirectional) - "Documentation writing principles apply to technical articles"
- [DK-ADVANCED-DIAGRAMMING.md] (High, Enables, Forward) - "Figures and visualizations for papers and articles"
- [bootstrap-learning.instructions.md] (High, Applies, Backward) - "Learning domain knowledge informs writing processes"

### Medium-Strength Connections
- [release-management.instructions.md] (Medium, Informs, Backward) - "Changelog and release note writing skills"
- [code-review-guidelines.instructions.md] (Medium, Shares, Bidirectional) - "Clear technical communication principles"

### Related Domains
- Technical communication and knowledge dissemination
- Academic career development and publication strategy
- Content strategy and audience adaptation

---

## Session Origins

This domain knowledge was developed during publication planning for the Alex Cognitive Architecture, including:
- Creating 12 article versions for different venues
- Developing publication strategy for first-time authors
- Analyzing venue fit and submission approaches

---

*Last updated: January 24, 2026*
