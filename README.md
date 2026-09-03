# Netzexpert

Website für eine Agentur für Webdesign und SEO. Statisches HTML ohne
Redaktionssystem, ohne Framework, ohne Laufzeit-Abhängigkeiten. Die Seiten
werden aus Python-Generatoren erzeugt, ausgeliefert wird reines HTML, CSS und
etwas JavaScript.

```
python3 build/build.py        # alle Seiten erzeugen
python3 build/validate.py     # statische Prüfung
python3 tools/serve.py 8081   # Vorschau mit sprechenden Adressen
node tools/verify.mjs         # Browserprüfung über vier Breiten
```

---

## ⚠ Vor dem Livegang zu ersetzen

`build/parts.py` enthält oben ein `SITE`-Wörterbuch. Alles, was dort mit
`TODO_ECHTDATEN` markiert ist, ist erfunden und muss ersetzt werden. Danach
`build.py` erneut laufen lassen, dann stehen die Werte auf allen Seiten, in
den strukturierten Daten, in der Sitemap und in `llms.txt`.

| Was | Wo |
|---|---|
| Domain, E-Mail, Telefon, Anschrift, Region | `build/parts.py`, `SITE` |
| Inhaber und Gründungsjahr | `build/parts.py`, `SITE` |
| Persönlicher Absatz auf „Über uns" | `build/page_rest.py` |
| Handelsregister, USt-IdNr., Hoster, Aufsichtsbehörde | `build/page_legal.py` |
| Bildnachweis und Nutzungsrechte | `build/page_legal.py` |

`validate.py` zählt die verbliebenen Marker und meldet sie als Warnung.

**Referenzen sind Platzhalter.** Die beiden Fälle auf der Startseite
beschreiben Projekttypen ohne Firmennamen, Zahlen oder Logos. Bewusst wurde
nichts erfunden, was als Behauptung durchgehen könnte. Vor dem Livegang
gehören dort echte Fälle hin oder der Abschnitt entfällt.

**Fotografie ist Platzhalter.** Die eingebundenen Bilder zeigen eine
Studioszene, nicht die Arbeit dieser Agentur. Das Konzept verlangt echte
Editorial-Fotografie. Rechtelage vor der Veröffentlichung klären.

---

## Warum Generatoren

Bei acht Seiten von Hand gepflegt landet eine Änderung am Header
zuverlässig auf sieben davon. Header, Fußzeile, Seitengerüst, Bildeinbindung
und Schema liegen deshalb zentral in `build/parts.py`.

**Korrekturen gehören immer in den Generator, nie in eine erzeugte
HTML-Datei.** Sonst sind sie beim nächsten Build weg.

```
build/parts.py            SITE-Daten, CSS-Version, Kopf, Fuß, Gerüst, Schema, Bilder
build/page_home.py        Startseite
build/page_leistungen.py  Webdesign und SEO
build/page_rest.py        Prozess, Über uns, Kontakt
build/page_legal.py       Impressum, Datenschutz
build/build.py            erzeugt alle Seiten, Sitemap, robots, llms.txt, .htaccess
build/validate.py         zwölf statische Prüfungen
tools/optimize-images.mjs Bildaufbereitung (einmalig)
tools/verify.mjs          Browserprüfung
tools/serve.py            Vorschauserver mit den Weiterleitungen der .htaccess
```

Erzeugt werden acht HTML-Dateien im Wurzelverzeichnis plus `sitemap.xml`,
`robots.txt`, `llms.txt`, `.htaccess` und `htaccess.txt`. Die sichtbare Kopie
der Punktdatei liegt bei, weil `.htaccess` auf manchen Systemen unsichtbar ist
und beim Hochladen sonst vergessen wird.

---

## Gestaltung

Schwarz, Anthrazit, Graphit und warmes Off-White. **Kein Akzentton:** Farbe
kommt ausschließlich aus der Fotografie. Das ist die Umsetzung von „wenige
starke Elemente" und der Grund, warum die Seite nicht aussieht wie eine
Agenturvorlage mit Neonakzent.

Eine Schriftfamilie in zwei Rollen: **Archivo** als variable Schrift, deren
Breitenachse die Auszeichnung trägt (122 % im Hero) und deren Normalbreite den
Fließtext setzt. **IBM Plex Mono** für Beschriftungen und Meta-Angaben. Beide
werden selbst ausgeliefert, zusammen 112 kB.

Abschnittsabstände starten bewusst klein (`clamp(2.8rem, 5vw, 4.5rem)`). Bei
zwei aufeinanderfolgenden Abschnitten addieren sich sonst obere und untere
Polsterung zu einem Leerraum, der wie ein Fehler aussieht.

### Das Markenzeichen

Das Zeichen sitzt klein in der Navigation, löst sich beim Scrollen, wandert
durch die ersten Abschnitte und legt sich groß über die Webdesign-Komposition.
Dort hat es eine **echte Aufgabe**: sein Wachstum steuert die Blende, mit der
sich die Komposition öffnet. Danach kehrt es zurück und verschwindet.

Umgesetzt als ein einziges fixes Element mit einem Zustand pro Bild,
ausschließlich über `transform` und `opacity`, ohne Bibliothek. Unter 62 rem
und bei `prefers-reduced-motion` findet die Reise nicht statt: das Zeichen
bleibt schlicht in der Navigation, die Komposition ist offen.

---

## SEO

- Strukturierte Daten je Seitentyp: `ProfessionalService` und `FAQPage` auf der
  Startseite, `BreadcrumbList` mit `Service` und `FAQPage` auf den
  Leistungsseiten, `ContactPage` auf der Kontaktseite
- Brotkrume liegt **in** der Hero-Section. Als eigener Block davor entsteht ein
  sichtbarer Streifen zwischen Kopfzeile und Bild
- Karten nutzen das Muster mit gestrecktem Link (`::after { inset: 0 }`). Ein
  unsichtbarer Overlay-Link zählt als leerer Link
- Schrittbezeichnungen und Fußzeilentitel sind `span`, keine Überschriften.
  Sonst bläht sich die Gliederung auf und es entstehen Sprünge
- Zeichensatz steht im HTTP-Header, nicht nur im Meta-Tag
- Rechtsseiten auf `noindex` und nicht in der Sitemap
- `llms.txt` im Wurzelverzeichnis für Sprachmodelle
- Kein Kontaktformular. Ein Formular ohne Schutz sammelt vor allem Werbemüll
  und erzeugt Pflichten, die eine E-Mail nicht erzeugt

### Ton

Du-Ansprache, keine Gedankenstriche, keine Buzzwords. Ehrlichkeit als
Positionierung: Auf mehreren Seiten steht, wann sich eine Leistung **nicht**
lohnt. Das ist Absicht und sollte beim Weiterschreiben erhalten bleiben.

---

## Prüfung

`build/validate.py` prüft ohne Browser: genau eine H1, keine Sprünge in der
Gliederung, höchstens 22 Überschriften, alle Wörter aus H1 und Title im
Fließtext, keine leeren Links, keine doppelten Ankertexte, `alt` und
`width`/`height` an jedem Bild, einheitliche CSS-Version, keine CSS-Variable
ohne Definition, Canonical und OG und Schema, konsistente Kontaktdaten,
Wortzahl je Seite.

`tools/verify.mjs` fährt 375, 768, 1280 und 1920 px über alle acht Seiten,
scrollt jede vollständig durch und prüft Konsolenfehler, fehlgeschlagene
Anfragen, ausgelöste Reveals, waagerechten Überlauf, Kontrast nach WCAG 2.1,
die Choreografie des Zeichens, das Menü auf kleinen Geräten,
Bewegungsreduktion und die Darstellung ohne JavaScript.

Letzter Stand: **beide Pipelines 0 Befunde.**

| Messwert | Ergebnis |
|---|---|
| Startseite übertragen | 154 bis 188 kB |
| Wortzahl je indexierbarer Seite | 776 bis 822 |
| Bilder gesamt | 1,2 MB (aus 14,8 MB Ausgangsmaterial) |
| Schriften | 112 kB, selbst ausgeliefert |
| Laufzeit-Abhängigkeiten | keine |

### Zugänglichkeit

Ohne JavaScript bleibt die Seite vollständig lesbar: die Reveal-Zustände
hängen an einer Klasse, die erst ein Inline-Skript setzt. Bei
`prefers-reduced-motion` entfallen Bewegung und Blende, Deckkraft und Farbe
bleiben. Das Menü meldet seinen Zustand über `aria-expanded` und schließt mit
Escape.

---

## Bilder austauschen

`tools/optimize-images.mjs` enthält oben eine Liste aus Dateiname, Kennung und
Alternativtext:

```
npm install
SRC_DIR=/pfad/zu/den/originalen npm run images
```

Das Skript schreibt AVIF und WebP in drei Breiten, erzeugt `manifest.json` und
gibt fertige `srcset`-Zeilen aus. Die unscharfen Platzhalter in `lqip.css`
werden daraus abgeleitet. Originaldateien gehören nicht ins Repository.

Die Alternativtexte auf den Seiten werden beim Einbinden gesetzt, nicht aus dem
Manifest gezogen: dasselbe Bild braucht je nach Zusammenhang eine andere
Beschreibung.

---

## Veröffentlichen

Alles außer `build/`, `tools/`, `node_modules/` und `package*.json` gehört auf
den Server. Die `.htaccess` erzwingt HTTPS, entfernt `www`, setzt den
Zeichensatz im HTTP-Header, bildet die sprechenden Adressen auf die flachen
HTML-Dateien ab und regelt die Zwischenspeicherung.

Vor dem Livegang: Verweisprofil der Domain ziehen und alte Adressen mit echten
Verweisen in Abschnitt 2b der `.htaccess` direkt auf die passende neue Seite
weiterleiten. Ein 301 aufs Ziel, keine Ketten.

Bei jeder Designänderung `CSS_VER` in `build/parts.py` hochziehen. Sonst sieht
der Kunde eine alte Fassung aus dem Cache und meldet einen Fehler, der keiner
ist.

## Lizenz

Die Schriften stehen unter der SIL Open Font License 1.1, siehe
`assets/fonts/LICENSE.txt`. Für die Fotografien ist keine Lizenz hinterlegt.
