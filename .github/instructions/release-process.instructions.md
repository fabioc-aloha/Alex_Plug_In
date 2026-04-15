---
description: "Version control, changelog generation, and publish workflows for software releases"
application: "When preparing releases, managing versions, or publishing packages"
applyTo: "**/*release*,**/*publish*,**/*version*,**/*changelog*"
---

# Release Process

## Pre-Release Checklist

- [ ] All tests pass
- [ ] CHANGELOG updated with version header
- [ ] Version bumped in package.json
- [ ] No uncommitted changes
- [ ] Branch is main/master

## Versioning (SemVer)

| Change Type | Version Bump |
|-------------|--------------|
| Breaking | Major (X.0.0) |
| Feature | Minor (x.X.0) |
| Fix/patch | Patch (x.x.X) |

## Release Flow

1. **Preflight**: Run quality gates
2. **Commit**: Final version/changelog commit
3. **Tag**: `git tag vX.Y.Z`
4. **Push**: `git push && git push --tags`
5. **Publish**: Platform-specific (npm, vsix, etc.)

## Rollback

- Keep previous version artifacts
- Tag rollback commits clearly
- Communicate to users

## Anti-Patterns

- Releasing without tests
- Manual version edits (drift)
- No tags (can't rollback)
- Skipping changelog
