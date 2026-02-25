// Lightweight, token-friendly setup with preview and index compatibility

const themes = [
  { key: 'wellness',     label: 'Health & Wellness',       primary: '#9C88FF', bg: '#F2F0FC' },
  { key: 'beauty',       label: 'Beauty & Nails',          primary: '#F06292', bg: '#FFF0F5' },
  { key: 'construction', label: 'Construction & Trades',   primary: '#FF8F00', bg: '#FFF8E1' },
  { key: 'coaching',     label: 'Coaching & Consulting',   primary: '#3F51B5', bg: '#F1F3FE' },
  { key: 'tech',         label: 'Digital & Tech',          primary: '#00BCD4', bg: '#E0F7FA' },
  { key: 'freelancer',   label: 'Neutral Freelancer',      primary: '#424242', bg: '#FAFAFA' }
];

const els = {
  themeScroll:   document.getElementById('theme-scroll'),
  previewBox:    document.getElementById('preview-box'),
  bizInput:      document.getElementById('biz-name'),
  uploadInput:   document.getElementById('upload-logo'),
  fileName:      document.getElementById('file-name'),
  saveButton:    document.getElementById('save-branding')
};

let selectedTheme = null;
let selectedIcon = 'fa-leaf';
let uploadedLogoDataUrl = null;

// ---- Render theme cards -----------------------------------------------------
function renderThemeCards() {
  els.themeScroll.innerHTML = '';
  themes.forEach(t => {
    const card = document.createElement('button');
    card.className = 'theme-card';
    card.type = 'button';
    card.setAttribute('aria-pressed', 'false');
    card.innerHTML = `
      <div style="color:${t.primary}">${t.label}</div>
      <span class="sample-btn">Sample</span>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.theme-card').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-pressed', 'true');
      selectedTheme = t;

      // Apply app-wide theme if available (keeps preview in brand colors)
      if (typeof applyTheme === 'function') {
        try { applyTheme(t.key); } catch {}
      } else {
        // fallback: soften body bg to the theme bg
        document.body.style.backgroundColor = t.bg;
      }

      renderPreview();
    });
    els.themeScroll.appendChild(card);
  });
}

// ---- Logo icon selection ----------------------------------------------------
function wireLogoIconSelection() {
  document.querySelectorAll('.logo-icon').forEach(btn => {
    btn.addEventListener('click', () => {
      uploadedLogoDataUrl = null;
      selectedIcon = btn.dataset.icon;
      document.querySelectorAll('.logo-icon').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPreview();
    });
  });

  // default select the first icon for clearer feedback
  const first = document.querySelector('.logo-icon');
  if (first) first.click();
}

// ---- Upload handling --------------------------------------------------------
function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function wireUpload() {
  els.uploadInput.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    els.fileName.textContent = file.name;
    try {
      uploadedLogoDataUrl = await toDataUrl(file);
      // clear icon selection UI
      document.querySelectorAll('.logo-icon').forEach(b => b.classList.remove('active'));
      renderPreview();
    } catch {
      uploadedLogoDataUrl = null;
    }
  });
}

// ---- Preview ---------------------------------------------------------------
function renderPreview() {
  const name = (els.bizInput.value || '').trim() || 'Your Business';
  els.previewBox.innerHTML = '';

  if (!selectedTheme) {
    els.previewBox.innerHTML = `<div class="preview-header"><strong>${name}</strong></div>`;
    return;
  }

  // Header
  const header = document.createElement('div');
  header.className = 'preview-header';
  header.style.backgroundColor = selectedTheme.primary;
  header.style.color = '#fff';

  if (uploadedLogoDataUrl) {
    header.innerHTML = `<img src="${uploadedLogoDataUrl}" alt="" class="preview-img"><strong>${name}</strong>`;
  } else if (selectedIcon) {
    header.innerHTML = `<i class="fas ${selectedIcon}"></i><strong>${name}</strong>`;
  } else {
    header.innerHTML = `<strong>${name}</strong>`;
  }

  // Content
  const content = document.createElement('div');
  content.style.background = selectedTheme.bg;
  content.style.padding = '0.75rem';
  content.style.borderRadius = '8px';
  content.style.border = '1px solid var(--color-muted)';
  content.style.marginTop = '.5rem';
  content.innerHTML = `
    <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:.75rem;margin-bottom:.5rem;">
      <p style="margin-bottom:.5rem;">10:00 AM — Sample Booking</p>
      <button class="sample-btn" style="background:${selectedTheme.primary}">Action</button>
    </div>
    <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:.75rem;">
      <p style="margin-bottom:.5rem;">1:30 PM — Another Booking</p>
      <button class="sample-btn" style="background:${selectedTheme.primary}">Action</button>
    </div>
  `;

  els.previewBox.appendChild(header);
  els.previewBox.appendChild(content);
}

// ---- Save -------------------------------------------------------------------
function saveBranding() {
  const name = (els.bizInput.value || '').trim();
  if (!name || !selectedTheme) {
    alert('Please enter your business name and select a theme.');
    return;
  }

  const branding = {
    // use keys compatible with index.js logic
    name,
    icon: uploadedLogoDataUrl ? null : (selectedIcon || null),
    logoDataUrl: uploadedLogoDataUrl || null,
    theme: selectedTheme.key
  };

  // canonical key used by the new index
  localStorage.setItem('branding', JSON.stringify(branding));

  // optional legacy key for transition
  localStorage.setItem('soloschedule_branding', JSON.stringify({
    brandName: name,
    logoUrl: branding.logoDataUrl || branding.icon,
    themeKey: branding.theme
  }));

  // proceed to next step in your flow
  window.location.href = 'setup-services.html';
}

// ---- Live updates -----------------------------------------------------------
function init() {
  renderThemeCards();
  wireLogoIconSelection();
  wireUpload();
  els.bizInput.addEventListener('input', renderPreview);
  els.saveButton.addEventListener('click', saveBranding);
  renderPreview();
}

init();
