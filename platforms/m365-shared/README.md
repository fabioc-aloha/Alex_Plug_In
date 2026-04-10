# M365 Shared Knowledge Modules

Shared knowledge files and OneDrive templates consumed by all heirs (M365 Copilot, GCX Coworker, VS Code). These are the **source of truth** — heir-specific folders get copies at deployment time.

## Architecture

```
m365-shared/
├── knowledge/                       ← Source of truth (7 shared .txt files)
│   ├── cognitive-protocols.txt
│   ├── writing-communication.txt
│   ├── data-analysis.txt
│   ├── business-operations.txt
│   ├── presentations.txt
│   ├── research-methodology.txt
│   └── code-quality.txt
│
├── onedrive-templates/AI-Memory/    ← User creates this folder in OneDrive
│   ├── profile.md                   ← User identity, preferences, expertise
│   ├── notes.md                     ← Session logs, reminders, observations
│   ├── learning-goals.md            ← Goals with progress tracking
│   └── global-knowledge.md          ← Cross-project insights, reusable patterns
│
m365-copilot/appPackage/knowledge/   ← 7 shared + 3 heir-specific = 10 files
│   ├── [shared copies]
│   ├── identity.txt                 ← Alex Finch identity + memory system
│   ├── workflows.txt                ← M365 daily workflows
│   └── m365-integration.txt         ← File delivery, brand colors
│
gcx-coworker/knowledge/              ← 7 shared + 2 heir-specific = 9 files
    ├── [shared copies]
    ├── gcx-identity.txt             ← GCX persona modes, quality standards
    └── gcx-specialization.txt       ← CX metrics, SharePoint org, Power Automate
```

## OneDrive AI-Memory Folder

Shared persistent memory accessed by all heirs:

- **M365 agents**: Read via OneDriveAndSharePoint capability (native)
- **VS Code**: Read via local OneDrive sync path (`%OneDrive%/AI-Memory/` on Windows, `~/OneDrive/AI-Memory/` on macOS)
- **Write-back**: Agents generate content, user saves manually (M365 agents cannot write to OneDrive)

Templates are in `onedrive-templates/AI-Memory/`. Users copy these to their OneDrive root on first setup.

## Deployment

### Alex M365 (Code-First via Teams Toolkit)

Copy shared files into `m365-copilot/appPackage/knowledge/` before packaging:

```powershell
Copy-Item -Path "platforms/m365-shared/knowledge/*.txt" -Destination "platforms/m365-copilot/appPackage/knowledge/" -Force
```

Then sideload via Teams Toolkit as usual.

### GCX Coworker (Agent Builder UI)

Upload all 9 files (7 shared + 2 GCX-specific) via Agent Builder > Knowledge > Embedded Files.

GCX also needs `.docx` versions for Agent Builder. Convert using:

```powershell
Get-ChildItem "platforms/gcx-coworker/knowledge/*.txt" | ForEach-Object {
    # Use pandoc or manual conversion for Agent Builder upload
    pandoc $_.FullName -o ($_.FullName -replace '\.txt$', '.docx')
}
```

## Format

All files use LLM-optimized `.txt` format:
- No markdown tables (token-wasteful pipe/dash syntax)
- Structured with clear headers and indented lists
- Keeps unique frameworks, rubrics, and templates
- Removes content LLMs already know from general training
- Concise but detailed enough to ground responses
