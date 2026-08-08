#!/usr/bin/env python3
"""Statische Qualitätsprüfung für die ClearWay-Website (Blueprint §21).
Aufruf: python3 _src/validate.py  (aus clearway/). Exit-Code 1 bei Fehlern."""
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ERRORS, WARNINGS = [], []

FORBIDDEN_BRANDS = ["purement", "netclosing"]
NAP = ["Friedrichstraße 108", "71638 Ludwigsburg"]
MIN_WORDS_SERVICE = 550


class Auditor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.h1 = 0
        self.headings = []
        self.imgs = []
        self.links = []
        self.text_parts = []
        self._link_stack = []
        self._heading_level = None
        self._in_main = False
        self._main_depth = 0
        self._depth = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self._depth += 1
        if tag == "main":
            self._in_main = True
            self._main_depth = self._depth
        if tag == "h1":
            self.h1 += 1
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.headings.append(int(tag[1]))
            self._heading_level = tag
        if tag == "img":
            self.imgs.append(a)
        if tag == "a":
            self._link_stack.append({"href": a.get("href", ""), "text": [],
                                     "aria": a.get("aria-label", "")})

    def handle_endtag(self, tag):
        if tag == "main":
            self._in_main = False
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._heading_level = None
        if tag == "a" and self._link_stack:
            link = self._link_stack.pop()
            link["text"] = " ".join("".join(link["text"]).split())
            self.links.append(link)
        self._depth -= 1

    def handle_data(self, data):
        if self._in_main:
            self.text_parts.append(data)
        for link in self._link_stack:
            link["text"].append(data)


def check_page(fname, html):
    p = Auditor()
    p.feed(html)

    # H1
    if p.h1 != 1:
        ERRORS.append(f"{fname}: {p.h1} H1-Elemente (erwartet: genau 1)")

    # Heading-Sprünge
    prev = 0
    for lvl in p.headings:
        if prev and lvl > prev + 1:
            ERRORS.append(f"{fname}: Heading-Sprung h{prev} → h{lvl}")
        prev = lvl
    if len(p.headings) > 40:
        WARNINGS.append(f"{fname}: auffällig viele Headings ({len(p.headings)})")

    # Bilder
    for img in p.imgs:
        src = img.get("src", "")
        if "alt" not in img:
            ERRORS.append(f"{fname}: img ohne alt-Attribut ({src})")
        if not img.get("width") or not img.get("height"):
            ERRORS.append(f"{fname}: img ohne width/height ({src})")
        if src and not src.startswith(("http", "data:")):
            if not os.path.exists(os.path.join(ROOT, src)):
                ERRORS.append(f"{fname}: Bild fehlt auf Platte: {src}")

    # Links
    seen_texts = {}
    for link in p.links:
        href, text = link["href"], link["text"]
        if not text and not link["aria"]:
            ERRORS.append(f"{fname}: leerer Link ohne Text/aria-label → {href}")
        if not href or href == "#":
            ERRORS.append(f"{fname}: Link ohne Ziel (Text: „{text[:40]}“)")
        elif not href.startswith(("http", "mailto:", "tel:", "#")):
            target = href.split("#")[0]
            if target and not os.path.exists(os.path.join(ROOT, target)):
                ERRORS.append(f"{fname}: interner Link auf fehlende Datei: {href}")
        if text:
            seen_texts.setdefault(text, 0)
            seen_texts[text] += 1
    for text, count in seen_texts.items():
        if count > 3 and text not in ("Kostenlos anfragen", "Impressum", "Datenschutz", "Kontakt", "Leistungen", "Startseite", "Über uns"):
            WARNINGS.append(f"{fname}: Ankertext „{text}“ {count}× identisch")

    # Meta
    if not re.search(r'<meta name="description" content="[^"]{40,}"', html):
        ERRORS.append(f"{fname}: Meta-Description fehlt oder zu kurz")
    if '<meta property="og:title"' not in html:
        ERRORS.append(f"{fname}: og:title fehlt")
    if '<meta property="og:image"' not in html:
        ERRORS.append(f"{fname}: og:image fehlt")
    if "<title>" not in html:
        ERRORS.append(f"{fname}: <title> fehlt")

    # Fremdmarken
    low = html.lower()
    for brand in FORBIDDEN_BRANDS:
        if brand in low:
            ERRORS.append(f"{fname}: verbotene Fremdmarke „{brand}“ gefunden!")

    # Wortzahl (nur indexierbare Inhaltsseiten)
    noindex = 'name="robots" content="noindex' in html
    words = len(re.findall(r"[A-Za-zÄÖÜäöüß]{2,}", " ".join(p.text_parts)))
    if not noindex and fname not in ("404.html",):
        limit = MIN_WORDS_SERVICE if fname not in ("kontakt.html",) else 250
        if words < limit:
            WARNINGS.append(f"{fname}: nur {words} Wörter im main-Inhalt")

    # Title-Kernwort muss im sichtbaren Text vorkommen
    m = re.search(r"<title>([^<|]+)", html)
    if m:
        first_word = re.findall(r"[A-Za-zÄÖÜäöüß\-&]+", m.group(1))
        if first_word:
            probe = first_word[0].split("-")[0][:10].lower()
            if probe not in " ".join(p.text_parts).lower():
                WARNINGS.append(f"{fname}: Title-Kernwort „{probe}“ nicht im Text gefunden")

    return words


def check_css():
    css = open(os.path.join(ROOT, "css", "style.css"), encoding="utf-8").read()
    defined = set(re.findall(r"(--[\w-]+)\s*:", css))
    used = set(re.findall(r"var\((--[\w-]+)", css))
    # Auch Inline-Verwendungen in HTML prüfen
    for fname in os.listdir(ROOT):
        if fname.endswith(".html"):
            html = open(os.path.join(ROOT, fname), encoding="utf-8").read()
            used |= set(re.findall(r"var\((--[\w-]+)", html))
    undefined = {u for u in used if u not in defined
                 and not u.startswith(("--reveal-delay", "--wipe-delay", "--ba-pos", "--line-progress",
                                        "--p", "--rx", "--ry", "--drop-delay", "--focus-delay",
                                        "--pulse-delay", "--trace-len", "--pane-delay", "--edge"))}
    for u in sorted(undefined):
        ERRORS.append(f"style.css: var({u}) wird benutzt, aber nirgends definiert")


def check_nap():
    for fname in sorted(os.listdir(ROOT)):
        if not fname.endswith(".html"):
            continue
        html = open(os.path.join(ROOT, fname), encoding="utf-8").read()
        for nap in NAP:
            wrong = re.findall(r"Friedrichstr(?:aße|asse|\.)\s*\d+", html)
            for w in wrong:
                if w != "Friedrichstraße 108":
                    ERRORS.append(f"{fname}: abweichende Adresse „{w}“")


def check_sitemap():
    pages = {f for f in os.listdir(ROOT) if f.endswith(".html")}
    sm = open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read()
    listed = set(re.findall(r"<loc>/?([^<]*)</loc>", sm))
    listed = {("index.html" if l in ("", "/") else l.lstrip("/")) for l in listed}
    for l in listed:
        if l not in pages:
            ERRORS.append(f"sitemap.xml: {l} existiert nicht")
    noindex_expected = {"impressum.html", "datenschutz.html", "404.html"}
    for page in pages - listed - noindex_expected:
        WARNINGS.append(f"sitemap.xml: {page} fehlt in der Sitemap")


def main():
    total = 0
    for fname in sorted(os.listdir(ROOT)):
        if fname.endswith(".html"):
            html = open(os.path.join(ROOT, fname), encoding="utf-8").read()
            words = check_page(fname, html)
            total += 1
            print(f"  geprüft: {fname} ({words} Wörter)")
    check_css()
    check_nap()
    check_sitemap()

    print(f"\n{total} Seiten geprüft.")
    if WARNINGS:
        print(f"\n⚠ {len(WARNINGS)} Hinweise:")
        for w in WARNINGS:
            print("  -", w)
    if ERRORS:
        print(f"\n✗ {len(ERRORS)} Fehler:")
        for e in ERRORS:
            print("  -", e)
        sys.exit(1)
    print("\n✓ Keine Fehler.")


if __name__ == "__main__":
    main()
