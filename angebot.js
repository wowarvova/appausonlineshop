(() => {
  const form = document.getElementById("offer-form");
  if (!form) return;

  const config = window.APPAUSONLINESHOP || {};
  const email = (config.offerEmail || "").trim();
  const nextInput = document.getElementById("offer-next");

  if (email) {
    form.action = `https://formsubmit.co/${encodeURIComponent(email)}`;
  }
  if (nextInput) {
    nextInput.value = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}danke.html`;
  }

  form.addEventListener("submit", (e) => {
    if (!email) {
      e.preventDefault();
      alert("Anfrage-E-Mail ist noch nicht konfiguriert (config.js → offerEmail).");
      return;
    }

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

    ensureHidden("Funktionen", joinChecked("features") || "—");

    form.querySelectorAll('input[type="checkbox"]').forEach((el) => {
      el.disabled = true;
    });
  });
})();
