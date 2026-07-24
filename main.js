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

    if (reduceMotion) {
      if (progress) progress.style.width = "100%";
      if (urlText) urlText.textContent = shopName;
      if (safariHome) safariHome.style.opacity = "0";
      if (searchPanel) searchPanel.style.opacity = "0";
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

      // 0.00–0.12 Safari
      // 0.12–0.28 type partial/wrong shop name
      // 0.28–0.48 forgot → search results, pick right name
      // 0.48–0.62 loading
      // 0.62–0.76 finally shop
      const phaseSafari = map(scrolled, 0, 0.12);
      const phaseType = map(scrolled, 0.12, 0.28);
      const phaseSearch = map(scrolled, 0.28, 0.48);
      const phaseLoad = map(scrolled, 0.48, 0.62);
      const phaseWebShop = map(scrolled, 0.62, 0.76);

      if (safariHome) {
        safariHome.style.opacity = String(
          scrolled < 0.12 ? lerp(0.35, 1, phaseSafari) : Math.max(0, 1 - map(scrolled, 0.12, 0.18))
        );
      }

      // Typing then backspace (forgot), then correct name via search
      if (urlText) {
        if (scrolled < 0.12) {
          urlText.textContent = "";
        } else if (scrolled < 0.28) {
          const chars = Math.floor(phaseType * wrongName.length);
          urlText.textContent = wrongName.slice(0, chars);
        } else if (scrolled < 0.36) {
          // erase — name forgotten
          const erase = map(scrolled, 0.28, 0.36);
          const left = Math.floor((1 - erase) * wrongName.length);
          urlText.textContent = wrongName.slice(0, left);
        } else if (scrolled < 0.48) {
          const typeCorrect = map(scrolled, 0.38, 0.48);
          const chars = Math.floor(typeCorrect * shopName.length);
          urlText.textContent = shopName.slice(0, chars);
        } else {
          urlText.textContent = shopName;
        }
      }

      if (cursor) {
        const showCursor = scrolled >= 0.12 && scrolled < 0.48;
        cursor.style.opacity = showCursor ? (Math.floor(scrolled * 40) % 2 ? "1" : "0.2") : "0";
      }

      if (searchPanel) {
        const searchVis =
          scrolled >= 0.28 && scrolled < 0.5
            ? map(scrolled, 0.28, 0.34) * (1 - map(scrolled, 0.46, 0.5))
            : 0;
        searchPanel.style.opacity = String(searchVis);

        const highlight = Math.min(2, Math.floor(phaseSearch * 3));
        searchHits.forEach((el, i) => {
          if (el) el.classList.toggle("is-hot", searchVis > 0.2 && i === highlight);
        });
      }

      if (loading) {
        const loadVis =
          scrolled >= 0.48 && scrolled < 0.64
            ? map(scrolled, 0.48, 0.52) * (1 - map(scrolled, 0.6, 0.64))
            : 0;
        loading.style.opacity = String(loadVis);
      }

      if (webShop) {
        webShop.style.opacity = String(phaseWebShop);
      }

      if (scrolled < 0.12) setWebStep(0);
      else if (scrolled < 0.28) setWebStep(1);
      else if (scrolled < 0.48) setWebStep(2);
      else if (scrolled < 0.62) setWebStep(3);
      else setWebStep(4);

      // App column — still one tap
      const appReveal = map(scrolled, 0.52, 0.66);
      if (appCol) {
        appCol.style.opacity = String(lerp(0.22, 1, appReveal));
        appCol.style.transform = `translateY(${lerp(16, 0, appReveal)}px)`;
      }

      const tap = map(scrolled, 0.66, 0.76);
      const open = map(scrolled, 0.74, 0.86);

      if (appIcon) {
        appIcon.style.transform = `scale(${lerp(1, 0.88, tap)})`;
      }
      if (appHome) {
        appHome.style.opacity = String(1 - open);
      }
      if (appShop) {
        appShop.style.opacity = String(open);
      }

      if (scrolled < 0.66) setAppStep(-1);
      else if (scrolled < 0.76) setAppStep(0);
      else setAppStep(1);
    };
  };

  /* —— Block 3: Recalled example —— */
  const setupExample = () => {
    const stage = document.querySelector('[data-scroll-stage="example"]');
    if (!stage) return () => {};

    const progress = stage.querySelector('[data-stage="progress-example"]');
    const phone = stage.querySelector('[data-ex="phone"]');
    const caption = stage.querySelector('[data-ex="caption"]');
    const screens = {
      home: stage.querySelector('[data-ex-screen="home"]'),
      product: stage.querySelector('[data-ex-screen="product"]'),
      chat: stage.querySelector('[data-ex-screen="chat"]'),
    };
    const feats = [...stage.querySelectorAll("[data-ex-feat]")];
    const captions = {
      home: "Home — Drops & Feed",
      product: "Produkt — Warenkorb bereit",
      chat: "Chat — Listing wird live",
    };

    const setScreen = (name) => {
      Object.entries(screens).forEach(([key, el]) => {
        if (el) el.classList.toggle("is-active", key === name);
      });
      feats.forEach((li) => {
        const id = li.getAttribute("data-ex-feat");
        const mapName = { 0: "home", 1: "product", 2: "chat" }[id];
        li.classList.toggle("is-active", mapName === name);
      });
      if (caption) caption.textContent = captions[name] || "";
    };

    if (reduceMotion) {
      if (progress) progress.style.width = "100%";
      setScreen("home");
      feats.forEach((li) => li.classList.add("is-active"));
      return () => {};
    }

    return () => {
      const scrolled = getProgress(stage);
      if (progress) progress.style.width = `${scrolled * 100}%`;

      if (phone) {
        const lift = map(scrolled, 0, 0.2);
        phone.style.transform = `translateY(${lerp(24, 0, lift)}px)`;
      }

      // 0–0.28 home, 0.28–0.58 product, 0.58–1 chat
      if (scrolled < 0.32) setScreen("home");
      else if (scrolled < 0.62) setScreen("product");
      else setScreen("chat");

      // Soft chat bubble stagger when on chat
      const chat = screens.chat;
      if (chat) {
        const bubbles = [...chat.querySelectorAll(".ex-bubble")];
        const chatT = map(scrolled, 0.62, 0.92);
        bubbles.forEach((b, i) => {
          const t = map(chatT, i * 0.12, i * 0.12 + 0.2);
          b.style.opacity = String(lerp(0.15, 1, t));
          b.style.transform = `translateY(${lerp(10, 0, t)}px)`;
        });
      }
    };
  };

  const updateIntro = setupIntro();
  const updateWhy = setupWhy();
  const updateExample = setupExample();

  let ticking = false;
  const update = () => {
    ticking = false;
    updateIntro();
    updateWhy();
    updateExample();
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
