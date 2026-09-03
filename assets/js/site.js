/**
 * Keine Bibliotheken. Ein IntersectionObserver fuer alle Reveals,
 * ein zweiter fuer die Abschnittsanzeige, dazu die Bildansicht.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ── Reveals ─────────────────────────────────────────────────────────────
   Ein einziger Observer fuer beide Muster. Nach dem ersten Ausloesen
   wird das Element abgemeldet — die Bewegung soll sich nicht wiederholen. */
const revealTargets = document.querySelectorAll('[data-reveal], [data-rise]');

if ('IntersectionObserver' in window) {
  const revealer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
  );
  for (const el of revealTargets) revealer.observe(el);
} else {
  for (const el of revealTargets) el.classList.add('is-revealed');
}

/* ── Hero: Woerter steigen aus ihren Masken auf ───────────────────────────
   Einmalig beim Laden. Die Auszeichnung im Markup bleibt erhalten, weil
   nur Textknoten ersetzt werden — das ausgerueckte Wort behaelt seine Klasse. */
function splitIntoWords(root) {
  const words = [];

  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (!child.textContent.trim()) continue;
        const fragment = document.createDocumentFragment();
        for (const part of child.textContent.split(/(\s+)/)) {
          if (part === '') continue;
          if (!part.trim()) {
            fragment.append(part);
            continue;
          }
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const inner = document.createElement('span');
          inner.textContent = part;
          mask.append(inner);
          fragment.append(mask);
          words.push(inner);
        }
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    }
  };

  walk(root);
  return words;
}

const heroTitle = document.querySelector('[data-split]');
if (heroTitle) {
  const words = splitIntoWords(heroTitle);
  words.forEach((word, i) => {
    word.style.setProperty('--word-delay', `${Math.min(i * 40, 520)}ms`);
  });
  // Zwei Frames warten, damit der Startzustand einmal gerendert wurde.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => heroTitle.classList.add('is-lit'));
  });
}

/* ── Abschnittsanzeige ───────────────────────────────────────────────────
   Der Rahmen wird auf einen schmalen Streifen um die Bildschirmmitte
   zusammengezogen: es kann nur ein Abschnitt gleichzeitig treffen. */
const railLinks = [...document.querySelectorAll('.rail a, .rail-mobile a')];
const sections = ['top', 'atelier', 'studio', 'prozess', 'kontakt']
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function markCurrent(id) {
  for (const link of railLinks) {
    const active = link.getAttribute('href') === `#${id}`;
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
}

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) markCurrent(entry.target.id);
      }
    },
    { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
  );
  for (const section of sections) spy.observe(section);
  markCurrent('top');
}

/* ── Bildansicht ─────────────────────────────────────────────────────────
   <dialog> uebernimmt Fokusfalle, Escape und die Rueckgabe des Fokus. */
const dialog = document.getElementById('lightbox');
const dialogImg = document.getElementById('lightbox-img');
const dialogCaption = document.getElementById('lightbox-caption');
const dialogClose = document.getElementById('lightbox-close');

/** Groesste Quelle aus einem srcset ziehen, statt Dateinamen zu raten. */
function largestSource(srcset) {
  return srcset
    .split(',')
    .map((item) => item.trim().split(/\s+/))
    .map(([url, descriptor]) => ({ url, width: parseInt(descriptor, 10) || 0 }))
    .sort((a, b) => b.width - a.width)[0];
}

if (dialog && dialogImg) {
  let opener = null;

  const fill = (button) => {
    const img = button.querySelector('img');
    const caption = button.querySelector('figcaption');
    const best = largestSource(img.getAttribute('srcset') || `${img.src} 1x`);

    dialogImg.src = best.url;
    dialogImg.alt = img.alt;
    dialogImg.width = img.width;
    dialogImg.height = img.height;
    dialogCaption.textContent = caption ? caption.textContent.trim() : '';
  };

  for (const button of document.querySelectorAll('[data-plate]')) {
    button.addEventListener('click', () => {
      opener = button;
      const source = button.querySelector('img');

      const swap = () => {
        fill(button);
        dialog.showModal();
      };

      if (document.startViewTransition && !reduced.matches) {
        // Der Name darf nie doppelt im Baum stehen: erst am Ursprung
        // setzen, im Wechsel abnehmen und am Ziel vergeben.
        source.style.viewTransitionName = 'plate';
        const transition = document.startViewTransition(() => {
          source.style.viewTransitionName = '';
          swap();
          dialogImg.style.viewTransitionName = 'plate';
        });
        transition.finished.finally(() => {
          dialogImg.style.viewTransitionName = '';
        });
      } else {
        swap();
      }
    });
  }

  const close = () => {
    if (dialog.open) dialog.close();
  };

  dialogClose?.addEventListener('click', close);

  // Klick auf den Hintergrund schliesst — der Dialog selbst ist das Ziel,
  // sobald ausserhalb des Inhalts geklickt wird.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener('close', () => {
    dialogImg.removeAttribute('src');
    opener?.focus();
    opener = null;
  });
}

/* ── Jahreszahl im Impressumsstreifen ────────────────────────────────── */
const yearSlot = document.getElementById('jahr');
if (yearSlot) yearSlot.textContent = String(new Date().getFullYear());
