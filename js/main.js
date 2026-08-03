// Hausmeisterservice Nowak – Interaktionen

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  // Mobiles Menü
  // Bewusst über die Navigation selbst gesucht statt über eine feste ID:
  // so funktioniert es auch, wenn mehrere Navigationen im Dokument liegen.
  document.querySelectorAll(".nav").forEach(function (nav) {
    var toggle = nav.querySelector(".nav__toggle");
    var menu = nav.querySelector(".nav__menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    }

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(!menu.classList.contains("is-open"));
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    // Tippen daneben schließt das Menü wieder
    document.addEventListener("click", function (event) {
      if (menu.classList.contains("is-open") && !nav.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  });

  // Mosaik-Kacheln entfalten sich nacheinander
  document.querySelectorAll(".mosaic .tile").forEach(function (tile, index) {
    tile.style.transitionDelay = (index % 8) * 70 + "ms";
  });

  // Scroll-Animationen
  var revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Zähler in der Zahlenleiste
  var counters = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1400;
    var start = null;

    function tick(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  // Parallax (Hero-Bild, kleines Collage-Foto)
  var parallaxElements = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));

  if (!reduceMotion && parallaxElements.length) {
    var parallaxItems = parallaxElements.map(function (el) {
      return {
        el: el,
        factor: parseFloat(el.getAttribute("data-parallax")),
        scale: el.closest(".hero__media") ? " scale(1.14)" : "",
        anchor: el.closest("section") || el.parentElement
      };
    });
    var parallaxTicking = false;

    function updateParallax() {
      parallaxItems.forEach(function (item) {
        var rect = item.anchor.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        var y = rect.top * -item.factor;
        item.el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)" + item.scale;
      });
      parallaxTicking = false;
    }

    window.addEventListener("scroll", function () {
      if (!parallaxTicking) {
        parallaxTicking = true;
        requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
    updateParallax();
  }

  // Leichte 3D-Neigung für die Glass-Karte
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "rotateX(" + (-y * 5).toFixed(2) + "deg) rotateY(" + (x * 6).toFixed(2) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  // Magnetische Buttons
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-magnet]").forEach(function (btn) {
      btn.addEventListener("mousemove", function (event) {
        var rect = btn.getBoundingClientRect();
        var x = event.clientX - rect.left - rect.width / 2;
        var y = event.clientY - rect.top - rect.height / 2;
        btn.style.transform = "translate(" + (x * 0.18).toFixed(1) + "px," + (y * 0.3).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  // Sticky-Timeline: Linie zeichnet sich beim Scrollen, Schritte aktivieren
  var timeline = document.querySelector(".timeline");

  if (timeline) {
    var timelineFill = timeline.querySelector(".timeline__fill");
    var timelineSteps = timeline.querySelectorAll(".timeline__step");
    var timelineTicking = false;

    function updateTimeline() {
      var rect = timeline.getBoundingClientRect();
      var trigger = window.innerHeight * 0.72;
      var progress = Math.min(Math.max((trigger - rect.top) / rect.height, 0), 1);
      if (timelineFill) timelineFill.style.transform = "scaleY(" + progress.toFixed(3) + ")";
      timelineSteps.forEach(function (step) {
        step.classList.toggle("is-active", step.getBoundingClientRect().top < trigger);
      });
      timelineTicking = false;
    }

    window.addEventListener("scroll", function () {
      if (!timelineTicking) {
        timelineTicking = true;
        requestAnimationFrame(updateTimeline);
      }
    }, { passive: true });
    updateTimeline();
  }

  // Scroll-Scrub: Elemente mit [data-scrub] bekommen eine CSS-Variable
  // --scrub (0 bis 1), die den Fortschritt beim Durchscrollen abbildet.
  // Jede Seite nutzt sie anders (Schnee schieben, Wand streichen, Morph …).
  var scrubElements = Array.prototype.slice.call(document.querySelectorAll("[data-scrub]"));

  if (scrubElements.length) {
    var scrubTicking = false;

    function updateScrub() {
      var vh = window.innerHeight;
      scrubElements.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) return;
        var progress = (vh * 0.92 - rect.top) / (vh * 0.72);
        progress = Math.min(Math.max(progress, 0), 1);
        el.style.setProperty("--scrub", progress.toFixed(3));
      });
      scrubTicking = false;
    }

    window.addEventListener("scroll", function () {
      if (!scrubTicking) {
        scrubTicking = true;
        requestAnimationFrame(updateScrub);
      }
    }, { passive: true });
    updateScrub();
  }

  // Sequenz: Kinder mit .seq in einem [data-sequence]-Container werden
  // nacheinander aktiviert, sobald der Container sichtbar wird.
  if ("IntersectionObserver" in window) {
    document.querySelectorAll("[data-sequence]").forEach(function (containerEl) {
      var step = parseInt(containerEl.getAttribute("data-sequence"), 10) || 140;
      var seqObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          seqObserver.disconnect();
          containerEl.querySelectorAll(".seq").forEach(function (child, i) {
            child.style.transitionDelay = i * step + "ms";
            child.classList.add("is-on");
          });
        });
      }, { threshold: 0.35 });
      seqObserver.observe(containerEl);
    });
  } else {
    document.querySelectorAll("[data-sequence] .seq").forEach(function (child) {
      child.classList.add("is-on");
    });
  }

  // Vorher/Nachher-Showcase
  // Man zieht direkt im Bild; die Kante folgt weich nach, statt hart
  // am Finger zu kleben. Der Regler bleibt fuer Tastatur und Screenreader.
  document.querySelectorAll("[data-showcase]").forEach(function (showcase) {
    var frame = showcase.querySelector(".showcase__frame");
    var range = showcase.querySelector(".showcase__range");
    var scenes = showcase.querySelectorAll("[data-scene]");
    var tabs = showcase.querySelectorAll(".showcase__tab");
    var notes = showcase.querySelectorAll("[data-note]");
    if (!frame || !range) return;

    var target = 50;
    var current = 50;
    var running = false;
    var touched = false;

    function paint(value) {
      showcase.style.setProperty("--pos", value + "%");
      showcase.style.setProperty("--pos-num", (value / 100).toFixed(4));
    }

    function loop() {
      // Lerp: je groesser der Faktor, desto direkter das Gefuehl
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.05) {
        current = target;
        running = false;
      } else {
        requestAnimationFrame(loop);
      }
      paint(current);
    }

    function setTarget(value, immediate) {
      target = Math.min(Math.max(value, 0), 100);
      range.value = target;
      if (immediate || reduceMotion) {
        current = target;
        paint(current);
        return;
      }
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    }

    function positionFromEvent(event) {
      var rect = frame.getBoundingClientRect();
      return ((event.clientX - rect.left) / rect.width) * 100;
    }

    frame.addEventListener("pointerdown", function (event) {
      if (event.target === range) return;
      touched = true;
      showcase.classList.add("is-dragging");
      frame.setPointerCapture(event.pointerId);
      setTarget(positionFromEvent(event));
    });

    frame.addEventListener("pointermove", function (event) {
      if (!showcase.classList.contains("is-dragging")) return;
      event.preventDefault();
      setTarget(positionFromEvent(event));
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(function (type) {
      frame.addEventListener(type, function () {
        showcase.classList.remove("is-dragging");
      });
    });

    range.addEventListener("input", function () {
      touched = true;
      setTarget(parseFloat(range.value), true);
    });

    // Reiter: Referenz wechseln, Position dabei behalten
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-target");
        tabs.forEach(function (other) {
          var on = other === tab;
          other.classList.toggle("is-current", on);
          other.setAttribute("aria-selected", String(on));
        });
        scenes.forEach(function (scene) {
          var on = scene.getAttribute("data-scene") === key;
          scene.classList.toggle("is-active", on);
          if (on) { scene.removeAttribute("aria-hidden"); }
          else { scene.setAttribute("aria-hidden", "true"); }
        });
        notes.forEach(function (note) {
          note.hidden = note.getAttribute("data-note") !== key;
        });
      });
    });

    paint(50);

    // Beim ersten Sichtbarwerden einmal langsam durchwischen, damit
    // klar ist, dass man hier ziehen kann. Bricht bei Interaktion ab.
    if (!reduceMotion && "IntersectionObserver" in window) {
      var introObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          introObserver.disconnect();
          var start = null;
          var duration = 2600;
          function intro(timestamp) {
            if (touched) return;
            if (start === null) start = timestamp;
            var t = Math.min((timestamp - start) / duration, 1);
            var eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            var value = 50 + Math.sin(eased * Math.PI * 2) * 26;
            current = value;
            target = value;
            range.value = value;
            paint(value);
            if (t < 1) requestAnimationFrame(intro);
          }
          requestAnimationFrame(intro);
        });
      }, { threshold: 0.45 });
      introObserver.observe(showcase);
    }
  });


  // FAQ: Antworten gleiten weich auf und zu
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var summary = item.querySelector("summary");
    var body = item.querySelector(".faq__body");
    if (!summary || !body) return;

    item.setAttribute("open", "");
    body.style.maxHeight = "0px";

    summary.addEventListener("click", function (event) {
      event.preventDefault();
      var isOpen = item.classList.toggle("open");
      body.style.maxHeight = isOpen ? body.scrollHeight + "px" : "0px";
    });
  });

  // Kontaktformular
  // Hinweis: Für den Live-Betrieb einen Formular-Dienst (z. B. Formspree)
  // oder ein serverseitiges Skript anbinden. Bis dahin öffnet das Formular
  // eine vorausgefüllte E-Mail.
  var form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var subject = "Anfrage über die Website: " + data.get("topic");
      var body =
        "Name: " + data.get("name") + "\n" +
        "Telefon: " + (data.get("phone") || "-") + "\n" +
        "E-Mail: " + data.get("email") + "\n\n" +
        data.get("message");

      window.location.href =
        "mailto:info@hausmeisterservice-nowak.de" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      var success = form.querySelector(".contact__success");
      if (success) success.hidden = false;
      form.reset();
    });
  }

  // Jahreszahl im Footer
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
