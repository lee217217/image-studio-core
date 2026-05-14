// Speech bubbles pack — 8 outlined bubble shapes (240x240). Original artwork.

const speechLeft = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M40 50 h160 a20 20 0 0 1 20 20 v90 a20 20 0 0 1 -20 20 h-110 l-40 35 v-35 h-10 a20 20 0 0 1 -20 -20 v-90 a20 20 0 0 1 20 -20Z" fill="#fff" stroke="#222" stroke-width="6" stroke-linejoin="round"/></svg>`;
const speechRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M200 50 h-160 a20 20 0 0 0 -20 20 v90 a20 20 0 0 0 20 20 h110 l40 35 v-35 h10 a20 20 0 0 0 20 -20 v-90 a20 20 0 0 0 -20 -20Z" fill="#fff" stroke="#222" stroke-width="6" stroke-linejoin="round"/></svg>`;
const thought = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M50 80 a40 40 0 0 1 50 -30 a40 40 0 0 1 80 5 a35 35 0 0 1 30 50 a30 30 0 0 1 -50 25 a40 40 0 0 1 -80 -5 a35 35 0 0 1 -30 -45Z" fill="#fff" stroke="#222" stroke-width="6" stroke-linejoin="round"/><circle cx="80" cy="180" r="14" fill="#fff" stroke="#222" stroke-width="5"/><circle cx="55" cy="210" r="9" fill="#fff" stroke="#222" stroke-width="4"/></svg>`;
const cloud = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M50 150 a40 40 0 0 1 30 -65 a45 45 0 0 1 85 0 a40 40 0 0 1 50 30 a35 35 0 0 1 -30 60 h-105 a35 35 0 0 1 -30 -25Z" fill="#fff" stroke="#222" stroke-width="6" stroke-linejoin="round"/></svg>`;
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M30 50 h180 v110 h-110 l-40 35 v-35 h-30Z" fill="#fff" stroke="#222" stroke-width="6" stroke-linejoin="round"/></svg>`;
const explosion = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><polygon points="120,15 145,55 200,40 180,90 230,110 175,135 210,180 150,170 145,225 115,180 80,220 75,165 25,180 55,135 10,110 60,90 40,40 95,55" fill="#ffd93b" stroke="#222" stroke-width="5" stroke-linejoin="round"/></svg>`;
const dotted = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M40 50 h160 a20 20 0 0 1 20 20 v90 a20 20 0 0 1 -20 20 h-110 l-40 35 v-35 h-10 a20 20 0 0 1 -20 -20 v-90 a20 20 0 0 1 20 -20Z" fill="#fff" stroke="#222" stroke-width="5" stroke-dasharray="8 8" stroke-linejoin="round"/></svg>`;
const banner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="M20 90 L40 70 L200 70 L220 90 L200 110 L220 130 L200 150 L40 150 L20 130 L40 110Z" fill="#ff3b6b" stroke="#c41f4d" stroke-width="5" stroke-linejoin="round"/><path d="M40 70 L20 50 L20 90Z" fill="#c41f4d"/><path d="M200 150 L220 170 L220 130Z" fill="#c41f4d"/></svg>`;

export const SPEECH_PACK = {
  id: 'speech',
  name: 'Speech',
  stickers: [
    { id: 'speech-left',      name: 'Speech Left',   svg: speechLeft,  tags: ['speech','bubble','left'] },
    { id: 'speech-right',     name: 'Speech Right',  svg: speechRight, tags: ['speech','bubble','right'] },
    { id: 'speech-thought',   name: 'Thought',       svg: thought,     tags: ['thought','think','cloud'] },
    { id: 'speech-cloud',     name: 'Cloud',         svg: cloud,       tags: ['cloud','speech'] },
    { id: 'speech-square',    name: 'Square',        svg: square,      tags: ['square','bubble'] },
    { id: 'speech-explosion', name: 'Explosion',     svg: explosion,   tags: ['burst','explosion','pow'] },
    { id: 'speech-dotted',    name: 'Dotted',        svg: dotted,      tags: ['dotted','dashed'] },
    { id: 'speech-banner',    name: 'Banner',        svg: banner,      tags: ['banner','ribbon'] },
  ],
};
