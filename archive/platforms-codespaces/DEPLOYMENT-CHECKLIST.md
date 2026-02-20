# Alex Codespaces — Deployment Checklist

> Complete checklist for deploying Alex Cognitive Architecture to GitHub Codespaces

## Pre-Deployment Requirements

### Repository

| #   | Requirement                     | How to Check                                        | Status |
| --- | ------------------------------- | --------------------------------------------------- | ------ |
| 1   | **Repository hosted on GitHub** | `git remote -v` shows github.com origin             | ⬜      |
| 2   | **Codespaces enabled for repo** | Repo Settings → Codespaces → enabled (default: yes) | ⬜      |
| 3   | **GitHub Copilot access**       | User/org has Copilot license                        | ⬜      |

### User Requirements

| #   | Requirement                          | How to Check                                   | Status |
| --- | ------------------------------------ | ---------------------------------------------- | ------ |
| 4   | **Codespaces access**                | User can create Codespaces (free tier or paid) | ⬜      |
| 5   | **GitHub Copilot license**           | For @alex chat participant functionality       | ⬜      |
| 6   | **Global Knowledge repo (optional)** | `Alex-Global-Knowledge` repo exists on GitHub  | ⬜      |

---

## Deployment Steps

### Step 1: Run Deploy Script

| #   | Action                            | Command / Detail                            | Status |
| --- | --------------------------------- | ------------------------------------------- | ------ |
| 7   | **Navigate to target repo**       | `cd C:\path\to\your-project`                | ⬜      |
| 8   | **Run deploy script**             | `& "platforms\codespaces\deploy.ps1"`       | ⬜      |
| 9   | **Or with custom user**           | `.\deploy.ps1 -GitHubUser "your-username"`  | ⬜      |
| 10  | **Verify .devcontainer/ created** | `Test-Path .devcontainer\devcontainer.json` | ⬜      |

### Step 2: Verify devcontainer.json

| #   | Check                           | Expected Value                                           | Status |
| --- | ------------------------------- | -------------------------------------------------------- | ------ |
| 11  | **Extension included**          | `fabioc-aloha.alex-cognitive-architecture` in extensions | ⬜      |
| 12  | **Copilot extensions included** | `GitHub.copilot` and `GitHub.copilot-chat` in extensions | ⬜      |
| 13  | **Agent mode enabled**          | `chat.agent.enabled: true` in settings                   | ⬜      |
| 14  | **Skills path configured**      | `chat.agentSkillsLocations: [".github/skills"]`          | ⬜      |
| 15  | **AGENTS.md enabled**           | `chat.useAgentsMdFile: true`                             | ⬜      |
| 16  | **GK clone command present**    | `postCreateCommand` with git clone (unless -SkipGK)      | ⬜      |

### Step 3: Alex Architecture

| #   | Check                               | Detail                                                        | Status |
| --- | ----------------------------------- | ------------------------------------------------------------- | ------ |
| 17  | **`.github/` exists**               | Either pre-existing or will be created via `Alex: Initialize` | ⬜      |
| 18  | **instructions/ present**           | Procedural memory files                                       | ⬜      |
| 19  | **skills/ present**                 | Portable skill library                                        | ⬜      |
| 20  | **copilot-instructions.md present** | Main Alex personality + architecture                          | ⬜      |

### Step 4: Commit & Push

| #   | Action                 | Command                                                   | Status |
| --- | ---------------------- | --------------------------------------------------------- | ------ |
| 21  | **Stage devcontainer** | `git add .devcontainer/`                                  | ⬜      |
| 22  | **Commit**             | `git commit -m "chore: add Alex Codespaces devcontainer"` | ⬜      |
| 23  | **Push to GitHub**     | `git push`                                                | ⬜      |

---

## Validation (In Codespace)

### Step 5: Launch & Verify

| #   | Check                         | How to Verify                                 | Status |
| --- | ----------------------------- | --------------------------------------------- | ------ |
| 24  | **Open Codespace**            | GitHub repo → Code → Codespaces → New         | ⬜      |
| 25  | **Alex extension installed**  | Extensions sidebar shows Alex Cognitive       | ⬜      |
| 26  | **Alex sidebar visible**      | Alex icon in activity bar, welcome view loads | ⬜      |
| 27  | **Persona detected**          | Welcome view shows detected persona + P5-P7   | ⬜      |
| 28  | **GK cloned (if configured)** | `ls ~/.alex/global-knowledge/` shows files    | ⬜      |
| 29  | **Chat works**                | `@alex /status` returns architecture info     | ⬜      |
| 30  | **Commands available**        | Ctrl+Shift+P → "Alex:" shows command palette  | ⬜      |

### Step 6: Feature Smoke Test

| #   | Feature                      | Test                                    | Status |
| --- | ---------------------------- | --------------------------------------- | ------ |
| 31  | **Dream**                    | `Alex: Dream` → completes without error | ⬜      |
| 32  | **Health Dashboard**         | Click Health in sidebar → webview opens | ⬜      |
| 33  | **Focus Session**            | Start Pomodoro → timer appears          | ⬜      |
| 34  | **Knowledge search (if GK)** | `@alex /knowledge` returns results      | ⬜      |

---

## Team Deployment

| #   | Action                      | Detail                                           | Status |
| --- | --------------------------- | ------------------------------------------------ | ------ |
| 35  | **Share devcontainer.json** | Committed to repo — team gets it automatically   | ⬜      |
| 36  | **Share GK repo name**      | Team clones same `Alex-Global-Knowledge` repo    | ⬜      |
| 37  | **Document in repo README** | Note that Codespaces includes Alex pre-installed | ⬜      |

---

## Troubleshooting

| Issue                   | Solution                                               |
| ----------------------- | ------------------------------------------------------ |
| Extension not installed | Check `devcontainer.json` has correct extension ID     |
| GK not cloned           | Verify `postCreateCommand` and GitHub username         |
| Settings not applied    | Restart Codespace or rebuild container                 |
| Alex commands missing   | Extension may need reload — `Developer: Reload Window` |
| `.github/` not found    | Run `Alex: Initialize Architecture` in the Codespace   |
