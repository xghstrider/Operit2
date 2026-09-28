#!/usr/bin/env bash
# Installs every toolchain required to build and serve the Operit2 Web Access
# bundle on this Linux workspace. Versions mirror
# .github/workflows/deploy-web-experience.yml and BUILDING.md.
#
# Usage: tools/dev_web_access_setup.sh [system|rust|fvm|flutter|all]  (default: all)
# Every phase is skipped when its target already exists, so the script is safe
# to re-run after an interrupted install.
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

FLUTTER_VERSION="3.41.9"
FVM_VERSION="4.1.2"
RUST_TOOLCHAIN_VERSION="1.95.0"
PHASE="${1:-all}"

log() { printf '\n==> %s\n' "$*"; }

# ---------------------------------------------------------------------------
# Phase: system build tools (clang/libclang for bindgen, zip/unzip helpers)
# ---------------------------------------------------------------------------
phase_system() {
  log "Checking system packages"
  local need=0
  command -v clang >/dev/null 2>&1 || need=1
  command -v zip >/dev/null 2>&1 || need=1
  command -v unzip >/dev/null 2>&1 || need=1
  command -v pkg-config >/dev/null 2>&1 || need=1
  ls /usr/lib/llvm-*/include/clang-c/Index.h >/dev/null 2>&1 || need=1
  if [ "$need" -eq 1 ]; then
    if [ "$(id -u)" -eq 0 ]; then SUDO=""; else SUDO="sudo"; fi
    export DEBIAN_FRONTEND=noninteractive
    $SUDO apt-get update -y
    $SUDO apt-get install -y --no-install-recommends clang libclang-dev zip unzip pkg-config libssl-dev
  fi
}

# ---------------------------------------------------------------------------
# Phase: Rust 1.95.0 + wasm32-unknown-unknown (wasm-bindgen needs a modern host)
# ---------------------------------------------------------------------------
phase_rust() {
  log "Installing Rust ${RUST_TOOLCHAIN_VERSION}"
  export RUSTUP_HOME="${RUSTUP_HOME:-$REPO_ROOT/.ci-tools/rustup}"
  export CARGO_HOME="${CARGO_HOME:-$REPO_ROOT/.ci-tools/cargo}"
  mkdir -p "$RUSTUP_HOME" "$CARGO_HOME"
  if [ ! -x "$CARGO_HOME/bin/rustup" ]; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
      --default-toolchain "$RUST_TOOLCHAIN_VERSION" --profile minimal
  fi
  export PATH="$CARGO_HOME/bin:$PATH"
  rustup default "$RUST_TOOLCHAIN_VERSION" >/dev/null
  rustup target add wasm32-unknown-unknown >/dev/null
  rustc --version
  cargo --version
}

# ---------------------------------------------------------------------------
# Phase: FVM (Dart global package; bootstrapped with a standalone Dart SDK)
# ---------------------------------------------------------------------------
phase_fvm() {
  log "Installing FVM ${FVM_VERSION}"
  local pub_cache_bin="$HOME/.pub-cache/bin"
  if [ ! -x "$pub_cache_bin/fvm" ]; then
    local bootstrap_dart="$REPO_ROOT/.ci-tools/dart-sdk"
    if [ ! -x "$bootstrap_dart/bin/dart" ]; then
      mkdir -p "$bootstrap_dart"
      log "Downloading Dart SDK 3.10.8 (FVM bootstrap)"
      curl --fail --location --retry 3 --retry-all-errors \
        "https://storage.googleapis.com/dart-archive/channels/stable/release/3.10.8/sdk/dartsdk-linux-x64-release.zip" \
        --output /tmp/dartsdk.zip
      rm -rf /tmp/dartsdk.out && mkdir /tmp/dartsdk.out
      unzip -q -o /tmp/dartsdk.zip -d /tmp/dartsdk.out
      rm -rf "$bootstrap_dart"
      mv /tmp/dartsdk.out/dart-sdk "$bootstrap_dart"
      rm -rf /tmp/dartsdk.out /tmp/dartsdk.zip
    fi
    export PUB_CACHE="${PUB_CACHE:-$HOME/.pub-cache}"
    "$bootstrap_dart/bin/dart" pub global activate fvm "$FVM_VERSION"
  fi
  "$pub_cache_bin/fvm" --version
}

# ---------------------------------------------------------------------------
# Phase: Flutter 3.41.9 pinned by apps/flutter/app/.fvmrc (fvm install)
# ---------------------------------------------------------------------------
phase_flutter() {
  export PATH="$HOME/.pub-cache/bin:$REPO_ROOT/.ci-tools/cargo/bin:$REPO_ROOT/.ci-tools/dart-sdk/bin:$PATH"
  export RUSTUP_HOME="${RUSTUP_HOME:-$REPO_ROOT/.ci-tools/rustup}"
  export CARGO_HOME="${CARGO_HOME:-$REPO_ROOT/.ci-tools/cargo}"
  log "Installing Flutter ${FLUTTER_VERSION} via FVM (apps/flutter/app)"
  ( cd apps/flutter/app && fvm install --skip-pub-get )
  local flutter_bin="$REPO_ROOT/apps/flutter/app/.fvm/flutter_sdk/bin/flutter"
  [ -x "$flutter_bin" ] || { echo "FVM did not create apps/flutter/app/.fvm/flutter_sdk" >&2; exit 1; }
  "$flutter_bin" --version
}

case "$PHASE" in
  system)  phase_system ;;
  rust)    phase_rust ;;
  fvm)     phase_fvm ;;
  flutter) phase_flutter ;;
  all)     phase_system; phase_rust; phase_fvm; phase_flutter ;;
  *) echo "Unknown phase: $PHASE (use system|rust|fvm|flutter|all)" >&2; exit 1 ;;
esac

log "Phase '${PHASE}' complete."
