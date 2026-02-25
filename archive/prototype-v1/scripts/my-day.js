document.addEventListener('DOMContentLoaded', () => {
  // ---- Theme / Branding ----
  (function applySavedTheme(){
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
  })();

  // ---- State ----
  let currentDate = new Date();
  let currentTab  = 'day';

  // ---- DOM ----
  const agendaList = document.getElementById('agendaList');
  const dateLabel  = document.getElementById('currentDate');
  const prevBtn    = document.getElementById('prevDay');
  const nextBtn    = document.getElementById('nextDay');
  const tabDay     = document.getElementById('tab-day');
  const tabWeek    = document.getElementById('tab-week');
  const tabMonth   = document.getElementById('tab-month');
  const weekScrollContainer = document.querySelector('.week-scroll-container');
  const weekScroll = document.getElementById('weekScroll');
  const weekLabel  = document.getElementById('weekLabel');
  const dateNav    = document.getElementById('dateNav');

  // ---- Storage helpers (canonical + legacy mirrors) ----
  function loadJSON(key, legacyKey, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || 'null');
      if (v !== null) return v;
      if (legacyKey) {
        const l = JSON.parse(localStorage.getItem(legacyKey) || 'null');
        if (l !== null) return l;
      }
      return fallback;
    } catch { return fallback; }
  }
  function saveJSON(key, value, legacyKey) {
    localStorage.setItem(key, JSON.stringify(value));
    if (legacyKey) localStorage.setItem(legacyKey, JSON.stringify(value));
  }

  // Canonical keys, keep legacy mirrors for the prototype
  let bookings   = loadJSON('bookings','soloschedule_bookings', []);
  let services   = loadJSON('services','soloschedule_services', []);
  const serviceByName = Object.fromEntries(services.map(s => [s.name, s]));
  let dayBlocks  = loadJSON('day_blocks', null, {}); // { 'YYYY-MM-DD': [ { type, start, end } ] }
  let availability = loadJSON('soloschedule_availability', null, {
    mon:[], tue:[], wed:[], thu:[], fri:[], sat:[], sun:[]
  });

  // ---- Date/time helpers ----
  function formatDate(date) {
    return date.toLocaleDateString(undefined, { weekday:'short', day:'numeric', month:'short', year:'numeric' });
  }
  const keyOf = d => {
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off*60000).toISOString().slice(0,10);
  };
  const isSameDay = (a,b) => keyOf(a) === keyOf(b);

  const pad   = n => String(n).padStart(2,'0');
  const toMin = t => { const [H,M]=(t||'00:00').split(':').map(Number); return H*60+M; };
  const toHHMM= m => `${pad(Math.floor(m/60))}:${pad(m%60)}`;
  const floorQ= t => toHHMM(Math.floor(toMin(t)/15)*15);
  const ceilQ = t => toHHMM(Math.ceil(toMin(t)/15)*15);

  // snap weekly availability to 15-min grid once
  for (const k of Object.keys(availability)) {
    availability[k] = (availability[k]||[]).map(([a,b]) => [floorQ(a), ceilQ(b)]);
  }
  const weekdayKey = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const map = ['sun','mon','tue','wed','thu','fri','sat']; // JS 0=Sun
    return map[d.getDay()];
  };

  // Add service duration to start time (fallback 60m)
  function addServiceDuration(start, serviceName) {
    if (!start) return '00:00';
    const base = toMin(start);
    const dur = Math.max(0, Number(serviceByName[serviceName]?.duration) || 60);
    return toHHMM(base + dur);
  }

  // Busy = bookings + blockouts (merged)
  function busyIntervalsForDate(dateKey){
    const blocks = (dayBlocks[dateKey] || []).map(bl => [toMin(floorQ(bl.start)), toMin(ceilQ(bl.end))]);
    const bks = bookings
      .filter(b => b.date === dateKey)
      .map(b => [toMin(b.time||'00:00'), toMin(addServiceDuration(b.time, b.service))]);
    const all = [...blocks, ...bks].sort((a,b)=>a[0]-b[0]);
    const merged = [];
    for (const iv of all) {
      if (!merged.length || iv[0] > merged[merged.length-1][1]) merged.push(iv);
      else merged[merged.length-1][1] = Math.max(merged[merged.length-1][1], iv[1]);
    }
    return merged;
  }

  // subtract busy from a single availability window
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

  // Merge contiguous or touching free segments: [[s1,e1],[e1,e2]] -> [[s1,e2]]
  function mergeContiguousFree(segs){
    if (!segs.length) return [];
    const sorted = segs.slice().sort((a,b)=>a[0]-b[0] || a[1]-b[1]);
    const out = [sorted[0].slice()];
    for (let i=1;i<sorted.length;i++){
      const [s,e] = sorted[i];
      const last = out[out.length-1];
      if (s <= last[1]) last[1] = Math.max(last[1], e); // overlap/touch
      else out.push([s,e]);
    }
    return out;
  }

  // tie-break so items appear before free if same start time (optional preference)
  function kindRank(k){ return (k === 'booking' || k === 'block') ? 0 : 1; }

  // ---- DAY VIEW (chronological, unified timeline) ----
  function renderDayView() {
    dateNav.style.display = '';
    weekScrollContainer.style.display = 'none';
    weekLabel.textContent = '';

    const dateKey = keyOf(currentDate);
    const wk = weekdayKey(dateKey);

    const dayAvail = (availability[wk] || [])
      .map(([s,e]) => [toMin(s), toMin(e)])
      .sort((a,b)=>a[0]-b[0]);

    // Gather items (bookings + blocks) in minutes
    const items = [];
    bookings
      .filter(b => b.date === dateKey)
      .forEach(b => items.push({
        kind: 'booking',
        start: toMin(b.time || '00:00'),
        end:   toMin(addServiceDuration(b.time, b.service)),
        client: b.client,
        service: b.service
      }));
    (dayBlocks[dateKey] || []).forEach(bl => {
      items.push({
        kind: 'block',
        start: toMin(bl.start),
        end:   toMin(bl.end),
        type:  bl.type,
        _date: dateKey,
        _origStart: bl.start,
        _origEnd: bl.end
      });
    });

    agendaList.innerHTML = '';

    if (!dayAvail.length) {
      // No weekly schedule set — show items only (chronological)
      if (!items.length) {
        agendaList.innerHTML = `<div class="agenda-block block-available"><span>No availability set</span></div>`;
        return;
      }
      items.sort((a,b)=>a.start-b.start).forEach(renderItem);
      return;
    }

    // Build free segments from schedule minus busy
    const busy = busyIntervalsForDate(dateKey);
    let free = [];
    for (const rng of dayAvail) free.push(...subtractBusyFromRange(rng, busy));
    free = mergeContiguousFree(free);

    // Clip items to schedule windows (ignore any parts outside schedule)
    const scheduledItems = [];
    for (const [aStart, aEnd] of dayAvail) {
      for (const it of items) {
        const s = Math.max(it.start, aStart);
        const t = Math.min(it.end,   aEnd);
        if (t > s) scheduledItems.push({ ...it, start: s, end: t });
      }
    }

    // Unified timeline: free + items together, sorted
    const timeline = [
      ...free.map(([s,e]) => ({ kind:'free', start:s, end:e })),
      ...scheduledItems
    ].sort((a,b) => a.start - b.start || kindRank(a.kind) - kindRank(b.kind) || a.end - b.end);

    if (!timeline.length) {
      // Schedule exists but is fully busy; show schedule windows as context
      const mergedAvail = mergeContiguousFree(dayAvail);
      mergedAvail.forEach(([s,e]) => {
        agendaList.insertAdjacentHTML('beforeend',
          `<div class="agenda-block block-available"><span>Available: ${toHHMM(s)} – ${toHHMM(e)}</span></div>`);
      });
      return;
    }

    // Render in order
    for (const block of timeline) {
      if (block.kind === 'free') {
        agendaList.insertAdjacentHTML('beforeend',
          `<div class="agenda-block block-available"><span>Available: ${toHHMM(block.start)} – ${toHHMM(block.end)}</span></div>`);
      } else {
        renderItem(block);
      }
    }
  }

  function renderItem(e){
    if (e.kind === 'booking') {
      agendaList.insertAdjacentHTML('beforeend',
        `<div class="agenda-block block-booking">
           <span>🟢</span>
           <span>${toHHMM(e.start)}–${toHHMM(e.end)} — <b>${e.client}</b> (${e.service})</span>
         </div>`);
    } else {
      const cls   = (e.type === 'Travel') ? 'block-travel' : 'block-blockout';
      const emoji = (e.type === 'Travel') ? '🚌' : (e.type === 'Break' ? '☕' : '⛔');
      // include delete button with original boundaries + date for precise removal
      agendaList.insertAdjacentHTML('beforeend',
        `<div class="agenda-block ${cls}">
           <span>${emoji}</span>
           <span>${toHHMM(e.start)}–${toHHMM(e.end)} — <b>${e.type}</b></span>
           <button class="del-block"
                   type="button"
                   aria-label="Delete blockout"
                   data-date="${e._date || keyOf(currentDate)}"
                   data-start="${e._origStart || toHHMM(e.start)}"
                   data-end="${e._origEnd || toHHMM(e.end)}"
                   data-type="${e.type}"
                   style="margin-left:auto;background:transparent;border:none;color:#fff;font-size:1.1rem;cursor:pointer;opacity:.9;"
           >&times;</button>
         </div>`);
    }
  }

  // ---- WEEK VIEW ----
  function mondayOfWeek(d) {
    const x = new Date(d);
    x.setHours(12,0,0,0); // avoid DST edges
    const day = (x.getDay() + 6) % 7; // Mon=0
    x.setDate(x.getDate() - day);
    x.setHours(0,0,0,0);
    return x;
  }
  function renderWeekScroll() {
    weekScroll.innerHTML = '';
    const monday = mondayOfWeek(currentDate);
    const days = [...Array(7)].map((_,i) => {
      const d = new Date(monday); d.setDate(monday.getDate()+i); return d;
    });

    days.forEach(d => {
      const isToday = isSameDay(d, new Date());
      const active  = isSameDay(d, currentDate);
      const dk = keyOf(d);
      const hasBooking = bookings.some(b => b.date === dk);
      const hasBlock   = (loadJSON('day_blocks', null, {})[dk] || []).length > 0;

      const col = document.createElement('div');
      col.className = 'week-day-col' + (active ? ' active' : '');
      col.innerHTML = `
        <div>${d.toLocaleDateString(undefined, {weekday:'short'})}</div>
        <div style="font-size:1.14em; font-weight:600;">${d.getDate()}</div>
        ${isToday ? '<div class="mini-dot"></div>' : ''}
        ${hasBooking ? '<span class="booking-dot"></span>' : ''}
        ${hasBlock   ? '<span class="block-dot"></span>' : ''}
      `;
      col.onclick = () => { currentDate = new Date(d); render(); };
      weekScroll.appendChild(col);
    });

    const first = days[0].toLocaleDateString(undefined,{day:'numeric',month:'short'});
    const last  = days[6].toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
    weekLabel.textContent = `${first} – ${last}`;
  }

  function renderWeekAgenda() {
    agendaList.innerHTML = '';
    const monday = mondayOfWeek(currentDate);

    for (let i=0;i<7;i++){
      const d = new Date(monday); d.setDate(monday.getDate()+i);
      const k = keyOf(d);
      const listBookings = bookings
        .filter(b => b.date === k)
        .sort((a,b)=> (a.time||'').localeCompare(b.time||''));
      const listBlocks = (loadJSON('day_blocks', null, {})[k] || [])
        .slice()
        .sort((a,b)=> a.start.localeCompare(b.start));

      if (!listBookings.length && !listBlocks.length) continue;

      agendaList.insertAdjacentHTML('beforeend',
        `<div style="margin:.3em 0 .2em .1em;font-weight:700;color:var(--color-primary);font-size:1em;">
           ${d.toLocaleDateString(undefined,{weekday:'short', day:'numeric', month:'short'})}
         </div>`);

      listBookings.forEach(b => {
        const end = addServiceDuration(b.time, b.service);
        agendaList.insertAdjacentHTML('beforeend',
          `<div class="agenda-block block-booking">
             <span>🟢</span>
             <span>${b.time || '--:--'}–${end} — <b>${b.client}</b> (${b.service})</span>
           </div>`);
      });

      listBlocks.forEach(bl => {
        const cls = (bl.type === 'Travel') ? 'block-travel' : 'block-blockout';
        const emoji = (bl.type === 'Travel') ? '🚌' : (bl.type === 'Break' ? '☕' : '⛔');
        agendaList.insertAdjacentHTML('beforeend',
          `<div class="agenda-block ${cls}">
             <span>${emoji}</span>
             <span>${bl.start}–${bl.end} — <b>${bl.type}</b></span>
             <button class="del-block"
                     type="button"
                     aria-label="Delete blockout"
                     data-date="${k}"
                     data-start="${bl.start}"
                     data-end="${bl.end}"
                     data-type="${bl.type}"
                     style="margin-left:auto;background:transparent;border:none;color:#fff;font-size:1.1rem;cursor:pointer;opacity:.9;"
             >&times;</button>
           </div>`);
      });
    }
  }

  // ---- MONTH VIEW ----
  function renderMonthView() {
    dateNav.style.display = 'none';
    weekScrollContainer.style.display = 'none';
    weekLabel.textContent = '';

    agendaList.innerHTML = `
      <div class="month-view-container">
        <div class="month-nav">
          <button id="prevMonth" aria-label="Prev Month"><i class="fas fa-chevron-left"></i></button>
          <span class="month-label" id="monthLabel"></span>
          <button id="nextMonth" aria-label="Next Month"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="month-grid" id="monthGrid"></div>
        <div class="month-day-agenda" id="monthDayAgenda">
          <div class="agenda-title" id="monthDayAgendaTitle"></div>
          <div class="agenda-list-inner" id="monthDayAgendaList"></div>
        </div>
      </div>
    `;

    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    document.getElementById('monthLabel').textContent =
      currentDate.toLocaleDateString(undefined, { month:'long', year:'numeric' });

    document.getElementById('prevMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth()-1); render(); };
    document.getElementById('nextMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth()+1); render(); };

    const first = new Date(y, m, 1);
    const last  = new Date(y, m+1, 0);
    const startWeekDay = (first.getDay() + 6) % 7; // Mon=0
    const daysInMonth  = last.getDate();
    const totalCells   = Math.ceil((startWeekDay + daysInMonth) / 7) * 7;

    const todayKey  = keyOf(new Date());
    const activeKey = keyOf(currentDate);
    const monthGridEl = document.getElementById('monthGrid');

    let html = '';
    for (let cell=0; cell<totalCells; cell++){
      const dayNum = cell - startWeekDay + 1;
      let d = null, dk = '';
      if (dayNum>0 && dayNum<=daysInMonth){ d = new Date(y, m, dayNum); dk = keyOf(d); }
      let cls = 'month-grid-day';
      if (!d) cls += ' inactive';
      if (dk === todayKey)  cls += ' today';
      if (dk === activeKey) cls += ' active';

      let dots = '';
      if (dk){
        const hasBooking = bookings.some(b => b.date === dk);
        const hasBlock   = (loadJSON('day_blocks', null, {})[dk] || []).length > 0;
        if (hasBooking) dots += `<span class="booking-dot"></span>`;
        if (hasBlock)   dots += `<span class="block-dot"></span>`;
      }

      html += `
        <div class="${cls}" data-date="${dk}">
          <span class="date-num">${(dayNum>0 && dayNum<=daysInMonth) ? dayNum : ''}</span>
          ${dots}
        </div>`;
    }
    monthGridEl.innerHTML = html;

    monthGridEl.querySelectorAll('.month-grid-day').forEach(cell => {
      const dk = cell.dataset.date;
      if (!dk) return;
      cell.addEventListener('click', () => {
        monthGridEl.querySelectorAll('.month-grid-day').forEach(c => c.classList.remove('active'));
        cell.classList.add('active');
        currentDate = new Date(dk);
        renderMonthAgenda(currentDate);
      });
    });

    renderMonthAgenda(currentDate);
  }

  function renderMonthAgenda(d) {
    const k = keyOf(d);
    const titleEl = document.getElementById('monthDayAgendaTitle');
    const listEl  = document.getElementById('monthDayAgendaList');
    if (!titleEl || !listEl) return;

    titleEl.textContent = d.toLocaleDateString(undefined, { weekday:'short', day:'numeric', month:'short', year:'numeric' });
    listEl.innerHTML = '';

    const dayBookings = bookings
      .filter(b => b.date === k)
      .sort((a,b) => (a.time||'').localeCompare(b.time||''));
    const blocks = (loadJSON('day_blocks', null, {})[k] || [])
      .slice()
      .sort((a,b)=> a.start.localeCompare(b.start));

    if (!dayBookings.length && !blocks.length) {
      listEl.innerHTML = `<div class="agenda-block block-available"><span>No bookings — Available per schedule</span></div>`;
      return;
    }

    dayBookings.forEach(b => {
      const end = addServiceDuration(b.time, b.service);
      listEl.insertAdjacentHTML('beforeend',
        `<div class="agenda-block block-booking">
           <span>🟢</span>
           <span>${b.time || '--:--'}–${end} — <b>${b.client}</b> (${b.service})</span>
         </div>`);
    });

    blocks.forEach(bl => {
      const cls = (bl.type === 'Travel') ? 'block-travel' : 'block-blockout';
      const emoji = (bl.type === 'Travel') ? '🚌' : (bl.type === 'Break' ? '☕' : '⛔');
      listEl.insertAdjacentHTML('beforeend',
        `<div class="agenda-block ${cls}">
           <span>${emoji}</span>
           <span>${bl.start}–${bl.end} — <b>${bl.type}</b></span>
           <button class="del-block"
                   type="button"
                   aria-label="Delete blockout"
                   data-date="${k}"
                   data-start="${bl.start}"
                   data-end="${bl.end}"
                   data-type="${bl.type}"
                   style="margin-left:auto;background:transparent;border:none;color:#fff;font-size:1.1rem;cursor:pointer;opacity:.9;"
           >&times;</button>
         </div>`);
    });
  }

  // ---- Controls / Actions ----
  prevBtn.onclick = () => { currentDate.setDate(currentDate.getDate() + (currentTab==='week' ? -7 : -1)); render(); };
  nextBtn.onclick = () => { currentDate.setDate(currentDate.getDate() + (currentTab==='week' ?  7 :  1)); render(); };

  tabDay.onclick   = () => { currentTab = 'day';   render(); };
  tabWeek.onclick  = () => { currentTab = 'week';  render(); };
  tabMonth.onclick = () => { currentTab = 'month'; render(); };

  // Keyboard arrows to navigate days
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { currentDate.setDate(currentDate.getDate() + (currentTab==='week' ? -7 : -1)); render(); }
    if (e.key === 'ArrowRight'){ currentDate.setDate(currentDate.getDate() + (currentTab==='week' ?  7 :  1)); render(); }
    if (e.key.toLowerCase() === 't' && (e.ctrlKey || e.metaKey)) { currentDate = new Date(); render(); } // Ctrl/Cmd+T -> today
  });

  document.getElementById('addBookingBtn').onclick = () =>
    window.location.href = 'create-bookings.html';
  document.getElementById('addBlockBtn').onclick = () => {
    const off = currentDate.getTimezoneOffset();
    const dateKey = new Date(currentDate.getTime() - off*60000).toISOString().slice(0,10);
    window.location.href = `add-blockout.html?date=${dateKey}`;
  };

  // ---- Delete handler (event delegation for all views) ----
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.del-block');
    if (!btn) return;

    const date = btn.dataset.date;
    const start = btn.dataset.start;
    const end = btn.dataset.end;
    const type = btn.dataset.type;

    if (!date || !start || !end) return;

    if (!confirm(`Delete ${type || 'blockout'} ${start}–${end}?`)) return;

    // Reload from storage to avoid stale copy, remove only the first matching entry.
    const store = JSON.parse(localStorage.getItem('day_blocks') || '{}');
    const arr = store[date] || [];
    const idx = arr.findIndex(bl => bl.start === start && bl.end === end && (bl.type || '') === (type || ''));
    if (idx >= 0) {
      arr.splice(idx, 1);
      if (arr.length) store[date] = arr; else delete store[date];
      localStorage.setItem('day_blocks', JSON.stringify(store));
      dayBlocks = store;
      render();
    }
  });

  // ---- Main render ----
  function render() {
    // Tab UI
    tabDay.classList.toggle('active', currentTab==='day');
    tabWeek.classList.toggle('active', currentTab==='week');
    tabMonth.classList.toggle('active', currentTab==='month');
    tabDay.setAttribute('aria-pressed', String(currentTab==='day'));
    tabWeek.setAttribute('aria-pressed', String(currentTab==='week'));
    tabMonth.setAttribute('aria-pressed', String(currentTab==='month'));

    // Date label
    dateLabel.textContent = formatDate(currentDate);
    dateNav.style.display = (currentTab === 'day' || currentTab === 'week') ? '' : 'none';
    weekScrollContainer.style.display = (currentTab === 'week') ? '' : 'none';

    // Re-read data in case other pages changed them
    bookings   = loadJSON('bookings','soloschedule_bookings', []);
    services   = loadJSON('services','soloschedule_services', []);
    for (const s of services) serviceByName[s.name] = s;
    dayBlocks  = loadJSON('day_blocks', null, dayBlocks);
    availability = loadJSON('soloschedule_availability', null, availability);
    for (const k of Object.keys(availability)) {
      availability[k] = (availability[k]||[]).map(([a,b]) => [floorQ(a), ceilQ(b)]);
    }

    if (currentTab === 'day') {
      renderDayView();
    } else if (currentTab === 'week') {
      renderWeekScroll();
      renderWeekAgenda();
    } else {
      renderMonthView();
    }
  }

  render();
});
