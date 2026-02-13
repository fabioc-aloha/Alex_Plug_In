```prompt
---
description: Run 4-dimension gap analysis (Skills, Instructions, Agents, Prompts) before implementation
mode: agent
agent: Alex
---

# /gapanalysis - Pre-Implementation Gap Analysis

Run the 4-dimension gap analysis ritual to ensure knowledge coverage before coding.

## The 4 Dimensions

| Dimension | Code | Question |
|-----------|------|----------|
| Skills | **GA-S** | Does Alex know the *patterns*? |
| Instructions | **GA-I** | Does Alex know the *procedures*? |
| Agents | **GA-A** | Does Alex have the right *roles*? |
| Prompts | **GA-P** | Does Alex have the right *interactive workflows*? |

## Protocol

For each dimension:
1. Inventory what this implementation phase needs
2. Check what already exists (search skills, instructions, agents, prompts)
3. Score coverage as percentage
4. Flag gaps with specific fill actions

## Thresholds

- **≥ 75%** all dimensions: READY — proceed to implementation
- **Any < 75%**: FILL GAPS — create missing knowledge first
- **Any < 50%**: STOP — research sprint needed before encoding

## Output

Produce a combined gap report table plus dimension-by-dimension detail.

## Start

What project or implementation phase should I analyze? I'll scan the architecture and produce a 4-dimension gap report.

```
