# Wiki Source Files

This folder contains the source files for the [Alex Cognitive Architecture Wiki](https://github.com/fabioc-aloha/Alex_Plug_In/wiki).

## Contents

| File | Purpose |
|------|---------|
| `Home.md` | Wiki landing page |
| `Getting-Started.md` | Installation and first-time setup |
| `User-Manual.md` | Complete command and UI reference |
| `Heir-Project-Setup.md` | Configure Alex for your projects |
| `FAQ.md` | Frequently asked questions |
| `_Sidebar.md` | Navigation sidebar (GitHub Wiki special file) |
| `_Footer.md` | Footer on all pages (GitHub Wiki special file) |

## Deploying to GitHub Wiki

### Option 1: GitHub Web Interface

1. Go to the repo's **Wiki** tab
2. Click **Create the first page**
3. Copy content from `Home.md`
4. Create additional pages by clicking **New Page**

### Option 2: Clone and Push (Recommended)

GitHub Wikis are stored in a separate git repository:

```bash
# Clone the wiki repo
git clone https://github.com/fabioc-aloha/Alex_Plug_In.wiki.git

# Copy wiki files
cp -r wiki/* Alex_Plug_In.wiki/

# Push to wiki
cd Alex_Plug_In.wiki
git add -A
git commit -m "docs: Initialize wiki from source"
git push
```

### Option 3: GitHub Actions (Automated)

Add a workflow to sync on push:

```yaml
name: Sync Wiki
on:
  push:
    paths:
      - 'wiki/**'
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Sync to Wiki
        uses: Andrew-Chen-Wang/github-wiki-action@v4
        with:
          path: wiki
```

## Editing Guidelines

1. **Keep it user-focused** — This is for end users, not developers
2. **No Node.js commands** — Users don't have Node installed
3. **Test links** — GitHub Wiki uses different link format than regular Markdown
4. **Special files** — `_Sidebar.md` and `_Footer.md` are auto-rendered by GitHub

## Link Format

GitHub Wiki links use page names, not file paths:

```markdown
<!-- Correct -->
[Getting Started](Getting-Started)
[Commands](User-Manual#chat-commands)

<!-- Incorrect -->
[Getting Started](./Getting-Started.md)
[Commands](User-Manual.md#chat-commands)
```

## Roadmap Alignment

This wiki supports the **📚 Docs** lane in [PLAN-v8.0.0.md](../PLAN-v8.0.0.md):

| Task ID | Status | Wiki Page |
|---------|--------|-----------|
| D1 | ✅ | Structure created |
| D2 | ✅ | Getting-Started.md |
| D3 | ✅ | User-Manual.md |
| D4 | ✅ | Heir-Project-Setup.md |

---

*Wiki source files are version-controlled with the main repo for consistency.*
