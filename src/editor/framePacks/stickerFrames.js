// Sticker frames pack — 10 decorative SVG overlay frames. Each frame's SVG
// is sized to match the underlying image's bounds when applied; it is then
// locked to the image and tagged with `__frameId`.

function scalloped(stroke = '#ff80ad') {
  // Repeating scalloped border, designed in 800x800 viewBox for crispness.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
<rect x="20" y="20" width="760" height="760" fill="none" stroke="${stroke}" stroke-width="14"/>
<g fill="${stroke}">
${repeatScallops(stroke)}
</g>
</svg>`;
}
function repeatScallops(stroke) {
  let s = '';
  const step = 40;
  for (let x = 20; x <= 780; x += step) {
    s += `<circle cx="${x}" cy="20" r="14"/>`;
    s += `<circle cx="${x}" cy="780" r="14"/>`;
  }
  for (let y = 20 + step; y <= 780 - step; y += step) {
    s += `<circle cx="20" cy="${y}" r="14"/>`;
    s += `<circle cx="780" cy="${y}" r="14"/>`;
  }
  return s;
}

const dottedFrame = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
<rect x="30" y="30" width="740" height="740" fill="none" stroke="#3b8eff" stroke-width="10" stroke-dasharray="2 18" stroke-linecap="round"/>
</svg>`;

const washiCorners = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
<g fill="#ffd93b" opacity="0.85">
  <rect x="-20" y="40" width="220" height="60" transform="rotate(-12 90 70)"/>
  <rect x="600" y="40" width="220" height="60" transform="rotate(12 710 70)"/>
  <rect x="-20" y="700" width="220" height="60" transform="rotate(12 90 730)"/>
  <rect x="600" y="700" width="220" height="60" transform="rotate(-12 710 730)"/>
</g>
</svg>`;

const tornEdge = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
<path d="M0 0 L800 0 L780 24 L800 50 L770 80 L800 110 L780 140 L800 170 L780 200 L800 800 L770 780 L800 760 L770 740 L800 720 L780 700 L800 680 L0 800 L20 770 L0 745 L25 720 L0 695 L20 670 L0 645 L20 620 L0 600 L0 0 Z" fill="#fffaf0" stroke="#c89070" stroke-width="3"/>
</svg>`;

const confetti = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
<g>
${confettiPieces()}
</g>
</svg>`;
function confettiPieces() {
  const colors = ['#ff3b6b', '#ffd93b', '#34c759', '#3b8eff', '#9b5cff', '#ff80ad'];
  let s = '';
  for (let i = 0; i < 40; i++) {
    const x = Math.round(Math.random() * 760 + 20);
    const top = Math.random() < 0.5;
    const y = top ? Math.round(Math.random() * 60 + 10) : Math.round(720 + Math.random() * 60);
    const c = colors[i % colors.length];
    const r = Math.round(Math.random() * 30);
    s += `<rect x="${x}" y="${y}" width="14" height="8" fill="${c}" transform="rotate(${r} ${x + 7} ${y + 4})"/>`;
  }
  // sides
  for (let i = 0; i < 20; i++) {
    const y = Math.round(Math.random() * 600 + 80);
    const left = Math.random() < 0.5;
    const x = left ? Math.round(Math.random() * 40 + 10) : Math.round(740 + Math.random() * 40);
    const c = colors[i % colors.length];
    s += `<circle cx="${x}" cy="${y}" r="5" fill="${c}"/>`;
  }
  return s;
}

const starsBorder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
${starsAround()}
</svg>`;
function starsAround() {
  let s = '';
  const star = (cx, cy, size, color) => `<polygon points="${cx},${cy - size} ${cx + size * 0.3},${cy - size * 0.3} ${cx + size},${cy - size * 0.2} ${cx + size * 0.4},${cy + size * 0.2} ${cx + size * 0.6},${cy + size} ${cx},${cy + size * 0.5} ${cx - size * 0.6},${cy + size} ${cx - size * 0.4},${cy + size * 0.2} ${cx - size},${cy - size * 0.2} ${cx - size * 0.3},${cy - size * 0.3}" fill="${color}"/>`;
  const colors = ['#ffd93b', '#ff80ad', '#3b8eff'];
  for (let i = 0; i < 16; i++) {
    const x = 20 + i * 50;
    s += star(x, 30, 14, colors[i % 3]);
    s += star(x, 770, 14, colors[(i + 1) % 3]);
  }
  for (let i = 1; i < 14; i++) {
    const y = 30 + i * 50;
    s += star(30, y, 14, colors[i % 3]);
    s += star(770, y, 14, colors[(i + 1) % 3]);
  }
  return s;
}

const heartBorder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
${heartsAround()}
</svg>`;
function heartsAround() {
  const heart = (cx, cy, scale, color) => `<g transform="translate(${cx} ${cy}) scale(${scale})"><path d="M0 18 C -16 8, -28 -2, -28 -14 C -28 -22, -22 -28, -14 -28 C -6 -28, -2 -24, 0 -18 C 2 -24, 6 -28, 14 -28 C 22 -28, 28 -22, 28 -14 C 28 -2, 16 8, 0 18 Z" fill="${color}"/></g>`;
  const colors = ['#ff3b6b', '#ff80ad'];
  let s = '';
  for (let i = 0; i < 14; i++) {
    const x = 50 + i * 55;
    s += heart(x, 40, 1, colors[i % 2]);
    s += heart(x, 760, 1, colors[(i + 1) % 2]);
  }
  for (let i = 1; i < 13; i++) {
    const y = 40 + i * 55;
    s += heart(40, y, 1, colors[i % 2]);
    s += heart(760, y, 1, colors[(i + 1) % 2]);
  }
  return s;
}

const cloudBubble = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
<path d="M80 240 a90 90 0 0 1 80 -130 a100 100 0 0 1 170 -50 a90 90 0 0 1 180 50 a90 90 0 0 1 100 130 a90 90 0 0 1 -30 200 a90 90 0 0 1 -110 100 a100 100 0 0 1 -170 50 a90 90 0 0 1 -180 -50 a90 90 0 0 1 -110 -100 a90 90 0 0 1 70 -200 Z" fill="none" stroke="#fff" stroke-width="36"/>
</svg>`;

const pastelBlob = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
<defs>
<radialGradient id="bg" cx="50%" cy="50%" r="60%">
  <stop offset="60%" stop-color="rgba(0,0,0,0)"/>
  <stop offset="100%" stop-color="#ffd6e3"/>
</radialGradient>
</defs>
<rect width="800" height="800" fill="url(#bg)"/>
</svg>`;

const stickerGlow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
<rect x="20" y="20" width="760" height="760" fill="none" stroke="#fff" stroke-width="24" rx="36"/>
<rect x="44" y="44" width="712" height="712" fill="none" stroke="#fff" stroke-width="8" rx="24" opacity="0.6"/>
</svg>`;

export const STICKER_FRAMES_PACK = {
  id: 'sticker',
  name: 'Sticker',
  frames: [
    { id: 'scalloped',     name: 'Scalloped',      type: 'svg-overlay', svg: scalloped('#ff80ad') },
    { id: 'dotted-frame',  name: 'Dotted Frame',   type: 'svg-overlay', svg: dottedFrame },
    { id: 'washi-corners', name: 'Washi Corners',  type: 'svg-overlay', svg: washiCorners },
    { id: 'torn-paper',    name: 'Torn Paper',     type: 'svg-overlay', svg: tornEdge },
    { id: 'confetti',      name: 'Confetti',       type: 'svg-overlay', svg: confetti },
    { id: 'stars-border',  name: 'Stars Border',   type: 'svg-overlay', svg: starsBorder },
    { id: 'heart-border',  name: 'Heart Border',   type: 'svg-overlay', svg: heartBorder },
    { id: 'cloud-bubble',  name: 'Cloud Bubble',   type: 'svg-overlay', svg: cloudBubble },
    { id: 'pastel-blob',   name: 'Pastel Blob',    type: 'svg-overlay', svg: pastelBlob },
    { id: 'sticker-glow',  name: 'Sticker Glow',   type: 'svg-overlay', svg: stickerGlow },
  ],
};
