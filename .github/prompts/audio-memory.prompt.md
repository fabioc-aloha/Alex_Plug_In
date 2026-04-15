---
sem: 1
description: "Add voice samples to audio memory for TTS cloning"
application: "When managing voice samples for text-to-speech cloning"
---

# Audio Memory

**Invoke with**: `/audio-memory <command> [args]`
**Skill**: [audio-memory/SKILL.md](../skills/audio-memory/SKILL.md)

---

## Commands

```
/audio-memory add-voice <name>     — Add a new voice sample
/audio-memory list                 — Show registered voices
/audio-memory test <name>          — Test voice clone
/audio-memory status               — Show audio memory inventory
```

---

## Usage Examples

```
/audio-memory add-voice alex --file ~/recordings/alex-voice.wav
/audio-memory add-voice narrator --file ./narrator-sample.wav --model qwen
/audio-memory list
/audio-memory test alex --text "Hello, testing my cloned voice."
/audio-memory status
```

---

## Execution: add-voice

### 1. Validate Audio File

Check the audio sample meets requirements:

```powershell
# Check file exists and format
$file = Get-Item "<path-to-audio>"
$file.Extension  # Should be .wav or .mp3
$file.Length / 1KB  # Should be 100-500KB for 5-15s

# If ffprobe available, check duration
ffprobe -i "<path-to-audio>" -show_entries format=duration -v quiet -of csv="p=0"
```

### 2. Create Audio Memory Structure

```powershell
$skillPath = ".github/skills/<target-skill>"
New-Item -ItemType Directory -Path "$skillPath/audio-memory/voices" -Force
```

### 3. Copy Voice Sample

```powershell
Copy-Item "<source-audio>" "$skillPath/audio-memory/voices/<name>-sample.wav"
```

### 4. Update index.json

```javascript
import { readFileSync, writeFileSync, existsSync } from "fs";

const indexPath = ".github/skills/<skill>/audio-memory/index.json";
const index = existsSync(indexPath)
  ? JSON.parse(readFileSync(indexPath, "utf8"))
  : { version: "1.0", voices: {} };

index.voices["<name>"] = {
  description: "<voice description>",
  audioFile: "voices/<name>-sample.wav",
  duration: "<duration>s",
  sampleRate: "<sample-rate>",
  language: "en-US",
  preferredModel: "chatterbox-turbo",
};
index.updated = new Date().toISOString().slice(0, 10);

writeFileSync(indexPath, JSON.stringify(index, null, 2));
```

### 5. Verify

```javascript
const index = JSON.parse(readFileSync(indexPath, "utf8"));
console.log(`✅ Voice "${name}" added`);
console.log(`   File: ${index.voices[name].audioFile}`);
console.log(`   Model: ${index.voices[name].preferredModel}`);
```

---

## Execution: test

### Test Voice Clone

```javascript
import Replicate from "replicate";
import { readFileSync } from "fs";

const replicate = new Replicate();

// Load audio memory
const index = JSON.parse(
  readFileSync(".github/skills/<skill>/audio-memory/index.json", "utf8")
);
const voice = index.voices["<name>"];

// Generate test audio
const output = await replicate.run("resemble-ai/chatterbox-turbo", {
  input: {
    text: "<test-text>",
    audio_prompt: readFileSync(
      `.github/skills/<skill>/audio-memory/${voice.audioFile}`
    ),
  },
});

console.log("Generated audio URL:", output);
// Download and play to verify quality
```

---

## Execution: status

### Show Inventory

```javascript
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const baseDir = ".github/skills/<skill>/audio-memory";
const index = JSON.parse(readFileSync(join(baseDir, "index.json"), "utf8"));

console.log("=== Audio Memory Status ===\n");

for (const [name, voice] of Object.entries(index.voices)) {
  const filePath = join(baseDir, voice.audioFile);
  const stat = statSync(filePath);
  
  console.log(`📣 ${name}`);
  console.log(`   Description: ${voice.description}`);
  console.log(`   Duration: ${voice.duration}`);
  console.log(`   File size: ${(stat.size / 1024).toFixed(1)}KB`);
  console.log(`   Model: ${voice.preferredModel}`);
  console.log("");
}
```

---

## Voice Sample Guidelines

| Requirement      | Value                           |
| ---------------- | ------------------------------- |
| Duration         | 5-15 seconds (10s optimal)      |
| Format           | WAV (preferred) or MP3          |
| Sample rate      | 16kHz+ (22kHz+ recommended)     |
| Content          | Natural speech, varied tone     |
| Background       | Silent — no noise or music      |

---

## Model Selection

| Need                  | Model              | Why                          |
| --------------------- | ------------------ | ---------------------------- |
| Best English cloning  | chatterbox-turbo   | Natural pauses, clear output |
| Multi-language        | qwen/qwen3-tts     | 10+ languages supported      |
| No sample available   | qwen voice_design  | Design voice from text desc  |
| Fast iteration        | minimax speech     | No cloning, 40+ presets      |
