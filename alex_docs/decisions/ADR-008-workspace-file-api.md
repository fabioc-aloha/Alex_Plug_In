# ADR-008: Workspace File API Strategy

**Status**: Accepted
**Date**: 2026-02-07
**Context**: VS Code integration audit identified mixed use of Node.js `fs-extra` and `vscode.workspace.fs`

## Decision

The extension currently uses `fs-extra` (Node.js) for all file operations. After audit analysis, we've decided to:

1. **Keep fs-extra** for:
   - Extension bundle files (`context.extensionPath/...`)
   - Global storage files (`~/.alex/`)
   - Export operations (PPTX, audio, temporary files)

2. **Document as future enhancement** converting workspace file operations to `vscode.workspace.fs`:
   - Workspace `.github/` folder reads/writes
   - Skill catalog generation
   - Session, goals, health check files

## Rationale

- **Scope**: 19 source files use `fs-extra`; converting all is high effort
- **Current use case**: Local workspaces work correctly
- **Remote workspaces**: Not currently a primary use case for Alex
- **Risk**: Breaking changes outweigh benefit for current users

## Affected Files (Workspace Operations)

| File                    | Usage                        | Priority |
| ----------------------- | ---------------------------- | -------- |
| `healthCheck.ts`        | Reads `.github/` files       | Medium   |
| `synapse-core.ts`       | Reads/writes synapses.json   | High     |
| `tools.ts`              | Various workspace operations | Medium   |
| `contextMenu.ts`        | Saves insights               | Low      |
| `session.ts`            | Session files                | Low      |
| `goals.ts`              | Goals JSON                   | Low      |
| `self-actualization.ts` | Assessment files             | Low      |
| `memoryTreeProvider.ts` | Memory tree                  | Medium   |
| `skillCatalog.ts`       | Skill catalog                | Low      |
| `heirValidation.ts`     | Validation checks            | Low      |

## Consequences

- **Positive**: No breaking changes, faster delivery
- **Negative**: Remote (SSH, Codespaces, WSL) workspace may have limited support
- **Mitigation**: Document limitation in RISKS.md or README

## Future Migration

When remote workspace support becomes a priority:

1. Create `workspaceFs.ts` utility wrapping `vscode.workspace.fs`
2. Replace workspace file operations incrementally
3. Keep `fs-extra` for extension/global files

## References

- [VS Code FileSystem API](https://code.visualstudio.com/api/references/vscode-api#FileSystem)
- [Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)
