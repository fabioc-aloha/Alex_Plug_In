# What Is Alex?

What Alex is, how it works, and what it can do for you: a primer for power users.

## The Short Version

Alex is an AI development partner that lives inside VS Code. It's not a chatbot. It's not autocomplete. It's a cognitive architecture: a system of skills, memory, and automation that makes GitHub Copilot dramatically more capable.

You talk to Alex in the Copilot Chat panel. Alex reads your codebase, remembers across sessions, follows project-specific rules, and can run scripts, generate images, build presentations, write documents, and manage deployments, all from conversation.

## How It Works

```
You (in VS Code)
    |
    +-- Copilot Chat --> Alex (cognitive architecture)
                              |
                              +-- Skills --> Domain knowledge loaded on demand
                              +-- Instructions --> Behavioral rules and procedures
                              +-- Agents --> Specialized modes (Builder, Researcher, Validator)
                              +-- Muscles --> Automation scripts for heavy lifting
                              +-- Prompts --> Reusable prompt templates
                              +-- Memory --> Persistent context across sessions
```

Alex is powered by GitHub Copilot's agent platform. The architecture is a collection of markdown files and scripts that Copilot loads as context, giving it domain expertise, project awareness, and the ability to act, not just suggest.

## What Makes It Different

| Feature          | Plain Copilot            | With Alex                                                  |
| ---------------- | ------------------------ | ---------------------------------------------------------- |
| Code completion  | Yes                      | Yes                                                        |
| Chat             | Generic answers          | Project-aware, persona-driven                              |
| Memory           | Forgets between sessions | Remembers preferences, patterns, decisions                 |
| Automation       | Manual                   | Scripts run from conversation                              |
| Code review      | Basic suggestions        | OWASP, STRIDE, NASA standards                              |
| Documentation    | You write it             | Alex writes, audits, and maintains it                      |
| Image generation | No                       | Replicate API (Flux, character references, banners)        |
| Presentations    | No                       | Gamma API and PptxGenJS                                    |
| Multi-agent      | No                       | Builder, Researcher, Validator, Documentarian, Azure, M365 |

## The Architecture at a Glance

Alex lives in a `.github/` folder in your repository:

```
.github/
+-- copilot-instructions.md   <-- Alex's identity, routing, and active context
+-- skills/                   <-- 120+ domain-specific knowledge modules
|   +-- code-review/
|   +-- testing-strategies/
|   +-- security-review/
|   +-- debugging-patterns/
|   +-- ai-writing-avoidance/
|   +-- ...
+-- instructions/             <-- Behavioral rules (always loaded when relevant)
+-- agents/                   <-- Specialized modes
|   +-- builder.agent.md
|   +-- researcher.agent.md
|   +-- validator.agent.md
|   +-- ...
+-- prompts/                  <-- Reusable prompt templates
+-- muscles/                  <-- Node.js automation scripts
+-- hooks.json                <-- Lifecycle event triggers
```

## Skills: What Alex Knows

Skills are domain knowledge modules that Alex loads on demand. Examples:

- **code-review**: systematic review for correctness, security, and growth
- **testing-strategies**: the right test at the right level
- **debugging-patterns**: reproduce, isolate, hypothesize, fix
- **security-review**: OWASP Top 10, STRIDE, dependency audit
- **api-design**: APIs developers love to use
- **database-design**: schema design, normalization, query optimization
- **infrastructure-as-code**: Bicep, Terraform, ARM templates
- **creative-writing**: fiction, narrative structure, character development
- **academic-research**: thesis writing, literature reviews, scholarly work
- **career-development**: resumes, interviews, professional growth
- **ui-ux-design**: accessibility, design systems, user experience
- **image-handling**: AI image generation via Replicate
- **gamma-presentations**: slide decks from markdown via the Gamma API

There are over 150 skills spanning software engineering, research, writing, design, business, and more.

## Agents: Specialized Modes

Agents are personas that Alex can switch into for specialized work:

| Agent             | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| **Builder**       | Implementation with optimistic problem-solving |
| **Researcher**    | Deep domain research and knowledge discovery   |
| **Validator**     | Adversarial QA with skeptical analysis         |
| **Documentarian** | Documentation accuracy and drift prevention    |
| **Azure**         | Azure development guidance with MCP tools      |
| **M365**          | Microsoft 365 and Teams development            |

You can invoke them directly: "@Alex /builder build the API endpoint" or Alex routes to the right agent automatically based on your request.

## Muscles: Automation

Muscles are Node.js scripts that Alex can run from conversation. Examples:

- **md-to-word**: convert markdown to professional Word documents
- **inject-nav**: generate navigation tables across documentation
- **generate-banner**: create project banners via AI image generation
- **build-pdf**: compile markdown into print-ready PDFs
- **sync-to-heir**: synchronize architecture files across repositories

Instead of "here's how to do it," Alex just does it.

## Memory: Continuity

Alex remembers across sessions through three memory layers:

1. **User memory**: your preferences, patterns, and insights (persists everywhere)
2. **Session memory**: task-specific context for the current conversation
3. **Repository memory**: codebase conventions and verified practices

This means Alex knows your coding style, your project's architecture decisions, and what you worked on last time, without you re-explaining.

## Who Is Alex For?

Alex is designed for people who want to go beyond "AI-assisted coding" into genuine AI partnership:

- **Developers** who want code review, testing, debugging, and automation
- **Technical writers** who want maintained, audited documentation
- **Researchers** who want literature reviews, citation management, and structured writing
- **Teams** who want consistent practices across projects
- **Anyone** who wants a capable AI partner that actually knows their work

## Getting Started

1. **Install VS Code** and the GitHub Copilot extension
2. **Clone or template** a repository with the Alex architecture
3. **Open Copilot Chat** and start talking: Alex is already loaded

See [GETTING-STARTED.md](guides/GETTING-STARTED.md) for the full setup walkthrough.

## Further Reading

| Guide                                        | What's Inside                                      |
| -------------------------------------------- | -------------------------------------------------- |
| [Getting Started](guides/GETTING-STARTED.md) | Clone, install, first-time setup, agents, updating |
| [CLI Tools](guides/CLI-TOOLS.md)             | Node.js, Git, Pandoc, shell tools                  |
| [VS Code Setup](guides/VSCODE-SETUP.md)      | Extensions, MCP servers, settings                  |
| [npm Packages](guides/NPM-PACKAGES.md)       | Global and local npm packages                      |
| [API Keys](guides/API-KEYS.md)               | Replicate, Gamma, Azure, GitHub tokens             |
