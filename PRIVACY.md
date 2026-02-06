# Privacy Policy

**Effective Date**: February 5, 2026
**Last Updated**: February 5, 2026
**Version**: 4.2.12

---

## Overview

Alex Cognitive Architecture ("Alex") is designed with **privacy by default**. Your data stays on your machine unless you explicitly choose to sync it.

---

## What We Collect

### ❌ We Do NOT Collect

| Data Type                          | Collected? |
| ---------------------------------- | ---------- |
| Personal information (name, email) | ❌ No       |
| Usage telemetry                    | ❌ No       |
| Analytics or metrics               | ❌ No       |
| Your code or workspace content     | ❌ No       |
| Conversation transcripts           | ❌ No       |
| IP addresses                       | ❌ No       |
| Device identifiers                 | ❌ No       |

### ✅ Stored Locally on Your Machine

| Data Type              | Location                           | Purpose                        |
| ---------------------- | ---------------------------------- | ------------------------------ |
| Cognitive architecture | `.github/` in your workspace       | Alex's memory for that project |
| Global knowledge       | `~/.alex/` (your home directory)   | Cross-project insights         |
| User profile           | `.github/config/user-profile.json` | Personalization preferences    |
| Meditation logs        | `.github/episodic/`                | Session history                |

**You own this data.** It's stored in readable files you can inspect, edit, or delete at any time.

---

## Data Processing

### Text-to-Speech (Edge TTS)

When you use "Read Aloud":
- Text is sent to Microsoft Edge TTS servers
- Audio is returned and played locally
- **No text is stored** on Microsoft servers beyond processing
- See [Microsoft Privacy Statement](https://privacy.microsoft.com/)

### Cloud Sync (Optional)

If you enable cloud sync:
- Knowledge files sync to **YOUR** GitHub repository
- You control the repository and its visibility
- Alex accesses via your authenticated VS Code session
- See [GitHub Privacy Statement](https://docs.github.com/privacy)

### Image Generation (Optional)

If you configure image generation:
- Prompts are sent to your configured provider (Azure OpenAI or OpenAI)
- Images are saved locally
- API keys stored encrypted via VS Code SecretStorage
- See provider's privacy policy

### GitHub Copilot

Alex extends GitHub Copilot. Copilot's privacy practices apply:
- See [GitHub Copilot Privacy](https://docs.github.com/copilot/overview-of-github-copilot/about-github-copilot-individual#privacy)

---

## Your Rights

### Access Your Data

All Alex data is in readable files:
- Open `.github/` folder in any project
- Open `~/.alex/` folder for global knowledge

### Delete Your Data

To remove all Alex data:

```bash
# Remove from current project
rm -rf .github/

# Remove global knowledge
rm -rf ~/.alex/

# Uninstall extension
code --uninstall-extension fabioc-aloha.alex-cognitive-architecture
```

### Export Your Data

Your data is already in portable markdown/JSON format. Simply copy the folders.

### Opt Out

- **Cloud Sync**: Disabled by default (`alex.cloudSync.enabled: false`)
- **OneDrive Sync**: Disabled by default (`alex.m365.autoSync: false`)
- **TTS**: Don't use the Read Aloud feature
- **Image Generation**: Don't configure API keys

---

## Third-Party Services

| Service                | When Used                 | Data Sent                 | Privacy Policy                                      |
| ---------------------- | ------------------------- | ------------------------- | --------------------------------------------------- |
| **Microsoft Edge TTS** | Read Aloud command        | Text to speak (transient) | [Microsoft Privacy](https://privacy.microsoft.com/) |
| **GitHub**             | Cloud Sync (opt-in)       | Knowledge files           | [GitHub Privacy](https://docs.github.com/privacy)   |
| **OpenAI**             | Image generation (opt-in) | Image prompts             | [OpenAI Privacy](https://openai.com/privacy/)       |
| **Azure OpenAI**       | Image generation (opt-in) | Image prompts             | [Microsoft Privacy](https://privacy.microsoft.com/) |

---

## Data Retention

| Data Type     | Retention                          |
| ------------- | ---------------------------------- |
| Local files   | Until you delete them              |
| Cloud sync    | Controlled by your GitHub settings |
| TTS audio     | Temporary (deleted after playback) |
| Edge TTS logs | Per Microsoft's retention policy   |

---

## Children's Privacy

Alex is not directed at children under 13. We do not knowingly collect data from children.

---

## Changes to This Policy

We may update this policy. Check the "Last Updated" date at the top.

---

## Contact

For privacy questions:
- Open an issue: [GitHub Issues](https://github.com/fabioc-aloha/Alex_Plug_In/issues)
- Create a discussion: [GitHub Discussions](https://github.com/fabioc-aloha/Alex_Plug_In/discussions)

---

## Summary

| Question                    | Answer                           |
| --------------------------- | -------------------------------- |
| Does Alex collect my data?  | **No**                           |
| Does Alex send telemetry?   | **No**                           |
| Is my code sent anywhere?   | **No** (unless you use Copilot)  |
| Can I delete all Alex data? | **Yes**, just delete the folders |
| Is cloud sync required?     | **No**, it's opt-in              |

---

*Alex Cognitive Architecture — Your data, your control.*
