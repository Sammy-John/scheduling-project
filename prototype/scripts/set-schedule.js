// Set Schedule – SoloSchedule
document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'soloschedule_availability';

  // default schedule (used if none saved yet)
  const defaultSchedule = {
    mon: [['09:00','12:00'], ['13:00','17:00']],
    tue: [['09:00','12:00'], ['13:00','17:00']],
    wed: [['09:00','12:00'], ['13:00','17:00']],
    thu: [['09:00','12:00'], ['13:00','17:00']],
    fri: [['09:00','12:00'], ['13:00','16:00']],
    sat: [],
    sun: []
  };

  // ---------- load or seed ----------
  let schedule;
  try { schedule = JSON.parse(localStorage.getItem(KEY)); } catch {}
  if (!schedule || typeof schedule !== 'object') {
    schedule = JSON.parse(JSON.stringify(defaultSchedule));
    localStorage.setItem(KEY, JSON.stringify(schedule));
  }

  const dayOrder = [
    ['mon','Monday'],
    ['tue','Tuesday'],
    ['wed','Wednesday'],
    ['thu','Thursday'],
    ['fri','Friday'],
    ['sat','Saturday'],
    ['sun','Sunday'],
  ];

  const container = document.getElementById('daysWrap'); // FIX: correct id

  // ---------- helpers ----------
  const pad = (n) => String(n).padStart(2, '0');
  const toMin = (t) => {
    const [h,m] = (t || '00:00').split(':').map(Number);
    return h*60 + m;
  };
  const toHHMM = (mins) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
  const validRange = (a,b) => a && b && toMin(a) < toMin(b);

  // snap arbitrary times to 15-min grid
  const coerceToQuarter = (t, mode = 'round') => {
    if (!t) return '00:00';
    const [h, m] = t.split(':').map(Number);
    let total = h * 60 + m;
    if (mode === 'floor') total = Math.floor(total / 15) * 15;
    else if (mode === 'ceil') total = Math.ceil(total / 15) * 15;
    else total = Math.round(total / 15) * 15;
    // clamp to 00:00..23:45
    total = Math.max(0, Math.min(23 * 60 + 45, total));
    return toHHMM(total);
  };

  // legacy guard (not strictly needed once selects are used, but harmless)
  const isValid15Minute = (time) => {
    if (!time) return false;
    const [_, m] = time.split(':').map(Number);
    return m % 15 === 0;
  };

  // ---- build a full 15-min list once
  const allQuarterTimes = (() => {
    const out = [];
    for (let m = 0; m <= 23 * 60 + 45; m += 15) out.push(toHHMM(m));
    return out;
  })();

  // build <option> list for selects, rotated so selected value is first
  const timeOptionsHTML = (selectedRaw) => {
    const selected = coerceToQuarter(selectedRaw || '09:00', 'round');
    let idx = allQuarterTimes.indexOf(selected);
    if (idx < 0) idx = allQuarterTimes.indexOf('09:00');
    const rotated = [...allQuarterTimes.slice(idx), ...allQuarterTimes.slice(0, idx)];
    return rotated
      .map(v => `<option value="${v}" ${v === selected ? 'selected' : ''}>${v}</option>`)
      .join('');
  };

  // make sure anything previously saved is snapped to 15-mins
  const normalizeSchedule = (s) => {
    for (const k of Object.keys(s)) {
      s[k] = (s[k] || []).map(([a, b]) => [
        coerceToQuarter(a, 'floor'),
        coerceToQuarter(b, 'ceil')
      ]);
    }
    return s;
  };

  const save = () => localStorage.setItem(KEY, JSON.stringify(schedule));

  // normalize once on load to clean legacy data
  schedule = normalizeSchedule(schedule);
  save();

  // ---------- UI builders ----------
  const rangeRow = (dayKey, idx, [start, end]) => {
    const s = coerceToQuarter(start, 'round');
    const e = coerceToQuarter(end, 'round');
    return `
      <div class="range-row" data-day="${dayKey}" data-idx="${idx}">
        <select class="range-start">${timeOptionsHTML(s)}</select>
        <span class="range-dash">–</span>
        <select class="range-end">${timeOptionsHTML(e)}</select>
        <button class="remove-range" type="button" aria-label="Remove">&times;</button>
      </div>
    `;
  };

  const dayBlock = (dayKey, dayLabel, ranges) => `
    <section class="day-block section" data-day="${dayKey}">
      <div class="day-head">
        <div class="day-title">
          <input type="checkbox" class="day-toggle" ${ranges.length ? 'checked' : ''} aria-label="${dayLabel} enabled" />
          <h3>${dayLabel}</h3>
        </div>
        <div class="day-actions">
          <button class="btn ghost-btn clear-day" type="button">
            <i class="fa-solid fa-eraser"></i> Clear
          </button>
          <button class="btn link-btn add-range" type="button">
            <i class="fa-solid fa-plus"></i> Add range
          </button>
        </div>
      </div>
      <div class="ranges">
        ${(ranges && ranges.length)
          ? ranges.map((r, i) => rangeRow(dayKey, i, r)).join('')
          : '<div class="muted-text">No time ranges set.</div>'}
      </div>
    </section>
  `;

  function render(){
    container.innerHTML = dayOrder
      .map(([key,label]) => dayBlock(key, label, schedule[key] || []))
      .join('');
  }

  // ---------- clicks ----------
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    const block = e.target.closest('.day-block');
    if (!block) return;
    const dayKey = block.dataset.day;

    // add range handler
    if (btn && btn.classList.contains('add-range')) {
      const ranges = schedule[dayKey] || [];
      const lastEnd = ranges.length ? ranges[ranges.length - 1][1] : '09:00';

      let startMin = toMin(coerceToQuarter(lastEnd, 'ceil')); // start at next quarter
      let endMin = startMin + 180; // default new slot = 3 hours long

      // cap if past 9pm: shorten if near end of day
      if (endMin > 21 * 60) endMin = startMin + 60;

      // snap both to 15s just in case
      const start = coerceToQuarter(toHHMM(startMin), 'ceil');
      const end   = coerceToQuarter(toHHMM(endMin), 'ceil');

      ranges.push([start, end]);
      schedule[dayKey] = ranges;
      save();
      render();
      return;
    }

    // clear a day
    if (btn && btn.classList.contains('clear-day')) {
      schedule[dayKey] = [];
      save(); render();
      return;
    }

    // remove specific row
    if (btn && btn.classList.contains('remove-range')) {
      const row = btn.closest('.range-row');
      const idx = Number(row.dataset.idx);
      schedule[dayKey].splice(idx, 1);
      save(); render();
    }
  });

  // ---------- changes (toggle, start/end) ----------
  container.addEventListener('change', (e) => {
    const block = e.target.closest('.day-block');
    if (!block) return;
    const dayKey = block.dataset.day;

    if (e.target.classList.contains('day-toggle')) {
      if (e.target.checked && (!schedule[dayKey] || schedule[dayKey].length === 0)) {
        schedule[dayKey] = [['09:00','11:00']]; // seed a first slot
      }
      if (!e.target.checked) schedule[dayKey] = [];
      save(); render();
      return;
    }

    // change start/end
    const row = e.target.closest('.range-row');
    if (!row) return;
    const idx = Number(row.dataset.idx);

    const start = coerceToQuarter(row.querySelector('.range-start').value, 'round');
    const end   = coerceToQuarter(row.querySelector('.range-end').value, 'round');

    // enforce 15-min grid (selects already do this; this is a safety snap)
    if (!isValid15Minute(start) || !isValid15Minute(end)) {
      alert('Please select times in 15-minute increments (e.g., 09:00, 09:15, 09:30).');
      render();
      return;
    }

    if (!validRange(start, end)) {
      alert('End time must be after start time.');
      render();
      return;
    }

    // prevent overlaps
    const others = (schedule[dayKey] || [])
      .map((r,i)=>({i,r}))
      .filter(o => o.i !== idx)
      .map(o => o.r);

    const overlaps = others.some(([s,e]) => !(toMin(end) <= toMin(s) || toMin(start) >= toMin(e)));
    if (overlaps) {
      alert('This overlaps another range for the day.');
      render();
      return;
    }

    schedule[dayKey][idx] = [start, end];
    schedule[dayKey].sort((a,b)=>toMin(a[0]) - toMin(b[0]));
    save(); render();
  });

  // ---------- footer buttons ----------
  document.getElementById('clearAll').addEventListener('click', () => {
    if (!confirm('Clear the entire weekly schedule?')) return;
    Object.keys(schedule).forEach(k => schedule[k] = []);
    save(); render();
  });

  document.getElementById('saveSchedule').addEventListener('click', () => {
    // already saved on every change; this is just a friendly confirmation
    alert('Schedule saved.');
  });

  render();
});
