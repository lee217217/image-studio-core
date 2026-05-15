// Vintage Film frames — 35mm strip, 8mm, slide mount.

function strip35mm() {
  // 16 sprocket holes on each long side
  const holes = [];
  for (let i = 0; i < 16; i++) {
    const y = 60 + i * 45;
    holes.push(`<rect x="20" y="${y}" width="20" height="18" rx="3" fill="#0a0a0a"/>`);
    holes.push(`<rect x="760" y="${y}" width="20" height="18" rx="3" fill="#0a0a0a"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
    <rect x="0" y="0" width="800" height="800" fill="none" stroke="#181818" stroke-width="64"/>
    ${holes.join('\n')}
  </svg>`;
}

const FRAME_8MM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <rect x="0" y="0" width="800" height="800" fill="none" stroke="#221d10" stroke-width="46"/>
  <rect x="46" y="46" width="708" height="708" fill="none" stroke="#5a4a28" stroke-width="3"/>
  <text x="400" y="38" text-anchor="middle" fill="#c9a55a" font-family="monospace" font-size="22" font-weight="700">8mm KODACHROME</text>
  <text x="60" y="780" fill="#c9a55a" font-family="monospace" font-size="18">▶ 1965</text>
  <text x="740" y="780" text-anchor="end" fill="#c9a55a" font-family="monospace" font-size="18">REEL 02</text>
</svg>`;

const SLIDE_MOUNT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <rect x="0" y="0" width="800" height="800" fill="#f0ead5" stroke="#9c8b5a" stroke-width="2"/>
  <rect x="100" y="100" width="600" height="600" fill="none" stroke="#9c8b5a" stroke-width="3"/>
  <rect x="100" y="100" width="600" height="600" fill="#000" fill-opacity="0"/>
  <rect x="0" y="0" width="800" height="100" fill="#f0ead5"/>
  <rect x="0" y="700" width="800" height="100" fill="#f0ead5"/>
  <rect x="0" y="100" width="100" height="600" fill="#f0ead5"/>
  <rect x="700" y="100" width="100" height="600" fill="#f0ead5"/>
  <text x="400" y="62" text-anchor="middle" fill="#5a4f30" font-family="serif" font-size="22" font-style="italic">SLIDE No. 42</text>
  <text x="400" y="760" text-anchor="middle" fill="#5a4f30" font-family="serif" font-size="20">KODAK · PROCESSED</text>
</svg>`;

export const VINTAGE_FILM_FRAMES_PACK = {
  id: 'vintage-film',
  name: 'Vintage Film',
  frames: [
    {
      id: 'vintage-35mm-strip',
      name: '35mm Strip',
      type: 'svg-overlay',
      svg: strip35mm(),
    },
    {
      id: 'vintage-8mm-frame',
      name: '8mm Frame',
      type: 'svg-overlay',
      svg: FRAME_8MM_SVG,
    },
    {
      id: 'vintage-slide-mount',
      name: 'Slide Mount',
      type: 'svg-overlay',
      svg: SLIDE_MOUNT_SVG,
    },
  ],
};
