(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const map = (v, a, b) => clamp((v - a) / (b - a || 1), 0, 1);

  const showLayer = (el, on) => {
    if (!el) return;
    el.classList.toggle("is-on", Boolean(on));
  };

  const setSteps = (nodes, activeIndex) => {
    nodes.forEach((li, i) => {
      li.classList.toggle("is-active", i === activeIndex);
      li.classList.toggle("is-done", i < activeIndex);
    });
  };

  const getProgress = (stage) => {
    const total = stage.offsetHeight - window.innerHeight;
    if (total <= 0) return 1;
    return clamp(-stage.getBoundingClientRect().top / total, 0, 1);
  };

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

  /* —— Vorteil 1: Zugang —— */
  const setupAccess = (stage) => {
    const progressBar = stage.querySelector("[data-why-progress]");
    const compare = stage.querySelector("[data-why-compare]");
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
    const appCol = stage.querySelector("[data-why-app]");
    const appHome = stage.querySelector('[data-why="app-home"]');
    const appIcon = stage.querySelector('[data-why="app-icon"]');
    const appShop = stage.querySelector('[data-why="app-shop"]');
    const webSteps = [...stage.querySelectorAll("[data-why-step]")];
    const appSteps = [...stage.querySelectorAll("[data-why-step-app]")];

    const wrongName = "meine mar";
    const shopName = "Meine Marke";

    return (p) => {
      if (progressBar) progressBar.style.width = `${p * 100}%`;
      const webDone = p >= 0.68;

      if (p < 0.08) {
        setSteps(webSteps, 0);
        if (urlText) urlText.textContent = "";
        if (cursor) cursor.classList.remove("is-on");
        showLayer(safariHome, true);
        showLayer(searchPanel, false);
        showLayer(loading, false);
        showLayer(webShop, false);
      } else if (p < 0.28) {
        setSteps(webSteps, 1);
        showLayer(safariHome, true);
        showLayer(searchPanel, false);
        showLayer(loading, false);
        showLayer(webShop, false);
        const t = map(p, 0.08, 0.28);
        if (urlText) urlText.textContent = wrongName.slice(0, Math.floor(t * wrongName.length));
        if (cursor) cursor.classList.add("is-on");
      } else if (p < 0.36) {
        setSteps(webSteps, 2);
        showLayer(safariHome, true);
        showLayer(searchPanel, false);
        showLayer(loading, false);
        showLayer(webShop, false);
        const erase = map(p, 0.28, 0.36);
        if (urlText) urlText.textContent = wrongName.slice(0, Math.floor((1 - erase) * wrongName.length));
        if (cursor) cursor.classList.add("is-on");
      } else if (p < 0.52) {
        setSteps(webSteps, 2);
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
        setSteps(webSteps, 3);
        if (urlText) urlText.textContent = shopName;
        if (cursor) cursor.classList.remove("is-on");
        showLayer(safariHome, false);
        showLayer(searchPanel, false);
        showLayer(loading, true);
        showLayer(webShop, false);
        searchHits.forEach((el) => el && el.classList.remove("is-hot"));
      } else {
        setSteps(webSteps, 4);
        if (urlText) urlText.textContent = shopName;
        if (cursor) cursor.classList.remove("is-on");
        showLayer(safariHome, false);
        showLayer(searchPanel, false);
        showLayer(loading, false);
        showLayer(webShop, true);
        searchHits.forEach((el) => el && el.classList.remove("is-hot"));
      }

      if (compare) compare.classList.toggle("is-split", webDone);
      if (appCol) appCol.classList.toggle("is-live", webDone);

      if (!webDone) {
        setSteps(appSteps, -1);
        showLayer(appHome, true);
        showLayer(appShop, false);
        if (appIcon) appIcon.classList.remove("is-press");
        return;
      }

      if (p < 0.8) {
        setSteps(appSteps, 0);
        showLayer(appHome, true);
        showLayer(appShop, false);
        if (appIcon) appIcon.classList.toggle("is-press", p >= 0.74);
      } else {
        setSteps(appSteps, 1);
        showLayer(appHome, false);
        showLayer(appShop, true);
        if (appIcon) appIcon.classList.remove("is-press");
      }
    };
  };

  /* —— Vorteil 2: Bleibt / Wiederkehr —— */
  const setupReturn = (stage) => {
    const progressBar = stage.querySelector("[data-why-progress]");
    const compare = stage.querySelector("[data-why-compare]");
    const appCol = stage.querySelector("[data-why-app]");
    const windowEl = stage.querySelector('[data-ret="window"]');
    const closeBtn = stage.querySelector('[data-ret="close"]');
    const shop = stage.querySelector('[data-ret="shop"]');
    const gone = stage.querySelector('[data-ret="gone"]');
    const pages = stage.querySelector('[data-ret="pages"]');
    const shopIcon = stage.querySelector('[data-ret="shop-icon"]');
    const dots = stage.querySelectorAll("[data-ret='dots'] i");
    const webSteps = [...stage.querySelectorAll("[data-ret-step]")];
    const appSteps = [...stage.querySelectorAll("[data-ret-step-app]")];

    return (p) => {
      if (progressBar) progressBar.style.width = `${p * 100}%`;
      const webDone = p >= 0.62;

      if (p < 0.22) {
        setSteps(webSteps, 0);
        if (windowEl) {
          windowEl.classList.remove("is-closing", "is-closed");
        }
        if (closeBtn) closeBtn.classList.remove("is-hot");
        showLayer(shop, true);
        showLayer(gone, false);
      } else if (p < 0.4) {
        setSteps(webSteps, 1);
        if (windowEl) {
          windowEl.classList.remove("is-closing", "is-closed");
        }
        if (closeBtn) closeBtn.classList.add("is-hot");
        showLayer(shop, true);
        showLayer(gone, false);
      } else if (p < 0.55) {
        setSteps(webSteps, 1);
        if (windowEl) {
          windowEl.classList.add("is-closing");
          windowEl.classList.remove("is-closed");
        }
        if (closeBtn) closeBtn.classList.add("is-hot");
        showLayer(shop, true);
        showLayer(gone, false);
      } else {
        setSteps(webSteps, 2);
        if (windowEl) {
          windowEl.classList.remove("is-closing");
          windowEl.classList.add("is-closed");
        }
        if (closeBtn) closeBtn.classList.remove("is-hot");
        showLayer(shop, false);
        showLayer(gone, true);
      }

      if (compare) compare.classList.toggle("is-split", webDone);
      if (appCol) appCol.classList.toggle("is-live", webDone);

      if (!webDone) {
        setSteps(appSteps, -1);
        if (pages) pages.style.transform = "translateX(0)";
        dots.forEach((d, i) => d.classList.toggle("is-on", i === 0));
        if (shopIcon) shopIcon.classList.remove("is-glow");
        return;
      }

      const swipe = map(p, 0.62, 0.82);
      if (pages) pages.style.transform = `translateX(${-swipe * 50}%)`;

      if (p < 0.82) {
        setSteps(appSteps, 0);
        dots.forEach((d, i) => d.classList.toggle("is-on", i === (swipe > 0.5 ? 1 : 0)));
        if (shopIcon) shopIcon.classList.toggle("is-glow", swipe > 0.7);
      } else if (p < 0.92) {
        setSteps(appSteps, 1);
        if (pages) pages.style.transform = "translateX(-50%)";
        dots.forEach((d, i) => d.classList.toggle("is-on", i === 1));
        if (shopIcon) shopIcon.classList.add("is-glow");
      } else {
        setSteps(appSteps, 2);
        if (pages) pages.style.transform = "translateX(-50%)";
        dots.forEach((d, i) => d.classList.toggle("is-on", i === 1));
        if (shopIcon) shopIcon.classList.add("is-glow");
      }
    };
  };

  /* —— Vorteil 3: E-Mail vs Push —— */
  const setupNotify = (stage) => {
    const progressBar = stage.querySelector("[data-why-progress]");
    const compare = stage.querySelector("[data-why-compare]");
    const appCol = stage.querySelector("[data-why-app]");
    const badge = stage.querySelector('[data-ntf="badge"]');
    const mails = [...stage.querySelectorAll("[data-ntf-mail]")];
    const push = stage.querySelector('[data-ntf="push"]');
    const webSteps = [...stage.querySelectorAll("[data-ntf-step]")];
    const appSteps = [...stage.querySelectorAll("[data-ntf-step-app]")];

    return (p) => {
      if (progressBar) progressBar.style.width = `${p * 100}%`;
      const webDone = p >= 0.64;

      const fill = map(p, 0.05, 0.55);
      const visibleCount = Math.min(mails.length, Math.floor(fill * mails.length) + (p > 0.05 ? 1 : 0));

      mails.forEach((mail, i) => {
        const on = i < visibleCount;
        mail.classList.toggle("is-on", on);
        mail.classList.toggle("is-dim", webDone ? i < mails.length - 1 : false);
        mail.classList.toggle("is-lost", webDone && i === mails.length - 1);
      });

      if (badge) badge.textContent = String(Math.max(0, visibleCount));

      if (p < 0.2) setSteps(webSteps, 0);
      else if (p < 0.45) setSteps(webSteps, 1);
      else setSteps(webSteps, 2);

      if (compare) compare.classList.toggle("is-split", webDone);
      if (appCol) appCol.classList.toggle("is-live", webDone);

      if (!webDone) {
        setSteps(appSteps, -1);
        if (push) push.classList.remove("is-in", "is-pulse");
        return;
      }

      if (p < 0.78) {
        setSteps(appSteps, 0);
        if (push) {
          push.classList.add("is-in");
          push.classList.remove("is-pulse");
        }
      } else if (p < 0.9) {
        setSteps(appSteps, 1);
        if (push) {
          push.classList.add("is-in", "is-pulse");
        }
      } else {
        setSteps(appSteps, 2);
        if (push) {
          push.classList.add("is-in", "is-pulse");
        }
      }
    };
  };

  const accessStage = document.querySelector('[data-why="access"]');
  const returnStage = document.querySelector('[data-why="return"]');
  const notifyStage = document.querySelector('[data-why="notify"]');
  if (!accessStage && !returnStage && !notifyStage) return;

  const applyAccess = accessStage ? setupAccess(accessStage) : null;
  const applyReturn = returnStage ? setupReturn(returnStage) : null;
  const applyNotify = notifyStage ? setupNotify(notifyStage) : null;

  const tick = () => {
    const final = reduceMotion ? 1 : null;
    if (applyAccess && accessStage) applyAccess(final ?? getProgress(accessStage));
    if (applyReturn && returnStage) applyReturn(final ?? getProgress(returnStage));
    if (applyNotify && notifyStage) applyNotify(final ?? getProgress(notifyStage));
  };

  if (reduceMotion) {
    if (accessStage) accessStage.classList.add("why--static");
    if (returnStage) returnStage.classList.add("why--static");
    if (notifyStage) notifyStage.classList.add("why--static");
    tick();
    return;
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      tick();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  tick();
})();
