#!/usr/bin/env bash
# Builds the Operit2 Web Access bundle (apps/web_access/build/bundle) the same
# way .github/workflows/deploy-web-experience.yml does:
#   python3 tools/build_scripts/build_flutter_web_access.py --base-href /
#
# Usage: tools/dev_web_access_build.sh [deps|cargo|flutter|all]  (default: all)
#
# The cargo -> wasm32 build of the bridge is fully incremental and cached under
# apps/flutter/native/operit-flutter-bridge/target, so the "cargo" phase can be
# re-run after an interruption and resumes where it stopped. Once the cargo and
# node tool caches are warm, the "flutter" phase finishes in one shot.
set -euo pipefail

# The invoking shell does not guarantee a working directory or script location
# relative to the repository, so discover the root by walking up until the
# stable core/apps markers are found.
find_repo_root() {
  local dir="$1"
  while [ -n "$dir" ] && [ "$dir" != "/" ]; do
    if [ -d "$dir/core/crates" ] && [ -d "$dir/apps/flutter/app" ]; then
      printf '%s\n' "$dir"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  return 1
}

REPO_ROOT="$(find_repo_root "$PWD" || true)"
[ -n "${REPO_ROOT:-}" ] || REPO_ROOT="$(find_repo_root "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" || true)"
[ -n "${REPO_ROOT:-}" ] || REPO_ROOT="${OPERIT_REPO_ROOT:-}"
if [ -z "${REPO_ROOT:-}" ] || [ ! -d "$REPO_ROOT/core/crates" ]; then
  echo "Cannot locate the Operit2 repository root; set OPERIT_REPO_ROOT." >&2
  exit 1
fi
cd "$REPO_ROOT"

PHASE="${1:-all}"

export RUSTUP_HOME="${RUSTUP_HOME:-$REPO_ROOT/.ci-tools/rustup}"
export CARGO_HOME="${CARGO_HOME:-$REPO_ROOT/.ci-tools/cargo}"
export PUB_CACHE="${PUB_CACHE:-$HOME/.pub-cache}"
export PATH="$HOME/.pub-cache/bin:$CARGO_HOME/bin:$REPO_ROOT/.ci-tools/dart-sdk/bin:$PATH"
export RUSTFLAGS="-Awarnings"
# The plugin sync step runs corepack pnpm; never prompt in non-interactive builds.
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

BRIDGE_DIR="apps/flutter/native/operit-flutter-bridge"
WASI_PACKAGE="wasi-sdk-20.0-linux"
WASI_ROOT="$REPO_ROOT/target/operit-build-tools/$WASI_PACKAGE"
WASM_BINDGEN_VERSION="0.2.122"
TYPESCRIPT_VERSION="5.9.3"
TERSER_VERSION="5.44.0"

log() { printf '\n==> %s\n' "$*"; }

# ---------------------------------------------------------------------------
# deps: rust target + node/rust/wasi build tools (repo build-script helpers)
# ---------------------------------------------------------------------------
# wasm-bindgen: prefer the pinned prebuilt release binary; fall back to
# compiling wasm-bindgen-cli from source (slow, resumable).
ensure_wasm_bindgen() {
  local root="$REPO_ROOT/.ci-tools/wasm-bindgen"
  local bin="$root/bin/wasm-bindgen"
  if [ ! -x "$bin" ]; then
    mkdir -p "$root"
    local url="https://github.com/rustwasm/wasm-bindgen/releases/download/$WASM_BINDGEN_VERSION/wasm-bindgen-$WASM_BINDGEN_VERSION-x86_64-unknown-linux-musl.tar.gz"
    log "Downloading prebuilt wasm-bindgen $WASM_BINDGEN_VERSION"
    if curl --fail --location --retry 3 --retry-all-errors "$url" -o /tmp/wb.tar.gz; then
      rm -rf /tmp/wb-out && mkdir /tmp/wb-out
      tar -xzf /tmp/wb.tar.gz -C /tmp/wb-out
      mkdir -p "$root/bin"
      cp /tmp/wb-out/wasm-bindgen-*/wasm-bindgen "$root/bin/"
      chmod +x "$root/bin/wasm-bindgen"
      rm -rf /tmp/wb-out /tmp/wb.tar.gz
    else
      log "Prebuilt download failed; compiling wasm-bindgen-cli from source"
      cargo install wasm-bindgen-cli --version "$WASM_BINDGEN_VERSION" --locked --root "$root"
    fi
  fi
  "$bin" --version
}

phase_deps() {
  log "Rust wasm32 target"
  rustup target add wasm32-unknown-unknown

  log "Build tools (typescript, terser, wasm-bindgen, wasi-sdk)"
  python3 - "$TYPESCRIPT_VERSION" "$TERSER_VERSION" <<'PY'
import sys
sys.path.insert(0, "tools/build_scripts")
import build_flutter_web_access as b

typescript_version, terser_version = sys.argv[1:3]
b.ensure_typescript(typescript_version)
b.ensure_terser(terser_version)
b.ensure_wasi_sdk("20.0")
PY
  ensure_wasm_bindgen
}

# ---------------------------------------------------------------------------
# cargo: pre-build the wasm bridge with the exact environment the Flutter
# native-assets hook uses, so the later flutter phase finds it cached.
# ---------------------------------------------------------------------------
phase_cargo() {
  log "cargo build --release --target wasm32-unknown-unknown (resumable)"
  local clang_resource
  clang_resource="$(ls -d "$WASI_ROOT"/lib/clang/*/include | head -1)"
  local clang_lib_dir
  clang_lib_dir="$(dirname "$clang_resource")/lib/wasi"

  RUSTFLAGS="-Awarnings \
-L native=$WASI_ROOT/share/wasi-sysroot/lib/wasm32-wasi \
-L native=$clang_lib_dir \
-l static=c \
-l static=clang_rt.builtins-wasm32" \
  QUICKJS_WASM_SYS_WASI_SDK_PATH="$WASI_ROOT" \
  BINDGEN_EXTRA_CLANG_ARGS_wasm32_unknown_unknown="-resource-dir=$(dirname "$clang_resource")" \
    cargo build --release --target wasm32-unknown-unknown --manifest-path "$BRIDGE_DIR/Cargo.toml"

  log "cargo check operit-proxy-local (host; generates Dart proxy artifacts)"
  cargo check --manifest-path core/crates/proxy/local/Cargo.toml --quiet
}

# ---------------------------------------------------------------------------
# flutter: full bundle build through the repository build script
# ---------------------------------------------------------------------------
phase_flutter() {
  log "flutter precache --web"
  ( cd apps/flutter/app && ./.fvm/flutter_sdk/bin/flutter precache --web )

  log "python3 tools/build_scripts/build_flutter_web_access.py --base-href /"
  python3 tools/build_scripts/build_flutter_web_access.py --base-href /

  log "Bundle ready:"
  ls -la apps/web_access/build/bundle | head -20
}

case "$PHASE" in
  deps)    phase_deps ;;
  cargo)   phase_cargo ;;
  flutter) phase_flutter ;;
  all)     phase_deps; phase_cargo; phase_flutter ;;
  *) echo "Unknown phase: $PHASE (use deps|cargo|flutter|all)" >&2; exit 1 ;;
esac

log "Phase '${PHASE}' complete."
