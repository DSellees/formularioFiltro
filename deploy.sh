#!/usr/bin/env bash
set -euo pipefail

# Uso:
#   bash deploy.sh <github_user> <repo_name>
# Si ya existe remoto 'origin', puedes ejecutar simplemente:
#   bash deploy.sh

USER_ARG="${1:-}"
REPO_ARG="${2:-}"

if ! command -v git >/dev/null 2>&1; then
  echo "Necesitas 'git' instalado en el sistema." >&2
  exit 1
fi

if [ ! -d .git ]; then
  git init
fi

git add -A
if ! git diff --cached --quiet; then
  git commit -m "Deploy"
fi

git branch -M main || true

if git remote get-url origin >/dev/null 2>&1; then
  echo "Usando remoto existente: $(git remote get-url origin)"
else
  if [ -z "$USER_ARG" ] || [ -z "$REPO_ARG" ]; then
    echo "Configura el remoto origin ejecutando:"
    echo "  git remote add origin https://github.com/TU_USUARIO/TU_REPO.git"
    echo "…o vuelve a ejecutar: bash deploy.sh <github_user> <repo_name>" >&2
    exit 1
  fi
  git remote add origin "https://github.com/${USER_ARG}/${REPO_ARG}.git"
fi

git push -u origin main
echo "Listo. Activa GitHub Pages en Settings → Pages (main / root)."

