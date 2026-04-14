---
name: "converter-qa"
description: "Test harness for validating converter outputs with 284 assertions across all converter muscles"
tier: extended
applyTo: '**/*converter*,**/*qa*,**/*test*harness*'
muscle: .github/muscles/converter-qa.cjs
---

# Converter QA Framework

> Trust your converters -- 284 assertions prove they work

Test harness that validates all converter outputs: md-to-word regression tests, md-to-eml structure validation, shared module unit tests, file size bounds, and output format verification.

## When to Use

- After modifying any converter muscle or shared module
- Before releasing a new version of the converter pipeline
- When adding new features to md-to-word, md-to-eml, or shared modules
- As part of the pre-publish quality gate

## Test Suites

| Suite | Covers | Assertions |
|-------|--------|-----------|
| Shared module tests | All 8 shared modules (preprocessor, mermaid, config, etc.) | ~120 |
| md-to-word smoke | End-to-end Word conversion with multiple style presets | ~40 |
| md-to-word OOXML | Visual regression (XML structure, table styling) | ~30 |
| md-to-eml structure | Email HTML, CID images, frontmatter mapping | ~20 |
| markdown-lint | All 19 lint rules with positive and negative cases | ~30 |
| md-scaffold | Template generation for all 5 template types | ~15 |
| nav-inject | Navigation injection, dry-run, init | ~10 |
| CLI flag parsing | All CLI flags for md-to-word (new flags) | ~15 |
| Lua filter syntax | Pandoc Lua filter validation | ~4 |

## Usage

```bash
# Run all tests
node .github/muscles/converter-qa.cjs

# Run a specific suite
node .github/muscles/converter-qa.cjs --suite=word
node .github/muscles/converter-qa.cjs --suite=shared

# Verbose output (show passing tests)
node .github/muscles/converter-qa.cjs --verbose
```

## Adding Tests

Tests use a minimal zero-dependency framework:

```javascript
suite('My test suite', () => {
  assert(condition, 'description of what is being tested');
  skip('description of skipped test');  // for known issues
});
```

## Quality Gate Integration

This muscle is part of the pre-publish quality gate:
1. `converter-qa.cjs` runs all 284 assertions
2. Zero failures required to pass
3. Skips are tracked but don't block (used for environment-dependent tests)
