param(
    [Parameter(Position=0)]
    [string]$Action = "help",

    [Parameter(Position=1)]
    [string]$Message = ""
)

function Show-Help {
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "CampuShare PWA - Commandes Rapides Alban & Mathys (Windows)" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "Utilisation : .\collab.ps1 [commande]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  pull             Recuperer le travail depuis GitHub" -ForegroundColor Green
    Write-Host "  save `"Message`"   Sauvegarder et envoyer sur GitHub" -ForegroundColor Green
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
        Write-Host "Sauvegarde en cours..." -ForegroundColor Yellow
        git add .
        git commit -m "$Message"
        Write-Host "Envoi sur GitHub..." -ForegroundColor Yellow
        $currentBranch = (git branch --show-current).Trim()
        git push origin $currentBranch
        Write-Host "Modifications envoyees avec succes !" -ForegroundColor Green
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
