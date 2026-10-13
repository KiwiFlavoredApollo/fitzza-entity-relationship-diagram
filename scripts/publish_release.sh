#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
: "${RELEASE_TAG:?RELEASE_TAG must identify an existing version tag}"
: "${GH_REPO:?GH_REPO must identify the GitHub repository}"
: "${GH_TOKEN:?GH_TOKEN is required to publish release assets}"

images=()
while IFS= read -r -d '' image; do
  images+=("$image")
done < <(find build/images -type f -name '*.png' -print0 | sort -z)
if (( ${#images[@]} == 0 )); then
  printf 'No PNG images found to attach to release\n' >&2
  exit 1
fi

if gh release view "$RELEASE_TAG" --repo "$GH_REPO" >/dev/null 2>&1; then
  gh release edit "$RELEASE_TAG" --repo "$GH_REPO" --title "Fitzza ERD $RELEASE_TAG"
  gh release upload "$RELEASE_TAG" "${images[@]}" --repo "$GH_REPO" --clobber
else
  # Verify the pushed tag; upload assets before publishing the new release.
  options=(--verify-tag --title "Fitzza ERD $RELEASE_TAG" --notes 'Mermaid ERD diagrams in PNG format.')
  if [[ "$RELEASE_TAG" == *-* ]]; then
    options+=(--prerelease)
  fi
  gh release create "$RELEASE_TAG" "${images[@]}" --repo "$GH_REPO" "${options[@]}"
fi
