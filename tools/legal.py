# -*- coding: utf-8 -*-
"""Rechtstexte. Platzhalter sind mit TODO markiert."""
from content import SITE

_S, _Z, _C = SITE["street"], SITE["zip"], SITE["city"]
_MAIL, _TEL = SITE["email"], SITE["phone_display"]

IMPRESSUM = f"""\
      <p class="legal__todo"><strong>Vor dem Livegang noch zu klären.</strong> Es fehlen:
        die <strong>Telefonnummer</strong> (nach § 5 DDG zwingend), die
        <strong>Umsatzsteuer-Identifikationsnummer</strong>, die
        <strong>zuständige Aufsichtsbehörde</strong> für den Güterkraftverkehr sowie
        Angaben zu einer etwaigen <strong>Berufshaftpflichtversicherung</strong>.
        Bis dahin steht unten eine Platzhalter-Telefonnummer.</p>

      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        RuhrCargo GmbH<br>
        {_S}<br>
        {_Z} {_C}<br>
        Deutschland
      </p>

      <h2>Vertreten durch</h2>
      <p>Geschäftsführer: {SITE["ceo_legal"]}</p>

      <h2>Kontakt</h2>
      <p>
        <!-- TODO:TELEFON — echte Nummer eintragen, auch in tools/content.py -->
        Telefon: {_TEL}<br>
        E-Mail: <a href="mailto:{_MAIL}">{_MAIL}</a>
      </p>

      <h2>Registereintrag</h2>
      <p>
        Eintragung im Handelsregister<br>
        Registergericht: {SITE["court"]}<br>
        Registernummer: {SITE["hrb"]}
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>Eine Umsatzsteuer-Identifikationsnummer gemäß § 27&nbsp;a UStG liegt uns für diese
        Veröffentlichung noch nicht vor und wird ergänzt, sobald sie vorliegt.</p>

      <h2>Verantwortlich für den Inhalt</h2>
      <p>{SITE["ceo_legal"]}, Anschrift wie oben</p>

      <h2>EU-Streitschlichtung</h2>
      <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
        <a href="https://ec.europa.eu/consumers/odr/" rel="noopener noreferrer" target="_blank">ec.europa.eu/consumers/odr</a>.
        Unsere E-Mail-Adresse finden Sie oben.</p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.</p>

      <h2>Haftung für Inhalte</h2>
      <p>Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen
        Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte
        fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
        rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung
        von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.</p>

      <h2>Haftung für Links</h2>
      <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Für diese fremden Inhalte ist stets der jeweilige Anbieter verantwortlich.
        Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Bei Bekanntwerden von
        Rechtsverletzungen entfernen wir derartige Links umgehend.</p>

      <h2>Urheberrecht</h2>
      <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
        dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Vervielfältigung,
        Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts
        bedürfen der schriftlichen Zustimmung.</p>
"""

DATENSCHUTZ = f"""\
      <p class="legal__todo"><strong>Vor dem Livegang prüfen lassen.</strong> Dieser Text beschreibt
        den aktuellen technischen Stand der Website. Er ersetzt keine Rechtsberatung. Offen sind:
        ob ein <strong>Datenschutzbeauftragter</strong> benannt ist, ob ein
        <strong>Auftragsverarbeitungsvertrag</strong> mit dem Hoster geschlossen wurde und wie lange
        Anfragen aufbewahrt werden. Sobald ein Formular-Dienstleister angebunden wird, muss
        Abschnitt&nbsp;5 ergänzt werden.</p>

      <h2>1. Verantwortliche Stelle</h2>
      <p>
        RuhrCargo GmbH<br>
        {_S}, {_Z} {_C}<br>
        Vertreten durch: {SITE["ceo"]}<br>
        <!-- TODO:TELEFON -->
        Telefon: {_TEL}<br>
        E-Mail: <a href="mailto:{_MAIL}">{_MAIL}</a>
      </p>

      <h2>2. Grundsätzliches</h2>
      <p>Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen
        Bestimmungen, insbesondere der Datenschutz-Grundverordnung (DSGVO) und des
        Bundesdatenschutzgesetzes (BDSG). Personenbezogene Daten sind alle Daten, mit denen Sie
        persönlich identifiziert werden können.</p>

      <h2>3. Hosting</h2>
      <p>Diese Website wird bei einem externen Dienstleister gehostet. Der Anbieter verarbeitet in
        unserem Auftrag die beim Aufruf der Seiten anfallenden Daten. Rechtsgrundlage ist
        Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO – unser berechtigtes Interesse an einer sicheren
        und zuverlässigen Bereitstellung.</p>
      <p><strong>Hinweis für den Betreiber:</strong> Mit dem Hoster ist ein Vertrag zur
        Auftragsverarbeitung nach Art.&nbsp;28 DSGVO abzuschließen. Sitzt der Anbieter außerhalb der
        EU, sind zusätzlich die Garantien für den Drittlandtransfer (Standardvertragsklauseln)
        zu dokumentieren und hier zu benennen.</p>

      <h2>4. Server-Logfiles</h2>
      <p>Beim Aufruf dieser Website erhebt der Hosting-Anbieter automatisch Informationen, die Ihr
        Browser übermittelt:</p>
      <ul>
        <li>Browsertyp und Browserversion</li>
        <li>verwendetes Betriebssystem</li>
        <li>Referrer-URL</li>
        <li>aufgerufene Seite und Uhrzeit der Anfrage</li>
        <li>übertragene Datenmenge und Statusmeldung</li>
        <li>IP-Adresse</li>
      </ul>
      <p>Diese Daten dienen dem sicheren Betrieb, der Fehlersuche und der Abwehr von Angriffen.
        Eine Zusammenführung mit anderen Datenquellen findet nicht statt. Rechtsgrundlage ist
        Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.</p>

      <h2>5. Anfrageformular, E-Mail und Telefon</h2>
      <p>Wenn Sie uns über das Anfrageformular, per E-Mail oder telefonisch kontaktieren,
        verarbeiten wir die von Ihnen übermittelten Angaben – Name, Firma, Kontaktdaten sowie Ihre
        Angaben zum Transport – ausschließlich zur Bearbeitung Ihrer Anfrage und für den Fall von
        Anschlussfragen.</p>
      <p>Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO, soweit Ihre Anfrage der
        Anbahnung oder Durchführung eines Vertrags dient, im Übrigen Art.&nbsp;6 Abs.&nbsp;1
        lit.&nbsp;f DSGVO. Die Angabe der mit&nbsp;* gekennzeichneten Felder ist erforderlich, um die
        Anfrage bearbeiten zu können; alle weiteren Angaben sind freiwillig.</p>
      <p>Wir löschen die Daten, sobald sie für die Zweckerreichung nicht mehr erforderlich sind und
        keine handels- oder steuerrechtlichen Aufbewahrungsfristen entgegenstehen.</p>
      <p>Das Formular enthält ein für Menschen unsichtbares Feld, das ausschließlich der Abwehr
        automatisierter Einträge dient. Es werden dabei keine personenbezogenen Daten erhoben.</p>

      <h2>6. Schriftarten</h2>
      <p>Diese Website bindet keine externen Schriftarten ein. Alle verwendeten Schriften werden
        lokal vom eigenen Server ausgeliefert. Beim Aufruf der Seite werden dadurch
        <strong>keine Daten an Google oder andere Dritte übertragen</strong>.</p>

      <h2>7. Cookies, Analyse und Tracking</h2>
      <p>Diese Website setzt <strong>keine Cookies</strong> und bindet keine Analyse-, Tracking-
        oder Marketingdienste ein. Es findet keine Reichweitenmessung und kein Profiling statt.
        Ein Einwilligungsbanner ist deshalb nicht erforderlich.</p>
      <p>Sollten später Dienste wie Webanalyse, Kartendarstellungen, Videoeinbindungen oder
        Social-Media-Plugins ergänzt werden, ist diese Erklärung entsprechend zu erweitern und
        gegebenenfalls eine Einwilligungslösung einzurichten.</p>

      <h2>8. Ihre Rechte</h2>
      <p>Sie haben jederzeit das Recht auf:</p>
      <ul>
        <li>Auskunft über die zu Ihrer Person gespeicherten Daten (Art.&nbsp;15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art.&nbsp;16 DSGVO)</li>
        <li>Löschung (Art.&nbsp;17 DSGVO)</li>
        <li>Einschränkung der Verarbeitung (Art.&nbsp;18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art.&nbsp;20 DSGVO)</li>
        <li>Widerspruch gegen die Verarbeitung (Art.&nbsp;21 DSGVO)</li>
      </ul>
      <p>Wenden Sie sich dazu an die oben genannte verantwortliche Stelle.</p>

      <h2>9. Beschwerderecht</h2>
      <p>Ihnen steht ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu. Für unseren
        Sitz zuständig ist die Landesbeauftragte für Datenschutz und Informationsfreiheit
        Nordrhein-Westfalen, Kavalleriestraße&nbsp;2–4, 40213 Düsseldorf.</p>

      <h2>10. SSL-/TLS-Verschlüsselung</h2>
      <p>Diese Website nutzt aus Sicherheitsgründen eine TLS-Verschlüsselung. Eine verschlüsselte
        Verbindung erkennen Sie am „https://“ in der Adresszeile Ihres Browsers und am
        Schloss-Symbol.</p>

      <h2>11. Aktualität</h2>
      <p>Diese Datenschutzerklärung gilt in der hier veröffentlichten Fassung. Durch die
        Weiterentwicklung der Website oder geänderte gesetzliche Vorgaben kann eine Anpassung
        erforderlich werden.</p>
"""
