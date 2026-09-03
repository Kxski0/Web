/**
 * Keine Bibliotheken. Vier Aufgaben:
 *   1. Reveals beim Scrollen
 *   2. Wortlauf in der Hauptüberschrift
 *   3. Navigation: Zustand beim Scrollen, Menü auf kleinen Geräten
 *   4. Choreografie des Markenzeichens
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const wide = window.matchMedia('(min-width: 62rem)');

/* ── 1 Reveals ───────────────────────────────────────────────────────────
   Ein Beobachter für beide Muster, danach abmelden: die Bewegung soll
   sich beim Zurückscrollen nicht wiederholen. */
const revealTargets = document.querySelectorAll('[data-reveal], [data-rise]');

if ('IntersectionObserver' in window) {
  const revealer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      obs.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  for (const el of revealTargets) revealer.observe(el);
} else {
  for (const el of revealTargets) el.classList.add('is-in');
}

/* ── 2 Wortlauf ──────────────────────────────────────────────────────────
   Nur Textknoten werden ersetzt, damit Auszeichnungen im Titel erhalten
   bleiben. */
function splitIntoWords(root) {
  const words = [];
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (!child.textContent.trim()) continue;
        const frag = document.createDocumentFragment();
        for (const part of child.textContent.split(/(\s+)/)) {
          if (part === '') continue;
          if (!part.trim()) { frag.append(part); continue; }
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const inner = document.createElement('span');
          inner.textContent = part;
          mask.append(inner);
          frag.append(mask);
          words.push(inner);
        }
        child.replaceWith(frag);
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
  splitIntoWords(heroTitle).forEach((word, i) => {
    word.style.setProperty('--word-delay', `${Math.min(i * 45, 480)}ms`);
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => heroTitle.classList.add('is-lit'));
  });
}

/* ── 3 Navigation ────────────────────────────────────────────────────── */
const masthead = document.getElementById('masthead');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  const setMenu = (open) => {
    navMenu.dataset.open = String(open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  navToggle.addEventListener('click', () => {
    setMenu(navMenu.dataset.open !== 'true');
  });
  navMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.dataset.open === 'true') {
      setMenu(false);
      navToggle.focus();
    }
  });
  wide.addEventListener('change', (e) => { if (e.matches) setMenu(false); });
}

/* ── 4 Choreografie des Markenzeichens ───────────────────────────────────
   Das Zeichen ist ein Markenelement, kein herumfliegendes Objekt. Es löst
   sich aus der Navigation, wandert durch die ersten Abschnitte, wird über
   der Webdesign-Komposition groß und öffnet dort deren Blende. Danach
   kehrt es zurück und verschwindet.
   Ein fixes Element, ein Zustand pro Bild, ausschließlich transform und
   opacity. Auf schmalen Geräten und bei reduzierter Bewegung findet die
   Reise nicht statt: das Zeichen bleibt schlicht in der Navigation. */
const slot = document.getElementById('brand-slot');
const composition = document.getElementById('composition');
const reveal = composition ? composition.querySelector('.composition-reveal') : null;

function setupFlyer() {
  if (!slot || !composition || !reveal) return null;

  const flyer = document.createElement('div');
  flyer.className = 'flyer';
  flyer.setAttribute('aria-hidden', 'true');
  flyer.innerHTML = slot.innerHTML;
  document.body.append(flyer);
  slot.style.visibility = 'hidden';

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  // Weiche Ein- und Ausblendung der Teilstrecken, damit keine Knicke entstehen.
  const smooth = (t) => t * t * (3 - 2 * t);
  const seg = (t, a, b) => clamp01((t - a) / (b - a));

  let track = 1;
  let frame = 0;

  const measure = () => {
    const rect = composition.getBoundingClientRect();
    const end = rect.bottom + window.scrollY - window.innerHeight * 0.5;
    track = Math.max(end, window.innerHeight);
  };

  const render = () => {
    frame = 0;
    const t = clamp01(window.scrollY / track);

    const slotRect = slot.getBoundingClientRect();
    const compRect = composition.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Ruhelage in der Navigation. Solange sie gilt, sitzt das Zeichen
    // exakt auf seinem Platz und ist von einem statischen nicht zu
    // unterscheiden.
    const home = {
      x: slotRect.left + window.scrollX * 0,
      y: slotRect.top,
      size: slotRect.height,
      opacity: 1,
    };

    let state;

    if (t < 0.06) {
      state = home;
    } else if (t < 0.34) {
      // Löst sich und zieht in die rechte Hälfte des Heros.
      const p = smooth(seg(t, 0.06, 0.34));
      state = {
        x: lerp(home.x, vw * 0.7, p),
        y: lerp(home.y, vh * 0.55, p),
        size: lerp(home.size, 56, p),
        opacity: 1,
      };
    } else if (t < 0.6) {
      // Wandert durch den Abschnitt zum Unterschied.
      const p = smooth(seg(t, 0.34, 0.6));
      state = {
        x: lerp(vw * 0.7, vw * 0.16, p),
        y: lerp(vh * 0.55, vh * 0.3, p),
        size: lerp(56, 96, p),
        opacity: 1,
      };
    } else if (t < 0.86) {
      // Legt sich mittig über die Komposition und öffnet deren Blende.
      const p = smooth(seg(t, 0.6, 0.86));
      const target = Math.min(vw * 0.26, 320);
      const cx = compRect.left + compRect.width / 2;
      const cy = compRect.top + compRect.height / 2;
      const size = lerp(96, target, p);
      state = {
        x: lerp(vw * 0.16, cx - size / 2, p),
        y: lerp(vh * 0.3, cy - size * 0.55, p),
        size,
        opacity: 1,
      };
    } else {
      // Kehrt zurück und verschwindet.
      const p = smooth(seg(t, 0.86, 1));
      const target = Math.min(vw * 0.26, 320);
      const cx = compRect.left + compRect.width / 2;
      const cy = compRect.top + compRect.height / 2;
      state = {
        x: lerp(cx - target / 2, home.x, p),
        y: lerp(cy - target * 0.55, home.y, p),
        size: lerp(target, home.size, p),
        opacity: 1 - p,
      };
    }

    // Die Blende folgt dem Wachstum des Zeichens: es hat hier eine
    // Aufgabe und ist nicht bloß Dekoration.
    const aperture = smooth(seg(t, 0.6, 0.84));
    reveal.style.clipPath = `inset(${(1 - aperture) * 50}% 0)`;

    flyer.style.width = `${state.size}px`;
    flyer.style.height = `${state.size * (128 / 116)}px`;
    flyer.style.opacity = state.opacity.toFixed(3);
    flyer.style.transform =
      `translate3d(${Math.round(state.x)}px, ${Math.round(state.y)}px, 0)`;

    // Sobald das Zeichen ganz zu Hause ist, übernimmt wieder das statische.
    const parked = t < 0.06 || state.opacity < 0.02;
    slot.style.visibility = parked ? 'visible' : 'hidden';
    flyer.style.visibility = parked && t >= 0.06 ? 'hidden' : 'visible';
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  measure();
  render();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); onScroll(); }, { passive: true });

  return {
    destroy() {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      flyer.remove();
      slot.style.visibility = '';
      reveal.style.clipPath = '';
    },
  };
}

let flight = null;

function syncFlight() {
  const shouldFly = wide.matches && !reduced.matches;
  if (shouldFly && !flight) flight = setupFlyer();
  else if (!shouldFly && flight) { flight.destroy(); flight = null; }
}

syncFlight();
wide.addEventListener('change', syncFlight);
reduced.addEventListener('change', syncFlight);

/* Zustand der Kopfzeile beim Scrollen. */
if (masthead) {
  let ticking = 0;
  const update = () => {
    ticking = 0;
    masthead.dataset.scrolled = String(window.scrollY > 24);
  };
  update();
  window.addEventListener('scroll', () => {
    if (!ticking) ticking = requestAnimationFrame(update);
  }, { passive: true });
}

/* Jahreszahl im Fuß. */
const yearSlot = document.getElementById('jahr');
if (yearSlot) yearSlot.textContent = String(new Date().getFullYear());
