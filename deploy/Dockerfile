# Operit2 Web Access — static bundle container image.
#
# Build (run from the repository root AFTER the bundle exists — see
# HOSTING.md for how to obtain apps/web_access/build/bundle):
#
#   docker build -f deploy/Dockerfile -t operit2-web-access .
#
# Run:
#   docker run --rm -p 8080:8080 operit2-web-access
#
# The image serves the bundle through nginx with the cross-origin isolation
# headers required by the threaded Sherpa ONNX WebAssembly runtime.

FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/web_access/build/bundle /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
