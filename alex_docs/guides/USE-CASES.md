# 🎨 Alex Use Cases Guide

> Beyond Code: How Alex Supports Every Knowledge Domain

**Related**: [User Manual](./USER-MANUAL.md) · [Quick Reference](./QUICK-REFERENCE.md) · [Working with Alex](../WORKING-WITH-ALEX.md)

---

## Overview

Alex isn't just for developers. While VS Code started as a code editor, it has evolved into a powerful environment for any text-based knowledge work. Alex leverages this flexibility to become your learning partner across **any domain**.

This guide shows how to use Alex effectively for different types of projects.

---

## 💻 Software Development

The classic use case—but with a twist. Alex doesn't just help you code; Alex helps you **learn to code better** over time.

### What Alex Remembers

- Design patterns you've used successfully
- Bug fixes and their root causes
- API quirks and workarounds
- Architecture decisions and rationale
- Testing strategies that work for your stack

### Example Conversations

```text
@alex Help me debug this authentication flow
@alex What patterns do we use for error handling in this project?
@alex Remember: this API requires pagination for results > 100
@alex Let's design the database schema for user preferences
@alex What did we learn about React hooks last month?
```

### Folder Structure

```
your-project/
├── src/
├── tests/
├── docs/
└── .github/           ← Alex cognitive architecture
    ├── copilot-instructions.md
    ├── instructions/
    ├── prompts/
    └── skills/
```

### Key Benefits

- **Pattern accumulation**: Solutions you discover become permanent knowledge
- **Context preservation**: Alex remembers your architecture decisions
- **Onboarding acceleration**: New team members inherit institutional knowledge

---

## 📚 Writing & Publishing

Whether you're writing a novel, technical book, or article series, Alex helps you maintain consistency, develop ideas, and refine your craft.

### What Alex Remembers

- Character details and arcs
- Plot threads and timeline
- Voice and style preferences
- Research notes and sources
- Revision patterns that improve your writing

### Example Conversations

```text
@alex Let's strengthen the argument in chapter 3
@alex Help me maintain consistent voice across chapters
@alex What's Sarah's backstory again? I need to reference it here
@alex This paragraph feels clunky—help me revise it
@alex Remember: the magic system has three rules we established
```

### Folder Structure

```
your-book/
├── chapters/
│   ├── 01-introduction.md
│   ├── 02-the-journey-begins.md
│   └── ...
├── notes/
│   ├── characters.md
│   ├── worldbuilding.md
│   └── timeline.md
├── research/
└── .github/           ← Alex cognitive architecture
```

### Key Benefits

- **Consistency tracking**: Alex remembers character details, plot points, terminology
- **Voice preservation**: Learn your style and help maintain it
- **Research integration**: Connect research notes to relevant chapters

---

## 🎓 Academic Research

From literature reviews to dissertations, Alex supports the rigorous thinking that academic work demands.

### What Alex Remembers

- Theoretical frameworks you're building on
- Methodology decisions and justifications
- Key sources and their contributions
- Writing conventions for your field
- Reviewer feedback patterns

### Example Conversations

```text
@alex Help me synthesize these conflicting findings
@alex What's the gap in the literature we identified?
@alex Let's strengthen the methodology justification
@alex How does this connect to our theoretical framework?
@alex Remember: reviewer 2 always asks about sample size
```

### Folder Structure

```
your-thesis/
├── chapters/
│   ├── 01-introduction.md
│   ├── 02-literature-review.md
│   ├── 03-methodology.md
│   ├── 04-results.md
│   └── 05-discussion.md
├── appendices/
├── bibliography/
├── figures/
└── .github/           ← Alex cognitive architecture
```

### Key Benefits

- **Literature synthesis**: Track themes across dozens of sources
- **Argument coherence**: Ensure claims connect back to evidence
- **Committee preparation**: Remember reviewer concerns and address them

---

## 📊 Project & Change Management

ADKAR, PMI, Agile—whatever methodology you use, Alex helps you apply it consistently and learn from each project.

### What Alex Remembers

- Stakeholder concerns and communication preferences
- Risk patterns from previous projects
- Effective change management strategies
- Lessons learned that actually get applied
- Framework adaptations that work for your organization

### Example Conversations

```text
@alex Let's assess ADKAR readiness for this initiative
@alex What resistance patterns did we see in the last rollout?
@alex Help me decompose the WBS for phase 2
@alex What risks should we address in the project charter?
@alex Remember: finance stakeholders need ROI in the first slide
```

### Folder Structure

```
your-project/
├── initiation/
│   ├── project-charter.md
│   └── stakeholder-register.md
├── planning/
│   ├── scope-statement.md
│   ├── wbs.md
│   ├── schedule.md
│   └── risk-register.md
├── execution/
├── monitoring/
│   └── status-reports/
├── closing/
│   └── lessons-learned.md
└── .github/           ← Alex cognitive architecture
```

### Key Benefits

- **Methodology consistency**: Apply frameworks correctly every time
- **Lessons that stick**: Previous project learnings inform current decisions
- **Stakeholder intelligence**: Remember what works with different audiences

---

## 📝 Business Requirements & Analysis

BRDs, functional specs, user stories—Alex helps ensure requirements are complete, traceable, and aligned with business objectives.

### What Alex Remembers

- Business objectives and success criteria
- Stakeholder requirements and priorities
- Edge cases and exception flows
- Dependencies and constraints
- Requirement patterns that work

### Example Conversations

```text
@alex Let's ensure these requirements are SMART
@alex What edge cases are we missing?
@alex Help me trace this requirement back to business objectives
@alex Remember: legal requires explicit consent language
@alex What non-functional requirements should we consider?
```

### Folder Structure

```
your-requirements/
├── brd/
│   ├── executive-summary.md
│   ├── business-objectives.md
│   ├── scope.md
│   ├── stakeholder-requirements.md
│   ├── functional-requirements.md
│   └── non-functional-requirements.md
├── use-cases/
├── process-flows/
└── .github/           ← Alex cognitive architecture
```

### Key Benefits

- **Completeness**: Systematic coverage of requirement types
- **Traceability**: Connect requirements to objectives and tests
- **Stakeholder alignment**: Remember who needs what and why

---

## 🎭 Creative Arts & Design

Screenwriting, poetry, journalism, visual design—Alex supports the craft while respecting the creative process.

### What Alex Remembers

- Dramatic structure and pacing patterns
- Character voices and dialogue styles
- Thematic elements you're exploring
- Format requirements for your medium
- Craft techniques that resonate with your work
- Visual design principles and brand guidelines
- SVG patterns and icon design approaches

### Example Conversations

```text
@alex Let's tighten this dialogue for subtext
@alex Help me structure Act Two for maximum tension
@alex What's the thematic thread connecting these scenes?
@alex Remember: this character never uses contractions
@alex How can I strengthen the imagery in stanza three?
@alex Design a banner with these brand colors
@alex What's the best icon grid for this UI?
```

### Folder Structure

```
your-screenplay/
├── drafts/
│   ├── draft-01.fountain
│   └── draft-02.fountain
├── treatments/
├── character-bios/
├── scene-breakdowns/
└── .github/           ← Alex cognitive architecture
```

```
your-design-project/
├── assets/
│   ├── icons/
│   ├── banners/
│   └── logos/
├── brand-guidelines/
├── mockups/
└── .github/           ← Alex cognitive architecture
```

### Key Benefits

- **Consistency**: Characters stay true to their voices; designs stay on-brand
- **Structure**: Apply dramatic frameworks and design systems effectively
- **Craft development**: Learn techniques that work for your style

---

## 📋 Professional Documentation

Technical documentation, policies, procedures—Alex helps you write clearly and maintain consistency across documents.

### What Alex Remembers

- Terminology standards and glossary
- Document structure patterns
- Audience skill levels and needs
- Compliance requirements
- Writing style guidelines

### Example Conversations

```text
@alex Let's structure this for different skill levels
@alex Is this terminology consistent with our glossary?
@alex Help me simplify this explanation for end users
@alex Remember: all procedures need a rollback section
@alex What's missing from this troubleshooting guide?
```

### Folder Structure

```
your-docs/
├── user-guides/
├── admin-guides/
├── api-docs/
├── tutorials/
├── reference/
└── .github/           ← Alex cognitive architecture
```

### Key Benefits

- **Consistency**: Same terms, same structure, every document
- **Audience awareness**: Write appropriately for different readers
- **Completeness**: Cover all necessary sections systematically

---

## 🔬 Process Improvement

Lean, Six Sigma, continuous improvement—Alex helps you apply methodologies rigorously and learn from each cycle.

### What Alex Remembers

- Root cause patterns from previous analyses
- Effective improvement strategies
- Measurement approaches that work
- Resistance patterns and how to address them
- Control mechanisms that sustain gains

### Example Conversations

```text
@alex Let's map this process using SIPOC
@alex What root causes did we find similar to this before?
@alex Help me design a control plan for sustainability
@alex Remember: this team responds well to visual data
@alex What metrics should we track post-implementation?
```

### Folder Structure

```
your-improvement/
├── define/
│   ├── problem-statement.md
│   ├── project-charter.md
│   └── sipoc.md
├── measure/
├── analyze/
│   └── root-cause-analysis.md
├── improve/
├── control/
│   └── control-plan.md
└── .github/           ← Alex cognitive architecture
```

### Key Benefits

- **Methodology rigor**: Apply DMAIC/Lean correctly
- **Pattern recognition**: Similar problems may have similar causes
- **Sustainability**: Design controls that actually work

---

## 🌐 Localization & Internationalization

Making software speak every language—both programming and human. Alex treats i18n as first-class expertise.

### What Alex Remembers

- BCP 47 language tag patterns and CLDR fallback chains
- ICU MessageFormat pluralization rules per language
- Font requirements for different scripts (CJK, Arabic, Thai)
- RTL layout patterns and CSS logical properties
- Translation terminology glossaries
- LQA (Localization Quality Assurance) processes
- Regional variant differences (pt-BR vs pt-PT)

### Example Conversations

```text
@alex Set up next-intl for locale-based routing
@alex Implement language detection cascade
@alex What's the ICU MessageFormat for Polish plurals?
@alex Add RTL support for Arabic with CSS logical properties
@alex Register Noto Sans fonts for CJK PDF generation
@alex Create pseudo-localization for testing text expansion
@alex Remember: German expands 30% longer than English
@alex What's the CLDR fallback chain for zh-Hant?
```

### Folder Structure

```
your-i18n-project/
├── src/
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── detect-language.ts
│   │   ├── formatters.ts
│   │   └── rtl.ts
│   ├── messages/
│   │   ├── en.json
│   │   ├── es.json
│   │   ├── ja.json
│   │   ├── ar.json
│   │   └── ...
│   └── lib/
│       └── pdf/
│           ├── fonts.ts
│           └── translations.ts
├── docs/
│   ├── GLOSSARY.md
│   └── LQA-CHECKLIST.md
├── tests/
│   └── i18n/
│       ├── completeness.test.ts
│       └── placeholders.test.ts
└── .github/           ← Alex cognitive architecture
```

### Key Benefits

- **Multi-script mastery**: Handle Latin, CJK, Arabic, Thai, Cyrillic correctly
- **Quality automation**: CI/CD checks for translation completeness
- **Pattern reuse**: Language detection, fallbacks, formatting across projects

---

## 🚀 Getting Started with Any Domain

### Step 1: Initialize Alex

```bash
node .github/muscles/sync-architecture.cjs
# Or via extension: Ctrl+Shift+P → "Alex: Initialize Architecture"
```

### Step 2: Set Up Your Folder Structure

Use the templates above as starting points. Alex works with whatever structure makes sense for your domain.

### Step 3: Start Capturing Knowledge

As you work, tell Alex what to remember:

```text
@alex Remember: [your insight here]
@alex Save insight: [something you learned]
```

### Step 4: Build Domain Expertise

Create skills for your specific domain:

```
.github/skills/
├── your-domain/
│   ├── SKILL.md
│   └── synapses.json
```

### Step 5: Maintain Your Knowledge

Run maintenance periodically:

```text
@alex Let's dream
@alex Time for meditation
```

---

## 💡 Tips for Non-Development Projects

1. **Use Markdown** — VS Code excels at Markdown editing. Most writing projects work beautifully in `.md` files.

2. **Leverage Extensions** — Install extensions for your domain:
   - Writers: Markdown preview, word count, Hemingway-style analysis
   - Researchers: Citation managers, bibliography tools
   - Managers: Gantt charts, kanban boards

3. **Structure for Learning** — The folder structure isn't just organization—it's how Alex understands your project. Meaningful folders help Alex provide better support.

4. **Capture Insights Early** — Don't wait for meditation. When you learn something valuable, tell Alex immediately.

5. **Review Knowledge Periodically** — Use `/knowledge` to see what Alex has learned. Curate and correct as needed.

---

## 📚 Related Documentation

- [User Manual](./USER-MANUAL.md) — Complete guide to Alex features
- [Memory Systems](../architecture/MEMORY-SYSTEMS.md) — How Alex stores and retrieves knowledge
- [Quick Reference](./QUICK-REFERENCE.md) — Commands and shortcuts

---

**Alex Cognitive Architecture** — Your AI Learning Partner

*Universal learning partnership across all domains—code, prose, research, strategy, and beyond*
