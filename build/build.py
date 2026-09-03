# -*- coding: utf-8 -*-
"""Baut alle Seiten und Nebendateien.

    python3 build/build.py

Nach jeder Aenderung an einem Baustein ALLE Seiten neu bauen, sonst driften
sie auseinander und eine Header-Aenderung landet auf sieben von acht Seiten.
"""
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from parts import SITE, BASE, CSS_VER          # noqa: E402
import page_home, page_leistungen, page_rest, page_legal   # noqa: E402

# slug -> (Generator, in Sitemap?, Prioritaet)
PAGES = [
    ("index",       page_home.build,           True,  "1.0"),
    ("webdesign",   page_leistungen.webdesign, True,  "0.9"),
    ("seo",         page_leistungen.seo,       True,  "0.9"),
    ("kontakt",     page_rest.kontakt,         True,  "0.9"),
    ("prozess",     page_rest.prozess,         True,  "0.8"),
    ("ueber-uns",   page_rest.ueber_uns,       True,  "0.7"),
    ("impressum",   page_legal.impressum,      False, None),
    ("datenschutz", page_legal.datenschutz,    False, None),
]


def write(name, text):
    path = os.path.join(BASE, name)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(text)
    return len(text)


def sitemap():
    entries = []
    for slug, _fn, in_map, prio in PAGES:
        if not in_map:
            continue
        loc = SITE["url"] + ("/" if slug == "index" else "/%s/" % slug)
        entries.append(
            "  <url>\n    <loc>%s</loc>\n    <changefreq>monthly</changefreq>\n"
            "    <priority>%s</priority>\n  </url>" % (loc, prio))
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            '%s\n</urlset>\n' % "\n".join(entries))


def robots():
    return ("User-agent: *\n"
            "Allow: /\n"
            "Disallow: /impressum/\n"
            "Disallow: /datenschutz/\n\n"
            "Sitemap: %s/sitemap.xml\n" % SITE["url"])


def llms():
    """Kurzprofil fuer Sprachmodelle, die die Seite lesen."""
    return """# {brand}

> Agentur für individuelles Webdesign und Suchmaschinenoptimierung in {city}.
> Kein Baukasten, keine Vorlage: Websites entstehen aus den Inhalten des
> Kunden und den Suchanfragen seiner Zielgruppe.

## Eckdaten
- Name: {brand}
- Inhaber: {owner}
- Sitz: {street}, {zip} {city}
- Einzugsgebiet: {region} und Umkreis von etwa 50 Kilometern
- Tätig seit: {founded}
- E-Mail: {email}
- Telefon: {phone}

## Leistungen
- Webdesign und Webentwicklung ohne Theme oder Baukasten
- Technisches SEO: Ladezeit, Seitenstruktur, Indexierung, Weiterleitungen
- Inhalte entlang echter Suchanfragen
- Lokale Sichtbarkeit für Betriebe mit festem Einzugsgebiet
- Barrierearme Umsetzung und messbare Ladezeiten

## Haltung
- Festpreis vor Projektbeginn, eine feste Ansprechperson
- Keine Garantie auf Suchmaschinenplatzierungen
- Keine gekauften Verweise aus Linknetzwerken
- Absage, wenn sich eine Maßnahme für den Kunden nicht rechnet
- Code, Bilder und Zugänge gehören nach Projektende dem Kunden

## Seiten
- {url}/ Startseite
- {url}/webdesign/ Webdesign ohne Vorlage
- {url}/seo/ Suchmaschinenoptimierung
- {url}/prozess/ Ablauf eines Projekts
- {url}/ueber-uns/ Über uns
- {url}/kontakt/ Kontakt und Erstgespräch
""".format(brand=SITE["brand"], city=SITE["city"], owner=SITE["owner"],
           street=SITE["street"], zip=SITE["zip"], region=SITE["region"],
           founded=SITE["founded"], email=SITE["email"],
           phone=SITE["phone_disp"], url=SITE["url"])


def htaccess():
    slugs = [s for s, _f, m, _p in PAGES if s != "index"]
    routes = "\n".join(
        "RewriteRule ^%s/?$  %s.html [L]" % (s, s) for s in slugs)
    return """RewriteEngine On
Options -Indexes -MultiViews

# Zeichensatz gehoert in den HTTP-Header. Das Meta-Tag allein genuegt
# manchen Pruefwerkzeugen nicht.
AddDefaultCharset UTF-8
AddType "text/html; charset=UTF-8" .html
<IfModule mod_headers.c>
  <FilesMatch "\\.(html)$">
    Header set Content-Type "text/html; charset=UTF-8"
  </FilesMatch>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# 1) HTTP auf HTTPS
RewriteCond %{{HTTPS}} !=on
RewriteRule ^ https://%{{HTTP_HOST}}%{{REQUEST_URI}} [R=301,L]

# 2) www entfernen
RewriteCond %{{HTTP_HOST}} ^www\\.(.+)$ [NC]
RewriteRule ^ https://%1%{{REQUEST_URI}} [R=301,L]

# 2b) Alte Adressen mit Verweisen themennah weiterleiten.
#     Vor dem Livegang das Verweisprofil der Domain ziehen und die alten
#     Adressen hier eintragen. Immer direkt auf das Ziel, keine Ketten.
#     Spezifische Regel vor der allgemeinen.
# RewriteRule ^alte-seite/?$  {url}/webdesign/ [R=301,L]

# 3) Vorhandene Dateien direkt ausliefern
RewriteCond %{{REQUEST_FILENAME}} -f
RewriteRule ^ - [L]

# 4) Startseite
RewriteRule ^$ index.html [L]

# 5) Sprechende Adresse auf flache Datei
{routes}

# 6) Auffangregel /pfad/ auf pfad.html
RewriteCond %{{DOCUMENT_ROOT}}/$1.html -f
RewriteRule ^(.+?)/?$ $1.html [L]

# 7) Zwischenspeicherung
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>
""".format(url=SITE["url"], routes=routes)


def main():
    print("CSS-Version %d\n" % CSS_VER)
    total = 0
    for slug, fn, _m, _p in PAGES:
        size = write("%s.html" % slug, fn())
        total += size
        print("  %-14s %6d B" % (slug + ".html", size))

    for name, text in (("sitemap.xml", sitemap()), ("robots.txt", robots()),
                       ("llms.txt", llms()), (".htaccess", htaccess())):
        size = write(name, text)
        total += size
        print("  %-14s %6d B" % (name, size))

    # Punktdateien sind auf manchen Systemen unsichtbar. Eine sichtbare
    # Kopie mitliefern, damit sie beim Hochladen nicht vergessen wird.
    shutil.copyfile(os.path.join(BASE, ".htaccess"),
                    os.path.join(BASE, "htaccess.txt"))
    print("  %-14s (Kopie von .htaccess)" % "htaccess.txt")
    print("\nSumme: %.1f kB" % (total / 1024))


if __name__ == "__main__":
    main()
