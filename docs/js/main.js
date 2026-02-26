// Solva landing (minimal)
// - Smooth scroll for in-page anchors
// - Show/hide back-to-top button

(function () {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const navClose = document.querySelector(".nav-close");
  const navBackdrop = document.querySelector(".nav-backdrop");

  const setNavOpen = (open) => {
    body.classList.toggle("nav-open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
    if (mobileNav) mobileNav.setAttribute("aria-hidden", String(!open));
  };

  if (navToggle && mobileNav) {
    setNavOpen(false);
    if (window.location.hash === "#menu" || window.location.hash === "#mobile-nav") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    navToggle.addEventListener("click", () => {
      setNavOpen(!body.classList.contains("nav-open"));
    });

    if (navClose) {
      navClose.addEventListener("click", () => setNavOpen(false));
    }

    if (navBackdrop) {
      navBackdrop.addEventListener("click", () => setNavOpen(false));
    }

    mobileNav.addEventListener("click", (e) => {
      if (e.target.closest(".nav-link")) {
        setNavOpen(false);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setNavOpen(false);
      }
    });
  }

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
  if (backToTop) {
    const toggle = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      backToTop.style.opacity = y > 600 ? "1" : "0";
      backToTop.style.pointerEvents = y > 600 ? "auto" : "none";
    };

    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }
})();
