#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STRAPI_DIR="$ROOT_DIR/strapi"
DATA_DIR="$STRAPI_DIR/data"

if ! command -v yarn >/dev/null 2>&1; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    source "$NVM_DIR/nvm.sh"
  fi
fi

if ! command -v yarn >/dev/null 2>&1; then
  echo "yarn not found. Install yarn/corepack or load nvm first." >&2
  exit 1
fi

mkdir -p "$DATA_DIR"

TIMESTAMP="$(date +%Y%m%d%H%M%S)"
BASENAME="export_${TIMESTAMP}"
TARGET_REL="./data/${BASENAME}"
TARGET_FILE="$DATA_DIR/${BASENAME}.tar.gz"
LATEST_FILE="$DATA_DIR/export_latest.tar.gz"

(
  cd "$STRAPI_DIR"
  yarn strapi export --no-encrypt -f "$TARGET_REL"
)

cp "$TARGET_FILE" "$LATEST_FILE"

echo "Created official Strapi export: $TARGET_FILE"
echo "Updated latest export: $LATEST_FILE"