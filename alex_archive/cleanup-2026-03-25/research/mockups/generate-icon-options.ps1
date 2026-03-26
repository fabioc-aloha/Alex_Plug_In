param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ForwardArgs
)

$scriptPath = Join-Path $PSScriptRoot 'generate-icon-options.js'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error 'Node.js is required to run generate-icon-options.js'
    exit 1
}

& node $scriptPath @ForwardArgs
$exitCode = $LASTEXITCODE

if ($null -ne $exitCode) {
    exit $exitCode
}
