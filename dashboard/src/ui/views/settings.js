/**
 * Einstellungen.
 *
 * Vier Bereiche: Allgemein, Umsatzbasis, Vorschau/Analyse und Daten
 * (Sicherung, Import, Demodaten, Zurücksetzen).
 */
import { h } from '../dom.js';
import { overlayRoot } from '../overlay.js';
import { Button, Card, PageHeader, Notice, DefList, DefItem } from '../components/basics.js';
import { confirmDialog, toast } from '../components/Modal.js';
import { buildDemoData } from '../../data/demo.js';
import { ENTITY_ORDER, ENTITIES } from '../../data/schema.js';
import { formatDateTime } from '../../core/format.js';
import { normalizeUrl } from '../../core/util.js';

export function renderSettings(ctx) {
  const { store } = ctx;
  const s = store.settings;

  /* ------------------------------------------------------- Allgemein -- */

  const companyInput = h('input.input', {
    type: 'text',
    maxlength: 80,
    value: s.companyName || '',
    placeholder: 'z. B. Studio Weidenbruch',
    'aria-label': 'Anzeigename',
  });

  const generalCard = Card({
    title: 'Allgemein',
    children: h('div.form-grid', null,
      h('div.field.field-half', null,
        h('label.field-label', null, 'Anzeigename im Dashboard'),
        companyInput,
        h('p.field-hint', null, 'Erscheint als Überschrift auf der Startseite.')),
      h('div.field.field-full', null,
        Button('Speichern', {
          variant: 'primary',
          onClick: async () => {
            await store.saveSettings({ companyName: companyInput.value.trim() });
            toast('Gespeichert.');
            ctx.refresh();
          },
        }))),
  });

  /* ---------------------------------------------------- Umsatzbasis -- */

  const basisCard = Card({
    title: 'Umsatzbasis',
    subtitle: 'Bestimmt, was auf Dashboard und in den Finanzen als Umsatz gilt',
    children: h('div.radio-group', null,
      radioOption({
        name: 'revenueBasis',
        value: 'invoices',
        checked: s.revenueBasis !== 'orders',
        title: 'Bezahlte Rechnungen (empfohlen)',
        text: 'Umsatz = Summe aller Rechnungen mit Status „Bezahlt", datiert auf das Zahlungsdatum. '
          + 'Entspricht dem tatsächlich eingegangenen Geld.',
        onChange: async () => {
          await store.saveSettings({ revenueBasis: 'invoices' });
          toast('Umsatzbasis: bezahlte Rechnungen.');
          ctx.refresh();
        },
      }),
      radioOption({
        name: 'revenueBasis',
        value: 'orders',
        checked: s.revenueBasis === 'orders',
        title: 'Abgeschlossene Aufträge',
        text: 'Umsatz = Summe aller Aufträge mit Status „Abgeschlossen", datiert auf Deadline '
          + 'bzw. Erstellungsdatum. Sinnvoll, wenn nicht jeder Auftrag als Rechnung erfasst wird.',
        onChange: async () => {
          await store.saveSettings({ revenueBasis: 'orders' });
          toast('Umsatzbasis: abgeschlossene Aufträge.');
          ctx.refresh();
        },
      })),
  });

  /* ------------------------------------------- Vorschau und Analyse -- */

  const previewSelect = h('select.input.input-select', {
    'aria-label': 'Vorschaubilder',
    value: s.previewProvider || 'none',
    onChange: (e) => {
      templateField.hidden = e.target.value !== 'custom';
    },
  },
  h('option', { value: 'none' }, 'Aus – nur selbst hochgeladene Bilder'),
  h('option', { value: 'custom' }, 'Eigener Screenshot-Dienst (Vorlage)'));
  previewSelect.value = s.previewProvider || 'none';

  const templateInput = h('input.input', {
    type: 'text',
    value: s.previewTemplate || '',
    placeholder: 'https://dienst.example/shot?url={encoded}',
    'aria-label': 'Vorlage für Vorschaubilder',
    autocapitalize: 'off',
  });

  const templateField = h('div.field.field-full', { hidden: (s.previewProvider || 'none') !== 'custom' },
    h('label.field-label', null, 'Vorlage'),
    templateInput,
    h('p.field-hint', null,
      'Platzhalter: {encoded} für die URL-kodierte Adresse, {url} für die rohe Adresse, {host} für die Domain. '
      + 'Der Aufruf erfolgt aus dem Browser – die besuchte Adresse wird dem Dienst also bekannt.'));

  const analyzeInput = h('input.input', {
    type: 'text',
    value: s.analyzeEndpoint || '',
    placeholder: 'https://mein-endpunkt.example/analyse',
    'aria-label': 'Endpunkt für Website-Analyse',
    autocapitalize: 'off',
  });

  const previewCard = Card({
    title: 'Vorschaubilder und Website-Analyse',
    subtitle: 'Beides ist optional – die Anwendung funktioniert vollständig ohne',
    children: [
      Notice(
        'Ein Browser kann fremde Websites weder als Bild aufnehmen noch auslesen. Beides braucht einen '
        + 'externen Dienst bzw. einen eigenen Server-Endpunkt.',
        'info',
      ),
      h('div.form-grid', null,
        h('div.field.field-half', null,
          h('label.field-label', null, 'Vorschaubilder'),
          previewSelect),
        templateField,
        h('div.field.field-full', null,
          h('label.field-label', null, 'Endpunkt für „Website analysieren"'),
          analyzeInput,
          h('p.field-hint', null,
            'Erwartet POST mit { "url": "…" } und antwortet mit { "analysis": "…" }. '
            + 'Läuft die App in Wix, wird stattdessen automatisch das Velo-Web-Modul verwendet – '
            + 'dieses Feld bleibt dann leer.')),
        h('div.field.field-full', null,
          Button('Speichern', {
            variant: 'primary',
            onClick: async () => {
              const endpoint = analyzeInput.value.trim();
              if (endpoint && !normalizeUrl(endpoint)) {
                toast('Der Endpunkt ist keine gültige http(s)-Adresse.', 'danger');
                return;
              }
              await store.saveSettings({
                previewProvider: previewSelect.value,
                previewTemplate: templateInput.value.trim(),
                analyzeEndpoint: endpoint ? normalizeUrl(endpoint) : '',
              });
              toast('Gespeichert.');
              ctx.refresh();
            },
          }))),
    ],
  });

  /* ------------------------------------------------------------ Daten -- */

  const counts = ENTITY_ORDER.map((key) => DefItem(ENTITIES[key].label, String(store.all(key).length)));
  const fileInput = h('input', {
    type: 'file',
    accept: 'application/json,.json',
    class: 'sr-only',
    id: 'settings-import',
    onChange: async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      const confirmed = await confirmDialog({
        title: 'Sicherung einspielen?',
        text: `„${file.name}" ersetzt den gesamten aktuellen Datenbestand.`,
        confirmLabel: 'Einspielen',
      });
      if (!confirmed) return;
      try {
        const payload = JSON.parse(await file.text());
        await store.importAll(payload);
        toast('Sicherung eingespielt.');
        ctx.refresh();
      } catch (err) {
        toast(err?.message || 'Die Datei konnte nicht gelesen werden.', 'danger');
      }
    },
  });

  const dataCard = Card({
    title: 'Daten',
    subtitle: `Speicherort: ${store.adapter.label}`,
    children: [
      store.adapter.persistent
        ? null
        : Notice(
          'Dieser Browser erlaubt keinen dauerhaften Speicher (z. B. privater Modus). '
          + 'Daten gehen beim Schließen verloren – bitte exportieren.',
          'danger',
        ),
      DefList(counts),
      h('div.settings-actions', null,
        Button('Sicherung herunterladen', {
          variant: 'secondary',
          iconName: 'download',
          onClick: () => downloadBackup(store),
        }),
        h('label.btn.btn-secondary', { for: 'settings-import' },
          h('span', null, 'Sicherung einspielen')),
        fileInput,
        Button('Demodaten laden', {
          variant: 'ghost',
          iconName: 'refresh',
          onClick: async () => {
            const confirmed = await confirmDialog({
              title: 'Demodaten laden?',
              text: 'Der aktuelle Datenbestand wird dabei ersetzt. Vorher am besten eine Sicherung herunterladen.',
              confirmLabel: 'Demodaten laden',
              tone: 'primary',
            });
            if (!confirmed) return;
            await store.loadDataset(buildDemoData());
            await store.syncOverdueInvoices();
            toast('Demodaten geladen.');
            ctx.refresh();
          },
        }),
        Button('Alle Daten löschen', {
          variant: 'ghost-danger',
          iconName: 'trash',
          onClick: async () => {
            const confirmed = await confirmDialog({
              title: 'Wirklich alle Daten löschen?',
              text: 'Kunden, Aufträge, Rechnungen, Projekte, Aufgaben, Websites und Referenzen werden entfernt. '
                + 'Das lässt sich nur über eine Sicherung rückgängig machen.',
              confirmLabel: 'Alles löschen',
            });
            if (!confirmed) return;
            await store.resetAll();
            toast('Alle Daten gelöscht.');
            ctx.refresh();
          },
        })),
    ].filter(Boolean),
  });

  /* ------------------------------------------------------------ Info -- */

  const infoCard = Card({
    title: 'Technische Angaben',
    children: DefList([
      DefItem('Speicher', store.adapter.label),
      DefItem('Dauerhaft', store.adapter.persistent ? 'Ja' : 'Nein'),
      DefItem('Wix-Backend', ctx.bridge ? 'Verbunden' : 'Nicht verbunden (Standalone-Betrieb)'),
      DefItem('Aktivitätseinträge', String(store.activity().length)),
      DefItem('Letzte Änderung', lastChange(store)),
    ]),
  });

  return h('div.view', null,
    PageHeader({ title: 'Einstellungen' }),
    h('div.settings-grid', null, generalCard, basisCard, previewCard, dataCard, infoCard));
}

/** Radio-Option mit Titel und Erklärung – größer und damit touchfreundlich. */
function radioOption({ name, value, checked, title, text, onChange }) {
  const input = h('input', { type: 'radio', name, value, checked, class: 'radio' });
  input.addEventListener('change', () => {
    if (input.checked) onChange();
  });
  return h('label.radio-option', null,
    input,
    h('span.radio-body', null,
      h('span.radio-title', null, title),
      h('span.radio-text', null, text)));
}

function lastChange(store) {
  const latest = store.activity()[0];
  return latest ? formatDateTime(latest.at) : '—';
}

/**
 * Sicherung als JSON-Datei.
 * Erzeugt ein Blob und klickt einen temporären Link – funktioniert auf dem iPad
 * über das Teilen-Menü von Safari.
 */
function downloadBackup(store) {
  const data = store.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const link = h('a', { href: url, download: `dashboard-sicherung-${stamp}.json`, class: 'sr-only' });
  overlayRoot().appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Sicherung heruntergeladen.');
}
