# npm Packages

Node.js packages required by Alex muscles, converters, and generation pipelines.

## Global Packages

These are used by multiple muscles and should be installed globally:

| Package                     | Install                                  | Used By                                                                       |
| --------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------- |
| **@mermaid-js/mermaid-cli** | `npm install -g @mermaid-js/mermaid-cli` | `md-to-word.cjs`, `mermaid-pipeline.cjs`: renders Mermaid diagrams to SVG/PNG |
| **svgexport**               | `npm install -g svgexport`               | `md-to-word.cjs`, `mermaid-pipeline.cjs`: optional SVG to PNG export fallback |
| **tsx**                     | `npm install -g tsx`                     | `dream-cli.ts`, `pptxgen-cli.ts`: runs TypeScript muscles directly            |

Install all at once:

```bash
npm install -g @mermaid-js/mermaid-cli svgexport tsx
```

Verify:

```bash
mmdc --version       # Mermaid CLI
svgexport --help     # SVG exporter
tsx --version        # TypeScript executor
```

## Project-Local Packages

These are `require()`-d by individual muscles. In a project with a `package.json`, install them locally. Otherwise, they're resolved from the VS Code extension's `node_modules` via `NODE_PATH`.

| Package       | npm Install             | Used By              | Notes                                                            |
| ------------- | ----------------------- | -------------------- | ---------------------------------------------------------------- |
| **jszip**     | `npm install jszip`     | `md-to-word.cjs`     | OOXML post-processing for Word documents                         |
| **dotenv**    | `npm install dotenv`    | `replicate-core.cjs` | Loads `.env` files for API tokens. Graceful fallback if missing. |
| **replicate** | `npm install replicate` | `replicate-core.cjs` | Replicate AI API client for image/video generation               |
| **pptxgenjs** | `npm install pptxgenjs` | `pptxgen-cli.ts`     | Programmatic PowerPoint generation                               |

### The NODE_PATH Pattern

Some muscles (like `md-to-word.cjs`) rely on packages from the Alex VS Code extension's `node_modules` rather than a local install. If you get "Cannot find module" errors, set `NODE_PATH`:

**macOS / Linux**

```bash
# Find the extension's node_modules
export NODE_PATH="$HOME/.vscode/extensions/<alex-extension>/node_modules"

# Or add to your .zprofile for persistence
echo 'export NODE_PATH="$HOME/.vscode/extensions/<alex-extension>/node_modules"' >> ~/.zprofile
```

**Windows (PowerShell)**

```powershell
# Set for the current session
$env:NODE_PATH = "$env:USERPROFILE\.vscode\extensions\<alex-extension>\node_modules"

# Or add to your PowerShell profile for persistence
Add-Content $PROFILE '$env:NODE_PATH = "$env:USERPROFILE\.vscode\extensions\<alex-extension>\node_modules"'
```

Replace `<alex-extension>` with the actual extension folder name (e.g., `fabioc-aloha.alex-cognitive-architecture-6.8.2`).

## Setting Up a New Project

If you're creating a new Alex-powered project that needs muscles:

```bash
# Initialize package.json
npm init -y

# Install muscle dependencies
npm install jszip dotenv

# Optional: AI generation
npm install replicate

# Optional: PowerPoint generation
npm install pptxgenjs
```

## Checking What's Installed

```bash
# Global packages
npm list -g --depth=0

# Local packages (in a project directory)
npm list --depth=0
```

To check `NODE_PATH`:

**macOS / Linux**: `echo $NODE_PATH`

**Windows**: `$env:NODE_PATH`

## Troubleshooting

### "Cannot find module" for muscles

1. Check if the package is installed globally: `npm list -g <package>`
2. Check if `NODE_PATH` is set: `echo $NODE_PATH` (macOS) or `$env:NODE_PATH` (Windows)
3. Try installing locally in the project: `npm install <package>`

### Mermaid CLI renders blank diagrams

The `mmdc` command needs a Chromium browser. On first run, it may download one automatically. If it fails:

```bash
# Install Chromium manually
npx puppeteer browsers install chrome
```

### npm permission errors (macOS / Linux only)

Never use `sudo npm install -g`. Instead, configure npm to use a user-owned directory:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zprofile
source ~/.zprofile
```

On Windows, npm global installs go to `%APPDATA%\npm` by default and do not require elevated permissions.
