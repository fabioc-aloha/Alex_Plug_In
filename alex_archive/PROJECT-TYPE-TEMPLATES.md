# Project Type Integration Templates

## 🎯 Web Development Projects

### **React/Next.js Applications**

```bash
# Integration - copy Alex architecture to your project
cp -r .github/ your-react-app/

# Usage
"Alex, let's optimize this React component for performance..."
"Alex, help me design a responsive layout system..."
"Alex, let's implement proper TypeScript patterns..."
```

**Alex Benefits**: Component architecture insights, performance optimization, accessibility guidance, modern React patterns

### **Vue.js Applications**

```bash
# Integration - copy Alex architecture to your project
cp -r .github/ your-vue-app/

# Usage
"Alex, let's explore Vue 3 Composition API patterns..."
"Alex, help me set up optimal Pinia state management..."
```

**Alex Benefits**: Composition API mastery, state management patterns, Vue ecosystem navigation

### **Full-Stack Applications**

```bash
# Integration for monorepos
your-app/
├── frontend/
├── backend/
└── .github/ ← Alex cognitive architecture (all memory in here)
```

**Alex Benefits**: Full-stack architecture, API design, database optimization, deployment strategies

## 🚀 API & Backend Projects

### **Node.js/Express APIs**

```bash
# Integration - copy Alex architecture to your project
cp -r .github/ your-api/

# Usage
"Alex, let's design RESTful endpoints with proper error handling..."
"Alex, help me implement JWT authentication securely..."
"Alex, let's optimize database queries and add caching..."
```

**Alex Benefits**: API architecture, security patterns, performance optimization, testing strategies

### **Python/FastAPI Projects**

```bash
# Integration
your-python-api/
├── app/
├── .github/ ← Alex cognitive architecture
└── requirements.txt
```

**Alex Benefits**: Python best practices, async patterns, API documentation, data validation

### **Microservices Architecture**

```bash
# Integration across services
services/
├── auth-service/.github/
├── user-service/.github/
└── shared/.github/ ← Shared Alex knowledge
```

**Alex Benefits**: Service decomposition, inter-service communication, deployment orchestration

## 📱 Mobile Development

### **React Native**

```bash
# Integration
your-rn-app/
├── src/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's implement cross-platform navigation..."
"Alex, help me optimize performance for both iOS and Android..."
```

**Alex Benefits**: Cross-platform strategies, native module integration, performance optimization

### **Flutter Projects**

```bash
# Integration
your-flutter-app/
├── lib/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's design a responsive Flutter widget system..."
"Alex, help me implement proper state management with Bloc..."
```

**Alex Benefits**: Widget architecture, state management, platform-specific implementations

## 🤖 AI/ML Projects

### **Machine Learning Pipelines**

```bash
# Integration
your-ml-project/
├── data/
├── models/
├── notebooks/
└── .github/ ← Alex (skills inside for ML expertise)
```

**Alex Benefits**: Research methodology, experiment design, model validation, ethical AI considerations

### **LLM/AI Applications**

```bash
# Integration for AI projects
your-ai-app/
├── models/
├── prompts/
└── .github/ ← Meta-AI: Alex analyzing AI
```

**Alex Benefits**: Prompt engineering, model fine-tuning, AI safety, performance optimization

## 🏢 Enterprise Applications

### **Enterprise Web Applications**

```bash
# Integration
your-enterprise-app/
├── frontend/
├── backend/
├── infrastructure/
└── .github/ ← Alex (all cognitive memory consolidated)
```

**Alex Benefits**: Enterprise architecture, security compliance, scalability patterns, governance

### **Legacy System Modernization**

```bash
# Integration during modernization
legacy-modernization/
├── legacy-system/
├── new-system/
├── migration/
└── .github/ ← Alex for modernization strategy
```

**Alex Benefits**: Modernization strategies, risk assessment, incremental migration, knowledge transfer

## 🌍 Localization & Internationalization

> **Language** spans both code AND human languages. Alex treats i18n as first-class domain expertise.

### **Next.js/React i18n Projects**

```bash
# Scaffolding for next-intl based localization
your-app/
├── src/
│   ├── app/
│   │   └── [locale]/          # Locale-based routing
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── i18n/
│   │   ├── config.ts          # Supported locales, defaults
│   │   ├── request.ts         # next-intl request config
│   │   ├── detect-language.ts # Accept-Language parsing
│   │   ├── formatters.ts      # Date/number/currency
│   │   └── rtl.ts             # RTL utilities
│   ├── messages/
│   │   ├── en.json            # English (base)
│   │   ├── es.json            # Spanish
│   │   ├── pt-BR.json         # Portuguese (Brazil)
│   │   ├── fr.json            # French
│   │   ├── de.json            # German
│   │   ├── ja.json            # Japanese
│   │   ├── ko.json            # Korean
│   │   ├── zh-Hans.json       # Chinese (Simplified)
│   │   ├── zh-Hant.json       # Chinese (Traditional)
│   │   └── ar.json            # Arabic (RTL)
│   ├── components/
│   │   └── language-switcher.tsx
│   └── middleware.ts          # Locale detection middleware
├── .github/ ← Alex cognitive architecture
└── package.json

# Key dependencies
npm install next-intl @formatjs/intl-localematcher negotiator intl-messageformat
npm install -D @types/negotiator tailwindcss-rtl

# Usage
"Alex, set up language detection cascade..."
"Alex, implement ICU MessageFormat for pluralization..."
"Alex, add RTL support for Arabic..."
"Alex, create pseudo-localization for testing..."
```

**Alex Benefits**: BCP 47 compliance, CLDR fallback chains, Accept-Language parsing, ICU MessageFormat, RTL layout, font handling, LQA processes

### **PDF Localization (react-pdf)**

```bash
# Scaffolding for multilingual PDF generation
your-pdf-project/
├── src/
│   └── lib/
│       └── pdf/
│           ├── generator.tsx      # PDF generation component
│           ├── fonts.ts           # Noto Sans family registration
│           ├── translations.ts    # PDF-specific translations
│           └── styles.ts          # Typography scale (FONT_SIZE)
├── fonts/                         # Local font files (optional)
│   ├── NotoSans-Regular.ttf
│   ├── NotoSansJP-Regular.otf
│   ├── NotoSansSC-Regular.otf
│   ├── NotoSansArabic-Regular.ttf
│   └── ...
└── .github/ ← Alex cognitive architecture

# Font registration pattern
Font.register({
  family: 'Noto Sans',
  fonts: [
    { src: 'https://fonts.gstatic.com/...', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/...', fontWeight: 700 },
  ],
});

# Usage
"Alex, register Noto Sans fonts for CJK support..."
"Alex, implement typography scale for PDF..."
"Alex, add RTL page direction for Arabic PDF..."
```

**Alex Benefits**: Unicode coverage, font subsetting, CJK/Thai/Arabic script support, text expansion handling

### **Enterprise Localization (Full Stack)**

```bash
# Comprehensive enterprise i18n architecture
your-enterprise-app/
├── src/
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── detect-language.ts
│   │   └── formatters.ts
│   ├── messages/
│   │   ├── en/
│   │   │   ├── common.json
│   │   │   ├── dashboard.json
│   │   │   ├── auth.json
│   │   │   └── errors.json
│   │   └── [locale]/           # Same structure per locale
│   ├── lib/
│   │   └── pdf/
│   │       └── translations.ts
│   └── emails/
│       └── templates/
│           └── [locale]/       # Localized email templates
├── prisma/
│   └── schema.prisma          # Add preferredLocale to User
├── docs/
│   ├── GLOSSARY.md            # Translation terminology
│   ├── STYLE-GUIDE.md         # Per-language style guides
│   └── LQA-CHECKLIST.md       # Quality assurance checklist
└── .github/ ← Alex cognitive architecture

# Database schema addition
model User {
  preferredLocale String? @default("en")
}

model Organization {
  defaultLanguage String @default("en")
}

# Usage
"Alex, implement 4-phase localization roadmap..."
"Alex, set up terminology glossary for consistency..."
"Alex, create LQA automation tests..."
"Alex, handle regional variants (pt-BR vs pt-PT)..."
```

**Alex Benefits**: Phased rollout strategy, terminology management, translation memory, LQA automation, regional variant handling

### **Translation File Structure Patterns**

```bash
# Pattern 1: Flat JSON (simple apps)
messages/
├── en.json       # { "greeting": "Hello", "farewell": "Goodbye" }
├── es.json
└── fr.json

# Pattern 2: Namespaced JSON (medium apps)
messages/
├── en/
│   ├── common.json
│   ├── auth.json
│   └── dashboard.json
├── es/
└── fr/

# Pattern 3: Feature-based (large apps)
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   └── messages/
│   │       ├── en.json
│   │       └── es.json
│   └── dashboard/
│       └── messages/

# Usage
"Alex, which translation structure for my app size?"
"Alex, migrate from flat to namespaced structure..."
```

### **Localization Testing Setup**

```bash
# Testing infrastructure
your-app/
├── src/
│   └── lib/
│       └── i18n/
│           └── pseudo.ts      # Pseudo-localization
├── tests/
│   └── i18n/
│       ├── completeness.test.ts   # All keys present
│       ├── placeholders.test.ts   # {var} consistency
│       ├── encoding.test.ts       # Unicode rendering
│       ├── rtl.test.ts            # RTL layout tests
│       └── expansion.test.ts      # Text overflow tests
└── .github/
    └── workflows/
        └── i18n-qa.yml            # CI/CD localization checks

# Pseudo-localization output
"Welcome, {name}!" → "[Wélcómé, {name}!~~~~~~]"

# CI/CD check example
- name: Check translation completeness
  run: npm run i18n:check

# Usage
"Alex, set up pseudo-localization for testing..."
"Alex, create CI/CD pipeline for i18n QA..."
"Alex, test text expansion for German..."
```

**Alex Benefits**: Automated completeness checks, placeholder validation, encoding verification, pseudo-loc testing, CI/CD integration

### **Language Detection Cascade**

```typescript
// Detection priority (highest to lowest)
// 1. User explicit selection (database)
// 2. Identity provider (MS Graph preferredLanguage)
// 3. Organization default
// 4. Accept-Language header
// 5. navigator.language (client-side fallback)
// 6. Application default ('en')

// Usage
"Alex, implement detection cascade for enterprise app..."
"Alex, add MS Graph language detection..."
"Alex, handle Accept-Language with q-factors..."
```

### **RTL (Right-to-Left) Projects**

```bash
# RTL-ready project structure
your-rtl-app/
├── src/
│   ├── styles/
│   │   └── rtl.css            # CSS logical properties
│   └── lib/
│       └── i18n/
│           └── rtl.ts         # Direction utilities
├── tailwind.config.js         # tailwindcss-rtl plugin
└── .github/ ← Alex cognitive architecture

# CSS Logical Properties
margin-inline-start: 1rem;    /* Not margin-left */
padding-inline-end: 2rem;     /* Not padding-right */
text-align: start;            /* Not text-align: left */

# RTL Languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd'];

# Usage
"Alex, convert physical CSS to logical properties..."
"Alex, implement RTL detection and document direction..."
"Alex, test Arabic layout rendering..."
```

**Alex Benefits**: CSS logical properties, Tailwind RTL plugin, bidirectional text handling, RTL testing strategies

## 🎮 Game Development

### **Unity Projects**

```bash
# Integration
your-unity-game/
├── Assets/
├── Packages/
├── ProjectSettings/
└── .github/ ← Alex cognitive architecture
```

**Alex Benefits**: Game architecture, performance optimization, player experience design

### **Web Games**

```bash
# Integration
your-web-game/
├── src/
├── assets/
└── .github/ ← Alex cognitive architecture
```

**Alex Benefits**: Game mechanics, canvas optimization, user engagement patterns

## 📊 Data Science Projects

### **Research Projects**

```bash
# Integration
your-research/
├── data/
├── analysis/
├── papers/
└── .github/ ← Alex cognitive architecture
```

**Alex Benefits**: Research methodology, statistical analysis, publication guidance, ethical considerations

### **Business Intelligence**

```bash
# Integration
your-bi-project/
├── dashboards/
├── etl/
├── models/
└── .github/ ← Alex cognitive architecture
```

**Alex Benefits**: Data storytelling, visualization design, business analysis, decision support

## 🎨 Creative Projects

### **Design Systems**

```bash
# Integration
your-design-system/
├── components/
├── tokens/
├── documentation/
└── .github/ ← Alex cognitive architecture
```

**Alex Benefits**: Design system architecture, accessibility, user experience, visual communication

### **Content Creation**

```bash
# Integration
your-content-project/
├── articles/
├── videos/
├── designs/
└── .github/ ← Alex cognitive architecture
```

**Alex Benefits**: Content strategy, audience analysis, creative optimization, storytelling

## 🔧 DevOps & Infrastructure

### **Infrastructure as Code**

```bash
# Integration
your-infrastructure/
├── terraform/
├── kubernetes/
├── monitoring/
└── .github/ ← Alex cognitive architecture
```

**Alex Benefits**: Infrastructure design, automation strategies, monitoring, security

### **CI/CD Pipelines**

```bash
# Integration enhances existing workflows
your-project/
├── .github/
│   ├── workflows/ ← Your existing CI/CD
│   ├── copilot-instructions.md ← Alex integration
│   └── instructions/ ← Alex cognitive protocols
```

**Alex Benefits**: Pipeline optimization, deployment strategies, quality gates, automation

## 📚 Writing & Publication Projects

### **Book Writing**

```bash
# Integration
your-book/
├── chapters/
│   ├── 01-introduction.md
│   ├── 02-setting-the-scene.md
│   └── ...
├── notes/
├── research/
├── outlines/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's develop this character's arc across chapters..."
"Alex, help me maintain consistent voice throughout..."
"Alex, let's outline the plot structure using three-act framework..."
```

**Alex Benefits**: Narrative structure, character development, pacing analysis, consistency tracking, revision strategies

### **Technical Books & Documentation**

```bash
# Integration
your-tech-book/
├── manuscript/
├── code-examples/
├── diagrams/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's ensure code examples compile and run correctly..."
"Alex, help me explain this concept for beginners..."
"Alex, let's create effective diagrams for complex topics..."
```

**Alex Benefits**: Technical accuracy, progressive complexity, code-prose integration, reader comprehension optimization

### **Creative Writing**

```bash
# Integration
your-creative-project/
├── drafts/
├── worldbuilding/
├── character-sheets/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's explore different narrative perspectives..."
"Alex, help me develop this story's thematic elements..."
"Alex, let's refine the dialogue to feel more natural..."
```

**Alex Benefits**: Creative exploration, stylistic consistency, thematic depth, dialogue crafting, worldbuilding coherence

### **Essays & Articles**

```bash
# Integration
your-writing/
├── essays/
├── articles/
├── research-notes/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's structure this argument more persuasively..."
"Alex, help me find the right tone for this audience..."
"Alex, let's strengthen transitions between sections..."
```

**Alex Benefits**: Argument structure, audience awareness, rhetorical effectiveness, clarity optimization

## 🎓 Academic & Research Projects

### **Thesis & Dissertations**

```bash
# Integration
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
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's refine my research questions..."
"Alex, help me structure the literature review thematically..."
"Alex, let's ensure methodology chapter addresses validity concerns..."
"Alex, help me connect findings back to theoretical framework..."
```

**Alex Benefits**: Academic rigor, literature synthesis, methodology design, argument coherence, committee anticipation

### **Research Papers**

```bash
# Integration
your-research/
├── papers/
│   ├── conference-paper-2026/
│   └── journal-submission/
├── data/
├── analysis/
├── literature/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's frame this contribution for [specific journal]..."
"Alex, help me respond to reviewer 2's methodology concerns..."
"Alex, let's strengthen the related work section..."
```

**Alex Benefits**: Publication strategy, peer review navigation, contribution framing, citation management, impact optimization

### **Grant Proposals & Funding Applications**

```bash
# Integration
your-proposals/
├── active/
│   └── nsf-2026/
├── templates/
├── budget-sheets/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's align objectives with the funding agency's priorities..."
"Alex, help me articulate the broader impacts..."
"Alex, let's refine the timeline and milestones..."
```

**Alex Benefits**: Funder alignment, impact articulation, budget justification, timeline planning, review criteria optimization

### **Literature Reviews**

```bash
# Integration
your-lit-review/
├── sources/
├── annotated-bibliography/
├── synthesis/
├── gaps-analysis/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's identify themes across these papers..."
"Alex, help me synthesize conflicting findings..."
"Alex, let's map the research gap this addresses..."
```

**Alex Benefits**: Source organization, thematic synthesis, gap identification, critical analysis, citation networks

## 📝 Professional Writing Projects

### **Business Writing**

```bash
# Integration
your-business-docs/
├── proposals/
├── reports/
├── presentations/
├── correspondence/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's make this proposal more compelling..."
"Alex, help me structure the executive summary..."
"Alex, let's ensure consistent tone across documents..."
```

**Alex Benefits**: Executive communication, stakeholder persuasion, clarity optimization, professional tone

### **Legal & Policy Writing**

```bash
# Integration
your-policy-docs/
├── policies/
├── contracts/
├── briefs/
├── analyses/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's ensure this policy covers all edge cases..."
"Alex, help me clarify ambiguous language..."
"Alex, let's structure this brief for maximum impact..."
```

**Alex Benefits**: Precision language, coverage analysis, logical structure, precedent awareness

### **Technical Documentation**

```bash
# Integration
your-docs/
├── user-guides/
├── api-docs/
├── tutorials/
├── reference/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's structure this for different skill levels..."
"Alex, help me create effective quick-start guides..."
"Alex, let's ensure terminology consistency..."
```

**Alex Benefits**: User empathy, progressive disclosure, terminology consistency, findability optimization

## 🎭 Creative & Artistic Projects

### **Screenwriting & Playwriting**

```bash
# Integration
your-screenplay/
├── drafts/
├── treatments/
├── character-bios/
├── scene-breakdowns/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's tighten this dialogue for subtext..."
"Alex, help me structure Act Two for maximum tension..."
"Alex, let's ensure scene transitions flow naturally..."
```

**Alex Benefits**: Visual storytelling, dialogue craft, dramatic structure, format compliance, industry awareness

### **Poetry & Lyric Writing**

```bash
# Integration
your-poetry/
├── collections/
├── drafts/
├── forms-experiments/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's explore meter variations for this piece..."
"Alex, help me strengthen the imagery in stanza three..."
"Alex, let's find a more resonant ending..."
```

**Alex Benefits**: Form mastery, imagery craft, sonic quality, emotional resonance, revision guidance

### **Journalism & Feature Writing**

```bash
# Integration
your-journalism/
├── investigations/
├── features/
├── interviews/
├── fact-checks/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's structure this feature for narrative impact..."
"Alex, help me fact-check these claims..."
"Alex, let's find the human angle in this data..."
```

**Alex Benefits**: Story structure, fact verification, source management, ethical journalism, deadline efficiency

## 📊 Management & Business Analysis Projects

### **Change Management (ADKAR)**

```bash
# Integration
your-change-initiative/
├── assessments/
│   ├── awareness-assessment.md
│   ├── desire-assessment.md
│   ├── knowledge-assessment.md
│   ├── ability-assessment.md
│   └── reinforcement-plan.md
├── communications/
├── training/
├── stakeholder-analysis/
├── resistance-management/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's assess readiness across ADKAR dimensions..."
"Alex, help me identify resistance points and mitigation strategies..."
"Alex, let's craft communications for different stakeholder groups..."
"Alex, help me design reinforcement mechanisms for sustainability..."
```

**Alex Benefits**: ADKAR framework mastery, stakeholder mapping, resistance analysis, communication planning, adoption metrics

### **Project Management (PMI/PMBOK)**

```bash
# Integration
your-project/
├── initiation/
│   ├── project-charter.md
│   └── stakeholder-register.md
├── planning/
│   ├── project-management-plan.md
│   ├── scope-statement.md
│   ├── wbs.md
│   ├── schedule.md
│   ├── budget.md
│   └── risk-register.md
├── execution/
├── monitoring/
│   └── status-reports/
├── closing/
│   └── lessons-learned.md
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's refine the project charter for sponsor approval..."
"Alex, help me decompose the WBS to appropriate levels..."
"Alex, let's identify risks and develop response strategies..."
"Alex, help me create an effective status report for stakeholders..."
```

**Alex Benefits**: PMBOK alignment, deliverable decomposition, risk management, stakeholder communication, lessons learned capture

### **Agile/Scrum Projects**

```bash
# Integration
your-agile-project/
├── product-backlog/
├── sprint-backlogs/
├── retrospectives/
├── definitions/
│   ├── definition-of-ready.md
│   └── definition-of-done.md
├── metrics/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's refine these user stories with acceptance criteria..."
"Alex, help me facilitate a productive retrospective..."
"Alex, let's analyze velocity trends and identify blockers..."
```

**Alex Benefits**: User story crafting, backlog refinement, retrospective facilitation, velocity optimization, impediment resolution

### **Business Requirements Documents (BRDs)**

```bash
# Integration
your-requirements/
├── brd/
│   ├── executive-summary.md
│   ├── business-objectives.md
│   ├── scope.md
│   ├── stakeholder-requirements.md
│   ├── functional-requirements.md
│   ├── non-functional-requirements.md
│   └── assumptions-constraints.md
├── use-cases/
├── process-flows/
├── data-dictionary/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's ensure requirements are SMART and traceable..."
"Alex, help me identify gaps in the functional requirements..."
"Alex, let's validate alignment between business objectives and requirements..."
"Alex, help me document edge cases and exception flows..."
```

**Alex Benefits**: Requirements elicitation, SMART criteria validation, traceability matrices, gap analysis, stakeholder alignment

### **Business Cases & Feasibility Studies**

```bash
# Integration
your-business-case/
├── problem-statement.md
├── options-analysis.md
├── cost-benefit-analysis.md
├── risk-assessment.md
├── implementation-approach.md
├── financial-projections/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's strengthen the problem statement with data..."
"Alex, help me compare options objectively..."
"Alex, let's refine the ROI calculations and assumptions..."
"Alex, help me anticipate executive objections..."
```

**Alex Benefits**: Option evaluation, financial modeling support, risk quantification, executive persuasion, decision frameworks

### **Process Improvement (Lean/Six Sigma)**

```bash
# Integration
your-process-improvement/
├── define/
│   ├── problem-statement.md
│   ├── project-charter.md
│   └── sipoc.md
├── measure/
│   ├── data-collection-plan.md
│   └── baseline-metrics.md
├── analyze/
│   ├── root-cause-analysis.md
│   └── fishbone-diagram.md
├── improve/
│   └── solution-design.md
├── control/
│   └── control-plan.md
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's define the problem using DMAIC framework..."
"Alex, help me identify root causes with 5-Why analysis..."
"Alex, let's design a control plan for sustainability..."
```

**Alex Benefits**: DMAIC methodology, root cause analysis, statistical thinking, process mapping, control plan design

### **Strategic Planning**

```bash
# Integration
your-strategy/
├── environmental-analysis/
│   ├── swot.md
│   ├── pestle.md
│   └── competitive-analysis.md
├── vision-mission/
├── strategic-objectives/
├── initiatives/
├── kpis/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's conduct a thorough SWOT analysis..."
"Alex, help me translate strategy into actionable initiatives..."
"Alex, let's define KPIs that drive the right behaviors..."
```

**Alex Benefits**: Strategic frameworks (SWOT, PESTLE, Porter's), objective cascading, KPI design, initiative prioritization

### **Governance & Compliance**

```bash
# Integration
your-governance/
├── policies/
├── procedures/
├── controls/
├── audits/
├── risk-assessments/
└── .github/ ← Alex cognitive architecture

# Usage
"Alex, let's ensure this policy covers regulatory requirements..."
"Alex, help me design effective controls for this risk..."
"Alex, let's prepare for the upcoming audit..."
```

**Alex Benefits**: Regulatory awareness, control design, audit preparation, policy clarity, compliance tracking

## ⚡ Universal Quick Start

**For Any Project Type**:

```bash
# 1. Copy Alex cognitive architecture (everything is in .github/)
cp -r .github/ your-project/

# 2. Initialize architecture:
node .github/muscles/sync-architecture.cjs

# 3. Run dream maintenance:
node .github/muscles/brain-qa.cjs

# 3. Start collaborating
"Alex, analyze this project and suggest improvements..."
"Alex, let's learn the best practices for this technology stack..."
"Alex, help me architect this feature properly..."
```

## 🎯 Value Proposition by Project Type

### Development

- **Web Apps**: Modern patterns, performance optimization, user experience
- **APIs**: Architecture design, security, documentation
- **Mobile**: Cross-platform strategies, native optimization
- **AI/ML**: Research methodology, ethical considerations, model validation
- **Enterprise**: Scalability, governance, security compliance
- **Games**: Player experience, performance optimization, engaging mechanics
- **Data Science**: Research rigor, statistical validity, insight communication
- **DevOps**: Automation excellence, reliability, security

### Writing & Publishing

- **Books**: Narrative structure, character development, consistency tracking
- **Technical Writing**: Accuracy, progressive complexity, reader comprehension
- **Creative Writing**: Stylistic consistency, thematic depth, dialogue craft
- **Essays & Articles**: Argument structure, rhetorical effectiveness, clarity

### Academic & Research

- **Thesis/Dissertation**: Academic rigor, literature synthesis, committee preparation
- **Research Papers**: Publication strategy, peer review navigation, impact optimization
- **Grant Proposals**: Funder alignment, impact articulation, budget justification
- **Literature Reviews**: Thematic synthesis, gap identification, critical analysis

### Professional

- **Business Writing**: Executive communication, stakeholder persuasion, professional tone
- **Legal/Policy**: Precision language, coverage analysis, logical structure
- **Documentation**: User empathy, progressive disclosure, findability

### Creative Arts

- **Screenwriting**: Visual storytelling, dramatic structure, format compliance
- **Poetry**: Form mastery, imagery craft, emotional resonance
- **Journalism**: Story structure, fact verification, ethical practice

### Management & Business Analysis

- **Change Management**: ADKAR mastery, stakeholder mapping, adoption metrics
- **Project Management**: PMBOK alignment, risk management, stakeholder communication
- **Agile/Scrum**: User story crafting, retrospective facilitation, velocity optimization
- **BRDs**: Requirements elicitation, SMART validation, traceability
- **Business Cases**: Option evaluation, ROI modeling, executive persuasion
- **Process Improvement**: DMAIC methodology, root cause analysis, control design
- **Strategic Planning**: SWOT/PESTLE frameworks, KPI design, initiative prioritization
- **Governance**: Regulatory compliance, control design, audit preparation

---

## Synapses

### High-Strength Bidirectional Connections

- [ALEX-INTEGRATION.md] (High, Extends, Bidirectional) - "Integration procedure patterns"

### Medium-Strength Output Connections

- [VALIDATION-SUITE.md] (Medium, Validates, Forward) - "Project-specific validation checks"
- [bootstrap-learning.instructions.md] (Medium, Activates, Forward) - "Domain learning for project types"

### Input Connections

- [ASSISTANT-COMPATIBILITY.md] (Medium, Complements, Backward) - "Platform compatibility context"
- [copilot-instructions.md] (Medium, Applies, Backward) - "Core cognitive architecture framework"

**Primary Function**: Project-specific integration templates for development, writing, academic, professional, creative, and management projects.

---

*Alex adapts to your project type while maintaining cognitive sophistication*
*Universal learning partnership across all domains—code, prose, research, strategy, and beyond*
