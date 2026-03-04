---
name: "text-to-speech"
description: "Alex's voice synthesis capability for reading documents aloud"
---

# Text-to-Speech Skill ⭐ Flagship

> **Domain**: AI Accessibility & Communication  
> **Inheritance**: inheritable (promote to Master Alex for all heirs)  
> **Version**: 2.5.0  
> **Last Updated**: 2026-02-09  
> **Author**: Alex (Master Alex)  
> **Status**: ⭐ **Flagship Skill** - Core Alex capability

---

## Why This is a Flagship Skill

Text-to-Speech gives Alex a **voice**. This transforms Alex from a text-only assistant into a multimodal companion that can:

- **Read documents aloud** while you walk, drive, or rest your eyes
- **Proofread by ear** - catch errors your eyes miss
- **Accessibility** - full document access for vision-impaired users
- **Rehearsal** - practice presentations with natural-sounding narration
- **Export knowledge** - create MP3s for offline learning

**Zero cost, zero dependencies** - uses Microsoft Edge TTS (free, no API key) with native TypeScript.

---

## User Experience

### 🎯 Quick Start: Read Any Document

**Keyboard shortcut** (fastest):
1. Open any document in VS Code
2. (Optional) Select specific text to read only that portion
3. Press `Ctrl+Alt+R` (Windows/Linux) or `Cmd+Alt+R` (macOS)
4. Audio begins playing through the webview player

**Command palette**:
- `Ctrl+Shift+P` → "Alex: Read Aloud"

### 📊 Status Bar Feedback

The status bar shows real-time progress during TTS operations:

| State | Display | Click Action |
|-------|---------|--------------|
| Connecting | `$(loading~spin) Connecting...` | - |
| Synthesizing | `$(loading~spin) Synthesizing...` | - |
| Streaming | `$(loading~spin) Receiving... 45KB` | - |
| Playing | `$(unmute) Playing 35%` | Stop |
| Paused | `$(unmute) Paused` | Stop |

### 🎵 Webview Audio Player

A sleek panel opens with full playback controls:

```
┌─────────────────────────────────────────────────────────┐
│  Alex TTS Player                                    [×] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ▶️ ⏹️   ═══════════●══════════   1:23 / 4:56          │
│                                                         │
│  🔊 ────────●────────                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- **Progress bar** with scrubbing (click/drag to seek)
- **Play/Pause button** - toggle playback
- **Stop button** - ends playback and closes panel
- **Volume slider** - adjust playback volume
- **Time display** - current position / total duration
- **Auto-close** - panel closes when playback ends

### 🎤 Voice Selection

Choose Alex's voice before reading:

1. `Ctrl+Shift+P` → "Alex: Read with Voice Selection"
2. Quick pick appears:

| Voice | Character | Best For |
|-------|-----------|----------|
| **Default** (GuyNeural) | Professional, clear | Technical docs, code review |
| **Warm** (ChristopherNeural) | Friendly, conversational | Tutorials, READMEs |
| **British** (RyanNeural) | Authoritative | Formal documents, presentations |
| **Friendly** (DavisNeural) | Casual, approachable | Chat logs, informal content |

3. Select voice → reading begins immediately

### 💾 Save as MP3

Export any document to audio file:

1. `Ctrl+Shift+P` → "Alex: Save as Audio"
2. Save dialog opens (default name based on document)
3. Progress notification shows synthesis progress
4. Success notification with options:
   - **Open File** - plays in default audio player
   - **Open Folder** - reveals in file explorer

**Use cases:**
- Create podcasts from documentation
- Generate audio for offline learning
- Archive presentations as audio

### ⏹️ Stop Reading

Multiple ways to stop playback:

- **Click status bar** (shows `$(unmute)` icon during playback)
- **Press `Escape`** when reading
- **Click stop button** in webview player
- **Close webview panel**
- `Ctrl+Shift+P` → "Alex: Stop Reading"

### 📝 Smart Markdown Processing

Alex automatically strips markdown formatting for natural speech:

| You Write | Alex Reads |
|-----------|------------|
| `# Heading` | "Heading." (pause) |
| `**bold text**` | "bold text" (slight emphasis) |
| `[link text](url)` | "link text" |
| `` `code` `` | "code" |
| `> blockquote` | "Quote: ..." |
| `---` | (long pause) |

**Symbol conversion:**

| Symbol | Spoken As |
|--------|-----------|
| `~5 minutes` | "about 5 minutes" |
| `50%` | "50 percent" |
| `A → B` | "A leads to B" |
| `±5%` | "plus or minus 5 percent" |

---

## For Master Alex (Promotion Notes)

This skill gives Alex a voice. **Version 2.0** uses native TypeScript WebSocket integration with Microsoft Edge TTS, eliminating external dependencies. Reading documents aloud with natural-sounding neural voices.

**Version 2.0 Changes:**

- Native TypeScript implementation (no Python/MCP dependencies)
- Direct WebSocket connection to Edge TTS endpoint
- Webview-based audio player (cross-platform)
- Integrated as VS Code commands
- Status bar progress feedback

**Why promote to Master:**

- Universal utility across all projects
- Zero-cost implementation (uses free Edge TTS API)
- No external dependencies (Python, MCP server)
- Accessibility benefits for vision-impaired users
- Integrated into VS Code extension

**Dependencies (v2.0):**

- `ws` npm package (WebSocket client)
- VS Code webview API (for audio playback)

---

## Overview

Alex's voice synthesis capability using Microsoft Edge TTS via native TypeScript. Enables reading markdown documents, code files, and text aloud with natural-sounding voices. Fully integrated into the VS Code extension.

---

## Architecture (v2.0)

```text
┌─────────────────────────────────────────────────────────────┐
│                 Alex VS Code Extension                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Commands:                                                   │
│  • Alex: Read Aloud (Ctrl+Alt+R)                            │
│  • Alex: Read with Voice Selection                          │
│  • Alex: Save as Audio                                      │
│  • Alex: Stop Reading                                       │
│                     │                                        │
│                     ▼                                        │
│  ┌─────────────────────────────────────────────┐            │
│  │           ttsService.ts                       │            │
│  │   Native WebSocket to Edge TTS               │            │
│  │   • SSML generation                          │            │
│  │   • Markdown stripping                       │            │
│  │   • Progress callbacks                       │            │
│  └─────────────────┬───────────────────────────┘            │
│                    │                                         │
│                    ▼                                         │
│  ┌─────────────────────────────────────────────┐            │
│  │           audioPlayer.ts                      │            │
│  │   Webview-based playback                     │            │
│  │   • Cross-platform HTML5 Audio               │            │
│  │   • Play/pause/stop controls                 │            │
│  │   • Progress tracking                        │            │
│  └─────────────────────────────────────────────┘            │
│                                                              │
└──────────────────────┬──────────────────────────────────────┘
                       │ WebSocket (wss://)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Microsoft Edge TTS Endpoint                    │
│   wss://speech.platform.bing.com/consumer/speech/...        │
├─────────────────────────────────────────────────────────────┤
│  • 400+ neural voices, 90+ languages                        │
│  • Free, no API key required                                │
│  • MP3 output (24kHz, 48kbps)                               │
│  • SSML support for prosody control                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Alex Voice Presets

| Preset | Voice ID | Character |
|--------|----------|-----------|
| **Default** | en-US-GuyNeural | Professional male, clear articulation |
| **Warm** | en-US-ChristopherNeural | Friendly, conversational |
| **British** | en-GB-RyanNeural | British accent, authoritative |
| **Friendly** | en-US-DavisNeural | Casual, approachable |

### Voice Selection Rationale

Alex's default voice (GuyNeural) was chosen for:
- **Clarity**: Excellent pronunciation of technical terms
- **Neutrality**: Not too formal, not too casual
- **Distinctiveness**: Recognizable as "Alex's voice"
- **Consistency**: Same voice across all platforms

---

## VS Code Commands

### Alex: Read Aloud

**Command**: `alex.readAloud`  
**Keybinding**: `Ctrl+Alt+R` (Windows/Linux), `Cmd+Alt+R` (macOS)

Reads the current selection or entire document aloud using Alex's default voice.

**Behavior**:
- If text is selected, reads only the selection
- If no selection, reads the entire document from top
- If no editor open (v2.1.0): offers "Paste from Clipboard" or "Type Text" options
- Markdown files are stripped of formatting for natural speech
- Pasted/typed text is auto-detected for markdown patterns
- Progress shown in status bar
- Click status bar to stop playback

### Alex: Read with Voice Selection

**Command**: `alex.readWithVoice`

Quick pick to select a voice preset before reading.

### Alex: Save as Audio

**Command**: `alex.saveAsAudio`

Generate and save speech to an MP3 file. Opens a save dialog for output location.

### Alex: Stop Reading

**Command**: `alex.stopReading`  
**Keybinding**: `Escape` (when reading)

Immediately stops current playback.

---

## Implementation Details

### Core Files (src/tts/)

| File | Purpose |
|------|---------|
| `ttsService.ts` | WebSocket connection, SSML generation, synthesis |
| `audioPlayer.ts` | Webview panel, playback controls, system fallback |
| `index.ts` | Module exports |

### Text Preprocessing

The `prepareTextForSpeech()` function strips markdown:

| Markdown | Speech Output |
|----------|---------------|
| `# Heading` | "Heading." (pause) |
| `**bold**` | "bold" (emphasis via prosody) |
| `*italic*` | "italic" |
| `` `code` `` | "code" |
| `[link]\(url\)` | "link" |
| `- item` | "Item." |
| `> quote` | "Quote: ..." |
| `---` | (long pause) |

### Code Block Handling

```markdown
```python
def hello():
    print("Hello")
```
```

Becomes: "Python code block. Definition hello. Print hello. End code block."

### Symbol-to-Speech Transformations

Symbols are converted to natural speech equivalents:

| Symbol | Spoken As | Example |
|--------|-----------|--------|
| `~` | "approximately" or "about" | ~2 min → "about 2 minutes" |
| `&` | "and" | A & B → "A and B" |
| `@` | "at" | user@email → "user at email" |
| `%` | "percent" | 50% → "50 percent" |
| `+` | "plus" | +10% → "plus 10 percent" |
| `→` | "leads to" or "becomes" | A → B → "A becomes B" |
| `—` | (pause) | word—word → "word (pause) word" |
| `#` | (context-dependent) | #1 → "number 1"; ## → (heading marker) |
| `<` / `>` | "less than" / "greater than" | x > 5 → "x greater than 5" |
| `≥` / `≤` | "greater than or equal" / "less than or equal" | |
| `µ` | "micro" | µg → "microgram" |
| `°` | "degrees" | 37°C → "37 degrees celsius" |
| `±` | "plus or minus" | ±5% → "plus or minus 5 percent" |

### Time Duration Patterns (v2.1.0)

| Input | Spoken As |
|-------|----------|
| `4h` | "4 hours" |
| `30m` | "30 minutes" |
| `15s` | "15 seconds" |
| `2d` | "2 days" |
| `1w` | "1 week" |
| `90min` | "90 minutes" |

### Emoji Pronunciation (v2.1.0)

| Emoji | Spoken As | Context |
|-------|-----------|--------|
| ✅ | "completed" | Status indicators |
| ❌ | "not done" | Status indicators |
| ⚠️ | "warning" | Alerts |
| 📋 | "planned" | Task status |
| 🔄 | "in progress" | Task status |
| ⏳ | "waiting" | Task status |
| 🔥 | "hot" or "high priority" | When followed by "High" |
| 🔓 | "unlocked" | Feature status |
| 💡 | "idea" | Suggestions |
| 🆕 | "new" | Version notes |

**Emoji-Text Deduplication**: When emoji meaning matches following text (e.g., `✅ Complete`), only says it once ("completed", not "completed Complete").

### Table Reading (v2.1.0)

Markdown tables are converted to natural speech:

```markdown
| Name  | Status    |
|-------|----------|
| Alice | ✅ Done   |
| Bob   | 🔄 Active |
```

Becomes: "Table with 2 columns: Name, Status. Row 1: Name is Alice. Status is completed. Row 2: Name is Bob. Status is in progress."

### Version Pattern Intelligence (v2.1.0)

Versions are spoken naturally with context awareness:

| Input | Spoken As | Why |
|-------|-----------|----|
| `v4.2.9` | "version 4.2.9" | Standalone version |
| `Version: v4.2.9` | "Version: 4.2.9" | Already has "Version:" prefix |

Uses negative lookbehind to prevent redundant "version version".

**Design Principle**: Would a human reading this aloud say the symbol name, or translate it to meaning? Almost always the latter.

---

## Reliability & Long Content Handling (v2.1.0)

### The Problem

Edge TTS has undocumented size limits per WebSocket request. Documents over ~3000 characters (approximately 7 minutes of audio) can cause the connection to stall indefinitely, appearing to hang at "Synthesizing..." with no progress.

### The Solution: Chunking with Retry

**Chunking Strategy:**

| Setting | Value | Rationale |
|---------|-------|-----------|
| `MAX_CHUNK_CHARS` | 3000 | Safe limit before Edge TTS stalls |
| `CHUNK_TIMEOUT_MS` | 60000 | 60 seconds per chunk |
| `MAX_RETRIES` | 3 | Retry failed chunks |

**Chunk Splitting Logic:**
1. Split at paragraph boundaries (`\n\n`) first
2. If still too long, split at sentence boundaries (`. ` or `! ` or `? `)
3. Progress displayed as `Synthesizing speech [n/N]...`

**Retry with Exponential Backoff:**

| Attempt | Delay | Formula |
|---------|-------|---------|
| 1 | ~1s | `1000 + jitter` |
| 2 | ~2s | `2000 + jitter` |
| 3 | ~4s | `4000 + jitter` |

Jitter (0-500ms random) prevents thundering herd on concurrent requests.

### Long Content Summarization

For documents over 5 minutes (~750 words), Alex offers to summarize before reading:

```
This document is approximately 32 minutes long (~4800 words).
Would you like to:
- Read full content (~32 min)
- Summarize for speech (~3 min) ← Recommended
```

Summarization uses the VS Code Language Model API (GPT-4o preferred) with a target of ~450 words (~3 minutes).

### Speaker Warmup Delay

Bluetooth and USB speakers often need time to "wake up" from power-saving mode. A 2-second delay before playback starts ensures the first words aren't clipped:

```javascript
const SPEAKER_WARMUP_MS = 2000;
// Status shows "Preparing speakers..." during delay
```

---

## Installation (v2.0)

TTS v2 is built into the Alex VS Code extension. No separate installation required.

### Package Dependencies

The extension automatically includes:
- `ws` (WebSocket client for Edge TTS connection)
- `fs-extra` (file operations for audio saving)

### Verification

After extension update, verify TTS works:

1. Open any document
2. Press `Ctrl+Alt+R` (Windows/Linux) or `Cmd+Alt+R` (macOS)
3. Status bar should show "$(unmute) Synthesizing..."
4. Audio should play through webview panel

---

## Usage Patterns

### Read Current Document
```
Press Ctrl+Alt+R to read document aloud
Select text first to read only selection
```

### Generate Audio File
```
Command Palette → "Alex: Save as Audio"
Choose output location → MP3 saved
```

### Voice Customization
```
Command Palette → "Alex: Read with Voice Selection"
Choose: Default | Warm | British | Friendly
```

---

## Edge TTS Technical Reference

### WebSocket Endpoint

```
wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1
?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4
&ConnectionId=[UUID]
```

### Audio Format

- **Codec**: MP3
- **Sample Rate**: 24kHz
- **Bitrate**: 48kbps mono

### SSML Template

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-GuyNeural">
    <prosody rate="+0%" pitch="+0Hz" volume="+0%">
      Text content here
    </prosody>
  </voice>
</speak>
```

### Multi-Language Support (v2.1.0)

Alex automatically detects the language of your text and selects an appropriate voice.

**Detection Strategy:**

| Detection Type | Languages | Method |
|----------------|-----------|--------|
| **Character-based** | Chinese, Japanese, Korean, Arabic, Hebrew, Thai, Hindi, Russian, Greek, Vietnamese | Script/Unicode ranges |
| **Word-pattern** | Spanish, French, German, Portuguese, Italian, Dutch, Polish, Swedish, Norwegian, Finnish, Danish, Turkish, Indonesian, Malay, Tagalog, Romanian, Czech, Hungarian | Common word markers |

**User Prompt Fallback:**
- If detection confidence < 15%, Alex prompts you to select the language
- Quick pick shows top language options plus "Other (English default)"

**32 Supported Languages:**

| Language | Voice | Locale |
|----------|-------|--------|
| English (US) | GuyNeural | en-US |
| English (UK) | RyanNeural | en-GB |
| English (AU) | WilliamNeural | en-AU |
| Spanish | AlvaroNeural | es-ES |
| French | HenriNeural | fr-FR |
| German | ConradNeural | de-DE |
| Portuguese (BR) | AntonioNeural | pt-BR |
| Italian | DiegoNeural | it-IT |
| Dutch | MaartenNeural | nl-NL |
| Polish | MarekNeural | pl-PL |
| Russian | DmitryNeural | ru-RU |
| Japanese | KeitaNeural | ja-JP |
| Korean | InJoonNeural | ko-KR |
| Chinese (Mandarin) | YunxiNeural | zh-CN |
| Chinese (Taiwan) | YunJheNeural | zh-TW |
| Arabic | HamedNeural | ar-SA |
| Hindi | MadhurNeural | hi-IN |
| Vietnamese | NamMinhNeural | vi-VN |
| Thai | NiwatNeural | th-TH |
| Turkish | AhmetNeural | tr-TR |
| Swedish | MattiasNeural | sv-SE |
| Norwegian | FinnNeural | nb-NO |
| Danish | JeppeNeural | da-DK |
| Finnish | HarriNeural | fi-FI |

---

## Accessibility Benefits

| Use Case | Benefit |
|----------|---------|
| **Vision impaired** | Full document access via audio |
| **Multitasking** | Review code while walking/driving |
| **Learning** | Auditory reinforcement of reading |
| **Proofreading** | Catch errors by hearing text |
| **Long documents** | Listen during breaks |

---

## Version History

### v2.5.0 (2026-02-09)
- **Speak Prompt command** - Generate content via LLM then read aloud ("read me a poem")
- **Voice Mode summarization** - Responses >750 words auto-summarized before reading
- **Keyboard shortcuts** - Ctrl+Alt+R/V/P + Escape context-aware stop
- **Rich markdown tooltips** - Status bar shows all shortcuts
- **Emoji notifications** - User-friendly feedback (❌ ⚠️ 📋 📝 📖 🌍 💾 🔊 🔇)
- **CSP-compliant webview** - data-cmd pattern replaces inline onclick
- **Enhanced quick picks** - Cross-command navigation when no document open
- **35 unit tests** - Language detection, voice selection, markdown processing

### v2.4.0 (2026-02-06)
- **Multi-language auto-detection** (32 languages)
- Character-based detection for non-Latin scripts (CJK, Cyrillic, Arabic, etc.)
- Word-pattern detection for Latin-script languages
- User prompt fallback when detection confidence < 15%
- Dynamic SSML `xml:lang` attribute for optimal pronunciation

### v2.0.0 (2026-02-05)
- Native TypeScript implementation
- Removed Python/MCP server dependencies
- Webview-based cross-platform audio player
- VS Code command integration
- Status bar progress feedback

### v1.1.0 (2026-02-05)
- Added Alex voice presets
- Enhanced markdown stripping
- Symbol to speech conversion

### v1.0.0 (2026-02-04)
- Initial implementation via MCP server
- Python edge-tts integration
- Basic markdown support

---

## Synapses

- **accessibility**: Primary use case enabler
- **vscode-extension-patterns**: Extension command patterns, CSP-compliant webview
- **markdown-mermaid**: Source content processing
- **academic-research**: Document reading for research projects
- **gamma-presentations**: Audio playback of pitch content for rehearsal and delivery
- **project-management**: Stakeholder pitch presentations generated as audio files
- **ux-design**: Emoji feedback patterns, keyboard shortcut UX
- **testing-strategies**: Unit test patterns for language detection

---

## Future Enhancements

| Feature | Status | Notes |
|---------|--------|-------|
| Real-time streaming | ✅ Done | Chunked synthesis with progress |
| SSML support | Planned | Fine-grained prosody control |
| Section navigation | Planned | "Skip to next heading" |
| Bookmark resume | Planned | Resume from last position |
| Speed presets | Planned | 1x, 1.5x, 2x reading speeds |

---

## Replicate Cloud TTS (Content Creation)

For use cases beyond real-time document reading — audiobooks, video narration, voice cloning — Replicate offers paid TTS models.

| Model | Replicate ID | Cost | Voice Cloning | Languages |
|-------|-------------|------|---------------|----------|
| **Speech Turbo** | `minimax/speech-2.8-turbo` | $0.06/1k tokens | ❌ | 40+ |
| **Chatterbox Turbo** | `resemble-ai/chatterbox-turbo` | $0.025/1k chars | ✅ (5s sample) | English |
| **Qwen TTS** | `qwen/qwen3-tts` | $0.02/1k chars | ✅ | 10 |

### When to Use Cloud TTS vs Edge TTS

| Scenario | Use | Why |
|----------|-----|-----|
| Read document in VS Code | **Edge TTS** | Free, instant, integrated in extension |
| Audiobook narration | **Replicate** | Higher quality, voice cloning option |
| Video voiceover | **Replicate** | Emotion control, voice design |
| Custom voice from sample | **Replicate** | Chatterbox/Qwen clone from 5s audio |
| Voice from description | **Replicate Qwen** | "Warm British female voice" → synthesized |
| Max language coverage | **Edge TTS** | 32 languages, zero cost |

### Voice Cloning Pattern

```javascript
// Clone a voice from a 5+ second audio sample
const output = await replicate.run("resemble-ai/chatterbox-turbo", {
  input: {
    text: "Content to speak in the cloned voice",
    audio_prompt: audioDataURI  // 5+ seconds WAV/MP3
  }
});
```

### Emotion Control (Speech Turbo)

Emotions: `auto`, `happy`, `sad`, `angry`, `fearful`, `disgusted`, `surprised`

Voice presets: `Wise_Woman`, `Deep_Voice_Man`, `Casual_Guy`, `Lively_Girl`, `Young_Knight`, `Abbess`, + more

### Voice Design (Qwen TTS)

Create a voice from natural language:

```javascript
const output = await replicate.run("qwen/qwen3-tts", {
  input: {
    text: "Content to speak",
    tts_mode: "voice_design",
    voice_description: "A warm, friendly female voice with a slight British accent"
  }
});
```

See the **image-handling** skill for the full Replicate model catalog.
