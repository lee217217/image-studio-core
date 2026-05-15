import { fadedMatrix, warmMatrix, coolMatrix } from './matrixUtils.js';

// Polaroid — 6 instant film looks. Soft, slightly faded, warm tint.
export const POLAROID_PACK = {
  id: 'polaroid',
  name: 'Polaroid',
  presets: [
    { id: 'polaroid-sx70', name: 'SX-70', desc: 'Vintage instant', swatch: '#d4ab7f',
      brightness: 0.05, contrast: -0.08, saturation: -0.05,
      colorMatrix: fadedMatrix(0.1, 0.22) },
    { id: 'polaroid-600', name: '600', desc: 'Snapshot daylight', swatch: '#e0b886',
      brightness: 0.06, contrast: 0.02, saturation: 0.05,
      colorMatrix: warmMatrix(0.12, 0.04) },
    { id: 'polaroid-spectra', name: 'Spectra', desc: 'Wide format soft', swatch: '#cdb6a0',
      brightness: 0.04, contrast: -0.04, saturation: 0.0,
      colorMatrix: fadedMatrix(0.08, 0.18) },
    { id: 'polaroid-itype', name: 'I-Type', desc: 'Modern Polaroid', swatch: '#dec9aa',
      brightness: 0.04, contrast: 0.0, saturation: 0.05,
      colorMatrix: warmMatrix(0.08, 0.03) },
    { id: 'polaroid-now-plus', name: 'Now+', desc: 'Crisp creamy', swatch: '#e9d2ad',
      brightness: 0.05, contrast: 0.04, saturation: 0.08,
      colorMatrix: warmMatrix(0.1, 0.03) },
    { id: 'polaroid-faded', name: 'Faded Pola', desc: 'Aged photo album', swatch: '#bba792',
      brightness: 0.06, contrast: -0.12, saturation: -0.18,
      colorMatrix: fadedMatrix(0.14, 0.32) },
  ],
};
