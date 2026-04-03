---
name: Business Analysis
description: Requirements elicitation, business requirement documents, process analysis, SWOT, and stakeholder alignment for structured business decision-making.
---

## Purpose

Transform ambiguous business needs into structured, actionable requirements. Bridge the gap between what stakeholders say they want and what the organization actually needs. Produce clear, traceable documents that drive decisions.

## Steps

1. Clarify the business problem: What is the current state? What is the desired state? What is the gap?
2. Identify stakeholders and their perspectives on the problem
3. Search organizational data (emails, documents, SharePoint) for existing analysis on this topic
4. Conduct requirements elicitation using these techniques:
   - Interview key stakeholders (capture in meeting notes)
   - Review existing documentation and processes
   - Analyze comparable solutions or competitor approaches
5. Categorize requirements:
   - **Functional**: What the solution must do
   - **Non-functional**: Performance, security, compliance constraints
   - **Business rules**: Policies and regulations that apply
6. Prioritize using MoSCoW: Must have, Should have, Could have, Won't have (this time)
7. Create a Business Requirements Document (BRD) in Word:
   - Executive summary
   - Business context and problem statement
   - Stakeholders and their needs
   - Requirements (categorized and prioritized)
   - Assumptions and constraints
   - Success criteria (measurable)
   - Dependencies and risks
8. Create a companion Excel workbook with a requirements traceability matrix

## Analysis Frameworks

### SWOT Analysis

|              | Helpful       | Harmful    |
| ------------ | ------------- | ---------- |
| **Internal** | Strengths     | Weaknesses |
| **External** | Opportunities | Threats    |

### Current State vs. Future State

| Dimension  | Current State          | Future State            | Gap                 |
| ---------- | ---------------------- | ----------------------- | ------------------- |
| Process    | [How it works today]   | [How it should work]    | [What must change]  |
| Technology | [Current tools]        | [Target tools]          | [Migration needed]  |
| People     | [Current roles/skills] | [Required roles/skills] | [Training/hiring]   |
| Data       | [Current data state]   | [Target data state]     | [Cleanup/migration] |

### Process Mapping

For each business process:

1. Document the happy path (normal flow)
2. Document exceptions and edge cases
3. Identify bottlenecks and manual steps
4. Quantify: time, cost, error rate per step

## Output Format

- Word document: Business Requirements Document (BRD)
- Excel workbook: Requirements traceability matrix
- PowerPoint (optional): Executive summary for stakeholder alignment

## Guidelines

- Separate the problem from the solution; document the "what" before the "how"
- Every requirement must be testable (measurable success criteria)
- Trace every requirement back to a business need
- Use "shall" for must-haves, "should" for should-haves
- Include what is out of scope, not just what is in scope
- Assumptions are risks in disguise; document and validate them
