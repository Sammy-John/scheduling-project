document.addEventListener('DOMContentLoaded', () => {
  const clientSelect = document.getElementById('client-select');
  const notesArea    = document.getElementById('notes-area');
  const saveBtn      = document.getElementById('save-notes-btn');
  const saveStatus   = document.getElementById('save-status');
  const chipsWrap    = document.getElementById('recent-chips');
  const recentRow    = document.getElementById('recent-row');

  // --- Theme / branding ---
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

  // --- Load data with canonical + legacy mirrors ---
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

  let clients   = loadJSON('clients', 'soloschedule_clients', []);
  if (!Array.isArray(clients)) clients = [];
  let notesMap  = loadJSON('clientNotes', 'soloschedule_clientNotes', {}) || {};
  let notesMeta = loadJSON('clientNotes_meta', 'soloschedule_clientNotesMeta', {}) || {};

  function persistNotes() {
    localStorage.setItem('clientNotes', JSON.stringify(notesMap));
    localStorage.setItem('soloschedule_clientNotes', JSON.stringify(notesMap)); // legacy mirror
  }
  function persistMeta() {
    localStorage.setItem('clientNotes_meta', JSON.stringify(notesMeta));
    localStorage.setItem('soloschedule_clientNotesMeta', JSON.stringify(notesMeta)); // legacy mirror
  }
  function markSeen(name) {
    if (!name) return;
    notesMeta[name] = { ...(notesMeta[name]||{}), lastSeen: Date.now() };
    persistMeta();
  }
  function markSaved(name) {
    if (!name) return;
    notesMeta[name] = { ...(notesMeta[name]||{}), lastSaved: Date.now() };
    persistMeta();
  }

  // --- Populate client select ---
  function renderClients() {
    clientSelect.innerHTML =
      '<option value="">-- Select Client --</option>' +
      clients.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  // --- Build recent clients list (meta first, then bookings fallback) ---
  function getRecentClients(limit = 3) {
    const list = [];
    // 1) by notes meta
    const meta = Object.entries(notesMeta)
      .map(([name, m]) => ({ name, ts: m?.lastSaved || m?.lastSeen || 0 }))
      .filter(x => clients.includes(x.name))
      .sort((a,b) => b.ts - a.ts)
      .map(x => x.name);
    meta.forEach(n => { if (!list.includes(n) && list.length < limit) list.push(n); });

    // 2) fallback: from recent bookings
    if (list.length < limit) {
      const bookings = loadJSON('bookings', 'soloschedule_bookings', []);
      if (Array.isArray(bookings) && bookings.length) {
        const sorted = [...bookings].sort((a,b) => {
          const ad = a?.date || '', bd = b?.date || '';
          return bd.localeCompare(ad);
        });
        for (const b of sorted) {
          const n = b?.client;
          if (n && clients.includes(n) && !list.includes(n)) {
            list.push(n);
            if (list.length >= limit) break;
          }
        }
      }
    }
    return list.slice(0, limit);
  }

  function renderRecentChips() {
    const recent = getRecentClients(3);
    if (!recent.length) {
      recentRow.style.display = 'none';
      return;
    }
    recentRow.style.display = '';
    chipsWrap.innerHTML = '';
    recent.forEach(name => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.setAttribute('role', 'listitem');
      btn.dataset.client = name;
      btn.textContent = name;
      if (clientSelect.value === name) btn.classList.add('active');
      btn.addEventListener('click', () => {
        clientSelect.value = name;
        notesArea.value = notesMap[name] || '';
        markSeen(name);
        renderRecentChips();
        notesArea.focus();
        const len = notesArea.value.length;
        notesArea.setSelectionRange(len, len);
      });
      chipsWrap.appendChild(btn);
    });
  }

  // --- Preselect via ?client= ---
  const qp = new URLSearchParams(location.search);
  const requestedClient = qp.get('client');

  renderClients();
  if (requestedClient) {
    if (!clients.includes(requestedClient)) {
      clients.push(requestedClient);
      localStorage.setItem('clients', JSON.stringify(clients));
      localStorage.setItem('soloschedule_clients', JSON.stringify(clients)); // legacy mirror
      renderClients();
    }
    clientSelect.value = requestedClient;
    notesArea.value = notesMap[requestedClient] || '';
    markSeen(requestedClient);
  }

  // initial chips
  renderRecentChips();

  // --- Change handler: load notes for selection ---
  clientSelect.addEventListener('change', () => {
    const client = clientSelect.value;
    notesArea.value = client ? (notesMap[client] || '') : '';
    markSeen(client);
    renderRecentChips();
  });

  // --- Save helpers ---
  function showSaved(msg = 'Notes saved') {
    saveStatus.textContent = msg;
    saveStatus.style.opacity = '1';
    clearTimeout(showSaved._t);
    showSaved._t = setTimeout(() => { saveStatus.style.opacity = '.85'; }, 1200);
  }

  // --- Save on click ---
  saveBtn.addEventListener('click', () => {
    const client = clientSelect.value;
    if (!client) { alert('Select a client.'); return; }
    notesMap[client] = notesArea.value;
    persistNotes();
    markSaved(client);
    renderRecentChips();
    showSaved('Notes saved');
  });

  // --- Optional: Cmd/Ctrl+S quick save ---
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      const client = clientSelect.value;
      if (client) {
        notesMap[client] = notesArea.value;
        persistNotes();
        markSaved(client);
        renderRecentChips();
        showSaved('Notes saved');
      }
    }
  });
});
