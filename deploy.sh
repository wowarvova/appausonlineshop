#!/usr/bin/env bash
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"
cd "$(dirname "$0")"

echo "==> GitHub login (one-time)"
if ! gh auth status >/dev/null 2>&1; then
  gh auth login --hostname github.com --git-protocol ssh --web --skip-ssh-key
fi

echo "==> Create repo + push"
gh repo create wowarvova/appausonlineshop --public --source=. --remote=origin --push || {
  git remote remove origin 2>/dev/null || true
  git remote add origin git@github.com:wowarvova/appausonlineshop.git
  git push -u origin main
}

echo "==> Open Render Blueprint"
open "https://dashboard.render.com/blueprints/new?repo=https://github.com/wowarvova/appausonlineshop"

echo
echo "In Render: connect the repo / apply the blueprint (render.yaml)."
echo "Public URL will be something like: https://appausonlineshop.onrender.com"
echo
echo "GitHub: https://github.com/wowarvova/appausonlineshop"
