/**
 * Datenmodell.
 *
 * Alle Entitäten werden hier einmal deklariert: Felder, Typen, Beschriftungen,
 * Auswahllisten, Pflichtangaben und Beziehungen. Formulare, Tabellen,
 * Validierung, Suche und der Wix-CMS-Import werden daraus erzeugt – es gibt
 * keine zweite Stelle, an der Feldnamen gepflegt werden müssen.
 *
 * Feldtypen:
 *   text | textarea | number | money | date | select | tags | url | ref | image
 */

/** Statuswerte mit Farbton für StatusBadge. */
function opts(list) {
  return list.map(([value, label, tone = 'neutral']) => ({ value, label, tone }));
}

export const ORDER_STATUS = opts([
  ['anfrage', 'Anfrage', 'neutral'],
  ['angebot', 'Angebot', 'info'],
  ['angenommen', 'Angenommen', 'info'],
  ['in_bearbeitung', 'In Bearbeitung', 'progress'],
  ['wartet_kunde', 'Wartet auf Kunde', 'warn'],
  ['abgeschlossen', 'Abgeschlossen', 'success'],
  ['storniert', 'Storniert', 'danger'],
]);

export const PAYMENT_STATUS = opts([
  ['offen', 'Offen', 'warn'],
  ['teilbezahlt', 'Teilweise bezahlt', 'info'],
  ['bezahlt', 'Bezahlt', 'success'],
]);

export const INVOICE_STATUS = opts([
  ['entwurf', 'Entwurf', 'neutral'],
  ['offen', 'Offen', 'warn'],
  ['ueberfaellig', 'Überfällig', 'danger'],
  ['bezahlt', 'Bezahlt', 'success'],
  ['storniert', 'Storniert', 'neutral'],
]);

export const WEBSITE_STATUS = opts([
  ['entwicklung', 'In Entwicklung', 'progress'],
  ['live', 'Live', 'success'],
  ['ueberarbeitung', 'Überarbeitung', 'warn'],
  ['archiviert', 'Archiviert', 'neutral'],
]);

export const PROJECT_STATUS = opts([
  ['idee', 'Idee', 'neutral'],
  ['geplant', 'Geplant', 'info'],
  ['in_arbeit', 'In Arbeit', 'progress'],
  ['review', 'Review', 'warn'],
  ['fertig', 'Fertig', 'success'],
  ['archiviert', 'Archiviert', 'neutral'],
]);

export const TASK_STATUS = opts([
  ['offen', 'Offen', 'warn'],
  ['in_arbeit', 'In Arbeit', 'progress'],
  ['erledigt', 'Erledigt', 'success'],
]);

export const PRIORITY = opts([
  ['niedrig', 'Niedrig', 'neutral'],
  ['normal', 'Normal', 'info'],
  ['hoch', 'Hoch', 'warn'],
  ['dringend', 'Dringend', 'danger'],
]);

export const REFERENCE_CATEGORIES = opts([
  ['hero', 'Hero'],
  ['animationen', 'Animationen'],
  ['navigation', 'Navigation'],
  ['typography', 'Typography'],
  ['ux', 'UX'],
  ['3d', '3D'],
  ['mobile', 'Mobile'],
  ['landingpage', 'Landingpage'],
  ['saas', 'SaaS'],
  ['agency', 'Agency'],
  ['ecommerce', 'E-Commerce'],
  ['sonstiges', 'Sonstiges'],
]);

/* Statusgruppen – einzige Wahrheit für alle Kennzahlen. */
export const ORDER_GROUPS = {
  open: ['anfrage', 'angebot'],
  active: ['angenommen', 'in_bearbeitung', 'wartet_kunde'],
  done: ['abgeschlossen'],
  cancelled: ['storniert'],
};

export const INVOICE_GROUPS = {
  outstanding: ['offen', 'ueberfaellig'],
  paid: ['bezahlt'],
  ignored: ['entwurf', 'storniert'],
};

export const TASK_OPEN = ['offen', 'in_arbeit'];

/* ------------------------------------------------------------ Entitäten -- */

export const ENTITIES = {
  customers: {
    key: 'customers',
    collection: 'DashboardCustomers',
    route: 'kunden',
    label: 'Kunden',
    singular: 'Kunde',
    titleField: 'company',
    identityFields: ['company', 'contact', 'email'],
    defaultSort: { field: 'company', dir: 1 },
    searchFields: ['company', 'contact', 'email', 'phone', 'city', 'street', 'notes'],
    fields: [
      { name: 'company', label: 'Firmenname', type: 'text', required: true, maxLength: 120 },
      { name: 'contact', label: 'Ansprechpartner', type: 'text', maxLength: 120 },
      { name: 'email', label: 'E-Mail', type: 'text', format: 'email', maxLength: 160 },
      { name: 'phone', label: 'Telefonnummer', type: 'text', maxLength: 60 },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'street', label: 'Straße und Hausnummer', type: 'text', maxLength: 160 },
      { name: 'zip', label: 'PLZ', type: 'text', maxLength: 12, width: 'third' },
      { name: 'city', label: 'Ort', type: 'text', maxLength: 100, width: 'half' },
      { name: 'country', label: 'Land', type: 'text', maxLength: 60, width: 'third', default: 'Deutschland' },
      { name: 'notes', label: 'Notizen', type: 'textarea', maxLength: 4000 },
    ],
  },

  orders: {
    key: 'orders',
    collection: 'DashboardOrders',
    route: 'auftraege',
    label: 'Aufträge',
    singular: 'Auftrag',
    titleField: 'title',
    identityFields: ['title'],
    defaultSort: { field: 'orderDate', dir: -1 },
    searchFields: ['title', 'description', 'notes'],
    fields: [
      { name: 'title', label: 'Projektname', type: 'text', required: true, maxLength: 160 },
      { name: 'customerId', label: 'Kunde', type: 'ref', ref: 'customers', required: true },
      { name: 'value', label: 'Auftragswert', type: 'money', width: 'half' },
      { name: 'orderDate', label: 'Erstellungsdatum', type: 'date', width: 'half', default: 'today' },
      { name: 'deadline', label: 'Deadline', type: 'date', width: 'half' },
      { name: 'status', label: 'Status', type: 'select', options: ORDER_STATUS, required: true, default: 'anfrage', width: 'half' },
      { name: 'paymentStatus', label: 'Zahlungsstatus', type: 'select', options: PAYMENT_STATUS, required: true, default: 'offen', width: 'half' },
      { name: 'description', label: 'Beschreibung', type: 'textarea', maxLength: 4000 },
      { name: 'notes', label: 'Notizen', type: 'textarea', maxLength: 4000 },
    ],
  },

  invoices: {
    key: 'invoices',
    collection: 'DashboardInvoices',
    route: 'rechnungen',
    label: 'Rechnungen',
    singular: 'Rechnung',
    titleField: 'number',
    defaultSort: { field: 'issueDate', dir: -1 },
    searchFields: ['number', 'notes'],
    fields: [
      { name: 'number', label: 'Rechnungsnummer', type: 'text', required: true, unique: true, maxLength: 60, width: 'half' },
      { name: 'customerId', label: 'Kunde', type: 'ref', ref: 'customers', required: true, width: 'half' },
      { name: 'orderId', label: 'Auftrag', type: 'ref', ref: 'orders', filterBy: 'customerId' },
      { name: 'amount', label: 'Betrag', type: 'money', required: true, width: 'half' },
      { name: 'status', label: 'Status', type: 'select', options: INVOICE_STATUS, required: true, default: 'entwurf', width: 'half' },
      { name: 'issueDate', label: 'Rechnungsdatum', type: 'date', width: 'third', default: 'today' },
      { name: 'dueDate', label: 'Fälligkeitsdatum', type: 'date', width: 'third' },
      { name: 'paidDate', label: 'Zahlungsdatum', type: 'date', width: 'third', hint: 'Wird beim Status „Bezahlt" automatisch gesetzt.' },
      { name: 'notes', label: 'Notiz', type: 'textarea', maxLength: 4000 },
    ],
  },

  websites: {
    key: 'websites',
    collection: 'DashboardWebsites',
    route: 'websites',
    label: 'Meine Websites',
    singular: 'Website',
    titleField: 'title',
    defaultSort: { field: 'launchDate', dir: -1 },
    searchFields: ['title', 'url', 'description', 'notes', 'tech'],
    fields: [
      { name: 'title', label: 'Projektname', type: 'text', required: true, maxLength: 160 },
      { name: 'customerId', label: 'Kunde', type: 'ref', ref: 'customers' },
      { name: 'url', label: 'URL', type: 'url', required: true },
      { name: 'status', label: 'Status', type: 'select', options: WEBSITE_STATUS, required: true, default: 'entwicklung', width: 'half' },
      { name: 'launchDate', label: 'Erstellungsdatum', type: 'date', width: 'half', default: 'today' },
      { name: 'tech', label: 'Verwendete Technologien', type: 'tags', hint: 'Mit Komma trennen, z. B. Wix, Velo, GSAP' },
      { name: 'description', label: 'Beschreibung', type: 'textarea', maxLength: 4000 },
      { name: 'thumbnail', label: 'Vorschaubild', type: 'image', hint: 'Bild hochladen oder Bild-URL einfügen. Ohne eigenes Bild wird die konfigurierte Vorschau genutzt.' },
      { name: 'notes', label: 'Notizen', type: 'textarea', maxLength: 4000 },
    ],
  },

  references: {
    key: 'references',
    collection: 'DashboardReferences',
    route: 'inspiration',
    label: 'Website Inspiration',
    singular: 'Referenz',
    titleField: 'name',
    defaultSort: { field: 'createdAt', dir: -1 },
    searchFields: ['name', 'url', 'likeReason', 'takeaway', 'notes', 'tags', 'analysis'],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 160 },
      { name: 'url', label: 'URL', type: 'url', required: true },
      { name: 'category', label: 'Kategorie', type: 'select', options: REFERENCE_CATEGORIES, required: true, default: 'landingpage', width: 'half' },
      { name: 'tags', label: 'Tags', type: 'tags', width: 'half' },
      { name: 'likeReason', label: 'Warum gefällt mir die Website?', type: 'textarea', maxLength: 4000 },
      { name: 'takeaway', label: 'Was möchte ich davon übernehmen?', type: 'textarea', maxLength: 4000 },
      { name: 'screenshot', label: 'Screenshot / Preview', type: 'image' },
      { name: 'analysis', label: 'Analyse', type: 'textarea', maxLength: 20000, hint: 'Wird von „Website analysieren" befüllt, kann aber frei bearbeitet werden.' },
      { name: 'notes', label: 'Notizen', type: 'textarea', maxLength: 4000 },
    ],
  },

  projects: {
    key: 'projects',
    collection: 'DashboardProjects',
    route: 'projekte',
    label: 'Projekte',
    singular: 'Projekt',
    titleField: 'title',
    identityFields: ['title'],
    defaultSort: { field: 'deadline', dir: 1 },
    searchFields: ['title', 'description', 'notes', 'links'],
    fields: [
      { name: 'title', label: 'Projektname', type: 'text', required: true, maxLength: 160 },
      { name: 'kind', label: 'Art', type: 'select', width: 'half', default: 'kundenprojekt', options: opts([
        ['kundenprojekt', 'Kundenprojekt', 'info'],
        ['eigenes', 'Eigenes Projekt', 'progress'],
        ['intern', 'Internes Projekt', 'neutral'],
        ['idee', 'Zukünftige Idee', 'neutral'],
      ]) },
      { name: 'customerId', label: 'Kunde', type: 'ref', ref: 'customers', width: 'half' },
      { name: 'status', label: 'Status', type: 'select', options: PROJECT_STATUS, required: true, default: 'idee', width: 'half' },
      { name: 'priority', label: 'Priorität', type: 'select', options: PRIORITY, required: true, default: 'normal', width: 'half' },
      { name: 'deadline', label: 'Deadline', type: 'date', width: 'half' },
      { name: 'budget', label: 'Budget', type: 'money', width: 'half' },
      { name: 'description', label: 'Beschreibung', type: 'textarea', maxLength: 4000 },
      { name: 'links', label: 'Links', type: 'tags', hint: 'Eine URL pro Zeile oder mit Komma getrennt.' },
      { name: 'files', label: 'Dateien', type: 'files', hint: 'Dateien werden im Browser gespeichert – für große Dateien besser einen Link hinterlegen.' },
      { name: 'notes', label: 'Notizen', type: 'textarea', maxLength: 4000 },
    ],
  },

  tasks: {
    key: 'tasks',
    collection: 'DashboardTasks',
    route: 'aufgaben',
    label: 'Aufgaben',
    singular: 'Aufgabe',
    titleField: 'title',
    defaultSort: { field: 'deadline', dir: 1 },
    searchFields: ['title', 'description'],
    fields: [
      { name: 'title', label: 'Titel', type: 'text', required: true, maxLength: 200 },
      { name: 'projectId', label: 'Projekt', type: 'ref', ref: 'projects', width: 'half' },
      { name: 'status', label: 'Status', type: 'select', options: TASK_STATUS, required: true, default: 'offen', width: 'half' },
      { name: 'priority', label: 'Priorität', type: 'select', options: PRIORITY, required: true, default: 'normal', width: 'half' },
      { name: 'deadline', label: 'Deadline', type: 'date', width: 'half' },
      { name: 'description', label: 'Beschreibung', type: 'textarea', maxLength: 4000 },
    ],
  },
};

/** Reihenfolge in Navigation und Suche. */
export const ENTITY_ORDER = ['customers', 'orders', 'invoices', 'websites', 'references', 'projects', 'tasks'];

/** Aktivitäten sind ein Anhang, kein bearbeitbarer Datensatz. */
export const ACTIVITY_COLLECTION = 'DashboardActivity';
export const SETTINGS_COLLECTION = 'DashboardSettings';

/** Alle persistierten Kollektionen inklusive Anhänge. */
export const ALL_COLLECTIONS = [...ENTITY_ORDER, 'activity', 'settings'];

export function entity(key) {
  const def = ENTITIES[key];
  if (!def) throw new Error(`Unbekannte Entität: ${key}`);
  return def;
}

/**
 * Felder, ueber die ein Datensatz gefunden werden soll, wenn er von einem
 * anderen referenziert wird. Damit findet die Suche nach einem Ansprechpartner
 * auch dessen Auftraege und Rechnungen.
 */
export function identityText(entityKey, record) {
  if (!record) return '';
  const def = entity(entityKey);
  const names = def.identityFields || [def.titleField];
  return names.map((n) => record[n]).filter(Boolean).join(' ');
}

export function field(entityKey, name) {
  return entity(entityKey).fields.find((f) => f.name === name) || null;
}

/** Beschriftung eines Auswahlwerts; unbekannte Werte werden nicht verschluckt. */
export function optionLabel(options, value) {
  const hit = (options || []).find((o) => o.value === value);
  return hit ? hit.label : (value ? String(value) : '—');
}

export function optionTone(options, value) {
  const hit = (options || []).find((o) => o.value === value);
  return hit ? hit.tone : 'neutral';
}

/** Leerer Datensatz mit allen Standardwerten der Schema-Definition. */
export function blankRecord(entityKey, todayString) {
  const def = entity(entityKey);
  const out = {};
  for (const f of def.fields) {
    if (f.default === 'today') out[f.name] = todayString;
    else if (f.default !== undefined) out[f.name] = f.default;
    else if (f.type === 'tags' || f.type === 'files') out[f.name] = [];
    else if (f.type === 'money' || f.type === 'number') out[f.name] = null;
    else out[f.name] = '';
  }
  return out;
}
