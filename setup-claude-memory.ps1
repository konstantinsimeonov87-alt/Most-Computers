# Копира Claude memory файловете от repo-то в правилната локална папка.
# Стартирай веднъж след git clone на нова машина.

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$transformed = $projectPath[0].ToString().ToLower() + $projectPath.Substring(1) -replace ':', '-' -replace '\\', '-' -replace ' ', '-'
$dest = "$env:USERPROFILE\.claude\projects\$transformed\memory"

New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item "$projectPath\.claude\memory\*" $dest -Force

Write-Host "Done. Memory copied to:"
Write-Host "  $dest"
