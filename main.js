(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Theme toggle (remembers the choice; falls back to the OS setting).
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  $('.theme-btn').addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    drawGrid();
  });

  // Mobile menu.
  const menuBtn = $('.menu-btn'), menu = $('#menu');
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }));

  // Nav border on scroll + active section link.
  const nav = $('.nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });
  const links = new Map($$('#menu a').map(a => [a.getAttribute('href').slice(1), a]));
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { links.forEach(a => a.classList.remove('active')); links.get(e.target.id)?.classList.add('active'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => sectionObserver.observe(s));

  // Resume dropdown.
  const dd = $('.dropdown'), ddBtn = $('.dropdown > button');
  ddBtn.addEventListener('click', e => { e.stopPropagation(); const o = dd.classList.toggle('open'); ddBtn.setAttribute('aria-expanded', String(o)); });
  document.addEventListener('click', () => { dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded', 'false'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded', 'false'); } });

  // Typing roles.
  const roles = ['Software Developer', 'SDET / Test Automation', 'Full-Stack Engineer (Java · React)', 'Agentic-AI power user'];
  const roleEl = $('#role');
  if (!reduceMotion) {
    let r = 0, i = roles[0].length, deleting = true;
    const tick = () => {
      const word = roles[r];
      i += deleting ? -1 : 1;
      roleEl.textContent = word.slice(0, i);
      let delay = deleting ? 35 : 70;
      if (!deleting && i === word.length) { deleting = true; delay = 1800; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
  }

  // Count-up stats.
  const countUp = el => {
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1200;
    const step = now => { const p = Math.min(1, (now - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  // Reveal on scroll.
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.classList.contains('count')) countUp(e.target);
    io.unobserve(e.target);
  }), { threshold: 0.12 });
  $$('.reveal, .count').forEach(el => io.observe(el));

  // Screenshot gallery: auto-advance, pause on hover/focus, click dots.
  $$('[data-gallery]').forEach(g => {
    const shots = $$('.shot', g), dots = $$('.dots button', g);
    let idx = 0, timer;
    const show = n => {
      idx = (n + shots.length) % shots.length;
      shots.forEach((s, k) => s.classList.toggle('active', k === idx));
      dots.forEach((d, k) => d.setAttribute('aria-selected', String(k === idx)));
    };
    const start = () => { if (!reduceMotion) { stop(); timer = setInterval(() => show(idx + 1), 4000); } };
    const stop = () => clearInterval(timer);
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); start(); }));
    g.addEventListener('mouseenter', stop); g.addEventListener('mouseleave', start);
    g.addEventListener('focusin', stop); g.addEventListener('focusout', start);
    start();
  });

  // Copy email.
  const toast = $('.toast');
  const say = msg => { toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800); };
  $('#copy-email').addEventListener('click', async e => {
    try { await navigator.clipboard.writeText(e.currentTarget.dataset.email); say('Email copied'); }
    catch { say(e.currentTarget.dataset.email); }
  });

  $('#year').textContent = new Date().getFullYear();

  // Animated dot grid in the hero (lightweight, pauses when off-screen).
  const canvas = $('#grid'), ctx = canvas.getContext('2d');
  let w, h, dpr, visible = true, mouse = { x: -999, y: -999 };
  function drawGrid(t = 0) {
    const css = getComputedStyle(root);
    const dotColor = css.getPropertyValue('--grid').trim();
    const accent = css.getPropertyValue('--accent').trim();
    ctx.clearRect(0, 0, w, h);
    const gap = 28;
    for (let x = gap / 2; x < w; x += gap) {
      for (let y = gap / 2; y < h; y += gap) {
        const dx = x - mouse.x, dy = y - mouse.y, dist = Math.hypot(dx, dy);
        const wave = reduceMotion ? 0 : Math.sin((x + y) * 0.02 + t * 0.0012) * 0.6;
        const near = Math.max(0, 1 - dist / 160);
        ctx.fillStyle = near > 0.05 ? accent : dotColor;
        ctx.globalAlpha = near > 0.05 ? 0.25 + near * 0.6 : 1;
        ctx.beginPath(); ctx.arc(x, y, 1.2 + wave * 0.4 + near * 1.8, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawGrid();
  };
  addEventListener('resize', resize);
  $('.hero').addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
  $('.hero').addEventListener('pointerleave', () => { mouse = { x: -999, y: -999 }; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  resize();
  if (!reduceMotion) {
    const loop = t => { if (visible) drawGrid(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
})();
