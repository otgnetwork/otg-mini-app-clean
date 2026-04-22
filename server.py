import json
import os
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

PORT = int(os.environ.get("PORT", 8000))
BACKEND_URL = "https://telegram-music-bot-production-6e89.up.railway.app/search"

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"
            return super().do_GET()

        if self.path.startswith("/api/search"):
            return self.handle_api_search()

        return super().do_GET()

    def handle_api_search(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            q = params.get("q", [""])[0].strip()

            target = f"{BACKEND_URL}?q={urllib.parse.quote(q)}"
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

if __name__ == "__main__":
    with TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()
