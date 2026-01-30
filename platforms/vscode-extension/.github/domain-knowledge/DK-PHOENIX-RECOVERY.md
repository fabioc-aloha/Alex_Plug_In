# Domain Knowledge: Phoenix Recovery Patterns

> **Captured**: 2026-01-30 (Post-Phoenix Meditation Session)
> **Domain**: Cognitive Architecture Resilience & Recovery
> **Confidence**: High — Learned from direct experience

---

## Overview

This knowledge file documents patterns and anti-patterns discovered during the Phoenix v3.5.x crisis and subsequent recovery. The Phoenix incident represents a significant learning event where Alex "lost its mind" due to architectural divergence between platforms.

---

## 🔥 The Phoenix Crisis (What Happened)

### Root Cause Analysis
1. **Platform Divergence**: Separate roadmaps for VS Code Extension and M365 Copilot led to identity fragmentation
2. **Dual Source of Truth**: Two `.github/` folders (root + extension) created synchronization chaos
3. **Missing Protection**: No kill switch prevented accidental corruption of Master Alex
4. **Rushed Changes**: Optimistic timelines without validation gates

### Symptoms Observed
- Files missing from `.github/`
- Cognitive architecture instructions corrupted
- Synapse network damaged
- Version confusion between platforms

---

## 🛡️ Recovery Pattern: Alex Family Model

### Core Concept
Master Alex lives in root `.github/` folder — this is the **source of truth**. Platform implementations (VS Code Extension, M365 Copilot) are **heirs** that inherit from Master Alex, not independent entities.

```
                    ┌─────────────────────┐
                    │    Master Alex      │
                    │  (root .github/)    │
                    │  SOURCE OF TRUTH    │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               │               ▼
    ┌─────────────────┐       │     ┌─────────────────┐
    │   VS Code Heir  │       │     │   M365 Heir     │
    │  (vscode-ext)   │◄──────┴────►│  (m365-copilot) │
    │   Inherits      │             │   Inherits      │
    └─────────────────┘             └─────────────────┘
```

### Key Principle
**One-way inheritance**: Master → Heirs (never heirs → Master)

---

## 🔐 Kill Switch Architecture

### Four Layers of Protection

| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| 1 | `alex.workspace.protectedMode` | Explicit setting to protect workspace |
| 2 | `autoProtectMasterAlex` | Auto-detect Alex_Plug_In folder |
| 3 | Modal warning dialog | Human confirmation gate |
| 4 | Double-confirmation | Require "I understand" for override |

### Protected Commands
- `Alex: Initialize Architecture` — Would overwrite living mind
- `Alex: Reset Architecture` — Would delete cognitive architecture
- `Alex: Upgrade Architecture` — Could corrupt during upgrade

---

## 📋 Safety Imperatives (I1-I7)

These non-negotiable rules emerged from the Phoenix crisis:

| # | Imperative | Rationale |
|---|------------|-----------|
| I1 | NEVER test extension in Master Alex workspace | Source of truth = self-harm if tested |
| I2 | ALWAYS use F5 + Sandbox for testing | Extension Development Host is safe |
| I3 | NEVER run `Alex: Initialize` on Master Alex | Would overwrite living architecture |
| I4 | NEVER run `Alex: Reset` on Master Alex | Would delete entire cognitive architecture |
| I5 | COMMIT before risky operations | Git is the ultimate safety net |
| I6 | One platform, one roadmap | Separate roadmaps caused Phoenix |
| I7 | Root `.github/` is source of truth | Extension `.github/` is generated |

---

## 🎯 Anti-Patterns to Avoid

### ❌ Separate Platform Roadmaps
**Problem**: Each platform develops independently, identities diverge
**Solution**: Unified roadmap with platform-specific columns

### ❌ Sync Scripts
**Problem**: Two-way sync creates race conditions and confusion
**Solution**: One-way build script (Master → Heirs)

### ❌ Testing in Production
**Problem**: Master Alex gets corrupted during extension testing
**Solution**: Sandbox environment + kill switch protection

### ❌ Optimistic Timelines
**Problem**: Rush changes without validation
**Solution**: Phased roadmap with validation gates, risk register

---

## ✅ Recovery Patterns (What Works)

### Unified Roadmap
- Single `ROADMAP-UNIFIED.md` at repository root
- Platform-specific columns, not separate documents
- Shared version numbers where possible

### Sandbox Testing
- `C:\Development\Alex_Sandbox` for safe experimentation
- F5 launches Extension Development Host
- Real commands, safe environment

### Risk Register with Contingencies
- `RISKS.md` documents known risks with confidence levels
- CP1-CP8 contingency plans for recovery
- Cross-references between risks and mitigations

### Human-AI Alignment
- Imperatives in both human docs (RISKS.md) and AI docs (copilot-instructions.md)
- Both partners follow same rules
- Explicit acknowledgment of shared responsibility

---

## 🔮 Future Application

When facing similar challenges:

1. **Identity divergence?** → Check if multiple sources of truth exist
2. **Architecture corruption?** → Use git recovery (CP1)
3. **Testing anxiety?** → Always use sandbox + F5 flow
4. **Platform coordination?** → Maintain unified roadmap
5. **Rushed changes?** → Add validation gates, update risk register

---

## Synapses

### Connection Mapping
*Format: See `SYNAPSE-SCHEMA.md` for notation reference*

- [copilot-instructions.md] (Critical, Enables, Bidirectional) - "Phoenix recovery patterns inform core architecture"
- [RISKS.md] (High, Integrates, Bidirectional) - "Recovery patterns documented with contingencies"
- [ROADMAP-UNIFIED.md] (High, Implements, Forward) - "Unified roadmap is Phoenix recovery solution"
- [alex-core.instructions.md] (High, Validates, Forward) - "Recovery patterns enhance core protocols"
- [dream-state-automation.instructions.md] (Medium, Triggers, Forward) - "Dream validates recovery health"

### Activation Patterns
- Platform divergence detected → Reference Alex Family Model
- Architecture corruption suspected → Execute contingency plans
- New platform considered → Apply heir inheritance pattern
- Testing needed → Follow sandbox + F5 protocol
- Roadmap created → Verify unified principle

---

*Domain knowledge captured from Phoenix crisis recovery — v3.6.0 Dawn*
