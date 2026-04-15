#!/usr/bin/env node
/**
 * @muscle md-scaffold
 * @inheritance inheritable
 * @description Markdown file scaffolder with converter-ready templates
 * @version 1.0.0
 * @skill md-scaffold
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires node
 *
 * Generates properly structured markdown files that convert cleanly on first pass.
 * Templates include correct frontmatter, extended syntax examples, converter
 * directives, and navigation sentinels.
 *
 * Usage:
 *   node md-scaffold.cjs report "Quarterly Review"              # Create report template
 *   node md-scaffold.cjs tutorial "Getting Started with APIs"   # Create tutorial template
 *   node md-scaffold.cjs reference "CLI Reference"              # Create reference template
 *   node md-scaffold.cjs slides "Sprint Demo"                   # Create Gamma-ready slides
 *   node md-scaffold.cjs email "Team Update"                    # Create email template
 *   node md-scaffold.cjs --list                                 # List available templates
 *   node md-scaffold.cjs --output path/to/file.md report "Title" # Custom output path
 */
'use strict';

const fs = require('fs');
const path = require('path');

// -----------------------------------------------------------------------------
// TEMPLATES
// -----------------------------------------------------------------------------

const TEMPLATES = {
  report: {
    description: 'Formal report with TOC, executive summary, sections, and appendix',
    generate: (title, options) => `---
title: "${title}"
author: "${options.author || 'Author Name'}"
date: "${_today()}"
style: professional
toc: true
---

# ${title}

<!-- nav:start -->
<!-- nav:end -->

## Executive Summary

_One-paragraph overview of findings, recommendations, and next steps._

## Background

_Context and motivation for this report._

## Analysis

### Key Finding 1

_Description with supporting data._

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Metric A | 100 | 150 | +50% |
| Metric B | 200 | 180 | -10% |

### Key Finding 2

_Description with supporting data._

\`\`\`mermaid
flowchart LR
    A["Data Collection"] --> B["Analysis"]
    B --> C["Findings"]
    C --> D["Recommendations"]
\`\`\`

## Recommendations

1. **Recommendation 1** -- _Rationale and expected impact._
2. **Recommendation 2** -- _Rationale and expected impact._
3. **Recommendation 3** -- _Rationale and expected impact._

## Timeline

\`\`\`mermaid
gantt
    title Implementation Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
        Task 1 :a1, ${_today()}, 14d
        Task 2 :a2, after a1, 7d
    section Phase 2
        Task 3 :b1, after a2, 14d
\`\`\`

## Appendix

### A. Data Sources

_List data sources and methodology._

### B. Detailed Metrics

_Supporting tables and charts._
`,
  },

  tutorial: {
    description: 'Step-by-step tutorial with prerequisites, instructions, and troubleshooting',
    generate: (title, options) => `---
title: "${title}"
author: "${options.author || 'Author Name'}"
date: "${_today()}"
style: course
---

# ${title}

## Overview

_What you will learn and why it matters._

**Time required**: ~30 minutes
**Difficulty**: Beginner / Intermediate / Advanced

## Prerequisites

- [ ] Prerequisite 1 installed
- [ ] Prerequisite 2 configured
- [ ] Basic knowledge of _topic_

## Step 1: Getting Started

_Clear description of what this step accomplishes._

\`\`\`bash
# Command to run
echo "Hello World"
\`\`\`

> [!TIP]
> Pro tip for this step.

## Step 2: Configuration

_Clear description of what this step accomplishes._

\`\`\`json
{
  "setting": "value",
  "enabled": true
}
\`\`\`

> [!WARNING]
> Common pitfall to avoid.

## Step 3: Verification

_How to verify everything works._

Expected output:

\`\`\`
[OK] Connection established
[OK] Configuration valid
\`\`\`

## Troubleshooting

### Problem: Connection refused

**Symptom**: Error message "ECONNREFUSED"

**Solution**: Check that the service is running:

\`\`\`bash
# Verify service status
systemctl status myservice
\`\`\`

### Problem: Permission denied

**Symptom**: Error message "EACCES"

**Solution**: Check file permissions.

## Next Steps

- _Link to advanced tutorial_
- _Link to API reference_
- _Link to community forum_
`,
  },

  reference: {
    description: 'API/CLI reference with commands, parameters, and examples',
    generate: (title, options) => `---
title: "${title}"
author: "${options.author || 'Author Name'}"
date: "${_today()}"
style: professional
toc: true
---

# ${title}

## Overview

_Brief description of what this reference covers._

## Quick Start

\`\`\`bash
# Most common usage
tool command --option value
\`\`\`

## Commands

### \`command-one\`

_Description of what this command does._

**Syntax**:

\`\`\`
tool command-one [OPTIONS] <ARGUMENT>
\`\`\`

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| \`--flag\` | boolean | No | false | Enable feature |
| \`--value\` | string | Yes | -- | Input value |
| \`--output\` | path | No | stdout | Output file |

**Examples**:

\`\`\`bash
# Basic usage
tool command-one --value "hello"

# With output file
tool command-one --value "hello" --output result.json
\`\`\`

### \`command-two\`

_Description of what this command does._

**Syntax**:

\`\`\`
tool command-two [OPTIONS]
\`\`\`

## Configuration

Configuration file: \`.toolrc.json\`

\`\`\`json
{
  "defaults": {
    "output": "json",
    "verbose": false
  }
}
\`\`\`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`TOOL_TOKEN\` | API authentication token | -- |
| \`TOOL_VERBOSE\` | Enable verbose logging | \`false\` |

## Error Codes

| Code | Message | Resolution |
|------|---------|------------|
| E001 | Authentication failed | Check TOOL_TOKEN |
| E002 | Resource not found | Verify resource ID |
| E003 | Rate limit exceeded | Wait and retry |
`,
  },

  slides: {
    description: 'Gamma-ready presentation with H2 slide breaks',
    generate: (title, options) => `---
title: "${title}"
author: "${options.author || 'Author Name'}"
date: "${_today()}"
theme: professional
---

## Slide 1: ${title}

_Subtitle or tagline_

**${options.author || 'Presenter Name'}**
${_today()}

## Slide 2: Agenda

1. Context & motivation
2. Key findings
3. Proposed approach
4. Timeline & milestones
5. Next steps & ask

## Slide 3: Context

**The Challenge**

_One clear problem statement._

**Why Now**

_Urgency or trigger for this initiative._

## Slide 4: Key Data

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Metric A | 60% | 90% | 30% |
| Metric B | $100K | $50K | -$50K |

## Slide 5: Proposed Approach

\`\`\`mermaid
flowchart LR
    A["Phase 1<br/>Foundation"] --> B["Phase 2<br/>Build"]
    B --> C["Phase 3<br/>Scale"]
\`\`\`

**Phase 1**: _Description (2 weeks)_
**Phase 2**: _Description (4 weeks)_
**Phase 3**: _Description (2 weeks)_

## Slide 6: Timeline

\`\`\`mermaid
gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Delivery
        Phase 1 :a1, ${_today()}, 14d
        Phase 2 :a2, after a1, 28d
        Phase 3 :a3, after a2, 14d
\`\`\`

## Slide 7: Ask

**What we need:**

1. _Approval for X_
2. _Resources for Y_
3. _Decision on Z by date_

**Next Steps:**

- _Action item 1 (owner, date)_
- _Action item 2 (owner, date)_
`,
  },

  email: {
    description: 'Email-ready markdown with YAML frontmatter for md-to-eml conversion',
    generate: (title, options) => `---
to: recipient@example.com
from: ${options.author || 'sender@example.com'}
subject: "${title}"
cc: 
reply-to: 
---

Hi Team,

## ${title}

_Opening context -- what this email is about and why it matters now._

### Key Updates

1. **Update 1** -- _Brief description of progress or change._
2. **Update 2** -- _Brief description of progress or change._
3. **Update 3** -- _Brief description of progress or change._

### Action Items

| Action | Owner | Due |
|--------|-------|-----|
| Item 1 | Name | ${_nextWeek()} |
| Item 2 | Name | ${_nextWeek()} |

### Next Meeting

**Date**: _TBD_
**Agenda**: _Topics to cover_

Let me know if you have questions.

Best,
${options.author || 'Your Name'}
`,
  },

  adr: {
    description: 'Architecture Decision Record (ADR)',
    generate: (title, options) => `---
title: "${title}"
date: "${_today()}"
status: proposed
---

# ADR: ${title}

## Status

**Proposed** | Accepted | Deprecated | Superseded

## Context

_What is the issue we are seeing that motivates this decision?_

## Decision Drivers

- _Driver 1_
- _Driver 2_
- _Driver 3_

## Considered Options

### Option A: _Name_

**Pros**: _Benefits_
**Cons**: _Drawbacks_

### Option B: _Name_

**Pros**: _Benefits_
**Cons**: _Drawbacks_

## Decision

_What is the change we are proposing and/or doing?_

## Consequences

### Positive

- _Benefit 1_
- _Benefit 2_

### Negative

- _Tradeoff 1_
- _Tradeoff 2_

### Neutral

- _Observation_
`,
  },
};

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function _today() {
  return new Date().toISOString().split('T')[0];
}

function _nextWeek() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}

function _slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// -----------------------------------------------------------------------------
// EXPORTS (for use as a library)
// -----------------------------------------------------------------------------

function scaffold(templateName, title, options = {}) {
  const tmpl = TEMPLATES[templateName];
  if (!tmpl) throw new Error(`Unknown template: ${templateName}. Available: ${Object.keys(TEMPLATES).join(', ')}`);
  return tmpl.generate(title, options);
}

function listTemplates() {
  return Object.entries(TEMPLATES).map(([name, tmpl]) => ({
    name,
    description: tmpl.description,
  }));
}

module.exports = { scaffold, listTemplates, TEMPLATES };

// -----------------------------------------------------------------------------
// CLI
// -----------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--list') || args.length === 0) {
    console.log('\nAvailable templates:\n');
    for (const [name, tmpl] of Object.entries(TEMPLATES)) {
      console.log(`  ${name.padEnd(12)} ${tmpl.description}`);
    }
    console.log('\nUsage: node md-scaffold.cjs <template> "Title" [--output path.md] [--author "Name"]');
    process.exit(0);
  }

  // Parse args
  let templateName = null, title = null, outputPath = null, author = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && i + 1 < args.length) { outputPath = args[++i]; }
    else if (args[i] === '--author' && i + 1 < args.length) { author = args[++i]; }
    else if (!templateName) { templateName = args[i]; }
    else if (!title) { title = args[i]; }
  }

  if (!templateName || !title) {
    console.error('Usage: node md-scaffold.cjs <template> "Title"');
    process.exit(1);
  }

  try {
    const content = scaffold(templateName, title, { author });
    const outFile = outputPath || `${_slugify(title)}.md`;
    fs.writeFileSync(outFile, content, 'utf8');
    console.log(`[OK] Created: ${outFile} (${templateName} template)`);
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    process.exit(1);
  }
}
