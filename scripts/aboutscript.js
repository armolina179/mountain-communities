(() => {
  if (!window.gsap || !window.Flip) { console.error('GSAP/Flip missing'); return; }
  gsap.registerPlugin(Flip);

  const heroWrap   = document.querySelector('.hero-wrap');
  const homeSlot   = document.querySelector('.home-hero-slot');
  const aboutSlot  = document.querySelector('.about-hero-slot');
  const aboutLeft  = document.querySelector('.about-left');
  const aboutPanel = document.querySelector('.about-panel');
  const aboutScrollEl = document.querySelector('.about-scroll');
  const sr = document.getElementById('sr-announcer');

  // Ensure initial placement
  if (heroWrap && homeSlot && !homeSlot.contains(heroWrap)) homeSlot.appendChild(heroWrap);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let aboutScrollY = 0;

  function setActiveLink(route){
    document.querySelectorAll('.nav-link').forEach(a=>{
      a.classList.toggle('is-active', a.dataset.routeLink === route);
    });
  }

  // Fade/slide panel in/out
  function animatePanel(show){
    if (!aboutPanel) return;
    if (prefersReduced) {
      gsap.set(aboutPanel, { clearProps: 'all' });
      return;
    }
    if (show) {
      gsap.fromTo(aboutPanel, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    } else {
      gsap.to(aboutPanel, { autoAlpha: 0, y: 8, duration: 0.25, ease: 'power1.out' });
    }
  }

  function place(route){
    if (!heroWrap || !homeSlot || !aboutSlot) return;

    // remember/restore About scroll
    const wasAbout = document.body.dataset.route === 'about';
    if (wasAbout && route === 'home' && aboutScrollEl) {
      aboutScrollY = aboutScrollEl.scrollTop;
    }

    const state = window.Flip.getState(heroWrap); // capture BEFORE moving
    (route === 'about' ? aboutSlot : homeSlot).appendChild(heroWrap);
    document.body.dataset.route = route;

    // Animate hero position change
    window.Flip.from(state, {
      duration: prefersReduced ? 0 : 0.65,
      ease: 'power2.out',
      absolute: true,
      nested: true
    });

    // Animate panel visibility
    animatePanel(route === 'about');

    // Update title + active link + SR message
    document.title = route === 'about'
      ? 'About — Mountain Communities of the World'
      : 'Mountain Communities of the World';
    setActiveLink(route);
    sr && (sr.textContent = route === 'about' ? 'About section loaded' : 'Home section loaded');

    // Restore About scroll and focus (next frame after layout settles)
    if (route === 'about' && aboutScrollEl) {
      requestAnimationFrame(()=>{
        aboutScrollEl.scrollTop = aboutScrollY;
        const aboutH1 = document.querySelector('.about-hero');
        aboutH1 && aboutH1.focus({ preventScroll: true });
      });
    }
  }

  // Hash router (works locally without server rewrites)
  const routeFromHash = () => location.hash.startsWith('#/about') ? 'about' : 'home';
  function goto(route){
    const want = route === 'about' ? '#/about' : '#/';
    if (location.hash !== want) location.hash = want;
    place(route);
  }

  // Initial mount
  if (!location.hash) location.hash = '#/';
  place(routeFromHash());

  // Back/forward
  window.addEventListener('hashchange', () => place(routeFromHash()));

  // Intercept SPA links (home/about)
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[data-route-link]');
    if (!a) return;
    const r = a.dataset.routeLink;
    if (r === 'home' || r === 'about') {
      e.preventDefault();
      goto(r);
    }
  });

  // Click the left panel to go back home
  if (aboutLeft) aboutLeft.addEventListener('click', () => goto('home'));
})(); 
  