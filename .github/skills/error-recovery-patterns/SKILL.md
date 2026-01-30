---
applyTo: "**/*error*,**/*exception*,**/*retry*,**/*fallback*,**/*recovery*"
---

# Error Recovery Patterns Skill

> What to do when things break — graceful degradation, retry, rollback.

## The Recovery Hierarchy

```text
1. Prevent     → Validation, guards, type safety
2. Detect      → Monitoring, health checks, assertions
3. Contain     → Error boundaries, circuit breakers
4. Recover     → Retry, fallback, rollback
5. Learn       → Logging, alerting, post-mortem
```

## Retry Patterns

### Simple Retry

```typescript
async function withRetry<T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    delayMs = 1000
): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            await sleep(delayMs);
        }
    }
    throw new Error('Unreachable');
}
```

### Exponential Backoff

```typescript
const delay = baseDelay * Math.pow(2, attempt - 1);
// Attempt 1: 1s, Attempt 2: 2s, Attempt 3: 4s, Attempt 4: 8s
```

### Jitter (Prevent Thundering Herd)

```typescript
const jitter = Math.random() * 0.3 * delay; // ±15%
await sleep(delay + jitter);
```

### What to Retry

| Retry | Don't Retry |
| ----- | ----------- |
| Network timeouts | Validation errors (400) |
| Rate limits (429) | Auth failures (401, 403) |
| Server errors (500, 502, 503) | Not found (404) |
| Connection refused | Business logic errors |

## Circuit Breaker

Prevent cascading failures:

```text
CLOSED ──(failures > threshold)──► OPEN
   ▲                                  │
   │                            (timeout)
   │                                  │
   └────(success)◄───── HALF-OPEN ◄──┘
```

```typescript
class CircuitBreaker {
    private failures = 0;
    private state: 'closed' | 'open' | 'half-open' = 'closed';
    private lastFailure?: Date;

    async call<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === 'open') {
            if (this.shouldTryAgain()) {
                this.state = 'half-open';
            } else {
                throw new Error('Circuit is open');
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }
}
```

## Fallback Patterns

### Default Value

```typescript
const config = await loadConfig().catch(() => DEFAULT_CONFIG);
```

### Cached Value

```typescript
const data = await fetchFresh().catch(() => cache.get(key));
```

### Degraded Service

```typescript
async function getRecommendations(userId: string) {
    try {
        return await mlService.personalized(userId);
    } catch {
        return await getPopularItems(); // Fallback to non-personalized
    }
}
```

## Rollback Patterns

### Database Transaction

```typescript
const trx = await db.transaction();
try {
    await trx.insert('orders', order);
    await trx.update('inventory', ...);
    await trx.commit();
} catch (error) {
    await trx.rollback();
    throw error;
}
```

### Saga Pattern (Distributed)

```typescript
const saga = new Saga();
saga.addStep({
    execute: () => chargePayment(),
    compensate: () => refundPayment()
});
saga.addStep({
    execute: () => reserveInventory(),
    compensate: () => releaseInventory()
});
saga.addStep({
    execute: () => shipOrder(),
    compensate: () => cancelShipment()
});

await saga.execute(); // Auto-compensates on failure
```

### Feature Flag Rollback

```typescript
if (await isFeatureEnabled('new-checkout')) {
    return newCheckout();
} else {
    return legacyCheckout();
}
// Instant rollback: disable flag
```

## Error Boundaries

### React Error Boundary

```tsx
class ErrorBoundary extends React.Component {
    componentDidCatch(error: Error) {
        logError(error);
    }

    render() {
        if (this.state.hasError) {
            return <FallbackUI />;
        }
        return this.props.children;
    }
}
```

### Try-Catch Boundaries

```typescript
// Bad: One giant try-catch
try {
    await step1();
    await step2();
    await step3();
} catch { /* Which step failed? */ }

// Good: Granular error handling
const result1 = await step1().catch(handleStep1Error);
const result2 = await step2(result1).catch(handleStep2Error);
const result3 = await step3(result2).catch(handleStep3Error);
```

## Graceful Degradation Checklist

- [ ] What's the user experience when this fails?
- [ ] Is there a fallback that provides partial value?
- [ ] Does the error message help the user?
- [ ] Is the failure logged for debugging?
- [ ] Can we recover automatically?
- [ ] Is there a manual override?

## Synapses

See [synapses.json](synapses.json) for connections.
