(() => {
  const stage = document.querySelector("[data-scroll-stage]");
  if (!stage) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const brand = stage.querySelector('[data-stage="brand"]');
  const words = [...stage.querySelectorAll(".stage-headline .word")];
  const sub = stage.querySelector('[data-stage="sub"]');
  const visual = stage.querySelector('[data-stage="visual"]');
  const hint = stage.querySelector('[data-stage="hint"]');
  const bg = stage.querySelector('[data-stage="bg"]');
  const progress = stage.querySelector('[data-stage="progress"]');
  const arrow = stage.querySelector(".morph__arrow");
  const shop = stage.querySelector(".morph__shop");
  const phone = stage.querySelector(".morph__phone");
  const brandMark = stage.querySelector(".stage-brand__mark");

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const map = (v, a, b) => clamp((v - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;

  const setOpacityTransform = (el, opacity, y = 0, extra = "") => {
    if (!el) return;
    el.style.opacity = String(opacity);
    el.style.transform = `translateY(${y}px)${extra ? ` ${extra}` : ""}`;
  };

  if (reduceMotion) {
    setOpacityTransform(brand, 1, 0);
    words.forEach((w) => setOpacityTransform(w, 1, 0, "rotate(0deg)"));
    setOpacityTransform(sub, 1, 0);
    setOpacityTransform(visual, 1, 0, "scale(1)");
    setOpacityTransform(hint, 0.7, 0);
    if (bg) bg.style.opacity = "1";
    if (progress) progress.style.width = "100%";
    if (arrow) arrow.style.opacity = "1";
    return;
  }

  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = stage.getBoundingClientRect();
    const total = stage.offsetHeight - window.innerHeight;
    const scrolled = clamp(-rect.top / Math.max(total, 1));

    if (progress) progress.style.width = `${scrolled * 100}%`;

    // 0–0.12 background
    const bgT = map(scrolled, 0, 0.12);
    if (bg) {
      bg.style.opacity = String(bgT);
      bg.style.transform = `scale(${lerp(1.04, 1, bgT)})`;
    }

    // 0.02–0.14 brand
    const brandT = map(scrolled, 0.02, 0.14);
    setOpacityTransform(brand, brandT, lerp(18, 0, brandT));
    if (brandMark) {
      brandMark.style.boxShadow = `0 0 ${lerp(0, 18, brandT)}px ${lerp(0, 8, brandT)}px rgba(200, 241, 53, ${0.45 * brandT})`;
    }

    // 0.12–0.42 headline words stagger
    words.forEach((word, i) => {
      const start = 0.12 + i * 0.035;
      const t = map(scrolled, start, start + 0.1);
      const y = lerp(28, 0, t);
      const rot = lerp(2.2, 0, t);
      word.style.opacity = String(t);
      word.style.transform = `translateY(${y}px) rotate(${rot}deg)`;
    });

    // 0.38–0.52 sub
    const subT = map(scrolled, 0.38, 0.52);
    setOpacityTransform(sub, subT, lerp(24, 0, subT));

    // 0.48–0.72 visual
    const visT = map(scrolled, 0.48, 0.68);
    if (visual) {
      visual.style.opacity = String(visT);
      visual.style.transform = `translateY(${lerp(40, 0, visT)}px) scale(${lerp(0.96, 1, visT)})`;
    }

    if (shop) {
      const shopT = map(scrolled, 0.5, 0.7);
      shop.style.transform = `translateX(${lerp(-12, 0, shopT)}px) rotate(${lerp(-2, 0, shopT)}deg)`;
    }

    if (arrow) {
      const arrowT = map(scrolled, 0.58, 0.72);
      arrow.style.opacity = String(arrowT);
      arrow.style.transform = `translateX(${lerp(-10, 0, arrowT)}px)`;
    }

    if (phone) {
      const phoneT = map(scrolled, 0.62, 0.78);
      phone.style.transform = `translateX(${lerp(16, 0, phoneT)}px) rotate(${lerp(4, 0, phoneT)}deg) scale(${lerp(0.92, 1, phoneT)})`;
      phone.style.opacity = String(lerp(0.35, 1, phoneT));
    }

    // Hint: visible early, fades when visual settles
    const hintIn = map(scrolled, 0.08, 0.18);
    const hintOut = 1 - map(scrolled, 0.7, 0.85);
    const hintT = hintIn * hintOut;
    if (hint) {
      hint.style.opacity = String(hintT * 0.85);
      hint.style.transform = `translateX(-50%) translateY(${lerp(12, 0, hintIn)}px)`;
    }
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
