(() => {
  const form = document.getElementById("offer-form");
  if (!form) return;

  const config = window.APPAUSONLINESHOP || {};
  const email = (config.offerEmail || "").trim();
  const steps = [...form.querySelectorAll("[data-offer-step]")];
  const prevBtn = document.getElementById("offer-prev");
  const nextBtn = document.getElementById("offer-next-btn");
  const submitBtn = document.getElementById("offer-submit");
  const progressBar = document.getElementById("offer-progress-bar");
  const stepLabel = document.getElementById("offer-step-label");
  const nextInput = document.getElementById("offer-next");

  let index = 0;
  const total = steps.length;

  if (email) {
    form.action = `https://formsubmit.co/${encodeURIComponent(email)}`;
  }
  if (nextInput) {
    nextInput.value = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}danke.html`;
  }

  const showStep = (i) => {
    index = i;
    steps.forEach((step, n) => {
      const active = n === index;
      step.classList.toggle("is-active", active);
      step.hidden = !active;
    });
    if (prevBtn) prevBtn.hidden = index === 0;
    if (nextBtn) nextBtn.hidden = index === total - 1;
    if (submitBtn) submitBtn.hidden = index !== total - 1;
    if (progressBar) progressBar.style.width = `${((index + 1) / total) * 100}%`;
    if (stepLabel) stepLabel.textContent = `Schritt ${index + 1} von ${total}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateStep = () => {
    const step = steps[index];
    const required = [...step.querySelectorAll("[required]")];
    for (const field of required) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    if (index === 2) {
      const platforms = [...form.querySelectorAll('input[name="platform"]:checked')];
      if (!platforms.length) {
        alert("Bitte mindestens eine Plattform wählen (iOS und/oder Android).");
        return false;
      }
    }
    return true;
  };

  nextBtn?.addEventListener("click", () => {
    if (!validateStep()) return;
    if (index < total - 1) showStep(index + 1);
  });

  prevBtn?.addEventListener("click", () => {
    if (index > 0) showStep(index - 1);
  });

  form.addEventListener("submit", (e) => {
    if (!email) {
      e.preventDefault();
      alert("Anfrage-E-Mail ist noch nicht konfiguriert (config.js → offerEmail).");
      return;
    }
    if (!validateStep()) {
      e.preventDefault();
      return;
    }

    // Flatten checkbox groups into single text fields for a clean email table
    const joinChecked = (name) =>
      [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((el) => el.value).join(", ");

    const ensureHidden = (name, value) => {
      let input = form.querySelector(`input[type="hidden"][name="${name}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.appendChild(input);
      }
      input.value = value;
    };

    ensureHidden("Plattformen", joinChecked("platform") || "—");
    ensureHidden("Developer_Accounts", joinChecked("accounts") || "—");
    ensureHidden("Funktionen", joinChecked("features") || "—");

    // Disable raw checkbox arrays so FormSubmit doesn't get messy duplicates
    form.querySelectorAll('input[type="checkbox"]').forEach((el) => {
      el.disabled = true;
    });
  });

  showStep(0);
})();
