import { bwMatrix } from './matrixUtils.js';

// Ilford — 5 BW film stocks, all desaturated with luminance-based matrix and
// varying contrast / noise to differentiate grain & tonality.
export const ILFORD_PACK = {
  id: 'ilford',
  name: 'Ilford',
  presets: [
    { id: 'ilford-hp5', name: 'HP5+', desc: 'Pushable BW grain', swatch: '#4a4a4a',
      contrast: 0.2, saturation: -1, noise: 0.08,
      colorMatrix: bwMatrix(0, 0, 0) },
    { id: 'ilford-fp4', name: 'FP4+', desc: 'Fine-grain BW', swatch: '#5a5a5a',
      contrast: 0.16, saturation: -1, colorMatrix: bwMatrix(0, 0, 0) },
    { id: 'ilford-delta-400', name: 'Delta 400', desc: 'Modern T-grain BW', swatch: '#525252',
      contrast: 0.22, saturation: -1, noise: 0.05,
      colorMatrix: bwMatrix(0, 0, 0) },
    { id: 'ilford-delta-3200', name: 'Delta 3200', desc: 'High-ISO grainy BW', swatch: '#3a3a3a',
      contrast: 0.28, saturation: -1, noise: 0.18, brightness: 0.02,
      colorMatrix: bwMatrix(0, 0, 0) },
    { id: 'ilford-xp2-super', name: 'XP2 Super', desc: 'Chromogenic warm BW', swatch: '#5e5448',
      contrast: 0.18, saturation: -1, colorMatrix: bwMatrix(0.04, 0.02, -0.02) },
  ],
};
