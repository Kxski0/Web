# Wix-Integration

Diese Anleitung bringt das Dashboard in eine Wix-Website. Sie ist so
geschrieben, dass sie ohne Vorwissen über Velo funktioniert.

---

## 1. Was Wix kann – und was nicht

Vor der Umsetzung geprüft, damit nichts erfunden wird:

| Aufgabe | Lösung | Warum |
|---|---|---|
| Oberfläche der App darstellen | **Velo Custom Element** | Wix-Editor-Elemente (`$w`) reichen für ein Dashboard mit Tabellen, Filtern und Dialogen nicht aus. Ein Custom Element ist ein normales Web Component im Seiten-DOM – dort läuft die App unverändert. |
| Daten speichern | **Wix Data (CMS-Kollektionen)** | Native Datenbank von Wix, keine Zusatzkosten, im Editor einsehbar. |
| Datenzugriff absichern | **Velo Web-Modul mit `Permissions.Admin`** | Wix prüft die Berechtigung serverseitig, bevor der Code läuft. Kollektionen bleiben für Besucher komplett gesperrt. |
| Zugang beschränken | **Seite auf „Nur Mitglieder" + Rollenprüfung** | Wix-eigene Mitgliederverwaltung; kein eigener Login nötig. |
| Fremde Website analysieren | **Velo Backend + `wix-fetch`** | Im Browser unmöglich (CORS). Serverseitig kein Problem. |
| Screenshot fremder Websites | **Externer Dienst nötig** | Weder Browser noch Velo können eine fremde Seite rendern. Ohne Dienst: eigenes Bild hochladen. |
| Geheimnisse ablegen | **Wix Secrets Manager** | Schlüssel bleiben serverseitig. |

**Was in Wix nicht geht** – hier gibt es keine Umgehung, nur Alternativen:

- **Eigene URL-Pfade innerhalb der App** (`/dashboard/kunden/123`). Die Adresszeile
  gehört Wix. Deshalb nutzt die App eingebettet ein internes Routing ohne
  URL-Änderung; nur eigenständig gehostet gibt es Hash-Routen und Lesezeichen.
- **Datei-Uploads in Wix Media aus dem Custom Element heraus.** Anhänge werden
  deshalb als Data-URL im Datensatz gespeichert (Grenze: 1,5 MB pro Datei);
  für Größeres besser einen Link hinterlegen.
- **Offline-Betrieb.** Wix Data braucht eine Verbindung. Ohne Netz zeigt die App
  einen Fehler statt veralteter Daten. Wer offline arbeiten muss, betreibt die
  eigenständige Fassung mit Browser-Speicher.

---

## 2. Dateien vorbereiten

```bash
node dashboard/build.mjs
```

Erzeugt in `dashboard/dist/`:

- `dashboard-element.js` – **die Datei für Wix**: App, Stylesheet und
  Registrierung des Custom Elements in einer einzigen Datei (~174 kB).
- `index.html`, `dashboard.js`, `dashboard.css` – die eigenständige Fassung.

---

## 3. CMS-Kollektionen anlegen

Im Wix-Editor: **CMS → Kollektion erstellen**. Neun Kollektionen, exakt so
benannt:

| Kollektions-ID | Anzeigename |
|---|---|
| `DashboardCustomers` | Kunden |
| `DashboardOrders` | Aufträge |
| `DashboardInvoices` | Rechnungen |
| `DashboardWebsites` | Meine Websites |
| `DashboardReferences` | Website Inspiration |
| `DashboardProjects` | Projekte |
| `DashboardTasks` | Aufgaben |
| `DashboardActivity` | Aktivitätsverlauf |
| `DashboardSettings` | Einstellungen |

Die Felder jeder Kollektion stehen in `wix/collections/<Name>.json` – Feldschlüssel,
Anzeigename, Typ und Pflichtangabe. Diese Dateien werden aus dem App-Schema
erzeugt (`node dashboard/scripts/gen-wix-collections.mjs`), können also nicht
davon abweichen.

**Berechtigungen für jede Kollektion** (Einstellungen → Berechtigungen →
Benutzerdefiniert):

| Aktion | Wer |
|---|---|
| Inhalt lesen | Admin |
| Inhalt hinzufügen | Admin |
| Inhalt aktualisieren | Admin |
| Inhalt löschen | Admin |

Das ist wichtig: Weil sämtlicher Zugriff über das Web-Modul läuft, braucht
niemand sonst Rechte. Eine Kollektion auf „Jeder" wäre öffentlich abrufbar.

### Hinweis zu Beziehungen

Verweise (Kunde eines Auftrags usw.) werden als **Textfeld mit der `_id`**
gespeichert, nicht als Wix-Referenzfeld. Grund: Die App hält alle Daten im
Speicher und löst Beziehungen selbst auf – ein Referenzfeld würde zusätzliche
Abfragen erzwingen, ohne Nutzen, und Export/Import wäre nicht mehr verlustfrei.

---

## 4. Velo-Dateien einspielen

Velo im Editor aktivieren (**Entwicklermodus → Velo aktivieren**), dann:

| Aus diesem Projekt | Nach Wix |
|---|---|
| `dashboard/dist/dashboard-element.js` | `public/custom-elements/dashboard-element.js` |
| `dashboard/src/data/schema.js` | `public/bizdash/schema.js` |
| `dashboard/src/core/validate.js` | `public/bizdash/validate.js` |
| `dashboard/src/core/format.js` | `public/bizdash/format.js` |
| `dashboard/src/core/util.js` | `public/bizdash/util.js` |
| `dashboard/wix/backend/dashboard.web.js` | `backend/dashboard.web.js` |
| `dashboard/wix/backend/analyze.web.js` | `backend/analyze.web.js` |
| `dashboard/wix/page-code/dashboard.page.js` | Code-Bereich der Dashboard-Seite |

Die vier Dateien unter `public/bizdash/` werden vom Backend importiert. Dadurch
prüft der Server mit **derselben** Logik wie der Browser – die Regeln können
nicht auseinanderlaufen.

> Die Importpfade in `validate.js` und `schema.js` sind relativ (`../data/schema.js`).
> Nach dem Kopieren in `public/bizdash/` müssen sie flach werden:
> in `public/bizdash/validate.js` `'../data/schema.js'` → `'./schema.js'`,
> `'./format.js'` und `'./util.js'` bleiben.

---

## 5. Seite einrichten

1. Neue Seite anlegen, z. B. `/dashboard`.
2. **Seite auf „Nur für Mitglieder" stellen** (Seiteneinstellungen → Berechtigungen).
   Ohne diesen Schritt sieht zwar niemand Daten (das Backend lehnt ab), aber die
   Seite selbst wäre öffentlich erreichbar.
3. **Hinzufügen → Einbetten → Custom Element** auf die Seite ziehen.
   - *Choose Source* → **Velo file** → `dashboard-element.js`
   - **Tag Name:** `bizdash-app`
   - Element-ID notieren (Standard: `customElement1`).
4. Das Element auf volle Seitenbreite und mindestens 900 px Höhe ziehen; im
   Editor auf „Stretch" stellen, damit es auf dem iPad die ganze Breite nutzt.
5. `dashboard.page.js` in den Code-Bereich der Seite kopieren. Weicht die
   Element-ID ab, oben `ELEMENT_ID` anpassen.
6. **Veröffentlichen.** Custom Elements werden in der Editor-Vorschau nicht
   immer ausgeführt – die Prüfung gehört auf die veröffentlichte Seite.

### Wie die Teile zusammenspielen

```
Custom Element (Browser)          Page-Code (Browser)            Web-Modul (Server)
   dispatchEvent  ──────────────▶  element.on('bizdash-request')
   'bizdash-request'                        │
                                            ▼
                                    prüft Operation gegen Whitelist
                                            │
                                            ▼
                                    import { … } from 'backend/…'  ──▶  Permissions.Admin
                                            │                            wixData.query/insert/…
   resolveRequest(id, …) ◀───────────────────┘
```

Das Custom Element hat **keinen** Datenbankzugriff. Es kann nur Ereignisse
auslösen; alles Weitere entscheidet der Page-Code und der Server.

---

## 6. Website-Analyse (optional)

`backend/analyze.web.js` funktioniert **ohne jede Konfiguration**: Es lädt die
Seite serverseitig und wertet ihre Struktur aus – Überschriften, Navigation,
Hero, CTA-Beschriftungen, Schriften, erkennbare Animationsbibliotheken,
Abschnitts- und Medienzahl, Responsive-Hinweise. Ergebnis ist ein Bericht in der
Gliederung Aufbau / Hero / Navigation / Animationen / Layout / Typografie /
CTA-Struktur / UX / Interaktionen.

Optional lässt sich zusätzlich ein Textdienst anbinden, der daraus Fließtext
macht. Dazu im **Wix Secrets Manager** (Velo → Secrets Manager) anlegen:

| Name | Inhalt |
|---|---|
| `BIZDASH_SUMMARY_ENDPOINT` | URL des Dienstes |
| `BIZDASH_SUMMARY_API_KEY` | Zugangsschlüssel |

Fehlt eines von beidem, bleibt es beim strukturellen Bericht – ohne Fehler.
An den Dienst gehen nur die **Strukturdaten**, nie das fremde HTML.

Der Schlüssel liegt ausschließlich im Secrets Manager und wird nur serverseitig
gelesen. Er erreicht das Frontend nie.

**Screenshots** kann auch Velo nicht erzeugen – dafür bräuchte es einen
Rendering-Dienst. In der App: eigenes Bild hochladen oder unter *Einstellungen →
Vorschaubilder* eine Vorlage für einen Screenshot-Dienst eintragen.

---

## 7. Bestehende Daten übernehmen

Wer zuerst mit der eigenständigen Fassung gearbeitet hat:

1. Dort: **Einstellungen → Sicherung herunterladen** (JSON).
2. In Wix: dieselbe Datei über **Einstellungen → Sicherung einspielen** laden.

IDs und damit alle Beziehungen bleiben erhalten.

---

## 8. Prüfliste nach dem Veröffentlichen

- [ ] Seite abgemeldet aufrufen → Dashboard erscheint **nicht**.
- [ ] Als Admin aufrufen → Dashboard lädt, Sidebar-Fuß zeigt „Wix Data (Velo)".
- [ ] Kunde anlegen → Datensatz erscheint im CMS unter `DashboardCustomers`.
- [ ] Seite neu laden → Datensatz ist noch da.
- [ ] Auf dem iPad öffnen → keine waagerechte Scrollleiste, Menü öffnet per Tipp.
- [ ] Browser-Konsole → keine Fehler.

---

## 9. Was noch von dir gebraucht wird

Ohne diese Angaben lief die Entwicklung vollständig durch; für den
Wix-Betrieb sind sie nötig:

1. **Zugang zur Wix-Site** (Editor-Rechte), um Kollektionen und Velo-Dateien
   anzulegen. Alternativ arbeite ich die Schritte 3–5 mit dir zusammen ab.
2. **Wix-Tarif mit Velo/Dev-Modus** – Custom Elements und Web-Module brauchen
   einen kostenpflichtigen Plan (Business/Studio). Bei einem freien Tarif bleibt
   die eigenständige Fassung, die vollständig funktioniert.
3. **Element-ID des Custom Elements**, falls sie nicht `customElement1` lautet.
4. **Nur wenn Vorschaubilder gewünscht sind:** Name des Screenshot-Dienstes und
   das URL-Muster (viele brauchen einen Schlüssel und sind kostenpflichtig).
5. **Nur wenn die Analyse zusätzlich Fließtext liefern soll:** Endpunkt und
   Schlüssel des Textdienstes. Ohne beides funktioniert die Analyse trotzdem.
6. **Anzeigename** für die Kopfzeile – lässt sich auch selbst unter
   *Einstellungen → Allgemein* setzen.
