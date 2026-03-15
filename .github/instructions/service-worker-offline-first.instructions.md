---
description: "Service Worker offline-first patterns — caching strategies, lifecycle management, and PWA resilience"
applyTo: "**/*service-worker*,**/*sw.*,**/*offline*,**/*pwa*,**/manifest.json"
---

# Service Worker Offline-First Instructions

**Auto-loaded when**: Implementing Service Workers, PWA offline support, caching strategies
**Synapses**: [service-worker-offline-first/SKILL.md](../skills/service-worker-offline-first/SKILL.md)

---

## Critical Rules

### 1. Always Clean Up Old Caches on Activate

```javascript
// ✅ CORRECT
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => !currentCaches.includes(key)).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// ❌ WRONG - Storage bloats over time
self.addEventListener('activate', (event) => { self.clients.claim(); });
```

### 2. Use skipWaiting() for Immediate Activation

```javascript
// ✅ Activate new SW immediately
self.addEventListener('install', (event) => {
  event.waitUntil(cacheStaticAssets());
  self.skipWaiting();
});
```

### 3. Network-First with Timeout for API Calls

```javascript
// ✅ Timeout prevents slow connections blocking UI
const response = await Promise.race([
  fetch(request),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
]);
```

### 4. Always Cache offline.html in Static Assets

### 5. Skip Non-GET Requests (never cache POST/PUT/DELETE)

### 6. Only Cache Successful Responses (check `response.ok`)

---

## Strategy Selection

| Request Type | Strategy | Timeout |
|-------------|----------|---------|
| Static assets (JS, CSS, fonts) | Cache-first with expiry (24h) | — |
| Images | Cache-first with expiry (7d) | — |
| API calls | Network-first with timeout | 5s |
| Navigation | Network-first with timeout | 3s |

---

## Common Anti-Patterns

1. **No version bumps** — users stuck on old cached version
2. **Caching error responses** — always check `response.ok` before caching
3. **Blocking install on errors** — use `Promise.allSettled` instead of `cache.addAll`
4. **No offline fallback for navigation** — users see blank page

---

## Code Review Checklist

- [ ] Old caches deleted on activate
- [ ] `skipWaiting()` + `clients.claim()` called
- [ ] offline.html in STATIC_ASSETS
- [ ] Non-GET and non-HTTP requests skipped
- [ ] Cache expiry implemented
- [ ] Network-first has timeout (3-5s)
- [ ] Error responses not cached
- [ ] Cache version incremented on deployment
