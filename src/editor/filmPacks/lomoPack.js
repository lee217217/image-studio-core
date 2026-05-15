import {
  crossProcessMatrix,
  redscaleMatrix,
  warmMatrix,
  magentaMatrix,
  greenMatrix,
} from './matrixUtils.js';

// Lomography — 8 punchy, saturated, slightly off-balance looks.
export const LOMO_PACK = {
  id: 'lomo',
  name: 'Lomo',
  presets: [
    { id: 'lomo-100', name: 'Lomo 100', desc: 'Punchy bright everyday', swatch: '#3aa18a',
      brightness: 0.04, contrast: 0.14, saturation: 0.28, vibrance: 0.18,
      colorMatrix: crossProcessMatrix(0.2) },
    { id: 'lomo-400', name: 'Lomo 400', desc: 'Saturated daylight', swatch: '#e08a3a',
      contrast: 0.16, saturation: 0.32, vibrance: 0.2,
      colorMatrix: crossProcessMatrix(0.25) },
    { id: 'lomo-redscale', name: 'Redscale', desc: 'Crimson dreamy', swatch: '#a3411f',
      brightness: -0.02, contrast: 0.16, saturation: 0.15,
      colorMatrix: redscaleMatrix(0.55) },
    { id: 'lomo-xpro-slide', name: 'X-Pro Slide', desc: 'Cross-processed slide', swatch: '#2da870',
      contrast: 0.22, saturation: 0.3, vibrance: 0.15,
      colorMatrix: crossProcessMatrix(0.35) },
    { id: 'lomo-color-splash', name: 'Color Splash', desc: 'Toy-cam pop', swatch: '#e84a8a',
      brightness: 0.03, contrast: 0.12, saturation: 0.4, vibrance: 0.25,
      colorMatrix: magentaMatrix(0.2) },
    { id: 'lomo-diana', name: 'Diana', desc: 'Soft, dreamy Diana F+', swatch: '#9bb88c',
      brightness: 0.05, contrast: -0.04, saturation: 0.1, blur: 0.04,
      colorMatrix: greenMatrix(0.12) },
    { id: 'lomo-lca-crossed', name: 'LCA Crossed', desc: 'Strong shadow tunnel', swatch: '#5d6e4a',
      contrast: 0.24, saturation: 0.2,
      colorMatrix: crossProcessMatrix(0.3) },
    { id: 'lomo-sprocket', name: 'Sprocket Rocket', desc: 'Wide warm panorama', swatch: '#d49a5f',
      brightness: 0.04, contrast: 0.08, saturation: 0.18,
      colorMatrix: warmMatrix(0.2, 0.02) },
  ],
};
