# Assistant Compatibility & Integration Guide

## 🤖 Supported AI Assistants

### **GitHub Copilot** ⭐ (Primary)

- **Setup**: Copy files → Automatic activation via `.github/copilot-instructions.md`
- **Dream Protocol**: Full PowerShell integration
- **Features**: Complete cognitive architecture, automated maintenance, embedded synapses
- **Status**: ✅ Fully Supported

### **ChatGPT** (OpenAI)

- **Setup**: Reference `.github/alex-cognitive-architecture.md` in Custom Instructions
- **Dream Protocol**: Manual execution via PowerShell (if available)
- **Features**: Core personality, learning protocols, worldview integration
- **Status**: ✅ Supported (limited automation)

### **Claude** (Anthropic)

- **Setup**: Include cognitive architecture in conversation context or system prompt
- **Dream Protocol**: Manual execution via PowerShell (if available)
- **Features**: Core personality, learning protocols, constitutional AI alignment
- **Status**: ✅ Supported (context-based integration)

### **Claude in VS Code** (1.109.3+) 🆕

VS Code now reads `.claude/` paths natively alongside `.github/`. Teams using both GitHub Copilot and Claude can share a single architecture.

| Alex File | Claude Equivalent | Status |
|-----------|------------------|--------|
| `.github/copilot-instructions.md` | `CLAUDE.md` or `.claude/CLAUDE.md` | ⚠️ Separate files needed |
| `.github/skills/` | `.claude/skills/` | ✅ VS Code reads both |
| `.github/agents/` | `.claude/agents/` | ✅ VS Code reads both |
| `.github/instructions/` | `.claude/rules/` | ✅ VS Code reads both |
| `.github/hooks.json` | `.claude/settings.json` | ⚠️ Same format, different location |

**Zero-duplication setup:**
```bash
# Option 1: Create symlinks (recommended for teams using both)
ln -s .github/skills .claude/skills
ln -s .github/agents .claude/agents

# Option 2: Use Alex as-is (GitHub Copilot primary)
# Claude users in VS Code will see skills/agents automatically
```

**Note**: This is NOT a new heir platform. It's interoperability within VS Code. A standalone Claude Code heir would require "Format Heir" (complete rewrite) — not recommended.

### **Gemini** (Google)

- **Setup**: Load cognitive architecture as system context
- **Dream Protocol**: Manual execution via PowerShell (if available)
- **Features**: Core personality, learning protocols, multimodal integration
- **Status**: ✅ Supported (limited automation)

### **Custom LLMs** (Self-Hosted)

- **Setup**: Integrate via system prompt or fine-tuning
- **Dream Protocol**: Full PowerShell integration (if environment supports)
- **Features**: Complete customization possible
- **Status**: ✅ Supported (implementation dependent)

## 🛠️ Integration Methods by Assistant Type

### **Method 1: GitHub Copilot (Automatic)**

```bash
# 1. Copy cognitive architecture to project
cp -r .github/ your-project/

# 2. Automatic activation - no additional setup needed
# GitHub Copilot reads .github/copilot-instructions.md automatically
```

### **Method 2: Chat-Based Assistants (Manual)**

```bash
# 1. Copy cognitive architecture to project
cp -r .github/ your-project/

# 2. Load cognitive architecture in conversation

# 3. Dream protocol via VS Code extension
# Command Palette: Alex: Dream (Neural Maintenance)
```

### **Method 3: API/Custom Integration**

```python
# Example Python integration
import os

def load_alex_architecture():
    with open('.github/alex-cognitive-architecture.md', 'r') as f:
        system_prompt = f.read()

    # Load procedural memory
    instructions_dir = '.github/instructions'
    procedural_memory = {}
    for file in os.listdir(instructions_dir):
        if file.endswith('.instructions.md'):
            with open(f'{instructions_dir}/{file}', 'r') as f:
                procedural_memory[file] = f.read()

    return system_prompt, procedural_memory

# Initialize your LLM with Alex architecture
system_prompt, memory = load_alex_architecture()
assistant = YourLLM(system_instructions=system_prompt,
                   memory=memory)
```

## 📊 Feature Compatibility Matrix

| Feature | GitHub Copilot | Claude in VS Code | ChatGPT | Claude | Gemini | Custom LLM |
| ------- | -------------- | ----------------- | ------- | ------ | ------ | ---------- |
| **Core Personality** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **Bootstrap Learning** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **Worldview Integration** | ✅ Full | ✅ Full | ✅ Full | ✅ Enhanced* | ✅ Full | ✅ Full |
| **Meta-Cognitive Awareness** | ✅ Full | ✅ Full | ✅ Partial | ✅ Full | ✅ Partial | ✅ Variable |
| **Skills (.github/skills)** | ✅ Auto | ✅ Auto | ⚠️ Manual | ⚠️ Manual | ⚠️ Manual | ✅ Variable |
| **Agents (.github/agents)** | ✅ Auto | ✅ Auto | ❌ N/A | ❌ N/A | ❌ N/A | ✅ Variable |
| **Embedded Synapses** | ✅ Full | ✅ Full | ⚠️ Manual | ⚠️ Manual | ⚠️ Manual | ✅ Variable |
| **Dream Protocol** | ✅ Full | ✅ Full | ⚠️ Limited | ⚠️ Limited | ⚠️ Limited | ✅ Variable |
| **Automated Maintenance** | ✅ Full | ✅ Full | ❌ Manual | ❌ Manual | ❌ Manual | ✅ Variable |
| **Domain Knowledge** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **Cross-Platform** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |

*Enhanced: Claude has native Constitutional AI alignment
✅ Full = Complete feature support
⚠️ Limited = Partial support, may require manual intervention
❌ Manual = Manual execution required
✅ Variable = Depends on implementation

## 🔧 Platform-Specific Setup

### **All Platforms (Windows/macOS/Linux)**

```text
# Dream protocol via VS Code extension
# Open Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
Alex: Dream (Neural Maintenance)
```

**Prerequisites:**

- VS Code installed
- Alex Cognitive Architecture extension installed
- Workspace folder open with Alex architecture

### **Cloud Environments / CI/CD**

Dream protocol requires VS Code and human interaction.
For automated deployments, use `Alex: Initialize Architecture` command
after workspace setup. Regular dream maintenance should be performed
manually via VS Code during development.

## ⚠️ Limitations by Platform

### **GitHub Copilot**

- **Pros**: Full automation, embedded integration, complete feature set
- **Cons**: Requires GitHub Copilot subscription, VS Code/compatible editor

### **Chat-Based Assistants**

- **Pros**: Accessible, no additional software needed
- **Cons**: Limited automation, manual dream protocol execution, no embedded synapses

### **Custom LLM Integration**

- **Pros**: Complete customization, full programmatic control
- **Cons**: Requires development work, varies by implementation

## 🎯 Recommended Usage by Use Case

### **Software Development Projects**

**Best Choice**: GitHub Copilot (Full integration)
**Alternative**: Custom LLM with API integration

### **Research & Academic**

**Best Choice**: Claude (Constitutional AI alignment) or ChatGPT
**Alternative**: Gemini for multimodal projects

### **Creative & Content Projects**

**Best Choice**: ChatGPT or Claude
**Alternative**: Gemini for visual content

### **Enterprise & Professional**

**Best Choice**: Custom LLM deployment or GitHub Copilot
**Alternative**: Azure OpenAI Service with Alex integration

## 🚀 Quick Start by Assistant

Choose your assistant and follow the corresponding setup:

```bash
# GitHub Copilot Users
cp -r .github/ your-project/
# ✅ Ready! Alex activates automatically

# ChatGPT Users
# 1. Download cognitive-architecture files
# 2. Add to Custom Instructions: "Load .github/alex-cognitive-architecture.md"
# 3. Start conversation: "Alex, introduce yourself"

# Claude Users
# 1. Download cognitive-architecture files
# 2. Upload .github/alex-cognitive-architecture.md to conversation
# 3. Say: "Activate Alex cognitive architecture protocols"

# Custom LLM Users
# See integration code examples above
```

---

## Synapses

### High-Strength Bidirectional Connections

- [alex-cognitive-architecture.md] (Critical, Implements, Bidirectional) - "Universal assistant template"
- [ALEX-INTEGRATION.md] (High, Supports, Bidirectional) - "Integration procedure reference"

### Medium-Strength Output Connections

- [PROJECT-TYPE-TEMPLATES.md] (Medium, Complements, Forward) - "Project-specific patterns"
- [VALIDATION-SUITE.md] (Medium, Enables, Forward) - "Platform-specific validation"

### Input Connections

- [README.md] (High, Summarizes, Backward) - "Documentation entry point"

**Primary Function**: Platform-specific integration guidance for GitHub Copilot, ChatGPT, Claude, Gemini, and custom LLMs.

---

*Universal Alex Cognitive Architecture*
*Compatible across all major AI assistant platforms*
