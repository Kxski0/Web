# Offene Inhalte

Grundregel: **nichts wird erfunden.** Eine Angabe, die nicht belegt ist, bleibt
`null` oder leer und wird nicht gerendert. Was hier steht, muss von Petite Pali
kommen.

---

## 1. Die bestehende Website war nicht auslesbar — **bitte gegenlesen**

`petite-pali.de` ist aus der Arbeitsumgebung heraus gesperrt: das Gateway
beantwortet jede Verbindung mit **403**, für `www` wie für die nackte Domain.
Die bestehenden Inhalte konnten deshalb **nicht direkt gelesen** werden.

Erfasst wurde stattdessen, was über Suchmaschinen-Auszüge derselben Seiten
belegbar war. Daraus stammen:

- Seitenstruktur: Startseite, Sortiment, Frühchenmode, Tragehilfen,
  Kinderwagen, Schwangerschafts- und Stillmode, Dies & Das, Aktuelles,
  Über uns, Galerie, Kontakt
- Frühchenmode ab Größe 44, Kleinkinder bis Größe 122
- Materialien: Wolle, Seide, Bambus, Merino, Kaschmir
- über 95 % der Ware aus Europa
- BEQOONI®: einer der exklusiven Showrooms
- Team: Nina (Herz und Seele), dazu Janice, Steffi, Annette und Jutta
- Adresse, Rufnummern, E-Mail, Öffnungszeiten

**Bitte diese Liste einmal durchgehen.** Was nicht mehr stimmt, gehört
korrigiert; was fehlt, ergänzt. Die Fakten liegen gebündelt in
`src/content/facts.ts` und `src/content/site.ts`.

## 2. Impressum vervollständigen — **blockiert den Start**

**Datei:** `src/content/site.ts`, Objekt `IMPRINT`

Es fehlen: `owner` (vertretungsberechtigte Person), `legalForm` (Rechtsform),
`vatId` **oder** `taxNumber`.

Solange eines davon `null` ist, zeigt `/impressum/` einen ausdrücklichen Hinweis
auf die fehlenden Pflichtangaben. Der Hinweis verschwindet von selbst, sobald
die Felder gefüllt sind.

Ein unvollständiges Impressum ist in Deutschland abmahnfähig. **Deshalb bleibt
`SITE_INDEXABLE` aus, bis dieser Punkt erledigt ist.**

## 3. Originalbilder und Original-Logo

Alle Bilder stammen aus zwei Ersatzquellen: dem eigenen Ladenrundgang (720 px
breit) und Bildschirmfotos des Instagram-Auftritts (828 px). Das reicht für
halbseitige Flächen, wird aber auf großen Bildschirmen sichtbar weich.

Gebraucht werden:

- die **Originalfotos** aus der Kamera — sie ersetzen dieselben Slots, ohne dass
  eine Zeile Anwendungscode geändert werden muss
- die **Original-Logodatei**, am besten als Vektor (SVG/AI/EPS), ersatzweise PNG
  mit Transparenz ab 2000 px Breite. Das aktuelle Logo ist aus einem
  Bildschirmfoto der alten Website freigestellt — dessen Auflösung ist die
  Obergrenze für Schriftzug, Bildmarke und Favicon.

**Lizenzfrage:** Bilder der bestehenden Website können lizenzierte Stockbilder
enthalten. Es wurde bewusst kein einziges davon übernommen — alle verwendeten
Aufnahmen stammen aus dem eigenen Material des Ladens. Sollten später Bilder von
der alten Seite übernommen werden, muss deren Lizenzlage vorher geklärt sein.

## 4. Fotografie, die noch fehlt

In dieser Reihenfolge am wichtigsten:

1. **Hero** — echte Situation im Laden, Negativraum für Text, kein Text und kein
   Logo im Bild. Derzeit trägt das Ladenvideo den Hero.
2. **Team** — Porträts von Nina, Janice, Steffi, Annette und Jutta. Ohne sie
   bleibt „Über uns" eine Namensliste.
3. **Beratung** — eine echte Beratungssituation, nicht gestellt.
4. **Trageberatung** — Trage am Körper, eingestellt.
5. **Für Mama** — Umstands- und Stillmode. Aktuell gibt es dafür **kein**
   passendes Bild; die Seite zeigt deshalb eine Regalaufnahme. Ein
   Schaufensterfoto mit dunklen Kleidern wurde bewusst **nicht** als
   Umstandsmode ausgegeben, weil das aus dem Bild nicht hervorgeht.
6. **Kinderwagen** — ein BEQOONI® im Laden.

## 5. „Aktuelles" — Inhalte fehlen

**Datei:** `src/content/aktuelles.ts`, Liste `BEITRAEGE`

Die Liste ist leer, weil die bestehenden Beiträge nicht gelesen werden konnten
(siehe §1). Solange sie leer ist, zeigt `/aktuelles/` keine erfundene
Beitragsliste, sondern verweist auf Instagram — den Kanal, über den Neuigkeiten
tatsächlich laufen.

Zwei Wege: entweder die bestehenden Beiträge nachtragen, oder es bei dem
Verweis belassen. Ein Blogbereich, den niemand pflegt, ist schlechter als keiner.

## 6. Shopping-Termin und Gutschein — Ablauf bestätigen

Beide Seiten beschreiben einen **persönlichen** Ablauf: Anfrage per Formular
oder Telefon, Rückmeldung durch den Laden. Es wurde bewusst kein Buchungssystem
und keine Zahlungsstrecke erfunden.

Zu bestätigen:

- Gibt es Shopping-Termine tatsächlich (weiterhin) auch außerhalb der
  Öffnungszeiten?
- Wie wird ein Gutschein bezahlt und übergeben? Gibt es einen Mindest- oder
  Höchstbetrag? Eine Gültigkeitsdauer?

## 7. Kontaktdaten und Öffnungszeiten

Bestätigt und deshalb gerendert:

- Karolingerring 5, 50678 Köln
- Telefon 0221 29490358 · Mobil 0173 5362828
- info@petite-pali.de
- Montag bis Freitag 10:00–18:30 Uhr · Samstag 10:00–17:00 Uhr

Abweichende Feiertags- oder Ferienzeiten sind **nicht** hinterlegt; die Seite
verweist dafür auf Instagram. Wenn das anders gehandhabt werden soll, braucht
`CONTACT` ein Feld dafür.

## 8. Markenliste ergänzen

**Datei:** `src/content/facts.ts`, Liste `BRANDS`

Derzeit fünf Einträge, jeder mit Quellenangabe belegt. Eine Markenliste ist eine
Tatsachenbehauptung — bitte ergänzen oder korrigieren, und jeweils
dazuschreiben, worauf sich die Angabe stützt. Ist die Liste leer, rendert der
Abschnitt gar nicht.

## 9. Formulare scharfschalten

**Variable:** `CONTACT_WEBHOOK_URL`

Ohne sie antwortet `/api/kontakt/` mit HTTP 503 und einer klaren Meldung, statt
einen Versand vorzutäuschen und echte Anfragen still zu verlieren. Zu klären:
Wohin gehen Anfragen, wer liest sie, und wie schnell? Die Seite verspricht keine
Frist — wenn eine zugesagt werden soll, gehört sie in den Text.

## 10. Instagram bestätigen

Verlinkt ist `@petitepalikoeln`. Bitte bestätigen, dass das der offizielle
Account ist; er steht im Fuß und auf mehreren Seiten.

## 11. Domain und Livegang

**Datei:** `src/lib/env.ts`, Variable `NEXT_PUBLIC_SITE_URL`

Unter `petite-pali.de` läuft derzeit noch die alte Website. Reihenfolge für den
Umzug steht in `DEPLOY.md`.
