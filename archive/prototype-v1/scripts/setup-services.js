document.addEventListener('DOMContentLoaded', () => {
  const bizTitleEl   = document.getElementById('biz-title');
  const nameInput    = document.getElementById('service-name');
  const durationInput= document.getElementById('duration');
  const priceInput   = document.getElementById('price');
  const addBtn       = document.getElementById('addServiceBtn');
  const continueBtn  = document.getElementById('continueBtn');
  const listEl       = document.getElementById('service-items');

  // ---- Load branding (new canonical key, then legacy) ----
  let branding = null;
  try { branding = JSON.parse(localStorage.getItem('branding') || 'null'); } catch {}
  if (!branding) {
    try {
      const legacy = JSON.parse(localStorage.getItem('soloschedule_branding') || 'null');
      if (legacy) {
        branding = { name: legacy.brandName, theme: legacy.themeKey };
      }
    } catch {}
  }

  // Apply theme if available (supports new applyTheme + legacy applyThemeFromName)
  if (branding && branding.theme) {
    if (typeof applyTheme === 'function') {
      try { applyTheme(branding.theme); } catch {}
    } else if (typeof applyThemeFromName === 'function') {
      try { applyThemeFromName(branding.theme); } catch {}
    }
  }

  // Set business title
  bizTitleEl.textContent = (branding && (branding.name || branding.brandName)) || 'Your Business';

  // ---- Services state ----
  let services = [];
  try { services = JSON.parse(localStorage.getItem('services') || '[]'); } catch {}
  if (!services.length) {
    try { services = JSON.parse(localStorage.getItem('soloschedule_services') || '[]'); } catch {}
  }

  // ---- Helpers ----
  function validateInputs() {
    const name = nameInput.value.trim();
    const duration = parseInt(durationInput.value, 10);
    const price = parseFloat(priceInput.value);

    if (!name) return { ok:false, msg:'Please enter a service name.' };
    if (!Number.isFinite(duration) || duration <= 0) return { ok:false, msg:'Duration must be a positive number.' };
    if (!Number.isFinite(price) || price < 0) return { ok:false, msg:'Price must be zero or more.' };
    return { ok:true, name, duration, price };
  }

  function updateContinueState() {
    const has = services.length > 0;
    continueBtn.setAttribute('aria-disabled', has ? 'false' : 'true');
    continueBtn.disabled = !has;
  }

  function renderList() {
    listEl.innerHTML = '';
    services.forEach((s, i) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span><strong>${s.name}</strong> — ${s.duration} min — $${Number(s.price).toFixed(2)}</span>
        <button class="inline-remove-btn" data-index="${i}" aria-label="Remove ${s.name}">Remove</button>
      `;
      listEl.appendChild(li);
    });

    listEl.querySelectorAll('.inline-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        services.splice(idx, 1);
        renderList();
        updateContinueState();
        persistServices();
      });
    });
  }

  function persistServices() {
    localStorage.setItem('services', JSON.stringify(services));
    // keep legacy key in step with new key during prototype
    localStorage.setItem('soloschedule_services', JSON.stringify(services));
  }

  // ---- Events ----
  addBtn.addEventListener('click', () => {
    const res = validateInputs();
    if (!res.ok) { alert(res.msg); return; }

    services.push({ name: res.name, duration: res.duration, price: res.price });
    persistServices();
    renderList();
    updateContinueState();

    nameInput.value = '';
    durationInput.value = '';
    priceInput.value = '';
    nameInput.focus();
  });

  continueBtn.addEventListener('click', () => {
    if (services.length === 0) { alert('Please add at least one service.'); return; }
    // go to dashboard
    window.location.href = 'dashboard.html';
  });

  // Prevent accidental negative values
  [durationInput, priceInput].forEach(input => {
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      if (Number.isFinite(v) && v < 0) input.value = '';
    });
  });

  // ---- Init ----
  renderList();
  updateContinueState();
});
