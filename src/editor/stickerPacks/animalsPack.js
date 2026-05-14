// Animals pack — 16 original flat vector animal face stickers (240x240).
// All artwork is in-house — no copyrighted characters.

const head = (fill, ears = '', extras = '') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  ${ears}
  <circle cx="120" cy="125" r="80" fill="${fill}"/>
  <circle cx="95" cy="115" r="7" fill="#222"/>
  <circle cx="145" cy="115" r="7" fill="#222"/>
  <path d="M105 150 Q120 165 135 150" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${extras}
</svg>`;

const dogEars = `<ellipse cx="65" cy="100" rx="22" ry="36" fill="#8b5a3a"/><ellipse cx="175" cy="100" rx="22" ry="36" fill="#8b5a3a"/>`;
const catEars = `<polygon points="55,55 90,55 75,100" fill="#9c8e84"/><polygon points="185,55 150,55 165,100" fill="#9c8e84"/><polygon points="62,68 86,68 76,92" fill="#ffb3c1"/><polygon points="178,68 154,68 164,92" fill="#ffb3c1"/>`;
const pandaEars = `<circle cx="70" cy="80" r="22" fill="#222"/><circle cx="170" cy="80" r="22" fill="#222"/>`;
const pandaPatches = `<ellipse cx="95" cy="115" rx="20" ry="22" fill="#222"/><ellipse cx="145" cy="115" rx="20" ry="22" fill="#222"/><circle cx="95" cy="115" r="6" fill="#fff"/><circle cx="145" cy="115" r="6" fill="#fff"/><ellipse cx="120" cy="148" rx="9" ry="7" fill="#222"/>`;
const bearEars = `<circle cx="65" cy="80" r="22" fill="#8b5a3a"/><circle cx="175" cy="80" r="22" fill="#8b5a3a"/><circle cx="65" cy="80" r="11" fill="#c89070"/><circle cx="175" cy="80" r="11" fill="#c89070"/>`;
const foxEars = `<polygon points="50,60 95,80 75,110" fill="#e88a3a"/><polygon points="190,60 145,80 165,110" fill="#e88a3a"/>`;
const foxExtras = `<polygon points="60,170 120,200 180,170 120,210" fill="#fff" opacity="0.9"/>`;
const rabbitEars = `<ellipse cx="90" cy="50" rx="14" ry="40" fill="#f1e6dc"/><ellipse cx="150" cy="50" rx="14" ry="40" fill="#f1e6dc"/><ellipse cx="90" cy="55" rx="6" ry="28" fill="#ffb3c1"/><ellipse cx="150" cy="55" rx="6" ry="28" fill="#ffb3c1"/>`;
const lionMane = `<circle cx="120" cy="125" r="100" fill="#d49344"/>`;
const lionExtras = `<g><circle cx="50" cy="80" r="14" fill="#a86926"/><circle cx="190" cy="80" r="14" fill="#a86926"/><circle cx="40" cy="160" r="14" fill="#a86926"/><circle cx="200" cy="160" r="14" fill="#a86926"/></g>`;
const tigerStripes = `<path d="M70 70 L90 95 M170 70 L150 95 M60 130 L80 130 M180 130 L160 130 M70 170 L90 160 M170 170 L150 160" stroke="#3a2418" stroke-width="6" stroke-linecap="round"/>`;
const unicornHorn = `<polygon points="115,40 125,40 120,10" fill="#ffd93b" stroke="#e8a72d" stroke-width="3"/>`;
const koalaEars = `<circle cx="62" cy="100" r="30" fill="#8a98a3"/><circle cx="178" cy="100" r="30" fill="#8a98a3"/><circle cx="62" cy="100" r="18" fill="#d4dde3"/><circle cx="178" cy="100" r="18" fill="#d4dde3"/>`;
const koalaNose = `<ellipse cx="120" cy="135" rx="18" ry="14" fill="#222"/>`;
const monkeyEars = `<circle cx="55" cy="125" r="22" fill="#8b5a3a"/><circle cx="185" cy="125" r="22" fill="#8b5a3a"/><circle cx="55" cy="125" r="12" fill="#c89070"/><circle cx="185" cy="125" r="12" fill="#c89070"/>`;
const monkeyFace = `<ellipse cx="120" cy="150" rx="55" ry="40" fill="#e2bfa4"/>`;
const pigEars = `<polygon points="60,70 95,80 75,110" fill="#ffb6c8"/><polygon points="180,70 145,80 165,110" fill="#ffb6c8"/>`;
const pigSnout = `<ellipse cx="120" cy="150" rx="28" ry="18" fill="#ff95b0"/><circle cx="110" cy="150" r="4" fill="#222"/><circle cx="130" cy="150" r="4" fill="#222"/>`;
const frogEyes = `<circle cx="80" cy="80" r="26" fill="#73c068"/><circle cx="160" cy="80" r="26" fill="#73c068"/><circle cx="80" cy="80" r="14" fill="#fff"/><circle cx="160" cy="80" r="14" fill="#fff"/><circle cx="80" cy="80" r="7" fill="#222"/><circle cx="160" cy="80" r="7" fill="#222"/>`;
const penguinBody = `<ellipse cx="120" cy="135" rx="75" ry="85" fill="#1f2933"/><ellipse cx="120" cy="150" rx="50" ry="65" fill="#fff"/>`;
const penguinBeak = `<polygon points="105,130 135,130 120,150" fill="#ff9b3a"/>`;
const owlBody = `<ellipse cx="120" cy="130" rx="80" ry="90" fill="#a17753"/><circle cx="90" cy="115" r="28" fill="#fff"/><circle cx="150" cy="115" r="28" fill="#fff"/><circle cx="90" cy="115" r="14" fill="#3a2418"/><circle cx="150" cy="115" r="14" fill="#3a2418"/><polygon points="110,135 130,135 120,155" fill="#e8a72d"/><polygon points="55,55 90,75 80,95" fill="#a17753"/><polygon points="185,55 150,75 160,95" fill="#a17753"/>`;
const butterfly = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><ellipse cx="70" cy="90" rx="50" ry="60" fill="#ff80ad"/><ellipse cx="170" cy="90" rx="50" ry="60" fill="#ff80ad"/><ellipse cx="70" cy="160" rx="40" ry="45" fill="#ff3b6b"/><ellipse cx="170" cy="160" rx="40" ry="45" fill="#ff3b6b"/><circle cx="90" cy="90" r="8" fill="#fff7c2"/><circle cx="150" cy="90" r="8" fill="#fff7c2"/><rect x="116" y="50" width="8" height="160" rx="4" fill="#3a2418"/><circle cx="120" cy="48" r="10" fill="#3a2418"/><line x1="120" y1="40" x2="110" y2="15" stroke="#3a2418" stroke-width="4"/><line x1="120" y1="40" x2="130" y2="15" stroke="#3a2418" stroke-width="4"/></svg>`;

const dog    = head('#c89070', dogEars);
const cat    = head('#c5b8ad', catEars);
const panda  = head('#fff',    pandaEars, pandaPatches);
const bear   = head('#a17753', bearEars);
const fox    = head('#f4a755', foxEars, foxExtras);
const rabbit = head('#fff5ee', rabbitEars);
const lion   = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">${lionMane}${lionExtras}<circle cx="120" cy="125" r="70" fill="#f0b85a"/><circle cx="95" cy="115" r="7" fill="#222"/><circle cx="145" cy="115" r="7" fill="#222"/><path d="M105 150 Q120 165 135 150" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
const tiger  = head('#f1a043', '', tigerStripes);
const unicorn = head('#fff', `<polygon points="55,55 95,80 80,110" fill="#d4a3ff"/><polygon points="185,55 145,80 160,110" fill="#d4a3ff"/>`, unicornHorn + `<path d="M40 75 q20 -20 50 0 q20 20 40 0 q20 -20 50 0" stroke="#d4a3ff" stroke-width="8" fill="none"/>`);
const koala  = head('#c4d0d8', koalaEars, koalaNose);
const monkey = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">${monkeyEars}<circle cx="120" cy="125" r="80" fill="#8b5a3a"/>${monkeyFace}<circle cx="100" cy="135" r="7" fill="#222"/><circle cx="140" cy="135" r="7" fill="#222"/><path d="M105 165 Q120 175 135 165" stroke="#222" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
const pig    = head('#ffb6c8', pigEars, pigSnout);
const frog   = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="135" r="80" fill="#73c068"/>${frogEyes}<path d="M85 165 Q120 195 155 165" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
const penguin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">${penguinBody}<circle cx="100" cy="115" r="7" fill="#222"/><circle cx="140" cy="115" r="7" fill="#222"/>${penguinBeak}</svg>`;
const owl    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">${owlBody}</svg>`;

export const ANIMALS_PACK = {
  id: 'animals',
  name: 'Animals',
  stickers: [
    { id: 'animal-dog',       name: 'Dog Face',       svg: dog,       tags: ['dog','puppy','pet'] },
    { id: 'animal-cat',       name: 'Cat Face',       svg: cat,       tags: ['cat','kitty','pet'] },
    { id: 'animal-panda',     name: 'Panda Face',     svg: panda,     tags: ['panda','bear'] },
    { id: 'animal-bear',      name: 'Bear Face',      svg: bear,      tags: ['bear'] },
    { id: 'animal-fox',       name: 'Fox Face',       svg: fox,       tags: ['fox'] },
    { id: 'animal-rabbit',    name: 'Rabbit Face',    svg: rabbit,    tags: ['rabbit','bunny'] },
    { id: 'animal-lion',      name: 'Lion Face',      svg: lion,      tags: ['lion'] },
    { id: 'animal-tiger',     name: 'Tiger Face',     svg: tiger,     tags: ['tiger'] },
    { id: 'animal-unicorn',   name: 'Unicorn Face',   svg: unicorn,   tags: ['unicorn'] },
    { id: 'animal-koala',     name: 'Koala Face',     svg: koala,     tags: ['koala'] },
    { id: 'animal-monkey',    name: 'Monkey Face',    svg: monkey,    tags: ['monkey'] },
    { id: 'animal-pig',       name: 'Pig Face',       svg: pig,       tags: ['pig'] },
    { id: 'animal-frog',      name: 'Frog Face',      svg: frog,      tags: ['frog'] },
    { id: 'animal-penguin',   name: 'Penguin',        svg: penguin,   tags: ['penguin'] },
    { id: 'animal-owl',       name: 'Owl',            svg: owl,       tags: ['owl'] },
    { id: 'animal-butterfly', name: 'Butterfly',      svg: butterfly, tags: ['butterfly'] },
  ],
};
