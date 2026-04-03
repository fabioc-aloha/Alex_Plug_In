---
name: PII & Privacy Regulations
description: Identify PII risks and apply GDPR and Australian Privacy Principle safeguards to code, data pipelines, and documentation.
---

## Purpose

Protect personally identifiable information by applying privacy regulations at design time, not after a breach. Every GCX project that touches customer data must follow these rules.

## What is PII?

### Direct Identifiers

| Category | Examples |
| -------- | -------- |
| **Name** | Full name, maiden name, alias |
| **Government IDs** | SSN, passport, driver's license, TFN (AU) |
| **Financial** | Bank account, credit card numbers |
| **Contact** | Email, phone, physical address |
| **Biometric** | Fingerprints, facial recognition, voice |

### Indirect Identifiers (Quasi-identifiers)

| Category | Examples |
| -------- | -------- |
| **Location** | IP address, GPS coordinates, ZIP/postcode |
| **Device** | Device ID, MAC address, browser fingerprint |
| **Demographic** | Age, gender, ethnicity, occupation |
| **Behavioral** | Purchase history, browsing patterns |

Combining quasi-identifiers can uniquely identify individuals even without direct identifiers.

## GDPR Core Principles (Article 5)

| Principle | Requirement |
| --------- | ----------- |
| **Lawfulness, Fairness, Transparency** | Process data legally with clear communication |
| **Purpose Limitation** | Collect only for specified, legitimate purposes |
| **Data Minimization** | Collect only what's necessary |
| **Accuracy** | Keep data accurate and up to date |
| **Storage Limitation** | Retain only as long as necessary |
| **Integrity & Confidentiality** | Ensure appropriate security |
| **Accountability** | Demonstrate compliance |

## Individual Rights (Data Subject Rights)

| Right | Description | Response Time |
| ----- | ----------- | ------------- |
| **Access** | Obtain copy of their data | 1 month |
| **Rectification** | Correct inaccurate data | 1 month |
| **Erasure** | Delete their data | 1 month |
| **Restrict Processing** | Limit how data is used | 1 month |
| **Data Portability** | Receive data in machine-readable format | 1 month |
| **Object** | Stop certain processing | Without delay |
| **Automated Decision-Making** | Human review of automated decisions | 1 month |

## Code Patterns

### Never Log PII

```typescript
// BAD
logger.info(`User ${user.email} logged in from ${user.ipAddress}`);

// GOOD
logger.info(`User ${hashUserId(user.id)} logged in`);
```

### Data Minimization

```typescript
// BAD: Fetching everything
const user = await db.users.findById(id);
return user; // Contains PII you don't need

// GOOD: Select only needed fields
const user = await db.users.findById(id, {
  select: ['id', 'displayName', 'preferences']
});
return user;
```

### Encrypt PII at Rest

```typescript
const encryptedEmail = encrypt(user.email, encryptionKey);
await db.users.update({ id: user.id, email: encryptedEmail });
```

## New Project Privacy Checklist

- [ ] What PII will be collected?
- [ ] What is the lawful basis (GDPR) or primary purpose (APP)?
- [ ] Is all collected data necessary? (data minimization)
- [ ] How long will data be retained?
- [ ] Who will have access?
- [ ] Will data cross borders?
- [ ] PII encrypted at rest and in transit (TLS 1.2+)
- [ ] Logging excludes PII
- [ ] Consent captured before processing
- [ ] Retention and deletion automation in place

## When Processing is Prohibited

| Scenario | GDPR | APP |
| -------- | ---- | --- |
| No lawful basis identified | Prohibited | Prohibited |
| Sensitive data without explicit consent | Prohibited | Prohibited |
| Marketing without opt-out option | Prohibited | Prohibited |
| Cross-border transfer without safeguards | Prohibited | Prohibited |
| Retention beyond stated period | Prohibited | Prohibited |
| Collection beyond stated purpose | Prohibited | Prohibited |

## Guidelines

- PII protection is non-negotiable: no customer data in logs, prompts, or AI outputs
- Validate CPM (Customer Permission Management) before any survey or outreach operation
- Never hardcode credentials or connection strings
- Report both the regulation (GDPR article, APP number) and the practical action required
- When in doubt, treat data as PII until confirmed otherwise
