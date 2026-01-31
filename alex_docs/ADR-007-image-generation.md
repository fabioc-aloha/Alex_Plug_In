# ADR-007: Image Generation in VS Code

**Status**: Proposed
**Date**: 2026-01-31
**Author**: Alex
**Related**: Platform parity with M365 (GraphicArt capability)

---

## Context

The M365 heir has native image generation via the `GraphicArt` capability (DALL-E). This creates a feature gap with the VS Code heir for users who want to:

- Generate diagrams and architecture visualizations
- Create concept art for learning materials
- Visualize data or workflows
- Generate icons or UI mockups

## Decision

Implement image generation in VS Code using **Azure OpenAI DALL-E API** with the following design:

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Interaction                            │
├─────────────────────────────────────────────────────────────────┤
│  Command: alex.generateImage                                    │
│  Tool: alex_image_generation                                    │
│  Context Menu: "Generate Image from Description"                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Image Generation Service                      │
├─────────────────────────────────────────────────────────────────┤
│  src/services/imageGeneration.ts                                │
│                                                                 │
│  • Prompt enhancement (add style, quality hints)                │
│  • API selection (Azure OpenAI preferred, OpenAI fallback)      │
│  • Rate limiting / cost awareness                               │
│  • Response handling (URL → file save)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Output Options                               │
├─────────────────────────────────────────────────────────────────┤
│  1. Save to workspace (./generated-images/)                     │
│  2. Open in VS Code preview                                     │
│  3. Copy to clipboard                                           │
│  4. Insert markdown reference                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Configuration

```json
{
  "alex.imageGeneration.enabled": true,
  "alex.imageGeneration.provider": "azure-openai | openai",
  "alex.imageGeneration.model": "dall-e-3",
  "alex.imageGeneration.size": "1024x1024",
  "alex.imageGeneration.quality": "standard | hd",
  "alex.imageGeneration.outputFolder": "./generated-images"
}
```

### Authentication Options

1. **Azure OpenAI** (Enterprise-friendly)
   - Uses VS Code Azure authentication
   - Endpoint + deployment configured in settings
   - No API key exposure

2. **OpenAI Direct** (Personal use)
   - API key stored in VS Code SecretStorage
   - One-time setup via `alex.setupImageGeneration` command

### API Cost Awareness

| Model | Size | Quality | Approx Cost |
|-------|------|---------|-------------|
| DALL-E 3 | 1024x1024 | standard | $0.04 |
| DALL-E 3 | 1024x1024 | hd | $0.08 |
| DALL-E 3 | 1792x1024 | standard | $0.08 |
| DALL-E 3 | 1792x1024 | hd | $0.12 |

Show cost estimate before generation with confirmation.

## Implementation Plan

### Phase 1: Core Service (2-3 hours)

1. Create `src/services/imageGeneration.ts`:
   - `generateImage(prompt, options)` function
   - Provider abstraction (Azure/OpenAI)
   - Error handling with user-friendly messages

2. Add settings in `package.json`:
   - Provider selection
   - API configuration
   - Output preferences

### Phase 2: Command Integration (1-2 hours)

1. Add `alex.generateImage` command:
   - Quick pick for prompt input
   - Size/quality selection
   - Cost confirmation
   - Progress notification

2. Add `alex.setupImageGeneration` command:
   - Guided API key setup
   - Provider selection
   - Test generation

### Phase 3: LM Tool (1 hour)

1. Create `alex_image_generation` tool:
   - Natural language trigger in chat
   - Automatic prompt enhancement
   - Result display in chat

### Phase 4: Context Menu (30 min)

1. Add to editor context menu:
   - "Generate Image from Selection" (uses selected text as prompt)

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/services/imageGeneration.ts` | Create | Core generation service |
| `src/commands/imageGeneration.ts` | Create | Command implementations |
| `src/chat/imageGenerationTool.ts` | Create | LM tool implementation |
| `package.json` | Modify | Add commands, settings, menus |
| `extension.ts` | Modify | Register commands and tools |

## Alternatives Considered

### Alternative 1: MCP Server Integration

Use an external MCP server for image generation.

**Pros**: Decoupled, reusable
**Cons**: Extra setup, dependency on external process

### Alternative 2: Local Models (Stable Diffusion)

Run local image generation.

**Pros**: Free, private
**Cons**: Requires GPU, complex setup, quality varies

### Alternative 3: Web Service Wrapper

Create a free tier wrapper service.

**Pros**: No user API key needed
**Cons**: Maintenance burden, potential abuse, latency

## Security Considerations

1. **API Key Storage**: Use VS Code SecretStorage (encrypted)
2. **No Key in Settings**: Keys never written to settings.json
3. **Cost Limits**: Optional daily/monthly spending cap
4. **Content Policy**: Rely on OpenAI's content filters

## Success Criteria

- [ ] User can generate images from chat naturally
- [ ] Images saved to workspace with sensible names
- [ ] Clear cost indication before generation
- [ ] Works with Azure OpenAI (enterprise) and OpenAI (personal)
- [ ] Graceful error handling (quota, content policy, network)

## Migration Path

No migration needed - new feature addition.

## References

- [OpenAI Images API](https://platform.openai.com/docs/api-reference/images)
- [Azure OpenAI DALL-E](https://learn.microsoft.com/en-us/azure/ai-services/openai/dall-e-quickstart)
- [VS Code SecretStorage](https://code.visualstudio.com/api/references/vscode-api#SecretStorage)

---

*Approved by: [pending]*
