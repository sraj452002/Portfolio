(() => {
'use strict';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const sleep = ms => new Promise(res => setTimeout(res, ms));
const rand = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.round(rand(a, b));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safe = (name, fn) => { try { fn(); } catch (e) { console.warn('[' + name + ']', e); } };
const C = { ink: '#141414', pink: '#FF3D8B', sky: '#3DB2FF', pop: '#FFD23F', mint: '#2EE6A6' };

/* ---------- durations ---------- */
safe('dates', () => {
  const now = new Date();
  const fmt = m => { const y = Math.floor(m / 12), r = m % 12; return [y ? y + ' yr' : '', r ? r + ' mo' : ''].filter(Boolean).join(' ') || '1 mo'; };
  $$('[data-since]').forEach(el => {
    const [y, m] = el.dataset.since.split('-').map(Number);
    el.textContent = fmt(Math.max(1, (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)));
  });
});

/* ---------- ticker loop ---------- */
safe('ticker', () => { const t = $('#ticker'); t.innerHTML += t.innerHTML; });

/* ---------- title letters ---------- */
let letters = [];
safe('title', () => {
  const rots = [-4, 3, -2, 4, -3, 2, -4, 3, -2, 4];
  let k = 0;
  $$('#title .w').forEach(w => {
    const txt = w.textContent; w.textContent = '';
    [...txt].forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--r', rots[k++ % rots.length] + 'deg'); s.textContent = ch; w.appendChild(s); });
  });
  letters = $$('#title .ch');
});
function titleBounce() {
  if (RM) return;
  letters.forEach((s, i) => setTimeout(() => { s.classList.remove('bounce'); void s.offsetWidth; s.classList.add('bounce'); }, 160 + i * 55));
}

/* ---------- aura starburst ---------- */
safe('aura', () => {
  const pts = [], n = 18, cx = 160, cy = 238;
  for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2 - Math.PI / 2; const r = i % 2 ? 128 : 200; pts.push((cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r * 1.05).toFixed(1)); }
  $('#aura').setAttribute('d', 'M' + pts.join(' L') + ' Z');
});

/* ---------- character talk ---------- */
const charEl = $('#char'), lineEl = $('#charLine');
function charPower() { charEl.classList.remove('power', 'hop'); void charEl.offsetWidth; charEl.classList.add('power'); setTimeout(() => charEl.classList.remove('power'), 1300); }
safe('char', () => {
  const LINES = [
    "Yo! I'm Shubham. Want to see what I build?",
    'Hit PRESS START for a power-up!',
    'Psst… press ` for cheat codes.',
    'Now airing: Software Engineer at NIIT.',
    'My workflow engine runs graphs of nodes. Try it in Episode 4!',
    'Network down? My POS keeps billing anyway.',
    'Stack of choice: MERN with TypeScript.'
  ];
  let i = 0;
  const talk = () => {
    i = (i + 1) % LINES.length;
    lineEl.textContent = LINES[i];
    lineEl.classList.remove('pop'); void lineEl.offsetWidth; lineEl.classList.add('pop');
    charEl.classList.remove('hop'); void charEl.offsetWidth; charEl.classList.add('hop');
  };
  charEl.addEventListener('click', talk);
  charEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); talk(); } });
});

/* ---------- cel-shaded 3D ---------- */
let GL = null;
safe('gl', () => {
  if (!window.THREE) return;
  const host = $('#heroPanel'), canvas = $('#gl');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 11);
  const world = new THREE.Group(); scene.add(world);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 0.9); sun.position.set(4, 6, 6); scene.add(sun);
  const grad = new THREE.DataTexture(new Uint8Array([70, 160, 255]), 3, 1, THREE.LuminanceFormat);
  grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;
  const outline = new THREE.MeshBasicMaterial({ color: 0x141414, side: THREE.BackSide });
  const toon = (geo, color) => {
    const g = new THREE.Group();
    const o = new THREE.Mesh(geo, outline); o.scale.setScalar(1.09);
    g.add(o); g.add(new THREE.Mesh(geo, new THREE.MeshToonMaterial({ color, gradientMap: grad })));
    return g;
  };
  const geos = [
    new THREE.IcosahedronGeometry(0.55, 0), new THREE.OctahedronGeometry(0.58, 0), new THREE.DodecahedronGeometry(0.5, 0),
    new THREE.BoxGeometry(0.72, 0.72, 0.72), new THREE.TorusGeometry(0.42, 0.17, 12, 28), new THREE.ConeGeometry(0.45, 0.85, 6), new THREE.TetrahedronGeometry(0.62, 0)
  ];
  const COLS = [0xFF3D8B, 0x3DB2FF, 0xFFD23F, 0x2EE6A6, 0xFFFFFF];
  const SPOTS = [[-6.3, 2.5, -1], [-4.9, -2.7, 0], [-1.4, 3.0, -2.6], [0.6, -3.0, -1.2], [3.0, 3.0, -2.2], [6.6, 1.5, -1.3], [6.2, -2.5, 0.2], [-2.9, 0.6, -4], [2.2, -0.2, -4.2], [-7.2, -0.4, -2.5]];
  const objs = SPOTS.map((p, i) => {
    const g = toon(geos[i % geos.length], COLS[i % COLS.length]);
    g.userData = { base: new THREE.Vector3(p[0], p[1], p[2]), sp: rand(0.35, 0.8) * (i % 2 ? 1 : -1), ph: rand(0, 6.28), spin: 0, kick: 0 };
    g.rotation.set(rand(0, 3), rand(0, 3), 0);
    world.add(g); return g;
  });
  const glyphTex = (txt, col) => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128;
    const draw = () => {
      const x = c.getContext('2d'); x.clearRect(0, 0, 256, 128);
      x.font = '76px "Dela Gothic One", Impact, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.lineJoin = 'round'; x.lineWidth = 14; x.strokeStyle = C.ink; x.strokeText(txt, 128, 66);
      x.fillStyle = col; x.fillText(txt, 128, 66);
    };
    draw();
    const t = new THREE.CanvasTexture(c);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { draw(); t.needsUpdate = true; });
    return t;
  };
  const GLY = [['</>', C.pink, -5.2, 0.6, -0.8], ['{ }', C.sky, 4.4, -0.9, -0.6], ['=>', C.pop, -0.4, -1.8, -2.4], ['#', C.mint, 1.4, 2.2, -1.6]];
  const sprites = GLY.map(([t, c, x, y, z]) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glyphTex(t, c), transparent: true, depthWrite: false }));
    s.scale.set(1.7, 0.85, 1); s.userData = { base: new THREE.Vector3(x, y, z), ph: rand(0, 6.28) };
    world.add(s); return s;
  });
  let W = 1, H = 1, spread = 1, ySpread = 1, objScale = 1;
  const layout = () => {
    const r = host.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    const halfW = Math.tan(20 * Math.PI / 180) * 11 * camera.aspect;
    spread = Math.min(1, halfW / 7.4);
    const tall = camera.aspect < 1;
    ySpread = tall ? Math.min(2.4, 1 / camera.aspect) * 1.15 : 1;
    objScale = tall ? 0.5 : 1;
    sprites.forEach(s => { s.visible = !tall; });
  };
  layout();
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(host); else addEventListener('resize', layout);
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', e => { mouse.tx = (e.clientX / innerWidth - 0.5) * 2; mouse.ty = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
  let visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(host);
  let last = performance.now(), t = 0;
  const frame = now => {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!visible || document.hidden) return;
    t += dt;
    mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
    world.rotation.y = mouse.x * 0.12; world.rotation.x = mouse.y * 0.08;
    objs.forEach(o => {
      const u = o.userData;
      u.spin = Math.max(0, u.spin - dt * 6); u.kick = Math.max(0, u.kick - dt * 1.8);
      const sp = (RM ? 0 : u.sp) + u.spin * Math.sign(u.sp || 1);
      o.rotation.x += dt * sp; o.rotation.y += dt * sp * 0.8;
      o.position.set(u.base.x * spread, u.base.y * ySpread + (RM ? 0 : Math.sin(t * 0.9 + u.ph) * 0.22) + Math.sin(u.kick * Math.PI) * 0.6, u.base.z);
      o.scale.setScalar(objScale * (1 + Math.sin(u.kick * Math.PI) * 0.3));
    });
    sprites.forEach(s => { const u = s.userData; s.position.set(u.base.x * spread, u.base.y + (RM ? 0 : Math.sin(t * 0.7 + u.ph) * 0.18), u.base.z); });
    renderer.render(scene, camera);
  };
  requestAnimationFrame(frame);
  GL = { burst() { objs.forEach(o => { o.userData.spin = 9; o.userData.kick = 1; }); } };
});

/* ---------- manga focus lines ---------- */
function speedLines() {
  if (RM) return;
  const c = $('#speed'), host = $('#heroPanel'); if (!c) return;
  const ctx = c.getContext('2d');
  const r = host.getBoundingClientRect(), cr = charEl.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
  const cx = cr.left + cr.width / 2 - r.left, cy = cr.top + cr.height * 0.45 - r.top;
  const R = Math.hypot(r.width, r.height);
  const base = Math.max(cr.width, cr.height) * 0.55;
  const L = Array.from({ length: 190 }, () => ({ a: Math.random() * Math.PI * 2, w: rand(0.003, 0.014), inner: base * rand(1, 2.2) }));
  const t0 = performance.now(), dur = 760;
  (function draw(now) {
    const p = (now - t0) / dur;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, r.width, r.height);
    if (p >= 1) return;
    ctx.globalAlpha = 0.85 * (p < 0.1 ? p / 0.1 : 1 - (p - 0.1) / 0.9);
    ctx.fillStyle = C.ink;
    L.forEach(l => {
      const ri2 = l.inner * (1 - 0.2 * p);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(l.a - l.w) * R, cy + Math.sin(l.a - l.w) * R);
      ctx.lineTo(cx + Math.cos(l.a) * ri2, cy + Math.sin(l.a) * ri2);
      ctx.lineTo(cx + Math.cos(l.a + l.w) * R, cy + Math.sin(l.a + l.w) * R);
      ctx.closePath(); ctx.fill();
    });
    requestAnimationFrame(draw);
  })(t0);
}

/* ---------- impact! ---------- */
function impact(word) {
  word = word || pick(['ドーン!!', 'バーン!!', 'ドドン!!']);
  if (!RM) {
    const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    const m = $('#main'); m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake');
  }
  const el = document.createElement('div'); el.className = 'sfx-pop'; el.textContent = word; el.lang = 'ja';
  $('#sfxLayer').appendChild(el); setTimeout(() => el.remove(), 1300);
  speedLines(); charPower(); titleBounce();
  if (GL) GL.burst();
}
safe('start', () => {
  const lines = ['POWER UP! Scroll down for Episode 1.', "Full power! Now let's ship something.", 'That was a 200 OK.'];
  let n = 0;
  $('#startBtn').addEventListener('click', () => {
    impact();
    setTimeout(() => { lineEl.textContent = lines[n++ % lines.length]; lineEl.classList.remove('pop'); void lineEl.offsetWidth; lineEl.classList.add('pop'); }, 250);
  });
});

/* ---------- petals + sparkles ---------- */
safe('fx', () => {
  if (RM) return;
  const c = $('#fx'), ctx = c.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); };
  size(); addEventListener('resize', size);
  const COL = ['#FFC4D8', '#FFA9C6', '#FFD6E4'];
  const mk = y => ({ x: Math.random() * W, y: y == null ? -20 : y, s: rand(5, 10), vy: rand(22, 46), ph: rand(0, 6.28), rot: rand(0, 6.28), vr: rand(-1.5, 1.5), c: pick(COL) });
  const N = Math.round(Math.min(18, Math.max(8, innerWidth / 90)));
  const petals = Array.from({ length: N }, () => mk(rand(0, H)));
  const sparks = [];
  if (FINE) {
    let lt = 0;
    addEventListener('pointermove', e => {
      const now = performance.now(); if (now - lt < 45) return; lt = now;
      sparks.push({ x: e.clientX, y: e.clientY, life: 1, s: rand(5, 9), c: pick([C.pink, C.sky, C.pop]), vx: rand(-25, 25), vy: rand(-35, 10) });
      if (sparks.length > 40) sparks.shift();
    }, { passive: true });
  }
  const star = (x, y, r, col) => {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * 0.38 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = C.ink; ctx.stroke();
  };
  let last = performance.now();
  const frame = now => {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (document.hidden) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    petals.forEach(p => {
      p.y += p.vy * dt; p.ph += dt * 1.4; p.x += Math.sin(p.ph) * 18 * dt + 8 * dt; p.rot += p.vr * dt;
      if (p.y > H + 20 || p.x > W + 20) Object.assign(p, mk(-20));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, 0.55 + 0.45 * Math.sin(p.ph * 1.3));
      ctx.fillStyle = p.c; ctx.beginPath(); ctx.moveTo(0, -p.s);
      ctx.quadraticCurveTo(p.s * 0.95, -p.s * 0.1, 0, p.s); ctx.quadraticCurveTo(-p.s * 0.95, -p.s * 0.1, 0, -p.s); ctx.fill();
      ctx.restore();
    });
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.life -= dt * 1.8;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      s.x += s.vx * dt; s.y += s.vy * dt;
      ctx.globalAlpha = s.life; star(s.x, s.y, s.s * (0.4 + 0.6 * s.life), s.c); ctx.globalAlpha = 1;
    }
  };
  requestAnimationFrame(frame);
});

/* ---------- episode titles slam in ---------- */
safe('slam', () => {
  if (RM || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); e.target.classList.add('slam'); } }), { threshold: 0.6 });
  $$('.ep-title, .arc-name, .burst').forEach(h => io.observe(h));
});

/* ---------- nav + EXP bar ---------- */
safe('nav', () => {
  const chips = $$('.nav a'), fill = $('#expFill');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) chips.forEach(c => c.classList.toggle('on', c.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-35% 0px -60% 0px' });
    ['top', 'profile', 'moves', 'story', 'missions', 'next'].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
  }
  const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; fill.style.width = Math.max(0, Math.min(1, scrollY / (h || 1))) * 100 + '%'; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
});

/* ---------- flip cards ---------- */
safe('cards', () => {
  $$('#cards .card').forEach(card => {
    const flip = () => card.classList.toggle('flipped');
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
    if (FINE && !RM) {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', (x * 16).toFixed(1) + 'deg'); card.style.setProperty('--rx', (-y * 14).toFixed(1) + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg'); });
    }
  });
});

/* ---------- tabs ---------- */
safe('tabs', () => {
  const tabs = $$('[role="tab"]');
  const select = t => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    const m = $('#msgs'); if (m) m.scrollTop = m.scrollHeight;
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); select(n);
    });
  });
});

/* ---------- mission A: DAG engine ---------- */
safe('dag', () => {
  const svg = $('#dag'), NS = 'http://www.w3.org/2000/svg';
  const W = 104, H = 50;
  const NODES = [
    { id: 'A', type: 'trigger', label: 'Webhook', sub: 'POST /orders', x: 65, y: 175 },
    { id: 'B', type: 'http', label: 'HTTP', sub: 'GET /inventory', x: 200, y: 175 },
    { id: 'C', type: 'if', label: 'IF', sub: 'status == 200', x: 335, y: 175 },
    { id: 'D', type: 'transform', label: 'Transform', sub: 'map → invoice', x: 470, y: 95 },
    { id: 'E', type: 'http', label: 'HTTP', sub: 'POST /notify', x: 615, y: 95 },
    { id: 'F', type: 'transform', label: 'Transform', sub: 'log + alert', x: 540, y: 258 },
    { id: 'G', type: 'out', label: 'Respond', sub: '202 Accepted', x: 770, y: 175 }
  ];
  const BASE = [['A','B'],['B','C'],['C','D','true'],['C','F','false'],['D','E'],['E','G'],['F','G']];
  const CYC = ['E', 'B'];
  const byId = Object.fromEntries(NODES.map(n => [n.id, n]));
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const defs = mk('defs', {}, svg);
  [['mk', 'mk-def'], ['mk-sig', 'mk-sig'], ['mk-bad', 'mk-bad']].forEach(([id, cls]) => {
    const m = mk('marker', { id: 'dag-' + id, viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '13', markerHeight: '13', markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse', class: cls }, defs);
    mk('path', { d: 'M0,0 L10,5 L0,10 z' }, m);
  });
  const gE = mk('g', {}, svg), gL = mk('g', {}, svg), gN = mk('g', {}, svg);
  const pathD = (a, b) => { const s = byId[a], t = byId[b]; const x1 = s.x + W / 2, y1 = s.y, x2 = t.x - W / 2 - 3, y2 = t.y; const dx = Math.max(34, (x2 - x1) / 2); return 'M' + x1 + ',' + y1 + ' C' + (x1 + dx) + ',' + y1 + ' ' + (x2 - dx) + ',' + y2 + ' ' + x2 + ',' + y2; };
  const edgeEls = {};
  BASE.forEach(e => { edgeEls[e[0] + e[1]] = mk('path', { d: pathD(e[0], e[1]), class: 'edge', 'marker-end': 'url(#dag-mk)' }, gE); });
  const cyc = mk('path', { d: 'M615,70 C615,6 200,6 200,146', class: 'edge cyc', 'marker-end': 'url(#dag-mk-bad)' }, gE);
  mk('text', { x: 382, y: 124, class: 'elab' }, gL).textContent = 'true';
  mk('text', { x: 384, y: 240, class: 'elab' }, gL).textContent = 'false';
  const cycLab = mk('text', { x: 408, y: 22, class: 'elab bad', 'text-anchor': 'middle' }, gL); cycLab.textContent = 'retry loop · E → B';
  cyc.setAttribute('visibility', 'hidden'); cycLab.setAttribute('visibility', 'hidden');
  const nodeEls = {};
  NODES.forEach(n => {
    const g = mk('g', { class: 'n', transform: 'translate(' + (n.x - W / 2) + ',' + (n.y - H / 2) + ')' }, gN);
    mk('rect', { width: W, height: H, rx: 10 }, g);
    const gl = mk('g', { class: 'gl', transform: 'translate(15,17)' }, g);
    if (n.type === 'trigger') mk('circle', { r: 5 }, gl);
    else if (n.type === 'if') mk('path', { d: 'M0,-6 L6,0 L0,6 L-6,0 Z' }, gl);
    else if (n.type === 'http') mk('path', { d: 'M-6,0 H5 M1,-4 L5,0 L1,4' }, gl);
    else if (n.type === 'transform') mk('path', { d: 'M-3,-6 H-6 V6 H-3 M3,-6 H6 V6 H3' }, gl);
    else mk('rect', { x: -5, y: -5, width: 10, height: 10 }, gl);
    mk('text', { x: 27, y: 22, class: 'nl' }, g).textContent = n.label;
    mk('text', { x: 10, y: 39, class: 'ns' }, g).textContent = n.sub;
    mk('text', { x: W - 8, y: 15, class: 'nid2', 'text-anchor': 'end' }, g).textContent = n.id;
    nodeEls[n.id] = g;
  });

  const failT = $('#dagFail'), cycT = $('#dagCycle'), runB = $('#dagRun'), msg = $('#dagMsg'), orderEl = $('#dagOrder'), rows = $('#dagRows');
  const edges = () => cycT.checked ? BASE.concat([CYC]) : BASE;
  function topo(ids, es) {
    const indeg = {}, adj = {};
    ids.forEach(i => { indeg[i] = 0; adj[i] = []; });
    es.forEach(([a, b]) => { adj[a].push(b); indeg[b]++; });
    const q = ids.filter(i => indeg[i] === 0), out = [];
    while (q.length) { const u = q.shift(); out.push(u); adj[u].forEach(w => { if (--indeg[w] === 0) q.push(w); }); }
    return out.length === ids.length ? out : null;
  }
  function findCycle(ids, es) {
    const adj = {}; ids.forEach(i => adj[i] = []); es.forEach(([a, b]) => adj[a].push(b));
    const color = {}, stack = []; let found = null;
    const dfs = u => {
      color[u] = 1; stack.push(u);
      for (const w of adj[u]) { if (found) return; if (color[w] === 1) { found = stack.slice(stack.indexOf(w)).concat(w); return; } if (!color[w]) dfs(w); }
      stack.pop(); color[u] = 2;
    };
    ids.forEach(i => { if (!color[i] && !found) dfs(i); });
    return found;
  }
  const MS = { A: [0.2, 0.6], B: [90, 240], C: [0.3, 1], D: [3, 9], E: [60, 160], F: [2, 6], G: [0.3, 0.9] };
  function exec(id, fail, out) {
    switch (id) {
      case 'A': return { orderId: 'ORD-4821', items: 3 };
      case 'B': return fail ? { status: 500, error: 'upstream' } : { status: 200, inStock: true };
      case 'C': return { branch: out.B.status === 200 };
      case 'D': return { invoice: 'INV-4821', total: '₹1,240' };
      case 'E': return { status: 200, channel: '#orders' };
      case 'F': return { alert: 'inventory 500', logged: true };
      default: return { status: 202 };
    }
  }
  const fmtOut = o => '{ ' + Object.entries(o).map(([k, v]) => k + ': ' + (typeof v === 'string' ? '"' + v + '"' : v)).join(', ') + ' }';
  function plan(fail) {
    const es = edges(), ids = NODES.map(n => n.id);
    const order = topo(ids, es);
    if (!order) return { cycle: findCycle(ids, es) };
    const st = {}, out = {}, ms = {};
    order.forEach(id => {
      const inc = es.filter(e => e[1] === id);
      const runs = byId[id].type === 'trigger' || inc.some(e => st[e[0]] === 'success' && (!e[2] || String(out[e[0]].branch) === e[2]));
      if (!runs) { st[id] = 'skipped'; return; }
      st[id] = 'success'; out[id] = exec(id, fail, out);
      const r = MS[id]; ms[id] = r[1] < 2 ? +rand(r[0], r[1]).toFixed(1) : ri(r[0], r[1]);
    });
    return { order, st, out, ms, es };
  }
  const taken = (p, e) => p.st[e[0]] === 'success' && p.st[e[1]] === 'success' && (!e[2] || String(p.out[e[0]].branch) === e[2]);
  const setNode = (id, s) => nodeEls[id].setAttribute('class', 'n ' + (s || ''));
  const setEdge = (k, s) => { const p = edgeEls[k]; if (!p) return; p.setAttribute('class', 'edge ' + (s || '')); p.setAttribute('marker-end', s === 'done' || s === 'active' ? 'url(#dag-mk-sig)' : s === 'bad' ? 'url(#dag-mk-bad)' : 'url(#dag-mk)'); };
  const reset = () => { NODES.forEach(n => setNode(n.id, '')); Object.keys(edgeEls).forEach(k => setEdge(k, '')); cyc.setAttribute('class', 'edge cyc'); };
  const renderRows = list => { rows.innerHTML = list.map(r => '<tr><td><b>' + r.id + '</b> ' + esc(byId[r.id].label) + ' <span class="muted">' + esc(byId[r.id].sub) + '</span></td><td><span class="pill ' + r.s + '">' + r.s + '</span></td><td class="num">' + (r.ms == null ? '–' : r.ms) + '</td><td class="out">' + esc(r.out || '') + '</td></tr>').join(''); };
  const chips = order => { orderEl.innerHTML = '<span class="ol">TOPOLOGICAL ORDER</span>' + order.map(id => '<span class="o">' + id + '</span>').join('<span>→</span>'); };
  const summary = p => {
    const ran = p.order.filter(id => p.st[id] === 'success').length, sk = p.order.length - ran;
    const tot = p.order.reduce((a, id) => a + (p.ms[id] || 0), 0);
    const notTaken = p.out.C && p.out.C.branch ? 'false' : 'true';
    msg.className = 'msg ok';
    msg.textContent = 'Combo complete! ' + ran + ' of ' + p.order.length + ' nodes ran · ' + sk + ' skipped (' + notTaken + ' branch not taken) · ' + Math.round(tot) + ' ms';
  };
  const paintFinal = p => {
    reset();
    p.order.forEach(id => setNode(id, p.st[id]));
    BASE.forEach(e => setEdge(e[0] + e[1], taken(p, e) ? 'done' : 'dim'));
    chips(p.order);
    renderRows(p.order.map(id => ({ id, s: p.st[id], ms: p.ms[id], out: p.st[id] === 'success' ? fmtOut(p.out[id]) : 'branch not taken' })));
    summary(p);
  };
  const showCycle = cycle => {
    reset();
    const set = new Set(cycle);
    cycle.forEach(id => setNode(id, 'cyc'));
    for (let i = 0; i < cycle.length - 1; i++) setEdge(cycle[i] + cycle[i + 1], 'bad');
    cyc.setAttribute('class', 'edge cyc bad-on');
    orderEl.innerHTML = '<span class="ol">TOPOLOGICAL ORDER</span><span class="o bad">none</span>';
    renderRows(NODES.map(n => ({ id: n.id, s: set.has(n.id) ? 'error' : 'queued', ms: null, out: set.has(n.id) ? 'part of the cycle' : 'not scheduled' })));
    msg.className = 'msg err';
    msg.textContent = 'Validation failed: cycle detected ' + cycle.join(' → ') + '. The engine refuses to schedule a graph with a cycle. Retries belong in a node\'s retry policy, not in the graph.';
  };
  let busy = false;
  async function run() {
    if (busy) return; busy = true; runB.disabled = true;
    reset();
    const p = plan(failT.checked);
    if (p.cycle) { showCycle(p.cycle); busy = false; runB.disabled = false; return; }
    chips(p.order);
    const live = p.order.map(id => ({ id, s: 'queued', ms: null, out: '' }));
    renderRows(live);
    msg.className = 'msg'; msg.textContent = 'Validated: no cycles. Executing in topological order…';
    for (let i = 0; i < p.order.length; i++) {
      const id = p.order[i];
      const inc = p.es.filter(e => e[1] === id);
      if (p.st[id] === 'skipped') {
        setNode(id, 'skipped'); inc.forEach(e => setEdge(e[0] + e[1], 'dim'));
        live[i] = { id, s: 'skipped', ms: null, out: 'branch not taken' }; renderRows(live);
        await sleep(RM ? 30 : 200); continue;
      }
      inc.forEach(e => setEdge(e[0] + e[1], taken(p, e) ? 'active' : 'dim'));
      setNode(id, 'running'); live[i].s = 'running'; renderRows(live);
      await sleep(RM ? 50 : Math.min(820, 280 + p.ms[id] * 2));
      inc.forEach(e => { if (taken(p, e)) setEdge(e[0] + e[1], 'done'); });
      setNode(id, 'success');
      live[i] = { id, s: 'success', ms: p.ms[id], out: fmtOut(p.out[id]) }; renderRows(live);
    }
    BASE.forEach(e => { if (!taken(p, e)) setEdge(e[0] + e[1], 'dim'); });
    summary(p);
    busy = false; runB.disabled = false;
  }
  runB.addEventListener('click', run);
  failT.addEventListener('change', run);
  cycT.addEventListener('change', () => {
    const v = cycT.checked ? 'visible' : 'hidden';
    cyc.setAttribute('visibility', v); cycLab.setAttribute('visibility', v);
    run();
  });
  paintFinal(plan(false));
});

/* ---------- mission B: retry & backoff ---------- */
safe('retry', () => {
  const rate = $('#rRate'), rateOut = $('#rRateOut'), maxSel = $('#rMax'), send = $('#rSend'), list = $('#rList'), res = $('#rRes'), polMax = $('#rPolicyMax');
  const SCALE = 1600;
  const reason = { 200: 'OK', 429: 'Too Many Requests', 500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable', timeout: 'no response in 1000 ms' };
  rate.addEventListener('input', () => { rateOut.textContent = rate.value + '%'; });
  maxSel.addEventListener('change', () => { polMax.textContent = maxSel.value; });
  const row = (cls, a, b, ms) => {
    const d = document.createElement('div');
    d.className = 'att ' + cls;
    d.innerHTML = '<span class="an">' + a + '</span><span class="ac">' + b + '</span><span class="bar"><i></i></span><span class="num">' + ms + ' ms</span>';
    list.appendChild(d); return d;
  };
  const attRow = (n, code, ms) => row(code === 200 ? 'ok' : 'fail', 'HIT ' + n, (code === 'timeout' ? 'ETIMEDOUT' : code) + (code === 200 ? '<em>CRITICAL!</em>' : '<em>BLOCKED</em>') + '<small>' + reason[code] + '</small>', ms);
  const waitRow = (ms, k, note) => row('wait', 'wait', '200 × 2<sup>' + k + '</sup> ± 20%' + (note ? '<small>' + note + '</small>' : ''), ms);
  const fill = (d, ms, anim) => {
    const i = d.querySelector('i'), pct = Math.min(100, ms / SCALE * 100);
    if (!anim || RM) { i.style.width = pct + '%'; return Promise.resolve(); }
    const t = Math.max(160, ms * 0.5);
    i.style.transition = 'width ' + t + 'ms linear';
    requestAnimationFrame(() => requestAnimationFrame(() => { i.style.width = pct + '%'; }));
    return sleep(t + 20);
  };
  let busy = false;
  async function go() {
    if (busy) return; busy = true; send.disabled = true;
    list.innerHTML = ''; res.className = 'msg'; res.textContent = 'Request in flight…';
    const p = +rate.value / 100, max = +maxSel.value;
    let n = 0, total = 0;
    for (;;) {
      n++;
      const code = Math.random() < p ? pick([429, 500, 502, 503, 'timeout']) : 200;
      const ms = code === 'timeout' ? 1000 : ri(70, 260);
      await fill(attRow(n, code, ms), ms, true); total += ms;
      if (code === 200) { res.className = 'msg ok'; res.textContent = 'Boss defeated! 200 OK after ' + n + ' attempt' + (n > 1 ? 's' : '') + ' · ' + (total / 1000).toFixed(2) + ' s end to end'; break; }
      if (n - 1 >= max) { res.className = 'msg err'; res.textContent = 'Retreat after ' + n + ' attempts (' + max + ' retries). The last ' + (code === 'timeout' ? 'timeout' : code) + ' goes to the centralized error middleware, which returns a clean 502 to the caller.'; break; }
      let delay = Math.round(200 * Math.pow(2, n - 1) * (1 + rand(-0.2, 0.2))), note = '';
      if (code === 429 && delay < 1000) { delay = 1000; note = 'Retry-After: 1s wins'; }
      await fill(waitRow(delay, n - 1, note), delay, true); total += delay;
    }
    busy = false; send.disabled = false;
  }
  send.addEventListener('click', go);
  fill(attRow(1, 503, 184), 184); fill(waitRow(213, 0), 213);
  fill(attRow(2, 429, 96), 96); fill(waitRow(1000, 1, 'Retry-After: 1s wins'), 1000);
  fill(attRow(3, 200, 142), 142);
  res.className = 'msg ok'; res.textContent = 'Example run · boss defeated! 200 OK after 3 attempts · 1.64 s end to end';
});

/* ---------- mission C: offline POS ---------- */
safe('pos', () => {
  const MENU = [['Masala chai', 20], ['Samosa', 15], ['Veg thali', 120], ['Cold coffee', 60], ['Paneer roll', 90]];
  const price = Object.fromEntries(MENU);
  const cart = new Map([['Masala chai', 2], ['Samosa', 2]]);
  let online = true, no = 1043, syncing = false;
  const device = [], server = [{ id: 'B-1042', total: 75, items: 3 }, { id: 'B-1041', total: 240, items: 4 }];
  const menu = $('#posMenu'), cartEl = $('#posCart'), charge = $('#posCharge'), net = $('#posNet'), netLab = $('#posNetLab'), devEl = $('#posDev'), srvEl = $('#posSrv'), devN = $('#posDevN'), srvN = $('#posSrvN'), log = $('#posLog'), wrap = $('#posWrap');
  const inr = n => '₹' + n.toLocaleString('en-IN');
  menu.innerHTML = MENU.map(([n, p]) => '<button type="button" data-item="' + esc(n) + '">' + esc(n) + '<b>' + inr(p) + '</b></button>').join('');
  menu.addEventListener('click', e => { const b = e.target.closest('[data-item]'); if (!b) return; const k = b.dataset.item; cart.set(k, (cart.get(k) || 0) + 1); renderCart(); });
  cartEl.addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (!b) return; const k = b.dataset.rm; const q = (cart.get(k) || 0) - 1; if (q > 0) cart.set(k, q); else cart.delete(k); renderCart(); });
  const total = () => [...cart].reduce((a, [k, q]) => a + price[k] * q, 0);
  function renderCart() {
    cartEl.innerHTML = cart.size ? [...cart].map(([k, q]) => '<li><span>' + q + ' × ' + esc(k) + '</span><span>' + inr(price[k] * q) + '</span><button type="button" data-rm="' + esc(k) + '" aria-label="Remove one ' + esc(k) + '">−</button></li>').join('') : '<li class="empty">Tap the menu to add items.</li>';
    const t = total(); charge.disabled = t === 0; charge.textContent = t ? 'Charge ' + inr(t) : 'Charge';
  }
  const card = (b, cls, fresh) => '<div class="billcard ' + cls + (fresh ? ' fresh' : '') + '"><span><b>' + b.id + '</b> · ' + b.items + ' item' + (b.items > 1 ? 's' : '') + ' · ' + inr(b.total) + '</span><span class="bs2">' + (cls === 'pending' ? 'pending sync' : 'synced ✓') + '</span></div>';
  function renderQ(freshDev, freshSrv) {
    devEl.innerHTML = device.length ? device.map(b => card(b, 'pending', b.id === freshDev)).join('') : '<p class="qempty">Nothing waiting. Every bill is on the server.</p>';
    srvEl.innerHTML = server.slice(0, 5).map(b => card(b, 'synced', b.id === freshSrv)).join('');
    devN.textContent = device.length; srvN.textContent = server.length;
  }
  const say = t => { const li = document.createElement('li'); li.textContent = t; log.prepend(li); while (log.children.length > 4) log.lastChild.remove(); };
  async function sync() {
    if (syncing) return; syncing = true;
    while (device.length && online) {
      await sleep(RM ? 60 : 700);
      if (!online || !device.length) break;
      const b = device.shift(); server.unshift(b); renderQ(null, b.id);
      say(b.id + ' synced · POST /bills → 201');
    }
    syncing = false;
  }
  charge.addEventListener('click', () => {
    const t = total(); if (!t) return;
    const items = [...cart.values()].reduce((a, q) => a + q, 0);
    const b = { id: 'B-' + (no++), total: t, items };
    cart.clear(); renderCart();
    device.push(b); renderQ(b.id);
    say(b.id + ' written to IndexedDB' + (online ? ' · syncing' : ' · offline, queued'));
    if (online) sync();
  });
  net.addEventListener('change', () => {
    online = net.checked; netLab.textContent = online ? 'Online' : 'Offline';
    wrap.classList.toggle('offline', !online);
    if (online) { say('reconnected · ' + device.length + ' bill' + (device.length === 1 ? '' : 's') + ' to sync'); sync(); }
    else say('network lost · billing continues offline');
  });
  renderCart(); renderQ();
});

/* ---------- mission D: context window ---------- */
safe('chat', () => {
  const BUDGET = 240;
  const SYS = "You are Shubham's portfolio assistant. Answer only from his resume and keep replies short.";
  const tok = s => Math.ceil(s.trim().split(/\s+/).filter(Boolean).length * 1.3);
  const KB = [
    { k: ['workflow', 'engine', 'dag', 'n8n', 'automation', 'orchestrat', 'topolog', 'cycle'], a: "It's an n8n-style engine in Node.js/Express. A workflow is a DAG of pluggable nodes (triggers, HTTP calls, conditions, transforms) built with Strategy and Factory patterns. The core detects cycles, orders nodes with a topological sort, branches on conditions and records each node's input, output, status and duration. BullMQ workers run it off the request path." },
    { k: ['queue', 'bullmq', 'redis', 'worker', 'async', 'scale'], a: "Execution is decoupled from the API with a Redis-backed BullMQ queue. The API enqueues a run and returns right away; worker processes pick it up, so long workflows never block requests and workers scale horizontally." },
    { k: ['retry', 'retries', 'backoff', '429', 'timeout', 'error', 'fail'], a: "Third-party calls get timeouts and retries with exponential backoff on 429 and 5xx responses. Anything that still fails goes through centralized error-handling middleware, so callers always get a consistent error." },
    { k: ['chatbot', 'llm', 'ai', 'gpt', 'openai', 'gemini', 'rag', 'prompt', 'context', 'token'], a: "I built an AI chatbot backend with per-session conversation memory, system and user prompt templates, LLM API calls, context-window trimming like this demo, and response post-processing. I'm also certified in prompt engineering." },
    { k: ['offline', 'pos', 'pwa', 'indexeddb', 'service worker', 'billing', 'webmintra', 'sync'], a: "At Webmintra I worked on a React POS (Shipment, Ledger and Reports modules). I made it offline-first: bills go to IndexedDB and sync on reconnect, and a service worker caches the app shell so it loads instantly and updates itself on new builds." },
    { k: ['jira', 'tracker', 'cron', 'ticket', 'sequelize', 'mysql', 'dashboard'], a: "At NIIT I built a Jira ticket tracker: issues sync from the Jira REST API via JQL into Sequelize models, a node-cron job flags overdue tickets on a filterable React dashboard, and pagination plus MySQL indexing keep it fast." },
    { k: ['stack', 'skill', 'tech', 'language', 'framework', 'react', 'node', 'typescript', 'mern', 'tools', 'moves'], a: "Mostly MERN with TypeScript: React, Next.js, Node.js and Express, with MongoDB, MySQL, PostgreSQL and Redis. For delivery: Docker, GitHub Actions, Jenkins, Nginx and AWS. Tests in Jest, Supertest and React Testing Library." },
    { k: ['experience', 'years', 'work', 'job', 'career', 'niit', 'company', 'role', 'promot', 'arc'], a: "Nearly three years in production: Web Developer at Webmintra Technologies, Noida (Jan 2024 – Mar 2025), Associate Software Engineer at NIIT, Gurugram (Apr 2025 – Jun 2026), and Software Engineer at NIIT since Jul 2026." },
    { k: ['test', 'jest', 'ci', 'cd', 'docker', 'deploy', 'devops', 'aws', 'logging'], a: "Jest and Supertest for APIs, React Testing Library for UI. CI/CD runs Dockerized with GitHub Actions or Jenkins, deployed to AWS behind Nginx, with structured logging so production issues are traceable." },
    { k: ['educat', 'degree', 'college', 'study', 'studied', 'engineering', 'b.tech', 'school', 'electrical', 'origin'], a: "B.Tech in Electrical Engineering from Dr. B.C. Roy Engineering College, Durgapur (2019–2023). School in Muzaffarpur: Trident Public School for Class XII and Sunshine Prep/High School for Class X." },
    { k: ['contact', 'email', 'reach', 'hire', 'phone', 'linkedin', 'github', 'talk', 'available', 'resume', 'call'], a: "Email sraj452002@gmail.com or call +91 7766062587. I'm also on LinkedIn at linkedin.com/in/shubham2002 and GitHub at github.com/sraj452002. The next-episode preview at the bottom has copy buttons." },
    { k: ['mentor', 'lead', 'review', 'design', 'hld', 'lld', 'architect', 'pattern', 'solid'], a: "On my current team I write the HLD/LLD docs, lead code reviews and mentor junior engineers. I use SOLID and patterns like Strategy and Factory to keep the node system pluggable." },
    { k: ['hello', 'hi', 'hey', 'namaste', 'yo', 'konnichiwa'], a: "Hi! I answer from Shubham's resume. Ask about the workflow engine, the offline POS, the chatbot backend, his stack or how to reach him." }
  ];
  const FALLBACK = "That's outside what I know. I only answer from Shubham's resume, so try the workflow engine, the offline POS, his stack or how to reach him.";
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const answer = q => {
    const s = q.toLowerCase(); let best = null, score = 0;
    KB.forEach(e => {
      let sc = 0;
      e.k.forEach(k => { const hit = k.length <= 3 ? new RegExp('\\b' + reEsc(k) + '\\b').test(s) : s.includes(k); if (hit) sc += k.length > 3 ? 2 : 1; });
      if (sc > score) { score = sc; best = e; }
    });
    return best ? best.a : FALLBACK;
  };
  const msgsEl = $('#msgs'), form = $('#chatForm'), input = $('#chatIn'), bar = $('#ctxBar'), num = $('#ctxNum'), logEl = $('#ctxLog');
  $('#sysText').textContent = SYS; $('#sysTok').textContent = tok(SYS);
  const msgs = [];
  const used = () => tok(SYS) + msgs.reduce((a, m) => a + m.tk, 0);
  const meter = () => { const u = used(), pct = Math.min(100, u / BUDGET * 100); num.textContent = u; bar.style.width = pct + '%'; bar.className = pct > 80 ? 'hot' : ''; };
  const bubble = (role, text) => {
    const d = document.createElement('div'); d.className = 'm ' + role;
    d.innerHTML = (role === 'bot' ? '<svg class="av" viewBox="64 12 192 228" aria-hidden="true"><use href="#ch-head"></use></svg>' : '') + '<div class="b"><span class="who"></span><span class="tx"></span></div>';
    d.querySelector('.who').textContent = (role === 'user' ? 'you' : 'shubham-bot') + ' · ' + tok(text) + ' tok';
    d.querySelector('.tx').textContent = text;
    msgsEl.appendChild(d); msgsEl.scrollTop = msgsEl.scrollHeight; return d;
  };
  const trim = () => {
    const cut = [];
    while (used() > BUDGET && msgs.length > 2) cut.push(msgs.shift());
    if (!cut.length) return;
    const t = cut.reduce((a, m) => a + m.tk, 0);
    cut.forEach(m => m.el.classList.add('trimmed'));
    const div = document.createElement('div'); div.className = 'cut';
    div.textContent = 'context trimmed · ' + cut.length + ' oldest message' + (cut.length > 1 ? 's' : '') + ' dropped · −' + t + ' tokens';
    msgsEl.insertBefore(div, msgs[0].el);
    setTimeout(() => cut.forEach(m => m.el.remove()), RM ? 0 : 1500);
    const none = logEl.querySelector('.none'); if (none) none.remove();
    const li = document.createElement('li'); li.textContent = '−' + t + ' tok · dropped ' + cut.map(m => m.role === 'user' ? 'you' : 'bot').join(' + ');
    logEl.prepend(li); while (logEl.children.length > 4) logEl.lastChild.remove();
  };
  const push = (role, text, el) => { msgs.push({ role, text, tk: tok(text), el }); trim(); meter(); };
  let busy = false;
  async function ask(q) {
    q = (q || '').trim(); if (!q || busy) return;
    busy = true; input.value = '';
    push('user', q, bubble('user', q));
    const a = answer(q);
    await sleep(RM ? 0 : 280);
    const d = bubble('bot', ''); d.classList.add('typing');
    const tx = d.querySelector('.tx');
    if (RM) tx.textContent = a;
    else { for (let i = 0; i <= a.length; i += 3) { tx.textContent = a.slice(0, i); msgsEl.scrollTop = msgsEl.scrollHeight; await sleep(12); } tx.textContent = a; }
    d.querySelector('.who').textContent = 'shubham-bot · ' + tok(a) + ' tok';
    d.classList.remove('typing');
    push('bot', a, d);
    busy = false;
  }
  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  $('#chips').addEventListener('click', e => { const b = e.target.closest('button'); if (b) ask(b.textContent); });
  const q0 = 'What do you build?';
  const a0 = 'Systems that keep running: a DAG-based workflow automation engine, an LLM chatbot backend, an offline-first POS and real-time Socket.io apps. Ask me about any of them.';
  push('user', q0, bubble('user', q0)); push('bot', a0, bubble('bot', a0));
});

/* ---------- contact copy ---------- */
safe('copy', () => {
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => {
    const target = document.getElementById(b.dataset.target);
    const done = t => { b.textContent = t; clearTimeout(b._t); b._t = setTimeout(() => { b.textContent = 'Copy'; }, 1800); };
    const select = () => { const r = document.createRange(); r.selectNodeContents(target); const s = getSelection(); s.removeAllRanges(); s.addRange(r); done('Selected'); };
    try { navigator.clipboard.writeText(b.dataset.copy).then(() => done('Copied!'), select); } catch (e) { select(); }
  }));
});

/* ---------- cheat-code console ---------- */
safe('terminal', () => {
  const term = $('#term'), out = $('#termOut'), form = $('#termForm'), input = $('#termIn'), closeB = $('#termClose');
  let lastFocus = null; const hist = []; let hi = 0;
  const print = (text, cls) => { const d = document.createElement('div'); d.className = 'tl ' + (cls || ''); d.textContent = text; out.appendChild(d); out.scrollTop = out.scrollHeight; };
  const goto = id => { close(); setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }, 60); };
  const SK = {};
  $$('#cards .card').forEach(c => { const name = $('h3', c).textContent; SK[name.toLowerCase()] = { name, items: $$('.back li', c).map(l => l.firstChild.textContent.trim()) }; });
  const alias = { frontend: 'frontend', fe: 'frontend', backend: 'backend', be: 'backend', db: 'databases', databases: 'databases', database: 'databases', cloud: 'cloud & devops', devops: 'cloud & devops', ops: 'cloud & devops', testing: 'testing & tools', tools: 'testing & tools', test: 'testing & tools', ai: 'ai / llm', llm: 'ai / llm', languages: 'languages', lang: 'languages', practices: 'practices' };
  const CMD = {
    help: () => 'cheat codes\n  whoami         who is this\n  profile        the character sheet\n  moves [cat]    special moves · frontend backend db cloud testing ai practices languages\n  story          the three arcs\n  origin         the four-panel origin story\n  missions       jump to the training missions\n  contact        how to reach him\n  start          power up!\n  ls · cat <file> · cd <episode> · clear · exit\n  …and one classic code with the arrow keys',
    whoami: () => 'shubham raj · full stack software engineer (MERN) · NIIT, Gurugram',
    profile: () => 'name      Shubham Raj\nclass     Full Stack Software Engineer (MERN)\nguild     NIIT, Gurugram\nbase      Delhi NCR, India\norigin    B.Tech, Electrical Engineering\nspecial   DAG-based workflow automation',
    moves: a => {
      if (a && alias[a]) { const s = SK[alias[a]]; return s.name + '\n  ' + s.items.join(' · '); }
      if (a) return 'moves: unknown category "' + a + '". try: frontend, backend, db, cloud, testing, ai, practices, languages';
      return Object.values(SK).map(s => (s.name + '                ').slice(0, 17) + s.items.join(' · ')).join('\n');
    },
    story: () => 'arc 01  the offline arc   web developer · Webmintra Technologies, Noida   jan 2024 – mar 2025   [完]\narc 02  the tracker arc   associate software engineer · NIIT, Gurugram  apr 2025 – jun 2026   [完]\narc 03  the engine arc    software engineer · NIIT, Gurugram             jul 2026 – now        [放送中]',
    origin: () => '2017     Class X (AISSE) · Sunshine Prep/High School, Muzaffarpur\n2019     Class XII (AISSCE) · Trident Public School, Muzaffarpur\n2019–23  B.Tech, Electrical Engineering · Dr. B.C. Roy Engineering College, Durgapur\n2024     first production deploy · Webmintra Technologies, Noida',
    contact: () => 'email     sraj452002@gmail.com\nphone     +91 7766062587\nlinkedin  https://linkedin.com/in/shubham2002\ngithub    https://github.com/sraj452002',
    missions: () => { goto('missions'); return 'loading episode 04 · training missions'; },
    start: () => { close(); setTimeout(() => { window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); setTimeout(() => impact(), RM ? 0 : 450); }, 60); return 'POWER UP!'; },
    ls: () => 'profile.txt   story.log   contact.txt   resume.pdf   moves/   missions/',
    cd: a => { const d = (a || '').replace(/\/$/, '').toLowerCase(); const map = { '': 'top', '~': 'top', '/': 'top', profile: 'profile', moves: 'moves', story: 'story', missions: 'missions', next: 'next', contact: 'next' }; if (d in map) { goto(map[d]); return ''; } return 'cd: no such episode: ' + a; },
    cat: a => {
      const F = { 'profile.txt': CMD.profile(), 'contact.txt': CMD.contact(), 'story.log': CMD.story(), 'resume.pdf': 'binary file. the readable version is this whole series.' };
      if (!a) return 'cat: missing file name. try: cat profile.txt';
      if (/\/$/.test(a)) return 'cat: ' + a + ': is a directory. try: cd ' + a;
      return F[a] || 'cat: ' + a + ': no such file';
    },
    sudo: a => { if (/^hire/.test(a || '')) { goto('next'); return 'permission granted. skipping to the next-episode preview…'; } return 'sudo: try "sudo hire-shubham"'; },
    rm: () => 'rm: this story cannot be deleted. nice try.',
    echo: a => a || ''
  };
  CMD.skills = CMD.moves; CMD.experience = CMD.story; CMD.education = CMD.origin; CMD.powerup = CMD.start; CMD.labs = CMD.missions;
  function exec(line) {
    const raw = line.trim(); if (!raw) return;
    print('shubham> ' + raw, 'cmd');
    hist.push(raw); hi = hist.length;
    const parts = raw.split(/\s+/), cmd = parts[0].toLowerCase(), arg = parts.slice(1).join(' ');
    if (cmd === 'clear') { out.innerHTML = ''; return; }
    if (cmd === 'exit' || cmd === 'quit') { close(); return; }
    const f = CMD[cmd];
    if (!f) { print('unknown cheat code: ' + cmd + '. type "help".', 'err'); return; }
    const r = f(cmd === 'moves' || cmd === 'skills' ? arg.toLowerCase() : arg);
    if (r) print(r);
  }
  const boot = () => { print('CHEAT CODE CONSOLE · type "help"', 'dim'); print('try: moves backend · story · sudo hire-shubham · start', 'dim'); };
  function open() { lastFocus = document.activeElement; term.hidden = false; if (!out.childElementCount) boot(); setTimeout(() => input.focus(), 20); }
  function close() { if (term.hidden) return; term.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }
  form.addEventListener('submit', e => { e.preventDefault(); exec(input.value); input.value = ''; });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; input.value = hist[hi]; } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) { hi++; input.value = hist[hi]; } else { hi = hist.length; input.value = ''; } }
  });
  term.addEventListener('keydown', e => { if (e.key !== 'Tab') return; e.preventDefault(); (document.activeElement === input ? closeB : input).focus(); });
  term.addEventListener('click', e => { if (e.target === term) close(); });
  closeB.addEventListener('click', close);
  $('#termBtn').addEventListener('click', open);
  $('#termBtn2').addEventListener('click', open);
  const KON = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0;
  document.addEventListener('keydown', e => {
    const tg = e.target, tag = (tg.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || tg.isContentEditable;
    if (e.key === '`' && !typing) { e.preventDefault(); term.hidden ? open() : close(); return; }
    if (e.key === 'Escape' && !term.hidden) { close(); return; }
    if (typing) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === KON[ki]) { ki++; if (ki === KON.length) { ki = 0; impact('スーパー!!'); lineEl.textContent = 'Secret code! +30 lives.'; } }
    else ki = k === KON[0] ? 1 : 0;
  });
});
})();
