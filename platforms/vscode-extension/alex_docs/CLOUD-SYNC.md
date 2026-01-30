# ☁️ Your Knowledge, Everywhere

> Backup and sync your insights across machines

---

## Why Sync Matters

Your institutional knowledge shouldn't be trapped on one computer. Cloud sync backs up your global knowledge to a private GitHub Gist, giving you:

**Protection.** If your hard drive fails or you spill coffee on your laptop, your insights survive.

**Portability.** Work laptop, home machine, new computer—your knowledge follows you.

**Multi-machine access.** Save an insight at work, access it at home. Everything stays in sync.

---

## How It Works

Alex stores your global knowledge in `~/.alex/` on your local machine. Cloud sync creates a private Gist in your GitHub account containing a backup of this knowledge.

Sync is bidirectional. Local changes push to the cloud. Cloud changes (from other machines) pull to local. When there are changes on both sides, Alex merges them intelligently—newer entries win, nothing gets lost.

---

## Automatic Sync

Alex syncs automatically without you doing anything:

**On startup.** A few seconds after VS Code opens, Alex syncs to make sure you have the latest from other machines.

**Periodically.** Every five minutes while VS Code is running, Alex checks and syncs any changes.

**After modifications.** When you save an insight or promote knowledge, Alex syncs within a few seconds.

You'll see sync activity in the output channel if you're curious, but most of the time it just works in the background.

---

## Manual Sync

Sometimes you want to sync immediately. Just say:

*"Sync my knowledge"*

Or use the keyboard shortcut `Ctrl+Alt+K`, or click **Sync to Cloud** in the status bar menu.

You can also be more specific:

- *"Push my knowledge to cloud"* — upload local changes
- *"Pull knowledge from cloud"* — download remote changes
- *"Sync"* — bidirectional merge (the default)

---

## Authentication

Cloud sync uses GitHub's authentication through VS Code. If you're already signed into GitHub in VS Code, you're good to go. No separate login required.

The first time you sync, VS Code may prompt you to authorize the GitHub connection. After that, it's automatic.

---

## Privacy and Security

Your knowledge lives in a **private** Gist that only you can access. Nobody else can see your insights unless you explicitly share the Gist URL.

The Gist is named `alex-global-knowledge` and contains your patterns and insights in JSON format. You can view it directly at gist.github.com if you're curious.

---

## Multi-Machine Setup

Setting up sync on a new machine is simple:

1. Install the Alex extension
2. Make sure you're signed into GitHub in VS Code
3. Say *"sync my knowledge"* or run `Alex: Sync Knowledge to Cloud`

Alex pulls your existing knowledge from the cloud. You're immediately up to date with everything you've saved on other machines.

---

## Troubleshooting Sync

**Sync failing?** Check that you're signed into GitHub in VS Code. Try signing out and back in if there are auth issues.

**Not seeing recent changes?** Sync is eventually consistent. Give it a minute, then try manual sync.

**Want to start fresh?** You can delete the Gist from gist.github.com and Alex will create a new one on next sync.

---

## The Payoff

Over time, your global knowledge accumulates. Every insight you save, every pattern you promote, every lesson you learn—it's all backed up and accessible everywhere.

Switch jobs? Your knowledge follows. Get a new computer? Everything's there. Work from multiple machines? Always in sync.

Your institutional knowledge becomes truly portable.

---

*For technical details on sync protocols and file formats, see the project documentation.*
