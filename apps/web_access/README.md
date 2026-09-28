# Operit2 Web Access

This directory owns the Web Access frontend boundary.

The deployment server must send these headers for every application asset so
threaded Sherpa ONNX WebAssembly can run local STT and TTS:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
```

The Operit CLI Web Access server emits these headers directly.

## Flutter Web development

`fvm flutter run -d edge` uses Flutter's built-in development server, which
does not provide the required response headers. Run Flutter as a Web Server and
open the isolated proxy origin instead:

```powershell
cd apps/flutter/app
fvm flutter run -d web-server --web-hostname 127.0.0.1 --web-port 4835
```

In a second terminal at the repository root:

```powershell
node tools/dev_web_access_proxy.mjs --upstream-port 4835 --listen-port 4836
```

Open `http://127.0.0.1:4836`. The proxy forwards Flutter's HTTP and debug
WebSocket traffic, and sends the cross-origin isolation headers for every
response. Flutter hot reload remains available through the Web Server session.

For VS Code, select `Operit2: Web (isolated)` from Run and Debug and press F5.
That launch configuration starts the proxy task, runs Edge through the FVM
Flutter SDK, and opens the isolated origin automatically.

- `web/` contains the tracked Flutter Web shell files for Web Access.
- `build/bundle/` contains the generated bundle consumed by the Flutter app and CLI packages.
- `tools/build_scripts/build_flutter_web_access.py` ensures the Flutter web entry link exists and writes the shared bundle.
- `web_access_version.json` is generated from bundle content; its integer version increases when the bundle hash changes.
- The current Dart entrypoint still lives in `apps/flutter/app`; consumers depend on the generated bundle here, not on Flutter's internal `build/web` directory.
- `apps/flutter/app/web` is a symlink to `apps/web_access/web`.
- `apps/flutter/app/build/web` is a symlink to `apps/web_access/build/bundle` during Flutter Web builds.

## Local static preview

`tools/dev_web_access_setup.sh` installs the pinned Linux toolchain used by the
Web experience workflow: Flutter 3.41.9 through FVM, Rust with the
`wasm32-unknown-unknown` target, the WASI SDK, wasm-bindgen, and the Node build
tools (TypeScript, Terser). Every phase is skipped when its target already
exists, so the script is safe to re-run. Use `system`, `rust`, `fvm`, `flutter`,
or `all` (default) as the phase argument.

```bash
tools/dev_web_access_setup.sh all
```

`tools/dev_web_access_build.sh` builds the shared bundle through
`tools/build_scripts/build_flutter_web_access.py`. The `cargo` phase is
incremental, so it can be re-run until it completes before `flutter` finishes
the bundle:

```bash
tools/dev_web_access_build.sh deps
tools/dev_web_access_build.sh cargo
tools/dev_web_access_build.sh flutter
```

`tools/dev_web_access_preview.sh` serves the built bundle through
`tools/dev_web_access_static_server.mjs`, which sends the cross-origin
isolation headers required above on every response. It binds `0.0.0.0` and
honours `PORT`:

```bash
PORT=8080 tools/dev_web_access_preview.sh
```
