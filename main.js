/* App aus Onlineshop — Interaktionen (ohne externe Bibliotheken) */
(function () {
  document.documentElement.classList.remove("no-js");

  /* Navigation: Hintergrund beim Scrollen + Mobilmenü */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = nav.querySelector(".nav__toggle");
    if (toggle) {
      var setMenu = function (open) {
        nav.classList.toggle("is-open", open);
        document.documentElement.classList.toggle("menu-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      };
      toggle.addEventListener("click", function () {
        setMenu(!nav.classList.contains("is-open"));
      });
      nav.querySelectorAll(".nav__links a").forEach(function (a) {
        a.addEventListener("click", function () { setMenu(false); });
      });
      /* Tipp außerhalb des Menüs schließt es */
      document.addEventListener("click", function (e) {
        if (nav.classList.contains("is-open") && !nav.querySelector(".nav__bar").contains(e.target)) setMenu(false);
      });
    }
  }

  /* Anfrage-Leiste unten auf dem Handy: sichtbar, solange keiner der
     [data-cta-hide]-Bereiche (Hero-Buttons, Abschluss, Footer) im Bild ist */
  var bar = document.querySelector(".mobile-cta");
  var hideZones = document.querySelectorAll("[data-cta-hide]");
  if (bar && hideZones.length && "IntersectionObserver" in window) {
    var visibleZones = new Set();
    var zoneIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visibleZones.add(e.target);
        else visibleZones.delete(e.target);
      });
      bar.classList.toggle("is-visible", visibleZones.size === 0);
    });
    hideZones.forEach(function (z) { zoneIo.observe(z); });
  }

  /* Wisch-Karten: Punkte unter dem Karussell */
  document.querySelectorAll("[data-swipe]").forEach(function (track) {
    var cards = track.children;
    var dots = document.createElement("div");
    dots.className = "swipe-dots";
    dots.setAttribute("aria-hidden", "true");
    Array.prototype.forEach.call(cards, function (card, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.tabIndex = -1;
      d.addEventListener("click", function () {
        track.scrollTo({ left: card.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: "smooth" });
      });
      dots.appendChild(d);
    });
    track.after(dots);
    var update = function () {
      var step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
      var idx = Math.round(track.scrollLeft / step);
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) idx = cards.length - 1;
      Array.prototype.forEach.call(dots.children, function (d, i) { d.classList.toggle("is-active", i === idx); });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  });

  /* KI-Gründe: auf dem Desktop immer offen, auf dem Handy zum Aufklappen */
  var kiItems = document.querySelectorAll(".ki__list details");
  if (kiItems.length) {
    var mq = window.matchMedia("(max-width: 640px)");
    var syncKi = function () {
      kiItems.forEach(function (d) { d.open = !mq.matches; });
    };
    syncKi();
    if (mq.addEventListener) mq.addEventListener("change", syncKi);
    kiItems.forEach(function (d) {
      d.querySelector("summary").addEventListener("click", function (e) {
        if (!mq.matches) e.preventDefault();
      });
    });
  }

  /* Einblenden beim Scrollen */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Drop-Countdown im Handy-Mockup (läuft immer weiter, nur Deko) */
  var cd = document.querySelector("[data-countdown]");
  if (cd) {
    var parts = cd.querySelectorAll("span");
    var end = Date.now() + (2 * 3600 + 14 * 60 + 38) * 1000;
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var tick = function () {
      var s = Math.max(0, Math.floor((end - Date.now()) / 1000));
      if (s === 0) end = Date.now() + 3 * 3600 * 1000;
      parts[0].textContent = pad(Math.floor(s / 3600)) + "h";
      parts[1].textContent = pad(Math.floor((s % 3600) / 60)) + "m";
      parts[2].textContent = pad(s % 60) + "s";
    };
    tick();
    setInterval(tick, 1000);
  }

  /* Jahr im Footer */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
