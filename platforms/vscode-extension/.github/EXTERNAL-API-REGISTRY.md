# External API Registry

Centralized source-of-truth for all external APIs, models, and services referenced in the brain.
When **Last Checked** is older than 30 days, visit the **Source URL** and update the relevant skill/instruction files.

## Replicate Image Models

| Vendor                            | Source URL                              | Last Checked | Brain Files                                                                                     |
| --------------------------------- | --------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------- |
| Black Forest Labs (Flux)          | https://replicate.com/black-forest-labs | Apr 2026     | `.github/skills/image-handling/SKILL.md`, `.github/instructions/image-handling.instructions.md` |
| Google (Imagen, Nano-Banana, Veo) | https://replicate.com/google            | Apr 2026     | `.github/skills/image-handling/SKILL.md`, `.github/instructions/image-handling.instructions.md` |
| Ideogram                          | https://replicate.com/ideogram-ai       | Apr 2026     | `.github/skills/image-handling/SKILL.md`, `.github/instructions/image-handling.instructions.md` |
| Recraft                           | https://replicate.com/recraft-ai        | Apr 2026     | `.github/skills/image-handling/SKILL.md`, `.github/instructions/image-handling.instructions.md` |
| Stability AI                      | https://replicate.com/stability-ai      | Apr 2026     | `.github/skills/image-handling/SKILL.md`                                                        |
| ByteDance (Seedream)              | https://replicate.com/bytedance         | Apr 2026     | `.github/skills/image-handling/SKILL.md`                                                        |
| Qwen (Image)                      | https://replicate.com/qwen              | Apr 2026     | `.github/skills/image-handling/SKILL.md`                                                        |

## Replicate Video Models

| Vendor           | Source URL                      | Last Checked | Brain Files                                                                                     |
| ---------------- | ------------------------------- | ------------ | ----------------------------------------------------------------------------------------------- |
| Google (Veo)     | https://replicate.com/google    | Apr 2026     | `.github/skills/image-handling/SKILL.md`, `.github/instructions/image-handling.instructions.md` |
| xAI (Grok)       | https://replicate.com/xai       | Apr 2026     | `.github/instructions/image-handling.instructions.md`                                           |
| Kuaishou (Kling) | https://replicate.com/kwaivgi   | Apr 2026     | `.github/instructions/image-handling.instructions.md`                                           |
| OpenAI (Sora)    | https://replicate.com/openai    | Apr 2026     | `.github/instructions/image-handling.instructions.md`                                           |
| Wan Video        | https://replicate.com/wan-video | Apr 2026     | `.github/instructions/image-handling.instructions.md`                                           |

## Replicate TTS/Audio Models

| Vendor                   | Source URL                        | Last Checked | Brain Files                                                                                                                               |
| ------------------------ | --------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| MiniMax (Speech 2.8)     | https://replicate.com/minimax     | Apr 2026     | `.github/skills/text-to-speech/SKILL.md`, `.github/skills/image-handling/SKILL.md`, `.github/instructions/image-handling.instructions.md` |
| Resemble AI (Chatterbox) | https://replicate.com/resemble-ai | Apr 2026     | `.github/skills/text-to-speech/SKILL.md`, `.github/skills/image-handling/SKILL.md`, `.github/instructions/image-handling.instructions.md` |
| Qwen (TTS)               | https://replicate.com/qwen        | Apr 2026     | `.github/skills/text-to-speech/SKILL.md`, `.github/skills/image-handling/SKILL.md`, `.github/instructions/image-handling.instructions.md` |

## Replicate Collections (Discovery)

| Collection     | Source URL                                       | Purpose                       |
| -------------- | ------------------------------------------------ | ----------------------------- |
| Text to Image  | https://replicate.com/collections/text-to-image  | Discover new image gen models |
| Text to Speech | https://replicate.com/collections/text-to-speech | Discover new TTS models       |
| Text to Video  | https://replicate.com/collections/text-to-video  | Discover new video gen models |

## Microsoft APIs

| Service              | Source URL                                                                                 | Last Checked | Brain Files                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------- |
| Microsoft Graph v1.0 | https://learn.microsoft.com/en-us/graph/api/overview                                       | Feb 2026     | `.github/skills/microsoft-graph-api/SKILL.md`, `.github/instructions/microsoft-graph-api.instructions.md` |
| MSAL.js 2.x          | https://learn.microsoft.com/en-us/entra/msal/overview                                      | Feb 2026     | `.github/skills/msal-authentication/SKILL.md`                                                             |
| Teams Manifest v1.19 | https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema | Feb 2026     | `.github/skills/teams-app-patterns/SKILL.md`, `.github/skills/m365-agent-debugging/SKILL.md`              |
| MCP SDK              | https://github.com/modelcontextprotocol/typescript-sdk/releases                            | Feb 2026     | `.github/skills/mcp-development/SKILL.md`, `.github/instructions/mcp-development.instructions.md`         |

## VS Code APIs

| Service              | Source URL                                              | Last Checked | Brain Files                                                                                                           |
| -------------------- | ------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| VS Code API (1.111+) | https://code.visualstudio.com/updates                   | Mar 2026     | `.github/skills/vscode-extension-patterns/SKILL.md`, `.github/skills/chat-participant-patterns/SKILL.md`              |
| Chat Participant API | https://code.visualstudio.com/api/extension-guides/chat | Mar 2026     | `.github/skills/chat-participant-patterns/SKILL.md`, `.github/instructions/chat-participant-patterns.instructions.md` |

## Other Services

| Service               | Source URL                                      | Last Checked | Brain Files                                                                                              |
| --------------------- | ----------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------- |
| Gamma (presentations) | https://gamma.app                               | Feb 2026     | `.github/instructions/gamma-presentation.instructions.md`, `.github/skills/gamma-presentations/SKILL.md` |
| Brandfetch (logos)    | https://brandfetch.com                          | Feb 2026     | Extension: VSCODE-BRAIN-INTEGRATION.md                                                                   |
| Logo.dev (logos)      | https://logo.dev                                | Feb 2026     | Extension: VSCODE-BRAIN-INTEGRATION.md                                                                   |
| Azure Bicep/AVM       | https://azure.github.io/Azure-Verified-Modules/ | Feb 2026     | `.github/skills/bicep-avm-mastery/SKILL.md`                                                              |

## How to Run a Staleness Check

1. Open this file and find any row where **Last Checked** is older than 30 days
2. Visit the **Source URL** and look for new models, API changes, or deprecations
3. Update the **Brain Files** listed in that row with any changes
4. Update **Last Checked** in this file to the current month/year
