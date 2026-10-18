(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const map = (v, a, b) => clamp((v - a) / (b - a || 1), 0, 1);

  /* —— Scroll reveals —— */
  const nodes = document.querySelectorAll(".reveal");
  if (nodes.length) {
    if (!("IntersectionObserver" in window) || reduceMotion) {
      nodes.forEach((el) => el.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
      );
      nodes.forEach((el) => observer.observe(el));
    }
  }

  /* —— Vorteile: scroll-scrubbed Website → App —— */
  const stage = document.querySelector("[data-why]");
  if (!stage) return;

  const progressBar = stage.querySelector('[data-why="progress"]');
  const compare = stage.querySelector('[data-why="compare"]');
  const urlText = stage.querySelector('[data-why="url-text"]');
  const cursor = stage.querySelector('[data-why="cursor"]');
  const safariHome = stage.querySelector('[data-why="safari-home"]');
  const searchPanel = stage.querySelector('[data-why="search"]');
  const searchHits = [
    stage.querySelector('[data-why="search-a"]'),
    stage.querySelector('[data-why="search-b"]'),
    stage.querySelector('[data-why="search-c"]'),
  ];
  const loading = stage.querySelector('[data-why="loading"]');
  const webShop = stage.querySelector('[data-why="web-shop"]');
  const appCol = stage.querySelector('[data-why="app-col"]');
  const appHome = stage.querySelector('[data-why="app-home"]');
  const appIcon = stage.querySelector('[data-why="app-icon"]');
  const appShop = stage.querySelector('[data-why="app-shop"]');
  const webSteps = [...stage.querySelectorAll("[data-why-step]")];
  const appSteps = [...stage.querySelectorAll("[data-why-step-app]")];

  const wrongName = "meine mar";
  const shopName = "Meine Marke";

  const showLayer = (el, on) => {
    if (!el) return;
    el.classList.toggle("is-on", Boolean(on));
  };

  const setWebStep = (activeIndex) => {
    webSteps.forEach((li, i) => {
      li.classList.toggle("is-active", i === activeIndex);
      li.classList.toggle("is-done", i < activeIndex);
    });
  };

  const setAppStep = (activeIndex) => {
    appSteps.forEach((li, i) => {
      li.classList.toggle("is-active", i === activeIndex);
      li.classList.toggle("is-done", i < activeIndex);
    });
  };

  const getProgress = () => {
    const total = stage.offsetHeight - window.innerHeight;
    if (total <= 0) return 1;
    return clamp(-stage.getBoundingClientRect().top / total, 0, 1);
  };

  const apply = (p) => {
    if (progressBar) progressBar.style.width = `${p * 100}%`;

    // —— Website first (0 → 0.68) ——
    const webDone = p >= 0.68;

    if (p < 0.08) {
      setWebStep(0);
      if (urlText) urlText.textContent = "";
      if (cursor) cursor.classList.remove("is-on");
      showLayer(safariHome, true);
      showLayer(searchPanel, false);
      showLayer(loading, false);
      showLayer(webShop, false);
    } else if (p < 0.28) {
      setWebStep(1);
      showLayer(safariHome, true);
      showLayer(searchPanel, false);
      showLayer(loading, false);
      showLayer(webShop, false);
      const t = map(p, 0.08, 0.28);
      if (urlText) urlText.textContent = wrongName.slice(0, Math.floor(t * wrongName.length));
      if (cursor) cursor.classList.add("is-on");
    } else if (p < 0.36) {
      setWebStep(2);
      showLayer(safariHome, true);
      showLayer(searchPanel, false);
      showLayer(loading, false);
      showLayer(webShop, false);
      const erase = map(p, 0.28, 0.36);
      if (urlText) {
        urlText.textContent = wrongName.slice(0, Math.floor((1 - erase) * wrongName.length));
      }
      if (cursor) cursor.classList.add("is-on");
    } else if (p < 0.52) {
      setWebStep(2);
      showLayer(safariHome, false);
      showLayer(searchPanel, true);
      showLayer(loading, false);
      showLayer(webShop, false);
      const searchP = map(p, 0.36, 0.52);
      const highlight = Math.min(2, Math.floor(searchP * 3));
      searchHits.forEach((el, i) => el && el.classList.toggle("is-hot", i === highlight));
      const typeCorrect = map(p, 0.42, 0.52);
      if (urlText) urlText.textContent = shopName.slice(0, Math.floor(typeCorrect * shopName.length));
      if (cursor) cursor.classList.toggle("is-on", typeCorrect < 1);
    } else if (p < 0.62) {
      setWebStep(3);
      if (urlText) urlText.textContent = shopName;
      if (cursor) cursor.classList.remove("is-on");
      showLayer(safariHome, false);
      showLayer(searchPanel, false);
      showLayer(loading, true);
      showLayer(webShop, false);
      searchHits.forEach((el) => el && el.classList.remove("is-hot"));
    } else {
      setWebStep(4);
      if (urlText) urlText.textContent = shopName;
      if (cursor) cursor.classList.remove("is-on");
      showLayer(safariHome, false);
      showLayer(searchPanel, false);
      showLayer(loading, false);
      showLayer(webShop, true);
      searchHits.forEach((el) => el && el.classList.remove("is-hot"));
    }

    // —— App only after website ——
    if (compare) compare.classList.toggle("is-split", webDone);
    if (appCol) appCol.classList.toggle("is-live", webDone);

    if (!webDone) {
      setAppStep(-1);
      showLayer(appHome, true);
      showLayer(appShop, false);
      if (appIcon) appIcon.classList.remove("is-press");
      return;
    }

    if (p < 0.78) {
      setAppStep(0);
      showLayer(appHome, true);
      showLayer(appShop, false);
      if (appIcon) appIcon.classList.toggle("is-press", p >= 0.74);
    } else {
      setAppStep(1);
      showLayer(appHome, false);
      showLayer(appShop, true);
      if (appIcon) appIcon.classList.remove("is-press");
    }
  };

  if (reduceMotion) {
    apply(1);
    stage.classList.add("why--static");
    return;
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      apply(getProgress());
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  apply(getProgress());
})();
