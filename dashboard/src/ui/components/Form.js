/**
 * Formulare aus der Schema-Definition.
 *
 * Jede Entität bekommt ihr Formular hier erzeugt – Felder, Typen, Pflicht-
 * angaben und Auswahllisten stehen im Schema. Neue Felder brauchen deshalb
 * keine UI-Änderung, und Frontend-Validierung kann nicht von der Backend-
 * Validierung abweichen (beide nutzen `core/validate.js`).
 */
import { h, mount } from '../dom.js';
import { icon } from '../icons.js';
import { Button } from './basics.js';
import { entity } from '../../data/schema.js';
import { normalizeRecord } from '../../core/validate.js';
import { sortBy } from '../../core/util.js';

/** Maximale Größe eingebetteter Bilder/Dateien (Base64 bläht ~33 % auf). */
const MAX_FILE_BYTES = 1_500_000;

function fieldId(prefix, name) {
  return `${prefix}-${name}`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`„${file.name}" konnte nicht gelesen werden.`));
    reader.readAsDataURL(file);
  });
}

/**
 * Baut ein Formular.
 *
 * @param {object} options
 * @param {string} options.entityKey
 * @param {object} options.record       Startwerte (leerer Datensatz bei "Neu")
 * @param {object} options.store        für Referenzlisten
 * @param {(values)=>Promise<{ok:boolean,errors?:object}>} options.onSubmit
 * @param {()=>void} options.onCancel
 * @param {string[]} [options.only]     Nur diese Felder zeigen
 * @param {object}  [options.lock]      Feste Werte, die nicht bearbeitbar sind
 */
export function buildForm(options) {
  const {
    entityKey, record, store, onSubmit, onCancel, only = null, lock = {},
    submitLabel = 'Speichern',
  } = options;

  const def = entity(entityKey);
  const fields = def.fields.filter((f) => (!only || only.includes(f.name)) && !(f.name in lock));
  const prefix = `f-${entityKey}-${Math.random().toString(36).slice(2, 7)}`;

  /** Aktueller Formularzustand – Quelle für Abhängigkeiten zwischen Feldern. */
  const values = { ...record };
  const controls = new Map();
  const errorNodes = new Map();
  // Die Schaltflaechen liegen in der Fusszeile des Dialogs, also ausserhalb des
  // <form>. Ueber das form-Attribut bleiben sie trotzdem mit ihm verbunden -
  // dadurch loest auch Enter im Textfeld dasselbe Absenden aus wie der Klick.
  const form = h('form.form', { id: prefix, novalidate: 'novalidate' });
  const formError = h('div.form-error-summary', { hidden: true, role: 'alert' });
  form.appendChild(formError);

  const grid = h('div.form-grid');
  form.appendChild(grid);

  /* ------------------------------------------------------- Feldaufbau -- */

  function refOptions(f) {
    let list = store.all(f.ref);
    // Abhängige Auswahl: Aufträge nur vom gewählten Kunden.
    if (f.filterBy && values[f.filterBy]) {
      list = list.filter((r) => r[f.filterBy] === values[f.filterBy]);
    }
    return sortBy(list.map((r) => ({ value: r._id, label: store.titleOf(f.ref, r) })), (o) => o.label, 1);
  }

  function makeControl(f) {
    const id = fieldId(prefix, f.name);
    const common = {
      id,
      name: f.name,
      'aria-describedby': `${id}-err`,
      onInput: (e) => {
        values[f.name] = e.target.value;
        clearError(f.name);
      },
      onChange: (e) => {
        values[f.name] = e.target.value;
        clearError(f.name);
        if (f.type === 'ref' || f.type === 'select') refreshDependents(f.name);
      },
    };

    switch (f.type) {
      case 'textarea':
        return h('textarea.input.input-area', { ...common, rows: f.rows || 4, maxlength: f.maxLength || 4000 },
          values[f.name] ?? '');

      case 'date':
        return h('input.input', { ...common, type: 'date', value: values[f.name] ?? '' });

      case 'money':
      case 'number':
        return h('input.input', {
          ...common,
          type: 'text',
          inputmode: 'decimal',
          autocomplete: 'off',
          placeholder: f.type === 'money' ? '0,00' : '0',
          value: values[f.name] === null || values[f.name] === undefined ? '' : String(values[f.name]).replace('.', ','),
        });

      case 'select': {
        const sel = h('select.input.input-select', common,
          ...(f.required ? [] : [h('option', { value: '' }, '— keine Angabe —')]),
          ...f.options.map((o) => h('option', { value: o.value }, o.label)));
        sel.value = values[f.name] ?? '';
        return sel;
      }

      case 'ref': {
        const sel = h('select.input.input-select', common,
          h('option', { value: '' }, f.required ? '— bitte wählen —' : '— keine Zuordnung —'),
          ...refOptions(f).map((o) => h('option', { value: o.value }, o.label)));
        sel.value = values[f.name] ?? '';
        return sel;
      }

      case 'tags':
        return h('input.input', {
          ...common,
          type: 'text',
          autocomplete: 'off',
          placeholder: 'Mit Komma trennen',
          value: Array.isArray(values[f.name]) ? values[f.name].join(', ') : (values[f.name] ?? ''),
        });

      case 'url':
        return h('input.input', {
          ...common, type: 'url', inputmode: 'url', autocapitalize: 'off', autocorrect: 'off',
          placeholder: 'https://…', value: values[f.name] ?? '',
        });

      case 'image':
        return imageControl(f, common);

      case 'files':
        return filesControl(f);

      default:
        return h('input.input', {
          ...common,
          type: f.format === 'email' ? 'email' : 'text',
          inputmode: f.format === 'email' ? 'email' : undefined,
          autocapitalize: f.format === 'email' ? 'off' : undefined,
          maxlength: f.maxLength || 200,
          value: values[f.name] ?? '',
        });
    }
  }

  /** Bild: URL eintippen oder Datei wählen; beides landet im selben Feld. */
  function imageControl(f, common) {
    const wrap = h('div.image-field');
    const preview = h('div.image-preview');

    const urlInput = h('input.input', {
      ...common,
      type: 'text',
      inputmode: 'url',
      autocapitalize: 'off',
      placeholder: 'https://… oder Datei wählen',
      value: String(values[f.name] ?? '').startsWith('data:') ? '' : (values[f.name] ?? ''),
      onInput: (e) => {
        values[f.name] = e.target.value;
        clearError(f.name);
        renderPreview();
      },
    });

    const fileInput = h('input', {
      type: 'file',
      accept: 'image/*',
      class: 'sr-only',
      id: `${fieldId(prefix, f.name)}-file`,
      onChange: async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        if (file.size > MAX_FILE_BYTES) {
          showError(f.name, 'Das Bild ist größer als 1,5 MB. Bitte kleiner speichern oder eine Bild-URL verwenden.');
          return;
        }
        try {
          values[f.name] = await readFileAsDataUrl(file);
          urlInput.value = '';
          clearError(f.name);
          renderPreview();
        } catch (err) {
          showError(f.name, err.message);
        }
      },
    });

    function renderPreview() {
      const value = String(values[f.name] ?? '');
      if (!value) {
        mount(preview, h('span.muted', null, 'Keine Vorschau'));
        return;
      }
      const img = h('img.image-preview-img', { src: value, alt: '', loading: 'lazy' });
      img.addEventListener('error', () => mount(preview, h('span.muted', null, 'Bild nicht ladbar')));
      mount(preview, img);
    }
    renderPreview();

    wrap.append(
      urlInput,
      h('div.image-field-actions', null,
        h('label.btn.btn-secondary.btn-sm', { for: `${fieldId(prefix, f.name)}-file` },
          icon('upload', { size: 16 }), h('span', null, 'Datei wählen')),
        Button('Entfernen', {
          variant: 'ghost', size: 'sm', iconName: 'trash',
          onClick: () => { values[f.name] = ''; urlInput.value = ''; renderPreview(); },
        })),
      fileInput,
      preview,
    );
    return wrap;
  }

  /** Dateianhänge – bewusst klein gehalten und mit deutlichem Hinweis. */
  function filesControl(f) {
    const wrap = h('div.files-field');
    const list = h('ul.files-list');

    function renderList() {
      const files = Array.isArray(values[f.name]) ? values[f.name] : [];
      mount(list, ...(files.length
        ? files.map((file, i) => h('li.files-item', null,
          icon('folder', { size: 16 }),
          h('span.files-name', null, file.name),
          h('span.muted', null, `${Math.round((file.size || 0) / 1024)} KB`),
          Button('Entfernen', {
            variant: 'ghost-danger', size: 'sm', iconName: 'trash', iconOnly: true,
            onClick: () => { values[f.name] = files.filter((_, j) => j !== i); renderList(); },
          })))
        : [h('li.muted', null, 'Keine Dateien')]));
    }
    renderList();

    const input = h('input', {
      type: 'file',
      multiple: true,
      class: 'sr-only',
      id: `${fieldId(prefix, f.name)}-file`,
      onChange: async (e) => {
        const picked = [...(e.target.files || [])];
        e.target.value = '';
        const current = Array.isArray(values[f.name]) ? [...values[f.name]] : [];
        for (const file of picked) {
          if (file.size > MAX_FILE_BYTES) {
            showError(f.name, `„${file.name}" ist größer als 1,5 MB. Bitte stattdessen einen Link hinterlegen.`);
            continue;
          }
          try {
            current.push({ name: file.name, size: file.size, data: await readFileAsDataUrl(file) });
          } catch (err) {
            showError(f.name, err.message);
          }
        }
        values[f.name] = current;
        renderList();
      },
    });

    wrap.append(
      h('label.btn.btn-secondary.btn-sm', { for: `${fieldId(prefix, f.name)}-file` },
        icon('upload', { size: 16 }), h('span', null, 'Dateien wählen')),
      input,
      list,
    );
    return wrap;
  }

  /** Auswahllisten neu füllen, wenn das übergeordnete Feld sich ändert. */
  function refreshDependents(changedName) {
    for (const f of fields) {
      if (f.type !== 'ref' || f.filterBy !== changedName) continue;
      const sel = controls.get(f.name);
      if (!sel) continue;
      const previous = sel.value;
      mount(sel,
        h('option', { value: '' }, f.required ? '— bitte wählen —' : '— keine Zuordnung —'),
        ...refOptions(f).map((o) => h('option', { value: o.value }, o.label)));
      const stillValid = [...sel.options].some((o) => o.value === previous);
      sel.value = stillValid ? previous : '';
      values[f.name] = sel.value;
    }
  }

  /* --------------------------------------------------------- Aufbau -- */

  for (const f of fields) {
    const id = fieldId(prefix, f.name);
    const control = makeControl(f);
    controls.set(f.name, control.matches?.('input, select, textarea') ? control : control.querySelector('input, select, textarea') || control);
    if (f.type === 'ref' || f.type === 'select') controls.set(f.name, control);

    const err = h('p.field-error', { id: `${id}-err`, hidden: true });
    errorNodes.set(f.name, err);

    grid.appendChild(h('div', { class: `field field-${f.width || 'full'}` },
      h('label.field-label', { for: id },
        f.label,
        f.required ? h('span.field-req', { 'aria-hidden': 'true' }, '*') : null),
      control,
      f.hint ? h('p.field-hint', null, f.hint) : null,
      err));
  }

  /* ------------------------------------------------------- Validierung -- */

  function clearError(name) {
    const node = errorNodes.get(name);
    if (node) {
      node.hidden = true;
      node.textContent = '';
    }
    const control = controls.get(name);
    if (control && control.setAttribute) control.removeAttribute('aria-invalid');
  }

  function showError(name, message) {
    const node = errorNodes.get(name);
    if (node) {
      node.textContent = message;
      node.hidden = false;
    }
    const control = controls.get(name);
    if (control && control.setAttribute) control.setAttribute('aria-invalid', 'true');
  }

  function showErrors(errors) {
    for (const name of errorNodes.keys()) clearError(name);
    formError.hidden = true;
    formError.textContent = '';

    const general = [];
    let firstField = null;
    for (const [name, message] of Object.entries(errors || {})) {
      if (errorNodes.has(name)) {
        showError(name, message);
        if (!firstField) firstField = name;
      } else {
        general.push(message);
      }
    }
    if (general.length) {
      formError.textContent = general.join(' ');
      formError.hidden = false;
    }
    const target = firstField ? controls.get(firstField) : null;
    if (target && target.focus) target.focus({ preventScroll: false });
    else if (!firstField) formError.scrollIntoView?.({ block: 'nearest' });
  }

  /** Aktuelle Eingaben als normalisierter Datensatz. */
  function readValues() {
    return normalizeRecord(entityKey, { ...record, ...values, ...lock });
  }

  const submitBtn = Button(submitLabel, { variant: 'primary', type: 'submit' });
  submitBtn.setAttribute('form', prefix);
  let busy = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    busy = true;
    submitBtn.disabled = true;
    try {
      const result = await onSubmit(readValues());
      if (result && result.ok === false) showErrors(result.errors || { _: 'Speichern nicht möglich.' });
    } catch (err) {
      showErrors({ _: err?.message || 'Unerwarteter Fehler beim Speichern.' });
    } finally {
      busy = false;
      submitBtn.disabled = false;
    }
  });

  const footer = [
    Button('Abbrechen', { variant: 'secondary', onClick: onCancel }),
    submitBtn,
  ];

  return { form, footer, readValues, showErrors, values };
}
