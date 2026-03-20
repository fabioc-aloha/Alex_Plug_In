# CPM (Customer Promise Management) Integration Guide

> SLA tracking, compliance reporting, and customer commitment workflows.

---

## Overview

CPM (Customer Promise Management) is the enterprise platform for tracking customer commitments, SLAs, and compliance. The GCX Copilot helps you query CPM data, build reports, and integrate with your development workflows.

---

## Prerequisites

| Requirement | Purpose |
|-------------|---------|
| CPM API Access | Data queries |
| API Credentials | Authentication |
| Azure Key Vault | Credential storage |

---

## Setup

### Step 1: Obtain API Credentials

Contact your CPM administrator to obtain:
- API endpoint URL
- API key or OAuth credentials
- Allowed scopes/permissions

### Step 2: Store Credentials Securely

```
@workspace Set up Key Vault for CPM credentials
```

---

## Common Operations

### SLA Tracking

```
@workspace Query CPM for current SLA compliance rates
```

```
@workspace Get all SLAs expiring in the next 30 days
```

```
@workspace Show SLA violations by team for Q1
```

### Customer Commitments

```
@workspace List all active customer promises for project X
```

```
@workspace Track promise fulfillment status
```

```
@workspace Create a new customer commitment record
```

### Compliance Reporting

```
@workspace Generate a compliance report for leadership
```

```
@workspace Build a dashboard showing promise fulfillment rates
```

```
@workspace Export CPM data for the monthly review
```

### ADO Integration

```
@workspace Link this ADO work item to a CPM commitment
```

```
@workspace Create ADO tasks for at-risk SLAs
```

```
@workspace Sync CPM deadlines with ADO sprint planning
```

---

## Data Model

| Entity | Description |
|--------|-------------|
| **Promise** | A commitment made to a customer |
| **SLA** | Service Level Agreement with metrics |
| **Milestone** | Key delivery checkpoints |
| **Compliance Record** | Audit trail of fulfillment |

---

## Best Practices

1. **Automate alerts** — Set up notifications for at-risk SLAs
2. **Link to ADO** — Connect commitments to work items
3. **Regular sync** — Keep CPM and project data aligned
4. **Audit trail** — Document all compliance decisions

---

## Related Skills

- `cpm-workflows` — CPM automation patterns
- `azure-devops-automation` — ADO integration
- `compliance-reporting` — Report generation
