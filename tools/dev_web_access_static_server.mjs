#!/usr/bin/env node
/**
 * Static preview server for the built Operit2 Web Access bundle.
 *
 * Serves apps/web_access/build/bundle on 0.0.0.0:$PORT (default 8080) and
 * sends the cross-origin isolation headers required by Operit2's threaded
 * WebAssembly runtimes (see apps/web_access/README.md):
 *   Cross-Origin-Opener-Policy: same-origin
 *   Cross-Origin-Embedder-Policy: require-corp
 *   Cross-Origin-Resource-Policy: same-origin
 */
import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

// Resolve the default bundle from this module's location so the server works
// regardless of the working directory it is launched from.
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(
  process.env.WEB_ACCESS_BUNDLE_DIR || path.join(MODULE_DIR, "..", "apps", "web_access", "build", "bundle")
);
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number.parseInt(process.env.PORT || "8080", 10);

const MIME_TYPES = new Map(
  Object.entries({
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".wasm": "application/wasm",
    ".bin": "application/octet-stream",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".txt": "text/plain; charset=utf-8",
  })
);

/** Resolves one request path inside the bundle, rejecting traversal attempts. */
function resolveBundlePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const relative = decoded.replace(/^\/+/, "");
  const resolved = path.resolve(ROOT, relative || "index.html");
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) {
    return null;
  }
  return resolved;
}

const server = http.createServer(async (request, response) => {
  try {
    let target = resolveBundlePath(request.url || "/");
    let stat = target ? await fs.stat(target).catch(() => null) : null;
    if (stat?.isDirectory()) {
      target = path.join(target, "index.html");
      stat = await fs.stat(target).catch(() => null);
    }
    if (!stat?.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found\n");
      return;
    }
    const ext = path.extname(target).toLowerCase();
    const headers = {
      "Content-Type": MIME_TYPES.get(ext) ?? "application/octet-stream",
      "Content-Length": stat.size,
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=60",
    };
    if (request.method === "HEAD") {
      response.writeHead(200, headers);
      response.end();
      return;
    }
    response.writeHead(200, headers);
    const stream = (await import("node:fs")).createReadStream(target);
    stream.on("error", () => response.destroy());
    stream.pipe(response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Internal error: ${error?.message ?? error}\n`);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Operit2 Web Access preview: http://${HOST}:${PORT}/ (root: ${ROOT})`);
});
