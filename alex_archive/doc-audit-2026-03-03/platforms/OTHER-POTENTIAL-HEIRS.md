# Other Potential Heirs — Research Summary

> Brief assessment of additional AI coding and productivity platforms for future Alex heirs

|              |                                        |
| ------------ | -------------------------------------- |
| **Status**   | 📋 Research Notes                       |
| **Updated**  | 2026-02-13                             |
| **Priority** | Low — monitor for future opportunities |

---

## Platform Overview

### Development Platforms

| Platform               | Vendor      | Customization  | Priority |
| ---------------------- | ----------- | -------------- | -------- |
| **Amazon Q Developer** | AWS         | ❌ None         | ❌ N/A    |
| **Sourcegraph Cody**   | Sourcegraph | Prompt Library | ⬜ Low    |
| **JetBrains Junie**    | JetBrains   | Unknown        | ⬜ Low    |

### Productivity Platforms

| Platform         | Vendor     | Customization             | Priority     |
| ---------------- | ---------- | ------------------------- | ------------ |
| **M365 Copilot** | Microsoft  | Instructions + knowledge  | ✅ Production |
| **ChatGPT GPTs** | OpenAI     | Instructions + Knowledge  | 📋 Research   |
| **NotebookLM**   | Google     | Sources (knowledge-first) | 📋 Research   |
| **Gemini Gems**  | Google     | Instructions only         | ⚠️ Low        |
| **Perplexity**   | Perplexity | API only                  | ❌ N/A        |

See [M365-HEIR.md](M365-HEIR.md), [CHATGPT-HEIR.md](CHATGPT-HEIR.md), [NOTEBOOKLM-HEIR.md](NOTEBOOKLM-HEIR.md), and [GEMINI-HEIR.md](GEMINI-HEIR.md) for detailed heir plans.

---

## Amazon Q Developer

### Overview

Amazon Q Developer is AWS's AI coding assistant, available across IDEs (VS Code, JetBrains, Visual Studio, Eclipse), CLI, and integrations (Teams, Slack, GitLab, GitHub).

### Key Capabilities

- **Agentic capabilities**: Feature implementation, testing, review, refactoring
- **AWS expertise**: Console guidance, IAM, resource management, architectural advice
- **Multi-platform**: IDE plugins, CLI (including Kiro CLI), Teams/Slack bots
- **Transform**: Java upgrades, .NET porting
- **Pricing**: Free tier (50 agentic chats/mo), Pro ($19/user/mo)

### Why NOT an Alex Heir Platform

| Reason                       | Impact                            |
| ---------------------------- | --------------------------------- |
| **Competitor, not platform** | Q Developer competes with Copilot |
| **No customization API**     | Cannot inject Alex personality    |
| **No instruction files**     | No `.instructions.md` equivalent  |
| **No agent customization**   | Single built-in agent only        |
| **AWS-focused**              | Specialized, not general-purpose  |

### Recommendation

**NOT APPLICABLE** — Amazon Q Developer is a **competitor** to GitHub Copilot, not a platform Alex can deploy to. It occupies the same space in VS Code/JetBrains as Copilot.

---

## Perplexity

### Overview

Perplexity is a search-focused AI platform with APIs for search and agent capabilities.

### Key Capabilities

- **Search API**: Ranked web search results with filtering
- **Agent API**: LLM access with web search tools
- **Spaces**: Collaborative knowledge repositories
- **Pricing**: Free, Pro ($20/mo), Enterprise

### Why NOT an Alex Heir Platform

| Reason                       | Impact                              |
| ---------------------------- | ----------------------------------- |
| **Different paradigm**       | Search tool, not assistant platform |
| **No persona customization** | Cannot create custom assistants     |
| **API-out only**             | Designed to be called, not extended |
| **No instruction system**    | No way to inject Alex behavior      |

### Recommendation

**NOT VIABLE** — Perplexity is a search/research tool, not a customizable assistant platform. Different category entirely from ChatGPT GPTs or IDE integrations.

---

## Sourcegraph Cody

### Overview

Sourcegraph Cody is an AI coding assistant with powerful codebase context awareness, available for VS Code, JetBrains, Visual Studio, CLI, and web.

### Customization Capabilities

| Feature                | Available           | Notes                            |
| ---------------------- | ------------------- | -------------------------------- |
| **Prompt Library**     | ✅ Full              | Create, share, tag prompts       |
| **Context Filters**    | ✅ Available         | Control repository context       |
| **Custom Prompts**     | ✅ Create/edit       | With dynamic `@` mentions        |
| **Enterprise Prompts** | ✅ Organization-wide | Promoted prompts feature         |
| **Rules/Instructions** | ⚠️ Via prompts       | No `.instructions.md` equivalent |

### Prompt Library Features

- **Core prompts**: document-code, explain-code, find-code-smells, generate-unit-tests
- **Custom prompts**: Create with owner, visibility, draft mode
- **Prompt tags**: Categorization for enterprises
- **Dynamic context**: `@` mentions for files, symbols, repos
- **Prompt modes**: Chat-only or Edit code

### Feasibility Assessment

| Dimension     | Score | Notes                                   |
| ------------- | ----- | --------------------------------------- |
| **Technical** | 5/10  | Prompts only, no persistent rules       |
| **Effort**    | 6/10  | Port prompts, no architecture           |
| **Value**     | 5/10  | Enterprise focus, Sourcegraph ecosystem |

### Recommendation

**PARTIAL VIABILITY** — Could port Alex's prompt workflows to Cody Prompt Library. However, no persistent instructions means the cognitive architecture wouldn't transfer. Consider for prompt-only distribution.

---

## JetBrains Junie

### Overview

Junie is JetBrains' AI coding agent, integrated with IntelliJ IDEA and other JetBrains IDEs. It's designed for autonomous task execution with project context awareness.

### Customization Capabilities

| Feature               | Available | Notes                           |
| --------------------- | --------- | ------------------------------- |
| **Custom Rules**      | ❓ Unknown | Documentation unclear           |
| **Agent System**      | ✅ Native  | Autonomous task execution       |
| **Context Awareness** | ✅ Full    | Project structure understanding |
| **IDE Integration**   | ✅ Deep    | Inspections, tests, checks      |

### Key Features

- Performs tasks using project context and structure
- Analyzes and searches code for relevant information
- Makes code edits using IDE inspections and checks
- Runs code and tests to reduce warnings and errors
- Verifies project state and test results after changes
- Supports collaboration on complex tasks

### Feasibility Assessment

| Dimension     | Score | Notes                              |
| ------------- | ----- | ---------------------------------- |
| **Technical** | 4/10  | Unknown customization API          |
| **Effort**    | N/A   | Need more documentation            |
| **Value**     | 6/10  | JetBrains ecosystem is significant |

### Recommendation

**MONITOR** — JetBrains Junie is relatively new (late 2025). The customization model is unclear from public documentation. Worth revisiting when the platform matures and documentation improves.

---

## Priority Matrix

### Development Platforms

| Platform        | Technical Feasibility | Market Value | Effort  | Priority     |
| --------------- | --------------------- | ------------ | ------- | ------------ |
| **VS Code**     | 10/10                 | 10/10        | ✅ Done  | ✅ Production |
| **GitHub Copilot Web** | 10/10                 | 9/10         | ✅ Done  | ✅ Active     |
| **Claude Code** | 9/10                  | 8/10         | Medium  | 🔜 Phase 1    |
| **Cursor**      | 8/10                  | 7/10         | Medium  | 🔜 Phase 2    |
| **Windsurf**    | 6/10                  | 6/10         | High    | ⏳ Phase 3    |
| **Codex CLI**   | 6/10                  | 6/10         | Low     | ⏳ Phase 4    |
| **Cody**        | 5/10                  | 5/10         | Low     | ⬜ Consider   |
| **Junie**       | 4/10                  | 6/10         | Unknown | ⬜ Monitor    |
| **Amazon Q**    | 0/10                  | N/A          | N/A     | ❌ Competitor |

### Productivity Platforms

| Platform       | Technical Feasibility | Market Value | Effort | Priority     |
| -------------- | --------------------- | ------------ | ------ | ------------ |
| **M365**       | 8/10                  | 9/10         | ✅ Done | ✅ Production |
| **ChatGPT**    | 5/10                  | 9/10         | Low    | 📋 Research   |
| **NotebookLM** | 4/10                  | 7/10         | Low    | 📋 Research   |
| **Gemini**     | 3/10                  | 7/10         | Low    | ⚠️ Low        |
| **Perplexity** | 0/10                  | N/A          | N/A    | ❌ Not viable |

---

## Monitoring Strategy

### Check Quarterly

- [ ] JetBrains Junie rules/instructions support
- [ ] Sourcegraph Cody persistent context features
- [ ] Google Gemini Gems knowledge file support
- [ ] Google NotebookLM custom instructions/persona support
- [ ] New AI coding assistants with customization
- [ ] New AI coding platforms announcements

### Sources to Watch

- AWS re:Invent announcements
- JetBrains Blog / YouTrack
- Sourcegraph Cody changelog
- Hacker News AI category

---

*Monitoring additional platforms for future Alex expansion opportunities*
