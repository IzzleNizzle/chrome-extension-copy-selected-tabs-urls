#!/usr/bin/env bash
# Re-renders icons/icon{16,32,48,128}.png from assets/icon_svg.svg.
# Requires ImageMagick 7 (`brew install imagemagick`).
set -euo pipefail

extension_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$extension_root"

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick 7 is required: brew install imagemagick" >&2
  exit 1
fi

source_svg="assets/icon_svg.svg"

for size in 16 32 48 128; do
  magick -background none "$source_svg" -resize "${size}x${size}" "icons/icon${size}.png"
  echo "Wrote icons/icon${size}.png"
done
