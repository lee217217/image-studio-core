// Hearts pack — 12 original flat vector heart stickers. All SVGs are designed
// in-house (no Twemoji / no copyrighted assets). 240x240 viewBox.

const HEART_PATH =
  'M120 210 C 60 170, 20 130, 20 85 C 20 55, 45 32, 75 32 C 95 32, 110 42, 120 60 C 130 42, 145 32, 165 32 C 195 32, 220 55, 220 85 C 220 130, 180 170, 120 210 Z';

function basicHeart(fill, stroke = 'none') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="${HEART_PATH}" fill="${fill}" stroke="${stroke}" stroke-width="6" stroke-linejoin="round"/></svg>`;
}

const sparklingHeart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
<path d="${HEART_PATH}" fill="#ff3b6b"/>
<path d="M60 60 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 l12 -4 z" fill="#fff7c2"/>
<path d="M180 50 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" fill="#fff7c2"/>
<path d="M180 150 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" fill="#fff7c2"/>
</svg>`;

const twoHearts = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
<g transform="translate(40 60) scale(0.6)"><path d="${HEART_PATH}" fill="#ff80ad"/></g>
<g transform="translate(80 20) scale(0.75)"><path d="${HEART_PATH}" fill="#ff3b6b"/></g>
</svg>`;

const heartArrow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
<path d="${HEART_PATH}" fill="#ff3b6b"/>
<line x1="20" y1="60" x2="220" y2="180" stroke="#6b4a2a" stroke-width="10" stroke-linecap="round"/>
<path d="M210 165 L230 180 L210 195 Z" fill="#6b4a2a"/>
<path d="M30 75 L10 60 L30 45 Z" fill="#fff5d1" stroke="#6b4a2a" stroke-width="6" stroke-linejoin="round"/>
</svg>`;

const brokenHeart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
<path d="M120 210 C 60 170, 20 130, 20 85 C 20 55, 45 32, 75 32 C 95 32, 110 42, 115 60 L 100 100 L 130 130 L 105 160 L 120 210 Z" fill="#ff3b6b"/>
<path d="M120 210 C 180 170, 220 130, 220 85 C 220 55, 195 32, 165 32 C 145 32, 130 42, 125 60 L 140 100 L 110 130 L 135 160 L 120 210 Z" fill="#ff6e8a"/>
</svg>`;

export const HEARTS_PACK = {
  id: 'hearts',
  name: 'Hearts',
  stickers: [
    { id: 'heart-red',          name: 'Red Heart',        svg: basicHeart('#ff3b6b'), tags: ['love','heart','red'] },
    { id: 'heart-pink',         name: 'Pink Heart',       svg: basicHeart('#ff80ad'), tags: ['heart','pink'] },
    { id: 'heart-blue',         name: 'Blue Heart',       svg: basicHeart('#3b8eff'), tags: ['heart','blue'] },
    { id: 'heart-purple',       name: 'Purple Heart',     svg: basicHeart('#9b5cff'), tags: ['heart','purple'] },
    { id: 'heart-green',        name: 'Green Heart',      svg: basicHeart('#34c759'), tags: ['heart','green'] },
    { id: 'heart-yellow',       name: 'Yellow Heart',     svg: basicHeart('#ffd93b'), tags: ['heart','yellow'] },
    { id: 'heart-black',        name: 'Black Heart',      svg: basicHeart('#222'),    tags: ['heart','black'] },
    { id: 'heart-white',        name: 'White Heart',      svg: basicHeart('#fff', '#cbd5e1'), tags: ['heart','white'] },
    { id: 'heart-sparkling',    name: 'Sparkling Heart',  svg: sparklingHeart, tags: ['heart','sparkle'] },
    { id: 'heart-two',          name: 'Two Hearts',       svg: twoHearts,      tags: ['heart','love','two'] },
    { id: 'heart-with-arrow',   name: 'Heart with Arrow', svg: heartArrow,     tags: ['heart','arrow','cupid'] },
    { id: 'heart-broken',       name: 'Broken Heart',     svg: brokenHeart,    tags: ['heart','broken','sad'] },
  ],
};
