import os
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

PORT = int(os.environ.get("PORT", 8000))

class Handler(SimpleHTTPRequestHandler):
    pass

if __name__ == "__main__":
    with TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()
