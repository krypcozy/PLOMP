// ── PARTICLE SYSTEM ── paws, $PMPMP text, mascot images, slime dots
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

const mascotImg = new Image();
mascotImg.src = 'assets/logo.png';
let mascotLoaded = false;
mascotImg.onload = () => { mascotLoaded = true; };

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const TYPES = [
  'paw','paw','paw','paw','paw',
  'text','text','text',
  'img','img','img',
  'star','star','star','star','star','star'
];

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : H + 60;
    this.type = TYPES[Math.floor(Math.random() * TYPES.length)];
    this.speed = 0.1 + Math.random() * 0.3;
    this.drift = (Math.random() - 0.5) * 0.35;
    this.twinkle = Math.random() * Math.PI * 2;
    this.twinkleSpeed = 0.012 + Math.random() * 0.022;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.008;
    if (this.type === 'paw') {
      this.size = 10 + Math.random() * 16;
      this.opacity = 0.07 + Math.random() * 0.2;
    } else if (this.type === 'text') {
      this.size = 9 + Math.random() * 12;
      this.opacity = 0.05 + Math.random() * 0.13;
    } else if (this.type === 'img') {
      this.size = 22 + Math.random() * 32;
      this.opacity = 0.06 + Math.random() * 0.11;
    } else {
      this.size = 0.8 + Math.random() * 2;
      this.opacity = 0.07 + Math.random() * 0.28;
    }
  }
  update() {
    this.y -= this.speed;
    this.x += this.drift;
    this.twinkle += this.twinkleSpeed;
    this.rotation += this.rotSpeed;
    if (this.y < -80) this.reset(false);
  }
  draw() {
    ctx.save();
    const alpha = this.opacity * (0.5 + 0.5 * Math.sin(this.twinkle));
    ctx.globalAlpha = alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === 'paw') {
      ctx.font = this.size + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐾', 0, 0);
    } else if (this.type === 'text') {
      ctx.font = '800 ' + this.size + 'px Fredoka One, cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#4ADE80';
      ctx.fillText('$PMP', 0, 0);
    } else if (this.type === 'img' && mascotLoaded) {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(mascotImg, -this.size / 2, -this.size / 2, this.size, this.size);
    } else if (this.type === 'star') {
      ctx.fillStyle = '#4ADE80';
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

for (let i = 0; i < 110; i++) particles.push(new Particle());

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

// ── NAV SCROLL ──
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  const y = window.scrollY + 100;
  document.querySelectorAll('section[id]').forEach(s => {
    const link = document.querySelector('.nav-links a[href="#' + s.id + '"]');
    if (link) link.style.color = (s.offsetTop <= y && s.offsetTop + s.offsetHeight > y) ? '#4ADE80' : '';
  });
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); closeMobileMenu(); setTimeout(() => t.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }
  });
});

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
function openMobileMenu() { hamburger.classList.add('open'); mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMobileMenu() { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); document.body.style.overflow = ''; }
hamburger.addEventListener('click', () => hamburger.classList.contains('open') ? closeMobileMenu() : openMobileMenu());
mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) closeMobileMenu(); });

// ── FAQ ──
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── COPY CA ──
function copyCA() {
  const ca = document.getElementById('caAddr').textContent.trim();
  navigator.clipboard.writeText(ca).then(() => {
    const btn = document.querySelector('.ca-copy');
    const orig = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── TOKENOMICS BARS ──
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.tbar-fill').forEach(b => b.classList.add('animate')); });
}, { threshold: 0.25 });
const tokenBars = document.getElementById('tokenBars');
if (tokenBars) barObserver.observe(tokenBars);

// ── WHITEPAPER ──
function downloadWhitepaper() {
  const a = document.createElement('a');
  a.href = 'assets/plomp_whitepaper.pdf';
  a.download = 'PLOMP_Whitepaper.pdf';
  a.click();
}
