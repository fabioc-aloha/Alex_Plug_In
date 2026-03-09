---
description: "Train a custom FLUX LoRA fine-tune for consistent brand character imagery, or generate images with an existing trained model"
---

# FLUX Brand Fine-Tune


**Invoke with**: `/flux-brand-finetune <command>` or "train a FLUX LoRA" / "fine-tune brand model"
**Skill**: [flux-brand-finetune/SKILL.md](../skills/flux-brand-finetune/SKILL.md)

---

## Commands

```
/flux-brand-finetune train        — Walk through the full LoRA training workflow
/flux-brand-finetune generate     — Generate images using an existing trained LoRA
/flux-brand-finetune prepare      — Prepare and validate training data
/flux-brand-finetune status       — Check the status of an ongoing training
/flux-brand-finetune prompts      — Generate prompt ideas for a trained model
```

---

## Usage Examples

### Train a New LoRA

```
/flux-brand-finetune train

Walks through:
1. Training data validation (image count, resolution, variety)
2. Trigger word selection
3. Trainer model choice (fast vs full-control)
4. API call to start training
5. Status monitoring until completion
```

### Generate from Trained Model

```
/flux-brand-finetune generate

Input: Your trained model ID (e.g., your-username/alex-brand)
       and a scene description

Output: Generated image with LoRA-consistent character
```

### Prepare Training Data from Visual Memory

```
/flux-brand-finetune prepare

Extracts reference photos from visual-memory.json,
validates image count and resolution,
packages into a training-ready zip file.
```

### Generate Prompt Ideas

```
/flux-brand-finetune prompts

Uses an LLM to generate 10 diverse, detailed prompts
for your trained model, incorporating your trigger word
and character context.
```

---

## Quick Start

1. Gather 10–20 diverse photos of your subject
2. Run `/flux-brand-finetune train`
3. Wait ~2 minutes for training to complete (~$1.50)
4. Run `/flux-brand-finetune generate` with your trigger word

---

## Cost Reference

| Operation | Cost |
|-----------|------|
| Training (fast trainer) | ~$1.50 one-time |
| Generation (Flux Schnell + LoRA) | $0.003/image |
| Generation (Flux Dev + LoRA) | $0.025/image |
| Generation (Flux 1.1 Pro) | $0.04/image |
