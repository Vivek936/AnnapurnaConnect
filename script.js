/* ============================================================
   ANNAPURNA CONNECT — MAIN JAVASCRIPT
   ============================================================ */

// ── Navbar scroll effect ─────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── Mobile menu toggle ────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') mobileMenu.classList.toggle('open');
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ── Counter animation ─────────────────────────────────────────
function animateCounters() {
  const counters = document.querySelectorAll('.counter-val');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step     = Math.ceil(target / (duration / 16));
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString('en-IN');
      if (current >= target) clearInterval(interval);
    }, 16);
  });
}

// Intersection observer for counter section
const counterSection = document.getElementById('impact-counters');
if (counterSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(counterSection);
}

// ── Intersection observer for animations ─────────────────────
const animatables = document.querySelectorAll('.card,.step-card,.food-card,.testimonial-card,.stat-card,.blog-card,.team-card,.value-card,.csr-card,.contact-card,.leaderboard-row');
const aoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
      }, i * 60);
      aoObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
animatables.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease';
  aoObserver.observe(el);
});

// ── Progress bars animate on view ────────────────────────────
const progressBars = document.querySelectorAll('.progress-fill');
const pbObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const w = entry.target.dataset.width || '0';
      entry.target.style.width = w + '%';
      pbObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
progressBars.forEach(bar => {
  const w = bar.style.width;
  bar.dataset.width = parseInt(w);
  bar.style.width = '0';
  pbObserver.observe(bar);
});

// ── Tab system ────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.tab;
    const target = btn.dataset.target;
    // Deactivate all in group
    document.querySelectorAll(`.tab-btn[data-tab="${group}"]`).forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.tab-content[data-tab="${group}"]`).forEach(c => c.classList.remove('active'));
    // Activate selected
    btn.classList.add('active');
    const targetEl = document.getElementById(target);
    if (targetEl) targetEl.classList.add('active');
  });
});

// ── Accordion ────────────────────────────────────────────────
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion-item');
    const wasOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ── Filter chips ──────────────────────────────────────────────
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('active');
  });
});

// ── View toggle (map/list) ────────────────────────────────────
const viewBtns     = document.querySelectorAll('.view-btn');
const mapView      = document.getElementById('mapView');
const listView     = document.getElementById('listView');
viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    if (mapView  && listView) {
      mapView.classList.toggle('hidden', view !== 'map');
      listView.classList.toggle('hidden', view !== 'list');
    }
  });
});

// ── Claim modal ───────────────────────────────────────────────
function showClaimModal() {
  const modal = document.getElementById('claimModal');
  if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function hideClaimModal() {
  const modal = document.getElementById('claimModal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}
function confirmClaim() {
  const name  = document.getElementById('claimName')?.value?.trim();
  const phone = document.getElementById('claimPhone')?.value?.trim();
  if (!name || !phone) { showToast('Please fill in all required fields.', 'warn'); return; }
  hideClaimModal();
  showToast('🎉 Pickup confirmed! You\'ll receive a call within 15 minutes.', 'success');
}
window.showClaimModal  = showClaimModal;
window.hideClaimModal  = hideClaimModal;
window.confirmClaim    = confirmClaim;

// ── Newsletter subscribe ───────────────────────────────────────
function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  if (!input) return;
  const email = input.value.trim();
  if (!email || !email.includes('@')) { showToast('Please enter a valid email.', 'warn'); return; }
  input.value = '';
  showToast('✅ You\'re subscribed! Welcome to Annapurna Connect.', 'success');
}
window.subscribeNewsletter = subscribeNewsletter;

// ── Toast notification ────────────────────────────────────────
function showToast(msg, type = 'success') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:99999;
    background:${type === 'success' ? '#16a34a' : '#ea6c12'};
    color:#fff;padding:14px 24px;border-radius:12px;
    font-size:.9rem;font-weight:600;font-family:Inter,sans-serif;
    box-shadow:0 8px 24px rgba(0,0,0,.2);
    animation:fadeInUp .3s ease;max-width:360px;line-height:1.5;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 4000);
}
window.showToast = showToast;

// ── Contact form ──────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ Message sent! We\'ll reply within 24 hours.', 'success');
    contactForm.reset();
  });
}

// ── Donate food form ──────────────────────────────────────────
const donateForm = document.getElementById('donateForm');
if (donateForm) {
  donateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('🎉 Food listed successfully! Matching in progress...', 'success');
    donateForm.reset();
  });
}

// ── Volunteer form ────────────────────────────────────────────
const volunteerForm = document.getElementById('volunteerForm');
if (volunteerForm) {
  volunteerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('🤝 Welcome aboard! We\'ll contact you within 48 hours.', 'success');
    volunteerForm.reset();
  });
}

// ── Upload zone drag & drop ───────────────────────────────────
const uploadZone = document.querySelector('.upload-zone');
if (uploadZone) {
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--primary)';
    uploadZone.style.background  = 'var(--orange-50)';
  });
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = '';
    uploadZone.style.background  = '';
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadZone.innerHTML = `<div class="upload-icon">✅</div><p>${file.name}</p><small>File ready to upload</small>`;
    }
  });
  uploadZone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadZone.innerHTML = `<div class="upload-icon">✅</div><p>${file.name}</p><small>File ready to upload</small>`;
      }
    };
    input.click();
  });
}

// ── Smooth active nav link based on page ──────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// ── Modal close on backdrop click ────────────────────────────
document.querySelectorAll('[id$="Modal"]').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
  });
});

// ── City tab filter for impact dashboard ─────────────────────
const citySelect = document.getElementById('citySelect');
if (citySelect) {
  citySelect.addEventListener('change', () => {
    // In a real app, this would fetch city-specific data
    showToast(`📊 Showing data for ${citySelect.value}`, 'success');
  });
}

// ── Keyboard navigation for modal ────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('claimModal');
    if (modal && modal.style.display !== 'none') hideClaimModal();
  }
});
