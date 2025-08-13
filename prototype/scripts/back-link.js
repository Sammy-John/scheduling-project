// Smart back: go to previous page if possible, else fall back to the href
document.addEventListener('click', (e) => {
  const link = e.target.closest('.js-back');
  if (!link) return;
  e.preventDefault();
  if (document.referrer && history.length > 1) {
    history.back();
  } else {
    window.location.href = link.getAttribute('href') || 'dashboard.html';
  }
});
