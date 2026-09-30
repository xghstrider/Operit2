#!/usr/bin/env bash
# Stage the Web Access bundle into apps/web_access/build/bundle for the
# repo-root Vercel services deployment (domain-root base href).
#
# The Flutter web bundle is produced by the "Deploy Web Experience" GitHub
# Actions workflow and published to the gh-pages branch. gh-pages is built
# for a repository subpath (base href "/<repo>/"); a Vercel service that owns
# the whole domain needs base href "/", so this script rewrites it.
#
# Usage (repository root):
#   tools/prepare_vercel_bundle.sh [git-ref]   # default: origin/gh-pages
#
# After running, commit with:
#   git add -f apps/web_access/build/bundle
#   git commit -m "chore: refresh committed web-access bundle"
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REF="${1:-origin/gh-pages}"
DEST="$REPO_ROOT/apps/web_access/build/bundle"

if ! git -C "$REPO_ROOT" rev-parse --verify "$REF^{commit}" >/dev/null 2>&1; then
  echo "error: git ref not found: $REF (fetch gh-pages first: git fetch origin gh-pages)" >&2
  exit 1
fi

rm -rf "$DEST"
mkdir -p "$DEST"
git -C "$REPO_ROOT" archive "$REF" | tar -x -C "$DEST"

# gh-pages bundles are built with a subpath base href; Vercel services own
# the domain root, so rewrite it.
if grep -q '<base href="' "$DEST/index.html"; then
  sed -i.bak 's|<base href="/[^"]*">|<base href="/">|' "$DEST/index.html"
  rm -f "$DEST/index.html.bak"
fi

echo "Staged bundle from $REF into apps/web_access/build/bundle:"
grep -o '<base href="[^"]*">' "$DEST/index.html" || true
find "$DEST" -maxdepth 1 -type f | wc -l | xargs echo "files at bundle root:"
du -sh "$DEST" | cut -f1 | xargs echo "bundle size:"
