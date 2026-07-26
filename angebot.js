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
    }
  });
})();
