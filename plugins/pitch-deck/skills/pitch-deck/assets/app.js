(() => {
  const deck = document.getElementById('deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const progress = document.getElementById('progressFill');
  const cur = document.getElementById('curSlide');
  const tot = document.getElementById('totSlide');
  const mmList = document.getElementById('minimapList');
  const hint = document.getElementById('hint');

  tot.textContent = String(slides.length).padStart(2, '0');

  // Build minimap
  slides.forEach((s, i) => {
    const li = document.createElement('li');
    li.dataset.index = i;
    li.innerHTML = `<span class="mm-dot"></span><span class="mm-label">${s.dataset.title}</span>`;
    li.addEventListener('click', () => goTo(i));
    mmList.appendChild(li);
  });
  const mmItems = Array.from(mmList.querySelectorAll('li'));

  let current = 0;
  function setActive(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
    cur.textContent = String(current + 1).padStart(2, '0');
    progress.style.width = ((current) / (slides.length - 1) * 100) + '%';
    mmItems.forEach((el, idx) => el.classList.toggle('on', idx === current));
  }

  function goTo(i) {
    if (i < 0 || i >= slides.length) return;
    slides[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Track active slide via IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > 0.5) {
        const idx = slides.indexOf(e.target);
        if (idx !== -1) setActive(idx);
        e.target.classList.add('in-view');
        // Trigger counters
        e.target.querySelectorAll('.cnt').forEach(animateCount);
      }
    });
  }, { root: deck, threshold: [0.5, 0.75] });
  slides.forEach(s => io.observe(s));

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault(); goTo(current + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault(); goTo(current - 1);
    } else if (e.key === 'Home') {
      e.preventDefault(); goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault(); goTo(slides.length - 1);
    }
  });

  // Hide hint after first nav
  let interacted = false;
  function fadeHint() {
    if (interacted) return;
    interacted = true;
    hint.classList.add('fade');
  }
  deck.addEventListener('scroll', fadeHint, { once: true });
  document.addEventListener('keydown', fadeHint, { once: true });
  setTimeout(() => hint.classList.add('fade'), 6000);

  // Animated counters
  const animated = new WeakSet();
  function animateCount(el) {
    if (animated.has(el)) return;
    animated.add(el);
    const to = parseFloat(el.dataset.to);
    const dur = 1400;
    const start = performance.now();
    const isInt = Number.isInteger(to);
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = to * eased;
      el.textContent = isInt
        ? Math.round(v).toLocaleString('en-US')
        : v.toFixed(1);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  setActive(0);
})();
