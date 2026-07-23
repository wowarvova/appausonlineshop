(() => {
  const stage = document.querySelector("[data-scroll-stage]");
  if (!stage) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress = stage.querySelector('[data-stage="progress"]');
  const hint = stage.querySelector('[data-stage="hint"]');
  const shop = stage.querySelector('[data-parallax="shop"]');
  const arrow = stage.querySelector('[data-parallax="arrow"]');
  const phone = stage.querySelector('[data-parallax="phone"]');

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const map = (v, a, b) => clamp((v - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;

  if (reduceMotion) {
    if (progress) progress.style.width = "100%";
    return;
  }

  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = stage.getBoundingClientRect();
    const total = Math.max(stage.offsetHeight - window.innerHeight, 1);
    const scrolled = clamp(-rect.top / total);

    if (progress) progress.style.width = `${scrolled * 100}%`;

    // Content stays fully readable — motion only layers on top
    if (shop) {
      const t = map(scrolled, 0, 0.55);
      shop.style.transform = `translateY(${lerp(0, -18, t)}px) rotate(${lerp(0, -1.5, t)}deg)`;
    }

    if (arrow) {
      const t = map(scrolled, 0.1, 0.65);
      arrow.style.transform = `translateX(${lerp(0, 8, t)}px)`;
      arrow.style.opacity = String(lerp(0.55, 1, t));
    }

    if (phone) {
      const t = map(scrolled, 0.15, 0.8);
      phone.style.transform = `translateY(${lerp(0, -28, t)}px) rotate(${lerp(0, 2, t)}deg) scale(${lerp(1, 1.04, t)})`;
    }

    if (hint) {
      const fade = 1 - map(scrolled, 0.55, 0.85);
      hint.style.opacity = String(fade);
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
