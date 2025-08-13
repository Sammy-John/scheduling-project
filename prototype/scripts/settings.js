// settings.js – SoloSchedule
document.addEventListener('DOMContentLoaded', () => {
  // ---- Theme (keep consistent with prototype)
  const branding = readJSON('soloschedule_branding') || {};
  try {
    if (branding.themeKey && typeof applyThemeFromName === 'function') {
      applyThemeFromName(branding.themeKey);
    }
  } catch {}

  // ---- Elements
  const brandNameInput   = document.getElementById('brand-name');
  const openBrandingBtn  = document.getElementById('openBrandingSetup');

  const timeStepSelect   = document.getElementById('time-step');
  const pref24h          = document.getElementById('pref-24h');
  const prefWeekMonday   = document.getElementById('pref-week-monday');

  const exportBtn        = document.getElementById('exportBtn');
  const importFile       = document.getElementById('importFile');
  const resetDemoBtn     = document.getElementById('resetDemoBtn');

  // ---- Branding name
  brandNameInput.value = branding.brandName || '';
  brandNameInput.addEventListener('input', () => {
    const name = brandNameInput.value.trim();
    const next = { ...branding, brandName: name };
    localStorage.setItem('soloschedule_branding', JSON.stringify(next));
  });

  openBrandingBtn.addEventListener('click', () => {
    window.location.href = 'setup-branding.html';
  });

  // ---- Preferences (stored for future use, non-breaking now)
  const DEFAULT_STEP = 15;
  const step = Number(localStorage.getItem('soloschedule_timeStep') || DEFAULT_STEP);
  timeStepSelect.value = String(step);
  timeStepSelect.addEventListener('change', () => {
    localStorage.setItem('soloschedule_timeStep', timeStepSelect.value);
    // Heads-up only: Create Booking currently uses 15 min; can be wired later.
    toast('Saved. (Time step will apply where supported.)');
  });

  const is24 = localStorage.getItem('soloschedule_timeFormat') === '24';
  pref24h.checked = is24;
  pref24h.addEventListener('change', () => {
    localStorage.setItem('soloschedule_timeFormat', pref24h.checked ? '24' : '12');
    toast('Saved.');
  });

  const weekStartsMon = (localStorage.getItem('soloschedule_weekStart') || 'mon') === 'mon';
  prefWeekMonday.checked = weekStartsMon;
  prefWeekMonday.addEventListener('change', () => {
    localStorage.setItem('soloschedule_weekStart', prefWeekMonday.checked ? 'mon' : 'sun');
    toast('Saved.');
  });

  // ---- Export
  exportBtn.addEventListener('click', () => {
    const payload = {
      soloschedule_branding:        readJSON('soloschedule_branding'),
      soloschedule_services:        readJSON('soloschedule_services'),
      soloschedule_bookings:        readJSON('soloschedule_bookings'),
      soloschedule_clients:         readJSON('soloschedule_clients'),
      soloschedule_clientNotes:     readJSON('soloschedule_clientNotes'),
      // preferences
      soloschedule_timeStep:        localStorage.getItem('soloschedule_timeStep'),
      soloschedule_timeFormat:      localStorage.getItem('soloschedule_timeFormat'),
      soloschedule_weekStart:       localStorage.getItem('soloschedule_weekStart')
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
    a.href = URL.createObjectURL(blob);
    a.download = `soloschedule-export-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // ---- Import
  importFile.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Write known keys if present
      writeIf(data, 'soloschedule_branding');
      writeIf(data, 'soloschedule_services');
      writeIf(data, 'soloschedule_bookings');
      writeIf(data, 'soloschedule_clients');
      writeIf(data, 'soloschedule_clientNotes');

      // prefs
      writeIfRaw(data, 'soloschedule_timeStep');
      writeIfRaw(data, 'soloschedule_timeFormat');
      writeIfRaw(data, 'soloschedule_weekStart');

      toast('Import complete. Reloading…');
      setTimeout(() => location.reload(), 400);
    } catch (err) {
      alert('Import failed. Please select a valid SoloSchedule JSON export.');
      console.error(err);
    } finally {
      importFile.value = '';
    }
  });

  // ---- Reset demo data
  resetDemoBtn.addEventListener('click', () => {
    if (!confirm('This will clear demo data (bookings, clients, services, notes, prefs). Keep theme?')) return;

    // Keep branding so colors remain; clear usage data + prefs
    localStorage.removeItem('soloschedule_services');
    localStorage.removeItem('soloschedule_bookings');
    localStorage.removeItem('soloschedule_clients');
    localStorage.removeItem('soloschedule_clientNotes');

    localStorage.removeItem('soloschedule_timeStep');
    localStorage.removeItem('soloschedule_timeFormat');
    localStorage.removeItem('soloschedule_weekStart');

    toast('Data cleared.');
    setTimeout(() => location.reload(), 400);
  });

  // ---- helpers
  function readJSON(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
  }
  function writeIf(obj, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      localStorage.setItem(key, JSON.stringify(obj[key]));
    }
  }
  function writeIfRaw(obj, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const v = obj[key];
      if (v === null || typeof v === 'undefined') localStorage.removeItem(key);
      else localStorage.setItem(key, String(v));
    }
  }
  function toast(msg) {
    // lightweight inline toast
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.bottom = '18px';
    el.style.transform = 'translateX(-50%)';
    el.style.background = 'var(--color-text)';
    el.style.color = '#fff';
    el.style.padding = '8px 12px';
    el.style.borderRadius = '10px';
    el.style.fontSize = '0.9rem';
    el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    el.style.zIndex = '9999';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
});
