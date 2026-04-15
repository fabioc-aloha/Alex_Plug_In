---
description: "CPU, memory, network bottleneck analysis — systematic performance investigation"
application: "When diagnosing slow performance, memory leaks, or resource exhaustion"
applyTo: "**/*profil*,**/*performance*,**/*bottleneck*,**/*slow*,**/*memory-leak*"
---

# Performance Profiling

## Systematic Investigation

1. **Measure first** — Don't guess, profile
2. **Find the hotspot** — 80/20 rule applies
3. **Understand why** — Algorithmic? I/O bound? Memory pressure?
4. **Fix and verify** — Re-profile after changes

## Common Bottlenecks

| Symptom | Likely Cause | Investigation |
|---------|--------------|---------------|
| High CPU | Tight loop, poor algorithm | Flame graph, CPU profiler |
| Growing memory | Leak, unbounded cache | Heap snapshot, allocation tracking |
| High latency | Network I/O, blocking calls | Trace, async profiling |
| Timeout | Deadlock, resource starvation | Thread dump, connection pool stats |

## Tools by Platform

- **Node.js**: `--inspect`, `clinic.js`, `0x`
- **Python**: `cProfile`, `py-spy`, `memory_profiler`
- **Browser**: DevTools Performance tab, Lighthouse

## Anti-Patterns

- Premature optimization
- Micro-benchmarks that don't reflect production
- Optimizing the wrong thing
- Adding complexity for marginal gains
