/* ============================================
   NEWCO — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Navbar Scroll Effect ----------
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
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

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Intersection Observer (Reveal Animations) ----------
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
    // Fallback: show all elements
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ---------- Tabs ----------
  const tabButtons = document.querySelectorAll('.tabs__tab');
  const tabPanels = document.querySelectorAll('.tabs__panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;

      // Update buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('tabs__tab--active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('tabs__tab--active');
      button.setAttribute('aria-selected', 'true');

      // Update panels
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

      // Close all others
      accordionTriggers.forEach(other => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.hidden = true;
        }
      });

      // Toggle current
      trigger.setAttribute('aria-expanded', !isExpanded);
      content.hidden = isExpanded;
    });
  });

  // ---------- Testimonials Carousel ----------
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (track && prevBtn && nextBtn) {
    const scrollAmount = 364; // card width + gap

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // ---------- Ticker Pause on Hover ----------
  const tickerRows = document.querySelectorAll('.ticker-row');
  tickerRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.querySelector('.ticker-track').style.animationPlayState = 'paused';
    });
    row.addEventListener('mouseleave', () => {
      row.querySelector('.ticker-track').style.animationPlayState = 'running';
    });
  });

  // ---------- Yield Carousel Pause on Hover ----------
  const yieldCarousel = document.getElementById('yieldCarousel');
  if (yieldCarousel) {
    yieldCarousel.addEventListener('mouseenter', () => {
      yieldCarousel.style.animationPlayState = 'paused';
    });
    yieldCarousel.addEventListener('mouseleave', () => {
      yieldCarousel.style.animationPlayState = 'running';
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
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
