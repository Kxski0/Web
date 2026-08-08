/* ClearWay Gebäudeservice – Interaktionen
   Alles dependency-frei; Scroll-Logik über IntersectionObserver bzw.
   requestAnimationFrame. prefers-reduced-motion wird respektiert. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: transparent → Glas beim Scrollen ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
  }

  /* ---------- Mobil-Menü ---------- */
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuToggle && mobileMenu) {
    var closeMenu = function () {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
      document.body.style.overflow = '';
    };
    menuToggle.addEventListener('click', function () {
      var open = menuToggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMenu();
      } else {
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.hidden = false;
        document.body.style.overflow = 'hidden';
        if (header) { header.classList.add('is-scrolled'); }
      }
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) { closeMenu(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileMenu.hidden) {
        closeMenu();
        menuToggle.focus();
      }
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  var mobileSubToggle = document.querySelector('[data-mobile-sub-toggle]');
  if (mobileSubToggle) {
    mobileSubToggle.addEventListener('click', function () {
      var open = mobileSubToggle.getAttribute('aria-expanded') === 'true';
      mobileSubToggle.setAttribute('aria-expanded', String(!open));
    });
  }

  /* ---------- Desktop-Dropdown (Klick/Touch/Tastatur zusätzlich zu Hover) ---------- */
  var dropdownToggle = document.querySelector('[data-dropdown-toggle]');
  if (dropdownToggle) {
    var ddParent = dropdownToggle.closest('.has-dropdown');
    dropdownToggle.addEventListener('click', function () {
      var open = ddParent.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!ddParent.contains(e.target)) {
        ddParent.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        ddParent.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Scroll-Reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---------- Wisch-/Schmutz-Reveals (Fenster, Hochdruck) ---------- */
  var wipeEls = document.querySelectorAll('.wipe-glass, .dirt-reveal, .frost-text');
  if (wipeEls.length && 'IntersectionObserver' in window && !reducedMotion) {
    var wipeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          wipeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    wipeEls.forEach(function (el) { wipeObserver.observe(el); });
  } else {
    wipeEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---------- „Klar werden“-Karten (Warum ClearWay) ---------- */
  var clarityCards = document.querySelectorAll('.clarity-card');
  if (clarityCards.length && 'IntersectionObserver' in window && !reducedMotion) {
    var clarityObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-clear');
          clarityObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });
    clarityCards.forEach(function (card, i) {
      card.style.setProperty('--wipe-delay', (i % 3) * 0.16 + 's');
      clarityObserver.observe(card);
    });
  } else {
    clarityCards.forEach(function (card) { card.classList.add('is-clear'); });
  }

  /* ---------- Prozesslinie ---------- */
  var processTrack = document.querySelector('[data-process]');
  if (processTrack) {
    var steps = processTrack.querySelectorAll('.process-step');
    var lineFill = processTrack.querySelector('.process-line-fill');
    if (reducedMotion) {
      steps.forEach(function (s) { s.classList.add('is-active'); });
      if (lineFill) { processTrack.style.setProperty('--line-progress', '1'); }
    } else {
      var ticking = false;
      var updateProcess = function () {
        ticking = false;
        var rect = processTrack.getBoundingClientRect();
        var viewH = window.innerHeight;
        var progress = (viewH * 0.72 - rect.top) / rect.height;
        progress = Math.max(0, Math.min(1, progress));
        processTrack.style.setProperty('--line-progress', progress.toFixed(3));
        steps.forEach(function (step) {
          var sRect = step.getBoundingClientRect();
          step.classList.toggle('is-active', sRect.top < viewH * 0.75);
        });
      };
      window.addEventListener('scroll', function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateProcess);
        }
      }, { passive: true });
      updateProcess();
    }
  }

  /* ---------- Vorher/Nachher-Slider ---------- */
  document.querySelectorAll('[data-ba]').forEach(function (slider) {
    var range = slider.querySelector('.ba-range');
    var setPos = function (value) {
      slider.style.setProperty('--ba-pos', value + '%');
    };
    setPos(range.value);
    range.addEventListener('input', function () { setPos(range.value); });

    /* Pointer-Drag direkt auf der Fläche (Range ist unsichtbar darüber,
       deckt aber nur Klicks ab – Drag übernimmt Pointer-Logik): */
    var dragging = false;
    var updateFromPointer = function (clientX) {
      var rect = slider.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      range.value = pct;
      setPos(pct);
    };
    slider.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) { return; }
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      updateFromPointer(e.clientX);
    });
    slider.addEventListener('pointermove', function (e) {
      if (dragging) { updateFromPointer(e.clientX); }
    });
    ['pointerup', 'pointercancel'].forEach(function (evt) {
      slider.addEventListener(evt, function () { dragging = false; });
    });
  });

  /* ---------- Vorher/Nachher: Motiv-Umschalter ---------- */
  document.querySelectorAll('[data-ba-switcher]').forEach(function (switcher) {
    var tabs = switcher.querySelectorAll('.ba-tab');
    var target = document.querySelector(switcher.getAttribute('data-ba-switcher'));
    if (!target) { return; }
    var beforeImg = target.querySelector('.ba-before img');
    var afterImg = target.querySelector('.ba-after-img');
    var range = target.querySelector('.ba-range');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.setAttribute('aria-pressed', 'false'); });
        tab.setAttribute('aria-pressed', 'true');
        beforeImg.src = tab.getAttribute('data-before');
        afterImg.src = tab.getAttribute('data-after');
        beforeImg.alt = tab.getAttribute('data-alt-before');
        afterImg.alt = tab.getAttribute('data-alt-after');
        range.value = 50;
        target.style.setProperty('--ba-pos', '50%');
      });
    });
  });

  /* ---------- Breite des Vorher-Bilds an Containerbreite koppeln ---------- */
  var syncBaWidths = function () {
    document.querySelectorAll('[data-ba]').forEach(function (slider) {
      var beforeImg = slider.querySelector('.ba-before img');
      if (beforeImg) { beforeImg.style.width = slider.clientWidth + 'px'; }
    });
  };
  window.addEventListener('resize', syncBaWidths, { passive: true });
  window.addEventListener('load', syncBaWidths);
  syncBaWidths();

  /* ---------- Scroll-Progress (--p: 0..1) für scrollgetriebene Effekte ---------- */
  var progressEls = document.querySelectorAll('[data-scroll-progress]');
  if (progressEls.length) {
    if (reducedMotion) {
      progressEls.forEach(function (el) { el.style.setProperty('--p', '1'); });
    } else {
      var progressTicking = false;
      var updateProgress = function () {
        progressTicking = false;
        var viewH = window.innerHeight;
        progressEls.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.bottom < -80 || rect.top > viewH + 80) { return; }
          /* 0 = Oberkante betritt den Viewport unten, 1 = Oberkante erreicht das obere Sechstel */
          var p = (viewH - rect.top) / (viewH * 0.85);
          p = Math.max(0, Math.min(1, p));
          el.style.setProperty('--p', p.toFixed(4));
        });
      };
      window.addEventListener('scroll', function () {
        if (!progressTicking) {
          progressTicking = true;
          window.requestAnimationFrame(updateProgress);
        }
      }, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
      updateProgress();
    }
  }

  /* ---------- 01: Glass Refraction – Reflexion folgt Cursor bzw. Scroll ---------- */
  document.querySelectorAll('.refract').forEach(function (el) {
    if (reducedMotion) { return; }
    var fine = window.matchMedia('(pointer: fine)').matches;
    if (fine) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--rx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        el.style.setProperty('--ry', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0');
        el.style.setProperty('--ry', '0');
      });
    } else {
      var refractTick = false;
      window.addEventListener('scroll', function () {
        if (refractTick) { return; }
        refractTick = true;
        window.requestAnimationFrame(function () {
          refractTick = false;
          var r = el.getBoundingClientRect();
          var c = (r.top + r.height / 2) / window.innerHeight - 0.5;
          el.style.setProperty('--rx', (c * 0.6).toFixed(3));
          el.style.setProperty('--ry', (-c).toFixed(3));
        });
      }, { passive: true });
    }
  });

  /* ---------- 05: Focus Cleaning – Bereiche werden nacheinander scharf ---------- */
  document.querySelectorAll('.focus-seq').forEach(function (seq) {
    var kids = Array.prototype.slice.call(seq.children);
    if (reducedMotion || !('IntersectionObserver' in window)) {
      kids.forEach(function (k) { k.classList.add('in-focus'); });
      return;
    }
    kids.forEach(function (k, i) { k.style.setProperty('--focus-delay', (i * 0.22) + 's'); });
    var fo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          kids.forEach(function (k) { k.classList.add('in-focus'); });
          fo.disconnect();
        }
      });
    }, { threshold: 0.3 });
    fo.observe(seq);
  });

  /* ---------- 07: Mikro-Tropfen erzeugen ---------- */
  document.querySelectorAll('.droplets').forEach(function (host) {
    if (reducedMotion) { return; }
    var spots = [[12, 18], [78, 8], [46, 30], [88, 42], [26, 55], [64, 62]];
    spots.forEach(function (pos, i) {
      var d = document.createElement('span');
      d.className = 'drop';
      d.style.left = pos[0] + '%';
      d.style.top = pos[1] + '%';
      d.style.setProperty('--drop-delay', (i * 1.15) + 's');
      d.setAttribute('aria-hidden', 'true');
      host.appendChild(d);
    });
  });

  /* ---------- 12: Window Grid – Scheiben fahren auseinander ---------- */
  var windowGrids = document.querySelectorAll('.window-grid');
  if (windowGrids.length && 'IntersectionObserver' in window && !reducedMotion) {
    var wg = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          wg.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    windowGrids.forEach(function (el) { wg.observe(el); });
  } else {
    windowGrids.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---------- 17: Magnetic Label – Beschriftung folgt dem Cursor minimal ---------- */
  if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (card) {
      var label = card.querySelector('.magnetic-label');
      if (!label) { return; }
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width - 0.5) * 8;
        var y = ((e.clientY - r.top) / r.height - 0.5) * 5;
        label.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      card.addEventListener('pointerleave', function () {
        label.style.transform = '';
      });
    });
  }

  /* ---------- Treppenhaus: Bildwechsel je Stockwerk ---------- */
  var floorVisual = document.querySelector('[data-floor-visual]');
  var floorSteps = document.querySelectorAll('[data-floor-img]');
  if (floorVisual && floorSteps.length) {
    var floorImgs = floorVisual.querySelectorAll('img');
    var setFloor = function (src) {
      floorImgs.forEach(function (img) {
        img.classList.toggle('is-current', img.getAttribute('data-src-key') === src);
      });
    };
    if (reducedMotion) {
      setFloor(floorSteps[0].getAttribute('data-floor-img'));
    } else {
      var floorTick = false;
      var updateFloor = function () {
        floorTick = false;
        var best = null;
        var line = window.innerHeight * 0.55;
        floorSteps.forEach(function (step) {
          var r = step.getBoundingClientRect();
          if (r.top < line) { best = step; }
        });
        setFloor((best || floorSteps[0]).getAttribute('data-floor-img'));
      };
      window.addEventListener('scroll', function () {
        if (!floorTick) {
          floorTick = true;
          window.requestAnimationFrame(updateFloor);
        }
      }, { passive: true });
      updateFloor();
    }
  }

  /* ---------- 11: Cleaning Rhythm – Pulse nacheinander starten ---------- */
  var rhythm = document.querySelector('.rhythm');
  if (rhythm) {
    rhythm.querySelectorAll('.interval-day.is-on').forEach(function (day, i) {
      day.style.setProperty('--pulse-delay', (i * 0.5) + 's');
    });
    if ('IntersectionObserver' in window && !reducedMotion) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            rhythm.classList.add('revealed');
            ro.disconnect();
          }
        });
      }, { threshold: 0.5 });
      ro.observe(rhythm);
    }
  }

  /* ---------- 18: Clean Trace – Kurvenlänge initialisieren ---------- */
  document.querySelectorAll('.trace-stage svg.trace path').forEach(function (path) {
    try {
      var len = Math.ceil(path.getTotalLength());
      path.closest('.trace-stage').style.setProperty('--trace-len', len);
    } catch (e) { /* Pfad nicht messbar – Standardwert bleibt */ }
  });

  /* ---------- Kontaktformular ----------
     FORM_ENDPOINT: URL eines Formular-Backends (z. B. eigener Server,
     Formspree o. ä.) eintragen, sobald vorhanden. Solange die Konstante
     leer ist, wird NICHTS gesendet und das Formular sagt das ehrlich –
     es täuscht keine Übermittlung vor. */
  var FORM_ENDPOINT = '';
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var statusBox = form.querySelector('.form-status');
    var showStatus = function (kind, html) {
      statusBox.className = 'form-status is-visible status-' + kind;
      statusBox.innerHTML = html;
      statusBox.focus();
    };
    var setError = function (field, msg) {
      var wrap = field.closest('.form-field, .form-consent');
      if (!wrap) { return; }
      wrap.classList.toggle('has-error', !!msg);
      var err = wrap.querySelector('.field-error');
      if (err) { err.textContent = msg || ''; err.style.display = msg ? 'block' : 'none'; }
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      /* Honeypot: von Menschen unsichtbar – wenn gefüllt, still abbrechen */
      if (form.querySelector('[name="firma_www"]').value) { return; }
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var msg = '';
        if (field.type === 'checkbox') {
          if (!field.checked) { msg = 'Bitte bestätigen Sie die Datenschutzerklärung.'; }
        } else if (!field.value.trim()) {
          msg = 'Bitte füllen Sie dieses Feld aus.';
        } else if (field.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value)) {
          msg = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        }
        setError(field, msg);
        if (msg && valid) { field.focus(); }
        if (msg) { valid = false; }
      });
      if (!valid) { return; }

      var data = new FormData(form);
      data.delete('firma_www');
      if (FORM_ENDPOINT) {
        var btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
          .then(function (res) {
            if (!res.ok) { throw new Error('HTTP ' + res.status); }
            form.reset();
            showStatus('ok', '<strong>Vielen Dank!</strong> Ihre Anfrage ist bei uns eingegangen – Sie erhalten zeitnah eine Rückmeldung.');
          })
          .catch(function () {
            showStatus('error', 'Die Übermittlung hat leider nicht geklappt. Bitte versuchen Sie es später erneut oder besuchen Sie uns in der Friedrichstraße 108, Ludwigsburg.');
          })
          .then(function () { btn.disabled = false; });
      } else {
        /* Noch kein Postfach angebunden: ehrlich sagen + Anfrage kopierbar machen */
        var lines = [];
        data.forEach(function (value, key) {
          if (value && key !== 'datenschutz') { lines.push(key + ': ' + value); }
        });
        var text = 'Anfrage an ClearWay Gebäudeservice\n\n' + lines.join('\n');
        showStatus('info',
          '<strong>Fast geschafft:</strong> Der Online-Versand wird gerade eingerichtet und ist in Kürze verfügbar. ' +
          'Ihre Eingaben gehen nicht verloren – kopieren Sie Ihre Anfrage mit einem Klick und senden Sie sie uns über Ihren bevorzugten Kanal, sobald Telefonnummer und E-Mail hier veröffentlicht sind. ' +
          '<button type="button" class="btn btn-ghost" data-copy style="margin-top:.6rem">Anfrage als Text kopieren</button>');
        var copyBtn = statusBox.querySelector('[data-copy]');
        copyBtn.addEventListener('click', function () {
          (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
            .then(function () { copyBtn.textContent = 'Kopiert ✓'; })
            .catch(function () {
              var ta = document.createElement('textarea');
              ta.value = text;
              document.body.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              document.body.removeChild(ta);
              copyBtn.textContent = 'Kopiert ✓';
            });
        });
      }
    });
    /* Fehler beim Tippen zurücknehmen */
    form.addEventListener('input', function (e) {
      if (e.target.closest('.has-error')) { setError(e.target, ''); }
    });
  }

  /* ---------- Nur ein FAQ-Element gleichzeitig offen ---------- */
  document.querySelectorAll('[data-faq]').forEach(function (group) {
    var items = group.querySelectorAll('details');
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item) { other.open = false; }
          });
        }
      });
    });
  });
})();
