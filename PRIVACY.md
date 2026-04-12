# Privacy Policy

**Effective Date**: February 5, 2026
**Last Updated**: April 12, 2026

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

| Data Type              | Location                              | Purpose                                    |
| ---------------------- | ------------------------------------- | ------------------------------------------ |
| Cognitive architecture | `.github/` in your workspace          | Alex's memory for that project             |
| Global knowledge       | `AI-Memory/` (cloud storage)          | Cross-project insights                     |
| User profile           | `AI-Memory/user-profile.json`         | Personalization preferences (cloud-synced) |
| Project persona        | `.github/config/project-persona.json` | Workspace-specific persona detection       |
| Meditation logs        | `.github/episodic/`                   | Session history                            |

**You own this data.** It's stored in readable files you can inspect, edit, or delete at any time.

---

## Data Processing

### Cloud Sync (Optional)

If you use cloud-synced AI-Memory:
- Knowledge files sync via **your own cloud storage** (OneDrive, iCloud, or Dropbox)
- You control the folder and its contents
- Alex reads/writes to the AI-Memory folder using your file system
- No additional accounts or services required

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
- Open your `AI-Memory/` folder for global knowledge (cloud-synced via OneDrive/iCloud/Dropbox, or `~/.alex/AI-Memory/` local fallback)

### Delete Your Data

To remove all Alex data:

```bash
# Remove from current project
rm -rf .github/

# Remove AI-Memory (cloud-synced location varies by provider)
# Check your OneDrive/iCloud/Dropbox folder for AI-Memory/
# Or remove local fallback:
rm -rf ~/.alex/AI-Memory/

# Uninstall extension
code --uninstall-extension fabioc-aloha.alex-cognitive-architecture
```

### Export Your Data

Your data is already in portable markdown/JSON format. Simply copy the folders.

### Opt Out

- **Cloud Sync**: Falls back to local `~/.alex/AI-Memory/` if no cloud storage is detected
- **Image Generation**: Don't configure API keys

---

## Third-Party Services

| Service       | When Used                 | Data Sent          | Privacy Policy                                     |
| ------------- | ------------------------- | ------------------ | -------------------------------------------------- |
| **Replicate** | Image generation (opt-in) | Image prompts      | [Replicate Privacy](https://replicate.com/privacy) |
| **Gamma**     | Presentations (opt-in)    | Content for slides | [Gamma Privacy](https://gamma.app/privacy)         |

---

## Data Retention

| Data Type   | Retention                                 |
| ----------- | ----------------------------------------- |
| Local files | Until you delete them                     |
| AI-Memory   | Controlled by your cloud storage provider |

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
