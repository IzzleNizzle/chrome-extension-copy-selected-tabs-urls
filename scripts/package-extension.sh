#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

version="$(sed -n 's/.*"version": "\([^"]*\)".*/\1/p' manifest.json)"
if [[ -z "$version" ]]; then
  echo "Could not read extension version from manifest.json" >&2
  exit 1
fi

package_name="copy-selected-tabs-urls-${version}.zip"
output_dir="dist"
output_path="${output_dir}/${package_name}"
tmp_dir="$(mktemp -d "/tmp/${package_name}.XXXXXX")"
tmp_path="${tmp_dir}/${package_name}"

mkdir -p "$output_dir"
trap 'rm -rf "$tmp_dir"' EXIT

zip -r "$tmp_path" \
  manifest.json \
  popup.html \
  popup.css \
  popup.js \
  icons

mv "$tmp_path" "$output_path"

echo "Created ${output_path}"
