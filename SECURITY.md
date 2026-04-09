# Security Policy

## Supported Versions

| Version | Supported             |
| ------- | --------------------- |
| 7.x.x   | ✅ Actively supported  |
| 6.x.x   | ⚠️ Security fixes only |
| < 6.0   | ❌ No longer supported |

## Reporting a Vulnerability

If you discover a security vulnerability in Alex Cognitive Architecture, please report it responsibly:

### 📧 Contact

**Email**: [Create a private security advisory on GitHub](https://github.com/fabioc-aloha/Alex_Plug_In/security/advisories/new)

### ⏱️ Response Time

| Severity | Initial Response | Resolution Target |
| -------- | ---------------- | ----------------- |
| Critical | 24 hours         | 7 days            |
| High     | 48 hours         | 14 days           |
| Medium   | 5 days           | 30 days           |
| Low      | 14 days          | 60 days           |

### What to Include

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Affected versions**
4. **Potential impact**
5. **Suggested fix** (if applicable)

### What to Expect

1. **Acknowledgment** — We'll confirm receipt of your report
2. **Investigation** — We'll investigate and validate the issue
3. **Fix Development** — We'll develop and test a fix
4. **Disclosure** — We'll coordinate disclosure with you
5. **Credit** — We'll credit you in the release notes (unless you prefer anonymity)

## Security Measures

### Architecture

- **Local-first design** — Data stays on your machine by default
- **No telemetry** — We don't collect usage data
- **Minimal dependencies** — Reduced supply chain attack surface
- **VS Code sandbox** — Extension runs in VS Code's security sandbox

### Secret Management

- **SecretStorage API** — API keys stored encrypted via VS Code
- **No hardcoded secrets** — All credentials externalized
- **Transient tokens** — Session tokens not persisted

### Network Security

- **HTTPS only** — All external communication encrypted
- **Minimal external calls** — Only GitHub (opt-in) and Replicate/Gamma (opt-in)
- **No data exfiltration** — Your code never leaves your machine

### Webview Security

- **Content Security Policy (CSP)** — Prevents XSS attacks
- **No inline scripts** — All JavaScript in separate files
- **Sanitized HTML** — User content escaped before rendering

### Agent Hooks & Terminal Sandboxing

Alex uses VS Code agent hooks (`.github/hooks.json`) to automate cognitive workflows. These hooks execute shell commands at session start/stop and before/after tool use.

**⚠️ macOS/Linux Users**: Enable terminal sandboxing to restrict what hook commands can access:

```json
// .vscode/settings.json
{
  "chat.tools.terminal.sandbox.enabled": true,
  "chat.tools.terminal.sandbox.macFileSystem": {
    "allowWrite": ["."],
    "denyWrite": ["./.github/config/MASTER-ALEX-PROTECTED.json"]
  },
  "chat.tools.terminal.sandbox.linuxFileSystem": {
    "mode": "project"
  }
}
```

**Sandbox Settings**:
| Setting                                       | Platform    | Purpose                             |
| --------------------------------------------- | ----------- | ----------------------------------- |
| `chat.tools.terminal.sandbox.enabled`         | macOS/Linux | Enable sandboxed terminal execution |
| `chat.tools.terminal.sandbox.macFileSystem`   | macOS       | File system access restrictions     |
| `chat.tools.terminal.sandbox.linuxFileSystem` | Linux       | File system access mode             |
| `chat.tools.terminal.sandbox.network`         | macOS/Linux | Network access restrictions         |

**Windows Users**: Terminal sandboxing is not available on Windows. Hooks execute in the normal VS Code terminal context. Use the Master Alex Protected marker (`.github/config/MASTER-ALEX-PROTECTED.json`) as a safety gate.

## Autopilot Mode Safety

VS Code's Autopilot mode (`chat.autopilot.enabled`) allows the agent to execute tool calls without manual approval. Alex ships with safety hooks that enforce boundaries even in non-interactive mode.

### Safety Hooks Active in Autopilot

| Hook                     | Event            | Protection                                                               |
| ------------------------ | ---------------- | ------------------------------------------------------------------------ |
| `pre-tool-use.cjs`       | PreToolUse       | I3/I4: Blocks Initialize/Reset on Master Alex (exit 2)                   |
| `pre-tool-use.cjs`       | PreToolUse       | H8: Denies heir contamination (writing master files from heir workspace) |
| `pre-tool-use.cjs`       | PreToolUse       | H9: Denies I8 violations (architecture depending on extension)           |
| `prompt-safety-gate.cjs` | UserPromptSubmit | Scans prompts for embedded secrets and I1 violations                     |

All safety hooks use `decision: "deny"` (not warn) — they block the action even when the user is not present to confirm.

### Recommended Autopilot Workflows

| Workflow                   | Why It's Safe                               | Example                |
| -------------------------- | ------------------------------------------- | ---------------------- |
| Dream / Neural Maintenance | Read-only analysis + write to session files | `@alex /dream`         |
| Meditation                 | Knowledge consolidation in memory files     | `@alex /meditate`      |
| Brain QA                   | Read-only architecture health check         | `@alex /brainqa`       |
| Routine maintenance        | Sync, reindex, validate                     | `@alex reindex skills` |

### Workflows That Require Supervision

| Workflow                      | Risk               | Mitigation                             |
| ----------------------------- | ------------------ | -------------------------------------- |
| Code generation / refactoring | May introduce bugs | Review diffs before committing         |
| File deletion / restructuring | Data loss          | Commit before starting; review changes |
| Publishing / releasing        | Public impact      | Never run `vsce publish` in Autopilot  |
| Infrastructure changes        | External systems   | Always require human approval          |

### Disabling Autopilot

Set `"chat.autopilot.enabled": false` in `.vscode/settings.json` to return to manual approval mode.

---

## Dependency Management

We regularly audit dependencies:

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update
```

### Known Dependencies

| Package    | Purpose           | Risk Level            |
| ---------- | ----------------- | --------------------- |
| `ws`       | WebSocket for TTS | Low (well-maintained) |
| `fs-extra` | File operations   | Low (well-maintained) |

## Secure Development

### Code Review

All changes undergo review for:
- [ ] Hardcoded secrets
- [ ] Unsafe operations (eval, dynamic requires)
- [ ] XSS vulnerabilities in webviews
- [ ] Path traversal risks

### Pre-Release Checklist

- [ ] `npm audit` passes
- [ ] Dependencies updated
- [ ] Security-focused code review completed
- [ ] alex_docs/audits/COMPLIANCE-AUDIT.md updated

## Incident Response

In case of a security incident:

1. **Contain** — Disable affected functionality
2. **Investigate** — Determine scope and impact
3. **Fix** — Develop and test remediation
4. **Release** — Publish patched version
5. **Notify** — Inform affected users
6. **Review** — Post-mortem and process improvement

---

*Thank you for helping keep Alex safe!*
