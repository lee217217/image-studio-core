// Comic frames — halftone dots, action lines, speech burst.

const HALFTONE_DOTS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <pattern id="ht" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="6" fill="#1a1a1a"/>
    </pattern>
  </defs>
  <rect x="0" y="0" width="800" height="800" fill="none" stroke="#1a1a1a" stroke-width="18"/>
  <rect x="18" y="18" width="80" height="80" fill="url(#ht)" opacity="0.85"/>
  <rect x="702" y="18" width="80" height="80" fill="url(#ht)" opacity="0.85"/>
  <rect x="18" y="702" width="80" height="80" fill="url(#ht)" opacity="0.85"/>
  <rect x="702" y="702" width="80" height="80" fill="url(#ht)" opacity="0.85"/>
</svg>`;

const SPEECH_BURST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <rect x="0" y="0" width="800" height="800" fill="none" stroke="#111" stroke-width="14"/>
  <path d="M120 80 L180 60 L220 100 L280 70 L340 110 L400 50 L460 110 L520 70 L580 110 L620 60 L680 100 L740 60 L760 140 L720 180 L760 220 L720 280 L760 340 L720 400 L760 480 L720 540 L760 620 L720 720 L640 760 L560 720 L480 760 L400 720 L320 760 L240 720 L160 760 L80 720 L60 640 L80 560 L40 480 L80 400 L40 320 L80 240 L40 160 Z"
    fill="none" stroke="#111" stroke-width="6" stroke-linejoin="round"/>
  <rect x="320" y="80" width="200" height="80" rx="40" fill="#ffeb3b" stroke="#111" stroke-width="6"/>
</svg>`;

const ACTION_LINES_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <rect x="0" y="0" width="800" height="800" fill="none" stroke="#1a1a1a" stroke-width="14"/>
  <g stroke="#1a1a1a" stroke-width="6" stroke-linecap="round" fill="none">
    <line x1="80" y1="80" x2="200" y2="200"/>
    <line x1="720" y1="80" x2="600" y2="200"/>
    <line x1="80" y1="720" x2="200" y2="600"/>
    <line x1="720" y1="720" x2="600" y2="600"/>
    <line x1="60" y1="400" x2="180" y2="400"/>
    <line x1="620" y1="400" x2="740" y2="400"/>
    <line x1="400" y1="60" x2="400" y2="180"/>
    <line x1="400" y1="620" x2="400" y2="740"/>
  </g>
</svg>`;

export const COMIC_FRAMES_PACK = {
  id: 'comic',
  name: 'Comic',
  frames: [
    {
      id: 'comic-halftone-dots',
      name: 'Halftone Dots',
      type: 'svg-overlay',
      svg: HALFTONE_DOTS_SVG,
    },
    {
      id: 'comic-speech-burst',
      name: 'Speech Burst',
      type: 'svg-overlay',
      svg: SPEECH_BURST_SVG,
      textSlot: { x: 0.525, y: 0.15, w: 0.22, h: 0.08, placeholder: 'POW!', fontSize: 56, fill: '#dc1c2e', fontWeight: 900 },
    },
    {
      id: 'comic-action-lines',
      name: 'Action Lines',
      type: 'svg-overlay',
      svg: ACTION_LINES_SVG,
    },
  ],
};
