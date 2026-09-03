# -*- coding: utf-8 -*-
"""Impressum und Datenschutz. Beide auf noindex und nicht in der Sitemap.

Die Texte beschreiben, was die Seite tatsaechlich tut: keine Formulare,
keine Drittanbieter-Schriften, keine Statistik. Wird eine dieser Aussagen
spaeter falsch, muss dieser Text mitgeaendert werden.
"""
from parts import SITE, page, esc

TODO = '<span class="todo">TODO_ECHTDATEN</span>'


def _doc(slug, title, description, heading, inner):
    body = (
        '<main id="inhalt" class="section" style="padding-block-start:'
        'calc(var(--nav-h) + var(--space-16))">\n'
        '<div class="shell doc">\n'
        '<h1 style="font-size:var(--text-3xl);letter-spacing:-0.04em">%s</h1>\n'
        '%s\n</div>\n</main>\n'
    ) % (esc(heading), inner)
    return page(slug, title, description, body, noindex=True)


def impressum():
    inner = """
<p style="margin-block-start:var(--space-6)">Angaben gemäß § 5 Digitale-Dienste-Gesetz.</p>

<h2>Anbieter</h2>
<address>
  {todo} Vollständige Firmierung inklusive Rechtsform<br>
  {owner}<br>
  {street}<br>
  {zip} {city}
</address>

<h2>Kontakt</h2>
<p>
  Telefon: <a class="link" href="tel:{phone_href}">{phone_disp}</a><br>
  E-Mail: <a class="link" href="mailto:{email}">{email}</a>
</p>

<h2>Vertretungsberechtigt</h2>
<p>{owner}</p>

<h2>Registereintrag</h2>
<p>
  {todo} Registergericht und Registernummer eintragen, sofern eine Eintragung
  besteht. Bei einem Einzelunternehmen ohne Handelsregistereintrag entfällt
  dieser Abschnitt vollständig.
</p>

<h2>Umsatzsteuer-Identifikationsnummer</h2>
<p>
  {todo} USt-IdNr. nach § 27 a Umsatzsteuergesetz eintragen. Bei Anwendung der
  Kleinunternehmerregelung entfällt dieser Abschnitt und wird stattdessen dort
  erwähnt, wo Preise genannt werden.
</p>

<h2>Redaktionell verantwortlich</h2>
<p>{owner}, Anschrift wie oben.</p>

<h2>Berufshaftpflichtversicherung</h2>
<p>
  {todo} Versicherer und räumlicher Geltungsbereich, sofern eine Angabepflicht
  besteht.
</p>

<h2>Streitbeilegung</h2>
<p>
  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
  bereit:
  <a class="link" href="https://ec.europa.eu/consumers/odr/" rel="noopener"
     target="_blank">ec.europa.eu/consumers/odr</a>.
  Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren
  vor einer Verbraucherschlichtungsstelle teilzunehmen.
</p>

<h2>Haftung für Inhalte</h2>
<p>
  Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den
  allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet,
  übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
  Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen
  nach den allgemeinen Gesetzen bleiben davon unberührt. Eine diesbezügliche
  Haftung ist erst ab dem Zeitpunkt der Kenntnis einer konkreten
  Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen
  entfernen wir diese Inhalte umgehend.
</p>

<h2>Haftung für Links</h2>
<p>
  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
  wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
  keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
  jeweilige Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten
  wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
  Eine permanente inhaltliche Kontrolle ohne konkrete Anhaltspunkte einer
  Rechtsverletzung ist nicht zumutbar.
</p>

<h2>Urheberrecht</h2>
<p>
  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
  unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche
  gekennzeichnet. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
  Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen
  Zustimmung des jeweiligen Autors.
</p>

<h2>Bildnachweis</h2>
<p>
  {todo} Herkunft und Nutzungsrechte aller verwendeten Fotografien angeben.
  Die derzeit eingebundenen Bilder sind Platzhalter, deren Rechtelage vor der
  Veröffentlichung zu klären ist.
</p>
""".format(todo=TODO, owner=esc(SITE["owner"]), street=esc(SITE["street"]),
           zip=SITE["zip"], city=esc(SITE["city"]),
           phone_href=SITE["phone_href"], phone_disp=SITE["phone_disp"],
           email=SITE["email"])

    return _doc("impressum", "Impressum | %s" % SITE["brand"],
                "Anbieterkennzeichnung nach § 5 Digitale-Dienste-Gesetz.",
                "Impressum", inner)


def datenschutz():
    inner = """
<p style="margin-block-start:var(--space-6)">
  Diese Datenschutzerklärung beschreibt, was beim Besuch dieser Website mit
  personenbezogenen Daten geschieht. Sie ist bewusst kurz, weil diese Seite
  wenig verarbeitet.
</p>

<h2>Verantwortlicher</h2>
<address>
  {owner}<br>
  {street}<br>
  {zip} {city}<br>
  E-Mail: <a class="link" href="mailto:{email}">{email}</a>
</address>

<h2>Was diese Website nicht tut</h2>
<ul>
  <li>Sie setzt keine Cookies.</li>
  <li>Sie bindet keine Schriften von einem fremden Server ein. Alle Schriften
      werden vom selben Server ausgeliefert wie die Seite.</li>
  <li>Sie enthält kein Kontaktformular.</li>
  <li>Sie bindet keine Karten, Videos oder Schaltflächen sozialer Netzwerke
      von Dritten ein.</li>
  <li>Sie führt keine Reichweitenmessung durch und legt kein Nutzerprofil an.</li>
</ul>
<p>
  Wird eine dieser Aussagen durch eine spätere Änderung falsch, muss dieser
  Text angepasst werden. {todo} Vor dem Livegang prüfen, ob eine
  Statistiklösung ergänzt wurde.
</p>

<h2>Server-Logdateien</h2>
<p>
  Der Anbieter dieser Seiten erhebt und speichert automatisch Informationen in
  sogenannten Server-Logdateien, die dein Browser automatisch übermittelt. Das
  sind Browsertyp und Browserversion, verwendetes Betriebssystem,
  Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage
  und die IP-Adresse.
</p>
<p>
  Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Grundlage
  der Verarbeitung ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse
  liegt im technisch fehlerfreien Betrieb und in der Sicherheit der Website.
  Die Daten werden nach {todo} Speicherdauer eintragen gelöscht.
</p>

<h2>Hosting</h2>
<p>
  Diese Website wird bei einem externen Dienstleister gehostet.
  {todo} Name und Anschrift des Hosters eintragen. Der Hoster verarbeitet die
  oben genannten Server-Logdateien in unserem Auftrag auf Grundlage eines
  Vertrags über die Auftragsverarbeitung nach Art. 28 DSGVO.
</p>

<h2>Kontaktaufnahme per E-Mail oder Telefon</h2>
<p>
  Wenn du uns schreibst oder anrufst, werden deine Angaben zur Bearbeitung der
  Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
  Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern die Anfrage mit der
  Anbahnung eines Vertrags zusammenhängt, sonst Art. 6 Abs. 1 lit. f DSGVO.
  Wir geben diese Daten nicht ohne deine Einwilligung weiter und löschen sie,
  sobald die Anfrage erledigt ist und keine gesetzlichen
  Aufbewahrungspflichten entgegenstehen.
</p>
<p>
  Der Versand einer E-Mail erfolgt über deinen eigenen Anbieter. Auf dessen
  Verarbeitung haben wir keinen Einfluss.
</p>

<h2>SSL- und TLS-Verschlüsselung</h2>
<p>
  Diese Seite nutzt aus Sicherheitsgründen eine Verschlüsselung der
  Verbindung. Du erkennst sie daran, dass die Adresszeile des Browsers mit
  https beginnt. Bei aktiver Verschlüsselung können die Daten, die du an uns
  übermittelst, nicht von Dritten mitgelesen werden.
</p>

<h2>Deine Rechte</h2>
<p>
  Du hast jederzeit das Recht auf unentgeltliche Auskunft über deine
  gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den
  Zweck der Verarbeitung (Art. 15 DSGVO). Ebenso steht dir ein Recht auf
  Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung
  (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21) zu.
</p>
<p>
  Du hast außerdem das Recht, dich bei einer Aufsichtsbehörde zu beschweren.
  Zuständig ist die Datenschutzaufsicht des Bundeslandes, in dem der
  Verantwortliche seinen Sitz hat. {todo} Zuständige Behörde mit Anschrift
  eintragen.
</p>

<h2>Änderungen dieser Erklärung</h2>
<p>
  Wir passen diese Erklärung an, sobald sich die Funktionen der Website oder
  die Rechtslage ändern. Es gilt jeweils die hier veröffentlichte Fassung.
</p>

<h2>Hinweis</h2>
<p>
  {todo} Dieser Text ist eine sorgfältig erstellte Vorlage und ersetzt keine
  Rechtsberatung. Vor der Veröffentlichung sollte er von einer fachkundigen
  Person auf den konkreten Betrieb hin geprüft werden.
</p>
""".format(todo=TODO, owner=esc(SITE["owner"]), street=esc(SITE["street"]),
           zip=SITE["zip"], city=esc(SITE["city"]), email=SITE["email"])

    return _doc("datenschutz", "Datenschutzerklärung | %s" % SITE["brand"],
                "Informationen zur Verarbeitung personenbezogener Daten nach "
                "Art. 13 DSGVO.", "Datenschutz", inner)
