#!/bin/sh
# DonWells Cue installer — https://dwcue.com/install.sh
# curl downloads do not receive the macOS quarantine attribute, so an app
# installed this way never triggers the Gatekeeper "Apple could not verify"
# dialog. This is the same mechanism used by rustup, Homebrew and Deno.
set -eu

SITE="https://dwcue.com"
APP_NAME="DonWells Cue.app"
BIN_NAME="DonWells Cue"

echo "DonWells Cue installer"
echo

# --- architecture ---------------------------------------------------------
ARCH=$(uname -m)
case "$ARCH" in
  arm64)  DW_ARCH="arm64" ;;
  x86_64) DW_ARCH="x64" ;;
  *) echo "Unsupported architecture: $ARCH (DonWells Cue ships arm64 and x64 builds)." >&2; exit 1 ;;
esac

# --- latest published version --------------------------------------------
VERSION=$(curl -fsSL "$SITE/package.json" | sed -n 's/.*"version"[^"]*"\([^"]*\)".*/\1/p' | head -n 1)
if [ -z "$VERSION" ]; then
  echo "Could not determine the latest version from $SITE/package.json." >&2
  exit 1
fi
echo "Version:      $VERSION ($DW_ARCH)"

# --- destination -----------------------------------------------------------
DEST="${DWCUE_DEST:-/Applications}"
if [ ! -w "$DEST" ]; then
  DEST="$HOME/Applications"
  mkdir -p "$DEST"
fi
echo "Installing to: $DEST"

# --- download + unpack ------------------------------------------------------
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
ZIP="$TMP/dwcue.zip"
echo "Downloading..."
curl -fSL --progress-bar -o "$ZIP" "$SITE/downloads/DonWells-Cue-$VERSION-$DW_ARCH.zip"
ditto -xk "$ZIP" "$TMP/extract"

# --- replace existing install ----------------------------------------------
if [ -d "$DEST/$APP_NAME" ]; then
  pkill -f "$APP_NAME/Contents/MacOS/$BIN_NAME" 2>/dev/null || true
  for _ in 1 2 3; do
    pgrep -f "$APP_NAME/Contents/MacOS/$BIN_NAME" >/dev/null 2>&1 || break
    sleep 1
  done
  pkill -9 -f "$APP_NAME/Contents/MacOS/$BIN_NAME" 2>/dev/null || true
  rm -rf "$DEST/$APP_NAME"
fi
mv "$TMP/extract/$APP_NAME" "$DEST/$APP_NAME"

# Belt and braces: curl never sets quarantine, but strip it if a proxy or
# mirror added it anyway.
xattr -dr com.apple.quarantine "$DEST/$APP_NAME" 2>/dev/null || true

echo
echo "Installed. Launching DonWells Cue — no security dialog will appear."
open "$DEST/$APP_NAME"
