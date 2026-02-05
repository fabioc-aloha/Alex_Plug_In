# Text-to-Speech Skill for Master Alex

**Status:** ✅ Ready for Promotion
**Version:** 1.1.0
**Origin:** Lithium Research Project (February 2026)

## What This Skill Does

Gives Alex a voice using Microsoft Edge TTS. Alex can read any markdown document, code file, or text aloud with natural-sounding neural voices.

## Why Promote to Master

| Benefit | Description |
|---------|-------------|
| **Universal Utility** | Useful across all projects - reading docs, proofreading, accessibility |
| **Zero Cost** | Edge TTS API is free, no API key required |
| **MCP Pattern** | Server implementation is reusable template for other MCP tools |
| **Accessibility** | Primary use case: vision-impaired users, multitasking, learning |

## Files to Copy

```text
text-to-speech/
├── SKILL.md         # Complete skill documentation
├── synapses.json    # Connection mapping
├── README.md        # This file (optional)
└── examples/        # Sample audio outputs (optional)
    ├── claudia-pitch.mp3
    └── lithium-combined-pitch.mp3
```

## Installation Requirements

1. **Python Environment**

   ```powershell
   python -m pip install edge-tts
   ```

2. **MCP Server** (deployed to `~/.alex/mcp-servers/tts-reader/`)
   - Node.js implementation
   - Uses `@modelcontextprotocol/sdk`

3. **VS Code MCP Configuration**

   ```json
   {
     "mcp": {
       "servers": {
         "tts-reader": {
           "command": "node",
           "args": ["~/.alex/mcp-servers/tts-reader/index.js"],
           "name": "Alex TTS Reader"
         }
       }
     }
   }
   ```

## MCP Tools Provided

| Tool | Purpose |
|------|---------|
| `mcp_tts-reader_read_markdown` | Read markdown file or text aloud |
| `mcp_tts-reader_list_voices` | List available voice options |
| `mcp_tts-reader_set_voice` | Configure default voice settings |
| `mcp_tts-reader_save_audio` | Generate MP3 file from text |

## Proven Use Cases

- **Pitch Rehearsal**: Claudia used this to rehearse stakeholder pitches (audio samples in examples/)
- **Document Review**: Listen to research docs while taking notes
- **Proofreading**: Hearing text catches errors reading misses
- **Accessibility**: Full document access for vision-impaired users

## Alex Voice Presets

| Preset | Voice ID | Character |
|--------|----------|-----------|
| **Default** | en-US-GuyNeural | Professional male, clear articulation |
| **Warm** | en-US-ChristopherNeural | Friendly, conversational |
| **British** | en-GB-RyanNeural | British accent, authoritative |
| **Friendly** | en-US-DavisNeural | Casual, approachable |

## Connected Skills (Synapses)

- `mcp-development` → Foundation for server implementation
- `markdown-mermaid` → Source content processing
- `academic-research` → Document reading for research
- `gamma-presentations` → Audio playback for pitch rehearsal
- `project-management` → Stakeholder pitch generation

---

*Developed during Lithium research project, February 2026*
