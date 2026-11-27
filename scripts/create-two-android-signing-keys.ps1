$ErrorActionPreference = "Stop"

$keytool = Get-Command "keytool" -ErrorAction SilentlyContinue
if (-not $keytool) {
    throw "keytool was not found. Install a JDK (Java 21 recommended) and add its bin directory to PATH."
}

$signingDirectory = Join-Path $env:LOCALAPPDATA "SMH-Android-Signing"
New-Item -ItemType Directory -Force -Path $signingDirectory | Out-Null

function New-SmhAndroidKey {
    param(
        [Parameter(Mandatory = $true)][string]$AppName,
        [Parameter(Mandatory = $true)][string]$Alias
    )

    $keyStore = Join-Path $signingDirectory "$AppName-release.jks"
    $base64File = Join-Path $signingDirectory "$AppName-keystore-base64.txt"

    if ((Test-Path $keyStore) -or (Test-Path $base64File)) {
        throw "A key or Base64 file already exists for $AppName. Refusing to overwrite an existing signing identity."
    }

    Write-Host ""
    Write-Host "Creating the dedicated signing key for $AppName." -ForegroundColor Cyan
    Write-Host "Use a strong password. When keytool asks for the key password, you may press Enter to reuse the keystore password."
    & $keytool.Source -genkeypair -v -keystore $keyStore -alias $Alias -keyalg RSA -keysize 4096 -validity 10000
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $keyStore)) {
        throw "keytool failed while creating the $AppName key."
    }

    $bytes = [System.IO.File]::ReadAllBytes($keyStore)
    $base64 = [Convert]::ToBase64String($bytes)
    [System.IO.File]::WriteAllText($base64File, $base64, [System.Text.Encoding]::ASCII)

    Write-Host "Created: $keyStore" -ForegroundColor Green
    Write-Host "Base64 for GitHub Secret: $base64File" -ForegroundColor Green
}

New-SmhAndroidKey -AppName "klassyar" -Alias "klassyar"
New-SmhAndroidKey -AppName "linguaplay" -Alias "linguaplay"

Write-Host ""
Write-Host "Both dedicated Android signing keys were created locally." -ForegroundColor Green
Write-Host "Keep this directory private and make an encrypted offline backup:"
Write-Host $signingDirectory
Write-Host ""
Write-Host "KlassYar GitHub Secrets:"
Write-Host "  KLASSYAR_ANDROID_KEYSTORE_BASE64"
Write-Host "  KLASSYAR_ANDROID_STORE_PASSWORD"
Write-Host "  KLASSYAR_ANDROID_KEY_ALIAS = klassyar"
Write-Host "  KLASSYAR_ANDROID_KEY_PASSWORD"
Write-Host ""
Write-Host "LinguaPlay GitHub Secrets:"
Write-Host "  LINGUAPLAY_ANDROID_KEYSTORE_BASE64"
Write-Host "  LINGUAPLAY_ANDROID_STORE_PASSWORD"
Write-Host "  LINGUAPLAY_ANDROID_KEY_ALIAS = linguaplay"
Write-Host "  LINGUAPLAY_ANDROID_KEY_PASSWORD"
Write-Host ""
Write-Host "Paste each Base64 file's contents into the matching repository Secret. Never commit JKS or Base64 files."
