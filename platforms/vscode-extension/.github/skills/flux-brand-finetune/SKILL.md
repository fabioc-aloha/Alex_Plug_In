---
name: "flux-brand-finetune"
description: "Train and manage custom FLUX LoRA fine-tunes on Replicate for consistent brand character imagery"
metadata:
  inheritance: inheritable
---

# FLUX Brand Fine-Tune

> Train custom LoRA models on FLUX Dev for consistent Alex (or any character) imagery across all generated content.

**Pattern**: Train once with 10–20 curated images → get a trigger-word-activated LoRA → generate unlimited consistent images at ~$0.003–0.04/image.

---

## Why Fine-Tune?

| Approach | Consistency | Cost/Image | Setup Cost | Best For |
|----------|-------------|------------|------------|----------|
| **Nano-Banana Pro** (reference images) | Good | $0.025 | Free | Quick one-off sets |
| **Flux 2 Pro** (input_images) | Good | ~$0.05 | Free | Multi-ref scenes |
| **FLUX LoRA Fine-Tune** | Excellent | $0.003–0.04 | ~$1.50 | Brand-scale consistency |

Fine-tuning wins when you need hundreds of images across marketing, docs, presentations, and social media — all with the same character looking exactly the same without passing reference images every time.

---

## Trainer Models

| Trainer | Replicate ID | Hardware | Cost | Training Time | Notes |
|---------|-------------|----------|------|---------------|-------|
| **Fast FLUX Trainer** (recommended) | `replicate/fast-flux-trainer` | 8× H100 | ~$0.0122/sec (~$1.50 total) | ~2 min | Newer, faster, subject/style selector |
| **FLUX Dev LoRA Trainer** | `ostris/flux-dev-lora-trainer` | H100 | ~$0.001525/sec (~$0.98 total) | ~10 min | Original trainer, more parameters |

**Recommendation**: Use `replicate/fast-flux-trainer` for most use cases — faster, cheaper, simpler.

---

## Training Data Requirements

### Image Guidelines

| Spec | Recommendation |
|------|----------------|
| **Quantity** | 10–20 images (minimum 10, sweet spot 15–20) |
| **Resolution** | 1024×1024 or higher (will be scaled down) |
| **Formats** | WebP, JPG, PNG |
| **Variety** | Different angles, lighting, expressions, settings, clothing |
| **Consistency** | Same character/subject across all images — same age, same identity |

### For Character/Subject LoRAs

- Include varied backgrounds (indoor, outdoor, studio, natural)
- Show different facial expressions (neutral, smiling, serious, thoughtful)
- Use different clothing styles
- Mix lighting conditions (natural, studio, dramatic)
- **Avoid**: different haircuts or ages, excessive hand-near-face poses

### For Style LoRAs

- Select images highlighting the distinctive style features
- Use varied subjects while keeping style consistent
- Avoid datasets where certain elements dominate

### Optional: Custom Captions

Place a `.txt` file alongside each image with the same name:

```
alex-front.jpg      → alex-front.txt
alex-profile.jpg    → alex-profile.txt
alex-outdoor.jpg    → alex-outdoor.txt
```

If captions aren't provided, the trainer auto-generates them using LLaVA.

---

## Trigger Word Selection

The trigger word activates your LoRA concept in prompts.

**Rules**:
- Must be unique — NOT a real word in any language
- NOT `TOK` (clashes with other fine-tunes)
- Case-insensitive but ALL CAPS helps visually
- Short, memorable

**Examples**:
- `ALEXFNCH` — Alex Finch character
- `CXRBRAND` — CorreaX brand style
- `ALEXCOG` — Alex cognitive architecture style

---

## Training Workflow

### Step 1: Prepare Training Data

```powershell
# Create a training data folder
New-Item -ItemType Directory -Path "training-data" -Force

# Optionally resize images to 1024px (if oversized)
# Requires ImageMagick: winget install ImageMagick.ImageMagick
Get-ChildItem training-data/*.jpg, training-data/*.png | ForEach-Object {
    magick $_.FullName -resize "1024x1024>" $_.FullName
}

# Zip the training data
Compress-Archive -Path "training-data/*" -DestinationPath "training-data.zip" -Force
```

### Step 2: Upload Training Data

Upload the zip to a publicly accessible URL, or use the Replicate web UI to upload directly.

```javascript
import { readFileSync } from "fs";

// Option A: Use Replicate's file upload
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
// Upload via the web UI at https://replicate.com/replicate/fast-flux-trainer/train

// Option B: Use any file hosting (S3, Azure Blob, etc.)
// The URL must be publicly accessible during training
```

### Step 3: Create Training via API

```javascript
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const training = await replicate.trainings.create(
  "replicate",           // model owner
  "fast-flux-trainer",   // model name
  "8b10794665aed907bb98a1a5324cd1d3a8bea0e9b31e65210967fb9c9e2e08ed",  // version
  {
    destination: "your-username/alex-brand",  // your model destination
    input: {
      input_images: "https://your-storage.com/training-data.zip",
      trigger_word: "ALEXFNCH",
      lora_type: "subject",           // "subject" or "style"
      // training_steps: 1000,        // default 1000, range 500–4000
    }
  }
);

console.log("Training started:", training.id);
console.log("Status URL:", training.urls.get);
```

### Step 3 (Alternative): Create Training via curl

```bash
curl -X POST \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "your-username/alex-brand",
    "input": {
      "input_images": "https://your-storage.com/training-data.zip",
      "trigger_word": "ALEXFNCH",
      "lora_type": "subject"
    }
  }' \
  https://api.replicate.com/v1/models/replicate/fast-flux-trainer/versions/8b10794665aed907bb98a1a5324cd1d3a8bea0e9b31e65210967fb9c9e2e08ed/trainings
```

### Step 4: Monitor Training

```javascript
// Poll for status
const status = await replicate.trainings.get(training.id);
console.log("Status:", status.status);  // starting → processing → succeeded/failed
```

```bash
# Or via curl
curl -s \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  https://api.replicate.com/v1/trainings/<training_id>
```

Training typically completes in ~2 minutes with the fast trainer.

### Step 5: Generate Images with Your LoRA

Once training succeeds, your model is live at the destination:

```javascript
const output = await replicate.run(
  "your-username/alex-brand",  // your trained model
  {
    input: {
      prompt: "ALEXFNCH standing in a modern office, wearing a casual blue shirt, " +
              "confident smile, natural lighting, professional photography, 8k detail",
      aspect_ratio: "3:4",
      output_format: "png",
    }
  }
);

// Save immediately — output URLs expire after 1 hour
import { writeFile } from "node:fs/promises";
await writeFile("alex-office.png", output);
```

---

## Advanced Training Parameters

### ostris/flux-dev-lora-trainer (Full Control)

| Parameter | Default | Range | Notes |
|-----------|---------|-------|-------|
| `steps` | 1000 | 3–6000 | 500–4000 recommended |
| `lora_rank` | 16 | 1–128 | Higher = more complex features, slower training |
| `autocaption` | true | — | Uses LLaVA v1.5 13B for auto-captioning |
| `autocaption_prefix` | — | — | e.g., "a photo of ALEXFNCH, " |
| `autocaption_suffix` | — | — | e.g., " in the style of ALEXFNCH" |
| `hf_repo_id` | — | — | Optional: also push to HuggingFace |

### replicate/fast-flux-trainer (Recommended)

| Parameter | Default | Notes |
|-----------|---------|-------|
| `trigger_word` | "TOK" | Your unique trigger word |
| `lora_type` | — | "subject" or "style" |
| `training_steps` | 1000 | Adjust for dataset size |
| `input_images` | — | Zip file URL or direct upload |

---

## Using Your LoRA with Other Flux Models

Your trained LoRA weights can be used with any Flux model that supports LoRA:

```javascript
// Use with Flux Dev (good quality, $0.025/image)
const output = await replicate.run("black-forest-labs/flux-dev", {
  input: {
    prompt: "ALEXFNCH in a coffee shop, reading a book",
    extra_lora: "your-username/alex-brand",
    extra_lora_scale: 1.0,   // 0.0–1.5, default 1.0
  }
});

// Use with Flux Schnell (fast iteration, $0.003/image)
const output = await replicate.run("black-forest-labs/flux-schnell", {
  input: {
    prompt: "ALEXFNCH giving a presentation",
    extra_lora: "your-username/alex-brand",
  }
});
```

### LoRA Scale Tuning

| Scale | Effect |
|-------|--------|
| 0.5 | Subtle influence — blends with base model |
| 0.8 | Moderate — recognizable but flexible |
| 1.0 | Full — strong character likeness (default) |
| 1.2–1.5 | Over-fitted — may reduce prompt adherence |

---

## Cost Analysis

| Operation | Cost | Notes |
|-----------|------|-------|
| Training (fast-flux-trainer) | ~$1.50 | One-time, ~2 minutes |
| Training (ostris) | ~$0.98 | One-time, ~10 minutes |
| Generation (Flux Schnell + LoRA) | $0.003/image | Best for iteration |
| Generation (Flux Dev + LoRA) | $0.025/image | Best for quality |
| Generation (Flux 1.1 Pro) | $0.04/image | Highest quality |

**Break-even vs Nano-Banana Pro**: After ~70 images ($0.025 × 70 = $1.75 > $1.50 training), the fine-tune pays for itself and every subsequent image costs only $0.003–0.025 without needing reference photos.

---

## Prompt Engineering for Fine-Tuned Models

### Template

```
TRIGGER_WORD [description of scene], [clothing], [expression], [lighting], [style]
```

### Best Practices

1. **Always lead with trigger word**: `ALEXFNCH standing in a park` not `A person standing in a park named ALEXFNCH`
2. **Be specific about scene**: FLUX follows detailed prompts well
3. **Don't describe physical features**: The LoRA handles identity — describe scene, clothing, mood
4. **Use quality tokens**: "professional photography", "8k detail", "cinematic lighting"

### Example Prompts

```
ALEXFNCH headshot, professional business attire, confident smile, studio lighting, corporate portrait photography

ALEXFNCH sitting at a desk with multiple monitors, coding, casual hoodie, night time, ambient screen glow, documentary photography

ALEXFNCH presenting at a tech conference, standing on stage, gesturing toward a screen, audience in background, event photography

ALEXFNCH in a cozy library, reading a leather-bound book, warm lamplight, bokeh background, editorial photography
```

---

## Visual Verification (VS Code 1.112+)

After generating with your LoRA, use `view_image` to evaluate output quality:

1. **Identity fidelity** — Does the character match the training data?
2. **Prompt adherence** — Does the scene match the prompt, or is the LoRA overfitting?
3. **LoRA scale tuning** — Compare outputs at 0.6, 0.8, 1.0 to find the sweet spot
4. **Artifact scan** — Check for training artifacts: repeated backgrounds, frozen expressions, texture smearing

When iterating on LoRA scale or prompt structure, compare outputs side-by-side via the image carousel.

---

## Retraining and Iteration

### When to Retrain

- Character design changed significantly
- Original training data was insufficient (< 10 images)
- Want to add new scenarios not well-represented
- Trigger word conflicts with another LoRA

### Iteration Strategy

1. Generate 10 test images with varied prompts
2. Evaluate: Does the face/identity hold across scenes?
3. If weak: add more training images in the weak areas
4. Retrain with expanded dataset (training is cheap at ~$1.50)

---

## Integration with Visual Memory

If you have a visual-memory.json with reference photos, extract the base64 images back to files for training:

```javascript
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const vmPath = ".github/skills/<skill>/visual-memory/visual-memory.json";
const vm = JSON.parse(readFileSync(vmPath, "utf8"));

// Extract images from visual memory for training
Object.entries(vm.subjects).forEach(([name, subject]) => {
  subject.images.forEach((img, i) => {
    const base64 = img.dataUri.split(",")[1];
    const buffer = Buffer.from(base64, "base64");
    writeFileSync(join("training-data", `${name}-${i}.jpg`), buffer);
  });
});
```

---

## Security Considerations

- Training images of real people are PII — use private models on Replicate
- Store `REPLICATE_API_TOKEN` in VS Code SecretStorage, not in code
- Output URLs expire after 1 hour — save generated images immediately
- Keep training data zip in a secure location, not in public repos
- Fine-tuned model can be set to private on Replicate

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Character doesn't look consistent | Too few training images | Use 15–20 images with varied angles |
| LoRA overfitting (ignores prompts) | Steps too high | Reduce to 500–1000 steps |
| Trigger word doesn't activate | Word too common | Choose a unique non-word like `ALEXFNCH` |
| Training fails | Images too small | Use 1024×1024+ resolution |
| Output looks nothing like training | Caption mismatch | Add manual captions with trigger word |
| `extra_lora` not working | Wrong model format | Use Replicate model ID: `username/model-name` |
