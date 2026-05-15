import { warmMatrix, magentaMatrix, bwMatrix } from './matrixUtils.js';

// Agfa — 5 European consumer film + classic BW looks.
export const AGFA_PACK = {
  id: 'agfa',
  name: 'Agfa',
  presets: [
    { id: 'agfa-vista-200', name: 'Vista 200', desc: 'Warm everyday', swatch: '#e3a86a',
      brightness: 0.04, contrast: 0.06, saturation: 0.12,
      colorMatrix: warmMatrix(0.16, 0.02) },
    { id: 'agfa-vista-400', name: 'Vista 400', desc: 'Saturated reds', swatch: '#d7714a',
      contrast: 0.12, saturation: 0.22, vibrance: 0.15,
      colorMatrix: warmMatrix(0.22, 0.02) },
    { id: 'agfa-ultra-100', name: 'Ultra 100', desc: 'High-sat slide', swatch: '#bf5c8f',
      contrast: 0.14, saturation: 0.3, vibrance: 0.2,
      colorMatrix: magentaMatrix(0.18) },
    { id: 'agfa-apx-bw', name: 'APX BW', desc: 'Classic mid-tone BW', swatch: '#4f4f4f',
      contrast: 0.2, saturation: -1, colorMatrix: bwMatrix(0, 0, 0) },
    { id: 'agfa-scala-bw', name: 'Scala BW', desc: 'Silver-rich BW slide', swatch: '#3a3a3a',
      contrast: 0.32, saturation: -1, colorMatrix: bwMatrix(0.02, 0.02, 0.02) },
  ],
};
