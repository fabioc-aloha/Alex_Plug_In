# Frequently Asked Questions

Common questions about Alex and quick answers.

## General

### What is Alex?

Alex is a cognitive learning partner that lives in VS Code. Unlike traditional AI assistants, Alex remembers context across sessions, learns from your work patterns, and adapts to your project.

### How is Alex different from regular Copilot?

| Feature | Copilot Chat | Alex |
|---------|--------------|------|
| **Memory** | Session only | Persistent synapses + episodic |
| **Learning** | None | Continuous through meditation |
| **Agents** | Single | 7 specialized agents |
| **Skills** | Generic | 165+ domain-specific |
| **Adaptation** | None | Project-aware persona |

### Does Alex require a separate subscription?

No. Alex uses GitHub Copilot's underlying models. You need a Copilot subscription, but Alex itself is free.

### Is my data private?

Yes. Alex stores memory locally in your workspace (`.github/` folder). No data is sent to external servers beyond what Copilot normally processes.

## Installation

### How do I install Alex?

1. Open VS Code Extensions (`Ctrl+Shift+X`)
2. Search "Alex Cognitive Architecture"
3. Click Install

See [Getting Started](Getting-Started) for detailed instructions.

### What VS Code version do I need?

VS Code 1.100 or later. Alex uses features from recent VS Code releases.

### Does Alex work with VS Code forks (Cursor, etc.)?

Alex is designed for VS Code. Compatibility with forks is not guaranteed.

## Usage

### How do I talk to Alex?

Open Copilot Chat (`Ctrl+Shift+I`) and type `@alex` followed by your message:

```
@alex Help me debug this function
```

### What's the difference between agents?

| Agent | Best For |
|-------|----------|
| **Alex** | General conversations, broad questions |
| **Builder** | Writing code, implementing features |
| **Researcher** | Learning new topics, investigations |
| **Validator** | Code review, testing, quality checks |
| **Documentarian** | READMEs, wikis, documentation |

### Can I use Alex without the @alex prefix?

In agent mode, you can configure Alex as the default Copilot participant. See [User Manual](User-Manual#settings).

## Memory & Learning

### What are synapses?

Synapses are learned connections between concepts — Alex's long-term memory. When Alex discovers a pattern (like "this project uses React with TypeScript"), it creates a synapse to remember that.

### How often should I run dream/meditate?

| Process | Frequency | Purpose |
|---------|-----------|---------|
| **Dream** | Weekly | Validate synapse network |
| **Meditate** | After major sessions | Consolidate learning |
| **Self-Actualize** | Monthly | Deep architecture review |

### Can I delete Alex's memories?

Yes:
- Delete specific synapses: Remove files from `.github/synapses/`
- Full reset: `@alex reset` in chat
- Clear episodic memory: Delete `.github/episodic/`

### Does Alex remember across different projects?

Alex has both:
- **Global memory** — In `AI-Memory/` (synced via OneDrive)
- **Project memory** — In `.github/` (project-specific)

## Heir Projects

### What is an heir project?

A project that inherits Alex's cognitive architecture. It gets:
- Project-specific skills
- Custom instructions
- Reusable prompts
- Learned synapses

### How do I set up a heir project?

```
@alex initialize this workspace
```

See [Heir Project Setup](Heir-Project-Setup) for details.

### Can I have multiple heir projects?

Yes! Each workspace can be an independent heir project with its own configuration.

## Troubleshooting

### Alex isn't responding

1. Check Copilot is working (`@copilot hello`)
2. Reload VS Code (`Ctrl+Shift+P` → "Reload Window")
3. Check extension is enabled (Extensions panel)

### Skills aren't activating

```
@alex debug skill activation
```

Common issues:
- `applyTo` pattern doesn't match current file
- Skill frontmatter has syntax errors
- Skill tier requires explicit activation

### Memory seems wrong/outdated

Run a dream cycle:

```
@alex dream
```

This validates and repairs the synapse network.

### Alex is slow

- Reduce `alex.verbosity` to `brief`
- Check active skill count (too many = slower)
- Clear old episodic memory

## Contributing

### How do I report bugs?

[GitHub Issues](https://github.com/fabioc-aloha/Alex_Plug_In/issues)

Include:
- VS Code version
- Alex version
- Steps to reproduce
- Error messages (if any)

### Can I contribute skills?

Yes! See [Contributing Guide](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/CONTRIBUTING.md).

### How do I request features?

[GitHub Discussions](https://github.com/fabioc-aloha/Alex_Plug_In/discussions) for ideas and requests.

---

*Didn't find your answer? Ask Alex: `@alex I have a question about...`*
