---
description: "Microsoft Entra ID (Azure AD) app registration, authentication flows, and agent identity patterns"
application: "When configuring Entra ID apps, service principals, or managed identities"
applyTo: "**/*entra*,**/*azure-ad*,**/*app-registration*,**/*service-principal*"
---

# Entra Agent ID Patterns

## App Registration

1. Create app registration in Entra ID
2. Configure redirect URIs for auth flows
3. Set required API permissions
4. Create client secret or certificate
5. Grant admin consent where needed

## Authentication Flows

| Flow | Use Case |
|------|----------|
| **Authorization code** | Web apps with user sign-in |
| **Client credentials** | Daemon/service apps |
| **Device code** | CLI tools, IoT |
| **On-behalf-of** | API calling another API |

## Managed Identity

- System-assigned: Tied to resource lifecycle
- User-assigned: Reusable across resources
- No secrets to manage

## Common Permissions

| Permission | Scope |
|------------|-------|
| User.Read | Sign-in + profile |
| Mail.Send | Send email |
| Sites.ReadWrite.All | SharePoint access |

## Anti-Patterns

- Overly broad permissions
- Storing secrets in code
- Not rotating secrets
- Missing consent for required scopes
