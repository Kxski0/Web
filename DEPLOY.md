# Deployment

Next.js 16 auf Vercel. Kein Sonderaufbau nötig — Framework, Build-Befehl und
Ausgabe erkennt Vercel selbst.

**Zwei Vercel-Projekte teilen sich dieses Repository:**

| Projekt | Root-Verzeichnis | Inhalt |
| --- | --- | --- |
| `solbautec` | Projektstamm | die öffentliche Website (dieses Dokument) |
| `business-dashboard` | `dashboard` | internes Business-Dashboard, siehe unten |

Sie sind vollständig getrennt: eigene Build-Einstellungen, eigene URLs, eigene
Zugriffsregeln. Ein Push baut beide, jedes aus seinem eigenen Verzeichnis.

---

## Ist-Stand

| | |
| --- | --- |
| Vercel-Projekt | `solbautec` im Team `maxweidenbruch-1006s-projects` |
| Verknüpft mit | GitHub `Kxski0/Web`, Deployment bei jedem Push |
| Produktionsbranch | `main` |
| URL | `https://solbautec.vercel.app` |
| Zugriff | **Vercel-Authentifizierung aktiv** — nur für das Konto erreichbar, nicht öffentlich |
| Indexierung | aus (`robots.txt` liefert `Disallow: /`, jede Seite `noindex`) |
| Laufzeit | Node 24.x, Framework automatisch als Next.js erkannt |
| Build | erfolgreich in rund 35 Sekunden |

Das erste Deployment kam vom Feature-Branch und belegt derzeit die
Produktions-URL. Solange `main` noch keinen Build hat, erzeugen weitere Pushes
auf den Feature-Branch **Vorschau**-Deployments unter eigenen URLs; die
Produktions-URL bleibt auf diesem Stand stehen. Nach dem Merge des Pull Requests
löst jeder Push auf `main` ein reguläres Produktions-Deployment aus.

**Die Seite öffentlich erreichbar machen:** Project → Settings → Deployment
Protection → Vercel Authentication abschalten. Erst tun, wenn die drei Punkte
unten geklärt sind.

---

## Das Dashboard-Projekt

| | |
| --- | --- |
| Vercel-Projekt | `business-dashboard` im Team `maxweidenbruch-1006s-projects` |
| Root-Verzeichnis | `dashboard` |
| Verknüpft mit | GitHub `Kxski0/Web`, Deployment bei jedem Push |
| Produktionsbranch | `main` |
| Build | `node build.mjs` → `dist` (Einstellungen in `dashboard/vercel.json`) |
| Zugriff | **Vercel-Authentifizierung aktiv** — Login mit dem Vercel-Konto nötig |
| Indexierung | aus (`X-Robots-Tag: noindex, nofollow, noarchive`) |

Das Dashboard ist ein eigenständiges Paket mit eigener `package.json` und
eigenem Lockfile. Es hat mit dem Next.js-Build im Projektstamm nichts zu tun und
bringt als einzige Abhängigkeit esbuild mit.

**Zu den Daten:** Es liegen keine Geschäftsdaten auf dem Server. Der
eigenständige Betrieb speichert alles im `localStorage` des jeweiligen Browsers.
Wer die URL ohne Anmeldung öffnete, sähe eine leere Anwendung — die Anmeldung
schützt also die Nutzung, nicht die Daten. Umgekehrt heißt das: Die Daten hängen
am Gerät und am Browserprofil. Regelmäßig unter *Einstellungen → Sicherung
herunterladen* sichern, und für den Betrieb auf mehreren Geräten das
Wix-Backend anbinden (siehe `dashboard/wix/README.md`).

**Zugang ändern:** Project → Settings → Deployment Protection.
*Vercel Authentication* abschalten macht die URL für jeden erreichbar, der sie
kennt; *Password Protection* ist die Alternative, wenn ein Login mit dem
Vercel-Konto auf dem iPad zu umständlich ist.

---

## Vor dem ersten Livegang

Diese drei Punkte blockieren die Produktion. Details in `CONTENT-TODO.md`.

1. **Impressum vervollständigen.** Eine unvollständige Anbieterkennzeichnung
   nach § 5 DDG ist in Deutschland abmahnfähig. Die Seite trägt aktuell einen
   sichtbaren Unvollständigkeitshinweis.
2. **Datenschutzerklärung juristisch prüfen lassen.** Die technischen Abschnitte
   sind gegen den Code geschrieben und stimmen; Verantwortlicher und
   Auftragsverarbeitung fehlen.
3. **Kontaktformular-Ziel setzen.** Ohne `CONTACT_WEBHOOK_URL` antwortet
   `/api/kontakt` mit HTTP 503 — bewusst, statt einen Erfolg vorzutäuschen und
   echte Anfragen zu verlieren.

Solange diese Punkte offen sind, bleibt die Seite auf `noindex`. Das ist kein
Versehen, sondern der Standard (siehe unten).

## Umgebungsvariablen

Anzulegen unter **Project → Settings → Environment Variables**.

| Variable | Umgebung | Pflicht | Wirkung |
| --- | --- | --- | --- |
| `CONTACT_WEBHOOK_URL` | Production, Preview | für ein funktionierendes Formular | Ziel für Formularanfragen, nimmt einen JSON-POST entgegen |
| `SITE_INDEXABLE` | **nur** Production | zum Auffindbarwerden | Nur `true` erlaubt Indexierung. Alles andere: `robots.txt` liefert vollständiges Disallow, jede Seite ein `noindex` |
| `NEXT_PUBLIC_SITE_URL` | Production | empfohlen | Kanonischer Ursprung ohne Schrägstrich am Ende, z.B. `https://www.solbautec.de`. Ohne Angabe wird auf Vercel die Produktionsdomain verwendet |

**`SITE_INDEXABLE` niemals in Preview setzen.** Sonst konkurrieren
Vorschau-Deployments in der Suche mit der echten Seite.

## Indexierung ist standardmäßig aus

Der Standard ist geschlossen, nicht offen. Ein Deployment, das niemand
ausdrücklich freigegeben hat, landet nicht in einem Suchindex — insbesondere
nicht mit einem unvollständigen Impressum.

Zum Freischalten: `SITE_INDEXABLE=true` in der Production-Umgebung setzen und
neu deployen. Prüfbar unter `/robots.txt` — dort muss `Allow: /` plus die
Sitemap-Zeile stehen.

## Domain

1. **Project → Settings → Domains**, `www.solbautec.de` hinzufügen.
2. Beim Registrar den vorgeschlagenen DNS-Eintrag setzen.
3. `solbautec.de` als Weiterleitung auf `www` anlegen (oder umgekehrt — nur eine
   Variante sollte ausgeliefert werden).
4. `NEXT_PUBLIC_SITE_URL` auf die gewählte Variante setzen und neu deployen,
   damit Canonical, Open Graph und Sitemap übereinstimmen.

TLS-Zertifikat und HTTP-zu-HTTPS-Weiterleitung übernimmt Vercel.

## Sicherheits-Header

Gesetzt in `next.config.ts`, gelten für alle Pfade:

`Content-Security-Policy` · `X-Content-Type-Options: nosniff` ·
`Referrer-Policy: strict-origin-when-cross-origin` · `X-Frame-Options: DENY` ·
`Permissions-Policy` (Kamera, Mikrofon, Standort aus) ·
`Strict-Transport-Security`

Zur CSP: Die Seite lädt nichts von Dritten — Schriften und Bilder liegen lokal,
es gibt kein Analytics und keine Einbettungen —, deshalb kann die Policy eng
sein. `script-src` braucht dennoch `'unsafe-inline'`, weil Next Inline-Skripte
für Bootstrap und Hydration einfügt. Das sauber zu schließen erfordert einen
Nonce pro Request aus einer Middleware, was jede Seite dynamisch machen und das
statische Rendering aufgeben würde. Für eine Marketing-Seite ohne
nutzergeneriertes HTML ist dieser Tausch nicht sinnvoll.

## Laufzeit

`engines.node >= 22.11.0` und `packageManager: pnpm@10.33.0` stehen in der
`package.json`; Vercel richtet sich danach.

Alle Seiten werden statisch vorgerendert. Einzige dynamische Route ist
`/api/kontakt`.

## Nach dem Deployment prüfen

```bash
BASE=https://<deployment-url> node scripts/routes-check.mjs
```

Ohne Werkzeug reicht ein Blick auf:

- `/robots.txt` — steht dort `Disallow: /`, obwohl die Seite live sein soll,
  fehlt `SITE_INDEXABLE=true`.
- `/impressum/` — ist der Unvollständigkeitshinweis noch da, darf die Seite
  nicht öffentlich beworben werden.
- Kontaktformular abschicken — kommt HTTP 503, fehlt `CONTACT_WEBHOOK_URL`.
