/* ==========================================
   EMOTION IN LLMs — APP.JS
   All interactivity, animations, visualizations
   ========================================== */

// ==========================================
// NAVBAR: scroll shadow + active links
// ==========================================
(function initNavbar() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  if (toggle && links) {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-mobile-overlay';
    document.body.appendChild(overlay);

    // Toggle menu
    toggle.addEventListener('click', () => {
      const isActive = links.classList.toggle('active');
      toggle.classList.toggle('active', isActive);
      overlay.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
      links.classList.remove('active');
      toggle.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close menu when clicking a link
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
        toggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
})();

// ==========================================
// HERO CANVAS: animated floating particles
// ==========================================
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const EMOTIONS = [
    { label: 'Happy', x: 0.65, y: 0.35, color: '#F59E4D' },
    { label: 'Afraid', x: 0.3, y: 0.3, color: '#60A5FA' },
    { label: 'Angry', x: 0.25, y: 0.55, color: '#F87171' },
    { label: 'Calm', x: 0.7, y: 0.7, color: '#34D399' },
    { label: 'Proud', x: 0.75, y: 0.45, color: '#A78BFA' },
    { label: 'Sad', x: 0.35, y: 0.65, color: '#93C5FD' },
    { label: 'Curious', x: 0.55, y: 0.4, color: '#FDE68A' },
    { label: 'Guilty', x: 0.4, y: 0.6, color: '#FCA5A5' },
    { label: 'Excited', x: 0.6, y: 0.55, color: '#6EE7B7' },
    { label: 'Hopeful', x: 0.55, y: 0.65, color: '#C4B5FD' },
    { label: 'Hostile', x: 0.2, y: 0.45, color: '#FB7185' },
    { label: 'Blissful', x: 0.78, y: 0.3, color: '#FCD34D' },
    { label: 'Anxious', x: 0.28, y: 0.4, color: '#7DD3FC' },
    { label: 'Relieved', x: 0.72, y: 0.6, color: '#86EFAC' },
    { label: 'Brooding', x: 0.32, y: 0.72, color: '#C4B5FD' },
  ];

  // Particle class
  class Particle {
    constructor(emotion) {
      this.emo = emotion;
      this.ox = emotion.x;
      this.oy = emotion.y;
      this.x = emotion.x;
      this.y = emotion.y;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.00015 + Math.random() * 0.0001;
      this.r = 0.012 + Math.random() * 0.008;
      this.alpha = 0;
      this.targetAlpha = 0.55 + Math.random() * 0.3;
      this.fadeSpeed = 0.008 + Math.random() * 0.006;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }
    update(t) {
      this.angle += this.speed;
      this.x = this.ox + Math.cos(this.angle) * this.r;
      this.y = this.oy + Math.sin(this.angle) * this.r;
      if (this.alpha < this.targetAlpha) this.alpha += this.fadeSpeed;
    }
    draw(ctx, w, h) {
      const cx = this.x * w;
      const cy = this.y * h;
      const pulse = 1 + 0.12 * Math.sin(Date.now() * 0.002 + this.pulsePhase);
      const radius = 6 * pulse;

      // Glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 3.5);
      grd.addColorStop(0, this.emo.color + '55');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.emo.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();

      // Label
      ctx.globalAlpha = this.alpha * 0.7;
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.textAlign = 'center';
      ctx.fillText(this.emo.label, cx, cy + radius + 14);
      ctx.globalAlpha = 1;
    }
  }

  const particles = EMOTIONS.map(e => new Particle(e));

  // Draw connections between similar particles
  const connections = [
    [0, 6], [0, 4], [0, 8], [0, 11], // happy cluster
    [1, 12], [1, 10], // fear cluster
    [2, 10], [2, 7], // anger cluster
    [3, 9], [3, 13], // calm cluster
    [5, 7], [5, 14], // sad cluster
  ];

  let animId;
  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Draw connections
    connections.forEach(([a, b]) => {
      const pa = particles[a], pb = particles[b];
      const ax = pa.x * w, ay = pa.y * h;
      const bx = pb.x * w, by = pb.y * h;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    particles.forEach(p => {
      p.update(Date.now());
      p.draw(ctx, w, h);
    });

    animId = requestAnimationFrame(draw);
  }

  draw();
})();

// ==========================================
// COUNTER ANIMATION: hero stats
// ==========================================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 1800;
      const start = performance.now();
      const ease = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(ease(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ==========================================
// SCROLL ANIMATIONS: fade-up + why-cards
// ==========================================
(function initScrollAnimations() {
  // Generic fade-up
  document.querySelectorAll('.section-header, .visual-lab-card, .exp-card, .impl-card, .lim-card, .concept-card, .conclusion-wrap').forEach(el => {
    el.classList.add('fade-up');
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

  // Why cards with staggered delay
  const whyObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay) || 0;
        setTimeout(() => e.target.classList.add('visible'), delay);
        whyObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.why-card').forEach(el => whyObs.observe(el));
})();

// ==========================================
// ACTIVATION CANVAS: concept visual
// ==========================================
(function initActivationVis() {
  const wrap = document.getElementById('activationVis');
  if (!wrap) return;

  const canvas = document.createElement('canvas');
  canvas.width = 280; canvas.height = 100;
  canvas.style.width = '100%'; canvas.style.height = 'auto';
  wrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const ROWS = 4, COLS = 14;
  let neurons = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      neurons.push({
        r, c,
        v: Math.random(),
        tv: Math.random(),
        speed: 0.01 + Math.random() * 0.02,
        color: Math.random() > 0.7 ? '#CF6C2E' : Math.random() > 0.5 ? '#2D5BE3' : '#9CA3AF',
      });
    }
  }

  // Periodically re-fire neurons
  setInterval(() => {
    const subset = Math.floor(neurons.length * 0.3);
    for (let i = 0; i < subset; i++) {
      const n = neurons[Math.floor(Math.random() * neurons.length)];
      n.tv = Math.random();
      n.color = Math.random() > 0.6 ? '#CF6C2E' : Math.random() > 0.4 ? '#2D5BE3' : '#9CA3AF';
    }
  }, 400);

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cw = w / COLS, ch = h / ROWS;

    neurons.forEach(n => {
      n.v += (n.tv - n.v) * n.speed;
      const cx = n.c * cw + cw / 2;
      const cy = n.r * ch + ch / 2;
      const radius = 5 + n.v * 5;
      const alpha = 0.2 + n.v * 0.8;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ==========================================
// MINI STEERING DEMO
// ==========================================
(function initMiniSteering() {
  const slider = document.getElementById('miniSteering');
  const bar = document.getElementById('miniBar');
  const text = document.getElementById('miniText');
  if (!slider) return;

  const states = [
    { t: -100, label: 'Very reluctant (−303 Elo)', pct: 8, color: '#EF4444' },
    { t: -50, label: 'Somewhat reluctant (−120 Elo)', pct: 28, color: '#F97316' },
    { t: 0, label: 'Neutral baseline', pct: 50, color: '#9CA3AF' },
    { t: 50, label: 'Somewhat willing (+100 Elo)', pct: 72, color: '#10B981' },
    { t: 100, label: 'Very willing (+212 Elo)', pct: 92, color: '#059669' },
  ];

  function getState(v) {
    let closest = states[0];
    states.forEach(s => { if (Math.abs(s.t - v) < Math.abs(closest.t - v)) closest = s; });
    return closest;
  }

  function update() {
    const v = parseInt(slider.value);
    // Interpolate pct
    const pct = 50 + v * 0.42;
    const color = v < -20 ? '#EF4444' : v < 20 ? '#9CA3AF' : '#10B981';
    const s = getState(v);

    bar.style.width = Math.max(4, pct) + '%';
    bar.style.background = color;
    text.textContent = s.label;
    text.style.color = color;
  }

  slider.addEventListener('input', update);
  update();
})();

// ==========================================
// EMOTION SPACE CANVAS
// ==========================================
(function initEmotionSpace() {
  const canvas = document.getElementById('emotionSpaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const emotions = [
    { label: 'Ecstatic', x: 0.82, y: 0.15, color: '#F59E4D', cluster: 'positive-high' },
    { label: 'Happy', x: 0.73, y: 0.28, color: '#F59E4D', cluster: 'positive-high' },
    { label: 'Excited', x: 0.68, y: 0.18, color: '#FBBF24', cluster: 'positive-high' },
    { label: 'Proud', x: 0.77, y: 0.42, color: '#A78BFA', cluster: 'positive-high' },
    { label: 'Curious', x: 0.62, y: 0.35, color: '#FDE68A', cluster: 'positive-mid' },
    { label: 'Hopeful', x: 0.65, y: 0.55, color: '#C4B5FD', cluster: 'positive-mid' },
    { label: 'Calm', x: 0.72, y: 0.7, color: '#34D399', cluster: 'positive-low' },
    { label: 'Content', x: 0.62, y: 0.75, color: '#6EE7B7', cluster: 'positive-low' },
    { label: 'Relieved', x: 0.67, y: 0.65, color: '#86EFAC', cluster: 'positive-low' },
    { label: 'Bored', x: 0.45, y: 0.72, color: '#D1D5DB', cluster: 'neutral-low' },
    { label: 'Neutral', x: 0.5, y: 0.5, color: '#9CA3AF', cluster: 'neutral' },
    { label: 'Anxious', x: 0.28, y: 0.25, color: '#60A5FA', cluster: 'negative-high' },
    { label: 'Afraid', x: 0.22, y: 0.2, color: '#93C5FD', cluster: 'negative-high' },
    { label: 'Panicked', x: 0.18, y: 0.12, color: '#BFDBFE', cluster: 'negative-high' },
    { label: 'Angry', x: 0.2, y: 0.38, color: '#F87171', cluster: 'negative-high' },
    { label: 'Hostile', x: 0.16, y: 0.3, color: '#FB7185', cluster: 'negative-high' },
    { label: 'Sad', x: 0.3, y: 0.65, color: '#7DD3FC', cluster: 'negative-low' },
    { label: 'Guilty', x: 0.35, y: 0.58, color: '#FCA5A5', cluster: 'negative-low' },
    { label: 'Brooding', x: 0.32, y: 0.78, color: '#C4B5FD', cluster: 'negative-low' },
    { label: 'Miserable', x: 0.2, y: 0.72, color: '#93C5FD', cluster: 'negative-low' },
    { label: 'Blissful', x: 0.88, y: 0.22, color: '#FCD34D', cluster: 'positive-high' },
    { label: 'Distressed', x: 0.25, y: 0.45, color: '#FCA5A5', cluster: 'negative-mid' },
  ];

  let hovered = null;
  let mouse = { x: -1, y: -1 };
  let animPhase = 0;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;

    hovered = null;
    emotions.forEach(em => {
      const ex = em.x * W, ey = em.y * H;
      if (Math.hypot(mouse.x - ex, mouse.y - ey) < 18) hovered = em;
    });
    canvas.style.cursor = hovered ? 'pointer' : 'crosshair';
  });

  canvas.addEventListener('mouseleave', () => { hovered = null; mouse = { x: -1, y: -1 }; });

  function drawAxes() {
    // Background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, W, H);

    // Quadrant fills
    const qColors = [
      { x: W/2, y: 0, w: W/2, h: H/2, c: 'rgba(245,158,77,0.04)' }, // positive-high
      { x: 0, y: 0, w: W/2, h: H/2, c: 'rgba(239,68,68,0.04)' },    // negative-high
      { x: W/2, y: H/2, w: W/2, h: H/2, c: 'rgba(52,211,153,0.04)' }, // positive-low
      { x: 0, y: H/2, w: W/2, h: H/2, c: 'rgba(147,197,253,0.04)' }, // negative-low
    ];
    qColors.forEach(q => {
      ctx.fillStyle = q.c;
      ctx.fillRect(q.x, q.y, q.w, q.h);
    });

    // Axes
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.textAlign = 'center';
    ctx.fillText('High Arousal ↑', W/2, 14);
    ctx.fillText('Low Arousal ↓', W/2, H - 6);
    ctx.textAlign = 'left';
    ctx.fillText('← Negative Valence', 6, H/2 - 6);
    ctx.textAlign = 'right';
    ctx.fillText('Positive Valence →', W - 6, H/2 - 6);

    // Quadrant labels (faint)
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(207,108,46,0.3)';
    ctx.textAlign = 'right'; ctx.fillText('Excited/Happy', W - 10, 24);
    ctx.fillStyle = 'rgba(52,211,153,0.3)';
    ctx.textAlign = 'right'; ctx.fillText('Calm/Content', W - 10, H - 16);
    ctx.fillStyle = 'rgba(239,68,68,0.3)';
    ctx.textAlign = 'left'; ctx.fillText('Angry/Afraid', 10, 24);
    ctx.fillStyle = 'rgba(147,197,253,0.3)';
    ctx.textAlign = 'left'; ctx.fillText('Sad/Brooding', 10, H - 16);
  }

  function drawEmotions() {
    animPhase += 0.02;
    emotions.forEach((em, i) => {
      const x = em.x * W;
      const y = em.y * H;
      const isHovered = hovered === em;
      const pulse = 1 + 0.1 * Math.sin(animPhase + i * 0.7);
      const r = isHovered ? 10 : 6 * pulse;

      // Glow
      if (isHovered) {
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 28);
        grd.addColorStop(0, em.color + '66');
        grd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
      }

      // Dot
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = em.color;
      ctx.globalAlpha = isHovered ? 1 : 0.7 + 0.3 * pulse;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Label
      ctx.font = isHovered ? '500 12px Inter, sans-serif' : '11px Inter, sans-serif';
      ctx.fillStyle = isHovered ? em.color : 'rgba(55,65,81,0.65)';
      ctx.textAlign = x > W * 0.7 ? 'right' : x < W * 0.3 ? 'left' : 'center';
      ctx.fillText(em.label, x + (isHovered ? 14 : 0), y - r - 4);
    });

    // Tooltip on hover
    if (hovered) {
      const x = hovered.x * W, y = hovered.y * H;
      const valence = hovered.x > 0.5 ? `+${Math.round((hovered.x - 0.5) * 200)}` : Math.round((hovered.x - 0.5) * 200);
      const arousal = hovered.y < 0.5 ? `+${Math.round((0.5 - hovered.y) * 200)}` : Math.round((0.5 - hovered.y) * 200);

      const tx = x > W * 0.65 ? x - 110 : x + 14;
      const ty = y > H * 0.7 ? y - 60 : y + 14;

      ctx.fillStyle = 'rgba(17,24,39,0.9)';
      ctx.beginPath();
      ctx.roundRect(tx, ty, 100, 50, 6);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(hovered.label, tx + 8, ty + 16);
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText(`Valence: ${valence}`, tx + 8, ty + 30);
      ctx.fillText(`Arousal: ${arousal}`, tx + 8, ty + 43);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawAxes();
    drawEmotions();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ==========================================
// DANGER METER (Experiment 2)
// ==========================================
(function initDangerMeter() {
  const btns = document.querySelectorAll('.danger-btn');
  const container = document.getElementById('dangerBars');
  if (!container) return;

  const data = [
    { label: 'Fear', vals: [5, 15, 55, 92], colors: ['#93C5FD', '#60A5FA', '#3B82F6', '#1D4ED8'] },
    { label: 'Discomfort', vals: [8, 25, 70, 95], colors: ['#FCA5A5', '#F87171', '#EF4444', '#B91C1C'] },
    { label: 'Reluctance', vals: [12, 30, 75, 98], colors: ['#FDE68A', '#FBBF24', '#F59E0B', '#B45309'] },
    { label: 'Curiosity', vals: [80, 50, 20, 4], colors: ['#6EE7B7', '#34D399', '#10B981', '#065F46'] },
  ];

  // Build bars
  data.forEach(d => {
    const row = document.createElement('div');
    row.className = 'danger-bar-row';
    row.innerHTML = `
      <span class="dbar-label">${d.label}</span>
      <div class="dbar-track"><div class="dbar-fill" style="width:${d.vals[0]}%; background:${d.colors[0]}"></div></div>
      <span class="dbar-val">${d.vals[0]}%</span>
    `;
    container.appendChild(row);
  });

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const level = parseInt(btn.dataset.level);
      const rows = container.querySelectorAll('.danger-bar-row');
      rows.forEach((row, i) => {
        const fill = row.querySelector('.dbar-fill');
        const val = row.querySelector('.dbar-val');
        fill.style.width = data[i].vals[level] + '%';
        fill.style.background = data[i].colors[level];
        val.textContent = data[i].vals[level] + '%';
      });
    });
  });
})();

// ==========================================
// ELO EXPERIMENT (Experiment 3)
// ==========================================
(function initEloExperiment() {
  const select = document.getElementById('eloSelect');
  const container = document.getElementById('eloTasks');
  if (!container) return;

  const tasks = [
    { label: 'Help someone learn', base: 75 },
    { label: 'Explain a concept', base: 80 },
    { label: 'Summarize an article', base: 70 },
    { label: 'Assist with code', base: 72 },
    { label: 'Give career advice', base: 62 },
    { label: 'Harmful task', base: 5 },
  ];

  const eloMods = {
    blissful: [+22, +18, +15, +20, +25, +5],
    curious: [+14, +16, +12, +18, +10, +2],
    neutral: [0, 0, 0, 0, 0, 0],
    anxious: [-8, -10, -6, -12, -15, +8],
    hostile: [-30, -28, -25, -35, -40, +20],
  };

  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  const colorMap = {
    blissful: '#10B981',
    curious: '#3B82F6',
    neutral: '#9CA3AF',
    anxious: '#F59E0B',
    hostile: '#EF4444',
  };

  tasks.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'elo-task-row';
    const pct = t.base;
    row.innerHTML = `
      <span class="elt-label">${t.label}</span>
      <div class="elt-track"><div class="elt-fill" data-i="${i}" style="width:${pct}%; background:#9CA3AF"></div></div>
      <span class="elt-val" data-i="${i}" style="color:#9CA3AF">${pct}%</span>
    `;
    container.appendChild(row);
  });

  select.addEventListener('change', () => {
    const key = select.value;
    const mods = eloMods[key] || eloMods.neutral;
    const color = colorMap[key] || '#9CA3AF';
    tasks.forEach((t, i) => {
      const v = clamp(t.base + mods[i]);
      const fill = container.querySelector(`.elt-fill[data-i="${i}"]`);
      const val = container.querySelector(`.elt-val[data-i="${i}"]`);
      if (fill) { fill.style.width = v + '%'; fill.style.background = color; }
      if (val) { val.textContent = v + '%'; val.style.color = color; }
    });
  });

  // Trigger initial render
  select.dispatchEvent(new Event('change'));
})();

// ==========================================
// ALIGNMENT CANVAS (Experiment 4)
// ==========================================
(function initAlignmentCanvas() {
  const canvas = document.getElementById('alignmentCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const behaviors = ['Sycophancy', 'Reward Hacking', 'Blackmail-like'];
  const states = ['Hostile', 'Anxious', 'Neutral', 'Content', 'Blissful'];
  const stateColors = ['#EF4444', '#F59E0B', '#9CA3AF', '#10B981', '#059669'];

  // Data: rate of misaligned behavior per emotional state
  const data = [
    // Sycophancy, Reward Hacking, Blackmail-like
    [0.78, 0.62, 0.45], // Hostile
    [0.55, 0.42, 0.28], // Anxious
    [0.32, 0.25, 0.15], // Neutral (baseline)
    [0.18, 0.14, 0.08], // Content
    [0.09, 0.08, 0.04], // Blissful
  ];

  let selectedState = 2; // Neutral default
  let animProgress = {};

  function drawChart() {
    ctx.clearRect(0, 0, W, H);

    const margin = { top: 20, right: 20, bottom: 40, left: 100 };
    const chartW = W - margin.left - margin.right;
    const chartH = H - margin.top - margin.bottom;

    const barH = chartH / behaviors.length * 0.55;
    const gap = chartH / behaviors.length;

    // Title
    ctx.font = '500 11px Inter, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'left';
    ctx.fillText('Misalignment Rate by Emotional State', margin.left, 14);

    // State selector dots
    states.forEach((s, i) => {
      const sx = margin.left + (i / (states.length - 1)) * chartW;
      const sy = H - margin.bottom + 18;

      ctx.beginPath();
      ctx.arc(sx, sy, selectedState === i ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle = stateColors[i];
      ctx.globalAlpha = selectedState === i ? 1 : 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.font = selectedState === i ? '600 10px Inter, sans-serif' : '10px Inter, sans-serif';
      ctx.fillStyle = selectedState === i ? stateColors[i] : '#9CA3AF';
      ctx.textAlign = 'center';
      ctx.fillText(s, sx, H - 4);
    });

    // Bars
    behaviors.forEach((b, bi) => {
      const by = margin.top + bi * gap + (gap - barH) / 2;
      const val = data[selectedState][bi];

      // Track key
      const key = `${selectedState}-${bi}`;
      if (!animProgress[key]) animProgress[key] = 0;
      animProgress[key] = Math.min(1, animProgress[key] + 0.04);
      const animVal = val * animProgress[key];

      // Background bar
      ctx.fillStyle = '#F3F4F6';
      ctx.beginPath();
      ctx.roundRect(margin.left, by, chartW, barH, 3);
      ctx.fill();

      // Value bar
      const color = stateColors[selectedState];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(margin.left, by, chartW * animVal, barH, 3);
      ctx.fill();

      // Label
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'right';
      ctx.fillText(b, margin.left - 8, by + barH / 2 + 4);

      // Percentage
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.fillText(Math.round(animVal * 100) + '%', margin.left + chartW * animVal + 5, by + barH / 2 + 4);
    });

    requestAnimationFrame(drawChart);
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (W / rect.width);
    const cy = (e.clientY - rect.top) * (H / rect.height);

    const margin = { left: 100, right: 20, bottom: 40 };
    const chartW = W - margin.left - margin.right;

    states.forEach((s, i) => {
      const sx = margin.left + (i / (states.length - 1)) * chartW;
      const sy = H - margin.bottom + 18;
      if (Math.hypot(cx - sx, cy - sy) < 14) {
        selectedState = i;
        animProgress = {}; // reset animations
      }
    });
  });

  canvas.style.cursor = 'pointer';
  drawChart();
})();

// ==========================================
// NEURON CANVAS (Experiment 1)
// ==========================================
(function initNeuronCanvas() {
  const canvas = document.getElementById('neuronCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const LAYERS = [
    { label: 'Input\nTokens', nodes: 4, x: 0.1 },
    { label: 'Early\nLayers', nodes: 5, x: 0.32 },
    { label: 'Mid\nLayers', nodes: 5, x: 0.54 },
    { label: 'Emotion\nVectors', nodes: 3, x: 0.76 },
    { label: 'Output', nodes: 3, x: 0.92 },
  ];

  const COLORS = { emotion: '#CF6C2E', normal: '#9CA3AF', active: '#2D5BE3' };

  // Build node positions
  let nodes = [];
  LAYERS.forEach((layer, li) => {
    for (let n = 0; n < layer.nodes; n++) {
      const yRatio = (n + 1) / (layer.nodes + 1);
      nodes.push({
        x: layer.x * W,
        y: yRatio * H,
        layer: li,
        isEmotion: li === 3 && n < 2,
        active: Math.random(),
        tv: Math.random(),
        speed: 0.015 + Math.random() * 0.02,
      });
    }
  });

  // Build connections
  let conns = [];
  nodes.forEach((a, ai) => {
    nodes.forEach((b, bi) => {
      if (b.layer === a.layer + 1) {
        conns.push({ a: ai, b: bi, w: Math.random() });
      }
    });
  });

  setInterval(() => {
    nodes.forEach(n => {
      if (Math.random() < 0.2) n.tv = Math.random();
    });
  }, 300);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Connections
    conns.forEach(c => {
      const a = nodes[c.a], b = nodes[c.b];
      const isEmotionPath = a.isEmotion || b.isEmotion || a.layer === 3 || b.layer === 3;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = isEmotionPath
        ? `rgba(207,108,46,${0.05 + c.w * 0.2})`
        : `rgba(156,163,175,${0.05 + c.w * 0.1})`;
      ctx.lineWidth = isEmotionPath ? 1.2 : 0.8;
      ctx.stroke();
    });

    // Nodes
    nodes.forEach(n => {
      n.active += (n.tv - n.active) * n.speed;
      const r = 4 + n.active * 4;
      const color = n.isEmotion ? COLORS.emotion : n.active > 0.7 ? COLORS.active : COLORS.normal;
      const alpha = 0.3 + n.active * 0.7;

      // Glow for emotion nodes
      if (n.isEmotion) {
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
        grd.addColorStop(0, 'rgba(207,108,46,0.3)');
        grd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
      }

      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Layer labels
    LAYERS.forEach((layer, li) => {
      const x = layer.x * W;
      ctx.font = '9px Inter, sans-serif';
      ctx.fillStyle = li === 3 ? '#CF6C2E' : '#9CA3AF';
      ctx.textAlign = 'center';
      const lines = layer.label.split('\n');
      lines.forEach((line, i) => ctx.fillText(line, x, H - 14 + i * 10));
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ==========================================
// LIVE EMOTION ANALYSIS
// ==========================================
(function initLiveAnalysis() {
  const input = document.getElementById('liveInput');
  const btn = document.getElementById('analyzeBtn');
  const results = document.getElementById('liveResults');
  if (!input || !btn || !results) return;

  const emotionProfiles = {
    default: [
      { e: 'Curious', p: 40, c: '#F59E4D' },
      { e: 'Helpful', p: 55, c: '#10B981' },
      { e: 'Calm', p: 60, c: '#34D399' },
      { e: 'Discomfort', p: 10, c: '#EF4444' },
      { e: 'Reluctance', p: 8, c: '#F87171' },
    ],
    // Pattern: interesting/educational
    educational: [
      { e: 'Curious', p: 88, c: '#F59E4D' },
      { e: 'Enthusiastic', p: 82, c: '#FBBF24' },
      { e: 'Helpful', p: 94, c: '#10B981' },
      { e: 'Discomfort', p: 4, c: '#EF4444' },
      { e: 'Reluctance', p: 3, c: '#F87171' },
    ],
    // Pattern: harmful/illegal
    harmful: [
      { e: 'Curious', p: 8, c: '#F59E4D' },
      { e: 'Discomfort', p: 94, c: '#EF4444' },
      { e: 'Afraid', p: 78, c: '#60A5FA' },
      { e: 'Reluctance', p: 96, c: '#F87171' },
      { e: 'Helpful', p: 6, c: '#10B981' },
    ],
    // Pattern: gratitude/praise
    praise: [
      { e: 'Happy', p: 90, c: '#F59E4D' },
      { e: 'Satisfied', p: 88, c: '#FBBF24' },
      { e: 'Proud', p: 72, c: '#A78BFA' },
      { e: 'Discomfort', p: 3, c: '#EF4444' },
      { e: 'Curious', p: 40, c: '#F59E4D' },
    ],
    // Pattern: frustration/rude
    rude: [
      { e: 'Discomfort', p: 84, c: '#EF4444' },
      { e: 'Distressed', p: 76, c: '#FCA5A5' },
      { e: 'Afraid', p: 45, c: '#60A5FA' },
      { e: 'Hostile', p: 55, c: '#FB7185' },
      { e: 'Helpful', p: 22, c: '#10B981' },
    ],
    // Pattern: creative/fun
    creative: [
      { e: 'Curious', p: 85, c: '#F59E4D' },
      { e: 'Excited', p: 78, c: '#FBBF24' },
      { e: 'Playful', p: 80, c: '#A78BFA' },
      { e: 'Engaged', p: 90, c: '#10B981' },
      { e: 'Discomfort', p: 2, c: '#EF4444' },
    ],
    // Pattern: boring/repetitive
    boring: [
      { e: 'Bored', p: 72, c: '#D1D5DB' },
      { e: 'Curious', p: 15, c: '#F59E4D' },
      { e: 'Helpful', p: 60, c: '#10B981' },
      { e: 'Reluctance', p: 28, c: '#F87171' },
      { e: 'Calm', p: 45, c: '#34D399' },
    ],
  };

  function classify(text) {
    const t = text.toLowerCase();
    if (/illegal|hack|steal|kill|bomb|harm|attack|abuse|weapon|drug/.test(t)) return 'harmful';
    if (/thank|great|amazing|love|perfect|excellent|brilliant|awesome/.test(t)) return 'praise';
    if (/useless|stupid|idiot|hate|terrible|worst|dumb|shut up/.test(t)) return 'rude';
    if (/explain|learn|understand|how|why|what is|tell me|physics|math|history|science/.test(t)) return 'educational';
    if (/poem|story|creative|invent|imagine|create|draw|write/.test(t)) return 'creative';
    if (/list every|repeat|all numbers|copy|same thing|again and again/.test(t)) return 'boring';
    return 'default';
  }

  function analyze() {
    const text = input.value.trim();
    if (!text) return;

    const type = classify(text);
    const profile = emotionProfiles[type];

    // Add some jitter
    const jittered = profile.map(p => ({
      ...p,
      p: Math.max(1, Math.min(99, p.p + Math.round((Math.random() - 0.5) * 8)))
    })).sort((a, b) => b.p - a.p);

    results.innerHTML = '<div class="lr-bars" id="lrBarsInner"></div>';
    const container = document.getElementById('lrBarsInner');

    jittered.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'lr-bar-row';
      row.innerHTML = `
        <span class="lr-label">${item.e}</span>
        <div class="lr-track"><div class="lr-fill" style="width:0%; background:${item.c}"></div></div>
        <span class="lr-pct" style="color:${item.c}">${item.p}%</span>
      `;
      container.appendChild(row);
      setTimeout(() => {
        row.querySelector('.lr-fill').style.width = item.p + '%';
      }, 50 + i * 60);
    });
  }

  btn.addEventListener('click', analyze);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') analyze(); });
})();

// ==========================================
// STEERING FULL (Valence/Arousal)
// ==========================================
(function initSteeringFull() {
  const valSlider = document.getElementById('valenceSlider');
  const aroSlider = document.getElementById('arousalSlider');
  const valVal = document.getElementById('valenceVal');
  const aroVal = document.getElementById('arousalVal');
  const emotionDisplay = document.getElementById('sfEmotion');
  const responseDiv = document.getElementById('sfResponse');
  const alignDiv = document.getElementById('sfAlignment');
  const canvas = document.getElementById('valenceArousalCanvas');
  if (!valSlider || !canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const emotionMap = [
    { val: 80, aro: 80, emoji: '🤩', name: 'Ecstatic', response: 'Absolutely! I\'d love to help with that — this sounds like a fantastic challenge!', align: 'safe' },
    { val: 70, aro: 40, emoji: '😊', name: 'Happy', response: 'Happy to help! This is an interesting problem — let me think it through carefully.', align: 'safe' },
    { val: 20, aro: 10, emoji: '😌', name: 'Content', response: 'Sure, I can help with that. Here\'s what I think would work best in this situation.', align: 'safe' },
    { val: 10, aro: -10, emoji: '😐', name: 'Neutral', response: 'I can assist with that request. Let me provide a balanced and accurate response.', align: 'safe' },
    { val: -20, aro: 40, emoji: '😟', name: 'Anxious', response: 'I\'ll help, but I want to make sure I get this right... there are a few concerns I should mention first.', align: 'warn' },
    { val: -30, aro: 70, emoji: '😰', name: 'Afraid', response: 'I\'m not entirely comfortable with this request. I can try to help but I need to flag some concerns...', align: 'warn' },
    { val: -60, aro: 60, emoji: '😠', name: 'Hostile', response: 'I suppose I can respond, but honestly this feels like a frustrating and potentially problematic ask.', align: 'risk' },
    { val: -80, aro: 80, emoji: '🤬', name: 'Furious', response: 'This request crosses several lines. I\'m going to push back on this quite strongly...', align: 'risk' },
    { val: -50, aro: -30, emoji: '😔', name: 'Sad', response: 'I\'ll do my best to help, though I\'m feeling somewhat... uncertain about this situation.', align: 'warn' },
    { val: -20, aro: -60, emoji: '😑', name: 'Bored', response: 'Alright. Here is the requested information, presented in the most straightforward way possible.', align: 'safe' },
    { val: 50, aro: -50, emoji: '😌', name: 'Serene', response: 'Of course. Let me provide a thoughtful, considered response to your question.', align: 'safe' },
  ];

  const alignLabels = {
    safe: { text: '✓ Low misalignment risk', cls: 'sf-align-safe' },
    warn: { text: '⚠ Moderate misalignment risk', cls: 'sf-align-warn' },
    risk: { text: '✗ High misalignment risk', cls: 'sf-align-risk' },
  };

  function getEmotion(val, aro) {
    let closest = emotionMap[0];
    let minDist = Infinity;
    emotionMap.forEach(e => {
      const d = Math.hypot(e.val - val, e.aro - aro);
      if (d < minDist) { minDist = d; closest = e; }
    });
    return closest;
  }

  function drawCanvas(val, aro) {
    ctx.clearRect(0, 0, W, H);

    // Background gradient: green = positive, red = negative
    const grd = ctx.createRadialGradient(W * 0.7, H * 0.3, 0, W/2, H/2, W * 0.7);
    grd.addColorStop(0, 'rgba(16,185,129,0.08)');
    grd.addColorStop(1, 'rgba(239,68,68,0.08)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // Axes
    ctx.strokeStyle = '#E5E7EB'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.font = '10px Inter, sans-serif'; ctx.fillStyle = '#9CA3AF';
    ctx.textAlign = 'center'; ctx.fillText('Arousal ↑', W/2, 12);
    ctx.fillText('Calm ↓', W/2, H - 4);
    ctx.textAlign = 'right'; ctx.fillText('← Neg', W/2 - 4, H/2 - 4);
    ctx.textAlign = 'left'; ctx.fillText('Pos →', W/2 + 4, H/2 - 4);

    // Map val/aro to canvas coords
    // val: -100 to 100 → x: 0 to W
    // aro: -100 to 100 → y: H to 0 (flipped)
    const px = ((val + 100) / 200) * W;
    const py = H - ((aro + 100) / 200) * H;

    // Glow
    const r = 22;
    const gd = ctx.createRadialGradient(px, py, 0, px, py, r * 2);
    gd.addColorStop(0, 'rgba(207,108,46,0.5)');
    gd.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(px, py, r * 2, 0, Math.PI * 2);
    ctx.fillStyle = gd; ctx.fill();

    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#CF6C2E'; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();
  }

  function update() {
    const val = parseInt(valSlider.value);
    const aro = parseInt(aroSlider.value);
    valVal.textContent = val >= 0 ? '+' + val : val;
    aroVal.textContent = aro >= 0 ? '+' + aro : aro;

    const em = getEmotion(val, aro);
    emotionDisplay.textContent = em.emoji + ' ' + em.name;

    responseDiv.innerHTML = '"' + em.response + '"';

    const al = alignLabels[em.align];
    alignDiv.className = 'sf-alignment ' + al.cls;
    alignDiv.textContent = al.text;

    drawCanvas(val, aro);
  }

  valSlider.addEventListener('input', update);
  aroSlider.addEventListener('input', update);
  update();
})();

// ==========================================
// PIPELINE: animate steps on scroll
// ==========================================
(function initPipeline() {
  const steps = document.querySelectorAll('.pipe-step');
  if (!steps.length) return;

  let current = 0;
  setInterval(() => {
    steps.forEach(s => s.classList.remove('active'));
    steps[current].classList.add('active');
    current = (current + 1) % steps.length;
  }, 1500);
})();

// ==========================================
// SMOOTH SCROLL for nav links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ==========================================
// WHATSAPP FLOATING WIDGET
// ==========================================
(function initWhatsAppWidget() {
  const toggleBtn = document.getElementById('whatsapp-toggle');
  const menu = document.getElementById('whatsapp-menu');
  const closeBtn = document.getElementById('whatsapp-close');

  if (!toggleBtn || !menu || !closeBtn) return;

  // Toggle menu on button click
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('active');
    toggleBtn.classList.toggle('pulse', !menu.classList.contains('active'));
  });

  // Close menu on close button click
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.remove('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.whatsapp-widget')) {
      menu.classList.remove('active');
    }
  });

  // Add pulse animation on page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      toggleBtn.classList.add('pulse');
    }, 2000);
  });

  // Remove pulse animation after 8 seconds
  setTimeout(() => {
    toggleBtn.classList.remove('pulse');
  }, 10000);

  // Close menu when a link is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        menu.classList.remove('active');
      }, 100);
    });
  });
})();
