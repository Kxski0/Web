# Offene Inhalte

Grundregel dieses Projekts: **nichts wird erfunden.** Eine Angabe, die der Laden
nicht bestätigt hat, bleibt `null` und wird nicht gerendert. Was hier steht,
muss von Petite Pali kommen — bis dahin fehlt es sichtbar oder gar nicht, statt
falsch dazustehen.

---

## 1. Impressum vervollständigen — **blockiert den Start**

**Datei:** `src/content/site.ts`, Objekt `IMPRINT`

Für eine Anbieterkennzeichnung nach § 5 DDG fehlen:

- `owner` — Name der vertretungsberechtigten Person
- `legalForm` — Rechtsform (Einzelunternehmen, GbR, GmbH …)
- `vatId` **oder** `taxNumber` — Umsatzsteuer-Identifikationsnummer oder Steuernummer

Solange eines davon `null` ist, zeigt `/impressum/` einen ausdrücklichen Hinweis
auf die fehlenden Pflichtangaben. Der Hinweis verschwindet von selbst, sobald die
Felder gefüllt sind — es muss nichts am Markup geändert werden.

Ein unvollständiges Impressum ist in Deutschland abmahnfähig. **Deshalb bleibt
`SITE_INDEXABLE` aus, bis dieser Punkt erledigt ist.**

## 2. Bestätigte Angaben — erledigt, aber zum Gegenlesen

Adresse, Rufnummern, E-Mail und Öffnungszeiten sind vom Auftraggeber bestätigt
und stehen in `CONTACT` mit `verified: true`. Damit rendert die Seite sie und
liefert `ClothingStore`-Strukturdaten mit `openingHoursSpecification`.

Bitte vor dem Start noch einmal gegenlesen:

- Karolingerring 5, 50678 Köln
- Telefon 0221 29490358 · Mobil 0173 5362828
- info@petite-pali.de
- Montag bis Freitag 10:00–18:30 Uhr · Samstag 10:00–17:00 Uhr

Abweichende Feiertags- oder Ferienzeiten sind **nicht** hinterlegt. Die
Kontaktseite verweist dafür auf Instagram. Wenn das anders gehandhabt werden
soll, gehört ein Feld dafür in `CONTACT`.

## 3. Originalfotos

**Datei:** `scripts/process-images.mjs`, danach `public/images/`

Die sieben Ladenfotos stammen aus Bildschirmfotos der Instagram-App und sind
828×1104 Pixel groß. Für die Stellen, an denen sie großflächig stehen, ist das
knapp — sichtbar weich wird es auf großen Bildschirmen.

Gebraucht werden die Originaldateien aus der Kamera. Sie ersetzen dieselben
Slots, ohne dass eine Zeile Anwendungscode geändert werden muss:

`laden-tisch` · `laden-regal` · `spieluhren` · `eingang` · `outfit-herbst` ·
`schaufenster` · `outfit-mannequin`

## 4. Original-Logodatei

**Datei:** `scripts/brand-assets.mjs`, danach `public/images/brand/`

Das Logo wurde aus einem Bildschirmfoto der alten Website freigestellt. Die
Auflösung dieses Bildschirmfotos ist die Obergrenze für Schriftzug, Bildmarke
und Favicon.

Gebraucht wird die Originaldatei — am besten als Vektor (SVG, AI, EPS),
ersatzweise als PNG mit Transparenz und mindestens 2000px Breite.

## 5. Kontaktformular scharfschalten

**Variable:** `CONTACT_WEBHOOK_URL`

Ohne sie antwortet `/api/kontakt/` mit HTTP 503 und einer klaren Meldung, statt
einen Erfolg vorzutäuschen und echte Anfragen still zu verlieren. Zu klären:

- Wohin sollen Anfragen gehen — Postfach, Formulardienst, Automation?
- Wer liest sie, und wie schnell? Die Seite verspricht keine Frist; wenn eine
  zugesagt werden soll, gehört sie in den Text auf `/kontakt/`.

## 6. Markenliste ergänzen

**Datei:** `src/content/brands.ts`

Derzeit vier Einträge, jeder mit Quellenangabe belegt durch ein eigenes Foto des
Geschäfts: Jellycat, Play Up, Scoot & Ride, manduca.

Eine Markenliste ist eine Tatsachenbehauptung. Bitte ergänzen oder korrigieren —
und jeweils mit dazuschreiben, worauf sich die Angabe stützt. Ist die Liste
leer, rendert der Abschnitt gar nicht.

## 7. Secondhand-Konditionen

**Datei:** `src/app/secondhand/page.tsx`

Die Seite sagt bewusst, dass Annahmebedingungen im Laden besprochen werden. Wenn
es feste Regeln gibt (Provision, Ankauf, Saisonfenster, Mengenbegrenzung), sollten
sie hier stehen — das erspart Anrufe.

## 8. Geschenkgutscheine

**Datei:** `src/app/sortiment/page.tsx`, FAQ-Eintrag

Die Antwort lautet derzeit sinngemäß „fragen Sie im Laden", weil nicht bestätigt
ist, ob es Gutscheine gibt. Sobald das geklärt ist, sollte dort eine
verbindliche Antwort stehen.

## 9. Domain und Livegang

**Datei:** `src/lib/env.ts`, Variable `NEXT_PUBLIC_SITE_URL`

Unter `petite-pali.de` läuft derzeit noch die alte Website. Das neue Projekt
läuft zunächst unter seiner Vercel-Adresse. Reihenfolge für den Umzug steht in
`DEPLOY.md`.

## 10. Über die alte Website

Nicht übernommen wurde die Seite „Aktuelles": Neuigkeiten laufen real über
Instagram, und eine zweite Stelle, die gepflegt werden müsste, veraltet. Falls
das anders gewünscht ist, bitte melden — dann braucht es aber jemanden, der sie
pflegt.
