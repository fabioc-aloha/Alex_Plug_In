# API Keys

Some Alex muscles connect to external AI services for image generation, presentation creation, and cloud operations. Here's how to configure them.

## Environment Variables

API keys are stored as environment variables, never committed to source control.

### Setting Up .env Files

Create a `.env` file in your project root (it's automatically gitignored):

```bash
# .env
REPLICATE_API_TOKEN=r8_your_token_here
GAMMA_API_KEY=sk-gamma-your_key_here
```

The `replicate-core.cjs` muscle loads `.env` automatically via `dotenv`. Other muscles read directly from environment variables.

### Shell Profile (Persistent)

For keys you use across all projects, add them to your shell profile:

**macOS / Linux** (add to `~/.zprofile` or `~/.zshrc`):

```bash
export REPLICATE_API_TOKEN="r8_your_token_here"
export GAMMA_API_KEY="sk-gamma-your_key_here"
```

Then reload: `source ~/.zprofile`

**Windows** (add to your PowerShell profile at `$PROFILE`):

```powershell
$env:REPLICATE_API_TOKEN = "r8_your_token_here"
$env:GAMMA_API_KEY = "sk-gamma-your_key_here"
```

Or set them permanently via System Properties > Environment Variables.

## Services

### Replicate

**What it does**: AI image and video generation (Flux, Ideogram, nano-banana-pro models)

**Used by**: `replicate-core.cjs` for character generation, README banners, brand assets

**Get your token**:

1. Go to replicate.com
2. Sign in with GitHub
3. Go to Account > API Tokens
4. Copy the token (starts with `r8_`)

**Cost**: Pay-per-prediction. Most image generations cost $0.01 to $0.05.

### Gamma

**What it does**: Converts markdown to professional presentations

**Used by**: `gamma-generator.cjs`

**Get your key**:

1. Go to gamma.app
2. Sign in and go to Settings > API
3. Generate an API key

**Cost**: Free tier available, paid plans for higher volume.

### Azure (Optional)

**What it does**: Cloud deployment, Azure OpenAI, Cosmos DB, Static Web Apps, etc.

**Used by**: Azure MCP server, deployment scripts

**Setup**:

**macOS**

```bash
brew install azure-cli
az login
az account set --subscription "Your Subscription Name"
```

**Windows**

```powershell
winget install Microsoft.AzureCLI
az login
az account set --subscription "Your Subscription Name"
```

No API key needed. Azure CLI handles authentication via browser login.

### GitHub

**What it does**: Repository management, pull requests, GitHub Copilot

**Used by**: Git operations, GitHub MCP tools, Copilot

**Setup**:

**macOS**

```bash
brew install gh
gh auth login
```

**Windows**

```powershell
winget install GitHub.cli
gh auth login
```

Git authentication is handled via SSH keys or HTTPS credential helper:

**macOS (SSH Setup)**

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard
pbcopy < ~/.ssh/id_ed25519.pub
# Then add to GitHub > Settings > SSH Keys
```

**Windows (SSH Setup)**

```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Start ssh-agent
Get-Service ssh-agent | Set-Service -StartupType Automatic -PassThru | Start-Service
ssh-add $env:USERPROFILE\.ssh\id_ed25519

# Copy public key to clipboard
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
# Then add to GitHub > Settings > SSH Keys
```

## Security Best Practices

- **Never commit** `.env` files or API keys to repositories
- **Always add** `.env` to your `.gitignore`
- **Rotate tokens** if you suspect they've been exposed
- **Use minimum scopes** when creating tokens
- **Prefer per-project `.env`** over shell-wide exports for project-specific keys

## Verifying Your Setup

**macOS / Linux** (bash/zsh):

```bash
echo "=== API Key Check ==="
if [ -n "$REPLICATE_API_TOKEN" ]; then
    echo "OK REPLICATE_API_TOKEN: Set (${#REPLICATE_API_TOKEN} chars)"
else
    echo "NOT SET REPLICATE_API_TOKEN (optional)"
fi

if [ -n "$GAMMA_API_KEY" ]; then
    echo "OK GAMMA_API_KEY: Set (${#GAMMA_API_KEY} chars)"
else
    echo "NOT SET GAMMA_API_KEY (optional)"
fi

if command -v az &>/dev/null; then
    echo "OK Azure CLI: $(az version --query '"azure-cli"' -o tsv)"
else
    echo "NOT INSTALLED Azure CLI (optional)"
fi

if command -v gh &>/dev/null; then
    echo "OK GitHub CLI: $(gh --version | head -1)"
else
    echo "NOT INSTALLED GitHub CLI (optional)"
fi
```

**Windows** (PowerShell):

```powershell
Write-Host "=== API Key Check ==="
if ($env:REPLICATE_API_TOKEN) {
    Write-Host "OK REPLICATE_API_TOKEN: Set ($($env:REPLICATE_API_TOKEN.Length) chars)"
} else {
    Write-Host "NOT SET REPLICATE_API_TOKEN (optional)"
}

if ($env:GAMMA_API_KEY) {
    Write-Host "OK GAMMA_API_KEY: Set ($($env:GAMMA_API_KEY.Length) chars)"
} else {
    Write-Host "NOT SET GAMMA_API_KEY (optional)"
}

if (Get-Command az -ErrorAction SilentlyContinue) {
    Write-Host "OK Azure CLI: $((az version | ConvertFrom-Json).'azure-cli')"
} else {
    Write-Host "NOT INSTALLED Azure CLI (optional)"
}

if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "OK GitHub CLI: $(gh --version | Select-Object -First 1)"
} else {
    Write-Host "NOT INSTALLED GitHub CLI (optional)"
}
```
