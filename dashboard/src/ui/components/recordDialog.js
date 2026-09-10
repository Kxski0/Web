/**
 * Standard-Dialoge für Anlegen, Bearbeiten und Löschen.
 *
 * Jede Ansicht ruft dieselben drei Funktionen auf. Dadurch verhalten sich
 * Aufträge, Rechnungen, Kunden usw. exakt gleich – gleiche Beschriftungen,
 * gleiche Fehlerbehandlung, gleiche Bestätigung.
 */
import { h } from '../dom.js';
import { openModal, confirmDialog, toast } from './Modal.js';
import { buildForm } from './Form.js';
import { entity, blankRecord, ENTITIES } from '../../data/schema.js';
import { today } from '../../core/format.js';

/**
 * Öffnet den Anlegen-Dialog.
 * @param {object} options
 * @param {object} options.store
 * @param {string} options.entityKey
 * @param {object} [options.preset] Vorbelegung, z. B. Kunde aus der Detailseite
 * @param {(record)=>void} [options.onSaved]
 */
export function openCreateDialog(options) {
  const { store, entityKey, preset = {}, onSaved, lock = {} } = options;
  const def = entity(entityKey);
  const record = { ...blankRecord(entityKey, today()), ...preset, ...lock };

  const modal = openModal({
    title: `${def.singular} anlegen`,
    size: 'lg',
    content: h('div'),
    footer: [],
  });

  const { form, footer } = buildForm({
    entityKey,
    record,
    store,
    lock,
    submitLabel: 'Anlegen',
    onCancel: () => modal.close(),
    onSubmit: async (values) => {
      const result = await store.create(entityKey, values);
      if (!result.ok) return result;
      modal.close();
      toast(`${def.singular} „${store.titleOf(entityKey, result.record)}" angelegt.`);
      if (onSaved) onSaved(result.record);
      return result;
    },
  });

  modal.body.replaceChildren(form);
  modal.el.querySelector('.modal-foot')?.remove();
  modal.el.appendChild(h('footer.modal-foot', null, ...footer));
  return modal;
}

/** Öffnet den Bearbeiten-Dialog für einen vorhandenen Datensatz. */
export function openEditDialog(options) {
  const { store, entityKey, id, onSaved, lock = {} } = options;
  const def = entity(entityKey);
  const existing = store.byId(entityKey, id);
  if (!existing) {
    toast('Dieser Datensatz existiert nicht mehr.', 'danger');
    return null;
  }

  const modal = openModal({
    title: `${def.singular} bearbeiten`,
    size: 'lg',
    content: h('div'),
  });

  const { form, footer } = buildForm({
    entityKey,
    record: { ...blankRecord(entityKey, today()), ...existing },
    store,
    lock,
    submitLabel: 'Speichern',
    onCancel: () => modal.close(),
    onSubmit: async (values) => {
      const result = await store.update(entityKey, id, values);
      if (!result.ok) return result;
      modal.close();
      toast('Änderungen gespeichert.');
      if (onSaved) onSaved(result.record);
      return result;
    },
  });

  modal.body.replaceChildren(form);
  modal.el.querySelector('.modal-foot')?.remove();
  modal.el.appendChild(h('footer.modal-foot', null, ...footer));
  return modal;
}

/**
 * Löschen mit Beziehungsprüfung.
 *
 * Hängen an dem Datensatz noch andere (Kunde mit Rechnungen), wird das im
 * Dialog benannt und der Nutzer muss die Verknüpfung ausdrücklich lösen –
 * statt eines stillen Löschvorgangs, der die Umsatzrechnung verfälscht.
 */
export async function confirmDelete(options) {
  const { store, entityKey, id, onDeleted } = options;
  const def = entity(entityKey);
  const record = store.byId(entityKey, id);
  if (!record) return false;
  const name = store.titleOf(entityKey, record);

  const blockers = store.blockingReferences(entityKey, id);
  const details = blockers.length
    ? h('div.confirm-details', null,
      h('p.modal-text', null, 'Damit verknüpft sind:'),
      h('ul.confirm-list', null,
        ...blockers.map((b) => h('li', null, `${b.count} × ${ENTITIES[b.entityKey].label}`))),
      h('p.modal-text', null,
        'Diese Datensätze bleiben erhalten, verlieren aber die Zuordnung. '
        + 'Sie tauchen danach in Auswertungen unter „ohne Zuordnung" auf.'))
    : null;

  const confirmed = await confirmDialog({
    title: `${def.singular} löschen?`,
    text: `„${name}" wird dauerhaft entfernt.`,
    confirmLabel: blockers.length ? 'Trotzdem löschen' : 'Löschen',
    details,
  });
  if (!confirmed) return false;

  const result = await store.remove(entityKey, id, { cascade: true });
  if (!result.ok) {
    toast(result.errors?._ || 'Löschen nicht möglich.', 'danger');
    return false;
  }
  toast(`${def.singular} „${name}" gelöscht.`);
  if (onDeleted) onDeleted();
  return true;
}
