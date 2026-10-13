#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
renderer=".tools/mermaid/node_modules/.bin/mmdc"
output="build/images"
mkdir -p "$output/diagrams/mermaid"

# Render only committed Mermaid sources; no Markdown files are generated.
sources=(fitzza-erd.mmd)
while IFS= read -r -d '' source; do
  sources+=("$source")
done < <(find diagrams -type f -name '*.mmd' -print0 | sort -z)

"$renderer" --version
for source in "${sources[@]}"; do
  target="$output/${source%.mmd}.png"
  mkdir -p "$(dirname "$target")"
  "$renderer" \
    --input "$source" \
    --output "$target" \
    --configFile scripts/mermaid-config.json \
    --puppeteerConfigFile scripts/puppeteer-config.json \
    --backgroundColor white \
    --scale 2
  test -s "$target"
done

printf 'Rendered %s Mermaid diagrams to %s\n' "${#sources[@]}" "$output"
