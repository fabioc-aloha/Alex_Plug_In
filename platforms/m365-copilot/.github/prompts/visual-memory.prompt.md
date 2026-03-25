---
description: "Add visual memory (reference photos, voice samples, or video styles) to a skill for self-sufficient face-consistent generation"
---

# Visual Memory


**Invoke with**: `/visual-memory <command> [args]`
**Skill**: [visual-memory/SKILL.md](../skills/visual-memory/SKILL.md)

---

## Commands

```

/visual-memory add-subject <name> — Add a new person with reference photos
/visual-memory add-voice <name> — Register a voice sample for TTS cloning
/visual-memory add-video-style <name> — Store a consistent video motion template
/visual-memory prepare-photos <folder> — Resize + optimize a folder of photos
/visual-memory status — Show current visual memory inventory

```

---

## Usage Examples

```

/visual-memory add-subject alex
/visual-memory add-subject claudia --photos ./claudia-photos/
/visual-memory add-voice alex --file voices/alex-sample.wav
/visual-memory prepare-photos ./raw-photos/
/visual-memory status

```

---

## Execution: add-subject

### 1. Identify Skill

Ask which skill folder should own this visual memory:

```

Which skill folder should contain this subject's visual memory?
(Default: .github/skills/visual-memory/visual-memory/)

````

### 2. Prepare Photos

```powershell
# Resize all photos to 512px @ 85% JPEG
New-Item -ItemType Directory -Path "resized" -Force
Get-ChildItem *.jpg,*.jpeg,*.png | ForEach-Object {
    magick $_.FullName -resize "512x512>" -quality 85 "resized/$($_.BaseName).jpg"
}

# Check sizes
Get-ChildItem resized/*.jpg | Select-Object Name, @{N="KB";E={[math]::Round($_.Length/1KB,1)}}
````

### 3. Convert to Base64 and Build JSON Entry

```javascript
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, basename } from "path";

const RESIZED_DIR = "./resized";
const SUBJECT_NAME = "<name>";

const images = readdirSync(RESIZED_DIR)
  .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
  .sort()
  .map((filename, i) => ({
    filename,
    dataUri: `data:image/jpeg;base64,${readFileSync(join(RESIZED_DIR, filename)).toString("base64")}`,
    notes: `Reference photo ${i + 1}`,
  }));

// Create the subject entry
const subjectEntry = {
  description: `Description of ${SUBJECT_NAME}`,
  ageInfo: { referenceAge: 0, photoDate: new Date().toISOString().slice(0, 7) },
  images,
};

console.log(`Generated ${images.length} images for ${SUBJECT_NAME}`);
console.log(
  "Subject entry:",
  JSON.stringify({ [SUBJECT_NAME]: subjectEntry }, null, 2),
);
```

### 4. Insert Into visual-memory.json

Add the generated subject entry to `.github/skills/<skill>/visual-memory/visual-memory.json`:

```json
{
  "subjects": {
    "existing-subject": { "..." },
    "<new-name>": {
      "description": "...",
      "ageInfo": { "referenceAge": 30, "photoDate": "2026-03" },
      "images": [
        { "filename": "photo-1.jpg", "dataUri": "data:image/jpeg;base64,..." },
        { "filename": "photo-2.jpg", "dataUri": "data:image/jpeg;base64,..." }
      ]
    }
  }
}
```

### 5. Update index.json

```json
{
  "subjects": {
    "<new-name>": {
      "count": <number>,
      "files": ["photo-1.jpg", "photo-2.jpg", "..."]
    }
  }
}
```

### 6. Verify

```javascript
// Quick verification
const vm = JSON.parse(readFileSync("visual-memory.json", "utf8"));
const subject = vm.subjects["<name>"];
console.log(`✅ ${subject.images.length} photos loaded`);
console.log(`✅ First URI length: ${subject.images[0].dataUri.length} chars`);
```

---

## Execution: add-voice

### Requirements

- Duration: 5-15 seconds of clear speech
- Format: WAV or MP3, 16kHz+ sample rate
- No background noise or music

### Steps

1. Place voice file in `visual-memory/voices/<name>-sample.wav`
2. Register in `visual-memory.json`:

```json
{
  "voices": {
    "<name>": {
      "description": "Natural speaking voice",
      "audioFile": "visual-memory/voices/<name>-sample.wav",
      "duration": "10s",
      "model": "chatterbox-turbo"
    }
  }
}
```

3. Test:

```bash
node scripts/generate.js \
  --text "Hello, testing voice clone." \
  --output test-clone.mp3 \
  --model chatterbox-turbo \
  --reference-audio .github/skills/<skill>/visual-memory/voices/<name>-sample.wav
```

---

## Execution: status

Show current inventory:

```javascript
import { readFileSync } from "fs";

const vm = JSON.parse(
  readFileSync(
    ".github/skills/visual-memory/visual-memory/visual-memory.json",
    "utf8",
  ),
);

console.log("=== Visual Memory Status ===");
for (const [name, subject] of Object.entries(vm.subjects || {})) {
  if (name.startsWith("_")) continue;
  console.log(`📸 ${name}: ${subject.images?.length ?? 0} photos`);
}
for (const [name] of Object.entries(vm.voices || {})) {
  if (name.startsWith("_")) continue;
  console.log(`🎤 ${name}: voice sample registered`);
}
for (const [name] of Object.entries(vm.videoStyles || {})) {
  if (name.startsWith("_")) continue;
  console.log(`🎬 ${name}: video style template`);
}
```

---

## Security Reminder

Before publishing a project with populated visual memory:

- ✅ Real people's photos = PII → exclude from public packages
- ✅ Add to `.vscodeignore` or `.gitignore` as needed
- ✅ Never commit visual-memory.json with real portraits to a public repo
