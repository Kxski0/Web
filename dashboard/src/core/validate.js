/**
 * Schema-getriebene Validierung und Normalisierung.
 *
 * `normalize` läuft vor jedem Schreibvorgang – im Frontend und noch einmal im
 * Wix-Backend. Es ist bewusst dieselbe Datei, damit beide Seiten nicht
 * auseinanderlaufen können.
 */
import { entity } from '../data/schema.js';
import { parseMoney, asDay } from './format.js';
import { splitList, normalizeUrl } from './util.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function trimTo(value, max) {
  const s = String(value ?? '').trim();
  return max ? s.slice(0, max) : s;
}

/**
 * Bringt Rohwerte (Formular, Import, API) in die kanonische Form des Schemas.
 * Wirft nie – unbrauchbare Werte werden zu null/'' und dann von `validate`
 * gemeldet, falls das Feld Pflicht ist.
 */
export function normalizeRecord(entityKey, raw) {
  const def = entity(entityKey);
  const out = {};
  for (const f of def.fields) {
    const value = raw?.[f.name];
    switch (f.type) {
      case 'money':
      case 'number': {
        const n = parseMoney(value);
        out[f.name] = n === null ? null : Math.round(n * 100) / 100;
        break;
      }
      case 'date':
        out[f.name] = asDay(value) || '';
        break;
      case 'tags':
        out[f.name] = splitList(value).slice(0, 40).map((t) => t.slice(0, 60));
        break;
      case 'files':
        out[f.name] = Array.isArray(value)
          ? value
              .filter((x) => x && typeof x.name === 'string' && typeof x.data === 'string')
              .slice(0, 20)
              .map((x) => ({ name: String(x.name).slice(0, 200), size: Number(x.size) || 0, data: String(x.data) }))
          : [];
        break;
      case 'url':
        out[f.name] = normalizeUrl(value) || '';
        break;
      case 'select': {
        const allowed = (f.options || []).map((o) => o.value);
        const v = String(value ?? '');
        out[f.name] = allowed.includes(v) ? v : (f.default ?? allowed[0] ?? '');
        break;
      }
      case 'image': {
        const s = String(value ?? '').trim();
        // Erlaubt sind eingebettete Bilder (Upload) und http(s)-Adressen.
        out[f.name] = s.startsWith('data:image/') ? s : (normalizeUrl(s) || '');
        break;
      }
      case 'ref':
        out[f.name] = trimTo(value, 80);
        break;
      default:
        out[f.name] = trimTo(value, f.maxLength || 4000);
    }
  }
  return out;
}

/**
 * Prüft einen bereits normalisierten Datensatz.
 * `context.all` ist die aktuelle Liste derselben Entität – für Eindeutigkeit.
 * Gibt `{ ok, errors }` zurück, wobei `errors` Feldname → Meldung ist.
 */
export function validateRecord(entityKey, record, context = {}) {
  const def = entity(entityKey);
  const errors = {};
  const existing = context.all || [];
  const selfId = context.id || null;

  for (const f of def.fields) {
    const value = record[f.name];

    if (f.required) {
      const empty =
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);
      if (empty) {
        errors[f.name] = `${f.label} ist erforderlich.`;
        continue;
      }
    }

    if (f.format === 'email' && value && !EMAIL_RE.test(value)) {
      errors[f.name] = 'Bitte eine gültige E-Mail-Adresse eingeben.';
    }

    if ((f.type === 'money' || f.type === 'number') && value !== null) {
      if (!Number.isFinite(value)) errors[f.name] = `${f.label} muss eine Zahl sein.`;
      else if (value < 0) errors[f.name] = `${f.label} darf nicht negativ sein.`;
      else if (value > 1e12) errors[f.name] = `${f.label} ist unrealistisch hoch.`;
    }

    if (f.type === 'url' && value === '' && f.required) {
      errors[f.name] = 'Bitte eine gültige http(s)-Adresse eingeben.';
    }

    if (f.unique && value) {
      const clash = existing.some(
        (other) => other._id !== selfId && String(other[f.name] ?? '').toLowerCase() === String(value).toLowerCase(),
      );
      if (clash) errors[f.name] = `${f.label} „${value}" ist bereits vergeben.`;
    }

    if (f.type === 'ref' && value) {
      const pool = context.refs?.[f.ref];
      if (pool && !pool.some((r) => r._id === value)) {
        errors[f.name] = `${f.label} existiert nicht mehr. Bitte neu auswählen.`;
      }
    }
  }

  // Entitätsübergreifende Regeln, die sich nicht als Feldattribut ausdrücken lassen.
  if (entityKey === 'orders' && record.orderDate && record.deadline && record.deadline < record.orderDate) {
    errors.deadline = 'Die Deadline liegt vor dem Erstellungsdatum.';
  }
  if (entityKey === 'invoices') {
    if (record.issueDate && record.dueDate && record.dueDate < record.issueDate) {
      errors.dueDate = 'Das Fälligkeitsdatum liegt vor dem Rechnungsdatum.';
    }
    if (record.status === 'bezahlt' && record.paidDate && record.issueDate && record.paidDate < record.issueDate) {
      errors.paidDate = 'Das Zahlungsdatum liegt vor dem Rechnungsdatum.';
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
