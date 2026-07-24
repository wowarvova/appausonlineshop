(() => {
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const map = (v, a, b) => clamp((v - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getProgress = (stage) => {
    const rect = stage.getBoundingClientRect();
    const total = Math.max(stage.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / total);
  };

  /* —— Block 1: Intro —— */
  const setupIntro = () => {
    const intro = document.getElementById("intro");
    if (!intro) return () => {};

    const progress = intro.querySelector('[data-stage="progress"]');
    const hint = intro.querySelector('[data-stage="hint"]');
    const visual = intro.querySelector(".stage-visual");
    const shop = intro.querySelector('[data-parallax="shop"]');
    const arrow = intro.querySelector('[data-parallax="arrow"]');
    const phone = intro.querySelector('[data-parallax="phone"]');

    if (reduceMotion) {
      if (progress) progress.style.width = "100%";
      if (visual) {
        visual.style.opacity = "1";
        visual.style.transform = "none";
      }
      if (arrow) arrow.style.opacity = "1";
      if (phone) phone.style.opacity = "1";
      return () => {};
    }

    return () => {
      const scrolled = getProgress(intro);
      if (progress) progress.style.width = `${scrolled * 100}%`;

      const visT = map(scrolled, 0.18, 0.42);
      if (visual) {
        visual.style.opacity = String(visT);
        visual.style.transform = `translateY(${lerp(40, 0, visT)}px) scale(${lerp(0.96, 1, visT)})`;
      }

      if (shop) {
        const shopT = map(scrolled, 0.2, 0.48);
        shop.style.transform = `translateX(${lerp(-12, 0, shopT)}px) rotate(${lerp(-2, 0, shopT)}deg)`;
      }

      if (arrow) {
        const arrowT = map(scrolled, 0.32, 0.52);
        arrow.style.opacity = String(arrowT);
        arrow.style.transform = `translateX(${lerp(-10, 0, arrowT)}px)`;
      }

      if (phone) {
        const phoneT = map(scrolled, 0.38, 0.62);
        phone.style.transform = `translateX(${lerp(16, 0, phoneT)}px) rotate(${lerp(4, 0, phoneT)}deg) scale(${lerp(0.92, 1, phoneT)})`;
        phone.style.opacity = String(lerp(0.35, 1, phoneT));
      }

      if (hint) {
        const fade = 1 - map(scrolled, 0.12, 0.22);
        hint.style.opacity = String(fade);
        hint.style.visibility = fade < 0.05 ? "hidden" : "visible";
      }
    };
  };

  /* —— Block 2: Why app —— */
  const setupWhy = () => {
    const stage = document.querySelector('[data-scroll-stage="why"]');
    if (!stage) return () => {};

    const progress = stage.querySelector('[data-stage="progress-why"]');
    const urlText = stage.querySelector('[data-why="url-text"]');
    const cursor = stage.querySelector('[data-why="cursor"]');
    const safariHome = stage.querySelector('[data-why="safari-home"]');
    const loading = stage.querySelector('[data-why="loading"]');
    const webShop = stage.querySelector('[data-why="web-shop"]');
    const appCol = stage.querySelector('[data-why="app-col"]');
    const appHome = stage.querySelector('[data-why="app-home"]');
    const appIcon = stage.querySelector('[data-why="app-icon"]');
    const appShop = stage.querySelector('[data-why="app-shop"]');
    const webSteps = [...stage.querySelectorAll("[data-why-step]")];
    const appSteps = [...stage.querySelectorAll("[data-why-step-app]")];

    const fullUrl = "shopify.deine-marke.com";

    if (reduceMotion) {
      if (progress) progress.style.width = "100%";
      if (urlText) urlText.textContent = fullUrl;
      if (safariHome) safariHome.style.opacity = "0";
      if (loading) loading.style.opacity = "0";
      if (webShop) webShop.style.opacity = "1";
      if (appCol) {
        appCol.style.opacity = "1";
        appCol.style.transform = "none";
      }
      if (appHome) appHome.style.opacity = "0";
      if (appShop) appShop.style.opacity = "1";
      webSteps.forEach((li) => li.classList.add("is-done"));
      appSteps.forEach((li) => li.classList.add("is-done"));
      return () => {};
    }

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

    return () => {
      const scrolled = getProgress(stage);
      if (progress) progress.style.width = `${scrolled * 100}%`;

      // Web journey phases
      // 0.00–0.18: Safari home
      // 0.18–0.42: typing URL
      // 0.42–0.58: loading
      // 0.58–0.75: finally shop
      const phaseSafari = map(scrolled, 0, 0.16);
      const phaseType = map(scrolled, 0.16, 0.4);
      const phaseLoad = map(scrolled, 0.4, 0.55);
      const phaseWebShop = map(scrolled, 0.55, 0.7);

      if (safariHome) {
        safariHome.style.opacity = String(
          scrolled < 0.16 ? lerp(0.35, 1, phaseSafari) : Math.max(0, 1 - map(scrolled, 0.16, 0.22))
        );
      }

      if (urlText) {
        const chars = Math.floor(phaseType * fullUrl.length);
        urlText.textContent = fullUrl.slice(0, chars);
      }
      if (cursor) {
        const showCursor = scrolled >= 0.16 && scrolled < 0.42;
        cursor.style.opacity = showCursor ? (Math.floor(scrolled * 40) % 2 ? "1" : "0.2") : "0";
      }

      if (loading) {
        const loadVis =
          scrolled >= 0.4 && scrolled < 0.58
            ? map(scrolled, 0.4, 0.45) * (1 - map(scrolled, 0.55, 0.58))
            : 0;
        loading.style.opacity = String(loadVis);
      }

      if (webShop) {
        webShop.style.opacity = String(phaseWebShop);
      }

      if (scrolled < 0.16) setWebStep(0);
      else if (scrolled < 0.4) setWebStep(1);
      else if (scrolled < 0.55) setWebStep(2);
      else setWebStep(3);

      // App column arrives later and finishes in one beat
      const appReveal = map(scrolled, 0.48, 0.62);
      if (appCol) {
        appCol.style.opacity = String(lerp(0.22, 1, appReveal));
        appCol.style.transform = `translateY(${lerp(16, 0, appReveal)}px)`;
      }

      const tap = map(scrolled, 0.62, 0.72);
      const open = map(scrolled, 0.7, 0.82);

      if (appIcon) {
        appIcon.style.transform = `scale(${lerp(1, 0.88, tap)})`;
      }
      if (appHome) {
        appHome.style.opacity = String(1 - open);
      }
      if (appShop) {
        appShop.style.opacity = String(open);
      }

      if (scrolled < 0.62) setAppStep(-1);
      else if (scrolled < 0.72) setAppStep(0);
      else setAppStep(1);
    };
  };

  const updateIntro = setupIntro();
  const updateWhy = setupWhy();

  let ticking = false;
  const update = () => {
    ticking = false;
    updateIntro();
    updateWhy();
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();
