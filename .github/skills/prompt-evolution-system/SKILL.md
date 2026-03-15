---
name: prompt-evolution-system
description: Externalized prompt store, A/B testing, metrics-driven evolution, quality gates, and auto-rollback
metadata:
  version: 1.0.0
  category: ai-engineering
  tags: [prompt-evolution, a-b-testing, metrics, prompt-store, versioning, rollback, prompt-management]
  activation:
    triggers: [prompt evolution, a/b test, prompt store, prompt versioning, metrics, prompt rollback, evolution engine]
    context: Working on prompt evolution, A/B testing, prompt metrics, or evolution lifecycle
  prerequisites: []
---

# Prompt Evolution System

Patterns for metrics-driven prompt improvement — externalized storage, A/B testing, quality gates, and auto-rollback.

---

## Three Phases

| Phase | When | Backend | Capability |
|-------|------|---------|-----------|
| **Static** | MVP | `LocalPromptStore` (JSON files) | Fixed prompts, manual edits |
| **Observing** | Month 2+ | `CosmosPromptStore` or DB | Metrics collection, no mutations |
| **Evolving** | Month 3+ | `CosmosPromptStore` or DB | Auto-propose variants, A/B test, promote |

---

## PromptStore Interface

```typescript
interface IPromptStore {
  getPrompt(id: string, variables: Record<string, unknown>): Promise<ResolvedPrompt>;
  getVariants(id: string): Promise<PromptVariant[]>;
  recordExecution(id: string, metrics: ExecutionMetrics): Promise<void>;
  promoteVariant(id: string, variantId: string): Promise<void>;
  rollback(id: string, toVersion: string): Promise<void>;
}

// Both LocalPromptStore and CosmosPromptStore implement this interface
// Swap is transparent — controlled by environment config
```

---

## Metrics Framework

| Category | Metrics | Purpose |
|----------|---------|---------|
| **Engagement** | session_length, actions_per_minute, return_rate | User interest |
| **Quality** | coherence_score, factual_accuracy, response_relevance | Output quality |
| **Persona** | persona_consistency, tone_rating, helpfulness | Character voice (if applicable) |
| **Task** | task_completion_rate, time_to_complete, accuracy | Core task metrics |
| **CX** | error_rate, timeout_rate, retry_count | Technical quality |
| **Cost** | tokens_per_request, cost_per_session, latency_p95 | Operational efficiency |

```typescript
interface ExecutionMetrics {
  promptId: string;
  variantId?: string;
  timestamp: number;
  latency: number;         // ms
  tokenCount: number;
  modelUsed: string;
  qualityScore?: number;   // 0-1, from automated evaluation
  userFeedback?: number;   // 1-5 star rating (if collected)
}
```

---

## Evolution Lifecycle

```
Observe → Analyze → Propose → A/B Test → Evaluate → Promote or Rollback
```

### Thresholds

| Executions | Stage | Action |
|-----------|-------|--------|
| 0-25 | Observe | Collect baseline metrics only |
| 25-50 | Identify | Flag underperforming prompts (below median) |
| 50-100 | Propose | EvolutionEngine generates improvement variants |
| 100+ | A/B Test | Run variant against baseline (50/50 split) |
| 200+ | Evaluate | Statistical significance test (p < 0.05) |
| Significant | Decide | If variant > baseline by 5%+: promote. Else: discard |

### EvolutionEngine Interface

```typescript
interface IEvolutionEngine {
  analyzePerformance(promptId: string): Promise<PerformanceReport>;
  proposeVariant(promptId: string, direction: EvolutionDirection): Promise<PromptVariant>;
  startABTest(promptId: string, variantId: string): Promise<ABTestConfig>;
  evaluateTest(testId: string): Promise<ABTestResult>;
  promote(promptId: string, variantId: string): Promise<void>;
  rollback(promptId: string): Promise<void>;
}

type EvolutionDirection =
  | 'more_engaging'       // increase user interaction
  | 'more_concise'        // reduce token usage
  | 'more_character'      // strengthen persona voice
  | 'more_accurate'       // improve factual consistency
  | 'better_guidance'     // more helpful without spoiling
  | 'locale_optimize';    // improve non-English prompts
```

---

## Quality Gate

All evolved prompts must pass quality validation before promotion:

```typescript
async function qualityGate(
  original: ResolvedPrompt,
  variant: ResolvedPrompt,
): Promise<QualityGateResult> {
  // 1. Generate sample outputs from each prompt
  // 2. Compare quality scores
  // 3. Check for persona drift (if applicable)
  // 4. If drift > threshold: REJECT variant
  // 5. If quality improvement + consistency maintained: APPROVE

  return {
    approved: qualityDelta > 0.05 && driftScore < DRIFT_THRESHOLD,
    qualityDelta,
    driftScore,
    reason: string,
  };
}
```

---

## Safety Guards

| Guard | What It Prevents |
|-------|-----------------|
| **Rate limiter** | Max 1 evolution per prompt per week |
| **Rollback trigger** | Quality drop > 10% after promotion → auto-rollback |
| **Safety lock** | Evolution cannot modify safety rules |
| **System prompt lock** | Evolution cannot modify instruction hierarchy |
| **Quality gate** | Evolution cannot drift persona or reduce quality |

---

## Implementation Checklist

### Phase 1: Static

- [ ] Define prompt templates in JSON/YAML files
- [ ] Implement `LocalPromptStore` with variable interpolation
- [ ] Add basic execution logging (latency, token count)
- [ ] Establish baseline metrics for each prompt

### Phase 2: Observing

- [ ] Migrate to persistent store (Cosmos DB, PostgreSQL, etc.)
- [ ] Add comprehensive metrics collection
- [ ] Build performance dashboard
- [ ] Identify underperforming prompts manually

### Phase 3: Evolving

- [ ] Implement `EvolutionEngine` with AI-assisted variant generation
- [ ] Add A/B testing infrastructure (traffic splitting, metric comparison)
- [ ] Implement statistical significance testing
- [ ] Add auto-rollback on quality regression
- [ ] Deploy quality gate for all promotions

---

## Activation Patterns

| Trigger | Response |
|---------|----------|
| "prompt evolution", "prompt versioning" | Full skill activation |
| "A/B testing", "prompt testing" | Evolution Lifecycle + Thresholds |
| "prompt metrics", "prompt quality" | Metrics Framework section |
| "prompt rollback", "quality regression" | Safety Guards section |
| "prompt store", "externalize prompts" | PromptStore Interface section |
