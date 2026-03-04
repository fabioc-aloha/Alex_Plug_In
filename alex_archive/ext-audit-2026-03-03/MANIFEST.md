# Extension Audit Archive — 2026-03-03

## Purpose

Systematic audit of `platforms/vscode-extension/` to remove unused files, images, icons, and build artifacts.

## Archived Files

### Unused Root Assets (6 files)

These assets were not referenced anywhere in source code, package.json, README, or .vscodeignore:

| File                          | Reason                                          |
| ----------------------------- | ----------------------------------------------- |
| `assets/apple-touch-icon.png` | Web-only asset, not used by VS Code extension   |
| `assets/favicon.ico`          | Web-only asset, not used by VS Code extension   |
| `assets/favicon.svg`          | Web-only asset, not used by VS Code extension   |
| `assets/logo-128.png`         | Superseded by `icon.png` (used in package.json) |
| `assets/logo-256.png`         | Superseded by `icon.png` (used in package.json) |
| `assets/logo-512.png`         | Superseded by `icon.png` (used in package.json) |

### Unused Source Files (1 file)

| File                          | Reason                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `src/shared/webviewStyles.ts` | Only referenced in a comment (welcomeView.ts:40), never imported or used. Comment removed. |

## Deleted (Not Archived)

| Item                                     | Size                   | Reason                                                                  |
| ---------------------------------------- | ---------------------- | ----------------------------------------------------------------------- |
| `.vscode-test/`                          | ~2.9 GB (23,571 files) | Downloaded VS Code test instance — regenerated on demand by test runner |
| `alex-cognitive-architecture-6.1.0.vsix` | 30.9 MB                | Stale package from reverted work; current release is 6.0.3              |

## Additional Cleanup

| Action                                | File                       | Detail                                               |
| ------------------------------------- | -------------------------- | ---------------------------------------------------- |
| Added `.vscode-test/` to `.gitignore` | `.gitignore`               | Prevents accidental tracking of ~3 GB test artifacts |
| Removed stale comment                 | `src/views/welcomeView.ts` | Line 40 referenced archived `webviewStyles.ts`       |

## Confirmed USED (Not Archived)

All avatar images (113 files across agents/ages/personas/states + loose) confirmed referenced in source code. Both `.webp` (primary) and `.png` (fallback) formats required by `personaDetection.ts`.

Used root assets: `banner.png`, `banner.svg`, `favicon.png`, `icon.png`, `logo-mono.svg`, `logo.png`, `logo.svg`.

## Space Recovered

- Archived: 7 files (~1.5 MB)
- Deleted: ~2.96 GB (test runtime + stale vsix)
- Total: **~2.96 GB freed**
