/**
 * A tiny inline SVG icon set. Avoids pulling in a dependency for the small
 * number of glyphs we actually use.
 */
const paths = {
  cursor: 'M5 3l14 7-6 1-3 7-5-15z',
  image: 'M4 5h16v14H4z M4 16l4-4 3 3 5-5 4 4',
  text: 'M5 6h14M12 6v13M9 19h6',
  square: 'M4 4h16v16H4z',
  circle: 'M12 4a8 8 0 100 16 8 8 0 000-16z',
  line: 'M4 20L20 4',
  arrow: 'M4 12h14m0 0l-4-4m4 4l-4 4',
  label: 'M3 7h13l5 5-5 5H3z M17 12h.01',
  layers: 'M12 3l9 5-9 5-9-5 9-5z M3 14l9 5 9-5 M3 19l9 5 9-5',
  template: 'M4 4h7v7H4z M13 4h7v4h-7z M13 10h7v10h-7z M4 13h7v7H4z',
  download: 'M12 4v12m0 0l-4-4m4 4l4-4 M4 20h16',
  upload: 'M12 20V8m0 0l-4 4m4-4l4 4 M4 4h16',
  save: 'M5 3h11l3 3v15H5z M8 3v6h8V3 M8 13h8v8H8z',
  undo: 'M9 14L4 9l5-5 M4 9h11a5 5 0 010 10H9',
  redo: 'M15 14l5-5-5-5 M20 9H9a5 5 0 000 10h6',
  copy: 'M9 9h11v11H9z M5 5h11v3 M5 5v11h3',
  trash: 'M4 6h16 M9 6V4h6v2 M6 6l1 14h10l1-14',
  lock: 'M6 11h12v9H6z M8 11V8a4 4 0 018 0v3',
  unlock: 'M6 11h12v9H6z M8 11V8a4 4 0 017.5-2',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z M12 9a3 3 0 100 6 3 3 0 000-6z',
  eyeOff: 'M3 3l18 18 M9.88 9.88A3 3 0 0014.12 14.12 M6.5 6.5C4 8 2 12 2 12s4 7 10 7c1.5 0 2.8-.3 4-.8 M17.5 17.5C20 16 22 12 22 12s-4-7-10-7c-1.5 0-2.8.3-4 .8',
  zoomIn: 'M11 4a7 7 0 100 14 7 7 0 000-14z M11 8v6 M8 11h6 M16 16l4 4',
  zoomOut: 'M11 4a7 7 0 100 14 7 7 0 000-14z M8 11h6 M16 16l4 4',
  fit: 'M4 9V4h5 M15 4h5v5 M20 15v5h-5 M9 20H4v-5',
  forward: 'M3 3h14v14H3z M9 9h12v12H9z',
  backward: 'M7 7h14v14H7z M3 3h12v12H3z',
  alignLeft: 'M4 4v16 M4 7h12v4H4 M4 13h8v4H4',
  alignCenter: 'M12 4v16 M6 7h12v4H6 M8 13h8v4H8',
  alignRight: 'M20 4v16 M8 7h12v4H8 M12 13h8v4h-8',
  alignTop: 'M4 4h16 M7 4v12h4V4 M13 4v8h4V4',
  alignMiddle: 'M4 12h16 M7 6v12h4V6 M13 8v8h4V8',
  alignBottom: 'M4 20h16 M7 8v12h4V8 M13 12v8h4v-8',
  sun: 'M12 4v2 M12 18v2 M4 12h2 M18 12h2 M5.6 5.6l1.4 1.4 M17 17l1.4 1.4 M5.6 18.4l1.4-1.4 M17 7l1.4-1.4 M12 8a4 4 0 100 8 4 4 0 000-8z',
  moon: 'M21 13a9 9 0 11-10-10 7 7 0 0010 10z',
  sparkle: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
  plus: 'M12 5v14 M5 12h14',
  minus: 'M5 12h14',
  check: 'M5 12l4 4 10-10',
  x: 'M6 6l12 12 M18 6l-12 12',
  chevronDown: 'M6 9l6 6 6-6',
  chevronUp: 'M6 15l6-6 6 6',
  refresh: 'M3 12a9 9 0 0115-6.7L21 8 M21 3v5h-5 M21 12a9 9 0 01-15 6.7L3 16 M3 21v-5h5'
};

function splitPaths(d) {
  // Split on ' M' boundaries while preserving the M.
  const parts = [];
  let buf = '';
  const tokens = d.split(/\s+/);
  tokens.forEach((tok) => {
    if (tok === 'M' || /^M[\d.-]/.test(tok)) {
      if (buf.trim()) parts.push(buf.trim());
      buf = tok + ' ';
    } else {
      buf += tok + ' ';
    }
  });
  if (buf.trim()) parts.push(buf.trim());
  return parts.length ? parts : [d];
}

export default function Icon({ name, size = 18, className = '', strokeWidth = 1.6, ...rest }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {splitPaths(d).map((seg, i) => <path key={i} d={seg} />)}
    </svg>
  );
}
