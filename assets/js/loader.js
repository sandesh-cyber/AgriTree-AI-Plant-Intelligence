/**
 * AgriTree Neo-Loader Animation Engine
 * Recreates premium liquid mask reveal and exit transitions.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Ensure scrolling is locked during loading
  document.documentElement.classList.add('loading-active');
  if (window.lenis) window.lenis.stop();

  // Elements
  const title = document.getElementById('neo-loader-title');
  const subtitle = document.getElementById('neo-loader-subtitle');
  
  if (!title || !subtitle) return;

  // Split title and subtitle in loader
  const loaderTitleSplit = new SplitType(title, { types: 'words,chars' });
  const loaderSubtitleSplit = new SplitType(subtitle, { types: 'words,chars' });

  // Split hero elements
  const heroMainSplit = new SplitType('.hero-title-main', { types: 'words,chars' });
  const heroAccentSplit = new SplitType('.hero-title-accent', { types: 'words,chars' });
  const heroDescSplit = new SplitType('.hero-description', { types: 'lines' });

  // Set initial states for loader characters (fixed position, blurred, transparent)
  gsap.set(loaderTitleSplit.chars, {
    opacity: 0,
    filter: 'blur(16px)'
  });

  gsap.set(loaderSubtitleSplit.chars, {
    opacity: 0,
    filter: 'blur(10px)'
  });

  // Set initial states for hero elements to enable clean, synchronized reveals on exit!
  gsap.set('.hero-badge', { opacity: 0, y: 20 });
  gsap.set(heroMainSplit.chars, { opacity: 0, y: 40, rotateX: -20 });
  gsap.set(heroAccentSplit.chars, { opacity: 0, y: 40, rotateX: -20 });
  gsap.set(heroDescSplit.lines, { opacity: 0, y: 20 });
  gsap.set('.hero-buttons', { opacity: 0, y: 20 });
  gsap.set('.hero-image-card', { opacity: 0, scale: 0.95 });
  gsap.set('.float-card', { opacity: 0, scale: 0.8 });
  gsap.set('.hero-glow', { opacity: 0, scale: 0.8 });

  // Single Master Timeline
  const masterTl = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });

  // 1. Intro Animation Sequence (Flowing Liquid Mask Reveal)
  const maskObj = { progress: 0 };
  
  masterTl
    // Animate the liquid mask gradient flowing downward over the text
    .to(maskObj, {
      progress: 130,
      duration: 2.2,
      ease: 'power3.inOut',
      onUpdate: () => {
        const p = maskObj.progress;
        const start = Math.max(0, p - 35);
        const end = Math.min(100, p + 5);
        const maskString = `linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) ${start}%, rgba(255,255,255,0) ${end}%, rgba(255,255,255,0) 100%)`;
        gsap.set('.neo-loader-content', {
          webkitMaskImage: maskString,
          maskImage: maskString
        });
      }
    }, 0)
    // Synchronize title characters sharpening and fading in
    .to(loaderTitleSplit.chars, {
      opacity: 1,
      filter: 'blur(0px)',
      stagger: 0.025,
      duration: 1.2
    }, 0.25)
    // Synchronize subtitle characters sharpening and fading in as sweep passes
    .to(loaderSubtitleSplit.chars, {
      opacity: 0.85,
      filter: 'blur(0px)',
      stagger: 0.015,
      duration: 0.9
    }, 0.85)
    // Hold animation briefly
    .to({}, { duration: 0.6 });

  // Pause timeline to wait for image frames preloading
  masterTl.add(() => {
    masterTl.pause();
    checkImageLoading();
  });

  // 2. Exit & Hero Entrance Reveal Animation Sequence
  masterTl
    // Scale loader text slightly larger and move upward (cinematic transition)
    .to('.neo-loader-content', {
      scale: 1.05,
      y: -40,
      duration: 0.8,
      ease: 'power3.inOut'
    })
    // Smoothly fade out the typography and apply soft blur
    .to([loaderTitleSplit.chars, loaderSubtitleSplit.chars], {
      opacity: 0,
      filter: 'blur(8px)',
      stagger: 0.008,
      duration: 0.6,
      ease: 'power3.in'
    }, '-=0.5')
    // Fullscreen overlay fades and slides up to reveal homepage
    .to('#neo-loader', {
      opacity: 0,
      yPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut',
      onComplete: () => {
        // Remove loader element from DOM
        const loader = document.getElementById('neo-loader');
        if (loader) loader.remove();
        document.documentElement.classList.remove('loading-active');
        if (window.lenis) window.lenis.start();
        ScrollTrigger.refresh();
      }
    }, '-=0.4')
    // Hero Entrance reveals begin immediately
    .to('.hero-glow', {
      opacity: 0.6,
      scale: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, '-=0.8')
    .to('.hero-badge', {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, '-=0.9')
    .to(heroMainSplit.chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.02,
      duration: 0.8
    }, '-=0.8')
    .to(heroAccentSplit.chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.02,
      duration: 0.8
    }, '-=0.6')
    .to(heroDescSplit.lines, {
      opacity: 1,
      y: 0,
      stagger: 0.06,
      duration: 0.8
    }, '-=0.6')
    .to('.hero-buttons', {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, '-=0.5')
    .to('.hero-image-card', {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=0.8')
    .to('.float-card', {
      opacity: 1,
      scale: 1,
      stagger: 0.15,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.6');

  // Loader Preloader Checking
  let isLoaderReadyToExit = false;

  const progressObserver = new MutationObserver(() => {
    const progressEl = document.getElementById('load-progress');
    if (progressEl && progressEl.textContent.trim() === '100%') {
      isLoaderReadyToExit = true;
      progressObserver.disconnect();
      resumeTimeline();
    }
  });

  const progressEl = document.getElementById('load-progress');
  if (progressEl) {
    progressObserver.observe(progressEl, { childList: true, characterData: true, subtree: true });
    if (progressEl.textContent.trim() === '100%') {
      isLoaderReadyToExit = true;
      progressObserver.disconnect();
    }
  } else {
    isLoaderReadyToExit = true;
  }

  // Safety Timeout: Force exit after 3.5 seconds
  const safetyTimeout = setTimeout(() => {
    if (!isLoaderReadyToExit) {
      isLoaderReadyToExit = true;
      progressObserver.disconnect();
      resumeTimeline();
    }
  }, 3500);

  function checkImageLoading() {
    if (isLoaderReadyToExit) {
      resumeTimeline();
    }
  }

  function resumeTimeline() {
    clearTimeout(safetyTimeout);
    masterTl.play();
  }

  // Handle SplitType recalculations on window resize for hero section
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      heroMainSplit.split();
      heroAccentSplit.split();
      heroDescSplit.split();
      loaderTitleSplit.split();
      loaderSubtitleSplit.split();
    }, 250);
  });
});
