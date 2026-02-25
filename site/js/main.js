// Solva landing (minimal)
// - Smooth scroll for in-page anchors
// - Show/hide back-to-top button

(function () {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const el = document.querySelector(href);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", href);
  });

  const backToTop = document.querySelector(".back-to-top");
  if (!backToTop) return;

  const toggle = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    backToTop.style.opacity = y > 600 ? "1" : "0";
    backToTop.style.pointerEvents = y > 600 ? "auto" : "none";
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
})();
