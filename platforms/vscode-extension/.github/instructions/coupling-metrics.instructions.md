---
description: "Structural coupling metrics for architecture audits: afferent/efferent coupling, instability, hub risk detection"
application: "During code reviews, quality audits, or when assessing coupling metrics"
applyTo: "**/*coupling*,**/*architecture*audit*,**/*dependency*graph*"
---

# Coupling Metrics

Adapted from: AI-First Dev Starter Pack `semantic-codebase-intelligence` skill.

## Purpose

Turn subjective "this feels coupled" into objective metrics. Measure dependency direction, instability, and hub risk per module.

## Core Metrics

| Metric | Formula | Meaning |
|--------|---------|---------|
| **Ca** (Afferent Coupling) | Count of modules that depend on this one | How many things break if this changes |
| **Ce** (Efferent Coupling) | Count of dependencies this module has | How many things this depends on |
| **I** (Instability) | Ce / (Ca + Ce) | 0 = maximally stable, 1 = maximally unstable |

### Interpretation

| I Score | Classification | Implication |
|---------|---------------|-------------|
| 0.0-0.2 | Very Stable | Many dependents, few dependencies. Changes here are risky. Should be abstract. |
| 0.3-0.5 | Balanced | Moderate coupling in both directions. Typical for service layers. |
| 0.6-0.8 | Unstable | Few dependents, many dependencies. Changes here are cheap. Concrete implementations. |
| 0.9-1.0 | Very Unstable | Nobody depends on this. Could be leaf module or dead code. |

### Hub Risk Detection

A **hub** has both high Ca AND high Ce: many things depend on it, AND it depends on many things. Hubs are the most dangerous modules because changes cascade in both directions.

```
Hub Risk = Ca x Ce
```

Flag any module where `Ca >= 5 AND Ce >= 5` as a hub risk. These are candidates for interface extraction (reduce Ce by depending on abstractions) or splitting (reduce Ca by separating concerns).

## How to Measure (TypeScript/JavaScript)

```bash
# Afferent coupling: who imports this module?
grep -rn "from.*'./services/auth'" --include="*.ts" src/ | wc -l

# Efferent coupling: what does this module import?
grep -c "^import" src/services/auth.ts

# Quick instability for all modules
for f in src/**/*.ts; do
  ca=$(grep -rn "from.*'.*$(basename $f .ts)'" --include="*.ts" src/ | wc -l)
  ce=$(grep -c "^import" "$f")
  total=$((ca + ce))
  if [ $total -gt 0 ]; then
    echo "$f Ca=$ca Ce=$ce I=$(echo "scale=2; $ce / $total" | bc)"
  fi
done
```

## Dead Code Verification

Before recommending removal of a module with I=1.0 (zero dependents), check:
1. Dynamic imports: `import()`, `require()` with variables
2. Reflection: string-based class loading, DI containers
3. Config references: mentioned in package.json scripts, tsconfig paths, webpack aliases
4. Test-only usage: imported only in test files (still valuable)
5. Entry points: registered as commands, exports, or API routes

Only flag as dead code if all 5 checks come back negative.

## Integration with Architecture Audits

Add coupling metrics to the architecture-audit skill output:
- Report top 5 highest Ca modules ("most depended on")
- Report top 5 hub risk modules ("most dangerous to change")
- Flag any module with I < 0.2 that is concrete (not an interface/type file)
