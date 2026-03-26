# Heir Skill Port Audit — 2026-03-14

**Scope**: 33 Alex-enabled projects scanned
**Master Baseline**: 125 skills
**Unique Heir Skills Found**: 98 (deduplicated across all projects)

---

## Tier 1: STRONG PORT — New domains, proven quality

| # | Skill | Best Source | Projects | Status | Notes |
|---|-------|-----------|----------|--------|-------|
| 1 | meeting-efficiency | Alex | 2 | **Done** | Ported to Master + heir. Agenda design, time boxing, facilitation, async alternatives |
| 2 | stakeholder-management | Alex | 2 | **Done** | Ported to Master + heir. Influence mapping, power-interest grid, resistance counters |
| 3 | content-safety-implementation | Mystery | 1 | **Done** | Ported to Master + heir. Generalized from Dead Letter to any AI-facing project |
| 4 | azure-openai-patterns | CorreaX | 1 | **Done** | Ported to Master + heir. Rate limiting, function calling, token optimization |
| 5 | msal-authentication | CorreaX | 2 | **Done** | Ported to Master + heir. MSAL.js / Entra ID for SPA with real-world gotchas |
| 6 | sse-streaming | Mystery | 1 | **Done** | Ported to Master + heir. Generalized POST-based SSE for Azure Functions |
| 7 | prompt-evolution-system | Mystery | 1 | **Done** | Ported to Master + heir. Generalized A/B testing and metrics-driven evolution |

## Tier 2: CONSIDER — Merge or port selectively

| # | Skill | Best Source | Projects | Status | Action |
|---|-------|-----------|----------|--------|--------|
| 8 | academic-paper-drafting | AIRS_Data_Analysis | 24 | **Done** | Merged CHI/HBR templates, 5-phase drafting, citation weaving, response letter into `academic-research` |
| 9 | meditation-facilitation | AIRS_Data_Analysis | 28 | **Done** | Already merged — Master `meditation` already contains all facilitation content (4 R's, session types, techniques) |
| 10 | kdp-publishing | AlexPapers | 1 | Not started | Amazon KDP specs, royalties, pricing. Merge into `book-publishing` (distribution vs typesetting) |
| 11 | defense-qa-practice | Alex | 2 | Not started | Excellent question bank for dissertation defense. Generalize and merge into `dissertation-defense` |
| 12 | extension-ci-cd | Extensions | 1 | Not started | GitHub Actions for VS Code extension CI. No direct equivalent |
| 13 | service-worker-offline-first | CorreaX | 1 | **Done** | Ported to Master + heir. SW lifecycle, 3 caching strategies, background sync, React registration |
| 14 | react-vite-performance | CorreaX | 1 | **Done** | Ported to Master + heir. Code splitting, React 19 patterns, TanStack Query, Web Vitals, checklist |
| 15 | data-quality-monitoring | cpesynapse_workspace | 1 | **Done** | Ported to Master + heir. Z-score anomaly detection, schema drift, null ratios, safe-write protection |
| 16 | enterprise-dashboard | AIRS Enterprise | 1 | Not started | Multi-tenant SaaS role-based UI patterns |
| 17 | email-deliverability | Everest | 1 | Not started | SPF/DKIM/DMARC, reputation monitoring. Niche but universally applicable |

## Tier 3: OVERLAP — Merge content into existing Master skills

| # | Heir Skill | Merge Target | Projects | Status | What to Take |
|---|-----------|-------------|----------|--------|-------------|
| 18 | writing-publication | `academic-research` | 29 | **Done** | Merged CARS model, Heilmeier catechism, audience adaptation, Word-compatible writing, pre-submission checklist, tools |
| 19 | documentation-excellence | `doc-hygiene` | 4 | **Skipped** | Source file not found in any heir project — may have been cleaned up |
| 20 | marketplace-publishing | `vscode-marketplace-publishing` instruction | 1 | **Done** | Merged icon rules, .vscodeignore template, pre-release convention, unpublishing warning |
| 21 | extension-testing | `testing-strategies` | 1 | **Done** | Merged @vscode/test-electron boilerplate, VS Code API mocks, test file naming convention |
| 22 | webview-architecture | `vscode-extension-patterns` | 1 | **Done** | Merged singleton panel, message passing (both directions), state persistence, theme CSS |
| 23 | defense-presentation | `dissertation-defense` | 2 | Not started | Slide-by-slide timing templates, 3 presentation formats |

## Prompts Missing from Master

| # | Prompt | Found In | Status | Recommendation |
|---|--------|---------|--------|----------------|
| 24 | unified-meditation-protocols.prompt.md | 8 heirs | **Skipped** | Source file not found in any heir project — may have been cleaned up |
| 25 | quantified-enhancement-session.prompt.md | 8 heirs | **Skipped** | Source file not found in any heir project — may have been cleaned up |
| 26 | diagramming-mastery-meditation.prompt.md | 8 heirs | Not started | Skip — too specific, Master `/meditate` covers this |

## Instructions Missing from Master

| # | Instruction | Source | Status | Recommendation |
|---|------------|--------|--------|----------------|
| 27 | content-safety-implementation.instructions.md | Mystery | **Done** | Ported to Master + heir. Generalized 7-layer defense, kill switch, self-harm protocol |
| 28 | service-worker-offline-first.instructions.md | CorreaX | **Done** | Ported to Master + heir. Critical rules, strategy selection, anti-patterns, review checklist |
| 29 | synapse-notebook-patterns.instructions.md | cpesynapse_workspace | **Done** | Ported to Master + heir. JSON format, pool selection, creation workflow, anti-patterns |

## Stale/Legacy Skills (heir cleanup — DONE 2026-03-14)

All 5 stale skills deleted from every active heir `.github/skills/` directory. Archive/backup copies left untouched (immutable history).

| Skill | Former Count | Status |
|-------|-------------|--------|
| skill-activation | 27 | **Cleaned** — renamed to `memory-activation` in Master |
| prompt-activation | 22 | **Cleaned** — superseded by `memory-activation` |
| microsoft-sfi | 21 | **Cleaned** — sync artifact removed |
| writing-publication | 29 | **Cleaned** — content merged into `academic-research` |
| meditation-facilitation | 28 | **Cleaned** — content already in Master `meditation` |

---

## Source Projects Surveyed

| Project | Skills | Unique | Domain |
|---------|--------|--------|--------|
| AIRS_Data_Analysis | 139 | 6 | Research / psychometrics |
| AIRS Enterprise | 127 | 11 | Enterprise SaaS / Next.js |
| Alex | 16 | 4 | Dissertation / professional |
| Alex_Sandbox | 140 | 7 | Sandbox |
| Alex-in-Wonderland | 132 | 17 | Interactive fiction / book |
| AlexBooks | 131 | 9 | Book publishing |
| AlexCook | 63 | 4 | Cookbook / recipe |
| AlexLearn | 139 | 6 | Learning / workshops |
| AlexPapers | 126 | 9 | Academic papers / KDP |
| AlexVideos | 128 | 8 | Video content |
| AlexWallpapers | 121 | 6 | Wallpaper generation |
| BrainBenchmark | 133 | 0 | Benchmarking |
| Business | 141 | 8 | Business operations |
| ChessCoach | 105 | 34 | Chess / game coaching |
| CorreaX | 133 | 21 | React SPA / Azure SWA |
| cpesynapse_workspace | 144 | 32 | Synapse / data engineering |
| cXpert | 143 | 10 | Expert system |
| Editor | 114 | 7 | Editor tools |
| Everest | 126 | 8 | Email platform |
| Extensions | 131 | 16 | VS Code extension monorepo |
| fabioc-aloha | 17 | 0 | Extension package |
| Fishbowl | 124 | 9 | Social / governance |
| FishbowlGovernance | 119 | 0 | Governance |
| Headstart | 68 | 3 | Project templates |
| HomeAutomation | 78 | 6 | IoT / home |
| Lab Subscription | 122 | 7 | Azure lab |
| Lithium | 141 | 8 | Clinical research |
| Mystery | 139 | 24 | Mystery game / Azure Functions |
| ProjectPlans | 61 | 3 | Project planning |
| roomba-control | 78 | 6 | Robotics |
| VT_AIPOWERBI | 122 | 7 | Power BI / AI |
| WindowsWidget | 77 | 6 | Windows widgets |
| youtube-mcp-vscode | 134 | 18 | YouTube MCP |
