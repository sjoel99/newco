/* ============================================
   NEWCO — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Welcome Banner ----------
  const banner = document.getElementById('welcomeBanner');
  const closeBannerBtn = document.getElementById('closeBanner');
  const navbar = document.getElementById('navbar');

  if (closeBannerBtn && banner) {
    closeBannerBtn.addEventListener('click', () => {
      banner.classList.add('hidden');
      navbar.classList.add('banner-hidden');
      document.documentElement.style.setProperty('--banner-height', '0px');
    });
  }

  // ---------- Navbar: Scroll Effect + Hide/Show (Nexo-style) ----------
  let lastScrollY = 0;
  let ticking = false;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Glassmorphism on scroll
    navbar.classList.toggle('scrolled', currentScrollY > 50);

    // Hide/show on scroll direction (only after scrolling past hero)
    if (currentScrollY > 400) {
      if (currentScrollY > lastScrollY + 5) {
        navbar.classList.add('nav-hidden');
      } else if (currentScrollY < lastScrollY - 5) {
        navbar.classList.remove('nav-hidden');
      }
    } else {
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  handleScroll();

  // ---------- Mobile Menu ----------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Intersection Observer (Reveal + Stagger Animations) ----------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ---------- Tabs ----------
  const tabButtons = document.querySelectorAll('.tabs__tab');
  const tabPanels = document.querySelectorAll('.tabs__panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;

      tabButtons.forEach(btn => {
        btn.classList.remove('tabs__tab--active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('tabs__tab--active');
      button.setAttribute('aria-selected', 'true');

      tabPanels.forEach(panel => {
        const isTarget = panel.id === `panel-${targetTab}`;
        panel.classList.toggle('tabs__panel--active', isTarget);
        panel.hidden = !isTarget;
      });
    });
  });

  // ---------- Accordion (FAQ) ----------
  const accordionTriggers = document.querySelectorAll('.accordion__trigger');

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      accordionTriggers.forEach(other => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.hidden = true;
        }
      });

      trigger.setAttribute('aria-expanded', !isExpanded);
      content.hidden = isExpanded;
    });
  });

  // ---------- Testimonials Carousel ----------
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (track && prevBtn && nextBtn) {
    const scrollAmount = 364;

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // ---------- Ticker & Carousel Pause on Hover ----------
  document.querySelectorAll('.ticker-row').forEach(row => {
    const trackEl = row.querySelector('.ticker-track');
    row.addEventListener('mouseenter', () => { trackEl.style.animationPlayState = 'paused'; });
    row.addEventListener('mouseleave', () => { trackEl.style.animationPlayState = 'running'; });
  });

  const yieldCarousel = document.getElementById('yieldCarousel');
  if (yieldCarousel) {
    yieldCarousel.addEventListener('mouseenter', () => { yieldCarousel.style.animationPlayState = 'paused'; });
    yieldCarousel.addEventListener('mouseleave', () => { yieldCarousel.style.animationPlayState = 'running'; });
  }

  // ---------- Calculator (Buenbit-inspired) ----------
  const calcAmount = document.getElementById('calcAmount');
  const calcInitial = document.getElementById('calcInitial');
  const calcApr = document.getElementById('calcApr');
  const calcTotal = document.getElementById('calcTotal');
  const calcGain = document.getElementById('calcGain');

  let selectedApr = 4;
  let selectedYears = 1;

  function parseAmount(str) {
    return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
  }

  function formatBRL(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function updateCalculator() {
    if (!calcAmount) return;
    const amount = parseAmount(calcAmount.value);
    const rate = selectedApr / 100;
    const total = amount * Math.pow(1 + rate, selectedYears);
    const gain = total - amount;

    if (calcInitial) calcInitial.textContent = formatBRL(amount);
    if (calcApr) calcApr.textContent = selectedApr.toFixed(1) + '% a.a.';
    if (calcTotal) calcTotal.textContent = formatBRL(total);
    if (calcGain) calcGain.textContent = '+ ' + formatBRL(gain);
  }

  // Asset selection
  document.querySelectorAll('.calculator__asset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calculator__asset').forEach(b => {
        b.classList.remove('calculator__asset--active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('calculator__asset--active');
      btn.setAttribute('aria-checked', 'true');
      selectedApr = parseFloat(btn.dataset.apr);
      updateCalculator();
    });
  });

  // Period selection
  document.querySelectorAll('.calculator__period').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calculator__period').forEach(b => {
        b.classList.remove('calculator__period--active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('calculator__period--active');
      btn.setAttribute('aria-checked', 'true');
      selectedYears = parseInt(btn.dataset.years);
      updateCalculator();
    });
  });

  // Amount input
  if (calcAmount) {
    calcAmount.addEventListener('input', () => {
      updateCalculator();
    });

    // Format on blur
    calcAmount.addEventListener('blur', () => {
      const val = parseAmount(calcAmount.value);
      if (val > 0) {
        calcAmount.value = val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      }
    });
  }

  // Initial calculation
  updateCalculator();

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- Keyboard Navigation for Tabs ----------
  const tabList = document.querySelector('.tabs__nav');
  if (tabList) {
    tabList.addEventListener('keydown', (e) => {
      const tabs = Array.from(tabList.querySelectorAll('.tabs__tab'));
      const currentIndex = tabs.indexOf(document.activeElement);
      let newIndex;

      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else {
        return;
      }

      e.preventDefault();
      tabs[newIndex].focus();
      tabs[newIndex].click();
    });
  }
});
