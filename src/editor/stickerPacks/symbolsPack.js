// Symbols pack — 12 graphic symbols (240x240). Original artwork.

const star = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><polygon points="120,20 150,90 225,95 165,140 185,215 120,170 55,215 75,140 15,95 90,90" fill="#ffd93b" stroke="#e8a72d" stroke-width="5" stroke-linejoin="round"/></svg>`;
const sparkle = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M120 20 L138 102 L220 120 L138 138 L120 220 L102 138 L20 120 L102 102 Z" fill="#ffd93b" stroke="#e8a72d" stroke-width="4"/></svg>`;
const fire = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M120 20 Q80 70 100 110 Q70 100 60 140 Q50 200 120 220 Q190 200 180 140 Q170 100 140 110 Q160 70 120 20Z" fill="#ff6b35"/><path d="M120 80 Q105 110 120 140 Q90 130 90 170 Q90 205 120 215 Q150 205 150 170 Q150 130 120 140Z" fill="#ffd93b"/></svg>`;
const crown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M30 180 L50 70 L90 130 L120 50 L150 130 L190 70 L210 180 Z" fill="#ffd93b" stroke="#c89028" stroke-width="5" stroke-linejoin="round"/><rect x="30" y="180" width="180" height="25" fill="#e8a72d"/><circle cx="120" cy="85" r="8" fill="#ff3b6b"/><circle cx="60" cy="115" r="6" fill="#3b8eff"/><circle cx="180" cy="115" r="6" fill="#34c759"/></svg>`;
const lightning = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><polygon points="140,20 60,140 110,140 90,220 180,90 130,90" fill="#ffd93b" stroke="#e8a72d" stroke-width="5" stroke-linejoin="round"/></svg>`;
const check = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="100" fill="#34c759"/><polyline points="65,125 105,165 175,90" stroke="#fff" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cross = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="100" fill="#ff3b6b"/><line x1="75" y1="75" x2="165" y2="165" stroke="#fff" stroke-width="20" stroke-linecap="round"/><line x1="165" y1="75" x2="75" y2="165" stroke="#fff" stroke-width="20" stroke-linecap="round"/></svg>`;
const heartSparkle = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M120 200 C 70 165, 35 130, 35 90 C 35 65, 55 45, 80 45 C 98 45, 110 55, 120 70 C 130 55, 142 45, 160 45 C 185 45, 205 65, 205 90 C 205 130, 170 165, 120 200 Z" fill="#ff3b6b"/><polygon points="55,40 60,55 75,60 60,65 55,80 50,65 35,60 50,55" fill="#fff7c2"/><polygon points="200,165 204,177 216,181 204,185 200,197 196,185 184,181 196,177" fill="#fff7c2"/></svg>`;
const ribbon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M120 90 Q60 50 35 90 Q60 140 120 110 Z" fill="#ff3b6b"/><path d="M120 90 Q180 50 205 90 Q180 140 120 110 Z" fill="#ff3b6b"/><circle cx="120" cy="100" r="22" fill="#c41f4d"/><path d="M100 110 L70 220 L100 200 L120 220 L140 200 L170 220 L140 110 Z" fill="#ff3b6b"/></svg>`;
const gift = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect x="35" y="85" width="170" height="40" fill="#ff3b6b"/><rect x="35" y="125" width="170" height="90" fill="#c41f4d"/><rect x="108" y="85" width="24" height="130" fill="#fff7c2"/><path d="M120 85 c -15 -25 -55 -35 -55 -10 c 0 18 30 22 55 10 z" fill="#fff7c2"/><path d="M120 85 c 15 -25 55 -35 55 -10 c 0 18 -30 22 -55 10 z" fill="#fff7c2"/></svg>`;
const flower = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><g><circle cx="120" cy="50" r="35" fill="#ff80ad"/><circle cx="190" cy="120" r="35" fill="#ff80ad"/><circle cx="120" cy="190" r="35" fill="#ff80ad"/><circle cx="50" cy="120" r="35" fill="#ff80ad"/><circle cx="170" cy="70" r="32" fill="#ff95b0"/><circle cx="170" cy="170" r="32" fill="#ff95b0"/><circle cx="70" cy="170" r="32" fill="#ff95b0"/><circle cx="70" cy="70" r="32" fill="#ff95b0"/></g><circle cx="120" cy="120" r="32" fill="#ffd93b"/></svg>`;
const rainbow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M30 180 a 90 90 0 0 1 180 0" fill="none" stroke="#ff3b6b" stroke-width="18"/><path d="M48 180 a 72 72 0 0 1 144 0" fill="none" stroke="#ff9b3a" stroke-width="18"/><path d="M66 180 a 54 54 0 0 1 108 0" fill="none" stroke="#ffd93b" stroke-width="18"/><path d="M84 180 a 36 36 0 0 1 72 0" fill="none" stroke="#34c759" stroke-width="18"/><path d="M102 180 a 18 18 0 0 1 36 0" fill="none" stroke="#3b8eff" stroke-width="18"/><ellipse cx="40" cy="190" rx="22" ry="14" fill="#fff"/><ellipse cx="200" cy="190" rx="22" ry="14" fill="#fff"/></svg>`;

export const SYMBOLS_PACK = {
  id: 'symbols',
  name: 'Symbols',
  stickers: [
    { id: 'symbol-star',          name: 'Star',          svg: star,         tags: ['star'] },
    { id: 'symbol-sparkle',       name: 'Sparkle',       svg: sparkle,      tags: ['sparkle','shine'] },
    { id: 'symbol-fire',          name: 'Fire',          svg: fire,         tags: ['fire','hot'] },
    { id: 'symbol-crown',         name: 'Crown',         svg: crown,        tags: ['crown','king','queen'] },
    { id: 'symbol-lightning',     name: 'Lightning',     svg: lightning,    tags: ['lightning','bolt'] },
    { id: 'symbol-check',         name: 'Check',         svg: check,        tags: ['check','done','yes'] },
    { id: 'symbol-cross',         name: 'Cross',         svg: cross,        tags: ['cross','no','close'] },
    { id: 'symbol-heart-sparkle', name: 'Heart Sparkle', svg: heartSparkle, tags: ['heart','sparkle'] },
    { id: 'symbol-ribbon',        name: 'Ribbon',        svg: ribbon,       tags: ['ribbon','bow'] },
    { id: 'symbol-gift',          name: 'Gift',          svg: gift,         tags: ['gift','present'] },
    { id: 'symbol-flower',        name: 'Flower',        svg: flower,       tags: ['flower'] },
    { id: 'symbol-rainbow',       name: 'Rainbow',       svg: rainbow,      tags: ['rainbow'] },
  ],
};
