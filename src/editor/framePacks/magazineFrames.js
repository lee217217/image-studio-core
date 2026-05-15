// Magazine frames — editorial title bars and glossy borders.
// All 800x800 viewBox. Frames with a `textSlot` will spawn a fabric IText
// placeholder at the configured position when applied.

const COVER_TITLE_BAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <rect x="0" y="0" width="800" height="100" fill="#dc1c2e"/>
  <rect x="0" y="100" width="800" height="6" fill="#ffffff"/>
  <rect x="0" y="0" width="800" height="800" fill="none" stroke="#dc1c2e" stroke-width="14"/>
  <rect x="40" y="34" width="160" height="34" rx="6" fill="#ffffff"/>
</svg>`;

const EDITORIAL_WHITE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <rect x="0" y="0" width="800" height="800" fill="none" stroke="#ffffff" stroke-width="50"/>
  <rect x="50" y="700" width="700" height="50" fill="#ffffff"/>
</svg>`;

const GLOSSY_BLACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <rect x="0" y="0" width="800" height="800" fill="none" stroke="#111111" stroke-width="36"/>
  <rect x="36" y="36" width="728" height="36" fill="url(#g1)"/>
  <defs>
    <linearGradient id="g1" x1="0" x2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>`;

export const MAGAZINE_FRAMES_PACK = {
  id: 'magazine',
  name: 'Magazine',
  frames: [
    {
      id: 'magazine-editorial-white',
      name: 'Editorial White',
      type: 'svg-overlay',
      svg: EDITORIAL_WHITE_SVG,
      textSlot: { x: 0.5, y: 0.92, w: 0.85, h: 0.05, placeholder: 'EDITORIAL TITLE', fontSize: 28, fill: '#111111', fontWeight: 700 },
    },
    {
      id: 'magazine-glossy-black',
      name: 'Glossy Black',
      type: 'svg-overlay',
      svg: GLOSSY_BLACK_SVG,
      textSlot: null,
    },
    {
      id: 'magazine-cover-title',
      name: 'Cover Title Bar',
      type: 'svg-overlay',
      svg: COVER_TITLE_BAR_SVG,
      textSlot: { x: 0.5, y: 0.063, w: 0.7, h: 0.07, placeholder: 'COVER STORY', fontSize: 44, fill: '#ffffff', fontWeight: 900 },
    },
  ],
};
