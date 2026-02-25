// v1: keep this minimal. Add only what you reuse often.

(function () {
  // Smooth scroll for in-page anchors (respects reduced motion)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const el = document.querySelector(id);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", id);
  });

  // CTA form placeholder handler (remove when wired to real backend)
  const form = document.querySelector(".cta-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]')?.value?.trim();
      if (!email) return;
      alert("Captured email (placeholder): " + email);
      form.reset();
    });
  }
})();
