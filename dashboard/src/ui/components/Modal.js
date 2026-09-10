/**
 * Modal, Bestätigungsdialog und Kurzmeldungen (Toast).
 *
 * Das Modal ist ein einfacher Overlay-Container statt `<dialog>`: `<dialog>`
 * verhält sich in älteren iPad-Safari-Versionen uneinheitlich, und in einem Wix
 * Custom Element kann die Top-Layer-Darstellung mit dem Editor kollidieren.
 * Fokusfalle, Escape und Scroll-Sperre sind deshalb hier ausgeschrieben.
 */
import { h, mount } from '../dom.js';
import { overlayRoot, setScrollLock } from '../overlay.js';
import { icon } from '../icons.js';
import { Button } from './basics.js';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let openCount = 0;

/**
 * @param {object} options
 * @param {string} options.title
 * @param {Node|Node[]} options.content
 * @param {Node[]} [options.footer]
 * @param {'md'|'lg'} [options.size]
 * @param {()=>void} [options.onClose]
 * @returns {{ el: HTMLElement, close: ()=>void }}
 */
export function openModal(options = {}) {
  const { title, content, footer, size = 'md', onClose, dismissable = true } = options;

  const previouslyFocused = document.activeElement;
  const body = h('div.modal-body');
  mount(body, ...[].concat(content).filter(Boolean));

  const closeBtn = Button('Schließen', {
    iconName: 'close', iconOnly: true, variant: 'ghost', onClick: () => close(),
  });

  const panel = h('div', {
    class: `modal modal-${size}`,
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': title || 'Dialog',
  },
  h('header.modal-head', null,
    h('h2.modal-title', null, title || ''),
    dismissable ? closeBtn : null),
  body,
  footer ? h('footer.modal-foot', null, ...[].concat(footer).filter(Boolean)) : null);

  const overlay = h('div.modal-overlay', {
    onClick: (e) => {
      if (dismissable && e.target === overlay) close();
    },
  }, panel);

  function onKeydown(e) {
    if (e.key === 'Escape' && dismissable) {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    // Fokus im Dialog halten.
    const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKeydown, true);
    overlay.remove();
    openCount = Math.max(0, openCount - 1);
    if (openCount === 0) setScrollLock(false);
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
    if (onClose) onClose();
  }

  document.addEventListener('keydown', onKeydown, true);
  overlayRoot().appendChild(overlay);
  openCount += 1;
  setScrollLock(true);

  // Erstes sinnvolles Element fokussieren, aber ohne die Tastatur auf dem iPad
  // ungefragt aufzuklappen: Textfelder werden übersprungen.
  const target = panel.querySelector('select, button.btn-primary') || panel.querySelector(FOCUSABLE);
  if (target) target.focus({ preventScroll: true });

  return { el: panel, body, close };
}

/**
 * Bestätigung vor destruktiven Aktionen.
 * @returns {Promise<boolean>}
 */
export function confirmDialog(options = {}) {
  const {
    title = 'Wirklich löschen?',
    text = 'Diese Aktion lässt sich nicht rückgängig machen.',
    confirmLabel = 'Löschen',
    cancelLabel = 'Abbrechen',
    tone = 'danger',
    details = null,
  } = options;

  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      modal.close();
      resolve(value);
    };

    const modal = openModal({
      title,
      size: 'md',
      onClose: () => finish(false),
      content: [
        h('p.modal-text', null, text),
        details || null,
      ],
      footer: [
        Button(cancelLabel, { variant: 'secondary', onClick: () => finish(false) }),
        Button(confirmLabel, { variant: tone === 'danger' ? 'danger' : 'primary', onClick: () => finish(true) }),
      ],
    });
  });
}

/* --------------------------------------------------------------- Toast -- */

let toastHost = null;

function ensureToastHost() {
  const host = overlayRoot();
  if (toastHost && host.contains(toastHost)) return toastHost;
  toastHost = h('div.toast-host', { role: 'status', 'aria-live': 'polite' });
  host.appendChild(toastHost);
  return toastHost;
}

/**
 * Kurzmeldung. Fehler bleiben länger stehen und lassen sich manuell schließen –
 * eine Fehlermeldung, die nach zwei Sekunden verschwindet, ist keine.
 */
export function toast(message, tone = 'success', options = {}) {
  const host = ensureToastHost();
  const duration = options.duration ?? (tone === 'danger' ? 9000 : 3500);

  const el = h('div', { class: `toast tone-${tone}` },
    icon(tone === 'danger' ? 'warning' : tone === 'warn' ? 'warning' : 'check', { size: 18 }),
    h('span.toast-text', null, message),
    h('button.toast-close', { type: 'button', 'aria-label': 'Meldung schließen', onClick: () => el.remove() },
      icon('close', { size: 16 })));

  host.appendChild(el);
  if (duration > 0) setTimeout(() => el.remove(), duration);
  return el;
}
