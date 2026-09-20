# Deployment

## Ausgangslage

Dieses Repository enthält **zwei unabhängige Websites**:

| | Wurzelverzeichnis | `petite-pali/` |
| --- | --- | --- |
| Website | SolBauTec | Petite Pali |
| Vercel-Projekt | `solbautec` | `petite-pali` (neu anzulegen) |
| Root Directory | `.` | `petite-pali` |
| Produktionszweig | `main` | `main` |

Beide teilen sich weder Abhängigkeiten noch Konfiguration noch Build. Ein Push
darf nicht beide Projekte neu bauen — siehe „Einrichtung", Schritt 4.

## Einrichtung des Vercel-Projekts

1. Neues Projekt aus dem GitHub-Repository `Kxski0/Web` anlegen, Team
   `maxweidenbruch-1006s-projects`.
2. **Root Directory** auf `petite-pali` setzen. Das ist die entscheidende
   Einstellung: ohne sie baut Vercel das Schwesterprojekt.
3. Framework-Preset: Next.js. Node 22 (`engines` in der `package.json`).
4. In **beiden** Projekten „Skip deployments when there are no changes in the
   Root Directory" einschalten. Sonst löst jede Änderung an einer Marke einen
   Build der anderen aus.
5. Umgebungsvariablen setzen (siehe unten). `SITE_INDEXABLE` **nicht** setzen.

Im Wurzelverzeichnis liegt bewusst **keine** `.vercelignore`. Vercel wendet
eine Wurzel-`.vercelignore` auf **jedes** Projekt dieses Repositories an, auch
auf Projekte mit einem anderen Root Directory — nachgewiesen im Build-Log eines
Projekts mit Root Directory `dashboard`, das trotzdem meldete: „Found
.vercelignore (repository root) / Removed 143 ignored files". Ein Eintrag
`petite-pali/` dort würde also genau diesem Projekt vor dem Build die Quellen
entfernen. SolBauTec baut `petite-pali/` ohnehin nicht: der Ordner steht im
`exclude` der Wurzel-`tsconfig.json` und in den `ignores` der ESLint-Config,
und importiert wird von dort nichts.

## Umgebungsvariablen

| Variable | Wert | Umgebung |
| --- | --- | --- |
| `CONTACT_WEBHOOK_URL` | Endpunkt, der einen JSON-POST annimmt | Production, Preview |
| `SITE_INDEXABLE` | `true` — **erst nach Freigabe** | **nur** Production |
| `NEXT_PUBLIC_SITE_URL` | `https://www.petite-pali.de` — erst beim Domainumzug | Production |

`SITE_INDEXABLE` gehört **niemals** in Preview. Sonst konkurrieren
Vorschau-Deployments mit der Produktionsseite um dieselben Inhalte.

Ohne `NEXT_PUBLIC_SITE_URL` wird auf Vercel die Produktionsdomain des Projekts
verwendet. Der fest eingebaute Rückfall ist bewusst `petite-pali.vercel.app` und
nicht `petite-pali.de`: dort liegt noch die alte Website, und ein Canonical
darauf würde die neue Seite auf die alte zeigen lassen.

## Startblocker

Bis diese drei Punkte erledigt sind, bleibt die Indexierung aus:

1. **Impressum unvollständig.** Inhaber:in, Rechtsform und USt-IdNr. bzw.
   Steuernummer fehlen (`CONTENT-TODO.md` §1). Ein unvollständiges Impressum ist
   in Deutschland abmahnfähig.
2. **Datenschutzerklärung gegenlesen.** Sie ist gegen den tatsächlichen Code
   geschrieben — keine Cookies, kein Tracking, keine fremden Einbettungen. Wenn
   später etwas davon hinzukommt, muss der Text mit geändert werden.
3. **Kontaktformular hat kein Ziel.** Ohne `CONTACT_WEBHOOK_URL` antwortet der
   Endpunkt mit 503. Das ist Absicht, aber kein Zustand für den Livegang.

## Domainumzug

Reihenfolge, damit nichts offline geht:

1. Neue Seite unter der Vercel-Adresse abnehmen lassen.
2. Startblocker abarbeiten.
3. `petite-pali.de` und `www.petite-pali.de` im Vercel-Projekt hinzufügen, eine
   der beiden als Weiterleitung auf die andere.
4. DNS beim bisherigen Anbieter umstellen.
5. `NEXT_PUBLIC_SITE_URL` auf die gewählte Hauptdomain setzen.
6. Erst danach `SITE_INDEXABLE=true` in Production.
7. `curl -s https://www.petite-pali.de/robots.txt` — dort muss jetzt `Allow: /`
   und die Sitemap stehen. Steht dort noch `Disallow: /`, ist Schritt 6 nicht
   angekommen.

## Sicherheits-Header

Gesetzt in `next.config.ts`: Content-Security-Policy, `X-Content-Type-Options`,
`Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, HSTS.

Die CSP erlaubt `script-src 'unsafe-inline'`, weil Next Inline-Skripte für
Bootstrap und Hydration einfügt. Das sauber zu schließen bräuchte eine Nonce pro
Request aus einer Middleware — und damit wäre jede Seite dynamisch statt
statisch. Für eine Seite ohne fremdes HTML lohnt der Tausch nicht. Alles andere
bleibt eng: `default-src 'self'`, keine fremden Ursprünge, kein Framing.

`media-src 'self'` ist gegenüber dem Schwesterprojekt neu — hier liegt ein
Hero-Video im eigenen Ursprung.

## Nach dem Deployment prüfen

```bash
BASE=https://<domain> node scripts/routes-check.mjs
BASE=https://<domain> node scripts/perf-check.mjs
curl -s https://<domain>/robots.txt
```

Von Hand dazu:

- Kontaktformular einmal absenden und prüfen, ob die Anfrage wirklich ankommt.
- Hero-Video auf einem echten Telefon: läuft es stumm an, ohne dass es ruckelt?
- Mit eingeschaltetem „Bewegung reduzieren": es darf **kein** Video geladen
  werden (im Netzwerk-Tab nachsehen).
