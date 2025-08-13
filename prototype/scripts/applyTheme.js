// =============================================
// applyTheme.js – Full Theme Application Logic
// =============================================

(function applyStoredTheme() {
  const branding = JSON.parse(localStorage.getItem('soloschedule_branding'));
  if (!branding || !branding.themeKey) return;

  const theme = window.THEME_PROFILES?.[branding.themeKey];
  if (!theme) return;

  const root = document.documentElement;
  const body = document.body;

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Font + Typography
  root.style.setProperty('--font-family', theme.font);

  // Button tokens
  root.style.setProperty('--btn-radius', theme.buttons.borderRadius);
  root.style.setProperty('--btn-font-weight', theme.buttons.fontWeight);
  root.style.setProperty('--btn-font-size', theme.buttons.fontSize);
  root.style.setProperty('--btn-padding', theme.buttons.padding);
  root.style.setProperty('--btn-transform', theme.buttons.textTransform);

  // Effects
  root.style.setProperty('--transition', theme.effects.transition);
  root.style.setProperty('--shadow', theme.effects.shadow);

  // Layout class (for dashboard)
  body.classList.add(`layout-${theme.layout}`);

  // Component layout classes
  body.classList.add(
    `card-style-${theme.components.cardStyle}`,
    `calendar-style-${theme.components.calendarStyle}`,
    `booking-view-${theme.components.bookingView}`,
    `action-btn-${theme.components.actionButtonStyle}`
  );

  // Optional: hover lift (adds class if needed)
  if (theme.effects.hoverLift) {
    body.classList.add('hover-lift');
  } else {
    body.classList.remove('hover-lift');
  }
})();
