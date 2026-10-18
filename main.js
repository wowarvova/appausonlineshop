(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* —— Vorteile: Website vs App path —— */
  const whyRoot = document.querySelector("[data-why]");
  if (!whyRoot) return;

  const urlText = whyRoot.querySelector('[data-why="url-text"]');
  const cursor = whyRoot.querySelector('[data-why="cursor"]');
  const safariHome = whyRoot.querySelector('[data-why="safari-home"]');
  const searchPanel = whyRoot.querySelector('[data-why="search"]');
  const searchHits = [
    whyRoot.querySelector('[data-why="search-a"]'),
    whyRoot.querySelector('[data-why="search-b"]'),
    whyRoot.querySelector('[data-why="search-c"]'),
  ];
  const loading = whyRoot.querySelector('[data-why="loading"]');
  const webShop = whyRoot.querySelector('[data-why="web-shop"]');
  const appCol = whyRoot.querySelector('[data-why="app-col"]');
  const appHome = whyRoot.querySelector('[data-why="app-home"]');
  const appIcon = whyRoot.querySelector('[data-why="app-icon"]');
  const appShop = whyRoot.querySelector('[data-why="app-shop"]');
  const webSteps = [...whyRoot.querySelectorAll("[data-why-step]")];
  const appSteps = [...whyRoot.querySelectorAll("[data-why-step-app]")];

  const wrongName = "meine mar";
  const shopName = "Meine Marke";

  const showLayer = (el, on) => {
    if (!el) return;
    el.classList.toggle("is-on", on);
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

  const reset = () => {
    if (urlText) urlText.textContent = "";
    if (cursor) cursor.classList.remove("is-on");
    showLayer(safariHome, true);
    showLayer(searchPanel, false);
    showLayer(loading, false);
    showLayer(webShop, false);
    showLayer(appHome, true);
    showLayer(appShop, false);
    if (appCol) appCol.classList.remove("is-live");
    if (appIcon) appIcon.classList.remove("is-press");
    searchHits.forEach((el) => el && el.classList.remove("is-hot"));
    setWebStep(-1);
    setAppStep(-1);
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const typeText = async (target, text, stepMs = 70) => {
    for (let i = 1; i <= text.length; i += 1) {
      target.textContent = text.slice(0, i);
      await wait(stepMs);
    }
  };

  const eraseText = async (target, stepMs = 45) => {
    let value = target.textContent || "";
    while (value.length) {
      value = value.slice(0, -1);
      target.textContent = value;
      await wait(stepMs);
    }
  };

  let running = false;
  let loopId = 0;

  const runLoop = async (id) => {
    reset();
    setWebStep(0);
    showLayer(safariHome, true);
    await wait(700);
    if (id !== loopId) return;

    setWebStep(1);
    if (cursor) cursor.classList.add("is-on");
    await typeText(urlText, wrongName, 85);
    if (id !== loopId) return;
    await wait(350);

    setWebStep(2);
    await eraseText(urlText, 40);
    if (id !== loopId) return;

    showLayer(safariHome, false);
    showLayer(searchPanel, true);
    for (let i = 0; i < searchHits.length; i += 1) {
      searchHits.forEach((el, idx) => el && el.classList.toggle("is-hot", idx === i));
      await wait(380);
      if (id !== loopId) return;
    }

    await typeText(urlText, shopName, 55);
    if (id !== loopId) return;
    if (cursor) cursor.classList.remove("is-on");
    showLayer(searchPanel, false);

    setWebStep(3);
    showLayer(loading, true);
    await wait(900);
    if (id !== loopId) return;

    showLayer(loading, false);
    setWebStep(4);
    showLayer(webShop, true);

    if (appCol) appCol.classList.add("is-live");
    setAppStep(0);
    await wait(500);
    if (id !== loopId) return;

    if (appIcon) appIcon.classList.add("is-press");
    await wait(220);
    if (id !== loopId) return;
    if (appIcon) appIcon.classList.remove("is-press");

    setAppStep(1);
    showLayer(appHome, false);
    showLayer(appShop, true);

    await wait(2200);
    if (id !== loopId) return;
    runLoop(id);
  };

  const start = () => {
    if (running) return;
    running = true;
    loopId += 1;
    runLoop(loopId);
  };

  const showFinal = () => {
    reset();
    if (urlText) urlText.textContent = shopName;
    showLayer(safariHome, false);
    showLayer(webShop, true);
    showLayer(appHome, false);
    showLayer(appShop, true);
    if (appCol) appCol.classList.add("is-live");
    webSteps.forEach((li) => li.classList.add("is-done"));
    appSteps.forEach((li) => li.classList.add("is-done"));
    setWebStep(4);
    setAppStep(1);
  };

  if (reduceMotion) {
    showFinal();
    return;
  }

  if (!("IntersectionObserver" in window)) {
    start();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
      });
    },
    { threshold: 0.35 }
  );
  io.observe(whyRoot);
})();
