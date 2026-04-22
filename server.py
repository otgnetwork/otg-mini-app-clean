import os
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

PORT = int(os.environ.get("PORT", 8000))

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"
        return super().do_GET()

if __name__ == "__main__":
    with TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()
