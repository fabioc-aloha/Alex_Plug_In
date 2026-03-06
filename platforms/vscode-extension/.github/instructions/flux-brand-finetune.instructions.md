---
applyTo: "**/*lora*,**/*finetune*,**/*fine-tune*,**/*train*image*,**/*brand*train*"
description: "FLUX LoRA fine-tuning on Replicate — training data prep, trigger words, model creation, and inference with trained models"
---

# FLUX Brand Fine-Tune Instructions

## When to Fine-Tune vs Use Reference Images

- **< 50 images needed** → Use `nano-banana-pro` with `image_input` references (no training required)
- **50+ images across campaigns** → Fine-tune a LoRA (~$1.50 one-time, then $0.003–0.04/image)
- **Style consistency (not face)** → Fine-tune with `lora_type: "style"`

## Training Quick Reference

1. **Gather** 10–20 images of subject (varied angles, lighting, expressions, clothing)
2. **Zip** them: `Compress-Archive -Path "training-data/*" -DestinationPath "training-data.zip"`
3. **Choose trigger word**: unique non-word like `ALEXFNCH` (NOT `TOK`, NOT a real word)
4. **Train** via `replicate/fast-flux-trainer` (~$1.50, ~2 minutes)
5. **Generate** using `your-username/model-name` with trigger word in prompt

## Critical Rules

- Trigger word must NOT be `TOK` — causes clashes with other LoRAs
- Training images must be 1024×1024+ resolution
- Output URLs expire after 1 hour — save generated images immediately
- Training data of real people is PII — use private models
- Store `REPLICATE_API_TOKEN` in SecretStorage, never hardcode

## Prompt Pattern for Trained Models

```
TRIGGER_WORD [scene], [clothing], [expression], [lighting], [style suffix]
```

- Lead with trigger word — always first in prompt
- Don't describe physical features — the LoRA handles identity
- Be specific about scene, mood, and setting

## Full Skill Reference

Read `.github/skills/flux-brand-finetune/SKILL.md` for complete training workflow, parameters, cost analysis, and troubleshooting.
