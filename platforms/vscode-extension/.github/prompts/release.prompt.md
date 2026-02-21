---
description: Execute release management workflow for version bumping, changelog, and publishing
agent: Alex
---

# /release - Release Management

> **Avatar**: Call `alex_cognitive_state_update` with `state: "building"`. This updates the welcome sidebar avatar.

Execute the full release workflow: pre-release assessment, version bump, changelog, and publish.

## Process

1. **Brain QA**: Run synapse validation — block if broken
2. **Detect Changes**: Identify all modifications since last commit
3. **Version Assessment**: Recommend patch/minor/major based on change types
4. **Changelog Draft**: Auto-generate entry from detected changes
5. **Publish**: Build extension package and publish to marketplace

## Safety

- NEVER skip Brain QA (Step 0)
- NEVER publish without PAT verification
- Always run `release-preflight.ps1` before packaging

## Start

Beginning release assessment. I'll check architecture health, detect changes, and recommend a version bump.


> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` to reset to project-appropriate avatar.