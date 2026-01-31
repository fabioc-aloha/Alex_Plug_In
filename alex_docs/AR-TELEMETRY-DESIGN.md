# Appropriate Reliance Telemetry Design

> Research instrumentation for validating AIRS-18 hypotheses through Alex heirs

**Status**: Proposed | **Version**: 0.1 | **Date**: January 31, 2026

---

## Research Objective

Instrument Alex heirs (VS Code extension, M365 agent) to collect behavioral telemetry that can validate the AIRS-18 Appropriate Reliance (AR) hypotheses.

## Hypotheses to Validate

| # | Hypothesis | Telemetry Approach |
|---|------------|-------------------|
| H3 | AR positively predicts Behavioral Intention | Correlate AR score with actual usage frequency |
| H4 | AR provides incremental validity beyond AIRS-16 | Compare AR vs TR correlations with behavioral outcomes |
| H5 | AR moderates TR→BI | Interaction analysis: TR × AR → usage patterns |
| H6 | AR mediates Experience→BI | Track experience growth → calibration improvement → adoption |

---

## Behavioral Proxies for CAIR/CSR

### CAIR (Correct AI-Reliance) Indicators

User appropriately relies on AI when AI is correct:

| Behavior | Telemetry Event | Interpretation |
|----------|-----------------|----------------|
| Accepts suggestion quickly | `suggestion_accepted` + short `decision_time` | Confident reliance |
| Uses `/creative` for ideation | `command_creative` | Mode-appropriate reliance |
| Applies code without major edits | `code_applied` + low `edit_distance` | Trusts correct output |
| Returns to Alex for similar tasks | `repeat_task_pattern` | Learned appropriate use cases |

### CSR (Correct Self-Reliance) Indicators

User appropriately relies on self when AI is wrong:

| Behavior | Telemetry Event | Interpretation |
|----------|-----------------|----------------|
| Uses `/verify` command | `command_verify` | Active verification |
| Rejects or heavily edits suggestion | `suggestion_rejected` or high `edit_distance` | Appropriate skepticism |
| Challenges Alex's response | `user_correction` (detectable phrases) | Catches errors |
| Checks external sources after response | `external_link_click` (if trackable) | Verification behavior |
| Time spent reviewing before accepting | Long `decision_time` on complex tasks | Deliberate evaluation |

### Miscalibration Indicators (Anti-patterns)

| Pattern | Interpretation | Detection |
|---------|----------------|-----------|
| Always accepts quickly | Potential over-reliance | Low variance in `decision_time` |
| Never uses `/verify` | Under-verification | Zero `command_verify` events |
| Always rejects | Potential under-reliance | High `suggestion_rejected` rate |
| Immediate corrections after acceptance | Over-reliance revealed | `code_applied` followed quickly by `user_edit` |

---

## Proposed Telemetry Events

### New Event Types

```typescript
interface ARTelemetryEvent extends TelemetryEvent {
  category: "ar-research"; // New category for AR research
  event: AREventType;
  data: AREventData;
}

type AREventType =
  // Reliance decisions
  | "suggestion_presented"
  | "suggestion_accepted"
  | "suggestion_rejected"
  | "suggestion_modified"
  // Mode awareness
  | "mode_switch_epistemic"
  | "mode_switch_creative"
  | "command_verify"
  | "command_creative"
  // Calibration signals
  | "user_correction"
  | "user_challenge"
  | "verification_requested"
  // Outcome tracking
  | "undo_after_accept"
  | "error_after_accept"
  | "success_confirmed";

interface AREventData {
  // Context
  taskType?: "code" | "explanation" | "creative" | "factual";
  complexityEstimate?: "low" | "medium" | "high";

  // Decision metrics
  decisionTimeMs?: number;
  suggestionLength?: number;
  editDistance?: number; // Levenshtein distance if modified

  // Confidence signals (from Alex's response)
  alexConfidenceLevel?: "high" | "medium" | "low" | "uncertain";
  alexUsedHedging?: boolean;
  alexFlaggedHumanJudgment?: boolean;

  // User session context
  sessionInteractionCount?: number;
  userExperienceLevel?: "new" | "moderate" | "experienced"; // Based on usage history

  // AIRS linkage (opt-in)
  airsParticipantId?: string; // Anonymous ID to link with AIRS scores
}
```

### Privacy-Preserving Design

| Principle | Implementation |
|-----------|----------------|
| **Opt-in only** | Explicit consent flow before any AR telemetry |
| **Local-first** | All data stored locally by default |
| **Anonymized** | No PII, file paths sanitized, content hashed not stored |
| **User-controlled** | View, export, delete via "Alex: View Research Data" |
| **Research consent** | Separate consent for contributing to AIRS-18 validation |

---

## Implementation Plan

### Phase 1: Infrastructure (Low Risk)

Add AR telemetry events to existing telemetry.ts:

```typescript
// New function for AR-specific logging
export function logAREvent(
  event: AREventType,
  data: AREventData
): void {
  if (!isARResearchEnabled()) return; // Respect opt-in

  log("ar-research", event, {
    ...data,
    // Auto-enrich with session context
    sessionInteractionCount: getSessionInteractionCount(),
    userExperienceLevel: getUserExperienceLevel(),
  });
}

// Check if user has opted into AR research
function isARResearchEnabled(): boolean {
  return vscode.workspace
    .getConfiguration("alex")
    .get("research.appropriateReliance.enabled", false);
}
```

### Phase 2: Event Instrumentation

#### In participant.ts (Chat Participant)

```typescript
// Track suggestion presentation
stream.markdown(response);
logAREvent("suggestion_presented", {
  taskType: classifyTaskType(request.prompt),
  suggestionLength: response.length,
  alexConfidenceLevel: extractConfidenceLevel(response),
  alexUsedHedging: detectHedgingLanguage(response),
});

// Track /verify command usage
async function handleVerifyCommand(...) {
  logAREvent("command_verify", {
    taskType: "verification",
    sessionInteractionCount: getSessionCount(),
  });
  // ... existing logic
}

// Track /creative command usage
async function handleCreativeCommand(...) {
  logAREvent("command_creative", {
    taskType: "creative",
  });
  // ... existing logic
}
```

#### Decision Time Tracking

```typescript
// Track time between suggestion and user action
let suggestionPresentedAt: number | null = null;

function onSuggestionPresented() {
  suggestionPresentedAt = Date.now();
}

function onUserAction(action: "accepted" | "rejected" | "modified") {
  if (suggestionPresentedAt) {
    const decisionTimeMs = Date.now() - suggestionPresentedAt;
    logAREvent(`suggestion_${action}`, {
      decisionTimeMs,
      // ... other data
    });
    suggestionPresentedAt = null;
  }
}
```

### Phase 3: AIRS Integration (Opt-in Research)

```typescript
// Link telemetry to AIRS scores for research participants
interface AIRSResearchConsent {
  participantId: string; // Anonymous UUID
  airsScore?: number;
  arScore?: number; // If AIRS-18 items administered
  trScore?: number;
  consentedAt: string;
}

// User flow:
// 1. Take AIRS assessment at airs.correax.com
// 2. Get anonymous participant ID
// 3. Enter ID in VS Code: "Alex: Join AIRS Research"
// 4. Telemetry is linked for analysis
```

---

## Technical Viability Assessment

**Assessment Date**: January 31, 2026 | **Status**: ✅ Viable

### Existing Infrastructure Analysis

Code review of `telemetry.ts` and `participant.ts` confirms the extension already has robust telemetry infrastructure:

| Component | Status | Location |
|-----------|--------|----------|
| Telemetry init/logging | ✅ Exists | `telemetry.ts:initTelemetry()`, `log()` |
| Event categories | ✅ Extensible | Add `"ar-research"` to existing pattern |
| Timed operations | ✅ Exists | `logTimed()` for decision_time tracking |
| Privacy sanitization | ✅ Exists | `sanitizeData()` strips file paths |
| Local storage | ✅ Exists | `context.globalState` used throughout |
| Settings-based gating | ✅ Exists | Pattern: `getConfig('setting', default)` |

### Implementation Effort by Phase

| Phase | Effort | Risk | Notes |
|-------|--------|------|-------|
| **Phase 1: Command tracking** | 1-2 days | Low | Add `logAREvent()` calls to existing `/verify`, `/creative` handlers |
| **Phase 2: Proxy metrics** | 3-5 days | Medium | Hedging detection (regex), response characteristic extraction |
| **Phase 3: AIRS integration** | 1 week | Low | New command, participant ID storage, opt-in UI |

### What Already Works

```typescript
// Existing patterns we can leverage:
telemetry.log("category", "event", { data });           // ✅ Direct use
telemetry.logTimed("category", "event", async () => {}); // ✅ For timing
context.globalState.update("key", value);               // ✅ For participant ID
vscode.workspace.getConfiguration("alex").get("key");   // ✅ For opt-in setting
```

### Gaps to Address

| Gap | Workaround | Effort |
|-----|------------|--------|
| No direct accept/reject API | Track via file changes post-response | Medium |
| Edit distance calculation | Use simple diff library or VS Code's built-in | Low |
| Hedging language detection | Regex patterns for uncertainty markers | Low |
| Human judgment flags | Detect phrases like "you should verify" | Low |

### VS Code API Limitations

The VS Code chat participant API does **not** expose:
- Whether user applied code suggestions
- Copy/paste events from chat
- Direct accept/reject signals

**Proxy solution**: Track via document change events after response, measuring time-to-edit and edit patterns.

### Recommended First PR (Phase 1)

Low-risk additions that work today:

1. Add `alex.research.appropriateReliance.enabled` setting to `package.json`
2. Add `logAREvent()` function to `telemetry.ts`
3. Add telemetry calls to `/verify` and `/creative` command handlers
4. Add response characteristic extraction (confidence level, hedging detection)

**Estimated effort**: 1-2 days, no breaking changes.

---

## Analysis Plan

### Calculating Behavioral AR Score

```python
def calculate_behavioral_ar(events: List[AREvent]) -> float:
    """
    Calculate AR score from behavioral telemetry.
    Range: 0-1, where 1 = perfect calibration
    """

    # CAIR indicators (appropriate acceptance)
    appropriate_accepts = count_appropriate_accepts(events)
    total_accepts = count_total_accepts(events)
    cair_rate = appropriate_accepts / total_accepts if total_accepts > 0 else 0

    # CSR indicators (appropriate rejection/verification)
    verify_commands = count_event(events, "command_verify")
    corrections_caught = count_event(events, "user_correction")
    over_reliance_incidents = count_event(events, "undo_after_accept")

    csr_score = (verify_commands + corrections_caught) / (
        verify_commands + corrections_caught + over_reliance_incidents + 1
    )

    # Combined AR score
    return (cair_rate + csr_score) / 2
```

### Hypothesis Testing

```python
# H3: AR predicts Behavioral Intention (actual usage)
correlation(self_reported_ar, usage_frequency)
correlation(behavioral_ar, usage_frequency)

# H4: AR incremental validity beyond AIRS-16
model1 = regression(BI ~ PE + EE + SI + FC + HM + PV + HB + TR)
model2 = regression(BI ~ PE + EE + SI + FC + HM + PV + HB + TR + AR)
delta_r_squared = model2.r_squared - model1.r_squared

# H5: AR moderates TR
model3 = regression(BI ~ TR * AR)  # Interaction term

# H6: AR mediates Experience → BI
mediation_analysis(Experience -> AR -> BI)
```

---

## M365 Copilot Agent Considerations

The M365 heir has different instrumentation options:

| Aspect | VS Code | M365 |
|--------|---------|------|
| Telemetry API | VS Code extension API | Microsoft Graph / Application Insights |
| User actions | Code accept/reject | Document edits, email actions |
| Commands | `/verify`, `/creative` | Natural language equivalents |
| Privacy | Local storage | Microsoft compliance requirements |

### M365 Behavioral Proxies

| CAIR Indicator | Detection |
|----------------|-----------|
| Uses Alex suggestions in documents | Track suggestion → document insertion |
| Forwards Alex-drafted emails | Track draft → send pattern |
| Schedules Alex-suggested meetings | Track suggestion → calendar action |

| CSR Indicator | Detection |
|---------------|-----------|
| Asks clarifying questions | Detect "are you sure" patterns |
| Edits Alex output before using | Track suggestion → edit → use |
| Explicitly requests verification | "Can you verify this?" |

---

## Ethical Considerations

### IRB Requirements

For formal research:

1. **Informed Consent**: Clear explanation of data collection
2. **Right to Withdraw**: Easy opt-out at any time
3. **Data Minimization**: Collect only what's needed
4. **Anonymization**: No way to re-identify participants
5. **Benefit/Risk Analysis**: Research value vs. privacy cost

### Microsoft Research Guidelines

- Follow Microsoft Responsible AI principles
- GDPR/CCPA compliance for telemetry
- Internal review for employee data collection

---

## Configuration Schema

```json
{
  "alex.research.appropriateReliance.enabled": {
    "type": "boolean",
    "default": false,
    "description": "Enable Appropriate Reliance research telemetry (anonymous, local-only)"
  },
  "alex.research.appropriateReliance.contributeToStudy": {
    "type": "boolean",
    "default": false,
    "description": "Contribute anonymized data to AIRS-18 validation study"
  },
  "alex.research.appropriateReliance.participantId": {
    "type": "string",
    "default": "",
    "description": "Anonymous participant ID from airs.correax.com (for study linking)"
  }
}
```

---

## Rollout Plan

| Phase | Timeline | Scope |
|-------|----------|-------|
| **1. Design Review** | Week 1 | This document + feedback |
| **2. Infrastructure** | Week 2-3 | Add AR telemetry framework |
| **3. VS Code Instrumentation** | Week 4-5 | Instrument chat participant |
| **4. Local Testing** | Week 6 | Validate events fire correctly |
| **5. Opt-in Beta** | Week 7-8 | Enable for research volunteers |
| **6. AIRS Integration** | Week 9-10 | Link with airs.correax.com |
| **7. Data Collection** | Months 3-6 | Collect for validation study |
| **8. Analysis** | Month 7 | Validate hypotheses |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Opt-in rate | >10% of active users |
| Events per session | 5-20 AR events (not too noisy) |
| Data quality | <5% missing required fields |
| AIRS linkage | >50 participants with both scores |
| H3-H6 validation | p < .05 for at least 2 hypotheses |

---

## References

- [SKILL.md](.github/skills/airs-appropriate-reliance/SKILL.md) - AIRS research knowledge
- [telemetry.ts](platforms/vscode-extension/src/shared/telemetry.ts) - Existing telemetry infrastructure
- [participant.ts](platforms/vscode-extension/src/chat/participant.ts) - Chat participant to instrument
- [APPROPRIATE-RELIANCE-TECHNICAL-BRIEF.md](article/APPROPRIATE-RELIANCE-TECHNICAL-BRIEF.md) - AR theoretical foundation

---

*This design enables empirical validation of the AR construct through behavioral measurement, complementing the self-report AIRS-18 items.*
