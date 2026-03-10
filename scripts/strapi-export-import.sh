#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STRAPI_DIR="$ROOT_DIR/strapi"
DATA_DIR="$STRAPI_DIR/data"

INPUT="${1:-export_latest.tar.gz}"
if [[ "$INPUT" = /* ]]; then
  IMPORT_FILE="$INPUT"
else
  IMPORT_FILE="$DATA_DIR/$INPUT"
fi

if [[ ! -f "$IMPORT_FILE" ]]; then
  echo "Export file not found: $IMPORT_FILE" >&2
  exit 1
fi

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

(
  cd "$STRAPI_DIR"
  yarn strapi import -f "$IMPORT_FILE" --force
)

echo "Imported official Strapi export: $IMPORT_FILE"