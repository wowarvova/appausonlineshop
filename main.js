(() => {
  const stage = document.querySelector("[data-scroll-stage]");
  if (!stage) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress = stage.querySelector('[data-stage="progress"]');
  const hint = stage.querySelector('[data-stage="hint"]');
  const visual = stage.querySelector(".stage-visual");
  const shop = stage.querySelector('[data-parallax="shop"]');
  const arrow = stage.querySelector('[data-parallax="arrow"]');
  const phone = stage.querySelector('[data-parallax="phone"]');

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const map = (v, a, b) => clamp((v - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;

  if (reduceMotion) {
    if (progress) progress.style.width = "100%";
    if (visual) {
      visual.style.opacity = "1";
      visual.style.transform = "none";
    }
    if (arrow) arrow.style.opacity = "1";
    if (phone) phone.style.opacity = "1";
    return;
  }

  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = stage.getBoundingClientRect();
    const total = Math.max(stage.offsetHeight - window.innerHeight, 1);
    const scrolled = clamp(-rect.top / total);

    if (progress) progress.style.width = `${scrolled * 100}%`;

    // Text stays visible from the start.
    // Shop → phone block reveals with the previous scroll animation.
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
      // Hide as soon as the morph starts, so it never sits on top of it
      const fade = 1 - map(scrolled, 0.12, 0.22);
      hint.style.opacity = String(fade);
      hint.style.visibility = fade < 0.05 ? "hidden" : "visible";
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
