# Hosting the Operit2 Web Access frontend

Operit2 ships a browser entry point ("Web Access") built from the same Flutter
app that powers the desktop and mobile clients. It is a **static frontend**:
you can host it on any static file hoster. The browser uses it to connect to a
CoreNode that already runs on one of your devices (desktop app, CLI, or cloud
node) — hosting the frontend does not run an Agent server by itself.

> **Requirement:** the threaded Sherpa ONNX WebAssembly runtime (local STT and
> TTS) needs cross-origin isolation. Your hoster **must** send these headers on
> every application asset response:
>
> ```text
> Cross-Origin-Opener-Policy: same-origin
> Cross-Origin-Embedder-Policy: require-corp
> Cross-Origin-Resource-Policy: same-origin
> ```
>
> GitHub Pages cannot send custom headers, so local STT/TTS is unavailable
> there; all other features keep working. Vercel, Netlify, Cloudflare Pages,
> and the provided Docker/nginx setup all send the headers correctly.

## Step 1 — Build the bundle

The bundle is **not committed** to the repository; it is produced by the
`Deploy Web Experience` GitHub Actions workflow (build takes roughly 30–45
minutes). Trigger it from the Actions tab, or build locally:

```bash
tools/dev_web_access_setup.sh all     # one-time pinned toolchain install
tools/dev_web_access_build.sh all     # deps + cargo + flutter phases
```

The workflow produces two deployables:

1. the `gh-pages` branch (static hosting ready), and
2. a `web-access-bundle` artifact zip (for drag & drop or Docker).

## Step 2 — Pick a hoster

### Vercel (recommended)

1. Run the `Deploy Web Experience` workflow once.
2. In Vercel: **Add New Project → Import** your fork, set
   **Production Branch = `gh-pages`** and **Framework Preset = Other**
   (no build command, output directory `.`).
3. Deploy. The `vercel.json` committed to the `gh-pages` branch sends the
   required headers automatically.

Drag & drop alternative: download the `web-access-bundle` artifact and drop the
folder onto <https://vercel.com/new> — then add the three headers above in
**Settings → Headers**.

### Vercel services mode (repo-root project)

The repository root also carries a `vercel.json` that defines one Vercel
**project with multiple services**:

| Service | Root | Runtime | Visibility |
|---|---|---|---|
| `web-access` | `apps/web_access` | static (`build/bundle`) | **public** at the domain root |
| `cli` | `apps/cli` | rust | internal (desktop TUI/server — cannot serve from Vercel) |
| `esp32` | `apps/esp32` | rust | internal (ESP-IDF firmware target) |
| `pb_sbc01_h3` | `apps/pb_sbc01_h3` | rust | internal (Linux board Core runtime) |
| `esp32-editor` | `tools/esp32-editor` | node | internal (local dev server: USB serial, child processes) |
| `simulator` | `tools/esp32-editor/simulator` | rust | internal (raw-TCP device emulator) |

Only `web-access` receives public traffic (the single catch-all rewrite
targets it). The other five exist because the Vercel import flow auto-detected
them; they stay **internal** — Vercel serverless cannot run firmware builds, a
TUI process, USB serial access, or raw-TCP listeners, so expect their builds
to fail and remove them from `vercel.json` when they are not needed.

Because the Flutter bundle is not committed by default, the services-mode
project needs it committed. Refresh the committed bundle with:

```bash
git fetch origin gh-pages
tools/prepare_vercel_bundle.sh origin/gh-pages   # stages + rewrites base href to "/"
git add -f apps/web_access/build/bundle
git commit -m "chore: refresh committed web-access bundle"
git push
```

The committed bundle is cross-origin isolated through the top-level `headers`
in the root `vercel.json`, so local STT/TTS keeps working.

#### Default CoreNode address (`CORENODE_URL`)

The manual pairing dialog (Settings → Runtime → "enter another device's
address") can be prefilled with a deployment default. Two mechanisms exist:

1. **Build time:** build the app with
   `--dart-define=CORENODE_URL=https://your-node.example.com` (works for any
   platform).
2. **Runtime (web only):** set `window.CORENODE_URL` in
   `apps/web_access/web/index.html` (the tracked web shell) or directly inside
   the served bundle's `index.html` — no rebuild required.

The web value is read by `lib/core/config/CoreNodeUrl.dart`; the runtime global
wins over the dart-define when both are set.

### Netlify

1. Run the workflow, then in Netlify: **Add new site → Import an existing
   project**, choose your fork, **Branch = `gh-pages`**, publish directory `.`.
2. The `netlify.toml` on the branch configures headers and asset caching.

### Cloudflare Pages

1. Run the workflow, then in Cloudflare Pages: **Create a project → Connect to
   Git**, select your fork, **Production branch = `gh-pages`**, build command
   none, output directory `/`.
2. The `_headers` file on the branch configures the isolation headers.

### GitHub Pages (no custom headers)

1. Run the workflow — it force-pushes the bundle to `gh-pages`.
2. In **Settings → Pages**, set Source = `Deploy from a branch`, branch
   `gh-pages`, root.
3. Optional custom domain: set the repository variable `WEB_ACCESS_CNAME`
   (Settings → Secrets and variables → Actions → Variables) to a bare hostname
   such as `web.example.com`; the workflow then writes the `CNAME` file for
   you. Leave it unset for `<user>.github.io/<repo>` URLs.

### Docker / container platforms (Render, Railway, Fly.io, VPS)

The bundle must exist locally first (run the workflow and unzip
`web-access-bundle` into `apps/web_access/build/bundle`, or build locally),
then from the repository root:

```bash
docker build -f deploy/Dockerfile -t operit2-web-access .
docker run --rm -p 8080:8080 operit2-web-access
```

nginx sends the isolation headers; `deploy/nginx.conf` is the reference
configuration for any reverse proxy you already run.

### Node (Render / Railway / any Node host)

The repository includes a zero-dependency static server that already sends the
required headers:

```bash
PORT=8080 node tools/dev_web_access_static_server.mjs
```

Point it at the bundle directory as documented in the script header.

## Local preview

```bash
PORT=8080 tools/dev_web_access_preview.sh
```

## Connecting the frontend to a CoreNode

The hosted page is an access surface, not an Agent server. Start a CoreNode on
one of your devices (desktop app or `operit2` CLI) and connect from the hosted
page using the node address and pairing token. See the main `README.md`
("Multi-node Connections and Space") and `apps/web_access/README.md` for
details. Keep tokens private and prefer TLS-terminating proxies when exposing
a CoreNode beyond your LAN.

## Deployment file map

| File | Purpose |
| --- | --- |
| `.github/workflows/deploy-web-experience.yml` | Builds the bundle, publishes `gh-pages`, uploads the artifact |
| `deploy/vercel.json` | Header config copied onto the `gh-pages` branch (also usable standalone) |
| `deploy/netlify.toml` | Netlify header + cache config |
| `deploy/_headers` | Cloudflare Pages header config |
| `deploy/Dockerfile` + `deploy/nginx.conf` | Container image for any Docker hoster |
| `tools/dev_web_access_static_server.mjs` | Node static server with correct headers |
