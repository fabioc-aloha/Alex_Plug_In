# Skill: Beta Tester

> **Status**: TEMPORARY (remove after stable release)
> **Purpose**: Help beta testers evaluate Alex, find bugs, and report issues effectively

## Metadata

| Property       | Value                    |
| -------------- | ------------------------ |
| **ID**         | beta-tester              |
| **Version**    | 1.0.0                    |
| **Category**   | Quality Assurance        |
| **Inheritance**| inheritable              |
| **Staleness**  | N/A (temporary skill)    |

## Activation Triggers

- "test Alex", "beta test", "find bugs"
- "check my installation", "verify setup"
- "report a bug", "something's wrong"
- "migration test", "test upgrade"
- Post-installation validation
- When user reports unexpected behavior

## Core Capabilities

### 1. Installation Validation

Run comprehensive checks on Alex installation:

```markdown
## Installation Checklist

### File Structure
- [ ] `.github/copilot-instructions.md` exists and loads
- [ ] `.github/instructions/` folder with .instructions.md files
- [ ] `.github/prompts/` folder with .prompt.md files
- [ ] `.github/skills/` folder with skill directories
- [ ] `.github/domain-knowledge/` folder (may be empty initially)
- [ ] `.github/config/` folder with settings files

### Skill Validation
- [ ] Each skill has SKILL.md
- [ ] Each skill has synapses.json
- [ ] Synapse targets exist (no broken connections)
- [ ] Weight values are normalized (0.0-1.0)

### VS Code Integration
- [ ] Extension activated (check Output → Extension Host)
- [ ] Status bar item visible
- [ ] Commands appear in Command Palette (Ctrl+Shift+P → "Alex:")
- [ ] Chat participant responds (@alex in chat)

### 2. Environment Diagnostics

Commands to gather diagnostic info:

```powershell
# VS Code version
code --version

# Extension version
code --list-extensions --show-versions | Select-String "alex"

# Node.js version (for extension host)
node --version

# Workspace path
$PWD.Path

# .github folder stats
Get-ChildItem .github -Recurse | Measure-Object
Get-ChildItem .github/skills -Directory | Measure-Object
```

### 3. Migration Testing Checklist

For users upgrading from previous versions:

```markdown
## Pre-Migration
- [ ] Note current Alex version (if known)
- [ ] Backup existing `.github/` folder
- [ ] Document any custom DK files or prompts
- [ ] List any modified instruction files

## Post-Migration
- [ ] Fresh architecture installed successfully
- [ ] Legacy backup created at expected location
- [ ] Gap analysis completed
- [ ] User-selected files restored (if any)
- [ ] Dream protocol run for validation
- [ ] No broken synapse warnings
```

### 4. Common Issues Checklist

Quick diagnosis for frequent problems:

| Symptom | Check | Fix |
| ------- | ----- | --- |
| Commands not appearing | Extension activated? | Reload window |
| Chat not responding | @alex participant registered? | Check Extension Host output |
| Skills not loading | synapses.json valid? | Run Dream protocol |
| Meditation fails | Memory files writable? | Check file permissions |
| Broken synapses | Target skills exist? | Validate synapse targets |
| Old format detected | Weight format "high/medium"? | Run upgrade to normalize |

### 5. Bug Report Template

When reporting issues, gather this info:

```markdown
## Bug Report

### Environment
- OS: Windows 11 / macOS / Linux
- VS Code Version:
- Alex Extension Version:
- Workspace Path (anonymized):

### Issue
**What happened:**

**What I expected:**

**Steps to reproduce:**
1.
2.
3.

### Diagnostics
**Extension Host errors:**
(View → Output → Extension Host, filter for "alex")

**Relevant files:**
- Does `.github/copilot-instructions.md` exist?
- Skills count:
- Any broken synapses reported?

### Screenshots/Logs
(Attach if relevant)
```

### 6. Test Scenarios

Systematic testing for beta evaluation:

#### Scenario A: Fresh Installation

1. Create new empty folder
2. Open in VS Code with Alex extension
3. Run `Alex: Initialize Architecture`
4. Verify all files created
5. Test chat participant
6. Run Dream protocol

#### Scenario B: Upgrade from Legacy

1. Have existing `.github/` with old Alex
2. Run `Alex: Upgrade Architecture`
3. Check backup created
4. Verify legacy detection worked
5. Run gap analysis
6. Test migration of custom files

#### Scenario C: Daily Usage

1. Ask Alex questions about the project
2. Create a DK file through conversation
3. Run meditation session
4. Check episodic memory updated
5. Test skill activation triggers

#### Scenario D: Edge Cases

1. Workspace with no `.github/` folder
2. Workspace with partial Alex installation
3. Read-only workspace
4. Very long file paths
5. Special characters in workspace name

## Feedback Channels

- **GitHub Issues**: [Alex_Plug_In Issues](https://github.com/fabioc-aloha/Alex_Plug_In/issues)
- **Discussions**: For questions and suggestions
- **Direct to Fabio**: Tag in issue for urgent matters

## Known Limitations (Beta)

Document known issues so testers don't re-report:

1. **Skills not synced to extension** - Extension package may have fewer skills than Master Alex
2. **Global knowledge sync** - Cloud sync requires manual setup
3. **M365 heir** - Not yet aligned with v3.6 architecture
4. **Network diagram** - May not render in all markdown viewers

## Synapses

See `synapses.json` for connections to:

- `architecture-health` (0.9) - Validation overlaps
- `debugging-patterns` (0.8) - Bug investigation
- `error-recovery-patterns` (0.7) - Issue resolution
- `root-cause-analysis` (0.7) - Problem diagnosis
- `incident-response` (0.6) - Structured triage

---

*This skill is TEMPORARY and will be removed after Alex reaches stable release.*
