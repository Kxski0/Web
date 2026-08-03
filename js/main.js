// Hausmeisterservice Nowak – Interaktionen

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  // Mobiles Menü
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

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

  // Vorher/Nachher-Vergleich
  document.querySelectorAll("[data-compare]").forEach(function (compare) {
    var range = compare.querySelector(".compare__range");
    if (!range) return;

    function setPos(value) {
      compare.style.setProperty("--pos", value + "%");
    }

    range.addEventListener("input", function () { setPos(range.value); });

    // Beim ersten Einblenden kurz „anfassen", damit der Regler verständlich ist
    if (!reduceMotion && "IntersectionObserver" in window) {
      var peeked = false;
      var peekObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || peeked) return;
          peeked = true;
          peekObserver.disconnect();
          var start = null;
          var duration = 1500;
          function peek(timestamp) {
            if (start === null) start = timestamp;
            var t = Math.min((timestamp - start) / duration, 1);
            var value = 50 + Math.sin(t * Math.PI) * 14;
            setPos(value.toFixed(1));
            range.value = value;
            if (t < 1) requestAnimationFrame(peek);
          }
          requestAnimationFrame(peek);
        });
      }, { threshold: 0.6 });
      peekObserver.observe(compare);
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
