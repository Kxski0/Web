# Business Dashboard

Eine eigenständige Web-App für Kunden, Aufträge, Rechnungen, Projekte, Aufgaben,
eigene Websites und Website-Inspiration. Gebaut für die tägliche Nutzung auf dem
iPad, vorbereitet für den Betrieb in Wix.

Keine Laufzeit-Abhängigkeiten, kein Framework. Der gesamte Code sind ES-Module,
der Build (esbuild) erzeugt daraus ein Bündel von rund 138 kB JavaScript und
31 kB CSS.

---

## Sofort starten

Das Dashboard ist ein eigenständiges Paket mit eigener `package.json`. Es wird
getrennt von der Website im Projektstamm installiert und gebaut.

```bash
cd dashboard
pnpm install      # nur esbuild, sonst nichts
pnpm build

# Öffnen: dashboard/dist/index.html
```

Aus dem Projektstamm geht es auch: `pnpm dashboard:build`, `pnpm dashboard:test`,
`pnpm dashboard:lint`.

Für die Entwicklung reicht `dashboard/index.html` über einen beliebigen
statischen Server – dort werden die Module nativ geladen, ganz ohne Build.

Auf dem iPad: Seite in Safari öffnen, Teilen → *Zum Home-Bildschirm*. Die App
startet dann im Vollbild ohne Browserleiste (Manifest und Icons liegen bei).

---

## Was wo liegt

```
dashboard/
├─ src/
│  ├─ core/           Fundament ohne UI und ohne Datenbankbezug
│  │  ├─ util.js       IDs, Sortierung, URL-Prüfung, Textnormalisierung
│  │  ├─ format.js     de-DE/EUR-Formatierung, Datumsrechnung, Zeiträume
│  │  ├─ validate.js   Normalisierung + Validierung (Frontend UND Wix-Backend)
│  │  ├─ router.js     Hash-Routing (standalone) / Speicher-Routing (Wix)
│  │  └─ emitter.js
│  ├─ data/
│  │  ├─ schema.js     Datenmodell: alle Entitäten, Felder, Status, Beziehungen
│  │  ├─ store.js      Cache, CRUD, Aktivitätslog, Auto-Überfällig, Export/Import
│  │  ├─ demo.js       Demodaten (nur auf Knopfdruck)
│  │  └─ adapters/     local.js (Browser) · wix.js (Velo) · index.js (Auswahl)
│  ├─ domain/         Berechnungen, keine Darstellung
│  │  ├─ metrics.js    Umsatz, Forderungen, Auftragszahlen, Kundenkennzahlen
│  │  ├─ search.js     globale Suche über alle Entitäten
│  │  └─ preview.js    Vorschaubilder und Website-Analyse
│  ├─ ui/
│  │  ├─ dom.js        h()-Helfer, kein innerHTML mit Nutzerdaten
│  │  ├─ icons.js      Inline-SVG-Icons
│  │  ├─ components/   Card, StatCard, Table, Modal, Form, Chart, Toolbar, …
│  │  ├─ layout/       Shell (Sidebar/Topbar), GlobalSearch
│  │  └─ views/        eine Datei je Bereich + listView/detailView als Fabrik
│  ├─ app.css
│  └─ main.js         Verdrahtung: Adapter → Store → Router → Shell → Ansichten
├─ wix/               alles für die Wix-Integration (siehe wix/README.md)
├─ scripts/           Tests und Generatoren
├─ build.mjs
└─ index.html
```

Die Trennung ist strikt: `core` kennt keine Daten, `domain` kennt kein DOM,
`ui` rechnet nicht. Wer eine Zahl ändern will, ändert `domain/metrics.js`.

---

## Datenmodell

Alle Entitäten stehen in **einer** Datei: `src/data/schema.js`. Daraus werden
Formulare, Tabellen, Validierung, Suche und die Wix-CMS-Definitionen erzeugt.
Ein neues Feld braucht genau einen Eintrag dort.

| Entität       | Kollektion (Wix)      | Beziehungen                       |
|---------------|-----------------------|-----------------------------------|
| `customers`   | `DashboardCustomers`  | –                                 |
| `orders`      | `DashboardOrders`     | → Kunde                           |
| `invoices`    | `DashboardInvoices`   | → Kunde, → Auftrag                |
| `websites`    | `DashboardWebsites`   | → Kunde                           |
| `references`  | `DashboardReferences` | –                                 |
| `projects`    | `DashboardProjects`   | → Kunde                           |
| `tasks`       | `DashboardTasks`      | → Projekt                         |

Dazu `DashboardActivity` (Verlauf) und `DashboardSettings` (ein Datensatz).

**Löschen mit Beziehungsschutz:** Ein Kunde mit Aufträgen oder Rechnungen wird
nicht stillschweigend entfernt. Der Dialog nennt die betroffenen Datensätze;
bestätigt man, bleiben Aufträge und Rechnungen erhalten und verlieren nur die
Zuordnung. Belege verschwinden nie durch einen Klick an anderer Stelle.

---

## Wie „Umsatz" gerechnet wird

Das ist die einzige Stelle, an der es eine echte Entscheidung gibt. Sie ist
umstellbar (Einstellungen → Umsatzbasis) und wird überall angezeigt, wo sie zählt.

**Standard: bezahlte Rechnungen.** Umsatz = Summe aller Rechnungen mit Status
*Bezahlt*, datiert auf das Zahlungsdatum. Das entspricht tatsächlich
eingegangenem Geld.

**Alternative: abgeschlossene Aufträge.** Umsatz = Summe aller Aufträge mit
Status *Abgeschlossen*, datiert auf Deadline bzw. Erstellungsdatum. Sinnvoll,
wenn nicht jeder Auftrag als Rechnung erfasst wird.

Unabhängig davon gilt immer:

- **Ausstehender Betrag** = Summe der Rechnungen mit Status *Offen* + *Überfällig*
- **Bezahlt** = Summe der Rechnungen mit Status *Bezahlt*
- *Entwurf* und *Storniert* zählen nirgends mit.

Beispiel aus der Anforderung: 500 € bezahlt, 800 € offen, 1.200 € überfällig
→ Dashboard zeigt **Offen 2.000 €**, **Bezahlt 500 €**. Genau das prüft
`scripts/e2e.mjs` im Browser.

**Auftragsstatus** ist überschneidungsfrei aufgeteilt:

- *Offene Aufträge*: Anfrage, Angebot
- *Aktuelle Aufträge*: Angenommen, In Bearbeitung, Wartet auf Kunde
- *Abgeschlossene Aufträge*: Abgeschlossen
- (Storniert zählt separat)

**Überfällig automatisch:** Beim Start, bei jeder Rückkehr auf den Tab und
stündlich prüft der Store alle offenen Rechnungen gegen das Fälligkeitsdatum und
setzt den Status. Wird die Frist verschoben, geht der Status zurück auf *Offen*.

---

## Speicherung

Zwei Adapter hinter einer Schnittstelle (`src/data/adapters/`):

| Betrieb          | Adapter | Speicher                                    |
|------------------|---------|---------------------------------------------|
| Eigenständig     | `local` | `localStorage`, eine Kollektion pro Schlüssel |
| In Wix           | `wix`   | Wix Data über ein `Permissions.Admin`-Web-Modul |

Der Store lädt beim Start alles einmal in den Speicher. Danach lesen alle
Ansichten synchron – deshalb reagieren Filter, Sortierung und Suche sofort, auch
wenn die Daten in Wix liegen. Geschrieben wird sofort durch.

Es gibt **keinen** stillen Wechsel zwischen den Adaptern: Ist die Wix-Brücke da,
aber das Backend nicht erreichbar, zeigt die App einen Fehler statt eines leeren
Dashboards, das man für seinen Datenstand halten könnte.

Sicherung: Einstellungen → *Sicherung herunterladen* (JSON, mit allen Beziehungen)
und *Sicherung einspielen*. Das ist gleichzeitig der Migrationsweg vom Browser
nach Wix.

---

## iPad

- Jedes Bedienelement ist mindestens 44 px hoch (Icon-Schalter in Listen 36 px).
- Keine Funktion nur per Hover – Zeilenaktionen sind immer sichtbar.
- Eingabefelder haben 16 px Schriftgröße, damit iOS beim Fokussieren nicht zoomt.
- Tabellen werden unter 900 px Breite zur Kartenliste; kein waagerechtes Scrollen.
- Sidebar steht ab 1024 px fest, darunter fährt sie als Overlay ein und schließt
  nach der Auswahl.
- `safe-area-inset` wird oben und unten berücksichtigt (Homescreen-Betrieb).
- Dialoge kommen schmal von unten, breit zentriert.

Geprüft werden fünf Größen von 390 px bis 1440 px in `scripts/e2e.mjs`.

---

## Sicherheit

- **Keine Schlüssel im Frontend.** Der Wix-Adapter spricht nie mit der Datenbank,
  sondern nur mit dem Page-Code, der ein `Permissions.Admin`-Web-Modul aufruft.
- **Whitelist statt Durchreichen.** Das Web-Modul akzeptiert nur bekannte
  Kollektionsnamen und nur die im Schema definierten Felder.
- **Doppelte Validierung.** `core/validate.js` läuft im Browser *und* im Backend –
  dieselbe Datei, damit beide nicht auseinanderlaufen.
- **Kein `innerHTML` mit Nutzerdaten.** Texte werden ausschließlich über
  `textContent` gesetzt; ein `<script>` in einer Notiz bleibt Text.
- **URLs werden geprüft.** `normalizeUrl` lässt nur `http`/`https` durch,
  `javascript:` wird verworfen. Externe Links tragen `rel="noopener noreferrer"`.
- **SSRF-Schutz** im Analyse-Modul: localhost und private Adressbereiche werden
  abgelehnt.
- **Keine Fremdressourcen.** Die App lädt nichts von externen Servern – keine
  Schriften, keine Icons, kein CDN. Das prüft der E2E-Test.

---

## Website-Vorschau und -Analyse

Beides ist **optional und standardmäßig aus**. Die Anwendung funktioniert
vollständig ohne.

**Warum es nicht einfach im Browser geht:**

- Ein Screenshot einer fremden Seite ist im Browser unmöglich. `<iframe>` wird
  von den meisten Seiten per `X-Frame-Options` / `frame-ancestors` blockiert, und
  selbst ein dargestellter iframe ließe sich wegen der Same-Origin-Policy nicht
  auslesen.
- Das HTML einer fremden Seite lässt sich per `fetch` nicht lesen (CORS).

**Vorschaubilder:** Entweder eigenes Bild hochladen (funktioniert immer) oder in
den Einstellungen eine Vorlage für einen Screenshot-Dienst hinterlegen
(`https://dienst.example/shot?url={encoded}`). Es ist bewusst kein Dienst
voreingestellt – jeder Aufruf verrät die betrachtete Adresse an einen Dritten.

**Website analysieren:** Läuft die App in Wix, übernimmt das mitgelieferte
Web-Modul `wix/backend/analyze.web.js` die Arbeit serverseitig: Es holt die
Seite und wertet ihre Struktur aus (Überschriften, Navigation, Hero, CTAs,
Schriften, erkennbare Animationsbibliotheken, Abschnitte, Medien) und liefert
einen Bericht in der gewohnten Gliederung. Das funktioniert **ohne jeden
externen Dienst und ohne API-Schlüssel**. Optional lässt sich zusätzlich ein
Textdienst anbinden (Schlüssel im Wix Secrets Manager, siehe `wix/README.md`).

Außerhalb von Wix trägt man in den Einstellungen einen eigenen Endpunkt ein, der
`POST { url }` annimmt und `{ analysis: "…" }` zurückgibt.

Ist nichts eingerichtet, erklärt der Dialog das und bietet eine ausfüllbare
Vorlage mit allen Abschnitten an. Es werden keine fremden Inhalte gespeichert –
nur eine strukturelle Zusammenfassung für den Eigenbedarf.

---

## Wix

Siehe **[`wix/README.md`](wix/README.md)** für die Schritt-für-Schritt-Anleitung,
die Aufteilung „was kann Wix nativ / was braucht Velo / was braucht das CMS /
was geht nicht" und die Liste der noch benötigten Angaben.

---

## Hosting auf Vercel

`vercel.json` liegt im Ordner und beschreibt alles, was Vercel wissen muss:
Build-Befehl (`node build.mjs`), Ausgabeverzeichnis (`dist`) und die
Auslieferungs-Header.

Wichtig ist das **Root-Verzeichnis `dashboard`** in den Projekteinstellungen.
Nur so bekommt das Dashboard eine eigene Konfiguration – die Website im
Projektstamm ist ein anderes Vercel-Projekt und teilt sich mit ihm das
Repository, aber nicht die Build-Einstellungen.

Ausgeliefert wird mit einer strengen Content-Security-Policy: `script-src 'self'`
ohne `unsafe-inline` (deshalb erzeugt der Build eine eigene `boot.js` statt eines
Inline-Skripts), dazu `X-Robots-Tag: noindex`, `frame-ancestors 'none'` und
`Referrer-Policy: no-referrer`. Der E2E-Test lädt die gebaute Fassung unter
genau diesen Headern, damit ein Verstoß vor dem Deployment auffällt.

Zwei Zugeständnisse in der Richtlinie, beide bewusst:
`style-src` erlaubt `'unsafe-inline'`, weil Balken und Diagramme ihre Breite
als Stil-Attribut setzen; `img-src`/`connect-src` erlauben `https:`, damit ein
selbst konfigurierter Screenshot-Dienst bzw. Analyse-Endpunkt überhaupt
erreichbar ist. Ohne diese Einstellungen greift keine der beiden Regeln.

## Tests

```bash
node dashboard/scripts/core-test.mjs   # Datenschicht ohne Browser (23 Prüfungen)
node dashboard/scripts/e2e.mjs         # echter Browser, gesamte Oberfläche
node dashboard/scripts/gen-wix-collections.mjs   # CMS-Definitionen neu erzeugen
```

Der E2E-Test bedient die App wie ein Mensch: Datensätze anlegen, bearbeiten,
filtern, suchen, löschen, neu laden – und prüft dabei Kennzahlen, Beziehungen,
Persistenz, Layout in fünf Bildschirmgrößen, Links, Konsolenfehler und dass
eingeschleustes HTML nicht ausgeführt wird.
