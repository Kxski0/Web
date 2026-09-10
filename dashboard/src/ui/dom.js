/**
 * Winziger DOM-Helfer.
 *
 * Bewusst kein Framework: die App muss auf einem iPad sofort starten, ohne
 * Bundle-Overhead, und in ein Wix Custom Element passen. `h()` erzeugt echte
 * DOM-Knoten – dadurch gibt es kein Virtual-DOM-Diffing, keinen Hydrations-
 * schritt und keine Bibliothek, die veralten kann.
 *
 * Text wird ausschließlich über `textContent` gesetzt. Es gibt in der gesamten
 * App kein `innerHTML` mit Nutzerdaten, damit gespeicherte Notizen kein
 * HTML einschleusen können.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

function applyChild(node, child) {
  if (child === null || child === undefined || child === false || child === true) return;
  if (Array.isArray(child)) {
    for (const c of child) applyChild(node, c);
    return;
  }
  if (child instanceof Node) {
    node.appendChild(child);
    return;
  }
  node.appendChild(document.createTextNode(String(child)));
}

function applyProps(node, props) {
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;

    if (key === 'class' || key === 'className') {
      const cls = Array.isArray(value) ? value.filter(Boolean).join(' ') : String(value);
      if (cls) node.setAttribute('class', cls);
    } else if (key === 'style' && typeof value === 'object') {
      for (const [prop, v] of Object.entries(value)) {
        if (v !== null && v !== undefined) node.style.setProperty(prop, String(v));
      }
    } else if (key === 'dataset') {
      for (const [k, v] of Object.entries(value)) node.dataset[k] = String(v);
    } else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'ref' && typeof value === 'function') {
      value(node);
    } else if (key === 'html') {
      // Nur für selbst erzeugtes Markup (Icons). Nie mit Nutzerdaten aufrufen.
      node.innerHTML = String(value);
    } else if (key === 'value' && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.tagName === 'SELECT')) {
      node.value = value === true ? '' : String(value);
    } else if (key === 'checked' || key === 'disabled' || key === 'selected' || key === 'open') {
      node[key] = Boolean(value);
      if (value) node.setAttribute(key, '');
    } else {
      node.setAttribute(key, value === true ? '' : String(value));
    }
  }
}

/** `h('div.card', { onClick }, 'Text')` – Tag mit optionalen `.klassen`. */
export function h(spec, props, ...children) {
  const [tag, ...classes] = String(spec).split('.');
  const node = document.createElement(tag || 'div');
  if (classes.length) node.setAttribute('class', classes.join(' '));

  if (props && typeof props === 'object' && !(props instanceof Node) && !Array.isArray(props)) {
    const existing = node.getAttribute('class');
    applyProps(node, props);
    // Klassen aus Tag-Kurzschreibweise und aus props zusammenführen.
    if (existing && (props.class || props.className)) node.setAttribute('class', `${existing} ${node.getAttribute('class')}`.trim());
    applyChild(node, children);
  } else {
    applyChild(node, [props, ...children]);
  }
  return node;
}

/** SVG-Variante von `h` – Namensraum ist bei SVG zwingend. */
export function svg(spec, props, ...children) {
  const [tag, ...classes] = String(spec).split('.');
  const node = document.createElementNS(SVG_NS, tag);
  if (classes.length) node.setAttribute('class', classes.join(' '));
  if (props && typeof props === 'object' && !(props instanceof Node) && !Array.isArray(props)) {
    for (const [k, v] of Object.entries(props)) {
      if (v === null || v === undefined || v === false) continue;
      if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, String(v));
    }
    applyChild(node, children);
  } else {
    applyChild(node, [props, ...children]);
  }
  return node;
}

export function clear(node) {
  while (node && node.firstChild) node.removeChild(node.firstChild);
  return node;
}

/** Inhalt eines Containers ersetzen, ohne den Container selbst auszutauschen. */
export function mount(container, ...children) {
  clear(container);
  applyChild(container, children);
  return container;
}

/** Sicherer externer Link – öffnet in neuem Tab, ohne Zugriff auf `window.opener`. */
export function externalLink(href, label, props = {}) {
  return h('a', {
    href,
    target: '_blank',
    rel: 'noopener noreferrer nofollow',
    ...props,
  }, label);
}

/** Delegiertes Event-Handling für lange Listen. */
export function delegate(root, selector, event, handler) {
  root.addEventListener(event, (e) => {
    const match = e.target instanceof Element ? e.target.closest(selector) : null;
    if (match && root.contains(match)) handler(e, match);
  });
  return root;
}
