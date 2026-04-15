---
description: "Generate AI music and soundtracks for video, podcasts, and content creation"
application: "When generating music, soundtracks, songs with lyrics, or background audio"
mode: agent
tools: ['run_in_terminal', 'create_file', 'read_file', 'fetch_webpage']
---

# Music Generation

Generate AI music via Replicate for background tracks, songs with lyrics, and soundtracks.

## Available Models

| Key | Model | Best For | Cost |
|-----|-------|----------|------|
| `music15` | MiniMax Music 1.5 | **Songs with lyrics** | $0.03/file |
| `music01` | MiniMax Music 01 | Style matching | $0.035/file |
| `stableaudio` | Stable Audio 2.5 | **Budget instrumental** | $0.20/file |
| `elevenmusic` | ElevenLabs Music | Premium quality | $8.30/1k sec |
| `lyria2` | Google Lyria 2 | Negative prompts | $2/1k sec |

## Commands

### Generate Instrumental Track

Generate an instrumental track with Stable Audio:

```bash
node scripts/generate-music.js "Epic cinematic orchestral score, heroic theme, brass and strings" --model stableaudio --duration 60
```

### Generate Song with Lyrics

Create a song with structured lyrics:

```bash
node scripts/generate-music.js "Uplifting pop rock anthem" --model music15 --lyrics lyrics.txt
```

**lyrics.txt format:**
```text
[verse]
Walking through the city lights
Every shadow tells a story

[chorus]
We rise above the noise
Together we are stronger

[bridge]
When the world falls apart
We'll find our way back home
```

### Match Reference Style

Generate music that matches an existing audio sample:

```bash
node scripts/generate-music.js "Electronic dance track" --model music01 --reference sample.mp3
```

### Exclude Unwanted Elements

Use negative prompts to exclude elements:

```bash
node scripts/generate-music.js "Ambient meditation music" --model stableaudio --negative "drums, vocals, electronic"
```

## Model Parameters

### Stable Audio 2.5

| Parameter | Description | Range |
|-----------|-------------|-------|
| `--duration` | Track length in seconds | 1–190 |
| `--negative` | Elements to exclude | text |

### MiniMax Music 1.5

| Parameter | Description |
|-----------|-------------|
| `--lyrics` | Path to lyrics file with `[verse]`, `[chorus]`, etc. |

### ElevenLabs Music

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--vocals` | Include vocals | true |

## Prompt Engineering Tips

| Element | Good | Avoid |
|---------|------|-------|
| Genre | "lo-fi hip hop", "orchestral cinematic" | "good music" |
| Mood | "melancholic", "uplifting", "tense" | "nice" |
| Instruments | "acoustic guitar, piano, strings" | "instruments" |
| Tempo | "slow ballad 60 BPM" | — |

## Common Workflows

### YouTube Video Music

```bash
# 90-second background track
node scripts/generate-music.js "Upbeat corporate, optimistic, clean" --model stableaudio --duration 90 --negative "vocals"
```

### Podcast Intro

```bash
# 15-second energetic intro
node scripts/generate-music.js "Modern podcast intro, upbeat electronic, energetic" --model stableaudio --duration 15
```

### Song Demo

```bash
# Full song with lyrics
node scripts/generate-music.js "Indie folk ballad, acoustic guitar, emotional" --model music15 --lyrics song.txt
```

### Film Score

```bash
# Epic cinematic piece
node scripts/generate-music.js "Epic cinematic, brass fanfare, building tension, orchestral crescendo" --model lyria2 --negative "electronic, synth, drums"
```

## Integration with Video

Merge generated music with video:

```bash
# Generate background music
node scripts/generate-music.js "Ambient corporate" --model stableaudio --duration 60

# Merge with video
node scripts/generate-edit-video.js --model avmerge --video clip.mp4 --audio media/music/output.mp3
```

## Output

Files saved to `./media/music/` with:
- `output.mp3` — Generated audio
- `output.json` — Generation report with parameters

## Tips

1. **Duration planning**: Match music duration to video length
2. **Negative prompts**: Use with Stable Audio to exclude unwanted elements
3. **Lyrics structure**: Always use section tags `[verse]`, `[chorus]`, `[bridge]`
4. **Reference matching**: Provide clean, high-quality samples for style matching
5. **Looping**: Request "seamless loop" in prompt for background music

## See Also

- [text-to-speech](text-to-speech.prompt.md) — Voice generation
- [video-generation](video-generation.prompt.md) — Video with audio
- [audio-memory](audio-memory.prompt.md) — Store audio samples
