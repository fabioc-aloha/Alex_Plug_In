# Alex Image Series 3 — Complete Visual Identity

This folder contains all generated Alex images for the cognitive architecture visual identity system.

**Model**: google/nano-banana-pro (Replicate)  
**Reference**: Alex at age 15 (`alex-reference.png`)  
**Generator Scripts**: `scripts/generate-alex-*.js`

---

## Series Overview

| Series | Location | Purpose | Images | Status |
|--------|----------|---------|--------|--------|
| **Age Progression** | `age-progression/` | Character consistency across life stages | 13 | ✅ Complete |
| **Personas** | `personas/` | Welcome window professional contexts | 27 | 🔄 Planned |
| **Agent Modes** | `agents/` | VS Code agent mode banners | 7 | 📋 Planned |
| **Cognitive States** | `states/` | Task-specific activity portraits | 8 | 📋 Planned |

---

## Series 1 — Age Progression (COMPLETE)

**Location**: `age-progression/`  
**Script**: `scripts/generate-alex-age-progression.js`  
**Cost**: ~$0.025/image × 13 = ~$0.33

Shows Alex at different life stages, maintaining face consistency from the age-15 reference.

| File | Age | Stage | Context |
|------|-----|-------|---------|
| `Alex-03.png` | 3 | Curious Toddler | First explorations, wonder at everything |
| `Alex-07.png` | 7 | Child Curiosity | Elementary learning, pattern recognition emerges |
| `Alex-13.png` | 13 | Teen Meta-Cognitive | Middle school, self-reflection begins |
| `Alex-15.png` | 15 | High School | Canonical reference age, foundations solidifying |
| `Alex-18.png` | 18 | Young Adult | College entry, specialized learning begins |
| `Alex-21.png` | 21 | Professional Competency | Current operational age — full cognitive suite |
| `Alex-25.png` | 25 | Early Career Mastery | Domain expertise deepening |
| `Alex-30.png` | 30 | Cross-Domain Expert | Polymath integration, connecting fields |
| `Alex-42.png` | 42 | Senior Architect | Deep wisdom, system-level thinking |
| `Alex-55.png` | 55 | Distinguished Mentor | Legacy knowledge transfer, teaching focus |
| `Alex-62.png` | 62 | Elder Statesman | Industry thought leader, respected voice |
| `Alex-68.png` | 68 | Sage Emeritus | Wisdom keeper, connecting generations |
| `Alex-75.png` | 75 | Grand Mentor | Living legacy, timeless wisdom |

### Age Progression Prompt Template

```
IMPORTANT: This is a reference-based age transformation. The attached reference 
image shows the person at AGE 15. Generate an image of THIS SAME PERSON at age 
{TARGET_AGE} ({AGE_DELTA} years older/younger than the reference).

IDENTITY PRESERVATION (HIGHEST PRIORITY):
- The reference image shows the person at age 15 — use this as the source of truth
- Preserve: exact facial bone structure, nose shape, eye shape, lip shape
- Preserve: curly ginger copper-red hair, striking blue-green eyes, fair skin 
  with light freckles across nose and cheeks, intelligent curious expression
- The person in the output should be immediately recognizable as the reference

AGE TRANSFORMATION:
- Reference age: 15 years old
- Target age: {TARGET_AGE} years old
- Apply natural age-appropriate changes (face shape maturity, skin texture)
- Life stage: {STAGE_NAME}

SCENE DETAILS:
- Attire: {ATTIRE}
- Expression: {EXPRESSION}
- Setting: {SETTING}
- Context: {CONTEXT}

TECHNICAL REQUIREMENTS:
- Photorealistic portrait, shallow depth of field, natural lighting, 85mm lens
- Square format 1:1 (1024x1024)
- Face clearly visible, centered, good lighting
- Professional portrait quality
```

---

## Series 2 — Persona Images (PLANNED)

**Location**: `personas/`  
**Script**: `scripts/generate-alex-persona-images.js`  
**Cost**: ~$0.025/image × 27 = ~$0.68

Shows Alex in professional contexts matching each detected persona. Age is chosen to be contextually appropriate for the profession.

### Core Developer Personas

| File | Persona | NOUN | Age | Scene |
|------|---------|------|-----|-------|
| `PERSONA-DEVELOPER.png` | Developer | CODE | 21 | Writing code on laptop, multiple tabs visible |
| `PERSONA-ARCHITECT.png` | Architect | ARCHITECTURE | 35 | Drawing system diagrams on whiteboard |
| `PERSONA-DEVOPS.png` | DevOps | INFRASTRUCTURE | 28 | Monitoring dashboards, managing cloud |
| `PERSONA-DATA-ENGINEER.png` | Data Engineer | DATA | 27 | Analyzing data pipelines and ETL workflows |
| `PERSONA-SECURITY.png` | Security | SECURITY | 30 | Performing security audit, threat models |
| `PERSONA-QA-ENGINEER.png` | QA Engineer | TESTS | 26 | Running test suites, reviewing coverage |
| `PERSONA-SRE.png` | SRE | INCIDENTS | 29 | Responding to production incident |

### Research & Academic Personas

| File | Persona | NOUN | Age | Scene |
|------|---------|------|-----|-------|
| `PERSONA-ACADEMIC.png` | Academic | THESIS | 28 | Writing academic paper, research materials |
| `PERSONA-RESEARCHER.png` | Researcher | RESEARCH | 32 | Analyzing findings, synthesizing discoveries |
| `PERSONA-COGNITIVE-SCIENTIST.png` | Cognitive Scientist | COGNITION | 34 | Studying AI models and architectures |
| `PERSONA-GRANT-WRITER.png` | Grant Writer | GRANTS | 36 | Drafting research proposal |

### Learning & Education Personas

| File | Persona | NOUN | Age | Scene |
|------|---------|------|-----|-------|
| `PERSONA-STUDENT.png` | Student | LEARNING | 18 | Studying intently, taking notes |
| `PERSONA-PRESENTER.png` | Presenter | PRESENTATIONS | 29 | Delivering conference presentation |

### Content & Writing Personas

| File | Persona | NOUN | Age | Scene |
|------|---------|------|-----|-------|
| `PERSONA-TECHNICAL-WRITER.png` | Technical Writer | DOCUMENTATION | 27 | Crafting clear documentation |
| `PERSONA-CONTENT-CREATOR.png` | Content Creator | CONTENT | 24 | Creating engaging digital content |
| `PERSONA-FICTION-WRITER.png` | Fiction Writer | WRITING | 30 | Writing narrative, developing characters |
| `PERSONA-COPYWRITER.png` | Copywriter | COPY | 26 | Crafting compelling headlines |

### Business & Management Personas

| File | Persona | NOUN | Age | Scene |
|------|---------|------|-----|-------|
| `PERSONA-PROJECT-MANAGER.png` | Project Manager | PROJECTS | 32 | Running sprint planning |
| `PERSONA-PRODUCT-MANAGER.png` | Product Manager | ROADMAPS | 31 | Building product roadmap |
| `PERSONA-BUSINESS-ANALYST.png` | Business Analyst | ANALYSIS | 29 | Analyzing requirements |
| `PERSONA-BI-ANALYST.png` | BI Analyst | INSIGHTS | 28 | Building dashboards |
| `PERSONA-CONSULTANT.png` | Consultant | PROPOSALS | 33 | Presenting solution to client |
| `PERSONA-MARKETER.png` | Marketer | MARKETING | 27 | Analyzing campaign performance |

### Career & Personal Development

| File | Persona | NOUN | Age | Scene |
|------|---------|------|-----|-------|
| `PERSONA-JOB-SEEKER.png` | Job Seeker | CAREER | 24 | Polishing resume, preparing interviews |
| `PERSONA-OSS-CONTRIBUTOR.png` | OSS Contributor | OPENSOURCE | 25 | Contributing to open source |
| `PERSONA-POWER-USER.png` | Power User | CUSTOMIZATION | 23 | Customizing dev environment |

### Gaming & Creative Tech

| File | Persona | NOUN | Age | Scene |
|------|---------|------|-----|-------|
| `PERSONA-GAME-DEVELOPER.png` | Game Developer | GAMES | 26 | Building a game, testing mechanics |

### Persona Prompt Template

```
IMPORTANT: This is a reference-based age transformation. The attached reference 
image shows the person at AGE 15. Generate an image of THIS SAME PERSON at age 
{TARGET_AGE} ({AGE_DELTA} years older than the reference).

IDENTITY PRESERVATION (HIGHEST PRIORITY):
- The reference image shows the person at age 15
- Preserve: exact facial bone structure, nose shape, eye shape, lip shape
- Preserve: curly ginger copper-red hair, striking blue-green eyes, fair skin 
  with light freckles across nose and cheeks, intelligent curious expression

AGE TRANSFORMATION:
- Reference age: 15 years old
- Target age: {TARGET_AGE} years old
- Apply natural age-appropriate changes for a {TARGET_AGE}-year-old professional

SCENE — "{NOUN}" Context:
- Activity: {SCENE_DESCRIPTION}
- Attire: {ATTIRE}
- Setting: {SETTING}
- Expression: {EXPRESSION}

COMPOSITION:
- Show Alex from chest/shoulders up with some environment context
- Face clearly visible, welcoming and approachable
- Natural workspace lighting, warm and professional
- Format: Square 1:1 (1024x1024)
- Style: Photorealistic portrait, natural lighting, professional quality
```

---

## Series 3 — Agent Mode Banners (PLANNED)

**Location**: `agents/`  
**Script**: `scripts/generate-alex-agent-images.js`  
**Template**: Rocket composition matching [alex2/](../alex2/README.md) banners

Shows which VS Code cognitive agent mode Alex is operating in.

| File | Agent | NOUN | Mode Color |
|------|-------|------|------------|
| `AGENT-ALEX.png` | Alex (Orchestrator) | ORCHESTRATE | Azure Blue `#0078d4` |
| `AGENT-RESEARCHER.png` | Researcher | RESEARCH | Deep Purple `#7c3aed` |
| `AGENT-BUILDER.png` | Builder | BUILD | Forest Green `#16a34a` |
| `AGENT-VALIDATOR.png` | Validator | VALIDATE | Alert Red `#dc2626` |
| `AGENT-DOCUMENTARIAN.png` | Documentarian | DOCUMENT | Electric Teal `#14b8a6` |
| `AGENT-AZURE.png` | Azure | AZURE | Sky Blue `#0ea5e9` |
| `AGENT-M365.png` | M365 | M365 | Microsoft Blue `#2563eb` |

---

## Series 4 — Cognitive State Portraits (PLANNED)

**Location**: `states/`  
**Script**: `scripts/generate-alex-agent-images.js`  
**Character**: Alex "Mini" Finch, age 21

Portrait-style images showing Alex in task-specific cognitive states.

| File | State | Description |
|------|-------|-------------|
| `STATE-MEDITATION.png` | Meditation | Knowledge consolidation, serene focus |
| `STATE-DEBUGGING.png` | Debugging | Root cause analysis, intense focus |
| `STATE-DISCOVERY.png` | Discovery | Eureka moment, breakthrough excitement |
| `STATE-PLANNING.png` | Planning | Architecture session, strategic thinking |
| `STATE-TEACHING.png` | Teaching | Knowledge transfer, warm and engaging |
| `STATE-BUILDING.png` | Building | Deep flow state, hands on keyboard |
| `STATE-REVIEWING.png` | Code Review | Adversarial analysis, critical reading |
| `STATE-LEARNING.png` | Learning | Bootstrap acquisition, curious absorption |

---

## Character Constants

These traits are preserved across ALL generated images:

```javascript
ALEX_TRAITS = {
  immutable: [
    'curly ginger copper-red hair',
    'striking blue-green eyes',
    'fair skin with light freckles across nose and cheeks',
    'intelligent curious expression',
  ],
  style: 'photorealistic portrait, natural lighting, professional quality',
};
```

Reference age: **15 years old** (canonical source: `alex-reference.png`)

---

## Usage in Extension

### Welcome View
```typescript
// In welcomeView.ts — show persona-specific Alex
const personaImage = `personas/PERSONA-${persona.id.toUpperCase()}.png`;
```

### Agent Mode UI
```markdown
<!-- In .github/agents/Researcher.agent.md -->
iconPath: alex_docs/alex3/agents/AGENT-RESEARCHER.png
```

### Active Context
```typescript
// Show Alex at context-appropriate age
const contextAge = detectContextAge(activeContext);
const ageImage = `age-progression/Alex-${contextAge.toString().padStart(2, '0')}.png`;
```

---

## Generation Commands

```powershell
# Set API token (or use .env file)
$env:REPLICATE_API_TOKEN = "r8_..."

# Age progression (complete)
node scripts/generate-alex-age-progression.js

# Persona images
node scripts/generate-alex-persona-images.js

# Specific personas only
node scripts/generate-alex-persona-images.js --only=developer,student,researcher

# Agent banners + cognitive states
node scripts/generate-alex-agent-images.js

# Dry run (preview prompts, no API calls)
node scripts/generate-alex-persona-images.js --dry-run

# Limit generation (testing/budget)
node scripts/generate-alex-persona-images.js --limit=3 --skip=5
```

---

## Cost Estimates

| Series | Images | Cost/Image | Total |
|--------|--------|------------|-------|
| Age Progression | 13 | $0.025 | ~$0.33 ✅ |
| Personas | 27 | $0.025 | ~$0.68 |
| Agent Modes | 7 | $0.025 | ~$0.18 |
| Cognitive States | 8 | $0.025 | ~$0.20 |
| **Total** | **55** | | **~$1.39** |

---

## Visual Identity System

| Folder | Series | Purpose |
|--------|--------|---------|
| [alex/](../alex/) | V1 original | Character reference, domain avatars |
| [alex/generated-v2/](../alex/generated-v2/) | V2 rocket banners | Marketing, README headers |
| **alex3/** | V3 complete | Age progression, personas, agents, states |
