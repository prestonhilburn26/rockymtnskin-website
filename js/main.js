/* ==========================================================================
   Rocky Mountain Skin — Main JavaScript
   Interactions: nav scroll, mobile menu, scroll animations, form handling
   ========================================================================== */

'use strict';

// --------------------------------------------------------------------------
// NAV — scroll behavior & mobile toggle
// --------------------------------------------------------------------------

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav__toggle');
const navMobile = document.querySelector('.nav__mobile');

// Scrolled class for nav shadow
function handleNavScroll() {
  if (window.scrollY > 20) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
}

// Mobile menu toggle
function toggleMobileNav() {
  const isOpen = navMobile?.classList.contains('open');
  navMobile?.classList.toggle('open');
  navToggle?.classList.toggle('active');
  navToggle?.setAttribute('aria-expanded', String(!isOpen));
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

// Close mobile nav on link click
navMobile?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

window.addEventListener('scroll', handleNavScroll, { passive: true });
navToggle?.addEventListener('click', toggleMobileNav);

// Run on load
handleNavScroll();

// --------------------------------------------------------------------------
// SCROLL ANIMATIONS — intersection observer for fade-up elements
// --------------------------------------------------------------------------

const animatedEls = document.querySelectorAll(
  '.animate-fade-up, .animate-fade-in, .service-card, .value-item, .blog-card, .testimonial-card'
);

if (animatedEls.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animatedEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`;
    observer.observe(el);
  });
}

// --------------------------------------------------------------------------
// LEAD MAGNET FORM — Netlify form submission
// --------------------------------------------------------------------------

const leadForm = document.querySelector('[data-lead-form]');

if (leadForm) {
  leadForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = leadForm.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    const formData = new FormData(leadForm);

    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        // Show success state
        leadForm.innerHTML = `
          <div class="lead-form-success" style="text-align:center; padding: var(--space-6) 0;">
            <p style="font-size: var(--text-lg); color: var(--color-gold-light); font-family: var(--font-display); margin-bottom: var(--space-3);">
              Your guide is on its way 💚
            </p>
            <p style="color: rgba(248,245,239,0.7); font-size: var(--text-sm); max-width: none;">
              Check your inbox — we sent the download link to your email.
              Welcome to The Skin Edit community.
            </p>
          </div>`;
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      btn.textContent = originalText;
      btn.disabled = false;
      const errorMsg = leadForm.querySelector('.form-error') || document.createElement('p');
      errorMsg.className = 'form-error';
      errorMsg.style.cssText = 'color: #e07070; font-size: var(--text-sm); margin-top: var(--space-2); max-width: none;';
      errorMsg.textContent = 'Something went wrong — please try again or email us directly.';
      if (!leadForm.contains(errorMsg)) leadForm.appendChild(errorMsg);
    }
  });
}

// --------------------------------------------------------------------------
// SMOOTH ANCHOR SCROLLING — offset for fixed nav
// --------------------------------------------------------------------------

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = header?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --------------------------------------------------------------------------
// CURRENT NAV LINK — highlight active page
// --------------------------------------------------------------------------

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.style.color = 'var(--color-gold-dark)';
    link.setAttribute('aria-current', 'page');
  }
});
