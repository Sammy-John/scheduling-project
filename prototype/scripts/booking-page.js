document.addEventListener('DOMContentLoaded', () => {
  // Theme (if applyTheme is present)
  try {
    const branding = JSON.parse(localStorage.getItem('branding') || 'null')
      || JSON.parse(localStorage.getItem('soloschedule_branding') || 'null');
    const theme = branding?.theme || branding?.themeKey;
    if (theme) {
      if (typeof applyTheme === 'function') applyTheme(theme);
      else if (typeof applyThemeFromName === 'function') applyThemeFromName(theme);
    }
  } catch {}

  // Data
  const services = JSON.parse(localStorage.getItem('services')) 
                || JSON.parse(localStorage.getItem('soloschedule_services')) || [];
  let bookings  = JSON.parse(localStorage.getItem('bookings')) 
                || JSON.parse(localStorage.getItem('soloschedule_bookings')) || [];

  // Ensure defaults so we don't lose fields on edit
  const priceByService = Object.fromEntries(services.map(s => [s.name, Number(s.price) || 0]));
  function ensureDefaults(b) {
    if (!b.id) b.id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
    if (!b.status) b.status = 'scheduled';
    if (!b.paidStatus) b.paidStatus = 'unpaid';
    if (typeof b.price === 'undefined') b.price = priceByService[b.service] ?? 0;
    return b;
  }
  bookings = bookings.map(ensureDefaults);
  persist();

  // DOM
  const list = document.getElementById('bookings-list');
  const modal = document.getElementById('editModal');
  const editClient  = document.getElementById('edit-client');
  const editService = document.getElementById('edit-service');
  const editDate    = document.getElementById('edit-date');
  const editTime    = document.getElementById('edit-time');
  const saveBtn     = document.getElementById('saveEditBtn');
  const cancelBtn   = document.getElementById('cancelEditBtn');

  let editingId = null;

  // Render
  function render() {
    if (!bookings.length) {
      list.innerHTML = `<p>No bookings found. <a href="create-booking.html">Create one</a>.</p>`;
      return;
    }

    // Sort by real date+time
    const toStamp = (b) => new Date(`${b.date}T${(b.time||'00:00')}:00`).getTime();
    const sorted = [...bookings].sort((a,b) => toStamp(a) - toStamp(b));

    list.innerHTML = '';
    sorted.forEach(b => {
      const card = document.createElement('div');
      card.className = 'booking-card';
      card.dataset.id = b.id;
      card.innerHTML = `
        <div class="booking-info">
          <div class="client"><i class="fas fa-user"></i> <strong>${b.client}</strong></div>
          <div class="meta">
            <span><i class="fas fa-calendar-alt"></i> ${b.date}</span>
            <span><i class="fas fa-clock"></i> ${b.time || '--:--'}</span>
          </div>
          <div class="service"><i class="fas fa-briefcase"></i> ${b.service}</div>
        </div>
        <div class="booking-actions">
          <button class="booking-edit-btn" title="Edit" aria-label="Edit booking"><i class="fas fa-edit"></i></button>
          <button class="booking-delete-btn" title="Delete" aria-label="Delete booking"><i class="fas fa-trash"></i></button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  // Events: delegation for edit/delete
  list.addEventListener('click', (e) => {
    const card = e.target.closest('.booking-card');
    if (!card) return;
    const id = card.dataset.id;

    if (e.target.closest('.booking-delete-btn')) {
      if (confirm('Delete this booking?')) {
        bookings = bookings.filter(b => b.id !== id);
        persist();
        render();
      }
      return;
    }

    if (e.target.closest('.booking-edit-btn')) {
      openModal(id);
    }
  });

  // Modal open/fill
  function openModal(id) {
    const b = bookings.find(x => x.id === id);
    if (!b) return;
    editingId = id;

    // Fill fields
    editClient.value = b.client || '';
    editDate.value   = b.date || '';
    editTime.value   = b.time || '';

    // Services list
    editService.innerHTML = services.map(
      (s, i) => `<option value="${i}" ${s.name === b.service ? 'selected' : ''}>
        ${s.name} – ${s.duration} min – $${Number(s.price||0).toFixed(2)}
      </option>`
    ).join('');

    showModal();
  }

  // Save edit (preserve id/status/paidStatus; refresh price if service changed)
  saveBtn.addEventListener('click', () => {
    if (!editingId) return;

    const idx = bookings.findIndex(b => b.id === editingId);
    if (idx < 0) return;

    const svc = services[parseInt(editService.value, 10)];
    const updated = {
      client: editClient.value.trim(),
      service: svc?.name || '',
      date: editDate.value,
      time: editTime.value,
    };

    if (!updated.client || !updated.service || !updated.date || !updated.time) {
      alert('All fields are required.');
      return;
    }

    const old = bookings[idx];
    bookings[idx] = {
      ...old,
      ...updated,
      price: Number(svc?.price ?? old.price ?? 0),
    };

    persist();
    closeModal();
    render();
  });

  // Modal UX
  function showModal() {
    modal.classList.remove('hidden');
    modal.focus();
    document.addEventListener('keydown', onEsc);
    modal.addEventListener('click', onOverlay);
  }
  function closeModal() {
    modal.classList.add('hidden');
    document.removeEventListener('keydown', onEsc);
    modal.removeEventListener('click', onOverlay);
    editingId = null;
  }
  function onEsc(e){ if (e.key === 'Escape') closeModal(); }
  function onOverlay(e){ if (e.target === modal) closeModal(); }
  cancelBtn.addEventListener('click', closeModal);

  // Persist to both keys during prototype
  function persist() {
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('soloschedule_bookings', JSON.stringify(bookings));
  }

  // Kickoff
  render();
});
