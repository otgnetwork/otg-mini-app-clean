from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
import os
import json
import urllib.parse
import urllib.request

PORT = int(os.environ.get("PORT", 8080))
BACKEND_BASE = "https://telegram-music-bot-production-6e89.up.railway.app"

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"
            return super().do_GET()

        if self.path.startswith("/api/search"):
            return self.handle_api_search()

        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/song-order":
            return self.handle_song_order()

        self.send_response(404)
        self.end_headers()

    def handle_api_search(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            q = params.get("q", [""])[0].strip()

            target = f"{BACKEND_BASE}/search?q={urllib.parse.quote(q)}"
            with urllib.request.urlopen(target, timeout=20) as resp:
                body = resp.read()
                status = resp.getcode()

            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            error = {"error": "proxy_failed", "details": str(e)}
            self.wfile.write(json.dumps(error).encode("utf-8"))

    def handle_song_order(self):
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length)

            req = urllib.request.Request(
                f"{BACKEND_BASE}/song-order",
                data=raw_body,
                headers={"Content-Type": "application/json"},
                method="POST",
            )

            with urllib.request.urlopen(req, timeout=20) as resp:
                body = resp.read()
                status = resp.getcode()

            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            error = {"error": "order_proxy_failed", "details": str(e)}
            self.wfile.write(json.dumps(error).encode("utf-8"))

with TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
