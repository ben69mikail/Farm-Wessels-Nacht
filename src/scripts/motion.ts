/* ------------------------------------------------------------
   Bewegungssystem der Seite. Alles hängt an data-Attributen:
   data-reveal          Einblenden beim Scrollen (IntersectionObserver)
   data-parallax        Bild im .frame bewegt sich gegen den Scroll
   data-count           Zahl zählt hoch (Wert = Zieltext)
   data-track           horizontale Scroll-Strecke, gepinnt (Desktop)
   data-day             Tagesablauf: Fortschrittslinie + Himmelsfarbe
   data-stack           gestapelte Karten, die sich beim Scrollen überlagern
   data-magnetic        Element zieht sich leicht zum Cursor
   data-scrub-scale     Element skaliert beim Scrollen (Filmfenster)
   ------------------------------------------------------------ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const html = document.documentElement;
html.classList.add('js');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer: fine)').matches;

/* ---------- Lenis: weiches Scrollen ---------- */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis!.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
    });
  });
}
window.addEventListener('ww:lock', () => lenis?.stop());
window.addEventListener('ww:unlock', () => lenis?.start());

/* ---------- Reveal ---------- */
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  },
  { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
);
document.querySelectorAll('[data-reveal], .lines').forEach((el) => io.observe(el));
setTimeout(() => document.querySelectorAll('[data-reveal]:not(.is-in), .lines:not(.is-in)').forEach((el) => {
  const r = el.getBoundingClientRect();
  if (r.top < window.innerHeight) el.classList.add('is-in');
}), 1500);

/* ---------- Kopfzeile ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  let last = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      header.classList.toggle('is-scrolled', y > 40);
      header.classList.toggle('is-hidden', y > 400 && y > last && self.direction === 1);
      last = y;
    },
  });
}

if (!reduce) {
  /* ---------- Parallax in Bildrahmen ---------- */
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((frame) => {
    const img = frame.querySelector('img, video');
    if (!img) return;
    const strength = Number(frame.dataset.parallax) || 12;
    gsap.fromTo(img, { yPercent: -strength }, {
      yPercent: strength, ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  /* ---------- Filmfenster wächst beim Scrollen ---------- */
  document.querySelectorAll<HTMLElement>('[data-scrub-scale]').forEach((el) => {
    gsap.fromTo(el, { scale: 0.86, borderRadius: '44px' }, {
      scale: 1, borderRadius: '0px', ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 15%', scrub: 0.6 },
    });
  });

  /* ---------- Sätze, die sich Wort für Wort erhellen ---------- */
  document.querySelectorAll<HTMLElement>('[data-words]').forEach((el) => {
    const words = el.querySelectorAll<HTMLElement>('.w');
    if (!words.length) return;
    gsap.fromTo(words, { opacity: 0.16 }, {
      opacity: 1, stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 },
    });
  });

  /* ---------- Zähler ---------- */
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const raw = el.dataset.count ?? el.textContent ?? '';
    const num = parseFloat(raw.replace(',', '.'));
    if (Number.isNaN(num)) return;
    const suffix = raw.replace(/^[\d.,]+/, '');
    const numPart = raw.slice(0, raw.length - suffix.length);
    const decimals = (numPart.split(/[.,]/)[1] ?? '').length;
    const sep = raw.includes(',') ? ',' : '.';
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(obj, {
        v: num, duration: 1.6, ease: 'power3.out',
        onUpdate: () => { el.textContent = obj.v.toFixed(decimals).replace('.', sep) + suffix; },
      }),
    });
  });

  /* ---------- Horizontale Strecke ---------- */
  ScrollTrigger.matchMedia({
    '(min-width: 900px)': () => {
      document.querySelectorAll<HTMLElement>('[data-track]').forEach((section) => {
        const rail = section.querySelector<HTMLElement>('[data-rail]');
        if (!rail) return;
        const dist = () => rail.scrollWidth - section.clientWidth;
        const tween = gsap.to(rail, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: section, start: 'top top', end: () => `+=${dist()}`,
            pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
          },
        });
        const bar = section.querySelector<HTMLElement>('[data-rail-progress]');
        if (bar) gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${dist()}`, scrub: true } });
        rail.querySelectorAll<HTMLElement>('[data-rail-item] img').forEach((img) => {
          gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
      });
    },
  });

  /* ---------- Tagesablauf: Linie + Himmel ---------- */
  document.querySelectorAll<HTMLElement>('[data-day]').forEach((section) => {
    const line = section.querySelector<HTMLElement>('[data-day-line]');
    const steps = section.querySelectorAll<HTMLElement>('[data-day-step]');
    const skies = ['oklch(0.20 0.04 262)', 'oklch(0.42 0.12 50)', 'oklch(0.52 0.10 78)', 'oklch(0.38 0.14 32)', 'oklch(0.16 0.03 40)'];
    if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top', scrollTrigger: { trigger: section, start: 'top 60%', end: 'bottom 70%', scrub: true } });
    steps.forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step, start: 'top 62%', end: 'bottom 62%',
        onToggle: (self) => {
          step.classList.toggle('is-active', self.isActive);
          if (self.isActive) gsap.to(section, { '--sky': skies[i] ?? skies[skies.length - 1], duration: 1.2, ease: 'power2.out' });
        },
      });
    });
  });

  /* ---------- Gestapelte Karten ---------- */
  document.querySelectorAll<HTMLElement>('[data-stack]').forEach((stack) => {
    const cards = stack.querySelectorAll<HTMLElement>('[data-stack-card]');
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      gsap.to(card, {
        scale: 0.92, opacity: 0.55, filter: 'blur(2px)', ease: 'none',
        scrollTrigger: { trigger: card, start: 'top 12%', end: 'bottom 12%', scrub: true },
      });
    });
  });

  /* ---------- Magnetische Elemente & Button-Glanz ---------- */
  if (fine) {
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
    document.querySelectorAll<HTMLElement>('.btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        btn.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
  }
}

/* ---------- Eigener Cursor (nur Maus, nur ohne Reduced Motion) ---------- */
if (fine && !reduce) {
  const dot = document.createElement('div');
  dot.className = 'cursor';
  dot.setAttribute('aria-hidden', 'true');
  dot.innerHTML = '<span class="cursor__ring"></span><span class="cursor__label"></span>';
  document.body.appendChild(dot);
  const label = dot.querySelector<HTMLElement>('.cursor__label')!;
  const xTo = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3.out' });
  const yTo = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3.out' });
  window.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY); dot.classList.add('is-on'); }, { passive: true });
  document.addEventListener('mouseleave', () => dot.classList.remove('is-on'));
  document.addEventListener('mouseover', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]');
    dot.classList.toggle('is-link', !!t);
    const txt = t?.dataset.cursor ?? '';
    label.textContent = txt;
    dot.classList.toggle('has-label', !!txt);
  });
}

document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
