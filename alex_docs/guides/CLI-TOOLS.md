# CLI Tools

All the command-line tools needed to develop and run Alex-powered projects.

## Prerequisites

### macOS

**Xcode Command Line Tools**: gives you `git`, `clang`, `make`, and other essentials:

```bash
xcode-select --install
```

**Homebrew**: the package manager for macOS:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installation, add to your shell profile (Apple Silicon / A-series):

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zprofile"
```

### Windows

**winget** comes pre-installed on Windows 11. If missing, install "App Installer" from the Microsoft Store.

**Git for Windows**: gives you `git`, `bash`, and Unix tools:

```powershell
winget install Git.Git
```

**Visual Studio Build Tools**: the Windows equivalent of Xcode CLT (only needed for native npm modules):

```powershell
winget install Microsoft.VisualStudio.2022.BuildTools
```

## Core Runtimes

| Tool              | macOS                 | Windows                             | Used For                                         |
| ----------------- | --------------------- | ----------------------------------- | ------------------------------------------------ |
| **Node.js** (18+) | `brew install node`   | `winget install OpenJS.NodeJS.LTS`  | All muscles, hooks, shared modules, npm packages |
| **Git**           | `brew install git`    | `winget install Git.Git`            | Version control, hooks, sync scripts             |
| **Python 3**      | `brew install python` | `winget install Python.Python.3.12` | Optional: data projects, scripting               |

Verify after install (same commands on both platforms):

```bash
node --version    # Should be 18.x or higher
npm --version     # Comes with Node.js
git --version     # Should be 2.x+
python3 --version # If installed (use 'python --version' on Windows)
```

## Document Pipeline

These tools power the markdown-to-document conversion muscles.

| Tool       | macOS                 | Windows                                | Used For                                         |
| ---------- | --------------------- | -------------------------------------- | ------------------------------------------------ |
| **Pandoc** | `brew install pandoc` | `winget install JohnMacFarlane.Pandoc` | Markdown to Word, Markdown to Email, Lua filters |

Pandoc includes its own Lua interpreter, so the `.github/muscles/lua-filters/` work without a separate Lua install.

### SVG Pipeline

The `svg-pipeline.cjs` muscle converts SVG diagrams. It checks for these tools in order and uses the first one found:

| Tool            | macOS                          | Windows                                  | Notes                                      |
| --------------- | ------------------------------ | ---------------------------------------- | ------------------------------------------ |
| **Inkscape**    | `brew install --cask inkscape` | `winget install Inkscape.Inkscape`       | Full-featured vector editor, best quality  |
| **librsvg**     | `brew install librsvg`         | N/A (use Inkscape or ImageMagick)        | Lightweight, recommended for CI/automation |
| **ImageMagick** | `brew install imagemagick`     | `winget install ImageMagick.ImageMagick` | Versatile but lower SVG quality            |

Pick one. On macOS, `librsvg` is the lightest option. On Windows, Inkscape or ImageMagick.

## Shell Enhancements

These make the terminal more productive:

| Tool         | macOS                   | Windows                                  | What It Does                          |
| ------------ | ----------------------- | ---------------------------------------- | ------------------------------------- |
| **Starship** | `brew install starship` | `winget install Starship.Starship`       | Fast, customizable shell prompt       |
| **tree**     | `brew install tree`     | Built-in (`tree` command)                | Directory tree visualization          |
| **htop**     | `brew install htop`     | N/A (use Task Manager or `btop`)         | Interactive process viewer            |
| **bat**      | `brew install bat`      | `winget install sharkdp.bat`             | `cat` with syntax highlighting        |
| **fd**       | `brew install fd`       | `winget install sharkdp.fd`              | Faster `find` replacement             |
| **ripgrep**  | `brew install ripgrep`  | `winget install BurntSushi.ripgrep.MSVC` | Faster `grep` replacement             |
| **fzf**      | `brew install fzf`      | `winget install junegunn.fzf`            | Fuzzy finder for files, history, etc. |
| **jq**       | `brew install jq`       | `winget install jqlang.jq`               | JSON processor (used by nav scripts)  |
| **tldr**     | `brew install tldr`     | `npm install -g tldr`                    | Simplified man pages                  |
| **wget**     | `brew install wget`     | `winget install GnuWin32.Wget`           | File downloader                       |

## One-Liner Install

**macOS** (via Homebrew):

```bash
# Core
brew install node git python pandoc librsvg jq

# Shell enhancements
brew install starship tree htop bat fd ripgrep fzf tldr wget
```

**Windows** (via winget):

```powershell
# Core
winget install OpenJS.NodeJS.LTS Git.Git Python.Python.3.12 JohnMacFarlane.Pandoc ImageMagick.ImageMagick jqlang.jq

# Shell enhancements
winget install Starship.Starship sharkdp.bat sharkdp.fd BurntSushi.ripgrep.MSVC junegunn.fzf
```

## Verifying Your Setup

**macOS / Linux** (bash/zsh):

```bash
echo "=== Alex Dev Environment Check ==="
for cmd in node npm git pandoc rsvg-convert jq; do
    if command -v "$cmd" &>/dev/null; then
        echo "OK $cmd: $(command -v "$cmd")"
    else
        echo "MISSING $cmd: NOT FOUND"
    fi
done
```

**Windows** (PowerShell):

```powershell
Write-Host "=== Alex Dev Environment Check ==="
foreach ($cmd in @('node', 'npm', 'git', 'pandoc', 'magick', 'jq')) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        Write-Host "OK $cmd: $((Get-Command $cmd).Source)"
    } else {
        Write-Host "MISSING $cmd: NOT FOUND"
    }
}
```
