// scripts/add-blockout.js (replace)
document.addEventListener('DOMContentLoaded', () => {
  // ---- els
  const form       = document.getElementById('blockout-form');
  const typeSelect = document.getElementById('bo-type');
  const dateInput  = document.getElementById('bo-date');
  const timeSelect = document.getElementById('bo-time');
  const durSelect  = document.getElementById('bo-duration');
  const cancelBtn  = document.getElementById('cancelBtn'); // backBtn not in HTML

  // ---- helpers
  const qp = new URLSearchParams(location.search);
  const pad   = n => String(n).padStart(2,'0');
  const toMin = t => { const [H,M]=(t||'00:00').split(':').map(Number); return H*60+M; };
  const toHH  = m => `${pad(Math.floor(m/60))}:${pad(m%60)}`;
  const floorQ = t => toHH(Math.floor(toMin(t)/15)*15);
  const ceilQ  = t => toHH(Math.ceil (toMin(t)/15)*15);
  const localISODate = (d=new Date()) => {
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off*60000).toISOString().slice(0,10);
  };
  const weekdayKey = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const map = ['sun','mon','tue','wed','thu','fri','sat']; // JS 0=Sun
    return map[d.getDay()];
  };

  // ---- storage utils
  const loadJSON = (key, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return (v ?? fallback); }
    catch { return fallback; }
  };
  const saveJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  // ---- load state
  let availability = loadJSON('soloschedule_availability', {mon:[],tue:[],wed:[],thu:[],fri:[],sat:[],sun:[]});
  let bookings     = loadJSON('bookings', []);
  let dayBlocks    = loadJSON('day_blocks', {});
  const services   = loadJSON('services', []);
  const svcByName  = Object.fromEntries(services.map(s => [s.name, s]));

  // normalize availability to 15-min grid
  for (const k of Object.keys(availability)) {
    availability[k] = (availability[k]||[]).map(([a,b]) => [floorQ(a), ceilQ(b)]);
  }

  // ---- types
  const BLOCK_TYPES = ['Break','Admin','Travel','Personal','Buffer','Other'];
  typeSelect.innerHTML = BLOCK_TYPES.map(t => `<option value="${t}">${t}</option>`).join('');

  // ---- date defaults
  const qpDate = qp.get('date');
  const today = localISODate();
  dateInput.value = qpDate || today;
  dateInput.min   = today; // optional: prevent past

  // ---- schedule math (same as my-day)
  function addServiceDuration(start, serviceName) {
    const base = toMin(start || '00:00');
    const dur  = Math.max(15, Math.floor((Number(svcByName[serviceName]?.duration)||60)/15)*15);
    return toHH(base + dur);
  }
  function busyIntervalsForDate(dateKey){
    const blocksBusy = (dayBlocks[dateKey] || []).map(bl => [toMin(floorQ(bl.start)), toMin(ceilQ(bl.end))]);
    const bkgBusy = bookings
      .filter(b => b.date === dateKey && b.status !== 'cancelled')
      .map(b => [toMin(b.time||'00:00'), toMin(addServiceDuration(b.time, b.service))]);

    const all = [...blocksBusy, ...bkgBusy].sort((a,b)=>a[0]-b[0]);
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

  // ---- time options (chronological — earliest → latest)
  function currentDuration(){
    const d = Number(durSelect.value) || 15;
    return Math.max(15, Math.floor(d/15)*15);
  }
  function setTimeOptions(select, dateStr, durMin){
    const wk = weekdayKey(dateStr);
    const ranges = (availability[wk] || []).map(([s,e]) => [toMin(s), toMin(e)]).sort((a,b)=>a[0]-b[0]);

    const busy = busyIntervalsForDate(dateStr);
    let freeSegments = ranges.flatMap(r => subtractBusyFromRange(r, busy));
    freeSegments = mergeContiguous(freeSegments);

    // enumerate candidate starts (15-min), ensure [start, start+dur] fits in same free segment
    const candidates = [];
    for (const [s,e] of freeSegments) {
      for (let m = s; m + durMin <= e; m += 15) candidates.push(m);
    }

    select.innerHTML = '';
    if (!candidates.length) {
      const opt = document.createElement('option');
      opt.textContent = 'No available times';
      opt.disabled = true; opt.selected = true;
      select.appendChild(opt);
      select.disabled = true;
      return;
    }

    // strictly chronological (no rotation)
    const frag = document.createDocumentFragment();
    candidates.forEach((m, i) => {
      const v = toHH(m);
      const opt = document.createElement('option');
      opt.value = v; opt.textContent = v;
      if (i===0) opt.selected = true;
      frag.appendChild(opt);
    });
    select.appendChild(frag);
    select.disabled = false;
  }

  // initial times
  setTimeOptions(timeSelect, dateInput.value, currentDuration());

  // react to changes
  dateInput.addEventListener('change', () => {
    // refresh latest data in case another tab changed it
    bookings  = loadJSON('bookings', []);
    dayBlocks = loadJSON('day_blocks', {});
    setTimeOptions(timeSelect, dateInput.value, currentDuration());
  });
  durSelect.addEventListener('change', () => {
    setTimeOptions(timeSelect, dateInput.value, currentDuration());
  });

  // nav
  function goBack(){
    window.location.href = 'my-day.html';
  }
  if (cancelBtn) cancelBtn.addEventListener('click', (e)=>{ e.preventDefault(); goBack(); });

  // submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const type  = typeSelect.value;
    const date  = dateInput.value;
    const start = timeSelect.value;
    const dur   = currentDuration();

    if (!type || !date || !start || !dur) { alert('Please complete all fields.'); return; }

    // final guard: recompute candidates & ensure chosen is still ok
    setTimeOptions(timeSelect, date, dur);
    if ([...timeSelect.options].every(o => o.disabled || o.value !== start)) {
      alert('Selected start is no longer available. Please pick another time.');
      return;
    }

    const end = toHH(toMin(start) + dur);

    // save
    const store = loadJSON('day_blocks', {});
    store[date] = store[date] || [];
    store[date].push({ type, start, end });
    store[date].sort((a,b)=> a.start.localeCompare(b.start)); // keep tidy
    saveJSON('day_blocks', store);

    goBack();
  });
});
