# Alex M365 Copilot Agent - Publication Guide

**Document Version**: 1.0
**Created**: January 29, 2026
**Target**: Microsoft Internal M365 App Catalog (Line of Business)
**Agent Type**: Knowledge-only Declarative Agent

---

## Overview

This guide documents the requirements and process for publishing the Alex Cognitive Architecture agent to Microsoft's internal M365 app store. Alex is a **knowledge-only declarative agent** that uses M365 Copilot foundation models with custom instructions and knowledge sources.

### Publishing Path

| Category | Value |
|----------|-------|
| App Type | Knowledge-only Declarative Agent |
| Publishing Path | Line of Business (LoB) |
| Submission Portal | ALM Portal |
| Review SLA | Up to 10 business days |

---

## Compliance Reviews

All apps must complete these reviews **before** ALM Portal submission.

### 1. Security Review

- [ ] **SDL Compliance** - App follows Secure Development Lifecycle requirements
- [ ] **Data Handling** - Proper handling of Microsoft confidential information
- [ ] **Authentication** - Uses Microsoft Entra ID (Azure AD) authentication
- [ ] **No Credential Exposure** - No hardcoded secrets or credentials

**Resources**:
- AI systems must follow the Responsible AI (RAI) Security Guidance in Liquid

### 2. Privacy Review

- [ ] **Data Classification** - Understand and respect labels (Public, General, Confidential, Highly Confidential)
- [ ] **Employee Data** - No unauthorized collection/processing of employee data
- [ ] **Dynamic Knowledge Sources** - Use existing sources, don't upload files into agent
- [ ] **Privacy Statement** - Clear documentation of data usage

**Key Privacy Rules**:
- Highly Confidential groups do not allow sharing with external users
- Use "Internal Only" label for content that should not have guest access

### 3. Responsible AI (RAI) Review

> ⚠️ **MANDATORY**: A responsible AI initial impact assessment is required for all apps that use AI, including declarative agents.

- [ ] **RAI Initial Impact Assessment** - Complete assessment to determine sensitivity
- [ ] **Restricted Use Check** - Verify if agent meets any restricted use categories
- [ ] **OneRAI Registration** - If restricted use applies, register and confirm with CELA contact
- [ ] **Sensitive Use Reporting** - Report any sensitive uses at https://aka.ms/ReportSensitiveUses

**Special Considerations for Alex**:
- Alex is a **knowledge-only declarative agent**
- Per interim guidance: If it does NOT meet a Restricted Use category, no OneRAI registration required
- If it DOES meet a Restricted Use category, confirm with CELA and Lead RAI Champ

**RAI Standard Goals** (14 goals across 4 principles):
1. Accountability
2. Transparency
3. Fairness
4. Reliability & Safety

### 4. Accessibility Review

- [ ] **Microsoft Accessibility Standards** - App meets accessibility requirements
- [ ] **Inclusive Design** - Content and interactions work for all users

---

## Data & Permissions Requirements

### Least Privileged Access

- [ ] Respect existing permissions - don't bypass security controls
- [ ] Access only granted to users who need it
- [ ] Use **user-delegated permissions** wherever possible
- [ ] Avoid service accounts with broad access

### Knowledge Source Guidelines

- [ ] **Do NOT upload files** into the declarative agent
- [ ] Use existing SharePoint/OneDrive sources dynamically
- [ ] Respect sensitivity labels on knowledge sources
- [ ] Document all knowledge sources accessed

### Current Alex Knowledge Sources

| Source | Type | Classification |
|--------|------|----------------|
| `.github/copilot-instructions.md` | Project file | N/A (local) |
| OneDrive templates | User files | User-controlled |
| Global knowledge | Local storage | N/A (local) |

---

## Content & Usage Guidelines

### Microsoft Policies That Apply

- [ ] **M365 Usage Guidelines** - All usage compliant
- [ ] **Anti-Harassment and Anti-Discrimination Policy** - Content compliant
- [ ] **Business Conduct Policy** - All interactions compliant
- [ ] **Confidential Information Policy** - No unauthorized disclosure

### Content Rules

- [ ] No confidential info disclosure without NDA
- [ ] Non-confidential, work-appropriate naming
- [ ] No content violating Microsoft policies
- [ ] Responsible use of AI capabilities

---

## Pre-Submission Checklist

### Documentation

- [ ] App manifest (`manifest.json`) - Complete and accurate
- [ ] API specification (`openapi.yaml`) - If applicable
- [ ] Declarative agent definition (`declarativeAgent.json`) - Valid
- [ ] Instructions file - Clear and appropriate
- [ ] Privacy statement - Documented
- [ ] Data flow documentation - How data moves through the agent

### Technical Validation

- [ ] App works correctly in Teams/M365 Copilot
- [ ] No errors in console/logs
- [ ] Authentication flow tested
- [ ] All knowledge sources accessible
- [ ] Response quality validated

### Compliance Sign-offs

- [ ] Security review completed
- [ ] Privacy review completed
- [ ] RAI assessment completed
- [ ] Accessibility review completed

---

## ALM Portal Submission

### How to Submit

1. Go to the **ALM Portal**
2. Create new submission request
3. Upload app package and documentation
4. Select appropriate review categories
5. Submit and track via "All Requests" section

### Expected Timeline

| Phase | Duration |
|-------|----------|
| Initial Review | Up to 10 business days |
| Admin Enablement | Best-effort after approval |
| Additional Reviews | May extend timeline |

### Change Freeze Periods

> 🚫 **No apps are published during change freeze periods**
> ✅ Reviews continue during change freeze periods

- Check the change freeze calendar before submitting
- Plan submissions around freeze periods

### Tracking Your Request

1. Go to ALM Portal → "All Requests"
2. Find your request entry
3. Click Request Type link → Side panel opens
4. Check "History" tab for processing time

---

## Post-Publication Requirements

### Ongoing Responsibilities

- [ ] **Keep app updated** - Security patches and updates
- [ ] **Monitor for issues** - Respond to user feedback
- [ ] **Maintain compliance** - Ongoing adherence to policies
- [ ] **Report incidents** - Use Report It Now for security issues

### Owner Requirements

> ⚠️ As of January 2025, all third-party apps require an assigned owner.

While Alex is a 1P internal app, ensure:
- Clear ownership documented
- Maintenance plan established
- Update cadence defined

---

## Alex-Specific Considerations

### What Alex Does

Alex is a cognitive architecture that:
- Provides personalized assistance based on user profile
- Uses custom instructions for development guidance
- Integrates with project knowledge in workspace
- Supports memory consolidation and learning

### RAI Considerations for Alex

| Aspect | Assessment |
|--------|------------|
| Data Access | User's own files and workspace |
| Actions | Read-only / advisory (no actions) |
| Sensitive Data | No PII collection, user-controlled |
| Decision Making | Suggestions only, human decides |

### Potential Restricted Use Categories to Review

- [ ] Performance & Development scenarios - Check guidelines
- [ ] Employee monitoring - Alex does NOT monitor employees
- [ ] Automated decision-making - Alex provides suggestions only

---

## Resources & Links

| Resource | Purpose |
|----------|---------|
| https://aka.ms/m365builders | Builders Central - Main hub |
| https://aka.ms/ReportSensitiveUses | Report sensitive AI uses |
| ALM Portal | Submission portal |
| OneRAI | RAI system registration |
| Report It Now | Security incident reporting |

---

## Appendix: Agent Files Reference

```
platforms/m365-copilot/
├── appPackage/
│   ├── manifest.json              # App manifest
│   ├── declarativeAgent.json      # Agent definition
│   ├── openapi.yaml               # API specification
│   └── instructions/              # Agent instructions
├── DEPLOYMENT-CHECKLIST.md        # Deployment steps
└── PUBLICATION-GUIDE.md           # This document
```

---

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-29 | 1.0 | Initial document created |
