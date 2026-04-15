---
description: "Universal deployment patterns for any project type"
application: "When deploying applications, setting up CI/CD, or managing release environments"
applyTo: "**/*deploy*,**/*cicd*,**/*pipeline*,**/*release*"
---

# Project Deployment

## Environment Strategy

| Environment | Purpose | Deploy Trigger |
|-------------|---------|----------------|
| **Dev** | Active development | Push to branch |
| **Staging** | Pre-production testing | PR merge |
| **Production** | Live users | Manual approval or tag |

## Deployment Patterns

- **Blue-green**: Zero downtime via hot swap
- **Canary**: Gradual rollout (1% → 10% → 100%)
- **Rolling**: Replace instances incrementally
- **Recreate**: Full restart (simplest, brief downtime)

## Checklist

- [ ] Tests pass in CI
- [ ] Config validated for target environment
- [ ] Rollback plan documented
- [ ] Monitoring/alerts active
- [ ] Stakeholders notified

## Anti-Patterns

- Manual deployments without scripts
- No rollback capability
- Deploying Friday afternoon
- Skipping staging
