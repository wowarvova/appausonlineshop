(() => {
  const root = document.querySelector("[data-wizard]");
  if (!root) return;

  const form = root.querySelector("[data-wizard-form]");
  const bar = root.querySelector("[data-wizard-bar]");
  const label = root.querySelector("[data-wizard-label]");
  const shopifyField = root.querySelector("[data-wizard-shopify]");
  const replyto = root.querySelector("[data-wizard-replyto]");
  const emailInput = root.querySelector("[data-wizard-email]");
  const summary = root.querySelector("[data-wizard-summary]");
  const featAll = root.querySelector("[data-feat-all]");
  const featItems = [...root.querySelectorAll("[data-feat]")];

  const panels = {
    0: root.querySelector('[data-wizard-step="0"]'),
    1: root.querySelector('[data-wizard-step="1"]'),
    2: root.querySelector('[data-wizard-step="2"]'),
    3: root.querySelector('[data-wizard-step="3"]'),
    blocked: root.querySelector('[data-wizard-step="blocked"]'),
  };

  let step = 0;
  const total = 4;

  const show = (next) => {
    step = next;
    Object.entries(panels).forEach(([key, el]) => {
      if (!el) return;
      const active = String(key) === String(next);
      el.hidden = !active;
      el.classList.toggle("is-active", active);
    });

    const blocked = next === "blocked";
    if (label) {
      label.hidden = blocked;
      if (!blocked) label.textContent = `Schritt ${Number(next) + 1} von ${total}`;
    }
    if (bar) {
      const pct = blocked ? 100 : ((Number(next) + 1) / total) * 100;
      bar.style.width = `${pct}%`;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  root.querySelectorAll("[data-shopify]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-shopify");
      if (shopifyField) shopifyField.value = value === "ja" ? "Ja" : "Nein";
      if (value === "nein") {
        show("blocked");
        return;
      }
      show(1);
    });
  });

  root.querySelectorAll("[data-wizard-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (step === 1) show(0);
      else if (typeof step === "number" && step > 0) show(step - 1);
    });
  });

  root.querySelectorAll("[data-wizard-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = panels[step];
      if (!panel) return;
      const fields = [...panel.querySelectorAll("input, textarea, select")].filter(
        (el) => el.name && !el.classList.contains("wizard__honey")
      );
      for (const field of fields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return;
        }
      }
      if (step === 2) {
        const any =
          (featAll && featAll.checked) || featItems.some((el) => el.checked);
        if (!any) {
          window.alert("Bitte wählen Sie mindestens eine Funktion aus.");
          return;
        }
      }
      if (typeof step === "number") show(step + 1);
    });
  });

  if (featAll) {
    featAll.addEventListener("change", () => {
      featItems.forEach((el) => {
        el.checked = featAll.checked;
      });
    });
  }

  featItems.forEach((el) => {
    el.addEventListener("change", () => {
      if (!featAll) return;
      featAll.checked = featItems.every((item) => item.checked);
    });
  });

  form?.addEventListener("submit", (event) => {
    const panel = panels[3];
    if (panel) {
      const fields = [...panel.querySelectorAll("input, textarea")].filter(
        (el) => el.name && !el.classList.contains("wizard__honey")
      );
      for (const field of fields) {
        if (!field.checkValidity()) {
          event.preventDefault();
          field.reportValidity();
          return;
        }
      }
    }

    if (replyto && emailInput) replyto.value = emailInput.value;

    const data = new FormData(form);
    const vorname = data.get("Vorname") || "";
    const nachname = data.get("Nachname") || "";
    const email = data.get("E-Mail") || "";
        const features = data.getAll("Funktionen");
    const extras = data.get("Extra-Wünsche") || "—";
    const website = data.get("Website") || "";
    const instagram = data.get("Instagram") || "—";
    const revenue = data.get("Geschätzter monatlicher Umsatz") || "";
    const budget = data.get("Budget für die App") || "";
    const shopify = data.get("Shopify") || "Ja";

    if (summary) {
      summary.value = [
        "Neue Angebotsanfrage über appausonlineshop.de",
        "",
        "Shopify: " + shopify,
        "",
        "Kontakt",
        "Name: " + vorname + " " + nachname,
        "E-Mail: " + email,
        "",
        "Gewünschte Funktionen",
        features.length ? features.map((f) => "• " + f).join("\n") : "• —",
        "Extra-Wünsche: " + extras,
        "",
        "Unternehmen",
        "Website: " + website,
        "Instagram: " + instagram,
        "Geschätzter monatlicher Umsatz: " + revenue,
        "Budget für die App: " + budget,
        "",
        "Bitte melden Sie sich mit einem unverbindlichen Angebot.",
      ].join("\n");
    }
  });

  show(0);
})();
