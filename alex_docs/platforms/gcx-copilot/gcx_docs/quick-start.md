# Quick Start Guide

> Get productive with the GCX Copilot in 5 minutes.

---

## Step 1: Add to Your Project (1 minute)

**New Project:**
```bash
gh repo create my-project --template microsoft/gcx-ai-agent-template
cd my-project
code .
```

**Existing Project:**
```bash
git remote add gcx-template https://github.com/microsoft/gcx-ai-agent-template.git
git fetch gcx-template
git checkout gcx-template/main -- .github/
git commit -m "feat: add GCX Copilot"
```

---

## Step 2: Verify VS Code Settings (30 seconds)

Open Settings (`Ctrl+,`) and ensure:

```json
{
  "chat.agent.enabled": true,
  "chat.agentSkillsLocations": [".github/skills"],
  "chat.useAgentsMdFile": true
}
```

---

## Step 3: Open Copilot Chat (30 seconds)

Press `Ctrl+Alt+I` (or `Cmd+Alt+I` on Mac) to open Copilot Chat.

---

## Step 4: Try These Commands (3 minutes)

### 🔧 Code Assistant

```
@workspace Review this file for security issues
```

```
@workspace Help me debug this error: [paste error]
```

### 📝 Technical Writer

```
@workspace Generate API documentation for this service
```

```
@workspace Create a README for this project
```

### 📚 Documentation Wizard

```
@workspace Audit our docs for accuracy
```

### 🔗 Integration Hub

```
@workspace Create an ADO work item for this bug
```

```
@workspace Query user data from MS Graph
```

```
@workspace Design a Fabric medallion architecture
```

---

## What's Next?

| Goal | Resource |
|------|----------|
| Learn all features | [User Manual](../USER-MANUAL.md) |
| Deep dive on integrations | [Integration Guides](integrations/README.md) |
| Hands-on training | [Training Materials](training/README.md) |
| Customize for your team | [Customization Guide](../USER-MANUAL.md#customization) |

---

## Need Help?

- **Teams Channel**: [GCX Copilot Support]
- **FAQ**: [Frequently Asked Questions](faq.md)
