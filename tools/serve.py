#!/usr/bin/env python3
"""Kleiner Server fuer die lokale Vorschau.

Bildet die Weiterleitungen der .htaccess nach: /webdesign/ liefert
webdesign.html. Ohne das laufen die Verweise in der Navigation lokal ins
Leere, obwohl sie auf dem Server richtig sind.

    python3 tools/serve.py [port]
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        clean = path.split("?", 1)[0].split("#", 1)[0]
        if clean in ("", "/"):
            return os.path.join(ROOT, "index.html")
        slug = clean.strip("/")
        if "." not in os.path.basename(slug):
            candidate = os.path.join(ROOT, slug + ".html")
            if os.path.isfile(candidate):
                return candidate
        return super().translate_path(path)

    def end_headers(self):
        if self.path.endswith(".html") or "." not in os.path.basename(self.path.strip("/")):
            self.send_header("Content-Type", "text/html; charset=UTF-8")
        super().end_headers()

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    with http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler) as httpd:
        print("Vorschau auf http://127.0.0.1:%d/" % port)
        httpd.serve_forever()
