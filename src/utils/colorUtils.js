/** Normalize a fabric color value (which may be a Pattern or Gradient) to a hex string. */
export function toHexColor(value, fallback = '#000000') {
  if (typeof value === 'string') {
    if (value.startsWith('#')) return value;
    // Try to parse rgba(...) / rgb(...) into hex
    const m = value.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
      if (parts.length >= 3) {
        return rgbToHex(parts[0], parts[1], parts[2]);
      }
    }
    return value;
  }
  return fallback;
}

export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const v = Math.max(0, Math.min(255, Math.round(n)));
    return v.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
