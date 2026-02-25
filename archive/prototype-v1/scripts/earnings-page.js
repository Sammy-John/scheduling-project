document.addEventListener('DOMContentLoaded', () => {
  const brandData = JSON.parse(localStorage.getItem('soloschedule_branding')) || {};
  const bookings = JSON.parse(localStorage.getItem('soloschedule_bookings')) || [];

  // Brand info
  document.getElementById('userName').textContent = `${brandData.brandName || 'Your Business'} - Earnings`;
  const userLogo = document.getElementById('userLogo');
  if (brandData.logoUrl?.startsWith('http')) {
    userLogo.innerHTML = `<img src="${brandData.logoUrl}" class="user-logo" alt="Logo"/>`;
  } else {
    userLogo.innerHTML = `<i class="fas ${brandData.logoUrl || 'fa-user'} user-logo"></i>`;
  }

  // Totals
const paidBookings = bookings.filter(b => b.paidStatus === 'paid');
const unpaidBookings = bookings.filter(
  b => b.status === 'completed' && b.paidStatus !== 'paid'
);

const totalEarnings = paidBookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
const totalPaid = totalEarnings;
const totalUnpaid = unpaidBookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);

document.getElementById('totalEarnings').textContent = `$${totalEarnings.toFixed(2)}`;
document.getElementById('paidEarnings').textContent = `$${totalPaid.toFixed(2)}`;
document.getElementById('unpaidEarnings').textContent = `$${totalUnpaid.toFixed(2)}`;

  // Table
  const tableBody = document.getElementById('earningsTableBody');
 bookings.forEach(b => {
  const row = document.createElement('tr');
  let statusBadge = '';

  if (b.paidStatus === 'paid') {
    statusBadge = `<span class="badge badge-paid">Paid</span>`;
  } else if (b.status === 'completed') {
    statusBadge = `<span class="badge badge-unpaid">Unpaid</span>`;
  } else {
    statusBadge = `<span class="badge">${b.status}</span>`;
  }

  row.innerHTML = `
    <td>${b.date || ''}</td>
    <td>${b.client || ''}</td>
    <td>${b.service || ''}</td>
    <td>$${(Number(b.price) || 0).toFixed(2)}</td>
    <td>${statusBadge}</td>
  `;
  tableBody.appendChild(row);
});


  // Placeholder functionality
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Filtering will be available in full version.');
    });
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    alert('Export will be available in full version.');
  });

  document.getElementById('printBtn').addEventListener('click', () => {
    alert('Print will be available in full version.');
  });
});
