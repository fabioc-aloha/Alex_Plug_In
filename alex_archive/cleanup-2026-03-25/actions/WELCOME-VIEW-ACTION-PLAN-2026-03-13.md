# 🔧 Action Plan — Welcome View Menu & Actions (2026‑03‑13)

## 🎯 Scope
Review and harden the Welcome panel’s message handling (`welcomeView.ts`) and menu action wiring. Focus on:
- Message schema validation and safe routing
- Await/feedback for commands and long-running actions
- Operation lock coverage
- Tests and telemetry

## 🧩 Findings → Actions
| # | Finding | Action | Owner | Status |
|---|---------|--------|-------|--------|
| 1 | Commands executed without `await`; errors are silent | Wrap `executeCommand` calls in `await` + `try/catch`. Show toast on failure. | Dev | ✅ |
| 2 | `message` payload is untyped/unchecked | Add lightweight schema guard (e.g., Zod or manual switch guard) per `message.command`. | Dev | ✅ |
| 3 | Operation lock covers only `dream`, `setupEnvironment` | Extend to `releasePreflight`, `runAudit`, `generateGamma*`, `generatePptx`, `generateAIImage`. | Dev | ✅ |
| 4 | No progress/toasts for long-running ops | Add `withProgress` for PPTX/AI/gen diagram/gen tests flows. | Dev | ✅ |
| 5 | No telemetry on toggles and URL clicks | Emit `logInfo` + (if available) telemetry events for toggles/external links; include command name. | Dev | ✅ |
| 6 | `tabSwitch` currently logs only | Store last tab in `memento` and restore on refresh. Add tests. | Dev | ✅ |
| 7 | `toggleSetting` can write empty `configKey` if key malformed | Add guard for `configKey` non-empty; toast on invalid key. | Dev | ✅ |
| 8 | Tests missing for message routing | Add unit tests to simulate `onDidReceiveMessage` and assert `executeCommand` targets. | QA | ✅ |
| 9 | Docs not updated | Add section to `TEST-GUIDE.md` on welcome actions + how to simulate messages. | Docs | ✅ |

## 🛠️ Implementation Notes
- **Schema guard example:**
  ```ts
  type WelcomeMessage = { command: string; [k: string]: unknown };
  const isKnownCommand = (msg: any): msg is WelcomeMessage => typeof msg?.command === 'string';
  ```
- **Command wrapper:**
  ```ts
  async function runCmd(id: string, payload?: any) {
    try {
      await vscode.commands.executeCommand(id, payload);
    } catch (err) {
      console.error(`[Alex][Welcome] ${id} failed`, err);
      vscode.window.showErrorMessage(`Alex: ${id} failed. See console for details.`);
    }
  }
  ```
- **Progress wrapper** for long-running flows:
  ```ts
  await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Alex: Generating PPTX...' }, () => runCmd('alex.generatePptx'));
  ```
- **Operation lock**: reuse `isOperationInProgress()`; optionally add `startOperation/endOperation` around long flows.

## ✅ Verification Commands
Run these after implementing:
- `npm run lint`
- `npx tsc --noEmit --noUnusedLocals --noUnusedParameters`
- `npm test`
- `npm run quality-gate` (Gate 2 parity + Gate 6 frontmatter)

## 🧪 Suggested Tests
- Unit test: message with `command: 'generatePptx'` calls `alex.generatePptx` with await.
- Unit test: malformed message (`command: 123`) is ignored safely.
- Unit test: `tabSwitch` message saves memento and posts to webview.
- Integration test: toggling setting updates config (mock `workspace.getConfiguration`).

## 📌 Acceptance Criteria
- No unawaited `executeCommand` calls in `welcomeView.ts`.
- Message schema guard present; unknown commands no-op gracefully.
- Operation lock covers designated commands.
- Tests pass and quality gate unchanged.

## 📅 Timeline
- Day 1: Implement command wrapper, schema guards, extend lock.
- Day 2: Add tests, update docs, run full suite.
- Day 3: Code review/merge.

## 🔗 References
- `platforms/vscode-extension/src/views/welcomeView.ts`
- `platforms/vscode-extension/src/views/welcomeViewHtml.ts`
- `platforms/vscode-extension/TEST-GUIDE.md`
- `platforms/vscode-extension/src/test/suite/*`
