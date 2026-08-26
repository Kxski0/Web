/* ==========================================================================
   RuhrCargo GmbH — Interaktion & Motion
   Vanilla JS, keine Abhängigkeiten. Alle Animationen nutzen ausschließlich
   transform/opacity und respektieren prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     KONFIGURATION — hier anpassen
     ------------------------------------------------------------------
     formEndpoint : URL, die das Anfrageformular per POST (JSON) empfängt.
                    Leer lassen = Fallback über das E-Mail-Programm (mailto).
                    Beispiele: Formspree "https://formspree.io/f/xxxxxxx"
                               oder eigenes PHP-Skript "/anfrage.php".
     contactEmail : Empfängeradresse für den mailto-Fallback.
  ------------------------------------------------------------------ */
  var CONFIG = {
    formEndpoint: '',
    contactEmail: 'info@ruhrcargo.de'
  };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ==================================================================
     1 · HERO — Worteinblendung nach dem Laden
     ================================================================== */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('is-ready'); });
  });

  /* ==================================================================
     2 · HEADER — Zustand & Scroll-Fortschritt
     ================================================================== */
  var header = $('#siteHeader');
  var progress = $('#scrollProgress');
  var stepsEl = $('#steps');
  var processFill = $('#processFill');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-stuck', y > 24);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--p', max > 0 ? clamp(y / max, 0, 1) : 0);
    }

    // Prozesslinie füllt sich mit dem Scrollfortschritt der Sektion
    if (stepsEl && processFill && !reduced) {
      var r = stepsEl.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.22), 0, 1);
      processFill.style.setProperty('--p', p);
    }

    ticking = false;
  }

  function requestScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll, { passive: true });
  onScroll();

  /* ==================================================================
     3 · MOBILE NAVIGATION
     ================================================================== */
  var burger = $('#burger');
  var mobileNav = $('#mobileNav');

  function setMenu(open) {
    if (!burger || !mobileNav) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    document.body.classList.toggle('is-locked', open);

    if (open) {
      mobileNav.hidden = false;
      // Reflow erzwingen, damit der Übergang greift
      void mobileNav.offsetWidth;
      mobileNav.classList.add('is-open');
      $$('.mobile-nav__link', mobileNav).forEach(function (link, i) {
        link.style.transitionDelay = (reduced ? 0 : 60 + i * 45) + 'ms';
      });
    } else {
      mobileNav.classList.remove('is-open');
      $$('.mobile-nav__link', mobileNav).forEach(function (link) { link.style.transitionDelay = '0ms'; });
      window.setTimeout(function () {
        if (!mobileNav.classList.contains('is-open')) mobileNav.hidden = true;
      }, reduced ? 0 : 320);
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (mobileNav) {
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger && burger.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      burger.focus();
    }
  });

  /* ==================================================================
     4 · SCROLL-REVEALS
     ================================================================== */
  var revealTargets = $$('[data-reveal],[data-step],[data-reason],[data-fleet]');

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ==================================================================
     5 · ZAHLEN HOCHZÄHLEN
     ================================================================== */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    function paint(value) {
      el.innerHTML = value + (suffix ? '<sup>' + suffix + '</sup>' : '');
    }
    if (reduced) { paint(target); return; }

    var duration = 1200;
    var start = 0;
    function frame(now) {
      if (!start) start = now;
      var t = clamp((now - start) / duration, 0, 1);
      var eased = 1 - Math.pow(1 - t, 4);          // easeOutQuart
      paint(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = $$('[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(countUp);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          countObserver.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ==================================================================
     6 · AKTIVER NAVIGATIONSPUNKT
     ================================================================== */
  var navLinks = $$('.nav__link');
  var sections = navLinks
    .map(function (l) { return document.getElementById(l.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ==================================================================
     7 · KONFIGURATOR — "Was möchten Sie transportieren?"
     ================================================================== */
  var SOLUTIONS = {
    stueckgut: {
      title: 'Stückgut & Paletten',
      text: 'Ob Einzelpalette oder Teilladung: Wir bündeln Ihre Sendungen, planen die Route und liefern deutschlandweit – ohne Umweg über fremde Hubs.',
      facts: ['Von der Einzelpalette bis zur Komplettladung', 'Deutschlandweite Zustellung ab dem Ruhrgebiet', 'Feste Ansprechpartner in der Disposition']
    },
    neumoebel: {
      title: 'Neumöbel-Logistik',
      text: 'Neuware verzeiht keine Kratzer. Wir transportieren Möbel vom Lager oder Hersteller bis zur Wunschadresse – sorgfältig gesichert und sauber zugestellt.',
      facts: ['Möbelkoffer mit großem Ladevolumen', 'Sorgfältige Ladungssicherung ab Werk', 'Zustellung nach Terminabsprache']
    },
    elektro: {
      title: 'Elektrogeräte & weiße Ware',
      text: 'Empfindliche Technik braucht ruhige Hände und die richtige Sicherung. Wir übernehmen Einzelgeräte ebenso wie ganze Lieferungen für den Fachhandel.',
      facts: ['Einzelgerät bis Filialbelieferung', 'Transportsicherung für empfindliche Technik', 'Feste Touren auf Wunsch']
    },
    kurier: {
      title: 'Kurier- & Direktfahrt',
      text: 'Wenn es schnell gehen muss: ein Fahrzeug, eine Ladung, ein Ziel. Ihre Sendung fährt ohne Zwischenstopp und ohne Umladen direkt ans Ziel.',
      facts: ['Direktfahrt ohne Umladung', 'Kurzfristige Beauftragung möglich', 'Auch für eilige Einzelsendungen']
    },
    reifen: {
      title: 'Reifenlogistik',
      text: 'Saisongeschäft heißt: alles gleichzeitig. Wir bewegen Reifen und Räder in Menge – vom Großhandel zum Point of Sale, planbar durch die Hochsaison.',
      facts: ['Große Stückzahlen je Tour', 'Belieferung von Handel und Werkstatt', 'Planbare Kapazitäten in der Saison']
    },
    umzug: {
      title: 'Umzug – privat & gewerblich',
      text: 'Vom Apartment bis zum Firmenstandort: Wir planen den Ablauf, stellen das passende Fahrzeug und bringen Ihren Hausrat oder Ihr Büro ans neue Ziel.',
      facts: ['Private und gewerbliche Umzüge', 'Fahrzeug passend zum Volumen', 'Termin nach Ihrem Zeitplan']
    },
    messe: {
      title: 'Messe- & Ladenbau',
      text: 'Auf dem Messegelände und auf der Baustelle zählt das Zeitfenster. Wir liefern termingenau an – und holen nach dem Abbau wieder ab.',
      facts: ['Termingenaue Anlieferung im Zeitfenster', 'An- und Abtransport aus einer Hand', 'Erfahrung mit Messe- und Baustellenlogistik']
    },
    reha: {
      title: 'Reha-Hilfsmittel',
      text: 'Zustellungen für Sanitätshäuser und Patienten verlangen Fingerspitzengefühl. Wir liefern terminiert, diskret und mit der nötigen Sorgfalt.',
      facts: ['Zustellung an Sanitätshaus oder Patient', 'Feste Terminabsprache', 'Sorgfältiger Umgang mit sensibler Ware']
    },
    sonstiges: {
      title: 'Ihre individuelle Lösung',
      text: 'Ungewöhnliche Maße, besondere Anforderungen oder eine wiederkehrende Tour? Beschreiben Sie uns Ihren Fall – wir sagen Ihnen ehrlich, ob und wie wir ihn fahren.',
      facts: ['Individuelle Transportlösungen', 'Auch für wiederkehrende Touren', 'Ehrliche Einschätzung statt Standardangebot']
    }
  };

  var ORDER = ['stueckgut', 'neumoebel', 'elektro', 'kurier', 'reifen', 'umzug', 'messe', 'reha', 'sonstiges'];
  var chipsWrap = $('#cfgChips');
  var panel = $('#cfgPanel');
  var currentKey = null;

  function renderSolution(key, animate) {
    if (!panel || !SOLUTIONS[key]) return;
    var s = SOLUTIONS[key];
    var index = ORDER.indexOf(key) + 1;

    function paint() {
      panel.innerHTML =
        '<div class="cfg__body">' +
          '<span class="cfg__index">Lösung ' + String(index).padStart(2, '0') + ' / ' + String(ORDER.length).padStart(2, '0') + '</span>' +
          '<h3 class="cfg__title">' + s.title + '</h3>' +
          '<p class="cfg__text">' + s.text + '</p>' +
          '<div class="cfg__actions">' +
            '<button class="btn btn--primary" type="button" data-cfg-go="' + key + '">' +
              'Diese Anfrage starten' +
              '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-arrow"/></svg>' +
            '</button>' +
            '<a class="btn btn--ghost" href="tel:+492010000000">Lieber anrufen</a>' +
          '</div>' +
        '</div>' +
        '<ul class="cfg__facts">' +
          s.facts.map(function (f) {
            return '<li class="cfg__fact">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-check"/></svg>' +
              '<span>' + f + '</span></li>';
          }).join('') +
        '</ul>';
    }

    if (!animate || reduced) { paint(); return; }

    // Crossfade mit leichtem Blur — überbrückt den Sprung zwischen zwei Zuständen
    panel.classList.add('is-swapping');
    window.setTimeout(function () {
      paint();
      requestAnimationFrame(function () { panel.classList.remove('is-swapping'); });
    }, 200);
  }

  function selectSolution(key, animate) {
    if (!SOLUTIONS[key] || key === currentKey) return;
    currentKey = key;
    $$('.chip', chipsWrap).forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('data-key') === key));
    });
    renderSolution(key, animate);
  }

  if (chipsWrap && panel) {
    selectSolution('stueckgut', false);

    chipsWrap.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (chip) selectSolution(chip.getAttribute('data-key'), true);
    });

    // Pfeiltasten-Navigation zwischen den Chips
    chipsWrap.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var chips = $$('.chip', chipsWrap);
      var i = chips.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var next = chips[(i + (e.key === 'ArrowRight' ? 1 : chips.length - 1)) % chips.length];
      next.focus();
      selectSolution(next.getAttribute('data-key'), true);
    });
  }

  /* ==================================================================
     8 · VERKNÜPFUNG Leistung → Konfigurator → Formular
     ================================================================== */
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  $$('.svc[data-service]').forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      selectSolution(card.getAttribute('data-service'), true);
      scrollToId('konfigurator');
    });
  });

  var ladungSelect = $('#f-was');

  document.addEventListener('click', function (e) {
    var go = e.target.closest('[data-cfg-go]');
    if (!go) return;
    var key = go.getAttribute('data-cfg-go');
    if (ladungSelect) ladungSelect.value = key;
    scrollToId('anfrage');
    window.setTimeout(function () {
      var first = $('#f-von');
      if (first && !first.value) first.focus({ preventScroll: true });
    }, reduced ? 0 : 700);
  });

  /* ==================================================================
     9 · ANFRAGEFORMULAR
     ================================================================== */
  var form = $('#anfrageForm');
  var okBox = $('#formOk');
  var errBox = $('#formErr');
  var submitBtn = $('#formSubmit');

  function fieldOf(input) { return input.closest('.field'); }

  function validateField(input) {
    var valid = true;
    if (input.type === 'checkbox') {
      valid = input.checked;
    } else if (input.hasAttribute('required')) {
      valid = input.value.trim().length > 0;
    }
    if (valid && input.type === 'email' && input.value.trim()) {
      valid = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(input.value.trim());
    }
    var wrap = fieldOf(input);
    if (wrap) wrap.setAttribute('data-invalid', String(!valid));
    input.setAttribute('aria-invalid', String(!valid));
    return valid;
  }

  if (form) {
    $$('input, select, textarea', form).forEach(function (input) {
      input.addEventListener('blur', function () {
        if (input.hasAttribute('required')) validateField(input);
      });
      input.addEventListener('input', function () {
        var wrap = fieldOf(input);
        if (wrap && wrap.getAttribute('data-invalid') === 'true') validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      okBox.classList.remove('is-visible');
      errBox.classList.remove('is-visible');

      // Honeypot: nur Bots füllen dieses Feld aus
      if (form.website && form.website.value) return;

      var required = $$('[required]', form);
      var firstBad = null;
      required.forEach(function (input) {
        if (!validateField(input) && !firstBad) firstBad = input;
      });
      if (firstBad) {
        firstBad.focus();
        firstBad.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        return;
      }

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      delete data.website;

      function succeed() {
        okBox.classList.add('is-visible');
        form.reset();
        $$('.field[data-invalid]', form).forEach(function (f) { f.removeAttribute('data-invalid'); });
        okBox.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      }

      // Ohne konfiguriertes Backend: vorbefüllte E-Mail im Mailprogramm öffnen
      if (!CONFIG.formEndpoint) {
        var lines = [
          'Ladung: ' + (data.ladung || ''),
          'Abholung: ' + (data.von || ''),
          'Zustellung: ' + (data.nach || ''),
          'Wunschtermin: ' + (data.termin || 'keine Angabe'),
          '',
          'Name: ' + (data.name || ''),
          'Firma: ' + (data.firma || '-'),
          'E-Mail: ' + (data.email || ''),
          'Telefon: ' + (data.telefon || '-'),
          '',
          'Details:',
          data.nachricht || '-'
        ].join('\n');
        window.location.href = 'mailto:' + CONFIG.contactEmail +
          '?subject=' + encodeURIComponent('Transportanfrage über die Website') +
          '&body=' + encodeURIComponent(lines);
        succeed();
        return;
      }

      submitBtn.setAttribute('data-busy', 'true');
      submitBtn.querySelector('span').textContent = 'Wird gesendet …';

      fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Status ' + res.status);
          succeed();
        })
        .catch(function () {
          errBox.classList.add('is-visible');
        })
        .finally(function () {
          submitBtn.removeAttribute('data-busy');
          submitBtn.querySelector('span').textContent = 'Transport anfragen';
        });
    });
  }

  /* ==================================================================
     10 · KLEINIGKEITEN
     ================================================================== */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
