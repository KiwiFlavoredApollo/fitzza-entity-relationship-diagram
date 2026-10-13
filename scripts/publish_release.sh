#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
: "${RELEASE_TAG:?RELEASE_TAG must identify an existing version tag}"
: "${GH_REPO:?GH_REPO must identify the GitHub repository}"
: "${GH_TOKEN:?GH_TOKEN is required to publish release assets}"

archive="${ARCHIVE_PATH:?ARCHIVE_PATH must identify the packaged ZIP}"
test -s "$archive"

if gh release view "$RELEASE_TAG" --repo "$GH_REPO" >/dev/null 2>&1; then
  gh release edit "$RELEASE_TAG" --repo "$GH_REPO" --title "Fitzza ERD $RELEASE_TAG"
  gh release upload "$RELEASE_TAG" "$archive" --repo "$GH_REPO" --clobber
else
  # Verify the pushed tag; upload assets before publishing the new release.
  options=(--verify-tag --title "Fitzza ERD $RELEASE_TAG" --notes 'Mermaid ERD diagrams in PNG format, packaged as a ZIP archive.')
  if [[ "$RELEASE_TAG" == *-* ]]; then
    options+=(--prerelease)
  fi
  gh release create "$RELEASE_TAG" "$archive" --repo "$GH_REPO" "${options[@]}"
fi
