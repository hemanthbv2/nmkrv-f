/* =============================================
   NMKRV COLLEGE — APP.JS
   Carousel, counters, scroll reveal, drag scroll
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── STICKY NAV ───
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ─── MOBILE MENU ───
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ─── SCROLL REVEAL ───
  const revealEls = document.querySelectorAll([
    '.prog-card', '.club-card',
    '.campus-stat-item', '.campus-photo-item', '.campus-photo-tall',
    '.section-header', '.app-left', '.app-right',
    '.campus-life-left', '.campus-life-right',
    '.teachers-section'
  ].join(', '));

  revealEls.forEach(el => el.classList.add('reveal'));

  // Stagger delays within grids
  document.querySelectorAll('.programmes-grid, .app-features, .campus-stats').forEach(group => {
    const children = group.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      if (i > 0 && i <= 5) child.classList.add(`reveal-d${i}`);
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── COUNTER ANIMATION ───
  function animateCounter(el, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current);
      if (current >= target) {
        clearInterval(timer);
        el.textContent = target;
      }
    }, 30);
  }

  // Counters in campus life section
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        if (target) animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // Hero stats counter
  const heroStats = document.getElementById('hero-stats');
  if (heroStats) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroStats.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.dataset.target);
            if (target) {
              let current = 0;
              const increment = target / 50;
              const timer = setInterval(() => {
                current = Math.min(current + increment, target);
                el.textContent = Math.floor(current) + '+';
                if (current >= target) {
                  clearInterval(timer);
                  el.textContent = target + '+';
                }
              }, 30);
            }
          });
          heroObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    heroObserver.observe(heroStats);
  }

  // ─── TEACHER SPOTLIGHT CAROUSEL ───
  const tSlides = document.querySelectorAll('.spotlight-slide');
  const tDots = document.querySelectorAll('#teacher-dots .nav-dot');
  const tPrevBtn = document.getElementById('teacher-prev');
  const tNextBtn = document.getElementById('teacher-next');
  let currentTSlide = 0;
  let tAutoplayTimer;

  function showTSlide(index) {
    if (!tSlides.length) return;
    if (index < 0) index = tSlides.length - 1;
    if (index >= tSlides.length) index = 0;
    tSlides.forEach(s => s.classList.remove('active'));
    tDots.forEach(d => d.classList.remove('active'));
    tSlides[index].classList.add('active');
    if (tDots[index]) tDots[index].classList.add('active');
    currentTSlide = index;
  }

  function nextTSlide() { showTSlide(currentTSlide + 1); }
  function prevTSlide() { showTSlide(currentTSlide - 1); }

  if (tNextBtn) tNextBtn.addEventListener('click', () => { nextTSlide(); resetTAutoplay(); });
  if (tPrevBtn) tPrevBtn.addEventListener('click', () => { prevTSlide(); resetTAutoplay(); });

  tDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showTSlide(i);
      resetTAutoplay();
    });
  });

  function startTAutoplay() { tAutoplayTimer = setInterval(nextTSlide, 8000); }
  function resetTAutoplay() { clearInterval(tAutoplayTimer); startTAutoplay(); }
  if (tSlides.length > 0) startTAutoplay();

  // Swipe support
  const tSpotlightEl = document.getElementById('teacher-carousel');
  if (tSpotlightEl) {
    let tTouchStartX = 0;
    tSpotlightEl.addEventListener('touchstart', (e) => {
      tTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    tSpotlightEl.addEventListener('touchend', (e) => {
      const diff = tTouchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextTSlide(); else prevTSlide();
        resetTAutoplay();
      }
    }, { passive: true });
  }


  // ─── ACTIVE NAV HIGHLIGHT ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  // ─── HERO FLOATING BADGE PARALLAX ───
  const heroSection = document.getElementById('hero');
  const floatBadges = document.querySelectorAll('.float-badge');
  if (heroSection && floatBadges.length > 0) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      floatBadges.forEach((badge, i) => {
        const depth = (i + 1) * 0.005;
        badge.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
      });
    });
    heroSection.addEventListener('mouseleave', () => {
      floatBadges.forEach(badge => { badge.style.transform = ''; });
    });
  }

  // ─── SMOOTH SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  // ─── CLUBS DRAG SCROLL ───
  const clubsWrap = document.getElementById('clubs-scroll-wrap');
  if (clubsWrap) {
    let isDown = false, startX, scrollLeft;
    clubsWrap.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - clubsWrap.offsetLeft;
      scrollLeft = clubsWrap.scrollLeft;
      clubsWrap.style.cursor = 'grabbing';
    });
    clubsWrap.addEventListener('mouseleave', () => { isDown = false; clubsWrap.style.cursor = ''; });
    clubsWrap.addEventListener('mouseup', () => { isDown = false; clubsWrap.style.cursor = ''; });
    clubsWrap.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      clubsWrap.scrollLeft = scrollLeft - ((e.pageX - clubsWrap.offsetLeft) - startX) * 1.5;
    });
  }

  // ─── TOAST ───
  let toastTimeout;
  function showToast(msg) {
    let toast = document.getElementById('nmkrv-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'nmkrv-toast';
      Object.assign(toast.style, {
        position: 'fixed', bottom: '32px', left: '50%',
        transform: 'translateX(-50%) translateY(20px)',
        background: '#0f1d4a', color: 'white',
        fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '600',
        padding: '14px 24px', borderRadius: '50px', zIndex: '9999',
        opacity: '0', transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0 8px 30px rgba(26,47,110,0.3)',
        maxWidth: '90vw', textAlign: 'center', whiteSpace: 'nowrap'
      });
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    clearTimeout(toastTimeout);
    setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
    toastTimeout = setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(20px)'; }, 3000);
  }

  document.querySelectorAll('#nav-brochure-btn, #mob-brochure, #app-brochure-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); showToast('📄 Brochure download will be available soon!'); });
  });

  const appForm = document.getElementById('application-form');
  if(appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✅ Application submitted successfully!');
      appForm.reset();
    });
  }

  document.querySelectorAll('.prog-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.closest('.prog-card')?.querySelector('.prog-card-title')?.textContent || 'Programme';
      showToast(`📚 ${title} programmes page coming soon!`);
    });
  });

});
