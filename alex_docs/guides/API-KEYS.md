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

Add to your shell environment (`.env` file recommended, or shell profile):

```bash
export REPLICATE_API_TOKEN="r8_your_token_here"
export GAMMA_API_KEY="sk-gamma-your_key_here"
```

Alternatively, create a `.env` file in your project root (already gitignored).

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

```bash
# macOS:   brew install azure-cli
# Windows: winget install Microsoft.AzureCLI
az login
az account set --subscription "Your Subscription Name"
```

No API key needed. Azure CLI handles authentication via browser login.

### GitHub

**What it does**: Repository management, pull requests, GitHub Copilot

**Used by**: Git operations, GitHub MCP tools, Copilot

**Setup**:

```bash
# macOS:   brew install gh
# Windows: winget install GitHub.cli
gh auth login
```

Git authentication is handled via SSH keys or HTTPS credential helper:

```bash
# Generate SSH key (same command on all platforms)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to ssh-agent
ssh-add ~/.ssh/id_ed25519

# Copy public key and add to GitHub > Settings > SSH Keys
cat ~/.ssh/id_ed25519.pub
```

## Security Best Practices

- **Never commit** `.env` files or API keys to repositories
- **Always add** `.env` to your `.gitignore`
- **Rotate tokens** if you suspect they've been exposed
- **Use minimum scopes** when creating tokens
- **Prefer per-project `.env`** over shell-wide exports for project-specific keys

## Verifying Your Setup

Check that your API keys and CLI tools are configured:

```bash
# API key check
echo "REPLICATE_API_TOKEN: ${REPLICATE_API_TOKEN:+Set}${REPLICATE_API_TOKEN:-NOT SET}"
echo "GAMMA_API_KEY: ${GAMMA_API_KEY:+Set}${GAMMA_API_KEY:-NOT SET}"

# CLI tool check
az --version 2>/dev/null && echo "OK Azure CLI" || echo "NOT INSTALLED Azure CLI"
gh --version 2>/dev/null && echo "OK GitHub CLI" || echo "NOT INSTALLED GitHub CLI"
```
