document.addEventListener('DOMContentLoaded', () => {
  // ---------- Elements ----------
  const userNameEl = document.getElementById('userName');
  const userLogoEl = document.getElementById('userLogo');
  const todayPill = document.getElementById('todayPill');
  function formatToday(d=new Date()){
    return d.toLocaleDateString(undefined,{weekday:'short', month:'short', day:'numeric'});
  }
  if (todayPill) todayPill.innerHTML = `<i class="fa-regular fa-calendar"></i> ${formatToday()}`;

  const bookingList = document.getElementById('bookingList');
  const serviceList = document.getElementById('serviceList');
  const earningsSummary = document.getElementById('earningsSummary');

  // ---------- Branding (new canonical, then legacy) ----------
  let branding = null;
  try { branding = JSON.parse(localStorage.getItem('branding') || 'null'); } catch {}
  if (!branding) {
    try {
      const legacy = JSON.parse(localStorage.getItem('soloschedule_branding') || 'null');
      if (legacy) {
        branding = {
          name: legacy.brandName || 'Your Business',
          theme: legacy.themeKey || null,
          // legacy logo may be icon class or data/http url
          icon: (legacy.logoUrl && legacy.logoUrl.startsWith('fa-')) ? legacy.logoUrl : null,
          logoDataUrl: (legacy.logoUrl && !legacy.logoUrl.startsWith('fa-')) ? legacy.logoUrl : null
        };
      }
    } catch {}
  }

  // Apply theme (supports both applyTheme + legacy applyThemeFromName)
  if (branding && branding.theme) {
    if (typeof applyTheme === 'function') {
      try { applyTheme(branding.theme); } catch {}
    } else if (typeof applyThemeFromName === 'function') {
      try { applyThemeFromName(branding.theme); } catch {}
    }
  }

  // Header: name + logo
  const bizName = (branding && (branding.name || branding.brandName)) || 'Your Business';
  userNameEl.textContent = `Welcome, ${bizName}`;

  if (branding?.logoDataUrl) {
    userLogoEl.innerHTML = `<img src="${branding.logoDataUrl}" alt="" />`;
  } else if (branding?.icon) {
    userLogoEl.innerHTML = `<i class="fas ${branding.icon}"></i>`;
  } else {
    // last resort: generic user
    userLogoEl.innerHTML = `<i class="fas fa-user"></i>`;
  }

  // Today pill (preserve icon)
  const fmt = new Intl.DateTimeFormat(undefined, { weekday:'short', month:'short', day:'numeric' });
  if (todayPill) todayPill.innerHTML = `<i class="fa-regular fa-calendar"></i> Today · ${fmt.format(new Date())}`;

  // ---------- Data (new keys, then legacy) ----------
  let services = [];
  try { services = JSON.parse(localStorage.getItem('services') || '[]'); } catch {}
  if (!services.length) {
    try { services = JSON.parse(localStorage.getItem('soloschedule_services') || '[]'); } catch {}
  }

  let bookings = [];
  try { bookings = JSON.parse(localStorage.getItem('bookings') || '[]'); } catch {}
  if (!bookings.length) {
    try { bookings = JSON.parse(localStorage.getItem('soloschedule_bookings') || '[]'); } catch {}
  }

  const servicePriceByName = Object.fromEntries(services.map(s => [s.name, Number(s.price) || 0]));

  function getLocalISODateString(d = new Date()) {
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset*60000).toISOString().slice(0,10);
  }

  function ensureBookingDefaults(b) {
    if (!b.id) b.id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
    if (!b.status) b.status = 'scheduled';
    if (!b.paidStatus) b.paidStatus = 'unpaid';
    if (typeof b.price === 'undefined') b.price = servicePriceByName[b.service] || 0;
    return b;
  }

  function saveBookings() {
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('soloschedule_bookings', JSON.stringify(bookings)); // keep legacy in sync during prototype
  }

  // ---------- Render ----------
  function renderBookings() {
    const today = getLocalISODateString();
    const todays = bookings.map(ensureBookingDefaults)
      .filter(b => b.date === today)
      .sort((a,b) => (a.time || '').localeCompare(b.time || ''));

    bookingList.innerHTML = '';

    const statusBadgeClass = (status) => ({
      scheduled:'badge-status-scheduled',
      in_progress:'badge-status-in_progress',
      completed:'badge-status-completed',
      no_show:'badge-status-no_show',
      late:'badge-status-late',
      canceled:'badge-status-canceled'
    }[status] || 'badge-status-scheduled');

    if (todays.length === 0) {
      bookingList.innerHTML = `
        <p>No bookings today.</p>
        <div style="margin-top:.5rem;">
          <a class="primary-btn" href="create-bookings.html">Create a booking</a>
        </div>`;
      renderEarnings([]); // zero
      return;
    }

    todays.forEach(b => {
      const card = document.createElement('div');
      card.className = 'card';

      const paidBadge = b.paidStatus === 'paid'
        ? `<span class="badge badge-paid">Paid</span>`
        : `<span class="badge badge-unpaid">Unpaid</span>`;

      const statusBadge = `<span class="badge ${statusBadgeClass(b.status)}">${b.status.replace('_',' ')}</span>`;

      card.innerHTML = `
        <div class="card-left">
          <div class="card-time">${b.time || '--:--'}</div>
          <div class="meta">
            <strong>${b.client || 'Client'}</strong>
            <span>${b.service || ''}</span>
            <div class="badges">
              ${statusBadge}
              ${paidBadge}
              ${b.price ? `<span class="badge" style="background:#F0F0F5;color:#333;">$${Number(b.price).toFixed(2)}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="card-right card-actions">
          <button class="kebab-btn" aria-label="More actions" aria-haspopup="true" aria-expanded="false" data-id="${b.id}">
            <i class="fas fa-ellipsis-vertical"></i>
          </button>
          <div class="card-menu" role="menu" data-menu-for="${b.id}">
            <button class="menu-row js-checkin"    role="menuitem" data-id="${b.id}"><i class="fa-solid fa-person-walking"></i> Check-in</button>
            <button class="menu-row js-complete"   role="menuitem" data-id="${b.id}"><i class="fa-solid fa-circle-check"></i> Complete</button>
            <button class="menu-row js-no-show"    role="menuitem" data-id="${b.id}"><i class="fa-solid fa-user-xmark"></i> No-show</button>
            <button class="menu-row js-late"       role="menuitem" data-id="${b.id}"><i class="fa-solid fa-clock"></i> Mark Late</button>
            <hr>
            <button class="menu-row js-cancel"     role="menuitem" data-id="${b.id}"><i class="fa-solid fa-ban"></i> Cancel</button>
            <button class="menu-row js-reschedule" role="menuitem" data-id="${b.id}"><i class="fa-solid fa-arrow-right-arrow-left"></i> Reschedule</button>
            <hr>
            <button class="menu-row js-toggle-paid" role="menuitem" data-id="${b.id}">
              <i class="fa-solid ${b.paidStatus === 'paid' ? 'fa-receipt' : 'fa-dollar-sign'}"></i>
              ${b.paidStatus === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
            </button>
            <button class="menu-row js-add-note"   role="menuitem" data-id="${b.id}"><i class="fa-solid fa-note-sticky"></i> Add Note</button>
            <button class="menu-row js-edit"       role="menuitem" data-id="${b.id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
          </div>
        </div>
      `;
      bookingList.appendChild(card);
    });

    renderEarnings(todays);
  }

  function renderEarnings(list) {
    const todays = list ?? bookings.filter(b => b.date === getLocalISODateString());
    const total = todays.filter(b => b.paidStatus === 'paid')
      .reduce((sum, b) => sum + (Number(b.price) || 0), 0);

    earningsSummary.innerHTML = `
      <div class="earnings-row total">
        <span>Total</span><span>$${total.toFixed(2)}</span>
      </div>`;
  }

  function renderServices() {
    if (!services.length) {
      serviceList.innerHTML = `<p>No services added.</p>`;
      return;
    }
    serviceList.innerHTML = '';
    services.slice(0,3).forEach(s => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="meta">
          <strong>${s.name}</strong>
          <span>${s.duration} min — $${Number(s.price||0).toFixed(2)}</span>
        </div>
        <button class="quick-link-button" onclick="location.href='services.html'">Edit</button>
      `;
      serviceList.appendChild(card);
    });
  }

  // ---------- Actions ----------
  function saveAndRerender() {
    saveBookings();
    renderBookings();
  }

  function updateBooking(id, changes) {
    const idx = bookings.findIndex(x => x.id === id);
    if (idx >= 0) {
      bookings[idx] = { ...bookings[idx], ...changes };
      saveAndRerender();
    }
  }

  // Menus (click + keyboard)
  bookingList.addEventListener('click', (e) => {
    const kebab = e.target.closest('.kebab-btn');
    if (kebab) {
      const id = kebab.dataset.id;
      document.querySelectorAll('.card-menu.open').forEach(m => m.classList.remove('open'));
      const menu = document.querySelector(`.card-menu[data-menu-for="${id}"]`);
      if (menu) {
        const isOpen = menu.classList.toggle('open');
        kebab.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
      return;
    }

    const row = e.target.closest('.menu-row');
    if (!row) return;
    const id = row.dataset.id;

    if (row.classList.contains('js-checkin'))  updateBooking(id, { status:'in_progress' });
    if (row.classList.contains('js-complete')) updateBooking(id, { status:'completed' });
    if (row.classList.contains('js-no-show'))  updateBooking(id, { status:'no_show' });
    if (row.classList.contains('js-late'))     updateBooking(id, { status:'late' });
    if (row.classList.contains('js-cancel'))   updateBooking(id, { status:'canceled' });

    // OPEN RESCHEDULE FLOW (fixed page name)
    if (row.classList.contains('js-reschedule')) {
      location.href = `create-bookings.html?id=${id}&reschedule=1`;
      return;
    }

    if (row.classList.contains('js-toggle-paid')) {
      const b = bookings.find(x => x.id === id);
      if (b) { b.paidStatus = (b.paidStatus === 'paid' ? 'unpaid' : 'paid'); saveAndRerender(); }
    }
    if (row.classList.contains('js-add-note')) {
      const b = bookings.find(x => x.id === id);
      location.href = `client-notes.html${b?.client ? `?client=${encodeURIComponent(b.client)}` : ''}`;
      return;
    }

    // OPEN EDIT (fixed page name)
    if (row.classList.contains('js-edit')) {
      location.href = `create-bookings.html?id=${id}`;
      return;
    }

    document.querySelectorAll('.card-menu.open').forEach(m => m.classList.remove('open'));
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.card-actions')) {
      document.querySelectorAll('.card-menu.open').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.kebab-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded','false'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.card-menu.open').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.kebab-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded','false'));
    }
  });

  // ---------- Init ----------
  bookings = bookings.map(ensureBookingDefaults);
  saveBookings();   // normalize to new + legacy keys
  renderBookings();
  renderServices();
});
