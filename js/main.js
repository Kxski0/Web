// Hausmeisterservice Nowak – Interaktionen

(function () {
  "use strict";

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

  // Vorher/Nachher-Vergleich
  document.querySelectorAll("[data-compare]").forEach(function (compare) {
    var range = compare.querySelector(".compare__range");
    if (!range) return;
    range.addEventListener("input", function () {
      compare.style.setProperty("--pos", range.value + "%");
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
