#!/usr/bin/env bash
# Freebuff preview entry: serves the built Web Access bundle with the COOP/COEP
# headers required by Operit2's threaded WebAssembly runtimes.
# Bind: 0.0.0.0:$PORT (Freebuff injects PORT).
#
# The preview runner does not guarantee a working directory, so the repository
# root is discovered by walking up from $PWD and from the script location until
# the stable apps/web_access marker is found.
set -euo pipefail

find_repo_root() {
  local dir="$1"
  while [ -n "$dir" ] && [ "$dir" != "/" ]; do
    if [ -d "$dir/apps/web_access" ] && [ -d "$dir/core/crates" ]; then
      printf '%s\n' "$dir"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  return 1
}

REPO_ROOT="$(find_repo_root "$PWD" || true)"
if [ -z "${REPO_ROOT:-}" ]; then
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  REPO_ROOT="$(find_repo_root "$script_dir" || true)"
fi
[ -n "${REPO_ROOT:-}" ] || REPO_ROOT="${OPERIT_REPO_ROOT:-}"
if [ -z "${REPO_ROOT:-}" ] || [ ! -d "$REPO_ROOT/apps/web_access" ]; then
  echo "Cannot locate the Operit2 repository root; set OPERIT_REPO_ROOT." >&2
  exit 1
fi

cd "$REPO_ROOT"
BUNDLE="$REPO_ROOT/apps/web_access/build/bundle"
if [ ! -f "$BUNDLE/index.html" ]; then
  {
    echo "Web Access bundle missing at $BUNDLE"
    echo "cwd=$(pwd) user=$(id -un)"
    ls -la "$REPO_ROOT" | head -20
    echo "Build it first: tools/dev_web_access_build.sh"
  } >&2
  exit 1
fi
export WEB_ACCESS_BUNDLE_DIR="$BUNDLE"
exec node "$REPO_ROOT/tools/dev_web_access_static_server.mjs"
