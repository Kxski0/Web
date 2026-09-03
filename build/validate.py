# -*- coding: utf-8 -*-
"""Statische Pruefung aller erzeugten Seiten.

    python3 build/validate.py

Deckt die Fehlerklassen ab, die SEO-Werkzeuge melden und die man beim
Bauen zuverlaessig uebersieht. Laeuft ohne Browser.
"""
import os
import re
import sys
import collections

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from parts import BASE, CSS_VER, SITE  # noqa: E402

PAGES = ["index", "webdesign", "seo", "kontakt", "prozess", "ueber-uns",
         "impressum", "datenschutz"]
INDEXABLE = PAGES[:6]

MIN_WORDS = 555
TARGET_WORDS = 800
MAX_HEADINGS = 22

# Variablen, die zur Laufzeit oder im style-Attribut gesetzt werden.
RUNTIME_VARS = {"--lqip", "--reveal-delay", "--word-delay", "--aperture"}

problems = []
warnings = []
notes = []


def fail(scope, msg):
    problems.append("[%s] %s" % (scope, msg))


def warn(scope, msg):
    warnings.append("[%s] %s" % (scope, msg))


def strip_tags(html):
    html = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", html)
    return re.sub(r"(?s)<[^>]+>", " ", html)


def words_of(text):
    text = (text.replace("&nbsp;", " ").replace("&amp;", "&")
                .replace("&quot;", '"').replace("&lt;", "<").replace("&gt;", ">"))
    return [w for w in re.findall(r"[0-9A-Za-zÄÖÜäöüß]+", text)]


def content_html(html):
    """Seiteninhalt ohne Kopf- und Fusszeile."""
    body = html.split("<body>", 1)[-1].rsplit("</body>", 1)[0]
    body = re.sub(r"(?is)<header\b.*?</header>", " ", body)
    body = re.sub(r"(?is)<footer\b.*?</footer>", " ", body)
    body = re.sub(r"(?is)<nav\b.*?</nav>", " ", body)
    return body


def check_page(slug, html):
    content = content_html(html)
    text = strip_tags(content)
    wordlist = words_of(text)

    # 1 Genau eine H1
    h1s = re.findall(r"(?is)<h1\b[^>]*>(.*?)</h1>", html)
    if len(h1s) != 1:
        fail(slug, "%d H1 gefunden, genau eine erwartet" % len(h1s))
    h1_text = strip_tags(h1s[0]) if h1s else ""

    # 2 + 3 Gliederung
    levels = [int(m) for m in re.findall(r"(?is)<h([1-6])\b", content_html(html))]
    prev = 0
    for lvl in levels:
        if prev and lvl > prev + 1:
            fail(slug, "Überschrift springt von h%d auf h%d" % (prev, lvl))
        prev = lvl
    if len(levels) > MAX_HEADINGS:
        warn(slug, "%d Überschriften (Richtwert höchstens %d)" % (len(levels), MAX_HEADINGS))

    # 4 Woerter aus H1 und Title muessen im Fliesstext vorkommen
    title = re.search(r"(?is)<title>(.*?)</title>", html)
    title_text = strip_tags(title.group(1)) if title else ""
    body_words = {w.lower() for w in wordlist}
    ignore = {"und", "der", "die", "das", "von", "aus", "mit", "für", "fuer",
              "ohne", "ein", "eine", "eines", "einer", "einem", "den", "dem",
              "im", "in", "am", "zu", "so", "es", "an", "auf", "bei", "als",
              SITE["brand"].lower()}
    missing = set()
    for source in (h1_text, title_text):
        for w in words_of(source):
            lw = w.lower()
            if len(lw) < 4 or lw in ignore:
                continue
            if lw not in body_words:
                missing.add(w)
    if missing:
        fail(slug, "Wörter aus H1 oder Title fehlen im Fließtext: %s"
             % ", ".join(sorted(missing)))

    # 5 Keine leeren Links
    for m in re.finditer(r"(?is)<a\b([^>]*)>(.*?)</a>", html):
        attrs, inner = m.group(1), m.group(2)
        has_text = bool(strip_tags(inner).strip())
        has_img = "<img" in inner.lower() or "<svg" in inner.lower()
        has_label = "aria-label" in attrs.lower()
        if not (has_text or has_img or has_label):
            fail(slug, "Leerer Link: <a%s>" % attrs[:60])

    # 6 Keine doppelten sichtbaren Ankertexte im Inhalt
    anchors = []
    for m in re.finditer(r"(?is)<a\b[^>]*>(.*?)</a>", content):
        t = " ".join(strip_tags(m.group(1)).split()).lower()
        if t:
            anchors.append(t)
    for t, n in collections.Counter(anchors).items():
        if n > 1 and len(t) > 3:
            warn(slug, 'Ankertext "%s" kommt %dmal vor' % (t[:44], n))

    # 7 Alle Bilder mit aussagekraeftigem alt
    for m in re.finditer(r"(?is)<img\b([^>]*)>", html):
        attrs = m.group(1)
        alt = re.search(r'alt="([^"]*)"', attrs)
        if not alt:
            fail(slug, "img ohne alt-Attribut")
        elif len(alt.group(1).strip()) < 8:
            fail(slug, "img mit zu kurzem alt: %r" % alt.group(1))
        if not re.search(r'\bwidth="\d+"', attrs) or not re.search(r'\bheight="\d+"', attrs):
            fail(slug, "img ohne width/height")

    # 8 CSS-Version einheitlich
    vers = set(re.findall(r"\.css\?v=(\d+)", html))
    if vers != {str(CSS_VER)}:
        fail(slug, "CSS-Version %s, erwartet %d" % (vers or "keine", CSS_VER))

    # 10 Kopfdaten
    noindex = 'content="noindex' in html
    for needle, label in (('rel="canonical"', "Canonical"),
                          ('property="og:title"', "og:title"),
                          ('property="og:image"', "og:image"),
                          ('name="twitter:card"', "twitter:card")):
        if needle not in html:
            fail(slug, "%s fehlt" % label)
    if not noindex and "application/ld+json" not in html:
        fail(slug, "Kein strukturiertes Datenobjekt")
    if slug in ("impressum", "datenschutz") and not noindex:
        fail(slug, "Rechtsseite ohne noindex")

    # 12 Wortzahl
    n = len(wordlist)
    if slug in INDEXABLE:
        if n < MIN_WORDS:
            fail(slug, "nur %d Wörter (Minimum %d)" % (n, MIN_WORDS))
        elif n < TARGET_WORDS:
            warn(slug, "%d Wörter (Ziel %d)" % (n, TARGET_WORDS))
        else:
            notes.append("[%s] %d Wörter" % (slug, n))
    return n


def check_css():
    """9 Keine Verwendung einer Variablen ohne Definition.

    Eine undefinierte Variable ist kein Fehler, den der Browser meldet: der
    Wert wird schlicht geerbt. Das erzeugt still falsche Farben.
    """
    css = ""
    for name in ("site.css", "fonts.css", "lqip.css"):
        path = os.path.join(BASE, "assets/css", name)
        if os.path.exists(path):
            with open(path, encoding="utf-8") as fh:
                css += fh.read()
    defined = set(re.findall(r"(--[a-z0-9-]+)\s*:", css)) | RUNTIME_VARS
    used = set(re.findall(r"var\((--[a-z0-9-]+)", css))
    for name in sorted(used - defined):
        fail("css", "var(%s) ohne Definition" % name)
    notes.append("[css] %d Variablen definiert, %d verwendet" % (len(defined), len(used)))


def check_consistency(pages):
    """11 Kontaktdaten ueberall gleich."""
    mails = set()
    phones = set()
    for html in pages.values():
        mails |= set(re.findall(r"mailto:([^\"'>\s]+)", html))
        phones |= set(re.findall(r'href="tel:([^"]+)"', html))
    if len(mails) > 1:
        fail("konsistenz", "Mehrere E-Mail-Adressen: %s" % ", ".join(sorted(mails)))
    if len(phones) > 1:
        fail("konsistenz", "Mehrere Telefonnummern: %s" % ", ".join(sorted(phones)))
    notes.append("[konsistenz] E-Mail %s, Telefon %s"
                 % (", ".join(mails) or "keine", ", ".join(phones) or "keine"))


def check_placeholders(pages):
    total = sum(html.count("TODO_ECHTDATEN") for html in pages.values())
    if total:
        warnings.append("[platzhalter] %d Stellen mit TODO_ECHTDATEN in den Seiten. "
                        "Vor dem Livegang ersetzen." % total)


def check_sitemap(pages):
    path = os.path.join(BASE, "sitemap.xml")
    if not os.path.exists(path):
        fail("sitemap", "sitemap.xml fehlt")
        return
    with open(path, encoding="utf-8") as fh:
        sm = fh.read()
    for slug in ("impressum", "datenschutz"):
        if "/%s/" % slug in sm:
            fail("sitemap", "%s steht in der Sitemap, gehört dort nicht hin" % slug)
    for slug in INDEXABLE:
        loc = SITE["url"] + ("/" if slug == "index" else "/%s/" % slug)
        if "<loc>%s</loc>" % loc not in sm:
            fail("sitemap", "%s fehlt in der Sitemap" % loc)


def main():
    pages = {}
    for slug in PAGES:
        path = os.path.join(BASE, "%s.html" % slug)
        if not os.path.exists(path):
            fail(slug, "Datei fehlt, bitte build.py laufen lassen")
            continue
        with open(path, encoding="utf-8") as fh:
            pages[slug] = fh.read()

    for slug, html in pages.items():
        check_page(slug, html)
    check_css()
    check_consistency(pages)
    check_placeholders(pages)
    check_sitemap(pages)

    print("──── Hinweise ────")
    for n in notes:
        print("  " + n)
    if warnings:
        print("\n──── Warnungen: %d ────" % len(warnings))
        for w in warnings:
            print("  ! " + w)
    print("\n──── Befunde: %d ────" % len(problems))
    for p in problems:
        print("  ✗ " + p)
    if not problems:
        print("  Keine.")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
