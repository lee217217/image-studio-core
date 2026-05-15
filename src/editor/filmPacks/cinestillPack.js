import {
  halationFilter,
  tungstenMatrix,
  warmMatrix,
  bwMatrix,
  fadedMatrix,
} from './matrixUtils.js';

// Cinestill — 8 cinematic motion-picture inspired looks.
// 800T is the hero: tungsten night + halation bloom.
export const CINESTILL_PACK = {
  id: 'cinestill',
  name: 'Cinestill',
  presets: [
    { id: 'cinestill-800t', name: '800T Tungsten Glow', desc: 'Neon night + red bloom', swatch: '#3a4d8a',
      brightness: -0.02, contrast: 0.18, saturation: 0.05, blur: 0.04,
      colorMatrix: halationFilter(0.28, 0.04) },
    { id: 'cinestill-50d', name: '50D Daylight', desc: 'Soft daylight cine', swatch: '#d8c9a5',
      brightness: 0.04, contrast: 0.08, saturation: 0.06,
      colorMatrix: warmMatrix(0.1, 0.02) },
    { id: 'cinestill-bwxx', name: 'BWxx', desc: 'Cinematic BW', swatch: '#3f3f3f',
      contrast: 0.28, saturation: -1, colorMatrix: bwMatrix(0, 0, 0) },
    { id: 'cinestill-redrum', name: 'Redrum', desc: 'Crimson halation', swatch: '#a31d28',
      brightness: -0.05, contrast: 0.22, saturation: 0.1, blur: 0.05,
      colorMatrix: halationFilter(0.42, 0.06) },
    { id: 'cinestill-holiday', name: 'Holiday Glow', desc: 'Cozy string lights', swatch: '#e6a14a',
      brightness: 0.02, contrast: 0.12, saturation: 0.12, blur: 0.03,
      colorMatrix: halationFilter(0.2, 0.03) },
    { id: 'cinestill-night-mode', name: 'Night Mode', desc: 'Cool urban dusk', swatch: '#2a3656',
      brightness: -0.04, contrast: 0.16, saturation: 0.0,
      colorMatrix: tungstenMatrix(0.3, 0.04) },
    { id: 'cinestill-halo-bloom', name: 'Halo Bloom', desc: 'Soft highlight halo', swatch: '#f1d9b3',
      brightness: 0.05, contrast: 0.04, saturation: 0.04, blur: 0.06,
      colorMatrix: halationFilter(0.16, 0.02) },
    { id: 'cinestill-vintage-cine', name: 'Vintage Cine', desc: 'Faded vintage stock', swatch: '#b7a07a',
      brightness: 0.02, contrast: -0.06, saturation: -0.1,
      colorMatrix: fadedMatrix(0.08, 0.25) },
  ],
};
