// Glitch & Neon frames — RGB split, scanlines, neon glow border.

const RGB_SPLIT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <rect x="-8" y="-8" width="800" height="800" fill="none" stroke="#ff003c" stroke-width="14" opacity="0.7"/>
  <rect x="0" y="0" width="800" height="800" fill="none" stroke="#00f0ff" stroke-width="14" opacity="0.7"/>
  <rect x="8" y="8" width="800" height="800" fill="none" stroke="#00ff64" stroke-width="14" opacity="0.7"/>
  <rect x="0" y="200" width="800" height="6" fill="#ff003c" opacity="0.4"/>
  <rect x="0" y="540" width="800" height="4" fill="#00f0ff" opacity="0.4"/>
</svg>`;

function scanlinesSvg() {
  const lines = [];
  for (let y = 0; y < 800; y += 6) {
    lines.push(`<rect x="0" y="${y}" width="800" height="2" fill="#000" opacity="0.45"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
    <rect x="0" y="0" width="800" height="800" fill="none" stroke="#1a1a1a" stroke-width="10"/>
    ${lines.join('\n')}
    <rect x="0" y="0" width="800" height="800" fill="url(#vg)" opacity="0.5"/>
    <defs>
      <radialGradient id="vg" cx="0.5" cy="0.5" r="0.7">
        <stop offset="0.6" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.8"/>
      </radialGradient>
    </defs>
  </svg>`;
}

const NEON_GLOW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect x="30" y="30" width="740" height="740" rx="30" fill="none" stroke="#ff2bd0" stroke-width="6" filter="url(#glow)"/>
  <rect x="30" y="30" width="740" height="740" rx="30" fill="none" stroke="#ff2bd0" stroke-width="3"/>
  <rect x="18" y="18" width="764" height="764" rx="36" fill="none" stroke="#00f0ff" stroke-width="3" opacity="0.6"/>
</svg>`;

export const GLITCH_NEON_FRAMES_PACK = {
  id: 'glitch-neon',
  name: 'Glitch & Neon',
  frames: [
    {
      id: 'glitch-rgb-split',
      name: 'RGB Split',
      type: 'svg-overlay',
      svg: RGB_SPLIT_SVG,
    },
    {
      id: 'glitch-scanlines',
      name: 'Scanlines',
      type: 'svg-overlay',
      svg: scanlinesSvg(),
    },
    {
      id: 'glitch-neon-glow',
      name: 'Neon Glow Border',
      type: 'svg-overlay',
      svg: NEON_GLOW_SVG,
    },
  ],
};
