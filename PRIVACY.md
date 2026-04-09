# Privacy Policy

**Effective Date**: February 5, 2026
**Last Updated**: April 9, 2026
**Version**: 7.4.1

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

### Cloud Sync (Optional)

If you enable cloud sync:
- Knowledge files sync to **YOUR** GitHub repository
- You control the repository and its visibility
- Alex accesses via your authenticated VS Code session
- See [GitHub Privacy Statement](https://docs.github.com/privacy)

### Image Generation (Optional)

If you configure image generation:
- Prompts are sent to **Replicate** (your configured provider)
- Images are saved locally
- API keys stored encrypted via VS Code SecretStorage
- See [Replicate Privacy](https://replicate.com/privacy)

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
- **Image Generation**: Don't configure API keys

---

## Third-Party Services

| Service       | When Used                 | Data Sent          | Privacy Policy                                     |
| ------------- | ------------------------- | ------------------ | -------------------------------------------------- |
| **GitHub**    | Cloud Sync (opt-in)       | Knowledge files    | [GitHub Privacy](https://docs.github.com/privacy)  |
| **Replicate** | Image generation (opt-in) | Image prompts      | [Replicate Privacy](https://replicate.com/privacy) |
| **Gamma**     | Presentations (opt-in)    | Content for slides | [Gamma Privacy](https://gamma.app/privacy)         |

---

## Data Retention

| Data Type   | Retention                          |
| ----------- | ---------------------------------- |
| Local files | Until you delete them              |
| Cloud sync  | Controlled by your GitHub settings |

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
- Create an issue: [GitHub Issues](https://github.com/fabioc-aloha/Alex_Plug_In/issues)

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
