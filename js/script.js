/**
 * Funngro Website Revamp - Core JavaScript
 * High-performance Vanilla JavaScript handling interactive dashboard metrics,
 * gamified leaderboards, gig filtering, ROI simulation, accessible modals, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingEffect();
  initCounterAnimation();
  initFaqAccordion();
  initPricingToggle();
  initButtonRipples();
  initBackToTop();
  initModals();
  initReferralCopy();
  initCompanyRoiSimulator();
  initTeenGigFilters();
  initNewsletterAndForms();
});

/* ==========================================================================
   1. Navbar & Mobile Menu Interaction
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
      
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // Close mobile menu when clicking a link or drawer action button
    const closeDrawerItems = navMenu.querySelectorAll('.nav-link, .drawer-btn');
    closeDrawerItems.forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });

    // Close when clicking outside header
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !header.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }
}

/* ==========================================================================
   2. Typing Effect for Dynamic Hero Headlines
   ========================================================================== */
function initTypingEffect() {
  const typedTarget = document.querySelector('.typed-text');
  if (!typedTarget) return;

  const words = JSON.parse(typedTarget.getAttribute('data-words') || '["Web Development", "Graphic Design", "Social Media", "AI Assistance", "Video Editing"]');
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseEnd = 1600;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typedTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   3. Animated Counter with Intersection Observer
   ========================================================================== */
function initCounterAnimation() {
  const counterElements = document.querySelectorAll('.stat-number, .corp-stat-number');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseFloat(target.getAttribute('data-count') || '0');
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        const duration = 1800;
        let startTimestamp = null;
        const isFloat = String(target.getAttribute('data-count') || '').includes('.');

        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // Ease Out Quad
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          const currentCount = isFloat 
            ? (easeProgress * targetValue).toFixed(1)
            : Math.floor(easeProgress * targetValue);
          
          target.textContent = `${prefix}${currentCount.toLocaleString('en-IN')}${suffix}`;

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            target.textContent = `${prefix}${targetValue.toLocaleString('en-IN')}${suffix}`;
          }
        };

        window.requestAnimationFrame(step);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.15 });

  counterElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. Accessible FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });

      // Keyboard accessibility
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    }
  });
}

/* ==========================================================================
   5. Pricing Switcher (Per-Project vs Monthly Retainer)
   ========================================================================== */
function initPricingToggle() {
  const toggle = document.querySelector('.switch-toggle');
  const projectLabel = document.getElementById('switch-project');
  const retainerLabel = document.getElementById('switch-retainer');
  const prices = document.querySelectorAll('.pricing-amount');

  if (!toggle) return;

  function setPricingMode(isRetainer) {
    if (isRetainer) {
      toggle.classList.add('active');
      projectLabel?.classList.remove('active');
      retainerLabel?.classList.add('active');
      prices.forEach(price => {
        const monthlyVal = price.getAttribute('data-monthly');
        const unit = price.querySelector('span');
        if (monthlyVal) {
          price.firstChild.textContent = monthlyVal;
          if (unit) unit.textContent = '/month';
        }
      });
    } else {
      toggle.classList.remove('active');
      retainerLabel?.classList.remove('active');
      projectLabel?.classList.add('active');
      prices.forEach(price => {
        const projectVal = price.getAttribute('data-project');
        const unit = price.querySelector('span');
        if (projectVal) {
          price.firstChild.textContent = projectVal;
          if (unit) unit.textContent = '/project';
        }
      });
    }
  }

  toggle.addEventListener('click', () => {
    const isRetainer = !toggle.classList.contains('active');
    setPricingMode(isRetainer);
  });

  projectLabel?.addEventListener('click', () => setPricingMode(false));
  retainerLabel?.addEventListener('click', () => setPricingMode(true));
}

/* ==========================================================================
   6. Button Ripple Animation
   ========================================================================== */
function initButtonRipples() {
  const buttons = document.querySelectorAll('.btn, .btn-teen-primary, .btn-teen-secondary, .btn-login-outline, .btn-hire-filled, .btn-post-gradient');

  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple');

      const rect = this.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;

      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }

      this.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  });
}

/* ==========================================================================
   7. Back To Top
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. Modals (Hire Talent / Join Teen / Contact / Login)
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalCloses = document.querySelectorAll('.modal-close, [data-close-modal]');
  const backdrops = document.querySelectorAll('.modal-backdrop');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Pre-fill category if data-category exists
        const cat = trigger.getAttribute('data-category');
        const catSelect = targetModal.querySelector('#project-category-select');
        if (cat && catSelect) {
          catSelect.value = cat;
        }
      }
    });
  });

  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      backdrops.forEach(b => b.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  backdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      backdrops.forEach(b => b.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   9. Referral Link & Squad Code Copy Feedback
   ========================================================================== */
function initReferralCopy() {
  // Teen Portal: Squad Code Copy
  const copySquadBtn = document.getElementById('copy-code-btn');
  const squadCode = document.getElementById('squad-code');

  if (copySquadBtn && squadCode) {
    copySquadBtn.addEventListener('click', () => {
      const codeText = squadCode.textContent.trim();
      navigator.clipboard.writeText(codeText).then(() => {
        const originalHtml = copySquadBtn.innerHTML;
        copySquadBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        copySquadBtn.style.borderColor = 'var(--teen-green)';
        copySquadBtn.style.color = 'var(--teen-green)';

        setTimeout(() => {
          copySquadBtn.innerHTML = originalHtml;
          copySquadBtn.style.borderColor = '';
          copySquadBtn.style.color = '';
        }, 2200);
      });
    });
  }

  // Discord Share Button
  const discordShareBtn = document.getElementById('discord-share-btn');
  if (discordShareBtn) {
    discordShareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('Join our Funngro Teen Squad with code TEENPRO-99 and get ₹250 wallet bonus! https://funngro-revamp.vercel.app/teen.html').then(() => {
        const originalHtml = discordShareBtn.innerHTML;
        discordShareBtn.innerHTML = '<i class="fa-solid fa-check"></i> Link Copied for Discord!';
        setTimeout(() => {
          discordShareBtn.innerHTML = originalHtml;
        }, 2200);
      });
    });
  }
}

/* ==========================================================================
   10. Corporate Analytics ROI Simulator & Pulse Switcher
   ========================================================================== */
function initCompanyRoiSimulator() {
  const roiSlider = document.getElementById('roi-slider');
  const roiProjectCount = document.getElementById('roi-project-count');
  const roiAgencyVal = document.getElementById('roi-agency-val');
  const roiFunngroVal = document.getElementById('roi-funngro-val');
  const roiSavingsVal = document.getElementById('roi-savings-val');

  if (roiSlider && roiProjectCount && roiAgencyVal && roiFunngroVal && roiSavingsVal) {
    const calculateRoi = () => {
      const projects = parseInt(roiSlider.value, 10);
      roiProjectCount.textContent = `${projects} ${projects === 1 ? 'Sprint' : 'Sprints'}`;

      const agencyCost = projects * 25000;
      const funngroCost = projects * 9000;
      const monthlySavings = agencyCost - funngroCost;
      const annualSavings = monthlySavings * 12;
      const savingsPercent = Math.round((monthlySavings / agencyCost) * 100);

      roiAgencyVal.textContent = `₹${agencyCost.toLocaleString('en-IN')}`;
      roiFunngroVal.textContent = `₹${funngroCost.toLocaleString('en-IN')}`;
      roiSavingsVal.textContent = `₹${annualSavings.toLocaleString('en-IN')} Saved (${savingsPercent}%)`;
    };

    roiSlider.addEventListener('input', calculateRoi);
  }

  // Analytics Pulse Pill Buttons
  const dashboardPills = document.querySelectorAll('.dashboard-pill');
  dashboardPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dashboardPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

/* ==========================================================================
   11. Teen Portal Gig Category Filter Tabs
   ========================================================================== */
function initTeenGigFilters() {
  const filterButtons = document.querySelectorAll('.teen-filter-btn');
  const projectCards = document.querySelectorAll('.teen-project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   12. Newsletter, RFP Form, and Login Form Handlers
   ========================================================================== */
function initNewsletterAndForms() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const emailInput = form.querySelector('input[type="email"]');

      if (emailInput && !emailInput.value.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }

      if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';

        setTimeout(() => {
          submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Success!';
          submitBtn.style.background = '#10B981';
          submitBtn.style.color = '#FFFFFF';
          form.reset();

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
            submitBtn.style.background = '';
            submitBtn.style.color = '';

            // If inside modal, close modal automatically
            const parentModal = form.closest('.modal-backdrop');
            if (parentModal) {
              parentModal.classList.remove('active');
              document.body.style.overflow = '';
            }
          }, 2400);
        }, 700);
      }
    });
  });
}
