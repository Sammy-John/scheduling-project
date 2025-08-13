// scripts/index.js
(function () {
  // detect saved branding (supports both new "branding" object and legacy keys)
  let branding = null;
  try { branding = JSON.parse(localStorage.getItem("branding") || "null"); } catch {}

  if (!branding) {
    const legacyName = localStorage.getItem("bizName");
    const legacyTheme = localStorage.getItem("selectedTheme");
    if (legacyName || legacyTheme) {
      branding = { name: legacyName || "", theme: legacyTheme || "" };
    }
  }

  // if we have a saved theme and applyTheme exists, apply it for an on-brand welcome
  const themeKey = (branding && (branding.theme || branding.selectedTheme)) || null;
  if (themeKey && typeof applyTheme === "function") {
    try { applyTheme(themeKey); } catch {}
  }

  // Secondary CTA: "Open {Business}"
  const openBtn = document.getElementById("openBrandBtn");
  if (branding) {
    const name = branding.name || branding.bizName || "Dashboard";
    openBtn.textContent = `Open ${name}`;
    openBtn.classList.remove("hidden");
  }
})();
