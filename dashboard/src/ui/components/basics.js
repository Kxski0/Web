/**
 * Kleine, überall wiederverwendete Bausteine:
 * Button, Card, StatCard, StatusBadge, EmptyState, Spinner, Kopfzeile.
 */
import { h, externalLink } from '../dom.js';
import { icon } from '../icons.js';
import { formatMoney, formatNumber } from '../../core/format.js';

/**
 * Button.
 * Touch-Ziele sind über CSS mindestens 44px hoch – auf dem iPad ist das die
 * Grenze, unter der Treffer unzuverlässig werden.
 */
export function Button(label, options = {}) {
  const {
    variant = 'secondary', iconName = null, onClick, type = 'button',
    disabled = false, title = null, size = 'md', full = false, iconOnly = false,
  } = options;

  const el = h('button', {
    type,
    class: ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : null, full ? 'btn-full' : null, iconOnly ? 'btn-icon' : null]
      .filter(Boolean)
      .join(' '),
    disabled,
    title: title || (iconOnly ? label : null),
    'aria-label': iconOnly ? label : null,
    onClick: onClick || undefined,
  });
  if (iconName) el.appendChild(icon(iconName, { size: size === 'sm' ? 16 : 18 }));
  if (!iconOnly) el.appendChild(h('span', null, label));
  return el;
}

/** Karte mit optionaler Kopfzeile und Aktionen. */
export function Card(options = {}) {
  const { title, subtitle, actions, children, padded = true, className = '' } = options;
  const body = h('div', { class: padded ? 'card-body' : 'card-body card-body-flush' });
  if (children) body.append(...[].concat(children).filter(Boolean));

  const card = h('section', { class: `card ${className}`.trim() });
  if (title || actions) {
    card.appendChild(
      h('header.card-head', null,
        h('div.card-head-text', null,
          h('h2.card-title', null, title || ''),
          subtitle ? h('p.card-sub', null, subtitle) : null),
        actions ? h('div.card-actions', null, ...[].concat(actions).filter(Boolean)) : null),
    );
  }
  card.appendChild(body);
  return card;
}

/**
 * Kennzahlkachel.
 * `tone` färbt nur den Wert, nicht die ganze Kachel – ein Dashboard aus lauter
 * farbigen Flächen ist schlechter lesbar als eines mit einem farbigen Akzent.
 */
export function StatCard(options = {}) {
  const {
    label, value, hint, tone = 'neutral', format = 'number', onClick, iconName, delta,
  } = options;

  const text = format === 'money' ? formatMoney(value)
    : format === 'raw' ? String(value)
      : formatNumber(value);

  const inner = [
    h('div.stat-top', null,
      h('span.stat-label', null, label),
      iconName ? icon(iconName, { size: 18, class: 'icon stat-icon' }) : null),
    h('div', { class: `stat-value tone-${tone}` }, text),
    hint ? h('p.stat-hint', null, hint) : null,
    delta ? h('p', { class: `stat-delta ${delta.direction}` }, delta.text) : null,
  ].filter(Boolean);

  if (onClick) {
    return h('button.stat.stat-link', { type: 'button', onClick }, ...inner);
  }
  return h('div.stat', null, ...inner);
}

/** Statusfarbe als Pille. Unbekannte Werte bleiben sichtbar statt zu verschwinden. */
export function StatusBadge(label, tone = 'neutral', options = {}) {
  return h('span', {
    class: `badge tone-${tone} ${options.className || ''}`.trim(),
    title: options.title || null,
  }, label || '—');
}

export function EmptyState(options = {}) {
  const { title = 'Noch keine Einträge', text, action } = options;
  return h('div.empty', null,
    icon(options.iconName || 'folder', { size: 32, class: 'icon empty-icon' }),
    h('p.empty-title', null, title),
    text ? h('p.empty-text', null, text) : null,
    action || null);
}

export function Spinner(label = 'Wird geladen …') {
  return h('div.spinner', { role: 'status' },
    h('span.spinner-ring', { 'aria-hidden': 'true' }),
    h('span.spinner-label', null, label));
}

/** Seitenkopf mit Titel, Zusatzinfo und Aktionen. */
export function PageHeader(options = {}) {
  const { title, subtitle, actions, back } = options;
  return h('header.page-head', null,
    h('div.page-head-text', null,
      back || null,
      h('h1.page-title', null, title),
      subtitle ? h('p.page-sub', null, subtitle) : null),
    actions ? h('div.page-actions', null, ...[].concat(actions).filter(Boolean)) : null);
}

/** Beschriftetes Wertepaar für Detailansichten. */
export function DefItem(label, value, options = {}) {
  const content = value instanceof Node ? value : h('span', null, value || '—');
  return h('div', { class: `def ${options.className || ''}`.trim() },
    h('dt.def-label', null, label),
    h('dd.def-value', null, content));
}

export function DefList(items) {
  return h('dl.def-list', null, ...items.filter(Boolean));
}

/** Externer Link mit Icon – immer neuer Tab, immer `rel=noopener`. */
export function LinkOut(url, label) {
  if (!url) return h('span.muted', null, '—');
  const a = externalLink(url, label || url, { class: 'link-out' });
  a.appendChild(icon('external', { size: 14, class: 'icon link-out-icon' }));
  return a;
}

/** Kleine Meldung über einer Liste (Hinweis, Warnung, Fehler). */
export function Notice(text, tone = 'info', action = null) {
  return h('div', { class: `notice tone-${tone}`, role: tone === 'danger' ? 'alert' : 'status' },
    icon(tone === 'danger' || tone === 'warn' ? 'warning' : 'activity', { size: 18 }),
    h('span.notice-text', null, text),
    action || null);
}

export function TagList(tags, options = {}) {
  const list = (tags || []).filter(Boolean);
  if (!list.length) return options.emptyText ? h('span.muted', null, options.emptyText) : h('span.muted', null, '—');
  return h('div.tag-list', null, ...list.map((t) => (
    options.onClick
      ? h('button.tag.tag-btn', { type: 'button', onClick: () => options.onClick(t) }, t)
      : h('span.tag', null, t)
  )));
}
