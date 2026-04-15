---
description: "Well-Architected Framework principles and Azure best practices"
application: "When designing Azure solutions or reviewing cloud architectures"
applyTo: "**/*azure*,**/*cloud*,**/infrastructure/**"
---

# Azure Architecture Principles

## Five Pillars

1. **Reliability**: Design for failure, self-healing, availability zones
2. **Security**: Zero trust, managed identity, private endpoints
3. **Cost**: Right-size, reserved instances, auto-shutdown dev/test
4. **Operations**: IaC (Bicep), observability, CI/CD
5. **Performance**: Autoscaling, caching (CDN/Redis), load testing

## Essential Checklist

- [ ] Managed identities (no stored credentials)
- [ ] Key Vault for secrets
- [ ] Private endpoints for PaaS
- [ ] IaC for all resources
- [ ] Diagnostic settings to Log Analytics
- [ ] Autoscaling configured
- [ ] Cost alerts and budgets

## Anti-Patterns

- Hardcoded config → App Configuration/Key Vault
- Single region → Multi-region + Traffic Manager
- Over-provisioned → Right-size + autoscale
- No IaC → Bicep/Terraform everything
