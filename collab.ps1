param(
    [Parameter(Position=0)]
    [string]$Action = "help",

    [Parameter(Position=1)]
    [string]$Message = ""
)

# Notification Discord (optionnelle) : URL du webhook dans le fichier
# .discord_webhook (ignore par Git) ou la variable DISCORD_WEBHOOK_URL.
function Send-DiscordNotification {
    $url = $env:DISCORD_WEBHOOK_URL
    if ([string]::IsNullOrWhiteSpace($url) -and (Test-Path ".discord_webhook")) {
        $url = (Get-Content ".discord_webhook" -Raw).Trim()
    }
    if ([string]::IsNullOrWhiteSpace($url)) {
        Write-Host "Pas de webhook Discord configure (.discord_webhook absent) : notification ignoree." -ForegroundColor Yellow
        return
    }
    $author = (git config user.name)
    $branch = (git branch --show-current).Trim()
    $commit = (git log -1 --pretty=format:"%h %s")
    $body = @{ content = "**$author** a pousse sur ``$branch`` : $commit" } | ConvertTo-Json -Compress
    try {
        Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json; charset=utf-8" -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 10 | Out-Null
        Write-Host "Discord notifie." -ForegroundColor Green
    } catch {
        Write-Host "Push reussi, mais la notification Discord a echoue (webhook invalide ?)." -ForegroundColor Yellow
    }
}

function Show-Help {
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "CampuShare PWA - Commandes Rapides Alban & Mathys (Windows)" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "Utilisation : .\collab.ps1 [commande]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  pull             Recuperer le travail depuis GitHub" -ForegroundColor Green
    Write-Host "  save `"Message`"   Sauvegarder, envoyer sur GitHub (+ Discord si configure)" -ForegroundColor Green
    Write-Host "  start            Lancer la PWA sur http://localhost:3000" -ForegroundColor Green
    Write-Host "  status           Voir l'etat des fichiers locaux" -ForegroundColor Green
    Write-Host "  branch [nom]     Creer une branche de test" -ForegroundColor Green
    Write-Host "  main             Revenir sur main" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
}

switch ($Action.ToLower()) {
    "pull" {
        Write-Host "Recuperation des dernieres nouveautes depuis GitHub..." -ForegroundColor Yellow
        git pull origin main
        Write-Host "Projet 100% a jour !" -ForegroundColor Green
    }
    "save" {
        if ([string]::IsNullOrWhiteSpace($Message)) {
            Write-Host "Erreur : specifiez un message de description." -ForegroundColor Red
            Write-Host "Exemple : .\collab.ps1 save `"Ma description`"" -ForegroundColor Yellow
            exit 1
        }
        Write-Host "Verification et mise a jour automatique de l'app..." -ForegroundColor Yellow
        python outils\sync_app.py
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Rien n'a ete envoye : corrigez l'erreur ci-dessus puis relancez." -ForegroundColor Red
            exit 1
        }
        Write-Host "Sauvegarde en cours..." -ForegroundColor Yellow
        git add .
        git commit -m "$Message"
        Write-Host "Envoi sur GitHub..." -ForegroundColor Yellow
        $currentBranch = (git branch --show-current).Trim()
        git push origin $currentBranch
        Write-Host "Modifications envoyees avec succes !" -ForegroundColor Green
        Send-DiscordNotification
    }
    "start" {
        Write-Host "Demarrage de la PWA sur http://localhost:3000..." -ForegroundColor Green
        python -m http.server 3000 --directory public
    }
    "status" {
        Write-Host "Fichiers modifies :" -ForegroundColor Cyan
        git status -s
    }
    "branch" {
        if ([string]::IsNullOrWhiteSpace($Message)) {
            Write-Host "Erreur : precisez un nom de branche." -ForegroundColor Red
            exit 1
        }
        git checkout -b "$Message"
        Write-Host "Branche $Message creee !" -ForegroundColor Green
    }
    "main" {
        git checkout main
        git pull origin main
        Write-Host "De retour sur la branche main." -ForegroundColor Green
    }
    Default {
        Show-Help
    }
}
