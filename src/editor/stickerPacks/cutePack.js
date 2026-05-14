// Cute pack — 10 yellow-face emotion stickers (240x240). Original artwork.

const baseFace = (extras) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="100" fill="#ffd93b"/>${extras}</svg>`;

const starEyes = baseFace(`
<polygon points="80,90 86,108 105,108 90,118 96,135 80,125 64,135 70,118 55,108 74,108" fill="#fff"/>
<polygon points="160,90 166,108 185,108 170,118 176,135 160,125 144,135 150,118 135,108 154,108" fill="#fff"/>
<path d="M75 160 Q120 185 165 160 L155 175 Q120 195 85 175 Z" fill="#fff"/>`);

const smilingHearts = baseFace(`
<path d="M95 110 c -10 -10 -25 -2 -25 8 c 0 8 13 20 25 28 c 12 -8 25 -20 25 -28 c 0 -10 -15 -18 -25 -8 z" fill="#ff3b6b"/>
<path d="M170 110 c -10 -10 -25 -2 -25 8 c 0 8 13 20 25 28 c 12 -8 25 -20 25 -28 c 0 -10 -15 -18 -25 -8 z" fill="#ff3b6b"/>
<path d="M85 160 Q120 185 155 160" stroke="#3a2418" stroke-width="8" fill="none" stroke-linecap="round"/>`);

const partying = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
<path d="M40 200 L120 30 L200 200 Z" fill="#3b8eff" opacity="0.8"/>
<circle cx="120" cy="130" r="85" fill="#ffd93b"/>
<line x1="115" y1="95" x2="110" y2="115" stroke="#3a2418" stroke-width="6" stroke-linecap="round"/>
<line x1="160" y1="100" x2="170" y2="115" stroke="#3a2418" stroke-width="6" stroke-linecap="round"/>
<path d="M85 155 Q120 200 165 155 Q145 175 105 175 Q95 165 85 155Z" fill="#ff3b6b"/>
<circle cx="60" cy="60" r="8" fill="#34c759"/><circle cx="200" cy="80" r="8" fill="#ff3b6b"/><circle cx="50" cy="180" r="6" fill="#9b5cff"/>
</svg>`;

const coolSunglasses = baseFace(`
<rect x="50" y="100" width="65" height="28" rx="14" fill="#222"/>
<rect x="125" y="100" width="65" height="28" rx="14" fill="#222"/>
<line x1="115" y1="114" x2="125" y2="114" stroke="#222" stroke-width="6"/>
<path d="M85 160 Q120 185 155 160" stroke="#3a2418" stroke-width="8" fill="none" stroke-linecap="round"/>`);

const sleepy = baseFace(`
<path d="M70 110 Q85 100 100 110" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M140 110 Q155 100 170 110" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M105 165 Q120 175 135 165" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/>
<text x="160" y="80" font-family="sans-serif" font-size="32" font-weight="700" fill="#3b8eff">z</text>
<text x="180" y="55" font-family="sans-serif" font-size="22" font-weight="700" fill="#3b8eff">z</text>`);

const blush = baseFace(`
<path d="M75 110 Q90 95 105 110" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M135 110 Q150 95 165 110" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/>
<circle cx="70" cy="150" r="14" fill="#ff95b0" opacity="0.7"/>
<circle cx="170" cy="150" r="14" fill="#ff95b0" opacity="0.7"/>
<path d="M105 165 Q120 175 135 165" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/>`);

const hugging = baseFace(`
<path d="M80 110 Q95 100 110 110" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M130 110 Q145 100 160 110" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M85 165 Q120 195 155 165 Q145 175 95 175 Q88 170 85 165Z" fill="#ff3b6b"/>
<ellipse cx="40" cy="155" rx="20" ry="15" fill="#ffb95c"/>
<ellipse cx="200" cy="155" rx="20" ry="15" fill="#ffb95c"/>`);

const melting = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
<path d="M30 120 Q30 30 120 30 Q210 30 210 120 Q210 170 195 200 Q175 230 150 220 Q140 215 130 220 Q115 230 95 220 Q75 230 60 220 Q40 210 35 195 Q30 175 30 120Z" fill="#ffd93b"/>
<circle cx="95" cy="115" r="7" fill="#3a2418"/><circle cx="145" cy="115" r="7" fill="#3a2418"/>
<path d="M100 155 Q120 170 140 155" stroke="#3a2418" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>`;

const wink = baseFace(`
<circle cx="95" cy="115" r="7" fill="#3a2418"/>
<path d="M135 115 Q150 105 165 115" stroke="#3a2418" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M85 160 Q120 180 155 160" stroke="#3a2418" stroke-width="7" fill="none" stroke-linecap="round"/>`);

const blowingKiss = baseFace(`
<path d="M75 110 Q90 100 105 110" stroke="#3a2418" stroke-width="6" fill="none" stroke-linecap="round"/>
<circle cx="155" cy="115" r="7" fill="#3a2418"/>
<ellipse cx="115" cy="170" rx="16" ry="10" fill="#ff95b0"/>
<path d="M170 150 c -10 -8 -22 -2 -22 6 c 0 6 9 14 18 18 c 9 -4 18 -12 18 -18 c 0 -8 -12 -14 -22 -6 z" fill="#ff3b6b"/>`);

export const CUTE_PACK = {
  id: 'cute',
  name: 'Cute',
  stickers: [
    { id: 'cute-star-eyes',       name: 'Star Eyes',         svg: starEyes,       tags: ['cute','star','excited'] },
    { id: 'cute-smiling-hearts',  name: 'Smiling Hearts',    svg: smilingHearts,  tags: ['cute','love','hearts'] },
    { id: 'cute-partying',        name: 'Partying',          svg: partying,       tags: ['party','celebrate'] },
    { id: 'cute-cool-sunglasses', name: 'Cool Sunglasses',   svg: coolSunglasses, tags: ['cool','sunglasses'] },
    { id: 'cute-sleepy',          name: 'Sleepy',            svg: sleepy,         tags: ['sleep','tired'] },
    { id: 'cute-blush',           name: 'Blush',             svg: blush,          tags: ['blush','shy'] },
    { id: 'cute-hugging',         name: 'Hugging',           svg: hugging,        tags: ['hug','love'] },
    { id: 'cute-melting',         name: 'Melting',           svg: melting,        tags: ['melt'] },
    { id: 'cute-wink',            name: 'Wink',              svg: wink,           tags: ['wink'] },
    { id: 'cute-blowing-kiss',    name: 'Blowing Kiss',      svg: blowingKiss,    tags: ['kiss','love'] },
  ],
};
