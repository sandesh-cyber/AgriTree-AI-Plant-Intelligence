/* =============================================
   AGRITREE — PREMIUM PLANT AI LANDING PAGE
   Scrollytelling & Cinematic Animation Engine
   ============================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  /* =============================================
     1. SMOOTH SCROLLING (LENIS)
     ============================================= */
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker with Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable lag smoothing for smooth ScrollTrigger sync
    gsap.ticker.lagSmoothing(0);

    // Lock scrolling immediately during preloading
    lenis.stop();
  } catch (error) {
    console.error('Lenis smooth scroll failed to initialize:', error);
  }

  /* =============================================
     2. NAVBAR CONTROL & SMOOTH LINK SCROLLING
     ============================================= */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Shrink navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Handle smooth scroll clicks via Lenis
  const smoothScrollTo = (targetSelector) => {
    if (targetSelector === '#') return;
    const target = document.querySelector(targetSelector);
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.5 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      smoothScrollTo(this.getAttribute('href'));
    });
  });

  /* =============================================
     3. MOBILE MENU TOGGLE
     ============================================= */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let isMobileMenuOpen = false;

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    mobileMenu.classList.toggle('open', isMobileMenuOpen);
    mobileMenuBtn.setAttribute('aria-expanded', isMobileMenuOpen);
    
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (isMobileMenuOpen) {
      spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
      spans[1].style.cssText = 'opacity: 0';
      spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMobileMenuOpen) toggleMobileMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (isMobileMenuOpen && !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        toggleMobileMenu();
      }
    });
  }

  /* =============================================
     IMAGE FRAME PRELOADER & CANVAS GROWTH ENGINE
     ============================================= */
  const canvas = document.getElementById("growth-canvas");
  const context = canvas ? canvas.getContext("2d") : null;
  const frameCount = 240;
  const currentFrame = index => `/assets/images/plant-frames/frame_${String(index + 1).padStart(4, '0')}.png`;
  
  const images = [];
  const airtree = { frame: 0 };
  let loadedImagesCount = 0;
  
  if (canvas && context) {
    const onImageLoaded = () => {
      loadedImagesCount++;
      const progress = Math.round((loadedImagesCount / frameCount) * 100);
      const progressEl = document.getElementById("load-progress");
      if (progressEl) progressEl.textContent = `${progress}%`;
      
      if (loadedImagesCount === frameCount) {
        gsap.to("#growth-loader", {
          opacity: 0,
          visibility: "hidden",
          duration: 0.6,
          onComplete: () => {
            // Re-enable scrolling now that layout calculations are finished and stable!
            document.documentElement.classList.remove('loading-active');
            if (lenis) lenis.start();
            renderFrame(Math.round(airtree.frame));
            ScrollTrigger.refresh();
          }
        });
      }
    };

    // Preload images
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        if (i === 0) {
          // Set natural aspect ratio dimensions when first image loads
          canvas.width = img.naturalWidth || 1920;
          canvas.height = img.naturalHeight || 1080;
          renderFrame(0);
        }
        onImageLoaded();
      };
      img.onerror = () => {
        onImageLoaded();
      };
      images.push(img);
    }

    // Set initial size fallback
    canvas.width = 1920;
    canvas.height = 1080;

    // Note: ScrollTrigger is registered inside matchMedia blocks to preserve DOM spacing order!

    // Handle window resize event to redraw frame properly
    window.addEventListener("resize", () => {
      renderFrame(Math.round(airtree.frame));
    });
  }

  function renderFrame(frameIndex) {
    const img = images[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw centered (contain aspect ratio algorithm)
    const imageWidth = img.naturalWidth;
    const imageHeight = img.naturalHeight;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const ratio = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);
    const newWidth = imageWidth * ratio;
    const newHeight = imageHeight * ratio;
    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;
    
    context.drawImage(img, x, y, newWidth, newHeight);
  }



  /* =============================================
     4. GSAP MEDIA QUERIES & RESPONSIVE SCROLLYTELLING
     ============================================= */
  const mm = gsap.matchMedia();

  // ---------------------------------------------
  // DESKTOP ANIMATIONS (Pinned layouts, complex timelines)
  // ---------------------------------------------
  mm.add("(min-width: 768px)", () => {

    /* --- HERO SCROLL ANIMATIONS --- */
    gsap.fromTo('.hero-plant-img', 
      { scale: 1.25 },
      { 
        scale: 1.0, 
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      }
    );

    gsap.to('.float-top-right', {
      y: -60,
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 0.5 }
    });

    gsap.to('.float-bottom-left', {
      y: 40,
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 0.5 }
    });

    gsap.to('.blob1', {
      rotation: 90,
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    // Stagger reveal hero text on load
    const heroTl = gsap.timeline();
    heroTl.from('.hero-badge', { opacity: 0, y: 15, duration: 0.6, ease: 'power2.out' })
          .from('.hero-heading', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' }, '-=0.4')
          .from('.hero-description', { opacity: 0, y: 18, duration: 0.6, ease: 'power2.out' }, '-=0.5')
          .from('.hero-buttons', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, '-=0.4')
          .from('.hero-image-card', { opacity: 0, scale: 0.95, duration: 1.0, ease: 'power3.out' }, '-=0.8');

    /* --- 1. PINNED AI SCAN SHOWCASE --- */
    const scanTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#ai-scan',
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: true,
        anticipatePin: 1
      }
    });

    // Reset components
    gsap.set('.laser-bar', { top: '0%', opacity: 0 });
    gsap.set('.scan-hotspot', { scale: 0 });

    // Timeline steps
    scanTl.to('.laser-bar', { opacity: 1, duration: 0.1 })
          .to('.laser-bar', { top: '100%', duration: 1.2, ease: 'none' })
          // Trigger hotspots as laser passes them
          .to('#hotspot-leaf', { scale: 1, ease: 'back.out(1.7)', duration: 0.25 }, '-=0.9')
          .to('#hotspot-node', { scale: 1, ease: 'back.out(1.7)', duration: 0.25 }, '-=0.55')
          .to('.laser-bar', { opacity: 0, duration: 0.15 })
          // Stagger reveal console diagnostic logs
          .to('.console-line', {
            opacity: 0.85,
            y: 0,
            stagger: 0.15,
            duration: 0.6,
            className: 'console-line visible'
          }, '-=1.0');


    /* --- 2. PINNED PLANT GROWTH CANVAS SHOWCASE --- */
    // Split growth slide headers for custom animated words/lines reveals
    const growthSlidesList = document.querySelectorAll(".growth-slide");
    growthSlidesList.forEach(slide => {
      const title = slide.querySelector(".stage-title");
      const desc = slide.querySelector(".stage-desc");
      new SplitType(title, { types: 'words' });
      new SplitType(desc, { types: 'lines' });
    });

    gsap.set(".growth-slide", { autoAlpha: 0 });
    gsap.set(".growth-slide .stage-title .word", { opacity: 0, y: 40, filter: "blur(8px)" });
    gsap.set(".growth-slide .stage-desc .line", { opacity: 0, y: 15 });

    const growthTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#plant-growth",
        start: "top top",
        end: "+=400%", // 4 screens height scroll duration
        pin: true,
        scrub: true,
        anticipatePin: 1
      }
    });

    // Linear frame animation spanning the entire timeline duration
    growthTl.to(airtree, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      duration: 23.5,
      onUpdate: () => {
        renderFrame(Math.round(airtree.frame));
      }
    }, 0);

    // Stage 1: Enters immediately, holds, exits
    growthTl.to("#growth-stage-1", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5 }, 0);
    growthTl.to("#growth-stage-1 .stage-title .word", { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, ease: "power2.out", duration: 2.4 }, 0);
    growthTl.to("#growth-stage-1 .stage-desc .line", { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out", duration: 1.8 }, 0.4);
    growthTl.to("#growth-stage-1", { autoAlpha: 0, y: -60, filter: "blur(15px)", ease: "power2.in", duration: 2.5 }, 4);

    // Stage 2: Enters, holds, exits
    growthTl.to("#growth-stage-2", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5 }, 6.5);
    growthTl.to("#growth-stage-2 .stage-title .word", { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, ease: "power2.out", duration: 2.4 }, 6.5);
    growthTl.to("#growth-stage-2 .stage-desc .line", { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out", duration: 1.8 }, 6.9);
    growthTl.to("#growth-stage-2", { autoAlpha: 0, y: -60, filter: "blur(15px)", ease: "power2.in", duration: 2.5 }, 10.5);

    // Stage 3: Enters, holds, exits
    growthTl.to("#growth-stage-3", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5 }, 13);
    growthTl.to("#growth-stage-3 .stage-title .word", { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, ease: "power2.out", duration: 2.4 }, 13);
    growthTl.to("#growth-stage-3 .stage-desc .line", { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out", duration: 1.8 }, 13.4);
    growthTl.to("#growth-stage-3", { autoAlpha: 0, y: -60, filter: "blur(15px)", ease: "power2.in", duration: 2.5 }, 17);

    // Stage 4: Enters, holds
    growthTl.to("#growth-stage-4", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5 }, 19.5);
    growthTl.to("#growth-stage-4 .stage-title .word", { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, ease: "power2.out", duration: 2.4 }, 19.5);
    growthTl.to("#growth-stage-4 .stage-desc .line", { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out", duration: 1.8 }, 19.9);

    /* --- 3. CINEMATIC S-CURVE WAVE FEATURES --- */
    const waveFeatures = document.querySelector('.wave-features');
    if (waveFeatures) {
      const track = document.querySelector('.wave-track');
      const cards = document.querySelectorAll('.wave-card');
      const path = document.getElementById('wavePath');
      
      let pathLength = 4000;
      if (path) {
        try {
          pathLength = path.getTotalLength();
        } catch (e) {
          console.warn('SVG path getTotalLength failed:', e);
        }
        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      }

      function getCenteringTranslation(card) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Offset relative to the track container
        const cardLeft = card.offsetLeft;
        const cardTop = card.offsetTop;
        const cardWidth = card.offsetWidth;
        const cardHeight = card.offsetHeight;
        
        // Calculate the translation to align center of card with center of viewport
        const x = (viewportWidth / 2) - (cardLeft + cardWidth / 2);
        const y = (viewportHeight / 2) - (cardTop + cardHeight / 2);
        
        return { x, y };
      }

      const featuresTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.wave-features',
          start: 'top top',
          end: '+=350%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      // Set initial positions
      featuresTl.set(track, {
        x: () => getCenteringTranslation(cards[0]).x,
        y: () => getCenteringTranslation(cards[0]).y
      });
      featuresTl.set(cards[0], { opacity: 1, scale: 1.12, rotation: 0 });
      featuresTl.set([cards[1], cards[2], cards[3], cards[4]], { opacity: 0.45 });

      // Animate SVG path drawing across the entire timeline (duration 4)
      if (path) {
        featuresTl.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          duration: 4
        }, 0);
      }

      // Card 1 to 2
      featuresTl.to(track, {
        x: () => getCenteringTranslation(cards[1]).x,
        y: () => getCenteringTranslation(cards[1]).y,
        ease: 'power1.inOut',
        duration: 1
      }, 0)
      .to(cards[0], { opacity: 0.45, scale: 1.05, rotation: 2, ease: 'power1.inOut', duration: 1 }, 0)
      .to(cards[1], { opacity: 1, scale: 1.12, rotation: 0, ease: 'power1.inOut', duration: 1 }, 0);

      // Card 2 to 3
      featuresTl.to(track, {
        x: () => getCenteringTranslation(cards[2]).x,
        y: () => getCenteringTranslation(cards[2]).y,
        ease: 'power1.inOut',
        duration: 1
      }, 1)
      .to(cards[1], { opacity: 0.45, scale: 0.95, rotation: -1.5, ease: 'power1.inOut', duration: 1 }, 1)
      .to(cards[2], { opacity: 1, scale: 1.12, rotation: 0, ease: 'power1.inOut', duration: 1 }, 1);

      // Card 3 to 4
      featuresTl.to(track, {
        x: () => getCenteringTranslation(cards[3]).x,
        y: () => getCenteringTranslation(cards[3]).y,
        ease: 'power1.inOut',
        duration: 1
      }, 2)
      .to(cards[2], { opacity: 0.45, scale: 1.1, rotation: 1, ease: 'power1.inOut', duration: 1 }, 2)
      .to(cards[3], { opacity: 1, scale: 1.12, rotation: 0, ease: 'power1.inOut', duration: 1 }, 2);

      // Card 4 to 5
      featuresTl.to(track, {
        x: () => getCenteringTranslation(cards[4]).x,
        y: () => getCenteringTranslation(cards[4]).y,
        ease: 'power1.inOut',
        duration: 1
      }, 3)
      .to(cards[3], { opacity: 0.45, scale: 1.0, rotation: -2, ease: 'power1.inOut', duration: 1 }, 3)
      .to(cards[4], { opacity: 1, scale: 1.12, rotation: 0, ease: 'power1.inOut', duration: 1 }, 3);
    }


    /* --- 4. PINNED DISEASE DETECTION SLIDER --- */
    const diseaseTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#disease-detection',
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: true,
        anticipatePin: 1
      }
    });

    gsap.set('.diseased-overlay-wrapper', { width: '100%' });
    gsap.set('.slider-divider', { left: '100%' });

    // Slider divider sweeps right-to-left to reveal healthy underlay
    diseaseTl.to('.slider-divider', { left: '0%', duration: 1.5, ease: 'power1.inOut' })
             .to('.diseased-overlay-wrapper', { width: '0%', duration: 1.5, ease: 'power1.inOut' }, '-=1.5')
             // Toggle active items on side
             .to('#detail-unscanned', { className: 'disease-detail-item', duration: 0.1 }, '-=1.2')
             .to('#detail-scanned', { className: 'disease-detail-item active', duration: 0.1 }, '-=0.8')
             // Fade diagnosis boxes
             .to('.diseased-card', { opacity: 0, scale: 0.9, duration: 0.4 }, '-=1.4')
             .from('.healthy-card', { opacity: 0, scale: 0.9, duration: 0.5 }, '-=0.7');


    /* --- 5. PINNED TESTIMONIALS (HORIZONTAL SCROLL) --- */
    const track = document.querySelector('.testimonials-horizontal-track');
    const horizontalScrollLength = track.scrollWidth - window.innerWidth + 48; // add container padding

    const horizontalTween = gsap.to(track, {
      x: -horizontalScrollLength,
      ease: 'none',
      scrollTrigger: {
        trigger: '#community',
        start: 'top top',
        end: () => `+=${horizontalScrollLength}`,
        pin: true,
        scrub: true,
        anticipatePin: 1
      }
    });

    // Testimonials Card line staggers on horizontal scroll
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
      const quote = card.querySelector('.testimonial-quote');
      const quoteLines = new SplitType(quote, { types: 'lines' });
      
      gsap.from(quoteLines.lines, {
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalTween,
          start: 'left 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power2.out'
      });
    });


    /* --- 6. FAQ AUTO SCROLL ACCORDION --- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, idx) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => autoOpenFAQ(item),
        onEnterBack: () => autoOpenFAQ(item),
        // Close last item on leaving section
        onLeave: () => { if (idx === faqItems.length - 1) closeAllFAQs(); },
        onLeaveBack: () => { if (idx === 0) closeAllFAQs(); }
      });
    });

    function autoOpenFAQ(activeItem) {
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon i');
        const answer = item.querySelector('.faq-answer');

        if (item === activeItem) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
          if (icon) icon.className = 'fa-solid fa-chevron-up';
        } else {
          item.classList.remove('open');
          question.setAttribute('aria-expanded', 'false');
          if (icon) icon.className = 'fa-solid fa-chevron-down';
        }
      });
    }

    function closeAllFAQs() {
      faqItems.forEach(item => {
        item.classList.remove('open');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        const icon = item.querySelector('.faq-icon i');
        if (icon) icon.className = 'fa-solid fa-chevron-down';
      });
    }


    /* --- 7. CTA SECTION CONVERGENCE --- */
    const ctaTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    });

    // Convergence movement of cards on scroll
    ctaTl.from('.card-tl', { x: -120, y: -80, opacity: 0, duration: 1 })
         .from('.card-tr', { x: 120, y: -60, opacity: 0, duration: 1 }, '-=1')
         .from('.card-bl', { x: -100, y: 80, opacity: 0, duration: 1 }, '-=1')
         .from('.card-br', { x: 100, y: 60, opacity: 0, duration: 1 }, '-=1')
         .to('.cta-box', { scale: 1.03, boxShadow: '0 20px 50px rgba(15, 143, 91, 0.25)', duration: 1 }, '-=0.5');

  });

  // ---------------------------------------------
  // MOBILE ANIMATIONS (Simplified layouts)
  // ---------------------------------------------
  mm.add("(max-width: 767px)", () => {
    // Hero section load reveal is managed in loader.js for uniform animations on mobile and desktop.

    // Simple scroll trigger reveals for stacked sections
    gsap.from('.scan-visual-wrapper', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: { trigger: '.scan-visual-wrapper', start: 'top 85%' }
    });

    /* --- 2. PINNED PLANT GROWTH CANVAS SHOWCASE --- */
    const mobileGrowthSlides = document.querySelectorAll(".growth-slide");
    mobileGrowthSlides.forEach(slide => {
      const title = slide.querySelector(".stage-title");
      const desc = slide.querySelector(".stage-desc");
      new SplitType(title, { types: 'words' });
      new SplitType(desc, { types: 'lines' });
    });

    gsap.set(".growth-slide", { autoAlpha: 0 });
    gsap.set(".growth-slide .stage-title .word", { opacity: 0, y: 40, filter: "blur(8px)" });
    gsap.set(".growth-slide .stage-desc .line", { opacity: 0, y: 15 });

    const growthTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#plant-growth",
        start: "top top",
        end: "+=400%", // 4 screens height scroll duration
        pin: true,
        scrub: true,
        anticipatePin: 1
      }
    });

    // Linear frame animation spanning the entire timeline duration
    growthTl.to(airtree, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      duration: 23.5,
      onUpdate: () => {
        renderFrame(Math.round(airtree.frame));
      }
    }, 0);

    // Stage 1: Enters immediately, holds, exits
    growthTl.to("#growth-stage-1", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5 }, 0);
    growthTl.to("#growth-stage-1 .stage-title .word", { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, ease: "power2.out", duration: 2.4 }, 0);
    growthTl.to("#growth-stage-1 .stage-desc .line", { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out", duration: 1.8 }, 0.4);
    growthTl.to("#growth-stage-1", { autoAlpha: 0, y: -60, filter: "blur(15px)", ease: "power2.in", duration: 2.5 }, 4);

    // Stage 2: Enters, holds, exits
    growthTl.to("#growth-stage-2", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5 }, 6.5);
    growthTl.to("#growth-stage-2 .stage-title .word", { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, ease: "power2.out", duration: 2.4 }, 6.5);
    growthTl.to("#growth-stage-2 .stage-desc .line", { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out", duration: 1.8 }, 6.9);
    growthTl.to("#growth-stage-2", { autoAlpha: 0, y: -60, filter: "blur(15px)", ease: "power2.in", duration: 2.5 }, 10.5);

    // Stage 3: Enters, holds, exits
    growthTl.to("#growth-stage-3", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5 }, 13);
    growthTl.to("#growth-stage-3 .stage-title .word", { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, ease: "power2.out", duration: 2.4 }, 13);
    growthTl.to("#growth-stage-3 .stage-desc .line", { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out", duration: 1.8 }, 13.4);
    growthTl.to("#growth-stage-3", { autoAlpha: 0, y: -60, filter: "blur(15px)", ease: "power2.in", duration: 2.5 }, 17);

    // Stage 4: Enters, holds
    growthTl.to("#growth-stage-4", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5 }, 19.5);
    growthTl.to("#growth-stage-4 .stage-title .word", { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, ease: "power2.out", duration: 2.4 }, 19.5);
    growthTl.to("#growth-stage-4 .stage-desc .line", { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out", duration: 1.8 }, 19.9);

    // Testimonials Card line staggers on mobile vertical scroll
    const mobileTestimonialCards = document.querySelectorAll('.testimonial-card');
    mobileTestimonialCards.forEach(card => {
      const quote = card.querySelector('.testimonial-quote');
      const quoteLines = new SplitType(quote, { types: 'lines' });
      
      gsap.from(quoteLines.lines, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Manual click expand accordion for FAQs on mobile
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(item => {
      const question = item.querySelector('.faq-question');
      const icon = item.querySelector('.faq-icon i');

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all others
        faqs.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            const otherIcon = other.querySelector('.faq-icon i');
            if (otherIcon) otherIcon.className = 'fa-solid fa-chevron-down';
          }
        });

        // Toggle current
        item.classList.toggle('open', !isOpen);
        question.setAttribute('aria-expanded', !isOpen);
        if (icon) {
          icon.className = !isOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
        }
      });
    });
  });


  /* =============================================
     5. STAT NUMBERS COUNT-UP ANIMATION
     ============================================= */
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function parseStatTarget(text) {
    const cleaned = text.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }

  function formatValue(originalText, currentVal) {
    if (originalText.includes('%')) {
      return currentVal.toFixed(1) + '%';
    } else if (originalText.includes('M+')) {
      return Math.floor(currentVal) + 'M+';
    } else if (originalText.includes('k')) {
      return Math.floor(currentVal) + 'k';
    } else if (originalText.includes('s')) {
      return currentVal.toFixed(1) + 's';
    }
    return Math.floor(currentVal).toString();
  }

  statNumbers.forEach(el => {
    const original = el.textContent.trim();
    const targetVal = parseStatTarget(original);
    
    // Set dummy object to animate
    const countObj = { value: 0 };

    gsap.to(countObj, {
      value: targetVal,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.stats',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        el.textContent = formatValue(original, countObj.value);
      },
      onComplete: () => {
        el.textContent = original; // lock to final text
      }
    });
  });

  // Stagger stats card entrance
  gsap.from('.stat-card', {
    opacity: 0,
    y: 28,
    stagger: 0.12,
    duration: 0.8,
    ease: 'back.out(1.5)',
    scrollTrigger: {
      trigger: '.stats',
      start: 'top 85%'
    }
  });


  /* =============================================
     6. CARD TILT INTERACTIVE EFFECS
     ============================================= */
  const tiltCards = document.querySelectorAll('.stat-card, .testimonial-card, .feature-timeline-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -3;
      const rotY = ((x - cx) / cx) * 3;

      card.style.transform = `translateY(-3px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* =============================================
     7. ACTIVE SECTION INDICATOR IN NAVBAR
     ============================================= */
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { passive: true });


  /* =============================================
     8. COMPLETE PREMIUM TYPOGRAPHY ANIMATIONS
     ============================================= */
  // Hero section typography reveals are managed in loader.js for seamless entrance staggers.

  // Split AI Scan
  const scanTitleSplit = new SplitType('.scan-title', { types: 'words' });
  const scanDescSplit = new SplitType('.scan-description', { types: 'lines' });

  gsap.from(scanTitleSplit.words, {
    scrollTrigger: {
      trigger: '.scan-title',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    stagger: 0.05,
    duration: 0.7,
    ease: 'power3.out'
  });

  gsap.from(scanDescSplit.lines, {
    scrollTrigger: {
      trigger: '.scan-description',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 20,
    stagger: 0.06,
    duration: 0.7,
    ease: 'power3.out'
  });

  // Split Features Header
  const featuresTitleSplit = new SplitType('.wave-heading', { types: 'words' });
  const featuresSubSplit = new SplitType('.wave-description', { types: 'lines' });

  if (document.querySelector('.wave-heading')) {
    gsap.from(featuresTitleSplit.words, {
      scrollTrigger: {
        trigger: '.wave-heading',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 35,
      stagger: 0.04,
      duration: 0.8,
      ease: 'power3.out'
    });
  }

  if (document.querySelector('.wave-description')) {
    gsap.from(featuresSubSplit.lines, {
      scrollTrigger: {
        trigger: '.wave-description',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.7,
      ease: 'power3.out'
    });
  }

  // Split Disease Header
  const diseaseTitleSplit = new SplitType('.disease-title', { types: 'words' });
  const diseaseDescSplit = new SplitType('.disease-description', { types: 'lines' });

  gsap.from(diseaseTitleSplit.words, {
    scrollTrigger: {
      trigger: '.disease-title',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    stagger: 0.05,
    duration: 0.7,
    ease: 'power3.out'
  });

  gsap.from(diseaseDescSplit.lines, {
    scrollTrigger: {
      trigger: '.disease-description',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 20,
    stagger: 0.05,
    duration: 0.7,
    ease: 'power3.out'
  });

  // Split FAQ Header
  const faqTitleSplit = new SplitType('.faq .section-title', { types: 'words' });
  const faqSubSplit = new SplitType('.faq .section-subtitle', { types: 'lines' });

  gsap.from(faqTitleSplit.words, {
    scrollTrigger: {
      trigger: '.faq .section-title',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    stagger: 0.04,
    duration: 0.8,
    ease: 'power3.out'
  });

  gsap.from(faqSubSplit.lines, {
    scrollTrigger: {
      trigger: '.faq .section-subtitle',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 20,
    stagger: 0.05,
    duration: 0.7,
    ease: 'power3.out'
  });

  // Split CTA
  const ctaTitleSplit = new SplitType('.cta-heading', { types: 'chars' });
  const ctaSubSplit = new SplitType('.cta-subtext', { types: 'lines' });

  gsap.from(ctaTitleSplit.chars, {
    scrollTrigger: {
      trigger: '.cta-heading',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    rotate: 3,
    scale: 0.9,
    stagger: 0.02,
    duration: 0.8,
    ease: 'back.out(1.4)'
  });

  gsap.from(ctaSubSplit.lines, {
    scrollTrigger: {
      trigger: '.cta-subtext',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 20,
    stagger: 0.06,
    duration: 0.7,
    ease: 'power3.out'
  });

  // Handle SplitType recalculations on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {

      scanTitleSplit.split();
      scanDescSplit.split();
      featuresTitleSplit.split();
      featuresSubSplit.split();
      diseaseTitleSplit.split();
      diseaseDescSplit.split();
      faqTitleSplit.split();
      faqSubSplit.split();
      ctaTitleSplit.split();
      ctaSubSplit.split();
    }, 250);
  });

  /* =============================================
     MAGNETIC BUTTONS ENGINE
     ============================================= */
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull button towards cursor slightly
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        rotateX: -y * 0.05,
        rotateY: x * 0.05,
        ease: 'power2.out',
        duration: 0.5
      });
    });
    
    btn.addEventListener('mouseleave', () => {
      // Elastic snapback
      gsap.to(btn, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        ease: 'elastic.out(1.1, 0.6)',
        duration: 0.8
      });
    });
  });

});

/* Console brand tag */
console.log(
  '%c🌿 AgriTree — AI Plant Intelligence\n%cCinematic Scrollytelling Engine Loaded successfully. Built with GSAP & Lenis.',
  'color: #0f8f5b; font-size: 16px; font-weight: bold;',
  'color: #4a5e54; font-size: 12px;'
);