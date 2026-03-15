---
name: azure-openai-patterns
description: Azure OpenAI API patterns for rate limiting, function calling, error handling, and token optimization
applyTo: "**/*openai*,**/*chat*,**/*llm*,**/*gpt*"
---

# Azure OpenAI Patterns

> Rate limiting, function calling, error handling, and token optimization for Azure OpenAI API.

**Version**: 1.0.0

---

## Rate Limiting: The Dual System

Azure OpenAI uses **dual rate limits**: Tokens Per Minute (TPM) and Requests Per Minute (RPM). The ratio is typically 6 RPM per 1000 TPM.

### TPM vs RPM Relationship

| Model | Tier | TPM | RPM | Ratio |
|-------|------|-----|-----|-------|
| gpt-4o | Default | 450K | 2.7K | 6 RPM/1K TPM |
| gpt-4o-mini | Default | 2M | 12K | 6 RPM/1K TPM |
| gpt-4o | Enterprise | 30M | 180K | 6 RPM/1K TPM |

### How TPM is Calculated

TPM is estimated **before processing** based on:

1. Prompt text character count (converted to estimated tokens)
2. `max_tokens` parameter setting
3. `best_of` parameter setting (if used)

The rate limit estimate is NOT the same as actual token consumption for billing.

### Burst vs Sustained Limits

RPM is enforced over **small time windows** (1-10 seconds):

```text
600 RPM deployment = max 10 requests per second
If you send 15 requests in 1 second → 429 error
Even though 15/min < 600/min
```

---

## Function Calling Patterns

### Pattern 1: Exponential Backoff with Status Callback

```typescript
async function chatWithTools(
  messages: ChatCompletionMessage[],
  tools: Tool[],
  onStatusUpdate?: (status: string) => void
): Promise<ChatCompletionResponse> {
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ messages, tools, tool_choice: 'auto' }),
    });

    if (response.ok) {
      return response.json();
    }

    if (response.status === 429 && attempt < maxRetries) {
      const waitTime = Math.pow(2, attempt);
      onStatusUpdate?.(`Rate limited. Waiting ${waitTime}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      continue;
    }

    throw new Error(`API error: ${response.status}`);
  }
}
```

### Pattern 2: Optimize max_tokens

```typescript
// Bad: Set unnecessarily high max_tokens — uses full quota even for short responses
const badRequest = { messages: [...], max_tokens: 4000 };

// Good: Set appropriate max_tokens for expected response length
const goodRequest = { messages: [...], max_tokens: 500 };
```

### Pattern 3: Tool Result Batching

```typescript
// Bad: Send one request per tool result (consumes RPM quota)
for (const toolCall of toolCalls) {
  const result = await executeFunction(toolCall);
  await sendToolResult(result);
}

// Good: Collect all results and send once
const results = await Promise.all(
  toolCalls.map(tc => executeFunction(tc))
);
await sendToolResults(results); // Single request
```

---

## Response Headers to Monitor

```typescript
const headers = response.headers;
const remainingRequests = headers.get('x-ratelimit-remaining-requests');
const remainingTokens = headers.get('x-ratelimit-remaining-tokens');
const resetRequests = headers.get('x-ratelimit-reset-requests');
const resetTokens = headers.get('x-ratelimit-reset-tokens');
const retryAfter = headers.get('Retry-After'); // Only on 429
```

---

## Function Design Best Practices

### 1. Minimize Token Consumption

```typescript
// Bad: Return entire resource objects
{ name: 'get_resources', description: 'Get all Azure resources' }
// Returns: huge JSON with all properties

// Good: Return only necessary fields
{ name: 'get_resources', description: 'Get Azure resource summary' }
// Returns: { name, type, status } only
```

### 2. Use parallel_tool_calls

```typescript
const request = {
  messages,
  tools,
  parallel_tool_calls: true, // Default: true in newer models
};
// Model may call multiple tools in one response, reducing round trips
```

### 3. Request Queuing for High Volume

```typescript
class RequestQueue {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private minDelayMs = 100; // 10 req/sec max

  async enqueue<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try { resolve(await request()); }
        catch (e) { reject(e); }
        await this.delay(this.minDelayMs);
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const next = this.queue.shift();
      await next?.();
    }
    this.processing = false;
  }

  private delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
  }
}
```

---

## Error Codes and Handling

| Code | Meaning | Action |
|------|---------|--------|
| 429 | Rate limited | Exponential backoff, check Retry-After |
| 400 | Invalid request | Check request format, content filter |
| 401 | Authentication error | Refresh token |
| 403 | Quota exceeded | Wait or upgrade tier |
| 500 | Server error | Retry with backoff |
| 503 | Service unavailable | Retry with longer backoff |

### Content Filter Handling

```typescript
if (response.status === 400) {
  const error = await response.json();
  if (error.error?.code === 'content_filter') {
    return { message: 'Content was filtered by safety policy.', filtered: true };
  }
}
```

---

## Recommended Settings

| Setting | Value | Rationale |
|---------|-------|-----------|
| max_tokens | 500-2000 | Sized for expected response |
| temperature | 0.3-0.7 | Lower for tool calling, higher for creative |
| retry attempts | 5 | Handles transient rate limits |
| base delay | 2000ms | Start at 2s for backoff |
| max delay | 60000ms | Cap at 1 minute |

---

## References

- [Azure OpenAI quotas and limits](https://learn.microsoft.com/en-us/azure/ai-services/openai/quotas-limits)
- [Manage Azure OpenAI quota](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/quota)
- [Best practices for function calling](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/function-calling)

---

## Activation Patterns

| Trigger | Response |
|---------|----------|
| "azure openai", "rate limit", "429" | Full skill activation |
| "function calling", "tool calling" | Function Calling Patterns section |
| "token optimization", "max_tokens" | Pattern 2 + Recommended Settings |
| "retry", "backoff" | Pattern 1 + Error Codes |
| "request queue", "high volume" | Pattern 3 |
