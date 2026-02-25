// scripts/services.js

document.addEventListener('DOMContentLoaded', () => {
  const brandData = JSON.parse(localStorage.getItem('soloschedule_branding') || '{}');
  const bizTitle = document.getElementById('biz-title');
  const form = document.getElementById('service-form');
  const serviceIdInput = document.getElementById('service-id');
  const nameInput = document.getElementById('service-name');
  const durationInput = document.getElementById('duration');
  const priceInput = document.getElementById('price');
  const serviceItems = document.getElementById('service-items');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  let services = JSON.parse(localStorage.getItem('soloschedule_services')) || [];
  let editIndex = null;

  // Apply theme
  if (brandData.themeKey && typeof applyThemeFromName === 'function') {
    applyThemeFromName(brandData.themeKey);
  }
  bizTitle.textContent = brandData.brandName ? `Manage Services for ${brandData.brandName}` : 'Manage Services';

  // Show all services
  function renderServices() {
    serviceItems.innerHTML = '';
    if (services.length === 0) {
      serviceItems.innerHTML = '<li style="opacity:0.6;">No services added yet.</li>';
      return;
    }
    services.forEach((s, i) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span><strong>${s.name}</strong> – ${s.duration} min – $${s.price.toFixed(2)}</span>
        <div class="service-actions">
          <button class="edit-btn" data-index="${i}">Edit</button>
          <button class="remove-btn" data-index="${i}">Remove</button>
        </div>
      `;
      serviceItems.appendChild(li);
    });
    // Attach edit/delete handlers
    serviceItems.querySelectorAll('.edit-btn').forEach(btn => {
      btn.onclick = () => startEdit(parseInt(btn.dataset.index));
    });
    serviceItems.querySelectorAll('.remove-btn').forEach(btn => {
      btn.onclick = () => removeService(parseInt(btn.dataset.index));
    });
  }

  function startEdit(i) {
    editIndex = i;
    serviceIdInput.value = i;
    nameInput.value = services[i].name;
    durationInput.value = services[i].duration;
    priceInput.value = services[i].price;
    cancelEditBtn.classList.remove('hidden');
    form.querySelector('#saveServiceBtn').textContent = 'Update Service';
    nameInput.focus();
  }

  function removeService(i) {
    if (confirm('Remove this service?')) {
      services.splice(i, 1);
      saveServices();
      resetForm();
      renderServices();
    }
  }

  function saveServices() {
    localStorage.setItem('soloschedule_services', JSON.stringify(services));
  }

  function resetForm() {
    serviceIdInput.value = '';
    nameInput.value = '';
    durationInput.value = '';
    priceInput.value = '';
    editIndex = null;
    cancelEditBtn.classList.add('hidden');
    form.querySelector('#saveServiceBtn').textContent = 'Save Service';
  }

  // Handle add/edit service
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const duration = parseInt(durationInput.value, 10);
    const price = parseFloat(priceInput.value);

    if (!name || isNaN(duration) || isNaN(price)) {
      alert('Please enter valid service details.');
      return;
    }

    if (editIndex !== null) {
      // Update
      services[editIndex] = { name, duration, price };
    } else {
      // Add new
      services.push({ name, duration, price });
    }
    saveServices();
    resetForm();
    renderServices();
  };

  cancelEditBtn.onclick = resetForm;

  // Initial render
  renderServices();
});
