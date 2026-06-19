/* =============================================
   AGRITREE — PREMIUM PLANT AI LANDING PAGE
   Main Script
   ============================================= */

'use strict';

/* ---- Utility: DOM selector shorthand ---- */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =============================================
   1. NAVBAR — SCROLL EFFECT & ACTIVE LINKS
   ============================================= */
(function initNavbar() {
    const navbar = $('#navbar');
    const navLinks = $$('.nav-link');

    // Add scrolled class on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }, { passive: true });

    // Highlight active nav link based on scroll position
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 120;
        navLinks.forEach(link => {
            const targetId = link.getAttribute('href').replace('#', '');
            const section = document.getElementById(targetId);
            if (section) {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                if (scrollPos >= top && scrollPos < bottom) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
})();

/* =============================================
   2. MOBILE MENU TOGGLE
   ============================================= */
(function initMobileMenu() {
    const btn = $('#mobileMenuBtn');
    const menu = $('#mobileMenu');
    const mobileLinks = $$('.mobile-nav-link');
    let isOpen = false;

    function toggleMenu() {
        isOpen = !isOpen;
        menu.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
        // Animate hamburger to X
        const spans = btn.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
            spans[1].style.cssText = 'opacity: 0';
            spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
        } else {
            spans.forEach(s => s.style.cssText = '');
        }
    }

    btn.addEventListener('click', toggleMenu);

    // Close on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isOpen) toggleMenu();
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (isOpen && !btn.contains(e.target) && !menu.contains(e.target)) {
            toggleMenu();
        }
    });
})();

/* =============================================
   3. INTERSECTION OBSERVER — FADE-IN ANIMATIONS
   ============================================= */
(function initFadeInObserver() {
    const elements = $$('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger children if multiple in a grid
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
    });

    elements.forEach((el, i) => {
        // Stagger delay based on sibling position
        const parent = el.parentElement;
        const siblings = Array.from(parent.querySelectorAll(':scope > .fade-in'));
        const index = siblings.indexOf(el);
        if (index > 0) {
            el.style.transitionDelay = `${index * 0.08}s`;
        }
        observer.observe(el);
    });
})();

/* =============================================
   4. FAQ ACCORDION
   ============================================= */
(function initFAQ() {
    const faqItems = $$('.faq-item');

    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon i');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other items
            faqItems.forEach((other) => {
                if (other !== item) {
                    other.classList.remove('open');
                    const otherIcon = other.querySelector('.faq-icon i');
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    if (otherIcon) {
                        otherIcon.className = 'fa-solid fa-chevron-down';
                    }
                }
            });

            // Toggle current item
            item.classList.toggle('open', !isOpen);
            question.setAttribute('aria-expanded', !isOpen);

            if (!isOpen) {
                icon.className = 'fa-solid fa-chevron-up';
            } else {
                icon.className = 'fa-solid fa-chevron-down';
            }
        });
    });
})();

/* =============================================
   5. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ============================================= */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar').offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
})();

/* =============================================
   6. STAT COUNTER ANIMATION
   ============================================= */
(function initStatCounters() {
    const statNumbers = $$('.stat-number');

    // Parse the numeric value from stat text
    function parseStatValue(text) {
        const cleaned = text.replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
    }

    function formatStat(original, progress) {
        const value = parseStatValue(original);
        const current = value * progress;

        if (original.includes('%')) {
            return current.toFixed(1) + '%';
        } else if (original.includes('M+')) {
            return Math.floor(current) + 'M+';
        } else if (original.includes('k')) {
            return Math.floor(current) + 'k';
        } else if (original.includes('s')) {
            return current.toFixed(1) + 's';
        }
        return Math.floor(current).toString();
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const original = el.dataset.original || el.textContent.trim();
                el.dataset.original = original;

                const duration = 1600;
                const start = performance.now();

                function tick(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = formatStat(original, eased);
                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        el.textContent = original;
                    }
                }

                requestAnimationFrame(tick);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
})();

/* =============================================
   7. HERO PARALLAX EFFECT (subtle)
   ============================================= */
(function initParallax() {
    const heroBlobs = $$('.hero-blob');
    const particles = $$('.particle');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const factor = 0.15;

        heroBlobs.forEach((blob, i) => {
            const dir = i % 2 === 0 ? 1 : -1;
            blob.style.transform = `translateY(${scrollY * factor * dir}px)`;
        });

        particles.forEach((p, i) => {
            const dir = i % 2 === 0 ? 0.08 : -0.06;
            p.style.transform = `translateY(${scrollY * dir}px)`;
        });
    }, { passive: true });
})();

/* =============================================
   8. BUTTON GLOW RIPPLE EFFECT
   ============================================= */
(function initButtonRipple() {
    const primaryBtns = $$('.btn-primary');

    primaryBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
        position: absolute;
        width: 0;
        height: 0;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: rippleEffect 0.6s ease-out forwards;
        pointer-events: none;
      `;

            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Inject ripple keyframes if not already present
    if (!document.getElementById('rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `
      @keyframes rippleEffect {
        to {
          width: 200px;
          height: 200px;
          opacity: 0;
        }
      }
    `;
        document.head.appendChild(style);
    }
})();

/* =============================================
   9. FEATURE CARD TILT EFFECT (subtle 3D)
   ============================================= */
(function initCardTilt() {
    const cards = $$('.feature-card:not(.feature-card-center), .stat-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -3;
            const rotY = ((x - cx) / cx) * 3;

            card.style.transform = `translateY(-5px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

/* =============================================
   10. ACTIVE SECTION INDICATOR IN NAVBAR
   ============================================= */
(function initSectionObserver() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${id}`
                    );
                });
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: '-80px 0px -80px 0px',
    });

    sections.forEach(section => observer.observe(section));
})();

/* =============================================
   11. CONSOLE BRAND MESSAGE
   ============================================= */
console.log(
    '%c🌿 AgriTree — AI Plant Intelligence\n%cBuilt with precision. Powered by nature.',
    'color: #0f8f5b; font-size: 16px; font-weight: bold;',
    'color: #4a5e54; font-size: 12px;'
);