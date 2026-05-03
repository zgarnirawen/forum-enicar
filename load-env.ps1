#!/usr/bin/env pwsh
# Load environment variables from .env file
# Usage: . .\load-env.ps1

param(
    [string]$EnvFile = ".env"
)

if (-Not (Test-Path $EnvFile)) {
    Write-Host "❌ Error: $EnvFile not found" -ForegroundColor Red
    Write-Host "Please copy .env.example to .env and configure your credentials"
    exit 1
}

Write-Host "📖 Loading environment variables from $EnvFile..." -ForegroundColor Cyan

$lines = Get-Content $EnvFile | Where-Object { $_ -notmatch '^\s*#' -and $_ -notmatch '^\s*$' }

foreach ($line in $lines) {
    $key, $value = $line -split '=', 2
    $key = $key.Trim()
    $value = $value.Trim()
    
    if ($key -and $value) {
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
        Write-Host "  ✓ $key" -ForegroundColor Green
    }
}

Write-Host "`n✅ Environment variables loaded successfully!`n" -ForegroundColor Green
