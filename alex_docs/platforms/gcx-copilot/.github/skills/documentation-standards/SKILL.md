---
name: documentation-standards
description: Create technical documentation following Microsoft standards. Use when user asks about documentation, needs to write docs, or asks about documentation best practices.


# Documentation Standards

Create clear, consistent technical documentation.

## Document Types

### Architecture Decision Record (ADR)
- **Purpose**: Capture significant technical decisions
- **Template**: Title, Status, Context, Decision, Consequences
- **When**: Any decision that affects system architecture

### Technical Specification
- **Purpose**: Detail system design before implementation
- **Sections**: Overview, Requirements, Design, API, Security
- **When**: New features or major changes

### Runbook
- **Purpose**: Operational procedures for support
- **Sections**: Overview, Prerequisites, Steps, Troubleshooting
- **When**: Any production operation

### API Documentation
- **Purpose**: Describe API contracts
- **Format**: OpenAPI/Swagger preferred
- **Include**: Endpoints, parameters, responses, examples

## Writing Guidelines

1. **Be concise** — Remove unnecessary words
2. **Use active voice** — "Configure the service" not "The service should be configured"
3. **Include examples** — Show, don't just tell
4. **Structure with headings** — Make scannable
5. **Keep current** — Update when code changes

## Template Links

- [ADR Template](../prompts/adr.prompt.md)
- [Runbook Template](../prompts/runbook.prompt.md)
