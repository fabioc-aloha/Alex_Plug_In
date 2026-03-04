---
description: "Systematic debugging procedure — reproduce, isolate, hypothesize, fix"
applyTo: "**/*debug*,**/*error*,**/*fix*,**/*issue*,**/*bug*"
---

# Debugging Procedure

## When to Apply

Activate when: an error occurs, a test fails, or behavior doesn't match expectations.

## 6-Step Protocol

### Step 1: Reproduce

- Run the failing command or test
- Capture the exact error message and stack trace
- Note the environment (OS, Node version, VS Code version)

### Step 2: Isolate

- Find the smallest input or scenario that triggers the failure
- Comment out code to narrow the scope
- Use `git stash` to test against clean state if recent changes may be the cause

### Step 3: Read the Error

Stack trace reading pattern:
- **Top frame**: Where the error manifested (symptom)
- **Middle frames**: Call chain (context)
- **Bottom frames**: Entry point (trigger)
- Ignore `node_modules` frames unless the bug is in a dependency

### Step 4: Hypothesize and Test

- Form ONE hypothesis about the cause
- Design a test to prove or disprove it
- If disproved, form the next hypothesis — don't guess blindly

### Step 5: Fix ONE Thing

- Make the minimal change that fixes the issue
- Run the failing test — it should now pass
- Run the full test suite — nothing else should break

### Step 6: Verify and Document

- Confirm the fix in the original scenario
- Add a regression test if one didn't exist
- Write a clear commit message: what was wrong, why, and what fixed it
