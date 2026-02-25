// scripts/create-bookings.js
document.addEventListener('DOMContentLoaded', () => {
  // ----- els
  const form           = document.getElementById('booking-form');
  const clientSelect   = document.getElementById('client-select');
  const newClientInput = document.getElementById('new-client-input');
  const serviceSelect  = document.getElementById('service-select');
  const dateInput      = document.getElementById('booking-date');
  const timeEl         = document.getElementById('booking-time'); // may be <input> or <select>
  const availabilityKey = 'soloschedule_availability';

  // ----- helpers
  const qp = new URLSearchParams(location.search);
  const editId = qp.get('id');                 // if present, we're editing/rescheduling
  const isReschedule = qp.has('reschedule');   // reschedule mode = lock client

  function localISODate(d = new Date()){
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off*60000).toISOString().slice(0,10);
  }
  const pad = n => String(n).padStart(2,'0');
  const toMin = (t) => { const [h,m] = (t || '00:00').split(':').map(Number); return h*60+m; };
  const toHHMM = (mins) => `${pad(Math.floor(mins/60))}:${pad(mins%60)}`;
  const floorToQuarter = (t) => toHHMM(Math.floor(toMin(t)/15)*15);
  const ceilToQuarter  = (t) => toHHMM(Math.ceil(toMin(t)/15)*15);

  function weekdayKey(dateStr){
    const d = new Date(dateStr + 'T00:00:00');
    const map = ['sun','mon','tue','wed','thu','fri','sat']; // JS 0=Sun
    return map[d.getDay()];
  }

  function nextRounded(step=15){
    const d = new Date(), m = d.getMinutes();
    d.setMinutes(m + (step - (m % step)) % step, 0, 0);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // If the HTML still uses <input type="time">, replace it with a <select>
  function ensureTimeSelect(el){
    if (!el) throw new Error('booking-time element missing');
    if (el.tagName === 'SELECT') return el;
    const sel = document.createElement('select');
    sel.id = el.id; sel.name = el.name || el.id;
    sel.className = el.className; // preserve styling
    sel.required = true;
    el.replaceWith(sel);
    return sel;
  }
  const timeSelect = ensureTimeSelect(timeEl);

  // ----- theme + branding
  let branding = null;
  try { branding = JSON.parse(localStorage.getItem('branding') || 'null'); } catch {}
  if (!branding) {
    try {
      const legacy = JSON.parse(localStorage.getItem('soloschedule_branding') || 'null');
      if (legacy) branding = { name: legacy.brandName, theme: legacy.themeKey };
    } catch {}
  }
  if (branding?.theme) {
    if (typeof applyTheme === 'function') { try { applyTheme(branding.theme); } catch {} }
    else if (typeof applyThemeFromName === 'function') { try { applyThemeFromName(branding.theme); } catch {} }
  }

  // ----- data: clients/services/bookings (new keys, then legacy)
  function loadJSON(key, fallbackKey){
    try {
      const a = JSON.parse(localStorage.getItem(key) || 'null');
      if (a) return a;
      if (fallbackKey) return JSON.parse(localStorage.getItem(fallbackKey) || 'null') || [];
      return [];
    } catch { return []; }
  }
  function getJSON(key, def){
    try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return (v===null?def:v); }
    catch { return def; }
  }

  let clients  = loadJSON('clients', 'soloschedule_clients');
  if (!Array.isArray(clients)) clients = [];
  let services = loadJSON('services', 'soloschedule_services');
  if (!Array.isArray(services)) services = [];
  let bookings = loadJSON('bookings', 'soloschedule_bookings');
  if (!Array.isArray(bookings)) bookings = [];

  // Map by service name for duration lookup (bookings store service by name)
  const serviceByName = Object.fromEntries(services.map(s => [s.name, s]));

  // ----- availability (weekly schedule)
  let availability = loadJSON(availabilityKey);
  if (!availability || typeof availability !== 'object') availability = {
    mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: []
  };
  // normalize availability to 15-min grid
  for (const k of Object.keys(availability)) {
    availability[k] = (availability[k]||[]).map(([a,b]) => [floorToQuarter(a), ceilToQuarter(b)]);
  }

  // ----- manual day blockouts
  let dayBlocks = getJSON('day_blocks', {}); // { 'YYYY-MM-DD': [ { type, start, end } ] }

  // ---- busy/availability math (aligns with My Day)
  function addServiceDuration(start, serviceName) {
    if (!start) return '00:00';
    const base = toMin(start);
    const dur = Math.max(0, Number(serviceByName[serviceName]?.duration) || 60);
    return toHHMM(base + dur);
  }
  function busyIntervalsForDate(dateKey, excludeBookingId){
    const blocks = (dayBlocks[dateKey] || []).map(bl => [toMin(floorToQuarter(bl.start)), toMin(ceilToQuarter(bl.end))]);

    const bks = bookings
      .filter(b => b.date === dateKey && b.status !== 'cancelled' && b.id !== excludeBookingId)
      .map(b => {
        const end = addServiceDuration(b.time || '00:00', b.service);
        return [toMin(b.time || '00:00'), toMin(end)];
      });

    const all = [...blocks, ...bks].sort((a,b)=>a[0]-b[0]);
    const merged = [];
    for (const iv of all) {
      if (!merged.length || iv[0] > merged[merged.length-1][1]) merged.push(iv);
      else merged[merged.length-1][1] = Math.max(merged[merged.length-1][1], iv[1]);
    }
    return merged;
  }
  function subtractBusyFromRange([aStart, aEnd], busyList) {
    const free = [];
    let cursor = aStart;
    for (const [s,e] of busyList) {
      if (e <= aStart || s >= aEnd) continue;
      if (s > cursor) free.push([cursor, Math.min(s, aEnd)]);
      cursor = Math.max(cursor, e);
      if (cursor >= aEnd) break;
    }
    if (cursor < aEnd) free.push([cursor, aEnd]);
    return free;
  }
  function mergeContiguous(segs){
    if (!segs.length) return [];
    const sorted = segs.slice().sort((a,b)=>a[0]-b[0] || a[1]-b[1]);
    const out = [sorted[0].slice()];
    for (let i=1;i<sorted.length;i++){
      const [s,e] = sorted[i];
      const last = out[out.length-1];
      if (s <= last[1]) last[1] = Math.max(last[1], e);
      else out.push([s,e]);
    }
    return out;
  }

  // ----- render selects
  function renderClientsUnlocked(){
    clientSelect.innerHTML = `
      <option value="">-- Select Client --</option>
      <option value="__add">+ Add New Client</option>
      ${clients.map(c => `<option value="${c}">${c}</option>`).join('')}
    `;
    clientSelect.disabled = false;
    clientSelect.removeAttribute('aria-disabled');
    if (newClientInput) {
      newClientInput.classList.add('hidden');
      newClientInput.value = '';
    }
  }

  function renderClientsLocked(name){
    clientSelect.innerHTML = `<option value="${name}">${name}</option>`;
    clientSelect.value = name;
    clientSelect.disabled = true;
    clientSelect.setAttribute('aria-disabled','true');
    if (newClientInput) {
      newClientInput.classList.add('hidden');
      newClientInput.value = '';
    }
  }

  function renderServices(){
    if (!services.length) {
      serviceSelect.innerHTML = `<option disabled selected>No services found. Add one first.</option>`;
      return;
    }
    serviceSelect.innerHTML = services
      .map((s, i) => `<option value="${i}">${s.name} – ${s.duration} min – $${Number(s.price||0).toFixed(2)}</option>`)
      .join('');
  }

  // Build time options strictly from availability − (bookings + blockouts)
  // Keep list strictly chronological. If the date is today, preselect the first
  // slot >= next quarter-hour; do NOT reorder the list.
  function buildTimesFromAvailability(select, dateStr, durationMin, excludeBookingId){
    const wk = weekdayKey(dateStr);
    const ranges = (availability[wk] || [])
      .map(([s,e]) => [toMin(s), toMin(e)])
      .sort((a,b)=>a[0]-b[0]);

    // Free segments after subtracting busy
    const busy = busyIntervalsForDate(dateStr, excludeBookingId);
    let free = [];
    for (const rng of ranges) free.push(...subtractBusyFromRange(rng, busy));
    free = mergeContiguous(free);

    // Assemble candidates on 15-min grid (chronological)
    let candidates = [];
    for (const [s,e] of free) {
      for (let m = s; m + durationMin <= e; m += 15) {
        candidates.push(m);
      }
    }
    candidates = [...new Set(candidates)].sort((a,b)=>a-b); // dedupe & chronological

    // Render
    select.innerHTML = '';
    const frag = document.createDocumentFragment();

    if (!candidates.length) {
      const opt = document.createElement('option');
      opt.disabled = true; opt.selected = true;
      opt.textContent = 'No available times';
      frag.appendChild(opt);
      select.appendChild(frag);
      select.disabled = true;
      return;
    }

    const values = candidates.map(toHHMM);
    values.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v; opt.textContent = v;
      frag.appendChild(opt);
    });
    select.appendChild(frag);
    select.disabled = false;

    // Preselect appropriate option
    let selectedIndex = 0;
    if (dateStr === localISODate()) {
      const nowM = toMin(nextRounded(15));
      const i = candidates.findIndex(m => m >= nowM);
      if (i >= 0) selectedIndex = i;
    }
    select.selectedIndex = selectedIndex;
  }

  // ----- default date/time
  dateInput.value = localISODate();
  dateInput.min   = localISODate();

  // initial renders
  renderServices();

  // initial times from availability (use selected service duration or fallback 15)
  function currentServiceDuration(){
    const idx = parseInt(serviceSelect.value, 10);
    const svc = Number.isInteger(idx) ? services[idx] : null;
    const dur = svc && Number(svc.duration) ? Number(svc.duration) : 15;
    return Math.max(15, Math.floor(dur/15)*15); // enforce multiple of 15
  }

  // ----- edit / reschedule prefill
  function findBooking(id){ return bookings.find(b => b.id === id); }
  const editing = editId ? findBooking(editId) : null;

  if (editing) {
    // Ensure client exists in list
    if (editing.client && !clients.includes(editing.client)) clients.push(editing.client);

    // Client select (lock if rescheduling)
    if (isReschedule) renderClientsLocked(editing.client || '');
    else { renderClientsUnlocked(); clientSelect.value = editing.client || ''; }

    // Services
    renderServices();
    const sIdx = services.findIndex(s => s.name === editing.service);
    if (sIdx >= 0) serviceSelect.value = String(sIdx);

    // Date
    if (editing.date) dateInput.value = editing.date;

    // Times (exclude this booking from conflicts so you can move it)
    const dur = currentServiceDuration();
    buildTimesFromAvailability(timeSelect, dateInput.value, dur, editId);

    // If existing time still valid, keep it selected
    if (editing.time && [...timeSelect.options].some(o => o.value === editing.time)) {
      timeSelect.value = editing.time;
    }
  } else {
    // New booking flow (not reschedule)
    renderClientsUnlocked();
    buildTimesFromAvailability(timeSelect, dateInput.value, currentServiceDuration(), null);
  }

  // Keep times in sync when date or service changes
  dateInput.addEventListener('change', () => {
    buildTimesFromAvailability(timeSelect, dateInput.value, currentServiceDuration(), editId || null);
  });
  serviceSelect.addEventListener('change', () => {
    buildTimesFromAvailability(timeSelect, dateInput.value, currentServiceDuration(), editId || null);
  });

  // ----- client add toggle (no-op in reschedule mode because the select is disabled)
  clientSelect.addEventListener('change', () => {
    if (clientSelect.disabled) return;
    if (clientSelect.value === '__add') {
      newClientInput.classList.remove('hidden');
      newClientInput.focus();
    } else {
      newClientInput.classList.add('hidden');
      newClientInput.value = '';
    }
  });

  // ----- submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // client (locked in reschedule mode)
    let clientName;
    if (isReschedule && editing) {
      clientName = editing.client || '';
    } else {
      clientName = clientSelect.value;
      if (clientName === '__add') {
        clientName = newClientInput.value.trim();
        if (!clientName) return alert('Enter client name.');
        if (!clients.includes(clientName)) {
          clients.push(clientName);
          localStorage.setItem('clients', JSON.stringify(clients));
          localStorage.setItem('soloschedule_clients', JSON.stringify(clients)); // legacy mirror
        }
      }
      if (!clientName) return alert('Select or add a client.');
    }

    // service
    const serviceIndex = parseInt(serviceSelect.value, 10);
    if (!Number.isInteger(serviceIndex) || !services[serviceIndex]) {
      return alert('Please choose a service.');
    }
    const svc = services[serviceIndex];
    const durationMin = currentServiceDuration();

    // date/time
    const date = dateInput.value;
    const time = timeSelect.value;
    if (!date || !time) return alert('Please choose date and time.');

    // Final guard: ensure chosen time still valid against availability + bookings + blockouts
    const tmpSel = document.createElement('select');
    buildTimesFromAvailability(tmpSel, date, durationMin, editId || null);
    if (![...tmpSel.options].some(o => o.value === time)) {
      return alert('Selected time is no longer available. Please choose another.');
    }

    // payload
    const payload = {
      client: clientName,
      service: svc.name,
      price: Number(svc.price) || 0,
      date, time
    };

    if (editId) {
      const idx = bookings.findIndex(b => b.id === editId);
      if (idx >= 0) {
        bookings[idx] = {
          ...bookings[idx],
          ...payload,
          status: 'scheduled' // reset on reschedule/edit
        };
      }
    } else {
      bookings.push({
        id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random())),
        status: 'scheduled',
        paidStatus: 'unpaid',
        ...payload
      });
    }

    // persist (new + legacy keys during prototype)
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('soloschedule_bookings', JSON.stringify(bookings));

    // back to dashboard
    window.location.href = 'dashboard.html';
  });

  // Ensure selects are rendered if we reached here via edit path first
  // (no-op in reschedule mode where client is locked)
  if (!editing) {
    // only for new booking path
    renderClientsUnlocked();
    renderServices();
  }
});
